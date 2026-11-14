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

  // `idioma.spec.ts:89` era intermitente (S16: 3 de 10 en la CI): medía con un reloj fijo
  // (300 ms) mientras las fuentes de la página —la mono entra DESPUÉS del `load`— aún podían
  // moverse, y el «antes» se tomaba sin esperarlas. Ahora el punto de partida se mide con la
  // página asentada (`load` + fuentes + dos cuadros) y el «después» es una condición que se
  // reintenta (hasta 5 s), no un instante.
  async function asentada(page: import("@playwright/test").Page) {
    await page.waitForLoadState("load");
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );
    });
  }

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
    await asentada(page);
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
    await asentada(page);
    await expect
      .poll(
        async () =>
          Math.abs(
            (await page
              .locator("#trayectoria article")
              .nth(3)
              .evaluate((el) => Math.round(el.getBoundingClientRect().top))) -
              antes,
          ),
        {
          message: `hito a ${antes}px antes: no volvió a su sitio`,
          timeout: 5_000,
        },
      )
      .toBeLessThanOrEqual(TOLERANCIA);
  });

  test("a media Perfil: el título de la sección queda a la misma altura", async ({
    page,
  }) => {
    await page.goto("/es");
    const perfil = page.locator("#perfil");
    await asentada(page);
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
    await asentada(page);
    await expect
      .poll(
        async () =>
          Math.abs(
            (await page
              .locator("#perfil")
              .evaluate((el) => Math.round(el.getBoundingClientRect().top))) -
              antes,
          ),
        {
          message: `sección a ${antes}px antes: no volvió a su sitio`,
          timeout: 5_000,
        },
      )
      .toBeLessThanOrEqual(TOLERANCIA);
  });

  test("con «Ver todo en lista» puesto en Skills, Métodos queda a la misma altura al cambiar de idioma (S29, M1)", async ({
    page,
  }) => {
    // La lista de Skills solo tiene caja con esa vista, y la home vuelve a montarse en «Áreas» al cambiar
    // de idioma: sus 18 hitos existían de un lado y no del otro, y el índice del ancla caía 18 hitos más
    // abajo. Se mide en Métodos, debajo de Skills y lejos del final (en Contacto la página se clava abajo
    // y la prueba no vería nada).
    await page.goto("/es");
    await asentada(page);
    await page
      .getByRole("button", { name: "Ver todo en lista", exact: true })
      .click();
    await expect(page.locator("#skills .lista")).toBeVisible();
    await page.evaluate(() => {
      const el = document.querySelector("#metodos")!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 20);
    });
    const antes = await page
      .locator("#metodos")
      .evaluate((el) => Math.round(el.getBoundingClientRect().top));

    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(/\/en$/, { timeout: 15_000 });
    await expect(page.locator("#skills .escenario-hueco")).toBeAttached({
      timeout: 15_000,
    });
    await asentada(page);
    await expect
      .poll(
        async () =>
          Math.abs(
            (await page
              .locator("#metodos")
              .evaluate((el) => Math.round(el.getBoundingClientRect().top))) -
              antes,
          ),
        {
          message: `Métodos a ${antes}px antes: no volvió a su sitio`,
          timeout: 5_000,
        },
      )
      .toBeLessThanOrEqual(TOLERANCIA);
  });
});

/**
 * DIEZ CAMBIOS SEGUIDOS NO MUEVEN LA HOME (S23, OM-05).
 *
 * El dueño: al pulsar ES/EN la página se queda en la sección, pero «baja un
 * poco cada vez»; pulsando muchas veces llega al final. Los tests de arriba
 * saltaban con `window.scrollTo`, así que ningún título se revelaba antes de
 * medir y el desplazamiento de la entrada animada era el mismo a los dos lados:
 * no veían nada. Aquí se baja con la RUEDA, como el dueño, para que los títulos
 * de Perfil y Trayectoria ya estén revelados cuando se guarda el ancla, y se
 * cambia de idioma diez veces: en el mismo idioma (cada par de cambios) el
 * punto de lectura tiene que ser el de partida, con 4 px de margen.
 */
