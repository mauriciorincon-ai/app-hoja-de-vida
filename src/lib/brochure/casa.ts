import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { sinVitrinaDe } from "../../../scripts/sin-vitrina.mjs";
import { getApps } from "@/lib/content";
import {
  capturasSchema,
  idsDeFuncionalidades,
  problemasDeCapturas,
  type Capturas,
} from "@/lib/vitrina/capturas";
import {
  complementoSchema,
  type Complemento,
} from "@/lib/vitrina/ficha-tecnica/schema";
import {
  brochureExportSchema,
  versionCompatible,
  type BrochureExport,
} from "@/lib/vitrina/schemas";
import { SLUGS_CASA } from "./config";

/**
 * LAS DOS DE LA CASA: CV Viva y su chat (S28).
 *
 * Son brochures como los de las diez apps, pero no son apps del Portafolio: no tienen
 * categoría (`repartirApps` rompe un export sin ella), su complemento no vive en
 * `data/fichas/` (`ficha-tecnica-contrato` exige que sean exactamente los de los
 * exports) y su cuenta no puede sumarse a las diez. Por eso llegan a
 * `content/vitrina/casa/<slug>.{brochure-export.json, capturas.yaml, complemento.yaml}`,
 * con sus imágenes en `public/vitrina/<slug>/`, y este lector es el único que las ve.
 *
 * Reusa los MISMOS esquemas y la misma lectura con alias que el loader de las apps
 * («vitrina» se lee «portafolio»), y es igual de fail-safe: un archivo malformado, una
 * captura que falta o una funcionalidad que el export no tiene rompen el build nombrando
 * el archivo y el campo. El nombre bilingüe sale de `data/apps.yaml`: el export de la casa
 * solo lo trae en español.
 */

const DIR = path.join(process.cwd(), "content", "vitrina", "casa");
const PUBLICO = path.join(process.cwd(), "public", "vitrina");

export type PiezaDeCasa = {
  slug: (typeof SLUGS_CASA)[number];
  /** El nombre oficial en los dos idiomas, de `data/apps.yaml`. */
  nombre: { es: string; en: string };
  export: BrochureExport;
  capturas: Capturas;
  complemento: Complemento;
};

const lineas = (issues: { path: PropertyKey[]; message: string }[]) =>
  issues
    .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
    .join("\n");

function leer(archivo: string): string {
  if (!existsSync(archivo))
    throw new Error(
      `Falta ${path.relative(process.cwd(), archivo)}: la casa no se publica sin su entrega.`,
    );
  return readFileSync(archivo, "utf8");
}

function leerPieza(slug: PiezaDeCasa["slug"]): PiezaDeCasa {
  const rel = (sufijo: string) => `content/vitrina/casa/${slug}.${sufijo}`;
  const en = (sufijo: string) => path.join(DIR, `${slug}.${sufijo}`);

  const e = brochureExportSchema.safeParse(
    JSON.parse(leer(en("brochure-export.json"))),
  );
  if (!e.success)
    throw new Error(
      `Export inválido en ${rel("brochure-export.json")}:\n${lineas(e.error.issues)}`,
    );
  if (!versionCompatible(e.data.schema_version))
    throw new Error(
      `${rel("brochure-export.json")}: schema_version ${e.data.schema_version} no es el mayor 1.x.x`,
    );
  if (e.data.app.slug !== slug)
    throw new Error(
      `${rel("brochure-export.json")}: app.slug «${e.data.app.slug}» no es «${slug}»`,
    );

  const c = capturasSchema.safeParse(parse(leer(en("capturas.yaml"))));
  if (!c.success)
    throw new Error(
      `Tabla de capturas inválida en ${rel("capturas.yaml")}:\n${lineas(c.error.issues)}`,
    );
  const problemas = problemasDeCapturas(
    c.data,
    idsDeFuncionalidades(e.data.funcionalidades.grupos),
    (a) => existsSync(path.join(PUBLICO, slug, a)),
  );
  if (problemas.length)
    throw new Error(
      `${rel("capturas.yaml")}:\n${problemas.map((p) => `  - ${p}`).join("\n")}`,
    );

  const k = complementoSchema.safeParse(parse(leer(en("complemento.yaml"))));
  if (!k.success)
    throw new Error(
      `Complemento inválido en ${rel("complemento.yaml")}:\n${lineas(k.error.issues)}`,
    );
  if (k.data.app !== slug)
    throw new Error(
      `${rel("complemento.yaml")}: app «${k.data.app}» no es «${slug}»`,
    );

  const nombre = getApps().apps.find((a) => a.id === slug)?.nombre;
  if (!nombre)
    throw new Error(
      `data/apps.yaml: falta «${slug}» (su nombre en español e inglés)`,
    );

  return {
    slug,
    nombre,
    export: sinVitrinaDe(slug, e.data),
    capturas: sinVitrinaDe(slug, c.data),
    complemento: sinVitrinaDe(slug, k.data),
  };
}

/** Las dos de la casa, validadas. Nunca entran a `getFichasVitrina`: la cuenta de apps sigue en diez. */
export const getCasa = cache((): PiezaDeCasa[] => SLUGS_CASA.map(leerPieza));

export function getPiezaDeCasa(slug: string): PiezaDeCasa | undefined {
  return getCasa().find((p) => p.slug === slug);
}
