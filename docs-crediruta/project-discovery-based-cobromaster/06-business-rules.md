# 06. Reglas de negocio

## Resumen

Se reconstruyeron 95 reglas:

| Clase | Cantidad |
|---|---:|
| A — confirmadas | 27 |
| B — inferidas | 3 |
| C — inconsistentes | 22 |
| D — defectuosas | 36 |
| E — accidentales | 5 |
| F — no resolubles | 2 |
| **Total** | **95** |

La clase no equivale a prioridad. La severidad se detalla en [16-errors-and-edge-cases.md](16-errors-and-edge-cases.md) y [17-technical-debt.md](17-technical-debt.md).

## Autenticación y sesión

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-AUTH-001 | Auth | Enrutamiento por sesión/rol | Cambia AuthState | Landing, verificación, admin, unión o cobrador; perfil sin rol vuelve a landing | app.dart:28-39 | A | Alta |
| BR-AUTH-002 | Auth | Precedencia de roles | Usuario contiene uno o ambos roles | Admin prevalece salvo simularCobrador | usuario.dart:37-38; app.dart:35-37 | A | Alta |
| BR-AUTH-003 | Auth | Registro Firebase | Nombre/correo/rol presentes | Crea Auth, envía verificación y escribe perfil con suscripción activa | auth_state.dart:105-149 | A | Alta |
| BR-AUTH-004 | Registro | Unión tiene pasos incoherentes | Variante unirseEquipo llega a índice 2 | Se intenta registrar antes de mostrar Seguridad; password vacío bloquea el flujo | registro_flujo_screen.dart:38,102-146,179-192 | D | Alta |
| BR-AUTH-005 | Registro | Código no se valida | Se registra cobrador con cualquier código no nulo | El texto queda como administradorId y evita pantalla de unión | registro_flujo_screen.dart:124-138; auth_state.dart:127-139 | D | Alta |
| BR-AUTH-006 | Registro | Pago previo simulado | Admin confirma diálogo COP 20.000 | Un boolean local habilita registro; no existe transacción | registro_flujo_screen.dart:116-120,149-161 | B | Alta |
| BR-AUTH-007 | Verificación | Plazo de 24 h contradictorio | Usuario no verificó correo | Queda bloqueado de inmediato; plazo solo cambia texto | usuario.dart:40-59; app.dart:31-34 | D | Alta |
| BR-AUTH-008 | Recuperación | Fallback eleva privilegio | Falla/ausencia de perfil Firestore | Se crea perfil mínimo con rol administrador; si reload falla no restaura sesión | auth_state.dart:72-103 | D | Alta |
| BR-AUTH-009 | Google | Alta por defecto | Usuario Google nuevo | Se crea administrador con plan y suscripción activa | auth_state.dart:166-205 | A | Alta |
| BR-AUTH-010 | Login | UI promete teléfono | Usuario introduce teléfono | Se intenta signInWithEmailAndPassword | login_screen.dart:110-145; auth_state.dart:151-163 | C | Alta |
| BR-AUTH-011 | Demo | Namespace persistente | Se entra de nuevo a demo | Usa namespace fijo y no garantiza reinicio del seed | auth_state.dart:249-272; datos_demo.dart:17-24 | A | Alta |
| BR-AUTH-012 | Sesión | Logout incompleto | Usuario sale o signOut falla | Oculta sesión, pero no limpia simulación, equipo, namespace ni providers | auth_state.dart:380-390 | D | Alta |
| BR-AUTH-013 | Suscripción | Prueba no protege | Vence prueba o suscripción inactiva | Ningún guard consume entitlement del usuario | plan.dart:5-9; usuario.dart:53-60 | D | Alta |
| BR-AUTH-014 | Rol | Activar/impersonar solo memoria | Pago simulado o admin impersona | Cambia Usuario local; no persiste perfil | auth_state.dart:322-378; usuario.dart:62-82 | D | Alta |
| BR-AUTH-015 | Seguridad | Perfil privilegiado editable | Dueño escribe usuarios/{uid} | Puede modificar roles, plan y vínculo; alta parcial no es recuperable | firestore.rules:5-8; auth_state.dart:121-147 | D | Media-alta |

