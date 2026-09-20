// @vitest-environment node
import { execFileSync } from "node:child_process";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { resetBreaker } from "@/lib/ia/breaker";
import { RESPUESTA_OFFTOPIC } from "@/lib/ia/guardrails";
import { resetRateLimit } from "@/lib/rate-limit";

/**
 * Integration del endpoint /api/chat con el proveedor SIEMPRE mockeado
 * (CHAT_PROVIDER=mock — la CI jamás llama un proveedor real). El spy sobre
 * streamRespuesta verifica el criterio "off-topic = CERO llamadas al LLM".
 */

vi.mock("@/lib/ia/client", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/ia/client")>();
  return { ...mod, streamRespuesta: vi.fn(mod.streamRespuesta) };
});

import { streamRespuesta } from "@/lib/ia/client";
import { POST } from "@/app/api/chat/route";
import { emitirSesion } from "@/lib/chat-registro/sesion";
import { resetStoreEnMemoria, resolverStore } from "@/lib/chat-registro/store";

const SECRETO = "secreto-de-prueba-con-mas-de-treinta-y-dos-caracteres";
/** La cookie de una visitante ya registrada (ADR-024). */
const cookieDePrueba = () =>
  `cv_chat=${encodeURIComponent(emitirSesion({ nombre: "Ana Prueba", email: "ana@prueba.co" }, SECRETO).valor)}`;

const spyLlm = vi.mocked(streamRespuesta);
let ipSeq = 0;

function chatRequest(
  body: unknown,
  { ip, sinSesion = false }: { ip?: string; sinSesion?: boolean } = {},
): Promise<Response> {
  const request = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": ip ?? `10.0.0.${++ipSeq}`,
      ...(sinSesion ? {} : { cookie: cookieDePrueba() }),
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return POST(request);
}

const preguntaValida = {
  locale: "es",
  messages: [
    {
      role: "user",
      content: "¿Qué hizo Henry en Vesting con Microsoft Fabric?",
    },
  ],
};

beforeAll(() => {
  // Los índices son artefactos de build (gitignored): generarlos antes
  execFileSync(process.execPath, ["scripts/build-chat-index.mjs"], {
    cwd: process.cwd(),
  });
});

beforeEach(() => {
  vi.stubEnv("CHAT_PROVIDER", "mock");
  vi.stubEnv("CHAT_ENABLED", "true");
  vi.stubEnv("CHAT_MOCK_MODE", "ok");
  vi.stubEnv("CHAT_GATE", "on");
  vi.stubEnv("CHAT_GATE_STORE", "memory");
  vi.stubEnv("CHAT_SESSION_SECRET", SECRETO);
});

afterEach(() => {
  vi.unstubAllEnvs();
  resetRateLimit();
  resetBreaker();
  resetStoreEnMemoria();
  spyLlm.mockClear();
});

const entradas = () =>
  (resolverStore() as ReturnType<typeof import("@/lib/chat-registro/store").crearStoreEnMemoria>).entradas;

describe("la puerta y el registro (ADR-024)", () => {
  it("sin cookie → 401 registro_requerido, sin tocar el proveedor ni el índice", async () => {
    const res = await chatRequest(preguntaValida, { sinSesion: true });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "registro_requerido" });
    expect(spyLlm).not.toHaveBeenCalled();
  });

  it("con la puerta apagada (CHAT_GATE=off) no se exige cookie ni se registra", async () => {
    vi.stubEnv("CHAT_GATE", "off");
    const res = await chatRequest(preguntaValida, { sinSesion: true });
    expect(res.status).toBe(200);
    await res.text();
    expect(entradas()).toHaveLength(0);
  });

  it("sin CHAT_SESSION_SECRET la puerta no puede operar: 503 honesto", async () => {
    vi.stubEnv("CHAT_SESSION_SECRET", "");
    const res = await chatRequest(preguntaValida);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "registro_no_disponible" });
  });

  it("una respuesta del modelo queda registrada: quién, qué, respuesta, fuentes, modo ia y costo", async () => {
    const res = await chatRequest(preguntaValida);
    await res.text();
    await new Promise((r) => setTimeout(r, 20));
    expect(entradas()).toHaveLength(1);
    expect(entradas()[0]).toMatchObject({
      nombre: "Ana Prueba",
      email: "ana@prueba.co",
      locale: "es",
      pregunta: preguntaValida.messages[0].content,
      modo: "ia",
      proveedor: "mock",
    });
    expect(entradas()[0].respuesta).toContain("[1]");
    expect(entradas()[0].fuentes.some((f) => f.ancla === "/proyectos/vesting")).toBe(true);
  });

  it("la respuesta estática de una ajena también se registra, como modo offtopic", async () => {
    const res = await chatRequest({
      locale: "es",
      messages: [{ role: "user", content: "cuéntame un chiste de gatos" }],
    });
    await res.text();
    await new Promise((r) => setTimeout(r, 20));
    expect(entradas()).toHaveLength(1);
    expect(entradas()[0].modo).toBe("offtopic");
  });
});

