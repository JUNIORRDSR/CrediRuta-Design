# Registro de decisiones de arquitectura (ADR)

Formato corto. Estado: ✅ aceptada · 🟡 provisional (pendiente de validación con cliente).

---

## ADR-001 — Marca y plataforma ✅

**Decisión:** marca única **CrediRuta**; `applicationId` `com.crediruta.app`; primera
versión productiva **solo Android**. Web/desktop fuera de alcance; iOS futuro.
**Origen:** Q-B01, Q-B02. Se elimina toda referencia a CobroMaster/Presta Ya/prestaya.app (Q-B04).

## ADR-002 — Arquitectura feature-first con dominio puro ✅

**Decisión:** capas `features → application → domain`, `data` implementa puertos,
`bootstrap` como composition root. Dominio Dart puro sin Flutter/Firebase/HTTP/IO.
**Motivo:** el legacy acopló negocio a widgets y SharedPreferences (deuda crítica).
**Origen:** doc 23 de la auditoría; MR-NF-011/012.

## ADR-003 — Estado con provider + ChangeNotifier controllers ✅

**Decisión:** `provider` expone controllers (`ChangeNotifier`) creados en el composition
root con dependencias por constructor. Sin singletons globales de dominio.
**Motivo:** la auditoría avala conservar provider; cero codegen; equipo ya lo conoce.
**Alternativa descartada:** Riverpod/bloc — beneficio marginal frente al costo de adopción.

## ADR-004 — Persistencia local con drift (SQLite) ✅

**Decisión:** drift con schema versionado, migraciones, transacciones e índices por
tenant/ruta/cliente/fecha. SharedPreferences solo para preferencias pequeñas no sensibles.
**Motivo:** MR-NF-003/004 (atomicidad y miles de registros sin reserializar blobs).
**Nota:** `drift_flutter` incluye SQLCipher libs; el cifrado local se activará tras
resolver Q-I11 (clave en Android Keystore).

## ADR-005 — Tenant = Organización con membresías ✅

**Decisión:** agregado `Organization`; `Membership(userId, organizationId, rol, estado)`.
Roles: `adminPrincipal`, `coadmin` (permisos granulares), `cobrador`. Los datos pertenecen
a la organización, nunca al UID del creador. Invitaciones por código de un solo uso con
TTL, rol e issuer, canjeadas dentro de la app (sin deep links en esta fase).
**Origen:** Q-B04, Q-B05, Q-B06, MR-FUN-003/004/005.

## ADR-006 — Ledger financiero append-only ✅

**Decisión:** `LoanMovement` (desembolso, pago, retaque, recargo, descuento, reverso,
saldoInicial-importación) y `CashMovement` derivan saldo del préstamo y totales de caja.
Nada se edita ni borra: correcciones = movimiento de reverso + movimiento nuevo.
Cada movimiento registra actor, timestamp, valor y nota (Q-I03).
**Origen:** doc 23 (ledger), BR-PAYMENTS-006 (sin auditoría en legacy), MR-FUN-026.

## ADR-007 — Caja diaria por organización + cobrador + ruta + fecha operativa ✅

**Decisión:** `CashSession` identificada por (organizationId, cobradorId, rutaId,
fechaOperativa). Un cobrador tiene una caja por ruta trabajada por día. Fórmula
preservada: `entregaEsperada = cobrado + boletas − gastos − prestado`;
`descuadre = efectivoContado − entregaEsperada`. Cierre con estados
`abierta → enviada → aprobada → reabierta` y **versiones auditadas** en cada reapertura.
**Origen:** Q-B10, Q-B12, BR-CASH-002 (preservar fórmula), corrige BR-CASH-006/008/009.

## ADR-008 — Dinero COP entero ✅

**Decisión:** `Money` como value object sobre `int` (pesos sin centavos), operaciones
seguras y formato es_CO. Prohibido `double` para dinero.
**Origen:** comportamiento A confirmado del legacy; MR-NF-010.

## ADR-009 — Calendario de cuotas por préstamo ✅

**Decisión:** `PaymentSchedule` generado al desembolsar: fecha de desembolso + frecuencia
(diaria/semanal en v1) + n.º de cuotas. Conserva fecha programada vs fecha real de pago y
días de atraso. Los atrasos no modifican el calendario original ni generan recargos
automáticos. Frecuencia variable por préstamo, aun dentro de la misma ruta.
**Origen:** Q-B14, Q-B15. 🟡 Festivos, gracia y mora pendientes (open-questions).

## ADR-010 — Pagos con selección explícita de préstamo, sin sobrepago ✅/🟡

**Decisión:** cada préstamo activo se muestra como tarjeta independiente; el cobrador
elige a cuál aplica el pago (Q-B15). Pago > saldo se **rechaza** con mensaje claro
(excedente/crédito a favor = funcionalidad futura). Pago idempotente con obligación,
actor, método, fecha y caja destino (MR-FUN-024). Corrección = reverso, nunca edición.

## ADR-011 — Backend: API propia en servidor dedicado + Firebase Auth como IdP inicial 🟡

**Decisión:** persistencia remota autoritativa = **API modular propia + PostgreSQL** en el
servidor dedicado del cliente (reglas financieras, reportes y control dominan — criterio
del doc 23). Identidad inicial: Firebase Auth (email/password; el proyecto Firebase
existente queda como **dev/testing únicamente**, Q-B03); la API verifica ID tokens.
El dominio nunca importa Firebase: `AuthPort` con adaptadores intercambiables.
Ver `docs/backend/server-requirements.md` y `api-contract.md`.

## ADR-012 — Sync por outbox con idempotencia 🟡 (diseño listo, implementación en fase backend)

**Decisión:** cada mutación local encola un evento outbox (entityType, entityId, op,
payload, idempotencyKey, version). Push por lotes; pull incremental por cursor.
Conflictos: append para movimientos; version/merge para perfiles; compare-and-set para
asignaciones; tombstones para archivados. Modo **local gratuito** funciona sin backend
(Q-B08): el outbox se acumula desactivado hasta que la organización activa plan cloud.

## ADR-013 — Archivado en lugar de borrado físico ✅

**Decisión:** clientes y rutas con historial se archivan (`archivedAt`), desaparecen de
flujos operativos y quedan consultables en el panel admin. Reactivación conserva historial.
**Origen:** Q-I02; corrige BR-ROUTES-007 (cascada destructiva del legacy).

## ADR-014 — Boleta como cobro único separado ✅

**Decisión:** `Boleta` = recompensa opcional que el cobrador cobra una sola vez por
cliente nuevo, en un único pago. Registra valor, fecha, cobrador, cliente y caja. Entra a
`entregaEsperada` y a reportes separados; **no** afecta saldo del préstamo ni estados de
mora. El reparto admin/cobrador es acuerdo externo: la app no lo calcula.
**Origen:** Q-B13 + aclaración posterior.

## ADR-015 — Sin clasificación global de "clavo/mal pagador" ✅

**Decisión:** no existe lista compartida de riesgo ni cruce de clientes entre
organizaciones. Cualquier marca de riesgo futura será interna a la organización y
requerirá decisión explícita del cliente.
**Origen:** Q-I01 (descartada por el cliente).
