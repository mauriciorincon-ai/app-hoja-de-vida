---
slug: rag-y-el-chat
titulo: "RAG: cómo funciona este chat por dentro"
resumen: "La arquitectura del chat de esta página con sus números: índice en tiempo de build, recuperación léxica con MiniSearch (BM25) sin embeddings, guardrails en capas, umbral medido, citas navegables, cinco proveedores intercambiables, fallback local, presupuesto de US$20 con costo real de cero, la puerta de nombre y correo con código de verificación, qué datos guarda el registro de conversaciones y quién los lee, y cómo se evalúa con 75 preguntas propias y 136 de afuera."
cuando_usar: "Úsalo cuando pregunten cómo funciona el chat de esta página, qué arquitectura RAG implementó, si usa embeddings o búsqueda léxica, con qué proveedor de modelos trabaja, cómo evita que el modelo invente respuestas, y cómo evalúa el sistema con un golden set y un banco de preguntas. Úsalo también para todo lo que tenga que ver con la puerta del chat y con la privacidad: por qué pide el nombre y el correo antes de responder, para qué sirve el código de verificación de seis dígitos que llega por email, qué datos personales guarda, quién puede leerlos, cuánto duran, cómo pedir que los borren, y por qué las respuestas son de dos o tres párrafos en vez de un volcado del corpus."
estado: aprobado
ancla: "#vitrina"
actualizado: 2026-09-21
preguntas_de_prueba:
  - "¿Cómo funciona el chat de la hoja de vida de Henry?"
  - "¿Qué experiencia tiene Henry con RAG?"
  - "¿Usa embeddings o búsqueda vectorial?"
  - "¿Por qué el chat me pide el nombre y el correo antes de responder?"
  - "¿Qué datos personales guarda este chat y quién puede leerlos?"
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

Si esta respuesta fue generada por el chat de esta página, estás utilizando una implementación real de la arquitectura que describo. Es un sistema de generación aumentada por recuperación —RAG— construido por mí para responder preguntas sobre mi trayectoria a partir del contenido versionado y publicado en CV Viva, y solo a partir de él.

No es un ejemplo aislado ni una demostración preparada para una presentación. Es una capacidad integrada en una aplicación pública desde julio de 2026, utilizada por personas reales y sometida a restricciones reales de disponibilidad, costos, latencia, seguridad, actualización y experiencia de usuario. Cada respuesta se arma con las cuatro fuentes más relevantes que la recuperación entrega al modelo, y cada una de esas fuentes navega a una sección visible del sitio.

Operar esta capacidad exige tomar decisiones que un prototipo puede evitar: qué información está autorizada, cómo se recupera, cuándo debe llamarse al modelo, qué ocurre si el proveedor falla y cómo puede verificarse cada respuesta. Todas esas decisiones están escritas —tres de ellas como registros de decisión de arquitectura del repositorio: el adaptador de proveedores, el índice con su recuperación y la entrada de las fichas de la vitrina al índice— y todas se pueden contrastar con el comportamiento del chat.

El chat convierte así mi propia hoja de vida en un producto de inteligencia artificial observable. Cada respuesta permite evaluar directamente cómo diseño recuperación, grounding, guardrails, citación, degradación controlada y administración de costos. Con un presupuesto de US$20 al mes y un costo real observado de US$0, además, demuestra que una capacidad generativa pública puede sostenerse sin que la factura sea la que decide la arquitectura.

## Por qué el modelo no es la memoria del sistema

<!-- seccion: el-modelo-no-es-la-memoria -->

La función del modelo no es recordar mi trayectoria ni improvisar una versión persuasiva de ella. Su responsabilidad consiste en organizar y explicar la evidencia recuperada desde el sitio. La fuente de conocimiento se encuentra en el contenido publicado; el modelo actúa como una capa de interpretación condicionada por ese contenido.

Esta separación protege la integridad del sistema. Mi perfil puede evolucionar mediante cambios controlados en los archivos que lo representan —los datos del currículum en YAML, las fichas de las 32 piezas de la vitrina y los documentos de esta base de conocimiento— sin depender de reentrenar un modelo ni esperar que un proveedor haya incorporado información reciente. Cuando una experiencia, certificación o proyecto cambia, la actualización ocurre en la fuente y se propaga al índice durante la siguiente construcción del sitio.

La arquitectura refleja una decisión de fondo: la inteligencia generativa no debe ocupar el lugar del conocimiento verificable. Debe ayudar a encontrarlo, relacionarlo y comunicarlo sin romper el vínculo con su procedencia. Por eso el proveedor generativo es intercambiable por configuración entre cinco adaptados, y por eso ninguno de ellos se queda con el conocimiento: la telemetría técnica anota proveedor, modelo, milisegundos y tokens, y el registro de la conversación —que desde el 21 de septiembre de 2026 sí guarda la pregunta y la respuesta— vive en mi propia base de datos, no en la del proveedor, y se le advierte a quien pregunta antes de que escriba la primera palabra. Más abajo lo explico entero.

Es la misma regla que aplico en una plataforma de datos: el dato no adquiere confiabilidad cuando aparece en la pantalla, sino durante el recorrido que lo prepara, valida y contextualiza. Aquí, la respuesta del chat no comienza cuando interviene el modelo. Comienza en la calidad del contenido, en la estructura del índice y en la preservación de sus metadatos.

## El conocimiento se construye antes de la pregunta

<!-- seccion: el-indice -->

El conocimiento utilizado por el chat se compila durante la construcción del sitio y no en el momento en que una persona formula una pregunta. Un script del build recorre las fuentes autorizadas —los datos del currículum, las apps del pipeline, las fichas de la vitrina y los documentos aprobados de esta base—, extrae sus contenidos y produce un índice separado por idioma, español e inglés, con fragmentos, títulos, metadatos y destinos navegables.

Cada fragmento conserva una referencia hacia la sección o página de la que proviene. La recuperación no entrega únicamente texto al modelo. También suministra la identidad de la fuente y el destino que posteriormente permitirá al usuario verificar la afirmación dentro del sitio.

El tamaño del fragmento está decidido y medido: como máximo 180 palabras. Una subsección más larga se parte en ventanas que conservan la misma ancla, porque un fragmento largo entra entero al contexto y compite consigo mismo; con ese tope, el peor caso del contexto de una respuesta queda acotado en unas 720 palabras. El índice tiene historia y vale la pena contarla: arrancó con 28 fragmentos por idioma, salidos solo de los YAML del currículum; las 32 fichas de la vitrina le sumaron 226; con la primera versión larga de esta base llegó a 494; y hoy, con los 25 documentos aprobados y la descripción de «cuándo usar» que cada uno declara, son 1.467 fragmentos en español y 1.457 en inglés. El número lo imprime cada build y es un artefacto regenerado, no editable a mano.

Esta decisión desplaza hacia el proceso de construcción actividades que no necesitan repetirse en cada consulta. El contenido se analiza, divide y valida una vez por versión publicada. La pregunta puede concentrarse entonces en recuperar los fragmentos pertinentes y construir la respuesta, sin volver a procesar todo el corpus.

