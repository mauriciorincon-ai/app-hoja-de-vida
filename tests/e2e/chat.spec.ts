import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * E2e del chat (S3). El server corre con CHAT_PROVIDER=mock (respuesta
 * determinista con cita [1]); el fallback y el rate limit se fuerzan
 * interceptando /api/chat con las MISMAS respuestas que produce el server
 * real (503 fallback / 429) — nunca se llama a un proveedor real.
 */

/**
 * Abre el chat y CRUZA LA PUERTA (ADR-024): nombre, correo, aviso, código.
 * El server corre con almacén en memoria y CHAT_CODIGO_PRUEBA=246810, así que
 * el flujo es el real (dos endpoints, cookie httpOnly) sin correo de por medio.
 * La cookie dura 30 días: en la misma página, abrir otra vez ya no pide nada.
 */
async function abrirChat(page: Page) {
  await page.getByTestId("chat-launcher").click();
  await expect(page.getByTestId("chat-panel")).toBeVisible();
  const puerta = page.getByTestId("chat-registro");
  const input = page.getByTestId("chat-input");
  await expect(puerta.or(input)).toBeVisible();
  if (await puerta.isVisible()) {
    // Un correo por prueba: los workers comparten el almacén en memoria y el
    // código se CONSUME al verificar — con el mismo correo, dos pruebas en
    // paralelo se pisarían el código (una entraría y la otra vería «sin_codigo»).
    await registrarse(page, { nombre: "Ana Prueba", email: correoUnico() });
  }
}

const correoUnico = () =>
  `ana-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}@prueba.co`;

async function registrarse(
  page: Page,
  { nombre, email }: { nombre: string; email: string },
) {
  await page.getByTestId("chat-registro-nombre").fill(nombre);
  await page.getByTestId("chat-registro-email").fill(email);
  await page.getByTestId("chat-registro-acepta").check();
  await page.getByTestId("chat-registro-enviar").click();
  await expect(page.getByTestId("chat-registro-codigo")).toBeVisible();
  await page.getByTestId("chat-registro-input-codigo").fill("246810");
  await page.getByTestId("chat-registro-verificar").click();
  await expect(page.getByTestId("chat-input")).toBeVisible();
}

async function preguntar(page: Page, texto: string) {
  await page.getByTestId("chat-input").fill(texto);
  await page.getByTestId("chat-enviar").click();
}