## Equipo e invitaciones

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-TEAM-001 | Invitación | Código de seis caracteres | Admin genera invitación | Random.secure, vence por defecto en 2 h; sin chequeo de colisión con lista | caja_state.dart:198-220; invitacion_test.dart:10-24 | A | Alta |
| BR-TEAM-002 | Equipo | Unión simulada | Código coincide con lista local | Marca usada en memoria, fija demo-administrador y activa usuario local | auth_state.dart:293-319 | D | Alta |
| BR-TEAM-003 | Equipo | Rol/uso no respetados | Se canjea invitación | Ignora rol y no persiste inmediatamente usada=true | invitacion_screen.dart:38-55; auth_state.dart:295-315 | D | Alta |
| BR-TEAM-004 | Equipo | Cuentas no comparten operación | Admin y cobrador usan UID distintos | Cada uno ve su namespace; nube está apagada | local_store.dart:12-30; cloud_sync_service.dart:12-17 | D | Alta |
| BR-TEAM-005 | Equipo | Lista con ciclo incorrecto | Login real/cambio de cuenta | No carga al login ni limpia al salir | auth_state.dart:270-290,337,380-390 | D | Alta |
| BR-TEAM-006 | Rutas | cobrador-demo significa libre | Se desasigna o remueve cobrador | Asigna sentinel ficticio; reasigna sin integridad remota | auth_state.dart:335-360 | C | Alta |
| BR-TEAM-007 | Permisos | Switches no tienen efecto | Admin cambia visibilidad | Config global de Caja; ninguna pantalla la consume | caja_state.dart:76-82,180-196; config_cobrador_screen.dart | D | Alta |
| BR-TEAM-008 | Supervisión | Datos simulados parecen reales | Admin abre cobradores | GPS/actividad/caja se derivan de constantes y caja global | gestion_cobradores_screen.dart:114-231 | E | Alta |

## Rutas y visitas

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-ROUTES-001 | Rutas | Selección global | Inicializar/cambiar ruta | Elige primera; limpia búsqueda, no visitados | route_state.dart:30-50,77-82 | A | Alta |
| BR-ROUTES-002 | Rutas | Cobrador ve todas | Abre PanelRutas | No filtra por cobradorId | route_state.dart:329-332; panel_rutas_screen.dart:47-83 | D | Alta |
| BR-ROUTES-003 | Rutas | Alta pendiente | Admin crea ruta | ID por milisegundo, estado pendiente, sin vencimiento, queda seleccionada | route_state.dart:213-238 | A | Alta |
| BR-ROUTES-004 | Rutas | Asignación/foto temporal | Admin crea ruta | Cobradores hardcodeados; path de picker no se estabiliza; “Ir a Pago” vuelve | crear_ruta_screen.dart:26-55,112-169,357-370 | C | Alta |
| BR-ROUTES-005 | Rutas | Estado y vigencia separados | Cambia estado/fecha | Puede estar activa e impaga o vencida y pagada | ruta.dart:31-40; gestion_rutas_screen.dart:49-65 | C | Alta |
| BR-ROUTES-006 | Rutas | Renovación desde mayor fecha | Se pagan meses | Suma meses calendario y fuerza activa | route_state.dart:270-287 | A | Alta |
| BR-ROUTES-007 | Rutas | Editar/borrar en cascada | Admin confirma | Cambia campos no nulos; borrar elimina clientes y préstamos sin archivo | route_state.dart:240-268,311-320 | A | Alta |
| BR-ROUTES-008 | Cupón | Reglas impiden cupón | Se consulta cupones/{codigo} | Toda lectura queda denegada; errores retornan cero | route_state.dart:289-309; firestore.rules:10-14 | D | Media-alta |
| BR-ROUTES-009 | Clientes | Búsqueda de ruta | Hay ruta y texto | Subcadena en nombre, cédula y teléfono | route_state.dart:84-100 | A | Alta |
| BR-ROUTES-010 | Visita | Visitado no representa día | Pago o “no pagó” | Set en memoria, sin fecha, ruta, motivo ni persistencia | route_state.dart:24-25,102-148 | D | Alta |
| BR-ROUTES-011 | Acceso | Bloqueo evadible | Ruta impaga/vencida o cierre enviado | Panel bloquea; Clientes y Modo Carretera permiten mutar | panel_rutas_screen.dart:61-106; modo_carretera_screen.dart:461-469 | D | Alta |
| BR-ROUTES-012 | Datos | IDs/contadores frágiles | Altas rápidas o mutaciones externas | IDs pueden colisionar; totalClientes duplica lista; colecciones expuestas | route_state.dart:58-69,221,329-332 | E | Alta |

