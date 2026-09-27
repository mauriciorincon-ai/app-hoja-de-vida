import { STAGGER_S } from "./easings";

/**
 * Contenedor de entradas escalonadas (spec: stagger 80ms entre hermanos).
 * Los hijos se marcan con <StaggerItem>; heredan la orquestación del padre.
 *
 * Desde el 2026-09-27 (ADR-027) son componentes de SERVIDOR: el grupo escribe
 * `data-reveal-group` con su escalón y su retraso, cada ítem `data-reveal-item`
 * con su variante, y `Revelador` reparte los retrasos (`retrasos.ts`) y marca
 * `data-visto` cuando el grupo asoma un 20 %. El CSS de globals.css hace el
 * resto. Los números son los medidos sobre la versión anterior.
 *
 * Revisión post-S8 (2026-09-12): el escalón y la etiqueta son parámetros.
 * `stagger` porque Estudios y Certificaciones piden una entrada «leve, más
 * marcada y lenta» (140 ms) y Skills una más rápida (120 ms) que la de 80 ms;
 * `as` porque la vitrina asomada escalona sus cajas dentro de un `<ul>`, y un
 * `<div>` entre `<ul>` y `<li>` es HTML inválido.
 */
// `ol` desde 2026-09-24: los capítulos de un caso de estudio son una secuencia
// numerada, y su número es parte del sentido, no decoración.
type Etiqueta = "div" | "ul" | "ol" | "li";

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = STAGGER_S,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Segundos entre hermanos (default: los 80 ms del sistema). */
  stagger?: number;
  as?: Etiqueta;
}) {
  const Tag = as;
  return (
    <Tag
      data-motion=""
      data-reveal-group=""
      data-umbral={0.2}
      data-stagger={stagger}
      data-delay={delay || undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

export type StaggerVariant =
  "fadeInUp" | "scaleInBlur" | "fadeInSlow" | "liftIn";

/**
 * Un ítem que ORQUESTA a los ítems que contiene (post-S8, Skills): sus hijos
 * con variante arrancan `delay` segundos después que él y con `escalon`
 * segundos entre ellos — aunque haya `<div>` planos en medio. La cabecera y
 * los chips de una tarjeta van en una sola cuenta, en orden del DOM (medido).
 */
export function StaggerItem({
  children,
  className,
  variant = "fadeInUp",
  as = "div",
  hijos,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: StaggerVariant;
  as?: Etiqueta;
  hijos?: { delay: number; escalon: number };
}) {
  const Tag = as;
  return (
    <Tag
      data-motion=""
      data-reveal-item={variant}
      data-hijos={hijos ? `${hijos.delay},${hijos.escalon}` : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
