"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
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
 * la primera y de la primera a la última, y ningún botón se apaga jamás. Para
 * que se note que hay más, cada vista deja asomar **un pedazo de la tarjeta
 * siguiente** (el 20 % de la tercera en escritorio, el 15 % en el teléfono) y
 * un velo del color de la página lo funde hacia la derecha: una tarjeta cortada
 * dice «sigue» sin decir una palabra.
 *
 * **Cómo gira sin clones.** Un scroll nativo tiene principio y fin, y un bucle
 * sobre él obliga a duplicar las tarjetas en el HTML (enlaces y nombres dos
 * veces: el gate ATS, el árbol de accesibilidad y los tests que cuentan
 * tarjetas se rompen). Aquí el DOM tiene EXACTAMENTE las N tarjetas, en el
 * orden del YAML, y el orden visual lo da `order` (CSS) a partir de `inicio`,
 * el índice de la que va primera. «Siguiente» desliza la pista un paso con
 * `transform` y, al terminar la transición, rota `inicio` y devuelve la pista a
 * cero sin transición: el reordenamiento deja la pista idéntica a como se veía,
 * así que no hay salto. «Anterior» rota primero y anima desde −paso hasta 0.
 *
 * Es el patrón APG de carrusel (grupo `carousel` con nombre, cada tarjeta un
 * `slide` con su «n de N» por su índice REAL, `status` educado, pista con foco)
 * con las mismas flechas y el mismo indicador de la galería de los tableros
 * —esa galería, que son pantallas de UNA pieza, conserva su mecánica con
 * extremos y no se toca—. Sin autoplay: nada se mueve solo. Con el dedo (arrastre
 * horizontal ≥ 40 px) y con las flechas del teclado también gira.
 *
 *  · **una sola tarjeta:** sin botones, sin velo, sin foco y sin roles;
 *  · si el foco cae en una tarjeta que quedó fuera de la vista (Tab), esa
 *    tarjeta pasa a primera: el navegador no puede desplazar un contenedor
 *    recortado y dejarlo descentrado.
 *
 * **Regla 5(a):** la FORMA del árbol jamás depende de `usePrefiereQuieto()`
 * (vale `null` en el servidor). El hook solo decide si el giro se anima. El
 * paso se mide al pulsar y solo decide una animación, nunca qué se pinta.
 * Los textos llegan por props (el namespace de next-intl no viaja al bundle
 * cliente). Sin JS las N tarjetas están en el HTML (gate ATS).
 */
export type EtiquetasCarruselMuestras = {
  /** Nombre accesible del carrusel, p. ej. «Apps profesionales». */
  etiqueta: string;
  anterior: string;
  siguiente: string;
  /** «1 de 3», «2 de 3»…: uno por tarjeta, ya traducido. */
  indicadores: string[];
};

/** El hueco entre tarjetas: `gap-5` = 1.25rem = 20 px. */
const HUECO_PX = 20;
/** Cuánto debe arrastrarse el dedo para que cuente como un giro. */
const ARRASTRE_MIN_PX = 40;
/** Si `transitionend` no llega (pestaña en segundo plano), el giro termina igual. */
const RESPALDO_MS = 600;

const mod = (n: number, total: number) => ((n % total) + total) % total;

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
  const [inicio, setInicio] = useState(0);
  const [mov, setMov] = useState({ x: 0, anima: false });
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
    // «Siguiente» rota AL TERMINAR (la pista volvió a 0 sin transición, y el
    // nuevo orden la deja idéntica); «anterior» ya rotó al empezar.
    if (sentido.current === 1) setInicio((i) => mod(i + 1, total));
    setMov({ x: 0, anima: false });
  }

  function girar(dir: 1 | -1) {
    if (!hay || animando.current) return;
    if (quieto) {
      setInicio((i) => mod(i + dir, total));
      return;
    }
    const primera = pista.current?.children[0] as HTMLElement | undefined;
    const paso = (primera?.offsetWidth ?? 0) + HUECO_PX;
    animando.current = true;
    sentido.current = dir;
    respaldo.current = setTimeout(terminar, RESPALDO_MS);
    if (dir === 1) {
      setMov({ x: -paso, anima: true });
    } else {
      // Rota primero y arranca un paso a la izquierda, sin animar; en dos
      // cuadros la pista se anima hasta 0 y la nueva primera entra por la izquierda.
      setInicio((i) => mod(i - 1, total));
      setMov({ x: -paso, anima: false });
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setMov({ x: 0, anima: true })),
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
      setInicio(Number(tarjeta.dataset.tarjeta) - 1);
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
    >
      <div
        ref={envoltura}
        // El recorte va aquí y la pista se mueve dentro. El relleno vertical (con
        // margen negativo que lo devuelve) deja sitio a la sombra y al
        // levantamiento de la tarjeta. El velo, a la derecha, funde el pedazo de
        // la siguiente tarjeta con el fondo; es más angosto que el asomo.
        className={
          hay
            ? "relative -my-3 overflow-hidden py-3 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-6 after:bg-linear-to-l after:from-paper-0 after:to-transparent after:content-[''] sm:after:w-16"
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
          onTransitionEnd={
            hay ? (e) => e.target === e.currentTarget && terminar() : undefined
          }
          style={
            hay
              ? {
                  transform: `translateX(${mov.x}px)`,
                  transition: mov.anima
                    ? "transform 320ms var(--ease-out-cubic)"
                    : "none",
                  touchAction: "pan-y",
                }
              : undefined
          }
          className="flex gap-5"
        >
          {tarjetas.map((tarjeta, i) => (
            <div
              key={i}
              data-tarjeta={i + 1}
              role={hay ? "group" : undefined}
              aria-roledescription={hay ? "slide" : undefined}
              aria-label={hay ? etiquetas.indicadores[i] : undefined}
              style={hay ? { order: mod(i - inicio, total) } : undefined}
              className={
                hay
                  ? "w-[85%] shrink-0 sm:w-[calc((100%-2.5rem)/2.2)]"
                  : "w-full"
              }
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
