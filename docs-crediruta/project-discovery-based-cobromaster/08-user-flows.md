# 08. Flujos de usuario

## Inventario

Se documentan 36 flujos únicos. Los flujos describen el código vigente; no implican que el resultado sea correcto.

~~~mermaid
flowchart TD
    LANDING --> LOGIN
    LANDING --> REGISTER
    LANDING --> DEMO
    LOGIN --> VERIFY
    REGISTER --> VERIFY
    VERIFY --> ADMIN
    VERIFY --> JOIN
    JOIN --> COLLECTOR
    JOIN --> ADMIN
    ADMIN --> ROUTES
    ROUTES --> CLIENTS
    COLLECTOR --> CLIENTS
    CLIENTS --> LOANS
    LOANS --> PAYMENTS
    PAYMENTS --> CASH
    CASH --> CLOSE
~~~

---

## UF-SYS-001

**Nombre:** Arranque, control horario y recuperación inicial  
**Actor:** Usuario/dispositivo  
**Objetivo:** Inicializar dependencias, rehidratar y decidir raíz.  
**Precondiciones:** App iniciada.  
**Punto de entrada:** main().  
**Flujo principal:** Inicializa locale, Firebase, LocalStore/backup y reloj; crea cuatro providers; AuthState restaura sesión; SyncWrapper cambia a namespace UID/demo y recarga.  
**Flujos alternativos:** Sin sesión → Landing; no verificado → Verificación; cobrador huérfano → Unión; retroceso >12 h → bloqueo.  
**Condiciones:** CloudSync deshabilitado; errores de bootstrap se capturan.  
**Errores:** reload offline deja usuario nulo; no hay loading de sesión; continuar sin Firebase/LocalStore puede fallar después.  
**Cambios de estado:** namespace, DatosDemo, ruta, caja, tema, usuario.  
**Datos involucrados:** preferencias, perfil Firebase.  
**Persistencia:** Lee SharedPreferences y registra última apertura.  
**Mensajes:** debugPrint, alerta horaria y barra mínima de carga.  
**Resultado:** Arranque local con restauración offline defectuosa.  
**Archivos relacionados:** main.dart:15-68; auth_state.dart:72-103; sync_wrapper.dart:25-63.  
**Clasificación:** D.  
**Preguntas pendientes:** ¿Bloqueo horario real? ¿Sesión completamente offline?

## UF-AUTH-001

**Nombre:** Login correo/password  
**Actor:** Usuario registrado  
**Objetivo:** Entrar al home por rol.  
**Precondiciones:** Cuenta Firebase.  
**Punto de entrada:** Landing → Iniciar sesión.  
**Flujo principal:** Valida no vacío, normaliza email, autentica, lee perfil, vuelve a raíz y selecciona namespace.  
**Flujos alternativos:** Error Firebase; no verificado; cobrador huérfano; perfil faltante.  
**Condiciones:** UI dice correo o teléfono, pero siempre usa email.  
**Errores:** Perfil caído crea admin; sin reintento/carga inicial.  
**Cambios de estado:** usuario y namespace.  
**Datos involucrados:** credenciales, perfil.  
**Persistencia:** Sesión Firebase; operación local UID.  
**Mensajes:** Snackbars mapeados.  
**Resultado:** Login online funcional con fallback inseguro.  
**Archivos relacionados:** login_screen.dart:31-157; auth_state.dart:87-163.  
**Clasificación:** C/D.  
**Preguntas pendientes:** ¿Login por teléfono? ¿Perfil faltante?

## UF-AUTH-002

**Nombre:** Login/alta Google  
**Actor:** Usuario Google  
**Objetivo:** Autenticarse sin password.  
**Precondiciones:** Configuración OAuth externa.  
**Punto de entrada:** Continuar con Google.  
**Flujo principal:** Obtiene tokens, autentica Firebase; si no hay perfil crea administrador con plan activo.  
**Flujos alternativos:** Cancelación/error.  
**Condiciones:** Email del proveedor define verificación.  
**Errores:** Omite onboarding, términos, invitación y pago.  
**Cambios de estado:** sesión, perfil, usuario.  
**Datos involucrados:** tokens, correo, nombre.  
**Persistencia:** Firebase/Firestore.  
**Mensajes:** Cancelación se muestra como error.  
**Resultado:** Bypass del registro comercial.  
**Archivos relacionados:** login_screen.dart:51-64; auth_state.dart:166-212.  
**Clasificación:** E/D.  
**Preguntas pendientes:** ¿Google solo autentica o crea empresa?

## UF-AUTH-003

