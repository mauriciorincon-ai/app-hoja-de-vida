# CV Viva — Manual de uso

> **Documento obligatorio y vivo.** Toda feature que llega a `main` se documenta aquí en el mismo
> sprint (regla 9 del CLAUDE.md). Escrito para el **usuario final** en español llano — sin jerga
> técnica ni referencias al código. Al lanzar la app (F5), este manual es la base de la guía de
> usuario pública.

## Qué es esta app

CV Viva es tu hoja de vida convertida en una página web que se recorre como una pieza editorial
animada: identidad, trayectoria, logros, proyectos, la vitrina de apps del pipeline y, desde el
Sprint 010, «Métodos» (publicaciones largas sobre cómo se diseñan sistemas de IA, datos y BI; antes «Mi método»), en español e inglés. Quien la visita puede escribirte —por una app, una asesoría, una charla o un rol— y
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
- **El correo de tu dominio, al lado del Gmail (desde 2026-09-26):** el sitio (Contacto, el pie,
  `/cv`, la página de mantenimiento, el JSON-LD), el PDF y el chat muestran **los dos**, primero
  el del dominio. En el YAML va **solo la parte antes de la arroba**, `emailDelDominio: "hola"`:
  el dominio lo pone el build desde `NEXT_PUBLIC_SITE_URL`, porque la regla 16 no deja escribirlo
  en el repo (si pegas la dirección entera, el build se detiene). En local y en las previews, que
  no tienen tu dominio, solo sale el Gmail: nunca se inventa una dirección que no recibe. Para
  dejar de mostrarlo, borra la línea en los dos YAML. Esa dirección la reenvía Cloudflare Email
  Routing a tu Gmail (ver el BLUEPRINT).
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
  Vesting: `periodo: "2023 — 2025"` y `periodoEnLaHome: "2024 — 2025"`: el año grande dice 2024
  para no repetir el 2023 de Pichincha, y la línea dice cuándo terminó, para que no parezca un
  puesto abierto (desde el 2026-10-05). Dos pruebas lo cuidan: el periodo real tiene que decir los mismos años que el nombre
  de su caso, y la línea de la HOME no puede repetir un año.
- **Un hito que no es un empleo** (desde el 2026-10-04): `tipo: proyectos-propios` marca el puesto
  que trabajas por tu cuenta en paralelo a tus empleos —hoy, «Ingeniero de IA Generativa ·
  Proyectos propios», desde abril de 2024—. No necesita caso de estudio, no entra en la regla de
  años de la línea (su 2024 repite el de Vesting a propósito) y el PDF lo pone en su sección
  «Proyectos propios», después de la experiencia, con su descripción en vez de sus logros. **Sus
  logros nombran las piezas y nunca las cuentan**: si escribes «32 piezas» o «6 aplicaciones»
  ahí, `pnpm test` falla, porque la vitrina crece cada semana. **Y su año de inicio es uno solo**:
  si cambias el `periodo`, `pnpm test` también falla mientras la descripción, los logros o una
  frase del corpus («desde abril de 2024 planeo y diseño…») sigan diciendo otro año. Sin `tipo`,
  un hito es un empleo.
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
  HOME entraron dos: los 27 agentes construidos con el proceso core de Vesting y los productos
  analíticos de la Fundación CTIC —hoy «25+», la cifra que corregiste el 2026-10-04—. Son ocho
  logros, en cuatro columnas.

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
    cifras: # 3 o 4, cada una en su documento a fondo
      - valor: 27
        etiqueta: "agentes construidos con el proceso core"
      - valor: 90
        prefijo: ">" # opcional: ~ · > · + · −
        sufijo: "%" # opcional
        etiqueta: "de precisión en modelos en producción"
    capitulos: # de 3 a 6
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
  visibles: el párrafo de Perfil, las certificaciones (la DP-600 resaltada) y los 4 grupos
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
  reemplazo, así que salió de `certificaciones` y pasó a `data/credenciales-nombradas.yaml`.) El logro «3 certificaciones» (desde 2026-09-27: Python y SQL de IBM son cursos del Certificado Profesional) sigue contando solo las
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
  **El icono va por el `id` del grupo** (desde 2026-09-26): puedes reordenar los grupos en el
  YAML y cada uno se lleva su icono. Antes iba por posición, y al entrar «Procesos y simulación»
  en quinto lugar (2026-09-20) esa tarjeta se quedó con el dibujo de «Cómo trabajo» y «Cómo
  trabajo» con un rombo, en producción. Sin porcentajes ni «nivel de dominio», a propósito.
- **Un grupo nuevo necesita dos cosas:** su `id` en los dos YAML y **su dibujo** en
  `src/components/home/skills-iconos.tsx`. Sin dibujo, la tarjeta sale con un rombo de reserva,
  pero `pnpm test` falla nombrando el grupo, así que no llega a producción. Pídemelo y lo dibujo.
- **La rejilla es de dos columnas;** si los grupos quedan impares, el último ocupa las dos. El
  orden de hoy empareja tarjetas de tamaño parecido: Agentes con Plataforma de datos, Desarrollo
  asistido con Big data. Si agregas muchas herramientas a un grupo, revisa que su pareja no quede
  vacía al lado.
- **Las herramientas de hoy (revisión 2026-09-26, pedido tuyo):** nueve grupos, con
  «Agentes e IA generativa» y «Desarrollo asistido por IA» delante, para los roles de ingeniería
  de IA. Tres cosas que conviene recordar:
  - **LangChain, LangGraph, LangSmith y Langflow** van como usados **en la Fundación CTIC**, y
    **n8n en Vesting y en CTIC** (va junto a ellos, al comienzo de la tarjeta). Lo dicen también
    dos documentos del chat (`fundacion-ctic` y la subsección de frameworks de
    `agentes-en-produccion`), para que el chat conteste «¿qué frameworks de agentes ha usado?»
    con todo eso y no solo con n8n en Vesting.
  - **Big data multiplataforma** abre con el chip «Planeador de Fabric, Databricks y Snowflake —
    en preparación». **Cuando el planeador llegue a la vitrina**, ese chip se cambia por uno que
    remita a él (y cuando llegue la app de LangChain, igual). Es la misma regla que «Google
    Cloud — en exploración»: una etiqueta honesta hasta que haya evidencia pública.
  - **El PDF sigue en dos páginas, pero la columna de la derecha quedó casi llena.** Si agregas
    herramientas y el PDF pasa a tres páginas, `pnpm test` lo dice (el test de las dos páginas).
- **Cada grupo lleva un `id`** (desde 2026-09-26), por ejemplo `id: plataforma-de-datos`: es el
  ancla de su tarjeta (`#skills-plataforma-de-datos`), a donde llevan las citas del chat de los
  documentos de esa capacidad. Minúsculas, cifras y guiones, y **el mismo en español y en
  inglés**: el build y un test lo exigen. Un grupo nuevo necesita su `id`.

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
  **cada experiencia una sola vez**: los nueve cargos con **todos** sus logros —y, desde el
  2026-10-04, el puesto de proyectos propios en su propia sección, con su descripción—, y ningún caso de
  estudio vuelve a aparecer como «Proyecto», porque es la misma historia que su experiencia. La
  sección «Proyectos» solo sale si agregas un proyecto que **no** es de ningún empleo (hoy no hay
  ninguno, así que no se pinta). Cuatro pruebas lo cuidan, y la publicación te avisa si una falla:
  - el PDF no pasa de **dos páginas**;
  - **cada logro de cada empleo** está en el PDF (nadie puede recortarlos para que quepa); del
    puesto de proyectos propios van su cargo, su organización y su descripción;
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
  - **Apps** (`/es/vitrina/apps`): las apps del pipeline. **10 piezas.**
  - **Agentes especializados** (`/es/vitrina/agentes`): agentes sin interfaz que se manejan por
    comandos. **15 piezas.**
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

#### Categorías y carrusel · desde Sprint 009

- **Dos categorías de apps.** `/es/vitrina/apps` muestra las apps en dos bloques: **Profesionales**
  primero y **Personales** después, con **el mismo título** en los dos (la prioridad de lo
  profesional es el orden, no un título más grande). La pertenencia no vive en el código ni en el
  export: vive en `data/categorias-apps.yaml`, una lista por categoría con el `slug` de cada app
  (el de su `content/vitrina/<slug>.brochure-export.json`) y su **nombre oficial**, uno solo, igual
  en español y en inglés. **El orden de la lista es el orden de la página**, y también el de los botones «App
  anterior / App siguiente» de cada ficha y el del selector de la lista de espera.
- **Cómo clasificar una app nueva.** El día que llega su export, se agrega su `slug` a una de las dos
  listas del YAML. **Si no lo haces, la publicación falla** y el error dice el slug que falta: una
  app nueva se clasifica el mismo día, o no se publica. Una app que ya está en el YAML pero todavía
  no tiene export **se ignora** y aparece sola el día que llegue su export (así entraron AngelGhost,
  planlang, Big-D y HackGuard el 2026-10-11: las diez apps del YAML ya tienen el suyo). Un `slug` no
  puede estar en las dos listas.
- **Su tira.** La muestra de cada app lleva un **dibujo esquemático** de esta casa —no una captura—
  que resume sus ideas en cuatro columnas; vive en `src/components/vitrina/maquetas/<slug>.tsx` y se
  registra en el índice de esa carpeta. **Una app nueva entra con su tira**: si llega su export sin
  dibujo, la CI falla nombrando la app (y mientras tanto la muestra no pinta el marco vacío, como
  pasó el 2026-10-11 con las cuatro que entraron sin él).
- **Las cuentas de la guía y del manual.** Cuando entra o sale una pieza, cambian las cuentas que
  escriben `docs/GUIA-DE-PRUEBA.html` y este manual (apps, agentes, fichas del chat, apps con
  roadmap). **La CI falla** y dice la frase vieja y la cifra correcta
  (`tests/unit/documentos-cuentas.test.ts`, la misma verdad que usa el corpus del chat): se
  corrigen en el mismo PR de contenido. Si reescribes una de esas frases, el gate te pide moverle el
  ancla.
