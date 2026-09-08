/* Ensambla el prototipo en un solo archivo HTML autocontenido.
   Uso:  node design/app/construir.mjs        (desde la raíz del repo) */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const P = (...p) => join(here, ...p);

const ORDEN = [
  'bienvenida', 'ingresar', 'unirse',
  'ruta', 'clientes', 'cartulina', 'nuevo-cliente', 'nuevo-prestamo',
  'caja', 'cierre',
  'admin-hoy', 'admin-rutas', 'admin-cartera', 'admin-equipo', 'admin-cierre',
  'reportes', 'invitacion',
  'crear-negocio', 'verificar-correo', 'cuenta-pausada', 'reloj-alterado',
  'modo-carretera', 'orden-visita', 'editar-cliente', 'historial-cierres', 'ruta-vencida',
  'nueva-ruta', 'mensualidad', 'equipo-vacio', 'permisos-cobrador', 'ajustes', 'reporte-detalle'
];
const HOJAS = ['sheet-cobro', 'sheet-visita', 'sheet-retaque', 'sheet-gasto'];

const leer = (n) => {
  const f = P('pantallas', n + '.html');
  if (!existsSync(f)) { console.warn('  falta: ' + n + '.html'); return ''; }
  return readFileSync(f, 'utf8').trim();
};

const pantallas = ORDEN.map(leer).filter(Boolean).join('\n\n');
const hojas = HOJAS.map(leer).filter(Boolean).join('\n\n');
const base = readFileSync(P('base.css'), 'utf8');
const iconos = readFileSync(P('iconos.html'), 'utf8').trim();
const shell = readFileSync(P('shell.js'), 'utf8');

const chrome = `
  body{ margin:0; background:var(--soft); }
  .stage{ min-height:100vh; display:flex; flex-direction:column; align-items:center;
    justify-content:center; gap:18px; padding:24px 16px 32px;
    font-family:Onest,Roboto,Arial,sans-serif; }
  .phone{ position:relative; width:390px; height:844px; max-width:100%; overflow:hidden;
    background:#fff; border-radius:38px; border:1px solid var(--line);
    box-shadow:0 30px 70px -30px rgba(11,15,20,.45), 0 0 0 9px #12161C; }
  .phone > .screen{ height:100%; }
  .hud{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:center; }
  .hud__lbl{ font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
    color:var(--ink3); margin-right:4px; }
  .hud__btn{ height:40px; padding:0 16px; border-radius:999px; border:1px solid var(--line);
    background:#fff; color:var(--ink); font:600 14px/1 Onest,Roboto,Arial,sans-serif;
    cursor:pointer; display:flex; align-items:center; }
  .hud__btn.is-on{ background:var(--ink); border-color:var(--ink); color:#fff; }
  .hud__note{ font-size:13px; color:var(--ink2); text-align:center; max-width:390px; line-height:1.45; }
  @media (max-width:460px){
    .stage{ padding:0; gap:0; justify-content:flex-start; }
    .phone{ width:100%; height:100vh; border-radius:0; border:0; box-shadow:none; }
    .hud{ display:none; }
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]) body{ background:#12161C; }
    :root:not([data-theme="light"]) .hud__btn{ background:#1C2229; border-color:#2A323B; color:#E7EAEE; }
    :root:not([data-theme="light"]) .hud__lbl,
    :root:not([data-theme="light"]) .hud__note{ color:#96A0AC; }
  }
  :root[data-theme="dark"] body{ background:#12161C; }
  :root[data-theme="dark"] .hud__btn{ background:#1C2229; border-color:#2A323B; color:#E7EAEE; }
  :root[data-theme="dark"] .hud__lbl, :root[data-theme="dark"] .hud__note{ color:#96A0AC; }
`;

const html = `<!doctype html>
<html lang="es-CO">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>CrediRuta</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap">
<style>
${base}
${chrome}
</style>
</head>
<body>

<div class="stage">
  <div class="phone app" id="phone">
${iconos}

${pantallas}

${hojas}

    <div class="toast" id="toast"></div>
  </div>

  <div class="hud">
    <span class="hud__lbl">Entrar como</span>
    <button class="hud__btn" data-jump="bienvenida">Inicio</button>
    <button class="hud__btn is-on" data-jump="ruta">Cobrador</button>
    <button class="hud__btn" data-jump="adminHoy">Administrador</button>
  </div>
  <p class="hud__note">Prototipo navegable. Toca las tarjetas, la barra de abajo y los botones:
  las hojas de cobro, los formularios y los selectores responden.</p>
</div>

<script>window.PANTALLA_INICIAL='ruta';</script>
<script>
${shell}
</script>
</body>
</html>
`;

const salida = P('crediruta.html');
writeFileSync(salida, html, 'utf8');
console.log('listo: ' + salida + '  (' + Math.round(html.length / 1024) + ' KB)');
