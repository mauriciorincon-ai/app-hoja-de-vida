/**
 * EL MOTOR DEL FLUJO: cajas y flechas (S28). Puro, sin DOM.
 *
 * Es el motor de la maqueta aprobada (`referencias-ui/brochure/maqueta/plantilla.html`: `rangos`,
 * `trazar`, `curva`, `orto` y el dimensionado de `dibujar`), portado uno a uno para que el servidor
 * escriba el primer dibujo y el cliente solo lo rehaga al cambiar el ancho. Tres cambios, ninguno de
 * geometría:
 *
 *  1. el ancho de caja `W` deja de ser estado del módulo y viaja como parámetro;
 *  2. la salida se redondea a 0,5 px (el cálculo va con toda la precisión, el redondeo solo al escribir);
 *  3. la entrada es `trazarFlujo(flujo, ancho)`.
 *
 * Una prueba diferencial lo compara con las salidas de la maqueta (fixtures generados una vez desde
 * ella, en `tests/fixtures/flujo-dorado.json`) y otra fija sus invariantes sobre los procesos reales.
 *
 * Cómo dibuja: capas por el camino más largo (las vueltas se detectan y se dibujan aparte,
 * punteadas), nodos virtuales para las aristas largas, orden por baricentro en cuatro barridos, y dos
 * modos: horizontal, que se parte en filas en serpentina cuando no cabe, y vertical por debajo de
 * 600 px. Sin carriles: el actor va en cada caja.
 */

export type TipoNodo = "inicio" | "tarea" | "decision" | "paralelo" | "fin";

export type NodoFlujo = {
  id: string;
  tipo: TipoNodo;
  /** El texto de la caja; vacío en un fin sin rótulo (que se dibuja como un círculo). */
  texto: string;
};

export type AristaFlujo = {
  de: string;
  a: string;
  /** El rótulo de la flecha («sí», «no: …»), o vacío. */
  etq?: string;
  /** Una vuelta declarada (se dibuja punteada); el motor añade las que cierran un ciclo. */
  vuelta?: boolean;
};

export type Flujo = { nodos: NodoFlujo[]; aristas: AristaFlujo[] };

export type Modo = "h" | "v";

export type NodoTrazado = {
  id: string;
  tipo: TipoNodo;
  x: number;
  y: number;
  w: number;
  h: number;
};
export type AristaTrazada = {
  d: string;
  vuelta: boolean;
  de: string;
  a: string;
};
export type EtiquetaTrazada = {
  x: number;
  y: number;
  t: string;
  max: number;
  de: string;
  a: string;
};

export type Trazado = {
  modo: Modo;
  /** Cajas por fila (horizontal) y ancho de caja con el que se trazó. */
  porFila: number;
  anchoCaja: number;
  nodos: NodoTrazado[];
  aristas: AristaTrazada[];
  etiquetas: EtiquetaTrazada[];
  w: number;
  h: number;
};

/** La geometría de la maqueta, en px. */
export const GEO = {
  w: 138,
  h: 92,
  gy: 24,
  pad: 26,
  canal: 52,
  vgx: 26,
  vgy: 50,
} as const;
/** Por debajo de este ancho útil el flujo se dibuja en vertical. */
export const UMBRAL_VERTICAL = 600;
/** Una fila horizontal solo si caben cajas de este ancho o más. */
export const CAJA_MINIMA = 118;

/** El redondeo de salida: medio píxel. */
export const medio = (v: number) => Math.round(v * 2) / 2;

type Base = {
  r: Map<string, number>;
  adelante: AristaFlujo[];
  vuelta: AristaFlujo[];
};

