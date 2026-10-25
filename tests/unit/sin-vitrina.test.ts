import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { sinVitrina, sinVitrinaEnTodo } from "../../scripts/sin-vitrina.mjs";

/**
 * UNA SOLA PALABRA: «PORTAFOLIO» (S23, 2026-10-25).
 *
 * El dueño quiso que «vitrina» saliera del sitio entero: del texto que el
 * visitante lee y de las rutas que ve en la barra. Este archivo es el gate:
 *
 *  1. La función que cambia la palabra lo hace con su CONCORDANCIA («de la
 *     vitrina» → «del portafolio», jamás «de la portafolio») y no toca una ruta,
 *     un archivo ni un identificador.
 *  2. Ninguna ruta `/vitrina…` ni ancla `#vitrina` queda en el árbol que se
 *     publica o se prueba (barrido de archivo ENTERO, como `retiro-piezas`),
 *     salvo donde la ruta vieja es el dato: el motor del 301 y su prueba.
 *  3. Ningún valor de `messages/*.json` dice la palabra vieja.
 *  4. Lo que escriben otras casas (los exports, las fichas, los complementos) no
 *     se edita aquí: se lee ya con la palabra nueva. Ninguno la deja suelta.
 *  5. El corpus, los mensajes y los datos no tienen una concordancia rota
 *     («la portafolio», «el vitrina»).
 *
 * Lo que sigue diciendo «vitrina» a propósito son IDENTIFICADORES, no texto: la
 * carpeta `src/lib/vitrina`, `content/vitrina`, `data/vitrina.yaml`, el espacio
 * de nombres `vitrina` de los mensajes, las clases `tarjeta-vitrina`. No se ven.
 */

const RAIZ = process.cwd();

// ── 1 · la función ─────────────────────────────────────────────────────────

describe("sinVitrina: la palabra con su concordancia", () => {
  it.each([
    ["de la vitrina", "del portafolio"],
    ["De la vitrina de apps", "Del portafolio de apps"],
    ["a la vitrina", "al portafolio"],
    ["la vitrina", "el portafolio"],
    ["La vitrina muestra", "El portafolio muestra"],
    ["una vitrina", "un portafolio"],
    ["esta vitrina", "este portafolio"],
    ["esa vitrina", "ese portafolio"],
    ["nuestra vitrina", "nuestro portafolio"],
    ["la propia vitrina", "el propio portafolio"],
    ["en mi propia vitrina", "en mi propio portafolio"],
    ["las vitrinas", "los portafolios"],
    ["desde la vitrina", "desde el portafolio"],
    ["para la vitrina", "para el portafolio"],
    ["en la vitrina.", "en el portafolio."],
    // Con posesivo o sin determinante, solo cambia el sustantivo.
    ["mi vitrina", "mi portafolio"],
    ["su vitrina", "su portafolio"],
    ["procesos, vitrina y encaje", "procesos, portafolio y encaje"],
    ["Vitrina", "Portafolio"],
    // La prosa se parte a ~100 columnas: el determinante y la palabra pueden
    // quedar en líneas distintas.
    ["en la\nvitrina de apps", "en el\nportafolio de apps"],
    // Una frase con adjetivo concuerda entera.
    ["La vitrina es estática: ningún", "El portafolio es estático: ningún"],
    // Inglés: sin género.
    ["the showcase", "the portfolio"],
    ["The showcase", "The portfolio"],
    ["a showcase", "a portfolio"],
    ["our showcase product", "our portfolio product"],
    ["showcases", "portfolios"],
    ["Showcase", "Portfolio"],
  ])("%j → %j", (de, a) => {
    expect(sinVitrina(de)).toBe(a);
  });

  it.each([
    "data/vitrina.yaml",
    "content/vitrina/ds.brochure-export.json",
    "src/lib/vitrina/loader.ts",
    "los-agentes-de-la-vitrina",
    "pnpm paquete:vitrina --hoja-de-vida",
    "/vitrina/apps",
    "#vitrina",
    "tarjeta-vitrina",
    "vitrina.yaml",
  ])("%j no es texto: no se toca", (identificador) => {
    expect(sinVitrina(identificador)).toBe(identificador);
  });

  it("es idempotente y no toca las claves de un árbol de datos", () => {
    const arbol = {
      vitrina: { es: "La vitrina", en: "The showcase" },
      lista: ["de la vitrina", 3, null],
    };
    const una = sinVitrinaEnTodo(arbol);
    expect(una).toEqual({
      vitrina: { es: "El portafolio", en: "The portfolio" },
      lista: ["del portafolio", 3, null],
    });
    expect(sinVitrinaEnTodo(una)).toEqual(una);
    // No muta lo que recibe.
    expect(arbol.vitrina.es).toBe("La vitrina");
  });
});

