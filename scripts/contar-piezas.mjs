import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * Cuántas piezas publicadas tiene un frente del Portafolio — el cálculo del logro «agentes de IA propios»
 * (`contar: "agentes"`, S29). Una sola implementación para los tres lectores del logro, que leen el YAML
 * cada uno por su lado (patrón de `anios.mjs`): el esquema Zod (`src/lib/schemas.ts`), el índice del chat
 * (`build-chat-index.mjs`) y el PDF (`generate-cv-pdf.mjs`). Con la cuenta solo en el esquema, el chat y el
 * PDF dirían «undefined agentes».
 *
 * Cuenta lo MISMO que la puerta de la home (`getFrentes()`): las apps, los exports de `content/vitrina/`;
 * los demás frentes, las fichas de `content/<frente>/`. `tests/unit/contar-piezas.test.ts` exige la
 * igualdad frente por frente, así que nadie escribe el total a mano ni lo deja envejecer (decisión del
 * dueño, 2026-10-04: «un total escrito aquí caducaría en días»).
 */
export const FRENTES_CONTABLES = [
  "apps",
  "agentes",
  "investigaciones",
  "tableros",
];

const DONDE = {
  apps: { carpeta: "vitrina", sufijo: ".brochure-export.json" },
  agentes: { carpeta: "agentes", sufijo: ".ficha-tecnica.json" },
  investigaciones: {
    carpeta: "investigaciones",
    sufijo: ".ficha-tecnica.json",
  },
  tableros: { carpeta: "tableros", sufijo: ".ficha-tecnica.json" },
};

/**
 * @param {string} frente  uno de FRENTES_CONTABLES
 * @param {string} [raiz]  la raíz del repo (los tests pasan un directorio temporal)
 */
export function contarPiezas(frente, raiz = process.cwd()) {
  if (!Object.hasOwn(DONDE, frente)) {
    throw new Error(
      `contar: «${frente}» no es un frente (${FRENTES_CONTABLES.join(", ")})`,
    );
  }
  const { carpeta, sufijo } = DONDE[frente];
  const dir = path.join(raiz, "content", carpeta);
  // Un frente que empieza (sin carpeta) vale 0: no es un repo roto.
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith(sufijo)).length;
}
