/**
 * LA VOZ DE «MÉTODOS» (S14, 2026-10-18). Motor puro.
 *
 * Las piezas de la sección son **publicaciones profesionales en voz
 * impersonal**: ni primera persona ni la palabra «entrevista» en lo publicado,
 * ni en sus textos de interfaz, en español y en inglés. Los documentos a fondo
 * SÍ hablan en primera persona (representan al dueño); el chat, desde el S24,
 * habla en tercera (`lib/ia/voz-del-dueno.ts` vigila esa voz, con otro criterio:
 * el asistente puede hablar de sí mismo); este módulo solo juzga `data/metodo/` y la sección `metodo` del diccionario.
 *
 * Qué detecta, a propósito acotado (un falso positivo en un texto publicado
 * es peor que uno que se escape: «diseño» también es un sustantivo):
 *  · pronombres y posesivos de primera persona: «yo, mi, me, nos, nuestro…» y
 *    «I, my, me, we, our, us…», con sus contracciones inglesas;
 *  · «entrevista» e «interview» (el origen del pedido, no el tono);
 *  · una lista CERRADA de verbos que las piezas conjugaban en primera persona
 *    (español: la persona vive en el verbo y ningún pronombre la delata).
 *
 * La lista de verbos es un PISO, no un techo: atrapa la regresión a las
 * formas que ya se vieron, no todo verbo posible. Lo demás lo lee quien
 * audita. Solo se juzga lo que el autor escribe (`{ es, en }`): el título y el
 * editor de una fuente citada son de un tercero y no se editan. Y lo que va
 * ENTRE COMILLAS («…», “…”) es la voz de otro —la respuesta fija del chat,
 * «eso se me escapa»; una cita—, así que tampoco se juzga.
 */

export type Idioma = "es" | "en";
export type ClaseDeHallazgo = "persona" | "verbo" | "entrevista";
export type Hallazgo = { termino: string; clase: ClaseDeHallazgo };

/** Una palabra entera: ni letra ni número a ningún lado (Unicode). */
const solo = (alternativas: string, flags = "giu", extra = "") =>
  new RegExp(`(?<![\\p{L}\\p{N}${extra}])(?:${alternativas})(?![\\p{L}\\p{N}])`, flags);

const PERSONA_ES = solo(
  "yo|mi|mis|mío|mía|míos|mías|me|nos|nuestro|nuestra|nuestros|nuestras|conmigo",
);

/** Inglés: la «I» solo en mayúscula (no «i.e.», no «I/O»); el resto sin distinguir. */
const PERSONA_EN_I = new RegExp(
  "(?<![\\p{L}\\p{N}'’.-])I(?:['’](?:m|ve|d|ll))?(?![\\p{L}\\p{N}/])",
  "gu",
);
const PERSONA_EN = new RegExp(
  "(?<![\\p{L}\\p{N}'’-])(?:my|me|mine|myself|we(?:['’](?:re|ve|ll|d))?|our|ours|ourselves|us)(?![\\p{L}\\p{N}$])",
  "giu",
);

/** Verbos en primera persona que las piezas usaron; ver el aviso del encabezado. */
const VERBOS_ES = solo(
  [
    // pretérito
    "diseñé|medí|comparé|usé|implementé|conecté|construí|ajusté|estudié|definí|documenté|validé|hice|obtuve",
    // presente
    "hago|versiono|construyo|empiezo|separo|sigo|conozco|pido|pongo|mido|miro|digo|prefiero|estructuro|llevo",
    "guardo|doy|evalúo|reservo|presento|mantengo|tengo|puedo|sé",
    // Sin condicionales («haría», «usaría»): son idénticos en tercera persona y se lee la pieza.
    // Sin «reparto»: es también un sustantivo («el reparto del trabajo»).
    // «he hecho», «he operado»: el auxiliar solo, seguido de un participio
    "he(?= \\p{L}+(?:ado|ido|to|cho)(?![\\p{L}]))",
  ].join("|"),
);

const ENTREVISTA = solo(
  "entrevistas?|entrevistad[oa]s?|entrevistador(?:a|es|as)?|entrevistar|interviews?|interviewers?|interviewing|interviewed",
);

