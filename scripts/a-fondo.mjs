/**
 * EL CANAL «A FONDO» (S8, ADR-019) — los documentos en profundidad que
 * alimentan al chat.
 *
 * Por qué «a fondo» y no «detalle»: la palabra ya significa otras dos cosas en
 * esta app — el case study de un proyecto (`messages.detalle`,
 * `DetalleVisitTracker`) y el último tramo de la ficha larga de una app
 * (`/vitrina/apps/<slug>/detalle`). Un tercer significado habría costado más
 * que un nombre nuevo.
 *
 * Qué es: `data/a-fondo/<slug>.<locale>.md` — frontmatter validado con Zod +
 * cuerpo en Markdown con subsecciones `##` marcadas con `<!-- seccion: id -->`,
 * las mismas dos marcas de siempre. **No hay páginas**: estos documentos no se
 * publican, son combustible del chat. La cita `[n]` navega al `ancla` del
 * documento, que es algo VISIBLE del sitio — exactamente lo que ADR-010 ya
 * había decidido para la historia.
 *
 * El `estado` manda DOS cosas a la vez:
 *   · `borrador` → no se indexa **y** no se le exige pareja en inglés.
 *   · `aprobado` → se indexa **y** exige paridad ES/EN subsección por subsección.
 * Así la base entera puede vivir en español mientras el dueño la corrige, sin
 * romper el build ni publicar media traducción.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";
import { z } from "zod";
import { destinoExiste } from "./destinos.mjs";

const ROOT = process.cwd();
export const DIR_A_FONDO = path.join(ROOT, "data", "a-fondo");
export const LOCALES = ["es", "en"];

export const frontmatterSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "solo minúsculas, dígitos y guiones"),
  titulo: z.string().min(1),
  resumen: z.string().min(1),
  estado: z.enum(["borrador", "aprobado"]),
  ancla: z.string().min(1),
  actualizado: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "formato AAAA-MM-DD"),
  preguntas_de_prueba: z
    .array(z.string().min(1))
    .min(2, "al menos 2 — la prueba del chat viaja con el contenido"),
});

/**
 * PRIVACIDAD MECÁNICA. Calibrada contra los documentos reales: `2009 — 2016`,
 * `ISO 9001:2015`, `DP-600` y `1.234` **no** disparan. Lo que dispara:
 *
 *  · un correo,
 *  · un teléfono (internacional con `+`, o agrupado 300-123-4567),
 *  · siete dígitos seguidos o más — teléfono local, cédula, NIT. Las cifras
 *    grandes de verdad se escriben con separador (`1.500.000`), que es además
 *    como las pinta el sitio,
 *  · una dirección web, con esquema o sin él.
 *
 * Lo que un regex NO caza es un nombre propio: por eso la regla vive en tres
 * capas —este barrido, el checklist de la plantilla y la lectura del builder
 * en cada PR—, no en una.
 */
export const PATRONES_PRIVACIDAD = [
  { nombre: "un correo electrónico", re: /[\w.+-]+@[\w-]+\.[\w.]{2,}/ },
  { nombre: "un teléfono internacional", re: /\+\d{1,3}[\s.-]?\d[\d\s.-]{6,}\d/ },
  { nombre: "un teléfono agrupado", re: /\b\d{3}[\s.-]\d{3}[\s.-]\d{4}\b/ },
  {
    nombre: "siete dígitos seguidos o más (teléfono, cédula, NIT)",
    re: /\b\d{7,}\b/,
  },
  { nombre: "una dirección web", re: /https?:\/\/|\bwww\./i },
  {
    nombre: "un dominio suelto",
    re: /\b[a-z0-9][a-z0-9-]*\.(?:com|co|org|net|io|ai|dev|app|edu|gov)\b/i,
  },
];

/** Separa el frontmatter YAML del cuerpo. Falla nombrando el archivo. */
export function separarFrontmatter(markdown, archivo) {
  const m = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) {
    throw new Error(
      `${archivo}: falta el frontmatter. Todo documento a fondo empieza con un bloque ` +
        `«---» … «---» con slug, titulo, resumen, estado, ancla, actualizado y preguntas_de_prueba.`,
    );
  }
  return { crudo: m[1], cuerpo: m[2] };
}

