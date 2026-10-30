import type { ChatLocale } from "./guardrails";
import { normalizar } from "./rehuso";
import type { ChatChunk, Fuente } from "./schemas";

/**
 * LA SALIDA DE VESTING (S27). Motor puro e isomórfico, hermano del rehúso.
 *
 * Decisión del dueño (2026-10-28, «ya párale»; no se reabre): «¿Por qué salió de Vesting?» recibe UNA respuesta fija
 * que cuenta lo que consta —cómo cerró la etapa— con su cita, sin llamar al modelo (cero tokens). Dos reglas de prompt
 * seguidas (S25 la negativa, S26 la positiva) dejaron la pregunta en el rehúso con el modelo real, y el corpus no da un
 * «porqué»: da el «cómo». Código primero (regla 14): lo que se puede resolver con una lista cerrada no se le pide a un
 * modelo.
 *
 * El texto sale de `data/a-fondo/origenes.{es,en}.md` («Cerré la etapa en enero de 2025…», la sección
 * `el-marco-replicable`), solo pasado a tercera persona; la cita [1] apunta a ese mismo fragmento del índice.
 *
 * La lista es CERRADA y se lee en los dos idiomas sea cual sea el de la página (quien navega en español puede escribir
 * en inglés). Entra SOLO la pregunta por la salida o el cierre de la etapa en Vesting. «¿Qué hizo Henry en Vesting?»,
 * «¿por qué entró?», «¿qué dejó documentado?» y las preguntas que mezclan la salida con la entrada siguen yendo al
 * modelo: es un piso, no un techo, y se mide contra el banco entero (`tests/unit/salida-de-vesting.test.ts`).
 */

/** El texto fijo, en tercera persona y con su cita. Un test lo compara con el corpus y con `vozDelDueno`. */
export const RESPUESTA_SALIDA: Record<ChatLocale, string> = {
  es: [
    "Henry cerró su etapa en Vesting en enero de 2025, al dejar el ecosistema y el proceso documentados:",
    "la plataforma seguía operando y el marco podía ejecutarse sin él, que era exactamente el criterio de",
    "terminado que había aprendido en Inglopres con el equipo de doce. [1]",
  ].join(" "),
  en: [
    "Henry closed his stage at Vesting in January 2025 by leaving the ecosystem and the process documented:",
    "the platform kept operating and the framework could be executed without him, which was exactly the",
    "criterion of done he had learned at Inglopres with the team of twelve. [1]",
  ].join(" "),
};

/**
 * De dónde sale el texto: la sección `origenes` · `el-marco-replicable` del a-fondo, y la frase que la distingue en
 * cada idioma. El id del fragmento lleva un `~N` que depende de cómo se corte el documento; por eso la fuente se
 * busca por sección y frase, no por el id completo.
 */
export const FUENTE_DE_LA_SALIDA = {
  seccion: "a-fondo-origenes-el-marco-replicable",
  frase: { es: "enero de 2025", en: "January 2025" },
} as const;

/** Los trozos del índice que dicen la salida: debe ser exactamente uno por idioma (lo prueba el test contra el índice). */
export function trozosDeLaSalida(
  chunks: readonly ChatChunk[],
  locale: ChatLocale,
): ChatChunk[] {
  return chunks.filter(
    (c) =>
      (c.id === FUENTE_DE_LA_SALIDA.seccion ||
        c.id.startsWith(`${FUENTE_DE_LA_SALIDA.seccion}~`)) &&
      c.texto.includes(FUENTE_DE_LA_SALIDA.frase[locale]),
  );
}

/** La cita [1] de la respuesta fija, o `null` si el índice no trae el fragmento (entonces la pregunta sigue al modelo). */
export function fuenteDeLaSalida(
  chunks: readonly ChatChunk[],
  locale: ChatLocale,
): Fuente | null {
  const [chunk] = trozosDeLaSalida(chunks, locale);
  if (!chunk) return null;
  return {
    n: 1,
    codigo: chunk.codigo,
    titulo: chunk.titulo,
    ancla: chunk.ancla,
    destino: chunk.destino,
  };
}

// ── La lista cerrada ──────────────────────────────────────────────────────────────────────────────────────────
// Todo se compara sobre `normalizar`: minúsculas, sin acentos ni apóstrofos, la puntuación hecha espacio.

