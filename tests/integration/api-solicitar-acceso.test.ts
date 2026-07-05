import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimit } from "@/lib/rate-limit";
import { POST } from "@/app/api/solicitar-acceso/route";

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

function makeRequest(body: unknown, ip = "9.9.9.9"): Request {
  return new Request("http://localhost/api/solicitar-acceso", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const solicitudValida = {
  nombre: "Ana Prueba",
  email: "ana@example.com",
  app: "idea-exploracion-1",
  mensaje: "Quiero probarla",
  website: "",
};

describe("POST /api/solicitar-acceso", () => {
  beforeEach(() => {
    resetRateLimit();
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
  });

  it("sends the email and returns 200 on a valid request", async () => {
    const res = await POST(makeRequest(solicitudValida, "1.0.0.1"));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledOnce();
    const payload = sendMock.mock.calls[0][0];
    expect(payload.subject).toContain("idea-exploracion-1");
    expect(payload.replyTo).toBe("ana@example.com");
    expect(payload.text).toContain("Ana Prueba");
  });

  it("returns 200 but sends NOTHING when the honeypot is filled (negative)", async () => {
    const res = await POST(
      makeRequest(
        { ...solicitudValida, website: "http://spam.example" },
        "1.0.0.2",
      ),
    );
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 on invalid fields without sending", async () => {
    const res = await POST(
      makeRequest({ ...solicitudValida, email: "no-es-email" }, "1.0.0.3"),
    );
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "invalid_fields" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 on a non-JSON body", async () => {
    const res = await POST(makeRequest("esto no es json", "1.0.0.4"));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "invalid_body" });
  });

  it("returns 429 on the 6th request from the same IP (negative)", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(solicitudValida, "2.0.0.1"));
      expect(res.status).toBe(200);
    }
    const res = await POST(makeRequest(solicitudValida, "2.0.0.1"));
    expect(res.status).toBe(429);
    expect(sendMock).toHaveBeenCalledTimes(5);
  });

  it("returns 502 when Resend fails", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "boom" },
    });
    const res = await POST(makeRequest(solicitudValida, "3.0.0.1"));
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toEqual({ error: "send_failed" });
  });

  it("simulates success (200) without API key — dev/preview sin secrets", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await POST(makeRequest(solicitudValida, "4.0.0.1"));
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
