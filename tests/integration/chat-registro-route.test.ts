// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimit } from "@/lib/rate-limit";

/**
 * Los endpoints de la barrera del chat (ADR-024) con el almacén en memoria y
 * el correo simulado (sin RESEND_API_KEY el código queda en el log). Flujo
 * completo: registro → verificar → cookie → sesión → log local. Y sus rojos:
 * código equivocado (401), honeypot (200 sin guardar), sin aviso aceptado
 * (400), sin secreto (503), sin sesión en /api/chat/log (401).
 */

vi.mock("@/lib/chat-registro/email", () => ({
  enviarCodigo: vi.fn(async () => ({ sent: false, simulated: true })),
}));

import { POST as registro } from "@/app/api/chat/registro/route";
import { POST as verificar } from "@/app/api/chat/verificar/route";
import { GET as sesion } from "@/app/api/chat/sesion/route";
import { POST as log } from "@/app/api/chat/log/route";
import { resetStoreEnMemoria, resolverStore } from "@/lib/chat-registro/store";

const SECRETO = "secreto-de-prueba-con-mas-de-treinta-y-dos-caracteres";
let ipSeq = 0;

function post(
  handler: (r: Request) => Promise<Response>,
  url: string,
  body: unknown,
  cookie?: string,
) {
  return handler(
    new Request(`http://localhost${url}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": `10.1.0.${++ipSeq}`,
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(body),
    }),
  );
}

const cookieDe = (res: Response) =>
  (res.headers.get("set-cookie") ?? "").split(";")[0];

beforeEach(() => {
  vi.stubEnv("CHAT_GATE", "on");
  vi.stubEnv("CHAT_GATE_STORE", "memory");
  vi.stubEnv("CHAT_SESSION_SECRET", SECRETO);
  vi.stubEnv("CHAT_CODIGO_PRUEBA", "246810");
  vi.stubEnv("RESEND_API_KEY", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  resetRateLimit();
  resetStoreEnMemoria();
});

const datos = {
  nombre: "Ana Pérez",
  email: "ana@ejemplo.co",
  locale: "es",
  acepta: true,
  website: "",
};

describe("registro → verificar → sesión", () => {
  it("el flujo feliz emite una cookie httpOnly y la sesión devuelve el nombre", async () => {
    const r1 = await post(registro, "/api/chat/registro", datos);
    expect(r1.status).toBe(200);
    expect(await r1.json()).toEqual({ ok: true, simulated: true });

    const r2 = await post(verificar, "/api/chat/verificar", {
      nombre: "Ana Pérez",
      email: "ana@ejemplo.co",
      codigo: "246810",
    });
    expect(r2.status).toBe(200);
    const setCookie = r2.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("cv_chat=");
    expect(setCookie).toContain("HttpOnly");

    const r3 = await sesion(
      new Request("http://localhost/api/chat/sesion", {
        headers: { cookie: cookieDe(r2) },
      }),
    );
    expect(await r3.json()).toEqual({
      gate: true,
      sesion: { nombre: "Ana Pérez" },
    });
  });

  it("sin cookie no hay sesión; con la barrera apagada tampoco hay puerta", async () => {
    const r = await sesion(new Request("http://localhost/api/chat/sesion"));
    expect(await r.json()).toEqual({ gate: true, sesion: null });
    vi.stubEnv("CHAT_GATE", "off");
    const r2 = await sesion(new Request("http://localhost/api/chat/sesion"));
    expect(await r2.json()).toEqual({ gate: false, sesion: null });
  });

  it("un código equivocado da 401 «incorrecto» y no emite cookie; el sexto intento agota", async () => {
    await post(registro, "/api/chat/registro", datos);
    for (let i = 0; i < 5; i++) {
      const r = await post(verificar, "/api/chat/verificar", {
        ...datos,
        codigo: "000000",
      });
      expect(r.status).toBe(401);
      expect((await r.json()).error).toBe("incorrecto");
      expect(r.headers.get("set-cookie")).toBeNull();
    }
    const r = await post(verificar, "/api/chat/verificar", {
      ...datos,
      codigo: "246810",
    });
    expect(r.status).toBe(401);
    expect((await r.json()).error).toBe("agotado");
  });

  it("sin pedir código antes, verificar da «sin_codigo»", async () => {
    const r = await post(verificar, "/api/chat/verificar", {
      ...datos,
      codigo: "246810",
    });
    expect(r.status).toBe(401);
    expect((await r.json()).error).toBe("sin_codigo");
  });

  it("el honeypot responde 200 sin guardar nada; sin aceptar el aviso, 400", async () => {
    const r = await post(registro, "/api/chat/registro", {
      ...datos,
      website: "http://spam",
    });
    expect(r.status).toBe(200);
    const store = resolverStore() as ReturnType<
      typeof import("@/lib/chat-registro/store").crearStoreEnMemoria
    >;
    expect(store.codigos.size).toBe(0);
    const r2 = await post(registro, "/api/chat/registro", {
      ...datos,
      acepta: false,
    });
    expect(r2.status).toBe(400);
  });

  it("sin CHAT_SESSION_SECRET la barrera responde 503 honesto", async () => {
    vi.stubEnv("CHAT_SESSION_SECRET", "");
    const r = await post(registro, "/api/chat/registro", datos);
    expect(r.status).toBe(503);
    expect((await r.json()).error).toBe("registro_no_disponible");
  });

  it("el rate limit por correo corta al cuarto pedido en diez minutos", async () => {
    for (let i = 0; i < 3; i++) {
      expect((await post(registro, "/api/chat/registro", datos)).status).toBe(
        200,
      );
    }
    expect((await post(registro, "/api/chat/registro", datos)).status).toBe(
      429,
    );
  });
});

describe("/api/chat/log — el registro de las respuestas locales", () => {
  it("exige sesión (401) y con ella guarda la entrada como modo local", async () => {
    const sinSesion = await post(log, "/api/chat/log", {
      locale: "es",
      pregunta: "¿Qué hizo en Vesting?",
      respuesta: "Fragmentos…",
    });
    expect(sinSesion.status).toBe(401);

    await post(registro, "/api/chat/registro", datos);
    const r2 = await post(verificar, "/api/chat/verificar", {
      ...datos,
      codigo: "246810",
    });
    const r = await post(
      log,
      "/api/chat/log",
      {
        locale: "es",
        pregunta: "¿Qué hizo en Vesting?",
        respuesta: "Fragmentos…",
        fuentes: [{ titulo: "Vesting", ancla: "/proyectos/vesting" }],
      },
      cookieDe(r2),
    );
    expect(r.status).toBe(200);
    const store = resolverStore() as ReturnType<
      typeof import("@/lib/chat-registro/store").crearStoreEnMemoria
    >;
    expect(store.entradas).toHaveLength(1);
    expect(store.entradas[0]).toMatchObject({
      nombre: "Ana Pérez",
      email: "ana@ejemplo.co",
      modo: "local",
      pregunta: "¿Qué hizo en Vesting?",
    });
  });
});
