import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  medio,
  rangos,
  trazarFlujo,
  UMBRAL_VERTICAL,
  type Flujo,
  type Trazado,
} from "@/lib/brochure/flujo";

/**
 * EL MOTOR DEL FLUJO (S28): el de la maqueta aprobada, portado al servidor.
 *
 * 1. DIFERENCIAL. `tests/fixtures/flujo-dorado.json` guarda, para los 22 flujos reales (los 10 de
 *    Innmobiliaria v2 y los 12 procesos de las fichas) a 358, 599, 700 y 1082 px, lo que dibuja EL
 *    CÓDIGO DE LA MAQUETA (generado una vez con él; es dato, no código). El port tiene que dibujar lo
 *    mismo, caja por caja y flecha por flecha, al medio píxel.
 * 2. INVARIANTES. Lo que el dibujo promete, comprobado en esos 22 flujos a 13 anchos: capas por el
 *    camino más largo, vueltas punteadas, serpentina, vertical bajo 600, nada fuera del lienzo y
 *    ninguna flecha atravesando una caja que no es la suya.
 */

type Caso = {
  clave: string;
  ancho: number;
  modo: "h" | "v";
  porFila: number;
  anchoCaja: number;
  w: number;
  h: number;
  nodos: [string, number, number, number, number][];
  aristas: [string, boolean][];
  etiquetas: [number, number, string, number][];
};
const DORADO = JSON.parse(
  readFileSync("tests/fixtures/flujo-dorado.json", "utf8"),
) as {
  flujos: Record<string, Flujo>;
  anchos: number[];
  casos: Caso[];
};

/**
 * LA ÚNICA CORRECCIÓN A LA MAQUETA: los desvíos de una flecha que cambia de fila se miden desde el
 * borde de la COLUMNA, no desde el de la caja. Con una caja angosta (un fin sin rótulo) bajo otra de su
 * columna, la maqueta bajaba la flecha por dentro de la columna y atravesaba la caja de encima (su
 * README dice «nunca sobre una caja»; nunca pintó los procesos de la casa, donde ocurre). En estos
 * casos el port difiere SOLO en las flechas —y sus rótulos— que tocan una caja angosta; en todos los
 * demás es idéntico. Un caso de esta lista que deje de diferir falla, para que se retire.
 */
const CORRECCION_COLUMNA = new Set([
  "inmobiliaria/g1@700",
  "dash-agent-ai/proceso@700",
  "dash-agent-ai/proceso@1082",
  "nutri-kids/proceso@700",
  "nutri-kids/proceso@1082",
  "hoja-de-vida/proceso@700",
  "hoja-de-vida/proceso@1082",
  "chat-hoja-de-vida/proceso@700",
]);

describe("diferencial: el port dibuja lo mismo que la maqueta", () => {
  it("hay un caso por flujo y por ancho (22 flujos × 4 anchos)", () => {
    expect(Object.keys(DORADO.flujos)).toHaveLength(22);
    expect(DORADO.casos).toHaveLength(22 * DORADO.anchos.length);
  });

  it.each(DORADO.casos.map((c) => [`${c.clave} a ${c.ancho} px`, c] as const))(
    "%s",
    (_n, c) => {
      const t = trazarFlujo(DORADO.flujos[c.clave]!, c.ancho);
      expect({
        modo: t.modo,
        porFila: t.porFila,
        anchoCaja: t.anchoCaja,
        w: t.w,
        h: t.h,
      }).toEqual({
        modo: c.modo,
        porFila: c.porFila,
        anchoCaja: c.anchoCaja,
        w: c.w,
        h: c.h,
      });
      expect(t.nodos.map((n) => [n.id, n.x, n.y, n.w, n.h])).toEqual(c.nodos);
      expect(t.aristas.map((a) => a.vuelta)).toEqual(
        c.aristas.map(([, v]) => v),
      );
      expect(t.etiquetas.map((e) => e.t)).toEqual(
        c.etiquetas.map(([, , texto]) => texto),
      );

      const angostas = new Set(
        t.nodos.filter((n) => n.w < t.anchoCaja).map((n) => n.id),
      );
      const tocaAngosta = (x: { de: string; a: string }) =>
        angostas.has(x.de) || angostas.has(x.a);
      const distintas = t.aristas.filter((a, i) => a.d !== c.aristas[i]![0]);
      const rotulosDistintos = t.etiquetas.filter((e, i) => {
        const [x, y, , max] = c.etiquetas[i]!;
        return e.x !== x || e.y !== y || e.max !== max;
      });
      if (CORRECCION_COLUMNA.has(`${c.clave}@${c.ancho}`)) {
        expect(
          distintas.length,
          "un caso corregido que ya no difiere: sácalo de la lista",
        ).toBeGreaterThan(0);
        for (const a of distintas)
          expect(tocaAngosta(a), `${a.de}→${a.a}`).toBe(true);
        for (const e of rotulosDistintos)
          expect(tocaAngosta(e), `rótulo ${e.de}→${e.a}`).toBe(true);
      } else {
        expect(distintas.map((a) => `${a.de}→${a.a}`)).toEqual([]);
        expect(rotulosDistintos.map((e) => `${e.de}→${e.a}`)).toEqual([]);
      }
    },
  );
});

