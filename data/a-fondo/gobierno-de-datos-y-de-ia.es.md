---
slug: gobierno-de-datos-y-de-ia
titulo: "Gobierno de datos y de IA"
resumen: "Gobierno montado tres veces —co-liderado en banca, diseñado desde cero para 12 clientes en una startup de agentes, y hoy en salud bajo UNE-ISO/IEC 42001:2025 con 23 instrumentos— más el agente experto en ISO 42001 y las reglas con las que gobierno mi propio pipeline."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry en gobierno de datos?"
  - "¿Sabe Henry de gobierno de IA y de la norma ISO 42001?"
  - "¿Cómo maneja datos personales o sensibles?"
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

## Tres experiencias de gobierno, tres problemas diferentes

<!-- seccion: tres-veces -->

He asumido responsabilidades de **gobierno de datos** e inteligencia artificial en tres contextos
distintos, y en cada uno el problema era otro:

| Dónde                      | Alcance                                     | El problema que había que gobernar                                   |
| -------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| **Banco Pichincha**, 2023  | co-lideré la iniciativa de gobierno         | confianza: definiciones consistentes, responsables por métrica, acceso por propósito |
| **Vesting**, 2023–2025     | diseñé el gobierno desde cero               | 12 clientes en una plataforma: identidad, propiedad, aislamiento y trazabilidad desde el primer evento |
| **Fundación CTIC**, desde 2025 | gestiono calidad y lidero la estrategia de IA | salud: datos que describen personas, propósito autorizado y un sistema de gestión de IA |

En banca aprendí que una plataforma no se gobierna con permisos: necesita métricas compartidas,
modelos semánticos consistentes y **linaje** hasta las fuentes; la seguridad protege el acceso y
la semántica protege la interpretación. En Vesting el activo gobernado dejó de ser una tabla y
pasó a ser el evento de un sistema inteligente —solicitud, respuesta, estado, costo—, aislado por
cliente en **workspaces separados**. En CTIC el gobierno conecta calidad, confidencialidad y
propósito con la gestión institucional de la IA.

El gobierno no viaja como plantilla. Los principios permanecen; los controles, los **roles** y
los mecanismos de adopción responden al propósito, los riesgos y la madurez de cada organización.

## Qué significa gobernar un dato: trazabilidad de la información

<!-- seccion: que-es-gobernar -->

Gobernar un dato es poder responder cinco preguntas sobre él: de dónde viene y qué reglas lo
transformaron (**linaje**), qué significa y quién responde por esa definición (**roles**), quién
puede usarlo y para qué (**políticas** de acceso por propósito), si es lo bastante completo,
oportuno y consistente para la decisión que lo necesita (calidad en relación con el uso), y qué
evidencia demuestra que los controles funcionan.

Con datos personales, las preguntas tienen ley detrás. En Colombia, **habeas data** y la **Ley
1581** fijan qué puede tratarse, con qué finalidad y con qué autorización; en salud, además, la
**anonimización** cuando el análisis no necesita identificar a nadie. En CTIC las reglas de calidad
—completitud, duplicados, conciliación entre fuentes, umbrales que disparan revisión— se
diseñaron entendiendo el proceso que produce cada dato y la consecuencia de una interpretación
equivocada.

Gobernar no es documentar definiciones que nadie consulta. Es que la información correcta llegue
a las personas adecuadas bajo condiciones claras, y que se pueda demostrar.

## Uso responsable de la inteligencia artificial: liderar una estrategia bajo UNE-ISO/IEC 42001:2025

<!-- seccion: estrategia-iso-42001 -->

Lidero la estrategia institucional de IA de la Fundación CTIC sobre **UNE-ISO/IEC 42001:2025**, la
adopción española de **ISO/IEC 42001**: la IA no como una colección de iniciativas sino como una
capacidad que necesita dirección, políticas, responsabilidades, gestión de riesgos, evaluación y
mejora continua. La norma no prescribe un modelo ni una arquitectura; da la misma estructura de alto nivel de
**ISO 9001** —que apliqué en 2016 en Inglopres— para que la organización comprenda su contexto, fije objetivos, identifique riesgos y oportunidades,
asigne responsabilidades y evalúe su sistema de gestión.

Lo primero es saber qué sistemas existen: un **inventario de sistemas de IA** con propósito,
responsable, proveedor, fuentes, usuarios, nivel de autonomía, madurez y riesgos. No se gobierna
lo que no se puede localizar. Después, la evaluación de impacto de cada sistema —la **AIIA**— y
los criterios para que un caso de uso avance, con controles proporcionales a su riesgo.

