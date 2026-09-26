---
slug: gobierno-de-datos-y-de-ia
codigo: AF-17
titulo: "Gobierno de datos y de IA"
resumen: "Gobierno montado tres veces —co-liderado en banca, diseñado desde cero para 12 clientes en una startup de agentes, y hoy en salud bajo UNE-ISO/IEC 42001:2025 con 23 instrumentos— más el agente experto en ISO 42001 y las reglas con las que gobierno mi propio pipeline."
cuando_usar: "Úsalo cuando pregunten por gobierno de datos o de inteligencia artificial, la norma ISO 42001, políticas y lineamientos de datos, datos personales y sensibles, trazabilidad de la información, quién decide quién ve qué datos, uso responsable de la IA, o cómo documenta lo que hace."
estado: aprobado
ancla: "#skills-bi-y-decision"
actualizado: 2026-09-21
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry en gobierno de datos?"
  - "¿Sabe Henry de gobierno de IA y de la norma ISO 42001?"
  - "¿Cómo maneja datos personales o sensibles?"
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

| Dónde                           | Cuándo                   | Alcance                                                   | El problema que había que gobernar                                                                           |
| ------------------------------- | ------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Banco Pichincha**             | marzo – julio 2023       | co-lideré la iniciativa de gobierno de datos del área     | confianza: definiciones consistentes, responsables por métrica, acceso por propósito                         |
| **Vesting**, startup de agentes | agosto 2023 – enero 2025 | diseñé el gobierno desde cero                             | 12 clientes en una plataforma: identidad, propiedad, aislamiento y trazabilidad desde el primer evento       |
| **Fundación CTIC**, salud       | desde marzo 2025         | gestiono la calidad de datos y lidero la estrategia de IA | datos que describen personas, propósito autorizado y un sistema de gestión de IA bajo UNE-ISO/IEC 42001:2025 |

Esta diversidad me ha permitido comprender que el gobierno no puede trasladarse de una organización a otra como una plantilla invariable. Sus principios pueden permanecer, pero sus prioridades, controles, responsables y mecanismos de adopción deben responder al propósito, los riesgos y la madurez de cada entorno. Las tres experiencias representan problemas diferentes: en banca profundicé en la confianza, la semántica y la utilización controlada de información crítica; en Vesting incorporé aislamiento, observabilidad y trazabilidad sobre sistemas inteligentes; en salud conecto calidad, confidencialidad, propósito autorizado y gestión institucional de la inteligencia artificial.

Haber trabajado en estos tres contextos me permite reconocer que el gobierno efectivo no comienza seleccionando un catálogo o redactando una política. Comienza comprendiendo qué necesita proteger la organización, qué decisiones dependen de la información, qué riesgos introduce su utilización y qué evidencia permitirá demostrar que los controles realmente funcionan.

## Banco Pichincha: gobierno co-liderado en banca, donde la semántica protege la interpretación

<!-- seccion: gobierno-en-banca -->

En Banco Pichincha, entre marzo y julio de 2023, co-lideré una iniciativa de gobierno orientada a fortalecer la seguridad, la calidad y la confiabilidad de la información. En un entorno financiero, el dato debe conservar definiciones consistentes, responsables identificables y condiciones claras de acceso y utilización. El gobierno también debe permitir demostrar que los controles existen y que pueden sostener decisiones importantes con evidencia verificable.

Esta experiencia me enseñó que una plataforma analítica no se gobierna únicamente mediante permisos. También necesita métricas compartidas, modelos semánticos consistentes, responsabilidades sobre las definiciones y mecanismos que permitan recorrer cada resultado hasta las fuentes y reglas que lo producen. La seguridad protege el acceso; la semántica y el linaje protegen la interpretación.

El gobierno y el producto eran la misma cosa. Con un equipo de 5 personas a cargo, los dashboards que adoptaron más de 50 usuarios del negocio —con +25 % en la toma de decisiones— solo fueron adoptables porque cada indicador tenía una definición, un responsable y una regla de cálculo única, centralizada en el modelo semántico y expresada como medida DAX que todos los productos reutilizaban. Optimicé esos modelos semánticos con DAX Studio y Tabular Editor, reduje un 35 % los tiempos de análisis en los procesos ETL, y los modelos predictivos de fuga, mora y riesgo que llegaron a producción con más de 90 % de precisión tenían la misma exigencia de linaje que cualquier cifra de un tablero: de qué datos venían, con qué reglas y desde cuándo.

El programa de formación a 12 profesionales fue también un instrumento de gobierno, aunque no se llamara así: un usuario que entiende de dónde sale una cifra no la redefine por su cuenta en un archivo aparte, y ese es el origen de la mayoría de las versiones paralelas de la verdad que un gobierno de datos tiene que perseguir después. Lo que Banco Pichincha me dejó es la convicción de que el gobierno de datos en banca es, ante todo, gobierno del significado.

## Vesting: gobernanza desde el diseño para una plataforma de agentes con 12 clientes

<!-- seccion: gobierno-en-vesting -->

En Vesting, entre agosto de 2023 y enero de 2025, diseñé desde cero una estrategia de datos para una plataforma que integraba información producida por agentes de IA asociados con diferentes clientes. Allí el desafío principal era conservar identidad, propiedad, aislamiento y trazabilidad desde el ingreso de cada evento. Estos atributos no podían añadirse después de construir los productos analíticos, porque formaban parte de la arquitectura fundamental de la plataforma.

La decisión de gobernanza que lo ordenó todo fue el aislamiento por cliente en **workspaces separados** de Microsoft Fabric: cada uno de los 12 clientes integrados tenía su espacio, su identidad y su propiedad sobre los datos, y ninguna consulta cruzaba esa frontera por accidente. Sobre esa base creció el ecosistema —120 tablas, 20 GB y 1.000 eventos por día en lakehouse y almacén—, con modelos semánticos en una combinación de Direct Lake, importación y DirectQuery según lo que cada producto necesitaba.

La experiencia también amplió mi comprensión del activo gobernado. Ya no se trataba únicamente de tablas, métricas o reportes. Era necesario observar eventos producidos por sistemas inteligentes, distinguir solicitudes, respuestas, estados y excepciones, y conservar suficiente contexto para reconstruir lo ocurrido durante una ejecución. El monitoreo en tiempo real de hasta 23 agentes a la vez, sobre un inventario de 27, era gobierno en su forma más concreta: saber qué hizo cada agente, para qué cliente, con qué costo y con qué resultado, sin depender de que alguien lo recordara.

La estandarización de datos que definí —qué debía registrar cada agente, con qué identidad y en qué formato— fue la que hizo posible el proceso core de once etapas con el que se diseñaron e implementaron los agentes: un agente que no dejaba rastro conforme al estándar no podía monitorearse, y uno que no podía monitorearse no salía a producción. Cerré esa etapa al dejar el ecosistema y el proceso documentados.

