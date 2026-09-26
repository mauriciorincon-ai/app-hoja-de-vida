/**
 * La raíz solo deja pasar (2026-09-26). El `<html>` lo pone
 * `[locale]/layout.tsx`, que es quien conoce el idioma.
 *
 * Esta capa existe para que `app/not-found.tsx` tenga dónde colgarse. Sin
 * ella, un archivo que no existe en la raíz del sitio (`/apple-touch-icon.png`,
 * que Safari pide por su cuenta) caía en `[locale]` con un idioma inválido, y
 * el `notFound()` de ese layout no tenía frontera por encima: la respuesta era
 * un 500 en vez de un 404.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
