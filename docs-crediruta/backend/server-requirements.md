# Requisitos del servidor dedicado — Backend CrediRuta

Este documento define **qué debe existir en el servidor dedicado** para que la app móvil
funcione en modo cloud (colaboración multiusuario, sync y suscripciones). La app opera
offline-first: el backend es la **autoridad** en identidad, membresías, movimientos
financieros compartidos y billing (MR-NF-007, doc 23).

> Estado: especificación. El backend se desarrolla como proyecto separado; la app ya
> define los puertos y el contrato que consumirá (`api-contract.md`).

## 1. Resumen de piezas

| Pieza | Recomendación | Propósito | Prioridad |
|---|---|---|---|
| SO | Ubuntu Server 24.04 LTS | Base estable con soporte largo | P0 |
| Contenedores | Docker + Docker Compose | Despliegue reproducible, staging = prod | P0 |
| Reverse proxy + TLS | Caddy (o Nginx + certbot) | HTTPS en `api.crediruta.online` y `api-staging.crediruta.online` | P0 |
| API | Monolito modular REST (**NestJS + TypeScript** recomendado; alternativa: Spring Boot) | Reglas de autorización, sync, billing | P0 |
| Base de datos | **PostgreSQL 16** | Datos operativos multi-tenant, transaccional | P0 |
| Identidad | Firebase Auth (verificación de ID tokens en la API) | Login email/password; el proyecto Firebase actual es SOLO dev (Q-B03) | P0 |
| Almacén de objetos | MinIO (S3-compatible) o filesystem + backup | Fotos de clientes/rutas, exports | P1 |
| Cola de trabajos | Redis + BullMQ (o pg-boss sobre PostgreSQL) | Webhooks Wompi, jobs de sync/reportes | P1 |
| Webhook Wompi | Endpoint firmado + tabla de eventos | Suscripciones (Q-B09) | P1 |
| Observabilidad | Logs estructurados JSON + Prometheus/Grafana + Sentry o GlitchTip | Errores y métricas sin PII | P1 |
| Backups | pg_dump diario + copia offsite + restore probado | MR-NF-016 | P0 |

## 2. Base de datos (PostgreSQL)

- Una base `crediruta` por ambiente (staging/producción **separados**).
- Todas las tablas operativas llevan `organization_id` (tenant) + índices compuestos
  `(organization_id, ...)`. Row Level Security opcional pero recomendada.
- Tablas espejo del modelo local (ver `api-contract.md`): organizations, users,
  memberships, invitations, routes, route_assignments, customers, customer_route,
  loans, loan_movements, payments, cash_sessions, cash_movements, expenses, boletas,
  closures (+ closure_versions), visits, media_manifest, subscriptions,
  subscription_payments, wompi_events, sync_log.
- **Movimientos financieros append-only** con `idempotency_key UNIQUE` — un reintento
  del outbox nunca duplica un pago (MR-NF-002).
- Timestamps en UTC (`timestamptz`); `operational_date` como `date` + zona del negocio
  (`America/Bogota`).
- Migraciones versionadas (Prisma Migrate / Flyway / Liquibase según stack elegido).

## 3. API (contrato resumido — detalle en api-contract.md)

- REST JSON versionada bajo `/v1`, documentada con **OpenAPI**.
- Auth: `Authorization: Bearer <Firebase ID token>` verificado server-side; la API
  resuelve `userId → memberships` y **aplica autorización por organización y rol en cada
  endpoint** (nunca confía en el cliente, PERM-003 del legacy).
- Endpoints idempotentes para mutaciones (header `Idempotency-Key`).
- Sync: `POST /v1/sync/push` (lote de eventos outbox) y `GET /v1/sync/pull?cursor=`
  (cambios incrementales por entidad con versiones y tombstones).
- Errores tipados `{code, message, details}` alineados con las `Failure` de la app.
- Paginación por cursor en listados.
- Rate limiting por token/IP; CORS cerrado (la app es nativa).

