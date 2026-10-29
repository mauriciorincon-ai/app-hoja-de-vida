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
 *  · los botones son `<button>` nativos con nombre y en los extremos quedan
 *    APAGADOS con `aria-disabled`, no con `disabled`; **sin rotación
 *    automática** (nada se mueve solo);
 *  · el indicador es una región `status` educada: lo que se ve se anuncia;
 *  · la pista recibe foco cuando hay más de una captura —un contenedor con
 *    scroll tiene que ser alcanzable con el teclado— y las flechas la recorren
 *    de forma nativa.
 *
 * **Apagado, no deshabilitado (deuda M1 del S9, 2026-10-12).** Con `disabled`,
 * el botón del extremo dejaba de ser enfocable justo cuando tenía el foco —quien
 * llega al final pulsando «siguiente» con el teclado lo tiene ahí—, y WebKit
 * (Safari) lo mandaba al <body>: el siguiente Tab arrancaba desde el principio
 * de la página. Con `aria-disabled` el botón conserva el foco, se anuncia como
 * no disponible, se ve atenuado igual que antes y pulsarlo no hace nada. Lo
 * vigila un e2e `@webkit` que corre en el motor de Safari.
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
 * el contenido llega íntegro en el HTML (gate ATS). Los botones y el indicador
 * no harían nada sin script, así que un `<noscript>` los oculta (deuda B3 del
 * S9, pagada en el S20): con JS el navegador no aplica ese estilo y nada cambia.
 *
 * Los textos llegan por props (el namespace de next-intl no viaja al bundle
 * cliente), igual que en `TimelineTrack`.
 */
export type CapturaCarrusel = { archivo: string; pie: string };

export type EtiquetasCarrusel = {
  /** Nombre accesible de la región, p. ej. «Pantallas del tablero». */
  etiqueta: string;
  /**
   * Nombre accesible de la PISTA que se desliza (tiene foco y rol de grupo): distinto
   * del de la región, para que un lector de pantalla no diga lo mismo dos veces.
   */
  pista: string;
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
  base,
  ancho = 2560,
  alto = 1440,
  sinOptimizar = false,
  etiquetas,
  sizes = "(min-width: 1024px) 976px, 100vw",
}: {
  capturas: CapturaCarrusel[];
  /** Carpeta de `public/piezas/<frente>/` de la que salen las imágenes. */
  frente?: string;
  /**
   * Una carpeta pública cualquiera (la de las capturas: `public/vitrina/<slug>`), en vez de la de un
   * frente: las capturas de las apps (026) viven ahí.
   */
  base?: string;
  /** Las dimensiones de las imágenes (los tableros, 2560×1440; las apps, 1536×960). */
  ancho?: number;
  alto?: number;
  /**
   * Sirve el archivo tal cual, sin pasar por el optimizador de Next. Las
   * capturas de las apps ya llegan en WebP de ≤ 80 KB: optimizar 250 imágenes
   * gastaría el cupo mensual del plan Hobby de Vercel sin ganar un byte.
   */
  sinOptimizar?: boolean;
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

  const enInicio = activo === 0;
  const enFinal = activo === total - 1;

  const boton =
    "inline-flex size-11 items-center justify-center rounded-full border border-paper-3 bg-paper-0 text-ink-1 transition-colors duration-[120ms] hover:bg-paper-1 hover:text-ink-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:bg-paper-0 aria-disabled:hover:text-ink-1 motion-reduce:transition-none";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={etiquetas.etiqueta}
      data-carrusel=""
    >
      <div
        ref={pista}
        // Un contenedor con scroll tiene que poder recibir foco (axe:
        // scrollable-region-focusable); con una sola captura no hay scroll.
        tabIndex={hay ? 0 : undefined}
        role={hay ? "group" : undefined}
        aria-label={hay ? etiquetas.pista : undefined}
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
                  src={`${base ?? `/piezas/${frente}`}/${g.archivo}`}
                  alt={g.pie}
                  width={ancho}
                  height={alto}
                  sizes={sizes}
                  unoptimized={sinOptimizar}
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
        <div
          data-controles=""
          className="mt-3 flex items-center justify-between gap-3"
        >
          <button
            type="button"
            aria-label={etiquetas.anterior}
            aria-disabled={enInicio || undefined}
            onClick={() => {
              if (!enInicio) ir(activo - 1);
            }}
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
            aria-disabled={enFinal || undefined}
            onClick={() => {
              if (!enFinal) ir(activo + 1);
            }}
            className={boton}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
      {hay && (
        <noscript>
          <style>{"[data-carrusel] [data-controles]{display:none}"}</style>
        </noscript>
      )}
    </section>
  );
}
