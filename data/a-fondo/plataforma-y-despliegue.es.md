---
slug: plataforma-y-despliegue
titulo: "Plataforma, nube y despliegue"
resumen: "Qué domino de verdad en nube y despliegue, y cómo cubro lo que no."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry con la nube?"
  - "¿Sabe Henry de contenedores, Kubernetes o Google Cloud?"
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

Mi experiencia más profunda de plataforma se encuentra en el ecosistema Microsoft. He trabajado con Microsoft Fabric, Power BI, modelos semánticos, lakehouses, warehouses, pipelines y capacidades relacionadas con integración, transformación, análisis, seguridad y gobierno de datos.

No describo esta experiencia como una lista de servicios que he utilizado. En Vesting diseñé desde cero un ecosistema de datos sobre Microsoft Fabric para integrar la información generada por agentes de inteligencia artificial, transformarla, organizarla y convertirla en una capacidad analítica para producto y operaciones. La plataforma debía hacer posible observar el comportamiento de las soluciones, reconstruir ejecuciones y analizar volúmenes, tiempos, estados, excepciones y consumo.

Esta responsabilidad exigía diseñar el recorrido completo de los datos. Debía establecer cómo ingresaban los eventos, qué información necesitaba conservarse, qué transformaciones podían compartirse, cómo se representaban las entidades principales y de qué manera llegaban los resultados a los modelos semánticos y a Power BI.

La arquitectura también debía sostener evolución. Cada nueva integración podía introducir estructuras, necesidades y comportamientos diferentes. El desafío no era resolver cada caso de manera artesanal, sino definir una base común capaz de aceptar variación sin perder trazabilidad, calidad ni capacidad de análisis.

DP-600 valida formalmente el núcleo analítico de esta experiencia. La certificación comprende la preparación y enriquecimiento de datos, la administración de activos analíticos, la construcción de lakehouses y warehouses, la implementación de modelos semánticos, y la seguridad y el mantenimiento de las soluciones sobre Microsoft Fabric.

Mi especialidad en Power BI forma parte de esa arquitectura y no constituye una capa independiente. Trabajo desde la preparación de la información y la organización del modelo hasta las medidas, la optimización y la experiencia mediante la cual una persona utiliza el resultado. El tablero es visible; el valor depende de todo el sistema que lo sostiene.

Esta profundidad también conecta con mi formación en Ingeniería Industrial. Analizo la plataforma como un sistema de producción de información: observo entradas, transformaciones, restricciones, controles, acumulaciones, excepciones y consumidores. No intento optimizar cada componente de forma aislada, sino asegurar que el recorrido completo produzca información confiable en el momento correcto.

El Diseño Industrial incorpora la dimensión de uso. Una plataforma puede operar correctamente y, aun así, producir poco valor si las personas no comprenden sus resultados o encuentran demasiada fricción para utilizarlos. Por eso, arquitectura, semántica y experiencia deben diseñarse como partes de una misma capacidad.

## Lo que despliego y mantengo directamente

<!-- seccion: lo-que-despliego -->

Además de mi experiencia en plataformas empresariales, mantengo un portafolio de aplicaciones públicas construidas y desplegadas directamente por mí. Esta práctica me obliga a asumir el ciclo completo: definición, arquitectura, desarrollo, pruebas, integración, publicación, observación y evolución.

Actualmente, el portafolio reúne seis aplicaciones hermanas —Velo, Dash Agent AI, Probeta DS, Hablemos San, Innmobiliaria y Nutri-Kids— más CV Viva, este sitio. No todas responden al mismo propósito ni utilizan la misma arquitectura, pero comparten criterios sobre documentación, pruebas, accesibilidad, rendimiento, trazabilidad y control de cambios.

La integración continua funciona como un mecanismo de calidad y no únicamente como una automatización de despliegue. Antes de publicar, la solución debe superar los controles definidos para su código, comportamiento y artefactos. Cuando una validación falla, la publicación debe detenerse en lugar de trasladar el problema al usuario.