/**
 * Lo citado entre comillas («…», “…”) se borra antes de juzgar: es la voz de otro. Solo si es
 * una cita CORTA (≤ 120 caracteres: un título, una frase de la fuente); un párrafo entero entre
 * comillas ya no se vuelve invisible al gate (S14-B4).
 */
const TOPE_DE_CITA = 120;
const sinCitas = (texto: string) =>
  texto.replace(new RegExp(`«[^»]{0,${TOPE_DE_CITA}}»|“[^”]{0,${TOPE_DE_CITA}}”`, "g"), (c) => " ".repeat(c.length));

const recoger = (re: RegExp, texto: string, clase: ClaseDeHallazgo): Hallazgo[] =>
  [...texto.matchAll(re)].map((m) => ({ termino: m[0], clase }));

/** Lo que de primera persona o de «entrevista» hay en un texto, en el orden en que aparece. */
export function hallazgosDeVoz(textoCompleto: string, idioma: Idioma): Hallazgo[] {
  const texto = sinCitas(textoCompleto);
  const hallazgos =
    idioma === "es"
      ? [...recoger(PERSONA_ES, texto, "persona"), ...recoger(VERBOS_ES, texto, "verbo")]
      : [...recoger(PERSONA_EN_I, texto, "persona"), ...recoger(PERSONA_EN, texto, "persona")];
  return [...hallazgos, ...recoger(ENTREVISTA, texto, "entrevista")];
}

/** Un texto del autor y dónde está. */
export type TextoDelAutor = { ruta: string; idioma: Idioma; texto: string };

/**
 * Todo `{ es: "…", en: "…" }` de un dato, con su ruta (`bloques.2.fases.0.nota`):
 * lo que el autor escribe. Una cadena suelta (un enlace, una fecha, el título
 * de una fuente) no es texto del autor y no entra.
 */
export function textosDelAutor(valor: unknown, ruta = ""): TextoDelAutor[] {
  if (Array.isArray(valor)) return valor.flatMap((v, i) => textosDelAutor(v, ruta ? `${ruta}.${i}` : String(i)));
  if (valor && typeof valor === "object") {
    const o = valor as Record<string, unknown>;
    if (typeof o.es === "string" && typeof o.en === "string") {
      return [
        { ruta, idioma: "es", texto: o.es },
        { ruta, idioma: "en", texto: o.en },
      ];
    }
    return Object.entries(o).flatMap(([k, v]) => textosDelAutor(v, ruta ? `${ruta}.${k}` : k));
  }
  return [];
}

/** Cada cadena de un valor (el diccionario de un idioma no trae `{ es, en }`). */
export function cadenasConRuta(valor: unknown, ruta = ""): Array<{ ruta: string; texto: string }> {
  if (typeof valor === "string") return [{ ruta, texto: valor }];
  if (Array.isArray(valor)) return valor.flatMap((v, i) => cadenasConRuta(v, `${ruta}.${i}`));
  if (valor && typeof valor === "object")
    return Object.entries(valor as Record<string, unknown>).flatMap(([k, v]) =>
      cadenasConRuta(v, ruta ? `${ruta}.${k}` : k),
    );
  return [];
}

const describir = (hs: Hallazgo[]) =>
  [...new Set(hs.map((h) => `«${h.termino}»`))].join(", ");

/** Los textos de una pieza que rompen la voz: archivo, campo, idioma y lo que dicen. */
export function problemasDeVozEnPieza(archivo: string, pieza: unknown): string[] {
  return textosDelAutor(pieza).flatMap(({ ruta, idioma, texto }) => {
    const hs = hallazgosDeVoz(texto, idioma);
    return hs.length === 0
      ? []
      : [`${archivo}: ${ruta} (${idioma}): voz personal ${describir(hs)} — la sección es impersonal`];
  });
}

/** Lo mismo para una parte del diccionario (`messages/<idioma>.json › metodo`). */
export function problemasDeVozEnDiccionario(
  archivo: string,
  parte: unknown,
  idioma: Idioma,
  prefijo: string,
): string[] {
  return cadenasConRuta(parte).flatMap(({ ruta, texto }) => {
    const hs = hallazgosDeVoz(texto, idioma);
    return hs.length === 0
      ? []
      : [`${archivo}: ${prefijo}${ruta ? `.${ruta}` : ""} (${idioma}): voz personal ${describir(hs)} — la sección es impersonal`];
  });
}
