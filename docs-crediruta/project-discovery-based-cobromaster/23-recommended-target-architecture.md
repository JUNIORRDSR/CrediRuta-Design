# 23. Arquitectura objetivo recomendada

## Objetivo

Una arquitectura sencilla para Android/offline-first, capaz de usar:

- memoria/fakes;
- base local;
- Firebase;
- API propia;

sin reescribir dominio o UI en cada cambio.

## Principios

1. Feature-first.
2. Dominio Dart puro.
3. Reglas en casos de uso/dominio, no widgets.
4. Repositorios como contratos.
5. Base local como fuente de lectura offline.
6. Outbox para sincronización.
7. Backend autoritativo en identidad, membresía y finanzas compartidas.
8. Estado de presentación explícito.
9. Configuración por ambiente.
10. Evolución incremental; no microservicios prematuros.

## Capas por feature

~~~mermaid
flowchart LR
    UI[Presentación Flutter] --> APP[Aplicación / casos de uso]
    APP --> DOMAIN[Dominio Dart]
    APP --> PORTS[Puertos]
    PORTS --> LOCAL[Adaptador local]
    PORTS --> FIREBASE[Adaptador Firebase]
    PORTS --> API[Adaptador API]
    LOCAL --> DB[(DB local)]
    FIREBASE --> CLOUD[(Firestore/Auth/Storage)]
    API --> BACKEND[(API/DB)]
~~~

### Presentación

- screens/widgets;
- controller/view model por flujo;
- estados loading/data/empty/error/offline/pending;
- navegación y accesibilidad;
- ninguna fórmula financiera ni SDK externo.

### Aplicación

- comandos/queries;
- coordinación de repositorios;
- transacciones/unidad de trabajo;
- políticas de autorización consumidas;
- Result/errores tipados.

### Dominio

- entidades/value objects;
- Money COP;
- InterestRate;
- LoanSchedule;
- movimientos;
- estados/transiciones;
- políticas puras;
- eventos de dominio.

### Datos

- DTOs/mappers;
- repositorios locales/remotos;
- migraciones;
- outbox;
- clientes Firebase/HTTP/files/map/payment.

## Estructura sugerida

~~~text
lib/
  bootstrap/
    app.dart
    dependency_container.dart
    environment.dart
    router.dart
  core/
    domain/
      money.dart
      result.dart
      identifiers.dart
      clock.dart
    errors/
    observability/
    sync/
  features/
    authentication/
      presentation/
      application/
      domain/
      data/
    organization/
    routes/
    customers/
    loans/
    collections/
    visits/
    cash/
    reports/
    subscriptions/
    settings/
  infrastructure/
    local/
    firebase/
    api/
    media/
    maps/
    payments/
~~~

No es obligatorio que cada feature tenga archivos en las cuatro carpetas si no aporta valor. Sí deben respetarse dependencias: presentation → application → domain; data implementa puertos.

## Módulos de dominio

| Módulo | Responsabilidad |
|---|---|
| Authentication | Identidad/proveedores/sesión |
| Organization | Empresa, membresía, rol, invitación |
| Routes | Ruta, asignación, entitlement operativo |
| Customers | Identidad, contacto, ubicación, riesgo |
| Loans | Contrato, calendario y ledger |
| Collections | Pago, distribución, reverso |
| Visits | Jornada de campo y resultados |
| Cash | CajaDiaria, movimientos, cierre/versiones |
| Reports | Proyecciones/exports |
| Subscriptions | Plan, entitlement y provider payment |
| Settings | Preferencias y configuración de negocio |

## Contratos mínimos

~~~text
AuthRepository
MembershipRepository
RouteRepository
CustomerRepository
LoanRepository
PaymentRepository
VisitRepository
CashRepository
ReportRepository
SubscriptionRepository
MediaRepository
BackupRepository
SyncCoordinator
Clock
IdGenerator
UnitOfWork
~~~

No crear una interfaz por clase si una frontera de agregado basta.

## Persistencia local

Recomendación:

- DB transaccional con schema/migrations;
- tablas/colecciones por entidad;
- índices por tenant, ruta, cliente, fecha y estado;
- outbox y metadata de sync;
- cifrado si el análisis legal/riesgo lo confirma;
- media fuera de DB con manifest/checksum.

SharedPreferences debe quedar solo para preferencias pequeñas no sensibles.

## Ledger financiero

~~~mermaid
flowchart TD
    LOAN[Préstamo] --> LM[Movimiento préstamo]
    LM --> DISB[Desembolso]
    LM --> PAY[Pago]
    LM --> RET[Retaque]
    LM --> SUR[Recargo]
    LM --> DISC[Descuento]
    LM --> REV[Reverso]
    PAY --> CM[Movimiento caja]
    DISB --> CM
    RET --> CM
    CM --> CASH[CajaDiaria]
    CASH --> CLOSE[Cierre versionado]
