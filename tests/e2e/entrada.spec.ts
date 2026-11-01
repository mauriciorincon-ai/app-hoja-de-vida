import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

/**
 * EL BROCHURE, LA ENTRADA DE TODAS LAS APPS (S31; S30 lo hizo app por app), contra el sitio real.
 *
 *  1. Las diez apps del Portafolio y la casa abren `/portafolio/apps/<app>` en su brochure, en `/es` y `/en`,
 *     tengan o no su contenido v2: ninguna lleva `data-ficha-tecnica=`. La ficha técnica sigue solo en los
 *     agentes, las investigaciones y los tableros.
 *  2. Su `/brochure` y su `/detalle` (y la página vieja de la casa) llegan a la entrada en UN 301, que el
 *     proxy responde sin leer el disco; la entrada responde 200.
 *  3. Ningún enlace interno ni ninguna URL del sitemap lleva a una redirección, y el sitemap lista una URL
 *     por app: su entrada.
 */

// Las diez del Portafolio, en el orden del escaparate (profesionales, personales), y las dos de la casa.
const APPS: string[] = Object.values(
  parse(readFileSync("data/categorias-apps.yaml", "utf8")) as Record<
    string,
    { slug: string }[]
  >,
).flatMap((grupo) => grupo.map((a) => a.slug));
const CASA = ["hoja-de-vida", "chat-hoja-de-vida"];
const TODAS = [...APPS, ...CASA];

test.describe("la entrada de cada app es su brochure", () => {
  test("hay diez apps, con y sin contenido v2, y las dos de la casa (si no, esta prueba no mide nada)", () => {
    expect(APPS).toHaveLength(10);
    expect(APPS).toEqual(
      expect.arrayContaining(["inmobiliaria", "habla", "ds"]),
    );
  });

  for (const l of ["es", "en"] as const) {
    test(`/${l}: las doce pintan su brochure, ninguna su ficha, y su hreflang es la entrada`, async ({
      request,
    }) => {
      for (const app of TODAS) {
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
    });
  }

  test("la ficha técnica sigue en los otros frentes", async ({ request }) => {
    const res = await request.get("/es/portafolio/agentes/hr-develop-ai-apps");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("data-ficha-tecnica=");
  });
});

test.describe("lo que llevaba al brochure llega a la entrada en un salto", () => {
  for (const l of ["es", "en"] as const)
    for (const app of TODAS) {
      test(`/${l}: el \`/brochure\` y el \`/detalle\` de ${app} → su entrada`, async ({
        request,
      }) => {
        const entrada = `/${l}/portafolio/apps/${app}`;
        for (const vieja of [`${entrada}/brochure`, `${entrada}/detalle`]) {
          // Con la consulta intacta, como todo 301 del sitio.
          const res = await request.get(`${vieja}?utm=x`, {
            maxRedirects: 0,
          });
          expect(res.status(), vieja).toBe(301);
          const destino = new URL(
            res.headers()["location"],
            "http://localhost:3000",
          );
          expect(destino.pathname + destino.search, vieja).toBe(
            `${entrada}?utm=x`,
          );
        }
        // Un solo salto: la entrada responde, no vuelve a redirigir.
        const final = await request.get(entrada, { maxRedirects: 0 });
        expect(final.status(), `${entrada} responde`).toBe(200);
      });
    }

  test("la página vieja de la casa también, en un salto (la de antes de «Portafolio» se prueba en `portafolio.spec.ts`)", async ({
    request,
  }) => {
    for (const [vieja, nueva] of [
      ["/en/apps/hoja-de-vida", "/en/portafolio/apps/hoja-de-vida"],
      ["/apps/chat-hoja-de-vida", "/es/portafolio/apps/chat-hoja-de-vida"],
    ]) {
      const res = await request.get(vieja, { maxRedirects: 0 });
      expect(res.status(), vieja).toBe(301);
      const destino = new URL(
        res.headers()["location"],
        "http://localhost:3000",
      );
      expect(destino.pathname, vieja).toBe(nueva);
      expect((await request.get(nueva, { maxRedirects: 0 })).status()).toBe(
        200,
      );
    }
  });
});

test.describe("nadie lleva a una redirección", () => {
  test("cada URL de app del sitemap responde sin redirigir, una por app", async ({
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const rutas = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]!).pathname)
      .filter((r) => r.includes("/portafolio/apps/"));
    // Una por app y por idioma (más la simulación): ningún `/brochure` (B4 deja de existir).
    expect(rutas.filter((r) => r.endsWith("/brochure"))).toEqual([]);
    for (const l of ["es", "en"])
      for (const app of TODAS)
        expect(rutas, `${l}/${app}`).toContain(`/${l}/portafolio/apps/${app}`);
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
      ...TODAS.map((a) => `/es/portafolio/apps/${a}`),
    ];
    const vistos = new Set<string>();
    for (const p of paginas) {
      const html = await (await request.get(p)).text();
      // TODO enlace interno (`/es…`, `/en…`), con o sin ancla: «Escríbeme» de la casa salía `/es/#contacto`, que
      // redirige con un 308, y una prueba que solo mirara `/portafolio/apps/…` no lo veía (S30).
      for (const m of html.matchAll(
        /href="(\/(?:es|en)(?:\/[^"#?]*)?)(?:[#?][^"]*)?"/g,
      ))
        vistos.add(m[1]!);
    }
    expect(vistos.size).toBeGreaterThan(10);
    // Y el botón de la casa no lleva la barra que redirige.
    expect([...vistos].filter((h) => h.endsWith("/"))).toEqual([]);
    // Ninguna entrada de una app nombra el `/brochure` ni el `/detalle` de otra: son 301.
    expect(
      [...vistos].filter((h) =>
        /\/portafolio\/apps\/[^/]+\/(?:brochure|detalle)$/.test(h),
      ),
    ).toEqual([]);
    for (const href of vistos) {
      const res = await request.get(href, { maxRedirects: 0 });
      expect(res.status(), href).toBe(200);
    }
  });
});
