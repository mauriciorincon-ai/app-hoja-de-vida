import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Frente } from "@/lib/vitrina/categorias";

/**
 * CAJA DE FRENTE — la unidad del portal de la vitrina (post-S5, ADR-015).
 *
 * La vitrina dejó de ser solo apps: se reparte en cuatro frentes —apps,
 * agentes especializados, investigaciones y tableros de datos— y esta caja es
 * lo primero que se ve de cada uno: su nombre, una frase, su estado y cuántas
 * piezas tiene publicadas. **Marca un inicio, no lo disfraza**: un frente en
 * preparación lo dice en su chip y no enseña una cuenta inventada.
 *
 * Misma disciplina que la muestra de app: el enlace estira su área de clic a
 * toda la caja con `after:absolute inset-0`, pero su nombre accesible sigue
 * siendo el del frente — una sola parada de tabulador por caja, nunca «entrar».
 *
 * El icono se dibuja aquí, en la familia del design system (24×24, trazo 1.5,
 * sin relleno). Nunca un emoji.
 */

const ICONOS: Record<string, React.ReactElement> = {
  // Cuatro pantallas: aplicaciones con interfaz.
  apps: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </>
  ),
  // El prompt: se les habla por comandos.
  agentes: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3" />
      <path d="M12 15h5" />
    </>
  ),
  // Una línea que se bifurca y elige rumbo.
  investigaciones: (
    <>
      <path d="M4 20V12a4 4 0 0 1 4-4h4" />
      <path d="M12 8h4a4 4 0 0 1 4 4v8" />
      <path d="M12 4v8" />
      <circle cx="12" cy="4" r="1.5" />
      <path d="M17 17l3 3M20 17l-3 3" />
    </>
  ),
  // Barras: datos a la vista.
  tableros: (
    <>
      <path d="M4 20h16" />
      <rect x="6" y="11" width="3" height="9" rx="1" />
      <rect x="11" y="6" width="3" height="14" rx="1" />
      <rect x="16" y="14" width="3" height="6" rx="1" />
    </>
  ),
};

/** Un frente sin icono declarado recibe un punto: la caja nunca se rompe. */
const PUNTO = <circle cx="12" cy="12" r="3" />;

export async function CajaFrente({
  frente,
  locale,
}: {
  frente: Frente;
  locale: Locale;
}) {
  const t = await getTranslations("vitrina");
  const abierta = frente.estado === "abierta";

  return (
    <li className="list-none">
      <article
        data-frente={frente.id}
        data-estado={frente.estado}
        className="caja-frente relative flex h-full flex-col gap-4 rounded-[14px] border border-paper-2 bg-paper-0 p-6 shadow-sh-1 transition-[box-shadow,transform] duration-[180ms] ease-[var(--ease-out-cubic)] hover:-translate-y-0.5 hover:shadow-sh-2"
      >
        <div className="flex items-start justify-between gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-[10px] bg-paper-1 text-ink-1"
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            >
              {ICONOS[frente.id] ?? PUNTO}
            </svg>
          </span>
          <span
            title={t(
              abierta
                ? "frenteEstadoAyuda.abierta"
                : "frenteEstadoAyuda.enPreparacion",
            )}
            className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase ${
              abierta ? "bg-sage text-sage-ink" : "bg-citron text-citron-ink"
            }`}
          >
            {abierta
              ? t("cuentaPiezas", { n: frente.piezas })
              : t("frenteEstados.enPreparacion")}
          </span>
        </div>

        <div>
          <h2 className="font-display text-[1.45rem] leading-tight font-medium tracking-[-0.02em] text-ink-0">
            <Link
              href={`/vitrina/${frente.id}`}
              className="after:absolute after:inset-0 after:rounded-[14px] after:content-['']"
            >
              {frente.nombre[locale]}
            </Link>
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-1">
            {frente.intro[locale]}
          </p>
        </div>

        <p className="mt-auto flex items-center gap-1.5 text-[14px] font-medium text-sage-ink">
          {abierta ? t("entrar") : t("verQueViene")}
          <span aria-hidden="true">→</span>
        </p>
      </article>
    </li>
  );
}
