import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import type { Cv } from "@/lib/schemas";

/** Perfil corto (content pack §3): el párrafo que un hiring manager lee entero. */
export async function Perfil({ identidad }: { identidad: Cv["identidad"] }) {
  const t = await getTranslations("perfil");
  if (!identidad.perfil) return null;

  return (
    <section
      id="perfil"
      aria-labelledby="perfil-titulo"
      className="scroll-mt-16 bg-paper-1"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-24">
        <Reveal variant="fadeInUp">
          <h2
            id="perfil-titulo"
            className="mb-8 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {t("titulo")}
          </h2>
        </Reveal>
        <Reveal variant="blurIn" delay={0.2}>
          <p className="max-w-[68ch] text-[17px] leading-[1.75] text-ink-1">
            {identidad.perfil}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
