import { mkdirSync, readFileSync, createWriteStream } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";
import PDFDocument from "pdfkit";
import { aniosCumplidos } from "./anios.mjs";

/**
 * PDF ATS del CV, generado en build desde data/cv.{es,en}.yaml (ADR-008):
 * una sola fuente de verdad — la web y el PDF no pueden divergir.
 *
 * Revisión post-S8, bloque D (2026-09-13). El dueño pasó el PDF por un
 * comprobador ATS (parseó bien) y pidió dos cosas: la ESTRUCTURA de dos
 * columnas de ese comprobador —experiencia a la izquierda; perfil, formación,
 * certificaciones y skills a la derecha— «simple y minimalista pero un poco
 * más atractiva», con un azul navy; y que el DOMINIO, cuando exista, vaya en
 * la cabecera «muy, muy explícito»: primero y en negrilla.
 *
 * - Helvetica (fuente estándar, sin embedding); todo es texto seleccionable.
 * - Dos columnas dibujadas por página en orden ATS: cabecera → columna
 *   derecha (perfil, formación, certificaciones, skills) → columna izquierda
 *   (experiencia, proyectos). La izquierda fluye a más páginas si hace falta.
 * - El dominio NO vive en el repo (regla 16): llega por
 *   `NEXT_PUBLIC_SITE_URL` en el build de Vercel. Sin variable, o en
 *   localhost, la cabecera no lo muestra.
 * - La validación Zod del contenido ya corre dentro de `next build`
 *   (src/lib/content.ts); este script no la duplica.
 * Uso: node scripts/generate-cv-pdf.mjs [outDir]   (default: public/cv)
 */

const LABELS = {
  es: {
    perfil: "PERFIL",
    experiencia: "EXPERIENCIA",
    proyectos: "PROYECTOS",
    skills: "SKILLS",
    certificaciones: "CERTIFICACIONES",
    formacion: "FORMACIÓN",
    enCurso: "en curso",
    masEnMiSitio: "Más en mi sitio:",
    cierreChat: /\s*¿Quieres saber algo más\?[^.]*\./,
    archivo: "Henry-Rincon-CV-ES.pdf",
    titulo: "CV — Henry Rincón (ES)",
  },
  en: {
    perfil: "PROFILE",
    experiencia: "EXPERIENCE",
    proyectos: "PROJECTS",
    skills: "SKILLS",
    certificaciones: "CERTIFICATIONS",
    formacion: "EDUCATION",
    enCurso: "in progress",
    masEnMiSitio: "More on my site:",
    cierreChat: /\s*Want to know anything else\?[^.]*\./,
    archivo: "Henry-Rincon-CV-EN.pdf",
    titulo: "CV — Henry Rincón (EN)",
  },
};

/** Paleta del PDF: navy para acentos, tinta para el texto, gris para fechas. */
export const NAVY = "#2B4C7E"; // navy aclarado (segunda vuelta del dueño)
const TINTA = "#111111";
const GRIS = "#555555";

const PAGINA = { ancho: 595.28, alto: 841.89 };
const MARGEN = { arriba: 40, abajo: 44, lado: 40 };
const HUECO = 14;
const ANCHO_UTIL = PAGINA.ancho - 2 * MARGEN.lado;
const COL_IZQ = { x: MARGEN.lado, ancho: Math.round(ANCHO_UTIL * 0.62) };
const COL_DER = {
  x: MARGEN.lado + COL_IZQ.ancho + HUECO,
  ancho: ANCHO_UTIL - COL_IZQ.ancho - HUECO,
};

/** Helvetica usa WinAnsi: se sustituyen los caracteres fuera de ese set. */
export function ansi(text) {
  return (
    String(text)
      .replace(/−/g, "-") // − (minus sign) → hyphen
      .replace(/→/g, "->") // →
      .replace(/↔/g, "<->") // ↔
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/…/g, "...")
      // Cualquier resto fuera de Latin-1 se elimina (emojis, símbolos)
      .replace(/[^ -ÿ–—•]/g, "")
  );
}

