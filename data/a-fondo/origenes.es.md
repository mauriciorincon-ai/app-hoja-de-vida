---
slug: origenes
titulo: "De la ingeniería industrial a los datos"
resumen: "El arco: por qué Ingeniería Industrial y Diseño Industrial, el primer trabajo que fue de procesos, los tres saltos hasta la IA con la tabla de los ocho empleos, el hilo con sus métodos, y cuántos años son."
estado: borrador
ancla: "#trayectoria"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Por qué pasó Henry de ingeniería industrial a los datos?"
  - "¿Por qué estudió Henry ingeniería industrial y diseño industrial?"
  - "¿Cuántos años de experiencia profesional tiene?"
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
El arco completo: por qué estudiaste Ingeniería Industrial, cuándo
descubriste los datos, qué te llevó de procesos a analítica y de ahí a IA.
El hilo que conecta toda tu trayectoria. -->

## Por qué ingeniería industrial, y la formación en diseño

<!-- seccion: por-que-industrial -->

Elegí **Ingeniería Industrial** porque quería entender cómo funcionan las organizaciones como
sistemas completos y, sobre todo, cómo podían funcionar mejor. Me interesaba una disciplina que
conectara procesos, personas, información, tecnología y decisiones, en vez de observar una parte
aislada.

La estudié en la **Pontificia Universidad Javeriana entre 2009 y 2016**, con énfasis en
Inteligencia Analítica de Datos. Ese énfasis fue el punto de inflexión: descubrí que los datos
ampliaban la capacidad de la ingeniería para comprender y transformar sistemas, y ahí aprendí
SQL, Python y Power BI. En medio de la carrera pasé un año en Melbourne, entre 2013 y 2014, en un
curso intensivo de inglés que cerró con el IELTS.

En paralelo cursé **Diseño Industrial** en la misma universidad, entre 2011 y 2016, con enfoque
en sostenibilidad e impacto cultural. Del diseño conservo una idea que aplico a diario: una
solución que las personas no comprenden o no pueden usar con confianza todavía no está terminada.
La funcionalidad no basta; la solución tiene que comunicar su propósito y reducir la complejidad
que le entrega a quien la usa.

Las tres cosas siguen definiendo el perfil. La ingeniería me permite estructurar la complejidad.
Los datos me permiten observarla y explicarla con evidencia. El diseño me obliga a convertir ese
conocimiento en algo que alguien pueda usar para decidir.

Ingeniería Industrial me dio el hábito de buscar la causa en la relación entre componentes, no en
el componente que falla. Diez años después sigo empezando igual: antes de proponer un modelo,
dibujo el proceso y ubico dónde se pierde el flujo.

## El primer trabajo fue de procesos, no de datos

<!-- seccion: el-primer-trabajo -->

Mi primer empleo, en **Inglopres desde agosto de 2016**, fue como Ingeniero de Procesos: una
operación de alquiler y venta de maquinaria pesada, un **ERP** (Odoo) que había que implementar
para integrar áreas que trabajaban sueltas, y la norma ISO 9001:2015 como marco.

El punto de quiebre llegó al intentar medir. Me habían pedido mejorar la operación y descubrí que
la mitad de la información no existía: no se capturaba, o vivía en registros que nadie cruzaba.
Para evaluar un proceso necesitaba indicadores, y para tener indicadores tuve que construir
primero el dato: definir estructuras de información, organizar los eventos operativos y diseñar
bases de datos en SQLite que los relacionaran.

No fue una decisión de carrera. Fue lo que el problema exigía. Y de ahí salió también una
combinación que conservo: libertad para probar alternativas, y un mecanismo para evaluar,
controlar y reproducir la que demuestra valor.

El detalle de ese año —el ERP, el estudio del trabajo, el equipo de doce— está en el documento de
Inglopres. Aquí importa el giro: mi trayectoria se orientó a los datos porque un proceso no se
puede mejorar sin medirlo, y no se puede medir sin construir su información.

## Los tres saltos

<!-- seccion: los-tres-saltos -->

Después de ese primer año la trayectoria dio tres saltos de escala: del proceso al indicador, del
indicador a la plataforma, y de la plataforma a la inteligencia artificial. Ocho empleos en ocho
organizaciones:

| Periodo                     | Rol y organización                                            | Qué cambió de escala                                                  |
| --------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| agosto 2016 – junio 2017    | Ingeniero de Procesos, Inglopres                              | un proceso: el ERP, las bases de datos que faltaban, un equipo de 12   |
| noviembre 2017 – noviembre 2018 | Coordinador de Operaciones, Ceinfes                       | una operación: KPIs para tres frentes y más de 100 colegios, junta directiva |
| noviembre 2018 – mayo 2020  | Analista de Operaciones, C&M Consorcio (TransMilenio)         | una ciudad: supervisar con datos la operación de Bogotá               |
| octubre 2020 – junio 2021   | Analista de Sistemas de Información, Cafam                    | un sistema empresarial: el WMS, 20 personas, integraciones             |
| julio 2021 – mayo 2022      | Análisis Post-Operacional, C&M Consultores (TransMilenio)     | un pipeline: ETL, tableros, +35 % de eficiencia analítica, demanda     |
| marzo 2023 – julio 2023     | Analista Senior de Analítica y Reportes, Banco Pichincha | la adopción: BI para 50+ usuarios con un equipo de 5, −35 % en tiempos de análisis |
| agosto 2023 – enero 2025    | Líder de Estrategia de Datos, Vesting                         | una plataforma: Microsoft Fabric desde cero para monitorear agentes de IA |
| marzo 2025 – hoy            | Profesional de Analítica, Fundación CTIC                      | la estrategia: analítica en salud y el sistema de gestión de IA        |