/** Capas por el camino más largo, y qué aristas son vueltas (declaradas o cerradas por el DFS). */
export function rangos(fl: Flujo): Base {
  const ids = fl.nodos.map((n) => n.id);
  const existe = new Set(ids);
  const ar = fl.aristas.filter((a) => existe.has(a.de) && existe.has(a.a));
  const sal = new Map<string, AristaFlujo[]>(ids.map((i) => [i, []]));
  for (const a of ar) sal.get(a.de)!.push(a);
  const vuelta = new Set(ar.filter((a) => a.vuelta));
  const est = new Map<string, number>();
  const dfs = (v: string) => {
    est.set(v, 1);
    for (const a of sal.get(v)!) {
      if (vuelta.has(a)) continue;
      const s = est.get(a.a) || 0;
      if (s === 1) vuelta.add(a);
      else if (!s) dfs(a.a);
    }
    est.set(v, 2);
  };
  for (const i of [
    ...fl.nodos.filter((n) => n.tipo === "inicio").map((n) => n.id),
    ...ids,
  ])
    if (!est.get(i)) dfs(i);
  const adelante = ar.filter((a) => !vuelta.has(a));
  const gin = new Map<string, number>(ids.map((i) => [i, 0]));
  for (const a of adelante) gin.set(a.a, gin.get(a.a)! + 1);
  const r = new Map<string, number>(ids.map((i) => [i, 0]));
  const cola = ids.filter((i) => !gin.get(i));
  while (cola.length) {
    const v = cola.shift()!;
    for (const a of adelante)
      if (a.de === v) {
        r.set(a.a, Math.max(r.get(a.a)!, r.get(v)! + 1));
        gin.set(a.a, gin.get(a.a)! - 1);
        if (!gin.get(a.a)) cola.push(a.a);
      }
  }
  return { r, adelante, vuelta: [...vuelta] };
}

/** Modo, cajas por fila, ancho de caja y separación para un ancho útil (el dimensionado de `dibujar`). */
export function disposicion(
  base: Base,
  disp: number,
): { modo: Modo; R: number; W: number; gx: number } {
  const modo: Modo = disp < UMBRAL_VERTICAL ? "v" : "h";
  const nR = Math.max(0, ...base.r.values()) + 1;
  let R = nR;
  let gx = 70;
  let W: number = GEO.w;
  if (modo === "h") {
    const wUna = Math.min(GEO.w, (disp - GEO.pad * 2 - (nR - 1) * 62) / nR);
    if (wUna >= CAJA_MINIMA) W = Math.floor(wUna);
    else {
      const Rmax = Math.max(
        2,
        Math.floor((disp - GEO.pad * 2 + 62) / (GEO.w + 62)),
      );
      R = Math.ceil(nR / Math.ceil(nR / Rmax));
    }
    gx = Math.max(
      40,
      Math.min(100, (disp - GEO.pad * 2 - R * W) / Math.max(1, R - 1)),
    );
  }
  return { modo, R, W, gx };
}

type Interno = {
  id: string;
  tipo?: TipoNodo;
  texto?: string;
  virtual?: boolean;
  i: number;
  rk: number;
  cx: number;
  cy: number;
};

function dims(n: Interno, W: number): [number, number] {
  if (n.virtual) return [0, 0];
  if (n.tipo === "fin" && !n.texto) return [40, 40];
  if (n.tipo === "paralelo") return [Math.min(108, W), 40];
  if (n.tipo === "inicio" || n.tipo === "fin") return [W, 80];
  return [W, GEO.h];
}

const num = (v: number) => String(medio(v));

