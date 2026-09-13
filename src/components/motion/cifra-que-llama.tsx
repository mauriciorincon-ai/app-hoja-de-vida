"use client";

import { m, useReducedMotion } from "motion/react";
import { EASE_IN_OUT_CUBIC } from "./easings";

/**
 * Un chip que «llama la atención» al aparecer (revisión post-S8), tal como lo
 * pidió el dueño a la tercera: **apenas aparece en pantalla crece al doble,
 * UNA sola vez, y vuelve a su tamaño**. Una curva simétrica ease-in-out-cubic
 * (0,9 s) — sobria, sin rebote, sin repetirse al volver a entrar. Crece desde
 * su borde derecho para no salirse de la caja. Es EL CONTENEDOR el que crece
 * (fondo, borde, texto), no el texto. Solo `transform`; con reduced motion no
 * hay props de animación y el cinturón CSS de `[data-motion]` neutraliza
 * cualquier estado inicial — la forma del árbol es la misma.
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
        whileInView: { scale: [1, 2, 1] },
        viewport: { once: true, amount: "some" as const },
        transition: {
          duration: 0.9,
          times: [0, 0.5, 1],
          ease: EASE_IN_OUT_CUBIC,
          delay: 0.2,
        },
      };
  return (
    <m.span
      data-motion=""
      title={title}
      className={className}
      style={{
        transformOrigin: "right center",
        position: "relative",
        zIndex: 1,
      }}
      {...animProps}
    >
      {children}
    </m.span>
  );
}
