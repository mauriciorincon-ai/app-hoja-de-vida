import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { getFichasVitrina } from "./loader";
import { parseSimulaciones, type Simulacion } from "./simulaciones";

/**
 * Lee `data/simulaciones.yaml` y lo valida contra el disco (2026-10-12): el
 * build FALLA si una simulación apunta a una app sin export o a un archivo
 * que el paquete no trae.
 */
export const getSimulaciones = cache((): Simulacion[] =>
  parseSimulaciones(
    parse(
      readFileSync(
        path.join(process.cwd(), "data", "simulaciones.yaml"),
        "utf8",
      ),
    ),
    "data/simulaciones.yaml",
    {
      appsConExport: new Set(getFichasVitrina().map((f) => f.ancla.slug)),
      existe: (ruta) => existsSync(path.join(process.cwd(), "public", ruta)),
    },
  ),
);

/** La simulación de esa app, o undefined si no tiene. */
export function getSimulacion(slug: string): Simulacion | undefined {
  return getSimulaciones().find((s) => s.slug === slug);
}
