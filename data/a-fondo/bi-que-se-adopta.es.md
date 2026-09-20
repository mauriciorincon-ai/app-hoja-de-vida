---
slug: bi-que-se-adopta
titulo: "BI que se adopta"
resumen: "La adopción como indicador y no el tablero: 50+ usuarios en banca, 25+ usuarios clave en transporte, 15+ en logística y 42 productos para 20 líderes en salud; la formación como parte del producto, la procedencia de cada cifra y el agente que construye reportes de Power BI completos."
cuando_usar: "Úsalo cuando pregunten por inteligencia de negocios: cómo logra que la gente use los tableros, cuántos usuarios han adoptado sus tableros, la adopción como indicador, el diseño alrededor de una decisión, Power BI, Shiny, Tableau y Looker Studio, y el liderazgo en BI y analítica."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Cómo logra Henry que el negocio adopte los tableros?"
  - "¿Por qué dice Henry que la adopción es el indicador y no el tablero?"
  - "¿Cuántos usuarios han adoptado los tableros que ha hecho?"
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

## La adopción es el indicador, no el tablero: el problema difícil del BI no es técnico

<!-- seccion: el-problema-dificil -->

Construir un tablero en Power BI no suele ser la parte más difícil de una iniciativa de inteligencia de negocios. El verdadero desafío es conseguir que las personas lo incorporen en su forma de trabajar, vuelvan a consultarlo cuando necesitan tomar una decisión y confíen en sus resultados cuando la información contradice una percepción previa.

He observado un patrón recurrente en diferentes organizaciones: se producen reportes técnicamente correctos que, después de su publicación, pierden relevancia o terminan siendo utilizados únicamente por quienes los construyeron. Ante ese resultado, la primera conclusión suele ser que hace falta una herramienta más avanzada, una visualización diferente o un nuevo conjunto de indicadores. Con frecuencia, el problema se encuentra en otro lugar: el producto analítico no fue diseñado alrededor de una decisión real. En Banco Pichincha, en 2023, ese era el problema entero del rol al llegar: un área de analítica y reportes que producía tableros técnicamente correctos que el negocio no terminaba de adoptar, con procesos ETL lentos y modelos fuera de producción.

Un tablero puede presentar información valiosa y, aun así, no responder a ninguna pregunta que una persona necesite resolver dentro de su trabajo. También puede responder correctamente, pero hacerlo demasiado tarde, exigir una interpretación excesivamente compleja o mostrar un nivel de detalle incompatible con la responsabilidad del usuario.

Por eso, antes de construir, necesito comprender quién utilizará la solución, qué decisión debe tomar, con qué frecuencia ocurre, qué información utiliza actualmente, cuánto tiempo conserva valor esa información y qué acción podría emprender después de observar el resultado. Trato la **adopción** como el indicador del producto y no como una métrica que se revisa al final: es una hipótesis de diseño que se formula desde el comienzo y se valida en la operación.

## De la pantalla a la capacidad de decisión

<!-- seccion: capacidad-de-decision -->

Esta perspectiva cambia la naturaleza del proyecto. El objetivo deja de ser producir una pantalla y pasa a ser diseñar una capacidad de decisión. El tablero continúa siendo importante, pero se convierte en uno de los componentes necesarios para que los datos puedan integrarse en una rutina organizacional.

También distingue entre necesidades que a primera vista pueden parecer iguales. Algunas decisiones requieren exploración y comparación, por lo que un tablero resulta apropiado. Otras necesitan una alerta, una notificación, una recomendación o una aplicación que estructure la acción. Cuando la persona necesita conocer una excepción a una hora determinada, obligarla a revisar periódicamente un reporte puede ser una mala decisión de diseño.

La adopción comienza, por tanto, mucho antes de publicar. Comienza cuando se selecciona correctamente el problema, se comprende el contexto de uso, se acuerdan las definiciones y se diseña un producto que reduzca el esfuerzo necesario para pasar de la información a la acción. En la Fundación CTIC, desde marzo de 2025, la regla se aplica producto por producto: cada uno de los 42 productos analíticos nace de la pregunta de un líder de proceso y no de una tabla disponible, y por eso se puede afirmar que los usan 20 líderes de 15 procesos y no solo que están publicados.

Power BI proporciona capacidades muy amplias para modelar, analizar y comunicar información. Sin embargo, ninguna funcionalidad reemplaza la necesidad de comprender el proceso, la audiencia y la decisión. La herramienta puede facilitar la experiencia; el propósito debe surgir del negocio.

## La adopción demostrada en contextos diferentes

<!-- seccion: adopcion-medida -->

He medido la adopción y el efecto de soluciones de inteligencia de negocios en contextos financieros, urbanos, logísticos, de supervisión operativa y de salud. Las organizaciones, los usuarios y las decisiones eran diferentes, pero el principio permaneció: una solución analítica solo comienza a generar valor cuando se incorpora en el trabajo de las personas que pueden actuar sobre sus resultados.

