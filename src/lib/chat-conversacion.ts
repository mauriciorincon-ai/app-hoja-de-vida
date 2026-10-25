import { z } from "zod";
import { fuenteSchema, type ChatUIMessage } from "@/lib/ia/schemas";

/**
 * LA CONVERSACIÓN DEL CHAT, EN EL NAVEGADOR (S24, OM-14). Motor puro: el reloj
 * y el almacén llegan por parámetro, así que la vida de ocho horas se prueba
 * sin esperarla y un almacén que lanza se prueba sin romper el navegador.
 *
 * Decisión del dueño (2026-10-24 y 2026-10-25): seguir un enlace del menú,
 * recargar o cambiar de idioma no reinicia el chat. La conversación vive en
 * `localStorage` de ESE navegador (costo de servidor: cero), el visitante la
 * borra cuando quiera y vence sola a las 8 horas del último mensaje. Solo se
 * guarda lo que se ve: el texto y las fuentes de cada mensaje. Nunca el
 * nombre ni el correo (esos viven en la cookie firmada de ADR-024).
 *
 * Todo se lee con Zod: el almacén es del visitante y de cualquier extensión,
 * y nada de lo que trae se da por bueno (regla 4 del kit).
 */

/** Ocho horas desde el último mensaje (decisión del dueño). */
export const VIDA_MS = 8 * 60 * 60 * 1000;
/** Tope de mensajes guardados: el modelo solo ve los últimos 12, lo demás es historia. */
export const MAX_MENSAJES = 40;
/** Tope del JSON guardado, en caracteres: «solo si no llena el almacenamiento de la app». */
export const MAX_CARACTERES = 100_000;
export const CLAVE = "cv-viva:chat:v1";
/** La marca de «el panel estaba abierto», en `sessionStorage` (por pestaña). */
export const CLAVE_ABIERTO = "cv-viva:chat:abierto";

/** Lo mínimo que se pide a un almacén: el `Storage` del navegador o uno de prueba. */
export type Almacen = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const parteTexto = z.object({
  type: z.literal("text"),
  text: z.string().max(4000),
});
const parteFuentes = z.object({
  type: z.literal("data-fuentes"),
  data: z.array(fuenteSchema).max(8),
});
const mensajeSchema = z.object({
  id: z.string().min(1).max(100),
  role: z.enum(["user", "assistant"]),
  parts: z
    .array(z.union([parteTexto, parteFuentes]))
    .min(1)
    .max(4),
});
const guardadoSchema = z.object({
  v: z.literal(1),
  /** Cuándo se escribió el último mensaje (ms desde la época): de aquí cuentan las 8 horas. */
  ultimo: z.number().int().positive(),
  mensajes: z.array(mensajeSchema).max(MAX_MENSAJES),
});
export type Guardado = z.infer<typeof guardadoSchema>;

/** El `Storage` real, o null si el navegador lo niega (ventana privada, datos bloqueados). */
export function almacenDelNavegador(
  cual: "local" | "sesion" = "local",
): Almacen | null {
  try {
    if (typeof window === "undefined") return null;
    return cual === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

/** ¿Ya pasaron las 8 horas del último mensaje? Exactas cuentan como vencida. */
export function estaVencida(ultimo: number, ahora: number): boolean {
  return ahora - ultimo >= VIDA_MS;
}

/** Lo que de un mensaje del `useChat` vale la pena guardar: texto y fuentes. */
function paraGuardar(m: ChatUIMessage): z.input<typeof mensajeSchema> | null {
  if (m.role !== "user" && m.role !== "assistant") return null;
  const parts: z.input<typeof mensajeSchema>["parts"] = [];
  for (const p of m.parts) {
    if (p.type === "text" && p.text) {
      parts.push({ type: "text", text: p.text.slice(0, 4000) });
    } else if (p.type === "data-fuentes" && "data" in p) {
      const fuentes = z.array(fuenteSchema).max(8).safeParse(p.data);
      if (fuentes.success)
        parts.push({ type: "data-fuentes", data: fuentes.data });
    }
  }
  return parts.length > 0 ? { id: m.id, role: m.role, parts } : null;
}

/**
 * Lo guardado (los mensajes y cuándo se escribió el último), o `null` si no
 * hay, está vencido o no es lo que este módulo escribió. Lo vencido y lo
 * ilegible se BORRAN al leerlos: el almacén no se queda con basura que nadie
 * va a abrir.
 */
export function leerGuardado(
  almacen: Almacen | null,
  ahora: number,
): Guardado | null {
  if (!almacen) return null;
  try {
    const crudo = almacen.getItem(CLAVE);
    if (crudo === null) return null;
    const parsed = guardadoSchema.safeParse(JSON.parse(crudo));
    if (!parsed.success || estaVencida(parsed.data.ultimo, ahora)) {
      almacen.removeItem(CLAVE);
      return null;
    }
    return parsed.data;
  } catch {
    try {
      almacen.removeItem(CLAVE);
    } catch {
      // un almacén que lanza también al borrar: no hay nada más que hacer
    }
    return null;
  }
}

/** La conversación guardada, o `[]`. */
export function leer(almacen: Almacen | null, ahora: number): ChatUIMessage[] {
  return (leerGuardado(almacen, ahora)?.mensajes ?? []) as ChatUIMessage[];
}

/**
 * Guarda la conversación (los últimos {@link MAX_MENSAJES}) con `ahora` como
 * «último mensaje». Devuelve `false` si no pudo —el almacén lleno, negado o
 * roto—: el chat sigue funcionando, solo sin memoria.
 */
export function guardar(
  almacen: Almacen | null,
  mensajes: readonly ChatUIMessage[],
  ahora: number,
): boolean {
  if (!almacen) return false;
  try {
    let lista = mensajes
      .map(paraGuardar)
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .slice(-MAX_MENSAJES);
    if (lista.length === 0) {
      almacen.removeItem(CLAVE);
      return true;
    }
    let json = JSON.stringify({ v: 1, ultimo: ahora, mensajes: lista });
    while (json.length > MAX_CARACTERES && lista.length > 1) {
      lista = lista.slice(1);
      json = JSON.stringify({ v: 1, ultimo: ahora, mensajes: lista });
    }
    almacen.setItem(CLAVE, json);
    return true;
  } catch {
    return false;
  }
}

/** Borra la conversación de ESTE navegador (el registro del servidor, Ley 1581, se conserva). */
export function borrar(almacen: Almacen | null): boolean {
  if (!almacen) return false;
  try {
    almacen.removeItem(CLAVE);
    return true;
  } catch {
    return false;
  }
}

/** ¿Estaba el panel abierto cuando la página se descargó? */
export function leerAbierto(almacen: Almacen | null): boolean {
  try {
    return almacen?.getItem(CLAVE_ABIERTO) === "1";
  } catch {
    return false;
  }
}

/** Anota (o quita) la marca de «el panel está abierto». Falla en silencio: es una comodidad. */
export function marcarAbierto(almacen: Almacen | null, abierto: boolean): void {
  try {
    if (abierto) almacen?.setItem(CLAVE_ABIERTO, "1");
    else almacen?.removeItem(CLAVE_ABIERTO);
  } catch {
    // sin almacén no hay reapertura, y no pasa nada
  }
}
