import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
  G,
  MAX_CARACTERES_DENTRO_DECISION,
  partirTexto,
  trazar,
  type Proceso,
} from "@/lib/vitrina/bpmn";

/**
 * El motor BPMN (ADR-016) es geometría pura: aquí se prueban las invariantes
 * que hacen legible un diagrama, no píxeles concretos.
 */

const habla = (
  parse(readFileSync("data/fichas/habla.yaml", "utf8")) as { proceso: Proceso }
).proceso;

const mini: Proceso = {
  titulo: "Mini",
  carriles: [
    { id: "a", nombre: "A" },
    { id: "b", nombre: "B" },
  ],
  pasos: [
    { id: "ini", tipo: "inicio", carril: "a", texto: "" },
    { id: "t1", tipo: "tarea", carril: "a", texto: "Primera tarea" },
    { id: "t2", tipo: "tarea", carril: "b", texto: "Segunda tarea" },
    { id: "d", tipo: "decision", carril: "a", texto: "¿Sí?" },
    { id: "fin", tipo: "fin", carril: "a", texto: "" },
  ],
  flujos: [
    { de: "ini", a: "t1" },
    { de: "t1", a: "t2" },
    { de: "t2", a: "d" },
    { de: "d", a: "fin", etiqueta: "sí" },
    { de: "d", a: "t1", etiqueta: "no" },
  ],
  anotaciones: [{ paso: "t2", texto: "Una nota" }],
};

describe("partirTexto", () => {
  it("no corta palabras y respeta el máximo", () => {
    const l = partirTexto("Mide energía y tono, en memoria", 17);
    expect(l).toEqual(["Mide energía y", "tono, en memoria"]);
    for (const x of l) expect(x.length).toBeLessThanOrEqual(17);
  });
  it("tres líneas como máximo, con elipsis", () => {
    const l = partirTexto(
      "una dos tres cuatro cinco seis siete ocho nueve diez once doce",
      10,
    );
    expect(l).toHaveLength(3);
    expect(l[2].endsWith("…")).toBe(true);
  });
});

