"use client";

import { domAnimation, LazyMotion } from "motion/react";

/**
 * Carga perezosa del subconjunto domAnimation de Motion (ADR-002): los
 * componentes usan `m.*` en modo strict para mantener el bundle mínimo.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
