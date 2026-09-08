# Módulo: caja, gastos y cierres

## Propósito y actores

Conciliar desembolsos, cobros, boletas y gastos de una jornada; enviar, aprobar y consultar cierres. Actores: cobrador y administrador.

## AS-IS

`CajaState` acumula `cobradoHoy`, `prestadoHoy`, boletas, gastos, efectivo y configuración. Calcula `entregaEsperada = cobrado + boletas - gastos - prestado` y `descuadre = efectivo - entrega`. Los mutadores aceptan positivos; Gasto guarda concepto, monto, fecha y nota, sin autor/ruta/categoría.

“Hoy” no tiene fecha/scope y no se reinicia al cambiar el día, por lo que valores y gastos se acumulan. Enviar/aprobar/reabrir cambia banderas; aprobado permanece editable y las mutaciones posteriores no invalidan la aprobación. El flujo normal no crea un `CierreHistorico` inmutable; los históricos provienen de demo o disco. Frecuencia de entrega y switches de visibilidad no gobiernan la conducta.

**Clasificación:** A para fórmulas y transiciones implementadas; C/D para jornada, mutabilidad e histórico.

## INTENCIÓN INFERIDA

El cobrador liquida una jornada; el administrador verifica lo entregado, registra diferencia y conserva un histórico auditable.

## TO-BE PROPUESTO

- Jornada identificada por empresa, cobrador, ruta(s), fecha operativa y zona.
- Ledger de movimientos tipados; los totales son proyecciones, no campos mutables independientes.
- Máquina `abierta → enviada → aprobada/rechazada`; una aprobación congela snapshot/hash.
- Reapertura excepcional o ajuste posterior con permiso, motivo y auditoría.
- Gastos con autor, categoría, comprobante, estado de aprobación y sincronización.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-CASH-001…010, BR-DATA-003/004, BR-REPORTS-002 |
| Flujos | UF-EXPENSE-001, UF-CLOSE-001, UF-CLOSE-002 |
| Datos | Caja, Gasto, CierreHistorico, Pago, Prestamo |
| Pantallas | gastos, cierre del día, historial, home/resumen |
| Evidencia | `caja_state.dart:23-178,225-395`; `models/gasto.dart`; `models/cierre_historico.dart`; `cierre_dia_screen.dart` |
| Pruebas | `caja_state_test.dart`; faltan medianoche, cierre real, permisos y concurrencia |

Resolver Q-B10, Q-B11, Q-B12, Q-B13 y Q-I03. No migrar contadores como libro contable; migrar eventos/snapshots reconciliados.
