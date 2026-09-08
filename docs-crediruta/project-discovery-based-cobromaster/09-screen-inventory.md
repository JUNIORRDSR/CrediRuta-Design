# 09. Inventario de pantallas

## Resumen

| Grupo | Superficies |
|---|---:|
| Admin | 15 |
| Cobrador | 7 |
| Cliente/cartera | 6 |
| Auth | 3 |
| Landing/sistema | 2 |
| Ajustes | 1 |
| **Total** | **34** |

32 son alcanzables desde el árbol productivo. EquipoTrabajoScreen y ReporteCobranzaScreen están huérfanas.

## Pantallas

| # | Pantalla / archivo | Actor / entrada | Acciones principales | Estados/condiciones | Accesibilidad | Clase |
|---:|---|---|---|---|---|---|
| 1 | LandingScreen / landing_screen.dart | Público; raíz sin sesión | Login, registro, demos | Scroll; roles | Alcanzable | A |
| 2 | ErrorHorarioApp / error_horario_screen.dart | Sistema; reloj inválido | Contactar soporte visual | Bloqueo sin retry | Alcanzable condicional | D |
| 3 | LoginScreen / login_screen.dart | Público | Email/password, Google, reset, demos | Loading/errores | Alcanzable | C |
| 4 | RegistroFlujoScreen / registro_flujo_screen.dart | Público | Alta admin/cobrador | PageView/validación | Alcanzable; rama cobrador rota | D |
| 5 | VerificacionCorreoScreen / verificacion_correo_screen.dart | No verificado | Refrescar, reenviar, salir | Plazo 24 h visual | Alcanzable | C |
| 6 | AdminHomeScreen / admin_home_screen.dart | Admin | 5 tabs, ruta, simular, ajustes | Usuario/ruta | Alcanzable | A |
| 7 | AdminResumenScreen / admin_resumen_screen.dart | Admin tab | KPIs, boletas, tools | Métricas agregadas | Alcanzable | C |
| 8 | GestionRutasScreen / gestion_rutas_screen.dart | Admin tab | Crear, abrir, editar, renovar, borrar | Vacío/pagada | Alcanzable | C |
| 9 | CrearRutaScreen / crear_ruta_screen.dart | Admin > nueva | Foto, datos, cobrador, guardar | Form/imagen | Alcanzable | C |
| 10 | PantallaBloqueoPago / pantalla_bloqueo_pago.dart | Ruta impaga/renovar | Plazo, cupón, Wompi | Loading cupón | Alcanzable | C/D |
| 11 | WompiSimuladorScreen / wompi_simulador_screen.dart | Billing sim | Método, éxito/rechazo | Delay/resultado | Alcanzable | B/D |
| 12 | MensualidadesScreen / mensualidades_screen.dart | Config admin | Tasa/frecuencia/pago | Campos no persistentes | Alcanzable | B/D |
| 13 | GestionCobradoresScreen / gestion_cobradores_screen.dart | Admin tab | Lista, asignar, permisos, quitar, impersonar | Vacío/mocks | Alcanzable | C/E |
| 14 | EquipoTrabajoScreen / equipo_trabajo_screen.dart | Solo preview | Invitación/asignación simple | Duplicada | Huérfana | E |
| 15 | ConfigCobradorScreen / config_cobrador_screen.dart | Resumen/tool | 6 switches/frecuencia | Global/decorativo | Alcanzable | D |
| 16 | InvitacionScreen / invitacion_screen.dart | Admin tools | Generar QR/código, copiar/share | Historial/validez | Alcanzable | B |
| 17 | CierreDiaScreen / cierre_dia_screen.dart | Admin/cobrador tab/tool | Efectivo, boleta, enviar/aprobar/reabrir | Rol/flags | Alcanzable | C/D |
| 18 | HistorialCierresScreen / historial_cierres_screen.dart | Config admin | Lista/detalle | Vacío real/demo | Alcanzable | D |
| 19 | ReporteScreen / reporte_screen.dart | Resumen admin | Rango, generar/share XLSX | Loading/error | Alcanzable | D |
| 20 | AdminConfigScreen / admin_config_screen.dart | Admin tab | Mensualidades, historial | Lista de dos cards | Alcanzable | A |
| 21 | GestionClientesScreen / gestion_clientes_screen.dart | Tab ambos | Buscar, abrir, crear | Sin ruta/vacío/sin resultados | Alcanzable | C/D |
| 22 | NuevoClienteScreen / nuevo_cliente_screen.dart | Clientes FAB | PII, foto, GPS, préstamo | Form/permisos | Alcanzable | D |
| 23 | EditarClienteScreen / editar_cliente_screen.dart | Cartulina | Datos, foto, clavo, boleta | Form | Alcanzable | C |
| 24 | CartulinaScreen / cartulina_screen.dart | Lista/mapa | Editar, contacto, préstamo, pago, retaque, ajustes | Solo lectura parcial/estados | Alcanzable | C/D |
| 25 | NuevoPrestamoScreen / nuevo_prestamo_screen.dart | Cartulina | Normal/fijo/importado/manual | Preview en vivo | Alcanzable | C |
| 26 | RegistrarPagoScreen / registrar_pago_screen.dart | Cartulina | Pago/retaque | Monto/tipo | Alcanzable | D |
| 27 | CobradorHomeScreen / cobrador_home_screen.dart | Cobrador vinculado/simulado | 4 tabs, ajustes, salir modo | Equipo/impersonación | Alcanzable | C |
| 28 | UnirseEquipoScreen / unirse_equipo_screen.dart | Cobrador huérfano | Código/QR sim, activar plan, salir | Tabs/loading/error | Alcanzable | D |
| 29 | PanelRutasScreen / panel_rutas_screen.dart | Cobrador tab/admin ruta | Selector, mapa, cobrar/no pagó, ordenar, carretera | Vacío/solo lectura | Alcanzable | C/D |
| 30 | ModoCarreteraScreen / modo_carretera_screen.dart | Panel | GPS, mapa, foco, contacto, cartulina | Permiso/señal | Alcanzable | C/D |
| 31 | OrdenarClientesScreen / ordenar_clientes_screen.dart | Panel | Drag/reorder | Vacío | Alcanzable | A/C |
| 32 | CobradorGastosScreen / cobrador_gastos_screen.dart | Cobrador tab | Crear/eliminar gasto | Vacío/cierre | Alcanzable | A |
| 33 | ReporteCobranzaScreen / reporte_cobranza_screen.dart | Solo preview | Resumen y PDF no-op | Sin estado dedicado | Huérfana | B/D |
| 34 | AjustesScreen / ajustes_screen.dart | Ambos homes | Tema, export, restore, reset, logout | Diálogos/Snackbars | Alcanzable | C/D |

