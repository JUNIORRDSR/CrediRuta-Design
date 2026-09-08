# 10. Interfaz y comportamiento visual

## Alcance y límite de evidencia

La auditoría funcional de UI se realizó sobre los 34 árboles de widgets, tema, componentes, callbacks y condiciones. Las 17 capturas del repositorio son históricas y no demuestran el runtime del commit auditado. El entorno no expuso un navegador controlable, por lo que:

- no se afirma fidelidad pixel-perfect actual;
- no se midió contraste real;
- no se probó lector de pantalla, teclado, zoom o text scaling;
- no se verificaron focus order, tamaños táctiles en dispositivo ni reflow.

## Sistema visual

### Intencional

- Material 3.
- Tema claro/oscuro monocromático.
- Superficies sin tintes.
- Radio 16 para inputs/botones/cards y 28 para diálogos.
- Botones principales de mínimo 54 px.
- Color reservado principalmente para estado/acento.
- AppCard con borde fino y sin sombra pesada.
- EstadoChip acompaña color con texto.
- ClienteAvatar usa foto o iniciales determinísticas.
- Barra inferior personalizada con icono, píldora y label.

Evidencia: **app_theme.dart:3-89**, **app_colors.dart:3-13**, **app_card.dart**, **estado_chip.dart**, **app_nav_bar.dart**.

### Fortalezas que conviene conservar

1. Jerarquía de CTA principal/secundario clara en Landing.
2. Componentes de estado con texto, no solo color.
3. Targets principales grandes.
4. Modo oscuro nativo.
5. Avatares robustos con fallback.
6. Estados vacíos en módulos operativos.
7. Confirmación en borrado de ruta y reset.
8. Resúmenes financieros con agrupación visual.
9. Navegación por rol fácil de aprender.

## Jerarquía y navegación

### Administrador

- AppBar superior con título/rol, selector de ruta, simulación y Ajustes.
- Cinco tabs inferiores.
- Cada tab inserta otra pantalla; GestionCobradores añade un segundo Scaffold/AppBar dentro de AdminHome.

El doble AppBar de Cobradores es inconsistente y consume altura. Evidencia: **admin_home_screen.dart:46-148**, **gestion_cobradores_screen.dart:23-38**.

### Cobrador

- Cuatro tabs inferiores.
- Acciones de modo en AppBar.
- Ruta y Clientes son dos entradas al mismo dominio, pero aplican gates distintos.

### Rutas nombradas

El archivo central de rutas sugiere navegación completa, pero casi todo usa MaterialPageRoute directo. Deep links y guards no son uniformes.

## Formularios

### Patrón AS-IS

- TextField/TextFormField con validación distribuida.
- Errores en SnackBar o retorno silencioso.
- Muchos montos usan int.tryParse.
- Previews financieras se calculan en build/setState.
- Imágenes/GPS se ejecutan desde la pantalla.

### Riesgos

| Riesgo | Ejemplo | Impacto |
|---|---|---|
| Validación no inline | Gastos, ajustes, pago rápido | Usuario no sabe qué campo falló |
| Reglas distintas | Alta vs edición Cliente | Datos incompletos |
| Formato monetario no uniforme | Cobro rápido entero crudo | Fricción/errores |
| CTA prematura | Registro cobrador | Flujo imposible |
| Valores no persistentes | Mensualidades | Falsa expectativa |
| Foco/error no dirigido | Snackbars | Accesibilidad y recuperación |
| Campos sin controller | Efectivo/config | UI contradice estado |

## Botones, menús y modales

### Correctos o útiles

- Confirmación de eliminar ruta.
- Confirmación de restablecer datos.
- Modal de no pagó.
- Selección de cámara/galería.
- Menús de préstamo para agrupar ajustes.

### Inconsistentes

- “Crear Ruta e Ir a Pago” solo vuelve.
- “Exportar PDF” no hace nada.
- “Ingresar Código de Invitación” dentro de CobradorHome tiene callback vacío.
- “Descargar/Generar Excel” termina en share sheet.
- Wompi presenta formulario realista pero el resultado depende de botones locales.
- Borrar gasto no confirma ni ofrece undo.
- Reenvío de correo muestra éxito aunque falle.

Clasificación D/E según la acción.

## Listas, tarjetas y mapas

- Listas de rutas/clientes/gastos/equipo usan cards legibles.
- PanelRutas anida ListView shrinkWrap dentro de otra lista y recalcula filtros por ítem.
- Mapa numera un orden optimizado diferente al orden manual de la lista.
- Rojo/verde de marcadores comunica visitado, pero el evento “visitado” no distingue pago/no pago.
- GPS/actividad de cobradores se presentan como tiempo real aunque son constantes.

La interfaz representa información inexistente o distinta del dominio; el problema es funcional, no estético.

## Estados visuales

