"use client";

import { useLocale } from "next-intl";
import { trackEvent } from "@/lib/analytics";

/** CTA de descarga del PDF ATS (asset estático generado en build, ADR-008). */
export function CvDownloadButton({ label }: { label: string }) {
  const locale = useLocale();
  const pdfHref = `/cv/Henry-Rincon-CV-${locale.toUpperCase()}.pdf`;

  return (
    <a
      href={pdfHref}
      download
      onClick={() =>
        trackEvent("cv_descargado", { origen: "cv_page", idioma: locale })
      }
      className="flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
    >
      {label}
      <span aria-hidden="true">↓</span>
    </a>
  );
}