**Nombre:** Recuperación de contraseña  
**Actor:** Usuario con correo  
**Objetivo:** Recibir enlace.  
**Precondiciones:** Texto en campo de login.  
**Punto de entrada:** ¿Olvidaste tu contraseña?  
**Flujo principal:** Comprueba no vacío y llama sendPasswordResetEmail.  
**Flujos alternativos:** Firebase devuelve email/red/usuario.  
**Condiciones:** No hay pantalla dedicada.  
**Errores:** Sin cooldown/loading propio; posible enumeración.  
**Cambios de estado:** Ninguno local.  
**Datos involucrados:** correo.  
**Persistencia:** Firebase.  
**Mensajes:** Enlace enviado o error.  
**Resultado:** Solicitud básica.  
**Archivos relacionados:** login_screen.dart:71-83; auth_state.dart:239-247.  
**Clasificación:** A.  
**Preguntas pendientes:** ¿Recuperación por teléfono?

## UF-AUTH-004

**Nombre:** Registro administrador/empresa  
**Actor:** Nuevo administrador  
**Objetivo:** Crear cuenta Plan Ya.  
**Precondiciones:** Elegir activar plan.  
**Punto de entrada:** Registro.  
**Flujo principal:** Opción → negocio → datos → seguridad; diálogo Wompi local; crea Auth, verificación y perfil admin.  
**Flujos alternativos:** Cancela pago; error Auth/Firestore.  
**Condiciones:** Password ≥6, términos marcados, rol/plan fijos.  
**Errores:** Pago ficticio antes de validar cuenta; alta no transaccional.  
**Cambios de estado:** formulario, sesión y perfil.  
**Datos involucrados:** negocio, nombre, correo, password.  
**Persistencia:** Auth/Firestore.  
**Mensajes:** Pasarela Wompi (Simulación).  
**Resultado:** Alta online con pago no real.  
**Archivos relacionados:** registro_flujo_screen.dart:38-344; auth_state.dart:105-149.  
**Clasificación:** D.  
**Preguntas pendientes:** ¿Prueba o pago inmediato? ¿Quién paga plan?

## UF-AUTH-005

**Nombre:** Registro cobrador con código  
**Actor:** Nuevo cobrador  
**Objetivo:** Crear cuenta y vincularse.  
**Precondiciones:** Elegir unirse.  
**Punto de entrada:** Registro → Unirse.  
**Flujo principal:** El PageView debería recorrer código, datos y seguridad.  
**Flujos alternativos:** Ninguno completa desde UI.  
**Condiciones:** totalPasos=3 con cuatro páginas.  
**Errores:** Seguridad inalcanzable; password vacío bloquea; código no se valida y se usaría como administradorId.  
**Cambios de estado:** Solo formulario.  
**Datos involucrados:** código/nombre/correo.  
**Persistencia:** Ninguna en el flujo normal.  
**Mensajes:** Password mínimo 6.  
**Resultado:** Flujo imposible.  
**Archivos relacionados:** registro_flujo_screen.dart:38,102-192,330-344.  
**Clasificación:** D.  
**Preguntas pendientes:** ¿Código crea o vincula cuenta?

## UF-AUTH-006

**Nombre:** Verificación de correo  
**Actor:** Usuario no verificado  
**Objetivo:** Confirmar correo.  
**Precondiciones:** Sesión real, emailVerified=false.  
**Punto de entrada:** Gate de CobrosApp.  
**Flujo principal:** Muestra instrucciones; refresca reload; permite reenviar y salir.  
**Flujos alternativos:** Offline conserva valor local.  
**Condiciones:** Bloqueo inmediato aunque UI habla de 24 h.  
**Errores:** Reenvío reporta éxito aunque falle; sin cooldown.  
**Cambios de estado:** emailVerificado en memoria/sesión.  
**Datos involucrados:** correo y creado.  
**Persistencia:** Firebase Auth; perfil queda desfasado.  
**Mensajes:** Aún no detectamos / enlace reenviado.  
**Resultado:** Gate real con política incoherente.  
**Archivos relacionados:** app.dart:30-34; verificacion_correo_screen.dart.  
**Clasificación:** C.  
**Preguntas pendientes:** ¿Acceso durante 24 h? ¿Qué ocurre al vencer?

## UF-AUTH-007

**Nombre:** Entrada demo admin/cobrador  
**Actor:** Prospecto  
**Objetivo:** Explorar sin cuenta.  
**Precondiciones:** Landing/Login.  
**Punto de entrada:** Botones demo.  
**Flujo principal:** Cambia namespace demo, carga/persiste seed y crea usuario en memoria.  
**Flujos alternativos:** Admin entra al home; cobrador nace huérfano y va a Unión.  
**Condiciones:** Namespace compartido y persistente.  
**Errores:** “Demo cobrador” no abre operación; roles alteran mismos datos.  
**Cambios de estado:** usuario demo, seed y caja simulada.  
**Datos involucrados:** dos rutas, 50 clientes y simulación.  
**Persistencia:** demo::* local.  
**Mensajes:** Ninguno.  
**Resultado:** Demo admin útil; demo cobrador contradictoria.  
**Archivos relacionados:** landing_screen.dart:42-49; auth_state.dart:249-271.  
**Clasificación:** C.  
**Preguntas pendientes:** ¿Demo vinculada? ¿Reset por sesión?

## UF-AUTH-008

