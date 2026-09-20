---
slug: agentes-en-produccion
titulo: "Agentes de IA en producción"
resumen: "El proceso core replicable de Vesting y los trece agentes que construí y publiqué."
estado: borrador
ancla: "/vitrina/agentes"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry construyendo agentes de IA?"
  - "¿Cómo se monitorea un agente de IA en producción?"
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

## Dos experiencias distintas, no una

<!-- seccion: dos-experiencias -->

Cuando hablo de mi experiencia con inteligencia artificial generativa y agentes de IA, me refiero a dos trayectorias que se complementan, pero que deben diferenciarse con precisión.

La primera corresponde a mi experiencia profesional en Vesting, una startup especializada en agentes de automatización, donde trabajé como Líder de Estrategia de Datos entre agosto de 2023 y enero de 2025. Allí diseñé desde cero la plataforma de datos que permitía integrar la información producida por los agentes, analizar su comportamiento y monitorear su operación. También definí, documenté y validé el proceso central utilizado para diseñar e implementar nuevas soluciones.

Ese proceso permitió construir veintisiete agentes para diferentes necesidades y contextos. Mi responsabilidad no consistía únicamente en observar los resultados finales, sino en desarrollar la estructura de datos, los mecanismos de seguimiento y la forma de trabajo necesaria para que las implementaciones pudieran repetirse con mayor consistencia.

La base de automatización utilizaba n8n como uno de sus componentes fundamentales. Sobre esa base se integraban los flujos, las fuentes, las reglas y los servicios necesarios para que los agentes participaran en procesos reales. Los detalles internos de la arquitectura, los componentes propios y la secuencia exacta de implementación forman parte del conocimiento confidencial de la organización y no los expongo en este documento.

La segunda trayectoria corresponde a mi propio ecosistema agéntico y a los agentes publicados en CV Viva. Este trabajo no es una extensión de la arquitectura de Vesting ni una reproducción de sus componentes. Es un sistema propio, construido posteriormente con otra visión, otros controles y un nivel de especialización orientado a producir activos verificables dentro de mi pipeline de aplicaciones, investigaciones, tableros y conocimiento profesional.

Actualmente, la vitrina reúne trece agentes publicados, cada uno con una función y una ficha técnica específica. Sin embargo, esos trece agentes no constituyen por sí solos el ecosistema completo. Son capacidades visibles construidas sobre una arquitectura común de harnesses, fuentes, herramientas, memoria, controles y reglas de coordinación.

En este ecosistema, los agentes no son automatizaciones independientes ni conversaciones especializadas. Operan mediante harnesses que delimitan su función, administran el contexto, seleccionan fuentes y herramientas, controlan las transiciones y verifican los resultados antes de permitir que el trabajo avance. El propósito no es multiplicar agentes, sino construir una arquitectura capaz de distribuir correctamente la responsabilidad entre código, modelos, conocimiento, controles y personas.

Separar ambas experiencias es importante. Vesting demuestra mi capacidad para construir una plataforma empresarial de datos y un proceso replicable alrededor de agentes utilizados en un entorno profesional. Mi ecosistema propio demuestra mi capacidad para diseñar arquitecturas agénticas avanzadas, gobernar el contexto, especializar harnesses y convertir la inteligencia generativa en una capacidad de producción intelectual verificable.

## El proceso central replicable en Vesting

<!-- seccion: el-proceso-core -->

En Vesting definí, documenté y validé el proceso central para diseñar e implementar agentes de inteligencia artificial. El propósito era evitar que cada solución comenzara desde cero, dependiera exclusivamente del conocimiento informal de las personas involucradas o reprodujera errores que ya habían sido resueltos en implementaciones anteriores.

El proceso estaba organizado en etapas generales que permitían comprender la necesidad, especificar el comportamiento esperado, construir la solución, validarla, incorporarla a la operación y aprender de su funcionamiento. No publico la secuencia interna, los entregables específicos ni los mecanismos propios utilizados en cada etapa porque forman parte del conocimiento confidencial de la empresa.

