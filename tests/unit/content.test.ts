import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { DIR_A_FONDO } from "../../scripts/a-fondo.mjs";
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
    // Estudios (post-S7): sección propia, misma cuenta en los dos idiomas.
    expect(en.estudios).toHaveLength(es.estudios.length);
    expect(es.estudios.length).toBeGreaterThan(0);
  });

  it("cada hito enlaza al MISMO case study en ES y EN (el hreflang lo necesita)", () => {
    const es = getCv("es");
    const en = getCv("en");
    expect(en.trayectoria.map((t) => t.proyecto ?? null)).toEqual(
      es.trayectoria.map((t) => t.proyecto ?? null),
    );
    // La puerta a los case studies es la trayectoria: al menos uno enlazado.
    expect(es.trayectoria.some((t) => t.proyecto)).toBe(true);
    // Y la formación ya no se disfraza de hito: ningún periodo sin año.
    for (const t of es.trayectoria) expect(t.periodo).toMatch(/\d{4}/);
  });

  it("ningún estudio va sin año: «Sin fecha declarada» es un fallback, no un estado publicable", () => {
    for (const locale of ["es", "en"] as const)
      for (const e of getCv(locale).estudios)
        expect(e.periodo, `${locale}: ${e.titulo}`).toMatch(/\d{4}/);
  });

  // Una credencial nombrada por código (DP-600, AI-102…) en el titular, un
  // logro, un case study, la historia del chat o apps.yaml es una promesa:
  // tiene que existir en `certificaciones`. Nació el 2026-09-10, cuando AI-102
  // salió de la lista (Microsoft la descontinuó) y seguía viva en seis sitios.
  const CODIGO_CREDENCIAL = /\b(?:AI|DP|AZ|PL|DA|MB|MS|SC)-\d{3}\b/g;
  type Hallazgo = { ruta: string; codigo: string };
  function codigosEn(valor: unknown, ruta: string, out: Hallazgo[]) {
    if (typeof valor === "string") {
      for (const codigo of valor.match(CODIGO_CREDENCIAL) ?? [])
        out.push({ ruta, codigo });
    } else if (Array.isArray(valor)) {
      valor.forEach((v, i) => codigosEn(v, `${ruta}[${i}]`, out));
    } else if (valor && typeof valor === "object") {
      for (const [k, v] of Object.entries(valor)) codigosEn(v, `${ruta}.${k}`, out);
    }
  }

  it("toda credencial nombrada por código existe en certificaciones (cv, «a fondo» y apps)", () => {
    const apps: unknown = parse(readFileSync("data/apps.yaml", "utf8"));
    for (const locale of ["es", "en"] as const) {
      const { certificaciones, ...resto } = getCv(locale);
      const vigentes = new Set(
        certificaciones.flatMap((c) => c.nombre.match(CODIGO_CREDENCIAL) ?? []),
      );
      const halladas: Hallazgo[] = [];
      codigosEn(resto, `cv.${locale}`, halladas);
      // El canal «a fondo» reemplazó a la historia en el S8: los códigos de
      // credencial se cuelan igual en la prosa, y ahí hay 24 documentos, no 2.
      for (const archivo of readdirSync(DIR_A_FONDO).filter((f) =>
        f.endsWith(`.${locale}.md`),
      )) {
        codigosEn(
          readFileSync(join(DIR_A_FONDO, archivo), "utf8"),
          `a-fondo/${archivo}`,
          halladas,
        );
      }
      codigosEn(apps, "apps", halladas);
      const huerfanas = halladas
        .filter((h) => !vigentes.has(h.codigo))
        .map((h) => `${h.codigo} en ${h.ruta}`);
      expect(huerfanas).toEqual([]);
    }
  });

  it("keeps the depth layer in ES/EN parity (S2)", () => {
    const es = getCv("es");
    const en = getCv("en");
    // Slugs idénticos y en el mismo orden: el hreflang depende de esto
    expect(en.proyectos.map((p) => p.slug)).toEqual(
      es.proyectos.map((p) => p.slug),
    );
    // Mismo nº de bullets por hito y casestudy en los mismos proyectos
    expect(en.trayectoria.map((t) => t.bullets.length)).toEqual(
      es.trayectoria.map((t) => t.bullets.length),
    );
    expect(en.proyectos.map((p) => Boolean(p.casestudy))).toEqual(
      es.proyectos.map((p) => Boolean(p.casestudy)),
    );
    // El grueso existe: al menos un hito con bullets y un casestudy
    expect(es.trayectoria.some((t) => t.bullets.length > 0)).toBe(true);
    expect(es.proyectos.some((p) => p.casestudy)).toBe(true);
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
