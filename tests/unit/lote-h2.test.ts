import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * EL LOTE DEL CIERRE DEL H-2 (Sprint 020) — `sprints/SPRINT_020-lote.md`.
 *
 * Todo medio y bajo de los cierres S9–S19 termina ahí con UN estado final y su
 * prueba. Este gate vigila lo que un lote deja caer en silencio:
 *
 *  · el estado es uno de tres —pagado · ya no aplica · imposible—: ninguna fila
 *    queda «abierta», «pendiente» o sin nombre;
 *  · la prueba no está vacía y «no reproducible» no cierra una fila;
 *  · un `pagado` nombra su commit o su archivo; un `imposible` nombra su sitio;
 *    un `ya no aplica` nombra lo que se puede comprobar hoy;
 *  · cada archivo que la prueba cita (`src/…`, `tests/…`, `scripts/…`, `data/…`,
 *    `docs/…`, `sprints/…`…) existe y cada línea citada cae dentro del archivo:
 *    si alguien lo renombra o lo acorta, el lote falla y hay que moverle el sitio;
 *  · ningún sprint del S9 al S19 desaparece de la tabla.
 *
 * La función `problemasDelLote` es pura y se prueba con un lote roto armado en
 * memoria: así el rojo viaja con el gate (regla 15).
 */
const RAIZ = process.cwd();
const RUTA = path.join(RAIZ, "sprints", "SPRINT_020-lote.md");

const ESTADOS = ["pagado", "ya no aplica", "imposible"];
const SPRINTS = Array.from({ length: 11 }, (_, i) =>
  String(i + 9).padStart(2, "0"),
);
const RAICES = [
  "src",
  "tests",
  "scripts",
  "data",
  "docs",
  "sprints",
  "messages",
  "decisions",
  "public",
  ".claude",
  ".github",
];

type Fila = {
  id: string;
  origen: string;
  hallazgo: string;
  estado: string;
  prueba: string;
};

