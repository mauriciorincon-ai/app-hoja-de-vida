"use client";

import { m, useReducedMotion } from "motion/react";
import { EASE_IN_OUT_CUBIC, EASE_OUT_CUBIC } from "./easings";

/**
 * Un chip que «llama la atención» al asomar (revisión post-S8). Es EL
 * CONTENEDOR el que crece —fondo, borde, texto, todo junto— a 1,08× y vuelve
 * a su tamaño en una sola curva limpia: sube con ease-out-cubic (0,28 s) y se
 * asienta con ease-in-out-cubic (0,42 s). Sin rebote ni overshoot: el
 * primer intento escalaba solo el texto con ease-out-back y el dueño lo
 * llamó «torpe y de mal gusto» — tenía razón. Solo `transform`; con reduced
 * motion no hay props de animación y el cinturón CSS de `[data-motion]`
 * neutraliza cualquier estado inicial — la forma del árbol es la misma.
 */
export function CifraQueLlama({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const reduced = useReducedMotion();
  const animProps = reduced
    ? {}
    : {
        initial: { scale: 1 },
        whileInView: { scale: [1, 1.08, 1] },
        viewport: { once: false, amount: "all" as const },
        transition: {
          duration: 0.7,
          times: [0, 0.4, 1],
          ease: [EASE_OUT_CUBIC, EASE_IN_OUT_CUBIC],
          delay: 0.55,
        },
      };
  return (
    <m.span
      data-motion=""
      title={title}
      className={className}
      style={{ transformOrigin: "center" }}
      {...animProps}
    >
      {children}
    </m.span>
  );
}
