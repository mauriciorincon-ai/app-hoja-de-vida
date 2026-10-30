/**
 * Las apps cuya entrega de fichas todavía no llegó a CV Viva.
 *
 * Una app entra aquí con su fecha y su motivo cuando su base no está lista (p. ej. una rama sin mergear) y la
 * planeadora aún no escribió en su `RESPUESTA-026.md` «base mergeada: verificado <sha>»: mientras tanto conserva su
 * export, su complemento y su tira de antes, y los gates de la entrega (capturas por funcionalidad, a lo sumo un cero en
 * la tira) no se le exigen.
 *
 * Es una DEUDA CON FECHA, no una excepción permanente: el test de `capturas-apps` falla si una app de la lista ya
 * trae su tabla de capturas («sácala de aquí»), de modo que la entrega vacía la lista y le enciende los gates sin
 * construir nada dos veces.
 *
 * VACÍA desde el 2026-10-29 (Sprint 027): Innmobiliaria entró con su base mergeada (#42, `2b9218d`) y las diez apps
 * pasan los gates.
 */
export const ESPERAN_SU_ENTREGA: readonly string[] = [];
