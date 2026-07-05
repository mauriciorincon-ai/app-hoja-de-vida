import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import type { Locale } from "@/i18n/routing";
import { parseApps, parseCv, type Apps, type Cv } from "./schemas";

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
