# 12. Diccionario de datos

## Convenciones

- “Sí” significa requerido por el constructor/flujo principal, no necesariamente validado en todos los caminos.
- Los importes son enteros COP.
- DateTime se serializa ISO-8601 usando reloj/local timezone del dispositivo.
- Fuente abreviada refiere a cobros_app/lib/.

## Usuario

| Entidad | Campo | Tipo | Obligatorio | Valor por defecto | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| Usuario | id | String | Sí | — | UID Firebase o ID demo; document ID/namespace | AUTH-001, DATA-001 | models/usuario.dart:5 |
| Usuario | nombre | String | Sí | — | Nombre visible | AUTH-003 | usuario.dart:6 |
| Usuario | roles | Set<Rol> | Sí | JSON puede vacío | Capacidades admin/cobrador | AUTH-002, AUTH-015 | usuario.dart:7 |
| Usuario | usuario | String | Sí | JSON '' | Duplica correo en real; alias en demo | AUTH-010 | usuario.dart:8 |
| Usuario | suscripcionActiva | bool | No | false | Entitlement declarado pero no aplicado | AUTH-013 | usuario.dart:9 |
| Usuario | mesesSuscripcion | int | No | 0 | Contador sin uso efectivo | AUTH-013 | usuario.dart:10 |
| Usuario | correo | String | No | '' | PII; duplica usuario en cuentas reales | AUTH-003 | usuario.dart:13 |
| Usuario | emailVerificado | bool | No | false | Copia/cache; Auth es fuente real | AUTH-007 | usuario.dart:14 |
| Usuario | creado | DateTime | No | now | Base de verificación/prueba | AUTH-007 | usuario.dart:15 |
| Usuario | nombreNegocio | String | No | '' | Negocio; casi sin consumo | AUTH-003 | usuario.dart:16 |
| Usuario | plan | Plan | No | planYa | Solo un valor posible | SUB-001 | usuario.dart:17 |
| Usuario | administradorId | String? | No | null | UID, código o literal demo según flujo | TEAM-002, AUTH-005 | usuario.dart:20 |

Derivados: esAdministrador, esCobrador, limiteVerificacion, horasParaVerificar, verificacionVencida, finPrueba y diasPruebaRestantes.

## Ruta

| Entidad | Campo | Tipo | Obligatorio | Valor por defecto | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| Ruta | id | String | Sí | — | ID local por milisegundos | ROUTES-003, 012 | models/ruta.dart:4 |
| Ruta | nombre | String | Sí | — | Nombre visible | ROUTES-003, 007 | ruta.dart:5 |
| Ruta | frecuencia | Frecuencia | Sí | — | Cobro diaria/semanal/quincenal/mensual | LOANS-010 | ruta.dart:6 |
| Ruta | estado | EstadoRuta | Sí | nueva=pending | Estado manual | ROUTES-005 | ruta.dart:7 |
| Ruta | cobradorId | String | Sí | JSON '' | Referencia no validada/sentinel | TEAM-006 | ruta.dart:8 |
| Ruta | totalClientes | int | No | 0 | Duplicado de longitud real | ROUTES-012 | ruta.dart:12 |
| Ruta | fotoPath | String? | No | null | Path local potencialmente temporal | ROUTES-004 | ruta.dart:15 |
| Ruta | descripcion | String? | No | null | Texto opcional | ROUTES-007 | ruta.dart:16 |
| Ruta | fechaVencimiento | DateTime? | No | null | Fuente de pagada/días restantes | ROUTES-005, 006 | ruta.dart:17 |

Derivados: soloLectura, pagada y diasRestantes.

## Cliente