/** Un enlace sin protocolo ni `www.`: como lo escribe un reclutador. */
function sinProtocolo(url) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

/**
 * La línea de contacto de la cabecera. `destacado` es el dominio del sitio
 * (primero y en negrilla) cuando `sitio` es una URL pública; `resto` va
 * detrás: correo y enlaces sin protocolo. La ubicación va en su propia línea.
 */
export function lineaDeContacto(identidad, sitio) {
  let destacado = null;
  if (sitio && !/localhost|127\.0\.0\.1/.test(sitio)) {
    try {
      destacado = sinProtocolo(new URL(sitio).origin);
    } catch {
      destacado = null;
    }
  }
  const resto = [
    identidad.email,
    ...identidad.enlaces.map((e) => sinProtocolo(e.url)),
  ].filter(Boolean);
  return { destacado, resto };
}

/**
 * El perfil, para el PDF: la web cierra con «¿Quieres saber algo más?
 * Pregúntaselo al chat…», y en papel no hay chat. Con dominio conocido, esa
 * frase se vuelve «Más en mi sitio: dominio» (el dueño quiso ese espacio para
 * su página); sin dominio, la frase simplemente no va.
 */
export function perfilParaPdf(perfil, labels, destacado) {
  const sinChat = String(perfil).replace(labels.cierreChat, "").trimEnd();
  return destacado
    ? `${sinChat} ${labels.masEnMiSitio} ${destacado}.`
    : sinChat;
}

/**
 * Una columna que fluye: mide antes de escribir y salta de página cuando no
 * cabe. Las dos columnas comparten páginas (`bufferPages`), así que cada una
 * recuerda en qué página y a qué altura va.
 */
class Columna {
  constructor(doc, x, ancho, yInicial, pagina = 0) {
    this.doc = doc;
    this.x = x;
    this.ancho = ancho;
    this.y = yInicial;
    this.pagina = pagina;
  }

  get fondo() {
    return PAGINA.alto - MARGEN.abajo;
  }

  asegurar(alto) {
    const { doc } = this;
    if (this.y + alto > this.fondo) {
      this.pagina += 1;
      if (doc.bufferedPageRange().count <= this.pagina) doc.addPage();
      this.y = MARGEN.arriba;
    }
    doc.switchToPage(this.pagina);
  }

  /** Escribe un párrafo con el estilo actual, con sangría opcional. */
  parrafo(texto, { sangria = 0, lineGap = 1, juntoCon = 0 } = {}) {
    const { doc } = this;
    const ancho = this.ancho - sangria;
    const alto = doc.heightOfString(texto, { width: ancho, lineGap });
    this.asegurar(alto + juntoCon);
    doc.text(texto, this.x + sangria, this.y, { width: ancho, lineGap });
    this.y = doc.y;
  }

  /** Un bullet: la viñeta en el margen, el texto con sangría. */
  vineta(texto, { juntoCon = 0 } = {}) {
    const { doc } = this;
    const sangria = 9;
    const alto = doc.heightOfString(texto, {
      width: this.ancho - sangria,
      lineGap: 1,
    });
    this.asegurar(alto + juntoCon);
    doc.text("•", this.x, this.y, { lineBreak: false });
    doc.text(texto, this.x + sangria, this.y, {
      width: this.ancho - sangria,
      lineGap: 1,
    });
    this.y = doc.y;
  }

  alto(texto, { sangria = 0, lineGap = 1 } = {}) {
    return this.doc.heightOfString(texto, {
      width: this.ancho - sangria,
      lineGap,
    });
  }

  espacio(pt) {
    this.y += pt;
  }

