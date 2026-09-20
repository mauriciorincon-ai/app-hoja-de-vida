/**
 * LAS FICHAS DE LA VITRINA, AL ÍNDICE DEL CHAT (a fondo v2, D3).
 *
 * La vitrina publica 32 piezas —6 apps, 13 agentes, 7 investigaciones, 6
 * tableros— y cada una trae, en su ficha, lo que un visitante pregunta: qué
 * promete, sus cifras con procedencia, sus límites y lo que nunca hace. Hasta
 * hoy el chat no las veía: bebía de `cv.*.yaml`, `apps.yaml` y el corpus a
 * fondo. Es la recomendación de mayor rendimiento de la auditoría: ~160 cifras
 * al alcance del chat sin escribir una palabra nueva.
 *
 * Motor puro: recibe las fichas ya leídas, devuelve chunks con la misma forma
 * que el resto del índice —`{id, titulo, texto, ancla}`— y con la misma
 * ventana de `TOPE_PALABRAS_CHUNK`. La cita navega a la página de la pieza en
 * la vitrina, que existe en el catálogo de destinos (S7). El texto de las
 * fichas es el que sus casas mandaron, en español: el índice en inglés lo
 * incluye igual, porque un fragmento en español que contesta vale más que un
 * «no sé de eso», y el modelo responde en el idioma del visitante.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";
import { TOPE_PALABRAS_CHUNK, ventanasPorParrafo } from "./a-fondo.mjs";

const ROOT = process.cwd();

export const ETIQUETAS = {
  es: { apps: "Apps", agentes: "Agentes", investigaciones: "Investigaciones", tableros: "Tableros", cifras: "cifras", limites: "límites", nunca: "nunca", funcionalidades: "funcionalidades", bloques: "bloques" },
  en: { apps: "Apps", agentes: "Agents", investigaciones: "Research", tableros: "Dashboards", cifras: "figures", limites: "limits", nunca: "never", funcionalidades: "features", bloques: "sections" },
};

const FRENTES_DE_FICHA = ["agentes", "investigaciones", "tableros"];

/** Lee lo que hay en disco. Tolera que un frente no exista todavía. */
export function leerFichas() {
  const leerJson = (ruta) => JSON.parse(readFileSync(ruta, "utf8"));
  const dirApps = path.join(ROOT, "content", "vitrina");
  const apps = (existsSync(dirApps) ? readdirSync(dirApps) : [])
    .filter((f) => f.endsWith(".brochure-export.json"))
    .map((f) => {
      const brochure = leerJson(path.join(dirApps, f));
      const complementoRuta = path.join(ROOT, "data", "fichas", `${brochure.app.slug}.yaml`);
      const complemento = existsSync(complementoRuta)
        ? parse(readFileSync(complementoRuta, "utf8"))
        : null;
      return { brochure, complemento };
    });
  const piezas = [];
  for (const frente of FRENTES_DE_FICHA) {
    const dir = path.join(ROOT, "content", frente);
    for (const f of existsSync(dir) ? readdirSync(dir) : []) {
      if (!f.endsWith(".ficha-tecnica.json")) continue;
      piezas.push({ frente, ficha: leerJson(path.join(dir, f)) });
    }
  }
  return { apps, piezas };
}

const limpio = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const cifra = (c) =>
  `${limpio(c.etiqueta ?? c.clave)}: ${c.valor}${c.unidad ? ` ${c.unidad}` : ""} (${c.fuente ?? "sin fuente"})${c.detalle ? `. ${limpio(c.detalle)}` : ""}`;

/** Empuja un bloque de texto como uno o varios chunks con la misma ancla. */
function empujar(chunks, { id, titulo, parrafos, ancla, tope }) {
  const texto = parrafos.map(limpio).filter(Boolean).join("\n\n");
  if (!texto) return;
  const ventanas = ventanasPorParrafo(texto, tope);
  const partido = ventanas.length > 1;
  ventanas.forEach((v, i) => {
    chunks.push({
      id: partido ? `${id}~${i + 1}` : id,
      titulo: partido ? `${titulo} (${i + 1}/${ventanas.length})` : titulo,
      texto: v,
      ancla,
    });
  });
}

/**
 * Una pieza de agentes · investigaciones · tableros → hasta cuatro chunks:
 * la promesa, las cifras con procedencia y el stack, los límites y los «nunca»,
 * y los bloques. Cada uno cita a la página de la pieza.
 */
