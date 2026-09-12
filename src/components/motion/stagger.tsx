"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT_CUBIC, EASE_OUT_EXPO, STAGGER_S } from "./easings";

/**
 * Contenedor de entradas escalonadas (spec: stagger 80ms entre hermanos).
 * Los hijos se marcan con <StaggerItem>; heredan la orquestación del padre.
 *
 * Revisión post-S8 (2026-09-12): el escalón y la etiqueta son parámetros.
 * `stagger` porque Estudios y Certificaciones piden una entrada «leve, más
 * marcada y lenta» (140 ms) y Skills una más rápida (120 ms) que la de 80 ms;
 * `as` porque la vitrina asomada escalona sus cajas dentro de un `<ul>`, y un
 * `<div>` entre `<ul>` y `<li>` es HTML inválido.
 */
type Etiqueta = "div" | "ul" | "li";

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = STAGGER_S,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Segundos entre hermanos (default: los 80 ms del sistema). */
  stagger?: number;
  as?: Etiqueta;
}) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  // El m.* nunca se desmonta (ver Reveal): con reduce, sin props de animación.
  const animProps = reduced
    ? {}
    : {
        variants: container,
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: false, amount: 0.2 },
      };

  const Tag = as === "ul" ? m.ul : as === "li" ? m.li : m.div;
  return (
    <Tag data-motion="" className={className} {...animProps}>
      {children}
    </Tag>
  );
}

export type StaggerVariant =
  "fadeInUp" | "scaleInBlur" | "fadeInSlow" | "liftIn";

const itemVariants: Record<StaggerVariant, Variants> = {
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
  // Post-S8 — «aparición leve, más marcada y lenta» (Estudios, Certificaciones,
  // cajas de la vitrina): 1,2 s ease-out-expo, sube 28 px y desenfoca 8 px.
  fadeInSlow: {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: EASE_OUT_EXPO },
    },
  },
  // Post-S8 — la tarjeta de Skills «aterriza»: sube 48 px con una inclinación
  // de 8° en perspectiva, escala 0,96 → 1 y desenfoque 12 px → 0, en 1 s
  // ease-out-expo. Solo transform/opacity/filter; nada ligado al scroll.
  liftIn: {
    hidden: {
      opacity: 0,
      y: 48,
      scale: 0.96,
      rotateX: 8,
      filter: "blur(12px)",
      transformPerspective: 900,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transformPerspective: 900,
      transition: { duration: 1.0, ease: EASE_OUT_EXPO },
    },
  },
};

export function StaggerItem({
  children,
  className,
  variant = "fadeInUp",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: StaggerVariant;
  as?: Etiqueta;
}) {
  const reduced = useReducedMotion();
  const Tag = as === "ul" ? m.ul : as === "li" ? m.li : m.div;

  return (
    <Tag
      data-motion=""
      className={className}
      variants={reduced ? undefined : itemVariants[variant]}
    >
      {children}
    </Tag>
  );
}
