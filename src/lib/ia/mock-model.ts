import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV3 } from "ai/test";

/**
 * Proveedor `mock` del adapter (ADR-003): determinista, cero red. Es el que
 * usan unit/integration/e2e — la CI jamás llama a un proveedor real — y
 * además prueba el mecanismo de conmutación en sí. `CHAT_MOCK_MODE=error`
 * simula un proveedor caído (para el circuit breaker y el fallback).
 */

const RESPUESTA_MOCK =
  "Henry lideró la estrategia de datos en Vesting, construyendo desde cero " +
  "el ecosistema en Microsoft Fabric [1]. Su experiencia combina analítica, " +
  "plataformas de datos y agentes de IA en producción [1].";

export function crearModeloMock(modo: "ok" | "error" = "ok") {
  if (modo === "error") {
    return new MockLanguageModelV3({
      doStream: async () => {
        throw new Error("mock provider down (CHAT_MOCK_MODE=error)");
      },
    });
  }

  // En trozos (palabra a palabra) para que el streaming sea observable
  const palabras = RESPUESTA_MOCK.split(" ");
  const chunks: LanguageModelV3StreamPart[] = [
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

  return new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({ chunks, chunkDelayInMs: 5 }),
    }),
  });
}
