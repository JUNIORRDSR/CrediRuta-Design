# 17. Deuda técnica

## Resumen

| Severidad | Cantidad |
|---|---:|
| Crítica | 11 |
| Alta | 31 |
| Media | 16 |
| Informativa | 2 |
| **Total** | **60** |

Clases: A=2, C=22, D=33, E=3.

Métricas:

- 71 archivos Dart en lib, 15.330 líneas;
- 34 superficies;
- 21 archivos superan 300 líneas;
- 8 superan 500, uno de ellos generado;
- 44 catch, 11 vacíos o casi vacíos;
- 78 setState;
- 19 diálogos dentro de pantallas;
- 13 IDs por milisegundos;
- dos ciclos directos de dependencias;
- 23 tests, 2 de widgets, 0 E2E.

## Arquitectura

| ID | Sev. | Deuda / consecuencia | Evidencia | Impacto actual | Disposición | Clase |
|---|---|---|---|---|---|---|
| TD-ARCH-001 | Alta | Globals/singletons contaminan sesiones/tests | datos_demo.dart; LocalStore.I | Sí | Corregir | C |
| TD-ARCH-002 | Alta | Providers mezclan dominio, infra y UI | auth/caja/route_state | Sí | Corregir | C |
| TD-ARCH-003 | Alta | Lógica/HTTP/GPS/Excel en widgets | panel/nuevo_cliente/reporte | Sí | Corregir | C |
| TD-ARCH-004 | Media | Ciclos LocalStore↔Backup/Cloud | imports data | Mantenibilidad | Corregir | C |
| TD-ARCH-005 | Alta | Sin repositorios/DI | imports directos | Bloquea migración | Corregir | C |
| TD-ARCH-006 | Media | dynamic oculta contratos | auth_state.dart:336,352 | Riesgo runtime | Eliminar | E |
| TD-ARCH-007 | Alta | Pantallas leen DatosDemo directo | resumen/reportes | Scope desigual | Corregir | C |
| TD-ARCH-008 | Media | Navegación central/ad hoc mezclada | app_routes.dart | Guards/deep links rotos | Corregir | C |

## Dominio

| ID | Sev. | Deuda / consecuencia | Evidencia | Impacto actual | Disposición | Clase |
|---|---|---|---|---|---|---|
| TD-DOM-001 | Crítica | Registro cobrador imposible | registro_flujo_screen.dart | Sí | Corregir | D |
| TD-DOM-002 | Crítica | Caja/visitas sin día | caja_state/route_state | Sí | Corregir | D |
| TD-DOM-003 | Crítica | Cierre no genera histórico | caja_state.dart | Sí | Corregir | D |
| TD-DOM-004 | Alta | Estados Cliente contradictorios | cliente/chip/cartulina | Sí | Corregir | C |
| TD-DOM-005 | Alta | Suscripción duplicada | plan/billing/mensualidades | Sí | Validar/corregir | C |
| TD-DOM-006 | Crítica | Sobrepago/pago sin préstamo | registrar_pago | Sí | Corregir | D |
| TD-DOM-007 | Crítica | Alta sin ruta/caja fantasma | nuevo_cliente | Sí | Corregir | D |
| TD-DOM-008 | Crítica | Roles/gates evadibles | panel/modo/clientes | Sí | Corregir | D |
| TD-DOM-009 | Alta | Ajustes sin ledger | prestamo/cartulina | Sí | Corregir | D |
| TD-DOM-010 | Media | IDs por reloj | 13 usos | Potencial | Eliminar | E |

## Datos, estado y concurrencia

