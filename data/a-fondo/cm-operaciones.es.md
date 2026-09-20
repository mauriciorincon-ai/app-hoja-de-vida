---
slug: cm-operaciones
titulo: "C&M Consorcio / TransMilenio — Analista de Operaciones (2018–2020)"
resumen: "Mi entrada al transporte masivo: 18 meses supervisando con datos la operación de Bogotá, tableros e informes de desempeño, automatización del procesamiento y las dos preguntas que hoy son investigaciones."
estado: borrador
ancla: "#trayectoria"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué hizo Henry en C&M Consorcio?"
  - "¿Qué experiencia tiene con datos de transporte masivo?"
  - "¿Ha supervisado el cumplimiento de una operación con datos?"
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
Tu entrada al mundo del transporte masivo: qué dashboards
construiste, cómo era trabajar con los datos de la operación de Bogotá, qué
automatizaste. -->

## La operación de una ciudad

<!-- seccion: la-operacion-de-una-ciudad -->

Entré a **C&M Consorcio 2018 en noviembre de 2018** como Analista de Operaciones Junior, dentro
de la supervisión de **TransMilenio**, y estuve hasta mayo de 2020: **18 meses**. Fue mi entrada
al transporte masivo y la primera vez que analicé una operación de escala urbana, con muchos
actores, servicios, vehículos, recorridos y obligaciones contractuales a la vez.

Mi papel era de supervisión: no operábamos el sistema, verificábamos con datos que se operara
como estaba pactado. Eso cambia el dato de naturaleza. Deja de servir para mejorar tu propio
proceso y pasa a sostener una conversación entre la autoridad y el concesionario, donde ninguna
de las dos partes puede discutir de dónde salió el número.

Ninguna fuente describía la operación entera. Había que reconstruirla cruzando registros con
distinto detalle, oportunidad y calidad:

- la programación de servicios;
- la ejecución observada;
- los recorridos y los tiempos;
- las novedades y las condiciones operativas del día.

Ahí entendí que la trazabilidad no es una característica técnica sino una condición de
legitimidad: cuando un indicador puede tener efectos contractuales o económicos, hay que poder
explicar qué representa, de qué fuentes viene, qué reglas se le aplicaron y qué eventos concretos
lo sustentan.

## Los tableros y los informes de desempeño

<!-- seccion: tableros-e-informes -->

Desarrollé los **tableros e informes de desempeño** con los que la supervisión de TransMilenio
seguía la operación. Transformaban grandes volúmenes de registros en indicadores, señalaban las
desviaciones relevantes y permitían pasar del dato individual al comportamiento del sistema. Lo
que se verificaba en ellos:

- servicios programados frente a realizados;
- recorridos y cobertura;
- frecuencias e intervalos entre buses;
- tiempos de ejecución y cumplimiento de la operación.

Un tablero de supervisión no puede quedarse en el agregado. Tiene que dejar recorrer cada
indicador desde la visión ejecutiva hasta el evento que lo sustenta, porque la síntesis facilita
la decisión pero el detalle es lo que permite validar, explicar y controvertir una conclusión.

En supervisión, el indicador no es gestión: es evidencia. Cuando de una cifra pueden colgar un
descuento o una sanción, hay que poder reconstruirla desde la programación, la ejecución y la
regla aplicada. Su **trazabilidad** —el linaje del dato, el *data lineage*— pesa tanto como su
cálculo.

Ahí aprendí también a separar **indicadores de resultado** (*lagging*), que evalúan lo ocurrido
en un periodo, de **indicadores anticipados** (*leading*), que muestran cómo se está formando ese
resultado y dónde aparecen las irregularidades antes de que pesen. Esa forma de trabajar la
trasladé después a los modelos semánticos y a Power BI: una métrica con significado estable,
trazable y que responde a una pregunta relevante.

## La automatización y el histórico operacional

<!-- seccion: la-automatizacion -->

Automaticé las actividades recurrentes de preparación, validación y consolidación de la
información de la operación de TransMilenio, con scripts en **Excel y VBA**: extraer los registros, validarlos, transformarlos
con las mismas reglas cada vez y consolidarlos. Eso redujo la intervención manual, hizo el
procesamiento repetible y dejó de depender de procedimientos individuales difíciles de auditar.

