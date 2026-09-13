"use client";

import {
  m,
  useReducedMotion,
  type TargetAndTransition,
  type Variants,
} from "motion/react";
import {
  EASE_IN_OUT_CUBIC,
  EASE_OUT_CUBIC,
  EASE_OUT_EXPO,
  STAGGER_S,
} from "./easings";

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
  // Post-S8 — la tarjeta de Skills «aterriza»: sube 70 px con una inclinación
  // de 14° en perspectiva, escala 0,94 → 1 y desenfoque 12 px → 0, en 1,4 s
  // ease-in-out. Segunda vuelta del dueño («no lo veo»): la versión de 1 s
  // con ease-out-expo resolvía el 87 % del recorrido en 300 ms y el ojo leía
  // «apareció», no «aterrizó». El in-out arranca lento y deja ver el viaje.
  // Solo transform/opacity/filter; nada ligado al scroll.
  liftIn: {
    hidden: {
      opacity: 0,
      y: 70,
      scale: 0.94,
      rotateX: 14,
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
      transition: { duration: 1.4, ease: EASE_IN_OUT_CUBIC },
    },
  },
};

/**
 * Un ítem que ORQUESTA a los ítems que contiene (post-S8, Skills). Hallazgo
 * medido con Playwright en cinco experimentos (bitácora post-S8, fila 19):
 * dentro de un árbol de variantes que se propaga desde un `whileInView`, un
 * ítem con `transition.delay` PROPIO se congela al nacer (a 0,72 de opacidad
 * el uno, a 0,87 el otro, para siempre; con el driver JS ni arranca), y un
 * `Stagger` anidado con su propio disparador corre la misma suerte. Lo que sí
 * llega a los nietos es el escalón que el padre REENVÍA: `delayChildren` y
 * `staggerChildren` en la transición del ítem padre, que motion propaga por
 * contexto aunque haya `<div>` planos en medio. Las variantes se memorizan
 * por clave para que su identidad sea estable entre renders.
 */
const memoVariantes = new Map<string, Variants>();
function conOrquesta(
  variant: StaggerVariant,
  hijos?: { delay: number; escalon: number },
): Variants {
  const v = itemVariants[variant];
  if (!hijos) return v;
  const clave = `${variant}:${hijos.delay}:${hijos.escalon}`;
  let out = memoVariantes.get(clave);
  if (!out) {
    const visible = v.visible as TargetAndTransition;
    out = {
      hidden: v.hidden,
      visible: {
        ...visible,
        transition: {
          ...visible.transition,
          delayChildren: hijos.delay,
          staggerChildren: hijos.escalon,
        },
      },
    };
    memoVariantes.set(clave, out);
  }
  return out;
}

export function StaggerItem({
  children,
  className,
  variant = "fadeInUp",
  as = "div",
  hijos,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: StaggerVariant;
  as?: Etiqueta;
  /**
   * Orquestación de los ítems que este ítem contiene (post-S8, Skills): sus
   * hijos con variantes arrancan `delay` segundos después que él y con
   * `escalon` segundos entre ellos — aunque haya `<div>` planos en medio.
   */
  hijos?: { delay: number; escalon: number };
}) {
  const reduced = useReducedMotion();
  const Tag = as === "ul" ? m.ul : as === "li" ? m.li : m.div;

  return (
    <Tag
      data-motion=""
      className={className}
      variants={reduced ? undefined : conOrquesta(variant, hijos)}
    >
      {children}
    </Tag>
  );
}
