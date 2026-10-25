import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";

/**
 * Los nombres oficiales de las apps, `slug → nombre`, leídos de
 * `data/categorias-apps.yaml` (Sprint 009, ADR-028). Para los scripts de build
 * que leen los exports sin pasar por el loader de la vitrina; el esquema y sus
 * reglas viven en `src/lib/vitrina/categorias-apps.ts`, que corre en el build.
 * @returns {Map<string, string>}
 */
export function leerNombresOficiales() {
  const ruta = path.join(process.cwd(), "data", "categorias-apps.yaml");
  const yaml = parse(readFileSync(ruta, "utf8"));
  const nombres = new Map();
  for (const categoria of ["profesionales", "personales"]) {
    for (const e of yaml?.[categoria] ?? []) nombres.set(e.slug, e.nombre);
  }
  return nombres;
}

/**
 * Los nombres que el sitio da a las piezas de los otros frentes, `frente/slug →
 * nombre`, leídos de `data/nombres-piezas.yaml` (2026-10-24, extiende el ADR-028).
 * El esquema y sus reglas viven en `src/lib/vitrina/nombres-piezas.ts`.
 * @returns {Map<string, string>}
 */
export function leerNombresDePiezas() {
  const ruta = path.join(process.cwd(), "data", "nombres-piezas.yaml");
  const yaml = parse(readFileSync(ruta, "utf8"));
  const nombres = new Map();
  for (const [frente, piezas] of Object.entries(yaml ?? {})) {
    for (const [slug, nombre] of Object.entries(piezas ?? {})) {
      nombres.set(`${frente}/${slug}`, nombre);
    }
  }
  return nombres;
}
