import { beforeAll, describe, expect, it } from "vitest";
import { emitirVoto, leerConteo } from "@/lib/votes/client";

/**
 * Integración del cliente de votos contra Postgres REAL (Supabase local).
 * Requiere SUPABASE_URL + SUPABASE_ANON_KEY en el entorno (desde
 * `supabase status -o env`). Corre con `pnpm test:db`.
 *
 * Aserciones RELATIVAS (delta N→N+1): no dependen de una BD limpia, así cada
 * proyecto/corrida es aislado sin truncar (patrón strict-mode por-proyecto,
 * wiki/patterns/supabase-en-ci-y-cloud.md #5). Cada test usa su propia feature.
 */

const APP = "cv-viva";

function totalDe(
  conteo: Awaited<ReturnType<typeof leerConteo>>,
  feature: string,
): number {
  return conteo.find((r) => r.app === APP && r.feature === feature)?.total ?? 0;
}

beforeAll(() => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error(
      "SUPABASE_URL/SUPABASE_ANON_KEY ausentes: exporta el entorno con " +
        "`supabase status -o env` antes de `pnpm test:db`.",
    );
  }
});

describe("votes/client contra Postgres real", () => {
  it("emitirVoto sube el conteo real en 1 (atómico, valor de la BD)", async () => {
    const feature = "dbtest-incremento";
    const antes = totalDe(await leerConteo(), feature);
    const conteo = await emitirVoto(APP, feature);
    expect(conteo).toBe(antes + 1);

    // Y leerConteo lo refleja de forma independiente.
    const despues = totalDe(await leerConteo(), feature);
    expect(despues).toBe(antes + 1);
  });

  it("dos votos consecutivos devuelven conteos crecientes", async () => {
    const feature = "dbtest-consecutivo";
    const primero = await emitirVoto(APP, feature);
    const segundo = await emitirVoto(APP, feature);
    expect(segundo).toBe(primero + 1);
  });

  it("votos concurrentes no se pierden (inserción atómica)", async () => {
    const feature = "dbtest-concurrente";
    const antes = totalDe(await leerConteo(), feature);
    const N = 10;
    await Promise.all(
      Array.from({ length: N }, () => emitirVoto(APP, feature)),
    );
    const despues = totalDe(await leerConteo(), feature);
    expect(despues).toBe(antes + N);
  });

  it("la RPC rechaza un slug inválido (defensa en la BD)", async () => {
    await expect(emitirVoto("MAYUS Inválida!", "x")).rejects.toThrow();
  });

  it("leerConteo devuelve filas con forma validada", async () => {
    const feature = "dbtest-forma";
    await emitirVoto(APP, feature);
    const conteo = await leerConteo();
    const fila = conteo.find((r) => r.app === APP && r.feature === feature);
    expect(fila).toBeDefined();
    expect(typeof fila?.total).toBe("number");
    expect(fila?.total).toBeGreaterThanOrEqual(1);
  });
});