**Nombre:** Logout/cambio de cuenta  
**Actor:** Usuario autenticado  
**Objetivo:** Terminar sesión.  
**Precondiciones:** Ajustes/Verificación/Unión.  
**Punto de entrada:** Salir.  
**Flujo principal:** Intenta signOut; limpia usuario/demo/impersonación; vuelve a Landing.  
**Flujos alternativos:** Error signOut ignorado.  
**Condiciones:** simularCobrador no se limpia.  
**Errores:** Namespace/providers/equipo quedan; próxima cuenta puede heredar flags.  
**Cambios de estado:** usuario null; contexto parcial.  
**Datos involucrados:** sesión y caches.  
**Persistencia:** Datos locales se conservan.  
**Mensajes:** Ninguno.  
**Resultado:** Logout visual incompleto.  
**Archivos relacionados:** auth_state.dart:380-391.  
**Clasificación:** D.  
**Preguntas pendientes:** ¿Cache tras logout?

## UF-TEAM-001

**Nombre:** Cobrador existente se une a equipo  
**Actor:** Cobrador huérfano  
**Objetivo:** Vincularse a admin.  
**Precondiciones:** Invitación válida en Caja local.  
**Punto de entrada:** UnirseEquipo.  
**Flujo principal:** Valida texto, espera 800 ms, busca lista local, marca usada y fija demo-administrador.  
**Flujos alternativos:** Código inválido; “escanear” toma primera invitación local.  
**Condiciones:** La pantalla no usa SyncWrapper.  
**Errores:** No cruza cuentas/dispositivos; uso/perfil no persisten; lista queda en namespace equivocado.  
**Cambios de estado:** usuario/equipo/invitación en memoria.  
**Datos involucrados:** Invitacion, Usuario.  
**Persistencia:** Cobradores local; no perfil/invitación consumida.  
**Mensajes:** éxito/error.  
**Resultado:** Solo aparenta funcionar en demo.  
**Archivos relacionados:** unirse_equipo_screen.dart:37-220; auth_state.dart:293-320.  
**Clasificación:** D.  
**Preguntas pendientes:** ¿Múltiples equipos?

## UF-SUB-001

**Nombre:** Cobrador activa plan personal  
**Actor:** Cobrador huérfano  
**Objetivo:** Convertirse en admin.  
**Precondiciones:** Pestaña Activar plan.  
**Punto de entrada:** Wompi simulador.  
**Flujo principal:** Elige método, pulsa éxito y AuthState reemplaza rol por admin.  
**Flujos alternativos:** Rechazo local.  
**Condiciones:** Sin validación, vigencia ni meses.  
**Errores:** Escalación temporal en memoria; pierde rol cobrador; no persiste.  
**Cambios de estado:** rol/plan/suscripción.  
**Datos involucrados:** Usuario.  
**Persistencia:** Ninguna.  
**Mensajes:** Pago aprobado/rechazado.  
**Resultado:** Activación manipulable.  
**Archivos relacionados:** unirse_equipo_screen.dart:92-297; auth_state.dart:322-333.  
**Clasificación:** E/D.  
**Preguntas pendientes:** ¿Rol o nueva organización?

## UF-TEAM-002

**Nombre:** Generar/compartir invitación  
**Actor:** Administrador  
**Objetivo:** Invitar miembro.  
**Precondiciones:** Acceso admin.  
**Punto de entrada:** InvitacionScreen.  
**Flujo principal:** Genera código, rol y vencimiento; persiste en Caja; muestra QR/copia/share.  
**Flujos alternativos:** Admin o cobrador; historial válido/vencido/usado.  
**Condiciones:** Vence por reloj local.  
**Errores:** Sin revocar; deep link no existe; canje no respeta rol.  
**Cambios de estado:** invitaciones.  
**Datos involucrados:** Invitacion.  
**Persistencia:** data_caja_v2.  
**Mensajes:** Código copiado.  
**Resultado:** QR visual, vinculación inferida.  
**Archivos relacionados:** invitacion_screen.dart; invitacion.dart.  
**Clasificación:** B.  
**Preguntas pendientes:** ¿Invitar admin? ¿TTL 2 h?

## UF-TEAM-003

**Nombre:** Gestionar cobradores  
**Actor:** Administrador  
**Objetivo:** Supervisar/asignar/configurar/remover/impersonar.  
**Precondiciones:** Lista local cargada.  
**Punto de entrada:** Tab Cobradores.  
**Flujo principal:** Lista, muestra métricas/GPS, asigna rutas, cambia flags, quita o entra como cobrador.  
**Flujos alternativos:** Vacío invita; sin rutas.  
**Condiciones:** Datos de actividad/GPS son mocks; permisos globales.  
**Errores:** Admin real suele ver vacío; cambios no llegan al cobrador; impersonación mantiene datos admin.  
**Cambios de estado:** rutas, caja, lista, usuario.  
**Datos involucrados:** Usuario, Ruta, Caja.  
**Persistencia:** Namespace admin local.  
**Mensajes:** Snackbars.  
**Resultado:** Prototipo local, no supervisión real.  
**Archivos relacionados:** gestion_cobradores_screen.dart; auth_state.dart:274-378.  
**Clasificación:** C/D.  
**Preguntas pendientes:** ¿Permisos/GPS/impersonación reales?

