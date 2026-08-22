import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // Build de producción: los e2e validan el HTML estático real (gate ATS/SEO)
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000/es",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // Playwright descarta el stdout del webServer por defecto: sin esto los
    // logs Pino del server son invisibles en CI (antídoto K3, supabase-en-ci).
    stdout: "pipe",
    stderr: "pipe",
    env: {
      ...process.env,
      // El chat corre SIEMPRE con el proveedor mock en e2e (determinista,
      // cero red, cero tokens — la CI jamás llama a un proveedor real)
      CHAT_PROVIDER: "mock",
      CHAT_ENABLED: "true",
      // Votación: SUPABASE_URL/ANON_KEY pasan por `...process.env` (los exporta
      // el job de CI desde `supabase status`); sin ellos la sección se declara
      // "no disponible". Rate limit apagado: en e2e todo sale de localhost.
      VOTACION_ENABLED: "true",
      DISABLE_RATE_LIMIT: "1",
    },
  },
});