Lo relevante no es el nombre ni la cantidad exacta de etapas, sino la disciplina que introducía el proceso. Cada iniciativa debía comenzar con un problema y un propósito identificables. El comportamiento esperado debía traducirse en criterios verificables. La solución debía probarse antes de considerarse preparada para operar y su funcionamiento debía permanecer observable después de la implementación.

El proceso que diseñé y estructuré sirvió como marco para la construcción de veintisiete agentes. Esta cifra demuestra que no se trató de una propuesta conceptual aplicada a un único caso, sino de una capacidad utilizada de manera repetida para desarrollar soluciones con propósitos, integraciones y contextos diferentes. Mi contribución consistió en establecer la estructura común que permitía organizar esas implementaciones, conservar aprendizajes y distinguir qué elementos debían estandarizarse y cuáles necesitaban adaptarse a cada necesidad.

La lógica proviene directamente de mi formación en Ingeniería Industrial. Cuando cada unidad se construye de una manera completamente diferente, la organización no acumula aprendizaje y el costo de la siguiente entrega sigue siendo equivalente al de la primera. Un proceso central permite conservar memoria, reutilizar decisiones, establecer criterios de calidad y reducir la necesidad de improvisar frente a problemas ya conocidos.

La estandarización, sin embargo, no debía convertir a todos los agentes en la misma solución. El proceso establecía una forma común de trabajo, no un único comportamiento. Cada agente podía responder a un problema diferente, utilizar fuentes distintas y participar en procesos específicos, pero debía atravesar condiciones comparables de definición, construcción, validación y seguimiento.

Esta distinción fue uno de los principales aprendizajes de la experiencia. Replicar no significa copiar una solución. Significa disponer de una arquitectura de trabajo suficientemente estable para construir soluciones diferentes sin renunciar a los principios que protegen su calidad, trazabilidad y capacidad de evolución.

El verdadero activo no era, por tanto, ninguno de los veintisiete agentes de manera aislada. Era la capacidad de construir el siguiente sobre un conocimiento acumulado, con un proceso que reducía la incertidumbre y convertía cada implementación en una fuente de aprendizaje para las posteriores.

## De una demostración a un agente preparado para operar

<!-- seccion: de-demostracion-a-operacion -->

Una demostración convincente no era suficiente para considerar que un agente estaba preparado para operar. Antes de su implementación era necesario comprobar que la solución respondiera adecuadamente a los escenarios esperados, gestionara las principales excepciones y conservara un comportamiento consistente frente a entradas diferentes.

La evaluación debía partir del propósito del agente. No todos los sistemas necesitaban las mismas pruebas ni podían juzgarse mediante una única métrica. Un agente orientado a recuperar información debía evaluarse por la pertinencia y trazabilidad de sus fuentes. Uno que coordinaba herramientas debía demostrar que seleccionaba y utilizaba correctamente cada capacidad. Uno que producía resultados estructurados debía cumplir el contrato esperado sin introducir información no sustentada.

También era necesario evaluar las condiciones en las que la solución no debía continuar. Un agente preparado para operar necesitaba reconocer información insuficiente, errores en una integración, resultados contradictorios y situaciones que exigían intervención humana. La capacidad de abstenerse o transferir la responsabilidad formaba parte del comportamiento correcto.

Las pruebas debían incluir escenarios habituales, excepciones conocidas y condiciones límite. El objetivo no era demostrar que el agente podía completar una conversación ideal, sino observar cómo respondía cuando la realidad se apartaba del recorrido previsto. Allí se encontraba la diferencia entre una demostración y una capacidad operativa.

Esta disciplina continúa siendo central en mi trabajo actual. AI-300 profundiza precisamente en la evaluación, observabilidad y operación de soluciones generativas y agentes. Mi experiencia práctica me permitió comprender antes de abordar esa ruta formal que el despliegue no constituye el final del desarrollo, sino el comienzo de una evaluación continua frente al comportamiento real.

