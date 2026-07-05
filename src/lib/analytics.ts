import { track } from "@vercel/analytics";

/** Eventos básicos del estándar de observabilidad (SPRINT_001 DoD). */
export type AnalyticsEvent =
  | "home_visit"
  | "idioma_cambiado"
  | "app_card_clicked"
  | "solicitud_enviada"
  | "solicitud_fallida";

export function trackEvent(
  name: AnalyticsEvent,
  props?: Record<string, string>,
): void {
  try {
    track(name, props);
  } catch {
    // La analítica jamás rompe la experiencia.
  }
}
