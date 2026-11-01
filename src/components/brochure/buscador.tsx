"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { SVG } from "./iconos";

/**
 * EL BUSCADOR DEL BROCHURE (`/`, S28): busca en funcionalidades, fichas, pasos de los flujos y «te sirve
 * si» / «lo que no es», como el de la maqueta.
 *
 * Su índice no viaja como prop: se arma DEL DOM la primera vez que la caja recibe el foco, leyendo lo
 * que el servidor marcó con `data-b-buscar` (el texto es el que la página ya pinta, y los capítulos
 * cerrados también están en el DOM). Un resultado no salta por sí mismo: avisa con el evento
 * `brochure:ir` y la isla del brochure hace el salto con su «↩ Volver a donde estabas».
 */

type Entrada = {
  tipo: string;
  n: string;
  titulo: string;
  k: string;
  sec: string;
  el?: string;
};

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const TIPO: Record<string, string> = {
  f: "tipoResF",
  fi: "tipoResFi",
  n: "tipoResN",
  s: "tipoResS",
  x: "tipoResX",
};

export function Buscador({ ph, etiqueta }: { ph: string; etiqueta: string }) {
  const t = useTranslations("brochure");
  const [indice, setIndice] = useState<Entrada[] | null>(null);
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState(false);

  const armar = () => {
    if (indice) return;
    const raiz = document.querySelector("[data-brochure]");
    const leido = [
      ...(raiz?.querySelectorAll<HTMLElement>("[data-b-buscar]") ?? []),
    ].map((el) => ({
      tipo: el.dataset.bBuscar!,
      n: el.dataset.bN ?? "",
      titulo: el.dataset.bTitulo ?? "",
      k: norm(el.textContent ?? ""),
      sec: el.dataset.bIrSec ?? "",
      el: el.dataset.bIrEl,
    }));
    setIndice(leido);
  };

  const termino = norm(q.trim());
  const hits =
    termino && indice ? indice.filter((x) => x.k.includes(termino)) : [];

  const ir = (x: Entrada) => {
    setAbierto(false);
    document.dispatchEvent(
      new CustomEvent("brochure:ir", { detail: { sec: x.sec, el: x.el } }),
    );
  };

  const marca = (s: string) => {
    const i = norm(s).indexOf(termino);
    if (i < 0) return s;
    return (
      <>
        {s.slice(0, i)}
        <mark className="hl">{s.slice(i, i + termino.length)}</mark>
        {s.slice(i + termino.length)}
      </>
    );
  };

  return (
    <div
      className="busca"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setAbierto(false);
      }}
    >
      <span
        className="b-svg"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: SVG.buscar }}
      />
      <input
        type="search"
        id="buscar"
        placeholder={ph}
        aria-label={etiqueta}
        autoComplete="off"
        value={q}
        onFocus={() => {
          armar();
          if (q.trim()) setAbierto(true);
        }}
        onChange={(e) => {
          armar();
          setQ(e.target.value);
          setAbierto(!!e.target.value.trim());
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && hits[0]) ir(hits[0]);
          if (e.key === "Escape") setAbierto(false);
        }}
      />
      {abierto && termino ? (
        <div className="resultados" id="resultados">
          <p>
            {hits.length
              ? t("resN", { n: hits.length, q: q.trim() })
              : t("res0", { q: q.trim() })}
          </p>
          {hits.slice(0, 14).map((x, i) => (
            <button
              type="button"
              key={`${x.sec}-${x.el ?? ""}-${i}`}
              onClick={() => ir(x)}
            >
              <span className="r-n">{x.n}</span>
              <b>{marca(x.titulo)}</b>
              <small>{t(TIPO[x.tipo] ?? "tipoResF")}</small>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