  /** Título de sección: versalitas en negrilla y una regla navy debajo. */
  seccion(titulo) {
    const { doc } = this;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(TINTA);
    this.asegurar(doc.heightOfString(titulo, { width: this.ancho }) + 40);
    if (this.y > MARGEN.arriba) this.espacio(10);
    doc.text(titulo, this.x, this.y, {
      width: this.ancho,
      characterSpacing: 0.6,
    });
    this.y = doc.y + 2;
    doc
      .moveTo(this.x, this.y)
      .lineTo(this.x + this.ancho, this.y)
      .lineWidth(1)
      .strokeColor(NAVY)
      .stroke();
    this.y += 7;
  }
}

function estilo(doc, fuente, tamano, color) {
  doc.font(fuente).fontSize(tamano).fillColor(color);
}

function cabecera(doc, cv, sitio) {
  const { identidad } = cv;
  let y = MARGEN.arriba;
  estilo(doc, "Helvetica-Bold", 20, TINTA);
  doc.text(ansi(identidad.nombreCompleto ?? identidad.nombre), MARGEN.lado, y, {
    width: ANCHO_UTIL,
    characterSpacing: 0.3,
  });
  y = doc.y + 2;
  estilo(doc, "Helvetica-Bold", 11, NAVY);
  doc.text(ansi(identidad.eyebrow), MARGEN.lado, y, { width: ANCHO_UTIL });
  y = doc.y + 6;

  const { destacado, resto } = lineaDeContacto(identidad, sitio);
  const separador = "   ·   ";
  if (destacado) {
    estilo(doc, "Helvetica-Bold", 9.5, NAVY);
    doc.text(ansi(destacado), MARGEN.lado, y, {
      continued: true,
      width: ANCHO_UTIL,
    });
    estilo(doc, "Helvetica", 8.5, GRIS);
    doc.text(ansi(separador + resto.join(separador)), { width: ANCHO_UTIL });
  } else {
    estilo(doc, "Helvetica", 8.5, GRIS);
    doc.text(ansi(resto.join(separador)), MARGEN.lado, y, {
      width: ANCHO_UTIL,
    });
  }
  y = doc.y + 2;
  estilo(doc, "Helvetica", 8.5, GRIS);
  doc.text(ansi(identidad.ubicacion), MARGEN.lado, y, { width: ANCHO_UTIL });
  y = doc.y + 8;
  doc
    .moveTo(MARGEN.lado, y)
    .lineTo(MARGEN.lado + ANCHO_UTIL, y)
    .lineWidth(1.5)
    .strokeColor(NAVY)
    .stroke();
  return y + 12;
}

function columnaDerecha(doc, cv, labels, yInicial, sitio) {
  const col = new Columna(doc, COL_DER.x, COL_DER.ancho, yInicial);

  col.seccion(labels.perfil);
  estilo(doc, "Helvetica", 8.8, TINTA);
  const { destacado } = lineaDeContacto(cv.identidad, sitio);
  col.parrafo(
    ansi(
      perfilParaPdf(
        cv.identidad.perfil || cv.identidad.resumen,
        labels,
        destacado,
      ),
    ),
    { lineGap: 1.6 },
  );

  const estudios = cv.estudios ?? [];
  if (estudios.length > 0) {
    col.seccion(labels.formacion);
    for (const item of estudios) {
      estilo(doc, "Helvetica-Bold", 9.2, TINTA);
      col.parrafo(ansi(item.titulo), { juntoCon: 24 });
      estilo(doc, "Helvetica", 8.8, NAVY);
      col.parrafo(ansi(item.institucion));
      if (item.periodo) {
        estilo(doc, "Helvetica", 8.2, GRIS);
        col.parrafo(ansi(item.periodo));
      }
      col.espacio(5);
    }
  }

  col.seccion(labels.certificaciones);
  for (const cert of cv.certificaciones) {
    const cuando = cert.estado === "en curso" ? labels.enCurso : cert.fecha;
    estilo(doc, "Helvetica", 8.8, TINTA);
    col.vineta(ansi(cuando ? `${cert.nombre} (${cuando})` : cert.nombre));
    col.espacio(2);
  }

  col.seccion(labels.skills);
  for (const grupo of cv.skills) {
    estilo(doc, "Helvetica-Bold", 9, NAVY);
    col.parrafo(ansi(grupo.grupo), { juntoCon: 14 });
    estilo(doc, "Helvetica", 8.8, TINTA);
    col.parrafo(ansi(grupo.items.join("  ·  ")), { lineGap: 1.6 });
    col.espacio(5);
  }
  return col;
}

