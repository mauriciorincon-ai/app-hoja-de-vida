---
slug: las-investigaciones
titulo: "Las investigaciones: método antes que resultado"
resumen: "Las siete investigaciones que publico, su método y por qué empiezan midiendo el vacío."
estado: borrador
ancla: "/vitrina/investigaciones"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué investigaciones ha hecho Henry?"
  - "¿Cómo mide Henry el vacío de la literatura antes de investigar?"
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

## Qué son

<!-- seccion: que-son -->

Mi portafolio reúne siete líneas de investigación publicadas en la vitrina de este sitio, cada una con una ficha técnica que presenta su origen, pregunta, vacío identificado, método, estado y contribución esperada. Publicarlas en la vitrina significa hacer visible su desarrollo y someter su estructura a revisión; no implica afirmar que todas hayan completado todavía un proceso de publicación científica o evaluación por pares.

No son ensayos construidos alrededor de una opinión. Cada línea comienza con una pregunta delimitada, una revisión estructurada de la literatura y una medición explícita del vacío que pretende abordar. Mi propósito no es declarar que un tema ha sido poco estudiado, sino establecer qué se ha investigado, bajo qué condiciones, qué resultados existen y qué combinación específica de elementos continúa sin una respuesta suficiente.

Investigo por dos razones. La primera es que varias de estas preguntas surgieron durante mi experiencia profesional, cuando pude observar el problema, medir algunas de sus consecuencias o reconocer sus limitaciones, pero todavía no contaba con el tiempo, los datos o las herramientas necesarias para construir una respuesta rigurosa.

La segunda es que el método de investigación fortalece directamente mi trabajo con datos e inteligencia artificial. Definir una pregunta, establecer criterios antes de observar el resultado, construir una línea base, controlar las métricas y declarar los límites son las mismas disciplinas necesarias para evaluar un modelo, un agente, una política operacional o una arquitectura empresarial.

Las investigaciones también me obligan a separar con precisión diferentes clases de afirmaciones. Una hipótesis no es un hallazgo. Un resultado sintético no constituye validación operacional. Una revisión de literatura no demuestra por sí sola la efectividad de una intervención. Un artefacto técnicamente funcional no adquiere valor únicamente porque pueda ejecutarse.

Esta distinción protege tanto el rigor académico como la credibilidad profesional. Cada pieza debe declarar qué evidencia posee, qué conclusión puede sostener y qué trabajo continúa pendiente. La investigación no se utiliza para hacer que una propuesta parezca más sólida de lo que realmente es, sino para someterla a condiciones en las que también pueda quedar refutada.

La Ingeniería Industrial proporciona la raíz de varias preguntas: asignación, balanceo, capacidad, variabilidad, confiabilidad y control. La ciencia de datos aporta los métodos para analizar la evidencia. La ingeniería de software permite construir artefactos reproducibles. La inteligencia artificial amplía la capacidad de revisar literatura, organizar conocimiento y ejecutar experimentos, siempre bajo controles que eviten convertir la fluidez del modelo en autoridad científica.

Estas siete líneas representan, por tanto, una misma forma de trabajo frente a problemas diferentes: comprender el fenómeno, medir el vacío, formular una contribución verificable y construir la evidencia necesaria para aceptar, modificar o rechazar la propuesta.

## El método: primero se mide el vacío

<!-- seccion: se-mide-el-vacio -->

Todas las investigaciones comienzan con una regla común: el vacío debe medirse antes de proponer la contribución.

No considero suficiente afirmar que un problema ha recibido poca atención, que existe escasa literatura o que ningún trabajo aborda exactamente la combinación que me interesa. Estas formulaciones pueden ser intuitivamente correctas y continuar siendo difíciles de defender. Para sostenerlas es necesario definir un corpus, establecer criterios y examinar sistemáticamente qué condiciones cumple cada obra.

La revisión no busca únicamente reunir referencias relacionadas con el tema. Debe convertir la literatura en un conjunto analizable. Cada documento se clasifica mediante criterios previamente definidos, como el fenómeno estudiado, el tipo de intervención, la unidad de análisis, las variables consideradas, el método de evaluación y la evidencia reportada.

