import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * EL BOTÓN DE IDIOMA LLEVA SU TEXTO VISIBLE EN SU NOMBRE (S14, WCAG 2.5.3
 * «Etiqueta en el nombre»).
 *
 * El botón del encabezado (`header.tsx`) y el enlace de la página de
 * mantenimiento muestran «ES / EN»; quien lo opera por voz dice lo que ve, así
 * que su nombre accesible tiene que contener ese texto. Antes decía solo
 * «Switch to English» / «Cambiar a español». axe-core 4.14 lo marca como
 * `label-content-name-mismatch` (serio) en TODAS las páginas: la versión
 * anterior no tenía la regla y el defecto pasó inadvertido hasta que la subida
 * de dependencias lo expuso. El texto visible está escrito en los componentes;
 * el nombre accesible, en `nav.cambiarIdioma` de los dos diccionarios.
 */
describe("nav.cambiarIdioma empieza por el texto visible del botón, «ES / EN»", () => {
  it.each(["es", "en"])("messages/%s.json", (idioma) => {
    const m = JSON.parse(readFileSync(`messages/${idioma}.json`, "utf8"));
    expect(
      m.nav.cambiarIdioma,
      `messages/${idioma}.json › nav.cambiarIdioma: el nombre accesible debe empezar por «ES / EN», el texto que el botón muestra`,
    ).toMatch(/^ES \/ EN\b/);
  });
});
