/**
 * EL EXPLORADOR DE SKILLS COMO MOTOR PURO (S29, OM-02).
 *
 * Origen: `referencias-ui/home/maqueta/plantilla.html` (planeadora, aprobada el 2026-10-31 tras cinco
 * vueltas), portado uno a uno: mismas cuentas, en el mismo orden. El azar entra inyectado (`Rng`), así
 * que con la misma semilla este motor y la maqueta dan los mismos números:
 * `tests/unit/skills-explorador.test.ts` lo comprueba contra una salida dorada generada una vez con las
 * funciones de la maqueta (`tests/fixtures/skills/maqueta-dorada.json`).
 *
 * Nada aquí toca el DOM: el escenario (`src/components/home/skills-escenario.tsx`) mide, pinta y escucha;
 * este módulo decide dónde va cada cosa.
 */

export type Rng = () => number;

/** Un área que flota: posición, velocidad, rapidez de crucero (`v`) y escala (`k`: 1,2 con el cursor encima). */
export type Cuerpo = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  v: number;
  k: number;
};

export type Medidas = {
  W: number;
  H: number;
  d: number;
  techo: number;
  angosto: boolean;
};

export type Punto = { x: number; y: number };

/** Lo que la mano le hace al motor en un cuadro: la que se detiene y la que se arrastra (con su velocidad). */
export type Fijos = {
  sobre: number;
  arrastre: { i: number; vx: number; vy: number } | null;
};

/** La rapidez máxima de una burbuja lanzada (px/s). */
export const TOPE_LANZAMIENTO = 1100;
/** Cuánto crece la que tiene el cursor encima, la agarrada o la del foco. */
export const ESCALA_SOBRE = 1.2;
/** Un clic que tiembla sigue siendo un clic: hasta 6 px con el ratón, 2 con el dedo ya armado. */
export const UMBRAL_CLIC_PX = 6;
export const UMBRAL_CLIC_DEDO_PX = 2;
/** Con el dedo, la burbuja se arma tras 0,3 s quieto; si se mueve más de 8 px antes, era la página. */
export const ESPERA_DEDO_MS = 300;
export const HOLGURA_DEDO_PX = 8;
/** La velocidad de la mano sale de los últimos 90 ms; si se quedó quieta más de 80 ms, se suelta sin impulso. */
export const VENTANA_MANO_MS = 90;
export const MANO_QUIETA_MS = 80;
/** Soltar tras arrastrar no elige: un clic dentro de este tiempo se ignora. */
export const GRACIA_SOLTAR_MS = 350;

const ANGULO_AUREO = 2.39996;

/**
 * En el celular el alto sale de cuántas áreas son (ajuste del 2026-11-01): con nueve de 120 px en 600 px de alto
 * solo cabían ocho y se quedaban trabadas, empujándose sin avanzar. Las burbujas ocupan a lo sumo el 38 % del área
 * libre (en escritorio, ≈ 32 %). Es `DENSIDAD_CELULAR` de la maqueta.
 */
export const DENSIDAD_CELULAR = 0.38;

/**
 * Las medidas del rectángulo según su ancho, el alto de la invitación (que en el celular ocupa dos o tres líneas) y
 * cuántas áreas son. Por debajo de 640 px el alto sale de ese número; por debajo de 480 px las áreas miden 112
 * (los nombres se ajustan solos). Escritorio no cambia: 620 px.
 */
export function medidas(
  W: number,
  techoInvitacion: number,
  areas = 9,
): Medidas {
  const angosto = W < 640;
  const techo = Math.max(angosto ? 74 : 62, techoInvitacion);
  const d = !angosto ? (W < 860 ? 140 : 160) : W < 480 ? 112 : 120;
  const ocupa = (areas || 9) * Math.PI * (d / 2) ** 2;
  // sin ancho (el rectángulo aún no se midió) la cuenta no tiene sentido: el alto de siempre
  const H = !angosto
    ? 620
    : W > 0
      ? Math.max(600, Math.ceil(techo + ocupa / (DENSIDAD_CELULAR * W) + 8))
      : 600;
  return { W, angosto, d, H, techo };
}

/**
 * Nacen repartidas por todo el rectángulo (de cuarenta sitios al azar, el más lejos de las ya puestas) y
 * cada una sale en su propio rumbo: el ángulo áureo da rumbos bien distintos.
 */
