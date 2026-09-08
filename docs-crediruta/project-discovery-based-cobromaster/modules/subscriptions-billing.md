# Módulo: suscripciones y facturación

## Propósito y actores

Cobrar el acceso al producto o la vigencia de rutas. Actores: administrador, plataforma de pago y, potencialmente, backend de entitlements.

## AS-IS

Coexisten dos conceptos: Plan Ya ilimitado por COP 20.000 y pagos por ruta con plazos de 1/3/6/12 meses (20k/54k/96k/200k). El registro y la pantalla Wompi simulan éxito/rechazo con estado local y esperas. Mensualidades muestra configuración y una prueba activa, pero sus campos no gobiernan el producto. `Ruta` sí almacena estado/vencimiento y `registrarPagoRuta` suma meses calendario. El cupón consulta Firestore, pero las reglas versionadas deniegan cualquier colección distinta de `usuarios`.

No existe validación de webhook, recibo, transacción, idempotencia, entitlement remoto ni guard que haga cumplir la suscripción del usuario. El reloj local decide vencimientos.

**Clasificación:** A para precios/renovación local observables; B/C/D/F para el modelo comercial y la integración.

## INTENCIÓN INFERIDA

Monetizar la operación mediante un plan general o una licencia recurrente por ruta y permitir descuentos/promociones.

## TO-BE PROPUESTO

- Elegir unidad facturable: empresa, usuario, ruta o tier híbrido.
- Backend autoritativo para checkout, webhook firmado, pago e entitlement.
- Estado explícito `pending/active/past_due/canceled/grace` y auditoría.
- Adaptador de proveedor; UI nunca activa acceso por un boolean local.
- Política de reloj/zonas y gracia controlada por servidor.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-SUB-001…005, BR-ROUTES-005/006/008, BR-AUTH-006/013 |
| Flujos | UF-SUB-001, UF-SUB-002, UF-ROUTE-001 |
| Pantallas | mensualidades, bloqueo de pago, simulador Wompi, registro admin |
| Datos | PlanInfo, campos de Usuario, estado/fecha de Ruta, cupón |
| Evidencia | `models/plan.dart`; `models/ruta.dart`; `route_state.dart:270-309`; `pantalla_bloqueo_pago.dart`; `wompi_simulador_screen.dart`; `firestore.rules:10-14` |
| Pruebas | `cupones_test.dart`; no hay prueba de pago real |

Resolver Q-B08, Q-B09 y Q-B03. No migrar el simulador como lógica productiva; puede sobrevivir únicamente como fake de pruebas/desarrollo.
