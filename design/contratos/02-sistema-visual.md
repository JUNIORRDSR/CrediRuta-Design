# Contrato 02 · Sistema visual

Esta es la fuente de verdad del aspecto de CrediRuta. Si un valor no está aquí, no existe:
no se inventan colores, tamaños ni radios en una pantalla.

Implementación de referencia: [`design/app/base.css`](../app/base.css).

---

## 1. Principio rector

**Blanco, aire y un dato grande por pantalla.**
El color no decora: solo aparece en las tarjetas KPI, en los badges de estado, en el botón principal
y en la píldora de la pestaña activa. Todo lo demás es blanco, gris muy claro y tinta.

Si una pantalla se siente vacía, se quitan elementos, no se agregan.

---

## 2. Color

### Neutros

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#0B0F14` | Texto principal, botón oscuro |
| `--ink2` | `#6B7280` | Texto secundario, subtítulos |
| `--ink3` | `#9CA3AF` | Etiquetas `.lbl`, texto terciario |
| `--line` | `#EDEFF3` | Bordes de tarjeta, separadores, pistas de progreso |
| `--soft` | `#F7F8FA` | Fondos suaves, tarjetas planas, estado `:active` |
| `--white` | `#FFFFFF` | Fondo de app y de tarjetas |

El fondo de la app es **blanco**, no gris. Las tarjetas se separan del fondo con una línea de 1px,
nunca con sombra.

### Acentos

Cuatro familias, cada una con tres papeles: sólido, fondo suave y tinta legible sobre el suave.

| Familia | Sólido | Suave | Tinta | Significa |
|---|---|---|---|---|
| Índigo | `#4F46E5` | `#EEF0FF` | `#3730A3` | Acción principal, navegación activa, informativo |
| Verde | `#10B981` | `#E7F8F1` | `#047857` | Pagado, al día, cuadrado, dinero que entra |
| Naranja | `#F59E0B` | `#FEF3E2` | `#B45309` | Atraso, falta, atención — **no** es error |
| Morado | `#A855F7` | `#F5EDFE` | `#7E22CE` | Proyección, interés, métrica derivada |
| Rojo | `#EF4444` | `#FEECEC` | `#B91C1C` | Error de validación, clavo, mora grave |

**Regla de contraste:** texto sobre fondo suave usa siempre la tinta de su familia, nunca el sólido.
Texto sobre sólido es siempre blanco.

**Naranja ≠ rojo.** El naranja dice "esto necesita tu atención"; el rojo dice "esto está mal o roto".
Un cliente atrasado es naranja. Un campo inválido es rojo.

### Degradados (solo tarjetas KPI)

| Clase | Degradado | Sombra de color |
|---|---|---|
| `.kpi--indigo` | `150deg, #6366F1 → #4338CA` | `0 10px 22px -12px rgba(79,70,229,.75)` |
| `.kpi--orange` | `150deg, #F8A81B → #D97706` | `0 10px 22px -12px rgba(217,119,6,.7)` |
| `.kpi--green` | `150deg, #10B981 → #047857` | `0 10px 22px -12px rgba(16,185,129,.7)` |
| `.kpi--purple` | `150deg, #B06BF9 → #7E22CE` | `0 10px 22px -12px rgba(168,85,247,.7)` |

Los degradados **solo** viven en `.kpi`. No hay degradados en botones, fondos, encabezados ni iconos.
Máximo 4 KPI por pantalla; si hay más de 4 métricas, la pantalla está mal planteada.

### Modo oscuro

Pendiente para v2. Cuando se implemente, se define invirtiendo los neutros y bajando la luminosidad
de los sólidos un 8%; los degradados se mantienen. **No se implementa como inversión automática.**

---

## 3. Tipografía

**Una sola familia: Onest.** Pila de respaldo: `Roboto, "Helvetica Neue", Arial, sans-serif`.
En Android nativo se mapea a la escala de tipos de Material 3 usando `sp`, nunca `px`.

| Clase | Tamaño | Peso | Interletraje | Uso |
|---|---:|---:|---|---|
| `.h1` | 30 | 800 | −0.035em | Titular de pantalla, cifra protagonista |
| `.h2` | 20 | 800 | −0.02em | Título de hoja, nombre de cliente en ficha |
| `.h3` | 17 | 700 | −0.01em | Título de tarjeta, cifra secundaria |
| — (base) | 15 | 400 | normal | Texto corrido |
| `.listrow__title` | 16 | 700 | −0.01em | Nombre en una fila de lista |
| `.muted` | 14 | 400 | normal | Texto secundario |
| `.small` | 13 | 400 | normal | Apoyo, marcas de tiempo |
| `.lbl` | 12 | 700 | +0.06em, VERSALES | Etiqueta de sección |
| `.nav__label` | 11 | 600 | normal | Etiqueta de pestaña |

**11px es el piso absoluto** y solo se usa en la barra de navegación. El cuerpo nunca baja de 13px.

### Números

Todo dinero, conteo y fecha numérica lleva la clase `.num`:
`font-variant-numeric: tabular-nums` más `letter-spacing: -0.015em`.
Sin cifras tabulares las columnas de dinero bailan y la app pierde credibilidad.

**Formato de dinero:** `$ 486.000` — espacio después del signo, punto de miles, **sin decimales**
(el negocio opera en pesos enteros). Cantidades grandes en resúmenes: `$ 18,4M` con coma decimal.
Nunca `486000`, nunca `$486,000`, nunca `486.000 $`.

