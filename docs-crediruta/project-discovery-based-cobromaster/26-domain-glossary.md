# 26. Glosario del dominio

## Criterio

Las definiciones AS-IS describen el significado que el código utiliza, no una definición jurídica o contable. Cuando el repositorio usa un término de manera contradictoria, la ambigüedad queda visible y remite a [21-client-questions.md](21-client-questions.md).

| Término | Definición AS-IS | Sinónimos o variantes encontradas | Entidades relacionadas | Módulos | Ambigüedad |
|---|---|---|---|---|---|
| CobroMaster | Nombre predominante del proyecto **en el código auditado**. No es la marca del producto | CrediRuta, Presta Ya, PrestaYa | Todas | Shell, marca | Tres marcas coexistían; Q-B01 cerrada por ADR-001 a favor de **CrediRuta** |
| Administrador | Usuario con experiencia de gestión, rutas, equipo, caja y reportes | Admin, dueño | Usuario, Ruta, Caja | Auth, equipo, reportes | Fallback y Google pueden concederlo sin autorización; Q-B06 |
| Cobrador | Usuario que debería ejecutar cobranza de campo sobre rutas asignadas | Collector | Usuario, Ruta, Pago, Gasto | Equipo, operación, caja | El código no limita consistentemente sus datos/acciones; Q-B07 |
| Equipo | Conjunto visual de administradores y cobradores asociados | Mi equipo | Usuario, Invitacion | Equipo | No existe tenant remoto compartido operativo |
| Empresa | Propietario propuesto de datos y membresías | Organización, tenant | TO-BE: Empresa, Membresía | Todos | No existe en el modelo AS-IS; Q-B05 |
| Membresía | Relación TO-BE entre usuario, empresa, rol y estado | Asociación, acceso | TO-BE: Membresía | Auth, permisos | El AS-IS embebe rol y `administradorId` en Usuario |
| Ruta | Unidad operativa/comercial que agrupa clientes y configura vigencia | Cartera, zona | Ruta, Cliente | Rutas, clientes, mensualidad | Puede representar territorio, cartera o licencia; no hay geometría |
| Ruta asignada | Ruta que la UI muestra como asociada a un cobrador | Asignación | Usuario, Ruta | Equipo, rutas | Se guarda como lista de IDs, pero no filtra toda la operación |
| Mensualidad | Vigencia comercial de una ruta, con fecha de pago/vencimiento | Suscripción por ruta | Ruta | Rutas, suscripciones | Convive con Plan Ya; base de cobro no resuelta; Q-B08 |
| Plan Ya | Plan global anunciado como ilimitado | Plan, suscripción | Usuario, PlanInfo | Suscripciones | Simulado y sin entitlement remoto autoritativo |
| Cupón | Código destinado a activar/descontar plan o ruta | Código promocional | Ruta, perfil | Suscripciones | Firestore deniega su colección y el contrato no está definido |
| Cliente | Persona que recibe préstamos y sobre la que se cobra | Deudor, prestatario | Cliente, Prestamo | Clientes, cartulina | No guarda `rutaId`; identidad/unicidad ambiguas; Q-I07 |
| Cartulina | Vista histórica/operativa de un cliente y sus préstamos/pagos | Ficha, tarjeta | Cliente, Prestamo, Pago | Préstamos, pagos | Mezcla contrato, estado calculado y acciones administrativas |
| Préstamo | Obligación creada para un cliente con capital, interés, cuotas y pagos | Crédito, obligación | Prestamo, Cliente, Pago | Préstamos | Admite varios activos; imputación no definida; Q-B15 |
| Capital | Monto principal entregado al cliente | Monto prestado, valor | Prestamo, Caja | Préstamos, caja | Algunas métricas mezclan capital original y total financiado |
| Interés | Recargo porcentual usado para calcular el total proyectado | Utilidad, ganancia | Prestamo | Préstamos, reportes | Fórmula de retaque/manual no es consistente |
| Cuota | Pago periódico previsto del préstamo | Valor fijo, cuota diaria | Prestamo, Pago | Préstamos, pagos | Puede derivarse o ingresarse manualmente; Q-I05 |
| Frecuencia de cobro | Periodicidad de cuotas convertida a 1, 7, 15 o 30 días | Diario, semanal, quincenal, mensual | Prestamo | Préstamos, operación | No contempla primera cuota, festivos, gracia o mora; Q-B14 |
| Valor fijo | Modalidad/formulario donde se fija cuota o parámetros manuales | Modo manual | Prestamo | Nuevo préstamo | El total contractual y el display pueden divergir |
| Retaque | Incremento de un préstamo existente y recálculo de valores | Renovación, adicional | Prestamo, Caja | Cartulina, caja | No está definido sobre qué base se cobra interés; Q-I04 |
| Pago | Registro monetario aplicado a un préstamo | Abono, cobro | Pago, Prestamo, Caja | Pagos, cobranza | Sobrepago e imputación entre préstamos no están definidos |
| Abono | En UI, pago parcial o monto registrado | Pago parcial | Pago | Pagos | Se usa casi como sinónimo de pago, sin tipo de movimiento explícito |
| Boleta | Concepto numérico/monetario contado en caja | Número de boleta, valor de boleta | Caja | Caja, cierres | Su significado y reparto no pueden inferirse; Q-B13 |
| Visita | Hecho de haber atendido o marcado un cliente en la jornada | Visitado, gestión | Cliente/sets en Ruta | Operación de campo | No es entidad persistente tipada; pago/no pago se mezclan; Q-I08 |
| No pagó | Resultado visual de visita sin pago | Sin pago | Sets/estado de ruta | Operación | No conserva motivo, fecha ni actor como evento independiente |
| Jornada | Periodo operativo diario que la UI intenta resumir/cerrar | Día, turno | Caja, visitas | Operación, caja | Caja carece de fecha, ruta y cobrador como scope; Q-B10 |
| Caja | Agregado mutable de entradas/salidas, gastos y banderas de cierre | Caja del día | Caja, Gasto | Caja, cierres | Mezcla snapshot, contadores y proceso; no es ledger |
| Gasto | Salida de dinero registrada por concepto y monto | Egreso | Gasto, Caja | Gastos, caja | No hay aprobación, comprobante ni scope consistente |
| Entrega esperada | Cifra que la UI calcula para conciliación del cobrador | Total a entregar | Caja, Pago, Gasto | Cierre | Fórmula depende de acumulados no fechados; Q-B10/Q-I14 |
| Cierre | Acción que marca la caja/jornada como cerrada | Cierre del día, entrega | Caja, CierreHistorico | Caja, cierres | No siempre crea un histórico inmutable; puede reabrirse libremente |
| Aprobación de cierre | Confirmación del administrador sobre una entrega | Aprobar cierre | Caja, CierreHistorico | Cierres | Permisos y transición no son autoritativos |
| Descuadre | Diferencia entre efectivo/entrega y valor esperado | Diferencia de caja | Caja | Cierres | No existe política de tolerancia, responsable o ajuste |
| Dinero en calle | Indicador de cartera/capital pendiente fuera de caja | Cartera activa | Prestamo, Caja | Resumen, reportes | Fórmula y alcance temporal no son consistentes; Q-I14 |
| Recaudado | Total de pagos/entradas mostrado en resúmenes | Cobrado, ingresos | Pago, Caja | Resumen, reportes | Algunas pantallas leen acumulados diferentes |
| Estado del préstamo | Etiqueta calculada según saldo/fechas | Al día, atrasado, adelantado, liquidado | Prestamo | Cartulina, reportes | El calendario simplificado puede clasificar incorrectamente |
| Al día | Préstamo cuyo pago acumulado cumple el esperado | Vigente | Prestamo | Cartulina | Depende de cálculo de cuotas/días |
| Atrasado | Préstamo cuyo pago acumulado está por debajo del esperado | En mora | Prestamo | Cartulina | No hay política contractual de mora/gracia |
| Adelantado | Préstamo con pagos superiores a lo esperado para la fecha | Anticipado | Prestamo | Cartulina | Puede coexistir con saldo; sobrepago no definido |
| Liquidado | Préstamo cuyo saldo calculado llegó a cero | Pagado, terminado | Prestamo | Cartulina | El clamp puede ocultar un pago excedente |
| Clavo | Marca manual de riesgo/mal comportamiento | Mal pagador | Cliente | Clientes, cartulina | No está conectada de forma coherente al estado financiero; Q-I01 |
| Frecuencia de entrega | Preferencia de cada cobrador para entregar recaudo | Liquidación diaria/semanal | Usuario, Caja | Equipo, cierres | Se almacena pero no gobierna cierres; Q-B11 |
| Invitación | Registro/código para vincular un usuario con un administrador/equipo | Código de invitación, QR | Invitacion, Usuario | Equipo, auth | El código arbitrario se acepta y no hay consumo remoto seguro |
| Namespace | Clave local que separa snapshots por UID o modo demo | Ámbito local, espacio de datos | Todas | Persistencia | No equivale a empresa y rompe colaboración multiusuario |
| Demo | Sesión y dataset local sin identidad productiva | Modo demostración | Usuario/namespace demo | Auth, persistencia | Backup/restore puede cruzar el límite demo/cuenta |
| Sincronización | Servicio previsto para transportar snapshots a Firestore | Nube, CloudSync | Todas | Persistencia | Está deshabilitado y las reglas niegan la colección objetivo |
| Respaldo | Exportación/importación JSON local | Backup, copia | Todas | Ajustes, persistencia | Sin versión, cifrado ni control de tenant suficiente |
| Perfil | Documento remoto con nombre, rol, plan y asociación | Usuario remoto | Usuario | Auth | El propietario puede modificar campos de privilegio en reglas AS-IS |

## Términos que deben normalizarse antes de modelar

1. Elegir una única marca y reservar nombres legacy solo para migración.
2. Separar **identidad**, **perfil**, **membresía**, **rol** y **permiso**.
3. Diferenciar **pago**, **ajuste**, **reverso**, **gasto**, **desembolso** y **movimiento de caja**.
4. Diferenciar **visita**, **resultado de visita** y **pago**.
5. Definir **jornada**, **caja**, **liquidación**, **cierre** y **aprobación** como conceptos distintos.
6. Acordar el significado contractual de **boleta**, **valor fijo** y **retaque**.
7. Distinguir suscripción de empresa, plan de producto y vigencia/licencia de ruta.

## Evidencia transversal

Los términos provienen de `cobros_app/lib/models/`, `cobros_app/lib/state/`, títulos y etiquetas en `cobros_app/lib/features/`, y de los documentos raíz `INTEGRACION-NUBE.md`, `DEVELOPMENT.md` y `README.md`. Las contradicciones específicas están trazadas en [06-business-rules.md](06-business-rules.md), [11-data-model.md](11-data-model.md) y [16-errors-and-edge-cases.md](16-errors-and-edge-cases.md).
