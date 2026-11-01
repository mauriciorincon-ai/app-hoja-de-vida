// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { entradasBrochure } from "../../scripts/entradas-brochure.mjs";

/**
 * LAS RUTAS QUE EL BROCHURE RETIRÓ NO LAS NOMBRA NADIE (S28).
 *
 * El brochure (`/portafolio/apps/<app>/brochure`) reemplazó a dos páginas:
 *
 *  - el detalle de cada app, `/portafolio/apps/<app>/detalle` (S5), y
 *  - la página de la casa, `/apps/hoja-de-vida` y `/apps/chat-hoja-de-vida` (S4).
 *
 * Desde el S30 el brochure es además la ENTRADA de la casa y de las apps con su contenido v2
 * (`/portafolio/apps/<app>`), y su `/brochure` es un 301 a ella: tampoco se nombra.
 *
 * Todas siguen respondiendo, pero con un 301 (`src/lib/redireccion.ts`). Lo que ya no puede pasar es
 * que el código, los datos o los textos las nombren como destino: un enlace que depende de la
 * redirección es un salto de más para el visitante y para el buscador, y un catálogo del chat que las
 * lista es una cita a una página que ya no existe. Ninguna otra prueba lo vigilaba: el build valida
 * enlaces contra el catálogo, pero el catálogo se deriva de las mismas fuentes que se acaban de editar.
 *
 * Se barre el árbol que se publica y se prueba (`src/`, `scripts/`, `data/` menos `a-fondo/`,
 * `messages/`, `tests/`, `lighthouse-urls.json`, el manual y el sistema de diseño). Quedan fuera lo que
 * por definición las nombra —la redirección y sus pruebas— y lo histórico: `sprints/`, `decisions/` y las
 * entregas de otras casas en `content/`, que no se editan aquí (su `brochure_ruta_local` conserva la ruta
 * de entonces).
 */

const RAIZ = process.cwd();

type Retirada = { nombre: string; patron: RegExp };

const RETIRADAS: Retirada[] = [
  {
    nombre: "el detalle de una app (`…/apps/<app>/detalle`)",
    patron: /apps\/(?:[\w.-]+|\$\{[^}]+\}|\[[^\]]+\])\/detalle\b/,
  },
  {
    nombre:
      "la página de la casa (`/apps/hoja-de-vida`, `/apps/chat-hoja-de-vida`)",
    patron: /(?<!portafolio)\/apps\/(?:hoja-de-vida|chat-hoja-de-vida)\b/,
  },
  {
    // `/apps/${app.id}` o `/apps/${slug}` sin `portafolio` delante: la ruta del S4 armada con una plantilla.
    nombre: "la ruta `/apps/<id>` del S4 armada con una plantilla",
    patron: /(?<!portafolio)\/apps\/\$\{/,
  },
  {
    // S30: la lista sale del disco, como la mide el build (copiar un v2 suma su app aquí sola).
    nombre:
      "el `/brochure` de una app que abre en su brochure (es un 301 a su entrada)",
    patron: new RegExp(
      `apps\\/(?:${entradasBrochure().join("|")})\\/brochure\\b`,
    ),
  },
];

/** Dónde se busca (relativo a la raíz). */
const DONDE = [
  "src",
  "scripts",
  "data",
  "messages",
  "tests",
  "lighthouse-urls.json",
  "docs/MANUAL-DE-USO.md",
  "design-system.md",
];

/** Lo que las nombra por definición, o no es nuestro. */
const EXENTOS = new Set([
  "src/lib/redireccion.ts",
  "tests/unit/redireccion.test.ts",
  "tests/unit/destinos.test.ts", // lista las rutas muertas a propósito, para afirmar que ya no son destino
  "tests/e2e/portafolio.spec.ts", // los 301 contra el sitio real
  "tests/e2e/entrada.spec.ts", // los 301 del `/brochure` de las entradas, contra el sitio real
  "tests/unit/sin-vitrina.test.ts", // un texto de muestra del patrón de la palabra vieja
  "tests/unit/rutas-retiradas.test.ts", // este archivo
]);
const EXENTOS_DIR = ["data/a-fondo/"];

