---
slug: los-tableros
titulo: "Los tableros: datos públicos, verificados"
resumen: "Los seis tableros que publiqué sobre datos abiertos, y el rigor con que se construyen."
estado: borrador
ancla: "/vitrina/tableros"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué tableros ha publicado Henry?"
  - "¿Cómo verifica Henry que los datos de un tablero son correctos?"
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

## Qué son y por qué existen

<!-- seccion: que-son -->

He construido desde cero seis tableros analíticos sobre fuentes de datos públicas y los he publicado en la vitrina de este sitio con sus respectivas fichas técnicas. Cada uno aborda un universo diferente, pero todos siguen el mismo principio: los datos deben poder rastrearse hasta su origen, el modelo debe superar controles verificables y la visualización debe comunicar con claridad tanto sus resultados como sus límites.

No los concibo como ejercicios de diseño ni como demostraciones aisladas de Power BI. Cada tablero representa un producto analítico completo que comienza con la identificación y evaluación de las fuentes, continúa con la limpieza, integración y transformación de los datos, y termina en un modelo semántico capaz de sostener indicadores, comparaciones y recorridos de análisis.

La diferencia entre una visualización y un producto analítico se encuentra en todo aquello que ocurre antes de la primera pantalla. Una gráfica puede construirse sobre una tabla preparada manualmente y producir una impresión convincente. Un producto analítico necesita conservar la procedencia, documentar sus transformaciones, comprobar sus relaciones y demostrar que los resultados presentados continúan siendo consistentes con el universo de origen.

Estos tableros existen por la misma razón que mis aplicaciones, agentes e investigaciones: un currículum afirma; una pieza publicada permite verificar. Decir que tengo experiencia en ingeniería de datos, modelos semánticos y Power BI comunica una capacidad. Publicar un tablero cuyas cifras pueden contrastarse con las fuentes demuestra cómo aplico esa capacidad.

El carácter público de los datos introduce una exigencia adicional. Cualquier persona puede descargar las fuentes, reproducir los cálculos y cuestionar las decisiones de modelado. Esa posibilidad no debilita las piezas. Es precisamente lo que les concede valor como evidencia profesional.

También me obliga a diferenciar con claridad entre aquello que los datos muestran y aquello que no permiten concluir. Una fuente pública puede tener una gran cobertura y conservar limitaciones metodológicas, temporales o conceptuales. El tablero no debe eliminar esas limitaciones para producir una narrativa más atractiva. Debe hacerlas visibles para que el usuario comprenda el alcance real de sus conclusiones.

Los seis tableros constituyen, por tanto, una demostración pública de un método: obtener datos, comprender su estructura, reconstruir sus relaciones, verificar sus identidades, modelar su significado y convertirlos en una experiencia de análisis que pueda ser examinada por otras personas.

## Los seis universos analíticos

<!-- seccion: los-seis -->

El primer tablero, Banca colombiana bajo la lupa, integra once años de estados financieros correspondientes a ochenta y una entidades de crédito. La pieza permite analizar la evolución del sector, comparar instituciones y recorrer las relaciones entre las principales estructuras contables.

El reto no consistía únicamente en acumular periodos y entidades. Era necesario conservar la correspondencia entre cuentas, instituciones y cortes, y verificar que la integración no hubiera duplicado, omitido o desalineado registros. Las identidades contables proporcionaron el mecanismo para comprobar que el modelo seguía representando correctamente la información publicada por el origen.

El segundo tablero, Las empresas de Colombia en cifras, estudia ocho años de estados financieros de cerca de cuarenta mil sociedades. La escala introduce desafíos de estandarización, comparabilidad, cobertura y calidad que no aparecen en una muestra pequeña.

Además de presentar indicadores financieros, esta pieza mide cuánto del universo disponible se encuentra realmente cubierto. La cobertura forma parte del resultado porque una conclusión sobre las empresas colombianas necesita reconocer qué organizaciones, periodos y condiciones están representados y cuáles quedan por fuera.

