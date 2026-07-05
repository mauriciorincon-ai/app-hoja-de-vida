import { expect, test } from "@playwright/test";

const SECTIONS = ["trayectoria", "logros", "proyectos", "apps", "contacto"];

test.describe("HOME — happy path del sprint", () => {
  test("carga, recorre secciones, cambia idioma y envía la solicitud", async ({
    page,
  }) => {
    await page.goto("/es");

    // Hero con identidad desde data/cv.es.yaml
    await expect(page.locator("h1")).toContainText("Mauricio Rincón");

    // La página está hidratada cuando el form montó su handler
    await page.locator("form[data-hydrated=true]").waitFor();

    // Scroll por las 6 secciones — todas presentes y con heading
    for (const id of SECTIONS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(
        page.locator(`#${id} h2, #${id} [id$="-titulo"]`).first(),
      ).toBeAttached();
    }

    // Showcase data-driven: las 3 apps de data/apps.yaml
    await expect(page.locator("#apps [data-app-id]")).toHaveCount(3);

    // Toggle de idioma (conserva la página, cambia la ruta) — timeout amplio:
    // bajo carga paralela la navegación client-side puede exceder los 5s
    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(/\/en$/, { timeout: 15_000 });
    await expect(page.locator("#trayectoria h2")).toHaveText("Career", {
      timeout: 15_000,
    });

    // Enviar solicitud de acceso end-to-end (sin API key → envío simulado)
    await page.locator("#contacto").scrollIntoViewIfNeeded();
    await page.locator("form[data-hydrated=true]").waitFor();
    await page.getByLabel("Your name").fill("E2E Tester");
    await page.getByLabel("Your email").fill("e2e@example.com");
    await page
      .getByLabel("Which app do you want to try?")
      .selectOption("idea-exploracion-1");
    await page.getByRole("button", { name: "I want to try it" }).click();

    // Confirmación humana
    await expect(page).toHaveURL(/\/en\/solicitud-enviada/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "I got your request",
    );
  });

  test("el contenido completo está en el HTML estático (gate ATS/SEO)", async ({
    request,
  }) => {
    for (const locale of ["es", "en"]) {
      const res = await request.get(`/${locale}`);
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toContain("Mauricio Rincón");
      expect(html).toContain("application/ld+json");
      expect(html).toContain('hrefLang="es"');
      expect(html).toContain('hrefLang="en"');
      // Contenido de secciones sin ejecutar JS, en el idioma de la ruta
      expect(html).toContain(locale === "es" ? "CV Viva" : "Living CV");
      expect(html).toContain(
        locale === "es" ? "En construcción" : "In construction",
      );
    }
  });

  test("404 localizado para rutas desconocidas", async ({ page }) => {
    const res = await page.goto("/es/no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Esta página no existe",
    );
  });
});
