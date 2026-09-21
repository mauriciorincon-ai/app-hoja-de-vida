---
slug: agentes-en-produccion
titulo: "Agentes de IA: la plataforma de Vesting y ARKHÉ, mi ecosistema propio"
resumen: "Dos experiencias con agentes: 27 construidos con el proceso core de Vesting sobre n8n y monitoreados en tiempo real, y ARKHÉ, mi ecosistema agéntico de harnesses especializados, medido en 120 escenarios: −52 % de tokens y cumplimiento del 71 % al 93 %."
cuando_usar: "Úsalo cuando pregunten si ha construido agentes de inteligencia artificial, qué frameworks de agentes ha usado (n8n, Claude Code), cómo monitorea un agente en producción, qué es ARKHÉ, cómo evita que el modelo invente, y su experiencia con IA generativa y modelos de lenguaje grandes."
estado: aprobado
ancla: "/vitrina/agentes"
actualizado: 2026-09-21
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry construyendo agentes de IA?"
  - "¿Cómo se monitorea un agente de IA en producción?"
  - "¿Qué es ARKHÉ?"
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

## Agentes de inteligencia artificial en producción: dos experiencias distintas, no una

<!-- seccion: dos-experiencias -->

Cuando hablo de mi experiencia con inteligencia artificial generativa y agentes de IA, me refiero a dos trayectorias que se complementan, pero que deben diferenciarse con precisión.

La primera corresponde a mi experiencia profesional en Vesting, una startup especializada en agentes de automatización, donde trabajé como Líder de Estrategia de Datos entre agosto de 2023 y enero de 2025. Allí diseñé desde cero la plataforma de datos que permitía integrar la información producida por los agentes, analizar su comportamiento y monitorear su operación: 120 tablas, 20 GB y 1.000 eventos por día sobre Microsoft Fabric, con la información de 12 clientes integrados. También definí, documenté y validé el proceso core utilizado para diseñar e implementar nuevas soluciones.

Ese proceso permitió construir 27 agentes para diferentes necesidades y contextos, y el monitoreo en tiempo real llegó a vigilar hasta 23 a la vez. Eso es producción en el sentido estricto: agentes con usuarios ajenos, con contratos y con costo. Mi responsabilidad no consistía únicamente en observar los resultados finales, sino en desarrollar la estructura de datos, los mecanismos de seguimiento y la forma de trabajo necesaria para que las implementaciones pudieran repetirse con mayor consistencia.

La base de automatización utilizaba n8n como uno de sus componentes fundamentales. Sobre esa base se integraban los flujos, las fuentes, las reglas y los servicios necesarios para que los agentes participaran en procesos reales. Los detalles internos de la arquitectura, los componentes propios y la secuencia exacta de implementación forman parte del conocimiento confidencial de la organización y no los expongo en este documento. Cerré esa etapa al dejar el ecosistema y el proceso documentados.

## He construido agentes de inteligencia artificial dos veces: ARKHÉ y los trece agentes publicados

<!-- seccion: la-segunda-trayectoria -->

La segunda trayectoria corresponde a ARKHÉ, mi propio ecosistema agéntico, y a los agentes publicados en CV Viva. Este trabajo no es una extensión de la arquitectura de Vesting ni una reproducción de sus componentes. Es un sistema propio, construido posteriormente con otra visión, otros controles y un nivel de especialización orientado a producir activos verificables dentro de mi pipeline de aplicaciones, investigaciones, tableros y conocimiento profesional.

Actualmente, la vitrina reúne 13 agentes publicados, cada uno con una función y una ficha técnica específica. Sin embargo, esos trece agentes no constituyen por sí solos el ecosistema completo. Son capacidades visibles construidas sobre una arquitectura común de harnesses, fuentes, herramientas, memoria, controles y reglas de coordinación. Los trece, uno a uno, están en su propio documento; aquí hablo de la arquitectura que los sostiene.

En este ecosistema, los agentes no son automatizaciones independientes ni conversaciones especializadas. Operan mediante harnesses que delimitan su función, administran el contexto, seleccionan fuentes y herramientas, controlan las transiciones y verifican los resultados antes de permitir que el trabajo avance. El propósito no es multiplicar agentes, sino construir una arquitectura capaz de distribuir correctamente la responsabilidad entre código, modelos, conocimiento, controles y personas.

Una precisión de vocabulario: la palabra «producción» la reservo para Vesting. Los agentes de ARKHÉ son sistemas de trabajo publicados, con entregables y evidencia, de uso personal; no han tenido usuarios distintos de mí y no los llamo producción.

Separar ambas experiencias es importante. Vesting demuestra mi capacidad para construir una plataforma empresarial de datos y un proceso replicable alrededor de agentes utilizados en un entorno profesional. ARKHÉ demuestra mi capacidad para diseñar arquitecturas agénticas avanzadas, gobernar el contexto, especializar harnesses y convertir la inteligencia generativa en una capacidad de producción intelectual verificable.

## El proceso core de Vesting: el proceso central replicable

<!-- seccion: el-proceso-core -->

En Vesting definí, documenté y validé el proceso core para diseñar e implementar agentes de inteligencia artificial: once etapas, del caso de uso a la operación observable, que están numeradas en el documento de Vesting. El propósito era evitar que cada solución empezara en cero, dependiera del conocimiento informal de quienes habían participado antes o repitiera errores que ya se habían resuelto en implementaciones anteriores.

El proceso estaba organizado en etapas que permitían comprender la necesidad, especificar el comportamiento esperado, construir la solución, validarla, incorporarla a la operación y aprender de su funcionamiento. No publico los entregables específicos ni los mecanismos propios utilizados en cada etapa porque forman parte del conocimiento confidencial de la empresa.

