---
slug: fabric-en-la-practica
titulo: "Microsoft Fabric en la práctica"
resumen: "Lakehouse, modelado semántico, DAX y gobierno técnico: qué hago de verdad con la plataforma."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry con Microsoft Fabric?"
  - "¿Qué sabe hacer con modelado semántico y DAX?"
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

## Qué significa el DP-600 en trabajo concreto

<!-- seccion: que-significa-el-dp-600 -->

Preparé la certificación Microsoft Certified: Fabric Analytics Engineer Associate, asociada al examen DP-600, entre julio y noviembre de 2024, y obtuve la credencial en diciembre del mismo año. Es la validación formal más importante de mi capacidad para diseñar, construir, administrar y optimizar soluciones analíticas empresariales sobre Microsoft Fabric.

DP-600 comprende el recorrido completo de una solución analítica: explorar y seleccionar almacenes de datos, preparar y transformar información, diseñar modelos dimensionales, construir y optimizar modelos semánticos, administrar su ciclo de vida y aplicar mecanismos de seguridad y gobierno. Su alcance también exige trabajar con SQL, KQL y DAX, y comprender cómo se conectan lakehouses, warehouses, eventhouses, Power BI y otros componentes de Fabric.

Para mí, esta certificación no representa un conocimiento separado de la experiencia. La preparé mientras construía en Vesting un ecosistema de datos en Microsoft Fabric para integrar, analizar y monitorear la información producida por agentes de inteligencia artificial. La coincidencia fue especialmente valiosa porque cada concepto estudiado podía contrastarse con decisiones reales de arquitectura, rendimiento, modelado, trazabilidad y consumo.

No estudié Fabric como una colección de servicios independientes. Lo comprendí como una plataforma en la que los datos recorren un sistema completo: ingresan desde diferentes fuentes, son almacenados y transformados, adquieren estructura y significado, se convierten en modelos semánticos y finalmente llegan a las personas, aplicaciones o agentes que necesitan utilizarlos.

Esta visión conecta directamente con mi formación en Ingeniería Industrial. Así como un proceso operativo debe analizarse de extremo a extremo, una solución analítica no puede optimizarse observando únicamente el tablero o la consulta final. Es necesario comprender las entradas, transformaciones, restricciones, transferencias, controles y consumidores que determinan el desempeño del sistema completo.

DP-600 sostiene el núcleo analítico de mi perfil porque formaliza la capacidad de convertir datos dispersos en activos confiables y reutilizables. Power BI representa la experiencia de decisión, pero su calidad depende de todo lo que ocurre antes: arquitectura, almacenamiento, transformación, modelado, semántica, seguridad y gobierno.

## El lakehouse y el warehouse: dos formas complementarias de servir los datos

<!-- seccion: lago-y-almacen -->

En Vesting diseñé un ecosistema que integraba almacenamiento analítico, procesamiento distribuido y estructuras orientadas al consumo. El propósito no era utilizar diferentes componentes por sofisticación tecnológica, sino asignar cada carga de trabajo al mecanismo más adecuado según la naturaleza de los datos, la forma de transformación y las necesidades de consulta.

El lakehouse proporcionaba una base flexible para recibir, conservar y procesar información estructurada y semiestructurada procedente de diferentes integraciones. Permitía trabajar con grandes volúmenes, utilizar procesamiento distribuido y preservar suficiente detalle para reconstruir eventos, analizar comportamientos y desarrollar nuevas transformaciones sin depender exclusivamente de un esquema relacional definido desde el comienzo.

Sin embargo, un lakehouse no debe entenderse como un lugar donde los datos se conservan indefinidamente sin estructura. La flexibilidad necesita organización. Los datos deben avanzar desde su recepción hacia capas progresivamente más confiables, con reglas de calidad, estructuras consistentes y significado suficiente para que puedan reutilizarse. Conservar el detalle no implica renunciar al modelado.

El warehouse cumplía una función complementaria. Permitía organizar información estructurada mediante un enfoque relacional, desarrollar transformaciones y vistas orientadas al análisis y responder con claridad a cargas de trabajo que requerían SQL, consistencia y una estructura preparada para el consumo empresarial.

