import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function SolicitudEnviadaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("confirmacion");

  return (
    <main
      id="contenido"
      className="grid min-h-svh flex-1 place-items-center px-4"
    >
      <div className="max-w-md text-center">
        <Reveal variant="scaleInBlur" onMount>
          <p
            aria-hidden="true"
            className="mx-auto mb-8 grid size-14 place-items-center rounded-full bg-sage text-2xl text-sage-ink"
          >
            ◆
          </p>
        </Reveal>
        <Reveal variant="maskReveal" delay={0.2} onMount>
          <h1 className="font-display text-3xl font-medium tracking-[-0.015em] text-ink-0">
            {t("titulo")}
          </h1>
        </Reveal>
        <Reveal variant="blurIn" delay={0.5} onMount>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            {t("cuerpo")}
          </p>
        </Reveal>
        <Reveal variant="fadeInUp" delay={0.8} onMount>
          <Link
            href="/"
            className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-colors duration-[120ms] hover:brightness-[0.97]"
          >
            <span aria-hidden="true">←</span>
            {t("volver")}
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
