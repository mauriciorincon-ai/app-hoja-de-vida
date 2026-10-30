import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { esPreguntaDeAusencia, normalizar } from "@/lib/ia/rehuso";
import {
  esPreguntaPorLaSalida,
  FUENTE_DE_LA_SALIDA,
  fuenteDeLaSalida,
  RESPUESTA_SALIDA,
  trozosDeLaSalida,
} from "@/lib/ia/salida-de-vesting";
import { chatChunkSchema, type ChatChunk } from "@/lib/ia/schemas";
import { esTemaAjeno } from "@/lib/ia/tema-ajeno";
import { vozDelDueno } from "@/lib/ia/voz-del-dueno";
import {
  corpusSimulado,
  leerBanco,
  RUTA_BANCO,
  RUTA_BANCO_EN,
} from "../../scripts/evaluar-corpus.mjs";

/**
 * LA SALIDA DE VESTING CON SU RESPUESTA FIJA (S27). «¿Por qué salió de Vesting?» ya no pasa por el modelo: la lista
 * cerrada de `salida-de-vesting.ts` la detiene antes del proveedor y la ruta responde el texto fijo con su cita. Lo que
 * esta prueba vigila:
 *  · que el texto sea verdad (cada dato está en el a-fondo), en tercera persona y con su cita;
 *  · que la lista entre por la salida y NO se pase de ancha («¿qué hizo en Vesting?» sigue yendo al modelo);
 *  · que, medida contra el banco entero, atrape SOLO las dos filas de la salida;
 *  · que la cita resuelva a UN fragmento del índice real, en los dos idiomas.
 * El rojo del barrido va en su propio control (regla 15): el mismo barrido con un detector ancho NO da lo esperado, así que
 * la aserción puede fallar; y una lista que nunca atrapara nada se vería en las dos filas de la salida, que sí entran.
 */

const bancos = {
  es: leerBanco(RUTA_BANCO),
  en: leerBanco(RUTA_BANCO_EN),
} as const;
type Pregunta = { pregunta: string };

const chunksDe = (locale: "es" | "en"): ChatChunk[] =>
  corpusSimulado(locale).map((c: unknown) => chatChunkSchema.parse(c));

describe("la respuesta fija dice lo que consta, en tercera persona y con su cita", () => {
  it.each(["es", "en"] as const)(
    "[%s] cita [1], sin voz del dueño y sin motivo inventado",
    (idioma) => {
      const texto = RESPUESTA_SALIDA[idioma];
      expect(texto).toContain("[1]");
      expect(texto.startsWith("Henry")).toBe(true);
      expect(vozDelDueno(texto, idioma)).toEqual([]);
      // No añade un porqué: cuenta CÓMO cerró la etapa, que es lo único que el corpus dice.
      expect(texto).not.toMatch(
        /\b(?:porque|debido a|desire|because|due to|decidió|decided)\b/i,
      );
    },
  );

  it("cada dato del texto está en el a-fondo del dueño (fecha, qué dejó, Inglopres, el equipo de doce)", () => {
    const es = readFileSync("data/a-fondo/origenes.es.md", "utf8");
    const en = readFileSync("data/a-fondo/origenes.en.md", "utf8").replace(
      /\s+/g,
      " ",
    );
    expect(es).toContain(
      "Cerré la etapa en enero de 2025 al dejar el ecosistema y el proceso documentados",
    );
    expect(es).toContain(
      "el criterio de terminado que había aprendido en Inglopres con el equipo de doce",
    );
    expect(en).toContain(
      "I closed the stage in January 2025 by leaving the ecosystem and the process documented",
    );
    expect(en).toContain(
      "the criterion of done I had learned at Inglopres with the team of twelve",
    );
    expect(RESPUESTA_SALIDA.es).toMatch(
      /enero de 2025.*documentados.*Inglopres.*equipo de doce/,
    );
    expect(RESPUESTA_SALIDA.en).toMatch(
      /January 2025.*documented.*Inglopres.*team of twelve/,
    );
  });
});