| Dónde                              | Cuándo                    | Producto                                                              | Adopción                                        | Efecto                                                |
| ---------------------------------- | ------------------------- | --------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------- |
| **Banco Pichincha**                | marzo – julio 2023        | dashboards orientados a decisión, con un equipo de 5 personas         | **más de 50 usuarios** del negocio              | +25 % en la toma de decisiones                        |
| **TransMilenio / C&M Consultores** | julio 2021 – mayo 2022    | Power BI en el análisis post-operacional                              | **más de 25 usuarios clave** de la operación    | +35 % en eficiencia de los procesos analíticos        |
| **Cafam**                          | octubre 2020 – junio 2021 | el BI de control de la implementación del WMS                         | **más de 15** directores, coordinadores y jefes | +50 % en precisión del seguimiento de pruebas         |
| **Fundación CTIC**                 | desde marzo 2025          | 42 productos analíticos por procesos, 23 de ellos tableros de control | **20 líderes** de 15 procesos, unos 75 usuarios | cerca de 60 % menos esfuerzo de preparación, estimado |

## Banco Pichincha y C&M Consultores: más de 50 usuarios y más de 25 usuarios clave

<!-- seccion: pichincha-y-cm-consultores -->

En Banco Pichincha lideré un equipo de inteligencia de negocios de 5 personas en el desarrollo y fortalecimiento de dashboards utilizados por más de cincuenta usuarios. La experiencia reportó una mejora del veinticinco por ciento en los procesos de análisis y toma de decisiones respaldados por estos productos. La adopción no dependió únicamente de construir nuevas visualizaciones, sino de combinar modelos consistentes, optimización técnica —los modelos semánticos con DAX Studio y Tabular Editor, el ETL con un 35 % menos de tiempo de análisis—, formación y una relación más clara entre las métricas y las necesidades de los usuarios.

En C&M Consultores, en el análisis post-operacional de TransMilenio, lideré la implementación de herramientas especializadas de inteligencia de negocios —Power BI— adoptadas por más de veinticinco usuarios clave. La intervención contribuyó a mejorar en un treinta y cinco por ciento la eficiencia de los procesos analíticos. En este contexto, usuarios clave no significaba simplemente personas con acceso a la herramienta, sino responsables que utilizaban la información dentro de actividades de programación, seguimiento y decisión operacional.

## Cafam, C&M Consorcio y la Fundación CTIC: la adopción con nombre de cargo

<!-- seccion: adopcion-con-nombre-de-cargo -->

En Cafam diseñé informes y tableros para controlar la implementación de Oracle WMS Cloud en un centro de distribución de medicamentos. La solución fue adoptada por más de quince usuarios y mejoró en un cincuenta por ciento la precisión del seguimiento de las pruebas. Los quince tenían cargo: la dirección de medicamentos, la de TI, la del proyecto, la del centro de distribución y los coordinadores y jefes del centro. El producto analítico permitió observar cobertura, resultados, hallazgos, responsables y estados de validación mientras el proyecto estaba en ejecución, con 20 personas probando.

En C&M Consorcio 2018, entre noviembre de 2018 y mayo de 2020, desarrollé tableros e informes de desempeño orientados al control y la transparencia de la supervisión de TransMilenio: 2 informes semanales, 1 consolidado mensual y otros a demanda, sobre unas 150 rutas de 10 empresas concesionarias, con Excel, VBA y SQL. En esta experiencia no cuento con una cifra confirmada de usuarios, por lo que no la presento como un caso de adopción cuantificada. Su valor se encuentra en haber convertido registros operacionales heterogéneos en evidencia trazable para la supervisión y la evaluación de compromisos, y en que los tiempos de procesamiento bajaron como mínimo un 40 %.

En la Fundación CTIC, desde marzo de 2025, los 42 productos analíticos en Power BI —23 de ellos tableros de control por procesos— los usan 20 líderes de 15 procesos y unos 75 usuarios, líderes administrativos y asistenciales con necesidades muy distintas. La cifra de efecto la declaro como lo que es: cerca de un 60 % menos de esfuerzo en la preparación de la información, estimado, y 10 planes de análisis en seguimiento.

Estas experiencias no deben compararse únicamente por el número de usuarios. Una solución utilizada por quince personas con responsabilidad directa sobre un proceso crítico puede producir más valor que un reporte consultado ocasionalmente por cientos. La adopción debe interpretarse según la función del usuario, la frecuencia de la decisión y el alcance de las acciones que la información permite orientar.

## Acceso, uso, adopción e impacto: cuatro cosas que se confunden

<!-- seccion: acceso-uso-adopcion-impacto -->

Distingo entre acceso, uso, adopción e impacto. Dar acceso demuestra disponibilidad. Abrir un tablero demuestra uso. Incorporarlo sistemáticamente en una rutina demuestra adopción. Modificar una decisión o mejorar un resultado demuestra impacto. Confundir estas categorías puede producir cifras llamativas sin probar que la solución cambió realmente la manera de trabajar.

