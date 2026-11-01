import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { parse } from "yaml";

/**
 * «ÚSALA» (S30, «1b»), contra el sitio real. El brochure es la entrada de la app y su cierre recibe lo que
 * vivía en la ficha: la lista de espera, el roadmap votable, la propuesta, la simulación, «Dónde está» y
 * las vecinas. Aquí se prueba que cada cosa FUNCIONA y llega a donde llegaba en la ficha:
 *
 *  1. la lista de espera, con la app elegida, a `/solicitud-enviada`; la propuesta confirma en su sitio;
 *  2. el voto, a la misma API; «Ver las N ideas» pliega y despliega las ideas de más de cinco;
 *  3. la simulación solo donde existe; «Dónde está» con su nota; las vecinas en el orden del escaparate;
 *  4. la casa cierra con «Escríbeme» y sin formularios;
 *  5. a 390 y a 1280 no hay desborde; al imprimir no hay formularios y se ven todas las ideas; sin
 *     JavaScript las ideas plegadas se ven;
 *  6. axe, con las ideas desplegadas, en español y en inglés.
 *
 * Corre en chromium y en móvil. Data-driven: el orden y las ideas salen de los mismos YAML que las páginas.
 */

const categorias = parse(
  readFileSync("data/categorias-apps.yaml", "utf8"),
) as Record<"profesionales" | "personales", { slug: string }[]>;
const ESCAPARATE = [...categorias.profesionales, ...categorias.personales].map(
  (a) => a.slug,
);
const ideasDe = (app: string) =>
  (
    parse(readFileSync(`data/fichas/${app}.yaml`, "utf8")) as {
      roadmap?: { id: string }[];
    }
  ).roadmap?.map((r) => r.id) ?? [];
/** El brochure de una app, donde vive: su entrada (desde el S31, la de las diez). */
const brochureDe = (l: string, app: string) => `/${l}/portafolio/apps/${app}`;

// Una con 11 ideas (se ven 5), una sin ninguna y una con simulación: las tres formas del dato.
const CON_IDEAS = ESCAPARATE.find((a) => ideasDe(a).length > 5)!;
const SIN_IDEAS = ESCAPARATE.find((a) => ideasDe(a).length === 0)!;
const CON_SIMULACION = (
  parse(readFileSync("data/simulaciones.yaml", "utf8")) as {
    simulaciones: { slug: string }[];
  }
).simulaciones[0]!.slug;

const cierre = (page: Page) => page.locator("#s-cierre");
const hidratado = (page: Page, formulario: string) =>
  cierre(page)
    .locator(`form[data-formulario="${formulario}"][data-hydrated=true]`)
    .waitFor();

test.describe("«Úsala»: la lista de espera y la propuesta", () => {
  test("hay una app con ideas, una sin ellas y una con simulación (si no, esta prueba no mide nada)", () => {
    expect(ideasDe(CON_IDEAS).length).toBeGreaterThan(5);
    expect(SIN_IDEAS).toBeTruthy();
    expect(CON_SIMULACION).toBeTruthy();
  });

  test("la lista de espera llega con la app elegida y envía a /solicitud-enviada (es)", async ({
    page,
  }) => {
    await page.goto(brochureDe("es", SIN_IDEAS));
    await cierre(page).scrollIntoViewIfNeeded();
    await hidratado(page, "app");
    const form = cierre(page).locator('form[data-formulario="app"]');
    await expect(form.getByLabel("¿Qué app te interesa?")).toHaveValue(
      SIN_IDEAS,
    );
    await form.getByLabel("Tu nombre").fill("E2E Úsala");
    await form.getByLabel("Tu correo").fill("usala@example.com");
    await form.getByRole("button", { name: "Avísame cuando abra" }).click();
    await expect(page).toHaveURL(/\/es\/solicitud-enviada/);
  });

  test("y en inglés dice «Tell me when it opens» y llega a /en/solicitud-enviada", async ({
    page,
  }) => {
    await page.goto(brochureDe("en", SIN_IDEAS));
    await cierre(page).scrollIntoViewIfNeeded();
    await hidratado(page, "app");
    const form = cierre(page).locator('form[data-formulario="app"]');
    await form.getByLabel("Your name").fill("E2E Use it");
    await form.getByLabel("Your email").fill("useit@example.com");
    await form.getByRole("button", { name: "Tell me when it opens" }).click();
    await expect(page).toHaveURL(/\/en\/solicitud-enviada/);
  });

  test("validación inline: vacío no envía y no sale de la página", async ({
    page,
  }) => {
    await page.goto(brochureDe("es", SIN_IDEAS));
    await cierre(page).scrollIntoViewIfNeeded();
    await hidratado(page, "app");
    const form = cierre(page).locator('form[data-formulario="app"]');
    await form.getByRole("button", { name: "Avísame cuando abra" }).click();
    await expect(form.getByRole("alert")).toHaveCount(2);
    await expect(page).toHaveURL(
      new RegExp(`/es/portafolio/apps/${SIN_IDEAS}`),
    );
  });

  test("la propuesta confirma en su sitio, sin navegar (la app sin roadmap la lleva sola)", async ({
    page,
  }) => {
    await page.goto(brochureDe("es", SIN_IDEAS));
    await cierre(page).scrollIntoViewIfNeeded();
    await hidratado(page, "propuesta");
    // Sin ideas no hay roadmap: la propuesta ocupa su panel.
    await expect(
      cierre(page).locator('[data-testid="roadmap-votar"]'),
    ).toHaveCount(0);
    const form = cierre(page).locator('form[data-formulario="propuesta"]');
    await form.getByRole("button", { name: "Proponer" }).click();
    await expect(form.getByRole("alert")).toHaveCount(1);
    await form
      .getByLabel(/qué te gustaría/i)
      .fill("Que avise por WhatsApp cuando entre un inmueble nuevo.");
    await form.getByRole("button", { name: "Proponer" }).click();
    await expect(form.getByText(/Recibí tu propuesta/)).toBeVisible();
    await expect(page).toHaveURL(
      new RegExp(`/es/portafolio/apps/${SIN_IDEAS}`),
    );
  });
});

