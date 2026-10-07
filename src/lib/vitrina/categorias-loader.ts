import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { parseCategoriasApps, type CategoriasApps } from "./categorias-apps";

/**
 * Lee `data/categorias-apps.yaml` (Sprint 009). Vive aparte de `lib/content.ts`
 * porque el loader de la vitrina lo necesita para aplicar el nombre oficial y
 * `content.ts` ya importa a ese loader: juntos serían un ciclo.
 */
export const getCategoriasApps = cache((): CategoriasApps =>
  parseCategoriasApps(
    parse(
      readFileSync(
        path.join(process.cwd(), "data", "categorias-apps.yaml"),
        "utf8",
      ),
    ),
    "data/categorias-apps.yaml",
  ),
);
