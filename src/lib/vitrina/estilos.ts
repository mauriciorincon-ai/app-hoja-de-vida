import type { Locale } from "@/i18n/routing";

/**
 * Lo que la vitrina repetía a mano en tres componentes (auditoría del S7, M7):
 * la pareja de clases por estado de pieza y el locale BCP-47 con el que se
 * formatean las cifras. Un cambio de paleta o de región se hace aquí una vez.
 */
export type EstadoPieza = "sellado" | "inicial";

export const COLOR_ESTADO: Record<EstadoPieza, string> = {
  sellado: "bg-sage text-sage-ink",
  inicial: "bg-citron text-citron-ink",
};

/** El locale de `toLocaleString`: español de Colombia, inglés de EE. UU. */
export function intlLocale(locale: Locale): "es-CO" | "en-US" {
  return locale === "es" ? "es-CO" : "en-US";
}
