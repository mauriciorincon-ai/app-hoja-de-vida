"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * NAVEGACIÓN AGRUPADA (2026-09-05, fuera de sprint — a pedido del usuario).
 *
 * El header llegó a **nueve destinos** de primer nivel y dejó de caber en
 * pantallas medianas. Pero el problema de fondo no era el número: cinco de esos
 * nueve —trayectoria, logros, proyectos, skills, certificaciones— **son una
 * sola cosa, la hoja de vida**, y competían por atención con la vitrina y el
 * contacto como si fueran destinos hermanos.
 *
 * Ahora: `Hoja de vida ▾` · `Vitrina` · `Roadmap` · `Contacto`. De nueve a
 * cuatro, sin perder un solo acceso — las cinco secciones viven dentro del
 * desplegable.
 *
 * Y desapareció «Apps». Su sección no enseñaba apps visitables: enseñaba ESTA
 * misma página (CV Viva y su chat) más dos exploraciones sin producto, mientras
 * «Vitrina» —a un centímetro en el mismo menú— sí llevaba a seis apps
 * construidas. Dos etiquetas prometiendo lo mismo, y la más real se quedaba con
 * la atención. Lo construido tiene ahora una sola puerta: la vitrina, que al
 * cierre enlaza las dos brochures propias en su bloque «De esta casa».
 *
 * «Lo que construyo» (revisión post-S7, 2.ª, 2026-09-10): la vitrina asomada
 * en la HOME es una sección más de la hoja de vida, así que entra al
 * desplegable con el nombre que lleva en la página.
 *
 * Y «Vitrina» / «Portafolio» (revisión post-S8, 2026-09-12): el dueño quiso
 * que la sección se llame «Vitrina», como siempre la llamó — y dos enlaces
 * «Vitrina» en el mismo menú a sitios distintos son una trampa (para el lector
 * de pantalla y para cualquiera). Así que el primer nivel, que es la RUTA del
 * portal, pasa a «Portafolio»: el nombre que sus propios CTAs ya le daban
 * («Explora el portafolio»). Una es la sección, la otra la casa.
 */
const HOJA_DE_VIDA = [
  "trayectoria",
  "logros",
  "vitrina",
  "estudios",
  "certificaciones",
  "skills",
] as const;

/**
 * Destinos que se ganan su sitio en el primer nivel. «Roadmap» ya no está:
 * es una pregunta sobre las apps y vive con ellas, en /vitrina/apps
 * (revisión post-S7). El primer nivel queda en TRES: Hoja de vida · Vitrina
 * · Contacto.
 */
const DIRECTAS = ["contacto"] as const;

/**
 * `enHome=false` (páginas de detalle, /cv y /vitrina): los anchors del nav
 * apuntan a la HOME (`/{locale}#seccion`) en vez del fragmento local.
 *
 * Dos disclosures, el mismo contrato de accesibilidad en ambos
 * (`aria-expanded` + `aria-controls`, Escape cierra y devuelve el foco al botón
 * que abrió, elegir una opción cierra):
 *  - **Hoja de vida** (≥md): agrupa las seis secciones del CV.
 *  - **Hamburguesa** (<md): el menú completo, con la hoja de vida como grupo.
 */
