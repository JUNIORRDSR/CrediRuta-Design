# 01. Visión general del proyecto

## Resumen ejecutivo

CobroMaster, CrediRuta y Presta Ya son tres nombres presentes para el mismo producto o para etapas del mismo producto. La aplicación intenta gestionar cartera de préstamos informales o de microcrédito: rutas, clientes, desembolsos, cobros, gastos, caja, cierres, equipo y reportes.

El repositorio no es solo un mock visual. Tiene autenticación Firebase real, perfiles en Firestore, persistencia local, mapas, GPS, exportación Excel y una suite de pruebas. Sin embargo, el núcleo operativo sigue siendo un almacén global en memoria llamado DatosDemo, serializado como blobs JSON en SharedPreferences por UID. La colaboración entre administrador y cobrador, pieza central de la propuesta, no funciona entre cuentas o dispositivos.

## Actores

| Actor | Propósito aparente | Capacidad AS-IS |
|---|---|---|
| Administrador | Crear y supervisar rutas, cobradores, cartera, caja y reportes | Amplia en su namespace local |
| Cobrador | Recorrer rutas, cobrar, prestar, registrar gastos y cerrar caja | Amplia en su namespace local; no comparte datos con el admin |
| Cliente de cartera | Recibe préstamo y realiza pagos | Es una entidad gestionada; no tiene sesión propia |
| Sistema | Rehidrata, respalda y presenta datos | Local-first; sincronización de negocio deshabilitada |
| Firebase | Identidad y perfil | Auth/perfil activos; no es backend operativo |

El archivo **DEVELOPMENT.md:5-8** menciona un “cliente final (usuario)”, pero no existe rol, shell ni autenticación para él. Se clasifica B/F hasta validación.

## AS-IS

- Flutter monolítico con Provider y cuatro ChangeNotifier.
- Firebase Auth para correo/contraseña, Google y verificación.
- Firestore para el documento de perfil usuarios/{uid}.
- Rutas, clientes, préstamos, pagos, caja y equipo en JSON local.
- Namespace local distinto por UID o “demo”.
- CloudSync presente pero deshabilitado y bloqueado por reglas.
- Wompi, invitaciones entre dispositivos, GPS de cobradores y suscripciones son simulaciones parciales.
- UI permite varios caminos que evitan bloqueos mostrados en otras pantallas.
- Caja y “visitados” no tienen fecha operativa ni rollover diario.
- 23 pruebas pasan, pero solo cubren una fracción del comportamiento crítico.

Clasificación global: mezcla de A, C y D con alta certeza.

## INTENCIÓN INFERIDA

La evidencia de pantallas, comentarios y documentos apunta a:

1. una app Android ligera para administradores y cobradores;
2. operación offline durante el trabajo de campo;
3. sincronización posterior por equipo;
4. cartulina completa por cliente y varios préstamos;
5. caja diaria conciliada y aprobada;
6. monetización por Plan Ya o por ruta;
7. navegación asistida por mapa y GPS;
8. reportes compartibles y respaldo.

La intención general tiene certeza alta. Sus reglas contractuales —suscripción, boletas, calendario, varios préstamos, sobrepagos— no se pueden resolver sin el cliente.

## TO-BE PROPUESTO

Reconstruir un producto modular, offline-first y multiempresa:

- dominio independiente de Flutter, Firebase, HTTP y SharedPreferences;
- repositorios abstractos y adaptadores local/Firebase/API;
- base local transaccional;
- empresa/equipo y membresías como raíz de autorización;
- ledger de movimientos para préstamos y caja;
- sincronización incremental por entidad, con versiones y outbox;
- autorización server-side para roles, membresías, pagos y suscripciones;
- configuración local, staging y producción;
- pruebas de reglas, widgets, contratos, integración y aceptación.

## Estado por capacidad

| Capacidad | Estado AS-IS | Clase |
|---|---|---|
| Login Firebase por correo | Implementado en código | A |
| Google Sign-In desplegado | Código presente; configuración externa no verificable | F |
| Perfil Firestore | Implementado | A |
| Operación local por cuenta | Implementada | A |
| Operación compartida por equipo | No funciona | D |
| Clientes/préstamos/pagos | Implementados con inconsistencias | C |
| Caja diaria | Agregado sin fecha; no es realmente diario | D |
| Cierre histórico productivo | No se genera | D |
| Mapas/GPS | Implementados con fallbacks engañosos | A/E |
| Invitación/QR visual | Implementada localmente | A |
| Vinculación real por QR | No implementada | D |
| Wompi real | No existe; solo simulador | B |
| Reporte Excel | Implementado, período aplicado parcialmente | C/D |
| Backup local | Implementado, no aislado por cuenta en archivos | A/D |
| Sincronización de negocio | Deshabilitada | A |
| Web productiva | Scaffold presente, código no portable | D |

## Riesgos principales

1. Datos de admin y cobrador no se comparten.
2. Roles y campos privilegiados se confían al cliente.
3. Pagos y caja se actualizan sin transacción atómica.
4. “Hoy” acumula indefinidamente.
5. Cierres aprobados pueden cambiar sin invalidar aprobación.
6. Sobrepagos, cobros sin préstamo y desembolsos fantasma son posibles.
7. Bloqueos por ruta/cierre se pueden evadir desde otras entradas.
8. Backups y PII no están cifrados y pueden cruzarse entre cuentas.
9. Suscripción por usuario y suscripción por ruta se contradicen.
10. La documentación comercial describe capacidades que el código no entrega.

## Métricas del descubrimiento

| Métrica | Resultado |
|---|---:|
| Módulos documentados | 13 |
| Superficies de pantalla | 34 |
| Pantallas alcanzables | 32 |
| Pantallas huérfanas | 2 |
| Entidades serializables | 8 |
| Agregados JSON adicionales | 1 (Caja) |
| Reglas reconstruidas | 95 |
| Tests existentes | 23 |
| Tests aprobados | 23 |
| Hallazgos críticos de comportamiento | 16 |
| Reglas inconsistentes (C) | 22 |

## Evidencia principal

- Arranque: **cobros_app/lib/main.dart:15-68**
- Enrutamiento por rol: **cobros_app/lib/app.dart:28-46**
- Sesión: **cobros_app/lib/state/auth_state.dart**
- Operación: **cobros_app/lib/state/route_state.dart**
- Caja: **cobros_app/lib/state/caja_state.dart**
- Persistencia: **cobros_app/lib/data/local_store.dart**
- Sync deshabilitado: **cobros_app/lib/data/cloud_sync_service.dart:12-17**
- Reglas: **cobros_app/firestore.rules:5-14**

