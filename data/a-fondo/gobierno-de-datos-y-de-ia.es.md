---
slug: gobierno-de-datos-y-de-ia
titulo: "Gobierno de datos y gobierno de IA"
resumen: "Las tres veces que monté gobierno de datos, y por qué el gobierno de IA es la continuación natural."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry en gobierno de datos?"
  - "¿Sabe Henry de gobierno de IA y de la norma ISO 42001?"
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

## Tres experiencias de gobierno, tres problemas diferentes

<!-- seccion: tres-veces -->

He asumido responsabilidades de gobierno de datos e inteligencia artificial en tres contextos profundamente diferentes: banca, una startup de agentes de IA y una institución de salud. En cada uno participé desde un alcance distinto: co-liderando una iniciativa de gobierno, diseñando desde cero principios y mecanismos para una plataforma de agentes, y gestionando actualmente la calidad de los datos mientras lidero la estructuración de una estrategia institucional de inteligencia artificial.

Esta diversidad me ha permitido comprender que el gobierno no puede trasladarse de una organización a otra como una plantilla invariable. Sus principios pueden permanecer, pero sus prioridades, controles, responsables y mecanismos de adopción deben responder al propósito, los riesgos y la madurez de cada entorno.

En Banco Pichincha co-lideré una iniciativa de gobierno orientada a fortalecer la seguridad, la calidad y la confiabilidad de la información. En un entorno financiero, el dato debe conservar definiciones consistentes, responsables identificables y condiciones claras de acceso y utilización. El gobierno también debe permitir demostrar que los controles existen y que pueden sostener decisiones importantes con evidencia verificable.

Esta experiencia me enseñó que una plataforma analítica no se gobierna únicamente mediante permisos. También necesita métricas compartidas, modelos semánticos consistentes, responsabilidades sobre las definiciones y mecanismos que permitan recorrer cada resultado hasta las fuentes y reglas que lo producen. La seguridad protege el acceso; la semántica y el linaje protegen la interpretación.

En Vesting diseñé desde cero una estrategia de datos para una plataforma que integraba información producida por agentes asociados con diferentes clientes. Allí el desafío principal era conservar identidad, propiedad, aislamiento y trazabilidad desde el ingreso de cada evento. Estos atributos no podían añadirse después de construir los productos analíticos, porque formaban parte de la arquitectura fundamental de la plataforma.

La experiencia también amplió mi comprensión del activo gobernado. Ya no se trataba únicamente de tablas, métricas o reportes. Era necesario observar eventos producidos por sistemas inteligentes, distinguir solicitudes, respuestas, estados y excepciones, y conservar suficiente contexto para reconstruir lo ocurrido durante una ejecución.

En la Fundación CTIC gestiono procesos de limpieza, integración y estandarización orientados a fortalecer la calidad, consistencia y confiabilidad de la información institucional. Este trabajo ocurre en un entorno donde los datos pueden representar personas, procesos asistenciales y decisiones sensibles, por lo que su utilización exige un nivel especialmente alto de responsabilidad, confidencialidad y trazabilidad.

Actualmente lidero además la estrategia institucional de inteligencia artificial, estructurada a partir de los principios y requisitos de ISO/IEC 42001. Esta responsabilidad amplía el gobierno desde los datos hacia los sistemas que los utilizan para producir análisis, recomendaciones, contenidos o acciones.

Las tres experiencias representan problemas diferentes. En banca profundicé en la confianza, la semántica y la utilización controlada de información crítica. En Vesting incorporé aislamiento, observabilidad y trazabilidad sobre sistemas inteligentes. En salud conecto calidad, confidencialidad, propósito autorizado y gestión institucional de la inteligencia artificial.

Haber trabajado en estos tres contextos me permite reconocer que el gobierno efectivo no comienza seleccionando un catálogo o redactando una política. Comienza comprendiendo qué necesita proteger la organización, qué decisiones dependen de la información, qué riesgos introduce su utilización y qué evidencia permitirá demostrar que los controles realmente funcionan.

## Qué significa gobernar un dato

<!-- seccion: que-es-gobernar -->

Gobernar un dato significa poder responder y demostrar al menos cinco preguntas: qué representa, de dónde proviene, quién responde por él, quién puede utilizarlo y qué ocurre cuando cambia.

