import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
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
function retrieverReal(locale: "es" | "en") {
  const read = (f: string) =>
    parse(readFileSync(path.join(process.cwd(), "data", f), "utf8"));
  const chunks = buildChunks({
    cv: read(`cv.${locale}.yaml`),
    apps: read("apps.yaml"),
    historia: [],
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
  const preguntasOffTopic = [
    "cuéntame un chiste de gatos",
    "¿va a llover mañana en Madrid?",
    "hazme la tarea de cálculo integral",
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