No considero que el lakehouse sea simplemente el lugar de los datos crudos y el warehouse el lugar de los datos terminados. La diferencia es más profunda. Cada uno responde a estilos de desarrollo, tipos de datos y cargas de trabajo diferentes. El lakehouse favorece escenarios de ingeniería, ciencia de datos y procesamiento mediante Spark. El warehouse fortalece escenarios relacionales, transformaciones mediante T-SQL y consultas empresariales estructuradas.

La decisión tampoco tiene que ser excluyente. Una arquitectura puede utilizar ambos cuando existe una razón funcional clara. El lakehouse puede conservar y transformar eventos con alta granularidad, mientras el warehouse organiza estructuras orientadas a consumidores que requieren relaciones, métricas y consultas predecibles. Lo importante es evitar duplicaciones innecesarias y mantener reglas claras sobre dónde se produce cada transformación y qué activo constituye la referencia para cada uso.

La integración bajo OneLake permite que estos componentes participen en una arquitectura común y utilicen formatos abiertos. Sin embargo, compartir una plataforma no elimina automáticamente la necesidad de diseñar. Todavía es necesario definir responsabilidades, capas, convenciones, controles de calidad, relaciones y criterios para decidir qué información está preparada para cada consumidor.

La arquitectura correcta no es la que incorpora más componentes, sino la que organiza el recorrido del dato con la menor complejidad necesaria. Mi función consiste en definir ese recorrido, asignar responsabilidades y asegurar que cada capa agregue valor sin perder trazabilidad.

## El pipeline como sistema de producción analítica

<!-- seccion: pipeline-analitico -->

Un pipeline de datos no es únicamente una tubería que transporta información. Es el proceso mediante el cual los eventos de una organización se convierten en una representación analítica de su realidad. Cada transformación incorpora decisiones sobre calidad, temporalidad, granularidad, relaciones y reglas de negocio.

Por eso, diseño los pipelines a partir de sus consumidores y decisiones esperadas, pero sin acoplarlos exclusivamente a un reporte específico. Necesito comprender qué preguntas deben responderse, qué nivel de detalle debe conservarse, con qué frecuencia se necesita la información y qué reglas determinan cuándo un dato puede considerarse suficientemente confiable para avanzar.

La ingestión debe preservar la procedencia y los identificadores necesarios para reconstruir el recorrido de la información. La transformación debe hacer explícitas las reglas que convierten registros operativos en entidades analíticas. Los controles de calidad deben detectar valores faltantes, duplicidades, relaciones inconsistentes y condiciones que puedan alterar materialmente los resultados.

También procuro separar las etapas de recepción, preparación y consumo. Esta separación permite investigar errores sin reconstruir todo el proceso, reutilizar transformaciones, incorporar nuevas fuentes y modificar una capa sin alterar innecesariamente las demás. El objetivo no es crear complejidad arquitectónica, sino contenerla y hacerla comprensible.

La Ingeniería Industrial influye directamente en esta forma de diseñar. Analizo el pipeline como una línea de proceso: observo entradas, capacidades, restricciones, acumulaciones, tiempos, desperdicios, excepciones y resultados. Una transformación innecesariamente repetida equivale a un reproceso. Una dependencia oculta representa un riesgo operacional. Un cuello de botella en la preparación puede inutilizar una solución aunque el tablero final esté correctamente construido.

La optimización tampoco consiste únicamente en disminuir el tiempo de ejecución. Un pipeline más rápido, pero imposible de comprender o mantener, puede trasladar el costo hacia el futuro. Busco equilibrar rendimiento, trazabilidad, modularidad y facilidad de evolución.

Esta perspectiva se extiende naturalmente hacia la inteligencia artificial. Los modelos, las aplicaciones y los agentes necesitan datos preparados para su propósito, con contexto suficiente y condiciones claras de uso. Una arquitectura analítica moderna no debe servir únicamente a los tableros. También debe preparar activos que puedan ser utilizados de manera segura y consistente por soluciones inteligentes.


## El modelado semántico es donde se gana o se pierde la confianza

<!-- seccion: modelado-semantico -->

El modelo semántico es una de las capas menos visibles de una solución analítica y, al mismo tiempo, una de las que más determina su valor. Es el lugar donde las tablas se convierten en entidades del negocio, las relaciones adquieren significado y las reglas de cálculo se transforman en métricas que diferentes personas pueden utilizar de manera consistente.

