/**
 * Lo que una página le dice a quien la usa, para el barrido de «ninguna página
 * dice la palabra vieja» (`portafolio.spec.ts`): el texto de la página, los
 * atributos que un lector de pantalla dice (`alt`, `aria-label`, `title`), lo
 * que sale en el resultado de un buscador y en la vista previa al compartir
 * (`<meta content="…">`: description, og:*, twitter:*) y el JSON-LD. Los demás
 * `<script>` (la carga de React, los identificadores) y los `<style>` no son
 * texto: ahí `vitrina` sigue siendo el nombre de un espacio de mensajes.
 */
export function textoVisible(html: string): string {
  const atributos = [
    ...html.matchAll(/\b(?:alt|aria-label|title)="([^"]*)"/g),
  ].map((m) => m[1]);
  const metas = [...html.matchAll(/<meta\b[^>]*?\bcontent="([^"]*)"/gi)].map(
    (m) => m[1],
  );
  const jsonLd = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((m) => m[1]);
  const cuerpo = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return [cuerpo, ...atributos, ...metas, ...jsonLd].join(" ");
}
