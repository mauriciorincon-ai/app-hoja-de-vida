import { z } from "zod";

/**
 * «MÉTODOS» — el esquema de una publicación (S10, 2026-10-17). Motor puro.
 *
 * Una publicación es un DATO con DIEZ bloques fijos y un solo renderizador: las
 * nueve piezas del método son archivos de `data/metodo/`, no páginas. Este
 * módulo valida ese archivo sin tocar el disco (quien llama le dice qué
 * documentos del corpus existen), así que cada rojo se prueba con un objeto.
 *
 * Lo que rompe el build, nombrando archivo y campo:
 *  · un bloque que falta o está fuera de orden (los diez, del 1 al 10);
 *  · una fuente sin fecha `YYYY-MM-DD`, sin editor o sin enlace, o con una
 *    fecha posterior a la revisión de la pieza;
 *  · una afirmación del campo sin fuente, o de «lo que hice» sin su slug del
 *    corpus: nada sube de nivel ni se inventa;
 *  · una posición disfrazada de hecho (con fuente o corpus: las tres voces no
 *    se mezclan);
 *  · una cita a una fuente que no existe, o una fuente que nadie cita;
 *  · un mapa con aristas a nodos inexistentes o dos nodos en la misma celda;
 *  · un `[CONFIRMAR]` dentro de la pieza (va en el cierre del sprint, nunca
 *    aquí: la pieza se publica).
 *
 * Todo texto nace `{ es, en }` redactado en los dos idiomas, y la forma del
 * esquema impone la paridad: no hay arreglo en español y otro en inglés que
 * puedan desalinearse.
 */

// ───────────────────────────────────────────────────────────────────────────
// Piezas pequeñas
// ───────────────────────────────────────────────────────────────────────────

