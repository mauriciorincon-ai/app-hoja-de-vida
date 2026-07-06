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

### El "grueso" de cada experiencia (bullets expandibles) · desde Sprint 002

- **Qué hace:** cada hito de la Trayectoria tiene un botón "Ver logros completos" que
  despliega los logros detallados con métricas de ese rol. Los mismos bullets alimentan el
  PDF descargable.
- **Cómo se usa:** en `data/cv.es.yaml` y `cv.en.yaml`, cada entrada de `trayectoria` tiene
  una lista `bullets:` — una línea por logro. Edita, guarda y push. Un hito sin `bullets`
  simplemente no muestra el botón (como Formación).
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
- **Quitar uno:** borra el bloque `casestudy:` (el proyecto sigue en la HOME como card,
  solo pierde su página de detalle).

### Perfil, Certificaciones y Skills en la HOME · desde Sprint 002

- **Qué hace:** las secciones que estaban guardadas desde el content pack ahora son
  visibles: el párrafo de Perfil, las 6 certificaciones (las 2 de Microsoft resaltadas) y
  los 4 grupos de skills.
- **Links de verificación:** cuando tengas los links de Credly/Microsoft Learn, pégalos en
  el campo `verificacion:` de cada certificación — el botón "Verificar ↗" aparece solo.

### Descargar CV en PDF (ATS) · desde Sprint 002

- **Qué hace:** el botón "CV (PDF)" (siempre visible arriba) y la página `/cv` entregan un
  PDF cuyo texto se puede copiar y que los sistemas de reclutamiento (ATS) pueden leer.
  `/cv` además es la versión imprimible de la hoja de vida completa.
- **Cómo se actualiza:** solo. El PDF se genera en cada publicación desde los mismos YAML
  que alimentan la página — editar el contenido y hacer push regenera web Y PDF a la vez;
  nunca quedan desincronizados.
- **Limitación conocida:** el PDF es deliberadamente sobrio (texto estructurado, sin
  diseño gráfico) — eso es una feature para los ATS, no un pendiente.

### Agregar una app al showcase · desde Sprint 001

- **Qué hace:** la sección "Apps del pipeline" es un brochure que sale de `data/apps.yaml`.
- **Cómo se usa:** agrega un bloque a la lista con `id` (minúsculas-con-guiones), `estado`,
  `nombre` y `descripcion` en `es` y `en`, y `solicitable` (si aparece el botón "Quiero
  probarla"). Opcional: `enlaces` (etiqueta + url) para mostrar la evidencia pública de la
  card, como el repo en GitHub. Push y listo.
- **Estados honestos (la promesa del showcase):** `en-produccion` = ya funciona y es
  verificable · `en-construccion` = se está construyendo ahora mismo, con repo público ·
  `en-exploracion` = objetivo declarado, sin fechas prometidas.
- **Ritual del pipeline:** al cerrar el sprint de cualquier app, actualiza su card aquí
  (cuando un demo pase a producción, sube su estado y considera darle case study en Proyectos).

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

| Sprint | Features añadidas a este manual                                                                                                                                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001    | Contenido por YAML, showcase de apps, bilingüe ES/EN, solicitudes de acceso, motion.                                                                                                                                                                      |
| 001bis | Content pack v1 integrado (marca Henry Rincón), estado "en producción", enlaces de evidencia en las cards, campos `certificaciones`/`skills`/`perfil` previstos para S2.                                                                                  |
| 002    | Capa de profundidad: bullets expandibles por hito, 5 case studies con URL propia, secciones Perfil/Certificaciones/Skills, ruta `/cv` imprimible + PDF ATS descargable.                                                                                   |
| 003    | El chat que responde por ti: RAG con citas navegables, proveedor conmutable por env (Groq inicial), off-topic sin tokens, fallback local que nunca muere, kill-switch, y la historia (`data/historia/`) como corpus incremental con guía de alimentación. |
