/**
 * Las apps cuya entrega del pedido 026 todavía no llegó a CV Viva (2026-10-28).
 *
 * Innmobiliaria: su base —la rama del S16, PR #42— no está mergeada, y la
 * planeadora la copia SOLO cuando su `RESPUESTA-026.md` diga «base mergeada:
 * verificado <sha>». Mientras tanto conserva su export, su complemento y su
 * tira esquemática de antes, y los gates de la entrega (capturas por
 * funcionalidad, a lo sumo un cero en la tira) no se le exigen.
 *
 * Esta lista es una DEUDA CON FECHA, no una excepción permanente: el test de
 * `capturas-apps` falla si una app de la lista ya trae su tabla de capturas
 * («sácala de aquí»), de modo que la entrega de Innmobiliaria vacía la lista y
 * le enciende los gates sin construir nada dos veces.
 */
export const ESPERAN_SU_ENTREGA: readonly string[] = ["inmobiliaria"];