| Entidad | Campo | Tipo | Obligatorio | Valor por defecto | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| Cliente | id | String | Sí | — | ID local por milisegundos | ROUTES-012 | models/cliente.dart:5 |
| Cliente | nombre | String | Sí | — | Nombre | CUSTOMERS-001 | cliente.dart:6 |
| Cliente | cedula | String | Alta sí; edición no | JSON '' | Identificación PII; no única | CUSTOMERS-001 | cliente.dart:7 |
| Cliente | telefono | String | Alta sí; edición no | JSON '' | Contacto PII | CUSTOMERS-001, GEO-003 | cliente.dart:8 |
| Cliente | direccion | String | Sí | JSON '' | Domicilio PII | CUSTOMERS-001, GEO-001 | cliente.dart:9 |
| Cliente | lat | double? | No | null | Latitud; puede ser sintética | GEO-001 | cliente.dart:10 |
| Cliente | lng | double? | No | null | Longitud; puede ser sintética | GEO-001 | cliente.dart:11 |
| Cliente | numeroBoleta | String? | No | null | Campo editable sin regla clara | CUSTOMERS-009 | cliente.dart:12 |
| Cliente | valorBoleta | int? | No | null | Campo muerto; no vinculado a caja | CUSTOMERS-009 | cliente.dart:13 |
| Cliente | fotoPath | String? | No | null | Path absoluto o URL remota | DATA-006 | cliente.dart:16 |
| Cliente | esClavo | bool | No | false | Marca manual de riesgo | CUSTOMERS-006 | cliente.dart:17 |
| Cliente | estado | EstadoCliente | No | activo | Persistido pero ignorado por UI | CUSTOMERS-006 | cliente.dart:18 |
| Cliente | prestamos | List<Prestamo> | No | [] | Obligaciones anidadas | CUSTOMERS-004, 007 | cliente.dart:22 |
| Cliente | direccionesAnteriores | List<String> | No | [] | Histórico parcial | CUSTOMERS-008 | cliente.dart:24 |

Derivados: prestamosActivos, prestamoActivo, saldoTotal, pagadoTotal, capitalPrestado, liquidado, adelantado, atrasado y alDia.

## Prestamo

| Entidad | Campo | Tipo | Obligatorio | Valor por defecto | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| Prestamo | id | String | Sí | — | ID local | PAYMENTS-006 | models/prestamo.dart:5 |
| Prestamo | capital | int | Sí | — | Principal inicial | LOANS-001 | prestamo.dart:6 |
| Prestamo | interesPct | double | Sí | — | Fracción, 0.20=20% | LOANS-001, 006 | prestamo.dart:7 |
| Prestamo | frecuencia | Frecuencia | Sí | — | Ritmo de cuota | LOANS-010 | prestamo.dart:8 |
| Prestamo | numCuotas | int | Sí | — | Cuotas; mutable por retaque | LOANS-002, 004 | prestamo.dart:9 |
| Prestamo | fecha | DateTime | Sí | — | Inicio del préstamo | CUSTOMERS-005 | prestamo.dart:10 |
| Prestamo | pagos | List<Pago> | No | [] | Historial anidado | PAYMENTS-001 | prestamo.dart:11 |
| Prestamo | retacado | int | No | 0 | Capital adicional acumulado | LOANS-004 | prestamo.dart:15 |
| Prestamo | valorFijo | bool | No | false | Fuerza interés efectivo 0 | LOANS-007 | prestamo.dart:19 |
| Prestamo | descripcion | String? | No | null | Concepto/artículo | LOANS-007 | prestamo.dart:22 |
| Prestamo | cuotaManual | int? | No | null | Sustituye valorCuota, no total | LOANS-002 | prestamo.dart:26 |
| Prestamo | recargo | int | No | 0 | Multa acumulada sin eventos | LOANS-005 | prestamo.dart:29 |
| Prestamo | descuento | int | No | 0 | Descuento acumulado sin tope real | LOANS-005 | prestamo.dart:32 |

Derivados: tipoEtiqueta, interesEfectivo, capitalTotal, total, plazoDias, valorCuota, pagado, saldo, avance y cuotasPagadas.

## Pago

