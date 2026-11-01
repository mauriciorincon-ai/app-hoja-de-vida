import { z } from "zod";
import type { BrochureExport } from "@/lib/vitrina/schemas";

/**
 * EL CONTENIDO v2 DEL BROCHURE (contrato en BORRADOR, S28).
 *
 * El export v1 (`<slug>.brochure-export.json`) es estricto y trae solo lo que la
 * app sabe de sí misma. El brochure necesita más: un acento, las pantallas de la
 * portada, el antes y el después, el mapa en capas, y por grupo qué resuelve, el
 * flujo y las fichas. Eso lo escribe la planeadora y llega en un archivo APARTE
 * y OPCIONAL, `content/vitrina/<slug>.contenido.json`: el export no cambia, y una
 * app sin contenido v2 se ve igual el primer día, con lo que el v1 alcanza a
 * decir (un bloque sin datos no se pinta; ver `modelo.ts`).
 *
 * Es un BORRADOR: la decisión de fijarlo queda para el checkpoint del hito. Por
 * eso vive en su propio archivo y no toca `schemas.ts`. Todo texto es `{ es, en }`
 * (regla 20) y el inglés de los textos del export, que el v1 trae solo en español,
 * va en el bloque `en`.
 *
 * Dos capas, como el resto del contenido: esta es la FORMA (zod, estricta); la
 * COHERENCIA contra la entrega de la app (¿existe esa funcionalidad?, ¿tiene
 * captura?, ¿el mapa cubre todos los grupos?) es `problemasDeContenido`, pura y
 * sin I/O, que el loader convierte en un fallo de build con archivo y campo.
 */

export const ACENTOS = [
  "sage",
  "sky",
  "lilac",
  "peach",
  "rose",
  "citron",
] as const;
export type Acento = (typeof ACENTOS)[number];

/** Los íconos que sabe dibujar la hoja; `pantalla` es el de respaldo. */
export const ICONOS = [
  "megafono",
  "lista",
  "foto",
  "escudo",
  "lupa",
  "sello",
  "calendario",
  "calculadora",
  "edificio",
  "idiomas",
  "pantalla",
  // S30, lo que pidió la tanda 1 (CV Viva y su chat): la conversación y la llave.
  "conversacion",
  "llave",
] as const;

/**
 * Quién hace cada paso de un flujo. Los cuatro de la maqueta, más los dos que pidió la tanda 1 (S30):
 * quien visita (el actor principal de CV Viva, que «comprador» y «equipo» desmentirían) y el proveedor.
 */
export const ACTORES = [
  "dueno",
  "comprador",
  "equipo",
  "app",
  "visita",
  "proveedor",
] as const;

/** Qué puede citar una afirmación además de una funcionalidad. */
export const FUENTES_CLAVE = [
  "promesa",
  "privacidad",
  "limites",
  "nunca",
  "proceso",
  "stack",
  "metricas",
] as const;

/** La procedencia de una cifra (mismo vocabulario que las métricas del export). */
const PROCEDENCIAS = [
  "medido",
  "calculada",
  "declarado",
  "estimacion",
] as const;

const MAX = 1200;
const t = z.string().trim().min(1).max(MAX);
const bi = z.object({ es: t, en: t }).strict();
const slug = z
  .string()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9-]+$/, "debe ser un slug kebab-case");
const id = z.string().min(1).max(40);

const insigniaSchema = z
  .object({
    simbolo: z.string().min(1).max(4),
    texto: bi,
    funcionalidad: id.optional(),
    fuente: id.optional(),
  })
  .strict()
  .superRefine((i, ctx) => {
    if ((i.funcionalidad === undefined) === (i.fuente === undefined))
      ctx.addIssue({
        code: "custom",
        message:
          "la insignia lleva exactamente una: «funcionalidad» o «fuente»",
      });
  });

const portadaSchema = z
  .object({
    resalta: bi,
    pantallas: z.array(id).min(1).max(8),
    lugar: bi,
    categoria: bi,
    insignias: z.array(insigniaSchema).max(4).default([]),
  })
  .strict();