La primera pregunta corresponde al significado. Una columna puede tener un nombre técnicamente válido y, aun así, ser interpretada de forma diferente por varias áreas. Por eso, las definiciones deben establecerse con los responsables del negocio y expresarse de manera que puedan ser comprendidas, implementadas y verificadas.

La segunda pregunta corresponde a la procedencia. Un indicador debe conservar una relación trazable con las fuentes, los eventos y las transformaciones que lo producen. El linaje no consiste únicamente en dibujar conexiones entre sistemas. Debe permitir comprender qué reglas modificaron la información y cómo esas reglas influyeron sobre el resultado.

La tercera pregunta corresponde a la responsabilidad. Todo activo relevante necesita una persona o función con autoridad para validar su significado, resolver discrepancias y determinar cuándo una modificación debe aceptarse. Sin responsabilidad identificable, el gobierno se convierte en documentación sin capacidad real de decisión.

La cuarta pregunta corresponde al acceso y al propósito. No basta con establecer quién puede consultar un dato. También es necesario comprender para qué puede utilizarlo, qué nivel de detalle necesita y qué restricciones deben conservarse cuando la información se integra con otra fuente o se pone a disposición de una aplicación.

La quinta pregunta corresponde al cambio. Es una de las más importantes y una de las que con mayor frecuencia se subestima. Cuando una definición, una fuente o una regla se modifica, deben identificarse los productos, procesos y decisiones que dependen de ella. Un indicador que cambia silenciosamente puede destruir más confianza que un dato faltante, porque conserva el mismo nombre mientras representa una realidad diferente.

El gobierno debe acompañar todo el ciclo de vida. Los datos nacen en procesos, se integran, se transforman, se utilizan y eventualmente pierden vigencia. Cada etapa necesita controles proporcionales a su propósito y a las consecuencias de una utilización incorrecta.

Mi especialidad en Power BI y modelos semánticos resulta especialmente relevante en este punto. El gobierno no termina cuando los datos llegan a una plataforma. Las medidas, relaciones y reglas que organizan su significado también son activos gobernados. Un modelo semántico permite implementar y reutilizar definiciones institucionales, pero no reemplaza el acuerdo del negocio que les da legitimidad.


## El gobierno de la inteligencia artificial es una continuación y una ampliación

<!-- seccion: la-continuacion -->

El gobierno de la inteligencia artificial no reemplaza el gobierno de datos ni constituye un tema completamente separado. Lo amplía. Una solución de IA depende de información, conocimiento, modelos, herramientas, proveedores, infraestructura y personas. Gobernarla exige comprender las relaciones entre todos estos componentes y las consecuencias del comportamiento que producen en conjunto.

Las preguntas iniciales permanecen: qué información utiliza la solución, de dónde proviene, quién responde por ella, quién puede acceder y qué ocurre cuando cambia. Sin embargo, aparecen nuevas preguntas: qué función está autorizada a cumplir, qué resultados puede producir, qué acciones puede ejecutar, bajo qué condiciones debe detenerse y cómo se reconocerá una modificación significativa en su comportamiento.

El activo gobernado deja de ser únicamente una tabla o un indicador. Puede ser un modelo, una aplicación generativa, un agente, una fuente de conocimiento, una herramienta utilizada por ese agente, un conjunto de instrucciones o una evaluación. Cada componente necesita identidad, propósito, responsable y condiciones de uso.

También cambia la naturaleza del resultado. Un dato puede ser incorrecto o estar desactualizado. Un sistema de IA puede, además, interpretar, inferir, recomendar o actuar. Por eso, su gobierno debe considerar no solo la calidad de las entradas, sino también el comportamiento, la incertidumbre, los límites y los posibles efectos de las salidas.

La autonomía debe diseñarse de forma proporcional al riesgo. Una solución puede limitarse a recuperar información, generar un borrador o recomendar una acción. Solo determinadas tareas deberían permitir una ejecución directa, especialmente cuando el resultado puede verificarse, revertirse y mantenerse dentro de límites claramente definidos.

Quien ha trabajado en gobierno de datos cuenta con una base importante, pero no con el camino completo. El inventario, la responsabilidad sobre los activos, el linaje, los controles y las revisiones continúan siendo necesarios. El gobierno de IA agrega evaluación de impactos, comportamiento del sistema, supervisión humana, dependencia de proveedores, observabilidad y administración del ciclo de vida.