Cada una de mis cifras está en un escalón distinto de esa escalera, y lo digo. «Más de 50 usuarios» en Banco Pichincha es adopción; el «+25 % en la toma de decisiones» es impacto, medido sobre las decisiones que esos tableros respaldaban. «Más de 25 usuarios clave» en C&M Consultores es adopción por rol; el «+35 % de eficiencia» es impacto sobre los procesos analíticos. «Más de 15 usuarios» en Cafam es adopción con cargo; el «+50 % de precisión» es impacto sobre el seguimiento de las pruebas. Y en la Fundación CTIC, «20 líderes de 15 procesos» es adopción contada, mientras que el «cerca de 60 %» es una estimación de impacto, y por eso lleva el «cerca de».

Por eso, cuando evalúo una solución analítica, no pregunto únicamente cuántas personas pueden consultarla. Necesito saber quiénes la utilizan, para qué decisiones, con qué frecuencia, qué actividades reemplaza, qué conversaciones facilita y qué resultado puede observarse después de su incorporación.

La adopción no es una métrica secundaria que se revisa al final del proyecto. Es una hipótesis central de diseño que debe formularse desde el comienzo y validarse durante la operación.

## Diseño alrededor de una decisión

<!-- seccion: diseno-para-la-decision -->

Antes de construir una pantalla, identifico la decisión que la solución debe respaldar. Necesito comprender quién la toma, qué responsabilidad tiene, cuánto tiempo dispone, qué alternativas puede considerar y qué consecuencias produce una actuación tardía o equivocada.

Esta forma de trabajo evita comenzar por los datos disponibles. Una organización puede disponer de cientos de campos y decenas de indicadores sin que todos resulten relevantes para una decisión concreta. Diseñar desde el conjunto de datos suele producir tableros extensos. Diseñar desde la decisión obliga a priorizar.

También permite establecer qué nivel de detalle necesita cada audiencia. La alta dirección requiere tendencias, riesgos, comparaciones y capacidad de respuesta. Los responsables del proceso necesitan comprender restricciones, causas y oportunidades de intervención. Los equipos operativos necesitan identificar situaciones concretas y actuar sobre ellas. En la Fundación CTIC las dos audiencias —líderes administrativos y asistenciales— reciben la misma cifra con distinta profundidad, y en Cafam la dirección del centro de distribución y un jefe del centro leían el mismo BI de control con dos preguntas distintas.

La solución puede utilizar un mismo modelo semántico para estas audiencias, pero no debe presentarles la misma experiencia de manera indiscriminada. La definición de las métricas permanece estable; la navegación, el contexto y el nivel de profundidad se adaptan a la responsabilidad de cada usuario. Cada tablero ofrece una ruta desde la visión general hasta la evidencia, para que el responsable reconozca la condición y pueda profundizar cuando una cifra lo exige.

## El momento de la decisión: cuando un tablero no es la respuesta

<!-- seccion: el-momento-de-la-decision -->

El diseño también debe considerar el momento. Un indicador puede ser correcto y llegar demasiado tarde. Una predicción puede ser precisa y no coincidir con el ciclo de planeación. Un tablero puede contener la respuesta y requerir una exploración incompatible con la urgencia de la decisión. Por eso, en algunos casos la mejor solución no es un nuevo tablero. Puede ser una alerta vinculada con una condición específica, una vista simplificada para una reunión, una aplicación que permita registrar la acción o una capacidad inteligente que prepare una recomendación bajo criterios definidos.

La Ingeniería Industrial aporta la comprensión del proceso y de la decisión dentro del flujo completo. El Diseño Industrial aporta la observación de la experiencia: qué necesita comprender la persona, qué información debe aparecer primero y qué fricción puede impedir que la solución sea utilizada. Power BI materializa esa experiencia cuando la necesidad exige análisis, comparación y profundización. Su valor aparece cuando la tecnología responde al recorrido decisional del usuario y no cuando la persona debe adaptar su trabajo a la estructura del reporte.

## Una definición compartida por indicador: el modelo semántico y DAX

<!-- seccion: definiciones-compartidas -->

La adopción depende de la confianza, y la confianza se debilita cuando diferentes productos presentan valores distintos para un concepto aparentemente idéntico. Una organización no puede tomar decisiones con agilidad si cada reunión comienza discutiendo cuál cifra es correcta. Si un tablero y otro calculan distinto el mismo concepto, el usuario compara herramientas en vez de analizar la realidad.

Por eso, una parte esencial del trabajo ocurre en el **modelo semántico**. Allí se estructuran las entidades, relaciones, jerarquías, dimensiones y medidas mediante las cuales los datos adquieren significado para el negocio. Cada indicador tiene **una definición**, un responsable y una regla de cálculo, centralizadas en el modelo y expresadas como medidas **DAX** que todos los productos reutilizan.

