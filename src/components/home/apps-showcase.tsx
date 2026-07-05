import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { AppCard } from "@/lib/schemas";
import { AppCardCta } from "./app-card-cta";

/**
 * Brochure data-driven: cada card sale de data/apps.yaml (agregar una app =
 * editar el YAML, cero código). Estados canon del design system:
 * citron = en construcción · peach = en exploración.
 * Server component: solo el CTA (tracking) se hidrata.
 */
const chipPorEstado: Record<AppCard["estado"], string> = {
  "en-produccion": "bg-sage text-sage-ink",
  "en-construccion": "bg-citron text-citron-ink",
  "en-exploracion": "bg-peach text-peach-ink",
};

export async function AppsShowcase({ apps }: { apps: AppCard[] }) {
  const t = await getTranslations("apps");
  const locale = (await getLocale()) as "es" | "en";

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
                {app.enlaces.length > 0 && (
                  <p className="flex flex-wrap gap-x-4 font-mono text-[13px] text-ink-2">
                    {app.enlaces.map((enlace) => (
                      <a
                        key={enlace.url}
                        href={enlace.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        aria-label={`${enlace.etiqueta} — ${app.nombre[locale]}`}
                        className="flex min-h-11 items-center gap-1 border-b border-dashed border-ink-3 transition-colors duration-[120ms] hover:text-ink-0"
                      >
                        {enlace.etiqueta}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </p>
                )}
                {app.solicitable && (
                  <AppCardCta appId={app.id} label={t("cta")} />
                )}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
