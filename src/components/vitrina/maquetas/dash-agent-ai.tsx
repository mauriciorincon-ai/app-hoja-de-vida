/**
 * Tira visual de «Dash Agent AI» — S5. Esquemática a propósito (banco §7):
 * las ideas de la app, no su interfaz.
 */
export function MaquetaDash() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de Dash Agent AI: los archivos que tus agentes leen, las instrucciones que se contradicen, lo que costó cada modelo, y que todo se lee en tu equipo."
    >
      {/* ── 1 · Lo que saben de ti: los archivos que se cargan ──────────── */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          className="mq-caja"
          x={26 + i * 5}
          y={16 + i * 5}
          width="28"
          height="24"
          rx="3"
        />
      ))}
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        LO QUE SABEN
      </text>

      {/* ── 2 · El choque: dos líneas que no pueden ser ciertas a la vez ── */}
      <path className="mq-trazo trazable" pathLength={1} d="M100 22h40" />
      <path className="mq-trazo trazable" pathLength={1} d="M100 42h40" />
      <path
        className="mq-veto-barra trazable"
        pathLength={1}
        d="M112 18l16 28M128 18l-16 28"
      />
      {/* «CHOCAN» y no «SE CONTRADICEN»: a cuatro columnas de 80 el rótulo
          largo se tocaba con el de al lado. */}
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        CHOCAN
      </text>

      {/* ── 3 · Lo que te cuestan: barras de gasto ──────────────────────── */}
      {[
        [182, 14],
        [190, 22],
        [198, 10],
        [206, 28],
        [214, 18],
      ].map(([x, alto]) => (
        <rect
          key={x}
          className="mq-onda"
          x={x}
          y={46 - alto}
          width="5"
          height={alto}
          rx="1.5"
        />
      ))}
      <path className="mq-trazo trazable" pathLength={1} d="M178 48h44" />
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        LO QUE CUESTA
      </text>

      {/* ── 4 · Todo local: el aparato con candado, nada sale ───────────── */}
      <rect className="mq-caja" x="262" y="20" width="36" height="26" rx="4" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M274 30v-3a6 6 0 0 1 12 0v3"
      />
      <rect
        className="mq-dia-lleno"
        x="272"
        y="30"
        width="16"
        height="11"
        rx="2"
      />
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        TODO LOCAL
      </text>
    </svg>
  );
}
