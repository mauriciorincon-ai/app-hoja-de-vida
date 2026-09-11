# CV Viva — Manual de uso

> **Documento obligatorio y vivo.** Toda feature que llega a `main` se documenta aquí en el mismo
> sprint (regla 9 del CLAUDE.md). Escrito para el **usuario final** en español llano — sin jerga
> técnica ni referencias al código. Al lanzar la app (F5), este manual es la base de la guía de
> usuario pública.

## Qué es esta app

CV Viva es tu hoja de vida convertida en una página web que se recorre como una pieza editorial
animada: identidad, trayectoria, logros, proyectos y la vitrina de apps del pipeline, en español
e inglés. Quien la visita puede pedir acceso a tus apps y la solicitud te llega al correo.

## Primeros pasos

- La página vive en la URL de producción (Vercel). Se abre en `/es` (español) o `/en` (inglés).
- No requiere cuenta ni instalación: es una página pública.

## Features

### Alimentar la CV Viva (editar tu contenido) · desde Sprint 001

- **Qué hace:** TODO el contenido de la página (nombre, titular, trayectoria, logros, proyectos)
  vive en tres archivos de texto en la carpeta `data/` del repositorio. Editarlos y hacer push
  actualiza la página automáticamente. Cero código.
- **Cómo se usa:**
  1. Abre `data/cv.es.yaml` (español) y `data/cv.en.yaml` (inglés). Son espejos: cada dato debe
     existir en ambos idiomas.
  2. Edita los textos. Desde el content pack v1 (jul 2026) el contenido es el real — sin
     placeholders.
  3. Guarda, haz commit y push (o edítalos directo en GitHub). El deploy sale solo.
- **Campos guardados pero aún sin sección en la página:** `perfil` (texto largo),
  `certificaciones` y `skills` ya viven en los YAML y se validan, pero su sección visual llega
  con el Sprint 2. Cuando tengas los links de verificación de tus certificaciones (Credly /
  Microsoft Learn), pégalos en el campo `verificacion:` de cada una.
- **Dos correos distintos:** el que se **muestra** en la página (contacto público) es el campo
  `email:` del YAML; el que **recibe** las solicitudes del formulario es la variable
  `SOLICITUDES_TO_EMAIL` en Vercel — cambiarlos es independiente.
- **Red de seguridad:** si un archivo queda mal formado (falta un campo, un email inválido), la
  publicación **falla antes de salir** con un mensaje que dice exactamente qué campo está mal.
  La página que ya está en línea no se rompe.
- **Limitaciones conocidas:** los logros usan `valor` numérico (el contador anima ese número);
  máximo 2 decimales.

### La trayectoria: el índice que baja contigo · desde Sprint 001 · rehecha en la revisión post-S7

- **Qué hace:** una sola línea recorre todas las experiencias. Al hacer scroll, un círculo se
  queda a media pantalla y la línea pasa por él (se rellena en lila lo que ya leíste); al lado
  del círculo aparece **el año grande** de la experiencia que está a esa altura. Con «reducir
  movimiento» activado todo queda quieto: la línea completa, el círculo fijo y el año sin fundido.
- **Cómo se alimenta:** igual que siempre, `trayectoria:` en `data/cv.es.yaml` y `cv.en.yaml`. El
  año grande sale del `periodo` (los primeros cuatro dígitos): «2023 — 2025» enseña «2023».
- **Ver case study desde el hito:** un hito con `proyecto: <slug>` enseña «Ver case study →» hacia
  `/proyectos/<slug>`. El slug tiene que ser el de un proyecto **con** `casestudy:`; si no, **la
  publicación falla** y te dice qué hito. Es la única puerta a los case studies desde la HOME
  (la sección «Proyectos» ya no existe: ahí está la vitrina).

### El "grueso" de cada experiencia (bullets expandibles) · desde Sprint 002

- **Qué hace:** cada hito de la Trayectoria tiene un botón "Ver logros completos" que
  despliega los logros detallados con métricas de ese rol. Los mismos bullets alimentan el
  PDF descargable.
- **Cómo se usa:** en `data/cv.es.yaml` y `cv.en.yaml`, cada entrada de `trayectoria` tiene
  una lista `bullets:` — una línea por logro. Edita, guarda y push. Un hito sin `bullets`
  simplemente no muestra el botón.
- **Ojo:** mantén el mismo número de bullets en ES y EN (hay una prueba que lo vigila y
  bloquea la publicación si se desbalancean).

