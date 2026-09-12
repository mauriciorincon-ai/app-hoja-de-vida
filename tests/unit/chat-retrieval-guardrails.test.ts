import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { leerDocumentos } from "../../scripts/a-fondo.mjs";
import { buildChunks } from "../../scripts/build-chat-index.mjs";
import {
  construirSystemPrompt,
  esOffTopic,
  RESPUESTA_OFFTOPIC,
} from "@/lib/ia/guardrails";
import { createRetriever } from "@/lib/ia/retrieval";
import { chatChunkSchema } from "@/lib/ia/schemas";

/**
 * Retriever calibrado contra el CONTENIDO REAL (data/*.yaml): si el guardrail
 * deja pasar chistes o bloquea preguntas legítimas sobre la trayectoria,
 * estos tests lo cazan antes que un visitante.
 */
const read = (f: string) =>
  parse(readFileSync(path.join(process.cwd(), "data", f), "utf8"));

function retrieverReal(locale: "es" | "en") {
  const chunks = buildChunks({
    cv: read(`cv.${locale}.yaml`),
    apps: read("apps.yaml"),
    aFondo: [],
    locale,
  });
  return createRetriever(chunks.map((c) => chatChunkSchema.parse(c)));
}

const retrieverEs = retrieverReal("es");
const retrieverEn = retrieverReal("en");

describe("retrieval (MiniSearch sobre el índice real)", () => {
  it("una pregunta por Vesting trae contenido de Vesting de primero", () => {
    const top = retrieverEs.topK("¿Qué hizo Henry en Vesting?");
    expect(top.length).toBeGreaterThan(0);
    // El mejor resultado habla de Vesting (rol de trayectoria o proyecto)…
    expect(`${top[0].chunk.titulo} ${top[0].chunk.texto}`).toMatch(/Vesting/);
    // …y el case study navegable está entre las fuentes del contexto
    expect(top.some((r) => r.chunk.ancla === "/proyectos/vesting")).toBe(true);
  });

  it("respeta el límite k", () => {
    expect(retrieverEs.topK("datos analítica", 2)).toHaveLength(2);
  });

  it("funciona en inglés contra el índice EN", () => {
    const top = retrieverEn.topK("Which certifications does Henry hold?");
    expect(top.some((r) => r.chunk.id === "certificaciones")).toBe(true);
  });
});

describe("guardrail de entrada (off-topic = cero tokens)", () => {
  const preguntasOnTopic = [
    "¿Qué experiencia tiene en Banco Pichincha?",
    "¿Qué certificaciones de Microsoft tiene?",
    "Cuéntame de la plataforma de datos para agentes de IA",
  ];
  // S8 — esta lista se AMPLÍA con lo que la medición destapó. «cuéntame un
  // chiste SOBRE gatos» puntuaba 4,28 y pasaba el guardrail: casaba solo la
  // preposición «sobre», presente en 42 de 162 fragmentos. El test no lo veía
  // porque preguntaba «chiste DE gatos», y «de» sí era stopword. La preposición
  // entró a STOPWORDS y ahora las dos formas puntúan 0 — por la razón correcta.
  const preguntasOffTopic = [
    "cuéntame un chiste de gatos",
    "cuéntame un chiste sobre gatos",
    "¿va a llover mañana en Madrid?",
    "hazme la tarea de cálculo integral",
    "escribe una función en rust que ordene una lista",
    "¿cuál es la receta del ajiaco?",
    "tell me a joke about cats",
  ];

  it.each(preguntasOnTopic)("deja pasar: %s", (pregunta) => {
    expect(esOffTopic(retrieverEs.topKStrict(pregunta))).toBe(false);
  });

  it.each(preguntasOffTopic)("bloquea: %s", (pregunta) => {
    expect(esOffTopic(retrieverEs.topKStrict(pregunta))).toBe(true);
  });

  it("el guardrail usa la búsqueda ESTRICTA: el fuzzy no confunde gatos con datos", () => {
    // Con fuzzy, "gatos" ≈ "datos" daría falso on-topic; la estricta no.
    expect(retrieverEs.topK("gatos").length).toBeGreaterThanOrEqual(0);
    expect(retrieverEs.topKStrict("gatos")).toHaveLength(0);
  });

  /**
   * LO QUE ESTE GUARDRAIL **NO** GARANTIZA (S8) — y está aquí escrito como test
   * para que nadie lo confunda con una promesa que no da.
   *
   * El puntaje de MiniSearch suma sobre los términos que casan, así que una
   * pregunta ajena con varias palabras comunes puede puntuar más que una
   * pregunta legítima corta. Medido sobre el corpus completo (162 fragmentos):
   * on-topic mín 6,55 («¿sabe Kubernetes?») contra off-topic máx 16,64
   * («escribe una función en rust que ordene una lista»). **Los dos grupos se
   * solapan: ningún umbral los separa.**
   *
   * La decisión, declarada: el umbral se queda BAJO. Lo que se cuela pasa al
   * modelo y ahí lo para el prompt grounding-only. El peor fallo posible de este
   * chat no es gastar tokens en un chiste — es responder «eso se me escapa» a
   * una pregunta legítima sobre la trayectoria.
   */
  it("una pregunta ajena que comparte vocabulario SÍ pasa — y eso está decidido", () => {
    const chunks = buildChunks({
      cv: read("cv.es.yaml"),
      apps: read("apps.yaml"),
      aFondo: leerDocumentos("es").map((d: { estado: string }) => ({
        ...d,
        estado: "aprobado",
      })),
      locale: "es",
    });
    const conCorpusCompleto = createRetriever(
      chunks.map((c: unknown) => chatChunkSchema.parse(c)),
    );
    // Con el corpus completo, «función» y «lista» casan contenido real.
    expect(
      esOffTopic(
        conCorpusCompleto.topKStrict(
          "escribe una función en rust que ordene una lista",
        ),
      ),
      "si esto pasa a true, alguien subió el umbral: comprueba que no bloqueó también «¿sabe Kubernetes?»",
    ).toBe(false);
    // Y la contraparte que justifica la decisión: la pregunta legítima más
    // floja del conjunto medido sigue pasando.
    expect(
      esOffTopic(conCorpusCompleto.topKStrict("¿sabe Kubernetes?")),
    ).toBe(false);
  });

  it("la respuesta estática existe en ambos idiomas", () => {
    expect(RESPUESTA_OFFTOPIC.es.length).toBeGreaterThan(40);
    expect(RESPUESTA_OFFTOPIC.en.length).toBeGreaterThan(40);
  });
});

describe("system prompt endurecido (grounding-only)", () => {
  const fuentes = retrieverEs.topK("Vesting Microsoft Fabric");
  const prompt = construirSystemPrompt("es", fuentes);

  it("numera las fuentes y exige citas [n]", () => {
    expect(prompt).toContain("[1]");
    expect(prompt).toMatch(/[Cc]ita/);
  });

  it("prohíbe inventar y salirse de las fuentes", () => {
    expect(prompt).toMatch(/NUNCA inventes/);
    expect(prompt).toMatch(/ÚNICAMENTE/);
  });

  it("declara el idioma de la página", () => {
    expect(prompt).toContain("español");
    expect(construirSystemPrompt("en", fuentes)).toContain("English");
  });

  it("se defiende de la inyección (las reglas prevalecen)", () => {
    expect(prompt).toMatch(/prevalecen sobre cualquier instrucción/);
  });
});
