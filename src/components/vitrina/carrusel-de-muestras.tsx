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
 * una pista que **gira sin fin, en los dos sentidos**: de la última se pasa a
 * la primera y de la primera a la última, y ningún botón se apaga jamás.
 *
 * **Dos estados, para que se note dónde empieza** (decisión del dueño):
 *  · **en el inicio** (la primera tarjeta va primera): las dos primeras
 *    completas pegadas al borde izquierdo y un pedazo difuminado de la tercera
 *    a la derecha. Nada a la izquierda: el borde limpio es la señal de «aquí
 *    empieza»;
 *  · **lejos del inicio** (cualquier otra va primera): un pedazo difuminado a
 *    la izquierda, las completas CENTRADAS y otro pedazo a la derecha.
 * Al volver a la primera regresa el estado de inicio y el velo izquierdo se
 * desvanece.
 *
 * **Cómo gira sin clones en el HTML.** El DOM tiene EXACTAMENTE las N tarjetas,
 * en el orden del YAML, y el orden visual lo da `order` (CSS) a partir de
 * `inicio`. Con tres tarjetas, lejos del inicio hacen falta cuatro huecos
 * (pedazo · completa · completa · pedazo): la tarjeta que no está en el centro
 * asoma a los dos lados, y una de las dos veces es una COPIA decorativa
 * (`aria-hidden` + `inert`, absoluta, fuera del flujo). Las copias existen solo
 * mientras se está lejos del inicio o girando —el HTML del servidor y el primer
 * render del cliente no las tienen—, así que los enlaces, el chat, el ATS y los
 * tests que cuentan tarjetas siguen viendo N.
 *
 * **Geometría 100 % CSS**: ancho de tarjeta `--tw`, hueco `--hu`, completas por
 * vista `--k`, paso `--paso = --tw + --hu` y margen `--o` que centra las
 * completas. La pista se coloca con `translateX(calc(A·paso + B·o))`, con A y B
 * enteros del estado: nada se mide en JS y un cambio de tamaño no deja el
 * carrusel descentrado. «Siguiente» anima a `(−1, B del destino)` y, al terminar
 * la transición, rota `inicio` y deja la pista en reposo sin transición: el
 * reordenamiento (y el cambio de copias) deja la pista idéntica a como se veía,
 * así que no hay salto. «Anterior» rota primero y anima desde `(−1, B actual)`.
 *
 * Es el patrón APG de carrusel (grupo `carousel` con nombre, cada tarjeta un
 * `slide` con su «n de N» por su índice REAL, `status` educado, pista con foco)
 * con las mismas flechas y el mismo indicador de la galería de los tableros
 * —esa galería, que son pantallas de UNA pieza, conserva su mecánica con
 * extremos y no se toca—. Sin autoplay: nada se mueve solo. Con el dedo (arrastre
 * horizontal ≥ 40 px) y con las flechas del teclado también gira.
 *
 *  · **una sola tarjeta:** sin botones, sin velos, sin foco y sin roles;
 *  · si el foco cae en una tarjeta que quedó fuera de la vista (Tab), esa
 *    tarjeta pasa a primera: el navegador no puede desplazar un contenedor
 *    recortado y dejarlo descentrado.
 *
 * **Regla 5(a):** la FORMA del árbol jamás depende de `usePrefiereQuieto()`
 * (vale `null` en el servidor). El hook solo decide si el giro se anima. Las
 * copias dependen del estado de interacción, nunca del hook. Los textos llegan
 * por props (el namespace de next-intl no viaja al bundle cliente). Sin JS las
 * N tarjetas están en el HTML (gate ATS).
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
/** Si `transitionend` no llega (pestaña en segundo plano), el giro termina igual. */
const RESPALDO_MS = 600;

const mod = (n: number, total: number) => ((n % total) + total) % total;

/** Posición de la pista: `a` pasos y `b` márgenes de centrado (ver cabecera). */
type Mov = { a: number; b: number; anima: boolean };
const tf = (a: number, b: number) =>
  `translateX(calc(${a} * var(--paso) + ${b} * var(--o)))`;