const pruebaSchema = z
  .object({
    antes: bi,
    despues: bi,
    texto: bi,
    fuente: z.enum(PROCEDENCIAS),
    detalle: bi,
    cita: id,
  })
  .strict();

const parSchema = z
  .object({ antes: bi, despues: bi, funcionalidad: id, fuente: id })
  .strict();

const antesDespuesSchema = z
  .object({
    titulo: bi,
    antes_rotulo: bi,
    despues_rotulo: bi,
    corto: bi,
    para_quien_titulo: bi,
    prueba: pruebaSchema.optional(),
    pares: z.array(parSchema).max(8).default([]),
  })
  .strict();

const rasgoSchema = z
  .object({ titulo: bi, texto: bi, fuente: id, metrica: id.optional() })
  .strict();

const mapaSchema = z
  .object({
    intro: bi,
    capas: z
      .array(
        z
          .object({
            nombre: bi,
            sub: bi,
            grupos: z.array(z.number().int().positive()).min(1),
          })
          .strict(),
      )
      .min(1)
      .max(5),
    transversal: z
      .object({
        nombre: bi,
        sub: bi,
        grupos: z.array(z.number().int().positive()).default([]),
        rasgos: z.array(rasgoSchema).max(6).default([]),
      })
      .strict()
      .optional(),
  })
  .strict();

const serviciosSchema = z
  .object({
    titulo: bi,
    texto: bi,
    fuente: z.enum(PROCEDENCIAS),
    nota: bi,
    items: z
      .array(z.object({ funcionalidad: id, titulo: bi, texto: bi }).strict())
      .min(1)
      .max(8),
  })
  .strict();

const lado = z.object({ titulo: bi, texto: bi }).strict();

const fichaSchema = z
  .object({
    tipo: z.enum(["concepto", "diferencia", "decision"]),
    pregunta: bi,
    respuesta: bi,
    lados: z.array(lado).length(2).optional(),
    fuente: id,
  })
  .strict();

const afirmacion = z.object({ texto: bi, fuente: id }).strict();

const nodoSchema = z
  .object({
    id: slug,
    tipo: z.enum(["inicio", "tarea", "decision", "paralelo", "fin"]),
    actor: z.enum(ACTORES),
    texto: bi,
    funcionalidad: id.optional(),
  })
  .strict();

const aristaSchema = z
  .object({
    de: slug,
    a: slug,
    etiqueta: bi.optional(),
    vuelta: z.boolean().optional(),
  })
  .strict();

const flujoSchema = z
  .object({
    titulo: bi,
    nodos: z.array(nodoSchema).min(2).max(16),
    aristas: z.array(aristaSchema).min(1).max(30),
  })
  .strict();

const grupoSchema = z
  .object({
    orden: z.number().int().positive(),
    que_resuelve: bi,
    te_sirve: z.array(afirmacion).max(5).default([]),
    no_es: z.array(afirmacion).max(4).default([]),
    flujo: flujoSchema.optional(),
    fichas: z.array(fichaSchema).max(8).default([]),
  })
  .strict();

/** El inglés de los textos del export y del complemento (que el v1 trae solo en español). */
const enSchema = z
  .object({
    promesa: z
      .object({ tagline: t, intro: t, para_quien: t, diferencial: t })
      .strict(),
    grupos: z.record(z.string(), z.object({ nombre: t, linea: t }).strict()),
    features: z.record(
      z.string(),
      z.object({ nombre: t, que_hace: t }).strict(),
    ),
    metricas: z.record(
      z.string(),
      z
        .object({ etiqueta: t, unidad: z.string().max(60), detalle: t })
        .strict(),
    ),
    stack: z.array(z.object({ nombre: t, papel: t }).strict()),
    privacidad: t,
    enlaces_razon: t,
    complemento: z
      .object({
        titular: t,
        limites: z.array(t),
        nunca: z.array(t),
        proceso: z
          .object({
            titulo: t,
            carriles: z.record(z.string(), t),
            // Un paso final puede ir sin rótulo (`texto: ""` en el complemento): su inglés también.
            pasos: z.record(z.string(), z.string().max(MAX)),
            etiquetas: z.record(z.string(), t).default({}),
            anotaciones: z.record(z.string(), t).default({}),
          })
          .strict()
          .optional(),
      })
      .strict(),
  })
  .strict();

