"use client";

import { MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Lanzador flotante del chat (todas las páginas). Presupuesto respetado:
 * es un botón fijo diminuto que NO compite por el LCP (sin motion de
 * entrada) y el panel entero — useChat, MiniSearch, UI — se carga con
 * dynamic import SOLO al abrirlo: el bundle inicial queda casi intacto.
 */

const ChatPanel = dynamic(
  () => import("./chat-panel").then((m) => m.ChatPanel),
  { ssr: false },
);

export function ChatLauncher() {
  const t = useTranslations("chat");
  const [abierto, setAbierto] = useState(false);
  // El panel queda montado tras la primera apertura: la conversación
  // sobrevive a cerrar/abrir (solo se oculta visualmente).
  const [montado, setMontado] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);

  function alternar() {
    if (!abierto) {
      setMontado(true);
      trackEvent("chat_abierto");
    }
    setAbierto(!abierto);
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 print:hidden">
      {montado && (
        <ChatPanel
          abierto={abierto}
          onCerrar={() => {
            setAbierto(false);
            botonRef.current?.focus();
          }}
        />
      )}
      <button
        ref={botonRef}
        type="button"
        onClick={alternar}
        aria-expanded={abierto}
        aria-controls="chat-panel"
        data-testid="chat-launcher"
        className="flex min-h-12 items-center gap-2 rounded-full bg-ink-0 px-4 py-3 text-sm font-medium text-paper-0 shadow-sh-2 transition-[filter,transform] duration-[120ms] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-0 motion-reduce:transition-none"
      >
        {abierto ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <MessageCircle aria-hidden="true" className="size-5" />
        )}
        <span className="hidden sm:inline">
          {abierto ? t("cerrar") : t("abrir")}
        </span>
        <span className="sr-only sm:hidden">
          {abierto ? t("cerrar") : t("abrir")}
        </span>
      </button>
    </div>
  );
}
