---
slug: procesos-y-simulacion
titulo: "Procesos y simulación"
resumen: "La raíz industrial con sus métodos: BPMN con Bizagi en cuatro empresas, simulación de eventos discretos con FlexSim en Inglopres y el despacho de medicamentos de Cafam, capacidad nominal frente a efectiva, estudio de tiempos con suplementos OIT, Kanban y Scrum, ISO 9001, y el proceso replicable de Vesting."
cuando_usar: "Úsalo cuando pregunten por su raíz de ingeniería industrial: modelado de procesos en BPMN con Bizagi, simulación de eventos discretos con FlexSim, estudio de tiempos y balanceo de líneas, capacidad y variabilidad, ISO 9001:2015, mejora continua, metodologías ágiles y para qué sirve todo eso en un puesto de datos."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué sabe Henry de modelado de procesos y simulación?"
  - "¿Ha usado Bizagi o FlexSim?"
  - "¿Sabe modelar procesos en BPMN?"
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

## La raíz de procesos que no se ve en una lista de tecnologías

<!-- seccion: la-raiz -->

Soy Ingeniero Industrial de la Pontificia Universidad Javeriana, con énfasis en Inteligencia Analítica de Datos, y cursé también estudios de Diseño Industrial en la misma universidad, entre 2009 y 2016. Antes de especializarme en plataformas de datos, Power BI, aplicaciones inteligentes y agentes de IA, aprendí a comprender procesos, modelar sistemas, analizar restricciones, distribuir recursos y diseñar soluciones alrededor de las personas que deben utilizarlas.

Esta raíz explica una parte importante de mi diferencial profesional. Cuando enfrento un problema de datos, no comienzo por la tabla, la visualización o el modelo. Comienzo por comprender el sistema que produce la información: quién interviene, qué actividad realiza, qué entradas necesita, qué resultado genera, qué dependencias existen y dónde aparecen esperas, errores, transferencias o pérdidas de información.

La Ingeniería Industrial me enseñó que el resultado de una organización no depende únicamente del desempeño de sus componentes, sino de la calidad de las relaciones que existen entre ellos. Un área puede alcanzar sus objetivos y, al mismo tiempo, perjudicar el flujo completo. Una actividad puede parecer eficiente de forma aislada y convertirse en la restricción del sistema cuando se observa su interacción con las demás.

El Diseño Industrial complementó esa mirada al situar a las personas dentro del sistema. Una solución puede optimizar técnicamente un proceso y fracasar porque aumenta la carga cognitiva, interrumpe el trabajo, utiliza un lenguaje que nadie reconoce o exige una conducta incompatible con el contexto real. Por eso, no considero terminada una solución únicamente porque funciona. También debe poder comprenderse, incorporarse y utilizarse con confianza.

Mi primer empleo, en Inglopres desde agosto de 2016, fue de ingeniero de procesos en una operación de alquiler de maquinaria con un parque de unas 120 entre máquinas y vehículos, y allí esa raíz se volvió oficio: modelar la operación, implantar un ERP, diseñar las bases de datos que no existían y asegurar la calidad bajo ISO 9001:2015. Todo lo que vino después —datos, Power BI, agentes— se construyó sobre esa forma de mirar.

## Del proceso a la analítica y a los agentes: la misma forma de pensar

<!-- seccion: de-los-procesos-a-la-ia -->

La analítica amplió estas capacidades. Me permitió convertir procesos en eventos, relaciones e indicadores; representar su comportamiento mediante modelos; anticipar determinados resultados; y construir experiencias en Power BI capaces de acercar esa comprensión a quienes deben decidir. El paso fue gradual y tiene fechas: en Ceinfes, desde noviembre de 2017, los KPI de logística, digitalización y programación de recursos humanos; en C&M Consorcio 2018, los tableros de supervisión de unas 150 rutas de 10 empresas concesionarias de TransMilenio; en Cafam, el BI de control de la implementación de un WMS; en Banco Pichincha, dashboards adoptados por más de 50 usuarios; en Vesting, una plataforma de datos entera en Microsoft Fabric.

La inteligencia artificial representa una ampliación adicional. Un agente puede incorporarse como un nuevo participante dentro del proceso, consultar conocimiento, utilizar herramientas y ejecutar determinadas actividades. Sin embargo, su valor continúa dependiendo de preguntas propias de la ingeniería: qué función cumple, qué información necesita, qué restricciones debe respetar, cómo se evaluará y qué responsabilidad debe permanecer en una persona. En Vesting, esas preguntas fueron el proceso core con el que se diseñaron e implementaron 27 agentes; en mi vitrina, son la ficha técnica de cada uno de mis 13 agentes, con su proceso dibujado en BPMN.

Las herramientas han evolucionado, pero la forma de pensar se mantiene. Comprendo el sistema, identifico la decisión, construyo la representación, selecciono la intervención adecuada y diseño los controles necesarios para sostener el resultado.

## Modelar el proceso antes de tocar el dato

<!-- seccion: modelar-antes -->

Antes de construir una solución analítica o inteligente, procuro representar el proceso que le da origen. Necesito comprender quién realiza cada actividad, qué información recibe, qué transforma, qué resultado produce, cuánto tiempo espera, qué excepciones enfrenta y quién depende posteriormente de su trabajo.

Esta representación permite distinguir entre el proceso formal y el proceso realmente ejecutado. Los procedimientos suelen describir una secuencia ordenada, pero la operación incorpora decisiones informales, correcciones manuales, transferencias, archivos auxiliares y excepciones que no siempre aparecen en la documentación oficial. En Cafam, en 2020, esa diferencia era el trabajo entero: el proceso de la bodega que el WMS esperaba y el que la bodega ejecutaba no eran el mismo, y las pruebas existían para encontrar cada punto en que divergían.

Hacer visibles esas diferencias evita automatizar una versión incompleta de la realidad. Una tecnología puede ejecutar con gran velocidad una lógica mal definida y convertir una ambigüedad local en un problema sistemático. Antes de digitalizar o automatizar, necesito identificar qué parte del proceso debe conservarse, cuál debe transformarse y qué decisiones todavía necesitan ser acordadas.

