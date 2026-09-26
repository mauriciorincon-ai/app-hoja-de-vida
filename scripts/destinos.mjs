/**
 * CATÁLOGO DE DESTINOS — a dónde puede navegar una cita del chat (S8).
 *
 * Nace de un hallazgo: la sección `apps-pipeline` del esqueleto de la historia
 * apuntaba a `#apps`, y `#apps` **dejó de existir** en la revisión post-S7,
 * cuando el roadmap se mudó a la vitrina y la sección «Apps» de la HOME se
 * retiró. Nadie lo cazó: ni el build, ni los tests, ni axe, ni Lighthouse. Una
 * cita que no lleva a ninguna parte rompe la única promesa del chat —
 * «verifícalo tú mismo».
 *
 * Este módulo NO mantiene una lista: la DERIVA de las mismas fuentes que
 * construyen las páginas. Si mañana se retira otra sección de la HOME, el
 * catálogo se encoge solo y la aduana nombra a los documentos que apuntaban
 * ahí. Corregir la regla con un invariante, no el síntoma.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";

const ROOT = process.cwd();

const leerYaml = (rel) => parse(readFileSync(path.join(ROOT, rel), "utf8"));

/**
 * Las anclas de la HOME se leen de la HOME, en dos saltos:
 *   1. qué componentes se montan DENTRO de `<main>` en page.tsx,
 *   2. qué `id="…"` declara cada uno de esos componentes.
 *
 * El segundo salto solo mira los archivos del primero: `roadmap.tsx` declara
 * `id="roadmap"` y vive en `components/home/`, pero la HOME ya no lo monta —
 * el roadmap se fue a /vitrina/apps. Listarlo sería revivir el error de `#apps`
 * con otro nombre.
 */
export function anclasDeHome() {
  const pageFile = path.join(ROOT, "src", "app", "[locale]", "page.tsx");
  const page = readFileSync(pageFile, "utf8");

  const importes = new Map();
  for (const m of page.matchAll(
    /import\s*\{\s*([A-Za-z0-9_,\s]+)\s*\}\s*from\s*"(@\/components\/[^"]+)"/g,
  )) {
    for (const nombre of m[1].split(",").map((s) => s.trim())) {
      importes.set(nombre, m[2].replace("@/", "src/"));
    }
  }

  const main = page.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (!main) {
    throw new Error(
      `${path.relative(ROOT, pageFile)}: no se encontró el <main> de la HOME. ` +
        `El catálogo de destinos lo lee de ahí; si la HOME cambió de forma, este módulo cambia con ella.`,
    );
  }

  const anclas = new Set(["#contenido"]);
  const idEnMain = main[1].match(/id="([a-z0-9-]+)"/g) ?? [];
  for (const bruto of idEnMain) anclas.add(`#${bruto.slice(4, -1)}`);

  for (const [nombre, rel] of importes) {
    if (!new RegExp(`<${nombre}[\\s/>]`).test(main[1])) continue;
    const archivo = path.join(ROOT, `${rel}.tsx`);
    if (!existsSync(archivo)) continue;
    const fuente = readFileSync(archivo, "utf8");
    for (const m of fuente.matchAll(/\bid="([a-z0-9-]+)"/g)) {
      anclas.add(`#${m[1]}`);
    }
    // Las tarjetas de Skills (2026-09-26) llevan un id que sale de los DATOS
    // (`id={`skills-${grupo.id}`}`), no un literal. Se expande con los grupos
    // de `cv.es.yaml` solo si el componente montado declara ese id: si alguien
    // se lo quita, las anclas desaparecen y la aduana nombra a los documentos
    // que citaban hacia una tarjeta.
    if (fuente.includes("id={`skills-${grupo.id}`}")) {
      for (const g of leerYaml("data/cv.es.yaml").skills ?? []) {
        anclas.add(`#skills-${g.id}`);
      }
    }
  }
  return anclas;
}

/** Las rutas salen de los mismos datos con los que se generan las páginas. */
export function rutasDeDatos() {
  const rutas = new Set(["/", "/cv", "/vitrina"]);

  for (const locale of ["es", "en"]) {
    const cv = leerYaml(`data/cv.${locale}.yaml`);
    for (const p of cv.proyectos ?? []) {
      if (p.casestudy) rutas.add(`/proyectos/${p.slug}`);
    }
  }

  for (const app of leerYaml("data/apps.yaml").apps ?? []) {
    if (app.brochure) rutas.add(`/apps/${app.id}`);
  }

  for (const frente of leerYaml("data/vitrina.yaml").categorias ?? []) {
    // Un frente en preparación TIENE página (lo declara y ofrece la lista de
    // espera); lo que no publica son sus piezas.
    rutas.add(`/vitrina/${frente.id}`);
    if (frente.estado !== "abierta") continue;

    if (frente.id === "apps") {
      const dir = path.join(ROOT, "content", "vitrina");
      for (const f of existsSync(dir) ? readdirSync(dir) : []) {
        if (!f.endsWith(".brochure-export.json")) continue;
        const { app } = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
        rutas.add(`/vitrina/apps/${app.slug}`);
        rutas.add(`/vitrina/apps/${app.slug}/detalle`);
      }
      continue;
    }

    const dir = path.join(ROOT, "content", frente.id);
    for (const f of existsSync(dir) ? readdirSync(dir) : []) {
      if (!f.endsWith(".ficha-tecnica.json")) continue;
      const { pieza } = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
      rutas.add(`/vitrina/${frente.id}/${pieza.slug}`);
    }
  }

  return rutas;
}