A partir de esa estructura, el vacío deja de ser una impresión. Puede expresarse mediante conteos, intersecciones y ausencias observadas dentro del corpus revisado. También puede reconocerse que existen contribuciones cercanas, pero que todavía no resuelven la pregunta bajo la combinación de condiciones que la investigación necesita estudiar.

En la línea sobre asignación en transporte se revisaron mil cuatrocientas catorce obras sin encontrar una que modelara la falla del servicio como una propiedad de la pareja conductor-vehículo bajo la configuración específica evaluada. El vacío no se encuentra en que nadie haya estudiado asignación, confiabilidad o transporte. Se encuentra en la combinación concreta entre esos elementos y en la forma en que afectan el cumplimiento operacional.

En control de convoyes se revisaron novecientas obras sin encontrar evidencia publicada de adopción sostenida, bajo las condiciones definidas, de una política operacional equivalente a la propuesta. La literatura contiene detección, modelado, simulación y estrategias de control. La pregunta pendiente se encuentra en la distancia entre reconocer el convoy y disponer de una política aplicable, evaluable y operable.

En el estudio del espectro de agencia se examinaron ciento diecinueve marcos sobre niveles de automatización y distribución de responsabilidades. El vacío identificado no consiste en la ausencia de clasificaciones, sino en la falta de un marco que ordene los instrumentos de decisión según la agencia cedida y permita evaluarlos frente a un óptimo conocido, incorporando también su costo.

En la línea sobre fatiga laboral y balanceo se revisaron setecientas ochenta obras sin identificar una síntesis que reuniera, bajo los criterios establecidos, los métodos utilizados para determinar suplementos por fatiga y permitiera analizar cómo su calibración modifica una solución de balanceo.

En FORJA se examinaron doscientas setenta y nueve obras sin identificar un método que exigiera, para cada actividad del proceso, una especificación explícita de entradas, función y salidas como mecanismo de trazabilidad entre el modelo del negocio y el sistema implementado.

Otros corpus abordan la arquitectura de conocimiento para inteligencia artificial y la transformación progresiva de sistemas empresariales. En cada caso, la cifra adquiere sentido únicamente cuando está acompañada por criterios de búsqueda, inclusión, exclusión, clasificación y revisión.

Un vacío contado sigue teniendo límites. Demuestra que una condición no fue encontrada dentro del corpus y bajo el método aplicado. No demuestra que sea imposible que exista una obra fuera de la búsqueda ni convierte automáticamente la propuesta en una contribución válida.

Por eso, cada afirmación sobre el vacío debe conservar su alcance. La formulación correcta no es “nadie lo ha hecho”, sino “no fue identificado dentro del corpus revisado bajo estos criterios”. Esta precisión hace que la conclusión sea menos espectacular y mucho más defendible.

Un vacío afirmado puede ser una opinión. Un vacío medido contra un corpus documentado se convierte en evidencia sobre el estado del conocimiento, siempre dentro de las fronteras explícitas de la revisión.

## Siete líneas, una misma trayectoria

<!-- seccion: las-siete -->

Las siete líneas de investigación pueden organizarse alrededor de tres grandes preguntas: cómo optimizar sistemas operacionales bajo variabilidad, cómo convertir procesos en sistemas implementables y cómo distribuir responsablemente la capacidad de decisión entre personas, datos e inteligencia artificial.

La primera línea estudia la asignación conjunta de conductor, vehículo y ruta bajo condiciones de demanda, tipología y posibilidad de falla. Surgió de mi experiencia en la supervisión del transporte, donde las listas de conductores, vehículos y servicios podían administrarse por separado aunque el resultado dependiera de su interacción.

La investigación busca construir un modelo prescriptivo que permita comparar configuraciones y seleccionar parejas o tripletas capaces de mejorar el cumplimiento operacional y la capacidad movilizada. El desarrollo avanza de forma progresiva: primero estudia configuraciones más controladas y después amplía la libertad de asignación.

