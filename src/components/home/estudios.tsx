import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Cv } from "@/lib/schemas";

/**
 * Estudios (revisión post-S7): sección propia, entre la vitrina y las
 * certificaciones. Antes la formación era un hito más de la trayectoria con
 * el periodo «Formación» — una palabra haciendo de estructura. Ahora es un
 * dato (`cv.estudios`) que la HOME, el /cv, el PDF y el chat leen igual.
 *
 * Sin fecha no se inventa fecha: un estudio sin `periodo` lo dice.
 */
export async function Estudios({ estudios }: { estudios: Cv["estudios"] }) {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("estudios");
  if (estudios.length === 0) return null;

  return (
    <section
      id="estudios"
      aria-labelledby="estudios-titulo"
      className="scroll-mt-16 bg-paper-1"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="estudios-titulo"
            className="mb-14 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {tNav("estudios")}
          </h2>
        </Reveal>
        <Stagger className="grid gap-6 md:grid-cols-2">
          {estudios.map((e) => (
            <StaggerItem key={`${e.titulo}-${e.institucion}`} variant="fadeInUp">
              <article
                data-estudio
                className="flex h-full flex-col gap-2 rounded-[10px] border border-paper-3 bg-paper-0 p-6 shadow-sh-1"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-xl leading-snug font-medium text-ink-0">
                    {e.titulo}
                  </h3>
                  <span
                    // Sin fecha se dice en cursiva, no en gris claro: `ink-3`
                    // no llega al contraste AA para texto (axe lo cazó).
                    className={`shrink-0 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase tabular-nums ${
                      e.periodo ? "" : "italic"
                    }`}
                  >
                    {e.periodo || t("sinPeriodo")}
                  </span>
                </div>
                <p className="font-mono text-[13px] text-ink-2">
                  {e.institucion}
                </p>
                {e.nota && (
                  <p className="text-sm leading-relaxed text-ink-2">{e.nota}</p>
                )}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
