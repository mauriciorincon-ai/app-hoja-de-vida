---
slug: apps-pipeline
titulo: "Las apps que estoy construyendo en público"
resumen: "El pipeline AI-APPs: seis aplicaciones hermanas más CV Viva, 13 agentes, 7 investigaciones y 6 tableros —32 piezas— construidos con dos casas, un agente de fábrica, cuatro jobs de CI, un contrato de ficha desde Zod, costo real de US$0 al mes y dos reglas: código primero y todo control se demuestra fallando."
estado: aprobado
ancla: "#vitrina"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué aplicaciones está construyendo Henry?"
  - "¿Por qué construye en público?"
  - "¿Cuántas aplicaciones ha publicado?"
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

<!-- El esqueleto del S3 apuntaba a «#apps»; esa sección de la HOME se retiró en
     la revisión post-S7 y el roadmap se fue a /vitrina/apps. Hoy lo que la HOME
     enseña de lo construido es la vitrina. Corregido en la migración del S8. -->

<!-- guía (viene del esqueleto de la historia, S3 — la escribió el dueño):
La visión del pipeline AI-APPs: por qué construyes en público, qué
demuestra cada app, cómo trabajas con agentes de IA para construirlas (esta
CV Viva incluida). -->

## Lo que construyo por mi cuenta, fuera del trabajo, y por qué en público

<!-- seccion: por-que-en-publico -->

Un currículum afirma; una pieza publicada demuestra. Esa es la razón principal por la que construyo en público: seis aplicaciones hermanas, más este sitio, y 32 piezas en total, todas fuera de mi trabajo y todas con su repositorio.

Durante mi trayectoria —diez años desde agosto de 2016— he exigido que cada indicador conserve su procedencia, que cada transformación pueda explicarse y que cada conclusión esté respaldada por evidencia. Me parecía incoherente aplicar ese nivel de rigor al trabajo de las organizaciones y presentar mi propio perfil mediante afirmaciones que nadie pudiera verificar. Por eso decidí tratar mi experiencia profesional como trato cualquier sistema de información: con trazabilidad, evidencia, control de versiones y resultados observables.

Mi portafolio no es una galería de demostraciones ni una colección de ejercicios. Es una arquitectura de evidencia profesional. Cada pieza busca demostrar una capacidad concreta mediante un producto que puede recorrerse, probarse y analizarse. Las aplicaciones demuestran construcción de soluciones. Los agentes muestran cómo estructuro el trabajo con inteligencia artificial. Las investigaciones hacen visible mi disciplina metodológica. Los tableros permiten evaluar mi forma de convertir datos en modelos, indicadores y experiencias de decisión.

Construir en público es, en última instancia, una forma de responsabilidad profesional. No espero que una persona confíe únicamente en la descripción de mis capacidades. Le proporciono piezas que permiten examinarlas, y desde julio de 2026 cada una llega a la vitrina con su ficha, sus cifras, sus límites y sus «nunca».

## Lo que no está terminado no se presenta como terminado

<!-- seccion: estados-honestos -->

Construir en público introduce una consecuencia deliberadamente incómoda: aquello que no está terminado no puede presentarse como si lo estuviera. Una idea puede declararse en exploración, un prototipo puede mostrar una hipótesis y una solución terminada puede demostrar una capacidad, pero estos estados no deben confundirse. Hacer visible esa diferencia protege la credibilidad del portafolio y me obliga a describir cada resultado con precisión.

Los estados están escritos en los datos, no en la prosa. El catálogo de apps admite tres: en producción —URL viva, repositorio y CI en verde—, en construcción —repositorio con commits reales— y en exploración —objetivo declarado, sin fechas prometidas—. Las fichas de las piezas admiten dos: inicial, cuando la construcción está cerrada, y sellado, cuando el gate de pruebas del usuario terminó y la pieza lleva su fecha de sello. De los 13 agentes publicados, cinco están sellados y ocho en estado inicial; los seis tableros están sellados, y las siete investigaciones son iniciales, con sus manuscritos listos para enviar y ninguno enviado.

También me obliga a mantener una correspondencia entre lo que afirmo y lo que entrego. Si digo que una solución es reproducible, debe existir una forma de comprender cómo fue construida. Si afirmo que una cifra fue calculada, debo poder explicar el método. Si una aplicación utiliza inteligencia artificial, debe quedar claro qué función cumple, qué información utiliza y por qué esa capacidad no podía resolverse adecuadamente mediante programación convencional.

La publicación no elimina la posibilidad de equivocarme. La hace observable y corregible. Un artefacto versionado permite conocer qué cambió, por qué cambió y qué aprendizaje produjo la modificación. Esa trazabilidad convierte el portafolio en algo más valioso que una fotografía de resultados terminados: lo convierte en evidencia de cómo razono, diseño, valido y evoluciono soluciones. Dash Agent AI es el ejemplo más honesto: construyó una funcionalidad de sugerencias, la midió sobre el corpus real, obtuvo 83 sugerencias descontextualizadas y la retiró, y la ficha lo dice con fecha en lugar de contarla como pendiente.

## Qué significa publicar con responsabilidad

<!-- seccion: publicar-con-responsabilidad -->

Construir en público no significa divulgar sin límites. La transparencia profesional debe coexistir con la privacidad, la seguridad, la confidencialidad y el respeto por la información de terceros. Por eso, cada pieza se diseña distinguiendo claramente qué puede publicarse, qué debe anonimizarse, qué necesita datos sintéticos o abiertos y qué debe permanecer fuera del repositorio.

No publico credenciales, secretos, información personal, datos internos de organizaciones ni componentes cuya exposición pueda aumentar innecesariamente el riesgo de una solución. Cuando una pieza parte de un aprendizaje obtenido en un entorno profesional, reproduzco el principio, el patrón o el problema mediante información autorizada, abierta o sintética, sin trasladar al portafolio los datos sensibles del contexto original. Las siete investigaciones lo llevan escrito como un «nunca»: jamás usan datos de mis empleos anteriores, solo fuentes públicas y datos sintéticos declarados.

También procuro que los repositorios públicos no conviertan la transparencia en una vulnerabilidad. Las configuraciones sensibles se separan del código —los secretos viven solo en el archivo de entorno local, ignorado por git, y en las variables del despliegue—, las dependencias se revisan con una auditoría en cada integración, y las funcionalidades que utilizan servicios externos operan bajo permisos y límites explícitos. Un barrido de secretos con gitleaks bloquea cada commit, en 2 capas: el hook de git para los commits manuales y un hook del agente de código para las escrituras que él hace. Una arquitectura verificable no necesita revelar aquello que debe proteger.

