# 13. Integraciones y servicios externos

## Resumen cuantitativo

Se identificaron 15 contratos de integración:

- 9 activos u operativos;
- 2 presentes pero bloqueados/deshabilitados;
- 2 simulados;
- 2 dependientes de configuración externa no verificable.

No existen API propia, Cloud Functions, Firebase Storage, push notifications, analítica, WebSockets, procesos programados ni backend de dominio.

## Matriz

| # | Integración | Propósito | Estado AS-IS | Acoplamiento | Si se elimina |
|---:|---|---|---|---|---|
| 1 | Firebase Core/Auth | Identidad, correo, verificación, reset | Activa | Alto | No hay login real |
| 2 | Google Sign-In | Login social | Código activo; config externa F | Alto | Se conserva correo/password |
| 3 | Firestore usuarios | Perfil por UID | Activa | Alto | Auth queda sin roles/perfil |
| 4 | Firestore cupones | Promociones | Bloqueada por reglas | Medio | Sin cambio observable actual |
| 5 | Firestore datos_usuario | Sync operativo | Deshabilitada y bloqueada | Alto en código, nulo en runtime | Sin cambio observable |
| 6 | SharedPreferences | Datos operativos locales | Activa | Crítico | Se pierde persistencia |
| 7 | Filesystem/Backup | Fotos y respaldo diario | Activa parcial | Alto | Sin restauración/fotos durables |
| 8 | Excel/Share sheet | Exportar XLSX/JSON | Activa | Medio | Se pierde portabilidad manual |
| 9 | OpenStreetMap | Tiles de mapa | Activa online | Alto en widgets | Mapa sin fondo |
| 10 | OSRM público | Calcular geometría de ruta | Activa con fallback | Alto en widgets | Líneas demo/rectas |
| 11 | Geolocator | GPS de cliente/cobrador | Activa | Alto en widgets | Operación manual sin GPS |
| 12 | ImagePicker | Cámara/galería | Activa | Medio | Avatares por iniciales |
| 13 | URL Launcher | WhatsApp, teléfono, Google Maps | Activa | Medio | Núcleo funciona sin atajos |
| 14 | QR/deep link | Compartir invitación | QR activo; deep link no implementado | Medio | Se conserva código manual |
| 15 | Wompi | Cobro de suscripción | Solo simulador | Alto conceptualmente | Sin billing real, como hoy |

## 1. Firebase Core y Auth

**Propósito:** identidad estable, sesión, alta, verificación y recuperación.

**Archivos:** main.dart:25-32; auth_state.dart:38-39,72-247.

**Datos enviados:** correo/password a Firebase, tokens Google, display name.

**Datos recibidos:** UID, emailVerified, sesión, errores.

**AS-IS:** activo para cuentas reales. El modo demo lo evita.

**Riesgos:** Firebase se inicializa dentro de try y la app continúa si falla; no hay adaptador; recuperación offline deja usuario nulo; error de perfil eleva a admin.

**Contrato a preservar:** UID estable, proveedores, verificación, reset y restauración de sesión.

**TO-BE:** AuthPort; estado explícito de disponibilidad; perfil cacheado; autorización separada.

## 2. Google Sign-In

**Archivos:** auth_state.dart:166-212; google-services.json.

**AS-IS:** canjea access/id token y crea Firebase credential. Usuario nuevo se vuelve admin.

**No verificable:** google-services.json no contiene oauth_client; consola/SHA/proveedores no se inspeccionaron.

**Riesgo de portabilidad:** dependencia directa y diferencias por plataforma/versión.

**Contrato:** autenticar identidad social; no debe definir rol ni suscripción.

## 3. Firestore: usuarios

**Ruta:** usuarios/{uid}.

**Datos:** los 12 campos de Usuario.toJson.

**Reglas:** dueño R/W del documento completo.

**Dependencia funcional:** roles, plan y vínculo del shell.

**Riesgos:** campos privilegiados editables; sin schema; admin no puede leer miembros.

**TO-BE:** perfil editable separado de membresía/claims; validación de campos; tests de reglas.

## 4. Firestore: cupones

**Ruta:** cupones/{CODIGO}.

**Contrato esperado:** activo bool y meses num.

**AS-IS:** firestore.rules bloquea toda colección distinta de usuarios. Cualquier error retorna 0 y se presenta como inválido/expirado.

**Qué ocurre si se elimina:** nada observable hoy.

**TO-BE:** endpoint de canje autoritativo, idempotente, con emisor, vigencia, límites y consumo.

## 5. CloudSync

**Ruta prevista:** datos_usuario/{uid}.

**Payload:** rutas_json, clientes_json, caja_json, ultima_actualizacion.

**AS-IS:** habilitado=false y reglas lo bloquean. No incluye cierres, cobradores ni archivos.

**Diseño latente:** blob completo, timestamp del cliente, último escritor gana.

**Riesgo:** si alguien cambia solo el flag o abre reglas, puede perder datos entre dispositivos.

**Contrato TO-BE:** entidades versionadas, outbox, idempotencia, tombstones, conflicto explícito y tenant.

## 6. SharedPreferences

**Propósito:** persistencia operativa.

**Datos:** blobs JSON por UID/demo; tema y banderas globales.

**Acoplamiento:** crítico. DatosDemo es la memoria productiva y LocalStore la serializa.