Lo relevante no es el nombre ni la cantidad exacta de etapas, sino la disciplina que introducía el proceso. Cada iniciativa debía comenzar con un problema y un propósito identificables. El comportamiento esperado debía traducirse en criterios verificables. La autonomía del agente se delimitaba antes de construirlo: qué podía ejecutar solo, qué debía recomendar y qué exigía una persona. La solución debía probarse antes de considerarse preparada para operar y su funcionamiento debía permanecer observable después de la implementación, con la definición de terminado acordada al inicio y no al final.

El proceso que diseñé y estructuré sirvió como marco para la construcción de 27 agentes. Esta cifra demuestra que no se trató de una propuesta conceptual aplicada a un único caso, sino de una capacidad utilizada de manera repetida para desarrollar soluciones con propósitos, integraciones y contextos diferentes. Mi contribución consistió en establecer la estructura común que permitía organizar esas implementaciones, conservar aprendizajes y distinguir qué elementos debían estandarizarse y cuáles necesitaban adaptarse a cada necesidad.

## Replicar no es copiar: estandarizar sin uniformar

<!-- seccion: replicar-no-es-copiar -->

La lógica del proceso core proviene directamente de mi formación en Ingeniería Industrial. Cuando cada unidad se construye de una manera completamente diferente, la organización no acumula aprendizaje y el costo de la siguiente entrega sigue siendo equivalente al de la primera. Un proceso central permite conservar memoria, reutilizar decisiones, establecer criterios de calidad y reducir la necesidad de improvisar frente a problemas ya conocidos. Es la misma razón por la que en Inglopres, bajo ISO 9001, un procedimiento documentado valía más que la habilidad de un operario concreto.

La estandarización, sin embargo, no debía convertir a todos los agentes en la misma solución. El proceso establecía una forma común de trabajo, no un único comportamiento. Cada agente podía responder a un problema diferente, utilizar fuentes distintas y participar en procesos específicos, pero debía atravesar condiciones comparables de definición, construcción, validación y seguimiento. El proceso fijaba lo común —problema y propósito, criterios verificables, autonomía delimitada, definición de terminado— y dejaba libres las fuentes, las herramientas y las reglas de cada caso.

Esta distinción fue uno de los principales aprendizajes de la experiencia. Replicar no significa copiar una solución. Significa disponer de una arquitectura de trabajo suficientemente estable para construir soluciones diferentes sin renunciar a los principios que protegen su calidad, trazabilidad y capacidad de evolución.

El verdadero activo no era, por tanto, ninguno de los 27 agentes de manera aislada. Era la capacidad de construir el siguiente sobre un conocimiento acumulado, con un proceso que reducía la incertidumbre y convertía cada implementación en una fuente de aprendizaje para las posteriores. Años después, esa misma idea —reutilizar el molde y no la pieza— se convirtió en uno de los conceptos centrales de ARKHÉ.

## De una demostración a un agente preparado para operar

<!-- seccion: de-demostracion-a-operacion -->

Una demostración convincente no era suficiente para considerar que un agente estaba preparado para operar. Antes de su implementación era necesario comprobar que la solución respondiera adecuadamente a los escenarios esperados, gestionara las principales excepciones y conservara un comportamiento consistente frente a entradas diferentes.

La evaluación debía partir del propósito del agente. No todos los sistemas necesitaban las mismas pruebas ni podían juzgarse mediante una única métrica. Un agente orientado a recuperar información debía evaluarse por la pertinencia y trazabilidad de sus fuentes. Uno que coordinaba herramientas debía demostrar que seleccionaba y utilizaba correctamente cada capacidad. Uno que producía resultados estructurados debía cumplir el contrato esperado sin introducir información no sustentada.

También era necesario evaluar las condiciones en las que la solución no debía continuar. Un agente preparado para operar necesitaba reconocer información insuficiente, errores en una integración, resultados contradictorios y situaciones que exigían intervención humana. La capacidad de abstenerse o transferir la responsabilidad formaba parte del comportamiento correcto.

Las pruebas debían incluir escenarios habituales, excepciones conocidas y condiciones límite. El objetivo no era demostrar que el agente podía completar una conversación ideal, sino observar cómo respondía cuando la realidad se apartaba del recorrido previsto. Allí se encontraba la diferencia entre una demostración y una capacidad operativa. Con 27 agentes construidos sobre el mismo proceso, esa batería de escenarios dejó de ser un esfuerzo por agente y se convirtió en una plantilla que cada iniciativa adaptaba.

Esta disciplina continúa siendo central en mi trabajo actual. La ruta AI-300, que curso desde julio de 2026, profundiza precisamente en la evaluación, observabilidad y operación de soluciones generativas y agentes. Mi experiencia práctica me permitió comprender antes de abordar esa ruta formal que el despliegue no constituye el final del desarrollo, sino el comienzo de una evaluación continua frente al comportamiento real.

## Los frameworks de agentes que he usado: n8n como base de automatización, no como arquitectura completa

<!-- seccion: n8n-como-base -->

n8n constituía una base fundamental para la automatización y coordinación de los flujos de los agentes en Vesting. Permitía conectar servicios, organizar secuencias de trabajo, ejecutar reglas e integrar diferentes componentes dentro de procesos que necesitaban operar de manera consistente. Por eso figura hoy entre mis skills: no como una herramienta vista, sino como la base sobre la que corrieron 27 agentes.

