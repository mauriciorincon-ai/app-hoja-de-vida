import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { parse } from "yaml";

/**
 * SKILLS, EL EXPLORADOR (S29, OM-02): la pieza 1 de `referencias-ui/home/maqueta/` en el sitio.
 *
 * El HTML del servidor trae la lista (ATS, SEO, sin JavaScript, impresión); con JavaScript, el rectángulo
 * oscuro con las nueve áreas flotando. Las burbujas se mueven cuadro a cuadro: los clics van con `force`
 * (Playwright espera a que un elemento deje de moverse, y estas no dejan) y las posiciones se miden con su
 * caja en el momento.
 */

type Grupo = { id: string; grupo: string; items: string[] };
const leer = (l: "es" | "en") =>
  (parse(readFileSync(`data/cv.${l}.yaml`, "utf8")) as { skills: Grupo[] })
    .skills;
const ES = leer("es");
const EN = leer("en");
const N = ES.length;

const burbuja = (page: Page, i: number) =>
  page.locator(`#skills .burbuja[data-i="${i}"]`);
const escenario = (page: Page) => page.locator("#skills .escenario");

/** La home con el escenario cargado y a la vista; recoge los errores de consola. */
async function abrirSkills(page: Page, ruta = "/es") {
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(String(e)));
  // El script de Vercel Analytics solo existe en Vercel: en local y en CI responde 404 en todo el sitio.
  page.on("console", (m) => {
    if (m.type() === "error" && !/status of 404/.test(m.text()))
      errores.push(m.text());
  });
  await page.goto(ruta);
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(escenario(page)).toBeVisible();
  await escenario(page).scrollIntoViewIfNeeded();
  await expect(escenario(page)).toHaveAttribute("data-visto", "");
  return errores;
}

async function centro(page: Page, i: number) {
  const b = await burbuja(page, i).boundingBox();
  expect(b, `burbuja ${i + 1} sin caja`).toBeTruthy();
  return { x: b!.x + b!.width / 2, y: b!.y + b!.height / 2 };
}

const cual = (page: Page) => page.locator("#skills .pasos .cual");

test.describe("Skills — el HTML del servidor (sin JavaScript)", () => {
  test.use({ javaScriptEnabled: false });

  test("trae las nueve tarjetas con su ancla, su número y los estados como etiqueta", async ({
    page,
  }) => {
    await page.goto("/es");
    const tarjetas = page.locator("#skills .lista article");
    await expect(tarjetas).toHaveCount(N);
    for (const [i, g] of ES.entries()) {
      const t = tarjetas.nth(i);
      await expect(t).toHaveAttribute("id", `skills-${g.id}`);
      await expect(t.locator("h3 .n")).toHaveText(String(i + 1));
      await expect(t.locator("h3")).toContainText(g.grupo);
      await expect(t.locator("li")).toHaveCount(g.items.length);
    }
    await expect(page.locator("#skills .lista .estado").first()).toBeVisible();
    await expect(
      page.locator("#skills .lista li", { hasText: "Airflow" }),
    ).toHaveText("Airflow en estudio");
    // sin JavaScript no hay conmutador ni rectángulo: solo la lista
    await expect(page.locator("#skills .vista")).toBeHidden();
    await expect(page.locator("#skills .escenario-hueco")).toBeHidden();
    await expect(tarjetas.first()).toBeVisible();
  });
});

