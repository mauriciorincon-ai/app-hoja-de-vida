import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import {
  CODIGO_INTENTOS_MAX,
  CODIGO_VIGENCIA_MS,
  CUPO_VENTANA_HORAS,
  TOPE_DIARIO_DEFECTO,
  type Cupo,
  type EntradaRegistro,
} from "./schemas";

/**
 * El almacén de la barrera y del registro. Dos implementaciones con el mismo
 * contrato: Supabase (producción: RLS encendida sin políticas, todo por RPC
 * SECURITY DEFINER, patrón ADR-011) y memoria (e2e, integración y desarrollo
 * sin base de datos; se declara con CHAT_GATE_STORE=memory y NUNCA guarda nada
 * más allá del proceso).
 */

export type ResultadoVerificacion =
  | { ok: true }
  | { ok: false; motivo: "sin_codigo" | "vencido" | "agotado" | "incorrecto" };

export type RegistroStore = {
  /** Guarda (o reemplaza) el hash del código vigente para ese correo. */
  guardarCodigo(email: string, hash: string, ahora?: number): Promise<void>;
  /** Compara y consume: un código correcto se borra; uno incorrecto suma intento. */
  verificarCodigo(
    email: string,
    hash: string,
    coincide: (guardado: string, recibido: string) => boolean,
    ahora?: number,
  ): Promise<ResultadoVerificacion>;
  /** Una fila por pregunta respondida (`ahora` solo lo usa la memoria). */
  registrar(entrada: EntradaRegistro, ahora?: number): Promise<void>;
  /**
   * ¿Puede preguntar? Cuenta sus preguntas de las últimas `CUPO_VENTANA_HORAS`
   * en el registro y mira la lista de bloqueados (2026-09-26).
   */
  cupo(email: string, limite: number, ahora?: number): Promise<Cupo>;
};

export class RegistroUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("registro del chat no disponible");
    this.name = "RegistroUnavailableError";
    this.cause = cause;
  }
}

// ── Memoria ─────────────────────────────────────────────────────────────────

type CodigoEnMemoria = { hash: string; expira: number; intentos: number };

export function crearStoreEnMemoria(): RegistroStore & {
  entradas: EntradaRegistro[];
  codigos: Map<string, CodigoEnMemoria>;
  bloqueados: Set<string>;
  /** Cuándo se registró cada pregunta, por correo: lo que cuenta el cupo. */
  momentos: Map<string, number[]>;
} {
  const codigos = new Map<string, CodigoEnMemoria>();
  const entradas: EntradaRegistro[] = [];
  const bloqueados = new Set<string>();
  const momentos = new Map<string, number[]>();
  return {
    codigos,
    entradas,
    bloqueados,
    momentos,
    async guardarCodigo(email, hash, ahora = Date.now()) {
      codigos.set(email, {
        hash,
        expira: ahora + CODIGO_VIGENCIA_MS,
        intentos: 0,
      });
    },
    async verificarCodigo(email, hash, coincide, ahora = Date.now()) {
      const c = codigos.get(email);
      if (!c) return { ok: false, motivo: "sin_codigo" };
      if (c.expira <= ahora) {
        codigos.delete(email);
        return { ok: false, motivo: "vencido" };
      }
      if (c.intentos >= CODIGO_INTENTOS_MAX) {
        codigos.delete(email);
        return { ok: false, motivo: "agotado" };
      }
      if (!coincide(c.hash, hash)) {
        c.intentos += 1;
        return { ok: false, motivo: "incorrecto" };
      }
      codigos.delete(email);
      return { ok: true };
    },
    async registrar(entrada, ahora = Date.now()) {
      entradas.push(entrada);
      const email = entrada.email.toLowerCase();
      momentos.set(email, [...(momentos.get(email) ?? []), ahora]);
    },
    async cupo(email, limite, ahora = Date.now()) {
      const clave = email.toLowerCase();
      if ([...bloqueados].some((b) => b.toLowerCase() === clave))
        return "bloqueado";
      const desde = ahora - CUPO_VENTANA_HORAS * 60 * 60_000;
      const recientes = (momentos.get(clave) ?? []).filter((t) => t > desde);
      return recientes.length >= limite ? "tope" : "ok";
    },
  };
}

