# 22. Requisitos para la reconstrucción

## Principio

La nueva aplicación debe preservar la intención validada, no copiar defectos AS-IS. Todo requisito marcado “pendiente” depende de [21-client-questions.md](21-client-questions.md).

## Requisitos funcionales

### Identidad y organización

| ID | Requisito |
|---|---|
| MR-FUN-001 | Autenticar por proveedores aprobados sin acoplar dominio a Firebase |
| MR-FUN-002 | Restaurar sesión con estado loading/error y perfil cacheado seguro |
| MR-FUN-003 | Modelar Empresa y Membresía separadas de Usuario |
| MR-FUN-004 | Roles/entitlements solo modificables por servicio autorizado |
| MR-FUN-005 | Invitar y canjear membresía de un uso, con rol, issuer, TTL y auditoría |
| MR-FUN-006 | Revocar membresía con política offline definida |
| MR-FUN-007 | Separar preview de rol e impersonación real |
| MR-FUN-008 | Aplicar política única de verificación de correo |

### Rutas y operación

| ID | Requisito |
|---|---|
| MR-FUN-009 | CRUD/archivo de rutas con integridad de cartera |
| MR-FUN-010 | Asignación exclusiva o política aprobada de cobradores |
| MR-FUN-011 | Estado de ruta derivado de una máquina coherente |
| MR-FUN-012 | Acceso del cobrador limitado a asignaciones |
| MR-FUN-013 | Selección de ruta por usuario, persistente y validada |
| MR-FUN-014 | Visita como entidad con jornada, resultado, nota, hora y actor |
| MR-FUN-015 | Orden de recorrido canónico/manual/optimizado según decisión |
| MR-FUN-016 | Mapa/GPS con origen/calidad de coordenada y errores explícitos |

### Clientes, préstamos y pagos

| ID | Requisito |
|---|---|
| MR-FUN-017 | Cliente con identidad/unicidad aprobada y asignación a rutas |
| MR-FUN-018 | Foto/adjunto con ID portable y almacenamiento gestionado |
| MR-FUN-019 | Historial auditable de dirección/riesgo/estado |
| MR-FUN-020 | Varios préstamos según política aprobada |
| MR-FUN-021 | Contrato de interés, cuota y calendario explícito |
| MR-FUN-022 | Valor fijo como producto coherente |
| MR-FUN-023 | Importación de cartera mediante saldo inicial o historial |
| MR-FUN-024 | Pago idempotente con obligación, actor, método, fecha y caja |
| MR-FUN-025 | Política explícita de sobrepago y distribución |
| MR-FUN-026 | Retaque, recargo, descuento y reverso como movimientos |
| MR-FUN-027 | Recibo y auditoría de pago |

### Caja y cierre

| ID | Requisito |
|---|---|
| MR-FUN-028 | CajaDiaria identificada por tenant, cobrador y fecha operativa |
| MR-FUN-029 | Todo pago/desembolso/gasto impacta caja en transacción lógica |
| MR-FUN-030 | Entrega/descuadre con fórmula aprobada |
| MR-FUN-031 | Definir boleta y su ledger/reparto |
| MR-FUN-032 | Cierre draft→enviado→aprobado→reabierto/ajustado |
| MR-FUN-033 | Cierre crea snapshot/version histórica |
| MR-FUN-034 | Modificación posterior invalida/reversiona aprobación |
| MR-FUN-035 | Permisos por rol/miembro aplicados antes de entregar datos |

### Reportes, ajustes y respaldo

| ID | Requisito |
|---|---|
| MR-FUN-036 | KPIs con fórmula, período y scope documentados |
| MR-FUN-037 | Reportes de caja/cartera/cobranza separados o explícitos |
| MR-FUN-038 | Rango temporal uniforme e inclusividad correcta |
| MR-FUN-039 | Exportación autorizada y versionada |
| MR-FUN-040 | Backup por tenant, cifrado, validado y con manifest de medios |
| MR-FUN-041 | Restore con preview/confirmación y rollback |
| MR-FUN-042 | Reset limpia disco, memoria, cache y outbox según alcance |
| MR-FUN-043 | Tema claro/oscuro/sistema |
| MR-FUN-044 | Demo reproducible, aislada y sin acceso a backup real |

## Requisitos no funcionales

| ID | Categoría | Requisito |
|---|---|---|
| MR-NF-001 | Offline | Operaciones aprobadas funcionan offline y se encolan |
| MR-NF-002 | Sync | Idempotencia, versiones, tombstones y conflictos explícitos |
| MR-NF-003 | Atomicidad | Cartera y caja no pueden quedar parcialmente aplicadas |
| MR-NF-004 | Rendimiento | Miles de clientes/pagos sin reserializar todo el dataset |
| MR-NF-005 | Seguridad | Cifrado local y en tránsito; claves en almacén seguro |
| MR-NF-006 | Privacidad | Minimización/consentimiento para PII/GPS/terceros |
| MR-NF-007 | Autorización | Backend y cliente aplican la misma política |
| MR-NF-008 | Auditoría | Actor, timestamp, origen y correlación para finanzas |
| MR-NF-009 | Accesibilidad | WCAG relevante, TalkBack/VoiceOver, text scale 200 % |
| MR-NF-010 | Localización | Español y COP; zona horaria explícita |
| MR-NF-011 | Mantenibilidad | Feature-first y capas presentación/aplicación/dominio/datos |
| MR-NF-012 | Portabilidad | Dominio no depende de Firebase/HTTP/storage |
| MR-NF-013 | Configuración | local/staging/production separados |
| MR-NF-014 | Reproducibilidad | Lockfile, CI y builds deterministas |
| MR-NF-015 | Observabilidad | Logs/métricas/crashes sanitizados |
| MR-NF-016 | Recuperación | Backups versionados y drills de restore |

