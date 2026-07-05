import { getTranslations } from "next-intl/server";
import type { Cv } from "@/lib/schemas";

export async function Footer({ identidad }: { identidad: Cv["identidad"] }) {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-paper-2 bg-paper-1">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-4 py-8 md:flex-row md:items-center md:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[13px] text-ink-2">
          <a
            href={`mailto:${identidad.email}`}
            className="flex min-h-11 items-center border-b border-dashed border-ink-3 transition-colors duration-[120ms] hover:text-ink-0"
          >
            {identidad.email}
          </a>
          {identidad.enlaces.map((enlace) => (
            <a
              key={enlace.url}
              href={enlace.url}
              rel="noopener noreferrer"
              target="_blank"
              className="flex min-h-11 items-center border-b border-dashed border-ink-3 transition-colors duration-[120ms] hover:text-ink-0"
            >
              {enlace.etiqueta}
            </a>
          ))}
        </div>
        <p className="text-xs tracking-[0.1em] text-ink-3 uppercase">
          <span aria-hidden="true" className="text-sage-ink">
            ◆
          </span>{" "}
          {t("creditos")}
        </p>
      </div>
    </footer>
  );
}
