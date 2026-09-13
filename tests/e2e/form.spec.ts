import { expect, test } from "@playwright/test";

test.describe("Formulario de contacto (antes «solicitar acceso»)", () => {
  test("validación inline: campos vacíos muestran errores y no navegan", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.locator("#contacto").scrollIntoViewIfNeeded();
    await page.locator("form[data-hydrated=true]").waitFor();
    await page.getByRole("button", { name: "Enviar" }).click();

    // Scope al form: el route-announcer de Next también tiene role=alert.
    // Dos errores, no tres: el motivo es opcional (revisión post-S8, bloque E).
    await expect(page.locator("form").getByRole("alert")).toHaveCount(2);
    await expect(page).toHaveURL(/\/es$/);
  });

  test("el formulario general de la HOME pide un MOTIVO y no ofrece la lista de espera", async ({
    page,
  }) => {
    await page.goto("/es");
    const select = page.locator('form[data-formulario="motivo"] select');
    // «Elige un motivo» + proyecto · asesoría · capacitación · charla · rol
    await expect(select.locator("option")).toHaveCount(6);
    await expect(select.locator('option[value="lista-de-espera"]')).toHaveCount(
      0,
    );
  });

  test("lista de espera de apps (vitrina): «otra» nunca sobra, y envía", async ({
    page,
  }) => {
    await page.goto("/es/vitrina/apps");
    const form = page.locator('form[data-formulario="app"]');
    await form.scrollIntoViewIfNeeded();
    await page
      .locator('form[data-formulario="app"][data-hydrated=true]')
      .waitFor();
    await form.getByLabel("Tu nombre").fill("E2E Espera");
    await form.getByLabel("Tu correo").fill("espera@example.com");
    await form.getByLabel("¿Qué app te interesa?").selectOption("otra");
    await form.getByRole("button", { name: "Enviar" }).click();
    await expect(page).toHaveURL(/\/es\/solicitud-enviada/);
  });

  test("honeypot lleno: el API responde 200 silencioso (negativo)", async ({
    request,
  }) => {
    const res = await request.post("/api/solicitar-acceso", {
      headers: { "x-forwarded-for": "203.0.113.7" },
      data: {
        nombre: "Bot",
        email: "bot@spam.example",
        motivo: "rol",
        mensaje: "spam",
        website: "http://spam.example",
      },
    });
    expect(res.status()).toBe(200);
  });

  test("rate limit: la 6ª solicitud del mismo IP recibe 429 (negativo)", async ({
    request,
  }, testInfo) => {
    const data = {
      nombre: "Rate Tester",
      email: "rate@example.com",
      motivo: "charla",
      mensaje: "",
      website: "",
    };
    // IP distinta por proyecto: el server comparte estado entre proyectos
    const ip =
      testInfo.project.name === "mobile" ? "203.0.113.99" : "203.0.113.98";
    const headers = { "x-forwarded-for": ip };

    for (let i = 0; i < 5; i++) {
      const res = await request.post("/api/solicitar-acceso", {
        headers,
        data,
      });
      expect(res.status()).toBe(200);
    }
    const sexta = await request.post("/api/solicitar-acceso", {
      headers,
      data,
    });
    expect(sexta.status()).toBe(429);
  });
});
