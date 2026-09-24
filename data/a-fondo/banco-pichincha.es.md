---
slug: banco-pichincha
codigo: AF-08
titulo: "Banco Pichincha — BI que el negocio sí usa (2023)"
resumen: "Cinco meses en banca: dashboards adoptados por 50+ usuarios (+25 % en decisiones), ETL −35 %, modelos de fuga, mora y riesgo en producción con scikit-learn (>90 %), un equipo de 5, 12 profesionales formados y el gobierno de datos co-liderado."
cuando_usar: "Úsalo cuando pregunten por Banco Pichincha (2023): sector financiero, modelos de fuga, mora y riesgo en producción, modelos semánticos y DAX, adopción de BI por más de 50 usuarios, gobierno de datos co-liderado y el programa de formación de analistas."
estado: aprobado
ancla: "/proyectos/banco-pichincha"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué hizo Henry en Banco Pichincha?"
  - "¿Cómo logra que el negocio use los tableros?"
  - "¿Ha llevado un modelo de machine learning a producción?"
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
Cómo lograste la adopción (el problema difícil de BI), qué hiciste
distinto con los dashboards, el programa de formación, los modelos
predictivos en producción. -->

## El problema real no era solo técnico

<!-- seccion: el-problema-real -->

Ingresé a Banco Pichincha en marzo de 2023 como Analista Senior de Analítica y Reportes y permanecí en la organización hasta julio del mismo año. Fueron cinco meses, y fue mi paso por el sector financiero: en banca el dato tiene dueño, regulación y consecuencia, y eso cambia cómo se construye todo. Los meses anteriores los había dedicado a estudiar y certificarme, de modo que llegué con las certificaciones de IBM en ciencia de datos recién obtenidas y con ganas de aplicarlas en un entorno exigente.

Aunque fue una experiencia concentrada en el tiempo, representó un punto decisivo en mi trayectoria porque me permitió integrar aprendizajes acumulados en procesos, datos, automatización, inteligencia de negocios y comunicación ejecutiva dentro de un entorno financiero en el que la calidad y la confiabilidad de la información tenían una importancia especialmente alta.

El área de analítica y reportes producía tableros que el negocio no terminaba de adoptar, con procesos ETL lentos y modelos predictivos que no llegaban a producción. Allí confirmé que el principal desafío de la analítica no siempre es tecnológico. Una organización puede contar con herramientas avanzadas, profesionales competentes y grandes volúmenes de información y, aun así, tener dificultades para convertirlos en decisiones consistentes. El problema aparece cuando los datos, las métricas, los productos analíticos y las responsabilidades del negocio evolucionan de manera separada.

Trabajé con un equipo de cinco personas a cargo, dentro del área de analítica y reportes del banco. Con ese equipo, en cinco meses, salieron los dashboards, la optimización del ETL, los modelos predictivos y el programa de formación que describo en este documento.

## La distancia entre el dato y la decisión

<!-- seccion: la-distancia-entre-dato-y-decision -->

Un tablero técnicamente correcto pierde valor cuando no responde a una decisión concreta. Una métrica genera desconfianza cuando diferentes áreas la interpretan de manera distinta. Un modelo predictivo permanece como un ejercicio técnico cuando no existe un proceso preparado para utilizar sus resultados. La solución en Banco Pichincha no consistía, por tanto, en producir más reportes o incorporar más tecnología, sino en fortalecer la arquitectura que conecta la información con las decisiones y las acciones del negocio.

Mi trabajo se orientó a reducir esa distancia. Esto implicaba comprender qué decisiones necesitaban ser respaldadas, qué información requerían, quién debía responder por sus definiciones y cómo debían estructurarse los productos analíticos para integrarse en las rutinas reales de la organización. La analítica debía dejar de funcionar como una entrega aislada y convertirse en una capacidad empresarial.

En banca esa distancia tiene un costo visible. Una cartera que se sigue con dos definiciones distintas de mora produce dos cifras distintas en dos comités; un modelo de fuga que no llega al equipo comercial es una probabilidad que nadie convierte en una llamada. Reducir la distancia significaba, en la práctica, que cada producto analítico tuviera una decisión identificable al otro lado.

## Cada solución como una cadena completa

<!-- seccion: la-cadena-completa -->

En ese contexto, comencé a observar cada solución como una cadena completa. Los datos debían prepararse mediante transformaciones confiables en Power Query; las métricas necesitaban definiciones consistentes; los modelos semánticos debían organizar el significado de la información; las medidas en DAX debían ser verificables; los tableros tenían que responder a preguntas relevantes; y los usuarios debían contar con el conocimiento necesario para interpretar los resultados y actuar sobre ellos.