## Clientes

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-CUSTOMERS-001 | Cliente | Validación inconsistente | Crear vs editar | Crear exige 4 campos; editar solo nombre/dirección; sin formato/unicidad | nuevo_cliente_screen.dart:293-340; editar_cliente_screen.dart:178-204 | C | Alta |
| BR-CUSTOMERS-002 | Cliente | Desembolso fantasma | Monto >0 y cuotas=0 | No crea préstamo, pero incrementa prestadoHoy | nuevo_cliente_screen.dart:193-226 | D | Alta |
| BR-CUSTOMERS-003 | Cliente | Alta sin ruta aparenta éxito | No hay ruta seleccionada | Estado retorna silencioso; Caja cambia y pantalla cierra | nuevo_cliente_screen.dart:221-228; route_state.dart:152-156 | D | Alta |
| BR-CUSTOMERS-004 | Cliente | Agregados multi-préstamo | Se consulta resumen | Saldo/pagado/capital suman todos; liquidado requiere al menos uno | cliente.dart:43-63 | A | Alta |
| BR-CUSTOMERS-005 | Cartera | Estado por cuotas esperadas | Pasa tiempo/pagos | floor(días/frecuencia); adelantado +2 en todos; atrasado si alguno | cliente.dart:65-90; cliente_test.dart | A | Alta |
| BR-CUSTOMERS-006 | Estado | Clavo/chip/banner contradicen | esClavo, liquidado o sin préstamo | Campo estado se ignora; banner puede decir Al día mientras chip no | cliente.dart:17-18,65-90; cartulina_screen.dart:247-295 | C | Alta |
| BR-CUSTOMERS-007 | Préstamo | Atajo elige primero activo | Hay varios préstamos | Usa primero con saldo; si ninguno, último liquidado | cliente.dart:47-54 | C | Alta |
| BR-CUSTOMERS-008 | Cliente | Historial de dirección | Dirección cambia | Añade anterior; no actualiza coordenadas; foto vieja queda huérfana | editar_cliente_screen.dart:96-133 | A | Alta |
| BR-CUSTOMERS-009 | Cliente | Campos/acciones sin flujo | Boleta, archivo o eliminar | valorBoleta/archivado sin uso; eliminar existe sin UI | cliente.dart:12-18; route_state.dart:200-209 | B | Alta |

