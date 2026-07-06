import type { UIMessage } from "ai";
import { z } from "zod";

/**
 * Contratos del chat (estándar 7 / skill ia-embebida): todo lo que cruza la
 * frontera app↔LLM o server↔cliente pasa por estos esquemas. Nada del LLM se
 * persiste (sin DB en este sprint) — la validación protege el request y el
 * índice, no una base de datos.
 */

/** Un chunk del índice de conocimiento (ADR-010). `ancla` es locale-agnóstica. */
export const chatChunkSchema = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  texto: z.string().min(1),
  ancla: z.string().min(1),
});
export type ChatChunk = z.infer<typeof chatChunkSchema>;

export const chatIndexSchema = z.object({
  version: z.number().int(),
  locale: z.enum(["es", "en"]),
  chunks: z.array(chatChunkSchema).min(1),
});
export type ChatIndex = z.infer<typeof chatIndexSchema>;

/** Falla con diagnóstico legible si el índice generado está malformado. */
export function parseChatIndex(data: unknown, origen: string): ChatIndex {
  const result = chatIndexSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Índice del chat inválido en ${origen}:\n${issues}`);
  }
  return result.data;
}

/** Historial corto: 12 mensajes ≈ 6 turnos — control de contexto y de factura. */
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(800),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatRequestSchema = z.object({
  locale: z.enum(["es", "en"]),
  messages: z.array(chatMessageSchema).min(1).max(12),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

/** Cita enviada al cliente como data part del stream: [n] → destino navegable. */
export const fuenteSchema = z.object({
  n: z.number().int().min(1),
  titulo: z.string().min(1),
  ancla: z.string().min(1),
});
export type Fuente = z.infer<typeof fuenteSchema>;

/**
 * Data parts tipadas del stream UIMessage (server → panel):
 * - `data-fuentes`: citas navegables de la respuesta.
 * - `data-offtopic`: la respuesta fue la estática (cero tokens) — analytics.
 */
export type ChatDataParts = {
  fuentes: Fuente[];
  offtopic: boolean;
};
export type ChatUIMessage = UIMessage<unknown, ChatDataParts>;
