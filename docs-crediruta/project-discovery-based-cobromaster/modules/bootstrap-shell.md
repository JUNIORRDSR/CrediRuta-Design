# Módulo: arranque y shell

## Propósito y actores

Inicializar infraestructura local/remota, rehidratar estado y decidir qué experiencia mostrar. Intervienen todos los usuarios y el sistema.

## AS-IS

`main()` inicializa Flutter, localización, Firebase y `LocalStore`; luego crea `AuthState`, `RouteState`, `CajaState` y `ThemeState` mediante Provider. `CobrosApp` elige landing, verificación, home administrador, unión a equipo o home cobrador según sesión, roles y flags locales. La navegación combina esta decisión declarativa con `Navigator.push` imperativo y un mapa reducido de rutas nombradas.

Si el perfil contiene ambos roles, administrador tiene precedencia salvo el flag local de simulación. Los providers operativos viven más que un cambio de cuenta y logout no los reinicia completamente.

**Clasificación:** A para inicialización/enrutamiento base; C/D para ciclo de providers y cambio de identidad.

## INTENCIÓN INFERIDA

Ofrecer una entrada determinista, restaurar trabajo offline y dirigir cada rol a una experiencia dedicada sin perder datos.

## TO-BE PROPUESTO

- Bootstrap por fases: configuración → almacenamiento → identidad → tenant/membresía → sincronización → router.
- Estado `loading/ready/recoverableError/fatalError` observable, con recuperación explícita.
- Router con guards de sesión, tenant, rol y entitlement.
- Scope de dependencias por sesión/empresa; destruir/recrear repositorios al cambiar identidad.
- `AppEnvironment` para local, staging y producción.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-AUTH-001, BR-AUTH-002, BR-AUTH-012, BR-NAV-002 |
| Flujos | UF-SYS-001, UF-SET-001, UF-ROLE-001 |
| Datos | sesión, tema, namespace, Usuario |
| UI | `landing_screen.dart`, `error_horario_screen.dart`, homes por rol |
| Integraciones | Firebase Core/Auth, SharedPreferences, Provider |
| Evidencia | `cobros_app/lib/main.dart:15-68`; `cobros_app/lib/app.dart:28-46`; `core/navigation/app_routes.dart` |
| Pruebas | `widget_test.dart`, `auth_demo_test.dart`, `local_store_test.dart` |

## Riesgos y decisiones

- Cambiar de usuario sin vaciar estado puede mostrar o mutar datos de otra identidad.
- Una ruta nombrada desconocida cae a landing, ocultando errores de navegación.
- El shell no representa de forma separada offline, fallo de perfil y perfil incompleto.

Conservar la rehidratación y las experiencias por rol. Rediseñar el lifecycle y los guards. Validar plataformas objetivo en Q-B02 y ambientes Firebase en Q-B03.
