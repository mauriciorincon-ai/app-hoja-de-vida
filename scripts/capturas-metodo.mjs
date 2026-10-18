#!/usr/bin/env node
/**
 * CAPTURAS DE UNA INFOGRAFÍA DE «MI MÉTODO» — la evidencia visual de cada pieza.
 *
 * Cada sprint de «Mi método» (S10–S18) entrega una pieza visual de primera
 * línea, y la constitución pide su captura de escritorio y de móvil adjunta al
 * PR antes del merge: evidencia, no parada. Este script las produce siempre
 * igual, contra el sitio ya construido y servido en local:
 *
 *   pnpm build && pnpm exec next start -p 3100 &
 *   node scripts/capturas-metodo.mjs sistema-de-agentes
 *   node scripts/capturas-metodo.mjs sistema-de-agentes --idioma en --puerto 3100 \
 *        --salida sprints/SPRINT_010-capturas
 *
 * Qué deja en la carpeta de salida (por defecto `sprints/capturas-metodo/`):
 *   · `<slug>-<idioma>-escritorio-1280.jpg` y `…-movil-390.jpg` — la pieza ENTERA;
 *   · `<slug>-<idioma>-pliegue-1280.png` y `…-pliegue-390.png` — lo que se ve al abrirla;
 *   · `<slug>-<idioma>-mapa-1280.png` y `…-mapa-390.png` — el bloque 2, el diagrama;
 *   · `<slug>-<idioma>-impresa-a4.pdf` — la impresión, como la daría el navegador (`@media print`, A4);
 *   · `<slug>-<idioma>-impresa-a4-p1.png` … `-p3.png` — sus tres primeras páginas, para verlas
 *     en el PR (solo si `pdftoppm` está en el PATH; sin él queda el PDF y se avisa).
 *
 * Con «reducir movimiento» (`reducedMotion: "reduce"`): el cinturón CSS deja
 * todo en su estado final, así que la captura entera no depende de qué bloque
 * alcanzó a revelarse. Es la misma garantía que le da la página a quien lo pide.
 * La IMPRESIÓN, en cambio, se captura con movimiento normal (sin esa ayuda):
 * es lo que ve quien imprime de verdad.
 *
 * Solo toca `http://localhost:<puerto>`: ninguna URL del sitio publicado (regla
 * 17, cero enlaces), y la pieza se lee de `data/metodo/`, no de un dato escrito
 * aquí. Los datos son los de la página: nada se inventa para la captura.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, renameSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";
import { parse } from "yaml";

const RAIZ = process.cwd();

function argumentos() {
  const a = process.argv.slice(2);
  const slug = a.find((x) => !x.startsWith("--"));
  const valor = (nombre, defecto) => {
    const i = a.indexOf(`--${nombre}`);
    return i >= 0 && a[i + 1] ? a[i + 1] : defecto;
  };
  if (!slug) {
    console.error("Uso: node scripts/capturas-metodo.mjs <slug> [--idioma es|en] [--puerto 3100] [--salida carpeta]");
    process.exit(1);
  }
  return {
    slug,
    idioma: valor("idioma", "es"),
    puerto: valor("puerto", "3100"),
    salida: path.resolve(RAIZ, valor("salida", "sprints/capturas-metodo")),
  };
}

const { slug, idioma, puerto, salida } = argumentos();
if (!existsSync(path.join(RAIZ, "data", "metodo", `${slug}.yaml`))) {
  console.error(`data/metodo/${slug}.yaml no existe: la captura sale de una pieza publicada.`);
  process.exit(1);
}
if (!["es", "en"].includes(idioma)) {
  console.error("--idioma es «es» o «en».");
  process.exit(1);
}
const pieza = parse(readFileSync(path.join(RAIZ, "data", "metodo", `${slug}.yaml`), "utf8"));
const ruta = `http://localhost:${puerto}/${idioma}/metodo/${slug}`;
mkdirSync(salida, { recursive: true });

const base = `${slug}-${idioma}`;
const navegador = await chromium.launch();
try {
  // El sitio tiene que estar servido: una respuesta distinta de 200 no es una captura.
  const sonda = await fetch(ruta).catch(() => null);
  if (!sonda || sonda.status !== 200) {
    console.error(`${ruta} no responde 200 (¿corre «next start -p ${puerto}»?).`);
    process.exit(1);
  }

  for (const [nombre, ancho, alto] of [
    ["escritorio-1280", 1280, 900],
    ["movil-390", 390, 844],
  ]) {
    const contexto = await navegador.newContext({
      viewport: { width: ancho, height: alto },
      reducedMotion: "reduce",
    });
    const p = await contexto.newPage();
    await p.goto(ruta, { waitUntil: "networkidle" });
    await p.waitForTimeout(400);
    const px = nombre.split("-")[1];

    await p.screenshot({ path: path.join(salida, `${base}-pliegue-${px}.png`) });
    await p.locator("#bloque-2").screenshot({ path: path.join(salida, `${base}-mapa-${px}.png`) });
    await p.screenshot({
      path: path.join(salida, `${base}-${nombre}.jpg`),
      fullPage: true,
      type: "jpeg",
      quality: 70,
    });
    await contexto.close();
  }

  // La impresión: la hoja de estilo `@media print`, a A4, con el PDF que daría el navegador.
  // Con movimiento NORMAL, a propósito: quien imprime casi nunca pidió «reducir movimiento»,
  // y con «reduce» el cinturón de esa preferencia ocultaba que los títulos de bloque salían
  // en blanco (el S10 lo halló en la auditoría; ahora lo cubre `@media print` en globals.css).
  const contexto = await navegador.newContext({
    viewport: { width: 794, height: 1123 },
    reducedMotion: "no-preference",
  });
  const p = await contexto.newPage();
  await p.goto(ruta, { waitUntil: "networkidle" });
  await p.emulateMedia({ media: "print" });
  await p.waitForTimeout(300);
  const pdf = path.join(salida, `${base}-impresa-a4.pdf`);
  await p.pdf({ path: pdf, format: "A4", printBackground: true });
  await contexto.close();

  // Las tres primeras páginas como imagen (poppler). Sin él, el PDF basta.
  const r = spawnSync(
    "pdftoppm",
    ["-r", "70", "-f", "1", "-l", "3", "-png", pdf, path.join(salida, `${base}-impresa-a4-p`)],
    { encoding: "utf8" },
  );
  if (r.error || r.status !== 0) {
    console.warn("pdftoppm no está disponible: se deja el PDF sin sus páginas en imagen.");
  } else {
    // poppler numera según el total de páginas («-01.png», «-1.png»): se deja «-p<n>.png».
    for (const n of [1, 2, 3]) {
      const base_ = path.join(salida, `${base}-impresa-a4-p`);
      const hallado = [`${base_}-${String(n).padStart(2, "0")}.png`, `${base_}-${n}.png`].find(existsSync);
      if (hallado) renameSync(hallado, `${base_}${n}.png`);
    }
  }

  console.log(
    `✓ ${pieza.id} · ${pieza.nombre[idioma]} — capturas en ${path.relative(RAIZ, salida)}/ (${base}-*)`,
  );
} finally {
  await navegador.close();
}