Las pruebas incluyen distintos niveles según la naturaleza de cada producto. Velo cuenta con aproximadamente setecientas cuarenta pruebas y una cobertura cercana al noventa y seis por ciento. Dash Agent AI dispone de cerca de seiscientas noventa y tres pruebas. Hablemos San incorpora ciento sesenta y nueve pruebas de extremo a extremo. Estas cifras deben mantenerse sincronizadas con los repositorios, porque su valor depende de que sean observables y verificables.

No utilizo el número de pruebas como sustituto de la calidad. Una suite extensa puede ofrecer poca protección si verifica detalles irrelevantes o nunca demuestra que puede detectar una falla real. Por eso, cada control debe estar relacionado con una condición concreta y, cuando se incorpora, debe observarse fallando frente al escenario que pretende proteger.

También aplico presupuestos de rendimiento y criterios de accesibilidad. Una funcionalidad no se considera terminada únicamente porque produce el resultado esperado. Debe hacerlo con una experiencia razonable, conservar navegación comprensible y evitar que la evolución del producto deteriore silenciosamente sus condiciones de uso.

Estos despliegues tienen consecuencias reales. Una modificación incorrecta puede romper una experiencia pública, afectar un flujo o producir información inconsistente. Esa responsabilidad me obliga a diseñar mecanismos de prevención, detección, reversión y aprendizaje sin depender de trasladar el problema a un equipo externo de infraestructura.

Esta práctica fortalece mi criterio para entornos empresariales. Una arquitectura no termina cuando el código funciona en desarrollo. Necesita una ruta de publicación, condiciones verificables, visibilidad sobre las fallas y una forma controlada de evolucionar.

## Operar inteligencia artificial exige una disciplina adicional

<!-- seccion: desplegar-y-operar-ia -->

Desplegar aplicaciones y operar soluciones de inteligencia artificial comparten fundamentos como control de versiones, automatización, pruebas, observabilidad y capacidad de respuesta. Sin embargo, una solución inteligente incorpora una dimensión adicional: su comportamiento depende de datos, modelos, contexto, herramientas y componentes probabilísticos que pueden evolucionar de forma independiente.

Una aplicación convencional puede validarse mediante entradas y resultados esperados en escenarios suficientemente definidos. Un modelo o un agente también necesita verificaciones funcionales, pero su evaluación debe considerar variabilidad, relevancia, fundamentación, utilización de herramientas, consumo, latencia y comportamiento frente a información incompleta o contradictoria.

Por esta razón distingo entre desplegar una aplicación y operar una capacidad de inteligencia artificial. La segunda exige conocer no solo si el servicio está disponible, sino si continúa cumpliendo su propósito, si utiliza correctamente las fuentes autorizadas, si conserva sus límites y si el costo de producir un resultado permanece proporcional al valor generado.

Mi experiencia ya recorre buena parte de este ciclo. He construido pipelines y modelos analíticos, desarrollado modelos predictivos, diseñado una plataforma para observar agentes en producción, mantenido aplicaciones públicas y creado un ecosistema propio de harnesses, fuentes, herramientas, validadores y mecanismos de recuperación.

También he aprendido que la puesta en producción no constituye el final del desarrollo. Es el comienzo de la validación frente a la realidad. Cuando una solución empieza a recibir entradas diferentes, interactuar con usuarios y utilizar servicios externos, aparecen condiciones que ninguna demostración controlada puede representar completamente.

La observabilidad permite convertir esas condiciones en evidencia. Una solución debe conservar información suficiente para reconstruir ejecuciones, identificar desviaciones, comparar versiones, analizar costos y comprender cuándo necesita ajustes, restricciones o intervención humana.

La ruta AI-300 profundiza formalmente en esta dimensión mediante MLOps y GenAIOps. Su relación con mi trayectoria es directa: fortalece la automatización, evaluación, observabilidad y operación de capacidades que ya he construido desde la práctica. No representa un cambio de dirección, sino la extensión natural de una arquitectura profesional orientada a llevar soluciones inteligentes desde la construcción hasta una operación confiable.

