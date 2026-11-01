import { readdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { parse } from "yaml";
import { entradasBrochure } from "../../scripts/entradas-brochure.mjs";

/**
 * EL BROCHURE (S28, ADR-030) — e2e.
 *
 * Una sola plantilla para las doce: las diez apps del Portafolio y las dos de la casa (CV Viva y su
 * chat). Cuatro capas, de la más barata a la más cara:
 *
 *  1. **El HTML** de las 24 URLs (12 × es/en) por `request.get`, sin navegador: 200, cada grupo, cada
 *     funcionalidad y cada cifra presentes, ninguna descartada (OM-24) y ningún `undefined`. Es el gate
 *     ATS/SEO: lo que el visitante lee sin JavaScript.
 *  2. **Sin JavaScript** (un navegador de verdad con el JS apagado): el texto se ve y nada nace oculto.
 *  3. **Las interacciones**, en tres brochures que cubren las tres formas del dato: Innmobiliaria (con
 *     su contenido v2), Habla San (solo el export v1) y CV Viva (de la casa). La isla solo cambia
 *     atributos, y estas pruebas los miran: capítulos, buscador `/` con su «↩ Volver», Recorrido con
 *     teclado, fichas, pausa del movimiento.
 *  4. **Movimiento reducido e impresión**: con la preferencia puesta nada se mueve, y al imprimir se
 *     abre todo, los flujos se trazan a 700 px y el PDF carta se lee como texto.
 *
 * El axe de los doce (con todo abierto) y el barrido de acentos viven en `axe.spec.ts`.
 *
 * Data-driven: los slugs y el contenido salen de `content/vitrina/` y `content/vitrina/casa/`, la misma
 * fuente que renderiza la página. Una app nueva entra al e2e sola.
 */

type Export = {
  app: { slug: string; nombre: string };
  promesa: { tagline: string };
  metricas: { clave: string }[];
  funcionalidades: {
    grupos: { orden: number; features: { id: string }[] }[];
    descartadas: { id: string }[];
  };
};

const leer = (ruta: string) => JSON.parse(readFileSync(ruta, "utf8")) as Export;
const delDirectorio = (dir: string) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".brochure-export.json"))
    .map((f) => leer(`${dir}/${f}`));

const APPS = delDirectorio("content/vitrina");
const CASA = delDirectorio("content/vitrina/casa");
const EXPORTS = [...APPS, ...CASA];
if (CASA.length !== 2) throw new Error("content/vitrina/casa: faltan las dos");

const IDIOMAS = ["es", "en"] as const;
// Desde el S30 la casa y las apps con su contenido v2 abren `/portafolio/apps/<app>` en su brochure.
const ENTRADAS = entradasBrochure();
const ruta = (l: string, slug: string) =>
  ENTRADAS.includes(slug)
    ? `/${l}/portafolio/apps/${slug}`
    : `/${l}/portafolio/apps/${slug}/brochure`;

/** Las cifras que el contenido v2 de una app oculta a propósito de «04 · Método»; sin v2, ninguna. */
const ocultasDe = (slug: string): string[] => {
  const dir = CASA.some((c) => c.app.slug === slug)
    ? "content/vitrina/casa"
    : "content/vitrina";
  try {
    const v2 = JSON.parse(
      readFileSync(`${dir}/${slug}.contenido.json`, "utf8"),
    ) as { metodo?: { ocultar?: string[] } };
    return v2.metodo?.ocultar ?? [];
  } catch {
    return [];
  }
};

/** El texto de un HTML: sin los `<script>` (la carga de Next lleva `$undefined` legítimo), sin etiquetas y sin entidades. */
const textoDe = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

