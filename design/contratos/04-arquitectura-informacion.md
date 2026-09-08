# Contrato 04 · Arquitectura de la información

Define qué pantallas existen, cómo se llega a ellas y qué puede hacer cada rol.
Corrige los defectos documentados del sistema anterior: dos entradas al mismo dominio con
compuertas distintas, AppBar duplicada, cinco pestañas, y acciones que evadían bloqueos.

---

## 1. Dos aplicaciones, un producto

| Rol | Trabajo real | Pestañas |
|---|---|---:|
| **Cobrador** | Recorrer la ruta, cobrar, gastar, cuadrar y entregar | 3 |
| **Administrador** | Supervisar rutas, revisar entregas, mover el equipo, reportar | 4 |

No hay un tercer shell. El "modo demo" y el "ver como cobrador" son el mismo shell del cobrador
con un banner de contexto, nunca una tercera variante.

### Navegación del cobrador

```
Ruta          Clientes        Caja
(el día)      (la cartera)    (el dinero)
```

- **Ruta** — el orden de visita de hoy. Pantalla de inicio del cobrador.
- **Clientes** — buscar cualquier cliente de sus rutas asignadas, esté o no en el recorrido de hoy.
- **Caja** — gastos, entrega esperada y cierre. **Una sola pestaña**, no dos.

### Navegación del administrador

```
Hoy          Rutas         Cartera        Equipo
```

- **Hoy** — panel de control: KPI, cierres por revisar, avance del recaudo, estado de la cartera.
- **Rutas** — rutas, cobrador asignado, mora y vigencia de la mensualidad.
- **Cartera** — búsqueda global de clientes y préstamos en todas las rutas.
- **Equipo** — cobradores, invitaciones y permisos.

Reportes y Ajustes **no son pestañas**: se llega desde una tarjeta en Hoy y desde el icono de
ajustes de la barra superior.

---

## 2. Regla de una sola concha

Una pantalla tiene **una** barra superior. Una pestaña nunca inserta una pantalla que traiga su
propia barra: eso duplica altura y confunde el botón atrás.

- Pantalla de pestaña: barra superior con título + subtítulo de contexto + acciones. Sin botón atrás.
- Pantalla de detalle: barra superior con botón atrás (`i-back`) o cerrar (`i-close`), título y
  subtítulo. **Sin barra de navegación inferior.**
- Formulario o flujo: siempre `i-close`, nunca `i-back`; cerrar descarta, y si hay datos escritos
  se confirma antes de descartar.

El botón atrás del sistema Android hace exactamente lo mismo que el botón atrás de la pantalla.
Nunca se atrapa al usuario.

---

## 3. Mapa de pantallas

### Entrada

| Pantalla | Llega desde | Sale a |
|---|---|---|
| Bienvenida | Arranque sin sesión | Ingresar · Unirse a un equipo |
| Ingresar | Bienvenida | Ruta (cobrador) · Hoy (administrador) |
| Unirse a un equipo | Bienvenida, o cobrador sin equipo | Ruta |

La bifurcación ocurre **en la bienvenida**, no después del registro: quien tiene un negocio crea
empresa; quien fue invitado escribe un código. El sistema anterior dejaba la rama del cobrador rota
porque preguntaba el rol demasiado tarde.

### Cobrador

| Pantalla | Llega desde | Acciones que abre |
|---|---|---|
| **Ruta** | Pestaña · inicio de sesión | Hoja de cobro · Hoja de visita · Cartulina · Modo carretera |
| **Clientes** | Pestaña | Cartulina · Nuevo cliente |
| **Cartulina** | Ruta · Clientes · Cartera del admin | Hoja de cobro · Retaque · Nuevo préstamo · Editar cliente |
| **Nuevo cliente** | Clientes (FAB) | Nuevo préstamo |
| **Nuevo préstamo** | Cartulina · Nuevo cliente | Cartulina |
| **Caja** | Pestaña | Hoja de gasto · Cerrar caja |
| **Cerrar caja** | Caja | Caja (con el cierre enviado) |

### Administrador