Sin embargo, utilizar n8n no significaba que la arquitectura se redujera a una colección de flujos visuales. El valor empresarial no se encontraba en conectar nodos, sino en definir correctamente qué información ingresaba, qué transformación debía ocurrir, qué servicio o componente intervenía, qué resultado se esperaba y cómo debía manejarse una excepción.

La plataforma debía proporcionar a esos flujos una base de datos y observabilidad. Sin ella, cada automatización podía completar tareas, pero la organización tendría dificultades para comparar comportamientos, reconstruir ejecuciones, analizar tendencias y comprender qué estaba ocurriendo en producción.

Mi trabajo consistió en conectar esa capa de ejecución con una arquitectura de datos capaz de conservar los eventos —sesiones, solicitudes, respuestas, tiempos, estados, costo en tokens—, organizar la telemetría y convertir el funcionamiento de los agentes en información analizable. n8n coordinaba parte de la ejecución; Microsoft Fabric proporcionaba la base para integrar, transformar y analizar la evidencia producida por esa operación, y Power BI la ponía frente a producto y operaciones.

Esta separación entre ejecución y observación resultaba esencial. El componente que realiza el trabajo no debería ser el único que afirma que el trabajo se realizó correctamente. La plataforma analítica debía aportar una mirada independiente sobre volúmenes, estados, tiempos, excepciones y resultados.

También aprendí que una herramienta de automatización puede acelerar considerablemente la construcción, pero no elimina la necesidad de arquitectura. A medida que aumentan los agentes, las integraciones y las excepciones, se vuelve indispensable establecer convenciones, responsabilidades, patrones reutilizables y mecanismos de control que eviten que cada flujo se convierta en una pieza imposible de comprender fuera de su creador. Por esa razón, describo n8n como una base fundamental y públicamente mencionable, pero no como la explicación completa de la solución. Los detalles adicionales pertenecen a la arquitectura interna de Vesting y deben permanecer protegidos.

## Monitorear un agente no es comprobar que está disponible

<!-- seccion: monitorear-no-es-mirar-si-esta-arriba -->

En Vesting implementé capacidades de captura, almacenamiento y análisis para monitorear agentes en producción: hasta 23 a la vez, en tiempo real. El objetivo no era comprobar únicamente que un servicio estuviera disponible, sino construir evidencia sobre la forma en que cada solución se comportaba durante su operación.

Un agente puede permanecer técnicamente disponible y responder con fluidez mientras la calidad de sus resultados se deteriora. También puede producir una respuesta adecuada con una latencia, un costo o una cantidad de reintentos que hagan inviable su utilización sostenida. Por eso, la disponibilidad es apenas una dimensión de la observabilidad.

Era necesario conservar información suficiente para reconstruir las ejecuciones y analizar qué había ocurrido. Esto implicaba relacionar solicitudes, sesiones, estados, tiempos, respuestas, excepciones y otros eventos relevantes, manteniendo el contexto necesario para identificar diferencias entre agentes, integraciones y periodos.

La reconstrucción de una sesión era especialmente valiosa. Un resultado final podía mostrar que la ejecución había fallado, pero no necesariamente explicaba dónde se había originado el problema. Observar la secuencia permitía identificar si la dificultad aparecía en la información de entrada, en una integración, en una respuesta intermedia, en una regla o en el resultado producido. El monitoreo reconstruía la sesión completa —qué solicitud recibió cada agente, con qué contexto, qué respondió, cuánto tardó, qué costó, en qué estado terminó— y no solo el resultado final; la tabla de dimensiones y decisiones del monitoreo está en el documento de Vesting.

Microsoft Fabric permitió estructurar el recorrido de esos eventos desde su captura hasta el análisis. Power BI convirtió la telemetría en una experiencia utilizable por producto y operaciones, organizando indicadores que ayudaban a identificar condiciones relevantes y profundizar en las ejecuciones asociadas.

## Telemetría, calidad funcional y costo de operar agentes

<!-- seccion: telemetria-calidad-y-costo -->

La observabilidad debía integrar dimensiones técnicas y funcionales. Las métricas de volumen, tiempos y errores ayudaban a comprender la salud operativa. Sin embargo, la calidad del resultado requería criterios adicionales y, en determinados casos, revisión humana. Un sistema de monitoreo serio debe reconocer que responder no equivale necesariamente a responder bien.

También debía observarse el costo de la operación. En soluciones generativas, la arquitectura, el tamaño del contexto, los reintentos y el uso de herramientas pueden modificar considerablemente el consumo. El costo en tokens de cada sesión era uno de los eventos que la plataforma conservaba, y verlo por agente, por cliente y por periodo era lo que permitía distinguir una demostración funcional de una capacidad sostenible.

Distingo dos cosas que suelen confundirse. La telemetría le sirve al equipo responsable para entender el comportamiento técnico de una solución. La transparencia le sirve a la persona afectada para saber qué información se conserva y se usa sobre ella. Ambas son necesarias, pero responden a audiencias y responsabilidades distintas: en Vesting construí la primera; Dash Agent AI, años después, nació de la segunda.

La lección principal fue que no es posible gobernar una solución inteligente cuya operación permanece invisible. Cuanto mayor es la capacidad del agente para recomendar, coordinar herramientas o ejecutar acciones, más importante resulta conservar evidencia sobre lo que recibió, los componentes que utilizó y el resultado que produjo. Esa lección es la que hoy lleva a que el chat de este sitio guarde, desde septiembre de 2026, una fila entera por respuesta —quién preguntó, qué preguntó, qué se le contestó, con qué fuentes, en qué modo, con qué proveedor, cuántos tokens y cuántos milisegundos— y no apenas su costo; y a que mis 13 agentes publicados dejen evidencia de cada corrida. Ahí las dos caras se encontraron: la telemetría es mía, y la transparencia es de quien pregunta, que antes de escribir su primera línea marca un aviso donde dice qué se guarda de él y cómo pedir que se borre.

