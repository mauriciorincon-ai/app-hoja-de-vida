import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MarcoDeSimulacion } from "@/components/vitrina/marco-de-simulacion";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getFicha } from "@/lib/vitrina/loader";
import { rutaDeEntrada } from "@/lib/vitrina/simulaciones";
import {
  getSimulacion,
  getSimulaciones,
} from "@/lib/vitrina/simulaciones-loader";

/**
 * LA SIMULACIÓN DE UNA APP (2026-10-12) — `/vitrina/apps/<slug>/simulacion`.
 *
 * Algunas apps son privadas y no se publican, pero su casa entrega una
 * simulación estática (planlang: la vitrina de sus dos demos, rotulada
 * «Simulación · no operativo»). CV Viva la copia tal cual a
 * `public/piezas/<carpeta>/` y aquí la MUESTRA dentro de un marco del mismo
 * sitio, como lo pidió la planeadora (planlang SPRINT_002, Big-D C21). Lo que
 * corre dentro del marco es de la otra casa y no se edita aquí; lo de afuera
 * —cabecera, rótulo, nota, regreso— es de CV Viva.
 *
 * 100% SSG y data-driven: la ruta existe solo para las apps de
 * `data/simulaciones.yaml` (`dynamicParams = false`: cualquier otra es 404).
 * El marco apunta SIEMPRE a un `.html` del paquete: el enrutador de idiomas
 * manda a 404 toda ruta sin punto, así que una carpeta suelta no se sirve.
 *
 * El marco nace al pulsar «Abrir la simulación aquí» (`MarcoDeSimulacion`, una
 * fachada): el paquete pesa lo que una app entera y cargado de entrada pasaba
 * el presupuesto de Lighthouse. El panel trae también el enlace a pantalla
 * completa, que funciona sin JavaScript.
 *
 * Sin `sandbox`: el paquete es del mismo origen y su playground necesita
 * JavaScript; `sandbox` con `allow-scripts` + `allow-same-origin` no aislaría
 * nada y solo rompería la navegación interna.
 *
 * **Cero enlaces** (regla 16): el marco y el enlace a pantalla completa son
 * archivos de este repo; ninguno sale del sitio.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getSimulaciones().map((s) => ({ locale, app: s.slug })),
  );
}

type Params = { params: Promise<{ locale: string; app: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const ficha = getFicha(app);
  if (!ficha || !getSimulacion(app)) return {};
  const t = await getTranslations({ locale, namespace: "vitrina" });

  return {
    metadataBase: new URL(SITE_URL),
    title: `${ficha.export.app.nombre} — ${t("simulacionTitulo")} — Henry Rincón`,
    description: ficha.export.promesa.tagline,
    alternates: {
      languages: {
        es: `/es/vitrina/apps/${app}/simulacion`,
        en: `/en/vitrina/apps/${app}/simulacion`,
        "x-default": `/es/vitrina/apps/${app}/simulacion`,
      },
    },
  };
}

export default async function SimulacionAppPage({ params }: Params) {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const ficha = getFicha(app);
  const simulacion = getSimulacion(app);
  if (!ficha || !simulacion) notFound();

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("vitrina");
  const nombre = ficha.export.app.nombre;
  const entrada = rutaDeEntrada(simulacion, l);

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <nav aria-label={t("migaEtiqueta")} className="mb-8">
            <Link
              href={`/vitrina/apps/${app}`}
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volverFichaTecnica")}
            </Link>
          </nav>

          <header data-simulacion={app} className="max-w-[68ch]">
            <p className="inline-flex rounded-full bg-peach px-3 py-1 font-mono text-[11px] tracking-[0.08em] text-peach-ink uppercase">
              {t("simulacionRotulo")}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,2.75rem)] leading-[1.08] font-medium tracking-[-0.02em] text-ink-0">
              {nombre}
              <span className="text-ink-2">: </span>
              {t("simulacionTitulo").toLocaleLowerCase(l)}
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-1">
              {simulacion.nota[l]}
            </p>
          </header>

          <div className="mt-8">
            <MarcoDeSimulacion
              src={entrada}
              titulo={t("simulacionMarco", { app: nombre })}
              etiquetas={{
                abrirAqui: t("simulacionAbrirAqui"),
                abrirCompleta: t("simulacionAbrir"),
                panelLinea: t("simulacionPanel"),
              }}
            />
          </div>

          <p className="mt-4 max-w-[60ch] text-[13px] leading-snug text-ink-2">
            {t("simulacionPie")}
          </p>
        </div>
      </main>
      <Footer identidad={cv.identidad} />
    </>
  );
}
