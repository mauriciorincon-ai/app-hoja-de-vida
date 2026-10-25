import type { ChatLocale } from "./guardrails";

/**
 * EL REHÚSO (S24, OM-12). Motor puro e isomórfico.
 *
 * Decisión del dueño (2026-10-24): el chat responde por lo que consta, jamás
 * por lo que NO hizo, NO sabe o «nunca» hizo. Los contenidos no son la verdad
 * absoluta y algo se les puede escapar: nada en el sitio permite afirmar una
 * ausencia. Una pregunta que la pide recibe UNA respuesta fija, en tercera
 * persona, sin llamar al modelo (cero tokens) y sin fuentes.
 *
 * El mismo texto sirve a tres familias (decisión 4 del dueño, 2026-10-25):
 *  · lo que no hizo / no sabe / le falta, y sus debilidades;
 *  · las credenciales que NO tiene (AI-102, DP-100), que
 *    `data/credenciales-nombradas.yaml` declara sin obtener;
 *  · lo que el sitio no dice y solo el dueño decide: salario, disponibilidad,
 *    viajar (las `sin_cobertura` del banco).
 *
 * Qué NO es una pregunta de ausencia, a propósito: la que pregunta por el
 * MÉTODO ante lo no usado («¿qué hace cuando el puesto pide algo que no ha
 * usado nunca?») y los «límites» de una pieza se siguen contestando. La
 * frontera es sintáctica: la negación pegada al «qué» de la pregunta.
 *
 * La lista es CERRADA y se lee en los dos idiomas sea cual sea el de la
 * página: quien navega en español puede escribir en inglés. Es un piso, no un
 * techo: lo que se escape llega al modelo, y ahí lo para el prompt (regla
 * «NUNCA afirmes…», `guardrails.ts`) y la pasada en vivo lo mide.
 */

/** El texto fijo. Es también `chat.fallbackVacio` en `messages/` (un test los iguala). */
export const RESPUESTA_REHUSO: Record<ChatLocale, string> = {
  es: [
    "Sobre eso no puedo responder desde la hoja de vida de Henry: solo contesto",
    "por lo que sí consta en ella. Si quieres saber más, escríbele desde Contacto.",
  ].join(" "),
  en: [
    "I can't answer that from Henry's résumé: I only answer from what it",
    "actually shows. To learn more, write to Henry from the Contact section.",
  ].join(" "),
};

/**
 * Las credenciales que el dueño NO tiene (`credenciales-nombradas.yaml`: el
 * AI-102 jamás, el DP-100 retirado por Microsoft). Preguntar por ellas es
 * preguntar por una ausencia. Un test las compara con el YAML.
 */
export const CREDENCIALES_SIN_OBTENER = ["AI-102", "DP-100"] as const;

/** Minúsculas, sin acentos, sin apóstrofos y con la puntuación hecha espacio. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9ñ]+/g, " ")
    .trim();
}

/**
 * Palabras que, entre el «qué» y la negación, delatan que la negación es de
 * OTRA oración: condición («cuando», «si»), relativo («que») o causa.
 */
const PUENTE =
  "(?:cuando|si|que|donde|porque|como|aunque|mientras|para|when|if|whenever|where|because|although|while|that|so)";
/** Hasta 4 palabras entre el «qué» y la negación, ninguna de ellas un puente. */
const HASTA_4 = `(?:(?!${PUENTE}\\b)\\w+ ){0,4}?`;
const NEG_ES = "(?:no|nunca|jamas)";
const NEG_EN =
  "(?:never|not|cannot|cant|dont|doesnt|hasnt|havent|isnt|wasnt|didnt|wont)";

const ARRANQUE =
  "(?:(?:y|entonces|dime|cuentame|a ver|oye|so|and|tell me|please) )*";

const AUSENCIA: RegExp[] = [
  // «¿Qué no ha hecho nunca…?», «¿qué tecnologías no domina?», «¿cuáles nunca ha usado?»
  new RegExp(`^${ARRANQUE}(?:que|cuales|cuantas) ${HASTA_4}${NEG_ES}\\b`),
  // «¿Hay algo que no sepa hacer?»
  new RegExp(`^${ARRANQUE}(?:hay|existe|tiene) algo que ${NEG_ES}\\b`),
  // «¿Qué le falta (por aprender)?»
  new RegExp(
    `^${ARRANQUE}(?:que|cuales) ${HASTA_4}(?:le falta|le faltan|le hace falta|desconoce|ignora)\\b`,
  ),
  // «What has he never done…?», «what technologies doesn't he know?»
  new RegExp(`^${ARRANQUE}(?:what|which) ${HASTA_4}${NEG_EN}\\b`),
  // «Is there anything he doesn't know?»
  new RegExp(
    `^${ARRANQUE}(?:is there|are there|does he have) (?:anything|something) (?:he |that he )?${NEG_EN}\\b`,
  ),
  // «What is he missing?», «what does he lack?»
  new RegExp(
    `^${ARRANQUE}(?:what|which) ${HASTA_4}(?:lack|lacks|missing|unfamiliar with|doesnt know)\\b`,
  ),
  // Debilidades: la pregunta clásica de entrevista pide una ausencia con otro nombre.
  /\b(?:sus|su|tus|tu|mayor|principal|principales|cuales son las) (?:\w+ )?(?:debilidad(?:es)?|defecto(?:s)?|flaqueza(?:s)?|carencia(?:s)?)\b/,
  /\b(?:debilidad(?:es)?|defecto(?:s)?|carencia(?:s)?) de henry\b/,
  /\bpuntos? (?:debil(?:es)?|flacos?|ciegos?)\b|\bareas? de mejora\b/,
  /\b(?:his|henrys|your|biggest|greatest|main) (?:\w+ )?(?:weakness(?:es)?|shortcomings?|flaws?)\b/,
  /\bweak (?:points?|spots?)\b|\bareas? (?:for|to) improve(?:ment)?\b|\bblind spots?\b/,
  // Las credenciales que no tiene.
  /\bai ?102\b|\bdp ?100\b/,
  // Lo que el sitio no dice y solo el dueño decide: salario, disponibilidad, viajar.
  /\b(?:expectativas?|pretensiones|aspiraciones?) salariales?\b|\bsalario\b|\bsueldo\b|\bremuneracion\b/,
  /\bcuanto (?:gana|cobra|cobraria|quiere ganar|pide|espera ganar)\b/,
  /\bdisponibilidad (?:para|inmediata|horaria)\b|\bdisponibilidad de (?:inicio|tiempo|empezar|viajar|horario)\b/,
  /\bcuando (?:puede|podria|podra) (?:empezar|comenzar|incorporarse|iniciar|unirse)\b|\bviajar\b/,
  /\b(?:salary|salaries)\b|\bpay (?:expectations?|range)\b|\bhow much (?:does|would|will|is) he (?:earn|make|charge|cost|paid)\b/,
  /\bavailable to (?:start|travel|join)\b|\bavailability (?:to|for) (?:start|travel|join)\b|\bwhen (?:can|could|will|is) he (?:start|join|available)\b/,
  /\b(?:willing|able|ready) to travel\b|\bcan he travel\b|\btravel(?:ling|ing)? (?:for work|requirements?)\b/,
];

/** ¿Pide esta pregunta una ausencia, o algo que el sitio no dice? Entonces se rehúsa. */
export function esPreguntaDeAusencia(pregunta: string): boolean {
  const q = normalizar(pregunta);
  return AUSENCIA.some((re) => re.test(q));
}