El sistema de gestión comprende hoy **23 instrumentos** —políticas, procedimientos, matrices,
criterios de evaluación y mecanismos de seguimiento—, **8 terminados y 15 en construcción**. La
norma se adopta como referente internacional; las obligaciones jurídicas vienen del ordenamiento
colombiano, y ninguna solución es conforme por el solo hecho de existir dentro del sistema. No
afirmo que la institución esté certificada: afirmo que el sistema se construye con rigor y que
cada avance se puede demostrar. El estado de la estrategia, con sus 12 oportunidades y 7 casos
evaluados, está en el documento de CTIC.

## El agente experto en ISO 42001

<!-- seccion: iso-42001 -->

Construí el **Experto ISO 42001**, uno de los 13 agentes de mi vitrina, como evidencia de cómo
trabajo con IA generativa y conocimiento normativo. No usa la memoria del modelo como autoridad
sobre la norma: cada afirmación normativa se sustenta en un corpus autorizado y **cita el
apartado y la página**; cuando el corpus no permite sostener una conclusión, **declara el vacío**.

Conserva la fecha de verificación de sus fuentes, porque una cita puede ser correcta y haber
perdido vigencia. Y delimita su función: localiza requisitos, organiza preguntas, identifica
información faltante y apoya la preparación de análisis; no dictamina conformidad, no sustituye
una auditoría, no certifica. Las conclusiones institucionales necesitan evaluación profesional,
evidencia y responsabilidad humana.

Es también la herramienta con la que reviso cada uno de los 23 instrumentos contra los requisitos
de la norma. La regla central es sencilla: ningún dictamen sale solo de la memoria del modelo.

## Documentación: cómo documento lo que hago, con el gobierno aplicado a mi propio proceso

<!-- seccion: gobierno-de-mi-proceso -->

Aplico los mismos principios sobre mi pipeline —las 32 piezas de la vitrina: aplicaciones,
agentes, investigaciones y tableros—, para que el gobierno no sea un consejo para otros:

- ninguna aplicación avanza sin dos decisiones documentadas: su prioridad y su visión;
- ningún ciclo se cierra sin un resumen con decisiones, pruebas, desviaciones y pendientes;
- toda salida persistente de un modelo pasa por un esquema verificable antes de guardarse;
- incorporar IA generativa exige una decisión justificada: código primero;
- todo control se demuestra fallando antes de confiar en él;
- cada pieza declara su estado —exploración, prototipo, publicada, operada— y cada cifra su
  procedencia: medida, calculada, declarada o estimada.

Estas reglas se escribieron antes de que las fallas las hicieran necesarias. Anticipar las
condiciones de una decisión, en vez de improvisarlas bajo presión, es el principio que más
valoro del gobierno. Las reglas viven en el documento del pipeline.

## El gobierno necesita atravesar la organización

<!-- seccion: lo-transversal -->

El gobierno genera poco valor dentro de un solo equipo. He trabajado tres veces en iniciativas
transversales donde la colaboración no podía ordenarse: las mesas con la dirección de los
concesionarios del SITP, el equipo mixto de 20 personas entre Cafam y el proveedor del WMS, y la
iniciativa co-liderada en Banco Pichincha entre perspectivas técnicas y operativas.

No empiezo exponiendo los controles. Empiezo por el problema de cada actor, la decisión que
necesita y la evidencia que hoy no puede obtener: el gobierno gana legitimidad cuando resuelve
una necesidad real. Eso no debilita los principios; diseña la implementación para que se
entiendan. Y la alta dirección resuelve lo que un acuerdo técnico no puede —prioridades,
recursos, niveles de riesgo—; mi función es llevarle la evidencia y las alternativas.

El gobierno se vuelve sostenible cuando deja de depender de persuadir y queda en roles, procesos,
criterios y revisiones. La influencia inicia el cambio; el sistema de gestión lo conserva.

## Competencia demostrada mediante formación y experiencia

<!-- seccion: experiencia-y-formacion -->

Algunas posiciones de estrategia y gobierno de IA piden posgrado. Mi formación es Ingeniería
Industrial y Diseño Industrial en la Javeriana, cinco credenciales obtenidas —el DP-600 y cuatro
de IBM— y dos rutas en curso, AI-103 y AI-300. No presento la experiencia como sustituto universal
de la educación avanzada: cuando una organización admite equivalencia, mi trayectoria permite
evaluar directamente lo que ese requisito busca representar.

Diez años de trayectoria; gobierno co-liderado en banca; la arquitectura de datos y
observabilidad de una plataforma de agentes con 12 clientes; el proceso con el que se
construyeron 27 agentes; y hoy la estrategia de IA de una institución de salud bajo UNE-ISO/IEC
42001:2025. Construí pipelines y modelos semánticos antes de fijar criterios sobre activos
analíticos, diseñé observabilidad antes de exigir seguimiento, y desarrollé agentes antes de
gobernarlos. Si el posgrado es requisito formal e insustituible, lo reconozco; si es indicador de
pensamiento estructurado y profundidad técnica, hay resultados que examinar.