/* ── invariantes ───────────────────────────────────────────────────────────────────────── */

const ANCHOS = [
  320, 358, 420, 599, 600, 604, 640, 700, 800, 960, 1082, 1240, 1400,
];

/** Puntos a lo largo de un path M/L/C/Q (24 por tramo). */
function muestras(d: string): [number, number][] {
  const toks = d.match(/[MLCQ]|-?\d+(?:\.\d+)?/g)!;
  const pts: [number, number][] = [];
  let i = 0;
  let cur: [number, number] = [0, 0];
  const n = () => Number(toks[i++]);
  while (i < toks.length) {
    const c = toks[i++];
    if (c === "M") {
      cur = [n(), n()];
      pts.push(cur);
    } else if (c === "L") {
      const p: [number, number] = [n(), n()];
      for (let k = 1; k <= 24; k++)
        pts.push([
          cur[0] + ((p[0] - cur[0]) * k) / 24,
          cur[1] + ((p[1] - cur[1]) * k) / 24,
        ]);
      cur = p;
    } else if (c === "Q") {
      const q1: [number, number] = [n(), n()];
      const p: [number, number] = [n(), n()];
      for (let k = 1; k <= 24; k++) {
        const t = k / 24;
        const u = 1 - t;
        pts.push([
          u * u * cur[0] + 2 * u * t * q1[0] + t * t * p[0],
          u * u * cur[1] + 2 * u * t * q1[1] + t * t * p[1],
        ]);
      }
      cur = p;
    } else if (c === "C") {
      const c1: [number, number] = [n(), n()];
      const c2: [number, number] = [n(), n()];
      const p: [number, number] = [n(), n()];
      for (let k = 1; k <= 24; k++) {
        const t = k / 24;
        const u = 1 - t;
        pts.push([
          u ** 3 * cur[0] +
            3 * u * u * t * c1[0] +
            3 * u * t * t * c2[0] +
            t ** 3 * p[0],
          u ** 3 * cur[1] +
            3 * u * u * t * c1[1] +
            3 * u * t * t * c2[1] +
            t ** 3 * p[1],
        ]);
      }
      cur = p;
    } else throw new Error(`comando desconocido en «${d}»: ${c}`);
  }
  return pts;
}

/** Las flechas que atraviesan una caja ajena (con 2 px de holgura en cada borde). */
function cruces(t: Trazado): string[] {
  const malos: string[] = [];
  for (const a of t.aristas)
    for (const n of t.nodos) {
      if (n.id === a.de || n.id === a.a) continue;
      const dentro = muestras(a.d).some(
        ([x, y]) =>
          x > n.x + 2 && x < n.x + n.w - 2 && y > n.y + 2 && y < n.y + n.h - 2,
      );
      if (dentro) malos.push(`${a.de}→${a.a} atraviesa «${n.id}»`);
    }
  return malos;
}

/**
 * CRUCES CONOCIDOS desde el primer día (mismo trato que `CRUCE_CON_DEUDA` del S27): la flecha cruza
 * una caja en el dibujo de la maqueta, y el port es fiel a ella. Van al lote del hito con su lista;
 * una entrada que deja de cruzar falla aquí para que se retire.
 */
const CRUCE_CON_DEUDA: Record<string, string[]> = {};

