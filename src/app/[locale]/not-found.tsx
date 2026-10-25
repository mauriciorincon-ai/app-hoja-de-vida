import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/header";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";

/**
 * El 404 de cada idioma. Lleva el ENCABEZADO de todo el sitio (S23, OM-06:
 * «en el 404 no aparece el ES/EN, sí el chat y volver al inicio»): quien llegó
 * a una ruta rota en español puede pasar al 404 en inglés, y de ahí a cualquier
 * sección, sin volver a escribir la dirección. El conmutador cambia de idioma
 * sobre la MISMA ruta, que en el otro idioma tampoco existe y da su 404.
 */
export default async function NotFoundPage() {
  const t = await getTranslations("notFound");
  const locale = (await getLocale()) as Locale;
  const cv = getCv(locale);

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main
        id="contenido"
        className="grid flex-1 place-items-center px-4 py-24"
      >
        <div className="max-w-md text-center">
          <p className="font-mono text-sm tracking-[0.2em] text-ink-2 uppercase">
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
    </>
  );
}
