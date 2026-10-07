import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { getCategoriasApps } from "@/lib/content";
import {
  CATEGORIAS_APPS,
  nombreVisible,
  parseCategoriasApps,
  repartirApps,
} from "@/lib/vitrina/categorias-apps";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * LAS DOS CATEGORÍAS DE LAS APPS (Sprint 009).
 *
 * El gate real es de datos: cada export de `content/vitrina/` tiene categoría.
 * Si una app futura llega sin ella, el build FALLA nombrando su slug — se
 * demuestra aquí con un export sintético, porque con el árbol real ninguna
 * regla anterior puede ponerlo en rojo (regla 14, tercera pregunta: el estado
 * que lo rompe se fabrica en el test, no en el repo).
 */

const ficha = (slug: string) => ({
  ancla: { slug },
  export: { app: { nombre: slug } },
});

const YAML = {
  profesionales: [
    { slug: "ds", nombre: { es: "Probeta DS", en: "Probeta DS" } },
    { slug: "fantasma", nombre: { es: "Fantasma", en: "Ghost" } },
    {
      slug: "velo",
      nombre: { es: "Anonimizador Velo", en: "Velo Anonymizer" },
    },
  ],
  personales: [{ slug: "habla", nombre: { es: "Habla San", en: "Habla San" } }],
};

describe("el YAML real de categorías", () => {
  const categorias = getCategoriasApps();
  const fichas = getFichasVitrina();

  it("todo export de content/vitrina/ tiene categoría (si no, el build falla)", () => {
    expect(() => repartirApps(fichas, categorias)).not.toThrow();
    const reparto = repartirApps(fichas, categorias);
    const repartidas = CATEGORIAS_APPS.flatMap((c) => reparto[c]);
    expect(repartidas).toHaveLength(fichas.length);
    // Y los exports que hay en disco son los mismos que el loader vio.
    const enDisco = readdirSync("content/vitrina").filter((f) =>
      f.endsWith(".brochure-export.json"),
    );
    expect(repartidas).toHaveLength(enDisco.length);
  });

  it("las seis apps de hoy van como pidió el dueño: tres profesionales y tres personales", () => {
    const reparto = repartirApps(fichas, categorias);
    const slugs = (c: "profesionales" | "personales") =>
      reparto[c].map((f) => f.ancla.slug);
    expect(slugs("profesionales")).toEqual([
      "ds",
      "dash-agent-ai",
      "anonimizador",
    ]);
    expect(slugs("personales")).toEqual([
      "habla",
      "inmobiliaria",
      "nutri-kids",
    ]);
  });

  it("AngelGhost se declara UNA sola vez, y las apps sin export (hoy) se ignoran", () => {
    const todos = [...categorias.profesionales, ...categorias.personales].map(
      (e) => e.slug,
    );
    expect(todos.filter((s) => s === "copiloto-consultor")).toHaveLength(1);
    expect(new Set(todos).size).toBe(todos.length);
    const reparto = repartirApps(fichas, categorias);
    const vistos = CATEGORIAS_APPS.flatMap((c) =>
      reparto[c].map((f) => f.ancla.slug),
    );
    for (const sinExport of [
      "copiloto-consultor",
      "planlang",
      "big-d",
      "hackguard",
    ]) {
      expect(todos, `${sinExport} está declarada`).toContain(sinExport);
      expect(vistos, `${sinExport} no tiene export: no aparece`).not.toContain(
        sinExport,
      );
    }
  });

  it("los nombres oficiales salen del YAML, en español y en inglés", () => {
    expect(nombreVisible(categorias, "habla", "Hablemos San", "es")).toBe(
      "Habla San",
    );
    expect(nombreVisible(categorias, "anonimizador", "Velo", "es")).toBe(
      "Anonimizador Velo",
    );
    expect(nombreVisible(categorias, "anonimizador", "Velo", "en")).toBe(
      "Velo Anonymizer",
    );
    expect(nombreVisible(categorias, "nutri-kids", "Nutri-Kids", "en")).toBe(
      "Nutrikids",
    );
  });

  it("el alias vive solo en el YAML: el export conserva su nombre", () => {
    const habla = fichas.find((f) => f.ancla.slug === "habla");
    expect(habla?.export.app.nombre).toBe("Hablemos San");
    const crudo = parse(
      readFileSync("data/categorias-apps.yaml", "utf8"),
    ) as typeof YAML;
    expect(crudo.personales.find((e) => e.slug === "habla")?.nombre.es).toBe(
      "Habla San",
    );
  });
});

describe("el motor (con fixtures: aquí viven los rojos)", () => {
  const categorias = parseCategoriasApps(YAML, "fixture");

  it("ROJO: un export sin categoría rompe el build y nombra su slug", () => {
    expect(() =>
      repartirApps([ficha("ds"), ficha("zzz-nueva")], categorias),
    ).toThrow(/zzz-nueva/);
    expect(() =>
      repartirApps([ficha("ds"), ficha("zzz-nueva")], categorias),
    ).toThrow(/sin categoría/);
  });

  it("VERDE: con todos clasificados reparte en el orden del YAML, no en el de las fichas", () => {
    const r = repartirApps(
      [ficha("habla"), ficha("velo"), ficha("ds")],
      categorias,
    );
    expect(r.profesionales.map((f) => f.ancla.slug)).toEqual(["ds", "velo"]);
    expect(r.personales.map((f) => f.ancla.slug)).toEqual(["habla"]);
  });

  it("un slug declarado sin export se ignora (aparece cuando llegue su export)", () => {
    const r = repartirApps([ficha("ds")], categorias);
    expect(r.profesionales.map((f) => f.ancla.slug)).toEqual(["ds"]);
    expect(r.personales).toEqual([]);
  });

  it("ROJO: un slug en las dos categorías lo rechaza el esquema", () => {
    const repetido = {
      profesionales: [{ slug: "ds", nombre: { es: "A", en: "A" } }],
      personales: [{ slug: "ds", nombre: { es: "A", en: "A" } }],
    };
    expect(() => parseCategoriasApps(repetido, "fixture")).toThrow(
      /una sola categoría/,
    );
  });

  it("ROJO: un nombre oficial vacío o un slug mal formado lo rechaza el esquema", () => {
    const vacio = {
      profesionales: [{ slug: "ds", nombre: { es: " ", en: "A" } }],
      personales: [],
    };
    expect(() => parseCategoriasApps(vacio, "fixture")).toThrow(/nombre\.es/);
    const mal = {
      profesionales: [{ slug: "Mala Ruta", nombre: { es: "A", en: "A" } }],
      personales: [],
    };
    expect(() => parseCategoriasApps(mal, "fixture")).toThrow(/slug/);
  });

  it("una app que no está en el YAML conserva el nombre de su export", () => {
    expect(nombreVisible(categorias, "otra", "Nombre del export", "es")).toBe(
      "Nombre del export",
    );
  });
});