## Fundación CTIC: calidad de datos en salud y la estrategia institucional de IA

<!-- seccion: gobierno-en-salud -->

En la Fundación CTIC, desde marzo de 2025, gestiono procesos de limpieza, integración y estandarización orientados a fortalecer la calidad, consistencia y confiabilidad de la información institucional. Este trabajo ocurre en un entorno donde los datos pueden representar personas, procesos asistenciales y decisiones sensibles, por lo que su utilización exige un nivel especialmente alto de responsabilidad, confidencialidad y trazabilidad. En salud —el sector de las IPS, con su habilitación y sus indicadores de calidad— el marco no es solo interno: el habeas data y la Ley 1581 sobre datos personales fijan qué puede tratarse, con qué finalidad y con qué autorización.

Las reglas de calidad que he montado se diseñaron entendiendo el proceso que produce cada dato y la consecuencia de una interpretación equivocada: completitud de los campos que una decisión necesita, detección de duplicados, conciliación entre fuentes que describen el mismo hecho y umbrales que, al superarse, disparan una revisión antes de que la cifra llegue a un tablero. No publico las cifras de esas reglas; sí el principio: calidad de datos como práctica permanente, no como un evento de limpieza antes de un informe. Sobre esa base corren 42 productos analíticos en Power BI para 20 líderes de 15 procesos y unos 75 usuarios, con cerca de 60 % menos esfuerzo en la preparación de la información —estimado— y 10 planes de análisis en seguimiento.

Actualmente lidero además la estrategia institucional de inteligencia artificial, estructurada a partir de los principios y requisitos de ISO/IEC 42001 en su edición española, UNE-ISO/IEC 42001:2025. Esta responsabilidad amplía el gobierno desde los datos hacia los sistemas que los utilizan para producir análisis, recomendaciones, contenidos o acciones. Mi línea de trabajo es directa con la Dirección de Planeación y con las subdirecciones de tecnología, gestión de la información y calidad; todo lo que comunico sobre esta experiencia va agregado y sin nombrar procesos, indicadores ni personas. El detalle del rol —las dos audiencias, los tableros por procesos, la arquitectura institucional de IA— está en el documento de la Fundación CTIC.

## Qué significa gobernar un dato: significado, linaje, roles y trazabilidad de la información

<!-- seccion: que-es-gobernar -->

Gobernar un dato significa poder responder y demostrar al menos cinco preguntas: qué representa, de dónde proviene, quién responde por él, quién puede utilizarlo y qué ocurre cuando cambia.

La primera pregunta corresponde al significado. Una columna puede tener un nombre técnicamente válido y, aun así, ser interpretada de forma diferente por varias áreas. Por eso, las definiciones deben establecerse con los responsables del negocio y expresarse de manera que puedan ser comprendidas, implementadas y verificadas. En Banco Pichincha esa definición vivía en el modelo semántico como una medida DAX con dueño; en la Fundación CTIC, en la definición acordada con el líder del proceso antes de que el indicador entre a uno de los 42 productos analíticos.

La segunda pregunta corresponde a la procedencia: el **linaje**. Un indicador debe conservar una relación trazable con las fuentes, los eventos y las transformaciones que lo producen. El linaje no consiste únicamente en dibujar conexiones entre sistemas. Debe permitir comprender qué reglas modificaron la información y cómo esas reglas influyeron sobre el resultado. En Vesting, el linaje de una cifra podía recorrerse hasta el evento del agente que la había originado —solicitud, respuesta, estado, costo— y hasta el cliente al que pertenecía.

La tercera pregunta corresponde a la responsabilidad: los **roles**. Todo activo relevante necesita una persona o función con autoridad para validar su significado, resolver discrepancias y determinar cuándo una modificación debe aceptarse. Sin responsabilidad identificable, el gobierno se convierte en documentación sin capacidad real de decisión. Los roles clásicos —el dueño del dato en el negocio, el custodio técnico, el administrador de la definición— valen lo que vale su capacidad de decidir: en Cafam, en 2021, cada hallazgo del BI de control tenía un responsable con cargo, y por eso se cerraba.

## Quién decide quién puede ver qué datos: políticas de acceso por propósito y gestión del cambio

<!-- seccion: acceso-y-cambio -->

La cuarta pregunta corresponde al acceso y al propósito: las **políticas**. No basta con establecer quién puede consultar un dato. También es necesario comprender para qué puede utilizarlo, qué nivel de detalle necesita y qué restricciones deben conservarse cuando la información se integra con otra fuente o se pone a disposición de una aplicación. Una política de acceso por propósito dice más que una lista de permisos: dice que el mismo dato puede consultarse agregado para una decisión de gestión y no puede consultarse identificado para otra cosa. En salud esa diferencia es la ley; en Vesting fue el mecanismo —workspaces separados por cliente— que hizo posible integrar a 12 clientes en una sola plataforma.

La quinta pregunta corresponde al cambio. Es una de las más importantes y una de las que con mayor frecuencia se subestima. Cuando una definición, una fuente o una regla se modifica, deben identificarse los productos, procesos y decisiones que dependen de ella. Un indicador que cambia silenciosamente puede destruir más confianza que un dato faltante, porque conserva el mismo nombre mientras representa una realidad diferente. Es la razón por la que en Banco Pichincha las definiciones vivían en un solo modelo semántico y no en cada reporte: un cambio en la medida cambiaba los 50+ usuarios a la vez, y se sabía.

El gobierno debe acompañar todo el ciclo de vida. Los datos nacen en procesos, se integran, se transforman, se utilizan y eventualmente pierden vigencia. Cada etapa necesita controles proporcionales a su propósito y a las consecuencias de una utilización incorrecta.

Mi especialidad en Power BI y modelos semánticos resulta especialmente relevante en este punto. El gobierno no termina cuando los datos llegan a una plataforma. Las medidas, relaciones y reglas que organizan su significado también son activos gobernados. Un modelo semántico permite implementar y reutilizar definiciones institucionales, pero no reemplaza el acuerdo del negocio que les da legitimidad. Gobernar no es documentar definiciones que nadie consulta: es que la información correcta llegue a las personas adecuadas bajo condiciones claras, y que se pueda demostrar.

## Datos personales y sensibles: habeas data, Ley 1581 y anonimización en salud

<!-- seccion: datos-personales -->

Con datos personales, las cinco preguntas tienen ley detrás. En Colombia, el derecho de **habeas data** y la **Ley 1581** de protección de datos personales fijan qué puede tratarse, con qué finalidad, con qué autorización del titular y con qué deberes para quien los trata. En salud, además, el dato puede ser sensible por naturaleza —describe la condición de una persona—, y eso eleva el estándar: el propósito autorizado no es un formalismo sino el límite de lo que se puede hacer con la información.