## 4. Suscripciones y Wompi (Q-B08/Q-B09)

- La app **no** maneja dinero de clientes finales; Wompi solo cobra la suscripción de
  CrediRuta a las organizaciones.
- Modelo provisional: modo local gratuito; plan cloud cobrado principalmente **por número
  de rutas** (niveles y precios pendientes — open-questions).
- Flujo: la API crea la orden → checkout web de Wompi → **webhook firmado**
  (`POST /v1/webhooks/wompi`, validando `X-Event-Checksum` con el secreto de eventos) →
  registra evento idempotente → actualiza `subscriptions.entitlement` → la app consulta
  entitlement en sync/login.
- Nunca activar entitlement desde el cliente (el legacy lo hacía con un simulador — BR-SUB-003).
- Guardar todos los eventos crudos en `wompi_events` para reconciliación y reembolsos.

## 5. Seguridad

- TLS obligatorio (Caddy automatiza Let's Encrypt); HSTS.
- Secretos en variables de entorno/secret manager del servidor; nunca en el repo.
- Firewall (ufw): solo 80/443 + SSH con llaves; fail2ban.
- La API es la única con acceso a PostgreSQL (red interna de Docker).
- Sin PII en logs (MR-NF-015); IDs de correlación por request.
- Auditoría financiera en tablas (`*_movements`, `closure_versions`), separada de logs.
- Backups cifrados en reposo si contienen PII; retención definida con el cliente (Q-I11).

## 6. Observabilidad y operación

- Health checks `/healthz` (liveness) y `/readyz` (DB/cola) para el proxy y monitoreo.
- Logs JSON con rotación; opcional Loki.
- Métricas mínimas: latencia por endpoint, errores 5xx, tamaño de cola, lag de sync,
  webhooks fallidos, conexiones DB.
- Eventos de negocio a registrar (MR observabilidad): auth, apertura/cierre de caja,
  pago/desembolso/ajuste/reverso, sync push/pull/conflicto, webhook suscripción,
  autorización denegada.
- Alertas básicas (disco, 5xx, backup fallido) por correo/Telegram.

## 7. Ambientes y despliegue

```text
producción   api.crediruta.online          → docker compose (api, postgres, redis, minio, caddy)
staging      api-staging.crediruta.online  → mismo compose con .env distinto y DB separada
```

- Deploy reproducible: imagen versionada por tag git; rollback = tag anterior.
- Migraciones DB ejecutadas de forma controlada antes del switch (zero/low downtime).
- El proyecto Firebase existente se usa **solo como IdP y entorno de pruebas** (Q-B03);
  ningún dato operativo de producción vive en Firestore.

## 8. Dimensionamiento inicial

Para las cargas esperadas (decenas de organizaciones, miles de clientes/pagos):

- 4 vCPU / 8 GB RAM / 100 GB SSD son suficientes para API+DB+Redis+MinIO en un solo host.
- PostgreSQL con `shared_buffers` ~2 GB; monitorear antes de escalar.
- Si el host es compartido con otros servicios, aislar con límites de recursos en compose.

## 9. Checklist de aprovisionamiento

- [ ] Ubuntu 24.04 + Docker + Compose
- [ ] DNS `api.crediruta.online` y `api-staging.crediruta.online` → servidor (Hostinger, Q-B04)
- [ ] Caddy con TLS automático
- [ ] PostgreSQL 16 con usuario/DB por ambiente + backups diarios probados
- [ ] Redis (cola) y MinIO (media) si aplica en la fase
- [ ] Proyecto API con OpenAPI, migraciones y CI
- [ ] Firebase: proyecto actual marcado como dev; crear proyecto NUEVO para producción de identidad
- [ ] Credenciales Wompi sandbox (llaves pub/priv + secreto de eventos) en staging
- [ ] Monitoreo + alertas mínimas
- [ ] Runbook de restore de backup ensayado