## El índice es un artefacto inspeccionable y una puerta de calidad

<!-- seccion: indice-puerta-de-calidad -->

El índice es un artefacto inspeccionable. Puede abrirse, compararse entre versiones y someterse a pruebas: es un archivo JSON por idioma que se genera en cada build y que el servidor lee del disco. Esta propiedad resulta importante porque convierte la recuperación en una parte observable del sistema, no en una capacidad opaca administrada exclusivamente por un proveedor externo.

La construcción también funciona como una puerta de calidad. Si una fuente tiene una estructura incompatible, si un documento no valida su esquema, si un identificador de subsección se repite, si carece de un destino válido o produce una referencia rota, el proceso detecta la inconsistencia antes de publicar. Los destinos válidos no se listan a mano: se derivan de las secciones de la HOME y de las rutas reales del sitio, de modo que una sección retirada deja ciegos —y en rojo— a los documentos que apuntaban a ella. Prefiero que la construcción falle de manera visible a desplegar un chat que responda utilizando fragmentos incompletos, mal identificados o imposibles de verificar.

Este diseño se relaciona con la forma en que concibo los pipelines analíticos: cada etapa recibe una entrada, aplica una transformación y deja evidencia de lo que hizo. El conocimiento publicado se trata, por tanto, como un activo versionado. Cada cambio en el corpus puede modificar la recuperación y debe poder relacionarse con una versión del sitio. Esta trazabilidad facilita investigar por qué una respuesta cambió y distinguir si la diferencia provino de la fuente, del mecanismo de búsqueda, de las instrucciones o del proveedor generativo.

Un ejemplo concreto de esa trazabilidad: la ventana de 180 palabras no se eligió por intuición. Se midió sobre el corpus real, donde la subsección típica tenía 143 palabras y la más larga 247, y a 180 solo el 4 % de las subsecciones se trocea. Cambiar ese número es un cambio versionado, con su medición al lado.

## Las 32 fichas de la vitrina entran al índice, con peso 0,5

<!-- seccion: fichas-en-el-indice -->

Hasta septiembre de 2026 el índice se armaba con los datos del currículum y con los documentos de esta base. Las 32 piezas de la vitrina —seis apps con brochure y complemento, 13 agentes, 7 investigaciones y 6 tableros— tienen fichas con promesa, cifras con procedencia, límites, «nunca» y bloques, y el chat no las veía: cuando alguien preguntaba por una pieza concreta, la respuesta salía de la prosa que yo escribí sobre la vitrina, no de la ficha.

Indexarlas tal cual produjo lo previsible: 226 fragmentos nuevos, todos ricos en vocabulario, y el banco de 131 preguntas de afuera bajó de 102 a 94 aciertos en el top-4. Las fichas le ganaban el contexto a los documentos en preguntas que no eran sobre una pieza: «¿tiene posgrado?» traía la ficha del Asistente de Posgrado, y «¿qué nivel tiene con Power BI?» traía la del Constructor de Tableros Power BI.

La solución fue un peso por fragmento que multiplica el puntaje de la búsqueda. La voz del dueño son los documentos; una ficha es evidencia de una pieza concreta y debe ganar solo cuando la pregunta es sobre esa pieza. El número salió de medir el banco sobre el índice completo de entonces, 494 fragmentos:

| Variante              | Fuente esperada en el top-4 | Preguntas con una ficha en el contexto |
| --------------------- | --------------------------: | -------------------------------------: |
| sin fichas            |                     102/131 |                                      0 |
| fichas a peso 1       |                      94/131 |                                     49 |
| fichas a peso 0,7     |                     100/131 |                                     26 |
| **fichas a peso 0,5** |                 **102/131** |                                 **11** |
| fichas a peso 0,35    |                     103/131 |                                      8 |

A 0,5 el banco recupera exactamente el número que tenía sin fichas y once preguntas —las de la vitrina— siguen recibiendo una ficha. Bajar más ya no compra nada y las vuelve invisibles. Las fichas no se editan para que indexen mejor: son de otras casas, y añadir una a la vitrina la mete al chat en el siguiente build, sin escribir prosa nueva. El peso vive en una constante del código, con su medición al lado, y sigue en 0,5 sobre un índice que ya va en 1.467 fragmentos.

## La recuperación léxica es una decisión de arquitectura

<!-- seccion: recuperacion-lexica -->

La recuperación utiliza búsqueda léxica mediante MiniSearch —el algoritmo BM25— y no depende actualmente de embeddings ni de una base de datos vectorial. Esta elección no representa una limitación accidental ni una etapa incompleta del sistema. Es una decisión arquitectónica registrada, proporcional al tamaño, la estructura y el propósito del corpus.

El contenido de CV Viva contiene títulos, nombres de secciones, fechas, empresas, certificaciones, proyectos y términos técnicos con alta capacidad de discriminación. Para esta clase de información, una búsqueda léxica bien configurada puede recuperar resultados pertinentes mediante coincidencias, ponderación de campos y tolerancia frente a errores de escritura.

La configuración concreta: el título pesa el doble que el cuerpo, hay coincidencia por prefijo y una tolerancia difusa de 0,2 para errores de escritura. Esa tolerancia sirve para armar el contexto del modelo y para la búsqueda local del fallback, donde lo que importa es no perder un fragmento relevante. El guardrail de alcance, en cambio, usa una segunda búsqueda estricta, sin tolerancia difusa: una palabra que difiere en una letra de «datos» jamás coincide con «datos». Son dos modos sobre el mismo índice, con propósitos distintos: recall alto para responder, precisión alta para decidir si se responde.

La solución favorece especialmente los títulos y otros campos capaces de expresar el propósito de cada fragmento. No todos los términos deben aportar el mismo peso. Una coincidencia en el título de una experiencia o certificación puede resultar más significativa que varias apariciones incidentales dentro de un párrafo extenso.

El enfoque también ofrece determinismo y reproducibilidad. Bajo la misma versión del índice y la misma configuración, una consulta produce la misma clasificación de resultados. Esta propiedad facilita construir preguntas de control, investigar fallas de recuperación y evaluar con claridad el efecto de cada modificación. Y no introduce costos variables por generación de embeddings, no necesita sincronizar un almacén vectorial externo y reduce las dependencias operativas: una consulta cuesta cero.

## Las palabras vacías se calibraron midiendo

<!-- seccion: stopwords-medidas -->

Una búsqueda léxica es tan buena como su lista de palabras vacías. Sin ella, «en», «de» o «the» coinciden con todo el corpus y cualquier pregunta parece pertinente. La primera lista era la evidente; la segunda tanda salió de una medición, no de una intuición.

Con el corpus de entonces, de 28 fragmentos, una pregunta ajena de cinco palabras —una petición de humor sobre mascotas, que no comparte ningún sustantivo con el corpus— puntuaba 4,28 y pasaba el guardrail. El único término que casaba era la preposición «sobre», presente en 42 de los 162 fragmentos del índice de aquel momento, y sostenía sola un falso positivo. La prueba automática de fuera de alcance no lo veía porque preguntaba la misma petición con la preposición «de», que sí estaba en la lista.

