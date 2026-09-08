# 24. Roadmap de migración

## Estrategia

Reescritura por verticales verificables, no big-bang sin checkpoints. El proyecto actual permanece como referencia/characterization hasta que cada módulo cumpla aceptación.

## Fase 1 — Extracción y validación de requisitos

**Objetivo:** Resolver las 35 preguntas y aprobar alcance.  
**Entradas:** Esta auditoría, stakeholders, operación real.  
**Actividades:** Talleres; glosario; observar una jornada; validar AS-IS/intención/TO-BE; priorizar Android/web; decidir marca.  
**Salidas:** Requisitos versionados, decisiones, criterios aprobados, fuera de alcance.  
**Riesgos:** Convertir bugs en requisitos; respuestas contradictorias.  
**Dependencias:** Participación de cliente/admin/cobrador.  
**Criterio de finalización:** Preguntas bloqueantes cerradas y AC P0 aprobados.

## Fase 2 — Definición del dominio

**Objetivo:** Modelar lenguaje, agregados e invariantes.  
**Entradas:** Glosario y requisitos aprobados.  
**Actividades:** Empresa/membresía; préstamo/calendario/ledger; visita; caja/cierre; suscripción; permisos.  
**Salidas:** Modelo de dominio, reglas BR objetivo, ADR y pruebas unitarias iniciales.  
**Riesgos:** Sobremodelar; fórmulas sin datos reales.  
**Dependencias:** Fase 1.  
**Criterio de finalización:** Cada operación crítica tiene comando, invariantes y ejemplos.

## Fase 3 — Definición del modelo de datos

**Objetivo:** Diseñar esquema local/remoto y migración.  
**Entradas:** Dominio y snapshots anonimizados.  
**Actividades:** Entidades, IDs, UTC/fecha operativa, índices, schema versions, media, outbox, mapeo legacy.  
**Salidas:** ERD, diccionario, migraciones, validador y formato backup.  
**Riesgos:** Datos reales más corruptos/ambiguos; falta tenant.  
**Dependencias:** Fases 1–2.  
**Criterio de finalización:** Roundtrip y migración de fixtures pasan sin pérdida no declarada.

## Fase 4 — Arquitectura base

**Objetivo:** Crear skeleton feature-first y gates de calidad.  
**Entradas:** ADR y modelo.  
**Actividades:** Bootstrap, DI, Result/errors, Clock/IDs, router, tema, DB local, repositorios, CI, ambientes, observabilidad base.  
**Salidas:** App vacía navegable, local/staging/prod, pipeline verde.  
**Riesgos:** Frameworkitis o cambiar demasiadas librerías.  
**Dependencias:** Fases 2–3.  
**Criterio de finalización:** Build reproducible, firmado staging, analyze/tests/CI pasan.

## Fase 5 — Autenticación

**Objetivo:** Identidad, sesión, organización y membresía seguras.  
**Entradas:** AuthPort, modelo de membresía y políticas.  
**Actividades:** Email/Google aprobados, onboarding, verificación, invitaciones, logout, cache offline, guards y rules/API tests.  
**Salidas:** Flujos auth completos y tenant resuelto antes del home.  
**Riesgos:** Config OAuth, cuentas parciales, offline.  
**Dependencias:** Backend/emulador mínimo y arquitectura base.  
**Criterio de finalización:** AC-AUTH/TEAM y seguridad de roles pasan.

## Fase 6 — Migración de módulos por prioridad

**Objetivo:** Construir dominio/aplicación/UI verticales.  
**Entradas:** Arquitectura y criterios.  
**Actividades por orden:**

1. rutas y clientes;
2. préstamos/calendario;
3. pagos/ajustes/reversos;
4. visitas/operación de campo;
5. caja/gastos;
6. cierre/aprobación;
7. reportes/exports;
8. settings/backup;
9. suscripciones/billing.

**Salidas:** Módulos funcionales con repositorios fake y tests.  
**Riesgos:** UI adelantada al dominio; alcance excesivo.  
**Dependencias:** Fases 2–5.  
**Criterio de finalización:** Cada vertical cumple AC y no importa infraestructura en dominio.

## Fase 7 — Implementación local

