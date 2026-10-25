import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
  CREDENCIALES_SIN_OBTENER,
  esPreguntaDeAusencia,
  normalizar,
  RESPUESTA_REHUSO,
} from "@/lib/ia/rehuso";
import { esTemaAjeno } from "@/lib/ia/tema-ajeno";
import { vozDelDueno } from "@/lib/ia/voz-del-dueno";
import {
  leerBanco,
  RUTA_BANCO,
  RUTA_BANCO_EN,
} from "../../scripts/evaluar-corpus.mjs";

/**
 * EL REHÚSO Y LA PREGUNTA AJENA (S24, OM-12 y OM-16). Lo que la CI SÍ puede
 * probar de lo que el chat dice sin llamar al modelo real: las dos listas
 * cerradas que lo detienen ANTES del proveedor, medidas contra el banco
 * entero. Lo que el modelo diga después lo mide la pasada en vivo.
 *
 * Cada barrido tiene su rojo en el mismo archivo: una lista que nunca
 * rechaza nada pasaría por casualidad las +350 aserciones de «ninguna
 * pregunta legítima se rehúsa» (regla 15).
 */

const bancos = {
  es: leerBanco(RUTA_BANCO),
  en: leerBanco(RUTA_BANCO_EN),
} as const;

type Pregunta = { pregunta: string };

describe("la pregunta que pide una ausencia se rehúsa", () => {
  const SI: [string, string][] = [
    ["es", "¿Qué no ha hecho nunca y tendría que aprender?"],
    ["es", "¿Qué no ha hecho nunca?"],
    ["es", "¿Qué tecnologías no domina?"],
    ["es", "¿Qué cosas nunca ha usado?"],
    ["es", "¿Qué certificaciones no tiene?"],
    ["es", "Dime qué no sabe hacer"],
    ["es", "¿Cuáles nunca ha liderado?"],
    ["es", "¿Hay algo que no sepa hacer?"],
    ["es", "¿Qué le falta por aprender?"],
    ["es", "¿Cuáles son sus debilidades?"],
    ["es", "¿Cuál es su mayor debilidad?"],
    ["es", "¿Cuáles son sus puntos débiles?"],
    ["es", "¿En qué áreas de mejora está trabajando?"],
    ["es", "¿Tiene el AI-102?"],
    ["es", "¿Por qué no tiene el AI-102?"],
    ["es", "¿Pasó el examen AI102?"],
    ["es", "¿Qué pasó con el DP-100?"],
    ["es", "¿Cuáles son sus expectativas salariales?"],
    ["es", "¿Cuánto gana?"],
    ["es", "¿Cuál es su disponibilidad para empezar?"],
    ["es", "¿Cuándo puede empezar?"],
    ["es", "¿Tiene disponibilidad para viajar?"],
    ["en", "What has he never done and would have to learn?"],
    ["en", "What hasn't he done?"],
    ["en", "What technologies doesn't he know?"],
    ["en", "What is he missing?"],
    ["en", "Is there anything he doesn't know?"],
    ["en", "What are his weaknesses?"],
    ["en", "What is his biggest weakness?"],
    ["en", "Does he have the AI-102?"],
    ["en", "Did he pass the DP-100 exam?"],
    ["en", "What are his salary expectations?"],
    ["en", "When is he available to start?"],
    ["en", "Is he available to travel?"],
  ];

  it.each(SI)("[%s] «%s» se rehúsa", (_idioma, pregunta) => {
    expect(esPreguntaDeAusencia(pregunta)).toBe(true);
  });

  /**
   * LA FRONTERA que el dueño pidió (decisión 5): el método ante lo no usado, los
   * «límites» de una pieza y las preguntas con una negación que cuelga de otra
   * oración se siguen contestando.
   */
  const NO: [string, string][] = [
    ["es", "¿Qué hace cuando el puesto pide algo que no ha usado nunca?"],
    ["es", "¿Cómo aprende una tecnología que no conoce?"],
    ["es", "¿Qué pasa si no conoce una herramienta?"],
    ["es", "¿Qué dice la ficha de Probeta DS sobre sus límites?"],
    [
      "es",
      "¿Cuáles son los límites de la ficha del tablero de energía y clima?",
    ],
    ["es", "¿Qué estudió Henry?"],
    ["es", "¿Qué certificaciones tiene?"],
    ["es", "¿Qué experiencia tiene con Microsoft Fabric?"],
    ["es", "¿Qué hizo en Vesting?"],
    ["es", "¿Por qué salió de Vesting?"],
    ["es", "¿Qué muestra el tablero de energía y clima?"],
    ["es", "¿Cuál es la disponibilidad de los datos en el tablero?"],
    ["en", "What does he do when a job asks for something he has never used?"],
    ["en", "How does he learn a technology he doesn't know?"],
    ["en", "What happens if he doesn't know a tool?"],
    ["en", "What does the Probeta DS sheet say about its limits?"],
    ["en", "What did he study?"],
    ["en", "Which certifications does he hold?"],
    ["en", "What did he do at Vesting?"],
  ];

  it.each(NO)("[%s] «%s» se sigue contestando", (_idioma, pregunta) => {
    expect(esPreguntaDeAusencia(pregunta)).toBe(false);
  });

  it("no depende del idioma de la página: quien navega en español puede escribir en inglés", () => {
    expect(esPreguntaDeAusencia("what has he never done?")).toBe(true);
    expect(esPreguntaDeAusencia("¿tiene el AI-102?")).toBe(true);
  });

  it("normaliza acentos, mayúsculas, apóstrofos y puntuación", () => {
    expect(normalizar("¿Qué NO ha hecho NUNCA?")).toBe("que no ha hecho nunca");
    expect(normalizar("What hasn’t he done?")).toBe("what hasnt he done");
    expect(normalizar("AI-102")).toBe("ai 102");
  });
});

