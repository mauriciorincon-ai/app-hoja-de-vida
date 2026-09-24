---
slug: cafam
codigo: AF-06
titulo: "Cafam — el WMS y el equipo de 20 (2020–2021)"
resumen: "La implementación de Oracle WMS Cloud en un centro de distribución de medicamentos: 20 personas en pruebas durante seis meses, el BI de control, las integraciones en VBA y la calidad del dato en SQL."
cuando_usar: "Úsalo cuando pregunten por Cafam (2020–2021): la implementación de un sistema de gestión de bodega (Oracle WMS Cloud) en un centro de distribución de medicamentos, el equipo más grande que ha liderado (20 personas), integraciones en VBA, calidad de datos en SQL y simulación con FlexSim."
estado: aprobado
ancla: "/proyectos/cafam"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué hizo Henry en Cafam?"
  - "¿Cuál es el equipo más grande que ha liderado?"
  - "¿Ha participado en la implementación de un WMS?"
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

<!-- guía (viene del esqueleto de la historia, S3 — la escribió el dueño):
La historia detrás del case study: cómo fue liderar el equipo más
grande de tu carrera, qué salió mal y cómo lo resolviste, detalles de las
integraciones VBA y el BI de control que no caben en la página. -->

## El contexto: cambiar el sistema que mueve la bodega

<!-- seccion: el-contexto -->

Ingresé a Cafam en octubre de 2020 como Analista de Sistemas de Información y de Proyectos y permanecí en la organización hasta junio de 2021. Mi responsabilidad se concentró en la implementación de un WMS —un sistema de gestión de almacenes, en este caso Oracle WMS Cloud— para la operación de distribución de medicamentos de la caja de compensación: un entorno en el que la continuidad, la precisión y la trazabilidad de la información tenían consecuencias directas sobre el funcionamiento del centro de distribución y, detrás de cada pedido, sobre una persona que esperaba su medicamento.

Cambiar el sistema que gobierna una bodega es una de las intervenciones más delicadas que pueden realizarse en una operación logística. El WMS debe representar con precisión qué productos existen, dónde están ubicados, en qué cantidades se encuentran, qué movimientos han realizado y en qué estado se encuentran dentro del flujo, y debe hacerlo mientras la operación sigue despachando. Un error de datos no permanece en una pantalla: se materializa inmediatamente en inventario que no aparece, ubicaciones incorrectas, movimientos inconsistentes, retrasos, reprocesos o dificultades para atender oportunamente una solicitud.

El desafío no consistía únicamente en instalar una nueva aplicación. Era necesario demostrar que el sistema podía interpretar correctamente la operación, ejecutar sus reglas, integrarse con otros componentes y conservar la consistencia de la información a lo largo de cada movimiento. También era necesario identificar dónde el proceso debía ajustarse para aprovechar las capacidades de la plataforma y dónde el software necesitaba parametrizarse para reflejar adecuadamente la realidad operativa.

Esta experiencia me permitió comprender que implementar una plataforma empresarial exige intervenir simultáneamente procesos, datos, tecnología y formas de trabajo. Si uno de estos elementos cambia mientras los demás permanecen intactos, la solución difícilmente alcanza su propósito. La implementación debía lograr coherencia entre lo que la operación necesitaba, lo que el sistema podía representar y lo que las personas debían hacer para sostenerlo.

## Antes de probar: el proceso en BPMN con Bizagi y la simulación en FlexSim

<!-- seccion: proceso-bpmn-y-simulacion -->

Antes de ejecutar una sola prueba necesitaba un mapa compartido de la operación. Modelé el proceso del centro de distribución en BPMN con Bizagi —recepción, almacenamiento, alistamiento y despacho—, porque una implementación se prueba contra un proceso escrito, no contra la memoria de quien lleva más años en la bodega. El diagrama permitía contrastar la operación logística real con el comportamiento que el WMS iba a imponer y hacía visibles las decisiones informales que ningún manual recogía.

Sobre ese proceso construí además un modelo de simulación de eventos discretos en FlexSim del despacho de medicamentos. Su propósito era entender dónde una regla del nuevo sistema podía crear una cola que hasta entonces no existía: un control adicional en el alistamiento, una validación en la salida o una ubicación que obligara a un recorrido más largo. La simulación no reemplazó las pruebas con el sistema real; sirvió para llegar a ellas sabiendo qué escenarios merecían prioridad y qué partes del flujo eran más sensibles a un cambio de regla.

