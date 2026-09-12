"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { EASE_IN_OUT_CUBIC } from "./easings";

/**
 * Un chip que «llama la atención» AL MISMO TIEMPO que aparece su tarjeta
 * (revisión post-S8). Crece a 1,3× y vuelve en una curva simétrica de la
 * MISMA duración que la entrada de la tarjeta (`fadeInSlow`, 1,2 s): arranca
 * cuando ella arranca —con el mismo escalón, que llega en `retraso`— y termina
 * de volver cuando ella termina de aparecer. Es EL CONTENEDOR el que crece
 * (fondo, borde, texto), desde su borde derecho para no salirse.
 *
 * NO tiene disparador propio: hereda la variante `visible` de la tarjeta que
 * lo contiene (`StaggerItem`). Como esa entrada se re-ejecuta cada vez que la
 * sección vuelve a pantalla (`once: false`), el pulso también. El escalón del
 * `Stagger` NO se hereda a los nietos —se midió: los cuatro chips arrancaban
 * a la vez—, por eso el retraso de cada caja viaja como prop.
 *
 * Solo `transform`; con reduced motion no hay variantes y el cinturón CSS de
 * `[data-motion]` neutraliza cualquier estado inicial — mismo árbol.
 */
export const DURACION_PULSO_S = 1.2;

export function CifraQueLlama({
  children,
  className,
  title,
  retraso = 0,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  /** Segundos de espera antes del pulso: el escalón de la tarjeta que lo contiene. */
  retraso?: number;
}) {
  const reduced = useReducedMotion();
  const pulso: Variants = {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 1.3, 1],
      transition: {
        delay: retraso,
        duration: DURACION_PULSO_S,
        times: [0, 0.5, 1],
        ease: EASE_IN_OUT_CUBIC,
      },
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
      variants={reduced ? undefined : pulso}
    >
      {children}
    </m.span>
  );
}