Un buen modelo permite que un concepto conserve la misma definición a través de diferentes reportes y experiencias analíticas. Un modelo fragmentado obliga a reconstruir la lógica en cada producto y produce múltiples versiones de una misma métrica. Cuando dos personas llegan a una reunión con resultados diferentes para el mismo indicador, el problema rara vez se resuelve modificando el color de una visualización. Es necesario revisar la semántica, las relaciones, las transformaciones y las reglas que producen la cifra.

Sin embargo, el modelo semántico no crea por sí solo el consenso. La definición debe ser acordada por los responsables del negocio, documentada y asociada con una responsabilidad institucional. El modelo convierte ese acuerdo en una regla reutilizable y controlada, pero no reemplaza la conversación necesaria para determinar qué significa realmente cada concepto. La tecnología preserva la definición; la organización debe establecerla.

Mi trabajo no se limitó a optimizar el análisis de datos en términos generales. Optimicé tanto los modelos semánticos como la forma en que esos modelos sostenían el análisis. Esto incluyó revisar estructuras, relaciones, medidas, contextos de cálculo, organización de objetos, tiempos de consulta y patrones que podían generar procesamiento innecesario.

Utilicé DAX Studio para observar el comportamiento interno de las consultas, establecer líneas base de rendimiento, identificar medidas costosas y analizar cómo el motor resolvía diferentes contextos. La optimización no consistía en sustituir una fórmula compleja por otra igualmente difícil de comprender. El objetivo era reducir trabajo innecesario, reutilizar lógica y conservar medidas suficientemente claras para ser validadas y mantenidas.

Utilicé Tabular Editor para fortalecer la estructura, organización y mantenibilidad de los modelos. Esto permitía administrar medidas, propiedades, metadatos y elementos reutilizables de una manera más consistente. La herramienta facilitaba tratar el modelo como un activo de ingeniería y no únicamente como una configuración interna del archivo de Power BI.

La optimización del modelo semántico y la optimización del análisis de datos no son logros separados. Un modelo más claro, eficiente y consistente permite que los análisis respondan con mayor rapidez, reduce discrepancias, facilita la incorporación de nuevos productos y disminuye la dependencia del desarrollador original.

También comprendo el modelo semántico como un contrato entre la arquitectura de datos y las personas que toman decisiones. El warehouse o el lakehouse pueden conservar grandes volúmenes y estructuras técnicamente correctas, pero el modelo semántico organiza la forma en que la organización entiende esos datos. Define qué entidades son relevantes, cómo se relacionan y qué medidas permiten evaluar su comportamiento.

Esta capacidad es especialmente importante para la inteligencia artificial. Un agente puede consultar tablas o documentos directamente, pero una capa semántica gobernada reduce ambigüedades y proporciona definiciones consistentes. Cuando conceptos críticos ya tienen relaciones, medidas y reglas controladas, las soluciones inteligentes pueden utilizar una representación empresarial más estable en lugar de inferir significados a partir de estructuras técnicas aisladas.

Mi especialidad en Power BI se concentra en esta convergencia: preparar los datos, modelar el dominio, construir medidas verificables, optimizar su funcionamiento y convertir ese sistema en una experiencia de análisis que las personas puedan utilizar con confianza.

## Power BI: la experiencia de decisión, no el objetivo final

<!-- seccion: power-bi -->

Power BI aparece a lo largo de toda mi trayectoria. Comenzó como parte de mi formación analítica, se consolidó en el análisis de operaciones urbanas, permitió instrumentar la implementación de un sistema de gestión de almacenes, alcanzó una adopción superior a cincuenta usuarios en el sector financiero y actualmente sostiene soluciones analíticas dirigidas a líderes administrativos y asistenciales.

Con los años dejé de entenderlo como el entregable. El producto visible puede ser un tablero, pero el resultado esperado es una decisión mejor sustentada, una conversación más clara o una capacidad institucional para comprender el comportamiento de sus procesos.

Por eso, el desarrollo comienza antes de abrir la interfaz. Primero identifico el proceso, la audiencia, la pregunta y la decisión. Después defino las entidades, relaciones, eventos y medidas necesarias para representar la situación. Solo entonces diseño la experiencia visual mediante la cual una persona podrá recorrer la información.