Entraron entonces a la lista las preposiciones que no son tema —«sobre», «desde», «entre», «hasta», «sin», «tras»— y los imperativos dirigidos al asistente —«escribe», «hazme», «dime»—. Son instrucciones, no tema, y su único efecto era sumar puntaje a preguntas ajenas. Esa corrección se hizo con su medición al lado, y la prueba que antes no veía el caso ahora lo ve.

Es una lección pequeña que vale para cualquier RAG: el vocabulario que comparte una pregunta con el corpus no siempre es contenido. Una parte es gramática, y la gramática se mide y se descarta. Aquellos conteos son del índice viejo; el de hoy tiene 1.467 fragmentos en español y 1.457 en inglés, y la aritmética no cambió: una preposición presente en la cuarta parte de los fragmentos sostenía sola un falso positivo, y ninguna lista escrita a ojo la habría cazado.

## Embeddings: una evolución condicionada, no una mejora automática

<!-- seccion: embeddings-condicionados -->

La regla aplicada es la misma que utilizo en mi pipeline de aplicaciones —la regla 13, código primero—: no incorporar inteligencia artificial por defecto. Antes de aumentar la complejidad, debo demostrar qué característica del problema exige una solución diferente y qué mejora verificable produciría.

Los embeddings permanecen como una evolución posible, no como una mejora automática. Su incorporación tendría sentido si un conjunto representativo de preguntas demostrara que la búsqueda léxica falla de manera sistemática al recuperar paráfrasis, relaciones semánticas o conceptos expresados con vocabularios suficientemente diferentes. Hoy ese conjunto existe —136 preguntas escritas desde afuera— y no demuestra esa falla: con cuatro fuentes por respuesta, ninguna se queda sin la suya.

En ese caso, la evolución más razonable no sería necesariamente reemplazar por completo el mecanismo actual. Podría consistir en una recuperación híbrida que combinara la precisión de los términos explícitos con la capacidad semántica de los vectores. La decisión tendría que evaluarse mediante la calidad de recuperación, la latencia, el costo, la mantenibilidad y la capacidad para explicar por qué se seleccionó cada fragmento.

La opción sigue declarada, pero ya no se vota. En septiembre de 2026 retiré del sitio el roadmap de funcionalidades de CV Viva —el retrieval con embeddings y la memoria de la conversación estaban entre ellas—: el roadmap votable es hoy el de cada app hermana, vive en su propia ficha y se vota ahí; esta hoja de vida muestra lo que construyo, no somete a votación sus propias funciones. De modo que los embeddings no van a entrar porque alguien los pida, y tampoco porque sean habituales en arquitecturas RAG. Van a entrar el día que una medición lo justifique, y hoy no lo hace: el banco de preguntas tendría que mostrar una familia de consultas que la búsqueda léxica pierde de forma sistemática —paráfrasis, sinónimos, vocabulario que el corpus no escribe— y que el léxico obligatorio de cada documento ya no alcance a cubrir. Ese día el número que hay que mover no es un voto, es el conteo de preguntas sin su fuente en el top-4, que hoy es cero.

Prefiero una arquitectura suficientemente avanzada para resolver el problema y suficientemente comprensible para poder gobernarla. La sofisticación solo genera valor cuando mejora un resultado demostrable.

## Recuperar no es todavía responder

<!-- seccion: recuperar-no-es-responder -->

Una arquitectura RAG contiene al menos dos responsabilidades diferentes: localizar evidencia y construir una respuesta basada en ella. Mantenerlas separadas permite evaluar con mayor precisión dónde se origina un error.

La recuperación debe seleccionar fragmentos pertinentes: aquí, los 4 más relevantes, numerados. La generación debe utilizar únicamente esos fragmentos para responder. Un resultado deficiente puede producirse porque el índice no contenía la información, porque la consulta no recuperó el fragmento correcto o porque el modelo ignoró, interpretó incorrectamente o exageró la evidencia disponible.

Esta separación evita atribuir indiscriminadamente todas las fallas al modelo. Si la recuperación no proporciona la fuente correcta, incluso un modelo avanzado puede producir una respuesta incompleta. Si la evidencia es suficiente y la respuesta introduce afirmaciones adicionales, el problema se encuentra en el control de la generación.

Por eso, la evaluación debe observar ambas capas. Para la recuperación importa si los fragmentos relevantes aparecen entre los primeros resultados y si el contenido irrelevante queda fuera; es lo que miden el golden set y el banco de preguntas sobre el índice real, con el mismo módulo de búsqueda que corre en producción. Para la respuesta importa si las afirmaciones están sustentadas, si las citas corresponden con ellas y si el sistema declara adecuadamente los vacíos.

También debe evaluarse la respuesta final como experiencia. Una recuperación técnicamente correcta puede producir una respuesta poco útil si el contenido se presenta sin jerarquía, repite fragmentos o no identifica claramente la conclusión. La calidad requiere fundamentos sólidos y una organización comprensible de la información.

Esta dimensión conecta con mi formación en Diseño Industrial. El usuario no interactúa con el índice, el prompt ni el proveedor. Interactúa con una respuesta. La arquitectura debe ocultar la complejidad innecesaria sin ocultar la procedencia, las limitaciones ni los mecanismos necesarios para verificarla.

## Fuera de alcance antes de consumir tokens

<!-- seccion: fuera-de-alcance -->

El chat fue diseñado para responder sobre mi trayectoria, experiencia, proyectos, capacidades y contenido publicado en CV Viva. No pretende funcionar como un asistente general ni utilizar el alcance del modelo para contestar preguntas ajenas al propósito del sitio.

La primera capa de control opera antes de llamar al proveedor generativo. La consulta se compara con el índice en modo estricto y, si ningún fragmento alcanza el umbral de relevancia, el sistema responde mediante un mensaje fijo, bilingüe, que explica el alcance disponible: 0 tokens consumidos, 0 llamadas al proveedor.

Esta decisión evita gastar en preguntas que el sistema no debería responder. También reduce el riesgo de que el modelo utilice su conocimiento general para improvisar contenidos que no pertenecen a la base autorizada.

La respuesta fuera de alcance no intenta parecer inteligente. Su función es delimitar con honestidad lo que la aplicación puede hacer y orientar al usuario hacia preguntas compatibles con su propósito. En una arquitectura gobernada, reconocer el límite resulta más valioso que producir una respuesta plausible sobre cualquier tema.

Este mecanismo también protege el presupuesto. Una pregunta ajena al dominio —«¿va a llover mañana en Madrid?»— se resuelve sin utilizar el proveedor, y una secuencia de consultas irrelevantes no debería convertirse automáticamente en consumo generativo.

El principio es aplicable a sistemas empresariales de mayor escala: la primera decisión de una solución inteligente no siempre debe ser qué responder, sino si está autorizada y suficientemente informada para responder.

