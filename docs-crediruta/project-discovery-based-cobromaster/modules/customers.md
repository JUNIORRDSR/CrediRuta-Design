# Módulo: clientes

## Propósito y actores

Crear, editar, localizar y consultar las personas que reciben préstamos. Actores: administrador y cobrador.

## AS-IS

El alta exige nombre, cédula, teléfono y dirección; la edición relaja validaciones. No hay unicidad ni formato robusto. Cliente no almacena `rutaId`: está contenido dentro de la lista de una Ruta. Si no hay ruta seleccionada, `agregarClienteArutaActual` retorna silenciosamente, pero la UI puede actualizar caja, mostrar éxito y cerrar. Si el monto inicial es positivo con cero cuotas, no se crea préstamo y sí aumenta `prestadoHoy`.

Los agregados de saldo/pagado/capital suman préstamos. El estado se deriva de días/frecuencia, mientras `esClavo`, `estado` y los banners/chips pueden contradecirse. Editar conserva direcciones anteriores, no sincroniza coordenadas y puede dejar fotos huérfanas. Cédula, teléfono, foto y coordenadas son PII local sin cifrar.

**Clasificación:** A para agregados/historial de dirección; C/D para alta, estado e integridad.

## INTENCIÓN INFERIDA

Mantener una ficha única por deudor, su contacto/ubicación, riesgo e historial de cartera dentro de la empresa/ruta.

## TO-BE PROPUESTO

- Cliente con identidad única por empresa y asignaciones de ruta explícitas.
- Validación compartida entre crear/editar/importar y política de duplicados.
- Comando transaccional para alta + préstamo + desembolso.
- Resultado tipado de persistencia; no mostrar éxito ante no-op.
- Consentimiento, cifrado y ciclo de vida de fotos/ubicación.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-CUSTOMERS-001…009, BR-GEO-001/003, BR-ROUTES-009/012 |
| Flujos | UF-CLIENT-001…003, UF-LOAN-001, UF-MAP-001 |
| Datos | Cliente, direccionesAnteriores, Prestamo, coordenadas/foto |
| Pantallas | gestión, nuevo/editar cliente, cartulina |
| Evidencia | `models/cliente.dart`; `nuevo_cliente_screen.dart:132-340`; `editar_cliente_screen.dart:96-204`; `route_state.dart:152-209` |
| Pruebas | `cliente_test.dart`; falta widget/integración de formularios |

Resolver Q-I01, Q-I02, Q-I07 y Q-I11. Conservar ficha/cartulina e historial útil; rediseñar identidad, estado, validación y media.