/** Zod → «  - campo: mensaje», el formato de diagnóstico de esta casa. */
function parseOrThrow(schema, data, archivo) {
  const r = schema.safeParse(data);
  if (!r.success) {
    throw new Error(
      `${archivo}: frontmatter inválido:\n` +
        r.error.issues
          .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
          .join("\n"),
    );
  }
  return r.data;
}

/**
 * Markdown → documento con sus subsecciones. Puro: no toca disco.
 * Las marcas son las mismas dos de la historia — título `##` + comentario
 * `<!-- seccion: id -->` — para que quien ya alimentó la historia no aprenda
 * un formato nuevo.
 */
export function parseDocumento(markdown, archivo) {
  const { crudo, cuerpo } = separarFrontmatter(markdown, archivo);
  const meta = parseOrThrow(frontmatterSchema, parse(crudo), archivo);

  const subsecciones = [];
  for (const parte of cuerpo.split(/^## /m).slice(1)) {
    const corte = parte.indexOf("\n");
    const titulo = parte.slice(0, corte).trim();
    const resto = parte.slice(corte + 1);

    const marca = resto.match(/<!--\s*seccion:\s*([a-z0-9-]+)\s*-->/);
    if (!marca) {
      throw new Error(
        `${archivo}: la subsección "## ${titulo}" no tiene su comentario ` +
          `<!-- seccion: id -->. Cópialo de otra subsección.`,
      );
    }
    const id = marca[1];
    if (subsecciones.some((s) => s.id === id)) {
      throw new Error(
        `${archivo}: id de subsección duplicado "${id}". Dos subsecciones con el mismo id ` +
          `producen dos chunks que compiten por la misma cita.`,
      );
    }

    const texto = resto
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    subsecciones.push({ id, titulo, texto });
  }

  // Un BORRADOR puede no tener ni una subsección: es un documento por escribir,
  // y el esqueleto migrado del S3 nace así. A un APROBADO se le exige al menos
  // una — si no, no produce ni una cita y no hay nada que aprobar.
  if (meta.estado === "aprobado" && subsecciones.length === 0) {
    throw new Error(
      `${archivo}: está «aprobado» y no tiene ni una subsección «## Título» + ` +
        `<!-- seccion: id -->. Un documento sin subsecciones no produce ni una cita.`,
    );
  }
  return { ...meta, archivo, subsecciones };
}

/** El slug del frontmatter manda: el nombre del archivo no puede mentir. */
export function problemasDeNombre(doc, locale) {
  const esperado = `${doc.slug}.${locale}.md`;
  return path.basename(doc.archivo) === esperado
    ? []
    : [
        `${doc.archivo}: declara «slug: ${doc.slug}» pero el archivo se llama ` +
          `«${path.basename(doc.archivo)}» — debería ser «${esperado}».`,
      ];
}

/** El destino de la cita tiene que EXISTIR (la regla que nació del `#apps` muerto). */
export function problemasDeDestino(doc, catalogo) {
  return destinoExiste(doc.ancla, catalogo)
    ? []
    : [
        `${doc.archivo}: «ancla: ${doc.ancla}» no existe en el sitio. Una cita que no lleva ` +
          `a ninguna parte rompe la promesa del chat. Destinos válidos: una sección de la HOME ` +
          `(#trayectoria, #skills…) o una ruta real (/proyectos/<slug>, /vitrina/<frente>…).`,
      ];
}

/** Privacidad: barre el archivo ENTERO, frontmatter incluido. */
export function problemasDePrivacidad(markdown, archivo) {
  const problemas = [];
  const lineas = markdown.split("\n");
  for (const { nombre, re } of PATRONES_PRIVACIDAD) {
    lineas.forEach((linea, i) => {
      const m = linea.match(re);
      if (m) {
        problemas.push(
          `${archivo}:${i + 1}: ${nombre} («${m[0]}»). Los datos de contacto y de terceros ` +
            `no viajan a ningún archivo de este repositorio, que es público.`,
        );
      }
    });
  }
  return problemas;
}

/**
 * PARIDAD — solo se le exige a un `aprobado`: mismo conjunto de subsecciones,
 * en el mismo orden, con prosa en las dos. Un `borrador` vive solo en español
 * a propósito, mientras el dueño lo corrige.
 */
export function problemasDeParidad(docsEs, docsEn) {
  const problemas = [];
  const enPorSlug = new Map(docsEn.map((d) => [d.slug, d]));

  for (const es of docsEs) {
    if (es.estado !== "aprobado") continue;
    const en = enPorSlug.get(es.slug);
    if (!en) {
      problemas.push(
        `${es.archivo}: está «aprobado» y no existe su gemelo ` +
          `data/a-fondo/${es.slug}.en.md — un idioma ciego es peor que un PR que espera.`,
      );
      continue;
    }
    if (en.estado !== "aprobado") {
      problemas.push(
        `${es.archivo}: está «aprobado» pero ${en.archivo} sigue en «${en.estado}».`,
      );
    }
    const idsEs = es.subsecciones.map((s) => s.id);
    const idsEn = en.subsecciones.map((s) => s.id);
    if (idsEs.join("|") !== idsEn.join("|")) {
      const faltan = idsEs.filter((id) => !idsEn.includes(id));
      const sobran = idsEn.filter((id) => !idsEs.includes(id));
      problemas.push(
        `${es.slug}: las subsecciones no coinciden entre idiomas` +
          (faltan.length ? ` — falta(n) en inglés: ${faltan.join(", ")}` : "") +
          (sobran.length ? ` — sobra(n) en inglés: ${sobran.join(", ")}` : "") +
          (!faltan.length && !sobran.length ? " — están en distinto orden" : "") +
          ".",
      );
    }
    for (const s of es.subsecciones) {
      const gemela = en.subsecciones.find((x) => x.id === s.id);
      if (gemela && Boolean(s.texto) !== Boolean(gemela.texto)) {
        const lleno = s.texto ? "es" : "en";
        problemas.push(
          `${es.slug} · subsección "${s.id}": tiene prosa en ${lleno} y está vacía en el otro idioma.`,
        );
      }
    }
  }

  for (const en of docsEn) {
    if (en.estado === "aprobado" && !docsEs.some((d) => d.slug === en.slug)) {
      problemas.push(
        `${en.archivo}: está «aprobado» y no existe su gemelo data/a-fondo/${en.slug}.es.md.`,
      );
    }
  }
  return problemas;
}

/** Lee de disco los documentos de un idioma. Un directorio ausente = cero documentos. */
export function leerDocumentos(locale, dir = DIR_A_FONDO) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(`.${locale}.md`))
    .sort()
    .map((f) => {
      const completo = path.join(dir, f);
      return parseDocumento(
        readFileSync(completo, "utf8"),
        path.relative(ROOT, completo),
      );
    });
}