Y una regla dura del pipeline que rige sobre este sitio: cero enlaces. Ningún archivo del repositorio ni campo del proyecto contiene la URL de producción ni la de las vistas previas; la producción se muestra, jamás se entrega. El llamado público de cada app es una lista de espera, sin promesa de otorgamiento, y el barrido que lo vigila corre sobre todos los archivos versionados después del último cambio, no antes.

## Procedencia del conocimiento y responsabilidad sobre lo asistido por IA

<!-- seccion: procedencia-y-responsabilidad -->

La publicación responsable también exige respetar la procedencia del conocimiento. Las fuentes externas deben reconocerse, las licencias deben conservarse y los activos de terceros no deben presentarse como propios. Los seis tableros lo practican con nombre: el de Fórmula 1 declara su origen y su licencia —F1DB, versión 2026.13.0, CC BY 4.0—, y el de energía y clima publica sus siete fuentes abiertas con la licencia de cada una en su página de notas.

Del mismo modo, una pieza asistida por inteligencia artificial continúa bajo mi responsabilidad: el uso de un modelo no transfiere la obligación de revisar, validar y responder por el resultado publicado. Construyo con agentes de código, y por eso cada aplicación nace con pruebas automatizadas, con umbrales de cobertura en la integración continua y con decisiones de arquitectura registradas: el agente acelera; la responsabilidad no se mueve.

Esta distinción es especialmente importante en investigaciones y agentes. La apertura permite examinar el método, las fuentes y los criterios de evaluación, pero no obliga a exponer información que comprometa a personas u organizaciones. Los dos harnesses de investigación llevan un «nunca» que un lint verifica dos veces: no mencionan mi ecosistema ni mi maquinaria en un manuscrito. Mi objetivo es hacer verificable la capacidad profesional, no convertir la publicación en un ejercicio de divulgación indiscriminada.

## Qué hay construido

<!-- seccion: que-hay-construido -->

El pipeline produce cuatro familias principales de activos: aplicaciones, agentes, investigaciones y tableros analíticos. Todas las piezas terminadas se publican en la vitrina del sitio y cuentan con una ficha que explica su propósito, alcance, estado y principales decisiones de diseño. Hoy la vitrina reúne 32 piezas: seis aplicaciones hermanas, 13 agentes, 7 investigaciones y 6 tableros.

Las seis aplicaciones son Velo, Dash Agent AI, Probeta DS, Hablemos San, Innmobiliaria y Nutri-Kids, más CV Viva, que es este mismo sitio y no una pieza del escaparate. Cada una responde a una promesa diferente, pero todas deben superar el mismo criterio: convertir una necesidad en una experiencia funcional, documentada y verificable, no únicamente en una interfaz convincente o una demostración técnica.

| Aplicación        | Qué demuestra                                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Velo**          | anonimizar y recuperar 500.000 filas sin que el archivo salga del navegador, con cero llamadas de red que lleven datos                                     |
| **Dash Agent AI** | qué contexto conservan tus agentes sobre ti y qué te cuestan, en tu máquina y sin una llamada de red; retiró una función de 83 sugerencias que no ayudaban |
| **Probeta DS**    | Python, Pandas y scikit-learn en el navegador con Pyodide (WebAssembly), con un veredicto que dice «no supera» cuando no supera                            |
| **Hablemos San**  | 50 cápsulas y 16 hitos para practicar el habla en familia, con 169 pruebas de extremo a extremo y la voz del niño jamás grabada                            |
| **Innmobiliaria** | flujos de negocio con validación real —el certificado se ve y nunca se almacena— y 98 % de cobertura en su motor                                           |
| **Nutri-Kids**    | un motor de cálculo con 99,5 % de cobertura y un registro del día que jamás sale del teléfono                                                              |

Todas alcanzaron su MVP y están en operación sostenida —si están en el sitio es porque llegaron a esa condición—, y todas siguen en evolución permanente. Hablemos San es la más avanzada: la única sellada, desde agosto de 2026, y en uso por la familia para la que se construyó.

## Las seis aplicaciones, en cifras

<!-- seccion: las-seis-apps-en-cifras -->

Cada aplicación publica su brochure con cifras que declaran su fuente, y esta tabla las reúne tal como estaban en sus exports de agosto de 2026:

| Aplicación        | Funcionalidades | Pantallas | Pruebas unitarias e integración | Pruebas de extremo a extremo | Cobertura de líneas | ADR |
| ----------------- | --------------: | --------: | ------------------------------: | ---------------------------: | ------------------: | --: |
| **Velo**          |              14 |         5 |                             740 |                          153 |             96,17 % |   8 |
| **Dash Agent AI** |              12 |         8 |                             693 |                            — |              97,5 % |  13 |
| **Probeta DS**    |              33 |         5 |                             267 |                           24 |             90,69 % |   8 |
| **Hablemos San**  |              24 |        10 |                             261 |                          169 |             94,02 % |  14 |
| **Innmobiliaria** |              13 |        11 |                             172 |                           76 |             98,31 % |   6 |
| **Nutri-Kids**    |              19 |         8 |                             214 |                           94 |             99,52 % |   7 |

El costo de operación mensual de las seis es US$0, calculado como la suma de los servicios contratados: hosting en plan gratuito, sin servidores propios y, cuando hay un proveedor de IA, dentro de su cuota gratuita. Cuatro de las seis no usan inteligencia artificial en absoluto —Velo, Dash Agent AI, Hablemos San e Innmobiliaria, que la tiene en cero modelos por regla de producto—, y sus fichas lo declaran como regla, no como ausencia; Probeta DS y Nutri-Kids la usan en una sola función, con fallback determinista y conmutable por variable de entorno.

Estas cifras son una foto con fecha, se refrescan desde el repositorio de cada app, y una suite grande no protege por sí sola: lo que protege es que cada prueba esté atada a una condición concreta que sabe ponerse en rojo. Tres ejemplos: Velo tiene una prueba permanente que intercepta todas las peticiones del navegador y falla si una sola lleva datos; Hablemos San tiene pruebas en la integración continua que rompen el código si alguien intenta guardar o enviar el audio del menor; Probeta DS tiene pruebas que fallan si alguien ajusta el preprocesamiento fuera de la mitad de entrenamiento.

## Trece agentes, siete investigaciones y seis tableros

<!-- seccion: agentes-investigaciones-tableros -->