test.describe("Skills — el explorador", () => {
  test("las nueve áreas, numeradas en el orden del CV, flotan; la lista queda detrás de «Ver todo en lista»", async ({
    page,
  }) => {
    const errores = await abrirSkills(page);
    await expect(page.locator("#skills .burbuja")).toHaveCount(N);
    for (const [i, g] of ES.entries()) {
      await expect(burbuja(page, i).locator(".num")).toContainText(
        String(i + 1),
      );
      await expect(burbuja(page, i).locator(".nombre")).toHaveText(g.grupo);
      await expect(burbuja(page, i)).toHaveAttribute("aria-pressed", "false");
    }
    await expect(page.locator("#skills .lista")).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Áreas", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#skills .invita-txt")).toHaveText(
      "Elige un área y te muestro con qué trabajo en ella",
    );
    // se mueven solas
    await page.mouse.move(2, 2);
    const a = await centro(page, 0);
    await page.waitForTimeout(700);
    const b = await centro(page, 0);
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(2);
    expect(errores, "consola").toEqual([]);
  });

  test("la que tiene el cursor encima se detiene y crece un 20 %", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile",
      "en el celular no hay cursor",
    );
    await abrirSkills(page);
    const c = await centro(page, 3);
    await page.mouse.move(c.x, c.y);
    await expect(burbuja(page, 3)).toHaveAttribute("data-sobre", "");
    await expect
      .poll(() =>
        burbuja(page, 3)
          .locator(".disco")
          .evaluate((el) => getComputedStyle(el).transform),
      )
      .toBe("matrix(1.2, 0, 0, 1.2, 0, 0)");
    const quieta = await centro(page, 3);
    await page.waitForTimeout(500);
    const despues = await centro(page, 3);
    expect(Math.hypot(quieta.x - despues.x, quieta.y - despues.y)).toBeLessThan(
      1,
    );
    // el fondo no frena nada: el cursor fuera de las burbujas no detiene a ninguna
    await page.mouse.move(2, 2);
    await expect(page.locator("#skills .burbuja[data-sobre]")).toHaveCount(0);
  });

  test("elegir un área: al centro, sus herramientas alrededor, «← N · M →», las flechas y Escape", async ({
    page,
  }) => {
    await abrirSkills(page);
    await burbuja(page, 5).click({ force: true });
    await expect(burbuja(page, 5)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#skills .chip")).toHaveCount(
      ES[5]!.items.length,
    );
    await expect(cual(page)).toHaveText(`6 de ${N}`);
    await expect(page.locator("#skills .progreso")).toHaveText(
      `· 1 de ${N} vistas`,
    );
    // las otras se van
    await expect(burbuja(page, 0)).toBeHidden();
    await expect(page.locator("#skills .volver")).toBeVisible();
    // ← → por botón y por teclado, y la vuelta del 9 al 1
    await page.locator("#skills .pasos button").last().click();
    await expect(cual(page)).toHaveText(`7 de ${N}`);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(cual(page)).toHaveText(`9 de ${N}`);
    await page.keyboard.press("ArrowRight");
    await expect(cual(page)).toHaveText(`1 de ${N}`);
    await page.keyboard.press("ArrowLeft");
    await expect(cual(page)).toHaveText(`9 de ${N}`);
    await expect(page.locator("#skills [aria-live]")).toContainText(
      ES[8]!.grupo,
    );
    // Escape vuelve a todas, y el foco a la que estaba abierta
    await page.keyboard.press("Escape");
    await expect(escenario(page)).not.toHaveAttribute("data-elegido", "");
    await expect(page.locator("#skills .burbuja:visible")).toHaveCount(N);
    await expect(burbuja(page, 8)).toBeFocused();
    await expect(burbuja(page, 8)).toHaveAttribute("data-abierta", "");
  });

  test("con el teclado: Tab llega a las áreas, Enter abre y «← Todas las áreas» devuelve el foco", async ({
    page,
  }) => {
    await abrirSkills(page);
    await page
      .getByRole("button", { name: "Ver todo en lista", exact: true })
      .first()
      .focus();
    await page.keyboard.press("Tab");
    await expect(burbuja(page, 0)).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(burbuja(page, 1)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(burbuja(page, 1)).toHaveAttribute("aria-pressed", "true");
    await expect(cual(page)).toHaveText(`2 de ${N}`);
    await page.locator("#skills .volver").focus();
    await page.keyboard.press("Enter");
    await expect(burbuja(page, 1)).toBeFocused();
    await expect(burbuja(page, 1)).toHaveAttribute("aria-pressed", "false");
  });

  test("las nueve vistas: «Ya las viste todas.» y la lista a un clic", async ({
    page,
  }) => {
    await abrirSkills(page);
    await burbuja(page, 0).click({ force: true });
    for (let k = 1; k < N; k++) await page.keyboard.press("ArrowRight");
    await expect(cual(page)).toHaveText(`${N} de ${N}`);
    await page.keyboard.press("Escape");
    await expect(page.locator("#skills .invita-txt")).toHaveText(
      "Ya las viste todas.",
    );
    await expect(page.locator("#skills .burbuja[data-abierta]")).toHaveCount(N);
    const verLista = page.locator("#skills .ver-lista");
    await expect(verLista).toBeVisible();
    // Con un área abierta la invitación se va entera: opacity sola lo dejaba invisible y enfocable (2.4.7).
    await burbuja(page, 0).click({ force: true });
    await expect(escenario(page)).toHaveAttribute("data-elegido", "");
    await expect(verLista).toHaveCSS("visibility", "hidden");
    await page.keyboard.press("Escape");
    await expect(verLista).toBeVisible();
    await verLista.click();
    await expect(page.locator("#skills .lista")).toBeVisible();
    await expect(escenario(page)).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Ver todo en lista", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    // y de vuelta a las áreas: las vistas siguen marcadas
    await page.getByRole("button", { name: "Áreas", exact: true }).click();
    await expect(escenario(page)).toBeVisible();
    await expect(page.locator("#skills .burbuja[data-abierta]")).toHaveCount(N);
  });

  test("agarrar y lanzar: arrastrada se mueve con la mano y soltarla no elige", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "el dedo tiene su prueba");
    await abrirSkills(page);
    const a = await centro(page, 4);
    await page.mouse.move(a.x, a.y);
    await page.mouse.down();
    for (let k = 1; k <= 12; k++)
      await page.mouse.move(a.x - k * 12, a.y + k * 4);
    await expect(burbuja(page, 4)).toHaveAttribute("data-agarrada", "");
    await page.mouse.up();
    const b = await centro(page, 4);
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(60);
    await expect(burbuja(page, 4)).toHaveAttribute("aria-pressed", "false");
    await expect(escenario(page)).not.toHaveAttribute("data-elegido", "");
  });

  test("en inglés: los nombres, la invitación y «N of 9»", async ({ page }) => {
    const errores = await abrirSkills(page, "/en");
    await expect(burbuja(page, 0).locator(".nombre")).toHaveText(EN[0]!.grupo);
    await expect(page.locator("#skills .invita-txt")).toHaveText(
      "Pick an area and I will show you what I work with in it",
    );
    await burbuja(page, 5).click({ force: true });
    await expect(cual(page)).toHaveText(`6 of ${N}`);
    await expect(page.locator("#skills .volver")).toHaveText("← All areas");
    expect(errores, "consola").toEqual([]);
  });

  test("a 390 px no hay desborde horizontal, ni en reposo ni con un área abierta", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await abrirSkills(page);
    const ancho = () =>
      page.evaluate(() => document.documentElement.scrollWidth);
    expect(await ancho()).toBeLessThanOrEqual(390);
    await burbuja(page, 0).click({ force: true });
    await expect(page.locator("#skills .chip")).toHaveCount(
      ES[0]!.items.length,
    );
    expect(await ancho()).toBeLessThanOrEqual(390);
    // las herramientas quedan dentro del rectángulo
    const r = (await escenario(page).boundingBox())!;
    for (const chip of await page.locator("#skills .chip").all()) {
      const c = (await chip.boundingBox())!;
      expect(c.x).toBeGreaterThanOrEqual(r.x);
      expect(c.x + c.width).toBeLessThanOrEqual(r.x + r.width + 0.5);
    }
  });

  test("al imprimir va la lista, no el rectángulo", async ({ page }) => {
    await abrirSkills(page);
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("#skills .lista")).toBeVisible();
    await expect(page.locator("#skills .escenario-hueco")).toBeHidden();
    await expect(page.locator("#skills .vista")).toBeHidden();
  });
});

