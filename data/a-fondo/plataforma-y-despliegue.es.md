---
slug: plataforma-y-despliegue
titulo: "Plataforma y despliegue"
resumen: "Dónde tengo profundidad de plataforma —Microsoft: Fabric, Power BI, Microsoft Foundry—, qué despliego y opero yo mismo con Git, GitHub Actions, CI/CD, Vercel y Sentry, lo que no he hecho dicho sin rodeos —Docker, Kubernetes, Vertex AI, BigQuery— y cómo cubro esa brecha."
cuando_usar: "Úsalo cuando pregunten por su experiencia con Azure y la nube de Microsoft, Google Cloud, Docker y Kubernetes, MLOps, integración y despliegue continuos, qué despliega y mantiene directamente, y qué no ha hecho nunca y tendría que aprender."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-21
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry con la nube?"
  - "¿Sabe Henry de contenedores, Kubernetes o Google Cloud?"
  - "¿Sabe de integración continua y despliegue automático?"
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

## Mi profundidad de plataforma está en Microsoft

<!-- seccion: el-mundo-microsoft -->

Mi experiencia más profunda de plataforma se encuentra en el ecosistema Microsoft y en Azure. He trabajado con Microsoft Fabric, Power BI, modelos semánticos, lakehouses, warehouses, pipelines y capacidades relacionadas con integración, transformación, análisis, seguridad y gobierno de datos, y hoy con Microsoft Foundry (antes Azure AI Foundry) para aplicaciones generativas y agentes, que es el terreno de la ruta AI-103 que curso.

No describo esta experiencia como una lista de servicios que he utilizado. En Vesting, entre agosto de 2023 y enero de 2025, diseñé desde cero un ecosistema de datos sobre Microsoft Fabric para integrar la información generada por agentes de inteligencia artificial, transformarla, organizarla y convertirla en una capacidad analítica para producto y operaciones: los eventos de 27 agentes que atendían a 12 clientes, 120 tablas, 20 GB y 1.000 eventos por día. La plataforma debía hacer posible observar el comportamiento de las soluciones, reconstruir ejecuciones y analizar volúmenes, tiempos, estados, excepciones y consumo.

El DP-600 valida formalmente el núcleo analítico de esta experiencia, y lo obtuve dentro de ese mismo rol, en diciembre de 2024. La certificación cubre la preparación y el enriquecimiento de datos, la administración de activos analíticos, la construcción de lakehouses y warehouses, la implementación de modelos semánticos, y la seguridad y el mantenimiento de las soluciones sobre Microsoft Fabric. Lo que hice con cada una de esas piezas —Direct Lake, RLS, Power Query, DAX Studio, Tabular Editor— está desarrollado en el documento de Fabric.

## Diseñar el recorrido completo del dato en Vesting

<!-- seccion: el-recorrido-completo -->

Esa responsabilidad exigía diseñar el recorrido completo de los datos. Debía establecer cómo ingresaban los eventos, qué información necesitaba conservarse, qué transformaciones podían compartirse, cómo se representaban las entidades principales y de qué manera llegaban los resultados a los modelos semánticos y a Power BI.

La arquitectura también debía sostener evolución. Cada nueva integración podía introducir estructuras, necesidades y comportamientos diferentes. El desafío no era resolver cada caso de manera artesanal, sino definir una base común capaz de aceptar variación sin perder trazabilidad, calidad ni capacidad de análisis. En la práctica eso significó una capa de recepción que absorbía la forma de cada integración, una representación común de sesiones, solicitudes, respuestas, tiempos, estados y costo a partir de la preparación, y workspaces separados por cliente para que la separación de la información fuera arquitectónica y no una disciplina de quien consultaba.

Mi especialidad en Power BI forma parte de esa arquitectura y no constituye una capa independiente. Trabajo desde la preparación de la información y la organización del modelo hasta las medidas, la optimización y la experiencia mediante la cual una persona utiliza el resultado. El tablero es visible; el valor depende de todo el sistema que lo sostiene. Cerré la etapa de Vesting al dejar el ecosistema y el proceso documentados.

Esta profundidad también conecta con mi formación en Ingeniería Industrial. Analizo la plataforma como un sistema de producción de información: observo entradas, transformaciones, restricciones, controles, acumulaciones, excepciones y consumidores. No intento optimizar cada componente de forma aislada, sino asegurar que el recorrido completo produzca información confiable en el momento correcto.

