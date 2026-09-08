# Prompt de arranque para la sesión SSH del servidor dedicado

Copia todo el bloque siguiente como primer mensaje de una sesión de Claude Code
conectada por SSH al servidor. Es autocontenido: no asume acceso al repo local.

---

Estás conectado por SSH al servidor dedicado de CrediRuta. Trabaja de forma autónoma, por fases, con commit al cerrar cada fase. Tu misión: dejar el servidor aprovisionado y un repositorio git del backend (`crediruta-api`) funcionando de punta a punta en modo staging, listo para que yo lo conecte manualmente a GitHub (NO configures remotes, NO hagas push, NO crees repos en GitHub).

CONTEXTO DEL PRODUCTO
CrediRuta es una app Flutter Android offline-first de gestión de cartera de microcrédito en rutas de cobro (Colombia, es_CO). La app ya existe y funciona 100 % local; este backend será la autoridad central para: identidad/membresías, sincronización de datos entre dispositivos, y suscripciones. Multi-tenant por ORGANIZACIÓN: todo dato operativo lleva organization_id y la autorización se decide server-side por membresía y rol (adminPrincipal | coadmin | cobrador). El dominio autorizado es crediruta.online (DNS en Hostinger; los subdominios api.crediruta.online y api-staging.crediruta.online pueden no estar apuntados aún: deja la config lista y no falles por eso).

REGLAS DE NEGOCIO INNEGOCIABLES (el modelo debe respetarlas)
- Dinero: COP entero (sin centavos), columnas integer/bigint. Nunca float.
- Ledger append-only: pagos, desembolsos, retaques, recargos, descuentos y reversos son MOVIMIENTOS inmutables (loan_movements, cash_movements); los saldos se derivan. Nada financiero se borra ni edita: se revierte con un movimiento nuevo.
- Idempotencia: todo movimiento trae idempotency_key UNIQUE generada por el cliente; un reintento no duplica jamás un pago.
- IDs: UUID v4 generados por el CLIENTE (offline-first); el servidor valida unicidad.
- Caja diaria (cash_sessions): única por (organization_id, collector_user_id, route_id, operational_date). operational_date es date (zona America/Bogota); timestamps de auditoría en timestamptz UTC.
- Cierres: cada envío/aprobación/reapertura crea una closure_version inmutable (consecutivo por sesión) con actor, timestamp y snapshot de cifras (counted_cash, expected_delivery, discrepancy). Fórmula: expected_delivery = cobrado + boletas − gastos − prestado.
- Boleta: cobro único por cliente (UNIQUE customer_id), separado del préstamo.
- Clientes y rutas NO se borran físicamente: archived_at (tombstone para sync).
- Auditoría: todo ajuste financiero registra actor, fecha, valor y motivo.

FASE 1 — Inventario y aprovisionamiento (no rompas nada existente)
1. Inventaría el servidor: SO/versión, CPU/RAM/disco, puertos escuchando, servicios/containers existentes, si hay Docker/git/firewall. Repórtalo antes de instalar.
2. Instala/verifica: git, Docker Engine + Compose plugin, ufw (permitir solo SSH, 80, 443) y fail2ban. Si ya hay un firewall o panel gestionándolo, respétalo y repórtalo en lugar de duplicar reglas.
3. No expongas ningún servicio nuevo fuera de localhost hasta que Caddy con TLS esté delante.

