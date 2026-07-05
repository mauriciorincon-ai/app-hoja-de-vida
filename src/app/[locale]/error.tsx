"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    // Sentry captura los errores de renderizado vía instrumentation;
    // el log de consola queda como respaldo local.
    console.error(error);
  }, [error]);

  return (
    <main
      id="contenido"
      className="grid min-h-svh flex-1 place-items-center px-4"
    >
      <div className="max-w-md text-center">
        <p className="font-mono text-sm tracking-[0.2em] text-danger uppercase">
          error
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.015em] text-ink-0">
          {t("titulo")}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
          {t("cuerpo")}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex min-h-11 items-center rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-colors duration-[120ms] hover:brightness-[0.97]"
        >
          {t("recargar")}
        </button>
      </div>
    </main>
  );
}
