import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

// El orden de la HOME desde la revisión post-S7: la vitrina ocupa el sitio de
// «Proyectos», los estudios tienen sección propia, y el roadmap se fue con las
// apps a /vitrina/apps.
const SECTIONS = [
  "perfil",
  "trayectoria",
  "logros",
  "vitrina",
  "estudios",
  "certificaciones",
  "skills",
  "contacto",
];

// Los e2e leen el contenido real: editar data/*.yaml jamás rompe la suite
type RoadmapEntry = {
  id: string;
  titulo: { es: string; en: string };
};
const cvEs = parse(readFileSync("data/cv.es.yaml", "utf8")) as {
  identidad: { nombre: string };
  trayectoria: { organizacion: string; bullets?: string[] }[];
};
const hitoConBullets = cvEs.trayectoria.find((t) => t.bullets?.length);
if (!hitoConBullets?.bullets) {
  throw new Error("cv.es.yaml sin bullets en la trayectoria");
}
const primerBullet = hitoConBullets.bullets[0];
const nombre = cvEs.identidad.nombre;

// Roadmap votable (S4 · por app hermana desde 2026-09-13): las features viven
// en el complemento curado de cada app, `data/fichas/<slug>.yaml`, y se votan
// en la página de ESA app (`/vitrina/apps/<slug>`), no en el escaparate. Las
// de CV Viva se retiraron por decisión del dueño: ninguna se muestra.
const roadmaps = readdirSync("data/fichas")
  .filter((f) => f.endsWith(".yaml"))
  .map((f) => {
    const c = parse(readFileSync(`data/fichas/${f}`, "utf8")) as {
      app: string;
      roadmap?: RoadmapEntry[];
    };
    return { app: c.app, roadmap: c.roadmap ?? [] };
  })
  .filter((c) => c.roadmap.length > 0);
const primerRoadmap = roadmaps[0];
if (!primerRoadmap) throw new Error("data/fichas sin ningún roadmap");
const primeraFeature = primerRoadmap.roadmap[0];

