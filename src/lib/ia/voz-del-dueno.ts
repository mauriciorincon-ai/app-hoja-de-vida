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
 *    avísame» · «write to me, contact me, let me know»;
 *
 * Y lo que NO es su voz aunque se le parezca: la cortesía del ASISTENTE a quien
 * pregunta («Let me know if you’d like more details», «avísame si quieres…»,
 * `CORTESIA_DEL_ASISTENTE`, S27). Una lista cerrada; lo que venga detrás de la
 * cortesía se sigue juzgando («Let me know if you’d like to see my projects»
 * marca «my»).
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

/**
 * Las cortesías del ASISTENTE hacia quien pregunta (S27, decisión del dueño 2026-10-28: «Let me know…» no es su voz).
 * En la pasada en vivo del 026 el modelo cerró una respuesta con «Let me know if you’d like more details…» y el marcador
 * lo contó como la invitación del dueño. La lista es CERRADA y mínima —solo la cortesía, no el resto de la frase—:
 * «Let me know.» y «Escríbeme» siguen siendo la voz del dueño, y lo que venga después de la cortesía se sigue juzgando.
 */
const CORTESIA_DEL_ASISTENTE: Record<Idioma, RegExp> = {
  en: /(?<![\p{L}\p{N}'’-])let me know if (?:you(?:['’]d| would| do| did)? (?:like|prefer|want|need|wish)|you(?:['’]re| are) (?:interested|curious)|you(?:['’]ve(?: got)?| have(?: got)?) (?:(?:any|more|other|further|some) )+(?:questions?|doubts?)|i can (?:help|assist)|there(?:['’]s| is| are) (?:anything|something|more))(?![\p{L}\p{N}])/giu,
  es: /(?<![\p{L}\p{N}'’-])avísame si (?:quieres|te gustaría|necesitas|prefieres|deseas|te interesa|hay algo|tienes (?:(?:alguna|algunas|más|otra|otras) ){1,2}(?:preguntas?|dudas?))(?![\p{L}\p{N}])/giu,
};

/** Lo que de voz del dueño hay en un texto, en el orden en que aparece. */
export function vozDelDueno(
  texto: string,
  idioma: Idioma,
): HallazgoDeVozDelDueno[] {
  const res = idioma === "es" ? [ES] : [EN_I, EN];
  const sinCortesia = texto.replace(CORTESIA_DEL_ASISTENTE[idioma], " ");
  return res
    .flatMap((re) => [...sinCortesia.matchAll(re)])
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((m) => ({ termino: m[0] }));
}
