"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import type { AppCard } from "@/lib/schemas";

type FieldErrors = Partial<Record<"nombre" | "email" | "app", string>>;
type Status = "reposo" | "enviando" | "error";

// Validación client-side a mano: zod NO entra al bundle del navegador
// (el endpoint valida con el schema real — esa es la fuente de verdad).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SolicitarAccesoForm({ apps }: { apps: AppCard[] }) {
  const t = useTranslations("form");
  const locale = useLocale() as "es" | "en";
  const router = useRouter();
  const [status, setStatus] = useState<Status>("reposo");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const payload = {
      nombre: String(raw.nombre ?? "").trim(),
      email: String(raw.email ?? "").trim(),
      app: String(raw.app ?? "").trim(),
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
    if (!payload.app) {
      fieldErrors.app = t("errores.appRequerida");
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
      trackEvent("solicitud_enviada", { app: payload.app });
      router.push("/solicitud-enviada");
    } catch {
      trackEvent("solicitud_fallida", { app: payload.app });
      setStatus("error");
    }
  }

  const enviando = status === "enviando";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      // Marcador de hidratación: los e2e esperan a que el handler exista
      ref={(el) => el?.setAttribute("data-hydrated", "true")}
      aria-label={t("titulo")}
      className="flex flex-col gap-5 rounded-[10px] border border-paper-3 bg-paper-0 p-6 shadow-sh-1 md:p-8"
    >
      <h3 className="font-display text-xl font-medium text-ink-0">
        {t("titulo")}
      </h3>

      <div className="flex flex-col gap-2">
        <Label htmlFor="solicitud-nombre">{t("nombre")}</Label>
        <Input
          id="solicitud-nombre"
          name="nombre"
          autoComplete="name"
          maxLength={120}
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? "error-nombre" : undefined}
          disabled={enviando}
        />
        {errors.nombre && (
          <p id="error-nombre" role="alert" className="text-sm text-rose-ink">
            {errors.nombre}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="solicitud-email">{t("email")}</Label>
        <Input
          id="solicitud-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "error-email" : undefined}
          disabled={enviando}
        />
        {errors.email && (
          <p id="error-email" role="alert" className="text-sm text-rose-ink">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="solicitud-app">{t("app")}</Label>
        <select
          id="solicitud-app"
          name="app"
          defaultValue=""
          aria-invalid={!!errors.app}
          aria-describedby={errors.app ? "error-app" : undefined}
          disabled={enviando}
          className="flex h-9 w-full min-w-0 rounded-md border border-paper-3 bg-paper-0 px-3 py-1 text-sm text-ink-1 shadow-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-sky-ink/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            —
          </option>
          {apps.map((app) => (
            <option key={app.id} value={app.id}>
              {app.nombre[locale]}
            </option>
          ))}
        </select>
        {errors.app && (
          <p id="error-app" role="alert" className="text-sm text-rose-ink">
            {errors.app}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="solicitud-mensaje">{t("mensaje")}</Label>
        <Textarea
          id="solicitud-mensaje"
          name="mensaje"
          rows={4}
          maxLength={1000}
          disabled={enviando}
        />
      </div>

      {/* Honeypot: invisible para humanos, irresistible para bots */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="solicitud-website">Website</label>
        <input
          id="solicitud-website"
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

      <Button
        type="submit"
        disabled={enviando}
        className="min-h-11 self-start bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 hover:bg-sage hover:brightness-[0.97]"
      >
        {enviando
          ? t("enviando")
          : status === "error"
            ? t("reintentar")
            : t("enviar")}
      </Button>
    </form>
  );
}
