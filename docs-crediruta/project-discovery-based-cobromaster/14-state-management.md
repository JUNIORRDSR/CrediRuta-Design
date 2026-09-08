# 14. Gestión de estado

## Árbol AS-IS

main.dart crea cuatro providers:

| Provider | Responsabilidad | Persistencia |
|---|---|---|
| AuthState | Sesión, roles, demo, equipo, impersonación | Firebase + cobradores locales |
| RouteState | Rutas, clientes, búsqueda, selección, visitados | Rutas/clientes locales |
| CajaState | Caja, gastos, cierre, invitaciones, configuración | Caja/cierres locales |
| ThemeState | ThemeMode | SharedPreferences global |

Evidencia: **main.dart:54-66**.

## Fuente real de datos

RouteState no posee sus colecciones. Lee y muta listas estáticas de DatosDemo:

~~~mermaid
flowchart LR
    UI --> ROUTE[RouteState]
    UI --> DIRECT[Acceso directo]
    ROUTE --> DEMO[DatosDemo estático]
    DIRECT --> DEMO
    ROUTE --> STORE[LocalStore]
    STORE --> DEMO
~~~

Pantallas como AdminResumen, AdminHome y Reporte leen DatosDemo directamente. Un notify de RouteState solo actualiza consumidores que observan ese provider; el modelo no impide mutaciones fuera de él.

## Ciclo de arranque

1. LocalStore inicia namespace global vacío.
2. RouteState.inicializar elige primera ruta de ese almacén.
3. CajaState.cargar lee caja global.
4. AuthState.cargar se ejecuta asincrónicamente sin estado loading.
5. Si hay usuario, SyncWrapper cambia namespace y recarga RouteState/CajaState.

Esto permite un destello de Landing y una ventana con estado anterior/global. Evidencia: **main.dart:57-64**, **sync_wrapper.dart:25-63**.

## SyncWrapper

Nombre y animación sugieren sincronización remota, pero:

- fija namespace;
- recarga estados;
- llama descargarDeLaNubeYAplicar;
- la descarga retorna false inmediatamente porque habilitado=false;
- muestra una barra de 3 px mientras ejecuta.

Clasificación C. Debe renombrarse conceptualmente a SessionDataScope en la reconstrucción.

## Mutabilidad

- Ruta y Cliente tienen campos mutables.
- Cliente.prestamos y Prestamo.pagos son listas mutables.
- RouteState devuelve listas y Set que pueden modificarse.
- CajaState expone listas inmutables en algunos getters, pero no todas las invariantes.
- AuthState usa Usuario inmutable parcial, pero copyWith no puede limpiar administradorId.

Consecuencia: las reglas dependen de disciplina de UI, no de contratos.

## Asincronía y persistencia

Muchos mutadores llaman métodos Future sin await:

- RouteState._persistir;
- CajaState._persistir;
- AuthState._guardarCobradoresEquipo.

Un pago modifica el préstamo, suma Caja y lanza persistencias separadas. No hay estado saving/error ni rollback.

Clasificación D para integridad financiera.

## Estado efímero mal definido

| Estado | Persistido | Reset automático | Problema |
|---|---:|---:|---|
| ruta seleccionada | No | Al recargar | Cambia inesperadamente |
| búsqueda | No | Al cambiar ruta | Correcto básico |
| visitados | No | Nunca por fecha/cuenta | Mezcla jornada/sesión |
| simularCobrador | No | No en logout | Se filtra a siguiente login |
| impersonación | No | Sí en logout | Sin auditoría |
| permisos mostrar* | Sí en caja | No completamente al cambiar cuenta | Se filtran |
| frecuencia entrega | Sí | No completamente | No tiene efecto |
| loading sesión | No existe | — | Destellos/fallbacks |

## Errores

- catches vacíos en Auth, Caja, archivos y red;
- LocalStore puede vaciar memoria por JSON inválido;
- Caja corrupta retorna null sin backup;
- UI no sabe si guardar falló;
- no existe canal central de errores;
- mensajes se generan dentro de widgets/providers como strings.

## Separación AS-IS / intención / TO-BE

### AS-IS

ChangeNotifier funciona como estado, servicio de aplicación, repositorio y parte de dominio. DatosDemo es singleton global. Persistencia es side effect.

### INTENCIÓN INFERIDA

Mantener una arquitectura comprensible y ligera para un MVP offline.

### TO-BE PROPUESTO

Por feature:

~~~mermaid
flowchart LR
    VIEW[Presentación] --> VM[Controller/ViewModel]
    VM --> USECASE[Caso de uso]
    USECASE --> DOMAIN[Dominio]
    USECASE --> REPO[Puerto repositorio]
    REPO --> LOCAL[Adaptador local]
    REPO --> REMOTE[Adaptador remoto]
~~~

Requisitos:

- estado inmutable o mutaciones encapsuladas;
- comandos con Result tipado;
- unidad de trabajo para cartera+caja;
- scope de tenant/sesión creado antes de renderizar;
- estados loading/empty/error/success explícitos;
- outbox de sync observable;
- reloj y generador de IDs inyectables;
- providers limitados a presentación/DI, no a reglas.

## Pruebas necesarias

- cambio de cuenta resetea todos los flags;
- logout limpia simulación/equipo/namespace;
- pago falla/triunfa atómicamente;
- error de almacenamiento llega a UI;
- rollover de jornada;
- mutaciones concurrentes;
- rehidratación con schema viejo/dañado;
- navegación no presenta datos del tenant anterior.