La segunda línea estudia los convoyes de buses. El problema no termina al detectar que varios vehículos circulan con intervalos demasiado reducidos. La pregunta central consiste en determinar qué política puede disolver el agrupamiento mediante instrucciones aplicables, diferenciadas según la posición del vehículo y evaluadas frente a alternativas de control.

Esta investigación surge de una condición observada durante la operación: el sistema podía hacer visible el convoy sin disponer necesariamente de una acción suficientemente específica para corregirlo. La contribución busca cerrar la distancia entre detección, explicación e intervención.

La tercera línea analiza los suplementos por fatiga y su efecto sobre el balanceo. El problema surgió inicialmente en contextos productivos y de digitalización, donde aplicar un porcentaje general podía ignorar diferencias relevantes entre tareas, ambientes, esfuerzos y condiciones humanas.

El trabajo busca construir un protocolo de calibración sustentado en literatura y evaluar si modificar los suplementos transforma la configuración óptima de una línea. La pregunta no es únicamente cuánto descanso debe agregarse, sino si una representación más precisa de la fatiga cambia las decisiones sobre asignación y capacidad.

La cuarta línea, FORJA, aborda la distancia entre el proceso aprobado y el sistema que finalmente se implementa. Un diagrama puede representar actividades y secuencias sin especificar suficientemente qué recibe cada actividad, qué transformación realiza y qué salida debe producir.

FORJA propone tratar cada actividad como una caja negra abierta mediante una especificación de entradas, función y salidas. Esta estructura busca fortalecer la trazabilidad entre el proceso, los requisitos, los datos, la lógica de negocio y el comportamiento implementado.

La quinta línea, ARKHÉ, estudia cómo conservar y articular el conocimiento necesario para desarrollar soluciones de inteligencia artificial sin comenzar desde cero en cada proyecto. Su origen se encuentra en experiencias donde las iniciativas repetían problemas de contexto, integración, evaluación y observabilidad porque los aprendizajes anteriores permanecían dispersos.

ARKHÉ no busca presentar una receta única para construir inteligencia artificial. Propone una arquitectura conceptual en la que cada componente se comprende por la función que cumple dentro del conjunto: conocimiento, memoria, herramientas, evaluación, observabilidad, gobierno y mecanismos de acción.

La sexta línea estudia el espectro de agencia de los instrumentos de decisión. Surgió de observar que diferentes necesidades se resolvían mediante tableros, incluso cuando algunas requerían una alerta, una recomendación, una aplicación o un sistema con capacidad controlada de actuación.

La investigación busca ordenar estos instrumentos según el nivel de agencia que la organización les transfiere. Un reporte documenta, un tablero permite explorar, una alerta dirige la atención, una predicción anticipa, una recomendación propone y un agente puede actuar dentro de límites. La contribución pretende estudiar cuándo cada instrumento resulta apropiado y qué costos o controles introduce.

La séptima línea analiza el reemplazo progresivo de sistemas empresariales mediante capacidades de inteligencia artificial. Su origen se remonta a mi primera implementación de un ERP y se fortaleció posteriormente al observar plataformas centrales rodeadas de hojas de cálculo, automatizaciones y soluciones periféricas.

La pregunta no consiste en reemplazar indiscriminadamente un ERP con agentes. Busca determinar qué módulo o capacidad conviene intervenir primero según su valor, riesgo, dependencia y nivel de acoplamiento. La transformación debe preservar la continuidad mientras reduce progresivamente la complejidad.

Las siete líneas provienen de momentos distintos de mi trayectoria, pero comparten la misma raíz. Cada una comienza con un sistema real cuya representación era insuficiente, una decisión que podía mejorarse o una capacidad organizacional que todavía no contaba con un método suficientemente claro para evolucionar.

## De la experiencia profesional a una pregunta investigable

<!-- seccion: de-experiencia-a-pregunta -->

Un problema observado durante el trabajo no se convierte automáticamente en una investigación. La experiencia permite reconocer una dificultad, pero todavía es necesario abstraerla, delimitarla y formularla de manera que pueda estudiarse sin depender exclusivamente de una anécdota organizacional.

