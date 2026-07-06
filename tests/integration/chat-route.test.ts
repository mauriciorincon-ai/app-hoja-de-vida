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

const spyLlm = vi.mocked(streamRespuesta);
let ipSeq = 0;

function chatRequest(
  body: unknown,
  { ip }: { ip?: string } = {},
): Promise<Response> {
  const request = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": ip ?? `10.0.0.${++ipSeq}`,
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
});

afterEach(() => {
  vi.unstubAllEnvs();
  resetRateLimit();
  resetBreaker();
  spyLlm.mockClear();
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
