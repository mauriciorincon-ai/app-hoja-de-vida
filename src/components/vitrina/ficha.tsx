import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { FichaVitrina } from "@/lib/vitrina/loader";
import type { FuenteMetrica } from "@/lib/vitrina/schemas";
import { Maqueta } from "./maquetas";

/**
 * Ficha de una app hermana en LA VITRINA (S5, ADR-013). Re-expresa su
 * `brochure-export.json` **en el design system de CV Viva** — jamás imita el
 * look de la app de origen: "re-expresar ≠ re-diseñar".
 *
 * Forma de TARJETA del patrón «apertura por lectura» (banco de técnicas §7):
 * cabecera siempre visible (identidad + promesa) y detalle que se abre al
 * llegar leyendo. La coreografía interior manda que **la muestra llegue
 * primero**: el dibujo ancla las palabras.
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
 * Todo el contenido vive en el HTML estático (gate ATS/SEO) aunque nazca
 * colapsado; cerrado, `visibility: hidden` lo saca del árbol de accesibilidad.
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

export async function FichaApp({ ficha }: { ficha: FichaVitrina }) {
  const t = await getTranslations("vitrina");
  const { ancla, export: exp } = ficha;
  const { promesa, funcionalidades, metricas, privacidad, enlaces, stack } =
    exp;
  const idDetalle = `detalle-${ancla.slug}`;

  // El booleano se muestra SIN colorear de bueno/malo: la polaridad cambia por
  // clave (`local_only: true` es bueno; `red_saliente: true` no lo sería), y
  // solo la app sabe cuál es cuál. El `detalle` lleva la explicación real.
  const banderas = Object.entries(privacidad).filter(
    ([clave, valor]) => clave !== "detalle" && typeof valor === "boolean",
  ) as Array<[string, boolean]>;

  return (
    <article
      data-app-slug={ancla.slug}
      data-estado={ancla.estado}
      className="tarjeta-vitrina overflow-hidden rounded-[10px] border border-paper-3 bg-paper-0 shadow-sh-1"
    >
      {/* ── Cabecera: siempre visible, es el gancho ─────────────────────── */}
      <h2 className="m-0 font-normal">
        <button
          type="button"
          className="tarjeta-boton flex min-h-11 w-full cursor-pointer items-start gap-4 p-6 text-left transition-transform duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-sky-ink active:scale-[0.995] md:p-8"
          aria-expanded="false"
          aria-controls={idDetalle}
        >
          <span className="flex-1">
            <span className="mb-3 flex flex-wrap items-center gap-2">
              <span
                title={t(`estadoAyuda.${ancla.estado}`)}
                className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase ${colorEstado[ancla.estado]}`}
              >
                {t(`estados.${ancla.estado}`)}
              </span>
              <span className="rounded-full border border-paper-3 px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase">
                {ancla.ciclo}
              </span>
            </span>
            <span className="block font-display text-2xl font-medium tracking-[-0.015em] text-ink-0">
              {exp.app.nombre}
            </span>
            <span className="mt-1 block max-w-[46ch] font-display text-[clamp(1.05rem,2.2vw,1.3rem)] leading-snug text-ink-1">
              {promesa.tagline}
            </span>
          </span>
          <ChevronDown
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="tarjeta-chevron mt-1 shrink-0 text-ink-2"
          />
        </button>
      </h2>

      {/* ── Detalle: se abre al llegar leyendo ──────────────────────────── */}
      <div className="tarjeta-detalle" id={idDetalle}>
        <div className="tarjeta-detalle-interior">
          <div className="tarjeta-detalle-cuerpo flex flex-col gap-8 border-t border-paper-2 px-6 pt-6 pb-8 md:px-8">
            {/* La MUESTRA primero: ancla las palabras que vienen detrás. */}
            <figure className="escalona m-0">
              <div className="overflow-hidden rounded-[10px] border border-paper-2 bg-paper-1 p-3">
                <Maqueta slug={ancla.slug} />
              </div>
              <figcaption className="mt-2 text-[13px] leading-relaxed text-ink-2">
                {t("muestraPie")}
              </figcaption>
            </figure>

            {/* Promesa larga + a quién sirve + qué no hace nadie más */}
            <div className="escalona flex flex-col gap-5">
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
            </div>

            {/* Métricas: cada cifra con su procedencia */}
            <section
              className="escalona"
              aria-label={`${t("metricas")} — ${exp.app.nombre}`}
            >
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
                    <p className="text-sm leading-snug text-ink-1">
                      {m.etiqueta}
                    </p>
                    {/* La regla madre del contrato: una cifra sin procedencia
                        no entra — y aquí la procedencia se VE. */}
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

            {/* Funcionalidades por grupo + descartadas */}
            <section
              className="escalona"
              aria-label={`${t("funcionalidades")} — ${exp.app.nombre}`}
            >
              <p className={`mb-4 ${ROTULO}`}>
                {t("verFuncionalidades", { n: funcionalidades.total })}
              </p>
              <div className="flex flex-col gap-7">
                {funcionalidades.grupos
                  .slice()
                  .sort((a, b) => a.orden - b.orden)
                  .map((g) => (
                    <section key={g.nombre} aria-label={g.nombre}>
                      <h3 className="flex items-baseline gap-2 font-display text-base font-medium text-ink-0">
                        {g.estrella && (
                          <span
                            aria-hidden="true"
                            title="Grupo estrella"
                            className="text-sage-ink"
                          >
                            ◆
                          </span>
                        )}
                        {g.nombre}
                      </h3>
                      <p className="mt-0.5 mb-3 text-sm text-ink-2 italic">
                        {g.linea}
                      </p>
                      <ul className="flex flex-col gap-3">
                        {g.features.map((f) => (
                          <li
                            key={f.id}
                            data-feature-id={f.id}
                            className="border-l-2 border-paper-3 pl-4"
                          >
                            <p className="text-sm font-medium text-ink-0">
                              {f.nombre}
                            </p>
                            <p className="mt-0.5 text-sm leading-relaxed text-ink-2">
                              {f.que_hace}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}

                {funcionalidades.descartadas.length > 0 && (
                  <section aria-label={t("descartadas")}>
                    <h3 className="font-display text-base font-medium text-ink-0">
                      {t("descartadas")}
                    </h3>
                    <ul className="mt-3 flex flex-col gap-3">
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
                  </section>
                )}
              </div>
            </section>

            {/* Privacidad · stack · acceso · anclaje */}
            <div className="escalona flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <section aria-label={`${t("privacidad")} — ${exp.app.nombre}`}>
                  <p className={`mb-2 ${ROTULO}`}>{t("privacidad")}</p>
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
                  <p className="text-sm leading-relaxed text-ink-2">
                    {privacidad.detalle}
                  </p>
                </section>

                <section aria-label={`${t("stack")} — ${exp.app.nombre}`}>
                  <p className={`mb-2 ${ROTULO}`}>{t("stack")}</p>
                  <ul className="flex flex-col gap-1.5">
                    {stack.map((s) => (
                      <li
                        key={s.nombre}
                        className="text-sm leading-snug text-ink-2"
                      >
                        <span className="font-medium text-ink-1">
                          {s.nombre}
                        </span>{" "}
                        — {s.papel}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* La RAZÓN en lugar del enlace + CTA de lista de espera */}
              <div className="flex flex-col gap-3 rounded-[6px] bg-paper-1 p-5">
                <p className={ROTULO}>{t("acceso")}</p>
                <p className="text-sm leading-relaxed text-ink-1">
                  {enlaces.razon}
                </p>
                <p className="text-sm leading-relaxed text-ink-2">
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
              </div>

              <p className="font-mono text-[11px] leading-relaxed text-ink-2">
                {t("anclaje", {
                  fecha: ancla.actualizado,
                  version: ancla.versionRepo,
                  sprints: ancla.sprintsCerrados,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