export function sembrar(n: number, m: Medidas, rng: Rng): Cuerpo[] {
  const { W, H, d, techo } = m;
  const r = d / 2;
  const a0 = rng() * Math.PI * 2;
  const cuerpos: Cuerpo[] = [];
  for (let i = 0; i < n; i++) {
    let mejor: Punto = { x: 0, y: 0 };
    let lejos = -1;
    for (let k = 0; k < 40; k++) {
      const x = r + 10 + rng() * Math.max(0, W - d - 20);
      const y = techo + r + rng() * Math.max(0, H - techo - d - 10);
      const cerca = cuerpos.reduce(
        (mm, c) => Math.min(mm, Math.hypot(c.x - x, c.y - y)),
        Infinity,
      );
      if (cerca > lejos) {
        lejos = cerca;
        mejor = { x, y };
      }
    }
    const a = a0 + i * ANGULO_AUREO + (rng() - 0.5) * 0.7;
    const v = 18 + rng() * 14;
    cuerpos.push({
      x: mejor.x,
      y: mejor.y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      v,
      k: 1,
    });
  }
  return cuerpos;
}

/** Contra los bordes: se corre hacia adentro y rebota. El techo queda bajo la invitación. */
export function pared(
  c: Cuerpo,
  W: number,
  H: number,
  r: number,
  techo: number,
): void {
  if (c.x < r + 8) {
    c.x = r + 8;
    c.vx = Math.abs(c.vx);
  } else if (c.x > W - r - 8) {
    c.x = W - r - 8;
    c.vx = -Math.abs(c.vx);
  }
  if (c.y < techo + r) {
    c.y = techo + r;
    c.vy = Math.abs(c.vy);
  } else if (c.y > H - r - 8) {
    c.y = H - r - 8;
    c.vy = -Math.abs(c.vy);
  }
}

export function tope(c: Cuerpo, max = TOPE_LANZAMIENTO): void {
  const s = Math.hypot(c.vx, c.vy);
  if (s > max) {
    c.vx *= max / s;
    c.vy *= max / s;
  }
}

/**
 * Si el rectángulo cambia de tamaño (la ventana o un panel que se abren angostos y luego crecen), las
 * áreas se reparten en la misma proporción. Devuelve `false` si nacieron sin ancho y hay que sembrar de
 * nuevo (antes se quedaban en la franja donde nacieron).
 */
export function reescalar(
  cuerpos: Cuerpo[],
  de: { W: number; H: number },
  m: Medidas,
): boolean {
  if (de.W < 200) return false;
  if (m.W === de.W && m.H === de.H) return true;
  for (const c of cuerpos) {
    c.x *= m.W / de.W;
    c.y *= m.H / de.H;
    pared(c, m.W, m.H, m.d / 2, m.techo);
  }
  return true;
}

const esFija = (i: number, f: Fijos) =>
  i === f.sobre || (f.arrastre !== null && i === f.arrastre.i);

/**
 * Un cuadro: deriva, bordes y choques. La rapidez vuelve sola a la de crucero (tras un golpe corre más y
 * se calma en un par de segundos); la detenida crece al 120 % al paso del CSS y choca con su tamaño nuevo;
 * contra una fija, la otra se aparta entera y rebota, y si la fija es la que arrastras, sale con el golpe
 * de tu mano.
 */
export function paso(
  cuerpos: Cuerpo[],
  dt: number,
  m: Medidas,
  fijos: Fijos,
  rng: Rng,
): void {
  const { W, H, d, techo } = m;
  const r = d / 2;
  cuerpos.forEach((c, i) => {
    const vel = Math.hypot(c.vx, c.vy) || 1;
    const meta = c.v + (vel - c.v) * Math.exp(-dt / 0.8);
    c.vx *= meta / vel;
    c.vy *= meta / vel;
    const fija = esFija(i, fijos);
    c.k += ((fija ? ESCALA_SOBRE : 1) - c.k) * (1 - Math.exp(-dt / 0.12));
    if (fija) {
      pared(c, W, H, r * c.k, techo);
      return;
    }
    const giro = (rng() - 0.5) * 1.1 * dt;
    const cs = Math.cos(giro);
    const sn = Math.sin(giro);
    [c.vx, c.vy] = [c.vx * cs - c.vy * sn, c.vx * sn + c.vy * cs];
    c.x += c.vx * dt;
    c.y += c.vy * dt;
    pared(c, W, H, r * c.k, techo);
  });
  for (let p = 0; p < cuerpos.length; p++)
    for (let q = p + 1; q < cuerpos.length; q++) {
      const a = cuerpos[p];
      const b = cuerpos[q];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      const min = r * (a.k + b.k) + 12;
      const fa = esFija(p, fijos);
      const fb = esFija(q, fijos);
      if (dist >= min || (fa && fb)) continue;
      const nx = dx / dist;
      const ny = dy / dist;
      if (!fa && !fb) {
        const emp = (min - dist) / 2;
        a.x -= nx * emp;
        a.y -= ny * emp;
        b.x += nx * emp;
        b.y += ny * emp;
        // intercambian la velocidad sobre la normal
        const va = a.vx * nx + a.vy * ny;
        const vb = b.vx * nx + b.vy * ny;
        if (va - vb > 0) {
          a.vx += (vb - va) * nx;
          a.vy += (vb - va) * ny;
          b.vx += (va - vb) * nx;
          b.vy += (va - vb) * ny;
        }
      } else {
        const [mv, iFija, s] = fa ? [b, p, 1] : [a, q, -1];
        const ux = nx * s;
        const uy = ny * s;
        mv.x += ux * (min - dist);
        mv.y += uy * (min - dist);
        const fv =
          fijos.arrastre && fijos.arrastre.i === iFija
            ? fijos.arrastre
            : { vx: 0, vy: 0 };
        const rel = (mv.vx - fv.vx) * ux + (mv.vy - fv.vy) * uy;
        if (rel < 0) {
          mv.vx -= 1.7 * rel * ux;
          mv.vy -= 1.7 * rel * uy;
          tope(mv);
        }
        pared(mv, W, H, r * mv.k, techo);
      }
    }
}

