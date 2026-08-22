import { afterEach, describe, expect, it, vi } from "vitest";
import { votarInputSchema, conteoSchema } from "@/lib/votes/schemas";

/**
 * Unit del cliente de votos con un SupabaseClient FALSO (sin red). Prueba la
 * lógica de forma/error del cliente; la integración real contra Postgres vive
 * en tests/integration/votes-client.dbtest.ts.
 */

// Cliente falso: solo implementa `.rpc(name, args)` con una respuesta fijada.
function fakeClient(response: { data?: unknown; error?: unknown }) {
  return {
    rpc: vi.fn().mockResolvedValue(response),
  } as never;
}

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
});

describe("votes/schemas", () => {
  it("acepta un input válido", () => {
    expect(
      votarInputSchema.parse({ app: "cv-viva", feature: "mapa-c4" }),
    ).toEqual({ app: "cv-viva", feature: "mapa-c4" });
  });

  it("rechaza una clave de más (.strict)", () => {
    expect(
      votarInputSchema.safeParse({
        app: "cv-viva",
        feature: "mapa-c4",
        extra: "x",
      }).success,
    ).toBe(false);
  });

  it("rechaza slugs no-kebab", () => {
    expect(
      votarInputSchema.safeParse({ app: "CV Viva!", feature: "x" }).success,
    ).toBe(false);
  });

  it("valida el conteo agregado y rechaza formas raras", () => {
    expect(
      conteoSchema.parse([{ app: "a", feature: "b", total: 3 }]),
    ).toHaveLength(1);
    expect(
      conteoSchema.safeParse([{ app: "a", feature: "b", total: -1 }]).success,
    ).toBe(false);
  });
});

describe("votes/client", () => {
  it("emitirVoto devuelve el conteo numérico de la RPC", async () => {
    process.env.SUPABASE_URL = "http://local";
    process.env.SUPABASE_ANON_KEY = "anon";
    const { emitirVoto } = await import("@/lib/votes/client");
    const conteo = await emitirVoto(
      "cv-viva",
      "mapa-c4",
      fakeClient({ data: 5 }),
    );
    expect(conteo).toBe(5);
  });

  it("emitirVoto lanza VotesUnavailableError si la RPC devuelve error", async () => {
    process.env.SUPABASE_URL = "http://local";
    process.env.SUPABASE_ANON_KEY = "anon";
    const { emitirVoto, VotesUnavailableError } =
      await import("@/lib/votes/client");
    await expect(
      emitirVoto(
        "cv-viva",
        "mapa-c4",
        fakeClient({ error: { message: "boom" } }),
      ),
    ).rejects.toBeInstanceOf(VotesUnavailableError);
  });

  it("emitirVoto lanza si falta configuración (feature apagada)", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    const { emitirVoto, VotesUnavailableError } =
      await import("@/lib/votes/client");
    await expect(emitirVoto("cv-viva", "mapa-c4")).rejects.toBeInstanceOf(
      VotesUnavailableError,
    );
  });

  it("leerConteo valida la respuesta con Zod y la devuelve", async () => {
    process.env.SUPABASE_URL = "http://local";
    process.env.SUPABASE_ANON_KEY = "anon";
    const { leerConteo } = await import("@/lib/votes/client");
    const rows = await leerConteo(
      fakeClient({ data: [{ app: "cv-viva", feature: "mapa-c4", total: 2 }] }),
    );
    expect(rows).toEqual([{ app: "cv-viva", feature: "mapa-c4", total: 2 }]);
  });

  it("leerConteo lanza si la respuesta tiene forma inesperada", async () => {
    process.env.SUPABASE_URL = "http://local";
    process.env.SUPABASE_ANON_KEY = "anon";
    const { leerConteo, VotesUnavailableError } =
      await import("@/lib/votes/client");
    await expect(
      leerConteo(fakeClient({ data: [{ app: "cv-viva", total: "dos" }] })),
    ).rejects.toBeInstanceOf(VotesUnavailableError);
  });

  it("votacionEnabled es false sin config y true con config", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.VOTACION_ENABLED;
    let mod = await import("@/lib/votes/client");
    expect(mod.votacionEnabled()).toBe(false);

    vi.resetModules();
    process.env.SUPABASE_URL = "http://local";
    process.env.SUPABASE_ANON_KEY = "anon";
    mod = await import("@/lib/votes/client");
    expect(mod.votacionEnabled()).toBe(true);

    process.env.VOTACION_ENABLED = "false";
    expect(mod.votacionEnabled()).toBe(false);
  });
});
