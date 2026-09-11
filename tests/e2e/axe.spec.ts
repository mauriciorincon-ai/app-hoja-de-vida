import { existsSync, readdirSync, readFileSync } from "node:fs";
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

// Las apps hermanas de la vitrina (S5), leídas de los exports igual que la
// página: el slug sale del contenido, no del nombre del archivo.
const slugsVitrina = readdirSync("content/vitrina")
  .filter((f) => f.endsWith(".brochure-export.json"))
  .map(
    (f) =>
      (
        JSON.parse(readFileSync(`content/vitrina/${f}`, "utf8")) as {
          app: { slug: string };
        }
      ).app.slug,
  );
if (slugsVitrina.length === 0) throw new Error("content/vitrina sin exports");

// Los frentes (ADR-015 · S7): cada uno tiene su página —escaparate si está
// abierto, «en preparación» si no— y los abiertos tienen además una ruta por
// pieza. Todo se lee del mismo YAML y de `content/<frente>/` que renderiza la
// página, así que una ficha nueva entra al scan SOLA.
const frentesYaml = (
  parse(readFileSync("data/vitrina.yaml", "utf8")) as {
    categorias: { id: string; estado: string }[];
  }
).categorias.filter((c) => c.id !== "apps");

const piezasDe = (frente: string): string[] => {
  const dir = `content/${frente}`;
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ficha-tecnica.json"))
    .map(
      (f) =>
        (
          JSON.parse(readFileSync(`${dir}/${f}`, "utf8")) as {
            pieza: { slug: string };
          }
        ).pieza.slug,
    );
};

const RUTAS = [
  "/es",
  "/en",
  `/es/proyectos/${slug}`,
  `/en/proyectos/${slug}`,
  "/es/cv",
  "/en/cv",
  `/es/apps/${brochureSlug}`,
  `/en/apps/${brochureSlug}`,
  // La vitrina (S5 · ADR-015): rutas públicas nuevas ⇒ entran a axe EN SU
  // MISMA FASE (regla 9 + kit v1.24.1). El portal, el escaparate de apps, LAS
  // SEIS fichas (cada una en su ruta) y los frentes en preparación — se listan
  // desde los exports y el YAML para que una pieza nueva entre al scan sola.
  "/es/vitrina",
  "/en/vitrina",
  "/es/vitrina/apps",
  "/en/vitrina/apps",
  // Por app: la ficha técnica (ADR-016) Y su detalle — dos rutas, dos scans.
  ...slugsVitrina.flatMap((s) => [
    `/es/vitrina/apps/${s}`,
    `/en/vitrina/apps/${s}`,
    `/es/vitrina/apps/${s}/detalle`,
    `/en/vitrina/apps/${s}/detalle`,
  ]),
  // Cada frente, y cada pieza de los que están abiertos (S7).
  ...frentesYaml.flatMap((f) => [
    `/es/vitrina/${f.id}`,
    `/en/vitrina/${f.id}`,
    ...(f.estado === "abierta"
      ? piezasDe(f.id).flatMap((s) => [
          `/es/vitrina/${f.id}/${s}`,
          `/en/vitrina/${f.id}/${s}`,
        ])
      : []),
  ]),
];

for (const ruta of RUTAS) {
  test(`axe limpio en ${ruta}`, async ({ page }) => {
    // El scan de la HOME (con la capa de profundidad) excede 30s bajo carga
    // paralela de workers — axe necesita margen, no está colgado
    test.slow();
    // Este spec corre con «reducir movimiento» en TODAS las rutas: es el sitio
    // exacto para exigir una hidratación limpia bajo esa preferencia. Un
    // desajuste servidor/cliente (React #418) regenera el árbol en silencio y
    // aquí se veía como un «footer not attached» intermitente (2026-09-10).
    const erroresDePagina: string[] = [];
    page.on("pageerror", (e) => erroresDePagina.push(e.message));
    await page.goto(ruta);
    // Estado final de la página (el footer existe en todas las rutas)
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Lo plegado TAMBIÉN se audita. Sin esto, todo lo que vive dentro de una
    // tarjeta o de un <details> sale del scan y la ruta pasa en verde por no
    // haber sido mirada — el banco de técnicas lo pide explícito ("axe con el
    // detalle abierto"). Genérico a propósito: cualquier ruta que estrene un
    // plegable queda cubierta el día que lo estrene.
    // Lo que nace CERRADO es invisible para axe — y por tanto, sin abrirlo,
    // el scan pasa en verde sin haber mirado nada. Ya pasó en el S5 con los
    // `<details>`; el desplegable del header es el mismo modo de falla.
    const desplegable = page.locator(
      'button[aria-controls="nav-hoja-de-vida"]',
    );
    if (await desplegable.isVisible().catch(() => false))
      await desplegable.click();
    const hamburguesa = page.getByRole("button", { name: "Abrir el menú" });
    if (await hamburguesa.isVisible().catch(() => false))
      await hamburguesa.click();

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
    expect(erroresDePagina, "errores de página (hidratación incluida)").toEqual([]);
  });
}
