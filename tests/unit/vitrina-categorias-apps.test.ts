import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { getCategoriasApps } from "@/lib/content";
import {
  CATEGORIAS_APPS,
  nombreVisible,
  ordenDeEscaparate,
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

  // Estos dos tests se calculan del YAML y de los exports, no de la lista de
  // hoy: el día que llegue el export de AngelGhost, planlang, Big-D o HackGuard,
  // esas apps «aparecen solas» (promesa del manual y del ADR-028) y la CI no
  // debe ponerse roja por eso. Un gate que se activa en el camino feliz del
  // diseño es un gate mal puesto (regla 14).
  it("cada app va en la categoría que el dueño declaró, en el orden del YAML", () => {
    const reparto = repartirApps(fichas, categorias);
    for (const c of CATEGORIAS_APPS) {
      const esperado = categorias[c]
        .map((e) => e.slug)
        .filter((s) => fichas.some((f) => f.ancla.slug === s));
      expect(
        reparto[c].map((f) => f.ancla.slug),
        c,
      ).toEqual(esperado);
    }
  });

  it("la clasificación que el dueño pidió se conserva: Probeta DS, Dash Agent y Anonimizador Velo son profesionales; Habla San, Innmobiliaria y Nutrikids, personales", () => {
    const de = (c: "profesionales" | "personales") =>
      categorias[c].map((e) => e.slug);
    for (const s of ["ds", "dash-agent-ai", "anonimizador"])
      expect(de("profesionales"), s).toContain(s);
    for (const s of ["habla", "inmobiliaria", "nutri-kids"])
      expect(de("personales"), s).toContain(s);
  });

  it("AngelGhost se declara UNA sola vez, y las apps declaradas sin export se ignoran", () => {
    const todos = [...categorias.profesionales, ...categorias.personales].map(
      (e) => e.slug,
    );
    expect(todos.filter((s) => s === "copiloto-consultor")).toHaveLength(1);
    expect(new Set(todos).size).toBe(todos.length);
    const reparto = repartirApps(fichas, categorias);
    const vistos = CATEGORIAS_APPS.flatMap((c) =>
      reparto[c].map((f) => f.ancla.slug),
    );
    const sinExport = todos.filter(
      (s) => !fichas.some((f) => f.ancla.slug === s),
    );
    for (const slug of sinExport) {
      expect(vistos, `${slug} no tiene export: no aparece`).not.toContain(slug);
    }
    // Y toda app que SÍ tiene export aparece una sola vez.
    expect(new Set(vistos).size).toBe(vistos.length);
    expect(vistos.sort()).toEqual(fichas.map((f) => f.ancla.slug).sort());
  });

  it("el orden del escaparate es profesionales y después personales: el de las vecinas", () => {
    const reparto = repartirApps(fichas, categorias);
    const esperado = [...reparto.profesionales, ...reparto.personales].map(
      (f) => f.ancla.slug,
    );
    expect(
      ordenDeEscaparate(fichas, (f) => f.ancla.slug, categorias).map(
        (f) => f.ancla.slug,
      ),
    ).toEqual(esperado);
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

  it("ordenDeEscaparate reordena cualquier lista: profesionales primero, cada una en el orden del YAML", () => {
    const desordenadas = ["habla", "velo", "ds"].map(ficha);
    expect(
      ordenDeEscaparate(desordenadas, (f) => f.ancla.slug, categorias).map(
        (f) => f.ancla.slug,
      ),
    ).toEqual(["ds", "velo", "habla"]);
  });

  it("ROJO: ordenDeEscaparate también falla si una app no tiene categoría", () => {
    expect(() =>
      ordenDeEscaparate(
        [ficha("ds"), ficha("zzz-nueva")],
        (f) => f.ancla.slug,
        categorias,
      ),
    ).toThrow(/zzz-nueva/);
  });

  it("una app que no está en el YAML conserva el nombre de su export", () => {
    expect(nombreVisible(categorias, "otra", "Nombre del export", "es")).toBe(
      "Nombre del export",
    );
  });
});
