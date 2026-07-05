import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("meta");

  // Placeholder de Fase 0 — la HOME real (6 secciones) llega en Fase 2.
  return (
    <main id="contenido" className="flex-1 grid place-items-center p-8">
      <h1 className="font-display text-4xl text-ink-0">{t("title")}</h1>
    </main>
  );
}