~~~

Saldo y caja se derivan/proyectan de movimientos; no se pierde historia al corregir.

## Sincronización

### Flujo

1. Caso de uso valida y escribe transacción local.
2. Añade evento outbox con idempotency key.
3. UI muestra confirmado local/pendiente sync.
4. Worker envía por lote.
5. Servidor valida tenant/versión.
6. Confirma, rechaza o devuelve conflicto.
7. Adaptador actualiza estado/proyección.

### Conflictos

- movimientos financieros: append/idempotencia, no last-write-wins;
- campos de perfil: versión/merge;
- asignaciones/estados: compare-and-set;
- borrados: tombstones;
- conflictos humanos: bandeja de resolución.

## Firebase y API intercambiables

### Firebase

- AuthRepository usa Firebase Auth;
- perfiles/membresías/rules por tenant;
- Firestore entidades o comandos, no blobs;
- Storage para media;
- Cloud Functions/backend para billing y campos privilegiados.

### API

- mismos puertos;
- DTOs separados;
- OpenAPI;
- tokens/membresía server-side;
- DB transaccional;
- webhooks.

La app puede usar Firebase Auth y API propia simultáneamente, siempre que el token/UID se traduzca mediante un adaptador, no dentro del dominio.

## Configuración de ambientes

~~~text
local
  repositorios in-memory/local
  emulators
staging
  Firebase/API staging
  pagos sandbox
production
  proyectos/secretos/URLs productivos
~~~

EnvironmentConfig tipado:

- nombre/flags;
- endpoints;
- Firebase options;
- mapa/routing;
- billing;
- logging;
- demo habilitada;
- sync habilitada.

Ningún fake productivo debe depender de un botón oculto.

## Inyección de dependencias

Un composition root en bootstrap crea implementaciones. Provider puede conservarse para exponer controllers y dependencias; no es necesario migrar de librería solo por arquitectura.

Reglas:

- no singleton global de dominio;
- repositorios por sesión/tenant;
- Clock/IdGenerator inyectables;
- controllers con constructor;
- dispose de streams/clientes.

## Manejo de errores

Jerarquía:

- ValidationFailure;
- AuthorizationFailure;
- NotFoundFailure;
- ConflictFailure;
- OfflineFailure;
- PersistenceFailure;
- IntegrationFailure;
- CorruptDataFailure;
- UnexpectedFailure.

Cada caso de uso devuelve Result. UI traduce a copy/acción. Excepciones técnicas van a observabilidad sanitizada.

## Navegación

Router declarativo o centralizado:

- estado auth/bootstrap;
- membresía/rol activo;
- guards uniformes;
- deep links;
- rutas tipadas;
- recuperación de estado.

Los guards visuales complementan, no reemplazan autorización.

## Backend recomendado

Para la primera reconstrucción:

1. Flutter + DB local + repositorios.
2. Firebase Auth.
3. Elegir una sola persistencia remota inicial:
   - Firestore si velocidad y offline SDK dominan;
   - API monolítica modular si reglas financieras/reportes/control dominan.

No iniciar con microservicios. Una API modular desplegable en una VM/container y una DB relacional son suficientes si se escoge API propia.

## Pruebas

- dominio puro rápido;
- casos de uso con fakes;
- widgets/controllers;
- DB migrations;
- adapter contract;
- Firestore rules/API;
- sync/offline;
- E2E multiusuario;
- accesibilidad;
- performance;
- migración.

## Observabilidad

- logger estructurado;
- crash reporting;
- métricas de negocio/técnicas;
- trace/correlation ID;
- health de sync/outbox;
- auditoría financiera separada de logs;
- redacción de PII.

## Reglas para agentes de IA

Crear **AGENTS.md** y **docs/architecture/** con:

1. límites de capa e imports permitidos;
2. glosario y reglas aprobadas;
3. no inventar requisitos: usar IDs BR/AC;
4. no importar Firebase/HTTP/DB en dominio/presentation;
5. toda mutación financiera requiere caso de uso y test;
6. no introducir strings de estado/rol/precio hardcodeados;
7. no capturar excepciones sin Result/log;
8. no cambiar schema sin migración;
9. no cambiar contrato API sin versionar;
10. no usar datos demo en producción;
11. ejecutar format/analyze/test;
12. actualizar trazabilidad y ADR.

## Decisiones que requieren ADR

- tenant;
- calendario/interest model;
- ledger y caja;
- Firebase vs API;
- DB local/cifrado;
- sync/conflictos;
- media;
- billing;
- plataformas;
- estrategia de migración.

## Lo que deliberadamente no se propone

- microservicios;
- event sourcing completo;
- CQRS distribuido;
- Kubernetes;
- múltiples state managers;
- abstracciones por cada widget.

Se recomienda un monolito modular cliente y, si aplica, un backend modular único.