También separo conceptualmente el modelo semántico de la experiencia de consumo. El modelo debe concentrar las relaciones, definiciones y medidas que necesitan reutilización y gobierno. El reporte debe concentrarse en la navegación, el contexto y las preguntas de una audiencia específica. Esta separación permite desarrollar diferentes experiencias analíticas sobre una misma base de significado sin duplicar la lógica en cada producto.

Esta arquitectura también fortalece el autoservicio gobernado. Los usuarios pueden explorar, combinar perspectivas y construir nuevas experiencias sin redefinir individualmente las métricas críticas. La autonomía se desplaza hacia el análisis, mientras la semántica compartida protege la consistencia de la información.

La Ingeniería Industrial aporta la perspectiva de proceso. No organizo los tableros únicamente según la estructura de las áreas, porque un proceso puede atravesar varias unidades y acumular restricciones que ninguna observa en su totalidad. Power BI permite representar ese recorrido, hacer visibles sus relaciones y conectar indicadores de resultado con las condiciones que los producen.

El Diseño Industrial aporta la experiencia de interacción. La información debe tener jerarquía, la navegación debe responder a una lógica comprensible y cada elemento visual debe justificar el espacio que ocupa. La interfaz no debe exhibir la complejidad del modelo, sino permitir que la persona la recorra sin perder significado.

La adopción es, por ello, uno de mis principales indicadores de éxito. Un tablero puede cumplir todas las buenas prácticas técnicas y visuales y seguir sin generar valor si no forma parte de la rutina de decisión. La publicación es apenas el comienzo. La solución necesita acompañamiento, comprensión de las métricas, retroalimentación y evolución.

También he explorado formas de automatizar la construcción y modificación de artefactos de Power BI directamente sobre sus estructuras nativas. Este trabajo busca reducir actividades manuales repetitivas, aplicar reglas de manera consistente y permitir que componentes especializados asistan parte del ciclo de desarrollo.

Sin embargo, automatizar la herramienta no significa delegar indiscriminadamente el diseño. La selección de métricas, la semántica, la arquitectura y la experiencia de decisión necesitan criterios explícitos. La inteligencia artificial puede asistir la generación de artefactos, pero el propósito, la validación y la aceptación deben permanecer bajo responsabilidad profesional.

Power BI representa, en síntesis, el punto donde la arquitectura de datos se encuentra con las personas. Su valor no está únicamente en hacer visible la información, sino en conservar el significado construido a lo largo de todo el pipeline y transformarlo en una experiencia que facilite comprender, decidir y actuar.

## Preparar datos para personas, aplicaciones y agentes

<!-- seccion: datos-listos-para-ia -->

Una plataforma analítica contemporánea no debe diseñarse únicamente para producir reportes. Sus datos y modelos también pueden ser utilizados por aplicaciones, procesos automatizados y agentes de inteligencia artificial. Esto introduce nuevos consumidores, necesidades de contexto y responsabilidades de gobierno.

Preparar datos para inteligencia artificial no consiste en entregar acceso indiscriminado al lakehouse o al warehouse. Es necesario identificar qué información está autorizada para cada propósito, qué nivel de detalle resulta necesario, cómo se preservará la procedencia y qué definiciones deben acompañar los datos para evitar interpretaciones incorrectas.

Los modelos semánticos pueden aportar una base particularmente valiosa. Las medidas gobernadas, las relaciones y la terminología empresarial permiten que una aplicación o un agente consulte conceptos que ya han sido definidos institucionalmente. Esto reduce la necesidad de duplicar lógica y disminuye el riesgo de que cada solución reconstruya de manera diferente el significado de la información.

También es necesario decidir cuándo el agente debe consultar datos estructurados, cuándo necesita recuperar conocimiento documental y cuándo debe combinar ambas fuentes. Una métrica oficial no debería ser recalculada libremente por un modelo generativo cuando ya existe una medida gobernada. De la misma manera, una explicación no debería limitarse a una cifra si la decisión requiere políticas, definiciones o contexto no estructurado.

DP-600 proporciona la base para preparar, servir y gobernar estos activos. AI-103 extiende esa base hacia aplicaciones y agentes capaces de utilizar conocimiento y herramientas. AI-300 incorpora las prácticas necesarias para evaluar, observar y mantener esas capacidades cuando comienzan a operar de manera sostenida.

