import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeVisitTracker } from "@/components/home-visit-tracker";
import { AppsShowcase } from "@/components/home/apps-showcase";
import { Contacto } from "@/components/home/contacto";
import { Hero } from "@/components/home/hero";
import { Logros } from "@/components/home/logros";
import { Proyectos } from "@/components/home/proyectos";
import { Trayectoria } from "@/components/home/trayectoria";
import type { Locale } from "@/i18n/routing";
import { getApps, getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cv = getCv(locale as Locale);
  const { apps } = getApps();

  // JSON-LD Person + WebSite (gate ATS/SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: cv.identidad.nombre,
        description: cv.identidad.resumen,
        email: `mailto:${cv.identidad.email}`,
        url: `${SITE_URL}/${locale}`,
        sameAs: cv.identidad.enlaces.map((e) => e.url),
      },
      {
        "@type": "WebSite",
        name: cv.identidad.eyebrow,
        url: SITE_URL,
        inLanguage: ["es", "en"],
      },
    ],
  };

  return (
    <>
      <Header nombre={cv.identidad.nombre} />
      <main id="contenido" className="flex-1">
        <Hero identidad={cv.identidad} />
        <Trayectoria trayectoria={cv.trayectoria} />
        <Logros logros={cv.logros} />
        <Proyectos proyectos={cv.proyectos} />
        <AppsShowcase apps={apps} />
        <Contacto identidad={cv.identidad} apps={apps} />
      </main>
      <Footer identidad={cv.identidad} />
      <HomeVisitTracker />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape de "<": impide cerrar el tag desde el contenido del YAML
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
