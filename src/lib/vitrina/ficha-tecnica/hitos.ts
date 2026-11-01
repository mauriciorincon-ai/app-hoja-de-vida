import type { BrochureExport } from "../schemas";

/**
 * «DÓNDE ESTÁ» (S30): los hitos de una app, de su export. Los usa la ficha técnica (`armar.ts`) y el
 * cierre «Úsala» del brochure (la casa también lo tiene: su export trae `app` y métricas). Puro.
 *
 * Las etiquetas son CLAVES (`ciclo` · `sprints` · `sellada` · `construccion` · `version` ·
 * `decisiones`): el componente las traduce con `HITOS_CONOCIDOS`; una ficha externa puede traer texto
 * libre y se pinta tal cual.
 */
export type Hito = { valor: string; etiqueta: string };

export const HITOS_CONOCIDOS: ReadonlySet<string> = new Set([
  "ciclo",
  "sprints",
  "sellada",
  "construccion",
  "version",
  "decisiones",
]);

export function hitosDe(exp: Pick<BrochureExport, "app" | "metricas">): Hito[] {
  const { app } = exp;
  const hitos: Hito[] = [
    { valor: app.ciclo, etiqueta: "ciclo" },
    { valor: String(app.sprints_cerrados), etiqueta: "sprints" },
    app.sellado_en
      ? { valor: app.sellado_en, etiqueta: "sellada" }
      : { valor: "—", etiqueta: "construccion" },
    { valor: `v${app.version_repo}`, etiqueta: "version" },
  ];
  const decisiones = exp.metricas.find(
    (m) => m.clave === "decisiones_registradas",
  );
  // La CLAVE del hito, no su texto: el renderizador traduce las etiquetas que conoce y cae al literal
  // para las que no. Con «decisiones registradas» aquí nunca coincidía, y las fichas en inglés
  // enseñaban esas dos palabras en español.
  if (decisiones)
    hitos.push({ valor: String(decisiones.valor), etiqueta: "decisiones" });
  return hitos;
}
