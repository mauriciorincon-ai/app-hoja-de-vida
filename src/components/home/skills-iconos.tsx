
/**
 * Los iconos de los grupos de skills — dibujados aquí, en la familia del
 * design system (24×24, trazo 1.7, sin relleno). Nunca un emoji.
 *
 * Van POR EL `id` DEL GRUPO (2026-09-26), no por su posición. Antes iban por
 * posición «para que un cambio de nombre no los rompiera», y lo que los rompió
 * fue un cambio de ORDEN: el 2026-09-20 «Procesos y simulación» entró quinto,
 * se quedó con las dos personas de «Cómo trabajo», y «Cómo trabajo» recibió
 * el rombo de reserva. El `id` es estable por contrato (es el ancla de la
 * tarjeta y el destino de las citas del chat), así que es la llave correcta.
 * `tests/unit/skills-iconos.test.ts` exige un dibujo propio por grupo.
 *
 * Hasta el S28 el trazo se dibujaba al llegar la tarjeta; desde el S29 la lista
 * es estática, como en la maqueta, y el movimiento vive en el escenario.
 */
const DIBUJOS: Record<string, React.ReactElement[]> = {
  // Agentes e IA generativa (2026-09-26) — el agente que orquesta sus
  // herramientas: el nodo central y los tres que llama.
  "agentes-e-ia-generativa": [
    <circle key="a" cx="12" cy="12" r="2.6" />,
    <circle key="b" cx="5" cy="5" r="1.9" />,
    <circle key="c" cx="19" cy="5" r="1.9" />,
    <circle key="d" cx="12" cy="20" r="1.9" />,
    <path key="e" d="M6.4 6.4l3.7 3.7M17.6 6.4l-3.7 3.7M12 14.6v3.5" />,
  ],
  // Desarrollo asistido por IA (2026-09-26) — los signos del código y, entre
  // ellos, la chispa.
  "desarrollo-con-ia": [
    <path key="a" d="M8 7l-5 5 5 5" />,
    <path key="b" d="M16 7l5 5-5 5" />,
    <path
      key="c"
      d="M12 8.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
    />,
  ],
  // IA & ML, hoy «Machine learning y ciencia de datos» — una chispa que
  // aprende: el nodo y sus rayos.
  "ia-y-ml": [
    <circle key="a" cx="12" cy="12" r="3" />,
    <path key="b" d="M12 3v3M12 18v3M3 12h3M18 12h3" />,
    <path
      key="c"
      d="M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2"
    />,
  ],
  // Plataforma de datos — las capas de un almacén.
  "plataforma-de-datos": [
    <ellipse key="a" cx="12" cy="6" rx="8" ry="3" />,
    <path key="b" d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />,
    <path key="c" d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />,
  ],
  // Big data multiplataforma (2026-09-26) — tres plataformas, una sobre otra.
  "big-data-multiplataforma": [
    <path key="a" d="M12 3l9 4.5-9 4.5-9-4.5z" />,
    <path key="b" d="M3 12l9 4.5 9-4.5" />,
    <path key="c" d="M3 16.5l9 4.5 9-4.5" />,
  ],
  // BI & decisión — la curva que sube y la decisión al final.
  "bi-y-decision": [
    <path key="a" d="M4 20h16" />,
    <path key="b" d="M5 16l4-5 4 3 6-8" />,
    <circle key="c" cx="19" cy="6" r="1.8" />,
  ],
  // Ingeniería — la rama que se bifurca y vuelve.
  ingenieria: [
    <circle key="a" cx="6" cy="5" r="2" />,
    <circle key="b" cx="18" cy="9" r="2" />,
    <circle key="c" cx="6" cy="19" r="2" />,
    <path key="d" d="M6 7v10M16 9.5c-4 0-8 1.5-8 6" />,
  ],
  // Procesos, simulación y optimización (2026-09-26; hasta hoy llevaba, por
  // error, el dibujo de «Cómo trabajo») — un BPMN mínimo: el evento de inicio,
  // la tarea y la compuerta.
  "procesos-y-simulacion": [
    <circle key="a" cx="4.5" cy="12" r="2" />,
    <path key="b" d="M9 8.5h6v7H9z" />,
    <path key="c" d="M19.5 9l2.5 3-2.5 3-2.5-3z" />,
    <path key="d" d="M6.5 12H9M15 12h2" />,
  ],
  // Cómo trabajo (post-S8, bloque D) — dos personas y la mesa entre ellas.
  "como-trabajo": [
    <circle key="a" cx="8" cy="8" r="2.5" />,
    <circle key="b" cx="16.5" cy="9" r="2" />,
    <path key="c" d="M3.5 18c0-2.8 2-4.5 4.5-4.5S12.5 15.2 12.5 18" />,
    <path key="d" d="M13.5 17c.3-2.2 1.6-3.5 3.3-3.5 1.8 0 3.2 1.4 3.4 3.5" />,
    <path key="e" d="M3 21h18" />,
  ],
};

/** ¿Este grupo tiene su dibujo? Lo exige el test, grupo por grupo. */
export function tieneDibujo(id: string): boolean {
  return Object.hasOwn(DIBUJOS, id);
}

const ROMBO = [<path key="a" d="M12 3l9 9-9 9-9-9z" />];

/**
 * El dibujo del grupo, en la familia del design system: 24×24, trazo 1.7, sin relleno (S29). Lo usan la
 * lista (en su baldosa) y el escenario (dentro de cada burbuja, con el color de su tinta); el tamaño lo
 * pone la hoja. Ya no se dibuja al llegar: la lista de la maqueta es estática.
 */
export function DibujoSkill({ id }: { id: string }) {
  // El rombo queda de reserva para que un grupo nuevo no rompa la página;
  // el test es el que no lo deja llegar a producción.
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {tieneDibujo(id) ? DIBUJOS[id] : ROMBO}
    </svg>
  );
}
