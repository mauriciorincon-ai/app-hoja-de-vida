# ADR-024 — El chat pide nombre y correo con código de verificación, registra cada conversación y responde en dos o tres párrafos

- **Status:** accepted
- **Date:** 2026-09-21
- **Sprint:** fuera de sprint (orden verbal del dueño del 2026-09-20, bitácora
  `sprints/CHAT-registro-bitacora.md`)

## Contexto

Hasta hoy el chat de CV Viva era anónimo: cualquiera abría el panel y preguntaba, y del otro lado
solo quedaba un log técnico (tokens, latencia, proveedor) sin la pregunta ni la respuesta. El
dueño pidió tres cosas: **una barrera** —nombre y correo, verificados, para que «la gente
desocupada» no consuma el chat ni el presupuesto—, **un registro** de quién preguntó qué y qué se
le respondió, y **respuestas de dos o tres párrafos**, no volcados de documentos, ahora que el
corpus a fondo pasó de 30.000 a 158.000 palabras por idioma.

Las tres tocan la única promesa de datos que la app tenía: «cero PII» (ADR-011, la votación). El
registro del chat es, por definición, datos personales. Se hace, y se hace con aviso.

## Decisiones

1. **Barrera por correo verificado, sin cuentas.** El visitante deja nombre y correo y marca un
   aviso de tratamiento de datos (Ley 1581 de 2012, Colombia). El servidor genera un código de
   seis dígitos con `randomInt`, guarda **solo su hash** (SHA-256 con un secreto de servidor y el
   correo), lo envía por Resend y espera. El código vale **diez minutos** y **cinco intentos**;
   el sexto lo agota aunque sea correcto. Verificado, el servidor emite una **cookie firmada**
   (HMAC-SHA256, httpOnly, SameSite=Lax, Secure en producción) que dura **30 días**. No hay
   contraseñas, no hay tabla de usuarios, no hay proveedor de identidad: el correo es la
   identidad y el código es la prueba de que es suyo. `src/lib/chat-registro/`.

2. **El chat exige la cookie.** `/api/chat` responde `401 registro_requerido` sin sesión válida;
   el panel vuelve a la puerta sin perder la pregunta y la reenvía al entrar. La puerta se apaga
   con `CHAT_GATE=off` **solo para desarrollo local**; en producción está encendida y sin
   `CHAT_SESSION_SECRET` responde `503 registro_no_disponible`, nunca deja pasar.

3. **Registro en Supabase, por RPC, mismo patrón que la votación.** Dos tablas (`chat_codigos`,
   `chat_registro`) con RLS encendida y **sin políticas**; el anon solo ejecuta tres funciones
   `SECURITY DEFINER` (guardar código, verificar y consumir, registrar). **Nadie del Data API lee
   las tablas**: la lectura es del dueño, con `service_role`, desde el panel de Supabase. Cada
   fila del registro lleva nombre, correo, idioma, pregunta, respuesta (texto completo, hasta
   8.000 caracteres), fuentes citadas, modo (`ia` · `offtopic` · `local`), proveedor, modelo,
   tokens y milisegundos. Las respuestas del modo de búsqueda local —que el servidor no ve— las
   manda el panel a `/api/chat/log` con la misma cookie. Migración
   `supabase/migrations/20260921120000_chat_registro.sql`.

4. **Un almacén en memoria para probar sin base de datos.** `CHAT_GATE_STORE=memory` reemplaza
   Supabase por un `Map` del proceso, y solo con él se honra `CHAT_CODIGO_PRUEBA` (un código
   fijo). Así el e2e cruza la puerta de verdad —dos endpoints, cookie httpOnly— sin correo ni
   red, y la CI no necesita Supabase para probar la barrera. Con Supabase el código de prueba es
   `null` por construcción.

