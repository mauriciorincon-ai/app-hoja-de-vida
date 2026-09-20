---
slug: rag-y-el-chat
titulo: "RAG: cómo funciona este chat por dentro"
resumen: "La arquitectura del chat de esta página, por qué es determinista y qué demuestra."
estado: borrador
ancla: "/vitrina/apps"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Cómo funciona el chat de la hoja de vida de Henry?"
  - "¿Qué experiencia tiene Henry con RAG?"
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

## Lo que estás usando ahora mismo

<!-- seccion: lo-que-estas-usando -->

Si esta respuesta fue generada por el chat de esta página, estás utilizando una implementación real de la arquitectura que describo. Es un sistema de generación aumentada por recuperación, RAG, construido por mí para responder preguntas sobre mi trayectoria a partir del contenido versionado y publicado en CV Viva.

No es un ejemplo aislado ni una demostración preparada para una presentación. Es una capacidad integrada en una aplicación pública, utilizada por personas reales y sometida a restricciones reales de disponibilidad, costos, latencia, seguridad, actualización y experiencia de usuario. Su operación exige tomar decisiones que un prototipo puede evitar: qué información está autorizada, cómo se recupera, cuándo debe llamarse al modelo, qué ocurre si el proveedor falla y cómo puede verificarse cada respuesta.

La función del modelo no es recordar mi trayectoria ni improvisar una versión persuasiva de ella. Su responsabilidad consiste en organizar y explicar la evidencia recuperada desde el sitio. La fuente de conocimiento se encuentra en el contenido publicado; el modelo actúa como una capa de interpretación condicionada por ese contenido.

Esta separación protege la integridad del sistema. Mi perfil puede evolucionar mediante cambios controlados en los archivos que lo representan sin depender de reentrenar un modelo ni esperar que un proveedor haya incorporado información reciente. Cuando una experiencia, certificación o proyecto cambia, la actualización ocurre en la fuente y se propaga al índice durante la siguiente construcción del sitio.

La arquitectura refleja una decisión de fondo: la inteligencia generativa no debe ocupar el lugar del conocimiento verificable. Debe ayudar a encontrarlo, relacionarlo y comunicarlo sin romper el vínculo con su procedencia.

El chat convierte así mi propia hoja de vida en un producto de inteligencia artificial observable. Cada respuesta permite evaluar directamente cómo diseño recuperación, grounding, guardarraíles, citación, degradación controlada y administración de costos.

## El conocimiento se construye antes de la pregunta

<!-- seccion: el-indice -->

El conocimiento utilizado por el chat se compila durante la construcción del sitio y no en el momento en que una persona formula una pregunta. Un proceso recorre las fuentes autorizadas, extrae sus contenidos y produce índices separados por idioma con fragmentos, títulos, metadatos y destinos navegables.

Cada fragmento conserva una referencia hacia la sección o página de la que proviene. La recuperación no entrega únicamente texto al modelo. También suministra la identidad de la fuente y el destino que posteriormente permitirá al usuario verificar la afirmación dentro del sitio.

Esta decisión desplaza hacia el proceso de construcción actividades que no necesitan repetirse en cada consulta. El contenido se analiza, divide y valida una vez por versión publicada. La pregunta puede concentrarse entonces en recuperar los fragmentos pertinentes y construir la respuesta, sin volver a procesar todo el corpus.

El índice es un artefacto inspeccionable. Puede abrirse, compararse entre versiones y someterse a pruebas. Esta propiedad resulta importante porque convierte la recuperación en una parte observable del sistema, no en una capacidad opaca administrada exclusivamente por un proveedor externo.

La construcción también funciona como una puerta de calidad. Si una fuente tiene una estructura incompatible, carece de un destino válido o produce una referencia rota, el proceso debe detectar la inconsistencia antes de publicar. Prefiero que la construcción falle de manera visible a desplegar un chat que responda utilizando fragmentos incompletos, mal identificados o imposibles de verificar.

Este diseño se relaciona con la forma en que concibo los pipelines analíticos. El dato no adquiere confiabilidad cuando aparece en la pantalla, sino durante el recorrido que lo prepara, valida y contextualiza. Del mismo modo, la respuesta del chat no comienza cuando interviene el modelo. Comienza en la calidad del contenido, la estructura del índice y la preservación de sus metadatos.

El conocimiento publicado se trata, por tanto, como un activo versionado. Cada cambio en el corpus puede modificar la recuperación y debe poder relacionarse con una versión del sitio. Esta trazabilidad facilita investigar por qué una respuesta cambió y distinguir si la diferencia provino de la fuente, del mecanismo de búsqueda, de las instrucciones o del proveedor generativo.