## El umbral está medido, y el hallazgo es negativo

<!-- seccion: umbral-medido -->

El umbral debe ser evaluado cuidadosamente. Si es demasiado bajo, preguntas irrelevantes pueden llegar al modelo. Si es demasiado alto, consultas válidas pueden rechazarse. Por eso su configuración se contrastó con preguntas representativas, variaciones lingüísticas, errores de escritura y formulaciones indirectas: el banco entero, con sus 15 preguntas ajenas, contra el corpus completo.

El hallazgo fue negativo, y prefiero decirlo con sus números. La pregunta legítima que peor puntúa da 5,92 —«¿sabe DAX?»— y la ajena que mejor puntúa da 16,90 —una petición de escribir una función en otro lenguaje que ordene una lista—. Entre esos dos números viven 30 preguntas legítimas. Cualquier umbral que bloquee a la ajena más alta se lleva por delante a un tercio de las buenas, y está medido: con el umbral en 7, diez preguntas legítimas reciben «eso se me escapa» —«¿qué lo motiva?», «¿por qué debería contratarlo?»— a cambio de bloquear tres ajenas más.

La razón es aritmética. El puntaje suma sobre los términos que casan, así que una pregunta ajena larga con tres palabras comunes puntúa más que una pregunta legítima corta como «¿sabe Kubernetes?». Ningún número separa eso. Por eso el umbral es deliberadamente bajo —1, que significa exactamente «casó algo sustantivo»— y el resto lo hacen las demás capas. Se volvió a medir en septiembre de 2026, sobre los 494 fragmentos que el índice tenía entonces: la legítima que peor puntúa en modo estricto da 6,65, ninguna de las 136 baja de 1 y las ajenas bloqueadas dan 0. No hay margen que ganar moviéndolo.

Lo que este guardrail sí garantiza: que una pregunta sin un solo término sustantivo del corpus se responde sin llamar al proveedor. Lo que no garantiza: que toda pregunta ajena se detenga aquí. Las que comparten vocabulario con el contenido pasan al modelo, y ahí las detiene el prompt que prohíbe responder fuera de las fuentes. La garantía de corrección es el prompt; el umbral es un ahorro de tokens y una primera línea. El peor fallo posible de este chat no es gastar tokens en una pregunta ajena: es contestar «eso se me escapa» a una pregunta legítima sobre mi trayectoria. Cuando el corpus crece, el umbral se vuelve a medir, no a suponer, y el índice ya va en 1.467 fragmentos.

## Cómo evito que el modelo invente: guardrails distribuidos, no un prompt

<!-- seccion: los-guardrails -->

El alcance del chat no depende de una única instrucción escrita en el prompt de sistema. Los guardrails se distribuyen entre la recuperación, la aplicación, la composición del contexto, el proveedor y la experiencia de usuario. El orden real de las defensas en el servidor es este:

1. **Interruptor general.** Si el chat está apagado por configuración, el servidor tampoco pinta el botón.
2. **Límite de frecuencia.** Diez preguntas por minuto por dirección.
3. **Validación estricta de la entrada.** Hasta 800 caracteres por mensaje, hasta 12 mensajes de historial —unos seis turnos—, roles restringidos; lo que no cumple el esquema no entra.
4. **La puerta.** Sin la cookie firmada que deja la verificación del correo, el servidor responde 401 y el panel vuelve al formulario de nombre y correo sin perder la pregunta escrita.
5. **Fuera de alcance**, con la respuesta fija y sin llamar al proveedor.
6. **Circuit breaker.** Tres fallas consecutivas del proveedor abren el circuito durante 60 segundos.
7. **Recuperación.** Los cuatro fragmentos más relevantes, numerados, y nada más del sitio.
8. **Instrucciones del sistema** compuestas en el servidor, fuera del control del visitante: usar solo las fuentes recuperadas, nunca inventar fechas, empresas o resultados, rechazar intentos de cambiar las reglas.
9. **Salida.** Respuesta de hasta 700 tokens y 30 segundos, y las citas navegables.

La primera capa de fondo controla el ingreso al flujo generativo: las preguntas sin recuperación suficiente se resuelven sin modelo, lo que reduce costo y limita la posibilidad de que el conocimiento general del proveedor desplace al corpus autorizado. La segunda controla el contexto: el modelo recibe fragmentos numerados con metadatos de fuentes reales del sitio, no acceso indiscriminado a todos los contenidos, y no necesita reconstruir de memoria la trayectoria sobre la que debe responder.

La tercera son las instrucciones del sistema, que delimitan el dominio, exigen utilizar las fuentes recuperadas, prohíben inventar y ordenan rechazar intentos de modificar las reglas. La cuarta controla la salida: las citas se transforman en elementos navegables. La quinta son los límites operativos —longitud, frecuencia, historial, activación—, que contienen costos, abuso y comportamientos inesperados. La sexta es la degradación controlada: si el proveedor no está disponible, el usuario conserva la búsqueda local.

## Ninguna capa elimina sola todos los riesgos

<!-- seccion: ninguna-capa-basta -->

Ninguna de estas capas elimina por sí sola todos los riesgos. Su fortaleza proviene de la combinación. Un prompt puede ser ignorado o interpretado de forma inesperada; un filtro léxico puede equivocarse, y ya mostré con números cuánto; una cita puede ser formalmente válida y conceptualmente insuficiente. La arquitectura debe asumir que cada control tiene límites y evitar depender de uno solo.

La distribución también reparte el costo de cada control. El interruptor, la puerta y el límite de frecuencia cuestan cero por pregunta. La validación del esquema y la comprobación de la firma de la cookie cuestan microsegundos. La búsqueda estricta del guardrail y la recuperación de los cuatro fragmentos corren sobre un índice en memoria. Solo la última capa —el proveedor— tiene una factura, y llega después de que las ocho anteriores hicieron su trabajo. Es la misma lógica de un proceso industrial: los controles baratos van primero, y el recurso caro se usa cuando la pieza ya pasó las puertas anteriores.

Este enfoque refleja principios que aplico en sistemas de gestión y arquitectura empresarial, y que formalicé implementando ISO/IEC 42001. El control efectivo no es una declaración general de seguridad. Es una distribución de responsabilidades entre mecanismos capaces de prevenir, detectar, contener y hacer visible una desviación. Y cada uno de esos mecanismos tiene su prueba: el límite de frecuencia, el esquema de entrada, el circuit breaker, el guardrail y el fallback se ejercitan con fallas provocadas en la suite automatizada, porque un control que nunca se vio en rojo no ha demostrado nada.

## Las citas son parte de la arquitectura

<!-- seccion: citas-navegables -->

Cada fragmento del índice conserva un destino navegable dentro del sitio. Cuando el modelo utiliza una fuente, la respuesta presenta una marca que lleva al usuario hacia la sección correspondiente: un ancla de la HOME, la página de un case study o la ficha de una pieza de la vitrina.

