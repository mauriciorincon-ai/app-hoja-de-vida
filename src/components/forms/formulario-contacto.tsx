"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";

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
}: {
  titulo: string;
  idPrefijo: string;
  campo: CampoSelect;
  nota?: string;
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

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      // Marcador de hidratación: los e2e esperan a que el handler exista
      ref={(el) => el?.setAttribute("data-hydrated", "true")}
      data-formulario={campo.name}
      aria-label={titulo}
      className="flex flex-col gap-5 rounded-[10px] border border-paper-3 bg-paper-0 p-6 shadow-sh-1 md:p-8"
    >
      <h3 className="font-display text-xl font-medium text-ink-0">{titulo}</h3>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("nombre")}>{t("nombre")}</Label>
        <Input
          id={id("nombre")}
          name="nombre"
          autoComplete="name"
          maxLength={120}
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? id("error-nombre") : undefined}
          disabled={enviando}
        />
        {errors.nombre && (
          <p
            id={id("error-nombre")}
            role="alert"
            className="text-sm text-rose-ink"
          >
            {errors.nombre}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("email")}>{t("email")}</Label>
        <Input
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
          <p
            id={id("error-email")}
            role="alert"
            className="text-sm text-rose-ink"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id(campo.name)}>{campo.label}</Label>
        {/* Opcional: la primera opción es válida, no un hueco. */}
        <select
          id={id(campo.name)}
          name={campo.name}
          defaultValue={inicial}
          disabled={enviando}
          className={SELECT_CLASS}
        >
          <option value="">{campo.placeholder}</option>
          {campo.opciones.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("mensaje")}>{t("mensaje")}</Label>
        <Textarea
          id={id("mensaje")}
          name="mensaje"
          rows={4}
          maxLength={1000}
          disabled={enviando}
        />
      </div>

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
        <div
          role="alert"
          className="rounded-md border border-danger/40 bg-rose px-4 py-3 text-sm text-rose-ink"
        >
          {t("errorEnvio")}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          disabled={enviando}
          className="min-h-11 bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 hover:bg-sage hover:brightness-[0.97]"
        >
          {enviando
            ? t("enviando")
            : status === "error"
              ? t("reintentar")
              : t("enviar")}
        </Button>
        {nota && <p className="text-[13px] text-ink-2">{nota}</p>}
      </div>
    </form>
  );
}
