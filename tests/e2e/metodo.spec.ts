import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

/**
 * «MÉTODOS» (S10; renombrada en el S14) — `/metodos` y `/metodos/<slug>`. El spec se
 * alimenta de `data/metodo/`, igual que la página: una pieza nueva entra a estas
 * pruebas SOLA, sin tocar el archivo. La ruta vieja (`/metodo`) redirige con 301.
 */

type Pieza = { id: string; slug: string; nombre: { es: string; en: string } };
const piezas: Pieza[] = readdirSync("data/metodo")
  .filter((f) => f.endsWith(".yaml"))
  .map((f) => parse(readFileSync(`data/metodo/${f}`, "utf8")) as Pieza);
if (piezas.length === 0) throw new Error("data/metodo/ sin piezas");

const IDIOMAS = ["es", "en"] as const;

for (const idioma of IDIOMAS) {
  test.describe(`Métodos — la lista (${idioma})`, () => {
    test("lista las piezas publicadas, con el conteo medido de data/metodo/", async ({
      page,
    }) => {
      const res = await page.goto(`/${idioma}/metodos`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("[data-conteo]")).toHaveAttribute(
        "data-conteo",
        String(piezas.length),
      );
      await expect(page.locator("[data-pieza]")).toHaveCount(piezas.length);
      for (const p of piezas)
        await expect(page.locator(`a[data-pieza="${p.slug}"]`)).toHaveAttribute(
          "href",
          `/${idioma}/metodos/${p.slug}`,
        );
    });

    // El Bajo del S10 que la segunda pieza volvió visible (S11): la tarjeta lleva
    // `h-full` dentro de un `Reveal`, y sin `h-full` también en el `Reveal` la
    // tarjeta más corta de una fila no llenaba la celda (214 px frente a 243 px).
    test("a 1280 px las tarjetas de una misma fila miden lo mismo", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`/${idioma}/metodos`);
      const cajas = await page.$$eval("a[data-pieza]", (els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect();
          return { top: Math.round(r.top), alto: Math.round(r.height) };
        }),
      );
      const filas = new Map<number, number[]>();
      for (const c of cajas)
        filas.set(c.top, [...(filas.get(c.top) ?? []), c.alto]);
      for (const [top, altos] of filas)
        expect(
          new Set(altos).size,
          `fila en y=${top}: ${altos.join(", ")}`,
        ).toBe(1);
    });
  });

  for (const pieza of piezas) {
    test.describe(`Métodos — ${pieza.slug} (${idioma})`, () => {
      const ruta = `/${idioma}/metodos/${pieza.slug}`;

      test("200, un h1 con el nombre y los diez bloques con su ancla, del 1 al 10", async ({
        page,
      }) => {
        const res = await page.goto(ruta);
        expect(res?.status()).toBe(200);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          pieza.nombre[idioma],
        );
        const ids = await page
          .locator("section[data-bloque]")
          .evaluateAll((els) => els.map((e) => e.id));
        expect(ids).toEqual(
          Array.from({ length: 10 }, (_, i) => `bloque-${i + 1}`),
        );
      });

      test("cada ancla #bloque-n abre la pieza en ese bloque", async ({
        page,
      }) => {
        for (const n of [3, 6, 10]) {
          await page.goto(`${ruta}#bloque-${n}`);
          await expect(page.locator(`#bloque-${n}-titulo`)).toBeInViewport();
        }
      });

      test("el mapa es texto real con alternativa textual, y la leyenda nombra cada forma", async ({
        page,
      }) => {
        await page.goto(ruta);
        const svg = page.locator('svg[role="img"]').first();
        await expect(svg.locator("title")).not.toBeEmpty();
        await expect(svg.locator("desc")).not.toBeEmpty();
        expect(await svg.locator("text").count()).toBeGreaterThan(3);
        expect(await svg.locator("image").count()).toBe(0);
        await expect(page.locator("[data-mapa-leyenda] li")).toHaveCount(5);
        // La lectura nodo por nodo existe y no está vacía: es la alternativa textual.
        const nodos = await svg.locator("[data-nodo]").count();
        await expect(page.locator("[data-mapa-lectura] ol > li")).toHaveCount(
          nodos,
        );
      });

      test("las tres voces se ven separadas: cada rótulo con su palabra", async ({
        page,
      }) => {
        await page.goto(ruta);
        const leyenda = page.locator("[data-leyenda-voces]");
        await expect(leyenda.locator("[data-voz-rotulo]")).toHaveCount(3);
        for (const voz of ["hice", "campo", "posicion"])
          expect(
            (
              await leyenda.locator(`[data-voz-rotulo="${voz}"]`).innerText()
            ).trim().length,
          ).toBeGreaterThan(3);
        // Ninguna afirmación con voz va sin su rótulo.
        const sinRotulo = await page
          .locator("[data-voz]")
          .evaluateAll(
            (els) =>
              els.filter((e) => !e.querySelector("[data-voz-rotulo]")).length,
          );
        expect(sinRotulo).toBe(0);
      });

      test("una cita [n] lleva a su fuente, y toda fuente trae título, editor, fecha y enlace", async ({
        page,
      }) => {
        await page.goto(ruta);
        const cita = page.locator('a[href^="#fuente-"]').first();
        const destino = (await cita.getAttribute("href"))!;
        await cita.click();
        await expect(page.locator(destino)).toBeInViewport();
        const fuentes = page.locator("li[data-fuente]");
        const n = await fuentes.count();
        expect(n).toBeGreaterThan(0);
        for (let i = 0; i < n; i++) {
          const f = fuentes.nth(i);
          await expect(f.locator('a[href^="https://"]')).not.toBeEmpty();
          await expect(f.locator("time[datetime]")).toHaveCount(1);
        }
        await expect(
          page.locator("#bloque-10 time[datetime]").first(),
        ).toBeVisible();
      });

      // Bajo del S15 (T7, 20 fuentes): el `[n]` no tenía ancho propio, y con diez o
      // más fuentes los títulos de [1]–[9] arrancaban unos píxeles antes que los de
      // [10] en adelante. La columna del número ahora mide lo mismo en todas.
      test("con diez o más fuentes, los títulos de la lista empiezan en la misma columna (1280 y 390 px)", async ({
        page,
      }) => {
        for (const ancho of [1280, 390]) {
          await page.setViewportSize({ width: ancho, height: 900 });
          await page.goto(ruta);
          const fuentes = page.locator("li[data-fuente]");
          const n = await fuentes.count();
          test.skip(n < 10, "la pieza tiene menos de diez fuentes");
          const izquierda = async (i: number) =>
            (await fuentes.nth(i).locator('a[href^="https://"]').boundingBox())!
              .x;
          const primera = await izquierda(0);
          const decima = await izquierda(9);
          expect(
            Math.abs(primera - decima),
            `a ${ancho} px la fuente [1] empieza en x=${primera} y la [10] en x=${decima}`,
          ).toBeLessThan(0.5);
        }
      });

      test("gate ATS/SEO: el HTML sin JavaScript trae los diez bloques, la pregunta y el JSON-LD Article", async ({
        request,
      }) => {
        const html = await (await request.get(ruta)).text();
        for (let n = 1; n <= 10; n++)
          expect(html).toContain(`id="bloque-${n}"`);
        expect(html).toContain(pieza.nombre[idioma]);
        const ld = html.match(
          /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
        );
        expect(ld).not.toBeNull();
        const datos = JSON.parse(ld![1]) as Record<string, string>;
        expect(datos["@type"]).toBe("Article");
        expect(datos.inLanguage).toBe(idioma);
        expect(datos.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        // Next escribe `hrefLang` (con L mayúscula): se compara sin distinguirla.
        for (const alterno of ["es", "en", "x-default"])
          expect(html).toMatch(new RegExp(`hreflang="${alterno}"`, "i"));
      });

      test("la impresión: oculta navegación y pie, mantiene el mapa, y cabe en A4 y en carta", async ({
        page,
      }) => {
        for (const [ancho, alto] of [
          [794, 1123], // A4 a 96 dpi
          [816, 1056], // carta a 96 dpi
        ]) {
          await page.setViewportSize({ width: ancho, height: alto });
          await page.goto(ruta);
          await page.emulateMedia({ media: "print" });
          await expect(page.getByRole("banner")).toBeHidden();
          await expect(page.getByRole("contentinfo")).toBeHidden();
          await expect(page.locator("nav[aria-label]").first()).toBeHidden();
          await expect(page.locator('svg[role="img"]').first()).toBeVisible();
          await expect(page.locator("#bloque-10")).toBeAttached();
          const desborde = await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          );
          expect(
            desborde,
            `desborde horizontal a ${ancho}px`,
          ).toBeLessThanOrEqual(1);
          // Cada tarjeta se mantiene entera: no se parte entre dos páginas.
          const rompe = await page
            .locator("[data-decision], [data-falla], [data-metrica]")
            .evaluateAll(
              (els) =>
                els.filter((e) => getComputedStyle(e).breakInside !== "avoid")
                  .length,
            );
          expect(rompe).toBe(0);
        }
      });

      test("la impresión muestra los diez títulos de bloque sin haber hecho scroll ni pedido «reducir movimiento»", async ({
        browser,
      }) => {
        // Imprimir no dispara el IntersectionObserver de Reveal: sin una regla
        // de impresión, todo bloque que no estaba en pantalla sale sin título.
        // El contexto pide EXPLÍCITAMENTE movimiento normal: con «reduce» el
        // cinturón de reduced-motion lo ocultaba (las capturas del S10 se
        // tomaron así y no vieron el hueco).
        const ctx = await browser.newContext({
          reducedMotion: "no-preference",
          viewport: { width: 794, height: 1123 },
        });
        const page = await ctx.newPage();
        await page.goto(ruta);
        await page.emulateMedia({ media: "print" });
        const opacidades = await page
          .locator("section[data-bloque] h2")
          .evaluateAll((titulos) =>
            titulos.map((h2) => {
              let o = 1;
              for (let e: Element | null = h2; e; e = e.parentElement)
                o *= Number(getComputedStyle(e).opacity);
              return o;
            }),
          );
        expect(opacidades).toHaveLength(10);
        expect(
          opacidades,
          "opacidad efectiva de cada título de bloque al imprimir",
        ).toEqual(Array(10).fill(1));
        // Lo mismo para todo lo que lleva `data-motion`: el papel no espera.
        const ocultos = await page
          .locator("[data-motion]")
          .evaluateAll(
            (els) =>
              els.filter((e) => Number(getComputedStyle(e).opacity) < 1).length,
          );
        expect(ocultos).toBe(0);
        await ctx.close();
      });

      test("con «reducir movimiento» el relleno del riel queda entero y quieto, y la pieza se lee igual", async ({
        browser,
      }) => {
        const ctx = await browser.newContext({ reducedMotion: "reduce" });
        const page = await ctx.newPage();
        await page.goto(ruta);
        await expect(page.locator("[data-riel-relleno]")).toBeAttached();
        const transform = await page
          .locator("[data-riel-relleno]")
          .evaluate((e) => getComputedStyle(e).transform);
        expect(transform).toBe("none");
        await expect(page.locator("section[data-bloque]")).toHaveCount(10);
        await ctx.close();
      });
    });
  }
}