El tercer tablero, Tasas, inflación y deuda: el ciclo monetario, integra veintisiete años de información para cuarenta y una áreas económicas a partir de siete organismos. Su propósito es permitir el análisis conjunto de variables monetarias y macroeconómicas que normalmente se publican con estructuras, frecuencias y convenciones diferentes.

La integración exigía armonizar fechas, unidades, periodicidades e identificadores. También incluía contrastar par a par dos fuentes oficiales de la curva estadounidense para comprobar que la representación utilizada fuera consistente y para hacer visibles las diferencias cuando aparecieran.

El cuarto tablero, ¿En qué gasta el Estado colombiano y con quién?, relaciona aproximadamente cuatro millones de contratos públicos con ocho años de información presupuestal. Su propósito es conectar dos perspectivas que suelen analizarse por separado: los recursos aprobados y su materialización mediante procesos de contratación.

La cifra de control fue contrastada con el presupuesto aprobado por el Congreso. Esta comparación no demuestra por sí sola que cada relación entre presupuesto y contratación pueda establecerse de forma directa, pero sí proporciona un punto de referencia externo para evaluar la consistencia del universo incorporado.

El quinto tablero, Energía y clima, integra siete fuentes abiertas para analizar cómo se genera la electricidad en diferentes regiones y cómo evoluciona la temperatura del planeta. La pieza conecta fenómenos relacionados, pero evita presentar su coexistencia como evidencia automática de causalidad.

En este tablero, publicar los límites resulta tan importante como presentar los resultados. Las fuentes pueden utilizar metodologías, coberturas y frecuencias distintas. La visualización debe facilitar la comparación sin ocultar las diferencias que condicionan la interpretación.

El sexto tablero, Fórmula 1: setenta y siete temporadas contadas bien, reconstruye el comportamiento histórico del campeonato y verifica sus resultados mediante veinte identidades publicadas por el propio origen.

La pieza demuestra que el rigor no depende de la formalidad del sector. Los datos deportivos también contienen cambios históricos, reglas, excepciones, relaciones y totales que deben conservarse correctamente. Tres de las identidades no cerraron durante las primeras validaciones, lo que permitió detectar problemas reales en los datos de origen o en su interpretación inicial.

Aunque los seis tableros pertenecen a dominios muy distintos, todos exigen las mismas capacidades fundamentales: comprender las fuentes, establecer una unidad de análisis, conservar granularidad, crear relaciones, definir medidas, verificar resultados y diseñar una experiencia que no exceda la evidencia disponible.

## El stack: Power BI y Microsoft Fabric como núcleo

<!-- seccion: el-stack -->

Los primeros tableros se construyeron principalmente en Power BI, utilizando sus capacidades de preparación, modelado semántico, DAX, visualización y navegación analítica. A medida que las piezas y mi arquitectura profesional evolucionaron, el stack comenzó a integrarse con Microsoft Fabric para ampliar la capacidad de ingestión, almacenamiento, transformación, gobierno y reutilización de los datos.

Power BI continúa siendo la capa principal de experiencia y decisión. Es el lugar donde el modelo semántico se convierte en indicadores, comparaciones, jerarquías y recorridos comprensibles para el usuario. Sin embargo, no lo considero una herramienta aislada ni el punto de inicio de la solución.

Microsoft Fabric permite extender el recorrido hacia una plataforma analítica más completa. Los datos pueden ingresar mediante pipelines, organizarse en lakehouses o warehouses, transformarse bajo reglas reproducibles y ponerse a disposición de modelos semánticos que sirven a diferentes experiencias de consumo.

Esta integración reduce la dependencia de archivos y transformaciones encerradas dentro de un único reporte. También permite que la información preparada pueda reutilizarse por otros tableros, aplicaciones, procesos analíticos o soluciones de inteligencia artificial sin reconstruir su significado desde el comienzo.

DP-600 formaliza precisamente esta profundidad. La certificación valida mi capacidad para preparar y enriquecer datos, administrar activos analíticos, implementar modelos semánticos y proteger las soluciones construidas sobre Microsoft Fabric. En los tableros, estos conocimientos se hacen visibles mediante decisiones de arquitectura, calidad, rendimiento y experiencia.