const OTRA = "(?:la |su |esa |esta |ese )?";
const LA_EMPRESA = `${OTRA}(?:vesting|startup|empresa|compania|company)`;

/**
 * Lo que puede preceder a la palabra interrogativa sin cambiar la pregunta: un saludo o una muletilla. Lista CERRADA:
 * lo que no esté aquí no abre la frase y la pregunta sigue al modelo (es un piso, no un techo).
 */
const PREAMBULO =
  "(?:(?:hola|hello|hi|hey|y|entonces|dime|cuentame|oye|oiga|a ver|por favor|puedes decirme|me puedes decir|podrias decirme|sabes|quiero saber|quisiera saber|me gustaria saber|so|and|well|please|tell me|can you tell me|could you tell me|do you know|i want to know|id like to know|i would like to know|i wonder) )*";

/**
 * La palabra con que ABRE una pregunta por la salida: porqué, cuándo, cómo… «cuando» y «como» (y «when» y «how») son
 * también conjunciones: en «¿qué hizo cuando salió de Vesting?» o «¿cuántas personas tenía a cargo cuando salió?» la
 * pregunta es otra y la salida es solo el momento. Por eso cuentan solo si ABREN la frase (S27, auditoría M1).
 */
const INTERROGANTE_QUE_ABRE = new RegExp(
  `^${PREAMBULO}(?:por que|porque|cuando|como|en que momento|why|when|how)\\b`,
);

/**
 * Una segunda palabra interrogativa DESPUÉS de la que abre la frase delata otra pregunta: «how many people reported to
 * him when he left Vesting» (how … when), «cuando salió de Vesting, ¿qué hizo?» (cuando … qué). Se mira solo en la rama
 * del opener: «¿cuál fue el motivo de su salida?» lleva su «cuál» y es la pregunta de la salida.
 */
const OTRA_INTERROGACION =
  /\b(?:que|quien|quienes|cual|cuales|cuanto|cuantos|cuanta|cuantas|donde|como|cuando|por que|what|who|which|where|how|when|why)\b/;

/** Los sustantivos de la causa no son conjunciones: valen en cualquier lugar («¿cuál fue el motivo de…?», «what was the reason he left…»). */
const CAUSA =
  /\b(?:motivo|motivos|razon|razones|causa|causas|reason|reasons|motive|motives|cause)\b/;

/** La salida usada como PUNTO DE REFERENCIA de otra pregunta: «antes de salir de Vesting», «después de su salida», «after leaving Vesting». */
const SALIDA_COMO_REFERENCIA =
  /\b(?:antes de|despues de|tras|luego de|desde que|hasta que|mientras|after|before|since|until|while|once|following)\b/;

