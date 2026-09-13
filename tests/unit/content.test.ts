import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { DIR_A_FONDO } from "../../scripts/a-fondo.mjs";
import { getApps, getCv } from "@/lib/content";
import { parseApps, parseCv } from "@/lib/schemas";

describe("content loader (data/*.yaml reales)", () => {
  it("parses data/cv.es.yaml and data/cv.en.yaml", () => {
    expect(getCv("es").identidad.nombre).toBeTruthy();
    expect(getCv("en").identidad.nombre).toBeTruthy();
  });

  it("keeps ES/EN structurally in parity (same section sizes)", () => {
    const es = getCv("es");
    const en = getCv("en");
    expect(en.trayectoria).toHaveLength(es.trayectoria.length);
    expect(en.logros).toHaveLength(es.logros.length);
    expect(en.proyectos).toHaveLength(es.proyectos.length);
    expect(en.certificaciones).toHaveLength(es.certificaciones.length);
    expect(en.skills).toHaveLength(es.skills.length);
    // Estudios (post-S7): sección propia, misma cuenta en los dos idiomas.
    expect(en.estudios).toHaveLength(es.estudios.length);
    expect(es.estudios.length).toBeGreaterThan(0);
  });

  // Corrección de contenido 2026-09-12 (punto 11 del informe de discrepancias
  // del S8): el logro de años de trayectoria se CALCULA desde una fecha, no se
  // escribe — un número escrito a mano envejece solo. Si alguien vuelve a
  // poner `valor: 10` y borra `desde`, este test lo nombra.
  it("el logro de años de trayectoria declara `desde` y su valor se calcula (ES y EN)", () => {
    for (const locale of ["es", "en"] as const) {
      const crudo: unknown = parse(
        readFileSync(`data/cv.${locale}.yaml`, "utf8"),
      );
      const logros = (crudo as { logros: Record<string, unknown>[] }).logros;
      const trayectoria = logros.find((l) =>
        /trayectoria|experience/i.test(String(l.etiqueta)),
      );
      expect(
        trayectoria,
        `cv.${locale}: falta el logro de años de trayectoria`,
      ).toBeDefined();
      expect(
        trayectoria?.desde,
        `cv.${locale}: el logro «${trayectoria?.etiqueta}» no declara \`desde\` — el valor se calcula, no se escribe`,
      ).toMatch(/^\d{4}-\d{2}$/);
      expect(
        trayectoria?.valor,
        `cv.${locale}: el logro «${trayectoria?.etiqueta}» trae \`valor\` escrito a mano; sobra, lo calcula \`desde\``,
      ).toBeUndefined();
      expect(getCv(locale).logros[0].valor).toBeGreaterThanOrEqual(10);
    }
  });

  it("cada hito enlaza al MISMO case study en ES y EN (el hreflang lo necesita)", () => {
    const es = getCv("es");
    const en = getCv("en");
    expect(en.trayectoria.map((t) => t.proyecto ?? null)).toEqual(
      es.trayectoria.map((t) => t.proyecto ?? null),
    );
    // La puerta a los case studies es la trayectoria: al menos uno enlazado.
    expect(es.trayectoria.some((t) => t.proyecto)).toBe(true);
    // Y la formación ya no se disfraza de hito: ningún periodo sin año.
    for (const t of es.trayectoria) expect(t.periodo).toMatch(/\d{4}/);
  });

  it("ningún estudio va sin año: «Sin fecha declarada» es un fallback, no un estado publicable", () => {
    for (const locale of ["es", "en"] as const)
      for (const e of getCv(locale).estudios)
        expect(e.periodo, `${locale}: ${e.titulo}`).toMatch(/\d{4}/);
  });

  // Una credencial nombrada por código (DP-600, AI-102…) en el titular, un
  // logro, un case study, el corpus «a fondo» o apps.yaml es una promesa:
  // tiene que existir en `certificaciones`. Nació el 2026-09-10, cuando AI-102
  // salió de la lista (Microsoft la descontinuó) y seguía viva en seis sitios.
  //
  // S8 — el segundo estado declarable. El canal «a fondo» destapó el caso que
  // faltaba: un documento cuyo TEMA es el estado de una credencial —una
  // descontinuada, una en curso— tiene que escribir el código justamente para
  // decir que NO se tiene. La promesa no se toca (sigue siendo imposible
  // afirmar una credencial que no se tiene); lo que se añade es que un código
  // también puede estar declarado en `data/credenciales-nombradas.yaml` CON SU
  // RAZÓN. Un código que no esté en ninguna de las dos rompe igual.
  const CODIGO_CREDENCIAL = /\b(?:AI|DP|AZ|PL|DA|MB|MS|SC)-\d{3}\b/g;
  type Hallazgo = { ruta: string; codigo: string };
  function codigosEn(valor: unknown, ruta: string, out: Hallazgo[]) {
    if (typeof valor === "string") {
      for (const codigo of valor.match(CODIGO_CREDENCIAL) ?? [])
        out.push({ ruta, codigo });
    } else if (Array.isArray(valor)) {
      valor.forEach((v, i) => codigosEn(v, `${ruta}[${i}]`, out));
    } else if (valor && typeof valor === "object") {
      for (const [k, v] of Object.entries(valor))
        codigosEn(v, `${ruta}.${k}`, out);
    }
  }

  it("toda credencial nombrada por código existe en certificaciones (cv, «a fondo» y apps)", () => {
    const apps: unknown = parse(readFileSync("data/apps.yaml", "utf8"));
    const declaradas = parse(
      readFileSync("data/credenciales-nombradas.yaml", "utf8"),
    ) as { nombradas_sin_obtener: { codigo: string; razon: string }[] };
    for (const d of declaradas.nombradas_sin_obtener) {
      expect(
        d.razon?.trim(),
        `credenciales-nombradas.yaml: «${d.codigo}» sin razón. Nombrar una credencial que no se tiene es una decisión, y una decisión sin razón escrita no es declarable.`,
      ).toBeTruthy();
    }
    const declarada = new Set(
      declaradas.nombradas_sin_obtener.map((d) => d.codigo),
    );
    for (const locale of ["es", "en"] as const) {
      const { certificaciones, ...resto } = getCv(locale);
      const listadas = new Set(
        certificaciones.flatMap((c) => c.nombre.match(CODIGO_CREDENCIAL) ?? []),
      );
      const halladas: Hallazgo[] = [];
      codigosEn(resto, `cv.${locale}`, halladas);
      // El canal «a fondo» reemplazó a la historia en el S8: los códigos de
      // credencial se cuelan igual en la prosa, y ahí hay 24 documentos, no 2.
      for (const archivo of readdirSync(DIR_A_FONDO).filter((f) =>
        f.endsWith(`.${locale}.md`),
      )) {
        codigosEn(
          readFileSync(join(DIR_A_FONDO, archivo), "utf8"),
          `a-fondo/${archivo}`,
          halladas,
        );
      }
      codigosEn(apps, "apps", halladas);
      // Revisión post-S8 (2026-09-12): la descripción SEO de `messages/` es una
      // superficie publicada más — y ahí AI-102 sobrevivió al retiro del
      // 2026-09-10 porque este barrido no la miraba. Google sí la indexa.
      codigosEn(
        JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")),
        `messages/${locale}.json`,
        halladas,
      );
      // EL SEGUNDO ESTADO HABILITA LA PROSA, NO EL CV (fase 2 de la auditoría).
      // Al nacer, `credenciales-nombradas.yaml` autorizaba su código EN TODAS
      // PARTES, y con eso `cv.es.yaml` habría podido poner «Certificado AI-103»
      // en el titular y pasar en verde — el gate dejaba de vigilar «una
      // credencial nombrada es una credencial listada» y pasaba a vigilar «está
      // declarada en alguna parte», que no es la misma promesa. El segundo
      // estado existe porque la PROSA del corpus necesita explicar por qué una
      // credencial ya no está o todavía no está; el CV, no: ahí un código o
      // está en `certificaciones` o no se nombra.
      const huerfanas = halladas
        .filter((h) => !listadas.has(h.codigo))
        .filter(
          (h) => !(h.ruta.startsWith("a-fondo/") && declarada.has(h.codigo)),
        )
        .map((h) => `${h.codigo} en ${h.ruta}`);
      expect(
        huerfanas,
        "una credencial nombrada es una credencial listada: en el CV, en messages/ y en apps.yaml, el código está en `certificaciones` de cv.*.yaml o no se nombra; en la prosa de data/a-fondo/ vale además el segundo estado declarado en data/credenciales-nombradas.yaml, con su razón",
      ).toEqual([]);
    }
  });

  // Revisión post-S8 (2026-09-12): el tercer estado. El dueño quiso el AI-103
  // en el titular («estamos en proceso»), y el gate de arriba lo hacía
  // imposible a propósito: un código o está en `certificaciones` o no se
  // nombra. La salida honesta es listarlo CON `estado: en curso` — y entonces
  // hace falta vigilar lo contrario: que nunca aparezca como si ya se tuviera.
  // Cada mención de un código en curso, en las superficies publicadas (CV,
  // messages, apps), lleva al lado las palabras que dicen que no está.
  const MARCA_EN_CURSO =
    /en curso|en ruta|en preparaci[oó]n|in progress|on the way|preparing/i;
  const VENTANA = 48;
  function mencionesSinMarca(
    valor: unknown,
    ruta: string,
    codigos: Set<string>,
    out: string[],
  ) {
    if (typeof valor === "string") {
      for (const m of valor.matchAll(CODIGO_CREDENCIAL)) {
        if (!codigos.has(m[0])) continue;
        const i = m.index ?? 0;
        const ventana = valor.slice(
          Math.max(0, i - VENTANA),
          i + m[0].length + VENTANA,
        );
        if (!MARCA_EN_CURSO.test(ventana))
          out.push(`${m[0]} en ${ruta}: «…${ventana.trim()}…»`);
      }
    } else if (Array.isArray(valor)) {
      valor.forEach((v, i) =>
        mencionesSinMarca(v, `${ruta}[${i}]`, codigos, out),
      );
    } else if (valor && typeof valor === "object") {
      for (const [k, v] of Object.entries(valor))
        mencionesSinMarca(v, `${ruta}.${k}`, codigos, out);
    }
  }

  it("una credencial «en curso» jamás sale a secas: cada mención lleva «en curso» al lado (CV, messages, apps)", () => {
    const apps: unknown = parse(readFileSync("data/apps.yaml", "utf8"));
    for (const locale of ["es", "en"] as const) {
      const { certificaciones, ...resto } = getCv(locale);
      const enCurso = new Set(
        certificaciones
          .filter((c) => c.estado === "en curso")
          .flatMap((c) => c.nombre.match(CODIGO_CREDENCIAL) ?? []),
      );
      const aSecas: string[] = [];
      mencionesSinMarca(resto, `cv.${locale}`, enCurso, aSecas);
      mencionesSinMarca(
        JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")),
        `messages/${locale}.json`,
        enCurso,
        aSecas,
      );
      mencionesSinMarca(apps, "apps", enCurso, aSecas);
      expect(
        aSecas,
        "un código listado como «en curso» se nombra siempre con esa marca a menos de 48 caracteres: sin ella, el titular afirma una credencial que no se tiene",
      ).toEqual([]);
    }
  });

  // Revisión post-S8: el logo de una institución es un ARCHIVO de
  // `public/logos/`, y un `logo:` que apunta a un archivo que no está pinta
  // una imagen rota en la HOME con la CI en verde — el schema solo valida el
  // nombre. Este gate exige que exista, y nombra el estudio o la certificación.
  it("todo `logo:` de estudios y certificaciones apunta a un archivo que existe en public/logos/", () => {
    for (const locale of ["es", "en"] as const) {
      const cv = getCv(locale);
      const rotos = [
        ...cv.estudios.map((e) => ({
          quien: `estudio «${e.titulo}»`,
          logo: e.logo,
        })),
        ...cv.certificaciones.map((c) => ({
          quien: `certificación «${c.nombre}»`,
          logo: c.logo,
        })),
      ]
        .filter((x) => x.logo && !existsSync(join("public", "logos", x.logo)))
        .map((x) => `${x.quien} → public/logos/${x.logo} (cv.${locale})`);
      expect(
        rotos,
        "un logo declarado tiene que existir en public/logos/",
      ).toEqual([]);
    }
  });

  it("keeps the depth layer in ES/EN parity (S2)", () => {
    const es = getCv("es");
    const en = getCv("en");
    // Slugs idénticos y en el mismo orden: el hreflang depende de esto
    expect(en.proyectos.map((p) => p.slug)).toEqual(
      es.proyectos.map((p) => p.slug),
    );
    // Mismo nº de bullets por hito y casestudy en los mismos proyectos
    expect(en.trayectoria.map((t) => t.bullets.length)).toEqual(
      es.trayectoria.map((t) => t.bullets.length),
    );
    expect(en.proyectos.map((p) => Boolean(p.casestudy))).toEqual(
      es.proyectos.map((p) => Boolean(p.casestudy)),
    );
    // El grueso existe: al menos un hito con bullets y un casestudy
    expect(es.trayectoria.some((t) => t.bullets.length > 0)).toBe(true);
    expect(es.proyectos.some((p) => p.casestudy)).toBe(true);
  });

  it("parses data/apps.yaml and includes hoja-de-vida", () => {
    const { apps } = getApps();
    expect(apps.map((a) => a.id)).toContain("hoja-de-vida");
  });
});

describe("fail-safe del build", () => {
  it("a malformed cv.yaml throws a descriptive error (build breaks)", () => {
    const roto = parse("identidad:\n  nombre: ''\n");
    expect(() => parseCv(roto, "data/cv.es.yaml")).toThrowError(
      /data\/cv\.es\.yaml/,
    );
  });
});

describe("showcase data-driven (criterio de aceptación)", () => {
  it("adding a dummy app to apps.yaml content is enough — no code changes", () => {
    const actual = getApps();
    const conDummy = {
      apps: [
        ...actual.apps,
        {
          id: "app-dummy",
          estado: "en-exploracion",
          nombre: { es: "App Dummy", en: "Dummy App" },
          descripcion: { es: "Prueba", en: "Test" },
        },
      ],
    };
    const parseada = parseApps(conDummy, "apps.yaml");
    expect(parseada.apps.map((a) => a.id)).toContain("app-dummy");
    // El default se aplica sin tocar componentes ni schema
    expect(parseada.apps.at(-1)?.solicitable).toBe(true);
  });
});
