import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CvDownloadButton } from "@/components/cv-download-button";
import { getCv } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { enMantenimiento } from "@/lib/mantenimiento";

/**
 * La página de mantenimiento (2026-09-24). El proxy la sirve con un 503 en
 * lugar de CUALQUIER página cuando `MANTENIMIENTO=on`; con el sitio arriba no
 * existe (404), para que nadie la encuentre por error. Ofrece lo que un
 * reclutador vino a buscar: el CV en PDF —los PDF siguen sirviéndose— y cómo
 * escribirle al dueño.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mantenimiento" });
  const { identidad } = getCv(locale as Locale);
  return {
    title: `${t("meta")} · ${identidad.nombre}`,
    robots: { index: false, follow: false },
  };
}

export default async function MantenimientoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (!enMantenimiento()) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("mantenimiento");
  const { identidad } = getCv(locale as Locale);
  const linkedin = identidad.enlaces.find((e) => /linkedin/i.test(e.url));

  return (
    <main
      id="contenido"
      className="grid min-h-svh flex-1 place-items-center px-4 py-16"
    >
      <div className="max-w-lg text-center">
        <p className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-sage-ink uppercase">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-sage-ink"
          />
          {t("eyebrow")}
        </p>
        <p className="mt-6 font-mono text-sm tracking-[0.04em] text-ink-2">
          {identidad.nombre}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,2.75rem)] leading-[1.1] font-medium tracking-[-0.02em] text-ink-0">
          {t("titulo")}
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-ink-1">
          {t("cuerpo")}
        </p>
        <div className="mt-10 flex justify-center">
          <CvDownloadButton label={t("descargar")} origen="mantenimiento" />
        </div>
        <div className="mt-12 border-t border-paper-3 pt-8">
          <p className="text-[15px] text-ink-2">{t("escribeme")}</p>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[15px]">
            <a
              href={`mailto:${identidad.email}`}
              className="font-medium text-ink-0 underline decoration-paper-3 underline-offset-4 hover:decoration-ink-2"
            >
              {identidad.email}
            </a>
            {linkedin && (
              <a
                href={linkedin.url}
                className="font-medium text-ink-0 underline decoration-paper-3 underline-offset-4 hover:decoration-ink-2"
              >
                {linkedin.etiqueta}
              </a>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
