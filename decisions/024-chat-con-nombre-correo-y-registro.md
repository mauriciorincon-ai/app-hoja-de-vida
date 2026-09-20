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
