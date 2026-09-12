/**
 * Índice de conocimiento del chat (S3, ADR-010; canal «a fondo» S8, ADR-019) —
 * corre en cada build ANTES de `next build` (encadenado en package.json, patrón
 * del PDF ADR-008).
 *
 * Fuentes por locale: data/cv.{es,en}.yaml + data/apps.yaml +
 * data/a-fondo/<slug>.{es,en}.md (el corpus profundo, y el principal cuando
 * tiene documentos aprobados).
 * Salida: public/chat-index.{es,en}.json — UN solo asset que sirve doble:
 * retrieval del RAG en el server (/api/chat) y búsqueda local del fallback
 * en el cliente (fetch lazy).
 *
 * Cada chunk lleva `ancla` (destino de la cita): sección de la HOME
 * ("#trayectoria") o página ("/proyectos/<slug>"); el cliente antepone
 * "/{locale}".
 *
 * **EL DESTINO DE TODA CITA SE VERIFICA CONTRA EL SITIO REAL** (S8): el
 * catálogo de `scripts/destinos.mjs` se deriva de la HOME y de los datos, y el
 * build FALLA si un chunk apunta a algo que no existe. Nació de encontrar
 * `#apps` —muerto desde la revisión post-S7— vivo en dos sitios a la vez.
 *
 * La aduana del canal «a fondo» (frontmatter, ids duplicados, paridad ES/EN de
 * los aprobados, privacidad mecánica) vive en `scripts/a-fondo.mjs` y también
 * rompe el build, nombrando archivo y campo.
 *
 * HISTORIA RETIRADA (S8): `data/historia/historia.{es,en}.md` era un esqueleto
 * de 12 secciones sin una sola línea de prosa —las ~40 palabras por sección
 * eran la GUÍA, no el contenido, y el build lo imprimía en cada corrida:
 * «0 secciones de historia con contenido»—. Sus 12 secciones migraron a
 * `data/a-fondo/` conservando id, título, destino y guía palabra por palabra
 * (test de conservación). Declarado en el manual y en la guía de prueba.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";
import { chunksDeAFondo, leerDocumentos, problemasDeParidad, problemasDeNombre, problemasDeDestino, problemasDePreguntasAbiertas, problemasDePrivacidad } from "./a-fondo.mjs";
import { catalogoDeDestinos, destinoExiste } from "./destinos.mjs";

const ROOT = process.cwd();
// Los tests pasan un directorio temporal como argv[2] (patrón del script del PDF)
const OUT_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "public");
const LOCALES = ["es", "en"];

const LABELS = {
  es: {
    perfil: "Perfil",
    trayectoria: "Trayectoria",
    estudios: "Estudios",
    logros: "Logros",
    certificaciones: "Certificaciones",
    skills: "Skills",
    contacto: "Contacto y enlaces",
    apps: "Apps del pipeline",
    aFondo: "A fondo",
  },
  en: {
    perfil: "Profile",
    trayectoria: "Career",
    estudios: "Education",
    logros: "Achievements",
    certificaciones: "Certifications",
    skills: "Skills",
    contacto: "Contact & links",
    apps: "Pipeline apps",
    aFondo: "In depth",
  },
};

function readYaml(fileName) {
  return parse(readFileSync(path.join(ROOT, "data", fileName), "utf8"));
}

/** Chunks de los YAML estructurados (hechos) + «a fondo» (narrativa). */
export function buildChunks({ cv, apps, aFondo, locale }) {
  const L = LABELS[locale];
  const chunks = [];
  const push = (id, titulo, texto, ancla) => {
    const clean = String(texto).replace(/\s+/g, " ").trim();
    if (clean) chunks.push({ id, titulo, texto: clean, ancla });
  };

  const { identidad } = cv;
  push(
    "perfil",
    L.perfil,
    `${identidad.nombre} — ${identidad.eyebrow}. ${identidad.titular} ${identidad.resumen} ${identidad.perfil ?? ""}`,
    "#perfil",
  );
  push(
    "contacto",
    L.contacto,
    `${identidad.ubicacion}. Email: ${identidad.email}. ${cv.identidad.enlaces
      .map((e) => `${e.etiqueta}: ${e.url}`)
      .join(" · ")}`,
    "#contacto",
  );

  cv.trayectoria.forEach((hito, i) => {
    push(
      `trayectoria-${i}`,
      `${L.trayectoria} — ${hito.rol} · ${hito.organizacion}`,
      `${hito.periodo}: ${hito.rol}, ${hito.organizacion}. ${hito.descripcion} ${(hito.bullets ?? []).join(" ")}`,
      "#trayectoria",
    );
  });

  push(
    "logros",
    L.logros,
    cv.logros
      .map(
        (l) =>
          `${l.prefijo ?? ""}${l.valor}${l.sufijo ?? ""} ${l.etiqueta}: ${l.descripcion}`,
      )
      .join(" · "),
    "#logros",
  );

  for (const p of cv.proyectos) {
    // Sin sección Proyectos en la HOME (post-S7), la cita de un proyecto
    // sin detalle cae en la trayectoria, que es donde vive su hito.
    const ancla = p.casestudy ? `/proyectos/${p.slug}` : "#trayectoria";
    push(`proyecto-${p.slug}`, p.nombre, `${p.resumen} ${(p.stack ?? []).join(", ")}`, ancla);
    if (p.casestudy) {
      const c = p.casestudy;
      // Título diferenciado: las citas [n] del proyecto y de su case study
      // no deben salir con la misma etiqueta en los chips del chat
      push(
        `casestudy-${p.slug}`,
        `${p.nombre} · case study`,
        `${c.contexto} ${c.reto} ${c.acciones.join(" ")} ${c.impacto.join(" ")}`,
        ancla,
      );
    }
  }

  push(
    "estudios",
    L.estudios,
    (cv.estudios ?? [])
      .map((e) => `${e.titulo}, ${e.institucion}${e.periodo ? ` (${e.periodo})` : ""}. ${e.nota ?? ""}`)
      .join(" · "),
    "#estudios",
  );

  push(
    "certificaciones",
    L.certificaciones,
    cv.certificaciones
      .map((c) => `${c.nombre} (${c.fecha}). ${c.nota ?? ""}`)
      .join(" · "),
    "#certificaciones",
  );

  push(
    "skills",
    L.skills,
    cv.skills.map((g) => `${g.grupo}: ${g.items.join(", ")}`).join(" · "),
    "#skills",
  );

  for (const app of apps.apps) {
    push(
      `app-${app.id}`,
      `${L.apps} — ${app.nombre[locale]}`,
      `${app.nombre[locale]} (${app.estado}): ${app.descripcion[locale]}`,
      // «#apps» murió en la revisión post-S7 (la sección se retiró y el roadmap
      // se fue a /vitrina/apps). Lo que la HOME enseña hoy es la vitrina.
      "#vitrina",
    );
  }

  // Solo los documentos APROBADOS entran al índice: un borrador es material de
  // trabajo del dueño, no evidencia que el chat pueda citar.
  chunks.push(...chunksDeAFondo(aFondo ?? [], L.aFondo));

  return chunks;
}