## Del proceso al indicador, a la plataforma, a la IA

<!-- seccion: del-proceso-a-la-ia -->

**Del proceso al indicador** (Ceinfes y C&M Consorcio). Dejé de mejorar una actividad y pasé a
dirigir y supervisar operaciones enteras a través de sus datos: KPIs por área, tableros de
desempeño, un histórico para que cada análisis no empezara de cero.

**Del indicador a la plataforma** (Cafam, C&M Consultores y Banco Pichincha). El dato dejó de
ser un reporte y pasó a ser un sistema: la implementación de un WMS, un pipeline de **ETL** y
tableros que cruzaban fuentes heterogéneas, y en banca la lección más dura del BI: un tablero
que nadie usa no es un entregable, y la adopción se mide.

**De la plataforma a la IA** (Vesting y Fundación CTIC). En Vesting construí desde cero, en
Microsoft Fabric, la plataforma con la que se monitoreaban agentes de IA en producción, y
documenté el proceso replicable para diseñarlos. En CTIC lidero la estrategia institucional de
IA bajo ISO/IEC 42001, en el sector más exigente en privacidad y trazabilidad que he trabajado.

Cada salto tiene su documento con el detalle y las cifras; este es el mapa.

## El hilo

<!-- seccion: el-hilo -->

El hilo que une los ocho empleos cabe en una frase: **entender un proceso, medirlo, y darle a
alguien el instrumento para decidir sobre él**. Cambió la escala y cambió la herramienta; el
método es el mismo, y tiene nombre.

- **Estudio de tiempos y suplementos por fatiga**, en Inglopres: un tiempo observado no es un
  estándar hasta que reconoce el esfuerzo de quien lo ejecuta.
- **Balanceo de líneas y teoría de restricciones**, en Ceinfes: el cuello de botella fija el ritmo
  real, y la capacidad efectiva —con excepciones y reprocesos— no es la teórica.
- **Modelado de procesos en BPMN y simulación**: Bizagi en Inglopres, Ceinfes, Cafam y Banco
  Pichincha, FlexSim en Inglopres y Cafam. Dibujar el proceso ejecutado antes de tocarlo, y
  probar la alternativa antes de implantarla.
- **Un problema de asignación con restricciones**, en TransMilenio: conductor, bus y ruta no son
  tres decisiones sino una, y lo prescriptivo empieza por formularlo así.
- **ISO 9001 y, hoy, ISO/IEC 42001**: la misma estructura de alto nivel de los sistemas de gestión
  ISO, aplicada en 2016 a la calidad de una operación y en 2025 a la gestión de la inteligencia
  artificial. Lo hecho deja rastro escrito, y eso no cambió.

Por eso mi trayectoria no es un alejamiento de la Ingeniería Industrial sino su evolución: pasé
de estudiar cómo mejorar procesos a construir las capacidades analíticas que permiten
comprenderlos, y de analizar decisiones a construir soluciones que las asisten. Un agente de IA,
visto así, no es una funcionalidad: es un participante nuevo dentro de un sistema de trabajo, con
acceso a cierta información, límites y una responsabilidad que hay que diseñar.

## Cuántos años

<!-- seccion: cuantos-anos -->

Mi formación formal es el pregrado en Ingeniería Industrial de la Javeriana, con énfasis en Inteligencia Analítica de Datos, y el programa de Diseño Industrial; no tengo maestría, especialización ni otro posgrado: la profundización posterior son las certificaciones y lo construido. **Diez años de trayectoria profesional**, contados desde agosto de 2016, y **ocho con los datos
en el centro**, contados desde Ceinfes en noviembre de 2017, cuando los indicadores pasaron a ser
mi trabajo y no una herramienta del trabajo.

En ese arco hay ocho empleos en siete organizaciones y seis sectores: maquinaria pesada,
evaluación educativa, transporte masivo, logística de medicamentos, banca y una startup de
agentes de IA; hoy, el sector salud. Sumados, son **105 meses de trabajo efectivo**, ocho años y
nueve meses; el resto, hasta los diez, son las pausas entre un empleo y el siguiente, la más larga
entre mayo de 2022 y marzo de 2023, que dediqué a estudiar: tres de las cuatro
certificaciones de IBM —las de 2022— son de esos meses. Los periodos exactos, mes a mes, están en la tabla de arriba.

Si la pregunta es qué tan grande es mi experiencia con IA comparada con la de datos: los datos ocupan ocho de
esos años; la IA aplicada, con agentes en producción, empieza en agosto de 2023 en Vesting y
sigue hoy en CTIC. Tres años de los diez, y los tres más recientes.
