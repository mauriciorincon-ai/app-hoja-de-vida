"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { EASE_IN_OUT_CUBIC } from "./easings";

/**
 * Un chip que «llama la atención» cuando su tarjeta termina de aparecer
 * (revisión post-S8). Crece a 1,3× y vuelve, con una curva simétrica y corta
 * (ease-in-out-cubic, 0,7 s). Es EL CONTENEDOR el que crece (fondo, borde,
 * texto), desde su borde derecho para no salirse.
 *
 * NO tiene disparador propio: hereda la variante `visible` de la tarjeta que
 * lo contiene (`StaggerItem`) y espera a que su entrada (`fadeInSlow`, 1,2 s)
 * haya terminado. Como esa entrada se re-ejecuta cada vez que la sección
 * vuelve a pantalla (decisión del gate de diseño de S1, `once: false`), el
 * pulso también — el dueño lo quiso así: «cada vez que pase por ahí, como
 * las otras animaciones». Solo `transform`; con reduced motion no hay
 * variantes y el cinturón CSS de `[data-motion]` neutraliza cualquier estado
 * inicial — la forma del árbol es la misma.
 */
const PULSO: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.3, 1],
    transition: {
      delay: 1.15,
      duration: 0.7,
      times: [0, 0.5, 1],
      ease: EASE_IN_OUT_CUBIC,
    },
  },
};

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
      variants={reduced ? undefined : PULSO}
    >
      {children}
    </m.span>
  );
}
