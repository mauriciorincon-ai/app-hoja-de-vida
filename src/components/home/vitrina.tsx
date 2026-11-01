import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getFrentes, type Frente } from "@/lib/vitrina/categorias";

/**
 * LA PUERTA AL PORTAFOLIO EN LA HOME (S28, OM-18 — «1a»). Desde la revisión post-S7 la HOME repetía
 * las cuatro cajas del portal (`/portafolio`): el mismo gesto dos veces, con la misma cuenta. Ahora
 * es lo que la maqueta aprobada llama «pieza 2» (`referencias-ui/home/maqueta/`): la forma de
 * `PuertaMetodos` —el título y la línea, una fila por frente y el botón— entre Skills y Métodos.
 *
 * Cada fila lleva la cifra del frente y su `intro`; un frente en preparación dice «En preparación»
 * donde los demás dicen su frase, y no enseña una cuenta inventada. **Las cifras salen del disco**
 * (`getFrentes()` las mide de los exports y de `content/<frente>/`): ningún total vive escrito en el
 * código ni en los textos, y `tests/unit/home-puerta-portafolio.test.tsx` lo exige.
 *
 * Conserva `id="portafolio"` (el ancla del chat y del catálogo de destinos) y `data-frente` en cada
 * fila. El color de la cifra es el de cada frente en la maqueta; el botón del hero también lleva a
 * `/portafolio`. Voz y textos: claves de `vitrinaHome` en `messages/*.json`, con paridad.
 *
 * La vista es SÍNCRONA y recibe el traductor y los frentes (como `PuertaMetodos`): se prueba con la
 * traducción real, y la forma del árbol no depende de `useReducedMotion()` (regla 7).
 */

/** Escalón entre filas: el de la puerta de «Métodos». */
const ESCALON_S = 0.06;

/** El color de la cifra de cada frente (maqueta). Clases completas: Tailwind no lee las armadas. */
const CIFRA: Record<string, string> = {
  apps: "bg-sage text-sage-ink",
  agentes: "bg-sky text-sky-ink",
  investigaciones: "bg-lilac text-lilac-ink",
  tableros: "bg-peach text-peach-ink",
};
/** Un frente sin color declarado recibe el de la marca: la puerta nunca se rompe. */
const CIFRA_POR_OMISION = "bg-sage text-sage-ink";

export type TraductorPuerta = (
  clave: "titulo" | "linea" | "ir" | "publicados" | "enPreparacion",
  valores?: Record<string, string | number>,
) => string;

export function PuertaPortafolio({
  frentes,
  locale,
  t,
}: {
  frentes: Frente[];
  locale: Locale;
  t: TraductorPuerta;
}) {
  if (frentes.length === 0) return null;
  return (
    <section
      id="portafolio"
      aria-labelledby="portafolio-titulo"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="portafolio-titulo"
            className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {t("titulo")}
          </h2>
          <p className="mt-4 mb-12 max-w-[60ch] text-[16px] leading-[1.75] text-ink-1">
            {t("linea")}
          </p>
        </Reveal>
        <Stagger
          as="ul"
          className="grid gap-3 sm:grid-cols-2"
          stagger={ESCALON_S}
        >
          {frentes.map((frente) => {
            const abierta = frente.estado === "abierta";
            return (
              <StaggerItem
                key={frente.id}
                as="li"
                variant="fadeInSlow"
                className="list-none"
              >
                <Link
                  href={`/portafolio/${frente.id}`}
                  data-frente={frente.id}
                  data-estado={frente.estado}
                  className="flex h-full min-h-11 items-start gap-3 rounded-[12px] border border-paper-2 bg-paper-0 px-4 py-3.5 shadow-sh-1 transition-[box-shadow,transform] duration-[180ms] ease-[var(--ease-out-cubic)] hover:-translate-y-0.5 hover:shadow-sh-2"
                >
                  <span
                    className={`mt-0.5 min-w-11 shrink-0 rounded-full px-2.5 py-1 text-center font-mono text-[12px] tracking-[0.02em] uppercase tabular-nums ${CIFRA[frente.id] ?? CIFRA_POR_OMISION}`}
                  >
                    {/* La cifra se ve; el lector de pantalla oye «N publicados» (un aria-label en un
                        <span> sin rol no es válido). En preparación, los puntos son decoración y la
                        frase de al lado ya lo dice. */}
                    <span aria-hidden="true">
                      {abierta ? frente.piezas : "…"}
                    </span>
                    {abierta ? (
                      <span className="sr-only">
                        {t("publicados", { n: frente.piezas })}
                      </span>
                    ) : null}
                  </span>
                  <span>
                    <b className="block font-display text-[1.05rem] leading-snug font-medium text-ink-0">
                      {frente.nombre[locale]}
                    </b>
                    <span className="mt-0.5 block text-[14px] leading-normal text-ink-2">
                      {abierta ? frente.intro[locale] : t("enPreparacion")}
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal variant="fadeInUp">
          <p className="mt-10">
            <Link
              href="/portafolio"
              data-ir-vitrina
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
            >
              {t("ir")}
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** La puerta con los frentes medidos del disco y la traducción de la página. */
export async function VitrinaHome({ locale }: { locale: Locale }) {
  const t = await getTranslations("vitrinaHome");
  return (
    <PuertaPortafolio
      frentes={getFrentes()}
      locale={locale}
      t={t as unknown as TraductorPuerta}
    />
  );
}