Aquí se nota el ingeniero industrial que llegó a Cafam en octubre de 2020: primero el proceso, después el sistema. Esta misma combinación —BPMN con Bizagi para el proceso y simulación cuando el flujo lo amerita— la había usado en Inglopres y la volvería a usar después, y su historia completa está en el documento de procesos y simulación.

## El equipo de veinte: el más grande que he liderado

<!-- seccion: el-equipo-de-veinte -->

Lideré un equipo mixto de veinte personas durante la fase de pruebas: catorce integrantes de Cafam y seis profesionales de Oracle, organización que acababa de comprar el producto y lo estaba implantando con sus propios especialistas. Sigue siendo el equipo más grande que he liderado. Esta combinación reunía dos conocimientos indispensables. El equipo interno comprendía la operación, sus restricciones y excepciones, mientras que el equipo del proveedor aportaba el conocimiento técnico y funcional necesario para analizar el comportamiento de la plataforma.

La fase de pruebas tuvo una duración aproximada de seis meses, dentro de los nueve que duró mi paso por Cafam. No se trató de una validación puntual antes de la salida a producción, sino de un proceso sostenido para verificar funcionalidades, reglas, datos, recorridos operativos, integraciones y condiciones de excepción. Cada ciclo permitía descubrir diferencias entre el comportamiento esperado y el comportamiento observado, documentarlas y convertirlas en decisiones de ajuste.

La duración de esta fase permitió superar la validación de escenarios ideales y observar también excepciones, reincidencias y comportamientos que solo se hacen visibles cuando el sistema se somete de manera sostenida a la diversidad de la operación real. Un WMS que responde bien a un pedido típico puede fallar frente a un medicamento con lote y fecha de vencimiento, una devolución parcial o una ubicación que cambió de uso a mitad de semana; esas situaciones solo aparecen cuando las pruebas duran lo suficiente para encontrarlas.

Con ese tamaño de equipo, el principal reto no era solamente distribuir casos de prueba. Era asegurar cobertura, evitar duplicidades, mantener consistencia en la ejecución y hacer visible qué partes del sistema habían sido validadas, cuáles permanecían pendientes y dónde existían bloqueos. El resultado debía ofrecer una visión confiable del estado de la implementación, no una acumulación de pruebas individuales difíciles de interpretar.

## Coordinar un equipo mixto: traducir entre la operación y el proveedor

<!-- seccion: coordinar-equipo-mixto -->

Coordinar un equipo de catorce personas de Cafam y seis de Oracle requería construir un lenguaje común entre la operación y la tecnología. Una situación descrita por el usuario como un problema de inventario debía traducirse en un escenario reproducible, con entradas conocidas, pasos definidos, resultados esperados y evidencia suficiente para que el equipo técnico pudiera analizarla y decidir si era una falla del sistema, un dato mal cargado o una regla del proceso que nadie había escrito. De manera inversa, una explicación sobre parámetros o restricciones del sistema debía convertirse en implicaciones comprensibles para quienes ejecutaban el proceso.

La colaboración también debía producir transferencia de conocimiento. El objetivo no era que el proveedor resolviera cada hallazgo de manera aislada, sino que el equipo interno comprendiera progresivamente la lógica del sistema, sus parámetros, sus límites y las consecuencias de cada configuración. Una implementación sostenible requiere que la organización desarrolle la capacidad de operar, diagnosticar y evolucionar la solución sin depender permanentemente de quienes participaron en su instalación; el proveedor terminaría su implantación y las catorce personas de Cafam se quedarían operando el WMS.

La coordinación del equipo contribuyó a reducir los errores en un veinticinco por ciento y a mejorar la eficiencia operativa en un quince por ciento. Las dos cifras se midieron sobre la exactitud de registro de inventario (ERI): la proporción de posiciones cuyo saldo en el sistema coincide con lo que hay físicamente en la ubicación. Estos resultados no surgieron de aumentar la supervisión, sino de estructurar mejor el trabajo, establecer criterios claros, hacer visible el avance y conectar cada hallazgo con una acción verificable.

Esta experiencia fortaleció mi manera de liderar equipos multidisciplinarios. Aprendí que la colaboración entre negocio y tecnología no se consigue únicamente reuniendo perfiles diferentes. Requiere establecer definiciones compartidas, mecanismos de traducción, responsabilidades explícitas y una forma común de reconocer cuándo un resultado está realmente terminado.