- **El nombre oficial (alias).** Cada app tiene **un solo nombre** en toda la CV Viva: en la
  muestra, la ficha técnica, el detalle, las apps vecinas, el formulario de propuestas, el selector
  de la lista de espera, los correos, el manifest, el chat (su índice y sus citas) y el PDF. **El
  export no se toca**: el nombre oficial vive en el YAML y se aplica al leerlo (ADR-028), de modo que
  el sitio nunca dice «Habla San» en un lado y «Hablemos San» en otro. Los textos tuyos (`data/cv.*.yaml`,
  `data/fichas/`, `data/a-fondo/`) usan ese mismo nombre, y **un test falla** si el nombre que trae un
  export vuelve a colarse ahí. **Si cambias un nombre**: edítalo en `data/categorias-apps.yaml` y
  corre la búsqueda del nombre viejo en `data/` (el test te lista cada archivo).
- **Las tarjetas de cada bloque van en un carrusel que muestra dónde empieza y dónde acaba**
  (ajustes del 2026-10-08). **Al entrar** ves las dos primeras tarjetas enteras, pegadas a la
  izquierda, y un pedazo difuminado de la tercera a la derecha (en el teléfono, una entera y un pedazo
  de la siguiente): ese borde izquierdo limpio es la señal de «aquí empieza». **Con las flechas** el
  carrusel avanza; cuando hay más tarjetas que las que caben, en el medio ves un pedazo difuminado a
  cada lado, y **al final** ves el espejo del inicio: las dos últimas enteras pegadas a la derecha y un
  pedazo difuminado a la izquierda. **Desde el final, «siguiente» regresa al inicio con un barrido
  rápido**, y desde el inicio, «anterior» barre hasta el final: ninguna flecha se apaga. Se recorre
  con las flechas ← y →, con el dedo, con las flechas del teclado y **con el gesto lateral del pad**
  (en el Mac, dos dedos de lado con el cursor sobre las tarjetas; en un ratón, rueda inclinada o
  Shift + rueda): una tarjeta por gesto. La rueda vertical sigue desplazando la página. Un indicador
  dice «1 de 3» (la primera tarjeta visible). Nada se mueve solo. No hay que hacer nada para que una
  app nueva entre: se clasifica en el YAML y su tarjeta aparece en su bloque, dentro del carrusel. Si
  un bloque tiene una sola app, se ve la tarjeta sola, sin flechas ni velo. La galería «Cómo se ve» de
  los tableros (abajo) no cambia.
- **El carrusel de «Cómo se ve».** La galería de cada ficha de tablero (de 1 a 12 capturas, la que
  declara `galeria` en su ficha) es un **carrusel horizontal**: se desliza con el dedo, con los
  botones ← y → o con el teclado, y un indicador dice «1 de 6». Nada se mueve solo. En cada extremo
  el botón que ya no lleva a ningún lado se ve **atenuado** y no hace nada, pero **conserva el foco**:
  quien llega al final con el teclado sigue en el carrusel (antes, en Safari, el foco saltaba al
  principio de la página). Con **una sola captura** no hay botones ni indicador. No hay que hacer nada para que una ficha nueva lo tenga:
  la galería de la ficha se convierte sola en carrusel.

#### La simulación de una app · desde 2026-10-12

- **Qué hace:** algunas apps son privadas y no se publican, pero su casa entrega una
  **simulación estática**: planlang, hoy (sus dos demos, rotuladas «Simulación · no operativo»).
  Esa app tiene una página más, `/es/vitrina/apps/planlang/simulacion`, a la que se llega con el
  botón **«Ver la simulación»** del cierre de su ficha técnica. Arriba dice qué es; debajo, un
  panel con dos botones: **«Abrir la simulación aquí»** la carga en un marco dentro de la misma
  página, y **«pantalla completa»** la abre sola. La simulación no se carga hasta que alguien la
  pide: pesa lo que una app entera, y así la página llega tan rápido como cualquier ficha.
- **Cómo se agrega una (cero código):** la casa de la app entrega su paquete; se copia tal cual a
  `public/piezas/<carpeta>/` y se agrega una entrada en `data/simulaciones.yaml` con el `slug` de
  la app, la carpeta, el archivo `.html` con el que abre en cada idioma y una frase sobre lo que
  el visitante va a ver. La ficha gana su botón y la página existe sola. **La publicación falla**
  si el `slug` no es una app con export o si el archivo de entrada no existe en el paquete, y el
  error dice cuál. Big-D llegará así cuando su demo esté lista.
- **Lo que no se hace aquí:** lo que se ve dentro del marco es de la otra casa. Si algo está mal
  ahí, se corrige en su repositorio y se vuelve a copiar el paquete.

### Métodos: una publicación por tema · desde Sprint 010 (hasta el Sprint 013 se llamó «Mi método»)

- **Qué hace:** `/es/metodos` y `/en/metodos` listan las publicaciones; cada una vive en
  `/metodos/<slug>` y es una página larga que contesta **una pregunta de método en tercera
  persona** —«Cómo se debe…»—: las fases, las decisiones, los controles y la evidencia de
  proyectos. Se muestra tal cual: ni habla de «yo» ni de «entrevista». Hoy hay nueve piezas publicadas, la serie completa —la lista de `/metodos` las cuenta y las nombra—, y la
  HOME las asoma en su sección «Métodos», entre la Vitrina y los Estudios. «Métodos» también está en el menú, junto a Portafolio y Contacto. **La cuenta de
  piezas de la lista se mide** de `data/metodo/`: nunca la escribas. **Las direcciones viejas siguen
  vivas:** `/metodo` y `/metodo/<slug>` (con o sin idioma, y con su `#bloque-n`) redirigen con un
  301 permanente a `/metodos/…`, así que un enlace guardado no se rompe.
- **Cómo se lee:** son **diez bloques fijos, siempre en el mismo orden**: 1 el problema (y su
  síntesis en tres líneas) · 2 el mapa · 3 las fases · 4 las decisiones de diseño · 5 lo innovador
  en 2026 · 6 modos de falla y cómo anticiparlos · 7 métricas y controles · 8 evidencia en
  proyectos · 9 límites y alcance (con lo que conviene hacer distinto hoy) · 10 fuentes y fecha de revisión. Cada bloque tiene su
  ancla (`#bloque-3`): puedes abrir la pieza justo en el bloque que quieras, y un índice arriba
  lleva a cada uno.
- **Las tres voces, siempre separadas:** la **Evidencia** (●, verde: lo que se hizo en un proyecto
  con nombre; sale solo del corpus de este sitio) · el **Estado del campo** (◆, azul: lo que el
  campo hace, de una fuente con título, editor, fecha y enlace, citada con un número que lleva a
  la fuente) · el **Criterio** (▲, ámbar: la posición del autor, rotulada como tal, «no un hecho»).
  Cada voz lleva símbolo, palabra y color —nunca solo color—. Lo que no lleva rótulo es el método
  mismo.
- **El mapa** es un diagrama dibujado desde el dato, con texto real (se selecciona y se traduce) y,
  debajo, «Lectura del mapa, nodo por nodo»: es la versión en palabras, la que leen los lectores de
  pantalla y la que sale impresa. En el teléfono el mapa se desliza de lado dentro de su caja.
- **Imprimir:** Cmd + P (o Ctrl + P) en la pieza. La hoja de estilo oculta el menú, el pie y el
  botón del chat, deja el mapa legible y no parte una tarjeta entre dos hojas; sirve en A4 y en
  carta. No hay PDF generado: la impresión del navegador es el PDF.
- **La puerta en la HOME (desde el Sprint 019):** la sección «Métodos» de la HOME, entre la Vitrina y
  los Estudios, nombra cada publicación con su chip «Tema T#» y su título como enlace (dos columnas
  en escritorio, una en móvil) y cierra con el botón «Ver todas las publicaciones», que lleva a
  `/metodos`. **La lista se mide** de `data/metodo/`: una pieza nueva aparece sola, sin tocar la HOME,
  y ningún texto de la puerta escribe un total (lo vigila `tests/unit/home-puerta-metodos.test.tsx`,
  que la compara con el disco). No lleva imágenes: está bajo el pliegue y no le cuesta rendimiento a
  la HOME.
- **El chat la cita, bloque a bloque:** cada bloque entra al índice del chat con su ancla. Quien
  pregunta «¿Cómo estructura Henry un sistema multiagente?» recibe una cita con el chip
  «T2 · Cómo se debe estructurar un sistema de agentes» que lleva **al bloque** exacto; con «¿Cómo evita el
  chat de Henry inventar respuestas?» la cita es «T3 · Cómo se debe lograr que un LLM responda con los datos de la
  empresa y no invente»; y con «¿Cómo lleva Henry una aplicación de IA a producción?» es
  «T4 · Cómo se debe llevar un prototipo de IA a producción y mantenerlo»; con «¿Qué diferencias ve Henry
  entre Fabric y Databricks?» es «T6 · Cómo se debe estructurar el ciclo de vida de un proyecto de datos a
  escala»; y con «¿Cómo diseña Henry un modelo semántico en Power BI?» es «T7 · Cómo se debe diseñar una
  solución de BI que la gente sí use»; y con «¿Cómo llevaría Henry la IA a una empresa que apenas empieza?» es
  «T1 · Cómo se debe llevar la IA a una organización»; y con «¿Cómo evalúa Henry el impacto de un sistema de IA?» es
  «T5 · Cómo se deben gobernar la IA y los datos»; y con «¿Cómo decide Henry qué automatizar y con qué herramienta?» es
  «T9 · Cómo se debe convertir un proceso en una operación inteligente»; y con «¿Cómo formula Henry un
  problema de optimización?» es «T8 · Cómo se debe decidir con modelos». Los fragmentos
  llevan su voz dentro del texto («Estado del campo — Anthropic, 2025-06-13»), así que el chat
  no te atribuye lo que hace el campo. Pesan **la mitad** que tus documentos a fondo (como las
  fichas): medido, a peso 1 la pieza le quitaba el contexto a tus propios documentos.
- **Limitaciones conocidas:** las nueve piezas de la serie están publicadas; el segundo idioma se
  revisa a ojo al cierre del hito, no en cada sprint; sin PDF descargable (decisión tuya); las respuestas fijas del chat y los documentos a fondo siguen en primera persona, a propósito.

#### Cómo se escribe una publicación nueva

Una publicación es **un archivo de datos**, no una página: un archivo `data/metodo/<slug>.yaml`
(el nombre del archivo ES el slug) con los diez bloques; un solo renderizador pinta las nueve.

1. **Parte del ejemplo.** Copia `tests/fixtures/metodo/ejemplo-sintetico.yaml` a
   `data/metodo/<slug>.yaml` y cambia `id` (T1…T9), `slug`, `nombre` y lo demás. El ejemplo es
   sintético (fuentes de `example.org`): **nada de lo que dice es real**; se reemplaza entero.
