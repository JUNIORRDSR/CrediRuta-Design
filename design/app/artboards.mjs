/* Convierte cada fragmento de design/app/pantallas/ en un artboard .dc.html
   autocontenido (base.css + sprite en línea) para el lienzo de diseño.
   Uso:  node design/app/artboards.mjs   */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const P = (...p) => join(here, ...p);
const SALIDA = P('..', 'canvas');

/* pantallas que ya existían antes del rediseño */
const EXISTENTES = {
  'bienvenida': 'Bienvenida',
  'ingresar': 'Ingresar',
  'unirse': 'Unirse',
  'ruta': 'Ruta',
  'clientes': 'Clientes',
  'cartulina': 'Cartulina',
  'nuevo-cliente': 'NuevoCliente',
  'nuevo-prestamo': 'NuevoPrestamo',
  'caja': 'Caja',
  'cierre': 'Cierre',
  'admin-hoy': 'AdminHoy',
  'admin-rutas': 'AdminRutas',
  'admin-cartera': 'AdminCartera',
  'admin-equipo': 'AdminEquipo',
  'admin-cierre': 'AdminCierre',
  'reportes': 'Reportes',
  'invitacion': 'Invitacion'
};

/* pantallas nuevas del rediseño */
const NUEVAS = {
  'crear-negocio': 'CrearNegocio',
  'verificar-correo': 'VerificarCorreo',
  'cuenta-pausada': 'CuentaPausada',
  'reloj-alterado': 'RelojAlterado',
  'modo-carretera': 'ModoCarretera',
  'orden-visita': 'OrdenVisita',
  'editar-cliente': 'EditarCliente',
  'historial-cierres': 'HistorialCierres',
  'ruta-vencida': 'RutaVencida',
  'nueva-ruta': 'NuevaRuta',
  'mensualidad': 'Mensualidad',
  'equipo-vacio': 'EquipoVacio',
  'permisos-cobrador': 'PermisosCobrador',
  'ajustes': 'Ajustes',
  'reporte-detalle': 'ReporteDetalle'
};

/* hojas inferiores: se pintan abiertas sobre el marco */
const HOJAS = {
  'sheet-cobro': 'HojaCobro',
  'sheet-visita': 'HojaVisita',
  'sheet-retaque': 'HojaRetaque',
  'sheet-gasto': 'HojaGasto'
};

/* pantallas que no son una pestaña pero se pintan dentro de una */
const PESTANA_ACTIVA = { rutaVencida: 'ruta', equipoVacio: 'adminEquipo' };

const TABS = {
  cobrador: [
    { id: 'ruta', icon: 'i-route', label: 'Ruta' },
    { id: 'clientes', icon: 'i-users', label: 'Clientes' },
    { id: 'caja', icon: 'i-wallet', label: 'Caja' }
  ],
  admin: [
    { id: 'adminHoy', icon: 'i-grid', label: 'Hoy' },
    { id: 'adminRutas', icon: 'i-route', label: 'Rutas' },
    { id: 'adminCartera', icon: 'i-card', label: 'Cartera' },
    { id: 'adminEquipo', icon: 'i-users', label: 'Equipo' }
  ]
};

const base = readFileSync(P('base.css'), 'utf8');
const sprite = readFileSync(P('iconos.html'), 'utf8').trim();

const marco = `
    body{ margin:0; background:var(--white); }
    .phone{ position:relative; width:390px; height:844px; overflow:hidden;
      background:var(--white); display:flex; flex-direction:column; }
    .phone > .screen{ height:100%; }
`;

const marcoBoard = `
    body{ margin:0; background:var(--white); }
    .board{ width:820px; padding:36px 40px 44px; background:var(--white); }
    .board .listrow--static{ padding:12px 16px; }
`;

function envolver(cuerpo, css) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap">
  <style>
${base}${css}  </style>
</helmet>

${cuerpo}
</x-dc>
</body>
</html>
`;
}

function leer(archivo) {
  const ruta = P('pantallas', archivo + '.html');
  if (!existsSync(ruta)) throw new Error('falta pantallas/' + archivo + '.html');
  return readFileSync(ruta, 'utf8').trim();
}

function nav(kind, id) {
  const activa = PESTANA_ACTIVA[id] || id;
  const items = TABS[kind].map((t) =>
    `<button class="nav__item${t.id === activa ? ' is-on' : ''}" type="button">` +
    `<span class="nav__pill"><svg class="i"><use href="#${t.icon}"></use></svg></span>` +
    `<span class="nav__label">${t.label}</span></button>`
  ).join('');
  return `  <div class="nav"><div class="nav__items">${items}</div></div>\n`;
}

function pantalla(archivo) {
  let s = leer(archivo);
  const id = (s.match(/id="([^"]+)"/) || [])[1];
  const kind = (s.match(/data-nav="([^"]+)"/) || [])[1];
  if (!id) throw new Error(archivo + ': sin id');

  s = s.replace(/class="screen(?=["\s])/, 'class="screen is-active');
  const cola = (kind && TABS[kind] ? nav(kind, id) : '') +
    '  <div class="gesture"><i></i></div>\n';
  s = s.replace(/\n<\/section>\s*$/, '\n' + cola + '</section>');

  return envolver(`<div class="phone app">\n${sprite}\n\n${s}\n</div>`, marco);
}

function hoja(archivo) {
  const s = leer(archivo).replace(/class="sheet(?=["\s])/, 'class="sheet is-open');
  return envolver(`<div class="phone app">\n${sprite}\n\n${s}\n</div>`, marco);
}

function board(archivo) {
  return envolver(`${sprite}\n\n${leer(archivo)}`, marcoBoard);
}

mkdirSync(SALIDA, { recursive: true });
let n = 0;
const escribir = (nombre, html) => { writeFileSync(join(SALIDA, nombre + '.dc.html'), html, 'utf8'); n++; };

for (const [a, nom] of Object.entries({ ...EXISTENTES, ...NUEVAS })) escribir(nom, pantalla(a));
for (const [a, nom] of Object.entries(HOJAS)) escribir(nom, hoja(a));
escribir('Main', board('mapa-cambios'));

console.log('listo: ' + n + ' artboards en ' + SALIDA);
