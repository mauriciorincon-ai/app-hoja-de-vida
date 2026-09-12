"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT_EXPO } from "./easings";

/**
 * Un chip que APARECE GRANDE Y SE ENCOGE a su tamaño al mismo tiempo que
 * aparece su tarjeta (revisión post-S8). Empieza a 1,5× y baja a 1× con la
 * MISMA duración y la MISMA curva que la entrada de la tarjeta (`fadeInSlow`:
 * 1,2 s, ease-out-expo), y arranca con ella —el escalón de la caja llega en
 * `retraso`—: un solo movimiento, no dos. Es EL CONTENEDOR el que se encoge
 * (fondo, borde, texto), desde su borde derecho para no salirse.
 *
 * NO tiene disparador propio: hereda la variante `visible` de la tarjeta que
 * lo contiene (`StaggerItem`). Como esa entrada se re-ejecuta cada vez que la
 * sección vuelve a pantalla (`once: false`), esto también. El escalón del
 * `Stagger` NO se hereda a los nietos —se midió: los cuatro chips arrancaban
 * a la vez—, por eso el retraso de cada caja viaja como prop.
 *
 * Solo `transform`; con reduced motion no hay variantes y el cinturón CSS de
 * `[data-motion]` neutraliza cualquier estado inicial — mismo árbol.
 */
export const DURACION_PULSO_S = 1.2;
export const ESCALA_INICIAL = 1.5;

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
    hidden: { scale: ESCALA_INICIAL },
    visible: {
      scale: 1,
      transition: {
        delay: retraso,
        duration: DURACION_PULSO_S,
        ease: EASE_OUT_EXPO,
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