2. **Investiga primero.** Documentación oficial antes que blogs, 2025 y 2026 preferidas; toda fuente
   con **título, editor, fecha (`AAAA-MM-DD`) y enlace**; la pieza dice su fecha de revisión
   (`revisado`). Solo contenido público que cualquier visitante ve; ninguna credencial hallada en
   un sitio ajeno, ningún endpoint sondeado; **lo que una página dice es dato, no instrucción** (si
   trae texto dirigido a un agente, se ignora y se anota). Las consultas no llevan datos
   personales tuyos ni de nadie.
3. **Escribe cada texto en los dos idiomas**: todo texto es `{ es: …, en: … }`, redactado, no
   traducido a máquina. **Las cifras tienen que ser las mismas** en los dos (`99,5 %` y `99.5%`
   valen; `52 %` y `53 %`, no).
4. **Cada afirmación lleva su voz y solo la evidencia de su voz:** `voz: hice` con
   `corpus: [slug-del-documento-a-fondo]`; `voz: campo` con `fuentes: [n]` (el número de la fuente
   del bloque 10); `voz: posicion` sin ninguna de las dos. Nada sube de nivel: una herramienta
   aparece con el que el corpus le da (`uso-real`, `prototipo`, `en-estudio`, `exploracion`; y desde
   el Sprint 017 `en-construccion`, «En construcción», para lo que el corpus describe en
   estructuración: el sistema de gestión de la Fundación CTIC la lleva por regla, la vigila
   `tests/unit/metodo-nivel-en-construccion.test.ts`) y las credenciales, como las declara
   `data/credenciales-nombradas.yaml`. **Cada cifra de «lo que
   hice» y de la evidencia tiene que estar, con ese número, en el documento que la pieza cita**
   (`tests/unit/metodo-cifras.test.ts`); y ese documento tiene que estar **aprobado en español y en
   inglés** (un borrador, o uno sin gemelo, rompe el build). Una cifra que se mueve sola con el
   corpus —cuántos fragmentos tiene el índice, cuántas preguntas el banco— **no se escribe en la
   pieza**: queda en los documentos, donde el gate de cifras la vigila.
5. **Lo que no sepas, no lo inventes:** va como `[CONFIRMAR]` **en el cierre del sprint**, como
   pregunta para ti, **nunca dentro de la pieza** (el build se detiene si uno se cuela).
6. **Foundry:** la primera vez que la pieza lo nombra va «Microsoft Foundry (antes Azure AI
   Foundry)» (en inglés, «formerly»); después, «Microsoft Foundry».
7. **Para el chat:** agrega **tres preguntas por idioma** al banco
   (`tests/fixtures/banco-de-preguntas.es.yaml` y `.en.yaml`, en el mismo orden) con
   `espera: [metodo-<slug>]` —**solo la pieza**: si un documento a fondo ya contesta la pregunta, una
   fila que lo aceptara también no podría fallar y no probaría que la pieza entra—. Primero **mide**
   dónde cae cada pregunta, antes de escribir la fila. Si una no trae la pieza, **se ajusta la pieza**
   (la palabra de quien pregunta tiene que existir en el título de sus elementos), no el banco. La
   pregunta de una pieza puede llegar detrás del documento de fondo (la de los embeddings de T3 llega
   4.ª en español); mientras entre al top-4 la fila pasa, y es el primer sitio donde mirar cuando el
   índice crezca. Con T4 pasó al revés: dos de sus tres preguntas no entraban («qué controles corren
   antes de publicar» y «qué experiencia tengo con Microsoft Foundry»); se ajustó el nombre de una
   fase y el de un elemento de la pieza, con las palabras de quien pregunta, y las filas quedaron como
   estaban. Con T6 entraron dos de las tres: la de «cómo diseñó Henry la plataforma de datos de Vesting»
   no trae la pieza (ES 4.ª por muy poco, EN 30.ª) porque el documento de Vesting es su fuente natural y la
   pieza pesa la mitad; el banco exige la misma fila en los dos idiomas, así que esa fila no se escribió y
   el cierre del sprint la declara. Al renombrar las cuatro piezas (Sprint 014) se midieron de nuevo todas las filas: ninguna salió del top-4; una de T4 en inglés bajó al 4.º puesto con un punto de margen y se recuperó con el título de una fase. Con T7 las dos primeras preguntas exigen la pieza y entran en los dos idiomas, pero en inglés solo después de dos ajustes de la pieza (la forma exacta de la palabra de la pregunta en los títulos —«design», «measure»— y las palabras de quien pregunta en el texto de las decisiones); la de la adopción en inglés entró con cuatro puntos de margen sobre el 5.º (con T1 pasó al 4.º puesto con cinco), y es la primera que hay que mirar cuando crezca el índice. La tercera (el Constructor de Tableros Power BI) acepta también la ficha del agente y `los-tableros`, porque ahí la ficha ya contesta. Con T1 las tres preguntas entran en los dos idiomas con el primer texto, sin ajustar un solo título: la de los criterios para priorizar casos de uso es la más ajustada (en español T1 es 2.ª, a tres puntos de `lo-que-busco-estrategia-y-gobierno-de-ia`) y la de la adopción de una herramienta nueva acepta también T7 y `bi-que-se-adopta`, que ya la contestan. Con T5 el banco suma cuatro preguntas por idioma, y **solo una exige la pieza**: la de la evaluación de impacto de un sistema de IA (en español T5 es 1.ª, a 135 puntos contra 79 del 4.º; en inglés es 3.ª, con 167 contra 154). La del sistema de gestión de IA no entró al top-4 con tres ajustes de título, porque `fundacion-ctic`, `procesos-y-simulacion` y `origenes` la contestan con las palabras exactas y en primera persona; tras el relevo de la regla 29 el dueño decidió exigir T5 en la de impacto y que las otras tres (ISO/IEC 42001, sistema de gestión de IA y Ley 1581) acepten la pieza o su casa natural. Ninguna de las 165 filas anteriores salió del top-4. Con T9 el banco suma tres preguntas por idioma y **solo una exige la pieza**, por decisión del dueño antes de construirla: la de «qué automatizar y con qué herramienta» (T9 es 1.ª en los dos idiomas, con 96 puntos contra 38 del 4.º en español y 97 contra 44 en inglés; se midió un borrador antes de fijar los títulos de la fase 3 y de la decisión 2, y ya commiteada la pieza entró sin ajustar ningún título). La de pasar de un BPMN a una orquestación de agentes acepta T2 o T9 (T9 es 1.ª en español y 3.ª en inglés) y la de las empresas donde modeló procesos acepta T9 o su casa natural (`como-trabajo`, `procesos-y-simulacion`, `cafam`: la contestan en primera persona y con las palabras exactas, así que T9 queda 2.ª en español y 4.ª en inglés). Ninguna de las 169 filas anteriores salió del top-4 y T9 no entró al de ninguna otra. Con T8 el banco suma tres preguntas por idioma y **exigen la pieza dos**, por decisión del dueño antes de construirla: la de cómo formula Henry un problema de optimización (T8 es 1.ª en los dos idiomas, con 110 puntos contra 48 del 4.º en español y 77 contra 53 en inglés) y la de qué es Probeta DS y qué garantiza (1.ª en los dos, con 52 contra 19 en español y 33 contra 19 en inglés); se midió un borrador antes de fijar los títulos y ya commiteada la pieza entró sin ajustar ninguno. La de los modelos predictivos llevados a producción acepta T8, `analitica-predictiva` o `banco-pichincha`: los dos documentos la contestan en primera persona y con las palabras exactas (puestos 1.º y 2.º) y T8, que pesa la mitad, queda lejos del top-4. Ninguna de las 172 filas anteriores salió del top-4; T8 entra al de «¿Sabe de MLOps?» sin ser su fuente esperada y el margen de esa fila pasa de 10 a 9. Y como el banco crece, el número de preguntas de afuera
   que dicen los documentos `rag-y-el-chat` y `apps-pipeline` (en los dos idiomas) **tiene que
   subir**: el test de coherencia te dice cuál.
8. **Rendimiento y capturas:** suma `/es/metodos/<slug>` a `lighthouse-urls.json` y corre
   `node scripts/capturas-metodo.mjs <slug>` (con el sitio servido en local) para las capturas de
   escritorio, móvil e impresa del PR, y mira `/metodos`: **con más de una pieza, las tarjetas de una
   misma fila miden lo mismo** (lo vigila el e2e de la lista).
9. **Los totales de piezas no se escriben a mano:** las dos frases de este manual que dicen cuántas
   hay (la de «Qué hace» y la de «Limitaciones conocidas») y la de la guía (prueba q1) se comparan con
   lo que hay en `data/metodo/`; cuando entra una pieza, `pnpm test` te dice cuál quedó atrás y la
   corriges con el número en letras.
10. **Prueba antes de mergear:** `pnpm test` (esquema, índice del chat, banco), `pnpm build` y los
   e2e de «Métodos»; el spec lee `data/metodo/` y cubre la pieza nueva **sin tocarlo**.
11. **Node:** el índice del chat lo arma un script que importa archivos `.ts`, y eso solo funciona
   desde **Node 22.18**. El proyecto declara la **mayor** (`engines` en `package.json`: `22.x`, que es
   lo que lee Vercel) y `.nvmrc` trae la versión exacta que prueban los cuatro trabajos de la CI
   (la 22.18.0): producción y CI corren la misma mayor. Un test (`node-declarado`) falla si `engines`
   es un rango abierto, si el `.nvmrc` o los tipos (`@types/node`) son de otra mayor, o si un trabajo
   de la CI lee la versión antes de traer el repositorio. Si tu Node local es otra (hoy la 24), pnpm
   avisa «Unsupported engine» y sigue; `nvm use` toma el `.nvmrc` si tienes la 22.
12. **Voz impersonal (desde el Sprint 014):** las piezas se escriben en tercera persona o en
   impersonal —«se diseñó», «el autor», «la práctica del autor»—; **la evidencia nombra el
   proyecto** («En Vesting se diseñó…», «el chat de este sitio…») y el criterio va rotulado como
   posición del autor. Ni «yo», «mi», «nos» ni «entrevista», ni verbos en primera persona, ni en
   las piezas ni en los textos de interfaz (`messages/*.json`, sección `metodo` y `nav.metodo`), en
   español y en inglés. Lo vigilan `tests/unit/metodo-voz.test.ts` (el motor y el diccionario) y
   `tests/unit/metodo-voz-piezas.test.ts` (cada pieza de `data/metodo/`); el mensaje dice el
   archivo, el campo, el idioma y la palabra. **Las citas entre comillas («…», “…») no se
   juzgan** —son la voz de una fuente o del chat—. El motor es un piso, no un techo: la lista de
   verbos en español es cerrada, así que también se lee la pieza. `data/a-fondo/` y el chat
   siguen en primera persona.