test.describe("chat — flujo estrella", () => {
  test("pregunta en /es → respuesta en streaming con cita que navega al case study", async ({
    page,
  }) => {
    await page.goto("/es");
    await abrirChat(page);

    // Disclaimer de transparencia visible desde el primer momento
    await expect(page.getByTestId("chat-panel")).toContainText(
      "puedo equivocarme",
    );

    await preguntar(page, "¿Qué hizo Henry en Vesting?");

    // Respuesta del mock en streaming, con su marca de cita [1]
    const respuesta = page.getByTestId("chat-mensaje-asistente").last();
    await expect(respuesta).toContainText("Microsoft Fabric", {
      timeout: 15_000,
    });
    await expect(respuesta).toContainText("[1]");

    // Cita navegable: el chip lleva a la página del case study
    const fuente = page
      .locator('[data-testid="chat-fuente"][href*="/proyectos/vesting"]')
      .first();
    await expect(fuente).toBeVisible();
    // El chip dice DE DÓNDE salió la frase y A DÓNDE lleva (decisión del
    // dueño, 2026-09-23): «[n] AF-09 · Vesting» o «[n] CV · Vesting», nunca
    // el título del fragmento. El título completo queda en el tooltip.
    await expect(fuente).toHaveText(
      /^\[\d+(, \d+)*\] (AF-\d{2}|CV) · Vesting$/,
    );
    await expect(fuente).toHaveAttribute("title", /.+/);

    // UN chip por documento y destino (2026-09-26): dos fragmentos del mismo
    // documento pintaban dos chips idénticos («[3] AF-17 · Skills» «[4] AF-17
    // · Skills»). Ahora van juntos, con sus dos números: «[3, 4] AF-17 · …».
    const chips = (
      await respuesta.getByTestId("chat-fuente").allTextContents()
    ).map((t) => t.replace(/^\[[^\]]+\] /, ""));
    expect(new Set(chips).size, `chips repetidos: ${chips.join(" | ")}`).toBe(
      chips.length,
    );
    await fuente.click();
    await expect(page).toHaveURL(/\/es\/proyectos\/vesting/, {
      timeout: 15_000,
    });

    // La cita lleva a la evidencia y DEVUELVE al chat: la conversación tiene
    // que seguir ahí al reabrir. Con un <a> corriente la página se recargaba
    // entera y el visitante volvía a un panel vacío (hallado por el dueño en
    // producción, 2026-09-23, gate ⭐ f1). Navegación del lado cliente: el
    // lanzador vive en el layout y el panel solo se oculta, no se destruye.
    await page.getByTestId("chat-launcher").click();
    await expect(page.getByTestId("chat-panel")).toBeVisible();
    await expect(
      page.getByTestId("chat-mensaje-asistente").last(),
    ).toContainText("Microsoft Fabric");
  });

  test("en /en el panel y las fuentes salen en inglés", async ({ page }) => {
    await page.goto("/en");
    await abrirChat(page);
    await expect(page.getByTestId("chat-panel")).toContainText(
      "I can make mistakes",
    );

    await preguntar(page, "What did Henry build at Vesting?");
    await expect(
      page.getByTestId("chat-mensaje-asistente").last(),
    ).toContainText("[1]", { timeout: 15_000 });
    // Fuentes del índice EN apuntando a la ruta EN, con el destino en inglés
    // («Career», «Profile»…) o un nombre propio («Vesting»).
    const fuente = page.getByTestId("chat-fuente").first();
    await expect(fuente).toHaveAttribute("href", /^\/en/);
    await expect(fuente).toHaveText(
      /^\[\d+(, \d+)*\] (AF-\d{2}|CV|APP|FT) · .+$/,
    );
    await expect(fuente).not.toHaveText(/In depth|A fondo/);
  });

  test("pregunta off-topic → respuesta estática elegante (sin proveedor)", async ({
    page,
  }) => {
    await page.goto("/es");
    await abrirChat(page);
    await preguntar(page, "cuéntame un chiste de gatos");
    await expect(
      page.getByTestId("chat-mensaje-asistente").last(),
    ).toContainText("Ese tema se me escapa", { timeout: 15_000 });
  });

  test("teclado end-to-end: abrir, preguntar con sugerencia y cerrar con Escape", async ({
    page,
  }) => {
    await page.goto("/es");

    // Abrir con teclado
    await page.getByTestId("chat-launcher").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("chat-panel")).toBeVisible();

    // Con la puerta (ADR-024) el foco aterriza en el primer campo del
    // registro; cruzada la puerta, en el input del chat.
    await expect(page.getByTestId("chat-registro-nombre")).toBeFocused();
    await registrarse(page, { nombre: "Ana Prueba", email: correoUnico() });
    await expect(page.getByTestId("chat-input")).toBeFocused();
    await page.getByRole("button", { name: "¿Qué hizo en Vesting?" }).click();
    await expect(
      page.getByTestId("chat-mensaje-asistente").last(),
    ).toContainText("[1]", { timeout: 15_000 });

    // Escape cierra y devuelve el foco al lanzador
    await page.getByTestId("chat-input").focus();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("chat-panel")).toBeHidden();
    await expect(page.getByTestId("chat-launcher")).toBeFocused();
  });
});

test.describe("chat — la puerta", () => {
  // Pedido del dueño (2026-09-24): junto a «Pedir otro código», una forma de
  // avisar que algo no funciona, sin salir del panel. En e2e el correo es
  // simulado (RESEND_API_KEY vacío), así que el aviso termina en el log.
  test("¿no llega el código? el visitante avisa desde el panel", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.getByTestId("chat-launcher").click();
    const email = correoUnico();
    await page.getByTestId("chat-registro-nombre").fill("Ana Prueba");
    await page.getByTestId("chat-registro-email").fill(email);
    await page.getByTestId("chat-registro-acepta").check();
    await page.getByTestId("chat-registro-enviar").click();
    await expect(page.getByTestId("chat-registro-codigo")).toBeVisible();

    await page.getByTestId("chat-problema-abrir").click();
    await expect(page.getByTestId("chat-problema-detalle")).toBeFocused();
    await page
      .getByTestId("chat-problema-detalle")
      .fill("El código no me llega al correo.");
    await page.getByTestId("chat-problema-enviar").click();
    await expect(page.getByTestId("chat-problema-enviado")).toContainText(
      email,
    );
    // El aviso no bloquea el camino: el código se puede seguir escribiendo.
    await expect(page.getByTestId("chat-registro-input-codigo")).toBeEnabled();
  });
});

