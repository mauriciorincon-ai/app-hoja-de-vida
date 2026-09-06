import { z } from "zod";

/**
 * CONTRATO «FICHA TÉCNICA» v1.1.0 (ADR-016) — la capa infografía de la vitrina.
 *
 * v1.1.0 (2026-09-06, orden del usuario): el **proceso BPMN es OPCIONAL**. No
 * toda pieza tiene un proceso de uso (una línea de investigación, un tablero);
 * si viene, sigue siendo BPMN válido y trae su procedencia; si no viene, la
 * ficha omite «Cómo funciona» y renumera. Compatible hacia atrás: toda ficha
 * v1.0.0 válida lo sigue siendo.
 *
 * Dos formas, un solo renderizador:
 *
 *  - **`fichaTecnicaSchema`** — la ficha COMPLETA y autónoma. Es lo que produce
 *    otra casa (el harness de investigaciones, un agente, un tablero) y CV Viva
 *    solo consume. Se publica también como JSON Schema en
 *    `docs/contrato-ficha-tecnica/ficha-tecnica.schema.json` (generado de aquí:
 *    una sola fuente de verdad, ver `tests/unit/ficha-tecnica-contrato.test.ts`).
 *
 *  - **`complementoSchema`** — lo que a un `brochure-export.json` v1.0.0 le
 *    FALTA para armar la ficha técnica: titular, cifras destacadas, límites,
 *    «nunca» y el proceso. Hoy lo declara CV Viva (`data/fichas/<slug>.yaml`,
 *    `procedencia: cv-viva`); el día que la app lo mande en su export, el
 *    complemento se retira y la procedencia pasa a ser suya.
 *
 * Reglas que el esquema hace cumplir (no la buena voluntad):
 *  - toda cifra lleva su `fuente` — la misma regla madre del brochure;
 *  - entre 3 y 5 cifras destacadas: con 14 números no hay infografía, hay tabla;
 *  - el proceso, si viene, es BPMN válido: un inicio, al menos un fin, todo paso
 *    alcanzable y con salida, y toda decisión con al menos dos caminos — y
 *    trae su procedencia (un proceso sin dueño es una cifra sin fuente).
 */

const slug = z
  .string()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9-]+$/, "must be a kebab-case slug");

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD");

export const fuentesCifra = [
  "medido",
  "calculada",
  "declarado",
  "estimacion",
] as const;
export const frentes = [
  "apps",
  "agentes",
  "investigaciones",
  "tableros",
] as const;
export const estadosPieza = ["inicial", "sellado"] as const;
export const procedencias = ["app", "cv-viva"] as const;

/* ── El proceso (BPMN-lite) ──────────────────────────────────────────────── */

const tiposPaso = ["inicio", "tarea", "decision", "fin"] as const;

export const procesoSchema = z
  .object({
    titulo: z.string().min(3).max(80),
    carriles: z
      .array(z.object({ id: slug, nombre: z.string().min(1).max(40) }).strict())
      .min(1)
      .max(5),
    pasos: z
      .array(
        z
          .object({
            id: slug,
            tipo: z.enum(tiposPaso),
            carril: slug,
            // Una tarea es UNA acción: si no cabe en 60 caracteres son dos.
            texto: z.string().max(60),
          })
          .strict(),
      )
      .min(3)
      .max(24),
    flujos: z
      .array(
        z
          .object({
            de: slug,
            a: slug,
            etiqueta: z.string().min(1).max(24).optional(),
          })
          .strict(),
      )
      .min(2),
    anotaciones: z
      .array(
        z.object({ paso: slug, texto: z.string().min(1).max(140) }).strict(),
      )
      .max(6)
      .default([]),
  })
  .strict()
  .superRefine((p, ctx) => {
    const carriles = new Set(p.carriles.map((c) => c.id));
    const ids = new Set<string>();
    p.pasos.forEach((paso, i) => {
      if (ids.has(paso.id))
        ctx.addIssue({
          code: "custom",
          path: ["pasos", i, "id"],
          message: `paso repetido: «${paso.id}»`,
        });
      ids.add(paso.id);
      if (!carriles.has(paso.carril))
        ctx.addIssue({
          code: "custom",
          path: ["pasos", i, "carril"],
          message: `carril inexistente: «${paso.carril}»`,
        });
      if (paso.tipo === "tarea" && paso.texto.trim().length < 3)
        ctx.addIssue({
          code: "custom",
          path: ["pasos", i, "texto"],
          message: "una tarea necesita texto",
        });
    });
    const inicios = p.pasos.filter((x) => x.tipo === "inicio").length;
    const fines = p.pasos.filter((x) => x.tipo === "fin").length;
    if (inicios !== 1)
      ctx.addIssue({
        code: "custom",
        path: ["pasos"],
        message: `el proceso necesita exactamente un inicio (tiene ${inicios})`,
      });
    if (fines < 1)
      ctx.addIssue({
        code: "custom",
        path: ["pasos"],
        message: "el proceso necesita al menos un fin",
      });

    const entra = new Map<string, number>();
    const sale = new Map<string, number>();
    p.flujos.forEach((f, i) => {
      for (const [k, extremo] of [
        ["de", f.de],
        ["a", f.a],
      ] as const) {
        if (!ids.has(extremo))
          ctx.addIssue({
            code: "custom",
            path: ["flujos", i, k],
            message: `paso inexistente: «${extremo}»`,
          });
      }
      sale.set(f.de, (sale.get(f.de) ?? 0) + 1);
      entra.set(f.a, (entra.get(f.a) ?? 0) + 1);
    });
    p.pasos.forEach((paso, i) => {
      if (paso.tipo !== "inicio" && !(entra.get(paso.id) ?? 0))
        ctx.addIssue({
          code: "custom",
          path: ["pasos", i],
          message: `«${paso.id}» no es alcanzable: ningún flujo llega a él`,
        });
      if (paso.tipo !== "fin" && !(sale.get(paso.id) ?? 0))
        ctx.addIssue({
          code: "custom",
          path: ["pasos", i],
          message: `«${paso.id}» no tiene salida: el proceso se queda ahí`,
        });
      if (paso.tipo === "decision" && (sale.get(paso.id) ?? 0) < 2)
        ctx.addIssue({
          code: "custom",
          path: ["pasos", i],
          message: `la decisión «${paso.id}» necesita al menos dos caminos`,
        });
    });
    p.anotaciones.forEach((a, i) => {
      if (!ids.has(a.paso))
        ctx.addIssue({
          code: "custom",
          path: ["anotaciones", i, "paso"],
          message: `paso inexistente: «${a.paso}»`,
        });
    });
  });

