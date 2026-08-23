/**
 * FIRMA de «Innmobiliaria» — su clímax re-dibujado en los tokens de CV Viva.
 *
 * La escena original (app-inmobiliaria/docs/BROCHURE.html, «Aquí, todo lo que
 * ves es verdad»): en un mercado donde clonan anuncios y el «gangazo» lleva
 * meses vendido, lo difícil no es publicar — es que te crean. Por eso **nada
 * se declara: todo se comprueba.** El sello se gana mostrando el Certificado
 * de Tradición y Libertad, que se ve UNA vez y nunca se almacena; y cada
 * anuncio vive 60 días: lo que está publicado, está vivo.
 */
export function FirmaInmobiliaria() {
  return (
    <svg
      viewBox="0 0 320 132"
      className="maqueta firma-clima"
      role="img"
      aria-label="El sello se gana: el certificado se ve una vez y no se almacena, solo quedan la matrícula y la fecha. Y cada anuncio vive 60 días: el que nadie renueva deja de verse."
    >
      {/* ── El sello se gana, no se declara ─────────────────────────────── */}
      <rect className="fc-marco" x="18" y="14" width="130" height="76" rx="8" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M83 26l-22 9v19c0 13.2 9.1 23.9 22 28 12.9-4.1 22-14.8 22-28V35l-22-9Z"
      />
      <path className="mq-trazo trazable" pathLength={1} d="M73 56l7 7 14-14" />
      <text className="mq-rotulo" x="83" y="102" textAnchor="middle">
        EL SELLO SE GANA
      </text>

      {/* El documento: se ve una vez y no se guarda. */}
      <rect
        className="fc-doc-fugaz"
        x="30"
        y="60"
        width="26"
        height="20"
        rx="3"
      />
      <path className="fc-tachon" d="M28 70h30" />
      <text className="mq-rotulo" x="43" y="118" textAnchor="middle">
        NO SE ALMACENA
      </text>

      {/* ── Aquí no hay anuncios zombi ──────────────────────────────────── */}
      <rect
        className="fc-marco"
        x="172"
        y="14"
        width="130"
        height="76"
        rx="8"
      />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          className={i < 3 ? "fc-vivo" : "fc-zombi"}
          x={188 + i * 28}
          y="34"
          width="20"
          height="34"
          rx="3"
        />
      ))}
      <path className="fc-tachon" d="M270 51h24" />
      <text className="mq-rotulo" x="237" y="102" textAnchor="middle">
        60 DÍAS · O DEJA DE VERSE
      </text>

      <text className="mq-rotulo" x="160" y="126" textAnchor="middle">
        NADA SE DECLARA — TODO SE COMPRUEBA
      </text>
    </svg>
  );
}
