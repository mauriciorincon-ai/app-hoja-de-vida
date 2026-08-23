/**
 * FIRMA de «Nutri-Kids» — su clímax re-dibujado en los tokens de CV Viva.
 *
 * La escena original (app-nutri-kids/docs/BROCHURE.html, «Aquí nadie califica
 * a tu hijo»): el resumen del día dice «ya hiciste 7 de 10» **en palabras**, y
 * la app nunca lo convierte en un porcentaje ni en una nota. Cinco palabras
 * están vetadas —calorías, peso, IMC, percentil, cumplimiento— y una prueba
 * automática lo vigila en cada cambio.
 */
export function FirmaNutriKids() {
  return (
    <svg
      viewBox="0 0 320 132"
      className="maqueta firma-clima"
      role="img"
      aria-label="El resumen del día dice «7 de 10» en palabras; el porcentaje y la nota están tachados, y con ellos las palabras calorías, peso, IMC, percentil y cumplimiento."
    >
      <rect className="fc-marco" x="24" y="10" width="272" height="70" rx="8" />

      {/* Lo que la app SÍ dice: en palabras. */}
      <text className="fc-cifra" x="88" y="52" textAnchor="middle">
        7 de 10
      </text>
      <text className="mq-rotulo" x="88" y="68" textAnchor="middle">
        LO QUE SÍ DICE
      </text>

      {/* Lo que JAMÁS dice: el porcentaje y la nota, tachados. */}
      <text className="fc-cifra fc-vetada" x="212" y="52" textAnchor="middle">
        70 %
      </text>
      <path className="fc-tachon" d="M180 44h64" />
      <text className="mq-rotulo" x="212" y="68" textAnchor="middle">
        NUNCA
      </text>

      {/* Las palabras vetadas: una sola línea centrada y UN tachón continuo —
          cinco tachones calculados a ojo quedaban descuadrados sobre cada
          palabra (cazado en la pasada de capturas de M2). */}
      <text className="mq-rotulo fc-vetada" x="160" y="102" textAnchor="middle">
        CALORÍAS · PESO · IMC · PERCENTIL · CUMPLIMIENTO
      </text>
      <path className="fc-tachon" d="M52 99h216" />
      <text className="mq-rotulo" x="160" y="122" textAnchor="middle">
        PALABRAS QUE ESTA APP NO DICE — Y UNA PRUEBA LO VIGILA
      </text>
    </svg>
  );
}
