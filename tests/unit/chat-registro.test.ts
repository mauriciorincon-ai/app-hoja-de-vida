// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  codigoCoincide,
  codigoDePrueba,
  generarCodigo,
  hashCodigo,
  secretoSesion,
} from "@/lib/chat-registro/codigo";
import {
  CODIGO_INTENTOS_MAX,
  CODIGO_VIGENCIA_MS,
  CUPO_VENTANA_HORAS,
  registroSchema,
  SESION_VIGENCIA_MS,
  TOPE_DIARIO_DEFECTO,
  verificacionConNombreSchema,
} from "@/lib/chat-registro/schemas";
import {
  cabeceraSetCookie,
  COOKIE_SESION,
  emitirSesion,
  leerSesion,
  sesionDeRequest,
} from "@/lib/chat-registro/sesion";
import { crearStoreEnMemoria, topeDiario } from "@/lib/chat-registro/store";

/**
 * Los motores puros de la barrera del chat (ADR-024): el código, la sesión
 * firmada y el almacén en memoria. Cada uno con su rojo: un código con un
 * dígito cambiado no coincide; una cookie con la firma alterada no se lee; un
 * intento de más agota el código.
 */

const SECRETO = "s".repeat(40);

afterEach(() => vi.unstubAllEnvs());

describe("el código", () => {
  it("tiene seis dígitos y cambia entre llamadas", () => {
    const a = generarCodigo();
    const b = generarCodigo();
    expect(a).toMatch(/^[0-9]{6}$/);
    expect(b).toMatch(/^[0-9]{6}$/);
    expect(
      new Set(Array.from({ length: 20 }, generarCodigo)).size,
    ).toBeGreaterThan(1);
  });

  it("el hash depende del código, del correo y del secreto; la comparación es exacta", () => {
    const h = hashCodigo("123456", "A@B.co", SECRETO);
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(hashCodigo("123456", "a@b.co", SECRETO)).toBe(h); // el correo se normaliza
    expect(codigoCoincide(h, hashCodigo("123456", "a@b.co", SECRETO))).toBe(
      true,
    );
    expect(codigoCoincide(h, hashCodigo("123457", "a@b.co", SECRETO))).toBe(
      false,
    );
    expect(codigoCoincide(h, hashCodigo("123456", "otro@b.co", SECRETO))).toBe(
      false,
    );
    expect(
      codigoCoincide(h, hashCodigo("123456", "a@b.co", "x".repeat(40))),
    ).toBe(false);
  });

  it("el secreto exige 32 caracteres y el código de prueba solo vale en memoria", () => {
    vi.stubEnv("CHAT_SESSION_SECRET", "corto");
    expect(secretoSesion()).toBeNull();
    vi.stubEnv("CHAT_SESSION_SECRET", SECRETO);
    expect(secretoSesion()).toBe(SECRETO);

    vi.stubEnv("CHAT_CODIGO_PRUEBA", "246810");
    vi.stubEnv("CHAT_GATE_STORE", "supabase");
    expect(codigoDePrueba(), "jamás con Supabase").toBeNull();
    vi.stubEnv("CHAT_GATE_STORE", "memory");
    expect(codigoDePrueba()).toBe("246810");
  });
});

