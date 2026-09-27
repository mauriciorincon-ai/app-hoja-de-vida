/**
 * El modelo de retrasos de un grupo escalonado (2026-09-27, ADR-027).
 *
 * Reproduce, medido con Playwright sobre la versión con la librería (bitácora
 * `REV-2026-09-27-motion-sin-libreria`), cómo se repartían los arranques:
 *
 *  - Los ítems directos de un `Stagger` arrancan a `delay + stagger × i`.
 *  - Un ítem con `hijos` (la tarjeta de Skills) ORQUESTA a los ítems que
 *    contiene: arrancan a `su propio retraso + hijos.delay + hijos.escalon ×
 *    j`, con la cabecera y los chips en una sola cuenta, en orden del DOM.
 *  - Un ítem con `data-retraso` trae su retraso ABSOLUTO desde el disparo del
 *    grupo, inline en `--reveal-delay` (el pulso de las cifras, el trazo de
 *    los iconos), y no ocupa turno en ninguna cuenta.
 *
 * Es una función pura sobre el DOM, sin React: la prueba unitaria la corre en
 * jsdom y la pone en rojo cambiando una regla.
 */
type Orquesta = { delay: number; escalon: number; turno: number };

const numero = (el: Element, atributo: string, porDefecto = 0) => {
  const v = el.getAttribute(atributo);
  return v === null || v === "" ? porDefecto : Number(v);
};

export function calcularRetrasos(grupo: Element): void {
  const orquestas = new Map<Element, Orquesta>([
    [
      grupo,
      {
        delay: numero(grupo, "data-delay"),
        escalon: numero(grupo, "data-stagger"),
        turno: 0,
      },
    ],
  ]);
  const arranques = new Map<Element, number>([[grupo, 0]]);

  for (const item of grupo.querySelectorAll<HTMLElement>(
    "[data-reveal-item]",
  )) {
    if (item.hasAttribute("data-retraso")) continue;

    let orquestador: Element | null = item.parentElement;
    while (
      orquestador &&
      orquestador !== grupo &&
      !orquestas.has(orquestador)
    ) {
      orquestador = orquestador.parentElement;
    }
    const quien = orquestador ?? grupo;
    const o = orquestas.get(quien)!;
    const retraso =
      (arranques.get(quien) ?? 0) + o.delay + o.escalon * o.turno++;
    arranques.set(item, retraso);
    item.style.setProperty("--reveal-delay", `${+retraso.toFixed(3)}s`);

    const hijos = item.getAttribute("data-hijos");
    if (hijos) {
      const [delay, escalon] = hijos.split(",").map(Number);
      orquestas.set(item, { delay, escalon, turno: 0 });
    }
  }
}