function celdas(linea: string): string[] {
  return linea
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

/** Filas de la tabla «Filas» (las que empiezan por `| S09-…`). */
function leerFilas(md: string): { filas: Fila[]; mal: string[] } {
  const filas: Fila[] = [];
  const mal: string[] = [];
  for (const linea of md.split("\n")) {
    if (!/^\|\s*S\d{2}-/.test(linea)) continue;
    const c = celdas(linea);
    if (c.length !== 5) {
      mal.push(
        `${c[0] ?? linea.slice(0, 12)}: la fila tiene ${c.length} celdas, no 5`,
      );
      continue;
    }
    filas.push({
      id: c[0],
      origen: c[1],
      hallazgo: c[2],
      estado: c[3],
      prueba: c[4],
    });
  }
  return { filas, mal };
}

/** Tablas «Decisiones del dueño…» y «Reportes…»: filas `| n | …`. */
function leerTablaNumerada(md: string, titulo: string): string[][] {
  const i = md.indexOf(`## ${titulo}`);
  if (i < 0) return [];
  const resto = md.slice(i + 3);
  const fin = resto.search(/\n## /);
  const bloque = fin < 0 ? resto : resto.slice(0, fin);
  return bloque
    .split("\n")
    .filter((l) => /^\|\s*\d+\s*\|/.test(l))
    .map(celdas);
}

/** `src/lib/x.ts:12-30` → { ruta, lineas: [12, 30] }; null si no es una ruta del repo. */
function rutaCitada(token: string): { ruta: string; lineas: number[] } | null {
  if (/[{}*…\s]|\.\./.test(token)) return null;
  const m = token.match(/^([^:]+)((?::[\d,\-–]+)?)$/);
  if (!m) return null;
  const ruta = m[1];
  if (!RAICES.some((r) => ruta === r || ruta.startsWith(`${r}/`))) return null;
  const lineas = (m[2].match(/\d+/g) ?? []).map(Number);
  return { ruta, lineas };
}

export function problemasDelLote(md: string): string[] {
  const problemas: string[] = [];
  const { filas, mal } = leerFilas(md);
  problemas.push(...mal);

  const vistos = new Set<string>();
  for (const f of filas) {
    if (!/^S\d{2}-[A-Z]\d+$/.test(f.id))
      problemas.push(`${f.id}: el ID no tiene la forma S09-M1`);
    if (vistos.has(f.id)) problemas.push(`${f.id}: el ID está repetido`);
    vistos.add(f.id);

    for (const [campo, valor] of Object.entries(f)) {
      if (!valor) problemas.push(`${f.id}: la celda «${campo}» está vacía`);
    }
    if (!ESTADOS.includes(f.estado)) {
      problemas.push(
        `${f.id}: el estado «${f.estado}» no es ${ESTADOS.join(" · ")} (una fila abierta no cierra el lote)`,
      );
      continue;
    }
    if (f.prueba.length < 25)
      problemas.push(
        `${f.id}: la prueba es demasiado corta para ser una prueba`,
      );
    if (/^no reproducible/i.test(f.prueba))
      problemas.push(`${f.id}: «no reproducible» no cierra una fila`);
    if (/\b(abierto|pendiente|por decidir)\b/i.test(f.prueba))
      problemas.push(`${f.id}: la prueba habla de algo que queda abierto`);

    if (
      f.estado === "pagado" &&
      !/\b[0-9a-f]{7,40}\b|\.\w{2,5}\b/.test(f.prueba)
    )
      problemas.push(`${f.id}: un «pagado» nombra su commit o su archivo`);
    if (f.estado === "imposible" && !/Sitio:/.test(f.prueba))
      problemas.push(`${f.id}: un «imposible» nombra su sitio («Sitio: …»)`);
    if (f.estado === "ya no aplica" && !/`[^`]+`/.test(f.prueba))
      problemas.push(
        `${f.id}: un «ya no aplica» nombra lo que se comprueba hoy (archivo, línea o comando entre comillas invertidas)`,
      );
  }

  for (const s of SPRINTS) {
    if (!filas.some((f) => f.id.startsWith(`S${s}-`)))
      problemas.push(`S${s}: el sprint no tiene ninguna fila en el lote`);
  }
  return problemas;
}

/** Archivos y líneas que las pruebas citan: deben existir hoy. */
export function sitiosRotos(md: string, raiz = RAIZ): string[] {
  const rotos: string[] = [];
  for (const f of leerFilas(md).filas) {
    for (const [, token] of f.prueba.matchAll(/`([^`]+)`/g)) {
      const c = rutaCitada(token);
      if (!c) continue;
      const abs = path.join(raiz, c.ruta);
      if (!existsSync(abs)) {
        rotos.push(`${f.id}: «${c.ruta}» ya no existe`);
        continue;
      }
      if (c.lineas.length && /\.\w+$/.test(c.ruta)) {
        const total = readFileSync(abs, "utf8").split("\n").length;
        const max = Math.max(...c.lineas);
        if (max > total)
          rotos.push(
            `${f.id}: «${c.ruta}:${max}» pasa del final (${total} líneas)`,
          );
      }
    }
  }
  return rotos;
}

const lote = readFileSync(RUTA, "utf8");

describe("El lote del cierre del H-2 (sprints/SPRINT_020-lote.md)", () => {
  it("cada fila tiene un estado final y su prueba, y ninguna queda abierta", () => {
    expect(problemasDelLote(lote)).toEqual([]);
  });

  it("los archivos y las líneas que las pruebas citan existen hoy", () => {
    expect(sitiosRotos(lote)).toEqual([]);
  });

  it("las decisiones del dueño y los reportes a otras casas dicen dónde se miran", () => {
    const decisiones = leerTablaNumerada(
      lote,
      "Decisiones del dueño que viajan al ensayo",
    );
    expect(decisiones.length).toBeGreaterThan(0);
    for (const d of decisiones) {
      expect(d, `decisión ${d[0]}: sin «dónde se mira»`).toHaveLength(3);
      expect(d[1].length).toBeGreaterThan(10);
      expect(
        d[2].length,
        `decisión ${d[0]}: sin «dónde se mira»`,
      ).toBeGreaterThan(3);
    }
    const reportes = leerTablaNumerada(
      lote,
      "Reportes a otras casas (regla dura 2: aquí no se editan)",
    );
    expect(reportes.length).toBeGreaterThan(0);
    for (const r of reportes)
      expect(r, `reporte ${r[0]}: sin destinatario`).toHaveLength(3);
  });
});

describe("El gate del lote falla cuando el lote se rompe (el rojo viaja con el gate)", () => {
  const buena =
    "| S09-M1 | S9 | Algo | pagado | 81661de (PR #78): `src/lib/content.ts` |";
  const base = SPRINTS.map(
    (s) =>
      `| S${s}-M1 | S${s} | Algo | pagado | abc1234 en \`src/lib/content.ts\` |`,
  ).join("\n");

  it("atrapa una fila abierta nombrando su ID", () => {
    const md = base.replace(
      "S12-M1 | S12 | Algo | pagado",
      "S12-M1 | S12 | Algo | abierto",
    );
    expect(problemasDelLote(md).join("\n")).toMatch(
      /S12-M1: el estado «abierto»/,
    );
  });

  it("atrapa «no reproducible» y una prueba vacía", () => {
    const md = [
      base,
      "| S13-B1 | S13 | Algo | ya no aplica | no reproducible en local, sin más pruebas |",
      "| S13-B2 | S13 | Algo | pagado |  |",
    ].join("\n");
    const p = problemasDelLote(md).join("\n");
    expect(p).toMatch(/S13-B1: «no reproducible» no cierra una fila/);
    expect(p).toMatch(/S13-B2: la celda «prueba» está vacía/);
  });

  it("atrapa un imposible sin sitio y un ya no aplica sin nada comprobable", () => {
    const md = [
      base,
      "| S14-B1 | S14 | Algo | imposible | otra casa, no se puede aquí ahora |",
      "| S14-B2 | S14 | Algo | ya no aplica | ya se resolvió de otra manera, créeme |",
    ].join("\n");
    const p = problemasDelLote(md).join("\n");
    expect(p).toMatch(/S14-B1: un «imposible» nombra su sitio/);
    expect(p).toMatch(
      /S14-B2: un «ya no aplica» nombra lo que se comprueba hoy/,
    );
  });

  it("atrapa un sprint que desaparece de la tabla y un ID repetido", () => {
    const md =
      base
        .split("\n")
        .filter((l) => !l.startsWith("| S15-"))
        .join("\n") +
      "\n" +
      buena +
      "\n" +
      buena;
    const p = problemasDelLote(md).join("\n");
    expect(p).toMatch(/S15: el sprint no tiene ninguna fila/);
    expect(p).toMatch(/S09-M1: el ID está repetido/);
  });

  it("atrapa un sitio que ya no existe y una línea que pasa del final", () => {
    const md = [
      "| S09-M1 | S9 | Algo | pagado | abc1234 en `src/lib/no-existe-nunca.ts` |",
      "| S09-M2 | S9 | Algo | pagado | abc1234 en `package.json:99999` |",
    ].join("\n");
    const p = sitiosRotos(md).join("\n");
    expect(p).toMatch(/S09-M1: «src\/lib\/no-existe-nunca.ts» ya no existe/);
  });

  it("una línea de un archivo real que pasa del final se nombra", () => {
    const md =
      "| S09-M2 | S9 | Algo | pagado | abc1234 en `scripts/horas-sprint.mjs:99999` |";
    expect(sitiosRotos(md).join("\n")).toMatch(
      /S09-M2: «scripts\/horas-sprint.mjs:99999» pasa del final/,
    );
  });
});