describe("kill-switch y límites", () => {
  it("CHAT_ENABLED=false responde 503 chat_disabled sin tocar nada más", async () => {
    vi.stubEnv("CHAT_ENABLED", "false");
    const res = await chatRequest(preguntaValida);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "chat_disabled" });
    expect(spyLlm).not.toHaveBeenCalled();
  });

  it("rate limit por IP: la petición 11 del minuto recibe 429", async () => {
    const ip = "10.9.9.9";
    for (let i = 0; i < 10; i++) {
      const res = await chatRequest(preguntaValida, { ip });
      expect(res.status).toBe(200);
    }
    const res = await chatRequest(preguntaValida, { ip });
    expect(res.status).toBe(429);
  });

  it("body no-JSON → 400 invalid_body; campos inválidos → 400 invalid_fields", async () => {
    expect((await chatRequest("esto no es json")).status).toBe(400);
    const res = await chatRequest({ locale: "fr", messages: [] });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_fields" });
    expect(spyLlm).not.toHaveBeenCalled();
  });
});

describe("guardrail off-topic (criterio: cero invocaciones al proveedor)", () => {
  it("pregunta ajena → respuesta estática en el idioma de la página, sin LLM", async () => {
    const res = await chatRequest({
      locale: "es",
      messages: [{ role: "user", content: "cuéntame un chiste de gatos" }],
    });
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("data-offtopic");
    expect(body).toContain(RESPUESTA_OFFTOPIC.es.slice(0, 30));
    expect(spyLlm).not.toHaveBeenCalled();
  });

  it("en /en la estática sale en inglés", async () => {
    const res = await chatRequest({
      locale: "en",
      messages: [{ role: "user", content: "tell me a joke about cats" }],
    });
    const body = await res.text();
    expect(body).toContain(RESPUESTA_OFFTOPIC.en.slice(0, 30));
    expect(spyLlm).not.toHaveBeenCalled();
  });
});

describe("happy path (mock provider): streaming + citas", () => {
  it("responde en streaming con data-fuentes navegables y texto citado [1]", async () => {
    const res = await chatRequest(preguntaValida);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(spyLlm).toHaveBeenCalledTimes(1);
    // Citas estructuradas: fuentes numeradas con ancla de destino
    expect(body).toContain("data-fuentes");
    expect(body).toContain("/proyectos/vesting");
    // La respuesta del modelo llegó en el stream, con su marca [1]
    expect(body).toContain("Vesting");
    expect(body).toContain("[1]");
  });

  it("el system prompt viaja endurecido y con las fuentes reales", async () => {
    await chatRequest(preguntaValida);
    const llamada = spyLlm.mock.calls[0][0];
    expect(llamada.system).toContain("ÚNICAMENTE");
    expect(llamada.system).toContain("[1]");
    expect(llamada.system).toMatch(/Vesting/);
    expect(llamada.modelo.proveedor).toBe("mock");
  });
});

describe("degradación: proveedor ausente, caído y circuit breaker", () => {
  it("sin proveedor configurado (groq sin API key) → 503 fallback", async () => {
    vi.stubEnv("CHAT_PROVIDER", "groq");
    vi.stubEnv("GROQ_API_KEY", "");
    const res = await chatRequest(preguntaValida);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "fallback" });
  });

  it("proveedor caído: el stream lleva la parte de error (el cliente degrada)", async () => {
    vi.stubEnv("CHAT_MOCK_MODE", "error");
    const res = await chatRequest(preguntaValida);
    expect(res.status).toBe(200); // el fallo ocurre dentro del stream
    const body = await res.text();
    expect(body).toContain("provider_error");
  });

  it("tras 3 fallas consecutivas el breaker abre: fallback inmediato sin tocar el proveedor", async () => {
    vi.stubEnv("CHAT_MOCK_MODE", "error");
    for (let i = 0; i < 3; i++) {
      const res = await chatRequest(preguntaValida);
      await res.text(); // consumir el stream registra la falla
    }
    spyLlm.mockClear();
    const res = await chatRequest(preguntaValida);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "fallback" });
    expect(spyLlm).not.toHaveBeenCalled();
  });
});
