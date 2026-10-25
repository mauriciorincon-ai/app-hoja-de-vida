import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV3 } from "ai/test";

/**
 * Proveedor `mock` del adapter (ADR-003): determinista, cero red. Es el que
 * usan unit/integration/e2e — la CI jamás llama a un proveedor real — y
 * además prueba el mecanismo de conmutación en sí. `CHAT_MOCK_MODE=error`
 * simula un proveedor caído (para el circuit breaker y el fallback).
 */

/**
 * La respuesta fija cita [1]; desde el S24 el panel muestra solo las fuentes
 * citadas (OM-16), así que el modelo simulado cita TODAS las que recibe en el
 * system prompt (`[1] … [n]`): las pruebas de la cita que navega a un bloque
 * exacto necesitan que ese chip exista, y un modelo real que cita lo que usa
 * hace lo mismo.
 */
const RESPUESTA_BASE =
  "Henry lideró la estrategia de datos en Vesting, construyendo desde cero " +
  "el ecosistema en Microsoft Fabric [1]. Su experiencia combina analítica, " +
  "plataformas de datos y agentes de IA en producción [1].";

/** Cuántas fuentes numeradas trae el system prompt (líneas `[1] titulo`, `[2] …`). */
function fuentesDelPrompt(prompt: ReadonlyArray<{ role: string; content: unknown }>): number {
  const system = prompt.find((m) => m.role === "system");
  const texto = typeof system?.content === "string" ? system.content : "";
  const ns = [...texto.matchAll(/^\[(\d+)\] /gm)].map((m) => Number(m[1]));
  return ns.length ? Math.max(...ns) : 1;
}

/** La respuesta base más una frase que cita las demás fuentes (`[2]`, `[3]`…). */
export function respuestaMock(fuentes: number): string {
  if (fuentes <= 1) return RESPUESTA_BASE;
  const otras = Array.from({ length: fuentes - 1 }, (_, i) => `[${i + 2}]`).join(" ");
  return `${RESPUESTA_BASE} El detalle de cada parte consta en las demás fuentes ${otras}.`;
}

export function crearModeloMock(modo: "ok" | "error" = "ok") {
  if (modo === "error") {
    return new MockLanguageModelV3({
      doStream: async () => {
        throw new Error("mock provider down (CHAT_MOCK_MODE=error)");
      },
    });
  }

  // En trozos (palabra a palabra) para que el streaming sea observable
  const trozos = (texto: string): LanguageModelV3StreamPart[] => {
    const palabras = texto.split(" ");
    return [
      { type: "stream-start", warnings: [] },
      { type: "text-start", id: "t1" },
      ...palabras.map((palabra, i): LanguageModelV3StreamPart => ({
        type: "text-delta",
        id: "t1",
        delta: i < palabras.length - 1 ? `${palabra} ` : palabra,
      })),
      { type: "text-end", id: "t1" },
      {
        type: "finish",
        finishReason: { unified: "stop", raw: "stop" },
        usage: {
          inputTokens: {
            total: 42,
            noCache: 42,
            cacheRead: undefined,
            cacheWrite: undefined,
          },
          outputTokens: { total: 38, text: 38, reasoning: undefined },
        },
      },
    ];
  };

  return new MockLanguageModelV3({
    doStream: async (opciones) => ({
      stream: simulateReadableStream({
        chunks: trozos(respuestaMock(fuentesDelPrompt(opciones.prompt))),
        chunkDelayInMs: 5,
      }),
    }),
  });
}
