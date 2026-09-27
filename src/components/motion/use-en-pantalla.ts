import { useEffect, useState, type RefObject } from "react";

/**
 * ¿Está el elemento en pantalla? (2026-09-27, reemplaza al `useInView` de la
 * librería.) `umbral` es la fracción visible que hace falta, como el `amount`
 * de antes; vuelve a `false` al salir, así que lo que dependa de esto se
 * repite en cada pasada.
 */
export function useEnPantalla(
  ref: RefObject<Element | null>,
  umbral: number,
): boolean {
  const [enPantalla, setEnPantalla] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) =>
        setEnPantalla(
          e.isIntersecting && e.intersectionRatio >= umbral - 0.001,
        ),
      { threshold: umbral },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, umbral]);

  return enPantalla;
}