export const contenidoSchema = z
  .object({
    schema_version: z
      .string()
      .regex(/^2\.\d+\.\d+(-borrador)?$/, "debe ser 2.x.y[-borrador]"),
    app: slug,
    acento: z.enum(ACENTOS),
    // La razón de «Úsala» (S30): la del export dice «esta ficha», y con el brochure como entrada quedó
    // vieja. Manda sobre la del export y sobre la de `en`.
    enlaces_razon: bi.optional(),
    portada: portadaSchema.optional(),
    antes_despues: antesDespuesSchema.optional(),
    mapa: mapaSchema.optional(),
    iconos: z.record(z.string().regex(/^\d+$/), z.enum(ICONOS)).default({}),
    proceso_pantallas: z.record(z.string(), id).default({}),
    servicios: serviciosSchema.optional(),
    metricas_texto: z.record(z.string(), bi).default({}),
    metodo: z
      .object({ ocultar: z.array(id).default([]) })
      .strict()
      .optional(),
    grupos: z.array(grupoSchema).default([]),
    en: enSchema.optional(),
  })
  .strict();

export type Contenido = z.infer<typeof contenidoSchema>;
export type GrupoContenido = z.infer<typeof grupoSchema>;
export type FlujoContenido = z.infer<typeof flujoSchema>;

/** Lo mínimo de la entrega de una app que la coherencia necesita (tipos estructurales: no se importa el loader). */
export type EntregaDeApp = {
  export: Pick<
    BrochureExport,
    "app" | "funcionalidades" | "metricas" | "stack" | "promesa"
  >;
  capturas: { capturas: { funcionalidad: string }[] };
  complemento: {
    limites: string[];
    nunca: string[];
    proceso?: {
      carriles: { id: string }[];
      pasos: { id: string }[];
      flujos: { de: string; a: string; etiqueta?: string }[];
      anotaciones?: { paso: string }[];
    };
  };
};

const FORMA = (e: z.core.$ZodIssue) =>
  `${e.path.join(".") || "(raíz)"}: ${e.message}`;

/** Valida la FORMA. Devuelve el contenido o la lista de problemas con su campo. */
export function leerContenido(
  crudo: unknown,
): { ok: true; contenido: Contenido } | { ok: false; problemas: string[] } {
  const r = contenidoSchema.safeParse(crudo);
  return r.success
    ? { ok: true, contenido: r.data }
    : { ok: false, problemas: r.error.issues.map(FORMA) };
}

/**
 * La COHERENCIA del contenido contra la entrega de su app. Pura: devuelve la lista
 * de problemas (vacía = coherente), cada una con el campo que la causa.
 */
