import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { getCapturas } from "@/lib/vitrina/capturas";
import { getComplemento } from "@/lib/vitrina/ficha-tecnica/loader";
import { getFicha } from "@/lib/vitrina/loader";
import {
  leerContenido,
  problemasDeContenido,
  type Contenido,
} from "./contenido";

/**
 * El contenido v2 del brochure de una app (`content/vitrina/<slug>.contenido.json`, S28), o
 * `undefined` si todavía no llegó (las once que esperan el suyo se ven con el v1). Fail-safe: si está
 * y está mal —su forma o su coherencia con el export, las capturas y el complemento—, rompe el build
 * nombrando el archivo y el campo. No se edita aquí: se corrige en la planeadora y se vuelve a copiar.
 */
export const getContenido = cache((slug: string): Contenido | undefined => {
  const archivo = path.join(
    process.cwd(),
    "content",
    "vitrina",
    `${slug}.contenido.json`,
  );
  if (!existsSync(archivo)) return undefined;
  const nombre = `content/vitrina/${slug}.contenido.json`;
  const r = leerContenido(JSON.parse(readFileSync(archivo, "utf8")));
  if (!r.ok)
    throw new Error(
      `Contenido v2 inválido en ${nombre}:\n  - ${r.problemas.join("\n  - ")}`,
    );
  const ficha = getFicha(slug);
  const capturas = getCapturas(slug);
  if (!ficha || !capturas)
    throw new Error(
      `${nombre}: «${slug}» no tiene export o capturas en content/vitrina/`,
    );
  const problemas = problemasDeContenido(r.contenido, {
    export: ficha.export,
    capturas,
    complemento: getComplemento(slug),
  });
  if (problemas.length)
    throw new Error(`${nombre}:\n  - ${problemas.join("\n  - ")}`);
  return r.contenido;
});
