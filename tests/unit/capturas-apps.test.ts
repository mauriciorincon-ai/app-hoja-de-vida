import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CAPTURA_ALTO,
  CAPTURA_ANCHO,
  CAPTURA_MAX_KB,
  capturasDelGrupo,
  capturasSchema,
  dimensionesWebp,
  getCapturas,
  idsDeFuncionalidades,
  problemasDeCapturas,
  type Capturas,
} from "@/lib/vitrina/capturas";
import { getFicha } from "@/lib/vitrina/loader";
import { ESPERAN_SU_ENTREGA } from "../fixtures/esperan-su-entrega";

/**
 * LAS CAPTURAS POR FUNCIONALIDAD (pedido 026, OM-21).
 *
 * «Cada funcionalidad de cada app tiene al menos una captura real»: aquí se
 * exige que toda funcionalidad TENGA su pantalla o esté declarada sin ella (las
 * transversales: «sin captura, sin relleno»), que toda captura declarada
 * EXISTA en disco —una galería que apunta al vacío rompe el build, no publica un
 * hueco—, y que cada imagen sea la que el presupuesto de la página aguanta: WebP
 * de 1536×960 y ≤ 80 KB. Cada tarjeta del escaparate tiene su portada.
 *
 * Nació con su rojo (regla 15): ver la bitácora del cierre del S26.
 */

const SLUGS = readdirSync("content/vitrina")
  .filter((f) => f.endsWith(".brochure-export.json"))
  .map((f) => f.replace(".brochure-export.json", ""))
  .sort();
const ENTREGADAS = SLUGS.filter((s) => !ESPERAN_SU_ENTREGA.includes(s));

const idsDe = (slug: string) =>
  idsDeFuncionalidades(getFicha(slug)!.export.funcionalidades.grupos);

describe("las capturas de las apps que ya entregaron", () => {
  it("hay apps con export y la lista de las que esperan no se inventa", () => {
    expect(SLUGS.length).toBeGreaterThanOrEqual(10);
    for (const s of ESPERAN_SU_ENTREGA) expect(SLUGS, s).toContain(s);
  });

  for (const slug of ENTREGADAS) {
    describe(slug, () => {
      // Se lee DENTRO de cada prueba: el loader rompe el build si la tabla está
      // mal (regla 1), y aquí ese mismo error debe salir como el fallo de ESA
      // app, sin esconder lo que pasa con las demás.
      const leer = () => getCapturas(slug)!;

      it("trae su tabla de capturas, válida contra el esquema", () => {
        expect(
          getCapturas(slug),
          `falta content/vitrina/${slug}.capturas.yaml`,
        ).toBeDefined();
        expect(capturasSchema.safeParse(leer()).success).toBe(true);
      });

      it("toda funcionalidad tiene su captura o está declarada sin pantalla, y toda captura existe", () => {
        const problemas = problemasDeCapturas(leer(), idsDe(slug), (a) =>
          existsSync(path.join("public/vitrina", slug, a)),
        );
        expect(problemas).toEqual([]);
      });

      it(`cada imagen es un WebP de ${CAPTURA_ANCHO}×${CAPTURA_ALTO} y de ${CAPTURA_MAX_KB} KB como máximo`, () => {
        const tabla = leer();
        const archivos = [
          tabla.portada,
          ...tabla.capturas.map((c) => c.archivo),
        ];
        const mal: string[] = [];
        for (const a of archivos) {
          const f = path.join("public/vitrina", slug, a);
          const kb = statSync(f).size / 1024;
          if (kb > CAPTURA_MAX_KB) mal.push(`${a}: ${kb.toFixed(1)} KB`);
          const d = dimensionesWebp(readFileSync(f));
          if (!d || d[0] !== CAPTURA_ANCHO || d[1] !== CAPTURA_ALTO)
            mal.push(`${a}: ${d ? d.join("×") : "no es WebP"}`);
        }
        expect(mal).toEqual([]);
      });

      it("el escaparate le pinta su portada: la pantalla de entrada", () => {
        const tabla = leer();
        expect(tabla.portada).toMatch(/\.webp$/);
        expect(
          existsSync(path.join("public/vitrina", slug, tabla.portada)),
        ).toBe(true);
      });

      it("cada grupo con pantallas las trae en el orden de sus funcionalidades", () => {
        const tabla = leer();
        const grupos = getFicha(slug)!.export.funcionalidades.grupos;
        let conPantalla = 0;
        for (const g of grupos) {
          const delGrupo = capturasDelGrupo(tabla, g, "es");
          const ids = g.features.map((f) => f.id);
          expect(delGrupo.map((c) => c.id)).toEqual(
            ids.filter((id) => delGrupo.some((c) => c.id === id)),
          );
          conPantalla += delGrupo.length;
        }
        expect(conPantalla).toBe(tabla.capturas.length);
      });
    });
  }
});