## n8n como base de automatización, no como arquitectura completa

<!-- seccion: n8n-como-base -->

n8n constituía una base fundamental para la automatización y coordinación de los flujos de los agentes en Vesting. Permitía conectar servicios, organizar secuencias de trabajo, ejecutar reglas e integrar diferentes componentes dentro de procesos que necesitaban operar de manera consistente.

Sin embargo, utilizar n8n no significaba que la arquitectura se redujera a una colección de flujos visuales. El valor empresarial no se encontraba en conectar nodos, sino en definir correctamente qué información ingresaba, qué transformación debía ocurrir, qué servicio o componente intervenía, qué resultado se esperaba y cómo debía manejarse una excepción.

La plataforma debía proporcionar a esos flujos una base de datos y observabilidad. Sin ella, cada automatización podía completar tareas, pero la organización tendría dificultades para comparar comportamientos, reconstruir ejecuciones, analizar tendencias y comprender qué estaba ocurriendo en producción.

Mi trabajo consistió en conectar esa capa de ejecución con una arquitectura de datos capaz de conservar los eventos, organizar la telemetría y convertir el funcionamiento de los agentes en información analizable. n8n coordinaba parte de la ejecución; Microsoft Fabric proporcionaba la base para integrar, transformar y analizar la evidencia producida por esa operación.

Esta separación entre ejecución y observación resultaba esencial. El componente que realiza el trabajo no debería ser el único que afirma que el trabajo se realizó correctamente. La plataforma analítica debía aportar una mirada independiente sobre volúmenes, estados, tiempos, excepciones y resultados.

También aprendí que una herramienta de automatización puede acelerar considerablemente la construcción, pero no elimina la necesidad de arquitectura. A medida que aumentan los agentes, las integraciones y las excepciones, se vuelve indispensable establecer convenciones, responsabilidades, patrones reutilizables y mecanismos de control que eviten que cada flujo se convierta en una pieza imposible de comprender fuera de su creador.

Por esa razón, describo n8n como una base fundamental y públicamente mencionable, pero no como la explicación completa de la solución. Los detalles adicionales pertenecen a la arquitectura interna de Vesting y deben permanecer protegidos.

## Monitorear un agente no es comprobar que está disponible

<!-- seccion: monitorear-no-es-mirar-si-esta-arriba -->

En Vesting implementé capacidades de captura, almacenamiento y análisis para monitorear agentes en producción. El objetivo no era comprobar únicamente que un servicio estuviera disponible, sino construir evidencia sobre la forma en que cada solución se comportaba durante su operación.

Un agente puede permanecer técnicamente disponible y responder con fluidez mientras la calidad de sus resultados se deteriora. También puede producir una respuesta adecuada con una latencia, un costo o una cantidad de reintentos que hagan inviable su utilización sostenida. Por eso, la disponibilidad es apenas una dimensión de la observabilidad.

Era necesario conservar información suficiente para reconstruir las ejecuciones y analizar qué había ocurrido. Esto implicaba relacionar solicitudes, sesiones, estados, tiempos, respuestas, excepciones y otros eventos relevantes, manteniendo el contexto necesario para identificar diferencias entre agentes, integraciones y periodos.

La reconstrucción de una sesión era especialmente valiosa. Un resultado final podía mostrar que la ejecución había fallado, pero no necesariamente explicaba dónde se había originado el problema. Observar la secuencia permitía identificar si la dificultad aparecía en la información de entrada, en una integración, en una respuesta intermedia, en una regla o en el resultado producido.

Microsoft Fabric permitió estructurar el recorrido de esos eventos desde su captura hasta el análisis. Power BI convirtió la telemetría en una experiencia utilizable por producto y operaciones, organizando indicadores que ayudaban a identificar condiciones relevantes y profundizar en las ejecuciones asociadas.

