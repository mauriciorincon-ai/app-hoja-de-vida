/**
 * Un chip que APARECE GRANDE Y SE ENCOGE a su tamaño al mismo tiempo que
 * aparece su tarjeta (revisión post-S8). Empieza a 1,5× y baja a 1× con la
 * MISMA duración y la MISMA curva que la entrada de la tarjeta (`fadeInSlow`:
 * 1,2 s, ease-out-expo), y arranca con ella —el escalón de la caja llega en
 * `retraso`—: un solo movimiento, no dos. Es EL CONTENEDOR el que se encoge
 * (fondo, borde, texto), desde su borde derecho para no salirse.
 *
 * NO tiene disparador propio: es un `data-reveal-item` del grupo que lo
 * contiene, y como esa entrada se repite cada vez que la sección vuelve a
 * pantalla, esto también. El retraso es ABSOLUTO desde el disparo del grupo
 * (`data-retraso`: no ocupa turno en el escalón), como se midió en la versión
 * con la librería. Solo `transform`; con reduced motion el cinturón CSS lo
 * deja quieto — mismo árbol.
 */
export const DURACION_PULSO_S = 1.2;
export const ESCALA_INICIAL = 1.5;

export function CifraQueLlama({
  children,
  className,
  title,
  retraso = 0,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  /** Segundos de espera antes del pulso: el escalón de la tarjeta que lo contiene. */
  retraso?: number;
}) {
  return (
    <span
      data-motion=""
      data-reveal-item="pulso"
      data-retraso=""
      title={title}
      className={className}
      style={
        {
          transformOrigin: "right center",
          position: "relative",
          zIndex: 1,
          "--reveal-delay": `${retraso}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}
