# Módulo: pagos

## Propósito y actores

Registrar cobros contra préstamos, actualizar saldo, caja y resultado de visita. Actor principal: cobrador; administrador también alcanza algunas acciones.

## AS-IS

El formulario acepta monto positivo y un tipo visual. Si existe préstamo crea `Pago`, usa el UID disponible como actor, guarda cartera, suma caja y marca visita. El texto “cuota” no verifica que el monto coincida con una cuota. Si el monto supera el saldo, el historial y la caja reciben el total mientras el saldo queda en cero. Si el préstamo es nulo, no crea Pago pero puede sumar caja, marcar visitado y mostrar éxito.

El cobro rápido del panel implementa reglas distintas: selecciona primer préstamo activo, convierte a entero, usa un actor literal y puede omitir errores silenciosamente. No existe reverso, anulación, método, referencia, recibo ni idempotency key. Guardar préstamo/ruta, caja y visita ocurre en pasos separados.

**Clasificación:** A para el camino feliz observable; C/D para variantes, sobrepago, ausencia de préstamo y atomicidad.

## INTENCIÓN INFERIDA

El cobrador registra un pago confiable en campo; la deuda, caja, visita e historial quedan consistentes y auditables aunque haya mala conexión.

## TO-BE PROPUESTO

- Comando `RegistrarPago` con préstamo, monto, fecha efectiva, método, actor e idempotency key.
- Validar monto y política de sobrepago/imputación antes de mutar.
- Una transacción local crea movimiento, aplicación a deuda, caja y visita; outbox sincroniza.
- Reverso compensatorio autorizado, nunca borrado silencioso.
- Un solo caso de uso para formulario y cobro rápido.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-PAYMENTS-001…006, BR-LOANS-003/009, BR-DATA-004, BR-CASH-001/002 |
| Flujos | UF-PAY-001, UF-VISIT-001, UF-CLOSE-001 |
| Datos | Pago, Prestamo, Caja, visita implícita |
| Pantallas | registrar pago, panel de rutas, cartulina |
| Evidencia | `registrar_pago_screen.dart:39-164`; `panel_rutas_screen.dart:401-448`; `models/prestamo.dart:74-81`; `caja_state.dart:114-120` |
| Pruebas | no hay prueba de flujo completo/transacción/reverso |

Resolver Q-B15 y política de métodos/recibos. Conservar la rapidez de captura; eliminar duplicación y éxitos parciales.