La observabilidad debía integrar dimensiones técnicas y funcionales. Las métricas de volumen, tiempos y errores ayudaban a comprender la salud operativa. Sin embargo, la calidad del resultado requería criterios adicionales y, en determinados casos, revisión humana. Un sistema de monitoreo serio debe reconocer que responder no equivale necesariamente a responder bien.

También debía observarse el costo de la operación. En soluciones generativas, la arquitectura, el tamaño del contexto, los reintentos y el uso de herramientas pueden modificar considerablemente el consumo. Esta información resulta indispensable para distinguir una demostración funcional de una capacidad sostenible.

La lección principal fue que no es posible gobernar una solución inteligente cuya operación permanece invisible. Cuanto mayor es la capacidad del agente para recomendar, coordinar herramientas o ejecutar acciones, más importante resulta conservar evidencia sobre lo que recibió, los componentes que utilizó y el resultado que produjo.

## Dash Agent AI y la transparencia sobre el contexto

<!-- seccion: dash-agent-ai -->

El problema de la observabilidad continuó interesándome después de Vesting y dio origen a Dash Agent AI, una aplicación propia publicada en mi vitrina. Esta pieza no forma parte de la plataforma desarrollada para la empresa ni utiliza su arquitectura confidencial. Es una aplicación independiente orientada a hacer visible una pregunta diferente: qué información conoce, conserva o utiliza un agente sobre la persona con la que interactúa.

Dash Agent AI convierte una dimensión abstracta de la confianza en una experiencia examinable. En lugar de pedir al usuario que acepte de forma general que un agente utiliza contexto o memoria, la aplicación busca mostrar qué elementos están disponibles y cómo pueden influir sobre la interacción.

La aplicación opera localmente y evita llamadas de red salientes durante su ejecución. Utiliza un índice en SQLite y cuenta con un conjunto amplio de pruebas que protege su comportamiento. Estas decisiones responden a una misma orientación: demostrar que la transparencia, la privacidad y la verificabilidad pueden incorporarse a la arquitectura y no añadirse únicamente como declaraciones sobre el producto.

La ejecución local reduce la exposición innecesaria de la información y permite que el usuario examine la capacidad sin enviar sus datos a un servicio externo. El índice organiza el conocimiento disponible y las pruebas permiten validar que las funciones esenciales se mantienen cuando la aplicación evoluciona.

Dash Agent AI también evidencia una diferencia importante entre telemetría y transparencia. La telemetría ayuda al equipo responsable a comprender el comportamiento técnico de una solución. La transparencia ayuda a la persona afectada a comprender qué información interviene en su experiencia. Ambas son necesarias, pero responden a audiencias y responsabilidades distintas.

Esta pieza conecta mi formación en Diseño Industrial con mi trabajo en inteligencia artificial. No basta con que una arquitectura sea técnicamente observable para sus desarrolladores. También es necesario diseñar formas comprensibles de comunicar al usuario qué ocurre, qué puede controlar y qué límites debe reconocer.

## Mi ecosistema agéntico propio

<!-- seccion: ecosistema-agentico-propio -->

Mi trabajo propio evolucionó hacia un ecosistema agéntico avanzado que no reproduce la arquitectura utilizada en Vesting ni se limita a los agentes publicados individualmente en la vitrina. Es una estructura de nivel superior diseñada para coordinar agentes, harnesses, conocimiento, herramientas, controles y memoria dentro de un mismo sistema de producción.

Los agentes publicados son las capacidades visibles. El ecosistema es la infraestructura lógica que establece cómo se seleccionan, cómo reciben contexto, qué herramientas pueden utilizar, qué entregables producen y qué controles deben superar. Esta distinción es esencial porque la sofisticación no reside en la cantidad de agentes, sino en la arquitectura que permite que trabajen de manera coordinada.

