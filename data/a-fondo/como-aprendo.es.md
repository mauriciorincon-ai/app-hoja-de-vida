---
slug: como-aprendo
titulo: "Cómo aprendo"
resumen: "El argumento que no está en la lista de herramientas: la velocidad con que incorporo lo que todavía no sé."
estado: borrador
ancla: "#certificaciones"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué tan rápido aprende Henry una tecnología nueva?"
  - "¿Cómo se prepara Henry para algo que no ha hecho antes?"
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

## Por qué este documento existe

<!-- seccion: por-que-existe -->

Un currículum es una foto de lo que alguien sabe hoy. Para un rol de inteligencia artificial esa foto
caduca rápido: la herramienta que hoy es imprescindible puede no existir en dos años, y la que
importará todavía no tiene nombre.

Lo que de verdad predice si alguien va a servir en ese terreno no es la lista, es la velocidad con
que la cambia. Este documento es mi argumento sobre eso, y no es una frase de entrevista: tiene
evidencia medida.

## La evidencia de las certificaciones

<!-- seccion: evidencia-certificaciones -->

**Cuatro certificaciones en dos años, trabajando a tiempo completo.** Tres de IBM en 2022 —Python
para Ciencia de Datos, SQL para Ciencia de Datos y el Certificado Profesional en Ciencia de Datos— y
Ciencia de Datos Aplicada con R en 2024.

**El DP-600 en cinco meses**, de julio a noviembre de 2024, mientras construía el ecosistema de datos
de Vesting. Es una certificación de nivel asociado sobre una plataforma que en ese momento llevaba
menos de un año en disponibilidad general: no había cursos maduros, ni libros, ni comunidad grande.
Se aprendió con la documentación y con las manos.

## La evidencia de lo construido

<!-- seccion: evidencia-construido -->

Es la más contundente, porque cada pieza es verificable.

Seis aplicaciones publicadas en mi vitrina usan tecnologías que **no había usado antes de
construirlas**: WebAssembly para correr pandas y scikit-learn dentro del navegador, trabajadores web
para procesar archivos sin servidor, bases de datos embebidas, aplicaciones instalables sin
conexión, despliegue en el borde, síntesis y captura de audio en el navegador.

Ninguna es un prototipo. Velo tiene setecientas cuarenta pruebas y un noventa y seis por ciento de
cobertura; Nutri-Kids, noventa y nueve por ciento en su motor; Hablemos San, ciento sesenta y nueve
pruebas de extremo a extremo. Y lo mismo con los trece agentes, las siete investigaciones y los seis
tableros: treinta y dos piezas publicadas.

## Cómo aprendo, en concreto

<!-- seccion: como-aprendo-en-concreto -->

Siempre igual, y siempre con algo que tiene que funcionar de verdad.

Primero busco el problema más pequeño que obligue a usar la cosa nueva **en serio** — no un ejemplo
de tutorial, algo con un resultado que alguien pueda juzgar. Después leo la fuente oficial, no los
resúmenes: es más lento al principio y muchísimo más rápido a la tercera duda. Y desde el primer día
escribo las decisiones y las verificaciones, porque lo que no se escribe se vuelve a aprender.

De ahí salen mis dos reglas. **Código primero:** intento resolverlo programando antes de acudir a un
modelo generativo, porque entender el problema es la parte que se queda. Y **un control se demuestra
fallando:** si escribo una prueba, la rompo a propósito una vez para ver que sabe ponerse en rojo.

Aprender así es más lento la primera semana y mucho más rápido el primer mes.

## La guía del AI-103, que es este método hecho pieza

<!-- seccion: la-guia-del-ai-103 -->

Cuando Microsoft descontinuó el AI-102 y abrió la ruta del AI-103, no me puse a buscar un curso.
Construí un agente que arma la guía de estudio.

Su regla es la que define cómo estudio: **ninguna guía existe hasta que un mapa demuestre que la
ruta cubre el temario en proporción a los pesos oficiales del examen**, y cada afirmación pedagógica
cita su fuente oficial con su fecha. Está publicado en mi vitrina con su ficha técnica.

Es, literalmente, mi método de aprendizaje convertido en una herramienta que otro puede usar.

## Qué significa esto para quien contrata

<!-- seccion: que-significa-para-quien-contrata -->

Que la brecha entre lo que sé hoy y lo que necesita el puesto es una variable de tiempo, y el tiempo
está medido en las cuatro ocasiones anteriores.

Si un rol exige una nube, un framework o una herramienta que no está en mi lista, lo trato como traté
Fabric en 2024 y como traté WebAssembly el año pasado: un problema pequeño y real, la documentación
oficial, y algo terminado que se puede mirar. Prefiero decir «eso no lo he hecho, y así es como lo
resolvería» que inflar una lista de herramientas.
