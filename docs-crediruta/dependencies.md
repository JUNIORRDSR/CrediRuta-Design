# Dependencias y servicios

## Dependencias Flutter actuales

| Paquete | Versión | Uso | Fase |
|---|---|---|---|
| provider | ^6.1.5 | Exposición de controllers/DI de presentación (ADR-003) | 1 |
| go_router | ^17.3.0 | Navegación declarativa con guards | 1 |
| intl | ^0.20.3 | Formato es_CO de moneda y fechas | 1 |
| drift | ^2.34.2 | DB local SQLite transaccional (ADR-004) | 3 |
| drift_flutter | ^0.3.1 | Setup drift en Flutter (incluye libs SQLCipher) | 3 |
| path_provider | ^2.1.6 | Directorios de app (DB, media, backups) | 3 |
| uuid | ^4.6.0 | IdGenerator (UUID v4) | 1 |

Dev: `drift_dev`, `build_runner` (codegen drift), `flutter_lints`.

## Dependencias planificadas (se añaden en la fase que las necesita)

| Paquete | Uso | Fase | Nota |
|---|---|---|---|
| flutter_map + latlong2 | Mapa OSM de ruta | 4+ | Detrás de widget propio; tiles configurables |
| geolocator | GPS al crear cliente / modo carretera | 4+ | Con estados de permiso explícitos; nunca coordenadas falsas como éxito (corrige BR-GEO-001) |
| image_picker | Foto de cliente/ruta | 4+ | Media con manifest (id, checksum) |
| qr_flutter | QR de invitación | 4+ | Código canjeable in-app (sin deep links, Q-B04) |
| url_launcher | WhatsApp / llamada / Maps | 4+ | Contenido mínimo (Q-I10) |
| share_plus | Compartir exports | 5 | |
| excel | Reporte XLSX | 5 | Rango temporal coherente (corrige BR-REPORTS-003) |
| firebase_core + firebase_auth | Identidad (IdP) | backend | Solo tras crear proyecto Firebase de producción; el actual es dev (Q-B03) |
| http o dio | Cliente API propia | backend | DTOs separados del dominio |
| sentry_flutter (o Crashlytics) | Crash reporting sanitizado | backend | Sin PII |

## Servicios externos esperados

| Servicio | Rol | Estado |
|---|---|---|
| API propia en servidor dedicado | Autoridad de datos compartidos, sync, billing | Especificada en `docs/backend/server-requirements.md` |
| PostgreSQL 16 (servidor dedicado) | Persistencia remota | Especificada |
| Firebase Auth (proyecto nuevo para prod) | Identidad | Proyecto actual = solo dev/testing (Q-B03) |
| Wompi | Cobro de suscripción CrediRuta (checkout web + webhook) | Contrato definido; sandbox pendiente |
| OpenStreetMap tiles | Fondo de mapa | Online; términos por revisar (Q-I10) |
| OSRM (o proxy propio) | Optimización de recorrido | Opt-in; sustituible vía RoutingPort |
| MinIO / storage en servidor | Fotos y adjuntos | Fase media/backend |

## Política de actualización

`pubspec.lock` está versionado (builds reproducibles, MR-NF-014). Actualizaciones de
paquetes se hacen de forma controlada con `flutter pub outdated` + suite completa verde.
