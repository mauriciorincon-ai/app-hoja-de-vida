"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { EASE_OUT_BACK, EASE_OUT_CUBIC, EASE_OUT_EXPO } from "./easings";

/**
 * TimelineTrack (receta 09, variante vertical):
 * - Rail SVG vertical dibujado con pathLength (equivale a stroke-dashoffset),
 *   1.4s ease-out-expo, delay 0.3s.
 * - Nodos scale(0)→1 con ease-out-back, sincronizados al avance del trazo:
 *   delay ≈ 300ms + (posición-y%) × 1400ms (aprox.: las cards varían de alto).
 * - Cards fadeInUp +32px SOLAPADAS con el trazo (feedback del gate de diseño:
 *   la sección nunca se ve vacía), stagger 100ms.
 * Vertical en TODOS los tamaños: con el contenido real (9 hitos) el layout
 * horizontal por columnas era ilegible. El contenido es un <ol> semántico
 * siempre presente en HTML.
 */
export type TimelineItem = {
  periodo: string;
  rol: string;
  organizacion: string;
  descripcion: string;
  bullets?: string[];
  actual?: boolean;
};

export type TimelineLabels = {
  verMas: string;
  verMenos: string;
};

/**
 * Disclosure inline (capa de profundidad, S2): los bullets viven SIEMPRE en
 * el HTML (gate ATS) y se colapsan solo visualmente (grid 0fr→1fr). Patrón
 * disclosure accesible: <button aria-expanded aria-controls> + región con
 * aria-hidden cuando está colapsada (no contiene focusables).
 */
function BulletsDisclosure({
  bullets,
  id,
  hito,
  labels,
}: {
  bullets: string[];
  id: string;
  hito: string;
  labels: TimelineLabels;
}) {
  const [expanded, setExpanded] = useState(false);

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    if (next) trackEvent("hito_expandido", { hito });
  }

  return (
    <>
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
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={toggle}
        className="flex min-h-11 items-center gap-1.5 self-start text-sm font-medium text-sage-ink transition-colors duration-[120ms] hover:text-ink-0"
      >
        {expanded ? labels.verMenos : labels.verMas}
        <span
          aria-hidden="true"
          className={`text-[10px] transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
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
  const n = items.length;

  const railVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { delay: 0.3, duration: 1.4, ease: EASE_OUT_EXPO },
    },
  };

  const nodeVariants: Variants = {
    hidden: { scale: 0 },
    visible: (i: number) => ({
      scale: 1,
      transition: {
        // sincronizado al avance del trazo: railStart + y% × railDuration
        delay: 0.3 + (i / Math.max(n - 1, 1)) * 1.4,
        duration: 0.5,
        ease: EASE_OUT_BACK,
      },
    }),
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15 + i * 0.1,
        duration: 0.7,
        ease: EASE_OUT_CUBIC,
      },
    }),
  };

  const animProps = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: false, amount: 0.15 },
      };

  return (
    <m.div className="relative max-w-2xl" {...animProps}>
      {/* Rail decorativo vertical, alineado con los nodos (centro x = 7px) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-2 left-[6px] h-[calc(100%-2rem)] w-0.5 overflow-visible"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* userSpaceOnUse: con objectBoundingBox una línea vertical tiene
              bbox de ancho 0 y el gradiente no se renderiza */}
          <linearGradient
            id="rail-grad"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="100"
          >
            <stop offset="0%" stopColor="var(--color-lilac-ink)" />
            <stop offset="100%" stopColor="var(--color-paper-3)" />
          </linearGradient>
        </defs>
        <m.line
          data-motion-svg=""
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="url(#rail-grad)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          variants={reduced ? undefined : railVariants}
        />
      </svg>

      <ol className="flex flex-col gap-10">
        {items.map((item, i) => (
          <li key={`${item.periodo}-${item.rol}`} className="relative pl-10">
            <m.span
              data-motion=""
              aria-hidden="true"
              className={`absolute top-0.5 left-0 size-3.5 rounded-full ${
                item.actual
                  ? "bg-lilac-ink"
                  : "border-2 border-lilac-ink bg-paper-0"
              }`}
              custom={i}
              variants={reduced ? undefined : nodeVariants}
            />
            <m.article
              data-motion=""
              custom={i}
              variants={reduced ? undefined : cardVariants}
              className="flex flex-col gap-2"
            >
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
              {(item.bullets?.length ?? 0) > 0 && (
                <BulletsDisclosure
                  bullets={item.bullets ?? []}
                  id={`hito-bullets-${i}`}
                  hito={item.organizacion}
                  labels={labels}
                />
              )}
            </m.article>
          </li>
        ))}
      </ol>
    </m.div>
  );
}