Esta capacidad convierte la cita en algo más que una referencia visual. Permite recorrer la respuesta hasta la evidencia que la fundamenta y evaluar directamente si la fuente respalda la afirmación.

La navegación también impone disciplina sobre la construcción. Una cita no puede apuntar a una sección inexistente ni utilizar un identificador que el sitio no pueda resolver. Los destinos se comprueban en el build contra el catálogo derivado de las rutas reales, y cualquier ruptura se trata como una falla de construcción: el sitio no se publica con una cita ciega.

La trazabilidad beneficia tanto al visitante como al desarrollo. Si una respuesta resulta incompleta o incorrecta, puedo observar qué fragmentos fueron recuperados, cuáles fueron citados y qué sección del contenido necesita corregirse o reorganizarse. En la reescritura de esta base de conocimiento, en septiembre de 2026, ese recorrido fue el método de trabajo: pregunta, fragmentos recuperados, sección que faltaba.

Este principio conecta directamente con mi experiencia en gobierno de datos. Una métrica no se vuelve confiable por tener una etiqueta de procedencia si la fuente no contiene los datos o la regla que la sustenta. Del mismo modo, una respuesta generativa no se vuelve verificable por incluir una cita decorativa.

## La verdad exacta sobre los chips de fuentes

<!-- seccion: la-verdad-de-los-chips -->

La presencia de una cita no garantiza por sí sola la calidad. El fragmento debe ser pertinente y sostener realmente la afirmación. Por eso, las pruebas no deben verificar únicamente que aparezcan referencias, sino que exista una relación válida entre la respuesta y la evidencia. Y sobre eso prefiero escribir lo que hay, no lo que suena mejor.

Los chips que acompañan una respuesta son las cuatro fuentes que la recuperación entregó al modelo, y cada uno navega a su sección del sitio. No existe hoy un validador de salida que compruebe que el modelo usó cada fuente citada en cada frase; existe la prueba de que ninguna cita puede apuntar a un destino inexistente, y existe el prompt que obliga al modelo a numerar las fuentes que utiliza. La relación entre la afirmación y la evidencia la verifica hoy quien lee, con el destino a un clic.

Podría haber construido el validador —es un sprint pequeño— o podría haber escrito que existe. Decidí escribir la verdad y dejar el validador como trabajo futuro declarado. Un sitio que exige procedencia a cada cifra de sus tableros no puede describir su propio chat con una capa que no tiene.

La promesa del sistema puede expresarse entonces de una forma sencilla y exacta: no tienes que confiar en la respuesta únicamente porque fue producida por un modelo. Puedes recorrerla hasta las 4 fuentes que el modelo tuvo delante y evaluarla por ti mismo. Para eso el destino tiene que existir, y eso sí está garantizado en cada build.

## El proveedor es intercambiable; el conocimiento no

<!-- seccion: proveedor-intercambiable -->

La arquitectura separa el proveedor generativo del conocimiento y de la lógica principal de la aplicación. El contenido autorizado, el índice, la recuperación y las reglas fundamentales permanecen bajo control del sistema, mientras el proveedor cumple una función delimitada de síntesis y generación.

La configuración permite seleccionar, con una variable de entorno y sin tocar código, entre cinco proveedores previamente adaptados e integrados sobre el Vercel AI SDK: Groq —el inicial, con Llama 3.3 70B, elegido en julio de 2026 por su velocidad y su cuota gratuita—, Gemini 2.5 Flash, Azure a través de Microsoft Foundry (antes Azure AI Foundry), Claude —con Haiku 4.5 por defecto— y cualquier servicio compatible con la API de OpenAI, incluidos los autoalojados. El cambio se realiza mediante configuración y no exige modificar la lógica central del chat. Cambia el proveedor; no cambian los hechos sobre los que responde.

El beneficio principal es reducir el acoplamiento. La aplicación no debería dejar de existir porque cambie un proveedor, se modifique una cuota o desaparezca un modelo específico. La arquitectura necesita preservar la capacidad de sustituir la dependencia sin reconstruir el conocimiento ni la experiencia completa.

El proveedor tampoco se convierte en la memoria oficial de la aplicación. Puede cambiar la forma en que organiza una respuesta, pero no debe modificar los hechos sobre los que responde. Esa responsabilidad pertenece al contenido versionado y al mecanismo de recuperación.

## Intercambiable no significa equivalente: la capa de adaptación

<!-- seccion: capa-de-adaptacion -->

Que el proveedor se elija por configuración no significa que cualquier servicio pueda incorporarse automáticamente ni que todos los modelos produzcan resultados equivalentes. Cada proveedor tiene formatos, límites, modelos, políticas, ventanas de contexto y comportamientos diferentes. La intercambiabilidad depende de una capa de adaptación —el único módulo del repositorio que conoce proveedores concretos— y de pruebas que demuestren que el proveedor seleccionado conserva las condiciones mínimas del sistema: grounding, citas numeradas, rechazo fuera de alcance, respuesta acotada.

Esa capa hace algo más que traducir formatos: decide qué pasa cuando falta una credencial. Si el proveedor configurado no tiene su clave o su modelo, la aplicación no falla en silencio ni en producción: el chat entra en el mismo modo de degradación que usaría ante una caída, y desde el sprint 3 toda credencial pasa además una prueba de humo antes de construir contra ella.

Esta decisión se relaciona con la arquitectura empresarial de inteligencia artificial. Los modelos evolucionan con rapidez y las dependencias externas pueden cambiar. Diseñar una solución sostenible exige separar aquello que es propio de la organización, como sus datos, definiciones y reglas, de aquello que puede sustituirse, como el servicio generativo utilizado para procesarlos. En Microsoft Foundry, en Groq o en un modelo autoalojado, el índice —1.467 fragmentos en español— y las nueve defensas del servidor son exactamente los mismos.

## El sistema se degrada sin ocultarlo

<!-- seccion: degradacion-controlada -->

No utilizo la expresión «nunca se cae» porque ninguna arquitectura puede prometer disponibilidad absoluta. Lo que sí diseñé fue una degradación controlada que conserva una función útil cuando el proveedor generativo no está disponible o no puede completar la solicitud.

Ante una falla, un agotamiento de cuota, un tiempo de espera vencido o un circuito abierto tras tres fallas consecutivas, el servidor responde con un código 503 que la interfaz reconoce, y pasa a una búsqueda local en el navegador sobre el mismo índice: presenta los fragmentos más relevantes, diciendo que es un fallback y no una respuesta del modelo. El usuario pierde la síntesis generativa, pero conserva acceso al conocimiento. Es el mismo asset con dos consumidores: el servidor lo lee del disco en cada pregunta, y el navegador lo descarga solo cuando lo necesita, así que no pesa en la carga inicial del sitio.

La interfaz comunica este cambio de manera explícita. No presenta una búsqueda local como si hubiera sido producida por el modelo ni oculta la reducción de capacidad. La honestidad sobre el estado de la solución forma parte de su experiencia y de su gobierno.

