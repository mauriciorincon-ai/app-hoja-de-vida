import { expect, test } from "@playwright/test";

/**
 * «PORTAFOLIO» (S23) — la ruta vieja y la palabra vieja, contra el sitio real.
 *
 *  1. Las rutas `/vitrina…` llegan por un 301 —permanente— a `/portafolio…`, en
 *     los dos idiomas, sin idioma y con la consulta intacta. Las pide la CI con
 *     `maxRedirects: 0`: lo que se prueba es la respuesta, no a dónde acaba el
 *     navegador.
 *  2. Ninguna página del sitemap dice «vitrina» ni «showcase» en el texto que el
 *     visitante lee (ni en un `alt`, `aria-label` o `title`). Los exports de
 *     otras casas la traen: se leen ya con la palabra nueva.
 *
 * El motor del 301 se prueba con cadenas en `tests/unit/redireccion.test.ts`.
 */

test.describe("las rutas viejas redirigen con 301", () => {
  for (const [vieja, nueva] of [
    ["/vitrina", "/es/portafolio"],
    ["/es/vitrina", "/es/portafolio"],
    ["/en/vitrina", "/en/portafolio"],
    ["/es/vitrina/apps?utm=x", "/es/portafolio/apps?utm=x"],
    [
      "/en/vitrina/apps/planlang/simulacion",
      "/en/portafolio/apps/planlang/simulacion",
    ],
    ["/es/vitrina/agentes", "/es/portafolio/agentes"],
  ]) {
    test(`${vieja} → ${nueva}`, async ({ request }) => {
      const res = await request.get(vieja, { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      const destino = new URL(
        res.headers()["location"],
        "http://localhost:3000",
      );
      expect(destino.pathname + destino.search).toBe(nueva);
    });
  }

  test("la ruta nueva responde 200 y trae el título del portafolio", async ({
    page,
  }) => {
    for (const [ruta, titulo] of [
      ["/es/portafolio", /portafolio/i],
      ["/en/portafolio", /portfolio/i],
    ] as const) {
      const r = await page.goto(ruta);
      expect(r?.status(), ruta).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.title(), ruta).toMatch(/Henry Rincón/);
      await expect(page.locator("main")).toContainText(titulo);
    }
  });
});

/** Texto que ve el visitante, más los atributos que un lector de pantalla dice. */
function textoVisible(html: string): string {
  const atributos = [
    ...html.matchAll(/\b(?:alt|aria-label|title)="([^"]*)"/g),
  ].map((m) => m[1]);
  const cuerpo = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return `${cuerpo} ${atributos.join(" ")}`;
}

test.describe("ninguna página del sitio dice la palabra vieja", () => {
  test("todas las URL del sitemap, en texto visible", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const rutas = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname,
    );
    expect(rutas.length, "el sitemap lista páginas").toBeGreaterThan(50);
    // Ninguna URL del sitemap es la ruta vieja.
    expect(rutas.filter((r) => /\/vitrina(\/|$)/.test(r))).toEqual([]);

    const conPalabra: string[] = [];
    for (const ruta of rutas) {
      const res = await request.get(ruta);
      expect(res.status(), ruta).toBe(200);
      const visible = textoVisible(await res.text());
      const m = visible.match(/.{0,30}\b(?:vitrinas?|showcases?)\b.{0,30}/i);
      if (m) conPalabra.push(`${ruta}: «${m[0].replace(/\s+/g, " ").trim()}»`);
    }
    expect(conPalabra).toEqual([]);
  });
});