// ── Supabase ────────────────────────────────────────────────────────────────

const cupoRpcSchema = z.enum(["ok", "tope", "bloqueado"]);

const verificacionRpcSchema = z.enum([
  "ok",
  "sin_codigo",
  "vencido",
  "agotado",
  "incorrecto",
]);

export function crearStoreSupabase(client: SupabaseClient): RegistroStore {
  return {
    async guardarCodigo(email, hash) {
      const { error } = await client.rpc("chat_guardar_codigo", {
        p_email: email,
        p_hash: hash,
        p_vigencia_s: Math.floor(CODIGO_VIGENCIA_MS / 1000),
      });
      if (error) throw new RegistroUnavailableError(error);
    },
    async verificarCodigo(email, hash) {
      // La comparación la hace la BD en la misma transacción (consume el
      // código si coincide, suma intento si no); `coincide` no aplica aquí.
      const { data, error } = await client.rpc("chat_verificar_codigo", {
        p_email: email,
        p_hash: hash,
        p_intentos_max: CODIGO_INTENTOS_MAX,
      });
      if (error) throw new RegistroUnavailableError(error);
      const parsed = verificacionRpcSchema.safeParse(data);
      if (!parsed.success)
        throw new RegistroUnavailableError("respuesta inesperada");
      return parsed.data === "ok"
        ? { ok: true }
        : { ok: false, motivo: parsed.data };
    },
    async registrar(entrada) {
      const { error } = await client.rpc("chat_registrar", {
        p_nombre: entrada.nombre,
        p_email: entrada.email,
        p_locale: entrada.locale,
        p_pregunta: entrada.pregunta,
        p_respuesta: entrada.respuesta,
        p_fuentes: entrada.fuentes,
        p_modo: entrada.modo,
        p_proveedor: entrada.proveedor ?? null,
        p_modelo: entrada.modelo ?? null,
        p_tokens_in: entrada.tokensIn ?? null,
        p_tokens_out: entrada.tokensOut ?? null,
        p_ms: entrada.ms ?? null,
      });
      if (error) throw new RegistroUnavailableError(error);
    },
    async cupo(email, limite) {
      const { data, error } = await client.rpc("chat_cupo", {
        p_email: email,
        p_limite: limite,
        p_horas: CUPO_VENTANA_HORAS,
      });
      if (error) throw new RegistroUnavailableError(error);
      const parsed = cupoRpcSchema.safeParse(data);
      if (!parsed.success)
        throw new RegistroUnavailableError("respuesta inesperada");
      return parsed.data;
    },
  };
}

// ── Resolución por entorno ──────────────────────────────────────────────────

let memoria: ReturnType<typeof crearStoreEnMemoria> | null = null;

/** ¿La barrera está encendida? Por defecto sí; `CHAT_GATE=off` la apaga (solo dev). */
export function gateHabilitado(): boolean {
  return process.env.CHAT_GATE !== "off";
}

/**
 * Cuántas preguntas por persona cada 24 horas. `CHAT_TOPE_DIARIO` en Vercel lo
 * cambia sin tocar código (un entero de 1 a 1000); cualquier otro valor cae al
 * de siempre, 20, en vez de apagar la protección.
 */
export function topeDiario(): number {
  const crudo = process.env.CHAT_TOPE_DIARIO;
  if (!crudo || !/^\d+$/.test(crudo.trim())) return TOPE_DIARIO_DEFECTO;
  const n = Number(crudo.trim());
  return n >= 1 && n <= 1000 ? n : TOPE_DIARIO_DEFECTO;
}

/**
 * El almacén según el entorno. `memory` es explícito; Supabase exige URL y
 * anon key. Sin ninguno → null, y los endpoints responden 503 honesto.
 */
export function resolverStore(): RegistroStore | null {
  if (process.env.CHAT_GATE_STORE === "memory") {
    memoria ??= crearStoreEnMemoria();
    return memoria;
  }
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return crearStoreSupabase(
    createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  );
}

/** Solo para tests: descarta el almacén en memoria compartido. */
export function resetStoreEnMemoria(): void {
  memoria = null;
}
