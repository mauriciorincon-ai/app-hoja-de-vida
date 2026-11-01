"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
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
 * El NÚCLEO de los dos formularios de la app (decisión del dueño, bloque E del
 * gate ⭐ post-S8): el de la HOME (contacto general, elige un MOTIVO) y el de
 * la vitrina de apps (lista de espera, elige una APP). Comparten nombre,
 * correo, mensaje, honeypot, validación y envío; solo cambia el desplegable.
 * El endpoint es el mismo y valida con el schema real (zod NO entra al bundle).
 */
export type OpcionSelect = { value: string; label: string };
export type CampoSelect = {
  name: "motivo" | "app";
  label: string;
  placeholder: string;
  opciones: OpcionSelect[];
  /** Preselección (p. ej. la app cuya ficha se está leyendo). */
  inicial?: string;
};

type FieldErrors = Partial<Record<"nombre" | "email", string>>;
type Status = "reposo" | "enviando" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SELECT_CLASS =
  "flex h-9 w-full min-w-0 rounded-md border border-paper-3 bg-paper-0 px-3 py-1 text-sm text-ink-1 shadow-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-sky-ink/40 disabled:cursor-not-allowed disabled:opacity-50";

export function FormularioContacto({
  titulo,
  idPrefijo,
  campo,
  nota,
  tono = "claro",
  textoEnviar,
}: {
  titulo: string;
  idPrefijo: string;
  campo: CampoSelect;
  nota?: string;
  /** `tinta` en el cierre del brochure (S30): la hoja del brochure pinta los campos; el título lo pone el panel. */
  tono?: Tono;
  /** El rótulo del botón; sin él, el «Enviar» del formulario. */
  textoEnviar?: string;
}) {
  const t = useTranslations("form");
  const router = useRouter();
  const [status, setStatus] = useState<Status>("reposo");
  const [errors, setErrors] = useState<FieldErrors>({});

  const inicial =
    campo.inicial && campo.opciones.some((o) => o.value === campo.inicial)
      ? campo.inicial
      : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const eleccion = String(raw[campo.name] ?? "").trim();
    const payload = {
      nombre: String(raw.nombre ?? "").trim(),
      email: String(raw.email ?? "").trim(),
      [campo.name]: eleccion,
      mensaje: String(raw.mensaje ?? "").trim(),
      website: String(raw.website ?? ""),
    };

    const fieldErrors: FieldErrors = {};
    if (!payload.nombre || payload.nombre.length > 120) {
      fieldErrors.nombre = t("errores.nombreRequerido");
    }
    if (!EMAIL_RE.test(payload.email) || payload.email.length > 254) {
      fieldErrors.email = t("errores.emailInvalido");
    }
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("enviando");
    try {
      const res = await fetch("/api/solicitar-acceso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackEvent("solicitud_enviada", { [campo.name]: eleccion });
      router.push("/solicitud-enviada");
    } catch {
      trackEvent("solicitud_fallida", { [campo.name]: eleccion });
      setStatus("error");
    }
  }

  const enviando = status === "enviando";
  const id = (sufijo: string) => `${idPrefijo}-${sufijo}`;
  const tinta = tono === "tinta";
  const rotulo = enviando
    ? t("enviando")
    : status === "error"
      ? t("reintentar")
      : (textoEnviar ?? t("enviar"));

  const formulario = (
    <form
      onSubmit={handleSubmit}
      noValidate
      // Marcador de hidratación: los e2e esperan a que el handler exista
      ref={(el) => el?.setAttribute("data-hydrated", "true")}
      data-formulario={campo.name}
      aria-label={titulo}
      className={
        tinta
          ? "usala-form"
          : "flex flex-col gap-5 rounded-[10px] border border-paper-3 bg-paper-0 p-6 shadow-sh-1 md:p-8"
      }
    >
      {!tinta && (
        <h3 className="font-display text-xl font-medium text-ink-0">
          {titulo}
        </h3>
      )}

      <Campo tono={tono}>
        <Etiqueta tono={tono} htmlFor={id("nombre")}>
          {t("nombre")}
        </Etiqueta>
        <Entrada
          tono={tono}
          id={id("nombre")}
          name="nombre"
          autoComplete="name"
          maxLength={120}
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? id("error-nombre") : undefined}
          disabled={enviando}
        />
        {errors.nombre && (
          <ErrorDeCampo tono={tono} id={id("error-nombre")}>
            {errors.nombre}
          </ErrorDeCampo>
        )}
      </Campo>

      <Campo tono={tono}>
        <Etiqueta tono={tono} htmlFor={id("email")}>
          {t("email")}
        </Etiqueta>
        <Entrada
          tono={tono}
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? id("error-email") : undefined}
          disabled={enviando}
        />
        {errors.email && (
          <ErrorDeCampo tono={tono} id={id("error-email")}>
            {errors.email}
          </ErrorDeCampo>
        )}
      </Campo>

      <Campo tono={tono}>
        <Etiqueta tono={tono} htmlFor={id(campo.name)}>
          {campo.label}
        </Etiqueta>
        {/* Opcional: la primera opción es válida, no un hueco. */}
        <select
          id={id(campo.name)}
          name={campo.name}
          defaultValue={inicial}
          disabled={enviando}
          className={tinta ? undefined : SELECT_CLASS}
        >
          <option value="">{campo.placeholder}</option>
          {campo.opciones.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Campo>

      <Campo tono={tono}>
        <Etiqueta tono={tono} htmlFor={id("mensaje")}>
          {t("mensaje")}
        </Etiqueta>
        <AreaDeTexto
          tono={tono}
          id={id("mensaje")}
          name="mensaje"
          rows={4}
          maxLength={1000}
          disabled={enviando}
        />
      </Campo>

      {/* Honeypot: invisible para humanos, irresistible para bots */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={id("website")}>Website</label>
        <input
          id={id("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {status === "error" && (
        <AvisoDeError tono={tono}>{t("errorEnvio")}</AvisoDeError>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Enviar
          tono={tono}
          type="submit"
          disabled={enviando}
          className="min-h-11 bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 hover:bg-sage hover:brightness-[0.97]"
        >
          {rotulo}
        </Enviar>
        {!tinta && nota && <p className="text-[13px] text-ink-2">{nota}</p>}
      </div>
    </form>
  );

  // En tinta la nota va debajo del formulario, como en la maqueta (y al imprimir se queda, sin el formulario).
  return tinta ? (
    <>
      {formulario}
      {nota && <p className="usala-nota">{nota}</p>}
    </>
  ) : (
    formulario
  );
}