test.describe("Brochure — el HTML de las doce, en los dos idiomas", () => {
  for (const l of IDIOMAS) {
    for (const exp of EXPORTS) {
      const slug = exp.app.slug;
      test(`${l}/${slug}: entrega todo su contenido en el HTML estático`, async ({
        request,
      }) => {
        const res = await request.get(ruta(l, slug));
        expect(res.status()).toBe(200);
        const html = await res.text();
        const texto = textoDe(html);

        // Un capítulo por grupo, y en cada uno todas sus funcionalidades (cada pieza lleva `p-<id>`).
        const grupos = exp.funcionalidades.grupos;
        expect(
          html.match(/<details class="capitulo"/g)?.length,
          "capítulos",
        ).toBe(grupos.length);
        for (const g of grupos) {
          expect(html, `capítulo g${g.orden}`).toContain(`id="s-g${g.orden}"`);
          for (const f of g.features)
            expect(html, `funcionalidad ${f.id}`).toContain(`id="p-${f.id}"`);
        }
        // Las cifras que el export declara, cada una con su id en «04 · Método».
        // (menos las que el contenido v2 oculta a propósito: `metodo.ocultar`).
        const ocultas = ocultasDe(slug);
        for (const m of exp.metricas.filter((m) => !ocultas.includes(m.clave)))
          expect(html, `cifra ${m.clave}`).toContain(`id="mt-${m.clave}"`);
        // OM-24: las descartadas no se pintan, traiga lo que traiga el export.
        for (const d of exp.funcionalidades.descartadas)
          expect(html, `descartada ${d.id}`).not.toContain(`id="p-${d.id}"`);

        // Las secciones fijas: la portada y el cierre existen siempre.
        for (const sec of ["top", "metodo", "cierre"])
          expect(html, `sección ${sec}`).toContain(`data-sec="${sec}"`);

        // Ni un hueco: lo que el modelo no tiene no se pinta, pero nunca se pinta roto.
        expect(texto).not.toMatch(/\bundefined\b|\bNaN\b|\[object Object\]/);
        const h1 = /<h1[\s\S]*?<\/h1>/.exec(html);
        expect(h1, "h1").not.toBeNull();
        expect(textoDe(h1![0]).trim(), "h1 con texto").not.toBe("");
        for (const otro of IDIOMAS)
          expect(html, `hreflang ${otro}`).toContain(`hrefLang="${otro}"`);
        expect(html).toContain(`hrefLang="${l === "es" ? "en" : "es"}"`);
        // Cero enlaces (regla 17): ni la app ni su repositorio.
        const dentro = html.slice(
          html.indexOf("<main"),
          html.indexOf("</main>"),
        );
        expect(dentro).not.toMatch(/href="https?:/);
        expect(html).not.toMatch(/vercel[.]app|workers[.]dev|pages[.]dev/);
      });
    }
  }

  test("las apps sin export de la casa no tienen brochure: es 404 (dynamicParams=false)", async ({
    request,
  }) => {
    const res = await request.get(ruta("es", "una-app-que-no-existe"));
    expect(res.status()).toBe(404);
  });

  test("Innmobiliaria trae todos los bloques de su contenido v2; una app con solo el v1, los que su export da", async ({
    request,
  }) => {
    const v2 = JSON.parse(
      readFileSync("content/vitrina/inmobiliaria.contenido.json", "utf8"),
    ) as {
      antes_despues: unknown;
      mapa: unknown;
      proceso_pantallas: unknown;
      en: { promesa: { intro: string } };
    };
    expect(v2.antes_despues && v2.mapa && v2.proceso_pantallas).toBeTruthy();
    const html = await (await request.get(ruta("es", "inmobiliaria"))).text();
    for (const sec of ["antes", "mapa", "proceso", "metodo"])
      expect(html, `v2 · ${sec}`).toContain(`data-sec="${sec}"`);
    // El inglés del v2 reemplaza el texto del export: la portada en inglés dice lo que su bloque `en` dice.
    const en = await (await request.get(ruta("en", "inmobiliaria"))).text();
    expect(textoDe(en)).toContain(v2.en.promesa.intro.slice(0, 40));
  });

  test("en inglés, donde el texto es español, la portada lo dice; en español y con el bloque en, no", async ({
    request,
  }) => {
    // El bloque `en` lo trae el v2 de quien ya lo recibió: el de una app vive en `content/vitrina/` y el de la
    // casa, en `content/vitrina/casa/` (S30: CV Viva y su chat ya lo tienen).
    const conBloqueEn = (slug: string) => {
      for (const dir of ["content/vitrina", "content/vitrina/casa"])
        try {
          return Boolean(
            JSON.parse(readFileSync(`${dir}/${slug}.contenido.json`, "utf8"))
              .en,
          );
        } catch {
          // sin v2 en esta carpeta: se mira la otra
        }
      return false;
    };
    expect(conBloqueEn("inmobiliaria"), "la piloto trae su inglés").toBe(true);
    for (const exp of EXPORTS) {
      const slug = exp.app.slug;
      const es = await (await request.get(ruta("es", slug))).text();
      expect(es, `${slug} · es`).not.toContain("aviso-idioma");
      const en = await (await request.get(ruta("en", slug))).text();
      if (conBloqueEn(slug))
        expect(en, `${slug} · en`).not.toContain("aviso-idioma");
      else {
        expect(textoDe(en), `${slug} · en`).toContain(
          "The text of this brochure is in Spanish.",
        );
        // Y la descripción de la página no es el tagline español del export.
        const descripcion = /<meta name="description" content="([^"]*)"/.exec(
          en,
        )![1]!;
        expect(descripcion, `${slug} · description`).not.toContain(
          exp.promesa.tagline.slice(0, 30),
        );
      }
    }
  });

  test("«De esta casa» en inglés dice la línea inglesa de la casa, no el tagline español de su export", async ({
    request,
  }) => {
    const apps = (
      parse(readFileSync("data/apps.yaml", "utf8")) as {
        apps: { id: string; descripcion: { es: string; en: string } }[];
      }
    ).apps;
    const en = textoDe(await (await request.get("/en/portafolio/apps")).text());
    const es = textoDe(await (await request.get("/es/portafolio/apps")).text());
    for (const exp of CASA) {
      const desc = apps.find((a) => a.id === exp.app.slug)!.descripcion.en;
      expect(en, exp.app.slug).toContain(desc.slice(0, 40));
      expect(en, exp.app.slug).not.toContain(exp.promesa.tagline);
      expect(es, exp.app.slug).toContain(exp.promesa.tagline);
    }
  });

  test("el cierre «Úsala» trae la lista de espera de la app elegida (las diez) o «Escríbeme» al contacto (la casa)", async ({
    request,
  }) => {
    for (const exp of EXPORTS) {
      const html = await (await request.get(ruta("es", exp.app.slug))).text();
      const esCasa = CASA.some((c) => c.app.slug === exp.app.slug);
      const cierre = html.slice(html.indexOf('id="s-cierre"'));
      if (esCasa) {
        // Sin formularios, y «Escríbeme» al contacto de CV Viva.
        expect(cierre, exp.app.slug).toContain(
          'href="/es/#contacto" data-cta=""',
        );
        expect(cierre, exp.app.slug).not.toContain("<form");
      } else {
        expect(cierre, exp.app.slug).toContain('id="lista-de-espera"');
        expect(cierre, exp.app.slug).toMatch(
          new RegExp(
            `<option value="${exp.app.slug}" selected=""|<option selected="" value="${exp.app.slug}"`,
          ),
        );
        expect(html, exp.app.slug).not.toContain("contacto-portafolio");
      }
    }
  });
});