## Principios arquitectónicos que trascienden la plataforma

<!-- seccion: principios-transferibles -->

Mi profundidad tecnológica está concentrada en Microsoft, pero mi capacidad de arquitectura no depende únicamente del nombre de sus servicios. Los principios con los que diseño plataformas permanecen vigentes cuando cambia el proveedor: separación de responsabilidades, conservación del linaje, calidad de datos, modelado orientado al consumo, permisos mínimos, observabilidad, control de cambios y gobierno del ciclo de vida.

También permanece la necesidad de seleccionar cada componente según el problema. La naturaleza de los datos, la latencia, la granularidad, la concurrencia, el costo, la seguridad y los consumidores esperados continúan determinando la arquitectura, aunque los servicios disponibles y sus mecanismos de configuración sean diferentes.

No traslado una solución entre nubes mediante una equivalencia superficial de productos. Traslado las preguntas de arquitectura y reconstruyo la respuesta utilizando las capacidades propias del ecosistema. BigQuery no es simplemente otro nombre para un lakehouse o un warehouse de Microsoft, y una plataforma de agentes de Google Cloud no es una sustitución nominal de Microsoft Foundry.

La experiencia me permite diferenciar entre el principio que debe preservarse y la implementación que necesita aprenderse. El dato continúa necesitando una identidad y una procedencia. El modelo continúa necesitando evaluación. El agente continúa requiriendo límites y herramientas autorizadas. La plataforma continúa necesitando observabilidad y control de costos. Lo que cambia es la forma concreta de materializar esas responsabilidades.

La Ingeniería Industrial aporta esta capacidad de abstracción. Antes de concentrarme en la herramienta, analizo entradas, transformaciones, restricciones, capacidades, controles y resultados. Esta estructura permite comprender una plataforma nueva desde su función dentro del sistema y no exclusivamente desde la documentación de sus servicios.

El Diseño Industrial también permanece relevante cuando cambia la tecnología. Toda arquitectura termina siendo utilizada por personas. La complejidad del ecosistema necesita convertirse en productos, interfaces y experiencias comprensibles que permitan actuar sin exponer innecesariamente la dificultad técnica que existe detrás.

Esta capacidad de trasladar principios sin simplificar las particularidades del proveedor es la base de mi evolución multicloud. No parte de declarar dominio sobre todas las plataformas, sino de aplicar una metodología arquitectónica consistente y demostrarla mediante soluciones construidas.

## Mi expansión prioritaria hacia Google Cloud

<!-- seccion: expansion-google-cloud -->

He convertido Google Cloud en una prioridad concreta dentro de mi pipeline de construcción. Mi propósito es ampliar una profundidad arquitectónica ya consolidada en Microsoft mediante una solución verificable que integre datos, inteligencia artificial, agentes, observabilidad, seguridad y control de costos dentro del ecosistema de Google.

La pieza prioritaria conectará BigQuery con las capacidades de inteligencia artificial generativa y agentes de Google Cloud. No será una reproducción superficial de una arquitectura existente ni una demostración limitada a formular preguntas a un modelo. Será una solución de extremo a extremo diseñada desde los principios y servicios propios de la plataforma.

La arquitectura deberá integrar información abierta o sintética, procesamiento analítico, acceso controlado a datos estructurados, recuperación de conocimiento y utilización de herramientas. El agente tendrá un propósito delimitado, contratos de entrada y salida, criterios de aceptación y condiciones bajo las cuales deberá abstenerse o solicitar intervención.

BigQuery permitirá estructurar la dimensión de datos y analítica. La plataforma de inteligencia artificial de Google proporcionará los modelos, mecanismos de desarrollo y capacidades necesarias para construir y operar la solución. La integración entre ambos componentes deberá conservar trazabilidad suficiente para reconstruir qué información fue consultada, qué herramientas intervinieron y qué resultado produjo cada ejecución.

