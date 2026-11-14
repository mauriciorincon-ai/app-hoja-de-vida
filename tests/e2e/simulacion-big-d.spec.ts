import { expect, test } from "@playwright/test";

/**
 * Humo de la simulación de Big-D (PR de contenido, S10 de su casa): la demo trae
 * su propia CSP por `<meta>` (`worker-src 'self'`) y un Worker bajo
 * `/piezas/big-d/`. Esto comprueba, en el build de producción de CV Viva y en
 * los dos idiomas, que el marco abre, que el Worker arranca, que los pesos
 * recalculan y que la consola no muestra un solo error (la CSP, si algo la
 * viola, lo dice ahí).
 */
for (const [l, neutralidadIgual] of [
  ["es", /Misma huella/],
  ["en", /Same signature/],
] as const) {
  test(`/${l}/portafolio/apps/big-d/simulacion: el marco abre, el Worker arranca y los pesos recalculan, sin errores de consola`, async ({
    page,
  }) => {
    const errores: string[] = [];
    // El script de Vercel Analytics solo existe en Vercel: en local da 404 en todas las páginas
    // (también en planlang). Es del sitio, no de la demo ni de su CSP; se descarta por su URL.
    const analitica = new Set<string>();
    page.on("response", (r) => {
      if (r.status() >= 400 && r.url().includes("/_vercel/"))
        analitica.add(r.url());
      else if (r.status() >= 400) errores.push(`${r.status()} ${r.url()}`);
    });
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      // «Failed to load resource» no trae URL: las respuestas fallidas ya se anotaron arriba.
      if (m.text().startsWith("Failed to load resource")) return;
      errores.push(m.text());
    });
    page.on("pageerror", (e) => errores.push(e.message));

    await page.goto(`/${l}/portafolio/apps/big-d/simulacion`);
    await page.locator('[data-cta="abrir-simulacion"]').click();

    const marco = page.frameLocator("iframe[data-marco-simulacion]");
    await expect(marco.locator("#demo")).toHaveAttribute("data-idioma", l);

    // El botón nace deshabilitado: se habilita cuando el Worker contestó.
    const neutralidad = marco.locator("#neutralidad");
    await expect(neutralidad).toBeEnabled({ timeout: 15_000 });

    // Los pesos recalculan: mover uno cambia la huella del resultado.
    const huella = marco.locator("#huella");
    const antes = (await huella.textContent())!.trim();
    await marco.locator("#peso-crit-gobierno").fill("5000");
    await expect(huella).not.toHaveText(antes, { timeout: 10_000 });

    // Probar la neutralidad: reordenar las plataformas no cambia la huella.
    await neutralidad.click();
    await expect(marco.locator("#neutralidad-veredicto")).toContainText(
      neutralidadIgual,
    );

    expect(errores, `errores de consola:\n${errores.join("\n")}`).toEqual([]);
  });
}
