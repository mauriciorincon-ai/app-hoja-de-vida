import { conservarVistas, type VistasGuardadas } from "@/lib/skills/explorador";

/**
 * Las áreas de Skills ya abiertas viven solo en memoria del módulo (la maqueta, cuarta vuelta): se
 * reinician al recargar o al volver a entrar a la página y sobreviven al cambio de idioma. Las anota el
 * escenario; la isla marca la entrada y la salida de la home, y `conservarVistas` decide qué vale.
 */
let guardadas: VistasGuardadas | null = null;
let vigentes: string[] = [];

export function entrarAHome(locale: string): void {
  vigentes = conservarVistas(guardadas, { locale, t: performance.now() });
  guardadas = null;
}

export function salirDeHome(locale: string): void {
  guardadas = { ids: vigentes, locale, t: performance.now() };
}

export function vistasVigentes(): string[] {
  return vigentes;
}

export function anotarVistas(ids: string[]): void {
  vigentes = ids;
}
