// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emitirSesion } from "@/lib/chat-registro/sesion";
import { resetRateLimit } from "@/lib/rate-limit";

/**
 * «¿Algo no funciona? Avísame» (revisión 2026-09-24, pedido del dueño): el
 * visitante que se atasca en la puerta del chat —el código no llega, el
 * registro falla— puede avisar sin salir del panel. El aviso llega al dueño por
 * correo con la respuesta dirigida al visitante y con el DIAGNÓSTICO del
 * servidor: el aviso tiene que funcionar justo cuando la puerta está rota, y el
 * 2026-09-22 la puerta estuvo rota por un secreto que no llegó al runtime.
 *
 * Rojos: honeypot (200 sin enviar), correo inválido (400), detalle de más de
 * 600 caracteres (400), cuarto aviso de la misma IP en diez minutos (429) y
 * fallo del proveedor de correo (502).
 */

const envio = vi.fn(async () => ({ sent: false, simulated: true }));
vi.mock("@/lib/resend", () => ({
  sendProblemaChatEmail: (...args: unknown[]) => envio(...(args as [])),
}));

import { POST as problema } from "@/app/api/chat/problema/route";

const SECRETO = "secreto-de-prueba-con-mas-de-treinta-y-dos-caracteres";
let ipSeq = 0;

function post(body: unknown, ip = `10.2.0.${++ipSeq}`, cookie?: string) {
  return problema(
    new Request("http://localhost/api/chat/problema", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": ip,
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(body),
    }),
  );
}

const aviso = {
  nombre: "Ana Pérez",
  email: "ana@ejemplo.co",
  locale: "es",
  paso: "codigo",
  detalle: "El código no me llega al correo.",
  website: "",
};

beforeEach(() => {
  vi.stubEnv("CHAT_GATE", "on");
  vi.stubEnv("CHAT_GATE_STORE", "memory");
  vi.stubEnv("CHAT_SESSION_SECRET", SECRETO);
  vi.stubEnv("RESEND_API_KEY", "");
  envio.mockClear();
});

afterEach(() => {
  vi.unstubAllEnvs();
  resetRateLimit();
});

describe("/api/chat/problema", () => {
  it("el aviso llega al dueño con el correo del visitante y el diagnóstico de la puerta", async () => {
    const r = await post(aviso);
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: true, simulated: true });
    expect(envio).toHaveBeenCalledTimes(1);
    const [enviado, diagnostico] = envio.mock.calls[0] as unknown as [
      Record<string, string>,
      Record<string, boolean>,
    ];
    expect(enviado).toMatchObject({
      email: "ana@ejemplo.co",
      paso: "codigo",
      detalle: "El código no me llega al correo.",
    });
    expect(diagnostico).toEqual({
      secreto: true,
      almacen: true,
      correo: false,
    });
  });

  it("funciona justo cuando la puerta está rota: sin secreto, el diagnóstico lo dice", async () => {
    vi.stubEnv("CHAT_SESSION_SECRET", "");
    const r = await post({ ...aviso, paso: "datos", detalle: "" });
    expect(r.status).toBe(200);
    const [, diagnostico] = envio.mock.calls[0] as unknown as [
      unknown,
      Record<string, boolean>,
    ];
    expect(diagnostico.secreto).toBe(false);
  });

  it("el honeypot responde 200 sin enviar nada", async () => {
    const r = await post({ ...aviso, website: "http://spam" });
    expect(r.status).toBe(200);
    expect(envio).not.toHaveBeenCalled();
  });

  it("sin un correo válido no hay a quién responder: 400", async () => {
    expect((await post({ ...aviso, email: "no-es-correo" })).status).toBe(400);
    expect((await post({ ...aviso, detalle: "x".repeat(601) })).status).toBe(
      400,
    );
    expect(envio).not.toHaveBeenCalled();
  });

  it("el cuarto aviso de la misma IP en diez minutos se corta: 429", async () => {
    const ip = "10.2.9.9";
    for (let i = 0; i < 3; i++)
      expect((await post(aviso, ip)).status).toBe(200);
    expect((await post(aviso, ip)).status).toBe(429);
    expect(envio).toHaveBeenCalledTimes(3);
  });

  it("si el proveedor de correo falla, 502 honesto", async () => {
    envio.mockRejectedValueOnce(new Error("Resend: caído"));
    expect((await post(aviso)).status).toBe(502);
  });
});

/**
 * S24 (OM-15): el aviso también se abre DENTRO del chat, con la sesión abierta.
 * El cuerpo no trae correo: el servidor lo toma de la cookie firmada (ADR-024).
 */
describe("/api/chat/problema — paso «chat», con la sesión abierta", () => {
  const cookie = () =>
    `cv_chat=${encodeURIComponent(
      emitirSesion({ nombre: "Ana Prueba", email: "ana@prueba.co" }, SECRETO).valor,
    )}`;
  const primerEnvio = () => envio.mock.calls[0] as unknown as [Record<string, string>];
  const dentro = { locale: "es", paso: "chat", detalle: "Se quedó pensando.", website: "" };

  it("sin correo en el cuerpo: nombre y correo salen de la cookie", async () => {
    const r = await post(dentro, undefined, cookie());
    expect(r.status).toBe(200);
    expect(envio).toHaveBeenCalledTimes(1);
    expect(primerEnvio()[0]).toMatchObject({
      nombre: "Ana Prueba",
      email: "ana@prueba.co",
      paso: "chat",
      detalle: "Se quedó pensando.",
    });
  });

  it("un correo ajeno en el cuerpo NO se lee: manda la sesión", async () => {
    const r = await post({ ...dentro, email: "otro@ajeno.co", nombre: "Otro" }, undefined, cookie());
    expect(r.status).toBe(200);
    expect(primerEnvio()[0]).toMatchObject({ email: "ana@prueba.co", nombre: "Ana Prueba" });
  });

  it("sin sesión → 401 registro_requerido y no se envía nada", async () => {
    const r = await post(dentro);
    expect(r.status).toBe(401);
    expect(await r.json()).toEqual({ error: "registro_requerido" });
    expect(envio).not.toHaveBeenCalled();
  });

  it("una cookie con otra firma tampoco abre la puerta", async () => {
    const falsa = `cv_chat=${encodeURIComponent(
      emitirSesion({ nombre: "Ana", email: "ana@prueba.co" }, "otro-secreto-de-mas-de-treinta-y-dos-caracteres").valor,
    )}`;
    expect((await post(dentro, undefined, falsa)).status).toBe(401);
    expect(envio).not.toHaveBeenCalled();
  });

  it("con la puerta apagada no hay sesión de la que leer el correo: 401", async () => {
    vi.stubEnv("CHAT_GATE", "off");
    expect((await post(dentro, undefined, cookie())).status).toBe(401);
  });

  it("el límite por IP y el honeypot siguen valiendo", async () => {
    const ip = "10.2.8.8";
    for (let i = 0; i < 3; i++) expect((await post(dentro, ip, cookie())).status).toBe(200);
    expect((await post(dentro, ip, cookie())).status).toBe(429);
    expect((await post({ ...dentro, website: "http://spam" }, "10.2.8.9", cookie())).status).toBe(200);
    expect(envio).toHaveBeenCalledTimes(3);
  });

  it("la puerta (datos, codigo) no cambió: sigue pidiendo el correo en el cuerpo", async () => {
    const { email: _quitado, ...sinCorreo } = aviso;
    void _quitado;
    expect((await post({ ...sinCorreo, paso: "codigo" })).status).toBe(400);
    expect((await post({ ...sinCorreo, paso: "datos" })).status).toBe(400);
  });
});
