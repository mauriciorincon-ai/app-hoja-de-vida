import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

/**
 * LA VERSIÓN DE NODE SE DECLARA, Y LA CI CORRE ESA MISMA (S12, M3 del S11).
 *
 * `scripts/metodo-al-indice.mjs` importa archivos `.ts` (el esquema de «Mi
 * método»): eso solo funciona si Node quita los tipos por sí mismo, y Node lo
 * hace por defecto desde la 22.18.0 («v23.6.0, v22.18.0 · Type stripping is
 * enabled by default», nodejs.org/api/typescript.html). Antes de este gate esa
 * versión no estaba escrita en ninguna parte: la CI decía «22», Vercel elige la
 * suya y nadie comparaba nada contra la intención.
 *
 * Tres declaraciones tienen que contar la misma historia:
 *   · `package.json` → `engines.node`, que es lo que Vercel lee: un rango abierto como
 *                       «>=22.18.0» se resuelve a la última mayor (24.x al escribir esto), así
 *                       que producción puede correr más nuevo que la CI (que prueba 22.18.0);
 *   · `.nvmrc`        → la versión exacta con la que se trabaja y se prueba;
 *   · `ci.yml`        → cada `setup-node` lee `.nvmrc`: el job corre exactamente
 *                       lo declarado, sin una segunda copia que se desfase.
 * Y el mínimo no puede ser menor que lo que el código exige.
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
};
const rango = pkg.engines?.node ?? "";
const minimo = ((): Version | null => {
  const m = /^>=(\d+\.\d+\.\d+)$/.exec(rango);
  return m ? aVersion(m[1]) : null;
})();

const nvmrcCrudo = readFileSync(".nvmrc", "utf8");
const nvmrc = aVersion(nvmrcCrudo);

type Paso = { uses?: string; with?: Record<string, unknown>; run?: string };
type Job = { steps?: Paso[] };
const ci = parse(readFileSync(".github/workflows/ci.yml", "utf8")) as {
  jobs: Record<string, Job>;
};
const jobsConNode = Object.entries(ci.jobs).filter(([, j]) =>
  (j.steps ?? []).some((s) => /\bpnpm\b/.test(s.run ?? "")),
);

/** Los `scripts/*.mjs` que importan un `.ts`: el código que fija el piso. */
const scriptsQueImportanTs = readdirSync("scripts")
  .filter((f) => f.endsWith(".mjs"))
  .filter((f) =>
    /\bfrom\s+["'][^"']+\.ts["']|\bimport\(\s*["'][^"']+\.ts["']\s*\)/.test(
      readFileSync(`scripts/${f}`, "utf8"),
    ),
  );

describe("Node declarado — package.json, .nvmrc y la CI cuentan lo mismo", () => {
  it("package.json declara engines.node como «>=X.Y.Z»", () => {
    expect(
      minimo,
      `package.json: engines.node es «${rango}»; el gate pide «>=X.Y.Z» (un piso exacto que se pueda comparar)`,
    ).not.toBeNull();
  });

  it(".nvmrc es una versión exacta y satisface engines.node", () => {
    expect(
      nvmrc,
      `.nvmrc: «${nvmrcCrudo.trim()}» no es una versión exacta X.Y.Z`,
    ).not.toBeNull();
    expect(
      noMenor(nvmrc as Version, minimo as Version),
      `.nvmrc (${texto(nvmrc as Version)}) no satisface engines.node (${rango}): el piso declarado y la versión que se prueba se contradicen`,
    ).toBe(true);
  });

  it("el mínimo declarado no baja de lo que el código exige", () => {
    // Si el día de mañana nadie importa un `.ts`, este piso deja de aplicar;
    // mientras alguien lo importe, bajarlo rompe el build del índice.
    expect(
      scriptsQueImportanTs.length,
      "ya no hay scripts que importen .ts: este piso ya no se deriva de nada; revisa el gate",
    ).toBeGreaterThan(0);
    expect(
      noMenor(minimo as Version, TYPE_STRIPPING_DESDE),
      `engines.node (${rango}) es menor que ${texto(TYPE_STRIPPING_DESDE)}, desde donde Node ejecuta .ts sin banderas, y ${scriptsQueImportanTs.join(", ")} importa(n) .ts`,
    ).toBe(true);
  });

  it("la CI tiene jobs con pnpm que ejercitar (si no, este gate no vigila nada)", () => {
    expect(jobsConNode.length).toBeGreaterThanOrEqual(4);
  });

  it.each(jobsConNode.map(([nombre, job]) => [nombre, job] as const))(
    "ci.yml · el job «%s» corre la versión de .nvmrc",
    (nombre, job) => {
      const pasos = (job.steps ?? []).filter((s) =>
        (s.uses ?? "").startsWith("actions/setup-node@"),
      );
      expect(
        pasos.length,
        `ci.yml: el job «${nombre}» usa pnpm sin un paso setup-node`,
      ).toBe(1);
      const con = pasos[0].with ?? {};
      expect(
        con["node-version-file"],
        `ci.yml: el job «${nombre}» declara node-version «${String(con["node-version"] ?? "—")}» en vez de leer .nvmrc: una segunda copia de la versión que se desfasa`,
      ).toBe(".nvmrc");
      expect(
        con["node-version"],
        `ci.yml: el job «${nombre}» tiene node-version y node-version-file a la vez`,
      ).toBeUndefined();
    },
  );
});
