import { describe, expect, it } from "vitest";
import { esOffTopic } from "@/lib/ia/guardrails";
import { createRetriever, TOP_K_CONTEXTO } from "@/lib/ia/retrieval";
import { chatChunkSchema } from "@/lib/ia/schemas";
import {
  corpusSimulado,
  evaluarBanco,
  leerBanco,
  RUTA_BANCO,
  RUTA_BANCO_EN,
} from "../../scripts/evaluar-corpus.mjs";

/**
 * EL BANCO EN INGLÉS (a fondo v2, F5). Las mismas 136 preguntas de afuera,
 * traducidas, contra el índice inglés simulado. Lo que vigila:
 *
 * 1. Que el banco inglés sea el GEMELO del español: mismas fuentes esperadas,
 *    en el mismo orden. Una pregunta que se traduce y cambia de fuente no es
 *    una traducción.
 * 2. Que cada pregunta traiga su fuente en el top-k del índice inglés. La
 *    recuperación es léxica y el vocabulario inglés es otro: una traducción
 *    que pierde la palabra con la que alguien pregunta se ve aquí, no en
 *    producción.
 * 3. Que las ajenas se comporten como están declaradas — medido sobre el
 *    índice inglés, que deja pasar palabras distintas que el español.
 */

type Fila = { pregunta: string; espera: string[]; ids: string[]; acierta: boolean };
type Ajena = { pregunta: string; guardrail: "bloquea" | "pasa" };

const bancoEs = leerBanco(RUTA_BANCO);
const bancoEn = leerBanco(RUTA_BANCO_EN);
const retriever = createRetriever(
  corpusSimulado("en").map((c: unknown) => chatChunkSchema.parse(c)),
);
const m2 = evaluarBanco(retriever, bancoEn, TOP_K_CONTEXTO, esOffTopic);

describe("el banco inglés es el gemelo del español", () => {
  it("mismas preguntas, mismas fuentes esperadas, mismo orden", () => {
    expect(bancoEn.preguntas.length).toBe(bancoEs.preguntas.length);
    bancoEn.preguntas.forEach((p: { espera: string[]; familia: string }, i: number) => {
      expect(p.espera, `pregunta ${i + 1}`).toEqual(bancoEs.preguntas[i].espera);
      expect(p.familia, `pregunta ${i + 1}`).toBe(bancoEs.preguntas[i].familia);
    });
    expect(bancoEn.ajenas.length).toBe(bancoEs.ajenas.length);
    expect(bancoEn.sin_cobertura.length).toBe(bancoEs.sin_cobertura.length);
  });

  it("el índice inglés simulado contiene los gemelos", () => {
    expect(m2.filas.length).toBe(bancoEn.preguntas.length);
    expect(
      retriever.topK("Vesting", 1).some((h) => h.chunk.id.startsWith("a-fondo-")),
      "no hay documentos a fondo en el índice inglés",
    ).toBe(true);
  });
});

const casos: [string, Fila][] = m2.filas.map((f: Fila) => [f.pregunta, f]);

describe(`cada pregunta en inglés trae su fuente en el top-${TOP_K_CONTEXTO}`, () => {
  it.each(casos)("%s", (_t: string, fila: Fila) => {
    expect(
      fila.acierta,
      `«${fila.pregunta}» no trajo ninguna de sus fuentes esperadas en el índice inglés.\n` +
        `  esperaba: ${fila.espera.join(" · ")}\n  trajo:    ${fila.ids.join(", ") || "nada"}\n` +
        `  Se corrige el gemelo .en.md (la palabra tiene que existir en inglés), no la expectativa.`,
    ).toBe(true);
  });
});

describe("las ajenas en inglés", () => {
  it("cada una se comporta como está declarada", () => {
    const desviadas = bancoEn.ajenas
      .map((a: Ajena) => ({
        ...a,
        real: esOffTopic(retriever.topKStrict(a.pregunta, TOP_K_CONTEXTO)) ? "bloquea" : "pasa",
      }))
      .filter((a: Ajena & { real: string }) => a.real !== a.guardrail)
      .map((a: Ajena & { real: string }) => `«${a.pregunta}» declarada «${a.guardrail}», real «${a.real}»`);
    expect(desviadas).toEqual([]);
  });

  it("ninguna legítima queda bajo el umbral", () => {
    expect(m2.resumen.offTopic, "preguntas legítimas que recibirían «that one escapes me»").toBe(0);
  });
});
