# 07. Roles y permisos

## Roles existentes

El enum solo define:

- administrador;
- cobrador.

Usuario.roles es un Set, por lo que una cuenta puede contener ambos. No existe rol de cliente final, auditor, soporte o propietario separado. Evidencia: **models/enums.dart:1-2**, **models/usuario.dart:37-38**.

## Enrutamiento actual

~~~mermaid
flowchart TD
    START[AuthState] --> AUTH{autenticado}
    AUTH -- no --> LANDING[Landing]
    AUTH -- sí --> VERIFIED{correo verificado o demo}
    VERIFIED -- no --> VERIFY[Verificación]
    VERIFIED -- sí --> ADMIN{administrador y no simulación}
    ADMIN -- sí --> AH[AdminHome]
    ADMIN -- no --> ORPHAN{cobrador sin administradorId}
    ORPHAN -- sí --> JOIN[UnirseEquipo]
    ORPHAN -- no --> CH[CobradorHome]
~~~

Esta decisión protege únicamente qué árbol de widgets se muestra. Los mutadores no validan actor ni permiso.

## Matriz AS-IS

Leyenda: ✓ acceso normal; ⚠ acceso, pero solo protegido por UI/estado local; — no expuesto.

| Acción / dato | Público/demo | No verificado | Admin | Cobrador vinculado | Cobrador huérfano | Simulado/impersonado |
|---|---:|---:|---:|---:|---:|---:|
| Landing/login/registro | ✓ | — | — | — | — | — |
| Entrar admin demo | ✓ | — | — | — | — | — |
| Leer/escribir perfil propio | — | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ |
| Home admin | Demo ✓ | — | ✓ | — | — | — |
| Crear/editar/eliminar rutas | Demo ⚠ | — | ⚠ | — | — | Métodos sin guard |
| Invitar/remover/asignar equipo | Demo ⚠ | — | ⚠ | — | Canje local | Métodos sin guard |
| Ver rutas/clientes | Demo ✓ | — | Todo namespace | Todo namespace | — | Todo namespace |
| Crear/editar cliente/préstamo | Demo ⚠ | — | ⚠ | ⚠ | — | ⚠ |
| Pago/retaque/ajuste | Demo ⚠ | — | ⚠ | ⚠ | — | ⚠ |
| Gastos | Demo cobrador ⚠ | — | Sin navegación | ⚠ | — | ⚠ |
| Enviar cierre | Demo cobrador ⚠ | — | No por UI | ⚠ | — | Impersonado |
| Aprobar cierre | Demo admin ⚠ | — | ⚠ | No por UI | — | Admin simulado |
| Reabrir cierre | Demo ⚠ | — | ⚠ | ⚠ | — | ⚠ |
| Excel | Demo admin ✓ | — | ✓ | — | — | Método sin guard |
| Exportar/restaurar/reset | Demo admin ⚠ | — | ⚠ | ⚠ | Sin Ajustes | ⚠ |
| Datos operativos Firestore | Denegado | Denegado | Denegado | Denegado | Denegado | Denegado |

## Visibilidad real de datos

| Dato | Administrador | Cobrador | Control real |
|---|---|---|---|
| Perfil propio | R/W | R/W | Regla UID; campos privilegiados también editables |
| Perfil de equipo | No remoto | No remoto | Bloqueado |
| Rutas locales | Todas | Todas las del namespace | No filtra cobradorId |
| Clientes/préstamos/pagos | Todos namespace | Todos namespace | No hay guard en casos de uso |
| Caja/gastos | Caja de su UID | Caja de su UID | No se comparte |
| Invitaciones | Caja local | Caja local propia | No cruza dispositivos |
| Cierres | Local/demo | Local/demo | No se genera histórico real |
| Backups | Carpeta global | Carpeta global | No aislada por UID |

## Comportamiento esperado aparente

Inferencia B:

- admin controla empresa/equipo;
- cobrador solo opera rutas asignadas;
- admin ve caja y cierres de cobradores;
- admin configura visibilidad de datos sensibles;
- invitación define rol y membresía;
- remover revoca acceso;
- ruta vencida o caja enviada limita mutaciones.

La persistencia y las reglas no soportan esa intención.

## Defectos críticos

| ID | Defecto | Evidencia | Clase |
|---|---|---|---|
| PERM-001 | Falla de perfil concede admin | auth_state.dart:87-103 | D |
| PERM-002 | Dueño puede escribir roles/plan/vínculo | firestore.rules:5-8 | D |
| PERM-003 | No hay autorización central | route_state.dart; caja_state.dart | D |
| PERM-004 | Cobrador ve todas las rutas | route_state.dart:329-332 | D |
| PERM-005 | Bloqueo de ruta/cierre evadible | modo_carretera_screen.dart:461-469 | D |
| PERM-006 | Flags de visibilidad no se aplican | caja_state.dart:76-82 | D |
| PERM-007 | Remover no revoca perfil/tokens | auth_state.dart:335-349 | D |
| PERM-008 | Backup real restaurable desde demo | backup_service.dart:19-85 | D |
| PERM-009 | Impersonación sin precondición/auditoría | auth_state.dart:364-378 | D |
| PERM-010 | adminId acepta código arbitrario | auth_state.dart:127-139 | D |

## Restricciones solo en frontend

- correo verificado;
- acceso a shell admin;
- botones de alta/borrado;
- cierre enviado;
- solo lectura de ruta;
- acciones de admin en cierre;
- configuración de visibilidad;
- resultado de Wompi;
- pertenencia al equipo por administradorId no nulo.

Ninguna es una frontera confiable frente a un cliente modificado.

## TO-BE propuesto

1. Empresa como tenant.
2. Membresía con rol y estado.
3. Claims o backend autoritativo para campos privilegiados.
4. Políticas en casos de uso y en backend.
5. Consulta de rutas scoped por membresía.
6. Revocación y expiración offline definida.
7. Impersonación excepcional, auditada y preferiblemente solo lectura.
8. Export/restore/reset con rol, reautenticación y trazabilidad.
9. Cierre con máquina de estados y transiciones por actor.
10. Tests de reglas Firestore/API y de matriz de permisos.

## Preguntas

- ¿Quién puede crear administradores?
- ¿Un administrador invitado tiene los mismos privilegios que el propietario?
- ¿Qué campos puede modificar un cobrador?
- ¿Puede un cobrador crear préstamos, aplicar ajustes o borrar datos?
- ¿Quién puede reabrir un cierre y hasta cuándo?
- ¿Exportar, restaurar y resetear son exclusivos del admin?
- ¿La revocación debe ser inmediata aun offline?
- ¿La impersonación será función real o solo demo?

