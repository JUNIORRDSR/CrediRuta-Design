# Módulo: préstamos

## Propósito y actores

Crear y administrar obligaciones, cuotas, ajustes, retaques y saldo. Actores: administrador y cobrador; el cliente es sujeto del préstamo pero no tiene cuenta AS-IS.

## AS-IS

El total combina capital, retaques, interés calculado sobre capital total, recargos y descuentos; se acota para no ser negativo. `cuotaManual` modifica el valor mostrado/esperado sin redefinir necesariamente el total. El saldo y progreso se limitan, de modo que un sobrepago queda en historial pero se oculta en saldo.

Retaque suma capital/cuotas y reaplica la tasa original sobre todo el capital, sin evento propio. Recargos/descuentos son acumuladores sin motivo, actor, límite o historial. Los formularios tienen defaults divergentes (20/24 cuotas, 20 % hardcodeado) y la configuración de mensualidades no se aplica. Importar cartera colapsa todo lo abonado en un único Pago fechado al inicio. Se permiten varios préstamos activos y los atajos toman el primero.

El estado temporal usa frecuencia convertida a 1/7/15/30 días, sin fecha explícita de primera cuota, festivos, gracia o política de mora.

**Clasificación:** A para la fórmula implementada/retaque actual; C/D/F para contrato, ajustes y calendario.

## INTENCIÓN INFERIDA

Representar créditos de cobro periódico, permitir refinanciación/valor fijo y conservar la cartulina histórica.

## TO-BE PROPUESTO

- Contrato inmutable del préstamo más calendario/cuotas explícitas.
- Comandos separados para desembolso, ajuste autorizado, refinanciación/retaque y cancelación.
- Ledger/eventos con motivo, actor, fecha efectiva e idempotencia.
- Invariantes: total coherente, descuentos limitados/autorizados, prioridad de imputación definida.
- Clock inyectable y calendario de negocio aprobado.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-LOANS-001…010, BR-CUSTOMERS-004/005/007, BR-CASH-005 |
| Flujos | UF-LOAN-001, UF-LOAN-002, UF-CLIENT-001, UF-PAY-001 |
| Datos | Prestamo, Pago, Cliente, Caja |
| Pantallas | nuevo préstamo, nuevo cliente, cartulina |
| Evidencia | `models/prestamo.dart:50-98`; `models/cliente.dart:43-90`; `nuevo_prestamo_screen.dart`; `cartulina_screen.dart:50-125,321-357` |
| Pruebas | cobertura indirecta en `cliente_test.dart`/`datos_demo_test.dart`; faltan fórmulas contractuales exhaustivas |

Resolver Q-B14, Q-B15, Q-I03, Q-I04, Q-I05 y Q-I06. Preservar cartulina/historial como intención; no copiar la fórmula hasta validar ejemplos reales.
