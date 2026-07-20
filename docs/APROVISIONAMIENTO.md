# Aprovisionamiento — CV Viva (runbook [TÚ]/[CLAUDE])

> Runbook del Sprint 004 (primera capa de datos de la app). Sigue la plantilla del kit
> (`kit-app/docs/APROVISIONAMIENTO.plantilla.md`, v1.6.4). **[TÚ]** = solo el dueño de las cuentas
> (navegador, logins, pagos). **[CLAUDE]** = comando no interactivo que corre el agente.
> **Regla de oro:** las claves privilegiadas (service key, tokens) JAMÁS se pegan en el chat ni se
> commitean — van a `.env.local` (gitignored) o a las env vars de Vercel. El hook de gitleaks
> vigila, pero la regla es no llegar ahí.

## 1. Mapa del despliegue (S4)

| Pieza         | Servicio                           | Qué es                                                                |
| ------------- | ---------------------------------- | --------------------------------------------------------------------- |
| Base de datos | **Supabase free** (proyecto nuevo) | tabla `votes` + 2 RPC (votar / contar) — votación anónima del roadmap |
| Hosting       | Vercel Hobby (ya opera)            | el sitio sigue SSG; la votación es un route handler                   |
| Email         | Resend (ya opera)                  | formulario "solicitar acceso" (S1)                                    |
| LLM           | Groq free (heredado S3)            | el chat con la HV — este sprint NO lo toca, salvo el humo de la key   |

**Orden de los bloques:** primero la BD (sin ella la votación no tiene dónde escribir), luego el
humo de la GROQ regenerada (deuda del S3).

## 2. Con qué cuenta entrar

| Servicio | Identidad                 | Por qué                                                                      |
| -------- | ------------------------- | ---------------------------------------------------------------------------- |
| Supabase | SSO GitHub                | servicio satélite; el punto único de falla es la cuenta GitHub → exígele 2FA |
| Groq     | login de console.groq.com | satélite; free tier                                                          |

## 3. Bloques

### Bloque A — Proyecto Supabase (BD de la votación) · ~8 min

**[TÚ]** En [supabase.com/dashboard](https://supabase.com/dashboard):

1. **New project** en tu org. **Verifica que el free tier permite este 2º proyecto activo** (el
   plan free admite 2 proyectos activos por org; si el otro proyecto los agota, avísame ANTES de
   seguir — no prometo la feature sin BD). Región: la más cercana (p. ej. `East US`).
2. Nombre `cv-viva-votacion`, contraseña de BD fuerte (guárdala en tu gestor, no aquí).
3. Cuando esté listo: **Project Settings → API**. Copia:
   - `Project URL` → será `SUPABASE_URL`
   - `anon` `public` key → será `SUPABASE_ANON_KEY`
   - `service_role` key → **solo** a `.env.local` y Vercel (NUNCA al chat ni al repo)
4. Pega en `.env.local` (créalo si no existe, está gitignored) las tres variables, una por línea:
   - `SUPABASE_URL` → el Project URL del paso 3
   - `SUPABASE_ANON_KEY` → la anon public key del paso 3
   - `VOTACION_ENABLED` → `true`

   (El nombre exacto de cada variable está en `.env.example`; cópialo de ahí y pega el valor a la
   derecha del `=`.)

**[CLAUDE]** Aplico la migración al proyecto cloud (link + push):

```bash
supabase link --project-ref <ref-del-proyecto>   # el ref sale de la URL del dashboard
supabase db push                                  # aplica supabase/migrations/*_votes.sql
```

**[CLAUDE]** Humo de la credencial (antídoto v1.7.4 — una key inválida se descubre HOY):

```bash
curl -s -o /dev/null -w '%{http_code}\n' "$SUPABASE_URL/rest/v1/" \
  -H "apikey: $SUPABASE_ANON_KEY"     # → 200
```

**Verificación del bloque (observable):** el humo devuelve `200` y en el dashboard
(**Table editor → votes**) la tabla existe con RLS activa. La superficie de acceso ya está
verificada en local: el anon ejecuta las RPC pero NO puede leer/escribir la tabla directamente
(`permission denied` — antídoto K3–K6).

### Bloque B — GROQ_API_KEY regenerada (deuda del S3) · ~3 min

**[TÚ]** En [console.groq.com](https://console.groq.com) → **API Keys** → genera una nueva
(la del S3 devolvía 401). Pégala en `.env.local` y en Vercel:

```
GROQ_API_KEY=<nueva key>
```

**[CLAUDE]** Humo (v1.7.4):

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"     # → 200
```

**Verificación del bloque:** el humo devuelve `200`; en el chat de la preview una pregunta on-topic
responde en modo IA (no fallback). Si sigue 401 → la key se copió mal o no se guardó.

### Bloque C — Vercel env vars (producción) · ~4 min

**[TÚ]** En Vercel → el proyecto → **Settings → Environment Variables**, añade para
**Production** y **Preview**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GROQ_API_KEY`,
`VOTACION_ENABLED=true`. (El `service_role` NO hace falta en runtime — el route usa solo el anon
key vía RPC.) Redeploy para que tomen efecto.

**Verificación:** en la preview de la rama, la sección de roadmap muestra contadores reales y votar
sube el número; con `VOTACION_ENABLED=false` la sección se declara "no disponible".

## 4. Al terminar — checklist

- [ ] Supabase: proyecto creado, migración aplicada, humo `200`, tabla `votes` con RLS.
- [ ] GROQ: key nueva, humo `200`, chat en modo IA en preview.
- [ ] Vercel: env vars en Production + Preview, redeploy hecho.
- [ ] `.env.local` tiene las 4 variables y NO está en el repo (gitignored).

**Pendiente para fases futuras (G-Release / fase 2):** dominio propio, quitar `noindex` si aplica,
correos reales del formulario. No bloquean este sprint.

## 5. Problemas conocidos y su solución (se alimenta durante el aprovisionamiento)

| Síntoma                                                                               | Causa probable                                                                               | Fix                                                                                                                            |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `supabase start` falla: `port … already allocated`                                    | otro stack Supabase corriendo en el Mac (p. ej. app-inmobiliaria)                            | este proyecto usa puertos +100 en `supabase/config.toml` (api 54421, db 54422…) para coexistir; no se detiene el otro proyecto |
| `supabase start` falla: `…docker.sock: operation not supported` (contenedor `vector`) | el agregador de logs de analytics monta el socket de Docker y falla sobre virtiofs de Colima | `[analytics] enabled = false` en `config.toml` — no hace falta para la votación                                                |
| `createClient` rechaza la URL con error opaco en CI                                   | `supabase status -o env` entrecomilla los valores                                            | volcarlos con `sed 's/="/=/; s/"$//'` antes de exportar (antídoto K3)                                                          |
| chat en 401 pese a key nueva                                                          | la key no se guardó en el entorno correcto                                                   | verificar `.env.local` local y Vercel Production+Preview por separado                                                          |