test.describe("HOME — happy path del sprint", () => {
  test("carga, recorre secciones, cambia idioma y envía la solicitud", async ({
    page,
  }) => {
    await page.goto("/es");

    // Hero con identidad desde data/cv.es.yaml
    await expect(page.locator("h1")).toContainText(nombre);

    // La página está hidratada cuando el form montó su handler
    await page.locator("form[data-hydrated=true]").waitFor();

    // Scroll por todas las secciones — presentes y con heading
    for (const id of SECTIONS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(
        page.locator(`#${id} h2, #${id} [id$="-titulo"]`).first(),
      ).toBeAttached();
    }

    // La sección «Apps» se retiró: prometía lo mismo que la vitrina y no
    // enseñaba apps visitables. Su contenido no se perdió — las dos con
    // brochure se alcanzan desde «De esta casa» en /vitrina (brochure.spec).
    await expect(page.locator("#apps")).toHaveCount(0);

    // Ni «Proyectos» ni «Roadmap» viven ya en la HOME: la vitrina asoma sus
    // cuatro frentes y el roadmap está con las apps (vitrina.spec lo vigila).
    await expect(page.locator("#proyectos")).toHaveCount(0);
    await expect(page.locator("#roadmap")).toHaveCount(0);
    await expect(page.locator("#vitrina [data-frente]")).toHaveCount(4);

    // Toggle de idioma (conserva la página, cambia la ruta) — timeout amplio:
    // bajo carga paralela la navegación client-side puede exceder los 5s
    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(/\/en$/, { timeout: 15_000 });
    await expect(page.locator("#trayectoria h2")).toHaveText("Career", {
      timeout: 15_000,
    });

    // Enviar un mensaje end-to-end (sin API key → envío simulado). El motivo
    // es opcional (bloque E de la revisión post-S8); aquí se elige uno.
    await page.locator("#contacto").scrollIntoViewIfNeeded();
    await page.locator("form[data-hydrated=true]").waitFor();
    await page.getByLabel("Your name").fill("E2E Tester");
    await page.getByLabel("Your email").fill("e2e@example.com");
    await page.getByLabel("Reason (optional)").selectOption("proyecto");
    await page.getByRole("button", { name: "Send" }).click();

    // Confirmación humana
    await expect(page).toHaveURL(/\/en\/solicitud-enviada/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "I got your message",
    );
  });

  test("el contenido completo está en el HTML estático (gate ATS/SEO)", async ({
    request,
  }) => {
    for (const locale of ["es", "en"]) {
      const res = await request.get(`/${locale}`);
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toContain(nombre);
      expect(html).toContain("application/ld+json");
      expect(html).toContain('hrefLang="es"');
      expect(html).toContain('hrefLang="en"');
      // Contenido de secciones sin ejecutar JS, en el idioma de la ruta. El
      // roadmap se fue a /vitrina/apps (su gate ATS está allá): lo que la HOME
      // sigue exigiendo en el HTML estático es la vitrina asomada con sus
      // cuatro frentes y los estudios recién nacidos como sección.
      expect(html).toContain('id="vitrina"');
      expect(html).toContain('id="estudios"');
      expect(html).toContain("Pontificia Universidad Javeriana");
    }
    // El grueso (capa 2) también vive en el HTML aunque nazca colapsado
    const res = await request.get("/es");
    expect(await res.text()).toContain(primerBullet);
  });

  test("disclosure del timeline: expande y contrae accesible por teclado", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.locator("form[data-hydrated=true]").waitFor();
    await page.locator("#trayectoria").scrollIntoViewIfNeeded();

    // Selector estable: el accessible name cambia al expandir ("Ver menos")
    const boton = page
      .locator('button[aria-controls^="hito-bullets-"]')
      .first();
    await expect(boton).toHaveText(/Ver logros completos/);
    await expect(boton).toHaveAttribute("aria-expanded", "false");

    // Expandir con click: los bullets quedan visibles
    await boton.click();
    await expect(boton).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(primerBullet)).toBeVisible();

    // Contraer con teclado (Enter sobre el botón enfocado)
    await boton.focus();
    await page.keyboard.press("Enter");
    await expect(boton).toHaveAttribute("aria-expanded", "false");
  });

  test("404 localizado para rutas desconocidas", async ({ page }) => {
    const res = await page.goto("/es/no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Esta página no existe",
    );
    // Y es el localizado, no el bilingüe de la raíz (2026-09-26): ese no
    // conoce el idioma y habla los dos.
    await expect(page.getByRole("heading", { level: 1 })).not.toContainText(
      "This page doesn't exist",
    );
  });
});

test.describe("El roadmap vive en la página de cada app (2026-09-13)", () => {
  test("el escaparate /vitrina/apps ya NO monta el roadmap: cada app vota en su página", async ({
    page,
  }) => {
    await page.goto("/es/vitrina/apps");
    await expect(page.locator("#roadmap")).toHaveCount(0);
    // Y ninguna feature de CV Viva se muestra en ningún lado (dueño).
    const html = await page.content();
    for (const vieja of ["Mapa de arquitectura", "Retrieval con embeddings"]) {
      expect(html).not.toContain(vieja);
    }
  });

  test("/vitrina/apps/<slug> enseña una fila votable por feature de ESA app, y la HOME ninguna", async ({
    page,
    request,
  }) => {
    for (const { app, roadmap } of roadmaps) {
      await page.goto(`/es/vitrina/apps/${app}`);
      await page.locator("#roadmap").scrollIntoViewIfNeeded();
      await expect(page.locator("#roadmap [data-feature-id]")).toHaveCount(
        roadmap.length,
      );
      await expect(page.locator(`#roadmap [data-app-id="${app}"]`)).toHaveCount(
        roadmap.length,
      );
    }
    // Gate ATS: la feature, en el HTML estático de la página de su app.
    for (const locale of ["es", "en"] as const) {
      const html = await (
        await request.get(`/${locale}/vitrina/apps/${primerRoadmap.app}`)
      ).text();
      expect(html).toContain(primeraFeature.titulo[locale]);
    }
    await page.goto("/es");
    await expect(page.locator("#roadmap")).toHaveCount(0);
  });
});

