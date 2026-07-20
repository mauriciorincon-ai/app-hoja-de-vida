-- ════════════════════════════════════════════════════════════════════════════
-- Sprint 004 — Votación anónima del roadmap (primera capa de datos de CV Viva)
-- ADR-011. Patrón: wiki/patterns/supabase-en-ci-y-cloud.md (antídotos K3–K6 de
-- app-inmobiliaria S1). Regla dura: CERO PII (Ley 1581) — el voto es
-- (app, feature, timestamp) y nada más. Ni IP, ni identidad, ni user-agent.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Tabla ───────────────────────────────────────────────────────────────────
-- Una fila por voto emitido. El conteo es un agregado (COUNT), no un contador
-- mutable: así no hay carrera de escritura sobre una celda, y el histórico
-- queda intacto para auditoría. `app` y `feature` son slugs kebab-case que se
-- validan contra data/apps.yaml en el route handler (defensa en el borde) y
-- por longitud/forma aquí (defensa en la BD).
create table if not exists public.votes (
  id         bigint generated always as identity primary key,
  app        text        not null check (char_length(app) between 1 and 60
                                          and app ~ '^[a-z0-9-]+$'),
  feature    text        not null check (char_length(feature) between 1 and 60
                                          and feature ~ '^[a-z0-9-]+$'),
  created_at timestamptz not null default now()
);

comment on table public.votes is
  'Votos anónimos del roadmap (S4). CERO PII: solo (app, feature, created_at). '
  'El conteo es COUNT(*) agregado, no un contador mutable.';

-- Índice para el agregado por (app, feature) — el GROUP BY del conteo.
create index if not exists votes_app_feature_idx
  on public.votes (app, feature);

-- ── RLS: encendida y SIN políticas ──────────────────────────────────────────
-- Con RLS activa y cero políticas, NINGÚN rol del Data API (anon, authenticated)
-- puede leer ni escribir la tabla directamente. Todo acceso pasa por las RPC
-- SECURITY DEFINER de abajo, que corren como owner (postgres) y saltan RLS de
-- forma controlada y atómica. Esta es la superficie mínima: el anon jamás toca
-- la tabla, solo ejecuta dos funciones acotadas.
alter table public.votes enable row level security;

-- ── RPC de escritura: emitir un voto (atómico) ──────────────────────────────
-- SECURITY DEFINER: corre como el owner, no como el llamador anon. Inserta y
-- devuelve el conteo REAL resultante para esa (app, feature) en la MISMA
-- transacción — el número que ve el visitante es el de la BD tras su voto,
-- jamás un optimistic UI. Sin dedup server-side por diseño (no hay identidad
-- que deduplicar sin PII); el dedup de mejor-esfuerzo vive en el cliente
-- (localStorage) y el anti-abuso duro en el rate limit por IP del route.
create or replace function public.emitir_voto(p_app text, p_feature text)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_conteo bigint;
begin
  -- Validación en la BD (además de la del route): forma y longitud del slug.
  if p_app is null or p_app !~ '^[a-z0-9-]+$' or char_length(p_app) > 60 then
    raise exception 'app inválida' using errcode = '22023';
  end if;
  if p_feature is null or p_feature !~ '^[a-z0-9-]+$' or char_length(p_feature) > 60 then
    raise exception 'feature inválida' using errcode = '22023';
  end if;

  insert into public.votes (app, feature)
  values (p_app, p_feature);

  select count(*) into v_conteo
  from public.votes
  where app = p_app and feature = p_feature;

  return v_conteo;
end;
$$;

comment on function public.emitir_voto(text, text) is
  'Inserta un voto y devuelve el conteo real resultante para (app, feature), '
  'atómico. SECURITY DEFINER: el anon lo ejecuta sin tocar la tabla.';

-- ── RPC de lectura: conteo agregado de todos los votos ──────────────────────
-- Devuelve una fila por (app, feature) con su total. La sección de roadmap la
-- llama al montar para pintar los contadores REALES. Si esta función o la BD
-- fallan, el route devuelve error y la UI muestra "votación no disponible" —
-- jamás un cero inventado ni un caché congelado.
create or replace function public.conteo_votos()
returns table (app text, feature text, total bigint)
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select app, feature, count(*) as total
  from public.votes
  group by app, feature;
$$;

comment on function public.conteo_votos() is
  'Conteo agregado (app, feature, total) de todos los votos. Lectura pública '
  'del roadmap. SECURITY DEFINER + STABLE.';

-- ── GRANTs / REVOKEs EXPLÍCITOS (antídoto K3–K6) ────────────────────────────
-- El stack de Supabase (local y cloud) NO otorga privilegios por defecto a los
-- roles del Data API sobre entidades creadas por migración. Se declara TODO de
-- forma explícita — la migración es la única fuente de verdad de la superficie
-- de acceso. Doblemente importante con SECURITY DEFINER: sin estos GRANTs de
-- EXECUTE, el anon no podría ni llamar a las RPC.

-- Nadie del Data API toca la tabla directamente (RLS ya lo bloquea; esto lo
-- hace explícito y resistente a cambios de default).
revoke all on table public.votes from anon, authenticated;

-- El anon (visitante público) solo puede EJECUTAR las dos RPC acotadas.
revoke all on function public.emitir_voto(text, text) from public;
revoke all on function public.conteo_votos()           from public;
grant execute on function public.emitir_voto(text, text) to anon;
grant execute on function public.conteo_votos()           to anon;

-- El service_role (operación/scripts server-side) mantiene acceso pleno a la
-- tabla para auditoría y mantenimiento; también necesita su grant explícito.
grant all    on table    public.votes                    to service_role;
grant execute on function public.emitir_voto(text, text) to service_role;
grant execute on function public.conteo_votos()           to service_role;
