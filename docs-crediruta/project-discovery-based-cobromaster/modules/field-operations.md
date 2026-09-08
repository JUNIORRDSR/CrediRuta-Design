# Módulo: operación de campo

## Propósito y actores

Ayudar al cobrador a recorrer clientes, ordenar visitas, abrir mapas, llamar/WhatsApp y registrar visitado/no pagó. Actor: cobrador; administrador puede entrar a parte del flujo.

## AS-IS

PanelRutas muestra clientes y acciones de cobro, no pagó, contacto y navegación. `RouteState` guarda IDs visitados/no pagó en sets de memoria sin fecha, actor, motivo ni persistencia. El mapa calcula un orden nearest-neighbor; la lista también admite orden manual, por lo que numeración/recorrido pueden divergir.

Modo carretera obtiene GPS y consulta OSRM/tiles online. Si faltan coordenadas o falla GPS, algunos flujos usan Medellín/promedios sintéticos y pueden guardarlos como ubicación real. Las llamadas OSRM incluyen coordenadas exactas en URL. WhatsApp normaliza números colombianos y prellena saldo del primer préstamo activo. Los gates de ruta/cierre del panel no protegen todas las entradas alternativas.

**Clasificación:** A para contacto y llamadas técnicas; C/D/E para estado de visita, orden, privacidad y fallbacks sintéticos.

## INTENCIÓN INFERIDA

Operar una jornada offline-first, con ruta priorizada y evidencia de cada visita; usar red/GPS cuando estén disponibles sin corromper datos.

## TO-BE PROPUESTO

- Entidad Visita con ruta, cliente, jornada, resultado tipado, fecha, actor, nota y evidencia opcional.
- Un orden canónico por jornada; separar sugerencia optimizada de orden confirmado.
- Estado explícito de permiso/GPS/red; fallback solo visual, nunca persistido como ubicación capturada.
- Adaptadores Map/Routing/Contact con consentimiento y política de minimización.
- Cache/offline definido y gates de aplicación, no solo pantalla.

## Trazabilidad

| Aspecto | Referencia |
|---|---|
| Reglas | BR-ROUTES-010/011, BR-PAYMENTS-005, BR-GEO-001…003, BR-NAV-001 |
| Flujos | UF-VISIT-001, UF-MAP-001, UF-PAY-001 |
| Datos | Cliente/coordenadas, Ruta, sets visitados, Pago |
| Pantallas | panel de rutas, modo carretera, ordenar clientes, cartulina |
| Integraciones | Geolocator, flutter_map/OSM, OSRM, url_launcher/WhatsApp/teléfono |
| Evidencia | `route_state.dart:102-173`; `core/ruta_orden.dart`; `panel_rutas_screen.dart:401-545`; `modo_carretera_screen.dart:59-83`; `core/contacto.dart` |
| Pruebas | no hay pruebas de GPS/red/permisos/orden de jornada |

Resolver Q-I08, Q-I10 y Q-D04. Preservar mapa/contacto como capacidad, condicionado a privacidad y operación offline reales.
