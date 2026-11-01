import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import {
  parseConfigBrochure,
  type ConfigBrochure,
  type ConfigDeApp,
} from "./config";

/** Lee `data/brochure.yaml` (S28). */
export const getConfigBrochure = cache((): ConfigBrochure =>
  parseConfigBrochure(
    parse(
      readFileSync(path.join(process.cwd(), "data", "brochure.yaml"), "utf8"),
    ),
    "data/brochure.yaml",
  ),
);

/** La configuración de una app; rompe el build si falta (una app nueva se configura el día que llega). */
export function getConfigDeApp(slug: string): ConfigDeApp {
  const c = getConfigBrochure().apps[slug];
  if (!c)
    throw new Error(
      `data/brochure.yaml: falta «${slug}» (acento y datos_sinteticos)`,
    );
  return c;
}