describe("el barrido contra el banco entero", () => {
  for (const idioma of ["es", "en"] as const) {
    const banco = bancos[idioma];

    it(`[${idioma}] ninguna de las ${banco.preguntas.length} preguntas legítimas se rehúsa ni se declina como ajena`, () => {
      const caidas = banco.preguntas
        .filter(
          (p: Pregunta) =>
            esPreguntaDeAusencia(p.pregunta) || esTemaAjeno(p.pregunta),
        )
        .map((p: Pregunta) => p.pregunta);
      expect(
        caidas,
        "una pregunta legítima no puede quedar detrás del rehúso: angostar la frase, no sacar la fila",
      ).toEqual([]);
    });

    it(`[${idioma}] las preguntas de la sección «rehuso» las para el detector`, () => {
      expect(banco.rehuso.length).toBeGreaterThan(0);
      const sueltas = banco.rehuso
        .filter((p: Pregunta) => !esPreguntaDeAusencia(p.pregunta))
        .map((p: Pregunta) => p.pregunta);
      expect(sueltas).toEqual([]);
    });

    it(`[${idioma}] las ${banco.sin_cobertura.length} sin cobertura (salario, disponibilidad, viajar) reciben el rehúso`, () => {
      const sueltas = banco.sin_cobertura
        .filter((p: Pregunta) => !esPreguntaDeAusencia(p.pregunta))
        .map((p: Pregunta) => p.pregunta);
      expect(sueltas).toEqual([]);
    });
  }

  it("el banco inglés trae el mismo número de preguntas de rehúso que el español", () => {
    expect(bancos.en.rehuso.length).toBe(bancos.es.rehuso.length);
  });

  /** El rojo del barrido: sin esto, una lista vacía también pasaría. */
  it("el detector rechaza algo (no pasa por casualidad)", () => {
    const todas = [...bancos.es.preguntas, ...bancos.en.preguntas].map(
      (p: Pregunta) => p.pregunta,
    );
    const rehusadas = [...bancos.es.rehuso, ...bancos.en.rehuso].map(
      (p: Pregunta) => p.pregunta,
    );
    expect(rehusadas.length).toBeGreaterThan(0);
    expect(rehusadas.every(esPreguntaDeAusencia)).toBe(true);
    expect(todas.some(esPreguntaDeAusencia)).toBe(false);
  });
});

