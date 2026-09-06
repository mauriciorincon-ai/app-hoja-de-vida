/**
 * MOTOR BPMN-LITE — de un proceso declarado a su geometría (ADR-016).
 *
 * Puro: no toca el DOM ni React. Recibe el proceso tal como viene en el
 * contrato de la ficha técnica (carriles · pasos · flujos · anotaciones) y
 * devuelve rectángulos, trayectos y rótulos listos para pintar en SVG. La
 * razón de que exista: seis apps hoy, más agentes, investigaciones y tableros
 * mañana — dibujar cada diagrama a mano garantiza que en dos meses cada uno
 * tiene su estilo. Con el motor, el trazado no depende del pulso de nadie.
 *
 * Vocabulario (BPMN 2.0, el subconjunto que una ficha necesita):
 *  - **pool** (el proceso) con **carriles** (uno por actor);
 *  - **inicio** ○ · **tarea** ▭ · **decisión** ◇ (compuerta exclusiva) · **fin** ◉;
 *  - **flujos de secuencia** ortogonales con flecha; los de retorno (bucles)
 *    salen por abajo y entran por abajo;
 *  - **anotaciones** como llamadas numeradas ①②… al lado de su tarea, con el
 *    texto al pie del diagrama — inline se pisan con los flujos en cuanto el
 *    carril es angosto, y en móvil no hay sitio;
 *  - **eventos de enlace** ⟶Ⓐ … Ⓐ⟶ cuando el proceso no cabe en una fila:
 *    el diagrama se parte en filas de N columnas (nunca se encoge hasta lo
 *    ilegible) y cada flujo que cruza de fila se empalma con un par de enlaces
 *    con la misma letra. Es BPMN de manual, no un truco.
 *
 * Cada paso ocupa su propia columna, en el orden en que viene declarado: el
 * autor del proceso controla la lectura de izquierda a derecha.
 */

export type TipoPaso = "inicio" | "tarea" | "decision" | "fin";

export type Proceso = {
  titulo: string;
  carriles: { id: string; nombre: string }[];
  pasos: { id: string; tipo: TipoPaso; carril: string; texto: string }[];
  flujos: { de: string; a: string; etiqueta?: string }[];
  anotaciones?: { paso: string; texto: string }[];
};

export type Nodo = {
  id: string;
  tipo: TipoPaso;
  texto: string;
  lineas: string[];
  carril: string;
  fila: number;
  col: number;
  /** Centro. */
  x: number;
  y: number;
  /** Caja envolvente. */
  l: number;
  r: number;
  t: number;
  b: number;
  /** Número de llamada (①…) si tiene anotación. */
  nota?: number;
  /**
   * Solo decisiones: el texto NO cabe dentro del rombo y se pinta ENCIMA,
   * partido en `lineas` (convención BPMN: el rótulo de la compuerta va fuera).
   * Dentro solo cuando es corto — «¿Supera?» sí, «¿Con sus palabras?» no:
   * con 18 caracteres desbordaba 60px a cada lado y la flecha de entrada lo
   * atravesaba (Nutri-Kids, 2026-09-06).
   */
  rotuloFuera?: boolean;
};

export type CarrilTrazado = {
  id: string;
  nombre: string;
  /** El nombre partido a la banda de rótulos. */
  lineas: string[];
  y: number;
  alto: number;
};
export type FilaTrazada = {
  y: number;
  alto: number;
  carriles: CarrilTrazado[];
};

export type FlujoTrazado = {
  de: string;
  a: string;
  /** Atributo `d` del <path>. */
  d: string;
  etiqueta?: string;
  lx?: number;
  ly?: number;
  /** Anclaje del rótulo (por defecto `start`). */
  anclaTexto?: "start" | "end";
};

/** Par de eventos de enlace para un flujo que cruza de fila. */
export type Enlace = {
  letra: string;
  de: string;
  a: string;
  salida: { x: number; y: number };
  entrada: { x: number; y: number };
};

export type Trazo = {
  ancho: number;
  alto: number;
  filas: FilaTrazada[];
  nodos: Nodo[];
  flujos: FlujoTrazado[];
  enlaces: Enlace[];
  notas: { n: number; paso: string; texto: string }[];
};

export type Opciones = {
  /** Pasos por fila antes de partir el diagrama con eventos de enlace. */
  columnasPorFila?: number;
};

