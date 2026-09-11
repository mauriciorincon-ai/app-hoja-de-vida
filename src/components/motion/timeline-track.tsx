"use client";

import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { EASE_OUT_CUBIC } from "./easings";

/**
 * TimelineTrack — el índice que baja contigo (revisión post-S7).
 *
 * La versión anterior (receta 09) dibujaba un riel con `pathLength` y un nodo
 * por hito; el riel medía `calc(100% - 2rem)` y los nodos flotaban cada uno a
 * su altura — a ojo, círculos sin orden y una línea que no llegaba. Se
 * rehace con una idea distinta, la que pidió el dueño:
 *
 *  - **Una sola línea continua** de arriba abajo, que mide TODAS las
 *    experiencias. Encima, un relleno `lilac-ink` que crece con el scroll:
 *    cuánto llevas leído.
 *  - **Un solo círculo**, pegajoso a media pantalla (`sticky`): al hacer
 *    scroll, la línea pasa por él — visualmente, el círculo baja por la
 *    trayectoria contigo.
 *  - **El año grande** al lado del círculo: el de la experiencia que está a
 *    su altura. Cambia con un fundido corto (opacity + translate, nada más).
 *
 * Reduced motion: la línea completa y quieta (el relleno queda entero, lo
 * fija el cinturón CSS), el círculo sigue siendo `sticky` (es posición, no
 * animación) y el año cambia sin fundido. Nada parpadea, nada se mueve solo.
 * La FORMA del árbol es la misma con y sin reducción — `useReducedMotion()`
 * solo toca props; ramificar elementos con él desajusta la hidratación.
 *
 * Gate ATS: el `<ol>` con periodos, roles y bullets es HTML siempre; el año
 * grande es un duplicado decorativo (`aria-hidden`).
 */
export type TimelineItem = {
  periodo: string;
  rol: string;
  organizacion: string;
  descripcion: string;
  bullets?: string[];
  actual?: boolean;
  /** Ruta del case study de esta experiencia, si lo tiene. */
  hrefCaseStudy?: string;
};

export type TimelineLabels = {
  verMas: string;
  verMenos: string;
  verCaseStudy: string;
  indiceAria: string;
};

/** «2023 — 2025» → «2023»; «2025 — hoy» → «2025». Sin año, el texto tal cual. */
function anioDe(periodo: string): string {
  return /\d{4}/.exec(periodo)?.[0] ?? periodo;
}

/** Fracción de la ventana donde vive el círculo (y donde se mide el hito activo). */
const LINEA = 0.45;

