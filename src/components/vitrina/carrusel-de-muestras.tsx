"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { usePrefiereQuieto } from "@/components/motion/use-prefiere-quieto";

/**
 * CARRUSEL DE MUESTRAS DE APP — los bloques de `/vitrina/apps` (post-S9).
 *
 * Cada bloque de categoría (Profesionales · Personales) pone sus muestras en
 * una pista que se recorre con los dos botones, con el dedo, con las flechas
 * del teclado y con el gesto lateral del trackpad o la rueda. **Ningún botón
 * se apaga jamás** y el recorrido **da la vuelta**: se nota dónde empieza y dónde
 * acaba, y desde el final «siguiente» regresa al inicio con un barrido rápido
 * (y «anterior» desde el inicio barre hasta el final).
 *
 * **Tres posiciones, para que se note el principio y el fin** (decisión del
 * dueño). `i` es la primera tarjeta visible, `k` cuántas enteras caben (1 en el
 * teléfono, 2 desde 640 px) y `max = N − k` la última posición:
 *  · **inicio** (`i = 0`): las primeras enteras pegadas al borde izquierdo y un
 *    pedazo difuminado de la siguiente a la derecha; nada a la izquierda: el
 *    borde limpio dice «aquí empieza»;
 *  · **intermedio**: un pedazo difuminado a cada lado y las enteras CENTRADAS;
 *  · **final** (`i = max`): el espejo del inicio —las últimas enteras pegadas
 *    al borde derecho, un pedazo difuminado a la izquierda y nada a la
 *    derecha—.
 * Los pedazos son siempre tarjetas reales vecinas: el DOM tiene EXACTAMENTE las
 * N tarjetas, en el orden del YAML y sin copias en ningún estado (enlaces,
 * ATS, chat y tests que cuentan tarjetas siguen viendo N).
 *
 * **Geometría 100 % CSS**: ancho de tarjeta `--tw`, hueco `--hu`, enteras por
 * vista `--k`, paso `--paso = --tw + --hu` y margen `--o` que centra el
 * grupo. La pista se coloca con `translateX(calc(−i·paso + B·o))`, con B = 0
 * en el inicio, 1 en medio y 2 en el final (`2·o` es el sobrante de la
 * columna: pega el grupo a la derecha). Lo único que se mide en JS es `k`
 * (cuántas caben), para saber dónde acaba el recorrido.
 *
 * Es el patrón APG de carrusel (grupo `carousel` con nombre, cada tarjeta un
 * `slide` con su «n de N» por su índice REAL, `status` educado, pista con foco)
 * con las mismas flechas y el mismo indicador de la galería de los tableros
 * —esa galería, que son pantallas de UNA pieza, no se toca—. Sin autoplay:
 * nada se mueve solo.
 *
 * **Rueda y trackpad.** Solo el gesto HORIZONTAL (en el Mac, dos dedos de lado;
 * en un ratón, rueda inclinada o Shift + rueda) gira, una tarjeta por gesto: la
 * inercia del trackpad sigue emitiendo eventos casi un segundo y no debe girar
 * más. La rueda vertical sigue desplazando la página: capturarla atraparía al
 * visitante dentro del carrusel. El oyente es no pasivo para poder cancelar el
 * «atrás/adelante» del navegador que dispara el deslizamiento lateral.
 *
 *  · **una sola tarjeta:** sin botones, sin velos, sin foco y sin roles;
 *  · **cuando caben todas** (`max = 0`) los botones no mueven nada;
 *  · si el foco cae en una tarjeta que quedó fuera de la vista (Tab), el
 *    carrusel la trae a la vista.
 *
 * **Regla 5(a):** la FORMA del árbol jamás depende de `usePrefiereQuieto()`
 * (vale `null` en el servidor) ni de lo medido. El hook solo decide si el giro
 * se anima —y la transición nace APAGADA: solo se enciende al girar—; `k` solo
 * mueve el estado tras montar. Los textos llegan por props (el namespace de
 * next-intl no viaja al bundle cliente). Sin JS las N tarjetas están en el
 * HTML (gate ATS).
 */
export type EtiquetasCarruselMuestras = {
  /** Nombre accesible del carrusel, p. ej. «Apps profesionales». */
  etiqueta: string;
  anterior: string;
  siguiente: string;
  /** «1 de 3», «2 de 3»…: uno por tarjeta, ya traducido. */
  indicadores: string[];
};

/** Cuánto debe arrastrarse el dedo para que cuente como un giro. */
const ARRASTRE_MIN_PX = 40;
/** Un paso entre tarjetas vecinas. */
const PASO_MS = 320;
/** El barrido acelerado entre el final y el inicio. */
const BARRIDO_MS = 560;
/** Lo que debe acumular el gesto lateral para contar como un giro. */
const RUEDA_UMBRAL_PX = 30;
/** Sin eventos de rueda durante este tiempo, el gesto terminó (la inercia lo alarga). */
const RUEDA_SILENCIO_MS = 180;