Mi experiencia me permite trabajar en ambos niveles. Puedo analizar la arquitectura de los datos y los modelos semánticos que sostienen la solución, pero también comprender cómo el agente interpreta el contexto, utiliza herramientas, produce resultados y distribuye la responsabilidad entre la tecnología y las personas.


## Liderar una estrategia basada en ISO/IEC 42001

<!-- seccion: estrategia-iso-42001 -->

Actualmente lidero la estrategia institucional de inteligencia artificial siguiendo los principios y requisitos de ISO/IEC 42001. Mi responsabilidad consiste en contribuir a que la organización no aborde la IA como una colección de iniciativas desconectadas, sino como una capacidad que necesita dirección, políticas, responsabilidades, gestión de riesgos, evaluación y mejora continua.

ISO/IEC 42001 no indica qué modelo debe utilizarse ni prescribe una arquitectura tecnológica única. Proporciona una estructura de gestión para que la organización comprenda su contexto, establezca objetivos, identifique riesgos y oportunidades, asigne responsabilidades y evalúe el desempeño de su sistema de gestión de inteligencia artificial.

Esta perspectiva coincide con mi formación en Ingeniería Industrial. Una capacidad organizacional no se sostiene únicamente mediante tecnología. Necesita procesos, responsables, recursos, criterios, controles, mecanismos de evaluación y aprendizaje acumulativo. El valor de la norma está precisamente en convertir la intención de utilizar IA responsablemente en un sistema que pueda operar y demostrar su funcionamiento.

También diferencio con claridad el estándar de las obligaciones jurídicas aplicables. ISO/IEC 42001 se adopta como referente internacional para estructurar el sistema de gestión, organizar responsabilidades y fortalecer la administración de riesgos, oportunidades e impactos. No reemplaza la legislación ni convierte automáticamente en conforme cualquier solución desarrollada dentro de la organización.

La estrategia se encuentra en un proceso progresivo de estructuración y consolidación. Esto implica definir instrumentos institucionales, establecer responsabilidades, identificar las capacidades de IA existentes, evaluar casos de uso y desarrollar mecanismos para acompañar las iniciativas durante su ciclo de vida.

Una condición inicial consiste en saber qué sistemas existen. Por eso, el gobierno requiere un inventario que permita identificar el propósito de cada solución, su responsable, proveedor cuando corresponda, fuentes de información, usuarios, nivel de autonomía, estado de madurez y principales riesgos. No es posible gobernar consistentemente aquello que la organización no puede localizar ni caracterizar.

La estrategia también debe convertir el gobierno en decisiones aplicables. Un caso de uso necesita criterios para avanzar, controles proporcionales a su riesgo, resultados esperados y una forma de evaluar su comportamiento. La norma aporta la estructura; mi responsabilidad consiste en ayudar a convertirla en una práctica que pueda incorporarse a la operación institucional.

## El agente experto en ISO/IEC 42001

<!-- seccion: iso-42001 -->

Construí un agente especializado en ISO/IEC 42001 y lo publiqué en mi vitrina como evidencia de mi manera de trabajar con inteligencia artificial generativa y conocimiento normativo.

El agente no utiliza la memoria general del modelo como autoridad sobre la norma. Sus respuestas deben sustentarse en un corpus autorizado y cada afirmación normativa debe relacionarse con la ubicación correspondiente dentro de la fuente. Cuando el contenido disponible no permite sostener una conclusión, el sistema debe declarar el vacío.

Esta regla protege una distinción fundamental: el modelo puede interpretar y explicar, pero no puede inventar el fundamento normativo. La fluidez de una respuesta no le concede autoridad. La confiabilidad depende de la evidencia recuperada y de la relación verificable entre esa evidencia y la explicación generada.

El agente también conserva la fecha de verificación de las fuentes. Una cita puede corresponder correctamente con un documento y, aun así, perder validez si el contenido fue reemplazado, modificado o retirado. La vigencia debe tratarse como una propiedad del conocimiento y no como una suposición permanente.

Su función no es declarar por sí mismo que una organización cumple con la norma, sustituir una auditoría ni emitir certificaciones. Puede ayudar a localizar requisitos, organizar preguntas, identificar información faltante y apoyar la preparación de análisis, pero las conclusiones institucionales necesitan evaluación profesional, evidencia y responsabilidades humanas explícitas.