describe("trazar — invariantes del diagrama", () => {
  it("cada nodo cae dentro de su carril y de su fila", () => {
    const t = trazar(habla);
    for (const n of t.nodos) {
      const fila = t.filas[n.fila];
      const carril = fila.carriles.find((c) => c.id === n.carril)!;
      expect(n.t).toBeGreaterThanOrEqual(carril.y);
      expect(n.b).toBeLessThanOrEqual(carril.y + carril.alto);
      expect(n.l).toBeGreaterThanOrEqual(G.ROTULO_CARRIL + G.ENLACE);
      expect(n.r).toBeLessThanOrEqual(t.ancho - G.ENLACE);
    }
  });

  it("dos nodos nunca se pisan", () => {
    const t = trazar(habla);
    for (const a of t.nodos)
      for (const b of t.nodos) {
        if (a.id === b.id) continue;
        const separados = a.r <= b.l || b.r <= a.l || a.b <= b.t || b.b <= a.t;
        expect(separados, `${a.id} pisa a ${b.id}`).toBe(true);
      }
  });

  it("un proceso largo se parte en filas y los cruces van con eventos de enlace emparejados", () => {
    const t = trazar(habla, { columnasPorFila: 6 });
    expect(t.filas).toHaveLength(2);
    expect(t.enlaces.length).toBeGreaterThan(0);
    const letras = t.enlaces.map((e) => e.letra);
    expect(new Set(letras).size).toBe(letras.length); // una letra por cruce
    for (const e of t.enlaces) {
      // Salida en el margen derecho de la fila de origen; entrada en el izquierdo de la destino.
      expect(e.salida.x).toBe(t.ancho - G.ENLACE / 2);
      expect(e.entrada.x).toBe(G.ROTULO_CARRIL + G.ENLACE / 2);
    }
    // Y los flujos que cruzan van por CANAL, nunca en recta por el carril
    // (entre el nodo y el margen puede haber otros nodos).
    const nodo = Object.fromEntries(t.nodos.map((n) => [n.id, n]));
    for (const e of t.enlaces) {
      const A = nodo[e.de];
      const B = nodo[e.a];
      const sal = t.flujos.find(
        (f) => f.de === e.de && f.a === `enlace:${e.letra}`,
      )!;
      const ent = t.flujos.find(
        (f) => f.de === `enlace:${e.letra}` && f.a === e.a,
      )!;
      const estorbaDer = t.nodos.some(
        (n) => n.fila === A.fila && n.carril === A.carril && n.col > A.col,
      );
      const estorbaIzq = t.nodos.some(
        (n) => n.fila === B.fila && n.carril === B.carril && n.col < B.col,
      );
      // Recta si el carril está libre; por canal (abajo / arriba) si hay nodos en medio.
      expect(
        sal.d.startsWith(estorbaDer ? `M${A.x},${A.b} V` : `M${A.r},${A.y} H`),
      ).toBe(true);
      expect(ent.d.endsWith(estorbaIzq ? `H${B.x} V${B.t}` : `H${B.l}`)).toBe(
        true,
      );
    }
    // En habla se dan los dos casos: «acierto → habla» tiene nodos a su derecha
    // (va por canal) y «descarta → responde» no (va en recta).
    const porCanal = t.flujos.find(
      (f) => f.de === "acierto" && f.a.startsWith("enlace:"),
    )!;
    const enRecta = t.flujos.find(
      (f) => f.de === "descarta" && f.a.startsWith("enlace:"),
    )!;
    expect(porCanal.d).toMatch(/^M[\d.]+,[\d.]+ V/);
    expect(enRecta.d).toMatch(/^M[\d.]+,[\d.]+ H[\d.]+$/);
    // Y con filas anchas no hay cruces: todo en una fila.
    const una = trazar(habla, { columnasPorFila: 24 });
    expect(una.filas).toHaveLength(1);
    expect(una.enlaces).toHaveLength(0);
  });

  it("todo flujo arranca en el borde de su origen y termina en el de su destino", () => {
    const t = trazar(mini, { columnasPorFila: 24 });
    const nodo = Object.fromEntries(t.nodos.map((n) => [n.id, n]));
    for (const f of t.flujos) {
      const m = f.d.match(/^M([\d.]+),([\d.]+).*?([HV])([\d.]+)$/);
      expect(m, f.d).not.toBeNull();
      const A = nodo[f.de];
      const [x0, y0] = [Number(m![1]), Number(m![2])];
      const enBordeA = x0 === A.r || x0 === A.x; // sale por la derecha o por arriba/abajo
      expect(enBordeA, `${f.de}: ${f.d}`).toBe(true);
      expect(y0 === A.y || y0 === A.b || y0 === A.t).toBe(true);
    }
  });

  it("el bucle vuelve por debajo del pool y entra por abajo", () => {
    const t = trazar(mini, { columnasPorFila: 24 });
    const bucle = t.flujos.find((f) => f.de === "d" && f.a === "t1")!;
    const t1 = t.nodos.find((n) => n.id === "t1")!;
    expect(bucle.d.endsWith(`H${t1.x} V${t1.b}`)).toBe(true);
    expect(bucle.etiqueta).toBe("no");
  });

  it("las anotaciones se numeran en orden y marcan su nodo", () => {
    const t = trazar(habla);
    expect(t.notas.map((n) => n.n)).toEqual([1, 2]);
    const mide = t.nodos.find((n) => n.id === "mide")!;
    expect(mide.nota).toBe(1);
  });

  it("es determinista", () => {
    expect(trazar(habla)).toEqual(trazar(habla));
  });

  it("nombra el error cuando un flujo o un carril no existe", () => {
    expect(() =>
      trazar({ ...mini, flujos: [...mini.flujos, { de: "t1", a: "nada" }] }),
    ).toThrow(/t1 → nada/);
    expect(() =>
      trazar({
        ...mini,
        pasos: [
          ...mini.pasos,
          { id: "x", tipo: "tarea", carril: "zz", texto: "x" },
        ],
      }),
    ).toThrow(/«x».*«zz»/);
  });
});

/**
 * Lo que el usuario cazó a ojo el 2026-09-06 en DS y Nutrikids, convertido
 * en invariante sobre LOS SEIS procesos reales: rótulos que se pisaban
 * («no supera» + «sí»), un rótulo tachado por la vertical de otro flujo
 * («vuelve a los datos») y el texto de una compuerta atravesado por su flecha
 * de entrada («¿Con sus palabras?»). Geometría estimada: ~6.3px por carácter
 * a 10.5px semibold, 11px de alto.
 */
// El proceso es OPCIONAL en el contrato (v1.1.0): las apps que llegan con un
// complemento de otra casa (planlang, AngelGhost, Big-D, HackGuard desde
// 2026-10-11) no lo traen todavía. Aquí se trazan los que existen.
const procesosReales = readdirSync("data/fichas")
  .filter((f) => f.endsWith(".yaml"))
  .map((f) => ({
    slug: f.replace(/\.yaml$/, ""),
    proceso: (
      parse(readFileSync(`data/fichas/${f}`, "utf8")) as { proceso?: Proceso }
    ).proceso,
  }))
  .filter((p): p is { slug: string; proceso: Proceso } => Boolean(p.proceso));

