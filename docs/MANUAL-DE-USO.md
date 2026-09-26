# CV Viva — Manual de uso

> **Documento obligatorio y vivo.** Toda feature que llega a `main` se documenta aquí en el mismo
> sprint (regla 9 del CLAUDE.md). Escrito para el **usuario final** en español llano — sin jerga
> técnica ni referencias al código. Al lanzar la app (F5), este manual es la base de la guía de
> usuario pública.

## Qué es esta app

CV Viva es tu hoja de vida convertida en una página web que se recorre como una pieza editorial
animada: identidad, trayectoria, logros, proyectos y la vitrina de apps del pipeline, en español
e inglés. Quien la visita puede escribirte —por una app, una asesoría, una charla o un rol— y
el mensaje te llega al correo.

## Primeros pasos

- La página vive en la URL de producción (Vercel). Se abre en `/es` (español) o `/en` (inglés).
  **La raíz `/` abre SIEMPRE en español** (revisión post-S8): antes seguía el idioma del navegador
  y la cookie del botón «Switch to English», y quien lo pulsara una vez quedaba en inglés para
  siempre. El botón sigue cambiando de idioma; lo que no hay es detección. **Y el botón te deja
  exactamente donde estabas** (revisión post-S8, bloque B): conserva el mismo hito de contenido a
  la misma altura de la ventana, no el borde de la sección ni los píxeles — el inglés es más corto
  y los píxeles caerían en otro sitio.
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
  máximo 2 decimales. **Excepción que se calcula sola (corrección de contenido 2026-09-12):** el
  logro de «años de trayectoria profesional» no lleva `valor` sino `desde: "2016-08"`, y el número
  se calcula en cada build como años cumplidos — 10 hasta julio de 2027, 11 desde agosto. Un
  `desde` en el futuro, o un logro sin `valor` ni `desde`, rompe el build; y si alguien vuelve a
  escribir el número a mano, `tests/unit/content.test.ts` lo nombra.

### La trayectoria: el índice que baja contigo · desde Sprint 001 · rehecha en la revisión post-S7

- **Qué hace:** una sola línea recorre todas las experiencias. Al hacer scroll, un círculo se
  queda a media pantalla y la línea pasa por él (se rellena en lila lo que ya leíste); al lado
  del círculo aparece **el año grande** de la experiencia que está a esa altura. Con «reducir
  movimiento» activado todo queda quieto: la línea completa, el círculo fijo y el año sin fundido.
- **Cómo se alimenta:** igual que siempre, `trayectoria:` en `data/cv.es.yaml` y `cv.en.yaml`. El
  año grande sale del `periodo` (los primeros cuatro dígitos): «2023 — 2025» enseña «2023».
- **El periodo real y el de la HOME** (desde el 2026-09-24): `periodo` es **el real**, el que leen
  el PDF, `/cv`, el chat y los casos. Si en la línea de la HOME quieres otro —para que el año
  grande no se repita—, agrega `periodoEnLaHome:` al hito y solo la línea lo usará. Así está
  Vesting: `periodo: "2023 — 2025"` y `periodoEnLaHome: "2024"`, para no repetir el 2023 de
  Pichincha. Dos pruebas lo cuidan: el periodo real tiene que decir los mismos años que el nombre
  de su caso, y la línea de la HOME no puede repetir un año.
- **Ver case study desde el hito:** un hito con `proyecto: <slug>` enseña «Ver caso de estudio →» («View case study →» en inglés) hacia
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
- **Desde el 2026-09-24** los bullets de los ocho hitos llevan las cifras del corpus a fondo
  (Inglopres, Ceinfes y C&M Consorcio pasaron de 2 o 3 a 5), y en la sección **Logros** de la
  HOME entraron dos: los 27 agentes construidos con el proceso core de Vesting y los 42
  productos analíticos de la Fundación CTIC. Son ocho logros, en cuatro columnas.

### Casos de estudio con página propia · desde Sprint 002 · rehechos el 2026-09-24

- **Qué hace:** cada experiencia de la trayectoria tiene su caso de estudio con URL propia
  (`/es/proyectos/vesting`, por ejemplo), en los dos idiomas. **Son ocho, uno por hito**:
  Fundación CTIC, Vesting, Banco Pichincha, C&M Consultores, Cafam y, desde el 2026-09-24,
  C&M Consorcio, Ceinfes e Inglopres.
- **Cómo se ve cada caso, de arriba abajo:** la tesis en una frase bajo el título · una banda
  de 3 o 4 cifras grandes · contexto y reto lado a lado · «Cómo lo hice» en capítulos
  numerados · el impacto · «Lo que me llevo», una frase tuya en cita · y el caso anterior y el
  siguiente, en el orden de la trayectoria.
- **De dónde sale el texto:** del corpus a fondo que aprobaste. Cada cifra de la banda **tiene
  que aparecer en el documento a fondo del mismo nombre** (`data/a-fondo/<slug>.es.md`), en
  número o en letras; si pones una que el documento no dice, la publicación falla nombrándola.
  La lección es una frase de ese mismo documento.
- **Cómo agregar o editar uno (cero código):** en `data/cv.es.yaml` y `cv.en.yaml`, el proyecto
  lleva un `slug:` (IGUAL en los dos idiomas) y un bloque `casestudy:` con estos campos, en
  este orden:

  ```yaml
  casestudy:
    titular: "La tesis del caso en una frase."
    contexto: >-
      Dónde y qué estaba pasando.
    reto: >-
      Qué había que lograr.
    cifras:            # 3 o 4, cada una en su documento a fondo
      - valor: 27
        etiqueta: "agentes construidos con el proceso core"
      - valor: 90
        prefijo: ">"   # opcional: ~ · > · + · −
        sufijo: "%"    # opcional
        etiqueta: "de precisión en modelos en producción"
    capitulos:         # de 3 a 6
      - titulo: "La arquitectura en Microsoft Fabric"
        texto: >-
          Un párrafo corto: qué hice y por qué.
    impacto:
      - "Un resultado por línea."
    leccion: >-
      Una frase tuya del documento a fondo.
  ```

- **Lo que la publicación NO te deja hacer** (y te lo dice con el campo): un caso sin
  `titular`, `cifras`, `capitulos` o `leccion`; menos de 3 cifras o más de 4; menos de 3
  capítulos o más de 6; una cifra que el documento a fondo no dice; un hito de la trayectoria
  sin su caso; y un caso que en inglés tenga otras cifras u otro número de capítulos.
