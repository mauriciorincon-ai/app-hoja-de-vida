import { getTranslations } from "next-intl/server";
import type { Cv } from "@/lib/schemas";

/**
 * Coreografía de la receta 01 (aurora-title) SIN fondo WebGL (vetado):
 * badge 0.2s → titular maskReveal 0.4s → resumen blurIn 1.2s → CTAs 1.5s.
 * Todo en CSS puro (.anim-*): el LCP pinta sin esperar JavaScript y
 * `prefers-reduced-motion` lo apaga vía globals.css.
 * Fondo: tinte pastel radial ESTÁTICO (cero animación ambiental).
 */
export async function Hero({ identidad }: { identidad: Cv["identidad"] }) {
  const t = await getTranslations("hero");

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52rem 30rem at 12% -8%, var(--color-sage) 0%, transparent 62%), radial-gradient(46rem 28rem at 96% 4%, var(--color-sky) 0%, transparent 58%)",
          opacity: 0.42,
        }}
      />
      <div className="mx-auto flex min-h-[88svh] max-w-5xl flex-col justify-center px-4 py-24 md:px-6">
        <p
          className="anim-fade-in-up mb-6 flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-ink-2 uppercase"
          style={{ "--anim-delay": "0.1s" } as React.CSSProperties}
        >
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-sage-ink"
          />
          {identidad.eyebrow}
        </p>

        <h1 className="max-w-[18ch] font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.025em] text-ink-0">
          <span className="block overflow-hidden">
            <span
              className="anim-mask-up block"
              style={{ "--anim-delay": "0.2s" } as React.CSSProperties}
            >
              {identidad.nombre}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="anim-mask-up block text-sage-ink"
              style={{ "--anim-delay": "0.3s" } as React.CSSProperties}
            >
              {identidad.titular}
            </span>
          </span>
        </h1>

        {/* El resumen es el candidato LCP: anima SOLO transform (anim-rise) */}
        <p
          className="anim-rise mt-8 max-w-[56ch] text-[17px] leading-[1.65] text-ink-2"
          style={{ "--anim-delay": "0.5s" } as React.CSSProperties}
        >
          {identidad.resumen}
        </p>

        <div
          className="anim-fade-in-up mt-10 flex flex-wrap items-center gap-5"
          style={{ "--anim-delay": "0.9s" } as React.CSSProperties}
        >
          <a
            href="#apps"
            className="flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-colors duration-[120ms] hover:brightness-[0.97]"
          >
            {t("ctaApps")}
            <span aria-hidden="true">→</span>
          </a>
          <a
            href="#contacto"
            className="flex min-h-11 items-center text-sm text-ink-2 underline decoration-paper-3 underline-offset-4 transition-colors duration-[120ms] hover:text-ink-0 hover:decoration-ink-3"
          >
            {t("ctaContacto")}
          </a>
        </div>

        <p
          className="anim-fade-in-up mt-16 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase"
          style={{ "--anim-delay": "1.2s" } as React.CSSProperties}
        >
          {identidad.ubicacion}
        </p>
      </div>
    </section>
  );
}
