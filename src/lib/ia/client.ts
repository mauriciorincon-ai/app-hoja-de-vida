import { streamText, type ModelMessage } from "ai";
import type { ModeloResuelto } from "./provider";

/**
 * ÚNICO punto de llamada al LLM (regla de oro del skill ia-embebida): la UI
 * jamás llama al proveedor; el route handler usa este módulo con el modelo
 * resuelto por el adapter. Límites de presupuesto horneados aquí.
 */

export const CHAT_MAX_OUTPUT_TOKENS = 600;
export const CHAT_TIMEOUT_MS = 30_000;

export function streamRespuesta({
  modelo,
  system,
  messages,
}: {
  modelo: ModeloResuelto;
  system: string;
  messages: ModelMessage[];
}) {
  return streamText({
    model: modelo.model,
    system,
    messages,
    maxOutputTokens: CHAT_MAX_OUTPUT_TOKENS,
    abortSignal: AbortSignal.timeout(CHAT_TIMEOUT_MS),
  });
}
