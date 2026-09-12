import { existsSync, readdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { parse } from "yaml";

/**
 * LA VITRINA (S5) — e2e.
 *
 * Cubre las dos capas de la feature:
 *
 *  1. **La vitrina como contenido**: el portal por frentes (ADR-015), el
 *     escaparate de apps, la ruta propia de cada app, el gate ATS/SEO (todo en el HTML estático), las reglas duras que la ficha
 *     hace visibles (cero enlaces · toda cifra con su procedencia · las
 *     descartadas se muestran) y el CTA de lista de espera con su anclaje.
 *
 *  2. **La apertura por lectura** (banco §7): el patrón exige sus propias
 *     pruebas y las nombra. Van aquí, incluida la **deriva cero** con el bucle
 *     de M1 como fixture obligado (trampa T7).
 *
 * Data-driven: los slugs y el contenido salen de `content/vitrina/*.json`, la
 * misma fuente que renderiza la página. Una app hermana nueva entra al e2e
 * sola.
 */

type Export = {
  app: {
    slug: string;
    nombre: string;
    estado: "inicial" | "sellado";
    sellado_en: string | null;
  };
  promesa: { tagline: string };
  metricas: { clave: string; fuente: string }[];
  funcionalidades: {
    grupos: {
      orden: number;
      nombre: string;
      features: { que_hace: string }[];
    }[];
    descartadas: { id: string }[];
  };
};

const EXPORTS: Export[] = readdirSync("content/vitrina")
  .filter((f) => f.endsWith(".brochure-export.json"))
  .map(
    (f) => JSON.parse(readFileSync(`content/vitrina/${f}`, "utf8")) as Export,
  );
if (EXPORTS.length === 0) throw new Error("content/vitrina sin exports");

/** Los frentes del portal, de la misma fuente que la página (ADR-015). */
type Frente = {
  id: string;
  estado: "abierta" | "en-preparacion";
  nombre: { es: string; en: string };
  intro: { es: string; en: string };
};
const FRENTES = (
  parse(readFileSync("data/vitrina.yaml", "utf8")) as { categorias: Frente[] }
).categorias;
// Puede estar vacía: desde que los cuatro frentes tienen piezas, ningún frente
// está en preparación. Las pruebas que la usan se saltan con esa razón, en vez
// de reventar la suite o de fingir que vigilan algo.
const EN_PREPARACION = FRENTES.filter((f) => f.estado === "en-preparacion");

/**
 * Los frentes ABIERTOS que no son «apps» (S7) y sus piezas, leídas de
 * `content/<frente>/` — la misma fuente que renderiza la página, así que una
 * ficha nueva entra al e2e sola.
 */
type Pieza = {
  pieza: { slug: string; nombre: string; estado: string };
  promesa: { tagline: string };
  proceso?: unknown;
  conclusiones?: unknown[];
  galeria?: { archivo: string }[];
  bloques: { cuenta: number }[];
  titular: string;
};
const piezasDe = (frente: string): Pieza[] =>
  existsSync(`content/${frente}`)
    ? readdirSync(`content/${frente}`)
        .filter((f) => f.endsWith(".ficha-tecnica.json"))
        .map(
          (f) =>
            JSON.parse(readFileSync(`content/${frente}/${f}`, "utf8")) as Pieza,
        )
    : [];
const ABIERTOS = FRENTES.filter(
  (f) => f.estado === "abierta" && f.id !== "apps",
).map((f) => ({ ...f, piezas: piezasDe(f.id) }));
if (ABIERTOS.length === 0)
  throw new Error("data/vitrina.yaml sin frentes abiertos fuera de «apps»");

/** La ficha con más tarjetas: la que mejor estresa la apertura por lectura. */
const MAS_LARGA = EXPORTS.reduce((a, b) =>
  b.funcionalidades.grupos.length > a.funcionalidades.grupos.length ? b : a,
);

test.describe("Vitrina — el escaparate y las fichas", () => {
  test("se llega a la vitrina y de ahí a la ficha de una app (por la UI)", async ({
    page,
  }) => {
    await page.goto("/es");
    // Por la UI, no por `goto`: el enlace del header es parte de la feature.
    // En móvil vive dentro del menú, así que hay que abrirlo primero.
    const hamburguesa = page.getByRole("button", { name: "Abrir el menú" });
    if (await hamburguesa.isVisible()) await hamburguesa.click();
    await page
      .getByRole("link", { name: "Portafolio", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/es\/vitrina$/);

    // El PORTAL (ADR-015): una caja por frente, en el orden del YAML.
    const cajas = page.locator("[data-frente]");
    await expect(cajas).toHaveCount(FRENTES.length);
    expect(
      await cajas.evaluateAll((es) =>
        es.map((e) => e.getAttribute("data-frente")),
      ),
    ).toEqual(FRENTES.map((f) => f.id));
    // Y la caja de apps dice cuántas hay — la cuenta sale de los exports, no
    // de un número escrito a mano.
    await expect(page.locator('[data-frente="apps"]')).toContainText(
      `${EXPORTS.length} productos`,
    );

    await page
      .locator('[data-frente="apps"]')
      .getByRole("link", { name: "Apps", exact: true })
      .click();
    await expect(page).toHaveURL(/\/es\/vitrina\/apps$/);

    // Las seis muestras, cada una con su tarjeta.
    await expect(page.locator("[data-muestra-slug]")).toHaveCount(
      EXPORTS.length,
    );

    const primera = MAS_LARGA;
    await page
      .locator(`[data-muestra-slug="${primera.app.slug}"]`)
      .getByRole("link", { name: primera.app.nombre })
      .click();

    // Primero la FICHA TÉCNICA (ADR-016) …
    await expect(page).toHaveURL(
      new RegExp(`/es/vitrina/apps/${primera.app.slug}$`),
    );
    await expect(
      page.locator(`[data-ficha-tecnica="${primera.app.slug}"]`),
    ).toBeVisible();
    // … y de ahí, con el botón, al detalle.
    await page.locator('[data-cta="detalle"]').click();
    await expect(page).toHaveURL(
      new RegExp(`/es/vitrina/apps/${primera.app.slug}/detalle$`),
    );
    // Y la ficha que se abre es la de ESA app, no otra.
    await expect(
      page.locator(`article[data-app-slug="${primera.app.slug}"]`),
    ).toBeVisible();
  });

  test("cada app tiene su ruta propia y solo su ficha vive en ella", async ({
    page,
  }) => {
    for (const exp of EXPORTS) {
      await page.goto(`/es/vitrina/apps/${exp.app.slug}/detalle`);
      const fichas = page.locator("article[data-app-slug]");
      // La razón de ser del cambio: una ficha por página, no las seis apiladas.
      await expect(fichas).toHaveCount(1);
      await expect(fichas).toHaveAttribute("data-app-slug", exp.app.slug);
      await expect(
        page.getByRole("heading", { level: 2, name: exp.app.nombre }),
      ).toBeVisible();
    }
  });

  test("se navega entre apps vecinas sin volver al índice", async ({
    page,
  }) => {
    await page.goto(`/es/vitrina/apps/${EXPORTS[0].app.slug}/detalle`);
    const siguiente = page.getByRole("link", { name: /App siguiente/ });
    // La primera del orden nunca tiene «anterior», pero siempre tiene vecina.
    await expect(siguiente).toBeVisible();
    await siguiente.click();
    await expect(page).toHaveURL(/\/es\/vitrina\/apps\/[a-z0-9-]+\/detalle$/);
    await expect(page.locator("article[data-app-slug]")).toHaveCount(1);
    // Y desde ahí se sube a la ficha técnica, al escaparate, y al portal.
    await page.getByRole("link", { name: /Volver a la ficha técnica/ }).click();
    await expect(page).toHaveURL(/\/es\/vitrina\/apps\/[a-z0-9-]+$/);
    await page.getByRole("link", { name: /Volver a las apps/ }).click();
    await expect(page).toHaveURL(/\/es\/vitrina\/apps$/);
    await page.getByRole("link", { name: /Volver a la vitrina/ }).click();
    await expect(page).toHaveURL(/\/es\/vitrina$/);
  });

  test("gate ATS/SEO: la ficha entrega TODO su contenido en el HTML estático", async ({
    page,
  }) => {
    const exp = MAS_LARGA;
    const res = await page.request.get(
      `/es/vitrina/apps/${exp.app.slug}/detalle`,
    );
    expect(res.status()).toBe(200);
    const html = await res.text();

    // La promesa, los nombres de las tarjetas y el detalle de dentro: las
    // tarjetas nacen CERRADAS pero su contenido está en el HTML — si dependiera
    // del JS, ni un rastreador ni un ATS lo verían.
    expect(html).toContain(exp.promesa.tagline);
    for (const g of exp.funcionalidades.grupos) {
      expect(html).toContain(g.nombre);
    }
    const dentro = exp.funcionalidades.grupos[0].features[0].que_hace;
    expect(html).toContain(dentro.slice(0, 60));
  });

  test("CERO ENLACES: ninguna ruta de la vitrina entrega una URL de la app", async ({
    page,
  }) => {
    const rutas = [
      "/es/vitrina",
      "/es/vitrina/apps",
      ...EXPORTS.map((e) => `/es/vitrina/apps/${e.app.slug}`),
      ...EXPORTS.map((e) => `/es/vitrina/apps/${e.app.slug}/detalle`),
      ...EN_PREPARACION.map((f) => `/es/vitrina/${f.id}`),
    ];
    for (const ruta of rutas) {
      await page.goto(ruta);
      // Dentro del contenido no sale un solo enlace a otro sitio: lo que la
      // ficha muestra es la RAZÓN de que no lo haya, más el CTA de lista de
      // espera. (El footer, con sus perfiles públicos, queda fuera a propósito.)
      await expect(page.locator("main a[href^='http']")).toHaveCount(0);
      const html = await page.content();
      expect(html).not.toMatch(/vercel[.]app|workers[.]dev|pages[.]dev/);
    }
  });

  test("el CTA de lista de espera existe y su anclaje está en la MISMA página", async ({
    page,
  }) => {
    for (const exp of EXPORTS) {
      await page.goto(`/es/vitrina/apps/${exp.app.slug}/detalle`);
      const cta = page.locator('[data-cta="lista-de-espera"]');
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", "#contacto-vitrina");
      // Un ancla que no aterriza en ninguna parte es un botón roto.
      await expect(page.locator("#contacto-vitrina")).toHaveCount(1);
    }
  });

  test("toda cifra lleva su procedencia y las descartadas se muestran", async ({
    page,
  }) => {
    for (const exp of EXPORTS) {
      await page.goto(`/es/vitrina/apps/${exp.app.slug}/detalle`);

      const metricas = page.locator("[data-metrica]");
      await expect(metricas).toHaveCount(exp.metricas.length);
      // La regla madre del contrato: sin procedencia, la cifra no entra.
      for (const m of exp.metricas) {
        await expect(
          page.locator(`[data-metrica="${m.clave}"] [data-fuente]`),
        ).toHaveAttribute("data-fuente", m.fuente);
      }

      // Ni pendientes ni entregadas: retiradas, y a la vista.
      await expect(page.locator("[data-descartada-id]")).toHaveCount(
        exp.funcionalidades.descartadas.length,
      );
    }
  });
});

test.describe("Vitrina — la ficha técnica (ADR-016)", () => {
  type Complemento = {
    app: string;
    titular: string;
    cifras_destacadas: string[];
    nunca: string[];
    proceso: {
      titulo: string;
      carriles: { id: string; nombre: string }[];
      pasos: { id: string; tipo: string; texto: string }[];
      anotaciones: { texto: string }[];
    };
  };
  const COMPLEMENTOS: Complemento[] = readdirSync("data/fichas")
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => parse(readFileSync(`data/fichas/${f}`, "utf8")) as Complemento);

  test("cada app tiene su ficha técnica: titular, 3–5 cifras con procedencia, proceso y «nunca»", async ({
    page,
  }) => {
    for (const exp of EXPORTS) {
      const comp = COMPLEMENTOS.find((c) => c.app === exp.app.slug)!;
      await page.goto(`/es/vitrina/apps/${exp.app.slug}`);
      const ft = page.locator(`[data-ficha-tecnica="${exp.app.slug}"]`);
      await expect(ft).toBeVisible();
      await expect(ft.locator("[data-titular]")).toContainText(
        comp.titular.slice(0, 40),
      );

      // La FECHA de sello viene del contrato (`pieza.sellado_en`), no de un hito
      // de texto libre: si la pieza está sellada se enseña, y si no lo está el
      // chip no existe — un campo del contrato que nadie pinta es un campo que
      // nadie corrige cuando miente.
      const sello = ft.locator("[data-sellado-en]");
      if (exp.app.estado === "sellado") {
        await expect(sello).toHaveAttribute(
          "data-sellado-en",
          exp.app.sellado_en!,
        );
        await expect(sello).toContainText(exp.app.sellado_en!);
      } else {
        await expect(sello).toHaveCount(0);
      }

      const cifras = ft.locator("[data-cifra]");
      await expect(cifras).toHaveCount(comp.cifras_destacadas.length);
      // Cada cifra destacada es una métrica del export, con SU fuente.
      for (const clave of comp.cifras_destacadas) {
        const m = exp.metricas.find((x) => x.clave === clave)!;
        await expect(
          ft.locator(`[data-cifra="${clave}"] [data-fuente]`),
        ).toHaveAttribute("data-fuente", m.fuente);
      }

      // El proceso: un nodo por paso, y las anotaciones como notas al pie.
      const proceso = ft.locator(`[data-proceso="${exp.app.slug}"]`);
      await expect(proceso.locator("[data-paso]")).toHaveCount(
        comp.proceso.pasos.length,
      );
      await expect(proceso.locator("[data-nota]")).toHaveCount(
        comp.proceso.anotaciones.length,
      );
      // Y su procedencia se declara (hoy: CV Viva).
      await expect(ft.locator("[data-procedencia-proceso]")).toHaveAttribute(
        "data-procedencia-proceso",
        "cv-viva",
      );

      await expect(ft.locator("[data-nunca] li")).toHaveCount(
        comp.nunca.length,
      );
      await expect(ft.locator("[data-bloque]")).toHaveCount(
        exp.funcionalidades.grupos.length,
      );
    }
  });

  test("gate ATS/SEO: la ficha técnica entrega el proceso como texto en el HTML", async ({
    page,
  }) => {
    const exp = MAS_LARGA;
    const comp = COMPLEMENTOS.find((c) => c.app === exp.app.slug)!;
    const html = await (
      await page.request.get(`/es/vitrina/apps/${exp.app.slug}`)
    ).text();
    expect(html).toContain(comp.titular.slice(0, 40));
    // Los pasos del proceso son <text> del SVG: un rastreador los lee.
    for (const paso of comp.proceso.pasos
      .filter((p) => p.tipo === "tarea")
      .slice(0, 3)) {
      const primeraPalabra = paso.texto.split(" ")[0];
      expect(html).toContain(primeraPalabra);
    }
    expect(html).toContain(comp.proceso.titulo.toUpperCase());
  });

  test("la ficha técnica en móvil no encoge el proceso: se desliza", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "solo en el proyecto móvil");
    await page.goto(`/es/vitrina/apps/${MAS_LARGA.app.slug}`);
    const caja = page.locator(
      `[data-proceso="${MAS_LARGA.app.slug}"] [data-desliza]`,
    );
    const { scrollWidth, clientWidth } = await caja.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(scrollWidth).toBeGreaterThan(clientWidth);
    await expect(
      page.getByText("Desliza para ver el proceso completo."),
    ).toBeVisible();
  });
});