export function problemasDeContenido(c: Contenido, e: EntregaDeApp): string[] {
  const p: string[] = [];
  const ids = new Set(
    e.export.funcionalidades.grupos.flatMap((g) => g.features.map((f) => f.id)),
  );
  const ordenes = new Set(e.export.funcionalidades.grupos.map((g) => g.orden));
  const claves = new Set(e.export.metricas.map((m) => m.clave));
  const conCaptura = new Set(e.capturas.capturas.map((x) => x.funcionalidad));
  const claveFuente = new Set<string>(FUENTES_CLAVE);
  const pasos = new Set((e.complemento.proceso?.pasos ?? []).map((x) => x.id));

  const unicos = (lista: (string | number)[]) =>
    lista.filter((v, i) => lista.indexOf(v) !== i);

  if (c.app !== e.export.app.slug)
    p.push(`app: «${c.app}» no es la del export («${e.export.app.slug}»)`);

  const funcionalidad = (
    ruta: string,
    v: string | undefined,
    conPantalla = false,
  ) => {
    if (v === undefined) return;
    if (!ids.has(v)) p.push(`${ruta}: «${v}» no está en el export`);
    else if (conPantalla && !conCaptura.has(v))
      p.push(`${ruta}: «${v}» no tiene captura`);
  };
  const fuente = (ruta: string, v: string | undefined) => {
    if (v === undefined) return;
    if (!ids.has(v) && !claveFuente.has(v))
      p.push(
        `${ruta}: «${v}» no es una funcionalidad del export ni una de ${FUENTES_CLAVE.join(" · ")}`,
      );
  };
  const metrica = (ruta: string, v: string | undefined) => {
    if (v !== undefined && !claves.has(v))
      p.push(`${ruta}: «${v}» no es una métrica del export`);
  };

  // Portada
  c.portada?.pantallas.forEach((v, i) =>
    funcionalidad(`portada.pantallas[${i}]`, v, true),
  );
  c.portada?.insignias.forEach((x, i) => {
    funcionalidad(
      `portada.insignias[${i}].funcionalidad`,
      x.funcionalidad,
      true,
    );
    fuente(`portada.insignias[${i}].fuente`, x.fuente);
  });

  // Antes y después
  const ad = c.antes_despues;
  if (ad?.prueba) fuente("antes_despues.prueba.cita", ad.prueba.cita);
  ad?.pares.forEach((x, i) => {
    funcionalidad(
      `antes_despues.pares[${i}].funcionalidad`,
      x.funcionalidad,
      true,
    );
    fuente(`antes_despues.pares[${i}].fuente`, x.fuente);
  });
  c.servicios?.items.forEach((x, i) =>
    funcionalidad(`servicios.items[${i}].funcionalidad`, x.funcionalidad),
  );

  // Mapa: cada grupo del export aparece una sola vez (si no, desaparece de la página)
  if (c.mapa) {
    const enMapa = [
      ...c.mapa.capas.flatMap((x) => x.grupos),
      ...(c.mapa.transversal?.grupos ?? []),
    ];
    for (const o of enMapa)
      if (!ordenes.has(o)) p.push(`mapa: el grupo ${o} no está en el export`);
    for (const o of unicos(enMapa))
      p.push(`mapa: el grupo ${o} aparece más de una vez`);
    for (const o of ordenes)
      if (!enMapa.includes(o))
        p.push(`mapa: el grupo ${o} del export no está en ninguna capa`);
    c.mapa.transversal?.rasgos.forEach((x, i) => {
      fuente(`mapa.transversal.rasgos[${i}].fuente`, x.fuente);
      metrica(`mapa.transversal.rasgos[${i}].metrica`, x.metrica);
    });
  }

  // Íconos, pantallas del proceso y textos de métricas
  for (const k of Object.keys(c.iconos))
    if (!ordenes.has(Number(k)))
      p.push(`iconos.${k}: el grupo ${k} no está en el export`);
  for (const [k, v] of Object.entries(c.proceso_pantallas)) {
    if (!pasos.has(k))
      p.push(
        `proceso_pantallas.${k}: no es un paso del proceso del complemento`,
      );
    funcionalidad(`proceso_pantallas.${k}`, v, true);
  }
  for (const k of Object.keys(c.metricas_texto))
    metrica(`metricas_texto.${k}`, k);
  c.metodo?.ocultar.forEach((k, i) => metrica(`metodo.ocultar[${i}]`, k));

  // Grupos: orden único y válido, flujo con aristas que existen, fuentes citables
  for (const o of unicos(c.grupos.map((g) => g.orden)))
    p.push(`grupos: el orden ${o} se repite`);
  c.grupos.forEach((g, gi) => {
    const r = `grupos[${gi}]`;
    if (!ordenes.has(g.orden))
      p.push(`${r}.orden: ${g.orden} no es un grupo del export`);
    g.te_sirve.forEach((x, i) =>
      fuente(`${r}.te_sirve[${i}].fuente`, x.fuente),
    );
    g.no_es.forEach((x, i) => fuente(`${r}.no_es[${i}].fuente`, x.fuente));
    g.fichas.forEach((x, i) => fuente(`${r}.fichas[${i}].fuente`, x.fuente));
    if (g.flujo) {
      const nodos = new Set(g.flujo.nodos.map((n) => n.id));
      for (const d of unicos(g.flujo.nodos.map((n) => n.id)))
        p.push(`${r}.flujo.nodos: el id «${d}» se repite`);
      g.flujo.nodos.forEach((n, i) =>
        funcionalidad(
          `${r}.flujo.nodos[${i}].funcionalidad`,
          n.funcionalidad,
          true,
        ),
      );
      g.flujo.aristas.forEach((a, i) => {
        if (!nodos.has(a.de))
          p.push(`${r}.flujo.aristas[${i}].de: «${a.de}» no es un nodo`);
        if (!nodos.has(a.a))
          p.push(`${r}.flujo.aristas[${i}].a: «${a.a}» no es un nodo`);
      });
    }
  });

  if (c.en) p.push(...problemasDelIngles(c.en, e, ids, ordenes, claves));
  return p;
}