El portafolio incluye además trece agentes publicados, concebidos como sistemas de trabajo especializados. No los presento como conversaciones genéricas ni como demostraciones de generación de texto. Cada agente debe tener un propósito delimitado, unas fuentes o conocimientos identificables, reglas de actuación, resultados esperados y condiciones bajo las cuales debe reconocer sus límites. Cinco están sellados —el Constructor de Tableros Power BI en junio de 2026, la Fábrica de AI-APPs en julio, Presentaciones CINE y el Taller de Animación entre julio y agosto, y el Harness Paper Computacional en agosto—; su documento propio los recorre uno por uno.

Las siete líneas de investigación representan otra dimensión del pipeline. Su propósito no es respaldar retrospectivamente una idea mediante referencias seleccionadas, sino formular una pregunta, caracterizar el vacío que la hace relevante y construir una ruta metodológica capaz de producir evidencia. Cada trabajo debe distinguir claramente entre aquello que está sustentado, lo que todavía constituye una hipótesis y lo que no puede afirmarse con los resultados disponibles. Cada una publica su vacío con el número de obras revisadas —de 119 marcos a 1.414 obras— y su documento explica el método.

Los seis tableros construidos sobre datos públicos permiten demostrar la capa analítica del perfil. En ellos verifico la identidad de las fuentes, conservo las definiciones utilizadas, estructuro modelos de información y construyo medidas que pueden recorrerse hasta los datos que las originan. Los seis se sellaron entre el 6 y el 8 de septiembre de 2026 y corren sus identidades sobre el universo completo, no sobre una muestra. El objetivo no es producir visualizaciones atractivas, sino demostrar que la experiencia de decisión se sostiene sobre una arquitectura confiable.

## Cuatro familias, un sistema progresivo de capacidades

<!-- seccion: sistema-progresivo -->

Estas cuatro familias no compiten entre sí. Forman un sistema progresivo de capacidades. Los datos permiten observar. Los tableros convierten esa observación en comprensión. Las investigaciones permiten formular y contrastar explicaciones. Las aplicaciones integran capacidades dentro de una experiencia utilizable. Los agentes amplían esa experiencia mediante conocimiento, razonamiento y herramientas dentro de límites definidos.

Las familias también se alimentan entre sí en el pipeline real. Los dos harnesses de investigación son agentes de la vitrina y producen las siete investigaciones. La Fábrica de AI-APPs es un agente y coordina las seis aplicaciones. El Constructor de Tableros Power BI —construido y probado: crea el proyecto completo con su modelo semántico, la preparación en Power Query M, las medidas DAX y las visuales, y puede extraer datos— es un agente que produce la clase de artefacto que los seis tableros demuestran a mano. Y la investigación sobre el espectro de agencia estudia justamente cuándo una decisión merece un tablero, una alerta, una recomendación o un agente.

Cada ficha también debe declarar qué capacidad profesional pretende demostrar. Una aplicación puede evidenciar arquitectura, desarrollo o experiencia de usuario. Un agente puede demostrar recuperación de conocimiento, uso de herramientas o evaluación. Una investigación puede demostrar método. Un tablero puede demostrar ingeniería de datos, modelado semántico o comunicación analítica. Esta relación evita que las piezas se conviertan en proyectos interesantes, pero desconectados del perfil que deben sustentar.

## Cada cifra declara su naturaleza: medida, calculada, declarada o estimada

<!-- seccion: cifras-con-procedencia -->

Cada cifra publicada en las fichas técnicas debe declarar su naturaleza. Una cifra puede haber sido medida directamente, calculada a partir de datos, declarada por una fuente o estimada bajo determinados supuestos. Esta clasificación evita presentar con el mismo nivel de certeza resultados que tienen fundamentos diferentes, y en las fichas es un campo obligatorio, no una nota al pie: una cifra sin fuente no entra.

La regla nació en Dash Agent AI, la primera app en publicar su brochure en agosto de 2026, y se recomendó al resto del portafolio con un argumento sencillo: una app que exige procedencia a cada número de su pantalla no puede publicar cifras sueltas sobre sí misma. Así, «740 pruebas» es medido —la salida de un comando en una fecha—; «US$0 al mes» es calculado —la suma de servicios contratados, con la regla escrita—; «0 GPU» en Probeta DS es declarado —una regla dura del producto—; y las «108 horas de coordinación eliminadas al año» de la Fábrica son una estimación, con su escenario y sus supuestos al lado.

La regla no es decorativa. Un portafolio que exige procedencia a los datos de sus aplicaciones y tableros debe aplicar el mismo estándar a las afirmaciones que hace sobre sí mismo. La vitrina no solo muestra lo construido; muestra qué evidencia permite sostener cada afirmación.

## Capacidad demostrada no es tecnología utilizada

<!-- seccion: capacidad-vs-tecnologia -->

La ficha debe diferenciar igualmente entre capacidad demostrada y tecnología utilizada. Una herramienta no constituye por sí sola una competencia. Utilizar Microsoft Fabric, Power BI, Python, un modelo generativo o un framework determinado solo adquiere significado cuando queda claro qué problema permitió resolver, qué decisión arquitectónica representó y qué evidencia demuestra que la solución cumplió su propósito.

Por eso el stack de cada ficha no es una lista de logotipos: cada tecnología va con su papel. En Velo, los Web Workers son la frontera donde viven los datos crudos y hacia la interfaz solo cruzan conteos y muestras enmascaradas; la Web Crypto es la bóveda cifrada. En Probeta DS, Pyodide es la razón de que pandas y scikit-learn corran en un hilo aparte del navegador y el dataset nunca se suba. En Innmobiliaria, Supabase es una base de datos con permisos por fila desde la primera tabla y toda escritura por función transaccional. La misma palabra —Next.js— aparece en las seis, y en cada una significa una decisión distinta: una PWA instalable y local en Hablemos San, un servidor que escucha solo en la máquina local en Dash Agent AI, una app servida desde el borde en Innmobiliaria.

Esa disciplina es la que uso para leer una hoja de vida ajena, y la que pido que usen con la mía.

## Qué demuestra cada familia: las aplicaciones

<!-- seccion: que-demuestra-cada-familia -->

Las aplicaciones demuestran mi capacidad para llevar una idea desde la definición del problema hasta una solución funcional, desplegada, documentada y disponible para ser examinada por otras personas. Esto comprende arquitectura, experiencia de usuario, desarrollo, pruebas, accesibilidad, rendimiento, publicación y mantenimiento. Las seis están en operación sostenida porque alcanzaron su MVP, y siguen evolucionando; lo que no hago es usar la palabra producción como sinónimo de que una demostración pueda abrirse en un navegador: cada ficha dice en qué estado está y desde cuándo.

