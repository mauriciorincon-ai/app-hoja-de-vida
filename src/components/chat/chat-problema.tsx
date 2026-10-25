"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * «¿Algo no funciona? Avisa a Henry» (revisión 2026-09-24, pedido del dueño;
 * en el S24, OM-15, también DENTRO del chat con la sesión abierta). Junto a
 * «Pedir otro código» —y en el primer paso, cuando algo falló— el visitante
 * atascado puede avisar sin salir del panel; con la sesión abierta, desde el
 * pie del chat en cualquier momento. No es un <form>: vive dentro del
 * formulario del código, y un formulario anidado es HTML inválido.
 *
 * Los pasos `datos` y `codigo` mandan el nombre y el correo que el visitante
 * escribió. El paso `chat` NO manda ni uno ni otro: el servidor los toma de la
 * cookie firmada de la sesión (ADR-024), así que el correo jamás vuelve al
 * navegador ni se vuelve a pedir.
 */
export type PasoDelAviso = "datos" | "codigo" | "chat";

export function ChatProblema({
  paso,
  nombre,
  email,
  locale,
}: {
  paso: PasoDelAviso;
  /** Solo en la puerta: lo que el visitante escribió. En el chat lo pone la sesión. */
  nombre?: string;
  email?: string;
  locale: "es" | "en";
}) {
  const t = useTranslations("chat");
  const [abierto, setAbierto] = useState(false);
  const [detalle, setDetalle] = useState("");
  const [estado, setEstado] = useState<
    "idle" | "enviando" | "enviado" | "error" | "correo"
  >("idle");
  const detalleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (abierto) detalleRef.current?.focus();
  }, [abierto]);

  async function enviar() {
    if (estado === "enviando") return;
    setEstado("enviando");
    try {
      const res = await fetch("/api/chat/problema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          paso === "chat"
            ? { locale, paso, detalle, website: "" }
            : { nombre, email, locale, paso, detalle, website: "" },
        ),
      });
      if (res.status === 400) {
        setEstado("correo");
        return;
      }
      if (!res.ok) {
        setEstado("error");
        return;
      }
      trackEvent("chat_registro_problema", { paso });
      setEstado("enviado");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "enviado") {
    return (
      <p
        role="status"
        data-testid="chat-problema-enviado"
        className="rounded-xl bg-sage px-3 py-2 text-xs leading-relaxed text-sage-ink"
      >
        {paso === "chat"
          ? t("problemaEnviadoChat")
          : t("problemaEnviado", { email: email ?? "" })}
      </p>
    );
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        data-testid="chat-problema-abrir"
        className="py-1 text-xs text-ink-2 underline decoration-paper-3 underline-offset-2 hover:text-ink-0"
      >
        {t("problemaAbrir")}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-labelledby={`chat-problema-titulo-${paso}`}
      data-testid="chat-problema"
      className="flex w-full flex-col gap-2 rounded-xl border border-paper-3 bg-paper-1 p-3"
    >
      <label
        id={`chat-problema-titulo-${paso}`}
        htmlFor={`chat-problema-detalle-${paso}`}
        className="text-xs text-ink-1"
      >
        {t("problemaEtiqueta")}
      </label>
      <textarea
        ref={detalleRef}
        id={`chat-problema-detalle-${paso}`}
        rows={paso === "chat" ? 2 : 3}
        maxLength={600}
        value={detalle}
        onChange={(e) => setDetalle(e.target.value)}
        placeholder={t("problemaPlaceholder")}
        data-testid="chat-problema-detalle"
        className="w-full resize-none rounded-lg border border-paper-3 bg-paper-0 px-3 py-2 text-sm text-ink-0 placeholder:text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink-0"
      />
      {(estado === "error" || estado === "correo") && (
        <p role="alert" className="text-xs text-ink-1">
          {estado === "correo" ? t("problemaCorreo") : t("problemaError")}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void enviar()}
          disabled={estado === "enviando"}
          data-testid="chat-problema-enviar"
          className="flex min-h-11 items-center rounded-xl bg-ink-0 px-4 text-xs font-medium text-paper-0 transition-[filter] duration-[120ms] hover:brightness-110 disabled:opacity-40 motion-reduce:transition-none"
        >
          {t("problemaEnviar")}
        </button>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="flex min-h-11 items-center text-xs text-ink-2 underline decoration-paper-3 underline-offset-2 hover:text-ink-0"
        >
          {t("problemaCancelar")}
        </button>
      </div>
    </div>
  );
}