## De las pruebas al ajuste del proceso y la parametrización

<!-- seccion: pruebas-y-parametrizacion -->

Una vez concluida la fase principal de pruebas en Cafam, el trabajo avanzó hacia el ajuste de los procesos y la parametrización de Oracle WMS Cloud: configurar el sistema sin modificar su código, que es distinto de personalizarlo. Los hallazgos obtenidos durante los seis meses de validación permitieron identificar qué diferencias podían resolverse mediante configuración, cuáles exigían modificar el proceso y cuáles requerían una intervención técnica adicional del proveedor.

Durante esta transición, el criterio principal no era únicamente comprobar que la nueva plataforma funcionara, sino proteger la continuidad de una operación crítica. Cada ajuste debía evaluarse por su efecto sobre el inventario, el flujo de materiales, la trazabilidad y la capacidad del centro de distribución para mantener el servicio. Esta experiencia me enseñó que una transformación tecnológica bien ejecutada no se mide solo por la puesta en producción, sino por la capacidad de cambiar sin perder el control de aquello que la organización no puede permitirse interrumpir.

Esta distinción era fundamental. No todas las diferencias entre el sistema y la operación representaban una falla del software. En algunos casos, la plataforma hacía visible una regla ambigua o un procedimiento que dependía de decisiones informales. En otros, el proceso institucional contenía una necesidad legítima que el sistema no representaba adecuadamente. La implementación exigía analizar cada caso y evitar dos extremos igualmente problemáticos: forzar toda la operación a adaptarse al software o modificar la plataforma para reproducir prácticas que también necesitaban evolucionar.

La parametrización se convirtió en el punto de encuentro entre el diseño del sistema y la realidad del negocio. Cada ajuste definía cómo debía comportarse la solución frente a determinadas entidades, estados, reglas y excepciones. Una configuración aparentemente pequeña podía modificar la forma en que se registraba un movimiento, se validaba un dato o se distribuía una responsabilidad dentro de la operación. El modelo en BPMN de la etapa anterior servía aquí como referencia: cada parámetro se leía contra la actividad del proceso a la que afectaba.

## Lo que enseñan las pruebas: descubrir el sistema y el proceso a la vez

<!-- seccion: lo-que-ensenan-las-pruebas -->

Esta etapa en Cafam reforzó mi comprensión de que las pruebas no son una actividad posterior al desarrollo. Son un mecanismo para descubrir conocimiento sobre el sistema y sobre el proceso que lo utiliza. Probar permite verificar una funcionalidad, pero también cuestionar supuestos, revelar dependencias y determinar si la solución responde correctamente ante la variabilidad de la operación real. Seis meses de pruebas con veinte personas producen algo más valioso que una lista de defectos: producen una descripción de cómo funciona de verdad la bodega, que antes no existía escrita en ningún sitio.

Actualmente aplico este mismo principio en soluciones analíticas, aplicaciones y agentes de inteligencia artificial. Una demostración exitosa no equivale a una capacidad preparada para producción. Es necesario evaluar casos representativos, excepciones, condiciones límite, calidad de los resultados, comportamiento de las integraciones y situaciones que requieren intervención humana. La tecnología cambia, pero permanece la disciplina de convertir expectativas en criterios verificables y evidencia reproducible.

Hay una continuidad directa entre el escenario de prueba de un WMS —entradas conocidas, pasos definidos, resultado esperado— y la definición de terminado que años después exigiría para cada agente en Vesting, o las pruebas automatizadas con las que hoy se construyen mis aplicaciones. El objeto cambia; el hábito de no dar por terminado lo que no se ha visto fallar y corregir es el mismo.

## El BI de control de la implementación

<!-- seccion: el-bi-de-control -->

Diseñé informes de inteligencia de negocios y tableros interactivos para controlar la propia implementación. Estas soluciones mejoraron en un 50 % la precisión del seguimiento de las pruebas y fueron adoptadas por más de 15 usuarios involucrados en el proyecto: el director de medicamentos, el director de TI, el director del proyecto, el director del centro de distribución y los coordinadores y jefes del centro de distribución. Eran las personas que tenían que decidir sobre el avance, no un público general.