type Caja = { l: number; r: number; t: number; b: number };
const PX_CARACTER = 6.3;
const ALTO_ROTULO = 11;

function cajaRotulo(f: {
  etiqueta?: string;
  lx?: number;
  ly?: number;
  anclaTexto?: "start" | "end";
}): Caja | null {
  if (!f.etiqueta || f.lx === undefined || f.ly === undefined) return null;
  const w = Array.from(f.etiqueta).length * PX_CARACTER;
  const l = f.anclaTexto === "end" ? f.lx - w : f.lx;
  return { l, r: l + w, t: f.ly - ALTO_ROTULO + 2, b: f.ly + 2 };
}

/** Segmentos (x1,y1,x2,y2) de un `d` hecho solo de M/H/V. */
function segmentos(d: string): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  let x = 0;
  let y = 0;
  for (const m of d.matchAll(/([MHV])(-?[\d.]+)(?:,(-?[\d.]+))?/g)) {
    const [, op, a, b] = m;
    if (op === "M") {
      x = Number(a);
      y = Number(b);
    } else if (op === "H") {
      out.push([x, y, Number(a), y]);
      x = Number(a);
    } else {
      out.push([x, y, x, Number(a)]);
      y = Number(a);
    }
  }
  return out;
}

const seCruzan = (a: Caja, b: Caja) =>
  !(a.r <= b.l || b.r <= a.l || a.b <= b.t || b.b <= a.t);

describe("trazar — los rótulos se leen (los procesos reales)", () => {
  for (const { slug, proceso } of procesosReales) {
    it(`${slug}: dos rótulos de flujo nunca se pisan`, () => {
      const t = trazar(proceso);
      const cajas = t.flujos
        .map((f) => ({ f, caja: cajaRotulo(f) }))
        .filter((x): x is { f: (typeof t.flujos)[number]; caja: Caja } =>
          Boolean(x.caja),
        );
      for (let i = 0; i < cajas.length; i++)
        for (let j = i + 1; j < cajas.length; j++)
          expect(
            seCruzan(cajas[i].caja, cajas[j].caja),
            `«${cajas[i].f.etiqueta}» (${cajas[i].f.de}→${cajas[i].f.a}) pisa a «${cajas[j].f.etiqueta}» (${cajas[j].f.de}→${cajas[j].f.a})`,
          ).toBe(false);
    });

    it(`${slug}: ningún rótulo queda tachado por la vertical de otro flujo`, () => {
      const t = trazar(proceso);
      for (const f of t.flujos) {
        const caja = cajaRotulo(f);
        if (!caja) continue;
        for (const otro of t.flujos) {
          if (otro === f) continue;
          for (const [x1, y1, x2, y2] of segmentos(otro.d)) {
            if (x1 !== x2) continue; // solo verticales
            const yt = Math.min(y1, y2);
            const yb = Math.max(y1, y2);
            const toca =
              x1 > caja.l && x1 < caja.r && yb > caja.t && yt < caja.b;
            expect(
              toca,
              `«${f.etiqueta}» (${f.de}→${f.a}) queda tachado por la vertical de ${otro.de}→${otro.a} en x=${x1}`,
            ).toBe(false);
          }
        }
      }
    });

    it(`${slug}: el texto de cada compuerta cabe en el rombo o va encima`, () => {
      const t = trazar(proceso);
      for (const n of t.nodos.filter((n) => n.tipo === "decision")) {
        if (n.rotuloFuera) {
          for (const l of n.lineas)
            expect(
              Array.from(l).length,
              `«${l}» de ${n.id}`,
            ).toBeLessThanOrEqual(16);
        } else {
          expect(
            Array.from(n.texto).length,
            `«${n.texto}» (${n.id}) no cabe dentro del rombo y no va encima`,
          ).toBeLessThanOrEqual(MAX_CARACTERES_DENTRO_DECISION);
        }
      }
    });
  }
});

/**
 * LOS EVENTOS DE ENLACE (S27). Cuando un proceso se parte en filas, cada cruce lleva un círculo con su letra en cada
 * margen. Dos cruces del mismo carril y fila caían en el MISMO punto —dos círculos encimados, las letras una sobre
 * otra, y el «sí» y el «no» de una misma compuerta en un solo trazo— y ningún gate lo miraba: solo veía que no se
 * pisaran los rótulos. Innmobiliaria (siete cruces, una compuerta con dos salidas) lo puso en rojo.
 * Invariantes: los círculos de un mismo margen nunca se tocan; cada flujo de un enlace termina (o empieza) EN su
 * círculo; y ningún flujo ajeno atraviesa el círculo de otro.
 */
