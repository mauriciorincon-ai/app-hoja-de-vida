import type { Capturas } from "@/lib/vitrina/capturas";
import type { Complemento } from "@/lib/vitrina/ficha-tecnica/schema";
import type { BrochureExport, MetricaExport } from "@/lib/vitrina/schemas";
import {
  ACTORES,
  type Acento,
  type Contenido,
  type GrupoContenido,
} from "./contenido";
import { hitosDe, type Hito } from "@/lib/vitrina/ficha-tecnica/hitos";
import type { Flujo, TipoNodo } from "./flujo";

/**
 * EL MODELO DEL BROCHURE (S28): de la entrega de una app (export, capturas, complemento), su
 * contenido v2 si lo tiene, su configuración (`data/brochure.yaml`) y el idioma, arma la vista
 * completa de la página. Puro: sin I/O ni React; los componentes solo pintan lo que esto dice.
 *
 * Es el modelo de la maqueta aprobada (`referencias-ui/brochure/maqueta/plantilla.html`, «el modelo:
 * export + capturas + contenido v2»), con tres decisiones de esta casa:
 *
 *  1. **El 01 existe siempre.** Sin contenido v2, «Lo que cambia» trae solo «Para quién y por qué»,
 *     que sale del export; así la numeración de las doce páginas es la misma (01–05, y 2.1… en el mapa).
 *  2. **Toda cita dice «número · título del destino»**, y una cita cuyo destino no existe en esta
 *     página no se pinta (un bloque sin datos no se pinta).
 *  3. **Los actores se nombran, nunca solo con color.** Los seis (`ACTORES`: dueño, comprador,
 *     equipo, la app, quien visita y el proveedor) con sus etiquetas; los del proceso de las otras apps, con el nombre de su carril.
 *
 * Todo texto llega ya en el idioma de la página: el del contenido v2 de su `{ es, en }`, y el del
 * export —que el contrato v1 trae solo en español— del bloque `en` del v2 cuando lo hay.
 */

export type Locale = "es" | "en";

/** El traductor del namespace `brochure` (el `t` de next-intl, o uno de prueba). */
export type Textos = (
  clave: string,
  valores?: Record<string, string | number>,
) => string;

export type EntradaBrochure = {
  slug: string;
  /** CV Viva o su chat: no son apps del Portafolio (sin lista de espera, sin «datos sintéticos»). */
  casa: boolean;
  locale: Locale;
  export: BrochureExport;
  capturas: Capturas;
  complemento: Complemento;
  contenido?: Contenido;
  config: {
    acento: Acento;
    datos_sinteticos: boolean;
    ejemplos_busqueda?: { es: string; en: string };
  };
  /** El nombre en el idioma de la página (la casa lo toma de `data/apps.yaml`). */
  nombre?: string;
  /** La URL de la carpeta de sus capturas (la de `public/vitrina/<slug>`). */
  urlCapturas: string;
  /** Lo de «Úsala» que sale del Portafolio y no de la entrega de la app (S30). Sin él, solo la propia app. */
  usala?: DatosDeUsala;
  t: Textos;
};

/** Una app del Portafolio con su nombre oficial. */
export type AppDelPortafolio = { slug: string; nombre: string };

/**
 * Lo que «Úsala» toma del Portafolio (S30): las apps del selector de la lista de espera y las vecinas
 * (los dos en el orden del escaparate: profesionales y después personales), y si la app tiene simulación.
 */
export type DatosDeUsala = {
  apps: AppDelPortafolio[];
  anterior?: AppDelPortafolio;
  siguiente?: AppDelPortafolio;
  simulacion: boolean;
};

export type Fuente = "medido" | "calculada" | "declarado" | "estimacion";

/** Un salto dentro de la página: a una sección y, si hay, a un elemento de ella. */
export type Cita = { texto: string; sec: string; el?: string; previa?: string };

export type Pantalla = {
  id: string;
  src: string;
  pie: string;
  nombre: string;
  queHace: string;
  grupo: number;
  /** «2.4 · Panel del equipo…»: el rótulo del capítulo al que pertenece. */
  rotuloGrupo: string;
};

export type Seccion = {
  id: string;
  n: string;
  corto: string;
  titulo: string;
  sub: boolean;
};

