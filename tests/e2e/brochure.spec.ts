import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

/**
 * Brochures animadas por app (S4). Cubre la navegación POR LA UI (clic desde
 * el showcase, no solo page.goto), el contenido estático bilingüe y el gate
 * ATS/SEO. Data-driven: lee data/apps.yaml real.
 */

type Brochure = {
  tagline: { es: string; en: string };
  funcionalidades: { titulo: { es: string; en: string } }[];
};
type AppEntry = {
  id: string;
  estado: string;
  nombre: { es: string; en: string };
  brochure?: Brochure;
};

const { apps } = parse(readFileSync("data/apps.yaml", "utf8")) as {
  apps: AppEntry[];
};
const conBrochure = apps.filter((a) => a.brochure);
const primera = conBrochure[0];
if (!primera?.brochure) throw new Error("apps.yaml sin brochures");
const sinBrochure = apps.find((a) => !a.brochure);

test.describe("Brochures por app", () => {
  test("se llega a la brochure DESDE el showcase (por la UI)", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.locator("form[data-hydrated=true]").waitFor();
    await page.locator("#apps").scrollIntoViewIfNeeded();

    // Clic en "Ver la app" de la card de la primera app con brochure
    const card = page.locator(`#apps [data-app-id="${primera.id}"]`);
    await card.getByRole("link", { name: /Ver la app/ }).click();

    await expect(page).toHaveURL(new RegExp(`/es/apps/${primera.id}$`));
    // El h1 y el tagline de la brochure
    await expect(page.locator("h1")).toContainText(primera.nombre.es);
    await expect(page.getByText(primera.brochure!.tagline.es)).toBeVisible();
    // Las funcionalidades se renderizan
    await expect(
      page.getByRole("heading", {
        name: primera.brochure!.funcionalidades[0].titulo.es,
      }),
    ).toBeVisible();
  });

  test("el contenido de la brochure está en el HTML estático (gate ATS/SEO)", async ({
    request,
  }) => {
    for (const locale of ["es", "en"] as const) {
      const res = await request.get(`/${locale}/apps/${primera.id}`);
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toContain(primera.brochure!.tagline[locale]);
      expect(html).toContain(
        primera.brochure!.funcionalidades[0].titulo[locale],
      );
      expect(html).toContain("application/ld+json");
      expect(html).toContain(`hrefLang="${locale}"`);
    }
  });

  test("una app sin brochure no tiene página (404)", async ({ page }) => {
    test.skip(!sinBrochure, "todas las apps tienen brochure");
    const res = await page.goto(`/es/apps/${sinBrochure!.id}`);
    expect(res?.status()).toBe(404);
  });

  test("CTA de la brochure vuelve al formulario de contacto", async ({
    page,
  }) => {
    await page.goto(`/es/apps/${primera.id}`);
    await page.getByRole("link", { name: /Hablemos/ }).click();
    await expect(page).toHaveURL(/#contacto$/);
  });
});