## Préstamos

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-LOANS-001 | Préstamo | Fórmula total | Cambian capital/ajustes | Capital+retaque+interés total+recargo-descuento, acotado | prestamo.dart:50-66 | A | Alta |
| BR-LOANS-002 | Préstamo | Cuota manual no redefine total | Usuario fija cuota | Solo cambia valorCuota; cuotas×valor puede no cuadrar | prestamo.dart:24-26,71-72 | C | Alta |
| BR-LOANS-003 | Préstamo | Clamp oculta sobrepago | Pagado excede total o total=0 | Saldo 0/progreso máximo; sobrepago queda en historial | prestamo.dart:74-81 | D | Alta |
| BR-LOANS-004 | Retaque | Recalcula sobre capital completo | Se presta más | Suma capital/cuotas; tasa original aplica a todo; sin evento | prestamo.dart:83-88; cartulina_screen.dart:50-125 | A | Alta |
| BR-LOANS-005 | Ajustes | Descuento sin límite/historial | Monto positivo | Acumula recargo/descuento; descuento puede exceder deuda | prestamo.dart:90-98 | D | Alta |
| BR-LOANS-006 | Préstamo | Defaults divergentes | Alta cliente vs préstamo nuevo | 24 vs 20 cuotas; tasa hardcodeada; config admin no se aplica | nuevo_cliente_screen.dart; nuevo_prestamo_screen.dart; mensualidades_screen.dart | C | Alta |
| BR-LOANS-007 | Valor fijo | Contrato incoherente | Se activa valorFijo/manual | Interés 0, pero cuota manual/total pueden divergir; descripción opcional | prestamo.dart:17-22,50-55; nuevo_prestamo_screen.dart | C | Alta |
| BR-LOANS-008 | Importación | Histórico colapsado | Se importa cartera previa | Todo abonado se convierte en un Pago en fecha inicial; sin caja | nuevo_prestamo_screen.dart:85-145 | C | Alta |
| BR-LOANS-009 | Préstamo | Paralelos sin prioridad | Cliente ya tiene saldo | Permite añadir otro; atajos operan el primero | cliente.dart:20-54; cartulina_screen.dart:321-357 | C | Alta |
| BR-LOANS-010 | Calendario | Calendario no definido | Se calcula mora | Solo 1/7/15/30 días; sin primera fecha, festivos o gracia | enums.dart:32-38; cliente.dart:65-83 | F | Alta |

## Pagos

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-PAYMENTS-001 | Pago | Registro normal | Monto positivo y tipo UI | Crea Pago, usa UID y suma Caja; “cuota” no compara monto | registrar_pago_screen.dart:83-157 | A | Alta |
| BR-PAYMENTS-002 | Pago | Sobrepago permitido | Monto > saldo | Historial y caja reciben total; saldo se clampa | registrar_pago_screen.dart:125-157; prestamo.dart:74-79 | D | Alta |
| BR-PAYMENTS-003 | Pago | Sin préstamo afecta caja | Prestamo nulo | No crea Pago, pero suma caja, visita y éxito | registrar_pago_screen.dart:39-43,125-164 | D | Alta |
| BR-PAYMENTS-004 | Pago rápido | Reglas divergentes | Se cobra desde panel | Primer activo, entero, literal cobrador, error inválido silencioso | panel_rutas_screen.dart:401-448 | C | Alta |
| BR-PAYMENTS-005 | Visita | Acciones marcan distinto | Pago/retaque/nuevo préstamo | Algunos marcan visitado; retaque directo no | registrar_pago_screen.dart:158-161; cartulina_screen.dart:108-115 | C | Alta |
| BR-PAYMENTS-006 | Auditoría | No existe corrección | Pago equivocado | Sin reverso, método, recibo o referencia; actores heterogéneos | pago.dart; usos de registradoPor | D | Alta |

## Caja, gastos y cierre

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-CASH-001 | Caja | Solo positivos | Se registra gasto/cobro/retaque/boleta | Gasto valida; otros ignoran no positivos | caja_state.dart:95-139 | A | Alta |
| BR-CASH-002 | Caja | Entrega y descuadre | Cambian movimientos/efectivo | entrega=cobrado+boletas-gastos-prestado; descuadre=efectivo-entrega | caja_state.dart:67-74 | A | Alta |
| BR-CASH-003 | Boleta | Reparto porcentual | Admin cambia slider | Porcentaje clamp; admin redondea y cobrador recibe residuo | caja_state.dart:38-46,141-145 | A | Alta |
| BR-CASH-004 | Gasto | Resta entrega | Gasto positivo | Guarda nombre/monto/fecha/nota; sin autor/ruta/categoría | gasto.dart; cobrador_gastos_screen.dart | A | Alta |
| BR-CASH-005 | Desembolso | Prestado reduce entrega | Nuevo préstamo o retaque | Suma capital a prestadoHoy; importación no | nuevo_cliente_screen.dart; nuevo_prestamo_screen.dart | A | Alta |
| BR-CASH-006 | Jornada | “Hoy” no cambia | Pasa medianoche/reabre app | Caja acumula indefinidamente; gastos viejos siguen sumando | caja_state.dart:23-90,225-295 | D | Alta |
| BR-CASH-007 | Cierre | Enviar/aprobar/reabrir | Cambia actor/estado | Cobrador envía; admin aprueba; reabrir conserva efectivo | caja_state.dart:153-178; cierre_dia_screen.dart | A | Alta |
| BR-CASH-008 | Cierre | Aprobado sigue mutable | Se cambia efectivo/boleta u otra entrada | Importes pueden variar sin invalidar aprobación | cierre_dia_screen.dart:69-248 | C | Alta |
| BR-CASH-009 | Cierre | No crea histórico | Se envía o aprueba cierre real | Solo cambia flags; históricos solo demo/disco | caja_state.dart:159-178,297-370 | D | Alta |
| BR-CASH-010 | Config | Frecuencia/visibilidad decorativas | Se configuran switches/frecuencia | Solo etiquetas; no gobiernan cierre/UI y pueden filtrarse entre cuentas | caja_state.dart:52-82,180-196,283-295 | D | Alta |

