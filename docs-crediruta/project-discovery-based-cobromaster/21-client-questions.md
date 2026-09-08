# 21. Preguntas para el cliente

Solo se incluyen decisiones que el repositorio no puede resolver. Total: 35.

## Bloqueantes

| ID | Pregunta | Contexto y evidencia | Ambigüedad | Consecuencia | Alternativas observadas |
|---|---|---|---|---|---|
| Q-B01 ✔ | ~~¿La marca definitiva es CobroMaster, CrediRuta o Presta Ya?~~ **Resuelta: CrediRuta** | Repo/docs, MaterialApp/Android y Firebase/dominio usan nombres distintos | Identidad de producto | Paquetes, UI, dominio y migración divergen | Cerrada por [ADR-001](../architecture/adr.md): marca única CrediRuta, `com.crediruta.app`. CobroMaster y Presta Ya quedan como legacy de migración |
| Q-B02 | ¿Android es el único objetivo o web/iOS deben ser productivos? | Solo Android/web scaffold; dart:io y FirebaseOptions bloquean otras | Alcance plataforma | Arquitectura/adaptadores distintos | Android primero; multiplataforma |
| Q-B03 | ¿El proyecto Firebase actual es desarrollo, staging o producción y las reglas versionadas están desplegadas? | Un único projectId; consola no accesible | Estado externo | Riesgo de datos reales y ambientes | Crear tres proyectos; conservar temporalmente |
| Q-B04 | ¿La organización controla prestaya.app y debe existir /unirse? | QR apunta al dominio; no hay handler/App Link | Propiedad/contrato | Invitaciones no pueden diseñarse | App Link; web fallback; quitar dominio |
| Q-B05 | ¿Quién es propietario de los datos: empresa, administrador, ruta o cobrador? | Local usa UID; UI usa equipo | Tenant | Base de autorización/modelo | Empresa recomendada; admin; ruta |
| Q-B06 | ¿Quién puede crear administradores y qué significa invitar otro admin? | Invitacion permite Rol.admin; Google auto-crea admin | Privilegios | Seguridad/membresía | Propietario único; coadmins; permisos granulares |
| Q-B07 | ¿Qué puede leer/modificar un cobrador? | Hoy ve todo namespace y mutadores carecen de guard | Permisos | Reglas/UI/API | Solo rutas asignadas; permisos por acción |
| Q-B08 | ¿Plan Ya se cobra por usuario, empresa, ruta o combinación? | Plan ilimitado 20k y ruta 20k/mes | Billing | Modelo comercial/entitlement | Empresa; por ruta; tiers híbridos |
| Q-B09 | ¿El pago será Wompi externo, compra de tienda móvil o ambos? | Solo simulador; docs advierten Play policy | Canal/legal | Arquitectura backend/publicación | Checkout web Wompi; IAP; híbrido |
| Q-B10 | ¿Qué define una jornada/caja: fecha, cobrador, ruta y qué zona/corte? | Caja carece de fecha/scope | Contabilidad | Ledger, reportes y sync | Empresa+cobrador+fecha recomendado |
| Q-B11 | ¿Qué significa frecuencia de entrega diaria/semanal/etc.? | Campo existe sin efecto | Acumulación | Caja/cierre | Cierres diarios + liquidación; caja acumulada |
| Q-B12 | ¿Quién puede reabrir un cierre aprobado, hasta cuándo y con qué autorización? | Hoy ambos roles reabren y cifras cambian | Control contable | Auditoría/estados | Solo admin; ventana; ajuste posterior |
| Q-B13 | ¿Qué es una “boleta” y cómo se relacionan número, valor, cobro y reparto? | numeroBoleta, valorBoleta, boletasCobradas no conectan | Concepto central | Modelo/fórmulas/reportes | Movimiento; comisión; comprobante |
| Q-B14 | ¿Cuál es el calendario real de cuotas? | Frecuencia se reduce a 1/7/15/30 días | Primera cuota, festivos, gracia, mora | Estados/saldo | Días corridos; días hábiles; calendario por préstamo |
| Q-B15 | ¿Se permiten varios préstamos activos y sobrepagos; cómo se imputa un pago? | Modelo permite varios; atajo usa primero; clamp oculta excedente | Política de cartera | Pago/ledger/UI | Selección; prioridad; reparto; crédito; rechazo |

## Importantes

