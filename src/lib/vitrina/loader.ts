import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import {
  brochureExportSchema,
  versionCompatible,
  type BrochureExport,
} from "./schemas";

/**
 * Ingesta de los `brochure-export.json` de las apps hermanas (S5, ADR-013).
 * Mismo patrón fail-safe que el contenido propio (`lib/content.ts`): si un
 * export está malformado o incumple el contrato, **el build FALLA** con un
 * diagnóstico que nombra el archivo y el campo — la vitrina nunca se publica
 * mostrando una ficha que miente sobre sí misma.
 *
 * Los exports NO se editan aquí (regla dura 4): si uno está mal, el error de
 * build es el aviso para reportarlo a la planeadora y que su app lo corrija.
 */

const VITRINA_DIR = path.join(process.cwd(), "content", "vitrina");
const SUFIJO = ".brochure-export.json";

/** Anclaje de una ficha: de qué app, qué versión y de cuándo. La vitrina
 *  muestra la versión ANCLADA — no promete tiempo real. */
export type AnclaVitrina = {
  slug: string;
  nombre: string;
  archivo: string;
  /** Fecha del export de origen (no del render). */
  actualizado: string;
  schemaVersion: string;
  estado: "inicial" | "sellado";
  selladoEn: string | null;
  ciclo: string;
  sprintsCerrados: number;
  versionRepo: string;
};

export type FichaVitrina = {
  ancla: AnclaVitrina;
  export: BrochureExport;
};

function parseOrThrow(raw: unknown, archivo: string): BrochureExport {
  const result = brochureExportSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Export inválido en content/vitrina/${archivo} (contrato v1.0.0):\n${issues}\n` +
        `  ⚠ Los exports NO se editan aquí: repórtalo a la planeadora para que su app lo corrija.`,
    );
  }

  const data = result.data;
  if (!versionCompatible(data.schema_version)) {
    throw new Error(
      `Export incompatible en content/vitrina/${archivo}: schema_version ` +
        `${data.schema_version} — esta vitrina renderiza el mayor 1.x.x. ` +
        `Un mayor distinto trae campos con otro significado.`,
    );
  }
  return data;
}

function ancla(exp: BrochureExport, archivo: string): AnclaVitrina {
  return {
    slug: exp.app.slug,
    nombre: exp.app.nombre,
    archivo,
    actualizado: exp.actualizado,
    schemaVersion: exp.schema_version,
    estado: exp.app.estado,
    selladoEn: exp.app.sellado_en,
    ciclo: exp.app.ciclo,
    sprintsCerrados: exp.app.sprints_cerrados,
    versionRepo: exp.app.version_repo,
  };
}

/**
 * Las fichas de la vitrina, validadas y ancladas. Orden estable y explícito:
 * primero las selladas (su gate de pruebas terminó), luego por fecha de export
 * descendente, y a igualdad por slug — así el orden no depende del sistema de
 * archivos ni cambia solo entre builds.
 */
export const getFichasVitrina = cache((): FichaVitrina[] => {
  const archivos = readdirSync(VITRINA_DIR)
    .filter((f) => f.endsWith(SUFIJO))
    .sort();

  const fichas = archivos.map((archivo) => {
    const raw = JSON.parse(
      readFileSync(path.join(VITRINA_DIR, archivo), "utf8"),
    ) as unknown;
    const exp = parseOrThrow(raw, archivo);
    return { ancla: ancla(exp, archivo), export: exp };
  });

  return fichas.sort((a, b) => {
    if (a.ancla.estado !== b.ancla.estado) {
      return a.ancla.estado === "sellado" ? -1 : 1;
    }
    if (a.ancla.actualizado !== b.ancla.actualizado) {
      return a.ancla.actualizado < b.ancla.actualizado ? 1 : -1;
    }
    return a.ancla.slug.localeCompare(b.ancla.slug);
  });
});

/** Solo los anclajes (para el manifest y las cabeceras de la vitrina). */
export function getManifestVitrina(): AnclaVitrina[] {
  return getFichasVitrina().map((f) => f.ancla);
}

export function getFicha(slug: string): FichaVitrina | undefined {
  return getFichasVitrina().find((f) => f.ancla.slug === slug);
}
