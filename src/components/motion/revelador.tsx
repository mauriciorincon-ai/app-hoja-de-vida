"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { calcularRetrasos } from "./retrasos";

/**
 * EL ÚNICO JAVASCRIPT DE LAS ENTRADAS (2026-09-27, ADR-027).
 *
 * `Reveal`, `Stagger`, `StaggerItem`, `CifraQueLlama` y los iconos de Skills
 * son componentes de servidor: escriben `data-reveal` / `data-reveal-group` /
 * `data-reveal-item` y el CSS de globals.css los tiene en su estado oculto
 * hasta que aquí les llega `data-visto`. Esto observa cada bloque con un
 * IntersectionObserver por umbral (el `amount` de antes) y reparte los
 * retrasos de cada grupo (`retrasos.ts`). Nada más: ni una librería, ni un
 * componente de cliente por sección.
 *
 * Vive en el layout, que no se desmonta al navegar: por eso vuelve a barrer
 * el documento en cada cambio de ruta.
 */
export function Revelador() {
  const ruta = usePathname();

  useEffect(() => {
    for (const grupo of document.querySelectorAll("[data-reveal-group]")) {
      calcularRetrasos(grupo);
    }

    const observadores = new Map<number, IntersectionObserver>();
    const observar = (el: Element) => {
      const umbral = Number(el.getAttribute("data-umbral") ?? "0.25");
      let io = observadores.get(umbral);
      if (!io) {
        io = new IntersectionObserver(
          (entradas) => {
            for (const e of entradas) {
              // `once: false`: al salir de pantalla vuelve al estado oculto y
              // la entrada se repite en la siguiente pasada.
              if (e.isIntersecting && e.intersectionRatio >= umbral - 0.001) {
                e.target.setAttribute("data-visto", "");
              } else {
                e.target.removeAttribute("data-visto");
              }
            }
          },
          { threshold: umbral },
        );
        observadores.set(umbral, io);
      }
      io.observe(el);
    };
    document
      .querySelectorAll("[data-reveal], [data-reveal-group]")
      .forEach(observar);

    return () => observadores.forEach((io) => io.disconnect());
  }, [ruta]);

  return null;
}
