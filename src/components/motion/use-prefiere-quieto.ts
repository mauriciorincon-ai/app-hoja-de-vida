import { useSyncExternalStore } from "react";

const CONSULTA = "(prefers-reduced-motion: reduce)";

const suscribir = (avisar: () => void) => {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
};

/**
 * `prefers-reduced-motion`, sin librería (2026-09-27). Devuelve `null` en el
 * servidor y durante la hidratación, y el valor real después: igual que el
 * hook de antes. Regla 5(a): decide PROPIEDADES, jamás qué elementos se pintan.
 */
export function usePrefiereQuieto(): boolean | null {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => null,
  );
}
