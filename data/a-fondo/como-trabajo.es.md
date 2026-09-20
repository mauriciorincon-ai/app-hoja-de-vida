---
slug: como-trabajo
titulo: "Mi forma de trabajar"
resumen: "Cómo trabajo, con la evidencia de cada rasgo: primero el proceso (BPMN), la adopción como indicador (50+ usuarios), liderazgo de equipos de hasta 20 personas, la junta directiva y las mesas del SITP, y qué instrumento va con cada decisión."
estado: borrador
ancla: "#perfil"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Cómo trabaja Henry?"
  - "¿Cómo lidera Henry un equipo y cómo se comunica con las áreas de negocio?"
  - "¿Cuál es el equipo más grande que ha liderado?"
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

<!-- guía (viene del esqueleto de la historia, S3 — la escribió el dueño):
Cómo piensas y trabajas: tu enfoque para resolver problemas, cómo
lideras equipos, qué valoras en un proyecto, cómo comunicas con stakeholders.
Lo que un hiring manager preguntaría en la primera entrevista. -->

## Ante un problema nuevo: primero el proceso, después la herramienta

<!-- seccion: primero-el-proceso -->

Soy ingeniero industrial antes que ingeniero de datos, y esa forma de mirar sigue siendo mi
mayor ventaja: los problemas que parecen de tecnología casi siempre son de proceso. Un tablero no
arregla la falta de claridad operativa; un modelo no compensa un flujo mal definido; un agente no
convierte una actividad ambigua en una capacidad.

Por eso, antes de construir, dibujo. Modelo el proceso en **BPMN**, con Bizagi, con sus
actividades, decisiones, excepciones y responsables, y separo el proceso definido del proceso
ejecutado. Lo hice en Inglopres antes de implantar el ERP, en Cafam antes de probar el WMS y en
Pichincha antes de tocar los datos del banco. Cuando la organización produce registros de
eventos, el modelo formal se contrasta con el flujo real: es minería de procesos, y es el
método que aplicaría, no un caso que haya corrido.

En este sitio el principio está automatizado: el diagrama BPMN de cada pieza se genera desde su
definición, para que no envejezca al cambiar el proceso. El método completo, con FlexSim y la
simulación, está en el documento de procesos.

## La adopción es el indicador, no el entregable

<!-- seccion: la-adopcion-es-el-indicador -->

Construir rara vez es la parte difícil. Lo difícil es que la solución se use para decidir. Por eso
diseño desde la decisión: quién va a usar la información, qué pregunta responde, con qué detalle
y con qué frecuencia; y mido la adopción, no la entrega.

Tres veces lo medí:

- **Banco Pichincha:** dashboards adoptados por **más de 50 usuarios** del negocio, con +25 % en
  la toma de decisiones asociada.
- **TransMilenio:** Power BI adoptado por **más de 25 usuarios clave** de la operación.
- **Cafam:** el BI de control del proyecto, usado por **más de 15 directores y jefes**.

La adopción es un problema humano tanto como técnico: en Pichincha el programa de formación a 12
profesionales fue parte del producto, no un anexo. Cómo se mide la adopción sin confundirla con
visitas está en el documento de BI.

## Cómo lidero un equipo, y cómo trabajo con personas que no me reportan

<!-- seccion: como-lidero -->

Lidero eliminando ambigüedad, no aumentando control. Cuando cada persona sabe qué problema
resolvemos, qué resultado se espera, qué significa terminar y de qué información dispone, el
equipo avanza sin mí delante. Tengo las cifras que lo dicen:

| Dónde       | Equipo                                | Resultado                                              |
| ----------- | ------------------------------------- | ------------------------------------------------------ |
| Cafam       | **20 personas**, 14 propias y 6 del proveedor, seis meses de pruebas del WMS | −25 % de errores, +15 % de eficiencia operativa |
| Inglopres   | **12 personas**, operarios y técnicos | 95 % de satisfacción del cliente                       |
| Ceinfes     | tres frentes, unas 40 personas directas y 50 profesores | más de 100 colegios al año atendidos a tiempo |
| Pichincha   | **5 personas** a cargo                | 50+ usuarios, −35 % en tiempos de análisis             |