| Entidad | Campo | Tipo | Obligatorio | Valor por defecto | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| Pago | id | String | Sí | — | ID local | PAYMENTS-006 | models/pago.dart:4 |
| Pago | monto | int | Sí | — | Valor abonado; puede sobrepagar | PAYMENTS-002 | pago.dart:5 |
| Pago | tipo | TipoPago | Sí | — | Clasificación de pago | PAYMENTS-001, 004 | pago.dart:6 |
| Pago | fecha | DateTime | Sí | — | Fecha/hora local | PAYMENTS-001 | pago.dart:7 |
| Pago | registradoPor | String | Sí | JSON '' | UID o literales heterogéneos | PAYMENTS-004, 006 | pago.dart:8 |

## Gasto

| Entidad | Campo | Tipo | Obligatorio | Valor por defecto | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| Gasto | id | String | Sí | — | ID local | CASH-004 | models/gasto.dart:2 |
| Gasto | nombre | String | Sí | — | Concepto | CASH-001, 004 | gasto.dart:3 |
| Gasto | monto | int | Sí | — | Valor positivo | CASH-004 | gasto.dart:4 |
| Gasto | fecha | DateTime | Sí | — | No se filtra por jornada | CASH-006 | gasto.dart:5 |
| Gasto | nota | String | No | '' | Detalle opcional | CASH-004 | gasto.dart:6 |

Faltan rutaId, cobradorId, autor, categoría, aprobación y comprobante.

## Invitacion

| Entidad | Campo | Tipo | Obligatorio | Valor por defecto | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| Invitacion | codigo | String | Sí | — | Identificador de 6 caracteres | TEAM-001 | models/invitacion.dart:6 |
| Invitacion | rol | Rol | Sí | — | Rol propuesto; canje lo ignora | TEAM-003 | invitacion.dart:7 |
| Invitacion | creada | DateTime | Sí | — | Fecha local | TEAM-001 | invitacion.dart:8 |
| Invitacion | vence | DateTime | Sí | +2h al generar | Expiración local | TEAM-001 | invitacion.dart:9 |
| Invitacion | usada | bool | No | false | Puede no persistir | TEAM-002, 003 | invitacion.dart:10 |

Derivados: vencida, valida y enlace.

## CierreHistorico

| Entidad | Campo | Tipo | Obligatorio | Valor por defecto | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| CierreHistorico | id | String | Sí | — | Solo se genera en simulación | CASH-009 | models/cierre_historico.dart:2 |
| CierreHistorico | fecha | DateTime | Sí | — | Fecha snapshot | CASH-009 | cierre_historico.dart:3 |
| CierreHistorico | cobrado | int | Sí | — | Total cobrado | CASH-002 | cierre_historico.dart:4 |
| CierreHistorico | boletas | int | Sí | — | Total boletas | CASH-003 | cierre_historico.dart:5 |
| CierreHistorico | gastos | int | Sí | — | Total gastos | CASH-004 | cierre_historico.dart:6 |
| CierreHistorico | prestado | int | Sí | — | Desembolsos | CASH-005 | cierre_historico.dart:7 |
| CierreHistorico | entregaEsperada | int | Sí | — | Derivable, almacenado | CASH-002 | cierre_historico.dart:8 |
| CierreHistorico | efectivoContado | int | Sí | — | Valor contado | CASH-007 | cierre_historico.dart:9 |
| CierreHistorico | descuadre | int | Sí | — | Derivable, almacenado | CASH-002 | cierre_historico.dart:10 |
| CierreHistorico | cobradorId | String | Sí | cobrador-demo legacy | Relación sin FK | TEAM-006 | cierre_historico.dart:11 |

## Caja

Caja no tiene clase de modelo separada; CajaState serializa un mapa.

