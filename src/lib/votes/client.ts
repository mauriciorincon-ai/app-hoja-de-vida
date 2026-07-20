import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { conteoSchema, type Conteo } from "./schemas";

/**
 * Cliente mínimo de Supabase para la votación del roadmap (S4, ADR-011).
 *
 * El anon key NO tiene escritura directa sobre la tabla `votes` (RLS sin
 * políticas); solo puede EJECUTAR las dos RPC SECURITY DEFINER. Todo el acceso
 * de la app pasa por aquí, del lado servidor. Si faltan las env vars, el módulo
 * reporta "no configurado" y el route devuelve "votación no disponible" — jamás
 * un contador inventado.
 */

export type VotesConfig = { url: string; anonKey: string };

/** Lee la config de env; null si falta cualquiera de las dos (feature apagada). */
export function getVotesConfig(): VotesConfig | null {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/** ¿Está la votación configurada y encendida? */
export function votacionEnabled(): boolean {
  return process.env.VOTACION_ENABLED !== "false" && getVotesConfig() !== null;
}

function makeClient(config: VotesConfig): SupabaseClient {
  return createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export class VotesUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("votación no disponible");
    this.name = "VotesUnavailableError";
    this.cause = cause;
  }
}

/**
 * Emite un voto y devuelve el conteo REAL resultante para (app, feature).
 * El número que retorna es el que la BD calculó tras insertar, en una sola
 * transacción — nunca un valor optimista del cliente.
 */
export async function emitirVoto(
  app: string,
  feature: string,
  client?: SupabaseClient,
): Promise<number> {
  const config = getVotesConfig();
  if (!config) throw new VotesUnavailableError("sin configuración");
  const sb = client ?? makeClient(config);

  const { data, error } = await sb.rpc("emitir_voto", {
    p_app: app,
    p_feature: feature,
  });
  if (error) throw new VotesUnavailableError(error);
  if (typeof data !== "number")
    throw new VotesUnavailableError("respuesta inesperada");
  return data;
}

/**
 * Lee el conteo agregado de todos los votos (una fila por app+feature).
 * Valida la forma con Zod antes de devolverla — nada crudo de la red pasa al
 * resto de la app.
 */
export async function leerConteo(client?: SupabaseClient): Promise<Conteo> {
  const config = getVotesConfig();
  if (!config) throw new VotesUnavailableError("sin configuración");
  const sb = client ?? makeClient(config);

  const { data, error } = await sb.rpc("conteo_votos");
  if (error) throw new VotesUnavailableError(error);

  const parsed = conteoSchema.safeParse(data ?? []);
  if (!parsed.success) throw new VotesUnavailableError(parsed.error);
  return parsed.data;
}