Los procesos del negocio que esos productos iban a servir los modelé en BPMN con Bizagi antes de tocar los datos, porque un tablero sobre un proceso que nadie ha dibujado responde preguntas que nadie hizo. El modelado me permitió situar cada producto analítico dentro de las actividades reales: en qué punto del proceso se toma la decisión, quién la toma y con qué anticipación necesita la información.

Esta experiencia consolidó una idea que después se volvería central en mi trabajo con aplicaciones y agentes de inteligencia artificial: la sofisticación de una solución no determina por sí sola su valor. Lo importante es la función que cumple dentro de una decisión, el grado de confianza que puede sostener y la claridad con la que distribuye responsabilidades entre las personas y la tecnología.

## La adopción, medida

<!-- seccion: la-adopcion-medida -->

Lideré al equipo de inteligencia de negocios —cinco personas a cargo— en el desarrollo y fortalecimiento de dashboards en Power BI que llegaron a ser utilizados por más de 50 usuarios del negocio. El objetivo no era incrementar el número de reportes disponibles, sino conseguir que los productos analíticos se incorporaran de manera efectiva en los procesos de seguimiento y toma de decisiones.

Esta experiencia confirmó que la publicación de un tablero no constituye el final de un proyecto analítico. Una solución comienza a producir valor cuando las personas comprenden qué pregunta responde, confían en sus métricas y la utilizan de manera recurrente para orientar una acción. La adopción no podía medirse únicamente por el acceso a la herramienta, sino por la forma en que modificaba la preparación, la discusión y el seguimiento de las decisiones.

Los resultados reportados mostraron una mejora del 25 % en la toma de decisiones asociada con los productos analíticos. Más allá de la cifra, el aprendizaje principal fue que esa mejora no dependía únicamente de una visualización más clara. Surgía de la combinación entre datos confiables, métricas comprensibles, modelos consistentes, acompañamiento a los usuarios y una relación explícita entre el indicador y la decisión.

El producto analítico dejó así de entenderse como un repositorio de información y comenzó a funcionar como un servicio para la organización. Su valor no estaba en la cantidad de elementos que mostraba, sino en su capacidad para reducir incertidumbre, organizar una conversación y facilitar una actuación oportuna. Cómo se mide esa adopción, y por qué no son visitas, está en el documento de BI que se adopta.

## Diseñar desde la decisión: síntesis ejecutiva y trazabilidad

<!-- seccion: diseno-desde-la-decision -->

En Banco Pichincha el diseño de cada dashboard partía de las necesidades de los usuarios y no exclusivamente de los datos disponibles. Antes de desarrollar una visualización, era necesario comprender qué situación necesitaba observarse, qué decisión podía tomarse, qué nivel de detalle requería cada responsable, con qué frecuencia y qué información debía permanecer disponible para explicar una desviación.

Cada solución debía ofrecer una ruta comprensible desde la visión general hasta la evidencia que sustentaba el resultado. Los responsables necesitaban reconocer rápidamente las condiciones relevantes, pero también debían poder profundizar cuando una cifra requería explicación. Esta combinación entre síntesis ejecutiva y trazabilidad analítica fortalecía la confianza y reducía la dependencia permanente del equipo técnico: un gerente que puede llegar por sí mismo desde el indicador de cartera hasta las operaciones que lo componen no necesita pedirle al equipo de BI que se lo explique.

Esa ruta, del agregado al detalle, se construía en el modelo semántico, no en la página del tablero: dimensiones compartidas, jerarquías comprensibles y medidas en DAX que se comportaban igual en cualquier nivel de la jerarquía. La página solo hacía visible una estructura que ya existía debajo.

## Consistencia: una sola definición por concepto

<!-- seccion: consistencia-de-definiciones -->

La adopción también requería consistencia. Cuando diferentes tableros utilizan cálculos o definiciones distintas para representar un mismo concepto, el usuario termina comparando herramientas en lugar de analizar la realidad. Por esta razón, una parte importante del trabajo consistió en fortalecer modelos y medidas reutilizables que permitieran conservar una interpretación común de la información en los más de 50 usuarios que la consumían.

Una medida definida una vez en el modelo semántico y usada por todos los tableros es la forma técnica de una decisión de negocio: que la mora o la fuga se calculan de una sola manera. Cuando esa definición cambia, cambia en un sitio y todos los productos la heredan; cuando cada reporte la reconstruye, cada reporte es una oportunidad de discrepancia.

