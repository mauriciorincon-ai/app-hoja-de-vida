---
slug: fabric-en-la-practica
titulo: "Microsoft Fabric en la práctica"
resumen: "Cómo trabajo Fabric por dentro: lakehouse y warehouse sobre OneLake en Vesting (120 tablas, 20 GB), Power Query y pipelines con validaciones, el modelo semántico optimizado con DAX Studio y Tabular Editor, Direct Lake, RLS, y Power BI como experiencia de decisión."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry con Microsoft Fabric?"
  - "¿Qué sabe hacer con modelado semántico y DAX?"
  - "¿Qué es un lakehouse y lo ha usado?"
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

El DP-600 —la credencial Fabric Analytics Engineer Associate de Microsoft— lo obtuve en diciembre de 2024, tras cinco meses de preparación, de julio a noviembre de ese año. Es la validación formal más importante de mi capacidad para diseñar, construir, administrar y optimizar soluciones analíticas empresariales sobre Microsoft Fabric.

El DP-600 comprende el recorrido completo de una solución analítica: explorar y seleccionar almacenes de datos, preparar y transformar la información, diseñar modelos dimensionales, construir y optimizar modelos semánticos, administrar su ciclo de vida y aplicar mecanismos de seguridad y gobierno. Su alcance también exige trabajar con SQL, KQL y DAX, y comprender cómo se conectan lakehouses, warehouses, eventhouses, Power BI y los demás componentes de Fabric.

Para mí, esta certificación no representa un conocimiento separado de la experiencia. La preparé y la obtuve dentro de mi rol en Vesting, mientras construía desde cero un ecosistema de datos en Microsoft Fabric para integrar, analizar y monitorear la información producida por agentes de inteligencia artificial: 120 tablas, 20 GB y 1.000 eventos por día al final del periodo. La plataforma tenía menos de un año en disponibilidad general cuando la adopté, de modo que buena parte del aprendizaje ocurrió con la documentación y las novedades saliendo mes a mes. La coincidencia fue especialmente valiosa porque cada concepto estudiado podía contrastarse con decisiones reales de arquitectura, rendimiento, modelado, trazabilidad y consumo, y cada decisión tomada en la plataforma podía revisarse contra lo que el temario proponía como práctica recomendada.

El DP-600 sostiene el núcleo analítico de mi perfil porque formaliza la capacidad de convertir datos dispersos en activos confiables y reutilizables. Power BI representa la experiencia de decisión, pero su calidad depende de todo lo que ocurre antes: arquitectura, almacenamiento, transformación, modelado, semántica, seguridad y gobierno. El detalle de cómo la preparé, con qué ritmo y junto a qué otras credenciales, está en el documento de certificaciones.

## Fabric como sistema de producción de información, no como lista de servicios

<!-- seccion: fabric-como-sistema -->

No estudié Fabric como una colección de servicios independientes. Lo comprendí como una plataforma en la que los datos recorren un sistema completo: ingresan desde diferentes fuentes, son almacenados y transformados, adquieren estructura y significado, se convierten en modelos semánticos y finalmente llegan a las personas, aplicaciones o agentes que necesitan utilizarlos.

Esta visión conecta directamente con mi formación en Ingeniería Industrial. Así como un proceso operativo debe analizarse de extremo a extremo, una solución analítica no puede optimizarse observando únicamente el tablero o la consulta final. Es necesario comprender las entradas, transformaciones, restricciones, transferencias, controles y consumidores que determinan el desempeño del sistema completo. Un pipeline es una línea de proceso; un modelo semántico es un contrato entre etapas; un tablero de Power BI es el punto de uso, no el proceso entero.

En Vesting ese sistema tenía un contorno concreto: la información llegaba desde las integraciones de los 27 agentes del inventario, pasaba por pipelines que la validaban y normalizaban, se conservaba en el lakehouse con el detalle de cada sesión, se organizaba en el warehouse para el consumo relacional, se convertía en modelos semánticos y terminaba en tableros para producto y operaciones, con hasta 23 agentes vigilados a la vez. Cada eslabón tenía una responsabilidad y una regla sobre qué entregaba al siguiente. Cuando algo fallaba en un indicador, el recorrido permitía ubicar en qué eslabón se había originado el problema en lugar de buscarlo en la visualización.

Esa manera de mirar la plataforma es la que aplico hoy en cualquier solución sobre Fabric: primero el recorrido del dato y sus consumidores, después los componentes que lo materializan.

## El lakehouse y el warehouse: dos formas complementarias de servir los datos

<!-- seccion: lago-y-almacen -->

En Vesting diseñé sobre Fabric un ecosistema que integraba almacenamiento analítico, procesamiento distribuido y estructuras orientadas al consumo: 120 tablas y 20 GB al cierre de mi etapa, con 1.000 eventos nuevos por día. El propósito no era utilizar diferentes componentes por sofisticación tecnológica, sino asignar cada carga de trabajo al mecanismo más adecuado según la naturaleza de los datos, la forma de transformación y las necesidades de consulta.

El lakehouse proporcionaba una base flexible para recibir, conservar y procesar información estructurada y semiestructurada procedente de las integraciones de los agentes. Permitía trabajar con grandes volúmenes, utilizar procesamiento distribuido con Spark y preservar suficiente detalle para reconstruir sesiones, analizar comportamientos y desarrollar nuevas transformaciones sin depender exclusivamente de un esquema relacional definido desde el comienzo.

