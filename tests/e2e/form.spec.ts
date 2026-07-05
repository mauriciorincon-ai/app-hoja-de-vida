import { expect, test } from "@playwright/test";

test.describe("Formulario solicitar acceso", () => {
  test("validación inline: campos vacíos muestran errores y no navegan", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.locator("#contacto").scrollIntoViewIfNeeded();
    await page.locator("form[data-hydrated=true]").waitFor();
    await page.getByRole("button", { name: "Quiero probarla" }).click();

    // Scope al form: el route-announcer de Next también tiene role=alert
    await expect(page.locator("form").getByRole("alert")).toHaveCount(3);
    await expect(page).toHaveURL(/\/es$/);
  });

  test("honeypot lleno: el API responde 200 silencioso (negativo)", async ({
    request,
  }) => {
    const res = await request.post("/api/solicitar-acceso", {
      headers: { "x-forwarded-for": "203.0.113.7" },
      data: {
        nombre: "Bot",
        email: "bot@spam.example",
        app: "hoja-de-vida",
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
      app: "idea-exploracion-2",
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
