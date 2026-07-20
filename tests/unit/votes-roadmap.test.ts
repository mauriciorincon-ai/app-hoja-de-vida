import { describe, expect, it } from "vitest";
import {
  appsConRoadmap,
  esFeatureValida,
  paresVotables,
} from "@/lib/votes/roadmap";

/**
 * Deriva de data/apps.yaml real (la fuente de verdad del roadmap votable).
 * Si el contenido cambia, estas cifras cambian con él — es intencional: el
 * test ancla el comportamiento, no un número mágico.
 */

describe("votes/roadmap", () => {
  it("appsConRoadmap devuelve solo apps con features (en orden del YAML)", () => {
    const apps = appsConRoadmap();
    expect(apps.length).toBeGreaterThan(0);
    for (const app of apps) {
      expect(app.roadmap.length).toBeGreaterThan(0);
    }
    // Las apps en-exploracion sin roadmap no aparecen.
    expect(apps.map((a) => a.id)).not.toContain("fabric-analitica-e2e");
  });

  it("esFeatureValida acepta pares reales y rechaza los inexistentes", () => {
    const pares = paresVotables();
    const primero = pares[0];
    expect(esFeatureValida(primero.app, primero.feature)).toBe(true);
    expect(esFeatureValida(primero.app, "feature-que-no-existe")).toBe(false);
    expect(esFeatureValida("app-inexistente", primero.feature)).toBe(false);
  });

  it("paresVotables aplana todas las (app, feature) del roadmap", () => {
    const pares = paresVotables();
    const totalFeatures = appsConRoadmap().reduce(
      (n, a) => n + a.roadmap.length,
      0,
    );
    expect(pares).toHaveLength(totalFeatures);
    // Cada par tiene app y feature no vacíos.
    for (const p of pares) {
      expect(p.app).toBeTruthy();
      expect(p.feature).toBeTruthy();
    }
  });
});