Sin embargo, un lakehouse no debe entenderse como un lugar donde los datos se conservan indefinidamente sin estructura. La flexibilidad necesita organización. Los datos deben avanzar desde su recepción hacia capas progresivamente más confiables, con reglas de calidad, estructuras consistentes y significado suficiente para que puedan reutilizarse. Conservar el detalle no implica renunciar al modelado.

El warehouse cumplía una función complementaria. Permitía organizar información estructurada mediante un enfoque relacional, desarrollar transformaciones y vistas en T-SQL orientadas al análisis y responder con claridad a cargas de trabajo que requerían SQL, consistencia y una estructura preparada para el consumo empresarial.

No considero que el lakehouse sea simplemente el lugar de los datos crudos y el warehouse el lugar de los datos terminados. La diferencia es más profunda. Cada uno responde a estilos de desarrollo, tipos de datos y cargas de trabajo diferentes. El lakehouse favorece escenarios de ingeniería, ciencia de datos y procesamiento mediante Spark. El warehouse fortalece escenarios relacionales, transformaciones mediante T-SQL y consultas empresariales estructuradas.

## OneLake y la decisión de usar los dos

<!-- seccion: onelake-y-la-decision -->

La decisión entre lakehouse y warehouse tampoco tiene que ser excluyente. Una arquitectura puede utilizar ambos cuando existe una razón funcional clara. En Vesting la había: el lakehouse conservaba y transformaba los eventos de los agentes con alta granularidad —sesión, solicitud, respuesta, tiempo, estado, costo—, mientras el warehouse organizaba las estructuras orientadas a consumidores que requerían relaciones, métricas y consultas predecibles, como los tableros de producto y operaciones. Lo importante es evitar duplicaciones innecesarias y mantener reglas claras sobre dónde se produce cada transformación y qué activo constituye la referencia para cada uso.

La integración bajo OneLake permite que estos componentes participen en una arquitectura común y utilicen formatos abiertos: las tablas se almacenan en Delta Parquet y el mismo dato puede ser leído por Spark, por el motor SQL y por el modelo semántico sin copiarse. Esa es la promesa concreta de la plataforma: una sola copia del dato y varios motores encima. Sin embargo, compartir una plataforma no elimina automáticamente la necesidad de diseñar. Todavía es necesario definir responsabilidades, capas, convenciones, controles de calidad, relaciones y criterios para decidir qué información está preparada para cada consumidor.

Por eso, antes de crear un artefacto en Fabric me hago tres preguntas: quién va a consumir este dato y con qué motor, qué transformación le falta para ser confiable y cuál de las copias posibles será la referencia. Cuando la respuesta a la tercera es «varias», la arquitectura todavía no está terminada.

La arquitectura correcta no es la que incorpora más componentes, sino la que organiza el recorrido del dato con la menor complejidad necesaria. Mi función consiste en definir ese recorrido, asignar responsabilidades y asegurar que cada capa agregue valor sin perder trazabilidad.

## Los pipelines: preparar, validar, no repetir

<!-- seccion: pipelines -->

La preparación empieza con Power Query y con los pipelines de Fabric: conexión con las fuentes, preparación y construcción de las tablas del modelo, como pasos separados y con nombres que se entienden. Esa forma de organizar la preparación no nació en Vesting. En Banco Pichincha, en 2023, reorganizar los procesos ETL con esa lógica redujo un 35 % los tiempos de análisis; en Vesting, cada flujo validaba la estructura de los eventos que llegaban de las integraciones, conservaba los identificadores de contexto —agente, cliente, sesión— y los normalizaba en el ingreso, para que el resto del recorrido trabajara sobre una representación común.

Tres decisiones se repiten en todos mis pipelines. La primera es seleccionar filas y columnas lo más temprano posible y preservar el plegado de consultas hacia el origen cuando la fuente lo permite: lo que el origen puede filtrar no debería viajar para ser descartado después. La segunda es mantener tipos de datos consistentes y lógica reutilizable en vez de repetida por consulta: una transformación que se necesita en tres tablas se escribe una vez y se referencia. La tercera son las validaciones dentro del pipeline —valores faltantes, tipos inesperados, duplicados, relaciones que no cierran— para que las excepciones sean visibles antes de llegar al modelo y no en una revisión manual al final.

Un pipeline de datos no es únicamente una tubería que transporta información. Es el proceso mediante el cual los eventos de una organización se convierten en una representación analítica de su realidad. Cada transformación incorpora decisiones sobre calidad, temporalidad, granularidad, relaciones y reglas de negocio, y por eso se documenta como lo que es: una decisión de negocio expresada en código.

Diseño los pipelines a partir de sus consumidores y de las decisiones esperadas, pero sin acoplarlos exclusivamente a un reporte específico. Necesito comprender qué preguntas deben responderse, qué nivel de detalle debe conservarse, con qué frecuencia se necesita la información y qué reglas determinan cuándo un dato puede considerarse suficientemente confiable para avanzar.

## El pipeline como sistema de producción analítica

<!-- seccion: pipeline-analitico -->

La ingestión debe preservar la procedencia y los identificadores necesarios para reconstruir el recorrido de la información. La transformación debe hacer explícitas las reglas que convierten registros operativos en entidades analíticas. Los controles de calidad deben detectar valores faltantes, duplicidades, relaciones inconsistentes y condiciones que puedan alterar materialmente los resultados.

