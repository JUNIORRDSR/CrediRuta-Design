# Módulo: autenticación y sesión

## Propósito y actores

Crear y recuperar identidad, verificar correo, entrar con email/Google/demo y finalizar sesión. Actores: administrador, cobrador, usuario no autenticado y Firebase.

## AS-IS

Firebase Auth mantiene credenciales; Firestore `usuarios/{uid}` mantiene perfil. Email/contraseña crea cuenta, envía verificación y escribe un perfil con rol/plan. Google crea por defecto un administrador con suscripción activa cuando no encuentra perfil. Si `_perfil` no puede recuperar un documento válido, construye un perfil administrador mínimo. La UI afirma aceptar teléfono, pero el backend llama `signInWithEmailAndPassword`.

La variante de registro para unirse a equipo define tres pasos aunque existen cuatro; intenta crear la cuenta antes de mostrar/configurar contraseña. Un código cualquiera no vacío se copia como `administradorId`. La promesa de 24 horas de verificación solo aparece en texto: el acceso queda bloqueado de inmediato. Logout firma fuera y oculta usuario, pero no limpia todos los flags/providers/namespaces.

**Clasificación:** mezcla A/C/D; los defaults privilegiados, el registro de cobrador y el logout incompleto son D.

## INTENCIÓN INFERIDA

Permitir onboarding autónomo de administradores que pagan y onboarding por invitación para cobradores, con verificación previa y recuperación sencilla.

## TO-BE PROPUESTO

- Separar identidad Firebase de perfil y membresía de empresa.
- Crear una membresía únicamente mediante invitación válida o flujo autorizado de propietario.
- Nunca inferir administrador por error/falta de perfil.
- Proteger roles, plan y empresa en backend; el usuario solo edita campos de perfil permitidos.
- Diseñar una saga recuperable para Auth creado/perfil fallido.
- Limpiar scopes locales al logout/cambio de cuenta y definir caché offline segura.

## Flujos, reglas y evidencia

| Elemento | Referencia |
|---|---|
| Flujos | UF-AUTH-001…008, UF-ROLE-001 |
| Reglas | BR-AUTH-001…015 |
| Pantallas | login, registro por pasos, verificación de correo, landing |
| Datos | Usuario, Firebase User, sesión local, perfil `usuarios/{uid}` |
| Evidencia crítica | `auth_state.dart:73-212,215-272,380-390`; `registro_flujo_screen.dart:38,87-161,331`; `firestore.rules:5-14` |
| Pruebas | `auth_demo_test.dart`; render mínimo en `widget_test.dart` |

## Permisos, errores y preguntas

Las reglas Firestore solo verifican `request.auth.uid == uid`; no protegen campos privilegiados. No hay pruebas negativas de autorización, expiración, cuenta parcial o revocación. Resolver Q-B03, Q-B05, Q-B06, Q-B07 y Q-I12 antes de implementar. Preservar email/Google solo si el cliente confirma canales; descartar los fallbacks y el “teléfono” no implementado.
