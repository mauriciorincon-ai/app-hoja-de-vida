import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Traductor } from "@/components/metodo/traductor";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getPiezasMetodo } from "@/lib/metodo/loader";
import type { PiezaMetodo } from "@/lib/metodo/schema";

/**
 * LA PUERTA A «MÉTODOS» EN LA HOME (S19). Las publicaciones tenían una sola
 * entrada, el menú; con la novena pieza la funcionalidad queda completa y la
 * HOME las asoma, entre la vitrina y los estudios: el mismo gesto que
 * `VitrinaHome`, sin imágenes y bajo el pliegue (el presupuesto de rendimiento
 * de la HOME es el más ajustado del sitio).
 *
 * La lista SALE de `data/metodo/` —una entrada por pieza, en el orden de sus
 * temas— y ningún total vive escrito en el código ni en los textos (regla del
 * PR #61): si se publica otra pieza, la puerta la nombra sin tocar nada.
 * `tests/unit/home-puerta-metodos.test.tsx` lo exige contra el disco.
 *
 * Voz impersonal, como la sección entera: los textos son claves de `metodo` en
 * `messages/*.json` (`puertaTitulo`, `puertaLinea`, `puertaIr`), así que el
 * gate `metodo-voz` ya los barre. La vista es SÍNCRONA y recibe el traductor
 * (como `InfografiaVista`): se prueba con la traducción real, y la forma del
 * árbol no depende de `useReducedMotion()` (`motion-estructura-reducida`).
 */

/** Escalón entre entradas: más corto que el de la vitrina, hay hasta nueve. */
const ESCALON_S = 0.06;

export function PuertaMetodos({
  piezas,
  locale,
  t,
}: {
  piezas: PiezaMetodo[];
  locale: Locale;
  t: Traductor;
}) {
  if (piezas.length === 0) return null;
  return (
    <section
      id="metodos"
      aria-labelledby="metodos-titulo"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="metodos-titulo"
            className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {t("puertaTitulo")}
          </h2>
          <p className="mt-4 mb-12 max-w-[60ch] text-[16px] leading-[1.75] text-ink-1">
            {t("puertaLinea")}
          </p>
        </Reveal>
        <Stagger
          as="ul"
          className="grid gap-3 sm:grid-cols-2"
          stagger={ESCALON_S}
        >
          {piezas.map((p) => (
            <StaggerItem
              key={p.slug}
              as="li"
              variant="fadeInSlow"
              className="list-none"
            >
              <Link
                href={`/metodos/${p.slug}`}
                data-puerta-pieza={p.slug}
                className="flex h-full min-h-11 items-start gap-3 rounded-[12px] border border-paper-2 bg-paper-0 px-4 py-3.5 shadow-sh-1 transition-[box-shadow,transform] duration-[180ms] ease-[var(--ease-out-cubic)] hover:-translate-y-0.5 hover:shadow-sh-2"
              >
                <span className="mt-0.5 shrink-0 rounded-full bg-lilac px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-lilac-ink uppercase tabular-nums">
                  {t("tema", { id: p.id })}
                </span>
                <span className="font-display text-[1.05rem] leading-snug font-medium text-ink-0">
                  {p.nombre[locale]}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal variant="fadeInUp">
          <p className="mt-10">
            <Link
              href="/metodos"
              data-ir-metodos
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
            >
              {t("puertaIr")}
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** La puerta con las piezas del disco y la traducción de la página. */
export async function MetodosHome({ locale }: { locale: Locale }) {
  const t = await getTranslations("metodo");
  return (
    <PuertaMetodos
      piezas={getPiezasMetodo()}
      locale={locale}
      t={t as Traductor}
    />
  );
}
