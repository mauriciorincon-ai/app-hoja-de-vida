import type { ReactNode } from "react";
import type { TextosDeUsala } from "@/lib/brochure/usala-textos";
import type { Textos, VistaBrochure } from "@/lib/brochure/modelo";
import { Svg } from "./piezas";
import {
  Antes,
  Barra,
  Cierre,
  Mapa,
  Metodo,
  Portada,
  Previa,
  Proceso,
  Recorrido,
} from "./secciones";
import "./brochure.css";

/**
 * EL BROCHURE DE UNA APP (S28): la plantilla única de la maqueta aprobada, para las diez apps del
 * Portafolio y las dos de la casa. Todo el HTML lo escribe el servidor desde `armarBrochure`; la isla
 * `BrochureInteractivo` (la monta la página) le da el comportamiento.
 *
 * Anatomía, como la maqueta: 00 · portada a sangre · 01 Lo que cambia · 02 El mapa (con sus
 * capítulos 2.1…) · 03 De punta a punta · 04 Hecho con método · 05 Úsala; en toda la página, el
 * Recorrido, el buscador (`/`), el índice y «↩ Volver a donde estabas».
 */
export function Brochure({
  v,
  t,
  href,
  buscador,
  usala,
}: {
  v: VistaBrochure;
  t: Textos;
  /** Los textos de «Úsala» que son del Portafolio y no del brochure (S30). */
  usala: TextosDeUsala;
  /** Un destino de este sitio en el idioma de la página («/#contacto» → «/es#contacto»). */
  href: (destino: string) => string;
  buscador: ReactNode;
}) {
  const sec = (id: string) => v.secciones.find((s) => s.id === id)!;
  return (
    <div data-brochure="" data-acento={v.acento} lang={v.lang}>
      <Barra v={v} t={t} buscador={buscador} />
      <Portada v={v} t={t} />
      <div>
        <Antes v={v} t={t} s={sec("antes")} />
        <Mapa v={v} t={t} s={sec("mapa")} />
        {v.proceso ? <Proceso v={v} t={t} s={sec("proceso")} /> : null}
        <Metodo v={v} t={t} s={sec("metodo")} />
      </div>
      <Cierre v={v} t={t} s={sec("cierre")} href={href} u={usala} />
      <button type="button" className="regreso" id="regreso" hidden>
        <Svg nombre="izq" />↩ {t("volverDonde")}
      </button>
      <Previa v={v} />
      <Recorrido v={v} t={t} />
    </div>
  );
}
