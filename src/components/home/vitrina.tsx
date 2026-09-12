import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { CajaFrente } from "@/components/vitrina/caja-frente";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getFrentes } from "@/lib/vitrina/categorias";

/**
 * La vitrina, asomada en la HOME (revisión post-S7). Ocupa el sitio que tenía
 * «Proyectos»: los case studies no desaparecen —cada uno se enlaza desde su
 * hito de la trayectoria— pero lo que se construye hoy vive en cuatro
 * frentes, y eso es lo que un visitante debe ver al bajar.
 *
 * Son las MISMAS cajas del portal (`CajaFrente`), con la misma cuenta medida:
 * la HOME no mantiene una copia de la vitrina, la enseña.
 *
 * Revisión post-S8: las cuatro cajas aparecen levemente, una a una (140 ms
 * de escalón, `fadeInSlow`), y el chip de productos APARECE GRANDE Y SE ENCOGE
 * con su caja: misma duración, misma curva, mismo escalón.
 */
/** Escalón entre cajas — y el retraso del pulso de cada chip, para que se muevan juntos. */
const ESCALON_S = 0.14;

export async function VitrinaHome({ locale }: { locale: Locale }) {
  const t = await getTranslations("vitrinaHome");
  const frentes = getFrentes();

  return (
    <section
      id="vitrina"
      aria-labelledby="vitrina-titulo"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="vitrina-titulo"
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
          className="grid gap-5 sm:grid-cols-2"
          stagger={ESCALON_S}
        >
          {frentes.map((frente, i) => (
            <StaggerItem
              key={frente.id}
              as="li"
              variant="fadeInSlow"
              className="list-none"
            >
              <CajaFrente
                frente={frente}
                locale={locale}
                retrasoPulso={i * ESCALON_S}
              />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal variant="fadeInUp">
          <p className="mt-10">
            <Link
              href="/vitrina"
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
