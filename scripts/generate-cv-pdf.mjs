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
 * la cabecera «muy, muy explícito». El 2026-09-24 lo pidió «grande y
 * resaltado»: un bloque navy junto al nombre, el cierre del perfil y el pie de
 * cada página, los tres enlazados (ver `bloqueDelDominio` y `pie`).
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

export const LABELS = {
  es: {
    perfil: "PERFIL",
    experiencia: "EXPERIENCIA",
    proyectos: "PROYECTOS",
    skills: "SKILLS",
    certificaciones: "CERTIFICACIONES",
    formacion: "FORMACIÓN",
    enCurso: "en curso",
    masEnMiSitio: "Más en mi sitio:",
    masEnMiSitioWeb: "Más en mi sitio web.",
    cierreChat: /\s*¿Quieres saber algo más\?[^.]*\./,
    archivo: "Henry-Rincon-CV-ES.pdf",
    titulo: "CV — Henry Rincón (ES)",
    ruta: "/es",
    rotuloSitio: ["En mi sitio encontrarás", "CV interactivo · casos · chat"],
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
    masEnMiSitioWeb: "More on my website.",
    cierreChat: /\s*Want to know anything else\?[^.]*\./,
    archivo: "Henry-Rincon-CV-EN.pdf",
    titulo: "CV — Henry Rincón (EN)",
    ruta: "/en",
    rotuloSitio: ["On my site you'll find", "Interactive CV · cases · chat"],
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
 * El contacto de la cabecera. `destacado` es el dominio del sitio cuando
 * `sitio` es una URL pública, y `origen` la dirección a la que enlaza; `resto`
 * es el correo y los enlaces sin protocolo. La ubicación va en su propia línea.
 */
export function lineaDeContacto(identidad, sitio) {
  let destacado = null;
  let origen = null;
  if (sitio && !/localhost|127\.0\.0\.1/.test(sitio)) {
    try {
      origen = new URL(sitio).origin;
      destacado = sinProtocolo(origen);
    } catch {
      destacado = null;
      origen = null;
    }
  }
  const resto = [
    identidad.email,
    ...identidad.enlaces.map((e) => sinProtocolo(e.url)),
  ].filter(Boolean);
  return { destacado, origen, resto };
}

/**
 * El perfil, para el PDF: la web cierra con «¿Quieres saber algo más?
 * Pregúntaselo al chat…», y en papel no hay chat. El dueño quiso ese espacio
 * para anunciar su página: con dominio conocido, «Más en mi sitio: dominio»;
 * sin dominio todavía, «Más en mi sitio web.» — el anuncio va siempre.
 */
export function perfilParaPdf(perfil, labels, destacado) {
  const sinChat = String(perfil).replace(labels.cierreChat, "").trimEnd();
  return destacado
    ? `${sinChat} ${labels.masEnMiSitio} ${destacado}.`
    : `${sinChat} ${labels.masEnMiSitioWeb}`;
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
    const vigente = estiloVigente.get(doc);
    if (vigente) estilo(doc, ...vigente);
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

  /**
   * Un párrafo con un tramo enlazado: `enlace` va en navy y en negrilla y se
   * puede pulsar; `antes` y `despues`, en el estilo `base`.
   */
  parrafoConEnlace(antes, enlace, despues, url, base, { lineGap = 1 } = {}) {
    const { doc } = this;
    estilo(doc, base.fuente, base.tamano, base.color);
    const alto = doc.heightOfString(`${antes}${enlace}${despues}`, {
      width: this.ancho,
      lineGap,
    });
    this.asegurar(alto);
    doc.text(antes, this.x, this.y, {
      width: this.ancho,
      lineGap,
      continued: true,
    });
    estilo(doc, "Helvetica-Bold", base.tamano, NAVY);
    doc.text(enlace, { link: url, continued: true });
    estilo(doc, base.fuente, base.tamano, base.color);
    doc.text(despues, { link: null });
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

  /**
   * Título de sección: versalitas en negrilla y una regla navy debajo. Viaja
   * con los `juntoCon` puntos que le siguen: un título solo al pie de una
   * página es un título huérfano.
   */
  seccion(titulo, { juntoCon = 40 } = {}) {
    const { doc } = this;
    estilo(doc, "Helvetica-Bold", 10, TINTA);
    // 10 de aire arriba, 2 hasta la regla y 7 debajo: lo que ocupa de verdad.
    this.asegurar(
      doc.heightOfString(titulo, { width: this.ancho }) + 19 + juntoCon,
    );
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

/**
 * El estilo vigente de cada documento. pdfkit escribe el color en el flujo de
 * la página ACTUAL: si una columna fija el color y luego salta a otra página,
 * el texto sale con el último color que quedó en esa otra página (así salió
 * «EXPERIENCIA» en navy, 2026-09-24). `Columna.asegurar` lo re-aplica tras
 * cada cambio de página.
 */
const estiloVigente = new WeakMap();

function estilo(doc, fuente, tamano, color) {
  estiloVigente.set(doc, [fuente, tamano, color]);
  doc.font(fuente).fontSize(tamano).fillColor(color);
}

/**
 * EL DOMINIO, MUY RESALTADO (2026-09-24, pedido del dueño: «mi dominio de
 * encabezado grande y resaltado»). Un bloque navy con el dominio en blanco, a
 * la altura del nombre y a la derecha, que se puede pulsar y lleva al sitio en
 * el idioma del PDF; debajo, en gris, qué va a encontrar ahí. El nombre y el
 * eyebrow se estrechan para no tocarlo. Es texto sobre un rectángulo, no una
 * imagen: el ATS lo lee. Sin dominio, la cabecera es la de siempre.
 */
const DOMINIO = { tamano: 14, padX: 12, padY: 8, radio: 4, separacion: 16 };

/**
 * Dónde empieza una línea CENTRADA bajo el bloque del dominio (2026-09-26,
 * pedido del dueño: el rótulo, centrado respecto al recuadro azul). Si la
 * línea es más ancha que el bloque, se centra igual y se corre a la izquierda
 * lo justo para no pasar el margen derecho.
 */
export function inicioCentrado(xBloque, anchoBloque, anchoLinea, bordeDerecho) {
  const centrado = xBloque + (anchoBloque - anchoLinea) / 2;
  return Math.min(centrado, bordeDerecho - anchoLinea);
}

const RENGLON_ROTULO = 9.5;

function bloqueDelDominio(doc, dominio, url, rotulo) {
  estilo(doc, "Helvetica-Bold", DOMINIO.tamano, "#FFFFFF");
  const ancho = doc.widthOfString(dominio) + 2 * DOMINIO.padX;
  const alto = DOMINIO.tamano + 2 * DOMINIO.padY;
  const x = MARGEN.lado + ANCHO_UTIL - ancho;
  const y = MARGEN.arriba;
  doc.roundedRect(x, y, ancho, alto, DOMINIO.radio).fill(NAVY);
  estilo(doc, "Helvetica-Bold", DOMINIO.tamano, "#FFFFFF");
  doc.text(dominio, x + DOMINIO.padX, y + DOMINIO.padY + 1, {
    lineBreak: false,
  });
  doc.link(x, y, ancho, alto, url);
  // Debajo, en gris y centrado respecto al bloque: qué va a encontrar ahí.
  estilo(doc, "Helvetica", 7.5, GRIS);
  const bordeDerecho = MARGEN.lado + ANCHO_UTIL;
  rotulo.forEach((linea, i) => {
    const anchoLinea = doc.widthOfString(linea);
    doc.text(
      linea,
      inicioCentrado(x, ancho, anchoLinea, bordeDerecho),
      y + alto + 4 + i * RENGLON_ROTULO,
      { lineBreak: false },
    );
  });
  return { ancho, fondo: y + alto + 4 + rotulo.length * RENGLON_ROTULO };
}

function cabecera(doc, cv, sitio, labels) {
  const { identidad } = cv;
  const { destacado, origen, resto } = lineaDeContacto(identidad, sitio);
  // El bloque se mide primero: de su ancho depende cuánto espacio le queda al
  // nombre. Se DIBUJA después del nombre y el eyebrow, para que el orden de
  // lectura del ATS siga siendo nombre → cargo → dominio → contacto.
  let anchoBloque = 0;
  if (destacado) {
    estilo(doc, "Helvetica-Bold", DOMINIO.tamano, "#FFFFFF");
    anchoBloque =
      doc.widthOfString(ansi(destacado)) +
      2 * DOMINIO.padX +
      DOMINIO.separacion;
  }
  const anchoIzq = ANCHO_UTIL - anchoBloque;

  let y = MARGEN.arriba;
  estilo(doc, "Helvetica-Bold", 20, TINTA);
  doc.text(ansi(identidad.nombreCompleto ?? identidad.nombre), MARGEN.lado, y, {
    width: anchoIzq,
    characterSpacing: 0.3,
  });
  y = doc.y + 2;
  estilo(doc, "Helvetica-Bold", 11, NAVY);
  doc.text(ansi(identidad.eyebrow), MARGEN.lado, y, { width: anchoIzq });
  y = doc.y + 6;

  if (destacado) {
    const bloque = bloqueDelDominio(
      doc,
      ansi(destacado),
      `${origen}${labels.ruta}`,
      labels.rotuloSitio.map(ansi),
    );
    y = Math.max(y, bloque.fondo + 4);
  }

  const separador = "   ·   ";
  estilo(doc, "Helvetica", 8.5, GRIS);
  doc.text(ansi(resto.join(separador)), MARGEN.lado, y, { width: ANCHO_UTIL });
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

/**
 * El pie de cada página: el dominio (enlazado) y el número de página, chicos y
 * centrados, bajo el margen donde terminan las columnas. Refuerza sin
 * competir: 7,5 pt, sin filete. Solo cuando hay dominio.
 */
function pie(doc, destacado, url) {
  const { start, count } = doc.bufferedPageRange();
  for (let i = start; i < start + count; i++) {
    doc.switchToPage(i);
    // pdfkit abre una página nueva si se escribe bajo el margen inferior.
    const margen = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    const numero = `   ·   ${i - start + 1} / ${count}`;
    estilo(doc, "Helvetica-Bold", 7.5, NAVY);
    const anchoDominio = doc.widthOfString(destacado);
    estilo(doc, "Helvetica", 7.5, GRIS);
    const anchoNumero = doc.widthOfString(numero);
    const x = MARGEN.lado + (ANCHO_UTIL - anchoDominio - anchoNumero) / 2;
    const y = PAGINA.alto - 26;
    estilo(doc, "Helvetica-Bold", 7.5, NAVY);
    doc.text(destacado, x, y, { lineBreak: false, link: url });
    estilo(doc, "Helvetica", 7.5, GRIS);
    doc.text(numero, x + anchoDominio, y, { lineBreak: false, link: null });
    doc.page.margins.bottom = margen;
  }
}

function columnaDerecha(doc, cv, labels, yInicial, sitio) {
  const col = new Columna(doc, COL_DER.x, COL_DER.ancho, yInicial);

  col.seccion(labels.perfil);
  estilo(doc, "Helvetica", 8.8, TINTA);
  const { destacado, origen } = lineaDeContacto(cv.identidad, sitio);
  const perfil = ansi(
    perfilParaPdf(
      cv.identidad.perfil || cv.identidad.resumen,
      labels,
      destacado,
    ),
  );
  if (destacado) {
    // «Más en mi sitio: dominio.» — el dominio, en navy y enlazado.
    const dominio = ansi(destacado);
    const i = perfil.lastIndexOf(dominio);
    col.parrafoConEnlace(
      perfil.slice(0, i),
      dominio,
      perfil.slice(i + dominio.length),
      `${origen}${labels.ruta}`,
      { fuente: "Helvetica", tamano: 8.8, color: TINTA },
      { lineGap: 1.6 },
    );
  } else {
    col.parrafo(perfil, { lineGap: 1.6 });
  }

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

  // Cada grupo viaja con sus ítems, y el título de la sección con el primer
  // grupo: «SKILLS» o «IA & ML» solos al pie de la página 1 (así estaban).
  const itemsDe = (grupo) => ansi(grupo.items.join("  ·  "));
  const altoItems = (grupo) => {
    estilo(doc, "Helvetica", 8.8, TINTA);
    return col.alto(itemsDe(grupo), { lineGap: 1.6 });
  };
  const altoTitulo = (grupo) => {
    estilo(doc, "Helvetica-Bold", 9, NAVY);
    return col.alto(ansi(grupo.grupo));
  };
  if (cv.skills.length > 0)
    col.seccion(labels.skills, {
      juntoCon: altoTitulo(cv.skills[0]) + altoItems(cv.skills[0]),
    });
  for (const grupo of cv.skills) {
    const alto = altoItems(grupo);
    estilo(doc, "Helvetica-Bold", 9, NAVY);
    col.parrafo(ansi(grupo.grupo), { juntoCon: alto });
    estilo(doc, "Helvetica", 8.8, TINTA);
    col.parrafo(itemsDe(grupo), { lineGap: 1.6 });
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

  // Cada experiencia se cuenta UNA vez (2026-09-24, criterio del dueño: «que
  // no repita, y que no deje por fuera ninguna de mis experiencias y logros»).
  // Un proyecto que es el caso de estudio de un hito es la misma historia que
  // ese hito, y sus cifras ya están arriba, en los logros de la experiencia
  // (lo exige `tests/unit/casos-de-estudio.test.ts`). Listarlo otra vez aquí
  // repetía la historia: con los ocho, una tercera página entera; con solo el
  // destacado, Vesting dos veces. «Proyectos» queda para lo que NO es ya una
  // experiencia —hoy nada, así que la sección no se pinta—.
  const conHito = new Set(cv.trayectoria.map((h) => h.proyecto));
  const propios = cv.proyectos.filter((p) => !conHito.has(p.slug));
  if (propios.length > 0) col.seccion(labels.proyectos);
  for (const proyecto of propios) {
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

  const yColumnas = cabecera(doc, cv, sitio, labels);
  // Orden ATS por página: cabecera, luego perfil/formación/certificaciones/
  // skills (derecha), luego experiencia/proyectos (izquierda), y el pie.
  columnaDerecha(doc, cv, labels, yColumnas, sitio);
  columnaIzquierda(doc, cv, labels, yColumnas);
  const { destacado, origen } = lineaDeContacto(cv.identidad, sitio);
  if (destacado) pie(doc, ansi(destacado), `${origen}${labels.ruta}`);

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
