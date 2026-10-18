/**
 * «MI MÉTODO» AL ÍNDICE DEL CHAT (S10, F3).
 *
 * Cada infografía de `data/metodo/` entra al índice como UN CHUNK POR BLOQUE
 * (a veces dos o tres ventanas, si el bloque pasa del tope), con la misma forma
 * que el resto —`{id, codigo, titulo, texto, ancla, peso}`— y su ancla estable:
 * `/metodo/<slug>#bloque-n`. Es el molde de `fichas-al-indice.mjs`; lo único
 * propio es que la pieza trae TRES VOCES, y el chat no puede mezclarlas:
 *
 *   · «Lo que hice» — solo del corpus del sitio;
 *   · «Lo que el campo hace» — con la fuente que la respalda (editor y fecha);
 *   · «Mi posición» — mi criterio, no un hecho.
 *
 * Por eso cada afirmación con voz lleva su rótulo DENTRO del texto del chunk:
 * el modelo que responde sobre «lo que el campo hace» no puede atribuírmelo, y
 * el que cita una posición no la presenta como un hecho. Los rótulos y los
 * nombres de los bloques salen de `messages/<locale>.json` (`metodo.*`), el
 * mismo que pinta la página: lo que el chat dice es lo que la página dice.
 *
 * Motor puro: recibe las piezas ya leídas. La validación fuerte de la pieza
 * (los diez bloques, las fuentes con fecha, las tres voces) vive en el esquema
 * Zod de `src/lib/metodo/schema.ts` y rompe el build de Next; aquí solo se
 * exige lo que el índice necesita para citar —los diez bloques, en orden—, y
 * se rompe nombrando archivo y bloque. Sin la pieza, no hay cita.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";
import { mundoDelCorpus } from "../src/lib/metodo/corpus.ts";
import { parsePieza } from "../src/lib/metodo/schema.ts";
import { TOPE_PALABRAS_CHUNK, ventanasPorParrafo } from "./a-fondo.mjs";

const ROOT = process.cwd();

/**
 * Peso de un bloque de la infografía en el ranking del chat. Como las fichas
 * (ADR-023): es evidencia ordenada de UN tema, no la voz del dueño en sus
 * documentos a fondo, y a peso 1 le quitaría contexto a esos documentos. Se
 * mide, no se supone: el banco de preguntas lo vigila en los dos idiomas.
 */
export const PESO_METODO = 0.5;

/** Los diez bloques fijos (especificación § 3). */
export const N_BLOQUES = 10;

/**
 * Las anclas que una cita puede traer hacia una pieza: `/metodo/<slug>#bloque-n`
 * para los diez bloques. El catálogo de destinos las lista; la pieza siempre
 * trae los diez (el esquema lo garantiza), así que un `#bloque-11` es un error.
 */
export function anclasDeBloques(slug) {
  return Array.from({ length: N_BLOQUES }, (_, i) => `/metodo/${slug}#bloque-${i + 1}`);
}

/**
 * Lee lo que hay en disco y lo VALIDA con el mismo esquema Zod que la página
 * (`parsePieza`), antes de armar ningún fragmento. El índice del chat corre
 * ANTES de `next build` (`package.json › build`), así que sin esto un `tipo`,
 * una `voz` o un `nivel` mal escritos llegaban al chunker como un TypeError
 * opaco —o, peor, escribían «undefined» en un fragmento—. Ahora el build para
 * aquí, nombrando archivo y campo, con el mensaje de siempre del esquema. Los
 * documentos del corpus que la pieza cita deben estar aprobados (`corpus.ts`).
 *
 * `raiz` permite ejercer los rojos contra carpetas de prueba; los mensajes
 * (`messages/<locale>.json`) salen siempre del repo. Tolera que la sección no
 * exista todavía (un repo sin piezas).
 */
