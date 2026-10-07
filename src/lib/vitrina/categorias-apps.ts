import { z } from "zod";
import type { Locale } from "@/i18n/routing";

/**
 * Las dos categorías de las apps de la vitrina (Sprint 009) — MOTOR PURO.
 *
 * `/vitrina/apps` muestra las apps en dos bloques, Profesionales y Personales,
 * y la pertenencia sale de `data/categorias-apps.yaml`, no del código ni del
 * export (los exports no se editan aquí). Este módulo valida ese YAML y reparte
 * las fichas; no lee archivos (el loader vive en `lib/content.ts`) y no ordena
 * el loader de la vitrina: `getFichasVitrina()` lo usan el manifest, el chat y
 * las vecinas, y su orden no cambia.
 *
 * Tres reglas, todas de «fail-safe» como el resto del contenido:
 *  · un export SIN categoría rompe el build y nombra su slug;
 *  · un slug declarado SIN export se ignora —aparece el día que llegue su
 *    export—, que es como las apps futuras entran sin tocar código;
 *  · un slug no puede estar en las dos categorías.
 */

export const CATEGORIAS_APPS = ["profesionales", "personales"] as const;
export type CategoriaApp = (typeof CATEGORIAS_APPS)[number];

const textoNoVacio = z.string().trim().min(1);

const entrada = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  nombre: z.object({ es: textoNoVacio, en: textoNoVacio }),
});

export const categoriasAppsSchema = z
  .object({
    profesionales: z.array(entrada),
    personales: z.array(entrada),
  })
  .superRefine((c, ctx) => {
    const vistos = new Map<string, CategoriaApp>();
    for (const cat of CATEGORIAS_APPS) {
      c[cat].forEach((e, i) => {
        const previa = vistos.get(e.slug);
        if (previa) {
          ctx.addIssue({
            code: "custom",
            path: [cat, i, "slug"],
            message: `«${e.slug}» ya está en «${previa}»: una app tiene una sola categoría`,
          });
        }
        vistos.set(e.slug, cat);
      });
    }
  });

export type CategoriasApps = z.infer<typeof categoriasAppsSchema>;

export function parseCategoriasApps(
  data: unknown,
  source: string,
): CategoriasApps {
  const r = categoriasAppsSchema.safeParse(data);
  if (!r.success) {
    const issues = r.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Contenido inválido en ${source}:\n${issues}`);
  }
  return r.data;
}

/** Lo mínimo que este motor necesita de una ficha: el slug. */
type ConSlug = { ancla: { slug: string } };

/**
 * Reparte las fichas en las dos categorías, en el ORDEN DEL YAML. Falla si
 * alguna ficha no tiene categoría: «una app nueva se clasifica el día que
 * llega, o no se publica».
 */
export function repartirApps<F extends ConSlug>(
  fichas: readonly F[],
  categorias: CategoriasApps,
  source = "data/categorias-apps.yaml",
): Record<CategoriaApp, F[]> {
  const porSlug = new Map(fichas.map((f) => [f.ancla.slug, f]));
  const declarados = new Set(
    CATEGORIAS_APPS.flatMap((c) => categorias[c].map((e) => e.slug)),
  );

  const sinCategoria = fichas
    .map((f) => f.ancla.slug)
    .filter((s) => !declarados.has(s));
  if (sinCategoria.length > 0) {
    throw new Error(
      `Apps sin categoría en ${source}: ${sinCategoria.join(", ")}.\n` +
        `  Cada export de content/vitrina/ se clasifica como «profesionales» o «personales» ` +
        `el mismo día que llega: ahí se decide dónde se muestra y con qué nombre.`,
    );
  }

  const reparto = { profesionales: [], personales: [] } as Record<
    CategoriaApp,
    F[]
  >;
  for (const cat of CATEGORIAS_APPS) {
    for (const e of categorias[cat]) {
      const ficha = porSlug.get(e.slug);
      // Declarada sin export: se ignora, aparece cuando llegue su export.
      if (ficha) reparto[cat].push(ficha);
    }
  }
  return reparto;
}

/**
 * Cualquier lista de apps, en el ORDEN DEL ESCAPARATE: profesionales primero y
 * después personales, cada una en el orden del YAML. Es lo que ordena a las
 * vecinas «App anterior / App siguiente» y el selector de la lista de espera:
 * si siguieran el orden del loader (selladas primero, luego por fecha), «siguiente»
 * dejaría de significar lo que el visitante acaba de ver en `/vitrina/apps`.
 * Falla igual que `repartirApps` si alguna app no tiene categoría.
 */
export function ordenDeEscaparate<T>(
  items: readonly T[],
  slugDe: (item: T) => string,
  categorias: CategoriasApps,
): T[] {
  const reparto = repartirApps(
    items.map((item) => ({ ancla: { slug: slugDe(item) }, item })),
    categorias,
  );
  return CATEGORIAS_APPS.flatMap((c) => reparto[c].map((f) => f.item));
}

/**
 * El nombre con el que CV Viva muestra la app (alias, ADR-028): el declarado
 * en el YAML o, si la app no está ahí, el que trae su export.
 */
export function nombreVisible(
  categorias: CategoriasApps,
  slug: string,
  nombreDelExport: string,
  locale: Locale,
): string {
  for (const cat of CATEGORIAS_APPS) {
    const e = categorias[cat].find((x) => x.slug === slug);
    if (e) return e.nombre[locale];
  }
  return nombreDelExport;
}