/**
 * EL NOMBRE DE CADA DESTINO (2026-09-23, decisión del dueño). El chip de una
 * cita decía el título del fragmento («A fondo — Vesting — la plataforma… ·
 * Monitoreo») y aterrizaba en una página que nadie podía anticipar. Ahora dice
 * a dónde lleva («Vesting», «Skills», «Agentes especializados»), y ese nombre
 * NO se escribe a mano: sale de las mismas fuentes que pintan cada destino —
 * la etiqueta del menú para una sección de la HOME, el nombre del proyecto en
 * el CV, el nombre del frente o de la pieza en la vitrina—. Un destino que
 * existe pero no tiene nombre rompe el build (gate del índice): mejor un rojo
 * hoy que un chip que dice «undefined» a un visitante.
 */
export function nombresDeDestinos(locale) {
  const nombres = new Map();
  const msg = JSON.parse(
    readFileSync(path.join(ROOT, "messages", `${locale}.json`), "utf8"),
  );
  for (const seccion of [
    "trayectoria",
    "logros",
    "skills",
    "certificaciones",
    "contacto",
    "estudios",
  ]) {
    if (msg.nav?.[seccion]) nombres.set(`#${seccion}`, msg.nav[seccion]);
  }
  if (msg.perfil?.titulo) nombres.set("#perfil", msg.perfil.titulo);
  if (msg.vitrinaHome?.titulo) {
    nombres.set("#vitrina", msg.vitrinaHome.titulo);
    nombres.set("/vitrina", msg.vitrinaHome.titulo);
  }
  if (msg.nav?.hojaDeVida) {
    nombres.set("/", msg.nav.hojaDeVida);
    nombres.set("#contenido", msg.nav.hojaDeVida);
  }
  if (msg.cv?.titulo) nombres.set("/cv", msg.cv.titulo);

  const cv = leerYaml(`data/cv.${locale}.yaml`);
  // Una tarjeta de Skills se llama como su grupo («Plataforma de datos»).
  for (const g of cv.skills ?? []) nombres.set(`#skills-${g.id}`, g.grupo);
  for (const p of cv.proyectos ?? []) {
    if (p.casestudy)
      nombres.set(`/proyectos/${p.slug}`, nombreCortoDeProyecto(p.nombre));
  }

  for (const app of leerYaml("data/apps.yaml").apps ?? []) {
    if (app.brochure) nombres.set(`/apps/${app.id}`, app.nombre[locale]);
  }

  for (const frente of leerYaml("data/vitrina.yaml").categorias ?? []) {
    nombres.set(`/vitrina/${frente.id}`, frente.nombre[locale]);
    if (frente.estado !== "abierta") continue;
    if (frente.id === "apps") {
      const dir = path.join(ROOT, "content", "vitrina");
      for (const f of existsSync(dir) ? readdirSync(dir) : []) {
        if (!f.endsWith(".brochure-export.json")) continue;
        const { app } = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
        nombres.set(`/vitrina/apps/${app.slug}`, app.nombre);
        nombres.set(`/vitrina/apps/${app.slug}/detalle`, app.nombre);
      }
      continue;
    }
    const dir = path.join(ROOT, "content", frente.id);
    for (const f of existsSync(dir) ? readdirSync(dir) : []) {
      if (!f.endsWith(".ficha-tecnica.json")) continue;
      const { pieza } = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
      nombres.set(`/vitrina/${frente.id}/${pieza.slug}`, pieza.nombre);
    }
  }
  return nombres;
}

/**
 * El nombre de un proyecto en el CV sigue la forma «Qué se hizo — Dónde
 * (cuándo)»: «Plataforma de datos para agentes de IA — Vesting (2023–2025)».
 * El chip quiere el DÓNDE, que es como el visitante reconoce el case study.
 * Si el nombre no sigue la forma, viaja entero: un chip largo es mejor que uno
 * que diga otra cosa.
 */
export function nombreCortoDeProyecto(nombre) {
  const partes = String(nombre).split(" — ");
  const donde = (partes.length > 1 ? partes[partes.length - 1] : partes[0])
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
  return donde || String(nombre);
}

/**
 * ¿Cómo se llama este destino? `#skills-titulo` es la sección `#skills`;
 * `/proyectos/vesting#cs-impacto` es la página de Vesting. `null` si no tiene
 * nombre — y eso rompe el build, no el chip.
 */
export function nombreDeDestino(destino, nombres) {
  if (typeof destino !== "string" || destino.length === 0) return null;
  if (destino.startsWith("#")) {
    return (
      nombres.get(destino) ??
      nombres.get(destino.replace(/-titulo$/, "")) ??
      null
    );
  }
  return nombres.get(destino.split("#")[0]) ?? null;
}

/** Todos los destinos válidos hoy: anclas de la HOME + rutas reales. */
export function catalogoDeDestinos() {
  return new Set([...anclasDeHome(), ...rutasDeDatos()]);
}

/**
 * ¿Existe este destino? Acepta `#ancla` y `/ruta` (sin prefijo de idioma: el
 * cliente antepone `/{locale}`). Una ruta puede venir con ancla pegada
 * (`/proyectos/vesting#cs-impacto`): se valida la ruta, que es lo que decide
 * si la página existe.
 */
export function destinoExiste(destino, catalogo = catalogoDeDestinos()) {
  if (typeof destino !== "string" || destino.length === 0) return false;
  if (destino.startsWith("#")) return catalogo.has(destino);
  if (!destino.startsWith("/")) return false;
  return catalogo.has(destino.split("#")[0]);
}
