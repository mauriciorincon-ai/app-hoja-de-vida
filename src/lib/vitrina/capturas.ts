import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { z } from "zod";
import { sinVitrinaDe } from "../../../scripts/sin-vitrina.mjs";
import { getFicha } from "./loader";
import type { GrupoExport } from "./schemas";

/**
 * LAS CAPTURAS POR FUNCIONALIDAD de cada app (pedido 026, OM-21).
 *
 * Cada app llega con su tabla (`content/vitrina/<slug>.capturas.yaml`, copiada
 * byte a byte de la planeadora) y sus imágenes (`public/vitrina/<slug>/`): una
 * pantalla real por cada funcionalidad que tiene pantalla, una portada para el
 * escaparate, y las funcionalidades transversales declaradas `sin_pantalla`
 * —jamás un relleno—. La tabla NO viaja en el `brochure-export.json`: el
 * contrato v1.0.0 es estricto y no tiene campo de capturas (decisión 4 de la
 * revisión: el campo del contrato se decide en el 027).
 *
 * Fail-safe como todo el contenido (regla 1): una tabla malformada, una captura
 * que apunta a una funcionalidad que el export no tiene o a un archivo que no
 * está rompen el BUILD nombrando la app y el campo. El peso y las dimensiones
 * (WebP de 1536×960 y ≤ 80 KB) los vigila el gate `capturas-apps.test.ts`.
 */

/** Lo que mide cada captura: 1024×640 a DPR 1,5 (gate M1 del S9). */
export const CAPTURA_ANCHO = 1536;
export const CAPTURA_ALTO = 960;
/** El peso máximo de una captura, en KB. */
export const CAPTURA_MAX_KB = 80;

const archivo = z
  .string()
  .regex(
    /^[A-Za-z0-9._-]+\.webp$/,
    "nombre de un archivo .webp, sin carpetas ni «..»",
  );
const pie = z.string().trim().min(1).max(80);

export const capturasSchema = z
  .object({
    /** La pantalla de entrada: la portada de la tarjeta del escaparate. */
    portada: archivo,
    capturas: z.array(
      z
        .object({
          /** El `id` de la funcionalidad del export a la que pertenece. */
          funcionalidad: z.string().min(1).max(40),
          archivo,
          pie: z.object({ es: pie, en: pie }).strict(),
        })
        .strict(),
    ),
    /** Las funcionalidades sin pantalla propia (transversales, etc.). */
    sin_pantalla: z.array(z.string().min(1).max(40)).default([]),
  })
  .strict();

export type Capturas = z.infer<typeof capturasSchema>;
export type CapturaDeFuncionalidad = Capturas["capturas"][number];

/**
 * Lo que está mal entre la tabla y el export, nombrando cada cosa. Puro: lo usa
 * el loader (rompe el build) y el gate. `existe` decide si un archivo de la
 * carpeta de la app está en el disco.
 */
export function problemasDeCapturas(
  capturas: Capturas,
  idsDelExport: string[],
  existe: (archivo: string) => boolean,
): string[] {
  const problemas: string[] = [];
  const ids = new Set(idsDelExport);
  const conCaptura = new Map<string, number>();
  for (const c of capturas.capturas) {
    if (!ids.has(c.funcionalidad))
      problemas.push(
        `capturas.${c.funcionalidad}: no es una funcionalidad del export`,
      );
    conCaptura.set(c.funcionalidad, (conCaptura.get(c.funcionalidad) ?? 0) + 1);
    if (!existe(c.archivo))
      problemas.push(`capturas.${c.funcionalidad}: no existe ${c.archivo}`);
  }
  for (const [id, n] of conCaptura)
    if (n > 1) problemas.push(`capturas.${id}: aparece ${n} veces`);
  for (const s of capturas.sin_pantalla) {
    if (!ids.has(s))
      problemas.push(`sin_pantalla.${s}: no es una funcionalidad del export`);
    if (conCaptura.has(s))
      problemas.push(`${s}: está en capturas y en sin_pantalla`);
  }
  if (!existe(capturas.portada))
    problemas.push(`portada: no existe ${capturas.portada}`);
  const sinNada = idsDelExport.filter(
    (id) => !conCaptura.has(id) && !capturas.sin_pantalla.includes(id),
  );
  if (sinNada.length)
    problemas.push(
      `funcionalidades sin captura ni sin_pantalla: ${sinNada.join(", ")}`,
    );
  return problemas;
}