### Case studies con página propia · desde Sprint 002

- **Qué hace:** cada proyecto con case study tiene su propia URL compartible
  (`/es/proyectos/vesting`, por ejemplo) con la narrativa contexto → reto → qué hice →
  impacto, en ambos idiomas.
- **Cómo agregar uno nuevo (cero código):** en `data/cv.es.yaml` y `cv.en.yaml`, dale al
  proyecto un `slug:` (minúsculas-con-guiones, IGUAL en ambos idiomas) y un bloque
  `casestudy:` con `contexto`, `reto`, `acciones` (lista) e `impacto` (lista). Push y la
  página aparece sola, con su URL, su SEO y su lugar en el sitemap.
- **Quitar uno:** borra el bloque `casestudy:` y quita el `proyecto:` del hito que lo enlazaba
  (si lo dejas, la publicación falla avisándote). El proyecto sigue en `/cv` y en el PDF como
  resumen; solo pierde su página de detalle.

### Perfil, Certificaciones y Skills en la HOME · desde Sprint 002 · Skills rehecha post-S7

- **Qué hace:** las secciones que estaban guardadas desde el content pack ahora son
  visibles: el párrafo de Perfil, las 5 certificaciones (la DP-600 resaltada) y los 4 grupos
  de skills. **AI-102 salió el 2026-09-10:** Microsoft la descontinuó, y con ella se fue de
  todo el contenido que la nombraba (titular, perfil, logro, case study de Vesting, historia
  del chat, `apps.yaml`).
- **Una credencial nombrada es una credencial listada:** si cualquier texto de `data/` menciona
  un código (DP-600, AI-102…) que no esté en `certificaciones:`, el test de contenido lo nombra
  con su ruta y falla. Para volver a citar una certificación, primero va a la lista.
- **Links de verificación:** cuando tengas los links de Credly/Microsoft Learn, pégalos en
  el campo `verificacion:` de cada certificación — el botón "Verificar ↗" aparece solo.
- **Skills, desde la revisión post-S7:** una tarjeta por grupo con un icono dibujado en casa
  (se termina de trazar al llegar la tarjeta) y los ítems como chips que entran escalonados.
  **El icono va por la posición del grupo** (1.º IA, 2.º datos, 3.º BI, 4.º ingeniería): si
  reordenas los grupos en el YAML, los iconos se quedan en su posición. Un quinto grupo recibe un
  rombo. Sin porcentajes ni «nivel de dominio», a propósito.

### Estudios · desde la revisión post-S7

- **Qué hace:** sección propia entre la vitrina y las certificaciones, con una tarjeta por
  estudio. Antes la formación era un hito más de la trayectoria; ahora es un dato que también
  leen `/cv`, el PDF y el chat.
- **Cómo se alimenta:** en `data/cv.es.yaml` y `cv.en.yaml`, el bloque `estudios:` — cada entrada
  con `titulo`, `institucion`, `periodo` y `nota` (opcional). Hoy hay tres, tomadas del PDF
  2024-I del dueño: Ingeniería Industrial (2009 — 2016), los estudios de Diseño Industrial
  (2011 — 2016) y el curso de inglés con IELTS en Melbourne (2013 — 2014). **Todo estudio lleva
  año:** un `periodo` sin cuatro dígitos pone rojo el test de contenido. Mismo número de estudios
  en ES y EN.

### La vitrina, asomada en la HOME · desde la revisión post-S7

- **Qué hace:** en el sitio que tenía «Proyectos», la HOME enseña las cuatro cajas de la vitrina
  con su cuenta real de piezas y un botón «Entrar a la vitrina». Son las mismas cajas del portal:
  no hay nada que editar aparte de `data/vitrina.yaml`.

### Descargar CV en PDF (ATS) · desde Sprint 002

- **Qué hace:** el botón "CV (PDF)" (siempre visible arriba) y la página `/cv` entregan un
  PDF cuyo texto se puede copiar y que los sistemas de reclutamiento (ATS) pueden leer.
  `/cv` además es la versión imprimible de la hoja de vida completa.
- **Cómo se actualiza:** solo. El PDF se genera en cada publicación desde los mismos YAML
  que alimentan la página — editar el contenido y hacer push regenera web Y PDF a la vez;
  nunca quedan desincronizados.
- **Limitación conocida:** el PDF es deliberadamente sobrio (texto estructurado, sin
  diseño gráfico) — eso es una feature para los ATS, no un pendiente.

