import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  contraste,
  mezcla,
  PALETA,
  PAPEL,
  TINTA,
} from "@/lib/brochure/contraste";
import {
  COLORES_AREAS,
  ESCENARIO,
  FONDO_MAS_CLARO,
  fondoDeAro,
  fondoDeFicha,
} from "@/lib/skills/paleta";

/**
 * AA DEL EXPLORADOR DE SKILLS (S29). El sitio es claro; el rectángulo de Skills es oscuro, con una luz
 * tenue en el centro. Cada texto del escenario se mide contra su fondo MÁS CLARO (el punto donde la luz es
 * máxima: el peor caso para un texto claro) y se exige 4,5:1. La hoja y `src/lib/skills/paleta.ts` tienen
 * que decir los mismos colores: un color movido en un solo lado falla aquí, no en axe al final (axe no
 * mide sobre degradados).
 */

const AA = 4.5;
const HOJA = readFileSync(
  path.join(process.cwd(), "src/components/home/skills.css"),
  "utf8",
);
const variable = (nombre: string) => {
  const m = new RegExp(`--${nombre}:([^;]+);`).exec(HOJA);
  if (!m) throw new Error(`la hoja no declara --${nombre}`);
  return m[1]!.trim();
};
const rgba = (hex: string, alfa: number) =>
  `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",")},${String(alfa).replace(/^0/, "")})`;

describe("la hoja y la paleta dicen los mismos colores", () => {
  it("el fondo, la luz, el texto, el tenue y la ficha", () => {
    expect(variable("esc-centro")).toBe(ESCENARIO.centro);
    expect(variable("esc-medio")).toBe(ESCENARIO.medio);
    expect(variable("esc-borde")).toBe(ESCENARIO.borde);
    expect(variable("esc-luz-max")).toBe(
      rgba(ESCENARIO.luz, ESCENARIO.luzAlfa),
    );
    expect(variable("esc-texto")).toBe(ESCENARIO.texto);
    expect(variable("esc-tenue")).toBe(ESCENARIO.tenue);
    expect(variable("esc-ficha")).toBe(
      rgba(ESCENARIO.ficha, ESCENARIO.fichaAlfa),
    );
  });

  it("cada color de área tiene su regla en la hoja", () => {
    for (const a of new Set(COLORES_AREAS))
      expect(HOJA, a).toContain(
        `.burbuja[data-color="${a}"]{--c:var(--${a});--ci:var(--${a}-ink)}`,
      );
  });

  it("ninguna regla lleva un hex suelto: los colores viven en las variables del tope", () => {
    const reglas = HOJA.replace(/\/\*[\s\S]*?\*\//g, "").replace(
      /\[data-skills\]\{[\s\S]*?\n\}/,
      "",
    );
    expect(reglas.match(/#[0-9a-f]{3,8}\b/gi) ?? []).toEqual([]);
  });

  it("ink-3 no pinta texto (veto de la casa): solo el borde punteado del estado", () => {
    expect(HOJA).not.toMatch(/(?<![-\w])color:\s*var\(--ink-3\)/);
  });
});

describe("cada texto del escenario cumple AA sobre su fondo más claro", () => {
  it("el cálculo discrimina: el tenue sobre papel NO pasa (la prueba sí puede fallar)", () => {
    expect(contraste(ESCENARIO.tenue, PAPEL[0])).toBeLessThan(AA);
  });

  it("la luz del centro aclara el fondo, y aun así es oscuro", () => {
    expect(FONDO_MAS_CLARO).not.toBe(ESCENARIO.centro);
    expect(contraste(FONDO_MAS_CLARO, "#000000")).toBeLessThan(2);
  });

  for (const a of new Set(COLORES_AREAS)) {
    it(`área ${a}: el nombre sobre la burbuja llena, sobre su aro ya abierto y la ficha del número`, () => {
      expect(
        contraste(PALETA[a].tinta, PALETA[a].pastel),
      ).toBeGreaterThanOrEqual(AA);
      expect(contraste(PALETA[a].pastel, fondoDeAro(a))).toBeGreaterThanOrEqual(
        AA,
      );
      expect(contraste(PAPEL[0], fondoDeFicha(a))).toBeGreaterThanOrEqual(AA);
      expect(
        contraste(PALETA.sage.pastel, fondoDeFicha(a)),
      ).toBeGreaterThanOrEqual(AA); // el ✓
    });
  }

  it("la invitación, cuántas llevas, «N de 9», los nombres de los pasos y los botones claros", () => {
    expect(contraste(ESCENARIO.texto, FONDO_MAS_CLARO)).toBeGreaterThanOrEqual(
      AA,
    );
    expect(
      contraste(PALETA.sage.pastel, FONDO_MAS_CLARO),
    ).toBeGreaterThanOrEqual(AA);
    expect(contraste(ESCENARIO.tenue, FONDO_MAS_CLARO)).toBeGreaterThanOrEqual(
      AA,
    );
    // «← Todas las áreas», «← 2 · 4 →» y «Ver todo en lista»: papel sobre el velo blanco (12 % al pasar el cursor)
    expect(
      contraste(PAPEL[0], mezcla("#ffffff", FONDO_MAS_CLARO, 12)),
    ).toBeGreaterThanOrEqual(AA);
  });

  it("las herramientas alrededor: tinta sobre papel, la nota y el estado en tinta 2", () => {
    expect(contraste(TINTA[0], PAPEL[0])).toBeGreaterThanOrEqual(AA);
    expect(contraste(TINTA[2], PAPEL[0])).toBeGreaterThanOrEqual(AA);
  });

  it("la lista y el conmutador, sobre papel", () => {
    expect(contraste(TINTA[1], PAPEL[1])).toBeGreaterThanOrEqual(AA);
    expect(contraste(TINTA[2], PAPEL[1])).toBeGreaterThanOrEqual(AA);
    expect(contraste(TINTA[0], PAPEL[0])).toBeGreaterThanOrEqual(AA);
  });
});