/** ¿El puntero está sobre el círculo (no sobre su caja)? */
export function enCirculo(c: Cuerpo, r: number, p: Punto | null): boolean {
  return p !== null && Math.hypot(c.x - p.x, c.y - p.y) <= r * c.k;
}

/**
 * La que se detiene en este cuadro: la agarrada sin mover, si no la que tiene el cursor encima (salvo la
 * que acabas de lanzar), y si no la del foco del teclado. Con un área abierta, ninguna por el cursor.
 */
export function cualSeDetiene(
  cuerpos: Cuerpo[],
  r: number,
  p: Punto | null,
  o: {
    agarrada: { i: number; movido: boolean } | null;
    elegida: number;
    suelta: number;
    foco: number;
  },
): number {
  let s = -1;
  if (o.agarrada) s = o.agarrada.movido ? -1 : o.agarrada.i;
  else if (o.elegida < 0)
    s = cuerpos.findIndex((c, i) => i !== o.suelta && enCirculo(c, r, p));
  if (s < 0) s = o.foco;
  return s;
}

/** Muestras de la mano: [instante en ms, x, y]. */
export type Muestra = [number, number, number];

/**
 * Registra una muestra y devuelve la velocidad de la mano de los últimos 90 ms (o `null` si la ventana es
 * demasiado corta para medirla). Muta `muestras`.
 */
export function velocidadDeMano(
  muestras: Muestra[],
  ahora: number,
  x: number,
  y: number,
): { vx: number; vy: number } | null {
  muestras.push([ahora, x, y]);
  while (muestras.length > 2 && ahora - muestras[0][0] > VENTANA_MANO_MS)
    muestras.shift();
  const [t0, x0, y0] = muestras[0];
  const dtm = (ahora - t0) / 1000;
  return dtm > 0.01 ? { vx: (x - x0) / dtm, vy: (y - y0) / dtm } : null;
}

/**
 * Al soltarla: lanzada, sale con el impulso (con tope) y se calma sola; soltada despacio, sigue a su ritmo
 * hacia donde la llevabas; quieta, conserva su rumbo.
 */
export function lanzar(
  c: Cuerpo,
  vx: number,
  vy: number,
  quieta: boolean,
): void {
  const ux = quieta ? 0 : vx;
  const uy = quieta ? 0 : vy;
  const s = Math.hypot(ux, uy);
  if (s > c.v) {
    c.vx = ux;
    c.vy = uy;
    tope(c);
  } else if (s > 1) {
    c.vx = (ux / s) * c.v;
    c.vy = (uy / s) * c.v;
  }
}

/** Con la mano encima, la arrastrada no se sale: el centro queda dentro de los bordes con su tamaño de agarrada. */
export function dentro(x: number, y: number, rk: number, m: Medidas): Punto {
  return {
    x: Math.min(Math.max(x, rk + 8), m.W - rk - 8),
    y: Math.min(Math.max(y, m.techo + rk), m.H - rk - 8),
  };
}

// ── elegir un área: ella al centro, sus herramientas alrededor y conectadas ──────────────────────────

/** El alto y el tamaño de letra de las herramientas, que se fijan ANTES de medirlas. */
export function estiloDeChips(angosto: boolean): { max: number; fs: number } {
  return angosto ? { max: 132, fs: 12 } : { max: 200, fs: 13.5 };
}

