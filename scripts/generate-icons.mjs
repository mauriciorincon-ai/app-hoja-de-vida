#!/usr/bin/env node
/**
 * ÍCONOS DEL SITIO — «HR» blanco sobre el navy del PDF (la opción A).
 *
 * Hasta el 2026-09-26 la pestaña mostraba el triángulo de Vercel, el favicon
 * que trae la plantilla de create-next-app. Ese día se le mostraron al dueño
 * tres opciones y él quería la A: «HR» en Helvetica Bold, blanco, sobre una
 * loseta redondeada del mismo navy y la misma letra del bloque del dominio en
 * el PDF. Así el sitio y el PDF llevan la misma marca. (Un primer corte, el
 * mismo día, salió con las letras solas en Fraunces: se leyó mal el pedido.)
 *
 * La fuente de verdad del TRAZO es `src/app/icon.svg`: las dos letras en
 * trazos, no en texto. Un favicon se pinta aislado de la página y no puede
 * depender de las fuentes de quien lo mira: en Windows no hay Helvetica. Los
 * COLORES salen de `scripts/generate-cv-pdf.mjs` (`NAVY`, y el blanco del
 * bloque del dominio), así que el ícono y el PDF no pueden separarse. Este
 * script escribe los tres archivos que Next publica solo, sin tocar el layout:
 *
 *   src/app/icon.svg        la loseta redondeada, en vector (la pestaña de hoy)
 *   src/app/favicon.ico     la misma loseta a 16 · 32 · 48 px
 *   src/app/apple-icon.png  180 px a sangre (iOS redondea las esquinas)
 *   src/lib/marca-hr.ts     la misma loseta como datos, para el botón de inicio
 *                           del encabezado (src/components/marca-hr.tsx)
 *
 *   pnpm iconos
 *
 * Cambiar el navy del PDF es volver a correrlo (el test
 * `tests/unit/iconos.test.ts` avisa si quedaron desfasados). Cambiar las LETRAS
 * es volver a sacar el trazo de la fuente; cómo se hizo está en
 * `sprints/REV-2026-09-26-404-de-la-raiz-bitacora.md`.
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { NAVY } from "./generate-cv-pdf.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(RAIZ, "src/app");

/** Los colores del bloque del dominio en el PDF: el fondo y la letra. */
export const COLORES = { fondo: NAVY.toLowerCase(), letras: "#ffffff" };
/** Las letras ocupan este tanto del ancho: lo medido en la muestra que eligió el dueño. */
const ANCHO_LETRAS = 0.65;
/** Radio de la loseta, en fracción del lado (96 de 512 en la muestra; el de iOS lo pone el sistema). */
const RADIO_LOSETA = 0.1875;
const TAMANOS_ICO = [16, 32, 48];
const TAMANO_APPLE = 180;

export function trazoDe(svg) {
  const m = svg.match(/<path\b[^>]*\sd="([^"]+)"/);
  if (!m) throw new Error("icon.svg no trae el trazo de las letras (<path d=…>)");
  return m[1];
}

/** Un viewBox cuadrado que centra la caja de las letras y les da `ancho` del lado. */
function caja({ x, y, width, height }, ancho) {
  const lado = width / ancho;
  const r = (n) => Math.round(n * 10) / 10;
  return { x: r(x - (lado - width) / 2), y: r(y - (lado - height) / 2), lado: r(lado) };
}

