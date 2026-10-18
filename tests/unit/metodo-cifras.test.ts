// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
  problemasDeCifras,
  verdadesDelSitio,
} from "../../scripts/a-fondo-coherencia.mjs";
import {
  afirmacionesConCorpus,
  numerosDe,
  piezasComoDocumentos,
  problemasDeCifrasDelCorpus,
} from "../../scripts/metodo-cifras.mjs";
import { leerMetodo } from "../../scripts/metodo-al-indice.mjs";

/**
 * NINGUNA CIFRA SIN CORPUS (S11). Las infografías de «Mi método» dicen dos clases
 * de cifras y las dos se vigilan desde el disco:
 *
 *   · las de «lo que hice» y las de la evidencia: están en el documento del
 *     corpus que la pieza cita (antes solo se miraba que el archivo existiera);
 *   · las del SITIO (cuántas apps, agentes, piezas…): las juzga el mismo motor
 *     y el mismo `cifras-a-fondo.yaml` que vigilan el corpus a fondo.
 *
 * El auditor del S10 lo probó a mano (0 de 30 cifras sin respaldo) y ningún test
 * lo sostenía: con nueve piezas por venir, la deriva habría sido silenciosa.
 */

const { piezas } = leerMetodo();
const lista = (problemas: string[]) =>
  "\n" + problemas.map((p) => `  · ${p}`).join("\n");

const leerDoc = (slug: string, locale: string) => {
  const f = `data/a-fondo/${slug}.${locale}.md`;
  return existsSync(f) ? readFileSync(f, "utf8") : undefined;
};

describe("las cifras de lo que hice salen del documento que la pieza cita", () => {
  it("hay piezas y afirmaciones respaldadas en el corpus que vigilar", () => {
    expect(piezas.length).toBeGreaterThan(0);
    for (const { pieza } of piezas)
      expect(afirmacionesConCorpus(pieza).length).toBeGreaterThan(0);
  });

  it("cada cifra de lo que hice y de la evidencia está en su documento, en los dos idiomas", () => {
    const problemas = problemasDeCifrasDelCorpus(piezas, leerDoc);
    expect(problemas, lista(problemas)).toEqual([]);
  });
});

describe("ROJO · el motor contra piezas de juguete", () => {
  const pieza = (es: string, en: string, corpus = ["doc"]) => ({
    archivo: "data/metodo/juguete.yaml",
    pieza: {
      bloques: [
        {
          n: 3,
          fases: [{ nota: { voz: "hice", texto: { es, en }, corpus } }],
        },
      ],
    },
  });
  const docs: Record<string, string> = {
    "doc.es": "Redujo los tokens un 52 % y vigiló 1.633 fragmentos.",
    "doc.en": "It cut tokens by 52% and watched 1,633 fragments.",
  };
  const lector = (slug: string, locale: string) => docs[`${slug}.${locale}`];

  it("una cifra que el documento sí dice pasa, con separadores a la española o a la inglesa", () => {
    expect(
      problemasDeCifrasDelCorpus(
        [
          pieza(
            "Bajé 52 % los tokens de 1.633 fragmentos",
            "I cut tokens 52% of 1,633 fragments",
          ),
        ],
        lector,
      ),
    ).toEqual([]);
  });

  it("una cifra que el documento no dice rompe, nombrando archivo, ruta, cifra y documento", () => {
    const problemas = problemasDeCifrasDelCorpus(
      [pieza("Bajé 53 % los tokens", "I cut tokens 53%")],
      lector,
    );
    expect(problemas).toHaveLength(2); // una por idioma
    expect(problemas[0]).toMatch(
      /data\/metodo\/juguete\.yaml: bloques\.0\.fases\.0\.nota \(es\): la cifra «53» no está en doc/,
    );
  });

  it("un documento que no existe no se juzga aquí (lo para el cargador)", () => {
    expect(
      problemasDeCifrasDelCorpus(
        [pieza("Dije 999", "I said 999", ["no-existe"])],
        lector,
      ),
    ).toEqual([]);
  });

  it("numerosDe normaliza el separador: 99,5 y 99.5 son el mismo número", () => {
    expect(numerosDe("99,5 % y 99.5 % y 1.633")).toEqual([
      "995",
      "995",
      "1633",
    ]);
  });
});

describe("las cifras del sitio que dicen las infografías son las que el disco publica", () => {
  const fixture = parse(
    readFileSync("tests/fixtures/cifras-a-fondo.yaml", "utf8"),
  );
  const verdades: Record<string, number | undefined> = verdadesDelSitio();
  // El tamaño del índice lo juzga `a-fondo-coherencia.test.ts` (necesita construirlo).
  const conceptos = fixture.conceptos.filter(
    (c: { id: string }) => verdades[c.id] !== undefined,
  );

  it("ningún conteo de apps, agentes, piezas o credenciales contradice al sitio", () => {
    const problemas = problemasDeCifras(
      piezasComoDocumentos(piezas, "es"),
      conceptos,
      verdades,
    );
    expect(problemas, lista(problemas)).toEqual([]);
  });

  it("ROJO · «13 aplicaciones» en una pieza, con diez en la vitrina, rompe nombrando el bloque", () => {
    const falsa = [
      {
        archivo: "data/metodo/juguete.yaml",
        pieza: {
          bloques: [
            {
              n: 4,
              nota: {
                es: "La vitrina tiene 13 aplicaciones.",
                en: "The showcase has 13 apps.",
              },
            },
          ],
        },
      },
    ];
    const problemas = problemasDeCifras(
      piezasComoDocumentos(falsa, "es"),
      conceptos,
      verdades,
    );
    expect(problemas.length).toBeGreaterThan(0);
    expect(problemas[0]).toMatch(
      /data\/metodo\/juguete\.yaml · «bloque-4»: dice «13 aplicaciones»/,
    );
  });
});