export type Cifra = {
  clave: string;
  numero: string;
  prefijo?: string;
  sufijo?: string;
  etiqueta: string;
  fuente: Fuente;
  explica: string;
};

export type Loseta = {
  orden: number;
  n: string;
  nombre: string;
  linea: string;
  estrella: boolean;
  icono: string;
  imagen?: string;
  nFuncionalidades: number;
  nPantallas: number;
};

export type NodoVista = {
  id: string;
  tipo: TipoNodo;
  texto: string;
  /** Clase de color del actor (`a-dueno`, `a-x1`…) y su nombre; vacío en inicio y fin. */
  actor?: { clase: string; nombre: string };
  /** La funcionalidad cuya pantalla muestra la caja, si la tiene. */
  pantalla?: string;
  nota?: number;
  aria: string;
};

export type FlujoVista = {
  clave: string;
  titulo: string;
  region: string;
  flujo: Flujo;
  nodos: NodoVista[];
  actores: { clase: string; nombre: string }[];
};

export type Afirmacion = { texto: string; cita?: Cita };

export type FichaVista = {
  id: string;
  tipo: "concepto" | "diferencia" | "decision";
  tipoNombre: string;
  pregunta: string;
  respuesta: string;
  lados: { titulo: string; texto: string }[];
  cita?: Cita;
};

export type PiezaVista = {
  id: string;
  nombre: string;
  queHace: string;
  captura?: { src: string; pie: string };
};

export type Capitulo = {
  id: string;
  n: string;
  orden: number;
  nombre: string;
  linea: string;
  estrella: boolean;
  icono: string;
  miniaturas: string[];
  nFuncionalidades: number;
  queResuelve: string;
  teSirve: Afirmacion[];
  noEs: Afirmacion[];
  flujo?: FlujoVista;
  piezas: PiezaVista[];
  fichas: FichaVista[];
  tiposFicha: { tipo: FichaVista["tipo"]; nombre: string }[];
  siguiente?: { orden: number; rotulo: string };
};

export type VistaBrochure = {
  slug: string;
  casa: boolean;
  lang: Locale;
  /** En inglés y sin bloque `en` del contenido v2: el texto de la página sale del export, en español. */
  textoEnEs: boolean;
  nombre: string;
  inicial: string;
  acento: Acento;
  datosSinteticos: boolean;
  buscarPh: string;
  secciones: Seccion[];
  pantallas: Pantalla[];
  portada: {
    chips: string[];
    titular: { antes: string; resalta?: string; despues: string };
    intro: string;
    hero: Pantalla[];
    tras: Pantalla[];
    insignias: { simbolo: string; texto: string }[];
    cifras: Cifra[];
    rotuloCinta: string;
  };
  antes: {
    titulo: string;
    rotuloAntes: string;
    rotuloDespues: string;
    prueba?: {
      antes: string;
      despues: string;
      texto: string;
      fuente: Fuente;
      detalle?: string;
      cita?: Cita;
    };
    pares: { antes: string; despues: string; mini?: Pantalla }[];
    servicios?: {
      titulo: string;
      texto: string;
      fuente: Fuente;
      nota: string;
      items: { titulo: string; texto: string; cita?: Cita }[];
    };
    paraQuienTitulo: string;
    paraQuien: string;
    diferencial: string;
  };
  mapa: {
    intro: string;
    capas: { nombre: string; sub?: string; losetas: Loseta[] }[];
    transversal?: {
      nombre: string;
      sub?: string;
      losetas: Loseta[];
      rasgos: (Afirmacion & { titulo: string })[];
    };
  };
  capitulos: Capitulo[];
  proceso?: {
    titulo: string;
    flujo: FlujoVista;
    notas: { n: number; paso: string; texto: string }[];
  };
  metodo: {
    cifras: Cifra[];
    stack: { nombre: string; papel: string }[];
    privacidad: string[];
    nunca: string[];
    limites: string[];
  };
  cierre: {
    titulo: string;
    razon: string;
    pie: string;
    /** La casa (CV Viva y su chat no son apps): «Escríbeme» al contacto, sin lista de espera ni roadmap. */
    contacto?: { texto: string; href: string };
    /** Las apps con simulación: «Ver la simulación →». */
    simulacion?: { href: string };
    /** Las apps: la lista de espera con esta app ya elegida, y las apps del selector. */
    lista?: { appInicial: string; apps: AppDelPortafolio[] };
    /** Las apps con ideas en su roadmap: el roadmap votable de ESTA app. */
    roadmap?: {
      app: string;
      nombre: string;
      features: { feature: string; titulo: string; descripcion: string }[];
    };
    /** Las apps: «¿Qué le falta a <app>?». */
    propuesta?: { app: string; nombre: string };
    /** «Dónde está»: los hitos de la app, o de la casa. */
    hitos: Hito[];
    /** La app anterior y la siguiente del escaparate (solo las apps); sus rutas sin idioma. */
    vecinas: { anterior?: Vecina; siguiente?: Vecina };
  };
};

