import { describe, expect, it } from "vitest";
import * as M from "@/lib/skills/explorador";
import dorada from "../fixtures/skills/maqueta-dorada.json";

/**
 * EL MOTOR DEL EXPLORADOR DE SKILLS (S29).
 *
 * Dos clases de prueba:
 *  1. **La salida dorada.** `tests/fixtures/skills/maqueta-dorada.json` la generó UNA vez la maqueta
 *     aprobada (`referencias-ui/home/maqueta/home.html`, planeadora) con sus propias funciones y
 *     `Math.random` sembrado (mulberry32): dónde nacen las nueve áreas, dónde están tras 120 cuadros, tras
 *     30 más con una detenida, y dónde caen las herramientas de dos áreas en escritorio y en móvil. Con la
 *     misma semilla, este motor tiene que dar lo mismo: si una cuenta del port se aparta de la maqueta,
 *     falla aquí. Entra como datos, no como código copiado.
 *  2. **Los invariantes**, con muchas semillas: dentro de los bordes, sin encimarse, la detenida en 1,2,
 *     el tope de 1100 px/s, las herramientas sin encimarse ni tapar el centro, del 9 al 1.
 */

/** El mismo generador que sembró la maqueta (scratchpad del S29, `dorada.cjs`). */
function mulberry32(semilla: number): M.Rng {
  let a = semilla;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type CasoDorado = (typeof dorada.casos)[number];

const cerca = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

function cuerposIguales(real: M.Cuerpo[], esperado: M.Cuerpo[]) {
  expect(real).toHaveLength(esperado.length);
  real.forEach((c, i) => {
    const e = esperado[i]!;
    for (const k of ["x", "y", "vx", "vy", "v", "k"] as const)
      expect(c[k], `cuerpo ${i}.${k}`).toBeCloseTo(e[k], 9);
  });
}

const copia = (cs: M.Cuerpo[]) => cs.map((c) => ({ ...c }));
const SIN_FIJOS: M.Fijos = { sobre: -1, arrastre: null };

describe("la salida dorada de la maqueta", () => {
  it("trae los dos casos (escritorio y móvil) con nueve áreas y dos áreas abiertas cada uno", () => {
    expect(dorada.prng).toBe("mulberry32");
    expect(dorada.casos.map((c) => c.nombre)).toEqual(["escritorio", "movil"]);
    for (const c of dorada.casos) {
      expect(c.sembrados).toHaveLength(9);
      expect(c.colocados).toHaveLength(2);
    }
  });

  for (const caso of dorada.casos as CasoDorado[]) {
    describe(caso.nombre, () => {
      const m = M.medidas(caso.medidas.W, caso.medidas.techo);

      it("las medidas del rectángulo son las de la maqueta", () => {
        expect(m).toEqual(caso.medidas);
      });

      it("sembrar: mismos sitios, rumbos y rapideces", () => {
        cuerposIguales(
          M.sembrar(9, m, mulberry32(dorada.semilla)),
          caso.sembrados,
        );
      });

      it("paso: 120 cuadros de deriva y choques, y 30 más con la 3 detenida", () => {
        const cs = copia(caso.sembrados);
        const rng = mulberry32(dorada.semilla + 1);
        for (let k = 0; k < 120; k++) M.paso(cs, caso.dt, m, SIN_FIJOS, rng);
        cuerposIguales(cs, caso.tras120);
        for (let k = 0; k < 30; k++)
          M.paso(cs, caso.dt, m, { sobre: 2, arrastre: null }, rng);
        cuerposIguales(cs, caso.conFija);
      });

      for (const col of caso.colocados) {
        it(`colocar las ${col.cajas.length} herramientas del área ${col.i + 1}`, () => {
          const r = M.colocarChips(col.cajas, col.W, col.angosto, col.d);
          expect(r.H).toBe(col.H);
          expect(r.centro).toEqual(col.centro);
          r.posiciones.forEach((p, j) => {
            // la maqueta escribe el transform con un decimal: se compara a esa precisión
            const w = col.cajas[j]!.w;
            const h = col.cajas[j]!.h;
            const x = Number((p.x - w / 2).toFixed(1)) + w / 2;
            const y = Number((p.y - h / 2).toFixed(1)) + h / 2;
            expect(cerca(x, col.posiciones[j]!.x, 1e-6), `chip ${j}.x`).toBe(
              true,
            );
            expect(cerca(y, col.posiciones[j]!.y, 1e-6), `chip ${j}.y`).toBe(
              true,
            );
          });
        });
      }
    });
  }

  it("una cuenta movida en el port SÍ se aparta (la prueba puede fallar)", () => {
    const caso = dorada.casos[0]!;
    const m = M.medidas(caso.medidas.W, caso.medidas.techo);
    const otro = M.sembrar(9, m, mulberry32(dorada.semilla + 7));
    expect(Math.abs(otro[0]!.x - caso.sembrados[0]!.x)).toBeGreaterThan(1);
  });
});

describe("medidas", () => {
  it("angosto por debajo de 640, mediano hasta 860", () => {
    expect(M.medidas(639, 0)).toMatchObject({
      angosto: true,
      d: 120,
      H: 600,
      techo: 74,
    });
    expect(M.medidas(700, 0)).toMatchObject({
      angosto: false,
      d: 140,
      H: 620,
      techo: 62,
    });
    expect(M.medidas(976, 0)).toMatchObject({ d: 160 });
  });

  it("el techo baja con la invitación cuando ocupa más líneas", () => {
    expect(M.medidas(380, 120).techo).toBe(120);
  });
});

describe("invariantes del vuelo", () => {
  const SEMILLAS = Array.from({ length: 12 }, (_, i) => 1000 + i * 37);
  const CASOS = [M.medidas(976, 62), M.medidas(380, 74), M.medidas(700, 62)];

  const dentroDe = (c: M.Cuerpo, m: M.Medidas) => {
    const r = (m.d / 2) * c.k;
    return (
      c.x >= r + 8 - 1e-6 &&
      c.x <= m.W - r - 8 + 1e-6 &&
      c.y >= m.techo + r - 1e-6 &&
      c.y <= m.H - r - 8 + 1e-6
    );
  };

  it("nacen dentro del rectángulo, a su rapidez de crucero (18 a 32 px/s)", () => {
    for (const s of SEMILLAS)
      for (const m of CASOS) {
        const cs = M.sembrar(9, m, mulberry32(s));
        expect(cs).toHaveLength(9);
        for (const c of cs) {
          expect(dentroDe(c, m)).toBe(true);
          expect(c.v).toBeGreaterThanOrEqual(18);
          expect(c.v).toBeLessThan(32);
          expect(Math.hypot(c.vx, c.vy)).toBeCloseTo(c.v, 9);
        }
      }
  });

  it("en 600 cuadros ninguna escapa ni queda cortada más allá de su radio, y ninguna queda encima de otra", () => {
    // Como en la maqueta, los choques se resuelven DESPUÉS de los bordes: en un cuadro apretado una
    // burbuja puede quedar unos píxeles afuera (32 px la peor en 200 semillas, en el celular) y el cuadro
    // siguiente la devuelve. Lo que no pasa nunca: que el centro salga del rectángulo.
    const excursion = (c: M.Cuerpo, m: M.Medidas) => {
      const r = (m.d / 2) * c.k;
      return Math.max(
        r + 8 - c.x,
        c.x - (m.W - r - 8),
        m.techo + r - c.y,
        c.y - (m.H - r - 8),
        0,
      );
    };
    for (const s of SEMILLAS)
      for (const m of CASOS) {
        const rng = mulberry32(s);
        const cs = M.sembrar(9, m, rng);
        for (let k = 0; k < 600; k++) {
          M.paso(cs, 1 / 60, m, SIN_FIJOS, rng);
          for (const c of cs)
            expect(excursion(c, m), `semilla ${s}, cuadro ${k}`).toBeLessThan(
              (m.d / 2) * c.k,
            );
        }
        // tras los bordes del cuadro siguiente, todas dentro
        for (const c of cs) M.pared(c, m.W, m.H, (m.d / 2) * c.k, m.techo);
        for (const c of cs) expect(dentroDe(c, m)).toBe(true);
        // los choques se resuelven de a pares en cada cuadro: queda a lo sumo un roce, nunca una encima
        for (let p = 0; p < cs.length; p++)
          for (let q = p + 1; q < cs.length; q++) {
            const d = Math.hypot(cs[p]!.x - cs[q]!.x, cs[p]!.y - cs[q]!.y);
            expect(d, `semilla ${s}, ${p}↔${q}`).toBeGreaterThan(m.d * 0.75);
          }
      }
  });

  it("la detenida crece a 1,2 y no se mueve; al soltarla vuelve a 1", () => {
    const m = CASOS[0]!;
    const rng = mulberry32(5);
    const cs = M.sembrar(9, m, rng);
    const antes = { ...cs[4]! };
    for (let k = 0; k < 120; k++)
      M.paso(cs, 1 / 60, m, { sobre: 4, arrastre: null }, rng);
    expect(cs[4]!.k).toBeCloseTo(M.ESCALA_SOBRE, 3);
    expect(Math.hypot(cs[4]!.x - antes.x, cs[4]!.y - antes.y)).toBeLessThan(
      m.d,
    );
    const quieta = { x: cs[4]!.x, y: cs[4]!.y };
    for (let k = 0; k < 30; k++)
      M.paso(cs, 1 / 60, m, { sobre: 4, arrastre: null }, rng);
    // detenida: solo la corren los bordes (está lejos de ellos tras 2 s quieta)
    expect(cs[4]!.x).toBeCloseTo(quieta.x, 6);
    expect(cs[4]!.y).toBeCloseTo(quieta.y, 6);
    for (let k = 0; k < 120; k++) M.paso(cs, 1 / 60, m, SIN_FIJOS, rng);
    expect(cs[4]!.k).toBeCloseTo(1, 3);
  });

  it("la que arrastras empuja a la que toca con el golpe de tu mano, con tope de 1100 px/s", () => {
    const m = CASOS[0]!;
    const cs: M.Cuerpo[] = [
      { x: 300, y: 300, vx: 0, vy: 0, v: 20, k: 1.2 },
      { x: 300 + 150, y: 300, vx: 0, vy: 0, v: 20, k: 1 },
    ];
    M.paso(
      cs,
      1 / 60,
      m,
      { sobre: -1, arrastre: { i: 0, vx: 5000, vy: 0 } },
      mulberry32(1),
    );
    expect(cs[1]!.vx).toBeGreaterThan(0);
    expect(Math.hypot(cs[1]!.vx, cs[1]!.vy)).toBeLessThanOrEqual(
      M.TOPE_LANZAMIENTO + 1e-9,
    );
    expect(cs[1]!.x - cs[0]!.x).toBeGreaterThanOrEqual(
      (m.d / 2) * (cs[0]!.k + cs[1]!.k) + 12 - 1e-9,
    );
  });

  it("tras un golpe la rapidez vuelve sola a la de crucero", () => {
    const m = CASOS[0]!;
    const cs: M.Cuerpo[] = [{ x: 488, y: 340, vx: 900, vy: 0, v: 20, k: 1 }];
    const rng = mulberry32(2);
    for (let k = 0; k < 600; k++) M.paso(cs, 1 / 60, m, SIN_FIJOS, rng);
    expect(Math.hypot(cs[0]!.vx, cs[0]!.vy)).toBeCloseTo(20, 1);
  });

  it("tope recorta la rapidez sin cambiar el rumbo", () => {
    const c: M.Cuerpo = { x: 0, y: 0, vx: 3000, vy: 4000, v: 20, k: 1 };
    M.tope(c);
    expect(Math.hypot(c.vx, c.vy)).toBeCloseTo(1100, 9);
    expect(c.vy / c.vx).toBeCloseTo(4 / 3, 9);
    const lenta: M.Cuerpo = { x: 0, y: 0, vx: 3, vy: 4, v: 20, k: 1 };
    M.tope(lenta);
    expect(lenta).toMatchObject({ vx: 3, vy: 4 });
  });

  it("pared corre hacia adentro y rebota en los cuatro bordes", () => {
    const m = CASOS[0]!;
    const r = m.d / 2;
    const c: M.Cuerpo = { x: -50, y: -50, vx: -10, vy: -10, v: 20, k: 1 };
    M.pared(c, m.W, m.H, r, m.techo);
    expect(c).toMatchObject({ x: r + 8, y: m.techo + r, vx: 10, vy: 10 });
    const d: M.Cuerpo = { x: 5000, y: 5000, vx: 10, vy: 10, v: 20, k: 1 };
    M.pared(d, m.W, m.H, r, m.techo);
    expect(d).toMatchObject({
      x: m.W - r - 8,
      y: m.H - r - 8,
      vx: -10,
      vy: -10,
    });
  });
});

describe("reescalar", () => {
  it("reparte en la misma proporción cuando el rectángulo crece", () => {
    const cs: M.Cuerpo[] = [{ x: 200, y: 300, vx: 1, vy: 1, v: 20, k: 1 }];
    expect(M.reescalar(cs, { W: 400, H: 600 }, M.medidas(800, 0))).toBe(true);
    expect(cs[0]!.x).toBeCloseTo(400, 9);
    expect(cs[0]!.y).toBeCloseTo(310, 9);
  });

  it("si nacieron sin ancho, pide sembrar de nuevo; si nada cambió, no toca", () => {
    const cs: M.Cuerpo[] = [{ x: 90, y: 300, vx: 1, vy: 1, v: 20, k: 1 }];
    expect(M.reescalar(cs, { W: 0, H: 620 }, M.medidas(976, 0))).toBe(false);
    expect(M.reescalar(cs, { W: 976, H: 620 }, M.medidas(976, 0))).toBe(true);
    expect(cs[0]!.x).toBe(90);
  });
});

describe("la mano", () => {
  it("se detiene la agarrada sin mover, si no la que tiene el cursor (salvo la suelta), si no la del foco", () => {
    const cs: M.Cuerpo[] = [
      { x: 100, y: 100, vx: 0, vy: 0, v: 20, k: 1 },
      { x: 400, y: 100, vx: 0, vy: 0, v: 20, k: 1 },
    ];
    const base = { agarrada: null, elegida: -1, suelta: -1, foco: -1 };
    expect(M.cualSeDetiene(cs, 80, { x: 410, y: 90 }, base)).toBe(1);
    expect(
      M.cualSeDetiene(cs, 80, { x: 410, y: 90 }, { ...base, suelta: 1 }),
    ).toBe(-1);
    expect(M.cualSeDetiene(cs, 80, null, { ...base, foco: 0 })).toBe(0);
    expect(
      M.cualSeDetiene(cs, 80, { x: 410, y: 90 }, { ...base, elegida: 0 }),
    ).toBe(-1);
    expect(
      M.cualSeDetiene(cs, 80, null, {
        ...base,
        agarrada: { i: 1, movido: false },
      }),
    ).toBe(1);
    expect(
      M.cualSeDetiene(cs, 80, null, {
        ...base,
        agarrada: { i: 1, movido: true },
        foco: 0,
      }),
    ).toBe(0);
  });

  it("se mide el círculo, no su caja", () => {
    const c: M.Cuerpo = { x: 100, y: 100, vx: 0, vy: 0, v: 20, k: 1 };
    expect(M.enCirculo(c, 80, { x: 100 + 79, y: 100 })).toBe(true);
    expect(M.enCirculo(c, 80, { x: 100 + 70, y: 100 + 70 })).toBe(false); // la esquina de la caja
    expect(M.enCirculo(c, 80, null)).toBe(false);
  });

  it("la velocidad de la mano sale de los últimos 90 ms", () => {
    const ms: M.Muestra[] = [[0, 0, 0]];
    expect(M.velocidadDeMano(ms, 5, 1, 0)).toBeNull(); // ventana demasiado corta
    M.velocidadDeMano(ms, 50, 10, 0);
    const v = M.velocidadDeMano(ms, 200, 100, 0)!;
    expect(ms.length).toBeLessThanOrEqual(2);
    expect(v.vx).toBeCloseTo((100 - 10) / 0.15, 6);
  });

  it("al soltar: lanzada sale con impulso (con tope), despacio sigue a su ritmo, quieta conserva el rumbo", () => {
    const c: M.Cuerpo = { x: 0, y: 0, vx: 1, vy: 0, v: 20, k: 1 };
    M.lanzar(c, 3000, 0, false);
    expect(c.vx).toBeCloseTo(1100, 9);
    M.lanzar(c, 0, 10, false);
    expect(c).toMatchObject({ vx: 0, vy: 20 });
    M.lanzar(c, 500, 500, true);
    expect(c).toMatchObject({ vx: 0, vy: 20 });
  });

  it("arrastrada no sale del rectángulo", () => {
    const m = M.medidas(976, 62);
    expect(M.dentro(-100, 9999, 96, m)).toEqual({ x: 104, y: m.H - 96 - 8 });
  });
});

describe("colocar las herramientas", () => {
  const solapan = (
    a: { x: number; y: number; w: number; h: number },
    b: typeof a,
  ) =>
    Math.abs(a.x - b.x) < (a.w + b.w) / 2 &&
    Math.abs(a.y - b.y) < (a.h + b.h) / 2;

  for (const caso of dorada.casos as CasoDorado[])
    for (const col of caso.colocados)
      it(`${caso.nombre}, área ${col.i + 1}: sin encimarse, sin tapar el centro y dentro`, () => {
        const r = M.colocarChips(col.cajas, col.W, col.angosto, col.d);
        const C = r.posiciones.map((p, j) => ({ ...p, ...col.cajas[j]! }));
        for (let p = 0; p < C.length; p++)
          for (let q = p + 1; q < C.length; q++)
            expect(solapan(C[p]!, C[q]!), `${p}↔${q}`).toBe(false);
        for (const c of C) {
          const px = Math.max(
            c.x - c.w / 2,
            Math.min(r.centro.x, c.x + c.w / 2),
          );
          const py = Math.max(
            c.y - c.h / 2,
            Math.min(r.centro.y, c.y + c.h / 2),
          );
          expect(Math.hypot(px - r.centro.x, py - r.centro.y)).toBeGreaterThan(
            r.R,
          );
          expect(c.x - c.w / 2).toBeGreaterThanOrEqual(8 - 1e-6);
          expect(c.x + c.w / 2).toBeLessThanOrEqual(col.W - 8 + 1e-6);
          expect(c.y - c.h / 2).toBeGreaterThanOrEqual(60 - 1e-6);
          expect(c.y + c.h / 2).toBeLessThanOrEqual(r.H - 62 + 1e-6);
        }
        // una línea por herramienta, del borde del centro a la herramienta
        expect(r.lineas).toHaveLength(C.length);
        for (const [j, l] of r.lineas.entries()) {
          expect(Math.hypot(l.x1 - r.centro.x, l.y1 - r.centro.y)).toBeCloseTo(
            r.R + 3,
            6,
          );
          expect(l.x2).toBe(C[j]!.x);
        }
      });

  it("en el celular el rectángulo crece con las herramientas (y la barra de abajo)", () => {
    const cajas = Array.from({ length: 16 }, () => ({ w: 100, h: 30 }));
    expect(M.colocarChips(cajas, 380, true, 120).H).toBe(380 + 16 * 30 + 50);
    expect(M.colocarChips(cajas.slice(0, 5), 380, true, 120).H).toBe(560 + 50);
    expect(M.colocarChips(cajas, 976, false, 160).H).toBe(620);
  });

  it("el estilo de las herramientas se fija antes de medirlas", () => {
    expect(M.estiloDeChips(true)).toEqual({ max: 132, fs: 12 });
    expect(M.estiloDeChips(false)).toEqual({ max: 200, fs: 13.5 });
  });
});

describe("los pasos, las herramientas y los nombres", () => {
  it("«← N · M →» da la vuelta del 9 al 1", () => {
    expect(M.vecina(8, 1, 9)).toBe(0);
    expect(M.vecina(0, -1, 9)).toBe(8);
    expect(M.vecina(4, 1, 9)).toBe(5);
  });

  it("parte nombre, nota y estado (ES y EN)", () => {
    expect(M.partirItem("Python")).toEqual({ nombre: "Python" });
    expect(M.partirItem("Airflow — en estudio")).toEqual({
      nombre: "Airflow",
      estado: "en estudio",
    });
    expect(M.partirItem("PySpark — studying")).toEqual({
      nombre: "PySpark",
      estado: "studying",
    });
    expect(
      M.partirItem(
        "Planeador de Fabric, Databricks y Snowflake — en preparación",
      ),
    ).toEqual({
      nombre: "Planeador de Fabric, Databricks y Snowflake",
      estado: "en preparación",
    });
    expect(
      M.partirItem("RAG, guardrails y circuit breaker — el chat de este sitio"),
    ).toEqual({
      nombre: "RAG, guardrails y circuit breaker",
      nota: "el chat de este sitio",
    });
    // la ÚLTIMA raya: un nombre con raya conserva la suya
    expect(M.partirItem("A — B — prototipo")).toEqual({
      nombre: "A — B",
      estado: "prototipo",
    });
  });

  it("un nombre cabe si ninguna palabra pasa del 80 % y el bloque queda dentro del círculo", () => {
    expect(
      M.nombreCabe(160, { anchoPalabras: 100, anchoTexto: 100, altoTexto: 36 }),
    ).toBe(true);
    expect(
      M.nombreCabe(160, { anchoPalabras: 129, anchoTexto: 100, altoTexto: 36 }),
    ).toBe(false);
    expect(
      M.nombreCabe(120, { anchoPalabras: 90, anchoTexto: 90, altoTexto: 60 }),
    ).toBe(false);
    expect(M.NOMBRE_FS.inicial(160)).toBe(15);
    expect(M.NOMBRE_FS.inicial(120)).toBe(13.5);
  });

  it("rellena las plantillas de los mensajes y deja intacto lo que no conoce", () => {
    expect(M.rellenar("· {n} de {t} vistas", { n: 3, t: 9 })).toBe(
      "· 3 de 9 vistas",
    );
    expect(M.rellenar("{grupo}: {n}", { n: 4 })).toBe("{grupo}: 4");
  });
});

describe("la red del fondo", () => {
  it("≈ 60 puntos en escritorio y ≈ 24 en móvil, entre 22 y 72", () => {
    expect(M.puntosDeRed(976, 620)).toBe(67);
    expect(M.puntosDeRed(380, 600)).toBe(25);
    expect(M.puntosDeRed(10, 10)).toBe(22);
    expect(M.puntosDeRed(5000, 5000)).toBe(72);
    expect(M.alcanceDeRed(380)).toBe(96);
    expect(M.alcanceDeRed(976)).toBe(124);
  });

  it("se ajusta a un rectángulo nuevo: reescala, agrega y recorta", () => {
    const red: M.PuntoRed[] = [];
    const rng = mulberry32(3);
    M.ajustarRed(red, { W: 0, H: 0 }, 976, 620, rng);
    expect(red).toHaveLength(67);
    const x0 = red[0]!.x;
    M.ajustarRed(red, { W: 976, H: 620 }, 380, 600, rng);
    expect(red).toHaveLength(25);
    expect(red[0]!.x).toBeCloseTo((x0 * 380) / 976, 9);
  });

  it("los puntos rebotan en los bordes y los enlaces se apagan con la distancia", () => {
    const red: M.PuntoRed[] = [
      { x: 1, y: 1, vx: -100, vy: -100 },
      { x: 50, y: 1, vx: 0, vy: 0 },
      { x: 900, y: 600, vx: 0, vy: 0 },
    ];
    M.pasoRed(red, 0.05, 976, 620);
    expect(red[0]).toMatchObject({ x: 0, y: 0, vx: 100, vy: 100 });
    const enlaces = M.enlacesDeRed(red, 124);
    expect(enlaces).toHaveLength(1);
    expect(enlaces[0]!.alfa).toBeGreaterThan(0);
    expect(enlaces[0]!.alfa).toBeLessThan(0.16);
  });
});

describe("las áreas vistas sobreviven al cambio de idioma y a nada más", () => {
  const g: M.VistasGuardadas = {
    ids: ["ia-y-ml", "ingenieria"],
    locale: "es",
    t: 1000,
  };

  it("cambio de idioma enseguida: se conservan", () => {
    expect(M.conservarVistas(g, { locale: "en", t: 1400 })).toEqual([
      "ia-y-ml",
      "ingenieria",
    ]);
  });

  it("volver a entrar en el mismo idioma, recargar o tardar: se reinician", () => {
    expect(M.conservarVistas(g, { locale: "es", t: 1400 })).toEqual([]);
    expect(M.conservarVistas(null, { locale: "en", t: 1400 })).toEqual([]);
    expect(
      M.conservarVistas(g, {
        locale: "en",
        t: 1000 + M.VENTANA_CAMBIO_DE_IDIOMA_MS + 1,
      }),
    ).toEqual([]);
  });
});
