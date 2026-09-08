# 16. Errores y casos límite

## Criterio

- Crítica: compromete autorización, cartera/caja, pérdida/fuga de datos o bloquea un flujo principal.
- Alta: comportamiento incorrecto importante con workaround parcial.
- Media: inconsistencia o degradación con impacto acotado.

## 16 defectos funcionales críticos

| ID | Área | Error AS-IS | Evidencia | Consecuencia | Acción |
|---|---|---|---|---|---|
| ERR-CRIT-001 | Registro | Cobrador nunca alcanza Seguridad | registro_flujo_screen.dart:38,102-192 | Alta imposible | Corregir |
| ERR-CRIT-002 | Invitación | Cualquier texto puede ser administradorId | auth_state.dart:127-139 | Relación falsa/bypass | Corregir |
| ERR-CRIT-003 | Auth | Falla de perfil concede admin | auth_state.dart:87-103 | Escalación | Corregir |
| ERR-CRIT-004 | Firestore | Usuario escribe sus roles/plan | firestore.rules:5-8 | Autoescalación | Corregir |
| ERR-CRIT-005 | Equipo | Admin/cobrador no comparten datos | local_store.dart:12-30 | Producto multiusuario no funciona | Rediseñar |
| ERR-CRIT-006 | Rutas | Cobrador ve todas las rutas | route_state.dart:329-332 | Acceso indebido | Corregir |
| ERR-CRIT-007 | Gates | Clientes/Carretera evaden solo lectura | modo_carretera_screen.dart:461-469 | Opera ruta vencida/cerrada | Corregir |
| ERR-CRIT-008 | Caja | No existe fecha/rollover | caja_state.dart:23-90 | Mezcla días | Rediseñar |
| ERR-CRIT-009 | Cierre | Aprobar/enviar no crea histórico | caja_state.dart:159-178 | Historial/reportes vacíos | Corregir |
| ERR-CRIT-010 | Cliente | Alta sin ruta aparenta éxito | nuevo_cliente_screen.dart:221-228 | Caja sin cliente | Corregir |
| ERR-CRIT-011 | Préstamo | Monto con cuotas 0 mueve caja | nuevo_cliente_screen.dart:193-226 | Desembolso fantasma | Corregir |
| ERR-CRIT-012 | Pago | Sobrepago completo entra a caja | registrar_pago_screen.dart:125-157 | Saldo/caja divergentes | Decidir/corregir |
| ERR-CRIT-013 | Pago | p nulo aún cambia caja/visita | registrar_pago_screen.dart:39-164 | Cobro sin deuda | Corregir |
| ERR-CRIT-014 | Integridad | Cartera y caja no son atómicas | registrar_pago_screen.dart:135-162 | Estado parcial | Rediseñar |
| ERR-CRIT-015 | Backup | Archivos cruzan cuentas/demo | backup_service.dart:19-70 | Fuga/corrupción | Corregir |
| ERR-CRIT-016 | Reset | Borra disco, no memoria | local_store.dart:262-269 | Datos resucitan | Corregir |

## Otros errores altos

| ID | Área | Hallazgo | Evidencia | Impacto |
|---|---|---|---|---|
| ERR-HIGH-001 | Auth | Logout ignora fallo y deja contexto | auth_state.dart:380-390 | Sesión/flags cruzados |
| ERR-HIGH-002 | Auth | Google otorga admin/plan | auth_state.dart:185-200 | Bypass onboarding |
| ERR-HIGH-003 | Auth | Alta Auth/perfil no recuperable | auth_state.dart:121-147 | Cuenta huérfana |
| ERR-HIGH-004 | Verificación | Reenvío miente sobre éxito | auth_state.dart:214-220 | Confianza |
| ERR-HIGH-005 | Ruta | Estado/vigencia contradictorios | ruta.dart:31-40 | Bloqueo incorrecto |
| ERR-HIGH-006 | Ruta | Cupón bloqueado por reglas | route_state.dart:289-309 | Promoción siempre falla |
| ERR-HIGH-007 | Cliente | Coordenadas demo se guardan como reales | nuevo_cliente_screen.dart:179-188 | Navegación/privacidad |
| ERR-HIGH-008 | Cliente | Dirección cambia sin coords | editar_cliente_screen.dart:118-133 | Mapa incorrecto |
| ERR-HIGH-009 | Cartera | Clavo/liquidado pueden verse Al día | cartulina_screen.dart:247-295 | Decisión de cobro |
| ERR-HIGH-010 | Cartera | Descuento excede deuda | prestamo.dart:95-98 | Condona de más |
| ERR-HIGH-011 | Cartera | Ajustes sin eventos/reverso | prestamo.dart:83-98 | No auditable |
| ERR-HIGH-012 | Cierre | Aprobado permanece mutable | cierre_dia_screen.dart:184-253 | Visto bueno inválido |
| ERR-HIGH-013 | Permisos | Config mostrar* no se aplica | caja_state.dart:76-82 | Exposición/falsa confianza |
| ERR-HIGH-014 | Equipo | Remover no revoca | auth_state.dart:335-349 | Acceso persiste |
| ERR-HIGH-015 | Reporte | Rango solo filtra cierres | reporte_screen.dart:40-159 | Reporte falso |
| ERR-HIGH-016 | Reporte | Meta usa entrega | admin_resumen_screen.dart:41-45 | KPI engañoso |
| ERR-HIGH-017 | Persistencia | Caja corrupta sin backup | caja_state.dart:247-280 | Pérdida |
| ERR-HIGH-018 | Persistencia | Futuros no esperados | route_state.dart:65-66 | Última escritura perdida |
| ERR-HIGH-019 | Media | Foto ruta temporal | crear_ruta_screen.dart:44-55 | Imagen desaparece |
| ERR-HIGH-020 | Bootstrap | Continúa sin servicio inicializado | main.dart:25-40 | Crash posterior |