test.describe("Métodos — lo que no existe", () => {
  for (const idioma of IDIOMAS)
    test(`un slug que no es una pieza es 404 (${idioma})`, async ({ page }) => {
      const res = await page.goto(`/${idioma}/metodos/no-existe`);
      expect(res?.status()).toBe(404);
    });
});

test.describe("Métodos — móvil", () => {
  test("a 390 px la página no se desborda de lado y el mapa se desliza dentro de su región", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/es/metodos/${piezas[0].slug}`);
    const m = await page.evaluate(() => ({
      pagina:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      region: (() => {
        const r = document.querySelector(
          '[role="region"]',
        ) as HTMLElement | null;
        return r ? r.scrollWidth - r.clientWidth : -1;
      })(),
    }));
    expect(m.pagina, "scroll horizontal de la PÁGINA").toBeLessThanOrEqual(1);
    expect(m.region, "el mapa se desliza dentro de su región").toBeGreaterThan(
      0,
    );
    await page.locator('[role="region"]').focus();
    await expect(page.locator('[role="region"]')).toBeFocused();
  });
});

test.describe("Métodos — descubrimiento", () => {
  test("el menú lleva a /metodos desde el primer nivel (escritorio)", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "el menú móvil se ejerce en nav-header.spec");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/es");
    await page
      .getByRole("navigation", { name: "Secciones" })
      .getByRole("link", { name: "Métodos", exact: true })
      .click();
    await expect(page).toHaveURL(/\/es\/metodos$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("el sitemap trae la lista y cada pieza, en los dos idiomas, con sus alternates", async ({
    request,
  }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const idioma of IDIOMAS) {
      expect(xml).toContain(`/${idioma}/metodos</loc>`);
      for (const p of piezas)
        expect(xml).toContain(`/${idioma}/metodos/${p.slug}</loc>`);
    }
  });
});

// La ruta vieja (S14). «Mi método» (`/metodo`) pasó a «Métodos» (`/metodos`): los
// enlaces que ya circulan no pueden dejar de servir. 301 (permanente, el que pide
// el criterio de fin; `redirects()` de Next solo emite 308) y el ancla sobrevive.
test.describe("Métodos — la ruta vieja redirige", () => {
  for (const idioma of IDIOMAS) {
    test(`la lista y una pieza viejas dan 301 a /metodos (${idioma})`, async ({
      request,
    }) => {
      const slug = piezas[0].slug;
      for (const [vieja, nueva] of [
        [`/${idioma}/metodo`, `/${idioma}/metodos`],
        [`/${idioma}/metodo/${slug}`, `/${idioma}/metodos/${slug}`],
      ]) {
        const res = await request.get(vieja, { maxRedirects: 0 });
        expect(res.status(), vieja).toBe(301);
        expect(
          new URL(res.headers()["location"], "http://sitio.test").pathname,
          vieja,
        ).toBe(nueva);
      }
    });

    test(`un enlace viejo a un bloque llega a /metodos con su ancla (${idioma})`, async ({
      page,
    }) => {
      const slug = piezas[0].slug;
      await page.goto(`/${idioma}/metodo/${slug}#bloque-3`);
      await expect(page).toHaveURL(
        new RegExp(`/${idioma}/metodos/${slug}#bloque-3$`),
      );
      await expect(page.locator("#bloque-3-titulo")).toBeInViewport();
    });
  }

  test("sin idioma, /metodo da 301 a la lista en español", async ({
    request,
  }) => {
    const res = await request.get("/metodo", { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(
      new URL(res.headers()["location"], "http://sitio.test").pathname,
    ).toBe("/es/metodos");
  });
});