Cada harness funciona como un entorno de ejecución especializado. Define la función del agente, las instrucciones aplicables, las fuentes autorizadas, las herramientas disponibles, el contrato de entrada y salida, las validaciones y las condiciones de excepción. El modelo aporta capacidad generativa, pero el harness transforma esa capacidad en un comportamiento delimitado y evaluable.

Distingo con claridad entre el agente y el harness que controla su ejecución. El agente representa la capacidad especializada de interpretar, razonar, generar o coordinar una tarea. El harness establece las condiciones bajo las cuales esa capacidad puede operar: prepara el contexto, habilita las herramientas, valida las entradas, controla las salidas, conserva el estado y decide qué hacer cuando aparece una excepción.

Esta separación permite que la inteligencia del modelo evolucione sin obligar a reconstruir toda la arquitectura de control. También permite mejorar las reglas, las fuentes, los validadores o la administración del contexto sin confundir esos cambios con las capacidades propias del agente. El modelo puede cambiar; la responsabilidad del sistema debe permanecer explícita.

La arquitectura evita depender de un agente generalista que reciba todo el conocimiento, todas las herramientas y todas las responsabilidades en cada ejecución. Ese enfoque incrementa el contexto, amplía el espacio de error y dificulta determinar qué componente produjo un resultado. En su lugar, distribuyo el trabajo entre capacidades especializadas con criterios explícitos de coordinación.

El ecosistema administra el contexto como un recurso limitado. Ningún componente debería recibir información simplemente porque está disponible. Debe utilizar únicamente el contexto requerido para cumplir su función, junto con la evidencia necesaria para sostener el resultado. Esta selección reduce ruido, mejora la concentración de la tarea y evita consumir tokens en información irrelevante.

La economía de tokens no se persigue mediante la simple reducción del contexto. Un contexto insuficiente puede disminuir el costo y destruir la calidad. El objetivo es maximizar la utilidad de cada fragmento de información suministrado al modelo mediante recuperación selectiva, instrucciones especializadas, resúmenes estructurados, reutilización de resultados y separación de tareas deterministas.

El código resuelve aquello que requiere exactitud, repetibilidad o una validación inequívoca. Los modelos intervienen cuando la tarea necesita interpretación, síntesis, generación o coordinación flexible. Los agentes no reemplazan indiscriminadamente los mecanismos convencionales; participan únicamente donde su capacidad produce un valor necesario.

La memoria también se diseña por función. No todo lo ocurrido debe acompañar todas las ejecuciones futuras. El ecosistema diferencia entre decisiones persistentes, resultados reutilizables, contexto temporal y detalle que puede descartarse después de cumplir su propósito. Esta disciplina reduce acumulación, evita contradicciones y mantiene la información relevante cerca del componente que realmente la necesita.

La coordinación no se limita a transferir texto entre agentes. Cada transición debe comunicar un resultado estructurado, el estado de la tarea, la evidencia disponible y las condiciones pendientes. Esto permite que el siguiente harness reciba un insumo verificable y no tenga que interpretar libremente la intención del componente anterior.

La identidad y los permisos forman parte de la arquitectura. Un agente no debe tener acceso a todas las fuentes o herramientas solo porque técnicamente pueda utilizarlas. Cada harness debe habilitar únicamente las capacidades necesarias para su función y evitar que una instrucción inesperada amplíe de manera implícita su espacio de actuación.

La autonomía también debe ser proporcional al riesgo. Algunas tareas pueden ejecutarse directamente porque son reversibles, verificables y de bajo impacto. Otras deben producir una recomendación o preparar una acción para aprobación. Cuando la consecuencia es significativa, difícil de revertir o insuficientemente observable, la responsabilidad debe permanecer en una persona.

Este enfoque evita confundir sofisticación con independencia. Un ecosistema avanzado no es aquel que elimina toda intervención humana, sino el que distribuye correctamente la responsabilidad y puede explicar por qué una acción fue ejecutada, detenida o transferida.