| Pantalla | Llega desde | Acciones que abre |
|---|---|---|
| **Hoy** | Pestaña · inicio de sesión | Revisar cierre · Reportes |
| **Rutas** | Pestaña | Detalle de ruta · Nueva ruta · Renovar mensualidad |
| **Cartera** | Pestaña | Cartulina |
| **Equipo** | Pestaña | Detalle de cobrador · Invitar cobrador |
| **Revisar cierre** | Hoy · Equipo | Aprobar · Devolver para corregir |
| **Reportes** | Hoy | Descargar Excel |
| **Invitar cobrador** | Equipo (FAB) | — |

### Hojas inferiores (no son pantallas)

`Registrar pago` · `Resultado de visita` · `Retaque` · `Agregar gasto`

Una hoja se usa cuando la tarea es corta, tiene un solo resultado y el usuario necesita seguir
viendo el contexto detrás. Si la tarea necesita más de una decisión importante, es una pantalla.

---

## 4. Jerarquía dentro de una pantalla

Orden fijo, de arriba abajo:

1. **Contexto** — barra superior: dónde estoy, de qué ruta y de qué día.
2. **El número que importa** — un `.h1` o una tarjeta KPI. Uno solo.
3. **Lo que necesita mi acción** — cierres por revisar, clientes atrasados, campos con error.
4. **El trabajo** — la lista, el formulario, la ficha.
5. **La acción principal** — un solo botón `.btn--primary`, al final del contenido o fijo abajo.

Nunca hay dos acciones principales compitiendo. Las secundarias son `.btn--ghost` o `.btn--soft`.

---

## 5. Compuertas: una sola proyección

El sistema anterior ocultaba controles en unas rutas de navegación y los dejaba visibles en otras,
así que la misma acción se podía ejecutar por otro camino. **Prohibido.**

Cada capacidad se resuelve en un solo lugar y el resultado se aplica en todas las entradas:

| Condición | Qué se bloquea | Qué se sigue pudiendo | Cómo se comunica |
|---|---|---|---|
| Caja cerrada (enviada) | Registrar pagos, gastos, préstamos y retaques del día cerrado | Consultar todo, llamar, ver cartulina | Banner en Ruta y en Caja + botones en estado apagado con la razón |
| Ruta con mensualidad vencida | Crear préstamos y retaques | Cobrar, registrar visitas, cerrar caja | Aviso ámbar en la ruta y en Rutas del admin, con la acción para renovar |
| Cobrador sin permiso de descuento | Aplicar descuentos | Todo lo demás | La acción no aparece; no aparece apagada |
| Sin conexión | Nada del trabajo diario | Todo: cobrar, gastar, cerrar | Indicador discreto "Sin conexión · se envía luego" |

**Regla de oro:** si una acción está bloqueada, se ve bloqueada **con la razón visible**, o no se ve.
Nunca falla en silencio después de tocarla.

---

## 6. Qué ve cada rol

| Dato | Cobrador | Administrador |
|---|---|---|
| Clientes y préstamos | Solo de sus rutas asignadas | Todas las rutas |
| Caja y cierres | Solo la suya | La de todos sus cobradores |
| Ganancia e interés de la ruta | Solo si el admin lo habilita | Siempre |
| Permisos del equipo | No los ve | Los configura |
| Reportes | No | Sí |
| Otros cobradores | Solo nombre, si comparten ruta | Todos |

La lista de rutas del cobrador se consulta filtrada por su membresía, no filtrada en pantalla.

---

## 7. Profundidad máxima

Tres niveles desde cualquier pestaña:

```
Pestaña → Detalle → Hoja o formulario
```

Si un flujo necesita un cuarto nivel, el flujo está mal descompuesto. Cobrarle a un cliente son
**dos toques** desde la pantalla de Ruta: tocar "Registrar pago" y confirmar.

---

Ver también: [02 · Sistema visual](02-sistema-visual.md) · [05 · Contenido y terminología](05-contenido-y-terminologia.md) · [06 · Reglas de interacción](06-reglas-de-interaccion.md)
