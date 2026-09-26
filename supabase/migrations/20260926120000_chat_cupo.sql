-- ════════════════════════════════════════════════════════════════════════════
-- El cupo del chat (2026-09-26, pedido del dueño): un máximo de preguntas por
-- persona cada 24 horas, y una lista de correos bloqueados.
--
-- Por qué aquí y no en memoria: el límite por minuto vive en la memoria de
-- cada servidor, y Vercel puede tener varios a la vez. El registro de cada
-- pregunta ya está en `chat_registro`: contar ahí vale igual en todos.
--
-- Mismo patrón que el resto (ADR-011 / ADR-024): RLS encendida y SIN
-- políticas, todo acceso del anon por RPC SECURITY DEFINER, GRANTs explícitos.
-- El anon NO lee ni escribe `chat_bloqueados`: el dueño agrega filas desde el
-- panel de Supabase (Table Editor), con service_role.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Correos bloqueados ──────────────────────────────────────────────────────
-- Una fila por correo. Se compara sin distinguir mayúsculas, así que da igual
-- cómo se escriba en el panel.
create table if not exists public.chat_bloqueados (
  email      text        primary key check (char_length(email) between 3 and 254),
  motivo     text,
  creado_en  timestamptz not null default now()
);

comment on table public.chat_bloqueados is
  'Correos sin acceso al chat de CV Viva. Los agrega el dueño desde el panel; '
  'el chat y el registro los consultan por la RPC chat_cupo.';

alter table public.chat_bloqueados enable row level security;

-- ── RPC: ¿puede preguntar esta persona? ─────────────────────────────────────
-- Devuelve 'bloqueado' | 'tope' | 'ok'. El bloqueo manda sobre el tope. Cuenta
-- TODAS las filas del registro de ese correo en la ventana (ia, offtopic y
-- local): cada pregunta respondida, sin importar cómo.
create or replace function public.chat_cupo(
  p_email text, p_limite int, p_horas int
) returns text
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_n int;
begin
  if p_email is null or char_length(p_email) < 3 or char_length(p_email) > 254 then
    raise exception 'email inválido' using errcode = '22023';
  end if;
  if p_limite is null or p_limite < 1 or p_limite > 1000 then
    raise exception 'límite inválido' using errcode = '22023';
  end if;
  if p_horas is null or p_horas < 1 or p_horas > 168 then
    raise exception 'ventana inválida' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.chat_bloqueados where lower(email) = lower(p_email)
  ) then
    return 'bloqueado';
  end if;
  select count(*) into v_n
    from public.chat_registro
   where email = lower(p_email)
     and creado_en > now() - make_interval(hours => p_horas);
  if v_n >= p_limite then
    return 'tope';
  end if;
  return 'ok';
end;
$$;

-- ── GRANTs / REVOKEs EXPLÍCITOS ─────────────────────────────────────────────
revoke all on table public.chat_bloqueados from anon, authenticated;
revoke all on function public.chat_cupo(text, int, int) from public;

grant execute on function public.chat_cupo(text, int, int) to anon;

grant all on table public.chat_bloqueados to service_role;
grant execute on function public.chat_cupo(text, int, int) to service_role;