### Las apps del pipeline (`data/apps.yaml`) · desde Sprint 001 · reorganizado 2026-09-05

- **Qué cambió:** la sección **«Apps» de la portada se retiró**. No enseñaba apps que se pudieran
  visitar: enseñaba _esta misma página_ (CV Viva y su chat) y dos exploraciones sin producto —
  mientras «Vitrina», a un centímetro en el mismo menú, sí llevaba a seis apps construidas. Dos
  puertas prometiendo lo mismo. **Ahora lo construido tiene una sola puerta: la Vitrina.**
- **Nada del contenido se perdió.** `data/apps.yaml` sigue siendo la fuente y alimenta tres cosas:
  - **Las brochures** `/es/apps/hoja-de-vida` y `/es/apps/chat-hoja-de-vida` — se llega a ellas
    desde el bloque **«De esta casa»**, al cierre de `/es/vitrina`.
  - **El roadmap votable** de la portada (bloque `roadmap:` de cada app).
  - **El formulario de contacto**: las apps con `solicitable: true` son las opciones que puede
    elegir quien pide acceso. Ahí es donde viven hoy las dos exploraciones.
- **Cómo dar de alta una app:** editar `data/apps.yaml` + push, igual que siempre. Si le pones
  bloque `brochure:`, aparece su página y su enlace en «De esta casa»; si le pones `roadmap:`,
  entra a la votación; si le pones `solicitable: true`, aparece en el formulario.

### Roadmap con votación anónima · desde Sprint 004 · vive en la vitrina desde la revisión post-S7

- **Qué hace:** la sección "Roadmap" muestra las próximas features de cada app y deja que quien
  visita **vote con un clic, sin registrarse**, las que más quiere ver. El número que aparece
  junto a cada feature es el **conteo real** de votos en la base de datos.
- **Dónde está:** al pie de `/es/vitrina/apps`, debajo de las seis apps y antes de «De esta
  casa». **Ya no está en la HOME ni en el menú**: es una pregunta sobre las apps y se contesta
  con ellas.
- **Cómo se edita el roadmap (cero código):** en `data/apps.yaml`, dentro de una app, agrega o
  edita la lista `roadmap:`. Cada feature lleva un `id` (minúsculas-con-guiones), y `titulo` y
  `descripcion` en `es` y `en`. Push y el roadmap se actualiza. Una app sin `roadmap:` no aparece
  en la votación.
- **⚠ Ojo con el `id` de una feature:** el voto se cuenta por el par (app, id de la feature). Si
  **cambias el `id`** de una feature ya publicada, sus votos anteriores quedan bajo el id viejo y
  la feature "reinicia" su conteo. Cambia el `titulo`/`descripcion` cuando quieras, pero deja el
  `id` quieto si no quieres reiniciar.
- **La regla del contador honesto:** el número mostrado siempre sale de la base de datos en el
  momento. Si la base de datos no responde, la sección lo dice ("La votación no está disponible…")
  y **deshabilita los botones** — nunca verás un número inventado ni congelado.
- **Dedup de votos (y su límite honesto):** cada navegador puede votar una vez por feature; tras
  votar, el botón queda en "Ya votaste". Esto se guarda en el navegador del visitante
  (localStorage), así que es un dedup **de mejor esfuerzo**: si alguien borra los datos del
  navegador o usa otro dispositivo, podría volver a votar. Es deliberado — para no votar dos
  veces sin pedir registro ni guardar datos personales. **Cero PII:** la base solo guarda
  (app, feature, fecha), nunca IP ni identidad (Ley 1581).
- **Dónde veo los votos:** en el panel de Supabase (tabla `votes`) o en los logs de Vercel (cada
  voto queda registrado con app, feature y el total resultante). Analítica: eventos
  `roadmap_visto`, `voto_emitido`, `voto_rechazado`.
- **Apagar la votación:** en Vercel pon `VOTACION_ENABLED=false` (o quita `SUPABASE_URL`/
  `SUPABASE_ANON_KEY`) y redeploy — la sección se muestra en modo "no disponible", honesta y sin
  botones activos.

### Página brochure por app · desde Sprint 004

- **Qué hace:** cada app **con funcionalidad real** tiene su propia página tipo brochure
  (`/es/apps/hoja-de-vida`, `/es/apps/chat-hoja-de-vida`) con un hero, sus funcionalidades en
  movimiento, métricas, el stack y un botón para hablar contigo. Desde la card del showcase, el
  enlace "Ver la app" lleva ahí.