- **Minimalismo medido:** titular hasta 40 palabras, título de capítulo hasta 8, texto de
  capítulo hasta 70, etiqueta de cifra hasta 9, lección hasta 45. Si un capítulo crece hasta
  ser un ensayo, la prueba lo nombra: la profundidad vive en el chat, no en la página.
- **Quitar uno:** hoy no se puede sin quitar también el hito, porque cada hito exige su caso.
  Si alguna vez un hito no debe tenerlo, se relaja esa prueba a propósito
  (`tests/unit/casos-de-estudio.test.ts`).

### Perfil, Certificaciones y Skills en la HOME · desde Sprint 002 · Skills rehecha post-S7

- **Qué hace:** las secciones que estaban guardadas desde el content pack ahora son
  visibles: el párrafo de Perfil, las 5 certificaciones (la DP-600 resaltada) y los 4 grupos
  de skills. **AI-102 salió el 2026-09-10:** Microsoft la descontinuó, y con ella se fue de
  todo el contenido que la nombraba (titular, perfil, logro, case study de Vesting, corpus
  del chat, `apps.yaml`).
- **Una credencial nombrada es una credencial listada:** si el CV o `apps.yaml` mencionan un
  código (DP-600, AI-102…) que no esté en `certificaciones:`, el test de contenido lo nombra con
  su ruta y falla. Para volver a citar una certificación, primero va a la lista.
- **Con una excepción, y solo en la prosa del «a fondo» (S8):** ahí hace falta poder **explicar
  por qué una credencial ya no está o todavía no está** — el AI-102 que Microsoft descontinuó, la
  ruta del AI-103 en curso—. Para eso existe `data/credenciales-nombradas.yaml`: un código se
  declara ahí, **con su razón escrita**, y entonces los documentos de `data/a-fondo/` pueden
  nombrarlo. **El CV sigue igual de estricto:** un código declarado ahí no autoriza a ponerlo en
  el titular, el perfil ni los logros. Nombrar una credencial que no se tiene es una decisión, y
  una decisión sin razón escrita no es declarable.
- **El tercer estado — «en curso» (revisión post-S8):** una certificación que estás preparando
  se lista con `estado: "en curso"` y **sin `fecha`** (una obtenida sin fecha rompe el build). La
  HOME la enseña con el chip «En curso» en el sitio de la fecha; `/cv` y el chat dicen «(en
  curso)». Así entraron el **AI-103** y el **AI-300**, en paralelo. (El DP-100 ocupó ese lugar hasta
  el 2026-09-19: Microsoft lo retiró el 1 de junio de 2026 y declaró el AI-300 como su
  reemplazo, así que salió de `certificaciones` y pasó a `data/credenciales-nombradas.yaml`.) El logro «5 certificaciones» sigue contando solo las
  obtenidas. **Y el gate vigila lo contrario:** cada vez que el titular, el perfil, un logro,
  `messages/` o `apps.yaml` nombran un código en curso, tienen que llevar «en curso» (o «en
  ruta», «en preparación», «in progress») a menos de 48 caracteres — «(AI-103)» a secas pone
  rojo el test nombrando la ruta exacta. Nombrar una credencial que no se tiene es una decisión;
  fingir que se tiene, no.
- **El barrido de credenciales mira también `messages/`** (post-S8): ahí sobrevivió AI-102 en la
  descripción SEO tres días después de su retiro, porque el test solo miraba `data/`.
- **Logos de las instituciones (post-S8, decisión del dueño):** cada certificación y cada
  estudio puede llevar `logo:` con el nombre de un archivo de `public/logos/` (`javeriana.png`,
  `british-council.svg`, `microsoft.svg`, `ibm.svg`). Se pinta pequeño y en gris junto al
  nombre, a **20 px de alto salvo que `logoAlto:` diga otra cosa** (entre 12 y 48): un escudo
  cuadrado a 20 px se ve la mitad que un logotipo ancho, así que la Javeriana va a 40, IBM a 16 y el British
  Council, muy apaisado, a 14. **Un `logo:` cuyo archivo no exista pone rojo el test de contenido** nombrando el
  estudio o la certificación. Para añadir uno: el archivo a `public/logos/` (SVG ligero o PNG
  pequeño; el de la Javeriana es PNG porque su SVG pesa 150 KB), su procedencia y licencia a
  `public/logos/LICENCIAS.md`, y el campo en el YAML.
- **Iconos por dato, el respaldo:** si no hay `logo:`, la tarjeta pinta `icono:` con uno de
  `universidad · idiomas · curso · insignia · datos · codigo` (Lucide, pequeño, solo líneas,
  sin color). Un nombre fuera de la lista rompe el build.
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
  con `titulo`, `institucion`, `periodo`, `nota` (opcional) e `icono` (opcional, post-S8; ver
  arriba). Hoy hay tres, tomadas del PDF
  2024-I del dueño: Ingeniería Industrial (2009 — 2016), los estudios de Diseño Industrial
  (2011 — 2016) y el curso de inglés con IELTS en Melbourne (2013 — 2014). **Todo estudio lleva
  año:** un `periodo` sin cuatro dígitos pone rojo el test de contenido. Mismo número de estudios
  en ES y EN.

### La vitrina, asomada en la HOME · desde la revisión post-S7

- **Qué hace:** en el sitio que tenía «Proyectos», la HOME enseña las cuatro cajas de la vitrina
  con su cuenta real de **productos** y un botón «Explora el portafolio». Son las mismas cajas del
  portal: no hay nada que editar aparte de `data/vitrina.yaml`.
- **Nombres, desde la revisión post-S8:** la sección se llama **«Vitrina»** (antes «Lo que
  construyo») y el primer nivel del menú que lleva al portal se llama **«Portafolio»** — dos
  enlaces «Vitrina» en el mismo menú a sitios distintos era una trampa. En todo el copy visible,
  «pieza» pasó a **«producto»**; en el código, el contrato de ficha técnica y `public/piezas/`
  sigue diciendo pieza, a propósito: es el nombre del dominio, no el de la vitrina.
- **El formulario de contacto (post-S8):** ya no se titula «Solicitar acceso» sino **«Escríbeme»**,
  y el tercer campo es el desplegable **«Motivo (opcional)»**: un proyecto, una asesoría, una
  capacitación, una charla o un rol. El motivo elegido es el **asunto** del correo («[CV Viva]
  Una asesoría»); sin motivo, «[CV Viva] Mensaje desde la hoja de vida». Las opciones viven en
  `MOTIVOS` (`src/lib/schemas.ts`) y sus textos en `messages/*.json` bajo `form.motivos`.