Este diseño demuestra por qué un agente experto no puede reducirse a incorporar un documento en un RAG. También necesita delimitar su función, preservar metadatos, controlar las citas, reconocer vacíos y comunicar claramente qué tipo de conclusión está autorizado a producir.

El Diseño Industrial aporta una dimensión importante a esta solución. El conocimiento normativo suele resultar denso y difícil de recorrer. El agente debe reducir la fricción de acceso sin ocultar la complejidad ni reemplazar la fuente. Su interfaz debe permitir comprender la respuesta y regresar al fundamento que la sostiene.

La regla central es sencilla: ningún dictamen debe salir únicamente de la memoria del modelo. Si el sistema no puede demostrar el origen de una afirmación, no debe presentarla con autoridad normativa.


## El gobierno aplicado a mi propio proceso

<!-- seccion: gobierno-de-mi-proceso -->

Aplico estos principios sobre mi propio pipeline de aplicaciones, agentes, investigaciones y tableros. El propósito es demostrar que el gobierno no es un conjunto de recomendaciones dirigidas a otros, sino una disciplina que utilizo para controlar mi propio trabajo.

Ninguna aplicación avanza sin dos decisiones documentadas. La primera confirma su prioridad frente a otras iniciativas. La segunda establece la visión del producto, su propósito, las capacidades esperadas y los límites dentro de los cuales debe construirse.

Ningún ciclo se considera cerrado sin un resumen que conserve las decisiones tomadas, las pruebas ejecutadas, los cambios frente a la visión inicial, los problemas encontrados y el trabajo pendiente. Esta memoria reduce la dependencia del conocimiento informal y permite que cada iteración comience desde el aprendizaje anterior.

Toda salida persistente producida por un modelo debe cumplir una estructura verificable. El sistema no puede tratar como activo válido cualquier contenido generado únicamente porque tenga una forma convincente. Los esquemas, validadores y controles deterministas protegen aquello que puede comprobarse mediante reglas explícitas.

Incorporar inteligencia artificial generativa también exige una decisión justificada. Antes de utilizar un modelo, debo establecer qué característica del problema requiere interpretación, generación, recuperación contextual o coordinación flexible, y por qué una solución determinista no resulta suficiente.

Los controles deben demostrar su capacidad para fallar. Una prueba que siempre aparece en verde, pero nunca ha sido observada detectando la desviación para la que fue diseñada, todavía no demuestra que proteja el sistema. Por eso, cada control necesita una relación verificable con un riesgo o condición concreta.

También mantengo estados diferenciados para las piezas. Una exploración, un prototipo, una solución publicada y una capacidad operada de manera sostenida no representan el mismo nivel de madurez. Esta distinción evita presentar intenciones como resultados y protege la credibilidad del portafolio.

Estas reglas fueron escritas antes de que las fallas las hicieran necesarias. Ese es uno de los principios que más valoro del gobierno: anticipar las condiciones bajo las cuales se tomarán decisiones, en lugar de improvisarlas cuando ya existe presión por justificar un resultado.

## El gobierno se demuestra mediante la efectividad de sus controles

<!-- seccion: efectividad-de-controles -->

No considero implementado un control únicamente porque exista una política, un procedimiento o una configuración técnica. El control debe demostrar que puede prevenir, detectar, contener o hacer visible la condición para la que fue diseñado.

Esta distinción es importante porque una organización puede acumular documentos, matrices y aprobaciones sin desarrollar una capacidad real para intervenir cuando aparece una desviación. El gobierno no se mide por la cantidad de controles declarados, sino por la relación verificable entre cada riesgo, el mecanismo utilizado para administrarlo y la evidencia que permite evaluar su efectividad.

Cada control debe responder preguntas concretas: qué condición busca gestionar, qué componente o persona lo ejecuta, qué evidencia produce, con qué frecuencia se revisa y qué ocurre cuando falla. Sin estas respuestas, el control puede convertirse en una expectativa general difícil de aplicar y todavía más difícil de auditar.

En datos, un control de calidad debe hacer visible una inconsistencia antes de que llegue a una decisión. Un control de acceso debe impedir o registrar una utilización no autorizada. Una regla de cambio debe permitir identificar qué productos dependen de una definición modificada. En todos los casos, la evidencia debe corresponder con el propósito del control.

