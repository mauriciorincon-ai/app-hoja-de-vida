/**
 * El traductor que reciben las piezas síncronas de «Métodos». Es la firma de
 * `getTranslations("metodo")`, reducida a lo que se usa: así cada pieza se
 * prueba con la traducción REAL (`messages/*.json`) sin montar next-intl, y una
 * clave que falta rompe el test en vez de pintar «metodo.fases.xx» en pantalla.
 */
export type Traductor = (
  clave: string,
  valores?: Record<string, string | number>,
) => string;

/** El idioma de la página: las piezas leen `{ es, en }` con esta llave. */
export type IdiomaMetodo = "es" | "en";
