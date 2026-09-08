# Módulo: equipos e invitaciones

## Propósito y actores

Vincular cobradores con un administrador, asignar rutas, configurar visibilidad y permitir supervisión. Actores: propietario/administrador y cobrador.

## AS-IS

`CajaState` genera invitaciones de seis caracteres con `Random.secure` y vigencia de dos horas. La lista es local; no comprueba colisiones contra una fuente compartida. Canjear una invitación local marca el objeto usado en memoria, ignora parte del rol y asocia un identificador demo. El registro alternativo acepta cualquier texto como `administradorId` sin validarlo.

Los cobradores/cuentas y `rutasAsignadas` se guardan localmente. Cambiar UID cambia de namespace, por lo que administrador y cobrador no comparten la misma cartera. Remover/desasignar usa el sentinel `cobrador-demo`. Switches de visibilidad se almacenan en caja pero las pantallas no los consumen. La supervisión muestra GPS/actividad y caja derivados de datos simulados. `EquipoTrabajoScreen` está huérfana; el QR apunta a `prestaya.app/unirse`, sin App Link implementado.

**Clasificación:** B/D para el flujo de equipo; E para datos de supervisión presentados como reales.

## INTENCIÓN INFERIDA

Una empresa administra miembros; un cobrador acepta una invitación de uso único y ve solo sus rutas. El administrador supervisa, reasigna y revoca acceso.

## TO-BE PROPUESTO

- Entidades Empresa, Membresía, Invitación y AsignaciónRuta con IDs globales.
- Invitaciones hash, uso único, expiración, rol permitido y consumo transaccional en backend.
- App Link verificado con fallback web seguro.
- Permisos y filtrado por asignación en consultas/backend, no solo UI.
- Revocación y política offline definidas; auditoría de impersonación/soporte.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-TEAM-001…008, BR-AUTH-005/014/015, BR-ROUTES-002, BR-NAV-003 |
| Flujos | UF-TEAM-001…003, UF-AUTH-002, UF-ROLE-001 |
| Datos | Usuario, Invitacion, `rutasAsignadas`, flags de Caja |
| Pantallas | invitación, gestión/configuración de cobradores, unirse a equipo, equipo huérfana |
| Evidencia | `auth_state.dart:270-378`; `caja_state.dart:180-220`; `invitacion_screen.dart`; `config_cobrador_screen.dart`; `gestion_cobradores_screen.dart`; `unirse_equipo_screen.dart` |
| Pruebas | `invitacion_test.dart`; faltan autorización, colisión y consumo remoto |

Resolver Q-B04, Q-B05, Q-B06, Q-B07, Q-I09 y Q-I13. Conservar el concepto de invitación/asignación; descartar los sentinels y la supervisión simulada como conducta real.