function svgLoseta(d, bbox, redondeada) {
  const c = caja(bbox, ANCHO_LETRAS);
  const rx = redondeada ? Math.round(c.lado * RADIO_LOSETA) : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${c.x} ${c.y} ${c.lado} ${c.lado}">
<!-- «HR» en Helvetica Bold, en trazos, sobre el navy del PDF. Lo escribe scripts/generate-icons.mjs -->
<rect x="${c.x}" y="${c.y}" width="${c.lado}" height="${c.lado}" rx="${rx}" fill="${COLORES.fondo}"/>
<path d="${d}" fill="${COLORES.letras}"/>
</svg>
`;
}

/**
 * La loseta como datos de TypeScript: el encabezado la pinta en vector con el
 * mismo trazo, la misma caja y los mismos colores que `icon.svg`, sin una
 * segunda copia a mano (2026-09-26, el dueño la quiso también como botón de
 * inicio).
 */
function moduloMarca(d, bbox) {
  const c = caja(bbox, ANCHO_LETRAS);
  return `// La marca HR del encabezado: la misma loseta del ícono de la pestaña.
// La escribe scripts/generate-icons.mjs (\`pnpm iconos\`); no se edita a mano.
export const MARCA_HR = {
  viewBox: "${c.x} ${c.y} ${c.lado} ${c.lado}",
  x: ${c.x},
  y: ${c.y},
  lado: ${c.lado},
  rx: ${Math.round(c.lado * RADIO_LOSETA)},
  fondo: "${COLORES.fondo}",
  letras: "${COLORES.letras}",
  d: "${d}",
} as const;
`;
}

/** ICO con PNG adentro (Windows Vista en adelante y todos los navegadores de hoy). */
export function empacarIco(pngs) {
  const cabecera = Buffer.alloc(6 + 16 * pngs.length);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(pngs.length, 4);
  let desplazamiento = cabecera.length;
  pngs.forEach(({ tamano, datos }, i) => {
    const e = 6 + 16 * i;
    cabecera.writeUInt8(tamano >= 256 ? 0 : tamano, e);
    cabecera.writeUInt8(tamano >= 256 ? 0 : tamano, e + 1);
    cabecera.writeUInt8(0, e + 2);
    cabecera.writeUInt8(0, e + 3);
    cabecera.writeUInt16LE(1, e + 4);
    cabecera.writeUInt16LE(32, e + 6);
    cabecera.writeUInt32LE(datos.length, e + 8);
    cabecera.writeUInt32LE(desplazamiento, e + 12);
    desplazamiento += datos.length;
  });
  return Buffer.concat([cabecera, ...pngs.map((p) => p.datos)]);
}

async function main() {
  const d = trazoDe(readFileSync(path.join(APP, "icon.svg"), "utf8"));

  const navegador = await chromium.launch();
  try {
    const pagina = await navegador.newPage({ deviceScaleFactor: 1 });

    // La caja real de las letras la mide el mismo motor que después las pinta.
    await pagina.setContent(`<svg xmlns="http://www.w3.org/2000/svg"><path id="l" d="${d}"/></svg>`);
    const bbox = await pagina.evaluate(() => {
      const b = document.getElementById("l").getBBox();
      return { x: b.x, y: b.y, width: b.width, height: b.height };
    });

    const pintar = async (svg, tamano) => {
      await pagina.setViewportSize({ width: tamano, height: tamano });
      await pagina.setContent(
        `<style>html,body{margin:0;background:transparent}svg{display:block;width:${tamano}px;height:${tamano}px}</style>${svg}`,
      );
      return pagina.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: tamano, height: tamano } });
    };

    const conLoseta = svgLoseta(d, bbox, true);
    writeFileSync(path.join(APP, "icon.svg"), conLoseta);
    writeFileSync(path.join(RAIZ, "src/lib/marca-hr.ts"), moduloMarca(d, bbox));

    const pngs = [];
    for (const tamano of TAMANOS_ICO) pngs.push({ tamano, datos: await pintar(conLoseta, tamano) });
    writeFileSync(path.join(APP, "favicon.ico"), empacarIco(pngs));

    const aSangre = svgLoseta(d, bbox, false);
    writeFileSync(path.join(APP, "apple-icon.png"), await pintar(aSangre, TAMANO_APPLE));
  } finally {
    await navegador.close();
  }
  console.log(
    `✓ íconos: icon.svg · favicon.ico (${TAMANOS_ICO.join(" · ")}) · apple-icon.png (${TAMANO_APPLE}) · src/lib/marca-hr.ts`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
