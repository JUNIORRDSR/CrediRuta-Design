# 11. Modelo de datos

## Resumen

| Tipo | Cantidad |
|---|---:|
| Entidades serializables | 8 |
| Agregados JSON sin clase | 1 (Caja) |
| Objeto de configuración | 1 (PlanInfo) |
| Campos serializados en entidades | 73 |
| Campos de Caja | 17 |
| Enums | 6 |
| Colecciones Firestore referenciadas | 3 |

## Modelo AS-IS

~~~mermaid
erDiagram
    USUARIO o|--o{ USUARIO : "administradorId sin FK"
    USUARIO o|--o{ RUTA : "cobradorId sin FK"
    LOCAL_NAMESPACE ||--o{ RUTA : contiene
    RUTA ||--o{ CLIENTE : "clientesPorRuta[rutaId]"
    CLIENTE ||--o{ PRESTAMO : embebe
    PRESTAMO ||--o{ PAGO : embebe
    LOCAL_NAMESPACE ||--|| CAJA : contiene
    CAJA ||--o{ GASTO : embebe
    CAJA ||--o{ INVITACION : embebe
    LOCAL_NAMESPACE ||--o{ CIERRE_HISTORICO : contiene
    USUARIO o|--o{ CIERRE_HISTORICO : cobradorId
    USUARIO }o--|| PLAN : selecciona
~~~

## Relaciones y cardinalidades

- Una Ruta contiene cero o muchos Cliente mediante un mapa externo.
- Cliente no guarda rutaId.
- Un Cliente embebe cero o muchos Prestamo.
- Un Prestamo embebe cero o muchos Pago.
- Caja existe una vez por namespace, no por fecha/ruta/cobrador.
- Gasto e Invitacion solo pertenecen a esa Caja.
- CierreHistorico es una lista por namespace.
- cobradorId y administradorId son strings sin integridad referencial.

## Almacenamiento local

### Blobs con namespace

- data_rutas_v3;
- data_clientes_v3;
- data_caja_v2;
- data_cobradores_v1;
- data_cierres_historicos_v1;
- pref_ultimo_respaldo_v1;
- pref_ultima_sinc_v1;
- backups de corrupción.

### Claves globales

- data_sesion_v1 y data_cuentas_v1, legacy;
- pref_tema_v1;
- flag_legacy_migrado_v1;
- pref_ultima_apertura_v1.

Namespace:

- vacío durante bootstrap/legacy;
- UID para cuenta real;
- demo para demos.

## Modelo remoto

| Colección | Estado | Forma |
|---|---|---|
| usuarios/{uid} | Activa | Usuario completo |
| cupones/{codigo} | Leída por código, bloqueada por reglas | activo, meses |
| datos_usuario/{uid} | Código deshabilitado y bloqueado | tres blobs JSON + timestamp |

No existe modelo multiempresa remoto.

## Diferencias local/remoto/UI/API

| Concepto | Local | Remoto | UI | API propia |
|---|---|---|---|---|
| Usuario | Cobradores ad hoc | Perfil propio | Roles/simulación | No existe |
| Ruta | Entidad completa | No | CRUD/admin/panel | No existe |
| Cliente | Embebido en mapa | No | CRUD/cartulina | No existe |
| Préstamo/Pago | Anidados | No | Mutables | No existe |
| Caja | Blob por UID | No | “del día” | No existe |
| Equipo | Lista local | No modelo | Gestión simulada | No existe |
| Cierre | Lista local/demo | No | Historial prometido | No existe |
| Suscripción | Usuario + fecha de ruta | Perfil parcial | Tres flujos contradictorios | No existe |

## Ciclo de vida

### Usuario

Auth creado → perfil escrito → no verificado → verificado → rol activo.

Variantes defectuosas:

- cuenta Auth sin perfil;
- fallback admin;
- activación/impersonación en memoria;
- administradorId con tres significados.

### Ruta

Creada pendiente/sin fecha → pago simulado → activa/con fecha → manualmente porVencer/vencida.

No hay proceso automático que sincronice enum con fecha.

### Cliente

Creado activo → estados financieros derivados → liquidado. Estado archivado no se usa. esClavo es una marca paralela.

### Préstamo

Creado/importado → pagos/retaques/ajustes → saldo cero. Puede reactivarse por retaque y seguir recibiendo pagos.

### Pago

Solo creación. No edición, reverso, anulación o idempotencia.

### Caja

Creada/cargada → movimientos acumulados → enviada → aprobada → reabierta.

No tiene jornada y no genera CierreHistorico.

### Invitación

Creada → válida → vencida/usada. El uso puede no persistir.

## Estados

### Ruta

prueba, pendiente, activa, porVencer, vencida.

Problema: pagada y soloLectura se derivan de fuentes distintas.

### Cliente

activo, adelantado, atrasado, liquidado, archivado.

Problema: el enum persistido no se usa; UI calcula estados.

### Pago

parcial, exacto, multiple, adicional, retaque, abono.

Problema: retaque no crea Pago; abono se usa sobre todo al importar.

## Dependencias funcionales

- administradorId controla acceso del cobrador, aunque no sea FK confiable;
- cobradorId debería limitar rutas, pero no lo hace;
- fechaVencimiento determina pagada;
- estado determina algunos chips/soloLectura;
- pagos determinan saldo y estados;
- frecuencia/fecha/numCuotas determinan atraso;
- cierreEnviado determina bloqueos parciales;
- flags mostrar* no afectan UI;
- namespace determina aislamiento local.

## Defectos de modelo críticos

1. No existe tenant.
2. Caja no tiene fecha/propietario.
3. Ajustes financieros no tienen eventos.
4. Estados duplicados se contradicen.
5. Relaciones son strings o nesting sin FK.
6. No hay timestamps de auditoría/versiones.
7. IDs por milisegundos.
8. Paths de archivos no portables.
9. Enums por name rompen con renombrados.
10. Blobs completos impiden concurrencia granular.

## Modelo TO-BE recomendado

~~~mermaid
erDiagram
    EMPRESA ||--o{ MEMBRESIA : tiene
    USUARIO ||--o{ MEMBRESIA : participa
    EMPRESA ||--o{ RUTA : posee
    MEMBRESIA o|--o{ RUTA : cobra
    RUTA ||--o{ CLIENTE_RUTA : asigna
    CLIENTE ||--o{ CLIENTE_RUTA : pertenece
    CLIENTE ||--o{ PRESTAMO : recibe
    PRESTAMO ||--o{ MOVIMIENTO_PRESTAMO : registra
    USUARIO ||--o{ MOVIMIENTO_PRESTAMO : ejecuta
    EMPRESA ||--o{ CAJA_DIARIA : controla
    USUARIO ||--o{ CAJA_DIARIA : entrega
    CAJA_DIARIA ||--o{ MOVIMIENTO_CAJA : contiene
    MOVIMIENTO_PRESTAMO o|--o| MOVIMIENTO_CAJA : impacta
    CAJA_DIARIA ||--o{ GASTO : descuenta
    CAJA_DIARIA ||--o{ CIERRE : versiona
    EMPRESA ||--o{ INVITACION : emite
    EMPRESA ||--o{ SUSCRIPCION : contrata
    SUSCRIPCION ||--o{ PAGO_SUSCRIPCION : registra
    CLIENTE ||--o{ ARCHIVO : adjunta
    RUTA ||--o{ ARCHIVO : adjunta
~~~

No todas necesitan una tabla física inmediata. Sí se necesitan identidades y contratos estables.

## Reglas de migración

- conservar JSON original;
- detectar versión;
- mapear registros como válido/reparable/ambiguo/rechazado;
- resolver tenant antes de importar;
- conciliar saldo y caja;
- convertir ajustes acumulados en movimientos de apertura marcados;
- no inventar propietario, actor o fecha;
- validar relaciones y enums;
- copiar medios con checksum;
- usar IDs nuevos y tabla de correspondencia;
- guardar timestamps en UTC y fecha operativa con zona.

