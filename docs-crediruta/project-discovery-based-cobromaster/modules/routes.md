# Módulo: rutas

## Propósito y actores

Organizar cartera/clientes, asignar cobradores y controlar vigencia comercial. Actores: administrador y cobrador.

## AS-IS

`RouteState` selecciona una ruta global y expone la lista mutable de `DatosDemo`. Una ruta nueva usa milisegundos como ID, nace `pendiente`, sin vencimiento, y queda seleccionada. Renovar suma meses desde la mayor fecha aplicable y fuerza estado activo. Editar actualiza campos no nulos; borrar elimina en cascada ruta, clientes y préstamos sin archivo/auditoría.

Estado y fecha de vigencia pueden contradecirse. La creación usa cobradores hardcodeados y el path temporal de una foto. El panel del cobrador no filtra por `cobradorId`; además, el bloqueo por mensualidad/cierre se evita entrando por clientes o modo carretera. La búsqueda sí aplica subcadenas a nombre, cédula y teléfono. Contadores duplican información derivable y los IDs pueden colisionar.

**Clasificación:** A para CRUD/selección/renovación; C/D/E para integridad, acceso y bloqueo.

## INTENCIÓN INFERIDA

Cada ruta representa una unidad de cartera asignable, con vigencia pagada, clientes propios y operación diaria por un cobrador.

## TO-BE PROPUESTO

- ID estable UUID/ULID y relación explícita empresa–ruta–asignación.
- Estado derivado de un único contrato de vigencia o máquina de estados validada.
- Archivado/transferencia con políticas para deuda activa; no cascada física accidental.
- Consultas scopeadas por permisos y asignación.
- Media almacenada mediante `MediaPort`, no paths temporales.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-ROUTES-001…012, BR-SUB-002/005, BR-NAV-001 |
| Flujos | UF-ROUTE-001…003, UF-SUB-002, UF-MAP-001 |
| Datos | Ruta, Cliente anidado, Usuario/rutasAsignadas |
| Pantallas | gestión/crear ruta, panel, bloqueo, mensualidades, ordenar clientes |
| Evidencia | `route_state.dart:30-332`; `models/ruta.dart`; `crear_ruta_screen.dart`; `gestion_rutas_screen.dart`; `panel_rutas_screen.dart` |
| Pruebas | `route_state_test.dart`; faltan permisos, deuda y concurrencia |

Resolver Q-I02, Q-I07 y la parte por ruta de Q-B08. Preservar búsqueda y organización por rutas; rediseñar propiedad, borrado, vigencia y acceso.
