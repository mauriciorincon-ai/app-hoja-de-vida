#!/usr/bin/env node
/**
 * COPIAR UNA ENTREGA, BYTE A BYTE (S28).
 *
 * Las entregas de las apps (export, capturas, complemento, imágenes) y su contenido v2
 * del brochure no se editan a mano en esta casa: llegan de la planeadora y se COPIAN.
 * Este script es esa copia. Hace tres cosas y ninguna más:
 *
 *   1. copia cada archivo de una carpeta de entrega a su sitio en el repo y exige que
 *      el resultado sea idéntico al origen (comparación de bytes, como `cmp`);
 *   2. borra de `public/vitrina/<slug>/` las imágenes que la entrega ya no trae, para
 *      que una retoma no deje las viejas al lado;
 *   3. con `--contenido <carpeta>`, junta el contenido v2 de la planeadora
 *      (`contenido.json` + `grupos.json` + `traduccion-en.json`) en UN archivo,
 *      `<slug>.contenido.json`, y exige igualdad campo a campo con sus fuentes.
 *      Deja fuera `_lee_esto` (de `contenido.json`) y `gaps` (de `grupos.json`, del que solo
 *      toma `grupos`): son notas de la planeadora, no contrato.
 *
 * Con `--solo-contenido <carpeta>` copia SOLO ese v2, para una app cuya entrega no cambió
 * (el slug sale de su `contenido.json`); sirve con `--casa` también (S30).
 *
 * No interpreta ni corrige el contenido: si algo no cuadra, el gate de contrato lo
 * dice después, con archivo y campo, y se corrige en el origen.
 *
 *   node scripts/copiar-entrega.mjs <carpeta-de-entrega> [--casa] [--contenido <carpeta>]
 *   node scripts/copiar-entrega.mjs --solo-contenido <carpeta> [--casa]
 *
 * `--casa` es para CV Viva y su chat, que no son apps del Portafolio: van a
 * `content/vitrina/casa/` y no entran al loader de las diez (si entraran, el build
 * rompería y la cuenta de apps dejaría de ser diez).
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SLUG = /^[a-z0-9-]+$/;

/** ¿Son idénticos, byte a byte? */
export function sonIguales(a, b) {
  return (
    existsSync(a) &&
    existsSync(b) &&
    Buffer.compare(readFileSync(a), readFileSync(b)) === 0
  );
}

/** Dónde va cada archivo de una entrega, relativo a la raíz del repo. */
export function destinosDe(slug, { casa = false } = {}) {
  if (!SLUG.test(slug)) throw new Error(`slug inválido: «${slug}»`);
  const base = casa
    ? `content/vitrina/casa/${slug}`
    : `content/vitrina/${slug}`;
  return {
    export: `${base}.brochure-export.json`,
    capturas: `${base}.capturas.yaml`,
    complemento: casa ? `${base}.complemento.yaml` : `data/fichas/${slug}.yaml`,
    contenido: `${base}.contenido.json`,
    imagenes: `public/vitrina/${slug}`,
  };
}

/** El contenido v2 de la planeadora, en un solo objeto (sin sus notas). */
export function componerContenido(carpeta) {
  const leer = (n) => JSON.parse(readFileSync(path.join(carpeta, n), "utf8"));
  const tiene = (n) => existsSync(path.join(carpeta, n));
  if (!tiene("contenido.json"))
    throw new Error(`${carpeta}: falta contenido.json`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _lee_esto, ...contenido } = leer("contenido.json");
  const grupos = tiene("grupos.json") ? leer("grupos.json") : undefined;
  const en = tiene("traduccion-en.json")
    ? leer("traduccion-en.json")
    : undefined;
  return {
    compuesto: {
      ...contenido,
      ...(grupos ? { grupos: grupos.grupos } : {}),
      ...(en ? { en } : {}),
    },
    fuentes: { contenido, grupos: grupos?.grupos, en },
  };
}

function origenGit(carpeta) {
  try {
    return execFileSync(
      "git",
      ["-C", carpeta, "log", "-1", "--format=%h", "--", "."],
      {
        encoding: "utf8",
      },
    ).trim();
  } catch {
    return "";
  }
}

/**
 * Junta el contenido v2 de una carpeta de la planeadora y lo escribe en `<slug>.contenido.json`; lanza si lo
 * escrito, leído de vuelta, no es lo que llegó. Devuelve la ruta relativa.
 */
function escribirContenido({ contenido, raiz, casa, slug }) {
  const { compuesto, fuentes } = componerContenido(contenido);
  if (slug !== undefined && compuesto.app !== slug)
    throw new Error(
      `${contenido}: su contenido es de «${compuesto.app}», no de «${slug}»`,
    );
  const d = destinosDe(String(compuesto.app), { casa });
  const destino = path.join(raiz, d.contenido);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, JSON.stringify(compuesto, null, 2) + "\n");
  // Igualdad campo a campo con sus fuentes: lo escrito, leído de vuelta, es lo que llegó.
  const vuelta = JSON.parse(readFileSync(destino, "utf8"));
  const { grupos, en: ingles, ...resto } = vuelta;
  assert.deepStrictEqual(
    resto,
    fuentes.contenido,
    `${d.contenido}: difiere de contenido.json`,
  );
  assert.deepStrictEqual(
    grupos,
    fuentes.grupos,
    `${d.contenido}: difiere de grupos.json`,
  );
  assert.deepStrictEqual(
    ingles,
    fuentes.en,
    `${d.contenido}: difiere de traduccion-en.json`,
  );
  return d.contenido;
}

