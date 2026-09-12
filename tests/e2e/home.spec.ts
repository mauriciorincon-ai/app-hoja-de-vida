import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";

// El orden de la HOME desde la revisión post-S7: la vitrina ocupa el sitio de
// «Proyectos», los estudios tienen sección propia, y el roadmap se fue con las
// apps a /vitrina/apps.
const SECTIONS = [
  "perfil",
  "trayectoria",
  "logros",
  "vitrina",
  "estudios",
  "certificaciones",
  "skills",
  "contacto",
];

// Los e2e leen el contenido real: editar data/*.yaml jamás rompe la suite
type RoadmapEntry = {
  id: string;
  titulo: { es: string; en: string };
};
type AppEntry = {
  id: string;
  estado: string;
  solicitable?: boolean;
  nombre: { es: string; en: string };
  roadmap?: RoadmapEntry[];
};
const cvEs = parse(readFileSync("data/cv.es.yaml", "utf8")) as {
  identidad: { nombre: string };
  trayectoria: { organizacion: string; bullets?: string[] }[];
};
const hitoConBullets = cvEs.trayectoria.find((t) => t.bullets?.length);
if (!hitoConBullets?.bullets) {
  throw new Error("cv.es.yaml sin bullets en la trayectoria");
}
const primerBullet = hitoConBullets.bullets[0];
const { apps } = parse(readFileSync("data/apps.yaml", "utf8")) as {
  apps: AppEntry[];
};
const nombre = cvEs.identidad.nombre;
const appSolicitable = apps.find((a) => a.solicitable !== false);
if (!appSolicitable) throw new Error("apps.yaml sin apps solicitables");

// Roadmap votable (S4): todas las (app, feature) con roadmap en el YAML
const featuresRoadmap = apps.flatMap((a) => a.roadmap ?? []);
const primeraFeature = featuresRoadmap[0];
if (!primeraFeature) throw new Error("apps.yaml sin features de roadmap");

test.describe("HOME — happy path del sprint", () => {
  test("carga, recorre secciones, cambia idioma y envía la solicitud", async ({
    page,
  }) => {
    await page.goto("/es");

    // Hero con identidad desde data/cv.es.yaml
    await expect(page.locator("h1")).toContainText(nombre);

    // La página está hidratada cuando el form montó su handler
    await page.locator("form[data-hydrated=true]").waitFor();

    // Scroll por todas las secciones — presentes y con heading
    for (const id of SECTIONS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(
        page.locator(`#${id} h2, #${id} [id$="-titulo"]`).first(),
      ).toBeAttached();
    }

    // La sección «Apps» se retiró: prometía lo mismo que la vitrina y no
    // enseñaba apps visitables. Su contenido no se perdió — las dos con
    // brochure se alcanzan desde «De esta casa» en /vitrina (brochure.spec),
    // y las dos exploraciones siguen siendo las opciones del formulario.
    await expect(page.locator("#apps")).toHaveCount(0);

    // Ni «Proyectos» ni «Roadmap» viven ya en la HOME: la vitrina asoma sus
    // cuatro frentes y el roadmap está con las apps (vitrina.spec lo vigila).
    await expect(page.locator("#proyectos")).toHaveCount(0);
    await expect(page.locator("#roadmap")).toHaveCount(0);
    await expect(page.locator("#vitrina [data-frente]")).toHaveCount(4);

    // Toggle de idioma (conserva la página, cambia la ruta) — timeout amplio:
    // bajo carga paralela la navegación client-side puede exceder los 5s
    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(/\/en$/, { timeout: 15_000 });
    await expect(page.locator("#trayectoria h2")).toHaveText("Career", {
      timeout: 15_000,
    });

    // Enviar un mensaje end-to-end (sin API key → envío simulado). Elegir una
    // app es opcional desde la revisión post-S8; aquí se elige una, que es la
    // ruta de la lista de espera.
    await page.locator("#contacto").scrollIntoViewIfNeeded();
    await page.locator("form[data-hydrated=true]").waitFor();
    await page.getByLabel("Your name").fill("E2E Tester");
    await page.getByLabel("Your email").fill("e2e@example.com");
    await page
      .getByLabel("Here for an app? (optional)")
      .selectOption(appSolicitable.id);
    await page.getByRole("button", { name: "Send" }).click();

    // Confirmación humana
    await expect(page).toHaveURL(/\/en\/solicitud-enviada/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "I got your message",
    );
  });

  test("el contenido completo está en el HTML estático (gate ATS/SEO)", async ({
    request,
  }) => {
    for (const locale of ["es", "en"]) {
      const res = await request.get(`/${locale}`);
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toContain(nombre);
      expect(html).toContain("application/ld+json");
      expect(html).toContain('hrefLang="es"');
      expect(html).toContain('hrefLang="en"');
      // Contenido de secciones sin ejecutar JS, en el idioma de la ruta. El
      // roadmap se fue a /vitrina/apps (su gate ATS está allá): lo que la HOME
      // sigue exigiendo en el HTML estático es la vitrina asomada con sus
      // cuatro frentes y los estudios recién nacidos como sección.
      expect(html).toContain('id="vitrina"');
      expect(html).toContain('id="estudios"');
      expect(html).toContain("Pontificia Universidad Javeriana");
    }
    // El grueso (capa 2) también vive en el HTML aunque nazca colapsado
    const res = await request.get("/es");
    expect(await res.text()).toContain(primerBullet);
  });

  test("disclosure del timeline: expande y contrae accesible por teclado", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.locator("form[data-hydrated=true]").waitFor();
    await page.locator("#trayectoria").scrollIntoViewIfNeeded();

    // Selector estable: el accessible name cambia al expandir ("Ver menos")
    const boton = page
      .locator('button[aria-controls^="hito-bullets-"]')
      .first();
    await expect(boton).toHaveText(/Ver logros completos/);
    await expect(boton).toHaveAttribute("aria-expanded", "false");

    // Expandir con click: los bullets quedan visibles
    await boton.click();
    await expect(boton).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(primerBullet)).toBeVisible();

    // Contraer con teclado (Enter sobre el botón enfocado)
    await boton.focus();
    await page.keyboard.press("Enter");
    await expect(boton).toHaveAttribute("aria-expanded", "false");
  });

  test("404 localizado para rutas desconocidas", async ({ page }) => {
    const res = await page.goto("/es/no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Esta página no existe",
    );
  });
});

test.describe("El roadmap vive con las apps (revisión post-S7)", () => {
  test("/vitrina/apps enseña una fila votable por feature, y la HOME ninguna", async ({
    page,
    request,
  }) => {
    await page.goto("/es/vitrina/apps");
    await page.locator("#roadmap").scrollIntoViewIfNeeded();
    await expect(page.locator("#roadmap [data-feature-id]")).toHaveCount(
      featuresRoadmap.length,
    );
    // Gate ATS: la app y su feature, en el HTML estático de esa ruta.
    for (const locale of ["es", "en"] as const) {
      const html = await (await request.get(`/${locale}/vitrina/apps`)).text();
      expect(html).toContain(apps[0].nombre[locale]);
      expect(html).toContain(primeraFeature.titulo[locale]);
    }
  });
});
