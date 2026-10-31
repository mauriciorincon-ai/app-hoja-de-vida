"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import type { Pantalla } from "@/lib/brochure/modelo";
import { Captura, Svg } from "./piezas";

/**
 * EL RECORRIDO Y LA VISTA PREVIA (S28): el marcado de la maqueta, el mismo que escribía el servidor,
 * pero las piezas de cada pantalla (36 diapositivas, sus tiras y sus textos en la piloto) se pintan la
 * PRIMERA vez que hacen falta, no en el HTML de la página. Las dos piezas solo sirven con JavaScript
 * (un `<dialog>` y una tarjeta al pasar el cursor), y su texto ya está en la página en las funcionalidades
 * de cada capítulo: en el HTML pesaban una quinta parte del documento y de los nodos que React hidrata.
 *
 * La isla las arma con un evento antes de usarlas (`brochure:arma-recorrido`, `brochure:arma-previa`) y
 * `flushSync` deja el marcado en el DOM antes de que el evento vuelva: desde ahí la isla las maneja
 * como antes, solo con atributos.
 */

/** Pinta el marcado completo desde que la isla pide el evento por primera vez. */
function useArmado(evento: string) {
  const [armado, setArmado] = useState(false);
  useEffect(() => {
    const armar = () => flushSync(() => setArmado(true));
    document.addEventListener(evento, armar, { once: true });
    return () => document.removeEventListener(evento, armar);
  }, [evento]);
  return armado;
}

export type TextosRecorrido = {
  /** «Recorrido de la App · Innmobiliaria». */
  etiqueta: string;
  /** «{i} de {n}», con las dos marcas sin llenar. */
  cuenta: string;
  play: string;
  pausa: string;
  cerrar: string;
  ant: string;
  sig: string;
  capitulo: string;
  teclas: string;
};

export function Recorrido({
  nombre,
  inicial,
  pantallas,
  grupos,
  x,
}: {
  nombre: string;
  inicial: string;
  pantallas: Pantalla[];
  grupos: { orden: number; nombre: string; n: number }[];
  x: TextosRecorrido;
}) {
  const armado = useArmado("brochure:arma-recorrido");
  const ps = armado ? pantallas : [];
  return (
    <dialog className="recorrido" id="recorrido" aria-label={x.etiqueta}>
      <div className="r-cabeza">
        <span className="marca">
          <i aria-hidden="true">{inicial}</i>
          {nombre}
        </span>
        <span className="r-grupo">
          {ps.map((p, i) => (
            <span key={p.id} data-b-r={i} hidden>
              {p.rotuloGrupo}
            </span>
          ))}
        </span>
        <span className="r-cuenta">
          {ps.map((p, i) => (
            <span key={p.id} data-b-r={i} hidden>
              {x.cuenta
                .replace("{i}", String(i + 1))
                .replace("{n}", String(ps.length))}
            </span>
          ))}
        </span>
        <button
          type="button"
          className="r-boton"
          id="r-auto"
          aria-pressed="false"
        >
          <span data-b-auto="off">
            <Svg nombre="play" />
            {x.play}
          </span>
          <span data-b-auto="on" hidden>
            <Svg nombre="pausa" />
            {x.pausa}
          </span>
        </button>
        <button type="button" className="r-boton" id="r-cerrar">
          <Svg nombre="cerrar" />
          <span>{x.cerrar}</span>
        </button>
      </div>
      <div className="r-segmentos">
        {grupos.map((g) => (
          <button
            key={g.orden}
            type="button"
            className="r-seg"
            style={{ "--n": g.n } as CSSProperties}
            data-g={g.orden}
            aria-label={g.nombre}
          >
            <i />
          </button>
        ))}
      </div>
      <div className="r-escenario">
        <div className="r-marco">
          {ps.map((p, i) => (
            <Captura
              key={p.id}
              src={p.src}
              alt={p.pie}
              extra={{ "data-b-r": i, "data-id": p.id, "data-g": p.grupo }}
            />
          ))}
        </div>
        <button
          type="button"
          className="r-flecha r-ant"
          id="r-ant"
          aria-label={x.ant}
        >
          <Svg nombre="izq" />
        </button>
        <button
          type="button"
          className="r-flecha r-sig"
          id="r-sig"
          aria-label={x.sig}
        >
          <Svg nombre="der" />
        </button>
      </div>
      <div className="r-texto">
        {ps.map((p, i) => (
          <div key={p.id} className="r-diapo" data-b-r={i} hidden>
            <b>{p.nombre}</b>
            <p className="r-pie">{p.pie}</p>
            <p>{p.queHace}</p>
          </div>
        ))}
        <div>
          <button type="button" className="r-boton" id="r-capitulo">
            {x.capitulo} →
          </button>
        </div>
      </div>
      <div className="r-tiras">
        {ps.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className="r-tira"
            data-ri={i}
            aria-label={p.nombre}
          >
            <Captura src={p.src} modo="lazy" />
          </button>
        ))}
      </div>
      <p className="r-teclas">{x.teclas}</p>
    </dialog>
  );
}

export function Previa({ pantallas }: { pantallas: Pantalla[] }) {
  const armado = useArmado("brochure:arma-previa");
  return (
    <div className="previa" id="previa" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- el src lo pone la isla al mostrarla */}
      <img alt="" width={1536} height={960} />
      {(armado ? pantallas : []).map((p) => (
        <p key={p.id} data-b-previa={p.id} data-src={p.src} hidden>
          <b>
            {p.rotuloGrupo.split(" · ")[0]} · {p.nombre}
          </b>
          {p.pie}
        </p>
      ))}
    </div>
  );
}