En inteligencia artificial, la efectividad requiere observar además el comportamiento de la solución. Un control puede verificar si el sistema utilizó una fuente autorizada, respetó un límite de actuación, solicitó aprobación humana o declaró información insuficiente. También debe existir una respuesta definida cuando el comportamiento no corresponda con lo esperado.

Los controles necesitan evaluarse durante el ciclo de vida porque su efectividad puede cambiar. Una nueva fuente, una actualización del proveedor, una modificación del modelo o un uso no previsto pueden volver insuficiente una medida que anteriormente resultaba adecuada. Gobernar exige conservar la capacidad de revisar y fortalecer los controles a medida que evoluciona el sistema.

Esta forma de pensar conecta mi experiencia en sistemas de gestión, calidad de datos y arquitectura agéntica. Un control que nunca ha demostrado que puede reconocer una desviación todavía no ofrece evidencia suficiente de protección. Por eso, en mi propio proceso aplico una regla explícita: si un control nunca se ha visto en rojo frente a la condición que debe detectar, todavía no está completamente demostrado.

## El gobierno técnico y el gobierno institucional deben encontrarse

<!-- seccion: gobierno-tecnico-e-institucional -->

El gobierno de inteligencia artificial fracasa cuando las políticas y la arquitectura se desarrollan por separado. Una política puede establecer transparencia, supervisión o trazabilidad, pero esos principios necesitan mecanismos técnicos capaces de producir la evidencia correspondiente.

De la misma manera, una arquitectura puede incorporar registros, permisos y evaluaciones sin responder a un propósito institucional claramente definido. Los controles técnicos no determinan por sí solos qué riesgo debe aceptarse, qué uso resulta legítimo ni quién tiene autoridad para aprobar una iniciativa.

Mi perfil permite trabajar en esa intersección. Comprendo cómo se estructuran los datos, los modelos semánticos, las aplicaciones y los agentes, y también cómo deben conectarse con objetivos, responsabilidades, riesgos, políticas y criterios de decisión.

DP-600 aporta la profundidad necesaria para gobernar los activos analíticos que sostienen la solución: fuentes, transformaciones, almacenes, modelos semánticos, medidas y experiencias en Power BI. AI-103 fortalece la comprensión de las aplicaciones y agentes que utilizan esos activos. AI-300 amplía la disciplina necesaria para desplegar, evaluar, observar y mantener las soluciones durante su vida operativa.

Esta combinación me permite formular una pregunta institucional y recorrerla hasta sus implicaciones técnicas. Si una política exige que una recomendación sea trazable, puedo analizar qué eventos deben conservarse, qué fuente debe identificarse y qué componente necesita registrar la decisión. Si la arquitectura revela una limitación, puedo traducirla en riesgo, responsabilidad y condición de uso.

El gobierno efectivo aparece cuando la organización puede relacionar cada principio con un control, cada control con una evidencia y cada evidencia con una responsabilidad. Mi objetivo es construir precisamente esa continuidad.

## Gobernar soluciones de terceros

<!-- seccion: gobierno-de-terceros -->

Una estrategia de inteligencia artificial no puede limitarse a las soluciones desarrolladas internamente. Las plataformas, aplicaciones, modelos y agentes proporcionados por terceros también forman parte de la capacidad institucional y necesitan evaluación, responsabilidades y seguimiento.

Evaluar un proveedor no consiste únicamente en comparar funcionalidades, costos o tiempos de implementación. También es necesario comprender qué información utilizará la solución, dónde será procesada, qué dependencias introduce, cómo administra los cambios y qué evidencia proporciona sobre su comportamiento.

La organización debe conocer qué responsabilidades conserva el proveedor y cuáles permanecen internamente. Adquirir una tecnología no transfiere automáticamente la responsabilidad sobre su uso, sus efectos ni las decisiones que se tomen con sus resultados.

También deben establecerse condiciones para supervisar, restringir, sustituir o retirar la solución. Una dependencia se vuelve especialmente riesgosa cuando la organización no puede recuperar su información, comprender cambios relevantes o continuar un proceso crítico sin el proveedor.

Las actualizaciones necesitan atención particular. Un servicio externo puede modificar su modelo, sus políticas, sus límites o su comportamiento sin que la organización haya cambiado directamente su propia arquitectura. El gobierno debe determinar cómo se conocerán esos cambios y cuándo exigirán una nueva evaluación.