- **Hay DOS formularios (decisión tuya, 2026-09-13):** el general de la portada, que pide un
  motivo, y la **lista de espera de las apps**, al pie de `/vitrina/apps` y de cada ficha de app
  (ahí llega ya con esa app elegida). Su desplegable lista las apps publicadas en
  `content/vitrina/` más **«Otra»**; el asunto del correo es «[CV Viva] Lista de espera: <app>».
  **Solo las apps tienen lista de espera:** agentes, investigaciones y tableros se muestran para
  enseñar capacidades y no se entregan, así que sus páginas cierran con «Escríbeme» al formulario
  general. Lo declara `listaDeEspera: true` en `data/vitrina.yaml` (solo en `apps`; un test lo
  vigila).

### Descargar CV en PDF (ATS) · desde Sprint 002

- **Qué hace:** el botón "CV (PDF)" (siempre visible arriba) y la página `/cv` entregan un
  PDF cuyo texto se puede copiar y que los sistemas de reclutamiento (ATS) pueden leer.
  `/cv` además es la versión imprimible de la hoja de vida completa.
- **Cómo se actualiza:** solo. El PDF se genera en cada publicación desde los mismos YAML
  que alimentan la página — editar el contenido y hacer push regenera web Y PDF a la vez;
  nunca quedan desincronizados.
- **Limitación conocida:** el PDF es deliberadamente sobrio (texto estructurado, sin
  diseño gráfico) — eso es una feature para los ATS, no un pendiente.
- **Cómo se ve desde la revisión post-S8 (bloque D):** dos columnas —experiencia y proyectos a la
  izquierda; perfil, formación, certificaciones y skills a la derecha—, acentos en azul navy y
  texto Helvetica seleccionable, en el orden que un ATS lee (cabecera → perfil → experiencia).
  **Tu dominio va muy resaltado** (desde el 2026-09-24): un bloque azul navy con el dominio en
  blanco arriba a la derecha, a la altura de tu nombre, y debajo, centrado respecto al recuadro, «En mi
  sitio encontrarás» / «CV interactivo · casos · chat» (desde el 2026-09-26);
  el perfil cierra con «Más en mi sitio: dominio.» y el pie de cada página lo repite pequeño con
  el número de página. Los tres se pueden pulsar y abren el sitio en el idioma del PDF. El dominio
  no se escribe en ningún archivo: el build lo toma de la variable `NEXT_PUBLIC_SITE_URL` de
  Vercel. **Sin variable, o en local, el PDF sale sin bloque, sin pie y sin dominio.** Por eso la
  variable se pone **cuando el dominio ya abra el sitio**: antes, el PDF mandaría a los
  reclutadores a una dirección que no carga. Una certificación «en curso» dice «(en curso)» en vez de
  fecha.
- **Dos páginas, sin repetir y sin dejar nada por fuera** (desde el 2026-09-24). El PDF cuenta
  **cada experiencia una sola vez**: los ocho empleos con **todos** sus logros, y ningún caso de
  estudio vuelve a aparecer como «Proyecto», porque es la misma historia que su experiencia. La
  sección «Proyectos» solo sale si agregas un proyecto que **no** es de ningún empleo (hoy no hay
  ninguno, así que no se pinta). Cuatro pruebas lo cuidan, y la publicación te avisa si una falla:
  - el PDF no pasa de **dos páginas**;
  - **cada logro de cada experiencia** está en el PDF (nadie puede recortarlos para que quepa);
  - **ningún caso se repite** como proyecto;
  - **cada cifra de la banda de un caso está también en los logros de su experiencia**. Si
    agregas una cifra a un caso y no a los logros de su empleo, la prueba te dice cuál falta y
    dónde ponerla: el PDF no lista los casos, así que sin eso esa cifra quedaría por fuera.

### Las apps del pipeline (`data/apps.yaml`) · desde Sprint 001 · reorganizado 2026-09-05

- **Qué cambió:** la sección **«Apps» de la portada se retiró**. No enseñaba apps que se pudieran
  visitar: enseñaba _esta misma página_ (CV Viva y su chat) y dos exploraciones sin producto —
  mientras «Vitrina», a un centímetro en el mismo menú, sí llevaba a seis apps construidas. Dos
  puertas prometiendo lo mismo. **Ahora lo construido tiene una sola puerta: la Vitrina.**
- **Nada del contenido se perdió.** `data/apps.yaml` sigue siendo la fuente y alimenta tres cosas:
  - **Las brochures** `/es/apps/hoja-de-vida` y `/es/apps/chat-hoja-de-vida` — se llega a ellas
    desde el bloque **«De esta casa»**, al cierre de `/es/vitrina`.
  - **El roadmap votable** ya no sale de `apps.yaml`: vive en `data/fichas/<slug>.yaml` y se
    vota en la página de cada app hermana (ver «Roadmap con votación anónima»).
  - **El formulario de contacto** ya no lista apps (desde la tercera revisión post-S8 pide un
    «Motivo»). El campo `solicitable:` **se retiró** de `apps.yaml` (2026-09-13): la lista de
    espera lista las apps de `content/vitrina/`. Si un YAML viejo lo trae, la publicación falla
    nombrándolo.
- **Cómo dar de alta una app:** editar `data/apps.yaml` + push, igual que siempre. Si le pones
  bloque `brochure:`, aparece su página y su enlace en «De esta casa»; si le pones `roadmap:`,
  entra a la votación.

### Roadmap con votación anónima · desde Sprint 004 · por app hermana desde el 2026-09-13

- **Qué hace:** en la página de cada app hermana (`/es/vitrina/apps/<slug>`, entre la ficha
  técnica y la lista de espera) la sección "Roadmap" muestra lo que esa app tiene planeado para el
  final de su camino y deja que quien visita **vote con un clic, sin registrarse**. El número
  junto a cada feature es el **conteo real** de votos en la base de datos.
- **Qué NO se muestra (tu decisión, 2026-09-13):** ninguna feature de CV Viva ni del chat. Las
  siete del S4 se retiraron y `apps.yaml` ya no admite `roadmap:` (si lo trae, la publicación
  falla nombrándolo). El escaparate `/vitrina/apps` tampoco monta roadmap: solo asoma las apps.
