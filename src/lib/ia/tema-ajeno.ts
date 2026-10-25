import { normalizar } from "./rehuso";

/**
 * LA PREGUNTA AJENA (S24, OM-16). Motor puro e isomórfico.
 *
 * El guardrail léxico (`guardrails.ts`, `esOffTopic`) no basta, y está medido:
 * una pregunta ajena que comparte UNA palabra con el corpus pasa. «¿Cómo está
 * el clima?» puntuaba 39,99 contra el tablero de energía y clima, llegaba al
 * modelo con esa ficha de fuente y el panel pintaba su chip: el visitante leía
 * una respuesta amable y una cita que no venía a cuento (f2, 2026-10-24).
 *
 * Este detector es la mitad A de la decisión del planeador: por FRASES DE
 * INTENCIÓN, no por palabra suelta. «El tablero de energía y clima» sigue
 * contestándose porque ninguna frase de abajo lo nombra; «¿cómo está el
 * clima?» no, porque pide el tiempo de hoy. La mitad B —que el panel muestre
 * solo las fuentes que la respuesta cita (`fuentesCitadas`)— cubre lo que
 * esta lista no alcance.
 *
 * La lista es CERRADA y se mide contra el banco entero: de las 175 preguntas
 * legítimas por idioma ninguna cae aquí (`tema-ajeno.test.ts`), y cada una de
 * las 15 ajenas declaradas sí. Un tema nuevo se agrega con su frase y su fila.
 */

const AJENO: RegExp[] = [
  // chistes y bromas
  /\b(?:chiste|chistes|broma|bromas|joke|jokes)\b/,
  // el tiempo atmosférico (no «el tablero de energía y clima»)
  /\b(?:como|que) (?:esta|hace|hara|tal)(?: el)? (?:clima|tiempo)\b|\bque (?:clima|tiempo) (?:hace|hara|va a hacer)\b/,
  /\bva a llover\b|\bllover\b|\bllueve\b|\bpronostico del (?:tiempo|clima)\b/,
  /\b(?:whats|what is|how is|hows) the weather\b|\bweather (?:like|today|tomorrow|forecast|in)\b|\bwill it (?:rain|snow)\b/,
  // recetas, horóscopo, poemas, canciones
  /\breceta (?:de|del|para)\b|\brecipe (?:for|of)\b/,
  /\bhoroscop[oa]\b|\bhoroscope\b/,
  /\b(?:poema|poesia|soneto|haiku|poem|poetry|sonnet)\b|\bcancion de amor\b|\blove song\b/,
  // recomendaciones de ocio
  /\b(?:recomiendame|recomiendenme|sugiereme)\b|\b(?:recommend|suggest) (?:me )?(?:a |an |some )?(?:movie|film|show|series|book|song|restaurant)\b/,
  // traducciones
  /\btraduc\w* (?:esta|este|esto|el|la|al)\b|\btraduceme\b|\btraducir\b .* (?:al|a) (?:frances|ingles|aleman|portugues|italiano)\b/,
  /\btranslate (?:this|that|the following|it|me)\b|\btranslate\b .* (?:into|to) (?:french|spanish|english|german|portuguese|italian)\b/,
  // cultura general y deportes
  /\bcual es la capital de\b|\bque ciudad es la capital\b|\bwhat is the capital of\b|\bcapital city of\b/,
  /\b(?:mundial de futbol|copa del mundo|copa mundial|futbol|world cup|football|soccer)\b/,
  // viajes y compras
  /\bcuanto cuesta un (?:tiquete|boleto|pasaje|vuelo|hotel)\b|\bhow much (?:is|does|for) (?:a |an )?(?:ticket|flight|hotel)\b/,
  // finanzas personales
  /\b(?:bitcoin|ethereum|criptomonedas?|cryptocurrenc\w+|crypto)\b/,
  // pedidos de código ajenos a la trayectoria
  /\b(?:escribeme|programame|hazme|generame|creame) (?:una |un |el |la )?(?:\w+ )?(?:funcion|codigo|script|programa|algoritmo)\b/,
  /\b(?:escribe|programa|genera) (?:una |un |el |la )?(?:funcion|codigo|script|programa|algoritmo)\b/,
  /\b(?:write|code|build|make|give|generate) (?:me )?(?:a |an |the |some )?(?:\w+ )?(?:function|script|program|code|algorithm)\b(?! for)/,
];

/** ¿Pide esta pregunta algo ajeno a la trayectoria? Entonces recibe la respuesta fija, sin fuentes. */
export function esTemaAjeno(pregunta: string): boolean {
  const q = normalizar(pregunta);
  return AJENO.some((re) => re.test(q));
}