## UF-ROUTE-001

**Nombre:** Consultar/seleccionar/abrir rutas  
**Actor:** Admin/cobrador  
**Objetivo:** Elegir contexto operativo.  
**Precondiciones:** Rutas cargadas.  
**Punto de entrada:** Tab/selector/Panel.  
**Flujo principal:** Selecciona primera o elegida; admin abre panel si pagada; cobrador ve chips.  
**Flujos alternativos:** Sin rutas; impaga a bloqueo.  
**Condiciones:** pagada usa fecha; estado usa enum.  
**Errores:** Estados contradictorios; cobrador ve todas; rutas nombradas muertas.  
**Cambios de estado:** ruta seleccionada/búsqueda.  
**Datos involucrados:** Ruta.  
**Persistencia:** Selección no.  
**Mensajes:** Ruta activa/bloqueo.  
**Resultado:** Selector funcional, scope defectuoso.  
**Archivos relacionados:** route_state.dart:21-82; gestion_rutas_screen.dart.  
**Clasificación:** C.  
**Preguntas pendientes:** ¿Scope y billing por ruta?

## UF-ROUTE-002

**Nombre:** Crear ruta  
**Actor:** Administrador  
**Objetivo:** Alta y asignación.  
**Precondiciones:** Tab Rutas.  
**Punto de entrada:** Nueva ruta.  
**Flujo principal:** Captura nombre/frecuencia/descripción/foto/cobrador; crea pendiente y selecciona.  
**Flujos alternativos:** Picker cancelado/error; trabajador ad hoc.  
**Condiciones:** Cobradores hardcodeados.  
**Errores:** CTA “Ir a Pago” solo hace pop; foto temporal; IDs colgantes.  
**Cambios de estado:** Ruta y mapa vacío.  
**Datos involucrados:** Ruta.  
**Persistencia:** Blobs rutas/clientes.  
**Mensajes:** Complete pago.  
**Resultado:** Alta local sin checkout.  
**Archivos relacionados:** crear_ruta_screen.dart; route_state.dart:213-237.  
**Clasificación:** C.  
**Preguntas pendientes:** ¿Ruta antes del pago?

## UF-ROUTE-003

**Nombre:** Editar/eliminar ruta  
**Actor:** Administrador  
**Objetivo:** Mantener ciclo.  
**Precondiciones:** Ruta existente.  
**Punto de entrada:** Menú ruta.  
**Flujo principal:** Renombra/edita estado/frecuencia o confirma borrado en cascada.  
**Flujos alternativos:** Cancelar; renovar abre pago.  
**Condiciones:** Estado manual no sincroniza fecha.  
**Errores:** Borra cartera sin política; backup puede tomarse después.  
**Cambios de estado:** Ruta/eliminación/selección.  
**Datos involucrados:** Ruta y subárbol Cliente.  
**Persistencia:** Blobs.  
**Mensajes:** Confirmación.  
**Resultado:** CRUD destructivo parcial.  
**Archivos relacionados:** gestion_rutas_screen.dart:137-297; route_state.dart:240-320.  
**Clasificación:** C/D.  
**Preguntas pendientes:** ¿Archivo o borrado?

## UF-SUB-002

**Nombre:** Activar/renovar ruta  
**Actor:** Administrador  
**Objetivo:** Dar vigencia.  
**Precondiciones:** Ruta existente.  
**Punto de entrada:** Bloqueo/renovar.  
**Flujo principal:** Elige meses/precio; aplica cupón o Wompi sim; extiende fecha y activa.  
**Flujos alternativos:** Cupón inválido/offline; pago rechazado.  
**Condiciones:** Precios 20/54/96/200 mil; cupón sustituye meses.  
**Errores:** Cupón bloqueado/no consumido; Wompi falsa; fin de mes ambiguo; sin historial.  
**Cambios de estado:** fechaVencimiento/estado.  
**Datos involucrados:** Ruta/cupón.  
**Persistencia:** Ruta local.  
**Mensajes:** aplicado/no válido/aprobado.  
**Resultado:** Billing simulado.  
**Archivos relacionados:** pantalla_bloqueo_pago.dart; route_state.dart:270-309.  
**Clasificación:** C/D.  
**Preguntas pendientes:** Modelo comercial/cupones.

## UF-CLIENT-001

**Nombre:** Consultar/buscar clientes  
**Actor:** Admin/cobrador  
**Objetivo:** Ver cartera activa.  
**Precondiciones:** Ruta seleccionada.  
**Punto de entrada:** Tab Clientes.  
**Flujo principal:** Lista, busca por nombre/cédula/teléfono y abre Cartulina.  
**Flujos alternativos:** Sin ruta/clientes/resultados.  
**Condiciones:** Banner pendientes usa conjunto distinto al filtrado.  
**Errores:** Gate de ruta/cierre ausente; FAB sin ruta.  
**Cambios de estado:** búsqueda.  
**Datos involucrados:** Cliente.  
**Persistencia:** No.  
**Mensajes:** Vacíos.  
**Resultado:** Consulta básica con scope/gate incoherente.  
**Archivos relacionados:** gestion_clientes_screen.dart; route_state.dart:84-142.  
**Clasificación:** C.  
**Preguntas pendientes:** ¿Filtros/alcance?