Esa consistencia fue, además, el punto donde el trabajo de BI se encontró con el gobierno de datos: una definición compartida necesita un responsable que la apruebe y un lugar donde se documente, y eso ya no es un problema de Power BI sino de la organización.

## Elegir el instrumento adecuado para cada decisión

<!-- seccion: elegir-el-instrumento -->

Esta experiencia también me llevó a cuestionar la tendencia a resolver todas las necesidades de información mediante tableros. Power BI era una capacidad central dentro del ecosistema analítico del banco, pero no todas las decisiones requerían exploración visual ni todas podían esperar a que una persona ingresara a consultar un reporte. El instrumento debía seleccionarse según la naturaleza de la decisión, su frecuencia, el tiempo disponible para actuar, el nivel de incertidumbre y las consecuencias de una respuesta equivocada.

Algunas necesidades se resolvían adecuadamente mediante indicadores periódicos o tableros exploratorios. Otras requerían alertas que dirigieran la atención hacia una condición específica, predicciones que permitieran anticipar un comportamiento —la fuga de un cliente, la mora de una obligación— o aplicaciones que estructuraran la intervención posterior. La pregunta dejó de ser qué tablero debíamos construir y pasó a ser qué capacidad necesitaba realmente la persona para tomar o ejecutar una mejor decisión.

Comencé así a organizar los instrumentos según el nivel de agencia que la organización les asignaba. Un reporte documenta. Un tablero permite explorar. Una alerta prioriza la atención. Un modelo predictivo anticipa una condición. Una recomendación propone una alternativa. Una aplicación guía la ejecución. Un agente de inteligencia artificial puede consultar información, utilizar herramientas y realizar determinadas acciones dentro de límites definidos.

Esta progresión no implica que el instrumento con mayor autonomía sea necesariamente el más valioso. Cuanto más cerca se encuentra una solución de intervenir en la operación, mayores deben ser la calidad de sus datos, la claridad de sus reglas, la trazabilidad de sus resultados y la supervisión de sus acciones. El diseño correcto consiste en distribuir conscientemente la responsabilidad entre las personas y la tecnología, no en maximizar la automatización.

Esta comprensión fue uno de los principales puentes entre mi experiencia en inteligencia de negocios y mi evolución posterior hacia aplicaciones y agentes de IA. Power BI me permitió construir una capa confiable de interpretación y decisión; la inteligencia artificial ampliaría después esa capacidad hacia la generación de recomendaciones, la coordinación de herramientas y la ejecución controlada de determinadas tareas.

## El programa de formación

<!-- seccion: programa-de-formacion -->

Para fortalecer la adopción diseñé y desarrollé un programa de formación dirigido a 12 profesionales del banco. El propósito no era enseñar funciones aisladas de una herramienta, sino ampliar la capacidad interna para preparar información, construir análisis confiables, interpretar métricas y comunicar resultados con mayor autonomía.

La formación se organizó alrededor de situaciones cercanas al trabajo de los participantes. En lugar de presentar Power BI como un conjunto de funcionalidades, abordé el recorrido completo de una solución analítica: preparación de datos, modelado, definición de medidas, construcción de visualizaciones e interpretación de resultados. Esto permitió relacionar cada conocimiento técnico con una necesidad concreta del negocio: quien seguía una cartera aprendía sobre los datos de esa cartera, no sobre un conjunto de ejemplo.

El programa se diseñó junto con los dashboards y no después de ellos. Formar a las personas que iban a usar y mantener los productos era parte del entregable: un tablero adoptado por más de 50 usuarios necesita, dentro del negocio, gente capaz de entender su modelo, cuestionar una medida y proponer la siguiente pregunta sin volver a depender del equipo de BI.

## Los contenidos: Power Query, modelado semántico, DAX y comunicación

<!-- seccion: contenidos-de-la-formacion -->

Uno de los componentes principales fue Power Query, utilizado para estructurar transformaciones más claras, reducir actividades manuales y establecer una preparación reproducible de la información. El propósito no era únicamente aprender a limpiar datos, sino comprender que cada transformación modifica el significado y la confiabilidad de lo que posteriormente será analizado.

Otro componente fue el modelado semántico. Los participantes debían reconocer las entidades del negocio, organizar adecuadamente sus relaciones y evitar que cada reporte reprodujera por separado la misma lógica. Esta perspectiva permitía entender que el modelo no era una estructura técnica oculta detrás del tablero, sino el lugar donde la organización definía cómo interpretar su información.

