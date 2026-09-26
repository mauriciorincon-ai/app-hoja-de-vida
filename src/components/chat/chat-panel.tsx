"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { agruparFuentes } from "@/lib/ia/fuentes";
import {
  createRetriever,
  type Retriever,
  TOP_K_CONTEXTO,
} from "@/lib/ia/retrieval";
import {
  parseChatIndex,
  type ChatUIMessage,
  type Fuente,
} from "@/lib/ia/schemas";
import { ChatRegistro } from "./chat-registro";

/**
 * Panel del chat (S3). Estados completos: sugerencias → escribiendo →
 * streaming con citas navegables → off-topic estático → rate-limited →
 * FALLBACK (proveedor caído ⇒ búsqueda local sobre el MISMO índice, con
 * aviso honesto — el chat nunca muere). Carga lazy vía el lanzador; el
 * índice del fallback solo se fetchea si hace falta.
 *
 * Desde ADR-024 el panel tiene una puerta: al abrirse pregunta al servidor si
 * hay sesión (`/api/chat/sesion`); si no, muestra el registro (nombre, correo,
 * código) y solo después el chat. Un 401 del chat devuelve a la puerta. Las
 * respuestas del modo local se mandan a `/api/chat/log` para que el registro
 * no tenga huecos cuando el proveedor cae.
 */

type EstadoSesion = "cargando" | "gate" | "ok";

function textoDe(m: ChatUIMessage): string {
  return m.parts
    .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join(" ");
}

function fuentesDe(m: ChatUIMessage): Fuente[] {
  const part = m.parts.find((p) => p.type === "data-fuentes");
  return part && "data" in part ? (part.data as Fuente[]) : [];
}

function recortar(texto: string, max: number): string {
  return texto.length <= max ? texto : `${texto.slice(0, max).trimEnd()}…`;
}

