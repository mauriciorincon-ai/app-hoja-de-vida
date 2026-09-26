# Revisión 2026-09-26 — El cupo del chat

> Rama `mejora/tope-diario-del-chat`, un PR. El dueño preguntó _«cómo estamos protegidos para no
> excedernos en tokens con Groq y que no abusen los usuarios del chat»_. La revisión de las capas
> que ya había encontró un hueco, y el dueño pidió cerrarlo: _«sí, hagamos ese PR, muy importante»_.

## 1. Lo que había, leído en el código

| Capa            | Dónde                                      | Qué hace                                                                                                 |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Puerta          | `api/chat/registro`, `verificar`, `sesion` | nombre + correo + código (10 min, 5 intentos); 3 registros/10 min por IP y por correo; sesión de 30 días |
| Ritmo           | `api/chat/route.ts` · `lib/rate-limit.ts`  | 10 preguntas/min por IP, **en la memoria de cada instancia**                                             |
| Tamaño          | `lib/ia/schemas.ts` · `lib/ia/client.ts`   | 800 caracteres por mensaje, 12 mensajes, 700 tokens de salida, 30 s                                      |
| Ajenas          | `lib/ia/guardrails.ts`                     | respuesta fija, cero tokens                                                                              |
| Proveedor caído | `lib/ia/breaker.ts`                        | 3 fallas → 60 s abierto → búsqueda local                                                                 |
| Interruptor     | `CHAT_ENABLED`                             | apaga el chat entero                                                                                     |

**El dinero no era el riesgo.** Groq en el plan Free no cobra: solo corta (ADR-003). Lo que no
estaba cubierto era la **disponibilidad**: `openai/gpt-oss-120b` en el plan Free da 200K tokens al
día, unas 100 respuestas de ~2K tokens, y **una sola persona registrada podía gastárselas todas**.
Después, el chat quedaba en búsqueda local para todos hasta el día siguiente. Además, el límite
por minuto no es global (memoria por instancia), y no había forma de cortarle el acceso a un
correo sin apagar el chat entero.

**Una corrección mía, registrada:** antes de revisar el código le dije al dueño que a quien tuviera
el secreto de sesión lo frenaban «el límite de uso y el tope de gasto». En el código no hay un
contador de dinero; lo que evita la factura es el plan Free de Groq. Se lo corregí en la misma
respuesta en que le expliqué las capas.

## 2. Lo que se construyó

- **`chat_cupo` (RPC) y `chat_bloqueados` (tabla)**, migración
  `supabase/migrations/20260926120000_chat_cupo.sql`, con el patrón de siempre (RLS encendida sin
  políticas, SECURITY DEFINER, el anon solo ejecuta). Devuelve `bloqueado` · `tope` · `ok`. El
  bloqueo manda. Cuenta todas las filas de `chat_registro` de ese correo en 24 horas: ia, ajenas
  y locales.
- **`/api/chat`** consulta el cupo tras la sesión y antes del guardrail: 403 `bloqueado` o 429
  `tope_diario`, **sin tocar el proveedor**. Si el almacén falla, deja pasar y lo registra como
  error.
- **`/api/chat/registro`** no emite código a un correo bloqueado (403), así que tampoco gasta un
  envío de Resend.
- **`CHAT_TOPE_DIARIO`** cambia el número sin código. El valor por defecto es 20; cualquier valor
  inválido también cae a 20, nunca a cero.
- **El panel** distingue los dos 429 (el ritmo por minuto y el tope del día) leyendo el cuerpo, y
  muestra un aviso propio para el tope y para el bloqueo, sin caer a la búsqueda local. El
  formulario de registro dice «Este correo no tiene acceso al chat».

**Por qué fallar abierto.** El chat ya depende de Supabase para el registro, pero una sesión viva
no debería perder el chat si Supabase parpadea. Si el cupo no responde, siguen en pie el ritmo,
el tamaño, las ajenas, la cuota de Groq y el interruptor. El error queda en el log de Vercel.

## 3. Despliegue

