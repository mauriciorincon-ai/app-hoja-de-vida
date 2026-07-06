import type { LanguageModel } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createAzure } from "@ai-sdk/azure";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { crearModeloMock } from "./mock-model";

/**
 * Adapter multi-proveedor por env (ADR-003): cambiar de proveedor = cambiar
 * `CHAT_PROVIDER` + su API key. Cero código. Groq es el inicial (elección
 * del usuario); los demás quedan listos-para-env.
 *
 * Si la configuración del proveedor activo está incompleta (p. ej. sin API
 * key), devuelve `null` y el endpoint degrada a búsqueda local — el chat
 * nunca muere.
 */

export const PROVEEDORES_CHAT = [
  "groq",
  "gemini",
  "azure",
  "anthropic",
  "openai-compatible",
  "mock",
] as const;
export type ProveedorChat = (typeof PROVEEDORES_CHAT)[number];

export type ModeloResuelto = {
  proveedor: ProveedorChat;
  modelId: string;
  model: LanguageModel;
};

const MODELO_DEFAULT: Partial<Record<ProveedorChat, string>> = {
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-2.5-flash",
  anthropic: "claude-haiku-4-5",
};

export function resolverProveedor(
  env: NodeJS.ProcessEnv = process.env,
): ModeloResuelto | null {
  const proveedor = (env.CHAT_PROVIDER ?? "groq") as ProveedorChat;
  const modelId = env.CHAT_MODEL || MODELO_DEFAULT[proveedor] || "";

  switch (proveedor) {
    case "groq": {
      if (!env.GROQ_API_KEY || !modelId) return null;
      const groq = createGroq({ apiKey: env.GROQ_API_KEY });
      return { proveedor, modelId, model: groq(modelId) };
    }
    case "gemini": {
      if (!env.GOOGLE_GENERATIVE_AI_API_KEY || !modelId) return null;
      const google = createGoogleGenerativeAI({
        apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      return { proveedor, modelId, model: google(modelId) };
    }
    case "azure": {
      // modelId = nombre del deployment en Azure AI Foundry (demo AI-102)
      if (!env.AZURE_RESOURCE_NAME || !env.AZURE_API_KEY || !modelId) {
        return null;
      }
      const azure = createAzure({
        resourceName: env.AZURE_RESOURCE_NAME,
        apiKey: env.AZURE_API_KEY,
      });
      return { proveedor, modelId, model: azure(modelId) };
    }
    case "anthropic": {
      if (!env.ANTHROPIC_API_KEY || !modelId) return null;
      const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });
      return { proveedor, modelId, model: anthropic(modelId) };
    }
    case "openai-compatible": {
      // Self-host (ollama, vLLM, LM Studio…): baseURL obligatoria, key opcional
      if (!env.CHAT_BASE_URL || !modelId) return null;
      const selfHost = createOpenAICompatible({
        name: "self-host",
        baseURL: env.CHAT_BASE_URL,
        apiKey: env.CHAT_API_KEY,
      });
      return { proveedor, modelId, model: selfHost(modelId) };
    }
    case "mock": {
      const modo = env.CHAT_MOCK_MODE === "error" ? "error" : "ok";
      return {
        proveedor,
        modelId: `mock-${modo}`,
        model: crearModeloMock(modo),
      };
    }
    default:
      return null;
  }
}

/** Kill-switch por env: `CHAT_ENABLED=false` apaga el chat entero. */
export function chatHabilitado(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.CHAT_ENABLED !== "false";
}
