import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { CargaLaMono } from "@/components/carga-la-mono";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { Revelador } from "@/components/motion/revelador";
import { routing } from "@/i18n/routing";
import { enMantenimiento } from "@/lib/mantenimiento";
import { SITE_URL } from "@/lib/site";
import { fraunces, inter, jetbrains } from "../fuentes";
import "../globals.css";

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
        {/* Sin JavaScript, las entradas al hacer scroll no tienen quién las
            dispare: el contenido se muestra en su estado final (ADR-027). */}
        <noscript>
          <style>{`[data-motion]{opacity:1!important;transform:none!important;filter:none!important}[data-motion-svg]{stroke-dasharray:none!important;stroke-dashoffset:0!important}`}</style>
        </noscript>
        <NextIntlClientProvider messages={clientMessages}>
          {children}
          {chatEnabled && <ChatLauncher />}
        </NextIntlClientProvider>
        <Analytics />
        <CargaLaMono />
        <Revelador />
      </body>
    </html>
  );
}