También procuro separar las etapas de recepción, preparación y consumo. Esta separación permite investigar errores sin reconstruir todo el proceso, reutilizar transformaciones, incorporar nuevas fuentes y modificar una capa sin alterar innecesariamente las demás. En Vesting esa separación era la que permitía que una integración nueva entrara sin tocar las anteriores: la capa de recepción absorbía la variación de cada agente y, a partir de la preparación, todo hablaba el mismo idioma. El objetivo no es crear complejidad arquitectónica, sino contenerla y hacerla comprensible.

La Ingeniería Industrial influye directamente en esta forma de diseñar. Analizo el pipeline como una línea de proceso: observo entradas, capacidades, restricciones, acumulaciones, tiempos, desperdicios, excepciones y resultados. Una transformación innecesariamente repetida equivale a un reproceso. Una dependencia oculta representa un riesgo operacional. Un cuello de botella en la preparación puede inutilizar una solución aunque el tablero final esté correctamente construido.

La optimización tampoco consiste únicamente en disminuir el tiempo de ejecución. Un pipeline más rápido, pero imposible de comprender o mantener, puede trasladar el costo hacia el futuro. Una consulta rápida pero ilegible es deuda técnica. Busco equilibrar rendimiento, trazabilidad, modularidad y facilidad de evolución.

Esta perspectiva se extiende naturalmente hacia la inteligencia artificial. Los modelos, las aplicaciones y los agentes necesitan datos preparados para su propósito, con contexto suficiente y condiciones claras de uso. Una arquitectura analítica moderna no debe servir únicamente a los tableros de Power BI. También debe preparar activos que puedan ser utilizados de manera segura y consistente por soluciones inteligentes.

## Sé DAX: el modelado semántico y DAX, donde se gana o se pierde la confianza

<!-- seccion: modelado-semantico -->

El modelo semántico es una de las capas menos visibles de una solución analítica y, al mismo tiempo, una de las que más determina su valor. Es el lugar donde las tablas se convierten en entidades del negocio, las relaciones adquieren significado y las reglas de cálculo se transforman en medidas DAX que diferentes personas pueden utilizar de manera consistente.

Un buen modelo permite que un concepto conserve la misma definición a través de diferentes reportes y experiencias analíticas. Un modelo fragmentado obliga a reconstruir la lógica en cada producto y produce múltiples versiones de una misma métrica. Cuando dos personas llegan a una reunión con resultados diferentes para el mismo indicador, el problema rara vez se resuelve modificando el color de una visualización. Es necesario revisar la semántica, las relaciones, las transformaciones y las reglas que producen la cifra.

Sin embargo, el modelo semántico no crea por sí solo el consenso. La definición debe ser acordada por los responsables del negocio, documentada y asociada con una responsabilidad institucional. El modelo convierte ese acuerdo en una regla reutilizable y controlada, pero no reemplaza la conversación necesaria para determinar qué significa realmente cada concepto. La tecnología preserva la definición; la organización debe establecerla. En Banco Pichincha, en 2023, esa conversación era parte del trabajo de co-liderar la gobernanza de datos del área: un indicador con dos definiciones era un problema de gobierno antes que un problema de DAX.

También comprendo el modelo semántico como un contrato entre la arquitectura de datos y las personas que toman decisiones. El warehouse o el lakehouse pueden conservar grandes volúmenes y estructuras técnicamente correctas, pero el modelo semántico organiza la forma en que la organización entiende esos datos. Define qué entidades son relevantes, cómo se relacionan y qué medidas permiten evaluar su comportamiento.

## Optimizar modelos semánticos con DAX Studio y Tabular Editor en Banco Pichincha

<!-- seccion: dax-studio-y-tabular-editor -->

En Banco Pichincha mi trabajo no se limitó a optimizar el análisis de datos en términos generales. Optimicé tanto los modelos semánticos que sostenían las soluciones de Power BI como la forma en que esos modelos sostenían el análisis. Esto incluyó revisar estructuras, relaciones, medidas, contextos de cálculo, organización de objetos, tiempos de consulta y patrones que podían generar procesamiento innecesario, en un entorno donde los tableros habían sido adoptados por más de 50 usuarios y cada segundo de espera se multiplicaba por esa audiencia.

Utilicé DAX Studio para observar el comportamiento interno de las consultas, establecer líneas base de rendimiento, identificar medidas costosas y analizar cómo el motor resolvía diferentes contextos de filtro. La optimización no consistía en sustituir una fórmula compleja por otra igualmente difícil de comprender. El objetivo era reducir trabajo innecesario, reutilizar lógica y conservar medidas suficientemente claras para ser validadas y mantenidas. Una medida que pasaba de recorrer una tabla de hechos entera a apoyarse en una relación bien definida se medía antes y después, y la mejora quedaba registrada con su cifra.

Utilicé Tabular Editor para fortalecer la estructura, organización y mantenibilidad de los modelos. Esto permitía administrar medidas, propiedades, metadatos, carpetas de visualización y elementos reutilizables de una manera más consistente. La herramienta facilitaba tratar el modelo como un activo de ingeniería y no únicamente como una configuración interna del archivo de Power BI.