test.describe("«Úsala»: el roadmap votable", () => {
  const FEATURE = () => ideasDe(CON_IDEAS)[0]!;

  test("se ven cinco ideas y «Ver las 11 ideas» despliega y pliega las demás", async ({
    page,
  }) => {
    await page.route("**/api/roadmap/votos", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ conteo: [] }),
      }),
    );
    await page.goto(brochureDe("es", CON_IDEAS));
    await cierre(page).scrollIntoViewIfNeeded();
    const total = ideasDe(CON_IDEAS).length;
    const ideas = cierre(page).locator("li.votable");
    await expect(ideas).toHaveCount(total);
    await expect(ideas.locator("visible=true")).toHaveCount(5);
    const boton = cierre(page).getByRole("button", {
      name: `Ver las ${total} ideas`,
    });
    await expect(boton).toHaveAttribute("aria-expanded", "false");
    await boton.click();
    await expect(ideas.locator("visible=true")).toHaveCount(total);
    await expect(
      cierre(page).getByRole("button", { name: "Ver menos" }),
    ).toHaveAttribute("aria-expanded", "true");
    await cierre(page).getByRole("button", { name: "Ver menos" }).click();
    await expect(ideas.locator("visible=true")).toHaveCount(5);
  });

  test("los votos se piden cuando el roadmap se acerca, no al cargar la página", async ({
    page,
  }) => {
    let pedidos = 0;
    await page.route("**/api/roadmap/votos", (r) => {
      pedidos++;
      return r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ conteo: [] }),
      });
    });
    await page.goto(brochureDe("es", CON_IDEAS));
    await expect(page.locator("[data-brochure][data-b-listo]")).toHaveCount(1);
    // Arriba de todo, a varias pantallas del roadmap: ninguna petición (y el conteo no inventa un número).
    await page.waitForTimeout(800);
    expect(pedidos, "al cargar").toBe(0);
    await cierre(page).scrollIntoViewIfNeeded();
    await expect.poll(() => pedidos, { timeout: 10_000 }).toBe(1);
    await expect(
      cierre(page).locator('[data-testid="roadmap-conteo"]').first(),
    ).toHaveText(/sin votos aún|voto/);
  });

  test("en inglés dice «See all N ideas» y «See fewer»", async ({ page }) => {
    await page.goto(brochureDe("en", CON_IDEAS));
    await cierre(page).scrollIntoViewIfNeeded();
    const total = ideasDe(CON_IDEAS).length;
    await cierre(page)
      .getByRole("button", { name: `See all ${total} ideas` })
      .click();
    await expect(
      cierre(page).getByRole("button", { name: "See fewer" }),
    ).toBeVisible();
  });

  test("votar va a la MISMA API que en la ficha, con teclado, y el conteo es el real", async ({
    page,
  }) => {
    const enviados: unknown[] = [];
    await page.route("**/api/roadmap/votos", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ conteo: [] }),
      }),
    );
    await page.route("**/api/roadmap/votar", (r) => {
      enviados.push(r.request().postDataJSON());
      return r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          app: CON_IDEAS,
          feature: FEATURE(),
          total: 1,
        }),
      });
    });
    await page.goto(brochureDe("es", CON_IDEAS));
    await cierre(page).scrollIntoViewIfNeeded();
    const fila = cierre(page).locator(
      `li.votable[data-feature-id="${FEATURE()}"][data-app-id="${CON_IDEAS}"]`,
    );
    const boton = fila.locator('[data-testid="roadmap-votar"]');
    await expect(boton).toBeEnabled({ timeout: 15_000 });
    await expect(boton).toHaveAttribute("aria-pressed", "false");
    await boton.focus();
    await page.keyboard.press("Enter");
    await expect(boton).toHaveAttribute("aria-pressed", "true");
    await expect(boton).toContainText("Ya votaste");
    await expect(fila.locator('[data-testid="roadmap-conteo"]')).toHaveText(
      /1 voto/,
    );
    expect(enviados).toEqual([{ app: CON_IDEAS, feature: FEATURE() }]);
  });

  test("la BD caída: aviso honesto y botones deshabilitados, como en la ficha", async ({
    page,
  }) => {
    await page.route("**/api/roadmap/votos", (r) =>
      r.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "unavailable" }),
      }),
    );
    await page.goto(brochureDe("es", CON_IDEAS));
    await cierre(page).scrollIntoViewIfNeeded();
    await expect(
      cierre(page).getByText(/votación no está disponible/i),
    ).toBeVisible();
    const botones = cierre(page).locator('[data-testid="roadmap-votar"]');
    for (let i = 0; i < (await botones.count()); i++)
      await expect(botones.nth(i)).toBeDisabled();
  });
});

