"use client";

import { LazyMotion } from "motion/react";

/**
 * Features de Motion en chunk diferido (ADR-002): el bundle inicial no carga
 * domAnimation — la hidratación llega antes (budget TTI) y los reveals
 * below-the-fold animan apenas el chunk aterriza. Los `m.*` van en strict.
 */
const loadFeatures = () =>
  import("./motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