test.describe("Brochure — sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("el texto se ve y nada nace oculto", async ({ page }) => {
    await page.goto(ruta("es", "inmobiliaria"));
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCSS("opacity", "1");
    // Una cabeza de sección (de las que entran al hacer scroll) también nace visible.
    const cabeza = page.locator(".sec-cabeza").first();
    await expect(cabeza).toHaveCSS("opacity", "1");
    // Los capítulos son <details>: se abren sin JS.
    const cap = page.locator("details.capitulo").first();
    await cap.locator("summary").click();
    await expect(cap).toHaveAttribute("open", "");
    await expect(cap.locator(".ficha").first()).toBeVisible();
  });
});

test.describe("Brochure — a 390 px nada se sale de la pantalla", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("la rejilla de «te sirve si» cabe con sus citas largas, en las doce y en los dos idiomas", async ({
    page,
  }) => {
    for (const l of IDIOMAS)
      for (const exp of EXPORTS) {
        await page.goto(ruta(l, exp.app.slug));
        await page.evaluate(() => {
          for (const d of document.querySelectorAll("details")) d.open = true;
          document
            .querySelector("[data-brochure]")
            ?.setAttribute("data-b-entero", "");
        });
        const fuera = await page.evaluate(() =>
          [...document.querySelectorAll(".cuando li")]
            .filter((li) => li.getBoundingClientRect().right > innerWidth + 1)
            .map((li) => (li.textContent ?? "").slice(0, 40)),
        );
        expect(fuera, `${l}/${exp.app.slug}`).toEqual([]);
      }
  });
});

