# Bitácora — Producción encendida de verdad, y la cita que borraba la conversación

> Fuera de sprint. 2026-09-22 y 23. El dueño ejecutó el «paso 2» del cierre anterior (dominio,
> Resend, Supabase, variables) guiado desde este chat, y el primer paso del gate ⭐ con el
> proveedor real destapó dos cosas que ningún gate automático podía ver.
> Rama `fix/cita-conserva-la-conversacion`.

## Lo que se encendió (todo desde los paneles, nada en el repo)

| Pieza | Estado real antes | Ahora |
| --- | --- | --- |
| Dominio propio | «previsto para H2» en el blueprint; no existía | comprado en Cloudflare Registrar (auto-renew, vence 2027-09-22); **solo firma el correo**, el sitio sigue en el subdominio de Vercel |
| Resend | remitente de cortesía: los códigos solo llegaban al dueño | dominio **Verified** (DKIM `TXT` + dos `CNAME` en *DNS only*); primer código a bandeja de entrada, firmado por el dominio |
| Supabase de producción | **no existía** — el único proyecto era de otra app | proyecto propio, dos migraciones aplicadas (son idempotentes: `if not exists` + `or replace` + `revoke` explícitos) |
| Votación del roadmap (S4) | **apagada en producción desde que se construyó**: sin `SUPABASE_*` en Vercel se declaraba «no disponible», honesta y silenciosa | viva; primer voto emitido |
| Vercel | 4 variables (una muerta, `CONTACT_EMAIL_TO`) | 8: + `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SOLICITUDES_FROM_EMAIL`, `CHAT_SESSION_SECRET`, `CHAT_MODEL` |
| Puerta del chat (ADR-024) | 503 | registro → código → sesión → fila en `chat_registro`, de punta a punta |

**Dos lecciones de paneles**, para no repetirlas:

- **Cloudflare empuja al naranja.** Los `CNAME` de Resend tienen que quedar en *DNS only*; el proxy
  solo entiende HTTP y devuelve IPs de Cloudflare en vez del destino, y la verificación queda en
  *Pending* sin decir por qué. Verificado con `dig` contra el NS autoritativo, no con la pantalla.
- **La variable que se recrea DESPUÉS del redeploy no llega.** Las variables se congelan al
  construir. El log de `chat/registro` lo dijo exacto: `secreto: false, store: true`. Un redeploy
  más y `secreto: true`.

## Hallazgo 1 — Groq retiró el modelo y nadie lo vio

La primera respuesta real llegó con la etiqueta **«BÚSQUEDA LOCAL»**: fragmentos crudos, sin
redactar. No era el contenido: era el paracaídas. Groq retiró `llama-3.3-70b-versatile` para
cuentas free/dev el **2026-08-16** (anunciado el 17 de junio). Cinco semanas de chat degradado en
producción y **ningún gate podía verlo**: la CI prueba con el proveedor `mock` a propósito (cero
llamadas reales), así que un retiro del lado del proveedor es invisible para ella. Lo vio el
dueño, leyendo una etiqueta.

Arreglo en dos capas: `CHAT_MODEL=openai/gpt-oss-120b` en Vercel (sin código, como ADR-003
previó) → la siguiente respuesta llegó redactada, con cifras y citas, en dos párrafos completos;
y en el repo el default de `provider.ts`, su test, ADR-003 enmendado con fecha y límites del
nuevo (30 RPM · 1K req/día · 8K TPM · 200K TPD — ahora manda tokens/min) y el manual con el
síntoma y la receta.

## Hallazgo 2 — la cita borraba la conversación

Al hacer clic en una fuente, el chat navegaba a `/vitrina/agentes` y **la conversación
desaparecía**. Causa: el chip era un `<a href>` corriente → navegación completa → el árbol de
React nace de cero. Ni el e2e (solo comprobaba la URL tras el clic) ni la guía (o12: «la cita
navega a…») habían pedido nunca que la conversación sobreviviera.

Arreglo: `<Link>` de `@/i18n/navigation` (navegación del lado cliente). El lanzador vive en el
layout, que Next conserva entre páginas, y el panel solo se oculta al cerrar — la conversación
queda. `hrefFuente` deja de anteponer el locale (lo pone `Link`) y los anclas de la HOME van como
`/#skills`, igual que en las páginas de proyectos.

