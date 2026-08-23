import Image from "next/image";

/**
 * LA PANTALLA REAL de cada tarjeta de «qué hace».
 *
 * Banco de técnicas §7 (enmienda kit v1.23.0): **si la pieza enseña LA APP,
 * son capturas de la app CORRIENDO o no va.** Estas salieron de
 * `scripts/capturas-vitrina.mjs`, que levanta cada app hermana y conduce su
 * UI con datos sintéticos — re-ejecutable, y por eso verificable.
 *
 * Dónde van (decisión del usuario en el gate M1): **dentro de cada tarjeta**,
 * al lado de las funcionalidades de su grupo — la captura enseña exactamente
 * lo que ese grupo cuenta. La portada de la ficha conserva la tira
 * esquemática, que habla el lenguaje de esta página.
 *
 * El mapeo grupo→pantalla no viaja en el `brochure-export.json` (el contrato
 * v1.0.0 no tiene campo de capturas), así que vive aquí junto a los archivos
 * que nombra. Un grupo sin pantalla propia simplemente no lleva figura —
 * jamás un relleno.
 *
 * A11y: la captura es ILUSTRACIÓN (`alt=""`); el sentido lo cargan el rótulo
 * y el pie visibles debajo.
 */

type Captura = { archivo: string; rotulo: string };

/** 1024×640 a DPR 1.5 — APAISADAS (decisión del usuario en el gate M1). */
const ANCHO = 1536;
const ALTO = 960;

/** slug de la app → orden del grupo → su pantalla. */
const CAPTURAS: Record<string, Record<number, Captura>> = {
  habla: {
    1: { archivo: "habla-hoy.webp", rotulo: "La cápsula de hoy" },
    2: { archivo: "habla-jugar.webp", rotulo: "Los juegos de voz" },
    3: { archivo: "habla-estudio.webp", rotulo: "El estudio de la familia" },
    4: { archivo: "habla-objetivo.webp", rotulo: "El objetivo de la semana" },
    // El rumbo sale VACÍO a propósito: es la pantalla real antes de jugar.
    5: { archivo: "habla-rumbo.webp", rotulo: "El rumbo" },
    6: { archivo: "habla-ajustes.webp", rotulo: "Ajustes y privacidad" },
    // 7 y 8 (la promesa de privacidad · qué mide) no son pantallas: son
    // compromisos que atraviesan toda la app. Sin captura, sin relleno.
  },
};

export function CapturaGrupo({
  slug,
  orden,
  pie,
}: {
  slug: string;
  orden: number;
  pie: string;
}) {
  const captura = CAPTURAS[slug]?.[orden];
  if (!captura) return null;

  return (
    <figure className="escalona m-0">
      {/* A LO ANCHO de la tarjeta: la pantalla apaisada es el banner del
          grupo, y las funcionalidades se leen debajo de lo que ya se vio. */}
      <div className="marco-captura">
        <Image
          src={`/vitrina/${captura.archivo}`}
          alt=""
          width={ANCHO}
          height={ALTO}
          sizes="(min-width: 896px) 720px, 100vw"
          /* Perezosa siempre: nace dentro de una tarjeta plegada, bajo el
             pliegue — cargarla ansiosa pagaría peso por algo aún invisible. */
          loading="lazy"
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="mt-2 flex flex-wrap items-baseline gap-x-2 text-[12px] leading-snug text-ink-2">
        <span className="font-mono text-[10px] tracking-[0.06em] uppercase">
          {captura.rotulo}
        </span>
        <span>· {pie}</span>
      </figcaption>
    </figure>
  );
}