## La recuperación léxica es una decisión de arquitectura

<!-- seccion: recuperacion-lexica -->

La recuperación utiliza búsqueda léxica mediante MiniSearch y no depende actualmente de embeddings ni de una base de datos vectorial. Esta elección no representa una limitación accidental ni una etapa incompleta del sistema. Es una decisión arquitectónica proporcional al tamaño, la estructura y el propósito del corpus.

El contenido de CV Viva contiene títulos, nombres de secciones, fechas, empresas, certificaciones, proyectos y términos técnicos con alta capacidad de discriminación. Para esta clase de información, una búsqueda léxica bien configurada puede recuperar resultados pertinentes mediante coincidencias, ponderación de campos y tolerancia frente a errores de escritura.

La solución favorece especialmente los títulos y otros campos capaces de expresar el propósito de cada fragmento. No todos los términos deben aportar el mismo peso. Una coincidencia en el título de una experiencia o certificación puede resultar más significativa que varias apariciones incidentales dentro de un párrafo extenso.

El enfoque también ofrece determinismo y reproducibilidad. Bajo la misma versión del índice y la misma configuración, una consulta produce una clasificación comparable de resultados. Esta propiedad facilita construir preguntas de control, investigar fallas de recuperación y evaluar con claridad el efecto de cada modificación.

Además, la recuperación léxica no introduce costos variables por generación de embeddings, no necesita sincronizar un almacén vectorial externo y reduce las dependencias operativas del sistema. Estas ventajas son relevantes en una aplicación pública de escala delimitada cuyo presupuesto debe permanecer controlado.

La regla aplicada es la misma que utilizo en mi pipeline: no incorporar inteligencia artificial por defecto. Antes de aumentar la complejidad, debo demostrar qué característica del problema exige una solución diferente y qué mejora verificable produciría.

Los embeddings permanecen como una evolución posible, no como una mejora automática. Su incorporación tendría sentido si un conjunto representativo de preguntas demostrara que la búsqueda léxica falla de manera sistemática al recuperar paráfrasis, relaciones semánticas o conceptos expresados con vocabularios suficientemente diferentes.

En ese caso, la evolución más razonable no sería necesariamente reemplazar por completo el mecanismo actual. Podría consistir en una recuperación híbrida que combinara la precisión de los términos explícitos con la capacidad semántica de los vectores. La decisión tendría que evaluarse mediante la calidad de recuperación, la latencia, el costo, la mantenibilidad y la capacidad para explicar por qué se seleccionó cada fragmento.

Prefiero una arquitectura suficientemente avanzada para resolver el problema y suficientemente comprensible para poder gobernarla. La sofisticación solo genera valor cuando mejora un resultado demostrable.

## Recuperar no es todavía responder

<!-- seccion: recuperar-no-es-responder -->

Una arquitectura RAG contiene al menos dos responsabilidades diferentes: localizar evidencia y construir una respuesta basada en ella. Mantenerlas separadas permite evaluar con mayor precisión dónde se origina un error.

La recuperación debe seleccionar fragmentos pertinentes. La generación debe utilizar únicamente esos fragmentos para responder. Un resultado deficiente puede producirse porque el índice no contenía la información, porque la consulta no recuperó el fragmento correcto o porque el modelo ignoró, interpretó incorrectamente o exageró la evidencia disponible.

Esta separación evita atribuir indiscriminadamente todas las fallas al modelo. Si la recuperación no proporciona la fuente correcta, incluso un modelo avanzado puede producir una respuesta incompleta. Si la evidencia es suficiente y la respuesta introduce afirmaciones adicionales, el problema se encuentra en el control de la generación.

Por eso, la evaluación debe observar ambas capas. Para la recuperación importa si los fragmentos relevantes aparecen entre los primeros resultados y si el contenido irrelevante queda fuera. Para la respuesta importa si las afirmaciones están sustentadas, si las citas corresponden con ellas y si el sistema declara adecuadamente los vacíos.

También debe evaluarse la respuesta final como experiencia. Una recuperación técnicamente correcta puede producir una respuesta poco útil si el contenido se presenta sin jerarquía, repite fragmentos o no identifica claramente la conclusión. La calidad requiere fundamentos sólidos y una organización comprensible de la información.

