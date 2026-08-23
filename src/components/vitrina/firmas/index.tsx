import { FirmaAnonimizador } from "./anonimizador";
import { FirmaDash } from "./dash-agent-ai";
import { FirmaDs } from "./ds";
import { FirmaHabla } from "./habla";
import { FirmaInmobiliaria } from "./inmobiliaria";
import { FirmaNutriKids } from "./nutri-kids";

/**
 * FIRMAS de la vitrina (S5, gate M1): la escena CLÍMAX del brochure de cada
 * app, re-dibujada en los tokens de CV Viva. Seis fichas, seis momentos
 * visuales distintos — reconstruidos del trabajo original de cada brochure,
 * jamás fotografiados ni recoloreados (decisión explícita del usuario).
 *
 * Cada firma vive en LA TARJETA cuyo mensaje es el del clímax. El mapeo se
 * declara aquí porque el `brochure-export.json` v1.0.0 no transporta material
 * visual — mismo caso que los iconos y las capturas.
 *
 * Una app sin firma todavía simplemente no la pinta — jamás un relleno.
 */
const FIRMAS: Record<
  string,
  { orden: number; Dibujo: () => React.ReactElement }
> = {
  // «La promesa mayor»: lo que pasa adentro, muere adentro.
  habla: { orden: 7, Dibujo: FirmaHabla },
  // «Entrega, recupera, deja constancia»: el viaje completo, de ida y vuelta.
  anonimizador: { orden: 5, Dibujo: FirmaAnonimizador },
  // «Lo que saben de ti»: y si sigue siendo cierto.
  "dash-agent-ai": { orden: 1, Dibujo: FirmaDash },
  // «El veredicto honesto»: la pantalla que ninguna herramienta enseña.
  ds: { orden: 1, Dibujo: FirmaDs },
  // «El día de hoy»: aquí nadie califica a tu hijo.
  "nutri-kids": { orden: 2, Dibujo: FirmaNutriKids },
  // «Confianza y quién opera»: nada se declara, todo se comprueba.
  inmobiliaria: { orden: 4, Dibujo: FirmaInmobiliaria },
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
