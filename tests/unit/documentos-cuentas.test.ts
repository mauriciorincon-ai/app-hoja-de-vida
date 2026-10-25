import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import {
  NUMEROS_ES,
  normalizar,
  verdadesDelSitio,
} from "../../scripts/a-fondo-coherencia.mjs";

/**
 * LAS CUENTAS QUE ESCRIBEN LA GUÍA DE PRUEBA Y EL MANUAL (2026-10-11).
 *
 * El corpus del chat tiene su gate de cifras desde el disco (ADR-025); la guía
 * y el manual no lo tenían. Cuando el PR de contenido #73 llevó la vitrina de
 * 6 a 10 apps y de 13 a 15 agentes, el corpus se alineó solo —su gate lo
 * exigió— y la guía y el manual siguieron diciendo «Apps 6 · Agentes 13»,
 * «las 32 fichas» y «recorre las seis»: el dueño habría probado contra
 * números falsos.
 *
 * Cada ANCLA es una frase concreta de un documento que lleva una cuenta. El
 * gate exige que la frase exista (si alguien la reescribe, el gate falla y hay
 * que moverle el ancla: así no muere en silencio) y que cada número que
 * captura sea el que sale del disco. El historial de la guía (su pie) y las
 * tablas de historial del manual no se miran: registran lo que era cierto en
 * su fecha.
 */

const V = verdadesDelSitio();

/**
 * Lo PUBLICADO, no lo que hay en disco: un frente en pausa (`en-preparacion`) conserva
 * sus fichas en `content/` pero el sitio no las enseña, no las lista y el chat no las
 * cita. La guía habla de lo que el dueño ve y de lo que el chat cita; el corpus sigue
 * contando el disco (decisión S22: no reescribir la prosa de las siete líneas).
 */
const ABIERTOS = new Set(
  (
    parse(readFileSync("data/vitrina.yaml", "utf8")) as {
      categorias: { id: string; estado: string }[];
    }
  ).categorias
    .filter((c) => c.estado === "abierta")
    .map((c) => c.id),
);
const PUBLICADAS = {
  agentes: ABIERTOS.has("agentes") ? V["agentes-vitrina"] : 0,
  investigaciones: ABIERTOS.has("investigaciones") ? V.investigaciones : 0,
  tableros: ABIERTOS.has("tableros") ? V.tableros : 0,
};
const FICHAS_DE_OTRAS_CASAS =
  PUBLICADAS.agentes + PUBLICADAS.investigaciones + PUBLICADAS.tableros;

/** Apps cuyo complemento trae al menos una feature de roadmap votable. */
const APPS_CON_ROADMAP = readdirSync("data/fichas")
  .filter((f) => f.endsWith(".yaml"))
  .filter((f) => {
    const c = parse(readFileSync(path.join("data/fichas", f), "utf8"));
    return Array.isArray(c?.roadmap) && c.roadmap.length > 0;
  }).length;

/** «10», «diez» o «Diez» → 10. */
function numero(texto: string): number {
  const t = normalizar(texto.trim());
  return /^\d+$/.test(t) ? Number(t) : (NUMEROS_ES.get(t) ?? Number.NaN);
}

