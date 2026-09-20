# Bitácora — El chat con nombre y correo, registro y respuestas de dos o tres párrafos

> Fuera de sprint. Orden verbal del dueño del producto (2026-09-20), en su revisión del corpus a
> fondo v3: «para poder chatear deben dejar un nombre y un correo, ojalá verificados con una
> clave enviada al correo; una barrera para que la gente desocupada no aparezca; un log que
> almacene qué preguntó quién y qué le respondimos; y que el chat arroje dos o tres párrafos
> largos por pregunta, no montones de información». Rama `chat/nombre-correo-y-registro`,
> aparte del PR de contenido para que cada uno se revise por lo suyo. Decisión: **ADR-024**.

## Desviación del plan

No existe orden de construcción en la planeadora para esta feature: la orden es verbal y esta
bitácora es su registro. Lo que en el método sería un sprint (motor → UI → e2e → docs) se hizo
en un solo tramo, con sus gates, porque el dueño pidió que todo llegara de una vez.

## Qué se construyó

| Pieza                                                                                                                                                                                                                                | Dónde                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Esquemas, código de un solo uso (hash con secreto, comparación en tiempo constante), sesión firmada en cookie (HMAC-SHA256, httpOnly, 30 días), almacén con dos implementaciones (Supabase por RPC · memoria) y el correo del código | `src/lib/chat-registro/`                                    |
| Migración: `chat_codigos` y `chat_registro`, RLS sin políticas, tres RPC `SECURITY DEFINER`, GRANTs explícitos                                                                                                                       | `supabase/migrations/20260921120000_chat_registro.sql`      |
| Endpoints: pedir código, verificar y emitir cookie, consultar sesión, registrar respuesta local                                                                                                                                      | `src/app/api/chat/{registro,verificar,sesion,log}/route.ts` |
| El chat exige la sesión (401) y registra cada respuesta: la del modelo (texto completo, fuentes, tokens) y la estática de una ajena                                                                                                  | `src/app/api/chat/route.ts`                                 |
| La puerta en el panel: formulario (nombre, correo, aviso Ley 1581) → código → chat; saludo por el nombre; un 401 devuelve a la puerta sin perder la pregunta; las respuestas locales se mandan al registro                           | `src/components/chat/chat-registro.tsx`, `chat-panel.tsx`   |
| Respuestas de dos o tres párrafos (120–220 palabras) con oferta de profundizar; tope de salida 600 → 700 tokens                                                                                                                      | `src/lib/ia/guardrails.ts`, `client.ts`                     |
| 21 cadenas nuevas en los dos idiomas                                                                                                                                                                                                 | `messages/{es,en}.json` (`chat.*`)                          |
| Variables: `CHAT_SESSION_SECRET`, `CHAT_GATE`, `CHAT_GATE_STORE`, `CHAT_CODIGO_PRUEBA`                                                                                                                                               | `.env.example`                                              |

## Los gates y su rojo (regla 14)

| Gate                                                | Rojo demostrado                                                                                                                                                                                                                                             |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/unit/chat-registro.test.ts` (12)             | un dígito cambiado no coincide; la firma alterada, el secreto distinto y el payload manipulado no se leen; la cookie vencida no se lee; el sexto intento agota aunque el código sea correcto; el segundo uso del mismo código no vale                       |
| `tests/integration/chat-registro-route.test.ts` (7) | código equivocado → 401 `incorrecto` sin cookie; sin pedir código → `sin_codigo`; honeypot → 200 y cero códigos guardados; sin aviso aceptado → 400; sin `CHAT_SESSION_SECRET` → 503; cuarto pedido en diez minutos → 429; `/api/chat/log` sin sesión → 401 |
| `tests/integration/chat-route.test.ts` (+5)         | sin cookie → 401 sin tocar el proveedor; con `CHAT_GATE=off` no se exige ni se registra; sin secreto → 503; la respuesta del mock queda registrada con fuentes, modo `ia` y proveedor; la estática de una ajena queda como `offtopic`                       |
| `tests/e2e/chat.spec.ts` (+2)                       | el panel abre en el formulario y no hay input de chat; el botón no se activa sin el aviso; el código malo muestra «no coincide» y no entra; el bueno saluda por el nombre y la cookie sobrevive a recargar; `POST /api/chat` sin cookie → 401               |

Los ocho e2e anteriores del chat cruzan ahora la puerta con el helper `abrirChat` (almacén en
memoria + `CHAT_CODIGO_PRUEBA` en el `webServer` de Playwright): el flujo es el real, sin correo.

## Lo que el dueño tiene que hacer antes de encenderlo en producción

1. **Resend con dominio verificado.** El remitente de cortesía solo entrega al correo del dueño
   de la cuenta. Sin dominio verificado, los códigos no llegan a los visitantes. Verificar el
   dominio del sitio en Resend y poner `SOLICITUDES_FROM_EMAIL` con ese dominio.
2. **Aplicar la migración** en el proyecto de Supabase (`supabase db push` o el editor SQL).
3. **`CHAT_SESSION_SECRET`** en Vercel (32+ caracteres al azar; p. ej. `openssl rand -base64 48`).
4. Leer el registro: tabla `chat_registro` en el panel de Supabase (ordenada por `creado_en`).

## Verificación

| Verificación | Resultado |
| --- | --- |
| `vitest run` (unit + integration) | 1.222 verdes en 42 archivos (24 nuevos de la barrera), rebasada sobre el corpus v3 ya fusionado con `main` (PR #32 y #33) |
| `tsc --noEmit` · `eslint src` | limpios |
| `pnpm build` | compila; índice 1.437 ES · 1.426 EN (la rama va rebasada sobre el corpus v3 con su «cuándo usar») |
| e2e `chat.spec.ts` (chromium + móvil) | **20 verdes**: los 8 de antes cruzando la puerta, los 2 nuevos de la puerta, axe AA con el panel abierto |
| Barrido cero enlaces tras el último `git add` | exit 1 (limpio) |

**Un cambio colateral honesto:** `/api/chat` ahora honra `DISABLE_RATE_LIMIT=1` como ya lo
hacían la votación y el formulario; hasta hoy el e2e pasaba porque sus dieciséis peticiones
cabían en el minuto, y con las dos pruebas nuevas dejaron de caber (429 en móvil). El límite en
producción no cambia: 10 por minuto por IP.

**Correo de prueba único por prueba e2e:** los workers de Playwright comparten el almacén en
memoria y el código se consume al verificar; con el mismo correo, dos pruebas en paralelo se
pisaban el código y una veía «sin_codigo». Cada prueba registra ahora un correo distinto.
