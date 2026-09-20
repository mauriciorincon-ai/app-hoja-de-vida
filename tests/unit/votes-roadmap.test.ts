import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
  appsConRoadmap,
  esFeatureValida,
  paresVotables,
  roadmapDe,
} from "@/lib/votes/roadmap";

/**
 * El roadmap votable deriva del complemento curado de cada app hermana
 * (`data/fichas/<slug>.yaml`, procedencia cv-viva, administrado por la
 * planeadora) — desde 2026-09-13, por decisión del dueño: ninguna feature de
 * CV Viva se muestra, y cada app vota en su propia página. Estas pruebas anclan
 * el comportamiento contra los archivos reales, no un número mágico.
 */

type Complemento = { app: string; roadmap?: { id: string }[] };
const reales = readdirSync("data/fichas")
  .filter((f) => f.endsWith(".yaml"))
  .map((f) => parse(readFileSync(`data/fichas/${f}`, "utf8")) as Complemento);
const conRoadmap = reales.filter((c) => (c.roadmap ?? []).length > 0);

describe("votes/roadmap (por app hermana)", () => {
  it("appsConRoadmap devuelve las apps con features, en el orden del escaparate", () => {
    const apps = appsConRoadmap();
    expect(apps.map((a) => a.id).sort()).toEqual(
      conRoadmap.map((c) => c.app).sort(),
    );
    for (const app of apps) {
      expect(app.roadmap.length).toBeGreaterThan(0);
      expect(app.nombre.length).toBeGreaterThan(0);
    }
  });

  it("roadmapDe da el roadmap de UNA app, y undefined si no lo tiene o no existe", () => {
    const primera = conRoadmap[0];
    expect(roadmapDe(primera.app)?.roadmap.map((f) => f.id)).toEqual(
      primera.roadmap?.map((f) => f.id),
    );
    expect(roadmapDe("app-inexistente")).toBeUndefined();
  });

  it("esFeatureValida acepta pares reales y rechaza los inexistentes", () => {
    const pares = paresVotables();
    const primero = pares[0];
    expect(esFeatureValida(primero.app, primero.feature)).toBe(true);
    expect(esFeatureValida(primero.app, "feature-que-no-existe")).toBe(false);
    expect(esFeatureValida("app-inexistente", primero.feature)).toBe(false);
    // Las features de CV Viva ya no existen en ningún lado.
    expect(esFeatureValida("hoja-de-vida", "mapa-c4")).toBe(false);
  });

  it("paresVotables aplana todas las (app, feature) de los complementos", () => {
    const total = conRoadmap.reduce((n, c) => n + (c.roadmap?.length ?? 0), 0);
    expect(paresVotables()).toHaveLength(total);
  });
});
