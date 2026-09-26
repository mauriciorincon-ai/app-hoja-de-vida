import { expect, test } from "@playwright/test";

/**
 * MODO MANTENIMIENTO, APAGADO (2026-09-24). Los e2e corren con el sitio
 * arriba (`MANTENIMIENTO` vacío en `playwright.config.ts`), y lo que se prueba
 * es que la página de mantenimiento NO se cuela: con el sitio arriba no
 * existe, y ninguna página responde 503. Lo que pasa con el interruptor
 * encendido lo prueban `tests/unit/mantenimiento.test.ts` (el proxy) y la
 * build de producción que registra la bitácora (el 503 real).
 */
test.describe("con el sitio arriba, la página de mantenimiento no existe", () => {
  for (const locale of ["es", "en"]) {
    test(`/${locale}/mantenimiento responde 404`, async ({ request }) => {
      const r = await request.get(`/${locale}/mantenimiento`);
      expect(r.status()).toBe(404);
    });
  }

  test("las páginas responden normal, sin 503", async ({ request }) => {
    for (const ruta of ["/es", "/en", "/es/cv", "/es/proyectos/vesting"]) {
      const r = await request.get(ruta);
      expect(r.status(), ruta).toBe(200);
      expect(r.headers()["retry-after"], ruta).toBeUndefined();
    }
  });
});