## Dash Agent AI y la transparencia sobre el contexto

<!-- seccion: dash-agent-ai -->

Dash Agent AI es una aplicación propia publicada en mi vitrina que concebí y diseñé completamente en la Fundación CTIC, en 2026, bien después de Vesting. No es un puente desde la plataforma de la empresa: no forma parte de ella ni utiliza su arquitectura confidencial. Es una aplicación independiente que responde a una pregunta más actual y distinta: qué información conoce, conserva o utiliza un agente sobre la persona con la que interactúa, y cuánto le cuesta a esa persona trabajar con él.

Dash Agent AI convierte una dimensión abstracta de la confianza en una experiencia examinable. En lugar de pedir al usuario que acepte de forma general que un agente utiliza contexto o memoria, la aplicación muestra qué elementos están disponibles y cómo pueden influir sobre la interacción. Su función estrella es el auditor de memoria: el inventario de todo lo que los agentes tienen escrito sobre la persona —archivos de instrucciones, memorias, configuración— y la detección determinista de lo que dejó de ser cierto, con archivo, línea y texto exacto. El plan de limpieza es una lista que ejecuta la persona; la app no borra ni edita nada.

También mide lo que los agentes cuestan: tokens por sesión, modelo y día, con los cuatro contadores separados; tarifas con fuente y fecha desde una copia local; el ROI de la suscripción frente a la API; y el gasto anclado al repositorio donde ocurrió, tarea por tarea. Y conserva lo que de otro modo se pierde: indexa los transcripts antes de que la herramienta los borre a los 30 días.

Esta pieza conecta mi formación en Diseño Industrial con mi trabajo en inteligencia artificial. No basta con que una arquitectura sea técnicamente observable para sus desarrolladores. También es necesario diseñar formas comprensibles de comunicar al usuario qué ocurre, qué puede controlar y qué límites debe reconocer.

## Dash Agent AI por dentro: solo lectura demostrable y una funcionalidad retirada

<!-- seccion: dash-por-dentro -->

La aplicación opera localmente y evita llamadas de red salientes durante su ejecución: una prueba permanente del CI falla si el runtime abre un socket saliente, y ninguna de sus cinco dependencias es un SDK de IA. Utiliza un índice propio en SQLite, siempre fuera de las fuentes, y cuenta con 693 pruebas unitarias y de integración con un 97,5 % de cobertura de líneas que protegen su comportamiento. Estas decisiones responden a una misma orientación: demostrar que la transparencia, la privacidad y la verificabilidad pueden incorporarse a la arquitectura y no añadirse únicamente como declaraciones sobre el producto.

La garantía de solo lectura tiene cuatro capas —el modelo de permisos de Node al arrancar, una frontera de módulo única, el índice fuera de las fuentes y tres pruebas permanentes en el CI— y una pantalla dedicada a comprobarlas, donde la capa de permisos se mide en el momento preguntándole al propio proceso y las otras dicen «verificada en CI» en vez de inventar una hora.

La ejecución local reduce la exposición innecesaria de la información y permite que el usuario examine la capacidad sin enviar sus datos a un servicio externo. El índice organiza el conocimiento disponible y las pruebas permiten validar que las funciones esenciales se mantienen cuando la aplicación evoluciona. El costo de operación es cero: no hay servidor, base de datos, telemetría ni proveedor de IA que facturar.

También cuento lo que se retiró. Una funcionalidad —el sugeridor de skills y optimización— se construyó, se midió sobre el corpus real del usuario y se retiró en agosto de 2026: produjo 83 sugerencias descontextualizadas, porque su premisa (repetición de texto) no encajaba con la forma real de trabajar (repetición de estructura). No es una funcionalidad pendiente; es una decisión registrada con su razón y su fecha, y las 12 funcionalidades que la app declara no la cuentan.

## ARKHÉ: mi ecosistema agéntico propio

<!-- seccion: ecosistema-agentico-propio -->

Mi trabajo propio evolucionó hacia ARKHÉ, un ecosistema agéntico avanzado que no reproduce la arquitectura utilizada en Vesting ni se limita a los agentes publicados individualmente en la vitrina. Es una estructura de nivel superior diseñada para coordinar agentes, harnesses, conocimiento, herramientas, controles y memoria dentro de un mismo sistema de producción, y para convertir modelos de lenguaje grandes (LLM), la inteligencia artificial generativa, en capacidad de trabajo verificable.

Los agentes publicados son las capacidades visibles. El ecosistema es la infraestructura lógica que establece cómo se seleccionan, cómo reciben contexto, qué herramientas pueden utilizar, qué entregables producen y qué controles deben superar. Esta distinción es esencial porque la sofisticación no reside en la cantidad de agentes, sino en la arquitectura que permite que trabajen de manera coordinada.

Cada harness funciona como un entorno de ejecución especializado. Define la función del agente, las instrucciones aplicables, las fuentes autorizadas, las herramientas disponibles, el contrato de entrada y salida, las validaciones y las condiciones de excepción. El modelo aporta capacidad generativa, pero el harness transforma esa capacidad en un comportamiento delimitado y evaluable.

Distingo con claridad entre el agente y el harness que controla su ejecución. El agente representa la capacidad especializada de interpretar, razonar, generar o coordinar una tarea. El harness establece las condiciones bajo las cuales esa capacidad puede operar: prepara el contexto, habilita las herramientas, valida las entradas, controla las salidas, conserva el estado y decide qué hacer cuando aparece una excepción.