El tablero más valioso no estaba dedicado a describir la operación habitual del centro de distribución, sino a observar el avance de la transformación mientras ocurría. Permitía conocer los escenarios ejecutados, la cobertura alcanzada, los resultados obtenidos, los defectos encontrados, los responsables de atenderlos y los casos que debían probarse nuevamente después de un ajuste.

Esta experiencia me enseñó que un proyecto tecnológico también debe instrumentarse. No basta con establecer un cronograma y esperar hasta el final para conocer el resultado. La implementación necesita sus propios indicadores, eventos y mecanismos de observación. Cuando el avance, los bloqueos, la calidad y las dependencias se vuelven visibles, el equipo puede actuar antes de que una desviación comprometa la fecha o el resultado esperado. Un proyecto que se gobierna con evidencia diaria se gobierna distinto de uno que se gobierna con la sensación de avance.

También confirmé que la adopción debe diseñarse. Los directores y coordinadores incorporaron los tableros porque respondían a necesidades concretas de coordinación y porque reducían el esfuerzo necesario para comprender el estado del proyecto. El valor no provenía de publicar más reportes, sino de ofrecer una visión común que permitiera priorizar, asignar responsabilidades y decidir con mayor oportunidad.

## Los indicadores del pipeline de pruebas

<!-- seccion: indicadores-del-pipeline-de-pruebas -->

Los indicadores funcionaban como medidores distribuidos a lo largo del pipeline de pruebas. No era suficiente contar cuántos casos se habían ejecutado. También era necesario observar su cobertura, estado, criticidad, tasa de aprobación, reincidencia, tiempo de resolución y relación con los ajustes del sistema. Una cifra general podía sugerir avance mientras permanecían sin validar escenarios esenciales para la continuidad de la operación: podía tenerse la mayoría de los casos aprobados y, al mismo tiempo, ninguno de los que tocaban el despacho de medicamentos con control de lote.

Por eso cada hallazgo se relacionaba con la parte del proceso que afectaba y con la decisión de parametrización que lo resolvía. Un defecto reincidente en la misma actividad decía más sobre el estado real del WMS que veinte casos nuevos aprobados en actividades ya estables, y el tablero tenía que dejar ver esa diferencia sin obligar a nadie a leer un listado de pruebas.

Esta fue una etapa importante en mi evolución hacia el diseño de modelos semánticos y soluciones avanzadas en Power BI. Comprendí que una experiencia analítica confiable necesita definiciones compartidas, relaciones consistentes, medidas verificables y la posibilidad de recorrer un resultado agregado hasta los registros que lo sustentan. La visualización hacía visible el proyecto, pero el verdadero valor se encontraba en la estructura de información que permitía interpretarlo correctamente. Cómo se diseña un tablero para que lo usen quienes deciden, con las tres experiencias de adopción comparadas, está en el documento de BI que se adopta.

## Las integraciones en VBA

<!-- seccion: integraciones-vba -->

Desarrollé aplicaciones en Visual Basic para Aplicaciones (VBA) destinadas a integrar actividades del centro de distribución con el sistema de gestión de almacenes: cargas de datos que antes dependían de manipulación manual pasaron a aplicar reglas de forma repetible. Estas soluciones incrementaron la automatización en un quince por ciento y contribuyeron a reducir los errores de datos en un cincuenta por ciento.

La elección de VBA respondió al contexto tecnológico y operativo disponible en Cafam. Era una herramienta accesible para la organización, compatible con los recursos utilizados por los equipos y suficientemente flexible para resolver brechas que podían afectar la continuidad del proceso. La calidad de una solución no depende de la novedad de la tecnología, sino de su adecuación al problema, de la posibilidad de mantenerla y del resultado que produce.

Estas aplicaciones permitieron estructurar actividades que anteriormente dependían de manipulación manual, aplicar reglas de forma repetible y reducir errores en el intercambio de información. Sin embargo, su propósito no era mantener indefinidamente una arquitectura paralela al WMS. Funcionaban como mecanismos de integración y continuidad mientras el proceso y la plataforma alcanzaban un mayor nivel de ajuste. Siguieron corriendo después de la salida a producción, como piezas periféricas conocidas, con dueño y con límite: cada una sabía qué actividad cubría, de qué datos dependía y qué pasaría el día en que el WMS asumiera esa función.

## El valor y los límites de las soluciones periféricas

<!-- seccion: soluciones-perifericas -->