Esta dimensión conecta con mi formación en Diseño Industrial. El usuario no interactúa con el índice, el prompt ni el proveedor. Interactúa con una respuesta. La arquitectura debe ocultar la complejidad innecesaria sin ocultar la procedencia, las limitaciones ni los mecanismos necesarios para verificarla.

## Fuera de alcance antes de consumir tokens

<!-- seccion: fuera-de-alcance -->

El chat fue diseñado para responder sobre mi trayectoria, experiencia, proyectos, capacidades y contenido publicado en CV Viva. No pretende funcionar como un asistente general ni utilizar el alcance del modelo para contestar preguntas ajenas al propósito del sitio.

La primera capa de control opera antes de llamar al proveedor generativo. La consulta se compara con el índice y, si ningún fragmento alcanza las condiciones mínimas de relevancia, el sistema responde mediante un mensaje fijo que explica el alcance disponible.

Esta decisión evita consumir tokens en preguntas que el sistema no debería responder. También reduce el riesgo de que el modelo utilice su conocimiento general para improvisar contenidos que no pertenecen a la base autorizada.

La respuesta fuera de alcance no intenta parecer inteligente. Su función es delimitar con honestidad lo que la aplicación puede hacer y orientar al usuario hacia preguntas compatibles con su propósito. En una arquitectura gobernada, reconocer el límite resulta más valioso que producir una respuesta plausible sobre cualquier tema.

El umbral debe ser evaluado cuidadosamente. Si es demasiado bajo, preguntas irrelevantes pueden llegar al modelo. Si es demasiado alto, consultas válidas pueden rechazarse. Por eso, su configuración debe contrastarse con preguntas representativas, variaciones lingüísticas, errores de escritura y formulaciones indirectas.

Este mecanismo también protege el presupuesto. Una pregunta ajena al dominio puede resolverse sin utilizar el proveedor, y una secuencia de consultas irrelevantes no debería convertirse automáticamente en consumo generativo.

El principio es aplicable a sistemas empresariales de mayor escala: la primera decisión de una solución inteligente no siempre debe ser qué responder, sino si está autorizada y suficientemente informada para responder.

## Los guardarraíles están distribuidos, no concentrados en un prompt

<!-- seccion: los-guardarrailes -->

El alcance del chat no depende de una única instrucción escrita en el prompt de sistema. Los guardarraíles se distribuyen entre la recuperación, la aplicación, la composición del contexto, el proveedor y la experiencia de usuario.

La primera capa controla el ingreso al flujo generativo. Las preguntas sin recuperación suficiente se resuelven sin llamar al modelo. Esto reduce costo y limita la posibilidad de que el conocimiento general del proveedor desplace al corpus autorizado.

La segunda capa controla el contexto. El modelo recibe fragmentos numerados y metadatos asociados con fuentes reales del sitio. No recibe acceso indiscriminado a todos los contenidos ni necesita reconstruir de memoria la trayectoria sobre la que debe responder.

La tercera capa corresponde a las instrucciones del sistema, construidas en el servidor y fuera del control directo del visitante. Estas instrucciones delimitan el dominio, exigen utilizar las fuentes recuperadas, prohíben inventar fechas, empresas o resultados y ordenan rechazar intentos de modificar las reglas fundamentales del sistema.

La cuarta capa controla la salida. Las referencias utilizadas por el modelo deben corresponder con identificadores suministrados dentro del contexto. La interfaz transforma esas referencias en elementos navegables que permiten examinar el fragmento o la sección original.

La quinta capa está formada por límites operativos. La longitud de las entradas y salidas, la frecuencia de las solicitudes, el tamaño del historial y la activación general de la capacidad están restringidos para contener costos, abuso y comportamientos inesperados.

La sexta capa es la degradación controlada. Si el proveedor no está disponible, el usuario conserva acceso a los resultados de búsqueda local. El sistema pierde capacidad de síntesis, pero no pierde por completo su función de localizar evidencia.

Ninguna de estas capas elimina por sí sola todos los riesgos. Su fortaleza proviene de la combinación. Un prompt puede ser ignorado o interpretado de forma inesperada; un filtro léxico puede equivocarse; una cita puede ser formalmente válida y conceptualmente insuficiente. La arquitectura debe asumir que cada control tiene límites y evitar depender de uno solo.

Este enfoque refleja principios que aplico en sistemas de gestión y arquitectura empresarial. El control efectivo no es una declaración general de seguridad. Es una distribución de responsabilidades entre mecanismos capaces de prevenir, detectar, contener y hacer visible una desviación.

## Las citas son parte de la arquitectura

<!-- seccion: citas-navegables -->

