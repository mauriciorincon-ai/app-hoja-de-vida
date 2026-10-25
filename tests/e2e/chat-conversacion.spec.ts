import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * E2e de la conversación que no se pierde (S24, OM-14 y OM-15). El server
 * corre con el proveedor mock (respuesta con cita) y la puerta encendida con
 * almacén en memoria y código fijo, así que el flujo es el real.
 *
 * Recargar, seguir un enlace plano del menú y cambiar de idioma desmontan el
 * lanzador: lo que las pruebas comprueban es que la conversación vuelve y que
 * el panel, si estaba abierto, se reabre SIN tomar el foco (ningún código del
 * sitio roba el foco al cargar: `teclado.spec.ts`).
 */

const correoUnico = () =>
  `ana-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}@prueba.co`;

/** Abre el chat y cruza la puerta si la hay (la cookie dura 30 días). */
async function abrirChat(page: Page) {
  await page.getByTestId("chat-launcher").click();
  await expect(page.getByTestId("chat-panel")).toBeVisible();
  const puerta = page.getByTestId("chat-registro");
  const input = page.getByTestId("chat-input");
  await expect(puerta.or(input)).toBeVisible();
  if (await puerta.isVisible()) {
    await page.getByTestId("chat-registro-nombre").fill("Ana Prueba");
    await page.getByTestId("chat-registro-email").fill(correoUnico());
    await page.getByTestId("chat-registro-acepta").check();
    await page.getByTestId("chat-registro-enviar").click();
    await expect(page.getByTestId("chat-registro-codigo")).toBeVisible();
    await page.getByTestId("chat-registro-input-codigo").fill("246810");
    await page.getByTestId("chat-registro-verificar").click();
    await expect(input).toBeVisible();
  }
}

async function preguntar(page: Page, texto: string) {
  await page.getByTestId("chat-input").fill(texto);
  await page.getByTestId("chat-enviar").click();
}

/**
 * Una pregunta contestada Y GUARDADA. La respuesta se guarda al terminar el
 * stream, no a cada trozo: recargar a mitad de una respuesta deja la pregunta
 * y pierde lo que faltaba. Por eso se espera a que el almacén tenga el texto
 * completo antes de recargar o navegar.
 */
async function conversar(page: Page) {
  await abrirChat(page);
  await preguntar(page, "¿Qué hizo Henry en Vesting?");
  await expect(
    page.getByTestId("chat-mensaje-asistente").last(),
  ).toContainText("Microsoft Fabric", { timeout: 15_000 });
  await expect
    .poll(
      () => page.evaluate(() => localStorage.getItem("cv-viva:chat:v1") ?? ""),
      { timeout: 15_000, message: "la respuesta terminada queda guardada" },
    )
    .toContain("agentes de IA en producción");
}

const conversacionVisible = async (page: Page) => {
  await expect(page.getByTestId("chat-panel")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId("chat-mensaje-usuario").first()).toContainText(
    "Vesting",
  );
  await expect(page.getByTestId("chat-mensaje-asistente").last()).toContainText(
    "Microsoft Fabric",
  );
};