/* ── Geometría (unidades del viewBox; el SVG escala) ─────────────────────── */
export const G = {
  ROTULO_CARRIL: 120, // ancho de la banda de rótulos de carril
  ENLACE: 40, // zona reservada a cada lado de la fila para los eventos de enlace
  COL_TAREA: 132,
  COL_EVENTO: 48,
  COL_INICIO_CON_TEXTO: 96, // el rótulo del inicio va debajo del círculo
  ALTO_CARRIL: 100,
  ANCHO_TAREA: 116,
  ALTO_TAREA: 58,
  LADO_DECISION: 44,
  RADIO_EVENTO: 13,
  RADIO_ENLACE: 11,
  MARGEN_SUP: 30, // título del pool
  ENTRE_FILAS: 36,
  MARGEN_INF: 10,
} as const;

const MAX_CARACTERES_LINEA = 19;
const MAX_LINEAS = 3;
/** Caracteres por línea del rótulo de carril (mono 10px en la banda). */
const MAX_CARACTERES_CARRIL = 13;
/**
 * Caracteres que caben DENTRO del rombo (su diagonal mide LADO·√2 ≈ 62px; a
 * ~6.2px por carácter en 10.5px semibold, 9 caracteres ≈ 56px). Más largo,
 * el rótulo va encima, partido a `MAX_CARACTERES_ROTULO_DECISION`.
 */
export const MAX_CARACTERES_DENTRO_DECISION = 9;
const MAX_CARACTERES_ROTULO_DECISION = 16;

/** Parte un texto en líneas de ~N caracteres, sin cortar palabras. */
export function partirTexto(
  texto: string,
  max = MAX_CARACTERES_LINEA,
): string[] {
  const lineas: string[] = [];
  let actual = "";
  for (const palabra of texto.split(/\s+/).filter(Boolean)) {
    const candidata = actual ? `${actual} ${palabra}` : palabra;
    if (candidata.length > max && actual) {
      lineas.push(actual);
      actual = palabra;
    } else actual = candidata;
  }
  if (actual) lineas.push(actual);
  if (lineas.length > MAX_LINEAS) {
    const cabe = lineas.slice(0, MAX_LINEAS);
    cabe[MAX_LINEAS - 1] = cabe[MAX_LINEAS - 1].replace(/.{0,2}$/, "…");
    return cabe;
  }
  return lineas;
}

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** `Array.from` cuenta caracteres, no bytes («¿» pesa dos en UTF-8). */
function cabeDentro(texto: string): boolean {
  return Array.from(texto).length <= MAX_CARACTERES_DENTRO_DECISION;
}

function anchoColumna(p: { tipo: TipoPaso; texto: string }): number {
  if (p.tipo === "inicio")
    return p.texto ? G.COL_INICIO_CON_TEXTO : G.COL_EVENTO;
  if (p.tipo === "fin") return G.COL_EVENTO;
  return G.COL_TAREA;
}