El resultado es un ecosistema en el que la precisión surge de la arquitectura completa. La especialización reduce la ambigüedad. La recuperación selectiva mejora la pertinencia del contexto. Los contratos estructuran las transiciones. Los controles hacen visibles las desviaciones. La observabilidad permite identificar dónde se produjo un problema. La intervención humana permanece disponible cuando la solución encuentra una condición que excede sus límites.

No describo este ecosistema como poderoso por la cantidad de modelos o agentes que contiene. Su nivel se demuestra en la forma en que administra complejidad, contexto, evidencia, consumo, responsabilidad y aprendizaje acumulativo. Es una arquitectura diseñada para convertir la inteligencia generativa en una capacidad dirigida, eficiente y gobernable.

## Fuentes o vacío declarado

<!-- seccion: fuentes-o-vacio -->

Los agentes de mi vitrina comparten una regla que resume mi postura sobre inteligencia artificial generativa: ninguna afirmación verificable debe depender únicamente de la memoria del modelo.

Cuando una respuesta requiere evidencia, el agente debe utilizar una fuente autorizada, identificar el fragmento que la sustenta y conservar la información necesaria para que otra persona pueda verificarla. Si la evidencia disponible no permite responder, el sistema debe declarar el vacío en lugar de completarlo mediante una formulación plausible.

El agente especializado en ISO/IEC 42001 responde mediante su corpus autorizado y relaciona sus afirmaciones con la ubicación correspondiente. También conserva la fecha de verificación de sus fuentes para evitar presentar como vigente una referencia cuyo estado no ha sido comprobado recientemente.

Otros agentes aplican el mismo principio a dominios diferentes. Una regla debe conservar su fuente, vigencia y nivel de confianza. Una referencia académica debe generarse a partir de metadatos verificables y no mediante una reconstrucción manual del modelo. Una afirmación derivada debe distinguirse de un contenido recuperado literalmente de la fuente.

Esta disciplina no pretende eliminar toda incertidumbre. Pretende hacerla visible. Un sistema puede contar con evidencia parcial, fuentes contradictorias o información insuficiente. La respuesta correcta en esos casos no es ocultar la limitación, sino comunicarla con precisión y conservar la posibilidad de revisión.

El principio proviene de mi experiencia en gobierno de datos. Un indicador sin procedencia pierde valor cuando debe respaldar una decisión. De la misma manera, una respuesta generativa sin evidencia identificable no debería adquirir autoridad únicamente por estar bien redactada.

La recuperación de fuentes tampoco constituye una garantía automática. El sistema debe verificar que el fragmento recuperado sea pertinente, que respalde realmente la afirmación y que corresponda con la versión aplicable. Incluir una cita decorativa no convierte una respuesta en evidencia.

Por eso, la arquitectura separa recuperación, interpretación y generación. La fuente aporta el fundamento. El agente organiza y explica. Los controles verifican que la relación entre ambos sea defendible. Cuando esa relación no puede establecerse, el vacío debe permanecer explícito.

## Agentes que son sistemas de trabajo, no conversaciones

<!-- seccion: sistemas-de-trabajo -->

Los agentes publicados en mi vitrina no se diseñan como chats genéricos. Son sistemas de trabajo especializados que producen entregables, utilizan herramientas, aplican controles y conservan evidencia sobre la forma en que ejecutan una tarea.

Un sistema de trabajo necesita una definición de terminado. No basta con producir una respuesta coherente. El resultado debe cumplir un formato, utilizar las fuentes correspondientes, superar las validaciones y dejar la evidencia necesaria para que otra persona pueda revisarlo o para que otro componente pueda continuar el proceso.

El constructor de soluciones de Power BI trabaja directamente sobre las estructuras nativas necesarias para producir artefactos analíticos sin depender exclusivamente de la operación manual de la interfaz. Sin embargo, ninguna ejecución se considera completa por el simple hecho de generar un archivo. El resultado debe ser validado antes de incorporarse al flujo.

