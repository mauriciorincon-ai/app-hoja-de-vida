import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

/**
 * LA VERSIÓN DE NODE SE DECLARA, Y PRODUCCIÓN Y LA CI CORREN LA MISMA MAYOR
 * (S12, M3 del S11; S13, M1 del S12).
 *
 * `scripts/metodo-al-indice.mjs` importa archivos `.ts` (el esquema de «Mi
 * método»): eso solo funciona si Node quita los tipos por sí mismo, y Node lo
 * hace por defecto desde la 22.18.0 («v23.6.0, v22.18.0 · Type stripping is
 * enabled by default», nodejs.org/api/typescript.html). El S12 escribió esa
 * versión como un piso abierto («>=22.18.0») y la CI probó la 22.18.0… pero Vercel,
 * ante un rango abierto, resuelve la ÚLTIMA mayor (24.x): producción corría una
 * Node que nadie probaba. El gate de hoy cierra esa grieta: se declara la MAYOR,
 * y todo lo demás tiene que ser de esa mayor.
 *
 * Cuatro declaraciones tienen que contar la misma historia:
 *   · `package.json` → `engines.node` = «22.x»: lo que Vercel lee, y no admite un
 *                       rango abierto (resolvería a otra mayor distinta de la probada);
 *   · `.nvmrc`        → la versión exacta con la que se trabaja y se prueba: de esa
 *                       mayor y no menor que lo que el código exige;
 *   · `@types/node`   → los tipos de esa misma mayor (con otra, el typecheck valida
 *                       contra una API que producción no tiene);
 *   · `.github/workflows/*.yml` → cada `setup-node` lee `.nvmrc` (sin una segunda
 *                       copia que se desfase) y va DESPUÉS de `checkout`: el archivo
 *                       tiene que estar en el disco del job cuando se lee.
 */

/** Desde esta versión Node ejecuta `.ts` sin banderas (v22.18.0). */
const TYPE_STRIPPING_DESDE = [22, 18, 0] as const;

type Version = readonly [number, number, number];

const aVersion = (s: string): Version | null => {
  const m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(s.trim());
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
};
const noMenor = (a: Version, b: Version): boolean => {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return true;
};
const texto = (v: Version) => v.join(".");

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  engines?: { node?: string };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
const rango = pkg.engines?.node ?? "";
/** La mayor declarada: solo vale «N.x»; un rango abierto («>=22.18.0», «>=22») no es una mayor. */
const mayor = ((): number | null => {
  const m = /^(\d+)\.x$/.exec(rango);
  return m ? Number(m[1]) : null;
})();

const nvmrcCrudo = readFileSync(".nvmrc", "utf8");
const nvmrc = aVersion(nvmrcCrudo);

const tiposRango =
  pkg.devDependencies?.["@types/node"] ?? pkg.dependencies?.["@types/node"] ?? "";
const mayorDeTipos = ((): number | null => {
  const m = /^\^?(\d+)(?:\.|$)/.exec(tiposRango);
  return m ? Number(m[1]) : null;
})();

type Paso = { uses?: string; with?: Record<string, unknown>; run?: string };
type Job = { steps?: Paso[] };
const esSetupNode = (s: Paso) => (s.uses ?? "").startsWith("actions/setup-node@");
const esCheckout = (s: Paso) => (s.uses ?? "").startsWith("actions/checkout@");

/** Todos los workflows, no solo `ci.yml`: un workflow nuevo con una Node fija también cuenta. */
const jobsDeLaCI = readdirSync(".github/workflows")
  .filter((f) => /\.ya?ml$/.test(f))
  .flatMap((archivo) => {
    const doc = parse(readFileSync(`.github/workflows/${archivo}`, "utf8")) as {
      jobs?: Record<string, Job>;
    };
    return Object.entries(doc.jobs ?? {}).map(
      ([nombre, job]) => [`${archivo} · ${nombre}`, job] as const,
    );
  });
/** Los que usan pnpm o ya traen un `setup-node`: ahí la versión de Node importa. */
const jobsConNode = jobsDeLaCI.filter(([, j]) =>
  (j.steps ?? []).some((s) => /\bpnpm\b/.test(s.run ?? "") || esSetupNode(s)),
);

