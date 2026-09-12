import { expect, test } from "@playwright/test";

/**
 * NAVEGACIÓN DEL HEADER — los dos disclosures.
 *
 *  - **Hamburguesa** (<md, deuda S1 pagada en S4): el menú completo.
 *  - **Hoja de vida** (≥md, 2026-09-05): agrupa las secciones del CV, que
 *    antes competían en el primer nivel con la vitrina y el contacto. Seis
 *    desde 2026-09-10: la vitrina asomada en la HOME entró con el nombre que
 *    lleva en la página — «Vitrina» desde la revisión post-S8 (2026-09-12), y
 *    por eso el portal, en el primer nivel, se llama «Portafolio»: dos enlaces
 *    iguales a sitios distintos en un mismo menú son una trampa.
 *
 * Ambos comparten contrato: `aria-expanded` + `aria-controls`, Escape cierra y
 * devuelve el foco al botón que abrió, y elegir una opción cierra.
 */

test.describe("Nav móvil (disclosure del header)", () => {
  test.use({ viewport: { width: 390, height: 780 } });

  test("abre, navega a una sección y se puede operar por teclado", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.locator("form[data-hydrated=true]").waitFor();

    // Selector estable: el accessible name del botón cambia al abrir
    // ("Abrir el menú" → "Cerrar el menú"), aria-controls no.
    const toggle = page.locator('button[aria-controls="nav-movil"]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toHaveAccessibleName("Abrir el menú");

    // Abrir: el panel aparece con las secciones y el nombre del botón cambia
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAccessibleName("Cerrar el menú");
    const panel = page.locator("#nav-movil");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: "Contacto" })).toBeVisible();
    // La vitrina asomada en la HOME está en el grupo, con su nombre de sección.
    await expect(
      panel.getByRole("link", { name: "Vitrina", exact: true }),
    ).toHaveAttribute("href", "#vitrina");
    // Y el portal, en el primer nivel, es «Portafolio» — la RUTA, no el ancla.
    await expect(
      panel.getByRole("link", { name: "Portafolio", exact: true }),
    ).toHaveAttribute("href", "/es/vitrina");
    // «Roadmap» ya no es destino de la HOME (vive en /vitrina/apps).
    await expect(panel.getByRole("link", { name: "Roadmap" })).toHaveCount(0);

    // Escape cierra y devuelve el foco al botón
    await page.keyboard.press("Escape");
    await expect(page.locator("#nav-movil")).toHaveCount(0);
    await expect(toggle).toBeFocused();

    // Reabrir y navegar a Contacto por la UI: el menú se cierra al elegir
    await toggle.click();
    await panel.getByRole("link", { name: "Contacto" }).click();
    await expect(page).toHaveURL(/#contacto$/);
    await expect(page.locator("#nav-movil")).toHaveCount(0);
    await expect(page.locator("#contacto")).toBeInViewport();
  });

  test("el toggle solo existe en móvil (en escritorio hay nav completo)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/es");
    // El botón hamburguesa está oculto (md:hidden) en escritorio
    await expect(
      page.getByRole("button", { name: "Abrir el menú" }),
    ).toBeHidden();
    // El nav de escritorio sí muestra las secciones
    await expect(
      page.getByRole("navigation", { name: "Secciones" }),
    ).toBeVisible();
  });
});

/** Los cuatro destinos del primer nivel, en orden. */
// TRES desde la revisión post-S7: «Roadmap» se fue con las apps a la vitrina.
const PRIMER_NIVEL = ["Hoja de vida", "Portafolio", "Contacto"];

test.describe("Desplegable «Hoja de vida» (escritorio)", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("el menú se queda en TRES destinos y ninguno se llama «Apps» ni «Roadmap»", async ({
    page,
  }) => {
    await page.goto("/es");
    const nav = page.getByRole("navigation", { name: "Secciones" });

    // La guarda de esta pantalla: el header llegó a NUEVE destinos y dejó de
    // caber. Si alguien vuelve a colgar uno del primer nivel, esto se pone rojo
    // antes de que el menú se desborde en producción.
    const rotulos = await nav
      .locator(":scope > a, :scope > div > button")
      .allInnerTexts();
    expect(rotulos.map((r) => r.trim().split("\n")[0])).toEqual(PRIMER_NIVEL);

    // «Apps» prometía lo mismo que «Vitrina» y no enseñaba apps visitables.
    await expect(nav.getByRole("link", { name: "Apps" })).toHaveCount(0);
    // «Roadmap» es una pregunta sobre las apps: vive en /vitrina/apps.
    await expect(nav.getByRole("link", { name: "Roadmap" })).toHaveCount(0);
  });

  test("abre, lleva a una sección, y se opera por teclado", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.locator("form[data-hydrated=true]").waitFor();

    const toggle = page.locator('button[aria-controls="nav-hoja-de-vida"]');
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator("#nav-hoja-de-vida");
    // Las seis secciones del CV, en el orden de la página, ninguna perdida.
    const secciones = [
      "Trayectoria",
      "Logros",
      "Vitrina",
      "Estudios",
      "Certificaciones",
      "Skills",
    ];
    await expect(panel.getByRole("link")).toHaveText(secciones);
    // «Vitrina» es la SECCIÓN de la HOME (#vitrina), no el portal: el portal
    // sigue en el primer nivel, como «Portafolio».
    await expect(
      panel.getByRole("link", { name: "Vitrina", exact: true }),
    ).toHaveAttribute("href", "#vitrina");

    // Escape cierra y devuelve el foco al botón que abrió.
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(toggle).toBeFocused();

    // Elegir una sección navega y cierra.
    await toggle.click();
    await panel.getByRole("link", { name: "Estudios" }).click();
    await expect(page).toHaveURL(/#estudios$/);
    await expect(panel).toHaveCount(0);
    await expect(page.locator("#estudios")).toBeInViewport();
  });

  test("pulsar fuera lo cierra", async ({ page }) => {
    await page.goto("/es");
    const toggle = page.locator('button[aria-controls="nav-hoja-de-vida"]');
    await toggle.click();
    await expect(page.locator("#nav-hoja-de-vida")).toBeVisible();
    // Un panel flotante que solo cierra con Escape deja una capa encima de lo
    // que el visitante quiso mirar.
    await page
      .locator("h1")
      .first()
      .click({ position: { x: 2, y: 2 } });
    await expect(page.locator("#nav-hoja-de-vida")).toHaveCount(0);
  });
});