| ID | Pregunta | Contexto y evidencia | Ambigüedad | Consecuencia | Alternativas observadas |
|---|---|---|---|---|---|
| Q-I01 | ¿Qué significa “clavo/mal pagador” y qué efectos tiene? | Marca manual contradice estados | Riesgo vs mora | UI/scoring/permisos | Etiqueta independiente; bloqueo; alerta |
| Q-I02 | ¿Se puede eliminar Cliente/Ruta con deuda o solo archivar? | Delete físico existe/route cascade | Retención contable | Migración/auditoría | Prohibir; soft delete; transferencia |
| Q-I03 | ¿Quién autoriza recargos/descuentos y requieren motivo/evidencia? | Cualquier operador acumula montos | Gobierno financiero | Ledger/permisos | Cobrador con límite; admin; doble aprobación |
| Q-I04 | ¿Retaque cobra interés sobre solo monto nuevo o todo capital? | Código recalcula sobre total | Contrato | Fórmula/aceptación | Tasa original total; tramo nuevo; refinanciación |
| Q-I05 | En modo manual, ¿manda cuota×número o el total calculado? | cuotaManual solo cambia display/cálculo de cuotas pagadas | Contrato inconsistente | Saldos/calendario | Derivar cuotas; derivar total; última cuota ajustada |
| Q-I06 | ¿Cómo debe importarse cartera en curso? | Un pago agregado pierde historial | Nivel de detalle | Migración/reportes | Saldo inicial; historial completo; apertura auditada |
| Q-I07 | ¿Cédula es única por empresa y puede un cliente pertenecer a varias rutas? | Sin unicidad; Cliente no guarda rutaId | Identidad/relación | Duplicados/migración | Cliente único + asignaciones; duplicado por ruta |
| Q-I08 | ¿Qué resultados de visita existen y prevalece orden manual u optimizado? | Set visitado mezcla pago/no pago; dos órdenes | Operación campo | Modelo/UI/mapa | Resultado tipado; orden canónico/por jornada |
| Q-I09 | ¿Cuánto puede trabajar offline un usuario removido y cómo se resuelven conflictos? | Offline-first deseado; no sync real | Revocación/concurrencia | Seguridad/sync | TTL; solo lectura; merge; server wins/manual |
| Q-I10 | ¿Existe consentimiento para enviar GPS/domicilios a OSRM/OSM/Google y saldos a WhatsApp? | Código envía datos a terceros | Privacidad | Proveedor/copy/legal | Consentimiento; proxy; local; mensajes mínimos |
| Q-I11 | ¿Qué cifrado, retención y portabilidad requieren backup, fotos y PII? | JSON plano, 7 días, paths locales | Seguridad/legal | Storage/migración | SQLCipher; paquete cifrado; media remota |
| Q-I12 | ¿Google Sign-In es obligatorio, opcional o debe eliminarse? | Config externa incierta; onboarding diferente | Producto/Auth | Flujo y soporte | Opcional; obligatorio; solo email |
| Q-I13 | ¿Se necesita impersonación real o solo “ver como” de solo lectura? | Dos mecanismos locales sin auditoría | Soporte | Seguridad/UI | Preview fake; soporte auditado; eliminar |
| Q-I14 | ¿Qué significan exactamente KPIs y qué reportes/rangos necesita cada rol? | Meta/interés/rango son incoherentes | Fórmulas/alcance | Aceptación/reportes | Caja, cartera y cobranza separados |

## Deseables

| ID | Pregunta | Contexto y evidencia | Ambigüedad | Consecuencia | Alternativas observadas |
|---|---|---|---|---|---|
| Q-D01 | ¿La landing HTML raíz forma parte del producto nuevo? | Landing separada y desactualizada | Alcance | Trabajo/marca/hosting | Migrar; reescribir; excluir |
| Q-D02 | ¿El cliente final tendrá cuenta propia? | DEVELOPMENT lo menciona; enum no | Actor futuro | Modelo/Auth | Portal cliente; enlace de consulta; no |
| Q-D03 | ¿Se requieren notificaciones y recordatorios? | Docs los marcan pendientes | Canal/timing | Backend/permisos | Local; push; WhatsApp manual |
| Q-D04 | ¿Mapa y rutas deben funcionar offline? | UI/documentos sugieren campo; tiles/OSRM online | Nivel offline | Cache/proveedor/tamaño | Solo datos; tiles cache; MBTiles |
| Q-D05 | ¿Tema debe ser por dispositivo o sincronizado por usuario? | Actual global local | Preferencia | Modelo menor | Dispositivo; perfil |
| Q-D06 | ¿Defaults de tasa, frecuencia y productos son por empresa, ruta o tipo de préstamo? | Mensualidades mock; formularios hardcodean 20 % | Configuración | Form/modelo | Empresa; ruta; catálogo de productos |

## Regla de resolución

Cada respuesta debe producir:

- decisión;
- regla/criterio de aceptación;
- propietario;
- fecha de vigencia;
- impacto en datos/migración;
- si reemplaza una conducta AS-IS.

