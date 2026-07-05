"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { EASE_IN_OUT_CUBIC, EASE_OUT_CUBIC, EASE_OUT_EXPO } from "./easings";

/**
 * Primitivas de entrada de la referencia destilada (motion-vocabulary.md §1),
 * con sus números exactos. Regla dura: el contenido SIEMPRE está en el HTML;
 * con `prefers-reduced-motion` se renderiza directo en su estado final.
 */
export type RevealVariant =
  "fadeInUp" | "blurIn" | "scaleInBlur" | "maskReveal";

const variantsMap: Record<RevealVariant, Variants> = {
  // 0.7s ease-out-cubic, translateY(40px) → 0
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_OUT_CUBIC },
    },
  },
  // 0.9s ease-out-expo, blur(20px) + scale(1.05) → nítido (solo entradas
  // one-shot above-the-fold; jamás ligado al avance del scroll)
  blurIn: {
    hidden: { opacity: 0, filter: "blur(20px)", scale: 1.05 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 0.9, ease: EASE_OUT_EXPO },
    },
  },
  // cards: scale(0.85) + blur(15px) → 1
  scaleInBlur: {
    hidden: { opacity: 0, scale: 0.85, filter: "blur(15px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: EASE_OUT_EXPO },
    },
  },
  // texto que emerge de un contenedor overflow-hidden, 0.8s ease-in-out-cubic
  maskReveal: {
    hidden: { y: "110%" },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: EASE_IN_OUT_CUBIC },
    },
  },
};

function withDelay(variants: Variants, delay: number): Variants {
  if (!delay) return variants;
  const visible = variants.visible as {
    transition?: Record<string, unknown>;
  } & Record<string, unknown>;
  return {
    ...variants,
    visible: {
      ...visible,
      transition: { ...visible.transition, delay },
    },
  };
}

type RevealProps = {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  /** true = anima al montar (hero); false = anima al entrar al viewport */
  onMount?: boolean;
};

export function Reveal({
  children,
  variant = "fadeInUp",
  delay = 0,
  className,
  onMount = false,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const inner = (
    <m.div
      className={variant === "maskReveal" ? undefined : className}
      variants={withDelay(variantsMap[variant], delay)}
      initial="hidden"
      {...(onMount
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, amount: 0.25 } })}
    >
      {children}
    </m.div>
  );

  if (variant === "maskReveal") {
    return <div className={`overflow-hidden ${className ?? ""}`}>{inner}</div>;
  }
  return inner;
}