Power BI y Fabric constituyen mi stack predilecto porque permiten conectar ingeniería de datos, modelado semántico y consumo analítico dentro de un mismo ecosistema. Esta preferencia no significa que mi experiencia se limite exclusivamente a tecnologías Microsoft.

También he trabajado con Shiny dentro del ecosistema de R y Posit para construir experiencias analíticas vinculadas con el análisis estadístico. He trabajado de la mano con Tableau en contextos de visualización y exploración, y con Google Looker Studio para escenarios de publicación y análisis conectados con otras fuentes y servicios.

Estas herramientas no ocupan el mismo nivel dentro de mi perfil. Power BI y Microsoft Fabric representan mi mayor profundidad y mi arquitectura principal. Shiny, Tableau y Looker Studio amplían mi capacidad para comprender otros enfoques de construcción, interacción y distribución de productos analíticos.

Mi criterio para seleccionar la herramienta no parte de una preferencia de marca. Considero el problema, las fuentes, la escala, las necesidades de gobierno, la audiencia, la infraestructura disponible, el modelo de licenciamiento y la capacidad de la organización para sostener la solución.

La plataforma adecuada es aquella que permite transformar los datos en una capacidad confiable sin introducir una complejidad desproporcionada para el contexto en el que deberá operar.

## El pipeline comienza en la fuente

<!-- seccion: pipeline-de-datos -->

Cada tablero comienza con una evaluación de las fuentes. Antes de diseñar indicadores necesito comprender quién publica la información, qué representa cada conjunto, con qué frecuencia se actualiza, qué cobertura tiene y qué cambios metodológicos pueden afectar su interpretación.

Las fuentes públicas suelen utilizar estructuras diseñadas para publicación o intercambio, no necesariamente para análisis integrado. Pueden distribuirse en múltiples archivos, contener encabezados variables, modificar nombres entre años, utilizar identificadores incompletos o publicar totales con un nivel de agregación diferente al requerido por el modelo.

La ingestión debe conservar suficiente evidencia para reconstruir el recorrido. El archivo, periodo, organismo, fecha de carga y demás metadatos relevantes forman parte de la trazabilidad. No considero suficiente almacenar únicamente la tabla resultante si después no puede relacionarse con la publicación que la originó.

La transformación debe separar la corrección técnica de la interpretación analítica. Convertir un campo a una fecha o eliminar caracteres de un valor corresponde a una operación técnica. Decidir que dos categorías representan el mismo concepto exige una regla de negocio o una justificación metodológica diferente.

También procuro conservar los datos con el nivel de detalle necesario antes de agregarlos. Una agregación temprana puede simplificar el modelo, pero eliminar la posibilidad de investigar inconsistencias, reconstruir identidades o desarrollar preguntas que todavía no habían sido formuladas.

Los controles se aplican durante el recorrido y no solamente al final. Verifico estructuras, tipos, duplicidades, valores faltantes, relaciones, conteos y totales relevantes antes de permitir que los datos avancen hacia el modelo semántico.

Esta disciplina proviene tanto de la ingeniería de datos como de la Ingeniería Industrial. Trato el pipeline como un proceso: cada etapa recibe una entrada, aplica una transformación, produce una salida y debe conservar evidencia sobre aquello que modificó.

Cuando el pipeline se integra con Fabric, estas responsabilidades pueden organizarse con mayor claridad y reutilización. La ingestión, la preparación, el almacenamiento y el consumo dejan de depender exclusivamente del archivo de Power BI y comienzan a formar parte de una plataforma analítica más amplia.

## El modelo semántico convierte datos en conceptos

<!-- seccion: modelo-semantico -->

El modelo semántico constituye el núcleo de cada tablero. Es el lugar donde las fuentes dejan de aparecer como archivos y columnas aisladas y comienzan a representar entidades, hechos, periodos, organizaciones, territorios, categorías y relaciones comprensibles.

Un modelo bien diseñado permite responder nuevas preguntas sin reconstruir la lógica para cada página. También permite que diferentes medidas utilicen dimensiones comunes, trabajen con una granularidad consistente y conserven una interpretación estable a través del producto.