## Suscripción y monetización

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-SUB-001 | Suscripción | Dos modelos incompatibles | Se compara usuario/ruta | Plan ilimitado 20k y ruta 20k/mes; no se puede decidir el correcto | plan.dart:33-43; pantalla_bloqueo_pago.dart | F | Alta |
| BR-SUB-002 | Ruta | Precios por plazo | Elige 1/3/6/12 meses | 20k/54k/96k/200k; cupón reemplaza meses seleccionados | pantalla_bloqueo_pago.dart:36-109,177-186 | A | Alta |
| BR-SUB-003 | Wompi | Usuario elige resultado | Pulsa éxito/rechazo | Tras 2 s activa localmente; sin validación/transacción | wompi_simulador_screen.dart:47-105 | B | Alta |
| BR-SUB-004 | Config | Mensualidades contradice pagos | Abre configuración | Siempre prueba activa/pago próximo; campos no persisten | mensualidades_screen.dart:7-117 | C | Alta |
| BR-SUB-005 | Tiempo | Vigencia depende del reloj | Cambia reloj o pasa tiempo | Estados usan DateTime.now; porVencer no se deriva | ruta.dart:33-40; local_store.dart:302-331 | D | Alta |

## Reportes

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-REPORTS-001 | KPI | Métricas mezclan conceptos | Admin abre resumen | Capital histórico, saldo, pagos e “interés” con recargos/descuentos | admin_resumen_screen.dart:22-152 | C | Alta |
| BR-REPORTS-002 | KPI | Progreso usa entrega | Se calcula meta diaria | cobradoHoy/entregaEsperada; gastos/desembolsos alteran meta | admin_resumen_screen.dart:41-45,248-327 | D | Alta |
| BR-REPORTS-003 | Excel | Rango parcial | Elige período | Solo filtra cierres; caja/gastos/clientes permanecen globales | reporte_screen.dart:40-57,81-159 | D | Alta |
| BR-REPORTS-004 | Excel | Estado no coincide | Exporta clientes | Solo adelantado/atrasado/al día; liquidados/clavos pueden quedar al día | reporte_screen.dart:139-158 | C | Alta |
| BR-REPORTS-005 | Cobrador | Reporte global/huérfano | Se instancia manualmente | Todas rutas/histórico; PDF vacío; no está en navegación | reporte_cobranza_screen.dart:15-95 | D | Alta |