## Reglas a preservar, previa validación

- pesos enteros y formato español;
- fórmula actual de entrega/descuadre;
- varios préstamos por cliente;
- valor fijo sin interés;
- retaque como desembolso adicional;
- estados al día/atrasado/adelantado/liquidado;
- rutas y frecuencias;
- cartulina con historial;
- fotos, contacto y mapa;
- tema oscuro;
- demo;
- backup/export;
- Excel;
- aislamiento local y operación offline como intención.

## Funcionalidades a corregir

- registro cobrador;
- fallback admin;
- roles editables;
- tenant/equipo;
- scoping de rutas;
- gates uniformes;
- jornada/cierre;
- pagos/sobrepagos;
- alta atómica;
- estados Cliente;
- ajustes/ledger;
- billing/cupones/Wompi;
- reportes por rango;
- backup cross-account;
- reset;
- bootstrap/logout;
- privacidad GPS;
- firma release.

## Funcionalidades a eliminar o aislar

- datos “tiempo real” hardcodeados;
- Wompi fake en producción;
- coordenadas demo como fallback productivo;
- pantalla EquipoTrabajo duplicada;
- rutas nombradas sin implementación;
- PDF con callback vacío;
- botones sin acción;
- CloudSync blob último-escritor;
- sentinel cobrador-demo como relación;
- dynamic en contratos;
- scripts absolutos/rotos;
- documentación comercial falsa.

## Funcionalidades incompletas

- membresía/invitaciones/deep link;
- configuración de tasas/frecuencia;
- suscripciones/cupones/pagos;
- cierre histórico;
- permisos de visibilidad;
- reportes cobrador/PDF;
- sync multiusuario;
- fotos remotas/backup;
- mapa offline;
- notificaciones;
- rol cliente final;
- observabilidad.

## Portabilidad y desarrollo local

- composición de dependencias debe seleccionar repositorios in-memory/local/Firebase/API;
- emulator suite para Auth/Firestore;
- fake clock, ID, GPS, map, filesystem, payment y share;
- seed versionado;
- configuración mediante archivos/defines no secretos;
- ningún path absoluto;
- comandos únicos para bootstrap, analyze, test y run;
- lockfile versionado;
- Android primero sin impedir web/iOS si se aprueba.

## Adaptador Firebase

- FirebaseAuth detrás de AuthPort;
- Firestore por empresa/entidades, no blobs;
- reglas deny-by-default;
- membresías y roles privilegiados server-side;
- emulator tests;
- App Check evaluado;
- timestamps de servidor;
- Firebase Storage o MediaPort para adjuntos;
- outbox/local cache;
- configuración separada por ambiente.

## Adaptador API propia

- OpenAPI/contrato versionado;
- OAuth/OIDC o tokens compatibles;
- endpoints idempotentes;
- ETag/version para conflictos;
- transacciones server-side;
- filtros por tenant;
- webhooks de pago;
- paginación y sync incremental;
- errores tipados;
- migraciones DB;
- auditoría.

## Despliegue VM/cloud

- contenedores o unidad reproducible;
- base gestionada o respaldada;
- TLS, secrets manager y rotación;
- health/readiness;
- migrations controladas;
- logs/metrics/traces;
- backups y restore probado;
- rate limits/WAF según exposición;
- colas para webhooks/sync;
- zero/low downtime;
- rollback;
- staging equivalente.

## Seguridad

- keystore release;
- cifrado local;
- no PII en logs;
- MFA/PIN/biometría según riesgo;
- reautenticación para export/reset;
- controles server-side;
- App Links verificados;
- tokens de invitación opacos;
- políticas de retención;
- consentimiento de geolocalización;
- dependency/SBOM scan.

## Pruebas

- unitarias del dominio;
- casos de uso con repos fake;
- widgets de 36 flujos;
- integración DB/adaptadores;
- rules/API contract;
- E2E admin+cobrador;
- offline/reconexión/conflicto;
- migración de snapshots;
- performance con cartera grande;
- seguridad;
- accesibilidad;
- release smoke.

## Observabilidad

Eventos mínimos:

- bootstrap/auth/profile;
- apertura/cierre de jornada;
- pago/desembolso/ajuste/reverso;
- sync enqueue/success/conflict/failure;
- backup/restore/migration;
- webhook de suscripción;
- errores de mapa/GPS;
- autorización denegada.

Todos con IDs y sin PII en payload.

## Migración de datos

1. Inventariar snapshots reales.
2. Copiar originales inmutables.
3. Detectar versión y namespace.
4. Validar schema/enums/relaciones.
5. Resolver tenant/propietario con cliente.
6. Asignar IDs nuevos y tabla de mapeo.
7. Importar rutas/clientes.
8. Importar préstamos/pagos.
9. Convertir acumulados a movimientos de apertura marcados.
10. Conciliar cartera/caja.
11. Copiar medios por checksum.
12. Registrar rechazados/ambiguos.
13. Ejecutar pruebas de aceptación.
14. Firmar acta de migración y conservar rollback.

