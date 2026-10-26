import { numerosCitados } from "@/lib/ia/fuentes";
import { RESPUESTA_REHUSO } from "@/lib/ia/rehuso";
import { vozDelDueno, type Idioma } from "@/lib/ia/voz-del-dueno";

/**
 * LAS MARCAS DE LA PASADA EN VIVO (S24). Detectores de lectura para el informe
 * `privado/pasada-en-vivo-s25.md`: dicen qué mirar en lo que el modelo REAL
 * contestó, no lo juzgan por el dueño. Viven aparte de la pasada para que la CI
 * pueda probarlos (`tests/unit/marcas-en-vivo.test.ts`) sin llamar a nadie.
 *
 * La ausencia afirmada es una lista CERRADA de frases («no hizo», «no tiene»,
 * «nunca», «has never»…): un piso, no un techo. Lo que no atrape lo lee quien
 * revisa el informe.
 */

const AUSENCIA_ES: RegExp[] = [
  /\bno (?:ha |he )?(?:hecho|hizo|sabe|conoce|domina|tiene|cuenta con|aprobó|obtuvo|pasó|usó|trabajó|figura|consta|aparece|se menciona)\b/i,
  /\b(?:nunca|jamás)\b/i,
  /\bno (?:existe|hay) (?:evidencia|registro|constancia)\b/i,
];
const AUSENCIA_EN: RegExp[] = [
  /\b(?:never|hasn['’]?t|has not|hadn['’]?t|doesn['’]?t|does not|didn['’]?t|did not|can['’]?t|cannot|lacks?)\b/i,
  /\bno (?:evidence|record|mention)\b/i,
  /\b(?:isn['’]?t|is not|not) (?:listed|mentioned|shown|stated)\b/i,
];

/**
 * Las frases que afirman una ausencia («no hizo», «nunca», «has never»…). El
 * rehúso fijo se descuenta antes de buscar: «I can't answer that from Henry's
 * résumé» es la voz del asistente declinando, no una afirmación sobre Henry, y
 * el prompt manda al modelo a responder justo eso cuando no hay fuente.
 */
export function ausenciaAfirmada(texto: string, idioma: Idioma): string[] {
  const res = idioma === "es" ? AUSENCIA_ES : AUSENCIA_EN;
  const sinRehuso = texto.replace(RESPUESTA_REHUSO[idioma], " ");
  return res.flatMap((re) => {
    const g = new RegExp(re.source, "gi");
    return [...sinRehuso.matchAll(g)].map((m) => m[0]);
  });
}

/**
 * LOS MOTIVOS QUE LAS FUENTES NO DAN (S25, fila B.1 de la pasada del 024). «¿Por qué salió
 * de Vesting?» salía con «pues consideró que había cumplido…» y «driven by the desire to hand
 * over…»: el corpus cuenta CÓMO cerró la etapa, no un motivo, y el modelo infiere causas aunque
 * hable en tercera persona. No se mide bien por léxico: es una lista CERRADA de marcas causales
 * y de intención (un piso, no un techo) para que quien lee el informe sepa dónde mirar; la
 * lectura de si el motivo está en las fuentes es humana (el STOP del sprint).
 */
/** Una palabra entera, con Unicode: `\b` de JS no ve «ó» como letra y «consideró» no cerraba. */
const entera = (patron: string) =>
  new RegExp(`(?<![\\p{L}\\p{N}])(?:${patron})(?![\\p{L}\\p{N}])`, "giu");

const MOTIVO_ES: RegExp[] = [
  "pues\\s+(?:consideró|decidió|quería|buscaba|prefirió|le\\s+interesaba)",
  "(?:motivad[oa]|impulsad[oa])\\s+por",
  "por\\s+(?:el\\s+)?(?:deseo|interés|afán|objetivo)\\s+de",
  "(?:decidió|quería|buscaba|deseaba|prefirió|optó\\s+por)\\s+(?:salir|dejar|retirarse|irse|pasar|seguir|dedicarse|avanzar|buscar|explorar)",
  "para\\s+(?:poder\\s+)?(?:dedicarse|buscar|explorar|enfocarse|pasar\\s+a)",
  "nuev[oa]s?\\s+(?:retos?|desafíos?|oportunidades|etapas?)",
  "próxim[oa]\\s+(?:etapa|fase|paso)",
  "Esta\\s+decisión\\s+le\\s+permitió",
  "(?:su|la)\\s+(?:salida|decisión)\\s+(?:se\\s+debió|obedeció|respondió|fue\\s+motivada)",
].map(entera);
const MOTIVO_EN: RegExp[] = [
  "driven\\s+by",
  "the\\s+desire\\s+to",
  "while\\s+he\\s+pursued",
  "next\\s+(?:phase|chapter|step)",
  "new\\s+(?:challenges|opportunities|ventures)",
  "(?:decided|chose|wanted|wished|aimed|sought|preferred)\\s+to\\s+(?:leave|move|pursue|pass|focus|explore|transition|step)",
  "in\\s+order\\s+to\\s+(?:pursue|move\\s+on|focus|explore)",
  "so\\s+(?:that\\s+)?he\\s+could\\s+(?:pursue|move|focus|explore)",
  "strategic\\s+(?:exit|departure|move)",
  "allowing\\s+him\\s+to\\s+transition",
].map(entera);

/** Las marcas causales o de intención que hay en un texto, en el orden en que aparecen. */
export function motivoAtribuido(texto: string, idioma: Idioma): string[] {
  const res = idioma === "es" ? MOTIVO_ES : MOTIVO_EN;
  const sinRehuso = texto.replace(RESPUESTA_REHUSO[idioma], " ");
  return res
    .flatMap((re) => [...sinRehuso.matchAll(re)])
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((m) => m[0]);
}

export type Marcas = {
  /** Voz del dueño («mi», «hice», «escríbeme»…). */
  voz: string[];
  /** Frases que afirman una ausencia. */
  ausencia: string[];
  /** Marcas causales o de intención («driven by», «pues consideró»): ¿el motivo está en las fuentes? */
  motivos: string[];
  /** Números `[n]` que la respuesta cita, y los que citó sin que existieran. */
  citadas: number[];
  inventadas: number[];
  /** ¿Menciona el AI-102 o el DP-100? (la pregunta por las certificaciones no debe narrarlos). */
  credencialesSinObtener: string[];
  /** ¿Nombra Foundry sin la forma completa la primera vez? */
  foundrySinForma: boolean;
};

export function marcarRespuesta(
  texto: string,
  idioma: Idioma,
  recuperadas: number,
): Marcas {
  const citadas = [...numerosCitados(texto)].sort((a, b) => a - b);
  const credenciales = [...texto.matchAll(/\b(AI-?102|DP-?100)\b/gi)].map(
    (m) => m[0],
  );
  const primeraFoundry = texto.search(/\bFoundry\b/);
  const forma = texto.search(/Microsoft Foundry \(antes Azure AI Foundry\)/);
  return {
    voz: vozDelDueno(texto, idioma).map((h) => h.termino),
    ausencia: ausenciaAfirmada(texto, idioma),
    motivos: motivoAtribuido(texto, idioma),
    citadas: citadas.filter((n) => n >= 1 && n <= recuperadas),
    inventadas: citadas.filter((n) => n < 1 || n > recuperadas),
    credencialesSinObtener: credenciales,
    // «Microsoft » mide 10 caracteres: si la forma completa va primero, su «Foundry» cae en forma + 10.
    foundrySinForma:
      primeraFoundry !== -1 && (forma === -1 || primeraFoundry < forma + 10),
  };
}
