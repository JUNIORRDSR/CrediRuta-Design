# 18. Hallazgos de seguridad

## Alcance y límites

Revisión estática y funcional defensiva. No se explotaron vulnerabilidades, no se accedió a datos reales ni se modificó configuración.

No verificable: reglas desplegadas, proveedores Auth, App Check/API restrictions, SHA/OAuth, dispositivos, artefactos publicados y servicios externos.

## Resumen

| Severidad | Cantidad |
|---|---:|
| Crítica | 11 |
| Alta | 20 |
| Media | 10 |
| Informativa/baja | 5 |
| **Total** | **46** |

Clasificación: A=5, B=1, C=8, D=31, E=0, F=1.

## Identidad y sesión

| ID | Sev. | Comportamiento actual / riesgo | Evidencia | Tratamiento | Clase |
|---|---|---|---|---|---|
| SEC-AUTH-001 | Crítica | Falla/ausencia de perfil crea administrador | auth_state.dart:87-103 | Corregir fail-closed/cache firmado | D |
| SEC-AUTH-002 | Crítica | Dueño escribe roles, plan, suscripción y vínculo | firestore.rules:5-8 | Separar privilegios y allowlist | D |
| SEC-AUTH-003 | Alta | Verificación solo en UI; reglas no exigen email_verified | app.dart:30-34; rules:7 | Validar backend/reglas | D |
| SEC-AUTH-004 | Crítica | Cualquier texto se guarda como administradorId | registro_flujo_screen.dart:124-138 | Canje remoto atómico | D |
| SEC-AUTH-005 | Alta | Google nuevo obtiene admin/suscripción | auth_state.dart:185-200 | Onboarding sin privilegios | D |
| SEC-AUTH-006 | Alta | Logout visual aunque signOut falle; estado queda | auth_state.dart:380-390 | Transición de sesión completa | D |
| SEC-AUTH-007 | Alta | Impersonación/simulación sin autorización/auditoría | auth_state.dart:53-58,364-378 | Autorizar, auditar, solo lectura | D |
| SEC-AUTH-008 | Media | Mensajes enumeran cuenta/exponen detalles | auth_state.dart:393-412 | Mensajes uniformes/log interno | C |
| SEC-AUTH-009 | Alta | Alta Auth+perfil no transaccional | auth_state.dart:121-147 | Saga idempotente | D |
| SEC-AUTH-010 | Info positiva | Password se entrega a Firebase y no se persiste | auth_state.dart:121-155 | Preservar | A |

## Autorización y aislamiento

| ID | Sev. | Comportamiento actual / riesgo | Evidencia | Tratamiento | Clase |
|---|---|---|---|---|---|
| SEC-AUTHZ-001 | Crítica | No hay capa central de autorización | route_state.dart; caja_state.dart | Casos de uso con actor/tenant | D |
| SEC-AUTHZ-002 | Crítica | Cobrador ve todas las rutas/clientes | route_state.dart:329-332 | Scope por membresía | D |
| SEC-AUTHZ-003 | Crítica | Ruta/cierre solo lectura evadible | modo_carretera_screen.dart:461-469 | Guard común de dominio | D |
| SEC-AUTHZ-004 | Alta | Cierre aprobado se reabre/modifica sin trazabilidad | cierre_dia_screen.dart:184-253 | Estado/versiones/autorización | C |
| SEC-AUTHZ-005 | Alta | Flags de visibilidad no protegen datos | caja_state.dart:76-82 | Política antes de entregar datos | D |
| SEC-AUTHZ-006 | Alta | Asignación no limita lectura/escritura | auth_state.dart:351-360 | Enforcement transaccional | D |
| SEC-AUTHZ-007 | Alta | Admin no puede leer perfiles reales de equipo | firestore.rules:5-14 | Modelo empresa/membresía | D |
| SEC-AUTHZ-008 | Crítica funcional | Namespace UID impide equipo compartido | local_store.dart:12-30 | Tenant compartido+caché | D |
| SEC-AUTHZ-009 | Alta | Namespace cambia tarde y no se limpia | sync_wrapper.dart:30-47 | Resolver scope en auth | D |
| SEC-AUTHZ-010 | Alta/F | Export/restore/reset accesibles a cobrador | ajustes_screen.dart:85-118 | Validar con cliente/reautenticar | F |
| SEC-AUTHZ-011 | Crítica | Admin demo anónimo puede restaurar backup real | landing_screen.dart:42-50; backup_service.dart | Aislar/cifrar y bloquear demo | D |
| SEC-AUTHZ-012 | Media | Simular cobrador conserva privilegios admin | cierre_dia_screen.dart:184-212 | Rol efectivo coherente | C |
| SEC-AUTHZ-013 | Alta | Remover no revoca perfil/token/datos | auth_state.dart:335-349 | Revocación remota/offline TTL | D |

## Datos y privacidad