FASE 2 — Repositorio crediruta-api (en /opt/crediruta/api o el home del usuario si /opt no es viable)
Stack: NestJS + TypeScript estricto + Prisma + PostgreSQL 16 + Redis (BullMQ) en Docker Compose. Estructura de monolito modular: modules/ auth, organizations, memberships, invitations, routes, customers, loans, payments, cash, closures, boletas, expenses, visits, sync, subscriptions, media, health. Incluye:
- docker-compose.yml (api, postgres16, redis, caddy) + docker-compose.staging.yml y docker-compose.prod.yml con .env por ambiente (.env.example versionado; secretos reales NUNCA en git). DBs separadas por ambiente.
- Caddyfile con api.crediruta.online → prod y api-staging.crediruta.online → staging (TLS automático cuando el DNS apunte).
- Migración Prisma inicial con el modelo: organizations(id, name, created_at, default_interest_rate, default_installments, default_frequency, default_boleta_value), users(id=uid del IdP, email, display_name), memberships(id, organization_id, user_id, display_name, role, status, created_at, revoked_at, UNIQUE(org,user)), invitations(id, organization_id, code, role, issuer_user_id, created_at, expires_at, used_at, used_by, UNIQUE(org,code)), routes(id, organization_id, name, frequency, description, assigned_collector_id, created_at, archived_at), customers(id, organization_id, route_id, name, address, cedula, phone, lat, lng, location_source, photo_media_id, visit_weekday, order_index, created_at, archived_at), loans(id, organization_id, customer_id, route_id, product, interest_rate, frequency, installments_count, disbursed_at, manual_installment_value), loan_movements(id, loan_id, type[disbursement|payment|retaque|surcharge|discount|reversal|openingBalance], amount, at, actor_user_id, note, reversed_movement_id, cash_session_id, idempotency_key UNIQUE), cash_sessions(id, organization_id, collector_user_id, route_id, operational_date, status[open|submitted|approved|reopened], opened_at, counted_cash, UNIQUE clave natural), cash_movements(id, cash_session_id, kind[collection|disbursement|expense|boleta|reversal], amount, at, actor_user_id, note, loan_movement_id, expense_id, boleta_id, reversed_movement_id, idempotency_key UNIQUE), expenses, boletas(customer_id UNIQUE), visits, closure_versions(id, cash_session_id, version, action[submitted|approved|reopened], actor_user_id, at, counted_cash, expected_delivery, discrepancy, note, UNIQUE(session,version)), subscriptions, subscription_payments, wompi_events(payload crudo + idempotencia), sync_log, media_manifest. Índices compuestos por (organization_id, …) en todas las operativas.
- API REST /v1 con OpenAPI (Swagger en /docs solo staging): auth/session (verificación de ID token de Firebase con firebase-admin; deja un AuthProvider intercambiable y un modo dev con token firmado local para poder probar sin Firebase), CRUD scoped por organización de routes/customers/loans/payments/cash-sessions/expenses/boletas/closures (closures con POST /:id/approve y /:id/reopen con motivo obligatorio; payments con POST /:id/reverse; nunca DELETE físico), invitations (generar + redeem transaccional de un solo uso), sync: POST /v1/sync/push (lote de eventos con idempotency_key → por evento applied|duplicate|conflict|rejected) y GET /v1/sync/pull?orgId=&cursor= (cambios incrementales + tombstones + nextCursor), webhooks/wompi (verificación de checksum del evento, almacenamiento idempotente en wompi_events, actualización de entitlement; sandbox), health: /healthz y /readyz.
- Guard central de autorización: organización + rol en cada endpoint (cobrador solo sus rutas asignadas). Errores JSON {code, message, details, requestId} con códigos VALIDATION_FAILED, AUTHORIZATION_DENIED, NOT_FOUND, CONFLICT, IDEMPOTENT_REPLAY, ENTITLEMENT_REQUIRED, INTERNAL.
- Logs estructurados JSON sin PII, requestId por petición, rate limiting básico.
- Tests: unit de servicios financieros (idempotencia de movimientos, unicidad de caja, versiones de cierre) + e2e de un flujo completo (crear org → invitar → canjear → ruta → cliente → préstamo → pago idempotente → cierre → aprobar) contra Postgres de test. CI en .github/workflows/ci.yml (lint, build, test) listo para cuando conecte GitHub.
- README.md con arquitectura, comandos, runbook de deploy/rollback/backup-restore, y docs/decisions.md con toda decisión que tomes.

FASE 3 — Verificación end-to-end en staging
Levanta docker compose staging, corre migraciones, ejecuta la suite completa y prueba con curl el flujo feliz + un replay de idempotencia + un 403 de autorización. Configura backup diario de Postgres (pg_dump a carpeta con rotación 14 días vía cron/systemd timer) y PRUEBA un restore. Deja todo corriendo en staging (prod definido pero apagado).

REPORTE FINAL: inventario del servidor, qué instalaste, estructura del repo, endpoints implementados, resultado de tests/CI, cómo conecto la app móvil (URL staging + cómo emitir un token dev), y pendientes. Recuerda: nada de remotes de git ni push; yo conectaré GitHub manualmente. Los documentos canónicos server-requirements.md y api-contract.md llegarán cuando vincule los repos; si encuentras conflicto entre este prompt y tu criterio, documenta la decisión en docs/decisions.md.

---