- **De dónde salen las features:** del complemento curado de cada app, `data/fichas/<slug>.yaml`,
  campo `roadmap:`. Lo administra la **planeadora** (procedencia `cv-viva`) con el criterio que le
  pediste —las más disruptivas e innovadoras y las de cierre de plan, nunca las que ya se están
  construyendo— y **llega por copia: no se edita aquí**. Hoy: 5 features por app y 3 en
  `dash-agent-ai` (su plan es cerrado; la tercera es la más condicionada, se puede quitar si
  prefieres dos). Una app sin `roadmap:` simplemente no muestra la sección.
- **⚠ Ojo con el `id` de una feature:** el voto se cuenta por el par (app, id de la feature). Si
  **cambia el `id`** de una feature ya publicada, sus votos anteriores quedan bajo el id viejo y
  la feature "reinicia" su conteo. La planeadora lo sabe (ids estables); si una feature se
  construye, sale del roadmap y sus votos quedan archivados en la base.
- **La regla del contador honesto:** el número mostrado siempre sale de la base de datos en el
  momento. Si la base de datos no responde, la sección lo dice ("La votación no está disponible…")
  y **deshabilita los botones** — nunca verás un número inventado ni congelado. **En tu computador
  pasa siempre** (no hay credenciales de Supabase en local): votar de verdad se prueba en producción.
- **Dedup de votos (y su límite honesto):** cada navegador puede votar una vez por feature; tras
  votar, el botón queda en "Ya votaste". Esto se guarda en el navegador del visitante
  (localStorage), así que es un dedup **de mejor esfuerzo**: si alguien borra los datos del
  navegador o usa otro dispositivo, podría volver a votar. Es deliberado — para no votar dos
  veces sin pedir registro ni guardar datos personales. **Cero PII:** la base solo guarda
  (app, feature, fecha), nunca IP ni identidad (Ley 1581).
- **Dónde veo los votos:** en el panel de Supabase (tabla `votes`) o en los logs de Vercel (cada
  voto queda registrado con app, feature y el total resultante). Los votos de las siete features
  viejas de CV Viva siguen en la tabla, sin mostrarse; borrarlos es decisión tuya. Analítica:
  eventos `roadmap_visto`, `voto_emitido`, `voto_rechazado`.
- **Apagar la votación:** en Vercel pon `VOTACION_ENABLED=false` (o quita `SUPABASE_URL`/
  `SUPABASE_ANON_KEY`) y redeploy — la sección se muestra en modo "no disponible", honesta y sin
  botones activos.
- **Proponer una funcionalidad (desde el 2026-09-13):** debajo del roadmap de cada app hay una
  caja «¿Qué te gustaría que hiciera <app>?» con correo opcional y el botón «Proponer». La
  propuesta **te llega por correo** con el asunto «[CV Viva] Propuesta para <app>» (reply-to solo
  si el visitante dejó su correo); **nada se publica ni se guarda en la base de datos**. Mismas
  protecciones que el formulario de contacto (límite por visitante, trampa anti-bots, y la app
  tiene que existir). En tu computador el envío se simula, como el de contacto. Qué hacer con
  ellas: las buenas se las pasas a la planeadora en la revisión de features. Cuando haya
  volumen, se evaluará hacerlas públicas y votables, con control de spam — no antes.

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
- **Un frente «en preparación» tiene página igual:** dice qué es y en qué punto está, **sin
  fecha prometida**, y cierra como los demás frentes (lista de espera solo si es `apps`). Marca el
  inicio; no lo disfraza. Hoy **ningún frente
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
  no lo haya y un único botón de **lista de espera** (solo en las apps), sin promesa de fecha.
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

### Modo mantenimiento · desde el 2026-09-24

- **Qué hace:** pone **todo** el sitio en una página de «Estoy afinando mi sitio», en el idioma
  de quien llega, con dos salidas: **descargar tu CV en PDF** (los PDF se siguen sirviendo) y tu
  correo y LinkedIn. Sin menú, sin chat y sin formularios. Arriba a la derecha, **ES / EN** cambia
  la página de idioma, y bajo el botón hay un enlace al **CV en el otro idioma** (desde el
  2026-09-26).
- **Cómo se pone:** en Vercel, **Settings → Environment Variables**, cambia `MANTENIMIENTO` a
  `on` (Production) y haz **Redeploy** del último deploy de Production. En 3–4 minutos, todo
  el sitio muestra la página.
- **Cómo se quita:** cambia `MANTENIMIENTO` a `off` y haz **Redeploy**. En 3–4 minutos vuelve el
  sitio.
- **A prueba de errores:** solo `on` lo enciende. Con `off`, vacía, sin la variable o con un error
  de tipeo, el sitio sigue arriba. Nunca se apaga sin querer.
- **Google no pierde nada:** cada página responde **503** («no disponible por ahora») con
  `Retry-After`, que le dice al buscador que vuelva después. No reemplaza tu sitio por el aviso.
- **Tus previews no se afectan:** la variable vive solo en Production.
- **Con el sitio arriba, `/es/mantenimiento` no existe** (404): nadie la encuentra por error.
- **Qué lo prueba:** `tests/unit/mantenimiento.test.ts` (el interruptor y el proxy) y
  `tests/e2e/mantenimiento.spec.ts` (con el sitio arriba no se cuela).

### Idiomas · desde Sprint 001

- **Qué hace:** la página completa existe en `/es` y `/en`, con el botón ES/EN en el encabezado.
  Cambiar de idioma conserva la sección donde estaba el visitante.
- **Cómo se usa:** nada que configurar; el contenido sale de los dos YAML espejo.

### El formulario «Escríbeme» · desde Sprint 001 (antes «Solicitar acceso»)

- **Qué hace:** el formulario de la sección Contacto envía un email a tu correo con nombre,
  email, motivo y mensaje del visitante. El visitante ve la confirmación "Recibí tu mensaje, te
  respondo en 1–3 días hábiles."
- **A dónde llega:** al correo configurado en Vercel (`SOLICITUDES_TO_EMAIL`; si no está, al
  Gmail interno que trae el código). Es tu correo **interno**, distinto del que se muestra en la
  página. Puedes responder directo: el "reply-to" es el email del visitante. Revisa también spam
  la primera vez.
- **En tu computador NO llega, y es a propósito:** `localhost` no tiene `RESEND_API_KEY` (no hay
  `.env.local`), así que el envío se **simula**: el visitante ve la confirmación y el servidor
  solo anota «envío simulado» en su log. El correo real solo se prueba desde el sitio publicado.
