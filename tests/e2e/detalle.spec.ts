import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

// Contenido real: la suite no se rompe al editar data/*.yaml
type Proyecto = {
  slug: string;
  nombre: string;
  casestudy?: { contexto: string; acciones: string[] };
};
const cvEs = parse(readFileSync("data/cv.es.yaml", "utf8")) as {
  proyectos: Proyecto[];
};
const cvEn = parse(readFileSync("data/cv.en.yaml", "utf8")) as {
  proyectos: Proyecto[];
};
const proyectoEs = cvEs.proyectos.find((p) => p.casestudy);
if (!proyectoEs?.casestudy) {
  throw new Error("cv.es.yaml sin case studies");
}
const proyectoEn = cvEn.proyectos.find((p) => p.slug === proyectoEs.slug);
if (!proyectoEn?.casestudy) {
  throw new Error(`cv.en.yaml sin el case study ${proyectoEs.slug}`);
}

test.describe("Páginas de detalle /proyectos/<slug> (capa 2)", () => {
  test("home → case study → toggle de idioma conserva la ruta → breadcrumb regresa", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.locator("form[data-hydrated=true]").waitFor();
    await page.locator("#proyectos").scrollIntoViewIfNeeded();

    // Entrar al primer case study desde su card — timeout amplio: bajo carga
    // paralela la navegación client-side puede exceder los 5s (lección S1)
    await page.getByRole("link", { name: "Ver case study" }).first().click();
    await expect(page).toHaveURL(
      new RegExp(`/es/proyectos/${proyectoEs.slug}$`),
      { timeout: 15_000 },
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      proyectoEs.nombre,
      { timeout: 15_000 },
    );

    // El toggle de idioma conserva la página de detalle
    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(
      new RegExp(`/en/proyectos/${proyectoEs.slug}$`),
      { timeout: 15_000 },
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      proyectoEn.nombre,
      { timeout: 15_000 },
    );

    // Breadcrumb: regreso a la sección Proyectos de la HOME
    await page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link")
      .click();
    await expect(page).toHaveURL(/\/en#proyectos$/);
  });

  test("el case study completo está en el HTML estático (gate ATS/SEO)", async ({
    request,
  }) => {
    for (const [locale, proyecto] of [
      ["es", proyectoEs],
      ["en", proyectoEn],
    ] as const) {
      const res = await request.get(`/${locale}/proyectos/${proyecto.slug}`);
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toContain(proyecto.nombre);
      expect(html).toContain(proyecto.casestudy!.acciones[0]);
      expect(html).toContain("application/ld+json");
      expect(html).toContain('hrefLang="es"');
      expect(html).toContain('hrefLang="en"');
    }
  });

  test("slug desconocido responde 404 localizado", async ({ page }) => {
    const res = await page.goto("/es/proyectos/no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Esta página no existe",
    );
  });
});
