import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * EL RETIRO DE UN AGENTE SE DEMUESTRA CON EL BARRIDO DE LA ORDEN (S21, 2026-10-23).
 *
 * El dueño desmontó de la Fábrica el agente «Super guía AI-103» (nunca operó) y pidió
 * que el sitio dejara de presentarlo y de contarlo. La orden de la Fábrica fija la
 * prueba: ni la ficha ni el nombre pueden quedar en `content data src messages docs
 * public`. `sprints/` y `decisions/` son historia y no se barren; `tests/` tampoco
 * (aquí vive el patrón).
 *
 * Las cuentas que bajan con la ficha (agentes, piezas) no se vigilan aquí: salen del
 * disco y ya las miran `documentos-cuentas` y `a-fondo-cifras-gemelas`.
 */

const RAIZ = process.cwd();
const CARPETAS = ["content", "data", "src", "messages", "docs", "public"];
const PATRON = /ai103-foundry|super gu[ií]a|super guide/i;
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

/** Cada coincidencia como `archivo:línea`, para que el fallo diga dónde está. */
function coincidencias(carpetas: string[] = CARPETAS): string[] {
  const halladas: string[] = [];
  for (const rel of carpetas.flatMap(archivos)) {
    readFileSync(path.join(RAIZ, rel), "utf8")
      .split("\n")
      .forEach((linea, i) => {
        if (PATRON.test(linea))
          halladas.push(`${rel.split(path.sep).join("/")}:${i + 1}`);
      });
  }
  return halladas;
}

describe("el retiro de la Super guía AI-103 (orden de la Fábrica, 2026-10-23)", () => {
  it("la ficha ya no está en content/agentes", () => {
    const fichas = readdirSync(path.join(RAIZ, "content/agentes"));
    expect(fichas.filter((f) => /ai103/i.test(f))).toEqual([]);
  });

  it("el barrido de la orden da 0 en content, data, src, messages, docs y public", () => {
    expect(
      coincidencias(),
      "el agente retirado sigue nombrado: la orden pide 0 coincidencias (el AI-103 «en curso» sí puede decirse)",
    ).toEqual([]);
  });

  it("el barrido sí encuentra lo que debe encontrar (el patrón no es ciego)", () => {
    expect(PATRON.test("la Super guía AI-103")).toBe(true);
    expect(PATRON.test("The AI-103 Super Guide")).toBe(true);
    expect(
      PATRON.test("content/agentes/ai103-foundry.ficha-tecnica.json"),
    ).toBe(true);
    // La certificación sigue «en curso»: nombrarla no es presentar el agente.
    expect(PATRON.test("el AI-103, en curso")).toBe(false);
  });
});
