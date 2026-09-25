"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * La barrera del chat (ADR-024): nombre y correo → código de seis dígitos por
 * email → sesión. Dos pasos en el mismo panel. Todo el juicio (validez del
 * código, intentos, vigencia) es del servidor; aquí solo hay estados y mensajes.
 */

type Paso = "datos" | "codigo";

export function ChatRegistro({
  locale,
  onListo,
}: {
  locale: "es" | "en";
  onListo: (nombre: string) => void;
}) {
  const t = useTranslations("chat");
  const [paso, setPaso] = useState<Paso>("datos");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [simulado, setSimulado] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const codigoRef = useRef<HTMLInputElement>(null);

  // El foco aterriza donde hay que escribir: el nombre al abrir, el código al llegar al paso 2.
  useEffect(() => {
    (paso === "datos" ? nombreRef : codigoRef).current?.focus();
  }, [paso]);

  const mensajeDe = (code: string): string => {
    if (code === "rate_limited") return t("registroRateLimited");
    if (code === "registro_no_disponible") return t("registroNoDisponible");
    if (code === "incorrecto") return t("codigoIncorrecto");
    if (code === "vencido" || code === "agotado" || code === "sin_codigo")
      return t("codigoVencido");
    return t("registroError");
  };

  async function pedirCodigo(e?: React.FormEvent) {
    e?.preventDefault();
    if (ocupado || !acepta) return;
    setOcupado(true);
    setError(null);
    try {
      const res = await fetch("/api/chat/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, locale, acepta, website: "" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        simulated?: boolean;
      };
      if (!res.ok) {
        setError(mensajeDe(data.error ?? "error"));
        return;
      }
      setSimulado(Boolean(data.simulated));
      setPaso("codigo");
      setCodigo("");
      trackEvent("chat_registro_codigo_pedido");
    } catch {
      setError(t("registroError"));
    } finally {
      setOcupado(false);
    }
  }

  async function verificar(e: React.FormEvent) {
    e.preventDefault();
    if (ocupado) return;
    setOcupado(true);
    setError(null);
    try {
      const res = await fetch("/api/chat/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, codigo }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        nombre?: string;
      };
      if (!res.ok) {
        setError(mensajeDe(data.error ?? "error"));
        return;
      }
      trackEvent("chat_registro_verificado");
      onListo(data.nombre ?? nombre);
    } catch {
      setError(t("registroError"));
    } finally {
      setOcupado(false);
    }
  }

  const campo =
    "min-h-11 w-full rounded-xl border border-paper-3 bg-paper-0 px-3 text-sm text-ink-0 placeholder:text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink-0";
  const boton =
    "flex min-h-11 w-full items-center justify-center rounded-xl bg-ink-0 px-4 text-sm font-medium text-paper-0 transition-[filter] duration-[120ms] hover:brightness-110 disabled:opacity-40 motion-reduce:transition-none";

  if (paso === "codigo") {
    return (
      <form
        onSubmit={verificar}
        data-testid="chat-registro-codigo"
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      >
        <h3 className="font-display text-base text-ink-0">
          {t("codigoTitulo")}
        </h3>
        <p className="text-sm leading-relaxed text-ink-1">
          {t("codigoIntro", { email })}
        </p>
        {simulado && (
          <p
            data-testid="chat-registro-simulado"
            className="text-xs text-ink-2"
          >
            {t("codigoSimulado")}
          </p>
        )}
        <label className="text-xs text-ink-2" htmlFor="chat-codigo">
          {t("codigoEtiqueta")}
        </label>
        <input
          ref={codigoRef}
          id="chat-codigo"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/[^0-9]/g, ""))}
          data-testid="chat-registro-input-codigo"
          className={`${campo} font-mono tracking-[0.3em]`}
        />
        {error && (
          <p
            role="alert"
            data-testid="chat-registro-error"
            className="text-xs text-ink-1"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={ocupado || codigo.length !== 6}
          data-testid="chat-registro-verificar"
          className={boton}
        >
          {t("codigoVerificar")}
        </button>
        <button
          type="button"
          onClick={() => void pedirCodigo()}
          disabled={ocupado}
          className="text-xs text-ink-1 underline underline-offset-2"
        >
          {t("codigoReenviar")}
        </button>
        <ReportarProblema
          paso="codigo"
          nombre={nombre}
          email={email}
          locale={locale}
        />
      </form>
    );
  }

  return (
    <form
      onSubmit={pedirCodigo}
      data-testid="chat-registro"
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
    >
      <h3 className="font-display text-base text-ink-0">
        {t("registroTitulo")}
      </h3>
      <p className="text-sm leading-relaxed text-ink-1">{t("registroIntro")}</p>
      <label className="sr-only" htmlFor="chat-nombre">
        {t("registroNombre")}
      </label>
      <input
        ref={nombreRef}
        id="chat-nombre"
        type="text"
        autoComplete="name"
        required
        minLength={2}
        maxLength={120}
        placeholder={t("registroNombre")}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        data-testid="chat-registro-nombre"
        className={campo}
      />
      <label className="sr-only" htmlFor="chat-email">
        {t("registroEmail")}
      </label>
      <input
        id="chat-email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        placeholder={t("registroEmail")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        data-testid="chat-registro-email"
        className={campo}
      />
      <label className="flex items-start gap-2 text-xs leading-snug text-ink-1">
        <input
          type="checkbox"
          required
          checked={acepta}
          onChange={(e) => setAcepta(e.target.checked)}
          data-testid="chat-registro-acepta"
          className="mt-0.5 size-4 shrink-0"
        />
        <span>{t("registroAcepta")}</span>
      </label>
      {error && (
        <p
          role="alert"
          data-testid="chat-registro-error"
          className="text-xs text-ink-1"
        >
          {error}
        </p>
      )}
      {error && (
        <ReportarProblema
          paso="datos"
          nombre={nombre}
          email={email}
          locale={locale}
        />
      )}
      <button
        type="submit"
        disabled={ocupado || !acepta || nombre.trim().length < 2 || !email}
        data-testid="chat-registro-enviar"
        className={boton}
      >
        {ocupado ? t("registroEnviando") : t("registroEnviar")}
      </button>
    </form>
  );
}

/**
 * «¿Algo no funciona? Avísame» (revisión 2026-09-24, pedido del dueño). Junto a
 * «Pedir otro código» —y en el primer paso, cuando algo falló— el visitante
 * atascado puede avisar sin salir del panel. No es un <form>: vive dentro del
 * formulario del código, y un formulario anidado es HTML inválido.
 */
function ReportarProblema({
  paso,
  nombre,
  email,
  locale,
}: {
  paso: "datos" | "codigo";
  nombre: string;
  email: string;
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
        body: JSON.stringify({
          nombre,
          email,
          locale,
          paso,
          detalle,
          website: "",
        }),
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
        {t("problemaEnviado", { email })}
      </p>
    );
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        data-testid="chat-problema-abrir"
        className="text-xs text-ink-2 underline decoration-paper-3 underline-offset-2 hover:text-ink-0"
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
      className="flex flex-col gap-2 rounded-xl border border-paper-3 bg-paper-1 p-3"
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
        rows={3}
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
