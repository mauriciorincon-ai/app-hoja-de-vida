"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { flushSync } from "react-dom";
import { trazarFlujo } from "@/lib/brochure/flujo";
import type { FlujoVista } from "@/lib/brochure/modelo";
import { SVG } from "./iconos";

/**
 * EL DIBUJO DE UN FLUJO (S28): cajas y flechas, con el motor de la maqueta (`lib/brochure/flujo.ts`).
 *
 * El servidor ya escribe el primer dibujo (al ancho de escritorio, `ancho`), así que la página se lee
 * entera sin JavaScript y Ctrl+F encuentra cada paso. Aquí solo se REDIBUJA: al cambiar el ancho del
 * marco (un `ResizeObserver`; un capítulo cerrado mide 0 y no se toca) y al imprimir, cuando el flujo
 * se traza al ancho de la hoja carta (700 px) con `flushSync` antes de que el navegador componga.
 * Como en la maqueta, las cajas entran con su escalonado solo cuando el dibujo cambia de forma.
 *
 * Las cajas son una lista (`role="list"`): cada una dice su tipo y su actor con texto para el lector
 * de pantalla, y la que tiene pantalla lleva un botón real que abre el Recorrido.
 */
export function FlujoDibujo({
  vista,
  ancho,
  n,
  buscable = false,
  verEnRecorrido,
}: {
  vista: FlujoVista;
  ancho: number;
  /** El número del capítulo (para el buscador). */
  n?: string;
  /** Si sus pasos entran al índice del buscador (los de los capítulos sí; el proceso no). */
  buscable?: boolean;
  verEnRecorrido: string;
}) {
  const marco = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(ancho);
  const [papel, setPapel] = useState(false);
  const [listo, setListo] = useState(true);
  const t = useMemo(
    () => trazarFlujo(vista.flujo, papel ? 700 : w),
    [vista.flujo, w, papel],
  );
  const firma = `${t.modo}·${t.porFila}·${t.anchoCaja}·${t.w}`;
  const anterior = useRef(firma);

  // Medir: el ancho del marco manda (un capítulo cerrado mide 0 y conserva el dibujo que tiene).
  useEffect(() => {
    const el = marco.current;
    if (!el) return;
    let imprimiendo = false;
    const medir = () => {
      if (imprimiendo) return;
      const cw = el.clientWidth;
      if (cw > 0) setW(cw);
    };
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    const antes = () => {
      imprimiendo = true;
      flushSync(() => setPapel(true));
    };
    const despues = () => {
      imprimiendo = false;
      setPapel(false);
      medir();
    };
    addEventListener("beforeprint", antes);
    addEventListener("afterprint", despues);
    return () => {
      ro.disconnect();
      removeEventListener("beforeprint", antes);
      removeEventListener("afterprint", despues);
    };
  }, []);

  // Las cajas vuelven a entrar solo cuando el dibujo cambia de forma (como `dibujar` con su firma).
  useEffect(() => {
    if (anterior.current === firma || papel) return;
    anterior.current = firma;
    setListo(false);
    let b = 0;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setListo(true));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [firma, papel]);

  const porId = new Map(vista.nodos.map((x) => [x.id, x]));
  const zoom = papel ? Math.min(1, 696 / t.w) : 1;
  const marcador = `m-${vista.clave}`;

  return (
    <div
      ref={marco}
      className="flujo-marco"
      data-flujo={vista.clave}
      tabIndex={0}
      role="region"
      aria-label={vista.region}
      data-b-listo={listo ? "" : undefined}
    >
      <div
        className="flujo-lienzo"
        style={{ width: t.w, height: t.h, ...(zoom < 1 ? { zoom } : {}) }}
      >
        <svg
          viewBox={`0 0 ${t.w} ${t.h}`}
          width={t.w}
          height={t.h}
          aria-hidden="true"
        >
          <defs>
            <marker
              id={marcador}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-2)" />
            </marker>
          </defs>
          {t.aristas.map((a) => (
            <path
              key={`${a.de}>${a.a}`}
              className={`arista${a.vuelta ? " vuelta" : ""}`}
              d={a.d}
              markerEnd={`url(#${marcador})`}
              data-motion=""
            />
          ))}
        </svg>
        <ul className="flujo-nodos" role="list">
          {t.nodos.map((nodo, k) => {
            const v = porId.get(nodo.id)!;
            const id = `n-${vista.clave}-${nodo.id}`;
            const buscar =
              buscable && v.texto
                ? {
                    "data-b-buscar": "n",
                    "data-b-n": n,
                    "data-b-titulo": v.texto,
                    "data-b-ir-sec": vista.clave,
                    "data-b-ir-el": id,
                  }
                : {};
            return (
              <li
                key={nodo.id}
                id={id}
                className={`nodo t-${nodo.tipo}${nodo.tipo === "fin" && !v.texto ? " vacio" : ""}`}
                style={
                  {
                    left: nodo.x,
                    top: nodo.y,
                    width: nodo.w,
                    height: nodo.h,
                    "--d": `${k * 45}ms`,
                  } as CSSProperties
                }
                data-func={v.pantalla}
                data-motion=""
                {...buscar}
              >
                <span className="sr">{v.aria}</span>
                {v.actor ? (
                  <span
                    className={`nodo-actor ${v.actor.clase}`}
                    aria-hidden="true"
                  >
                    <i />
                    {v.actor.nombre}
                  </span>
                ) : null}
                {v.texto ? (
                  <span className="nodo-txt" aria-hidden="true">
                    {v.texto}
                  </span>
                ) : null}
                {v.pantalla ? (
                  <span
                    className="nodo-pant"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: SVG.pant }}
                  />
                ) : null}
                {v.nota ? (
                  <span className="nodo-nota" aria-hidden="true">
                    {v.nota}
                  </span>
                ) : null}
                {v.pantalla ? (
                  <button
                    type="button"
                    className="nodo-ver"
                    data-recorrido={v.pantalla}
                    data-previa={v.pantalla}
                    aria-label={`${verEnRecorrido}: ${v.texto}`}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
        {t.etiquetas.map((x) => (
          <span
            key={`${x.de}>${x.a}`}
            className="etq"
            style={
              { left: x.x, top: x.y, "--etq": `${x.max}px` } as CSSProperties
            }
            aria-hidden="true"
          >
            {x.t}
          </span>
        ))}
      </div>
    </div>
  );
}