## UF-CLIENT-002

**Nombre:** Crear cliente/préstamo inicial  
**Actor:** Admin/cobrador  
**Objetivo:** Alta en ruta.  
**Precondiciones:** Idealmente ruta; UI no obliga.  
**Punto de entrada:** Nuevo cliente.  
**Flujo principal:** Valida cuatro campos, foto/GPS opcional, crea préstamo si monto y cuotas positivos, agrega cliente y caja.  
**Flujos alternativos:** Sin préstamo; GPS denegado/falla.  
**Condiciones:** Default 20 %, 24 cuotas.  
**Errores:** Sin ruta o cuotas 0 genera caja fantasma; coordenadas sintéticas; archivos huérfanos.  
**Cambios de estado:** Cliente, Prestamo, Caja, geodatos.  
**Datos involucrados:** PII/finanzas/foto.  
**Persistencia:** JSON y archivo local.  
**Mensajes:** GPS real/simulado.  
**Resultado:** Alta potente pero no atómica.  
**Archivos relacionados:** nuevo_cliente_screen.dart; route_state.dart:150-179.  
**Clasificación:** D.  
**Preguntas pendientes:** Unicidad/GPS/préstamo opcional.

## UF-CLIENT-003

**Nombre:** Editar/marcar/eliminar cliente  
**Actor:** Operador  
**Objetivo:** Mantener ficha.  
**Precondiciones:** Cliente existente.  
**Punto de entrada:** Cartulina → Editar.  
**Flujo principal:** Edita campos/foto/esClavo; guarda dirección previa.  
**Flujos alternativos:** Cancelar/quitar foto.  
**Condiciones:** Editar exige menos que crear.  
**Errores:** Siempre disponible; coords obsoletas; delete existe sin UI; fotos huérfanas.  
**Cambios de estado:** Cliente/historial.  
**Datos involucrados:** PII.  
**Persistencia:** JSON/archivos.  
**Mensajes:** Ninguno.  
**Resultado:** Update parcial; delete inalcanzable.  
**Archivos relacionados:** editar_cliente_screen.dart; route_state.dart:181-209.  
**Clasificación:** C.  
**Preguntas pendientes:** Permisos/archivo/boleta.

## UF-LOAN-001

**Nombre:** Nuevo préstamo normal/valor fijo/importado  
**Actor:** Operador  
**Objetivo:** Añadir obligación.  
**Precondiciones:** Cartulina mutable.  
**Punto de entrada:** Nuevo préstamo.  
**Flujo principal:** Elige tipo, monto, cuotas, tasa, frecuencia, fecha/manual; añade y mueve caja si actual.  
**Flujos alternativos:** Importado crea un Pago agregado; valor fijo 0 interés.  
**Condiciones:** 20 cuotas/20 % default.  
**Errores:** Tasa >100/abono >total; cuota manual no cuadra; gate evadible.  
**Cambios de estado:** Prestamo/Pago/Caja/visita.  
**Datos involucrados:** Cartera.  
**Persistencia:** Cliente y Caja.  
**Mensajes:** Préstamo registrado.  
**Resultado:** Múltiples préstamos con contrato ambiguo.  
**Archivos relacionados:** nuevo_prestamo_screen.dart; prestamo.dart.  
**Clasificación:** C.  
**Preguntas pendientes:** Interés/amortización/importación.

## UF-LOAN-002

**Nombre:** Retaque/recargo/descuento/compartir  
**Actor:** Operador  
**Objetivo:** Ajustar cartera.  
**Precondiciones:** Préstamo.  
**Punto de entrada:** Cartulina.  
**Flujo principal:** Acumula ajuste y persiste; retaque afecta caja; comparte WhatsApp.  
**Flujos alternativos:** Monto inválido/fallo launcher.  
**Condiciones:** Sin motivo/actor/fecha.  
**Errores:** Sin ledger/reverso; descuento sin tope; compartir oculto en solo lectura.  
**Cambios de estado:** Prestamo/Caja.  
**Datos involucrados:** Ajustes financieros.  
**Persistencia:** JSON.  
**Mensajes:** Ajuste aplicado.  
**Resultado:** Mutación directa no auditable.  
**Archivos relacionados:** cartulina_screen.dart:50-245; prestamo.dart:83-98.  
**Clasificación:** C/D.  
**Preguntas pendientes:** Tasa/autorización/reactivación.

## UF-PAY-001

