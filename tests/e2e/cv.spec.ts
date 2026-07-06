import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

const cvEs = parse(readFileSync("data/cv.es.yaml", "utf8")) as {
  identidad: { nombreCompleto?: string; nombre: string };
  trayectoria: { bullets?: string[] }[];
};
const nombreCompleto = cvEs.identidad.nombreCompleto ?? cvEs.identidad.nombre;
const primerBullet = cvEs.trayectoria.find((t) => t.bullets?.length)
  ?.bullets?.[0];

test.describe("/cv imprimible + PDF ATS descargable", () => {
  test("la ruta /cv muestra la hoja de vida completa desde los YAML", async ({
    page,
  }) => {
    await page.goto("/es/cv");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Hoja de vida",
    );
    await expect(page.getByText(nombreCompleto)).toBeVisible();
    if (primerBullet) {
      await expect(page.getByText(primerBullet)).toBeVisible();
    }
  });

  test("el contenido de /cv está en el HTML estático (gate ATS/SEO)", async ({
    request,
  }) => {
    for (const locale of ["es", "en"]) {
      const res = await request.get(`/${locale}/cv`);
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toContain(nombreCompleto);
    }
  });

  test("el link de descarga entrega un PDF real (200, application/pdf, > 0 bytes)", async ({
    page,
    request,
  }) => {
    await page.goto("/es/cv");
    const enlace = page.getByRole("link", { name: /Descargar CV/ }).first();
    const href = await enlace.getAttribute("href");
    expect(href).toBeTruthy();

    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");
    expect((await res.body()).byteLength).toBeGreaterThan(1000);
  });

  test("el PDF del otro idioma también existe (EN)", async ({ request }) => {
    const res = await request.get("/cv/Henry-Rincon-CV-EN.pdf");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");
  });
});