La optimización del modelo semántico y la optimización del análisis de datos no son logros separados. Un modelo más claro, eficiente y consistente permite que los análisis respondan con mayor rapidez, reduce discrepancias, facilita la incorporación de nuevos productos y disminuye la dependencia del desarrollador original. En el banco, esa disminución de la dependencia importaba porque el equipo de BI que lideraba tenía cinco personas y los modelos debían sobrevivir a la rotación.

Mi especialidad en Power BI se concentra en esta convergencia: preparar los datos, modelar el dominio, construir medidas verificables, optimizar su funcionamiento y convertir ese sistema en una experiencia de análisis que las personas puedan utilizar con confianza.

## Direct Lake, importación, DirectQuery y RLS: los modos y la seguridad del modelo en Vesting

<!-- seccion: direct-lake-y-rls -->

En Vesting los modelos semánticos combinaban modos de almacenamiento según el uso. Direct Lake para lo que debía verse al momento: el modelo lee las tablas Delta del lakehouse directamente desde OneLake, sin una copia importada y sin el costo de una consulta relacional por cada visual, lo que lo hacía adecuado para los tableros operativos de monitoreo de agentes. Importación para el histórico agregado, donde la velocidad de respuesta y la estabilidad de las cifras pesaban más que la frescura. DirectQuery donde el detalle no cabía en memoria y solo se consultaba de forma esporádica, por ejemplo al bajar hasta los eventos de una sesión concreta.

Elegir el modo es una decisión de arquitectura y no una casilla de configuración. Depende de la frecuencia de actualización que el consumidor necesita, del volumen que cabe en memoria, del costo de capacidad que cada consulta genera y de qué tan predecibles son las preguntas. Un mismo modelo puede combinar los tres, y en Vesting lo hacía.

La seguridad forma parte del modelo. Con seguridad a nivel de fila (RLS), cada usuario ve solo lo suyo sobre un mismo modelo semántico, en vez de mantener un modelo por audiencia con la lógica duplicada en cada uno. Las reglas de RLS se definen como filtros DAX sobre las tablas de dimensión y se prueban suplantando roles antes de publicar. En una plataforma que integraba información de 12 clientes, esa capa se complementaba con el aislamiento de arquitectura: workspaces separados por cliente, de modo que la separación no dependiera únicamente de un filtro dentro del modelo.

Esta capacidad es especialmente importante para la inteligencia artificial. Un agente puede consultar tablas o documentos directamente, pero una capa semántica gobernada reduce ambigüedades y proporciona definiciones consistentes. Cuando conceptos críticos ya tienen relaciones, medidas y reglas controladas, las soluciones inteligentes pueden utilizar una representación empresarial más estable en lugar de inferir significados a partir de estructuras técnicas aisladas.

## Power BI: la experiencia de decisión, no el objetivo final

<!-- seccion: power-bi -->

Power BI aparece a lo largo de toda mi trayectoria. Comenzó como parte de mi formación analítica, se consolidó en el análisis de la operación de TransMilenio con C&M Consultores, permitió instrumentar la implementación de un sistema de gestión de almacenes en Cafam con un BI de control adoptado por más de 15 usuarios, alcanzó una adopción superior a cincuenta usuarios en Banco Pichincha y actualmente sostiene, en la Fundación CTIC, 42 productos analíticos en uso para 20 líderes de 15 procesos y unos 75 usuarios, dirigidos a líderes administrativos y asistenciales del sector salud.

Con los años dejé de entenderlo como el entregable. El producto visible puede ser un tablero, pero el resultado esperado es una decisión mejor sustentada, una conversación más clara o una capacidad institucional para comprender el comportamiento de sus procesos.

Por eso, el desarrollo comienza antes de abrir la interfaz. Primero identifico el proceso, la audiencia, la pregunta y la decisión. Después defino las entidades, relaciones, eventos y medidas necesarias para representar la situación. Solo entonces diseño la experiencia visual mediante la cual una persona podrá recorrer la información.

También separo conceptualmente el modelo semántico de la experiencia de consumo. El modelo debe concentrar las relaciones, definiciones y medidas que necesitan reutilización y gobierno. El reporte debe concentrarse en la navegación, el contexto y las preguntas de una audiencia específica. Esta separación permite desarrollar diferentes experiencias analíticas sobre una misma base de significado sin duplicar la lógica en cada producto.

Esta arquitectura también fortalece el autoservicio gobernado. Los usuarios pueden explorar, combinar perspectivas y construir nuevas experiencias sin redefinir individualmente las métricas críticas. La autonomía se desplaza hacia el análisis, mientras la semántica compartida protege la consistencia de la información.

## Proceso, interacción y adopción: lo que la ingeniería y el diseño industrial aportan a un tablero

<!-- seccion: proceso-y-diseno-en-power-bi -->

La Ingeniería Industrial aporta la perspectiva de proceso. No organizo los tableros únicamente según la estructura de las áreas, porque un proceso puede atravesar varias unidades y acumular restricciones que ninguna observa en su totalidad. Power BI permite representar ese recorrido, hacer visibles sus relaciones y conectar indicadores de resultado con las condiciones que los producen. En la Fundación CTIC los tableros se organizan por procesos, no por dependencias, y en Cafam el BI de control del WMS seguía el flujo del medicamento por el centro de distribución en lugar de la estructura del organigrama.

