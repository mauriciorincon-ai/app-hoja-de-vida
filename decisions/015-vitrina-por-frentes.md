# ADR-015 — La vitrina se reparte en cuatro frentes; cada uno con su espacio propio

- **Fecha:** 2026-09-05 (post-S5, fuera de sprint — a pedido del usuario)
- **Estado:** aceptada
- **Extiende:** ADR-013 (vitrina: exports vs. YAML). No la contradice.

## Contexto

La vitrina nació en el S5 como el escaparate de **seis apps** hermanas, re-expresadas desde su
`brochure-export.json`. Pero lo que se construye en este taller no son solo apps. Hay tres
frentes más, ya reales aunque sin piezas publicadas:

1. **Agentes especializados** — sin interfaz: se les habla por comandos y ejecutan actividades
   complejas de principio a fin.
2. **Investigaciones** — líneas de investigación propias que ya pasaron la etapa de
   factibilidad y tienen su rumbo elegido; su construcción empieza ahora.
3. **Tableros de datos** — tableros analíticos en selección. Hoy en una herramienta, mañana en
   otras: **el frente se nombra por lo que es, no por la marca** (decisión explícita del usuario:
   no atar el lenguaje a una herramienta).

Dos formas de meterlos que se descartaron:

- **Todo bajo «apps».** Tres de las cuatro cosas no son apps. Sería mentir en el título.
- **Todo en una sola página `/vitrina`.** Es el error que el S5 ya corrigió (las seis fichas
  apiladas en 22 000 px): nada direccionable por separado, y el visitante paga por todo para leer
  una parte.

## Decisión

1. **`/vitrina` es el PORTAL**: una **caja por frente** con su nombre, una intro corta, su estado
   honesto y su cuenta de piezas. Marca el inicio de los frentes nuevos **sin disfrazarlo**.
2. **Cada frente tiene espacio propio desde el día cero**: `/vitrina/<frente>`.
   - `/vitrina/apps` es el escaparate que antes vivía en `/vitrina` (las seis muestras + «De esta
     casa»), y cada app pasa a **`/vitrina/apps/<slug>`**.
   - Los tres frentes en preparación tienen una **página genérica** (`[categoria]`) que declara
     qué es el frente, en qué punto está, y ofrece la lista de espera **sin fecha prometida**.
3. **Los frentes son contenido versionado**: `data/vitrina.yaml`, validado con Zod en build,
   bilingüe, en el orden del portal. Agregar o renombrar un frente = editar YAML + push.
4. **La cuenta de piezas no se escribe a mano.** «apps» la toma de los exports en
   `content/vitrina/`; un frente en preparación tiene cero por definición. Un número declarado a
   mano sería la primera cifra sin procedencia de toda la vitrina.
5. **Un frente solo puede estar `abierta` si existe un renderizador con fuente de piezas** — hoy
   solo «apps». El esquema lo impone: marcar otro como abierto **rompe el build** nombrando al
   culpable. El día que agentes, investigaciones o tableros tengan piezas, se les construye su
   escaparate (ruta estática, que gana al segmento dinámico) y se levanta esa restricción para
   ese frente.

## Por qué las apps se mueven a `/vitrina/apps/<slug>` y no se quedan en `/vitrina/<slug>`

Porque `/vitrina/<x>` pasa a ser el espacio de los frentes, y un slug de app suelto ahí chocaría
con el de un frente (una app llamada `agentes` rompería el portal). Un solo espacio de nombres
por nivel. Mover las 12 URLs es seguro: **por cero enlaces (regla 16) ninguna está publicada en
ningún sitio**, y el sitemap y las alternates se regeneran solos.

## Consecuencias

- **+3 rutas por idioma** (los frentes) **+1** (el escaparate de apps). Todas SSG; todas en axe,
  en el e2e y en el sitemap desde su misma fase.
- `brochure.spec` entra ahora por `/vitrina/apps` (sigue siendo la prueba que impide que las
  brochures queden huérfanas).
- Lighthouse en CI mide `/es/vitrina` (ahora el portal, más liviano), `/es/vitrina/apps` (el
  escaparate, lo que antes era `/es/vitrina`) y una ficha.
- Deuda declarada: los tres frentes en preparación **no tienen renderizador de piezas**. Cada uno
  lo gana en su propio sprint, con su propio contrato de datos — no se anticipa aquí.