/* ── Piezas comunes ──────────────────────────────────────────────────────── */

const cifra = z
  .object({
    clave: z.string().min(1).max(60),
    valor: z.number(),
    unidad: z.string().max(40).optional(),
    etiqueta: z.string().min(1).max(60),
    fuente: z.enum(fuentesCifra),
    detalle: z.string().min(1).max(400),
  })
  .strict();

const texto = (max: number) => z.string().min(1).max(max);

/* ── El complemento (apps con brochure-export) ───────────────────────────── */

/**
 * El proceso y su procedencia van JUNTOS o no van: un proceso sin dueño es una
 * cifra sin fuente, y una procedencia sin proceso es ruido que confunde.
 */
function procesoConProcedencia(campo: string) {
  return (
    v: { proceso?: unknown; [k: string]: unknown },
    ctx: z.RefinementCtx,
  ) => {
    const tieneProceso = v.proceso !== undefined;
    const tieneProcedencia = v[campo] !== undefined;
    if (tieneProceso && !tieneProcedencia)
      ctx.addIssue({
        code: "custom",
        path: [campo],
        message: `el proceso necesita su «${campo}» (app | cv-viva)`,
      });
    if (!tieneProceso && tieneProcedencia)
      ctx.addIssue({
        code: "custom",
        path: [campo],
        message: `«${campo}» sin proceso: sobra`,
      });
  };
}

export const complementoSchema = z
  .object({
    schema_version: z.string().regex(/^1\.\d+\.\d+$/),
    app: slug,
    declarado_en: fecha,
    // El titular de valor: QUÉ NO HACE NADIE MÁS, en una frase.
    titular: texto(240),
    // Claves de `metricas` del export. Se validan contra el export al armar.
    cifras_destacadas: z.array(z.string().min(1)).min(3).max(5),
    limites: z.array(texto(160)).min(2).max(4),
    nunca: z.array(texto(160)).min(2).max(5),
    // Opcionales desde v1.1.0, siempre juntos (ver `procesoConProcedencia`).
    proceso: procesoSchema.optional(),
    procedencia: z.enum(procedencias).optional(),
  })
  .strict()
  .superRefine(procesoConProcedencia("procedencia"));

export type Complemento = z.infer<typeof complementoSchema>;

/* ── La ficha técnica completa (el contrato para otras casas) ────────────── */

export const fichaTecnicaSchema = z
  .object({
    schema_version: z.string().regex(/^1\.\d+\.\d+$/),
    actualizado: fecha,
    pieza: z
      .object({
        slug,
        nombre: texto(60),
        frente: z.enum(frentes),
        estado: z.enum(estadosPieza),
        ciclo: texto(16),
        version: texto(20),
        sellado_en: fecha.nullable(),
        sprints_cerrados: z.number().int().nonnegative(),
      })
      .strict(),
    promesa: z
      .object({
        tagline: texto(80),
        intro: texto(400),
        para_quien: texto(400),
      })
      .strict(),
    titular: texto(240),
    stack: z
      .array(z.object({ nombre: texto(40), papel: texto(160) }).strict())
      .min(1)
      .max(8),
    cifras: z.array(cifra).min(3).max(5),
    bloques: z
      .array(
        z
          .object({
            orden: z.number().int().positive(),
            nombre: texto(40),
            linea: texto(120),
            cuenta: z.number().int().nonnegative(),
          })
          .strict(),
      )
      .min(2)
      .max(10),
    // Opcionales desde v1.1.0, siempre juntos (ver `procesoConProcedencia`).
    proceso: procesoSchema.optional(),
    procedencia_proceso: z.enum(procedencias).optional(),
    limites: z.array(texto(160)).min(2).max(4),
    nunca: z.array(texto(160)).min(2).max(5),
    hitos: z
      .array(z.object({ valor: texto(24), etiqueta: texto(40) }).strict())
      .min(3)
      .max(5),
  })
  .strict()
  .superRefine(procesoConProcedencia("procedencia_proceso"));

export type FichaTecnica = z.infer<typeof fichaTecnicaSchema>;
export type Proceso = z.infer<typeof procesoSchema>;
