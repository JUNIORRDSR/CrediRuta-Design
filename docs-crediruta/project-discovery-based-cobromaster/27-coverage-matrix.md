# 27. Matriz de cobertura

## Leyenda

- **Sí:** área revisada con evidencia directa.
- **Parcial:** el repositorio permite revisar parte del área, pero falta implementación, runtime o contrato externo.
- **N/A:** no aplica al límite del módulo.
- La columna **Pruebas** describe cobertura automatizada existente, no cobertura de esta auditoría.

## Cobertura por módulo

| Módulo | UI | Lógica | Datos | Integraciones | Permisos | Errores | Pruebas existentes | Documentado |
|---|---|---|---|---|---|---|---|---|
| Arranque y shell | Sí | Sí | Sí | Sí | Sí | Sí | Parcial | [Ficha](modules/bootstrap-shell.md) |
| Autenticación y sesión | Sí | Sí | Sí | Parcial: consola/OAuth externos | Sí | Sí | Parcial | [Ficha](modules/authentication-session.md) |
| Suscripciones y facturación | Sí | Sí | Sí | Parcial: Wompi/cupón simulados o bloqueados | Sí | Sí | No | [Ficha](modules/subscriptions-billing.md) |
| Equipo e invitaciones | Sí | Sí | Sí | Parcial: App Link/backend ausentes | Sí | Sí | No | [Ficha](modules/teams-invitations.md) |
| Rutas | Sí | Sí | Sí | Sí | Sí | Sí | Parcial | [Ficha](modules/routes.md) |
| Clientes | Sí | Sí | Sí | Sí | Sí | Sí | Parcial | [Ficha](modules/customers.md) |
| Préstamos | Sí | Sí | Sí | N/A | Sí | Sí | Parcial | [Ficha](modules/loans.md) |
| Pagos | Sí | Sí | Sí | N/A | Sí | Sí | Parcial | [Ficha](modules/payments.md) |
| Operación de campo | Sí | Sí | Sí | Parcial: red/GPS real no ejecutados | Sí | Sí | No | [Ficha](modules/field-operations.md) |
| Caja, gastos y cierres | Sí | Sí | Sí | N/A | Sí | Sí | Parcial | [Ficha](modules/cash-expenses-closures.md) |
| Reportes y exportaciones | Sí | Sí | Sí | Parcial: share/filesystem real no ejecutados | Sí | Sí | Parcial | [Ficha](modules/reports-exports.md) |
| Ajustes y respaldo | Sí | Sí | Sí | Parcial: filesystem/dispositivo real no ejecutados | Sí | Sí | Parcial | [Ficha](modules/settings-backup.md) |
| Persistencia y sincronización | Sí | Sí | Sí | Parcial: nube deshabilitada/reglas externas no verificadas | Sí | Sí | Sí local; no nube | [Ficha](modules/persistence-sync.md) |

No se encontró un módulo importante fuera de estos límites. Las dos pantallas huérfanas se asignaron respectivamente a equipo y reportes, y se documentaron como no alcanzables.

## Cobertura documental transversal

| Dimensión | Documento principal | Comprobación |
|---|---|---|
| Propósito y módulos | [01-project-overview.md](01-project-overview.md), [04-module-map.md](04-module-map.md) | 13/13 módulos |
| Dominio y terminología | [05-business-domain.md](05-business-domain.md), [26-domain-glossary.md](26-domain-glossary.md) | Conceptos y ambigüedades registrados |
| Reglas | [06-business-rules.md](06-business-rules.md) | 95 IDs únicos, evidencia y clasificación |
| Roles/permisos | [07-user-roles-and-permissions.md](07-user-roles-and-permissions.md), [18-security-findings.md](18-security-findings.md) | Ambos roles, demo, UI y enforcement |
| Flujos | [08-user-flows.md](08-user-flows.md) | 36 flujos con actor, pantallas, datos, errores y reglas |
| Pantallas/UI | [09-screen-inventory.md](09-screen-inventory.md), [10-ui-behavior.md](10-ui-behavior.md) | 34 superficies, 32 alcanzables, 2 huérfanas |
| Datos | [11-data-model.md](11-data-model.md), [12-data-dictionary.md](12-data-dictionary.md) | 8 entidades + Caja, 90 campos documentados (73 + 17) |
| Integraciones | [13-integrations.md](13-integrations.md) | 15 contratos/familias |
| Estado/sesión | [14-state-management.md](14-state-management.md), [15-authentication-and-session.md](15-authentication-and-session.md) | 4 providers y ciclo de sesión |
| Errores/deuda/seguridad | [16-errors-and-edge-cases.md](16-errors-and-edge-cases.md), [17-technical-debt.md](17-technical-debt.md), [18-security-findings.md](18-security-findings.md) | 16 defectos críticos consolidados; catálogos completos |
| Pruebas/aceptación | [19-testing-analysis.md](19-testing-analysis.md), [20-acceptance-criteria.md](20-acceptance-criteria.md) | 13 archivos, 23 pruebas y propuesta Given/When/Then |
| Decisiones/migración | [21-client-questions.md](21-client-questions.md) a [25-final-conclusions.md](25-final-conclusions.md) | Preguntas, requisitos, arquitectura y 12 fases |

