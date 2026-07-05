/**
 * Rate limit de ventana deslizante en memoria (≤5/min/IP por defecto).
 * Limitación conocida: el estado vive por instancia serverless (ver ADR-004);
 * suficiente para la escala personal de esta app.
 */

type RateLimitOptions = {
  limit?: number;
  windowMs?: number;
};

const hits = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: RateLimitOptions = {},
  now: number = Date.now(),
): { allowed: boolean; remaining: number } {
  const windowStart = now - windowMs;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return { allowed: false, remaining: 0 };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, remaining: limit - recent.length };
}

/** Solo para tests: limpia el estado compartido entre casos. */
export function resetRateLimit(): void {
  hits.clear();
}