export function trazar(proceso: Proceso, opciones: Opciones = {}): Trazo {
  const porFila = Math.max(3, opciones.columnasPorFila ?? 6);
  const carrilIdx = new Map(proceso.carriles.map((c, i) => [c.id, i]));
  for (const p of proceso.pasos) {
    if (!carrilIdx.has(p.carril))
      throw new Error(
        `bpmn: el paso «${p.id}» está en un carril que no existe («${p.carril}»)`,
      );
  }
  const ids = new Set(proceso.pasos.map((p) => p.id));
  for (const f of proceso.flujos) {
    if (!ids.has(f.de) || !ids.has(f.a))
      throw new Error(
        `bpmn: el flujo ${f.de} → ${f.a} apunta a un paso que no existe`,
      );
  }

  const nCarriles = proceso.carriles.length;
  const altoPool = nCarriles * G.ALTO_CARRIL;
  const nFilas = Math.ceil(proceso.pasos.length / porFila);

  // Columnas por fila: cada paso tiene la suya; el ancho depende del tipo.
  const filas: { pasos: typeof proceso.pasos; xs: number[]; ancho: number }[] =
    [];
  for (let f = 0; f < nFilas; f++) {
    const pasos = proceso.pasos.slice(f * porFila, (f + 1) * porFila);
    const xs: number[] = [];
    let x = G.ROTULO_CARRIL + G.ENLACE;
    for (const p of pasos) {
      xs.push(x);
      x += anchoColumna(p);
    }
    filas.push({ pasos, xs, ancho: x + G.ENLACE });
  }
  const ancho = Math.max(...filas.map((f) => f.ancho));

  // Anotaciones → números de llamada, en orden de declaración.
  const notas = (proceso.anotaciones ?? []).map((a, i) => {
    if (!ids.has(a.paso))
      throw new Error(
        `bpmn: la anotación ${i + 1} apunta a un paso que no existe («${a.paso}»)`,
      );
    return { n: i + 1, paso: a.paso, texto: a.texto };
  });
  const notaDe = new Map(notas.map((n) => [n.paso, n.n]));

  const filasTrazadas: FilaTrazada[] = [];
  const nodos: Nodo[] = [];
  filas.forEach((fila, f) => {
    const y0 = G.MARGEN_SUP + f * (altoPool + G.ENTRE_FILAS);
    filasTrazadas.push({
      y: y0,
      alto: altoPool,
      carriles: proceso.carriles.map((c, i) => ({
        id: c.id,
        nombre: c.nombre,
        lineas: partirTexto(c.nombre, MAX_CARACTERES_CARRIL),
        y: y0 + i * G.ALTO_CARRIL,
        alto: G.ALTO_CARRIL,
      })),
    });
    fila.pasos.forEach((p, c) => {
      const cw = anchoColumna(p);
      const x = fila.xs[c] + cw / 2;
      const y =
        y0 + (carrilIdx.get(p.carril) ?? 0) * G.ALTO_CARRIL + G.ALTO_CARRIL / 2;
      let hw: number;
      let hh: number;
      if (p.tipo === "tarea") {
        hw = G.ANCHO_TAREA / 2;
        hh = G.ALTO_TAREA / 2;
      } else if (p.tipo === "decision") {
        hw = G.LADO_DECISION / 2;
        hh = G.LADO_DECISION / 2;
      } else {
        hw = G.RADIO_EVENTO;
        hh = G.RADIO_EVENTO;
      }
      nodos.push({
        id: p.id,
        tipo: p.tipo,
        texto: p.texto,
        lineas:
          p.tipo === "tarea"
            ? partirTexto(p.texto)
            : p.tipo === "inicio"
              ? partirTexto(p.texto, 15)
              : p.tipo === "decision" && !cabeDentro(p.texto)
                ? partirTexto(p.texto, MAX_CARACTERES_ROTULO_DECISION)
                : [p.texto],
        carril: p.carril,
        fila: f,
        col: f * porFila + c,
        x,
        y,
        l: x - hw,
        r: x + hw,
        t: y - hh,
        b: y + hh,
        nota: notaDe.get(p.id),
        ...(p.tipo === "decision" && !cabeDentro(p.texto)
          ? { rotuloFuera: true }
          : {}),
      });
    });
  });
  const nodo = new Map(nodos.map((n) => [n.id, n]));

  const flujos: FlujoTrazado[] = [];
  const enlaces: Enlace[] = [];
  let letra = 0;

  for (const f of proceso.flujos) {
    const A = nodo.get(f.de)!;
    const B = nodo.get(f.a)!;

    if (A.fila !== B.fila) {
      // Cruza de fila ⇒ par de eventos de enlace con la misma letra.
      // Los eventos de enlace viven en las zonas reservadas de los márgenes.
      // Si el carril está LIBRE entre el nodo y el margen, el empalme va en
      // recta (lo más legible). Si hay otros nodos del mismo carril en medio,
      // va por CANAL: la salida baja al canal inferior del pool y sube por el
      // margen derecho; la entrada baja desde el margen izquierdo al canal
      // superior y entra a B por arriba. Los canales son franjas sin nodos.
      const L = LETRAS[letra++ % LETRAS.length];
      const filaA = filasTrazadas[A.fila];
      const filaB = filasTrazadas[B.fila];
      const salida = { x: ancho - G.ENLACE / 2, y: A.y };
      const entrada = { x: G.ROTULO_CARRIL + G.ENLACE / 2, y: B.y };
      enlaces.push({ letra: L, de: A.id, a: B.id, salida, entrada });
      const libreDerecha = !nodos.some(
        (n) => n.fila === A.fila && n.carril === A.carril && n.col > A.col,
      );
      const libreIzquierda = !nodos.some(
        (n) => n.fila === B.fila && n.carril === B.carril && n.col < B.col,
      );
      const canalInf = filaA.y + filaA.alto - 8;
      const canalSup = filaB.y + 8;
      flujos.push({
        de: A.id,
        a: `enlace:${L}`,
        d: libreDerecha
          ? `M${A.r},${A.y} H${salida.x - G.RADIO_ENLACE}`
          : `M${A.x},${A.b} V${canalInf} H${salida.x} V${salida.y + G.RADIO_ENLACE}`,
        etiqueta: f.etiqueta,
        // Con canal, el rótulo va al ARRANQUE DEL CANAL INFERIOR, a la derecha
        // de la bajada. Pegado al nodo no cabe: a la izquierda cruza la
        // vertical del flujo que entra por la columna anterior («vuelve a los
        // datos» tachado, DS) y a la derecha la del que sale hacia la columna
        // siguiente («no · otra vez» sobre el «sí», Habla) — entre ambas hay
        // 52px y un rótulo corto mide 80. La franja del canal, en cambio, no
        // tiene cajas (terminan 13px arriba) ni verticales ajenas.
        lx: libreDerecha ? A.r + 6 : A.x + 6,
        ly: libreDerecha ? A.y - 6 : canalInf - 3,
        anclaTexto: "start",
      });
      flujos.push({
        de: `enlace:${L}`,
        a: B.id,
        d: libreIzquierda
          ? `M${entrada.x + G.RADIO_ENLACE},${B.y} H${B.l}`
          : `M${entrada.x},${entrada.y - G.RADIO_ENLACE} V${canalSup} H${B.x} V${B.t}`,
      });
      continue;
    }

    const filaY = filasTrazadas[A.fila];
    const colXB = filas[B.fila].xs[B.col - B.fila * porFila];

    const saltaNodo =
      A.carril === B.carril &&
      nodos.some(
        (n) =>
          n.fila === A.fila &&
          n.carril === A.carril &&
          n.col > A.col &&
          n.col < B.col,
      );

    if (A.col < B.col && A.carril === B.carril && !saltaNodo) {
      // Recto, mismo carril.
      flujos.push({
        de: A.id,
        a: B.id,
        d: `M${A.r},${A.y} H${B.l}`,
        etiqueta: f.etiqueta,
        lx: (A.r + B.l) / 2,
        ly: A.y - 6,
      });
    } else if (A.col < B.col && saltaNodo) {
      // Mismo carril pero con un nodo EN MEDIO: recto pasaría por detrás de
      // su caja (la caja tapa la línea y el rótulo, y una decisión parece
      // tener un solo camino — el «no» de «¿Corregir?» en Dash, 2026-09-06).
      // Va por debajo, dentro del carril: baja del origen, corre 7px bajo las
      // cajas (terminan a 21 del borde) y entra al destino por abajo.
      const carril = filaY.carriles.find((c) => c.id === A.carril)!;
      const yBajo = carril.y + carril.alto - 14;
      flujos.push({
        de: A.id,
        a: B.id,
        d: `M${A.x},${A.b} V${yBajo} H${B.x} V${B.b}`,
        etiqueta: f.etiqueta,
        // A 10px de la bajada: a 6 rozaba la esquina inferior del rombo.
        lx: A.x + 10,
        ly: yBajo - 3,
      });
    } else if (A.col < B.col) {
      // Adelante, cambia de carril: canal vertical justo antes de la columna destino.
      const canal = colXB - 8;
      flujos.push({
        de: A.id,
        a: B.id,
        d: `M${A.r},${A.y} H${canal} V${B.y} H${B.l}`,
        etiqueta: f.etiqueta,
        // Sobre el tramo VERTICAL, a la altura del primer borde de carril que
        // cruza: esa franja nunca tiene cajas (van a ±29 del centro) ni
        // tramos horizontales (van por el centro). En el codo, junto al
        // origen, se pisaba con el rótulo del camino recto de la misma
        // decisión cuando el destino está en la columna siguiente
        // («no supera» + «sí» = «no superasí», DS 2026-09-06).
        lx: canal + 5,
        ly:
          B.y > A.y
            ? A.y + G.ALTO_CARRIL / 2 - 5
            : A.y - G.ALTO_CARRIL / 2 + 13,
      });
    } else if (A.col === B.col) {
      // Vertical, misma columna.
      const abajo = B.y > A.y;
      flujos.push({
        de: A.id,
        a: B.id,
        d: abajo ? `M${A.x},${A.b} V${B.t}` : `M${A.x},${A.t} V${B.b}`,
        etiqueta: f.etiqueta,
        lx: A.x + 6,
        ly: (A.y + B.y) / 2,
      });
    } else {
      // Retorno (bucle): por abajo del pool, y entra a B por abajo.
      const canal = filaY.y + filaY.alto - 8;
      flujos.push({
        de: A.id,
        a: B.id,
        d: `M${A.x},${A.b} V${canal} H${B.x} V${B.b}`,
        etiqueta: f.etiqueta,
        lx: A.x - 6,
        ly: A.b + 14,
        anclaTexto: "end",
      });
    }
  }

  const ultima = filasTrazadas[filasTrazadas.length - 1];
  const alto = ultima.y + ultima.alto + G.MARGEN_INF;

  return { ancho, alto, filas: filasTrazadas, nodos, flujos, enlaces, notas };
}