El trabajo con DAX se orientó a la construcción de medidas comprensibles, reutilizables y adecuadas para el contexto de análisis. Más que acumular fórmulas complejas, busqué fortalecer la capacidad para razonar sobre filtros, relaciones, temporalidad y comportamiento de las métricas. Una medida debía ser técnicamente correcta, pero también suficientemente clara para ser validada y mantenida.

La formación incluyó además criterios de visualización y comunicación ejecutiva. Los 12 participantes aprendieron a organizar la información alrededor de una pregunta, diferenciar entre contexto y evidencia principal, y convertir un hallazgo en una conclusión comprensible para personas con distintos niveles de conocimiento técnico.

## Acompañamiento y capacidad instalada: +20 % de productividad

<!-- seccion: capacidad-instalada -->

El acompañamiento fue tan importante como el contenido. Los conceptos se aplicaron a situaciones reales y los participantes pudieron revisar productos vinculados con sus responsabilidades. Esto ayudó a trasladar el aprendizaje desde el ejercicio formativo hacia la práctica cotidiana: la sesión terminaba con un cambio en un modelo o una medida que la persona iba a usar al día siguiente.

El programa contribuyó a una mejora del 20 % en la productividad de los participantes en la preparación y el uso de la información. El resultado más importante, sin embargo, fue la capacidad instalada. La organización no solo recibió nuevos productos analíticos; fortaleció personas capaces de comprenderlos, cuestionarlos, mantenerlos y continuar desarrollándolos después de mi salida en julio de 2023.

Esta experiencia reforzó mi convicción de que la democratización de los datos no consiste simplemente en ampliar el acceso a una herramienta. Requiere elevar el criterio con el que las personas preparan, interpretan y comunican la información. La autonomía sin estándares puede multiplicar inconsistencias; la autonomía acompañada de modelos, prácticas y definiciones compartidas puede multiplicar el valor.

## El autoservicio analítico necesita límites y responsabilidades

<!-- seccion: autoservicio-con-limites -->

Esta experiencia en Banco Pichincha también me enseñó que el autoservicio analítico necesita límites y responsabilidades. Ampliar la capacidad de los usuarios no significa que cada persona deba redefinir individualmente las métricas o reconstruir la lógica del negocio en cada reporte. La autonomía genera mayor valor cuando opera sobre fuentes confiables, modelos semánticos compartidos y definiciones gobernadas. El propósito era descentralizar la exploración y la creación de conocimiento sin fragmentar el significado de la información.

En la práctica, eso fijaba una frontera clara: el modelo semántico y las medidas centrales en DAX eran responsabilidad del equipo de BI y del gobierno de datos; sobre ellos, los 12 profesionales formados podían construir sus propios análisis, páginas y preguntas. Explorar era libre; redefinir qué es la mora, no.

Esa frontera es la misma que hoy aplico a los agentes de inteligencia artificial: la capacidad se amplía, las definiciones y las fuentes autorizadas se gobiernan.

## El ETL y la preparación de los datos con Power Query

<!-- seccion: el-etl-y-la-preparacion -->

Trabajé en la optimización de los procesos ETL de preparación de información utilizados por las soluciones de Power BI, construidos con Power Query. Las mejoras aplicadas contribuyeron a reducir aproximadamente un 35 % los tiempos de análisis, fortaleciendo al mismo tiempo la estabilidad y mantenibilidad de las transformaciones.

El objetivo no era hacer más complejos los procesos, sino organizarlos mejor. Estructuré las consultas de manera que fuera posible diferenciar la conexión con las fuentes, la preparación de la información y la construcción de las tablas destinadas al modelo. Esta separación facilitaba la comprensión del flujo y evitaba repetir transformaciones en diferentes componentes.

Esta experiencia profundizó mi comprensión de Power Query como una parte integral del pipeline analítico. La calidad de un reporte depende de las decisiones tomadas durante la preparación de los datos, y cada paso debe conservar una relación clara con el proceso y la regla de negocio que representa. Lo que en TransMilenio había resuelto con un ETL propio sobre cinco fuentes, aquí se resolvía dentro de la herramienta, con la misma lógica: reglas explícitas, reproducibles y con dueño.

## Cómo se estructuraron las consultas

<!-- seccion: como-se-estructuraron-las-consultas -->

En la optimización del ETL de Banco Pichincha prioricé la selección temprana de filas y columnas necesarias, la definición consistente de los tipos de datos y la reutilización de lógica cuando varias consultas requerían operaciones similares. Cuando las fuentes lo permitían, procuraba que las transformaciones fueran ejecutadas lo más cerca posible de su origen —plegadas hacia la base de datos— para evitar trasladar volúmenes innecesarios hacia Power BI.