El Diseño Industrial incorpora la dimensión de uso. Una plataforma puede operar correctamente y, aun así, producir poco valor si las personas no comprenden sus resultados o encuentran demasiada fricción para utilizarlos. Por eso, arquitectura, semántica y experiencia deben diseñarse como partes de una misma capacidad.

## Lo que despliego y mantengo directamente

<!-- seccion: lo-que-despliego -->

Además de mi experiencia en plataformas empresariales, mantengo un portafolio de aplicaciones públicas construidas y desplegadas directamente por mí. Esta práctica me obliga a asumir el ciclo completo: definición, arquitectura, desarrollo, pruebas, integración, publicación, observación y evolución.

Actualmente, el portafolio reúne seis aplicaciones hermanas —Velo, Dash Agent AI, Probeta DS, Hablemos San, Innmobiliaria y Nutri-Kids— más CV Viva, este sitio. Todas están en operación sostenida: si están en el sitio es porque alcanzaron la condición de MVP, y siguen en evolución permanente; Hablemos San, sellada en agosto de 2026, es la más avanzada. No todas responden al mismo propósito ni utilizan la misma arquitectura, pero comparten criterios sobre documentación, pruebas, accesibilidad, rendimiento, trazabilidad y control de cambios, y comparten la misma cadena de herramientas:

- Git y GitHub como fuente de verdad, con commits convencionales, ramas por sprint y decisiones de arquitectura registradas en ADR;
- integración y despliegue continuos (CI/CD) con GitHub Actions: pruebas unitarias, de integración y de extremo a extremo, accesibilidad con axe y presupuesto de rendimiento con Lighthouse, y ninguna rama llega a producción con uno solo de esos trabajos en rojo. El barrido de secretos con gitleaks va un paso antes, como enganche de pre-commit: un secreto no llega siquiera a existir en el historial, que es donde de verdad cuesta sacarlo;
- despliegue en Vercel, con una vista previa por cada cambio y producción desde la rama principal; Innmobiliaria se sirve desde el borde en Cloudflare Workers, y Dash Agent AI no se despliega porque vive entera en la máquina de quien la usa;
- base de datos gestionada con Supabase donde de verdad hay que guardar algo —Innmobiliaria y este sitio—, y correo transaccional con Resend para lo que sale por email;
- observabilidad con Sentry y registro estructurado con Pino, siempre con metadatos y nunca con contenido del usuario, para saber qué falló y dónde.

Cada aplicación publica además una ficha con sus cifras y la fuente de cada una —medida, calculada, declarada o estimada—, porque una app que exige procedencia a cada número de su pantalla no puede publicar cifras sueltas sobre sí misma.

## La integración continua como mecanismo de calidad: pruebas, accesibilidad y rendimiento

<!-- seccion: ci-como-calidad -->

La integración continua funciona como un mecanismo de calidad y no únicamente como una automatización de despliegue. Antes de publicar, la solución debe superar los controles definidos para su código, comportamiento y artefactos. Cuando una validación falla, la publicación debe detenerse en lugar de trasladar el problema al usuario.

Las pruebas incluyen distintos niveles según la naturaleza de cada producto. Las cifras, tomadas de las fichas publicadas de cada app en 2026:

| App | Pruebas unitarias y de integración | Pruebas de extremo a extremo | Cobertura de líneas |
| --- | --- | --- | --- |
| Velo | 740 | 153 | 96 % |
| Dash Agent AI | 693 | — | 97,5 % |
| Probeta DS | 267 | 24 | 90,7 % |
| Hablemos San | 261 | 169 | 94 % |
| Innmobiliaria | 172 | 76 | 98,3 % del motor |
| Nutri-Kids | 214 | 94 | 99,5 % del motor |

Estas cifras deben mantenerse sincronizadas con los repositorios, porque su valor depende de que sean observables y verificables. Algunas de esas pruebas son permanentes por diseño: Dash Agent AI tiene una que falla si el runtime abre un socket saliente; Velo, una que intercepta todas las peticiones del navegador y falla si una sola lleva datos del usuario; Hablemos San, una que verifica que tras jugar no queda rastro de la voz del niño en ningún almacenamiento.

No utilizo el número de pruebas como sustituto de la calidad. Una suite extensa puede ofrecer poca protección si verifica detalles irrelevantes o nunca demuestra que puede detectar una falla real. Por eso, cada control debe estar relacionado con una condición concreta y, cuando se incorpora, debe observarse fallando frente al escenario que pretende proteger. Esa regla —un gate se demuestra fallando— es del pipeline y está explicada en su documento.