El modelo semántico no crea el consenso por sí solo. La definición debe ser acordada por quienes tienen conocimiento y responsabilidad sobre el proceso. La tecnología convierte ese acuerdo en una regla reutilizable, pero no reemplaza la conversación necesaria para establecer qué representa el indicador, qué incluye, qué excluye y bajo qué condiciones puede compararse.

Una vez acordada, la definición debe implementarse de forma consistente y mantenerse separada de las visualizaciones particulares. Esto permite que diferentes reportes, páginas o audiencias utilicen la misma medida sin reconstruir su lógica de manera independiente. La separación entre modelo y experiencia también permite un autoservicio más gobernado: los usuarios pueden explorar la información, combinar perspectivas y construir nuevas experiencias sin redefinir cada vez las métricas críticas. La autonomía permanece en el análisis; la consistencia se protege en la capa semántica.

## DAX Studio, Tabular Editor y el modelo semántico como activo empresarial

<!-- seccion: dax-studio-y-tabular-editor -->

Mi especialidad en Power BI se concentra precisamente en esta relación entre arquitectura y utilización. No considero terminado un modelo únicamente porque produce las cifras esperadas. También debe ser comprensible, eficiente, mantenible y suficientemente claro para que otra persona pueda validarlo y hacerlo evolucionar. Herramientas como **DAX Studio** y **Tabular Editor** me han permitido profundizar en esta disciplina —en Banco Pichincha, en 2023, con ellas optimicé los modelos semánticos del área—, analizar el comportamiento de las medidas, mejorar el rendimiento y organizar los modelos como activos empresariales reutilizables. En Vesting, sobre Microsoft Fabric, los modelos combinaban Direct Lake, importación y DirectQuery según lo que cada producto necesitaba; cómo se optimiza ese modelo está en el documento de Fabric.

Una definición compartida no elimina la discusión. La desplaza hacia el lugar correcto. La organización deja de discutir cómo fue calculado el número y puede concentrarse en qué significa, por qué cambió y qué decisión necesita tomar.

## La formación forma parte del producto

<!-- seccion: formacion-y-adopcion -->

Una solución analítica no se adopta únicamente porque sea intuitiva. Las personas necesitan comprender qué representa la información, cómo deben interpretarla, qué límites tiene y de qué manera pueden utilizarla dentro de sus responsabilidades.

Por eso, considero la **formación** como parte del entregable y no como una actividad opcional posterior a la publicación. En Banco Pichincha, entre marzo y julio de 2023, diseñé y dicté un programa dirigido a doce profesionales que contribuyó a mejorar en un veinte por ciento la productividad asociada con la preparación y utilización de información. El objetivo no era enseñar funciones aisladas de Power BI. Era fortalecer la capacidad para recorrer el ciclo completo: preparar datos con Power Query, reconocer entidades y relaciones en el modelo semántico, construir medidas DAX, interpretar visualizaciones y convertir un hallazgo en una conclusión defendible ante la dirección. Y se hizo sobre sus propios productos, no sobre ejercicios de manual.

La formación también reducía la dependencia del equipo de inteligencia de negocios. Un usuario con mayor criterio analítico puede formular mejores preguntas, identificar inconsistencias y utilizar el producto con mayor autonomía. Esto permite que el equipo técnico —en Pichincha, 5 personas— concentre su esfuerzo en capacidades más complejas en lugar de responder repetidamente las mismas dudas operativas.

Sin embargo, autonomía no significa ausencia de gobierno. Los usuarios pueden ampliar su capacidad de exploración y análisis sin redefinir individualmente las métricas críticas ni reconstruir la lógica institucional en cada reporte.

También adapto la formación a las necesidades del usuario. Una persona responsable de una decisión ejecutiva no necesita el mismo nivel de profundidad técnica que quien desarrolla un modelo semántico. Ambas necesitan comprender la información, pero desde responsabilidades distintas. El Diseño Industrial influye especialmente en esta dimensión: enseñar una herramienta no consiste en transferir toda su complejidad, sino en organizar el aprendizaje alrededor de las tareas y decisiones que la persona necesita realizar.

La formación completa el producto porque transforma acceso en capacidad. Sin ella, un tablero puede permanecer disponible. Con ella, puede convertirse en una práctica incorporada dentro de la organización.

## La procedencia de cada cifra

<!-- seccion: procedencia -->

Aplico una regla proveniente del gobierno de datos: cada cifra relevante debe conservar su procedencia. Si no puedo explicar de dónde proviene, cómo fue transformada y qué definición representa, todavía no está preparada para respaldar una decisión importante.

Esta regla no significa saturar cada pantalla con información técnica. La experiencia debe presentar la cifra con claridad, pero conservar mecanismos para recorrerla hasta sus fuentes, sus reglas y su contexto cuando sea necesario. En el análisis post-operacional de TransMilenio, en C&M Consultores, cada cifra de Power BI podía recorrerse hasta la fuente que la había producido —recaudo, flota y GPS, programación, novedades o PQR—, y esa era la condición para que mis informes pudieran sustentar consecuencias contractuales y económicas ante los concesionarios.

