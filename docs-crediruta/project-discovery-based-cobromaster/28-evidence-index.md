# 28. Índice de evidencia y trazabilidad

## Convenciones

- Las rutas son relativas a la raíz del repositorio.
- `archivo:línea` señala el inicio o el rango aproximado revisado; el código es la fuente final si cambia la línea.
- Los comentarios se usaron solo como indicio. La conclusión se basó en ejecución, condición, mutación o contrato observable.
- La evidencia histórica (`capturas_cobromaster/`, documentos de roadmap) no confirma por sí sola el comportamiento vigente.
- A/B/C/D/E/F corresponde a la clasificación explicada en [README.md](README.md); la severidad se documenta por separado.

## Corte y verificaciones reproducibles

| Verificación | Resultado auditado | Alcance |
|---|---|---|
| `git rev-parse HEAD` | `c3eca57f0eba8db82f970c7e8c21e8267e611a41` | Corte de código |
| Inventario versionado | 166 archivos | Repositorio |
| Inventario Dart | 85 archivos: 71 `lib`, 13 `test`, 1 herramienta | Código y pruebas |
| Conteo de líneas | 15.330 líneas físicas (incluidos blancos/comentarios) en `cobros_app/lib` | Tamaño de producción |
| `dart analyze` | 0 errores, 0 warnings, 23 infos | Análisis estático |
| `flutter test --no-pub` | 23/23 pruebas pasan | Suite existente |
| `dart pub outdated --json` | 7 dependencias directas resolubles a versiones mayores más nuevas | Consulta de versiones; no se actualizó nada |
| Arranque Flutter web | Servidor pudo iniciarse | No hubo navegador controlable para captura/flujo visual |

Versiones observadas: Flutter 3.44.6 y Dart 3.12.2. El árbol ya tenía cambios ajenos bajo `.idea/`; se preservaron.

## Fuentes por capa

| Capa | Evidencia primaria | Qué demuestra |
|---|---|---|
| Bootstrap | `cobros_app/lib/main.dart:15-68`, `cobros_app/lib/app.dart:28-46` | Firebase, LocalStore, providers y selección de shell |
| Navegación | `cobros_app/lib/core/navigation/app_routes.dart`, homes y `Navigator` en features | Rutas declaradas y navegación imperativa |
| Identidad | `cobros_app/lib/state/auth_state.dart:73-390` | Perfil, registro, login, Google, demo, equipo y logout |
| Perfil remoto | `cobros_app/firestore.rules:5-14` | Acceso solo a `usuarios/{uid}` y denegación por defecto |
| Estado operativo | `route_state.dart`, `caja_state.dart`, `theme_state.dart` | Mutadores, derivados, notificación y persistencia |
| Seed/almacén | `cobros_app/lib/state/datos_demo.dart` | Objetos globales que pasan de demo a store real en memoria |
| Persistencia | `cobros_app/lib/data/local_store.dart:18-304` | Namespace, snapshot JSON, sesión, tema, import/reset |
| Backup | `cobros_app/lib/data/backup_service.dart:12-94` | Exportación/restauración de cadenas JSON |
| Nube | `cobros_app/lib/data/cloud_sync_service.dart:8-103` | Transporte por snapshot previsto y `habilitado=false` |
| Dominio | `cobros_app/lib/models/*.dart` | Campos, serialización, estados y cálculos |
| UI | `cobros_app/lib/features/**/*.dart` | Condiciones visibles, formularios, acciones y feedback |
| Integraciones | `pubspec.yaml`, Firebase options, manifests y llamadas en features/data | SDK, permisos y contratos de terceros |
| Despliegue | `cobros_app/android/app/build.gradle.kts:30-35`, configs Firebase | Release usa firma debug y existe un único ambiente embebido |
| Pruebas | `cobros_app/test/*.dart` | Comportamientos felices ya caracterizados |

## Evidencia de reglas y flujos críticos

