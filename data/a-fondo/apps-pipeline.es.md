---
slug: apps-pipeline
titulo: "Las apps que estoy construyendo en público"
resumen: "El pipeline AI-APPs: por qué construyo en público y qué demuestra cada pieza."
estado: borrador
ancla: "#vitrina"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué aplicaciones está construyendo Henry?"
  - "¿Por qué construye en público?"
---

<!--
⚠ PRIVACIDAD — LEE ESTO ANTES DE ESCRIBIR ⚠
Este repositorio es público y el chat cita este contenido a cualquier visitante.
NO escribas: datos confidenciales de empleadores o clientes, salarios, nombres
de terceros que no hayan aceptado aparecer, direcciones, teléfonos, correos ni
información personal sensible. La aduana del build caza lo mecánico (correos,
teléfonos, documentos, direcciones web); los NOMBRES PROPIOS no los caza un
regex — esos los decides tú.

CÓMO SE ESCRIBE ESTE ARCHIVO
- Prosa normal, en primera persona, en párrafos.
- Cada subsección empieza con un título `##` seguido de un comentario
  `<!-- seccion: id -->`. Esas son las ÚNICAS 2 marcas.
- `estado: borrador` → el chat NO lo indexa y no se le exige gemelo en inglés.
  `estado: aprobado` → el chat lo indexa y exige el gemelo `.en.md` completo,
  subsección por subsección.
- Ninguna cifra, fecha ni logro sin fuente. Lo que falte va como
  `[CONFIRMAR: qué falta]`, jamás relleno plausible.
- Guía completa: docs/MANUAL-DE-USO.md → «Cómo alimentar el a fondo».
-->

<!-- El esqueleto del S3 apuntaba a «#apps»; esa sección de la HOME se retiró en
     la revisión post-S7 y el roadmap se fue a /vitrina/apps. Hoy lo que la HOME
     enseña de lo construido es la vitrina. Corregido en la migración del S8. -->

<!-- guía (viene del esqueleto de la historia, S3 — la escribió el dueño):
La visión del pipeline AI-APPs: por qué construyes en público, qué
demuestra cada app, cómo trabajas con agentes de IA para construirlas (esta
CV Viva incluida). -->

## Por qué construyo en público

<!-- seccion: por-que-en-publico -->

Un currículum afirma; una pieza publicada demuestra. Esa es toda la razón.

Llevo más de una década midiendo procesos y exigiendo que cada cifra traiga su procedencia, y me
parecía incoherente presentarme con un documento cuyas afirmaciones no se pueden verificar. Así que
hice lo mismo conmigo: construí un portafolio en el que cada pieza está terminada, documentada y
mirable, y una página —esta— que las reúne.

La consecuencia es incómoda a propósito: si algo no está terminado, se ve. No hay forma de decir
«tengo experiencia en» sin que alguien pueda ir a mirar qué significa eso exactamente.

## Qué hay construido

<!-- seccion: que-hay-construido -->

El pipeline produce cuatro tipos de pieza, y todas están publicadas en la vitrina de este sitio:

- **Seis aplicaciones completas**, con interfaz, cada una con su promesa, sus funcionalidades y sus
  cifras: Velo, Dash Agent AI, Probeta DS, Hablemos San, Innmobiliaria y Nutri-Kids.
- **Trece agentes**, que son sistemas de trabajo especializados, no conversaciones.
- **Siete investigaciones**, cada una con su vacío de literatura medido contra un corpus revisado.
- **Seis tableros** de datos públicos, con sus identidades contables verificadas.

Cada una tiene su ficha técnica en la vitrina, y cada cifra de esas fichas lleva escrito si fue
medida, calculada, declarada o estimada. Esa regla no es decorativa: una pieza que le exige
procedencia a cada número de su pantalla no puede publicar cifras sueltas sobre sí misma.

## Qué demuestra cada familia

<!-- seccion: que-demuestra-cada-familia -->

Las **aplicaciones** demuestran que puedo llevar un producto de la idea a producción con pruebas,
integración continua, accesibilidad y presupuesto de rendimiento — no solo un prototipo que funciona
en mi máquina. Velo hace todo el trabajo dentro del navegador, sin servidor que reciba el archivo.
Probeta DS corre pandas y scikit-learn dentro de la pestaña, sobre WebAssembly. Dash Agent AI es un
panel local que muestra qué saben los agentes de IA sobre su usuario.

Los **agentes** demuestran cómo trabajo con IA generativa: con fuentes citadas y vacíos declarados,
nunca con la memoria del modelo. Las **investigaciones**, rigor de método. Los **tableros**,
ingeniería de datos verificable sobre fuentes públicas.

## Cómo se construyen: con agentes, y con reglas

<!-- seccion: como-se-construyen -->

El pipeline entero lo opera un agente de fábrica, que también está publicado en la vitrina. Tiene
una regla que me parece la más importante de todo lo que he montado: **ninguna aplicación avanza
sin dos aprobaciones escritas** —la prioridad vigente y la visión con todas sus funcionalidades
inventariadas— **y ningún sprint cierra sin el resumen que lo documenta.**

Es gobierno de proceso aplicado a construir software con IA. Y es, otra vez, el ingeniero industrial:
el valor no está en cada aplicación, está en que la siguiente se construya igual.

De ahí salen dos reglas duras que uso en todo: **código primero, IA generativa después** —toda
funcionalidad se resuelve con programación antes de acudir a un modelo, y activar una función de IA
exige justificar por escrito por qué el código no alcanza—; y **un control se demuestra fallando**:
una prueba que nunca se vio en rojo no es un control, es decorado.

## Esta misma página

<!-- seccion: esta-misma-pagina -->

CV Viva —lo que estás leyendo— es una de las seis aplicaciones, y su repositorio es público. Es una
hoja de vida que se construye a sí misma, en público: contenido en archivos versionados, generación
estática, y un chat con recuperación aumentada que responde citando su fuente.

Ese chat es la segunda pieza: responde solo con evidencia de este sitio, cita lo que usa, cambia de
proveedor de modelo con una variable de entorno y, si el proveedor se cae, pasa a búsqueda local en
el navegador en vez de morirse. Es ingeniería de IA en funcionamiento, no una promesa en una viñeta.

## Lo que está en exploración

<!-- seccion: en-exploracion -->

Dos piezas están declaradas como exploración, no como construidas, y lo digo con esa palabra a
propósito:

- **Analítica end-to-end en Fabric**: un pipeline público con datos abiertos de Colombia, de ingesta
  a lago, modelo semántico y Power BI embebido. Es la ingeniería de analítica del DP-600, verificable.
- **Agente autónomo con Gemini y Vertex AI**: un agente con herramientas sobre el stack de Google
  Cloud, como complemento multi-nube de mi certificación en Azure.

La segunda es deliberada y la explico sin rodeos en el documento sobre plataforma y despliegue: mi
experiencia profunda es Microsoft, y esta es la forma honesta de cubrir el otro lado — construyendo
algo, no declarándolo en una lista de herramientas.
