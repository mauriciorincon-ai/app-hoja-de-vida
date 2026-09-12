# ADR-020 — La HOME tras la tercera revisión del dueño: la raíz en español, el tercer estado de una credencial, «Vitrina» y «Portafolio», y el contacto general

- **Status:** accepted
- **Date:** 2026-09-12
- **Sprint:** fuera de sprint (revisión post-S8, pedida por el dueño del producto al correr el bloque A del gate ⭐ acumulado del ciclo H2)

## Contexto

Con el Sprint 008 mergeado, el dueño empezó el gate ⭐ del ciclo H2 (31 pruebas) por el bloque A
—«La HOME se recorre»— y trajo dieciséis observaciones sobre lo que vio, más una que no era
observación sino síntoma: «ahora no inicia en español, inicia en inglés». Es la tercera revisión
de la HOME fuera de sprint (las dos post-S7 están en ADR-018). Bitácora:
`sprints/POST-S8-revision-hoja-de-vida.md`.

## Decisiones

1. **La raíz `/` abre siempre en `/es`** (`localeDetection: false`). El middleware decidía por
   `Accept-Language` **y por la cookie `NEXT_LOCALE`** que deja «Switch to English»: quien
   pulsara el cambio una vez quedaba en inglés en ese navegador para siempre. El botón sigue
   cambiando de idioma; lo que desaparece es la detección. Costo asumido: un visitante con el
   navegador en inglés que llegue por `/` ve español y tiene que pulsar el botón — Google indexa
   `/es` y `/en` por separado con hreflang, así que quien llega por búsqueda no pasa por `/`.
   Gate: `tests/e2e/idioma.spec.ts` (paga la deuda «el redirect de `/` no lo cubre ningún test»
   del summary del S8).

2. **El tercer estado de una credencial: `en curso`.** El dueño quiso el AI-103 en el titular
   («estamos en proceso») y el gate del S7 lo hacía imposible a propósito. La salida honesta —«me
   gusta la sinceridad»— es listarlo en `certificaciones` con `estado: "en curso"`, sin fecha, con
   chip visible, y vigilar lo contrario: **cada mención de un código en curso lleva «en curso» a
   menos de 48 caracteres** en las superficies publicadas (CV, `messages/`, `apps.yaml`). El
   logro «5 certificaciones» cuenta solo las obtenidas. AI-103 sale de
   `credenciales-nombradas.yaml` (ya no es «sin obtener declarada», es «en curso listada»); ese
   archivo conserva el segundo estado para la prosa del «a fondo» (AI-102).

3. **El barrido de credenciales mira también `messages/`.** AI-102 sobrevivió en la descripción
   SEO de los dos idiomas tres días después de su retiro: el gate barría `data/` y no `messages/`.
   Nació en rojo solo.

4. **«Vitrina» para la sección y «Portafolio» para el portal.** El dueño quiso que la sección de
   la HOME recupere el nombre con que siempre la llamó. Con «Vitrina» también en el primer nivel
   habría dos enlaces iguales a destinos distintos en el mismo menú — una trampa para el lector
   de pantalla y para cualquiera— así que la RUTA del portal pasa a «Portafolio», el nombre que
   sus propios CTAs ya le daban («Explora el portafolio»). Una es la sección, la otra la casa.
   `nav.vitrina` → `nav.portafolio`.

5. **«Producto» en vez de «pieza» en todo el copy visible.** La caja de frente es la misma en la
   HOME y en el portal, así que el cambio no podía ser solo de la HOME sin dejar «13 productos»
   en la caja y «13 piezas publicadas» en el escaparate. En el código, el contrato de ficha
   técnica, `public/piezas/` y la documentación técnica, «pieza» se queda: es el nombre del
   dominio.

6. **El formulario es el contacto general.** «Solicitar acceso» era el CTA de las apps, y el
   dueño recibe también asesorías, charlas y roles. Se titula «Escríbeme», la app es opcional
   («No, es un mensaje general» es una opción válida, no un hueco) y el correo cambia de asunto
   según venga o no con app. La lista de espera de las piezas sigue cayendo en el mismo formulario.

7. **`periodo: "2024"` en Vesting es una decisión estética del dueño**, declarada: el índice de
   la trayectoria repetía «2023» con Pichincha. El case study conserva «2023–2025» y el corpus
   dice «agosto de 2023 a enero de 2025». El dato viaja también al PDF, a `/cv` y al chat; el
   dueño lo aceptó como aproximación con eso a la vista.

8. **Movimiento nuevo dentro del vocabulario:** `fadeInSlow` (Estudios, Certificaciones, cajas de
   la vitrina), `liftIn` (Skills) y `CifraQueLlama` (la cuenta de productos). Solo
   transform/opacity/filter; con reducción de movimiento, quietos; la forma del árbol no depende
   de `useReducedMotion()` (gate `motion-estructura-reducida`). `Stagger` gana `stagger` y `as`.

9. **Iconos por dato.** Estudios y certificaciones declaran `icono:` (enum de seis, Lucide
   monolínea 16 px, `ink-2`). Los logos de Microsoft e IBM son marca ajena y no entran como icono;
   las insignias de Credly, si llegan, van como imagen junto al enlace de verificación.

## Consecuencias

- Tres gates nuevos, cada uno con su rojo en el mismo commit (bitácora). El del idioma es e2e:
  `next-intl` resuelve `next/server` fuera del sandbox de pnpm y no carga en vitest.
- El perfil ya no lleva cifras (esas son de Logros) y dice lo que el dueño hace hoy —estrategia
  de IA e ISO/IEC 42001— que también entra como bullet del hito de Fundación CTIC para que el
  chat, que cita la trayectoria, diga lo mismo.
- El prompt del chat, el JSON-LD, `/cv`, el PDF y el índice publicado siguen solos al titular y al
  resumen nuevos: son el mismo dato.
- El `a fondo` no se tocó: sus 24 documentos siguen en borrador y el índice publicado no cambia
  de tamaño (28 fragmentos).