Distingo además la naturaleza de los valores publicados. Una cifra puede haber sido **medida** directamente mediante un contador o una ejecución. Puede haber sido **calculada** mediante una regla expresada. Puede haber sido **declarada** por una persona o fuente responsable. También puede ser una **estimación** construida bajo supuestos explícitos. Estas categorías no poseen el mismo nivel de certeza y no deben presentarse como si fueran equivalentes. La etiqueta permite comprender qué tipo de evidencia sostiene cada valor y qué preguntas resultan razonables antes de utilizarlo.

## La procedencia en mi vitrina y en la conversación directiva

<!-- seccion: procedencia-en-la-vitrina -->

Llevé esta regla a mi propio portafolio. Las fichas técnicas de las 32 piezas de la vitrina —6 aplicaciones, 13 agentes, 7 investigaciones y 6 tableros— declaran la procedencia de cada una de sus cifras con esas cuatro etiquetas, de manera que las afirmaciones sobre pruebas, cobertura, usuarios, rendimiento o resultados puedan relacionarse con la evidencia correspondiente. Y la aplico a esta misma hoja de vida: el «cerca de 60 %» de la Fundación CTIC va con «cerca de» porque es estimado; los 42 productos y los 20 líderes no lo llevan porque están contados.

La trazabilidad adquiere especial importancia en conversaciones directivas. Cuando una persona cuestiona un número, la respuesta no debe depender de quién tiene mayor autoridad ni de quién construyó el reporte. Debe existir una ruta verificable desde la cifra hasta el dato y la regla que la produjeron. Esto no elimina todas las discusiones. Algunas discrepancias provienen de definiciones legítimamente diferentes. En esos casos, hacer visible la procedencia ayuda a reconocer que el desacuerdo no se encuentra en la aritmética, sino en el concepto que cada persona intenta medir. Cuando la cifra puede verificarse, la conversación avanza: deja de concentrarse en si el indicador existe y puede orientarse hacia lo que revela, las condiciones que lo explican y la decisión que debe tomarse.

## La experiencia visual también determina la adopción

<!-- seccion: experiencia-visual -->

La adopción no depende únicamente de la exactitud de los datos y de la calidad del modelo. También depende de la facilidad con la que una persona puede encontrar, interpretar y utilizar la información.

Mi formación en Diseño Industrial aporta una perspectiva especialmente valiosa en este punto. Una interfaz no debe evaluarse únicamente por su apariencia, sino por la relación entre su estructura, la tarea que debe facilitar y el contexto en el que será utilizada.

En Power BI, la jerarquía visual debe responder a la jerarquía de la decisión. La información principal necesita ser visible sin obligar al usuario a recorrer todos los detalles. Las excepciones deben distinguirse del comportamiento normal. La navegación debe permitir profundizar sin perder el contexto.

Cada visualización debe justificar su presencia. Agregar gráficos porque existe espacio disponible aumenta la carga cognitiva y puede ocultar el hallazgo principal. Una solución madura selecciona la representación más adecuada para la comparación, la tendencia, la composición o la distribución que necesita comunicar. En los 6 tableros de datos abiertos de mi vitrina esa selección está documentada pieza por pieza, con sus medidas DAX contadas —62, 44 y 43 en tres de ellos— y con lo que cada tablero «nunca» afirma.

El lenguaje también importa. Los títulos, etiquetas y descripciones deben utilizar conceptos reconocibles para la audiencia y no reproducir necesariamente los nombres técnicos de las fuentes. El modelo puede ser complejo; la experiencia no debe exigir que el usuario comprenda esa complejidad para obtener valor.

La accesibilidad forma parte de esta responsabilidad. El uso del color, el contraste, la navegación y la estructura debe permitir que la información pueda interpretarse bajo diferentes condiciones. Una solución que excluye innecesariamente a parte de sus usuarios no puede considerarse completamente adoptable; en esta hoja de vida la accesibilidad se prueba automáticamente en cada cambio, y el criterio es el mismo para un tablero.

La simplicidad tampoco significa eliminar el rigor. Una interfaz clara debe permitir llegar a la evidencia cuando sea necesario. El Diseño Industrial ayuda a organizar la interacción; la arquitectura de datos y el modelo semántico garantizan que la simplificación no altere el significado. La mejor experiencia analítica no es la que muestra todo lo que el modelo puede calcular. Es la que permite que la persona comprenda qué necesita atención y encuentre el detalle suficiente para decidir.

## Medir adopción sin confundirla con visitas: seis señales

<!-- seccion: medir-adopcion -->

La adopción no puede reducirse al número de personas que abrieron un tablero. Una visita puede responder a curiosidad, una validación puntual o una instrucción recibida. Para comprender si la solución se incorporó al trabajo es necesario observar señales adicionales.

