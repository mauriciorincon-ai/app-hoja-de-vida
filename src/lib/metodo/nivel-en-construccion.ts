/**
 * EL NIVEL DE LO QUE SE ESTÁ CONSTRUYENDO (S17, 2026-10-21). Motor puro.
 *
 * El corpus dice del sistema de gestión de IA de la Fundación CTIC que está «en
 * estructuración»: más de 20 instrumentos, un tercio terminados, sin certificación.
 * Rotularlo «Uso real» sube su nivel (el S16 lo hizo y la auditoría lo anotó como
 * deuda). Desde el S17 el esquema tiene el nivel `en-construccion`, y este motor
 * exige que toda tarjeta de Evidencia que cite `fundacion-ctic` y hable del
 * sistema de gestión lo lleve, en cualquier pieza de `data/metodo/`.
 *
 * Es a propósito estrecho: solo la tarjeta que habla del SISTEMA DE GESTIÓN de CTIC.
 * La cartera de iniciativas o los productos analíticos de CTIC siguen con el nivel
 * que el corpus les da, y lo que otro proyecto dice de un sistema de gestión no se
 * juzga (el documento citado manda). Lo demás lo lee quien audita.
 */

import { cadenasConRuta } from "./voz-impersonal";

const SISTEMA_DE_GESTION = /sistema de gesti[oó]n|management system/i;

type Tarjeta = {
  nombre?: unknown;
  texto?: unknown;
  nivel?: unknown;
  corpus?: unknown;
};

const esObjeto = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

/** Las tarjetas del bloque 8 de una pieza, con su posición para nombrarlas. */
function tarjetasDeEvidencia(
  pieza: unknown,
): { n: number; tarjeta: Tarjeta }[] {
  if (!esObjeto(pieza) || !Array.isArray(pieza.bloques)) return [];
  const bloque8 = pieza.bloques.find((b) => esObjeto(b) && b.n === 8);
  if (!esObjeto(bloque8) || !Array.isArray(bloque8.evidencia)) return [];
  return bloque8.evidencia.flatMap((t, i) =>
    esObjeto(t) ? [{ n: i + 1, tarjeta: t as Tarjeta }] : [],
  );
}

/** Todas las cadenas de un valor (`{ es, en }` o texto suelto), juntas, para buscar en ellas. */
const textoPlano = (valor: unknown): string =>
  cadenasConRuta(valor)
    .map((c) => c.texto)
    .join(" ");

export function problemasDeNivelDelSistemaDeGestion(
  archivo: string,
  pieza: unknown,
): string[] {
  return tarjetasDeEvidencia(pieza).flatMap(({ n, tarjeta }) => {
    const corpus = Array.isArray(tarjeta.corpus) ? tarjeta.corpus : [];
    if (!corpus.includes("fundacion-ctic")) return [];
    if (
      !SISTEMA_DE_GESTION.test(
        `${textoPlano(tarjeta.nombre)} ${textoPlano(tarjeta.texto)}`,
      )
    )
      return [];
    if (tarjeta.nivel === "en-construccion") return [];
    return [
      `${archivo}: bloque 8, evidencia ${n}: habla del sistema de gestión de la Fundación CTIC con nivel «${String(tarjeta.nivel)}» — el corpus lo describe en estructuración: nivel «en-construccion»`,
    ];
  });
}