/** Un `[CONFIRMAR]` es una pregunta para el dueño: vive en el cierre, no en lo publicado. */
const sinPendientes = (s: string) => !/\[CONFIRMAR/i.test(s);

const cadena = z
  .string()
  .trim()
  .min(1)
  .refine(
    sinPendientes,
    "un [CONFIRMAR] va en el cierre del sprint, nunca en la pieza",
  );

/**
 * Las cifras de un texto, sin su formato: `99,5 %` y `99.5%` son la misma (995),
 * `1.405` y `1,405` también. Solo cuenta lo que lleva dígitos; una cifra escrita
 * con letras («once») no se compara, porque el esquema no puede saber que
 * «eleven» es lo mismo sin un diccionario.
 */
export function cifrasDe(s: string): string[] {
  return (s.match(/\d+(?:[.,]\d+)*/g) ?? [])
    .map((n) => n.replace(/[.,]/g, ""))
    .sort();
}

/**
 * Un texto bilingüe: los dos idiomas redactados, ninguno vacío, y **las mismas
 * cifras en los dos** (las cifras gemelas, igual que en el corpus a fondo: una
 * traducción que cambia un número es otro hecho, no una traducción).
 */
const texto = z
  .object({ es: cadena, en: cadena })
  .strict()
  .superRefine((t, ctx) => {
    const es = cifrasDe(t.es);
    const en = cifrasDe(t.en);
    if (es.join(" ") !== en.join(" "))
      ctx.addIssue({
        code: "custom",
        message: `las cifras de ES y EN no coinciden (es: ${es.join(", ") || "ninguna"} · en: ${en.join(", ") || "ninguna"}): una traducción no cambia un número`,
      });
  });
export type Texto = z.infer<typeof texto>;

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug en minúsculas con guiones");

function esFechaReal(s: string): boolean {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
const fechaIso = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "la fecha va como YYYY-MM-DD")
  .refine(esFechaReal, "no es una fecha real");

/** Una ruta de ESTE sitio (nunca un enlace externo en un bloque de evidencia). */
const rutaInterna = z
  .string()
  .regex(
    /^\/[a-z0-9][a-z0-9\-/#]*$/,
    "una ruta interna del sitio, p. ej. /proyectos/vesting",
  );

const lista = <T extends z.ZodType>(item: T, min = 1, max = 12) =>
  z.array(item).min(min).max(max);

// ───────────────────────────────────────────────────────────────────────────
// Las tres voces
// ───────────────────────────────────────────────────────────────────────────

/** Quién habla: lo que el dueño hizo · lo que el campo hace · lo que el dueño opina. */
export const VOCES = ["hice", "campo", "posicion"] as const;
export type Voz = (typeof VOCES)[number];

/**
 * Una afirmación con su voz y SU evidencia — solo la suya:
 *  · `campo` ⇒ fuentes numeradas (sin fuente no entra);
 *  · `hice` ⇒ slugs del corpus del sitio (la experiencia sale de ahí);
 *  · `posicion` ⇒ ninguna de las dos: es criterio, rotulado como tal.
 */
const afirmacion = z
  .object({
    voz: z.enum(VOCES),
    texto,
    fuentes: z.array(z.number().int().positive()).default([]),
    corpus: z.array(slug).default([]),
  })
  .strict()
  .superRefine((a, ctx) => {
    const falla = (campo: string, message: string) =>
      ctx.addIssue({ code: "custom", path: [campo], message });
    if (a.voz === "campo") {
      if (a.fuentes.length === 0)
        falla(
          "fuentes",
          "lo que el campo hace lleva su fuente numerada: sin fuente no entra",
        );
      if (a.corpus.length > 0)
        falla(
          "corpus",
          "el corpus respalda lo que hice, no lo que hace el campo",
        );
    }
    if (a.voz === "hice") {
      if (a.corpus.length === 0)
        falla(
          "corpus",
          "lo que hice sale del corpus del sitio: nombra el slug del documento",
        );
      if (a.fuentes.length > 0)
        falla(
          "fuentes",
          "una fuente respalda lo que hace el campo, no lo que hice",
        );
    }
    if (a.voz === "posicion" && (a.fuentes.length > 0 || a.corpus.length > 0))
      falla(
        "voz",
        "una posición no se disfraza de hecho: sin fuente ni corpus (si la respalda un hecho, es otra afirmación)",
      );
  });
export type Afirmacion = z.infer<typeof afirmacion>;

// ───────────────────────────────────────────────────────────────────────────
// Los diez bloques (orden y nombre FIJOS: la estructura de la especificación § 3)
// ───────────────────────────────────────────────────────────────────────────

export const BLOQUES = [
  { n: 1, clave: "pregunta" },
  { n: 2, clave: "mapa" },
  { n: 3, clave: "fases" },
  { n: 4, clave: "decisiones" },
  { n: 5, clave: "innovador" },
  { n: 6, clave: "fallas" },
  { n: 7, clave: "metricas" },
  { n: 8, clave: "evidencia" },
  { n: 9, clave: "limites" },
  { n: 10, clave: "fuentes" },
] as const;

/** Qué tipo de cosa es un nodo del mapa: forma + palabra + color, nunca solo color. */
export const TIPOS_NODO = [
  "actor",
  "dato",
  "control",
  "humano",
  "externo",
] as const;
export type TipoNodo = (typeof TIPOS_NODO)[number];

/** El nivel que el corpus le da a una herramienta; nada sube de nivel en una pieza. */
export const NIVELES = [
  "uso-real",
  "prototipo",
  "en-estudio",
  "exploracion",
] as const;
export type Nivel = (typeof NIVELES)[number];

// Bloque 1, «El problema» (S14): `pregunta` guarda el PLANTEAMIENTO del problema en una
// línea y `respuesta` su síntesis en tres, en voz impersonal. Los nombres vienen del
// primer marco (una pregunta y su respuesta) y se conservan: renombrarlos toca medio
// centenar de puntos (tests, índice del chat, páginas) sin que el visitante lo vea.
const bloque1 = z
  .object({
    n: z.literal(1),
    pregunta: texto,
    respuesta: z
      .array(texto)
      .length(3, "la síntesis es de tres líneas, ni más ni menos"),
  })
  .strict();

const nodo = z
  .object({
    n: z.number().int().positive(),
    etiqueta: texto,
    tipo: z.enum(TIPOS_NODO),
    col: z.number().int().min(0).max(5),
    fila: z.number().int().min(0).max(3),
    detalle: texto,
  })
  .strict();

const arista = z
  .object({
    de: z.number().int().positive(),
    a: z.number().int().positive(),
    etiqueta: texto.optional(),
  })
  .strict();

const bloque2 = z
  .object({
    n: z.literal(2),
    titulo: texto,
    /** La alternativa textual COMPLETA del diagrama: lo que un lector de pantalla y la impresión leen. */
    resumen: texto,
    nodos: lista(nodo, 3, 14),
    aristas: lista(arista, 2, 24),
  })
  .strict();

const fase = z
  .object({
    nombre: texto,
    entradas: lista(texto, 1, 6),
    actividades: lista(texto, 1, 8),
    artefactos: lista(texto, 1, 6),
    decide: texto,
    control: texto,
    nota: afirmacion.optional(),
  })
  .strict();
const bloque3 = z
  .object({ n: z.literal(3), fases: lista(fase, 3, 8) })
  .strict();

const decision = z
  .object({
    titulo: texto,
    cuandoSi: texto,
    cuandoNo: texto,
    porQue: afirmacion,
    nota: afirmacion.optional(),
  })
  .strict();
const bloque4 = z
  .object({ n: z.literal(4), decisiones: lista(decision, 4, 7) })
  .strict();

const elementoInnovador = z
  .object({
    titulo: texto,
    queCambia: texto,
    /** Sin fuente no entra: cada elemento de frontera lleva al menos una, numerada. */
    fuentes: z
      .array(z.number().int().positive())
      .min(1, "un elemento de frontera sin fuente no entra"),
    nota: afirmacion.optional(),
  })
  .strict();
const bloque5 = z
  .object({ n: z.literal(5), elementos: lista(elementoInnovador, 3, 8) })
  .strict();

const falla = z.object({ falla: texto, senal: texto, control: texto }).strict();
const bloque6 = z
  .object({ n: z.literal(6), fallas: lista(falla, 3, 8) })
  .strict();

const metrica = z
  .object({ metrica: texto, umbral: texto, aprueba: texto })
  .strict();
const bloque7 = z
  .object({ n: z.literal(7), metricas: lista(metrica, 3, 8) })
  .strict();

const evidencia = z
  .object({
    nombre: texto,
    nivel: z.enum(NIVELES),
    texto,
    corpus: z
      .array(slug)
      .min(1, "la evidencia sale del corpus: nombra el slug del documento"),
    href: rutaInterna.optional(),
  })
  .strict();
const bloque8 = z
  .object({ n: z.literal(8), evidencia: lista(evidencia, 2, 10) })
  .strict();

const bloque9 = z
  .object({ n: z.literal(9), limites: lista(afirmacion, 2, 8) })
  .strict();

const fuente = z
  .object({
    id: z.number().int().positive(),
    titulo: cadena,
    editor: cadena,
    fecha: fechaIso,
    url: z
      .string()
      .regex(
        /^https:\/\/[^\s]+$/,
        "el enlace de la fuente va completo, con https://",
      ),
  })
  .strict();
const bloque10 = z
  .object({
    n: z.literal(10),
    /** La fecha de la última revisión de la pieza. */
    revisado: fechaIso,
    fuentes: lista(fuente, 1, 30),
  })
  .strict();

const bloque = z.discriminatedUnion("n", [
  bloque1,
  bloque2,
  bloque3,
  bloque4,
  bloque5,
  bloque6,
  bloque7,
  bloque8,
  bloque9,
  bloque10,
]);
export type Bloque = z.infer<typeof bloque>;
export type BloqueDe<N extends Bloque["n"]> = Extract<Bloque, { n: N }>;

// ───────────────────────────────────────────────────────────────────────────
// La pieza
// ───────────────────────────────────────────────────────────────────────────

/** Cada texto del dato que cita fuentes o corpus, con su ruta (para nombrar el campo que falla). */
type Cita = { ruta: (string | number)[]; fuentes: number[]; corpus: string[] };

function citasDe(bloques: Bloque[]): Cita[] {
  const citas: Cita[] = [];
  const de = (
    ruta: (string | number)[],
    a: { fuentes: number[]; corpus: string[] } | undefined,
  ) => {
    if (a) citas.push({ ruta, fuentes: a.fuentes, corpus: a.corpus });
  };
  bloques.forEach((b, i) => {
    const raiz = ["bloques", i];
    if (b.n === 3)
      b.fases.forEach((f, j) => de([...raiz, "fases", j, "nota"], f.nota));
    if (b.n === 4)
      b.decisiones.forEach((d, j) => {
        de([...raiz, "decisiones", j, "porQue"], d.porQue);
        de([...raiz, "decisiones", j, "nota"], d.nota);
      });
    if (b.n === 5)
      b.elementos.forEach((e, j) => {
        citas.push({
          ruta: [...raiz, "elementos", j, "fuentes"],
          fuentes: e.fuentes,
          corpus: [],
        });
        de([...raiz, "elementos", j, "nota"], e.nota);
      });
    if (b.n === 8)
      b.evidencia.forEach((e, j) =>
        citas.push({
          ruta: [...raiz, "evidencia", j, "corpus"],
          fuentes: [],
          corpus: e.corpus,
        }),
      );
    if (b.n === 9) b.limites.forEach((l, j) => de([...raiz, "limites", j], l));
  });
  return citas;
}

/** Cada texto bilingüe de la pieza, en el orden en que se lee, con su ruta. */
function textosEnOrden(
  valor: unknown,
  ruta: (string | number)[] = [],
  salida: { ruta: (string | number)[]; es: string; en: string }[] = [],
) {
  if (Array.isArray(valor)) {
    valor.forEach((v, i) => textosEnOrden(v, [...ruta, i], salida));
  } else if (valor && typeof valor === "object") {
    const o = valor as Record<string, unknown>;
    if (
      typeof o.es === "string" &&
      typeof o.en === "string" &&
      Object.keys(o).length === 2
    )
      salida.push({ ruta, es: o.es, en: o.en });
    else
      for (const [k, v] of Object.entries(o))
        textosEnOrden(v, [...ruta, k], salida);
  }
  return salida;
}

export const piezaSchema = z
  .object({
    /** T1…T9: los nueve temas de la especificación; el orden de la lista es el de su número. */
    id: z.string().regex(/^T[1-9]$/, "el id es T1…T9"),
    slug,
    nombre: texto,
    bloques: z.array(bloque),
  })
  .strict()
  .superRefine((p, ctx) => {
    const agregar = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });

    // — Los diez bloques, del 1 al 10, sin faltar ninguno ni cambiar el orden —
    const presentes = new Set(p.bloques.map((b) => b.n));
    const faltan = BLOQUES.filter((b) => !presentes.has(b.n)).map(
      (b) => `${b.n} (${b.clave})`,
    );
    if (faltan.length > 0)
      agregar(
        ["bloques"],
        `la publicación lleva los diez bloques fijos y faltan: ${faltan.join(", ")}`,
      );
    p.bloques.forEach((b, i) => {
      if (b.n !== i + 1 && presentes.size === p.bloques.length)
        agregar(
          ["bloques", i, "n"],
          `el bloque en la posición ${i + 1} debe ser el ${i + 1} (${BLOQUES[i]?.clave ?? "?"}), no el ${b.n}`,
        );
    });

    // — Foundry: la primera mención, con su nombre completo (regla 5 de la constitución) —
    // Se lee en orden de bloques; los títulos de las fuentes (bloque 10) no son
    // texto de la pieza —son los de la fuente— y quedan fuera.
    const FRASE_FOUNDRY = {
      es: "Microsoft Foundry (antes Azure AI Foundry)",
      en: "Microsoft Foundry (formerly Azure AI Foundry)",
    } as const;
    const textos = textosEnOrden({ nombre: p.nombre, bloques: p.bloques });
    for (const idioma of ["es", "en"] as const) {
      const primero = textos.find((x) => /Foundry/i.test(x[idioma]));
      if (!primero) continue;
      const j = primero[idioma].indexOf(FRASE_FOUNDRY[idioma]);
      if (j === -1 || /Foundry/i.test(primero[idioma].slice(0, j)))
        agregar(
          [...primero.ruta, idioma],
          `la primera mención de Foundry en la pieza lleva su nombre completo, «${FRASE_FOUNDRY[idioma]}»; después, «Microsoft Foundry»`,
        );
    }

    // — El mapa: nodos numerados 1…n, aristas a nodos que existen, una cosa por celda —
    const iMapa = p.bloques.findIndex((b) => b.n === 2);
    const mapa = p.bloques[iMapa];
    if (mapa?.n === 2) {
      const ids = new Set<number>();
      const celdas = new Map<string, number>();
      mapa.nodos.forEach((n, j) => {
        if (n.n !== j + 1)
          agregar(
            ["bloques", iMapa, "nodos", j, "n"],
            `los nodos se numeran 1…${mapa.nodos.length} en orden; este es el ${n.n} en la posición ${j + 1}`,
          );
        ids.add(n.n);
        const celda = `${n.col},${n.fila}`;
        const otro = celdas.get(celda);
        if (otro !== undefined)
          agregar(
            ["bloques", iMapa, "nodos", j],
            `el nodo ${n.n} cae en la misma celda (col ${n.col}, fila ${n.fila}) que el ${otro}`,
          );
        celdas.set(celda, n.n);
      });
      mapa.aristas.forEach((a, j) => {
        if (!ids.has(a.de))
          agregar(
            ["bloques", iMapa, "aristas", j, "de"],
            `la arista sale del nodo ${a.de}, que no existe`,
          );
        if (!ids.has(a.a))
          agregar(
            ["bloques", iMapa, "aristas", j, "a"],
            `la arista llega al nodo ${a.a}, que no existe`,
          );
        if (a.de === a.a)
          agregar(
            ["bloques", iMapa, "aristas", j],
            `la arista del nodo ${a.de} a sí mismo no dice nada`,
          );
      });
    }

    // — Las fuentes: ids 1…n, fechadas no después de la revisión, todas citadas, ninguna cita huérfana —
    const iFuentes = p.bloques.findIndex((b) => b.n === 10);
    const b10 = p.bloques[iFuentes];
    const idsFuente = new Set<number>();
    if (b10?.n === 10) {
      b10.fuentes.forEach((f, j) => {
        if (f.id !== j + 1)
          agregar(
            ["bloques", iFuentes, "fuentes", j, "id"],
            `las fuentes se numeran 1…${b10.fuentes.length} en orden; esta es la ${f.id} en la posición ${j + 1}`,
          );
        idsFuente.add(f.id);
        if (f.fecha > b10.revisado)
          agregar(
            ["bloques", iFuentes, "fuentes", j, "fecha"],
            `la fuente ${f.id} es de ${f.fecha}, posterior a la revisión de la pieza (${b10.revisado})`,
          );
      });
    }
    const citadas = new Set<number>();
    for (const c of citasDe(p.bloques)) {
      for (const f of c.fuentes) {
        citadas.add(f);
        if (!idsFuente.has(f))
          agregar(c.ruta, `cita la fuente ${f}, que no está en el bloque 10`);
      }
    }
    if (b10?.n === 10)
      b10.fuentes.forEach((f, j) => {
        if (!citadas.has(f.id))
          agregar(
            ["bloques", iFuentes, "fuentes", j],
            `la fuente ${f.id} («${f.titulo}») no la cita ningún bloque: una fuente sin uso es ruido`,
          );
      });
  });

