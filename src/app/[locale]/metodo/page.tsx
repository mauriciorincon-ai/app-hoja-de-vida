import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { getPiezasMetodo } from "@/lib/metodo/loader";
import { bloqueDe } from "@/lib/metodo/schema";
import { SITE_URL } from "@/lib/site";

/**
 * «MI MÉTODO» — la lista de infografías (S10, `/metodo`). Una sección propia,
 * fuera de la vitrina (decisión del dueño, 2026-10-17): cada infografía
 * contesta una pregunta de entrevista con su método.
 *
 * 100% SSG y data-driven: la lista sale de `data/metodo/` y el conteo se MIDE,
 * no se escribe — ningún total de piezas vive a mano en el código ni en los
 * textos (regla del PR #61). Cero enlaces: los únicos destinos son rutas de
 * este repo.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "metodo" });
  return {
    metadataBase: new URL(SITE_URL),
    title: `${t("eyebrow")} — Henry Rincón`,
    description: t("metaDescripcion"),
    alternates: {
      languages: {
        es: "/es/metodo",
        en: "/en/metodo",
        "x-default": "/es/metodo",
      },
    },
  };
}

export default async function MetodoPage({ params }: Params) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("metodo");
  const piezas = getPiezasMetodo();

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <header className="max-w-[68ch]">
            <p className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0 [text-wrap:balance]">
              {t("titulo")}
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-1">
              {t("intro")}
            </p>
            <p
              data-conteo={piezas.length}
              className="mt-4 font-mono text-[12px] tracking-[0.02em] text-ink-2 uppercase"
            >
              {t("piezasPublicadas", { n: piezas.length })}
            </p>
          </header>

          {piezas.length === 0 ? (
            <p className="mt-10 text-[15px] text-ink-2">{t("sinPiezas")}</p>
          ) : (
            <ul className="mt-10 grid gap-5 md:grid-cols-2">
              {piezas.map((p) => (
                <li key={p.slug}>
                  <Reveal variant="fadeInUp" amount={0.3}>
                    <Link
                      href={`/metodo/${p.slug}`}
                      data-pieza={p.slug}
                      className="flex h-full min-h-11 flex-col gap-3 rounded-[14px] border border-paper-2 bg-paper-0 p-6 shadow-sh-1 transition-[box-shadow,transform] duration-[180ms] ease-[var(--ease-out-cubic)] hover:-translate-y-0.5 hover:shadow-sh-2"
                    >
                      <span className="self-start rounded-full bg-lilac px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-lilac-ink uppercase tabular-nums">
                        {t("tema", { id: p.id })}
                      </span>
                      <span className="font-display text-[1.35rem] leading-snug font-medium text-ink-0">
                        {p.nombre[l]}
                      </span>
                      <span className="text-[14px] leading-relaxed text-ink-2">
                        {bloqueDe(p, 1).pregunta[l]}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-sage-ink">
                        {t("abrir")}
                        <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer identidad={cv.identidad} />
    </>
  );
}
