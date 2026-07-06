import { getLocale, getTranslations } from "next-intl/server";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Cv } from "@/lib/schemas";

/** Metric tiles de la receta 02: cifra mono gigante con countUp + caption. */
export async function Logros({ logros }: { logros: Cv["logros"] }) {
  const t = await getTranslations("nav");
  const locale = await getLocale();

  return (
    <section
      id="logros"
      aria-labelledby="logros-titulo"
      className="scroll-mt-16 bg-paper-1"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="logros-titulo"
            className="mb-14 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {t("logros")}
          </h2>
        </Reveal>
        <Stagger className="grid gap-12 md:grid-cols-3 md:gap-8">
          {logros.map((logro) => (
            <StaggerItem key={logro.etiqueta} className="flex flex-col gap-3">
              <p className="font-mono text-[clamp(3.5rem,9vw,5.5rem)] leading-[0.9] font-medium tracking-[-0.04em] text-ink-0">
                {logro.prefijo && (
                  <span className="align-top text-[0.4em] text-sage-ink">
                    {logro.prefijo}
                  </span>
                )}
                <Counter
                  value={logro.valor}
                  decimals={logro.decimales}
                  locale={locale}
                />
                {logro.sufijo && (
                  <span className="text-[0.4em] text-sage-ink">
                    {logro.sufijo}
                  </span>
                )}
              </p>
              <h3 className="text-xs font-medium tracking-[0.15em] text-ink-1 uppercase">
                {logro.etiqueta}
              </h3>
              <p className="text-sm leading-relaxed text-ink-2">
                {logro.descripcion}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