describe.each(Object.entries(DORADO.flujos))(
  "invariantes de %s",
  (clave, flujo) => {
    const base = rangos(flujo);

    it("capas por el camino más largo: cada caja va una capa después de la más lejana que la precede", () => {
      const preds = new Map<string, string[]>(
        flujo.nodos.map((n) => [n.id, []]),
      );
      for (const a of base.adelante) preds.get(a.a)!.push(a.de);
      for (const n of flujo.nodos) {
        const p = preds.get(n.id)!;
        const esperado = p.length
          ? Math.max(...p.map((x) => base.r.get(x)!)) + 1
          : 0;
        expect(base.r.get(n.id), n.id).toBe(esperado);
      }
      // y sin ciclos hacia adelante: toda arista que no es vuelta avanza
      for (const a of base.adelante)
        expect(base.r.get(a.a)!).toBeGreaterThan(base.r.get(a.de)!);
    });

    it("las vueltas declaradas son vueltas, y se dibujan todas punteadas", () => {
      for (const a of flujo.aristas.filter((x) => x.vuelta))
        expect(base.vuelta).toContain(a);
      const t = trazarFlujo(flujo, 1082);
      expect(t.aristas.filter((a) => a.vuelta)).toHaveLength(
        base.vuelta.length,
      );
      expect(t.aristas).toHaveLength(base.adelante.length + base.vuelta.length);
    });

    it.each(ANCHOS)("a %i px: modo, serpentina, lienzo y cruces", (ancho) => {
      const t = trazarFlujo(flujo, ancho);
      // vertical por debajo de 600 px útiles (el marco menos 4)
      expect(t.modo).toBe(ancho - 4 < UMBRAL_VERTICAL ? "v" : "h");
      // serpentina: en las filas impares, más capa = más a la izquierda
      if (t.modo === "h") {
        const xDe = new Map(t.nodos.map((n) => [n.id, n.x + n.w / 2]));
        const porRango = new Map<number, number>();
        for (const n of flujo.nodos)
          porRango.set(base.r.get(n.id)!, xDe.get(n.id)!);
        for (const [rk, x] of porRango) {
          const sig = porRango.get(rk + 1);
          if (
            sig === undefined ||
            Math.floor(rk / t.porFila) !== Math.floor((rk + 1) / t.porFila)
          )
            continue;
          const impar = Math.floor(rk / t.porFila) % 2 === 1;
          if (impar) expect(sig, `${clave} capa ${rk + 1}`).toBeLessThan(x);
          else expect(sig, `${clave} capa ${rk + 1}`).toBeGreaterThan(x);
        }
      }
      // todo dentro del lienzo
      for (const n of t.nodos) {
        expect(n.x).toBeGreaterThanOrEqual(0);
        expect(n.y).toBeGreaterThanOrEqual(0);
        expect(n.x + n.w).toBeLessThanOrEqual(t.w);
        expect(n.y + n.h).toBeLessThanOrEqual(t.h);
      }
      for (const a of t.aristas)
        for (const [x, y] of muestras(a.d)) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(t.w);
          expect(y).toBeLessThanOrEqual(t.h);
        }
      // ninguna flecha atraviesa una caja ajena (salvo la deuda declarada)
      const deuda = CRUCE_CON_DEUDA[`${clave}@${ancho}`] ?? [];
      expect(cruces(t)).toEqual(deuda);
    });

    it("es determinista: el mismo flujo y el mismo ancho dan el mismo dibujo", () => {
      expect(trazarFlujo(flujo, 840)).toEqual(trazarFlujo(flujo, 840));
    });
  },
);

describe("piezas del motor", () => {
  it("medio redondea al medio píxel", () => {
    expect(medio(10.24)).toBe(10);
    expect(medio(10.26)).toBe(10.5);
    expect(medio(10.76)).toBe(11);
  });

  it("una vuelta que cierra un ciclo sin declararse la detecta el DFS y la dibuja punteada", () => {
    const fl: Flujo = {
      nodos: [
        { id: "a", tipo: "inicio", texto: "A" },
        { id: "b", tipo: "tarea", texto: "B" },
        { id: "c", tipo: "decision", texto: "¿C?" },
        { id: "d", tipo: "fin", texto: "" },
      ],
      aristas: [
        { de: "a", a: "b" },
        { de: "b", a: "c" },
        { de: "c", a: "b", etq: "no" },
        { de: "c", a: "d", etq: "sí" },
      ],
    };
    const b = rangos(fl);
    expect(b.vuelta.map((a) => `${a.de}>${a.a}`)).toEqual(["c>b"]);
    expect(b.r.get("d")).toBe(3);
    const t = trazarFlujo(fl, 1000);
    expect(t.aristas.find((a) => a.vuelta)).toMatchObject({ de: "c", a: "b" });
    // un fin sin rótulo es un círculo de 40 px
    expect(t.nodos.find((n) => n.id === "d")).toMatchObject({ w: 40, h: 40 });
  });
});