- **Protecciones:** máximo 5 envíos por minuto por visitante, una trampa anti-bots invisible y un
  motivo que solo admite la lista del desplegable.
  ⚠ Si `RESEND_API_KEY` no está configurada en Vercel, pasa lo mismo que en local: el formulario
  "funciona" para el visitante pero el email NO se envía — verifica esa variable en prod. Y el
  remitente por defecto (`onboarding@resend.dev`, el de prueba de Resend) solo puede escribirle
  al correo dueño de la cuenta de Resend: para cualquier otro buzón hace falta un dominio
  verificado en Resend y `SOLICITUDES_FROM_EMAIL`.

### El chat que responde por ti · desde Sprint 003

- **Qué hace:** el botón flotante "Pregúntale a mi HV" (abajo a la derecha, en todas las
  páginas) abre un chat donde el visitante pregunta en español o inglés y recibe respuestas
  basadas SOLO en tu contenido real, con **fuentes citadas** que llevan a la sección o case
  study correspondiente. Si pregunta algo ajeno (el clima, chistes, tareas), recibe una
  respuesta amable fija — sin gastar un solo token. Y si el proveedor de IA se cae o se queda
  sin cuota, el chat **no muere**: pasa a "Búsqueda local" y muestra los fragmentos de la hoja
  de vida que mejor responden, avisándolo con honestidad.
- **De dónde saca las respuestas:** de los mismos YAML de siempre + tus documentos **a fondo**
  (`data/a-fondo/` — ver la guía de abajo). Cada push re-indexa el conocimiento del chat.
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
- **Si el chat muestra la etiqueta «BÚSQUEDA LOCAL» en cada respuesta**, el proveedor está
  fallando y el sitio responde con el paracaídas (fragmentos crudos, sin redactar). La causa más
  probable es que **Groq retiró el modelo** — lo hace cada pocos meses y la CI no puede verlo
  porque prueba con un proveedor simulado. Pasó el 2026-08-16 con `llama-3.3-70b-versatile` y
  nadie lo notó en cinco semanas. Arreglo sin tocar código: Vercel → Logs → la línea
  `POST /api/chat` dice el error exacto; luego `CHAT_MODEL` con un modelo vigente de
  `console.groq.com/docs/models` (hoy `openai/gpt-oss-120b`) y redeploy.
- **Si un día llega una factura:** los logs (Vercel → Logs) registran proveedor, tokens y
  latencia de CADA respuesta — ahí está la traza de qué se consumió. Primeros auxilios:
  `CHAT_ENABLED=false` (se apaga ya) o volver a un proveedor free tier.
- **Si la API key falla o se agota la cuota:** los visitantes NO ven un error — ven el modo
  búsqueda local. Tú lo notas en los logs (`proveedor falló`) y en el badge "Búsqueda local"
  al probar el chat.

### El chat pide nombre y correo, y guarda cada conversación · desde el 2026-09-21 (ADR-024)

- **Qué hace:** antes de la primera pregunta, el visitante deja **nombre y correo**, marca el
  aviso de tratamiento de datos (Ley 1581) y recibe por correo un **código de seis dígitos**
  que vale diez minutos. Con el código entra y no vuelve a registrarse en 30 días en ese
  navegador. Sin código no hay chat: es la barrera contra quien solo viene a probar.
- **Qué se guarda:** en Supabase, tabla `chat_registro`: quién (nombre, correo), en qué idioma,
  **qué preguntó y qué se le respondió** (texto completo), con qué fuentes, en qué modo (IA ·
  respuesta fija a una pregunta ajena · búsqueda local), con qué proveedor y cuántos tokens.
  **Lo lees en el panel de Supabase** (Table Editor → `chat_registro`, ordena por `creado_en`).
  Ningún visitante puede leer esa tabla: la lectura es solo tuya.
- **Respuestas de dos o tres párrafos:** el chat contesta en 120–220 palabras, primero la
  respuesta directa y después el contexto con cifras, y cierra ofreciendo profundizar. Si el
  visitante quiere más, pregunta más. No vuelca los documentos.
- **Lo que tienes que configurar (una vez):**
  1. **Resend con dominio verificado.** El remitente de cortesía solo entrega a tu propio
     correo: para que el código llegue a cualquier visitante, verifica el dominio del sitio en
     Resend y pon `SOLICITUDES_FROM_EMAIL` con ese dominio.
  2. **La migración** `supabase/migrations/20260921120000_chat_registro.sql` en tu proyecto de
     Supabase (`supabase db push` o pegarla en el editor SQL).
  3. **`CHAT_SESSION_SECRET`** en Vercel: 32 o más caracteres al azar (`openssl rand -base64 48`).
- **Apagar solo la barrera** (sin apagar el chat): `CHAT_GATE=off`. Pensado para desarrollo
  local; en producción la barrera está encendida y, si le falta el secreto o la base de datos,
  el chat responde «registro no disponible» en vez de dejar pasar.
- **Borrar los datos de alguien:** el aviso dice que puede pedirlo desde Contacto; se borra a
  mano en Supabase (`delete from chat_registro where email = …`).
- **«¿Algo no funciona? Avísame»** (desde el 2026-09-24): bajo «Pedir otro código» —y en el
  primer paso, si algo falló— el visitante puede avisar sin salir del panel, con un texto
  opcional. **Te llega por correo** con el asunto «[CV Viva] Problema con la puerta del chat»,
  dirigido para que al responder le escribas al visitante, y con el **diagnóstico del
  servidor** en ese momento: si el secreto de sesión, el almacén y el envío de correos están
  configurados. Si dice «NO» en alguno, ya sabes qué variable revisar en Vercel. Límite: tres
  avisos por visitante cada diez minutos.

### Cómo alimentar el «a fondo» (el combustible del chat) · desde Sprint 008

> **Reemplaza a «Cómo alimentar la historia» (S3).** `data/historia/` se retiró en el Sprint 008:
> eran dos archivos con 12 encabezados y **cero prosa** — las ~40 palabras de cada sección eran
> la GUÍA de qué escribir, no el contenido. Sus 12 secciones migraron a `data/a-fondo/`
> conservando id, título, destino y guía palabra por palabra, y el canal nuevo trae lo que le
> faltaba al viejo: un documento por tema en vez de dos archivos gigantes, aduana que rompe el
> build nombrando archivo y campo, y un estado que separa el borrador de lo publicable.