Automatizar no era ejecutar más rápido lo mismo. Antes hubo que definir qué entradas recibía
cada proceso, qué validaciones aplicaba, qué reglas transformaban los datos y qué excepciones
podían presentarse; una automatización sobre definiciones ambiguas solo procesa las
inconsistencias con más velocidad.

Con eso construí y mantuve las **bases estadísticas** de la operación: un histórico que permitía
comparar periodos, reconocer recurrencias y distinguir un evento aislado de un comportamiento
persistente, para que cada análisis no empezara de cero. Fue mi primer pipeline de datos
completo —extraer, validar, transformar, relacionar, almacenar, publicar—, años antes de hacerlo
sobre una plataforma.

## Auditar el cumplimiento

<!-- seccion: auditoria-de-cumplimiento -->

Parte de mi responsabilidad era verificar la **adherencia a los protocolos** y condiciones
operativas de TransMilenio: contrastar la ejecución con lo programado o pactado, con datos, sobre los servicios
realizados, los recorridos, los tiempos y el cumplimiento de la operación. Es una **auditoría de
cumplimiento contractual**, y los indicadores tenían consecuencia económica.

Esa función me enseñó a distinguir **cumplimiento formal de desempeño sistémico**. Una operación
puede satisfacer varios criterios uno a uno y aun así producir un mal resultado por cómo
interactúan sus partes. Por eso, además de verificar si una condición se cumplió, necesitaba
entender cómo las decisiones sobre vehículos, conductores, rutas y demanda se combinaban en un
resultado.

Y aprendí a desconfiar de las optimizaciones locales: una decisión eficiente para un vehículo,
una ruta o una franja horaria podía deteriorar la regularidad, la cobertura o el cumplimiento del
sistema completo. Analizar una operación urbana exige mirar interacciones y efectos acumulados,
no piezas.

## Las dos preguntas que no supe responder entonces

<!-- seccion: las-dos-preguntas -->

De los datos de esos 18 meses salieron dos preguntas que detecté en la operación y no tenía cómo
resolver desde la supervisión.

**La asignación conductor–vehículo–ruta.** Un conductor disponible, un bus operativo y una ruta
programada no son tres decisiones independientes: forman una unidad cuyo desempeño depende de la
compatibilidad entre sus características, de la ruta, de la demanda y de las fallas que aparecen
durante el servicio. El histórico decía qué combinación se había usado y qué había producido;
decidir cuál usar era otra pregunta, prescriptiva, que los indicadores no contestaban.

**El apelotonamiento de buses** —el *bus bunching*—. Al mirar la proximidad temporal entre
pasos, se veía cuándo varios buses de una misma ruta empezaban a circular con intervalos
demasiado cortos. Cada bus seguía prestando servicio, pero el sistema perdía **regularidad de
intervalos** (*headway*): unos usuarios encontraban varios buses juntos y otros esperaban el
doble. Detectarlo era el primer nivel; el difícil era convertir la detección en una política de
control de intervalo —retener, adelantar o saltar paradas según la posición dentro del grupo—,
porque una instrucción uniforme no sirve cuando los buses ya van juntos.

Esas dos preguntas son hoy **dos de las investigaciones que publico en la vitrina**: la
asignación de conductor y bus con fallas, y el control del apelotonamiento de buses. Lo que en
2019 era una anomalía en un tablero es ahora un modelo con su método y su resultado.

## Lo que dejó C&M Consorcio

<!-- seccion: lo-que-dejo -->

C&M Consorcio fue mi primera operación de escala urbana. Aprendí a reconstruir un sistema que
ninguna fuente describe entera, a sostener con evidencia una conversación entre una autoridad y
un concesionario, y a guardar el histórico para que cada análisis no empezara de cero.

La integración de fuentes se volvió después pipelines y plataformas de datos; las definiciones
consistentes, modelado semántico y gobierno; la automatización, aplicaciones; y las dos preguntas
sin respuesta, investigaciones publicadas.