Velo demuestra que ciertas capacidades pueden ejecutarse completamente dentro del navegador, evitando que el archivo del usuario deba enviarse a un servidor. Esta decisión no es solamente técnica. También responde a una reflexión sobre privacidad, arquitectura y confianza: cuando una operación puede realizarse localmente sin sacrificar el propósito de la solución, reducir la exposición de la información puede ser una característica central del producto. Velo lo lleva al extremo: 500.000 filas por 24 columnas sin bloquear la pestaña, cero inteligencia artificial a propósito y el mismo archivo produce siempre el mismo resultado, byte por byte.

Probeta DS explora la ejecución de capacidades de análisis mediante Python, pandas y scikit-learn dentro de la experiencia del navegador utilizando WebAssembly. La pieza conecta ciencia de datos, desarrollo de aplicaciones y diseño de interacción. Su valor no está únicamente en ejecutar código analítico, sino en convertir una capacidad normalmente reservada a entornos especializados en una experiencia accesible y controlada, y en enseñar la pantalla en la que su propio producto falla: el veredicto contra el baseline dice «no supera» cuando no supera, y la fuga de datos es imposible por construcción.

Dash Agent AI hace visible una dimensión que con frecuencia permanece oculta: la información que un agente conserva, utiliza o infiere sobre la persona con la que interactúa. Esta aplicación conecta observabilidad, transparencia y experiencia de usuario, y transforma un problema abstracto de confianza en una interfaz que puede ser examinada: el inventario de lo que tus agentes saben de ti, la detección determinista de lo que dejó de ser cierto y una garantía de solo lectura de cuatro capas, comprobable en pantalla.

## Qué demuestran los agentes, las investigaciones y los tableros

<!-- seccion: que-demuestran-las-otras-familias -->

Los agentes demuestran mi forma de trabajar con inteligencia artificial generativa. No confío en la memoria del modelo como fuente suficiente para producir afirmaciones verificables. Cuando una tarea exige evidencia, el agente debe utilizar fuentes identificables, citar aquello que sustenta su respuesta y declarar los vacíos que no puede resolver. La fluidez de una respuesta nunca debe confundirse con la solidez de su fundamento. La Fábrica de AI-APPs lo tiene escrito como «nunca»: no inventa cifras, citas, papers ni competidores; sin fuente, el dato va a la sección de vacíos.

También demuestran que un agente no es solamente un modelo conversacional. Es una composición de instrucciones, contexto, fuentes, herramientas, memoria, límites, evaluaciones y mecanismos de intervención. Su calidad depende de la arquitectura completa, no de la capacidad del modelo para producir una respuesta convincente: el Harness Design Science tiene 52 criterios binarios de aceptación en sus diez fases y cinco puertas que solo cruza con una frase exacta mía.

Las investigaciones demuestran rigor metodológico. Cada línea debe comenzar por una pregunta relevante y una revisión capaz de establecer qué se conoce, qué permanece abierto y qué contribución puede formularse sin exceder la evidencia. Investigar no consiste en vestir una intuición con lenguaje académico. Consiste en exponerla a un método que pueda confirmarla, modificarla o rechazarla, y en su paper piloto dos de los tres principios evaluados quedaron refutados por sus propias métricas, y así se escribieron.

Los tableros demuestran ingeniería analítica verificable. Cada uno exige comprender las fuentes, evaluar su calidad, estructurar un modelo semántico, definir medidas y construir una experiencia de análisis. Power BI aparece aquí no como herramienta de visualización aislada, sino como la capa mediante la cual los datos, las relaciones y las métricas se convierten en una experiencia de decisión: en el tablero de banca, el balance cierra en las 7.779 combinaciones de entidad y corte, corrido entero y no sobre una muestra.

En conjunto, las familias muestran una capacidad de extremo a extremo. Puedo investigar un problema, estructurar sus datos, construir el modelo que permite comprenderlo, diseñar la aplicación mediante la cual una persona interactúa con la solución e incorporar inteligencia artificial cuando esa capacidad aporta un valor que la programación determinista no puede ofrecer por sí sola.

## Cómo funciona el pipeline de construcción: dos casas

<!-- seccion: como-se-construyen -->

El portafolio no se construye como una sucesión de proyectos independientes. Utilizo un pipeline gobernado por reglas comunes para priorizar, definir, construir, validar, documentar y publicar cada pieza. El objetivo es que el valor no permanezca únicamente en el producto terminado, sino también en la capacidad para construir el siguiente con mayor claridad, consistencia y velocidad.

El pipeline funciona con dos casas y un escritor por casa. Una casa planeadora, privada, donde viven el brief, la visión de producto, los sprints con su plan y su retrospectiva, las órdenes de construcción de cada app, el método y los estándares. Y el repositorio de cada app, donde viven el código, las pruebas, las decisiones de implementación, la bitácora y el resumen de cada sprint. La planeadora lee los repositorios de las apps en solo lectura y nunca escribe en ellos; cada app nunca escribe en el plan. La sincronización es lectura de git en frío —el resumen del sprint y su historial de commits—, no copiar y pegar. Nadie vuelve a ser el puente: el flujo anterior me costaba entre 4 y 8 horas de coordinación por sprint, y cuando ese tiempo se acababa el pipeline se congelaba.

El pipeline es asistido por un agente de fábrica que también forma parte de la vitrina. Su función no es diseñar productos de manera autónoma ni sustituir las decisiones de arquitectura, prioridad o aceptación. Actúa como un componente de coordinación: conserva el estado de las iniciativas, verifica la existencia de los insumos requeridos, aplica reglas de avance, identifica vacíos documentales y ayuda a mantener la correspondencia entre lo aprobado, lo construido y lo publicado.

Cada app nace estampada del mismo kit: la plantilla que trae la integración continua, los hooks de secretos y de no empujar directo a la rama principal, el presupuesto de rendimiento y el patrón de inteligencia artificial embebida ya horneados. El kit tiene versión y sus lecciones se acumulan: lo que un sprint aprende en una app viaja estampado a la siguiente, como deltas en la orden de construcción que sigue.

## La fábrica, en números

<!-- seccion: la-fabrica-en-numeros -->

Lo coordina la Fábrica de AI-APPs, un agente sellado el 2 de julio de 2026 que es también una pieza de la vitrina, con sus cifras con procedencia: siete repositorios estampados desde el kit —las seis hermanas y este sitio—, con el primer commit de cada uno entre el 4 de julio y el 15 de agosto de 2026; 24 sprints cerrados con retrospectiva; nueve sesiones de re-priorización del portafolio, porque la prioridad caduca cada cuatro sprints y su gate bloquea todo trabajo hasta volver a correrla; y seis gates humanos: portafolio, visión, plan de sprint, release, edición del método y creación de repositorios o servicios.

