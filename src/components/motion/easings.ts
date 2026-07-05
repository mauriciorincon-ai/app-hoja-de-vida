/**
 * Easings del motion system — espejo exacto de las variables CSS de
 * globals.css y de la referencia destilada (motion-vocabulary.md §8).
 */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;
export const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1] as const;
export const EASE_OUT_CUBIC = [0.21, 0.61, 0.35, 1] as const;
export const EASE_IN_OUT_CUBIC = [0.65, 0, 0.35, 1] as const;

/** Stagger entre hermanos de una entrada de sección (spec: 80ms). */
export const STAGGER_S = 0.08;