La experiencia con las VBA de Cafam me enseñó a reconocer el valor y también los límites de las soluciones periféricas. Una automatización local puede resolver una necesidad urgente, pero debe diseñarse comprendiendo su relación con el sistema central, sus dependencias y el riesgo de convertirse en un componente crítico sin suficiente gobierno. Resolver el problema inmediato no debe impedir la evolución posterior de la arquitectura.

Ese criterio permanece vigente en mi trabajo actual. Una aplicación o un agente de inteligencia artificial puede integrarse rápidamente para resolver una necesidad concreta, pero debe operar dentro de una arquitectura comprensible, con fuentes autorizadas, responsabilidades definidas, monitoreo y una estrategia para su evolución. La velocidad de implementación no puede alcanzarse a costa de crear nuevas dependencias invisibles.

La regla que me quedó de 2021 cabe en tres condiciones: una pieza periférica es aceptable si se sabe quién la mantiene, si está documentado de qué depende y si tiene una fecha o una condición de retiro. Cuando falta cualquiera de las tres, la pieza deja de ser un puente y se convierte en un sistema paralelo que nadie gobierna.

## La calidad del dato, en SQL

<!-- seccion: calidad-en-sql -->

Supervisé mediante SQL la calidad de datos de la información que circulaba entre diferentes sistemas, contribuyendo a mejorar en un veinte por ciento la precisión y confiabilidad de la información utilizada por el sistema de gestión de almacenes, medida también como exactitud de registro de inventario. Como herramienta complementaria de análisis usé SAS.

La parte más compleja no se encontraba necesariamente dentro de una aplicación, sino en las fronteras entre ellas. Dos sistemas podían funcionar correctamente de manera independiente y aun así producir inconsistencias cuando intercambiaban identificadores, estados, cantidades, fechas o reglas interpretadas de forma diferente. La integración hacía visibles esas diferencias y convertía la calidad del dato en una responsabilidad transversal.

SQL me permitió recorrer la información, contrastar fuentes, identificar registros faltantes, detectar duplicidades, verificar relaciones y localizar diferencias entre el estado esperado y el observado. El objetivo no era corregir cifras al final del pipeline, sino comprender dónde se originaba la inconsistencia y qué control podía evitar su repetición. Una consulta que cruzaba el saldo del WMS con el del sistema de origen por medicamento y ubicación decía, en minutos, en qué frontera entre sistemas estaba la diferencia.

## La validación 80-20 por medicamentos

<!-- seccion: validacion-80-20 -->

El método de conciliación fue de ingeniería industrial: validación por medicamentos con criterio 80-20. Se tomaron los medicamentos principales —los que concentraban la mayor parte del volumen— y se compararon uno a uno entre el WMS y el sistema de origen. Al principio ninguno coincidía: cantidades, ubicaciones y estados diferían entre un sistema y otro.

En lugar de intentar cuadrar todo el catálogo a la vez, se fue ajustando de a poco, priorizando esos medicamentos de mayor rotación. Cada diferencia resuelta en uno de ellos enseñaba una regla que solía explicar diferencias en muchos otros, y las consultas SQL que la detectaban quedaban como control permanente. Así la conciliación dejó de ser un cierre de proyecto y se convirtió en una revisión permanente: una rutina que volvía a comparar periódicamente los mismos medicamentos y hacía visible cualquier desviación nueva.

Esa fue, en la práctica, la respuesta a «qué salió mal y cómo se resolvió» en Cafam: no un incidente único, sino un inventario que al arrancar no cuadraba en ninguno de sus productos principales y que se llevó a coincidir por prioridad de volumen, con evidencia en SQL en cada paso.

## Qué es la calidad de un dato: lo que Cafam me enseñó

<!-- seccion: que-es-la-calidad-del-dato -->

En Cafam profundicé en una idea que hoy es central en mi trabajo con plataformas de datos y modelos semánticos: la calidad no es una propiedad abstracta ni uniforme. Un dato puede ser válido en su formato y, al mismo tiempo, no ser suficientemente oportuno, completo o consistente para una decisión específica. Evaluar la calidad exige comprender el propósito de la información y el proceso que depende de ella. Un saldo de inventario correcto al inicio del turno y desactualizado unas horas después sigue siendo un dato válido y, para el despacho de ese día, es un dato inútil.

