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
      /^\[\d+(, \d+)*\] (AF-\d{2}|CV|APP|FT|T\d) · .+$/,
    );
    await expect(fuente).not.toHaveText(/In depth|A fondo/);
  });

  // «Métodos» (S10, F3; T3 en el S11, T4 en el S12, T6 en el S13, T7 en el S15, T1 en el S16, T5 en el S17, T9 en el S18): el chat cita la publicación, bloque a
  // bloque. Cada pieza trae la primera de sus preguntas del banco; el chip dice el
  // código del tema y el nombre de la pieza, y la cita lleva al BLOQUE, no a la página.
  for (const [slug, codigo, idioma, pregunta, nombre] of [
    ["sistema-de-agentes", "T2", "es", "¿Cómo estructura Henry un sistema multiagente?", "Cómo se debe estructurar un sistema de agentes"],
    ["sistema-de-agentes", "T2", "en", "How does Henry structure a multi-agent system?", "How an agent system should be structured"],
    ["rag-sin-inventar", "T3", "es", "¿Cómo evita el chat de Henry inventar respuestas?", "Cómo se debe lograr que un LLM responda con los datos de la empresa y no invente"],
    ["rag-sin-inventar", "T3", "en", "How does Henry's chat avoid making up answers?", "How an LLM should be made to answer with the company’s data, without making things up"],
    ["de-prototipo-a-produccion", "T4", "es", "¿Cómo lleva Henry una aplicación de IA a producción?", "Cómo se debe llevar un prototipo de IA a producción y mantenerlo"],
    ["de-prototipo-a-produccion", "T4", "en", "How does Henry take an AI application to production?", "How an AI prototype should be taken to production and kept running"],
    ["ciclo-de-vida-de-datos", "T6", "es", "¿Qué diferencias ve Henry entre Fabric y Databricks?", "Cómo se debe estructurar el ciclo de vida de un proyecto de datos a escala"],
    ["ciclo-de-vida-de-datos", "T6", "en", "What differences does Henry see between Fabric and Databricks?", "How the life cycle of a data project at scale should be structured"],
    ["bi-que-se-usa", "T7", "es", "¿Cómo diseña Henry un modelo semántico en Power BI?", "Cómo se debe diseñar una solución de BI que la gente sí use"],
    ["bi-que-se-usa", "T7", "en", "How does Henry design a semantic model in Power BI?", "How a BI solution people actually use should be designed"],
    ["ia-en-la-organizacion", "T1", "es", "¿Cómo llevaría Henry la IA a una empresa que apenas empieza?", "Cómo se debe llevar la IA a una organización"],
    ["ia-en-la-organizacion", "T1", "en", "How would Henry bring AI to a company that is just starting out?", "How AI should be brought into an organization"],
    ["gobierno-de-ia-y-datos", "T5", "es", "¿Cómo evalúa Henry el impacto de un sistema de IA?", "Cómo se deben gobernar la IA y los datos"],
    ["gobierno-de-ia-y-datos", "T5", "en", "How does Henry assess the impact of an AI system?", "How AI and data should be governed"],
    ["de-proceso-a-operacion", "T9", "es", "¿Cómo decide Henry qué automatizar y con qué herramienta?", "Cómo se debe convertir un proceso en una operación inteligente"],
    ["de-proceso-a-operacion", "T9", "en", "How does Henry decide what to automate and with which tool?", "How a process should be turned into an intelligent operation"],
  ] as const) {
    test(`la cita de ${codigo} lleva al bloque exacto (${idioma})`, async ({
      page,
    }) => {
      await page.goto(`/${idioma}`);
      await abrirChat(page);
      await preguntar(page, pregunta);

      const chip = page
        .locator(
          `[data-testid="chat-fuente"][href*="/${idioma}/metodos/${slug}#bloque-"]`,
        )
        .first();
      await expect(chip).toBeVisible({ timeout: 15_000 });
      await expect(chip).toHaveText(
        new RegExp(`^\\[\\d+(, \\d+)*\\] ${codigo} · ${nombre}$`),
      );

      const href = (await chip.getAttribute("href"))!;
      const bloque = href.match(/#bloque-(\d+)$/)![1];
      await chip.click();
      await expect(page).toHaveURL(
        new RegExp(`/${idioma}/metodos/${slug}#bloque-${bloque}$`),
        { timeout: 15_000 },
      );
      // Aterriza en el bloque que la cita nombra, con su título a la vista.
      await expect(page.locator(`#bloque-${bloque}-titulo`)).toBeInViewport();
    });
  }

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

test.describe("chat — el cupo de cada persona (2026-09-26)", () => {
  // El conteo real lo prueban la integración y Postgres (chat-cupo.dbtest.ts);
  // aquí, lo que VE el visitante con cada respuesta del servidor.
  for (const [error, status, testId, texto] of [
    ["tope_diario", 429, "chat-tope-diario", "máximo de preguntas de hoy"],
    ["bloqueado", 403, "chat-bloqueado", "no tiene acceso al chat"],
  ] as const) {
    test(`${status} ${error} → su aviso, sin caer a la búsqueda local`, async ({
      page,
    }) => {
      await page.goto("/es");
      await abrirChat(page);
      await page.route("**/api/chat", (route) =>
        route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify({ error }),
        }),
      );
      await preguntar(page, "¿Qué hizo Henry en Vesting?");
      await expect(page.getByTestId(testId)).toContainText(texto, {
        timeout: 15_000,
      });
      await expect(page.getByTestId("chat-modo-fallback")).toHaveCount(0);
      await expect(page.getByTestId("chat-rate-limited")).toHaveCount(0);
    });
  }

  test("un correo bloqueado no recibe código: el registro lo dice", async ({
    page,
  }) => {
    await page.route("**/api/chat/registro", (route) =>
      route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ error: "bloqueado" }),
      }),
    );
    await page.goto("/es");
    await page.getByTestId("chat-launcher").click();
    await page.getByTestId("chat-registro-nombre").fill("Ana Prueba");
    await page.getByTestId("chat-registro-email").fill(correoUnico());
    await page.getByTestId("chat-registro-acepta").check();
    await page.getByTestId("chat-registro-enviar").click();
    await expect(page.getByTestId("chat-registro-error")).toContainText(
      "no tiene acceso al chat",
    );
    await expect(page.getByTestId("chat-registro-codigo")).toHaveCount(0);
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