Mi regla de trabajo con datos de personas, la que aplico en la Fundación CTIC desde 2025, tiene tres partes. Primero, **anonimización** cuando el análisis no necesita identificar a nadie: la mayoría de las decisiones de gestión se toman sobre agregados, y un tablero que muestra tendencias por proceso no tiene por qué contener a una persona. Segundo, acceso por propósito y no por cargo: que alguien pueda ver un dato para una función no significa que pueda verlo para otra, y las políticas se escriben sobre la finalidad. Tercero, trazabilidad de quién consultó qué y para qué, porque en salud la evidencia de que los controles funcionan no es opcional.

La misma regla la aplico a lo que digo en público. Todo lo que comunico sobre esa experiencia va agregado —42 productos, 20 líderes, 15 procesos— y no expongo datos de pacientes, información clínica, detalles sensibles de los procesos ni conocimiento interno cuya divulgación pueda afectar a las personas o a la institución. Puedo explicar capacidades, principios de arquitectura y prácticas de gobierno; no revelo la información sobre la que operan.

Y la llevé a mi vitrina: una de las 6 aplicaciones publicadas es un anonimizador, porque la primera necesidad de quien quiere analizar datos de personas con inteligencia artificial es dejar de tener a las personas en los datos. La regla no es de un empleo: es mía. Y desde septiembre de 2026 dejó de aplicarse solo a lo que hago para otros: esta misma hoja de vida empezó a recoger datos personales, y lo que sigue cuenta cuáles y cómo se gobiernan.

## Qué datos personales recoge este sitio: nombre y correo para chatear

<!-- seccion: datos-personales-de-este-sitio -->

Esta hoja de vida dejó de ser un sitio que no pide nada, y conviene decirlo antes de que alguien lo descubra solo. Durante todo su desarrollo, lo único que llegó a una base de datos fue el voto de un roadmap —hoy, el de cada aplicación hermana—, sin nombre, sin correo y sin ningún rastro que permitiera saber quién había votado: la regla escrita era cero información personal. Desde el 21 de septiembre de 2026 hay una excepción, y es deliberada: para conversar con el chat hay que dejar **nombre y correo**.

La finalidad es concreta y viaja escrita en el aviso que el visitante marca antes de enviar nada: que yo sepa quién me escribe y qué se le respondió, y que la conversación no se consuma —ni el presupuesto de tokens que la paga— en tráfico sin interés real en mi trayectoria. Nada de eso queda implícito. La casilla de consentimiento nombra la **Ley 1581 de 2012**, enumera los tres datos que se guardan —nombre, correo y preguntas—, explica para qué sirven y dice cómo pedir el borrado: escribiéndome desde la sección de contacto. Sin esa casilla marcada, el servidor rechaza la solicitud; no es decoración del formulario, es una validación que devuelve error.

Es exactamente lo que le exijo a una institución cuando trata datos de personas: **autorización del titular, finalidad declarada y un canal para revocarla**. La diferencia es que aquí el responsable del tratamiento soy yo, y la evidencia de que el control existe no es una política archivada, sino el código y la migración de base de datos que cualquiera puede leer en el repositorio público de esta hoja de vida.

## El código de verificación del correo: seis dígitos que la base de datos nunca guarda

<!-- seccion: codigo-de-verificacion -->

El correo no se cree por escrito: se comprueba. El servidor genera un código de **seis dígitos**, lo envía a esa dirección y conserva únicamente su **hash** —SHA-256 calculado con un secreto que solo vive en el servidor y con el propio correo—, jamás el código en claro. Eso significa que ni yo puedo leer el código de nadie: lo que la tabla contiene es una huella de sesenta y cuatro caracteres que sirve para comparar y para nada más. El código vale **diez minutos** y admite **cinco intentos**; el sexto lo agota aunque sea el correcto, y la fila desaparece al verificar, al vencer o al agotarse.

Verificado el correo, el servidor emite una **cookie firmada** con HMAC-SHA256, inaccesible desde el JavaScript de la página, que dura **treinta días**. No hay contraseña, no hay tabla de usuarios y no hay proveedor de identidad de por medio: el correo es la identidad y el código es la prueba de que le pertenece a quien lo escribió. Sin esa cookie, la ruta del chat responde con un error de autorización y el panel devuelve al visitante a la puerta sin perderle la pregunta que ya había escrito.

Todo eso es **minimización** aplicada con criterio de ingeniería: conservar lo mínimo que hace funcionar el control y nada de lo que solo serviría para saber más. Por la misma razón no se registra la dirección IP ni el navegador de quien pregunta, aunque habrían sido gratis de capturar. Un dato que no se recoge es el único que después no hay que proteger, ni auditar, ni borrar.

## Qué guarda el registro de conversaciones del chat, quién lo lee y la privacidad del visitante

<!-- seccion: registro-y-privacidad-del-visitante -->

Cada pregunta respondida deja una fila: nombre, correo, idioma, la pregunta tal como se escribió, la respuesta completa, las fuentes que se citaron, el modo en que se resolvió —con el modelo, con la búsqueda local o rechazada por salirse del tema—, el proveedor, el modelo, los tokens consumidos y los milisegundos que tardó. Es la telemetría que construí en Vesting traída a mi propia casa, con una diferencia que lo cambia todo: aquí el evento tiene nombre, y por eso necesita aviso.

Para qué lo uso, sin rodeos: para saber qué se me pregunta de verdad, que casi nunca es lo que uno supone; para encontrar la pregunta que el corpus no supo contestar y escribir después el documento que faltaba; para vigilar el costo de cada respuesta contra el presupuesto declarado; y para saber quién se interesó por mi trabajo y poder responderle. No hay perfilado, no hay publicidad y no hay terceros de analítica: el registro no sale de esa base de datos.

El control técnico es el mismo patrón con el que ya protegía la votación, endurecido porque ahora sí hay datos de personas. Las dos tablas tienen **RLS encendida y ninguna política**, que en la práctica significa que el rol anónimo con el que habla el navegador no puede leer ni una fila. Lo único que ese rol puede hacer son tres funciones de escritura declaradas **SECURITY DEFINER**, con permisos concedidos uno a uno: guardar un código, verificarlo y consumirlo, y registrar una conversación. **Leer es exclusivamente mío**, con la clave de servicio, desde el panel de administración de la base de datos. La retención la decido yo, está declarada como decisión y no como automatismo, y el aviso dice cómo pedir el borrado: no prometo una purga programada que no existe.

## El gobierno de la inteligencia artificial es una continuación y una ampliación

<!-- seccion: la-continuacion -->

El gobierno de la inteligencia artificial no reemplaza el gobierno de datos ni constituye un tema completamente separado. Lo amplía. Una solución de IA depende de información, conocimiento, modelos, herramientas, proveedores, infraestructura y personas. Gobernarla exige comprender las relaciones entre todos estos componentes y las consecuencias del comportamiento que producen en conjunto.

