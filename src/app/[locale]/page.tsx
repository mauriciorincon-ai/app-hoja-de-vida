import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeVisitTracker } from "@/components/home-visit-tracker";
import { Certificaciones } from "@/components/home/certificaciones";
import { Contacto } from "@/components/home/contacto";
import { Estudios } from "@/components/home/estudios";
import { Hero } from "@/components/home/hero";
import { Logros } from "@/components/home/logros";
import { MetodosHome } from "@/components/home/metodos";
import { Perfil } from "@/components/home/perfil";
import { Skills } from "@/components/home/skills";
import { Trayectoria } from "@/components/home/trayectoria";
import { VitrinaHome } from "@/components/home/vitrina";
import type { Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { correosDe } from "@/lib/correos";
import { SITE_URL } from "@/lib/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cv = getCv(locale as Locale);
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
        // Los dos correos (el del dominio y el Gmail): schema.org acepta
        // varios valores, y un ATS toma el que prefiera.
        email: correosDe(cv.identidad).map((c) => `mailto:${c}`),
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

  // Los fondos de las secciones salen del orden, no de cada una: desde Perfil, una
  // sí y otra no (paper-1 / paper-0), según la posición en `main`. Así, mover una
  // sección no rompe la alternancia. El Hero (primer hijo) conserva el suyo.
  return (
    <>
      <Header nombre={cv.identidad.nombre} />
      <main
        id="contenido"
        className="flex-1 [&>section:nth-child(even)]:bg-paper-1 [&>section:nth-child(odd):not(:first-child)]:bg-paper-0"
      >
        <Hero identidad={cv.identidad} />
        <Perfil identidad={cv.identidad} />
        <Trayectoria trayectoria={cv.trayectoria} proyectos={cv.proyectos} />
        <Logros logros={cv.logros} />
        <Estudios estudios={cv.estudios} />
        <Certificaciones certificaciones={cv.certificaciones} />
        <Skills skills={cv.skills} />
        {/* La puerta del Portafolio (ajuste de la HOME, 2026-11-01): justo antes de
            «Métodos». Primero lo que es y lo que construyó; al final, cómo lo piensa.
            La vitrina asumió el lugar conceptual de «Proyectos»: los case studies se abren
            desde su hito en la trayectoria, y el roadmap se fue con las apps, a
            /portafolio/apps. */}
        <VitrinaHome locale={locale as Locale} />
        {/* La puerta a «Métodos» (S19): las publicaciones, nombradas desde
            `data/metodo/`. Baja a después de Skills y antes de Contacto (S23,
            pedido del dueño): primero lo que es y lo que construyó, al final
            cómo lo piensa. */}
        <MetodosHome locale={locale as Locale} />
        <Contacto identidad={cv.identidad} />
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
