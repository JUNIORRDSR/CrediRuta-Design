# Contrato API inicial (v1) — lo que la app espera consumir

Borrador de contrato para el backend del servidor dedicado. La app define puertos
(`application/ports`) cuya implementación remota consumirá estos endpoints. Mientras el
backend no exista, la app usa repositorios locales (drift) y fakes.

Convenciones: JSON, UTC en timestamps (`ISO-8601`), `operationalDate` como `YYYY-MM-DD`,
dinero en **COP entero** (`amount: 25000`), IDs UUID v4 generados por el cliente
(el servidor valida unicidad — necesario para offline-first).

## Auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | /v1/auth/session | Canjea Firebase ID token → contexto (user, memberships) |
| GET | /v1/me | Perfil + membresías + entitlement |

## Organizaciones y equipo

| Método | Ruta | Descripción |
|---|---|---|
| POST | /v1/organizations | Crear organización (creador = adminPrincipal) |
| GET | /v1/organizations/{orgId} | Detalle + configuración (defaults de tasa, frecuencia) |
| PATCH | /v1/organizations/{orgId}/settings | Solo admins |
| POST | /v1/organizations/{orgId}/invitations | Genera código un-solo-uso {rol, ttl} — solo adminPrincipal para rol admin (Q-B06) |
| POST | /v1/invitations/redeem | Canjea código → crea membership (server-side, MR-FUN-005) |
| GET | /v1/organizations/{orgId}/members | Lista membresías |
| PATCH | /v1/organizations/{orgId}/members/{memberId} | Cambiar rol/estado/permisos — server autoritativo (PERM-002) |

## Operación (espejo del modelo local)

CRUD scoped por organización; el cobrador solo accede a rutas asignadas (Q-B07):

- `/v1/organizations/{orgId}/routes` (+ `/assignments`)
- `/v1/organizations/{orgId}/customers` (archivado vía `PATCH {archived: true}`, nunca DELETE)
- `/v1/organizations/{orgId}/loans` (+ `GET /{loanId}/movements`)
- `/v1/organizations/{orgId}/payments` (POST con `Idempotency-Key`; corrección = `POST /{paymentId}/reverse`)
- `/v1/organizations/{orgId}/cash-sessions?date=&collectorId=&routeId=`
- `/v1/organizations/{orgId}/expenses`
- `/v1/organizations/{orgId}/boletas`
- `/v1/organizations/{orgId}/closures` (+ `POST /{id}/approve`, `POST /{id}/reopen` con auditoría Q-B12)
- `/v1/organizations/{orgId}/visits`

## Sincronización (offline-first)

| Método | Ruta | Descripción |
|---|---|---|
| POST | /v1/sync/push | Lote de eventos outbox `[{id, entityType, entityId, op, payload, idempotencyKey, baseVersion}]` → por evento: `applied | duplicate | conflict | rejected` |
| GET | /v1/sync/pull?orgId=&cursor= | Cambios incrementales `{changes: [...], tombstones: [...], nextCursor}` |

Reglas de conflicto (ADR-012): movimientos financieros = append/idempotencia;
perfiles = versión; asignaciones = compare-and-set; archivados = tombstones.

## Suscripciones / Wompi

| Método | Ruta | Descripción |
|---|---|---|
| GET | /v1/organizations/{orgId}/subscription | Plan, estado, entitlement, vencimiento |
| POST | /v1/organizations/{orgId}/subscription/checkout | Crea orden → URL de checkout Wompi |
| POST | /v1/webhooks/wompi | Webhook firmado (verificación de checksum, idempotente) |

## Media

| Método | Ruta | Descripción |
|---|---|---|
| POST | /v1/media/upload-url | URL firmada (PUT) + mediaId {mime, checksum, owner} |
| GET | /v1/media/{mediaId} | Descarga autorizada |

## Errores

```json
{ "code": "AUTHORIZATION_DENIED", "message": "...", "details": {...}, "requestId": "..." }
```

Códigos alineados con las Failures de la app: `VALIDATION_FAILED`,
`AUTHORIZATION_DENIED`, `NOT_FOUND`, `CONFLICT`, `IDEMPOTENT_REPLAY`,
`ENTITLEMENT_REQUIRED`, `INTERNAL`.
