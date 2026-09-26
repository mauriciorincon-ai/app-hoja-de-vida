import type { Metadata } from "next";
import Link from "next/link";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import { fraunces, inter, jetbrains } from "./fuentes";
import "./globals.css";

/**
 * El 404 de lo que no tiene idioma (2026-09-26): un archivo que no existe en
 * la raíz, como `/favicon.png` o `/manifest.webmanifest`. El proxy no toca las
 * rutas con punto, así que nadie les antepone `/es`. Como no hay idioma, habla
 * los dos, y cada botón lleva a su HOME. Los textos son los del 404 localizado.
 */
export const metadata: Metadata = {
  title: `404 · ${es.notFound.titulo} · ${en.notFound.titulo}`,
};

const BOTON =
  "inline-flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-colors duration-[120ms] hover:brightness-[0.97]";

export default function RootNotFound() {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper-0 text-ink-1 font-sans">
        <main
          id="contenido"
          className="grid min-h-svh flex-1 place-items-center px-4"
        >
          <div className="max-w-md text-center">
            <p className="font-mono text-sm tracking-[0.2em] text-ink-2 uppercase">
              404
            </p>
            <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.015em] text-ink-0">
              {es.notFound.titulo}
              <span
                lang="en"
                className="mt-2 block text-xl tracking-normal text-ink-2"
              >
                {en.notFound.titulo}
              </span>
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-2">
              {es.notFound.cuerpo}
            </p>
            <p
              lang="en"
              className="mt-1 text-[15px] leading-relaxed text-ink-2"
            >
              {en.notFound.cuerpo}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/es" className={BOTON}>
                <span aria-hidden="true">←</span>
                {es.notFound.volver}
              </Link>
              <Link href="/en" lang="en" className={BOTON}>
                <span aria-hidden="true">←</span>
                {en.notFound.volver}
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
