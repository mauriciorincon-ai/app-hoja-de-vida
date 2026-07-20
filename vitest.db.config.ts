import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Config dedicada a los tests contra Postgres REAL (Supabase local) — S4.
 * Patrón `*.dbtest.ts`, separado del `*.test.ts` de la suite `quality` para
 * que la CI sin BD jamás los arrastre (kit v1.6.4 § e2e-BD-real). Requiere
 * SUPABASE_URL + SUPABASE_ANON_KEY en el entorno (poblados desde
 * `supabase status -o env`); si faltan, los tests fallan ruidosamente en vez
 * de pasar en verde vacío.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.dbtest.ts"],
    // Sin coverage: estos tests validan la integración con la BD, no cobertura.
    testTimeout: 20_000,
    hookTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "server-only": path.resolve(__dirname, "tests/mocks/server-only.ts"),
    },
  },
});