| Tema | Evidencia concreta | Regla/flujo relacionado | Conclusión |
|---|---|---|---|
| Registro de cobrador | `registro_flujo_screen.dart:38,87-102,331`; hay 4 vistas pero `_totalPasos` retorna 3 al unirse | BR-AUTH; UF-AUTH-002 | D: la contraseña/creación quedan inaccesibles |
| Fallback administrador | `auth_state.dart:87-103` | BR-AUTH; UF-AUTH-001/003 | D: perfil faltante/error puede producir privilegio admin |
| Google auto-admin | `auth_state.dart:168-212` | BR-AUTH; UF-AUTH-003 | C/D: onboarding no exige invitación/membresía |
| Rol editable por dueño del perfil | `firestore.rules:6-13` permite write del documento completo propio | BR-AUTH/TEAM; UF-ROLE-001 | D: rol/plan no están protegidos por campo/backend |
| Equipo local | `auth_state.dart:294-378`, `local_store.dart:74-108` | BR-TEAM/DATA; UF-TEAM-001…003 | D: asociación visual no crea almacén compartido |
| Rutas asignadas | `usuario.dart`, `config_cobrador_screen.dart`, homes/panel | BR-ROUTES/NAV; UF-ROLE-001 | C: se guardan IDs pero no filtran consistentemente |
| Ruta nueva pendiente | `route_state.dart:213-230` | BR-ROUTES; UF-ROUTE-001 | A: crea ruta y la deja pendiente de pago |
| Cupón | `route_state.dart:291+`, `firestore.rules:14` | BR-SUB/ROUTES; UF-SUB-002 | D: consulta prevista queda denegada por reglas versionadas |
| Nube deshabilitada | `cloud_sync_service.dart:15-17,42-43,81-82` | BR-DATA; UF-SYS-001/DATA | A/D: llamadas retornan sin transportar datos |
| Datos globales mutables | `datos_demo.dart` y lecturas directas en screens/providers | BR-DATA/REPORTS | C/E: seed y repositorio real comparten identidad global |
| Pago/caja | `registrar_pago_screen.dart`, mutadores de Prestamo/RouteState y `caja_state.dart:114+` | BR-PAYMENTS/CASH; UF-PAY-001 | D: no existe unidad transaccional ni rollback común |
| Sobrepago | cálculos/mutadores en `prestamo.dart` y formulario de pago | BR-PAYMENTS/LOANS; UF-PAY-001 | D: el saldo se limita, pero el monto completo afecta otros acumulados |
| Cierre | `caja_state.dart:61-65,161-175,326-355` | BR-CASH; UF-CLOSE-001/002 | C/D: banderas editables y creación histórica no forman un ciclo normal inmutable |
| Backup/reset | `local_store.dart:246-304`, `backup_service.dart:52-94`, `ajustes_screen.dart` | BR-DATA; UF-DATA-001/002 | D: schema/tenant/memoria no se coordinan de forma atómica |
| OSRM/GPS | `panel_rutas_screen.dart:531-545`, `modo_carretera_screen.dart:59-83` | BR-GEO; UF-MAP-001 | A/E: coordenadas exactas se envían a un servicio público |
| Firma Android | `android/app/build.gradle.kts:30-35` | Despliegue | D: release toma `signingConfigs.debug` |

La tabla completa de 95 reglas con evidencia está en [06-business-rules.md](06-business-rules.md). Los 36 recorridos con precondiciones, variantes y errores están en [08-user-flows.md](08-user-flows.md).

## Pruebas como evidencia

| Archivo | Conducta que caracteriza | Límite |
|---|---|---|
| `auth_demo_test.dart` | Entrada demo y rol seleccionado | No cubre Firebase ni guardas reales |
| `backup_service_test.dart` | Escritura/restore feliz | No cubre cifrado, tenant, corrupción o compatibilidad |
| `caja_state_test.dart` | Mutadores y derivados seleccionados | No prueba jornada/atomicidad/concurrencia |
| `cliente_test.dart` | Serialización/campos de Cliente | No valida identidad o relación única |
| `cloud_sync_test.dart`, `sync_wrapper_test.dart` | Wrapper y no-op de sync | No existe integración remota habilitada |
| `cupones_test.dart` | Lógica local/mocks de cupón | No prueba reglas Firestore desplegadas |
| `datos_demo_test.dart` | Seed y mutación esperada | Refuerza el acoplamiento global; no lo legitima como arquitectura |
| `integridad_horaria_test.dart` | Convenciones horarias seleccionadas | No define calendario contractual |
| `invitacion_test.dart` | Serialización/validaciones locales | No prueba consumo único, expiración remota ni App Link |
| `local_store_test.dart` | Persistencia y namespace | No cubre crash, cuota o migración real |
| `route_state_test.dart` | Operaciones principales de ruta | No cubre permisos ni dispositivo concurrente |
| `widget_test.dart` | Render mínimo | No recorre flujos de negocio completos |

Detalle y propuesta de pirámide: [19-testing-analysis.md](19-testing-analysis.md). Criterios verificables: [20-acceptance-criteria.md](20-acceptance-criteria.md).

## Artefactos secundarios

| Artefacto | Uso permitido en la auditoría | Precaución |
|---|---|---|
| `capturas_cobromaster/` (17 PNG) | Comparar intención visual histórica | Una captura muestra 4 tabs donde el código actual define 5; no prueba runtime vigente |
| `INTEGRACION-NUBE.md` | Intención de Firebase/sync | Roadmap, no comportamiento implementado |
| `COMO-TRABAJAR.md`, `DEVELOPMENT.md`, READMEs | Contexto y ambición | Pueden estar desactualizados respecto al código |
| `.github/`, IDE y scaffolds de plataforma | Inventario de tooling | No implican que un pipeline/target esté operativo |

## Evidencia externa pendiente

Para cerrar lo que el repositorio no puede demostrar se necesita: export/configuración de Firebase, reglas desplegadas, cuentas OAuth/Wompi, dominio y App Links, muestras anonimizadas de datos reales, dispositivo Android y definiciones contractuales del cliente. Esas solicitudes están limitadas a preguntas no resolubles en [21-client-questions.md](21-client-questions.md).

## Regla para el agente de reconstrucción

Ante una contradicción, no escoger el archivo “más conveniente”. Debe:

1. localizar el ID `BR-*` y su clasificación;
2. revisar el flujo `UF-*`, el modelo y la pantalla enlazados;
3. comprobar si existe criterio `AC-*`;
4. si sigue siendo F/C contractual, resolver la pregunta `Q-*`;
5. registrar la decisión como ADR/requisito versionado antes de implementar.
