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
        // El "grueso" del rol (capa 2): logros completos con métricas,
        // expandibles en el timeline y presentes en el PDF ATS
        bullets: z.array(z.string().min(1)).default([]),
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
        // Slug de URL del case study — idéntico en ES y EN para el hreflang
        slug: z
          .string()
          .min(1)
          .regex(/^[a-z0-9-]+$/, "slug must be a kebab-case slug"),
        nombre: z.string().min(1),
        resumen: z.string().min(1),
        stack: z.array(z.string().min(1)).default([]),
        destacado: z.boolean().default(false),
        // Narrativa del case study (ADR-009): con esto presente, el proyecto
        // gana página propia en /{locale}/proyectos/<slug> — cero código
        casestudy: z
          .object({
            contexto: z.string().min(1),
            reto: z.string().min(1),
            acciones: z.array(z.string().min(1)).min(1),
            impacto: z.array(z.string().min(1)).min(1),
          })
          .optional(),
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

// Slug kebab-case reutilizable (id de app y de feature del roadmap). El mismo
// alfabeto que valida la BD de votación (RPC emitir_voto) — coherencia borde↔BD.
const slug = z
  .string()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9-]+$/, "must be a kebab-case slug");

// Feature del roadmap votable (S4). El par (app.id, feature.id) es la clave del
// voto; por eso `id` es un slug estable — cambiarlo reinicia su conteo.
const roadmapFeature = z
  .object({
    id: slug,
    titulo: localizedText,
    descripcion: localizedText,
  })
  .strict();

// Brochure animada por app (S4, ADR-012). Solo apps con funcionalidad real
// ("solo lo real"): su presencia da de alta la página /[locale]/apps/<id>.
const brochureFeature = z
  .object({
    titulo: localizedText,
    descripcion: localizedText,
  })
  .strict();

const brochureMetrica = z
  .object({
    // Cifra real y verificable; el Counter la anima desde el HTML estático.
    valor: z.number(),
    sufijo: z.string().default(""),
    etiqueta: localizedText,
  })
  .strict();

const brochure = z
  .object({
    // Frase corta bajo el título (subtítulo del hero).
    tagline: localizedText,
    // Párrafo de apertura — candidato LCP: se pinta estático, sin motion JS.
    intro: localizedText,
    funcionalidades: z.array(brochureFeature).min(1),
    metricas: z.array(brochureMetrica).default([]),
    // Tecnologías (strings universales, no localizados) — como proyectos.stack.
    stack: z.array(z.string().min(1)).default([]),
  })
  .strict();

export const appsSchema = z
  .object({
    apps: z
      .array(
        z
          .object({
            id: slug,
            estado: z.enum(appEstados),
            nombre: localizedText,
            descripcion: localizedText,
            // Evidencia pública de la card (repo, demo): etiqueta universal (p. ej. "GitHub")
            enlaces: z
              .array(
                z
                  .object({
                    etiqueta: z.string().min(1),
                    url: z.string().url(),
                  })
                  .strict(),
              )
              .default([]),
            solicitable: z.boolean().default(true),
            // Roadmap votable de la app (S4). Vacío = la app no aparece en la
            // sección de votación. Editar aquí + push = roadmap actualizado.
            roadmap: z.array(roadmapFeature).default([]),
            // Brochure animada (S4). Presente = la app gana su página
            // /[locale]/apps/<id>. Solo apps con funcionalidad real.
            brochure: brochure.optional(),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export type Apps = z.infer<typeof appsSchema>;
export type AppCard = Apps["apps"][number];
export type RoadmapFeature = z.infer<typeof roadmapFeature>;
export type Brochure = z.infer<typeof brochure>;

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
