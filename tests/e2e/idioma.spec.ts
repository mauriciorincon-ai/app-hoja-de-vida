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

/**
 * EL CAMBIO DE IDIOMA TE DEJA EXACTAMENTE DONDE ESTABAS (revisión post-S8,
 * bloque B, 2026-09-13). El dueño, en b1: en Perfil y Trayectoria el botón
 * ES/EN «no se quedaba» — el hash lleva al borde de la sección, y él estaba a
 * media sección. Se conserva un ancla de CONTENIDO (`src/lib/ancla-de-scroll.ts`):
 * el mismo hito, al mismo desfase, aunque el inglés sea más corto.
 */
test.describe("el botón ES/EN conserva el punto exacto de lectura", () => {
  const TOLERANCIA = 24;

  test("a media Trayectoria: el hito que se está leyendo queda a la misma altura de la ventana", async ({
    page,
  }) => {
    await page.goto("/es");
    // Leyendo DENTRO del cuarto hito: su borde, 100 px por encima de la
    // ventana. Es lo que el ancla promete (el último hito que ya pasó el
    // borde). Hasta 2026-09-26 se medía un hito 180 px POR DEBAJO del borde:
    // entre el ancla y él hay texto, que en inglés es más corto, así que podía
    // moverse con todo derecho; pasaba solo porque en la primera visita la
    // fuente mono era Arial. Y escondía un error real: en móvil el año fijo
    // del índice cortaba la búsqueda del ancla y el hito leído se corría 42–87 px.
    const hito = page.locator("#trayectoria article").nth(3);
    await page.evaluate(() => {
      const el = document.querySelectorAll("#trayectoria article")[3];
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 100);
    });
    const antes = await hito.evaluate((el) =>
      Math.round(el.getBoundingClientRect().top),
    );

    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(/\/en$/, { timeout: 15_000 });
    await expect(page.locator("#trayectoria h2")).toHaveText("Career", {
      timeout: 15_000,
    });
    await page.waitForTimeout(300);
    const despues = await page
      .locator("#trayectoria article")
      .nth(3)
      .evaluate((el) => Math.round(el.getBoundingClientRect().top));
    expect(
      Math.abs(despues - antes),
      `hito a ${antes}px antes, a ${despues}px después`,
    ).toBeLessThanOrEqual(TOLERANCIA);
  });

  test("a media Perfil: el título de la sección queda a la misma altura", async ({
    page,
  }) => {
    await page.goto("/es");
    const perfil = page.locator("#perfil");
    // 120 px por debajo del borde de la sección: dentro del texto.
    await page.evaluate(() => {
      const el = document.querySelector("#perfil")!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 120);
    });
    const antes = await perfil.evaluate((el) =>
      Math.round(el.getBoundingClientRect().top),
    );

    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(/\/en$/, { timeout: 15_000 });
    await expect(page.locator("#perfil h2")).toHaveText("Profile", {
      timeout: 15_000,
    });
    await page.waitForTimeout(300);
    const despues = await page
      .locator("#perfil")
      .evaluate((el) => Math.round(el.getBoundingClientRect().top));
    expect(
      Math.abs(despues - antes),
      `sección a ${antes}px antes, a ${despues}px después`,
    ).toBeLessThanOrEqual(TOLERANCIA);
  });
});