La construcción comienza identificando la unidad de análisis. En un tablero financiero puede ser una entidad, una cuenta y un periodo. En contratación pública puede ser un contrato, una entidad contratante, un proveedor y una fecha. En Fórmula 1 puede ser una carrera, una temporada, un piloto o un equipo.

Las relaciones deben respetar esa granularidad. Una unión aparentemente válida puede duplicar registros y producir totales incorrectos si conecta tablas con niveles de detalle diferentes. Este tipo de error resulta especialmente peligroso porque el tablero puede seguir funcionando y presentar cifras plausibles.

Las medidas se construyen después de establecer la estructura. DAX permite expresar cálculos, acumulados, variaciones, participaciones y comparaciones temporales, pero una medida técnicamente correcta puede producir un resultado equivocado si el modelo no representa adecuadamente el dominio.

Por eso, no separo la ingeniería de medidas del conocimiento del proceso y de la fuente. El modelo semántico es una implementación de cómo comprendo el universo analizado, no únicamente una optimización para que Power BI responda más rápido.

Herramientas como DAX Studio y Tabular Editor fortalecen este trabajo. Permiten observar el comportamiento de consultas y medidas, organizar metadatos, aplicar convenciones y tratar el modelo como un activo que necesita rendimiento, mantenibilidad y gobierno.

Cuando el stack se integra con Fabric, el modelo semántico puede apoyarse en una arquitectura de datos más reutilizable. Esto permite separar la preparación de la experiencia visual y compartir definiciones con diferentes reportes o consumidores.

La verdadera especialidad en Power BI no consiste en conocer una gran cantidad de visualizaciones. Consiste en construir una capa semántica capaz de preservar el significado de los datos y sostener experiencias que puedan utilizarse con confianza.

## Las identidades tienen que cerrar

<!-- seccion: las-identidades -->

La regla que comparten los seis tableros es que las identidades definidas o garantizadas por las fuentes deben cerrar. Esta condición convierte la validación en una parte estructural del producto y no en una revisión opcional antes de publicar.

Una identidad es una relación que debe mantenerse dentro del universo analizado. En estados financieros, el activo debe corresponder con la suma del pasivo y el patrimonio bajo la estructura aplicable. En un presupuesto, las partidas deben reconciliarse con los totales publicados. En un campeonato, los puntos y resultados deben coincidir con los valores oficiales.

Estas identidades funcionan como invariantes del sistema. Si dejan de cumplirse después de integrar y transformar los datos, algo ocurrió dentro del pipeline, el modelo o la fuente que necesita explicación.

La primera posibilidad es una pérdida. Algún registro no ingresó, fue filtrado incorrectamente o dejó de relacionarse con el resto de la información. La segunda es una duplicación producida por una unión o una granularidad incompatible. La tercera es una desalineación conceptual, en la que dos campos aparentemente equivalentes representan elementos diferentes.

También puede existir un problema en el origen. Una fuente pública puede contener errores, correcciones posteriores, cambios metodológicos o excepciones que no se explican de forma evidente. La validación no debe asumir que la publicación es infalible, pero tampoco debe modificarla silenciosamente para obligarla a cerrar.

En el tablero de banca, el balance cierra en más de siete mil setecientas combinaciones verificadas. La cifra demuestra que la validación no se aplicó únicamente a un total general, sino a múltiples entidades y periodos dentro del modelo.

En el tablero sobre el gasto estatal se aplicaron veintiún contrastes para evaluar la consistencia entre diferentes componentes del universo modelado. En Fórmula 1 se verificaron veinte identidades y tres de ellas no cerraron durante las primeras ejecuciones.

Esos tres casos resultaron especialmente valiosos. Una prueba adquiere sentido cuando puede ponerse en rojo y hacer visible una desviación. Si las identidades hubieran sido tratadas únicamente como una formalidad para confirmar resultados esperados, los problemas habrían permanecido ocultos.

Las diferencias se documentan en la ficha técnica en lugar de corregirse silenciosamente o eliminarse para producir un tablero más limpio. El propósito de la validación no es conseguir que todos los números coincidan a cualquier precio. Es comprender por qué coinciden o por qué dejan de hacerlo.