Esta convergencia define una parte esencial de mi perfil. No construyo primero la plataforma analítica y después agrego inteligencia artificial como una capa independiente. Diseño el recorrido completo para que los datos puedan sostener análisis humano, experiencias en Power BI y soluciones inteligentes bajo definiciones, controles y responsabilidades compartidas.


## El gobierno técnico de la plataforma

<!-- seccion: gobierno-tecnico -->

Gobernar una plataforma analítica significa mantener control sobre la identidad, la procedencia, el significado, la calidad y las condiciones de uso de la información. No consiste únicamente en conceder permisos ni en mantener documentación separada de la operación.

En Vesting, el gobierno debía incorporarse desde el diseño porque la plataforma recibía información asociada con diferentes clientes, integraciones y agentes. Los identificadores, la propiedad, el contexto y las condiciones de acceso no podían incorporarse después de construir los productos analíticos. Debían preservarse desde el ingreso del primer evento.

Microsoft Fabric ofrece una ventaja importante al integrar almacenamiento, procesamiento, modelado y consumo dentro de un ecosistema común. Esta cercanía reduce algunas fronteras técnicas en las que normalmente se fragmentan las identidades, los permisos y el linaje.

Sin embargo, una plataforma integrada no produce gobierno automáticamente. Todavía es necesario definir responsabilidades, organizar los espacios de trabajo, establecer criterios de acceso, documentar transformaciones, diferenciar ambientes y controlar cómo evolucionan los activos analíticos.

El linaje debe permitir recorrer un resultado desde Power BI hasta las estructuras y transformaciones que lo sustentan. La documentación debe explicar no solo de dónde proviene un dato, sino también qué reglas modificaron su significado. Los responsables necesitan comprender qué consecuencias puede tener un cambio antes de aplicarlo.

El gobierno también comprende el ciclo de vida. Los modelos, pipelines y reportes deben poder evolucionar sin introducir cambios inesperados sobre quienes los utilizan. Esto exige procesos de desarrollo, validación, publicación y seguimiento proporcionales a la importancia de cada activo.

En plataformas destinadas también a soluciones de inteligencia artificial, el gobierno debe extenderse hacia los nuevos consumidores. No basta con definir quién puede consultar un dato. Es necesario establecer qué aplicación o agente puede utilizarlo, para qué propósito, con qué nivel de detalle y bajo qué mecanismos de supervisión.

La integración técnica de Fabric crea una base favorable, pero el gobierno continúa siendo una disciplina de arquitectura y responsabilidad. La herramienta proporciona capacidades; la organización debe convertirlas en reglas, prácticas y decisiones aplicables.

## El ciclo de vida de los activos analíticos

<!-- seccion: ciclo-de-vida-analitico -->

Una plataforma analítica empresarial no queda terminada cuando el pipeline ejecuta correctamente o cuando el reporte ha sido publicado. Los datos, las definiciones, las reglas y las necesidades de los usuarios cambian. Por eso, los activos necesitan un ciclo de vida que permita desarrollarlos, validarlos, publicarlos, observarlos y modificarlos sin perder control sobre sus efectos.

Procuro diferenciar claramente los estados de una solución. Una transformación en desarrollo no debe tratarse como una fuente confiable para decisiones. Un modelo que todavía está siendo validado no debe sustituir silenciosamente al que utiliza la operación. Un reporte publicado no debe modificarse sin comprender qué personas, procesos o productos dependen de sus métricas.

Esta disciplina exige controlar cambios sobre pipelines, modelos semánticos, medidas y reportes. Cada modificación relevante debe conservar una razón, un responsable y una forma de verificar que el resultado continúa siendo correcto. La profundidad del control debe ser proporcional al impacto del activo: no todos los cambios necesitan el mismo proceso, pero ninguno debería introducirse sin conocer sus posibles consecuencias.

Las pruebas deben incluir tanto comportamiento como datos. Un despliegue puede completarse técnicamente y, aun así, producir cifras incorrectas porque cambió una relación, una regla o la interpretación de una fuente. Por eso, además de verificar que los componentes funcionen, es necesario contrastar medidas críticas, conteos, relaciones y resultados esperados antes de considerar estable una nueva versión.