El primer paso consiste en separar el síntoma del mecanismo. Un incumplimiento operacional puede relacionarse con asignación, capacidad, variabilidad, reglas, datos o múltiples causas simultáneas. Formular la investigación exige identificar cuál relación específica se quiere analizar y qué evidencia permitiría distinguirla.

El segundo paso consiste en separar el contexto de origen de la contribución generalizable. Una pregunta puede surgir en una empresa o sector particular y tener relevancia más amplia. La investigación debe conservar suficiente contexto para ser válida sin depender de información confidencial ni afirmar que una experiencia individual representa todas las organizaciones.

El tercero consiste en definir la unidad de análisis. En asignación puede ser la pareja o tripleta de recursos. En convoyes puede ser el vehículo dentro de una secuencia. En FORJA es la actividad. En agencia puede ser el instrumento de decisión. Sin una unidad clara, las variables y los criterios terminan mezclando fenómenos diferentes.

El cuarto paso consiste en definir qué resultado constituiría una contribución. No basta con construir una aplicación, modelo o marco. El artefacto debe permitir responder la pregunta, ser evaluado frente a una línea base y producir evidencia que pueda confirmar o refutar la proposición central.

El quinto consiste en establecer los límites desde el comienzo. Algunas líneas pueden evaluarse inicialmente mediante datos sintéticos, simulación o revisión documental. Estos métodos permiten estudiar mecanismos y comparar alternativas, pero no deben presentarse como validación operacional si todavía no han sido probados en condiciones reales.

Esta transformación entre experiencia y pregunta investigable es una de las competencias que más valoro. Evita que la investigación se convierta en una narración retrospectiva sobre mi trayectoria y permite que el problema pueda analizarse, cuestionarse y reproducirse independientemente de quien lo observó inicialmente.

La experiencia proporciona relevancia. El método proporciona credibilidad. La investigación aparece cuando ambas pueden conectarse sin que una sustituya a la otra.

## Congelar el criterio antes de medir

<!-- seccion: congelar-el-criterio -->

Una de las reglas centrales de mi proceso de investigación consiste en establecer los criterios, umbrales y métricas antes de observar los resultados finales.

El propósito es reducir la posibilidad de ajustar retrospectivamente la evaluación para favorecer la hipótesis o el artefacto. Si un criterio cambia después de conocer el resultado, la modificación debe quedar registrada, justificarse y distinguirse claramente del análisis originalmente previsto.

El harness utilizado para ejecutar las investigaciones conserva estos criterios como parte del flujo. La evaluación no depende únicamente de recordar qué se había planeado ni de interpretar libremente el resultado después de cada ejecución.

En el artículo piloto, dos de los tres principios evaluados no alcanzaron los umbrales establecidos por sus propias métricas. El resultado no fue ocultado ni reinterpretado como cumplimiento parcial para proteger la propuesta. La refutación quedó registrada porque su función era evaluar el artefacto, no justificarlo.

Este resultado es especialmente valioso. Demuestra que el sistema de evaluación tiene suficiente independencia para producir una conclusión desfavorable. Un método que solo confirma aquello que su autor esperaba puede estar midiendo convicción y no desempeño.

Congelar el criterio no significa que los métodos nunca puedan evolucionar. Una prueba puede revelar que una métrica era insuficiente o que una condición no había sido considerada. La investigación puede modificarse, pero debe conservar la diferencia entre el protocolo original, el hallazgo que motivó el cambio y la nueva versión.

Esta disciplina también resulta esencial en analítica corporativa e inteligencia artificial. Los umbrales de éxito, criterios de adopción y condiciones de aceptación deberían definirse antes de observar si el proyecto los alcanza. Cambiarlos después puede convertir una evaluación en una justificación.

AI-300 profundiza esta perspectiva mediante evaluación y observabilidad de soluciones de inteligencia artificial. Sin embargo, el principio básico permanece: primero se establece qué significará funcionar; después se mide; finalmente se publica lo que la evidencia permita sostener.

## Trazabilidad: ningún número sin su registro

<!-- seccion: trazabilidad -->