test.describe("Skills — si el chunk del escenario no llega", () => {
  test("la home sigue en pie y queda la lista, sin conmutador (S29, M2)", async ({
    page,
  }) => {
    // Se aborta SOLO el chunk del escenario (el que trae la clase de las burbujas); los demás pasan.
    let abortados = 0;
    await page.route(/\/_next\/static\/.*\.js(\?.*)?$/, async (route) => {
      const res = await route.fetch();
      const cuerpo = await res.text();
      if (/\bburbuja\b/.test(cuerpo) && !/escenario-hueco/.test(cuerpo)) {
        abortados++;
        await route.abort();
      } else {
        await route.fulfill({ response: res, body: cuerpo });
      }
    });
    await page.goto("/es");
    await page.locator("#skills").scrollIntoViewIfNeeded();
    await expect(
      page.locator("[data-skills][data-sin-escenario]"),
    ).toBeAttached();
    expect(
      abortados,
      "el chunk del escenario se pidió y se abortó",
    ).toBeGreaterThan(0);
    await expect(page.locator("#skills .lista")).toBeVisible();
    await expect(page.locator("#skills .escenario")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Ver todo en lista", exact: true }),
    ).toBeHidden();
    // y el resto de la home no se reemplazó por la página de error
    await expect(page.locator("#contacto")).toBeAttached();
    await expect(page.locator("#skills .lista li").first()).toBeVisible();
  });
});

