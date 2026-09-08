# Contrato 05 · Contenido y terminología

El descubrimiento del sistema anterior encontró **tres marcas coexistiendo** (CobroMaster, CrediRuta,
Presta Ya) y una docena de términos que significaban cosas distintas según la pantalla. Eso no es un
problema de estilo: es la razón por la que un cobrador y un administrador no entendían el mismo número.

Este contrato fija una palabra por concepto. **No se negocia por pantalla.**

---

## 1. Marca

El producto se llama **CrediRuta**.

`CobroMaster` y `Presta Ya` quedan como nombres heredados: solo aparecen en migración de datos y
en artefactos históricos. **No se usan en la interfaz, ni en documentos nuevos.**

> **Q-01 cerrada.** El descubrimiento encontró tres marcas conviviendo (Q-B01) y
> [ADR-001](../../docs-crediruta/architecture/adr.md) ya había decidido marca única **CrediRuta**,
> con `applicationId` `com.crediruta.app`. Este contrato decía "CobroMaster" y contradecía esa
> decisión: era deriva de la documentación, no una decisión nueva. Queda alineado con el ADR.
> El dominio en producción, `crediruta.online`, coincide con la marca.

**Qué mirar cuando aparezca un nombre viejo:** si está en un documento de descubrimiento, es
evidencia de cómo estaba el sistema y **se deja como está**. Si está en un documento que describe
lo que se va a construir, es un error y se corrige.

---

## 2. Glosario obligatorio

Si la palabra está en la columna izquierda, se usa esa y solo esa.

| Palabra | Qué significa exactamente | Nunca se dice |
|---|---|---|
| **Cliente** | Persona que recibe préstamos y a quien se le cobra | Deudor, usuario, prestatario |
| **Cartulina** | La ficha del cliente con sus préstamos, cuotas y movimientos | Ficha, perfil, detalle |
| **Ruta** | Grupo de clientes asignado a un cobrador, con su vigencia comercial | Cartera, zona |
| **Préstamo** | Una obligación con capital, interés, cuotas y saldo | Crédito, obligación |
| **Capital** | El dinero que se entregó | Monto, valor prestado |
| **Interés** | El porcentaje que se suma al capital | Utilidad, ganancia (esos son del admin, no del préstamo) |
| **Total a pagar** | Capital + interés + ajustes | Total, deuda |
| **Cuota** | Lo que debe pagar en cada visita | Abono, valor fijo |
| **Saldo** | Lo que falta por pagar del total | Deuda, pendiente |
| **Pago** | Dinero recibido y aplicado a un préstamo | Abono, cobro, recaudo |
| **Abono parcial** | Pago menor a la cuota | Abono a secas |
| **Retaque** | Prestarle más sobre un préstamo que sigue activo | Renovación, refinanciación, adicional |
| **Visita** | El hecho de haber ido donde el cliente, con un resultado | Gestión, visitado |
| **Resultado de la visita** | Pagó · Abono parcial · No pagó · No estaba | — |
| **Gasto** | Salida de dinero del cobrador durante la jornada | Egreso |
| **Caja del día** | El dinero de una fecha, una ruta y un cobrador | Hoy, caja, jornada (para el usuario) |
| **Entrega esperada** | Lo que el cobrador debe entregar hoy | Meta, total a entregar |
| **Cerrar caja** | La acción del cobrador de contar y enviar | Cierre (para la acción) |
| **Cierre** | El documento resultante, con sus estados | Entrega, liquidación |
| **Aprobar cierre** | La confirmación del administrador | Validar, cerrar |
| **Faltan $X / Sobran $X** | La diferencia entre lo esperado y lo entregado | Descuadre, diferencia |
| **En la calle** | Saldo total pendiente de toda la cartera | Dinero en la calle, cartera activa |
| **En mora** | Saldo de los clientes atrasados | Vencido, cartera vencida |
| **Clavo** | Marca manual de cliente que no responde | Mal pagador, moroso |
| **Mensualidad** | La vigencia comercial de una ruta | Suscripción, plan de ruta |
| **Equipo** | Los cobradores de un administrador | Empresa, organización |
| **Invitación** | El código que vincula un cobrador a un equipo | Enlace, token |

### Palabras que ya no se usan

- **"Visitado"** a secas — no dice si pagó. Siempre `Visita` + resultado.
- **"Hoy"** como nombre de la caja — la caja siempre lleva fecha visible.
- **"Descuadre"** — es palabra de contador. El cobrador entiende "Faltan $4.000".
- **"Boleta"** — el descubrimiento no pudo determinar qué significa. Se mantiene el campo con un icono
  de ayuda hasta que el cliente lo defina. Ver Q-05.
- **"Meta del día"** cuando en realidad es la entrega esperada — son dos números distintos.

---

## 3. Estados y cómo se nombran

### Estado del cliente / préstamo

| Estado | Cuándo | Color |
|---|---|---|
| **Al día** | Pagó lo esperado hasta hoy | Verde |
| **Adelantado** | Pagó de más | Verde (badge distinto, no otro color) |
| **Atrasado · N cuotas** | Debe N cuotas | Naranja |
| **Clavo** | Marcado manualmente como riesgo | Rojo |
| **Liquidado** | Saldo en cero | Gris |

