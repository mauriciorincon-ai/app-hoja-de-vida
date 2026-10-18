import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import type { Mundo } from "./schema";

/**
 * El corpus del que sale «lo que hice» (S11). Vive aparte del cargador a
 * propósito: `loader.ts` es de servidor (`server-only`) y el índice del chat lo
 * arma un script de Node (`scripts/metodo-al-indice.mjs`) ANTES de `next build`;
 * los dos tienen que juzgar el corpus igual, así que comparten este módulo.
 *
 * Un documento cuenta solo si está **aprobado en los dos idiomas**: el a fondo
 * en borrador no se indexa (regla dura 4), así que el chat no podría respaldar
 * una pieza que lo cite, y un hecho sin gemelo en el otro idioma no es un hecho
 * de la pieza bilingüe.
 */

const LOCALES = ["es", "en"] as const;

/** El `estado:` del frontmatter de un documento, o `undefined` si no lo trae. */
function estadoDe(archivo: string): string | undefined {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(archivo, "utf8"));
  if (!m) return undefined;
  const cabecera = parse(m[1]) as { estado?: unknown } | null;
  return typeof cabecera?.estado === "string" ? cabecera.estado : undefined;
}

/**
 * Los documentos de `data/a-fondo/` de una raíz: `corpus` son los aprobados en
 * ES y EN; `motivos` dice, de cada uno que existe pero no entra, por qué (para
 * que el error nombre el problema real y no solo «no existe»).
 */
export function mundoDelCorpus(raiz: string = process.cwd()): Required<Mundo> {
  const dir = path.join(raiz, "data", "a-fondo");
  const corpus = new Set<string>();
  const motivos = new Map<string, string>();
  if (!existsSync(dir)) return { corpus, motivos };

  const slugs = new Set(
    readdirSync(dir)
      .filter((f) => /\.(es|en)\.md$/.test(f))
      .map((f) => f.replace(/\.(es|en)\.md$/, "")),
  );
  for (const slug of slugs) {
    const problemas: string[] = [];
    for (const locale of LOCALES) {
      const archivo = path.join(dir, `${slug}.${locale}.md`);
      if (!existsSync(archivo)) {
        problemas.push(`le falta el gemelo ${slug}.${locale}.md`);
        continue;
      }
      const estado = estadoDe(archivo);
      if (estado !== "aprobado")
        problemas.push(
          `${slug}.${locale}.md está en estado «${estado ?? "sin estado"}», no «aprobado»`,
        );
    }
    if (problemas.length === 0) corpus.add(slug);
    else motivos.set(slug, problemas.join("; "));
  }
  return { corpus, motivos };
}