test.describe("Skills — con «reducir movimiento»", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("no flota ni se arrastra, y el clic sigue eligiendo", async ({
    page,
  }) => {
    const errores = await abrirSkills(page);
    const a = await centro(page, 2);
    await page.waitForTimeout(700);
    const b = await centro(page, 2);
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(0.5);
    // agarrar no arrastra
    await page.mouse.move(b.x, b.y);
    await page.mouse.down();
    // la mano se va lejos (fuera de la burbuja): si se soltara encima sería un clic y la abriría
    for (let k = 1; k <= 8; k++) await page.mouse.move(b.x + k * 30, b.y);
    await page.mouse.up();
    const c = await centro(page, 2);
    expect(Math.hypot(b.x - c.x, b.y - c.y)).toBeLessThan(0.5);
    await expect(escenario(page)).not.toHaveAttribute("data-elegido", "");
    await burbuja(page, 6).click({ force: true });
    await expect(burbuja(page, 6)).toHaveAttribute("aria-pressed", "true");
    expect(errores, "consola").toEqual([]);
  });

  test("axe limpio en Skills: en reposo, con un área abierta y en lista", async ({
    page,
  }) => {
    test.slow();
    await abrirSkills(page);
    const scan = async (momento: string) => {
      const r = await new AxeBuilder({ page })
        .include("#skills")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(r.violations, momento).toEqual([]);
    };
    await scan("en reposo");
    await burbuja(page, 1).click({ force: true });
    await expect(page.locator("#skills .chip")).toHaveCount(
      ES[1]!.items.length,
    );
    await scan("con un área abierta");
    await page
      .getByRole("button", { name: "Ver todo en lista", exact: true })
      .first()
      .click();
    await expect(page.locator("#skills .lista")).toBeVisible();
    await scan("en lista");
  });
});

test.describe("Skills — una cita del chat abre su área", () => {
  // Las citas del chat siguen yendo a `/#skills-<id>` (scripts/destinos.mjs): con el explorador puesto, la
  // isla abre esa área y lleva el rectángulo a la vista bajo el header. El chat no se toca. La llegada
  // con el ancla en la URL está en tests/e2e/home.spec.ts.

  test("un enlace a una tarjeta, en la misma página, abre su área", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.evaluate(() => {
      const a = document.createElement("a");
      a.href = "/es#skills-ingenieria";
      a.id = "cita-de-prueba";
      a.textContent = "cita";
      a.style.cssText = "position:fixed;top:60px;left:8px;z-index:99";
      document.body.append(a);
    });
    await page.locator("#cita-de-prueba").click();
    const j = ES.findIndex((g) => g.id === "ingenieria");
    await expect(burbuja(page, j)).toHaveAttribute("aria-pressed", "true");
    await expect(burbuja(page, j)).toBeInViewport();
  });
});

test.describe("Skills — el dedo en el celular", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "solo con pantalla táctil");
  });

  async function tocar(page: Page) {
    const cdp = await page.context().newCDPSession(page);
    return (
      type: "touchStart" | "touchMove" | "touchEnd",
      p?: { x: number; y: number },
    ) =>
      cdp.send("Input.dispatchTouchEvent", {
        type,
        touchPoints: p ? [{ x: p.x, y: p.y }] : [],
      });
  }

  test("deslizar sobre una burbuja baja la página; mantener 0,3 s la arrastra", async ({
    page,
  }) => {
    await abrirSkills(page);
    const t = await tocar(page);
    // deslizar enseguida: es de la página
    const a = await centro(page, 0);
    const y0 = await page.evaluate(() => window.scrollY);
    await t("touchStart", a);
    for (let k = 1; k <= 8; k++)
      await t("touchMove", { x: a.x, y: a.y - k * 15 });
    await t("touchEnd");
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(y0 + 20);
    await expect(burbuja(page, 0)).not.toHaveAttribute("data-agarrada", "");

    // mantener 0,3 s: se arma, y desde ahí la página no se mueve
    await escenario(page).scrollIntoViewIfNeeded();
    const b = await centro(page, 2);
    const y1 = await page.evaluate(() => window.scrollY);
    await t("touchStart", b);
    await page.waitForTimeout(450);
    await expect(burbuja(page, 2)).toHaveAttribute("data-agarrada", "");
    for (let k = 1; k <= 8; k++)
      await t("touchMove", { x: b.x + k * 6, y: b.y - k * 10 });
    await t("touchEnd");
    const c = await centro(page, 2);
    expect(Math.hypot(b.x - c.x, b.y - c.y)).toBeGreaterThan(40);
    expect(await page.evaluate(() => window.scrollY)).toBe(y1);
    await expect(burbuja(page, 2)).toHaveAttribute("aria-pressed", "false");
  });
});

