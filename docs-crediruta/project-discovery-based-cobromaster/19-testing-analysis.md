# 19. Análisis de pruebas

## Resultado verificable

Ejecutado el 2026-07-10:

- flutter test --no-pub: 23/23 pasan;
- dart analyze: 0 errores, 0 warnings, 23 infos.

No se generó cobertura de líneas para evitar artefactos fuera de documentación. La cobertura siguiente es funcional.

## Inventario caso por caso

| Archivo | Casos | Comportamiento que confirma | Lo que no demuestra |
|---|---:|---|---|
| widget_test.dart | 1 | Landing muestra CrediRuta/Login | Navegación o bootstrap real |
| sync_wrapper_test.dart | 1 | Demo fija namespace | Logout, UID real, fuga previa |
| route_state_test.dart | 1 | Selección borrada retorna null | CRUD, asignación, filtros |
| local_store_test.dart | 4 | Arranque vacío, corrupción rutas, namespaces, legacy | Caja corrupta, concurrencia, schema |
| invitacion_test.dart | 1 | Formato y 200 códigos sin colisión | TTL/canje/persistencia/backend |
| integridad_horaria_test.dart | 2 | Tolerancia <12 h y bloqueo días | Falsos positivos/servidor |
| datos_demo_test.dart | 1 | Seed 2×25 e idempotente | Exactitud de reglas/coords |
| cupones_test.dart | 1 | No hay cupones offline hardcodeados | Firestore rules/despliegue |
| cloud_sync_test.dart | 1 | Sync flag false/no marca | Diseño remoto/conflictos |
| cliente_test.dart | 4 | Nuevo al día, atraso, adelanto, liquidado/chip | Clavo, varios préstamos, borde fechas |
| caja_state_test.dart | 3 | Caja real cero, demo simulada, montos aislados | Flags, rollover, cierre/histórico |
| backup_service_test.dart | 2 | Backup/restore simple y vacío | Dos cuentas, cifrado, medios |
| auth_demo_test.dart | 1 | Demo namespace/seed | Login/Google/registro/logout |

Total: 13 archivos, 23 casos.

## Comportamientos A apoyados por pruebas

- cuenta real nueva no recibe seed;
- JSON corrupto de rutas se conserva;
- namespaces básicos se aíslan;
- legacy se entrega al primer UID;
- seed demo tiene dos rutas/50 clientes;
- caja real comienza en cero;
- demo genera caja/históricos simulados;
- cambio de namespace limpia montos principales;
- route selected inexistente no crashea;
- códigos de invitación usan alfabeto esperado;
- anti-reloj aplica umbral 12 h;
- CloudSync está deshabilitado;
- cupones hardcodeados no funcionan;
- backup de una cuenta restaura rutas;
- cuatro estados calculados de Cliente;
- Landing y SyncWrapper renderizan.

Una prueba confirma el comportamiento actual, no que sea un requisito correcto. Ejemplos:

- “legacy al primer usuario” está probado pero es riesgoso;
- “sync deshabilitado” está probado, no es una capacidad;
- seed demo histórico no prueba cierres reales.

## Cobertura funcional

| Módulo | Unit | Widget | Integración | Estado |
|---|---:|---:|---:|---|
| Arranque/shell | Parcial | Landing | No | Baja |
| Auth real/Google | No | No | No | Nula |
| Demo | Sí | Parcial | No | Media |
| Rutas CRUD/billing | 1 getter | No | No | Muy baja |
| Equipo/invitación | Formato | No | No | Muy baja |
| Clientes | Estados | No | No | Baja |
| Préstamos | Indirecta | No | No | Nula en mutaciones |
| Pagos | No | No | No | Nula |
| Visitas/mapas/GPS | No | No | No | Nula |
| Caja/gastos | Arranque | No | No | Muy baja |
| Cierre/histórico | Demo indirecta | No | No | Nula real |
| Reportes | No | No | No | Nula |
| Backup | Una cuenta | No | No | Baja |
| Seguridad/reglas | No | No | No emulator | Nula |