export function leerMetodo(raiz = ROOT) {
  const dir = path.join(raiz, "data", "metodo");
  const mundo = mundoDelCorpus(raiz);
  const piezas = (existsSync(dir) ? readdirSync(dir) : [])
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => {
      const archivo = `data/metodo/${f}`;
      return {
        archivo,
        pieza: parsePieza(parse(readFileSync(path.join(dir, f), "utf8")), archivo, mundo),
      };
    })
    .sort((a, b) => String(a.pieza?.id).localeCompare(String(b.pieza?.id)));
  const mensajes = (locale) =>
    JSON.parse(readFileSync(path.join(ROOT, "messages", `${locale}.json`), "utf8")).metodo;
  return { piezas, etiquetas: { es: mensajes("es"), en: mensajes("en") } };
}

/**
 * ¿Cada enlace de la evidencia (bloque 8) lleva a un destino que existe?
 * `existe` es `destinoExiste` con el catálogo de `scripts/destinos.mjs`; se
 * recibe por parámetro porque `destinos.mjs` ya importa este módulo (un ciclo
 * de más no). El esquema solo valida la FORMA de la ruta: un `/proyectos/vestin`
 * pasaba y publicaba un enlace roto en la evidencia del dueño.
 */
export function problemasDeEvidencia(piezas, existe) {
  const problemas = [];
  for (const { archivo, pieza } of piezas) {
    const i = (pieza.bloques ?? []).findIndex((b) => b.n === 8);
    if (i < 0) continue;
    (pieza.bloques[i].evidencia ?? []).forEach((e, j) => {
      if (e.href && !existe(e.href)) {
        problemas.push(
          `${archivo}: bloques.${i}.evidencia.${j}.href = «${e.href}» no es un destino del sitio ` +
            `(catálogo de scripts/destinos.mjs); un enlace roto en la evidencia rompe la promesa de la pieza.`,
        );
      }
    });
  }
  return problemas;
}

const limpio = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

/** Empuja un bloque como uno o varios chunks con la misma ancla. */
function empujar(chunks, { id, titulo, parrafos, ancla, tope, codigo, peso }) {
  const texto = parrafos.map(limpio).filter(Boolean).join("\n\n");
  if (!texto) return;
  const ventanas = ventanasPorParrafo(texto, tope);
  const partido = ventanas.length > 1;
  ventanas.forEach((v, i) => {
    chunks.push({
      id: partido ? `${id}~${i + 1}` : id,
      codigo,
      titulo: partido ? `${titulo} (${i + 1}/${ventanas.length})` : titulo,
      texto: v,
      ancla,
      peso,
    });
  });
}

/**
 * Una pieza → sus chunks, de a uno por bloque (con ventanas si hace falta).
 * `locale` elige el idioma del texto; `etiquetas` es `messages/<locale>.json › metodo`.
 */