/**
 * La aduana entera. Devuelve la lista de problemas; quien llama decide si
 * rompe el build. Se separa de `main()` para poder ejercerla desde vitest.
 */
export function revisarAduana({ docsEs, docsEn, crudos, catalogo }) {
  const problemas = [];
  for (const [locale, docs] of [
    ["es", docsEs],
    ["en", docsEn],
  ]) {
    for (const doc of docs) {
      problemas.push(...problemasDeNombre(doc, locale));
      problemas.push(...problemasDeDestino(doc, catalogo));
      const crudo = crudos?.get(doc.archivo);
      if (crudo !== undefined) {
        problemas.push(...problemasDePrivacidad(crudo, doc.archivo));
      }
    }
  }
  problemas.push(...problemasDeParidad(docsEs, docsEn));
  return problemas;
}

/**
 * Documentos → chunks del índice del chat. **Solo los aprobados**: un borrador
 * es material de trabajo del dueño, no evidencia que el chat pueda citar.
 *
 * El troceo de hoy es «una subsección = un chunk». El tope de tamaño con
 * ventanas por párrafo llega en la fase 3, con su medición delante.
 */
export function chunksDeAFondo(docs, etiqueta) {
  const chunks = [];
  for (const doc of docs) {
    if (doc.estado !== "aprobado") continue;
    for (const s of doc.subsecciones) {
      const texto = s.texto.replace(/\s+/g, " ").trim();
      if (!texto) continue;
      chunks.push({
        id: `a-fondo-${doc.slug}-${s.id}`,
        titulo: `${etiqueta} — ${doc.titulo} · ${s.titulo}`,
        texto,
        ancla: doc.ancla,
      });
    }
  }
  return chunks;
}
