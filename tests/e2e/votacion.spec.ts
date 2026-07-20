import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

/**
 * Votación del roadmap (S4). Dos gates de producto:
 *  - BD caída forzada ⇒ aviso honesto + botones deshabilitados (NUNCA un
 *    contador inventado). Corre siempre (intercepta el GET con 503).
 *  - Votar sube el contador REAL. Corre contra Postgres real (Supabase local);
 *    se salta si no hay SUPABASE_URL en el entorno del runner.
 */

type AppEntry = { id: string; roadmap?: { id: string }[] };
const { apps } = parse(readFileSync("data/apps.yaml", "utf8")) as {
  apps: AppEntry[];
};
const features = apps.flatMap((a) =>
  (a.roadmap ?? []).map((f) => ({ app: a.id, feature: f.id })),
);

// "3 votos" / "1 voto" / "sin votos aún" → número (0 si no hay dígitos)
function parseConteo(texto: string | null): number {
  const m = texto?.match(/\d+/);
  return m ? Number(m[0]) : 0;
}

test.describe("Votación del roadmap", () => {
  test("BD caída forzada: aviso honesto + botones deshabilitados", async ({
    page,
  }) => {
    // Fuerza el 503 del conteo (mismo código que emite el server sin BD)
    await page.route("**/api/roadmap/votos", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "unavailable" }),
      }),
    );

    await page.goto("/es");
    await page.locator("#roadmap").scrollIntoViewIfNeeded();

    // Aviso honesto visible
    await expect(page.getByText(/votación no está disponible/i)).toBeVisible();

    // Todos los botones de voto deshabilitados — jamás un contador falso
    const botones = page.locator('#roadmap [data-testid="roadmap-votar"]');
    const n = await botones.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      await expect(botones.nth(i)).toBeDisabled();
    }
    // No hay ningún número de conteo (solo el guion "—")
    await expect(
      page.locator('#roadmap [data-testid="roadmap-conteo"]').first(),
    ).toHaveText("—");
  });

  test("votar sube el contador REAL (Postgres)", async ({ page }, testInfo) => {
    test.skip(
      !process.env.SUPABASE_URL,
      "sin Supabase configurado en el runner",
    );

    // Cada test×proyecto vota una feature DISTINTA: con fullyParallel corren a
    // la vez, y sin escrituras concurrentes a la misma fila el delta antes→
    // después es exactamente 1 (patrón strict-mode por-proyecto, supabase-en-ci
    // #5). "votar sube" usa features 0/1; "segundo voto" usa 2/3.
    const idx = testInfo.project.name === "mobile" ? 1 : 0;
    const objetivo = features[idx] ?? features[0];

    await page.goto("/es");
    await page.locator("#roadmap").scrollIntoViewIfNeeded();

    const fila = page.locator(
      `#roadmap [data-feature-id="${objetivo.feature}"][data-app-id="${objetivo.app}"]`,
    );
    const boton = fila.locator('[data-testid="roadmap-votar"]');
    const conteoEl = fila.locator('[data-testid="roadmap-conteo"]');

    // Votación disponible: el botón se habilita cuando cargaron los conteos
    await expect(boton).toBeEnabled({ timeout: 15_000 });
    await expect(conteoEl).not.toHaveText(/cargando/i);
    const antes = parseConteo(await conteoEl.textContent());

    await boton.click();

    // El botón pasa a "Ya votaste" y el conteo sube en 1 (valor real de la BD)
    await expect(boton).toHaveText(/Ya votaste/);
    await expect
      .poll(async () => parseConteo(await conteoEl.textContent()))
      .toBe(antes + 1);
  });

  test("segundo voto a la misma feature: rechazado (dedup por navegador)", async ({
    page,
  }, testInfo) => {
    test.skip(
      !process.env.SUPABASE_URL,
      "sin Supabase configurado en el runner",
    );
    // Features 2/3: distintas de las que usa "votar sube" (0/1), sin colisión.
    const idx = testInfo.project.name === "mobile" ? 3 : 2;
    const objetivo = features[idx] ?? features[0];

    await page.goto("/es");
    await page.locator("#roadmap").scrollIntoViewIfNeeded();
    const fila = page.locator(
      `#roadmap [data-feature-id="${objetivo.feature}"][data-app-id="${objetivo.app}"]`,
    );
    const boton = fila.locator('[data-testid="roadmap-votar"]');
    await expect(boton).toBeEnabled({ timeout: 15_000 });

    await boton.click();
    await expect(boton).toHaveText(/Ya votaste/);
    // El botón queda deshabilitado: no se puede votar dos veces
    await expect(boton).toBeDisabled();
  });
});