// ── helpers de barrido ─────────────────────────────────────────────────────

const BINARIOS =
  /\.(png|jpe?g|webp|gif|ico|pdf|woff2?|ttf|otf|mp4|webm|avif)$/i;

function archivos(dir: string, salida: string[] = []): string[] {
  const abs = path.join(RAIZ, dir);
  if (!existsSync(abs)) return salida;
  for (const nombre of readdirSync(abs)) {
    const rel = path.join(dir, nombre);
    const st = statSync(path.join(RAIZ, rel));
    if (st.isDirectory()) {
      if (nombre === "node_modules" || nombre === ".next") continue;
      archivos(rel, salida);
    } else if (!BINARIOS.test(nombre)) {
      salida.push(rel);
    }
  }
  return salida;
}

/** Línea (1-based) de un índice dentro de un texto. */
const lineaDe = (texto: string, i: number) =>
  texto.slice(0, i).split("\n").length;

// ── 2 · rutas y anclas ─────────────────────────────────────────────────────

/**
 * `/vitrina` como RUTA: suelta (`"/vitrina"`, `/es/vitrina/apps`) y no como
 * parte de una ruta de archivo (`content/vitrina`, `lib/vitrina`,
 * `data/vitrina.yaml`, `public/vitrina`). Más las anclas `#vitrina` y
 * `#contacto-vitrina`.
 */
const RUTA_VIEJA =
  /(?:(?<![\w.])|(?<=\/es)|(?<=\/en))\/vitrina(?![\w])|(?<![\w-])#(?:contacto-)?vitrina(?![\w-])/g;

/**
 * Donde la ruta vieja ES el dato, y por qué.
 *  · el motor del 301 y su prueba: la ruta vieja es lo que se redirige;
 *  · `retiro-piezas`: el patrón de las piezas retiradas caza la ruta vieja y la nueva;
 *  · este archivo y su gemelo e2e: describen y prueban la ruta vieja;
 *  · `capturas.tsx`: sirve las imágenes de la carpeta de estáticos `public/vitrina/`.
 */
const RUTA_VIEJA_PERMITIDA = new Set([
  "src/lib/redireccion.ts",
  "tests/unit/redireccion.test.ts",
  "tests/unit/retiro-piezas.test.ts",
  "tests/unit/sin-vitrina.test.ts",
  "tests/e2e/portafolio.spec.ts",
  "src/components/vitrina/capturas.tsx",
  "src/proxy.ts",
]);

/**
 * La historia no se reescribe: el historial de la guía y del manual cuentan lo
 * que cada versión decía. El contrato de la ficha técnica es de la planeadora
 * (se toca con el rediseño del S27); `sprints/` y `decisions/` son archivo.
 */
function sinHistoria(archivo: string, texto: string): string {
  if (archivo.endsWith("GUIA-DE-PRUEBA.html")) {
    const i = texto.indexOf("<summary>Historial de la guía</summary>");
    return i < 0 ? texto : texto.slice(0, i);
  }
  if (archivo.endsWith("MANUAL-DE-USO.md")) {
    const i = texto.indexOf("\n## Historial");
    return i < 0 ? texto : texto.slice(0, i);
  }
  return texto;
}

/**
 * Una guía o un manual SÍ pueden nombrar la ruta vieja: para pedir que se
 * pruebe la redirección («escribe /es/vitrina… y terminas en /es/portafolio»).
 * Solo así: la frase de al lado tiene que decir que es la redirección o la
 * dirección vieja. Una ruta vieja a secas, en un enlace o en una lista, es un
 * resto del renombre.
 */
export function explicaLaRedireccion(texto: string, indice: number): boolean {
  const antes = texto.slice(Math.max(0, indice - 160), indice);
  return /redirig|redirect|direcci[oó]n vieja|ruta vieja|old route/i.test(
    antes,
  );
}

const CARPETAS_RUTAS = ["src", "data", "docs", "messages", "tests", "scripts"];
const ARCHIVOS_RUTAS = [
  "README.md",
  "design-system.md",
  "lighthouse-urls.json",
];

