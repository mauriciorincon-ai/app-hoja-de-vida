import { track } from "@vercel/analytics";

/** Eventos del estándar de observabilidad (DoD S1 + capa de profundidad S2). */
export type AnalyticsEvent =
  | "home_visit"
  | "idioma_cambiado"
  | "app_card_clicked"
  | "solicitud_enviada"
  | "solicitud_fallida"
  | "hito_expandido"
  | "proyecto_detalle_visto"
  | "cv_descargado";

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
