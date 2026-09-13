import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { parse } from "yaml";
import { resetRateLimit } from "@/lib/rate-limit";
import { POST } from "@/app/api/propuestas/route";

const sendMock = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.mock("@/lib/logger", () => {
  const noop = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  return { logger: { ...noop, child: () => noop } };
});

const habla = parse(readFileSync("data/fichas/habla.yaml", "utf8")) as {
  app: string;
};

function makeRequest(body: unknown, ip = "8.8.8.8"): Request {
  return new Request("http://localhost/api/propuestas", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valida = {
  app: habla.app,
  propuesta: "Que lea cuentos con la voz de la abuela.",
  email: "",
  website: "",
};

describe("POST /api/propuestas", () => {
  beforeEach(() => {
    resetRateLimit();
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "email_p1" }, error: null });
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
  });

  it("sends the proposal by email with the app's name in the subject, no reply-to without email", async () => {
    const res = await POST(makeRequest(valida, "5.0.0.1"));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    const payload = sendMock.mock.calls[0][0];
    expect(payload.subject).toMatch(/^\[CV Viva\] Propuesta para /);
    expect(payload.subject).not.toContain(habla.app); // el nombre, no el slug
    expect(payload.replyTo).toBeUndefined();
    expect(payload.text).toContain("abuela");
  });

  it("uses the visitor's email as reply-to when given", async () => {
    const res = await POST(
      makeRequest({ ...valida, email: "ana@example.com" }, "5.0.0.2"),
    );
    expect(res.status).toBe(200);
    expect(sendMock.mock.calls[0][0].replyTo).toBe("ana@example.com");
  });

  it("returns 400 for an app that is not in the showcase, without sending (negative)", async () => {
    const res = await POST(
      makeRequest({ ...valida, app: "app-que-no-existe" }, "5.0.0.3"),
    );
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 on a too-short text without sending", async () => {
    const res = await POST(
      makeRequest({ ...valida, propuesta: "hola" }, "5.0.0.4"),
    );
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 200 but sends NOTHING when the honeypot is filled (negative)", async () => {
    const res = await POST(
      makeRequest({ ...valida, website: "http://spam.example" }, "5.0.0.5"),
    );
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 429 on the 6th proposal from the same IP (negative)", async () => {
    for (let i = 0; i < 5; i++) {
      expect((await POST(makeRequest(valida, "6.0.0.1"))).status).toBe(200);
    }
    expect((await POST(makeRequest(valida, "6.0.0.1"))).status).toBe(429);
  });

  it("simulates success without API key (dev/preview)", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await POST(makeRequest(valida, "7.0.0.1"));
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