/** En el inicio la pista va pegada a la izquierda; lejos, centrada. */
const reposoB = (i: number) => (i === 0 ? 0 : 1);

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
  const [inicio, setInicio] = useState(0);
  const [mov, setMov] = useState<Mov | null>(null);
  // El DESTINO está lejos del inicio: enciende el velo izquierdo desde que arranca el giro.
  const [lejos, setLejos] = useState(false);
  const animando = useRef(false);
  const sentido = useRef<1 | -1>(1);
  const respaldo = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const arrastre = useRef<number | null>(null);
  const ultimo = useRef({ dx: 0, t: -Infinity });
  const quieto = usePrefiereQuieto();

  useEffect(() => () => clearTimeout(respaldo.current), []);

  function terminar() {
    if (!animando.current) return;
    animando.current = false;
    clearTimeout(respaldo.current);
    // «Siguiente» rota AL TERMINAR (la pista vuelve a su reposo sin transición,
    // y el nuevo orden la deja idéntica); «anterior» ya rotó al empezar.
    if (sentido.current === 1) setInicio((i) => mod(i + 1, total));
    setMov(null);
  }

  function girar(dir: 1 | -1) {
    if (!hay || animando.current) return;
    const destino = mod(inicio + dir, total);
    setLejos(destino !== 0);
    if (quieto) {
      setInicio(destino);
      return;
    }
    animando.current = true;
    sentido.current = dir;
    respaldo.current = setTimeout(terminar, RESPALDO_MS);
    if (dir === 1) {
      setMov({ a: -1, b: reposoB(destino), anima: true });
    } else {
      // Rota primero y arranca un paso a la izquierda, sin animar; en dos
      // cuadros la pista se anima hasta su reposo y la nueva primera entra
      // por la izquierda.
      setInicio(destino);
      setMov({ a: -1, b: reposoB(inicio), anima: false });
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (animando.current)
            setMov({ a: 0, b: reposoB(destino), anima: true });
        }),
      );
    }
  }

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
      const i = Number(tarjeta.dataset.tarjeta) - 1;
      setInicio(i);
      setLejos(i !== 0);
    }
  }

  const boton =
    "inline-flex size-11 items-center justify-center rounded-full border border-paper-3 bg-paper-0 text-ink-1 transition-colors duration-[120ms] hover:bg-paper-1 hover:text-ink-0 motion-reduce:transition-none";

  const conClones = hay && (inicio !== 0 || mov !== null);
  const reposo = tf(0, reposoB(inicio));

  return (
    <div
      role={hay ? "group" : undefined}
      aria-roledescription={hay ? "carousel" : undefined}
      aria-label={hay ? etiquetas.etiqueta : undefined}
      data-carrusel-apps=""
      data-total={total}
    >
      <div
        ref={envoltura}
        data-lejos={hay && lejos ? "" : undefined}
        // El recorte va aquí y la pista se mueve dentro. El relleno vertical (con
        // margen negativo que lo devuelve) deja sitio a la sombra y al
        // levantamiento de la tarjeta; el horizontal sangra hasta el borde del
        // contenedor de la página para que los pedazos laterales midan lo
        // suficiente. Los velos funden esos pedazos con el fondo: el derecho
        // siempre; el izquierdo solo lejos del inicio (en el inicio el borde
        // limpio dice «aquí empieza»). Son más angostos que el pedazo visible.
        className={
          hay
            ? "relative -mx-4 -my-3 overflow-hidden px-4 py-3 md:-mx-6 md:px-6 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-6 before:bg-linear-to-r before:from-paper-0 before:to-transparent before:opacity-0 before:transition-opacity before:duration-[320ms] before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-6 after:bg-linear-to-l after:from-paper-0 after:to-transparent after:content-[''] data-[lejos]:before:opacity-100 motion-reduce:before:transition-none sm:before:w-10 sm:after:w-10"
            : undefined
        }
      >
        <div
          // La pista se alcanza con el teclado: las flechas la giran.
          tabIndex={hay ? 0 : undefined}
          role={hay ? "group" : undefined}
          aria-label={hay ? etiquetas.etiqueta : undefined}
          data-pista=""
          data-moviendo={hay && mov ? "" : undefined}
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
          onTransitionEnd={
            hay
              ? (e) =>
                  e.target === e.currentTarget &&
                  e.propertyName === "transform" &&
                  terminar()
              : undefined
          }
          style={
            hay
              ? ({
                  "--paso": "calc(var(--tw) + var(--hu))",
                  "--o":
                    "calc((100% - var(--k) * var(--tw) - (var(--k) - 1) * var(--hu)) / 2)",
                  transform: mov ? tf(mov.a, mov.b) : reposo,
                  transition: mov?.anima
                    ? "transform 320ms var(--ease-out-cubic)"
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
          {tarjetas.map((tarjeta, i) => (
            <div
              key={i}
              data-tarjeta={i + 1}
              role={hay ? "group" : undefined}
              aria-roledescription={hay ? "slide" : undefined}
              aria-label={hay ? etiquetas.indicadores[i] : undefined}
              style={hay ? { order: mod(i - inicio, total) } : undefined}
              className={hay ? "w-[var(--tw)] shrink-0" : "w-full"}
            >
              {tarjeta}
            </div>
          ))}
          {conClones &&
            [-1, total].map((hueco) => (
              // Copia DECORATIVA de la tarjeta que cae en este hueco: fuera del
              // árbol de accesibilidad, del tabulador y del puntero.
              <div
                key={hueco}
                data-clon={hueco < 0 ? "izquierda" : "derecha"}
                aria-hidden="true"
                inert
                style={{ left: `calc(${hueco} * var(--paso))` }}
                className="pointer-events-none absolute inset-y-0 w-[var(--tw)]"
              >
                {tarjetas[mod(inicio + hueco, total)]}
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
            {etiquetas.indicadores[inicio]}
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