test.describe("el ícono de la pestaña", () => {
  // Hasta 2026-09-26 era el triángulo de Vercel (el favicon de la plantilla).
  // Los archivos los cuida tests/unit/iconos.test.ts; esto cuida que Next los
  // ENLACE en la cabecera: un `icons` en la metadata de un layout reemplaza en
  // silencio a los íconos por archivo, y el unit no lo vería.
  for (const locale of ["es", "en"] as const) {
    test(`/${locale} enlaza las iniciales en SVG, el .ico y el de iOS, y los tres responden`, async ({
      page,
      request,
    }) => {
      await page.goto(`/${locale}`);
      const svg = page.locator('head link[rel="icon"][type="image/svg+xml"]');
      const apple = page.locator('head link[rel="apple-touch-icon"]');
      await expect(svg).toHaveCount(1);
      await expect(apple).toHaveCount(1);

      const esperados: [string, string][] = [
        [(await svg.getAttribute("href")) ?? "", "image/svg+xml"],
        [(await apple.getAttribute("href")) ?? "", "image/png"],
        ["/favicon.ico", "image/x-icon"],
      ];
      for (const [href, tipo] of esperados) {
        const r = await request.get(href);
        expect(r.status(), href).toBe(200);
        expect(r.headers()["content-type"], href).toContain(tipo);
      }
    });
  }

  // La misma loseta, arriba a la izquierda, es el botón para volver al inicio
  // (2026-09-26, antes un ◆). Desde una página interior lleva a la HOME.
  test("la loseta HR del encabezado lleva al inicio", async ({ page }) => {
    await page.goto("/es/cv");
    const inicio = page
      .getByRole("banner")
      .getByRole("link", { name: cvEs.identidad.nombre });
    await expect(
      inicio.locator('svg rect[fill="#2b4c7e"]'),
      "la marca HR no está en el enlace al inicio",
    ).toBeVisible();
    await inicio.click();
    await expect(page).toHaveURL(/\/es$/);
  });

  // Safari pide estas dos por su cuenta, sin leer el <link>. Hasta 2026-09-26
  // respondían 500 (ver src/app/layout.tsx); ahora sirven el mismo archivo.
  test("las rutas clásicas del ícono de iOS sirven las iniciales", async ({
    request,
  }) => {
    const oficial = await (await request.get("/apple-icon.png")).body();
    for (const ruta of [
      "/apple-touch-icon.png",
      "/apple-touch-icon-precomposed.png",
    ]) {
      const r = await request.get(ruta);
      expect(r.status(), ruta).toBe(200);
      expect(r.headers()["content-type"], ruta).toContain("image/png");
      expect((await r.body()).equals(oficial), ruta).toBe(true);
    }
  });
});

test.describe("un archivo que no existe en la raíz del sitio", () => {
  // El proxy no toca las rutas con punto, así que nadie les antepone /es:
  // caían en [locale] con un idioma inválido y respondían 500 (2026-09-26).
  const notFound = (locale: "es" | "en") =>
    (
      JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")) as {
        notFound: { titulo: string; volver: string };
      }
    ).notFound;

  for (const ruta of [
    "/favicon.png",
    "/manifest.webmanifest",
    "/cualquier-cosa.txt",
  ]) {
    test(`${ruta} responde 404, no 500`, async ({ request }) => {
      expect((await request.get(ruta)).status()).toBe(404);
    });
  }

  test("el 404 de la raíz habla los dos idiomas y lleva a las dos HOME", async ({
    page,
  }) => {
    const res = await page.goto("/favicon.png");
    expect(res?.status()).toBe(404);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText(notFound("es").titulo);
    await expect(h1).toContainText(notFound("en").titulo);
    await expect(
      page.getByRole("link", { name: notFound("es").volver }),
    ).toHaveAttribute("href", "/es");
    await expect(
      page.getByRole("link", { name: notFound("en").volver }),
    ).toHaveAttribute("href", "/en");
  });
});

