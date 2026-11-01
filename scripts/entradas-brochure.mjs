import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * LAS APPS QUE ABREN EN SU BROCHURE (S30, «1b»): `/portafolio/apps/<app>` es su brochure, no su ficha.
 *
 * **El interruptor es el contenido**, no un campo: una app del Portafolio pasa cuando su contenido v2
 * aprobado llega por copia a `content/vitrina/<slug>.contenido.json`; sin él, sigue con su ficha. La
 * casa (CV Viva y su chat, `content/vitrina/casa/`) no tiene ficha: abre en su brochure siempre.
 *
 * Una sola implementación para todos los que necesitan saberlo, que no pueden compartir un módulo con
 * esquema (patrón de `contar-piezas.mjs`): `next.config.ts` la calcula en build y se la pasa al proxy
 * (`CV_ENTRADAS_BROCHURE`, que redirige el `/brochure` de estas apps a su entrada; el proxy no lee el
 * disco), y la leen las páginas, el sitemap, el catálogo de destinos del chat y las pruebas.
 *
 * @param {string} [raiz]  la raíz del repo (los tests pasan un directorio temporal)
 * @returns {string[]} los slugs, ordenados
 */
export function entradasBrochure(raiz = process.cwd()) {
  const vitrina = path.join(raiz, "content", "vitrina");
  const casa = path.join(vitrina, "casa");
  const deSufijo = (dir, sufijo) =>
    existsSync(dir)
      ? readdirSync(dir)
          .filter((f) => f.endsWith(sufijo))
          .map((f) => f.slice(0, -sufijo.length))
      : [];
  return [
    ...new Set([
      ...deSufijo(casa, ".brochure-export.json"),
      ...deSufijo(vitrina, ".contenido.json"),
    ]),
  ].sort();
}