**Objetivo:** Operación Android offline fiable.  
**Entradas:** Puertos y módulos.  
**Actividades:** Adaptadores DB/files/media; transacciones; outbox; migraciones; backup cifrado; performance; permisos GPS/cámara.  
**Salidas:** App local completa con datasets grandes.  
**Riesgos:** DB/cifrado/plataforma; jank.  
**Dependencias:** Fases 3–6.  
**Criterio de finalización:** Todos los flujos aprobados funcionan sin red y sobreviven reinicio.

## Fase 8 — Backend remoto

**Objetivo:** Colaboración multiusuario y autoridad central.  
**Entradas:** Contratos y outbox.  
**Actividades:** Elegir Firebase/API; tenant, rules/authz, sync incremental, media, webhooks, conflictos, observabilidad.  
**Salidas:** Staging remoto y pruebas multiusuario.  
**Riesgos:** Conflictos offline, costos, reglas abiertas, vendor lock-in.  
**Dependencias:** Local estable y ADR backend.  
**Criterio de finalización:** Admin+cobrador comparten datos autorizados en dos dispositivos sin duplicación.

## Fase 9 — Migración de datos

**Objetivo:** Importar datos reales de forma auditable.  
**Entradas:** Backups/snapshots, validador, mapeos.  
**Actividades:** Copia inmutable, dry run, resolver ambiguos, importar, media, conciliar, firmar resultados, rollback.  
**Salidas:** Reporte por registro y dataset migrado.  
**Riesgos:** Sin propietario, caja divergente, paths rotos, históricos incompletos.  
**Dependencias:** Modelos local/remoto finalizados.  
**Criterio de finalización:** Totales conciliados, rechazados aprobados y rollback probado.

## Fase 10 — Pruebas de aceptación

**Objetivo:** Verificar producto, seguridad y operación.  
**Entradas:** AC aprobados y staging.  
**Actividades:** Unit/widget/integration/E2E; offline; carga; accesibilidad; security/rules; backup/restore; release smoke.  
**Salidas:** Evidencia y defect log.  
**Riesgos:** Datos no representativos; omitir operación de campo.  
**Dependencias:** Fases 6–9.  
**Criterio de finalización:** P0/P1 100 %, riesgos residuales aceptados y 0 críticos.

## Fase 11 — Validación con cliente

**Objetivo:** Confirmar que el sistema refleja operación real.  
**Entradas:** Staging, datos migrados y reportes.  
**Actividades:** UAT admin/cobrador; ejecutar jornada y cierre; validar saldos/KPIs/copy; training.  
**Salidas:** Acta UAT, cambios y aprobación.  
**Riesgos:** Descubrir reglas tardías; resistencia de usuario.  
**Dependencias:** Fase 10.  
**Criterio de finalización:** Stakeholders firman escenarios críticos y migración.

## Fase 12 — Despliegue progresivo

**Objetivo:** Lanzar con riesgo controlado.  
**Entradas:** Release firmada, runbooks, rollback.  
**Actividades:** Piloto por empresa/ruta; feature flags; monitoreo; soporte; ampliación gradual; retirar legacy.  
**Salidas:** Producción estable y plan de decommission.  
**Riesgos:** Divergencia de datos durante coexistencia; fallos externos.  
**Dependencias:** Fase 11, observabilidad y soporte.  
**Criterio de finalización:** Cohortes estables, reconciliación correcta, rollback innecesario y legacy archivado.

## Hitos

| Hito | Alcance |
|---|---|
| H0 | Requisitos/ADR aprobados |
| H1 | App base + auth/membresía |
| H2 | Cartera local completa |
| H3 | Jornada/cierre/reportes locales |
| H4 | Multiusuario staging |
| H5 | Datos migrados/UAT |
| H6 | Piloto producción |

## Estrategia de coexistencia

- no escribir simultáneamente en legacy y nuevo sin reconciliación;
- import inicial + ventana de freeze o sync bridge explícito;
- conservar snapshots legacy;
- feature flag por empresa;
- rollback conserva IDs de mapeo;
- no publicar billing real antes de webhook/entitlement.

## Orden recomendado de reconstrucción

1. Organización/autorización.
2. Rutas/clientes.
3. Préstamos/ledger.
4. Pagos.
5. Visitas.
6. Caja/gastos.
7. Cierre.
8. Reportes.
9. Backup/migración.
10. Sync.
11. Suscripción.
12. Extras: notificaciones/mapa offline/cliente final.

