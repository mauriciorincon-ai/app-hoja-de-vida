import { ChevronDown } from "lucide-react";
import { CAPTURA_ALTO, CAPTURA_ANCHO } from "@/lib/vitrina/capturas";
import type { GrupoExport } from "@/lib/vitrina/schemas";
import { FirmaGrupo } from "./firmas";
import {
  GaleriaCarrusel,
  type CapturaCarrusel,
  type EtiquetasCarrusel,
} from "./galeria-carrusel";
import { IconoGrupo } from "./iconos-grupo";

/**
 * UNA TARJETA de la capa «qué hace» — la unidad del brochure, re-expresada en
 * el design system de CV Viva.
 *
 * Un grupo del export = una tarjeta. Es la anatomía del molde
 * (`kit-app/docs/BROCHURE.plantilla.html`): índice · icono del DS de la app ·
 * nombre en verbo humano · la línea que provoca abrirla · chevron; y dentro,
 * una `.feature` por funcionalidad. La jerarquía la da el `orden` del export y
 * la estrella del producto va primera.
 *
 * Aquí vive la **apertura por lectura** (banco §7): la tarjeta se abre sola al
 * llegar bajando y el toque la saca del automático. Quien la gobierna es la
 * isla `AperturaPorLectura`, una sola para toda la página — esta tarjeta es
 * server component y no lleva JS propio.
 *
 * A11y: patrón canónico `<h4><button>` (jamás `<button><h4>`, HTML inválido que
 * rompe la navegación por encabezados). Cerrada, `visibility: hidden` la saca
 * del árbol de accesibilidad: sin eso el lector de pantalla recita las 24
 * funcionalidades "cerradas" y axe no lo ve.
 */
/**
 * Las pantallas reales del grupo (026): una por cada funcionalidad que tiene
 * pantalla, en el orden de la tarjeta. Ya llegan armadas (idioma, rótulos y
 * textos accesibles) desde `FichaApp`, que es quien sabe de traducciones.
 */
export type GaleriaDelGrupo = {
  /** La carpeta pública de la app (`public/vitrina/<slug>`). */
  base: string;
  capturas: CapturaCarrusel[];
  etiquetas: EtiquetasCarrusel;
};

export function TarjetaGrupo({
  grupo,
  slug,
  etiquetaEstrella,
  galeria,
  pieFirma,
}: {
  grupo: GrupoExport;
  slug: string;
  etiquetaEstrella: string;
  galeria?: GaleriaDelGrupo;
  pieFirma: string;
}) {
  const id = `g-${slug}-${grupo.orden}`;

  return (
    <article
      data-grupo-orden={grupo.orden}
      data-estrella={grupo.estrella ? "" : undefined}
      /* `data-traza`: la isla le pone `data-vista` al asomar, y ESE es el
         disparo del dibujado del icono. Sin este atributo el icono se queda en
         `stroke-dashoffset: 1` — es decir, INVISIBLE para siempre, con la CI en
         verde: el mismo modo de falla que el kit v1.23.0 documenta para los
         umbrales porcentuales. Lo cazó la pasada de capturas, no un test. */
      data-traza
      className="tarjeta-vitrina relative overflow-hidden rounded-[10px] border border-paper-3 bg-paper-0 shadow-sh-1"
    >
      <span aria-hidden="true" className="indice-grupo">
        {String(grupo.orden).padStart(2, "0")}
      </span>

      <h4 className="m-0 font-normal">
        <button
          type="button"
          className="tarjeta-boton flex w-full cursor-pointer items-center gap-4 p-5 pr-12 text-left transition-transform duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-sky-ink active:scale-[0.99] md:p-6 md:pr-14"
          aria-expanded="false"
          aria-controls={id}
        >
          <IconoGrupo slug={slug} orden={grupo.orden} />
          <span className="min-w-0 flex-1">
            {grupo.estrella && (
              <span className="mb-1 block font-mono text-[10px] tracking-[0.1em] text-sage-ink uppercase">
                {etiquetaEstrella}
              </span>
            )}
            <span className="block font-display text-[17px] leading-snug font-medium text-ink-0">
              {grupo.nombre}
            </span>
            <span className="mt-0.5 block text-sm leading-snug text-ink-2">
              {grupo.linea}
            </span>
          </span>
          <ChevronDown
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="tarjeta-chevron shrink-0 text-ink-2"
          />
        </button>
      </h4>

      {/* `role="region"` SIEMPRE con nombre accesible: una región anónima es un
          hallazgo de axe y, peor, un salto a ciegas para quien navega por hitos. */}
      <div
        className="tarjeta-detalle"
        id={id}
        role="region"
        aria-label={grupo.nombre}
      >
        <div className="tarjeta-detalle-interior">
          <div className="tarjeta-detalle-cuerpo flex flex-col gap-5 border-t border-paper-2 px-5 pt-5 pb-6 md:px-6">
            {/* LAS PANTALLAS REALES del grupo primero, a lo ancho: la imagen
                ancla las palabras que vienen debajo. Un carrusel con una
                captura por funcionalidad que la tiene (las transversales no
                llevan figura: sin captura, sin relleno). */}
            {galeria && (
              <GaleriaCarrusel
                base={galeria.base}
                capturas={galeria.capturas}
                ancho={CAPTURA_ANCHO}
                alto={CAPTURA_ALTO}
                sinOptimizar
                sizes="(min-width: 896px) 720px, 100vw"
                etiquetas={galeria.etiquetas}
              />
            )}
            {/* Y donde el grupo no es una pantalla sino EL CLÍMAX del brochure
                de la app, va su FIRMA: la escena re-dibujada en nuestros
                tokens (gate M1). */}
            <FirmaGrupo slug={slug} orden={grupo.orden} pie={pieFirma} />
            {/* Coreografía interior: las features ALZAN en fila (~60 ms). El
                detalle no "aparece": te lo sirven en orden de lectura. */}
            {grupo.features.map((f) => (
              <div key={f.id} data-feature-id={f.id} className="escalona">
                <h5 className="flex items-baseline gap-2 text-[15px] font-medium text-ink-0">
                  {/* ink-2: el 3 del DS es decorativo, no llega a AA (2.7:1). */}
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] text-ink-2"
                  >
                    {f.id}
                  </span>
                  {f.nombre}
                </h5>
                <p className="mt-1 max-w-[64ch] text-sm leading-relaxed text-ink-1">
                  {f.que_hace}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
