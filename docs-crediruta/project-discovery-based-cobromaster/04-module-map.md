# 04. Mapa de módulos

## Inventario

| Módulo | Propósito | Actores | Datos principales | Dependencias | Estado |
|---|---|---|---|---|---|
| Arranque y shell | Inicializar servicios y elegir experiencia | Todos | Sesión, tema | Firebase, LocalStore, Provider | A |
| Autenticación y sesión | Alta, login, Google, verificación, demo | Todos | Usuario | Firebase Auth, perfiles Firestore | A/C/D |
| Panel administrador | Resumen y navegación principal | Administrador | KPIs, rutas, caja | RouteState, CajaState, DatosDemo | A/C |
| Rutas y mensualidades | CRUD, vigencia, bloqueo y renovación | Administrador | Ruta | RouteState, cupón, Wompi sim | A/C/D |
| Equipo e invitaciones | Invitar, asignar, remover e impersonar | Admin/cobrador | Usuario, Invitacion | AuthState, CajaState, QR | B/D |
| Clientes | Alta, edición, consulta y foto/ubicación | Ambos | Cliente | RouteState, picker, GPS | A/C/D |
| Préstamos y cartulina | Obligaciones, retaque, ajustes e historial | Ambos | Prestamo, Pago | Cliente, CajaState | A/C/D |
| Pagos y cobranza | Cobro normal/rápido y visitas | Cobrador | Pago, Visita implícita | RouteState, CajaState | A/C/D |
| Operación de ruta | Mapa, orden, carretera y contacto | Cobrador/admin | Ruta, Cliente | OSM, OSRM, GPS, URL launcher | A/C/E |
| Caja, gastos y cierres | Conciliar jornada y aprobar entrega | Ambos | Caja, Gasto, CierreHistorico | CajaState, LocalStore | A/C/D |
| Reportes y exportación | XLSX, JSON y resúmenes | Admin | Cartera, caja, cierres | Excel, filesystem, share | A/C/D |
| Ajustes, tema y respaldo | Preferencias, backup, restore y reset | Ambos | Preferencias, JSON | LocalStore, BackupService | A/D |
| Persistencia y sincronización | Rehidratación y transporte de datos | Sistema | Todos | SharedPreferences, Firestore | Local A; nube D |

## Dependencias funcionales

~~~mermaid
flowchart TD
    BOOT[Arranque y shell] --> AUTH[Autenticación]
    AUTH --> ADMIN[Panel administrador]
    AUTH --> FIELD[Operación cobrador]

    ADMIN --> ROUTES[Rutas]
    ADMIN --> TEAM[Equipo]
    ADMIN --> REPORTS[Reportes]
    ADMIN --> CASH[Caja y cierres]
    ADMIN --> CUSTOMERS[Clientes]

    FIELD --> MAP[Operación de ruta]
    FIELD --> CUSTOMERS
    FIELD --> CASH

    ROUTES --> CUSTOMERS
    CUSTOMERS --> LOANS[Préstamos y cartulina]
    LOANS --> PAYMENTS[Pagos]
    PAYMENTS --> CASH

    ROUTES --> SUBS[Mensualidades]
    TEAM --> INVITES[Invitaciones]

    AUTH --> STORE[Persistencia]
    ROUTES --> STORE
    TEAM --> STORE
    CUSTOMERS --> STORE
    LOANS --> STORE
    CASH --> STORE
    REPORTS --> STORE
    STORE -. deshabilitado .-> SYNC[CloudSync]
~~~

## Dependencias de código que cruzan límites

- AdminHome importa clientes compartidos.
- CobradorHome reutiliza CierreDiaScreen ubicada en admin.
- GestionRutas abre PanelRutas de cobrador.
- PanelRutas abre Cartulina de cliente.
- Pantallas de resumen y reporte leen DatosDemo directamente.
- LocalStore, BackupService y CloudSyncService forman ciclos de imports.

Evidencia: **admin_home_screen.dart:10-15**, **cobrador_home_screen.dart:8-12**, **gestion_rutas_screen.dart:12**, **panel_rutas_screen.dart:13-23**, **local_store.dart:9-10**.

## Flujos intermodulares críticos

### Pago

~~~mermaid
sequenceDiagram
    actor C as Cobrador
    participant UI as RegistrarPago
    participant P as Prestamo
    participant R as RouteState
    participant K as CajaState
    participant L as LocalStore
    C->>UI: confirma monto/tipo
    UI->>P: agrega Pago
    UI->>K: registraCobro
    UI->>R: marcarVisitado
    UI->>R: persistir
    R->>L: guardar rutas/clientes
    K->>L: guardar caja
    Note over P,L: No existe transacción común
~~~

### Cambio de sesión

~~~mermaid
sequenceDiagram
    participant A as AuthState
    participant S as SyncWrapper
    participant L as LocalStore
    participant R as RouteState
    participant K as CajaState
    A-->>S: usuario autenticado
    S->>L: setNamespace(uid)
    S->>R: recargar
    S->>K: cargar
    Note over S,K: El hijo puede renderizar mientras sincroniza
~~~

## Estado por módulo

“A/C/D” no significa cobertura parcial del análisis; significa que el módulo contiene comportamientos confirmados, inconsistentes y defectuosos. La matriz de cobertura completa está en [27-coverage-matrix.md](27-coverage-matrix.md).

## Documentación detallada

- [modules/bootstrap-shell.md](modules/bootstrap-shell.md)
- [modules/authentication-session.md](modules/authentication-session.md)
- [modules/subscriptions-billing.md](modules/subscriptions-billing.md)
- [modules/teams-invitations.md](modules/teams-invitations.md)
- [modules/routes.md](modules/routes.md)
- [modules/customers.md](modules/customers.md)
- [modules/loans.md](modules/loans.md)
- [modules/payments.md](modules/payments.md)
- [modules/field-operations.md](modules/field-operations.md)
- [modules/cash-expenses-closures.md](modules/cash-expenses-closures.md)
- [modules/reports-exports.md](modules/reports-exports.md)
- [modules/settings-backup.md](modules/settings-backup.md)
- [modules/persistence-sync.md](modules/persistence-sync.md)