/**
 * Las dimensiones de un WebP (VP8, VP8L o VP8X) leídas de su cabecera, o
 * `undefined` si el archivo no es un WebP. Sin dependencias: el gate de las
 * capturas la usa para exigir los 1536×960 de cada imagen.
 */
export function dimensionesWebp(b: Buffer): [number, number] | undefined {
  if (
    b.toString("ascii", 0, 4) !== "RIFF" ||
    b.toString("ascii", 8, 12) !== "WEBP"
  )
    return undefined;
  const tipo = b.toString("ascii", 12, 16);
  if (tipo === "VP8 ")
    return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (tipo === "VP8L") {
    const v = b.readUInt32LE(21);
    return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1];
  }
  if (tipo === "VP8X")
    return [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
  return undefined;
}

/** Los ids de las funcionalidades de un export, en el orden de sus grupos. */
export function idsDeFuncionalidades(grupos: GrupoExport[]): string[] {
  return grupos.flatMap((g) => g.features.map((f) => f.id));
}

/** Una captura lista para pintar: la funcionalidad, su archivo y su pie. */
export type CapturaPintable = {
  id: string;
  nombre: string;
  archivo: string;
  pie: string;
};

/**
 * Las capturas de UN grupo, en el orden de sus funcionalidades: solo las que
 * tienen pantalla (las transversales no llevan figura).
 */
export function capturasDelGrupo(
  capturas: Capturas,
  grupo: GrupoExport,
  idioma: "es" | "en",
): CapturaPintable[] {
  const porId = new Map(capturas.capturas.map((c) => [c.funcionalidad, c]));
  return grupo.features.flatMap((f) => {
    const c = porId.get(f.id);
    return c
      ? [{ id: f.id, nombre: f.nombre, archivo: c.archivo, pie: c.pie[idioma] }]
      : [];
  });
}

const DIR = path.join(process.cwd(), "content", "vitrina");
const PUBLICO = path.join(process.cwd(), "public", "vitrina");

/** La carpeta pública de las capturas de una app, tal como la sirve el sitio. */
export const urlDeCapturas = (slug: string) => `/vitrina/${slug}`;

/**
 * La tabla de una app, o `undefined` si todavía no llegó (hoy: las apps que
 * esperan su entrega, ver `tests/unit/capturas-apps.test.ts`). Rompe el build si
 * existe y está mal.
 */
export const getCapturas = cache((slug: string): Capturas | undefined => {
  const ruta = path.join(DIR, `${slug}.capturas.yaml`);
  if (!existsSync(ruta)) return undefined;
  const nombre = `content/vitrina/${slug}.capturas.yaml`;
  const r = capturasSchema.safeParse(parse(readFileSync(ruta, "utf8")));
  if (!r.success) {
    const issues = r.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Tabla de capturas inválida en ${nombre}:\n${issues}`);
  }
  const ficha = getFicha(slug);
  if (!ficha)
    throw new Error(`${nombre}: «${slug}» no tiene export en content/vitrina/`);
  const problemas = problemasDeCapturas(
    r.data,
    idsDeFuncionalidades(ficha.export.funcionalidades.grupos),
    (a) => existsSync(path.join(PUBLICO, slug, a)),
  );
  if (problemas.length)
    throw new Error(
      `${nombre}:\n${problemas.map((p) => `  - ${p}`).join("\n")}`,
    );
  // Los pies son texto que se lee: la palabra del sitio es una sola (S23),
  // salvo en las apps que conservan la suya (planlang, 026).
  return sinVitrinaDe(slug, r.data);
});
