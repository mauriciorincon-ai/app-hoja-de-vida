import { expect, test, type Page } from "@playwright/test";

/**
 * EL PRIMER TAB (S23, OM-33).
 *
 * El dueño: «no pude abrir el menú solo con teclado: apenas hice Tab me lleva a
 * la sección de contacto, al campo "Tu nombre"». No era un defecto del sitio:
 * ningún código mueve el foco al cargar (no hay `autoFocus` ni `.focus()` fuera
 * de un evento). Era SAFARI, con el que se hizo la sentada: por defecto su Tab
 * recorre SOLO los campos de formulario —el primero de la HOME es «Tu nombre»—,
 * y los enlaces y botones piden Opción+Tab o el ajuste «Pulsar Tab para resaltar
 * cada ítem de una página web» (Ajustes → Avanzado). Reproducido en WebKit de
 * macOS: Tab → `solicitud-nombre`; Opción+Tab → «Saltar al contenido» → el logo
 * → «Hoja de vida».
 *
 * Lo que sí es del sitio, y esto vigila, es el ORDEN: con el recorrido completo
 * (Tab en Chromium, Opción+Tab en Safari) el primer foco es el enlace de saltar
 * al contenido, el segundo el logo y el tercero «Hoja de vida», cuyo Enter abre
 * el menú. Si una sección vuelve a robar el foco, o el formulario queda antes
 * del encabezado en el DOM, esto se pone rojo.
 */

const SECUENCIA = ["Saltar al contenido", "Henry Rincón", "Hoja de vida"];

async function quienTieneElFoco(page: Page) {
  return page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    if (!a || a === document.body) return "(nadie)";
    return (a.getAttribute("aria-label") || a.textContent || a.id).trim();
  });
}

/** Tres tabulaciones desde la carga limpia, con la tecla que recorre TODO. */
async function recorrer(page: Page, tecla: string) {
  await page.goto("/es");
  await page.waitForLoadState("load");
  expect(await quienTieneElFoco(page), "al cargar nadie tiene el foco").toBe(
    "(nadie)",
  );
  const vistos: string[] = [];
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press(tecla);
    vistos.push(await quienTieneElFoco(page));
  }
  return vistos;
}

test.describe("el primer Tab en la HOME", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "el menú móvil es otro disclosure: lo cubre nav-header.spec",
  );

  test("el recorrido completo empieza por saltar al contenido y llega a «Hoja de vida» @webkit", async ({
    page,
    browserName,
  }) => {
    let vistos = await recorrer(page, "Tab");
    if (browserName === "webkit" && vistos[0] !== SECUENCIA[0]) {
      // Safari (y su WebKit): el Tab a secas recorre solo los campos. Es su
      // ajuste por defecto, no el sitio: Opción+Tab hace el recorrido completo.
      expect(vistos[0], "Safari cae en el primer campo").toContain("nombre");
      vistos = await recorrer(page, "Alt+Tab");
    }
    expect(vistos).toEqual(SECUENCIA);

    // Enter sobre «Hoja de vida» abre el menú, sin ratón.
    await page.keyboard.press("Enter");
    await expect(
      page.locator('button[aria-controls="nav-hoja-de-vida"]'),
    ).toHaveAttribute("aria-expanded", "true");
  });

  test("nada del sitio roba el foco al cargar ni al saltar a un ancla", async ({
    page,
  }) => {
    await page.goto("/es#contacto");
    await page.waitForLoadState("load");
    // Hidratada: un `autoFocus` o un `.focus()` de montaje ya habría corrido.
    await page.locator("form[data-hydrated=true]").waitFor();
    // El ancla desplaza la ventana; el foco sigue sin dueño. (El formulario de
    // contacto no se enfoca solo: lo único que cambia es dónde empieza el Tab
    // del navegador, y eso es del navegador.)
    const activo = await page.evaluate(
      () => (document.activeElement as HTMLElement | null)?.tagName,
    );
    expect(activo).toBe("BODY");
  });
});
