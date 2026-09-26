import { correosPublicos } from "../../scripts/correos.mjs";
import type { Cv } from "./schemas";
import { SITE_URL } from "./site";

/**
 * Los correos que el sitio muestra, en orden: el del dominio (armado con el
 * dominio de `SITE_URL`, nunca escrito en el repo) y el Gmail. Sin dominio
 * propio, solo el Gmail. La regla vive en `scripts/correos.mjs`, compartida
 * con el PDF y el índice del chat.
 */
export function correosDe(identidad: Cv["identidad"]): string[] {
  return correosPublicos(identidad, SITE_URL);
}
