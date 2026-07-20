import type { LanguageModelUsage } from "ai";
import type pino from "pino";

/**
 * Tracking de costo por request (estándar 7): la materia prima del control
 * de presupuesto. Con free tier el costo esperado es US$0, pero los tokens
 * se loggean SIEMPRE — si un día llega factura, aquí está la traza.
 */
export function logUsoChat(
  log: pino.Logger,
  {
    proveedor,
    modelo,
    ms,
    usage,
  }: {
    proveedor: string;
    modelo: string;
    ms: number;
    usage: LanguageModelUsage;
  },
): void {
  log.info(
    {
      proveedor,
      modelo,
      ms,
      tokens_in: usage.inputTokens ?? 0,
      tokens_out: usage.outputTokens ?? 0,
    },
    "chat respuesta generada",
  );
}