/**
 * Copia SOLO el contenido v2 de una app cuya entrega no cambió (S30: el v2 de Innmobiliaria, que sumó
 * `enlaces_razon`). Devuelve lo que hizo, con el slug que dice su `contenido.json`.
 * @param {{contenido: string, raiz: string, casa?: boolean}} o
 */
export function copiarContenido({ contenido, raiz, casa = false }) {
  const { compuesto } = componerContenido(contenido);
  const slug = String(compuesto.app);
  return {
    slug,
    origen: origenGit(contenido),
    copiados: [],
    borrados: [],
    contenido: escribirContenido({ contenido, raiz, casa, slug }),
  };
}

/**
 * Copia una entrega. Devuelve lo que hizo; lanza si algo falta, sobra o no queda idéntico.
 * @param {{entrega: string, raiz: string, casa?: boolean, contenido?: string}} o
 */
export function copiarEntrega({ entrega, raiz, casa = false, contenido }) {
  const en = (n) => path.join(entrega, n);
  for (const n of [
    "brochure-export.json",
    "capturas.yaml",
    "complemento.yaml",
    "capturas",
  ])
    if (!existsSync(en(n))) throw new Error(`${entrega}: falta ${n}`);

  const slug = JSON.parse(readFileSync(en("brochure-export.json"), "utf8"))?.app
    ?.slug;
  const d = destinosDe(String(slug), { casa });
  const aqui = (rel) => path.join(raiz, rel);

  const imagenes = readdirSync(en("capturas"));
  const raras = imagenes.filter((f) => !f.endsWith(".webp"));
  if (raras.length > 0)
    throw new Error(
      `${entrega}/capturas: solo .webp; sobra ${raras.join(", ")}`,
    );

  const hecho = {
    slug,
    origen: origenGit(entrega),
    copiados: [],
    borrados: [],
    contenido: null,
  };
  const copiar = (de, rel) => {
    mkdirSync(path.dirname(aqui(rel)), { recursive: true });
    copyFileSync(de, aqui(rel));
    if (!sonIguales(de, aqui(rel)))
      throw new Error(`${rel}: no quedó idéntico a ${de}`);
    hecho.copiados.push(rel);
  };

  copiar(en("brochure-export.json"), d.export);
  copiar(en("capturas.yaml"), d.capturas);
  copiar(en("complemento.yaml"), d.complemento);

  mkdirSync(aqui(d.imagenes), { recursive: true });
  for (const f of readdirSync(aqui(d.imagenes)))
    if (f.endsWith(".webp") && !imagenes.includes(f)) {
      rmSync(path.join(aqui(d.imagenes), f));
      hecho.borrados.push(`${d.imagenes}/${f}`);
    }
  for (const f of imagenes)
    copiar(path.join(en("capturas"), f), `${d.imagenes}/${f}`);

  if (contenido)
    hecho.contenido = escribirContenido({ contenido, raiz, casa, slug });
  return hecho;
}

function main(argv) {
  const args = argv.slice(2);
  const j = args.indexOf("--solo-contenido");
  if (j >= 0) {
    const carpeta = args[j + 1];
    if (!carpeta || carpeta.startsWith("--")) {
      console.error(
        "uso: node scripts/copiar-entrega.mjs --solo-contenido <carpeta> [--casa]",
      );
      process.exit(2);
    }
    const hecho = copiarContenido({
      contenido: path.resolve(carpeta),
      raiz: process.cwd(),
      casa: args.includes("--casa"),
    });
    console.log(
      `✓ ${hecho.slug} · origen ${hecho.origen || "(sin git)"} · ${hecho.contenido} (sin _lee_esto ni gaps)`,
    );
    return;
  }
  const entrega = args.find(
    (a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--contenido",
  );
  const i = args.indexOf("--contenido");
  const contenido = i >= 0 ? path.resolve(args[i + 1] ?? "") : undefined;
  if (!entrega) {
    console.error(
      "uso: node scripts/copiar-entrega.mjs <carpeta-de-entrega> [--casa] [--contenido <carpeta>]",
    );
    process.exit(2);
  }
  const hecho = copiarEntrega({
    entrega: path.resolve(entrega),
    raiz: process.cwd(),
    casa: args.includes("--casa"),
    contenido,
  });
  console.log(
    `✓ ${hecho.slug} · origen ${hecho.origen || "(sin git)"} · ${hecho.copiados.length} archivos idénticos (cmp)` +
      ` · ${hecho.borrados.length} imágenes retiradas` +
      (hecho.contenido ? ` · ${hecho.contenido} (sin _lee_esto ni gaps)` : ""),
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main(process.argv);