Las preguntas iniciales permanecen: qué información utiliza la solución, de dónde proviene, quién responde por ella, quién puede acceder y qué ocurre cuando cambia. Sin embargo, aparecen nuevas preguntas: qué función está autorizada a cumplir, qué resultados puede producir, qué acciones puede ejecutar, bajo qué condiciones debe detenerse y cómo se reconocerá una modificación significativa en su comportamiento.

El activo gobernado deja de ser únicamente una tabla o un indicador. Puede ser un modelo, una aplicación generativa, un agente, una fuente de conocimiento, una herramienta utilizada por ese agente, un conjunto de instrucciones o una evaluación. Cada componente necesita identidad, propósito, responsable y condiciones de uso. En Vesting lo aprendí con 27 agentes en el inventario: el activo a gobernar era el evento de cada ejecución —solicitud, respuesta, estado, costo—, y sin identidad por agente y por cliente no había nada que gobernar.

También cambia la naturaleza del resultado. Un dato puede ser incorrecto o estar desactualizado. Un sistema de IA puede, además, interpretar, inferir, recomendar o actuar. Por eso, su gobierno debe considerar no solo la calidad de las entradas, sino también el comportamiento, la incertidumbre, los límites y los posibles efectos de las salidas. Un modelo predictivo de mora en Banco Pichincha se gobernaba por su precisión y su linaje; un agente que actúa se gobierna además por lo que tiene permitido hacer.

## Autonomía proporcional al riesgo: trabajar en los dos niveles

<!-- seccion: autonomia-y-dos-niveles -->

La autonomía debe diseñarse de forma proporcional al riesgo. Una solución puede limitarse a recuperar información, generar un borrador o recomendar una acción. Solo determinadas tareas deberían permitir una ejecución directa, especialmente cuando el resultado puede verificarse, revertirse y mantenerse dentro de límites claramente definidos. En los 13 agentes de mi vitrina esa decisión está escrita en cada ficha: qué hace, qué límites tiene y qué «nunca» hace; el Constructor de Tableros Power BI, por ejemplo, tiene 5 gates de aprobación humana y no cierra una corrida sin que una persona apruebe el resultado.

Quien ha trabajado en gobierno de datos cuenta con una base importante, pero no con el camino completo. El inventario, la responsabilidad sobre los activos, el linaje, los controles y las revisiones continúan siendo necesarios. El gobierno de IA agrega evaluación de impactos, comportamiento del sistema, supervisión humana, dependencia de proveedores, observabilidad y administración del ciclo de vida.

Mi experiencia me permite trabajar en ambos niveles. Puedo analizar la arquitectura de los datos y los modelos semánticos que sostienen la solución —es lo que valida el DP-600, obtenido en diciembre de 2024—, pero también comprender cómo el agente interpreta el contexto, utiliza herramientas, produce resultados y distribuye la responsabilidad entre la tecnología y las personas, que es lo que construí en Vesting y lo que sigo construyendo en mi vitrina. Los dos niveles se necesitan: un gobierno de IA sin gobierno de datos vigila el comportamiento de un sistema alimentado con información que nadie responde; un gobierno de datos sin gobierno de IA protege la entrada y deja libre la salida.

## Uso responsable de la inteligencia artificial: liderar una estrategia bajo UNE-ISO/IEC 42001:2025

<!-- seccion: estrategia-iso-42001 -->

Actualmente lidero la estrategia institucional de inteligencia artificial de la Fundación CTIC siguiendo los principios y requisitos de **UNE-ISO/IEC 42001:2025**, la adopción española de la norma internacional ISO/IEC 42001 y la edición sobre la que nos basamos. Mi responsabilidad consiste en contribuir a que la organización no aborde la IA como una colección de iniciativas desconectadas, sino como una capacidad que necesita dirección, políticas, responsabilidades, gestión de riesgos, evaluación y mejora continua.

ISO/IEC 42001 no indica qué modelo debe utilizarse ni prescribe una arquitectura tecnológica única. Proporciona una estructura de gestión para que la organización comprenda su contexto, establezca objetivos, identifique riesgos y oportunidades, asigne responsabilidades y evalúe el desempeño de su sistema de gestión de inteligencia artificial. Es la misma estructura de alto nivel de los sistemas de gestión que conocí en 2016 con ISO 9001:2015 en Inglopres: contexto, liderazgo, planificación, soporte, operación, evaluación y mejora. Cambia el objeto —la calidad allí, los sistemas de IA aquí—, no la lógica.

Esta perspectiva coincide con mi formación en Ingeniería Industrial. Una capacidad organizacional no se sostiene únicamente mediante tecnología. Necesita procesos, responsables, recursos, criterios, controles, mecanismos de evaluación y aprendizaje acumulativo. El valor de la norma está precisamente en convertir la intención de utilizar IA responsablemente en un sistema que pueda operar y demostrar su funcionamiento.

También diferencio con claridad el estándar de las obligaciones jurídicas aplicables. La norma se adopta como referente internacional para estructurar el sistema de gestión, organizar responsabilidades y fortalecer la administración de riesgos, oportunidades e impactos. No reemplaza la legislación colombiana —habeas data, Ley 1581, el marco de habilitación en salud— ni convierte automáticamente en conforme cualquier solución desarrollada dentro de la organización. Y no afirmo que la institución esté certificada: afirmo que el sistema se construye con rigor y que cada avance se puede demostrar.

## Inventario, evaluación de impacto y 23 instrumentos: la estrategia en marcha

<!-- seccion: inventario-y-los-23-instrumentos -->

La estrategia se encuentra en un proceso progresivo de estructuración y consolidación. Esto implica definir instrumentos institucionales, establecer responsabilidades, identificar las capacidades de IA existentes, evaluar casos de uso y desarrollar mecanismos para acompañar las iniciativas durante su ciclo de vida.

Una condición inicial consiste en saber qué sistemas existen. Por eso, el gobierno requiere un **inventario de sistemas de IA** que permita identificar el propósito de cada solución, su responsable, proveedor cuando corresponda, fuentes de información, usuarios, nivel de autonomía, estado de madurez y principales riesgos. No es posible gobernar consistentemente aquello que la organización no puede localizar ni caracterizar. Después viene la evaluación de impacto de cada sistema —la AIIA, en los términos de la norma— y los criterios para que un caso de uso avance, con controles proporcionales a su riesgo.

El sistema de gestión comprende hoy **23 instrumentos** —políticas, procedimientos, matrices, criterios de evaluación y mecanismos de seguimiento—, de los cuales **8 están terminados y 15 en construcción**. Sobre él corre el portafolio: **12 oportunidades** de inteligencia artificial identificadas, **7 casos de uso evaluados** formalmente, **3 priorizados** y **2 documentados**. La proporción no es falta de ideas: es el filtro funcionando, porque cada oportunidad tuvo que declarar primero qué problema resolvía, para quién y con qué riesgo antes de recibir una arquitectura.

