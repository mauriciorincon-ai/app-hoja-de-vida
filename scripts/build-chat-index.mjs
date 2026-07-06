/**
 * Índice de conocimiento del chat (S3, ADR-010) — corre en cada build ANTES
 * de `next build` (encadenado en package.json, patrón del PDF ADR-008).
 *
 * Fuentes por locale: data/cv.{es,en}.yaml + data/apps.yaml +
 * data/historia/historia.{es,en}.md (corpus principal cuando tiene contenido).
 * Salida: public/chat-index.{es,en}.json — UN solo asset que sirve doble:
 * retrieval del RAG en el server (/api/chat) y búsqueda local del fallback
 * en el cliente (fetch lazy).
 *
 * Cada chunk lleva `ancla` (destino de la cita): sección de la HOME
 * ("#trayectoria") o página ("/proyectos/<slug>"); el cliente antepone
 * "/{locale}".
 *
 * REGLA DE PARIDAD (falla el build): si una sección de la historia tiene
 * contenido en un idioma, su gemela (mismo `seccion: id`) debe tenerlo en el
 * otro. El chat responde en el idioma de la página — sin paridad, un idioma
 * quedaría ciego.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";

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
    logros: "Logros",
    certificaciones: "Certificaciones",
    skills: "Skills",
    contacto: "Contacto y enlaces",
    apps: "Apps del pipeline",
    historia: "Historia",
  },
  en: {
    perfil: "Profile",
    trayectoria: "Career",
    logros: "Achievements",
    certificaciones: "Certifications",
    skills: "Skills",
    contacto: "Contact & links",
    apps: "Pipeline apps",
    historia: "Story",
  },
};

function readYaml(fileName) {
  return parse(readFileSync(path.join(ROOT, "data", fileName), "utf8"));
}

/**
 * Parsea historia.<locale>.md → secciones {id, ancla, titulo, texto}.
 * Marcas del dueño (las únicas 2): encabezado `## Título` + comentario
 * `<!-- seccion: id | ancla: destino -->`. El resto de comentarios (guías,
 * cabecera de privacidad) se descarta y NUNCA se indexa.
 */
export function parseHistoria(markdown, fileName) {
  const sections = [];
  const parts = markdown.split(/^## /m).slice(1); // descarta el preámbulo

  for (const part of parts) {
    const newlineAt = part.indexOf("\n");
    const titulo = part.slice(0, newlineAt).trim();
    let body = part.slice(newlineAt + 1);

    const marker = body.match(
      /<!--\s*seccion:\s*([a-z0-9-]+)\s*(?:\|\s*ancla:\s*(\S+))?\s*-->/,
    );
    if (!marker) {
      throw new Error(
        `${fileName}: la sección "## ${titulo}" no tiene el comentario ` +
          `<!-- seccion: id | ancla: destino -->. Cópialo de otra sección.`,
      );
    }
    const [, id, ancla = "#trayectoria"] = marker;

    // Fuera comentarios (marca + guías): solo la prosa del dueño se indexa.
    const texto = body
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (sections.some((s) => s.id === id)) {
      throw new Error(`${fileName}: id de sección duplicado "${id}".`);
    }
    sections.push({ id, ancla, titulo, texto });
  }
  return sections;
}

/** Paridad ES/EN de la historia: mismas secciones, contenido en ambas o en ninguna. */
export function checkHistoriaParity(es, en) {
  const problems = [];
  const esById = new Map(es.map((s) => [s.id, s]));
  const enById = new Map(en.map((s) => [s.id, s]));

  for (const id of new Set([...esById.keys(), ...enById.keys()])) {
    const inEs = esById.get(id);
    const inEn = enById.get(id);
    if (!inEs || !inEn) {
      problems.push(
        `la sección "${id}" existe solo en historia.${inEs ? "es" : "en"}.md ` +
          `— crea su gemela (mismo "seccion: ${id}") en el otro archivo`,
      );
      continue;
    }
    if (Boolean(inEs.texto) !== Boolean(inEn.texto)) {
      const lleno = inEs.texto ? "es" : "en";
      const vacio = inEs.texto ? "en" : "es";
      problems.push(
        `la sección "${id}" tiene contenido en historia.${lleno}.md pero está ` +
          `vacía en historia.${vacio}.md — tradúcela antes del push (regla de paridad)`,
      );
    }
  }
  return problems;
}

/** Chunks de los YAML estructurados (hechos) + historia (narrativa). */
export function buildChunks({ cv, apps, historia, locale }) {
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
    const ancla = p.casestudy ? `/proyectos/${p.slug}` : "#proyectos";
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
      "#apps",
    );
  }

  for (const s of historia) {
    if (!s.texto) continue; // el esqueleto vacío no bloquea (la orden lo exige)
    push(`historia-${s.id}`, `${L.historia} — ${s.titulo}`, s.texto, s.ancla);
  }

  return chunks;
}

function main() {
  const apps = readYaml("apps.yaml");

  const historiaBySrc = {};
  for (const locale of LOCALES) {
    const file = path.join(ROOT, "data", "historia", `historia.${locale}.md`);
    historiaBySrc[locale] = parseHistoria(
      readFileSync(file, "utf8"),
      `data/historia/historia.${locale}.md`,
    );
  }

  const parityProblems = checkHistoriaParity(
    historiaBySrc.es,
    historiaBySrc.en,
  );
  if (parityProblems.length > 0) {
    console.error("✖ Paridad ES/EN de la historia rota — el build se detiene:");
    for (const p of parityProblems) console.error(`  - ${p}`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  for (const locale of LOCALES) {
    const cv = readYaml(`cv.${locale}.yaml`);
    const chunks = buildChunks({
      cv,
      apps,
      historia: historiaBySrc[locale],
      locale,
    });
    const index = { version: 1, locale, chunks };
    const outFile = path.join(OUT_DIR, `chat-index.${locale}.json`);
    writeFileSync(outFile, JSON.stringify(index), "utf8");
    console.log(
      `✓ chat-index.${locale}.json — ${chunks.length} chunks (` +
        `${historiaBySrc[locale].filter((s) => s.texto).length} secciones de historia con contenido)`,
    );
  }
}

// Ejecutable directo (build) e importable (tests unit del builder).
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  main();
}