- **Cómo dar de alta una brochure (cero código):** en `data/apps.yaml`, a la app le agregas un
  bloque `brochure:` con:
  - `tagline` (frase corta, ES/EN) e `intro` (párrafo de apertura, ES/EN),
  - `funcionalidades:` — lista de `{ titulo, descripcion }` en ES/EN (al menos una),
  - `metricas:` (opcional) — lista de `{ valor, sufijo, etiqueta }`; el número se anima,
  - `stack:` (opcional) — lista de tecnologías (texto suelto).
    Push y la página aparece sola, con su URL, su SEO (hreflang + JSON-LD) y su lugar en el sitemap.
- **La regla "solo lo real":** ponle `brochure:` **solo a apps que ya funcionan de verdad** (las
  que están `en-produccion`). Las apps `en-exploracion` no llevan brochure — su lugar es el
  roadmap. Una app sin `brochure:` simplemente no tiene página (su URL da 404).
- **Analítica:** evento `brochure_vista` (con la app y el idioma).

### La vitrina: cuatro frentes · desde Sprint 005 · los cuatro abiertos desde Sprint 007

- **Qué hace:** `/es/vitrina` es el **portal** de lo que se construye aquí, repartido en
  **cuatro frentes**, cada uno con su caja —nombre, una frase, su estado y cuántas piezas tiene—
  y **cada uno con su propio espacio**. Desde el Sprint 007 **los cuatro tienen piezas reales**:
  - **Apps** (`/es/vitrina/apps`): las seis apps hermanas. **6 piezas.**
  - **Agentes especializados** (`/es/vitrina/agentes`): agentes sin interfaz que se manejan por
    comandos. **13 piezas.**
  - **Investigaciones** (`/es/vitrina/investigaciones`): líneas de investigación ya validadas.
    **7 piezas.**
  - **Tableros de datos** (`/es/vitrina/tableros`): tableros analíticos, sin atarse a una
    herramienta. **6 piezas.**
- **Un frente «en preparación» tiene página igual:** dice qué es, en qué punto está y ofrece la
  lista de espera, **sin fecha prometida**. Marca el inicio; no lo disfraza. Hoy **ningún frente
  está así** — esa página espera al próximo frente que declares.
- **Cómo cambiar el nombre, la intro o el estado de un frente (cero código):** edita
  `data/vitrina.yaml` y haz push. Cada frente lleva `nombre`, `intro` (la frase de su caja) y
  `detalle` (el párrafo de su página), en ES y EN. El orden del archivo es el orden del portal.
  - **Ojo con `estado`:** solo puede ser `abierta` un frente que **ya tenga piezas publicadas**.
    Si marcas como abierto uno vacío, **la publicación falla**, el error dice cuál es y lista los
    frentes que sí tienen piezas hoy.
  - La **cuenta de piezas nunca se escribe a mano:** se cuenta sola. La de apps sale de
    `content/vitrina/`; la de los demás frentes, de los archivos de `content/<frente>/`.

#### Las piezas que no son apps · desde Sprint 007

- **Qué hace:** cada frente distinto de apps tiene su **escaparate** (`/es/vitrina/agentes`) con
  una tarjeta por pieza, y cada pieza su **ficha técnica** en `/es/vitrina/<frente>/<pieza>`. Es
  **la misma ficha** que la de una app: mismos bloques, misma tipografía, mismos chips. Lo único
  que cambia es que estas piezas **no tienen «ficha completa»** — su detalle vive en la casa que
  las construyó, no aquí.
- **La tarjeta del escaparate** enseña: el estado (sellada / sin sellar) y el ciclo, el nombre, la
  frase de la pieza, su **titular de valor** y sus **tres primeras cifras** con su procedencia. Si
  la pieza trae capturas, la primera va arriba como **portada**.
- **El orden no se elige:** las piezas **selladas** van primero y dentro de cada grupo el orden es
  alfabético. Es estable: no cambia porque alguien toque un archivo.
- **Lo que una pieza puede traer de más** (y una app no): **«Lo que dicen los datos»** —de 3 a 6
  hallazgos, cada uno con su cifra y su procedencia— y **«Cómo se ve»** —de 1 a 12 capturas de la
  pieza corriendo—. Son opcionales: si la pieza no las trae, esas secciones **no aparecen** y las
  demás **se renumeran seguidas**, sin dejar un hueco. Por eso la ficha de una app va del 01 al
  05, la de una investigación del 01 al 04 y la de un tablero del 01 al 06.
