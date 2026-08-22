import { expect, test } from "@playwright/test";

/**
 * Nav móvil del header (deuda S1, pagada en S4). El disclosure hamburguesa
 * debe ser operable por teclado y anunciar su estado. Solo aplica en viewport
 * móvil (el nav de escritorio se muestra a partir de md).
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
    await expect(panel.getByRole("link", { name: "Roadmap" })).toBeVisible();

    // Escape cierra y devuelve el foco al botón
    await page.keyboard.press("Escape");
    await expect(page.locator("#nav-movil")).toHaveCount(0);
    await expect(toggle).toBeFocused();

    // Reabrir y navegar a Roadmap por la UI: el menú se cierra al elegir
    await toggle.click();
    await panel.getByRole("link", { name: "Roadmap" }).click();
    await expect(page).toHaveURL(/#roadmap$/);
    await expect(page.locator("#nav-movil")).toHaveCount(0);
    await expect(page.locator("#roadmap")).toBeInViewport();
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
