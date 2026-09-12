import { describe, expect, it } from "vitest";
import {
  anclasDeHome,
  catalogoDeDestinos,
  destinoExiste,
  rutasDeDatos,
} from "../../scripts/destinos.mjs";

/**
 * EL CATÁLOGO DE DESTINOS (S8) — a dónde puede navegar una cita del chat.
 *
 * Nació de un hallazgo: `apps-pipeline` apuntaba a `#apps`, y `#apps` dejó de
 * existir en la revisión post-S7 cuando la sección «Apps» de la HOME se retiró
 * y el roadmap se mudó a la vitrina. Nadie lo cazó — ni el build, ni los tests,
 * ni axe, ni Lighthouse. Y el mismo destino muerto vivía además en los chunks
 * de `apps.yaml`, así que eran dos fugas, no una.
 *
 * El catálogo no es una lista mantenida a mano: se DERIVA de la HOME y de los
 * datos. Si mañana se retira otra sección, se encoge solo.
 */

describe("anclasDeHome — se leen de la HOME, no de una lista", () => {
  const anclas = anclasDeHome();

  it("trae las secciones que la HOME monta de verdad", () => {
    for (const a of [
      "#perfil",
      "#trayectoria",
      "#logros",
      "#vitrina",
      "#estudios",
      "#certificaciones",
      "#skills",
      "#contacto",
    ]) {
      expect(anclas.has(a), `la HOME debería tener ${a}`).toBe(true);
    }
  });

  it("NO trae «#apps»: esa sección se retiró en la revisión post-S7", () => {
    expect(anclas.has("#apps")).toBe(false);
  });

  it("NO trae «#roadmap»: el componente existe, pero la HOME ya no lo monta", () => {
    // roadmap.tsx declara id="roadmap" y vive en components/home/, pero el
    // roadmap se fue a /vitrina/apps. Listarlo sería revivir el error de #apps
    // con otro nombre: por eso el catálogo mira QUÉ se monta dentro del <main>,
    // no qué archivos hay en la carpeta.
    expect(anclas.has("#roadmap")).toBe(false);
  });
});

describe("rutasDeDatos — salen de los mismos datos que generan las páginas", () => {
  const rutas = rutasDeDatos();

  it("incluye los case studies, la vitrina y sus frentes", () => {
    expect(rutas.has("/proyectos/vesting")).toBe(true);
    expect(rutas.has("/cv")).toBe(true);
    expect(rutas.has("/vitrina")).toBe(true);
    expect(rutas.has("/vitrina/apps")).toBe(true);
    expect(rutas.has("/vitrina/agentes")).toBe(true);
  });

  it("incluye las piezas publicadas de un frente abierto", () => {
    expect(rutas.has("/vitrina/agentes/hr-develop-ai-apps")).toBe(true);
    expect(rutas.has("/vitrina/apps/habla")).toBe(true);
    expect(rutas.has("/vitrina/apps/habla/detalle")).toBe(true);
  });

  it("no inventa rutas: un proyecto sin case study no tiene página", () => {
    expect(rutas.has("/proyectos/inventado")).toBe(false);
  });
});

describe("destinoExiste", () => {
  const catalogo = catalogoDeDestinos();

  it("acepta un ancla viva y una ruta viva", () => {
    expect(destinoExiste("#trayectoria", catalogo)).toBe(true);
    expect(destinoExiste("/proyectos/vesting", catalogo)).toBe(true);
  });

  it("rechaza el ancla muerta y la ruta inventada", () => {
    expect(destinoExiste("#apps", catalogo)).toBe(false);
    expect(destinoExiste("/detalle/vesting", catalogo)).toBe(false);
  });

  it("una ruta con ancla pegada se juzga por la ruta, que es la que decide si hay página", () => {
    expect(destinoExiste("/proyectos/vesting#cs-impacto", catalogo)).toBe(true);
    expect(destinoExiste("/proyectos/inventado#algo", catalogo)).toBe(false);
  });

  it("rechaza lo que no es ni ancla ni ruta", () => {
    expect(destinoExiste("", catalogo)).toBe(false);
    expect(destinoExiste("proyectos/vesting", catalogo)).toBe(false);
    expect(destinoExiste(undefined, catalogo)).toBe(false);
  });
});