La migración va al proyecto de Supabase de producción **antes del merge**: SQL Editor → pegar el
archivo → Run. Verificación: `select public.chat_cupo('prueba@ejemplo.com', 20, 24);` → `ok`.
Si falta, el chat funciona igual, pero sin cupo ni lista. Esa verificación en producción es la
prueba f10 ⭐ de la guía v9.11.

## Regla 14 — rojos en este commit

**I. El tope cuenta de más** (`>=` pasa a `>` en el almacén en memoria):

```
× llega al tope con la pregunta número `limite` de las últimas 24 horas
× lo de hace más de 24 horas ya no cuenta, y el correo no distingue mayúsculas
AssertionError: expected 'ok' to be 'tope'
```

**J. Un valor inválido de `CHAT_TOPE_DIARIO` apaga la protección** (se quita el piso de 1):

```
× CHAT_TOPE_DIARIO cambia el tope; un valor inválido cae a 20, jamás apaga la protección
AssertionError: 0: expected +0 to be 20
```

**K. La ruta del chat sin el cupo** (se quita el bloque 3c):

```
× con el tope del día ya gastado → 429 tope_diario, sin llamar al modelo
× las preguntas ajenas también cuentan: el tope es por persona, no por token
× un correo bloqueado → 403, sin llamar al modelo ni registrar nada
× si el almacén no responde el cupo, deja pasar: las otras defensas siguen en pie
AssertionError: expected 200 to be 429
```

(La cuarta falla porque exige que el cupo se haya consultado una vez.)

**L. El registro sin mirar la lista:**

```
× no recibe código: 403 bloqueado, sin guardar el hash ni gastar un envío
AssertionError: expected 200 to be 403
```

**M. El SQL cuenta de más** (`v_n >= p_limite` pasa a `>`, aplicado con `psql` sobre Postgres
local):

```
× cuenta las preguntas de ese correo: con `limite` ya hechas, 'tope'
× lo que quedó fuera de la ventana ya no cuenta
AssertionError: expected 'ok' to be 'tope'
```

**N. El SQL ignora la lista de bloqueados** (`where false` en la consulta de la lista):

```
× un correo de la lista es 'bloqueado' aunque no haya preguntado nada
AssertionError: expected 'ok' to be 'bloqueado'
```

**O. El panel trata todo 429 como el ritmo por minuto** (e2e, con `next dev`):

```
× 429 tope_diario → su aviso, sin caer a la búsqueda local
Error: expect(locator).toContainText(expected) failed · Expected substring: "máximo de preguntas de hoy" · element(s) not found
```

Las otras dos del bloque pasaron en esa corrida: la mutación solo tocó el 429.

Cada mutación se revirtió desde su respaldo (`cp`, o volviendo a aplicar la migración con
`psql`), y la misma prueba pasó en verde. **¿Pueden fallar?** Sí, las siete: ninguna regla
anterior limitaba las preguntas por persona ni conocía una lista de bloqueados.

**Un rojo falso, anotado.** La primera corrida de `chat-cupo.dbtest.ts` falló entera con
`PGRST202` (la función no existe) y `PGRST205` (la tabla no existe). No era un rojo del gate: el
volumen local de Postgres era anterior y no tenía ni la migración del 21 de septiembre. Se
aplicaron las pendientes con `supabase migration up --local`, sin borrar datos, y las cinco
pasaron. En la CI no pasa: `supabase start` arranca de cero y aplica todas.

## Gate ⭐ del dueño

**a7 (el ícono de la pestaña) aprobada por el dueño el 2026-09-26**: _«se ve bien, márcala tú»_. Las casillas de la guía viven en su navegador, así que la
aprobación queda registrada aquí.

## Verificación

`pnpm test` **48 archivos, 1316 tests** (9 nuevos) · `pnpm test:db` **14** contra Postgres local
(5 nuevos del cupo, los 9 de la votación intactos) · `typecheck` y `lint` limpios · build de
producción · e2e completo **418 pasan**, 14 saltadas (las de siempre; 6 nuevas: los dos avisos
del panel y el registro bloqueado, en dos perfiles).

`chat-cupo.dbtest.ts` corre por primera vez en este PR en la CI (job `integration`): sin
histórico, se afirma que pasa, no que no haya regresionado.