La primera versión tendrá un alcance deliberadamente contenido. Mi objetivo no es diseñar una plataforma extensa que permanezca indefinidamente abierta, sino construir una pieza terminada, desplegada, documentada y evaluable que demuestre el recorrido completo.

La solución incorporará observabilidad desde el inicio. Cada ejecución deberá producir evidencia sobre tiempos, errores, herramientas utilizadas, consumo y resultados. El costo no aparecerá como una consecuencia posterior, sino como una variable de arquitectura que deberá medirse y administrarse.

La identidad y los permisos también formarán parte de la construcción. Cada componente tendrá acceso únicamente a los recursos necesarios para su responsabilidad, y las configuraciones sensibles permanecerán separadas del código y de los activos públicos.

La pieza se considerará completa cuando pueda desplegarse de forma reproducible, operar bajo controles explícitos, superar escenarios normales y de excepción, conservar evidencia sobre sus ejecuciones y comunicar con precisión tanto sus capacidades como sus límites.

Esta expansión no busca reemplazar mi especialidad en Microsoft. Busca demostrar que puedo trasladar mi criterio de arquitectura hacia un segundo ecosistema, aprender sus particularidades desde la práctica y ampliar el rango de plataformas sobre las que puedo construir soluciones empresariales de datos e inteligencia artificial.

## Una visión multicloud con profundidad, no con superficialidad

<!-- seccion: direccion-multinube -->

Mi especialidad principal continuará estando en Microsoft, donde concentro la mayor profundidad profesional, la certificación DP-600 y la experiencia de haber construido una plataforma de datos para agentes desde cero. La incorporación de Google Cloud no pretende diluir esa especialidad, sino complementarla.

No entiendo una estrategia multicloud como la obligación de reproducir cada componente en dos proveedores ni como una lista extensa de servicios conocidos. La entiendo como la capacidad para diseñar arquitecturas que reconozcan qué activos deben permanecer bajo control de la organización, qué dependencias pueden sustituirse y qué capacidades conviene ubicar en cada plataforma.

Los datos, las definiciones del negocio, los criterios de evaluación y las responsabilidades institucionales no deberían quedar confundidos con un servicio particular. Los modelos, las herramientas y las capacidades administradas pueden evolucionar siempre que la arquitectura conserve suficiente separación entre el conocimiento propio y la tecnología externa utilizada para procesarlo.

Este principio también se aplica a los agentes. Su propósito, fuentes, herramientas, límites y criterios de evaluación deben poder comprenderse independientemente del proveedor generativo. Un cambio de modelo puede modificar el comportamiento, el costo o la latencia, pero no debería redefinir silenciosamente la responsabilidad de la solución.

Trabajar con una segunda plataforma también fortalece las decisiones dentro de la primera. Comparar enfoques obliga a distinguir qué parte de una solución responde a un principio arquitectónico y cuál existe únicamente por la conveniencia de un servicio determinado. Esa comparación produce mejores decisiones y reduce la dependencia conceptual.

Mi dirección multicloud tiene, por tanto, un criterio claro: profundidad comprobada en Microsoft y expansión verificable hacia Google Cloud. No busco presentarme como un generalista de múltiples proveedores. Busco desarrollar la capacidad para diseñar, dialogar y decidir con criterio en arquitecturas donde distintas plataformas puedan participar sin fragmentar los datos, el gobierno ni la responsabilidad.

## Lo que aporto a un equipo de plataforma

<!-- seccion: lo-que-traigo -->

Aporto una combinación poco frecuente de arquitectura de datos, analítica empresarial, aplicaciones, agentes y gobierno de inteligencia artificial.

He diseñado arquitecturas de datos de extremo a extremo, desde la captura y transformación hasta los modelos semánticos y la experiencia de decisión. En Vesting construí desde cero una plataforma sobre Microsoft Fabric para integrar y observar la información generada por agentes de inteligencia artificial.