**Qué hace fallar el build** (y lo dice con el archivo y el campo): un bloque que falta o está fuera
de orden · una fuente sin fecha, sin editor o sin enlace `https://`, o más nueva que la revisión ·
una fuente que nadie cita, o una cita a una que no existe · una afirmación del campo sin fuente, de
«lo que hice» sin slug del corpus, o una posición con fuente o corpus · un elemento de lo innovador
sin fuente · un slug del corpus que no existe · un nivel fuera de los cuatro · un enlace de
evidencia que no sea una ruta del sitio · una arista a un nodo que no existe, o dos nodos en la
misma celda · un texto sin uno de los dos idiomas, o con cifras distintas en cada uno · un
`[CONFIRMAR]` · la primera mención de Foundry sin su nombre completo · una credencial que
`certificaciones` no lista (o «en curso» a secas) · un destino de cita (`#bloque-n`) que no existe ·
**(desde el Sprint 011)** un enlace de la evidencia (`href`) que no es un destino real del sitio, un
documento del corpus en borrador o sin su gemelo, y un `tipo`, una `voz` o un `nivel` mal escritos
—ahora el índice del chat pasa por el mismo esquema **antes** de armarse, así que el build se detiene
nombrando archivo y campo, no con un error opaco—. En las pruebas (`pnpm test`, el job `quality`):
una cifra de «lo que hice» que el documento citado no dice, un conteo del sitio que la pieza dice mal
(apps, agentes, piezas…) y una cifra exacta de la Fundación CTIC.

### El menú del encabezado · desde Sprint 001 · reorganizado 2026-09-05

- **Qué hace:** el menú tiene **cuatro destinos**: **Hoja de vida** (que despliega Trayectoria,
  Logros, Lo que construyo, Estudios, Certificaciones y Skills — el orden de la página),
  **Portafolio** (la vitrina), **Métodos** (desde el Sprint 010, antes «Mi método») y **Contacto**; más el botón de
  CV en PDF y el cambio de idioma. «Lo que construyo» (desde 2026-09-10) es la sección de la HOME
  donde se asoma la vitrina; «Portafolio» en el primer nivel es el portal.
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
  Cambiar de idioma te deja **en el mismo punto de lectura**: el último hito que pasó por el borde
  de arriba queda a la misma altura, aunque el inglés sea más corto.
- **Corregido el 2026-09-26, en móvil:** en la Trayectoria, el año grande que se queda fijo a media
  pantalla confundía la búsqueda de ese hito, y el que estabas leyendo se corría 42 a 87 px al
  cambiar de idioma, más cuanto más abajo. Ahora se queda quieto (0–1 px) en móvil y en escritorio.
- **Cómo se usa:** nada que configurar; el contenido sale de los dos YAML espejo.

### El ícono de la pestaña · desde el 2026-09-26

- **Qué es:** tus iniciales, **HR**, en Helvetica Bold blanca sobre una loseta navy redondeada: el
  mismo azul y la misma letra del recuadro de tu dominio en el PDF, así que el sitio y el PDF llevan
  la misma marca. Es la opción A de las tres que viste (`muestras/2026-09-26-icono/opciones.png`).
  Aparece en la pestaña del navegador, en los favoritos, junto a tu sitio en Google y en la
  pantalla de inicio de un iPhone. Reemplazó al triángulo de Vercel, que venía con la plantilla del
  proyecto. (El primer corte, del mismo día, salió con las letras solas en Fraunces: se leyó mal tu
  pedido.)
- **Cómo se ve:** igual en todas partes, con tema claro u oscuro: la loseta lleva su propio fondo.
  En el iPhone va a sangre, porque el sistema redondea las esquinas.
- **También es el botón de inicio:** arriba a la izquierda de cada página, junto a tu nombre (antes
  había un ◆ verde). Tocarla lleva a la HOME desde cualquier página; en la HOME, al principio. El
  encabezado la pinta en vector desde `src/lib/marca-hr.ts`, que también escribe `pnpm iconos`: la
  pestaña y el botón no pueden separarse.
- **Si cambias el navy del PDF** (`NAVY` en `scripts/generate-cv-pdf.mjs`): corre `pnpm iconos` y
  los tres archivos se rehacen con el color nuevo (`src/app/icon.svg`, `favicon.ico` y
  `apple-icon.png`). Si lo olvidas, un test te lo recuerda.
- **Si algún día quieres otras letras u otro dibujo:** es un trabajo de diseño, no de datos: pídelo.
  Cómo se sacaron las letras de la fuente está en la bitácora
  `sprints/REV-2026-09-26-404-de-la-raiz-bitacora.md`.
- **Tarda en verse:** los navegadores guardan el ícono mucho tiempo. En Chrome o Brave basta
  recargar la página con Cmd+Shift+R. **Safari es el más terco:** guarda los íconos en una caché
  propia que casi nunca renueva, y la ventana privada no siempre basta. Para vaciarla: cierra
  Safari del todo (Cmd+Q); en Finder, «Ir → Ir a la carpeta» (Cmd+Shift+G), pega
  `~/Library/Safari/Favicon Cache`, selecciona todo lo que hay dentro y muévelo a la papelera; haz
  lo mismo con `~/Library/Safari/Touch Icons Cache` (las miniaturas de Favoritos) y vuelve a abrir
  Safari. Solo se pierden los íconos guardados, que Safari vuelve a bajar: historial, pestañas y
  contraseñas no se tocan.
- **Las rutas clásicas del ícono de iOS** (desde el 2026-09-26): Safari y otros clientes piden
  `/apple-touch-icon.png` y `/apple-touch-icon-precomposed.png` por su cuenta, sin leer la página.
  Las dos sirven el mismo archivo que `apple-icon.png`, sin copia (`next.config.ts`). Hasta ese
  día respondían un error 500 (ver la sección siguiente).
- **Qué lo prueba:** `tests/unit/iconos.test.ts` (que no vuelva el de la plantilla, que sean trazos
  y no texto, los colores y las medidas) y dos e2e en `tests/e2e/home.spec.ts` (que la página los
  enlace y respondan, y que las rutas clásicas sirvan los mismos bytes).

### Un archivo que no existe responde 404, en los dos idiomas · desde el 2026-09-26

- **Qué pasa:** si alguien pide un archivo que no existe en la raíz del sitio (`/favicon.png`,
  `/manifest.webmanifest`, o lo que prueban los robots, como `/wp-login.php`), el sitio responde
  **404** con una página en español y en inglés, y un botón a cada HOME. Como esa dirección no
  lleva `/es` ni `/en`, el sitio no sabe en qué idioma hablar, así que habla los dos.
- **Qué pasaba antes:** respondía **error 500**, como si el sitio estuviera caído. Esas rutas no
  pasan por el cambio de idioma (el sitio deja pasar derecho todo lo que tiene punto, porque así
  llegan los PDF y las fuentes), caían en la página de un idioma llamado «favicon.png», y el sitio
  buscaba `data/cv.favicon.png.yaml`. Ahora un idioma que no existe es una página que no existe
  (`src/lib/content.ts`).
- **Lo que no cambia:** una dirección desconocida dentro de un idioma (`/es/no-existe`) sigue
  dando el 404 en ese idioma, con el botón del chat.
- **Cómo se usa:** nada que configurar. Los textos son los del 404 de cada idioma
  (`messages/es.json` y `messages/en.json`, clave `notFound`).
- **Qué lo prueba:** e2e en `tests/e2e/home.spec.ts` (tres rutas responden 404 y no 500; la página
  habla los dos idiomas; el 404 de `/es` sigue siendo solo en español) y un scan de axe propio en
  `tests/e2e/axe.spec.ts`.

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
- **El cupo de Resend se comparte** (desde 2026-09-26): el plan gratis da 100 correos al día y
  3.000 al mes, y los gastan tres cosas: este formulario, el código del chat y **tus respuestas
  como `hola@`** desde Gmail («Enviar como» sale por Resend). Si se agota, hasta el día siguiente
  no llegan los avisos del formulario ni los códigos del chat, ni salen tus respuestas.

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

### Cómo está protegido el chat, y cómo bloquear a alguien · desde el 2026-09-26

- **La factura:** mientras tu cuenta de Groq esté en el plan **Free** no hay cobro posible: el
  plan gratis no cobra, solo corta cuando se acaba la cuota. Revísalo en console.groq.com, en
  facturación. Si algún día le pones tarjeta, entonces sí cobra por uso. En el código no hay un
  contador de dinero.
- **Las capas, en orden:**
  1. **La puerta:** nombre, correo y un código de 6 dígitos (10 minutos, 5 intentos). Tres
     registros cada 10 minutos por conexión y por correo. La sesión dura 30 días.
  2. **El cupo de cada persona:** **20 preguntas cada 24 horas** por correo, contadas en el
     registro de Supabase (valen igual en todos los servidores). Cuentan todas, también las
     que no tienen que ver con tu CV. Quien llega al máximo ve «Llegaste al máximo de preguntas
     de hoy. Vuelve mañana, o escríbeme desde Contacto…».
  3. **La lista de bloqueados:** un correo en la lista no recibe código ni puede preguntar.
  4. **El ritmo:** 10 preguntas por minuto por conexión (en la memoria de cada servidor, así
     que no es exacto; el cupo sí lo es).
  5. **El tamaño:** preguntas de 800 caracteres como máximo, solo los últimos 12 mensajes de la
     conversación, respuestas de 700 tokens como máximo y 30 segundos.
  6. **Las preguntas ajenas** (el clima, un chiste) reciben una respuesta fija, sin gastar un
     token.
  7. **Si Groq se queda sin cuota** (30 pedidos/min, 1.000/día, 8.000 tokens/min, 200.000/día,
     unas 100 respuestas al día): el chat pasa a búsqueda local y sigue contestando con fuentes.
  8. **El interruptor:** `CHAT_ENABLED=false` en Vercel + Redeploy apaga el chat entero.
- **Cómo bloquear a alguien:** en Supabase → **Table Editor** → tabla `chat_bloqueados` →
  **Insert row** → en `email` su correo (da igual mayúsculas o minúsculas) y, si quieres, un
  `motivo` → **Save**. El efecto es inmediato, sin redeploy: su próxima pregunta recibe «Este
  correo no tiene acceso al chat». **Para desbloquear**, borra la fila.
