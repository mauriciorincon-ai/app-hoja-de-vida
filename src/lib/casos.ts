import type { Cv } from "./schemas";

/**
 * Motor puro de los casos de estudio (revisión 2026-09-24): lo que la página
 * necesita saber de un caso y que no vive en el caso mismo — su hito en la
 * trayectoria y sus vecinos. Sin side-effects, probado en
 * `tests/unit/casos-de-estudio.test.ts`.
 */

type Proyecto = Cv["proyectos"][number];
type Hito = Cv["trayectoria"][number];

/**
 * El nombre de un proyecto sigue la forma «Qué se hizo — Dónde (cuándo)». El
 * visitante reconoce un caso por el DÓNDE («Vesting», «Banco Pichincha»).
 * Gemela de `nombreCortoDeProyecto` en `scripts/destinos.mjs`, que pinta el
 * chip del chat; un test exige que las dos digan lo mismo para todo el CV.
 */
export function nombreCortoDeProyecto(nombre: string): string {
  const partes = nombre.split(" — ");
  const donde = (partes.length > 1 ? partes[partes.length - 1] : partes[0])
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
  return donde || nombre;
}

/** «2023 — 2025» → «2023»; «2025 — hoy» → «2025». Sin año, el texto tal cual. */
export function anioDe(periodo: string): string {
  return /\d{4}/.exec(periodo)?.[0] ?? periodo;
}

/**
 * El periodo que muestra la línea de tiempo de la HOME: el real, salvo que el
 * hito declare `periodoEnLaHome` para que el año de transición no se repita.
 */
export function periodoEnLaHome(h: Hito): string {
  return h.periodoEnLaHome ?? h.periodo;
}

/** El hito de la trayectoria que apunta a este caso, si lo hay. */
export function hitoDeCaso(cv: Cv, slug: string): Hito | undefined {
  return cv.trayectoria.find((h) => h.proyecto === slug);
}

export type Vecino = { slug: string; nombreCorto: string; periodo: string };

/**
 * El caso anterior y el siguiente, en el orden de la trayectoria (del más
 * reciente al más antiguo): leer los casos seguidos es leer la carrera.
 */
export function vecinosDeCaso(
  cv: Cv,
  slug: string,
): { anterior?: Vecino; siguiente?: Vecino } {
  const conCaso = new Map<string, Proyecto>(
    cv.proyectos.filter((p) => p.casestudy).map((p) => [p.slug, p]),
  );
  const orden = cv.trayectoria
    .filter((h) => h.proyecto && conCaso.has(h.proyecto))
    .map((h) => ({ slug: h.proyecto as string, periodo: h.periodo }));
  const i = orden.findIndex((o) => o.slug === slug);
  if (i === -1) return {};
  const vecino = (j: number): Vecino | undefined => {
    const o = orden[j];
    if (!o) return undefined;
    return {
      slug: o.slug,
      nombreCorto: nombreCortoDeProyecto(conCaso.get(o.slug)!.nombre),
      periodo: o.periodo,
    };
  };
  return { anterior: vecino(i - 1), siguiente: vecino(i + 1) };
}