También aplico presupuestos de rendimiento y criterios de accesibilidad. Una funcionalidad no se considera terminada únicamente porque produce el resultado esperado. Debe hacerlo con una experiencia razonable, conservar navegación comprensible y evitar que la evolución del producto deteriore silenciosamente sus condiciones de uso.

## Responder por productos públicos que pueden fallar

<!-- seccion: responder-por-lo-publico -->

Estos despliegues tienen consecuencias reales. Una modificación incorrecta puede romper una experiencia pública, afectar un flujo o producir información inconsistente. Esa responsabilidad me obliga a diseñar mecanismos de prevención, detección, reversión y aprendizaje sin depender de trasladar el problema a un equipo externo de infraestructura.

La prevención es la CI que bloquea; la detección es Sentry y el registro estructurado; la reversión es la vista previa por cambio en Vercel y la posibilidad de volver a la versión anterior de la rama principal; el aprendizaje es el resumen de cada sprint y el ADR de cada decisión, que quedan en el repositorio. Cuando una app corre en el navegador del usuario —Velo con Web Workers y Web Crypto, Probeta DS con Python en WebAssembly— la reversión es todavía más importante, porque no hay un servidor que apagar.

Esta práctica fortalece mi criterio para entornos empresariales. Una arquitectura no termina cuando el código funciona en desarrollo. Necesita una ruta de publicación, condiciones verificables, visibilidad sobre las fallas y una forma controlada de evolucionar. Lo que aprendí operando seis aplicaciones y este sitio es lo mismo que exigía en Vesting a cada integración nueva, con la diferencia de que aquí no hay nadie más a quien llamar cuando algo se rompe.

## La base de datos de este sitio: Supabase, seguridad a nivel de fila y acceso solo por funciones

<!-- seccion: la-base-de-datos-del-sitio -->

Este sitio se sirve estático y no tiene un servidor mío detrás, pero sí tiene una capa de datos desde julio de 2026: Supabase en su plan gratuito, la primera base de datos de la aplicación, que entró para sostener una votación con conteos reales y hoy sostiene la del roadmap de cada aplicación hermana. La decisión de arquitectura no fue elegir Supabase; fue cómo exponerlo. La tabla de votos no guarda identidad ni dirección IP, y el conteo es una agregación y no un contador mutable: así no hay carrera de escritura sobre una celda ni histórico que se pierda al recalcular.

La seguridad a nivel de fila queda encendida y sin ninguna política, que es la manera de decir que el rol anónimo no lee ni escribe la tabla directamente. Toda la superficie pública son dos funciones con privilegios del definidor —una emite el voto y devuelve el conteo real en la misma transacción, la otra devuelve el agregado— y los permisos se otorgan y se revocan uno a uno, en vez de confiar en lo que el motor deje concedido: un privilegio implícito es justamente el que nadie revisa. Lo comprobé como se comprueba un control: intentando leer e insertar como anónimo y viendo el permiso denegado.

El contador es honesto por regla de producto. El número sale de la función en el momento de pedirlo, y si la base no responde, la ruta devuelve un 503 y la interfaz declara la votación no disponible con los botones apagados. Prefiero una función apagada a un número inventado.

Este repositorio corre cuatro trabajos de integración continua: calidad, integración, extremo a extremo y Lighthouse. El de integración levanta un Supabase real, le aplica las migraciones y prueba contra Postgres, votación en el navegador incluida. Una regla de permisos razonada todavía no está verificada; lo está cuando una prueba intenta saltársela y no puede.

## Nombre y correo para chatear: qué datos guarda la puerta del chat y quién puede leerlos

<!-- seccion: la-puerta-del-chat -->

Desde el 21 de septiembre de 2026 el chat de esta hoja de vida tiene una puerta, y la puerta es infraestructura antes que pantalla: añadió dos tablas al mismo Supabase, con el mismo patrón de la votación y una diferencia que obliga a decirla en voz alta, porque estas sí guardan datos personales. La primera tabla, la de los códigos, lleva una fila por correo con la huella del código vigente, su vencimiento y los intentos fallidos. La segunda, la del registro, lleva una fila por pregunta respondida: nombre, correo, idioma, la pregunta, la respuesta completa, las fuentes que se citaron, el modo en que se contestó, el proveedor y el modelo, los tokens y los milisegundos que costó.

