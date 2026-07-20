import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * E2e del chat (S3). El server corre con CHAT_PROVIDER=mock (respuesta
 * determinista con cita [1]); el fallback y el rate limit se fuerzan
 * interceptando /api/chat con las MISMAS respuestas que produce el server
 * real (503 fallback / 429) — nunca se llama a un proveedor real.
 */

async function abrirChat(page: Page) {
  await page.getByTestId("chat-launcher").click();
  await expect(page.getByTestId("chat-panel")).toBeVisible();
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
    await fuente.click();
    await expect(page).toHaveURL(/\/es\/proyectos\/vesting/, {
      timeout: 15_000,
    });
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
    // Fuentes del índice EN (títulos en inglés) apuntando a la ruta EN
    const fuente = page.getByTestId("chat-fuente").first();
    await expect(fuente).toHaveAttribute("href", /^\/en/);
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

    // El foco aterriza en el input; una sugerencia responde al teclado
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