---

## 4. Espaciado y forma

**Escala:** 4 · 8 · 12 · 16 · 20 · 24 · 28. Nada intermedio.

| Elemento | Valor |
|---|---|
| Margen lateral del `.body` | 20px |
| Espacio entre tarjetas | 12px (`.stack`) |
| Espacio entre bloques de sección | 16–20px |
| Relleno interno de `.card` | 18px |
| Relleno interno de `.kpi` | 16px arriba / 18px lados y abajo |
| Fondo del `.body` | 28px + alto de la nav |

### Radios

| Token | Valor | Aplica a |
|---|---:|---|
| `--r-card` | 20px | `.card`, `.list`, `.map` |
| `--r-kpi` | 22px | `.kpi` |
| `--r-btn` | 16px | `.btn`, `.field__box`, `.money` |
| `--r-sheet` | 28px | `.sheet__panel` (solo esquinas superiores) |
| — | 999px | `.chip`, `.nav__pill` |
| — | 15px | `.avatar` (14–16px según tamaño) |

Los radios **no se mezclan dentro de una misma tarjeta**: si una tarjeta es de 20px, sus botones
internos son de 16px, no de 12px.

### Sombras

Solo existen tres:

1. La sombra de color de las tarjetas KPI (tabla de degradados).
2. `.fab`: `0 10px 22px -10px rgba(79,70,229,.8)`.
3. `.toast`: `0 12px 26px -12px rgba(0,0,0,.6)`.

**Las tarjetas normales no llevan sombra.** Se separan con `1px solid var(--line)`.

---

## 5. Áreas táctiles

Piso duro: **48 × 48 px**, con 8px de separación entre objetivos tocables.
Cuando la pieza visible es más pequeña que 48 (el `.toggle` mide 52 × 31), el área táctil se
amplía con un `::after` posicionado: se toca 48, se ve 31.
La app la usan adultos, muchas veces de pie, con una mano, bajo el sol y a veces con guantes.

| Elemento | Alto |
|---|---:|
| `.btn` | 56 |
| `.btn--sm` | 48 |
| `.iconbtn` | 44 (excepción: solo en la barra superior, con 4px de aire alrededor → 48 efectivos) |
| `.chip`, `.seg__item` | 44 / 50 |
| `.listrow` | 14px de relleno vertical → 62–74 según contenido |
| `.nav__item` | 66 |
| `.field__box` | 56 |

Un icono suelto nunca es un objetivo táctil: siempre va dentro de `.iconbtn` o de una fila completa.

---

## 6. Iconografía

SVG en línea de trazo, `stroke-width: 2`, extremos y uniones redondeados, rejilla de 24.
Se referencian desde el sprite: `<svg class="i"><use href="#i-nombre"></use></svg>`.
Tamaños: `.i` = 22, `.i--sm` = 18, `.i--lg` = 26. Heredan color con `currentColor`.

**Nunca emoji.** Nunca iconos rellenos mezclados con iconos de trazo.
Catálogo completo en [`design/app/iconos.html`](../app/iconos.html); si falta uno, se dibuja
en el mismo estilo y se agrega al sprite — no se importa de otra familia.

---

## 7. El elemento firma: la cuadrícula de cuotas

El cobrador ya carga una cartulina de cartón con casillas que tacha. Esa rejilla es el objeto real
del oficio y es la marca visual del producto.

```
.cuotas        20 celdas de 10px de alto, gap 2px  → versión compacta (lista de ruta, marca)
.cuotas--big   10 columnas, celdas de 34px numeradas → versión de la ficha del cliente
```

| Estado | Clase | Aspecto |
|---|---|---|
| Pagada | `.is-paid` | Verde sólido, número blanco |
| Se saltó | `.is-late` | Naranja claro `#FBD5A5`, borde `#F3B96B`, número en tinta naranja |
| Hoy | `.is-today` | Tinta sólida, número blanco |
| Por venir | (sin clase) | Blanco con borde `--line`, número gris |

Reglas: siempre lleva leyenda la primera vez que aparece en una pantalla; nunca se usa como
adorno en pantallas sin préstamo; el número de celdas es el número real de cuotas del préstamo.

---

## 8. Lo que este sistema prohíbe

- Sombras difusas en tarjetas normales.
- Degradados fuera de `.kpi`.
- Emoji en la interfaz.
- Texto blanco sobre acento suave, o texto de acento sólido sobre acento suave.
- Más de un botón principal por pantalla.
- Barra de estado del sistema dibujada a mano (hora, batería, señal): ese espacio se reserva vacío
  con `.inset` porque el sistema pinta encima.
- Teclado virtual dibujado.
- Valores en `px` fijos para texto en la implementación nativa: van en `sp`.
- Texto de interfaz por debajo de 4,5:1 de contraste, incluido el blanco sobre acentos sólidos.
- Botones bloqueados en gris claro con texto blanco: `.is-off` va en `--soft` con texto `--ink2`
  y borde `--line`, y **la razón del bloqueo va encima del botón**, no en gris de 13px debajo.
- Colores o tamaños escritos directamente en una pantalla en vez de usar una clase del sistema.

---

Ver también: [03 · Componentes](03-componentes.md) · [04 · Arquitectura de la información](04-arquitectura-informacion.md) · [05 · Contenido y terminología](05-contenido-y-terminologia.md)