test.describe("las cifras, en su letra desde la primera visita", () => {
  // Hasta 2026-09-26 JetBrains Mono iba sin preload con `display: optional`:
  // llegaba tarde a su ventana y la PRIMERA visita —la única de un
  // reclutador— pintaba las cifras en Arial (30 de 30 cargas en frío). Esa
  // mañana se precargó; esa noche, para devolverle margen al LCP de la HOME,
  // pasó a `swap` SIN precarga y con un fallback monoespaciado calibrado
  // (globals.css): la fuente llega un instante después y reemplaza al
  // fallback sin mover nada. Por eso aquí se espera a `document.fonts.ready`
  // antes de preguntar. Se le pregunta al motor qué fuente usó DE VERDAD para
  // pintar el nodo (CDP), no qué pide el CSS. Cada test abre un contexto
  // nuevo: caché vacía.
  const casos: [string, string][] = [
    ["/es", "#logros p.font-mono"],
    ["/es/proyectos/vesting", "p.font-mono.tabular-nums"],
    ["/es/cv", "main .font-mono"],
  ];
  for (const [ruta, selector] of casos) {
    test(`${ruta}: la primera visita pinta las cifras en JetBrains Mono`, async ({
      page,
    }, testInfo) => {
      test.skip(
        testInfo.project.name !== "chromium",
        "CDP: basta con Chromium de escritorio",
      );
      await page.goto(ruta);
      await page.locator(selector).first().scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("DOM.enable");
      await cdp.send("CSS.enable");
      const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
      const { nodeId } = await cdp.send("DOM.querySelector", {
        nodeId: root.nodeId,
        selector,
      });
      const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", {
        nodeId,
      });
      expect(
        fonts.map((f) => f.familyName),
        `${ruta} pintó ${selector} con otra fuente`,
      ).toEqual(["JetBrains Mono"]);
    });
  }
});

