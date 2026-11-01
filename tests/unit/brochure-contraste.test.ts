import { readFileSync } from "node:fs";
import path from "node:path";
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

/*
 * LA HOJA Y ESTA TABLA DICEN LO MISMO. Lo de arriba mide la tabla; lo que se pinta es la hoja. La
 * hoja no escribe ningún color de la paleta suelto: los toma de `globals.css` (`--color-*`) y los
 * conecta por `data-acento`. Aquí se lee el CSS real y se exige que cada eslabón coincida.
 */
const RAIZ = process.cwd();
const HOJA = readFileSync(
  path.join(RAIZ, "src/components/brochure/brochure.css"),
  "utf8",
);
const GLOBALES = readFileSync(path.join(RAIZ, "src/app/globals.css"), "utf8");

const tokenGlobal = (nombre: string) =>
  GLOBALES.match(
    new RegExp(String.raw`--color-${nombre}:\s*(#[0-9a-f]{6})\s*;`, "i"),
  )?.[1]?.toLowerCase();

describe("la hoja del brochure pinta con esta misma tabla", () => {
  it("el papel y la tinta de globals.css son los de la tabla", () => {
    for (const [k, hex] of Object.entries(PAPEL))
      expect(tokenGlobal(`paper-${k}`), `paper-${k}`).toBe(hex);
    for (const [k, hex] of Object.entries(TINTA))
      expect(tokenGlobal(`ink-${k}`), `ink-${k}`).toBe(hex);
  });

  it.each(ACENTOS)(
    "%s: el pastel y la tinta de globals.css son los de la tabla, y la hoja los conecta por data-acento",
    (acento) => {
      expect(tokenGlobal(acento)).toBe(PALETA[acento].pastel);
      expect(tokenGlobal(`${acento}-ink`)).toBe(PALETA[acento].tinta);
      expect(HOJA).toContain(
        `--${acento}:var(--color-${acento});--${acento}-ink:var(--color-${acento}-ink)`,
      );
      expect(HOJA).toContain(
        `&[data-acento="${acento}"]{--ac:var(--${acento});--ac-ink:var(--${acento}-ink)}`,
      );
    },
  );

  it("ningún color de la tabla está escrito suelto en la hoja (todo pasa por su token)", () => {
    const hexes = [
      ...Object.values(PAPEL),
      ...Object.values(TINTA),
      ...Object.values(PALETA).flatMap((p) => [p.pastel, p.tinta]),
    ];
    expect(hexes.filter((h) => HOJA.toLowerCase().includes(h))).toEqual([]);
  });

  it("el tenue de la hoja es el de la tabla", () => {
    expect(HOJA).toContain(`--tenue-oscuro:${TENUE_SOBRE_OSCURO};`);
  });
});

/**
 * Las reglas que pintan TEXTO con el tenue: el selector de cada línea que lo usa en `color`. La hoja
 * escribe una regla por línea, así que el selector es lo que va antes de la primera llave.
 */
function selectoresDelTenue(css: string): string[] {
  return css
    .split("\n")
    .filter((l) => /(?<![-\w])color\s*:\s*var\(--tenue-oscuro\)/.test(l))
    .map((l) => l.slice(0, l.indexOf("{")).trim());
}

/** Las seis reglas oscuras de la maqueta donde el tenue pinta texto (y su fondo, para que se lea). */
const SECCIONES_OSCURAS = [
  ".barra[data-b-oscura] .busca input::placeholder", // la barra sobre la portada (tinta 0)
  ".dispositivo-barra", // la barra del dispositivo de la portada (#262522)
  ".pie-pantalla", // el pie de la pantalla, en la portada (tinta 0)
  ".cinta-rotulo", // el rótulo de la cinta (tinta 0)
  ".pie-final", // el pie del cierre 05 (tinta 0)
  ".r-teclas", // las teclas del Recorrido (el diálogo oscuro)
];

describe("el tenue solo pinta texto en las secciones oscuras", () => {
  it("el barrido discrimina: un uso en una sección clara aparece (el rojo del gate)", () => {
    const plantado = `${HOJA}\n  .cap-cuerpo p{color:var(--tenue-oscuro)}`;
    expect(selectoresDelTenue(plantado)).toContain(".cap-cuerpo p");
  });

  it("la hoja lo usa exactamente en las seis reglas oscuras, ni una más", () => {
    expect(selectoresDelTenue(HOJA).sort()).toEqual(
      [...SECCIONES_OSCURAS].sort(),
    );
  });
});