El modelado también determina qué datos deberían existir. Cada actividad genera o consume información, cambia el estado de una entidad y produce eventos que pueden utilizarse para comprender el funcionamiento del sistema. Si esos eventos no se capturan, el análisis posterior dependerá de aproximaciones, reconstrucciones manuales o percepciones difíciles de verificar. En Inglopres descubrí que no podía mejorar determinados procesos porque la operación no generaba la información necesaria para evaluarlos, y la solución comenzó diseñando la forma de capturarla: estructuras de bases de datos en SQLite para los análisis, mientras Odoo usaba la suya.

## El proceso y el modelo de datos se diseñan juntos

<!-- seccion: proceso-y-modelo-de-datos -->

Por eso, el proceso y el modelo de datos no se diseñan de manera independiente. Las entidades representan componentes relevantes del sistema. Los eventos registran aquello que ocurrió. Las relaciones permiten reconstruir el flujo. Los indicadores resumen comportamientos que necesitan ser observados. La calidad de la analítica depende de la fidelidad con la que esta estructura represente la operación. En Cafam, el BI de control de la implementación del WMS se construyó exactamente así: primero los eventos que cada prueba debía dejar registrados, después las tablas, y al final las 15 personas que lo leían.

Esta disciplina se extiende hacia las aplicaciones y los agentes de inteligencia artificial. Un diagrama general puede mostrar la secuencia de actividades, pero no necesariamente contiene suficiente precisión para construir una solución. Cada actividad necesita especificar entradas, reglas, fuentes, herramientas, salidas, excepciones y condiciones de intervención humana. Modelar antes de construir reduce la distancia entre lo que el negocio espera y lo que la tecnología finalmente implementa, y permite definir criterios de terminado más rigurosos, porque la solución puede evaluarse frente a una función previamente comprendida y no únicamente frente a una demostración convincente.

## Bizagi en la práctica: modelar el proceso en BPMN

<!-- seccion: bizagi-en-la-practica -->

He utilizado Bizagi y FlexSim en distintos momentos de mi trayectoria, y no siempre juntas: **Bizagi** en Inglopres, Ceinfes, Cafam y Banco Pichincha; **FlexSim** en Inglopres y Cafam. Las dos herramientas responden a necesidades diferentes, pero complementarias. Bizagi me permite representar la estructura, las responsabilidades y las reglas de un proceso. FlexSim me permite estudiar cómo ese proceso puede comportarse cuando incorpora tiempo, capacidad, recursos, variabilidad, acumulaciones y restricciones.

Con Bizagi modelo procesos en **BPMN**, la notación estándar: hago explícitas las actividades, decisiones, responsables, eventos, entradas, resultados y transferencias que conectan diferentes áreas, con sus carriles por actor y sus compuertas de decisión. Su valor no se limita a producir diagramas. Me permite disponer de un lenguaje común para contrastar cómo debería funcionar una operación con la manera en que realmente se ejecuta, y convertir conocimiento distribuido entre personas, sistemas y procedimientos en una representación que puede discutirse y mejorarse.

Un modelo BPMN bien hecho responde cuatro preguntas que una lista de pasos no responde: quién es responsable de cada actividad (el carril), qué decisión bifurca el flujo y con qué regla (la compuerta), qué evento externo lo dispara o lo interrumpe (el evento), y qué información viaja de una actividad a la siguiente (el objeto de datos). Cuando esas cuatro preguntas están contestadas, el diagrama sirve para tres cosas a la vez: acordar con el negocio, especificar para tecnología y decidir qué eventos hay que capturar para medir. Es la razón por la que el BPMN va antes del modelo de datos, y el modelo de datos antes de cualquier tablero: en Cafam, cada actividad del despacho tenía que dejar un registro en el WMS, y si no lo dejaba, el BI de control no podía verla.

Hoy la misma notación sigue en mi trabajo con una diferencia: en mi vitrina el BPMN ya no lo dibujo a mano. Cada una de las 32 piezas declara su proceso como datos y un motor propio genera el diagrama; lo cuento en la subsección sobre el proceso como definición viva.

## Bizagi en Inglopres, Ceinfes, Cafam y Banco Pichincha: cuatro procesos modelados

<!-- seccion: bizagi-en-cuatro-empresas -->

En **Inglopres**, entre agosto de 2016 y junio de 2017, esta perspectiva resultó relevante para comprender una operación que conectaba gestión comercial, disponibilidad de maquinaria, mantenimiento, logística e información administrativa, sobre un parque de unas 120 entre máquinas y vehículos. La implementación del ERP —una implantación nueva de Odoo— exigía traducir esas relaciones en actividades, estados, reglas y responsabilidades que el sistema pudiera representar de manera consistente. El modelo de proceso funcionaba como puente entre la realidad operativa y su implementación tecnológica.

En **Ceinfes**, entre noviembre de 2017 y noviembre de 2018, el modelamiento permitía representar las dependencias entre la programación de profesores y consultores, la preparación y distribución de materiales, la aplicación de evaluaciones en más de 100 colegios por año, la recepción de las respuestas y su posterior digitalización, a razón de unas 250 hojas por jornada. Cada frente tenía responsabilidades diferentes —unas 7 personas en programación, unas 12 en digitalización y unas 20 en logística—, pero el resultado dependía de que todos avanzaran de manera coordinada y dentro de ventanas de tiempo precisas.

En **Cafam**, entre octubre de 2020 y junio de 2021, Bizagi permitió comprender y contrastar la operación logística del centro de distribución de medicamentos con el comportamiento esperado de Oracle WMS Cloud, el sistema de gestión de almacenes que se implantaba. Las pruebas, la parametrización y los ajustes exigían reconocer cómo debía avanzar cada transacción —recepción, almacenamiento, alistamiento, despacho—, qué información debía conservarse, qué áreas intervenían y qué excepciones podían alterar el flujo. Con 20 personas probando, el diagrama era el acuerdo sobre qué se estaba probando.

