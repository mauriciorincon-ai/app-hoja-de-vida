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


/**
 * PREGUNTA ABIERTA: el bloque `[CONFIRMAR: …]` con el que un documento declara
 * lo que todavía no tiene fuente. Es el mecanismo central del flujo de
 * corrección —«ninguna cifra, fecha ni logro sin fuente; lo que falte va como
 * [CONFIRMAR], jamás relleno plausible»— y por eso tiene dos consecuencias
 * mecánicas, no una:
 *
 *  · **Un documento APROBADO no puede llevar ninguna** (ver
 *    `problemasDePreguntasAbiertas`). Si llevara, el chat citaría a un
 *    visitante un párrafo que dice «[CONFIRMAR: ¿a cuántas personas formaste?]»
 *    — la pregunta del autor a sí mismo, publicada como si fuera evidencia.
 *  · **La simulación las quita antes de medir** (ver `simularAprobacion`),
 *    porque mide el índice que existirá DESPUÉS de aprobar, y para aprobar hay
 *    que haberlas resuelto. Medidas: hoy son 29 bloques y 1 282 palabras — el
 *    9 % del corpus. Con ellas dentro, el troceo parte subsecciones que no
 *    son largas y la normalización por longitud de BM25 castiga justo a los
 *    fragmentos que más falta le hacen al dueño arreglar.
 */
/**
 * **Termina en el PRIMER `]`, y se lleva el espacio que tiene delante.** La
 * primera versión exigía que el corchete cerrara párrafo
 * (`\](?=\s*(?:\n\n|$))`) y eso la volvía peligrosa: con un `[CONFIRMAR]`
 * escrito **en medio de una frase**, el cuantificador perezoso seguía buscando
 * hasta el siguiente corchete que sí cerrara párrafo y **borraba en silencio
 * todo lo que había en medio** (reproducido en la auditoría: dos párrafos y
 * medio). El dueño va a escribir estas marcas durante semanas y las va a
 * escribir en línea. Verificado: sobre las 132 subsecciones reales las dos
 * versiones dan un resultado byte a byte idéntico — el arreglo no cambia lo
 * medido, cierra el caso que no estaba medido.
 */
export const PATRON_PREGUNTA_ABIERTA = /\s*\[CONFIRMAR[^\]]*\]/g;

