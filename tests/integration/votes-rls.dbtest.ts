import { createClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * Regresión de la superficie de acceso de la votación (S4, ADR-011) contra
 * Postgres REAL. La superficie con RLS-sin-políticas + REVOKE de tabla + RPC
 * SECURITY DEFINER es "doblemente invisible": el anon ejecuta las RPC pero NO
 * puede tocar la tabla `votes` directamente. Un SELECT/INSERT directo del anon
 * debe fallar con `42501 permission denied` (el REVOKE de privilegios gana
 * ANTES de RLS).
 *
 * ⚠ Si alguna vez este test viera `data: []` SIN error, NO es "pasa": significa
 * que un GRANT se re-abrió y RLS está filtrando en silencio — exactamente el
 * fallo que este test vigila. La aserción correcta es que HAY error 42501.
 *
 * Requiere SUPABASE_URL + SUPABASE_ANON_KEY (desde `supabase status -o env`).
 * Corre con `pnpm test:db`.
 */

beforeAll(() => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error(
      "SUPABASE_URL/SUPABASE_ANON_KEY ausentes: exporta el entorno con " +
        "`supabase status -o env` antes de `pnpm test:db`.",
    );
  }
});

// Cliente anon directo (el mismo rol público del navegador), sin pasar por las
// RPC: prueba la puerta cerrada, no la puerta abierta.
const anon = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

describe("superficie de acceso de votes (anon directo)", () => {
  it("el anon NO puede SELECT directo sobre la tabla (42501)", async () => {
    const { error } = await anon.from("votes").select("*").limit(1);
    // Debe HABER error: una lista vacía sin error sería RLS filtrando en
    // silencio con el GRANT re-abierto (el fallo que vigilamos).
    expect(error).not.toBeNull();
    expect(error?.code).toBe("42501");
  });

  it("el anon NO puede INSERT directo sobre la tabla (42501)", async () => {
    const { error } = await anon
      .from("votes")
      .insert({ app: "cv-viva", feature: "rls-directo-no-debe-entrar" });
    expect(error).not.toBeNull();
    expect(error?.code).toBe("42501");
  });
});