La optimización no se limitaba al rendimiento. Una consulta más rápida pero difícil de interpretar podía convertirse posteriormente en deuda técnica. Por eso, busqué que los pasos conservaran una secuencia lógica, nombres comprensibles y una estructura que permitiera identificar dónde se producía cada transformación.

También incorporé validaciones para detectar valores faltantes, tipos inesperados, duplicidades y otras condiciones que podían afectar el resultado. Estas revisiones permitían hacer visibles las excepciones antes de que llegaran al modelo semántico y terminaran representadas como indicadores aparentemente correctos. El 35 % de reducción en los tiempos de análisis salió de estas decisiones de estructura, no de un truco de rendimiento.

## El modelo semántico como activo empresarial

<!-- seccion: modelos-semanticos -->

Una parte central de mi trabajo se concentró en fortalecer y optimizar los modelos semánticos que sustentaban las soluciones de Power BI. Comprendí que el verdadero potencial de la plataforma no estaba en producir numerosos archivos independientes, sino en construir una capa de significado reutilizable que permitiera desarrollar diferentes experiencias analíticas sobre definiciones comunes.

Organicé relaciones, dimensiones, tablas de hechos y medidas para facilitar la interpretación de la información y reducir la duplicación de lógica. También promoví convenciones consistentes para nombrar objetos y agrupar medidas, de manera que el modelo pudiera ser comprendido y mantenido por personas diferentes de quien lo había construido originalmente.

La centralización de las medidas en DAX permitía que una misma definición pudiera utilizarse en distintos análisis sin necesidad de reconstruirla. Esto reducía las discrepancias entre reportes y facilitaba la evolución de las soluciones, porque un cambio controlado en la lógica podía reflejarse de manera consistente en los productos que dependían de ella.

Esta visión convirtió el mantenimiento en parte del diseño. Una solución empresarial no debe evaluarse exclusivamente por su funcionamiento actual, sino también por la facilidad con la que otra persona puede comprenderla, validarla y modificarla. La sostenibilidad del modelo dependía tanto de su desempeño como de la claridad de su arquitectura. Cómo se modela y se optimiza, con el detalle técnico, está en el documento de Fabric en la práctica.

## La deuda técnica de un modelo que crece sin principios

<!-- seccion: deuda-tecnica-del-modelo -->

También comprendí en Banco Pichincha que un modelo semántico acumula deuda técnica cuando crece sin principios comunes. La duplicación de medidas, las relaciones ambiguas, los cálculos innecesariamente complejos y los nombres poco descriptivos no siempre producen una falla inmediata, pero hacen que cada cambio posterior sea más riesgoso y costoso.

Por eso, la optimización debía acompañarse de disciplina de diseño: simplificar donde fuera posible, reutilizar lógica, documentar decisiones relevantes y mantener una estructura que pudiera evolucionar sin depender permanentemente de su autor. Un modelo que solo entiende quien lo hizo es un riesgo operativo del banco, no una preferencia de estilo.

Esta disciplina se sostenía con dos herramientas —DAX Studio y Tabular Editor— y con una pregunta antes de cada medida nueva: si ya existía una que hiciera lo mismo con otro nombre.

## La optimización con DAX Studio y Tabular Editor

<!-- seccion: dax-studio-y-tabular-editor -->

Utilicé DAX Studio para analizar el comportamiento de consultas y medidas, identificar cálculos costosos y establecer comparaciones antes y después de determinados ajustes. El propósito no era optimizar por optimizar, sino asegurar que el crecimiento funcional de los tableros no deteriorara progresivamente la experiencia de los usuarios: una medida que tarda segundos en responder en un tablero con más de 50 usuarios se convierte en una razón para dejar de abrirlo.

También utilicé Tabular Editor para fortalecer la organización y mantenibilidad de los modelos, revisar propiedades, administrar medidas y aplicar prácticas consistentes sobre sus objetos. Estas herramientas me permitieron trabajar sobre Power BI con una perspectiva más cercana a la ingeniería de modelos que a la creación aislada de reportes.

La optimización técnica tenía una consecuencia directa sobre la adopción. Un modelo lento, ambiguo o difícil de mantener debilita la confianza y aumenta la dependencia del equipo que lo creó. En contraste, una solución rápida, consistente y comprensible facilita la exploración y permite que el usuario concentre su atención en la decisión.