export type Colocacion = {
  H: number;
  sc: number;
  centro: Punto;
  R: number;
  posiciones: Punto[];
  lineas: { x1: number; y1: number; x2: number; y2: number }[];
};

/**
 * La elegida al centro, entre «← Todas las áreas» (arriba) y la barra de la anterior y la siguiente
 * (abajo); sus herramientas en una elipse, que luego se apartan entre sí, del centro y de los bordes en
 * 120 pasadas. Con más de nueve, una de cada dos va más adentro. Es igual en escritorio y en móvil:
 * siempre alrededor, nunca debajo.
 */
export function colocarChips(
  cajas: { w: number; h: number }[],
  W: number,
  angosto: boolean,
  d: number,
): Colocacion {
  const n = cajas.length;
  const H = angosto ? Math.max(560, 380 + n * 30) + 50 : 620; // + 50: la barra «← 2 · 4 →» de abajo
  const sc = angosto ? 1.12 : 1.3;
  const cx = W / 2;
  const cy = (60 + H - 62) / 2;
  const R = (d / 2) * sc;
  const rx = angosto ? W * 0.36 : Math.min(W * 0.4, 390);
  const ry = angosto ? (H - 122) * 0.42 : 205;
  const C = cajas.map(({ w, h }, j) => {
    const a = -Math.PI / 2 + (2 * Math.PI * j) / n + (n % 2 ? 0 : Math.PI / n);
    const f = n > 9 && j % 2 ? 0.76 : 1;
    return {
      w,
      h,
      x: cx + Math.cos(a) * rx * f,
      y: cy + Math.sin(a) * ry * f,
    };
  });
  for (let it = 0; it < 120; it++) {
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        const A = C[p];
        const B = C[q];
        const ox = (A.w + B.w) / 2 + 8 - Math.abs(A.x - B.x);
        const oy = (A.h + B.h) / 2 + 7 - Math.abs(A.y - B.y);
        if (ox > 0 && oy > 0) {
          if (ox < oy * 1.5) {
            const s = ((A.x < B.x ? -1 : 1) * ox) / 2;
            A.x += s;
            B.x -= s;
          } else {
            const s = ((A.y < B.y ? -1 : 1) * oy) / 2;
            A.y += s;
            B.y -= s;
          }
        }
      }
    for (const c of C) {
      const px = Math.max(c.x - c.w / 2, Math.min(cx, c.x + c.w / 2));
      const py = Math.max(c.y - c.h / 2, Math.min(cy, c.y + c.h / 2));
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const min = R + 14;
      if (dist < min) {
        const k = (min - dist) / dist;
        c.x += dx * k + (dx === 0 ? 0.5 : 0);
        c.y += dy * k;
      }
      c.x = Math.max(8 + c.w / 2, Math.min(W - 8 - c.w / 2, c.x));
      c.y = Math.max(60 + c.h / 2, Math.min(H - 62 - c.h / 2, c.y));
    }
  }
  return {
    H,
    sc,
    centro: { x: cx, y: cy },
    R,
    posiciones: C.map(({ x, y }) => ({ x, y })),
    lineas: C.map((c) => {
      const a = Math.atan2(c.y - cy, c.x - cx);
      return {
        x1: cx + Math.cos(a) * (R + 3),
        y1: cy + Math.sin(a) * (R + 3),
        x2: c.x,
        y2: c.y,
      };
    }),
  };
}

/** «← 2 · 4 →» y las flechas: la anterior o la siguiente por número; da la vuelta del 9 al 1. */
export function vecina(i: number, paso: number, n: number): number {
  return (i + paso + n) % n;
}

// ── las herramientas: nombre, nota y estado ───────────────────────────────────────────────────────────

const ESTADOS =
  /^(prototipo|prototype|en estudio|studying|en exploración|exploring|en preparación|in preparation)$/i;

export type ItemPartido = { nombre: string; nota?: string; estado?: string };

/**
 * «Databricks: … — prototipo»: lo que va después de la última raya es una nota; si es un estado, va como
 * etiqueta (con texto, no solo color).
 */
export function partirItem(t: string): ItemPartido {
  const k = t.lastIndexOf(" — ");
  if (k < 0) return { nombre: t };
  const nota = t.slice(k + 3);
  return ESTADOS.test(nota)
    ? { nombre: t.slice(0, k), estado: nota }
    : { nombre: t.slice(0, k), nota };
}

// ── los nombres siempre caben en su círculo ───────────────────────────────────────────────────────────

/** El tamaño con que se empieza a medir cada nombre, el mínimo y el paso con que se achica. */
export const NOMBRE_FS = {
  inicial: (d: number) => (d >= 140 ? 15 : 13.5),
  minimo: 10,
  paso: 0.5,
};