/** Un problema de aduana rompe el build nombrando archivo y campo. */
function detener(titulo, problemas) {
  console.error(`\u2716 ${titulo} — el build se detiene:`);
  for (const p of problemas) console.error(`  - ${p}`);
  process.exit(1);
}

function main() {
  const apps = readYaml("apps.yaml");
  const catalogo = catalogoDeDestinos();

  // --- ADUANA DEL CANAL «A FONDO» -----------------------------------------
  const docs = {};
  const crudos = new Map();
  for (const locale of LOCALES) {
    docs[locale] = leerDocumentos(locale);
    for (const doc of docs[locale]) {
      crudos.set(doc.archivo, readFileSync(path.join(ROOT, doc.archivo), "utf8"));
    }
  }

  const problemas = [];
  for (const locale of LOCALES) {
    for (const doc of docs[locale]) {
      problemas.push(...problemasDeNombre(doc, locale));
      problemas.push(...problemasDeDestino(doc, catalogo));
      problemas.push(...problemasDePreguntasAbiertas(doc));
      problemas.push(...problemasDePrivacidad(crudos.get(doc.archivo), doc.archivo));
    }
  }
  problemas.push(...problemasDeParidad(docs.es, docs.en));
  if (problemas.length > 0) detener("Aduana del canal «a fondo»", problemas);

  mkdirSync(OUT_DIR, { recursive: true });
  for (const locale of LOCALES) {
    const cv = readYaml(`cv.${locale}.yaml`);
    const chunks = buildChunks({ cv, apps, aFondo: docs[locale], locale });

    // --- EL DESTINO DE TODA CITA EXISTE ------------------------------------
    // Vale para TODOS los chunks, no solo para los del canal nuevo: el `#apps`
    // muerto vivía en los chunks de las apps, que salen de un YAML.
    const rotos = chunks
      .filter((c) => !destinoExiste(c.ancla, catalogo))
      .map(
        (c) =>
          `chat-index.${locale}.json · chunk "${c.id}" apunta a «${c.ancla}», que no existe en el sitio.`,
      );
    if (rotos.length > 0) detener("Destinos de cita inexistentes", rotos);

    const index = { version: 1, locale, chunks };
    const outFile = path.join(OUT_DIR, `chat-index.${locale}.json`);
    writeFileSync(outFile, JSON.stringify(index), "utf8");

    const aprobados = docs[locale].filter((d) => d.estado === "aprobado").length;
    console.log(
      `\u2713 chat-index.${locale}.json — ${chunks.length} chunks (` +
        `${aprobados} de ${docs[locale].length} documentos «a fondo» aprobados e indexados)`,
    );
  }
}

// Ejecutable directo (build) e importable (tests unit del builder).
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  main();
}