El Diseño Industrial aporta la experiencia de interacción. La información debe tener jerarquía, la navegación debe responder a una lógica comprensible y cada elemento visual debe justificar el espacio que ocupa. La interfaz no debe exhibir la complejidad del modelo, sino permitir que la persona la recorra sin perder significado.

La adopción es, por ello, uno de mis principales indicadores de éxito. Un tablero puede cumplir todas las buenas prácticas técnicas y visuales y seguir sin generar valor si no forma parte de la rutina de decisión. La publicación es apenas el comienzo. La solución necesita acompañamiento, comprensión de las métricas, retroalimentación y evolución. En Banco Pichincha, el programa de formación en analítica que diseñé fue parte del producto y no un anexo: subió un 20 % la productividad en la preparación y uso de la información, y fue lo que convirtió a los más de 50 usuarios en usuarios de verdad y no en destinatarios de un enlace.

Cómo mido la adopción, qué la frena y cómo la trabajo en cada contexto está desarrollado en el documento sobre el BI que se adopta.

## Automatizar la construcción de artefactos de Power BI

<!-- seccion: automatizar-power-bi -->

También he trabajado en automatizar la construcción y modificación de artefactos de Power BI directamente sobre sus estructuras nativas: el formato de proyecto PBIP, con el modelo semántico y el reporte separados en carpetas versionables en lugar de un binario opaco. Este trabajo busca reducir actividades manuales repetitivas, aplicar reglas de manera consistente y permitir que componentes especializados asistan parte del ciclo de desarrollo.

El resultado más concreto es un agente construido y probado que crea el proyecto completo: el modelo semántico con sus relaciones y columnas, el ETL en Power Query M, las medidas DAX y las visuales, y que además puede extraer datos de las fuentes. No es una demostración: cada medida se prueba con una consulta antes de pasar de fase, el reporte pasa por un validador y una persona aprueba el render antes de que la corrida cierre. Está descrito, con sus cifras, en el documento sobre agentes.

Sin embargo, automatizar la herramienta no significa delegar indiscriminadamente el diseño. La selección de métricas, la semántica, la arquitectura y la experiencia de decisión necesitan criterios explícitos. La inteligencia artificial puede asistir la generación de artefactos, pero el propósito, la validación y la aceptación deben permanecer bajo responsabilidad profesional. El agente propone la lista de medidas; el autor del tablero la aprueba.

Power BI representa, en síntesis, el punto donde la arquitectura de datos se encuentra con las personas. Su valor no está únicamente en hacer visible la información, sino en conservar el significado construido a lo largo de todo el pipeline y transformarlo en una experiencia que facilite comprender, decidir y actuar.

## Preparar datos para personas, aplicaciones y agentes

<!-- seccion: datos-listos-para-ia -->

Una plataforma analítica contemporánea no debe diseñarse únicamente para producir reportes. Sus datos y modelos también pueden ser utilizados por aplicaciones, procesos automatizados y agentes de inteligencia artificial. Esto introduce nuevos consumidores, necesidades de contexto y responsabilidades de gobierno. En Vesting los consumidores eran, además de las personas de producto y operaciones, los propios agentes y las integraciones que los alimentaban.

Preparar datos para inteligencia artificial no consiste en entregar acceso indiscriminado al lakehouse o al warehouse. Es necesario identificar qué información está autorizada para cada propósito, qué nivel de detalle resulta necesario, cómo se preservará la procedencia y qué definiciones deben acompañar los datos para evitar interpretaciones incorrectas.

Los modelos semánticos pueden aportar una base particularmente valiosa. Las medidas gobernadas, las relaciones y la terminología empresarial permiten que una aplicación o un agente consulte conceptos que ya han sido definidos institucionalmente. Esto reduce la necesidad de duplicar lógica y disminuye el riesgo de que cada solución reconstruya de manera diferente el significado de la información.

También es necesario decidir cuándo el agente debe consultar datos estructurados, cuándo necesita recuperar conocimiento documental y cuándo debe combinar ambas fuentes. Una métrica oficial no debería ser recalculada libremente por un modelo generativo cuando ya existe una medida gobernada. De la misma manera, una explicación no debería limitarse a una cifra si la decisión requiere políticas, definiciones o contexto no estructurado.

El DP-600 proporciona la base para preparar, servir y gobernar estos activos. La ruta AI-103, en curso, extiende esa base hacia aplicaciones y agentes capaces de utilizar conocimiento y herramientas. La ruta AI-300, también en curso, incorpora las prácticas necesarias para evaluar, observar y mantener esas capacidades cuando comienzan a operar de manera sostenida.

Esta convergencia define una parte esencial de mi perfil. No construyo primero la plataforma analítica y después agrego inteligencia artificial como una capa independiente. Diseño el recorrido completo para que los datos puedan sostener análisis humano, experiencias en Power BI y soluciones inteligentes bajo definiciones, controles y responsabilidades compartidas.

## El gobierno técnico de la plataforma

<!-- seccion: gobierno-tecnico -->

Gobernar una plataforma analítica significa mantener control sobre la identidad, la procedencia, el significado, la calidad y las condiciones de uso de la información. No consiste únicamente en conceder permisos ni en mantener documentación separada de la operación.