Las dos tienen la seguridad por filas encendida y ninguna política, y el rol anónimo solo puede ejecutar tres funciones con privilegios del definidor: guardar un código, verificarlo y consumirlo, y registrar una conversación. Ninguna de las tres devuelve filas. Escribir no es leer: quien pregunta deja su rastro y no puede ver el de nadie, ni siquiera el suyo. La lectura es mía, con la llave de servicio y desde el panel de la base, y esa llave no viaja al navegador ni vive en el repositorio.

El resto de la decisión pesa tanto como el esquema. No se guarda dirección IP ni agente de usuario. El visitante entrega su nombre y su correo con un aviso de tratamiento de datos, bajo la Ley 1581 de 2012, y con un fin declarado: que yo sepa quién preguntó y qué se le respondió. La promesa anterior de la aplicación —cero datos personales, que sigue valiendo para la votación— no daba para estirarla hasta aquí, así que en lugar de estirarla cambió, quedó escrita en su propia decisión de arquitectura y se dice en el mismo sitio donde se piden los datos. Privacidad, para mí, es esto: decir qué se guarda, por qué, quién lo lee y cómo se pide que se borre.

## El código de verificación sale por Resend y la sesión viaja en una cookie firmada

<!-- seccion: codigo-y-cookie-del-chat -->

El correo con el código de seis dígitos sale por Resend, el mismo proveedor que ya enviaba el formulario de contacto: una sola cuenta de correo transaccional para las dos cosas y una dependencia menos que vigilar. El código se genera con el generador criptográfico del sistema y no con un azar de interfaz; de él se guarda solo una huella calculada con un secreto del servidor y el propio correo, de modo que ni con la base delante se reconstruye; vale diez minutos y cinco intentos, y se compara en tiempo constante para no filtrar información por lo que tarda la comparación.

Verificado el código, el servidor emite una cookie firmada con HMAC-SHA256, httpOnly y SameSite=Lax, que dura treinta días. No hay contraseñas, ni tabla de usuarios, ni proveedor de identidad: el correo es la identidad y el código es la prueba de que le pertenece. Es la pieza de autenticación más pequeña que resuelve el problema, y eso es deliberado, porque cada pieza que no existe es una que no hay que operar, actualizar ni proteger.

También está diseñada la forma de fallar. Sin el secreto configurado, la ruta del chat responde que el registro no está disponible en vez de dejar pasar a cualquiera: una puerta que se abre sola cuando le falta una variable de entorno no es una puerta. Y para probar hay un almacén en memoria que reemplaza la base de datos, de manera que el recorrido de extremo a extremo cruza la puerta de verdad —pide el código, lo verifica, recibe la cookie— sin correo, sin red y sin base de datos. Es lo que permite que la barrera se pruebe entera en cada cambio, y no solo el día que se construyó.

## Operar inteligencia artificial exige una disciplina adicional

<!-- seccion: desplegar-y-operar-ia -->

Desplegar aplicaciones y operar soluciones de inteligencia artificial comparten fundamentos como control de versiones, automatización, pruebas, observabilidad y capacidad de respuesta. Sin embargo, una solución inteligente incorpora una dimensión adicional: su comportamiento depende de datos, modelos, contexto, herramientas y componentes probabilísticos que pueden evolucionar de forma independiente.

Una aplicación convencional puede validarse mediante entradas y resultados esperados en escenarios suficientemente definidos. Un modelo o un agente también necesita verificaciones funcionales, pero su evaluación debe considerar variabilidad, relevancia, fundamentación, utilización de herramientas, consumo, latencia y comportamiento frente a información incompleta o contradictoria.

Por esta razón distingo entre desplegar una aplicación y operar una capacidad de inteligencia artificial. La segunda exige conocer no solo si el servicio está disponible, sino si continúa cumpliendo su propósito, si utiliza correctamente las fuentes autorizadas, si conserva sus límites y si el costo de producir un resultado permanece proporcional al valor generado.

Mi experiencia ya recorre buena parte de este ciclo. He construido pipelines y modelos analíticos, desarrollado modelos predictivos en banca y en transporte, diseñado en Vesting la plataforma que observaba hasta 23 agentes a la vez en producción, mantenido aplicaciones públicas y creado ARKHÉ, mi ecosistema propio de harnesses, fuentes, herramientas, validadores y mecanismos de recuperación. En tres de las apps —Probeta DS, Nutri-Kids y CV Viva— la IA generativa corre con guardrails, presupuesto declarado y un fallback determinista si el proveedor falla o la respuesta no pasa la verificación.

