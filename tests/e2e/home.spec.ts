import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

const SECTIONS = ["trayectoria", "logros", "proyectos", "apps", "contacto"];

// Los e2e leen el contenido real: editar data/*.yaml jamás rompe la suite
type AppEntry = {
  id: string;
  solicitable?: boolean;
  nombre: { es: string; en: string };
};
const cvEs = parse(readFileSync("data/cv.es.yaml", "utf8")) as {
  identidad: { nombre: string };
};
const { apps } = parse(readFileSync("data/apps.yaml", "utf8")) as {
  apps: AppEntry[];
};
const nombre = cvEs.identidad.nombre;
const appSolicitable = apps.find((a) => a.solicitable !== false);
if (!appSolicitable) throw new Error("apps.yaml sin apps solicitables");

test.describe("HOME — happy path del sprint", () => {
  test("carga, recorre secciones, cambia idioma y envía la solicitud", async ({
    page,
  }) => {
    await page.goto("/es");

    // Hero con identidad desde data/cv.es.yaml
    await expect(page.locator("h1")).toContainText(nombre);

    // La página está hidratada cuando el form montó su handler
    await page.locator("form[data-hydrated=true]").waitFor();

    // Scroll por las 6 secciones — todas presentes y con heading
    for (const id of SECTIONS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(
        page.locator(`#${id} h2, #${id} [id$="-titulo"]`).first(),
      ).toBeAttached();
    }

    // Showcase data-driven: exactamente las apps de data/apps.yaml
    await expect(page.locator("#apps [data-app-id]")).toHaveCount(apps.length);

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
      .selectOption(appSolicitable.id);
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
      expect(html).toContain(nombre);
      expect(html).toContain("application/ld+json");
      expect(html).toContain('hrefLang="es"');
      expect(html).toContain('hrefLang="en"');
      // Contenido de secciones sin ejecutar JS, en el idioma de la ruta
      expect(html).toContain(apps[0].nombre[locale as "es" | "en"]);
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
