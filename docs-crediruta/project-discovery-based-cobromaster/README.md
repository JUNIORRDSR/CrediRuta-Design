# Auditoría de descubrimiento de CobroMaster / CrediRuta / Presta Ya

> **Nota de marca.** El producto se llama **CrediRuta** (ADR-001, contrato 05 §1). Esta carpeta
> conserva el nombre `project-discovery-based-cobromaster/` y los nombres viejos en su contenido
> **a propósito**: es la fotografía de cómo estaba el sistema cuando se auditó, y uno de sus
> hallazgos es precisamente que convivían tres marcas. Reescribirla borraría la evidencia que
> justificó la decisión. Lo que describe el sistema **a construir** sí dice CrediRuta en todas partes.

## Objetivo

Esta carpeta reconstruye el producto actual antes de cualquier migración o reescritura. Describe lo que el repositorio hace hoy, la intención que puede inferirse y una propuesta de comportamiento futuro sin convertir esa propuesta en “verdad” del sistema.

La documentación está pensada para que otro equipo o agente pueda iniciar un proyecto nuevo sin depender constantemente del código original.

## Alcance

La auditoría cubre:

- los 166 archivos versionados y, en detalle, los 85 archivos Dart;
- 34 superficies de pantalla, de las cuales 32 son alcanzables y 2 están huérfanas;
- 13 módulos funcionales/técnicos;
- 8 entidades serializables, el agregado Caja y los objetos de configuración;
- autenticación, sesión, roles, navegación, datos, persistencia, integraciones y seguridad;
- 95 reglas de negocio reconstruidas;
- pruebas, errores, deuda técnica, criterios de aceptación y requisitos de migración;
- documentos y capturas históricas, contrastados contra el código vigente.

No se modificó código fuente, configuración ni dependencias. Los únicos cambios de esta auditoría están dentro de **docs/project-discovery/**.

## Corte auditado

| Dato | Valor |
|---|---|
| Fecha de auditoría | 2026-07-10 |
| Rama | fix/remediacion-datos-local |
| Commit | c3eca57f0eba8db82f970c7e8c21e8267e611a41 |
| Flutter detectado | 3.44.6 |
| Dart detectado | 3.12.2 |
| Análisis estático | 0 errores, 0 warnings, 23 observaciones informativas |
| Pruebas ejecutadas | 23 de 23 pasan |

El árbol ya contenía cambios ajenos en archivos de **.idea/**. Se preservaron y no forman parte de esta auditoría.

## Método

1. Inventario de archivos, dependencias, puntos de entrada y configuración.
2. Lectura completa de modelos, providers, almacenamiento, navegación y pantallas.
3. Reconstrucción transversal de cada flujo entre UI, estado, modelo y persistencia.
4. Ejecución de análisis estático y de la suite existente, sin actualizar paquetes.
5. Verificación de versiones mediante consulta de solo lectura a pub.dev.
6. Análisis paralelo por subagentes especializados en inventario, negocio, datos, flujos, UI, seguridad, calidad, integraciones y pruebas.
7. Validación cruzada y revisión directa de la evidencia antes de consolidar conclusiones.

Las 17 imágenes de **capturas_cobromaster/** se trataron como artefactos históricos. No se consideran prueba del runtime vigente. La app pudo compilar su suite de pruebas, pero el entorno no expuso un navegador controlable para capturar una ejecución visual actual.

## Clasificación obligatoria

| Código | Significado |
|---|---|
| A | Comportamiento confirmado por evidencia clara y consistente |
| B | Comportamiento inferido o intención incompleta |
| C | Comportamiento inconsistente o contradictorio |
| D | Comportamiento defectuoso |
| E | Comportamiento accidental |
| F | Requisito no resoluble sin el cliente |

Una clasificación describe el comportamiento, no su severidad. Por ejemplo, el almacenamiento local sin cifrar es un comportamiento confirmado (A) y, al mismo tiempo, un riesgo de seguridad alto.

## Separación utilizada

Todos los documentos distinguen:

- **AS-IS:** comportamiento exacto actual, incluidos errores;
- **INTENCIÓN INFERIDA:** objetivo probable, siempre marcado como inferencia;
- **TO-BE PROPUESTO:** requisito o dirección futura, todavía sujeto a validación.

## Orden de lectura recomendado

Para orientación rápida:

1. [01-project-overview.md](01-project-overview.md)
2. [04-module-map.md](04-module-map.md)
3. [05-business-domain.md](05-business-domain.md)
4. [25-final-conclusions.md](25-final-conclusions.md)

Para reconstrucción funcional:

1. [06-business-rules.md](06-business-rules.md)
2. [08-user-flows.md](08-user-flows.md)
3. [11-data-model.md](11-data-model.md)
4. [12-data-dictionary.md](12-data-dictionary.md)
5. [20-acceptance-criteria.md](20-acceptance-criteria.md)
6. [modules/](modules/)

Para arquitectura y migración:

1. [16-errors-and-edge-cases.md](16-errors-and-edge-cases.md)
2. [17-technical-debt.md](17-technical-debt.md)
3. [18-security-findings.md](18-security-findings.md)
4. [21-client-questions.md](21-client-questions.md)
5. [22-migration-requirements.md](22-migration-requirements.md)
6. [23-recommended-target-architecture.md](23-recommended-target-architecture.md)
7. [24-migration-roadmap.md](24-migration-roadmap.md)

## Estado general

La cobertura del repositorio es completa para el código y la configuración disponibles. Permanecen fuera de verificación:

- consola y datos desplegados de Firebase;
- proveedores Auth y credenciales SHA configurados externamente;
- dominio y deep links de prestaya.app;
- cuenta o sandbox real de Wompi, que no aparece integrado en el código;
- datos legacy existentes en dispositivos reales;
- ejecución visual actual en navegador o dispositivo físico;
- comportamiento bajo concurrencia real y pérdida de proceso;
- términos, cuotas y SLA externos de OSM, OSRM, WhatsApp y Google Maps.

Estas limitaciones están registradas como F o preguntas para el cliente; no se rellenaron con supuestos.

## Índice

Los documentos 01–25 corresponden a los entregables solicitados. Se añaden:

- [26-domain-glossary.md](26-domain-glossary.md)
- [27-coverage-matrix.md](27-coverage-matrix.md)
- [28-evidence-index.md](28-evidence-index.md)
- documentación detallada por módulo en [modules/](modules/)