El taller de animación está diseñado para que la incorporación de nuevas técnicas no obligue a modificar el mecanismo central de ejecución. Esta condición funciona como prueba de extensibilidad: si agregar una nueva capacidad exige reescribir la tubería principal, el diseño todavía no separa adecuadamente la variación de la estructura común.

El harness de trabajos computacionales protege el vínculo entre resultados y evidencia. Una cifra no puede llegar al documento final si antes no existe como un registro controlado dentro del flujo. Esta regla evita que el texto se convierta en una fuente autónoma de números que no puedan reconstruirse.

La fábrica que coordina el pipeline tampoco permite que una aplicación avance únicamente porque exista entusiasmo por construirla. Necesita prioridad y visión aprobadas antes de comenzar, y exige un cierre documentado para conservar memoria sobre cada ciclo.

Estos ejemplos comparten un mismo principio: el agente no recibe una petición abierta y decide libremente cómo resolverla. Opera dentro de una arquitectura que define su responsabilidad, controla sus herramientas, verifica el resultado y conserva el estado necesario para que el trabajo pueda continuar.

El valor no se encuentra en que el sistema produzca más texto. Se encuentra en que pueda completar trabajo verificable con menor ambigüedad, menor repetición y mayor capacidad de revisión.

## Los controles deben poder ponerse en rojo

<!-- seccion: controles-en-rojo -->

Una regla central de mi ecosistema es que un control debe demostrar que puede detectar la condición para la que fue diseñado. Una prueba que siempre aparece en verde, pero nunca ha sido observada reconociendo una falla real o provocada, todavía no demuestra que proteja el sistema.

Por eso, los controles se diseñan para fallar ante escenarios conocidos y superar esos mismos escenarios después de corregir el problema. Esta práctica permite relacionar cada prueba con un riesgo concreto y evita que la cobertura se convierta en una cifra sin interpretación.

En agentes generativos, comprobar que el sistema responde no es suficiente. Las pruebas deben evaluar si utilizó la fuente apropiada, respetó el formato, seleccionó correctamente una herramienta, reconoció la falta de información, evitó una afirmación no sustentada y transfirió la responsabilidad cuando la situación requería intervención humana.

También deben existir pruebas sobre las transiciones entre harnesses. Un componente puede producir un resultado correcto para sí mismo y, aun así, entregar al siguiente una estructura incompleta o ambigua. Los contratos de entrada y salida permiten verificar que cada transferencia conserve el significado y la evidencia necesarios.

Los controles sobre consumo también son importantes. Una ejecución puede alcanzar el resultado esperado y hacerlo mediante un número excesivo de llamadas, contexto redundante o correcciones evitables. La eficiencia forma parte de la calidad cuando afecta el costo, la latencia y la capacidad para escalar.

Este enfoque conecta con mi experiencia temprana en sistemas de gestión de calidad. Un control no existe porque haya sido documentado ni porque esté presente en la arquitectura. Existe cuando puede ofrecer evidencia sobre su efectividad frente a la desviación que debe detectar o contener.

## Precisión y economía de tokens como problemas de arquitectura

<!-- seccion: precision-y-economia -->

La precisión de un ecosistema agéntico no depende únicamente del modelo utilizado. Surge de la forma en que se define la tarea, se selecciona el contexto, se asignan herramientas, se distribuyen responsabilidades y se verifica el resultado.

Un modelo más grande puede compensar temporalmente una especificación deficiente, pero no elimina la ambigüedad del proceso ni garantiza que utilice la fuente correcta. De manera similar, aumentar el contexto puede introducir más información y, al mismo tiempo, reducir la capacidad del sistema para distinguir lo relevante.

Mi arquitectura busca reducir ambas dependencias. Los harnesses especializan el comportamiento, la recuperación aporta únicamente el conocimiento pertinente, los contratos controlan las transiciones y los validadores comprueban lo que puede verificarse mediante mecanismos deterministas.

