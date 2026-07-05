"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { useSyncExternalStore } from "react";
import { EASE_OUT_BACK, EASE_OUT_CUBIC, EASE_OUT_EXPO } from "./easings";

/**
 * TimelineTrack (receta 09, variante V1 — cards bajo el rail):
 * - Rail SVG dibujado con pathLength (equivale a stroke-dashoffset),
 *   1.4s ease-out-expo, delay 0.5s.
 * - Nodos scale(0)→1 con ease-out-back, sincronizados al avance del trazo:
 *   delay ≈ 800ms + (posición-x%) × 1400ms.
 * - Cards fadeInUp +32px tras completarse el rail (2.2s+), stagger 140ms.
 * En móvil el rail/nodos se ocultan (decorativos) y las cards entran en
 * stagger corto. El contenido es un <ol> semántico siempre presente en HTML.
 */
export type TimelineItem = {
  periodo: string;
  rol: string;
  organizacion: string;
  descripcion: string;
  actual?: boolean;
};

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeToDesktop(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

export function TimelineTrack({ items }: { items: TimelineItem[] }) {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const n = items.length;

  const railVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { delay: 0.5, duration: 1.4, ease: EASE_OUT_EXPO },
    },
  };

  const nodeVariants: Variants = {
    hidden: { scale: 0 },
    visible: (i: number) => ({
      scale: 1,
      transition: {
        delay: 0.8 + (i / Math.max(n - 1, 1)) * 1.4,
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
        delay: isDesktop ? 2.2 + i * 0.14 : i * 0.08,
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
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <m.div className="relative" {...animProps}>
      {/* Rail decorativo — solo desktop */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-[6px] left-0 hidden h-0.5 w-full overflow-visible md:block"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-paper-3)" />
            <stop offset="50%" stopColor="var(--color-lilac-ink)" />
            <stop offset="100%" stopColor="var(--color-paper-3)" />
          </linearGradient>
        </defs>
        <m.line
          data-motion-svg=""
          x1={50 / n}
          y1="1"
          x2={100 - 50 / n}
          y2="1"
          stroke="url(#rail-grad)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          variants={reduced ? undefined : railVariants}
        />
      </svg>

      <ol
        className="grid gap-10 md:gap-6 md:grid-cols-[repeat(var(--timeline-cols),minmax(0,1fr))]"
        style={{ "--timeline-cols": n } as React.CSSProperties}
      >
        {items.map((item, i) => (
          <li key={`${item.periodo}-${item.rol}`} className="md:px-2">
            <m.span
              data-motion=""
              aria-hidden="true"
              className={`mx-auto mb-6 hidden size-3.5 rounded-full md:block ${
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
