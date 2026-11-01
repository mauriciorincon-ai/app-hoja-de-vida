import type { Locale } from "@/i18n/routing";

/**
 * Un destino de este sitio, en el idioma de la página (S30). Las anclas de la HOME se escriben `/#contacto`
 * y salen `/es#contacto`: `/es/#contacto` lleva una barra final y el sitio la redirige con un 308 (un enlace
 * interno jamás debe llevar a una redirección).
 */
export function rutaEnIdioma(locale: Locale, destino: string): string {
  return destino.startsWith("/#")
    ? `/${locale}${destino.slice(1)}`
    : `/${locale}${destino}`;
}
