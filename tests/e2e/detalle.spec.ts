import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

// Contenido real: la suite no se rompe al editar data/*.yaml
type Proyecto = {
  slug: string;
  nombre: string;
  casestudy?: {
    titular: string;
    contexto: string;
    cifras: { valor: number; etiqueta: string }[];
    capitulos: { titulo: string; texto: string }[];
    leccion: string;
  };
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
    await page.locator("#trayectoria").scrollIntoViewIfNeeded();

    // Entrar al primer case study desde SU HITO de la trayectoria (la sección
    // «Proyectos» dejó la HOME en la revisión post-S7) — timeout amplio: bajo
    // carga paralela la navegación client-side puede exceder los 5s.
    await page
      .locator(
        `#trayectoria [data-case-study][href$="/proyectos/${proyectoEs.slug}"]`,
      )
      .click();
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

    // Breadcrumb: regreso a la trayectoria de la HOME, que es de donde se vino
    await page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link")
      .click();
    await expect(page).toHaveURL(/\/en#trayectoria$/);
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
      expect(html).toContain(proyecto.casestudy!.titular);
      expect(html).toContain(proyecto.casestudy!.capitulos[0].texto);
      expect(html).toContain("application/ld+json");
      expect(html).toContain('hrefLang="es"');
      expect(html).toContain('hrefLang="en"');
    }
  });

  // Revisión 2026-09-24: cada caso trae su pieza completa — tesis, banda de
  // cifras, capítulos numerados y lección — y ninguno se queda en cuatro frases.
  // Recorre los OCHO, leídos del YAML: un caso nuevo entra a esta prueba solo.
  test("cada caso de estudio muestra tesis, cifras, capítulos y lección", async ({
    page,
  }) => {
    test.slow();
    const casos = cvEs.proyectos.filter((p) => p.casestudy);
    expect(casos.length).toBeGreaterThanOrEqual(8);
    for (const p of casos) {
      const c = p.casestudy!;
      await page.goto(`/es/proyectos/${p.slug}`);
      await expect(page.getByTestId("cs-titular"), p.slug).toHaveText(
        c.titular,
      );
      await expect(
        page.getByTestId("cs-cifras").getByRole("listitem"),
        p.slug,
      ).toHaveCount(c.cifras.length);
      await expect(page.getByTestId("cs-capitulo"), p.slug).toHaveCount(
        c.capitulos.length,
      );
      await expect(page.getByTestId("cs-leccion"), p.slug).toContainText(
        c.leccion,
      );
    }
  });

  test("los casos se leen seguidos: el siguiente sigue el orden de la trayectoria", async ({
    page,
  }) => {
    const cv = parse(readFileSync("data/cv.es.yaml", "utf8")) as {
      trayectoria: { proyecto?: string }[];
    };
    const orden = cv.trayectoria.map((h) => h.proyecto).filter(Boolean);
    await page.goto(`/es/proyectos/${orden[0]}`);
    await expect(page.getByTestId("cs-vecino-anterior")).toHaveCount(0);
    await page.getByTestId("cs-vecino-siguiente").click();
    await expect(page).toHaveURL(new RegExp(`/es/proyectos/${orden[1]}$`), {
      timeout: 15_000,
    });
    await expect(page.getByTestId("cs-vecino-anterior")).toHaveAttribute(
      "href",
      `/es/proyectos/${orden[0]}`,
    );
  });

  test("slug desconocido responde 404 localizado", async ({ page }) => {
    const res = await page.goto("/es/proyectos/no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Esta página no existe",
    );
  });
});
