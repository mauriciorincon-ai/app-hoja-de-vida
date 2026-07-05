import { describe, expect, it } from "vitest";
import {
  appsSchema,
  cvSchema,
  parseApps,
  parseCv,
  solicitudSchema,
} from "@/lib/schemas";

const cvValido = {
  identidad: {
    nombre: "Nombre",
    eyebrow: "Eyebrow",
    titular: "Titular",
    resumen: "Resumen",
    ubicacion: "Colombia",
    email: "test@example.com",
    enlaces: [{ etiqueta: "GitHub", url: "https://github.com/x" }],
  },
  trayectoria: [
    {
      periodo: "2026",
      rol: "Rol",
      organizacion: "Org",
      descripcion: "Desc",
      actual: true,
    },
  ],
  logros: [{ valor: 10, etiqueta: "Etiqueta", descripcion: "Desc" }],
  proyectos: [{ nombre: "Proyecto", resumen: "Resumen" }],
};

describe("cvSchema", () => {
  it("accepts a complete CV and applies defaults", () => {
    const cv = cvSchema.parse(cvValido);
    expect(cv.logros[0].prefijo).toBe("");
    expect(cv.logros[0].sufijo).toBe("");
    expect(cv.logros[0].decimales).toBe(0);
    expect(cv.proyectos[0].stack).toEqual([]);
    expect(cv.proyectos[0].destacado).toBe(false);
  });

  it("rejects a CV without required identity fields", () => {
    const { titular: _titular, ...identidadRota } = cvValido.identidad;
    expect(() =>
      parseCv({ ...cvValido, identidad: identidadRota }, "test.yaml"),
    ).toThrowError(/test\.yaml[\s\S]*identidad\.titular/);
  });

  it("rejects empty trayectoria", () => {
    expect(() =>
      parseCv({ ...cvValido, trayectoria: [] }, "test.yaml"),
    ).toThrowError(/trayectoria/);
  });

  it("rejects an invalid contact email", () => {
    const identidad = { ...cvValido.identidad, email: "no-es-email" };
    expect(() => cvSchema.parse({ ...cvValido, identidad })).toThrow();
  });
});

const appsValidas = {
  apps: [
    {
      id: "hoja-de-vida",
      estado: "en-construccion",
      nombre: { es: "CV Viva", en: "Living CV" },
      descripcion: { es: "Desc", en: "Desc" },
      solicitable: false,
    },
  ],
};

describe("appsSchema", () => {
  it("accepts a valid showcase", () => {
    const apps = appsSchema.parse(appsValidas);
    expect(apps.apps).toHaveLength(1);
  });

  it("rejects an unknown estado", () => {
    const roto = {
      apps: [{ ...appsValidas.apps[0], estado: "lanzada" }],
    };
    expect(() => parseApps(roto, "apps.yaml")).toThrowError(/estado/);
  });

  it("rejects a non-kebab-case id", () => {
    const roto = { apps: [{ ...appsValidas.apps[0], id: "Hoja De Vida" }] };
    expect(() => appsSchema.parse(roto)).toThrow();
  });

  it("requires both languages in localized fields", () => {
    const roto = {
      apps: [{ ...appsValidas.apps[0], nombre: { es: "Solo español" } }],
    };
    expect(() => appsSchema.parse(roto)).toThrow();
  });
});

describe("solicitudSchema", () => {
  const solicitudValida = {
    nombre: "Ana",
    email: "ana@example.com",
    app: "hoja-de-vida",
    mensaje: "Quiero probarla",
    website: "",
  };

  it("accepts a valid request and trims fields", () => {
    const s = solicitudSchema.parse({
      ...solicitudValida,
      nombre: "  Ana  ",
    });
    expect(s.nombre).toBe("Ana");
  });

  it("defaults mensaje to empty string", () => {
    const { mensaje: _m, ...sinMensaje } = solicitudValida;
    expect(solicitudSchema.parse(sinMensaje).mensaje).toBe("");
  });

  it("rejects an invalid email", () => {
    expect(() =>
      solicitudSchema.parse({ ...solicitudValida, email: "nope" }),
    ).toThrow();
  });

  it("rejects a filled honeypot (website)", () => {
    expect(() =>
      solicitudSchema.parse({
        ...solicitudValida,
        website: "http://spam.example",
      }),
    ).toThrow();
  });

  it("rejects oversized mensaje", () => {
    expect(() =>
      solicitudSchema.parse({ ...solicitudValida, mensaje: "x".repeat(1001) }),
    ).toThrow();
  });
});
