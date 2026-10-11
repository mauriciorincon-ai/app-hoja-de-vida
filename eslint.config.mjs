import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    // Lo que llega construido de otras casas (S7: capturas; 2026-10-11: el
    // sitio estático de planlang con sus chunks minificados) no es código de
    // este repo: se sirve tal cual y no se lintea.
    "public/piezas/**",
  ]),
]);

export default eslintConfig;
