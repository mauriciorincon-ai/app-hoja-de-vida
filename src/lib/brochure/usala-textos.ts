import { HITOS_CONOCIDOS } from "@/lib/vitrina/ficha-tecnica/hitos";

/**
 * LOS TEXTOS DE «ÚSALA» QUE NO SON DEL BROCHURE (S30): los mismos que ya dicen la ficha, la lista de espera,
 * el roadmap y la propuesta, para que el sitio diga una sola cosa. Llegan ya en el idioma de la página; los
 * formularios traen los suyos del layout. Puro: recibe cómo traducir cada namespace (el servidor, con
 * `getTranslations`; las pruebas, con `createTranslator`).
 */
export type TextosDeUsala = {
  acceso: string;
  listaTitulo: string;
  listaLinea: string;
  /** El rótulo del botón de la lista de espera («Avísame cuando abra»). */
  cta: string;
  roadmapEyebrow: string;
  roadmapTitulo: string;
  roadmapSubtitulo: string;
  propuestaEyebrow: string;
  verSimulacion: string;
  dondeTitulo: string;
  dondeSub: string;
  dondeNota: string;
  /** El rótulo de cada hito conocido; uno que no se conoce se pinta tal cual. */
  hitos: Record<string, string>;
  volverApps: string;
  appAnterior: string;
  appSiguiente: string;
};

type Namespace =
  | "vitrina"
  | "fichaTecnica"
  | "listaDeEspera"
  | "roadmap"
  | "propuesta";

export function armarTextosDeUsala(
  de: (namespace: Namespace) => (clave: string) => string,
): TextosDeUsala {
  const v = de("vitrina");
  const f = de("fichaTecnica");
  return {
    acceso: v("acceso"),
    listaTitulo: de("listaDeEspera")("titulo"),
    listaLinea: v("listaDeEsperaLinea"),
    cta: v("cta"),
    roadmapEyebrow: de("roadmap")("eyebrow"),
    roadmapTitulo: de("roadmap")("titulo"),
    roadmapSubtitulo: de("roadmap")("subtitulo"),
    propuestaEyebrow: de("propuesta")("eyebrow"),
    verSimulacion: f("verSimulacion"),
    dondeTitulo: f("s05"),
    dondeSub: f("s05sub"),
    dondeNota: f("cierreNota"),
    hitos: Object.fromEntries(
      [...HITOS_CONOCIDOS].map((k) => [k, f(`hitos.${k}`)]),
    ),
    volverApps: v("volverApps"),
    appAnterior: v("appAnterior"),
    appSiguiente: v("appSiguiente"),
  };
}