El harness de papers computacionales aplica una segunda regla: ningún número puede llegar al manuscrito si antes no existe como registro dentro del sistema que lo produjo o validó.

Esto elimina las cifras escritas manualmente en el texto sin una relación verificable con los datos, las consultas, las métricas o el experimento correspondiente. El documento consume resultados persistidos y no se convierte en una fuente autónoma de números.

Cada registro necesita conservar suficiente contexto para interpretar su valor. Una cifra sin población, versión, unidad, escenario o método puede ser técnicamente auténtica y continuar siendo analíticamente ambigua.

La trazabilidad también permite actualizar. Si una revisión incorpora nuevas obras, cambia una clasificación o corrige un registro, las cifras dependientes pueden recalcularse desde la fuente correspondiente. El manuscrito no necesita revisarse buscando números introducidos manualmente en diferentes párrafos.

Esta arquitectura reduce errores, pero también fortalece la revisión. Una persona puede recorrer una afirmación cuantitativa hasta el registro, la consulta o el artefacto que la originó y evaluar si la transformación fue adecuada.

Los gráficos, tablas y métricas deben seguir el mismo principio. No deberían reconstruirse manualmente a partir de cifras copiadas. Deben generarse desde los datos y conservar una relación controlada con la versión del análisis.

La regla también protege las comparaciones. Cuando dos ejecuciones producen resultados distintos, necesito saber si cambió el corpus, el código, el criterio, la configuración o la fuente. Sin versionamiento y trazabilidad, la diferencia puede quedar reducida a una interpretación posterior difícil de demostrar.

Este mecanismo es equivalente al linaje en una plataforma analítica. En Power BI, una cifra debe poder recorrerse hasta sus fuentes y reglas. En una investigación, una afirmación debe poder recorrerse hasta la evidencia y el cálculo que la sostienen. Cambia el artefacto final; la responsabilidad permanece.

## Una tubería declarativa para investigaciones diferentes

<!-- seccion: tuberia-declarativa -->

El pipeline de investigación no está diseñado como una secuencia exclusiva para un único artículo. Su propósito es permitir que investigaciones de clases diferentes puedan utilizar un andamiaje común sin obligar a modificar la tubería central para cada nuevo caso.

Los elementos variables deben expresarse mediante configuración, datos, criterios y componentes especializados. La tubería central conserva las responsabilidades comunes: ingestión, validación, ejecución, registro, generación de artefactos y construcción del manuscrito.

La prueba de esta arquitectura consiste en utilizar el pipeline con investigaciones diferentes y comprobar que la incorporación de un nuevo trabajo no obliga a introducir condiciones particulares dentro del mecanismo común.

Después de ejecutar tres artículos de clases distintas, el cambio esperado sobre la tubería central debe permanecer vacío. Si es necesario modificar el pipeline para reconocer el nombre, la estructura o la excepción de cada artículo, el diseño todavía no ha separado adecuadamente la variación del proceso general.

Esta condición no pretende impedir la extensión del sistema. Un nuevo tipo de investigación puede necesitar una capacidad genuinamente nueva. En ese caso, la modificación debe incorporarse como una abstracción reutilizable y no como un caso especial que solo funciona para una pieza.

La arquitectura declarativa también facilita la auditoría. Los parámetros, criterios y fuentes de cada investigación pueden examinarse sin recorrer una lógica extensa llena de excepciones. El comportamiento surge de una definición explícita y no de condiciones ocultas dentro del código.

Este enfoque conecta directamente con mi experiencia en procesos y agentes. En Vesting, el valor del proceso central consistía en permitir que diferentes agentes se desarrollaran bajo un marco común. En mi pipeline de aplicaciones, cada producto avanza mediante reglas compartidas. En investigación, cada artículo utiliza una fábrica común sin perder su pregunta ni su método particular.

La capacidad importante no es producir un artículo mediante automatización. Es construir un sistema en el que nuevas investigaciones puedan comenzar con mayor rigor, menor repetición y mejor trazabilidad que la anterior.

## Datos sintéticos, simulación y límites de validación

<!-- seccion: datos-sinteticos-y-validacion -->

