# 02. Inventario tecnológico

## Stack principal

| Tecnología | Declarada | Resuelta localmente | Uso | Evaluación |
|---|---:|---:|---|---|
| Flutter | SDK | 3.44.6 | UI y runtime | El código usa previews recientes |
| Dart | >=3.4.0 <4.0.0 | 3.12.2 | Lenguaje | El mínimo declarado es insuficiente para el árbol actual |
| provider | ^6.1.2 | 6.1.5+1 | Estado | Vigente; alto acoplamiento por uso global |
| intl | ^0.19.0 | 0.19.0 | Formato es | Resolvable a 0.20.3 |
| shared_preferences | ^2.3.2 | 2.5.5 | JSON local | Inadecuado para el volumen/atomicidad objetivo |
| firebase_core | ^4.10.0 | 4.11.0 | Bootstrap | Activo |
| firebase_auth | ^6.5.2 | 6.5.4 | Identidad | Activo |
| cloud_firestore | ^6.5.0 | 6.6.0 | Perfiles/cupones/sync inactivo | Parcial |
| google_sign_in | ^6.2.1 | 6.3.0 | Login Google | Resolvable a 7.2.0; configuración externa pendiente |
| flutter_map | ^7.0.2 | 7.0.2 | Mapa OSM | Resolvable a 8.3.1 |
| latlong2 | ^0.9.1 | 0.9.1 | Coordenadas | Resolvable a 0.10.1 |
| geolocator | ^12.0.0 | 12.0.0 | GPS | Resolvable a 14.0.3 |
| qr_flutter | ^4.1.0 | 4.1.0 | QR | Activo |
| excel | ^4.0.6 | 4.0.6 | XLSX | Activo |
| path_provider | ^2.1.4 | 2.1.6 | Directorios | Activo |
| share_plus | ^10.1.1 | 10.1.4 | Compartir | Resolvable a 13.2.0 |
| url_launcher | ^6.3.2 | 6.3.2 | WhatsApp/teléfono/Maps | Activo |
| image_picker | ^1.1.2 | 1.2.3 | Cámara/galería | Activo |
| cupertino_icons | ^1.0.8 | 1.0.9 | Ningún import encontrado | Candidato obsoleto E |
| flutter_lints | ^4.0.0 | 4.0.0 | Lint | Resolvable a 6.0.0 |

Fuente: **cobros_app/pubspec.yaml**, **pubspec.lock** local y consulta de solo lectura “dart pub outdated --json” el 2026-07-10. No se actualizó ningún paquete. Seis dependencias runtime directas tienen una versión resoluble más reciente; esto no implica que migrarlas sea segura o prioritaria.

La consulta no marcó las versiones actuales reportadas como afectadas por advisory, pero no sustituye una revisión de CVE/SBOM ni de código nativo.

## Lenguajes y tooling

- Dart para aplicación, tests y generador geográfico.
- Kotlin y Gradle Kotlin DSL para Android.
- Java/JVM 17.
- Firestore Security Rules.
- HTML/CSS/JavaScript para una landing raíz separada.
- PowerShell, Bash y Batch para scripts locales.

## Tamaño

| Elemento | Cantidad |
|---|---:|
| Archivos versionados | 166 |
| Archivos bajo cobros_app | 124 |
| Archivos Dart | 85 |
| Dart de aplicación | 71 |
| Dart de pruebas | 13 |
| Herramientas Dart | 1 |
| Líneas físicas Dart en lib (incluye blancos/comentarios) | 15.330 |
| Líneas físicas en archivos de features | 10.598 |
| Anotaciones Preview | 33 |

## Plataformas

| Plataforma | Estado |
|---|---|
| Android | Objetivo principal; configuración Firebase y permisos presentes |
| Web | Scaffold y opciones Firebase presentes, pero imports directos de dart:io impiden portabilidad completa |
| iOS | Sin directorio; FirebaseOptions lanza UnsupportedError |
| Windows | No configurado; UnsupportedError |
| macOS | No configurado; UnsupportedError |
| Linux | No configurado; UnsupportedError |

Evidencia: **firebase_options.dart:18-49**, carpetas del proyecto y nueve imports productivos de dart:io.

## Configuración y ambientes

AS-IS:

- un solo proyecto Firebase hardcodeado;
- sin flavors ni dart-define;
- sin local/staging/production;
- sin API base configurable;
- sin inyección de adaptadores por ambiente;
- release Android firmado con clave debug;
- applicationId “com.prestaya.app”, namespace “com.example.cobros_app”.

Clasificación D, severidad alta. Evidencia: **firebase.json:7-23**, **android/app/build.gradle.kts:10-35**.

## Verificación ejecutada

### Análisis estático

“dart analyze”:

- 0 errores;
- 0 warnings;
- 23 infos: APIs deprecadas, const preferibles, interpolaciones y un uso de BuildContext tras await.

Esto confirma compilabilidad estática, no corrección funcional.

### Tests

“flutter test --no-pub”:

- 23 tests;
- 23 aprobados;
- duración aproximada: 7 segundos de ejecución reportada.

Véase [19-testing-analysis.md](19-testing-analysis.md).

## Archivos generados

| Archivo/directorio | Estado |
|---|---|
| lib/firebase_options.dart | Generado y activo |
| android/app/google-services.json | Generado y activo |
| lib/data/demo_rutas_geo.dart | Generado y activo como fallback demo |
| .dart_tool | Generado/ignorado |
| .flutter-plugins-dependencies | Generado/ignorado |
| pubspec.lock | Local e ignorado; afecta reproducibilidad |

## Obsoletos, huérfanos o defectuosos

| Artefacto | Evidencia | Clase |
|---|---|---|
| EquipoTrabajoScreen | No tiene import productivo | E |
| ReporteCobranzaScreen | No se navega; exportar PDF vacío | D/E |
| AppRoutes no implementadas | Caen a landing | E |
| Generador geográfico | No carga seed y regeneraría mapa vacío | D |
| build_optimized.ps1 | Calcula cobros_app/cobros_app | D |
| scripts de lanzamiento | Rutas y usuario hardcodeados | D |
| gitlink flutter | Sin .gitmodules y directorio vacío | D |
| README/FUNCIONES-DEMO/INTEGRACION-NUBE | Describen estados históricos contradictorios | C |
| landing raíz | Enlaces file:// y promesas cloud/cupones no vigentes | C/D |
| web manifest | Nombre y descripción de plantilla | C |

## TO-BE tecnológico

- fijar una versión mínima real de Flutter/Dart;
- versionar lockfile y definir actualización controlada;
- separar ambientes;
- reemplazar SharedPreferences operativo por base local transaccional;
- introducir repositorios/puertos;
- agregar CI reproducible, firma release y SBOM;
- desacoplar dart:io si web sigue en alcance;
- encapsular OSM, OSRM, GPS, archivos, Auth y backend en adaptadores.