test.describe("«Úsala»: simulación, «Dónde está» y vecinas", () => {
  test("«Ver la simulación →» solo donde la hay, y lleva a su simulación", async ({
    page,
  }) => {
    await page.goto(brochureDe("es", CON_SIMULACION));
    const enlace = cierre(page).locator('a[data-cta="simulacion"]');
    await expect(enlace).toHaveAttribute(
      "href",
      `/es/portafolio/apps/${CON_SIMULACION}/simulacion`,
    );
    await expect(enlace).toContainText("Ver la simulación");
    await enlace.click();
    await expect(page).toHaveURL(
      new RegExp(`/es/portafolio/apps/${CON_SIMULACION}/simulacion$`),
    );
    const otra = ESCAPARATE.find((a) => a !== CON_SIMULACION)!;
    await page.goto(brochureDe("es", otra));
    await expect(cierre(page).locator('a[data-cta="simulacion"]')).toHaveCount(
      0,
    );
  });

  test("«Dónde está» trae su nota y los hitos de la app", async ({ page }) => {
    await page.goto(brochureDe("es", CON_IDEAS));
    const donde = cierre(page).locator("section.donde");
    await expect(donde).toContainText("Dónde está");
    await expect(donde).toContainText("Aquí se muestra; no se entrega.");
    expect(await donde.locator("ol li").count()).toBeGreaterThanOrEqual(4);
  });

  test("las vecinas siguen el orden del escaparate en las diez, y al índice siempre", async ({
    request,
  }) => {
    for (const [i, app] of ESCAPARATE.entries()) {
      const html = await (await request.get(brochureDe("es", app))).text();
      const nav = /<nav class="vecinas"[\s\S]*?<\/nav>/.exec(html)?.[0] ?? "";
      const hrefs = [...nav.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
      expect(hrefs, app).toEqual([
        ...(i > 0 ? [`/es/portafolio/apps/${ESCAPARATE[i - 1]}`] : []),
        "/es/portafolio/apps",
        ...(i < ESCAPARATE.length - 1
          ? [`/es/portafolio/apps/${ESCAPARATE[i + 1]}`]
          : []),
      ]);
    }
  });

  test("una vecina lleva a la entrada de la otra app", async ({ page }) => {
    const i = ESCAPARATE.indexOf(SIN_IDEAS);
    await page.goto(brochureDe("es", SIN_IDEAS));
    await cierre(page).locator(".vecina.der").click();
    await expect(page).toHaveURL(
      new RegExp(`/es/portafolio/apps/${ESCAPARATE[i + 1]}$`),
    );
  });
});

test.describe("«Úsala» de la casa", () => {
  for (const casa of ["hoja-de-vida", "chat-hoja-de-vida"]) {
    test(`${casa}: «Escríbeme», «Dónde está» y «Volver a las apps», sin formularios`, async ({
      page,
    }) => {
      await page.goto(`/es/portafolio/apps/${casa}`);
      const c = cierre(page);
      await expect(c.locator("a[data-cta]")).toHaveAttribute(
        "href",
        "/es#contacto",
      );
      await expect(c.locator("a[data-cta]")).toContainText("Escríbeme");
      await expect(c.locator("section.donde")).toContainText("Dónde está");
      await expect(c.locator("form")).toHaveCount(0);
      await expect(c.locator("li.votable")).toHaveCount(0);
      await expect(c.locator(".vecina")).toHaveCount(1);
      await c.getByRole("link", { name: /Volver a las apps/ }).click();
      await expect(page).toHaveURL(/\/es\/portafolio\/apps$/);
    });
  }

  test("«Escríbeme» lleva al contacto de CV Viva", async ({ page }) => {
    await page.goto("/es/portafolio/apps/hoja-de-vida");
    await cierre(page).locator("a[data-cta]").click();
    await expect(page).toHaveURL(/\/es\/?#contacto$/);
    await expect(page.locator("#contacto")).toHaveCount(1);
  });
});

test.describe("«Úsala»: ancho, impresión y sin JavaScript", () => {
  test("sin desborde horizontal en la entrada, el /brochure con ideas y la casa (es y en)", async ({
    page,
  }) => {
    for (const l of ["es", "en"])
      for (const ruta of [
        brochureDe(l, SIN_IDEAS),
        brochureDe(l, CON_IDEAS),
        `/${l}/portafolio/apps/hoja-de-vida`,
      ]) {
        await page.goto(ruta);
        await cierre(page).scrollIntoViewIfNeeded();
        const [ancho, ventana] = await page.evaluate(() => [
          document.documentElement.scrollWidth,
          window.innerWidth,
        ]);
        expect(ancho, ruta).toBeLessThanOrEqual(ventana);
      }
  });

  test("al imprimir no hay formularios, ni votar, ni «Ver las N ideas», ni vecinas; sí todas las ideas", async ({
    page,
  }) => {
    await page.goto(brochureDe("es", CON_IDEAS));
    await cierre(page).scrollIntoViewIfNeeded();
    await page.emulateMedia({ media: "print" });
    const total = ideasDe(CON_IDEAS).length;
    await expect(cierre(page).locator("form:visible")).toHaveCount(0);
    await expect(cierre(page).locator(".votar:visible")).toHaveCount(0);
    await expect(cierre(page).locator(".ver-ideas:visible")).toHaveCount(0);
    await expect(cierre(page).locator(".vecinas:visible")).toHaveCount(0);
    await expect(cierre(page).locator("li.votable:visible")).toHaveCount(total);
    await expect(cierre(page).locator("section.donde")).toBeVisible();
    // Sin ideas, el panel de la propuesta sola tampoco se imprime.
    await page.goto(brochureDe("es", SIN_IDEAS));
    await page.emulateMedia({ media: "print" });
    await expect(cierre(page).locator("form:visible")).toHaveCount(0);
    await expect(cierre(page).locator(".solo-propuesta:visible")).toHaveCount(
      0,
    );
  });

  test.describe("sin JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("las ideas plegadas se ven (nada nace oculto) y el botón que no abriría nada no está", async ({
      page,
    }) => {
      await page.goto(brochureDe("es", CON_IDEAS));
      const total = ideasDe(CON_IDEAS).length;
      await expect(cierre(page).locator("li.votable:visible")).toHaveCount(
        total,
      );
      await expect(cierre(page).locator(".ver-ideas:visible")).toHaveCount(0);
    });
  });
});

test.describe("«Úsala»: axe con las ideas desplegadas", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });
  for (const l of ["es", "en"])
    for (const [forma, app] of [
      ["con ideas", CON_IDEAS],
      ["sin ideas", SIN_IDEAS],
      ["de la casa", "hoja-de-vida"],
    ] as const)
      test(`${l} · ${forma}: sin violaciones`, async ({ page }) => {
        test.slow();
        const errores: string[] = [];
        page.on("pageerror", (e) => errores.push(e.message));
        await page.goto(
          app === "hoja-de-vida"
            ? `/${l}/portafolio/apps/${app}`
            : brochureDe(l, app),
        );
        await cierre(page).scrollIntoViewIfNeeded();
        const mas = cierre(page).locator(".ver-ideas");
        if (await mas.count()) await mas.click();
        await page.evaluate(() =>
          document
            .querySelector("[data-brochure]")
            ?.setAttribute("data-b-entero", ""),
        );
        const r = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .include("#s-cierre")
          .analyze();
        expect(r.violations).toEqual([]);
        expect(errores).toEqual([]);
      });
});