En **Banco Pichincha**, entre marzo y julio de 2023, el modelamiento de procesos me ayudó a situar los productos analíticos dentro de las actividades y decisiones que debían respaldar. Un tablero adquiere mayor valor cuando puede relacionarse con una responsabilidad, una frecuencia de uso, un momento de decisión y una acción posible, en lugar de permanecer como una capa separada de la operación; fue parte de cómo los dashboards llegaron a más de 50 usuarios del negocio.

## FlexSim en la práctica: simular antes de intervenir

<!-- seccion: flexsim-en-la-practica -->

FlexSim me permitió avanzar desde la representación del proceso hacia el análisis de su comportamiento dinámico. Un diagrama puede mostrar la secuencia de una operación, pero no demuestra qué ocurrirá cuando la demanda varíe, los tiempos tengan dispersión, los recursos compitan entre sí o una actividad produzca trabajo a una velocidad superior a la capacidad de la siguiente. La **simulación de eventos discretos** hace visibles esas interacciones antes de trasladar una modificación a la realidad.

Mediante FlexSim pude representar entidades que recorren un proceso, recursos con capacidades limitadas, tiempos de operación variables, colas, desplazamientos, prioridades y reglas de asignación. Esto permitía observar cómo decisiones aparentemente razonables en una actividad podían producir esperas, acumulaciones, subutilización o sobrecarga en otra parte del sistema.

La usé en dos empleos. En **Inglopres**, en 2016, para comparar alternativas de la operación de alquiler de maquinaria antes de cambiarla: cómo se movían las máquinas entre disponibilidad, mantenimiento y despacho, y dónde una regla de asignación producía equipo parado. En **Cafam**, en 2021, construí el modelo más grande que he hecho: el **despacho de medicamentos** del centro de distribución, con la lógica del nuevo WMS —cómo interactuaban recepción, ubicación, alistamiento y despacho, con qué recursos, con qué tiempos y con qué colas—. El modelo mostraba dónde una regla razonable en una actividad producía esperas o congestión en otra, y la cola no estaba donde el promedio decía que iba a estar.

En logística y gestión de almacenes, la simulación permitía razonar sobre movimientos, disponibilidad de recursos, secuencias, tiempos de atención y restricciones de capacidad. Una modificación podía reducir el tiempo de una actividad y, al mismo tiempo, aumentar la congestión en otra parte del proceso. FlexSim proporcionaba una forma de observar estas consecuencias antes de convertir una hipótesis de mejora en una intervención operativa. En operaciones de servicios y analítica, la herramienta fortaleció igualmente mi capacidad para pensar en escenarios: aunque el sistema no estuviera representado como una línea física, seguían existiendo solicitudes, recursos, tiempos de procesamiento, transferencias, prioridades y acumulaciones. Esa comprensión me permitió trasladar los principios de simulación desde operaciones materiales hacia flujos de información y decisiones.

## Verificación, validación y escenarios: lo que la simulación no hace sola

<!-- seccion: verificacion-y-validacion -->

FlexSim también me enseñó que la simulación no predice automáticamente lo que ocurrirá. Sus resultados dependen de la calidad de los datos, de la validez de las distribuciones seleccionadas, de las reglas incorporadas y de la fidelidad con la que el modelo representa el proceso. Un modelo visualmente sofisticado puede producir conclusiones débiles si sus supuestos no han sido documentados ni contrastados con la realidad.

Por eso, antes de interpretar los resultados, necesito verificar que el modelo reproduce razonablemente el comportamiento de referencia y diferenciar entre verificación y validación. La **verificación** permite comprobar que el modelo ejecuta la lógica con la que fue construido. La **validación** permite examinar si esa lógica representa suficientemente el sistema real para el propósito del análisis. En el modelo del despacho de Cafam, la validación fue contra la operación que las 20 personas del equipo de pruebas conocían de primera mano: si el modelo hacía cola donde la bodega no hacía cola, el error estaba en el modelo.

También utilizo la simulación para comparar escenarios, no para producir una única respuesta presentada como certeza. Puedo modificar la demanda, la capacidad, la asignación, los tiempos, las prioridades o determinadas reglas y observar cómo cambian indicadores como utilización, tiempo de ciclo, inventario en proceso, longitud de las colas, _throughput_ y nivel de servicio. El valor se encuentra en entender qué decisiones son sensibles y bajo qué condiciones dejan de producir el resultado esperado.

Bizagi y FlexSim representan, por tanto, dos niveles de una misma disciplina. Bizagi responde cómo está estructurado el proceso, quién participa, qué decisiones contiene y qué información intercambia. FlexSim responde cómo podría comportarse ese proceso cuando sus tiempos, recursos y restricciones interactúan bajo condiciones variables. Esta diferencia sigue siendo central en mi trabajo actual. En una arquitectura de datos, primero necesito comprender el flujo y después observar volúmenes, latencias, errores y restricciones. En Power BI, necesito representar tanto el resultado como los mecanismos que lo producen. En una aplicación o un ecosistema agéntico, necesito especificar las responsabilidades de sus componentes y evaluar posteriormente cómo responden cuando cambian el contexto, la carga o las condiciones de ejecución.

## Capacidad nominal, capacidad efectiva y la variabilidad

<!-- seccion: capacidad-y-variabilidad -->

El aporte de FlexSim fue especialmente importante para comprender la diferencia entre **capacidad nominal** y **capacidad efectiva**. La capacidad nominal describe cuánto podría procesarse bajo condiciones ideales. La capacidad efectiva incorpora variabilidad, pausas, disponibilidad, errores, reprocesos, desplazamientos y restricciones reales. Diseñar una operación únicamente con promedios puede producir una capacidad que parece suficiente en el cálculo, pero falla cuando enfrenta la distribución real de la demanda. En el despacho de medicamentos de Cafam lo vi en el modelo antes de verlo en la bodega: con los tiempos promedio el sistema cuadraba, y con las distribuciones reales la cola aparecía en una actividad que nadie consideraba crítica.