## La puesta en producción es el comienzo de la validación

<!-- seccion: produccion-es-el-comienzo -->

También he aprendido que la puesta en producción no constituye el final del desarrollo. Es el comienzo de la validación frente a la realidad. Cuando una solución empieza a recibir entradas diferentes, interactuar con usuarios y utilizar servicios externos, aparecen condiciones que ninguna demostración controlada puede representar completamente. En Vesting lo veía en los eventos: un agente que se comportaba bien en pruebas empezaba a acumular reintentos con una integración concreta, y solo la telemetría por sesión permitía verlo antes de que un usuario lo reportara.

La observabilidad permite convertir esas condiciones en evidencia. Una solución debe conservar información suficiente para reconstruir ejecuciones, identificar desviaciones, comparar versiones, analizar costos y comprender cuándo necesita ajustes, restricciones o intervención humana. En mis apps esa información viaja como metadatos por Pino y Sentry; en Vesting viajaba como eventos a Microsoft Fabric y de ahí a Power BI.

La ruta AI-300 —Machine Learning Operations Engineer Associate, en curso— profundiza formalmente en esta dimensión mediante MLOps y GenAIOps. Su relación con mi trayectoria es directa: fortalece la automatización, evaluación, observabilidad y operación de capacidades que ya he construido desde la práctica. No representa un cambio de dirección, sino la extensión natural de una arquitectura profesional orientada a llevar soluciones inteligentes desde la construcción hasta una operación confiable.

## Lo que no he hecho, dicho sin rodeos

<!-- seccion: lo-que-no-he-hecho -->

Google Cloud —Vertex AI, BigQuery, despliegue productivo en ese ecosistema— y contenedores en producción con Docker y Kubernetes no están en mi experiencia profesional. Mi mundo es Microsoft y en Microsoft es donde tengo la profundidad. Kubernetes lo conozco como estudio, no como operación; no he operado un clúster ni desplegado un servicio en él. No afirmo uso real de BigQuery ni de Vertex AI: están en mi mapa como exploración, no como capacidad.

De MLOps tengo una mitad y no la otra, y conviene decir cuál. La mitad de llevar modelos a producción y sostenerlos la he hecho: modelos predictivos en producción en Banco Pichincha y en TransMilenio, el monitoreo en tiempo real de agentes de IA en Vesting, y seis aplicaciones hermanas y este sitio con integración continua, controles que bloquean la publicación y despliegue automático, operadas por mí. La mitad de empaquetar y orquestar con contenedores, no. Mis despliegues son sin servidor propio —Vercel, Cloudflare Workers, el navegador del usuario— y por eso nunca han necesitado un contenedor.

Prefiero decirlo así, de frente, que esconderlo en una lista de herramientas. Un currículum que nombra treinta tecnologías no distingue las cinco que domina de las veinticinco que ha visto, y quien entrevista lo descubre en diez minutos. Por la misma razón retiré de mis skills herramientas que usé en su momento y hoy no practico: es mejor una lista corta que sea cierta.

## Principios arquitectónicos que trascienden la plataforma

<!-- seccion: principios-transferibles -->

Mi profundidad tecnológica está concentrada en Microsoft, pero mi capacidad de arquitectura no depende únicamente del nombre de sus servicios. Los principios con los que diseño plataformas permanecen vigentes cuando cambia el proveedor: separación de responsabilidades, conservación del linaje, calidad de datos, modelado orientado al consumo, permisos mínimos, observabilidad, control de cambios y gobierno del ciclo de vida.

También permanece la necesidad de seleccionar cada componente según el problema. La naturaleza de los datos, la latencia, la granularidad, la concurrencia, el costo, la seguridad y los consumidores esperados continúan determinando la arquitectura, aunque los servicios disponibles y sus mecanismos de configuración sean diferentes.

No traslado una solución entre nubes mediante una equivalencia superficial de productos. Traslado las preguntas de arquitectura y reconstruyo la respuesta utilizando las capacidades propias del ecosistema. BigQuery no es simplemente otro nombre para un lakehouse o un warehouse de Microsoft Fabric, y una plataforma de agentes de Google Cloud no es una sustitución nominal de Microsoft Foundry.