La estrategia también debe convertir el gobierno en decisiones aplicables. Un caso de uso necesita criterios para avanzar, controles proporcionales a su riesgo, resultados esperados y una forma de evaluar su comportamiento. La norma aporta la estructura; mi responsabilidad consiste en ayudar a convertirla en una práctica que pueda incorporarse a la operación institucional. Dos precisiones sobre mi alcance en la Fundación CTIC: los planes de mejora institucionales los **diseño** a partir del análisis de resultados —implementarlos es de cada proceso—, y donde sí he implementado muchísimas mejoras es en mi propio proceso de analítica, que es el que gobierno de principio a fin.

## El agente experto en ISO 42001: qué hace y de dónde saca cada afirmación

<!-- seccion: iso-42001 -->

Construí un agente especializado en ISO/IEC 42001, el **Experto ISO 42001**, y lo publiqué en mi vitrina como uno de los 13 agentes, como evidencia de mi manera de trabajar con inteligencia artificial generativa y conocimiento normativo.

El agente no utiliza la memoria general del modelo como autoridad sobre la norma. Sus respuestas deben sustentarse en un corpus autorizado y cada afirmación normativa debe relacionarse con la ubicación correspondiente dentro de la fuente: **cita el apartado y la página**. Cuando el contenido disponible no permite sostener una conclusión, el sistema debe **declarar el vacío**. Esta regla protege una distinción fundamental: el modelo puede interpretar y explicar, pero no puede inventar el fundamento normativo. La fluidez de una respuesta no le concede autoridad. La confiabilidad depende de la evidencia recuperada y de la relación verificable entre esa evidencia y la explicación generada.

Lo que tiene dentro es medible. El corpus sintetiza los **38 controles del Anexo A** de la norma, cada uno con su guía y el artefacto que lo implementa, y la declaración de aplicabilidad se entrega siempre con las 38 filas pobladas, nunca parcial sin decirlo. Conoce los **24 documentos portadores** que un auditor pide en la fase documental de una certificación. Trabaja con **9 comandos** conversacionales —instanciar, intake, gap, plan, gestión, simulacro, vigilancia, modelos y dictamen— y con un checklist de **14 gates**, diez fundacionales y cuatro nacidos de defectos reales encontrados al verificarlo. Y un dato que explica por qué existe: la plataforma comercial líder de gobernanza de IA declara cubrir cerca del 45 % del camino a la certificación; el resto es juicio humano, y ese es el hueco que el agente ayuda a llenar sin reemplazar a la persona.

El agente también conserva la fecha de verificación de las fuentes. Una cita puede corresponder correctamente con un documento y, aun así, perder validez si el contenido fue reemplazado, modificado o retirado. La vigencia debe tratarse como una propiedad del conocimiento y no como una suposición permanente; por eso cada dictamen estampa la fecha en que se verificó que la fuente seguía vigente, y una vigilancia normativa rastrea cambios de norma, ley y modelos.

## El agente experto en ISO 42001: qué no hace, y cómo lo uso con los 23 instrumentos

<!-- seccion: iso-42001-limites -->

Su función no es declarar por sí mismo que una organización cumple con la norma, sustituir una auditoría ni emitir certificaciones. Puede ayudar a localizar requisitos, organizar preguntas, identificar información faltante y apoyar la preparación de análisis, pero las conclusiones institucionales necesitan evaluación profesional, evidencia y responsabilidades humanas explícitas. En su ficha técnica esos límites están escritos como lo que el agente «nunca» hace, y el diagrama BPMN de su proceso muestra dónde decide el consultor y dónde decide la organización cliente: el agente estampa, diagnostica y redacta borradores; las personas aprueban.

Este diseño demuestra por qué un agente experto no puede reducirse a incorporar un documento en un RAG. También necesita delimitar su función, preservar metadatos, controlar las citas, reconocer vacíos y comunicar claramente qué tipo de conclusión está autorizado a producir. Y necesita disciplina en la fuente: el corpus contiene paráfrasis con apartado y página, nunca el tenor literal de la norma, y los PDF de la norma quedan fuera del control de versiones por diseño, con una comprobación que lo verifica.

El Diseño Industrial aporta una dimensión importante a esta solución. El conocimiento normativo suele resultar denso y difícil de recorrer. El agente debe reducir la fricción de acceso sin ocultar la complejidad ni reemplazar la fuente. Su interfaz debe permitir comprender la respuesta y regresar al fundamento que la sostiene.

Es también la herramienta con la que reviso, uno a uno, los 23 instrumentos del sistema de gestión de la Fundación CTIC contra los requisitos de la norma: qué requisito cubre cada instrumento, qué le falta y qué evidencia tendría que producir. El agente no decide si un instrumento está terminado; me dice qué apartado de la norma le exige qué, con la página, y la decisión sigue siendo mía y de las subdirecciones. La regla central es sencilla: ningún dictamen debe salir únicamente de la memoria del modelo. Si el sistema no puede demostrar el origen de una afirmación, no debe presentarla con autoridad normativa.

## Documentación: cómo documento lo que hago, con el gobierno aplicado a mi propio proceso

<!-- seccion: gobierno-de-mi-proceso -->

Aplico estos principios sobre mi propio pipeline de aplicaciones, agentes, investigaciones y tableros: las 32 piezas de la vitrina. El propósito es demostrar que el gobierno no es un conjunto de recomendaciones dirigidas a otros, sino una disciplina que utilizo para controlar mi propio trabajo.

Ninguna aplicación avanza sin dos decisiones documentadas. La primera confirma su prioridad frente a otras iniciativas. La segunda establece la visión del producto, su propósito, las capacidades esperadas y los límites dentro de los cuales debe construirse. Las 6 aplicaciones publicadas tienen las dos, escritas antes del primer sprint.

Ningún ciclo se considera cerrado sin un resumen que conserve las decisiones tomadas, las pruebas ejecutadas, los cambios frente a la visión inicial, los problemas encontrados y el trabajo pendiente. Esta memoria reduce la dependencia del conocimiento informal y permite que cada iteración comience desde el aprendizaje anterior. Las decisiones de arquitectura no anticipadas quedan en registros de decisión numerados, con su contexto y su alternativa descartada, para que dentro de un año se sepa por qué se eligió lo que se eligió.

Toda salida persistente producida por un modelo debe cumplir una estructura verificable: un esquema que se valida antes de guardar. El sistema no puede tratar como activo válido cualquier contenido generado únicamente porque tenga una forma convincente. Los esquemas, validadores y controles deterministas protegen aquello que puede comprobarse mediante reglas explícitas. El chat de esta hoja de vida obliga a precisar la regla: desde septiembre de 2026 sí archiva la respuesta del modelo tal cual, como texto, en el registro de conversaciones, porque el propósito de ese registro es saber qué se respondió. Lo que sigue prohibido es lo que de verdad importaba: ninguna salida del modelo se interpreta, se ejecuta, ni se convierte en un activo del que dependa otra decisión del sistema. Un texto que se guarda para leerlo no es lo mismo que un texto al que se le obedece.