Esta disciplina conecta directamente con mis sistemas de gestión y con mi forma de trabajar en inteligencia artificial. Un control no está demostrado porque exista. Debe mostrar que puede detectar la condición para la que fue diseñado y conservar evidencia sobre la respuesta aplicada.

## Verificar el universo, no solamente una muestra

<!-- seccion: verificar-el-universo -->

Cuando la escala lo permite, procuro ejecutar las validaciones sobre el universo completo incorporado al modelo y no únicamente sobre una muestra seleccionada.

Las muestras son útiles para comprender estructuras, desarrollar transformaciones y revisar casos con mayor detalle. Sin embargo, una regla que funciona sobre algunos registros puede fallar en periodos, entidades o categorías que no fueron incluidos durante el desarrollo.

La validación completa permite reconocer excepciones, cambios de formato y condiciones históricas que podrían permanecer ocultas en una selección pequeña. También ayuda a diferenciar un problema sistemático de una diferencia localizada.

Esta decisión exige equilibrio. Validar todo el universo puede aumentar el tiempo de procesamiento y el uso de recursos. Por eso, distingo entre controles rápidos que pueden ejecutarse frecuentemente y pruebas exhaustivas que corresponden a momentos específicos del ciclo de publicación.

Los resultados deben conservar suficiente detalle para identificar dónde ocurrió la diferencia. Un control que únicamente informa que la suma no coincide obliga a repetir el análisis. Una validación útil debe permitir localizar la entidad, el periodo, la cuenta o la combinación que produjo el incumplimiento.

La escala también influye en la arquitectura. Un tablero con millones de registros necesita estrategias de almacenamiento, transformación, agregación y modelado diferentes a las de una pieza pequeña. Microsoft Fabric permite trasladar parte de estas responsabilidades hacia una plataforma preparada para procesar y servir volúmenes mayores.

El objetivo no es demostrar que puedo cargar muchos datos. Es asegurar que la cantidad de información no reduzca la capacidad para explicar, validar y gobernar los resultados.

## Publicar la cobertura y los límites

<!-- seccion: publicar-los-limites -->

Cada tablero debe comunicar no solo lo que permite observar, sino también aquello que sus datos no pueden sostener. Publicar límites es una condición de uso responsable y no una nota secundaria ubicada fuera de la experiencia principal.

La cobertura necesita expresarse de forma comprensible. Puede depender de periodos, entidades, regiones, variables o metodologías disponibles. Un tablero que analiza miles de empresas todavía debe explicar qué proporción del universo representa y qué organizaciones no se encuentran incluidas.

En Las empresas de Colombia en cifras, la cobertura se presenta como una dimensión analítica propia. Esta decisión evita que el tamaño del conjunto se interprete automáticamente como representación completa del tejido empresarial.

En Energía y clima, las limitaciones de las fuentes se hacen visibles porque las comparaciones atraviesan metodologías, territorios y periodos diferentes. Integrar variables dentro de una misma experiencia no convierte automáticamente sus definiciones en equivalentes ni demuestra relaciones causales.

También debe distinguirse entre ausencia y cero. Que una fuente no contenga un valor no significa que el fenómeno no exista. Reemplazar indiscriminadamente faltantes por cero puede producir una narrativa incorrecta y alterar agregaciones, tendencias y comparaciones.

Los cambios metodológicos también deben permanecer visibles. Cuando un organismo modifica una clasificación, una serie puede aparentar una ruptura que proviene de la definición y no del fenómeno. La transformación no debe borrar esa condición sin documentarla.

El límite debe comunicarse cerca del lugar donde puede afectar la interpretación. Una advertencia general al final del tablero puede resultar insuficiente si la persona toma una decisión en una página específica sin reconocer que el universo está incompleto.

El Diseño Industrial aporta una responsabilidad importante en este punto. Los límites deben ser comprensibles, visibles y proporcionales al riesgo de una interpretación equivocada. No basta con incluirlos en una nota técnica que pocas personas leerán.

