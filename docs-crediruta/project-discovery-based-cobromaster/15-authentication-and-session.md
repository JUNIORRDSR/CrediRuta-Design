# 15. Autenticación y sesión

## Mecanismos

| Mecanismo | AS-IS |
|---|---|
| Correo/password | Firebase Auth |
| Google | Google Sign-In + Firebase credential |
| Verificación | Firebase emailVerified |
| Recuperación | Firebase reset email |
| Perfil | Firestore usuarios/{uid} |
| Demo | Usuario en memoria + namespace demo |
| Sesión local propia | Claves legacy sin uso actual |

## Login por correo

1. UI exige ambos campos no vacíos.
2. Normaliza correo.
3. Firebase inicia sesión.
4. AuthState lee perfil.
5. Si falla perfil, crea administrador mínimo.
6. Vuelve a raíz.
7. CobrosApp decide gate/rol.
8. SyncWrapper fija namespace UID.

Clasificación C/D por promesa de teléfono y fallback fail-open.

## Google

Usuario nuevo:

- rol administrador;
- nombre de negocio generado;
- planYa;
- suscripción activa.

No pasa por selección de rol, términos, invitación o pago. Clasificación E/D.

## Registro administrador

PageView de cuatro páginas:

1. opción;
2. negocio;
3. nombre/correo;
4. password/términos.

Antes de registrar muestra diálogo “Wompi (Simulación)” y basta pulsar pagar. Luego crea Auth, envía verificación y escribe perfil.

Riesgo: Auth puede crearse y Firestore fallar, dejando cuenta parcial.

## Registro cobrador

Defecto crítico:

- totalPasos=3;
- PageView tiene cuatro páginas;
- índice 2 se trata como último;
- intenta registrar desde Datos personales;
- Seguridad nunca aparece;
- password vacío impide completar.

Además, cualquier código no nulo se guarda como administradorId sin validar.

## Verificación

necesitaVerificar es verdadero para cualquier cuenta real no verificada. Por tanto el bloqueo es inmediato.

Los campos limiteVerificacion y horasParaVerificar comunican 24 h, pero no conceden acceso durante esa ventana ni cambian la política al vencer.

Reenviar traga errores y muestra éxito. Refrescar usa reload y conserva valor local si falla.

Clasificación C/D.

## Restauración de sesión

AuthState.cargar:

- consulta currentUser fuera del try;
- ejecuta reload;
- lee perfil;
- si reload falla, deja usuario nulo.

No existe estado “restaurando”. La Landing puede mostrarse temporalmente.

## Demo

- no toca Firebase;
- usa namespace demo;
- persiste cambios;
- admin demo entra al home;
- cobrador demo nace huérfano y va a UnirseEquipo;
- todos los escenarios demo comparten datos.

Esto contradice el botón “Ver demo cobrador” como acceso directo a la operación.

## Logout

AS-IS:

- intenta Firebase signOut salvo demo;
- ignora error;
- limpia usuario/demo/impersonación;
- no limpia simularCobrador;
- no neutraliza namespace;
- no reinicia rutas, caja o equipo.

Riesgo: sesión Firebase aún activa, datos previos en memoria y siguiente admin en vista cobrador.

## Errores y copy

Se mapean códigos Firebase comunes al español. Errores genéricos exponen e.message o el objeto.

La UI dice “correo electrónico o teléfono”, pero solo existe email.

## AS-IS / intención / TO-BE

### AS-IS

Identidad remota real con autorización local insegura y onboarding contradictorio.

### INTENCIÓN INFERIDA

Auth fácil, verificada, con alta de admin pagada y alta de cobrador por invitación; demo sin fricción.

### TO-BE PROPUESTO

- autenticar identidad antes de otorgar rol;
- crear organización/membresía en backend;
- registro idempotente;
- perfil obligatorio, nunca admin por fallback;
- invitación canjeada server-side;
- política clara de 24 h;
- roles/entitlements fuera del documento editable;
- caché de perfil firmada para offline;
- logout con limpieza completa;
- estados de bootstrap/loading/error;
- MFA o PIN/biometría si el riesgo lo exige.

## Criterios de aceptación esenciales

- usuario sin perfil no obtiene ningún rol;
- cobrador no puede inventar administradorId;
- Google completa onboarding;
- registro cobrador recorre Seguridad y consume invitación;
- no verificado se comporta según una política única;
- logout no deja datos/flags visibles;
- cada sesión selecciona tenant antes del home;
- acciones privilegiadas se validan backend.

