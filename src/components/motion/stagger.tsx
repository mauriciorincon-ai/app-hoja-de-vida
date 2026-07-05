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

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: STAGGER_S, delayChildren: delay },
    },
  };

  return (
    <m.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
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

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div className={className} variants={itemVariants[variant]}>
      {children}
    </m.div>
  );
}