**Nombre:** Pago detallado/cobro rápido  
**Actor:** Operador  
**Objetivo:** Bajar saldo y subir caja.  
**Precondiciones:** Préstamo/acceso.  
**Punto de entrada:** Cartulina o Panel.  
**Flujo principal:** Crea Pago, suma Caja, marca visitado y persiste.  
**Flujos alternativos:** Tipos/retaque; fast pay.  
**Condiciones:** Dos caminos usan tipo/actor distintos.  
**Errores:** Sobrepago; sin reverso/idempotencia/método; gate depende de entrada.  
**Cambios de estado:** pagos, caja, visita.  
**Datos involucrados:** Pago/Prestamo/Caja.  
**Persistencia:** Dos blobs no atómicos.  
**Mensajes:** Pago registrado.  
**Resultado:** Cobro local con semántica divergente.  
**Archivos relacionados:** registrar_pago_screen.dart; panel_rutas_screen.dart:401-448.  
**Clasificación:** C/D.  
**Preguntas pendientes:** Crédito a favor/reparto/recibo.

## UF-VISIT-001

**Nombre:** Visita/no pagó/ordenar  
**Actor:** Cobrador  
**Objetivo:** Seguir recorrido.  
**Precondiciones:** Ruta operativa.  
**Punto de entrada:** Panel/Ordenar.  
**Flujo principal:** Pago o no pagó añade ID; drag reordena lista.  
**Flujos alternativos:** Vacío; métodos undo/reset sin UI.  
**Condiciones:** Set global/efímero.  
**Errores:** Resultado/fecha/ruta indistinguibles; no rollover; mapa usa otro orden.  
**Cambios de estado:** visitados/orden.  
**Datos involucrados:** IDs cliente.  
**Persistencia:** Solo orden.  
**Mensajes:** Confirmación no pagó.  
**Resultado:** Checklist no auditable.  
**Archivos relacionados:** route_state.dart:102-198; ordenar_clientes_screen.dart.  
**Clasificación:** D.  
**Preguntas pendientes:** Resultados/jornada/orden canónico.

## UF-MAP-001

**Nombre:** Mapa/modo carretera/GPS  
**Actor:** Cobrador/admin  
**Objetivo:** Navegar recorrido.  
**Precondiciones:** Coordenadas.  
**Punto de entrada:** Panel → Modo carretera.  
**Flujo principal:** Ordena, pide OSRM/tiles, solicita GPS, selecciona pin y abre contacto/cartulina.  
**Flujos alternativos:** Sin coords/GPS/red; fallback demo/recta.  
**Condiciones:** Stream cada 3 m.  
**Errores:** Evade bloqueo; orden distinto; red/errores silenciosos; sin cache/timeout.  
**Cambios de estado:** posición/foco/polilínea.  
**Datos involucrados:** coords exactas.  
**Persistencia:** No.  
**Mensajes:** Limitados.  
**Resultado:** Visual útil con privacidad/gates débiles.  
**Archivos relacionados:** panel_rutas_screen.dart:476-635; modo_carretera_screen.dart.  
**Clasificación:** C/D.  
**Preguntas pendientes:** Offline/GPS/orden.

## UF-EXPENSE-001

**Nombre:** Registrar/eliminar gasto  
**Actor:** Cobrador  
**Objetivo:** Descontar gasto.  
**Precondiciones:** Cierre no enviado.  
**Punto de entrada:** Tab Gastos.  
**Flujo principal:** Valida nombre/monto, crea y suma; elimina inmediato.  
**Flujos alternativos:** Cierre oculta controles; vacío.  
**Condiciones:** Sin ruta/autor/categoría.  
**Errores:** Sin edit/undo/backup por caja; no rollover.  
**Cambios de estado:** Gasto/entrega.  
**Datos involucrados:** Caja.  
**Persistencia:** data_caja_v2.  
**Mensajes:** Ninguno.  
**Resultado:** CRD básico local.  
**Archivos relacionados:** cobrador_gastos_screen.dart; caja_state.dart:95-112.  
**Clasificación:** A con intención B.  
**Preguntas pendientes:** Aprobación/comprobante/scope.

## UF-CLOSE-001

**Nombre:** Enviar cierre cobrador  
**Actor:** Cobrador  
**Objetivo:** Conciliar entrega.  
**Precondiciones:** Efectivo no null.  
**Punto de entrada:** Tab Cierre.  
**Flujo principal:** Registra boletas/efectivo, calcula descuadre y marca enviado.  
**Flujos alternativos:** Espera/aprobado/reabrir.  
**Condiciones:** Cero válido; frecuencia solo texto.  
**Errores:** Sin jornada/snapshot/transmisión; mutaciones posteriores; bloqueo parcial; flags ignorados.  
**Cambios de estado:** Caja/flags.  
**Datos involucrados:** movimientos/efectivo.  
**Persistencia:** Caja mutable.  
**Mensajes:** Enviado al administrador.  
**Resultado:** Flag local, no cierre contable.  
**Archivos relacionados:** cierre_dia_screen.dart; caja_state.dart:114-177.  
**Clasificación:** D.  
**Preguntas pendientes:** Corte/reapertura/frecuencia.

## UF-CLOSE-002

