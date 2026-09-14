/**
 * Constantes de los formularios que el NAVEGADOR necesita — sin Zod, a
 * propósito: los client components importan de aquí y nunca de
 * `@/lib/schemas` ni `@/lib/propuestas`, que arrastran Zod al bundle (gate:
 * `tests/unit/cliente-sin-zod.test.ts`; precedente: Lighthouse rojo en PR #32
 * con +20–30 KB de script en todas las rutas). Los schemas del servidor las
 * re-exportan para que haya UNA lista.
 */

/**
 * Los motivos del formulario GENERAL de la HOME (bloque E del gate ⭐ post-S8):
 * las cinco puertas que el propio bloque anuncia —«¿Un proyecto, una asesoría,
 * una capacitación, una charla o un rol?»— y nada más. La lista de espera de
 * las apps es OTRO formulario, en la vitrina. El texto visible vive en
 * `messages/*.json` (`form.motivos.<id>`); estas etiquetas son las del CORREO,
 * que lee el dueño, en español.
 */
export const MOTIVOS = [
  "proyecto",
  "asesoria",
  "capacitacion",
  "charla",
  "rol",
] as const;
export type Motivo = (typeof MOTIVOS)[number];
export const ETIQUETAS_MOTIVO: Record<Motivo, string> = {
  proyecto: "Un proyecto",
  asesoria: "Una asesoría",
  capacitacion: "Una capacitación",
  charla: "Una charla",
  rol: "Un rol",
};

/** La opción «Otra» de la lista de espera de apps: nunca sobra. */
export const APP_OTRA = "otra";
export const ETIQUETA_APP_OTRA = "Otra app";

/** Largo de una propuesta de funcionalidad (caracteres, ya recortada). */
export const PROPUESTA_MIN = 10;
export const PROPUESTA_MAX = 500;
