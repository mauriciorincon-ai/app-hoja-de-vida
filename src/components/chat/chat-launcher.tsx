"use client";

import { MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useRef, useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  almacenDelNavegador,
  leerAbierto,
  marcarAbierto,
} from "@/lib/chat-panel-abierto";

/**
 * Lanzador flotante del chat (todas las páginas). Presupuesto respetado:
 * es un botón fijo diminuto que NO compite por el LCP (sin motion de
 * entrada) y el panel entero — useChat, MiniSearch, UI — se carga con
 * dynamic import SOLO al abrirlo: el bundle inicial queda casi intacto.
 *
 * S24 (OM-14): recargar, seguir un enlace del menú o cambiar de idioma
 * desmonta el lanzador. Si el panel estaba abierto (una marca en
 * `sessionStorage`, por pestaña) se reabre solo —cargando el panel perezoso en
 * esa visita— y SIN tomar el foco: nada roba el foco al cargar la página.
 */

const ChatPanel = dynamic(
  () => import("./chat-panel").then((m) => m.ChatPanel),
  { ssr: false },
);

/** El valor no cambia durante la vida de la página: no hay a qué suscribirse. */
const sinSuscripcion = () => () => undefined;

export function ChatLauncher() {
  const t = useTranslations("chat");
  // ¿Estaba abierto cuando la página se descargó? En el servidor, nunca: el
  // primer pintado coincide con el HTML y solo después cambia (sin desajuste).
  const abiertoAlCargar = useSyncExternalStore(
    sinSuscripcion,
    () => leerAbierto(almacenDelNavegador("sesion")),
    () => false,
  );
  // La decisión del visitante; mientras no toque nada manda la marca de la carga.
  const [eleccion, setEleccion] = useState<boolean | null>(null);
  const abierto = eleccion ?? abiertoAlCargar;
  // Reabierto solo tras una carga: no enfoca el campo hasta que el visitante
  // toque el lanzador.
  const reabierto = eleccion === null && abiertoAlCargar;
  // El panel queda montado tras la primera apertura: la conversación
  // sobrevive a cerrar/abrir (solo se oculta visualmente).
  const [montado, setMontado] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);

  function alternar() {
    const abrir = !abierto;
    if (abrir) trackEvent("chat_abierto");
    setMontado(true);
    setEleccion(abrir);
    marcarAbierto(almacenDelNavegador("sesion"), abrir);
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 print:hidden">
      {(montado || abierto) && (
        <ChatPanel
          abierto={abierto}
          enfocar={!reabierto}
          onCerrar={() => {
            setMontado(true);
            setEleccion(false);
            marcarAbierto(almacenDelNavegador("sesion"), false);
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