function columnaIzquierda(doc, cv, labels, yInicial) {
  const col = new Columna(doc, COL_IZQ.x, COL_IZQ.ancho, yInicial);

  col.seccion(labels.experiencia);
  for (const rol of cv.trayectoria) {
    estilo(doc, "Helvetica-Bold", 10, TINTA);
    // El título del hito no se queda solo al pie de una página: viaja con la
    // organización, el periodo y el primer bullet.
    col.parrafo(ansi(rol.rol), { juntoCon: 40 });
    estilo(doc, "Helvetica-Bold", 9.2, NAVY);
    col.parrafo(ansi(rol.organizacion));
    estilo(doc, "Helvetica", 8.2, GRIS);
    col.parrafo(ansi(rol.periodo));
    col.espacio(3);
    estilo(doc, "Helvetica", 9, TINTA);
    if (rol.bullets.length > 0) {
      for (const bullet of rol.bullets) col.vineta(ansi(bullet));
    } else {
      col.parrafo(ansi(rol.descripcion));
    }
    col.espacio(8);
  }

  col.seccion(labels.proyectos);
  for (const proyecto of cv.proyectos) {
    estilo(doc, "Helvetica-Bold", 9.5, TINTA);
    col.parrafo(ansi(proyecto.nombre), { juntoCon: 24 });
    estilo(doc, "Helvetica", 9, TINTA);
    col.parrafo(ansi(proyecto.resumen));
    col.espacio(6);
  }
  return col;
}

export function renderCv(
  cv,
  labels,
  outFile,
  sitio = process.env.NEXT_PUBLIC_SITE_URL,
) {
  const doc = new PDFDocument({
    size: "A4",
    bufferPages: true,
    margins: {
      top: MARGEN.arriba,
      bottom: MARGEN.abajo,
      left: MARGEN.lado,
      right: MARGEN.lado,
    },
    info: { Title: labels.titulo, Author: cv.identidad.nombreCompleto },
  });
  const salida = createWriteStream(outFile);
  doc.pipe(salida);

  const yColumnas = cabecera(doc, cv, sitio);
  // Orden ATS por página: cabecera, luego perfil/formación/certificaciones/
  // skills (derecha), luego experiencia/proyectos (izquierda).
  columnaDerecha(doc, cv, labels, yColumnas, sitio);
  columnaIzquierda(doc, cv, labels, yColumnas);

  doc.end();
  return new Promise((resolve) => salida.on("finish", resolve));
}

/** Los logros calculados (`desde`) llegan con su valor, como en la web. */
function conLogrosCalculados(cv) {
  return {
    ...cv,
    logros: (cv.logros ?? []).map((l) =>
      l.desde ? { ...l, valor: aniosCumplidos(l.desde) } : l,
    ),
  };
}

// Ejecutable directo (build) e importable (tests).
if (
  process.argv[1] &&
  import.meta.url.endsWith(path.basename(process.argv[1]))
) {
  const outDir = process.argv[2] ?? path.join(process.cwd(), "public", "cv");
  mkdirSync(outDir, { recursive: true });
  for (const locale of ["es", "en"]) {
    const cv = conLogrosCalculados(
      parse(readFileSync(`data/cv.${locale}.yaml`, "utf8")),
    );
    const labels = LABELS[locale];
    const outFile = path.join(outDir, labels.archivo);
    await renderCv(cv, labels, outFile);
    console.log(`cv-pdf: ${outFile}`);
  }
}
