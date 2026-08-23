/**
 * FIRMA de «Dash Agent AI» — su clímax re-dibujado en los tokens de CV Viva.
 *
 * La escena original (app-dash-agent-ai/docs/BROCHURE.html, «Lo que saben de
 * ti — y si sigue siendo cierto»): un archivo de instrucciones de 408 líneas
 * donde la línea 5 y la 402 se contradicen. Las instrucciones no caducan con
 * un aviso: **caducan en silencio**, y el choque solo aparece si alguien lo
 * audita.
 */
export function FirmaDash() {
  return (
    <svg
      viewBox="0 0 320 132"
      className="maqueta firma-clima"
      role="img"
      aria-label="Un archivo de instrucciones: la línea 5 dice una cosa y la 402 la contraria. Las dos no pueden ser ciertas a la vez, y nadie avisó."
    >
      {/* El archivo entero. */}
      <rect className="fc-marco" x="34" y="12" width="252" height="94" rx="8" />

      {/* Línea 5 — la primera instrucción. */}
      <text className="mq-rotulo" x="48" y="34" textAnchor="start">
        5
      </text>
      <rect
        className="fc-linea-viva"
        x="64"
        y="26"
        width="150"
        height="9"
        rx="3"
      />

      {/* Las 402 líneas de en medio: el silencio donde caduca. */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          className="mq-dia-vacio"
          x="64"
          y={46 + i * 8}
          width={130 - i * 14}
          height="4"
          rx="2"
        />
      ))}
      <text className="mq-rotulo" x="230" y="62" textAnchor="middle">
        402 LÍNEAS
      </text>

      {/* Línea 408 — la que la contradice. */}
      <text className="mq-rotulo" x="44" y="92" textAnchor="start">
        408
      </text>
      <rect
        className="fc-linea-viva"
        x="64"
        y="84"
        width="150"
        height="9"
        rx="3"
      />

      {/* El choque: las dos no pueden ser ciertas a la vez. */}
      <path className="fc-choque" d="M232 26l24 62M256 26l-24 62" />
      <text className="mq-rotulo" x="244" y="104" textAnchor="middle">
        CHOQUE
      </text>

      <text className="mq-rotulo" x="160" y="124" textAnchor="middle">
        CADUCAN EN SILENCIO · NADIE AVISA
      </text>
    </svg>
  );
}