También comprendí que los controles de calidad deben formar parte del pipeline y no quedar limitados a revisiones manuales posteriores. Las validaciones más valiosas son aquellas que permiten detectar el problema cerca de su origen, conservar evidencia de la desviación y evitar que el error continúe hacia reportes, decisiones o movimientos operativos. Las consultas SQL de la conciliación 80-20 eran exactamente eso: controles que corrían antes de que el dato llegara a una decisión.

Este principio adquiere todavía más importancia en las soluciones de inteligencia artificial. Un modelo o un agente puede procesar información con gran velocidad, pero no puede compensar de manera confiable datos descontextualizados, contradictorios o incompletos. La inteligencia artificial amplifica la utilidad de una arquitectura bien gobernada, pero también puede amplificar sus deficiencias. Por eso, la calidad, la procedencia y los controles de acceso deben diseñarse antes de conceder a una solución la capacidad de recomendar o actuar.

## Los resultados de Cafam en cifras

<!-- seccion: resultados-en-cifras -->

Las cifras del proyecto, tal como las publica mi hoja de vida y el case study del sitio, con lo que cada una medía:

| Frente                                   | Resultado                                          | Qué medía                                                            |
| ---------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| Pruebas de implementación del WMS        | −25 % de errores · +15 % de eficiencia operativa   | exactitud de registro de inventario (ERI) antes y después            |
| BI de control de la implementación       | +50 % de precisión en el seguimiento · 15+ usuarios | escenarios, cobertura, defectos y reincidencias visibles a diario    |
| Integraciones en VBA con el WMS          | +15 % de automatización · −50 % de errores de datos | cargas manuales sustituidas y errores en el intercambio de información |
| Calidad de datos en SQL                  | +20 % de precisión y confiabilidad                 | conciliación 80-20 por medicamentos entre el WMS y el sistema de origen |

El equipo fue de veinte personas —catorce de Cafam y seis del proveedor— durante unos seis meses de pruebas, entre octubre de 2020 y junio de 2021. Ninguna de estas cifras vino de aumentar la supervisión: vinieron de un proceso escrito, escenarios reproducibles, avance visible y controles de calidad que corrían dentro del pipeline y no al final.

## Lo que Cafam consolidó

<!-- seccion: lo-que-cafam-consolido -->

Vista en retrospectiva, Cafam fue la experiencia en la que integré de manera más directa procesos, aplicaciones empresariales, datos, pruebas, automatización y liderazgo multidisciplinario. Coordiné durante aproximadamente seis meses un equipo mixto de veinte personas, instrumenté el avance mediante inteligencia de negocios, desarrollé soluciones de integración y utilicé SQL para proteger la calidad de la información entre sistemas.

También aprendí que una implementación empresarial no es una entrega puntual. Es un proceso de aprendizaje en el que la organización descubre simultáneamente las capacidades del software y las ambigüedades de su propia operación. Probar, parametrizar y ajustar no son etapas aisladas, sino ciclos mediante los cuales tecnología y proceso se aproximan hasta construir una forma de trabajo viable.

Esta experiencia fortaleció mi capacidad para traducir entre negocio y tecnología. Aprendí a convertir necesidades operativas en escenarios verificables, reglas del proceso en comportamientos esperados del sistema, hallazgos en decisiones de parametrización y resultados técnicos en información comprensible para los responsables de la operación. También aprendí a recorrer el camino inverso: explicar las capacidades, restricciones y dependencias de la plataforma en términos de sus efectos sobre el inventario, la trazabilidad, la continuidad y la calidad del servicio.

Esa capacidad de traducción se convirtió posteriormente en un elemento esencial de mi trabajo con plataformas analíticas, modelos semánticos, aplicaciones inteligentes y agentes de IA. Una solución empresarial solo puede responder correctamente a una necesidad cuando el conocimiento del negocio logra transformarse en datos, reglas, controles y criterios verificables que la tecnología pueda representar, ejecutar y evaluar.

La convivencia entre el WMS, otros sistemas, automatizaciones y procedimientos auxiliares también despertó mi interés por una pregunta que continúa vigente en mi trabajo: cómo transformar una plataforma empresarial sin intentar reemplazar simultáneamente todas sus capacidades. Comprendí que el orden de intervención debe responder al valor, el riesgo, las dependencias y el nivel de acoplamiento de cada componente. Modernizar no consiste en sustituirlo todo de una vez, sino en diseñar una transición que preserve la continuidad mientras reduce progresivamente la complejidad; y las piezas periféricas —conocidas, con dueño y con condición de retiro— son parte del diseño, no un accidente.