Un producto analítico confiable no es aquel que parece tener respuesta para todo. Es aquel que permite distinguir con claridad qué puede afirmar, qué necesita contexto adicional y qué permanece fuera de sus datos.

## La visualización debe respetar la evidencia

<!-- seccion: visualizacion-y-evidencia -->

La visualización no debe exagerar aquello que los datos pueden demostrar. Una escala, un color, una agregación o una comparación pueden modificar profundamente la forma en que una persona interpreta el resultado.

Por eso, cada representación debe responder al tipo de pregunta. Una tendencia necesita preservar el comportamiento temporal. Una comparación necesita una escala coherente. Una composición debe permitir comprender tanto las partes como el total. Una distribución no puede reducirse siempre a un promedio.

También debe existir una jerarquía clara. La pantalla inicial debe responder la pregunta principal y permitir profundizar hacia las causas, los segmentos o la evidencia. Mostrar toda la información simultáneamente aumenta la carga cognitiva y puede ocultar precisamente aquello que necesita atención.

Los títulos cumplen una función analítica. No deben limitarse a nombrar la métrica. Deben ayudar a comprender qué se está observando, bajo qué periodo y con qué unidad. Las etiquetas, filtros y descripciones deben utilizar conceptos reconocibles para la audiencia y no reproducir automáticamente los nombres técnicos de las fuentes.

El uso del color necesita significado. Una misma paleta no debería utilizarse simultáneamente para categorías, estados y niveles de riesgo. Tampoco debería depender exclusivamente del color para comunicar una diferencia que necesita ser comprendida por usuarios bajo diferentes condiciones visuales.

La accesibilidad forma parte del diseño. Contraste, navegación, jerarquía, texto alternativo y comportamiento de la interfaz influyen sobre quién puede utilizar la solución y con qué nivel de esfuerzo.

Mi formación en Diseño Industrial fortalece esta dimensión porque me obliga a tratar el tablero como una experiencia y no únicamente como una superficie donde ubicar gráficos. La forma debe ayudar a comprender la función, no competir con ella.

La mejor visualización no es la más llamativa ni la que presenta más elementos. Es la que permite reconocer el resultado, comprender su contexto, identificar sus límites y recorrer la evidencia sin perder significado.

## Tableros como productos analíticos, no como archivos

<!-- seccion: productos-analiticos -->

No considero que un tablero esté terminado porque el archivo de Power BI funciona o porque la publicación se completó correctamente. Una pieza sostenible necesita fuentes identificadas, transformaciones reproducibles, un modelo mantenible, medidas documentadas, controles de calidad y una experiencia coherente.

También necesita una relación clara con su propósito. En el portafolio público, cada tablero demuestra una capacidad específica. En una organización, debe responder a decisiones, responsabilidades y ciclos de uso igualmente concretos.

El modelo semántico y el reporte deben tratarse como componentes diferentes. El modelo concentra las entidades, relaciones y medidas que requieren reutilización y gobierno. El reporte organiza la interacción, el contexto y las preguntas de una audiencia determinada.

Esta separación permite que una misma base de significado sostenga experiencias diferentes sin duplicar la lógica en cada producto. También facilita la evolución: una nueva vista puede incorporarse sin reconstruir las definiciones fundamentales.

Cuando los tableros se integran con Fabric, la arquitectura puede separar aún mejor ingestión, almacenamiento, transformación, semántica y consumo. Esto permite administrar el ciclo de vida de cada componente y controlar sus cambios con mayor precisión.

Un producto analítico también necesita criterios para actualizarse y retirarse. Una fuente puede modificar su estructura, una definición puede perder vigencia y un tablero puede dejar de responder a una necesidad. Mantenerlo publicado indefinidamente puede generar tanta confusión como un error visible.

La calidad se conserva mediante responsabilidades. La fuente necesita seguimiento. El pipeline requiere controles. El modelo necesita un responsable de su semántica. La visualización necesita revisión. Las cifras y los límites deben mantenerse sincronizados con el estado real de la pieza.

Esta perspectiva transforma el portafolio. No contiene seis archivos independientes. Contiene seis productos analíticos que demuestran cómo organizo el recorrido completo desde la fuente hasta la interpretación.