test.describe("chat — la conversación sobrevive a la navegación (OM-14)", () => {
  test("recargar conserva la conversación, reabre el panel y NO roba el foco", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/es");
    await conversar(page);

    await page.reload();
    await conversacionVisible(page);
    // El foco es del visitante: un panel que se reabre solo no lo toma.
    await expect(page.getByTestId("chat-input")).not.toBeFocused();
    expect(
      await page.evaluate(() => document.activeElement?.tagName),
      "al cargar nadie tiene el foco",
    ).toBe("BODY");

    // En cuanto el visitante toca el lanzador, abrir SÍ enfoca (comportamiento de siempre).
    await page.getByTestId("chat-launcher").click(); // cierra
    await expect(page.getByTestId("chat-panel")).toBeHidden();
    await page.getByTestId("chat-launcher").click(); // abre
    await expect(page.getByTestId("chat-input")).toBeFocused();
  });

  test("sin sesión, el panel que se reabre solo muestra la puerta y tampoco roba el foco", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/es");
    await page.getByTestId("chat-launcher").click();
    await expect(page.getByTestId("chat-registro")).toBeVisible();

    await page.reload();
    // La puerta vuelve a pintarse, pero el cursor no salta al campo «Tu nombre».
    await expect(page.getByTestId("chat-registro")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("chat-registro-nombre")).not.toBeFocused();
    expect(
      await page.evaluate(() => document.activeElement?.tagName),
      "al cargar nadie tiene el foco",
    ).toBe("BODY");

    // Abierto por el visitante, el foco sí va al nombre (comportamiento de siempre).
    await page.getByTestId("chat-launcher").click(); // cierra
    await page.getByTestId("chat-launcher").click(); // abre
    await expect(page.getByTestId("chat-registro")).toBeVisible();
  });

  test("un panel cerrado queda cerrado tras recargar, pero la conversación sigue guardada", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/es");
    await conversar(page);
    await page.getByTestId("chat-launcher").click(); // cierra
    await expect(page.getByTestId("chat-panel")).toBeHidden();

    await page.reload();
    await expect(page.getByTestId("chat-panel")).toHaveCount(0);

    await page.getByTestId("chat-launcher").click();
    await conversacionVisible(page);
  });

  test("seguir un enlace plano del menú (carga completa) no reinicia el chat", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile",
      "el menú móvil va tras un botón",
    );
    test.slow();
    await page.goto("/es");
    await conversar(page);

    await page
      .getByRole("navigation", { name: "Secciones" })
      .getByRole("link", { name: "Métodos", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/es\/metodos/);
    await conversacionVisible(page);
  });

  test("cambiar de idioma conserva la conversación", async ({ page }) => {
    test.slow();
    await page.goto("/es");
    await conversar(page);

    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(/\/en/);
    await conversacionVisible(page);
  });

  test("«Borrar conversación» vacía el chat, lo avisa y no vuelve al recargar", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/es");
    await conversar(page);
    await expect(page.getByTestId("chat-guardado-nota")).toContainText(
      "8 horas",
    );

    await page.getByTestId("chat-borrar").click();
    await expect(page.getByTestId("chat-mensaje-usuario")).toHaveCount(0);
    await expect(page.getByTestId("chat-borrado")).toContainText(
      "borrada de este navegador",
    );
    await expect(page.getByTestId("chat-borrado")).toContainText("Ley 1581");
    await expect(page.getByTestId("chat-borrar")).toHaveCount(0);

    await page.reload();
    await expect(page.getByTestId("chat-panel")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("chat-input")).toBeVisible();
    await expect(page.getByTestId("chat-mensaje-usuario")).toHaveCount(0);
  });

  test("una conversación de hace 9 horas no se restaura: el chat arranca vacío", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/es");
    await conversar(page);

    await page.evaluate(() => {
      const clave = "cv-viva:chat:v1";
      const guardado = JSON.parse(localStorage.getItem(clave) ?? "null");
      guardado.ultimo = Date.now() - 9 * 60 * 60 * 1000;
      localStorage.setItem(clave, JSON.stringify(guardado));
    });
    await page.reload();
    await expect(page.getByTestId("chat-input")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("chat-mensaje-usuario")).toHaveCount(0);
    expect(
      await page.evaluate(() => localStorage.getItem("cv-viva:chat:v1")),
      "lo vencido se borra al leerlo",
    ).toBeNull();
  });

  test("un almacén dañado se ignora: el chat arranca vacío y sigue respondiendo", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/es");
    await page.evaluate(() => {
      localStorage.setItem("cv-viva:chat:v1", "{esto no es un guardado válido");
    });
    await page.reload();
    await abrirChat(page);
    await expect(page.getByTestId("chat-mensaje-usuario")).toHaveCount(0);
    await preguntar(page, "¿Qué hizo Henry en Vesting?");
    await expect(
      page.getByTestId("chat-mensaje-asistente").last(),
    ).toContainText("Microsoft Fabric", { timeout: 15_000 });
  });

  test("si el navegador niega el almacenamiento, el chat responde igual (sin memoria)", async ({
    page,
  }) => {
    test.slow();
    await page.addInitScript(() => {
      const negar = () => {
        throw new DOMException("bloqueado", "SecurityError");
      };
      Object.defineProperty(window, "localStorage", { get: negar });
      Object.defineProperty(window, "sessionStorage", { get: negar });
    });
    await page.goto("/es");
    await abrirChat(page);
    await preguntar(page, "¿Qué hizo Henry en Vesting?");
    await expect(
      page.getByTestId("chat-mensaje-asistente").last(),
    ).toContainText("agentes de IA en producción", { timeout: 15_000 });
    await page.reload();
    // Sin almacenamiento no hay qué restaurar, y la página no se rompe.
    await expect(page.getByTestId("chat-launcher")).toBeVisible();
    await expect(page.getByTestId("chat-panel")).toHaveCount(0);
  });
});

test.describe("chat — «Avisa a Henry» con la sesión abierta (OM-15)", () => {
  test("el aviso se abre desde el chat y se envía sin pedir el correo", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/es");
    await abrirChat(page);

    const pedidos: unknown[] = [];
    page.on("request", (r) => {
      if (r.url().endsWith("/api/chat/problema"))
        pedidos.push(r.postDataJSON());
    });

    await page.getByTestId("chat-problema-abrir").click();
    await page.getByTestId("chat-problema-detalle").fill("Se quedó pensando.");
    await page.getByTestId("chat-problema-enviar").click();
    await expect(page.getByTestId("chat-problema-enviado")).toContainText(
      "Henry recibió tu aviso",
      { timeout: 15_000 },
    );

    expect(pedidos).toHaveLength(1);
    expect(pedidos[0]).toMatchObject({
      paso: "chat",
      detalle: "Se quedó pensando.",
    });
    expect(Object.keys(pedidos[0] as object)).not.toContain("email");
  });

  test("también está a mano con una conversación en curso, en inglés", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/en");
    await abrirChat(page);
    await preguntar(page, "What did Henry build at Vesting?");
    await expect(
      page.getByTestId("chat-mensaje-asistente").last(),
    ).toContainText("[1]", { timeout: 15_000 });
    await expect(page.getByTestId("chat-problema-abrir")).toHaveText(
      "Something not working? Tell Henry",
    );
    await expect(page.getByTestId("chat-borrar")).toHaveText(
      "Delete conversation",
    );
  });
});

test.describe("chat — a11y del pie nuevo", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("axe AA limpio con «Borrar», el aviso abierto y la nota de guardado", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/es");
    await conversar(page);
    await page.getByTestId("chat-problema-abrir").click();
    await expect(page.getByTestId("chat-problema")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
