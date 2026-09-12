import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // La raíz abre SIEMPRE en español (revisión post-S8, decisión del dueño):
  // sin esto, `/` seguía `Accept-Language` y la cookie de «Switch to English»,
  // y quien cambiara de idioma una vez quedaba en inglés para siempre. El
  // botón sigue cambiando; lo que no hay es detección. Gate: tests/e2e/idioma.spec.ts.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