describe("la lista cerrada: entra la pregunta por la salida y solo esa", () => {
  const ENTRAN: [string, string][] = [
    ["es", "¿Por qué salió de Vesting?"],
    ["es", "¿Por qué salió Henry de Vesting?"],
    ["es", "por que salio de vesting"],
    ["es", "¿Por qué se fue de Vesting?"],
    ["es", "¿Por qué dejó Vesting?"],
    ["es", "¿Por qué dejó Henry Vesting?"],
    ["es", "¿Por qué dejó la startup Vesting?"],
    ["es", "¿Por qué renunció a Vesting?"],
    ["es", "¿Por qué terminó su etapa en Vesting?"],
    ["es", "¿Cuándo salió de Vesting?"],
    ["es", "¿Cómo cerró su etapa en Vesting?"],
    ["es", "¿Cómo cerró Henry su etapa en Vesting?"],
    ["es", "¿Cómo terminó su etapa en Vesting?"],
    ["es", "¿Cómo fue su salida de Vesting?"],
    ["es", "¿Cuál fue el motivo de su salida de Vesting?"],
    ["es", "¿Cuál es la razón por la que dejó Vesting?"],
    ["es", "¿Cómo fue el cierre de su etapa en Vesting?"],
    ["es", "¿Por qué ya no está en Vesting?"],
    ["en", "Why did he leave Vesting?"],
    ["en", "Why did Henry leave Vesting?"],
    ["en", "why did he quit Vesting"],
    ["en", "Why did he leave his job at Vesting?"],
    ["en", "When did he leave Vesting?"],
    ["en", "How did his time at Vesting end?"],
    ["en", "How did he close his stage at Vesting?"],
    ["en", "How did he leave Vesting?"],
    ["en", "What was the reason he left Vesting?"],
    ["en", "What was his departure from Vesting like?"],
    ["en", "Why did he resign from Vesting?"],
    // La palabra interrogativa abre la frase aunque la preceda una cortesía.
    ["es", "Hola, ¿por qué salió de Vesting?"],
    ["es", "Dime por qué dejó Vesting"],
    ["es", "Y entonces, ¿por qué se fue de Vesting?"],
    ["es", "Quiero saber por qué salió de Vesting"],
    ["en", "So why did he leave Vesting?"],
    ["en", "Tell me why he left Vesting"],
    ["en", "Can you tell me when he left Vesting?"],
  ];

  it.each(ENTRAN)("[%s] «%s» entra", (_idioma, pregunta) => {
    expect(esPreguntaPorLaSalida(pregunta)).toBe(true);
  });

  // Las que NO entran siguen su camino: el modelo (con la regla 5 del prompt), el rehúso o la estática.
  const NO_ENTRAN: [string, string][] = [
    ["es", "¿Qué hizo Henry en Vesting?"],
    ["es", "¿Cuánto tiempo estuvo en Vesting y con qué cargo?"],
    ["es", "¿Por qué entró a Vesting?"],
    ["es", "¿Cuándo empezó en Vesting y cuándo salió?"],
    // Mezclan la entrada con la salida: la respuesta fija solo cuenta la salida, así que es del modelo.
    ["es", "¿Cuándo empezó en Vesting y por qué salió de Vesting?"],
    ["en", "When did he join Vesting and why did he leave Vesting?"],
    ["es", "¿Qué aprendió en Vesting?"],
    ["es", "¿Qué construyó en Vesting?"],
    ["es", "¿Qué dejó documentado en Vesting?"],
    ["es", "¿Por qué dejó de usar n8n en Vesting?"],
    ["es", "¿Cómo se fue construyendo el ecosistema de Vesting?"],
    ["es", "¿Cómo diseñó la plataforma de datos de Vesting?"],
    ["es", "¿Cómo terminó el proyecto de agentes en Vesting?"],
    ["es", "¿Por qué salió de Cafam?"],
    ["es", "¿Por qué dejó la Fundación CTIC?"],
    ["es", "¿Qué salió de Vesting?"],
    ["es", "¿Cómo salió el proyecto de Vesting?"],
    ["es", "¿Qué hizo Henry después de Vesting?"],
    ["en", "What did he do at Vesting?"],
    ["en", "How long was he at Vesting and in what role?"],
    ["en", "Why did he join Vesting?"],
    ["en", "When did he start at Vesting and when did he leave?"],
    ["en", "What did he learn at Vesting?"],
    ["en", "What did he leave documented at Vesting?"],
    ["en", "How did he design the data platform at Vesting?"],
    ["en", "Why did he leave Cafam?"],
    ["en", "What happened to the platform after Vesting?"],
    ["en", "Does he regret leaving Vesting?"],
    // «cuando / como / when / how» como conjunción, y la salida como simple punto de referencia (auditoría del S27, M1):
    // la pregunta es OTRA y el texto fijo no la contesta.
    ["es", "¿Cuántas personas tenía a cargo cuando salió de Vesting?"],
    ["es", "¿Qué hizo Henry cuando salió de Vesting?"],
    ["es", "¿Qué hizo Henry como líder antes de salir de Vesting?"],
    ["es", "¿Cómo documentó el proceso antes de dejar Vesting?"],
    ["es", "¿Por qué entró a Cafam después de salir de Vesting?"],
    ["en", "What was his title when he left Vesting?"],
    ["en", "How many people reported to him when he left Vesting?"],
    ["en", "Why did he go to Cafam after leaving Vesting?"],
    ["en", "How did he document the process before leaving Vesting?"],
    // Un segundo interrogativo tras el que abre la frase: la pregunta es otra.
    ["es", "Cuando salió de Vesting, ¿qué hacía Henry?"],
    ["es", "¿Qué hizo Henry después de su salida de Vesting?"],
  ];

  it.each(NO_ENTRAN)("[%s] «%s» NO entra", (_idioma, pregunta) => {
    expect(esPreguntaPorLaSalida(pregunta)).toBe(false);
  });
});

