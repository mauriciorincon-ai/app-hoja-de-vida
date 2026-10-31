import type { CSSProperties } from "react";
import type {
  Cifra,
  Cita,
  Fuente,
  Seccion,
  Textos,
} from "@/lib/brochure/modelo";
import { ICONOS, SVG, type NombreSvg } from "./iconos";

/**
 * LAS PIEZAS PEQUEÑAS DEL BROCHURE (S28): las de la maqueta («piezas pequeñas»), como componentes de
 * servidor. Ninguna lleva estado: lo que cambia en la página (abrir, voltear, saltar) lo hace la isla
 * `BrochureInteractivo` cambiando atributos.
 */

/** Un SVG de la interfaz (marcado constante de esta casa). `display: contents`: no altera la maqueta. */
export function Svg({ nombre }: { nombre: NombreSvg }) {
  return (
    <span
      className="b-svg"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: SVG[nombre] }}
    />
  );
}

/** El ícono de un grupo del mapa. */
export function Icono({ nombre }: { nombre: string }) {
  const trazo = ICONOS[nombre as keyof typeof ICONOS] ?? ICONOS.pantalla;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: trazo }}
    />
  );
}

const SIMBOLO: Record<Fuente, string> = {
  medido: "●",
  calculada: "▲",
  declarado: "◆",
  estimacion: "○",
};
const CLAVE_FUENTE: Record<Fuente, string> = {
  medido: "fuenteMedido",
  calculada: "fuenteCalculada",
  declarado: "fuenteDeclarado",
  estimacion: "fuenteEstimacion",
};

/** La procedencia de una cifra: símbolo + palabra + color, nunca solo color. */
export function ChipFuente({ fuente, t }: { fuente: Fuente; t: Textos }) {
  return (
    <span className={`fuente f-${fuente}`}>
      <span aria-hidden="true">{SIMBOLO[fuente]}</span>
      {t(CLAVE_FUENTE[fuente])}
    </span>
  );
}

/** Una cita: dice a dónde lleva con el número y el título del destino, y lleva ahí. */
export function CitaBoton({ cita }: { cita?: Cita }) {
  if (!cita) return null;
  return (
    <button
      type="button"
      className="cita"
      data-ir-sec={cita.sec}
      data-ir-el={cita.el}
      data-previa={cita.previa}
    >
      <Svg nombre="cita" />
      {cita.texto}
    </button>
  );
}

/** El valor de una cifra con su unidad, como en la maqueta. */
export function Valor({
  cifra,
}: {
  cifra: Pick<Cifra, "numero" | "prefijo" | "sufijo">;
}) {
  return (
    <>
      {cifra.prefijo ? (
        <small style={{ margin: "0 2px 0 0" }}>{cifra.prefijo}</small>
      ) : null}
      {cifra.numero}
      {cifra.sufijo ? <small>{cifra.sufijo}</small> : null}
    </>
  );
}

/**
 * Una captura. `ahora`: la pide el HTML (solo la primera de la portada, con prioridad alta). `lazy`:
 * la carga perezosa del navegador (las que viven en capítulos cerrados no se piden). Sin ninguna de
 * las dos, la imagen es DIFERIDA: llega sin `src` y la isla se lo pone al acercarse a la vista (la
 * cinta, las pantallas que rotan): así la portada no pide treinta y seis imágenes al cargar.
 */
export function Captura({
  src,
  alt = "",
  modo = "diferida",
  className,
  style,
  extra,
}: {
  src: string;
  alt?: string;
  modo?: "ahora" | "lazy" | "diferida";
  className?: string;
  style?: CSSProperties;
  extra?: Record<string, string | number | undefined>;
}) {
  const comun = {
    width: 1536,
    height: 960,
    decoding: "async" as const,
    className,
    style,
    ...extra,
  };
  // Las capturas se sirven tal cual (WebP de 1536×960 ≤ 80 KB, cupo de Vercel Hobby): sin optimizador,
  // y la diferida llega sin `src` (se lo pone la isla).
  /* eslint-disable @next/next/no-img-element */
  if (modo === "ahora")
    return (
      <img
        src={src}
        alt={alt}
        fetchPriority="high"
        loading="eager"
        {...comun}
      />
    );
  if (modo === "lazy")
    return <img src={src} alt={alt} loading="lazy" {...comun} />;
  return <img data-b-src={src} alt={alt} {...comun} />;
  /* eslint-enable @next/next/no-img-element */
}

/** La cabeza de una sección numerada: el número grande, la ceja, el título y la entrada. */
export function Cabeza({
  s,
  titulo,
  intro,
}: {
  s: Seccion;
  titulo: string;
  intro?: string;
}) {
  return (
    <div className="sec-cabeza aparece" data-motion="">
      <span className="sec-num" aria-hidden="true">
        {s.n}
      </span>
      <div>
        {s.corto && s.corto !== titulo ? (
          <span className="sec-ceja">
            {s.n} · {s.corto}
          </span>
        ) : null}
        <h2>
          <span className="sr">{s.n} · </span>
          {titulo}
        </h2>
      </div>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}
