# 03. Contexto del sistema

## Contexto AS-IS

~~~mermaid
flowchart LR
    ADMIN[Administrador]
    COBRADOR[Cobrador]
    APP[App Flutter]

    ADMIN --> APP
    COBRADOR --> APP

    APP --> FBAUTH[Firebase Auth / Google]
    APP --> FIRESTORE[Firestore: perfiles]
    APP --> PREFS[SharedPreferences local]
    APP --> FILES[Archivos y backups locales]
    APP --> OSM[OpenStreetMap tiles]
    APP --> OSRM[OSRM público]
    APP --> GPS[GPS del dispositivo]
    APP --> EXT[WhatsApp / teléfono / Google Maps]
    APP --> SHARE[Share sheet]

    APP -. código deshabilitado .-> CLOUD[Firestore datos_usuario]
    APP -. simulación .-> WOMPI[Wompi]
    APP -. enlace sin receptor .-> DEEP[prestaya.app/unirse]
~~~

## Límite de confianza

El cliente Flutter contiene actualmente:

- validaciones de formularios;
- cálculo de saldo, atraso, entrega y descuadre;
- decisión de roles y pantallas;
- activación de rutas y planes simulados;
- mutaciones de cartera y caja;
- canje local de invitaciones.

Solo Firebase Auth verifica identidad. Firestore permite al dueño escribir todos los campos de su perfil, incluidos roles y suscripción. No existe backend autoritativo para reglas de negocio.

## Datos por ubicación

| Ubicación | Datos |
|---|---|
| Firebase Auth | UID, correo, proveedor, verificación |
| Firestore usuarios/{uid} | Perfil, roles, plan, vínculo |
| SharedPreferences por UID | Rutas, clientes, préstamos, pagos, caja, equipo, cierres |
| SharedPreferences global | Tema, sesión/cuentas legacy, bandera de migración, reloj |
| Documentos de app | Fotos copiadas de clientes y backups JSON |
| Paths temporales/locales | Fotos de ruta y referencias de medios |
| Memoria global | DatosDemo, selección, visitados y estado de providers |

## Flujos de red

| Destino | Datos enviados | Datos recibidos | Estado |
|---|---|---|---|
| Firebase Auth | correo/password o tokens Google | sesión/UID/verificación | Activo |
| Firestore usuarios | perfil completo | perfil | Activo |
| Firestore cupones | código | activo/meses | Bloqueado por reglas |
| Firestore datos_usuario | blobs JSON | blobs JSON | Deshabilitado |
| OSM | coordenadas de tiles, user-agent | imágenes de mapa | Activo |
| OSRM | lista de coordenadas | geometría de ruta | Activo |
| wa.me | teléfono y mensaje en URL | apertura externa | Activo |
| Google Maps | coordenadas en URL | navegación externa | Activo |
| prestaya.app/unirse | código en URL/QR | no hay receptor en repo | Defectuoso |

## Contradicción central

La interfaz modela una empresa con varios miembros. La persistencia modela cuentas aisladas. Por tanto:

~~~mermaid
flowchart TD
    INTENT[Equipo compartido] --> ADMIN_DATA[Datos del admin]
    INTENT --> COLLECTOR_DATA[Datos del cobrador]
    ADMIN_DATA -. namespace UID A .-> LOCAL_A[Almacén A]
    COLLECTOR_DATA -. namespace UID B .-> LOCAL_B[Almacén B]
    LOCAL_A -.-X LOCAL_B
~~~

Clasificación D, severidad crítica. Evidencia: **SyncWrapper:35-47**, **LocalStore:26-30**, **CloudSyncService:12-17**.

## Contexto TO-BE

~~~mermaid
flowchart LR
    USERS[Apps de admin y cobrador] --> APP[Flutter]
    APP --> LOCAL[Base local transaccional]
    APP --> PORTS[Puertos de aplicación]
    PORTS --> FIREBASE[Adaptador Firebase]
    PORTS --> API[Adaptador API propia]
    PORTS --> MAP[Adaptadores mapa/GPS]
    LOCAL --> OUTBOX[Outbox de sincronización]
    OUTBOX --> FIREBASE
    OUTBOX --> API
    FIREBASE --> AUTHZ[Identidad y autorización]
    API --> DOMAIN[Reglas server-side]
    DOMAIN --> DB[(Datos multiempresa)]
    DOMAIN --> OBS[Auditoría y observabilidad]
~~~

Requisitos:

- el mismo dominio debe funcionar con adaptador local puro, Firebase o API;
- una empresa/equipo debe ser el tenant de datos;
- toda acción sensible debe autorizarse fuera de la UI;
- la app debe seguir operando offline con colas y conflictos explícitos;
- no se debe propagar path local como identificador remoto de archivo.

## Elementos externos no verificables

- configuración real de Firebase Console;
- disponibilidad de prestaya.app;
- cuenta Wompi;
- SLA/cuotas de OSM y OSRM;
- apps instaladas para WhatsApp, teléfono o Maps;
- datos reales de usuarios.

Se clasifican F donde alteran una decisión.

