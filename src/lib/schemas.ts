import { z } from "zod";

/**
 * Contratos del contenido versionado (data/*.yaml). El build FALLA si el
 * contenido no cumple estos schemas (fail-safe del patrón "contenido = datos
 * versionados"). Las claves están en español porque son la interfaz de
 * edición del dueño del contenido (ver docs/MANUAL-DE-USO.md).
 */

export const cvSchema = z.object({
  identidad: z.object({
    nombre: z.string().min(1),
    // Nombre legal para footer/JSON-LD (Person.name); `nombre` es la marca pública
    nombreCompleto: z.string().min(1).optional(),
    eyebrow: z.string().min(1),
    titular: z.string().min(1),
    resumen: z.string().min(1),
    // Perfil largo (content pack §3) — aún sin sección propia en la HOME;
    // entra con la iteración de contenido del S2 (detalle/chat)
    perfil: z.string().default(""),
    ubicacion: z.string().min(1),
    email: z.string().email(),
    enlaces: z
      .array(
        z.object({
          etiqueta: z.string().min(1),
          url: z.string().url(),
        }),
      )
      .default([]),
  }),
  trayectoria: z
    .array(
      z.object({
        periodo: z.string().min(1),
        rol: z.string().min(1),
        organizacion: z.string().min(1),
        descripcion: z.string().min(1),
        actual: z.boolean().default(false),
      }),
    )
    .min(1),
  logros: z
    .array(
      z.object({
        valor: z.number(),
        prefijo: z.string().default(""),
        sufijo: z.string().default(""),
        decimales: z.number().int().min(0).max(2).default(0),
        etiqueta: z.string().min(1),
        descripcion: z.string().min(1),
      }),
    )
    .min(1),
  proyectos: z
    .array(
      z.object({
        nombre: z.string().min(1),
        resumen: z.string().min(1),
        stack: z.array(z.string().min(1)).default([]),
        destacado: z.boolean().default(false),
      }),
    )
    .min(1),
  // Contenido versionado sin sección propia todavía (content pack §6–§7):
  // se valida desde ya para que el S2 solo tenga que renderizarlo.
  certificaciones: z
    .array(
      z.object({
        nombre: z.string().min(1),
        fecha: z.string().min(1),
        nota: z.string().default(""),
        // Link Credly/Microsoft Learn — [AJUSTAR-LUEGO] del pack: vacío hasta
        // que el dueño entregue los links de verificación
        verificacion: z.string().default(""),
      }),
    )
    .default([]),
  skills: z
    .array(
      z.object({
        grupo: z.string().min(1),
        items: z.array(z.string().min(1)).min(1),
      }),
    )
    .default([]),
});

export type Cv = z.infer<typeof cvSchema>;

// Estados honestos del showcase (content pack §9): en producción = URL viva +
// repo público · en construcción = repo con commits reales · en exploración =
// objetivo declarado sin fechas prometidas.
export const appEstados = [
  "en-produccion",
  "en-construccion",
  "en-exploracion",
] as const;

const localizedText = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

export const appsSchema = z.object({
  apps: z
    .array(
      z.object({
        id: z
          .string()
          .min(1)
          .regex(/^[a-z0-9-]+$/, "id must be a kebab-case slug"),
        estado: z.enum(appEstados),
        nombre: localizedText,
        descripcion: localizedText,
        // Evidencia pública de la card (repo, demo): etiqueta universal (p. ej. "GitHub")
        enlaces: z
          .array(
            z.object({
              etiqueta: z.string().min(1),
              url: z.string().url(),
            }),
          )
          .default([]),
        solicitable: z.boolean().default(true),
      }),
    )
    .min(1),
});

export type Apps = z.infer<typeof appsSchema>;
export type AppCard = Apps["apps"][number];

/** Solicitud de acceso (formulario + endpoint). `website` es el honeypot. */
export const solicitudSchema = z.object({
  nombre: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  app: z.string().trim().min(1).max(60),
  mensaje: z.string().trim().max(1000).default(""),
  website: z.literal("").default(""),
});

export type Solicitud = z.infer<typeof solicitudSchema>;

/** Parse con error legible — pensado para romper el build con diagnóstico claro. */
function parseOrThrow<T>(
  schema: z.ZodType<T>,
  data: unknown,
  source: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Contenido inválido en ${source}:\n${issues}`);
  }
  return result.data;
}

export function parseCv(data: unknown, source: string): Cv {
  return parseOrThrow(cvSchema, data, source);
}

export function parseApps(data: unknown, source: string): Apps {
  return parseOrThrow(appsSchema, data, source);
}
