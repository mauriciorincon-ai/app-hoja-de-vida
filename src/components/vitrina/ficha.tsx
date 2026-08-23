import { getTranslations } from "next-intl/server";
import type { FichaVitrina } from "@/lib/vitrina/loader";
import type { FuenteMetrica } from "@/lib/vitrina/schemas";
import { Maqueta } from "./maquetas";
import { TarjetaGrupo } from "./tarjeta-grupo";

/**
 * Ficha de una app hermana en LA VITRINA (S5, ADR-013). Re-expresa su
 * `brochure-export.json` **en el design system de CV Viva** — jamás imita el
 * look de la app de origen: "re-expresar ≠ re-diseñar".
 *
 * **Estructura = las cuatro capas del brochure** (molde del kit): portada (la
 * promesa, siempre visible) → qué hace (las TARJETAS, una por grupo, que se
 * abren al llegar leyendo) → el detalle dentro de cada tarjeta → lo fino
 * (acordeones). *Nadie lee lo que no pidió.*
 *
 * Por qué la ficha NO es a su vez una tarjeta desplegable: el patrón §7 manda
 * abrir por lectura «si las tarjetas concentran la mayor parte de la
 * información» — eso son los grupos, no el envoltorio. Y la portada de un
 * brochure es lo único que jamás se esconde: es el gancho. Anidar dos niveles
 * de apertura, además, duplicaría la reposición de scroll del cierre por
 * arriba (la tarjeta madre y la hija compensarían el mismo alto dos veces).
 *
 * Reglas que esta ficha hace visibles:
 *  - **Cero enlaces:** ni un `href` a la app ni a su repo. Se muestra la RAZÓN
 *    de que no lo haya (es contenido, no vacío) y un CTA de lista de espera.
 *  - **Toda cifra con su procedencia:** cada métrica lleva su badge de `fuente`.
 *  - **Las descartadas se muestran:** ni pendientes ni entregadas.
 *  - **El anclaje se declara:** de qué fecha es el export, sin prometer tiempo real.
 *
 * Server component: cero JS por ficha. La máquina de apertura es UNA isla para
 * toda la página (`AperturaPorLectura`), que opera por atributos sobre el DOM.
 * Todo el contenido vive en el HTML estático (gate ATS/SEO) aunque las tarjetas
 * nazcan colapsadas.
 */

// Cada procedencia con su pastel del DS (siempre con su ink par, contraste AA).
const colorFuente: Record<FuenteMetrica, string> = {
  medido: "bg-sage text-sage-ink",
  calculada: "bg-sky text-sky-ink",
  declarado: "bg-lilac text-lilac-ink",
  estimacion: "bg-peach text-peach-ink",
};

// Sellada = su gate de pruebas terminó (sage/éxito); inicial = construcción
// cerrada, gate pendiente (citron/en curso).
const colorEstado = {
  sellado: "bg-sage text-sage-ink",
  inicial: "bg-citron text-citron-ink",
} as const;

/** `datos_del_menor_solo_en_dispositivo` → "datos del menor solo en dispositivo" */
function humanizarClave(clave: string): string {
  return clave.replace(/_/g, " ");
}

const ROTULO = "font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase";
const TITULO_SECCION =
  "font-display text-xl font-medium tracking-[-0.015em] text-ink-0";
const RESUMEN =
  "flex min-h-11 cursor-pointer list-none items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase marker:content-none";

