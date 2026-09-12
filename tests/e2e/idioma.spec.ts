import { expect, test } from "@playwright/test";

/**
 * LA RAÍZ ABRE SIEMPRE EN ESPAÑOL (revisión post-S8, 2026-09-12).
 *
 * El dueño abrió el sitio y «iniciaba en inglés». No era azar: `/` decidía el
 * idioma por `Accept-Language` Y por la cookie que deja «Switch to English» —
 * quien pulsara el cambio una vez quedaba en inglés en ese navegador para
 * siempre. Decisión suya: la raíz es `/es`, sin excepciones; el botón sigue
 * cambiando de idioma, pero ya no «se pega». Con esto queda cubierto el
 * redirect de `/` que el summary del S8 declaró como deuda sin test.
 *
 * Se prueba con `request` y sin seguir redirects: lo que se mide es la
 * respuesta del middleware, no lo que el navegador hace después.
 */
test.describe("la raíz `/` abre en español, diga lo que diga el navegador", () => {
  const casos: [string, Record<string, string>][] = [
    ["sin señal de idioma", {}],
    ["con Accept-Language en inglés", { "accept-language": "en-US,en;q=0.9" }],
    [
      "con la cookie del cambio de idioma en inglés",
      { cookie: "NEXT_LOCALE=en", "accept-language": "es-CO,es;q=0.9" },
    ],
  ];
  for (const [nombre, headers] of casos) {
    test(`${nombre} → /es`, async ({ request }) => {
      const res = await request.get("/", { headers, maxRedirects: 0 });
      expect(res.status()).toBe(307);
      expect(new URL(res.headers()["location"], "http://x").pathname).toBe(
        "/es",
      );
    });
  }

  test("una ruta ya localizada no se toca: /en sigue siendo /en", async ({
    request,
  }) => {
    const res = await request.get("/en", { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });
});
