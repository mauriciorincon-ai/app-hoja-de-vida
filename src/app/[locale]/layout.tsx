import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { MotionProvider } from "@/components/motion/motion-provider";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

// Presupuesto LCP: la webfont del titular compite con el primer paint.
// Fraunces va en UN peso estático (todo el display usa 500) y JetBrains Mono
// sin preload (pinta métricas/fechas, casi todo below-the-fold).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

// display optional: si Inter no llega en el primer instante, la visita usa el
// fallback métrico-ajustado (sin swap tardío — el repaint del swap re-registra
// el LCP). Visitas con caché ven Inter siempre. Ver ADR-006.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "optional",
});

// display optional (patrón ADR-006, como Inter): /cv usa la mono de forma
// estructural (headings, contacto, periodos) y su swap tardío reacomodaba la
// página entera (CLS 0.125 en CI). Con optional el fallback métrico-ajustado
// no desplaza nada; visitas con caché ven JetBrains Mono siempre.
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // Al cliente solo viajan los namespaces que usan client components
  // (header, formulario, error boundary) — el resto se queda en el server.
  const messages = await getMessages();
  const clientMessages = {
    nav: messages.nav,
    form: messages.form,
    error: messages.error,
  };

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper-0 text-ink-1 font-sans">
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
