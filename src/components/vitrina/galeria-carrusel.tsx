"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePrefiereQuieto } from "@/components/motion/use-prefiere-quieto";

/**
 * GALERÍA EN CARRUSEL (Sprint 009) — «Cómo se ve» de la ficha técnica.
 *
 * La galería de una pieza (1 a 12 capturas, contrato v1.3.1) nació como
 * cuadrícula (`4a09c29`) y nunca fue un carrusel: este componente lo
 * construye, sin librería. Una pista horizontal con `scroll-snap` nativo —las
 * capturas se recorren a lo ancho, una por una—, dos botones y un indicador.
 *
 * **Patrón APG de carrusel** (https://www.w3.org/WAI/ARIA/apg/patterns/carousel/):
 *  · región con `aria-roledescription="carousel"` y nombre;
 *  · cada captura es un grupo `slide` con su «n de N»;
 *  · los botones son `<button>` nativos con nombre y se deshabilitan en los
 *    extremos; **sin rotación automática** (nada se mueve solo);
 *  · el indicador es una región `status` educada: lo que se ve se anuncia;
 *  · la pista recibe foco cuando hay más de una captura —un contenedor con
 *    scroll tiene que ser alcanzable con el teclado— y las flechas la recorren
 *    de forma nativa.
 *
 * **Una captura:** sin botones, sin indicador, sin foco: solo la imagen y su
 * pie, como cualquier figura.
 *
 * **Regla 5(a):** la FORMA del árbol jamás depende de `usePrefiereQuieto()`
 * (vale `null` en el servidor). El hook solo decide el `behavior` del desplazamiento
 * al pulsar un botón: `smooth`, o `auto` con «reducir movimiento».
 *
 * **Carga:** todas las capturas son `loading="lazy"` y las que están fuera de la
 * pista (recortadas por su `overflow`) no intersectan el viewport, así que el
 * navegador solo pide la primera hasta que se desliza. Lo vigila el e2e.
 *
 * Sin JS la pista sigue siendo una tira que se desliza con el dedo o la rueda:
 * el contenido llega íntegro en el HTML (gate ATS).
 *
 * Los textos llegan por props (el namespace de next-intl no viaja al bundle
 * cliente), igual que en `TimelineTrack`.
 */
export type CapturaCarrusel = { archivo: string; pie: string };

export type EtiquetasCarrusel = {
  /** Nombre accesible de la región, p. ej. «Pantallas del tablero». */
  etiqueta: string;
  anterior: string;
  siguiente: string;
  /** «1 de 6», «2 de 6»…: uno por captura, ya traducido. */
  indicadores: string[];
  /** «Pantalla 1 de 6», «Pantalla 2 de 6»…: el rótulo mono del pie de cada captura. */
  pies: string[];
};

export function GaleriaCarrusel({
  capturas,
  frente,
  etiquetas,
  sizes = "(min-width: 1024px) 976px, 100vw",
}: {
  capturas: CapturaCarrusel[];
  /** Carpeta de `public/piezas/<frente>/` de la que salen las imágenes. */
  frente: string;
  etiquetas: EtiquetasCarrusel;
  sizes?: string;
}) {
  const total = capturas.length;
  const hay = total > 1;
  const pista = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const quieto = usePrefiereQuieto();

  // Qué captura está a la vista: la que ocupa más del 60 % de la pista.
  useEffect(() => {
    const el = pista.current;
    if (!el || !hay || typeof IntersectionObserver === "undefined") return;
    const slides = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting)
            setActivo(slides.indexOf(e.target as HTMLElement));
        }
      },
      { root: el, threshold: 0.6 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [hay, total]);

  function ir(destino: number) {
    const el = pista.current;
    if (!el) return;
    const i = Math.max(0, Math.min(total - 1, destino));
    el.scrollTo({
      left: i * el.clientWidth,
      behavior: quieto ? "auto" : "smooth",
    });
    setActivo(i);
  }

  const boton =
    "inline-flex size-11 items-center justify-center rounded-full border border-paper-3 bg-paper-0 text-ink-1 transition-colors duration-[120ms] hover:bg-paper-1 hover:text-ink-0 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={etiquetas.etiqueta}
      data-carrusel=""
      data-total={total}
    >
      <div
        ref={pista}
        // Un contenedor con scroll tiene que poder recibir foco (axe:
        // scrollable-region-focusable); con una sola captura no hay scroll.
        tabIndex={hay ? 0 : undefined}
        role={hay ? "group" : undefined}
        aria-label={hay ? etiquetas.etiqueta : undefined}
        data-pista=""
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[12px] [scrollbar-width:thin]"
      >
        {capturas.map((g, i) => (
          <div
            key={`${i}-${g.archivo}`}
            data-captura={i + 1}
            role={hay ? "group" : undefined}
            aria-roledescription={hay ? "slide" : undefined}
            aria-label={hay ? etiquetas.indicadores[i] : undefined}
            className="w-full shrink-0 snap-start snap-always"
          >
            <figure className="m-0">
              <div className="overflow-hidden rounded-[12px] border border-paper-2 bg-paper-1 shadow-sh-1">
                <Image
                  src={`/piezas/${frente}/${g.archivo}`}
                  alt={g.pie}
                  width={2560}
                  height={1440}
                  sizes={sizes}
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
              <figcaption className="mt-2 flex flex-wrap items-baseline gap-x-2 text-[12.5px] leading-snug text-ink-2">
                <span className="font-mono text-[10px] tracking-[0.06em] uppercase">
                  {etiquetas.pies[i]}
                </span>
                <span>· {g.pie}</span>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      {hay && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label={etiquetas.anterior}
            disabled={activo === 0}
            onClick={() => ir(activo - 1)}
            className={boton}
          >
            <span aria-hidden="true">←</span>
          </button>
          <p
            role="status"
            aria-live="polite"
            data-indicador=""
            className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase"
          >
            {etiquetas.indicadores[activo]}
          </p>
          <button
            type="button"
            aria-label={etiquetas.siguiente}
            disabled={activo === total - 1}
            onClick={() => ir(activo + 1)}
            className={boton}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </section>
  );
}
