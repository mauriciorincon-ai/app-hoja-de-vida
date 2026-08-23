/**
 * FIRMA de «Hablemos San» — el clímax de su brochure, RE-DIBUJADO en los
 * tokens de CV Viva (decisión del usuario en el gate M1: la identidad de cada
 * brochure entra reconstruida, jamás fotografiada ni recoloreada).
 *
 * La escena original (app-habla/docs/BROCHURE.html, E06b «La promesa mayor»):
 * el marco del aparato como la frontera que nada atraviesa; cinco barras de
 * medidor que BAILAN con la voz y se apagan aquí adentro; y la fuga que lo
 * intenta — llega al borde y se devuelve. Siempre.
 *
 * Misma narrativa, nuestra paleta y nuestras curvas. La coreografía vive en
 * `globals.css` (`fc-bailar` / `fc-fugarse`) y solo corre con la tarjeta
 * abierta; bajo reduced-motion las barras quedan quietas a media altura.
 */
export function FirmaHabla() {
  return (
    <svg
      viewBox="0 0 320 120"
      className="maqueta firma-clima"
      role="img"
      aria-label="El aparato como frontera: la voz baila adentro, se apaga adentro, y el intento de salir se devuelve en el borde."
    >
      {/* El marco del aparato: la frontera que nada atraviesa. */}
      <rect
        className="fc-marco"
        x="70"
        y="8"
        width="180"
        height="104"
        rx="14"
      />
      <rect className="fc-marco" x="84" y="22" width="152" height="76" rx="8" />

      {/* Las 5 barras del medidor: bailan… y se apagan aquí adentro. */}
      {[0, 1, 2, 3, 4].map((k) => (
        <rect
          key={k}
          className="fc-barra"
          style={{ "--k": k } as React.CSSProperties}
          x={111 + k * 22}
          y="40"
          width="10"
          height="52"
          rx="5"
        />
      ))}

      {/* La fuga que lo intenta: llega al borde y se devuelve. Siempre. */}
      <path className="fc-fuga" d="M212 74h40" />

      <text className="mq-rotulo" x="160" y="118" textAnchor="middle">
        SE ANALIZA AQUÍ · SE DESCARTA AQUÍ
      </text>
    </svg>
  );
}