function EnlaceCaseStudy({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      data-case-study
      className="flex min-h-11 items-center gap-1.5 text-sm font-medium text-sage-ink transition-colors duration-[120ms] hover:text-ink-0"
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function BulletsDisclosure({
  bullets,
  id,
  hito,
  labels,
  children,
}: {
  bullets: string[];
  id: string;
  hito: string;
  labels: TimelineLabels;
  /** Acciones vecinas del hito (p. ej. el enlace al case study): van en la
   *  misma fila que el botón; el panel de bullets abre DEBAJO de la fila. */
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    if (next) trackEvent("hito_expandido", { hito });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={toggle}
          className="flex min-h-11 items-center gap-1.5 text-sm font-medium text-sage-ink transition-colors duration-[120ms] hover:text-ink-0"
        >
          {expanded ? labels.verMenos : labels.verMas}
          <span
            aria-hidden="true"
            className={`text-[10px] transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>
        {children}
      </div>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ul
            id={id}
            aria-hidden={!expanded}
            className="flex flex-col gap-2 pt-2 pb-1"
          >
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-2.5 text-sm leading-relaxed text-ink-1"
              >
                <span
                  aria-hidden="true"
                  className="mt-[9px] size-1 shrink-0 rounded-full bg-sage-ink"
                />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function TimelineTrack({
  items,
  labels,
}: {
  items: TimelineItem[];
  labels: TimelineLabels;
}) {
  const reduced = useReducedMotion();
  const contenedor = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  const hitos = useRef<(HTMLLIElement | null)[]>([]);

  const [activo, setActivo] = useState(0);
  // Dónde empieza cada hito dentro de la lista: son las marcas del índice.
  const [marcas, setMarcas] = useState<number[]>([]);

  // 0 cuando el arranque de la trayectoria cruza la línea del círculo; 1
  // cuando la cruza el final. Es lo que mueve el relleno de la línea.
  const { scrollYProgress } = useScroll({
    target: contenedor,
    offset: [`start ${LINEA * 100}%`, `end ${LINEA * 100}%`],
  });

  const medirActivo = useCallback(() => {
    const linea = window.innerHeight * LINEA;
    let i = 0;
    hitos.current.forEach((li, idx) => {
      if (li && li.getBoundingClientRect().top <= linea + 8) i = idx;
    });
    setActivo((prev) => (prev === i ? prev : i));
  }, []);

  useMotionValueEvent(scrollYProgress, "change", medirActivo);

  // Las marcas se miden del layout real (las tarjetas varían de alto) y se
  // vuelven a medir si algo cambia de tamaño — abrir un disclosure, girar el
  // teléfono.
  useLayoutEffect(() => {
    const ol = lista.current;
    if (!ol) return;
    const medir = () => {
      setMarcas(hitos.current.map((li) => li?.offsetTop ?? 0));
      medirActivo();
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(ol);
    return () => ro.disconnect();
  }, [items.length, medirActivo]);

  useEffect(() => {
    window.addEventListener("resize", medirActivo);
    return () => window.removeEventListener("resize", medirActivo);
  }, [medirActivo]);

  const anio = anioDe(items[activo]?.periodo ?? "");

  return (
    <div
      ref={contenedor}
      data-timeline
      className="grid grid-cols-[88px_1fr] gap-x-4 md:grid-cols-[176px_1fr] md:gap-x-8"
    >
      {/* ── La columna del índice: línea, marcas y el círculo que baja ── */}
      <div aria-hidden="true" className="relative">
        {/* La línea entera, de la primera experiencia a la última. */}
        <div className="absolute top-0 bottom-0 left-[6px] w-0.5 bg-paper-3" />
        {/* Cuánto llevas leído. Existe SIEMPRE: con reducción de movimiento el
            cinturón CSS (`[data-motion]` → transform: none) lo deja completo y
            quieto. La estructura no puede depender de `reduced`, que en el
            servidor es null: ramificarla rompió la hidratación (React #418) para
            los usuarios con esa preferencia (2026-09-10). */}
        <m.div
          data-motion=""
          data-timeline-relleno
          className="absolute top-0 bottom-0 left-[6px] w-0.5 origin-top bg-lilac-ink"
          style={{ scaleY: scrollYProgress }}
        />
        {/* Una marca por experiencia, a la altura donde empieza su tarjeta. */}
        {marcas.map((y, i) => (
          <span
            key={i}
            data-timeline-marca={i}
            className={`absolute left-[3px] size-2 rounded-full border-2 ${
              i <= activo
                ? "border-lilac-ink bg-lilac-ink"
                : "border-paper-3 bg-paper-0"
            } transition-colors duration-300 motion-reduce:transition-none`}
            style={{ top: y + 6 }}
          />
        ))}

        {/* El círculo pegajoso y el año a su lado. */}
        <div
          data-timeline-indice
          className="sticky flex items-center gap-3 md:gap-4"
          style={{ top: `${LINEA * 100}vh` }}
        >
          <span className="relative z-10 block size-3.5 shrink-0 rounded-full bg-lilac-ink ring-4 ring-paper-0" />
          <m.span
            key={anio}
            data-motion=""
            data-timeline-anio={anio}
            className="font-display text-[1.5rem] leading-none font-medium tracking-[-0.03em] text-lilac-ink tabular-nums md:text-[2.75rem]"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_CUBIC }}
          >
            {anio}
          </m.span>
        </div>
      </div>

      {/* ── Las experiencias ── */}
      <ol ref={lista} className="relative flex flex-col gap-12">
        {items.map((item, i) => (
          <li
            key={`${item.periodo}-${item.rol}`}
            ref={(el) => {
              hitos.current[i] = el;
            }}
            data-hito={i}
            data-activo={i === activo ? "" : undefined}
            className="relative"
          >
            <article className="flex flex-col gap-2">
              <span
                className={`self-start rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase tabular-nums ${
                  item.actual
                    ? "bg-lilac text-lilac-ink"
                    : "bg-paper-2 text-ink-2"
                }`}
              >
                {item.periodo}
              </span>
              <h3 className="text-base leading-snug font-semibold text-ink-0">
                {item.rol}
              </h3>
              <p className="font-mono text-[13px] text-ink-2">
                {item.organizacion}
              </p>
              <p className="text-sm leading-relaxed text-ink-2">
                {item.descripcion}
              </p>
              {/* Las dos acciones del hito en UNA fila; el panel de logros
                  abre debajo de la fila, no entre las dos. */}
              {(item.bullets?.length ?? 0) > 0 ? (
                <BulletsDisclosure
                  bullets={item.bullets ?? []}
                  id={`hito-bullets-${i}`}
                  hito={item.organizacion}
                  labels={labels}
                >
                  {item.hrefCaseStudy && (
                    <EnlaceCaseStudy href={item.hrefCaseStudy} label={labels.verCaseStudy} />
                  )}
                </BulletsDisclosure>
              ) : (
                item.hrefCaseStudy && (
                  <EnlaceCaseStudy href={item.hrefCaseStudy} label={labels.verCaseStudy} />
                )
              )}
            </article>
          </li>
        ))}
      </ol>
      {/* El año a la vista, para quien no ve la columna. */}
      <p className="sr-only" aria-live="polite">
        {labels.indiceAria}: {anio}
      </p>
    </div>
  );
}
