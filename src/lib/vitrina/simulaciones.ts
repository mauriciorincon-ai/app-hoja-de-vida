import { z } from "zod";

/**
 * LAS SIMULACIONES DE LAS APPS (2026-10-12) — motor puro.
 *
 * Una app privada que no se publica puede traer una SIMULACIÓN estática: un
 * paquete de páginas que su casa entrega y CV Viva copia a
 * `public/piezas/<carpeta>/`. Este módulo valida `data/simulaciones.yaml`
 * sin tocar el disco: quien llama le dice qué apps tienen export y qué
 * archivos existen. Así el test prueba cada rojo sin montar un paquete.
 *
 * Lo que rompe el build, nombrando el archivo y la entrada:
 *  · un slug que no es una app con export (una simulación sin ficha a la que
 *    colgarse sería una página huérfana);
 *  · un archivo de entrada que no existe en el paquete (el marco abriría un 404);
 *  · una entrada que no termina en `.html` (el enrutador de idiomas manda a
 *    404 toda ruta sin punto: una carpeta suelta no se sirve);
 *  · el mismo slug dos veces.
 */

const textoNoVacio = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const archivoHtml = z
  .string()
  .regex(
    /^(?!\/)(?!.*\.\.)[a-zA-Z0-9._/-]+\.html$/,
    "la entrada es un .html relativo a la carpeta del paquete (sin «/» inicial ni «..»)",
  );

const simulacion = z.object({
  slug,
  carpeta: slug,
  entrada: z.object({ es: archivoHtml, en: archivoHtml }),
  nota: z.object({ es: textoNoVacio.max(400), en: textoNoVacio.max(400) }),
});

export const simulacionesSchema = z
  .object({ simulaciones: z.array(simulacion) })
  .superRefine((d, ctx) => {
    const vistos = new Set<string>();
    d.simulaciones.forEach((s, i) => {
      if (vistos.has(s.slug))
        ctx.addIssue({
          code: "custom",
          path: ["simulaciones", i, "slug"],
          message: `«${s.slug}» ya tiene simulación: una por app`,
        });
      vistos.add(s.slug);
    });
  });

export type Simulacion = z.infer<typeof simulacion>;

/** La ruta pública del archivo de entrada, p. ej. `/piezas/planlang/es.html`. */
export function rutaDeEntrada(s: Simulacion, locale: "es" | "en"): string {
  return `/piezas/${s.carpeta}/${s.entrada[locale]}`;
}

/**
 * Valida el YAML contra el esquema y contra el mundo: las apps con export y
 * los archivos que existen. Lanza con TODOS los problemas a la vez.
 */
export function parseSimulaciones(
  data: unknown,
  source: string,
  mundo: {
    appsConExport: ReadonlySet<string>;
    existe: (rutaRelativaAPublic: string) => boolean;
  },
): Simulacion[] {
  const r = simulacionesSchema.safeParse(data);
  if (!r.success) {
    const issues = r.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Contenido inválido en ${source}:\n${issues}`);
  }
  const problemas: string[] = [];
  for (const s of r.data.simulaciones) {
    if (!mundo.appsConExport.has(s.slug))
      problemas.push(
        `  - ${s.slug}: no es una app con export en content/vitrina/ (la simulación no tendría ficha)`,
      );
    for (const l of ["es", "en"] as const) {
      const ruta = `piezas/${s.carpeta}/${s.entrada[l]}`;
      if (!mundo.existe(ruta))
        problemas.push(
          `  - ${s.slug}.entrada.${l}: public/${ruta} no existe (el marco abriría un 404)`,
        );
    }
  }
  if (problemas.length)
    throw new Error(
      `Simulaciones inválidas en ${source}:\n${problemas.join("\n")}`,
    );
  return r.data.simulaciones;
}
