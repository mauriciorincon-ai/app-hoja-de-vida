-- ════════════════════════════════════════════════════════════════════════════
-- Chat con nombre y correo (ADR-024) — la barrera y el registro del chat.
-- Patrón ADR-011: RLS encendida y SIN políticas, todo acceso por RPC
-- SECURITY DEFINER, GRANTs explícitos. DIFERENCIA con `votes`: estas dos
-- tablas SÍ guardan datos personales (nombre, correo, pregunta, respuesta).
-- El visitante los entrega con un aviso de tratamiento (Ley 1581) marcado en
-- el formulario, para un fin declarado: que el dueño sepa quién pregunta y qué
-- se le respondió. El anon jamás LEE estas tablas: solo ejecuta las tres RPC
-- de escritura/verificación. La lectura es del dueño, con service_role, desde
-- el panel de Supabase.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Códigos de un solo uso ───────────────────────────────────────────────────
-- Una fila por correo: el hash (sha256 con secreto de servidor) del último
-- código emitido, su vencimiento y cuántos intentos fallidos lleva. El código
-- en claro nunca llega a la BD.
create table if not exists public.chat_codigos (
  email      text        primary key check (char_length(email) between 3 and 254),
  hash       text        not null check (hash ~ '^[0-9a-f]{64}$'),
  expira_en  timestamptz not null,
  intentos   int         not null default 0 check (intentos >= 0),
  creado_en  timestamptz not null default now()
);

comment on table public.chat_codigos is
  'Códigos de verificación del chat, solo su hash. Una fila por correo; '
  'se borra al verificar, al vencer o al agotar intentos.';

-- ── Registro de conversaciones ───────────────────────────────────────────────
-- Una fila por pregunta respondida: quién, qué preguntó, qué se respondió,
-- con qué fuentes, en qué modo (ia · offtopic · local), con qué proveedor y
-- costo. Lo lee el dueño; ningún visitante.
create table if not exists public.chat_registro (
  id         bigint generated always as identity primary key,
  creado_en  timestamptz not null default now(),
  nombre     text        not null check (char_length(nombre) between 1 and 120),
  email      text        not null check (char_length(email) between 3 and 254),
  locale     text        not null check (locale in ('es', 'en')),
  pregunta   text        not null check (char_length(pregunta) between 1 and 800),
  respuesta  text        not null check (char_length(respuesta) between 1 and 8000),
  fuentes    jsonb       not null default '[]'::jsonb,
  modo       text        not null check (modo in ('ia', 'offtopic', 'local')),
  proveedor  text,
  modelo     text,
  tokens_in  int,
  tokens_out int,
  ms         int
);

comment on table public.chat_registro is
  'Registro del chat de CV Viva: quién preguntó, qué, y qué se respondió. '
  'Datos personales entregados con aviso (Ley 1581); lectura solo del dueño.';

create index if not exists chat_registro_email_idx on public.chat_registro (email);
create index if not exists chat_registro_creado_idx on public.chat_registro (creado_en desc);

-- ── RLS: encendida y SIN políticas ──────────────────────────────────────────
alter table public.chat_codigos  enable row level security;
alter table public.chat_registro enable row level security;

-- ── RPC: guardar (o reemplazar) el código de un correo ──────────────────────
create or replace function public.chat_guardar_codigo(
  p_email text, p_hash text, p_vigencia_s int
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_email is null or char_length(p_email) < 3 or char_length(p_email) > 254 then
    raise exception 'email inválido' using errcode = '22023';
  end if;
  if p_hash is null or p_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'hash inválido' using errcode = '22023';
  end if;
  if p_vigencia_s is null or p_vigencia_s < 60 or p_vigencia_s > 3600 then
    raise exception 'vigencia inválida' using errcode = '22023';
  end if;
  insert into public.chat_codigos (email, hash, expira_en, intentos)
  values (lower(p_email), p_hash, now() + make_interval(secs => p_vigencia_s), 0)
  on conflict (email) do update
    set hash = excluded.hash, expira_en = excluded.expira_en, intentos = 0,
        creado_en = now();
end;
$$;

-- ── RPC: verificar y consumir ───────────────────────────────────────────────
-- Devuelve 'ok' | 'sin_codigo' | 'vencido' | 'agotado' | 'incorrecto'. Atómico:
-- el código correcto se borra en la misma transacción; el incorrecto suma un
-- intento; al agotar los intentos la fila se borra y hay que pedir otro.
create or replace function public.chat_verificar_codigo(
  p_email text, p_hash text, p_intentos_max int
) returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v record;
begin
  select * into v from public.chat_codigos where email = lower(p_email) for update;
  if not found then
    return 'sin_codigo';
  end if;
  if v.expira_en <= now() then
    delete from public.chat_codigos where email = lower(p_email);
    return 'vencido';
  end if;
  if v.intentos >= p_intentos_max then
    delete from public.chat_codigos where email = lower(p_email);
    return 'agotado';
  end if;
  if v.hash <> p_hash then
    update public.chat_codigos set intentos = intentos + 1 where email = lower(p_email);
    return 'incorrecto';
  end if;
  delete from public.chat_codigos where email = lower(p_email);
  return 'ok';
end;
$$;

-- ── RPC: registrar una pregunta respondida ──────────────────────────────────
create or replace function public.chat_registrar(
  p_nombre text, p_email text, p_locale text, p_pregunta text, p_respuesta text,
  p_fuentes jsonb, p_modo text, p_proveedor text, p_modelo text,
  p_tokens_in int, p_tokens_out int, p_ms int
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.chat_registro
    (nombre, email, locale, pregunta, respuesta, fuentes, modo,
     proveedor, modelo, tokens_in, tokens_out, ms)
  values
    (p_nombre, lower(p_email), p_locale, p_pregunta, left(p_respuesta, 8000),
     coalesce(p_fuentes, '[]'::jsonb), p_modo,
     p_proveedor, p_modelo, p_tokens_in, p_tokens_out, p_ms);
end;
$$;

-- ── GRANTs / REVOKEs EXPLÍCITOS ─────────────────────────────────────────────
revoke all on table public.chat_codigos  from anon, authenticated;
revoke all on table public.chat_registro from anon, authenticated;

revoke all on function public.chat_guardar_codigo(text, text, int)      from public;
revoke all on function public.chat_verificar_codigo(text, text, int)    from public;
revoke all on function public.chat_registrar(text, text, text, text, text, jsonb, text, text, text, int, int, int) from public;

grant execute on function public.chat_guardar_codigo(text, text, int)   to anon;
grant execute on function public.chat_verificar_codigo(text, text, int) to anon;
grant execute on function public.chat_registrar(text, text, text, text, text, jsonb, text, text, text, int, int, int) to anon;

grant all on table public.chat_codigos  to service_role;
grant all on table public.chat_registro to service_role;
grant execute on function public.chat_guardar_codigo(text, text, int)   to service_role;
grant execute on function public.chat_verificar_codigo(text, text, int) to service_role;
grant execute on function public.chat_registrar(text, text, text, text, text, jsonb, text, text, text, int, int, int) to service_role;
