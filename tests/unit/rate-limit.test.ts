import { beforeEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit (ventana deslizante ≤5/min/IP)", () => {
  beforeEach(() => resetRateLimit());

  it("allows the first 5 requests and rejects the 6th within the window", () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("1.2.3.4", {}, now + i).allowed).toBe(true);
    }
    expect(checkRateLimit("1.2.3.4", {}, now + 10).allowed).toBe(false);
  });

  it("allows again once the window slides past old hits", () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) {
      checkRateLimit("1.2.3.4", {}, now + i);
    }
    expect(checkRateLimit("1.2.3.4", {}, now + 10).allowed).toBe(false);
    expect(checkRateLimit("1.2.3.4", {}, now + 60_001).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) {
      checkRateLimit("1.1.1.1", {}, now);
    }
    expect(checkRateLimit("1.1.1.1", {}, now).allowed).toBe(false);
    expect(checkRateLimit("2.2.2.2", {}, now).allowed).toBe(true);
  });

  it("reports remaining quota", () => {
    const now = 1_000_000;
    expect(checkRateLimit("ip", {}, now).remaining).toBe(4);
    expect(checkRateLimit("ip", {}, now).remaining).toBe(3);
  });
});
