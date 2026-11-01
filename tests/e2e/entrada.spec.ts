import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { entradasBrochure } from "../../scripts/entradas-brochure.mjs";

/**
 * EL BROCHURE COMO ENTRADA DE LA APP (S30, «1b»), contra el sitio real.
 *
 *  1. La casa y las apps con su contenido v2 abren `/portafolio/apps/<app>` en su brochure; las demás,
 *     en su ficha. La lista se mide del disco (`scripts/entradas-brochure.mjs`), como la mide el build.
 *  2. Su `/brochure`, su detalle y la página vieja de la casa llegan a la entrada en UN 301, que el
 *     proxy recibe del build; el `/brochure` de una app con ficha sigue respondiendo 200.
 *  3. Ningún enlace interno ni ninguna URL del sitemap lleva a una redirección.
 */

const ENTRADAS = entradasBrochure();
// Las diez del Portafolio, en el orden del escaparate (profesionales, personales).
const APPS: string[] = Object.values(
  parse(readFileSync("data/categorias-apps.yaml", "utf8")) as Record<
    string,
    { slug: string }[]
  >,
).flatMap((grupo) => grupo.map((a) => a.slug));
const CON_FICHA = APPS.filter((a) => !ENTRADAS.includes(a));

test.describe("la entrada de cada app", () => {
  test("hay de las dos: la casa y la piloto en su brochure, las demás en su ficha", () => {
    expect(ENTRADAS).toEqual(
      expect.arrayContaining([
        "hoja-de-vida",
        "chat-hoja-de-vida",
        "inmobiliaria",
      ]),
    );
    expect(CON_FICHA.length, "apps que siguen con ficha").toBeGreaterThan(0);
    expect(CON_FICHA).toContain("ds");
  });

  for (const l of ["es", "en"] as const) {
    test(`/${l}: las que abren en su brochure lo pintan, y las demás su ficha`, async ({
      request,
    }) => {
      for (const app of ENTRADAS) {
        const res = await request.get(`/${l}/portafolio/apps/${app}`, {
          maxRedirects: 0,
        });
        expect(res.status(), app).toBe(200);
        const html = await res.text();
        expect(html, `${app}: brochure`).toContain("data-brochure");
        expect(html, `${app}: sin ficha`).not.toContain("data-ficha-tecnica=");
        // Su hreflang es la entrada, no `/brochure`.
        expect(html).toMatch(
          new RegExp(`hrefLang="en" href="[^"]*/en/portafolio/apps/${app}"`),
        );
      }
      for (const app of CON_FICHA) {
        const res = await request.get(`/${l}/portafolio/apps/${app}`, {
          maxRedirects: 0,
        });
        expect(res.status(), app).toBe(200);
        expect(await res.text(), `${app}: ficha`).toContain(
          `data-ficha-tecnica="${app}"`,
        );
      }
    });
  }
});

test.describe("lo que llevaba al brochure llega a la entrada en un salto", () => {
  const casos: [string, string][] = [
    [
      "/es/portafolio/apps/inmobiliaria/brochure",
      "/es/portafolio/apps/inmobiliaria",
    ],
    [
      "/en/portafolio/apps/inmobiliaria/brochure?utm=x",
      "/en/portafolio/apps/inmobiliaria?utm=x",
    ],
    [
      "/es/portafolio/apps/hoja-de-vida/brochure",
      "/es/portafolio/apps/hoja-de-vida",
    ],
    [
      "/en/portafolio/apps/chat-hoja-de-vida/brochure",
      "/en/portafolio/apps/chat-hoja-de-vida",
    ],
    [
      "/es/portafolio/apps/inmobiliaria/detalle",
      "/es/portafolio/apps/inmobiliaria",
    ],
    ["/en/apps/hoja-de-vida", "/en/portafolio/apps/hoja-de-vida"],
  ];
  for (const [vieja, nueva] of casos) {
    test(`${vieja} → ${nueva}`, async ({ request }) => {
      const res = await request.get(vieja, { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      const destino = new URL(
        res.headers()["location"],
        "http://localhost:3000",
      );
      expect(destino.pathname + destino.search).toBe(nueva);
      const final = await request.get(nueva, { maxRedirects: 0 });
      expect(final.status(), `${nueva} responde`).toBe(200);
    });
  }

  test("el brochure de una app que sigue con su ficha no se mueve", async ({
    request,
  }) => {
    for (const app of CON_FICHA) {
      const res = await request.get(`/es/portafolio/apps/${app}/brochure`, {
        maxRedirects: 0,
      });
      expect(res.status(), app).toBe(200);
    }
  });
});

test.describe("nadie lleva a una redirección", () => {
  test("cada URL de app del sitemap responde sin redirigir, una por app", async ({
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const rutas = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname)
      .filter((r) => r.includes("/portafolio/apps/"));
    // Una por app y por idioma (más la simulación): ningún `/brochure`.
    expect(rutas.filter((r) => r.endsWith("/brochure"))).toEqual([]);
    for (const app of [...APPS, ...ENTRADAS.filter((e) => !APPS.includes(e))])
      expect(rutas, app).toContain(`/es/portafolio/apps/${app}`);
    for (const ruta of rutas) {
      const res = await request.get(ruta, { maxRedirects: 0 });
      expect(res.status(), ruta).toBe(200);
    }
  });

  test("los enlaces internos de las páginas del Portafolio van a donde está la página", async ({
    request,
  }) => {
    const paginas = [
      "/es/portafolio/apps",
      ...ENTRADAS.map((a) => `/es/portafolio/apps/${a}`),
      ...CON_FICHA.map((a) => `/es/portafolio/apps/${a}`),
    ];
    const vistos = new Set<string>();
    for (const p of paginas) {
      const html = await (await request.get(p)).text();
      // TODO enlace interno (`/es…`, `/en…`), con o sin ancla: «Escríbeme» de la casa salía `/es/#contacto`, que
      // redirige con un 308, y esta prueba solo miraba `/portafolio/apps/…`.
      for (const m of html.matchAll(
        /href="(\/(?:es|en)(?:\/[^"#?]*)?)(?:[#?][^"]*)?"/g,
      ))
        vistos.add(m[1]!);
    }
    expect(vistos.size).toBeGreaterThan(10);
    // Y el botón de la casa no lleva la barra que redirige.
    expect([...vistos].filter((h) => h.endsWith("/"))).toEqual([]);
    for (const href of vistos) {
      const res = await request.get(href, { maxRedirects: 0 });
      expect(res.status(), href).toBe(200);
    }
  });
});
