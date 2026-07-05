"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
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
  actual?: boolean;
};

export function TimelineTrack({ items }: { items: TimelineItem[] }) {
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
            </m.article>
          </li>
        ))}
      </ol>
    </m.div>
  );
}
