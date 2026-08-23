import { readdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

/**
 * LA VITRINA (S5) — e2e.
 *
 * Cubre las dos capas de la feature:
 *
 *  1. **La vitrina como contenido**: el índice, la ruta propia de cada app, el
 *     gate ATS/SEO (todo en el HTML estático), las reglas duras que la ficha
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
  app: { slug: string; nombre: string };
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
      .getByRole("link", { name: "Vitrina", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/es\/vitrina$/);

    // Las seis muestras, cada una con su tarjeta.
    await expect(page.locator("[data-muestra-slug]")).toHaveCount(
      EXPORTS.length,
    );

    const primera = MAS_LARGA;
    await page
      .locator(`[data-muestra-slug="${primera.app.slug}"]`)
      .getByRole("link", { name: primera.app.nombre })
      .click();

    await expect(page).toHaveURL(
      new RegExp(`/es/vitrina/${primera.app.slug}$`),
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
      await page.goto(`/es/vitrina/${exp.app.slug}`);
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
    await page.goto(`/es/vitrina/${EXPORTS[0].app.slug}`);
    const siguiente = page.getByRole("link", { name: /App siguiente/ });
    // La primera del orden nunca tiene «anterior», pero siempre tiene vecina.
    await expect(siguiente).toBeVisible();
    await siguiente.click();
    await expect(page).toHaveURL(/\/es\/vitrina\/[a-z0-9-]+$/);
    await expect(page.locator("article[data-app-slug]")).toHaveCount(1);
    // Y desde ahí se vuelve al escaparate.
    await page.getByRole("link", { name: /Volver a la vitrina/ }).click();
    await expect(page).toHaveURL(/\/es\/vitrina$/);
  });

  test("gate ATS/SEO: la ficha entrega TODO su contenido en el HTML estático", async ({
    page,
  }) => {
    const exp = MAS_LARGA;
    const res = await page.request.get(`/es/vitrina/${exp.app.slug}`);
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
      ...EXPORTS.map((e) => `/es/vitrina/${e.app.slug}`),
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
      await page.goto(`/es/vitrina/${exp.app.slug}`);
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
      await page.goto(`/es/vitrina/${exp.app.slug}`);

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

/* ────────────────────────────────────────────────────────────────────────────
 * APERTURA POR LECTURA — las pruebas que el patrón exige (banco §7)
 * ──────────────────────────────────────────────────────────────────────────── */

const RUTA_LARGA = `/es/vitrina/${MAS_LARGA.app.slug}`;

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