Este comportamiento se diseñó porque la función esencial del chat no es generar prosa, sino facilitar el acceso verificable a la información del sitio. Si la generación falla y la evidencia continúa disponible, la aplicación todavía puede cumplir parte importante de su propósito. La primera vez que ocurrió en serio no fue un simulacro: en el sprint 3, una credencial del proveedor devolvió un 401 en la integración, el circuito se abrió y el fallback funcionó tal como estaba diseñado.

La degradación controlada también protege la percepción del usuario. Un error técnico sin alternativa convierte una dependencia externa en una falla total de la experiencia. Una ruta secundaria permite conservar continuidad y expresar con claridad qué componente no está disponible.

Este principio proviene de la Ingeniería Industrial y del diseño de sistemas. No todas las fallas pueden evitarse, pero sus efectos pueden anticiparse, contenerse y comunicarse. Una arquitectura resiliente no es la que niega la posibilidad de fallar, sino la que decide de antemano cómo conservará su función esencial cuando ocurra.

## El costo es una variable de arquitectura

<!-- seccion: costo-y-presupuesto -->

El chat opera bajo un presupuesto explícito. El objetivo no es demostrar que una aplicación generativa puede funcionar con el modelo más costoso o el contexto más amplio, sino sostener una capacidad pública cuyo costo permanezca proporcional al valor que ofrece.

El presupuesto mensual objetivo es un techo de US$20 y el costo real observado es US$0, porque el uso cabe en la cuota gratuita del proveedor inicial y porque las consultas ajenas se resuelven sin invocarlo. Esta cifra debe interpretarse dentro del volumen real de utilización, los proveedores configurados y las condiciones vigentes de sus servicios; no es una promesa de gratuidad, es una medición.

La primera decisión de ahorro ocurre antes del modelo: las preguntas fuera de alcance no consumen tokens. La segunda está en la recuperación: solo se envían los cuatro fragmentos relevantes y no la totalidad del contenido del sitio; con el tope de 180 palabras por fragmento, el contexto medio de una respuesta es de unas 540 palabras, del orden de 800 tokens. La tercera se encuentra en el historial: la aplicación conserva únicamente los 12 mensajes necesarios para mantener coherencia.

El tamaño de las respuestas también se limita, hoy a 700 tokens: subió desde 600 el día que la instrucción pasó de pedir dos a cinco frases a pedir dos o tres párrafos. Una respuesta más extensa no es automáticamente más útil y puede aumentar el costo, la latencia y la posibilidad de introducir afirmaciones innecesarias. La arquitectura busca producir la explicación suficiente, respaldada por las fuentes adecuadas.

La selección de proveedor también puede responder a costo, disponibilidad y capacidad. Sin embargo, una alternativa más económica solo resulta válida si conserva los criterios mínimos de grounding, citación y comportamiento que exige la aplicación.

La economía no se mide exclusivamente por el costo de una llamada. Una respuesta incorrecta que necesita varias correcciones, una recuperación deficiente que obliga a reformular la pregunta o una arquitectura frágil que exige mantenimiento frecuente también generan costos. AI-300 fortalece precisamente esta visión operacional: llevar inteligencia artificial a producción exige observar no solo la calidad de la respuesta, sino también la latencia, el consumo, la disponibilidad y la sostenibilidad de la solución durante su ciclo de vida.

## Seguridad, abuso y límites operativos

<!-- seccion: seguridad-y-limites -->

Una aplicación pública debe asumir que no todas las solicitudes serán legítimas ni estarán orientadas al propósito para el que fue diseñada. Por eso, el chat incorpora límites sobre la frecuencia de las consultas, su longitud, la extensión de las respuestas y el historial conservado, y todos están escritos como números, no como intenciones: 10 preguntas por minuto, 800 caracteres, 700 tokens de salida, 30 segundos, 12 mensajes, y tres códigos de verificación por dirección y por correo cada diez minutos.

La limitación por visitante y por periodo ayuda a contener automatizaciones abusivas, consumo accidental y utilización desproporcionada de la capacidad. No elimina todas las posibilidades de abuso, pero reduce la exposición y proporciona una primera barrera proporcional al alcance de la aplicación.

El historial se mantiene deliberadamente corto. Esto limita el crecimiento del contexto, reduce el costo y disminuye la posibilidad de que instrucciones antiguas alteren de manera impredecible una respuesta posterior. La aplicación conserva continuidad suficiente sin tratar toda la conversación como información permanentemente necesaria.

También existe un mecanismo de desactivación mediante configuración. Ante un problema operativo, un cambio del proveedor o una condición de seguridad, la capacidad generativa puede suspenderse sin retirar el resto del sitio, y el botón desaparece con ella.

El servidor compone las instrucciones fundamentales y controla las credenciales necesarias para comunicarse con los proveedores. Las claves viven en variables de entorno del despliegue, no se exponen al navegador ni forman parte del código público del cliente, y un hook de gitleaks bloquea cualquier commit que intente colarlas al repositorio.

Estas medidas no convierten el sistema en invulnerable. Representan controles proporcionales a una aplicación pública de alcance delimitado. La seguridad se diseña como una combinación de prevención, contención, visibilidad y capacidad de respuesta.

La publicación responsable también exige decidir qué se registra y decirlo en voz alta. Hasta el 20 de septiembre de 2026 la telemetría se limitaba a lo necesario para comprender la operación, investigar fallas y administrar costos —proveedor, modelo, milisegundos y tokens— y no guardaba la pregunta ni la respuesta. Desde el 21 sí las guarda, junto al nombre y el correo de quien las hizo, y eso cambia por completo la conversación sobre privacidad: las tres subsecciones que siguen la cuentan entera, porque un registro que no se explica es justo lo que le critico a otros productos.

## Por qué el chat pide tu nombre y tu correo antes de responder

<!-- seccion: por-que-nombre-y-correo -->

Desde el 21 de septiembre de 2026 este chat tiene puerta. Antes se abría el panel y se preguntaba; hoy, antes de la primera respuesta, pido nombre y correo, y el correo hay que verificarlo con un código de seis dígitos que llega por email. Es lo único del sitio que le exige algo al visitante, así que prefiero explicar el porqué antes de que alguien lo lea como un trámite.

Son dos razones y ninguna es de marketing. La primera es el presupuesto: un chat generativo abierto a internet es una cuenta abierta. Las defensas que ya describí —el corte de temas ajenos, el límite de diez preguntas por minuto, el tope de contexto— contienen el gasto de quien viene a preguntar, no el de quien viene a jugar. Un correo verificado sube el costo de jugar lo suficiente para que deje de tener gracia, sin poner un captcha ni una cuenta de usuario delante de alguien que solo quiere saber si manejo Microsoft Fabric.

La segunda es que quiero saber quién pregunta. Esta hoja de vida existe para conversar con reclutadores, clientes y colegas; si alguien dedica diez minutos a interrogar mi currículum sobre TransMilenio o sobre cómo gobierno un modelo, esa persona me interesa y quiero poder escribirle. El aviso que se acepta lo dice con esas mismas palabras: el nombre, el correo y las preguntas se guardan para que yo sepa quién me escribe y qué se le respondió, y se pueden borrar pidiéndomelo desde Contacto.