- **Lo que la app nunca inventa:** si una pieza declara sus bloques **sin cuenta de
  funcionalidades** (una investigación tiene aportes, no funciones), la ficha **calla el número**
  en vez de escribir «0 funcionalidades».

#### Cómo publicar una pieza nueva (sin sprint, sin código)

1. **Quien construyó la pieza produce su ficha** siguiendo `docs/contrato-ficha-tecnica/`
   (empieza por `CLAVE-VISUAL.md`). Es un JSON; nunca HTML. Contrato vigente: **v1.3.1**.
2. **Se deja caer el archivo** en `content/<frente>/<slug>.ficha-tecnica.json`. El nombre del
   archivo **tiene que ser el slug** de la pieza, y la carpeta, su frente.
3. **Si trae capturas**, van a `public/piezas/<frente>/` respetando la ruta que el campo
   `galeria[].archivo` declara. Si falta una sola, **la publicación falla** y el error dice qué
   ficha la pedía y qué archivo no está.
4. **Se abre un PR de contenido** (sin sprint). La CI valida el contrato, que no haya enlaces ni
   DOI, que el slug no choque con ninguna otra pieza, la accesibilidad y las pruebas de extremo a
   extremo. Al mergear, el escaparate, la cuenta del portal, el sitemap y las pruebas la recogen
   solos.
5. **Si el frente todavía no estaba abierto**, se marca `abierta` en `data/vitrina.yaml` en ese
   mismo PR — ya tiene con qué.

> **Estas fichas NO se editan aquí, ni para que quepan.** Si una trae un dato mal o no valida, el
> error dice **archivo y campo**, y la corrección se hace **en el repositorio que la produjo**. Si
> varias no caben por una razón legítima del frente, lo que crece es **el contrato** (así nació la
> v1.3.0 con las conclusiones y la galería de los tableros), nunca se recorta la ficha.

#### Las apps dentro de la vitrina · dos capas desde 2026-09-05

- **Qué hace:** `/es/vitrina/apps` asoma cada app con una muestra corta —en qué estado está, su
  nombre, su promesa, un esquema y cuánto tiene construido— y **cada app tiene dos capas**:
  - **La ficha técnica** (`/es/vitrina/apps/habla`): la infografía de dos minutos. Hasta siete
    bloques en orden fijo: cabecera con el **titular de valor** (qué no hace nadie más), la tira
    de **cifras con su procedencia**, para quién y qué resuelve, **cómo funciona** (el proceso
    dibujado en BPMN: un carril por actor, la decisión donde se decide, los bucles a la vista;
    **opcional desde el contrato v1.1.0** — una pieza sin proceso de uso lo omite y las secciones
    se renumeran), qué tiene (una tarjeta por grupo), límites y **lo que nunca hace**, y dónde
    está. Cierra con «Ver la ficha completa».
  - **La ficha completa** (`/es/vitrina/apps/habla/detalle`): el detalle construido en el S5 — la
    promesa, las cifras, las funcionalidades agrupadas en tarjetas que se abren solas al llegar
    leyendo, y los detalles finos (privacidad, stack, funcionalidades descartadas).
    Al pie del escaparate, el bloque **«De esta casa»** enlaza las dos brochures propias.
- **De dónde sale la ficha técnica:** del `brochure-export.json` de la app **más un complemento**
  que hoy escribe esta casa, en `data/fichas/<app>.yaml`: el titular, cuáles 3–5 cifras van
  arriba, los límites, los «nunca» y el proceso. Cada complemento dice `procedencia: cv-viva`, y la
  ficha lo declara al pie del diagrama: **el proceso lo derivó CV Viva del export; la app aún no
  lo envía**. El día que la app lo mande en su export, ese archivo se retira.
- **Cómo cambiar el titular, las cifras destacadas, los límites o el proceso de una app:** edita
  `data/fichas/<app>.yaml` y haz push. El proceso se describe con datos (carriles · pasos ·
  flujos · anotaciones), no se dibuja: el diagrama lo genera la app. Si el proceso está mal
  formado (sin fin, una decisión con un solo camino, un paso al que nadie llega, una cifra que no
  existe en el export), **la publicación falla** y el error dice qué y dónde.
- **Para que otra casa produzca fichas técnicas** (investigaciones, agentes, tableros): el
  paquete de entrega está en `docs/contrato-ficha-tecnica/` — empieza por `CLAVE-VISUAL.md`.
  Entregan un JSON; CV Viva lo pinta. Nunca HTML. Contrato vigente: **v1.3.1** (ver «Cómo
  publicar una pieza nueva», arriba).