La experiencia me permite diferenciar entre el principio que debe preservarse y la implementación que necesita aprenderse. El dato continúa necesitando una identidad y una procedencia. El modelo continúa necesitando evaluación. El agente continúa requiriendo límites y herramientas autorizadas. La plataforma continúa necesitando observabilidad y control de costos. Lo que cambia es la forma concreta de materializar esas responsabilidades.

La Ingeniería Industrial aporta esta capacidad de abstracción. Antes de concentrarme en la herramienta, analizo entradas, transformaciones, restricciones, capacidades, controles y resultados. Esta estructura permite comprender una plataforma nueva desde su función dentro del sistema y no exclusivamente desde la documentación de sus servicios. El Diseño Industrial también permanece relevante cuando cambia la tecnología: toda arquitectura termina siendo utilizada por personas, y la complejidad del ecosistema necesita convertirse en productos, interfaces y experiencias comprensibles.

Esta capacidad de trasladar principios sin simplificar las particularidades del proveedor es la base de mi evolución multicloud. No parte de declarar dominio sobre todas las plataformas, sino de aplicar una metodología arquitectónica consistente y demostrarla mediante soluciones construidas.

## Por qué esa brecha es más chica de lo que parece, y cómo la cubro

<!-- seccion: como-la-cubro -->

Dos razones. La primera es de equivalencia: un lago sobre almacenamiento distribuido, un almacén analítico columnar, un orquestador de pipelines y una capa semántica existen en las tres nubes con nombres distintos. Lo que hice con lakehouse y warehouse sobre OneLake tiene su contraparte en BigQuery, y lo que hago con Microsoft Foundry la tiene en Vertex AI; lo que no se traduce solo son identidad, costos y operación, y eso se aprende operando.

La segunda es de método, y tiene fechas. Fabric lo aprendí desde cero en Vesting a partir de agosto de 2023, con la plataforma a menos de un año de su disponibilidad general, y obtuve el DP-600 en diciembre de 2024 tras cinco meses de estudio. Next.js y el pipeline de aplicaciones los tomé desde julio de 2026, y con ellos tecnologías que no había usado —WebAssembly, procesamiento local en el navegador, despliegue en el borde—, y hoy son seis aplicaciones hermanas y este sitio, construidas y publicadas. Las rutas AI-103 y AI-300 las curso desde julio de 2026. Y lo último que aprendí desde cero, sin certificado de por medio, fueron Codex, Antigravity y Claude Code: los tomé desde su salida y tardé alrededor de un mes en trabajar con ellos con soltura. El documento «Cómo aprendo» detalla el método.

Google Cloud es hoy una exploración declarada, no una capacidad: en mi pipeline hay una pieza llamada «Agente autónomo con Gemini y Vertex AI», pensada como el complemento multinube de mi ruta de certificación en Azure. Está en exploración con esa palabra a propósito y sin horizonte comprometido; cuando esté construida, será evidencia, y hasta entonces no la cuento.

## Mi expansión hacia Google Cloud: una exploración declarada

<!-- seccion: expansion-google-cloud -->

He convertido Google Cloud en una prioridad concreta dentro de mi pipeline de construcción, con una salvedad que mantengo escrita: es una exploración sin fecha comprometida. Mi propósito es ampliar una profundidad arquitectónica ya consolidada en Microsoft mediante una solución verificable que integre datos, inteligencia artificial, agentes, observabilidad, seguridad y control de costos dentro del ecosistema de Google.

La pieza prioritaria conectará BigQuery con las capacidades de inteligencia artificial generativa y agentes de Google Cloud, con Gemini y Vertex AI. No será una reproducción superficial de una arquitectura existente ni una demostración limitada a formular preguntas a un modelo. Será una solución de extremo a extremo diseñada desde los principios y servicios propios de la plataforma.

La arquitectura deberá integrar información abierta o sintética, procesamiento analítico, acceso controlado a datos estructurados, recuperación de conocimiento y utilización de herramientas. El agente tendrá un propósito delimitado, contratos de entrada y salida, criterios de aceptación y condiciones bajo las cuales deberá abstenerse o solicitar intervención, que es exactamente lo que exijo hoy a los 13 agentes publicados en mi vitrina.

BigQuery permitirá estructurar la dimensión de datos y analítica. La plataforma de inteligencia artificial de Google proporcionará los modelos, mecanismos de desarrollo y capacidades necesarias para construir y operar la solución. La integración entre ambos componentes deberá conservar trazabilidad suficiente para reconstruir qué información fue consultada, qué herramientas intervinieron y qué resultado produjo cada ejecución.

