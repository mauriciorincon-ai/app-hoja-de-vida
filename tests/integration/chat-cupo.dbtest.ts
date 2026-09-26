import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * EL CUPO DEL CHAT contra Postgres REAL (2026-09-26): la RPC `chat_cupo` de
 * `supabase/migrations/20260926120000_chat_cupo.sql`. La memoria de los tests
 * de integración imita el contrato; esto prueba el SQL que corre en
 * producción: que cuente las filas del registro de ese correo en la ventana,
 * que la lista de bloqueados mande, y que el anon no toque esa lista.
 *
 * La fila de `chat_bloqueados` la escribe `psql` dentro del contenedor de
 * Postgres local (superusuario de una base de prueba desechable), no la
 * service_role: el anon no puede, a propósito, y eso también se prueba.
 *
 * Requiere SUPABASE_URL + SUPABASE_ANON_KEY (desde `supabase status -o env`) y
 * el contenedor `supabase_db_app-hoja-de-vida`. Corre con `pnpm test:db`.
 */

const CONTENEDOR = "supabase_db_app-hoja-de-vida";

function sql(consulta: string): string {
  return execFileSync(
    "docker",
    ["exec", CONTENEDOR, "psql", "-U", "postgres", "-tAc", consulta],
    { encoding: "utf8" },
  ).trim();
}

beforeAll(() => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error(
      "SUPABASE_URL/SUPABASE_ANON_KEY ausentes: exporta el entorno con " +
        "`supabase status -o env` antes de `pnpm test:db`.",
    );
  }
});

const anon = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

/** Un correo por corrida: el registro local no se limpia entre corridas. */
const unico = (quien: string) =>
  `${quien}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}@cupo.test`;

async function registrar(email: string) {
  const { error } = await anon.rpc("chat_registrar", {
    p_nombre: "Prueba del cupo",
    p_email: email,
    p_locale: "es",
    p_pregunta: "¿Qué hizo en Vesting?",
    p_respuesta: "Diseñó la plataforma [1].",
    p_fuentes: [],
    p_modo: "ia",
    p_proveedor: "mock",
    p_modelo: "mock",
    p_tokens_in: 1,
    p_tokens_out: 1,
    p_ms: 1,
  });
  expect(error).toBeNull();
}

async function cupo(email: string, limite: number, horas = 24) {
  return anon.rpc("chat_cupo", {
    p_email: email,
    p_limite: limite,
    p_horas: horas,
  });
}

const bloqueado = unico("bloqueado");
afterAll(() => {
  sql(`delete from public.chat_bloqueados where email = '${bloqueado}'`);
});

describe("chat_cupo (RPC, anon)", () => {
  it("cuenta las preguntas de ese correo: con `limite` ya hechas, 'tope'", async () => {
    const email = unico("ana");
    for (let i = 0; i < 3; i++) await registrar(email);
    expect((await cupo(email, 4)).data).toBe("ok");
    expect((await cupo(email, 3)).data).toBe("tope");
    // Sin distinguir mayúsculas, y sin heredar el tope de otra persona.
    expect((await cupo(email.toUpperCase(), 3)).data).toBe("tope");
    expect((await cupo(unico("beto"), 3)).data).toBe("ok");
  });

  it("lo que quedó fuera de la ventana ya no cuenta", async () => {
    const email = unico("vieja");
    await registrar(email);
    await registrar(email);
    // Las dos filas envejecen 25 horas: fuera de la ventana de 24.
    sql(
      `update public.chat_registro set creado_en = now() - interval '25 hours' where email = '${email}'`,
    );
    expect((await cupo(email, 2)).data).toBe("ok");
    await registrar(email);
    expect((await cupo(email, 1)).data).toBe("tope");
  });

  it("un correo de la lista es 'bloqueado' aunque no haya preguntado nada", async () => {
    expect((await cupo(bloqueado, 20)).data).toBe("ok");
    sql(
      `insert into public.chat_bloqueados (email, motivo) values ('${bloqueado.toUpperCase()}', 'prueba')`,
    );
    expect((await cupo(bloqueado, 20)).data).toBe("bloqueado");
  });

  it("rechaza un límite o una ventana fuera de rango (22023)", async () => {
    const email = unico("rango");
    for (const [limite, horas] of [
      [0, 24],
      [1001, 24],
      [20, 0],
      [20, 169],
    ]) {
      const { error } = await cupo(email, limite, horas);
      expect(error?.code, `${limite}/${horas}`).toBe("22023");
    }
  });
});

describe("superficie de chat_bloqueados (anon directo)", () => {
  it("el anon NO puede leer ni escribir la lista (42501)", async () => {
    const lectura = await anon.from("chat_bloqueados").select("*").limit(1);
    expect(lectura.error?.code).toBe("42501");
    const escritura = await anon
      .from("chat_bloqueados")
      .insert({ email: unico("colado") });
    expect(escritura.error?.code).toBe("42501");
  });
});