## Validación cruzada entre áreas

| Contradicción o cruce | Lógica | UI/flujo | Datos/integración | Resolución documental |
|---|---|---|---|---|
| Equipo compartido vs datos por UID | BR-TEAM/BR-DATA | UF-TEAM y cambio de rol | `LocalStore` usa UID; sync no operativo | Se conserva como C/D y Q-B05, no se elige una conducta |
| Cobrador asignado vs acceso global | BR-ROUTES/BR-NAV | Homes y panel permiten más rutas | Lista `rutasAsignadas` sin enforcement | Riesgo en 07/18; TO-BE por membresía y scope |
| Pago exitoso vs mutaciones parciales | BR-PAYMENTS/BR-CASH | UF-PAY-001 muestra confirmación | Prestamo, caja y visita se guardan por pasos | Defecto D, AC transaccional y ledger propuesto |
| Cierre visual vs histórico | BR-CASH | UF-CLOSE-001/002 | `CierreHistorico` existe pero no se crea de forma normal | D; no tratar bandera como cierre contable |
| Plan/ruta habilitados vs entitlement | BR-SUB/BR-ROUTES | Pantallas muestran pago/renovación | Wompi simulado; cupones bloqueados | B/C/D; contrato pendiente Q-B08/Q-B09 |
| Registro de cobrador anunciado vs paso inaccesible | BR-AUTH | UF-AUTH-002 | Usuario puede modelar rol pero formulario no completa | D; AC y rediseño de onboarding |
| Estado de cartera vs calendario | BR-LOANS | Chips/cartulina | Frecuencia reducida a días fijos | C; Q-B14 y pruebas por reloj |
| Backup de cuenta vs snapshot global mutable | BR-DATA | UF-DATA-001/002 | JSON sin schema/tenant; memoria puede quedar vieja | D; formato versionado y restore atómico |

## Verificación flujo–regla–pantalla–dato

Cada ficha de [08-user-flows.md](08-user-flows.md) contiene explícitamente `Pantallas/archivos`, `Datos involucrados`, `Cambios de estado` y `Reglas relacionadas`. La comprobación por familias quedó así:

| Familia de flujos | IDs | Reglas | Datos principales | Pantallas/módulos |
|---|---|---|---|---|
| Bootstrap/auth | UF-SYS-001, UF-AUTH-001…008 | BR-AUTH, BR-DATA, BR-NAV | Usuario, sesión, namespace | Landing, login, registro, verificación |
| Equipo/suscripción | UF-TEAM-001…003, UF-SUB-001…002 | BR-TEAM, BR-SUB, BR-ROUTES | Usuario, Invitacion, Ruta, plan | Equipo, invitación, mensualidades |
| Rutas/clientes | UF-ROUTE-001…003, UF-CLIENT-001…003 | BR-ROUTES, BR-CUSTOMERS | Ruta, Cliente | Gestión/panel de rutas, clientes |
| Préstamos/pagos | UF-LOAN-001…002, UF-PAY-001 | BR-LOANS, BR-PAYMENTS, BR-CASH | Prestamo, Pago, Caja | Nuevo préstamo, cartulina, registrar pago |
| Campo/gastos | UF-VISIT-001, UF-MAP-001, UF-EXPENSE-001 | BR-GEO, BR-PAYMENTS, BR-CASH | Visitas implícitas, Gasto, Caja | Panel, modo carretera, gastos |
| Caja/reportes | UF-CLOSE-001…002, UF-REPORT-001…002 | BR-CASH, BR-REPORTS | Caja, CierreHistorico, JSON/XLSX | Cierre, resumen, reporte/exportación |
| Datos/ajustes | UF-DATA-001…002, UF-SET-001, UF-CONFIG-001 | BR-DATA, BR-NAV | Snapshot, tema, sesión | Ajustes, respaldo/restauración |
| Roles/admin | UF-ADMIN-001, UF-ROLE-001 | BR-TEAM, BR-NAV, BR-AUTH | Usuario, rutasAsignadas | Homes y cambio/impersonación |

## Áreas sin evidencia ejecutable

Se analizaron por código y configuración, pero no pudieron verificarse contra estado externo: consola Firebase, OAuth, Wompi, dominio/App Links, dispositivo con GPS/cámara/share, datos productivos y navegador visual vigente. Estas limitaciones no se marcan como módulos “sin analizar”; se marcan **Parcial** y están registradas como preguntas o riesgos.
