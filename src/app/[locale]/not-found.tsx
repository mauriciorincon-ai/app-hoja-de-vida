import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <main
      id="contenido"
      className="grid min-h-svh flex-1 place-items-center px-4"
    >
      <div className="max-w-md text-center">
        <p className="font-mono text-sm tracking-[0.2em] text-ink-3 uppercase">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.015em] text-ink-0">
          {t("titulo")}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
          {t("cuerpo")}
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-colors duration-[120ms] hover:brightness-[0.97]"
        >
          <span aria-hidden="true">←</span>
          {t("volver")}
        </Link>
      </div>
    </main>
  );
}
