"use client";

import { m, useReducedMotion } from "motion/react";
import { EASE_OUT_BACK } from "./easings";

/**
 * Una cifra que «llama la atención» al asomar (revisión post-S8): crece a
 * 1,14× y vuelve a su tamaño, una vez por entrada, con un pequeño retraso
 * para que ocurra cuando la caja ya aterrizó. Solo `transform`; con reduced
 * motion no hay props de animación y el cinturón CSS de `[data-motion]`
 * neutraliza cualquier estado inicial — la forma del árbol es la misma.
 */
export function CifraQueLlama({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const animProps = reduced
    ? {}
    : {
        initial: { scale: 1 },
        whileInView: { scale: [1, 1.14, 1] },
        viewport: { once: false, amount: "all" as const },
        transition: { duration: 0.9, ease: EASE_OUT_BACK, delay: 0.55 },
      };
  return (
    <m.span data-motion="" className={className} {...animProps}>
      {children}
    </m.span>
  );
}