Aporto profundidad en Power BI y modelos semánticos. Puedo trabajar en preparación de datos, relaciones, medidas, rendimiento, mantenibilidad, gobierno y adopción, comprendiendo que el tablero es la capa visible de una arquitectura mucho más amplia.

Aporto experiencia en agentes desde dos perspectivas complementarias. En un entorno profesional diseñé la plataforma y el proceso utilizado como marco para construir veintisiete agentes. En mi trabajo propio desarrollé un ecosistema agéntico de alto nivel basado en harnesses especializados, recuperación selectiva, herramientas, memoria, contratos, controles y mecanismos de evaluación.

Aporto práctica directa de despliegue. Mantengo seis aplicaciones hermanas públicas y este sitio, todas con procesos automatizados, pruebas, controles de calidad, accesibilidad, presupuestos de rendimiento y evolución versionada. Respondo por productos que pueden fallar y que necesitan mecanismos reales de prevención, diagnóstico y recuperación.

Aporto gobierno de datos e inteligencia artificial aplicado en banca, plataformas de agentes y salud. Actualmente lidero una estrategia institucional basada en ISO/IEC 42001 y conecto políticas, riesgos y responsabilidades con los componentes técnicos que deben producir evidencia sobre su funcionamiento.

Aporto una cultura de calidad y trazabilidad que se originó en mi experiencia con sistemas de gestión. Las decisiones relevantes quedan documentadas. Los controles deben demostrar que pueden detectar una falla. Las cifras conservan su procedencia. Los cambios necesitan una razón y una forma de comprobar su efecto.

También aporto capacidad para aprender plataformas nuevas sin perder rigor. Identifico los principios, comprendo las particularidades del ecosistema y convierto el aprendizaje en soluciones públicas, verificables y reproducibles.

Mi mayor contribución no es el dominio aislado de una herramienta. Es la capacidad para conectar procesos, datos, plataformas, experiencias analíticas, agentes, operación y gobierno dentro de una arquitectura que pueda generar valor y evolucionar con responsabilidad.

## El siguiente nivel de mi arquitectura profesional

<!-- seccion: siguiente-nivel-plataforma -->

Mi siguiente nivel no consiste en acumular nombres de servicios. Consiste en ampliar la escala y el alcance de las arquitecturas que puedo diseñar, desplegar y gobernar.

En Microsoft quiero continuar profundizando en Fabric, Power BI y Microsoft Foundry para construir plataformas que sirvan de manera coordinada a personas, aplicaciones y agentes. Los modelos semánticos y los activos analíticos deben convertirse en componentes reutilizables dentro de soluciones inteligentes, no permanecer confinados a reportes aislados.

En Google Cloud quiero demostrar una solución integral que conecte BigQuery, modelos generativos, agentes, herramientas, evaluación, identidad, observabilidad y control de costos. Esta pieza consolidará una segunda plataforma desde la práctica y no desde una enumeración curricular.

En operaciones de inteligencia artificial quiero profundizar en automatización, versionamiento, evaluación continua, despliegue, monitoreo y respuesta frente a degradaciones. AI-300 proporciona una estructura formal para esa evolución, mientras mi ecosistema agéntico y mis aplicaciones públicas proporcionan el entorno donde puedo convertirla en evidencia.

Quiero desarrollar arquitecturas en las que la nube no determine por sí sola el diseño, pero donde sus capacidades específicas se utilicen con profundidad. La plataforma debe responder al problema, a los datos, al nivel de riesgo, a la escala y a la capacidad de la organización para operar la solución.

La dirección es coherente con toda mi trayectoria: conservar profundidad donde ya existe experiencia, desarrollar una segunda plataforma mediante evidencia verificable y conectar ambos mundos mediante principios que trascienden a un proveedor.

No busco demostrar que puedo utilizar más herramientas. Busco demostrar que puedo asumir mayor responsabilidad sobre el sistema completo.