También considero necesario diseñar la reversibilidad. Cuando un cambio produce un resultado inesperado, la organización debe poder identificar qué versión lo introdujo, comprender qué activos fueron afectados y restablecer una condición confiable mientras se investiga la causa. La capacidad de evolucionar con seguridad depende tanto de avanzar como de poder retroceder de manera controlada.

El ciclo de vida también comprende el retiro. Los modelos, reportes y pipelines que han dejado de responder a una necesidad no deben permanecer indefinidamente como activos aparentemente vigentes. Retirar una solución exige identificar sus consumidores, preservar la información necesaria, comunicar el cambio y evitar que continúe utilizándose una definición que ya no representa la realidad.

Esta forma de trabajo conecta directamente con mi experiencia en procesos y calidad. Un activo analítico necesita responsables, criterios de aceptación, controles, evidencia y mejora continua. DP-600 formaliza esta disciplina dentro del ciclo de vida de Microsoft Fabric, mientras AI-300 la amplía hacia la operación de modelos, aplicaciones generativas y agentes de inteligencia artificial.

La diferencia entre construir un tablero y desarrollar una capacidad empresarial aparece con claridad en este punto. El tablero puede publicarse una vez. La capacidad necesita evolucionar sin perder definición, confiabilidad ni memoria sobre las decisiones que la construyeron.


## La optimización como disciplina de extremo a extremo

<!-- seccion: optimizacion-extremo-a-extremo -->

No entiendo la optimización como una actividad exclusiva de DAX, Power Query, SQL o Spark. El rendimiento de una solución analítica es el resultado acumulado de decisiones tomadas a lo largo de toda la arquitectura.

Una consulta lenta puede originarse en la lectura de un volumen innecesario, una transformación mal ubicada, un modelo con relaciones ambiguas, una medida costosa o una visualización que solicita más información de la necesaria. Optimizar únicamente la última capa puede ocultar temporalmente el síntoma sin corregir el mecanismo que lo produce.

Mi criterio es intervenir primero en la capa donde se origina el desperdicio. Si el pipeline traslada información innecesaria, la solución no debería comenzar reescribiendo una medida. Si la granularidad excede la necesidad del análisis, una visualización más simple no corregirá el costo estructural. Si el modelo contiene relaciones ambiguas, aumentar la capacidad únicamente ocultará temporalmente el problema. Optimizar exige identificar el mecanismo y no limitarse a aliviar el síntoma.

Por eso, comienzo por identificar dónde se consume el tiempo, la capacidad o la complejidad. Evalúo qué datos deben trasladarse, qué transformaciones pueden ejecutarse cerca del origen, qué agregaciones conviene materializar, qué granularidad necesita conservarse y qué cálculos deben resolverse en el modelo semántico.

En Power Query, esto implica reducir tempranamente columnas y filas innecesarias, preservar el plegado de consultas cuando es posible, evitar transformaciones repetidas y estructurar los pasos de manera comprensible. En el modelo semántico, implica revisar relaciones, cardinalidades, medidas, contextos y estructuras que afectan tanto el rendimiento como la mantenibilidad.

En DAX Studio puedo contrastar el comportamiento de las consultas y establecer si una modificación produce una mejora real. Tabular Editor permite fortalecer la estructura y aplicar prácticas consistentes sobre los objetos del modelo. Ninguna herramienta reemplaza el criterio, pero ambas proporcionan evidencia para decidir dónde intervenir.

La optimización también debe considerar la utilización de la capacidad y el costo. Una solución que responde rápidamente mediante un consumo desproporcionado puede no ser sostenible cuando aumentan los usuarios, los modelos o las cargas de trabajo. La arquitectura necesita responder correctamente hoy y conservar una ruta razonable para crecer.

El resultado que busco no es una cifra aislada de rendimiento. Es una solución equilibrada: suficientemente rápida para ser adoptada, clara para ser mantenida, gobernable para ser confiable y eficiente para poder escalar.

## Lo que estoy construyendo para demostrarlo en público

<!-- seccion: lo-publico -->

Mantengo en exploración una pieza de analítica de extremo a extremo sobre Microsoft Fabric utilizando datos abiertos de Colombia. Su propósito es convertir en evidencia pública y reproducible las capacidades que DP-600 valida y que he aplicado en entornos profesionales.