| ID | Sev. | Deuda / consecuencia | Evidencia | Impacto actual | Disposición | Clase |
|---|---|---|---|---|---|---|
| TD-DATA-001 | Alta | Futuros de persistencia descartados | route/caja/local_store | Pérdida posible | Corregir | D |
| TD-DATA-002 | Crítica | Cartera/caja no transaccional | pago/préstamo | Sí | Rediseñar | D |
| TD-DATA-003 | Alta | Asignación dispara guardados concurrentes | auth_state.dart:335-360 | Parcial/out of order | Corregir | D |
| TD-DATA-004 | Alta | Caja corrupta se puede sobrescribir | caja/local_store | Pérdida | Corregir | D |
| TD-DATA-005 | Alta | Reset deja memoria | local_store/ajustes | Sí | Corregir | D |
| TD-DATA-006 | Alta | Config/equipo se filtra entre cuentas | caja/auth | Sí | Corregir | D |
| TD-DATA-007 | Crítica | Backup global entre namespaces | backup_service | Fuga | Corregir | D |
| TD-DATA-008 | Alta | Caja sin dimensiones/actor | Gasto/Cierre/Caja | Bloquea reportes | Rediseñar | D |
| TD-DATA-009 | Alta | Colecciones mutables expuestas | route_state | Mutación sin persistir | Corregir | C |
| TD-DATA-010 | Media | Versionado/migración ad hoc | keys/fromJson/import | Riesgo futuro | Corregir | C |

## UI y manejo de errores

| ID | Sev. | Deuda / consecuencia | Evidencia | Impacto actual | Disposición | Clase |
|---|---|---|---|---|---|---|
| TD-ERR-001 | Alta | Excepciones tragadas | 44 catch/11 vacíos | Sí | Corregir | D |
| TD-ERR-002 | Alta | Éxitos falsos | verificación/GPS/ruta | Sí | Corregir | D |
| TD-ERR-003 | Crítica | Bootstrap continúa roto | main.dart | Crash potencial | Corregir | D |
| TD-ERR-004 | Media | firstWhere QR puede lanzar | unirse_equipo | Carrera | Corregir | D |
| TD-ERR-005 | Alta | Lifecycle GPS/setState/stream | nuevo_cliente/modo | Crash potencial | Corregir | D |
| TD-ERR-006 | Alta | Validaciones silenciosas/divergentes | dialogs/forms | Sí | Corregir | D |
| TD-ERR-007 | Alta | Stubs accesibles | PDF/código/mensualidades/sync | Sí | Completar/eliminar | D |
| TD-UI-008 | Media | Duplicación de flujos/UI | equipo, OSRM, pagos | Divergencia actual | Consolidar | C |
| TD-UI-009 | Media | Mocks parecen reales | gestión/Wompi/GPS | Sí | Aislar/eliminar | E |
| TD-UI-010 | Media | Controllers no reflejan estado | cierre/búsqueda/config | Sí | Corregir | C |

## Rendimiento

| ID | Sev. | Deuda / consecuencia | Evidencia | Impacto actual | Disposición | Clase |
|---|---|---|---|---|---|---|
| TD-PERF-001 | Alta | Panel O(n²) por filtro repetido | panel_rutas.dart:157-165 | Escala mal | Corregir | D |
| TD-PERF-002 | Media | Dashboard repite recorridos | admin_resumen/cliente | Bajo demo | Corregir | C |
| TD-PERF-003 | Media | Listas anidadas/IntrinsicHeight | panel_rutas | Jank | Corregir | C |
| TD-PERF-004 | Alta | OSRM URL sin límite/cache/timeout | mapas | Falla rutas grandes | Corregir | D |
| TD-PERF-005 | Media | I/O sync en isolate UI | backup/avatar/fotos/report | Jank | Corregir | C |
| TD-PERF-006 | Alta | Reescribe cartera completa | local_store.dart:175-187 | Escala/atomicidad | Rediseñar | D |

## Pruebas

| ID | Sev. | Deuda / consecuencia | Evidencia | Impacto actual | Disposición | Clase |
|---|---|---|---|---|---|---|
| TD-TEST-001 | Info | 23/23 pasan; regresión útil | test/ | Positivo | Preservar | A |
| TD-TEST-002 | Alta | Núcleo financiero sin test | inventario test | Defectos invisibles | Corregir | D |
| TD-TEST-003 | Alta | Seguridad/integraciones sin test | test/ | Riesgo | Corregir | D |
| TD-TEST-004 | Alta | 2 widget, 0 E2E | widget/sync tests | Flujos no verificados | Corregir | D |
| TD-TEST-005 | Media | Tests acoplados a globals/frágiles | invitacion/route tests | Mantenibilidad | Corregir | C |