/** Los `scripts/*.mjs` que importan un `.ts`: el código que fija el piso. */
const scriptsQueImportanTs = readdirSync("scripts")
  .filter((f) => f.endsWith(".mjs"))
  .filter((f) =>
    /\bfrom\s+["'][^"']+\.ts["']|\bimport\(\s*["'][^"']+\.ts["']\s*\)/.test(
      readFileSync(`scripts/${f}`, "utf8"),
    ),
  );

describe("Node declarado — package.json, .nvmrc, @types/node y la CI cuentan lo mismo", () => {
  it("package.json declara engines.node como una mayor fija («N.x»)", () => {
    expect(
      mayor,
      `package.json: engines.node es «${rango}»; el gate pide «N.x» (una mayor fija, p. ej. «22.x»). Un rango abierto como «>=22.18.0» deja que Vercel resuelva la última mayor (24.x al escribir esto) mientras la CI prueba otra: producción correría una Node que nadie probó`,
    ).not.toBeNull();
  });

  it(".nvmrc es una versión exacta, de la mayor de engines.node", () => {
    expect(
      nvmrc,
      `.nvmrc: «${nvmrcCrudo.trim()}» no es una versión exacta X.Y.Z`,
    ).not.toBeNull();
    expect(
      (nvmrc as Version)[0],
      `.nvmrc (${texto(nvmrc as Version)}) no es de la mayor que declara engines.node (${rango}): la CI probaría una Node y producción correría otra`,
    ).toBe(mayor);
  });

  it(".nvmrc no baja de lo que el código exige", () => {
    // Si el día de mañana nadie importa un `.ts`, este piso deja de aplicar;
    // mientras alguien lo importe, bajarlo rompe el build del índice. El piso se vigila
    // sobre `.nvmrc` porque es la versión que se prueba (y la mayor de engines la acota).
    expect(
      scriptsQueImportanTs.length,
      "ya no hay scripts que importen .ts: este piso ya no se deriva de nada; revisa el gate",
    ).toBeGreaterThan(0);
    expect(
      noMenor(nvmrc as Version, TYPE_STRIPPING_DESDE),
      `.nvmrc (${texto(nvmrc as Version)}) es menor que ${texto(TYPE_STRIPPING_DESDE)}, desde donde Node ejecuta .ts sin banderas, y ${scriptsQueImportanTs.join(", ")} importa(n) .ts`,
    ).toBe(true);
  });

  it("@types/node es de la misma mayor que engines.node", () => {
    expect(
      mayorDeTipos,
      `package.json: @types/node es «${tiposRango}»; el gate pide un rango con la mayor (p. ej. «^22»)`,
    ).not.toBeNull();
    expect(
      mayorDeTipos,
      `package.json: @types/node «${tiposRango}» no es de la mayor de engines.node (${rango}): el typecheck validaría contra una API de Node que producción no tiene`,
    ).toBe(mayor);
  });

  it("la CI tiene jobs con pnpm que ejercitar (si no, este gate no vigila nada)", () => {
    expect(jobsConNode.length).toBeGreaterThanOrEqual(4);
  });

  it.each(jobsConNode.map(([nombre, job]) => [nombre, job] as const))(
    "CI · el job «%s» corre la versión de .nvmrc, con el archivo ya en disco",
    (nombre, job) => {
      const pasos = job.steps ?? [];
      const nodes = pasos.filter(esSetupNode);
      expect(
        nodes.length,
        `${nombre}: usa pnpm sin exactamente un paso setup-node`,
      ).toBe(1);
      const con = nodes[0].with ?? {};
      expect(
        con["node-version-file"],
        `${nombre}: declara node-version «${String(con["node-version"] ?? "—")}» en vez de leer .nvmrc: una segunda copia de la versión que se desfasa`,
      ).toBe(".nvmrc");
      expect(
        con["node-version"],
        `${nombre}: tiene node-version y node-version-file a la vez`,
      ).toBeUndefined();
      const iCheckout = pasos.findIndex(esCheckout);
      const iNode = pasos.findIndex(esSetupNode);
      expect(
        iCheckout >= 0 && iCheckout < iNode,
        `${nombre}: setup-node lee .nvmrc antes de que checkout lo traiga al disco (o no hay checkout): el job fallaría al buscar el archivo`,
      ).toBe(true);
    },
  );
});