En Vesting, el gobierno debía incorporarse desde el diseño porque la plataforma recibía información asociada con 12 clientes distintos, sus integraciones y sus agentes. Los identificadores, la propiedad, el contexto y las condiciones de acceso no podían incorporarse después de construir los productos analíticos. Debían preservarse desde el ingreso del primer evento. El mecanismo de aislamiento fue arquitectónico: workspaces separados por cliente sobre estructuras de eventos comunes, de manera que la separación no dependiera de la disciplina de quien consultaba, sino del lugar donde vivía cada dato.

Microsoft Fabric ofrece una ventaja importante al integrar almacenamiento, procesamiento, modelado y consumo dentro de un ecosistema común. Esta cercanía reduce algunas fronteras técnicas en las que normalmente se fragmentan las identidades, los permisos y el linaje.

Sin embargo, una plataforma integrada no produce gobierno automáticamente. Todavía es necesario definir responsabilidades, organizar los espacios de trabajo, establecer criterios de acceso, documentar transformaciones, diferenciar ambientes de desarrollo y producción y controlar cómo evolucionan los activos analíticos.

La integración técnica de Fabric crea una base favorable, pero el gobierno continúa siendo una disciplina de arquitectura y responsabilidad. La herramienta proporciona capacidades; la organización debe convertirlas en reglas, prácticas y decisiones aplicables. El marco completo con el que trabajo el gobierno de datos y de IA —en banca, en la plataforma de agentes y hoy en salud bajo ISO/IEC 42001— está en su propio documento.

## Linaje, ciclo de vida y agentes como nuevos consumidores

<!-- seccion: linaje-y-nuevos-consumidores -->

El linaje debe permitir recorrer un resultado desde Power BI hasta las estructuras y transformaciones que lo sustentan. Fabric lo expone de forma nativa entre sus artefactos —del tablero al modelo, del modelo a la tabla del lakehouse, de la tabla al pipeline que la cargó—, pero la documentación debe explicar no solo de dónde proviene un dato, sino también qué reglas modificaron su significado. Los responsables necesitan comprender qué consecuencias puede tener un cambio antes de aplicarlo.

El gobierno también comprende el ciclo de vida. Los modelos, pipelines y reportes deben poder evolucionar sin introducir cambios inesperados sobre quienes los utilizan. Esto exige procesos de desarrollo, validación, publicación y seguimiento proporcionales a la importancia de cada activo. En Vesting, un cambio en la estructura de eventos de una integración se trataba como un cambio de contrato: se validaba en la capa de recepción antes de que pudiera tocar un modelo semántico.

En plataformas destinadas también a soluciones de inteligencia artificial, el gobierno debe extenderse hacia los nuevos consumidores. No basta con definir quién puede consultar un dato. Es necesario establecer qué aplicación o agente puede utilizarlo, para qué propósito, con qué nivel de detalle y bajo qué mecanismos de supervisión. Un agente que lee una medida gobernada hereda su definición; un agente que lee una tabla cruda hereda la obligación de interpretarla, y esa obligación debe estar escrita en alguna parte.

## El ciclo de vida de los activos analíticos

<!-- seccion: ciclo-de-vida-analitico -->

Una plataforma analítica empresarial no queda terminada cuando el pipeline ejecuta correctamente o cuando el reporte ha sido publicado. Los datos, las definiciones, las reglas y las necesidades de los usuarios cambian. Por eso, los activos necesitan un ciclo de vida que permita desarrollarlos, validarlos, publicarlos, observarlos y modificarlos sin perder control sobre sus efectos.

Procuro diferenciar claramente los estados de una solución. Una transformación en desarrollo no debe tratarse como una fuente confiable para decisiones. Un modelo que todavía está siendo validado no debe sustituir silenciosamente al que utiliza la operación. Un reporte publicado no debe modificarse sin comprender qué personas, procesos o productos dependen de sus métricas. En Fabric esa diferenciación se apoya en workspaces separados por ambiente y en pipelines de despliegue entre ellos; en la Fundación CTIC, con 42 productos analíticos en uso, la separación es lo que permite corregir un modelo sin que 75 usuarios vean una cifra a medias.

Esta disciplina exige controlar cambios sobre pipelines, modelos semánticos, medidas y reportes. Cada modificación relevante debe conservar una razón, un responsable y una forma de verificar que el resultado continúa siendo correcto. La profundidad del control debe ser proporcional al impacto del activo: no todos los cambios necesitan el mismo proceso, pero ninguno debería introducirse sin conocer sus posibles consecuencias.

Esta forma de trabajo conecta directamente con mi experiencia en procesos y calidad, que empezó bajo ISO 9001:2015 en Inglopres. Un activo analítico necesita responsables, criterios de aceptación, controles, evidencia y mejora continua. El DP-600 formaliza esta disciplina dentro del ciclo de vida de Microsoft Fabric, mientras la ruta AI-300 la amplía hacia la operación de modelos, aplicaciones generativas y agentes de inteligencia artificial.

## Pruebas, reversibilidad y retiro de un activo analítico

<!-- seccion: pruebas-reversibilidad-y-retiro -->

Las pruebas deben incluir tanto comportamiento como datos. Un despliegue puede completarse técnicamente y, aun así, producir cifras incorrectas porque cambió una relación, una regla o la interpretación de una fuente. Por eso, además de verificar que los componentes funcionen, es necesario contrastar medidas críticas, conteos, relaciones y resultados esperados antes de considerar estable una nueva versión. Una prueba típica en mis modelos de Power BI es la conciliación: el total de una medida clave en el modelo nuevo debe coincidir con el del modelo vigente y con la fuente —tres cifras, una sola verdad—, y una diferencia que no se explica detiene la publicación.