describe("trazar — los eventos de enlace (los procesos reales)", () => {
  const R = G.RADIO_ENLACE;
  /**
   * DEUDA DECLARADA (S27, al lote del hito): en estos procesos el canal VERTICAL de una salida —baja al borde de la fila
   * y sube por el margen derecho— pasa por el centro del círculo de un enlace de un carril más abajo. Ya era así antes
   * del S27 (el trazo no cambió); lo vigila esta prueba por los dos lados: si un proceso nuevo lo hace, rojo; si uno de
   * estos deja de hacerlo, rojo también, para sacarlo de la lista.
   */
  const CRUCE_CON_DEUDA = [
    "anonimizador",
    "big-d",
    "copiloto-consultor",
    "hackguard",
  ];
  // Distancia de un punto a un segmento horizontal o vertical.
  const distancia = (
    p: { x: number; y: number },
    [x1, y1, x2, y2]: [number, number, number, number],
  ) => {
    const cx = Math.min(Math.max(p.x, Math.min(x1, x2)), Math.max(x1, x2));
    const cy = Math.min(Math.max(p.y, Math.min(y1, y2)), Math.max(y1, y2));
    return Math.hypot(p.x - cx, p.y - cy);
  };

  for (const { slug, proceso } of procesosReales) {
    it(`${slug}: dos círculos de un mismo margen nunca se pisan`, () => {
      const t = trazar(proceso);
      for (const lado of ["salida", "entrada"] as const)
        for (let i = 0; i < t.enlaces.length; i++)
          for (let j = i + 1; j < t.enlaces.length; j++) {
            const a = t.enlaces[i][lado];
            const b = t.enlaces[j][lado];
            if (a.x !== b.x) continue;
            expect(
              Math.hypot(a.x - b.x, a.y - b.y),
              `los enlaces ${t.enlaces[i].letra} y ${t.enlaces[j].letra} (${lado}) caen en el mismo sitio`,
            ).toBeGreaterThanOrEqual(2 * R);
          }
    });

    it(`${slug}: cada flujo de un enlace empieza o termina EN su círculo`, () => {
      const t = trazar(proceso);
      for (const e of t.enlaces) {
        const sal = t.flujos.find(
          (f) => f.de === e.de && f.a === `enlace:${e.letra}`,
        )!;
        const ent = t.flujos.find(
          (f) => f.de === `enlace:${e.letra}` && f.a === e.a,
        )!;
        const ss = segmentos(sal.d);
        const fin = ss[ss.length - 1];
        // Llega al círculo por la izquierda (recta) o por abajo (canal).
        expect(
          [fin[2], fin[3]],
          `el flujo ${e.de}→${e.letra} no toca su círculo`,
        ).toSatisfy(
          ([x, y]: number[]) =>
            (x === e.salida.x - R && y === e.salida.y) ||
            (x === e.salida.x && y === e.salida.y + R),
        );
        const es = segmentos(ent.d);
        const ini = es[0];
        // Sale del círculo por la derecha (recta) o por arriba (canal).
        expect(
          [ini[0], ini[1]],
          `el flujo ${e.letra}→${e.a} no sale de su círculo`,
        ).toSatisfy(
          ([x, y]: number[]) =>
            (x === e.entrada.x + R && y === e.entrada.y) ||
            (x === e.entrada.x && y === e.entrada.y - R),
        );
      }
    });

    it(`${slug}: ${CRUCE_CON_DEUDA.includes(slug) ? "(deuda declarada) un flujo pasa sobre el círculo de otro enlace" : "ningún flujo atraviesa el círculo de otro enlace"}`, () => {
      const t = trazar(proceso);
      const pisados: string[] = [];
      for (const e of t.enlaces)
        for (const p of [e.salida, e.entrada])
          for (const f of t.flujos) {
            // Los dos flujos del propio enlace sí tocan su círculo.
            if (f.a === `enlace:${e.letra}` || f.de === `enlace:${e.letra}`)
              continue;
            if (segmentos(f.d).some((s) => distancia(p, s) <= R))
              pisados.push(`${f.de}→${f.a} sobre ${e.letra}`);
          }
      if (CRUCE_CON_DEUDA.includes(slug))
        expect(
          pisados.length,
          `«${slug}» ya no pasa sobre ningún círculo: sácala de CRUCE_CON_DEUDA`,
        ).toBeGreaterThan(0);
      else expect(pisados).toEqual([]);
    });
  }

  it("una compuerta con dos salidas a la fila siguiente separa sus eventos y sus rótulos (sí / no)", () => {
    const p: Proceso = {
      carriles: [
        { id: "a", nombre: "Dueño" },
        { id: "b", nombre: "App" },
      ],
      pasos: [
        { id: "ini", tipo: "inicio", texto: "", carril: "a" },
        { id: "t1", tipo: "tarea", texto: "Hace algo", carril: "a" },
        { id: "t2", tipo: "tarea", texto: "Revisa", carril: "a" },
        { id: "dec", tipo: "decision", texto: "¿Listo?", carril: "a" },
        { id: "fin", tipo: "fin", texto: "", carril: "b" },
        { id: "otra", tipo: "tarea", texto: "Otra vez", carril: "b" },
      ],
      flujos: [
        { de: "ini", a: "t1" },
        { de: "t1", a: "t2" },
        { de: "t2", a: "dec" },
        { de: "dec", a: "fin", etiqueta: "sí" },
        { de: "dec", a: "otra", etiqueta: "no" },
      ],
    } as Proceso;
    const t = trazar(p, { columnasPorFila: 4 });
    expect(t.enlaces).toHaveLength(2);
    const [e1, e2] = t.enlaces;
    expect(e1.salida.y).not.toBe(e2.salida.y);
    expect(Math.abs(e1.salida.y - e2.salida.y)).toBeGreaterThanOrEqual(2 * R);
    expect(e1.entrada.y).not.toBe(e2.entrada.y);
    const rotulos = t.flujos.filter((f) => f.etiqueta && f.de === "dec");
    expect(rotulos).toHaveLength(2);
    const [r1, r2] = rotulos.map((f) => cajaRotulo(f)!);
    expect(seCruzan(r1, r2)).toBe(false);
  });

  it("con UN solo evento por margen nada cambia: el mismo punto y el mismo trazo de siempre", () => {
    const t = trazar(habla, { columnasPorFila: 6 });
    const nodo = Object.fromEntries(t.nodos.map((n) => [n.id, n]));
    for (const e of t.enlaces) {
      expect(e.salida.y).toBe(nodo[e.de].y);
      expect(e.entrada.y).toBe(nodo[e.a].y);
    }
  });
});

