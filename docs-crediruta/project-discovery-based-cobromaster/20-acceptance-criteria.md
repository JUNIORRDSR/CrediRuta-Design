# 20. Criterios de aceptación

## Uso

Los primeros escenarios caracterizan comportamiento AS-IS que conviene conservar hasta validación. Los TO-BE corrigen defectos o formalizan intención; no deben asumirse aprobados donde dependen de preguntas bloqueantes.

## Caracterización AS-IS

### AC-CHAR-001 — Cuenta real vacía

~~~gherkin
Given un dispositivo sin datos operativos
When inicia una cuenta real
Then rutas y clientes deben estar vacíos
And el seed demo no debe persistirse en su namespace
~~~

### AC-CHAR-002 — Demo aislada e idempotente

~~~gherkin
Given el namespace demo vacío
When se carga el seed dos veces
Then deben existir exactamente 2 rutas y 50 clientes
And la segunda carga no debe duplicarlos
~~~

### AC-CHAR-003 — Fórmula de préstamo

~~~gherkin
Given un préstamo con capital, retaques, recargos y descuentos
When se calcula su total
Then debe usar capitalTotal más interés efectivo más recargos menos descuentos
And el saldo debe ser total menos pagos
~~~

Pendiente de validar si el interés sobre retaque es correcto.

### AC-CHAR-004 — Estados de cartera

~~~gherkin
Given un préstamo activo con frecuencia y fecha
When se comparan cuotas pagadas con cuotas esperadas
Then el cliente debe clasificarse como al día, atrasado o adelantado
And sin saldos activos debe clasificarse liquidado
~~~

### AC-CHAR-005 — Entrega y descuadre

~~~gherkin
Given cobros, boletas, gastos, desembolsos y efectivo contado
When se concilia la caja
Then entregaEsperada debe ser cobros más boletas menos gastos menos desembolsos
And descuadre debe ser efectivo menos entregaEsperada
~~~

### AC-CHAR-006 — Corrupción de rutas

~~~gherkin
Given un blob de rutas inválido
When se rehidrata el almacén
Then el crudo debe conservarse en cuarentena
And no debe sobrescribirse con datos nuevos
~~~

### AC-CHAR-007 — Aislamiento básico local

~~~gherkin
Given dos cuentas locales A y B
When A guarda una ruta
Then B no debe verla
And A debe recuperarla al volver
~~~

En TO-BE el aislamiento debe ser por empresa/membresía y permitir datos compartidos autorizados.

### AC-CHAR-008 — Control horario actual

~~~gherkin
Given una última apertura registrada
When el reloj retrocede menos de 12 horas
Then la app debe continuar
When retrocede varios días
Then debe activar el flujo de integridad definido
~~~

Validar si esta regla debe conservarse.

## Autenticación y sesión TO-BE

### AC-AUTH-001 — Perfil faltante fail-closed

~~~gherkin
Given una sesión Firebase válida
And el perfil o membresía no puede resolverse
When la app restaura sesión
Then no debe conceder rol administrador
And debe mostrar un estado recuperable de acceso pendiente
~~~

### AC-AUTH-002 — Registro cobrador completo

~~~gherkin
Given una invitación válida
When un cobrador recorre el registro
Then debe ver datos, seguridad y términos
And la contraseña debe validarse antes del alta
And la invitación debe consumirse atómicamente
~~~

### AC-AUTH-003 — Código arbitrario rechazado

~~~gherkin
Given un texto que no corresponde a una invitación vigente
When se intenta registrar o unir un cobrador
Then no debe crearse una membresía
And el texto nunca debe almacenarse como administradorId
~~~

### AC-AUTH-004 — Google no autoeleva

~~~gherkin
Given un usuario Google nuevo
When completa autenticación
Then debe quedar sin organización/rol privilegiado hasta completar onboarding
And no debe activarse una suscripción implícita
~~~

### AC-AUTH-005 — Política de verificación única

~~~gherkin
Given un usuario no verificado
When está dentro o fuera de la ventana definida
Then la UI y el backend deben aplicar la misma política
And reenviar debe reportar el resultado real con cooldown
~~~

### AC-AUTH-006 — Logout completo

~~~gherkin
Given un usuario con rutas, caja, simulación o impersonación activas
When cierra sesión
Then deben limpiarse identidad, tenant y estado efímero
And la siguiente cuenta no debe ver datos ni flags anteriores
~~~

## Organización, roles e invitaciones

### AC-TEAM-001 — Tenant compartido

~~~gherkin
Given un administrador y un cobrador de la misma empresa
When ambos sincronizan
Then deben ver la misma ruta según sus permisos
And los datos no deben duplicarse por UID como fuentes independientes
~~~

### AC-TEAM-002 — Scope del cobrador