En procesos de digitalización, esta lógica permitía comprender cómo interactuaban la recepción, la preparación, la lectura mediante escáneres, la validación, la corrección y la captura manual. En Ceinfes no abrí FlexSim, pero razoné la digitalización con la misma lógica: unas 250 hojas por jornada pasando por 2 estaciones de escaneo, más las estaciones de alistamiento, organización, validación y reordenamiento, y cerca de un 10 % de hojas que exigían captura manual. El objetivo no era conseguir que cada estación trabajara al máximo de manera independiente, sino balancear el flujo completo para evitar que la velocidad de una etapa trasladara acumulaciones y reprocesos hacia la siguiente; el 10 % de captura manual era, en la práctica, el cuello de botella que fijaba el ritmo de todo lo demás.

Aunque actualmente mi trabajo se concentra en plataformas analíticas e inteligencia artificial, FlexSim no representa una herramienta superada ni un conocimiento desconectado de mi perfil. Representa el origen de una forma de analizar sistemas que todavía aplico: formular escenarios, modelar variabilidad, identificar restricciones, evitar optimizaciones locales y examinar el comportamiento antes de intervenir. Bizagi me enseñó a hacer visible la lógica del proceso. FlexSim me enseñó a cuestionar si esa lógica seguiría funcionando frente a la variabilidad de la realidad. Juntas, ambas herramientas consolidaron una capacidad que continúa diferenciando mi trabajo: no solo represento cómo debería funcionar un sistema; construyo mecanismos para comprender cómo puede comportarse antes de convertir una decisión en una intervención. Por eso, desde 2026, las dos figuran en las skills de esta hoja de vida bajo un grupo propio, «Procesos y simulación».

## El proceso como una definición viva: el BPMN de mi vitrina se genera solo

<!-- seccion: proceso-como-definicion -->

No considero que un proceso deba permanecer únicamente como una imagen estática dibujada en un momento determinado. Cuando es posible, procuro representarlo mediante una definición estructurada a partir de la cual puedan generarse sus diagramas, controles y artefactos relacionados.

Un diagrama elaborado manualmente puede perder vigencia desde el momento en que cambia una actividad, una regla o una dependencia. Cuando la representación se genera desde una definición controlada, las modificaciones pueden conservar trazabilidad y propagarse de manera más consistente.

En las fichas de mi vitrina, los diagramas se generan mediante un motor que interpreta la definición del proceso y produce la representación correspondiente en notación estándar BPMN. Cada una de las 32 piezas —6 aplicaciones, 13 agentes, 7 investigaciones y 6 tableros— declara su proceso como datos: carriles por actor, pasos de tipo inicio, tarea, decisión o fin, y las transiciones entre ellos. El motor es código puro, sin efectos secundarios, con más del 80 % de cobertura de pruebas, y el mismo contrato de ficha técnica que usan las otras casas que producen piezas. Esta decisión evita mantener manualmente figuras desconectadas de la lógica que describen.

La definición estructurada también permite aplicar validaciones. Puede comprobarse que existan los elementos necesarios, que las referencias sean válidas y que determinadas reglas se cumplan antes de publicar: en mi caso, un esquema Zod valida cada ficha en el build, y una ficha malformada hace fallar la publicación antes de salir. El diagrama deja de ser únicamente una ilustración y se convierte en la manifestación visible de un activo que puede ser inspeccionado y controlado.

## Definición formal y minería de procesos: dos niveles que se comparan

<!-- seccion: definicion-y-mineria-de-procesos -->

Esto no significa que todos los procesos puedan reconstruirse automáticamente a partir de datos. En algunos casos, la organización dispone de registros de eventos suficientemente completos para observar el flujo ejecutado. En otros, el proceso debe documentarse mediante entrevistas, talleres, observación y análisis de sistemas. El método depende de la evidencia disponible. Cuando existen datos de eventos, es posible complementar la definición formal con la observación del comportamiento real —la minería de procesos—: los registros pueden revelar variantes, reprocesos, retornos, actividades omitidas y recorridos que no aparecen en la documentación oficial. Es un método que aplicaría con un registro de eventos real, no un caso que haya corrido en una empresa; lo más parecido que he tenido fue en Vesting, donde cada uno de los 27 agentes dejaba su rastro de eventos y el proceso core definía lo que debía ocurrir.

La arquitectura ideal conecta ambos niveles. La definición establece el comportamiento esperado, sus responsabilidades y sus reglas. Los datos muestran la ejecución observada. La comparación entre ellos permite identificar desviaciones, comprender excepciones y decidir si debe corregirse la operación o actualizarse el modelo formal. Las soluciones inteligentes también necesitan una definición de comportamiento esperado y evidencia sobre aquello que realmente hacen; gobernarlas exige conservar ambas perspectivas y hacer visible la diferencia.

## La simulación como forma de comprender la variabilidad

<!-- seccion: la-simulacion -->

FlexSim me proporcionó la experiencia práctica; la simulación dejó una forma de pensar que continúa presente incluso cuando trabajo con otras tecnologías.

Simular significa reconocer que un sistema no puede comprenderse completamente mediante un único valor promedio. La operación real contiene variabilidad, dependencias, acumulaciones, eventos poco frecuentes y condiciones extremas que pueden determinar el desempeño con mayor fuerza que el comportamiento habitual.

Por eso, cuando analizo un proceso, no pregunto únicamente cuánto tarda en promedio. También necesito conocer cómo se distribuyen sus tiempos, qué ocurre durante los picos, qué recursos limitan la capacidad, cómo se propaga una demora y qué tan sensible es el resultado frente a cambios en sus supuestos. En el análisis post-operacional de TransMilenio, en C&M Consultores, la demanda no se modeló como un total del mes sino por franja horaria, con actualización mensual, justamente porque el promedio diario escondía los picos que decidían la operación.

La simulación también me enseñó a separar una mejora local de una mejora sistémica. Acelerar una actividad puede aumentar el inventario pendiente en la siguiente. Elevar la utilización de un recurso puede reducir la capacidad de respuesta frente a variaciones. Eliminar una espera puede trasladar la congestión sin mejorar el tiempo total del proceso.

## La variabilidad en un indicador, en un modelo predictivo y en un agente

<!-- seccion: variabilidad-en-datos-y-agentes -->

