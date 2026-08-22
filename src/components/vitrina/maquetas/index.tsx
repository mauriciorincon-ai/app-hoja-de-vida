import { MaquetaHabla } from "./habla";

/**
 * Muestras de la vitrina (S5). Cada app tiene su propia representación visual;
 * el despachador la elige por slug. Si una app aún no tiene muestra, la ficha
 * simplemente no la pinta — jamás un placeholder que finja ser la app.
 *
 * ⚠ Pendiente de la decisión del usuario (gate M1): el banco de técnicas §7
 * exige capturas de la app CORRIENDO cuando la sección enseña LA APP, y reserva
 * el SVG con tokens para ilustraciones abstractas. Mientras se resuelve, solo
 * habla tiene muestra y sirve de candidata para la mirada.
 */
const MAQUETAS: Record<string, () => React.ReactElement> = {
  habla: MaquetaHabla,
};

export function Maqueta({ slug }: { slug: string }) {
  const Dibujo = MAQUETAS[slug];
  if (!Dibujo) return null;
  return <Dibujo />;
}

export function tieneMaqueta(slug: string): boolean {
  return slug in MAQUETAS;
}