Cada fragmento del índice conserva un destino navegable dentro del sitio. Cuando el modelo utiliza una fuente, la respuesta puede presentar una marca que lleva al usuario hacia la sección correspondiente.

Esta capacidad convierte la cita en algo más que una referencia visual. Permite recorrer la respuesta hasta la evidencia que la fundamenta y evaluar directamente si la fuente respalda la afirmación.

La navegación también impone disciplina sobre la construcción. Una cita no puede apuntar a una sección inexistente ni utilizar un identificador que el sitio no pueda resolver. Los destinos deben comprobarse antes de publicar, y cualquier ruptura debe tratarse como una falla de construcción.

La trazabilidad beneficia tanto al visitante como al desarrollo. Si una respuesta resulta incompleta o incorrecta, puedo observar qué fragmentos fueron recuperados, cuáles fueron citados y qué sección del contenido necesita corregirse o reorganizarse.

La presencia de una cita no garantiza por sí sola la calidad. El fragmento debe ser pertinente y sostener realmente la afirmación. Por eso, las pruebas no deben verificar únicamente que aparezcan referencias, sino que exista una relación válida entre la respuesta y la evidencia.

Este principio conecta directamente con mi experiencia en gobierno de datos. Una métrica no se vuelve confiable por tener una etiqueta de procedencia si la fuente no contiene los datos o la regla que la sustenta. Del mismo modo, una respuesta generativa no se vuelve verificable por incluir una cita decorativa.

La promesa del sistema puede expresarse de una forma sencilla: no tienes que confiar en la respuesta únicamente porque fue producida por un modelo. Puedes recorrerla hasta la fuente y evaluarla por ti mismo.

## El proveedor es intercambiable; el conocimiento no

<!-- seccion: proveedor-intercambiable -->

La arquitectura separa el proveedor generativo del conocimiento y de la lógica principal de la aplicación. El contenido autorizado, el índice, la recuperación y las reglas fundamentales permanecen bajo control del sistema, mientras el proveedor cumple una función delimitada de síntesis y generación.

La configuración permite seleccionar entre proveedores previamente adaptados e integrados, como Groq, Gemini, Azure AI Foundry o Claude, según las capacidades disponibles y las condiciones de operación. El cambio se realiza mediante configuración y no exige modificar la lógica central del chat.

Esto no significa que cualquier servicio pueda incorporarse automáticamente ni que todos los modelos produzcan resultados equivalentes. Cada proveedor tiene formatos, límites, modelos, políticas, ventanas de contexto y comportamientos diferentes. La intercambiabilidad depende de una capa de adaptación y de pruebas que demuestren que el proveedor seleccionado conserva las condiciones mínimas del sistema.

El beneficio principal es reducir el acoplamiento. La aplicación no debería dejar de existir porque cambie un proveedor, se modifique una cuota o desaparezca un modelo específico. La arquitectura necesita preservar la capacidad de sustituir la dependencia sin reconstruir el conocimiento ni la experiencia completa.

El proveedor tampoco se convierte en la memoria oficial de la aplicación. Puede cambiar la forma en que organiza una respuesta, pero no debe modificar los hechos sobre los que responde. Esa responsabilidad pertenece al contenido versionado y al mecanismo de recuperación.

Esta decisión se relaciona con la arquitectura empresarial de inteligencia artificial. Los modelos evolucionan con rapidez y las dependencias externas pueden cambiar. Diseñar una solución sostenible exige separar aquello que es propio de la organización, como sus datos, definiciones y reglas, de aquello que puede sustituirse, como el servicio generativo utilizado para procesarlos.

## El sistema se degrada sin ocultarlo

<!-- seccion: degradacion-controlada -->

No utilizo la expresión “nunca se cae” porque ninguna arquitectura puede prometer disponibilidad absoluta. Lo que sí diseñé fue una degradación controlada que conserva una función útil cuando el proveedor generativo no está disponible o no puede completar la solicitud.

Ante una falla, agotamiento de cuota o condición equivalente, el sistema puede pasar a una búsqueda local en el navegador y presentar los fragmentos más relevantes recuperados desde el índice. El usuario pierde la síntesis generativa, pero conserva acceso al conocimiento.

La interfaz debe comunicar este cambio de manera explícita. No presenta una búsqueda local como si hubiera sido producida por el modelo ni oculta la reducción de capacidad. La honestidad sobre el estado de la solución forma parte de su experiencia y de su gobierno.