/** El inglés debe cubrir TODO lo que el export y el complemento dicen en español (paridad, regla 20). */
function problemasDelIngles(
  en: NonNullable<Contenido["en"]>,
  e: EntregaDeApp,
  ids: Set<string>,
  ordenes: Set<number>,
  claves: Set<string>,
): string[] {
  const p: string[] = [];
  const falta = (
    ruta: string,
    esperadas: Iterable<string>,
    tiene: string[],
  ) => {
    const t = new Set(tiene);
    const esp = new Set(esperadas);
    for (const k of esp) if (!t.has(k)) p.push(`en.${ruta}: falta «${k}»`);
    for (const k of t) if (!esp.has(k)) p.push(`en.${ruta}: sobra «${k}»`);
  };
  falta("grupos", [...ordenes].map(String), Object.keys(en.grupos));
  falta("features", ids, Object.keys(en.features));
  falta("metricas", claves, Object.keys(en.metricas));
  if (en.stack.length !== e.export.stack.length)
    p.push(
      `en.stack: ${en.stack.length} filas y el export tiene ${e.export.stack.length}`,
    );
  if (en.complemento.limites.length !== e.complemento.limites.length)
    p.push(
      `en.complemento.limites: ${en.complemento.limites.length} y el complemento tiene ${e.complemento.limites.length}`,
    );
  if (en.complemento.nunca.length !== e.complemento.nunca.length)
    p.push(
      `en.complemento.nunca: ${en.complemento.nunca.length} y el complemento tiene ${e.complemento.nunca.length}`,
    );
  const proceso = e.complemento.proceso;
  if (proceso && !en.complemento.proceso)
    p.push("en.complemento.proceso: falta (el complemento trae proceso)");
  if (!proceso && en.complemento.proceso)
    p.push("en.complemento.proceso: sobra (el complemento no trae proceso)");
  if (proceso && en.complemento.proceso) {
    const ep = en.complemento.proceso;
    falta(
      "complemento.proceso.carriles",
      proceso.carriles.map((c) => c.id),
      Object.keys(ep.carriles),
    );
    falta(
      "complemento.proceso.pasos",
      proceso.pasos.map((x) => x.id),
      Object.keys(ep.pasos),
    );
    falta(
      "complemento.proceso.etiquetas",
      proceso.flujos.filter((f) => f.etiqueta).map((f) => `${f.de}>${f.a}`),
      Object.keys(ep.etiquetas),
    );
    falta(
      "complemento.proceso.anotaciones",
      (proceso.anotaciones ?? []).map((a) => a.paso),
      Object.keys(ep.anotaciones),
    );
  }
  return p;
}