La primera señal es la **recurrencia**. Un producto adoptado aparece de manera consistente dentro de ciclos de seguimiento, reuniones o decisiones. No se consulta una sola vez; se convierte en una referencia habitual. En Cafam, el BI de control se leía en cada ciclo de pruebas del WMS, no en una demostración.

La segunda señal es la **profundidad de uso**. Los usuarios no se limitan a observar la primera página, sino que utilizan filtros, comparaciones y rutas de detalle para responder preguntas relacionadas con su responsabilidad.

La tercera señal es la **sustitución**. La solución comienza a reemplazar archivos, conciliaciones, consultas manuales o actividades de preparación que antes consumían tiempo y producían resultados inconsistentes. En la Fundación CTIC esa señal es la que se estima como cerca de un 60 % menos de esfuerzo de preparación; en Banco Pichincha, el 35 % menos de tiempo de análisis del ETL.

## Conversación, acción y resultado: las señales que valen

<!-- seccion: senales-conversacion-accion-resultado -->

La cuarta señal es la **conversación**. Las reuniones dejan de concentrarse en localizar información y pueden avanzar hacia la interpretación, las causas y las acciones. El tablero se incorpora al lenguaje operativo del equipo. Las mesas con la dirección de los concesionarios del SITP, en C&M Consultores, cambiaron cuando la conversación dejó de ser sobre de dónde salía cada cifra.

La quinta señal es la **acción**. Un indicador conduce a una revisión, una decisión, una asignación o una intervención. Este es el punto donde el uso comienza a convertirse en valor. La sexta señal es el **resultado**. Después de actuar, la organización puede observar si el indicador evolucionó, si el tiempo se redujo, si disminuyó el retrabajo o si mejoró la capacidad para responder: el +25 % en indicadores tras las mesas del SITP es una señal de esta clase.

No todos los proyectos permiten medir estas señales con el mismo nivel de precisión. Por eso, establezco desde el comienzo qué evidencia estará disponible y qué afirmaciones podrán sostenerse. Es mejor declarar una adopción parcial correctamente medida que presentar un impacto amplio sin una relación verificable con la solución; es la razón por la que C&M Consorcio 2018 no aparece en mi tabla de adopción. Esta disciplina también resulta aplicable a aplicaciones y agentes de inteligencia artificial: una solución no genera valor por el número de conversaciones o ejecuciones, sino por la capacidad que instala, el trabajo que mejora y los resultados que permite alcanzar.

## Cuando Power BI no es el instrumento adecuado

<!-- seccion: cuando-power-bi-no-es-el-instrumento -->

Mi especialidad en Power BI no implica que considere un tablero como la respuesta correcta para cualquier necesidad de información.

Power BI resulta especialmente valioso cuando la persona necesita explorar, comparar, identificar tendencias, profundizar en diferentes niveles y comprender relaciones entre indicadores. Sin embargo, algunas decisiones tienen una frecuencia, urgencia o estructura que requieren otro tipo de instrumento.

Una condición excepcional que necesita atención inmediata puede resolverse mejor mediante una alerta. Una decisión repetitiva puede requerir una aplicación que guíe la acción. Una necesidad de anticipación puede necesitar un modelo predictivo: en Banco Pichincha, la fuga, la mora y el riesgo no se atendieron con un tablero más sino con modelos con scikit-learn que llegaron a producción con más de 90 % de precisión; en TransMilenio, la demanda por franja horaria con un modelo que corrió 10 meses. Una tarea de consulta contextual puede beneficiarse de un agente con acceso a fuentes autorizadas, como los 13 agentes de mi vitrina.

Seleccionar el instrumento adecuado exige comprender cuánto tiempo conserva valor la información, qué nivel de interpretación requiere, qué consecuencias tiene la decisión y qué responsabilidad debe permanecer en la persona. Esta visión evita forzar la analítica hacia productos que los usuarios no incorporarán. También protege a Power BI de convertirse en un repositorio indiscriminado de páginas y métricas que intentan responder simultáneamente a necesidades incompatibles.

El producto correcto no es el que utiliza la tecnología en la que tengo mayor profundidad. Es el que resuelve el problema con el nivel adecuado de complejidad, control y capacidad de actuación. La escalera completa —reporte, tablero, alerta, modelo, recomendación, aplicación, agente— está ordenada en el documento sobre cómo trabajo.

## Cuando la construcción del tablero es el cuello de botella: el Constructor de Tableros Power BI

<!-- seccion: cuando-la-herramienta-estorba -->

Cuando las actividades manuales y repetitivas de construcción comienzan a limitar la velocidad, la consistencia o la capacidad de escala, la propia producción de artefactos analíticos puede convertirse en objeto de automatización.

Construí el **Constructor de Tableros Power BI**, uno de los 13 agentes de mi vitrina, y está plenamente probado: a partir de un texto de requerimientos y un proyecto con las tablas, produce el proyecto completo en formato .pbip —el modelo semántico con sus relaciones y columnas, las transformaciones en Power Query M, las medidas DAX y las visuales escritas en el JSON nativo del reporte—, e incluso puede extraer los datos. No es una demostración de páginas: es absolutamente todo el Power BI.

