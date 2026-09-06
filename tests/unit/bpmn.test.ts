import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { G, partirTexto, trazar, type Proceso } from "@/lib/vitrina/bpmn";

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
