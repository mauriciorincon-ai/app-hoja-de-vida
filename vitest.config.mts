import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// `.mts`: el paquete es CommonJS y este archivo es ESM; Vite avisaba (`configLoader: 'native'`) de que un
// `.ts` con sintaxis ESM dejará de cargarse. `__dirname` no existe en ESM: se saca de `import.meta.url`.
const raiz = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: [
      "tests/unit/**/*.test.{ts,tsx}",
      "tests/integration/**/*.test.{ts,tsx}",
    ],
    setupFiles: ["tests/setup.ts"],
    coverage: {
      provider: "v8",
      // Umbral del estándar #1: >70% en módulos no-UI (motores puros >80%)
      include: ["src/lib/**"],
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(raiz, "src"),
      // El guard "server-only" no aplica dentro del runner de tests
      "server-only": path.resolve(raiz, "tests/mocks/server-only.ts"),
    },
  },
});