/** Prosa sin sus preguntas abiertas, con los huecos de líneas cerrados. */
export function sinPreguntasAbiertas(texto) {
  return texto
    .replace(PATRON_PREGUNTA_ABIERTA, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Un aprobado con preguntas abiertas se publica al visitante. La aduana lo para. */
export function problemasDePreguntasAbiertas(doc) {
  if (doc.estado !== "aprobado") return [];
  return doc.subsecciones
    .filter((s) => /\[CONFIRMAR/.test(s.texto))
    .map(
      (s) =>
        `${doc.archivo} · subsección "${s.id}": está «aprobado» y todavía tiene un ` +
        `[CONFIRMAR: …]. El chat cita este texto tal cual a quien pregunte: aprobar es ` +
        `justamente haber resuelto esas preguntas. Respóndela y bórrala, o devuelve el ` +
        `documento a «borrador».`,
    );
}

/**
 * LOS BORRADORES, COMO SI YA ESTUVIERAN APROBADOS. Es lo que miden el golden
 * set y el banco de preguntas: el índice que existirá cuando el dueño apruebe.
 * Medir el corpus contra el índice publicado —que hoy no lo contiene— sería un
 * gate sin sujeto (regla 14, tercera pregunta).
 */
export function simularAprobacion(docs) {
  return docs.map((d) => ({
    ...d,
    estado: "aprobado",
    subsecciones: d.subsecciones.map((s) => ({
      ...s,
      texto: sinPreguntasAbiertas(s.texto),
    })),
  }));
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

  // La vuelta: un inglés aprobado cuyo español NO lo está. Sin esto, el índice
  // inglés cita un documento que el español no tiene —un idioma ve contenido
  // que el otro no—, y no lo cazaba nadie: el bucle de arriba solo recorre los
  // aprobados en español (lo encontró la auditoría del cierre).
  for (const en of docsEn) {
    if (en.estado !== "aprobado") continue;
    const es = docsEs.find((d) => d.slug === en.slug);
    if (!es) {
      problemas.push(
        `${en.archivo}: está «aprobado» y no existe su gemelo data/a-fondo/${en.slug}.es.md.`,
      );
    } else if (es.estado !== "aprobado") {
      problemas.push(
        `${en.archivo}: está «aprobado» pero ${es.archivo} sigue en «${es.estado}». ` +
          `El chat inglés citaría un documento que el español no tiene.`,
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
      problemas.push(...problemasDePreguntasAbiertas(doc));
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
 * TOPE DE TAMAÑO DE UN CHUNK, en palabras.
 *
 * Sin tope, «una subsección = un chunk» deja que una subsección larga entre
 * entera al contexto del modelo, y con `TOP_K_CONTEXTO = 4` el peor caso crece
 * sin techo. Con 180, el peor caso del contexto queda acotado en ~720 palabras.
 *
 * El número sale de MEDIR el corpus, no de la intuición (S8, fase 3): de las
 * 132 subsecciones escritas, la mediana son 101 palabras, el percentil 90 son
 * 143 y la más larga 247. A 180 se trocean **5 subsecciones (4 %)**; a 120 se
 * trocearían 33 (25 %), que es partir por partir. El tope corta la cola, no el
 * cuerpo.
 */
export const TOPE_PALABRAS_CHUNK = 180;

/**
 * SUELO DE UNA VENTANA, en palabras. Una ventana de 23 palabras es un chunk que
 * puede ganar el top-k por un término suelto y, citado, no dice nada. Si la
 * última cola queda por debajo del suelo se **funde con la anterior**, aunque
 * eso pase el tope: un chunk de 195 palabras es mejor que uno de 165 más un
 * huérfano de 30. Medido: de las 5 subsecciones que pasan de 180, solo 2 se
 * parten de verdad; las otras 3 se quedan enteras porque su cola no llegaba al
 * suelo — es decir, el tope corta donde hay algo que cortar.
 */
export const MINIMO_PALABRAS_VENTANA = 40;

/** Cuenta de palabras, la misma en todo el módulo. */
const palabrasDe = (t) => t.split(/\s+/).filter(Boolean).length;

/**
 * Trocea un texto largo en ventanas **por párrafo**, nunca a media frase. Cada
 * ventana acumula párrafos hasta que el siguiente la pasaría del tope; un
 * párrafo que ya excede el tope por sí solo viaja solo, sin partirse — cortar
 * dentro de un párrafo produce fragmentos que citados se leen truncados.
 */
export function ventanasPorParrafo(texto, tope = TOPE_PALABRAS_CHUNK) {
  const parrafos = texto
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (parrafos.length === 0) return [];

  const ventanas = [];
  let actual = [];
  let palabras = 0;
  for (const p of parrafos) {
    const n = p.split(/\s+/).length;
    if (actual.length > 0 && palabras + n > tope) {
      ventanas.push(actual.join(" "));
      actual = [];
      palabras = 0;
    }
    actual.push(p);
    palabras += n;
  }
  if (actual.length > 0) ventanas.push(actual.join(" "));

  // La cola corta se funde con su vecina: mejor un chunk grande que un huérfano.
  if (
    ventanas.length > 1 &&
    palabrasDe(ventanas[ventanas.length - 1]) < MINIMO_PALABRAS_VENTANA
  ) {
    const cola = ventanas.pop();
    ventanas[ventanas.length - 1] += ` ${cola}`;
  }
  return ventanas;
}

/**
 * Documentos → chunks del índice del chat. **Solo los aprobados**: un borrador
 * es material de trabajo del dueño, no evidencia que el chat pueda citar.
 *
 * Troceo: una subsección = un chunk, salvo que pase el tope, y entonces
 * ventanas por párrafo. **Las ventanas conservan la MISMA ancla** —la cita
 * lleva al mismo sitio visible, que es lo único que el lector ve— y el id gana
 * un sufijo para que sigan siendo chunks distintos con contenido distinto.
 */
export function chunksDeAFondo(docs, etiqueta, tope = TOPE_PALABRAS_CHUNK) {
  const chunks = [];
  for (const doc of docs) {
    if (doc.estado !== "aprobado") continue;
    for (const s of doc.subsecciones) {
      if (!s.texto.trim()) continue;
      const ventanas = ventanasPorParrafo(s.texto, tope);
      const partido = ventanas.length > 1;
      ventanas.forEach((texto, i) => {
        chunks.push({
          id: `a-fondo-${doc.slug}-${s.id}${partido ? `~${i + 1}` : ""}`,
          titulo: partido
            ? `${etiqueta} — ${doc.titulo} · ${s.titulo} (${i + 1}/${ventanas.length})`
            : `${etiqueta} — ${doc.titulo} · ${s.titulo}`,
          texto,
          ancla: doc.ancla,
        });
      });
    }
  }
  return chunks;
}
