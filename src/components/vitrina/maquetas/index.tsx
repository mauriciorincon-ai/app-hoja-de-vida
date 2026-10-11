import { MaquetaAnonimizador } from "./anonimizador";
import { MaquetaBigD } from "./big-d";
import { MaquetaCopilotoConsultor } from "./copiloto-consultor";
import { MaquetaDash } from "./dash-agent-ai";
import { MaquetaDs } from "./ds";
import { MaquetaHabla } from "./habla";
import { MaquetaHackguard } from "./hackguard";
import { MaquetaInmobiliaria } from "./inmobiliaria";
import { MaquetaNutriKids } from "./nutri-kids";
import { MaquetaPlanlang } from "./planlang";

/**
 * Tiras de la vitrina (S5) — la muestra de la PORTADA de cada ficha.
 *
 * Son **esquemáticas a propósito: no fingen ser una captura** (banco §7,
 * enmienda kit v1.23.0). Dibujan las IDEAS de cada app con los tokens de CV
 * Viva, para que todas las fichas se vean de la misma casa. Las pantallas
 * REALES de cada app viven dentro de las tarjetas de «qué hace».
 *
 * Gramática común: viewBox 320×92 · cuatro columnas de 80 centradas en
 * 40·120·200·280 · dibujo arriba, rótulo mono debajo · trazos de 1.5.
 *
 * Si una app aún no tiene tira, la muestra no pinta ni la tira ni su marco —
 * jamás un placeholder que finja ser la app— y `tests/unit/maquetas.test.tsx`
 * falla nombrándola: toda app con export entra con su dibujo (el 2026-10-11
 * cuatro entraron sin él y el marco quedó como una caja vacía).
 */
const MAQUETAS: Record<string, () => React.ReactElement> = {
  habla: MaquetaHabla,
  anonimizador: MaquetaAnonimizador,
  "dash-agent-ai": MaquetaDash,
  ds: MaquetaDs,
  "nutri-kids": MaquetaNutriKids,
  inmobiliaria: MaquetaInmobiliaria,
  "copiloto-consultor": MaquetaCopilotoConsultor,
  planlang: MaquetaPlanlang,
  "big-d": MaquetaBigD,
  hackguard: MaquetaHackguard,
};

export function Maqueta({ slug }: { slug: string }) {
  const Dibujo = MAQUETAS[slug];
  if (!Dibujo) return null;
  return <Dibujo />;
}

export function tieneMaqueta(slug: string): boolean {
  return slug in MAQUETAS;
}
