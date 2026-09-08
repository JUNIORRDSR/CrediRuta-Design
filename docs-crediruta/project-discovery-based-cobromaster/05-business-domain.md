# 05. Dominio de negocio

## Problema que intenta resolver

La aplicación busca digitalizar la operación diaria de un negocio que presta dinero o vende a crédito y cobra en rutas:

- registrar clientes y su ubicación;
- desembolsar préstamos;
- calcular interés, cuota y saldo;
- recorrer clientes;
- registrar pagos, no pagos, retaques y gastos;
- conciliar el efectivo que el cobrador entrega;
- supervisar rutas y equipo;
- reportar cartera y recaudo.

## Subdominios

| Subdominio | Núcleo | Estado |
|---|---|---|
| Cartera | Cliente, Prestamo, Pago, ajustes | Central; reglas incompletas |
| Operación de campo | Ruta, orden, visita, GPS, contacto | Central; visita no modelada |
| Tesorería | Caja, gasto, entrega, descuadre, cierre | Central; no tiene jornada |
| Organización | Empresa, equipo, membresía, roles | Pretendido; no modelado de forma estable |
| Comercial | Plan, suscripción, cupón, Wompi | Prototipo contradictorio |
| Identidad | Auth, perfil, verificación | Parcialmente real |
| Informes | KPIs, Excel, backup | Implementado con scopes inconsistentes |

## Agregados actuales e implícitos

- **Ruta** contiene clientes por una relación externa en clientesPorRuta.
- **Cliente** embebe préstamos.
- **Prestamo** embebe pagos.
- **Caja** embebe gastos e invitaciones y acumula contadores.
- **Usuario** mezcla identidad, rol, plan y relación de equipo.

Agregados faltantes que el comportamiento necesita:

- Empresa/Equipo;
- Membresía;
- Jornada/CajaDiaria;
- Visita;
- MovimientoPrestamo;
- MovimientoCaja;
- Suscripción/Entitlement;
- Archivo/Adjunto;
- Invitación remota.

## Reglas financieras AS-IS

~~~text
capitalTotal = capital + retacado
totalPrestamo = max(0, round(capitalTotal
                    + capitalTotal * interesEfectivo
                    + recargo - descuento))
pagado = suma(pagos.monto)
saldo = clamp(totalPrestamo - pagado, 0, totalPrestamo)
valorCuota = cuotaManual o round(totalPrestamo / numeroCuotas)

entregaEsperada = cobrado + boletas - gastos - prestado
descuadre = efectivoContado - entregaEsperada
~~~

Evidencia: **prestamo.dart:54-81**, **caja_state.dart:67-74**.

## Estados de cartera

AS-IS:

- liquidado: tiene préstamos y ninguno con saldo;
- adelantado: todos los activos llevan al menos dos cuotas por encima de lo esperado;
- atrasado: algún activo lleva menos cuotas que días/frecuencia;
- al día: tiene activo y no está atrasado ni adelantado.

La cuota esperada se deriva de días transcurridos divididos entre 1, 7, 15 o 30. No hay calendario real, primera fecha, festivos ni gracia.

El campo EstadoCliente se persiste pero no gobierna estos cálculos. “Clavo” rompe varias proyecciones visuales. Véase BR-CUSTOMERS-005 y 006.

## Intención por módulo

| Módulo | Problema del cliente | Resultado esperado | Evidencia | Certeza |
|---|---|---|---|---|
| Rutas | Organizar cartera territorial | Lista y orden de visita | mapas/panel/orden | Alta |
| Clientes | Identificar y contactar deudor | Ficha con ubicación e historial | alta/edición/cartulina | Alta |
| Préstamos | Llevar saldo y condiciones | Cuota, total, historial y ajustes | modelo/UI | Alta |
| Pagos | Registrar recaudo | Bajar saldo y subir caja | pago/fast pay | Alta |
| Caja | Conciliar jornada | Entrega y descuadre aprobados | cierre/resumen | Alta |
| Equipo | Coordinar admin/cobradores | Asignación y supervisión | invitación/equipo | Alta general |
| Suscripción | Monetizar uso | Entitlement vigente | Plan Ya/bloqueo | Media |
| Reporte | Tomar decisiones y rendir cuentas | KPIs y archivos por período | resumen/Excel | Alta |

## Decisiones completas

- pesos enteros, sin centavos;
- cuatro frecuencias convertidas a días;
- varios préstamos por cliente;
- valor fijo sin interés;
- retaque incrementa capital;
- gastos restan entrega;
- porcentaje de boletas se acota 0..1;
- backup local conserva siete archivos.

Son A como comportamiento actual, no necesariamente requisitos definitivos.

## Decisiones incompletas o mal interpretadas

- la caja se llama “hoy” pero no tiene fecha;
- la visita es un Set de IDs, no un evento;
- “clavo” se mezcla con estado de mora;
- estado de ruta y vigencia son independientes;
- el retaque recalcula interés sobre todo el capital, sin evidencia contractual;
- cuota manual puede no cuadrar con total;
- importación pierde el historial;
- boleta aparece en tres formas no relacionadas;
- Plan Ya se cobra por usuario y también por ruta;
- membresía usa administradorId como UID, código o literal demo.

## Invariantes candidatas TO-BE

Estas son propuestas, no requisitos confirmados:

1. Toda operación pertenece a una empresa.
2. Todo pago referencia exactamente una obligación y una caja.
3. Ninguna operación financiera se elimina; se revierte.
4. Saldo y caja cambian en una transacción lógica.
5. Una caja se identifica por fecha operativa, cobrador y empresa.
6. Un cierre aprobado es inmutable; las correcciones crean versión o ajuste.
7. Un rol privilegiado no puede ser autoasignado por el cliente.
8. Toda media tiene ID portable, propietario y checksum.
9. Fechas de sincronización usan UTC/server time; fechas de negocio conservan zona.
10. Estados derivados no se duplican sin una fuente de verdad.

## Requisitos no resolubles

- calendario de cobro;
- política de sobrepago;
- varios préstamos activos y prioridad;
- definición de boleta;
- modelo de suscripción;
- autoridad para recargos/descuentos;
- política de borrado/archivo;
- alcance exacto por cobrador;
- tratamiento de días no laborables;
- significado y consecuencias de “clavo”.

Se trasladan, con contexto, a [21-client-questions.md](21-client-questions.md).

