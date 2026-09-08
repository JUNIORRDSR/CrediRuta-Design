# Módulo: persistencia y sincronización

## Propósito y actores

Persistir operación offline, rehidratarla y sincronizarla eventualmente con una fuente remota. Actor principal: sistema; todos los roles dependen de ella.

## AS-IS

`LocalStore` guarda en SharedPreferences múltiples valores JSON bajo un prefijo por UID o `demo`. Migra claves legacy al primer namespace real que las encuentra. Rutas contienen clientes, que contienen préstamos y pagos; Caja y cierres se guardan aparte. Existe compatibilidad para `prestamoActivo` legacy y recuperación parcial ante JSON inválido.

`DatosDemo` aporta seed y, tras rehidratación, permanece como almacén mutable global. Los providers hacen escrituras async separadas y varias pantallas leen el global directamente. No hay schema version global, transacciones, índices, cuota gestionada, cifrado ni resolución de conflictos.

`CloudSyncService.habilitado=false`; subir/descargar retornan sin operar. El contrato previsto usa un documento snapshot `datos_usuario`, pero `firestore.rules` deniega esa colección. La identidad es remota, mientras toda la operación es local por UID.

**Clasificación:** A para namespace/roundtrip local; C/D/E para globalidad, atomicidad y nube aparente.

## INTENCIÓN INFERIDA

Una app offline-first con datos durables en dispositivo y sincronización transparente entre miembros/dispositivos cuando exista conectividad.

## TO-BE PROPUESTO

- Base local transaccional (SQLite/Drift/Isar evaluado) con schema migrations e índices.
- Repositorios de dominio y Unit of Work; `DatosDemo` solo como fixture/fake.
- IDs globales, `createdAt/updatedAt/version/deletedAt` y tenant explícito.
- Outbox/inbox, idempotencia, tombstones y política de conflictos por agregado.
- Adaptadores intercambiables Firebase/API; sync por entidad/cambio, no blob completo.
- Cifrado, observabilidad, compactación y pruebas de crash/concurrencia.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-DATA-001…008, BR-TEAM-004, BR-CASH-006, BR-ROUTES-012 |
| Flujos | UF-SYS-001, UF-DATA-001, UF-DATA-002 y todos los flujos de mutación |
| Datos | 8 entidades serializables, Caja, sesión, tema |
| Integraciones | SharedPreferences, Firebase Auth/Firestore, filesystem |
| Evidencia | `data/local_store.dart:18-331`; `data/cloud_sync_service.dart:8-103`; `state/datos_demo.dart`; `firestore.rules:5-14` |
| Pruebas | `local_store_test.dart`, `cloud_sync_test.dart`, `sync_wrapper_test.dart`, `datos_demo_test.dart` |

Resolver Q-B03, Q-B05, Q-I09 y Q-I11. Antes de migrar datos reales, perfilar snapshots de dispositivos, establecer mapeo de IDs y reconciliar duplicados/operaciones financieras.