## Navegación principal

### Administrador

Barra inferior: Resumen, Rutas, Clientes, Cobradores y Config.

AppBar: selector global de ruta, Ver como Cobrador y Ajustes.

### Cobrador

Barra inferior: Ruta, Clientes, Gastos y Cierre.

AppBar: salir de impersonación/simulación y Ajustes.

### Rutas nombradas

Solo /login y /register se registran de forma efectiva. /onboarding abre Landing. Las demás constantes caen a Landing.

## Pantallas con responsabilidades excesivas

| Pantalla | Líneas | Responsabilidades |
|---|---:|---|
| ModoCarretera | 796 | HTTP OSRM, GPS, mapa, contacto, navegación y UI |
| PanelRutas | 674 | Selector, mapa, lista, pagos, visitas y diálogos |
| Cartulina | 674 | Ficha, cartera, ajustes, contacto y navegación |
| NuevoPrestamo | 587 | Producto, cálculo, importación y formulario |
| NuevoCliente | 545 | PII, foto, GPS, préstamo y caja |
| AdminResumen | 543 | KPIs, caja y accesos |
| GestionCobradores | 503 | Supervisión, asignación, permisos e impersonación |

## Estados vacíos confirmados

- rutas sin datos;
- clientes sin ruta/sin clientes/sin resultados;
- gastos vacíos;
- equipo vacío;
- historial de cierres vacío;
- ordenar clientes vacío;
- mapa sin ubicaciones.

## Estados de carga confirmados

- login/Google;
- registro durante alta;
- verificación al refrescar;
- unión con espera simulada;
- cupón;
- Wompi simulada;
- Excel;
- SyncWrapper;
- GPS como mensaje parcial.

No hay estado de carga para restauración de sesión, persistencia local, backup/restore, tiles/OSRM o cambio de tenant.

## Evidencia visual histórica

La carpeta **capturas_cobromaster/** contiene 17 PNG. Son anteriores o potencialmente anteriores al commit auditado:

- una captura de Admin Resumen muestra 4 tabs, mientras el código actual define 5;
- por ello no se usan como prueba de la UI vigente;
- sirven para rastrear intención visual y cambios de nomenclatura.

No se capturó runtime actual porque el entorno no expuso un navegador controlable. Esta limitación impide afirmar contraste, foco, targets o reflow visual en ejecución.

