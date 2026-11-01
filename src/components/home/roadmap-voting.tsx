"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Tono } from "@/components/forms/campos";
import { trackEvent } from "@/lib/analytics";

/**
 * Isla de votación del roadmap (S4). Regla dura del contador honesto:
 * - Los conteos se piden a la BD al montar (`GET /api/roadmap/votos`). Mientras
 *   cargan se muestra "cargando", nunca un 0 inventado.
 * - Si la BD no responde (503/red), la sección entra en estado "no disponible"
 *   y los botones se deshabilitan — jamás un conteo falso ni congelado.
 * - Al votar, el número que se muestra es el `total` REAL que devuelve la RPC,
 *   no un incremento optimista del cliente.
 * - Dedup de mejor esfuerzo por navegador vía localStorage (prefijo versionado
 *   por sprint); es borrable — documentado como límite honesto en el manual.
 */

export type FeatureVotable = {
  app: string;
  feature: string;
  titulo: string;
  descripcion: string;
};

export type GrupoRoadmap = {
  appId: string;
  appNombre: string;
  features: FeatureVotable[];
};

type Estado = "cargando" | "listo" | "no-disponible";
type VotoEstado = "idle" | "enviando" | "votado" | "rate-limited" | "error";

// Prefijo versionado por sprint: al abrir S5 cambia a s005 y los "ya votaste"
// del S4 no contaminan la nueva votación.
const LS_PREFIX = "cvviva:voto:s004:";

function claveLS(app: string, feature: string): string {
  return `${LS_PREFIX}${app}:${feature}`;
}

function yaVotoLocal(app: string, feature: string): boolean {
  try {
    return localStorage.getItem(claveLS(app, feature)) === "1";
  } catch {
    return false;
  }
}