También considero necesario diseñar la reversibilidad. Cuando un cambio produce un resultado inesperado, la organización debe poder identificar qué versión lo introdujo, comprender qué activos fueron afectados y restablecer una condición confiable mientras se investiga la causa. Versionar el modelo semántico como proyecto —con Tabular Editor o en formato PBIP, en un repositorio Git— es lo que hace posible ese retroceso: se compara el cambio, se identifica la medida o la relación que lo introdujo y se vuelve a la versión anterior sin reconstruir nada a mano. La capacidad de evolucionar con seguridad depende tanto de avanzar como de poder retroceder de manera controlada.

El ciclo de vida también comprende el retiro. Los modelos, reportes y pipelines que han dejado de responder a una necesidad no deben permanecer indefinidamente como activos aparentemente vigentes. Retirar una solución exige identificar sus consumidores, preservar la información necesaria, comunicar el cambio y evitar que continúe utilizándose una definición que ya no representa la realidad.

La diferencia entre construir un tablero y desarrollar una capacidad empresarial aparece con claridad en este punto. El tablero puede publicarse una vez. La capacidad necesita evolucionar sin perder definición, confiabilidad ni memoria sobre las decisiones que la construyeron.

## La optimización como disciplina de extremo a extremo

<!-- seccion: optimizacion-extremo-a-extremo -->

No entiendo la optimización como una actividad exclusiva de DAX, Power Query, SQL o Spark. El rendimiento de una solución analítica es el resultado acumulado de decisiones tomadas a lo largo de toda la arquitectura.

Una consulta lenta puede originarse en la lectura de un volumen innecesario, una transformación mal ubicada, un modelo con relaciones ambiguas, una medida costosa o una visualización que solicita más información de la necesaria. Optimizar únicamente la última capa puede ocultar temporalmente el síntoma sin corregir el mecanismo que lo produce.

Mi criterio es intervenir primero en la capa donde se origina el desperdicio. Si el pipeline traslada información innecesaria, la solución no debería comenzar reescribiendo una medida. Si la granularidad excede la necesidad del análisis, una visualización más simple no corregirá el costo estructural. Si el modelo contiene relaciones ambiguas, aumentar la capacidad únicamente ocultará temporalmente el problema. Optimizar exige identificar el mecanismo y no limitarse a aliviar el síntoma.

Es la misma lógica que aplicaba en planta cuando hacía estudio de tiempos en Inglopres: el cuello de botella se busca en la estación donde se acumula el trabajo, no en la última máquina de la línea. En un modelo de Vesting con 120 tablas, la primera pregunta ante un visual lento no era qué medida optimizar, sino si esa tabla de eventos debía estar en el modelo con ese nivel de detalle.

Por eso, comienzo por identificar dónde se consume el tiempo, la capacidad o la complejidad. Evalúo qué datos deben trasladarse, qué transformaciones pueden ejecutarse cerca del origen, qué agregaciones conviene materializar, qué granularidad necesita conservarse y qué cálculos deben resolverse en el modelo semántico.

## Dónde intervenir primero: Power Query, el modelo, DAX Studio y la capacidad

<!-- seccion: donde-intervenir-primero -->

En Power Query, intervenir primero implica reducir tempranamente columnas y filas innecesarias, preservar el plegado de consultas cuando es posible, evitar transformaciones repetidas y estructurar los pasos de manera comprensible. Una consulta que pliega al origen le delega a la base de datos el filtro y la agregación; una que no pliega descarga todo y filtra en memoria, y la diferencia se nota en el tiempo de actualización antes que en cualquier visual.

En el modelo semántico, implica revisar relaciones, cardinalidades, medidas, contextos y estructuras que afectan tanto el rendimiento como la mantenibilidad. Un esquema en estrella con dimensiones limpias y una tabla de hechos delgada rinde mejor y se entiende mejor que un modelo con relaciones de muchos a muchos improvisadas para salir del paso.

En DAX Studio puedo contrastar el comportamiento de las consultas y establecer si una modificación produce una mejora real: tiempo del motor de fórmulas frente al motor de almacenamiento, número de consultas internas, tamaño de los resultados intermedios. Tabular Editor permite fortalecer la estructura y aplicar prácticas consistentes sobre los objetos del modelo. Ninguna herramienta reemplaza el criterio, pero ambas proporcionan evidencia para decidir dónde intervenir. Así trabajé en Banco Pichincha en 2023, y así sigo trabajando.

La optimización también debe considerar la utilización de la capacidad y el costo. En Fabric, la capacidad es un recurso compartido que se consume en unidades y se comparte entre pipelines, consultas y modelos; una solución que responde rápidamente mediante un consumo desproporcionado puede no ser sostenible cuando aumentan los usuarios, los modelos o las cargas de trabajo. La arquitectura necesita responder correctamente hoy y conservar una ruta razonable para crecer.

El resultado que busco no es una cifra aislada de rendimiento. Es una solución equilibrada: suficientemente rápida para ser adoptada, clara para ser mantenida, gobernable para ser confiable y eficiente para poder escalar.

## Lo que estoy construyendo para demostrarlo en público

<!-- seccion: lo-publico -->