function rutasViejas(): string[] {
  const hallazgos: string[] = [];
  const todos = [
    ...CARPETAS_RUTAS.flatMap((c) => archivos(c)),
    ...ARCHIVOS_RUTAS,
  ].filter((f) => existsSync(path.join(RAIZ, f)));
  for (const archivo of todos) {
    const norm = archivo.split(path.sep).join("/");
    if (RUTA_VIEJA_PERMITIDA.has(norm)) continue;
    if (norm.startsWith("docs/contrato-ficha-tecnica/")) continue;
    const texto = sinHistoria(
      norm,
      readFileSync(path.join(RAIZ, norm), "utf8"),
    );
    for (const m of texto.matchAll(RUTA_VIEJA)) {
      if (explicaLaRedireccion(texto, m.index ?? 0)) continue;
      hallazgos.push(`${norm}:${lineaDe(texto, m.index ?? 0)} «${m[0]}»`);
    }
  }
  return hallazgos;
}

describe("ninguna ruta ni ancla vieja en el árbol", () => {
  it("el patrón caza la ruta vieja y no una ruta de archivo", () => {
    const caza = (t: string) => [...t.matchAll(RUTA_VIEJA)].length;
    for (const t of [
      '"/vitrina"',
      "/es/vitrina/apps",
      "/en/vitrina/apps/habla/detalle",
      'href="#vitrina"',
      "#contacto-vitrina",
      "`/vitrina/${frente}`",
    ]) {
      expect(caza(t), t).toBeGreaterThan(0);
    }
    for (const t of [
      "content/vitrina/ds.brochure-export.json",
      "@/lib/vitrina/loader",
      "data/vitrina.yaml",
      "public/vitrina/x.webp",
      "tarjeta-vitrina",
      "/es/portafolio/apps",
      "#portafolio",
    ]) {
      expect(caza(t), t).toBe(0);
    }
  });

  it("src data docs messages tests scripts: sin /vitrina ni #vitrina", () => {
    expect(rutasViejas()).toEqual([]);
  });

  it("la ruta vieja solo se nombra para explicar su redirección", () => {
    const frase = (s: string) => explicaLaRedireccion(s, s.indexOf("/vitrina"));
    expect(frase("La dirección vieja ya no existe: escribe /vitrina")).toBe(
      true,
    );
    expect(
      frase("te redirige: escribe /vitrina y terminas en /portafolio"),
    ).toBe(true);
    expect(frase("Abre /vitrina/apps y mira las fichas")).toBe(false);
  });

  it("el motor del 301 sí conoce la ruta vieja", () => {
    const motor = readFileSync(
      path.join(RAIZ, "src/lib/redireccion.ts"),
      "utf8",
    );
    expect(motor).toMatch(/vieja: "vitrina", nueva: "portafolio"/);
  });
});

// ── 3 · los mensajes ───────────────────────────────────────────────────────

function textos(valor: unknown, ruta = ""): Array<[string, string]> {
  if (typeof valor === "string") return [[ruta, valor]];
  if (Array.isArray(valor)) {
    return valor.flatMap((v, i) => textos(v, `${ruta}[${i}]`));
  }
  if (valor && typeof valor === "object") {
    return Object.entries(valor).flatMap(([k, v]) => textos(v, `${ruta}.${k}`));
  }
  return [];
}