export function chunksDePieza({ frente, ficha }, locale = "es", tope = TOPE_PALABRAS_CHUNK) {
  const L = ETIQUETAS[locale];
  const p = ficha.pieza;
  if (!p?.slug || !p?.nombre) {
    throw new Error(`content/${frente}: una ficha sin «pieza.slug» o «pieza.nombre» no puede citarse.`);
  }
  const ancla = `/vitrina/${frente}/${p.slug}`;
  const base = `${frente}-${p.slug}`;
  const nombre = `${L[frente]} — ${p.nombre}`;
  const chunks = [];
  empujar(chunks, {
    id: base,
    titulo: nombre,
    parrafos: [
      `${p.nombre}${p.estado ? ` (${p.estado}${p.version ? ` v${p.version}` : ""}${p.sellado_en ? `, sellado ${p.sellado_en}` : ""})` : ""}.`,
      ficha.promesa?.tagline,
      ficha.promesa?.intro,
      ficha.promesa?.para_quien,
      ficha.titular,
    ],
    ancla,
    tope,
  });
  empujar(chunks, {
    id: `${base}-cifras`,
    titulo: `${nombre} · ${L.cifras}`,
    parrafos: [
      ...(ficha.cifras ?? []).map(cifra),
      (ficha.stack ?? []).length ? `Stack: ${ficha.stack.map((s) => `${s.nombre}${s.papel ? ` (${limpio(s.papel)})` : ""}`).join("; ")}.` : "",
    ],
    ancla,
    tope,
  });
  empujar(chunks, {
    id: `${base}-limites`,
    titulo: `${nombre} · ${L.limites} · ${L.nunca}`,
    parrafos: [
      ...(ficha.limites ?? []).map((l) => `Límite: ${limpio(l)}`),
      ...(ficha.nunca ?? []).map((n) => `Nunca: ${limpio(n)}`),
    ],
    ancla,
    tope,
  });
  empujar(chunks, {
    id: `${base}-bloques`,
    titulo: `${nombre} · ${L.bloques}`,
    parrafos: (ficha.bloques ?? []).map((b) => `${limpio(b.nombre)}: ${limpio(b.linea)}`),
    ancla,
    tope,
  });
  return chunks;
}

/**
 * Una app hermana → su brochure más el complemento curado de CV Viva: promesa
 * y titular, funcionalidades por grupo, métricas con procedencia y stack,
 * límites, «nunca» y privacidad. Cita a la ficha de la app en la vitrina.
 */
export function chunksDeApp({ brochure, complemento }, locale = "es", tope = TOPE_PALABRAS_CHUNK) {
  const L = ETIQUETAS[locale];
  const a = brochure.app;
  if (!a?.slug || !a?.nombre) {
    throw new Error("content/vitrina: un brochure sin «app.slug» o «app.nombre» no puede citarse.");
  }
  const ancla = `/vitrina/apps/${a.slug}`;
  const base = `pieza-apps-${a.slug}`;
  const nombre = `${L.apps} — ${a.nombre}`;
  const chunks = [];
  empujar(chunks, {
    id: base,
    titulo: nombre,
    parrafos: [
      `${a.nombre}${a.estado ? ` (${a.estado}${a.sellado_en ? `, sellado ${a.sellado_en}` : ""})` : ""}.`,
      brochure.promesa?.tagline,
      brochure.promesa?.intro,
      brochure.promesa?.para_quien,
      complemento?.titular,
    ],
    ancla,
    tope,
  });
  const grupos = brochure.funcionalidades?.grupos ?? [];
  empujar(chunks, {
    id: `${base}-funcionalidades`,
    titulo: `${nombre} · ${L.funcionalidades}`,
    parrafos: grupos.map(
      (g) =>
        `${limpio(g.nombre)}: ${limpio(g.linea)} ${(g.features ?? []).map((f) => `${limpio(f.nombre)}: ${limpio(f.que_hace)}`).join(" ")}`,
    ),
    ancla,
    tope,
  });
  empujar(chunks, {
    id: `${base}-cifras`,
    titulo: `${nombre} · ${L.cifras}`,
    parrafos: [
      ...(brochure.metricas ?? []).map(cifra),
      (brochure.stack ?? []).length ? `Stack: ${brochure.stack.map((s) => `${s.nombre}${s.papel ? ` (${limpio(s.papel)})` : ""}`).join("; ")}.` : "",
    ],
    ancla,
    tope,
  });
  empujar(chunks, {
    id: `${base}-limites`,
    titulo: `${nombre} · ${L.limites} · ${L.nunca}`,
    parrafos: [
      ...(complemento?.limites ?? []).map((l) => `Límite: ${limpio(l)}`),
      ...(complemento?.nunca ?? []).map((n) => `Nunca: ${limpio(n)}`),
      brochure.privacidad?.detalle ? `Privacidad: ${limpio(brochure.privacidad.detalle)}` : "",
    ],
    ancla,
    tope,
  });
  return chunks;
}

/** Todas las piezas de la vitrina, para un locale. */
/**
 * Peso de una ficha en el ranking del chat (ADR-021). Las fichas son evidencia
 * de una pieza concreta; la voz del dueño son los documentos a fondo. A peso 1
 * las fichas le quitaban el contexto a esos documentos en 8 de 131 preguntas
 * del banco; a 0,5 el banco recupera el número que tenía sin fichas.
 */
export const PESO_FICHA = 0.5;

export function chunksDeFichas({ apps, piezas }, locale = "es", tope = TOPE_PALABRAS_CHUNK) {
  return [
    ...apps.flatMap((app) => chunksDeApp(app, locale, tope)),
    ...piezas.flatMap((pieza) => chunksDePieza(pieza, locale, tope)),
  ].map((c) => ({ ...c, peso: PESO_FICHA }));
}