Algunas investigaciones necesitan estudiar configuraciones o mecanismos para los que no existen datos públicos suficientes, no es posible utilizar información operacional o todavía no se cuenta con acceso a un entorno real. En esos casos, los datos sintéticos y la simulación pueden ofrecer una base controlada para desarrollar y contrastar el modelo.

Los datos sintéticos permiten construir escenarios con propiedades conocidas, introducir fallas, controlar distribuciones y evaluar si el método reconoce correctamente las condiciones para las que fue diseñado. También permiten publicar experimentos reproducibles sin comprometer información confidencial.

Sin embargo, una prueba exitosa con datos sintéticos no constituye validación del comportamiento en una organización real. Demuestra que el artefacto responde bajo las condiciones generadas y que el mecanismo puede estudiarse de forma controlada.

La utilidad depende de la calidad del generador y de la relación entre sus supuestos y el fenómeno. Un conjunto sintético puede producir resultados impecables porque fue construido de manera compatible con el propio modelo. Por eso, las distribuciones, restricciones y dependencias utilizadas deben documentarse y someterse a análisis de sensibilidad.

La simulación cumple una función semejante. Permite comparar políticas, asignaciones o escenarios sin intervenir directamente la operación. Su valor se encuentra en explorar mecanismos y consecuencias bajo supuestos explícitos, no en predecir con certeza lo que ocurrirá.

La validación operacional exige evidencia adicional. Puede requerir datos reales, comparación retrospectiva, evaluación por profesionales, experimentos controlados o implementación progresiva según la naturaleza de la solución.

Distinguir estos niveles evita presentar una contribución metodológica como si ya hubiera demostrado impacto empresarial. También permite reconocer con precisión qué aprendimos de cada etapa y qué pregunta permanece abierta.

Esta disciplina proviene de la Ingeniería Industrial y de la simulación de sistemas. Un modelo es una representación deliberadamente incompleta de la realidad. Su valor depende de si conserva los mecanismos necesarios para responder la pregunta, no de cuánto se parece visualmente al sistema original.

## Inteligencia artificial dentro del proceso de investigación

<!-- seccion: ia-en-la-investigacion -->

La inteligencia artificial amplía considerablemente la capacidad para explorar literatura, organizar documentos, clasificar contenidos y construir artefactos de investigación. También introduce riesgos particulares de omisión, invención, clasificación incorrecta y falsa seguridad.

Por eso, los agentes no operan como autores autónomos ni como fuentes. Pueden asistir la recuperación, extracción, normalización, clasificación y redacción, pero cada operación debe permanecer delimitada y producir evidencia que pueda revisarse.

Un agente puede proponer que una obra cumple determinado criterio. El sistema todavía necesita conservar el documento, el fragmento o la información que permitió realizar la clasificación. Una conclusión sin evidencia revisable no se convierte en válida por haber sido producida de forma consistente.

La memoria general del modelo tampoco sustituye la búsqueda. Cuando una investigación exige conocer el estado de la literatura, las afirmaciones deben provenir del corpus definido y no del conocimiento estadístico adquirido durante el entrenamiento del proveedor.

Los agentes también deben declarar los vacíos. Si el documento no contiene la información necesaria para clasificar una condición, el sistema debe reconocer la ausencia en lugar de inferir una respuesta para completar la matriz.

La especialización mediante harnesses permite distribuir responsabilidades. Un componente puede recuperar literatura, otro extraer información, otro verificar criterios y otro preparar artefactos. Cada uno opera con fuentes, formatos y validaciones correspondientes con su función.

La inteligencia artificial reduce determinadas cargas y amplía la escala posible de revisión, pero no elimina la responsabilidad metodológica. El investigador continúa definiendo la pregunta, el corpus, los criterios, las métricas y las conclusiones permitidas.

AI-103 fortalece la construcción de estos agentes y sus mecanismos de recuperación y herramientas. AI-300 amplía su evaluación, observabilidad y operación. DP-600 aporta la arquitectura analítica necesaria para organizar corpus, registros, métricas y resultados.

El propósito no es producir más texto académico con menor esfuerzo. Es aumentar la capacidad para revisar, medir y reproducir el proceso sin permitir que la automatización desplace el criterio científico.