Incorporar inteligencia artificial generativa también exige una decisión justificada: **código primero**. Antes de utilizar un modelo, debo establecer qué característica del problema requiere interpretación, generación, recuperación contextual o coordinación flexible, y por qué una solución determinista no resulta suficiente. La IA es acento con respaldo determinista, jamás la columna vertebral.

## Estados, procedencia y la regla que se escribió antes de la falla

<!-- seccion: estados-y-procedencia -->

Los controles deben demostrar su capacidad para fallar. Una prueba que siempre aparece en verde, pero nunca ha sido observada detectando la desviación para la que fue diseñada, todavía no demuestra que proteja el sistema. Por eso, cada control necesita una relación verificable con un riesgo o condición concreta, y en mi pipeline la regla es literal: un control nuevo nace con su demostración en rojo, registrada en la bitácora del sprint, en el mismo cambio que lo introduce. El origen de esa regla y su precedente viven en el documento del pipeline.

También mantengo estados diferenciados para las piezas. Una exploración, un prototipo, una solución publicada y una capacidad operada de manera sostenida no representan el mismo nivel de madurez. Esta distinción evita presentar intenciones como resultados y protege la credibilidad del portafolio: la exploración de Google Cloud figura como exploración, sin horizonte y sin uso real declarado, y las 6 aplicaciones figuran como operadas porque alcanzaron su producto mínimo y siguen evolucionando.

Y cada cifra declara su procedencia. Las fichas técnicas de las 32 piezas etiquetan cada número como **medido**, **calculado**, **declarado** o **estimado**, y el mismo criterio rige este corpus: el «cerca de 60 %» de menor esfuerzo en la Fundación CTIC lleva su «cerca de» porque es una estimación, y los 42 productos o los 23 instrumentos no lo llevan porque están contados.

Estas reglas fueron escritas antes de que las fallas las hicieran necesarias. Ese es uno de los principios que más valoro del gobierno: anticipar las condiciones bajo las cuales se tomarán decisiones, en lugar de improvisarlas cuando ya existe presión por justificar un resultado.

## El gobierno se demuestra mediante la efectividad de sus controles

<!-- seccion: efectividad-de-controles -->

No considero implementado un control únicamente porque exista una política, un procedimiento o una configuración técnica. El control debe demostrar que puede prevenir, detectar, contener o hacer visible la condición para la que fue diseñado.

Esta distinción es importante porque una organización puede acumular documentos, matrices y aprobaciones sin desarrollar una capacidad real para intervenir cuando aparece una desviación. El gobierno no se mide por la cantidad de controles declarados, sino por la relación verificable entre cada riesgo, el mecanismo utilizado para administrarlo y la evidencia que permite evaluar su efectividad. Con 23 instrumentos en el sistema de gestión de la Fundación CTIC, la pregunta que me hago de cada uno no es si existe, sino qué desviación detectaría y qué evidencia dejaría al detectarla.

Cada control debe responder preguntas concretas: qué condición busca gestionar, qué componente o persona lo ejecuta, qué evidencia produce, con qué frecuencia se revisa y qué ocurre cuando falla. Sin estas respuestas, el control puede convertirse en una expectativa general difícil de aplicar y todavía más difícil de auditar.

En datos, un control de calidad debe hacer visible una inconsistencia antes de que llegue a una decisión: los umbrales de las reglas de calidad en salud disparan una revisión, no un informe. Un control de acceso debe impedir o registrar una utilización no autorizada. Una regla de cambio debe permitir identificar qué productos dependen de una definición modificada. En todos los casos, la evidencia debe corresponder con el propósito del control. En Cafam, en 2021, el control fue una validación permanente de inventario sobre los medicamentos del 80-20 entre el WMS y el sistema de origen: al inicio ninguno coincidía, y la evidencia de que el control funcionaba era la lista de diferencias que se iba cerrando, no un acta que dijera que se validó.

## Los controles en inteligencia artificial y a lo largo del ciclo de vida

<!-- seccion: controles-en-ia -->

En inteligencia artificial, la efectividad requiere observar además el comportamiento de la solución. Un control puede verificar si el sistema utilizó una fuente autorizada, respetó un límite de actuación, solicitó aprobación humana o declaró información insuficiente. También debe existir una respuesta definida cuando el comportamiento no corresponda con lo esperado. En Vesting, ese control era el monitoreo en tiempo real: hasta 23 agentes vigilados a la vez, con el evento de cada ejecución, y una excepción que no aparecía en el monitoreo era, por definición, un control que no estaba funcionando.

Los controles necesitan evaluarse durante el ciclo de vida porque su efectividad puede cambiar. Una nueva fuente, una actualización del proveedor, una modificación del modelo o un uso no previsto pueden volver insuficiente una medida que anteriormente resultaba adecuada. Gobernar exige conservar la capacidad de revisar y fortalecer los controles a medida que evoluciona el sistema. Es la razón por la que el Experto ISO 42001 estampa la fecha de verificación de cada fuente y por la que su vigilancia normativa rastrea cambios de norma, ley y modelos: un control que era suficiente puede dejar de serlo sin que nadie cambie una línea.

Esta forma de pensar conecta mi experiencia en sistemas de gestión, calidad de datos y arquitectura agéntica. Un control que nunca ha demostrado que puede reconocer una desviación todavía no ofrece evidencia suficiente de protección. Por eso, en mi propio proceso aplico una regla explícita: si un control nunca se ha visto en rojo frente a la condición que debe detectar, todavía no está completamente demostrado. Y su hermana: un control que nunca ejecutó tampoco es un control; un check que se saltó porque otro falló antes no es verde, aunque el informe lo muestre sin alarma.

## El gobierno técnico y el gobierno institucional deben encontrarse

<!-- seccion: gobierno-tecnico-e-institucional -->

El gobierno de inteligencia artificial fracasa cuando las políticas y la arquitectura se desarrollan por separado. Una política puede establecer transparencia, supervisión o trazabilidad, pero esos principios necesitan mecanismos técnicos capaces de producir la evidencia correspondiente.

De la misma manera, una arquitectura puede incorporar registros, permisos y evaluaciones sin responder a un propósito institucional claramente definido. Los controles técnicos no determinan por sí solos qué riesgo debe aceptarse, qué uso resulta legítimo ni quién tiene autoridad para aprobar una iniciativa.

