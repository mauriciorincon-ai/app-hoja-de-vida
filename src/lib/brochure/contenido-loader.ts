import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { getCapturas } from "@/lib/vitrina/capturas";
import { getComplemento } from "@/lib/vitrina/ficha-tecnica/loader";
import { getFicha } from "@/lib/vitrina/loader";
import { getPiezaDeCasa } from "./casa";
import { SLUGS_CASA } from "./config";
import {
  leerContenido,
  problemasDeContenido,
  type Contenido,
  type EntregaDeApp,
} from "./contenido";

/**
 * Contra qué entrega se comprueba la coherencia del contenido: la de una app del Portafolio (su export,
 * sus capturas y su complemento de `data/fichas/`) o la de la casa (`content/vitrina/casa/`, S30).
 */
function entregaDe(slug: string): EntregaDeApp | undefined {
  const casa = getPiezaDeCasa(slug);
  if (casa)
    return {
      export: casa.export,
      capturas: casa.capturas,
      complemento: casa.complemento,
    };
  const ficha = getFicha(slug);
  const capturas = getCapturas(slug);
  if (!ficha || !capturas) return undefined;
  return { export: ficha.export, capturas, complemento: getComplemento(slug) };
}

/**
 * El contenido v2 del brochure de una app (`content/vitrina/<slug>.contenido.json`, S28; el de la casa
 * en `content/vitrina/casa/`, S30), o `undefined` si todavía no llegó (las que esperan el suyo se ven
 * con el v1). Fail-safe: si está y está mal —su forma o su coherencia con el export, las capturas y el
 * complemento—, rompe el build nombrando el archivo y el campo. No se edita aquí: se corrige en la
 * planeadora y se vuelve a copiar.
 */
export const getContenido = cache((slug: string): Contenido | undefined => {
  const deLaCasa = (SLUGS_CASA as readonly string[]).includes(slug);
  const nombre = deLaCasa
    ? `content/vitrina/casa/${slug}.contenido.json`
    : `content/vitrina/${slug}.contenido.json`;
  const archivo = path.join(process.cwd(), nombre);
  if (!existsSync(archivo)) return undefined;
  const r = leerContenido(JSON.parse(readFileSync(archivo, "utf8")));
  if (!r.ok)
    throw new Error(
      `Contenido v2 inválido en ${nombre}:\n  - ${r.problemas.join("\n  - ")}`,
    );
  const entrega = entregaDe(slug);
  if (!entrega)
    throw new Error(
      `${nombre}: «${slug}» no tiene export o capturas en content/vitrina/`,
    );
  const problemas = problemasDeContenido(r.contenido, entrega);
  if (problemas.length)
    throw new Error(`${nombre}:\n  - ${problemas.join("\n  - ")}`);
  return r.contenido;
});