| Entidad | Campo | Tipo | Obligatorio | Valor por defecto | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| Caja | gastos | List<Gasto> | No | [] | Gastos acumulados | CASH-004 | caja_state.dart:23 |
| Caja | invitaciones | List<Invitacion> | No | [] | Invitaciones locales | TEAM-001 | caja_state.dart:26 |
| Caja | cobradoHoy | int | No | 0 | Cobros sin fecha operativa | CASH-006 | caja_state.dart:29 |
| Caja | prestadoHoy | int | No | 0 | Desembolsos acumulados | CASH-005 | caja_state.dart:30 |
| Caja | boletasCobradas | int | No | 0 | Total agregado sin movimientos | CASH-003 | caja_state.dart:31 |
| Caja | porcentajeBoletaAdmin | double | No | 0.5 | Reparto 0..1 | CASH-003 | caja_state.dart:38 |
| Caja | clientesNuevosHoy | int | No | 0 | Contador acumulado | CUSTOMERS-003 | caja_state.dart:49 |
| Caja | frecuenciaEntrega | String | No | diaria | Etiqueta sin efecto | CASH-010 | caja_state.dart:52 |
| Caja | efectivoContado | int? | No | null | Efectivo digitado | CASH-007 | caja_state.dart:57 |
| Caja | cierreEnviado | bool | No | false | Gate parcial | CASH-007, 008 | caja_state.dart:58 |
| Caja | cierreAprobado | bool | No | false | Aprobación mutable | CASH-007, 008 | caja_state.dart:59 |
| Caja | mostrarPrestado | bool | No | true | Flag decorativo | TEAM-007 | caja_state.dart:76 |
| Caja | mostrarGastos | bool | No | true | Flag decorativo | TEAM-007 | caja_state.dart:77 |
| Caja | mostrarDescuadre | bool | No | false | Flag decorativo | TEAM-007 | caja_state.dart:78 |
| Caja | mostrarBoletas | bool | No | true | Flag decorativo | TEAM-007 | caja_state.dart:79 |
| Caja | mostrarCapital | bool | No | false | Flag decorativo | TEAM-007 | caja_state.dart:80 |
| Caja | mostrarCobrado | bool | No | true | Flag decorativo | TEAM-007 | caja_state.dart:81 |

Faltan fecha operativa, tenant, ruta, cobrador, moneda, versión y timestamps.

## PlanInfo

| Entidad | Campo | Tipo | Obligatorio | Valor actual | Descripción | Reglas relacionadas | Fuente |
|---|---|---|---|---|---|---|---|
| PlanInfo | nombre | String | Sí | Plan Ya | Nombre comercial | SUB-001 | models/plan.dart:12 |
| PlanInfo | precioMensual | int | Sí | 20000 | COP/mes | SUB-001 | plan.dart:13 |
| PlanInfo | maxClientes | int | Sí | -1 | Ilimitado | SUB-001 | plan.dart:14 |
| PlanInfo | maxRutas | int | Sí | -1 | Ilimitado | SUB-001 | plan.dart:15 |
| PlanInfo | maxUsuarios | int | Sí | -1 | Ilimitado | SUB-001 | plan.dart:16 |
| PlanInfo | descripcion | String | Sí | texto comercial | Descripción | SUB-001 | plan.dart:17 |

La pantalla por ruta vuelve a hardcodear precios distintos por plazo.

## Enums

| Enum | Valores | Uso |
|---|---|---|
| Rol | administrador, cobrador | Navegación/perfil |
| Frecuencia | diaria, semanal, quincenal, mensual | Ruta/préstamo |
| EstadoRuta | prueba, pendiente, activa, porVencer, vencida | UI/bloqueo |
| EstadoCliente | activo, adelantado, atrasado, liquidado, archivado | Persistido casi muerto |
| TipoPago | parcial, exacto, multiple, adicional, retaque, abono | Pago/importación |
| Plan | planYa | Suscripción |

## Datos sensibles

- cédula;
- teléfono;
- dirección;
- lat/lng;
- foto;
- saldo/préstamos/pagos;
- gastos/caja/descuadre;
- correo/nombre de negocio.

Se almacenan o exportan sin cifrado de aplicación.

