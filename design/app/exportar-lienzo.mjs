/* Vuelca el lienzo publicado (el artifact) dentro de design/canvas/.

   El artifact guarda TODO su estado editable —los .dc.html y canvas.json— dentro
   de un bloque <script id="appifact-doc"> de la propia página. Este script abre
   esa página, saca el bloque y escribe cada archivo en el repositorio.

   Uso:  node design/app/exportar-lienzo.mjs <pagina.html>
         node design/app/exportar-lienzo.mjs <pagina.html> --verificar

   --verificar no escribe nada: sale con código 1 si el repositorio y la página
   difieren. Sirve para comprobar si alguien guardó cambios en línea.

   Este script NO descarga la página: claude.ai pide sesión. Para obtener el HTML,
   pídele a una sesión de Claude Code que lea el artifact (deja el archivo completo
   en disco y te da la ruta), o abre el enlace y guarda la página desde el navegador. */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SALIDA = join(dirname(fileURLToPath(import.meta.url)), '..', 'canvas');
const PAGINA = 'rediseno-crediruta.html';

const ABRE = '<script type="application/json" id="appifact-doc">';
const CIERRA = '</' + 'script>';

/* El runtime de artifacts envuelve la página en un esqueleto propio: una línea de
   <head> antes y </body></html> al final. La copia del repositorio guarda la página
   tal como se escribió, sin ese envoltorio, para que dos exports seguidos no
   produzcan un diff falso. El doctype de la página real va seguido de un salto de
   línea; el del envoltorio no: eso los distingue. */
function desenvolver(html) {
  if (html.startsWith('<!doctype html>\n')) return html;
  const i = html.indexOf('<body>\n');
  if (i < 0) throw new Error('la página trae un envoltorio que no sé quitar');
  let pagina = html.slice(i + '<body>\n'.length);
  const cola = '</body></html>';
  if (!pagina.endsWith(cola)) return pagina;
  pagina = pagina.slice(0, -cola.length);
  /* La página ya termina en su propio salto de línea tras </html>; el envoltorio
     añade otro antes de su cola. Dejo uno solo. */
  return pagina.endsWith('\n\n') ? pagina.slice(0, -1) : pagina;
}

function extraerDoc(html) {
  const i = html.indexOf(ABRE);
  if (i < 0) throw new Error(`no encontré el bloque ${ABRE} — ¿es la página del lienzo?`);
  const desde = i + ABRE.length;
  const hasta = html.indexOf(CIERRA, desde);
  if (hasta < 0) throw new Error('el bloque appifact-doc está sin cerrar');
  try {
    return JSON.parse(html.slice(desde, hasta));
  } catch (e) {
    throw new Error(`el bloque appifact-doc no es JSON válido: ${e.message}`);
  }
}

/* Los nombres vienen de un documento publicado: no los uso como ruta a ciegas. */
function validarNombre(nombre) {
  if (!/^[\w.-]+$/.test(nombre) || nombre.startsWith('.')) {
    throw new Error(`nombre de archivo rechazado: ${JSON.stringify(nombre)}`);
  }
  return nombre;
}

function leerActual(ruta) {
  try {
    return readFileSync(ruta, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    return null;
  }
}

const [origen, ...banderas] = process.argv.slice(2);
const verificar = banderas.includes('--verificar');

if (!origen) {
  console.error('falta la ruta al HTML del lienzo publicado.');
  console.error('uso: node design/app/exportar-lienzo.mjs <pagina.html> [--verificar]');
  process.exit(2);
}

let html;
try {
  html = readFileSync(origen, 'utf8');
} catch (e) {
  console.error(`no pude leer ${origen}: ${e.message}`);
  process.exit(2);
}

let doc, pagina;
try {
  doc = extraerDoc(html);
  pagina = desenvolver(html);
} catch (e) {
  console.error(e.message);
  process.exit(2);
}

const archivos = doc?.content?.files;
if (!archivos || typeof archivos !== 'object') {
  console.error('el bloque appifact-doc no trae content.files');
  process.exit(2);
}

const salida = new Map([[PAGINA, pagina]]);
for (const [nombre, contenido] of Object.entries(archivos)) {
  salida.set(validarNombre(nombre), contenido);
}

mkdirSync(SALIDA, { recursive: true });

const cambiados = [];
for (const [nombre, contenido] of salida) {
  const ruta = join(SALIDA, nombre);
  if (leerActual(ruta) === contenido) continue;
  cambiados.push(nombre);
  if (!verificar) writeFileSync(ruta, contenido);
}

console.log(`lienzo: ${JSON.stringify(doc.title ?? '(sin título)')} · ${salida.size} archivos`);

if (verificar) {
  if (cambiados.length === 0) {
    console.log('el repositorio está al día con la página.');
    process.exit(0);
  }
  console.error(`${cambiados.length} archivo(s) difieren:`);
  for (const n of cambiados) console.error(`  ${n}`);
  console.error('vuelve a correr el script sin --verificar para actualizarlos.');
  process.exit(1);
}

console.log(
  cambiados.length === 0
    ? 'ya estaba al día, no escribí nada.'
    : `actualicé ${cambiados.length}: ${cambiados.join(', ')}`
);