/**
 * Lo que la revisión visual del 2026-09-06 destapó de rebote en Dash: el
 * «no» de «¿Corregir?» iba RECTO al fin por el mismo carril, pasando por
 * detrás de «Corrige la memoria» — la caja tapaba la línea y el rótulo, y la
 * compuerta parecía tener un solo camino. Invariante general: un flujo jamás
 * atraviesa una caja ajena, y ningún rótulo queda cruzado por un tramo ajeno
 * (horizontal o vertical).
 */
describe("trazar — los flujos no se esconden (los procesos reales)", () => {
  for (const { slug, proceso } of procesosReales) {
    it(`${slug}: ningún flujo atraviesa una caja ajena`, () => {
      const t = trazar(proceso);
      for (const f of t.flujos)
        for (const [x1, y1, x2, y2] of segmentos(f.d)) {
          const seg: Caja = {
            l: Math.min(x1, x2),
            r: Math.max(x1, x2),
            t: Math.min(y1, y2),
            b: Math.max(y1, y2),
          };
          for (const n of t.nodos) {
            if (n.id === f.de || n.id === f.a) continue;
            // Cruce estricto: tocar el borde no cuenta, atravesar sí.
            const cruza =
              seg.l < n.r && seg.r > n.l && seg.t < n.b && seg.b > n.t;
            expect(
              cruza,
              `${f.de}→${f.a} atraviesa la caja de «${n.id}» (tramo ${x1},${y1}→${x2},${y2})`,
            ).toBe(false);
          }
        }
    });

    it(`${slug}: ningún rótulo queda cruzado por un tramo ajeno`, () => {
      const t = trazar(proceso);
      for (const f of t.flujos) {
        const caja = cajaRotulo(f);
        if (!caja) continue;
        for (const otro of t.flujos) {
          if (otro === f) continue;
          for (const [x1, y1, x2, y2] of segmentos(otro.d)) {
            const l = Math.min(x1, x2);
            const r = Math.max(x1, x2);
            const yt = Math.min(y1, y2);
            const yb = Math.max(y1, y2);
            const toca = l < caja.r && r > caja.l && yt < caja.b && yb > caja.t;
            expect(
              toca,
              `«${f.etiqueta}» (${f.de}→${f.a}) queda cruzado por ${otro.de}→${otro.a} (${x1},${y1}→${x2},${y2})`,
            ).toBe(false);
          }
        }
      }
    });
  }
});