### El rojo (regla 14), en el mismo commit

La aserción nueva del e2e —tras el clic, reabrir el chat y encontrar la respuesta anterior— se
corrió ANTES del arreglo, contra el `<a>`:

```
Error: expect(locator).toContainText(expected) failed
Locator: getByTestId('chat-mensaje-asistente').last()
Expected substring: "Microsoft Fabric"
Error: element(s) not found
```

Es exactamente lo que vio el dueño: un panel sin mensajes. Con `<Link>`, los 10 e2e del chat en
verde. Guía v9.3: f1 pasa a *Mejorado · cita viva* con la expectativa nueva; prefijo de casillas
`cita-viva` para que ninguna regresión sin correr herede una marca.

## Hallazgo 3 — la cita no decía de dónde salía ni a dónde llevaba (PR de la tarde)

Con la cita ya viva, el dueño hizo la pregunta correcta: *«¿qué lógica tiene que yo le dé a un
documento de a fondo y me lleve a una parte de la página que no tiene nada que ver con a fondo?
¿Y cómo se decide a qué parte lleva cada fuente?»*. La regla era correcta y estaba escrita desde
el S8 —los documentos no se publican, la cita navega a lo visible, y el destino lo declara cada
documento en su `ancla`—, pero **el chip no la contaba**: enseñaba el título del fragmento («A
fondo — Vesting — la plataforma… · Monitoreo», cortado a 40 letras) y aterrizaba donde nadie
podía anticipar. Decisión del dueño, textual: *«si a los documentos le damos un código y al lado
del código sí a dónde me va a llevar esa fuente»*.

**Lo que cambió.** Cada chunk del índice lleva ahora `codigo` y `destino`, y el chip dice
`[n] AF-09 · Vesting`:

| Pieza | Qué hace |
| --- | --- |
| `codigo: AF-NN` en el frontmatter de los 25 documentos (×2 idiomas) | Fijo, único por idioma, igual entre gemelos. Orden = la tabla del README. Para el dueño: qué archivo corregir |
| `CV` · `APP` · `FT` | El código de lo que sale del YAML del CV, de `apps.yaml` y de las fichas de la vitrina (esas se corrigen en origen) |
| `nombresDeDestinos(locale)` + `nombreDeDestino()` en `scripts/destinos.mjs` | El NOMBRE del destino, derivado: etiqueta del menú para `#seccion`, el «dónde» del nombre del proyecto para `/proyectos/<slug>`, nombre del frente o pieza para la vitrina. `#skills-titulo` → «Skills»; `/ruta#frag` → la ruta |
| `chatChunkSchema` y `fuenteSchema` | Exigen los dos campos: un índice sin ellos no carga |
| El chip (`chat-panel.tsx`) | `[n] {codigo} · {destino}`, título completo en `title=`; encabezado «Fuentes · ver en el sitio» |
| El registro (`chat_registro`) | Las fuentes guardan también el `codigo` — el dueño lee una conversación y sabe qué archivo tocar |
| Tabla del README de a fondo | Gana la columna Código (la genera `pnpm corpus:informe`) |

**Regla 14 — cada gate nuevo, en rojo en este mismo commit.** Las tres preguntas: ¿lo vi
fallar? sí, abajo; ¿lo vi correr? sí, en `pnpm test` (42 archivos) y en el build del índice;
¿puede fallar? sí, cada uno tiene un estado del repo que ninguna regla anterior atrapa.

1. **Código repetido** (`vesting.es.md` con `AF-08`, que ya es el de Banco Pichincha). La aduana
   nombra a los dos archivos y, de paso, al gemelo que quedó con otro código:

   ```
   ✖ Aduana del canal «a fondo» — el build se detiene:
     - código «AF-08» repetido en data/a-fondo/banco-pichincha.es.md y data/a-fondo/vesting.es.md. Un código nombra a UN documento: …
     - vesting: el código es «AF-08» en español y «AF-09» en inglés. Los gemelos son el mismo documento y llevan el mismo código.
   ```

2. **Código mal formado** (`cafam.en.md` con `codigo: "AF6"`):

   ```
   Error: data/a-fondo/cafam.en.md: frontmatter inválido:
     - codigo: formato AF-NN con dos dígitos, p. ej. AF-09
   ```