/**
 * EN EL CELULAR LAS NUEVE ÁREAS FLOTAN SUELTAS (ajuste del 2026-11-01).
 *
 * A 360–414 px el rectángulo medía ≈ 330–380 × 600 y las nueve se empujaban sin avanzar. Ahora su alto sale
 * de cuántas áreas son (el `medidas()` del motor) y por debajo de 480 px miden 112. Aquí se mira en el
 * navegador lo que el motor puro ya prueba con números: que se mueven, que los nombres caben en su círculo
 * y que el hueco reserva el alto del escenario antes de que llegue.
 */
test.describe("Skills — en el celular flotan sueltas", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const centros = (page: Page) =>
    page.evaluate(() =>
      [...document.querySelectorAll("#skills .burbuja")].map((b) => {
        const r = b.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }),
    );

  test("a 390 px las nueve áreas cambian de sitio en 3 s", async ({ page }) => {
    const errores = await abrirSkills(page);
    const antes = await centros(page);
    expect(antes).toHaveLength(N);
    await page.waitForTimeout(3000);
    const despues = await centros(page);
    const corrido = antes.map((a, i) =>
      Math.hypot(a.x - despues[i]!.x, a.y - despues[i]!.y),
    );
    const media = corrido.reduce((s, c) => s + c, 0) / N;
    expect(
      corrido.filter((c) => c > 10).length,
      `corrido: ${corrido.map((c) => c.toFixed(0)).join(" ")}`,
    ).toBeGreaterThanOrEqual(7);
    expect(media).toBeGreaterThan(25);
    expect(errores, "consola").toEqual([]);
  });

  for (const [l, ruta] of [
    ["es", "/es"],
    ["en", "/en"],
  ] as const) {
    test(`/${l}: ningún nombre se sale de su círculo`, async ({ page }) => {
      await abrirSkills(page, ruta);
      const sueltos = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("#skills .burbuja")]
          .map((b) => {
            const disco = b.querySelector<HTMLElement>(".disco")!;
            const nombre = b.querySelector<HTMLElement>(".nombre")!;
            const c = disco.getBoundingClientRect();
            const rg = document.createRange();
            rg.selectNodeContents(nombre);
            const t = rg.getBoundingClientRect();
            const cx = c.x + c.width / 2;
            const cy = c.y + c.height / 2;
            const r = c.width / 2;
            const fuera = [
              [t.left, t.top],
              [t.right, t.top],
              [t.left, t.bottom],
              [t.right, t.bottom],
            ].filter(([x, y]) => Math.hypot(x! - cx, y! - cy) > r + 0.5);
            return {
              nombre: nombre.textContent,
              fuera: fuera.length,
            };
          })
          .filter((x) => x.fuera > 0),
      );
      expect(sueltos, "nombres fuera de su círculo").toEqual([]);
    });
  }

  for (const ancho of [360, 390, 414]) {
    test(`a ${ancho} px el hueco reserva el alto que tendrá el escenario`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: ancho, height: 844 });
      await abrirSkills(page);
      // Un hueco vacío como el que se ve antes de que llegue el escenario, con la misma hoja y el mismo ancho.
      const { hueco, escenario: alto } = await page.evaluate(() => {
        const real = document.querySelector<HTMLElement>(
          "#skills .escenario-hueco",
        )!;
        const sonda = document.createElement("div");
        sonda.className = "escenario-hueco";
        real.parentElement!.insertBefore(sonda, real);
        const h = sonda.getBoundingClientRect().height;
        sonda.remove();
        return {
          hueco: h,
          escenario: document
            .querySelector<HTMLElement>("#skills .escenario")!
            .getBoundingClientRect().height,
        };
      });
      expect(alto, "el escenario ya no mide 600").toBeGreaterThan(650);
      expect(
        Math.abs(hueco - alto),
        `hueco ${hueco} · escenario ${alto}`,
      ).toBeLessThanOrEqual(2);
    });
  }
});
