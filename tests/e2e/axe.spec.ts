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
  // La vitrina (S5): ruta pública nueva ⇒ entra a axe EN SU MISMA FASE
  // (regla 9 + kit v1.24.1).
  "/es/vitrina",
  "/en/vitrina",
];

for (const ruta of RUTAS) {
  test(`axe limpio en ${ruta}`, async ({ page }) => {
    // El scan de la HOME (con la capa de profundidad) excede 30s bajo carga
    // paralela de workers — axe necesita margen, no está colgado
    test.slow();
    await page.goto(ruta);
    // Estado final de la página (el footer existe en todas las rutas)
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Lo plegado TAMBIÉN se audita. Sin esto, todo lo que vive dentro de una
    // tarjeta o de un <details> sale del scan y la ruta pasa en verde por no
    // haber sido mirada — el banco de técnicas lo pide explícito ("axe con el
    // detalle abierto"). Genérico a propósito: cualquier ruta que estrene un
    // plegable queda cubierta el día que lo estrene.
    await page.evaluate(() => {
      for (const d of document.querySelectorAll("details")) d.open = true;
      for (const t of document.querySelectorAll(".tarjeta-vitrina")) {
        t.setAttribute("data-abierta", "");
        t.setAttribute("data-manual", ""); // que el scroll del scan no la cierre
        t.querySelector(".tarjeta-boton")?.setAttribute(
          "aria-expanded",
          "true",
        );
      }
    });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
