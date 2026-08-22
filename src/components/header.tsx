"use client";

import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";

const SECTIONS = [
  "trayectoria",
  "logros",
  "proyectos",
  "skills",
  "certificaciones",
  "apps",
  "roadmap",
  "contacto",
] as const;

/**
 * `enHome=false` (páginas de detalle y /cv): los anchors del nav apuntan a
 * la HOME (`/{locale}/#seccion`) en vez del fragmento local.
 *
 * Nav móvil (deuda S1, pagada en S4): en <md el nav de escritorio se oculta y
 * un disclosure hamburguesa accesible (aria-expanded/controls, Escape, foco
 * devuelto al botón) despliega las mismas secciones. Las rutas nuevas del S4
 * (roadmap, brochures) volvieron impostergable el acceso a la navegación en
 * móvil.
 */
export function Header({
  nombre,
  enHome = true,
}: {
  nombre: string;
  enHome?: boolean;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const otherLocale = locale === "es" ? "en" : "es";
  const pdfHref = `/cv/Henry-Rincon-CV-${locale.toUpperCase()}.pdf`;

  const [menuAbierto, setMenuAbierto] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape cierra el menú y devuelve el foco al botón que lo abrió.
  useEffect(() => {
    if (!menuAbierto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuAbierto(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuAbierto]);

  function switchLocale() {
    trackEvent("idioma_cambiado", { a: otherLocale });
    // Conserva la sección actual (anchor) al cambiar de idioma
    router.replace(`${pathname}${window.location.hash}`, {
      locale: otherLocale,
    });
  }

  const href = (s: string) => (enHome ? `#${s}` : `/${locale}#${s}`);

  return (
    <header className="sticky top-0 z-10 border-b border-paper-2 bg-paper-0/95">
      <a
        href={enHome ? "#contenido" : `/${locale}#contenido`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-paper-0 focus:px-3 focus:py-2 focus:text-sm focus:text-ink-0 focus:shadow-sh-2"
      >
        {t("saltarContenido")}
      </a>
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
        <a
          href={enHome ? "#contenido" : `/${locale}`}
          className="flex min-h-11 items-center gap-2 text-sm font-medium text-ink-0"
        >
          <span aria-hidden="true" className="text-sage-ink">
            ◆
          </span>
          {nombre}
        </a>

        <nav
          aria-label={locale === "es" ? "Secciones" : "Sections"}
          className="hidden items-center gap-5 md:flex"
        >
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={href(s)}
              className="flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-[120ms] hover:text-ink-0"
            >
              {t(s)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={pdfHref}
            download
            onClick={() =>
              trackEvent("cv_descargado", { origen: "header", idioma: locale })
            }
            className="flex min-h-11 items-center rounded-full bg-sage px-3 font-mono text-[11px] tracking-[0.02em] text-sage-ink uppercase shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
          >
            {t("descargarCv")}
          </a>
          <button
            type="button"
            onClick={switchLocale}
            aria-label={t("cambiarIdioma")}
            className="flex min-h-11 items-center gap-1 rounded-full border border-paper-3 px-3 font-mono text-[11px] tracking-[0.02em] text-ink-1 uppercase transition-colors duration-[120ms] hover:bg-paper-1"
          >
            <span className={locale === "es" ? "text-ink-0" : "text-ink-2"}>
              ES
            </span>
            <span aria-hidden="true" className="text-ink-3">
              /
            </span>
            <span className={locale === "en" ? "text-ink-0" : "text-ink-2"}>
              EN
            </span>
          </button>

          {/* Disclosure móvil (deuda S1): las mismas secciones bajo <md */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="nav-movil"
            aria-label={menuAbierto ? t("cerrarMenu") : t("abrirMenu")}
            className="flex size-11 items-center justify-center rounded-full border border-paper-3 text-ink-1 transition-colors duration-[120ms] hover:bg-paper-1 md:hidden"
          >
            {menuAbierto ? (
              <X size={18} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Panel del menú móvil: se monta solo abierto; cada enlace lo cierra. */}
      {menuAbierto && (
        <nav
          id="nav-movil"
          aria-label={t("menu")}
          className="border-t border-paper-2 bg-paper-0 md:hidden"
        >
          <ul className="mx-auto flex max-w-5xl flex-col px-4 py-2">
            {SECTIONS.map((s) => (
              <li key={s}>
                <a
                  href={href(s)}
                  onClick={() => setMenuAbierto(false)}
                  className="flex min-h-11 items-center text-sm text-ink-1 transition-colors duration-[120ms] hover:text-ink-0"
                >
                  {t(s)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