La pieza debe cubrir el recorrido completo: identificación de la fuente, ingestión, conservación de la información, transformación, validación de calidad, organización en lakehouse o warehouse, construcción del modelo dimensional, desarrollo del modelo semántico y creación de una experiencia analítica en Power BI.

No quiero publicar únicamente el tablero final. El valor demostrativo se encuentra precisamente en hacer visible aquello que normalmente permanece detrás: por qué se seleccionó cada componente, qué reglas transformaron la información, cómo se verificó la calidad, qué decisiones estructuraron el modelo y cómo se conserva la trazabilidad hasta las fuentes.

La arquitectura deberá justificar cuándo utiliza lakehouse, warehouse o ambos. También deberá demostrar cómo se separan las capas, cómo se administran los cambios y cómo se evita duplicar innecesariamente los datos o la lógica.

El modelo semántico tendrá un papel central. Deberá contener dimensiones y hechos comprensibles, medidas documentadas, relaciones verificables y una estructura capaz de sostener diferentes experiencias analíticas sin reconstruir el significado en cada reporte.

Power BI deberá demostrar adopción potencial, no solamente diseño visual. La experiencia se organizará alrededor de preguntas y decisiones, con una navegación que permita avanzar desde la visión general hasta la evidencia que explica cada resultado.

La pieza también debe preparar activos reutilizables por consumidores diferentes. Además del análisis humano, exploraré cómo determinadas definiciones, medidas o estructuras pueden ponerse a disposición de aplicaciones o agentes sin permitir que reconstruyan libremente la lógica institucional.

Permanece declarada como exploración porque todavía no cumple todos los criterios necesarios para incorporarse al inventario de piezas construidas. No cambiará de estado por tener una conexión funcionando o un tablero convincente. Deberá contar con arquitectura documentada, despliegue reproducible, controles de calidad, modelo semántico verificable, criterios de rendimiento y evidencia suficiente sobre sus resultados.

Cuando esté terminada, no sustituirá la evidencia de mi experiencia profesional ni de la certificación. Cumplirá otra función: permitirá que cualquier persona examine públicamente cómo convierto los principios de Fabric, Power BI, gobierno y preparación de datos para IA en una solución completa.

La forma de publicación de Power BI se definirá según las condiciones técnicas, de licenciamiento, seguridad y acceso disponibles para la pieza. El objetivo demostrativo no depende de imponer una modalidad específica de embebido, sino de hacer verificables el modelo, las medidas, la arquitectura y la experiencia analítica mediante un mecanismo compatible con esas condiciones.

## Lo que Fabric representa dentro de mi perfil

<!-- seccion: fabric-en-mi-perfil -->

Microsoft Fabric representa la convergencia entre varias capacidades que desarrollé inicialmente por separado. Integra la ingeniería necesaria para recibir y transformar datos, la arquitectura requerida para almacenarlos, el modelado que organiza su significado y Power BI como experiencia de análisis y decisión.

Su importancia en mi perfil no proviene únicamente de haber obtenido DP-600 ni de conocer sus componentes. Proviene de haber utilizado esa plataforma para resolver un problema especialmente exigente: construir desde cero un ecosistema de datos para observar agentes de inteligencia artificial y transformar sus eventos en información útil para producto y operaciones.

Fabric también representa un puente hacia mi responsabilidad actual. Las organizaciones necesitan plataformas capaces de servir simultáneamente a analistas, procesos, aplicaciones y soluciones inteligentes. Esto exige datos confiables, modelos reutilizables, seguridad, gobierno y una arquitectura que permita incorporar nuevos usos sin reconstruir cada vez la base completa.

La Ingeniería Industrial aporta la visión del sistema y del flujo que la plataforma debe representar. El Diseño Industrial aporta la experiencia mediante la cual esa complejidad se vuelve utilizable. DP-600 aporta la arquitectura analítica. AI-103 amplía el uso de esos activos hacia aplicaciones y agentes. AI-300 incorpora la disciplina necesaria para operar y observar las soluciones inteligentes que consumen esa información.

Mi especialidad no consiste en utilizar cada componente de Fabric de manera aislada. Consiste en decidir qué arquitectura necesita el problema, cómo debe recorrerla la información, qué significado conservará y de qué forma se convertirá en una capacidad de análisis o inteligencia artificial que la organización pueda utilizar con confianza.