Esta forma de pensar continúa presente en mi trabajo actual. Cuando analizo un indicador, no me limito a su valor promedio. También busco comprender su distribución, variabilidad, segmentos y situaciones extremas. Cuando evalúo un modelo predictivo, no observo únicamente la métrica global. Analizo dónde se concentra el error y qué consecuencias producen los casos que quedan fuera del comportamiento habitual: el modelo de demanda de TransMilenio se validó con RMSE respetando el orden temporal, y corrió 10 meses porque se seguía comparando contra lo que pasaba de verdad.

También la aplico a los agentes de inteligencia artificial. Un comportamiento correcto en la mayoría de las ejecuciones no es suficiente si determinadas entradas ambiguas, contextos incompletos o herramientas no disponibles producen resultados difíciles de detectar. Las condiciones de excepción necesitan diseñarse, probarse y observarse; en Vesting, el monitoreo en tiempo real de hasta 23 agentes a la vez existía para ver exactamente esas colas de excepciones. La simulación me enseñó que una arquitectura debe evaluarse frente a variabilidad y no únicamente frente al recorrido ideal. Este principio conecta procesos, datos, software e inteligencia artificial: los sistemas deben diseñarse para la realidad que cambia, no para un promedio que rara vez ocurre exactamente.

## Del modelo de proceso al gemelo analítico

<!-- seccion: gemelo-analitico -->

El modelamiento de procesos puede avanzar desde la representación estática hacia una capacidad analítica más rica. Cuando la definición del proceso se conecta con eventos, tiempos, volúmenes, recursos y resultados, comienza a funcionar como una representación dinámica del sistema.

No utilizo el concepto de gemelo de manera ligera. Una representación no se convierte en gemelo únicamente porque reproduzca visualmente un flujo. Necesita conservar una relación suficientemente consistente con el sistema observado y permitir analizar su estado, comportamiento o respuesta frente a determinados escenarios.

En una primera capa, los datos permiten observar qué ocurrió: qué actividades se ejecutaron, cuánto tardaron, qué volumen procesaron y dónde aparecieron excepciones. En una segunda capa, el modelo permite explicar relaciones, restricciones y mecanismos. En una tercera, la simulación permite explorar qué podría ocurrir si cambian la demanda, la capacidad, las reglas o la distribución de los recursos. Esta progresión conecta la analítica descriptiva, predictiva y prescriptiva. La descripción permite observar el sistema. La predicción anticipa condiciones futuras. La prescripción compara alternativas y ayuda a decidir qué intervención podría producir un mejor resultado bajo determinadas restricciones.

Lo más cerca que he estado de esa progresión completa fue en Vesting, entre agosto de 2023 y enero de 2025: la plataforma en Microsoft Fabric registraba cada evento de los agentes —1.000 eventos por día en 120 tablas—, el modelo semántico explicaba estado, costo y resultado por cliente, y el monitoreo en tiempo real permitía ver hasta 23 agentes a la vez. Faltaba la tercera capa, la simulación de escenarios sobre esa base, y es la dirección en la que sigo trabajando.

Power BI puede funcionar como la experiencia mediante la cual las personas acceden a esa representación, exploran su comportamiento y comprenden sus principales restricciones. El modelo semántico organiza las entidades, eventos, tiempos y medidas. La simulación y la predicción amplían la capacidad para analizar escenarios futuros. Las aplicaciones y los agentes pueden añadir una capa adicional de interacción: un agente puede consultar el estado, recuperar reglas, explicar una desviación o preparar una recomendación. Sin embargo, la capacidad inteligente solo resulta confiable cuando se apoya en una representación verificable del proceso y no en una interpretación libre del modelo. Esta convergencia representa una de las direcciones más importantes de mi perfil: convertir procesos en sistemas observables, utilizados tanto por personas como por capacidades inteligentes para comprender, decidir y actuar con mayor precisión.

## El estudio de tiempos con suplementos de la OIT y el balanceo de líneas

<!-- seccion: estudio-de-tiempos-y-balanceo -->

Dos métodos clásicos de la disciplina que he aplicado con nombre y apellido, no como teoría.

El **estudio de tiempos** lo hice en Inglopres, en 2016, como estudio del trabajo formal: cronometraje de las operaciones, valoración del ritmo de quien las ejecutaba, cálculo del tiempo estándar y aplicación de **suplementos por fatiga** tomados de la tabla de la OIT, la Organización Internacional del Trabajo. La lección que quedó es sencilla y sigue vigente: un tiempo observado no es un estándar hasta que reconoce el esfuerzo de quien lo ejecuta; un cronómetro mide lo que pasó, no lo que es sostenible ocho horas al día. Y quedó también una pregunta que no cerré entonces: qué suplemento corresponde a cada combinación de esfuerzo, repetitividad, ambiente y altitud, en vez de un porcentaje general de tabla.

El **balanceo de líneas** lo apliqué en Ceinfes, en 2018, sobre la digitalización de las evaluaciones: unas 250 hojas por jornada tratadas como una línea con estaciones —2 de escaneo, más alistamiento, organización, validación y reordenamiento—, un cuello de botella y una capacidad efectiva, en el vocabulario de la teoría de restricciones. Cerca del 10 % de las hojas exigía captura manual, y esa estación fijaba el ritmo real de toda la línea: no tenía sentido acelerar el escaneo si la captura manual no daba abasto. Balancear no fue comprar más escáneres; fue mover personas hacia la restricción y medir cada jornada el avance y el pendiente de digitalización.

Los dos métodos resuelven lo mismo con distinta escala: que el ritmo lo fije la capacidad real del sistema y no la aspiración del cronograma. Es la misma idea que hoy aplico a un pipeline de datos —el tiempo real de una carga, no el nominal— y a una corrida de agente —cuánto tarda de verdad, con sus reintentos y sus excepciones—.

## Lean, Kanban y Scrum: lo ágil visto desde procesos

<!-- seccion: lean-kanban-y-scrum -->

Los métodos **lean** y ágiles los llevé a la práctica en Ceinfes, entre noviembre de 2017 y noviembre de 2018, con el área de tecnología, cuando lideré la transición de la operación a un modelo de gestión por procesos apoyado en sistemas de información. No los adopté como una moda de software: los leí como lo que son, herramientas de ingeniería industrial para controlar el flujo de trabajo.