~~~gherkin
Given un cobrador asignado solo a la ruta A
When consulta rutas o clientes
Then no debe leer ni modificar la ruta B
~~~

### AC-TEAM-003 — Revocación

~~~gherkin
Given una membresía activa
When un administrador la revoca
Then el backend debe denegar nuevas operaciones
And la política offline debe definir cuándo expira el acceso cacheado
~~~

### AC-TEAM-004 — Invitación de un uso

~~~gherkin
Given una invitación con empresa, rol y vencimiento
When se canjea correctamente
Then debe quedar usada una sola vez
And todo reintento idempotente debe devolver la misma membresía
~~~

## Rutas y clientes

### AC-ROUTE-001 — Estado/vigencia coherente

~~~gherkin
Given una ruta con entitlement
When cambia su fecha de vigencia
Then su estado operativo debe derivarse de una única máquina de estados
And no puede quedar activa e impaga simultáneamente
~~~

### AC-ROUTE-002 — Gate uniforme

~~~gherkin
Given una ruta vencida o una caja bloqueada
When se entra por Panel, Clientes, Mapa o deep link
Then todas las acciones mutantes deben aplicar la misma restricción
~~~

### AC-ROUTE-003 — Borrado con cartera

~~~gherkin
Given una ruta con préstamos o pagos
When se intenta eliminar
Then debe rechazarse o archivarse según política
And nunca debe perderse el historial financiero
~~~

### AC-CLIENT-001 — Alta atómica

~~~gherkin
Given una ruta válida y datos de cliente
When se crea cliente con préstamo inicial
Then cliente, préstamo y movimiento de caja deben confirmarse juntos
And si una parte falla ninguna debe quedar aplicada
~~~

### AC-CLIENT-002 — Sin ruta

~~~gherkin
Given ninguna ruta seleccionada
When se intenta guardar cliente
Then la acción debe bloquearse con error visible
And caja y contadores no deben cambiar
~~~

### AC-CLIENT-003 — Ubicación no inventada

~~~gherkin
Given GPS denegado o sin señal
When se guarda el cliente
Then la ubicación debe quedar ausente o marcada aproximada
And no deben persistirse coordenadas demo como reales
~~~

### AC-CLIENT-004 — Identidad y edición

~~~gherkin
Given reglas aprobadas de cédula/teléfono
When se crea o edita
Then ambos flujos deben aplicar las mismas obligaciones y unicidad
And cambiar dirección debe invalidar o actualizar ubicación
~~~

## Préstamos y pagos

### AC-LOAN-001 — Contrato consistente

~~~gherkin
Given monto, tasa, cuotas y frecuencia
When se crea un préstamo
Then total, cuota y calendario deben ser matemáticamente consistentes
And todo valor manual debe indicar qué variable deriva
~~~

### AC-LOAN-002 — Varios préstamos

~~~gherkin
Given un cliente con dos saldos activos
When se registra un cobro rápido
Then el sistema debe exigir selección o aplicar una prioridad aprobada
And registrar a qué obligación se imputó
~~~

### AC-LOAN-003 — Ajustes auditables

~~~gherkin
Given un préstamo activo
When se aplica retaque, recargo o descuento
Then debe crearse un movimiento con actor, fecha y motivo
And debe poder revertirse mediante otro movimiento
~~~

### AC-PAY-001 — Pago parcial atómico

~~~gherkin
Given un usuario autorizado y una deuda pendiente
When registra un pago parcial
Then debe reducir el saldo
And conservar el total original
And registrar fecha, actor, método y caja
And la operación debe ser atómica
~~~

### AC-PAY-002 — Sobrepago

~~~gherkin
Given un saldo de 50.000
When se intenta pagar 70.000
Then debe aplicarse la política aprobada: rechazar, crédito o distribución
And nunca debe ocultarse el excedente mediante clamp
~~~

### AC-PAY-003 — Sin obligación

~~~gherkin
Given un cliente sin préstamo cobrable
When se intenta registrar pago
Then no debe cambiar la caja ni marcar visita como pagada
~~~

### AC-PAY-004 — Reverso

~~~gherkin
Given un pago registrado por error
When un usuario autorizado solicita reverso
Then el pago original debe conservarse
And un movimiento inverso debe restaurar saldo y caja
And quedar auditado
~~~

## Visitas y mapas

### AC-VISIT-001 — Resultado de visita

~~~gherkin
Given un cliente en una jornada
When el cobrador lo visita
Then debe registrar fecha, ruta, cobrador y resultado
And pago y no pagó deben ser resultados distintos
~~~

### AC-VISIT-002 — Jornada

~~~gherkin
Given visitas de ayer
When comienza una nueva jornada
Then no deben aparecer como visitadas hoy
And el historial anterior debe conservarse
~~~

### AC-MAP-001 — Privacidad/fallback