En Cafam no bajamos los errores con más supervisión sino escribiendo antes de empezar qué contaba
como caso probado y quién lo firmaba. Después de Cafam pasé a liderar procesos completos que integran a muchas personas que no me reportan: en Vesting, la plataforma y el proceso con el
que se construyeron 27 agentes; en CTIC, la estrategia de IA de la institución.

Distingo delegar tareas de distribuir la capacidad de decidir. No creo en el seguimiento por
reuniones constantes: prefiero mecanismos donde el avance, los bloqueos y las prioridades sean
visibles para todos, como el Kanban y el Scrum que llevé a Ceinfes. Y no evalúo mi liderazgo por
las decisiones que pasan por mí, sino por la claridad con la que el equipo avanza cuando no estoy.

## Cómo me comunico con las áreas de negocio

<!-- seccion: como-hablo-con-el-negocio -->

Nadie decide sobre una tabla. Lo aprendí por dos vías: en la **junta directiva de Ceinfes**, a la
que presenté informes **cada viernes** durante un año y de la que salieron programas de incentivos
y rediseños de procesos, puestos y software; y en las **mesas con la dirección del SITP**, donde la
conversación se movió cuando llevé una frase defendible con su procedencia detrás, y los
indicadores del sistema subieron un 25 %.

Con la alta dirección no empiezo por la herramienta ni por el modelo: empiezo por la decisión que
hay que tomar y el impacto que tiene. Llego con dos niveles: una lámina con la consecuencia y un
número, y detrás la base trazable por si la piden. Separo hechos, interpretaciones, hipótesis y
recomendaciones, porque cada uno pide una confianza distinta.

Toda cifra tiene identidad y procedencia. Si no puedo explicar de dónde sale, cómo se transformó
y cuándo se actualizó, no la presento. En Vesting trabajé directamente con los fundadores; en
CTIC tengo línea directa con la Dirección de Planeación y con las subdirecciones de tecnología,
gestión de la información y calidad; en Cafam, con los directores de medicamentos, TI, proyecto
y centro de distribución. Trabajo en inglés profesional (B2) cuando el equipo lo exige.

Después de una conversación ejecutiva no debe quedar una presentación convincente. Debe quedar
una decisión explícita, un responsable, un plazo y un indicador para saber si funcionó.

## Qué valoro en un proyecto

<!-- seccion: que-valoro -->

Tres condiciones, y tengo un caso para cada una:

| Criterio                                               | Qué exijo                                                                 | Dónde lo vi                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Un problema real con impacto medible**               | saber qué debe cambiar, quién lo sufre y cuánto vale resolverlo           | TransMilenio: la operación generaba datos más rápido de lo que se analizaban; el ETL subió 70 % la velocidad |
| **Un responsable del negocio dispuesto a adoptarla**   | no basta patrocinio; alguien que la convierta en parte de la operación    | Pichincha: los 50+ usuarios existieron porque el negocio definió las preguntas |
| **Una capacidad que sobreviva a quien la construyó**   | procesos, criterios y componentes que otros puedan operar y mejorar       | Vesting: el proceso core documentado con el que la startup siguió construyendo agentes sin mí |

También valoro que un proyecto deje activos reutilizables —patrones, componentes, pruebas,
documentación— y que aprenda después de implementarse: las necesidades cambian, los modelos se
degradan, los usuarios descubren usos nuevos. La documentación reproducible y la transferencia
son parte del resultado, no del cierre. Las 32 piezas de la vitrina siguen esa regla.

## Un instrumento para cada decisión

<!-- seccion: el-instrumento-para-cada-decision -->

No todo problema necesita un tablero, ni un modelo, ni un agente. Ordeno los instrumentos por el
nivel de agencia que la organización les cede: **un reporte documenta; un tablero permite
explorar; una alerta dirige la atención; un modelo predictivo anticipa; una recomendación
propone; una aplicación organiza la ejecución; un agente actúa dentro de límites.**

Cuanto más cerca está el instrumento de intervenir la operación, más exige: calidad de datos,
claridad de reglas, trazabilidad, controles y supervisión. Elijo el escalón por el valor y el
riesgo de equivocarse, no por la novedad. En Pichincha el escalón correcto fue el modelo con la
persona decidiendo; en Vesting, agentes que actuaban con límites explícitos; en CTIC, primero la
analítica y solo después la IA que la evidencia justifique.