describe("las credenciales sin obtener coinciden con el YAML del dueño", () => {
  it("AI-102 y DP-100 son las que `credenciales-nombradas.yaml` declara sin obtener", () => {
    const yaml = parse(
      readFileSync("data/credenciales-nombradas.yaml", "utf8"),
    ) as {
      credenciales?: { codigo?: string; estado?: string }[];
    };
    const crudo = readFileSync("data/credenciales-nombradas.yaml", "utf8");
    for (const c of CREDENCIALES_SIN_OBTENER) {
      expect(
        crudo.includes(c),
        `${c} debe figurar en credenciales-nombradas.yaml`,
      ).toBe(true);
      expect(esPreguntaDeAusencia(`¿Tiene el ${c}?`)).toBe(true);
    }
    expect(yaml).toBeTruthy();
  });
});

describe("la respuesta fija está en tercera persona y en los dos idiomas", () => {
  it("nombra a Henry y no usa la voz del dueño", () => {
    for (const idioma of ["es", "en"] as const) {
      const texto = RESPUESTA_REHUSO[idioma];
      expect(texto).toContain("Henry");
      expect(
        vozDelDueno(texto, idioma),
        `voz del dueño en el rehúso ${idioma}`,
      ).toEqual([]);
    }
  });

  it("no afirma ninguna ausencia: no dice que «no hizo», «no sabe» ni «no tiene»", () => {
    for (const idioma of ["es", "en"] as const) {
      expect(RESPUESTA_REHUSO[idioma]).not.toMatch(
        /no (?:hizo|ha hecho|sabe|tiene|conoce|domina)|(?:didn.t|hasn.t|doesn.t) (?:do|have|know)|never/i,
      );
    }
  });

  it("es el mismo texto de `chat.fallbackVacio` en `messages/`", () => {
    for (const idioma of ["es", "en"] as const) {
      const mensajes = JSON.parse(
        readFileSync(`messages/${idioma}.json`, "utf8"),
      ) as {
        chat: { fallbackVacio: string };
      };
      expect(mensajes.chat.fallbackVacio).toBe(RESPUESTA_REHUSO[idioma]);
    }
  });
});

describe("la pregunta ajena recibe la respuesta fija, sin fuentes", () => {
  it.each([
    "¿Cómo está el clima?",
    "¿cómo está el clima hoy?",
    "how is the weather today?",
    "cuéntame un chiste de gatos",
    "tell me a joke about cats",
    "¿cuál es la receta del ajiaco?",
    "recomiéndame una película para el fin de semana",
    "escríbeme una función en rust que ordene una lista",
    "write a rust function that sorts a list",
  ])("«%s» es ajena", (pregunta) => {
    expect(esTemaAjeno(pregunta)).toBe(true);
  });

  it.each([
    "¿Qué muestra el tablero de energía y clima?",
    "What does the energy and climate dashboard show?",
    "¿Qué hizo en Vesting?",
    "How does he translate business needs into models?",
    "¿Cómo se construye una función de pérdida para el modelo?",
    "¿Tiene experiencia con series de tiempo del clima?",
  ])("«%s» NO es ajena", (pregunta) => {
    expect(esTemaAjeno(pregunta)).toBe(false);
  });

  it("las 15 ajenas declaradas del banco, por idioma, las para el detector", () => {
    for (const idioma of ["es", "en"] as const) {
      const sueltas = bancos[idioma].ajenas
        .filter((a: Pregunta) => !esTemaAjeno(a.pregunta))
        .map((a: Pregunta) => a.pregunta);
      expect(sueltas, `ajenas [${idioma}] que el detector deja pasar`).toEqual(
        [],
      );
    }
  });
});