- **De dónde sale el contenido:** de un archivo por app en `content/vitrina/`, llamado
  `<app>.brochure-export.json`. Lo genera **cada app hermana**, no esta.
- **Cómo agregar o actualizar una app (cero código):** dejas caer su `brochure-export.json` en
  `content/vitrina/` y haces push. La página, el sitemap, el escaparate, la cuenta de la caja
  «Apps» del portal y las pruebas de accesibilidad la recogen solas.
- **Esos archivos NO se editan aquí.** Si uno trae un dato mal, se corrige **en la app de origen**
  y se vuelve a exportar. Si el archivo está malformado o incumple el contrato, **la publicación
  falla** y el error dice qué archivo y qué campo — nunca se publica una ficha que miente sobre sí
  misma.
- **Las imágenes de las pantallas:** son capturas de cada app **corriendo de verdad**, con datos
  inventados, tomadas con un comando de este repo y **repintadas con la paleta de la hoja de vida**
  para que las seis se vean de la misma casa. Para regenerarlas:
  - necesitas las apps hermanas clonadas al lado de este repo, con sus dependencias instaladas, y
    `cwebp` disponible (`brew install webp`);
  - `pnpm capturas:vitrina` las rehace todas, `pnpm capturas:vitrina habla` solo una;
  - quedan en `public/vitrina/` como WebP.
- **Ninguna ficha entrega un enlace** a la app ni a su repositorio: se muestra la **razón** de que
  no lo haya y un único botón de **lista de espera**, sin promesa de fecha.
- **Lo que se muestra es la versión anclada** del export (con su fecha, a la vista al pie de cada
  ficha), no el estado en tiempo real de la app.

### El menú del encabezado · desde Sprint 001 · reorganizado 2026-09-05

- **Qué hace:** el menú tiene **tres destinos**: **Hoja de vida** (que despliega Trayectoria,
  Logros, Lo que construyo, Estudios, Certificaciones y Skills — el orden de la página),
  **Vitrina** y **Contacto**; más el botón de CV en PDF y el cambio de idioma. «Lo que
  construyo» (desde 2026-09-10) es la sección de la HOME donde se asoma la vitrina; «Vitrina»
  en el primer nivel es el portal.
- **Por qué se agrupó:** había llegado a nueve destinos y dejaba de caber en pantallas medianas.
  Cinco de esos nueve son **una sola cosa** —tu hoja de vida— y competían de tú a tú con la
  vitrina y el contacto. No se perdió ningún acceso: las cinco viven dentro del desplegable.
- **Cómo se usa:** nada que configurar. Se abre con clic o con Enter, se cierra con Escape (y el
  foco vuelve al botón), pulsando fuera, o al elegir una sección.

### Menú en móvil · desde Sprint 004

- **Qué hace:** en pantallas pequeñas, el encabezado muestra un botón de menú (☰) que despliega
  las mismas secciones que el menú de escritorio. Se abre y cierra con teclado (Escape cierra) y
  al elegir una sección se cierra solo. Nada que configurar.

### Idiomas · desde Sprint 001

- **Qué hace:** la página completa existe en `/es` y `/en`, con el botón ES/EN en el encabezado.
  Cambiar de idioma conserva la sección donde estaba el visitante.
- **Cómo se usa:** nada que configurar; el contenido sale de los dos YAML espejo.

### Solicitudes de acceso · desde Sprint 001

- **Qué hace:** el formulario "Solicitar acceso" (sección Contacto) envía un email a tu correo
  con nombre, email, app pedida y mensaje del visitante. El visitante ve la confirmación
  "Recibí tu solicitud, te respondo en 1–3 días hábiles."
- **Cómo llegan:** al correo configurado en Vercel (`SOLICITUDES_TO_EMAIL`; por defecto tu
  Gmail). Puedes responder directo: el "reply-to" es el email del visitante.
- **Protecciones:** máximo 5 envíos por minuto por visitante y una trampa anti-bots invisible.
  ⚠ Si `RESEND_API_KEY` no está configurada en Vercel, el formulario "funciona" para el
  visitante pero el email NO se envía (queda solo en logs) — verifica esa variable en prod.

### El chat que responde por ti · desde Sprint 003

