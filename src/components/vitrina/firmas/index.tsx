import { FirmaHabla } from "./habla";

/**
 * FIRMAS de la vitrina (S5, gate M1): la escena CLÍMAX del brochure de cada
 * app, re-dibujada en los tokens de CV Viva. Seis fichas, seis momentos
 * visuales distintos — reconstruidos del trabajo original de cada brochure,
 * jamás fotografiados ni recoloreados.
 *
 * Cada firma vive en LA TARJETA cuyo mensaje es el del clímax (en habla, el
 * grupo 7 «La promesa mayor» ES «lo que pasa adentro, muere adentro»). El
 * mapeo se declara aquí porque el `brochure-export.json` v1.0.0 no transporta
 * material visual — mismo caso que los iconos y las capturas.
 *
 * Una app sin firma todavía simplemente no la pinta — jamás un relleno.
 */
const FIRMAS: Record<
  string,
  { orden: number; Dibujo: () => React.ReactElement }
> = {
  habla: { orden: 7, Dibujo: FirmaHabla },
};

export function FirmaGrupo({
  slug,
  orden,
  pie,
}: {
  slug: string;
  orden: number;
  pie: string;
}) {
  const firma = FIRMAS[slug];
  if (!firma || firma.orden !== orden) return null;
  const { Dibujo } = firma;

  return (
    <figure className="escalona m-0">
      <div className="rounded-[10px] border border-paper-2 bg-paper-1 p-4">
        <Dibujo />
      </div>
      <figcaption className="mt-2 text-[12px] leading-snug text-ink-2">
        {pie}
      </figcaption>
    </figure>
  );
}