La Fábrica declara tres límites, y prefiero escribirlos a esconderlos: no escribe código de producción —eso ocurre en el repositorio de cada app, jamás en la planeadora—; las fases de lanzamiento y de operación siguen sin validarse en una corrida real, son método escrito y no experiencia; y no hay librerías compartidas vivas entre apps, el reúso viaja estampado en el kit. Su retorno solo cuenta la coordinación eliminada —una estimación de 108 horas al año, con sus supuestos declarados—; el valor comercial del portafolio queda como opción no cuantificada.

Este sitio lleva ocho sprints cerrados así y 21 decisiones de arquitectura registradas en su repositorio. Cada cambio pasa por cuatro jobs de integración continua —calidad, integración contra una base de datos real, pruebas de extremo a extremo con accesibilidad y Lighthouse con presupuesto de rendimiento— y por el barrido de secretos. La infraestructura que lo sostiene está dibujada en un blueprint con su costo real, US$0 al mes, y con su punto único de falla declarado: la cuenta de GitHub, que es el inicio de sesión del hosting y de la base de datos, mitigado con doble factor. Y si la base de datos cae, la votación se declara no disponible; si el proveedor de IA cae, el chat pasa a búsqueda local: ninguno de los dos tumba el sitio.

## Dos aprobaciones escritas y responsables humanos explícitos

<!-- seccion: dos-aprobaciones -->

La regla principal es explícita: ninguna aplicación avanza sin dos aprobaciones escritas. La primera corresponde a la prioridad vigente y demuestra por qué esa pieza merece ocupar capacidad frente a otras alternativas. La segunda corresponde a la visión del producto y establece su propósito, sus usuarios, sus funcionalidades —todas las del brief inventariadas, no una muestra—, sus límites y los resultados con los que será evaluada. Sin priorización vigente el harness se rehúsa a planear; sin visión aprobada, se rehúsa a abrir un sprint.

Las decisiones críticas conservan responsables humanos explícitos. El agente puede detectar que falta una definición, organizar evidencia o proponer el siguiente paso, pero no puede aprobar por sí mismo la prioridad de una iniciativa, modificar su propósito, aceptar un riesgo ni declarar terminada una pieza. Tampoco puede editar el método, los estándares o el kit sin mi aprobación explícita. Esta separación permite aprovechar la inteligencia artificial sin diluir la responsabilidad sobre el resultado.

Esta disciplina evita comenzar por el código cuando todavía no existe claridad sobre el valor. Una idea técnicamente interesante no se convierte automáticamente en una prioridad. Antes de construir, necesito comprender qué problema resuelve, por qué merece inversión, qué capacidad demuestra y cómo se integrará dentro del portafolio. Por eso la planeadora inventaría 12 iniciativas concebidas y solo 7 tienen repositorio: concebir es barato; construir se gana.

Y la aprobación del plan de un sprint no arranca la construcción. Aprobado el plan, el agente emite su recomendación de modelo y esfuerzo y espera mi «construye» explícito antes de tocar un archivo. Es un gate pequeño que nació de una reincidencia y se quedó.

## Cada ciclo cierra con un resumen: la memoria del pipeline

<!-- seccion: cierre-con-resumen -->

Cada ciclo de desarrollo debe cerrarse con un resumen que documente lo realizado, las decisiones adoptadas, los cambios frente a la visión inicial, las pruebas ejecutadas, las dificultades encontradas y el trabajo pendiente. El resumen no es una formalidad retrospectiva. Es la memoria que permite que la siguiente iteración no dependa exclusivamente de recordar lo ocurrido. Sin ese archivo, escrito por el repositorio de la app, el harness se rehúsa a cerrar el sprint, y ninguna corrida cierra sin su entrada en la lista de lecciones aprendidas.

Este enfoque proviene directamente de la Ingeniería Industrial. Un proceso solo puede mejorarse de manera acumulativa cuando sus entradas, decisiones, resultados y excepciones son observables. La calidad no debe depender de que la misma persona recuerde cómo construyó la pieza anterior. Debe quedar incorporada en reglas, plantillas, pruebas y criterios que puedan repetirse. Los 24 sprints cerrados del pipeline son 24 resúmenes y 24 retrospectivas leídas por la planeadora.

El Diseño Industrial complementa esa estructura al mantener visible la promesa de la solución y la experiencia de quien la utiliza. El pipeline no puede declarar terminada una aplicación únicamente porque sus componentes técnicos funcionan. La pieza debe comunicar su propósito, reducir complejidad innecesaria y permitir que otra persona comprenda qué puede hacer, cómo hacerlo y qué límites debe reconocer. Cada sprint con interfaz cierra con una revisión de diseño contra el design system de la app y con mi aprobación visual sobre la vista previa.

El agente de fábrica convierte estas reglas en una capacidad operativa. No reemplaza el proceso ni toma decisiones estratégicas por sí solo. Ayuda a conservar su disciplina, detectar vacíos y mantener la correspondencia entre la visión aprobada, el trabajo ejecutado y la pieza finalmente publicada. El resultado buscado no es automatizar indiscriminadamente la construcción de software. Es desarrollar una fábrica gobernada en la que la inteligencia artificial amplía la capacidad de analizar, documentar y ejecutar, mientras las decisiones de propósito, prioridad, riesgo y aceptación permanecen explícitamente controladas.

## Los dos precedentes que endurecieron el pipeline

<!-- seccion: los-precedentes -->

Las reglas del pipeline no salieron de un manual: casi todas nacieron de un rojo. Dos precedentes explican por qué hoy hay tanta insistencia en ver fallar los controles.

El primero es del 15 de julio de 2026. El barrido de secretos con gitleaks estaba instalado y daba «todo bien». Al probarlo con un secreto de prueba flojo, pasó en silencio, y lo hizo dos veces seguidas: las reglas modernas de gitleaks exigen un alfabeto real y entropía, y una carnada improvisada no dispara nada. Dos «todo bien» falsos consecutivos son peores que ningún control, porque dan tranquilidad. Desde entonces la carnada canónica está verificada, viaja partida en la documentación para no disparar el hook al comitearla, y se vuelve a verificar en un entorno aislado cada vez que gitleaks sube de versión mayor.

