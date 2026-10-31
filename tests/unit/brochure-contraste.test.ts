import { describe, expect, it } from "vitest";
import { ACENTOS } from "@/lib/brochure/contenido";
import {
  contraste,
  luminancia,
  mezcla,
  PALETA,
  PAPEL,
  TENUE_SOBRE_OSCURO,
  TINTA,
} from "@/lib/brochure/contraste";

/**
 * AA DE LOS SEIS ACENTOS (S28). La hoja del brochure pinta cada app con un pastel y su tinta.
 * Aquí se calcula el contraste WCAG de CADA par que la hoja usa y se exige 4,5:1 (texto normal):
 * un acento nuevo, o un color movido, falla en esta prueba y no en axe al final.
 */

const AA = 4.5;

describe("el cálculo de contraste discrimina (el rojo del gate)", () => {
  it("coincide con los valores de referencia de WCAG", () => {
    expect(luminancia("#ffffff")).toBeCloseTo(1, 5);
    expect(luminancia("#000000")).toBeCloseTo(0, 5);
    expect(contraste("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contraste("#777777", "#ffffff")).toBeCloseTo(4.48, 1);
  });

  it("el gris vetado (ink-3) NO pasa AA sobre papel: la prueba sí puede fallar", () => {
    expect(contraste("#9c9a90", PAPEL[0])).toBeLessThan(AA);
  });

  it("rechaza un color que no es #rrggbb en vez de calcular basura", () => {
    expect(() => contraste("rojo", "#ffffff")).toThrow(/color inválido/);
  });

  it("la mezcla reproduce color-mix(srgb): 0 % es el segundo color y 100 % el primero", () => {
    expect(mezcla("#ffffff", "#000000", 100)).toBe("#ffffff");
    expect(mezcla("#ffffff", "#000000", 0)).toBe("#000000");
    expect(mezcla("#ffffff", "#000000", 50)).toBe("#808080");
  });
});

describe("la paleta tiene los seis acentos de la maqueta y cada uno cumple AA", () => {
  it("hay un par por acento del contrato, y ninguno de más", () => {
    expect(Object.keys(PALETA).sort()).toEqual([...ACENTOS].sort());
  });

  describe.each(ACENTOS)("%s", (acento) => {
    const { pastel, tinta } = PALETA[acento];
    const casos: [string, string, string][] = [
      [
        "su tinta sobre su pastel (chips, insignias, botón, marca del buscador)",
        tinta,
        pastel,
      ],
      [
        "su tinta sobre el papel 0 (ceja de sección, número de la loseta)",
        tinta,
        PAPEL[0],
      ],
      ["su tinta sobre el papel 1 (tarjetas)", tinta, PAPEL[1]],
      [
        "su pastel sobre la tinta oscura (resalte de la portada, rótulos de la cinta)",
        pastel,
        TINTA[0],
      ],
      [
        "la tinta 0 sobre «con la app» (42 % del pastel sobre papel)",
        TINTA[0],
        mezcla(pastel, PAPEL[0], 42),
      ],
      [
        "su tinta sobre «con la app» (42 % del pastel sobre papel)",
        tinta,
        mezcla(pastel, PAPEL[0], 42),
      ],
    ];
    it.each(casos)("%s: ≥ 4,5:1", (_par, texto, fondo) => {
      expect(contraste(texto, fondo)).toBeGreaterThanOrEqual(AA);
    });
  });
});

describe("el token tenue sobre oscuro", () => {
  it("no es el hex vetado de ink-3: otro token, otro valor", () => {
    expect(TENUE_SOBRE_OSCURO.toLowerCase()).not.toBe("#9c9a90");
  });

  it("da ≥ 7:1 sobre la tinta 0 y ≥ 4,5:1 sobre la tinta 1 y sobre los velos de las fichas oscuras", () => {
    expect(contraste(TENUE_SOBRE_OSCURO, TINTA[0])).toBeGreaterThanOrEqual(7);
    expect(contraste(TENUE_SOBRE_OSCURO, TINTA[1])).toBeGreaterThanOrEqual(AA);
    expect(
      contraste(TENUE_SOBRE_OSCURO, mezcla("#ffffff", TINTA[0], 10)),
    ).toBeGreaterThanOrEqual(AA);
    expect(
      contraste(TENUE_SOBRE_OSCURO, mezcla("#ffffff", TINTA[0], 16)),
    ).toBeGreaterThanOrEqual(AA);
  });

  it("sobre papel NO cumple: por eso solo vive en las secciones oscuras", () => {
    expect(contraste(TENUE_SOBRE_OSCURO, PAPEL[0])).toBeLessThan(AA);
  });
});
