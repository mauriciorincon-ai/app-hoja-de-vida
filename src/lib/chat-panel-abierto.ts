/**
 * LA MARCA DE «EL PANEL ESTABA ABIERTO» (S24, OM-14). Sin importaciones, a
 * propósito: el lanzador del chat vive en el layout y pesa en TODAS las
 * páginas, así que no puede arrastrar Zod ni los esquemas de la conversación
 * (`chat-conversacion.ts`, que lo vuelve a exportar para el panel y las
 * pruebas). Lo vigila `tests/unit/chat-launcher-liviano.test.ts`.
 */

/** La marca de «el panel estaba abierto», en `sessionStorage` (por pestaña). */
export const CLAVE_ABIERTO = "cv-viva:chat:abierto";

/** Lo mínimo que se pide a un almacén: el `Storage` del navegador o uno de prueba. */
export type Almacen = Pick<Storage, "getItem" | "setItem" | "removeItem">;

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
