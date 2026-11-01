"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/analytics";
import { PROPUESTA_MAX, PROPUESTA_MIN } from "@/lib/contacto-constantes";
import {
  AreaDeTexto,
  AvisoDeError,
  Campo,
  Enviar,
  Entrada,
  ErrorDeCampo,
  Etiqueta,
  type Tono,
} from "./campos";

/**
 * «Un espacio muy simple para proponer nuevas funcionalidades ahí mismo,
 * debajo de las que acabamos de poner» (dueño, 2026-09-13). Una caja de texto,
 * correo opcional, un botón. Confirma en el sitio, sin navegar. Nada se
 * publica: llega por correo (`/api/propuestas`). Validación a mano en el
 * cliente; el endpoint valida con el schema real.
 */
type Status = "reposo" | "enviando" | "enviado" | "error";
type Errores = Partial<Record<"propuesta" | "email", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PropuestaForm({
  app,
  nombreApp,
  tono = "claro",
  conIdeas = false,
}: {
  app: string;
  nombreApp: string;
  /** `tinta` en el cierre del brochure (S30): la hoja del brochure pinta los campos. */
  tono?: Tono;
  /** En tinta: va debajo del roadmap (título más chico y una raya que lo separa) o solo en su panel. */
  conIdeas?: boolean;
}) {
  const t = useTranslations("propuesta");
  const [status, setStatus] = useState<Status>("reposo");
  const [errores, setErrores] = useState<Errores>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const payload = {
      app,
      propuesta: String(raw.propuesta ?? "").trim(),
      email: String(raw.email ?? "").trim(),
      website: String(raw.website ?? ""),
    };

    const e: Errores = {};
    if (
      payload.propuesta.length < PROPUESTA_MIN ||
      payload.propuesta.length > PROPUESTA_MAX
    ) {
      e.propuesta = t("errorTexto");
    }
    if (payload.email && !EMAIL_RE.test(payload.email)) {
      e.email = t("errorEmail");
    }
    if (Object.keys(e).length > 0) {
      setErrores(e);
      return;
    }

    setErrores({});
    setStatus("enviando");
    try {
      const res = await fetch("/api/propuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackEvent("propuesta_enviada", { app });
      form.reset();
      setStatus("enviado");
    } catch {
      trackEvent("propuesta_fallida", { app });
      setStatus("error");
    }
  }

  const enviando = status === "enviando";
  const tinta = tono === "tinta";

  const formulario = (
    <form
      onSubmit={handleSubmit}
      noValidate
      ref={(el) => el?.setAttribute("data-hydrated", "true")}
      data-formulario="propuesta"
      aria-labelledby={`propuesta-titulo-${app}`}
      className={
        tinta
          ? "usala-form"
          : "flex flex-col gap-4 rounded-[10px] border border-paper-3 bg-paper-0 p-6 shadow-sh-1 md:p-8"
      }
    >
      {!tinta && (
        <p className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
          {t("eyebrow")}
        </p>
      )}
      <Campo tono={tono}>
        <Etiqueta
          tono={tono}
          htmlFor={`propuesta-texto-${app}`}
          id={`propuesta-titulo-${app}`}
          className={
            tinta
              ? conIdeas
                ? "h4"
                : "h3"
              : "font-display text-lg font-medium text-ink-0"
          }
        >
          {t("titulo", { app: nombreApp })}
        </Etiqueta>
        <p className={tinta ? "usala-ayuda" : "text-sm text-ink-2"}>
          {t("ayuda")}
        </p>
        <AreaDeTexto
          tono={tono}
          id={`propuesta-texto-${app}`}
          name="propuesta"
          rows={3}
          maxLength={PROPUESTA_MAX}
          placeholder={t("placeholder")}
          aria-invalid={!!errores.propuesta}
          aria-describedby={
            errores.propuesta ? `propuesta-error-${app}` : undefined
          }
          disabled={enviando}
        />
        {errores.propuesta && (
          <ErrorDeCampo tono={tono} id={`propuesta-error-${app}`}>
            {errores.propuesta}
          </ErrorDeCampo>
        )}
      </Campo>

      <Campo tono={tono}>
        <Etiqueta
          tono={tono}
          htmlFor={`propuesta-email-${app}`}
          className={tinta ? undefined : "text-sm"}
        >
          {t("email")}
        </Etiqueta>
        <Entrada
          tono={tono}
          id={`propuesta-email-${app}`}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          aria-invalid={!!errores.email}
          aria-describedby={
            errores.email ? `propuesta-error-email-${app}` : undefined
          }
          disabled={enviando}
        />
        {errores.email && (
          <ErrorDeCampo tono={tono} id={`propuesta-error-email-${app}`}>
            {errores.email}
          </ErrorDeCampo>
        )}
      </Campo>

      {/* Honeypot: invisible para humanos, irresistible para bots */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`propuesta-website-${app}`}>Website</label>
        <input
          id={`propuesta-website-${app}`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {status === "error" && (
        <AvisoDeError tono={tono}>{t("error")}</AvisoDeError>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Enviar
          tono={tono}
          linea
          type="submit"
          disabled={enviando}
          className="min-h-11 bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 hover:bg-sage hover:brightness-[0.97]"
        >
          {enviando
            ? t("enviando")
            : status === "error"
              ? t("reintentar")
              : t("enviar")}
        </Enviar>
        {status === "enviado" && (
          <p
            role="status"
            className={
              tinta
                ? "usala-ok"
                : "text-sm font-medium text-sage-ink"
            }
          >
            {t("gracias")}
          </p>
        )}
      </div>
    </form>
  );

  // En tinta, la ceja va fuera del formulario y todo cuelga de `.propon` si hay ideas encima (maqueta).
  return tinta ? (
    <div className={conIdeas ? "propon" : undefined}>
      <span className="usala-ceja">{t("eyebrow")}</span>
      {formulario}
    </div>
  ) : (
    formulario
  );
}