export type Vecina = { nombre: string; href: string };

/** Los actores con nombre y color propios (los de la maqueta, más `visita` y `proveedor` desde el S30). */
const ACTORES_MAQUETA = ACTORES;

/**
 * ¿La página en este idioma lleva su texto en español? Sí cuando se pide en inglés y la app no trae
 * el bloque `en` del contenido v2 (las once sin v2 y las dos de la casa): el export es solo español.
 * La portada lo avisa y la metadata no pasa el tagline español como descripción de una página inglesa.
 */
export const textoEnEspanol = (
  locale: Locale,
  contenido?: Partial<Contenido>,
): boolean => locale === "en" && !contenido?.en;

export function armarBrochure(e: EntradaBrochure): VistaBrochure {
  const { t, locale } = e;
  const E = e.export;
  const C: Partial<Contenido> = e.contenido ?? {};
  const K = e.complemento;
  const EN = locale === "en" ? C.en : undefined;
  const T = (o?: { es: string; en: string }) => (o ? o[locale] : "");
  const nf = new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
    maximumFractionDigits: 2,
  });

  const grupos = [...E.funcionalidades.grupos].sort(
    (a, b) => a.orden - b.orden,
  );
  const v2g = new Map<number, GrupoContenido>(
    (C.grupos ?? []).map((g) => [g.orden, g]),
  );
  const capPor = new Map(e.capturas.capturas.map((c) => [c.funcionalidad, c]));
  const featPor = new Map<
    string,
    {
      f: (typeof grupos)[number]["features"][number];
      g: (typeof grupos)[number];
    }
  >();
  for (const g of grupos)
    for (const f of g.features) featPor.set(f.id, { f, g });

  const nombreF = (f: { id: string; nombre: string }) =>
    EN?.features[f.id]?.nombre ?? f.nombre;
  const queHaceF = (f: { id: string; que_hace: string }) =>
    EN?.features[f.id]?.que_hace ?? f.que_hace;
  const nombreG = (g: { orden: number; nombre: string }) =>
    EN?.grupos[String(g.orden)]?.nombre ?? g.nombre;
  const lineaG = (g: { orden: number; linea: string }) =>
    EN?.grupos[String(g.orden)]?.linea ?? g.linea;
  const promesa = (k: "tagline" | "intro" | "para_quien" | "diferencial") =>
    EN?.promesa[k] ?? E.promesa[k];
  const metrica = (clave: string) => E.metricas.find((m) => m.clave === clave);
  const etiquetaM = (m: MetricaExport) =>
    EN?.metricas[m.clave]?.etiqueta ?? m.etiqueta;
  const detalleM = (m: MetricaExport) =>
    EN?.metricas[m.clave]?.detalle ?? m.detalle;
  // El «¿de dónde sale?» en lenguaje llano (contrato v2); sin él, el detalle del export
  const explicaM = (m: MetricaExport) =>
    T(C.metricas_texto?.[m.clave]) || detalleM(m);
  const src = (archivo: string) => `${e.urlCapturas}/${archivo}`;
  const NOMBRE = e.nombre ?? E.app.nombre;

  // ── secciones: 01–05 y los grupos como 2.1… ───────────────────────────────────────────
  const A = C.antes_despues;
  const base: Omit<Seccion, "n">[] = [
    {
      id: "antes",
      corto: T(A?.corto) || t("antes"),
      titulo: T(A?.titulo) || t("antes"),
      sub: false,
    },
    { id: "mapa", corto: t("mapa"), titulo: t("mapa"), sub: false },
  ];
  if (K.proceso)
    base.push({
      id: "proceso",
      corto: t("proceso"),
      titulo: EN?.complemento.proceso?.titulo ?? K.proceso.titulo,
      sub: false,
    });
  base.push(
    { id: "metodo", corto: t("metodo"), titulo: t("metodo"), sub: false },
    {
      id: "cierre",
      corto: t("cierre"),
      titulo: e.casa ? t("cierreCasaT") : t("cierreT"),
      sub: false,
    },
  );
  const numeradas: Seccion[] = base.map((s, i) => ({
    ...s,
    n: String(i + 1).padStart(2, "0"),
  }));
  const kMapa = numeradas.findIndex((s) => s.id === "mapa");
  const nMapa = kMapa + 1;
  const subs: Seccion[] = grupos.map((g, i) => ({
    id: `g${g.orden}`,
    n: `${nMapa}.${i + 1}`,
    corto: nombreG(g),
    titulo: nombreG(g),
    sub: true,
  }));
  const secciones = [
    ...numeradas.slice(0, kMapa + 1),
    ...subs,
    ...numeradas.slice(kMapa + 1),
  ];
  const sec = (id: string) => secciones.find((s) => s.id === id);
  const numDe = (id: string) => sec(id)?.n ?? "";
  const rotulo = (id: string) => {
    const s = sec(id);
    return s ? `${s.n} · ${s.corto}` : "";
  };

  // ── piezas pequeñas ────────────────────────────────────────────────────────────────────
  const valor = (
    m: MetricaExport,
  ): Pick<Cifra, "numero" | "prefijo" | "sufijo"> => {
    if (m.unidad === "%") return { numero: nf.format(m.valor), sufijo: "%" };
    if (m.unidad === "USD")
      return { numero: nf.format(m.valor), prefijo: "US$" };
    if (m.unidad === "bytes")
      return { numero: nf.format(Math.round(m.valor / 1024)), sufijo: "KB" };
    return { numero: nf.format(m.valor) };
  };
  const cifra = (m: MetricaExport): Cifra => ({
    clave: m.clave,
    ...valor(m),
    etiqueta: etiquetaM(m),
    fuente: m.fuente,
    explica: explicaM(m),
  });

  const paraQuienTitulo = T(A?.para_quien_titulo) || t("paraQuienTitulo");
  const nunca = (EN?.complemento.nunca ?? K.nunca).filter(Boolean);
  const limites = (EN?.complemento.limites ?? K.limites).filter(Boolean);
  const destinosClave: Record<
    string,
    [string, string | undefined, string] | undefined
  > = {
    promesa: ["antes", "promesa", paraQuienTitulo],
    privacidad: ["metodo", "m-privacidad", t("privacidad")],
    limites: limites.length ? ["metodo", "m-limites", t("limites")] : undefined,
    nunca: nunca.length ? ["metodo", "m-nunca", t("nunca")] : undefined,
    stack: ["metodo", "m-stack", t("stackT")],
    metricas: ["metodo", "m-cifras", t("cifras")],
    proceso: K.proceso ? ["proceso", undefined, t("proceso")] : undefined,
  };
  /** Una cita dice a dónde lleva con el mismo número y el mismo título que tiene allá el destino. */
  const cita = (fuente?: string, clave?: string): Cita | undefined => {
    if (!fuente) return undefined;
    const x = featPor.get(fuente);
    if (x)
      return {
        texto: `${numDe(`g${x.g.orden}`)} · ${nombreF(x.f)}`,
        sec: `g${x.g.orden}`,
        el: `p-${fuente}`,
        ...(capPor.has(fuente) ? { previa: fuente } : {}),
      };
    const m = fuente === "metricas" && clave ? metrica(clave) : undefined;
    if (m)
      return {
        texto: `${numDe("metodo")} · ${etiquetaM(m)}`,
        sec: "metodo",
        el: `mt-${clave}`,
      };
    const d = destinosClave[fuente];
    if (!d) return undefined;
    return {
      texto: `${numDe(d[0])} · ${d[2] || rotulo(d[0])}`,
      sec: d[0],
      ...(d[1] ? { el: d[1] } : {}),
    };
  };

  // ── las pantallas ──────────────────────────────────────────────────────────────────────
  const pantallas: Pantalla[] = [];
  for (const g of grupos)
    for (const f of g.features) {
      const c = capPor.get(f.id);
      if (c)
        pantallas.push({
          id: f.id,
          src: src(c.archivo),
          pie: c.pie[locale],
          nombre: nombreF(f),
          queHace: queHaceF(f),
          grupo: g.orden,
          rotuloGrupo: `${numDe(`g${g.orden}`)} · ${nombreG(g)}`,
        });
    }
  const pantallaDe = (id: string) => pantallas.find((p) => p.id === id);

  // ── 00 · la portada ────────────────────────────────────────────────────────────────────
  const P = C.portada;
  const elegidas = (P?.pantallas ?? [])
    .map(pantallaDe)
    .filter((p): p is Pantalla => !!p);
  const hero = elegidas.length ? elegidas : pantallas.slice(0, 3);
  const tag = promesa("tagline");
  const res = T(P?.resalta);
  const i = res ? tag.indexOf(res) : -1;
  const titular =
    i >= 0
      ? {
          antes: tag.slice(0, i),
          resalta: res,
          despues: tag.slice(i + res.length),
        }
      : { antes: tag, despues: "" };
  const reales = t("reales", { n: pantallas.length });

  // ── 02 · el mapa ───────────────────────────────────────────────────────────────────────
  const loseta = (g: (typeof grupos)[number]): Loseta => {
    const conCap = g.features.filter((f) => capPor.has(f.id));
    return {
      orden: g.orden,
      n: numDe(`g${g.orden}`),
      nombre: nombreG(g),
      linea: lineaG(g),
      estrella: g.estrella,
      icono: C.iconos?.[String(g.orden)] ?? "pantalla",
      ...(conCap[0] ? { imagen: src(capPor.get(conCap[0].id)!.archivo) } : {}),
      nFuncionalidades: g.features.length,
      nPantallas: conCap.length,
    };
  };
  const porOrden = new Map(grupos.map((g) => [g.orden, g]));
  const losetasDe = (ordenes: number[]) =>
    ordenes
      .map((o) => porOrden.get(o))
      .filter((g): g is (typeof grupos)[number] => !!g)
      .map(loseta);
  const M = C.mapa;
  const usados = new Set([
    ...(M?.capas ?? []).flatMap((c) => c.grupos),
    ...(M?.transversal?.grupos ?? []),
  ]);
  const capas: VistaBrochure["mapa"]["capas"] = M?.capas.length
    ? M.capas.map((c) => ({
        nombre: T(c.nombre),
        sub: T(c.sub) || undefined,
        losetas: losetasDe(c.grupos),
      }))
    : [{ nombre: t("mapa"), losetas: grupos.map(loseta) }];
  const sueltos = grupos.filter((g) => !usados.has(g.orden));
  if (M?.capas.length && sueltos.length)
    capas.push({ nombre: "·", losetas: sueltos.map(loseta) });
  const Tv = M?.transversal;

  // ── los actores y los flujos ───────────────────────────────────────────────────────────
  const nombreDeActorMaqueta: Record<(typeof ACTORES_MAQUETA)[number], string> =
    {
      dueno: t("actorDueno"),
      comprador: t("actorComprador"),
      equipo: t("actorEquipo"),
      app: NOMBRE,
      visita: t("actorVisita"),
      proveedor: t("actorProveedor"),
    };
  const tipoNombre: Record<TipoNodo, string> = {
    inicio: t("nodoInicio"),
    tarea: t("nodoTarea"),
    decision: t("nodoDecision"),
    paralelo: t("nodoParalelo"),
    fin: t("nodoFin"),
  };
  const actoresDe = (ids: string[], nombreDe: (id: string) => string) => {
    const unicos = [...new Set(ids.filter(Boolean))];
    let otro = 0;
    const clase = new Map(
      unicos.map((id) => [
        id,
        (ACTORES_MAQUETA as readonly string[]).includes(id)
          ? `a-${id}`
          : `a-x${otro++ % 4}`,
      ]),
    );
    return {
      lista: unicos.map((id) => ({
        clase: clase.get(id)!,
        nombre: nombreDe(id),
      })),
      clase,
    };
  };
  const nodoVista = (
    n: { id: string; tipo: TipoNodo; texto: string; actor?: string },
    actores: ReturnType<typeof actoresDe>,
    nombreDe: (id: string) => string,
    pantalla?: string,
    nota?: number,
  ): NodoVista => {
    const conActor =
      n.actor && n.texto && !["inicio", "fin", "paralelo"].includes(n.tipo);
    const nombreActor = n.actor ? nombreDe(n.actor) : "";
    return {
      id: n.id,
      tipo: n.tipo,
      texto: n.texto,
      ...(conActor
        ? {
            actor: { clase: actores.clase.get(n.actor!)!, nombre: nombreActor },
          }
        : {}),
      ...(pantalla && capPor.has(pantalla) ? { pantalla } : {}),
      ...(nota ? { nota } : {}),
      aria: `${tipoNombre[n.tipo]}${n.actor && n.tipo !== "fin" ? ` · ${nombreActor}` : ""}${n.texto ? `: ${n.texto}` : ""}`,
    };
  };

  // ── 2.1… · los capítulos ───────────────────────────────────────────────────────────────
  const tiposFicha = {
    concepto: t("tipoConcepto"),
    diferencia: t("tipoDiferencia"),
    decision: t("tipoDecision"),
  };
  const capitulos: Capitulo[] = grupos.map((g, k) => {
    const v = v2g.get(g.orden);
    const conCap = g.features.filter((f) => capPor.has(f.id));
    const sig = grupos[k + 1];
    let flujo: FlujoVista | undefined;
    if (v?.flujo) {
      const nombreDe = (a: string) =>
        nombreDeActorMaqueta[a as (typeof ACTORES_MAQUETA)[number]] ?? a;
      const actores = actoresDe(
        v.flujo.nodos.map((n) => n.actor),
        nombreDe,
      );
      const titulo = T(v.flujo.titulo);
      flujo = {
        clave: `g${g.orden}`,
        titulo,
        region: t("regionFlujo", { titulo }),
        flujo: {
          nodos: v.flujo.nodos.map((n) => ({
            id: n.id,
            tipo: n.tipo,
            texto: T(n.texto),
          })),
          aristas: v.flujo.aristas.map((a) => ({
            de: a.de,
            a: a.a,
            etq: T(a.etiqueta),
            vuelta: !!a.vuelta,
          })),
        },
        nodos: v.flujo.nodos.map((n) =>
          nodoVista(
            { id: n.id, tipo: n.tipo, texto: T(n.texto), actor: n.actor },
            actores,
            nombreDe,
            n.funcionalidad,
          ),
        ),
        actores: actores.lista,
      };
    }
    const fichas: FichaVista[] = (v?.fichas ?? []).map((f, j) => ({
      id: `f-${g.orden}-${j}`,
      tipo: f.tipo,
      tipoNombre: tiposFicha[f.tipo],
      pregunta: T(f.pregunta),
      respuesta: T(f.respuesta),
      lados: (f.lados ?? []).map((l) => ({
        titulo: T(l.titulo),
        texto: T(l.texto),
      })),
      ...(cita(f.fuente) ? { cita: cita(f.fuente) } : {}),
    }));
    const afirmar = (x: {
      texto: { es: string; en: string };
      fuente: string;
    }): Afirmacion => ({
      texto: T(x.texto),
      ...(cita(x.fuente) ? { cita: cita(x.fuente) } : {}),
    });
    return {
      id: `g${g.orden}`,
      n: numDe(`g${g.orden}`),
      orden: g.orden,
      nombre: nombreG(g),
      linea: lineaG(g),
      estrella: g.estrella,
      icono: C.iconos?.[String(g.orden)] ?? "pantalla",
      miniaturas: conCap.slice(0, 4).map((f) => src(capPor.get(f.id)!.archivo)),
      nFuncionalidades: g.features.length,
      queResuelve: T(v?.que_resuelve) || lineaG(g),
      teSirve: (v?.te_sirve ?? []).map(afirmar),
      noEs: (v?.no_es ?? []).map(afirmar),
      ...(flujo ? { flujo } : {}),
      piezas: g.features.map((f) => {
        const c = capPor.get(f.id);
        return {
          id: f.id,
          nombre: nombreF(f),
          queHace: queHaceF(f),
          ...(c
            ? { captura: { src: src(c.archivo), pie: c.pie[locale] } }
            : {}),
        };
      }),
      fichas,
      tiposFicha: (["concepto", "diferencia", "decision"] as const)
        .filter((tp) => fichas.some((f) => f.tipo === tp))
        .map((tp) => ({ tipo: tp, nombre: tiposFicha[tp] })),
      ...(sig
        ? { siguiente: { orden: sig.orden, rotulo: rotulo(`g${sig.orden}`) } }
        : {}),
    };
  });

  // ── de punta a punta ───────────────────────────────────────────────────────────────────
  let proceso: VistaBrochure["proceso"];
  if (K.proceso) {
    const Pr = K.proceso;
    const ENp = EN?.complemento.proceso;
    const textoPaso = (p: { id: string; texto: string }) =>
      ENp?.pasos[p.id] ?? p.texto;
    const carril = new Map(
      Pr.carriles.map((c) => [c.id, ENp?.carriles[c.id] ?? c.nombre]),
    );
    const nombreDe = (id: string) =>
      nombreDeActorMaqueta[id as (typeof ACTORES_MAQUETA)[number]] ??
      carril.get(id) ??
      id;
    const actores = actoresDe(
      Pr.pasos.map((p) => p.carril),
      nombreDe,
    );
    const notas = Pr.anotaciones.map((a, j) => ({
      n: j + 1,
      id: a.paso,
      paso: textoPaso(
        Pr.pasos.find((p) => p.id === a.paso) ?? { id: a.paso, texto: "" },
      ),
      texto: ENp?.anotaciones[a.paso] ?? a.texto,
    }));
    const pantallaDePaso = C.proceso_pantallas ?? {};
    const titulo = EN?.complemento.proceso?.titulo ?? Pr.titulo;
    proceso = {
      titulo,
      flujo: {
        clave: "proceso",
        titulo,
        region: t("regionFlujo", { titulo }),
        flujo: {
          nodos: Pr.pasos.map((p) => ({
            id: p.id,
            tipo: p.tipo,
            texto: textoPaso(p),
          })),
          aristas: Pr.flujos.map((f) => ({
            de: f.de,
            a: f.a,
            etq: ENp?.etiquetas[`${f.de}>${f.a}`] ?? f.etiqueta ?? "",
            vuelta: false,
          })),
        },
        nodos: Pr.pasos.map((p) =>
          nodoVista(
            { id: p.id, tipo: p.tipo, texto: textoPaso(p), actor: p.carril },
            actores,
            nombreDe,
            pantallaDePaso[p.id],
            notas.find((x) => x.id === p.id)?.n,
          ),
        ),
        actores: actores.lista,
      },
      notas: notas.map(({ n, paso, texto }) => ({ n, paso, texto })),
    };
  }

  // ── hecho con método ───────────────────────────────────────────────────────────────────
  const priv = EN?.privacidad ?? E.privacidad.detalle;
  const ocultas = new Set(C.metodo?.ocultar ?? []);

  return {
    slug: e.slug,
    casa: e.casa,
    lang: locale,
    textoEnEs: textoEnEspanol(locale, C),
    nombre: NOMBRE,
    inicial: NOMBRE.charAt(0),
    acento: e.config.acento,
    datosSinteticos: e.config.datos_sinteticos,
    buscarPh: e.config.ejemplos_busqueda
      ? t("buscarEjemplos", { ejemplos: e.config.ejemplos_busqueda[locale] })
      : t("buscarPh"),
    secciones,
    pantallas,
    portada: {
      chips: [
        T(P?.categoria),
        T(P?.lugar),
        t("sprints", { n: E.app.sprints_cerrados }),
      ].filter(Boolean),
      titular,
      intro: promesa("intro"),
      hero,
      tras: hero.slice(1, 3),
      insignias: (P?.insignias ?? [])
        .slice(0, 3)
        .map((x) => ({ simbolo: x.simbolo || "✓", texto: T(x.texto) })),
      cifras: K.cifras_destacadas
        .map(metrica)
        .filter((m): m is MetricaExport => !!m)
        .map(cifra),
      rotuloCinta: e.config.datos_sinteticos
        ? `${reales} · ${t("sinteticos")}`
        : reales,
    },
    antes: {
      titulo: T(A?.titulo) || t("antes"),
      rotuloAntes: T(A?.antes_rotulo) || t("hoy"),
      rotuloDespues: T(A?.despues_rotulo),
      ...(A?.prueba
        ? {
            prueba: {
              antes: T(A.prueba.antes),
              despues: T(A.prueba.despues),
              texto: T(A.prueba.texto),
              fuente: A.prueba.fuente,
              ...(T(A.prueba.detalle) ? { detalle: T(A.prueba.detalle) } : {}),
              ...(cita(A.prueba.cita) ? { cita: cita(A.prueba.cita) } : {}),
            },
          }
        : {}),
      pares: (A?.pares ?? []).map((x) => ({
        antes: T(x.antes),
        despues: T(x.despues),
        ...(pantallaDe(x.funcionalidad)
          ? { mini: pantallaDe(x.funcionalidad) }
          : {}),
      })),
      ...(C.servicios
        ? {
            servicios: {
              titulo: T(C.servicios.titulo),
              texto: T(C.servicios.texto),
              fuente: C.servicios.fuente,
              nota: T(C.servicios.nota),
              items: C.servicios.items.map((it) => ({
                titulo: T(it.titulo),
                texto: T(it.texto),
                ...(cita(it.funcionalidad)
                  ? { cita: cita(it.funcionalidad) }
                  : {}),
              })),
            },
          }
        : {}),
      paraQuienTitulo,
      paraQuien: promesa("para_quien"),
      diferencial: promesa("diferencial"),
    },
    mapa: {
      intro: T(M?.intro),
      capas,
      ...(Tv
        ? {
            transversal: {
              nombre: T(Tv.nombre),
              sub: T(Tv.sub) || undefined,
              losetas: losetasDe(Tv.grupos),
              rasgos: Tv.rasgos.map((r) => ({
                titulo: T(r.titulo),
                texto: T(r.texto),
                ...(cita(r.fuente, r.metrica)
                  ? { cita: cita(r.fuente, r.metrica) }
                  : {}),
              })),
            },
          }
        : {}),
    },
    capitulos,
    ...(proceso ? { proceso } : {}),
    metodo: {
      cifras: E.metricas.filter((m) => !ocultas.has(m.clave)).map(cifra),
      stack: E.stack.map((x, j) => ({
        nombre: x.nombre,
        papel: EN?.stack[j]?.papel ?? x.papel,
      })),
      privacidad: priv.split(/(?<=[.])\s+(?=[A-ZÁÉÍÓÚÑ¿«"])/).filter(Boolean),
      nunca,
      limites,
    },
    cierre: {
      titulo: e.casa ? t("cierreCasaT") : t("cierreT"),
      // La del contenido manda (S30): la del export dice «esta ficha», y el brochure ya es la entrada.
      razon: C.enlaces_razon
        ? T(C.enlaces_razon)
        : (EN?.enlaces_razon ?? E.enlaces.razon),
      pie: `${NOMBRE} · ${t("pie", { fecha: fecha(E.actualizado, locale) })}${
        e.config.datos_sinteticos ? ` · ${t("pieSinteticos")}` : ""
      }`,
      ...(e.casa
        ? { contacto: { texto: t("ctaCasa"), href: "/#contacto" } }
        : {
            lista: {
              appInicial: e.slug,
              apps: e.usala?.apps ?? [{ slug: e.slug, nombre: NOMBRE }],
            },
            ...(K.roadmap.length
              ? {
                  roadmap: {
                    app: e.slug,
                    nombre: NOMBRE,
                    features: K.roadmap.map((f) => ({
                      feature: f.id,
                      titulo: T(f.titulo),
                      descripcion: T(f.descripcion),
                    })),
                  },
                }
              : {}),
            propuesta: { app: e.slug, nombre: NOMBRE },
            ...(e.usala?.simulacion
              ? {
                  simulacion: { href: `/portafolio/apps/${e.slug}/simulacion` },
                }
              : {}),
          }),
      hitos: hitosDe(E),
      vecinas: {
        ...(e.usala?.anterior
          ? {
              anterior: {
                nombre: e.usala.anterior.nombre,
                href: `/portafolio/apps/${e.usala.anterior.slug}`,
              },
            }
          : {}),
        ...(e.usala?.siguiente
          ? {
              siguiente: {
                nombre: e.usala.siguiente.nombre,
                href: `/portafolio/apps/${e.usala.siguiente.slug}`,
              },
            }
          : {}),
      },
    },
  };
}

/** La fecha del export, en el idioma de la página y sin depender de la zona horaria del build. */
export function fecha(iso: string, locale: Locale): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(
    locale === "es" ? "es-CO" : "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  );
}