/** Lo que una persona haría con el brochure, en tres formas del dato. */
const FORMAS = [
  {
    slug: "inmobiliaria",
    forma: "con su contenido v2",
    busca: "sello",
    fichas: true,
  },
  {
    slug: "habla",
    forma: "solo con el export v1",
    busca: "pronun",
    fichas: false,
  },
  // La casa trae su v2 desde el S30 (por copia): sus preguntas y respuestas son fichas, como las de la piloto.
  {
    slug: "hoja-de-vida",
    forma: "de la casa, con su v2",
    busca: "chat",
    fichas: true,
  },
];

/** Una página lista: la isla ya puso `data-b-listo`, y los errores de consola se recogen. */
async function abrir(page: Page, slug: string, l = "es") {
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(String(e)));
  // El script de Vercel Analytics solo existe en Vercel: en local y en CI responde 404 en todo el sitio.
  page.on("console", (m) => {
    if (m.type() === "error" && !/status of 404/.test(m.text()))
      errores.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.url().includes("/_vercel/"))
      errores.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(ruta(l, slug));
  await expect(page.locator("[data-brochure][data-b-listo]")).toHaveCount(1);
  return errores;
}

for (const { slug, forma, busca, fichas: conFichas } of FORMAS) {
  test.describe(`Brochure — interacciones · ${slug} (${forma})`, () => {
    test.beforeEach(({}, testInfo) => {
      test.skip(
        testInfo.project.name === "mobile",
        "las interacciones de escritorio; el móvil tiene su prueba de desborde",
      );
    });

    test("los capítulos se abren y se cierran, y las fichas se voltean y se filtran", async ({
      page,
    }) => {
      const errores = await abrir(page, slug);
      await page.evaluate(() =>
        document
          .querySelectorAll<HTMLDetailsElement>("details.capitulo")
          .forEach((d) => (d.open = false)),
      );
      const cap = page.locator("details.capitulo").first();
      await cap.locator("summary").click();
      await expect(cap).toHaveAttribute("open", "");
      // Todo capítulo lista sus funcionalidades (las piezas), con o sin contenido v2.
      expect(await cap.locator(".pieza").count()).toBeGreaterThan(0);
      // Las fichas de preguntas y respuestas solo las trae el contenido v2.
      const fichas = cap.locator(".ficha");
      if (!conFichas) await expect(fichas).toHaveCount(0);
      else {
        expect(await fichas.count()).toBeGreaterThan(0);
        // Miden lo mismo (la isla las iguala al abrir el capítulo).
        await expect
          .poll(
            async () =>
              (
                await fichas.evaluateAll((fs) => [
                  ...new Set(
                    fs.map((f) => Math.round(f.getBoundingClientRect().height)),
                  ),
                ])
              ).length,
            { message: "alto de las fichas" },
          )
          .toBe(1);
        // Una ficha se voltea.
        const primera = fichas.first();
        await primera.locator(".ficha-voltea").click();
        await expect(primera).toHaveAttribute("data-b-volteada", "");
        // El filtro por tipo oculta fichas; «todas» las devuelve.
        const filtros = cap.locator(".filtro");
        if ((await filtros.count()) > 2) {
          await filtros.nth(1).click();
          await expect(filtros.nth(1)).toHaveAttribute("aria-pressed", "true");
          await filtros.first().click();
          await expect(filtros.first()).toHaveAttribute("aria-pressed", "true");
        }
      }
      // Y se cierra.
      await cap.locator("summary").click();
      await expect(cap).not.toHaveAttribute("open", "");
      expect(errores, "consola").toEqual([]);
    });

    test("«/» abre el buscador, Enter salta al resultado y «↩ Volver» regresa", async ({
      page,
    }) => {
      const errores = await abrir(page, slug);
      await page.locator("body").click({ position: { x: 5, y: 300 } });
      await page.keyboard.press("/");
      await expect(page.locator("#buscar")).toBeFocused();
      await page.keyboard.type(busca);
      const resultados = page.locator("#resultados button");
      await expect.poll(() => resultados.count()).toBeGreaterThan(0);
      const antes = await page.evaluate(() => scrollY);
      await page.keyboard.press("Enter");
      // El destino queda a la vista y se destella; aparece el regreso.
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const d =
                document.querySelector("[data-b-destello]") ??
                document.querySelector("details[open]");
              if (!d) return false;
              const r = d.getBoundingClientRect();
              return r.top > 0 && r.top < innerHeight;
            }),
          { message: "el resultado queda a la vista", timeout: 8_000 },
        )
        .toBe(true);
      const volver = page.locator("#regreso:not([hidden])");
      await expect(volver).toBeVisible();
      await volver.click();
      await expect
        .poll(() => page.evaluate(() => scrollY), { timeout: 8_000 })
        .toBeLessThan(antes + 400);
      expect(errores, "consola").toEqual([]);
    });

    test("el Recorrido se maneja con el teclado: ← → Espacio Esc, sin duplicar diapositivas", async ({
      page,
    }) => {
      const errores = await abrir(page, slug);
      const dlg = page.locator("dialog.recorrido");
      // Las diapositivas se pintan al primer uso, no antes.
      await expect(dlg.locator(".r-marco img")).toHaveCount(0);
      await page.locator(".barra [data-recorrido]").first().click();
      await expect
        .poll(() => dlg.evaluate((d: HTMLDialogElement) => d.open))
        .toBe(true);
      const imgs = dlg.locator(".r-marco img");
      const total = await imgs.count();
      expect(total).toBeGreaterThan(1);
      const activa = () =>
        page.$eval("dialog.recorrido .r-marco img[data-b-activa]", (i) =>
          Number((i as HTMLElement).dataset.bR),
        );
      const a0 = await activa();
      await page.keyboard.press("ArrowRight");
      expect(await activa()).toBe((a0 + 1) % total);
      await page.keyboard.press("ArrowLeft");
      expect(await activa()).toBe(a0);
      await expect(dlg.locator(".r-diapo:not([hidden]) b")).not.toHaveText("");
      await page.keyboard.press(" ");
      await expect(page.locator("#r-auto")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await page.keyboard.press(" ");
      await expect(page.locator("#r-auto")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
      await page.keyboard.press("Escape");
      expect(await dlg.evaluate((d: HTMLDialogElement) => d.open)).toBe(false);
      expect(await imgs.count(), "no se duplican").toBe(total);
      expect(errores, "consola").toEqual([]);
    });

    test("la pausa detiene todo el movimiento ambiental y lo devuelve", async ({
      page,
    }) => {
      await abrir(page, slug);
      const raiz = page.locator("[data-brochure]");
      const pausa = page.locator("[data-b-pausa]").first();
      await expect(pausa).toBeVisible();
      await expect(pausa).toHaveAttribute("aria-pressed", "false");
      await pausa.click();
      await expect(raiz).toHaveAttribute("data-b-quieto", "");
      await expect(pausa).toHaveAttribute("aria-pressed", "true");
      // Detenido de verdad: la cinta ya no corre.
      await expect(page.locator(".cinta-pista").first()).toHaveCSS(
        "animation-play-state",
        "paused",
      );
      await pausa.click();
      await expect(raiz).not.toHaveAttribute("data-b-quieto", "");
    });

    test("un salto a la sección 04 cae en su sitio aunque las secciones lejanas aún no se hayan pintado", async ({
      page,
    }) => {
      await abrir(page, slug);
      await page.evaluate(() =>
        document.querySelector<HTMLElement>('[data-ir-sec="metodo"]')?.click(),
      );
      await expect
        .poll(
          () =>
            page.$eval("#s-metodo", (s) =>
              Math.round(s.getBoundingClientRect().top),
            ),
          { timeout: 8_000 },
        )
        .toBeLessThan(260);
      const top = await page.$eval(
        "#s-metodo",
        (s) => s.getBoundingClientRect().top,
      );
      expect(top).toBeGreaterThan(-40);
    });
  });
}