test.describe("chat — degradación honesta", () => {
  test("proveedor caído (503) → búsqueda local con aviso y fuentes del índice", async ({
    page,
  }) => {
    // Misma respuesta que da el server real sin API key o con breaker abierto
    await page.route("**/api/chat", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "fallback" }),
      }),
    );

    await page.goto("/es");
    await abrirChat(page);
    await preguntar(page, "¿Qué certificaciones de Microsoft tiene Henry?");

    // Aviso honesto + badge de modo + resultados de la búsqueda local
    // (el índice se fetchea lazy en este momento)
    const respuesta = page.getByTestId("chat-mensaje-asistente").last();
    await expect(respuesta).toContainText("no está disponible", {
      timeout: 15_000,
    });
    await expect(page.getByTestId("chat-modo-fallback")).toBeVisible();
    await expect(page.getByTestId("chat-fuente").first()).toBeVisible();

    // El chat NUNCA muere: la siguiente pregunta se responde local, sin red
    await preguntar(page, "¿Qué hizo en Banco Pichincha?");
    await expect(
      page.getByTestId("chat-mensaje-asistente").last(),
    ).toContainText("Pichincha", { timeout: 15_000 });
  });

  test("rate limit (429) → aviso amable sin romper la conversación", async ({
    page,
  }) => {
    await page.route("**/api/chat", (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ error: "rate_limited" }),
      }),
    );

    await page.goto("/es");
    await abrirChat(page);
    await preguntar(page, "¿Qué hizo Henry en Vesting?");
    await expect(page.getByTestId("chat-rate-limited")).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe("chat — a11y y reduced-motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("axe AA limpio con el panel abierto y una respuesta renderizada", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/es");
    await abrirChat(page);
    await preguntar(page, "¿Qué hizo Henry en Vesting?");
    await expect(
      page.getByTestId("chat-mensaje-asistente").last(),
    ).toContainText("[1]", { timeout: 15_000 });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("con reduced-motion el panel abre visible y en estado final", async ({
    page,
  }) => {
    await page.goto("/es");
    await abrirChat(page);
    const opacity = await page
      .getByTestId("chat-panel")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  });
});

test.describe("chat — la puerta (ADR-024)", () => {
  test("sin registrarse no hay chat: el panel abre en el formulario y un código equivocado no entra", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.getByTestId("chat-launcher").click();
    await expect(page.getByTestId("chat-registro")).toBeVisible();
    await expect(page.getByTestId("chat-input")).toHaveCount(0);

    // El botón no se activa sin el aviso de datos marcado
    await page.getByTestId("chat-registro-nombre").fill("Ana Prueba");
    await page.getByTestId("chat-registro-email").fill(correoUnico());
    await expect(page.getByTestId("chat-registro-enviar")).toBeDisabled();
    await page.getByTestId("chat-registro-acepta").check();
    await page.getByTestId("chat-registro-enviar").click();

    // Paso 2: el aviso de correo simulado (no hay RESEND en e2e) y el código malo
    await expect(page.getByTestId("chat-registro-codigo")).toBeVisible();
    await expect(page.getByTestId("chat-registro-simulado")).toBeVisible();
    await page.getByTestId("chat-registro-input-codigo").fill("000000");
    await page.getByTestId("chat-registro-verificar").click();
    await expect(page.getByTestId("chat-registro-error")).toContainText(
      "no coincide",
    );
    await expect(page.getByTestId("chat-input")).toHaveCount(0);

    // El bueno entra, saluda por el nombre y la cookie sobrevive a recargar
    await page.getByTestId("chat-registro-input-codigo").fill("246810");
    await page.getByTestId("chat-registro-verificar").click();
    await expect(page.getByTestId("chat-saludo")).toContainText("Ana Prueba");
    await page.reload();
    await page.getByTestId("chat-launcher").click();
    await expect(page.getByTestId("chat-input")).toBeVisible();
    await expect(page.getByTestId("chat-registro")).toHaveCount(0);
  });

  test("el endpoint del chat sin cookie responde 401 registro_requerido", async ({
    request,
  }) => {
    const res = await request.post("/api/chat", {
      data: {
        locale: "es",
        messages: [{ role: "user", content: "¿Qué hizo Henry en Vesting?" }],
      },
    });
    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ error: "registro_requerido" });
  });
});
