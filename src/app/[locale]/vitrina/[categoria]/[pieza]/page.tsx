import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/motion/reveal";
import { FichaTecnica } from "@/components/vitrina/ficha-tecnica";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getFrente, getFrentes } from "@/lib/vitrina/categorias";
import { getPieza, getPiezas, type Frente } from "@/lib/vitrina/piezas";

/**
 * LA FICHA TÉCNICA DE UNA PIEZA — la misma para todos los frentes (S7).
 *
 * Rinde `FichaTecnica`, el MISMO componente que usa una app: renderiza un
 * CONTRATO, no un tipo de pieza. La única diferencia con la ruta de una app es
 * lo que esta pieza no tiene: **no hay `hrefDetalle`**, porque una
 * investigación o un agente no traen un brochure debajo. El cierre queda con la
 * lista de espera y nada más — cero promesas de lo que no existe.
 *
 * Si la ficha llega SIN proceso (las siete investigaciones llegan así), la
 * sección «Cómo funciona» no se pinta y las demás se renumeran 01–04 en vez de
 * dejar un hueco. Eso lo resuelve `numerarSecciones`, no esta ruta.
 *
 * 100% SSG: `generateStaticParams` cruza idiomas con las piezas de los frentes
 * ABIERTOS. Un frente en preparación no publica rutas de pieza aunque tenga
 * fichas en `content/` — se enseña el día que el frente abra, no antes.
 */

/** Los frentes ABIERTOS distintos de `apps`: los únicos que enseñan piezas. */
function frentesAbiertos(): Frente[] {
  return getFrentes()
    .filter((f) => f.estado === "abierta" && f.id !== "apps")
    .map((f) => f.id as Frente);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    frentesAbiertos().flatMap((categoria) =>
      getPiezas(categoria).map((p) => ({
        locale,
        categoria,
        pieza: p.pieza.slug,
      })),
    ),
  );
}

type Params = {
  params: Promise<{ locale: string; categoria: string; pieza: string }>;
};

/** La pieza solo existe si su frente está ABIERTO: si no, la ruta es 404. */
function piezaPublicada(categoria: string, slug: string) {
  const frente = getFrente(categoria);
  if (!frente || frente.id === "apps" || frente.estado !== "abierta")
    return undefined;
  return getPieza(categoria as Frente, slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, categoria, pieza } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const ficha = piezaPublicada(categoria, pieza);
  if (!ficha) return {};
  const t = await getTranslations({ locale, namespace: "fichaTecnica" });
  const ruta = `/vitrina/${categoria}/${pieza}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${ficha.pieza.nombre} — ${t("eyebrow")} — Henry Rincón`,
    description: ficha.promesa.tagline,
    alternates: {
      languages: {
        es: `/es${ruta}`,
        en: `/en${ruta}`,
        "x-default": `/es${ruta}`,
      },
    },
  };
}

export default async function FichaDePiezaPage({ params }: Params) {
  const { locale, categoria, pieza } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const ficha = piezaPublicada(categoria, pieza);
  if (!ficha) notFound();

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("vitrina");
  const frente = getFrente(categoria)!;
  const nombreFrente = frente.nombre[l];

  // Vecinas en el orden del escaparate, dentro del MISMO frente.
  const todas = getPiezas(categoria as Frente);
  const i = todas.findIndex((p) => p.pieza.slug === pieza);
  const anterior = todas[i - 1];
  const siguiente = todas[i + 1];

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <nav aria-label={t("migaEtiqueta")} className="mb-8">
            <Link
              href={`/vitrina/${categoria}`}
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volverAlFrente", { frente: nombreFrente })}
            </Link>
          </nav>

          {/* Sin `hrefDetalle`: esta pieza no tiene un nivel debajo. */}
          <FichaTecnica datos={ficha} locale={l} />

          {(anterior || siguiente) && (
            <Reveal variant="fadeInUp">
              <nav
                aria-label={t("vecinasDelFrente", { frente: nombreFrente })}
                className="mt-12 grid gap-3 border-t border-paper-2 pt-8 sm:grid-cols-2"
              >
                {anterior ? (
                  <Link
                    href={`/vitrina/${categoria}/${anterior.pieza.slug}`}
                    className="flex min-h-11 flex-col justify-center rounded-[10px] border border-paper-2 bg-paper-0 px-5 py-4 transition-[box-shadow] duration-[180ms] hover:shadow-sh-1"
                  >
                    <span className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                      ← {t("piezaAnterior")}
                    </span>
                    <span className="mt-1 font-display text-[1.05rem] font-medium text-ink-0">
                      {anterior.pieza.nombre}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {siguiente && (
                  <Link
                    href={`/vitrina/${categoria}/${siguiente.pieza.slug}`}
                    className="flex min-h-11 flex-col justify-center rounded-[10px] border border-paper-2 bg-paper-0 px-5 py-4 transition-[box-shadow] duration-[180ms] hover:shadow-sh-1 sm:items-end sm:text-right"
                  >
                    <span className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                      {t("piezaSiguiente")} →
                    </span>
                    <span className="mt-1 font-display text-[1.05rem] font-medium text-ink-0">
                      {siguiente.pieza.nombre}
                    </span>
                  </Link>
                )}
              </nav>
            </Reveal>
          )}
        </div>
      </main>
      <Footer identidad={cv.identidad} />
    </>
  );
}
