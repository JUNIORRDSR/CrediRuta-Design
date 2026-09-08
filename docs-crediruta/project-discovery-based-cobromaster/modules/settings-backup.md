# Módulo: ajustes y respaldo

## Propósito y actores

Gestionar tema, sesión, copia/restauración y restablecimiento local. Actores: ambos roles y el sistema.

## AS-IS

Tema se persiste en SharedPreferences y se expone con `ThemeState`. Ajustes permite backup, restaurar último archivo, compartir datos, restablecer y cerrar sesión. El respaldo contiene cadenas JSON de varias claves, sin schema version, cifrado ni manifiesto de tenant; omite parte de cuentas/media. El nombre diario es global, así que namespaces distintos pueden sobrescribirse.

Restaurar escribe datos raw; la coordinación con providers/memoria no garantiza una recarga atómica. Restablecer elimina preferencias del namespace, pero no vacía objetos globales/providers, permitiendo que datos reaparezcan con la siguiente mutación. Funciones `dart:io` limitan portabilidad web.

**Clasificación:** A para preferencia de tema y backup básico; C/D para alcance, seguridad y consistencia.

## INTENCIÓN INFERIDA

Evitar pérdida de datos offline y permitir al usuario controlar su copia local/configuración.

## TO-BE PROPUESTO

- Backup versionado con manifest, tenant, checksums, timestamps y compatibilidad declarada.
- Cifrado autenticado y política de clave/recuperación.
- Validar todo en staging antes de reemplazar; import transaccional y rollback.
- Reiniciar scopes/repositorios después de restore/reset.
- Preferencias separadas de datos de negocio y adaptadores por plataforma.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-DATA-005…007, BR-AUTH-012 |
| Flujos | UF-DATA-001, UF-DATA-002, UF-SET-001, UF-CONFIG-001 |
| Datos | snapshot de rutas/clientes/caja/cierres, sesión, tema |
| Pantallas | ajustes, configuración admin |
| Evidencia | `data/backup_service.dart:12-94`; `data/local_store.dart:246-304`; `features/ajustes/ajustes_screen.dart`; `state/theme_state.dart` |
| Pruebas | `backup_service_test.dart`, `local_store_test.dart`; faltan corrupción/versiones/cross-account |

Resolver Q-I11 y Q-I09. Preservar recuperación local como requisito; reemplazar el formato raw y el reset parcial.