Esta etapa profundizó una de las capacidades que hoy distingue mi perfil: la especialidad en Power BI entendida de extremo a extremo. Esto comprende la preparación de datos en Power Query, el diseño del modelo semántico, la ingeniería de medidas en DAX, la optimización, la experiencia de uso y la relación entre el producto analítico y la decisión empresarial.

## Los modelos predictivos: fuga, mora y riesgo en producción

<!-- seccion: modelos-predictivos -->

Entrené y llevé a producción, con scikit-learn, modelos de machine learning orientados a anticipar comportamientos relevantes para el banco: la fuga de clientes —qué cliente puede irse—, la mora —qué obligación puede dejar de pagarse— y el riesgo —qué operación lo concentra—. Son las tres preguntas que cualquier banco se hace; lo que cambia es la calidad de los datos y del proceso con que se responden. Esta experiencia amplió el alcance de la analítica desde la descripción de resultados históricos hacia la estimación de posibles escenarios futuros.

El trabajo con estos modelos reforzó un aprendizaje que había comenzado en el sector transporte con la predicción de demanda: la calidad técnica de una predicción no garantiza por sí sola su valor empresarial. El resultado debe corresponder con una decisión concreta, llegar dentro del tiempo disponible para actuar y ser suficientemente comprensible para que los responsables sepan cómo utilizarlo.

El desarrollo exigía preparar variables consistentes, seleccionar información históricamente disponible y evitar que el modelo incorporara datos que no existirían al momento de producir una predicción real: un modelo de mora que usa información posterior al impago es perfecto en el laboratorio e inútil en operación. También era necesario evaluar su desempeño más allá de una cifra general, observando si el comportamiento permanecía estable entre diferentes segmentos y condiciones.

Los resultados reportados superaron el 90 % de precisión y mejoraron hasta en un 35 % las predicciones frente a lo que existía antes. Estas cifras deben interpretarse dentro de las métricas, poblaciones y horizontes de cada caso, sin presentar una única medida como evidencia suficiente del valor de todos los modelos.

## Evaluar un modelo por sus errores y por lo que cuesta cada error

<!-- seccion: evaluar-por-errores -->

La evaluación de los modelos de Banco Pichincha debía distinguir entre desempeño estadístico y utilidad operacional. Una métrica global elevada podía ocultar resultados débiles en segmentos relevantes, clases minoritarias o situaciones especialmente costosas para el negocio. Por eso, el análisis no debía limitarse a preguntar cuántas predicciones eran correctas, sino también dónde se concentraban los errores, qué consecuencias tenían y si el modelo aportaba una mejora real frente a la forma de decisión existente.

También era necesario analizar el costo relativo de los diferentes errores. No siempre tiene la misma consecuencia intervenir sobre un caso que finalmente no lo requería que dejar de identificar uno realmente relevante: llamar a un cliente que no iba a irse cuesta una llamada; no llamar al que sí se va cuesta el cliente. La selección de umbrales y criterios de uso debía responder al propósito empresarial, a la capacidad disponible para actuar y al nivel de riesgo que la organización estaba preparada para asumir.

En banca una métrica global esconde el error donde más cuesta, y por eso la evaluación por segmentos no era un refinamiento sino una condición para llevar el modelo a producción. Cómo se evalúan los errores y cómo se sostiene un modelo en producción, con este caso y el del SITP comparados, está en el documento de analítica predictiva.

## De la predicción a la decisión: la integración con Power BI

<!-- seccion: prediccion-en-power-bi -->

La integración del resultado de los modelos con Power BI permitía acercar las predicciones a los usuarios responsables de interpretarlas. Sin embargo, una probabilidad o una clasificación no debía presentarse como una decisión automática. Era necesario acompañarla con contexto —el historial del cliente, la evolución de la obligación, el segmento— criterios de interpretación y una comprensión clara de sus limitaciones.

Esta experiencia creó un puente entre la inteligencia de negocios y la inteligencia artificial. El modelo predictivo generaba una señal; el producto analítico la integraba con información histórica y contextual; y la persona responsable evaluaba cómo debía incorporarse a la decisión. La confiabilidad surgía de la relación entre estas capacidades, no del algoritmo considerado de manera aislada.

También fortaleció una convicción que actualmente aplico en el diseño de aplicaciones y agentes de IA: una solución inteligente necesita ser evaluable. Debe ser posible comprender qué información utiliza, qué resultado produce, bajo qué condiciones puede fallar y cuándo corresponde mantener la intervención humana.

