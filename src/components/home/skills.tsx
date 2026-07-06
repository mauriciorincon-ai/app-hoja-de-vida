import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Cv } from "@/lib/schemas";

/** Skills en 4 grupos (content pack §7): chips escaneables por grupo. */
export async function Skills({ skills }: { skills: Cv["skills"] }) {
  const t = await getTranslations("nav");
  if (skills.length === 0) return null;

  return (
    <section
      id="skills"
      aria-labelledby="skills-titulo"
      className="scroll-mt-16 bg-paper-1"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="skills-titulo"
            className="mb-14 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {t("skills")}
          </h2>
        </Reveal>
        <Stagger className="grid gap-8 md:grid-cols-2">
          {skills.map((grupo) => (
            <StaggerItem key={grupo.grupo} variant="fadeInUp">
              <div className="flex flex-col gap-4">
                <h3 className="font-mono text-[13px] tracking-[0.12em] text-ink-2 uppercase">
                  {grupo.grupo}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {grupo.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-paper-3 bg-paper-0 px-3 py-1.5 text-sm text-ink-1"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