Esta separación permite que la inteligencia del modelo evolucione sin obligar a reconstruir toda la arquitectura de control. También permite mejorar las reglas, las fuentes, los validadores o la administración del contexto sin confundir esos cambios con las capacidades propias del agente. El modelo puede cambiar; la responsabilidad del sistema debe permanecer explícita.

ARKHÉ es también una investigación publicada en la vitrina. Su idea central es que los sistemas de trabajo no se construyen desde cero: se instancian desde contratos declarativos —roles, reglas, evidencia— que se reutilizan como moldes, evolucionan y devuelven lo aprendido al núcleo. Opera desde hace meses en dominios sin relación entre sí, y para validar que el tema era nuevo revisé 1.405 obras una a una sin encontrar un ecosistema equivalente; 6 de sus 9 conceptos ya son citables con literatura revisada.

## Especialización, contexto como recurso limitado y economía de tokens

<!-- seccion: contexto-y-especializacion -->

La arquitectura evita depender de un agente generalista que reciba todo el conocimiento, todas las herramientas y todas las responsabilidades en cada ejecución. Ese enfoque incrementa el contexto, amplía el espacio de error y dificulta determinar qué componente produjo un resultado. En su lugar, distribuyo el trabajo entre capacidades especializadas con criterios explícitos de coordinación.

El ecosistema administra el contexto como un recurso limitado. Ningún componente debería recibir información simplemente porque está disponible. Debe utilizar únicamente el contexto requerido para cumplir su función, junto con la evidencia necesaria para sostener el resultado. Esta selección reduce ruido, mejora la concentración de la tarea y evita consumir tokens en información irrelevante. La recuperación selectiva es el mecanismo: cada componente recibe solo el fragmento del conocimiento que su tarea necesita, recuperado de fuentes autorizadas, en la misma lógica de recuperación aumentada por generación (RAG) con la que funciona el chat de este sitio.

La economía de tokens no se persigue mediante la simple reducción del contexto. Un contexto insuficiente puede disminuir el costo y destruir la calidad. El objetivo es maximizar la utilidad de cada fragmento de información suministrado al modelo mediante recuperación selectiva, instrucciones especializadas, resúmenes estructurados, reutilización de resultados y separación de tareas deterministas.

El código resuelve aquello que requiere exactitud, repetibilidad o una validación inequívoca. Los modelos intervienen cuando la tarea necesita interpretación, síntesis, generación o coordinación flexible. Los agentes no reemplazan indiscriminadamente los mecanismos convencionales; participan únicamente donde su capacidad produce un valor necesario. Es código primero: lo que exige exactitud lo resuelve un validador, no un prompt. En el Experto Fiscal, por ejemplo, la aritmética corre en Python con Decimal y el modelo no toca una cifra; en el Constructor de Tableros Power BI, cada medida DAX se prueba con una consulta antes de pasar de fase.

## Memoria, contratos, permisos y autonomía proporcional al riesgo

<!-- seccion: memoria-contratos-y-autonomia -->

La memoria también se diseña por función. No todo lo ocurrido debe acompañar todas las ejecuciones futuras. El ecosistema diferencia entre decisiones persistentes, resultados reutilizables, contexto temporal y detalle que puede descartarse después de cumplir su propósito. Esta disciplina reduce acumulación, evita contradicciones y mantiene la información relevante cerca del componente que realmente la necesita. En los agentes publicados, esa memoria toma forma de bitácora, lecciones de cada corrida y decisiones de arquitectura registradas: el Experto Fiscal lleva 17, el Taller de Animación 11.

La coordinación no se limita a transferir texto entre agentes. Cada transición debe comunicar un resultado estructurado, el estado de la tarea, la evidencia disponible y las condiciones pendientes. Esto permite que el siguiente harness reciba un insumo verificable y no tenga que interpretar libremente la intención del componente anterior.

La identidad y los permisos forman parte de la arquitectura. Un agente no debe tener acceso a todas las fuentes o herramientas solo porque técnicamente pueda utilizarlas. Cada harness debe habilitar únicamente las capacidades necesarias para su función y evitar que una instrucción inesperada amplíe de manera implícita su espacio de actuación.

La autonomía también debe ser proporcional al riesgo. Algunas tareas pueden ejecutarse directamente porque son reversibles, verificables y de bajo impacto. Otras deben producir una recomendación o preparar una acción para aprobación. Cuando la consecuencia es significativa, difícil de revertir o insuficientemente observable, la responsabilidad debe permanecer en una persona. Por eso los agentes publicados llevan gates con token verbal: el Experto Fiscal tiene 5, tres de ellos humanos, que no protegen al sistema de un error técnico sino a la persona de delegar una decisión que es suya; el Taller de Animación tiene 6; el Constructor de Tableros Power BI, 5 de aprobación humana.

Este enfoque evita confundir sofisticación con independencia. Un ecosistema avanzado no es aquel que elimina toda intervención humana, sino el que distribuye correctamente la responsabilidad y puede explicar por qué una acción fue ejecutada, detenida o transferida.

## La medición: 120 escenarios, −52 % de tokens y del 71 % al 93 % de cumplimiento

<!-- seccion: la-medicion -->

El resultado es un ecosistema en el que la precisión surge de la arquitectura completa. La especialización reduce la ambigüedad. La recuperación selectiva mejora la pertinencia del contexto. Los contratos estructuran las transiciones. Los controles hacen visibles las desviaciones. La observabilidad permite identificar dónde se produjo un problema. La intervención humana permanece disponible cuando la solución encuentra una condición que excede sus límites.

