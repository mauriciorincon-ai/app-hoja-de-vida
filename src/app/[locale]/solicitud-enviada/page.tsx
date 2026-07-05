import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

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
        <p
          aria-hidden="true"
          className="anim-scale-in-blur mx-auto mb-8 grid size-14 place-items-center rounded-full bg-sage text-2xl text-sage-ink"
        >
          ◆
        </p>
        <span className="block overflow-hidden">
          <h1
            className="anim-mask-up font-display text-3xl font-medium tracking-[-0.015em] text-ink-0"
            style={{ "--anim-delay": "0.2s" } as React.CSSProperties}
          >
            {t("titulo")}
          </h1>
        </span>
        <p
          className="anim-blur-in mt-4 text-[15px] leading-relaxed text-ink-2"
          style={{ "--anim-delay": "0.5s" } as React.CSSProperties}
        >
          {t("cuerpo")}
        </p>
        <div
          className="anim-fade-in-up"
          style={{ "--anim-delay": "0.8s" } as React.CSSProperties}
        >
          <Link
            href="/"
            className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-colors duration-[120ms] hover:brightness-[0.97]"
          >
            <span aria-hidden="true">←</span>
            {t("volver")}
          </Link>
        </div>
      </div>
    </main>
  );
}
