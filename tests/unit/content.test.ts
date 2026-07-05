import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { getApps, getCv } from "@/lib/content";
import { parseApps, parseCv } from "@/lib/schemas";

describe("content loader (data/*.yaml reales)", () => {
  it("parses data/cv.es.yaml and data/cv.en.yaml", () => {
    expect(getCv("es").identidad.nombre).toBeTruthy();
    expect(getCv("en").identidad.nombre).toBeTruthy();
  });

  it("keeps ES/EN structurally in parity (same section sizes)", () => {
    const es = getCv("es");
    const en = getCv("en");
    expect(en.trayectoria).toHaveLength(es.trayectoria.length);
    expect(en.logros).toHaveLength(es.logros.length);
    expect(en.proyectos).toHaveLength(es.proyectos.length);
    expect(en.certificaciones).toHaveLength(es.certificaciones.length);
    expect(en.skills).toHaveLength(es.skills.length);
  });

  it("parses data/apps.yaml and includes hoja-de-vida", () => {
    const { apps } = getApps();
    expect(apps.map((a) => a.id)).toContain("hoja-de-vida");
  });
});

describe("fail-safe del build", () => {
  it("a malformed cv.yaml throws a descriptive error (build breaks)", () => {
    const roto = parse("identidad:\n  nombre: ''\n");
    expect(() => parseCv(roto, "data/cv.es.yaml")).toThrowError(
      /data\/cv\.es\.yaml/,
    );
  });
});

describe("showcase data-driven (criterio de aceptación)", () => {
  it("adding a dummy app to apps.yaml content is enough — no code changes", () => {
    const actual = getApps();
    const conDummy = {
      apps: [
        ...actual.apps,
        {
          id: "app-dummy",
          estado: "en-exploracion",
          nombre: { es: "App Dummy", en: "Dummy App" },
          descripcion: { es: "Prueba", en: "Test" },
        },
      ],
    };
    const parseada = parseApps(conDummy, "apps.yaml");
    expect(parseada.apps.map((a) => a.id)).toContain("app-dummy");
    // El default se aplica sin tocar componentes ni schema
    expect(parseada.apps.at(-1)?.solicitable).toBe(true);
  });
});