## Publicar resultados negativos y límites

<!-- seccion: resultados-negativos -->

Una investigación no pierde valor porque una hipótesis resulte refutada, un artefacto no supere sus criterios o una intervención produzca un efecto menor al esperado.

Los resultados negativos ayudan a delimitar qué mecanismo no funciona, bajo qué condiciones deja de hacerlo y qué supuestos necesitan revisarse. También evitan que otros repitan exactamente la misma ruta sin conocer sus limitaciones.

Publicarlos exige separar cuidadosamente la ausencia de evidencia de la evidencia de ausencia. Que un experimento no detecte una mejora puede deberse a que el efecto no existe, a que la muestra es insuficiente, a que la métrica no es sensible o a que el diseño no representa adecuadamente el fenómeno.

Los límites metodológicos deben publicarse junto con los resultados. Esto incluye cobertura del corpus, calidad de las fuentes, dependencia de datos sintéticos, alcance de la simulación, supuestos y condiciones bajo las cuales la conclusión podría cambiar.

Esta práctica también fortalece mi trabajo profesional. Un proyecto que invalida correctamente una hipótesis puede evitar una inversión innecesaria. Detener una iniciativa sobre evidencia no es un fracaso; es una decisión informada que protege recursos y permite formular una alternativa mejor.

La publicación de límites genera confianza porque demuestra que el objetivo no es defender una solución a cualquier costo. Es construir conocimiento que pueda sobrevivir incluso cuando la conclusión no coincide con la expectativa inicial.

El rigor no consiste en tener razón desde la primera formulación. Consiste en diseñar un proceso capaz de mostrar cuándo no la tengo.

## De la investigación al producto y a la arquitectura

<!-- seccion: de-investigacion-a-producto -->

Las investigaciones no permanecen aisladas del resto de mi portafolio. Sus preguntas, métodos y resultados alimentan aplicaciones, agentes, modelos, patrones y decisiones de arquitectura.

FORJA puede convertirse en un método aplicable para especificar actividades antes de desarrollar aplicaciones o agentes. ARKHÉ organiza conceptos y funciones que pueden orientar una arquitectura empresarial de inteligencia artificial. El espectro de agencia ofrece un criterio para seleccionar si una decisión necesita un tablero, una alerta, una recomendación, una aplicación o un sistema con capacidad de acción.

Las investigaciones de transporte permiten desarrollar modelos de asignación y políticas de control que pueden materializarse en simulaciones, herramientas de decisión o aplicaciones operacionales. La línea sobre fatiga puede influir sobre modelos de balanceo y criterios para diseñar cargas de trabajo más sostenibles.

El reemplazo progresivo de sistemas empresariales puede convertirse en una metodología de arquitectura para decidir qué capacidades intervenir primero, cómo administrar dependencias y cómo utilizar inteligencia artificial sin comprometer la continuidad del sistema.

Esta transición necesita conservar el estado de la evidencia. Una idea respaldada por literatura no debe presentarse como producto validado. Un artefacto probado mediante simulación no debe presentarse como política demostrada en operación. Cada evolución necesita sus propios criterios de aceptación.

La investigación reduce incertidumbre conceptual. El prototipo reduce incertidumbre técnica. La validación reduce incertidumbre sobre el comportamiento. La adopción reduce incertidumbre sobre la capacidad de integrarse en una organización. Estas etapas no deben confundirse.

El Diseño Industrial aporta valor en la transición hacia el producto. El hallazgo necesita transformarse en una experiencia capaz de ser comprendida, utilizada y evaluada por las personas. La Ingeniería Industrial mantiene la relación con el proceso, las restricciones y el resultado sistémico.

La arquitectura conecta finalmente las piezas. Permite que los datos, modelos, aplicaciones, agentes y controles derivados de la investigación puedan coexistir, reutilizarse y evolucionar en lugar de permanecer como demostraciones independientes.

## Qué tiene que ver esto con un rol de inteligencia artificial

<!-- seccion: que-tiene-que-ver -->

