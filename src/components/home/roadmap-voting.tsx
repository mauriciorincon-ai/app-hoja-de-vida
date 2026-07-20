"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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

export function RoadmapVoting({ grupos }: { grupos: GrupoRoadmap[] }) {
  const t = useTranslations("roadmap");
  const [estado, setEstado] = useState<Estado>("cargando");
  const [conteos, setConteos] = useState<Record<string, number>>({});
  const [votados, setVotados] = useState<Record<string, boolean>>({});
  const [estadoVoto, setEstadoVoto] = useState<Record<string, VotoEstado>>({});

  // Carga inicial de conteos reales + hidratación del dedup local. El dedup se
  // siembra en el `.finally` (callback de promesa, tras montar) y no en el
  // cuerpo del effect: leer localStorage en el primer render rompería la
  // hidratación (el server no lo ve), así que se aplica post-hidratación.
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
          for (const c of data.conteo) mapa[`${c.app}:${c.feature}`] = c.total;
          setConteos(mapa);
          setEstado("listo");
        },
      )
      .catch(() => {
        if (vivo) setEstado("no-disponible");
      })
      .finally(() => {
        if (vivo && Object.keys(iniciales).length > 0) setVotados(iniciales);
      });
    return () => {
      vivo = false;
    };
  }, [grupos]);

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

  return (
    <div className="flex flex-col gap-10">
      {noDisponible && (
        <p
          role="status"
          className="rounded-[10px] border border-peach-ink/30 bg-peach/40 px-4 py-3 text-sm text-peach-ink"
        >
          {t("noDisponible")}
        </p>
      )}

      {grupos.map((grupo) => (
        <div key={grupo.appId} className="flex flex-col gap-4">
          <h3 className="font-display text-lg font-medium text-ink-0">
            {grupo.appNombre}
          </h3>
          <ul className="flex flex-col gap-3">
            {grupo.features.map((f) => {
              const clave = `${f.app}:${f.feature}`;
              const conteo = conteos[clave];
              const voto = estadoVoto[clave] ?? "idle";
              const yaVoto = votados[clave] === true;
              const deshabilitado =
                noDisponible || yaVoto || voto === "enviando";

              return (
                <li
                  key={clave}
                  data-feature-id={f.feature}
                  data-app-id={f.app}
                  className="flex flex-col gap-3 rounded-[10px] border border-paper-3 bg-paper-0 p-5 shadow-sh-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-ink-0">{f.titulo}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">
                      {f.descripcion}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <span
                      className="font-mono text-[13px] tabular-nums text-ink-2"
                      data-testid="roadmap-conteo"
                    >
                      {estado === "cargando"
                        ? t("cargando")
                        : noDisponible
                          ? "—"
                          : t("votos", { count: conteo ?? 0 })}
                    </span>
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
                  </div>

                  {voto === "rate-limited" && (
                    <p
                      role="status"
                      className="w-full text-sm text-peach-ink sm:w-auto"
                    >
                      {t("rateLimited")}
                    </p>
                  )}
                  {voto === "error" && !noDisponible && (
                    <p
                      role="status"
                      className="w-full text-sm text-danger sm:w-auto"
                    >
                      {t("error")}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