- **Qué hace:** el botón flotante "Pregúntale a mi HV" (abajo a la derecha, en todas las
  páginas) abre un chat donde el visitante pregunta en español o inglés y recibe respuestas
  basadas SOLO en tu contenido real, con **fuentes citadas** que llevan a la sección o case
  study correspondiente. Si pregunta algo ajeno (el clima, chistes, tareas), recibe una
  respuesta amable fija — sin gastar un solo token. Y si el proveedor de IA se cae o se queda
  sin cuota, el chat **no muere**: pasa a "Búsqueda local" y muestra los fragmentos de la hoja
  de vida que mejor responden, avisándolo con honestidad.
- **De dónde saca las respuestas:** de los mismos YAML de siempre + tu historia
  (`data/historia/` — ver la guía de abajo). Cada push re-indexa el conocimiento del chat.
- **Cuánto cuesta:** con Groq (el proveedor actual) el plan gratuito cubre el uso esperado:
  US$0. Hay protecciones apiladas: máximo 10 preguntas por minuto por visitante, respuestas
  cortas (tope de tokens), historial corto, y el interruptor de apagado.
- **Apagarlo del todo (kill-switch):** en Vercel pon la variable `CHAT_ENABLED=false` y
  redeploy — el botón desaparece de la página. Volver a encender: bórrala o ponla en `true`.
- **Cambiar de proveedor de IA (cero código):** cambia variables en Vercel y redeploy:
  1. `CHAT_PROVIDER` = `groq` (actual) · `gemini` · `azure` · `anthropic` · `openai-compatible`.
  2. La API key del elegido: `GROQ_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`,
     `AZURE_RESOURCE_NAME`+`AZURE_API_KEY`, `ANTHROPIC_API_KEY`, o `CHAT_BASE_URL` (self-host).
  3. Opcional `CHAT_MODEL` para elegir el modelo (cada proveedor tiene un default sensato;
     en Azure es obligatorio: el nombre de tu deployment).
- **Si un día llega una factura:** los logs (Vercel → Logs) registran proveedor, tokens y
  latencia de CADA respuesta — ahí está la traza de qué se consumió. Primeros auxilios:
  `CHAT_ENABLED=false` (se apaga ya) o volver a un proveedor free tier.
- **Si la API key falla o se agota la cuota:** los visitantes NO ven un error — ven el modo
  búsqueda local. Tú lo notas en los logs (`proveedor falló`) y en el badge "Búsqueda local"
  al probar el chat.

### Cómo alimentar la historia (el combustible del chat) · desde Sprint 003

Tu workstream de contenido: dos archivos gemelos, `data/historia/historia.es.md` y
`data/historia/historia.en.md`, donde escribes tu carrera al detalle que quieras — el chat
los usa como fuente principal. Ya tienen el **esqueleto guiado**: una sección por etapa de tu
carrera con un comentario que dice qué escribir en cada una.

- **Cómo se escribe (prosa normal, sin marcas raras):** dentro de cada sección escribes
  párrafos comunes y corrientes. NO necesitas marcar nada dentro del texto — ni negritas
  especiales, ni etiquetas, ni formato para el buscador. El sistema trocea por secciones y el
  chat cita la sección entera.
- **Las ÚNICAS 2 marcas que existen** (ya están puestas en el esqueleto; solo las tocas si
  creas una sección nueva):
  1. El título `## Así se titula la sección`
  2. Debajo, el comentario `<!-- seccion: un-id-unico | ancla: /proyectos/vesting -->`
     - `seccion:` es el nombre interno que conecta la sección con su gemela en el otro idioma
       (debe ser idéntico en ambos archivos).
     - `ancla:` es **a dónde navega la cita** cuando el chat use esa sección: una sección de
       la HOME (`#trayectoria`, `#perfil`, `#certificaciones`…) o un case study
       (`/proyectos/vesting`). Si la omites, la cita lleva a Trayectoria.
- **Cómo funcionan las citas por dentro (para que confíes en ellas):** cuando el visitante
  pregunta, el sistema busca las secciones más relevantes, se las pasa numeradas a la IA, y
  la IA responde marcando `[1]`, `[2]`… Cada número aparece bajo la respuesta como un chip
  clicable que navega al `ancla` de esa sección. Por eso el ancla importa: es la promesa de
  "verifícalo tú mismo".
- **El ritmo incremental:** rellena UNA sección cuando tengas un rato → tradúcela en su
  gemela EN → commit + push. El próximo deploy re-indexa y el chat ya sabe eso. Las secciones
  vacías no estorban ni rompen nada.