Una parte importante de un rol de inteligencia artificial consiste en evaluar afirmaciones: si una solución funciona, si una métrica representa aquello que afirma medir, si un resultado puede generalizarse y si la evidencia disponible justifica una decisión.

Estas responsabilidades pertenecen tanto a la ingeniería como al método de investigación. Construir un modelo o un agente exige formular una hipótesis sobre su comportamiento, definir criterios, diseñar pruebas, observar resultados y reconocer los límites de la conclusión.

La revisión de literatura fortalece la arquitectura porque evita presentar como innovación una capacidad ampliamente resuelta y ayuda a identificar qué alternativas, fallas y resultados ya han sido documentados.

Congelar los criterios antes de medir protege la evaluación frente a ajustes retrospectivos. La trazabilidad de los números permite reconstruir los resultados. Los datos sintéticos y la simulación permiten estudiar mecanismos bajo condiciones controladas. La publicación de resultados negativos evita que la selección de evidencia distorsione el aprendizaje.

El pipeline computacional demuestra además capacidad de ingeniería. Las investigaciones necesitan datos estructurados, validaciones, automatización, versionamiento, generación de artefactos y controles capaces de detectar inconsistencias.

Los agentes utilizados en la revisión demuestran arquitectura de inteligencia artificial. Necesitan fuentes autorizadas, recuperación, herramientas, formatos, abstención y supervisión. La solución no puede depender de una instrucción general para investigar.

DP-600 aporta la plataforma analítica con la que pueden organizarse corpus, registros, métricas y resultados. AI-103 fortalece los agentes que recuperan, clasifican y producen artefactos. AI-300 contribuye a evaluar, observar y operar esos componentes de forma repetible.

La investigación también fortalece el gobierno de IA. Una organización necesita distinguir entre afirmaciones, evidencia, riesgos, impactos y condiciones de uso. La capacidad para exigir esa separación se desarrolla practicándola sobre el propio trabajo.

Estas siete piezas demuestran que no utilizo inteligencia artificial únicamente para construir más rápido. La utilizo dentro de un sistema diseñado para producir conocimiento trazable, refutable y reproducible.

## Lo que las siete investigaciones demuestran

<!-- seccion: lo-que-demuestran -->

Las siete investigaciones demuestran que puedo convertir una experiencia profesional en una pregunta generalizable sin revelar información confidencial ni reducir el problema a una anécdota.

Demuestran que sé medir un vacío antes de formular una contribución. Los corpus, criterios y conteos permiten establecer qué fue revisado, qué condiciones se encontraron y dentro de qué alcance puede sostenerse la ausencia identificada.

Demuestran que puedo diseñar evaluaciones capaces de producir resultados desfavorables. Congelar el criterio y publicar principios refutados protege la independencia del análisis y evita que el método se convierta en una justificación posterior del artefacto.

Demuestran ingeniería de trazabilidad. Cada cifra necesita un registro, cada tabla y gráfico deben generarse desde datos controlados y cada modificación debe poder relacionarse con una versión del corpus, del código o del criterio.

Demuestran capacidad para construir sistemas reutilizables. La tubería no depende de un artículo específico y los agentes no dependen de una única tarea. El objetivo es acumular capacidad investigativa, no automatizar superficialmente la escritura.

También demuestran responsabilidad sobre los límites. Los datos sintéticos no se presentan como validación real, la simulación no se presenta como certeza operacional y una pieza publicada en la vitrina no se presenta automáticamente como artículo evaluado por pares.

Las investigaciones conectan toda mi trayectoria. Los problemas provienen de procesos, transporte, sistemas empresariales, datos e inteligencia artificial. Los métodos integran revisión, modelado, optimización, simulación, arquitectura, aplicaciones y agentes.

Mi aporte no consiste únicamente en formular ideas innovadoras. Consiste en construir las condiciones para que esas ideas puedan ser examinadas, refutadas, reproducidas y, cuando exista evidencia suficiente, convertidas en productos, políticas o capacidades empresariales.

Ese es el valor que la investigación agrega a mi perfil: me obliga a no confundir una solución convincente con una solución demostrada.