5. **Respuestas de dos o tres párrafos.** La regla 3 del system prompt pasa de «2–5 frases» a
   «dos o tres párrafos desarrollados, entre 120 y 220 palabras», con la instrucción de no volcar
   las fuentes y de cerrar ofreciendo profundizar. El tope de salida sube de 600 a 700 tokens
   (220 palabras en español son unos 350–400). El retrieval no cambia: k = 4 sigue siendo el
   número medido (ADR-021), y son unas 540 palabras de contexto por respuesta.

6. **Lo que NO se hace.** No se verifica que el correo «no sea spam» más allá de que reciba el
   código: un correo desechable que recibe el código entra. No se guarda IP ni user-agent. No se
   borra nada automáticamente: la retención es decisión del dueño, y el aviso dice cómo pedir el
   borrado (desde Contacto).

## Consecuencias

- **Resend necesita un dominio verificado.** El remitente de cortesía (`onboarding@resend.dev`)
  solo entrega al correo del dueño de la cuenta; con él los códigos **no llegan a los
  visitantes**. Antes de encender la puerta en producción: verificar el dominio del sitio en
  Resend y poner `SOLICITUDES_FROM_EMAIL` con ese dominio. Hasta entonces, la preview funciona
  con el correo del dueño y el log del servidor (modo simulado sin `RESEND_API_KEY`).
- **Tres variables nuevas en Vercel:** `CHAT_SESSION_SECRET` (≥32 caracteres al azar), y las de
  Supabase ya existentes; `CHAT_GATE`, `CHAT_GATE_STORE` y `CHAT_CODIGO_PRUEBA` no se definen en
  producción. Migración aplicada al proyecto de Supabase antes del deploy.
- **El blueprint cambia:** la fila «Auth» deja de ser «no aplica» (sesión firmada por correo
  verificado, sin proveedor), «Base de datos» gana dos tablas con datos personales, «Email» gana
  el correo transaccional del código.
- **La regla «nada del LLM se persiste» (S3) queda derogada para el chat:** la respuesta se guarda
  tal cual, como texto, en la tabla del registro. Sigue vigente que ninguna salida del LLM se
  interpreta ni se ejecuta.
- **Gates nuevos, con su rojo:** `tests/unit/chat-registro.test.ts` (código con un dígito
  cambiado no coincide; cookie con la firma alterada no se lee; el sexto intento agota),
  `tests/integration/chat-registro-route.test.ts` (código equivocado 401, honeypot 200 sin
  guardar, sin aviso 400, sin secreto 503, sin sesión en `/api/chat/log` 401),
  `chat-route.test.ts` (sin cookie 401; con la puerta apagada no se registra; la respuesta y la
  estática quedan registradas), y el e2e de la puerta (formulario primero, código malo no entra,
  el bueno saluda por el nombre y la cookie sobrevive a recargar).

## Enmienda 2026-09-26 — el cupo de cada persona

**Contexto.** El dueño preguntó cómo estamos protegidos para no pasarnos de tokens con Groq y
para que nadie abuse del chat. La respuesta honesta tenía un hueco: con el plan gratis de Groq no
hay factura posible (solo cortes), pero **una sola persona registrada podía gastarse la cuota
diaria de todos** (~100 respuestas: 200K tokens/día a ~2K por respuesta). El límite de 10 por
minuto vive en la memoria de cada instancia serverless, así que no es global, y no había forma de
cortarle el acceso a un correo en particular.

**Decisión.** Tras la sesión y antes del guardrail, `/api/chat` pregunta el **cupo** de esa
persona con la RPC `chat_cupo` (migración `20260926120000_chat_cupo.sql`):

- **Bloqueado** si el correo está en la tabla nueva `chat_bloqueados` → 403 `bloqueado`. El
  dueño agrega o quita filas desde el Table Editor de Supabase, con efecto inmediato y sin
  redeploy. El registro (`/api/chat/registro`) también la consulta: un correo bloqueado no
  recibe código, así que tampoco gasta un envío de Resend.