Lo medí. En 120 escenarios representativos, comparé ARKHÉ con un agente generalista que recibía en cada ejecución la totalidad de las instrucciones, el contexto y las herramientas. ARKHÉ redujo un 52 % el consumo de tokens y subió el cumplimiento de instrucciones del 71 % al 93 %. Son mis propios cálculos, con línea base, muestra y métrica declaradas: la línea base es el generalista, la muestra son los 120 escenarios y las dos métricas son tokens consumidos por tarea completada y proporción de instrucciones cumplidas.

Esas dos cifras miden lo que la arquitectura promete: menos contexto irrelevante y más obediencia a la especificación. No miden calidad de las salidas en abstracto ni sirven para comparar con otro ecosistema; para eso habría que repetir la comparación con los mismos escenarios. Tampoco existe una medición de horas de ARKHÉ comparable a las horas de agente que registra el harness de papers, y no la comparo.

No describo este ecosistema como poderoso por la cantidad de modelos o agentes que contiene. Su nivel se demuestra en la forma en que administra complejidad, contexto, evidencia, consumo, responsabilidad y aprendizaje acumulativo. Es una arquitectura diseñada para convertir la inteligencia generativa en una capacidad dirigida, eficiente y gobernable, y las cifras están para que alguien las cuestione con datos y no con adjetivos.

## Fuentes o vacío declarado: cómo evito que el modelo invente

<!-- seccion: fuentes-o-vacio -->

Los agentes de ARKHÉ comparten una regla que resume mi postura sobre inteligencia artificial generativa: ninguna afirmación verificable debe depender únicamente de la memoria del modelo.

Cuando una respuesta requiere evidencia, el agente debe utilizar una fuente autorizada, identificar el fragmento que la sustenta y conservar la información necesaria para que otra persona pueda verificarla. Si la evidencia disponible no permite responder, el sistema debe declarar el vacío en lugar de completarlo mediante una formulación plausible. Es la misma regla con la que funciona el chat de este sitio: recupera del corpus, cita lo que recuperó y, si no encuentra, lo dice.

Esta disciplina no pretende eliminar toda incertidumbre. Pretende hacerla visible. Un sistema puede contar con evidencia parcial, fuentes contradictorias o información insuficiente. La respuesta correcta en esos casos no es ocultar la limitación, sino comunicarla con precisión y conservar la posibilidad de revisión.

El principio proviene de mi experiencia en gobierno de datos, desde Banco Pichincha hasta la Fundación CTIC. Un indicador sin procedencia pierde valor cuando debe respaldar una decisión. De la misma manera, una respuesta generativa sin evidencia identificable no debería adquirir autoridad únicamente por estar bien redactada.

## Tres agentes publicados que citan o callan: ISO 42001, Fiscal y posgrado

<!-- seccion: tres-agentes-que-citan -->

El Experto ISO 42001 responde mediante su corpus autorizado y relaciona cada afirmación normativa con el apartado y la página correspondientes, o declara el vacío. También estampa en cada dictamen la fecha en que se verificó la vigencia de sus fuentes, para evitar presentar como vigente una referencia cuyo estado no ha sido comprobado recientemente: es el experto que sabe cuándo dejó de estar actualizado. Su corpus sintetiza los 38 controles del Anexo A de la norma y nada con consecuencias avanza sin el token de una persona.

El Experto Fiscal aplica el mismo principio a otro dominio. Trabaja sobre un corpus de 150 reglas, cada una con artículo, fuente, fecha de captura, vigencia y confianza declarada, y una sugerencia sin su regla citada no se emite con advertencia: no se emite. Una regla debe conservar su fuente, vigencia y nivel de confianza, y cuando la ficha no está firme el agente declara el vacío y no calcula esa rama.

El Asistente de posgrado lleva el principio a la referencia académica: toda cita se genera a partir del CSL-JSON exportado del gestor bibliográfico con un procesador de estilos, y jamás se redacta. La cita inventada deja de ser posible por construcción, no por instrucción. Cada ficha de su biblioteca cita curso, sesión y marca de tiempo de la grabación o número de diapositiva, o declara el vacío.

Los tres comparten una regla más: una afirmación derivada debe distinguirse de un contenido recuperado literalmente de la fuente. Paráfrasis con apartado y página no es lo mismo que el tenor literal, y el sistema lo dice.

## Recuperación, interpretación y generación separadas

<!-- seccion: recuperacion-interpretacion-generacion -->

La recuperación de fuentes tampoco constituye una garantía automática. El sistema debe verificar que el fragmento recuperado sea pertinente, que respalde realmente la afirmación y que corresponda con la versión aplicable. Incluir una cita decorativa no convierte una respuesta en evidencia.

Por eso, la arquitectura separa recuperación, interpretación y generación. La fuente aporta el fundamento. El agente organiza y explica. Los controles verifican que la relación entre ambos sea defendible. Cuando esa relación no puede establecerse, el vacío debe permanecer explícito.

Esa separación tiene consecuencias de diseño concretas. La recuperación se resuelve con código determinista siempre que sea posible —un índice, un corpus con identificadores, una consulta en SQL o en Python— y no con la memoria del modelo. La interpretación es la parte generativa, y por eso es la que se acota con instrucciones especializadas y contexto seleccionado. La generación de la salida pasa por un validador antes de entregarse: un esquema, un chequeo mecánico, un procesador de estilos. En Probeta DS la narración con IA se descarta si cita una cifra que no existe; en el chat de este sitio, la respuesta que no alcanza el umbral de evidencia cae a una búsqueda local en vez de improvisar.

Es la misma regla del gobierno de datos aplicada a un modelo de lenguaje: un indicador sin procedencia no respalda una decisión, y una respuesta sin fuente no la respalda tampoco.