## Vacíos críticos

1. Registro cobrador por pasos.
2. Perfil faltante/fallback de rol.
3. Roles editables/reglas Firestore.
4. Pago, sobrepago y p nulo.
5. Atomicidad pago+caja.
6. Alta cliente sin ruta/cuotas 0.
7. Retaque/recargo/descuento.
8. Varios préstamos/prioridad.
9. Jornada/rollover.
10. Crear cierre histórico.
11. Aprobación/reapertura/inmutabilidad.
12. Asignación/scoping de rutas.
13. Gates desde todas las entradas.
14. Backup cruzado demo/usuarios.
15. Reset y resurrección.
16. Reporte por rango.
17. Wompi/cupón/deep link.
18. OAuth/configuración/ambientes.

## Fixtures y previews

### DatosDemo

- Random(42) para nombres/barrios/coordenadas;
- 2 rutas, 25 clientes cada una;
- capital 400.000;
- semanal: 10 cuotas de 48.000;
- diaria: 24 cuotas de 20.000;
- fechas relativas a DateTime.now;
- fotos i.pravatar.cc.

Es determinista en estructura, no totalmente en fechas.

### Preview support

- 33 anotaciones Preview;
- frame 390×844;
- tema real claro/oscuro;
- providers preview sin Firebase/LocalStore;
- sampleRuta/Cliente/Prestamo cargan seed global.

Los previews ayudan inspección, pero no son tests: no tienen asserts ni CI visual.

### Capturas

17 PNG históricos. No son golden tests y ya difieren de navegación actual.

## Fragilidad

- Tests comparten singletons DatosDemo/LocalStore.
- SharedPreferences mock exige limpieza disciplinada.
- Test de invitación comprueba probabilidad, no unicidad garantizada.
- Fechas usan DateTime.now y pueden ser sensibles a límites.
- Comentario de route_state_test dice “hoy crash” aunque ya pasa.
- No hay factories centralizadas por versión de schema.
- No hay fake clock/ID generator.

## Estrategia TO-BE

### Nivel 1: dominio unitario

- fórmulas de préstamo/caja;
- calendario/estados;
- políticas de sobrepago;
- transiciones de jornada/cierre;
- permisos;
- ledger/reversos;
- migraciones/validadores.

### Nivel 2: aplicación

- casos de uso con repositorios fake;
- unidad de trabajo;
- outbox/idempotencia;
- cambio de tenant/logout;
- errores tipados.

### Nivel 3: widgets

- registro completo admin/cobrador;
- login/verificación;
- alta cliente/préstamo/pago;
- gates por ruta/cierre;
- estados empty/loading/error/offline;
- accesibilidad y text scaling.

### Nivel 4: contratos e integración

- base local real;
- Firebase Auth emulator;
- Firestore rules emulator;
- adaptador API;
- sync/conflictos;
- archivos/backup/restore;
- OSRM/GPS/launchers fakes.

### Nivel 5: aceptación/E2E

- recorridos de los 36 flujos críticos;
- admin+cobrador en dos sesiones/dispositivos;
- offline→online;
- migración de snapshot legacy;
- cierre y conciliación;
- despliegue staging.

## Prioridad inicial

| Prioridad | Suite |
|---|---|
| P0 | Authz, pago+caja, jornada/cierre, tenant |
| P1 | Clientes/préstamos, backup/migración, rutas |
| P2 | Reportes, mapas/GPS, billing |
| P3 | Golden/UI polish/performance |

## Gates de CI

- format check;
- analyze sin errores/warnings y política de infos;
- unit/widget tests;
- rules tests;
- cobertura mínima por dominio crítico, no global arbitraria;
- integration tests local/staging;
- dependency advisory/SBOM;
- build firmado por ambiente;
- smoke E2E.

Los escenarios Given/When/Then están en [20-acceptance-criteria.md](20-acceptance-criteria.md).