## Dependencias y despliegue

| ID | Sev. | Deuda / consecuencia | Evidencia | Impacto actual | Disposición | Clase |
|---|---|---|---|---|---|---|
| TD-DEPLOY-001 | Info | Analyze 0 error/0 warning/23 info | ejecución 2026-07-10 | Positivo | Preservar/endurecer | A |
| TD-DEPLOY-002 | Media | pubspec.lock ignorado | .gitignore | Build no reproducible | Corregir | C |
| TD-DEPLOY-003 | Alta | Sin ambientes/flavors | Firebase/constants | Mezcla entornos | Corregir | C |
| TD-DEPLOY-004 | Crítica | Release firmado debug | build.gradle.kts:30-35 | No producción | Corregir | D |
| TD-DEPLOY-005 | Alta | build_optimized roto | script líneas 13-95 | Build falso | Corregir/eliminar | D |
| TD-DEPLOY-006 | Alta | Scripts absolutos; sin CI | scripts/repo | Onboarding irreproducible | Corregir | C |
| TD-DEPLOY-007 | Media | Plataformas incoherentes | firebase_options/dart:io | Web/iOS no listos | Decidir/corregir | C |

Consulta “dart pub outdated”:

- flutter_map 7.0.2 → resoluble 8.3.1;
- geolocator 12.0.0 → 14.0.3;
- google_sign_in 6.3.0 → 7.2.0;
- intl 0.19.0 → 0.20.3;
- latlong2 0.9.1 → 0.10.1;
- share_plus 10.1.4 → 13.2.0;
- flutter_lints 4.0.0 → 6.0.0.

No actualizar durante descubrimiento. Evaluar migraciones y breaking changes en una fase aislada.

## Seguridad y observabilidad

| ID | Sev. | Deuda / consecuencia | Evidencia | Impacto actual | Disposición | Clase |
|---|---|---|---|---|---|---|
| TD-SEC-001 | Alta | PII/finanzas sin cifrado | local/backup | Riesgo | Corregir | D |
| TD-SEC-002 | Crítica | Auth fail-open/perfil autoeditable | auth/rules | Sí | Corregir | D |
| TD-SEC-003 | Alta | Coords exactas a OSRM | mapas | Privacidad | Corregir | D |
| TD-SEC-004 | Media | Sin logs/crash/metrics | imports/catches | Operación ciega | Corregir | C |

## Deuda por categoría solicitada

| Categoría | Prioridad | Tema principal |
|---|---|---|
| Arquitectura | Alta | Globals, providers, sin puertos |
| Dominio | Crítica | Jornada, ledger, autorización |
| UI | Alta | Gates, mocks, stubs y formularios |
| Datos | Crítica | Atomicidad, tenant, backup |
| Seguridad | Crítica | Roles, cifrado, firma |
| Rendimiento | Alta | Blobs completos, mapas/listas |
| Mantenibilidad | Alta | Archivos grandes/ciclos/duplicación |
| Pruebas | Alta | Núcleo financiero sin cobertura |
| Dependencias | Media | Lockfile y majors pendientes |
| Despliegue | Crítica | Firma debug, sin CI/ambientes |

## Orden recomendado de pago de deuda

1. Requisitos bloqueantes de negocio.
2. Tenant/membresía/autorización.
3. Jornada/ledger/transacciones.
4. Repositorios/base local.
5. Auth y onboarding.
6. Rutas/clientes/préstamos/pagos.
7. Caja/cierre/reportes.
8. Sync/backend.
9. UI/accesibilidad.
10. CI/seguridad/observabilidad/release.

