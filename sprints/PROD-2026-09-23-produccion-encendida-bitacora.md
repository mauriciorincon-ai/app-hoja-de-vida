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

## Verificación

| Qué | Resultado |
| --- | --- |
| e2e `chat.spec.ts` (chromium) | rojo en la aserción nueva con `<a>`; **10/10 verdes** con `<Link>` |
| `tests/unit/chat-provider-breaker.test.ts` | 17 verdes con el nuevo default |
| typecheck · lint | limpios |
| Producción | respuesta real de Vesting: dos párrafos, 27 agentes / 23 simultáneos / 12 clientes, citas `[1]`–`[4]`, sin etiqueta de búsqueda local |

## Lo que queda para el dueño

- **Rotar `CHAT_SESSION_SECRET`**: el valor vivo se pegó en el chat al depurar. Baja urgencia
  (transcript local); rotarlo invalida su propia sesión y nada más.
- **Las fuentes del chat**: ya no borran nada. Decidir si se quedan como están (son la promesa
  «verifica con las fuentes citadas» y lo que impide inventar) o se pliegan tras «Fuentes (n)».
- **Apuntar el dominio al sitio** (`NEXT_PUBLIC_SITE_URL` + DNS en Cloudflare, esta vez en
  naranja): hoy el dominio solo firma correos.
- **DMARC** opcional en Cloudflare (`_dmarc` → `v=DMARC1; p=none;`).
- Seguir el gate ⭐ de la guía v9.3: bloques O y F, incluida la f8.