El segundo es del sprint 3 de este sitio. Una credencial del proveedor de inteligencia artificial devolvió un 401 en la integración: la clave estaba mal y nada lo había avisado hasta que la pieza intentó usarla. El chat degradó a búsqueda local, como estaba diseñado, y esa fue la primera prueba real del fallback. Pero el pipeline aprendió algo más útil: hoy toda credencial pasa una prueba de humo en la fase cero de cada sprint, antes de construir contra ella, y la integración continua repite ese humo en cada corrida —una URL o una clave inválidas se descubren ya, no al final—.

Ninguno de los dos precedentes se contó como un incidente. Se contaron como método: la regla de que un gate se demuestra fallando existe porque el gate que nunca se vio fallar dio falsa tranquilidad dos veces en la misma semana.

## El contrato de las fichas

<!-- seccion: el-contrato-de-las-fichas -->

Este sitio es el destino, no el autor, de lo que muestra. Las fichas de las aplicaciones las administra la planeadora: el export del brochure de cada app más un complemento curado —titular, cifras destacadas, límites, «nunca» y proceso— forman la ficha completa. Las de agentes, investigaciones y tableros las produce quien construye cada pieza, contra un contrato de ficha técnica publicado desde el esquema Zod —versión vigente 1.3.1—, y llegan por copia en un pull request de contenido sin sprint, que la integración continua valida: esquema, cero enlaces, accesibilidad y pruebas de extremo a extremo.

Una ficha que no valida no se corrige aquí, ni siquiera para que quepa: se reporta archivo, campo y regla, y se corrige en origen. Si varias no caben por una razón legítima de su frente, el contrato crece de forma aditiva, en modo plan y con decisión registrada; así nacieron las versiones 1.2.0 y 1.3.0. El contrato lo generan las pruebas desde el esquema —el schema, un ejemplo, la clave visual y la referencia—, no la mano, para que el documento y el validador no puedan divergir.

Un solo contrato y un solo renderizador: el componente que pinta una ficha renderiza el esquema, no un tipo de pieza, y nada específico de un frente vive en él. Lo específico de cada frente vive en datos —el catálogo de los cuatro frentes con su estado, nombre e introducción— o en el escaparate del frente. Así, agregar una pieza a la vitrina es copiar un archivo y abrir un pull request; y desde septiembre de 2026, esa misma ficha entra al índice del chat en el siguiente build, sin escribir prosa nueva.

## Código primero, inteligencia artificial cuando está justificada

<!-- seccion: codigo-primero -->

Una de las reglas más importantes del pipeline —la regla 13— es no incorporar inteligencia artificial generativa por defecto. Antes de utilizarla, debo demostrar qué característica del problema exige interpretación, generación, recuperación contextual o coordinación flexible de herramientas, y por qué una solución determinista no resulta suficiente o adecuada. Activar una funcionalidad generativa exige una decisión de arquitectura escrita que lo justifique.

Esta regla no implica construir primero una solución convencional que sé que será descartada. Significa evaluar conscientemente si la necesidad puede resolverse mediante reglas, transformaciones, búsquedas estructuradas, algoritmos o flujos de trabajo convencionales. Cuando estas alternativas cumplen el propósito, suelen ofrecer mayor previsibilidad, menor costo, mejor capacidad de prueba y una explicación más directa de su comportamiento.

La regla se ve en las seis aplicaciones. Velo anonimiza con criptografía y validadores que citan su fuente oficial, y por eso el mismo archivo produce siempre el mismo resultado. Dash Agent AI detecta lo que dejó de ser cierto de forma determinista, sin un modelo que opine. Hablemos San mide energía y tono de la voz con la API de audio del navegador y no finge reconocer la palabra, porque ninguna tecnología lo hace hoy con fiabilidad en español para niños de 4 a 6 años. Innmobiliaria tiene cero modelos por regla de producto. Y donde sí hay un modelo —la narración del porqué en Probeta DS, las preguntas abiertas en Nutri-Kids—, es una función opcional, con fallback determinista y verificación de que no cite una cifra que no existe.

La inteligencia artificial se incorpora cuando agrega una capacidad necesaria y demostrable, no cuando simplemente hace que la solución parezca más avanzada. Su inclusión debe estar acompañada por criterios de evaluación, límites operativos, mecanismos de observación y una definición clara de las responsabilidades que permanecen en el código y en las personas.

## Soluciones híbridas y control de la deuda tecnológica

<!-- seccion: hibridas-y-deuda -->

Esta separación permite diseñar soluciones híbridas. El código administra aquello que necesita exactitud, validación y comportamiento reproducible: los contratos, los esquemas, las transformaciones. La inteligencia artificial interviene allí donde se requiere interpretación, flexibilidad o generación. La calidad de la solución depende de asignar cada responsabilidad al mecanismo más apropiado y no de maximizar la presencia de un modelo. Es la regla que este sitio aplica a su propio chat: recuperación léxica determinista primero, y el modelo solo como capa de síntesis, intercambiable.

La Ingeniería Industrial aporta nuevamente el criterio sistémico. Antes de automatizar una actividad, necesito comprender qué función cumple, qué entradas utiliza, qué variabilidad enfrenta y qué consecuencias produce. AI-103 fortalece la dimensión de construcción de aplicaciones y agentes, mientras AI-300 aporta la disciplina necesaria para evaluar, observar y operar esas capacidades cuando dejan de ser una demostración y comienzan a utilizarse de forma sostenida.

Esta regla también controla la deuda tecnológica. Una funcionalidad generativa introduce dependencias, costos, variabilidad y necesidades de evaluación que no deben asumirse sin propósito. Velo lo vigila incluso a nivel de paquetes: un job de la integración continua audita las dependencias contra tres familias vetadas de SDK de inteligencia artificial, y una dependencia transitiva cuenta igual que una directa. La pregunta no es si puedo incorporar inteligencia artificial, sino si hacerlo mejora suficientemente la solución para justificar las nuevas responsabilidades que crea.

## Un control se demuestra fallando

<!-- seccion: controles-que-fallan -->

La segunda regla fundamental del pipeline —la regla 14— es que un control debe demostrar que puede detectar aquello para lo que fue diseñado. Una prueba que siempre aparece en verde, pero nunca ha sido observada identificando una falla real o provocada, ofrece una sensación de seguridad que todavía no ha sido validada.

Por eso, una prueba nueva debe verse fallar bajo la condición que pretende controlar y después superar esa misma condición cuando el problema ha sido corregido. Solo entonces existe evidencia de que el control responde al riesgo esperado y no simplemente de que el código puede ejecutarse sin errores visibles. Y el rojo viaja en el mismo commit que introduce el gate: el commit que trae la aserción trae también su demostración registrada en la bitácora del sprint —qué se rompió a propósito, en qué paso salió rojo y a quién nombró—. Un gate que se agrega hoy y se demuestra mañana pasa una revisión entera sin que nadie haya visto que sabe fallar, y si la demostración se aplaza, se olvida.