export function RoadmapVoting({
  grupos,
  conNombreDeApp = true,
  tono = "claro",
  visibles,
  diferido = false,
}: {
  grupos: GrupoRoadmap[];
  /** Con una sola app (su propia página) el rótulo del grupo sobra. */
  conNombreDeApp?: boolean;
  /** `tinta` en el cierre del brochure (S30): la hoja del brochure pinta la lista, como la maqueta. */
  tono?: Tono;
  /**
   * Cuántas ideas se ven antes de «Ver las N ideas» (S30; la ficha no corta). Las demás nacen en el HTML
   * —un rastreador las lee— con `data-plegada` (no `hidden`: el preflight de Tailwind lo fuerza con `!important` y la hoja de impresión no podría mostrarlas), y el botón las muestra.
   */
  visibles?: number;
  /**
   * Pide los conteos cuando el roadmap se acerca a la vista y no al montar (S30). En el brochure el roadmap
   * vive al final de la página más pesada: pedirlos al cargar cobraba una petición que casi nadie usa (y un
   * 503 en consola donde no hay base de datos). La ficha, donde el roadmap es de lo primero que se ve, no
   * lo difiere. Sin `IntersectionObserver`, se piden al montar.
   */
  diferido?: boolean;
}) {
  const t = useTranslations("roadmap");
  const [expandido, setExpandido] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("cargando");
  const [conteos, setConteos] = useState<Record<string, number>>({});
  const [votados, setVotados] = useState<Record<string, boolean>>({});
  const [estadoVoto, setEstadoVoto] = useState<Record<string, VotoEstado>>({});

  // Carga inicial de conteos reales + hidratación del dedup local. Regla dura:
  // hasta que el estado deja de ser "cargando" los botones están DESHABILITADOS
  // (ver `deshabilitado` abajo), así que ningún voto ocurre antes de que estén
  // listos los conteos Y el dedup. El dedup (`votados`) se siembra dentro de los
  // callbacks de la promesa —no en el cuerpo del effect (leer localStorage en el
  // primer render rompería la hidratación) y no en un `.finally` posterior (dejaría
  // una ventana entre habilitar los botones y sembrar el dedup)— en el MISMO lote
  // que la transición de estado que habilita los botones.
  useEffect(() => {
    const iniciales: Record<string, boolean> = {};
    for (const g of grupos) {
      for (const f of g.features) {
        if (yaVotoLocal(f.app, f.feature)) {
          iniciales[`${f.app}:${f.feature}`] = true;
        }
      }
    }

    let vivo = true;
    function cargar() {
      trackEvent("roadmap_visto");
      fetch("/api/roadmap/votos", { headers: { accept: "application/json" } })
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        })
        .then(
          (data: {
            conteo: Array<{ app: string; feature: string; total: number }>;
          }) => {
            if (!vivo) return;
            const mapa: Record<string, number> = {};
            for (const c of data.conteo)
              mapa[`${c.app}:${c.feature}`] = c.total;
            // Merge (no reemplazo): preserva cualquier conteo real ya fijado.
            setConteos((prev) => ({ ...prev, ...mapa }));
            setVotados(iniciales);
            setEstado("listo");
          },
        )
        .catch(() => {
          if (!vivo) return;
          setVotados(iniciales);
          setEstado("no-disponible");
        });
    }

    const caja = raiz.current;
    if (!diferido || !caja || typeof IntersectionObserver === "undefined") {
      cargar();
      return () => {
        vivo = false;
      };
    }
    // Diferido: cuando falta poco para verlo (un par de pantallas), no antes. Mientras tanto los botones
    // siguen deshabilitados y el conteo dice «Cargando votos…»: nunca un número inventado.
    const mirada = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        mirada.disconnect();
        cargar();
      },
      { rootMargin: "1200px 0px" },
    );
    mirada.observe(caja);
    return () => {
      vivo = false;
      mirada.disconnect();
    };
  }, [grupos, diferido]);

  async function votar(app: string, feature: string) {
    const clave = `${app}:${feature}`;
    if (votados[clave] || estadoVoto[clave] === "enviando") return;
    setEstadoVoto((s) => ({ ...s, [clave]: "enviando" }));

    try {
      const res = await fetch("/api/roadmap/votar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ app, feature }),
      });

      if (res.status === 429) {
        setEstadoVoto((s) => ({ ...s, [clave]: "rate-limited" }));
        trackEvent("voto_rechazado", { app, feature, motivo: "rate_limited" });
        return;
      }
      if (!res.ok) {
        setEstadoVoto((s) => ({ ...s, [clave]: "error" }));
        if (res.status === 503) setEstado("no-disponible");
        trackEvent("voto_rechazado", {
          app,
          feature,
          motivo: String(res.status),
        });
        return;
      }

      const data = (await res.json()) as { total: number };
      // El conteo mostrado = el total REAL devuelto por la BD.
      setConteos((c) => ({ ...c, [clave]: data.total }));
      setVotados((v) => ({ ...v, [clave]: true }));
      setEstadoVoto((s) => ({ ...s, [clave]: "votado" }));
      try {
        localStorage.setItem(claveLS(app, feature), "1");
      } catch {
        // localStorage no disponible: el voto contó igual, solo se pierde el dedup local.
      }
      trackEvent("voto_emitido", { app, feature });
    } catch {
      setEstadoVoto((s) => ({ ...s, [clave]: "error" }));
    }
  }

  const noDisponible = estado === "no-disponible";
  const tinta = tono === "tinta";

  return (
    <div ref={raiz} className={tinta ? undefined : "flex flex-col gap-10"}>
      {noDisponible && (
        <p
          role="status"
          className={
            tinta
              ? "usala-nota"
              : "rounded-[10px] border border-peach-ink/30 bg-peach/40 px-4 py-3 text-sm text-peach-ink"
          }
        >
          {t("noDisponible")}
        </p>
      )}

      {grupos.map((grupo) => {
        const total = grupo.features.length;
        const corta = visibles !== undefined && total > visibles;
        return (
          <div
            key={grupo.appId}
            className={tinta ? undefined : "flex flex-col gap-4"}
          >
            {!tinta && (
              <h3
                className={
                  conNombreDeApp
                    ? "font-display text-lg font-medium text-ink-0"
                    : "sr-only"
                }
              >
                {grupo.appNombre}
              </h3>
            )}
            <ul
              id={`ideas-${grupo.appId}`}
              className={tinta ? "votables" : "flex flex-col gap-3"}
              // Es una lista de ideas: sin viñetas ni número, la hoja la dibuja.
              role="list"
            >
              {grupo.features.map((f, i) => {
                const clave = `${f.app}:${f.feature}`;
                const conteo = conteos[clave];
                const voto = estadoVoto[clave] ?? "idle";
                const yaVoto = votados[clave] === true;
                // Deshabilitado mientras carga: ningún voto ocurre antes de que
                // los conteos reales y el dedup estén listos (evita la carrera).
                const deshabilitado =
                  estado === "cargando" ||
                  noDisponible ||
                  yaVoto ||
                  voto === "enviando";
                const oculta = corta && !expandido && i >= visibles;
                const textoConteo =
                  estado === "cargando"
                    ? t("cargando")
                    : noDisponible
                      ? "—"
                      : t("votos", { count: conteo ?? 0 });

                return (
                  <li
                    key={clave}
                    data-feature-id={f.feature}
                    data-app-id={f.app}
                    data-plegada={oculta ? "" : undefined}
                    className={
                      tinta
                        ? "votable"
                        : "flex flex-col gap-3 rounded-[10px] border border-paper-3 bg-paper-0 p-5 shadow-sh-1 sm:flex-row sm:items-center sm:justify-between"
                    }
                  >
                    {tinta ? (
                      <div>
                        <b>{f.titulo}</b>
                        <span className="d">{f.descripcion}</span>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="font-medium text-ink-0">{f.titulo}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-2">
                          {f.descripcion}
                        </p>
                      </div>
                    )}

                    <div
                      className={
                        tinta
                          ? "votar-caja"
                          : "flex items-center gap-3 sm:flex-col sm:items-end"
                      }
                    >
                      <span
                        className={
                          tinta
                            ? "conteo"
                            : "font-mono text-[13px] tabular-nums text-ink-2"
                        }
                        data-testid="roadmap-conteo"
                      >
                        {textoConteo}
                      </span>
                      {tinta ? (
                        <button
                          type="button"
                          onClick={() => votar(f.app, f.feature)}
                          disabled={deshabilitado}
                          aria-pressed={yaVoto}
                          aria-label={t("votarAria", { feature: f.titulo })}
                          data-testid="roadmap-votar"
                          className="votar"
                        >
                          <span className="flecha" aria-hidden="true">
                            ▲
                          </span>
                          <span className="ok" aria-hidden="true">
                            ✓
                          </span>
                          <span className="rotulo">
                            {yaVoto ? t("yaVotaste") : t("votar")}
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => votar(f.app, f.feature)}
                          disabled={deshabilitado}
                          aria-label={t("votarAria", { feature: f.titulo })}
                          data-testid="roadmap-votar"
                          className="flex min-h-11 items-center rounded-full bg-sage px-4 font-mono text-[11px] tracking-[0.02em] text-sage-ink uppercase shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {yaVoto ? t("yaVotaste") : t("votar")}
                        </button>
                      )}
                    </div>

                    {voto === "rate-limited" && (
                      <p
                        role="status"
                        className={
                          tinta
                            ? "usala-nota votable-aviso"
                            : "w-full text-sm text-peach-ink sm:w-auto"
                        }
                      >
                        {t("rateLimited")}
                      </p>
                    )}
                    {voto === "error" && !noDisponible && (
                      <p
                        role="status"
                        className={
                          tinta
                            ? "usala-nota votable-aviso"
                            : "w-full text-sm text-danger sm:w-auto"
                        }
                      >
                        {t("error")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
            {corta && (
              <button
                type="button"
                onClick={() => setExpandido((v) => !v)}
                aria-expanded={expandido}
                aria-controls={`ideas-${grupo.appId}`}
                data-testid="roadmap-ver-ideas"
                className={
                  tinta
                    ? "ver-ideas"
                    : "min-h-11 self-start text-sm font-medium text-ink-1 underline underline-offset-4"
                }
              >
                {expandido ? t("verMenos") : t("verIdeas", { n: total })}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
