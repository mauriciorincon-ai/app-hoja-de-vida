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

| Sprint | Features añadidas a este manual                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 001    | Contenido por YAML, showcase de apps, bilingüe ES/EN, solicitudes de acceso, motion.                                                                                     |
| 001bis | Content pack v1 integrado (marca Henry Rincón), estado "en producción", enlaces de evidencia en las cards, campos `certificaciones`/`skills`/`perfil` previstos para S2. |
