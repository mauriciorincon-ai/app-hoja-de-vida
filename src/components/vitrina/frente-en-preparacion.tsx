/**
 * EL INICIO DE UN FRENTE, dicho con todas sus letras (ADR-015 · S7).
 *
 * Es la rama de `/vitrina/<frente>` que se pinta cuando el frente existe y aún
 * no tiene piezas. Desde que los cuatro frentes abrieron **no tiene sujeto en
 * producción**, y por eso vive aparte: un componente puro que recibe sus dos
 * textos ya traducidos y se prueba solo, sin esperar a que nazca un quinto
 * frente para saber que sigue funcionando. Sin fecha prometida (regla 16).
 */
export function FrenteEnPreparacion({
  titulo,
  linea,
}: {
  titulo: string;
  linea: string;
}) {
  return (
    <section
      data-frente-empieza
      aria-labelledby="frente-empieza"
      className="mt-12 rounded-[14px] border border-paper-2 bg-paper-1 p-6"
    >
      <h2
        id="frente-empieza"
        className="font-display text-xl font-medium tracking-[-0.015em] text-ink-0"
      >
        {titulo}
      </h2>
      <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink-1">
        {linea}
      </p>
    </section>
  );
}
