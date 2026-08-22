import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

// El scan audita el estado final de la página, no frames intermedios de
// animación (elementos a media opacidad disparan falsos positivos de contraste)
test.use({ contextOptions: { reducedMotion: "reduce" } });

// Primer case study real: las rutas nuevas del S2 también pasan por axe
const { proyectos } = parse(readFileSync("data/cv.es.yaml", "utf8")) as {
  proyectos: { slug: string; casestudy?: unknown }[];
};
const slug = proyectos.find((p) => p.casestudy)?.slug;
if (!slug) throw new Error("cv.es.yaml sin case studies");

// Primera app con brochure (S4): la ruta pública nueva también pasa por axe
const { apps } = parse(readFileSync("data/apps.yaml", "utf8")) as {
  apps: { id: string; brochure?: unknown }[];
};
const brochureSlug = apps.find((a) => a.brochure)?.id;
if (!brochureSlug) throw new Error("apps.yaml sin brochures");

const RUTAS = [
  "/es",
  "/en",
  `/es/proyectos/${slug}`,
  `/en/proyectos/${slug}`,
  "/es/cv",
  "/en/cv",
  `/es/apps/${brochureSlug}`,
  `/en/apps/${brochureSlug}`,
];

for (const ruta of RUTAS) {
  test(`axe limpio en ${ruta}`, async ({ page }) => {
    // El scan de la HOME (con la capa de profundidad) excede 30s bajo carga
    // paralela de workers — axe necesita margen, no está colgado
    test.slow();
    await page.goto(ruta);
    // Estado final de la página (el footer existe en todas las rutas)
    await page.locator("footer").scrollIntoViewIfNeeded();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