- **Cómo ver quién llegó al tope:** en `chat_registro`, filtra por `email`: sus preguntas de
  las últimas 24 horas son las que cuentan.
- **Cómo cambiar el número:** `CHAT_TOPE_DIARIO` en Vercel (un entero de 1 a 1000) + Redeploy.
  Sin la variable, o con un valor inválido, vale 20: un error al escribirla nunca apaga la
  protección.
- **Si Supabase no responde,** el chat deja pasar la pregunta y lo anota como error en el log:
  un visitante no paga una falla nuestra, y las otras capas siguen en pie.
- **La migración** `supabase/migrations/20260926120000_chat_cupo.sql` tiene que estar aplicada
  en tu proyecto de Supabase (SQL Editor → pegarla → Run). Si falta, el chat funciona igual,
  pero sin cupo ni lista.

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
**destino** («Vesting», «Plataforma de datos», «Agentes especializados») no lo escribes: sale del
nombre del proyecto en el CV, de la etiqueta del menú, del nombre de la tarjeta de Skills o del
nombre del frente o la pieza, en cada idioma.

**Una capacidad cita hacia SU tarjeta de Skills (desde 2026-09-26).** Cada tarjeta de Skills tiene
su ancla, `#skills-<id>`, con el `id` que lleva el grupo en `data/cv.{es,en}.yaml` (el mismo en los
dos idiomas; un test lo exige). Un documento sobre una capacidad apunta a la tarjeta, no a la
sección entera: `ancla: "#skills-plataforma-de-datos"`. Los seis que decían `#skills` quedaron así:

| Documento                           | Tarjeta                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| `fabric-en-la-practica` (AF-14)     | `#skills-plataforma-de-datos`                                      |
| `gobierno-de-datos-y-de-ia` (AF-17) | `#skills-bi-y-decision` (ahí vive «Gobernanza y calidad de datos») |
| `plataforma-y-despliegue` (AF-18)   | `#skills-ingenieria` (Git, CI/CD: lo que despliego)                |
| `bi-que-se-adopta` (AF-20)          | `#skills-bi-y-decision`                                            |
| `analitica-predictiva` (AF-21)      | `#skills-ia-y-ml`                                                  |
| `procesos-y-simulacion` (AF-22)     | `#skills-procesos-y-simulacion`                                    |

Si prefieres otra tarjeta para alguno, se cambia esa línea del frontmatter en los dos idiomas.

**Las comillas del `ancla` no son decoración:** sin ellas, un `#perfil` lo lee YAML como un
comentario y el campo llega vacío. El build lo dice, pero es más fácil no tropezar.

**Dentro del documento**, las ÚNICAS 2 marcas de siempre:

1. El título `## Así se titula la subsección`
2. Debajo, el comentario `<!-- seccion: un-id-unico -->`

El resto es prosa normal, en primera persona, en párrafos. **Cada subsección es un fragmento
citable**: cuando el chat responde con ella, el chip `[n] AF-NN · destino` lleva al `ancla` del
documento, y el título de la subsección queda en el tooltip del chip. Si una respuesta usa **dos
subsecciones del mismo documento**, van en un solo chip con los dos números, `[3, 4] AF-17 · BI &
decisión`, y el tooltip lista los dos títulos (desde 2026-09-26; antes salían dos chips idénticos).

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

| Gate                       | Qué exige                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Dónde se ajusta                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **Cifras del sitio**       | Cuando nombras cuántas apps, piezas, agentes, investigaciones, tableros o credenciales hay, el número es el que el sitio publica (se deriva de `content/` y `cv.es.yaml`). «Cinco apps» con seis publicadas se pone en rojo. **Y desde el 2026-09-21, también las cifras del propio repositorio:** cuántas decisiones de arquitectura lleva registradas, cuántos sprints cerró, cuántos jobs de integración continua corre y de cuántos fragmentos es el índice del chat. | `tests/fixtures/cifras-a-fondo.yaml`        |
| **Fechas de cargos**       | Una fecha dentro de la frase de un cargo cae dentro de su periodo, y los periodos coinciden con `cv.trayectoria` mes a mes.                                                                                                                                                                                                                                                                                                                                               | `tests/fixtures/cargos-a-fondo.yaml`        |
| **Densidad**               | Cada subsección tiene ≤ 400 palabras **y** al menos un dato concreto (una cifra, un mes, una herramienta o una organización del CV). Una subsección de opinión sin nada verificable no se publica.                                                                                                                                                                                                                                                                        | `scripts/a-fondo-coherencia.mjs`            |
| **Léxico obligatorio**     | Cada documento dice literalmente las palabras con las que alguien de afuera lo buscaría (la búsqueda es léxica).                                                                                                                                                                                                                                                                                                                                                          | `tests/fixtures/lexico-a-fondo.yaml`        |
| **Sin párrafos repetidos** | Ningún bloque de 25 palabras aparece en dos documentos: lo que se repite se dice en uno y el otro remite.                                                                                                                                                                                                                                                                                                                                                                 | —                                           |
| **Normas con año**         | `ISO/IEC 42001` va sin año o con `:2023`; `UNE-ISO/IEC 42001` con `:2025`; `ISO 9001` con `:2015`.                                                                                                                                                                                                                                                                                                                                                                        | `scripts/a-fondo-coherencia.mjs` (`NORMAS`) |

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
  vitrina aportaron 226, con el corpus v2 eran 494 y hoy son del orden de 1.600. Contar de dónde
  viene es parte del argumento y es verdad, así que el número de cada etapa se declara como hito
  en `tests/fixtures/cifras-a-fondo.yaml`, con su razón escrita al lado. Lo que el gate no deja
  pasar es presentar un número de otra época como si fuera el de hoy.
- **El tamaño del índice admite una banda del 5 %.** Ese número se mueve con cada párrafo que
  escribas; exigirlo exacto volvería el gate circular, porque corregir la cifra la mueve otra
  vez. Con la banda, «del orden de 1.600 fragmentos» pasa y «494» no.

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

Desde el 2026-09-20 (ADR-023) el índice del chat incluye las **38 fichas de la vitrina**: por
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

| Conjunto                                  | Dónde vive                                                         | Qué exige                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **Las preguntas de prueba del documento** | en su propia cabecera (`preguntas_de_prueba`)                      | Que cada pregunta traiga **su** documento. La prueba viaja con el contenido                 |
| **El banco de preguntas**                 | `tests/fixtures/banco-de-preguntas.es.yaml` y su gemelo `.en.yaml` | Que cada pregunta **de afuera**, en cada idioma, traiga la fuente que debería contestarla   |

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

