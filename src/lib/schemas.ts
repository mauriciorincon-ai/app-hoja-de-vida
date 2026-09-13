import { z } from "zod";

/**
 * Iconos monolínea (Lucide, trazo 1.5, sin color) que un estudio o una
 * certificación puede declarar en el YAML (revisión post-S8). Un nombre que no
 * esté aquí rompe el build: el icono es dato, no adivinanza por palabra clave.
 */
export const ICONOS_FORMACION = [
  "universidad",
  "idiomas",
  "curso",
  "insignia",
  "datos",
  "codigo",
] as const;
export type IconoFormacion = (typeof ICONOS_FORMACION)[number];
/** Nombre de archivo bajo `public/logos/`: sin rutas, sin mayúsculas, svg o png. */
export const ARCHIVO_LOGO = /^[a-z0-9-]+\.(svg|png)$/;
/** Altura por defecto y cotas (px) de un logo de institución en las tarjetas. */
export const LOGO_ALTO = 20;
export const LOGO_ALTO_MIN = 12;
export const LOGO_ALTO_MAX = 48;

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
        // El case study de ESTA experiencia, si lo tiene: el slug de un
        // proyecto con `casestudy`. Desde que la sección Proyectos dejó la
        // HOME (revisión post-S7), la puerta a cada case study es su hito.
        proyecto: z
          .string()
          .regex(/^[a-z0-9-]+$/, "proyecto must be a kebab-case slug")
          .optional(),
      }),
    )
    .min(1),
  // Estudios (revisión post-S7): sección propia. Antes vivían disfrazados de
  // hito «Formación» dentro de la trayectoria, y el PDF los separaba por el
  // texto del periodo — un dato que dependía de una palabra. Ahora son datos.
  estudios: z
    .array(
      z.object({
        titulo: z.string().min(1),
        institucion: z.string().min(1),
        // Vacío hasta que el dueño ponga los años: no se inventa una fecha.
        periodo: z.string().default(""),
        nota: z.string().default(""),
        // Revisión post-S8: icono monolínea de la institución, como dato.
        icono: z.enum(ICONOS_FORMACION).default("universidad"),
        // Logo de la institución en `public/logos/` (post-S8). Si está, va en
        // vez del icono; el test de contenido exige que el archivo exista.
        logo: z.string().regex(ARCHIVO_LOGO).optional(),
        // Altura del logo en px (post-S8, a pedido del dueño): un escudo cuadrado
        // pesa menos que un logotipo ancho a la misma altura, así que la altura
        // es dato. Acotada para que ningún logo sea cartel.
        logoAlto: z
          .number()
          .int()
          .min(LOGO_ALTO_MIN)
          .max(LOGO_ALTO_MAX)
          .default(LOGO_ALTO),
      }),
    )
    .default([]),
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
      z
        .object({
          nombre: z.string().min(1),
          // Revisión post-S8 (2026-09-12): el tercer estado de una credencial.
          // «en curso» se lista con chip y sin fecha; el gate de contenido
          // exige que cada mención de su código lleve «en curso» al lado.
          estado: z.enum(["obtenida", "en curso"]).default("obtenida"),
          fecha: z.string().default(""),
          nota: z.string().default(""),
          // Link Credly/Microsoft Learn — [AJUSTAR-LUEGO] del pack: vacío hasta
          // que el dueño entregue los links de verificación
          verificacion: z.string().default(""),
          icono: z.enum(ICONOS_FORMACION).default("insignia"),
          logo: z.string().regex(ARCHIVO_LOGO).optional(),
          logoAlto: z
            .number()
            .int()
            .min(LOGO_ALTO_MIN)
            .max(LOGO_ALTO_MAX)
            .default(LOGO_ALTO),
        })
        .refine((c) => c.estado === "en curso" || c.fecha.trim().length > 0, {
          message:
            "una certificación obtenida lleva fecha; solo «en curso» puede ir sin ella",
          path: ["fecha"],
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

// Los frentes de la vitrina (post-S5, ADR-015): apps · agentes · investigaciones
// · tableros. `id` es la ruta /vitrina/<id>. Un frente «abierta» necesita
// PIEZAS REALES que enseñar: marcarlo abierto sin ellas publicaría una página
// que promete y no cumple, así que el build FALLA.
//
// S7: esa regla deja de decir «solo apps» y pasa a MEDIRSE por frente contra
// `content/<frente>/`. Por eso no vive en el esquema —que valida FORMA, y la
// forma no sabe qué hay en disco— sino en `parseVitrina`, que recibe la lista
// de frentes con piezas. Un frente nuevo abre solo, el día que le llegue su
// primera ficha; y ninguno puede abrir a mano.
export const categoriaEstados = ["abierta", "en-preparacion"] as const;

const categoriaVitrina = z
  .object({
    id: slug,
    estado: z.enum(categoriaEstados),
    nombre: localizedText,
    // Lo que se lee en su caja del portal: una frase.
    intro: localizedText,
    // El párrafo de su página.
    detalle: localizedText,
  })
  .strict();

export const vitrinaSchema = z
  .object({
    categorias: z
      .array(categoriaVitrina)
      .min(1)
      .superRefine((cs, ctx) => {
        const ids = cs.map((c) => c.id);
        for (const [i, id] of ids.entries()) {
          if (ids.indexOf(id) !== i)
            ctx.addIssue({
              code: "custom",
              path: [i, "id"],
              message: `frente repetido: «${id}»`,
            });
        }
        if (!ids.includes("apps"))
          ctx.addIssue({
            code: "custom",
            message:
              "falta el frente «apps»: sus piezas salen de content/vitrina/ y es el que ancla el portal",
          });
      }),
  })
  .strict();

export type Vitrina = z.infer<typeof vitrinaSchema>;
export type CategoriaVitrina = Vitrina["categorias"][number];

/**
 * Mensaje desde la hoja de vida (formulario + endpoint). `website` es el
 * honeypot. `app` es opcional desde la revisión post-S8: el formulario dejó
 * de ser «solicitar acceso» a una app y pasó a ser el contacto general —
 * asesorías, charlas, roles—; elegir una app sigue metiendo en su lista de espera.
 */
export const solicitudSchema = z.object({
  nombre: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  app: z.string().trim().max(60).default(""),
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
  const cv = parseOrThrow(cvSchema, data, source);
  // Un hito que apunta a un proyecto sin case study enlazaría a un 404.
  const conDetalle = new Set(
    cv.proyectos.filter((p) => p.casestudy).map((p) => p.slug),
  );
  const rotos = cv.trayectoria
    .filter((t) => t.proyecto && !conDetalle.has(t.proyecto))
    .map((t) => `${t.organizacion} → proyecto «${t.proyecto}»`);
  if (rotos.length > 0) {
    throw new Error(
      `Contenido inválido en ${source}: cada «proyecto:» de la trayectoria debe ser el slug de un proyecto CON casestudy. Rotos: ${rotos.join("; ")}`,
    );
  }
  return cv;
}

export function parseApps(data: unknown, source: string): Apps {
  return parseOrThrow(appsSchema, data, source);
}

/**
 * `frentesConPiezas` es lo que hay MEDIDO en el repo (ver
 * `lib/vitrina/piezas.ts` y `categorias.ts`). Es un parámetro y no un valor por
 * defecto a propósito: quien llame tiene que haber ido a mirar. Un default
 * silencioso sería justo la puerta que esta regla vino a cerrar.
 */
export function parseVitrina(
  data: unknown,
  source: string,
  frentesConPiezas: readonly string[],
): Vitrina {
  const vitrina = parseOrThrow(vitrinaSchema, data, source);
  const huerfanos = vitrina.categorias.filter(
    (c) => c.estado === "abierta" && !frentesConPiezas.includes(c.id),
  );
  if (huerfanos.length > 0) {
    throw new Error(
      `Contenido inválido en ${source}:\n` +
        huerfanos
          .map(
            (c) =>
              `  - ${c.id}: está marcada «abierta» y no tiene ni una pieza publicada. ` +
              `Un frente abierto sin piezas promete lo que no enseña — se abre el día que llegue su primera ficha, no antes.`,
          )
          .join("\n") +
        `\n  Frentes con piezas hoy: ${frentesConPiezas.length ? frentesConPiezas.join(", ") : "(ninguno)"}.`,
    );
  }
  return vitrina;
}
