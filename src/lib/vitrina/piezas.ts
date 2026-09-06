import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import {
  fichaTecnicaSchema,
  frentes,
  type FichaTecnica,
} from "./ficha-tecnica/schema";
import { SCHEMA_MAYOR_SOPORTADO, versionCompatible } from "./schemas";

/**
 * LAS PIEZAS DE UN FRENTE (S7) — el loader GENÉRICO de `content/<frente>/`.
 *
 * Es el hermano de `loader.ts` y su diferencia es toda la historia del sprint:
 * aquél ingiere los `brochure-export.json` de las apps y esta casa ARMA la
 * ficha con su curación; aquí llega la ficha **ya completa**, producida por
 * quien construyó la pieza. Un solo contrato (`fichaTecnicaSchema`) y un solo
 * renderizador: nada específico por frente vive en el código.
 *
 * Tres reglas que este archivo hace cumplir:
 *
 *  1. **Fail-safe con nombre y apellido.** Una ficha malformada rompe el BUILD
 *     nombrando archivo y campo. La vitrina nunca se publica enseñando una
 *     pieza que miente sobre sí misma — y el error es la instrucción de qué
 *     corregir, no un «invalid input» que obliga a adivinar.
 *  2. **Un frente sin carpeta no es un error**, es un frente que aún no tiene
 *     piezas: devuelve `[]`. Lo que sí es error es declararlo `abierta` — eso
 *     lo vigila `parseVitrina`.
 *  3. **Aquí no se edita nada.** Si una ficha no cumple, se corrige EN ORIGEN
 *     y se vuelve a entregar. Ni para que quepa.
 *
 * El orden es explícito y estable: primero las **selladas** (su gate de pruebas
 * terminó), luego alfabético por nombre en es-CO. Nunca el orden del sistema de
 * archivos, que cambia entre máquinas sin que nadie toque una línea.
 */

export type Frente = (typeof frentes)[number];

const SUFIJO = ".ficha-tecnica.json";

function carpeta(frente: Frente): string {
  return path.join(process.cwd(), "content", frente);
}

const AVISO =
  "  ⚠ Las fichas de otras casas NO se editan aquí: se corrige en origen y se vuelve a entregar.";

/**
 * El NÚCLEO del loader, puro y sin disco (regla 3: motor separado de la IO).
 * Recibe el JSON ya leído y la ruta solo para poder nombrarla en el error —
 * un diagnóstico que no dice qué archivo obliga a buscarlo a mano entre veinte.
 */
export function parseFicha(raw: unknown, ruta: string): FichaTecnica {
  // Puerta de MAYOR antes del esquema: un 2.x trae campos con otro significado,
  // y el regex del contrato lo rechazaría con un «no coincide con el patrón»
  // que no le dice a nadie qué pasó.
  const version = (raw as { schema_version?: unknown })?.schema_version;
  if (typeof version === "string" && !versionCompatible(version)) {
    throw new Error(
      `Ficha incompatible en ${ruta}: schema_version ${version} — esta vitrina ` +
        `renderiza el mayor ${SCHEMA_MAYOR_SOPORTADO}.x.x. Un mayor distinto trae campos con otro significado.`,
    );
  }

  const r = fichaTecnicaSchema.safeParse(raw);
  if (!r.success) {
    const issues = r.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Ficha inválida en ${ruta} (contrato de la ficha técnica):\n${issues}\n${AVISO}`,
    );
  }
  return r.data;
}

function leerFicha(frente: Frente, archivo: string): FichaTecnica {
  const ruta = `content/${frente}/${archivo}`;
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path.join(carpeta(frente), archivo), "utf8"));
  } catch (e) {
    throw new Error(
      `Ficha ilegible en ${ruta}: ${(e as Error).message}\n${AVISO}`,
    );
  }
  return parseFicha(raw, ruta);
}

/**
 * Las piezas publicadas de un frente, validadas y ordenadas. `[]` si el frente
 * todavía no tiene carpeta: eso es un frente que empieza, no un repo roto.
 */
export const getPiezas = cache((frente: Frente): FichaTecnica[] => {
  const dir = carpeta(frente);
  if (!existsSync(dir)) return [];

  const piezas = readdirSync(dir)
    .filter((f) => f.endsWith(SUFIJO))
    .sort()
    .map((archivo) => leerFicha(frente, archivo));

  return piezas.sort((a, b) => {
    if (a.pieza.estado !== b.pieza.estado)
      return a.pieza.estado === "sellado" ? -1 : 1;
    return a.pieza.nombre.localeCompare(b.pieza.nombre, "es-CO");
  });
});

export function getPieza(
  frente: Frente,
  slug: string,
): FichaTecnica | undefined {
  return getPiezas(frente).find((p) => p.pieza.slug === slug);
}

/**
 * Los frentes que HOY tienen al menos una pieza publicada. Es lo que decide qué
 * frente puede declararse «abierta»: la regla del S6 («solo apps») se levanta
 * POR FRENTE, medida contra `content/`, no escrita a mano en ningún sitio.
 *
 * «apps» no vive en `content/apps/` todavía —sus piezas se arman de los
 * `brochure-export.json`— así que su fuente la declara `categorias.ts`; aquí se
 * cuenta lo que hay en disco y nada más.
 */
export function frentesConPiezas(): Frente[] {
  return frentes.filter((f) => getPiezas(f).length > 0);
}