Su pipeline tiene seis fases —intake, diagnóstico, diseño, backend, frontend y cierre— y un reparto de responsabilidades estricto: el modelo semántico lo toca únicamente un servidor de modelado, que crea y prueba cada medida DAX antes de seguir; el reporte lo escribe una skill propia de autoría, con once referencias por tipo de visual y un validador local en dos capas. Una corrida se acepta contra 20 criterios binarios repartidos en ocho entregables, y atraviesa 5 gates de aprobación humana —diseño del modelo, ajustes visuales, refresh contra datos reales, override de alcance y publicación—, de los cuales tres se cruzan en cada corrida. Ninguna cierra sin DAX en verde, validador limpio y render aprobado por una persona en Power BI Desktop. Está sellado desde junio de 2026, con un tablero construido de extremo a extremo y 33 tableros de referencia indexados por arquetipo y audiencia.

El agente no define autónomamente la estrategia analítica ni modifica indiscriminadamente el modelo semántico. La selección de indicadores, las relaciones, las medidas, la arquitectura de información y la experiencia de decisión permanecen bajo criterios explícitos. La automatización interviene sobre actividades delimitadas y no sustituye las responsabilidades que exigen conocimiento del negocio y juicio profesional. Ninguna ejecución se considera terminada por haber generado un artefacto: el resultado debe superar validaciones estructurales y funcionales antes de incorporarse al producto. Esta condición separa una generación técnicamente posible de una contribución preparada para formar parte de una solución analítica.

## La regla para usar inteligencia artificial, y el precedente de Cafam

<!-- seccion: la-regla-para-la-ia -->

Esa distinción refleja mi regla general para utilizar inteligencia artificial. El modelo no reemplaza el criterio profesional ni se utiliza para simular tareas que pueden resolverse de forma determinista. Participa donde puede interpretar especificaciones, organizar trabajo o acelerar una actividad dentro de límites controlados. En el Constructor de Tableros Power BI, la cifra que justifica su existencia es una estimación declarada como tal: un tablero hecho a mano cuesta del orden de treinta y dos horas, y el escenario base calcula cerca de 691 horas liberadas al año si se construyen 36 tableros con un 60 % menos de esfuerzo; ninguna corrida está cronometrada todavía contra esa línea base, y la ficha lo dice.

La automatización también debe diseñarse para ser mantenible. Un sistema que produce rápidamente artefactos difíciles de comprender puede aumentar la deuda técnica del producto. El objetivo no es únicamente acelerar la construcción, sino conservar consistencia, trazabilidad y capacidad de revisión: por eso el agente entrega un proyecto en carpeta, versionable en git, y no un binario opaco.

La experiencia de Cafam reforzó tempranamente este criterio. Allí, entre octubre de 2020 y junio de 2021, utilicé Visual Basic para Aplicaciones porque era una tecnología disponible, útil y mantenible dentro del contexto de la organización: las aplicaciones VBA que integraron los procesos del centro de distribución con el WMS subieron un 15 % la automatización, redujeron un 50 % los errores de datos y siguieron corriendo después de la salida a producción. Actualmente utilizo agentes y estructuras automatizadas cuando la naturaleza del problema lo justifica. La herramienta cambia; el principio permanece.

La tecnología adecuada no es necesariamente la más nueva ni la más sofisticada. Es aquella que resuelve el problema, puede ser gobernada y deja a la organización en mejores condiciones para sostener y evolucionar la solución.

## El ciclo completo de una solución adoptada

<!-- seccion: ciclo-de-adopcion -->

Una solución de inteligencia de negocios adoptada recorre un ciclo completo. Comienza con una decisión y una audiencia. Continúa con datos confiables, definiciones compartidas y un modelo semántico capaz de preservar el significado. Se materializa en una experiencia clara y se acompaña con formación, documentación y mecanismos de soporte.

Después de publicarse, necesita observación. Debo comprender quién la utiliza, qué preguntas aparecen, qué partes generan fricción y qué nuevas necesidades surgen a partir de su uso real. En la Fundación CTIC esa observación tiene forma: 10 planes de análisis en seguimiento sobre los 42 productos, que son la manera de saber si un tablero cambió una decisión o solo se publicó.

La retroalimentación permite mejorar la experiencia, pero no debe convertirse en una acumulación indiscriminada de solicitudes. Cada cambio debe evaluarse según el propósito del producto, el valor esperado y el efecto sobre la consistencia del modelo.

También debe existir una forma de retirar aquello que ya no aporta valor. Los tableros, páginas e indicadores que han perdido su propósito no deberían permanecer indefinidamente como opciones aparentemente vigentes. El exceso de productos debilita la adopción porque fragmenta la atención y multiplica las fuentes que el usuario debe interpretar.