## Agentes que son sistemas de trabajo, no conversaciones

<!-- seccion: sistemas-de-trabajo -->

Los agentes publicados en mi vitrina no se diseñan como chats genéricos. Son sistemas de trabajo especializados que producen entregables, utilizan herramientas, aplican controles y conservan evidencia sobre la forma en que ejecutan una tarea.

Un sistema de trabajo necesita una definición de terminado. No basta con producir una respuesta coherente. El resultado debe cumplir un formato, utilizar las fuentes correspondientes, superar las validaciones y dejar la evidencia necesaria para que otra persona pueda revisarlo o para que otro componente pueda continuar el proceso.

El Constructor de Tableros Power BI está construido y probado: crea el proyecto completo en el formato nativo PBIP —el modelo semántico con sus relaciones y columnas, el ETL en Power Query M, las medidas DAX y las visuales— y además puede extraer datos. Trabaja directamente sobre las estructuras nativas necesarias para producir artefactos analíticos sin depender de la operación manual de la interfaz. Sin embargo, ninguna ejecución se considera completa por el simple hecho de generar un archivo: ninguna corrida cierra sin DAX en verde, validador limpio y render aprobado por una persona. Un tablero que antes costaba del orden de 32 horas manuales sale de una corrida con 20 criterios binarios marcados.

El Taller de Animación está diseñado para que la incorporación de nuevas técnicas no obligue a modificar el mecanismo central de ejecución. Esta condición funciona como prueba de extensibilidad, y es un comando: tras cada alta de técnica, el diff de la tubería principal tiene que quedar vacío. Si sale con cambios, el alta no pasa y se corrige el contrato de la técnica, nunca el núcleo. Si agregar una nueva capacidad exige reescribir la tubería, el diseño todavía no separa adecuadamente la variación de la estructura común.

## El ledger, la fábrica y la definición de terminado

<!-- seccion: ledger-fabrica-y-terminado -->

El Harness Paper Computacional protege el vínculo entre resultados y evidencia. Una cifra no puede llegar al documento final si antes no existe como un registro controlado dentro del flujo: si no está en el ledger, no está en el paper. Cada figura es una función del ledger, así que la procedencia no se documenta: se vuelve difícil de romper. Esta regla evita que el texto se convierta en una fuente autónoma de números que no puedan reconstruirse. Tres papers salieron así, con 44 criterios binarios de verificación, y tras tres papers de clases distintas el diff de las fases y del contrato sigue vacío; su hermano, el Harness Design Science, trabaja con 52 criterios.

La Fábrica de AI-APPs, que coordina el pipeline de mis aplicaciones, tampoco permite que una aplicación avance únicamente porque exista entusiasmo por construirla. Necesita dos aprobaciones escritas antes de comenzar —la prioridad vigente y la visión con todas sus funcionalidades inventariadas— y exige un cierre documentado para conservar memoria sobre cada ciclo: ningún sprint cierra sin el resumen que escribió el repositorio de la app, y sin ese archivo el harness se rehúsa. Así han cerrado 24 sprints con retrospectiva.

Estos ejemplos comparten un mismo principio: el agente no recibe una petición abierta y decide libremente cómo resolverla. Opera dentro de una arquitectura que define su responsabilidad, controla sus herramientas, verifica el resultado y conserva el estado necesario para que el trabajo pueda continuar.

El valor no se encuentra en que el sistema produzca más texto. Se encuentra en que pueda completar trabajo verificable con menor ambigüedad, menor repetición y mayor capacidad de revisión.

## Los controles deben poder ponerse en rojo

<!-- seccion: controles-en-rojo -->

Una regla central de mi ecosistema es que un control debe demostrar que puede detectar la condición para la que fue diseñado. Una prueba que siempre aparece en verde, pero nunca ha sido observada reconociendo una falla real o provocada, todavía no demuestra que proteja el sistema. La regla como tal —un gate se demuestra fallando— es del pipeline de aplicaciones y está formulada en su documento; aquí cuento cómo la aplican los agentes.

Por eso, los controles se diseñan para fallar ante escenarios conocidos y superar esos mismos escenarios después de corregir el problema. Esta práctica permite relacionar cada prueba con un riesgo concreto y evita que la cobertura se convierta en una cifra sin interpretación. El Asistente de posgrado lo hace con un modo carnada: siembra un corpus diseñado para violar cada una de sus reglas y comprueba, caso por caso, que cada uno de sus 9 chequeos de cierre dispara. La aserción literal, y no el conteo agregado, delató tres defectos que la lectura no vio.

En agentes generativos, comprobar que el sistema responde no es suficiente. Las pruebas deben evaluar si utilizó la fuente apropiada, respetó el formato, seleccionó correctamente una herramienta, reconoció la falta de información, evitó una afirmación no sustentada y transfirió la responsabilidad cuando la situación requería intervención humana.

También deben existir pruebas sobre las transiciones entre harnesses. Un componente puede producir un resultado correcto para sí mismo y, aun así, entregar al siguiente una estructura incompleta o ambigua. Los contratos de entrada y salida permiten verificar que cada transferencia conserve el significado y la evidencia necesarios.

Los controles sobre consumo también son importantes. Una ejecución puede alcanzar el resultado esperado y hacerlo mediante un número excesivo de llamadas, contexto redundante o correcciones evitables. La eficiencia forma parte de la calidad cuando afecta el costo, la latencia y la capacidad para escalar.

Este enfoque conecta con mi experiencia temprana en sistemas de gestión de calidad bajo ISO 9001. Un control no existe porque haya sido documentado ni porque esté presente en la arquitectura. Existe cuando puede ofrecer evidencia sobre su efectividad frente a la desviación que debe detectar o contener.

