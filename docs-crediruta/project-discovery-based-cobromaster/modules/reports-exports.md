# Módulo: reportes y exportaciones

## Propósito y actores

Mostrar KPIs de cartera/caja y exportar información para seguimiento. Actor principal: administrador; existe una pantalla de cobrador huérfana.

## AS-IS

El resumen combina capital histórico, saldo, pagos, interés, recargos y descuentos mediante lecturas directas de `DatosDemo` y Caja. El progreso usa `cobradoHoy / entregaEsperada`, por lo que gastos/desembolsos cambian la aparente meta. El export XLSX permite rango, pero el rango solo filtra cierres; clientes, cartera, caja y gastos permanecen globales.

El estado exportado simplifica adelantado/atrasado/al día y puede etiquetar liquidados/clavos de forma distinta a la cartulina. `ReporteCobranzaScreen` recorre todas las rutas/histórico, contiene una acción PDF vacía y no está en navegación. Share/filesystem dependen del dispositivo.

**Clasificación:** C/D para KPIs, rango y estados; D/E para reporte huérfano/PDF.

## INTENCIÓN INFERIDA

Dar al administrador una vista confiable de cartera, cobranza, rentabilidad y cierres por periodo/ruta/cobrador, con export verificable.

## TO-BE PROPUESTO

- Catálogo de métricas con nombre, fórmula, alcance, zona y fuente.
- Read models derivados de ledger/snapshots, con filtros aplicados a todo el conjunto.
- Export encabezado por periodo, empresa, timezone, versión y fecha de generación.
- Paridad entre chips/UI/export y pruebas golden de datos.
- Procesamiento fuera del hilo UI para volúmenes grandes.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-REPORTS-001…005, BR-CUSTOMERS-005/006, BR-CASH-002/006 |
| Flujos | UF-REPORT-001, UF-REPORT-002, UF-ADMIN-001 |
| Datos | Ruta, Cliente, Prestamo, Pago, Caja, CierreHistorico |
| Pantallas | resumen admin, reporte/export, reporte cobranza huérfano |
| Integraciones | excel, path_provider, share_plus, filesystem |
| Evidencia | `admin_resumen_screen.dart:22-327`; `reporte_screen.dart:40-159`; `reporte_cobranza_screen.dart:15-95` |
| Pruebas | ninguna prueba de fórmulas/export/rangos; solo datos subyacentes parciales |

Resolver Q-I14. Conservar las necesidades de reporte, no las fórmulas hasta validarlas con ejemplos contables.