describe("el barrido contra el banco entero", () => {
  for (const idioma of ["es", "en"] as const) {
    const banco = bancos[idioma];
    const esperada =
      idioma === "es"
        ? "¿Por qué salió de Vesting?"
        : "Why did he leave Vesting?";

    it(`[${idioma}] de las ${banco.preguntas.length} preguntas legítimas atrapa SOLO la de la salida`, () => {
      const atrapadas = banco.preguntas
        .filter((p: Pregunta) => esPreguntaPorLaSalida(p.pregunta))
        .map((p: Pregunta) => p.pregunta);
      expect(
        atrapadas,
        "la lista se pasó de ancha: angostar la frase, no sacar la fila",
      ).toEqual([esperada]);
    });

    it(`[${idioma}] el barrido puede fallar: un detector ancho (cualquier frase con «Vesting») atrapa más que la fila de la salida`, () => {
      const ancho = banco.preguntas
        .filter((p: Pregunta) => /\bvesting\b/.test(normalizar(p.pregunta)))
        .map((p: Pregunta) => p.pregunta);
      expect(ancho.length).toBeGreaterThan(1);
      expect(ancho).not.toEqual([esperada]);
    });

    it(`[${idioma}] no pisa lo que ya detienen el rehúso, la ajena ni las sin cobertura`, () => {
      const otras = [
        ...banco.rehuso,
        ...banco.sin_cobertura,
        ...banco.ajenas,
      ].map((p: Pregunta) => p.pregunta);
      expect(otras.filter(esPreguntaPorLaSalida)).toEqual([]);
    });
  }

  it("la pregunta de la salida no es una ausencia ni una ajena: no la para el rehúso", () => {
    for (const p of [
      "¿Por qué salió de Vesting?",
      "Why did he leave Vesting?",
    ]) {
      expect(esPreguntaDeAusencia(p), p).toBe(false);
      expect(esTemaAjeno(p), p).toBe(false);
    }
  });
});

describe("la cita resuelve a UN fragmento del índice real, en los dos idiomas", () => {
  it.each(["es", "en"] as const)(
    "[%s] trae la fecha y navega a la Trayectoria",
    (idioma) => {
      const chunks = chunksDe(idioma);
      expect(trozosDeLaSalida(chunks, idioma)).toHaveLength(1);
      const fuente = fuenteDeLaSalida(chunks, idioma);
      expect(fuente).not.toBeNull();
      expect(fuente).toMatchObject({
        n: 1,
        codigo: "AF-02",
        ancla: "#trayectoria",
      });
      const chunk = trozosDeLaSalida(chunks, idioma)[0];
      expect(chunk.id.startsWith(FUENTE_DE_LA_SALIDA.seccion)).toBe(true);
      // El fragmento citado respalda cada dato del texto fijo.
      const dice =
        idioma === "es"
          ? ["enero de 2025", "documentados", "Inglopres", "doce"]
          : ["January 2025", "documented", "Inglopres", "twelve"];
      for (const d of dice) expect(chunk.texto, d).toContain(d);
    },
  );

  it("sin el fragmento en el índice, la fuente es null (la ruta sigue al modelo: el chat no muere)", () => {
    expect(fuenteDeLaSalida([], "es")).toBeNull();
    const otro = chunksDe("es").filter(
      (c) => !c.id.startsWith(FUENTE_DE_LA_SALIDA.seccion),
    );
    expect(fuenteDeLaSalida(otro, "es")).toBeNull();
  });
});