Tu workstream de contenido: **un archivo por tema**, en `data/a-fondo/<tema>.es.md` y su gemelo
`.en.md`. Es el corpus profundo del chat — lo que no cabe en el CV.

**Lo primero, y lo único que de verdad tienes que recordar: `estado`.**

| `estado`   | Qué pasa                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| `borrador` | El chat **no lo indexa** y **no se le exige el gemelo en inglés**. Es tuyo, para escribir y corregir con calma. |
| `aprobado` | El chat **lo indexa y lo cita** — y el build **exige** el gemelo `.en.md` completo, subsección por subsección.  |

Así la base entera puede vivir en español mientras la corriges, sin romper la publicación y sin
que el chat cite media traducción. **Tú decides cuándo un documento pasa a `aprobado`**: cambias
esa palabra, se traduce, y el siguiente deploy lo pone a responder.

**La cabecera del documento** (el bloque entre `---` y `---`):

```yaml
---
slug: vesting # = nombre del archivo, sin el idioma
codigo: AF-09 # el código que enseña el chip de la cita; fijo, el mismo en los dos idiomas
titulo: "Vesting — la plataforma de datos para agentes de IA"
resumen: "Una o dos líneas: de qué va este documento."
cuando_usar: "Úsalo cuando pregunten por Vesting, Microsoft Fabric desde cero, el monitoreo de agentes…" # como la descripción de una skill
estado: borrador # borrador | aprobado
ancla: "/proyectos/vesting" # a dónde navega la cita — VA ENTRE COMILLAS
actualizado: 2026-09-12
preguntas_de_prueba: # mínimo 3 — y una de ellas con palabras de AFUERA, no del documento
  - "¿Cómo diseñó Henry el ecosistema de datos de Vesting?"
  - "¿Qué es el proceso core replicable de agentes?"
  - "¿Cómo monitorea un agente de IA en producción?"
---
```

**`cuando_usar` es la descripción de una skill.** Una o dos frases con **las palabras con las
que alguien preguntaría** por este documento: nombres de empresas, herramientas, temas. Entra al
índice del chat como el **primer fragmento del documento**, junto al resumen, así que cuando la
pregunta de afuera encaja con la descripción, el chat encuentra el documento entero antes que una
subsección suelta. Medido al introducirlo (2026-09-21): las respuestas «de primeras» del banco
subieron de 103 a 106 en español y de 104 a 118 en inglés. Si el español lo trae, el gemelo
también (la aduana lo exige).

**El `codigo` es tuyo (desde 2026-09-23).** Los documentos no se publican, así que el chip de una
cita no puede enseñar «el documento»: enseña **de dónde salió la frase y a dónde lleva**, por
ejemplo `[1] AF-09 · Vesting`. El código (`AF-NN`, dos dígitos) te dice **qué archivo corregir**
cuando una respuesta te suene rara: `AF-09` es `vesting.{es,en}.md`, y la tabla de
`data/a-fondo/README.md` los lista todos. Un documento nuevo toma el siguiente número libre y
**no se reutiliza** un código retirado. Lo que el chat cita del CV lleva `CV`, lo de `apps.yaml`
lleva `APP` y lo de una ficha de la vitrina lleva `FT` (esa se corrige en origen, no aquí). El
**destino** («Vesting», «Skills», «Agentes especializados») no lo escribes: sale del nombre del
proyecto en el CV, de la etiqueta del menú o del nombre del frente o la pieza, en cada idioma.

**Las comillas del `ancla` no son decoración:** sin ellas, un `#perfil` lo lee YAML como un
comentario y el campo llega vacío. El build lo dice, pero es más fácil no tropezar.

**Dentro del documento**, las ÚNICAS 2 marcas de siempre:

1. El título `## Así se titula la subsección`
2. Debajo, el comentario `<!-- seccion: un-id-unico -->`

El resto es prosa normal, en primera persona, en párrafos. **Cada subsección es un fragmento
citable**: cuando el chat responde con ella, el chip `[n] AF-NN · destino` lleva al `ancla` del
documento, y el título de la subsección queda en el tooltip del chip.

**Lo que el build NO te deja publicar** (y te lo dice con archivo y campo):

- Una cabecera incompleta, con un `estado` inventado o con un `codigo` que no sea `AF-NN`.
- Dos documentos con el mismo `codigo`, o gemelos ES/EN con códigos distintos.
- Dos subsecciones con el mismo id en un documento.
- Un documento `aprobado` sin su gemelo en inglés, o con distintas subsecciones entre idiomas.
- Un documento `aprobado` que todavía tiene un `[CONFIRMAR: …]`. **Aprobar es justamente haber
  resuelto esas preguntas**: si quedara una, el chat se la citaría tal cual a un visitante —tu
  pregunta a ti mismo publicada como si fuera evidencia—.
- Un correo, un teléfono, siete dígitos seguidos (cédula, NIT) o una dirección web en la prosa.
- Un `ancla` que **no existe en el sitio**. Esta es nueva y vale la pena entenderla: si mañana
  se retira una sección de la HOME, los documentos que citaban hacia ella se ponen en rojo. Una
  cita que no lleva a ninguna parte rompe la única promesa del chat.
- Un `ancla` que existe pero **no tiene nombre** para el chip (una sección nueva de la HOME sin
  etiqueta en el menú, por ejemplo). Antes de que un chip diga «undefined», el build lo dice.

**Lo que ningún programa puede cazar por ti: los nombres propios.** El barrido caza correos y
teléfonos; a un jefe, un cliente o un compañero mencionado por su nombre **no lo caza un regex**.
Esa decisión es tuya, documento por documento.

**Ninguna cifra, fecha ni logro sin fuente — y sin `[CONFIRMAR]` (regla del dueño, 2026-09-20).**
Un dato que falta **se omite**; nunca se inventa y nunca se deja como pregunta dentro de la
prosa. Si algo es interpretable (un efecto «del orden de», un porcentaje aproximado) se estima
**y se declara como estimación** en el texto («del orden de», «cerca de»), y las estimaciones
**no** entran a `cv.*.yaml`, que es la fuente que el sitio publica como hecho. La marca
`[CONFIRMAR]` sigue existiendo solo como red del build: si aparece, el documento no puede pasar
a `aprobado`. Las preguntas al dueño van en una hoja aparte, fuera del repositorio, todas de
una vez.

