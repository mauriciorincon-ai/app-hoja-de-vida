import { readFileSync } from "node:fs";
import { expect, test, type Locator } from "@playwright/test";
import { parse } from "yaml";

test.use({ contextOptions: { reducedMotion: "reduce" } });

// Valor real del primer logro: editar data/*.yaml no rompe la suite
const cvEs = parse(readFileSync("data/cv.es.yaml", "utf8")) as {
  logros: { valor: number }[];
  trayectoria: { bullets?: string[] }[];
  proyectos: { slug: string; casestudy?: unknown }[];
};
const primerLogro = cvEs.logros[0].valor;
const primerBullet = cvEs.trayectoria.find((t) => t.bullets?.length)
  ?.bullets?.[0];
const slugConCasestudy = cvEs.proyectos.find((p) => p.casestudy)?.slug;

/**
 * Devuelve null si el elemento y TODOS sus ancestros están en estado final
 * (opacity 1, sin transform); si no, describe el nodo ofensor.
 */
async function findAnimatedAncestor(locator: Locator): Promise<string | null> {
  return locator.evaluate((el) => {
    let node: Element | null = el;
    while (node instanceof Element) {
      const style = getComputedStyle(node);
      const identity =
        style.transform === "none" ||
        style.transform === "matrix(1, 0, 0, 1, 0, 0)";
      if (style.opacity !== "1" || !identity) {
        return `${node.tagName}.${node.className} opacity=${style.opacity} transform=${style.transform}`;
      }
      node = node.parentElement;
    }
    return null;
  });
}

test.describe("prefers-reduced-motion (criterio de aceptación e2e)", () => {
  test("todo el contenido queda visible sin movimiento, sin scroll previo", async ({
    page,
  }) => {
    await page.goto("/es");
    // Estado estable post-hidratación (la ventana pre-hidratación la cubre
    // el cinturón CSS [data-motion] de globals.css)
    await page.locator("form[data-hydrated=true]").waitFor();

    // El hero está en estado final de inmediato
    expect(await findAnimatedAncestor(page.locator("h1"))).toBeNull();

    // Secciones bajo el fold: estado final sin necesidad de entrar al viewport
    for (const selector of [
      "#perfil h2",
      "#trayectoria h2",
      "#logros h2",
      "#proyectos h2",
      "#skills h2",
      "#certificaciones h2",
      "#apps h2",
      "#contacto h2",
    ]) {
      expect(await findAnimatedAncestor(page.locator(selector))).toBeNull();
    }

    // El counter muestra el valor final fijo (no arranca de 0)
    const counter = page.locator("#logros .tabular-nums").first();
    await expect(counter).toHaveText(new RegExp(String(primerLogro)));
  });

  test("el disclosure expande sin animación y el contenido queda visible", async ({
    page,
  }) => {
    test.skip(!primerBullet, "sin bullets en el contenido");
    await page.goto("/es");
    await page.locator("form[data-hydrated=true]").waitFor();

    const boton = page
      .locator('button[aria-controls^="hito-bullets-"]')
      .first();
    await boton.click();
    await expect(page.getByText(primerBullet!)).toBeVisible();
    expect(
      await findAnimatedAncestor(page.getByText(primerBullet!)),
    ).toBeNull();
  });

  test("la página de detalle queda en estado final sin movimiento", async ({
    page,
  }) => {
    test.skip(!slugConCasestudy, "sin case studies en el contenido");
    await page.goto(`/es/proyectos/${slugConCasestudy}`);
    expect(
      await findAnimatedAncestor(page.getByRole("heading", { level: 1 })),
    ).toBeNull();
    expect(await findAnimatedAncestor(page.locator("#cs-impacto"))).toBeNull();
  });
});
