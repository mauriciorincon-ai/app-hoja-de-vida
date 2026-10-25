import { describe, expect, it } from "vitest";
import { textoVisible } from "../e2e/texto-visible";

/**
 * El barrido e2e «ninguna página dice la palabra vieja» mira lo que la persona,
 * el buscador y la vista previa reciben. Si dejara de mirar las metas o el
 * JSON-LD, una descripción con «vitrina» pasaría en verde (S23, B7).
 */
const PALABRA = /\bvitrinas?\b/i;

describe("textoVisible: lo que el barrido de la palabra vieja mira", () => {
  it("el cuerpo y los atributos que un lector de pantalla dice", () => {
    const html = `<main><p>Hola</p><img alt="una vitrina"><a aria-label="ir a la vitrina" title="vitrina">x</a></main>`;
    expect(textoVisible(html).match(/vitrina/g)).toHaveLength(3);
  });

  it("las metas: description, og y twitter, con el content antes o después del name", () => {
    for (const meta of [
      `<meta name="description" content="Mi vitrina de apps"/>`,
      `<meta content="Mi vitrina de apps" property="og:description"/>`,
      `<meta name="twitter:description" content="Mi vitrina de apps"/>`,
    ]) {
      expect(textoVisible(`<head>${meta}</head>`), meta).toMatch(PALABRA);
    }
  });

  it("el JSON-LD", () => {
    const html = `<script type="application/ld+json">{"@type":"WebSite","description":"La vitrina de Henry"}</script>`;
    expect(textoVisible(html)).toMatch(PALABRA);
  });

  it("los demás script y los style NO son texto: ahí vitrina es un identificador", () => {
    const html = `<script>self.__next_f.push([1,"vitrina"])</script><style>.tarjeta-vitrina{color:red}</style><p>Portafolio</p>`;
    expect(textoVisible(html)).not.toMatch(PALABRA);
  });

  it("una página limpia no dice la palabra", () => {
    const html = `<head><title>Portafolio</title><meta name="description" content="El portafolio de apps"/></head><body><main>Portafolio</main></body>`;
    expect(textoVisible(html)).not.toMatch(PALABRA);
  });
});