- **Tope** si ya hizo `CHAT_TOPE_DIARIO` preguntas (20 por defecto, entero 1–1000; cualquier
  otro valor cae a 20, nunca apaga la protección) en las últimas 24 horas → 429 `tope_diario`.
  Se cuentan **todas** las filas de `chat_registro` de ese correo (ia, offtopic y local): se
  cuenta en la base, así que vale igual en todas las instancias.
- Ninguno de los dos llama al proveedor. El panel muestra su aviso propio y no cae a la
  búsqueda local (no es una falla).
- **Si el almacén no responde el cupo, deja pasar** y lo registra como error en el log: las
  otras defensas siguen en pie, y un visitante no paga una falla nuestra.

Mismo patrón de acceso que el resto: RLS encendida sin políticas en `chat_bloqueados`, el anon
solo ejecuta `chat_cupo` y no puede leer ni escribir la lista.

**Consecuencias.**

- **La migración va a producción antes del merge** (SQL Editor de Supabase). Si falta, el
  chat sigue funcionando, pero sin cupo, y el log lo grita en cada pregunta.
- Gates nuevos, con su rojo registrado en `sprints/REV-2026-09-26-tope-diario-bitacora.md`: el
  almacén en memoria y `topeDiario()` (unit), la ruta del chat y la del registro (integración),
  la RPC contra Postgres real (`tests/integration/chat-cupo.dbtest.ts`) y los avisos del panel
  (e2e).

---

## Adenda · Sprint 024 (2026-10-25) — la conversación en el navegador y el chat en tercera persona

Decisiones del dueño (2026-10-24 y 2026-10-25) que cambian lo que el chat guarda en el navegador y lo
que dice. **El registro del servidor (esta ADR) no cambia**: sigue guardando nombre, correo, pregunta,
respuesta y fuentes, con el aviso de la Ley 1581.

- **La conversación vive también en el navegador del visitante** (`localStorage`, clave
  `cv-viva:chat:v1`, hasta 40 mensajes y 100 000 caracteres): recargar, seguir un enlace plano del
  menú o cambiar de idioma —todo eso desmonta el panel— no la pierde. Vence a las **8 horas del
  último mensaje** (se revisa al abrir y antes de enviar) y el visitante la borra con «Borrar
  conversación». Se lee con Zod (el almacén es del visitante y de cualquier extensión). **No se
  guarda el nombre ni el correo**: viven en la cookie firmada. Costo de servidor: cero. Sin
  almacenamiento (ventana privada) el chat funciona sin memoria. «Borrar» **no toca el registro**:
  borrarlo sigue siendo a pedido, a mano, desde Contacto (Ley 1581).
- **Una marca en `sessionStorage`** (`cv-viva:chat:abierto`, por pestaña) reabre el panel tras una
  carga completa, sin tomar el foco.
- **El chat no afirma ausencias.** Una pregunta por lo que Henry no hizo, no sabe o no tiene (y por
  las credenciales sin obtener, el salario, la disponibilidad) recibe un texto fijo y no llama al
  proveedor; una ajena, la estática de siempre y sin fuentes. Las dos listas son cerradas y se miden
  contra el banco (`rehuso.ts`, `tema-ajeno.ts`). Ambas se registran con `modo = 'offtopic'`: **sin
  migración** (la planeación fijó ese default; si más adelante se quiere distinguir el rehúso, es un
  valor nuevo del `check` de `modo`).
- **Tercera persona.** El prompt manda hablar de Henry en tercera y reescribir las fuentes (que están
  en primera); el texto del panel pasa a una voz neutra. El asistente puede hablar de sí mismo; lo
  que se prohíbe es la voz del dueño (`voz-del-dueno.ts`).
- **Solo las fuentes citadas.** El servidor sigue mandando las recuperadas; el panel pinta las que el
  texto cita con `[n]`.
- **El aviso de problema** gana un tercer paso, `chat`: no trae correo en el cuerpo, el servidor lo
  toma de la cookie (401 sin sesión), así que el correo no vuelve al navegador.
