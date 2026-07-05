"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * numberCountUp de la referencia destilada (receta 02): ~1800ms con
 * ease-out-cubic manual sobre rAF, cifras tabular-nums.
 *
 * Gate ATS/SEO: el HTML estático (SSR) contiene el valor FINAL; el conteo
 * desde 0 solo ocurre en el cliente cuando el elemento entra al viewport.
 * Con `prefers-reduced-motion` el valor final queda fijo.
 */
type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  locale?: string;
  className?: string;
};

export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  durationMs = 1800,
  locale,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  // El estado inicial ES el valor final: así el HTML estático lleva la cifra
  // real y, con reduced-motion, nunca hay movimiento. El conteo re-arranca
  // desde 0 dentro del rAF cuando el elemento entra al viewport.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduced) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, durationMs]);

  const formatted = display.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
