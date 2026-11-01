import { existsSync, readdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { parse } from "yaml";

/**
 * LA NUMERACIÓN DE LAS SECCIONES (OM-29, S28) — en todas las páginas de una pieza.
 *
 * El dueño pidió «numeración en todas las fichas que no la tengan». La ficha técnica ya la tenía
 * desde el S7 (`numerarSecciones`: un solo renderizador para los cuatro frentes) y la única página
 * sin números era el detalle de una app, que el brochure reemplazó. Así que OM-29 se cumple con dos
 * cosas, y esta prueba las fija contra las páginas reales:
 *
 *  1. **La ficha técnica** de cada pieza publicada —las apps y las de los frentes abiertos— numera
 *     sus secciones seguidas desde 01, sin hueco aunque una opcional falte (proceso, conclusiones,
 *     galería).
 *  2. **El brochure** de las doce numera 01… seguido (portada aparte), y sus capítulos, 2.1…
 *
 * Data-driven: los frentes y las piezas salen de `data/vitrina.yaml` y `content/`, la misma fuente
 * que renderiza la página. Una pieza nueva entra a la prueba sola. Desde el S31 ninguna app tiene
 * ficha: las diez abren en su brochure y se miden como brochure, en su entrada.
 */

const entradaDe = (slug: string) => `/es/portafolio/apps/${slug}`;

type Frente = { id: string; estado: "abierta" | "en-preparacion" };
const FRENTES = (
  parse(readFileSync("data/vitrina.yaml", "utf8")) as { categorias: Frente[] }
).categorias;

const slugsDe = (dir: string, sufijo: string, campo: "app" | "pieza") =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith(sufijo))
        .map(
          (f) =>
            (
              JSON.parse(readFileSync(`${dir}/${f}`, "utf8")) as Record<
                string,
                { slug: string }
              >
            )[campo].slug,
        )
    : [];

/** Las fichas técnicas que se publican, por frente: las de las apps no están (son brochures, S31). */
const FRENTES_CON_FICHA = FRENTES.filter(
  (f) => f.estado === "abierta" && f.id !== "apps",
);
const FICHAS: { frente: string; ruta: string }[] = FRENTES_CON_FICHA.flatMap(
  (f) =>
    slugsDe(`content/${f.id}`, ".ficha-tecnica.json", "pieza").map((s) => ({
      frente: f.id,
      ruta: `/es/portafolio/${f.id}/${s}`,
    })),
);
const SLUGS_BROCHURE = [
  ...slugsDe("content/vitrina", ".brochure-export.json", "app"),
  ...slugsDe("content/vitrina/casa", ".brochure-export.json", "app"),
];

const dosDigitos = (n: number) => String(n).padStart(2, "0");

async function textos(page: Page, selector: string) {
  return (await page.locator(selector).allTextContents()).map((t) => t.trim());
}

test.describe("OM-29 · la ficha técnica numera sus secciones, en los frentes abiertos", () => {
  test("hay fichas de los frentes abiertos (si no, esta prueba no mide nada)", () => {
    expect(FICHAS.length).toBeGreaterThan(0);
    for (const f of FRENTES_CON_FICHA)
      expect(
        FICHAS.some((x) => x.frente === f.id),
        `el frente «${f.id}» está abierto: tiene fichas`,
      ).toBe(true);
  });

  test("cada ficha numera 01, 02, 03… seguido, sin hueco", async ({ page }) => {
    for (const { frente, ruta } of FICHAS) {
      await page.goto(ruta);
      // El número de cada <section> con título: el <span> que va antes de su <h2>.
      const numeros = await textos(
        page,
        "[data-ficha-tecnica] section[aria-labelledby] > div > span:first-child",
      );
      expect(
        numeros.length,
        `${frente} · ${ruta}: secciones numeradas`,
      ).toBeGreaterThanOrEqual(4);
      expect(numeros, `${frente} · ${ruta}: 01… seguido`).toEqual(
        numeros.map((_, i) => dosDigitos(i + 1)),
      );
    }
  });
});

test.describe("OM-29 · el brochure numera sus secciones y sus capítulos", () => {
  for (const slug of SLUGS_BROCHURE) {
    test(`${slug}: 01… seguido en las secciones y 2.1… seguido en los capítulos`, async ({
      page,
    }) => {
      await page.goto(entradaDe(slug));
      const secciones = await textos(page, "[data-brochure] .sec-num");
      expect(secciones.length, "secciones numeradas").toBeGreaterThanOrEqual(4);
      expect(secciones, "secciones: 01… seguido").toEqual(
        secciones.map((_, i) => dosDigitos(i + 1)),
      );
      const capitulos = await textos(
        page,
        "[data-brochure] details.capitulo .cap-num",
      );
      expect(capitulos.length, "capítulos numerados").toBeGreaterThan(0);
      // Los capítulos cuelgan de la sección 02 (el mapa): 2.1, 2.2…
      expect(capitulos, "capítulos: 2.1… seguido").toEqual(
        capitulos.map((_, i) => `2.${i + 1}`),
      );
    });
  }
});
