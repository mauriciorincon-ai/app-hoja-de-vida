import "server-only";
import { getApps } from "@/lib/content";
import type { AppCard, Brochure } from "@/lib/schemas";

/**
 * Utilidades de las brochures por app (S4, ADR-012), derivadas del contenido
 * (`apps.yaml`). La presencia de `brochure` en una app da de alta su página
 * /[locale]/apps/<id>; fuente única de "qué app tiene brochure".
 */

export type AppConBrochure = AppCard & { brochure: Brochure };

/** Apps con brochure (funcionalidad real), en orden del YAML. */
export function appsConBrochure(): AppConBrochure[] {
  return getApps().apps.filter(
    (app): app is AppConBrochure => app.brochure !== undefined,
  );
}

/** La app con brochure para ese slug, o undefined si no existe/ no tiene. */
export function getBrochureApp(slug: string): AppConBrochure | undefined {
  return appsConBrochure().find((app) => app.id === slug);
}
