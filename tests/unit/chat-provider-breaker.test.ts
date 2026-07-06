import { afterEach, describe, expect, it } from "vitest";
import {
  BREAKER_COOLDOWN_MS,
  BREAKER_UMBRAL_FALLAS,
  breakerAbierto,
  registrarExito,
  registrarFalla,
  resetBreaker,
} from "@/lib/ia/breaker";
import { chatHabilitado, resolverProveedor } from "@/lib/ia/provider";
import { chatRequestSchema } from "@/lib/ia/schemas";

describe("adapter multi-proveedor por env (ADR-003)", () => {
  it("groq con key resuelve con su modelo default", () => {
    const m = resolverProveedor({
      CHAT_PROVIDER: "groq",
      GROQ_API_KEY: "gsk_test",
    } as unknown as NodeJS.ProcessEnv);
    expect(m?.proveedor).toBe("groq");
    expect(m?.modelId).toBe("llama-3.3-70b-versatile");
    expect(m?.model).toBeDefined();
  });

  it("groq es el proveedor por defecto cuando CHAT_PROVIDER no está", () => {
    const m = resolverProveedor({
      GROQ_API_KEY: "gsk_test",
    } as unknown as NodeJS.ProcessEnv);
    expect(m?.proveedor).toBe("groq");
  });

  it("CHAT_MODEL sobreescribe el default sin tocar código", () => {
    const m = resolverProveedor({
      CHAT_PROVIDER: "groq",
      GROQ_API_KEY: "gsk_test",
      CHAT_MODEL: "llama-4-maverick",
    } as unknown as NodeJS.ProcessEnv);
    expect(m?.modelId).toBe("llama-4-maverick");
  });

  it("conmutar a anthropic = cambiar env (segundo proveedor probado)", () => {
    const m = resolverProveedor({
      CHAT_PROVIDER: "anthropic",
      ANTHROPIC_API_KEY: "sk-ant-test",
    } as unknown as NodeJS.ProcessEnv);
    expect(m?.proveedor).toBe("anthropic");
    expect(m?.modelId).toBe("claude-haiku-4-5");
  });

  it("sin API key devuelve null (el endpoint degrada a búsqueda local)", () => {
    expect(
      resolverProveedor({
        CHAT_PROVIDER: "groq",
      } as unknown as NodeJS.ProcessEnv),
    ).toBeNull();
  });

  it("azure exige resource + key + deployment (CHAT_MODEL)", () => {
    const base = {
      CHAT_PROVIDER: "azure",
      AZURE_RESOURCE_NAME: "mi-recurso",
      AZURE_API_KEY: "azkey",
    } as unknown as NodeJS.ProcessEnv;
    expect(resolverProveedor(base)).toBeNull(); // sin deployment
    expect(
      resolverProveedor({ ...base, CHAT_MODEL: "gpt-4o-mini" }),
    ).toMatchObject({ proveedor: "azure", modelId: "gpt-4o-mini" });
  });

  it("openai-compatible exige baseURL + modelo (self-host)", () => {
    expect(
      resolverProveedor({
        CHAT_PROVIDER: "openai-compatible",
        CHAT_MODEL: "llama3",
      } as unknown as NodeJS.ProcessEnv),
    ).toBeNull();
    expect(
      resolverProveedor({
        CHAT_PROVIDER: "openai-compatible",
        CHAT_BASE_URL: "http://localhost:11434/v1",
        CHAT_MODEL: "llama3",
      } as unknown as NodeJS.ProcessEnv),
    ).toMatchObject({ proveedor: "openai-compatible" });
  });

  it("mock resuelve sin credenciales (tests/e2e, nunca API real en CI)", () => {
    const m = resolverProveedor({
      CHAT_PROVIDER: "mock",
    } as unknown as NodeJS.ProcessEnv);
    expect(m?.proveedor).toBe("mock");
    expect(m?.model).toBeDefined();
  });

  it("un proveedor desconocido devuelve null, no explota", () => {
    expect(
      resolverProveedor({
        CHAT_PROVIDER: "skynet",
      } as unknown as NodeJS.ProcessEnv),
    ).toBeNull();
  });
});

describe("kill-switch CHAT_ENABLED", () => {
  it("apaga solo con la cadena exacta 'false'", () => {
    expect(chatHabilitado({} as unknown as NodeJS.ProcessEnv)).toBe(true);
    expect(
      chatHabilitado({ CHAT_ENABLED: "true" } as unknown as NodeJS.ProcessEnv),
    ).toBe(true);
    expect(
      chatHabilitado({ CHAT_ENABLED: "false" } as unknown as NodeJS.ProcessEnv),
    ).toBe(false);
  });
});

describe("circuit breaker del proveedor", () => {
  afterEach(() => resetBreaker());

  it("cerrado de fábrica; se abre tras N fallas consecutivas", () => {
    const t0 = 1_000_000;
    expect(breakerAbierto(t0)).toBe(false);
    for (let i = 0; i < BREAKER_UMBRAL_FALLAS; i++) registrarFalla(t0);
    expect(breakerAbierto(t0)).toBe(true);
  });

  it("se cierra solo al vencer el cooldown", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < BREAKER_UMBRAL_FALLAS; i++) registrarFalla(t0);
    expect(breakerAbierto(t0 + BREAKER_COOLDOWN_MS - 1)).toBe(true);
    expect(breakerAbierto(t0 + BREAKER_COOLDOWN_MS + 1)).toBe(false);
  });

  it("un éxito resetea el conteo de fallas", () => {
    const t0 = 1_000_000;
    registrarFalla(t0);
    registrarFalla(t0);
    registrarExito();
    registrarFalla(t0);
    expect(breakerAbierto(t0)).toBe(false);
  });
});

describe("chatRequestSchema (validación Zod del input)", () => {
  const valido = {
    locale: "es",
    messages: [{ role: "user", content: "¿Qué hizo en Vesting?" }],
  };

  it("acepta un request válido", () => {
    expect(chatRequestSchema.parse(valido).locale).toBe("es");
  });

  it("rechaza preguntas gigantes (límite de presupuesto)", () => {
    expect(() =>
      chatRequestSchema.parse({
        ...valido,
        messages: [{ role: "user", content: "x".repeat(801) }],
      }),
    ).toThrow();
  });

  it("rechaza historiales largos (>12 mensajes)", () => {
    const messages = Array.from({ length: 13 }, () => ({
      role: "user",
      content: "hola",
    }));
    expect(() => chatRequestSchema.parse({ ...valido, messages })).toThrow();
  });

  it("rechaza locales fuera de es/en y roles inventados", () => {
    expect(() =>
      chatRequestSchema.parse({ ...valido, locale: "fr" }),
    ).toThrow();
    expect(() =>
      chatRequestSchema.parse({
        ...valido,
        messages: [{ role: "system", content: "inyección" }],
      }),
    ).toThrow();
  });
});