**Kanban** es, en su origen, un sistema de tirón: el trabajo entra cuando hay capacidad para atenderlo, y el límite al trabajo en curso es la forma de impedir que la cola crezca sin control. Lo usamos para el flujo de solicitudes del área de tecnología, donde cada tarjeta era una solicitud visible para todos, con su estado y su responsable. **Scrum**, con sprints, lo usamos para los proyectos tecnológicos: un objetivo por sprint, una revisión al cierre y la siguiente prioridad acordada con la evidencia del sprint anterior, no con la lista de deseos acumulada. Los dos convivían sin conflicto porque atendían cosas distintas: el flujo continuo de solicitudes pequeñas y los proyectos con alcance.

Lo que Kanban y Scrum tienen de industrial es lo que más me sirve: hacen visible el trabajo en curso, limitan la multitarea, fijan el ritmo por la capacidad real y obligan a definir qué significa terminado antes de empezar. Es el mismo principio del balanceo de líneas trasladado al trabajo de conocimiento, y es la misma disciplina con la que hoy construyo mis aplicaciones por sprints: cada ciclo tiene una orden de construcción, un resumen al cierre y una retrospectiva, y ninguna aplicación de mi vitrina avanza sin su prioridad y su visión escritas.

## ISO 9001 y la documentación: la disciplina del rastro escrito

<!-- seccion: iso-9001 -->

En Inglopres, entre agosto de 2016 y junio de 2017, trabajé sobre el aseguramiento de la calidad y el cumplimiento de los requisitos asociados con **ISO 9001:2015** dentro de la cadena de suministro. Esta experiencia fue mi primera escuela formal de trazabilidad, responsabilidades, controles y evidencia.

Bajo un sistema de gestión de calidad no basta con afirmar que el proceso funciona. Es necesario establecer qué resultado se espera, cómo se controla, quién responde, qué evidencia se conserva y qué ocurre cuando aparece una desviación. En Inglopres eso se tradujo en procedimientos de la cadena de suministro con su registro, indicadores con su definición y un equipo de 12 operarios y técnicos cuyo trabajo dejaba rastro; el 95 % de satisfacción del cliente, medido en encuesta, salió de ese sistema y no de la buena voluntad.

Esta disciplina transformó mi manera de documentar. El rastro escrito no es un requisito posterior destinado únicamente a una auditoría. Es una forma de conservar conocimiento, demostrar el funcionamiento del proceso y permitir que otra persona pueda comprenderlo, reproducirlo y mejorarlo.

Actualmente aplico esa misma lógica a la arquitectura de datos. Una transformación debe conservar su propósito. Una medida necesita una definición. Un modelo semántico debe poder revisarse. Un cambio necesita una razón y una forma de evaluar su efecto. También la aplico a mis aplicaciones y agentes: las decisiones de arquitectura se documentan en registros de decisión, los controles deben demostrar que pueden reconocer una falla antes de confiar en ellos, y las salidas persistentes de un modelo necesitan superar validaciones de esquema antes de incorporarse al flujo. En inteligencia artificial, el rastro escrito se extiende hacia las fuentes, las instrucciones, las herramientas, las ejecuciones y los resultados: una afirmación debe poder relacionarse con la evidencia que la sustenta, y cuando la evidencia no existe, el sistema debe declarar el vacío en lugar de ocultarlo mediante una respuesta plausible.

## De ISO 9001 a ISO/IEC 42001: la misma estructura de sistema de gestión

<!-- seccion: de-iso-9001-a-iso-42001 -->

ISO 9001 e ISO/IEC 42001 no son la misma norma ni representan una simple evolución de numeración. Responden a objetos de gestión diferentes: la calidad en una, los sistemas de inteligencia artificial en la otra. La conexión se encuentra en la disciplina de los sistemas de gestión: comprender el contexto, establecer responsabilidades, administrar riesgos, conservar información documentada, evaluar el desempeño y mejorar de manera continua. Mi experiencia con calidad me permitió reconocer esa estructura cuando, en 2025, asumí responsabilidades de gobierno de inteligencia artificial en la Fundación CTIC. Cambió el dominio, pero permaneció una convicción fundamental: una capacidad crítica no debe depender únicamente de buenas intenciones. Necesita procesos, responsables, controles y evidencia.

## Por qué esta raíz me hace mejor con los datos

<!-- seccion: por-que-me-hace-mejor -->

Mi formación en procesos fortalece mi trabajo con datos porque me permite decidir qué debe medirse antes de examinar el catálogo de campos disponibles.

Un indicador no surge únicamente porque una columna pueda agregarse o porque una visualización permita representarla. Debe corresponder con una pregunta, una etapa del proceso, una decisión o una condición que pueda modificarse. Medir lo que existe es sencillo. Identificar lo que realmente explica el comportamiento exige comprender el sistema. En Ceinfes, los KPI no salieron del sistema de información: salieron del proceso —cumplimiento de la programación, avance y pendiente de digitalización, entregas a tiempo, porcentaje de captura manual, reprocesos— y después se buscó cómo capturar cada uno.

También me permite reconocer datos que deberían existir y todavía no se producen. En Inglopres descubrí que no podía mejorar determinados procesos porque la operación no generaba la información necesaria para evaluarlos. La solución comenzó diseñando la forma de capturarla.

La comprensión del proceso fortalece igualmente el modelado semántico. Las tablas y relaciones no deberían reproducir únicamente la estructura de las fuentes. Deben representar entidades, eventos y reglas del negocio de manera que los indicadores conserven significado y puedan reutilizarse en diferentes productos. En el ETL de TransMilenio, las cinco fuentes —recaudo, flota y GPS, programación, novedades y PQR— no se unificaron por la forma de sus archivos sino por las entidades del proceso que describían: el servicio, el vehículo, la ruta, la franja.

## Adopción, optimizaciones locales, predicción y agentes: lo que el proceso decide

<!-- seccion: lo-que-el-proceso-decide -->

Esta raíz también explica por qué presto tanta atención a la adopción. Un tablero fracasa cuando no encaja con la decisión, el momento o la forma de trabajo de quien debería utilizarlo. Comprender el proceso permite diseñar la experiencia analítica alrededor de la rutina real y no únicamente alrededor de la información disponible; es la razón por la que los dashboards de Banco Pichincha llegaron a más de 50 usuarios en 2023 y los de C&M Consultores a más de 25 usuarios clave de la operación de TransMilenio.

