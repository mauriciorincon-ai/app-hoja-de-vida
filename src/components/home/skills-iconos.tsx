
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
 * El trazo se DIBUJA al llegar la tarjeta: cada figura lleva `pathLength=1` y
 * su `stroke-dashoffset` va de 1 a 0 en CSS (`data-reveal-item="trazo"`,
 * globals.css) cuando el grupo de Skills recibe `data-visto`. Es un componente
 * de servidor desde el 2026-09-27 (ADR-027). El estado por defecto es el
 * icono dibujado — si el disparo no llegara, se ve igual (lección del S5).
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
 * La partitura de una tarjeta de Skills (post-S8, segunda vuelta), en segundos
 * desde que la tarjeta arranca. Cada tarjeta corre la suya desplazada
 * `ESCALON_SKILLS_S × i`: aterriza vacía (1,4 s) → a los 0,8 s la cabecera y,
 * 0,2 s después, el trazo → los chips, uno cada 0,1 s, detrás de la cabecera.
 * La cabecera y los chips los orquesta la tarjeta (`hijos`); el trazo lleva su
 * retraso propio porque el `path` no es hijo directo de nadie con escalón.
 */
export const ESCALON_SKILLS_S = 0.2;
export const RETRASO_CABECERA_S = 0.8;
export const RETRASO_TRAZO_S = 1.0;
export const ESCALON_CHIP_S = 0.1;

export function IconoSkill({ id }: { id: string }) {
  // El rombo queda de reserva para que un grupo nuevo no rompa la página;
  // el test es el que no lo deja llegar a producción.
  const figuras = tieneDibujo(id) ? DIBUJOS[id] : ROMBO;
  return (
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-[10px] border border-paper-2 bg-paper-1 text-sage-ink"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {figuras.map((f, i) => {
          // Cada figura, con pathLength normalizada y su retraso ABSOLUTO
          // desde el disparo del grupo (medido: el trazo arranca a 1,0 s y
          // cada figura 0,2 s después de la anterior, en todas las tarjetas
          // por igual).
          const Tag = f.type as "path" | "circle" | "ellipse";
          return (
            <Tag
              key={f.key}
              {...(f.props as object)}
              data-motion=""
              data-motion-svg=""
              data-reveal-item="trazo"
              data-retraso=""
              pathLength={1}
              style={
                {
                  "--reveal-delay": `${+(RETRASO_TRAZO_S + i * ESCALON_SKILLS_S).toFixed(3)}s`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </svg>
    </span>
  );
}