Este comportamiento se diseñó porque la función esencial del chat no es generar prosa, sino facilitar el acceso verificable a la información del sitio. Si la generación falla y la evidencia continúa disponible, la aplicación todavía puede cumplir parte importante de su propósito.

La degradación controlada también protege la percepción del usuario. Un error técnico sin alternativa convierte una dependencia externa en una falla total de la experiencia. Una ruta secundaria permite conservar continuidad y expresar con claridad qué componente no está disponible.

Este principio proviene de la Ingeniería Industrial y del diseño de sistemas. No todas las fallas pueden evitarse, pero sus efectos pueden anticiparse, contenerse y comunicarse. Una arquitectura resiliente no es la que niega la posibilidad de fallar, sino la que decide de antemano cómo conservará su función esencial cuando ocurra.

## El costo es una variable de arquitectura

<!-- seccion: costo-y-presupuesto -->

El chat opera bajo un presupuesto explícito. El objetivo no es demostrar que una aplicación generativa puede funcionar con el modelo más costoso o el contexto más amplio, sino sostener una capacidad pública cuyo costo permanezca proporcional al valor que ofrece.

El presupuesto mensual objetivo se mantiene por debajo de veinte dólares y el costo observado puede ser cero cuando el uso está cubierto por cuotas disponibles o cuando las consultas se resuelven sin invocar al proveedor. Esta cifra debe interpretarse dentro del volumen real de utilización, los proveedores configurados y las condiciones vigentes de sus servicios.

La primera decisión de ahorro ocurre antes del modelo: las preguntas fuera de alcance no consumen tokens. La segunda está en la recuperación: solo se envían los fragmentos relevantes y no la totalidad del contenido del sitio. La tercera se encuentra en el historial: la aplicación conserva únicamente el contexto conversacional necesario para mantener coherencia.

El tamaño de las respuestas también se limita. Una respuesta más extensa no es automáticamente más útil y puede aumentar el costo, la latencia y la posibilidad de introducir afirmaciones innecesarias. La arquitectura busca producir la explicación suficiente, respaldada por las fuentes adecuadas.

La selección de proveedor también puede responder a costo, disponibilidad y capacidad. Sin embargo, una alternativa más económica solo resulta válida si conserva los criterios mínimos de grounding, citación y comportamiento que exige la aplicación.

La economía no se mide exclusivamente por el costo de una llamada. Una respuesta incorrecta que necesita varias correcciones, una recuperación deficiente que obliga a reformular la pregunta o una arquitectura frágil que exige mantenimiento frecuente también generan costos.

AI-300 fortalece precisamente esta visión operacional. Llevar inteligencia artificial a producción exige observar no solo la calidad de la respuesta, sino también la latencia, el consumo, la disponibilidad y la sostenibilidad de la solución durante su ciclo de vida.

## Seguridad, abuso y límites operativos

<!-- seccion: seguridad-y-limites -->

Una aplicación pública debe asumir que no todas las solicitudes serán legítimas ni estarán orientadas al propósito para el que fue diseñada. Por eso, el chat incorpora límites sobre la frecuencia de las consultas, su longitud, la extensión de las respuestas y el historial conservado.

La limitación por visitante y por periodo ayuda a contener automatizaciones abusivas, consumo accidental y utilización desproporcionada de la capacidad. No elimina todas las posibilidades de abuso, pero reduce la exposición y proporciona una primera barrera proporcional al alcance de la aplicación.

El historial se mantiene deliberadamente corto. Esto limita el crecimiento del contexto, reduce el costo y disminuye la posibilidad de que instrucciones antiguas alteren de manera impredecible una respuesta posterior. La aplicación conserva continuidad suficiente sin tratar toda la conversación como información permanentemente necesaria.

También existe un mecanismo de desactivación mediante configuración. Ante un problema operativo, un cambio del proveedor o una condición de seguridad, la capacidad generativa puede suspenderse sin retirar el resto del sitio.

El servidor compone las instrucciones fundamentales y controla las credenciales necesarias para comunicarse con los proveedores. Las claves no deben exponerse al navegador ni formar parte del código público del cliente.

Estas medidas no convierten el sistema en invulnerable. Representan controles proporcionales a una aplicación pública de alcance delimitado. La seguridad se diseña como una combinación de prevención, contención, visibilidad y capacidad de respuesta.

La publicación responsable también exige no registrar indiscriminadamente el contenido de las conversaciones. La telemetría debe limitarse a aquello que sea necesario para comprender la operación, investigar fallas y administrar costos, evitando convertir el monitoreo en una recolección innecesaria de información.