Este aprendizaje amplió mi forma de evaluar soluciones de inteligencia artificial. La pregunta no es únicamente si un modelo funciona, sino para quién funciona, bajo qué condiciones, con qué tipo de error y dentro de qué proceso será utilizado. La evaluación técnica proporciona evidencia sobre el comportamiento; el contexto empresarial determina si ese comportamiento es suficientemente confiable para respaldar una decisión. Los modelos de fuga, mora y riesgo de 2023 fueron mi primera aplicación completa de esa pregunta en banca.

## El gobierno de datos

<!-- seccion: gobierno-de-datos -->

Co-lideré en Banco Pichincha una iniciativa de gobierno de datos orientada a fortalecer la seguridad, la calidad y la confiabilidad de la información. Mantengo deliberadamente la expresión co-lideré porque el gobierno no puede construirse como una iniciativa individual ni ser responsabilidad exclusiva del equipo de analítica. Requiere la participación de las áreas que producen, administran, protegen y utilizan los datos.

Mi contribución se concentró en conectar las necesidades analíticas con prácticas que permitieran utilizar la información de manera más consistente. Esto implicaba promover definiciones compartidas, identificar responsabilidades sobre los datos, fortalecer criterios de calidad y contribuir a que los productos analíticos conservaran mayor trazabilidad sobre sus fuentes y transformaciones.

En banca el gobierno no es opcional: la información es crítica, regulada y con consecuencia directa sobre clientes. Eso hacía que las definiciones compartidas de los tableros, las validaciones del ETL y la trazabilidad de los modelos predictivos fueran, a la vez, buenas prácticas de BI y controles de gobierno. Las tres experiencias de gobierno de mi trayectoria —banca, una startup de agentes y el sector salud— están comparadas en el documento de gobierno de datos y de IA.

## El gobierno en la práctica: definiciones, responsables y accesos

<!-- seccion: gobierno-en-la-practica -->

El gobierno de datos adquirió en Banco Pichincha un sentido práctico. Una métrica necesitaba una definición comprensible y una responsabilidad identificable. Un conjunto de datos debía contar con criterios mínimos para evaluar si estaba preparado para determinado uso. Los accesos debían corresponder con la necesidad y responsabilidad de cada usuario, definidos por propósito y no por conveniencia. Los cambios en las reglas del negocio tenían que reflejarse de forma controlada en los modelos que dependían de ellas.

La calidad tampoco podía reducirse a verificar que una columna tuviera el formato correcto. Debía evaluarse en relación con el propósito. Un dato podía ser válido desde el punto de vista técnico y, al mismo tiempo, resultar incompleto, desactualizado o insuficiente para una decisión determinada. Gobernar exigía comprender cómo se producía la información y qué consecuencias podía generar su utilización.

Esta etapa me enseñó que la seguridad y la usabilidad no deben plantearse como objetivos incompatibles. El propósito del gobierno no es bloquear el acceso indiscriminadamente, sino permitir que la información correcta llegue a las personas adecuadas, bajo condiciones comprensibles, controladas y trazables.

También comprendí que la documentación solo aporta valor cuando se integra a la operación. Una definición que nadie consulta o una responsabilidad que nadie reconoce no constituyen gobierno efectivo. Las prácticas debían ser suficientemente rigurosas para proteger la información y suficientemente aplicables para formar parte del trabajo cotidiano de los más de 50 usuarios de los tableros.

## Gobernar el ciclo de vida completo de los productos analíticos

<!-- seccion: gobernar-el-ciclo-de-vida -->

También comprendí en Banco Pichincha que el gobierno debe acompañar el ciclo de vida completo de los productos analíticos. Una métrica puede cambiar cuando evoluciona el negocio, una fuente puede perder calidad y un modelo de fuga o de mora puede dejar de representar adecuadamente la realidad para la que fue diseñado. Por eso, publicar no debía significar abandonar: las soluciones necesitaban responsables, revisiones y criterios para actualizarse, corregirse o retirarse cuando dejaran de cumplir su propósito.

Esta idea se volvería todavía más importante en mi trabajo posterior con inteligencia artificial. Las aplicaciones y los agentes no solo deben aprobarse antes de entrar en operación; deben permanecer observables, evaluables y sujetos a mejora durante todo su ciclo de vida. Gobernar significa conservar la capacidad de intervenir cuando cambian los datos, el contexto, los riesgos o las necesidades de la organización.

Este aprendizaje se convirtió posteriormente en una base esencial para mi trabajo con inteligencia artificial. Los modelos, aplicaciones y agentes necesitan fuentes autorizadas, responsables identificados, controles de acceso, criterios de evaluación y trazabilidad sobre los resultados que producen. La inteligencia artificial no reemplaza el gobierno de los datos; hace todavía más evidente su necesidad.