Mantengo en exploración, dentro de mi pipeline de aplicaciones, una pieza de analítica de extremo a extremo sobre Microsoft Fabric utilizando datos abiertos de Colombia. Su propósito es convertir en evidencia pública y reproducible las capacidades que el DP-600 valida y que he aplicado en entornos profesionales. Es una exploración declarada con esa palabra y sin fecha comprometida.

La pieza debe cubrir el recorrido completo: identificación de la fuente, ingestión, conservación de la información, transformación, validación de calidad, organización en lakehouse o warehouse, construcción del modelo dimensional, desarrollo del modelo semántico y creación de una experiencia analítica en Power BI.

No quiero publicar únicamente el tablero final. El valor demostrativo se encuentra precisamente en hacer visible aquello que normalmente permanece detrás: por qué se seleccionó cada componente, qué reglas transformaron la información, cómo se verificó la calidad, qué decisiones estructuraron el modelo y cómo se conserva la trazabilidad hasta las fuentes.

La arquitectura deberá justificar cuándo utiliza lakehouse, warehouse o ambos. También deberá demostrar cómo se separan las capas, cómo se administran los cambios y cómo se evita duplicar innecesariamente los datos o la lógica.

El modelo semántico tendrá un papel central. Deberá contener dimensiones y hechos comprensibles, medidas documentadas, relaciones verificables y una estructura capaz de sostener diferentes experiencias analíticas sin reconstruir el significado en cada reporte. Power BI deberá demostrar adopción potencial, no solamente diseño visual. La experiencia se organizará alrededor de preguntas y decisiones, con una navegación que permita avanzar desde la visión general hasta la evidencia que explica cada resultado.

## Qué tendrá que cumplir esa pieza para dejar de ser exploración

<!-- seccion: criterios-de-la-pieza -->

La pieza también debe preparar activos reutilizables por consumidores diferentes. Además del análisis humano, exploraré cómo determinadas definiciones, medidas o estructuras pueden ponerse a disposición de aplicaciones o agentes sin permitir que reconstruyan libremente la lógica institucional.

Permanece declarada como exploración porque todavía no cumple todos los criterios necesarios para incorporarse al inventario de las 32 piezas construidas de la vitrina. No cambiará de estado por tener una conexión funcionando o un tablero convincente. Deberá contar con arquitectura documentada, despliegue reproducible, controles de calidad, modelo semántico verificable, criterios de rendimiento y evidencia suficiente sobre sus resultados, que es el mismo listón que cumplen las 6 aplicaciones hermanas ya publicadas.

Cuando esté terminada, no sustituirá la evidencia de mi experiencia profesional ni de la certificación. Cumplirá otra función: permitirá que cualquier persona examine públicamente cómo convierto los principios de Fabric, Power BI, gobierno y preparación de datos para IA en una solución completa.

La forma de publicación de Power BI se definirá según las condiciones técnicas, de licenciamiento, seguridad y acceso disponibles para la pieza. El objetivo demostrativo no depende de imponer una modalidad específica de embebido, sino de hacer verificables el modelo, las medidas, la arquitectura y la experiencia analítica mediante un mecanismo compatible con esas condiciones.

## Lo que Fabric representa dentro de mi perfil

<!-- seccion: fabric-en-mi-perfil -->

Microsoft Fabric representa la convergencia entre varias capacidades que desarrollé inicialmente por separado. Integra la ingeniería necesaria para recibir y transformar datos, la arquitectura requerida para almacenarlos, el modelado que organiza su significado y Power BI como experiencia de análisis y decisión. Antes de Fabric, esas capacidades vivían en herramientas distintas: SQL y ETL desde Inglopres y TransMilenio, Power Query y DAX en Cafam y Banco Pichincha, la gobernanza en el banco. Fabric fue el lugar donde se juntaron sobre una sola plataforma.

Su importancia en mi perfil no proviene únicamente de haber obtenido el DP-600 ni de conocer sus componentes. Proviene de haber utilizado esa plataforma para resolver un problema especialmente exigente: construir desde cero, entre agosto de 2023 y enero de 2025, un ecosistema de datos para observar agentes de inteligencia artificial y transformar sus eventos en información útil para producto y operaciones. Cerré esa etapa al dejar el ecosistema y el proceso documentados.

Fabric también representa un puente hacia mi responsabilidad actual. Las organizaciones necesitan plataformas capaces de servir simultáneamente a analistas, procesos, aplicaciones y soluciones inteligentes. Esto exige datos confiables, modelos reutilizables, seguridad, gobierno y una arquitectura que permita incorporar nuevos usos sin reconstruir cada vez la base completa.

La Ingeniería Industrial aporta la visión del sistema y del flujo que la plataforma debe representar. El Diseño Industrial aporta la experiencia mediante la cual esa complejidad se vuelve utilizable. El DP-600 aporta la arquitectura analítica. La ruta AI-103 amplía el uso de esos activos hacia aplicaciones y agentes. La ruta AI-300 incorpora la disciplina necesaria para operar y observar las soluciones inteligentes que consumen esa información.

Mi especialidad no consiste en utilizar cada componente de Fabric de manera aislada. Consiste en decidir qué arquitectura necesita el problema, cómo debe recorrerla la información, qué significado conservará y de qué forma se convertirá en una capacidad de análisis o inteligencia artificial que la organización pueda utilizar con confianza.