test.describe("Vitrina — los frentes en preparación (ADR-015)", () => {
  test("cada frente en preparación tiene su página, lo declara y no promete fecha", async ({
    page,
  }) => {
    test.skip(
      EN_PREPARACION.length === 0,
      "no hay frentes en preparación: los cuatro tienen piezas",
    );
    for (const f of EN_PREPARACION) {
      await page.goto(`/es/vitrina/${f.id}`);
      await expect(
        page.getByRole("heading", { level: 1, name: f.nombre.es }),
      ).toBeVisible();
      // El estado se dice con todas sus letras, en el HTML, no se disfraza.
      await expect(
        page.locator(`header[data-frente="${f.id}"]`),
      ).toHaveAttribute("data-estado", "en-preparacion");
      await expect(page.getByText("En preparación").first()).toBeVisible();
      // Un solo CTA, y es la lista de espera (regla 16) — con su anclaje.
      const cta = page.locator('[data-cta="lista-de-espera"]');
      await expect(cta).toHaveCount(1);
      await expect(page.locator("#contacto-vitrina")).toHaveCount(1);
      const html = await page.content();
      expect(html).toContain("Sin fecha prometida");
    }
  });

  test("del portal se entra a un frente en preparación, y de ahí a los otros", async ({
    page,
  }) => {
    test.skip(
      EN_PREPARACION.length === 0,
      "no hay frentes en preparación: los cuatro tienen piezas",
    );
    const primero = EN_PREPARACION[0];
    // El vecino al que se salta: cualquier otro frente, abierto o no. Desde el
    // S7 puede no quedar un segundo frente en preparación — y eso no debería
    // dejar esta prueba sin sujeto.
    const segundo = FRENTES.find((f) => f.id !== primero.id)!;
    await page.goto("/es/vitrina");
    await page
      .locator(`[data-frente="${primero.id}"]`)
      .getByRole("link", { name: primero.nombre.es, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/es/vitrina/${primero.id}$`));
    // Los vecinos: todos los frentes menos este.
    await expect(page.locator("[data-frente-vecino]")).toHaveCount(
      FRENTES.length - 1,
    );
    await page.locator(`[data-frente-vecino="${segundo.id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/es/vitrina/${segundo.id}$`));
  });

  test("gate ATS/SEO: el portal y los frentes entregan su contenido en el HTML", async ({
    page,
  }) => {
    const portal = await (await page.request.get("/es/vitrina")).text();
    for (const f of FRENTES) {
      expect(portal).toContain(f.nombre.es);
      expect(portal).toContain(f.intro.es.slice(0, 40));
    }
    // Y los frentes en preparación, si hay alguno. Sin este aviso, con la lista
    // vacía el bucle no se ejecuta y el verde se lee como cobertura de una rama
    // que nadie miró.
    test.info().annotations.push({
      type: EN_PREPARACION.length ? "frentes en preparación" : "sin sujeto",
      description: EN_PREPARACION.length
        ? EN_PREPARACION.map((f) => f.id).join(", ")
        : "los cuatro frentes tienen piezas: la rama «en preparación» no se ejerce aquí",
    });
    for (const f of EN_PREPARACION) {
      const res = await page.request.get(`/es/vitrina/${f.id}`);
      expect(res.status()).toBe(200);
      expect(await res.text()).toContain(f.intro.es);
    }
  });

  test("un frente que no existe es 404, y «apps» no cae en la página genérica", async ({
    page,
  }) => {
    const res = await page.goto("/es/vitrina/no-existe");
    expect(res?.status()).toBe(404);
    // /vitrina/apps es el escaparate (ruta estática), no un frente «en preparación».
    await page.goto("/es/vitrina/apps");
    await expect(page.locator("[data-muestra-slug]")).toHaveCount(
      EXPORTS.length,
    );
    await expect(
      page.locator('header[data-estado="en-preparacion"]'),
    ).toHaveCount(0);
  });
});

test.describe("Vitrina — las estanterías: un frente ABIERTO y sus piezas (S7)", () => {
  test("el escaparate lista TODAS las piezas del frente, y la cuenta es la medida", async ({
    page,
  }) => {
    for (const f of ABIERTOS) {
      await page.goto(`/es/vitrina/${f.id}`);
      await expect(
        page.getByRole("heading", { level: 1, name: f.nombre.es }),
      ).toBeVisible();
      await expect(page.locator("[data-muestra-slug]")).toHaveCount(
        f.piezas.length,
      );
      // La cuenta del encabezado NO se escribe: sale de contar los archivos.
      await expect(page.locator("[data-cuenta-piezas]")).toHaveAttribute(
        "data-cuenta-piezas",
        String(f.piezas.length),
      );
      // Cada muestra enseña su titular y tres cifras con su procedencia.
      for (const p of f.piezas) {
        const m = page.locator(`[data-muestra-slug="${p.pieza.slug}"]`);
        await expect(m.locator("[data-titular]")).toContainText(
          p.titular.slice(0, 40),
        );
        await expect(m.locator("[data-cifra] [data-fuente]")).toHaveCount(3);
      }
    }
  });

  test("el orden es el del motor: selladas primero, luego alfabético", async ({
    page,
  }) => {
    for (const f of ABIERTOS) {
      await page.goto(`/es/vitrina/${f.id}`);
      const enPantalla = await page
        .locator("[data-muestra-slug]")
        .evaluateAll((els) =>
          els.map((e) => e.getAttribute("data-muestra-slug")),
        );
      const esperado = [...f.piezas]
        .sort((a, b) => {
          if (a.pieza.estado !== b.pieza.estado)
            return a.pieza.estado === "sellado" ? -1 : 1;
          return a.pieza.nombre.localeCompare(b.pieza.nombre, "es-CO");
        })
        .map((p) => p.pieza.slug);
      expect(enPantalla).toEqual(esperado);
    }
  });

  test("cada pieza tiene su ruta propia con el MISMO renderizador de ficha", async ({
    page,
  }) => {
    for (const f of ABIERTOS) {
      for (const p of f.piezas) {
        await page.goto(`/es/vitrina/${f.id}/${p.pieza.slug}`);
        const ft = page.locator(`[data-ficha-tecnica="${p.pieza.slug}"]`);
        await expect(ft).toBeVisible();
        await expect(ft).toHaveAttribute("data-frente", f.id);
        await expect(
          page.getByRole("heading", { level: 1, name: p.pieza.nombre }),
        ).toBeVisible();
        // Solo las selladas enseñan su fecha de sello (contrato v1.2.0).
        await expect(ft.locator("[data-sellado-en]")).toHaveCount(
          p.pieza.estado === "sellado" ? 1 : 0,
        );
      }
    }
  });

  test("una ficha SIN proceso renumera: no hay hueco, y «Cómo funciona» no existe", async ({
    page,
  }) => {
    const sinProceso = ABIERTOS.flatMap((f) =>
      f.piezas.filter((p) => !p.proceso).map((p) => ({ f, p })),
    );
    expect(
      sinProceso.length,
      "ninguna pieza sin proceso: esta prueba no está vigilando nada",
    ).toBeGreaterThan(0);

    for (const { f, p } of sinProceso) {
      await page.goto(`/es/vitrina/${f.id}/${p.pieza.slug}`);
      const ft = page.locator(`[data-ficha-tecnica="${p.pieza.slug}"]`);
      // La sección del proceso no existe, ni su declaración de procedencia.
      await expect(ft.locator("[data-procedencia-proceso]")).toHaveCount(0);
      await expect(ft.locator("[data-proceso]")).toHaveCount(0);
      // Y las que quedan van seguidas, sin saltarse un número: cuatro fijas
      // más las opcionales que la pieza traiga (conclusiones · galería).
      const cuantas = 4 + (p.conclusiones ? 1 : 0) + (p.galeria ? 1 : 0);
      const secciones = await ft
        .locator("section[aria-labelledby]")
        .evaluateAll((els) =>
          els.map((e) => e.getAttribute("aria-labelledby")),
        );
      expect(secciones).toEqual(
        Array.from(
          { length: cuantas },
          (_, i) => `ft-0${i + 1}-${p.pieza.slug}`,
        ),
      );
      await expect(
        ft.locator(`#ft-0${cuantas + 1}-${p.pieza.slug}`),
      ).toHaveCount(0);
    }
  });

  test("una pieza que NO cuenta funcionalidades no dice «0 funcionalidades»", async ({
    page,
  }) => {
    // Una investigación tiene aportes, no funciones: sus bloques declaran
    // `cuenta: 0`. La app no puede inventarle un número que la ficha no dio —
    // ni en la tarjeta ni en el subtítulo de la sección.
    const sinCuenta = ABIERTOS.flatMap((f) =>
      f.piezas
        .filter((p) => p.bloques.every((b) => b.cuenta === 0))
        .map((p) => ({ f, p })),
    );
    // Aserción, no skip: las siete investigaciones llegan así por diseño
    // (aportes, no funciones). El día que ninguna pieza venga sin cuenta, esta
    // prueba tiene que AVISAR de que dejó de vigilar algo, no desaparecer.
    expect(
      sinCuenta.length,
      "ninguna pieza declara sus bloques en cuenta 0: esta prueba no vigila nada",
    ).toBeGreaterThan(0);

    for (const { f, p } of sinCuenta) {
      await page.goto(`/es/vitrina/${f.id}/${p.pieza.slug}`);
      const ft = page.locator(`[data-ficha-tecnica="${p.pieza.slug}"]`);
      await expect(ft).toContainText(`${p.bloques.length} grupos`);
      await expect(ft).not.toContainText(/0\s+funcionalidades/i);
    }
  });

  test("una pieza CON datos enseña sus conclusiones y su galería, y renumera a seis", async ({
    page,
  }) => {
    const conDatos = ABIERTOS.flatMap((f) =>
      f.piezas
        .filter((p) => p.galeria && p.conclusiones)
        .map((p) => ({ f, p })),
    );
    // Ídem: los seis tableros traen las dos claves de la v1.3.0 y son la razón
    // de que el contrato creciera. Si desaparecen, es un hallazgo, no un skip.
    expect(
      conDatos.length,
      "ninguna pieza trae galería y conclusiones: esta prueba no vigila nada",
    ).toBeGreaterThan(0);

    for (const { f, p } of conDatos) {
      await page.goto(`/es/vitrina/${f.id}/${p.pieza.slug}`);
      const ft = page.locator(`[data-ficha-tecnica="${p.pieza.slug}"]`);
      await expect(ft.locator("[data-conclusion]")).toHaveCount(
        p.conclusiones!.length,
      );
      // Cada conclusión lleva su procedencia, como toda cifra de la vitrina.
      await expect(ft.locator("[data-conclusion] [data-fuente]")).toHaveCount(
        p.conclusiones!.length,
      );
      await expect(ft.locator("[data-captura]")).toHaveCount(p.galeria!.length);
      // Y cada captura existe de verdad: la imagen responde 200, no un alt.
      for (const g of p.galeria!) {
        const res = await page.request.get(`/piezas/${f.id}/${g.archivo}`);
        expect(res.status(), `${g.archivo} debe servirse`).toBe(200);
      }
      // Sin proceso, con conclusiones y galería: 01…06 seguidas.
      const secciones = await ft
        .locator("section[aria-labelledby]")
        .evaluateAll((els) =>
          els.map((e) => e.getAttribute("aria-labelledby")),
        );
      expect(secciones).toEqual(
        (p.proceso ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5, 6]).map(
          (k) => `ft-0${k}-${p.pieza.slug}`,
        ),
      );
    }
  });

  test("en el escaparate, una pieza con galería enseña su portada; una sin ella, no", async ({
    page,
  }) => {
    for (const f of ABIERTOS) {
      await page.goto(`/es/vitrina/${f.id}`);
      for (const p of f.piezas) {
        await expect(
          page.locator(`[data-muestra-slug="${p.pieza.slug}"] [data-portada]`),
        ).toHaveCount(p.galeria ? 1 : 0);
      }
    }
  });

  test("una pieza cierra con la lista de espera y NADA más: no hay detalle que prometer", async ({
    page,
  }) => {
    const { f, piezas } = { f: ABIERTOS[0], piezas: ABIERTOS[0].piezas };
    await page.goto(`/es/vitrina/${f.id}/${piezas[0].pieza.slug}`);
    await expect(page.locator('[data-cta="detalle"]')).toHaveCount(0);
    await expect(page.locator('[data-cta="lista-de-espera"]')).toHaveCount(1);
    await expect(page.locator("#contacto-vitrina")).toHaveCount(1);
    // Y tampoco lo promete con palabras: sin detalle, «Qué tiene» no puede
    // mandar al lector a una ficha completa que no existe.
    await expect(page.locator("main")).not.toContainText(
      "vive en la ficha completa",
    );
  });

  test("se navega entre piezas VECINAS del mismo frente, sin salir de él", async ({
    page,
  }) => {
    const f = ABIERTOS[0];
    test.skip(
      f.piezas.length < 2,
      "el frente necesita dos piezas para vecinas",
    );
    await page.goto(`/es/vitrina/${f.id}`);
    const primera = await page
      .locator("[data-muestra-slug]")
      .first()
      .getAttribute("data-muestra-slug");
    await page.goto(`/es/vitrina/${f.id}/${primera}`);
    await page.getByText("Producto siguiente").click();
    await expect(page).toHaveURL(new RegExp(`/es/vitrina/${f.id}/[a-z0-9-]+$`));
    // Y la miga vuelve al escaparate del frente, no a la vitrina entera.
    await page.getByText(`Volver a ${f.nombre.es}`).click();
    await expect(page).toHaveURL(new RegExp(`/es/vitrina/${f.id}$`));
  });

  test("gate ATS/SEO: escaparate y ficha entregan su contenido en el HTML estático", async ({
    page,
  }) => {
    const f = ABIERTOS[0];
    const escaparate = await (
      await page.request.get(`/es/vitrina/${f.id}`)
    ).text();
    for (const p of f.piezas) {
      expect(escaparate).toContain(p.pieza.nombre);
      expect(escaparate).toContain(p.titular.slice(0, 60));
    }
    const ficha = await (
      await page.request.get(`/es/vitrina/${f.id}/${f.piezas[0].pieza.slug}`)
    ).text();
    expect(ficha).toContain(f.piezas[0].promesa.tagline);
  });

  test("CERO ENLACES en las rutas nuevas: ni una URL, ni un DOI", async ({
    page,
  }) => {
    // TODAS las piezas de TODOS los frentes abiertos, no una muestra: cada
    // ficha la escribió una casa distinta, así que el riesgo no es del
    // renderizador —que es uno— sino del contenido, que son 26 archivos.
    const rutas = ABIERTOS.flatMap((f) => [
      `/es/vitrina/${f.id}`,
      ...f.piezas.map((p) => `/es/vitrina/${f.id}/${p.pieza.slug}`),
    ]);
    expect(rutas.length, "no hay rutas nuevas que barrer").toBeGreaterThan(4);

    for (const ruta of rutas) {
      await page.goto(ruta);
      // Mismo alcance que la prueba del S5: dentro del CONTENIDO no sale un
      // enlace a otro sitio. El pie queda fuera a propósito — lleva los
      // perfiles públicos de la persona, que no son producción que se entregue.
      await expect(page.locator("main a[href^='http']")).toHaveCount(0);
      // Y en el texto tampoco: una investigación es justo donde se cuela un DOI.
      const texto = (await page.locator("main").innerText()).replace(
        /\s+/g,
        " ",
      );
      expect(texto, ruta).not.toMatch(/https?:\/\/|www\.|10\.\d{4,}\//);
      // Y el HTML entero —no solo el texto— contra los hosts de despliegue,
      // que es lo que la regla 16 prohíbe publicar. Sin esquema no los cazaba
      // ningún patrón de arriba.
      expect(await page.content(), ruta).not.toMatch(
        /vercel[.]app|workers[.]dev|pages[.]dev/i,
      );
    }
  });

  test("un frente EN PREPARACIÓN no publica sus piezas aunque las tenga en content/", async ({
    page,
  }) => {
    test.skip(
      EN_PREPARACION.length === 0,
      "no hay frentes en preparación: los cuatro tienen piezas",
    );
    for (const f of EN_PREPARACION) {
      const piezas = piezasDe(f.id);
      if (piezas.length === 0) continue;
      const res = await page.goto(
        `/es/vitrina/${f.id}/${piezas[0].pieza.slug}`,
      );
      expect(
        res?.status(),
        `«${f.id}» está en preparación: sus fichas existen pero no se publican hasta que el frente abra`,
      ).toBe(404);
    }
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * APERTURA POR LECTURA — las pruebas que el patrón exige (banco §7)
 * ──────────────────────────────────────────────────────────────────────────── */

const RUTA_LARGA = `/es/vitrina/apps/${MAS_LARGA.app.slug}/detalle`;

/**
 * Deja la tarjeta `i` con su cabecera a `frac` de la altura de pantalla y
 * devuelve dónde quedó de verdad. Converge en varias pasadas porque abrir una
 * tarjeta de más arriba mueve todo lo que viene debajo.
 */
async function ponerCabecera(page: Page, i: number, frac: number) {
  return page.evaluate(
    async ({ i, frac }) => {
      const espera = () =>
        new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        );
      const tarjetas =
        document.querySelectorAll<HTMLElement>(".tarjeta-vitrina");
      const t = tarjetas[i];
      for (let n = 0; n < 8; n++) {
        const vh = window.innerHeight;
        const objetivo = vh * frac;
        const delta = t.getBoundingClientRect().top - objetivo;
        if (Math.abs(delta) < 2) break;
        window.scrollBy({ top: delta, left: 0, behavior: "instant" });
        await espera();
      }
      await espera();
      return {
        top: t.getBoundingClientRect().top / window.innerHeight,
        abierta: t.hasAttribute("data-abierta"),
      };
    },
    { i, frac },
  );
}

test.describe("Apertura por lectura — el patrón, no una imitación", () => {
  test("la línea es de PANTALLA: no se abre asomando por el borde inferior (T1)", async ({
    page,
  }) => {
    test.slow();
    await page.goto(RUTA_LARGA);
    await page.locator(".tarjeta-vitrina").first().waitFor();

    // A 0.9 de pantalla la cabecera está por DEBAJO de la línea de los dos
    // tercios: se ve asomar, pero abrirla ahí sería crecer donde nadie mira.
    const asomando = await ponerCabecera(page, 2, 0.9);
    expect(asomando.abierta).toBe(false);

    // Cruzando la línea (a media pantalla) sí abre, todavía bajando.
    const cruzada = await ponerCabecera(page, 2, 0.5);
    expect(cruzada.abierta).toBe(true);
  });

  test("subiendo no se abre nada, jamás", async ({ page }) => {
    test.slow();
    await page.goto(RUTA_LARGA);
    await page.locator(".tarjeta-vitrina").first().waitFor();

    const abiertas = await page.evaluate(async () => {
      const espera = () =>
        new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        );
      const paso = Math.round(window.innerHeight * 0.4);
      // Al fondo del todo…
      for (let i = 0; i < 200; i++) {
        window.scrollBy({ top: paso, left: 0, behavior: "instant" });
        await espera();
        const fondo =
          document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= fondo - 2) break;
      }
      // …y de vuelta arriba, contando lo que se abra por el camino.
      let abiertasSubiendo = 0;
      while (window.scrollY > 0) {
        const antes = document.querySelectorAll(
          ".tarjeta-vitrina[data-abierta]",
        ).length;
        window.scrollBy({ top: -paso, left: 0, behavior: "instant" });
        await espera();
        const despues = document.querySelectorAll(
          ".tarjeta-vitrina[data-abierta]",
        ).length;
        if (despues > antes) abiertasSubiendo += despues - antes;
      }
      return abiertasSubiendo;
    });

    expect(abiertas).toBe(0);
  });

  test("DERIVA CERO: bajando, el contenido no salta bajo la vista (T7)", async ({
    page,
  }) => {
    test.slow();
    await page.goto(RUTA_LARGA);
    await page.locator(".tarjeta-vitrina").first().waitFor();

    // El bucle de M1 (entre las tarjetas 06 y 07) vivía justo aquí: la
    // compensación a ciegas del cierre por arriba duplicaba el ajuste, la
    // página brincaba hacia arriba y la tarjeta recién cerrada volvía a entrar
    // en zona de apertura.
    //
    // QUÉ SE MIDE, Y POR QUÉ ESO — tres candidatos descartados, cada uno por
    // una razón que vale la pena dejar escrita:
    //
    //  · `scrollY` NO sirve: baja legítimamente cada vez que se recoge una
    //    tarjeta alta de más arriba (el documento se encoge).
    //  · «llegar al fondo» tampoco: con el bug restaurado a propósito, esta
    //    página igual llegaba — el gate pasaba en VERDE con el defecto puesto,
    //    que es la definición de decorado.
    //  · «ninguna tarjeta se reabre» es falso de raíz: una tarjeta empujada
    //    bajo la pantalla por la que se expande encima DEBE cerrarse y volver
    //    a abrirse cuando el lector llega a ella. Es el patrón, no un fallo.
    //
    // Lo que el patrón manda medir es la **deriva de un ancla VISIBLE**: tras
    // bajar `paso`, lo que está en pantalla tiene que haber subido exactamente
    // `paso`. Para eso existe la compensación; si sobra o falta, el contenido
    // salta bajo los ojos del visitante — y ahí empieza el bucle.
    //
    // Demostrado en rojo (regla 14): con la compensación a ciegas restaurada
    // esta prueba acusa 348 px de salto — el ancla retrocedía 96 px cuando
    // debía avanzar 252.
    const r = await page.evaluate(async () => {
      const cuadro = () =>
        new Promise((res) =>
          requestAnimationFrame(() => requestAnimationFrame(res)),
        );

      /**
       * Espera a que la página deje de MOVERSE, no solo a que pase un cuadro.
       * Desplegar una tarjeta dura 620 ms: si el paso siguiente se da a los 32
       * ms, la página sigue creciendo sola y esa crecida se lee como deriva
       * (con dos cuadros de espera la prueba acusaba 96 px sobre código
       * correcto). Las animaciones infinitas —la firma que late dentro de una
       * tarjeta abierta— quedan fuera: nunca terminan.
       */
      const asentar = async () => {
        await cuadro();
        for (let n = 0; n < 60; n++) {
          const vivas = document.getAnimations().filter((a) => {
            if (a.playState !== "running") return false;
            const it = a.effect?.getTiming().iterations ?? 1;
            return Number.isFinite(it);
          });
          if (vivas.length === 0) return;
          await cuadro();
        }
      };

      // Una apertura hace crecer la página a propósito y empuja lo que tiene
      // debajo: en ESE paso no se mide (sería medir la feature, no la deriva).
      let abiertasEnEstePaso = 0;
      const obs = new MutationObserver((ms) => {
        for (const m of ms) {
          const el = m.target as Element;
          if (
            m.attributeName === "data-abierta" &&
            el.hasAttribute("data-abierta")
          )
            abiertasEnEstePaso++;
        }
      });
      for (const t of document.querySelectorAll(".tarjeta-vitrina"))
        obs.observe(t, { attributes: true, attributeFilter: ["data-abierta"] });

      const paso = Math.round(window.innerHeight * 0.35);
      const medio = Math.round(window.innerWidth / 2);
      let pasos = 0;
      let llego = false;
      let yAnterior = -1;
      let atascos = 0;
      let derivaMax = 0;
      let dondeDerivo = "";

      for (let i = 0; i < 400; i++) {
        // El ancla: lo que el visitante tiene delante de los ojos, y NADA que
        // lo envuelva. Subir al contenedor fue un error de medida que costó una
        // vuelta — el artículo de la ficha empieza miles de píxeles más arriba,
        // o sea POR ENCIMA de la tarjeta que se recoge, y entonces su techo se
        // mueve con el scroll aunque lo visible no se haya movido un pixel. Se
        // rastrea la franja central hasta dar con un bloque que EMPIECE dentro
        // de la pantalla (`top >= 0` ⇒ está por debajo de lo que se recoge).
        let ancla: Element | null = null;
        for (const f of [0.5, 0.45, 0.55, 0.4, 0.6, 0.35, 0.65]) {
          const e = document.elementFromPoint(
            medio,
            Math.round(window.innerHeight * f),
          );
          const c = e?.getBoundingClientRect();
          if (c && c.top >= 0 && c.height < window.innerHeight * 0.9) {
            ancla = e;
            break;
          }
        }
        const antes = ancla?.getBoundingClientRect().top;

        abiertasEnEstePaso = 0;
        window.scrollBy({ top: paso, left: 0, behavior: "instant" });
        await asentar();
        pasos = i + 1;

        const fondo =
          document.documentElement.scrollHeight - window.innerHeight;
        const tocoFondo = window.scrollY >= fondo - 2;

        // Cerca del fondo el navegador recorta el desplazamiento (ya no hay más
        // página): ahí el ancla se mueve menos que `paso` con toda razón.
        if (
          ancla?.isConnected &&
          antes !== undefined &&
          !tocoFondo &&
          abiertasEnEstePaso === 0 &&
          i > 0
        ) {
          const movido = antes - ancla.getBoundingClientRect().top;
          const deriva = Math.abs(movido - paso);
          if (deriva > derivaMax) {
            derivaMax = deriva;
            dondeDerivo = `paso ${pasos}: lo que estaba a la vista se movió ${Math.round(movido)}px en vez de ${paso}px`;
          }
        }

        if (tocoFondo) {
          llego = true;
          break;
        }
        // Atasco: la rueda gira y la página no avanza (el bucle, medido).
        if (window.scrollY <= yAnterior) atascos++;
        else atascos = 0;
        if (atascos > 8) break;
        yAnterior = window.scrollY;
      }
      obs.disconnect();
      return {
        llego,
        pasos,
        derivaMax,
        dondeDerivo,
        y: window.scrollY,
        fondo: document.documentElement.scrollHeight - window.innerHeight,
      };
    });

    // 2px de holgura: redondeo de subpíxel, no compensación.
    expect(
      r.derivaMax,
      `el contenido saltó bajo la vista — ${r.dondeDerivo}`,
    ).toBeLessThanOrEqual(2);
    // Y el recorrido termina: el bucle de M1 dejaba al visitante sin fondo.
    expect(
      r.llego,
      `no se alcanzó el fondo: y=${r.y} de ${r.fondo} en ${r.pasos} pasos`,
    ).toBe(true);
  });

  test("el toque la saca del automático para el resto de la visita", async ({
    page,
  }) => {
    test.slow();
    await page.goto(RUTA_LARGA);
    const t = page.locator(".tarjeta-vitrina").nth(2);
    await t.waitFor();

    await ponerCabecera(page, 2, 0.5);
    await expect(t).toHaveAttribute("data-abierta", "");

    // Un toque la cierra… y la marca.
    await t.locator(".tarjeta-boton").click();
    await expect(t).toHaveAttribute("data-manual", "");
    await expect(t).not.toHaveAttribute("data-abierta", "");

    // Y ya no vuelve a abrirse sola, por mucho que se la relea.
    await ponerCabecera(page, 2, 0.9);
    await ponerCabecera(page, 2, 0.5);
    await expect(t).not.toHaveAttribute("data-abierta", "");
  });

  test("cerrada, la tarjeta NO está en el árbol de accesibilidad", async ({
    page,
  }) => {
    test.slow();
    await page.goto(RUTA_LARGA);
    const t = page.locator(".tarjeta-vitrina").nth(3);
    await t.waitFor();

    const boton = t.locator(".tarjeta-boton");
    await expect(boton).toHaveAttribute("aria-expanded", "false");

    // Sin esto el lector de pantalla recita TODAS las funcionalidades de todas
    // las tarjetas "cerradas" — y axe no lo ve, porque para axe están ahí.
    // El `visibility` vive en el INTERIOR: el contenedor de fuera es quien
    // anima el alto, y ocultarlo a él cortaría la transición.
    const interior = t.locator(".tarjeta-detalle-interior");
    await expect(interior).toHaveCSS("visibility", "hidden");

    // Abierta, vuelve al árbol: el contenido es contenido, no decoración.
    await boton.click();
    await expect(boton).toHaveAttribute("aria-expanded", "true");
    await expect(interior).toHaveCSS("visibility", "visible");
  });

  test.describe("con prefers-reduced-motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("la apertura SIGUE ocurriendo: se apaga el movimiento, no el contenido", async ({
      page,
    }) => {
      test.slow();
      await page.goto(RUTA_LARGA);
      await page.locator(".tarjeta-vitrina").first().waitFor();

      const abierta = await ponerCabecera(page, 2, 0.5);
      expect(abierta.abierta).toBe(true);
      await expect(
        page
          .locator(".tarjeta-vitrina")
          .nth(2)
          .locator(".tarjeta-detalle-interior"),
      ).toHaveCSS("visibility", "visible");
    });
  });
});
