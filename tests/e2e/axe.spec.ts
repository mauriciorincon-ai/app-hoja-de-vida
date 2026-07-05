import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// El scan audita el estado final de la página, no frames intermedios de
// animación (elementos a media opacidad disparan falsos positivos de contraste)
test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const locale of ["es", "en"] as const) {
  test(`axe limpio en /${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    // Estado final de la página (sin animaciones a medio camino)
    await page.locator("#contacto").scrollIntoViewIfNeeded();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
