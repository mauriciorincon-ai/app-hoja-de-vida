"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EL MARCO DE UNA SIMULACIÓN (2026-10-12) — se carga cuando el visitante lo pide.
 *
 * El paquete de una simulación es una app entera de OTRA casa (planlang: 136 KB
 * de scripts que corren en el mismo hilo de la página). Cargado de entrada,
 * la página pasaba el presupuesto de scripts (342 KB > 300) y el tiempo de
 * bloqueo subía de ~30 ms a 142–286 ms. Lighthouse lo llama «fachada»: se
 * muestra un panel con un botón y el marco nace al pulsarlo. Así lo que se
 * mide es lo que vive quien llega: una página liviana, y el paquete solo para
 * quien lo abre.
 *
 * **Sin JavaScript** el botón no hace nada, pero el panel trae también el
 * enlace a pantalla completa (un `.html` del mismo sitio), que funciona igual.
 *
 * **El foco no se pierde** (la lección de M1, el mismo día): el botón que se
 * pulsa desaparece al abrirse el marco, así que el foco pasa al marco.
 *
 * Regla 5(a): la forma del árbol depende de `abierto` (un clic), jamás de
 * «reducir movimiento». En el servidor y en el primer render: el panel.
 */
export function MarcoDeSimulacion({
  src,
  titulo,
  etiquetas,
}: {
  /** El `.html` de entrada del paquete, p. ej. `/piezas/planlang/es.html`. */
  src: string;
  /** Nombre accesible del marco. */
  titulo: string;
  etiquetas: {
    abrirAqui: string;
    abrirCompleta: string;
    panelLinea: string;
  };
}) {
  const [abierto, setAbierto] = useState(false);
  const marco = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (abierto) marco.current?.focus();
  }, [abierto]);

  if (abierto)
    return (
      <>
        <div className="overflow-hidden rounded-[14px] border border-paper-2 bg-paper-0 shadow-sh-1">
          <iframe
            ref={marco}
            src={src}
            title={titulo}
            data-marco-simulacion=""
            className="block h-[78dvh] min-h-[560px] w-full bg-paper-0"
          />
        </div>
        <a
          href={src}
          data-cta="simulacion-completa"
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-sage-ink underline-offset-4 hover:underline"
        >
          {etiquetas.abrirCompleta}
          <span aria-hidden="true">↗</span>
        </a>
      </>
    );

  return (
    <div
      data-panel-simulacion=""
      className="flex min-h-[320px] flex-col items-center justify-center gap-5 rounded-[14px] border border-paper-2 bg-paper-1 px-6 py-12 text-center shadow-sh-1"
    >
      <p className="max-w-[52ch] text-[15px] leading-relaxed text-ink-1">
        {etiquetas.panelLinea}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          data-cta="abrir-simulacion"
          onClick={() => setAbierto(true)}
          className="flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
        >
          {etiquetas.abrirAqui}
          <span aria-hidden="true">↓</span>
        </button>
        {/* Funciona sin JavaScript: un archivo del paquete, del mismo sitio. */}
        <a
          href={src}
          data-cta="simulacion-completa"
          className="flex min-h-11 items-center gap-2 rounded-md border border-paper-3 bg-paper-0 px-6 text-[15px] font-medium text-ink-1 transition-colors duration-[120ms] hover:bg-paper-2"
        >
          {etiquetas.abrirCompleta}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
