#!/usr/bin/env node
/**
 * ÍCONOS DEL SITIO — «HR» en la letra de los títulos.
 *
 * El dueño no tiene logo y pidió solo sus iniciales en la letra de la página
 * (2026-09-26): Fraunces Medium, la misma que next/font sirve a los títulos.
 * Hasta ese día la pestaña mostraba el triángulo de Vercel, el favicon que trae
 * la plantilla de create-next-app.
 *
 * La fuente de verdad es `src/app/icon.svg`: las dos letras en TRAZOS, no en
 * texto. Un favicon se pinta aislado de la página y no puede cargar una fuente
 * web: con `<text font-family="Fraunces">` el navegador caería en silencio a
 * Times. Este script toma de ahí el trazo, de `globals.css` los dos colores, y
 * escribe los tres archivos que Next publica solo, sin tocar el layout:
 *
 *   src/app/icon.svg        las letras solas: tinta con tema claro, papel con el oscuro
 *   src/app/favicon.ico     16 · 32 · 48 px sobre una loseta de papel
 *   src/app/apple-icon.png  180 px a sangre (iOS redondea las esquinas)
 *
 * El .ico y el .png llevan loseta porque no saben de qué color es la pestaña, y
 * unas letras de tinta sobre una pestaña oscura desaparecen.
 *
 *   pnpm iconos
 *
 * Cambiar los COLORES es cambiar los tokens y volver a correrlo (el test
 * `tests/unit/iconos.test.ts` avisa si quedaron desfasados). Cambiar las LETRAS
 * es volver a sacar el trazo de la fuente; cómo se hizo está en
 * `sprints/REV-2026-09-26-rotulo-idiomas-icono-bitacora.md`.
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(RAIZ, "src/app");

/** Las letras ocupan este tanto del ancho: casi todo en la pestaña, menos con loseta. */
const ANCHO_LETRAS = { solas: 0.95, loseta: 0.8 };
/** Radio de la loseta, en fracción del lado (el del .ico; el de iOS lo pone el sistema). */
const RADIO_LOSETA = 0.18;
const TAMANOS_ICO = [16, 32, 48];
const TAMANO_APPLE = 180;

export function token(css, nombre) {
  const m = css.match(new RegExp(`--color-${nombre}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`globals.css no declara --color-${nombre}`);
  return m[1].toLowerCase();
}

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

function svgSolas(d, bbox, tinta, papel) {
  const c = caja(bbox, ANCHO_LETRAS.solas);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${c.x} ${c.y} ${c.lado} ${c.lado}">
<!-- «HR» en Fraunces Medium, en trazos: un favicon no carga fuentes web. Lo escribe scripts/generate-icons.mjs -->
<style>path{fill:${tinta}}@media (prefers-color-scheme:dark){path{fill:${papel}}}</style>
<path d="${d}"/>
</svg>
`;
}

function svgLoseta(d, bbox, tinta, papel, redondeada) {
  const c = caja(bbox, ANCHO_LETRAS.loseta);
  const rx = redondeada ? Math.round(c.lado * RADIO_LOSETA) : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${c.x} ${c.y} ${c.lado} ${c.lado}">
<rect x="${c.x}" y="${c.y}" width="${c.lado}" height="${c.lado}" rx="${rx}" fill="${papel}"/>
<path d="${d}" fill="${tinta}"/>
</svg>`;
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
  const css = readFileSync(path.join(APP, "globals.css"), "utf8");
  const tinta = token(css, "ink-0");
  const papel = token(css, "paper-0");
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

    writeFileSync(path.join(APP, "icon.svg"), svgSolas(d, bbox, tinta, papel));

    const conLoseta = svgLoseta(d, bbox, tinta, papel, true);
    const pngs = [];
    for (const tamano of TAMANOS_ICO) pngs.push({ tamano, datos: await pintar(conLoseta, tamano) });
    writeFileSync(path.join(APP, "favicon.ico"), empacarIco(pngs));

    const aSangre = svgLoseta(d, bbox, tinta, papel, false);
    writeFileSync(path.join(APP, "apple-icon.png"), await pintar(aSangre, TAMANO_APPLE));
  } finally {
    await navegador.close();
  }
  console.log(`✓ íconos: icon.svg · favicon.ico (${TAMANOS_ICO.join(" · ")}) · apple-icon.png (${TAMANO_APPLE})`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
