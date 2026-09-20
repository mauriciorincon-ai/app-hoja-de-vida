import "server-only";
import type { RoadmapFeature } from "@/lib/schemas";
import { getComplemento } from "@/lib/vitrina/ficha-tecnica/loader";
import { getManifestVitrina } from "@/lib/vitrina/loader";

/**
 * Utilidades del roadmap votable (S4). Fuente única de verdad de "qué (app,
 * feature) es votable" — el route handler valida contra esto antes de tocar la
 * BD, así un voto por una feature que no existe se rechaza en el borde.
 *
 * **Desde 2026-09-13 (decisión del dueño, gate ⭐ post-S8, bloque G)** el
 * roadmap NO sale de `apps.yaml` sino del complemento curado de cada app
 * hermana, `data/fichas/<slug>.yaml` (procedencia cv-viva: lo administra la
 * planeadora y llega por copia). Ninguna feature de CV Viva se muestra, y cada
 * app vota en su propia página (`/vitrina/apps/<slug>`).
 */

export type AppConRoadmap = {
  /** El slug del export: la misma clave que la BD de votos. */
  id: string;
  /** El nombre propio de la app (viene del export, sin traducir). */
  nombre: string;
  roadmap: RoadmapFeature[];
};

/** Apps con al menos una feature votable, en el orden del escaparate. */
export function appsConRoadmap(): AppConRoadmap[] {
  return getManifestVitrina()
    .map((a) => ({
      id: a.slug,
      nombre: a.nombre,
      roadmap: getComplemento(a.slug).roadmap,
    }))
    .filter((a) => a.roadmap.length > 0);
}

/** El roadmap de UNA app; `undefined` si no existe o no tiene features. */
export function roadmapDe(slug: string): AppConRoadmap | undefined {
  return appsConRoadmap().find((a) => a.id === slug);
}

/** ¿Existe ese par (app, feature) en el roadmap? (validación de borde). */
export function esFeatureValida(app: string, feature: string): boolean {
  return roadmapDe(app)?.roadmap.some((f) => f.id === feature) ?? false;
}

/** Todos los pares (app, feature) votables — útil para tests y para el índice. */
export function paresVotables(): Array<{ app: string; feature: string }> {
  return appsConRoadmap().flatMap((app) =>
    app.roadmap.map((f) => ({ app: app.id, feature: f.id })),
  );
}
