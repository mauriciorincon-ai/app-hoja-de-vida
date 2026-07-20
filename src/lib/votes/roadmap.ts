import "server-only";
import { getApps } from "@/lib/content";
import type { AppCard, RoadmapFeature } from "@/lib/schemas";

/**
 * Utilidades del roadmap votable (S4), derivadas del contenido (`apps.yaml`).
 * Fuente única de verdad de "qué (app, feature) es votable" — el route handler
 * valida contra esto antes de tocar la BD, así un voto por una feature que no
 * existe se rechaza en el borde (no llega a Postgres).
 */

export type AppConRoadmap = AppCard & { roadmap: RoadmapFeature[] };

/** Apps que tienen al menos una feature votable, en orden del YAML. */
export function appsConRoadmap(): AppConRoadmap[] {
  return getApps().apps.filter(
    (app): app is AppConRoadmap => app.roadmap.length > 0,
  );
}

/** ¿Existe ese par (app, feature) en el roadmap? (validación de borde). */
export function esFeatureValida(app: string, feature: string): boolean {
  const found = getApps().apps.find((a) => a.id === app);
  return found?.roadmap.some((f) => f.id === feature) ?? false;
}

/** Todos los pares (app, feature) votables — útil para tests y para el índice. */
export function paresVotables(): Array<{ app: string; feature: string }> {
  return appsConRoadmap().flatMap((app) =>
    app.roadmap.map((f) => ({ app: app.id, feature: f.id })),
  );
}