La formación industrial también me permite identificar optimizaciones locales. Un área puede mejorar su indicador trasladando trabajo, riesgo o espera hacia otra parte del sistema. Analizar el proceso completo evita premiar comportamientos que deterioran el resultado global. En analítica predictiva, el conocimiento del proceso permite construir variables con significado, definir horizontes útiles y evitar utilizar información que no estará disponible cuando deba producirse la predicción. En inteligencia artificial, permite delimitar la función del agente: antes de seleccionar un modelo o diseñar un prompt, necesito comprender qué actividad asistirá, qué información utilizará, qué excepciones enfrentará y qué consecuencias producirá si se equivoca. Los datos me permiten observar la operación. La Ingeniería Industrial me permite entender qué estoy observando y por qué importa.

## Por qué esta raíz me hace mejor diseñando soluciones

<!-- seccion: por-que-me-hace-mejor-disenando -->

El Diseño Industrial agrega una capacidad que resulta esencial en datos e inteligencia artificial: comprender que una solución existe dentro de una experiencia y no únicamente dentro de una arquitectura técnica.

Un indicador puede estar correctamente calculado y ser difícil de interpretar. Una aplicación puede cumplir sus requisitos y generar una interacción innecesariamente compleja. Un agente puede ofrecer una respuesta correcta y comunicar de manera deficiente sus fuentes, límites o necesidades de intervención.

Diseñar significa conectar la función con la forma en que una persona puede comprenderla y utilizarla. Esto implica observar tareas, contexto, expectativas, lenguaje y restricciones humanas, no solamente definir componentes y funcionalidades.

En Power BI, esta perspectiva se traduce en jerarquía visual, navegación, reducción de carga cognitiva y correspondencia entre la pantalla y la decisión. El modelo puede contener una gran cantidad de información, pero la experiencia debe presentar únicamente aquello que la persona necesita para avanzar. En la Fundación CTIC, los 42 productos analíticos atienden a dos audiencias muy distintas —líderes administrativos y asistenciales— y la misma cifra se presenta con la profundidad que cada una necesita.

En aplicaciones, se traduce en recorridos comprensibles, estados visibles y mecanismos que ayuden al usuario a reconocer qué ocurrió y qué puede hacer después. Una interfaz no debe ocultar información crítica ni exigir que la persona comprenda toda la arquitectura para completar una tarea. Las 6 aplicaciones de mi vitrina pasan pruebas automáticas de accesibilidad en cada cambio, y esta misma hoja de vida respeta la preferencia de movimiento reducido del visitante: no es cortesía, es diseño.

En agentes, se traduce en confianza calibrada. La solución debe comunicar qué puede hacer, qué fuentes utiliza, qué límites tiene, cuándo necesita información adicional y cuándo transfiere la responsabilidad. La experiencia no debe presentar una capacidad probabilística como si fuera una autoridad absoluta.

El Diseño Industrial también fortalece mi forma de experimentar. Un prototipo permite hacer visible una hipótesis, ponerla frente a otras personas y aprender antes de invertir en una solución completa. Esta disciplina evita confundir una idea internamente coherente con una experiencia que realmente funciona para el usuario. La Ingeniería Industrial me ayuda a construir el sistema correcto. El Diseño Industrial me obliga a construirlo de una forma que pueda ser comprendida y utilizada. Los datos y la inteligencia artificial amplían lo que ese sistema puede observar y hacer.

## Construir procesos, no solamente entregables

<!-- seccion: construir-procesos -->

Uno de los aprendizajes más importantes de mi trayectoria es que una solución individual puede generar valor, pero un proceso replicable construye capacidad organizacional.

En Vesting, entre agosto de 2023 y enero de 2025, no me limité a participar en la creación de agentes. Definí, documenté y validé el proceso central —el proceso core, de once etapas— que sirvió como marco para construir los 27 agentes del inventario de la startup. El objetivo era que cada implementación pudiera aprovechar el conocimiento producido por las anteriores: cómo entender el problema, especificar el comportamiento, construir, validar, desplegar y observar.

La estandarización no significaba que todos los agentes fueran iguales. Significaba que compartían una forma común de comprender el problema, especificar el comportamiento, construir, validar, desplegar y observar la solución. Esta estructura permitía separar aquello que debía mantenerse de aquello que necesitaba adaptarse. Los principios, controles y criterios de aceptación podían permanecer. Las fuentes, herramientas, reglas y comportamientos podían cambiar según el caso. Cerré esa etapa al dejar el ecosistema y el proceso documentados, y el proceso siguió sirviendo sin mí: esa es la prueba de que era un proceso y no una persona.

El mismo enfoque está presente en mi pipeline propio. Las aplicaciones necesitan una prioridad y una visión antes de avanzar. Cada ciclo deja un resumen. Las salidas persistentes deben superar validaciones. Los controles necesitan demostrar que pueden fallar. La inteligencia artificial se incorpora únicamente cuando existe una justificación funcional. Con esas reglas se construyeron las 32 piezas de la vitrina, y el detalle de cada regla vive en el documento del pipeline.

Esta capacidad conecta directamente con la Ingeniería Industrial. El valor no reside únicamente en producir la siguiente unidad, sino en mejorar el sistema que permitirá producir todas las posteriores con mayor calidad, menor incertidumbre y mejor uso de los recursos. También conecta con AI-300, la ruta de certificación en operación de modelos y agentes que curso desde julio de 2026: operar inteligencia artificial de manera sostenible exige procesos para versionar, evaluar, desplegar, observar y mejorar modelos, aplicaciones y agentes. La arquitectura técnica necesita estar acompañada por una arquitectura operacional.

No busco que una organización dependa indefinidamente de mi intervención directa. Busco dejar estándares, memoria, componentes, criterios y mecanismos que permitan a otras personas continuar construyendo sobre una base confiable.

## Las preguntas que permanecieron abiertas: asignar, balancear, controlar

<!-- seccion: preguntas-pendientes -->

