import { beforeAll, describe, expect, it } from "vitest";

/**
 * Punta a punta de los route handlers de votación contra Postgres REAL
 * (Supabase local). Recorre route → cliente → RPC → Postgres, sin mocks.
 * Requiere SUPABASE_URL + SUPABASE_ANON_KEY (desde `supabase status -o env`).
 * Corre con `pnpm test:db`. DISABLE_RATE_LIMIT=1 para no chocar con la ventana
 * por IP (todo sale de localhost).
 */

process.env.DISABLE_RATE_LIMIT = "1";
process.env.VOTACION_ENABLED = "true";

const { POST } = await import("@/app/api/roadmap/votar/route");
const { GET } = await import("@/app/api/roadmap/votos/route");

function postVoto(body: unknown): Request {
  return new Request("http://localhost/api/roadmap/votar", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": "127.0.0.1" },
    body: JSON.stringify(body),
  });
}

async function totalDe(app: string, feature: string): Promise<number> {
  const res = await GET();
  const { conteo } = (await res.json()) as {
    conteo: Array<{ app: string; feature: string; total: number }>;
  };
  return conteo.find((r) => r.app === app && r.feature === feature)?.total ?? 0;
}

beforeAll(() => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error(
      "SUPABASE_URL/SUPABASE_ANON_KEY ausentes: exporta el entorno con " +
        "`supabase status -o env` antes de `pnpm test:db`.",
    );
  }
});

describe("route de votación contra Postgres real", () => {
  it("POST votar sube el total real y GET votos lo refleja", async () => {
    const app = "hoja-de-vida";
    const feature = "mapa-c4";
    const antes = await totalDe(app, feature);

    const res = await POST(postVoto({ app, feature }));
    expect(res.status).toBe(200);
    const json = (await res.json()) as { total: number };
    expect(json.total).toBe(antes + 1);

    const despues = await totalDe(app, feature);
    expect(despues).toBe(antes + 1);
  });

  it("400 unknown_feature no toca la BD", async () => {
    const antes = await totalDe("hoja-de-vida", "mapa-c4");
    const res = await POST(
      postVoto({ app: "hoja-de-vida", feature: "no-existe" }),
    );
    expect(res.status).toBe(400);
    const despues = await totalDe("hoja-de-vida", "mapa-c4");
    expect(despues).toBe(antes);
  });
});
