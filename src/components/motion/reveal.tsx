/**
 * Primitivas de entrada de la referencia destilada (motion-vocabulary.md §1),
 * con sus números exactos — desde el 2026-09-27 en CSS (ADR-027): esto es un
 * componente de SERVIDOR que escribe `data-reveal="<variante>"`, y el estado
 * oculto, la transición y su curva viven en globals.css. `Revelador` marca
 * `data-visto` cuando el bloque entra a pantalla. Regla dura: el contenido
 * SIEMPRE está en el HTML; con `prefers-reduced-motion` el cinturón CSS lo
 * deja en su estado final, y sin JavaScript también (`<noscript>` del layout).
 */
export type RevealVariant =
  "fadeInUp" | "blurIn" | "scaleInBlur" | "maskReveal";

type RevealProps = {
  children: React.ReactNode;
  variant?: RevealVariant;
  /** Segundos antes de arrancar. */
  delay?: number;
  className?: string;
  /**
   * Fracción del bloque que debe entrar en pantalla para revelar (default 0.25).
   * **Trampa (kit v1.23.0):** un bloque MÁS ALTO que el viewport jamás alcanza un
   * umbral porcentual y se queda invisible para siempre — con la CI en verde,
   * porque el contenido sí está en el HTML. Todo bloque que pueda superar la
   * altura de pantalla (fichas de la vitrina, secciones largas) pasa `"some"`,
   * que revela en cuanto asoma un pixel.
   */
  amount?: number | "some" | "all";
};

export const umbralDe = (amount: number | "some" | "all") =>
  amount === "some" ? 0 : amount === "all" ? 1 : amount;

export function Reveal({
  children,
  variant = "fadeInUp",
  delay = 0,
  className,
  amount = 0.25,
}: RevealProps) {
  const retraso = delay
    ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties)
    : undefined;

  if (variant === "maskReveal") {
    // El texto emerge de un contenedor con overflow-hidden. Se observa EL
    // CONTENEDOR, no el texto: desplazado un 110 % hacia abajo, el texto
    // queda fuera del recorte y un IntersectionObserver lo ve con 0 % visible
    // para siempre (así estuvo el «¿Hablamos?» de Contacto hasta el
    // 2026-09-27, con la librería y sin ella; lo vigila un e2e de home.spec).
    return (
      <div
        data-reveal="maskReveal"
        data-umbral={umbralDe(amount)}
        className={`overflow-hidden ${className ?? ""}`}
      >
        <div data-motion="" data-mask="" style={retraso}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      data-motion=""
      data-reveal={variant}
      data-umbral={umbralDe(amount)}
      className={className}
      style={retraso}
    >
      {children}
    </div>
  );
}