Esta disciplina se aplica a validaciones de datos, pruebas funcionales, accesibilidad, rendimiento, seguridad y comportamiento de componentes inteligentes. El mecanismo cambia, pero el principio permanece: un control necesita una relación demostrable con la falla que debe identificar. En este sitio, los seis gates de coherencia del contenido nacieron rojos, con su lista de ofensores contada en la bitácora, y el número de ofensores fue la medida del avance hasta que llegó a cero.

La práctica conecta directamente con mi experiencia en calidad y sistemas de gestión. Un control no existe porque haya sido documentado. Existe cuando puede demostrar que detecta, contiene o hace visible una desviación. Esta misma lógica sustenta mi trabajo actual con gobierno de datos e inteligencia artificial: cada control debe tener un propósito, una evidencia y una forma de evaluar su efectividad.

## Las tres preguntas a cada gate

<!-- seccion: las-tres-preguntas -->

Tres preguntas se le hacen a cada gate antes de darlo por bueno. La primera: ¿lo viste fallar? La segunda: ¿lo viste correr? Un job saltado no es verde. Un job que depende de otro que falló queda omitido, y la plataforma lo lista entre los requeridos sin alarma; antes de cerrar, cada verificación requerida debe tener su propia conclusión en éxito, y si una corrió por primera vez en ese pull request se dice en el resumen, porque sin histórico no puede afirmarse ni regresión ni no regresión. La tercera: ¿puede fallar siquiera? Antes de escribirlo, compruebo que existe un estado del repositorio que lo pondría en rojo y que ninguna regla anterior lo hace inalcanzable —un esquema que ya rechaza el caso, una prueba que ya lo cubre, un build que rompe antes—. Si no puede fallar, no es un gate: se retira y se anota cuál regla lo cubría. En el sprint 7 un gate nuevo resultó inalcanzable por una regla previa, y solo se supo al exigirle el rojo.

En componentes de inteligencia artificial, la regla adquiere mayor importancia porque una salida puede tener una forma convincente y ser incorrecta desde el punto de vista funcional. No basta con comprobar que el agente responde. Es necesario diseñar escenarios en los que deba reconocer información insuficiente, abstenerse de afirmar algo sin evidencia, manejar una herramienta no disponible o transferir la decisión cuando el nivel de incertidumbre supera sus límites.

También aplico esta lógica a los mecanismos de recuperación de información. No considero suficiente mostrar que una respuesta incluye citas. Debo verificar que la recuperación responda a la pregunta —con 75 preguntas propias y 136 de afuera corriendo en cada cambio de este sitio—, que cada cita conduzca a un destino que existe y que el sistema pueda declarar cuando la evidencia disponible no es suficiente.

## Esta misma página también es una aplicación

<!-- seccion: esta-misma-pagina -->

CV Viva, la plataforma desde la que se presenta este contenido, forma parte del propio portafolio. No es únicamente una página que describe proyectos externos. Es una aplicación versionada y públicamente examinable que convierte mi trayectoria, mis activos y sus evidencias en una experiencia navegable: una app en Next.js con TypeScript estricto y Tailwind, bilingüe en español e inglés, construida en 8 sprints, con pruebas automatizadas en 3 niveles —unitarias, de integración y de extremo a extremo—, accesibilidad verificada con axe en cada corrida, presupuesto de rendimiento vigilado por Lighthouse y despliegue continuo con vista previa por pull request.

El contenido se mantiene separado de la presentación y se administra mediante archivos estructurados y control de versiones: la trayectoria, los estudios, los logros, los proyectos, las certificaciones y las skills viven en un archivo YAML por idioma, validado con un esquema Zod en el build. Si el contenido está malformado, el build falla, no la página. Esta decisión permite actualizar la información sin reconstruir manualmente cada página, conservar el historial de los cambios y aplicar reglas comunes sobre fechas, secciones, proyectos y afirmaciones. Editar el archivo y hacer push actualiza a la vez la web, el PDF para sistemas de selección y el chat.

La generación estática reduce complejidad operativa y permite que una parte importante del sitio pueda consultarse sin depender de procesos permanentes en un servidor. Todo el contenido está en el HTML estático: un reclutador, un robot de selección o una descarga sin JavaScript ven la hoja de vida entera, con datos estructurados para buscadores y las etiquetas de idioma alternativo. La arquitectura busca que la experiencia sea rápida, accesible y resistente a fallas, y que las decisiones técnicas respondan al propósito real del producto. Las funcionalidades futuras se votan con un clic y sin registro, y el contador es real, sobre una base de datos con una función atómica: si la base cae, lo dice; nunca inventa un número.

## El chat, visto desde el pipeline

<!-- seccion: el-chat-desde-el-pipeline -->

La plataforma incorpora además un chat con recuperación aumentada —RAG— que responde sobre la evidencia publicada en el propio sitio. Su función no es improvisar una versión persuasiva de mi perfil, sino ayudar a recorrer la información, localizar contenidos relevantes y responder mediante referencias que puedan ser verificadas. Cómo funciona por dentro, con todos sus números, está en su propio documento; aquí va lo que el pipeline le exige.

El chat separa el modelo del conocimiento. El proveedor generativo puede cambiar —cinco están adaptados, y se elige por variable de entorno—, pero las fuentes autorizadas permanecen en el contenido versionado del sitio. Esta separación evita que la identidad profesional dependa de la memoria o de las preferencias de un modelo específico.

Cuando el proveedor generativo no está disponible, la experiencia recurre a una búsqueda local en el navegador. La degradación de la capacidad es deliberada: el usuario puede perder la síntesis generativa, pero no debe perder el acceso a la información. Esta decisión refleja un principio de arquitectura que utilizo en otros contextos: una falla parcial no debería destruir toda la función si existe una alternativa más simple capaz de preservar el propósito esencial. Y el pipeline le pone número: techo de US$20 al mes y costo real de US$0.

CV Viva demuestra, por tanto, varias capacidades al mismo tiempo: arquitectura de contenido, diseño de experiencia, generación estática, recuperación de información, integración de modelos, trazabilidad de fuentes y diseño para la degradación controlada. La aplicación no afirma que sé construir estas capacidades. Permite observarlas en funcionamiento.

