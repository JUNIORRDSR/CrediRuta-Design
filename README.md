# CrediRuta · repositorio de diseño

Material de diseño de CrediRuta: los contratos visuales, el inventario de pantallas y el
prototipo navegable. **Aquí no hay código de la app**. La app real se construye en otro
repositorio tomando esto como fuente de verdad.

Lienzo publicado (versión 6): <https://claude.ai/code/artifact/7025abdb-b91c-4816-9d58-9a8e81222354>

El lienzo y este repositorio tienen el mismo contenido. La copia local vive en
`design/canvas/` y se puede abrir sin conexión: `design/canvas/rediseno-crediruta.html`
es la página publicada entera, editor incluido.

> Si alguien edita el lienzo en línea y le da a Save, el repositorio **no** se actualiza solo.
> Hay que volver a exportar el artifact a `design/canvas/`.

## Por dónde empezar si vas a construir la app

Léelo en este orden:

1. `design/contratos/04-arquitectura-informacion.md` — qué pantallas existen, cómo se
   llega a cada una y qué puede hacer cada rol. Empieza por aquí: define el alcance.
2. `design/contratos/02-sistema-visual.md` — colores, tipografía, espaciado, radios.
   Fuente de verdad del aspecto: si un valor no está ahí, no existe. Implementación de
   referencia en `design/app/base.css`.
3. `design/contratos/05-contenido-y-terminologia.md` — una palabra por concepto. No se
   negocia por pantalla.
4. `design/app/pantallas/` — las 38 pantallas, una por archivo. El contrato de cada
   fragmento está en `design/app/SPEC.md`.
5. `docs-crediruta/` — la auditoría del sistema anterior, los ADR y el contrato de API.
   Es el porqué de casi todas las decisiones de arriba.

Faltan los contratos 01 y 03; nunca se escribieron.

## Estructura

| Carpeta | Qué hay |
|---|---|
| `design/contratos/` | Los contratos de diseño. Fuente de verdad. |
| `design/app/pantallas/` | Una pantalla por archivo, como fragmento HTML. Se editan a mano. |
| `design/app/base.css` | El sistema visual implementado. |
| `design/app/crediruta.html` | Prototipo navegable en un solo archivo. Generado. |
| `design/canvas/` | Los mismos diseños como artboards del lienzo. Generado. |
| `design/prototipo/` | Artboards de una iteración anterior. Histórico. |
| `docs-crediruta/` | Auditoría del sistema anterior, ADR, contrato de API. |

## Regenerar lo generado

Las pantallas se editan en `design/app/pantallas/`; el prototipo y los artboards salen de ahí.

```bash
node design/app/construir.mjs
```

```bash
node design/app/artboards.mjs
```

## Sobre el nombre

El producto se llama **CrediRuta** (ADR-001, contrato 05 §1). `CobroMaster` y `Presta Ya`
son nombres heredados del sistema anterior. La carpeta de auditoría conserva los nombres
viejos a propósito, porque uno de sus hallazgos es que las tres marcas convivían.