**Nombre:** Aprobar/configurar/historial admin  
**Actor:** Administrador  
**Objetivo:** Supervisar cierres.  
**Precondiciones:** Cierre enviado en misma caja local.  
**Punto de entrada:** Resumen/Config/Historial.  
**Flujo principal:** Aprueba/reabre; cambia flags/frecuencia; consulta históricos.  
**Flujos alternativos:** Historial vacío.  
**Condiciones:** Una caja por namespace, no cobrador.  
**Errores:** Admin/cobrador reales no comparten; config no se aplica; aprobar no crea histórico.  
**Cambios de estado:** Caja/config.  
**Datos involucrados:** Cierre/Caja.  
**Persistencia:** Namespace admin.  
**Mensajes:** Cierre aprobado.  
**Resultado:** Coordinación solo demo.  
**Archivos relacionados:** cierre_dia_screen.dart; historial_cierres_screen.dart.  
**Clasificación:** D.  
**Preguntas pendientes:** Versiones/scope/visibilidad.

## UF-REPORT-001

**Nombre:** Reporte Excel  
**Actor:** Administrador  
**Objetivo:** Exportar período.  
**Precondiciones:** Resumen.  
**Punto de entrada:** Generar Excel.  
**Flujo principal:** Elige rango, construye XLSX y abre share.  
**Flujos alternativos:** Rango cancelado/error.  
**Condiciones:** Solo cierres se filtran; personalizado termina a medianoche.  
**Errores:** Caja/gastos/clientes son actuales/globales; estados incorrectos; CTA “descargar” comparte.  
**Cambios de estado:** archivo/loading.  
**Datos involucrados:** cartera/caja/cierres.  
**Persistencia:** Archivo temporal.  
**Mensajes:** Error/share sheet.  
**Resultado:** XLSX real, semántica temporal defectuosa.  
**Archivos relacionados:** reporte_screen.dart:35-240.  
**Clasificación:** D.  
**Preguntas pendientes:** Tipo/alcance/formato fiscal.

## UF-REPORT-002

**Nombre:** Reporte/PDF cobrador  
**Actor:** Cobrador inferido  
**Objetivo:** Ver/exportar cobranza.  
**Precondiciones:** Ninguna entrada productiva.  
**Punto de entrada:** Solo preview/manual.  
**Flujo principal:** Suma histórico global y lista detalle.  
**Flujos alternativos:** Cero.  
**Condiciones:** Sin período/Caja.  
**Errores:** Inalcanzable; PDF no-op; no filtra.  
**Cambios de estado:** Ninguno.  
**Datos involucrados:** Todos clientes.  
**Persistencia:** Ninguna.  
**Mensajes:** Ninguno.  
**Resultado:** Funcionalidad incompleta.  
**Archivos relacionados:** reporte_cobranza_screen.dart.  
**Clasificación:** B/D.  
**Preguntas pendientes:** ¿Reporte cobrador requerido?

## UF-DATA-001

**Nombre:** Export/backup/restore  
**Actor:** Usuario con Ajustes  
**Objetivo:** Proteger/transferir datos.  
**Precondiciones:** LocalStore/filesystem.  
**Punto de entrada:** Ajustes o backup automático.  
**Flujo principal:** Exporta/share; primera mutación diaria crea backup; restore toma más reciente e importa al namespace actual.  
**Flujos alternativos:** Sin archivo/corrupto/error.  
**Condiciones:** Archivo global; marca diaria namespaced.  
**Errores:** Cruce de cuentas; backup post-mutación; omite medios/equipo; sin validar owner/schema.  
**Cambios de estado:** Archivos y datos.  
**Datos involucrados:** PII/finanzas.  
**Persistencia:** App documents/SharedPreferences.  
**Mensajes:** Restaurado/no hay/error.  
**Resultado:** Backup funcional pero inseguro/incompleto.  
**Archivos relacionados:** ajustes_screen.dart:85-266; backup_service.dart.  
**Clasificación:** D.  
**Preguntas pendientes:** Portabilidad/medios/cifrado.

## UF-DATA-002

**Nombre:** Restablecer datos  
**Actor:** Usuario con Ajustes  
**Objetivo:** Empezar vacío.  
**Precondiciones:** Confirmación.  
**Punto de entrada:** Restablecer.  
**Flujo principal:** Elimina cuatro claves y muestra éxito.  
**Flujos alternativos:** Cancelar.  
**Condiciones:** No borra equipo/fotos/backups/tema.  
**Errores:** Memoria no se limpia; próxima mutación resucita datos.  
**Cambios de estado:** Solo disco.  
**Datos involucrados:** Rutas/clientes/caja/cierres.  
**Persistencia:** Remove keys.  
**Mensajes:** Éxito incondicional.  
**Resultado:** Reset defectuoso.  
**Archivos relacionados:** ajustes_screen.dart:268-293; local_store.dart:262-269.  
**Clasificación:** D.  
**Preguntas pendientes:** Alcance/reautenticación.

## UF-SET-001

