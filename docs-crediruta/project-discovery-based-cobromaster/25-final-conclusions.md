# 25. Conclusiones finales

## Dictamen ejecutivo

CobroMaster es un prototipo funcional de gestión de préstamos y cobranza que comunica bien la visión operativa, pero no es una base segura para escalar mediante refactor incremental. El repositorio sirve como **fuente de conocimiento y prototipo de interacción**, no como especificación autoritativa ni como backend multiusuario.

La reconstrucción puede comenzar con esta documentación, siempre que antes de cerrar el dominio se resuelvan las 15 preguntas bloqueantes de [21-client-questions.md](21-client-questions.md). Las reglas confirmadas deben convertirse en pruebas de caracterización; las conductas C, D y E no deben copiarse automáticamente.

## Resultado cuantitativo

| Indicador | Resultado | Criterio de conteo |
|---|---:|---|
| Módulos | 13 | Límites funcionales/técnicos del mapa consolidado |
| Superficies de pantalla | 34 | Widgets de pantalla; 32 alcanzables y 2 huérfanos |
| Entidades persistibles | 8 + Caja | 8 modelos serializables y un agregado JSON de caja |
| Reglas de negocio | 95 | Identificadores `BR-*` únicos |
| Flujos de usuario/sistema | 36 | Identificadores `UF-*` únicos |
| Contratos de integración | 15 | Activos, bloqueados, simulados y configuraciones externas |
| Defectos funcionales críticos consolidados | 16 | Defectos con pérdida, privilegio, dinero o bloqueo de flujo |
| Reglas inconsistentes | 22 | Reglas clasificadas C; no incluye todos los hallazgos técnicos C |
| Preguntas para el cliente | 35 | 15 bloqueantes, 14 importantes y 6 deseables |
| Pruebas existentes | 23 | Suite ejecutada: 23/23 pasan |
| Documentos de auditoría | 42 | 29 documentos raíz y 13 fichas de módulo |

El inventario base auditado contiene 166 archivos versionados, 85 archivos Dart y 15.330 líneas físicas (incluidos blancos/comentarios) bajo `cobros_app/lib/`.

## AS-IS

- Flutter organiza una aplicación monolítica con `provider` y cuatro `ChangeNotifier`.
- Firebase Auth y el documento Firestore `usuarios/{uid}` gestionan identidad y perfil.
- Rutas, clientes, préstamos, pagos, gastos y caja se guardan como un único snapshot JSON por UID en `SharedPreferences`.
- `DatosDemo` es simultáneamente seed, almacén mutable global y fuente directa de varias pantallas.
- El sistema ofrece dos experiencias, administrador y cobrador, pero ambos operan namespaces locales aislados; por ello el equipo no comparte cartera real.
- Suscripciones, cupones, Wompi, invitaciones y sincronización contienen UI o código parcial, pero no forman un flujo remoto operativo de extremo a extremo.
- La app permite registrar préstamos, pagos, gastos, visitas y cierres aparentes; varias operaciones financieras no son atómicas y algunas métricas no representan un libro contable reproducible.
- La suite actual valida serialización, persistencia y algunas operaciones felices, pero no cubre autorización, concurrencia, fallos parciales ni los defectos críticos identificados.

Evidencia principal: `cobros_app/lib/main.dart:15-68`, `cobros_app/lib/app.dart:28-46`, `cobros_app/lib/state/auth_state.dart`, `cobros_app/lib/state/route_state.dart`, `cobros_app/lib/state/caja_state.dart`, `cobros_app/lib/state/datos_demo.dart` y `cobros_app/lib/data/local_store.dart`.

## INTENCIÓN INFERIDA

La intención aparente es que un administrador configure rutas, capital, cartera, equipo y cierre de caja; que cada cobrador opere únicamente las rutas asignadas, incluso con conectividad limitada; y que ambos vean una misma fuente de verdad con permisos diferentes. La cartulina representa el historial contractual del cliente y la caja intenta conciliar capital entregado, cobros, gastos y entrega del cobrador.

Esta interpretación se apoya en el lenguaje de la UI, los roles, la asignación de rutas, las invitaciones, las pantallas de cierre y el plan `INTEGRACION-NUBE.md`. No está confirmada como política contractual: faltan decisiones sobre tenant, calendario, boletas, sobrepagos, retaques, reaperturas, comisiones y facturación.

## TO-BE PROPUESTO

- Una organización/empresa debe ser propietaria de la información; el usuario accede mediante una membresía con rol y permisos explícitos.
- El dominio debe representar préstamos, calendario, pagos, ajustes, visitas, caja y cierres con invariantes y movimientos auditables.
- Toda mutación financiera debe ser transaccional localmente y sincronizable mediante outbox/idempotencia.
- Los modelos de dominio deben ser independientes de Firebase, HTTP y almacenamiento; repositorios abstractos deben admitir adaptadores local, Firebase y API propia.
- Los permisos deben imponerse en backend y reglas de datos, además de reflejarse en navegación y controles.
- Los estados de carga, vacío, offline, conflicto y error deben ser explícitos y recuperables.
- Cada conducta P0 debe existir como criterio Given/When/Then y prueba automatizada antes del reemplazo del MVP.

La propuesta completa está en [22-migration-requirements.md](22-migration-requirements.md) y [23-recommended-target-architecture.md](23-recommended-target-architecture.md).

## Riesgos principales para la migración

