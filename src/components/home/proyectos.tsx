import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Cv } from "@/lib/schemas";

export async function Proyectos({ proyectos }: { proyectos: Cv["proyectos"] }) {
  const t = await getTranslations("nav");

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-titulo"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="proyectos-titulo"
            className="mb-14 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {t("proyectos")}
          </h2>
        </Reveal>
        <Stagger className="grid gap-6 md:grid-cols-2">
          {proyectos.map((proyecto) => (
            <StaggerItem key={proyecto.nombre} variant="scaleInBlur">
              <article
                className={`flex h-full flex-col gap-3 rounded-[10px] border border-paper-3 p-6 shadow-sh-1 ${
                  proyecto.destacado ? "bg-paper-1" : "bg-paper-0"
                }`}
              >
                <h3 className="font-display text-xl font-medium text-ink-0">
                  {proyecto.nombre}
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  {proyecto.resumen}
                </p>
                {proyecto.stack.length > 0 && (
                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {proyecto.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full bg-paper-2 px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