Algunas de las preguntas que hoy desarrollo con mayor rigor surgieron durante mis primeras experiencias profesionales. En ese momento pude reconocer los problemas y analizar parte de sus consecuencias, pero no siempre contaba con los datos, el tiempo o las herramientas necesarias para formular una respuesta completa.

En la operación de transporte, en C&M Consorcio 2018, entre noviembre de 2018 y mayo de 2020, apareció el problema de asignar conductores, vehículos y rutas bajo restricciones de disponibilidad, demanda, tipología y fallas, sobre unas 150 rutas de 10 empresas concesionarias. La práctica mostraba que considerar estos elementos mediante listas separadas podía producir combinaciones operativamente válidas, pero sistémicamente deficientes: la falla no era del conductor ni del bus, sino de la pareja.

También apareció la formación de convoyes de buses, el _bunching_. Detectar en los datos que varios vehículos circulaban con intervalos demasiado reducidos permitía hacer visible el fenómeno, pero no resolvía la pregunta más importante: qué política operacional podía intervenir sin trasladar el problema hacia otra parte del sistema.

En procesos productivos y de digitalización permaneció abierta la pregunta sobre los suplementos asociados a fatiga, desde el estudio de tiempos de Inglopres en 2016. Un porcentaje general de tabla puede simplificar la definición del estándar y, al mismo tiempo, ignorar diferencias entre esfuerzo, repetitividad, ambiente, altitud, aclimatación y condiciones reales de ejecución.

Estas preguntas comparten una raíz. No buscan describir únicamente lo ocurrido, sino comprender qué combinación de recursos, reglas o controles puede producir un mejor resultado bajo variabilidad y restricciones. Las detecté con datos en esos empleos y las convertí en preguntas de investigación después.

## De las preguntas abiertas a las investigaciones de la vitrina

<!-- seccion: de-las-preguntas-a-las-investigaciones -->

Actualmente abordo esas preguntas mediante revisión sistemática, modelado, optimización, simulación y generación controlada de escenarios, y tres de las 7 investigaciones publicadas en mi vitrina son exactamente ellas: la asignación conductor–bus con fallas, donde la avería se modela como propiedad de la pareja conductor–vehículo y no de cada uno por separado; los convoyes de buses, donde el objeto de estudio es la política de control y su adopción en operación, no solo la detección; y los suplementos por fatiga y el balanceo de línea, donde la pregunta es cómo calibrar la tabla a cada puesto y qué le hace la curva de fatiga al balanceo óptimo. Las tres nacieron de un problema visto con datos reales en un empleo —el transporte en 2018 y 2019, la planta en 2016— y se trabajan hoy con datos sintéticos y literatura, con sus vacíos y sus hallazgos declarados en cada ficha; el detalle está en el documento de las investigaciones.

La tecnología me permite formular preguntas más completas, pero el problema continúa siendo profundamente industrial: asignar, balancear, controlar y mejorar sistemas reales.

También aplico una disciplina importante al comunicar estos trabajos. Distingo entre una línea de investigación, un modelo validado con datos sintéticos, una conclusión sustentada mediante literatura y una intervención demostrada en operación. Cada nivel permite realizar afirmaciones diferentes y no debe presentarse como si ofreciera la misma evidencia. Por eso las fichas de las investigaciones etiquetan cada cifra como medida, calculada, declarada o estimada, y ninguna de las tres se presenta como una intervención ya demostrada en un sistema de transporte o en una planta.

Estas preguntas no constituyen asuntos inconclusos que intento ocultar. Representan problemas suficientemente importantes para haber permanecido y suficientemente complejos para exigir herramientas que mi trayectoria me permitió desarrollar posteriormente. La misma raíz continúa activa después de más de una década: comprender cómo funcionan los sistemas, representar su comportamiento y construir evidencia para intervenirlos con mayor precisión.

## Lo que procesos y simulación representan en mi perfil

<!-- seccion: lo-que-representan -->

Los procesos y la simulación no son una etapa antigua de mi trayectoria ni una categoría separada de mi trabajo actual. Son la estructura intelectual sobre la que construyo soluciones de datos e inteligencia artificial.

El modelamiento de procesos me permite comprender y especificar la estructura del sistema. La analítica me permite observar su ejecución mediante evidencia. La estadística y la predicción permiten anticipar comportamientos relevantes. La simulación, cuya disciplina desarrollé mediante FlexSim, me permite someter decisiones a escenarios variables antes de intervenir la operación real. La optimización permite comparar alternativas y seleccionar configuraciones bajo restricciones explícitas.

La Ingeniería Industrial mantiene conectadas estas capacidades alrededor del flujo, la restricción, la variabilidad, el uso de recursos y el resultado global. El Diseño Industrial mantiene visible a la persona que debe utilizar la solución, interpretar la información o intervenir cuando la tecnología alcanza sus límites.

DP-600, obtenido en diciembre de 2024, valida la arquitectura analítica mediante la cual los datos se preparan, modelan y convierten en activos empresariales. AI-103 amplía esa capacidad hacia aplicaciones y agentes. AI-300 fortalece la forma de desplegar, evaluar, observar y mejorar esas soluciones durante su ciclo de vida; las dos rutas están en curso desde julio de 2026. Y en las skills de esta hoja de vida, junto a Fabric, Power BI y los agentes, hay desde 2026 un grupo que se llama «Procesos y simulación»: BPMN con Bizagi, simulación de eventos discretos con FlexSim, estudio de tiempos y balanceo de líneas, Kanban y Scrum. No es nostalgia: es la parte del perfil que explica cómo uso todo lo demás.

Mi diferencial no consiste únicamente en conocer herramientas de procesos, datos o inteligencia artificial. Consiste en poder conectarlas dentro de un método único: comprender, representar, medir, experimentar, decidir y transformar. Por eso, cuando abordo un nuevo problema, no pregunto primero qué tecnología debería utilizar. Pregunto cómo funciona el sistema, qué comportamiento necesita cambiar y qué evidencia demostraría que la intervención produjo una mejora real. La tecnología proporciona posibilidades. Los procesos y la simulación proporcionan el criterio para utilizarlas con propósito.