Esta perspectiva se conecta con mi trabajo en arquitectura empresarial de IA. El objetivo no es eliminar las dependencias externas, sino conocerlas, administrarlas y evitar que una capacidad institucional quede sustentada sobre supuestos que nadie ha documentado ni puede controlar.

## El gobierno necesita atravesar la organización

<!-- seccion: lo-transversal -->

El gobierno genera poco valor si permanece dentro de un único equipo. Los datos, los modelos y las soluciones inteligentes atraviesan procesos, áreas y responsabilidades, por lo que su gestión exige coordinación entre personas que no necesariamente dependen de una misma autoridad.

He trabajado en iniciativas transversales en las que la colaboración no podía obtenerse mediante una instrucción jerárquica. En el sistema de transporte coordiné mesas con responsables de diferentes actores. En Cafam articulé un equipo mixto de veinte personas entre la organización y el proveedor. En Banco Pichincha co-lideré una iniciativa de gobierno que requería integrar perspectivas técnicas y operativas.

Estas experiencias me enseñaron que una iniciativa transversal no avanza únicamente porque exista una norma, una arquitectura correcta o un patrocinador. Cada área necesita comprender qué decisión mejorará, qué riesgo reducirá, qué responsabilidad conservará y qué esfuerzo tendrá que asumir.

Por eso, no comienzo la conversación exponiendo todos los controles que deben cumplirse. Comienzo comprendiendo el problema de cada actor, las decisiones que necesita tomar y la evidencia que actualmente no puede obtener. El gobierno adquiere legitimidad cuando ayuda a resolver una necesidad real y no cuando se presenta exclusivamente como una obligación externa.

Esto no significa negociar principios esenciales ni debilitar controles para facilitar la adopción. Significa diseñar la implementación de manera que las personas comprendan el propósito, puedan cuestionar los mecanismos y reconozcan la relación entre el control y el riesgo que busca administrar.

La alta dirección cumple una función indispensable porque algunos conflictos no pueden resolverse únicamente mediante acuerdos técnicos. Prioridades, recursos, niveles de riesgo y responsabilidades necesitan orientación institucional. Mi función consiste en proporcionar la evidencia y las alternativas necesarias para que esas decisiones puedan tomarse con claridad.

El gobierno se vuelve sostenible cuando deja de depender de la capacidad individual para persuadir y queda incorporado en roles, procesos, criterios, sistemas y mecanismos de revisión. La influencia transversal inicia el cambio; el sistema de gestión permite conservarlo.

## Competencia demostrada mediante formación y experiencia

<!-- seccion: experiencia-y-formacion -->

Algunas posiciones de estrategia, arquitectura y gobierno de inteligencia artificial establecen una especialización o una maestría como requisito preferente. Mi formación académica está compuesta por Ingeniería Industrial y estudios de Diseño Industrial, complementados por cinco credenciales verificables en analítica y ciencia de datos, la certificación DP-600 y las rutas AI-103 y AI-300 actualmente en desarrollo.

No presento la experiencia como sustituto universal de la educación avanzada ni desconozco el valor de un posgrado. Una especialización o maestría puede aportar investigación guiada, profundidad conceptual y una estructura formal de aprendizaje. Sin embargo, cuando una organización admite equivalencia entre educación y experiencia, mi trayectoria permite evaluar directamente las competencias que ese requisito busca representar.

Durante diez años he desarrollado capacidades relacionadas con procesos, datos, plataformas analíticas, modelos predictivos, aplicaciones, agentes y gobierno. He co-liderado gobierno de datos en banca, diseñado la arquitectura de datos y observabilidad para una plataforma de agentes, estructurado un proceso utilizado como marco para construir veintisiete agentes y actualmente lidero una estrategia institucional de inteligencia artificial basada en ISO/IEC 42001.

Esta experiencia no se limita a la exposición incidental a esos dominios. He trabajado en las responsabilidades que necesito gobernar: construí pipelines y modelos semánticos antes de establecer criterios sobre activos analíticos; diseñé observabilidad antes de formular exigencias sobre seguimiento; y desarrollé agentes y harnesses antes de asumir responsabilidades estratégicas sobre su gobierno.

A la experiencia profesional se suma evidencia verificable. DP-600 valida formalmente mi profundidad en Microsoft Fabric, Power BI y modelos semánticos. Las cuatro credenciales independientes de IBM respaldan mi base en ciencia de datos, Python, SQL y R. Mi portafolio público permite examinar aplicaciones, agentes, investigaciones, tableros y controles implementados.

