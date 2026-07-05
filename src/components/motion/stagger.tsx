"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT_CUBIC, EASE_OUT_EXPO, STAGGER_S } from "./easings";

/**
 * Contenedor de entradas escalonadas (spec: stagger 80ms entre hermanos).
 * Los hijos se marcan con <StaggerItem>; heredan la orquestación del padre.
 */
export function Stagger({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: STAGGER_S, delayChildren: delay },
    },
  };

  // El m.div nunca se desmonta (ver Reveal): con reduce, sin props de animación.
  const animProps = reduced
    ? {}
    : {
        variants: container,
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: false, amount: 0.2 },
      };

  return (
    <m.div data-motion="" className={className} {...animProps}>
      {children}
    </m.div>
  );
}

const itemVariants: Record<"fadeInUp" | "scaleInBlur", Variants> = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_OUT_CUBIC },
    },
  },
  scaleInBlur: {
    hidden: { opacity: 0, scale: 0.85, filter: "blur(15px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: EASE_OUT_EXPO },
    },
  },
};

export function StaggerItem({
  children,
  className,
  variant = "fadeInUp",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "fadeInUp" | "scaleInBlur";
}) {
  const reduced = useReducedMotion();

  return (
    <m.div
      data-motion=""
      className={className}
      variants={reduced ? undefined : itemVariants[variant]}
    >
      {children}
    </m.div>
  );
}
