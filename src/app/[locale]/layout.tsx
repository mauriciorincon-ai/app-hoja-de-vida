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
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { MotionProvider } from "@/components/motion/motion-provider";
import { routing } from "@/i18n/routing";
import { enMantenimiento } from "@/lib/mantenimiento";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

// Presupuesto LCP: la webfont del titular compite con el primer paint.
// Fraunces va en UN peso estático (todo el display usa 500).
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
// no desplaza nada.
// CON preload (2026-09-26): sin él, la fuente se pedía recién cuando el CSS la
// necesitaba, llegaba tarde a la ventana de optional, y la PRIMERA visita
// pintaba las cifras de la HOME, de los casos y de /cv en Arial (el fallback
// de next/font): medido 30 de 30 cargas en frío, con y sin red limitada.
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "optional",
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
  // (header, formulario, error boundary, chat) — el resto queda en el server.
  // `vitrinaHome` viaja porque el header rotula «Lo que construyo» con el
  // MISMO string que la sección (2026-09-10): un namespace que falte aquí no
  // rompe el build, pinta la clave cruda — el e2e del menú es quien lo caza.
  const messages = await getMessages();
  const clientMessages = {
    nav: messages.nav,
    vitrinaHome: messages.vitrinaHome,
    form: messages.form,
    // La lista de espera de las apps (vitrina) es el otro client component
    // con formulario (2026-09-13). Sin este renglón el build imprime
    // MISSING_MESSAGE en el prerender y la página pinta la clave cruda.
    listaDeEspera: messages.listaDeEspera,
    propuesta: messages.propuesta,
    error: messages.error,
    chat: messages.chat,
    roadmap: messages.roadmap,
  };

  // Kill-switch del chat (S3): sin CHAT_ENABLED=false el lanzador existe en
  // todas las páginas; apagado, ni siquiera se monta (defensa primaria). En
  // mantenimiento tampoco: la única página visible es la de mantenimiento.
  const chatEnabled =
    process.env.CHAT_ENABLED !== "false" && !enMantenimiento();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper-0 text-ink-1 font-sans">
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>{children}</MotionProvider>
          {chatEnabled && <ChatLauncher />}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