/** Salir, irse, dejar, renunciar, terminar o cerrar la etapa — siempre con Vesting (o la empresa) por objeto. */
const VERBO_DE_SALIDA: RegExp[] = [
  // «salió (Henry) de Vesting», «salir de la startup»
  new RegExp(
    `\\b(?:salio|salir|sale|salgo)(?: \\w+)? (?:de|del) ${LA_EMPRESA}\\b`,
  ),
  // «se fue / se retiró / se marchó de Vesting»; nunca «se fue construyendo…»
  new RegExp(
    `\\bse (?:fue|va|retiro|marcho)(?: \\w+)? (?:de|del) ${LA_EMPRESA}\\b`,
  ),
  new RegExp(
    `\\b(?:irse|retirarse|marcharse)(?: \\w+)? (?:de|del) ${LA_EMPRESA}\\b`,
  ),
  // «dejó Vesting», «dejó la startup», «dejó su puesto»; nunca «dejó documentado» ni «dejó de usar»
  new RegExp(
    `\\b(?:dejo|dejar|deja)(?: \\w+)? (?:vesting|${OTRA}(?:startup|empresa|compania|puesto|cargo|trabajo|empleo|etapa|rol|equipo))\\b`,
  ),
  // «renunció a Vesting», «renunciar a su puesto»
  new RegExp(
    `\\b(?:renuncio|renunciar|renuncia)(?: \\w+)?(?: (?:a|en|de|del))? ${OTRA}(?:vesting|startup|empresa|compania|puesto|cargo|trabajo|empleo)\\b`,
  ),
  // «terminó / cerró su etapa», «acabar la relación»
  new RegExp(
    `\\b(?:termino|terminar|acabo|acabar|finalizo|finalizar|concluyo|concluir|cerro|cerrar)(?: \\w+)? (?:su|la|esa|esta) (?:etapa|ciclo|relacion|vinculacion|contrato|participacion|colaboracion|experiencia|tiempo|paso)\\b`,
  ),
  // «ya no está / trabaja en Vesting»
  /\bya no (?:esta|trabaja|colabora|participa)(?: \w+)? (?:en|con) vesting\b/,
  // EN: «leave Vesting», «left his job at Vesting», «leave things at Vesting»
  /\b(?:leave|leaves|left|leaving)(?: \w+){0,2} (?:the )?(?:vesting|startup|company)\b/,
  /\b(?:leave|leaves|left|leaving)(?: \w+){0,3} (?:at|in|with|from) vesting\b/,
  /\b(?:quit|quits|resign|resigned|resigns)(?: \w+){0,3} (?:vesting|the startup|the company|from vesting|at vesting)\b/,
  /\b(?:step|stepped) down(?: \w+){0,2} (?:from|at) vesting\b/,
  /\b(?:move|moved) on from vesting\b/,
  // «how did his time at Vesting end», «how did he close his stage at Vesting»
  /\b(?:time|stage|stint|chapter|tenure|role|job|work|period|experience|run)(?: \w+)? (?:at|in|with) vesting (?:end|ended|conclude|concluded|finish|finished|close|closed|wrap up|wrapped up|come to an end|came to an end)\b/,
  /\b(?:end|ended|finish|finished|close|closed|conclude|concluded|wrap|wrapped)(?: up)?(?: \w+){0,2} (?:stage|stint|chapter|tenure|time|role|job|work|period|experience)(?: \w+)? (?:at|in|with) vesting\b/,
  /\bno longer (?:at|with|works at|working at) vesting\b/,
];

/** Sustantivos de la salida: valen sin palabra interrogativa («su salida de Vesting», «el cierre de su etapa en Vesting»). */
const NOMBRE_DE_SALIDA: RegExp[] = [
  new RegExp(
    `\\b(?:su|la) (?:salida|renuncia|retirada|partida|despedida) (?:de|del|a) ${LA_EMPRESA}\\b`,
  ),
  /\b(?:el )?(?:cierre|fin|final|termino) (?:de |del )(?:su |la )?(?:etapa|ciclo|paso|experiencia|tiempo|participacion|colaboracion)(?: \w+){0,2} (?:en|de|con) vesting\b/,
  /\bsu cierre en vesting\b/,
  /\b(?:his|the) (?:departure|exit|resignation|farewell) (?:from|of) vesting\b/,
  /\bhis leaving (?:of )?vesting\b/,
];

/** Entrada, duración o inicio: la pregunta mezcla otra cosa con la salida y es del modelo, no del texto fijo. */
const MEZCLA_CON_OTRA_COSA =
  /\b(?:empezo|empezar|comenzo|comenzar|inicio|iniciar|entro|entrar|ingreso|ingresar|llego|llegar|contrato|contrataron|cuanto tiempo|cuantos anos|cuantos meses|desde cuando|started|start|begin|began|join|joined|hired|how long|since when)\b/;

/**
 * ¿Pregunta esta frase por la salida o el cierre de la etapa en Vesting? Entonces recibe `RESPUESTA_SALIDA`.
 * Exige «Vesting» en la frase: «¿por qué salió de Cafam?» no entra.
 */
export function esPreguntaPorLaSalida(pregunta: string): boolean {
  const q = normalizar(pregunta);
  if (!/\bvesting\b/.test(q)) return false;
  if (MEZCLA_CON_OTRA_COSA.test(q)) return false;
  if (SALIDA_COMO_REFERENCIA.test(q)) return false;
  if (NOMBRE_DE_SALIDA.some((re) => re.test(q))) return true;
  const abre = INTERROGANTE_QUE_ABRE.exec(q);
  const preguntaPorLaCausa =
    (abre !== null && !OTRA_INTERROGACION.test(q.slice(abre[0].length))) ||
    CAUSA.test(q);
  return preguntaPorLaCausa && VERBO_DE_SALIDA.some((re) => re.test(q));
}