También materializa la convergencia entre Ingeniería Industrial y Diseño Industrial. La primera aporta el pipeline, las reglas y la estructura que permiten mantener el sistema. La segunda aporta la experiencia mediante la cual una trayectoria extensa puede recorrerse sin convertirse en una acumulación de información difícil de comprender.

## Lo que permanece en exploración: analítica de extremo a extremo en Fabric

<!-- seccion: en-exploracion -->

El pipeline distingue claramente entre piezas terminadas y capacidades en exploración. Utilizo esta palabra de forma deliberada porque una intención, una arquitectura propuesta o un desarrollo inicial no deben presentarse con el mismo nivel de certeza que una solución publicada y verificable. Las dos exploraciones están declaradas con esa palabra en el catálogo de apps, sin fechas prometidas, y no cuentan entre las 32 piezas.

Una de las exploraciones corresponde a una solución analítica de extremo a extremo sobre Microsoft Fabric utilizando datos abiertos de Colombia. Su propósito es demostrar públicamente el recorrido completo desde la ingestión y el almacenamiento en un lakehouse hasta el modelo semántico y la experiencia en Power BI embebido.

La pieza busca hacer verificable la especialidad formalizada mediante DP-600. No se limitará a presentar un tablero final. Deberá demostrar cómo se obtuvieron los datos, cómo se organizaron, qué transformaciones fueron aplicadas, cómo se estructuró el modelo semántico y qué decisiones de seguridad, gobierno y rendimiento sostienen la solución. Los seis tableros ya publicados no usan Fabric —son piezas de escritorio publicadas como proyecto versionado—, y esa es exactamente la brecha que esta exploración cubre en público: lo que sí monté de extremo a extremo sobre Fabric fue en un empleo, y eso no se puede enseñar.

Esta exploración también permitirá demostrar la diferencia entre construir un reporte y desarrollar un producto analítico empresarial. El valor no estará únicamente en la visualización, sino en la reproducibilidad del pipeline, la claridad del modelo, la trazabilidad de las medidas y la posibilidad de ampliar la solución sin reconstruirla desde el inicio.

## Lo que permanece en exploración: un agente sobre Gemini y Vertex AI

<!-- seccion: exploracion-gemini-vertex -->

La segunda exploración corresponde a un agente autónomo con herramientas, construido sobre Gemini y Vertex AI con LangChain. Su propósito es ampliar mi experiencia hacia una arquitectura diferente del ecosistema Microsoft y comprender de manera práctica sus modelos, herramientas, patrones de despliegue y mecanismos de operación. Es el complemento multi-nube de mi ruta de certificación en Azure, donde AI-103 y AI-300 están en curso.

No presento esta exploración como evidencia de una experiencia profunda en Google Cloud. Mi experiencia principal se encuentra en tecnologías Microsoft, y Google Cloud figura en mis skills como «en exploración», sin horizonte comprometido y sin uso real todavía de sus servicios de datos ni de Vertex AI. Precisamente por eso elegí construir una pieza verificable en lugar de agregar nombres de herramientas a una lista. El objetivo es transformar una brecha reconocida en una capacidad demostrable.

La exploración multi-nube no busca duplicar exactamente una solución existente. Busca identificar qué principios permanecen y qué decisiones cambian cuando la misma clase de problema se aborda mediante otro ecosistema. La arquitectura de agentes conserva necesidades como contexto, herramientas, evaluación, observabilidad, seguridad y gobierno, aunque los servicios y patrones concretos sean diferentes.

En ambos casos, la condición de salida de la exploración debe estar definida antes de comenzar. Una pieza no abandona este estado por contar con una interfaz funcional o una demostración convincente. Debe tener un propósito verificable, una arquitectura documentada, fuentes y dependencias identificadas, pruebas ejecutadas, criterios de calidad satisfechos, un despliegue reproducible y una ficha que diferencie claramente los resultados medidos de las expectativas todavía no comprobadas. Solo entonces puede incorporarse al inventario de piezas construidas, y el contador de la vitrina se mueve solo cuando entra su ficha, no cuando lo anuncio.

## Lo que el pipeline demuestra sobre mi forma de trabajar

<!-- seccion: lo-que-demuestra-el-pipeline -->

El valor del pipeline no se encuentra únicamente en la cantidad de piezas que ha producido. Se encuentra en la forma de trabajo que hace posible construirlas y someterlas a un estándar común: los seis estándares más uno —pruebas, integración y despliegue continuos, observabilidad, seguridad, rendimiento, experiencia y accesibilidad, e inteligencia artificial embebida responsable— que se prueban en la integración continua de cada app, no se sugieren.

Cada iniciativa comienza con una prioridad y una visión. Cada funcionalidad necesita una razón. Cada cifra debe declarar su procedencia. Cada control debe demostrar que detecta una falla. Cada ciclo debe dejar memoria. Cada capacidad generativa debe justificar por qué el código convencional no es suficiente. Cada pieza debe distinguir con claridad entre lo construido, lo medido, lo inferido y lo que todavía permanece en exploración.

Esta disciplina conecta directamente con mi trayectoria profesional. La Ingeniería Industrial aporta la estructura del proceso, la medición, la gestión de restricciones y la mejora continua. El Diseño Industrial mantiene visible la promesa para el usuario y obliga a convertir la complejidad en una experiencia comprensible. La ciencia de datos proporciona los métodos para aprender de la información. DP-600 aporta la plataforma analítica y los modelos semánticos. AI-103 fortalece la construcción de aplicaciones y agentes. AI-300 amplía la capacidad para evaluarlos y operarlos de manera confiable.

El pipeline también demuestra que no entiendo la inteligencia artificial como un sustituto indiscriminado del trabajo profesional. La utilizo como parte de un sistema gobernado, donde las decisiones de propósito, prioridad, aceptación y riesgo permanecen explícitas. El agente acelera y organiza, pero no elimina la responsabilidad sobre el resultado.

Construir mediante este sistema me permite transformar cada proyecto en algo más que un entregable. Cada pieza deja decisiones, componentes, pruebas, patrones y aprendizajes que reducen la incertidumbre de la siguiente. El portafolio crece no solo en cantidad, sino también en memoria, consistencia y capacidad acumulada: 24 sprints cerrados en el pipeline, 21 decisiones registradas solo en este sitio.

Esa es la afirmación principal que el pipeline permite demostrar: no construyo aplicaciones, agentes, investigaciones y tableros como ejercicios aislados. Construyo una arquitectura de trabajo capaz de convertir problemas en productos verificables, distinguir con rigor entre intención y resultado, aprender de cada ciclo y elevar progresivamente el estándar con el que abordo el siguiente.
