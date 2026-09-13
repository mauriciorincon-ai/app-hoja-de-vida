import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { parseApps } from "@/lib/schemas";
import {
  appsConRoadmap,
  esFeatureValida,
  paresVotables,
} from "@/lib/votes/roadmap";

/**
 * Deriva de data/apps.yaml real (la fuente de verdad del roadmap votable).
 *
 * **2026-09-13 (decisión del dueño, gate ⭐ post-S8, bloque G):** «ninguna
 * feature de CV Viva debe mostrarse en ningún lado». Las siete features que
 * el S4 escribió para las dos apps de esta casa se retiraron; el roadmap
 * votable vuelve por app HERMANA, en la página de cada una, con las features
 * que entregue la planeadora. Hasta entonces `appsConRoadmap()` es vacío y la
 * sección no se monta. El motor sigue probado con un fixture.
 */

const real = parse(readFileSync("data/apps.yaml", "utf8")) as {
  apps: { id: string; roadmap?: unknown[] }[];
};

const FEATURE = {
  id: "feature-demo",
  titulo: { es: "Demo", en: "Demo" },
  descripcion: { es: "Prueba", en: "Test" },
};

describe("votes/roadmap", () => {
  it("ninguna app de esta casa declara roadmap: las features de CV Viva no se muestran (dueño, 2026-09-13)", () => {
    for (const app of real.apps) {
      expect({ id: app.id, roadmap: app.roadmap ?? [] }).toEqual({
        id: app.id,
        roadmap: [],
      });
    }
    expect(appsConRoadmap()).toEqual([]);
    expect(paresVotables()).toEqual([]);
  });

  it("el motor sigue vivo sobre un fixture: solo apps con features, en orden, y pares planos", () => {
    const fixture = parseApps(
      {
        apps: [
          {
            id: "app-sin",
            estado: "en-exploracion",
            nombre: { es: "Sin", en: "None" },
            descripcion: { es: "d", en: "d" },
          },
          {
            id: "app-con",
            estado: "en-exploracion",
            nombre: { es: "Con", en: "With" },
            descripcion: { es: "d", en: "d" },
            roadmap: [FEATURE, { ...FEATURE, id: "otra-feature" }],
          },
        ],
      },
      "fixture",
    );
    const con = fixture.apps.filter((a) => a.roadmap.length > 0);
    expect(con.map((a) => a.id)).toEqual(["app-con"]);
    const pares = con.flatMap((a) =>
      a.roadmap.map((f) => ({ app: a.id, feature: f.id })),
    );
    expect(pares).toEqual([
      { app: "app-con", feature: "feature-demo" },
      { app: "app-con", feature: "otra-feature" },
    ]);
  });

  it("esFeatureValida rechaza cualquier par mientras no haya roadmap", () => {
    expect(esFeatureValida("hoja-de-vida", "mapa-c4")).toBe(false);
    expect(esFeatureValida("app-inexistente", "feature")).toBe(false);
  });
});