**Nombre:** Cambiar tema  
**Actor:** Cualquier usuario  
**Objetivo:** Ajustar apariencia.  
**Precondiciones:** Ajustes.  
**Punto de entrada:** Switch/selector.  
**Flujo principal:** Fija system/light/dark y persiste.  
**Flujos alternativos:** Valor desconocido → system.  
**Condiciones:** Global del dispositivo.  
**Errores:** Sin defecto funcional crítico; controles redundantes.  
**Cambios de estado:** ThemeMode.  
**Datos involucrados:** preferencia.  
**Persistencia:** pref_tema_v1.  
**Mensajes:** Ninguno.  
**Resultado:** Confirmado.  
**Archivos relacionados:** theme_state.dart; ajustes_screen.dart:35-83.  
**Clasificación:** A.  
**Preguntas pendientes:** ¿Por cuenta?

## UF-ADMIN-001

**Nombre:** Panel administrativo  
**Actor:** Administrador  
**Objetivo:** Ver KPIs/herramientas.  
**Precondiciones:** Tab Resumen.  
**Punto de entrada:** AdminHome.  
**Flujo principal:** Agrega todos los clientes, calcula cartera/estados/caja y abre invitación, permisos, cierre y Excel.  
**Flujos alternativos:** Todo cero.  
**Condiciones:** Meta usa entregaEsperada.  
**Errores:** Sin fecha/scope; “interés” incluye ajustes; datos multiusuario ausentes.  
**Cambios de estado:** Slider boleta.  
**Datos involucrados:** Todos globales.  
**Persistencia:** Caja.  
**Mensajes:** Ninguno.  
**Resultado:** Dashboard local con KPIs ambiguos.  
**Archivos relacionados:** admin_resumen_screen.dart; caja_state.dart.  
**Clasificación:** C.  
**Preguntas pendientes:** Definición/alcance de KPIs.

## UF-CONFIG-001

**Nombre:** Configurar tasas/frecuencia/suscripción  
**Actor:** Administrador  
**Objetivo:** Definir defaults.  
**Precondiciones:** Config.  
**Punto de entrada:** Mensualidades.  
**Flujo principal:** Muestra campos y tarjeta de prueba.  
**Flujos alternativos:** Pago disabled.  
**Condiciones:** Sin controllers/onChanged.  
**Errores:** Nada persiste ni alimenta formularios; contradice billing.  
**Cambios de estado:** Ninguno.  
**Datos involucrados:** Ninguno real.  
**Persistencia:** Ninguna.  
**Mensajes:** Ninguno.  
**Resultado:** Mock de configuración.  
**Archivos relacionados:** mensualidades_screen.dart.  
**Clasificación:** B/D.  
**Preguntas pendientes:** Defaults/rangos/scope.

## UF-ROLE-001

**Nombre:** Ver como/impersonar cobrador  
**Actor:** Administrador  
**Objetivo:** Previsualizar/operar como cobrador.  
**Precondiciones:** AdminHome/Cobradores.  
**Punto de entrada:** Icono moto o Entrar.  
**Flujo principal:** Flag conserva admin; impersonación reemplaza Usuario; ambos conservan namespace admin.  
**Flujos alternativos:** Volver/salir impersonación.  
**Condiciones:** Simulación sobrevive logout; sin auditoría.  
**Errores:** Dos conceptos ambiguos; acciones reales sobre datos admin; pantalla Sin Equipo interna casi inalcanzable y CTA vacía.  
**Cambios de estado:** flag o identidad temporal.  
**Datos involucrados:** Usuario/contexto.  
**Persistencia:** Solo mutaciones realizadas.  
**Mensajes:** Simulación.  
**Resultado:** Preview útil pero riesgoso.  
**Archivos relacionados:** admin_home_screen.dart:101-110; auth_state.dart:364-390.  
**Clasificación:** C/D.  
**Preguntas pendientes:** ¿Preview o impersonación real?

## Funciones sin flujo completo

- EquipoTrabajoScreen: pantalla duplicada huérfana.
- ReporteCobranzaScreen: huérfana y PDF no-op.
- eliminarCliente, desmarcarVisitado y reiniciarVisitados: sin caller UI.
- no existen editar/eliminar préstamo, anular pago, editar gasto, revocar invitación, editar perfil, cancelar suscripción o generar cierre histórico real.
- constantes AppRoutes adicionales caen a Landing.

## Estados de carga, offline y reintento

| Área | Loading | Offline | Reintento |
|---|---|---|---|
| Login/Google | Spinner | Error Firebase | Manual |
| Restaurar sesión | No explícito | Falla y deja Landing | Reiniciar/manual |
| Sync | Barra mínima | Siempre deshabilitado | No |
| OSRM/tiles | No | Fallback/silencio | No |
| GPS | Texto parcial | Permiso/fallo silencioso o sintético | Botón/entrada |
| Wompi sim | Delay/spinner | No real | Botón |
| Excel | Spinner | Local | Manual |
| Backup/restore | Sin loading robusto | Local | Manual |

