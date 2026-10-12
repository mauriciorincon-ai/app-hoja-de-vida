import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * LAS CIFRAS DE LOS GEMELOS (2026-10-12): cada sección del corpus «a fondo»
 * dice los MISMOS números en español y en inglés.
 *
 * La paridad ES/EN ya exigía que las secciones existieran en los dos idiomas,
 * y el gate de cifras (ADR-025) lee el español contra el disco. Nadie miraba
 * el inglés: cuando el PR de contenido #73 llevó la vitrina a 10 apps, 15
 * agentes y 38 piezas, el español se alineó y once secciones en inglés
 * siguieron diciendo 6 apps, 13 agentes y 32 piezas. Un reclutador que pregunta
 * en inglés leía otro sitio.
 *
 * Se comparan los números escritos con cifras, sección por sección (miles y
 * decimales normalizados). Un número escrito con letras en un idioma y con
 * cifras en el otro es una diferencia legítima: va en EXCEPCIONES con su
 * razón, y si deja de hacer falta el test pide retirarla.
 */

const DIR = "data/a-fondo";

type Diferencia = {
  soloEs: Record<string, number>;
  soloEn: Record<string, number>;
};

const EXCEPCIONES: Record<string, Diferencia & { razon: string }> = {
  "como-trabajo · direccion-desde-la-definicion": {
    soloEs: {},
    soloEn: { "10": 1 },
    razon:
      "«más de diez oportunidades» con letras; el inglés escribe «more than 10»",
  },
  "rag-y-el-chat · seguridad-y-limites": {
    soloEs: { "21": 1 },
    soloEn: {},
    razon: "«desde el 21» es una fecha; el inglés escribe el ordinal «21st»",
  },
};

function secciones(archivo: string): Map<string, string> {
  const partes = readFileSync(archivo, "utf8").split(
    /<!-- seccion: ([a-z0-9-]+) -->/,
  );
  const m = new Map<string, string>();
  for (let i = 1; i < partes.length; i += 2) m.set(partes[i], partes[i + 1]);
  return m;
}

function cifras(texto: string): Map<string, number> {
  const t = texto
    .replace(/(?<=\d)[.,](?=\d{3}\b)/g, "") // separador de miles
    .replace(/(?<=\d),(?=\d)/g, "."); // coma decimal
  const c = new Map<string, number>();
  for (const n of t.match(/\b\d+(?:\.\d+)?\b/g) ?? [])
    c.set(n, (c.get(n) ?? 0) + 1);
  return c;
}

function resta(a: Map<string, number>, b: Map<string, number>) {
  const r: Record<string, number> = {};
  for (const [k, v] of a) {
    const d = v - (b.get(k) ?? 0);
    if (d > 0) r[k] = d;
  }
  return r;
}

function diferencias(): Map<string, Diferencia> {
  const out = new Map<string, Diferencia>();
  for (const f of readdirSync(DIR).filter((f) => f.endsWith(".es.md"))) {
    const en = path.join(DIR, f.replace(".es.md", ".en.md"));
    if (!existsSync(en)) continue;
    const E = secciones(path.join(DIR, f));
    const N = secciones(en);
    for (const [id, textoEs] of E) {
      const textoEn = N.get(id);
      if (textoEn === undefined) continue; // eso lo vigila la paridad de secciones
      const a = cifras(textoEs);
      const b = cifras(textoEn);
      const soloEs = resta(a, b);
      const soloEn = resta(b, a);
      if (Object.keys(soloEs).length || Object.keys(soloEn).length)
        out.set(`${f.replace(".es.md", "")} · ${id}`, { soloEs, soloEn });
    }
  }
  return out;
}

describe("las cifras de cada sección son las mismas en español y en inglés", () => {
  const halladas = diferencias();

  it("ninguna sección dice un número distinto en un idioma que en el otro", () => {
    const problemas = [...halladas]
      .filter(([clave, d]) => {
        const e = EXCEPCIONES[clave];
        return (
          !e ||
          JSON.stringify(e.soloEs) !== JSON.stringify(d.soloEs) ||
          JSON.stringify(e.soloEn) !== JSON.stringify(d.soloEn)
        );
      })
      .map(
        ([clave, d]) =>
          `${clave}: solo en español ${JSON.stringify(d.soloEs)} · solo en inglés ${JSON.stringify(d.soloEn)}`,
      );
    expect(problemas).toEqual([]);
  });

  it("cada excepción sigue haciendo falta (si no, se retira)", () => {
    const sobran = Object.keys(EXCEPCIONES).filter((k) => !halladas.has(k));
    expect(sobran).toEqual([]);
  });
});
