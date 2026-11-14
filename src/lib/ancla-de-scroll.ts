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
 * Elige el ancla: de los candidatos cuyo borde superior ya pasó (o toca) el
 * borde superior de la ventana, el MÁS CERCANO a él. `tops` son posiciones
 * absolutas en el documento, en orden de documento. Sin candidato por encima,
 * el ancla es el propio scrollY.
 *
 * No se corta en el primer candidato que está por debajo (2026-09-26): el año
 * del índice de la trayectoria es `sticky` y se queda a media pantalla, así
 * que su top NO sigue el orden del documento. Con el corte, en móvil el ancla
 * caía siempre en el título «Trayectoria» y el hito que uno estaba leyendo se
 * corría al cambiar de idioma: 42 a 87 px, más cuanto más abajo.
 */
export function medirAncla(scrollY: number, tops: number[]): Ancla {
  let indice = -1;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= scrollY + 1 && (indice === -1 || tops[i] >= tops[indice])) {
      indice = i;
    }
  }
  return {
    indice,
    desfase: indice === -1 ? scrollY : scrollY - tops[indice],
    y: scrollY,
  };
}

/**
 * El destino, a un píxel entero. Los bordes de los hitos son fraccionarios
 * (1/64 de píxel) y el desfase guardado también; WebKit TRUNCA un `scrollTo`
 * fraccionario en vez de redondearlo, así que 1559,84 caía en 1559. Con un
 * píxel menos en cada ida y vuelta, diez cambios de idioma en Safari bajaban la
 * página 5 px (S23, OM-05: «cada vez baja un poco, y pulsando muchas veces
 * llega al final»). Redondeado al más cercano, el error de un cambio no se suma
 * al del siguiente: Chromium ya lo hacía así y no derivaba.
 */
export function aPixelEntero(y: number): number {
  return Math.round(y);
}

/**
 * Las posiciones de los hitos, a píxel entero. Con el borde en x,5 y el destino
 * redondeado, el desfase quedaba en x,5 también y cada ida y vuelta entre dos
 * idiomas subía un píxel (1508,5 y 1584,0: +1 por vuelta). Con el borde ya
 * entero, el desfase y el destino son enteros y la vuelta cae donde salió.
 */
export function posicionesEnteras(tops: number[]): number[] {
  return tops.map(aPixelEntero);
}

/** El scrollY que reproduce el ancla sobre una lista nueva de candidatos. */
export function resolverAncla(ancla: Ancla, tops: number[]): number {
  if (ancla.indice < 0 || ancla.indice >= tops.length) return ancla.y;
  return Math.max(0, tops[ancla.indice] + ancla.desfase);
}

/**
 * El borde superior del hito en el documento, por su posición de LAYOUT (`offsetTop` sumado hasta el
 * `body`), no por `getBoundingClientRect`. En el primer cuadro del otro idioma todas las entradas
 * animadas están en su estado inicial, desplazadas 28 a 70 px hacia abajo, y el rectángulo del hito las
 * incluye: la ventana se colocaba esos píxeles más abajo y el cambio siguiente partía de ese punto ya
 * corrido, así que en cada ida y vuelta la página bajaba otro poco (el dueño, S29: «el inglés y el
 * español hacen que la página vaya bajando»; −51 px por vuelta en el celular, en Estudios). El layout
 * no sabe de transformaciones. Lo que se resta al guardar y se suma al restaurar es la misma medida,
 * así que su sesgo (los bordes de los padres posicionados) se cancela.
 */
function topDeLayout(el: Element): number {
  if (!(el instanceof HTMLElement)) {
    return el.getBoundingClientRect().top + window.scrollY;
  }
  let y = 0;
  for (
    let n: HTMLElement | null = el;
    n;
    n = n.offsetParent as HTMLElement | null
  ) {
    y += n.offsetTop;
  }
  return y;
}

function tops(): number[] {
  return posicionesEnteras(
    Array.from(document.querySelectorAll(SELECTOR_ANCLAS))
      // Un hito sin caja no es un hito (S29): la lista de Skills queda oculta (`display:none`) detrás
      // del explorador, y el borde de un elemento sin caja «está» en el scroll actual, así que se
      // quedaba con el ancla y el cambio de idioma no movía nada.
      .filter((el) => el.getClientRects().length > 0)
      // La lista de Skills solo tiene caja con «Ver todo en lista» puesto, y esa vista no sobrevive al
      // cambio de idioma (la home se monta de nuevo en «Áreas»): sus 18 hitos existirían de un lado y
      // no del otro, y el índice del ancla caería 18 hitos más abajo. No son candidatos.
      .filter((el) => !el.closest("[data-skills] .lista"))
      .map(topDeLayout),
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
  const colocar = () => {
    const destino = aPixelEntero(resolverAncla(ancla, tops()));
    if (Math.abs(window.scrollY - destino) >= 1)
      window.scrollTo({ top: destino, behavior: "instant" });
  };
  colocar();
  sostenerAncla(colocar);
  return true;
}

/** El ancla se suelta cuando el documento lleva este lapso sin cambiar de alto. */
export const QUIETA_MS = 500;
/** Tope: pase lo que pase, el ancla se suelta a este tiempo. */
export const SOSTENER_MAX_MS = 5000;

/**
 * El ancla se SOSTIENE mientras el otro idioma se asienta (PR #115, 2026-11-14). Restaurarla una
 * sola vez, en el primer cuadro, dependía de que nada de arriba cambiara de alto después. Con el
 * JavaScript del lote de dependencias de noviembre, en WebKit de Linux sí cambiaba: los logos de
 * Estudios y Certificaciones (alto fijo, ancho `auto`, carga diferida) llegan tarde, su ancho real
 * reparte de nuevo el texto de su tarjeta y la ventana quedaba 8 a 29 px corrida (e2e
 * `idioma.spec.ts`, «a media #estudios» y «#certificaciones»). Un plazo fijo (1,5 s) no bastó en la
 * CI. El invariante: cada vez que el documento cambia de alto se vuelve a colocar la misma ancla, y
 * se suelta cuando lleva `QUIETA_MS` quieto (tope `SOSTENER_MAX_MS`). El primer gesto del
 * visitante (rueda, toque, tecla, puntero) la suelta antes: jamás se pelea con quien se desplaza.
 */
function sostenerAncla(colocar: () => void): void {
  if (typeof ResizeObserver === "undefined") return;
  const gestos = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  let quieta: ReturnType<typeof setTimeout> | undefined;
  const ro = new ResizeObserver(() => {
    colocar();
    clearTimeout(quieta);
    quieta = setTimeout(soltar, QUIETA_MS);
  });
  // `soltar` corre siempre después de que `tope` existe: lo llaman los relojes o un gesto.
  const soltar = () => {
    ro.disconnect();
    clearTimeout(quieta);
    clearTimeout(tope);
    for (const g of gestos) window.removeEventListener(g, soltar);
  };
  const tope = setTimeout(soltar, SOSTENER_MAX_MS);
  quieta = setTimeout(soltar, QUIETA_MS);
  for (const g of gestos)
    window.addEventListener(g, soltar, { passive: true, once: true });
  ro.observe(document.body);
}