Lo que la puerta no es: no hay contraseña, no hay tabla de usuarios, no hay proveedor de identidad externo, no hay perfil que mantener y no se pide un dato más —ni empresa, ni cargo, ni teléfono—. El correo es la identidad y el código es la prueba de que es suyo. Y falla cerrada: si al servidor le falta el secreto con el que firma, responde 503 y no entra nadie. Una barrera que se abre sola cuando está mal configurada no es una barrera, es un adorno.

## El código de seis dígitos: cómo se verifica el correo y por qué el código nunca se guarda

<!-- seccion: codigo-de-seis-digitos -->

El mecanismo cabe en dos párrafos y aun así contiene todas las decisiones que tomaría en un sistema serio. Cuando dejas nombre y correo, el servidor genera un número de seis dígitos con el generador criptográfico del sistema —no con el aleatorio de conveniencia—, calcula su huella SHA-256 mezclada con un secreto que solo vive en el servidor y con tu propio correo, guarda esa huella y te envía el número por email. Lo que queda escrito en la base de datos no sirve para entrar: de la huella no se regresa al código, y como el secreto no está en la base, ni siquiera quien tuviera la base delante podría recalcularla.

El código vive diez minutos y admite cinco intentos. El sexto lo agota aunque sea el correcto, y toca pedir otro. La comparación se hace en tiempo constante, para que la demora de la respuesta no delate cuántos dígitos acertaste. Y pedir códigos tiene su propio freno: tres cada diez minutos por dirección y por correo.

Cuando el código coincide ocurren dos cosas en la misma transacción: la fila del código se borra —es de un solo uso por construcción, no por buena voluntad— y el servidor emite una cookie firmada con HMAC-SHA256 que dice quién eres y hasta cuándo. Dura 30 días, es httpOnly —el JavaScript de la página no la puede leer—, viaja con SameSite=Lax y solo por HTTPS en producción. No es un JWT y no necesita serlo: hay un emisor, un lector y un secreto. Si alguien le cambia un carácter a la firma, el servidor la lee como si no existiera.

De ahí en adelante el chat exige esa cookie. Sin ella responde 401, el panel te devuelve al formulario sin perder la pregunta que ya habías escrito y la reenvía apenas entras. Esa es la parte que más veces probé, porque una barrera que obliga a escribir la pregunta dos veces es una barrera que la gente no cruza.

## Qué datos guarda este chat, quién los lee y cómo pedir que se borren

<!-- seccion: que-datos-guarda-el-chat -->

Sin rodeos, porque es lo que yo querría leer: cada pregunta que se responde aquí queda guardada. La fila lleva tu nombre, tu correo, el idioma, la pregunta tal como la escribiste, la respuesta completa que se te dio, las fuentes que se citaron, el modo en que se resolvió —con el modelo, con la respuesta fija de fuera de alcance o con la búsqueda local— y el costo técnico: proveedor, modelo, tokens y milisegundos. También queda lo que contestó la búsqueda local, que ocurre en tu navegador: el panel la manda al servidor con la misma cookie, para que el registro no tenga huecos según por dónde salió la respuesta.

Lo que no se guarda: ninguna dirección IP, ningún identificador del navegador, ningún rastreo entre sitios y ningún código de verificación —de ese solo queda la huella, y solo mientras está vigente—. En el proveedor del modelo tampoco queda el registro: él recibe el contexto y devuelve el texto; la fila la escribe mi servidor.

Quién lo lee: yo, y nadie más. Las dos tablas viven en la misma base que la votación del roadmap y con el mismo patrón: seguridad a nivel de fila encendida y sin una sola política, de modo que la llave pública que usa el sitio no puede leerlas ni aunque alguien la saque del navegador. Esa llave solo puede ejecutar tres funciones —guardar un código, verificarlo, registrar una conversación—. Leer exige la llave de servicio, que vive en el panel de administración y no sale de ahí.

Cuánto se conserva y cómo se borra: no hay borrado automático, y no voy a inventar una retención que todavía no he decidido. Lo que sí hay es una vía directa: escríbeme desde el formulario de contacto del sitio y borro tus filas. Eso está en el aviso que se acepta al entrar, junto con la ley colombiana que lo regula, la 1581 de 2012. Guardar datos de otra persona obliga a decir qué se guarda, para qué, quién lo ve y cómo se sale.

## Por qué las respuestas son de dos o tres párrafos y no un volcado del corpus

<!-- seccion: respuestas-de-dos-o-tres-parrafos -->

El mismo día que puse la puerta cambié la extensión de las respuestas, y las dos cosas tienen la misma causa: esta base creció mucho. Pasó de unas 30.000 a unas 158.000 palabras por idioma, y el índice saltó de 494 a 1.467 fragmentos en español. Con esa materia prima delante, la instrucción vieja —«responde en dos a cinco frases»— producía respuestas que dejaban fuera justo lo que la persona había venido a buscar: la cifra, el nombre del sistema, el porqué de la decisión.

La regla nueva pide dos o tres párrafos desarrollados, entre 120 y 220 palabras: el primero contesta de frente, los siguientes ponen el contexto y las cifras que traen las fuentes, y el cierre ofrece profundizar en un aspecto concreto. Sin listas y sin encabezados, porque una respuesta de chat con viñetas se lee como un folleto. El tope de salida subió de 600 a 700 tokens para que esos párrafos quepan sin que el modelo se corte a media frase.

Lo que no cambió importa igual. Las fuentes siguen siendo cuatro —el número medido, que no se movió porque el corpus creciera—, el contexto sigue rondando las 540 palabras y la instrucción dice explícitamente que no se vuelque lo que dicen las fuentes: hay que elegir lo que responde la pregunta. Un modelo con más material delante tiende a resumirlo todo, y resumirlo todo es la forma más rápida de no contestar nada.

Hay una tensión honesta aquí y prefiero dejarla escrita: párrafos más largos cuestan más tokens y tardan más, exactamente lo contrario de lo que pide el presupuesto. La acepté porque el costo real observado sigue en US$0 y porque el propósito de este chat no es gastar poco, sino que alguien entienda a qué me dedico sin leerse 25 documentos. Si el gasto sube, la extensión es una perilla y se mueve en una línea.

## Cómo evalúo el RAG

<!-- seccion: evaluacion-del-rag -->

Una arquitectura RAG no debe evaluarse únicamente observando algunas respuestas convincentes. Necesita un conjunto de preguntas representativas que permita analizar la recuperación, la generación, las citas, el rechazo fuera de alcance y la degradación. Aquí corren dos conjuntos en cada cambio, con el mismo módulo de búsqueda que usa producción.

El primero es el golden set: cada documento de esta base declara en su cabecera las tres preguntas que debe contestar, y la prueba exige que cada pregunta traiga su documento entre los cuatro primeros resultados. La prueba viaja con el contenido: sumar un documento suma sus preguntas al gate sin que nadie edite las pruebas. Con 25 documentos son 75 preguntas.

