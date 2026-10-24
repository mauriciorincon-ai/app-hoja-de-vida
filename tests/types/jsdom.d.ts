/**
 * `jsdom` no trae tipos y no hace falta sumar `@types/jsdom` para una sola
 * prueba: `tests/unit/guia-ensayo.test.ts` solo usa su constructor, el
 * `window` y sus opciones de arranque. Este archivo declara justo eso.
 */
declare module "jsdom" {
  export class JSDOM {
    constructor(
      html?: string,
      options?: {
        runScripts?: "dangerously" | "outside-only";
        url?: string;
        pretendToBeVisual?: boolean;
        beforeParse?: (window: Window & typeof globalThis) => void;
      },
    );
    readonly window: Window & typeof globalThis;
  }
}
