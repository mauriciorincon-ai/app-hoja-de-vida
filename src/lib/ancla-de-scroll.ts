/**
 * EL CAMBIO DE IDIOMA TE DEJA EXACTAMENTE DONDE ESTABAS (revisión post-S8,
 * bloque B, 2026-09-13). El dueño: «no que reiniciara, no que se moviera, no
 * que se adelantara: exactamente donde estoy, simplemente cambio el idioma».
 *
 * Conservar el `#hash` no bastaba: el hash lleva al BORDE de una sección, y
 * en Perfil o Trayectoria uno suele estar a media sección. Y conservar los
 * píxeles tampoco: el inglés es más corto que el español, así que el mismo
 * scrollY cae en otro sitio. Lo que se conserva es un ANCLA DE CONTENIDO: el
 * último hito estructural (sección, artículo, título, año del índice) que ya
 * pasó por el borde superior de la ventana, y a cuántos píxeles de él está el
 * borde. Los dos idiomas tienen la misma estructura (paridad ES/EN vigilada
 * en `content.test.ts`), así que el hito N-ésimo es el mismo hito en ambos.
 *
 * El motor (`medirAncla`, `resolverAncla`) es puro y se prueba en unit; los
 * dos accesos al DOM (`guardarAncla`, `restaurarAncla`) son delgados.
 */
export const SELECTOR_ANCLAS =
  "main section[id], main article, main h2, main h3, main [data-timeline-anio]";

export const CLAVE_ANCLA = "cv-viva:ancla-idioma";

export type Ancla = {
  /** Índice del hito en la lista de candidatos, en orden de documento. */
  indice: number;
  /** Píxeles entre el borde superior del hito y el borde de la ventana. */
  desfase: number;
  /** Respaldo: el scrollY tal cual, por si el hito no existe al otro lado. */
  y: number;
};

/**
 * Elige el ancla: el último candidato cuyo borde superior ya pasó (o toca) el
 * borde superior de la ventana. `tops` son posiciones absolutas en el
 * documento, en orden. Sin candidato por encima, el ancla es el propio scrollY.
 */
export function medirAncla(scrollY: number, tops: number[]): Ancla {
  let indice = -1;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= scrollY + 1) indice = i;
    else break;
  }
  return {
    indice,
    desfase: indice === -1 ? scrollY : scrollY - tops[indice],
    y: scrollY,
  };
}

/** El scrollY que reproduce el ancla sobre una lista nueva de candidatos. */
export function resolverAncla(ancla: Ancla, tops: number[]): number {
  if (ancla.indice < 0 || ancla.indice >= tops.length) return ancla.y;
  return Math.max(0, tops[ancla.indice] + ancla.desfase);
}

function tops(): number[] {
  return Array.from(document.querySelectorAll(SELECTOR_ANCLAS)).map(
    (el) => el.getBoundingClientRect().top + window.scrollY,
  );
}

/** Antes de navegar al otro idioma: mide y guarda el ancla en sessionStorage. */
export function guardarAncla(): void {
  try {
    sessionStorage.setItem(
      CLAVE_ANCLA,
      JSON.stringify(medirAncla(window.scrollY, tops())),
    );
  } catch {
    // Sin sessionStorage (modo privado estricto) el cambio de idioma sigue
    // funcionando; solo no conserva la posición.
  }
}

/**
 * Tras renderizar el otro idioma: si hay ancla guardada, la consume y coloca
 * la ventana. Devuelve true si movió algo (para el test y para depurar).
 */
export function restaurarAncla(): boolean {
  let crudo: string | null = null;
  try {
    crudo = sessionStorage.getItem(CLAVE_ANCLA);
    if (crudo) sessionStorage.removeItem(CLAVE_ANCLA);
  } catch {
    return false;
  }
  if (!crudo) return false;
  const ancla = JSON.parse(crudo) as Ancla;
  window.scrollTo({ top: resolverAncla(ancla, tops()), behavior: "instant" });
  return true;
}