Mi perfil permite trabajar en esa intersección. Comprendo cómo se estructuran los datos, los modelos semánticos, las aplicaciones y los agentes, y también cómo deben conectarse con objetivos, responsabilidades, riesgos, políticas y criterios de decisión. En la Fundación CTIC la intersección tiene forma concreta: la línea con la Dirección de Planeación y las subdirecciones de tecnología, gestión de la información y calidad es donde una política se convierte en un instrumento, y un instrumento en algo que un tablero o un agente puede demostrar.

DP-600, obtenido en diciembre de 2024, aporta la profundidad necesaria para gobernar los activos analíticos que sostienen la solución: fuentes, transformaciones, almacenes, modelos semánticos, medidas y experiencias en Power BI. AI-103 fortalece la comprensión de las aplicaciones y agentes que utilizan esos activos. AI-300 amplía la disciplina necesaria para desplegar, evaluar, observar y mantener las soluciones durante su vida operativa; las dos rutas están en curso desde julio de 2026.

Esta combinación me permite formular una pregunta institucional y recorrerla hasta sus implicaciones técnicas. Si una política exige que una recomendación sea trazable, puedo analizar qué eventos deben conservarse, qué fuente debe identificarse y qué componente necesita registrar la decisión. Si la arquitectura revela una limitación, puedo traducirla en riesgo, responsabilidad y condición de uso. El gobierno efectivo aparece cuando la organización puede relacionar cada principio con un control, cada control con una evidencia y cada evidencia con una responsabilidad. Mi objetivo es construir precisamente esa continuidad.

## Gobernar soluciones de terceros

<!-- seccion: gobierno-de-terceros -->

Una estrategia de inteligencia artificial no puede limitarse a las soluciones desarrolladas internamente. Las plataformas, aplicaciones, modelos y agentes proporcionados por terceros también forman parte de la capacidad institucional y necesitan evaluación, responsabilidades y seguimiento.

Evaluar un proveedor no consiste únicamente en comparar funcionalidades, costos o tiempos de implementación. También es necesario comprender qué información utilizará la solución, dónde será procesada, qué dependencias introduce, cómo administra los cambios y qué evidencia proporciona sobre su comportamiento. Lo aprendí antes de la IA, con un sistema de terceros de otra clase: en Cafam, en 2020, la implementación de Oracle WMS Cloud —un producto que Oracle acababa de comprar— se probó durante meses con 6 personas del proveedor dentro del equipo de 20, y las diferencias entre lo que el sistema hacía y lo que la bodega necesitaba se resolvieron por configuración, por cambio de proceso o por intervención técnica del proveedor, cada una con su responsable.

La organización debe conocer qué responsabilidades conserva el proveedor y cuáles permanecen internamente. Adquirir una tecnología no transfiere automáticamente la responsabilidad sobre su uso, sus efectos ni las decisiones que se tomen con sus resultados. También deben establecerse condiciones para supervisar, restringir, sustituir o retirar la solución. Una dependencia se vuelve especialmente riesgosa cuando la organización no puede recuperar su información, comprender cambios relevantes o continuar un proceso crítico sin el proveedor.

Las actualizaciones necesitan atención particular. Un servicio externo puede modificar su modelo, sus políticas, sus límites o su comportamiento sin que la organización haya cambiado directamente su propia arquitectura. El gobierno debe determinar cómo se conocerán esos cambios y cuándo exigirán una nueva evaluación. En mis propias piezas la respuesta es arquitectónica: el chat de esta hoja de vida corre sobre un proveedor de modelos conmutable por configuración, con un presupuesto mensual explícito y un fallback a búsqueda local si el proveedor falla, de modo que ningún tercero es un punto único de falla para el visitante. Esta perspectiva se conecta con mi trabajo en arquitectura empresarial de IA. El objetivo no es eliminar las dependencias externas, sino conocerlas, administrarlas y evitar que una capacidad institucional quede sustentada sobre supuestos que nadie ha documentado ni puede controlar.

## El gobierno necesita atravesar la organización

<!-- seccion: lo-transversal -->

El gobierno genera poco valor si permanece dentro de un único equipo. Los datos, los modelos y las soluciones inteligentes atraviesan procesos, áreas y responsabilidades, por lo que su gestión exige coordinación entre personas que no necesariamente dependen de una misma autoridad.

He trabajado en iniciativas transversales en las que la colaboración no podía obtenerse mediante una instrucción jerárquica. En el sistema de transporte, en C&M Consultores, coordiné mesas de trabajo con la dirección de los concesionarios del SITP —empresas con contratos e intereses propios— para definir estrategias de mejora, y los indicadores subieron un 25 %. En Cafam articulé un equipo mixto de 20 personas entre la organización y el proveedor del WMS, 14 y 6. En Banco Pichincha co-lideré una iniciativa de gobierno que requería integrar perspectivas técnicas y operativas. Y en la Fundación CTIC la estrategia de IA atraviesa 15 procesos con 20 líderes que no me reportan.

Estas experiencias me enseñaron que una iniciativa transversal no avanza únicamente porque exista una norma, una arquitectura correcta o un patrocinador. Cada área necesita comprender qué decisión mejorará, qué riesgo reducirá, qué responsabilidad conservará y qué esfuerzo tendrá que asumir.

Por eso, no comienzo la conversación exponiendo todos los controles que deben cumplirse. Comienzo comprendiendo el problema de cada actor, las decisiones que necesita tomar y la evidencia que actualmente no puede obtener. El gobierno adquiere legitimidad cuando ayuda a resolver una necesidad real y no cuando se presenta exclusivamente como una obligación externa. Esto no significa negociar principios esenciales ni debilitar controles para facilitar la adopción. Significa diseñar la implementación de manera que las personas comprendan el propósito, puedan cuestionar los mecanismos y reconozcan la relación entre el control y el riesgo que busca administrar.

La alta dirección cumple una función indispensable porque algunos conflictos no pueden resolverse únicamente mediante acuerdos técnicos. Prioridades, recursos, niveles de riesgo y responsabilidades necesitan orientación institucional. Mi función consiste en proporcionar la evidencia y las alternativas necesarias para que esas decisiones puedan tomarse con claridad. El gobierno se vuelve sostenible cuando deja de depender de la capacidad individual para persuadir y queda incorporado en roles, procesos, criterios, sistemas y mecanismos de revisión. La influencia transversal inicia el cambio; el sistema de gestión permite conservarlo.

## Competencia demostrada mediante formación y experiencia

<!-- seccion: experiencia-y-formacion -->

Algunas posiciones de estrategia, arquitectura y gobierno de inteligencia artificial establecen una especialización o una maestría como requisito preferente. Mi formación académica está compuesta por Ingeniería Industrial con énfasis en Inteligencia Analítica de Datos y estudios de Diseño Industrial, las dos en la Pontificia Universidad Javeriana entre 2009 y 2016, complementadas por cinco credenciales obtenidas —el DP-600 de Microsoft y cuatro de IBM en ciencia de datos, Python, SQL y R— y dos rutas en curso desde julio de 2026, AI-103 y AI-300.