| Prioridad | Riesgo | Evidencia/impacto | Tratamiento requerido |
|---|---|---|---|
| P0 | No existe tenant compartido | Namespace por UID; admin y cobrador no comparten datos | Resolver propiedad y membresías antes del esquema |
| P0 | Autorización insuficiente | Perfil propio puede escribir rol/plan; fallback concede admin | Backend autoritativo, claims/membresías y pruebas negativas |
| P0 | Contabilidad no reproducible | Pago, caja y visita se mutan por pasos; cierre no crea historial real | Ledger, unidad de trabajo e idempotencia |
| P0 | Datos legacy ambiguos | Snapshot JSON sin versión; relaciones por listas/objetos anidados | Perfilado de datos reales, migrador versionado y reconciliación |
| P0 | Reglas comerciales sin resolver | Calendario, retaque, sobrepago, boleta y cierre son ambiguos | Decisiones de cliente y ejemplos canónicos |
| P1 | Offline y revocación entran en conflicto | Caché local durable sin sincronización ni TTL de permisos | Política offline, cifrado, outbox y revocación definida |
| P1 | Integraciones aparentes no son contratos productivos | Wompi simulado, sync deshabilitado, App Link ausente | Diseñar contratos y ambientes antes de implementar UI final |
| P1 | La UI puede normalizar defectos | Hay atajos que evitan gates y mensajes de éxito sin persistencia | Pruebas de flujo y estados explícitos |

## Qué conservar, corregir y descartar

### Conservar como conocimiento

- vocabulario operativo, cartulina, navegación por rol y trabajo por rutas;
- capacidad offline y rehidratación como objetivo de producto;
- captura de pagos, visitas, gastos y ubicación;
- filtros, resúmenes y exportaciones útiles, una vez definidas sus fórmulas;
- ayudas de formato, tema y componentes visuales reutilizables.

### Corregir al reconstruir

- registro, onboarding, invitaciones, roles y asignación de rutas;
- calendario y estados de cartera;
- operaciones monetarias, validaciones y cierres;
- respaldo/restauración con alcance de tenant y versionado;
- permisos de datos, cifrado, privacidad y configuración por ambiente;
- accesibilidad, feedback de errores, estados offline y consistencia de navegación.

### No preservar como regla

- concesión de administrador por fallback o Google sin invitación;
- códigos arbitrarios tratados como `administradorId`;
- mutación global directa de `DatosDemo`;
- aislamiento de datos por UID como supuesto de equipo;
- “cierres” que solo alteran banderas y contadores;
- Wompi simulado, cupones inaccesibles y sincronización deshabilitada presentados como funcionalidad real;
- bypass de límites comerciales por rutas alternativas de UI.

## Orden recomendado de reconstrucción

1. Resolver marca, alcance, tenant, permisos y reglas financieras bloqueantes.
2. Definir glosario, agregados, invariantes, calendario y ledger.
3. Diseñar esquema local/remoto, IDs, versionado y migración legacy.
4. Construir bootstrap, ambientes, DI, errores, observabilidad y base local.
5. Implementar identidad, empresa, membresías e invitaciones.
6. Migrar rutas y clientes.
7. Migrar préstamos y calendario.
8. Migrar pagos, ajustes y visitas como transacciones.
9. Migrar caja, gastos, cierres y aprobaciones.
10. Agregar sincronización/backend, reportes, respaldos y suscripciones.
11. Ejecutar migración de datos, aceptación, piloto y despliegue progresivo.

Los criterios de entrada/salida por fase están en [24-migration-roadmap.md](24-migration-roadmap.md).

## Áreas no verificadas directamente

- contenido real y reglas efectivamente desplegadas en Firebase;
- datos productivos almacenados en dispositivos del cliente;
- configuración y cuenta real de Wompi, Google OAuth, dominio `prestaya.app` y firma de release;
- comportamiento visual actual en dispositivo/navegador: no hubo navegador controlable; las 17 capturas son históricas;
- concurrencia entre dispositivos, cortes de proceso y pérdida física del dispositivo;
- obligaciones legales concretas de privacidad, crédito, retención y pagos en la jurisdicción objetivo;
- auditoría profunda de vulnerabilidades transitivas: `dart pub outdated` no sustituyó un escáner de advisories/SBOM.

Estas áreas no invalidan la reconstrucción del comportamiento del repositorio, pero deben verificarse antes de producción o migración de datos reales.

## Handoff para un proyecto nuevo

Un agente sin contexto previo debe comenzar por este documento y luego consultar:

1. [26-domain-glossary.md](26-domain-glossary.md) para usar lenguaje consistente;
2. [06-business-rules.md](06-business-rules.md) y [08-user-flows.md](08-user-flows.md) para comportamiento;
3. [11-data-model.md](11-data-model.md) y [12-data-dictionary.md](12-data-dictionary.md) para datos legacy;
4. [20-acceptance-criteria.md](20-acceptance-criteria.md) para pruebas;
5. [21-client-questions.md](21-client-questions.md) antes de fijar decisiones;
6. [22-migration-requirements.md](22-migration-requirements.md), [23-recommended-target-architecture.md](23-recommended-target-architecture.md) y [24-migration-roadmap.md](24-migration-roadmap.md) para ejecución;
7. [27-coverage-matrix.md](27-coverage-matrix.md) y [28-evidence-index.md](28-evidence-index.md) para comprobar trazabilidad.

## Estado de finalización

La auditoría cubre todos los módulos encontrados y permite iniciar una reconstrucción sin releer constantemente el repositorio. **No convierte las preguntas bloqueantes en requisitos resueltos.** El siguiente hito correcto es validar esas decisiones con el cliente y versionar las respuestas como especificación del dominio.