~~~gherkin
Given coordenadas de clientes
When se solicita routing externo
Then el proveedor/configuración debe cumplir la política de privacidad
And un fallo debe mostrar fallback/estado explícito
~~~

## Caja y cierre

### AC-CASH-001 — Caja diaria identificada

~~~gherkin
Given empresa, cobrador y fecha operativa
When se abre caja
Then todos los movimientos deben pertenecer a esa jornada
And no deben mezclarse con otro día o usuario
~~~

### AC-CASH-002 — Cierre snapshot

~~~gherkin
Given una caja en borrador
When el cobrador envía cierre
Then debe crearse un snapshot/version
And debe aparecer en la bandeja del administrador
~~~

### AC-CASH-003 — Aprobación

~~~gherkin
Given un cierre enviado
When el administrador aprueba
Then debe registrar actor y timestamp
And ninguna cifra debe cambiar sin reapertura o ajuste versionado
~~~

### AC-CASH-004 — Reapertura

~~~gherkin
Given un cierre aprobado
When un actor autorizado reabre
Then debe indicar motivo
And crear nueva versión
And conservar la versión aprobada anterior
~~~

### AC-CASH-005 — Permisos de visualización

~~~gherkin
Given una política que oculta capital/descuadre
When el cobrador consulta cierre o reporte
Then esos datos no deben ser entregados ni mostrados
And el administrador debe conservar acceso autorizado
~~~

### AC-CASH-006 — Gasto

~~~gherkin
Given una caja abierta
When se registra un gasto válido
Then debe crear movimiento con actor, ruta/categoría y evidencia si se exige
And reducir entregaEsperada
~~~

## Reportes y datos

### AC-REPORT-001 — Rango coherente

~~~gherkin
Given un rango y zona horaria
When se genera reporte
Then cada sección debe usar el mismo alcance temporal o declararlo
And el día final debe incluirse según límite exclusivo correcto
~~~

### AC-REPORT-002 — KPIs definidos

~~~gherkin
Given un dashboard
When muestra dinero en calle, interés, meta y recaudado
Then cada KPI debe tener fórmula, población y período documentados
~~~

### AC-DATA-001 — Backup por tenant

~~~gherkin
Given dos cuentas y demo en un dispositivo
When cada una respalda el mismo día
Then sus archivos no deben sobrescribirse
And ninguna debe restaurar datos de otra sin autorización
~~~

### AC-DATA-002 — Reset real

~~~gherkin
Given datos locales visibles
When se confirma reset autorizado
Then disco, memoria y providers deben quedar vacíos
And una nueva mutación no debe resucitar datos
~~~

### AC-DATA-003 — Restore validado

~~~gherkin
Given un backup con schema/owner/checksum
When se restaura
Then debe validarse completo antes de escribir
And ante fallo debe conservarse el estado previo
~~~

### AC-DATA-004 — Migración legacy

~~~gherkin
Given datos legacy sin propietario confiable
When inicia una cuenta
Then el sistema debe pedir confirmación o proceso de importación
And nunca asignarlos silenciosamente al primer usuario
~~~

### AC-DATA-005 — Archivos portables

~~~gherkin
Given fotos asociadas
When se respalda, sincroniza o migra
Then deben transferirse por ID/checksum
And no por path absoluto del dispositivo
~~~

## Seguridad, accesibilidad y operación

### AC-SEC-001 — Roles server-side

~~~gherkin
Given un usuario autenticado
When intenta modificar roles, plan o membresía
Then solo un servicio autorizado debe poder hacerlo
And reglas/API deben rechazar escrituras del cliente
~~~

### AC-SEC-002 — Build release

~~~gherkin
Given un artefacto de producción
When se firma
Then debe usar la identidad release protegida
And nunca la clave debug
~~~

### AC-A11Y-001 — Formulario accesible

~~~gherkin
Given un error de validación
When el usuario envía
Then el campo debe mostrar mensaje asociado
And recibir foco/anuncio accesible
~~~

### AC-A11Y-002 — Navegación escalable

~~~gherkin
Given text scale 200 por ciento y lector de pantalla
When se usa la barra inferior y flujos críticos
Then labels no deben recortarse
And el destino seleccionado debe anunciarse
~~~

### AC-OFFLINE-001 — Operación offline

~~~gherkin
Given una sesión autorizada y datos cacheados
When se pierde conexión
Then las operaciones permitidas deben encolarse idempotentemente
And la UI debe mostrar estado pendiente
And reconectar no debe duplicarlas
~~~

### AC-OBS-001 — Observabilidad segura

~~~gherkin
Given un fallo de persistencia, sync o pago
When se registra telemetría
Then debe incluir correlación y categoría
And excluir cédula, teléfono, dirección, saldo y tokens
~~~

