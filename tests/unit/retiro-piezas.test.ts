import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * EL RETIRO DE UNA PIEZA SE DEMUESTRA CON UN BARRIDO (S21 y S22).
 *
 * Una pieza retirada de la vitrina no puede dejar su ficha en `content/agentes` ni su
 * nombre o su dirección en `content data src messages docs public`. `sprints/` y
 * `decisions/` son historia y no se barren; `tests/` tampoco (aquí vive el patrón).
 *
 *  · S21 (2026-10-23): el agente de estudio del AI-103, que nunca operó (orden de la Fábrica).
 *  · S22 (2026-10-24): los dos agentes demostrativos de planlang, retirados por decisión
 *    del dueño, y el Harness Design Science, que es un duplicado del Paper Computacional.
 *
 * Del Harness Design Science solo se barre la dirección de su ficha: el método de
 * investigación que describen `las-investigaciones` y el CV sigue siendo del dueño.
 *
 * El barrido lee cada archivo ENTERO, no línea por línea: la prosa del corpus se parte a
 * unas 100 columnas y «Agent B,⏎for onboarding» no cabe en una línea. Por eso los patrones
 * separan las palabras con `\s+`.
 * `public/piezas/` es la simulación de planlang: HTML que genera otra casa (ADR-029) y
 * que aquí no se edita (regla dura 2). Sus páginas de fichas todavía rotulan «Agente A» y
 * «Agente B», y el brochure de planlang (`content/vitrina`) habla de su «Demo A» y «Demo B»:
 * se reporta a la casa de origen y por eso esa carpeta queda fuera del barrido.
 *
 * Las cuentas que bajan con una ficha (agentes, piezas) no se vigilan aquí: salen del
 * disco y ya las miran `documentos-cuentas` y `a-fondo-cifras-gemelas`.
 */

interface Retirada {
  slug: string;
  porQue: string;
  patron: RegExp;
  /** Frases que el patrón DEBE cazar y una que NO debe cazar: el barrido no es ciego. */
  caza: string[];
  noCaza: string;
}

const RETIRADAS: Retirada[] = [
  {
    slug: "ai103-foundry",
    porQue: "S21 · el agente de estudio del AI-103 (orden de la Fábrica)",
    patron: /ai103-foundry|super gu[ií]a|super guide/i,
    caza: [
      "la Super guía AI-103",
      "The AI-103 Super Guide",
      "content/agentes/ai103-foundry.ficha-tecnica.json",
    ],
    // La certificación sigue «en curso»: nombrarla no es presentar el agente.
    noCaza: "el AI-103, en curso",
  },
  {
    slug: "planlang-demo-a",
    porQue: "S22 · Agente A, autorizaciones médicas",
    patron:
      /vitrina\/agentes\/planlang-demo-a|Agente\s+A\s*[,·]\s*(de\s+)?autorizaciones|Agent\s+A\s*[,·]\s*(for\s+)?medical|agentes\s+demostrativos\s+de\s+planlang|planlang's\s+demonstration\s+agents/i,
    caza: [
      "**Agente A · autorizaciones médicas**",
      // La prosa real del corpus, con el salto de línea donde lo tenía.
      "el Agente A, de autorizaciones\nmédicas, y el Agente B",
      "Agent A, for medical authorizations, and Agent B,",
      "/vitrina/agentes/planlang-demo-a",
      "los agentes\ndemostrativos de planlang",
    ],
    noCaza: "Demo A: autorizaciones médicas",
  },
  {
    slug: "planlang-demo-b",
    porQue: "S22 · Agente B, vinculación con debida diligencia",
    patron:
      /vitrina\/agentes\/planlang-demo-b|Agente\s+B\s*[,·]\s*(de\s+)?vinculaci|Agent\s+B\s*[,·]\s*(for\s+)?onboarding/i,
    caza: [
      "Agente B · vinculación con debida diligencia",
      "y el Agente B, de vinculación con debida diligencia",
      "Agent B,\nfor onboarding with due diligence",
      "/vitrina/agentes/planlang-demo-b",
    ],
    noCaza: "Demo B: vinculación con debida diligencia",
  },
  {
    slug: "harness-design-science",
    porQue: "S22 · duplicado del Paper Computacional (solo se barre su ficha)",
    patron: /vitrina\/agentes\/harness-design-science/i,
    caza: ["/vitrina/agentes/harness-design-science"],
    noCaza: "El Harness Design Science —diez fases D0 a D9—",
  },
];

const RAIZ = process.cwd();
const CARPETAS = ["content", "data", "src", "messages", "docs", "public"];
const BINARIOS = /\.(png|jpe?g|webp|gif|ico|pdf|woff2?|ttf|otf|mp4|webm)$/i;
// `public/chat-index.*.json` se genera en el build y no está en git: se barre su fuente.
const GENERADOS = /^public[\\/]chat-index\.[a-z]+\.json$/;

function archivos(dir: string): string[] {
  const abs = path.join(RAIZ, dir);
  if (!existsSync(abs)) return [];
  const salida: string[] = [];
  for (const nombre of readdirSync(abs)) {
    const rel = path.join(dir, nombre);
    const st = statSync(path.join(RAIZ, rel));
    if (st.isDirectory()) salida.push(...archivos(rel));
    else if (!BINARIOS.test(nombre) && !GENERADOS.test(rel)) salida.push(rel);
  }
  return salida;
}

const TEXTOS = CARPETAS.flatMap(archivos)
  .filter((rel) => !/^public[\\/]piezas[\\/]/.test(rel))
  .map((rel) => ({
    rel: rel.split(path.sep).join("/"),
    texto: readFileSync(path.join(RAIZ, rel), "utf8"),
  }));

/** Cada coincidencia como `archivo:línea` (la de su primera palabra), para que el fallo diga dónde está. */
function coincidencias(patron: RegExp): string[] {
  const global = new RegExp(patron.source, `${patron.flags.replace("g", "")}g`);
  const halladas: string[] = [];
  for (const { rel, texto } of TEXTOS)
    for (const m of texto.matchAll(global))
      halladas.push(`${rel}:${texto.slice(0, m.index).split("\n").length}`);
  return halladas;
}

describe.each(RETIRADAS)("el retiro de $slug ($porQue)", (r) => {
  it("su ficha ya no está en content/agentes", () => {
    expect(
      readdirSync(path.join(RAIZ, "content/agentes")).filter((f) =>
        f.startsWith(`${r.slug}.`),
      ),
    ).toEqual([]);
  });

  it("el barrido da 0 en content, data, src, messages, docs y public", () => {
    expect(
      coincidencias(r.patron),
      `${r.slug} sigue nombrado: una pieza retirada no se presenta ni se enlaza`,
    ).toEqual([]);
  });

  it("el barrido sí encuentra lo que debe encontrar (el patrón no es ciego)", () => {
    for (const frase of r.caza) expect(r.patron.test(frase), frase).toBe(true);
    expect(r.patron.test(r.noCaza), r.noCaza).toBe(false);
  });
});