/** La palabra vieja como palabra suelta, no como parte de un identificador. */
const PALABRA_SUELTA =
  /(?<![\p{L}\p{N}_/.\-#@:])(?:vitrinas?|showcases?)(?![\p{L}\p{N}_/-]|\.(?:yaml|json|md|ts|mjs|html)\b)/giu;

describe("ningún mensaje dice la palabra vieja", () => {
  for (const idioma of ["es", "en"]) {
    it(`messages/${idioma}.json`, () => {
      const json = JSON.parse(
        readFileSync(path.join(RAIZ, "messages", `${idioma}.json`), "utf8"),
      );
      const conPalabra = textos(json)
        .filter(([, v]) => /vitrin|showcase/i.test(v))
        .map(([k, v]) => `${k}: ${v}`);
      expect(conPalabra).toEqual([]);
    });
  }

  it("el portafolio es una sola palabra: título, botón y desplegable coinciden", () => {
    for (const [idioma, titulo, ir] of [
      ["es", "Portafolio", "Explora mi portafolio"],
      ["en", "Portfolio", "Explore my portfolio"],
    ]) {
      const m = JSON.parse(
        readFileSync(path.join(RAIZ, "messages", `${idioma}.json`), "utf8"),
      );
      expect(m.vitrinaHome.titulo).toBe(titulo);
      expect(m.vitrinaHome.ir).toBe(ir);
      expect(m.hero.ctaApps).toBe(ir);
      expect(m.nav.portafolio).toBe(titulo);
    }
  });
});

// ── 4 · lo de otras casas, leído con la palabra nueva ──────────────────────

/** Todo texto de un archivo de otra casa o de un complemento, ya leído. */
function leidosDeOtrasCasas(): Array<{ archivo: string; datos: unknown }> {
  const fuentes: Array<{ archivo: string; datos: unknown }> = [];
  for (const carpeta of ["content"]) {
    for (const f of archivos(carpeta)) {
      if (!f.endsWith(".json")) continue;
      fuentes.push({
        archivo: f,
        datos: JSON.parse(readFileSync(path.join(RAIZ, f), "utf8")),
      });
    }
  }
  for (const f of archivos("data/fichas")) {
    if (!f.endsWith(".yaml")) continue;
    fuentes.push({
      archivo: f,
      datos: parse(readFileSync(path.join(RAIZ, f), "utf8")),
    });
  }
  return fuentes;
}

describe("lo que escriben otras casas se lee sin la palabra vieja", () => {
  it("hay exports, fichas y complementos que revisar", () => {
    expect(leidosDeOtrasCasas().length).toBeGreaterThan(30);
  });

  it("al leerlo, ningún texto la deja suelta", () => {
    const sueltas: string[] = [];
    for (const { archivo, datos } of leidosDeOtrasCasas()) {
      for (const [ruta, valor] of textos(sinVitrinaEnTodo(datos))) {
        for (const m of valor.matchAll(PALABRA_SUELTA)) {
          sueltas.push(`${archivo}${ruta} «${m[0]}»`);
        }
      }
    }
    expect(sueltas).toEqual([]);
  });

  it("los cuatro lectores aplican el alias (loader, complemento, piezas, índice del chat)", () => {
    for (const lector of [
      "src/lib/vitrina/loader.ts",
      "src/lib/vitrina/ficha-tecnica/loader.ts",
      "src/lib/vitrina/piezas.ts",
      "scripts/fichas-al-indice.mjs",
    ]) {
      const fuente = readFileSync(path.join(RAIZ, lector), "utf8");
      expect(fuente, lector).toMatch(/sinVitrinaEnTodo\(/);
    }
  });

  it("y sin leerlo SÍ la traen: el alias hace trabajo (el gate no es ciego)", () => {
    const crudas = leidosDeOtrasCasas().flatMap(({ datos }) =>
      textos(datos).filter(([, v]) => PALABRA_SUELTA.test(v)),
    );
    PALABRA_SUELTA.lastIndex = 0;
    expect(crudas.length).toBeGreaterThan(0);
  });
});

// ── 5 · la concordancia en lo que escribe esta casa ────────────────────────

/**
 * «la / una / esta / esa / nuestra / las portafolio» y «el / un / este / ese /
 * del / al vitrina» son el rastro de cambiar la palabra sin su determinante.
 */
const CONCORDANCIA_ROTA = [
  /\b(?:la|una|esta|esa|nuestra|las|de\s+la|a\s+la)\s+portafolios?\b/giu,
  /\b(?:el|un|este|ese|del|al|los)\s+vitrinas?\b/giu,
];

describe("la concordancia no se rompió", () => {
  it("el patrón caza lo roto y deja lo bueno", () => {
    const caza = (t: string) =>
      CONCORDANCIA_ROTA.some((r) => new RegExp(r.source, r.flags).test(t));
    for (const t of [
      "de la portafolio",
      "en la\nportafolio",
      "La portafolio muestra",
      "del vitrina",
      "el vitrina",
    ]) {
      expect(caza(t), t).toBe(true);
    }
    for (const t of [
      "del portafolio",
      "el portafolio",
      "un portafolio",
      "mi portafolio",
      "la vitrina",
    ]) {
      expect(caza(t), t).toBe(false);
    }
  });

  it("corpus, mensajes, datos y documentos: sin determinante cambiado a medias", () => {
    const rotas: string[] = [];
    const fuentes = [
      ...archivos("data").filter((f) => /\.(md|yaml)$/.test(f)),
      ...archivos("messages"),
      ...archivos("docs").filter((f) => /\.(md|html)$/.test(f)),
      ...archivos("tests/fixtures"),
    ];
    for (const f of fuentes) {
      const norm = f.split(path.sep).join("/");
      if (norm.startsWith("docs/contrato-ficha-tecnica/")) continue;
      const texto = sinHistoria(norm, readFileSync(path.join(RAIZ, f), "utf8"));
      for (const patron of CONCORDANCIA_ROTA) {
        for (const m of texto.matchAll(
          new RegExp(patron.source, patron.flags),
        )) {
          rotas.push(`${norm}:${lineaDe(texto, m.index ?? 0)} «${m[0]}»`);
        }
      }
    }
    expect(rotas).toEqual([]);
  });
});
