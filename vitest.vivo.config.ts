import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Config dedicada a la PASADA EN VIVO del chat (S24, reglas 24 y 25). El
 * patrón `en_vivo_*.test.ts` y el directorio `tests/en-vivo/` la dejan fuera
 * de TODA otra suite: ni `pnpm test`, ni la CI, ni `playwright` la ven. Solo
 * `pnpm test:en-vivo` la corre, en la máquina del dueño y con su «sí»: llama al
 * proveedor REAL con la clave de `.env.local` (plan Free de Groq, sin factura
 * posible) y deja el resultado en `privado/pasada-en-vivo-s25.md`.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/en-vivo/**/en_vivo_*.test.ts"],
    // Dieciséis llamadas con una pausa entre cada una (el plan Free corta a 8 000 tokens/min).
    testTimeout: 20 * 60_000,
    hookTimeout: 5 * 60_000,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "server-only": path.resolve(__dirname, "tests/mocks/server-only.ts"),
    },
  },
});
