# ADR-018 — La HOME tras la primera revisión del dueño: índice que baja, vitrina en vez de proyectos, estudios como dato y el roadmap con las apps

- **Status:** accepted
- **Date:** 2026-09-09
- **Sprint:** fuera de sprint (revisión post-S7, pedida por el dueño del producto)

## Contexto

Con los cuatro frentes de la vitrina abiertos (S7), el dueño miró la hoja de vida entera por
primera vez desde el S5 y trajo cinco observaciones, todas sobre la HOME:

1. **La trayectoria** tenía una barra al lado de cada experiencia y un círculo «sin orden»: a
   veces arriba, a veces abajo, a veces fuera de la línea. Pidió una línea que mida todas las
   experiencias, un círculo que baje con el scroll y **el año grande como índice** al pasar por
   cada una.
2. **«Proyectos» ya no es proyectos**: en ese sitio debe ir la vitrina con sus cuatro frentes.
3. **Skills** era correcto pero plano: iconos, animación, «elegante pero atractivo».
4. **Certificaciones** debía ir debajo de **Estudios** y encima de Skills — y no existía una
   sección de estudios.
5. **«Qué viene — y tú decides el orden»** (el roadmap votable) no tiene nada que hacer en una
   hoja de vida: *«no le voy a preguntar a mi hoja de vida qué viene»*. Debe vivir con las apps.

No hay orden de la planeadora para esto: es una revisión del dueño sobre producto ya en `main`,
como las reorganizaciones «post-S5». Se hace en su rama, con su PR, y se declara.

## Decisiones

### 1. El índice que baja contigo (`TimelineTrack`)

La receta 09 del motion vocabulary dibujaba el riel con `pathLength` y un nodo por hito; el riel
medía `calc(100% - 2rem)` y los nodos flotaban cada uno a la altura de su tarjeta. Se rehace con
**scrollytelling**: una columna de índice a la izquierda con **una sola línea** de la primera
experiencia a la última, un **relleno** que crece con `scrollYProgress` (cuánto llevas leído),
**un círculo `sticky`** a media pantalla —la línea pasa por él, así que visualmente baja
contigo— y a su lado **el año de la experiencia que está a su altura**, en Fraunces grande, con un
fundido corto al cambiar. Marcas pequeñas en la línea señalan dónde empieza cada tarjeta.

Reglas que respeta: solo `transform`/`opacity`; con `prefers-reduced-motion` no hay relleno ni
fundido, el círculo sigue siendo `sticky` (es posición, no animación) y el año cambia en seco. El
`<ol>` con periodos, roles y bullets es HTML siempre; el año grande es duplicado decorativo
(`aria-hidden`), y un `aria-live` discreto lo anuncia a quien no ve la columna.

**Descartado:** un círculo que se desplace con `translateY` calculado desde el scroll. Hace lo
mismo con un listener más y sin la garantía de que quede bien situado cuando el scroll salta
(anclas del menú, «volver arriba»).

### 2. La vitrina ocupa el sitio de «Proyectos»; los case studies se abren desde su hito

`VitrinaHome` enseña **las mismas cajas** del portal (`CajaFrente`, cuenta medida) y un botón
«Entrar a la vitrina». La HOME no mantiene una copia de la vitrina: la muestra.

Los cinco case studies **no desaparecen**: cada hito de la trayectoria declara `proyecto: <slug>`
y enseña «Ver case study →». El vínculo se **valida en build** (regla del contenido fail-safe):
un hito que apunte a un proyecto sin `casestudy` rompe la publicación nombrando el hito. El
breadcrumb del case study vuelve a `#trayectoria`, y el índice del chat ancla ahí los proyectos
sin detalle.

**Descartado:** enlazar los case studies por heurística (nombre del proyecto ⊇ organización).
Funciona hoy y se rompe en silencio el día que un nombre cambie; un slug explícito falla en
build.

### 3. Los estudios son datos, no una palabra

La formación vivía como un hito más de la trayectoria con `periodo: "Formación"`, y el PDF la
separaba **comparando ese texto**. Nace `cv.estudios` (título · institución · periodo · nota) y lo
leen igual la HOME, `/cv`, el PDF y el índice del chat. `periodo` va **vacío** hasta que el dueño
ponga los años: no se inventa una fecha, y la tarjeta lo dice («Sin fecha declarada»).

Orden final de la HOME: Hero · Perfil · **Trayectoria** · Logros · **Vitrina** · **Estudios** ·
**Certificaciones** · **Skills** · Contacto. El menú «Hoja de vida» conserva cinco secciones:
Trayectoria · Logros · Estudios · Certificaciones · Skills.

### 4. Skills: una tarjeta por grupo, icono dibujado, sin porcentajes

Cuatro tarjetas con icono propio (24×24, trazo 1.7, familia del design system, **nunca un
emoji**), el trazo se dibuja al llegar la tarjeta (variantes `pathLength` heredadas del `Stagger`
padre — el estado por defecto es el icono dibujado, lección del S5) y los ítems entran como chips
escalonados. Los iconos van **por posición** del grupo, no por su nombre: el nombre es contenido.
Lo que no hay a propósito: barras de «nivel de dominio». Un 80 % de Python no significa nada.

### 5. El roadmap vive con las apps

`Roadmap` gana la variante `embebido` y se monta en `/vitrina/apps`, al pie de las seis apps,
antes de «De esta casa». Mismos ids, mismos `data-testid`, misma isla de votación, misma API:
**solo cambió de casa**. El menú de primer nivel queda en **tres** destinos: Hoja de vida ·
Vitrina · Contacto.

## Consecuencias

- Cinco pruebas e2e cambiaron de sujeto (home, nav, detalle, reduced-motion, votación) y se
  añadió el gate ATS del roadmap en su ruta nueva. **321 e2e, 382 unitarias, 108 páginas.**
- Un gate nuevo, demostrado en rojo: `proyecto:` apuntando a un slug sin case study rompe el
  build nombrando el hito (*«Rotos: Cafam → proyecto «no-existe»»*).
- axe cazó un `ink-3` como color de texto en la tarjeta de estudios (2.7:1): la misma regla que
  el S6 dejó escrita en el design system. Corregido antes del PR.
- Deuda declarada: los años de los estudios los pone el dueño en `data/cv.*.yaml`; hasta
  entonces la tarjeta dice «Sin fecha declarada».