## Precisión y economía de tokens como problemas de arquitectura

<!-- seccion: precision-y-economia -->

La precisión de un ecosistema agéntico no depende únicamente del modelo utilizado. Surge de la forma en que se define la tarea, se selecciona el contexto, se asignan herramientas, se distribuyen responsabilidades y se verifica el resultado.

Un modelo más grande puede compensar temporalmente una especificación deficiente, pero no elimina la ambigüedad del proceso ni garantiza la fuente correcta. De manera similar, aumentar el contexto puede introducir más información y, al mismo tiempo, reducir la capacidad del sistema para distinguir lo relevante.

Mi arquitectura busca reducir ambas dependencias. Los harnesses especializan el comportamiento, la recuperación aporta únicamente el conocimiento pertinente, los contratos controlan las transiciones y los validadores comprueban lo que puede verificarse mediante mecanismos deterministas.

La economía de tokens se administra a lo largo de todo el flujo. El sistema evita repetir instrucciones estables, reutiliza artefactos previamente validados, resume estados acumulados y separa las tareas que no necesitan un modelo generativo. Cuando una capacidad puede resolverse mediante código, no consume tokens para simular una operación determinista. Esa es la mecánica detrás del 52 % menos de tokens en los 120 escenarios: no un modelo más barato, sino menos contexto inútil por llamada.

También evalúo el costo total de completar una tarea y no únicamente los tokens utilizados en una llamada. Una respuesta aparentemente económica puede resultar costosa si necesita múltiples reintentos, correcciones o revisiones manuales. La medida útil es el consumo necesario para obtener un resultado aceptable, no el precio aislado de la primera respuesta. Dash Agent AI existe en parte para medir eso sobre el trabajo real: dónde se va el gasto sin producir nada —reintentos, sesiones abandonadas, relecturas masivas—, cada patrón con su umbral escrito.

La optimización debe preservar la calidad. No considero eficiente una arquitectura que reduce el contexto y aumenta las omisiones, ni una que disminuye las llamadas y traslada el trabajo hacia una revisión humana permanente. La economía debe medirse junto con el cumplimiento de criterios, la necesidad de corrección y el tiempo total hasta completar la tarea.

Cuando comunico mejoras cuantitativas, establezco una línea base, una muestra, una métrica y unas condiciones de evaluación. Sin esa comparación, describo los mecanismos de diseño y no uso superlativos como sustitutos de la evidencia. El objetivo es construir un sistema en el que cada token tenga una función, cada llamada tenga un propósito y cada agente reciba únicamente la capacidad necesaria para cumplir su responsabilidad.

## Qué me llevo de las dos experiencias

<!-- seccion: que-me-llevo -->

Vesting y ARKHÉ representan dos etapas diferentes de una misma evolución profesional. En Vesting construí la plataforma de datos y estructuré el proceso que sirvió como marco para desarrollar 27 agentes en un entorno profesional. Allí aprendí a convertir su operación en eventos observables, a conservar evidencia sobre su comportamiento y a transformar cada implementación en aprendizaje para las siguientes.

ARKHÉ llevó esa experiencia hacia una arquitectura diferente y más especializada. El foco dejó de estar únicamente en la repetibilidad del proceso y pasó a incluir la administración del contexto, la especialización de los harnesses, la coordinación de herramientas, la economía de tokens, la verificación de resultados y la distribución explícita de responsabilidades entre personas y sistemas. Y añadió medición: 120 escenarios, una línea base y dos métricas.

Ambas experiencias confirmaron que la parte más difícil de un agente no es conectarlo con un modelo. El verdadero desafío consiste en especificar correctamente su función, proporcionarle el conocimiento necesario, limitar su espacio de actuación, evaluar su comportamiento y conservar evidencia suficiente para comprender lo que hizo.

También aprendí que repetibilidad y especialización no son objetivos contradictorios. El proceso común protege los principios que deben permanecer. Los harnesses especializados permiten adaptar el comportamiento a cada tarea. La arquitectura madura aparece cuando ambos niveles pueden coexistir sin que cada nueva solución tenga que reconstruir el sistema completo.

## Escala y repetibilidad frente a profundidad y especialización

<!-- seccion: escala-frente-a-profundidad -->

La Ingeniería Industrial me permite analizar estos ecosistemas como procesos: entradas, actividades, restricciones, transferencias, controles, excepciones y resultados. El Diseño Industrial mantiene visible la interacción con las personas y exige que las capacidades, límites y solicitudes de intervención sean comprensibles. El DP-600 sustenta la plataforma analítica que observa a los agentes; la ruta AI-103 profundiza la construcción de aplicaciones y agentes; y la ruta AI-300 amplía la disciplina necesaria para evaluarlos y operarlos de manera confiable.

El aprendizaje final es claro: un agente no debe evaluarse por la fluidez con la que conversa ni por la cantidad de herramientas que puede invocar. Debe evaluarse por la calidad del trabajo que completa, la evidencia que conserva, la eficiencia con la que utiliza los recursos y la claridad con la que reconoce sus límites.

En Vesting aprendí a construir la capacidad organizacional necesaria para desarrollar y observar agentes: una plataforma y un proceso con los que una startup construyó 27 agentes para 12 clientes y los vigiló en tiempo real. En ARKHÉ transformé esos aprendizajes en una arquitectura agéntica avanzada, con 13 agentes publicados como parte visible y una investigación que la sustenta. Una experiencia demuestra escala profesional y repetibilidad; la otra, profundidad arquitectónica, especialización, medición y evolución independiente.