test.describe("Brochure — peso", () => {
  test("al cargar no se piden las capturas de los capítulos cerrados: el brochure pesa su texto, no sus pantallas", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "la red se mide una vez");
    // ds es la que más pantallas trae. Las capturas viven en la carpeta pública `vitrina/ds`, sin optimizar.
    const total = readdirSync("public/vitrina/ds").filter((f) =>
      f.endsWith(".webp"),
    ).length;
    expect(total).toBeGreaterThan(20);
    const pedidas = new Set<string>();
    page.on("request", (r) => {
      const partes = new URL(r.url()).pathname.split("/");
      if (partes[1] === "vitrina" && partes[2] === "ds") pedidas.add(partes[3]);
    });
    await abrir(page, "ds");
    await page.waitForLoadState("networkidle");
    // Solo lo que se ve al cargar: la portada y su primera pantalla, nunca las N de golpe.
    expect(
      pedidas.size,
      `capturas pedidas al cargar (de ${total})`,
    ).toBeLessThanOrEqual(8);
    // Y el Recorrido pinta sus diapositivas al abrirlo, no antes: no hay imágenes de más.
    await expect(page.locator("dialog.recorrido .r-marco img")).toHaveCount(0);
  });
});

test.describe("Brochure — móvil", () => {
  test("a 390 px no hay desborde horizontal ni con todo abierto, y la consola sigue limpia", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const slug of ["inmobiliaria", "hoja-de-vida"]) {
      const errores = await abrir(page, slug);
      await page.evaluate(() =>
        document
          .querySelectorAll<HTMLDetailsElement>("details.capitulo")
          .forEach((d) => (d.open = true)),
      );
      // Un respiro para que la isla iguale fichas y el flujo se redibuje al ancho de su marco.
      await page.waitForTimeout(600);
      const desborde = await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      );
      expect(desborde, `${slug}: desborde`).toBeLessThanOrEqual(0);
      expect(errores, `${slug}: consola`).toEqual([]);
    }
  });
});