## Casos límite por dominio

### Auth y sesión

- currentUser existe, pero reload falla: Landing pese a sesión.
- perfil no existe/mal formado: admin fallback.
- signOut falla: UI sale, Firebase puede restaurar.
- siguiente admin hereda simularCobrador.
- usuario con roles vacío: autenticado pero vuelve a Landing.
- usuario con ambos roles: admin prevalece.
- email no verificado por 23 h: bloqueado igual que vencido.
- reenviar tras vencimiento: creado no cambia.
- Google cancelado: se muestra como error.

### Fechas

- retroceso ≤12 h se tolera; >12 h bloquea.
- timestamp corrupto hace fail-open.
- reloj adelantado y luego normal puede bloquear.
- sumar meses desde día 29–31 normaliza a otro mes.
- rango Excel termina a medianoche y excluye el día final.
- mensual se modela como 30 días, no calendario.
- fecha futura de préstamo produce cuotas esperadas 0.

### Rutas

- cero rutas: selección null.
- selectedId eliminado: getter null.
- ruta activa sin fecha: impaga.
- ruta vencida con fecha futura: pagada pero solo lectura.
- cobradorId huérfano/sentinel.
- borrar última ruta vacía selección.
- eliminar ruta con saldos borra todo.

### Clientes

- sin ruta: alta no persiste pero caja sí.
- nombre/cédula/teléfono/dirección válidos solo por no vacío.
- editar permite cédula/teléfono vacíos.
- sin coordenadas: se inventan.
- GPS denegado y excepción tienen tratamientos distintos.
- foto copiada antes de confirmar puede quedar huérfana.
- cliente sin préstamo no es liquidado ni alDia, pero chip fallback dice Al día.
- esClavo suprime atrasado y alDia; banner usa no atrasado.

### Préstamos

- numCuotas=0: valorCuota 0.
- total=0: avance 0, no 1.
- cuotaManual×cuotas ≠ total.
- descuento mayor que total clampa a 0.
- sobrepago deja pagado>total.
- prestamoActivo devuelve último liquidado.
- varios activos: primer préstamo recibe atajos.
- retaque de liquidado lo reactiva.
- importación agrega un solo pago en fecha inicial.
- interés custom 0 no se acepta; >100 sí.

### Caja/cierre

- entregaEsperada negativa.
- efectivo 0 válido.
- boletas y efectivo modificables después de enviar.
- gasto viejo sigue sumando.
- frecuencia entrega no cambia acumulación.
- cierre aprobado reabierto por cobrador.
- no existe cierre por cobrador/ruta.

### Persistencia

- falta rutas o clientes: ambos se vacían en memoria.
- enum renombrado/desconocido puede invalidar blob.
- dos IDs creados en el mismo milisegundo.
- backup de A sobrescrito por demo/B.
- restore corrupto se presenta como “sin backup”.
- import raw escribe antes de validar.
- reset seguido de mutación resucita datos.
- primer UID hereda datos legacy sin confirmar dueño.

### Red/plataforma

- Firebase no inicializa: app continúa.
- OSRM falla: fallback silencioso.
- URL OSRM excesiva con muchos clientes.
- tile offline: no indicador.
- WhatsApp/Maps/teléfono no instalados.
- GPS stream emite error o widget se desmonta.
- dart:io falla en web.
- share sheet/paths no disponibles.

## Omisiones silenciosas

- montos no positivos en varios mutadores;
- nombre vacío al renombrar;
- errores de AuthState/cobradores;
- errores OSRM/GPS parciales;
- CloudSync;
- archivo inválido al restaurar;
- acción de PDF;
- acción de código dentro de CobradorHome;
- campos Mensualidades.

## Política TO-BE de errores

- Result tipado por caso de uso;
- mensajes de dominio separados de excepciones técnicas;
- persistencia esperada/atómica;
- retry solo para operaciones idempotentes;
- estado offline explícito;
- fallback nunca inventa privilegios o datos;
- cuarentena de datos corruptos;
- logs sanitizados y correlación;
- confirmación/undo/reverso en operaciones sensibles;
- criterios de aceptación para cada edge case.