- **La regla de paridad (el único "no"):** si una sección tiene contenido en un idioma y su
  gemela está vacía, la publicación **falla a propósito** con un mensaje que dice exactamente
  qué sección falta traducir. Es la garantía de que el chat sabe lo mismo en ES y EN.
- **Cómo verificar que un párrafo nuevo ya es citable:** tras el deploy, abre el chat y
  pregunta por ese tema — la respuesta debe usarlo y citarlo. (En local: `pnpm build` y
  revisa que diga "N secciones de historia con contenido".)
- **⚠ Privacidad (la advertencia de siempre):** TODO lo que escribas ahí es público dos
  veces — el repo es público en GitHub y el chat se lo cita a cualquiera. Nada de datos
  confidenciales de empleadores, salarios, nombres de terceros sin permiso, ni datos de
  pacientes (CTIC). Ante la duda, no lo publiques.
- **Secciones nuevas:** copia el patrón (título + comentario con `seccion:` único y su
  `ancla:`) en AMBOS archivos. Puedes tener tantas como quieras.

### Animaciones y accesibilidad · desde Sprint 001

- **Qué hace:** las secciones se revelan al hacer scroll (contadores, línea de tiempo, cards).
  Si el visitante tiene activado "reducir movimiento" en su sistema, la página muestra todo el
  contenido quieto, sin animaciones.
- **Limitaciones conocidas:** el modo oscuro aún no existe (pendiente registrado).

## Preguntas frecuentes

- **¿Puedo editar el contenido sin saber programar?** Sí: edita los YAML en GitHub desde el
  navegador; si algo queda mal, la publicación falla y te dice qué corregir.
- **¿Dónde veo cuánta gente visita?** En Vercel Analytics (eventos: visitas, cambios de idioma,
  clics en apps, solicitudes enviadas/fallidas).

## Historial

| Sprint | Features añadidas a este manual                                                                                                                                                                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 001    | Contenido por YAML, showcase de apps, bilingüe ES/EN, solicitudes de acceso, motion.                                                                                                                                                                                                                                     |
| 001bis | Content pack v1 integrado (marca Henry Rincón), estado "en producción", enlaces de evidencia en las cards, campos `certificaciones`/`skills`/`perfil` previstos para S2.                                                                                                                                                 |
| 002    | Capa de profundidad: bullets expandibles por hito, 5 case studies con URL propia, secciones Perfil/Certificaciones/Skills, ruta `/cv` imprimible + PDF ATS descargable.                                                                                                                                                  |
| 003    | El chat que responde por ti: RAG con citas navegables, proveedor conmutable por env (Groq inicial), off-topic sin tokens, fallback local que nunca muere, kill-switch, y la historia (`data/historia/`) como corpus incremental con guía de alimentación.                                                                |
| 004    | Roadmap con votación anónima (contador real o "no disponible", dedup por navegador, cero PII), página brochure animada por app real, y menú en móvil. Cierre del ciclo H1: el MVP funcional queda completo.                                                                                                              |
| 005    | La vitrina: escaparate de las seis apps hermanas y **una página propia por app**, alimentadas por los `brochure-export.json` que cada app genera; tarjetas que se abren al llegar leyendo; capturas de las apps reales repintadas con la paleta de esta página; cero enlaces y CTA de lista de espera. Abre el ciclo H2. |
| 007    | Las estanterías: los cuatro frentes de la vitrina abiertos con piezas reales (6 apps · 13 agentes · 7 investigaciones · 6 tableros). Un escaparate por frente y una ficha por pieza, con el mismo renderizador de las apps; las fichas las produce quien construye cada pieza y llegan por PR de contenido. Contrato v1.3.0: los tableros añaden «Lo que dicen los datos» y «Cómo se ve» (galería de capturas), opcionales y con renumeración automática. |
| post-S7 | Revisión del dueño sobre la HOME: la trayectoria como índice que baja contigo (línea continua, círculo fijo a media pantalla, año grande); la vitrina en el sitio de Proyectos y los case studies desde su hito; Estudios como sección y como dato (`cv.estudios`); Skills en tarjetas con icono y trazo; el roadmap se muda a `/vitrina/apps` y sale del menú. |
| post-S7 (2.ª) | «Lo que construyo» entra al desplegable Hoja de vida; Estudios con los años del PDF del dueño (tres entradas); AI-102 retirada de todo el contenido (Microsoft la descontinuó) y gate nuevo: una credencial nombrada tiene que estar en `certificaciones:`. |