## Persistencia e integridad

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-DATA-001 | Datos | Namespace y legacy | Cambia cuenta | Aísla por UID/demo; primer UID recibe datos globales legacy | local_store.dart:12-30,72-95 | A | Alta |
| BR-DATA-002 | Datos | Compatibilidad/corrupción | Carga JSON viejo o inválido | Migra prestamoActivo; respalda rutas/clientes corruptos y vacía | cliente.dart:109-143; local_store.dart:133-173 | A | Alta |
| BR-DATA-003 | Caja | Corrupción puede sobrescribir | Caja JSON inválida/parcial | Retorna null sin backup; catch puede persistir defaults; flags se filtran | caja_state.dart:227-295 | D | Alta |
| BR-DATA-004 | Finanzas | Mutaciones no atómicas | Pago/desembolso toca cartera y caja | Blobs se escriben en llamadas async separadas | registrar_pago_screen.dart:135-162 | D | Alta |
| BR-DATA-005 | Backup | Archivo cruza cuentas | Dos namespaces respaldan el mismo día | Mismo nombre global; uno sobrescribe/restaura al otro | backup_service.dart:19-70 | D | Alta |
| BR-DATA-006 | Export | Paquete parcial/sensible | Exporta o restaura | JSON plano con PII; omite cobradores/fotos; escribe antes de validar | local_store.dart:251-300 | C | Alta |
| BR-DATA-007 | Reset | Datos resucitan | Restablece y luego muta | Borra preferencias, no memoria/providers | local_store.dart:262-269; ajustes_screen.dart:268-294 | D | Alta |
| BR-DATA-008 | Nube | Auth remoto, operación local | Se muestra SyncWrapper | Descarga retorna false; animación sugiere sync | cloud_sync_service.dart:12-17; sync_wrapper.dart:30-61 | C | Alta |

## Navegación y accesibilidad funcional

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-NAV-001 | Acceso | Clientes evade bloqueos | Ruta/cierre bloqueado | GestiónClientes no recibe soloLectura y permite mutaciones | cobrador_home_screen.dart:28-33; gestion_clientes_screen.dart | D | Alta |
| BR-NAV-002 | Navegación | Funciones/rutas muertas | Se usa nombre no implementado | Dos pantallas huérfanas; rutas caen a landing | app_routes.dart:8-32 | E | Alta |
| BR-NAV-003 | Simulación | Ver como cobrador conserva admin | Admin activa flag | Cierre lo sigue tratando como admin | admin_home_screen.dart:101-109; cierre_dia_screen.dart | C | Alta |
| BR-NAV-004 | Copy | Etiquetas prometen capacidades | Usuario lee/activa CTA | Tiempo real, nube, pago/PDF/código no corresponden | login_screen.dart; crear_ruta_screen.dart; reporte_cobranza_screen.dart | E | Alta |

## Geolocalización, orden y contacto

| ID | Módulo | Regla | Condición | Resultado AS-IS | Evidencia | Clasificación | Certeza |
|---|---|---|---|---|---|---|---|
| BR-GEO-001 | GPS | Coordenadas sintéticas | Falla GPS o faltan coords | Guarda Medellín/promedio como ubicación real y muestra éxito | nuevo_cliente_screen.dart:132-190; route_state.dart:150-173 | E | Alta |
| BR-GEO-002 | Ruta | Dos órdenes distintos | Se compara mapa/lista | Mapa nearest-neighbor; lista manual; numeración puede divergir | ruta_orden.dart:15-39; panel_rutas_screen.dart | C | Alta |
| BR-GEO-003 | Contacto | Normalización Colombia | Abre WhatsApp/llamada | 10 dígitos reciben 57; recordatorio usa primer activo | contacto.dart:3-30; cartulina_screen.dart:197-245 | A | Alta |

## Reglas críticas que deben resolverse primero

1. BR-TEAM-004: ownership y datos compartidos.
2. BR-AUTH-015: autoridad de roles/membresía.
3. BR-CASH-006 y 009: jornada y cierre histórico.
4. BR-DATA-004: atomicidad financiera.
5. BR-PAYMENTS-002 y 003: sobrepago/cobro sin obligación.
6. BR-ROUTES-011 y BR-NAV-001: autorización central.
7. BR-SUB-001: modelo comercial.
8. BR-LOANS-010: calendario de cartera.

## TO-BE transversal

Las 95 reglas no deben copiarse mecánicamente. El proceso correcto es:

- preservar las A validadas por negocio;
- resolver con el cliente las F;
- escoger explícitamente entre variantes C;
- corregir D;
- eliminar E salvo que el cliente confirme su valor;
- convertir toda regla financiera y de autorización en casos de uso testeables fuera de widgets.

