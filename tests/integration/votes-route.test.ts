// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimit } from "@/lib/rate-limit";

/**
 * Integración de los route handlers de votación con el cliente de Supabase
 * MOCKEADO (sin red, sin BD). Cubre las capas de defensa del route; la prueba
 * de punta a punta contra Postgres real vive en votes-route.dbtest.ts.
 */

// Estado controlable del mock del cliente de votos.
const mockState = {
  enabled: true,
  emitir: vi.fn(),
  leer: vi.fn(),
};

vi.mock("@/lib/votes/client", () => {
  class VotesUnavailableError extends Error {
    constructor(cause?: unknown) {
      super("votación no disponible");
      this.name = "VotesUnavailableError";
      this.cause = cause;
    }
  }
  return {
    votacionEnabled: () => mockState.enabled,
    emitirVoto: (app: string, feature: string) =>
      mockState.emitir(app, feature),
    leerConteo: () => mockState.leer(),
    VotesUnavailableError,
  };
});

// Importa DESPUÉS del mock. `esFeatureValida` queda real: lee data/apps.yaml,
// así "hoja-de-vida"/"mapa-c4" es válido y "x"/"y" no.
const { POST } = await import("@/app/api/roadmap/votar/route");
const { GET } = await import("@/app/api/roadmap/votos/route");
const { VotesUnavailableError } = await import("@/lib/votes/client");

function postVoto(body: unknown, ip = "10.0.0.1"): Request {
  return new Request("http://localhost/api/roadmap/votar", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  mockState.enabled = true;
  mockState.emitir = vi.fn().mockResolvedValue(3);
  mockState.leer = vi
    .fn()
    .mockResolvedValue([{ app: "hoja-de-vida", feature: "mapa-c4", total: 3 }]);
  resetRateLimit();
  delete process.env.DISABLE_RATE_LIMIT;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/roadmap/votar", () => {
  it("happy path: devuelve el total REAL de la RPC", async () => {
    const res = await POST(
      postVoto({ app: "hoja-de-vida", feature: "mapa-c4" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      app: "hoja-de-vida",
      feature: "mapa-c4",
      total: 3,
    });
    expect(mockState.emitir).toHaveBeenCalledWith("hoja-de-vida", "mapa-c4");
  });

  it("503 cuando la votación está apagada/no configurada", async () => {
    mockState.enabled = false;
    const res = await POST(
      postVoto({ app: "hoja-de-vida", feature: "mapa-c4" }),
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "unavailable" });
    expect(mockState.emitir).not.toHaveBeenCalled();
  });

  it("400 invalid_body con JSON malformado", async () => {
    const res = await POST(postVoto("no es json {"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_body");
  });

  it("400 invalid_fields con clave de más (.strict)", async () => {
    const res = await POST(
      postVoto({ app: "hoja-de-vida", feature: "mapa-c4", extra: "x" }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_fields");
  });

  it("400 unknown_feature si el par no existe en apps.yaml", async () => {
    const res = await POST(postVoto({ app: "inventada", feature: "nope" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("unknown_feature");
    expect(mockState.emitir).not.toHaveBeenCalled();
  });

  it("429 al pasar la ventana de rate limit por IP", async () => {
    const ip = "10.0.0.99";
    let last: Response | undefined;
    for (let i = 0; i < 14; i++) {
      last = await POST(
        postVoto({ app: "hoja-de-vida", feature: "mapa-c4" }, ip),
      );
    }
    expect(last?.status).toBe(429);
    expect((await last!.json()).error).toBe("rate_limited");
  });

  it("no aplica rate limit cuando DISABLE_RATE_LIMIT=1 (CI)", async () => {
    process.env.DISABLE_RATE_LIMIT = "1";
    const ip = "10.0.0.7";
    let last: Response | undefined;
    for (let i = 0; i < 20; i++) {
      last = await POST(
        postVoto({ app: "hoja-de-vida", feature: "mapa-c4" }, ip),
      );
    }
    expect(last?.status).toBe(200);
  });

  it("503 cuando la BD falla (jamás un conteo inventado)", async () => {
    mockState.emitir = vi
      .fn()
      .mockRejectedValue(new VotesUnavailableError("db down"));
    const res = await POST(
      postVoto({ app: "hoja-de-vida", feature: "mapa-c4" }),
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "unavailable" });
  });
});

describe("GET /api/roadmap/votos", () => {
  it("devuelve el conteo agregado con no-store", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({
      conteo: [{ app: "hoja-de-vida", feature: "mapa-c4", total: 3 }],
    });
  });

  it("503 cuando la votación está apagada", async () => {
    mockState.enabled = false;
    const res = await GET();
    expect(res.status).toBe(503);
  });

  it("503 cuando la BD falla al leer el conteo", async () => {
    mockState.leer = vi
      .fn()
      .mockRejectedValue(new VotesUnavailableError("db down"));
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "unavailable" });
  });
});