test.describe("Brochure — movimiento reducido", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("con la preferencia puesta nada se mueve y todo está a la vista", async ({
    page,
  }) => {
    const errores = await abrir(page, "inmobiliaria");
    // Sin bucles: la cinta no corre y las entradas no esperan al scroll.
    await expect(page.locator(".cinta-pista").first()).toHaveCSS(
      "animation-name",
      "none",
    );
    const ocultos = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".entra, .aparece")]
        .filter((e) => getComputedStyle(e).opacity !== "1")
        .map((e) => e.className),
    );
    expect(ocultos, "elementos que nacen sin verse").toEqual([]);
    // Y la hidratación no se desajusta bajo esta preferencia (regla 7: la forma del árbol no cambia).
    expect(errores, "consola e hidratación").toEqual([]);
  });
});

test.describe("Brochure — impresión", () => {
  test("al imprimir se abre todo, los flujos se trazan a 700 px y el PDF carta se lee como texto", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "page.pdf() es de Chromium de escritorio",
    );
    await abrir(page, "inmobiliaria");
    await page.evaluate(() =>
      document
        .querySelectorAll<HTMLDetailsElement>("details.capitulo")
        .forEach((d) => (d.open = false)),
    );
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
    const imp = await page.evaluate(() => ({
      cerrados: document.querySelectorAll("details.capitulo:not([open])")
        .length,
      anchos: [...document.querySelectorAll<HTMLElement>(".flujo-lienzo")].map(
        (l) => Math.round(parseFloat(l.style.width)),
      ),
      pintado: getComputedStyle(document.querySelector(".sec")!)
        .contentVisibility,
    }));
    expect(imp.cerrados, "capítulos cerrados al imprimir").toBe(0);
    expect(imp.anchos.length, "flujos dibujados").toBeGreaterThan(0);
    expect(Math.max(...imp.anchos), "ancho de los flujos").toBeLessThanOrEqual(
      700,
    );
    expect(imp.pintado, "las secciones lejanas se pintan enteras").toBe(
      "visible",
    );

    // El PDF: carta, vertical, y el texto de la página se lee (no es una imagen).
    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
    });
    const g = globalThis as Record<string, unknown>;
    g.DOMMatrix ??= class DOMMatrix {};
    g.ImageData ??= class ImageData {};
    g.Path2D ??= class Path2D {};
    const { PDFParse } = (await import("pdf-parse")) as unknown as {
      PDFParse: new (o: { data: Uint8Array }) => {
        getText(): Promise<{ text: string; pages: unknown[] }>;
      };
    };
    const { text, pages } = await new PDFParse({
      data: new Uint8Array(pdf),
    }).getText();
    expect(pages.length, "páginas del PDF").toBeGreaterThan(2);
    // Lo que la portada dice en pantalla, el PDF lo trae como texto (no es una imagen).
    const lead = (await page.locator(".portada .lead").innerText())
      .replace(/\s+/g, " ")
      .slice(0, 40);
    expect(text.replace(/\s+/g, " ")).toContain(lead);
    await page.emulateMedia({ media: "screen" });
  });
});