describe("la sesión firmada", () => {
  it("se emite, se lee, y dura 30 días", () => {
    const ahora = 1_800_000_000_000;
    const { valor, sesion } = emitirSesion(
      { nombre: "Ana", email: "ana@x.co" },
      SECRETO,
      ahora,
    );
    expect(sesion.exp).toBe(ahora + SESION_VIGENCIA_MS);
    expect(leerSesion(valor, SECRETO, ahora)).toEqual(sesion);
    expect(
      leerSesion(valor, SECRETO, ahora + SESION_VIGENCIA_MS + 1),
      "vencida",
    ).toBeNull();
  });

  it("rechaza firma alterada, secreto distinto, payload manipulado y basura", () => {
    const { valor } = emitirSesion(
      { nombre: "Ana", email: "ana@x.co" },
      SECRETO,
    );
    const [payload, firma] = valor.split(".");
    expect(leerSesion(`${payload}.${firma.slice(0, -1)}x`, SECRETO)).toBeNull();
    expect(leerSesion(valor, "z".repeat(40))).toBeNull();
    const otroPayload = Buffer.from(
      JSON.stringify({
        nombre: "Eva",
        email: "eva@x.co",
        exp: Date.now() + 1000,
      }),
    ).toString("base64url");
    expect(
      leerSesion(`${otroPayload}.${firma}`, SECRETO),
      "payload cambiado",
    ).toBeNull();
    expect(leerSesion("", SECRETO)).toBeNull();
    expect(leerSesion("sin-punto", SECRETO)).toBeNull();
    expect(leerSesion(null, SECRETO)).toBeNull();
  });

  it("se lee desde la cabecera Cookie de una Request y la Set-Cookie es httpOnly", () => {
    const { valor } = emitirSesion(
      { nombre: "Ana", email: "ana@x.co" },
      SECRETO,
    );
    const req = new Request("http://localhost/api/chat", {
      headers: {
        cookie: `otra=1; ${COOKIE_SESION}=${encodeURIComponent(valor)}`,
      },
    });
    expect(sesionDeRequest(req, SECRETO)?.email).toBe("ana@x.co");
    expect(
      sesionDeRequest(new Request("http://localhost/"), SECRETO),
    ).toBeNull();
    const set = cabeceraSetCookie(valor);
    expect(set).toContain(`${COOKIE_SESION}=`);
    expect(set).toContain("HttpOnly");
    expect(set).toContain("SameSite=Lax");
    expect(set).toContain(`Max-Age=${SESION_VIGENCIA_MS / 1000}`);
  });
});

describe("el almacén en memoria", () => {
  const coincide = (a: string, b: string) => a === b;

  it("verifica y consume: el segundo uso del mismo código ya no vale", async () => {
    const s = crearStoreEnMemoria();
    await s.guardarCodigo("a@b.co", "h1");
    expect(await s.verificarCodigo("a@b.co", "h1", coincide)).toEqual({
      ok: true,
    });
    expect(await s.verificarCodigo("a@b.co", "h1", coincide)).toEqual({
      ok: false,
      motivo: "sin_codigo",
    });
  });

  it("vence a los diez minutos y agota a los cinco intentos", async () => {
    const s = crearStoreEnMemoria();
    const t0 = 1_000_000;
    await s.guardarCodigo("a@b.co", "h1", t0);
    expect(
      await s.verificarCodigo(
        "a@b.co",
        "h1",
        coincide,
        t0 + CODIGO_VIGENCIA_MS,
      ),
    ).toEqual({
      ok: false,
      motivo: "vencido",
    });

    await s.guardarCodigo("c@d.co", "h2", t0);
    for (let i = 0; i < CODIGO_INTENTOS_MAX; i++) {
      expect(
        await s.verificarCodigo("c@d.co", "malo", coincide, t0 + 1),
      ).toEqual({
        ok: false,
        motivo: "incorrecto",
      });
    }
    expect(
      await s.verificarCodigo("c@d.co", "h2", coincide, t0 + 1),
      "el sexto intento, aun correcto, ya no entra",
    ).toEqual({ ok: false, motivo: "agotado" });
  });

  it("registra entradas tal cual", async () => {
    const s = crearStoreEnMemoria();
    await s.registrar({
      nombre: "Ana",
      email: "a@b.co",
      locale: "es",
      pregunta: "¿Qué hizo en Vesting?",
      respuesta: "Diseñó la plataforma [1].",
      fuentes: [{ titulo: "Vesting", ancla: "/proyectos/vesting" }],
      modo: "ia",
    });
    expect(s.entradas).toHaveLength(1);
    expect(s.entradas[0].modo).toBe("ia");
  });
});