| ID | Sev. | Comportamiento actual / riesgo | Evidencia | Tratamiento | Clase |
|---|---|---|---|---|---|
| SEC-DATA-001 | Alta | PII/finanzas en JSON local sin cifrado | local_store.dart:52-204 | Base cifrada/Keystore | D |
| SEC-DATA-002 | Alta | JSON/XLSX compartibles sin cifrado/retención | ajustes_screen.dart:236-245 | Autorizar/minimizar/limpiar | D |
| SEC-DATA-003 | Crítica | Backups diarios cruzan cuentas | backup_service.dart:19-70 | Carpeta/manifest por tenant | D |
| SEC-DATA-004 | Crítica | Pago y caja no son atómicos | registrar_pago_screen.dart:135-162 | Ledger/unidad de trabajo | D |
| SEC-DATA-005 | Alta | Import/reset/corrupción puede sobrescribir/resucitar | local_store.dart:262-300 | Staging/swap/cuarentena | D |
| SEC-DATA-006 | Media | Backup omite medios/cobradores | local_store.dart:251-260 | Manifest/checksums | C |
| SEC-DATA-007 | Alta | Primer UID hereda datos legacy | local_store.dart:81-95 | Consentimiento/propietario | C |
| SEC-DATA-008 | Info positiva | Android backup del sistema deshabilitado | AndroidManifest.xml:10-15 | Preservar | A |
| SEC-PRIV-001 | Alta | Coordenadas exactas de ruta a OSRM público | panel_rutas_screen.dart:531-545 | Proveedor/proxy/consentimiento | D |
| SEC-PRIV-002 | Media | OSM/Maps/WhatsApp reciben ubicación/saldo | contacto.dart; cartulina_screen.dart | Aviso/minimización | C |
| SEC-PRIV-003 | Media | Image.network permite tracking de terceros | cliente_avatar.dart:71-99 | Almacén controlado/orígenes | C |
| SEC-PRIV-004 | Info positiva | Permisos foreground relativamente mínimos | AndroidManifest.xml:2-9 | Preservar y explicar | A |

## Firebase, build e integraciones

| ID | Sev. | Comportamiento actual / riesgo | Evidencia | Tratamiento | Clase |
|---|---|---|---|---|---|
| SEC-FB-001 | Info positiva | Deny-by-default fuera de perfil | firestore.rules:10-14 | Preservar | A |
| SEC-FB-002 | Alta funcional | Sync/cupones incompatibles con reglas | cloud_sync_service.dart; rules | Diseñar reglas/tests backend | D |
| SEC-FB-003 | Alta | Perfil sin schema/tipos/transiciones | firestore.rules:5-8 | Validación estricta | D |
| SEC-FB-004 | Media/futuro | No aparece App Check | pubspec.yaml; main.dart | Añadir si backend lo requiere | B |
| SEC-FB-005 | Info | Firebase config pública, no private key detectada | firebase_options.dart | Restringir en consola | A |
| SEC-FB-006 | Alta funcional | App continúa sin Firebase; OAuth parece incompleto | main.dart:25-32; google-services.json | Estado explícito/SHA por ambiente | D |
| SEC-BUILD-001 | Crítica | Release usa firma debug | build.gradle.kts:30-35 | Keystore release/CI secrets | D |
| SEC-BUILD-002 | Media | Lockfile ignorado | cobros_app/.gitignore:1-8 | Versionar/escanear | C |
| SEC-MOBILE-001 | Media | Invitación no es App Link y query se filtra | invitacion.dart:23-24; Manifest | App Link y token opaco | D |
| SEC-MOBILE-002 | Media | Anti-reloj local editable/fail-open | local_store.dart:302-331 | Tiempo de servidor/política offline | D |
| SEC-MOBILE-003 | Alta | Wompi sim activa entitlements | wompi_simulador_screen.dart | Fake solo demo; webhook real | D |

## Controles positivos a preservar

- Firebase Auth maneja passwords.
- Reglas niegan colecciones no previstas.
- Android system backup está deshabilitado.
- No hay ubicación background ni permisos masivos.
- No se detectaron service accounts/private keys.
- Random.secure se usa para invitaciones.
- Los datos demo tienen namespace separado, aunque backups no.

## TO-BE mínimo de seguridad

1. Modelo multiempresa y membresías server-side.
2. Roles/entitlements no editables por el usuario.
3. Autorización en cada caso de uso y backend.
4. Perfil faltante = acceso bloqueado, nunca admin.
5. Base local y backups cifrados.
6. Unidad de trabajo financiera.
7. Revocación y estrategia offline.
8. Export/restore/reset con permiso y reautenticación.
9. Reglas Firestore/API probadas en emulador/CI.
10. Firma release y ambientes separados.
11. Consentimiento/minimización para geolocalización y mensajería.
12. Log/auditoría sin PII.

## Pruebas faltantes

- escalación de rol y schema Firestore;
- matriz rol×acción;
- ruta asignada/no asignada;
- revocación y offline;
- bypass de solo lectura;
- backup cruzado con demo;
- verificación en reglas;
- impersonación;
- export/reset por cobrador;
- firma/OAuth/ambientes.

