import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeVisitTracker } from "@/components/home-visit-tracker";
import { Certificaciones } from "@/components/home/certificaciones";
import { Contacto } from "@/components/home/contacto";
import { Estudios } from "@/components/home/estudios";
import { Hero } from "@/components/home/hero";
import { Logros } from "@/components/home/logros";
import { Perfil } from "@/components/home/perfil";
import { Skills } from "@/components/home/skills";
import { Trayectoria } from "@/components/home/trayectoria";
import { VitrinaHome } from "@/components/home/vitrina";
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
  // `apps` sigue haciendo falta: el formulario de Contacto arma con él su
  // lista de apps SOLICITABLES. La sección «Apps» se retiró (ver header), pero
  // las exploraciones no se perdieron — viven donde de verdad convierten.
  const { apps } = getApps();
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  // JSON-LD Person + WebSite (gate ATS/SEO). Person.name lleva el nombre
  // legal completo y alternateName la marca pública (content pack §11).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: cv.identidad.nombreCompleto ?? cv.identidad.nombre,
        alternateName: cv.identidad.nombre,
        jobTitle: cv.identidad.eyebrow,
        description: cv.identidad.resumen,
        email: `mailto:${cv.identidad.email}`,
        url: `${SITE_URL}/${locale}`,
        sameAs: cv.identidad.enlaces.map((e) => e.url),
      },
      {
        "@type": "WebSite",
        name: tMeta("title"),
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
        <Perfil identidad={cv.identidad} />
        <Trayectoria trayectoria={cv.trayectoria} proyectos={cv.proyectos} />
        <Logros logros={cv.logros} />
        {/* El sitio de «Proyectos» lo ocupa la vitrina (revisión post-S7):
            los case studies se abren desde su hito en la trayectoria. El
            roadmap se fue con las apps, a /vitrina/apps. */}
        <VitrinaHome locale={locale as Locale} />
        <Estudios estudios={cv.estudios} />
        <Certificaciones certificaciones={cv.certificaciones} />
        <Skills skills={cv.skills} />
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