3. **Destino que existe pero no tiene nombre.** Se montó un `<div id="pruebita" />` dentro del
   `<main>` de la HOME (así el catálogo lo acepta como destino real) y `como-trabajo` pasó a
   `ancla: "#pruebita"`. El catálogo lo da por bueno; el gate nuevo no:

   ```
   ✖ Destinos de cita sin nombre — el build se detiene:
     - chat-index.es.json · «#pruebita» existe pero no tiene nombre para el chip (74 chunks, p. ej. "a-fondo-como-trabajo-cuando-usar"). Dale etiqueta en messages/es.json (nav.*) o en los datos que lo pintan.
   ```

   (La primera versión del mensaje listaba los 74 chunks uno a uno; se agrupó por destino.)

4. **El chip, en e2e.** Aserción nueva en `tests/e2e/chat.spec.ts`: el chip de Vesting tiene que
   leer `[n] AF-NN · Vesting` o `[n] CV · Vesting`, y en `/en` ningún chip puede decir «In depth».
   Corrida con el chip viejo (título recortado), 2 de 10 en rojo:

   ```
   Error: expect(locator).toHaveText(expected) failed
   Expected pattern: /^\[\d\] (AF-\d{2}|CV|APP|FT) · .+$/
   Received string:  "[1] In depth — AI agents: the Vesting platfo…"
   ```

   Con el chip nuevo, 10 de 10.

**Un tropiezo propio, para no repetirlo:** al limpiar las demos con `git checkout -- <archivo>`
sobre archivos cuyo cambio aún no estaba comiteado, el `codigo` de cuatro documentos se borró y
las demos 2 y 3 salieron rojas **por la razón equivocada** (`codigo: undefined` en Vesting). Se
repusieron los cuatro códigos y se repitieron las dos demos revirtiendo con `sed`, no con git.
Lección: una demo en rojo solo vale si el mensaje nombra la causa que se rompió a propósito.

**Lo que no cambió a propósito:** los seis documentos que citan hacia `#skills` siguen
compartiendo destino («Skills»). El código ya los distingue; si el destino grueso molesta, se
revisa después con respuestas reales delante. Y el chip conserva su estilo (`design-sync/` sin
cambios: mismo componente, otro texto).

## Verificación

| Qué | Resultado |
| --- | --- |
| e2e `chat.spec.ts` (chromium) | rojo en la aserción nueva con `<a>`; **10/10 verdes** con `<Link>` |
| `tests/unit/chat-provider-breaker.test.ts` | 17 verdes con el nuevo default |
| typecheck · lint | limpios |
| Producción | respuesta real de Vesting: dos párrafos, 27 agentes / 23 simultáneos / 12 clientes, citas `[1]`–`[4]`, sin etiqueta de búsqueda local |
| Hallazgo 3 · `pnpm test` | 42 archivos, 1.246 pruebas verdes (nuevas: código único y bien formado, gemelos con el mismo código, chunks con código, nombres de destino en ES/EN, todo destino del catálogo con nombre, corpus real con sus 25 códigos) |
| Hallazgo 3 · índice | 1.467 chunks ES / 1.457 EN, 70 pares código·destino, ninguno sin campo |
| Hallazgo 3 · e2e `chat.spec.ts` | 2/10 rojos con el chip viejo; **10/10** con el nuevo |
| Hallazgo 3 · typecheck · lint | limpios |

## Lo que queda para el dueño

- **Rotar `CHAT_SESSION_SECRET`**: el valor vivo se pegó en el chat al depurar. Baja urgencia
  (transcript local); rotarlo invalida su propia sesión y nada más.
- **Las fuentes del chat**: decidido (Hallazgo 3): se quedan, y dicen código y destino. Queda
  abierto si los seis documentos que citan hacia `#skills` merecen destinos más finos.
- **Apuntar el dominio al sitio** (`NEXT_PUBLIC_SITE_URL` + DNS en Cloudflare, esta vez en
  naranja): hoy el dominio solo firma correos.
- **DMARC** opcional en Cloudflare (`_dmarc` → `v=DMARC1; p=none;`).
- Seguir el gate ⭐ de la guía v9.3: bloques O y F, incluida la f8.