## Cómo evalúo el RAG

<!-- seccion: evaluacion-del-rag -->

Una arquitectura RAG no debe evaluarse únicamente observando algunas respuestas convincentes. Necesita un conjunto de preguntas representativas que permita analizar la recuperación, la generación, las citas, el rechazo fuera de alcance y la degradación.

Las preguntas deben cubrir hechos directos, relaciones entre secciones, formulaciones indirectas, errores de escritura, consultas ambiguas y solicitudes que no pertenecen al dominio. También deben incluir preguntas cuya respuesta no exista, porque la capacidad de declarar un vacío es una parte esencial del comportamiento correcto.

Para la recuperación, observo si los fragmentos relevantes aparecen entre los primeros resultados y si las fuentes seleccionadas contienen realmente la evidencia necesaria. Para la generación, verifico que cada afirmación factual esté sustentada, que no se introduzcan datos ajenos al corpus y que la respuesta conserve el alcance solicitado.

Las citas necesitan una evaluación propia. No basta con contar cuántas aparecen. Debo comprobar si cada referencia conduce a un destino válido y si el contenido enlazado respalda la afirmación asociada.

También evalúo el comportamiento ante fallas. El sistema debe activar la búsqueda local cuando el proveedor no está disponible, comunicar la degradación y conservar la capacidad de acceder a los contenidos relevantes.

Los costos y la latencia forman parte de la evaluación. Una respuesta correcta pero innecesariamente costosa o lenta puede indicar que se está recuperando demasiado contexto, conservando un historial excesivo o utilizando una configuración desproporcionada para la tarea.

Esta disciplina convierte el RAG en un sistema evaluable y no en una demostración basada en ejemplos seleccionados. AI-103 aporta los patrones para construir aplicaciones generativas y de recuperación; AI-300 amplía la capacidad para evaluar, observar y operar esas soluciones de manera sostenida.

Un control solo adquiere valor cuando puede demostrar que detecta una desviación. Por eso, las pruebas deben incluir fallas provocadas: citas inválidas, consultas fuera del dominio, fragmentos ausentes, proveedor no disponible y respuestas que intentan introducir información no recuperada.

## Qué demuestra esta aplicación sobre mi forma de trabajar

<!-- seccion: que-demuestra -->

El chat demuestra que puedo diseñar una solución de inteligencia artificial generativa como un sistema completo y no únicamente como una llamada a un modelo.

La arquitectura comienza en el contenido versionado, continúa en un índice construido y validado previamente, recupera evidencia mediante un mecanismo proporcional al problema, delimita el alcance antes de consumir tokens y utiliza el modelo como una capa intercambiable de síntesis.

También demuestra que puedo decidir conscientemente qué no utilizar. No incorporé embeddings únicamente porque sean habituales en arquitecturas RAG. Primero implementé una recuperación léxica explicable, reproducible y suficiente para el corpus actual, y dejé la evolución semántica condicionada a evidencia de que produciría una mejora real.

El sistema conserva trazabilidad desde la afirmación hasta la fuente. Las citas navegables convierten la verificabilidad en una parte de la experiencia y obligan a que el contenido, el índice y la interfaz mantengan una relación consistente.

La solución también demuestra resiliencia. La dependencia generativa puede fallar sin eliminar el acceso al conocimiento. El usuario recibe una función degradada, pero útil, junto con una explicación honesta de la condición.

El presupuesto y los límites operativos muestran que el costo forma parte del diseño. La arquitectura filtra preguntas antes de llamar al modelo, restringe contexto e historial, limita respuestas y permite cambiar de proveedor sin reconstruir la aplicación completa.

DP-600 se refleja en la preparación, estructuración y gobierno del conocimiento como un activo analítico. AI-103 se refleja en la construcción de una aplicación generativa con recuperación, proveedores y guardarraíles. AI-300 se refleja en la preocupación por evaluación, observabilidad, resiliencia, costos y operación.

La Ingeniería Industrial aporta la visión de proceso: entradas, transformaciones, controles, excepciones, salidas y retroalimentación. El Diseño Industrial aporta la experiencia mediante la cual el usuario puede comprender la respuesta, recorrer su evidencia y reconocer cuándo la capacidad se ha degradado.

La diferencia entre declarar experiencia en RAG y demostrarla es esta aplicación. No necesito limitarme a describir una arquitectura posible. El visitante puede formular una pregunta, observar la respuesta, abrir sus fuentes y examinar directamente las decisiones que sostienen el sistema.