export function chunksDePieza({ archivo = "data/metodo/?.yaml", pieza }, locale, etiquetas, { tope = TOPE_PALABRAS_CHUNK, peso = PESO_METODO } = {}) {
  if (!pieza?.slug || !pieza?.id || !pieza?.nombre?.[locale]) {
    throw new Error(`${archivo}: una pieza sin «id», «slug» o «nombre.${locale}» no puede citarse.`);
  }
  const bloques = new Map((pieza.bloques ?? []).map((b) => [b.n, b]));
  const faltan = Array.from({ length: N_BLOQUES }, (_, i) => i + 1).filter((n) => !bloques.has(n));
  if (faltan.length > 0) {
    throw new Error(`${archivo}: faltan los bloques ${faltan.join(", ")}; la infografía lleva los diez y cada uno se cita con su ancla #bloque-n.`);
  }

  const t = (x) => limpio(x?.[locale]);
  const fuentes = new Map((bloques.get(10).fuentes ?? []).map((f) => [f.id, f]));
  const rotulo = (voz) => etiquetas.voces[voz].nombre;
  const refFuentes = (ns) =>
    (ns ?? [])
      .map((n) => {
        const f = fuentes.get(n);
        return f ? `${f.editor}, ${f.fecha}` : `${etiquetas.fuentes.cita.replace("{n}", String(n))}`;
      })
      .join("; ");
  /** Una afirmación con su voz: el rótulo va DENTRO del texto, para que viaje con él. */
  const conVoz = (a) => {
    const marca =
      a.voz === "campo"
        ? `[${rotulo("campo")} — ${refFuentes(a.fuentes)}]`
        : `[${rotulo(a.voz)}]`;
    return `${marca} ${t(a.texto)}`;
  };
  // Las entradas, actividades y artefactos de una fase ya traen su punto final:
  // se quita para unirlas con «;» y el párrafo cierra con un solo punto.
  const unidos = (xs) => (xs ?? []).map((x) => t(x).replace(/[.\s]+$/, "")).join("; ");
  const etiqueta = (nombre, valor) => `${nombre}: ${valor}`;

  const ancla = (n) => `/metodo/${pieza.slug}#bloque-${n}`;
  const nombrePieza = t(pieza.nombre);
  const chunks = [];
  const tituloDeBloque = (n) => `${etiquetas.eyebrow} — ${nombrePieza} · ${etiquetas.bloques[String(n)]}`;
  /** Un bloque de prosa corrida: ventanas de hasta `tope` palabras, todas con la ancla del bloque. */
  const bloque = (n, parrafos) =>
    empujar(chunks, {
      id: `metodo-${pieza.slug}-bloque-${n}`,
      titulo: tituloDeBloque(n),
      parrafos,
      ancla: ancla(n),
      tope,
      codigo: pieza.id,
      peso,
    });
  /**
   * Un bloque de LISTA (fases, decisiones, elementos de frontera, fallas,
   * evidencia): un chunk por elemento, con SU nombre en el título. Son
   * entidades que se preguntan una a una —«¿qué es FORJA?», «¿cuándo un agente
   * y cuándo varios?»—, y juntarlas en una ventana diluye a cada una. El título
   * pesa el doble en el ranking (retrieval.ts), igual que el de una subsección
   * a fondo, así que el nombre del elemento es la palabra que lo encuentra.
   */
  const lista = (n, elementos) =>
    elementos.forEach((e, i) =>
      chunks.push({
        id: elementos.length > 1 ? `metodo-${pieza.slug}-bloque-${n}~${i + 1}` : `metodo-${pieza.slug}-bloque-${n}`,
        codigo: pieza.id,
        titulo: `${tituloDeBloque(n)} — ${limpio(e.nombre)}`,
        texto: limpio(e.texto),
        ancla: ancla(n),
        peso,
      }),
    );

  // 1 · La pregunta
  const b1 = bloques.get(1);
  bloque(1, [
    `${nombrePieza}.`,
    t(b1.pregunta),
    `${etiquetas.respuestaEnTres}:`,
    ...(b1.respuesta ?? []).map((r, i) => `${i + 1}. ${t(r)}`),
  ]);

  // 2 · El mapa: el resumen, cada nodo con su detalle y las conexiones
  const b2 = bloques.get(2);
  const nodos = new Map((b2.nodos ?? []).map((n) => [n.n, n]));
  bloque(2, [
    `${t(b2.titulo)}.`,
    t(b2.resumen),
    ...(b2.nodos ?? []).map(
      (n) => `${etiquetas.mapa.nodo.replace("{n}", String(n.n))} — ${t(n.etiqueta)} (${etiquetas.tipos[n.tipo].nombre}): ${t(n.detalle)}`,
    ),
    ...(b2.aristas ?? []).map((a) => {
      const flecha = etiquetas.mapa.flecha
        .replace("{de}", t(nodos.get(a.de)?.etiqueta) || String(a.de))
        .replace("{a}", t(nodos.get(a.a)?.etiqueta) || String(a.a));
      return `${flecha}${a.etiqueta ? ` (${t(a.etiqueta)})` : ""}.`;
    }),
  ]);

  // 3 · Las fases
  lista(
    3,
    (bloques.get(3).fases ?? []).map((f, i) => ({
      nombre: `${etiquetas.fases.fase.replace("{n}", String(i + 1))} — ${t(f.nombre)}`,
      texto: [
        `${etiquetas.fases.fase.replace("{n}", String(i + 1))} — ${t(f.nombre)}.`,
        etiqueta(etiquetas.fases.entradas, unidos(f.entradas)) + ".",
        etiqueta(etiquetas.fases.actividades, unidos(f.actividades)) + ".",
        etiqueta(etiquetas.fases.artefactos, unidos(f.artefactos)) + ".",
        etiqueta(etiquetas.fases.decide, t(f.decide)),
        etiqueta(etiquetas.fases.control, t(f.control)),
        f.nota ? conVoz(f.nota) : "",
      ]
        .filter(Boolean)
        .join(" "),
    })),
  );

  // 4 · Las decisiones de diseño
  lista(
    4,
    (bloques.get(4).decisiones ?? []).map((d) => ({
      nombre: t(d.titulo),
      texto: [
        `${t(d.titulo)}.`,
        etiqueta(etiquetas.decisiones.cuandoSi, t(d.cuandoSi)),
        etiqueta(etiquetas.decisiones.cuandoNo, t(d.cuandoNo)),
        `${etiquetas.decisiones.porQue}: ${conVoz(d.porQue)}`,
        d.nota ? conVoz(d.nota) : "",
      ]
        .filter(Boolean)
        .join(" "),
    })),
  );

  // 5 · Lo innovador en 2026: cada elemento con la fuente que lo respalda
  lista(
    5,
    (bloques.get(5).elementos ?? []).map((e) => ({
      nombre: t(e.titulo),
      texto: [
        `${t(e.titulo)}.`,
        `[${rotulo("campo")} — ${refFuentes(e.fuentes)}] ${etiqueta(etiquetas.innovador.queCambia, t(e.queCambia))}`,
        e.nota ? conVoz(e.nota) : "",
      ]
        .filter(Boolean)
        .join(" "),
    })),
  );

  // 6 · Modos de falla
  lista(
    6,
    (bloques.get(6).fallas ?? []).map((f) => ({
      nombre: t(f.falla),
      texto: [
        etiqueta(etiquetas.fallas.falla, t(f.falla)) + ".",
        etiqueta(etiquetas.fallas.senal, t(f.senal)),
        etiqueta(etiquetas.fallas.control, t(f.control)),
      ].join(" "),
    })),
  );

  // 7 · Métricas y controles — con la nota que dice que los umbrales son del método
  bloque(7, [
    ...(bloques.get(7).metricas ?? []).map((m) =>
      [
        etiqueta(etiquetas.metricas.metrica, t(m.metrica)) + ".",
        etiqueta(etiquetas.metricas.umbral, t(m.umbral)),
        etiqueta(etiquetas.metricas.aprueba, t(m.aprueba)),
      ].join(" "),
    ),
    etiquetas.metricas.nota,
  ]);

  // 8 · Mi evidencia: «lo que hice», con el nivel que le da el corpus
  lista(
    8,
    (bloques.get(8).evidencia ?? []).map((e) => ({
      nombre: t(e.nombre),
      texto: `[${rotulo("hice")}] ${t(e.nombre)} (${etiquetas.evidencia.nivel}: ${etiquetas.niveles[e.nivel]}). ${t(e.texto)}`,
    })),
  );

  // 9 · Lo que haría distinto y lo que no he hecho
  bloque(9, (bloques.get(9).limites ?? []).map(conVoz));

  // 10 · Fuentes y fecha de revisión (título, editor y fecha; el enlace vive en la página)
  const b10 = bloques.get(10);
  bloque(10, [
    etiquetas.revisado.replace("{fecha}", String(b10.revisado)) + ".",
    ...(b10.fuentes ?? []).map(
      (f) => `${etiquetas.fuentes.cita.replace("{n}", String(f.id))}: ${limpio(f.titulo)} — ${limpio(f.editor)}, ${f.fecha}.`,
    ),
  ]);

  return chunks;
}

/** Todas las piezas de «Mi método», para un locale. */
export function chunksDeMetodo({ piezas, etiquetas }, locale, opciones = {}) {
  return piezas.flatMap((p) => chunksDePieza(p, locale, etiquetas[locale], opciones));
}