export function ChatPanel({
  abierto,
  onCerrar,
}: {
  abierto: boolean;
  onCerrar: () => void;
}) {
  const t = useTranslations("chat");
  const locale = useLocale() as "es" | "en";

  const [input, setInput] = useState("");
  const [modo, setModo] = useState<"ia" | "fallback">("ia");
  const [rateLimited, setRateLimited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const retrieverRef = useRef<Retriever | null>(null);
  const ultimaPreguntaRef = useRef("");
  const [sesion, setSesion] = useState<EstadoSesion>("cargando");
  const [gateActiva, setGateActiva] = useState(false);
  const [nombreVisitante, setNombreVisitante] = useState<string | null>(null);
  const [sesionPerdida, setSesionPerdida] = useState(false);

  const { messages, setMessages, sendMessage, status } = useChat<ChatUIMessage>(
    {
      transport: new DefaultChatTransport({
        api: "/api/chat",
        // Errores HTTP tipados para decidir el estado en onError
        fetch: (async (url: RequestInfo | URL, init?: RequestInit) => {
          const res = await fetch(url, init);
          if (res.status === 429) throw new Error("rate_limited");
          if (res.status === 401) throw new Error("registro_requerido");
          if (!res.ok) throw new Error("fallback");
          return res;
        }) as typeof fetch,
        // El server valida con Zod un shape plano — no el UIMessage entero
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            locale,
            messages: messages
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((m) => ({
                role: m.role as "user" | "assistant",
                content: textoDe(m).slice(0, 800),
              }))
              .filter((m) => m.content.trim().length > 0)
              .slice(-12),
          },
        }),
      }),
      onData: (part) => {
        if (part.type === "data-offtopic") trackEvent("chat_offtopic");
      },
      onFinish: () => trackEvent("chat_respuesta", { modo: "ia" }),
      onError: (error) => {
        if (error.message.includes("rate_limited")) {
          setRateLimited(true);
          return;
        }
        if (error.message.includes("registro_requerido")) {
          // La cookie venció o no existe: de vuelta a la puerta, sin perder el hilo.
          setSesionPerdida(true);
          setSesion("gate");
          return;
        }
        // Proveedor caído / sin configurar / breaker abierto → aviso honesto
        // y respuesta con búsqueda local sobre el mismo índice.
        setModo("fallback");
        trackEvent("chat_fallback");
        if (ultimaPreguntaRef.current) {
          void responderLocal(ultimaPreguntaRef.current);
        }
      },
    },
  );

  async function cargarRetriever(): Promise<Retriever> {
    if (!retrieverRef.current) {
      const res = await fetch(`/chat-index.${locale}.json`);
      const index = parseChatIndex(await res.json(), "chat-index");
      retrieverRef.current = createRetriever(index.chunks);
    }
    return retrieverRef.current;
  }

  function agregarMensaje(
    rol: "user" | "assistant",
    parts: ChatUIMessage["parts"],
  ) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: rol, parts },
    ]);
  }

  async function responderLocal(pregunta: string) {
    try {
      const retriever = await cargarRetriever();
      // El MISMO k que usa el servidor (S8). Hasta el S7 aquí había un 3
      // escrito a mano: el fallback local enseñaba menos evidencia que la que
      // el modelo habría recibido, y ninguna prueba comparaba los dos números.
      const resultados = retriever.topK(pregunta, TOP_K_CONTEXTO);
      const fuentes: Fuente[] = resultados.map((r, i) => ({
        n: i + 1,
        codigo: r.chunk.codigo,
        titulo: r.chunk.titulo,
        ancla: r.chunk.ancla,
        destino: r.chunk.destino,
      }));
      const texto =
        resultados.length === 0
          ? t("fallbackVacio")
          : `${t("fallbackAviso")}\n\n${resultados
              .map((r, i) => `[${i + 1}] ${recortar(r.chunk.texto, 220)}`)
              .join("\n\n")}`;
      agregarMensaje("assistant", [
        { type: "data-fuentes", data: fuentes },
        { type: "text", text: texto },
      ]);
      trackEvent("chat_respuesta", { modo: "fallback" });
      if (gateActiva) {
        // El servidor no vio esta respuesta: se registra desde aquí (ADR-024).
        void fetch("/api/chat/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale,
            pregunta,
            respuesta: texto.slice(0, 4000),
            fuentes: fuentes.map((f) => ({
              codigo: f.codigo,
              titulo: f.titulo,
              ancla: f.ancla,
            })),
          }),
        }).catch(() => undefined);
      }
    } catch {
      agregarMensaje("assistant", [{ type: "text", text: t("error") }]);
    }
  }

  function preguntar(texto: string) {
    const pregunta = texto.trim();
    if (!pregunta || ocupado) return;
    setRateLimited(false);
    setInput("");
    ultimaPreguntaRef.current = pregunta;
    trackEvent("chat_pregunta", { modo });
    if (modo === "fallback") {
      agregarMensaje("user", [{ type: "text", text: pregunta }]);
      void responderLocal(pregunta);
    } else {
      void sendMessage({ text: pregunta });
    }
  }

  const ocupado = status === "submitted" || status === "streaming";
  const sugerencias = [t("sugerencia1"), t("sugerencia2"), t("sugerencia3")];

  useEffect(() => {
    if (abierto && sesion === "ok") inputRef.current?.focus();
  }, [abierto, sesion]);

  // Al abrir por primera vez: ¿hay puerta, y hay sesión?
  useEffect(() => {
    if (!abierto || sesion !== "cargando") return;
    let cancelado = false;
    void fetch("/api/chat/sesion", { cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json()) as {
          gate: boolean;
          sesion: { nombre: string } | null;
        };
        if (cancelado) return;
        setGateActiva(data.gate);
        if (!data.gate || data.sesion) {
          setNombreVisitante(data.sesion?.nombre ?? null);
          setSesion("ok");
        } else {
          setSesion("gate");
        }
      })
      .catch(() => {
        // Sin respuesta del servidor no se puede saber: se muestra la puerta,
        // que a su vez dirá «no disponible» si el registro no responde.
        if (!cancelado) {
          setGateActiva(true);
          setSesion("gate");
        }
      });
    return () => {
      cancelado = true;
    };
  }, [abierto, sesion]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, status]);

  // Sin prefijo de locale: lo pone <Link>. Un ancla de la HOME («#skills») se
  // escribe «/#skills», como hacen ya las páginas de proyectos y apps.
  function hrefFuente(ancla: string): string {
    return ancla.startsWith("#") ? `/${ancla}` : ancla;
  }

  return (
    <div
      id="chat-panel"
      role="dialog"
      aria-label={t("titulo")}
      data-testid="chat-panel"
      onKeyDown={(e) => {
        if (e.key === "Escape") onCerrar();
      }}
      className={`${
        abierto ? "flex" : "hidden"
      } fixed inset-x-4 bottom-20 z-40 mx-auto h-[min(34rem,75vh)] max-w-md flex-col overflow-hidden rounded-2xl border border-paper-3 bg-paper-0 shadow-sh-2 sm:right-4 sm:left-auto sm:mx-0 sm:w-[26rem]`}
    >
      <div className="border-b border-paper-2 bg-paper-1 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-base text-ink-0">{t("titulo")}</h2>
          {modo === "fallback" && (
            <span
              data-testid="chat-modo-fallback"
              className="rounded-full bg-paper-2 px-2 py-0.5 font-mono text-[10px] tracking-[0.02em] text-ink-1 uppercase"
            >
              {t("fallbackModo")}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs leading-snug text-ink-2">
          {t("disclaimer")}
        </p>
      </div>

      {sesion === "cargando" && (
        <p
          data-testid="chat-sesion-cargando"
          className="px-4 py-4 text-xs text-ink-2"
        >
          {t("escribiendo")}
        </p>
      )}

      {sesion === "gate" && (
        <>
          {sesionPerdida && (
            <p
              data-testid="chat-sesion-perdida"
              className="px-4 pt-3 text-xs text-ink-1"
            >
              {t("sesionRequerida")}
            </p>
          )}
          <ChatRegistro
            locale={locale}
            onListo={(nombre) => {
              setNombreVisitante(nombre);
              setSesionPerdida(false);
              setSesion("ok");
              if (sesionPerdida && ultimaPreguntaRef.current) {
                void sendMessage({ text: ultimaPreguntaRef.current });
              }
            }}
          />
        </>
      )}

      {sesion === "ok" && (
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 && nombreVisitante && (
            <p data-testid="chat-saludo" className="text-sm text-ink-1">
              {t("saludo", { nombre: nombreVisitante })}
            </p>
          )}
          {messages.length === 0 && (
            <div>
              <p className="mb-2 text-xs text-ink-2">
                {t("sugerenciasTitulo")}
              </p>
              <div className="flex flex-wrap gap-2">
                {sugerencias.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => preguntar(s)}
                    className="rounded-full border border-paper-3 px-3 py-1.5 text-left text-xs text-ink-1 transition-colors duration-[120ms] hover:bg-paper-1 motion-reduce:transition-none"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const fuentes = fuentesDe(m);
            return (
              <div
                key={m.id}
                data-testid={
                  m.role === "user"
                    ? "chat-mensaje-usuario"
                    : "chat-mensaje-asistente"
                }
                className={
                  m.role === "user"
                    ? "ml-8 rounded-2xl rounded-br-sm bg-paper-1 px-3 py-2 text-sm text-ink-0"
                    : "mr-4 text-sm leading-relaxed whitespace-pre-wrap text-ink-1"
                }
              >
                {textoDe(m)}
                {m.role === "assistant" && fuentes.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] tracking-[0.02em] text-ink-2 uppercase">
                      {t("fuentes")}
                    </span>
                    {agruparFuentes(fuentes).map((f) => (
                      // <Link>, no <a>: un <a> recargaba la página entera y el
                      // visitante volvía a un panel vacío. Con navegación del
                      // lado cliente el lanzador (en el layout) y el panel
                      // (solo se oculta) conservan la conversación.
                      // Código + destino, no el título del fragmento (decisión
                      // del dueño, 2026-09-23): los documentos a fondo no se
                      // publican, así que el chip dice de qué fuente salió la
                      // frase («AF-09») y a dónde lleva la cita («Vesting»).
                      // El título completo queda en el tooltip. Los fragmentos
                      // del mismo documento y destino van en UN chip con sus
                      // números: «[3, 4] AF-17 · …» (agruparFuentes).
                      <Link
                        key={f.ns.join("-")}
                        href={hrefFuente(f.ancla)}
                        onClick={onCerrar}
                        title={f.titulo}
                        data-testid="chat-fuente"
                        className="rounded-full bg-sage px-2 py-0.5 font-mono text-[10px] text-sage-ink transition-[filter] duration-[120ms] hover:brightness-[0.97] motion-reduce:transition-none"
                      >
                        [{f.ns.join(", ")}] {f.codigo} · {f.destino}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {status === "submitted" && (
            <p
              data-testid="chat-escribiendo"
              className="animate-pulse text-xs text-ink-2 motion-reduce:animate-none"
            >
              {t("escribiendo")}
            </p>
          )}

          {rateLimited && (
            <p data-testid="chat-rate-limited" className="text-xs text-ink-2">
              {t("rateLimited")}
            </p>
          )}
        </div>
      )}

      {sesion === "ok" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            preguntar(input);
          }}
          className="flex items-center gap-2 border-t border-paper-2 p-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={800}
            aria-label={t("placeholder")}
            placeholder={t("placeholder")}
            data-testid="chat-input"
            className="min-h-11 flex-1 rounded-xl border border-paper-3 bg-paper-0 px-3 text-sm text-ink-0 placeholder:text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink-0"
          />
          <button
            type="submit"
            disabled={ocupado || input.trim().length === 0}
            aria-label={t("enviar")}
            data-testid="chat-enviar"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-ink-0 text-paper-0 transition-[filter] duration-[120ms] hover:brightness-110 disabled:opacity-40 motion-reduce:transition-none"
          >
            <Send aria-hidden="true" className="size-4" />
          </button>
        </form>
      )}
    </div>
  );
}
