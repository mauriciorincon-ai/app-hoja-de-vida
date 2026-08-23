import Image from "next/image";

/**
 * LAS PANTALLAS REALES de cada app hermana.
 *
 * Banco de técnicas §7 (enmienda kit v1.23.0): **si la pieza enseña LA APP,
 * son capturas de la app CORRIENDO o no va.** Estas salieron de
 * `scripts/capturas-vitrina.mjs`, que levanta cada app y conduce su UI con
 * datos sintéticos — re-ejecutable, y por eso verificable: nadie tiene que
 * creerme que la pantalla es así.
 *
 * Los rótulos NO viajan en el `brochure-export.json` (el contrato no tiene
 * campo de capturas), así que viven aquí junto al archivo que nombran.
 *
 * A11y: la captura es ILUSTRACIÓN (`alt=""`) y el sentido lo carga el rótulo
 * visible debajo — repetirlo en el `alt` haría que un lector de pantalla lo
 * dijera dos veces.
 */

type Captura = { archivo: string; rotulo: string };

/** 390×844 a DPR 2 — el tamaño en que se fotografían (móvil primero). */
const ANCHO = 780;
const ALTO = 1688;

const CAPTURAS: Record<string, Captura[]> = {
  habla: [
    { archivo: "habla-hoy.webp", rotulo: "La cápsula de hoy" },
    { archivo: "habla-jugar.webp", rotulo: "Los juegos de voz" },
    { archivo: "habla-objetivo.webp", rotulo: "El objetivo de la semana" },
  ],
};

export function tieneCapturas(slug: string): boolean {
  return (CAPTURAS[slug]?.length ?? 0) > 0;
}

export function Capturas({
  slug,
  pie,
  etiqueta,
}: {
  slug: string;
  pie: string;
  etiqueta: string;
}) {
  const capturas = CAPTURAS[slug];
  if (!capturas) return null;

  return (
    <figure className="m-0">
      {/* En móvil la tira se arrastra: nunca empuja el ancho de la página.
          `tabIndex` + nombre accesible porque una región que se desplaza TIENE
          que alcanzarse con el teclado — si no, quien no usa ratón ni dedo se
          queda sin ver la segunda y la tercera pantalla (lo cazó axe en el
          viewport móvil, donde la tira sí desborda). */}
      <ul
        tabIndex={0}
        aria-label={etiqueta}
        className="tira-capturas flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-ink"
      >
        {capturas.map((c, i) => (
          // En escritorio caben tres holgadas; en móvil se arrastran.
          <li
            key={c.archivo}
            className="w-[168px] shrink-0 snap-start sm:w-[228px]"
          >
            <div className="marco-captura">
              <Image
                src={`/vitrina/${c.archivo}`}
                alt=""
                width={ANCHO}
                height={ALTO}
                sizes="(min-width: 640px) 228px, 168px"
                /* La primera entra ansiosa: es la que se ve al abrir la ficha
                   y una imagen que aparece tarde se lee como página rota. Las
                   demás, perezosas — el presupuesto de la ruta manda. */
                loading={i === 0 ? "eager" : "lazy"}
                className="block h-auto w-full"
              />
            </div>
            <p className="mt-2 text-center font-mono text-[10px] tracking-[0.06em] text-ink-2 uppercase">
              {c.rotulo}
            </p>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 text-[13px] leading-relaxed text-ink-2">
        {pie}
      </figcaption>
    </figure>
  );
}
