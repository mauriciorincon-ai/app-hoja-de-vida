"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefiereQuieto } from "@/components/motion/use-prefiere-quieto";

/**
 * CARRUSEL DE MUESTRAS DE APP — los bloques de `/vitrina/apps` (ajuste
 * post-S9, 2026-10-07).
 *
 * Cada bloque de categoría (Profesionales · Personales) pone sus muestras en
 * una pista horizontal: **dos por vista desde 640 px, una con la siguiente
 * asomando en el teléfono**, y las demás entran al desplazar. Las tarjetas son
 * las de siempre (`MuestraApp`, sin cambios): lo único nuevo es la pista. El
 * ancho de cada una es el de la columna de la rejilla anterior (`gap-5`, dos
 * columnas), así que los rótulos de la tira dibujada conservan su tamaño: con
 * tres por vista bajarían a ~6 px y dejarían de leerse.
 *
 * Es el carrusel de la galería de tableros (`galeria-carrusel.tsx`, el que el
 * dueño aprobó) con otra medida: mismo patrón APG, mismos botones, mismo
 * indicador, sin autoplay —nada se mueve solo—, sin bucle y sin librería. Se
 * duplica a propósito la mecánica (~60 líneas) en vez de tocar el carrusel
 * aprobado; cuando aparezca un tercero, se unifican en un primitivo.
 *
 *  · el contenedor es un grupo `carousel` con nombre; cada tarjeta, un grupo
 *    `slide` con su «n de N» (la lista no puede ser `ul`: un `li` con rol de
 *    grupo la rompe para axe);
 *  · la pista recibe foco —un contenedor con scroll tiene que ser alcanzable
 *    con el teclado— y las flechas la recorren de forma nativa;
 *  · como hay más de una tarjeta a la vista, el observador lleva el CONJUNTO
 *    de las que ocupan más del 60 % de la pista: «anterior» se apaga si la
 *    primera está a la vista y «siguiente» si lo está la última;
 *  · **una sola tarjeta:** sin botones, sin indicador, sin foco y sin roles.
 *
 * **Regla 5(a):** la FORMA del árbol jamás depende de `usePrefiereQuieto()`
 * (vale `null` en el servidor). El hook solo decide el `behavior` del
 * desplazamiento al pulsar un botón: `smooth`, o `auto` con «reducir
 * movimiento». Ninguna medida del cliente decide qué elementos existen.
 *
 * Sin JS la pista sigue siendo una tira que se desliza con el dedo o la rueda,
 * y las seis tarjetas están en el HTML (gate ATS). Los textos llegan por props
 * (el namespace de next-intl no viaja al bundle cliente).
 */
export type EtiquetasCarruselMuestras = {
  /** Nombre accesible del carrusel, p. ej. «Apps profesionales». */
  etiqueta: string;
  anterior: string;
  siguiente: string;
  /** «1 de 3», «2 de 3»…: uno por tarjeta, ya traducido. */
  indicadores: string[];
};

export function CarruselDeMuestras({
  etiquetas,
  children,
}: {
  etiquetas: EtiquetasCarruselMuestras;
  children: ReactNode;
}) {
  const tarjetas = Children.toArray(children);
  const total = tarjetas.length;
  const hay = total > 1;
  const pista = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const [finAlaVista, setFinAlaVista] = useState(false);
  const quieto = usePrefiereQuieto();

  // Qué tarjetas están a la vista: las que ocupan más del 60 % de la pista.
  useEffect(() => {
    const el = pista.current;
    if (!el || !hay || typeof IntersectionObserver === "undefined") return;
    const slides = Array.from(el.children) as HTMLElement[];
    const vistas = new Set<number>();
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const i = slides.indexOf(e.target as HTMLElement);
          if (i < 0) continue;
          if (e.intersectionRatio >= 0.6) vistas.add(i);
          else vistas.delete(i);
        }
        if (vistas.size === 0) return; // a mitad de desplazamiento
        setActivo(Math.min(...vistas));
        setFinAlaVista(vistas.has(total - 1));
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
    const tarjeta = el.children[i] as HTMLElement | undefined;
    el.scrollTo({
      left: tarjeta?.offsetLeft ?? 0,
      behavior: quieto ? "auto" : "smooth",
    });
    setActivo(i);
  }

  const boton =
    "inline-flex size-11 items-center justify-center rounded-full border border-paper-3 bg-paper-0 text-ink-1 transition-colors duration-[120ms] hover:bg-paper-1 hover:text-ink-0 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none";

  return (
    <div
      role={hay ? "group" : undefined}
      aria-roledescription={hay ? "carousel" : undefined}
      aria-label={hay ? etiquetas.etiqueta : undefined}
      data-carrusel-apps=""
      data-total={total}
    >
      <div
        ref={pista}
        // Un contenedor con scroll tiene que poder recibir foco (axe:
        // scrollable-region-focusable); con una sola tarjeta no hay scroll.
        tabIndex={hay ? 0 : undefined}
        role={hay ? "group" : undefined}
        aria-label={hay ? etiquetas.etiqueta : undefined}
        data-pista=""
        // El relleno vertical (con margen negativo que lo devuelve) deja sitio a
        // la sombra y al levantamiento de la tarjeta, que el overflow recortaría.
        className="relative -my-3 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain py-3 [scrollbar-width:thin]"
      >
        {tarjetas.map((tarjeta, i) => (
          <div
            key={i}
            data-tarjeta={i + 1}
            role={hay ? "group" : undefined}
            aria-roledescription={hay ? "slide" : undefined}
            aria-label={hay ? etiquetas.indicadores[i] : undefined}
            className={
              hay
                ? "w-[88%] shrink-0 snap-start snap-always sm:w-[calc((100%-1.25rem)/2)]"
                : "w-full"
            }
          >
            {tarjeta}
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
            disabled={finAlaVista || activo === total - 1}
            onClick={() => ir(activo + 1)}
            className={boton}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
