/**
 * LAS CIFRAS DE «MI MÉTODO» (S11) — ninguna cifra sin corpus.
 *
 * Una infografía dice dos clases de cifras sobre el dueño y su sitio, y las dos
 * se vigilan:
 *
 *   1. Las de «lo que hice» y las de la evidencia (bloque 8): salen de un
 *      documento del corpus que la pieza NOMBRA (`corpus: [slug]`). Antes solo
 *      se comprobaba que el archivo existiera; el documento podía cambiar su
 *      número y la pieza seguir diciendo el viejo, en una página que el chat cita.
 *      `problemasDeCifrasDelCorpus`: cada número del texto tiene que estar en el
 *      documento citado, en el mismo idioma.
 *   2. Las del SITIO (cuántas apps, agentes, piezas…): se derivan del disco, no
 *      de ningún documento; las juzga el motor de `a-fondo-coherencia.mjs` con
 *      `cifras-a-fondo.yaml`. `piezasComoDocumentos` da a ese motor la forma de
 *      documento que espera.
 *
 * Motores puros: reciben las piezas ya leídas (y un lector de documentos), así
 * que sus rojos se ejercen con piezas de juguete.
 */

/** Los números de un texto, sin separadores («99,5» y «99.5» son el mismo `995`; «1.633» es `1633`). */
export function numerosDe(texto) {
  return (String(texto ?? "").match(/\d+(?:[.,]\d+)*/g) ?? []).map((n) => n.replace(/[.,]/g, ""));
}

/**
 * Cada afirmación que se respalda en el corpus: un objeto con `corpus` (no
 * vacío) y un `texto` bilingüe, más el `nombre` de la evidencia. Devuelve la
 * ruta (para nombrar el campo), los slugs y los textos por idioma.
 */
export function afirmacionesConCorpus(pieza) {
  const salida = [];
  const recorrer = (valor, ruta) => {
    if (Array.isArray(valor)) return valor.forEach((v, i) => recorrer(v, [...ruta, i]));
    if (!valor || typeof valor !== "object") return;
    if (Array.isArray(valor.corpus) && valor.corpus.length > 0 && valor.texto) {
      const textos = { es: [valor.texto.es], en: [valor.texto.en] };
      if (valor.nombre?.es) {
        textos.es.push(valor.nombre.es);
        textos.en.push(valor.nombre.en);
      }
      salida.push({ ruta: ruta.join("."), corpus: valor.corpus, textos });
    }
    for (const [k, v] of Object.entries(valor)) recorrer(v, [...ruta, k]);
  };
  recorrer(pieza, []);
  return salida;
}

/**
 * Cada cifra de lo que la pieza dice haber hecho tiene que estar en el
 * documento que cita. `leerDoc(slug, locale)` devuelve el texto del documento
 * (o `undefined` si no existe: eso ya lo para el cargador, aquí se calla).
 */
export function problemasDeCifrasDelCorpus(piezas, leerDoc) {
  const problemas = [];
  for (const { archivo, pieza } of piezas) {
    for (const a of afirmacionesConCorpus(pieza)) {
      for (const locale of ["es", "en"]) {
        const docs = a.corpus.map((slug) => leerDoc(slug, locale)).filter((d) => d !== undefined);
        if (docs.length === 0) continue;
        const respaldo = new Set(docs.flatMap(numerosDe));
        for (const n of new Set(a.textos[locale].flatMap(numerosDe))) {
          if (!respaldo.has(n)) {
            problemas.push(
              `${archivo}: ${a.ruta} (${locale}): la cifra «${n}» no está en ${a.corpus.join(", ")}. ` +
                `Lo que hice sale del documento citado, con sus números: o el documento cambió o la pieza lo desmiente.`,
            );
          }
        }
      }
    }
  }
  return problemas;
}

/** Todo texto bilingüe de un valor, en el idioma dado, en el orden en que se lee. */
function textosDe(valor, locale, salida = []) {
  if (Array.isArray(valor)) valor.forEach((v) => textosDe(v, locale, salida));
  else if (valor && typeof valor === "object") {
    if (typeof valor.es === "string" && typeof valor.en === "string" && Object.keys(valor).length === 2) {
      salida.push(valor[locale]);
    } else for (const v of Object.values(valor)) textosDe(v, locale, salida);
  }
  return salida;
}

/**
 * Las piezas, con la forma de documento que espera el motor de cifras del
 * corpus (`{archivo, subsecciones: [{id, texto}]}`): una subsección por bloque.
 * Solo en español, como el corpus: los conceptos de `cifras-a-fondo.yaml` son
 * patrones en español; el inglés lo cubren las cifras gemelas del esquema.
 */
export function piezasComoDocumentos(piezas, locale = "es") {
  return piezas.map(({ archivo, pieza }) => ({
    archivo,
    subsecciones: (pieza.bloques ?? []).map((b) => ({
      id: `bloque-${b.n}`,
      texto: textosDe(b, locale).join("\n"),
    })),
  }));
}