export async function FichaApp({ ficha }: { ficha: FichaVitrina }) {
  const t = await getTranslations("vitrina");
  const { ancla, export: exp } = ficha;
  const { promesa, funcionalidades, metricas, privacidad, enlaces, stack } =
    exp;

  // El booleano se muestra SIN colorear de bueno/malo: la polaridad cambia por
  // clave (`local_only: true` es bueno; `red_saliente: true` no lo sería), y
  // solo la app sabe cuál es cuál. El `detalle` lleva la explicación real.
  const banderas = Object.entries(privacidad).filter(
    ([clave, valor]) => clave !== "detalle" && typeof valor === "boolean",
  ) as Array<[string, boolean]>;

  const grupos = funcionalidades.grupos
    .slice()
    .sort((a, b) => a.orden - b.orden);

  return (
    <article
      data-app-slug={ancla.slug}
      data-estado={ancla.estado}
      className="ficha-vitrina flex flex-col gap-9 rounded-[14px] border border-paper-2 bg-paper-0 p-6 shadow-sh-1 md:p-9"
    >
      {/* ── Capa 0 · Portada: la promesa, siempre a la vista ─────────────── */}
      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            title={t(`estadoAyuda.${ancla.estado}`)}
            className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase ${colorEstado[ancla.estado]}`}
          >
            {t(`estados.${ancla.estado}`)}
          </span>
          <span className="rounded-full border border-paper-3 px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase">
            {ancla.ciclo}
          </span>
        </div>

        <div>
          <h2 className="font-display text-[clamp(1.6rem,3.6vw,2.1rem)] leading-tight font-medium tracking-[-0.02em] text-ink-0">
            {exp.app.nombre}
          </h2>
          <p className="mt-2 max-w-[46ch] font-display text-[clamp(1.05rem,2.2vw,1.3rem)] leading-snug text-ink-1">
            {promesa.tagline}
          </p>
        </div>

        {/* La MUESTRA de la portada es la TIRA esquemática: las ideas de la
            app en el lenguaje de esta página, y lo declara. Las pantallas
            REALES van más abajo, DENTRO de cada tarjeta de «qué hace» — cada
            grupo con la pantalla de lo que ese grupo cuenta (banco §7). */}
        <figure data-traza className="m-0">
          <div className="overflow-hidden rounded-[10px] border border-paper-2 bg-paper-1 p-3">
            <Maqueta slug={ancla.slug} />
          </div>
          <figcaption className="mt-2 text-[13px] leading-relaxed text-ink-2">
            {t("muestraPie")}
          </figcaption>
        </figure>

        <p className="max-w-[62ch] text-[15px] leading-[1.75] text-ink-1">
          {promesa.intro}
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className={`mb-1.5 ${ROTULO}`}>{t("paraQuien")}</p>
            <p className="text-sm leading-relaxed text-ink-1">
              {promesa.para_quien}
            </p>
          </div>
          <div>
            <p className={`mb-1.5 ${ROTULO}`}>{t("diferencial")}</p>
            <p className="text-sm leading-relaxed text-ink-1">
              {promesa.diferencial}
            </p>
          </div>
        </div>
      </header>

      {/* ── Las cifras: cada una con su procedencia ──────────────────────── */}
      <section aria-label={`${t("metricas")} — ${exp.app.nombre}`}>
        <p className={`mb-3 ${ROTULO}`}>{t("metricas")}</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metricas.map((m) => (
            <li
              key={m.clave}
              data-metrica={m.clave}
              className="flex flex-col gap-1 rounded-[6px] border border-paper-2 bg-paper-1 p-4"
            >
              <p className="font-display text-2xl font-medium text-ink-0 tabular-nums">
                {m.valor.toLocaleString("es-CO")}
                {m.unidad && (
                  <span className="ml-1 font-sans text-sm font-normal text-ink-2">
                    {m.unidad}
                  </span>
                )}
              </p>
              <p className="text-sm leading-snug text-ink-1">{m.etiqueta}</p>
              {/* La regla madre del contrato: una cifra sin procedencia no
                  entra — y aquí la procedencia se VE. */}
              <span
                title={`${t(`fuenteAyuda.${m.fuente}`)} — ${m.detalle}`}
                data-fuente={m.fuente}
                className={`mt-1 self-start rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] uppercase ${colorFuente[m.fuente]}`}
              >
                {t(`fuentes.${m.fuente}`)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Capa 1 · Qué hace: LAS TARJETAS ─────────────────────────────── */}
      <section aria-labelledby={`quehace-${ancla.slug}`}>
        <h3 id={`quehace-${ancla.slug}`} className={TITULO_SECCION}>
          {t("queHace")}
        </h3>
        <p className="mt-1 mb-5 text-sm leading-relaxed text-ink-2">
          {t("queHaceLinea", { n: funcionalidades.total })}
        </p>
        <div className="flex flex-col gap-3">
          {grupos.map((g) => (
            <TarjetaGrupo
              key={g.orden}
              grupo={g}
              slug={ancla.slug}
              etiquetaEstrella={t("estrella")}
              pieCaptura={t("capturasPie")}
            />
          ))}
        </div>
      </section>

      {/* ── Capa 3 · Lo fino: completa el cuadro sin estorbar el recorrido ─ */}
      <section aria-labelledby={`fino-${ancla.slug}`}>
        <h3 id={`fino-${ancla.slug}`} className={TITULO_SECCION}>
          {t("loFino")}
        </h3>
        <div className="mt-3 flex flex-col divide-y divide-paper-2 border-y border-paper-2">
          <details className="acordeon-fino py-1">
            <summary className={RESUMEN}>
              <span aria-hidden="true" className="acordeon-signo">
                +
              </span>
              {t("privacidad")}
            </summary>
            <div className="pb-4">
              {banderas.length > 0 && (
                <ul className="mb-2 flex flex-wrap gap-1.5">
                  {banderas.map(([clave, valor]) => (
                    <li
                      key={clave}
                      className="rounded-full border border-paper-3 px-2 py-0.5 font-mono text-[10px] text-ink-2"
                    >
                      {humanizarClave(clave)}:{" "}
                      <span className="text-ink-0">
                        {valor ? t("sí") : t("no")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="max-w-[64ch] text-sm leading-relaxed text-ink-1">
                {privacidad.detalle}
              </p>
            </div>
          </details>

          <details className="acordeon-fino py-1">
            <summary className={RESUMEN}>
              <span aria-hidden="true" className="acordeon-signo">
                +
              </span>
              {t("stack")}
            </summary>
            <ul className="flex flex-col gap-1.5 pb-4">
              {stack.map((s) => (
                <li key={s.nombre} className="text-sm leading-snug text-ink-2">
                  <span className="font-medium text-ink-1">{s.nombre}</span> —{" "}
                  {s.papel}
                </li>
              ))}
            </ul>
          </details>

          {funcionalidades.descartadas.length > 0 && (
            <details className="acordeon-fino py-1">
              <summary className={RESUMEN}>
                <span aria-hidden="true" className="acordeon-signo">
                  +
                </span>
                {t("descartadas")}
              </summary>
              <ul className="flex flex-col gap-3 pb-4">
                {funcionalidades.descartadas.map((d) => (
                  <li
                    key={d.id}
                    data-descartada-id={d.id}
                    className="rounded-[6px] border border-paper-2 bg-paper-1 p-4"
                  >
                    <p className="text-sm font-medium text-ink-1 line-through decoration-ink-3">
                      {d.nombre}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">
                      {d.razon}
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] text-ink-2">
                      {t("descartadaEl", { fecha: d.fecha })}
                    </p>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </section>

      {/* ── La RAZÓN en lugar del enlace + CTA de lista de espera ────────── */}
      <section
        aria-labelledby={`acceso-${ancla.slug}`}
        className="flex flex-col gap-3 rounded-[8px] bg-paper-1 p-5"
      >
        <h3 id={`acceso-${ancla.slug}`} className={ROTULO}>
          {t("acceso")}
        </h3>
        <p className="max-w-[64ch] text-sm leading-relaxed text-ink-1">
          {enlaces.razon}
        </p>
        <p className="max-w-[64ch] text-sm leading-relaxed text-ink-2">
          {enlaces.razon_repositorio}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <a
            href="#contacto-vitrina"
            data-cta="lista-de-espera"
            className="flex min-h-11 items-center rounded-md bg-sage px-5 text-sm font-medium text-sage-ink shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
          >
            {t("cta")}
          </a>
          <span className="text-[13px] text-ink-2">{t("ctaNota")}</span>
        </div>
      </section>

      <p className="font-mono text-[11px] leading-relaxed text-ink-2">
        {t("anclaje", {
          fecha: ancla.actualizado,
          version: ancla.versionRepo,
          sprints: ancla.sprintsCerrados,
        })}
      </p>
    </article>
  );
}
