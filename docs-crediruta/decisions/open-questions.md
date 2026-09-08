# Preguntas abiertas y defaults provisionales

Fuente: `21-client-questions.md` de la auditoría. Aquí solo lo que **sigue sin resolver**
tras las decisiones ya registradas (Q-B01…Q-B15 parciales, Q-I01/I02/I03 resueltas).
Para no bloquear el desarrollo, cada punto tiene un **default provisional** implementado
y marcado; cambiarlo luego es una decisión de configuración/dominio, no una reescritura.

| # | Pregunta abierta | Default provisional implementado | Impacto si cambia |
|---|---|---|---|
| 1 | Festivos, períodos de gracia, mora y pagos anticipados en el calendario (Q-B14 parcial) | Días corridos sin festivos ni gracia; pagos anticipados permitidos hasta el saldo; sin recargo automático (según Q-B15) | `PaymentSchedule` ya aísla la generación de fechas; agregar calendario laboral es local a dominio |
| 2 | ¿Quién puede cerrar/reabrir una caja y con qué ventana máxima? (Q-B10/Q-B12 parcial) | Cobrador envía su cierre; admin (principal o coadmin) aprueba y reabre; sin ventana máxima; toda reapertura crea versión auditada | Política en `ClosurePolicy`; solo cambia la regla de autorización |
| 3 | Día de visita por cliente en rutas semanales y tratamiento de atrasos acumulados (Q-B11 parcial) | Cliente de ruta semanal tiene `visitWeekday`; atraso = cuotas programadas vencidas e impagas | Campo ya existe; reglas adicionales serían casos de uso nuevos |
| 4 | Acciones exactas que un cobrador puede modificar/eliminar/corregir (Q-B07 parcial) | Cobrador: crea clientes, préstamos, pagos, gastos, boletas y ajustes con auditoría (Q-I03); NO archiva rutas/clientes, NO aprueba cierres, NO gestiona equipo | Matriz central en `AuthorizationPolicy`; cambiar permisos = editar la matriz |
| 5 | Niveles, límites, precios del plan cloud y cobro por coadmins (Q-B08 parcial) | Modo local gratuito completo; billing NO se implementa aún; entitlement detrás de feature flag | Solo afecta fase backend/suscripciones |
| 6 | Checkout, renovación, vencimiento y reembolsos Wompi (Q-B09 parcial) | Contrato documentado en `docs/backend/`; sin implementación en app | Fase backend |
| 7 | Retaque: ¿interés sobre solo el monto nuevo o sobre todo el capital? (Q-I04) | Se preserva el comportamiento actual: tasa original sobre capital total, registrado como movimiento auditado | Fórmula encapsulada en `Loan.applyRetaque`; test parametrizado |
| 8 | Modo manual: ¿manda cuota×número o el total? (Q-I05) | Manda el **total** calculado; la cuota manual solo define el valor de cuota y la última cuota se ajusta al residuo | Encapsulado en `PaymentSchedule.manual` |
| 9 | Nivel de detalle al importar cartera en curso (Q-I06) | Movimiento de apertura marcado (`openingBalance`) con saldo y cuotas restantes; sin pagos sintéticos ni impacto en caja | Ya es un tipo de movimiento del ledger |
| 10 | ¿Cédula única por organización? ¿Cliente en varias rutas? (Q-I07) | Cédula única por organización (aviso de duplicado); cliente asignado a **una** ruta a la vez, transferible con historial | Restricción en repositorio + caso de uso de transferencia |
| 11 | Resultados de visita y prevalencia de orden manual vs optimizado (Q-I08) | Visita tipada: `pagado / noPago / ausente / reprogramado` con jornada, actor y hora; orden manual prevalece, optimización es sugerencia | Enum extensible |
| 12 | Trabajo offline de un usuario removido y resolución de conflictos (Q-I09) | Al reconectar se revalida membresía; si fue removido, bloqueo de operación y datos quedan pendientes de revisión admin. Sin TTL offline en v1 local | Política de sync (fase backend) |
| 13 | Consentimiento GPS/domicilios a OSM/OSRM y saldos por WhatsApp (Q-I10) | Pantalla de consentimiento antes de usar GPS/mapa; mensajes WhatsApp con contenido mínimo; OSRM (optimización) opt-in | Copy/flags; proveedor sustituible vía `RoutingPort` |
| 14 | Cifrado local, retención y portabilidad de backups/fotos/PII (Q-I11) | SQLite sin cifrar en v1 dev; SQLCipher ya disponible como dependencia para activar; backups locales por organización | Activar cifrado = cambio en `data/` + migración |
| 15 | ¿Google Sign-In obligatorio, opcional o eliminado? (Q-I12) | v1: email/password; Google opcional en fase backend (nunca define rol/suscripción) | Adaptador AuthPort |
| 16 | ¿Impersonación real o "ver como" solo lectura? (Q-I13) | "Ver como cobrador" **solo lectura**, visible y auditado | Guard en router + política |
| 17 | Definición exacta de KPIs y reportes por rol (Q-I14) | KPIs con fórmula documentada en código: cobrado del día, meta (= entregaEsperada), cartera activa, clientes en mora; separación caja/cartera/cobranza | Proyecciones puras, fáciles de ajustar |
| 18 | Landing web (Q-D01) | Fuera de alcance de este repo | — |
| 19 | Cuenta para cliente final (Q-D02) | No existe en v1 | — |
| 20 | Notificaciones/recordatorios (Q-D03) | No en v1; WhatsApp manual se conserva | Fase futura |
| 21 | Mapa/rutas offline (Q-D04) | Tiles online (OSM) con manejo explícito de error offline; cache básico del framework | `MapTileProvider` configurable |
| 22 | Tema por dispositivo o por usuario (Q-D05) | Por dispositivo (claro/oscuro/sistema) | Preferencia menor |
| 23 | Defaults de tasa/frecuencia/productos (Q-D06) | Configuración **por organización** (editable por admin), override por préstamo | Ya modelado en `OrganizationSettings` |

## Regla de resolución (de la auditoría)

Cada respuesta del cliente debe producir: decisión, regla/criterio de aceptación,
propietario, fecha de vigencia, impacto en datos/migración y si reemplaza una conducta
AS-IS. Al resolverse, actualizar este archivo y el ADR correspondiente.