test.describe("el fallback de las cifras ocupa la misma caja que JetBrains Mono", () => {
  // 2026-09-26: con `swap`, las cifras se pintan primero en el fallback y
  // después en JetBrains Mono. Si el fallback no mide lo mismo, el cambio
  // MUEVE la página: con el de next/font (Arial, proporcional) una ficha de la
  // vitrina marcó CLS 0,257 en Lighthouse. El fallback está calibrado en
  // globals.css contra las métricas de la fuente (avance 0,6 em, ascenso
  // 1,02, descenso 0,30). Este test lo mide en el sistema donde corre —en la
  // CI, Linux— y además dice qué fuente local encontró: si no hay ninguna de
  // las calibradas, cae al `monospace` genérico y aquí se ve.
  test("mismo ancho y mismo alto de línea, y el fallback es una de las calibradas", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "CDP: basta con Chromium de escritorio",
    );
    await page.goto("/es");
    // Primero, que las cifras DE LA PÁGINA usen este fallback: si alguien
    // vuelve al de next/font, la medición de abajo seguiría en verde.
    const familia = await page
      .locator("#logros p.font-mono")
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(familia, "las cifras no llevan el fallback calibrado").toMatch(
      /JetBrains Mono"?,\s*"?JBM Fallback Menlo"?,\s*"?JBM Fallback Courier/,
    );
    await page.evaluate(() => document.fonts.load("16px 'JetBrains Mono'"));
    const cajas = await page.evaluate(() => {
      const texto = "0123456789 AI-103 · 23 AGENTES / 27";
      const medir = (familia: string, id: string) => {
        const s = document.createElement("span");
        s.id = id;
        s.textContent = texto;
        s.style.cssText = `font-family:${familia};font-size:16px;line-height:normal;white-space:nowrap;position:absolute;top:0;left:0`;
        document.body.appendChild(s);
        const r = s.getBoundingClientRect();
        return { ancho: r.width, alto: r.height };
      };
      return {
        jetbrains: medir("'JetBrains Mono'", "caja-jetbrains"),
        fallback: medir(
          "'JBM Fallback Menlo', 'JBM Fallback Courier', monospace",
          "caja-fallback",
        ),
      };
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("DOM.enable");
    await cdp.send("CSS.enable");
    const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
    const { nodeId } = await cdp.send("DOM.querySelector", {
      nodeId: root.nodeId,
      selector: "#caja-fallback",
    });
    const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
    const calibradas = [
      "Menlo",
      "DejaVu Sans Mono",
      "Bitstream Vera Sans Mono",
      "Courier New",
      "Liberation Mono",
      "Cousine",
    ];
    expect(
      fonts.map((f) => f.familyName).filter((f) => calibradas.includes(f)),
      `el fallback se pintó con ${fonts.map((f) => f.familyName).join(", ")}: ninguna es de las calibradas`,
    ).not.toEqual([]);
    const { jetbrains, fallback } = cajas;
    expect(
      Math.abs(fallback.ancho - jetbrains.ancho) / jetbrains.ancho,
      `ancho: fallback ${fallback.ancho.toFixed(2)} px, JetBrains ${jetbrains.ancho.toFixed(2)} px`,
    ).toBeLessThan(0.005);
    expect(
      Math.abs(fallback.alto - jetbrains.alto),
      `alto de línea: fallback ${fallback.alto.toFixed(2)} px, JetBrains ${jetbrains.alto.toFixed(2)} px`,
    ).toBeLessThan(0.5);
  });
});

test.describe("una cita del chat aterriza en su tarjeta de Skills", () => {
  // 2026-09-26: seis documentos «a fondo» llevan a una tarjeta de Skills
  // (`#skills-<id>`), no a la sección entera. La tarjeta entra con liftIn (70
  // px abajo y encogida): si el salto llega antes que la animación, apunta a la
  // posición de ARRANQUE, y al subir el título quedaba BAJO el encabezado.
  // Se mide cuando la animación TERMINÓ: a mitad de camino la tarjeta aún está
  // abajo y la prueba pasaría en falso.
  test("/es#skills-bi-y-decision deja el título de la tarjeta a la vista", async ({
    page,
  }) => {
    await page.goto("/es#skills-bi-y-decision");
    const tarjeta = page.locator("#skills-bi-y-decision");
    // Terminó cuando la tarjeta es del todo visible Y su título dejó de
    // moverse entre dos lecturas. No sirve mirar el `transform`: el contenedor
    // lleva una perspectiva fija que nunca vuelve a `none`.
    let previo = "";
    await expect
      .poll(
        async () => {
          const ahora = await tarjeta.evaluate((el) => {
            let opacidad = 1;
            for (let n: Element | null = el; n; n = n.parentElement) {
              opacidad *= Number(getComputedStyle(n).opacity);
            }
            const y = el.querySelector("h3")!.getBoundingClientRect().y;
            return `${opacidad.toFixed(2)}|${y.toFixed(1)}`;
          });
          const quieta = ahora === previo && ahora.startsWith("1.00|");
          previo = ahora;
          return quieta;
        },
        { intervals: [250], timeout: 10_000 },
      )
      .toBe(true);
    const encabezado = await page.locator("header").first().boundingBox();
    const titulo = await tarjeta.locator("h3").boundingBox();
    expect(titulo && encabezado, "sin caja").toBeTruthy();
    expect(
      titulo!.y,
      "el título de la tarjeta quedó bajo el encabezado",
    ).toBeGreaterThanOrEqual(encabezado!.y + encabezado!.height);
  });
});