/** Posición de la pista: `a` pasos y `b` márgenes de centrado (ver cabecera). */
const tf = (a: number, b: number) =>
  `translateX(calc(${a} * var(--paso) + ${b} * var(--o)))`;

export function CarruselDeMuestras({
  etiquetas,
  children,
}: {
  etiquetas: EtiquetasCarruselMuestras;
  children: ReactNode;
}) {
  const tarjetas = Children.toArray(children);
  const total = tarjetas.length;
  const hay = total > 1;
  const envoltura = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [k, setK] = useState(1);
  const [anima, setAnima] = useState(false);
  const [dur, setDur] = useState(PASO_MS);
  const arrastre = useRef<number | null>(null);
  const ultimo = useRef({ dx: 0, t: -Infinity });
  const quieto = usePrefiereQuieto();

  const max = Math.max(0, total - k);
  const idx = Math.min(i, max);
  const b = idx === 0 ? 0 : idx === max ? 2 : 1;

  // Cuántas tarjetas enteras caben: decide dónde acaba el recorrido. Se mide
  // al montar y cuando cambia el tamaño; nunca decide qué se pinta.
  useEffect(() => {
    const p = pista.current;
    if (!p || !hay) return;
    const medir = () => {
      const t = p.querySelector<HTMLElement>("[data-tarjeta]");
      if (!t) return;
      const hueco = parseFloat(getComputedStyle(p).columnGap) || 0;
      const paso = t.offsetWidth + hueco;
      if (paso <= 0) return;
      setK(Math.max(1, Math.floor((p.offsetWidth + hueco + 0.5) / paso)));
    };
    medir();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(medir);
    ro.observe(p);
    return () => ro.disconnect();
  }, [hay, total]);

  function girar(dir: 1 | -1) {
    if (!hay || max === 0) return;
    const sig = idx + dir;
    const barrido = sig > max || sig < 0;
    setAnima(!quieto);
    setDur(barrido ? BARRIDO_MS : PASO_MS);
    setI(sig > max ? 0 : sig < 0 ? max : sig);
  }

  // El oyente de rueda es nativo y no pasivo: React registra `onWheel` como
  // pasivo y no dejaría cancelar el «atrás/adelante» del navegador. Lee la
  // última `girar` por una ref.
  const girarRef = useRef(girar);
  useEffect(() => {
    girarRef.current = girar;
  });
  useEffect(() => {
    const caja = envoltura.current;
    if (!caja || !hay) return;
    let acumulado = 0;
    let bloqueado = false;
    let silencio: ReturnType<typeof setTimeout> | undefined;
    const alRodar = (e: WheelEvent) => {
      const escala = e.deltaMode === 1 ? 16 : 1;
      let dx = e.deltaX * escala;
      let dy = e.deltaY * escala;
      // Shift + rueda de un ratón: la vertical hace de lateral.
      if (e.shiftKey && Math.abs(dx) < Math.abs(dy)) {
        dx = dy;
        dy = 0;
      }
      // La rueda vertical sigue siendo de la página.
      if (Math.abs(dx) <= Math.abs(dy)) return;
      e.preventDefault();
      clearTimeout(silencio);
      silencio = setTimeout(() => {
        acumulado = 0;
        bloqueado = false;
      }, RUEDA_SILENCIO_MS);
      if (bloqueado) return;
      acumulado += dx;
      if (Math.abs(acumulado) >= RUEDA_UMBRAL_PX) {
        girarRef.current(acumulado > 0 ? 1 : -1);
        bloqueado = true;
      }
    };
    caja.addEventListener("wheel", alRodar, { passive: false });
    return () => {
      caja.removeEventListener("wheel", alRodar);
      clearTimeout(silencio);
    };
  }, [hay]);

  function alTeclear(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "ArrowRight") girar(1);
    else if (e.key === "ArrowLeft") girar(-1);
  }

  function alSoltar(e: PointerEvent) {
    const x0 = arrastre.current;
    arrastre.current = null;
    if (x0 === null) return;
    const dx = e.clientX - x0;
    ultimo.current = { dx, t: performance.now() };
    if (Math.abs(dx) >= ARRASTRE_MIN_PX) girar(dx < 0 ? 1 : -1);
  }

  /**
   * Con el ratón, soltar un arrastre sobre el enlace de una tarjeta dispara su
   * `click` y navegaría: un arrastre que giró el carrusel no es un clic.
   */
  function alHacerClic(e: MouseEvent) {
    const { dx, t } = ultimo.current;
    if (Math.abs(dx) >= ARRASTRE_MIN_PX && performance.now() - t < 400) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function alEnfocar(e: React.FocusEvent) {
    const caja = envoltura.current;
    if (!caja || !hay) return;
    caja.scrollLeft = 0;
    const tarjeta = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-tarjeta]",
    );
    if (!tarjeta) return;
    const r = tarjeta.getBoundingClientRect();
    const c = caja.getBoundingClientRect();
    if (r.right > c.right + 1 || r.left < c.left - 1) {
      setI(Math.min(Number(tarjeta.dataset.tarjeta) - 1, max));
    }
  }

  const boton =
    "inline-flex size-11 items-center justify-center rounded-full border border-paper-3 bg-paper-0 text-ink-1 transition-colors duration-[120ms] hover:bg-paper-1 hover:text-ink-0 motion-reduce:transition-none";

  return (
    <div
      role={hay ? "group" : undefined}
      aria-roledescription={hay ? "carousel" : undefined}
      aria-label={hay ? etiquetas.etiqueta : undefined}
      data-carrusel-apps=""
      data-total={total}
      data-i={hay ? idx : undefined}
      data-max={hay ? max : undefined}
    >
      <div
        ref={envoltura}
        data-lejos={hay && idx > 0 ? "" : undefined}
        data-final={hay && idx === max ? "" : undefined}
        // El recorte va aquí y la pista se mueve dentro. El relleno vertical (con
        // margen negativo que lo devuelve) deja sitio a la sombra y al
        // levantamiento de la tarjeta; el horizontal sangra hasta el borde del
        // contenedor de la página para que los pedazos laterales midan lo
        // suficiente. Los velos funden esos pedazos con el fondo: el izquierdo
        // solo si hay algo detrás (`i > 0`); el derecho solo si hay algo delante
        // (no en el final). El borde limpio dice «aquí empieza / aquí acaba».
        // Son más angostos que el pedazo visible.
        className={
          hay
            ? "relative -mx-4 -my-3 overflow-hidden overscroll-x-contain px-4 py-3 md:-mx-6 md:px-6 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-6 before:bg-linear-to-r before:from-paper-0 before:to-transparent before:opacity-0 before:transition-opacity before:duration-[320ms] before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-6 after:bg-linear-to-l after:from-paper-0 after:to-transparent after:transition-opacity after:duration-[320ms] after:content-[''] data-[final]:after:opacity-0 data-[lejos]:before:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none sm:before:w-10 sm:after:w-10"
            : undefined
        }
      >
        <div
          ref={pista}
          // La pista se alcanza con el teclado: las flechas la giran.
          tabIndex={hay ? 0 : undefined}
          role={hay ? "group" : undefined}
          aria-label={hay ? etiquetas.etiqueta : undefined}
          data-pista=""
          onKeyDown={hay ? alTeclear : undefined}
          onPointerDown={
            hay ? (e) => (arrastre.current = e.clientX) : undefined
          }
          onPointerUp={hay ? alSoltar : undefined}
          onPointerCancel={hay ? () => (arrastre.current = null) : undefined}
          onFocusCapture={hay ? alEnfocar : undefined}
          onClickCapture={hay ? alHacerClic : undefined}
          // Un enlace arrastrado inicia el arrastre nativo y cancela el puntero:
          // sin esto el ratón no podría girar el carrusel sobre una tarjeta.
          onDragStart={hay ? (e) => e.preventDefault() : undefined}
          style={
            hay
              ? ({
                  "--paso": "calc(var(--tw) + var(--hu))",
                  "--o":
                    "calc((100% - var(--k) * var(--tw) - (var(--k) - 1) * var(--hu)) / 2)",
                  transform: tf(-idx, b),
                  // Nace apagada (servidor y primer render iguales con o sin
                  // «reducir movimiento»); `girar` la enciende.
                  transition: anima
                    ? `transform ${dur}ms var(${dur === BARRIDO_MS ? "--ease-in-out-cubic" : "--ease-out-cubic"})`
                    : "none",
                  touchAction: "pan-y",
                } as CSSProperties)
              : undefined
          }
          className={
            hay
              ? "relative flex gap-[var(--hu)] [--hu:0.75rem] [--k:1] [--tw:80%] sm:[--hu:1.25rem] sm:[--k:2] sm:[--tw:calc((100%-2.5rem)/2.2)]"
              : "flex"
          }
        >
          {tarjetas.map((tarjeta, n) => (
            <div
              key={n}
              data-tarjeta={n + 1}
              role={hay ? "group" : undefined}
              aria-roledescription={hay ? "slide" : undefined}
              aria-label={hay ? etiquetas.indicadores[n] : undefined}
              className={hay ? "w-[var(--tw)] shrink-0" : "w-full"}
            >
              {tarjeta}
            </div>
          ))}
        </div>
      </div>

      {hay && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label={etiquetas.anterior}
            onClick={() => girar(-1)}
            className={boton}
          >
            <span aria-hidden="true">←</span>
          </button>
          <p
            role="status"
            aria-live="polite"
            data-indicador=""
            className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase"
          >
            {etiquetas.indicadores[idx]}
          </p>
          <button
            type="button"
            aria-label={etiquetas.siguiente}
            onClick={() => girar(1)}
            className={boton}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