export type PiezaMetodo = z.infer<typeof piezaSchema>;

/** Los slugs del corpus que una pieza nombra (para validarlos contra el disco). */
export function corpusNombrado(p: PiezaMetodo): string[] {
  const todos = citasDe(p.bloques).flatMap((c) => c.corpus);
  return [...new Set(todos)];
}

/** Lo que el mundo sabe y el esquema no: qué documentos del corpus existen. */
export type Mundo = {
  /** Los documentos del corpus que una pieza puede citar (aprobados en ES y EN). */
  corpus?: ReadonlySet<string>;
  /** De cada documento que existe pero no entra, por qué (para que el error lo diga). */
  motivos?: ReadonlyMap<string, string>;
};

function formato(source: string, lineas: string[]): Error {
  return new Error(`Contenido inválido en ${source}:\n${lineas.join("\n")}`);
}

/**
 * Valida el archivo de una publicación. Rompe nombrando archivo, campo y regla;
 * junta TODOS los problemas de una pasada (no se arregla de a uno por build).
 */
export function parsePieza(
  data: unknown,
  source: string,
  mundo: Mundo = {},
): PiezaMetodo {
  const r = piezaSchema.safeParse(data);
  if (!r.success)
    throw formato(
      source,
      r.error.issues.map(
        (i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`,
      ),
    );
  const pieza = r.data;
  if (mundo.corpus) {
    const desconocidos = corpusNombrado(pieza).filter(
      (s) => !mundo.corpus?.has(s),
    );
    if (desconocidos.length > 0)
      throw formato(
        source,
        desconocidos.map((s) => {
          const motivo = mundo.motivos?.get(s);
          return motivo
            ? `  - corpus: «${s}» existe en data/a-fondo/ pero no se puede citar: ${motivo} (lo que hice sale de un documento aprobado)`
            : `  - corpus: «${s}» no es un documento de data/a-fondo/ (la experiencia sale del corpus, no se inventa)`;
        }),
      );
  }
  return pieza;
}

/** El bloque N de una pieza (los diez existen: el esquema lo garantiza). */
export function bloqueDe<N extends Bloque["n"]>(
  p: PiezaMetodo,
  n: N,
): BloqueDe<N> {
  const b = p.bloques.find((x) => x.n === n);
  if (!b) throw new Error(`la pieza ${p.slug} no tiene el bloque ${n}`);
  return b as BloqueDe<N>;
}
