import { numerosCitados } from "@/lib/ia/fuentes";
import { RESPUESTA_REHUSO } from "@/lib/ia/rehuso";
import { vozDelDueno, type Idioma } from "@/lib/ia/voz-del-dueno";

/**
 * LAS MARCAS DE LA PASADA EN VIVO (S24). Detectores de lectura para el informe
 * `privado/pasada-en-vivo-s24.md`: dicen qué mirar en lo que el modelo REAL
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

export type Marcas = {
  /** Voz del dueño («mi», «hice», «escríbeme»…). */
  voz: string[];
  /** Frases que afirman una ausencia. */
  ausencia: string[];
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
  const credenciales = [...texto.matchAll(/\b(AI-?102|DP-?100)\b/gi)].map((m) => m[0]);
  const primeraFoundry = texto.search(/\bFoundry\b/);
  const forma = texto.search(/Microsoft Foundry \(antes Azure AI Foundry\)/);
  return {
    voz: vozDelDueno(texto, idioma).map((h) => h.termino),
    ausencia: ausenciaAfirmada(texto, idioma),
    citadas: citadas.filter((n) => n >= 1 && n <= recuperadas),
    inventadas: citadas.filter((n) => n < 1 || n > recuperadas),
    credencialesSinObtener: credenciales,
    // «Microsoft » mide 10 caracteres: si la forma completa va primero, su «Foundry» cae en forma + 10.
    foundrySinForma: primeraFoundry !== -1 && (forma === -1 || primeraFoundry < forma + 10),
  };
}
