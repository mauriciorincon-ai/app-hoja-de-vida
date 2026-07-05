"use client";

import { useLocale, useTranslations } from "next-intl";
import { StaggerItem, Stagger } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";
import { trackEvent } from "@/lib/analytics";
import type { AppCard } from "@/lib/schemas";

/**
 * Brochure data-driven: cada card sale de data/apps.yaml (agregar una app =
 * editar el YAML, cero código). Estados canon del design system:
 * citron = en construcción · peach = en exploración.
 */
const chipPorEstado: Record<AppCard["estado"], string> = {
  "en-construccion": "bg-citron text-citron-ink",
  "en-exploracion": "bg-peach text-peach-ink",
};

export function AppsShowcase({ apps }: { apps: AppCard[] }) {
  const t = useTranslations("apps");
  const locale = useLocale() as "es" | "en";

  return (
    <section
      id="apps"
      aria-labelledby="apps-titulo"
      className="scroll-mt-16 bg-paper-1"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="apps-titulo"
            className="mb-4 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {t("titulo")}
          </h2>
          <p className="mb-14 max-w-[56ch] text-[15px] leading-relaxed text-ink-2">
            {t("subtitulo")}
          </p>
        </Reveal>
        <Stagger className="grid gap-6 md:grid-cols-3">
          {apps.map((app) => (
            <StaggerItem key={app.id} variant="scaleInBlur">
              <article
                data-app-id={app.id}
                className="flex h-full flex-col gap-3 rounded-[10px] border border-paper-3 bg-paper-0 p-6 shadow-sh-1"
              >
                <span
                  className={`self-start rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase ${chipPorEstado[app.estado]}`}
                >
                  {t(`estados.${app.estado}`)}
                </span>
                <h3 className="font-display text-xl font-medium text-ink-0">
                  {app.nombre[locale]}
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  {app.descripcion[locale]}
                </p>
                {app.solicitable && (
                  <a
                    href="#contacto"
                    onClick={() =>
                      trackEvent("app_card_clicked", { app: app.id })
                    }
                    className="mt-auto flex min-h-11 items-center gap-1.5 pt-2 text-sm font-medium text-sage-ink transition-colors duration-[120ms] hover:text-ink-0"
                  >
                    {t("cta")}
                    <span aria-hidden="true">→</span>
                  </a>
                )}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
