import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { parsePieza, type PiezaMetodo } from "./schema";

/**
 * Las infografías de «Mi método» (S10): un archivo por pieza en
 * `data/metodo/<slug>.yaml`, validado contra el esquema Y contra el disco. El
 * build FALLA, nombrando archivo y campo, si una pieza está malformada, si el
 * nombre del archivo no es su slug, si dos piezas comparten tema (`id`) o si
 * una afirmación de «lo que hice» cita un documento que no existe en
 * `data/a-fondo/` (la experiencia sale del corpus, no se inventa).
 *
 * Misma convención que `piezas.ts`: `cache()` de React memoiza por render, así
 * que en producción hay además un memo de módulo (cada página del build volvía
 * a leer y validar todas las piezas); en desarrollo no, para que editar un
 * YAML y refrescar enseñe el cambio.
 */

const SUFIJO = ".yaml";
const MEMORIZAR = process.env.NODE_ENV === "production";
let memo: PiezaMetodo[] | undefined;

/** Los slugs de los documentos del corpus a fondo (el `.es.md` marca que existe). */
function slugsDelCorpus(raiz: string): Set<string> {
  const dir = path.join(raiz, "data", "a-fondo");
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter((f) => f.endsWith(".es.md"))
      .map((f) => f.slice(0, -".es.md".length)),
  );
}

/**
 * Lee y valida todas las piezas de una raíz. Exportada (con `raiz`) para poder
 * ejercer los rojos contra carpetas de prueba sin tocar `data/metodo/` real.
 * `[]` si la carpeta no existe: la sección que empieza no es un repo roto.
 */
export function leerPiezasDeDisco(raiz: string = process.cwd()): PiezaMetodo[] {
  const dir = path.join(raiz, "data", "metodo");
  if (!existsSync(dir)) return [];
  const corpus = slugsDelCorpus(raiz);

  const piezas = readdirSync(dir)
    .filter((f) => f.endsWith(SUFIJO))
    .sort()
    .map((archivo) => {
      const fuente = `data/metodo/${archivo}`;
      const pieza = parsePieza(
        parse(readFileSync(path.join(dir, archivo), "utf8")) as unknown,
        fuente,
        { corpus },
      );
      if (`${pieza.slug}${SUFIJO}` !== archivo)
        throw new Error(
          `Contenido inválido en ${fuente}:\n  - slug: el archivo se llama «${archivo}» y el slug es «${pieza.slug}»; deben coincidir (la ruta sale del slug)`,
        );
      return pieza;
    });

  const dueño = new Map<string, string>();
  for (const p of piezas) {
    const otro = dueño.get(p.id);
    if (otro)
      throw new Error(
        `Contenido inválido en data/metodo/:\n  - id: «${p.id}» lo declaran dos piezas (${otro} y ${p.slug}); cada tema es una sola infografía`,
      );
    dueño.set(p.id, p.slug);
  }

  // El orden de la lista es el de los temas (T1…T9), no el de construcción.
  return piezas.sort((a, b) => a.id.localeCompare(b.id));
}

/** Las piezas publicadas, validadas y en el orden de sus temas. */
export const getPiezasMetodo = cache((): PiezaMetodo[] => {
  if (MEMORIZAR && memo) return memo;
  const piezas = leerPiezasDeDisco();
  if (MEMORIZAR) memo = piezas;
  return piezas;
});

export function getPiezaMetodo(slug: string): PiezaMetodo | undefined {
  return getPiezasMetodo().find((p) => p.slug === slug);
}
