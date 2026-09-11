import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import type { Locale } from "@/i18n/routing";
import {
  parseApps,
  parseCv,
  parseVitrina,
  type Apps,
  type Cv,
  type Vitrina,
} from "./schemas";
import { getManifestVitrina } from "./vitrina/loader";
import { frentesConPiezas } from "./vitrina/piezas";

/**
 * Carga del contenido versionado en build time (SSG). Si un YAML está
 * malformado, parseCv/parseApps lanzan y el build FALLA — nunca se publica
 * una CV Viva con contenido roto.
 */

const DATA_DIR = path.join(process.cwd(), "data");

function readYaml(fileName: string): unknown {
  const filePath = path.join(DATA_DIR, fileName);
  return parse(readFileSync(filePath, "utf8"));
}

export const getCv = cache((locale: Locale): Cv => {
  const fileName = `cv.${locale}.yaml`;
  return parseCv(readYaml(fileName), `data/${fileName}`);
});

export const getApps = cache((): Apps => {
  return parseApps(readYaml("apps.yaml"), "data/apps.yaml");
});

/**
 * Los frentes de la vitrina (post-S5). Mismo fail-safe: YAML roto = build roto.
 *
 * Y desde el S7, además: un frente solo puede declararse «abierta» si TIENE
 * piezas, y eso se MIDE aquí mismo — «apps» por sus exports en
 * `content/vitrina/`, los demás por sus fichas en `content/<frente>/`. La lista
 * se calcula, nunca se escribe: es la misma regla de «ninguna cifra sin
 * procedencia» aplicada al estado de un frente.
 */
export const getVitrina = cache((): Vitrina => {
  const conPiezas = new Set(frentesConPiezas() as string[]);
  if (getManifestVitrina().length > 0) conPiezas.add("apps");
  return parseVitrina(readYaml("vitrina.yaml"), "data/vitrina.yaml", [
    ...conPiezas,
  ]);
});