**Y hay seis cosas más que `pnpm test` no deja pasar (a fondo v2, 2026-09-20).** Nacieron de
auditar el corpus de partida —213 rojos— y se quedan vigilando lo que escribas después:

| Gate                        | Qué exige                                                                                                                                                                                                                   | Dónde se ajusta                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Cifras del sitio**        | Cuando nombras cuántas apps, piezas, agentes, investigaciones, tableros o credenciales hay, el número es el que el sitio publica (se deriva de `content/` y `cv.es.yaml`). «Cinco apps» con seis publicadas se pone en rojo. **Y desde el 2026-09-21, también las cifras del propio repositorio:** cuántas decisiones de arquitectura lleva registradas, cuántos sprints cerró, cuántos jobs de integración continua corre y de cuántos fragmentos es el índice del chat. | `tests/fixtures/cifras-a-fondo.yaml`         |
| **Fechas de cargos**        | Una fecha dentro de la frase de un cargo cae dentro de su periodo, y los periodos coinciden con `cv.trayectoria` mes a mes.                                                                                                 | `tests/fixtures/cargos-a-fondo.yaml`         |
| **Densidad**                | Cada subsección tiene ≤ 400 palabras **y** al menos un dato concreto (una cifra, un mes, una herramienta o una organización del CV). Una subsección de opinión sin nada verificable no se publica.                        | `scripts/a-fondo-coherencia.mjs`             |
| **Léxico obligatorio**      | Cada documento dice literalmente las palabras con las que alguien de afuera lo buscaría (la búsqueda es léxica).                                                                                                            | `tests/fixtures/lexico-a-fondo.yaml`         |
| **Sin párrafos repetidos**  | Ningún bloque de 25 palabras aparece en dos documentos: lo que se repite se dice en uno y el otro remite.                                                                                                                  | —                                            |
| **Normas con año**          | `ISO/IEC 42001` va sin año o con `:2023`; `UNE-ISO/IEC 42001` con `:2025`; `ISO 9001` con `:2015`.                                                                                                                         | `scripts/a-fondo-coherencia.mjs` (`NORMAS`)  |

Cuando agregues un cargo, una cifra del sitio o un tema nuevo, el fixture correspondiente se
actualiza en el mismo commit; el gate te dirá cuál.

**Por qué el gate de cifras creció (2026-09-21).** Los seis vigilaban lo que el corpus dice del
CONTENIDO del sitio. Ninguno vigilaba lo que el corpus dice **del sitio como obra**, y esas
cifras envejecen solas: el día que se mergea una decisión de arquitectura, la frase «este sitio
lleva 21 decisiones registradas» deja de ser verdad sin que nadie toque el corpus. Pasó
exactamente así: el corpus decía 21 cuando ya había 24, y seis gates verdes no lo vieron. Ahora
la verdad se deriva de `decisions/`, de los resúmenes de sprint, de `ci.yml` y del índice que
construye el build, igual que las otras: **aquí tampoco se escribe ningún número a mano**.

Dos detalles de ese gate, porque el corpus los necesita:

- **La historia del índice se declara.** El índice nació con 28 fragmentos, las fichas de la
  vitrina aportaron 226, con el corpus v2 eran 494 y hoy son del orden de 1.400. Contar de dónde
  viene es parte del argumento y es verdad, así que el número de cada etapa se declara como hito
  en `tests/fixtures/cifras-a-fondo.yaml`, con su razón escrita al lado. Lo que el gate no deja
  pasar es presentar un número de otra época como si fuera el de hoy.
- **El tamaño del índice admite una banda del 5 %.** Ese número se mueve con cada párrafo que
  escribas; exigirlo exacto volvería el gate circular, porque corregir la cifra la mueve otra
  vez. Con la banda, «del orden de 1.400 fragmentos» pasa y «494» no.

**El ritmo:** escribe un documento → déjalo en `borrador` todo el tiempo que quieras → cuando
esté bien, `aprobado` + su gemelo en inglés → commit + push. En local puedes comprobarlo con
`pnpm build`: la última línea dice cuántos documentos hay y cuántos están aprobados e indexados.

**Un tema nuevo:** copia cualquier documento, cámbiale el `slug` (que debe coincidir con el
nombre del archivo) y escribe. Lo único que hay que actualizar es el léxico obligatorio del
documento (`tests/fixtures/lexico-a-fondo.yaml`) y tres preguntas suyas en el banco.

**El gemelo en inglés** se traduce del español ya cerrado, subsección por subsección: mismos
ids, mismas tablas, mismas cifras (con la puntuación inglesa: `1,000`, `52%`), **nada nuevo en
inglés**. El glosario de términos fijos (vitrina → showcase, ficha → sheet, tablero →
dashboard, a fondo → in-depth…) vive en la bitácora `sprints/CONTENIDO-a-fondo-v2-bitacora.md`.

### Las fichas de la vitrina también hablan por el chat · desde a fondo v2

Desde el 2026-09-20 (ADR-023) el índice del chat incluye las **32 fichas de la vitrina**: por
cada app, su presentación, funcionalidades, cifras y límites; por cada agente, investigación o
tablero, su presentación, cifras, límites y bloques. Cada fragmento cita hacia la ficha
(`/vitrina/apps/<slug>` o `/vitrina/<frente>/<slug>`). No hay nada que escribir: **una ficha que
llega a `content/` entra al chat en el siguiente build**.

Las fichas pesan **la mitad** que tus documentos en el ranking: son evidencia de una pieza
concreta, y tu voz es el documento a fondo. Si preguntan por una pieza, la ficha gana; si
preguntan por ti, gana el documento. El número (0,5) salió de medir el banco de preguntas y está
en el ADR.

### Cómo se prueba que el contenido contesta · desde Sprint 008

Escribir el documento es la mitad. La otra es comprobar que **el chat lo encuentra cuando alguien
pregunta**, y eso no se mira a ojo: hay dos conjuntos de preguntas que corren en cada `pnpm test`.

| Conjunto                                  | Dónde vive                                    | Qué exige                                                                   |
| ----------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| **Las preguntas de prueba del documento** | en su propia cabecera (`preguntas_de_prueba`) | Que cada pregunta traiga **su** documento. La prueba viaja con el contenido |
| **El banco de preguntas**                 | `tests/fixtures/banco-de-preguntas.es.yaml` y su gemelo `.en.yaml` | Que 136 preguntas **de afuera**, en cada idioma, traigan la fuente que debería contestarlas |