| Estado | Implementación | Evaluación |
|---|---|---|
| Loading login/Google | Spinner y botones deshabilitados | Conservar |
| Loading sesión | No existe | Añadir |
| Sync | Barra 3 px aunque sync apagada | Retirar/renombrar |
| Rutas vacías | CTA clara | Conservar |
| Clientes vacíos/sin resultados | Mensajes distintos | Conservar; corregir conteos |
| Gastos vacíos | Mensaje/CTA | Conservar |
| Equipo vacío | Invitación | Copy promete tiempo real falso |
| Historial vacío | Promete cierres futuros que no se generan | D |
| Error OSRM/tiles | Silencioso/fallback | Señalar estado |
| GPS | Mensajes parciales y fallback falso | D |
| Guard ruta/cierre | Oculta controles solo en algunos caminos | D |

## Visibilidad condicional y permisos

1. Ruta impaga: Panel oculta acciones; Clientes/ModoCarretera no.
2. Cierre enviado: Cartulina y Gastos bloquean partes; alta/edición de Cliente y efectivo/boleta siguen.
3. Configuración mostrar*: seis switches se guardan, pero Cierre no los consulta.
4. Simular cobrador: conserva rol admin en Cierre.
5. Solo lectura Cartulina: oculta nuevo préstamo/pago/menú, pero Editar Cliente permanece.
6. Compartir préstamo se oculta junto con mutaciones, aunque es lectura.

Estas inconsistencias deben resolverse con permisos de caso de uso y una proyección visual única.

## UI presente sin implementación completa

- Mensualidades/tasas;
- Wompi;
- escaneo QR;
- deep link;
- PDF cobrador;
- GPS/actividad de equipo;
- CloudSync visual;
- cierre histórico real;
- permisos del cobrador;
- “Sin equipo” CTA interno.

## Lógica sin acceso UI

- eliminarCliente;
- desmarcarVisitado;
- reiniciarVisitados;
- EquipoTrabajoScreen;
- ReporteCobranzaScreen;
- varias AppRoutes;
- clearing de foto/fecha de ruta mediante estado;
- edición/reverso de pagos y préstamos no existen.

## Inconsistencias de terminología

- CobroMaster: repositorio/documentos.
- CrediRuta: MaterialApp, logo y Android label.
- Presta Ya: Firebase, dominio y Plan Ya.
- “Dinero en la calle” puede significar saldo total, no capital.
- “Interés proyectado” incluye ajustes.
- “Meta del día” usa entrega esperada.
- “Visitado” incluye pago y no pago.
- “Cierre” es solo un flag.

## Diseño que parece improvisado/generado

- pantallas de 500–796 líneas;
- estilos y colores locales fuera del tema;
- lógica HTTP/GPS/archivos dentro de widgets;
- duplicación de pantallas/equipo;
- textos comerciales no respaldados;
- mocks mezclados con producción;
- dos modos de simulación/impersonación;
- múltiples fórmulas/inputs para la misma regla.

Esto no implica que todo deba descartarse: la estructura visual general es coherente y usable como referencia, pero sus callbacks y estados deben reconstruirse.

## Accesibilidad

### Fortalezas confirmables en código

- botones principales de 54 px;
- muchos IconButton tienen tooltip;
- estados usan texto además de color;
- Material widgets aportan semántica base;
- contenido principal suele usar scroll;
- modo oscuro.

### Riesgos

| Riesgo | Evidencia | Verificación TO-BE |
|---|---|---|
| Labels de nav de 10 px y contenedor fijo 60 | app_nav_bar.dart:42-108 | Text scale 200 %, reflow |
| Barra custom no marca selected semánticamente | app_nav_bar.dart:80-109 | TalkBack/VoiceOver |
| Errores solo SnackBar | formularios | Asociación, foco y anuncio |
| Cambios de estado sin live region | pago/cierre/sync | Semantics/live announcements |
| Mapas/pins/drag | panel/modo/ordenar | Alternativa no visual/teclado |
| Contraste de acentos/dark no medido | colores locales | WCAG contrast |
| Iconos/gestos locales sin tooltip consistente | pantallas grandes | Auditoría automática/manual |
| Texto fijo y cards densas | dashboards | Zoom/reflow |
| Confirmaciones no uniformes | gasto/pago/ajustes | Prevención/undo |

No se afirma cumplimiento WCAG.

## Capturas históricas

Las capturas confirman la intención monocromática, cards redondeadas, KPIs de color y barra inferior. También evidencian desfase:

- Admin Resumen histórico muestra cuatro tabs; el código actual tiene cinco.
- Los nombres y fechas de demo no prueban datos actuales.

Por tanto se usan como referencia de intención, no como evidencia AS-IS ejecutada.

## TO-BE de UI

1. Mantener tema, cards, botones grandes y navegación por rol.
2. Definir design tokens y componentes para money/form/status/empty/error.
3. Unificar shell: cada tab no debe crear AppBar duplicada.
4. Mostrar solo capacidades reales por ambiente.
5. Aplicar permisos/gates desde una proyección central.
6. Formularios con validación inline, foco y formato monetario.
7. Estados loading/error/offline/retry explícitos.
8. No presentar datos simulados como tiempo real.
9. Distinguir visita, pago y no pago.
10. Probar accesibilidad, dark mode y text scaling en cada flujo crítico.

