import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatPanel } from "@/components/chat/chat-panel";

/**
 * «BORRAR» CON UNA RESPUESTA EN CURSO (auditoría del S24, M3). `setMessages([])`
 * sin cortar antes el stream hacía que el SDK repusiera el mensaje parcial: la
 * respuesta reaparecía sola, sin su pregunta, y el guardado la persistía. El
 * visitante creía haberla borrado y seguía en su navegador.
 *
 * `useChat` se sustituye por un doble que deja ver el ORDEN de las llamadas:
 * cortar primero, vaciar después.
 */

const llamadas: string[] = [];
const stop = vi.fn(async () => {
  llamadas.push("stop");
});
const setMessages = vi.fn((valor: unknown) => {
  llamadas.push(`setMessages:${JSON.stringify(valor)}`);
});

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: [
      {
        id: "u1",
        role: "user",
        parts: [{ type: "text", text: "¿Qué hizo en Vesting?" }],
      },
      {
        id: "a1",
        role: "assistant",
        parts: [{ type: "text", text: "Henry lideró la estrategia de da" }],
      },
    ],
    setMessages,
    sendMessage: vi.fn(),
    status: "streaming",
    stop,
  }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (clave: string) => clave,
  useLocale: () => "es",
}));

vi.mock("@/i18n/navigation", () => ({
  Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));

beforeEach(() => {
  // jsdom no trae `scrollTo` en los elementos; el panel baja el registro con él.
  Element.prototype.scrollTo = vi.fn();
  llamadas.length = 0;
  stop.mockClear();
  setMessages.mockClear();
  localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({ gate: false, sesion: null }),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("«Borrar conversación» durante una respuesta", () => {
  it("corta el stream ANTES de vaciar la conversación", async () => {
    const { getByTestId } = render(
      <ChatPanel abierto onCerrar={() => undefined} enfocar={false} />,
    );
    const boton = await waitFor(() => getByTestId("chat-borrar"));
    fireEvent.click(boton);

    expect(stop).toHaveBeenCalledTimes(1);
    expect(setMessages).toHaveBeenCalledWith([]);
    expect(
      llamadas.indexOf("stop"),
      "stop() debe ir antes que setMessages([])",
    ).toBeLessThan(llamadas.indexOf("setMessages:[]"));
    expect(
      localStorage.getItem("cv-viva:chat:v1"),
      "con el stream en curso no se guarda nada",
    ).toBeNull();
  });
});