/**
 * ¿El bloque del nombre (y el icono encima) cabe en el círculo? Ninguna palabra más ancha que el 80 % del
 * diámetro, y las esquinas del bloque dentro del círculo con su margen.
 */
export function nombreCabe(
  d: number,
  medida: { anchoPalabras: number; anchoTexto: number; altoTexto: number },
): boolean {
  const r = d / 2;
  if (medida.anchoPalabras > d * 0.8 + 0.5) return false;
  const alto = medida.altoTexto + (d < 130 ? 22 : 32);
  return Math.hypot(medida.anchoTexto / 2, alto / 2) <= r - (d < 130 ? 6 : 9);
}

// ── la red del fondo ──────────────────────────────────────────────────────────────────────────────────

export type PuntoRed = { x: number; y: number; vx: number; vy: number };

/** Cuántos puntos: uno por cada 9000 px², entre 22 y 72 (≈ 60 en escritorio, ≈ 24 en móvil). */
export function puntosDeRed(W: number, H: number): number {
  return Math.round(Math.min(72, Math.max(22, (W * H) / 9000)));
}

/** La distancia hasta la que dos puntos se enlazan. */
export function alcanceDeRed(W: number): number {
  return W < 640 ? 96 : 124;
}

/** Ajusta la red a un rectángulo nuevo: reescala lo que había, agrega o recorta puntos. Muta `red`. */
export function ajustarRed(
  red: PuntoRed[],
  de: { W: number; H: number },
  W: number,
  H: number,
  rng: Rng,
): void {
  if (de.W)
    for (const p of red) {
      p.x *= W / de.W;
      p.y *= H / de.H;
    }
  const n = puntosDeRed(W, H);
  while (red.length < n) {
    const a = rng() * Math.PI * 2;
    const v = 4 + rng() * 6;
    red.push({
      x: rng() * W,
      y: rng() * H,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
    });
  }
  red.length = n;
}

/** Un cuadro de la red: derivan y rebotan en los bordes. */
export function pasoRed(
  red: PuntoRed[],
  dt: number,
  W: number,
  H: number,
): void {
  for (const p of red) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.x < 0 || p.x > W) {
      p.vx *= -1;
      p.x = Math.min(Math.max(p.x, 0), W);
    }
    if (p.y < 0 || p.y > H) {
      p.vy *= -1;
      p.y = Math.min(Math.max(p.y, 0), H);
    }
  }
}

/** Los enlaces de la red: cada par cercano con su opacidad (más tenue cuanto más lejos). */
export function enlacesDeRed(
  red: PuntoRed[],
  L: number,
): { a: PuntoRed; b: PuntoRed; alfa: number }[] {
  const out: { a: PuntoRed; b: PuntoRed; alfa: number }[] = [];
  for (let i = 0; i < red.length; i++)
    for (let j = i + 1; j < red.length; j++) {
      const a = red[i];
      const b = red[j];
      const dd = Math.hypot(a.x - b.x, a.y - b.y);
      if (dd < L) out.push({ a, b, alfa: 0.16 * (1 - dd / L) });
    }
  return out;
}

// ── las áreas ya vistas ───────────────────────────────────────────────────────────────────────────────

export type VistasGuardadas = { ids: string[]; locale: string; t: number };

/** Cambiar de idioma vuelve a montar la home en milisegundos; volver a entrar tarda mucho más. */
export const VENTANA_CAMBIO_DE_IDIOMA_MS = 5000;

/**
 * Las áreas abiertas viven solo en memoria: se reinician al recargar o al volver a entrar a la página, y
 * sobreviven al cambio de idioma (la home del otro idioma se monta enseguida). Lo guardado vale solo si el
 * idioma cambió y el montaje llegó dentro de la ventana.
 */
export function conservarVistas(
  guardado: VistasGuardadas | null,
  ahora: { locale: string; t: number },
): string[] {
  if (!guardado) return [];
  const cambioDeIdioma = guardado.locale !== ahora.locale;
  const enseguida =
    ahora.t >= guardado.t &&
    ahora.t - guardado.t <= VENTANA_CAMBIO_DE_IDIOMA_MS;
  return cambioDeIdioma && enseguida ? [...guardado.ids] : [];
}

/** Rellena una plantilla de los mensajes: «{n} de {t}». */
export function rellenar(
  plantilla: string,
  valores: Record<string, string | number>,
): string {
  return plantilla.replace(/\{(\w+)\}/g, (todo, k: string) =>
    Object.hasOwn(valores, k) ? String(valores[k]) : todo,
  );
}