Esta combinación me permite evitar dos extremos: una gobernanza conceptualmente correcta, pero difícil de implementar, y una arquitectura técnicamente sofisticada que ignora los riesgos, impactos y responsabilidades institucionales.

Cuando un cargo permite valorar educación y experiencia de manera conjunta, presento una combinación sólida de formación universitaria, credenciales especializadas, práctica profesional directamente relacionada, liderazgo actual y evidencia pública. No solicito que la organización presuponga mis competencias. Proporciono elementos concretos para evaluarlas.

Si una posición establece un posgrado como requisito formal e insustituible, lo reconozco con transparencia. Cuando el posgrado funciona como indicador de pensamiento estructurado, profundidad técnica y capacidad para resolver problemas complejos, mi trayectoria permite examinar esas cualidades mediante resultados y responsabilidades demostrables.

## Lo que distingue mi enfoque de gobierno

<!-- seccion: enfoque-de-gobierno -->

Mi enfoque de gobierno integra tres niveles que con frecuencia se abordan por separado: el dato, la solución inteligente y la organización que responde por sus efectos.

En el nivel del dato, trabajo con significado, procedencia, calidad, acceso, transformación y cambio. En el nivel de la solución, incorporo propósito, comportamiento, fuentes, herramientas, autonomía, evaluación y observabilidad. En el nivel institucional, conecto esas capacidades con responsabilidades, riesgos, políticas, terceros, decisiones y mejora continua.

La Ingeniería Industrial proporciona la visión sistémica necesaria para comprender cómo estos niveles se influyen entre sí. Un control puede ser correcto de manera aislada y fracasar dentro del flujo completo. Una política puede estar bien redactada y producir fricción innecesaria si desconoce el proceso. Una solución puede optimizar una actividad y deteriorar el resultado global.

El Diseño Industrial mantiene visible a las personas afectadas por el sistema. El gobierno no debe limitarse a proteger a la organización. También debe considerar si las personas comprenden cuándo interactúan con una solución de IA, qué información utiliza, qué límites tiene y cómo pueden solicitar revisión o intervención.

Mi profundidad en Power BI y modelos semánticos me permite convertir definiciones institucionales en activos analíticos reutilizables. Mi experiencia con agentes me permite comprender cómo esas definiciones se transforman en contexto, herramientas y comportamiento. Mi responsabilidad actual me permite conectar ambos niveles con una estrategia de gestión.

No entiendo el gobierno como una actividad destinada a detener la innovación. Lo entiendo como la arquitectura institucional que permite innovar de manera sostenible. Su función es hacer explícitas las decisiones, conservar evidencia, distribuir responsabilidades y proporcionar mecanismos para intervenir cuando cambian los datos, la tecnología o el contexto.

No entiendo el gobierno como una actividad destinada a detener la innovación. Lo entiendo como la arquitectura institucional que permite innovar de forma sostenible. Su función es hacer explícitas las decisiones, conservar evidencia, distribuir responsabilidades y proporcionar mecanismos para intervenir cuando cambian los datos, la tecnología, los riesgos o el contexto.

Tampoco considero que una iniciativa esté gobernada únicamente porque cumple un conjunto de controles. El gobierno debe proteger el propósito para el que la solución fue autorizada y permitir evaluar si continúa generando el valor esperado. Una capacidad que ha dejado de ser útil, que opera fuera de su contexto o que introduce un riesgo desproporcionado necesita revisarse, restringirse o retirarse, incluso si técnicamente continúa funcionando.

La organización no necesita elegir entre velocidad y control como si fueran objetivos incompatibles. Necesita controles proporcionales, aplicables y diseñados dentro de los procesos. La innovación sin gobierno acumula riesgos invisibles. El gobierno sin comprensión técnica acumula documentos que nadie puede convertir en práctica.

Mi aporte consiste en construir el puente entre ambos extremos: comprender suficientemente la tecnología para diseñar controles aplicables y comprender suficientemente la organización para asegurar que esos controles protejan decisiones, personas y resultados relevantes. No busco gobernar la inteligencia artificial para limitar lo que puede hacerse, sino para que la organización pueda hacer más, con mayor claridad sobre aquello que debe proteger y sobre la evidencia que necesita conservar.