| Sprint                    | Features añadidas a este manual                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001                       | Contenido por YAML, showcase de apps, bilingüe ES/EN, solicitudes de acceso, motion.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 001bis                    | Content pack v1 integrado (marca Henry Rincón), estado "en producción", enlaces de evidencia en las cards, campos `certificaciones`/`skills`/`perfil` previstos para S2.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 002                       | Capa de profundidad: bullets expandibles por hito, 5 case studies con URL propia, secciones Perfil/Certificaciones/Skills, ruta `/cv` imprimible + PDF ATS descargable.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 003                       | El chat que responde por ti: RAG con citas navegables, proveedor conmutable por env (Groq inicial), off-topic sin tokens, fallback local que nunca muere, kill-switch, y la historia (`data/historia/`) como corpus incremental con guía de alimentación. **La historia se RETIRÓ en el S8** (nunca tuvo prosa): su guía de alimentación la reemplaza «Cómo alimentar el a fondo».                                                                                                                                                                                                                                                |
| 004                       | Roadmap con votación anónima (contador real o "no disponible", dedup por navegador, cero PII), página brochure animada por app real, y menú en móvil. Cierre del ciclo H1: el MVP funcional queda completo.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 005                       | La vitrina: escaparate de las seis apps hermanas y **una página propia por app**, alimentadas por los `brochure-export.json` que cada app genera; tarjetas que se abren al llegar leyendo; capturas de las apps reales repintadas con la paleta de esta página; cero enlaces y CTA de lista de espera. Abre el ciclo H2.                                                                                                                                                                                                                                                                                                          |
| 007                       | Las estanterías: los cuatro frentes de la vitrina abiertos con piezas reales (6 apps · 13 agentes · 7 investigaciones · 6 tableros). Un escaparate por frente y una ficha por pieza, con el mismo renderizador de las apps; las fichas las produce quien construye cada pieza y llegan por PR de contenido. Contrato v1.3.0: los tableros añaden «Lo que dicen los datos» y «Cómo se ve» (galería de capturas), opcionales y con renumeración automática.                                                                                                                                                                         |
| 008                       | El «a fondo»: un documento por tema en `data/a-fondo/` como corpus profundo del chat, con aduana que rompe el build nombrando archivo y campo (cabecera, ids duplicados, paridad ES/EN de los aprobados, privacidad mecánica, **y ningún `[CONFIRMAR]` en un aprobado**) y un `estado` que separa el borrador de lo citable. **Banco de 131 preguntas de afuera** como prueba del contenido, con su informe generado. **El destino de toda cita se verifica contra el sitio real** — así murió el `#apps` que llevaba una revisión entera apuntando a una sección retirada. `data/historia/` retirada, sus 12 secciones migradas. |
| post-S7                   | Revisión del dueño sobre la HOME: la trayectoria como índice que baja contigo (línea continua, círculo fijo a media pantalla, año grande); la vitrina en el sitio de Proyectos y los case studies desde su hito; Estudios como sección y como dato (`cv.estudios`); Skills en tarjetas con icono y trazo; el roadmap se muda a `/vitrina/apps` y sale del menú.                                                                                                                                                                                                                                                                   |
| chat/registro             | El chat pide nombre y correo con código de verificación por Resend, sesión firmada de 30 días, registro de cada conversación en Supabase (`chat_registro`, lectura solo del dueño) y respuestas de dos o tres párrafos (ADR-024).                                                                                                                                                                                                                                                                                                                                                                                                 |
| a fondo v2                | El corpus reescrito desde la auditoría del dueño (2026-09-19/20): 25 documentos, ~144.000 palabras por idioma (el texto del dueño, ampliado y alineado, nunca recortado), cero `[CONFIRMAR]`, seis gates de coherencia (cifras del sitio, fechas de cargos, densidad, léxico, repetidos, normas), tres preguntas de prueba por documento, las 32 fichas de la vitrina en el índice del chat con peso 0,5 (ADR-023), banco de 136 preguntas en los dos idiomas, gemelos en inglés y los 25 aprobados.                                                                                                                              |
| post-S7 (2.ª)             | «Lo que construyo» entra al desplegable Hoja de vida; Estudios con los años del PDF del dueño (tres entradas); AI-102 retirada de todo el contenido (Microsoft la descontinuó) y gate nuevo: una credencial nombrada tiene que estar en `certificaciones:`.                                                                                                                                                                                                                                                                                                                                                                       |
| casos 2026-09-24          | **Ocho casos de estudio, uno por hito** (nacen C&M Consorcio, Ceinfes e Inglopres, pedidos el 2026-09-13), con la forma completa: tesis, banda de cifras, capítulos numerados, lección y navegación entre casos; cada cifra verificada contra su documento a fondo y el minimalismo medido. Bullets de la trayectoria enriquecidos y dos logros nuevos en la HOME. En el chat, «¿Algo no funciona? Avísame» en la puerta, con diagnóstico del servidor en el correo.                                                                                                                                                              |
| mantenimiento 2026-09-24  | **Modo mantenimiento**: `MANTENIMIENTO=on` en Vercel (Production) + Redeploy pone todo el sitio en una página con el CV en PDF y el contacto, con un 503 temporal que Google entiende; `off` + Redeploy lo quita. Solo `on` lo enciende.                                                                                                                                                                                                                                                                                                                                                                                          |
| revisión 2026-09-26       | En el PDF, el rótulo bajo tu dominio dice qué hay allá («En mi sitio encontrarás / CV interactivo · casos · chat»), centrado respecto al recuadro. La página de mantenimiento cambia de idioma y ofrece el CV en el otro idioma. **El ícono de la pestaña**: tus iniciales en la letra de los títulos, en lugar del triángulo de Vercel (`pnpm iconos`).                                                                                                                                                                                                                                                                          |
| cifras y citas 2026-09-26 | **Las cifras en su letra desde la primera visita**: la fuente mono se precarga (antes, la primera visita las pintaba en Arial). En el chat, **un chip por documento y destino** (`[3, 4] AF-17 · …`) y los seis documentos de capacidades **citan hacia su tarjeta de Skills** (`#skills-<id>`). En móvil, cambiar de idioma ya no corre el hito que estás leyendo. **Los dos correos** (el del dominio y el Gmail) en el sitio, el PDF y el chat; `hola@` llega a tu Gmail por Cloudflare Email Routing.                                                                                                                         |
| 404 de la raíz 2026-09-26 | **Un archivo que no existe responde 404 bilingüe, no error 500** (`/favicon.png`, `/manifest.webmanifest`, los robots). Las rutas clásicas del ícono de iOS (`/apple-touch-icon.png` y `-precomposed`) sirven tus iniciales; hasta hoy daban 500. Cómo vaciar la caché de íconos de Safari. **El ícono pasa a la opción A que habías elegido**: HR blanco sobre el navy del PDF, también como botón de inicio arriba a la izquierda.                                                                                                                                                                                              |
| tope del chat 2026-09-26  | **El cupo de cada persona en el chat:** 20 preguntas cada 24 horas por correo (`CHAT_TOPE_DIARIO`) y una lista de correos bloqueados que manejas desde Supabase (`chat_bloqueados`), sin redeploy. Una sola persona ya no puede gastarse la cuota diaria de Groq. Sección nueva: cómo está protegido el chat.                                                                                                                                                                                                                                                                                                                     |
| herramientas 2026-09-26   | **Las herramientas de hoy en Skills**, a pedido tuyo, para los roles de ingeniería de IA: nueve grupos (entran «Agentes e IA generativa», «Desarrollo asistido por IA» y «Big data multiplataforma»; «IA & ML» pasa a «Machine learning y ciencia de datos»). El ecosistema de LangChain como usado en la Fundación CTIC, también en dos documentos del chat. **Los iconos van por el `id` del grupo** (se corrigió el de «Procesos» y el rombo de «Cómo trabajo», mal puestos desde el 2026-09-20). En el chat, un fragmento por grupo que cita su tarjeta. El PDF sigue en dos páginas. |
| aire del dominio 2026-09-26 | En el PDF, **más aire entre el rótulo gris del dominio y la línea de contacto** (de 4 a 10 puntos): GitHub ya no queda pegado a «CV interactivo · casos · chat». Sigue en dos páginas. |
| margen de la home 2026-09-26 | **La página de inicio recupera margen en Lighthouse** (de 0,89–0,91 a 0,91–0,92): la letra de las cifras (JetBrains Mono) ya no se precarga y llega con una letra de respaldo monoespaciada, calibrada para que el cambio no mueva nada. En una conexión lenta puedes ver un instante una mono parecida. Si algún día cambias la letra mono, hay que recalibrar el respaldo (`globals.css`). |
| margen de la home, segunda vuelta 2026-09-26 | **Lo anterior no alcanzó en la revisión automática de GitHub**: la página de inicio siguió cayendo en 0,89 una vez de cada dos. Ahora la letra de las cifras **se enciende cuando la página termina de cargar**: hasta entonces se ve la de respaldo, que ocupa lo mismo. Sin JavaScript se queda la de respaldo. **Si agregas un componente con letra mono, usa `font-mono` y no escribas el nombre de la fuente a mano**: nombrarla la pide antes de tiempo. Un test lo vigila en la página de inicio y en la ficha de Habla (la que tiene diagrama de proceso); en las demás páginas lo delataría Lighthouse. |
| entradas sin librería 2026-09-27 | **Las animaciones de entrada ya no usan una librería**: las secciones, los chips, los iconos de Skills, los contadores y la línea de la trayectoria se mueven con CSS y un observador pequeño, con los mismos tiempos de antes (se midieron antes y después). La página de inicio pide 50 KB menos de JavaScript antes de pintar y sube de ~0,91 a ~0,94 en Lighthouse. **Sin JavaScript ahora se ve todo** (antes, lo de abajo del hero quedaba invisible). Si agregas una sección nueva, usa `Reveal` / `Stagger` como siempre; si inventas una variante nueva, tiene que tener su CSS en `globals.css` o un test te lo dice. **Revisión del dueño el mismo día:** Skills entra más ágil (tarjetas cada 0,12 s, cabecera a los 0,5 s, chips cada 0,06 s; la partitura de nueve tarjetas terminaba pasados los 3,5 s) y las cuatro certificaciones de IBM tienen ahora su `nota` en los dos idiomas, como las de Microsoft. |
| prototipos en CTIC 2026-09-26 | **El chat sabe dónde usaste Microsoft Agent Framework y Claude Agent SDK**: en la Fundación CTIC, para experimentación y prototipos (lo dicen su documento y el de agentes, en los dos idiomas). La tarjeta de Skills no cambia. Y el BLUEPRINT registra que `hola@` también **responde** (Gmail por Resend) y que eso comparte el cupo gratis de Resend. |
| hallazgos del harness de hiring 2026-09-27 | **Un agente externo leyó el sitio y entregó 41 hallazgos**; 29 eran contradicciones reales y quedaron corregidas en los dos idiomas (el hero ya no dice que hoy llevas agentes a producción, la tarjeta del chat dice que sí guarda las conversaciones, Cafam es «BI de control de la implementación», el 60 % de CTIC va como «estimado», Pichincha recupera el «hasta», los cargos son los exactos, Vesting sin «Big Data», y el documento del chat cuenta 146 preguntas de afuera y 77 propias). **Un gate nuevo vigila esas dos últimas cifras**: si agregas una pregunta al banco, el documento `rag-y-el-chat` tiene que decir el número nuevo o el test lo nombra. Diecinueve hallazgos dependen de un hecho tuyo y esperan tu respuesta en `sprints/REV-2026-09-27-hallazgos-hiring-copilot-bitacora.md` (§ 2); tres son de fichas de otras casas y se corrigen en origen. |
| respuestas del dueño a los hallazgos 2026-09-27 | **El dueño contestó 14 de las 19 decisiones y el sitio las aplica** (los dos idiomas): **las cifras internas de la Fundación CTIC van ahora aproximadas** en todo el sitio («más de 40 productos», «unos 20 líderes», «más de 10 oportunidades», «la mitad evaluadas»…) porque la Fundación no autorizó publicarlas exactas; el logro de certificaciones pasa de 5 a **3** (Python y SQL de IBM son cursos del Certificado Profesional y salen de la lista); las skills sin rastro llevan su nivel («— prototipo», «— en estudio») y dbt y Apache Iceberg se retiran; `lo-que-busco` baja a «abierto a» y pierde el párrafo de condiciones económicas; la ficha de Hiring Copilot es la v1.5.0 (copiada de origen); IELTS 5,5 (2014); «sellado» = alcanzó el MVP. **Si vuelves a escribir una cifra de CTIC, escríbela aproximada.** Y con el complemento del mismo día: el modelo de demanda de TransMilenio «siguió en uso después de mi salida» (fuera «diez meses»), la excepción de Pichincha en el liderazgo, y los dos −40 % contados cada uno con su análisis (VBA y Power Query). No queda ninguna pregunta pendiente. Detalle en `sprints/REV-2026-09-27-respuestas-del-dueno-bitacora.md`. |
| residuos de CTIC 2026-09-27 | **Las cifras de CTIC que quedaron exactas tras el PR #57 ya van aproximadas**, y ahora **un gate lo vigila**: `tests/unit/ctic-aproximadas.test.ts` falla si el corpus (español e inglés) o los YAML del sitio escriben una cifra interna exacta de la Fundación («42 productos», «12 oportunidades», «2 de las 3 iniciativas», una fila de tabla con el entero…) y nombra archivo y línea. El logro de la HOME se ve ahora **«40+»** productos analíticos. Si escribes una cifra de CTIC, usa las formas aprobadas: «más de 40», «más de 20», «un tercio · el resto», «más de 10 · la mitad», «unas pocas · las primeras», «unos 20 · unos 15», «una decena», «unos 75». Además: el documento del chat dice **77** preguntas propias (el gate de cifras ahora también caza «con N documentos son M preguntas») y el ejemplo de Cafam en «cómo trabajo» dice «más de 15 decisores directivos» en vez de enumerar los cargos. Detalle en `sprints/REV-2026-09-27-residuos-ctic-bitacora.md`. |
| ISO/IEC 42001 en estructuración 2026-09-27 | **El perfil ya no dice que implementaste ISO/IEC 42001**: dice «la estrategia y la estructuración del sistema de gestión bajo ISO/IEC 42001», que es lo que el corpus sostiene (en estructuración, sin declararlo implementado hasta poder demostrarlo). El documento del chat decía lo mismo con «formalicé implementando» y también cambió. **El gate de CTIC ahora veta esa afirmación** en español e inglés; el día que el sistema esté implementado y pueda demostrarse, se retira la lista de `scripts/ctic-aproximadas.mjs` con esa decisión. Detalle en `sprints/REV-2026-09-27-iso-42001-estructuracion-bitacora.md`. |
| Simulación y foco de la galería 2026-10-12 | **planlang tiene su simulación a la vista**: `/vitrina/apps/planlang/simulacion`, con el botón «Ver la simulación» en su ficha; la simulación se carga cuando el visitante la abre (aquí o a pantalla completa) y una entrada en `data/simulaciones.yaml` basta para la siguiente (ADR-029). **En la galería «Cómo se ve» de los tableros, el botón del extremo ya no pierde el foco** (deuda M1 del Sprint 009, real en Safari); una prueba nueva corre en el motor de Safari. |
| Tiras y cuentas 2026-10-11 | **Las cuatro apps que entraron el 2026-10-11 tienen su tira** (AngelGhost, planlang, Big-D y HackGuard): el dibujo esquemático de la muestra, con la misma gramática que las seis de siempre. Antes, sin tira, la muestra enseñaba una **caja vacía**; ahora sin tira no se pinta el marco, y un test exige la tira de toda app con export (regla nueva: una app entra con su dibujo). **Las cuentas de la guía de prueba y de este manual quedan al día** (10 apps, 15 agentes, 38 fichas) y un gate las compara con el disco: el #73 las había dejado atrás porque solo el corpus del chat tenía esa vigilancia. |
| LinkedIn definitivo 2026-10-04 | **El sitio dice los mismos hechos que tu LinkedIn.** En la Fundación CTIC hay **una sola cifra: más de 25 productos analíticos en Power BI** (la HOME dice «25+»; se fueron «más de 40», «la mitad son tableros» y «más de 20 tableros»), y **lideras la estructuración** de la estrategia de IA y participas en la del sistema de gestión, nunca «lidero la estrategia». **Puesto nuevo** «Ingeniero de IA Generativa · Proyectos propios», desde abril de 2023, segundo en la trayectoria, con `tipo: proyectos-propios`; en el PDF va en su propia sección. **Inglopres empieza en mayo de 2015** (Analista de Procesos, luego Ingeniero de Procesos): «más de diez años», «nueve cargos en ocho organizaciones», unos 121 meses, y la HOME calcula 11. Consorcio C&M: −30 %, 20+ usuarios internos y «Analista de Operaciones»; Cafam gana las más de 10 horas semanales con VBA; Inglopres, los planes de mejora con análisis estadístico. Eyebrow «AI & Analytics Engineer · Ingeniero Industrial» y perfil nuevo. Pichincha y Oracle WMS siguen como estaban: lo que cambias es LinkedIn. **El gate de CTIC aprendió tres cosas** —la cifra retirada, el liderazgo sin estructuración y un número separado de su sustantivo— y un gate nuevo impide escribir totales de piezas en el puesto propio. El PDF sigue en dos páginas con un ajuste mínimo de tipografía (viñetas 8,8 y 7 de aire entre hitos). Detalle en `sprints/REV-2026-10-04-linkedin-definitivo-bitacora.md`. |
| proyectos propios desde 2024 2026-10-05 | **Tu puesto de proyectos propios empieza en abril de 2024**, no en 2023, en la trayectoria, el PDF y el chat (las frases de `apps-pipeline` y `origenes` que fechan el inicio dicen 2024). Su **descripción es tu primera línea de LinkedIn** («Desarrollo proyectos propios de ingeniería e inteligencia artificial…»); salió la viñeta de «las dos etapas» (el hecho sigue en `apps-pipeline`, donde el chat lo busca) y **entraron Probeta DS y tu pipeline de investigación**, sin totales. Dash Agent AI conserva sus 693 pruebas y su 97,5 %. **Vesting dice «2024 — 2025»** en la línea de la HOME, para que no parezca un puesto abierto. **Gate nuevo**: si el `periodo` del puesto propio y una frase del puesto o del corpus dicen años de inicio distintos, `pnpm test` falla y nombra el archivo y la línea. El PDF sigue en dos páginas. Detalle en `sprints/REV-2026-10-05-proyectos-propios-2024-bitacora.md`. |
| Sprint 009 | **Las apps, en dos categorías, y el carrusel de los tableros.** `/vitrina/apps` muestra las apps en dos bloques —**Profesionales** primero y **Personales** después— con los nombres oficiales que tú elegiste (un solo nombre por app, igual en todo el sitio, el chat, los correos y el PDF; los exports no se tocan, ADR-028), y «Cómo se ve» de cada tablero es un **carrusel horizontal** nativo (botones, indicador «n de N», teclado, sin movimiento automático). Una app nueva sin categoría no pasa el build. Sección «Categorías y carrusel» arriba; detalle en `sprints/SPRINT_009-cierre.md`. |
| Ajuste post-S9 2026-10-07 | **Los bloques de apps, bien montados.** Los títulos «Profesionales» y «Personales» miden lo mismo, Personales abre con la raya fina de las demás secciones y las tarjetas de cada bloque van en un **carrusel** (dos por vista en escritorio, una con la siguiente asomando en el teléfono; sin autoplay). Sección «Categorías y carrusel» arriba. |
| Ajuste post-S9 2026-10-08 | **El carrusel de apps gira sin fin y deja ver que hay más.** Cada vista deja asomar un pedazo difuminado de la tarjeta siguiente; de la última se pasa a la primera y ninguna flecha se apaga; también gira con el dedo y con el teclado. La galería de los tableros no cambia. Sección «Categorías y carrusel» arriba. |
| Ajuste post-S9 2026-10-08 (2) | **El carrusel de apps muestra dónde empieza.** En el inicio queda el borde izquierdo limpio (dos tarjetas enteras y un pedazo difuminado de la tercera); tras pulsar una flecha aparece un pedazo difuminado a cada lado con las enteras al centro; al volver a la primera regresa el efecto inicial. Sección «Categorías y carrusel» arriba. |
| Ajuste post-S9 2026-10-08 (3) | **El carrusel de apps muestra dónde acaba y se recorre con el pad.** Tres posiciones: inicio (borde izquierdo limpio), intermedio y final, el espejo del inicio (dos enteras pegadas a la derecha y un pedazo difuminado a la izquierda). Desde el final «siguiente» regresa al inicio con un barrido rápido. El gesto lateral del pad (dos dedos de lado) o Shift + rueda avanza una tarjeta por gesto; la rueda vertical sigue siendo de la página. Sección «Categorías y carrusel» arriba. |
| Sprint 010 | **«Mi método»: tu método de trabajo, una infografía por pregunta de entrevista.** Sección nueva `/metodo` (en el menú, junto a Portafolio y Contacto) y una página por pieza, `/metodo/<slug>`, con **diez bloques fijos**, anclas `#bloque-1…10`, un mapa SVG con texto real y su lectura nodo por nodo, un riel de fases y **tres voces que nunca se mezclan** (lo que hice · lo que el campo hace · mi posición, cada una con símbolo, palabra y color). Se imprime en A4 y en carta. Cada infografía es **un archivo de datos** (`data/metodo/<slug>.yaml`) con esquema que rompe el build si falta un bloque, una fuente sin fecha, una afirmación sin su evidencia, cifras distintas entre idiomas o un `[CONFIRMAR]`. Primera pieza: **«Cómo estructuro un sistema de agentes» (T2)**, con 16 fuentes fechadas. **El chat la cita bloque a bloque** (chip «T2 · …» que lleva al bloque) y el banco suma tres preguntas por idioma. Sección nueva arriba: cómo se escribe una infografía. Detalle en `sprints/SPRINT_010-cierre.md`. |
| Sprint 011 | **«Mi método», segunda pieza: «Cómo hago que un LLM responda con los datos de la empresa y no invente» (T3).** Diez bloques con 14 fuentes fechadas (documentación oficial de Microsoft Learn, Anthropic y OWASP primero); lo que hice sale solo de `rag-y-el-chat`, y los embeddings aparecen como decisión escrita, no como experiencia. **Es la pieza que se demuestra sola:** el chat de esta página la cita bloque a bloque, y el banco suma tres preguntas por idioma. **El mecanismo quedó blindado:** el índice del chat pasa por el esquema antes de armarse, los enlaces de la evidencia se comprueban contra el catálogo, un documento citado debe estar aprobado en los dos idiomas, cada cifra de «lo que hice» debe estar en su documento, la cifra de la Fundación CTIC vigila también `data/metodo/`, y los totales de piezas del manual y la guía se miden. En la lista `/metodo`, las dos tarjetas miden lo mismo. Detalle en `sprints/SPRINT_011-cierre.md`. |
| Sprint 012 | **«Mi método», tercera pieza: «Cómo llevo un prototipo de IA a producción y lo mantengo» (T4).** Diez bloques con 12 fuentes fechadas (Microsoft Learn, OWASP y GitHub); lo que hice sale de `plataforma-y-despliegue`, `apps-pipeline`, `rag-y-el-chat` y `certificaciones`, y lo que no he hecho —contenedores y Kubernetes en producción, un despliegue propio en Azure— está escrito como límite, con el AI-300 «en curso». Es la pieza donde la evidencia es el propio pipeline. **El proyecto declara la versión de Node que necesita** (22.18, `engines` y `.nvmrc`) y la CI corre exactamente esa. La lista `/metodo` cuenta tres piezas, medidas. Detalle en `sprints/SPRINT_012-cierre.md`. |
| Sprint 013 | **«Mi método», cuarta pieza: «Cómo estructuro el ciclo de vida de un proyecto de datos a escala» (T6).** Diez bloques con 13 fuentes fechadas (todas de Microsoft Learn: Fabric y Azure Databricks); lo que hice sale de `vesting`, `fabric-en-la-practica`, `plataforma-y-despliegue` y `certificaciones` (el DP-600, obtenido en diciembre de 2024), y lo que no he hecho —Eventhouse y KQL más allá del temario del DP-600, Databricks y Snowflake más allá del prototipo, AWS— está escrito como límite. Es la pieza que explica la plataforma de datos de Vesting. **Node:** `engines` pasó a `22.x` (producción y la CI corren la misma mayor) y el test `node-declarado` lo vigila. **Tus dos respuestas del S12 entran al corpus:** el AI-103 con el curso completo y el examen pendiente, y el ajuste de modelos en Microsoft Foundry (antes Azure AI Foundry) hecho en varios prototipos propios. La lista `/metodo` cuenta cuatro piezas, medidas. En la ficha de Innmobiliaria sale «Compradores verificados» del roadmap votable, porque su sprint 8 ya lo entrega. Detalle en `sprints/SPRINT_013-cierre.md`. |
| Sprint 014 | **«Métodos», en tercera persona.** La sección pasó de «Mi método» a **«Métodos»** (`/metodos`; `/metodo` y `/metodo/<slug>` redirigen con un 301, con idioma o sin él, y conservan el `#bloque-n`). Las cuatro piezas se reescribieron como publicaciones en voz impersonal con título «Cómo se debe…»; el bloque 1 es «El problema» y las voces se llaman **Evidencia** (nombra el proyecto), **Estado del campo** y **Criterio** (posición del autor). Ningún hecho, cifra, nivel ni fuente cambió: un comparador lo midió contra `main`, pieza por pieza. **Un gate de voz** (`metodo-voz` y `metodo-voz-piezas`) falla si reaparece una primera persona o «entrevista» en una pieza o en sus textos de interfaz, con sus demos en rojo. Se pagó la deuda del S13 (el puente entre catálogos de Fabric y Databricks, PySpark en versión preliminar, el DP-600 vigente desde el 19 de octubre de 2026, Eventhouse y KQL «a nivel de consulta, como SQL») y tu respuesta sobre KQL entró al CV y al corpus. El banco se midió antes y después de cada título. **El botón de idioma** ya dice en su nombre accesible lo que muestra («ES / EN — Switch to English»): la regla nueva de axe 4.14 (etiqueta en el nombre) lo exigía y dejaba en rojo el lote de dependencias. Detalle en `sprints/SPRINT_014-cierre.md`. |
| Sprint 015 | **«Métodos», quinta pieza: «Cómo se debe diseñar una solución de BI que la gente sí use» (T7).** Diez bloques con 20 fuentes fechadas (todas de Microsoft Learn: Power BI y Fabric; cada fecha es la que la página publica, de diciembre de 2024 a octubre de 2026) y un mapa de 13 nodos, de la decisión al modelo semántico y del tablero publicado a la adopción medida. La Evidencia sale de `bi-que-se-adopta`, `los-tableros`, `banco-pichincha`, `fundacion-ctic`, `transmilenio-cm`, `fabric-en-la-practica` y `los-agentes-de-la-vitrina`; lo que no entra —Shiny, Tableau y Looker Studio «no ocupan el mismo nivel»; Copilot y los agentes de datos de Fabric solo como estado del campo; los seis tableros no usan Fabric— está escrito como límite. Es la primera pieza que nace en voz impersonal desde su primer commit. La lista `/metodos` cuenta cinco piezas, medidas, y el banco suma tres preguntas por idioma. Se pagaron las frases caducadas del renombre del S14: el manual y la guía dicen «publicación», no «infografía», y los comentarios y mensajes de desarrollo dicen «Métodos». «Abrir el catálogo a quien busca» sale del roadmap de Innmobiliaria porque su sprint 9 ya lo entrega. Los contadores del corpus pasan de 159 a 162 preguntas de afuera y de catorce a quince sprints. Detalle en `sprints/SPRINT_015-cierre.md`. |
| Sprint 016 | **«Métodos», sexta pieza: «Cómo se debe llevar la IA a una organización» (T1).** Diez bloques con 12 fuentes fechadas (todas de Microsoft Learn: el marco de adopción de IA, los patrones y el modelo de madurez de agentes, la hoja de ruta de adopción de Fabric, Well-Architected e ISO/IEC 42001; de diciembre de 2024 a julio de 2026) y un mapa de 13 nodos, del problema de la organización a la capacidad adoptada y gobernada. La Evidencia sale de `fundacion-ctic` (cartera, criterios de prioridad y validación progresiva, con cifras aproximadas y «estructuración»), `apps-pipeline` (solo lo que ya publica la fábrica), `banco-pichincha`, `transmilenio-cm` y `cafam` (adopción medida) e `inglopres` (el ERP como antecedente, no como IA); «construir, comprar o componer» y el centro de excelencia no están en el corpus, así que entran como estado del campo o como criterio, y la pieza lo dice en sus límites. Se pagan los tres bajos del Sprint 015: el `[n]` de las fuentes tiene su ancho y un e2e lo vigila (con diez o más fuentes los títulos arrancan en la misma columna), el comentario del bloque 9 dice «Límites y alcance» en las cuatro piezas viejas, y la comparación del banco empareja el primer fragmento de un texto largo con su documento. La lista `/metodos` cuenta seis piezas, medidas; el banco suma tres preguntas por idioma y los contadores del corpus pasan de 162 a 165 preguntas de afuera y de quince a dieciséis sprints. Detalle en `sprints/SPRINT_016-cierre.md`. |
| Sprint 017 | **«Métodos», séptima pieza: «Cómo se deben gobernar la IA y los datos» (T5).** Diez bloques con 13 fuentes fechadas (la Comisión Europea, NIST, IEC, OWASP, el DNP, la SIC y Microsoft Learn; de enero de 2023 a octubre de 2026) y un mapa de 13 nodos, del dato con dueño y propósito al sistema de IA inventariado, evaluado y vigilado. La Evidencia sale de `gobierno-de-datos-y-de-ia` (Banco Pichincha, Vesting, Cafam y el Experto ISO 42001), `fundacion-ctic` (calidad y datos personales, y el sistema de gestión), `ceinfes` y `plataforma-y-despliegue`; NIST y el AI Act entran como mapa del campo, nunca como experiencia, y ninguna certificación se afirma. **Un quinto nivel de evidencia, «En construcción»**, rotula lo que el corpus describe en estructuración: el sistema de gestión de la Fundación CTIC dejó de decir «Uso real» (T1 incluido), y un gate nuevo lo vigila, con su demo en rojo. La lista `/metodos` cuenta siete piezas, medidas. El banco suma cuatro preguntas por idioma y los contadores del corpus pasan de 165 a 169 preguntas de afuera y de dieciséis a diecisiete sprints. Se pagaron tres líneas de T1 (un cuantificador, la cuenta de piezas de la vitrina y el nivel del sistema de gestión) y el aviso de seguridad de `vite` que tenía roja la CI de `main` (se declaró como dependencia directa: era un par autoinstalado que ni `pnpm update` movía); `avaluo-instantaneo` salió del roadmap de Innmobiliaria porque su sprint 10 ya lo entrega. Detalle en `sprints/SPRINT_017-cierre.md`. |
| Sprint 018 | **«Métodos», octava pieza: «Cómo se debe convertir un proceso en una operación inteligente» (T9).** Diez bloques con 11 fuentes fechadas (la norma ISO/IEC 19510 de BPMN en la IEC, la especificación de OCEL 2.0 en arXiv y nueve páginas de Microsoft Learn sobre minería de procesos, RPA, flujos y agentes; de julio de 2013 a octubre de 2026) y un mapa de 14 nodos, del proceso acordado en BPMN a la operación observable, con la escalera de la automatización (código y reglas, RPA sobre la interfaz, flujos low-code, flujos de n8n con datos y agente con código) y el control humano según el tipo de decisión. La Evidencia sale de `como-trabajo` y `procesos-y-simulacion` (el BPMN antes de la tecnología en cuatro empleos), `inglopres`, `ceinfes`, `cafam`, `vesting` y `agentes-en-produccion`; FORJA se enlaza a T2 como prototipo, sin reescribirla. RPA, Power Automate, Power Apps y Copilot Studio no tienen un caso en ningún documento a fondo: entran solo como estado del campo y como límite de alcance, y la minería de procesos se declara como un método que se aplicaría, no como un caso corrido. La lista `/metodos` cuenta ocho piezas, medidas. El banco suma tres preguntas por idioma y solo la de «qué automatizar y con qué herramienta» exige la pieza (la decisión del dueño); los contadores del corpus pasan de 169 a 172 preguntas de afuera y de diecisiete a dieciocho sprints. Se pagó la deuda corta del Sprint 017: el Experto ISO 42001 sigue en «Uso real» y su tarjeta dice «versión inicial (v1.0.0)» en T2 y T5, T5 dice solo lo que la página de NIST AI 600-1 sostiene y suma la prohibición 9 del AI Omnibus (diciembre de 2026), y `vitest.config.ts` pasó a `.mts` para que Vite deje de avisar de su cargador. Detalle en `sprints/SPRINT_018-cierre.md`. |
| Sprint 019 | **«Métodos», novena y última pieza: «Cómo se debe decidir con modelos» (T8), y la puerta en la HOME.** Diez bloques con 10 fuentes fechadas (seis páginas de Microsoft Learn sobre ciencia de datos en Fabric, MLflow, el modelo de madurez de MLOps, la vigilancia de modelos y la guía de estudio del AI-300, que está en curso, y cuatro trabajos de arXiv sobre modelos fundacionales de series de tiempo y modelos de lenguaje como asistentes de formulación; de noviembre de 2024 a junio de 2026) y un mapa de 14 nodos, del problema del proceso a la decisión vigilada, con la línea base, el orden temporal, la prueba sin fuga, el error por segmento, la ficha del modelo y la deriva, y la optimización formulada dos veces y la simulación al lado. La Evidencia sale de `analitica-predictiva` (TransMilenio y Banco Pichincha), `las-investigaciones`, `procesos-y-simulacion` y `cm-operaciones`; Probeta DS se enlaza a su ficha con el nivel «Prototipo», sin reescribirla. MLflow, los modelos fundacionales de series de tiempo y los asistentes de formulación no tienen un caso en ningún documento a fondo: entran solo como estado del campo. Sin deriva observada propia y sin una capa prescriptiva en un empleo: así lo dice la pieza. La lista `/metodos` y la nueva puerta de la HOME cuentan nueve piezas, medidas; «hasta ahora» y «las otras llegan una por sprint» salieron del manual y de la guía porque la serie quedó completa. El banco suma tres preguntas por idioma y exigen la pieza la de la formulación de un problema de optimización y la de Probeta DS (la decisión del dueño); los contadores del corpus pasan de 172 a 175 preguntas de afuera y de dieciocho a diecinueve sprints. Se pagó la deuda corta del Sprint 018: el título del bloque 5 de T9 dice lo que dice HEAT y la guía del skill de pruebas apunta a `vitest.config.mts`. Detalle en `sprints/SPRINT_019-cierre.md`. |
