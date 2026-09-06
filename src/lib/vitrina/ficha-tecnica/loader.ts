import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { getFicha, getFichasVitrina } from "../loader";
import { armarFichaTecnica } from "./armar";
import { complementoSchema, type FichaTecnica } from "./schema";

/**
 * Los complementos viven en `data/fichas/<slug>.yaml`: son contenido de ESTA
 * casa (declarado por CV Viva), no del export — por eso no van en
 * `content/vitrina/`, que no se edita aquí. Fail-safe como todo el contenido:
 * un complemento roto o ausente rompe el build nombrando la app.
 */
const DIR = path.join(process.cwd(), "data", "fichas");

export const getComplemento = cache((slug: string) => {
  const archivo = path.join(DIR, `${slug}.yaml`);
  let raw: unknown;
  try {
    raw = parse(readFileSync(archivo, "utf8"));
  } catch {
    throw new Error(
      `Falta data/fichas/${slug}.yaml: sin complemento no hay ficha técnica para «${slug}» ` +
        `(titular · cifras destacadas · límites · nunca · proceso).`,
    );
  }
  const r = complementoSchema.safeParse(raw);
  if (!r.success) {
    const issues = r.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Complemento inválido en data/fichas/${slug}.yaml:\n${issues}`,
    );
  }
  return r.data;
});

export const getFichaTecnica = cache(
  (slug: string): FichaTecnica | undefined => {
    const ficha = getFicha(slug);
    if (!ficha) return undefined;
    return armarFichaTecnica(ficha, getComplemento(slug));
  },
);

/** Todas, en el orden del escaparate. Falla si a alguna le falta complemento. */
export const getFichasTecnicas = cache((): FichaTecnica[] =>
  getFichasVitrina().map((f) =>
    armarFichaTecnica(f, getComplemento(f.ancla.slug)),
  ),
);