export function Header({
  nombre,
  enHome = true,
}: {
  nombre: string;
  enHome?: boolean;
}) {
  const t = useTranslations("nav");
  const tHome = useTranslations("vitrinaHome");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const otherLocale = locale === "es" ? "en" : "es";
  const pdfHref = `/cv/Henry-Rincon-CV-${locale.toUpperCase()}.pdf`;

  const [menuAbierto, setMenuAbierto] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [hvAbierto, setHvAbierto] = useState(false);
  const hvToggleRef = useRef<HTMLButtonElement>(null);
  const hvRef = useRef<HTMLDivElement>(null);

  // Escape cierra el menú móvil y devuelve el foco al botón que lo abrió.
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

  // Mismo contrato para el desplegable de escritorio, más el cierre al pulsar
  // fuera: un panel flotante que solo se cierra por Escape deja al visitante
  // con una capa abierta encima del contenido que quiso mirar.
  useEffect(() => {
    if (!hvAbierto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setHvAbierto(false);
        hvToggleRef.current?.focus();
      }
    }
    function onFuera(e: PointerEvent) {
      if (!hvRef.current?.contains(e.target as Node)) setHvAbierto(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onFuera);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onFuera);
    };
  }, [hvAbierto]);

  function switchLocale() {
    trackEvent("idioma_cambiado", { a: otherLocale });
    // Conserva la sección actual (anchor) al cambiar de idioma
    router.replace(`${pathname}${window.location.hash}`, {
      locale: otherLocale,
    });
  }

  const href = (s: string) => (enHome ? `#${s}` : `/${locale}#${s}`);
  // La sección de la vitrina en la HOME se llama como en la página («Vitrina»);
  // el portal, en el primer nivel, es «Portafolio» (post-S8).
  const etiqueta = (s: (typeof HOJA_DE_VIDA)[number]) =>
    s === "vitrina" ? tHome("titulo") : t(s);

  const ENLACE =
    "flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-[120ms] hover:text-ink-0";

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
          className="flex min-h-11 items-center gap-2 text-sm font-medium whitespace-nowrap text-ink-0"
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
          {/* Las seis secciones del CV, bajo un solo destino. */}
          <div ref={hvRef} className="relative">
            <button
              ref={hvToggleRef}
              type="button"
              onClick={() => setHvAbierto((v) => !v)}
              aria-expanded={hvAbierto}
              aria-controls="nav-hoja-de-vida"
              className={`${ENLACE} cursor-pointer gap-1.5`}
            >
              {t("hojaDeVida")}
              <ChevronDown
                size={15}
                strokeWidth={1.5}
                aria-hidden="true"
                className={`transition-transform duration-[160ms] ease-[var(--ease-out-cubic)] ${hvAbierto ? "rotate-180" : ""}`}
              />
            </button>
            {hvAbierto && (
              <ul
                id="nav-hoja-de-vida"
                className="menu-desplegable absolute top-full left-0 z-20 mt-1 min-w-44 rounded-[10px] border border-paper-2 bg-paper-0 py-1.5 shadow-sh-2"
              >
                {HOJA_DE_VIDA.map((s) => (
                  <li key={s}>
                    <a
                      href={href(s)}
                      onClick={() => setHvAbierto(false)}
                      className="flex min-h-11 items-center px-4 text-sm text-ink-1 transition-colors duration-[120ms] hover:bg-paper-1 hover:text-ink-0"
                    >
                      {etiqueta(s)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* El portafolio es RUTA propia, no ancla de la HOME — y es la única
              puerta a «lo construido» desde que «Apps» dejó de existir. */}
          <a href={`/${locale}/vitrina`} className={ENLACE}>
            {t("portafolio")}
          </a>
          {DIRECTAS.map((s) => (
            <a key={s} href={href(s)} className={ENLACE}>
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
            <span aria-hidden="true" className="text-ink-2">
              /
            </span>
            <span className={locale === "en" ? "text-ink-0" : "text-ink-2"}>
              EN
            </span>
          </button>

          {/* Disclosure móvil (deuda S1): el menú completo bajo <md */}
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

      {/* Panel del menú móvil: se monta solo abierto; cada enlace lo cierra.
          Aquí la hoja de vida NO se pliega otra vez —el panel ya es un
          desplegable— pero sí se agrupa bajo su rótulo, para que se lea igual
          que en escritorio. */}
      {menuAbierto && (
        <nav
          id="nav-movil"
          aria-label={t("menu")}
          className="border-t border-paper-2 bg-paper-0 md:hidden"
        >
          <ul className="mx-auto flex max-w-5xl flex-col px-4 py-2">
            <li>
              <p
                id="grupo-hoja-de-vida"
                className="mt-2 mb-1 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase"
              >
                {t("hojaDeVida")}
              </p>
              <ul
                aria-labelledby="grupo-hoja-de-vida"
                className="flex flex-col"
              >
                {HOJA_DE_VIDA.map((s) => (
                  <li key={s}>
                    <a
                      href={href(s)}
                      onClick={() => setMenuAbierto(false)}
                      className="flex min-h-11 items-center pl-3 text-sm text-ink-1 transition-colors duration-[120ms] hover:text-ink-0"
                    >
                      {etiqueta(s)}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-2 border-t border-paper-2 pt-1">
              <a
                href={`/${locale}/vitrina`}
                onClick={() => setMenuAbierto(false)}
                className="flex min-h-11 items-center text-sm text-ink-1 transition-colors duration-[120ms] hover:text-ink-0"
              >
                {t("portafolio")}
              </a>
            </li>
            {DIRECTAS.map((s) => (
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
