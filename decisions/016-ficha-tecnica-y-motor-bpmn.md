# ADR-016 — La ficha técnica: una capa infografía sobre el detalle, con un contrato y un motor BPMN

- **Fecha:** 2026-09-05 (post-S5, fuera de sprint — a pedido del usuario)
- **Estado:** aceptada
- **Extiende:** ADR-013 (exports vs. YAML) y ADR-015 (vitrina por frentes). No los contradice.

## Contexto

El S5 construyó el **detalle** de cada app con rigor: promesa, 24 funcionalidades en tarjetas
que se abren al leer, cifras con procedencia, lo fino. Es la capa correcta para quien ya decidió
entrar — y demasiado para quien acaba de llegar. El usuario pidió **una capa superior, menos
detallada, tipo ficha técnica / infografía**, con un botón al final que baje al detalle. Y dos
cosas más: que la plantilla sirviera para **todos los frentes** (agentes, investigaciones,
tableros) y que otra casa pudiera **producir** las fichas de los suyos sin que CV Viva tuviera
que hacer más que consumirlas. Trajo dos plantillas de la planeadora como referencia de anatomía.

Al presentar la plantilla, el usuario —ingeniero industrial— rechazó el primer «Cómo funciona»
(un flujo de cajas con líneas dibujadas a mano) y pidió **BPMN**: carriles por actor, los que
hagan falta, y un trazado limpio.

## Decisión

1. **Dos capas, dos rutas.** `/vitrina/apps/<slug>` es la **ficha técnica**; el detalle del S5
   baja a `/vitrina/apps/<slug>/detalle`, y se llega con «Ver la ficha completa». La muestra del
   escaparate lleva a la ficha técnica.

2. **Siete bloques fijos, cualquiera sea el frente.** Cabecera con **titular de valor** (qué no
   hace nadie más) · tira de **3–5 cifras con procedencia** · para quién y qué resuelve · **cómo
   funciona** (el proceso en BPMN) · qué tiene (una tarjeta por bloque, sin el detalle) · límites
   y **lo que nunca hace** · dónde está (versión anclada) · cierre (detalle + lista de espera). La
   anatomía sale de las plantillas de la planeadora; **la piel es la de CV Viva** — misma regla
   de extracción que con el prototipo de la HV: estructura sí, paleta no.

3. **Un solo contrato, un solo renderizador.** `fichaTecnicaSchema` (Zod) describe la ficha
   completa y autónoma; `FichaTecnica` la pinta. Para las apps con `brochure-export.json`, la
   ficha se **arma** de export + **complemento** (`data/fichas/<slug>.yaml`: titular · cifras
   destacadas · límites · nunca · proceso); para los otros frentes llegará completa como JSON. Lo
   que otra casa entrega es **contenido, no HTML**: un HTML ajeno no pasa por axe, por el gate
   ATS ni por el barrido de cero enlaces, y tres casas «en la misma clave» divergen en dos sprints.

4. **El contrato se publica desde el Zod.** `docs/contrato-ficha-tecnica/` lleva el JSON Schema
   y un ejemplo real **generados** por el mismo test que exige que coincidan
   (`pnpm contrato:ficha`), más la clave visual y la plantilla de referencia. Una sola fuente de
   verdad: cambiar el Zod sin regenerar rompe el test.

5. **Un motor BPMN propio, puro y testeado** (`lib/vitrina/bpmn.ts`): de carriles · pasos ·
   flujos · anotaciones a geometría. Subconjunto de BPMN 2.0: pool, carriles, inicio ○, tarea ▭,
   decisión ◇, fin ◉, flujos ortogonales con flecha, retornos por abajo, **anotaciones como
   llamadas numeradas** (inline se pisan en carriles angostos y en móvil no hay sitio) y
   **eventos de enlace** Ⓐ…Ⓐ cuando el proceso no cabe en una fila: se parte en filas de N
   columnas en vez de encogerse hasta lo ilegible; en móvil, desplaza en horizontal. Nunca un
   diagrama dibujado a mano, nunca una imagen: es SVG con `<text>`, entra al HTML estático.

6. **La procedencia del proceso se declara.** Hoy los seis procesos los derivó CV Viva de los
   exports (`procedencia: cv-viva`) y la ficha lo dice al pie del diagrama. El contrato pide el
   proceso como campo obligatorio: cuando la app lo mande, el complemento se retira y la
   procedencia pasa a ser suya. Un proceso sin dueño declarado sería la primera cifra sin fuente.

## Reglas que el esquema impone

- Cifra sin `fuente` no entra; más de 5 cifras destacadas tampoco («con 14 números hay tabla»).
- Una tarea es UNA acción: máx. 60 caracteres; si no cabe, son dos.
- El proceso es BPMN válido: exactamente un inicio, al menos un fin, todo paso alcanzable y con
  salida, toda decisión con ≥ 2 caminos, anotaciones sobre pasos existentes.
- Un complemento de otra app no se aplica; una cifra destacada que no existe en el export rompe
  el build nombrándola.

## Consecuencias

- +6 rutas por idioma (`/detalle`), todas SSG, en axe, en el e2e y en el sitemap.
- BPMN no es el lenguaje de todos los frentes (el usuario lo resolverá con quien corresponda):
  el contrato pide **un proceso**, sin fijar carriles; el motor admite los que hagan falta.
- Lo que la ficha técnica muestra del proceso es hoy lectura de CV Viva sobre la app: plausible
  y fiel a lo que la app declara, pero no de la app. Declarado en pantalla y en la bitácora.