test.describe("diez cambios de idioma seguidos dejan la HOME donde estaba", () => {
  const MARGEN = 4;

  async function asentada(page: import("@playwright/test").Page) {
    await page.waitForLoadState("load");
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );
    });
  }

  /**
   * Espera a que el scroll y las entradas animadas dejen de moverse: el borde del hito Y el
   * `scrollY`, iguales en cuatro lecturas seguidas (600 ms). PR #115 (2026-11-14, reproducido en
   * un contenedor de Playwright en Linux): con dos lecturas y sin vaciar la cola de la rueda, el
   * último giro se aplicaba con el clic, DESPUÉS de medir la salida, y la prueba daba −120 px
   * aunque el ancla hiciera su ida y vuelta exacta (también en `main`, 3 de 20).
   */
  async function quieta(
    page: import("@playwright/test").Page,
    selector = "#perfil h2",
  ) {
    let anterior = "";
    let iguales = 0;
    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(150);
      const ahora = await page.evaluate((s) => {
        const h = document.querySelector(s)!.getBoundingClientRect();
        return `${Math.round(h.top * 10) / 10}|${Math.round(window.scrollY)}`;
      }, selector);
      iguales = ahora === anterior ? iguales + 1 : 0;
      if (iguales >= 3) return;
      anterior = ahora;
    }
  }

  for (const [seccion, titulo, bajar] of [
    ["#perfil", "#perfil h2", 760],
    ["#trayectoria", "#trayectoria h2", 1500],
  ] as const) {
    test(`leyendo ${seccion}: el título vuelve al mismo sitio cada dos cambios @webkit`, async ({
      page,
    }) => {
      await page.goto("/es");
      await asentada(page);
      // Con la rueda, en pasos: cada título que pasa por la ventana se revela.
      await page.mouse.move(400, 400);
      for (let y = 0; y < bajar; y += 120) await page.mouse.wheel(0, 120);
      await page.mouse.move(401, 401); // vacía la cola de la rueda (ver «a media», abajo)
      await quieta(page);

      const sitio = () =>
        page.locator(titulo).evaluate((el) => el.getBoundingClientRect().top);
      const salida = await sitio();
      const idiomas = ["en", "es"] as const;
      const deriva: string[] = [];

      for (let i = 1; i <= 10; i++) {
        const a = idiomas[(i - 1) % 2];
        await page
          .getByRole("button", {
            name: a === "en" ? "Switch to English" : "Cambiar a español",
          })
          .click();
        await expect(page).toHaveURL(new RegExp(`/${a}$`), { timeout: 15_000 });
        await asentada(page);
        await quieta(page);
        if (a === "es") {
          const ahora = await sitio();
          deriva.push(`${i} cambios: ${(ahora - salida).toFixed(1)} px`);
          expect(
            Math.abs(ahora - salida),
            `tras ${i} cambios el título está a ${(ahora - salida).toFixed(1)} px de su sitio (${deriva.join(" · ")})`,
          ).toBeLessThanOrEqual(MARGEN);
        }
      }
    });
  }

  // S29 («el inglés y el español hacen que la página vaya bajando», el dueño): las dos pruebas de
  // arriba solo miran Perfil y Trayectoria. Las entradas animadas (Reveal, `fadeInSlow`) están en su
  // estado inicial, desplazadas hacia abajo, en el primer cuadro del otro idioma, y medir el ancla con
  // el rectángulo transformado dejaba la ventana ese tanto más abajo en cada ida y vuelta (−51 px por
  // vuelta en Estudios y Certificaciones del celular). Aquí se baja con la rueda hasta quedar DENTRO
  // de cada sección y se exige que vuelva a su sitio.
  for (const seccion of [
    "trayectoria",
    "estudios",
    "certificaciones",
    "skills",
    "metodos",
  ]) {
    test(`a media #${seccion}: cada dos cambios la sección vuelve al mismo sitio @webkit`, async ({
      page,
    }) => {
      await page.goto("/es");
      await asentada(page);
      await page.mouse.move(200, 400);
      for (let i = 0; i < 80; i++) {
        const top = await page
          .locator(`#${seccion}`)
          .evaluate((el) => el.getBoundingClientRect().top);
        if (top <= -120) break;
        await page.mouse.wheel(0, top > 1200 ? 400 : 120);
        await page.waitForTimeout(40);
      }
      // WebKit de Linux retiene el último giro de rueda hasta el siguiente evento de entrada: sin
      // este movimiento, ese giro se aplicaba con el clic del botón, DESPUÉS de medir la salida.
      await page.mouse.move(201, 401);
      await quieta(page, `#${seccion}`);

      const sitio = () =>
        page
          .locator(`#${seccion}`)
          .evaluate((el) => el.getBoundingClientRect().top);
      const salida = await sitio();
      const deriva: string[] = [];

      for (let i = 1; i <= 4; i++) {
        const a = i % 2 === 1 ? "en" : "es";
        await page
          .getByRole("button", {
            name: a === "en" ? "Switch to English" : "Cambiar a español",
          })
          .click();
        await expect(page).toHaveURL(new RegExp(`/${a}$`), { timeout: 15_000 });
        await asentada(page);
        await quieta(page, `#${seccion}`);
        if (a === "es") {
          const ahora = await sitio();
          deriva.push(`${i} cambios: ${(ahora - salida).toFixed(1)} px`);
          expect(
            Math.abs(ahora - salida),
            `tras ${i} cambios #${seccion} está a ${(ahora - salida).toFixed(1)} px de su sitio (${deriva.join(" · ")})`,
          ).toBeLessThanOrEqual(MARGEN);
        }
      }
    });
  }
});
