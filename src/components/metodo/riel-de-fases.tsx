"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * EL RIEL DE FASES (bloque 3): la misma gramática visual que la trayectoria
 * —una línea continua y un relleno que crece con lo que llevas leído— pero con
 * ítems de FASE: entradas, actividades, artefactos, quién decide y qué control
 * la cierra. Se escribió aparte de `TimelineTrack` a propósito: ese riel está
 * atado a una trayectoria (periodo, rol, organización, el año grande que sale
 * de `anioDe(periodo)`), y generalizarlo habría puesto en juego la HOME por un
 * componente nuevo. Misma idea, otro dato; la de la HOME no se toca.
 *
 * Regla 5(a): **la forma del árbol jamás depende de `useReducedMotion()`**. El
 * relleno existe SIEMPRE y se mueve escribiendo su `transform` directo desde el
 * evento de scroll (ADR-027: sin librería ni re-render). Con «reducir
 * movimiento» el cinturón CSS (`[data-motion]` → `transform: none`) lo deja
 * entero y quieto: la pieza se lee igual, quieta.
 *
 * Gate ATS/impresión: la lista de fases es HTML siempre; el riel y su relleno
 * son decoración (`aria-hidden`).
 */

export type FaseVista = {
  nombre: string;
  entradas: string[];
  actividades: string[];
  artefactos: string[];
  decide: string;
  control: string;
  /** La nota con su voz (ya resuelta en el servidor). */
  nota?: ReactNode;
};

export type EtiquetasDelRiel = {
  /** Plantilla con `{n}`, p. ej. «Fase {n}». */
  fase: string;
  avance: string;
  entradas: string;
  actividades: string;
  artefactos: string;
  decide: string;
  control: string;
};

/** Fracción de la ventana donde se mide lo leído. */
const LINEA = 0.55;

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
        {titulo}
      </h4>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((it) => (
          <li
            key={it}
            className="flex gap-2 text-[14px] leading-snug text-ink-1"
          >
            <span
              aria-hidden="true"
              className="mt-[8px] size-1 shrink-0 rounded-full bg-lilac-ink"
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RielDeFases({
  fases,
  etiquetas,
}: {
  fases: FaseVista[];
  etiquetas: EtiquetasDelRiel;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const relleno = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const medir = () => {
      raf = 0;
      const c = contenedor.current;
      const r = relleno.current;
      if (!c || !r) return;
      const rect = c.getBoundingClientRect();
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight * LINEA - rect.top) / rect.height),
      );
      r.style.transform = `scaleY(${p})`;
    };
    const alMover = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    alMover();
    return () => {
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={contenedor} data-riel="" className="relative">
      {/* La línea entera y, encima, cuánto llevas leído. */}
      <div
        aria-hidden="true"
        className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-paper-3"
      />
      <div
        ref={relleno}
        aria-hidden="true"
        data-motion=""
        data-riel-relleno=""
        className="absolute top-4 bottom-4 left-[15px] w-0.5 origin-top bg-lilac-ink print:hidden"
        style={{ transform: "scaleY(0)" }}
      />
      <ol
        aria-label={etiquetas.avance}
        className="relative flex flex-col gap-8"
      >
        {fases.map((f, i) => (
          <li
            key={`${i}-${f.nombre}`}
            data-fase={i + 1}
            className="relative pl-12"
          >
            <span
              aria-hidden="true"
              className="absolute top-1 left-0 z-10 grid size-8 place-items-center rounded-full bg-lilac font-mono text-[13px] font-medium text-lilac-ink tabular-nums ring-4 ring-paper-0"
            >
              {i + 1}
            </span>
            <article className="rounded-[14px] border border-paper-2 bg-paper-0 p-5 shadow-sh-1 print:break-inside-avoid print:shadow-none">
              <header className="flex flex-col gap-1.5">
                <span className="self-start rounded-full bg-lilac px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-lilac-ink uppercase tabular-nums">
                  {etiquetas.fase.replace("{n}", String(i + 1))}
                </span>
                <h3 className="font-display text-[1.25rem] leading-snug font-medium text-ink-0">
                  {f.nombre}
                </h3>
              </header>
              <div className="mt-4 grid gap-5 md:grid-cols-3">
                <Lista titulo={etiquetas.entradas} items={f.entradas} />
                <Lista titulo={etiquetas.actividades} items={f.actividades} />
                <Lista titulo={etiquetas.artefactos} items={f.artefactos} />
              </div>
              <dl className="mt-4 grid gap-4 border-t border-paper-2 pt-4 md:grid-cols-2">
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                    {etiquetas.decide}
                  </dt>
                  <dd className="mt-1 text-[14px] leading-snug text-ink-1">
                    {f.decide}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                    {etiquetas.control}
                  </dt>
                  <dd className="mt-1 text-[14px] leading-snug text-ink-1">
                    {f.control}
                  </dd>
                </div>
              </dl>
              {f.nota && <div className="mt-4">{f.nota}</div>}
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