function sinEtiquetas(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

const guia = (() => {
  const html = readFileSync("docs/GUIA-DE-PRUEBA.html", "utf8");
  return sinEtiquetas(html.slice(0, html.indexOf("<footer")));
})();

const manual = (() => {
  const md = readFileSync("docs/MANUAL-DE-USO.md", "utf8");
  return md.slice(0, md.indexOf("\n## Historial")).replace(/\s+/g, " ");
})();

type Ancla = {
  doc: "guía" | "manual";
  nombre: string;
  patron: RegExp;
  /** Lo que debe valer cada grupo capturado, en orden. */
  esperado: number[];
  /** Cuántas veces debe aparecer la frase como mínimo. */
  minimo?: number;
};

const ANCLAS: Ancla[] = [
  {
    doc: "guía",
    nombre: "cuentas del portal y de la HOME (k1b, n4b)",
    // Investigaciones está en pausa: no lleva número, dice «En preparación».
    patron: /Apps (\d+) · Agentes (\d+) · Tableros (\d+)/g,
    esperado: [V.apps, PUBLICADAS.agentes, PUBLICADAS.tableros],
    minimo: 2,
  },
  {
    doc: "guía",
    nombre: "tarjetas del escaparate de apps (k1b)",
    patron: /llegas al escaparate con (\S+) tarjetas/g,
    esperado: [V.apps],
  },
  {
    doc: "guía",
    nombre: "fichas de apps en la aprobación visual (l5b)",
    patron: /recorre las (\S+) fichas seguidas/g,
    esperado: [V.apps],
  },
  {
    doc: "guía",
    nombre: "apps con roadmap (g1d)",
    patron:
      /Recorre las (\S+?)(?: que lo tienen)?: cada una tiene su propio grupo/g,
    esperado: [APPS_CON_ROADMAP],
  },
  {
    doc: "guía",
    nombre: "fichas del bloque M",
    patron: /Las (\d+) fichas de agentes y tableros/g,
    esperado: [PUBLICADAS.agentes + PUBLICADAS.tableros],
  },
  {
    doc: "guía",
    nombre: "agentes publicados (m1b)",
    patron: /dice "(\d+) productos publicad[oa]s" y debajo hay (\d+) tarjetas/g,
    esperado: [V["agentes-vitrina"], V["agentes-vitrina"]],
  },
  {
    doc: "guía",
    nombre: "fichas en el índice del chat (o12b)",
    patron: /Son las (\d+) fichas/g,
    esperado: [V.apps + FICHAS_DE_OTRAS_CASAS],
  },
  {
    doc: "manual",
    nombre: "piezas del frente Apps",
    patron: /\*\*Apps\*\* \(`\/es\/portafolio\/apps`\):.*?\*\*(\d+) piezas\.\*\*/g,
    esperado: [V.apps],
  },
  {
    doc: "manual",
    nombre: "piezas del frente Agentes",
    patron:
      /\*\*Agentes especializados\*\* \(`\/es\/portafolio\/agentes`\):.*?\*\*(\d+) piezas\.\*\*/g,
    esperado: [V["agentes-vitrina"]],
  },
  {
    doc: "manual",
    nombre: "piezas del frente Investigaciones",
    patron:
      /\*\*Investigaciones\*\* \(`\/es\/portafolio\/investigaciones`\):.*?\*\*(\d+) piezas\.\*\*/g,
    esperado: [V.investigaciones],
  },
  {
    doc: "manual",
    nombre: "piezas del frente Tableros",
    patron:
      /\*\*Tableros de datos\*\* \(`\/es\/portafolio\/tableros`\):.*?\*\*(\d+) piezas\.\*\*/g,
    esperado: [V.tableros],
  },
  {
    doc: "guía",
    nombre: "publicaciones de «Métodos» (q1)",
    patron: /llegas a \/es\/metodos, con (\S+) publicaciones?/g,
    esperado: [V["piezas-metodo"]],
  },
  {
    doc: "manual",
    nombre: "publicaciones de «Métodos» (hoy hay)",
    patron: /Hoy hay (\S+) piezas? publicadas?/g,
    esperado: [V["piezas-metodo"]],
  },
  {
    doc: "manual",
    nombre: "publicaciones de «Métodos» (limitaciones)",
    // S19: con la novena pieza la serie quedó completa y «hasta ahora» dejó de ser cierto.
    patron: /las (\S+) piezas de la serie están publicadas/g,
    esperado: [V["piezas-metodo"]],
  },
  {
    doc: "manual",
    nombre: "fichas en el índice del chat",
    patron: /incluye las \*\*(\d+) fichas del portafolio\*\*/g,
    esperado: [V.apps + FICHAS_DE_OTRAS_CASAS],
  },
];

describe("las cuentas de la guía de prueba y del manual salen del disco", () => {
  it.each(ANCLAS.map((a) => [`${a.doc} · ${a.nombre}`, a] as const))(
    "%s",
    (_, ancla) => {
      const texto = ancla.doc === "guía" ? guia : manual;
      const hallazgos = [...texto.matchAll(ancla.patron)];
      expect(
        hallazgos.length,
        `la frase de «${ancla.nombre}» no está en ${ancla.doc}: si se reescribió, muévele el ancla`,
      ).toBeGreaterThanOrEqual(ancla.minimo ?? 1);
      for (const h of hallazgos) {
        const dice = h.slice(1).map(numero);
        expect(dice, `${ancla.doc} dice «${h[0]}»`).toEqual(ancla.esperado);
      }
    },
  );
});