## Los resultados de Banco Pichincha en cifras

<!-- seccion: resultados-en-cifras -->

Cinco meses, un equipo de cinco personas y las cifras que publica mi hoja de vida y el case study del sitio:

| Frente                                   | Resultado                                                    | Qué hay detrás                                                             |
| ---------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Dashboards orientados a decisión         | 50+ usuarios · +25 % en toma de decisiones                   | diseño desde la decisión, una definición por concepto, ruta del agregado al detalle |
| Optimización del ETL en Power Query      | −35 % en tiempos de análisis                                 | consultas separadas por función, selección temprana, validaciones antes del modelo |
| Modelos predictivos con scikit-learn     | >90 % de precisión · +35 % en predicciones · en producción   | fuga, mora y riesgo; variables disponibles al predecir; evaluación por segmentos |
| Modelos semánticos                       | optimizados con DAX Studio y Tabular Editor                  | medidas centralizadas, convenciones, deuda técnica bajo control            |
| Programa de formación                    | 12 profesionales · +20 % de productividad en la preparación y uso de la información | Power Query, modelado, DAX, comunicación, acompañamiento sobre productos reales |
| Gobierno de datos                        | co-liderado                                                  | definiciones compartidas, responsables por conjunto de datos, accesos por propósito |

Todo entre marzo y julio de 2023, en Banco Pichincha.

## Lo que Banco Pichincha consolidó

<!-- seccion: lo-que-pichincha-consolido -->

Vista en retrospectiva, Banco Pichincha fue la experiencia en la que consolidé mi profundidad en inteligencia de negocios y la amplié hacia una visión más completa de plataforma analítica. Allí convergieron la preparación de datos, los modelos semánticos, la ingeniería de medidas, la optimización, la formación de usuarios, la adopción, los modelos predictivos y el gobierno de la información.

La principal evolución no consistió en aprender una nueva herramienta, sino en comprender cómo todas estas capacidades debían funcionar juntas. Power Query estructuraba la preparación. El modelo semántico organizaba el significado. DAX convertía las definiciones en métricas verificables. Power BI acercaba la información a la decisión. La formación fortalecía la autonomía. El gobierno protegía la confianza. Los modelos predictivos ampliaban la conversación desde lo ocurrido hacia lo que podía suceder.

Banco Pichincha se convirtió así en el puente entre mi experiencia en analítica empresarial y mi evolución posterior hacia soluciones y agentes de inteligencia artificial. Llegué con experiencia integrando fuentes, automatizando procesos y desarrollando productos analíticos. Salí con una comprensión más profunda del modelo semántico, la adopción, el gobierno y la relación entre información, predicción, decisión y acción.

La experiencia fue breve en duración —cinco meses—, pero concentrada en aprendizaje y consolidación. Me permitió pasar de construir soluciones analíticas efectivas a comprender las condiciones necesarias para que esas soluciones puedan convertirse en capacidades empresariales confiables, reutilizables y sostenibles. Un mes después de salir del banco, en agosto de 2023, empezaba en Vesting a construir la plataforma de datos de una startup de agentes.

## El nivel de agencia que una organización transfiere a sus soluciones

<!-- seccion: nivel-de-agencia -->

Esta experiencia también me permitió reconocer que cada decisión requiere un instrumento diferente. Algunas necesitan una tabla o un informe periódico. Otras requieren un tablero exploratorio, una alerta, una predicción o una recomendación. La alternativa correcta no es aquella que utiliza la tecnología más avanzada, sino la que ofrece el grado apropiado de información, oportunidad y capacidad de actuación.

Allí comenzó a consolidarse mi interés por el nivel de agencia que una organización transfiere a sus soluciones. Un tablero hace visible una situación, pero conserva la interpretación y la acción en la persona. Una alerta dirige la atención. Una predicción anticipa una posibilidad. Una recomendación propone un camino. Una aplicación guía la ejecución. Un agente de IA puede utilizar conocimiento y herramientas para realizar determinadas acciones. Cada avance exige mayor evaluación, trazabilidad, control y claridad sobre la responsabilidad.

En Banco Pichincha los instrumentos llegaron hasta la predicción: los modelos de fuga, mora y riesgo anticipaban, y la persona decidía. Los escalones siguientes —la recomendación, la aplicación, el agente— vendrían después, con Vesting y con mis propias aplicaciones y agentes; pero la escala con la que los juzgo se fijó en el banco, en 2023.
