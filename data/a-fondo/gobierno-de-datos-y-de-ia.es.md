---
slug: gobierno-de-datos-y-de-ia
titulo: "Gobierno de datos y gobierno de IA"
resumen: "Las tres veces que monté gobierno de datos, y por qué el gobierno de IA es la continuación natural."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry en gobierno de datos?"
  - "¿Sabe Henry de gobierno de IA y de la norma ISO 42001?"
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

## Tres veces, y cada una distinta

<!-- seccion: tres-veces -->

He montado gobierno de datos tres veces, en tres contextos que no se parecen:

**Banco Pichincha (2023).** Co-lideré el desarrollo de un sistema de gobernanza que mejoró la
seguridad, la calidad y la confiabilidad en la gestión de información crítica. En banca el gobierno
no es buena práctica: es condición de operación, y el énfasis está en el control de acceso y en
poder demostrar el control.

**Vesting (2023–2025).** Implementé el modelo de gobernanza y estandarización desde cero, con datos
de varios clientes conviviendo en la misma plataforma. Aquí el problema central era el aislamiento y
la trazabilidad: cada dato tiene que saber de quién es y quién puede verlo, y eso se decide en el
diseño o no se decide nunca.

**Fundación CTIC (2025–hoy).** Gestiono procesos de limpieza, integración y estandarización,
garantizando confiabilidad y alineación con las políticas institucionales. En salud las políticas
vienen de afuera y no se negocian: el gobierno deja de ser un diseño propio y pasa a ser
cumplimiento demostrable.

Hacerlo tres veces en tres marcos distintos —control, aislamiento y cumplimiento— es lo que me
permite entrar a una organización nueva y reconocer cuál de los tres problemas tiene delante.

## Qué es gobernar un dato, en concreto

<!-- seccion: que-es-gobernar -->

Quitando la palabra grande, gobernar un dato es responder cuatro preguntas y poder demostrar las
respuestas: qué significa, de dónde vino, quién puede verlo y qué pasa cuando cambia.

La cuarta es la que más se olvida y la que más cuesta. Un indicador que cambia de definición sin
aviso destruye más confianza que un dato faltante, porque nadie se entera hasta que dos reuniones
distintas llegan a conclusiones opuestas con el mismo nombre en la pantalla.

## Por qué el gobierno de IA es la continuación, no un tema nuevo

<!-- seccion: la-continuacion -->

Gobernar un modelo o un agente plantea las mismas cuatro preguntas con un sujeto distinto: con qué
datos se entrenó o se alimenta, qué puede y qué no puede hacer, quién responde por lo que produce, y
cómo se sabe cuando su comportamiento cambia.

Quien ya montó gobierno de datos tiene la mitad del camino andado, porque las estructuras son las
mismas: un inventario, un responsable por activo, un control con evidencia y una revisión periódica.
Lo que cambia es que el activo ya no es una tabla.

## El experto en ISO 42001 que construí

<!-- seccion: iso-42001 -->

La norma ISO 42001 es el estándar de sistemas de gestión de inteligencia artificial: el marco con el
que una organización demuestra que gobierna su IA.

Construí un agente experto en esa norma y está publicado en mi vitrina, con su ficha técnica. Su
regla de operación es la que describe mi forma de trabajar con IA generativa en una frase: **ningún
dictamen sale de la memoria del modelo** — cada afirmación normativa cita su entrada del corpus con
apartado y página, o declara el vacío, y estampa la fecha en que verificó que la norma sigue
vigente.

Esa última parte es la que más me importa. Un sistema que dice «según la norma» sin poder señalar el
apartado ni decir cuándo lo comprobó no es un experto: es una máquina de sonar seguro.

## El gobierno aplicado a mi propio proceso

<!-- seccion: gobierno-de-mi-proceso -->

Lo que predico lo tengo montado sobre mi propio pipeline, y se puede ir a mirar.

Ninguna aplicación avanza sin dos aprobaciones escritas: la prioridad vigente y la visión con todas
sus funcionalidades inventariadas. Ningún sprint cierra sin su resumen. Toda salida de un modelo que
se persista pasa por un esquema de validación. Activar una función de IA generativa exige una
decisión escrita que justifique por qué el código no alcanza. Y todo control nace demostrado en
rojo: si nunca se vio fallar, no es un control.

Son reglas de gobierno, aplicadas a construir con IA, escritas antes de necesitarlas.

## Lo transversal en organizaciones grandes

<!-- seccion: lo-transversal -->

Gobernar sirve de poco si no se puede atravesar la organización, y eso lo he hecho tres veces en
sitios donde nadie me reportaba: las mesas con la dirección de concesionarios del sistema de
transporte de Bogotá, la implementación del sistema de bodega de Cafam con veinte personas de
varias áreas, y la gobernanza co-liderada en Banco Pichincha.

Lo que se aprende ahí no es técnico. Es que una iniciativa transversal avanza cuando cada área ve
qué gana, y se detiene cuando se percibe como un requisito impuesto desde afuera. Por eso empiezo
siempre por la decisión que cada área tiene que tomar, no por la norma que tiene que cumplir.

[CONFIRMAR: los roles de estrategia y gobierno de IA suelen pedir especialización o estudios de
posgrado en IA, analítica o transformación digital, y hoy tu formación declarada son los dos
pregrados. ¿Estás cursando algo, lo tienes planeado, o vamos sin él? Es el único requisito de ese
tipo de vacante que hoy no aparece cubierto.]