## Gestionar el portafolio de tableros, no solo cada tablero

<!-- seccion: portafolio-de-tableros -->

La gestión de la adopción también exige observar el portafolio completo. Una organización puede tener productos individualmente correctos y, al mismo tiempo, ofrecer una experiencia fragmentada porque diferentes tableros compiten por la atención, repiten indicadores o responden parcialmente a la misma necesidad. En ese escenario, construir una solución adicional puede aumentar la confusión en lugar de ampliar la capacidad analítica.

Por eso, antes de desarrollar un nuevo producto, evalúo si la necesidad puede resolverse ampliando un modelo semántico existente, incorporando una nueva experiencia sobre una base compartida, simplificando un reporte anterior o retirando productos que ya perdieron su propósito. La madurez analítica no se mide por la cantidad de tableros disponibles, sino por la claridad con la que cada uno ocupa una función dentro del sistema de decisiones. Con 42 productos para 15 procesos en la Fundación CTIC —23 de ellos tableros de control—, esa pregunta se hace antes de cada producto nuevo: si cabe sobre un modelo que ya existe, no nace un tablero más.

La adopción sostenible exige responsables. El equipo analítico responde por la arquitectura, la calidad y la evolución técnica. Los responsables del negocio validan las definiciones, utilizan la información y determinan las acciones. Los usuarios aportan evidencia sobre la experiencia real. Es el reparto que existía en Cafam entre el equipo de 20, los quince usuarios con cargo y la bodega.

Este ciclo convierte un reporte en un producto analítico. La diferencia no se encuentra únicamente en la tecnología, sino en la continuidad de responsabilidades que existe desde la definición del problema hasta el seguimiento de su utilización. Mi trabajo busca construir esa continuidad. No entrego pantallas para que la organización descubra después cómo utilizarlas. Diseño capacidades para que los datos puedan incorporarse de manera confiable en decisiones, rutinas y procesos.

## Lo que demuestra mi enfoque de inteligencia de negocios

<!-- seccion: lo-que-demuestra -->

Mi experiencia demuestra que la adopción no es una consecuencia accidental de construir un buen tablero. Es una condición que debe diseñarse desde la identificación del problema, sostenerse mediante datos y definiciones confiables, facilitarse mediante una experiencia comprensible y comprobarse después de la publicación.

Una solución analítica adoptada comienza con una decisión real. Necesita una arquitectura capaz de preservar el significado, un modelo semántico que implemente definiciones compartidas y una experiencia que permita a cada audiencia encontrar el nivel de información correspondiente con su responsabilidad. También necesita personas preparadas para utilizarla. La formación, el acompañamiento y la documentación convierten el acceso en capacidad. La procedencia y el gobierno convierten las cifras en evidencia. La observación del uso permite distinguir entre disponibilidad, consulta ocasional, adopción recurrente e impacto.

Mi profundidad en Power BI me permite trabajar sobre todo ese recorrido. No comienzo en la visualización ni termino en la publicación. Puedo intervenir en la preparación de los datos con Power Query, el modelado, las medidas DAX, el rendimiento, la experiencia, la formación, la automatización y la evolución posterior del producto. El DP-600, obtenido en diciembre de 2024, certifica esa profundidad de extremo a extremo en Microsoft Fabric, que en Vesting fue la plataforma completa; los 6 tableros de datos abiertos de mi vitrina, en cambio, están hechos con Power BI Desktop, Power Query, DAX y Python, sin Fabric, porque para datos públicos no hacía falta más. Y Power BI no es la única herramienta que manejo: Shiny con R, Tableau y Looker Studio figuran entre mis skills, aunque la especialidad es una.

## El instrumento correcto y el rol que busco en BI y analítica

<!-- seccion: el-rol-en-bi-y-analitica -->

También sé reconocer cuándo Power BI no es la respuesta adecuada. Algunas necesidades requieren una alerta, una aplicación, una predicción o un agente. La especialidad no consiste en utilizar siempre la misma herramienta, sino en seleccionar el instrumento correcto sin perder la coherencia de los datos, las definiciones y el gobierno.

Cuando la construcción manual se convierte en una restricción, puedo automatizar parte del proceso. Cuando la falta de conocimiento limita la adopción, incorporo formación. Cuando existen discrepancias, regreso a las definiciones y a la procedencia. Cuando un producto deja de aportar valor, debe simplificarse, integrarse o retirarse. Esa es la idea central de mi práctica en inteligencia de negocios, y uno de los cuatro tipos de rol que busco —liderazgo en BI y analítica, el del DP-600— es exactamente este: no construyo tableros para demostrar cuánta información puede presentarse. Construyo capacidades analíticas para que las personas puedan comprender una situación, sostener una conversación sobre evidencia y tomar decisiones con mayor claridad. El tablero es la parte visible. El verdadero producto es la capacidad organizacional que permanece cuando la pantalla deja de ser el centro de la conversación.