## Qué tendrá la pieza de Google Cloud cuando exista

<!-- seccion: la-pieza-de-google-cloud -->

La primera versión tendrá un alcance deliberadamente contenido. Mi objetivo no es diseñar una plataforma extensa que permanezca indefinidamente abierta, sino construir una pieza terminada, desplegada, documentada y evaluable que demuestre el recorrido completo, con el mismo listón que las seis aplicaciones publicadas en 2026: pruebas con Vitest y Playwright, accesibilidad, presupuesto de rendimiento y una ficha con cifras que declaran su fuente.

La solución incorporará observabilidad desde el inicio. Cada ejecución deberá producir evidencia sobre tiempos, errores, herramientas utilizadas, consumo y resultados. El costo no aparecerá como una consecuencia posterior, sino como una variable de arquitectura que deberá medirse y administrarse, como ya hago con el presupuesto declarado del chat de este sitio.

La identidad y los permisos también formarán parte de la construcción. Cada componente tendrá acceso únicamente a los recursos necesarios para su responsabilidad, y las configuraciones sensibles permanecerán separadas del código y de los activos públicos, con el mismo barrido de secretos con gitleaks que corre en cada uno de mis repositorios.

La pieza se considerará completa cuando pueda desplegarse de forma reproducible, operar bajo controles explícitos, superar escenarios normales y de excepción, conservar evidencia sobre sus ejecuciones y comunicar con precisión tanto sus capacidades como sus límites.

Esta expansión no busca reemplazar mi especialidad en Microsoft. Busca demostrar que puedo trasladar mi criterio de arquitectura hacia un segundo ecosistema, aprender sus particularidades desde la práctica y ampliar el rango de plataformas sobre las que puedo construir soluciones empresariales de datos e inteligencia artificial.

## Una visión multicloud con profundidad, no con superficialidad

<!-- seccion: direccion-multinube -->

Mi especialidad principal continuará estando en Microsoft, donde concentro la mayor profundidad profesional, la certificación DP-600 y la experiencia de haber construido en Vesting una plataforma de datos para agentes desde cero. La incorporación de Google Cloud no pretende diluir esa especialidad, sino complementarla.

No entiendo una estrategia multicloud como la obligación de reproducir cada componente en dos proveedores ni como una lista extensa de servicios conocidos. La entiendo como la capacidad para diseñar arquitecturas que reconozcan qué activos deben permanecer bajo control de la organización, qué dependencias pueden sustituirse y qué capacidades conviene ubicar en cada plataforma.

Los datos, las definiciones del negocio, los criterios de evaluación y las responsabilidades institucionales no deberían quedar confundidos con un servicio particular. Los modelos, las herramientas y las capacidades administradas pueden evolucionar siempre que la arquitectura conserve suficiente separación entre el conocimiento propio y la tecnología externa utilizada para procesarlo. Es la misma razón por la que el chat de este sitio y el asistente de Nutri-Kids conmutan de proveedor de modelo por una variable de entorno: el corpus, los guardrails y las pruebas son míos; el modelo es reemplazable.

Este principio también se aplica a los agentes. Su propósito, fuentes, herramientas, límites y criterios de evaluación deben poder comprenderse independientemente del proveedor generativo. Un cambio de modelo puede modificar el comportamiento, el costo o la latencia, pero no debería redefinir silenciosamente la responsabilidad de la solución.

Trabajar con una segunda plataforma también fortalece las decisiones dentro de la primera. Comparar enfoques obliga a distinguir qué parte de una solución responde a un principio arquitectónico y cuál existe únicamente por la conveniencia de un servicio determinado. Esa comparación produce mejores decisiones y reduce la dependencia conceptual.

Mi dirección multicloud tiene, por tanto, un criterio claro: profundidad comprobada en Microsoft y expansión verificable hacia Google Cloud. No busco presentarme como un generalista de múltiples proveedores. Busco desarrollar la capacidad para diseñar, dialogar y decidir con criterio en arquitecturas donde distintas plataformas puedan participar sin fragmentar los datos, el gobierno ni la responsabilidad.

## Lo que aporto a un equipo de plataforma

<!-- seccion: lo-que-traigo -->

Aporto una combinación poco frecuente de arquitectura de datos, analítica empresarial, aplicaciones, agentes y gobierno de inteligencia artificial.

