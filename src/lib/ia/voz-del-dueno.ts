/**
 * LA VOZ DEL DUEÑO EN EL CHAT (S24, OM-13). Motor puro.
 *
 * Decisión del dueño (2026-10-24 y 2026-10-25): el chat habla SIEMPRE en
 * tercera persona de Henry, y el corpus —que sí está en primera persona— se
 * reescribe al citarlo. Lo que se prohíbe es la voz DEL DUEÑO («hice», «mi
 * equipo», «I built», «escríbeme»); el asistente puede hablar de sí mismo
 * («se me escapa», «dame un minuto», «I can't answer that»): es el asistente,
 * no Henry.
 *
 * Por eso no se reutiliza `lib/metodo/voz-impersonal.ts` (S14): aquel motor
 * veta TODA primera persona y es el correcto para una publicación, pero
 * rechazaría la respuesta fija del propio chat. Aquí se juzga lo que cuenta
 * quien habla como el dueño:
 *  · posesivos y pronombres suyos: «mi, mis, yo, mío, conmigo» · «my, mine,
 *    myself»;
 *  · verbos de experiencia en primera persona, de una lista CERRADA (piso, no
 *    techo): «construí, lideré, diseñé…» · «I built, I led…»;
 *  · invitaciones del dueño a sus visitantes: «escríbeme, contáctame,
 *    avísame» · «write to me, contact me, let me know».
 *
 * Uso: vigilar las cadenas fijas y el espacio `chat` de `messages/`, y marcar
 * la respuesta del modelo en la pasada en vivo (la CI no ve al modelo real).
 */

export type Idioma = "es" | "en";
export type HallazgoDeVozDelDueno = { termino: string };

/** Una palabra entera: ni letra ni número a ningún lado (Unicode). */
const solo = (alternativas: string, flags = "giu") =>
  new RegExp(
    `(?<![\\p{L}\\p{N}'’-])(?:${alternativas})(?![\\p{L}\\p{N}])`,
    flags,
  );

/** Lo que es del dueño en la boca del dueño: su hoja de vida y lo que ella cuenta. */
const DOMINIO_ES =
  "hoja de vida|hv|cv|currículum|curriculum|trayectoria|experiencia|proyectos?|carrera|equipo|empresa|trabajo|portafolio|formación|estudios|certificaciones|perfil|historial|vida|casos|apps?|agentes|método|enfoque|paso|rol|cargo|aporte|puesto|labor|logros?|habilidades";
const DOMINIO_EN =
  "résumé|resume|cv|career|experience|projects?|work|team|company|background|portfolio|studies|certifications?|profile|history|life|cases|apps?|agents|method|approach|journey|story|role|position|contribution|skills|achievements?";

const ES = solo(
  [
    // pronombres del dueño, y su posesivo SOLO ante lo que es suyo (su hoja de vida, su
    // trayectoria…): «mi correo» es del visitante y «my lane» del asistente
    "yo|mío|mía|míos|mías|conmigo",
    `mis?(?= (?:${DOMINIO_ES}))`,
    // invitaciones del dueño (el asistente dice «dame», no «escríbeme»)
    "escríbeme|escríbame|escríbanme|contáctame|contáctenme|llámame|avísame|avísenme|cuéntame sobre mí",
    "me interesa|me interesan",
    // experiencia: pretérito y presente de la lista cerrada
    "construí|lideré|diseñé|implementé|desarrollé|dirigí|creé|fundé|trabajé|aprendí|estudié|entregué|lancé|migré|automaticé|coordiné|gestioné|participé",
    // el pretérito de siempre: «hice», «tuve», «fui», «logré», «reduje»…
    "hice|tuve|fui|logré|reduje|ahorré|ayudé|empecé|salí|usé|utilicé|analicé|probé|resolví|definí|integré|propuse|asumí|mejoré|publiqué|escribí|monté|armé",
    // reflexivos: «me encargué», «me gradué», «me desempeñé»
    "me encargué|me gradué|me desempeñé|me formé|me incorporé|me dediqué",
    "construyo|lidero|dirijo|implemento|gestiono|coordino",
    // «he construido», «he liderado»: el auxiliar solo, seguido de un participio
    "he(?= \\p{L}+(?:ado|ido|to|cho)(?![\\p{L}]))",
  ].join("|"),
);

const EN_I = new RegExp(
  "(?<![\\p{L}\\p{N}'’.-])I(?: (?:built|led|designed|implemented|developed|worked|created|founded|managed|learned|studied|delivered|launched|migrated|automated|coordinated|ran|made|did|had|reduced|saved|left|helped|started|graduated|used|joined|moved|took|chose|decided|wrote|owned|drove|proposed|was(?! (?:unable|not able))|have (?:built|led|worked|designed|developed|created|managed|delivered))|['’]ve (?:built|led|worked|designed|developed|created|managed|delivered|launched))(?![\\p{L}\\p{N}])",
  "gu",
);
const EN = solo(
  [
    "mine|myself",
    `my(?= (?:${DOMINIO_EN}))`,
    "write (?:to )?me|contact me|reach (?:out to )?me|email me|message me|call me|let me know|get in touch with me",
    "I(?:['’]m| am) (?:interested|looking)|interests me",
    // «I'm the lead…»: el dueño presentándose
    "I(?:['’]m| am) the",
  ].join("|"),
);

/** Lo que de voz del dueño hay en un texto, en el orden en que aparece. */
export function vozDelDueno(
  texto: string,
  idioma: Idioma,
): HallazgoDeVozDelDueno[] {
  const res = idioma === "es" ? [ES] : [EN_I, EN];
  return res
    .flatMap((re) => [...texto.matchAll(re)])
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((m) => ({ termino: m[0] }));
}