describe("el cupo de cada persona (2026-09-26)", () => {
  const entrada = (email: string) => ({
    nombre: "Ana",
    email,
    locale: "es" as const,
    pregunta: "¿Qué hizo en Vesting?",
    respuesta: "…",
    fuentes: [],
    modo: "ia" as const,
  });
  const HORA = 60 * 60_000;

  it("llega al tope con la pregunta número `limite` de las últimas 24 horas", async () => {
    const store = crearStoreEnMemoria();
    const ahora = 1_000 * HORA;
    for (let i = 0; i < 2; i++)
      await store.registrar(entrada("ana@prueba.co"), ahora - i * HORA);
    expect(await store.cupo("ana@prueba.co", 3, ahora)).toBe("ok");
    await store.registrar(entrada("ana@prueba.co"), ahora);
    expect(await store.cupo("ana@prueba.co", 3, ahora)).toBe("tope");
    // Otra persona no hereda el tope ajeno.
    expect(await store.cupo("beto@prueba.co", 3, ahora)).toBe("ok");
  });

  it("lo de hace más de 24 horas ya no cuenta, y el correo no distingue mayúsculas", async () => {
    const store = crearStoreEnMemoria();
    const ahora = 1_000 * HORA;
    await store.registrar(
      entrada("Ana@Prueba.co"),
      ahora - CUPO_VENTANA_HORAS * HORA,
    );
    await store.registrar(entrada("ana@prueba.co"), ahora - HORA);
    expect(await store.cupo("ANA@prueba.co", 2, ahora)).toBe("ok");
    await store.registrar(entrada("ana@prueba.co"), ahora);
    expect(await store.cupo("ana@prueba.co", 2, ahora)).toBe("tope");
  });

  it("un correo bloqueado no pregunta nunca, aunque no haya preguntado nada", async () => {
    const store = crearStoreEnMemoria();
    store.bloqueados.add("Molesto@Prueba.co");
    expect(await store.cupo("molesto@prueba.co", 20)).toBe("bloqueado");
  });

  it("CHAT_TOPE_DIARIO cambia el tope; un valor inválido cae a 20, jamás apaga la protección", () => {
    vi.stubEnv("CHAT_TOPE_DIARIO", "");
    expect(topeDiario()).toBe(TOPE_DIARIO_DEFECTO);
    expect(TOPE_DIARIO_DEFECTO).toBe(20);
    vi.stubEnv("CHAT_TOPE_DIARIO", "35");
    expect(topeDiario()).toBe(35);
    for (const invalido of ["0", "-5", "abc", "2.5", "100000"]) {
      vi.stubEnv("CHAT_TOPE_DIARIO", invalido);
      expect(topeDiario(), invalido).toBe(TOPE_DIARIO_DEFECTO);
    }
  });
});

describe("los esquemas del borde", () => {
  it("el registro exige aceptar el aviso y un correo válido; el honeypot vacío", () => {
    expect(
      registroSchema.safeParse({
        nombre: "Ana",
        email: "ANA@x.co",
        locale: "es",
        acepta: true,
      }).data?.email,
    ).toBe("ana@x.co");
    expect(
      registroSchema.safeParse({
        nombre: "Ana",
        email: "ana@x.co",
        locale: "es",
        acepta: false,
      }).success,
    ).toBe(false);
    expect(
      registroSchema.safeParse({
        nombre: "A",
        email: "ana@x.co",
        locale: "es",
        acepta: true,
      }).success,
    ).toBe(false);
    expect(
      registroSchema.safeParse({
        nombre: "Ana",
        email: "no-es-correo",
        locale: "es",
        acepta: true,
      }).success,
    ).toBe(false);
    expect(
      registroSchema.safeParse({
        nombre: "Ana",
        email: "ana@x.co",
        locale: "es",
        acepta: true,
        website: "bot",
      }).success,
    ).toBe(false);
  });

  it("la verificación exige seis dígitos y el nombre", () => {
    expect(
      verificacionConNombreSchema.safeParse({
        email: "a@b.co",
        codigo: "123456",
        nombre: "Ana",
      }).success,
    ).toBe(true);
    expect(
      verificacionConNombreSchema.safeParse({
        email: "a@b.co",
        codigo: "12345",
        nombre: "Ana",
      }).success,
    ).toBe(false);
    expect(
      verificacionConNombreSchema.safeParse({
        email: "a@b.co",
        codigo: "abcdef",
        nombre: "Ana",
      }).success,
    ).toBe(false);
    expect(
      verificacionConNombreSchema.safeParse({
        email: "a@b.co",
        codigo: "123456",
      }).success,
    ).toBe(false);
  });
});