**Riesgos:** sin transacciones, cifrado o schema; reescritura total; tamaño limitado; imports por nombre de enum.

**Alternativa local:** SQLite/Drift, Isar u otra base transaccional evaluada por requisitos; cifrado si aplica.

## 7. Filesystem y BackupService

**Propósito:** copiar fotos de cliente; generar un JSON diario; restaurar.

**AS-IS:** máximo siete archivos respaldo_crediruta_AAAA-MM-DD.json en una carpeta global.

**Problemas:** cruza cuentas; omite fotos/cobradores; paths absolutos; foto de ruta puede quedar temporal; JSON plano.

**Contrato:** snapshot identificado por tenant, versión, checksum, fecha y manifest; restore validado antes de aplicar.

## 8. Excel y Share

**Datos enviados:** archivos XLSX o JSON al selector del sistema.

**AS-IS:** operativo localmente. El rango de Excel solo filtra cierres históricos.

**Riesgos:** PII/finanzas sin cifrado, temp files sin política de limpieza, destino elegido por usuario.

**Contrato:** exportación autorizada, período coherente, formato versionado y minimización.

## 9. OpenStreetMap

**Endpoint:** tile.openstreetmap.org/{z}/{x}/{y}.png.

**Datos:** área consultada y user-agent com.prestaya.app.

**AS-IS:** directo desde Panel y Modo Carretera.

**Riesgos:** dependencia online, términos/cuotas/SLA no verificados, privacidad aproximada.

**TO-BE:** MapTileProvider configurable y política de caché/offline.

## 10. OSRM público

**Endpoint:** router.project-osrm.org/route/v1/driving/{lng,lat;...}.

**Datos enviados:** coordenadas exactas de todos los clientes en la ruta.

**Datos recibidos:** GeoJSON de la polilínea.

**Fallback:** dos rutas demo precomputadas o líneas rectas.

**Riesgos:** privacidad, URL/logs de tercero, timeout/SLA y lógica HTTP dentro de widgets.

**TO-BE:** RoutingPort; proveedor contractual/proxy/cálculo local; consentimiento y minimización.

## 11. Geolocator

**Uso:** captura puntual al crear cliente y stream cada 3 m en Modo Carretera.

**Permisos:** foreground fine/coarse; no background.

**Problema:** un error de GPS persiste coordenadas fijas de Medellín como éxito.

**Contrato:** estado de permiso, ubicación ausente/aproximada/confirmada, precisión y timestamp.

## 12. ImagePicker

**Uso:** cliente y ruta desde cámara/galería.

**Datos:** path local.

**Problemas:** cliente copia archivo a documentos, pero no elimina anteriores; ruta conserva path potencialmente temporal; backup no incluye binario.

**TO-BE:** MediaRepository con ID, propietario, MIME, tamaño, checksum y URL remota opcional.

## 13. URL Launcher

### WhatsApp

- normaliza 10 dígitos con prefijo Colombia 57;
- incluye nombre, saldo y cuota en mensaje;
- envía número/mensaje mediante URL.

### Teléfono

- abre tel: con número normalizado.

### Google Maps

- abre coordenadas de cliente/cobrador.

**Contrato:** acciones iniciadas por usuario, errores visibles y país configurable.

## 14. QR y deep link

**QR:** generado localmente con qr_flutter.

**Contenido:** https://prestaya.app/unirse?code=CODIGO.

**AS-IS:** Android no declara App Link; AppRoutes no implementa /unirse; el dominio no está en el repo. “Escanear” no usa cámara: copia una invitación local.

**TO-BE:** token opaco, enlace verificado, receptor app/web, un solo uso y expiración server-side.

## 15. Wompi

No existen SDK, API, webhook, llave ni backend Wompi.

WompiSimuladorScreen:

- permite Nequi/PSE/tarjeta;
- no valida campos;
- espera dos segundos;
- el usuario pulsa éxito o rechazo;
- activa ruta o rol en memoria/local.

Clasificación B para la intención y D si se interpreta como pago real.

**Contrato futuro:** orden, moneda, total, concepto, tenant/ruta, estado, idempotency key, referencia de proveedor, webhook firmado, reconciliación y reembolso.

## Variables, secretos y configuración

- FirebaseOptions y google-services.json están versionados; son configuración pública, no service-account secrets.
- No se encontraron private keys, keystores, credenciales Wompi o .env.
- Un solo proyecto Firebase está hardcodeado.
- Estado de API restrictions, App Check, SHA y proveedores Auth: F.

## Portabilidad

| Riesgo | Impacto |
|---|---|
| SDKs dentro de providers/widgets | Difícil sustituir Firebase/API/proveedor |
| dart:io directo | Web no portable |
| paths absolutos | Fotos no migrables |
| endpoint público hardcodeado | Sin ambiente/SLA |
| Firebase único | Mezcla local/staging/prod |
| payload blob | Sin concurrencia ni migración granular |
| URL deep link fija | Dominio externo no verificado |

## Requisitos para adaptadores futuros

Cada integración debe tener:

- interfaz de dominio/aplicación;
- implementación fake local;
- implementación Firebase;
- implementación API propia cuando aplique;
- timeouts, retry e idempotencia definidos;
- errores tipados;
- observabilidad sin PII;
- configuración por ambiente;
- pruebas de contrato.