He diseñado arquitecturas de datos de extremo a extremo, desde la captura y transformación hasta los modelos semánticos y la experiencia de decisión. En Vesting construí desde cero una plataforma sobre Microsoft Fabric para integrar y observar la información generada por agentes de inteligencia artificial.

Aporto profundidad en Power BI y modelos semánticos. Puedo trabajar en preparación de datos, relaciones, medidas, rendimiento con DAX Studio y Tabular Editor, mantenibilidad, gobierno y adopción, comprendiendo que el tablero es la capa visible de una arquitectura mucho más amplia.

Aporto experiencia en agentes desde dos perspectivas complementarias. En un entorno profesional diseñé la plataforma y el proceso core utilizado como marco para construir 27 agentes. En mi trabajo propio desarrollé ARKHÉ, un ecosistema agéntico de alto nivel basado en harnesses especializados, recuperación selectiva, herramientas, memoria, contratos, controles y mecanismos de evaluación.

Aporto práctica directa de despliegue. Mantengo seis aplicaciones hermanas públicas y este sitio, todas con procesos automatizados en GitHub Actions, pruebas, controles de calidad, accesibilidad, presupuestos de rendimiento y evolución versionada. Respondo por productos que pueden fallar y que necesitan mecanismos reales de prevención, diagnóstico y recuperación.

Aporto gobierno de datos e inteligencia artificial aplicado en banca, plataformas de agentes y salud: montado tres veces. Actualmente lidero en la Fundación CTIC una estrategia institucional basada en ISO/IEC 42001 y conecto políticas, riesgos y responsabilidades con los componentes técnicos que deben producir evidencia sobre su funcionamiento.

Aporto una cultura de calidad y trazabilidad que se originó en mi experiencia con sistemas de gestión bajo ISO 9001 y se quedó. Las decisiones relevantes quedan documentadas. Los controles deben demostrar que pueden detectar una falla. Las cifras conservan su procedencia. Los cambios necesitan una razón y una forma de comprobar su efecto.

También aporto capacidad para aprender plataformas nuevas sin perder rigor. Identifico los principios, comprendo las particularidades del ecosistema y convierto el aprendizaje en soluciones públicas, verificables y reproducibles.

Mi mayor contribución no es el dominio aislado de una herramienta. Es la capacidad para conectar procesos, datos, plataformas, experiencias analíticas, agentes, operación y gobierno dentro de una arquitectura que pueda generar valor y evolucionar con responsabilidad.

## El siguiente nivel de mi arquitectura profesional

<!-- seccion: siguiente-nivel-plataforma -->

Mi siguiente nivel no consiste en acumular nombres de servicios. Consiste en ampliar la escala y el alcance de las arquitecturas que puedo diseñar, desplegar y gobernar.

En Microsoft quiero continuar profundizando en Fabric, Power BI y Microsoft Foundry para construir plataformas que sirvan de manera coordinada a personas, aplicaciones y agentes. Los modelos semánticos y los activos analíticos deben convertirse en componentes reutilizables dentro de soluciones inteligentes, no permanecer confinados a reportes aislados. La ruta AI-103 es el vehículo formal de esa profundización.

En Google Cloud quiero demostrar una solución integral que conecte BigQuery, modelos generativos, agentes, herramientas, evaluación, identidad, observabilidad y control de costos. Esta pieza consolidará una segunda plataforma desde la práctica y no desde una enumeración curricular, y hasta que exista seguirá declarada como exploración.

En operaciones de inteligencia artificial quiero profundizar en automatización, versionamiento, evaluación continua, despliegue, monitoreo y respuesta frente a degradaciones. La ruta AI-300 proporciona una estructura formal para esa evolución, mientras ARKHÉ y mis aplicaciones públicas proporcionan el entorno donde puedo convertirla en evidencia.

Quiero desarrollar arquitecturas en las que la nube no determine por sí sola el diseño, pero donde sus capacidades específicas se utilicen con profundidad. La plataforma debe responder al problema, a los datos, al nivel de riesgo, a la escala y a la capacidad de la organización para operar la solución.

La dirección es coherente con toda mi trayectoria: conservar profundidad donde ya existe experiencia, desarrollar una segunda plataforma mediante evidencia verificable y conectar ambos mundos mediante principios que trascienden a un proveedor.

No busco demostrar que puedo utilizar más herramientas. Busco demostrar que puedo asumir mayor responsabilidad sobre el sistema completo.