/** Curva suave por los puntos (la de una arista que avanza). */
export function curva(pts: [number, number][], modo: Modo): string {
  let d = `M${num(pts[0]![0])},${num(pts[0]![1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]!;
    const [x1, y1] = pts[i]!;
    if (modo === "h") {
      const m = (x1 - x0) / 2;
      d += ` C${num(x0 + m)},${num(y0)} ${num(x1 - m)},${num(y1)} ${num(x1)},${num(y1)}`;
    } else {
      const m = (y1 - y0) / 2;
      d += ` C${num(x0)},${num(y0 + m)} ${num(x1)},${num(y1 - m)} ${num(x1)},${num(y1)}`;
    }
  }
  return d;
}

/** Recorrido ortogonal con esquinas redondeadas (las aristas que cambian de fila y las vueltas). */
export function orto(pts: [number, number][], r = 8): string {
  let d = `M${num(pts[0]![0])},${num(pts[0]![1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1]!;
    const [x1, y1] = pts[i]!;
    const [x2, y2] = pts[i + 1]!;
    const d1 = Math.hypot(x1 - x0, y1 - y0) || 1;
    const d2 = Math.hypot(x2 - x1, y2 - y1) || 1;
    const q = Math.min(r, d1 / 2, d2 / 2);
    d += ` L${num(x1 - ((x1 - x0) / d1) * q)},${num(y1 - ((y1 - y0) / d1) * q)} Q${num(x1)},${num(y1)} ${num(x1 + ((x2 - x1) / d2) * q)},${num(y1 + ((y2 - y1) / d2) * q)}`;
  }
  const [xn, yn] = pts[pts.length - 1]!;
  return `${d} L${num(xn)},${num(yn)}`;
}

/** El trazado de un flujo con una disposición dada (`trazar` de la maqueta). */
export function trazar(
  fl: Flujo,
  base: Base,
  modo: Modo,
  R: number,
  gx: number,
  W: number,
): Trazado {
  const { r, adelante, vuelta } = base;
  const nR = Math.max(0, ...r.values()) + 1;
  const fila = (k: number) => (modo === "h" ? Math.floor(k / R) : 0);
  // serpentina: las filas impares corren de derecha a izquierda, y el paso de una fila a la otra es una flecha corta
  const rtl = (k: number) => modo === "h" && fila(k) % 2 === 1;
  const N = new Map<string, Interno>(
    fl.nodos.map((n, i) => [n.id, { ...n, i, rk: r.get(n.id)!, cx: 0, cy: 0 }]),
  );
  const capas: string[][] = Array.from({ length: nR }, () => []);
  for (const n of N.values()) capas[n.rk]!.push(n.id);
  const tramos: { a: AristaFlujo; cadena: string[]; cruza: boolean }[] = [];
  let nv = 0;
  adelante.forEach((a, k) => {
    const s = N.get(a.de)!;
    const t = N.get(a.a)!;
    const cadena = [a.de];
    const cruza = fila(s.rk) !== fila(t.rk);
    if (!cruza)
      for (let q = s.rk + 1; q < t.rk; q++) {
        const id = `·${nv++}`;
        N.set(id, { id, virtual: true, rk: q, i: 1000 + k, cx: 0, cy: 0 });
        capas[q]!.push(id);
        cadena.push(id);
      }
    cadena.push(a.a);
    tramos.push({ a, cadena, cruza });
  });
  const pred = new Map<string, string[]>([...N.keys()].map((i) => [i, []]));
  const suc = new Map<string, string[]>([...N.keys()].map((i) => [i, []]));
  for (const t of tramos)
    for (let q = 0; q < t.cadena.length - 1; q++) {
      const x = t.cadena[q]!;
      const y = t.cadena[q + 1]!;
      if (N.get(y)!.rk - N.get(x)!.rk === 1) {
        suc.get(x)!.push(y);
        pred.get(y)!.push(x);
      }
    }
  for (const c of capas) c.sort((x, y) => N.get(x)!.i - N.get(y)!.i);
  const idx = new Map<string, number>();
  capas.forEach((c) => c.forEach((id, j) => idx.set(id, j)));
  const pos = (id: string) =>
    idx.get(id)! - (capas[N.get(id)!.rk]!.length - 1) / 2;
  const bary = (id: string, vec: Map<string, string[]>) => {
    const v = vec.get(id)!;
    return v.length ? v.reduce((s, x) => s + pos(x), 0) / v.length : pos(id);
  };
  const barrer = (k: number, vec: Map<string, string[]>) => {
    const b = new Map(capas[k]!.map((id) => [id, bary(id, vec)]));
    capas[k]!.sort(
      (x, y) => b.get(x)! - b.get(y)! || N.get(x)!.i - N.get(y)!.i,
    );
    capas[k]!.forEach((id, j) => idx.set(id, j));
  };
  for (let it = 0; it < 4; it++) {
    for (let k = 1; k < nR; k++) barrer(k, pred);
    for (let k = nR - 2; k >= 0; k--) barrer(k, suc);
  }
  // la caja más baja (o más alta) de su columna: por ahí sale o entra una vuelta sin cruzar otra caja
  const fondo = (id: string) => {
    const n = N.get(id)!;
    return capas[n.rk]!.every((o) => o === id || pos(o) < pos(id));
  };
  const tope = (id: string) => {
    const n = N.get(id)!;
    return capas[n.rk]!.every((o) => o === id || pos(o) > pos(id));
  };

  // geometría
  const nodos: NodoTrazado[] = [];
  const aristas: AristaTrazada[] = [];
  const etiquetas: EtiquetaTrazada[] = [];
  const nF = modo === "h" ? Math.ceil(nR / R) : 1;
  const filas = Array.from({ length: nF }, () => ({
    min: Infinity,
    max: -Infinity,
    y0: 0,
    alto: 0,
  }));
  for (const [id, n] of N) {
    const f = filas[fila(n.rk)]!;
    const p = pos(id);
    f.min = Math.min(f.min, p);
    f.max = Math.max(f.max, p);
  }
  const colW = W + gx;
  const rowH = GEO.h + GEO.gy;
  const subeAlPrincipio = vuelta.some(
    (a) => fila(r.get(a.a)!) === 0 && fila(r.get(a.de)!) > 0,
  );
  let y0 = GEO.pad + (subeAlPrincipio ? 24 : 0);
  for (const f of filas) {
    if (f.min === Infinity) f.min = f.max = 0;
    f.y0 = y0;
    f.alto = (f.max - f.min) * rowH + GEO.h;
    y0 += f.alto + GEO.canal;
  }
  let minV = Infinity;
  let maxV = -Infinity;
  for (const id of N.keys()) {
    minV = Math.min(minV, pos(id));
    maxV = Math.max(maxV, pos(id));
  }
  for (const [id, n] of N) {
    if (modo === "h") {
      const f = filas[fila(n.rk)]!;
      const col = rtl(n.rk) ? R - 1 - (n.rk % R) : n.rk % R;
      n.cx = GEO.pad + col * colW + W / 2;
      n.cy = f.y0 + (pos(id) - f.min) * rowH + GEO.h / 2;
    } else {
      n.cx = GEO.pad / 2 + (pos(id) - minV) * (W + GEO.vgx) + W / 2;
      n.cy = GEO.pad + n.rk * (GEO.h + GEO.vgy) + GEO.h / 2;
    }
  }
  const caja = (id: string) => {
    const n = N.get(id)!;
    const [w, h] = dims(n, W);
    return {
      n,
      cx: n.cx,
      cy: n.cy,
      l: n.cx - w / 2,
      r: n.cx + w / 2,
      t: n.cy - h / 2,
      b: n.cy + h / 2,
    };
  };
  type Caja = ReturnType<typeof caja>;
  const sentido = (c: Caja) => (rtl(c.n.rk) ? -1 : 1);
  const sale = (c: Caja) => (sentido(c) > 0 ? c.r : c.l);
  const entra = (c: Caja) => (sentido(c) > 0 ? c.l : c.r);
  // Los desvíos se miden desde el borde de la COLUMNA, no desde el de la caja (corrección S28 a la
  // maqueta): con una caja angosta (un fin sin rótulo, un paralelo) bajo otra de su columna, medirlos
  // desde su propio borde bajaba la flecha por dentro de la columna, atravesando la caja de encima.
  // Con las cajas de ancho completo el resultado es idéntico al de la maqueta.
  const columnaSale = (c: Caja) => c.cx + (W / 2) * sentido(c);
  const columnaEntra = (c: Caja) => c.cx - (W / 2) * sentido(c);
  const anchoFilas =
    modo === "h"
      ? GEO.pad * 2 + (Math.min(R, nR) - 1) * colW + W
      : GEO.pad + (maxV - minV) * (W + GEO.vgx) + W;
  let carril = 0;
  for (const t of tramos) {
    const s = caja(t.cadena[0]!);
    const e = caja(t.cadena[t.cadena.length - 1]!);
    let d: string;
    let lx: number;
    let ly: number;
    let max = 130;
    if (modo === "h" && !t.cruza) {
      const pts: [number, number][] = [
        [sale(s), s.cy],
        ...t.cadena
          .slice(1, -1)
          .map((id): [number, number] => [N.get(id)!.cx, N.get(id)!.cy]),
        [entra(e), e.cy],
      ];
      d = curva(pts, "h");
      lx = (pts[0]![0] + pts[1]![0]) / 2;
      ly = (pts[0]![1] + pts[1]![1]) / 2;
      max = gx - 6;
    } else if (
      modo === "h" &&
      fila(e.n.rk) === fila(s.n.rk) + 1 &&
      Math.abs(s.cx - e.cx) < 1 &&
      fondo(t.cadena[0]!) &&
      tope(t.cadena[t.cadena.length - 1]!)
    ) {
      // la recta corta solo si no hay otra caja de por medio en esa columna; si la hay, va por el canal y el margen
      const pts: [number, number][] = [
        [s.cx, s.b],
        [e.cx, e.t],
      ];
      d = curva(pts, "v");
      lx = s.cx;
      ly = (s.b + e.t) / 2;
    } else if (modo === "h") {
      const f = filas[fila(s.n.rk)]!;
      const yc = f.y0 + f.alto + GEO.canal / 2 - 8 + (carril++ % 4) * 6;
      const xs = columnaSale(s) + 14 * sentido(s);
      const xe = columnaEntra(e) - 16 * sentido(e);
      const pts: [number, number][] = [
        [sale(s), s.cy],
        [xs, s.cy],
        [xs, yc],
        [xe, yc],
        [xe, e.cy],
        [entra(e), e.cy],
      ];
      d = orto(pts);
      lx = (xs + xe) / 2;
      ly = yc;
    } else {
      const pts: [number, number][] = [
        [s.cx, s.b],
        ...t.cadena
          .slice(1, -1)
          .map((id): [number, number] => [N.get(id)!.cx, N.get(id)!.cy]),
        [e.cx, e.t],
      ];
      d = curva(pts, "v");
      lx = (pts[0]![0] + pts[1]![0]) / 2;
      ly = (pts[0]![1] + pts[1]![1]) / 2;
    }
    aristas.push({ d, vuelta: false, de: t.a.de, a: t.a.a });
    if (t.a.etq)
      etiquetas.push({ x: lx, y: ly, t: t.a.etq, max, de: t.a.de, a: t.a.a });
  }
  let alto =
    modo === "h"
      ? y0 - GEO.canal + GEO.pad
      : GEO.pad * 2 + (nR - 1) * (GEO.h + GEO.vgy) + GEO.h;
  let ancho = anchoFilas;
  if (vuelta.length && modo === "h") alto += GEO.canal - GEO.pad / 2;
  vuelta.forEach((a, k) => {
    const s = caja(a.de);
    const e = caja(a.a);
    let pts: [number, number][];
    let lx: number;
    let ly: number;
    if (modo === "h") {
      const fs = filas[fila(s.n.rk)]!;
      const fe = filas[fila(e.n.rk)]!;
      const yb = fs.y0 + fs.alto + 16 + k * 8;
      const salida: [number, number][] = fondo(a.de)
        ? [[s.cx, s.b]]
        : [
            [sale(s), s.cy],
            [columnaSale(s) + (12 + k * 4) * sentido(s), s.cy],
          ];
      const xs = salida[salida.length - 1]![0];
      if (fs === fe) {
        const entrada: [number, number][] = fondo(a.a)
          ? [[e.cx, e.b]]
          : [
              [columnaEntra(e) - (14 + k * 4) * sentido(e), e.cy],
              [entra(e), e.cy],
            ];
        pts = [...salida, [xs, yb], [entrada[0]![0], yb], ...entrada];
        lx = (xs + entrada[0]![0]) / 2;
        ly = yb;
      } else {
        const xm = 8 + k * 6;
        const ya = fe.y0 - GEO.canal / 2 + 2 + k * 6;
        const entrada: [number, number][] = tope(a.a)
          ? [[e.cx, e.t]]
          : [
              [columnaEntra(e) - (14 + k * 4) * sentido(e), e.cy],
              [entra(e), e.cy],
            ];
        pts = [
          ...salida,
          [xs, yb],
          [xm, yb],
          [xm, ya],
          [entrada[0]![0], ya],
          ...entrada,
        ];
        lx = (xs + xm) / 2;
        ly = yb;
      }
    } else {
      const xr = anchoFilas + 14 + k * 9;
      pts = [
        [s.cx, s.b],
        [s.cx, s.b + 16],
        [xr, s.b + 16],
        [xr, e.t - 16],
        [e.cx, e.t - 16],
        [e.cx, e.t],
      ];
      ancho = Math.max(ancho, xr + 12);
      lx = xr;
      ly = (s.b + e.t) / 2;
    }
    aristas.push({ d: orto(pts), vuelta: true, de: a.de, a: a.a });
    if (a.etq)
      etiquetas.push({ x: lx, y: ly, t: a.etq, max: 140, de: a.de, a: a.a });
  });
  for (const [, n] of N) {
    if (n.virtual) continue;
    const [w, h] = dims(n, W);
    nodos.push({
      id: n.id,
      tipo: n.tipo!,
      x: medio(n.cx - w / 2),
      y: medio(n.cy - h / 2),
      w: medio(w),
      h: medio(h),
    });
  }
  return {
    modo,
    porFila: R,
    anchoCaja: W,
    nodos,
    aristas,
    etiquetas: etiquetas.map((x) => ({
      ...x,
      x: medio(x.x),
      y: medio(x.y),
      max: medio(x.max),
    })),
    w: Math.ceil(ancho),
    h: Math.ceil(alto),
  };
}

/** El dibujo de un flujo para un ancho de marco (en px): lo que pinta el servidor y repinta el cliente. */
export function trazarFlujo(fl: Flujo, ancho: number): Trazado {
  const base = rangos(fl);
  const { modo, R, W, gx } = disposicion(base, ancho - 4);
  return trazar(fl, base, modo, R, gx, W);
}