Siempre se dice **cuántas** cuotas, no solo "atrasado". "3 cuotas atrás" le sirve al cobrador;
"atrasado" no.

### Estado de la caja

```
Abierta  →  Enviada  →  Aprobada
                    ↘  Devuelta para corregir  →  Enviada
```

Cuatro estados, ni uno más. Una caja aprobada **no se reabre**: si hay un error, se crea un ajuste
con su propio motivo y autor. El sistema anterior permitía reabrir libremente y por eso los cierres
no valían como documento.

### Estado de la ruta

| Estado | Qué implica |
|---|---|
| **Activa** | Todo habilitado |
| **Vencida** | Se puede cobrar y cerrar; **no** se puede prestar ni retaquear |
| **Sin cobrador** | Visible solo para el administrador |

---

## 4. Tono

Español de Colombia, **tuteo**, frases cortas. La app le habla a un adulto que trabaja, no a un
usuario de software.

- **Directo:** "Debes entregar $254.000", no "Total consolidado de entrega esperada".
- **Sin jerga:** "Prestarle más sobre el préstamo que ya tiene", no "capitalización adicional".
- **Sin adorno:** cero signos de admiración, cero "¡Excelente!", cero felicitaciones.
- **Sin promesas falsas:** no se anuncia lo que la app no hace todavía.

### Botones

El botón dice **qué va a pasar**, con el monto cuando hay dinero de por medio:

| Sí | No |
|---|---|
| Registrar pago de $ 25.000 | Aceptar · Guardar · Confirmar |
| Entregar $ 400.000 | Crear préstamo |
| Enviar cierre a Carlos | Enviar |
| Cerrar caja y entregar | Cerrar |
| Aprobar cierre | OK |
| Devolver para corregir | Rechazar |

El nombre de la acción **no cambia** entre el botón y la confirmación: si el botón dice "Registrar
pago", el mensaje dice "Pago registrado". Nunca "Operación exitosa".

### Etiquetas de campo

Se nombra lo que la persona controla, en su lenguaje:

| Sí | No |
|---|---|
| ¿Cuánto le vas a prestar? | Capital |
| ¿Cada cuánto cobra? | Frecuencia de cobro |
| ¿Cuánto vas a entregar? | Efectivo contado |
| ¿Qué pasó en la visita? | Resultado |
| Cuánto le prestas de más | Monto del retaque |

---

## 5. Errores, vacíos y esperas

### Errores

Dicen qué pasó y cómo se arregla, en el campo mismo, nunca en un mensaje que se va solo:

> ✅ "La cédula debe tener al menos 6 números."
> ❌ "Error de validación" · "Datos inválidos" · "Ha ocurrido un error"

El error no pide perdón y no es vago. Si es del sistema y no del usuario, dice qué hacer:

> "No se pudo enviar el cierre. Queda guardado en el teléfono y se envía solo cuando haya señal."

### Estados vacíos

Un vacío es una invitación, no una disculpa. Y nunca promete algo que no va a pasar:

| Pantalla | Texto |
|---|---|
| Ruta sin clientes | "Esta ruta todavía no tiene clientes. Agrega el primero." + botón |
| Búsqueda sin resultados | "Ningún cliente coincide con «pardo»." |
| Gastos vacíos | "No has registrado gastos hoy." + botón |
| Historial de cierres vacío | "Todavía no has cerrado ninguna caja." |
| Equipo vacío | "Invita a tu primer cobrador para asignarle una ruta." |

El sistema anterior prometía "verás la actividad en tiempo real" en un módulo que no tenía tiempo
real. **Un vacío nunca anuncia una capacidad que no existe.**

### Esperas

Se muestra estado de carga en: iniciar sesión, buscar equipo por código, generar reporte, sincronizar.
Si algo se guarda solo en el teléfono, se dice: "Queda guardado aunque no tengas señal."

---

## 6. Formatos

| Dato | Formato | Ejemplo |
|---|---|---|
| Dinero | `$ ` + miles con punto, sin decimales | `$ 486.000` |
| Dinero grande (resumen) | `$ ` + un decimal con coma + `M` | `$ 18,4M` |
| Fecha larga | día de semana + día + mes en minúscula | `Martes 31 de agosto` |
| Fecha corta | día + mes abreviado | `31 ago` |
| Hora | 12 horas con `a. m.` / `p. m.` | `9:42 a. m.` |
| Porcentaje | entero + `%` | `25%` |
| Cuotas | `N de M` | `12 de 20` |
| Teléfono | tres grupos | `310 555 4412` |
| Atraso | número + palabra | `3 cuotas atrás` |

Todo número lleva la clase `.num` (cifras tabulares). Ver [02 · Sistema visual](02-sistema-visual.md).

---

Ver también: [04 · Arquitectura de la información](04-arquitectura-informacion.md) · [06 · Reglas de interacción](06-reglas-de-interaccion.md) · [07 · Decisiones abiertas](07-decisiones-abiertas.md)