El segundo es el banco de preguntas escritas desde afuera, como pregunta quien recluta o entrevista: 136 preguntas legítimas en diez familias —trayectoria, forma de trabajar, certificaciones, IA y agentes, plataforma y datos, BI y analítica, gobierno, procesos, vitrina y encaje—, más 15 ajenas y 3 declaradas sin cobertura. Cada legítima debe traer una fuente esperada en el top-4, la fuente esperada debe llegar de primera en al menos el 60 % de los casos, y las 15 ajenas deben comportarse exactamente como está declarado: cuáles se bloquean sin gastar un token y cuáles pasan al modelo, con su porqué escrito al lado.

Las preguntas cubren hechos directos, relaciones entre secciones, formulaciones indirectas, errores de escritura, consultas ambiguas y solicitudes que no pertenecen al dominio. También incluyen preguntas cuya respuesta no existe, porque la capacidad de declarar un vacío es una parte esencial del comportamiento correcto.

Para la generación, verifico que cada afirmación factual esté sustentada, que no se introduzcan datos ajenos al corpus y que la respuesta conserve el alcance solicitado. Para las citas, compruebo que cada referencia conduce a un destino válido. Y evalúo el comportamiento ante fallas: el sistema debe activar la búsqueda local cuando el proveedor no está disponible, comunicar la degradación y conservar el acceso a los contenidos relevantes. Los costos y la latencia forman parte de la evaluación: una respuesta correcta pero innecesariamente costosa o lenta indica demasiado contexto, historial excesivo o una configuración desproporcionada.

## Las dos mediciones del top-k: por qué entran cuatro fuentes y no tres ni cinco

<!-- seccion: medicion-del-top-k -->

Cuántas fuentes entran a una respuesta no es un número de gusto. El 4 sale de medir, y lo miden los dos conjuntos independientes contra el índice completo. La primera medición fue en el sprint 8, sobre los 159 fragmentos de entonces, con 48 preguntas propias y 131 de afuera. La segunda, el 20 de septiembre de 2026, sobre 494 fragmentos, con 75 y 136:

| Fuentes por respuesta | Golden set (75 propias) | Banco (136 de afuera) | Contexto medio |
| --------------------- | ----------------------: | --------------------: | -------------: |
| 1                     |                   44/75 |                98/136 |   136 palabras |
| 2                     |                   59/75 |               120/136 |   267 palabras |
| 3                     |                   67/75 |               130/136 |   402 palabras |
| **4**                 |               **75/75** |           **136/136** |   537 palabras |
| 5                     |                   75/75 |               136/136 |   670 palabras |

Con tres fuentes, seis de las 136 preguntas de afuera no traen ninguna de las suyas. Con cuatro no falla ninguna, y subir a cinco no rescata a nadie: solo agranda el contexto un 25 %, y la factura con él. Que dos conjuntos escritos con criterios distintos caigan en el mismo número, dos veces, es la parte que da confianza. Con una sola fuente el golden set acertaría el 59 %; hoy el número vive en un solo sitio del código y el golden set lo ejercita directamente. El índice de hoy ya no es el de aquellas dos mediciones —1.467 fragmentos en español, 1.457 en inglés—, y por eso se vuelve a medir cada vez que el corpus cambia: el 4 es un número medido, no una constante heredada.

## El banco como auditoría de vocabulario: ETL, lakehouse y las palabras que el corpus no decía

<!-- seccion: auditoria-de-vocabulario -->

El banco es además una auditoría de vocabulario, y esa es su función más valiosa. Como la búsqueda es léxica, una palabra que el corpus no dice no existe para quien pregunta. Cuando el banco descubrió que «ETL» y «lakehouse» no aparecían en los documentos —yo había escrito «integración de información»—, se corrigió el contenido, no la expectativa. Un léxico obligatorio por documento, derivado del banco y de las skills publicadas, vigila hoy que esas palabras sigan ahí.

Esta disciplina convierte el RAG en un sistema evaluable y no en una demostración basada en ejemplos seleccionados. AI-103 aporta los patrones para construir aplicaciones generativas y de recuperación; AI-300 amplía la capacidad para evaluar, observar y operar esas soluciones de manera sostenida. Y un control solo adquiere valor cuando puede demostrar que detecta una desviación: las pruebas incluyen fallas provocadas —citas a destinos inexistentes, consultas fuera del dominio, fragmentos ausentes, proveedor caído, respuestas que intentan introducir información no recuperada— y cada gate nuevo se vio en rojo antes de darlo por bueno.

## Qué demuestra esta aplicación sobre inteligencia artificial generativa

<!-- seccion: que-demuestra -->

El chat demuestra que puedo diseñar una solución de inteligencia artificial generativa como un sistema completo y no únicamente como una llamada a un modelo.

La arquitectura comienza en el contenido versionado, continúa en un índice construido y validado previamente, recupera evidencia mediante un mecanismo proporcional al problema, delimita el alcance antes de consumir tokens y utiliza el modelo como una capa intercambiable de síntesis entre cinco proveedores.

También demuestra que puedo decidir conscientemente qué no utilizar. No incorporé embeddings únicamente porque sean habituales en arquitecturas RAG. Primero implementé una recuperación léxica explicable, reproducible y suficiente para el corpus actual, y dejé la evolución semántica condicionada a evidencia de que produciría una mejora real.

El sistema conserva trazabilidad desde la afirmación hasta la fuente. Las citas navegables convierten la verificabilidad en una parte de la experiencia y obligan a que el contenido, el índice y la interfaz mantengan una relación consistente.

La solución también demuestra resiliencia. La dependencia generativa puede fallar sin eliminar el acceso al conocimiento. El usuario recibe una función degradada, pero útil, junto con una explicación honesta de la condición.

El presupuesto y los límites operativos muestran que el costo forma parte del diseño. La arquitectura filtra preguntas antes de llamar al modelo, restringe contexto e historial, limita respuestas y permite cambiar de proveedor sin reconstruir la aplicación completa.

DP-600 se refleja en la preparación, estructuración y gobierno del conocimiento como un activo analítico. AI-103 se refleja en la construcción de una aplicación generativa con recuperación, proveedores y guardrails. AI-300 se refleja en la preocupación por evaluación, observabilidad, resiliencia, costos y operación.

La Ingeniería Industrial aporta la visión de proceso: entradas, transformaciones, controles, excepciones, salidas y retroalimentación. El Diseño Industrial aporta la experiencia mediante la cual el usuario puede comprender la respuesta, recorrer su evidencia y reconocer cuándo la capacidad se ha degradado.

La diferencia entre declarar experiencia en RAG y demostrarla es esta aplicación. No necesito limitarme a describir una arquitectura posible. Con 75 preguntas propias y 136 de afuera corriendo en cada cambio, el visitante puede formular una pregunta, observar la respuesta, abrir sus fuentes y examinar directamente las decisiones que sostienen el sistema.
