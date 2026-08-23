/**
 * FIRMA de «Probeta DS» — su clímax re-dibujado en los tokens de CV Viva.
 *
 * La escena original (app-ds/docs/BROCHURE.html): *«Ninguna herramienta enseña
 * esta pantalla. Nosotros empezamos por ella.»* El rival a batir es el
 * **baseline** —la regla más tonta que podría funcionar—, y la pantalla que
 * nadie más muestra es la del modelo sofisticado que NO le gana: 0.52 frente a
 * 0.64 en F1. Que un modelo no sirva no es un fallo de la app: es el resultado.
 */
export function FirmaDs() {
  return (
    <svg
      viewBox="0 0 320 132"
      className="maqueta firma-clima"
      role="img"
      aria-label="El veredicto que ninguna herramienta enseña: el «Random Forest» marca 0.52 en F1 y NO supera al baseline, que marca 0.64."
    >
      {/* El marco del veredicto. */}
      <rect className="fc-marco" x="24" y="10" width="272" height="96" rx="8" />

      {/* Eje y su escala. */}
      <path className="mq-trazo trazable" pathLength={1} d="M74 92h200" />
      <text className="mq-rotulo" x="60" y="30" textAnchor="end">
        1.00
      </text>
      <text className="mq-rotulo" x="60" y="94" textAnchor="end">
        0.00
      </text>

      {/* El baseline: la regla más tonta que podría funcionar — y gana. */}
      <rect
        className="fc-barra-gana"
        x="108"
        y="52"
        width="42"
        height="40"
        rx="3"
      />
      <text className="mq-rotulo" x="129" y="106" textAnchor="middle">
        BASELINE · 0.64
      </text>

      {/* El modelo sofisticado: NO le gana. */}
      <rect
        className="fc-barra-pierde"
        x="196"
        y="60"
        width="42"
        height="32"
        rx="3"
      />
      <text className="mq-rotulo" x="217" y="106" textAnchor="middle">
        TU MODELO · 0.52
      </text>

      {/* La línea del listón: el baseline es el rival a batir. */}
      <path className="fc-fuga fc-quieta" d="M92 52h164" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M217 44l-6 8h12l-6-8Z"
      />

      <text className="mq-rotulo" x="160" y="124" textAnchor="middle">
        NO SUPERA AL BASELINE — Y SE DICE
      </text>
    </svg>
  );
}
