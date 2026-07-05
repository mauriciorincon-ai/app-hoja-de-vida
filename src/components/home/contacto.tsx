import { getTranslations } from "next-intl/server";
import { SolicitarAccesoForm } from "@/components/forms/solicitar-acceso-form";
import { Reveal } from "@/components/motion/reveal";
import type { AppCard, Cv } from "@/lib/schemas";

/**
 * Cierre editorial (receta 10, variante minimalista V3): sin orbes, sin
 * sweep infinito ni pulse — el interés viene de la tipografía y el foco
 * único en el formulario.
 */
export async function Contacto({
  identidad,
  apps,
}: {
  identidad: Cv["identidad"];
  apps: AppCard[];
}) {
  const t = await getTranslations("contacto");
  const solicitables = apps.filter((app) => app.solicitable);

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-14 md:grid-cols-[5fr_7fr] md:gap-12">
          <div>
            <Reveal variant="fadeInUp">
              <p className="mb-5 text-xs font-medium tracking-[0.2em] text-sage-ink uppercase">
                {t("eyebrow")}
              </p>
            </Reveal>
            <Reveal variant="maskReveal" delay={0.15}>
              <h2
                id="contacto-titulo"
                className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0"
              >
                {t("titulo")}
              </h2>
            </Reveal>
            <Reveal variant="blurIn" delay={0.5}>
              <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">
                {t("subtitulo")}
              </p>
              <p className="mt-8 font-mono text-[13px] text-ink-2">
                <a
                  href={`mailto:${identidad.email}`}
                  className="border-b border-dashed border-ink-3 transition-colors duration-[120ms] hover:text-ink-0"
                >
                  {identidad.email}
                </a>
              </p>
            </Reveal>
          </div>

          <Reveal variant="fadeInUp" delay={0.3}>
            <SolicitarAccesoForm apps={solicitables} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