describe("las apps que esperan su entrega", () => {
  // La lista puede estar VACÍA (lo está desde el Sprint 027, cuando entró Innmobiliaria): por eso la prueba es una sola
  // y recorre la lista, en vez de una por app. Una app que ya trae su tabla de capturas no puede seguir esperándola.
  it("ninguna trae todavía su tabla de capturas; si ya llegó, sácala de ESPERAN_SU_ENTREGA", () => {
    for (const slug of ESPERAN_SU_ENTREGA) {
      expect(
        existsSync(`content/vitrina/${slug}.capturas.yaml`),
        `«${slug}» ya trae su tabla: quítala de tests/fixtures/esperan-su-entrega.ts para que los gates de la entrega le apliquen`,
      ).toBe(false);
    }
  });
});

/** El motor puro: lo que debe romper, nombrando la cosa (el rojo de cada regla). */
describe("problemasDeCapturas — lo que rompe y cómo lo dice", () => {
  const base: Capturas = {
    portada: "entrada.webp",
    capturas: [
      {
        funcionalidad: "A1",
        archivo: "A1.webp",
        pie: { es: "uno", en: "one" },
      },
      {
        funcionalidad: "A2",
        archivo: "A2.webp",
        pie: { es: "dos", en: "two" },
      },
    ],
    sin_pantalla: ["T1"],
  };
  const ids = ["A1", "A2", "T1"];
  const todo = () => true;

  it("una tabla completa no tiene problemas", () => {
    expect(problemasDeCapturas(base, ids, todo)).toEqual([]);
  });

  it("una funcionalidad sin captura ni declaración se nombra", () => {
    const r = problemasDeCapturas(base, [...ids, "A3"], todo);
    expect(r.join("|")).toContain("sin captura ni sin_pantalla: A3");
  });

  it("una captura de una funcionalidad que el export no tiene se nombra", () => {
    const r = problemasDeCapturas(
      {
        ...base,
        capturas: [
          ...base.capturas,
          { ...base.capturas[0], funcionalidad: "Z9" },
        ],
      },
      ids,
      todo,
    );
    expect(r.join("|")).toContain(
      "capturas.Z9: no es una funcionalidad del export",
    );
  });

  it("una captura que apunta al vacío se nombra con su archivo", () => {
    const r = problemasDeCapturas(base, ids, (a) => a !== "A2.webp");
    expect(r).toEqual(["capturas.A2: no existe A2.webp"]);
  });

  it("la portada ausente se nombra", () => {
    const r = problemasDeCapturas(base, ids, (a) => a !== "entrada.webp");
    expect(r).toEqual(["portada: no existe entrada.webp"]);
  });

  it("una funcionalidad con captura y declarada sin pantalla se nombra", () => {
    const r = problemasDeCapturas(
      { ...base, sin_pantalla: ["T1", "A1"] },
      ids,
      todo,
    );
    expect(r.join("|")).toContain("A1: está en capturas y en sin_pantalla");
  });

  it("dos capturas de la misma funcionalidad se nombran", () => {
    const r = problemasDeCapturas(
      { ...base, capturas: [...base.capturas, base.capturas[0]] },
      ids,
      todo,
    );
    expect(r.join("|")).toContain("capturas.A1: aparece 2 veces");
  });

  it("el esquema rechaza una ruta que se escapa, un pie largo y un campo de más", () => {
    expect(
      capturasSchema.safeParse({ ...base, portada: "../x.webp" }).success,
    ).toBe(false);
    expect(
      capturasSchema.safeParse({
        ...base,
        capturas: [
          { ...base.capturas[0], pie: { es: "x".repeat(81), en: "ok" } },
        ],
      }).success,
    ).toBe(false);
    expect(capturasSchema.safeParse({ ...base, otro: 1 }).success).toBe(false);
  });
});