La economía de tokens se administra a lo largo de todo el flujo. El sistema evita repetir instrucciones estables, reutiliza artefactos previamente validados, resume estados acumulados y separa las tareas que no necesitan un modelo generativo. Cuando una capacidad puede resolverse mediante código, no consume tokens para simular una operación determinista.

También evalúo el costo total de completar una tarea y no únicamente los tokens utilizados en una llamada. Una respuesta aparentemente económica puede resultar costosa si necesita múltiples reintentos, correcciones o revisiones manuales. La medida útil es el consumo necesario para obtener un resultado aceptable, no el precio aislado de la primera respuesta.

La optimización debe preservar la calidad. No considero eficiente una arquitectura que reduce el contexto y aumenta las omisiones, ni una que disminuye las llamadas y traslada el trabajo hacia una revisión humana permanente. La economía debe medirse junto con el cumplimiento de criterios, la necesidad de corrección y el tiempo total hasta completar la tarea.

Cuando comunico mejoras cuantitativas, establezco una línea base, una muestra, una métrica y unas condiciones de evaluación. Mientras no exista esa comparación, describo los mecanismos de diseño y no utilizo superlativos como sustitutos de la evidencia.

El objetivo es construir un sistema en el que cada token tenga una función, cada llamada tenga un propósito y cada agente reciba únicamente la capacidad necesaria para cumplir su responsabilidad.

## Qué me llevo de las dos experiencias

<!-- seccion: que-me-llevo -->

Vesting y mi ecosistema propio representan dos etapas diferentes de una misma evolución profesional. En Vesting construí la plataforma de datos y estructuré el proceso que sirvió como marco para desarrollar veintisiete agentes en un entorno profesional. Allí aprendí a convertir su operación en eventos observables, a conservar evidencia sobre su comportamiento y a transformar cada implementación en aprendizaje para las siguientes.

Mi ecosistema propio llevó esa experiencia hacia una arquitectura diferente y más especializada. El foco dejó de estar únicamente en la repetibilidad del proceso y pasó a incluir la administración del contexto, la especialización de los harnesses, la coordinación de herramientas, la economía de tokens, la verificación de resultados y la distribución explícita de responsabilidades entre personas y sistemas.

Ambas experiencias confirmaron que la parte más difícil de un agente no es conectarlo con un modelo. El verdadero desafío consiste en especificar correctamente su función, proporcionarle el conocimiento necesario, limitar su espacio de actuación, evaluar su comportamiento y conservar evidencia suficiente para comprender lo que hizo.

También aprendí que repetibilidad y especialización no son objetivos contradictorios. El proceso común protege los principios que deben permanecer. Los harnesses especializados permiten adaptar el comportamiento a cada tarea. La arquitectura madura aparece cuando ambos niveles pueden coexistir sin que cada nueva solución tenga que reconstruir el sistema completo.

La Ingeniería Industrial me permite analizar estos ecosistemas como procesos: entradas, actividades, restricciones, transferencias, controles, excepciones y resultados. El Diseño Industrial mantiene visible la interacción con las personas y exige que las capacidades, límites y solicitudes de intervención sean comprensibles. DP-600 sustenta la plataforma analítica; AI-103 profundiza la construcción de aplicaciones y agentes; y AI-300 amplía la disciplina necesaria para evaluarlos y operarlos de manera confiable.

El aprendizaje final es claro: un agente no debe evaluarse por la fluidez con la que conversa ni por la cantidad de herramientas que puede invocar. Debe evaluarse por la calidad del trabajo que completa, la evidencia que conserva, la eficiencia con la que utiliza los recursos y la claridad con la que reconoce sus límites.

En Vesting aprendí a construir la capacidad organizacional necesaria para desarrollar y observar agentes. En mi ecosistema propio transformé esos aprendizajes en una arquitectura agéntica avanzada. Una experiencia demuestra escala profesional y repetibilidad; la otra, profundidad arquitectónica, especialización y evolución independiente.