No presento la experiencia como sustituto universal de la educación avanzada ni desconozco el valor de un posgrado. Una especialización o maestría puede aportar investigación guiada, profundidad conceptual y una estructura formal de aprendizaje. Sin embargo, cuando una organización admite equivalencia entre educación y experiencia, mi trayectoria permite evaluar directamente las competencias que ese requisito busca representar.

A la experiencia profesional se suma evidencia verificable. DP-600, obtenido en diciembre de 2024, valida formalmente mi profundidad en Microsoft Fabric, Power BI y modelos semánticos. Las cuatro credenciales de IBM respaldan mi base en ciencia de datos, Python, SQL y R. Mi portafolio público permite examinar 6 aplicaciones, 13 agentes, 7 investigaciones y 6 tableros —32 piezas— con sus pruebas, sus controles y sus fichas técnicas; y entre los agentes hay uno que trata precisamente de la norma que implemento.

Si una posición establece un posgrado como requisito formal e insustituible, lo reconozco con transparencia. Cuando el posgrado funciona como indicador de pensamiento estructurado, profundidad técnica y capacidad para resolver problemas complejos, mi trayectoria permite examinar esas cualidades mediante resultados y responsabilidades demostrables.

## Diez años en las responsabilidades que hoy gobierno

<!-- seccion: experiencia-en-lo-que-gobierno -->

Durante diez años, desde agosto de 2016, he desarrollado capacidades relacionadas con procesos, datos, plataformas analíticas, modelos predictivos, aplicaciones, agentes y gobierno. He co-liderado gobierno de datos en banca, en Banco Pichincha; diseñado la arquitectura de datos y observabilidad para una plataforma de agentes con 12 clientes, en Vesting; estructurado un proceso de once etapas utilizado como marco para construir 27 agentes; y actualmente lidero una estrategia institucional de inteligencia artificial basada en UNE-ISO/IEC 42001:2025, con 23 instrumentos, en la Fundación CTIC.

Esta experiencia no se limita a la exposición incidental a esos dominios. He trabajado en las responsabilidades que necesito gobernar: construí pipelines y modelos semánticos antes de establecer criterios sobre activos analíticos; diseñé observabilidad antes de formular exigencias sobre seguimiento; y desarrollé agentes y harnesses —los 13 de mi vitrina, con sus gates y sus fichas— antes de asumir responsabilidades estratégicas sobre su gobierno. Sé lo que cuesta cumplir un control porque he tenido que cumplirlo del otro lado.

Esta combinación me permite evitar dos extremos: una gobernanza conceptualmente correcta, pero difícil de implementar, y una arquitectura técnicamente sofisticada que ignora los riesgos, impactos y responsabilidades institucionales.

Cuando un cargo permite valorar educación y experiencia de manera conjunta, presento una combinación sólida de formación universitaria, credenciales especializadas, práctica profesional directamente relacionada, liderazgo actual y evidencia pública. No solicito que la organización presuponga mis competencias. Proporciono elementos concretos para evaluarlas.

## Lo que distingue mi enfoque de gobierno: el dato, la solución y la organización

<!-- seccion: enfoque-de-gobierno -->

Mi enfoque de gobierno integra tres niveles que con frecuencia se abordan por separado: el dato, la solución inteligente y la organización que responde por sus efectos.

En el nivel del dato, trabajo con significado, procedencia, calidad, acceso, transformación y cambio. En el nivel de la solución, incorporo propósito, comportamiento, fuentes, herramientas, autonomía, evaluación y observabilidad. En el nivel institucional, conecto esas capacidades con responsabilidades, riesgos, políticas, terceros, decisiones y mejora continua. Cada nivel tiene su caso en mi trayectoria: el dato en Banco Pichincha y en la calidad de datos de la Fundación CTIC, la solución en los 27 agentes de Vesting y los 13 de mi vitrina, la organización en los 23 instrumentos del sistema de gestión.

La Ingeniería Industrial proporciona la visión sistémica necesaria para comprender cómo estos niveles se influyen entre sí. Un control puede ser correcto de manera aislada y fracasar dentro del flujo completo. Una política puede estar bien redactada y producir fricción innecesaria si desconoce el proceso. Una solución puede optimizar una actividad y deteriorar el resultado global.

El Diseño Industrial mantiene visible a las personas afectadas por el sistema. El gobierno no debe limitarse a proteger a la organización. También debe considerar si las personas comprenden cuándo interactúan con una solución de IA, qué información utiliza, qué límites tiene y cómo pueden solicitar revisión o intervención.

Mi profundidad en Power BI y modelos semánticos me permite convertir definiciones institucionales en activos analíticos reutilizables. Mi experiencia con agentes me permite comprender cómo esas definiciones se transforman en contexto, herramientas y comportamiento. Mi responsabilidad actual me permite conectar ambos niveles con una estrategia de gestión.

## Gobernar para hacer más, no para hacer menos

<!-- seccion: gobernar-para-hacer-mas -->

No entiendo el gobierno como una actividad destinada a detener la innovación. Lo entiendo como la arquitectura institucional que permite innovar de manera sostenible. Su función es hacer explícitas las decisiones, conservar evidencia, distribuir responsabilidades y proporcionar mecanismos para intervenir cuando cambian los datos, la tecnología, los riesgos o el contexto.

Tampoco considero que una iniciativa esté gobernada únicamente porque cumple un conjunto de controles. El gobierno debe proteger el propósito para el que la solución fue autorizada y permitir evaluar si continúa generando el valor esperado. Una capacidad que ha dejado de ser útil, que opera fuera de su contexto o que introduce un riesgo desproporcionado necesita revisarse, restringirse o retirarse, incluso si técnicamente continúa funcionando. En mi vitrina lo he hecho: en Dash Agent AI, una de las 6 aplicaciones, una funcionalidad se retiró cuando la evidencia mostró 83 sugerencias fuera de contexto, y el retiro está contado en su ficha, no escondido.

La organización no necesita elegir entre velocidad y control como si fueran objetivos incompatibles. Necesita controles proporcionales, aplicables y diseñados dentro de los procesos. La innovación sin gobierno acumula riesgos invisibles. El gobierno sin comprensión técnica acumula documentos que nadie puede convertir en práctica. En la Fundación CTIC, 12 oportunidades y 7 casos evaluados en poco más de un año, con 8 instrumentos terminados y 15 en construcción, es lo que produce un gobierno que abre camino en vez de cerrarlo.

Mi aporte consiste en construir el puente entre ambos extremos: comprender suficientemente la tecnología para diseñar controles aplicables y comprender suficientemente la organización para asegurar que esos controles protejan decisiones, personas y resultados relevantes. No busco gobernar la inteligencia artificial para limitar lo que puede hacerse, sino para que la organización pueda hacer más, con mayor claridad sobre aquello que debe proteger y sobre la evidencia que necesita conservar.