## Datos preparados también para aplicaciones y agentes

<!-- seccion: datos-para-agentes -->

La evolución de los tableros hacia Microsoft Fabric amplía sus consumidores potenciales. La información preparada y gobernada no necesita utilizarse únicamente en Power BI. También puede servir a aplicaciones, procesos automatizados y agentes de inteligencia artificial.

Esto exige conservar una separación clara entre los datos, su significado y la forma de consumo. Un agente no debería reconstruir libremente una métrica cuya definición ya existe dentro del modelo semántico. Cuando una medida ha sido validada y gobernada, la solución inteligente debería utilizar ese activo en lugar de generar una interpretación alternativa.

Los tableros públicos ofrecen un entorno especialmente útil para explorar esta integración porque las fuentes pueden auditarse y las definiciones pueden hacerse visibles. Una aplicación o un agente podría consultar datos estructurados, recuperar documentación metodológica y producir explicaciones sustentadas en los mismos activos utilizados por Power BI.

Sin embargo, ampliar los consumidores también aumenta las responsabilidades. Debe establecerse qué información puede consultar cada componente, qué nivel de detalle necesita, qué resultado está autorizado a producir y cómo se conservará la trazabilidad.

AI-103 fortalece la construcción de aplicaciones y agentes capaces de utilizar estos activos. AI-300 amplía la evaluación, observabilidad y operación de esas soluciones cuando comienzan a utilizar datos y herramientas de forma sostenida.

Esta convergencia representa una evolución natural de mi portafolio. Los tableros comenzaron como productos de análisis. Fabric permite tratarlos como parte de una plataforma. Las aplicaciones y los agentes pueden convertir esa misma base en nuevas formas de acceso, explicación e interacción.

El valor no se encuentra en conectar un modelo generativo a todos los datos. Se encuentra en construir una arquitectura donde personas y soluciones inteligentes utilicen información consistente, autorizada y verificable.

## Qué demuestran los seis tableros

<!-- seccion: que-demuestran -->

Los seis tableros demuestran ingeniería de datos y analítica de extremo a extremo sobre fuentes que cualquier persona puede descargar y contrastar.

Demuestran capacidad para integrar estructuras heterogéneas, conservar metadatos, controlar granularidad, construir modelos dimensionales y desarrollar medidas que representan conceptos reales dentro de cada dominio.

Demuestran que la calidad debe poder probarse. Las identidades contables, financieras, presupuestales y deportivas convierten las reglas del origen en controles ejecutables capaces de detectar pérdidas, duplicidades y desalineaciones.

Demuestran que la cobertura forma parte del resultado. Una cifra no adquiere autoridad únicamente por haber sido calculada sobre millones de registros. Necesita explicar qué universo representa, bajo qué periodos y con qué limitaciones.

Demuestran que la visualización debe respetar la evidencia. La experiencia necesita facilitar comprensión, jerarquía y exploración sin ocultar incertidumbres ni presentar comparaciones que las fuentes no permiten sostener.

Demuestran mi profundidad en Power BI, desde la preparación y el modelo semántico hasta las medidas, el rendimiento y la experiencia de consumo. Su evolución hacia Fabric demuestra además una visión de plataforma en la que los datos pueden reutilizarse más allá de un único reporte.

También demuestran la convergencia entre Ingeniería Industrial y Diseño Industrial. La primera me permite comprender el sistema, las relaciones y los controles. La segunda me obliga a convertir esa complejidad en una experiencia comprensible, responsable y utilizable.

Las piezas públicas hacen verificable una forma de trabajo que apliqué anteriormente en operaciones de transporte, logística, banca y agentes de IA. La diferencia es que aquí las fuentes, las decisiones y los resultados pueden ser examinados de manera independiente.

No construí estos tableros para mostrar seis temas diferentes. Los construí para demostrar un mismo método frente a seis universos: comprender la fuente, modelar el dominio, verificar la integridad, declarar los límites y diseñar una experiencia que permita utilizar los resultados sin exceder la evidencia.
