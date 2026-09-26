import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // TOPE DE LA CORRIDA ENTERA. Un test colgado ya muere por su propio tope de
  // 30 s, así que un silencio más largo significa que lo colgado está FUERA de
  // un test: el arranque de un worker, una fixture o el navegador. Eso no lo
  // corta nada, y sin este tope la corrida se queda muda hasta el límite de
  // seis horas de GitHub, sin decir jamás qué se quedó a medias.
  // Al saltar, Playwright imprime el resumen y NOMBRA lo que no terminó, que
  // es justo lo que faltó para diagnosticar. Medido: la suite entera tarda
  // 1,4 min en local con tres workers y ~4 min en la CI.
  // (2026-09-22: la CI se colgó dos veces tras 314 de 360 pruebas, 59 y 24
  // minutos de silencio absoluto, y hubo que cancelar para leer los registros.)
  globalTimeout: process.env.CI ? 15 * 60_000 : undefined,
  reporter: process.env.CI ? [["github"], ["line"]] : "list",
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
    // El servidor se arranca SIN la capa de pnpm: `pnpm start` mete un proceso
    // intermedio entre Playwright y `next`, y al apagar quedaba el nieto vivo
    // —GitHub lo delataba al final del job: «Terminate orphan process:
    // next-server»—. Con el binario directo, lo que Playwright mata ES el
    // servidor.
    command: "pnpm build && ./node_modules/.bin/next start",
    url: "http://localhost:3000/es",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // APAGADO ACOTADO. Sin esto, Playwright pide el cierre y espera para
    // siempre: la corrida del 2026-09-22 terminó sus 360 pruebas en 3 min 41 s
    // y se quedó colgada en el apagado hasta el tope global, dos veces, también
    // en el job que solo corre las diez pruebas de votación —o sea, nada que
    // ver con el contenido—. Ahora se pide con SIGTERM y, si en diez segundos
    // no se ha ido, se mata.
    gracefulShutdown: { signal: "SIGTERM", timeout: 10_000 },
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
      // La barrera del chat (ADR-024) corre ENCENDIDA en e2e, con almacén en
      // memoria, correo simulado y código fijo: el flujo real, sin red.
      CHAT_GATE: "on",
      CHAT_GATE_STORE: "memory",
      CHAT_SESSION_SECRET:
        "secreto-solo-para-e2e-con-mas-de-treinta-y-dos-caracteres",
      CHAT_CODIGO_PRUEBA: "246810",
      RESEND_API_KEY: "",
      // El sitio corre ARRIBA en e2e aunque la terminal tenga la variable
      // exportada: el modo mantenimiento se prueba en unit y en la bitácora.
      MANTENIMIENTO: "",
    },
  },
});