**Por qué hacen falta los dos.** Las preguntas de prueba de un documento se escriben con el
documento delante, así que usan sus palabras. Quien recluta usa las suyas: «MLOps», «lakehouse»,
«posgrado», «pipelines». Y la búsqueda de este chat es **léxica** — si el corpus no dice esa
palabra, no hay nada que traer, por más que el trabajo esté hecho. El banco es, además de una
prueba, una **auditoría de vocabulario**.

**Cuando una pregunta del banco se pone roja hay dos salidas honestas y ninguna es aflojarla:**

1. el contenido no lo dice con las palabras de quien pregunta → **se corrige el documento**;
2. la contesta mejor otra fuente → **se corrige `espera:` en el banco**.

Inventar contenido para que pase es la tercera, y está prohibida.

**Para agregar una pregunta** basta con escribirla en el banco con la fuente que esperas:

```yaml
- pregunta: "¿Tiene experiencia con Docker y Kubernetes?"
  espera: [plataforma-y-despliegue] # el slug del documento que debería contestarla
  familia: plataforma-y-datos
```

**Para leer cómo va todo junto:** `pnpm corpus:informe` regenera
`sprints/SPRINT_008-banco-de-preguntas.md`, que trae pregunta por pregunta qué fragmentos trae el
chat hoy y cuáles traería con la base aprobada. Ese informe **se genera, no se escribe a mano**.

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

| Sprint        | Features añadidas a este manual                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001           | Contenido por YAML, showcase de apps, bilingüe ES/EN, solicitudes de acceso, motion.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 001bis        | Content pack v1 integrado (marca Henry Rincón), estado "en producción", enlaces de evidencia en las cards, campos `certificaciones`/`skills`/`perfil` previstos para S2.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 002           | Capa de profundidad: bullets expandibles por hito, 5 case studies con URL propia, secciones Perfil/Certificaciones/Skills, ruta `/cv` imprimible + PDF ATS descargable.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 003           | El chat que responde por ti: RAG con citas navegables, proveedor conmutable por env (Groq inicial), off-topic sin tokens, fallback local que nunca muere, kill-switch, y la historia (`data/historia/`) como corpus incremental con guía de alimentación. **La historia se RETIRÓ en el S8** (nunca tuvo prosa): su guía de alimentación la reemplaza «Cómo alimentar el a fondo».                                                                                                                                                                                                                                                |
| 004           | Roadmap con votación anónima (contador real o "no disponible", dedup por navegador, cero PII), página brochure animada por app real, y menú en móvil. Cierre del ciclo H1: el MVP funcional queda completo.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 005           | La vitrina: escaparate de las seis apps hermanas y **una página propia por app**, alimentadas por los `brochure-export.json` que cada app genera; tarjetas que se abren al llegar leyendo; capturas de las apps reales repintadas con la paleta de esta página; cero enlaces y CTA de lista de espera. Abre el ciclo H2.                                                                                                                                                                                                                                                                                                          |
| 007           | Las estanterías: los cuatro frentes de la vitrina abiertos con piezas reales (6 apps · 13 agentes · 7 investigaciones · 6 tableros). Un escaparate por frente y una ficha por pieza, con el mismo renderizador de las apps; las fichas las produce quien construye cada pieza y llegan por PR de contenido. Contrato v1.3.0: los tableros añaden «Lo que dicen los datos» y «Cómo se ve» (galería de capturas), opcionales y con renumeración automática.                                                                                                                                                                         |
| 008           | El «a fondo»: un documento por tema en `data/a-fondo/` como corpus profundo del chat, con aduana que rompe el build nombrando archivo y campo (cabecera, ids duplicados, paridad ES/EN de los aprobados, privacidad mecánica, **y ningún `[CONFIRMAR]` en un aprobado**) y un `estado` que separa el borrador de lo citable. **Banco de 131 preguntas de afuera** como prueba del contenido, con su informe generado. **El destino de toda cita se verifica contra el sitio real** — así murió el `#apps` que llevaba una revisión entera apuntando a una sección retirada. `data/historia/` retirada, sus 12 secciones migradas. |
| post-S7       | Revisión del dueño sobre la HOME: la trayectoria como índice que baja contigo (línea continua, círculo fijo a media pantalla, año grande); la vitrina en el sitio de Proyectos y los case studies desde su hito; Estudios como sección y como dato (`cv.estudios`); Skills en tarjetas con icono y trazo; el roadmap se muda a `/vitrina/apps` y sale del menú.                                                                                                                                                                                                                                                                   |
| chat/registro | El chat pide nombre y correo con código de verificación por Resend, sesión firmada de 30 días, registro de cada conversación en Supabase (`chat_registro`, lectura solo del dueño) y respuestas de dos o tres párrafos (ADR-024). |
| a fondo v2    | El corpus reescrito desde la auditoría del dueño (2026-09-19/20): 25 documentos, ~144.000 palabras por idioma (el texto del dueño, ampliado y alineado, nunca recortado), cero `[CONFIRMAR]`, seis gates de coherencia (cifras del sitio, fechas de cargos, densidad, léxico, repetidos, normas), tres preguntas de prueba por documento, las 32 fichas de la vitrina en el índice del chat con peso 0,5 (ADR-023), banco de 136 preguntas en los dos idiomas, gemelos en inglés y los 25 aprobados. |
| post-S7 (2.ª) | «Lo que construyo» entra al desplegable Hoja de vida; Estudios con los años del PDF del dueño (tres entradas); AI-102 retirada de todo el contenido (Microsoft la descontinuó) y gate nuevo: una credencial nombrada tiene que estar en `certificaciones:`.                                                                                                                                                                                                                                                                                                                                                                       |
| casos 2026-09-24 | **Ocho casos de estudio, uno por hito** (nacen C&M Consorcio, Ceinfes e Inglopres, pedidos el 2026-09-13), con la forma completa: tesis, banda de cifras, capítulos numerados, lección y navegación entre casos; cada cifra verificada contra su documento a fondo y el minimalismo medido. Bullets de la trayectoria enriquecidos y dos logros nuevos en la HOME. En el chat, «¿Algo no funciona? Avísame» en la puerta, con diagnóstico del servidor en el correo. |
| mantenimiento 2026-09-24 | **Modo mantenimiento**: `MANTENIMIENTO=on` en Vercel (Production) + Redeploy pone todo el sitio en una página con el CV en PDF y el contacto, con un 503 temporal que Google entiende; `off` + Redeploy lo quita. Solo `on` lo enciende. |