function archivos(rel: string): string[] {
  const abs = path.join(RAIZ, rel);
  if (!statSync(abs).isDirectory()) return [rel];
  return readdirSync(abs).flatMap((n) => archivos(path.posix.join(rel, n)));
}

const TEXTO = /\.(?:ts|tsx|mjs|json|ya?ml|md|css)$/;

/** `archivo:línea` de cada coincidencia de `patron` en `texto`. */
function coincidencias(archivo: string, texto: string, patron: RegExp) {
  return texto
    .split("\n")
    .flatMap((linea, i) =>
      patron.test(linea)
        ? [`${archivo}:${i + 1} «${linea.trim().slice(0, 90)}»`]
        : [],
    );
}

describe("el patrón caza lo que debe y no lo que no", () => {
  // La demostración en rojo del gate: lo que el repo tenía antes del S28 TIENE que dar positivo.
  it.each([
    ["el sitemap del S4", "url: `${SITE_URL}/${locale}/apps/${app.id}`,", 2],
    ["el catálogo de destinos del S4", "rutas.add(`/apps/${app.id}`);", 2],
    [
      "el detalle en el sitemap",
      "rutas.add(`/portafolio/apps/${app.slug}/detalle`);",
      0,
    ],
    ["un enlace de «Métodos»", "href: /apps/chat-hoja-de-vida", 1],
    ["la URL de Lighthouse de la casa", '"/es/apps/hoja-de-vida",', 1],
    [
      "la URL de Lighthouse del detalle",
      '"/es/portafolio/apps/habla/detalle",',
      0,
    ],
    [
      "una prueba que va al detalle",
      "await page.goto(`/es/portafolio/apps/${slug}/detalle`);",
      0,
    ],
    // Lo que el repo tenía antes del S30.
    [
      "un enlace de «Métodos» a la casa",
      "href: /portafolio/apps/chat-hoja-de-vida/brochure",
      3,
    ],
    [
      "la URL de Lighthouse de la casa",
      '"/es/portafolio/apps/hoja-de-vida/brochure",',
      3,
    ],
    [
      "la URL de Lighthouse de la piloto",
      '"/es/portafolio/apps/inmobiliaria/brochure",',
      3,
    ],
  ] as const)("%s se caza", (_nombre, linea, cual) => {
    expect(RETIRADAS[cual].patron.test(linea)).toBe(true);
  });

  it.each([
    "href: /portafolio/apps/chat-hoja-de-vida",
    '"/es/portafolio/apps/habla/brochure",',
    "rutas.add(`/portafolio/apps/${app.slug}/brochure`);",
    "rutas.add(`/portafolio/apps/${app.slug}`);",
    "await page.goto(`/es/portafolio/apps/${slug}/simulacion`);",
    "href={`/portafolio/apps/${app}#contacto-portafolio`}",
    "const detalle = await getTranslations()",
    "/es/proyectos/vesting",
  ])("%s no se caza", (linea) => {
    for (const r of RETIRADAS)
      expect(r.patron.test(linea), r.nombre).toBe(false);
  });
});

describe("ningún archivo nombra una ruta retirada", () => {
  const todos = DONDE.flatMap(archivos).filter(
    (f) =>
      TEXTO.test(f) &&
      !EXENTOS.has(f) &&
      !EXENTOS_DIR.some((d) => f.startsWith(d)),
  );

  it("barre el árbol: hay con qué comparar", () => {
    expect(todos.length).toBeGreaterThan(200);
  });

  for (const { nombre, patron } of RETIRADAS) {
    it(`nadie nombra ${nombre}`, () => {
      const hallazgos = todos.flatMap((f) =>
        coincidencias(f, readFileSync(path.join(RAIZ, f), "utf8"), patron),
      );
      expect(hallazgos).toEqual([]);
    });
  }
});
