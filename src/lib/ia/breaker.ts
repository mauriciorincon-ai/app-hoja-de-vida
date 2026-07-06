/**
 * Circuit breaker del proveedor LLM (en memoria, por instancia serverless —
 * misma limitación conocida y aceptada que el rate limit, ver ADR-004).
 * Tras N fallas consecutivas se abre por un cooldown: las peticiones nuevas
 * degradan a búsqueda local de inmediato, sin pagar el timeout del proveedor.
 */

export const BREAKER_UMBRAL_FALLAS = 3;
export const BREAKER_COOLDOWN_MS = 60_000;

let fallasConsecutivas = 0;
let abiertoHasta = 0;

export function breakerAbierto(now: number = Date.now()): boolean {
  return now < abiertoHasta;
}

export function registrarFalla(now: number = Date.now()): void {
  fallasConsecutivas += 1;
  if (fallasConsecutivas >= BREAKER_UMBRAL_FALLAS) {
    abiertoHasta = now + BREAKER_COOLDOWN_MS;
    fallasConsecutivas = 0;
  }
}

export function registrarExito(): void {
  fallasConsecutivas = 0;
  abiertoHasta = 0;
}

/** Solo para tests: limpia el estado compartido entre casos. */
export function resetBreaker(): void {
  fallasConsecutivas = 0;
  abiertoHasta = 0;
}
