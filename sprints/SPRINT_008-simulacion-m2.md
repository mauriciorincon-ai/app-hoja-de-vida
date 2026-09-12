# Simulación M2 — qué contesta el chat cuando apruebes la base

> **Sprint 008 · fase 4 · 2026-09-12.** Los 24 documentos están en `borrador`, así que el índice
> publicado sigue en 28 fragmentos y el chat **todavía no ve nada de esto**. Este informe mide contra
> el índice que existirá cuando los apruebes: **162 fragmentos**, los 24 documentos forzados a
> aprobado más los que salen de los YAML.
>
> Es la simulación que el plan declaró como riesgo 7: la calibración real llega con tus
> aprobaciones. Mientras tanto, esto sirve para lo que estás haciendo ahora — **te dice qué
> preguntas contesta bien tu corpus y cuáles no**, que es donde conviene concentrar la corrección.
>
> Cada bloque compara **HOY** (lo que el chat contesta en producción en este momento) contra **M2**
> (lo que contestaría con la base aprobada). El `top-4` es el que de verdad usa el chat.

---

## Lo que la simulación destapó, y que ya corregí

**Los documentos repetían la oferta de trabajo palabra por palabra.** Cuatro subsecciones traían
frases como «liderazgo de estrategia y gobierno de IA para un grupo empresarial grande: estándares,
lineamientos y uso responsable, con iniciativas transversales» — que es el texto de la vacante, no
el tuyo. Dos consecuencias, las dos malas:

1. **Secuestraban el buscador.** Como esos párrafos contenían el vocabulario exacto de las
   preguntas, ganaban el top-4 de *todas* las preguntas de ese tipo de vacante. A «¿tiene
   especialización o posgrado?» el chat respondía con un párrafo que dice *«esa posición exige
   posgrado»* — la forma de respuesta equivocada.
2. **Metían la oferta en un repositorio público.** Los datos de terceros los aparté desde el primer
   día, pero la **redacción** de la oferta también es de un tercero y no tenía por qué viajar aquí.

Reescritas las cuatro en tu voz y sin nombrar ninguna vacante concreta. Efecto medido: «¿tiene
posgrado?» ahora trae `estudios` de primero —la respuesta real, tus dos pregrados— y «¿está
dispuesto a reubicarse?» trae la subsección de condiciones, que es la que lo dice.

---

## Cómo leer lo que sigue

- **responde** = la pregunta supera el guardrail y el chat contesta con esas fuentes.
- **OFF-TOPIC** = el chat responde con el texto fijo, sin gastar tokens.
- Los `a-fondo-…` son fragmentos de la base nueva; los demás salen de los YAML de siempre.

---

## Posición A — ingeniería de IA

### ¿Tiene experiencia avanzada con Python?
- HOY (28 frag.): **responde** — estudios, certificaciones, skills
- M2 (162 frag.): **responde** — estudios, a-fondo-certificaciones-las-de-ibm, certificaciones, a-fondo-plataforma-y-despliegue-el-mundo-microsoft
- Primer fragmento: «Ingeniería Industrial, énfasis en Inteligencia Analítica de Datos, Pontificia Universidad Javeriana · Bogotá (2009 — 2016). Optimización de procesos, análisis de datos y soporte a la toma de decisiones, integrando principios de in…»

### ¿Ha construido arquitecturas RAG?
- HOY (28 frag.): **responde** — casestudy-vesting, app-chat-hoja-de-vida, skills, casestudy-fundacion-ctic
- M2 (162 frag.): **responde** — a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-rag-y-el-chat-que-demuestra, a-fondo-lo-que-busco-los-dos-tipos-de-rol, a-fondo-rag-y-el-chat-los-guardarrailes
- Primer fragmento: «Si esta respuesta te llegó por el chat de esta página, estás usando lo que este documento describe. Es una arquitectura de generación aumentada por recuperación, construida por mí, corriendo en producción sobre mi propia hoja de v…»

### ¿Ha trabajado con agentes autónomos de IA?
- HOY (28 frag.): **responde** — casestudy-vesting, proyecto-vesting, trayectoria-1, app-agente-gemini-vertex
- M2 (162 frag.): **responde** — a-fondo-vesting-monitoreo-de-agentes, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-origenes-de-la-plataforma-a-la-ia, a-fondo-agentes-en-produccion-sistemas-de-trabajo
- Primer fragmento: «Implementé sistemas de captura, almacenamiento y análisis para el monitoreo en tiempo real de agentes de inteligencia artificial, optimizando su control. Esta es la parte del trabajo que menos gente ha hecho y la que más se parece…»

### ¿Conoce Google Cloud, Vertex AI o BigQuery?
- HOY (28 frag.): **responde** — app-agente-gemini-vertex, contacto, app-chat-hoja-de-vida, skills
- M2 (162 frag.): **responde** — a-fondo-plataforma-y-despliegue-como-la-cubro, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, app-agente-gemini-vertex, a-fondo-apps-pipeline-en-exploracion
- Primer fragmento: «Tengo declarada en mi pipeline, como exploración y no como construida, una pieza llamada **Agente autónomo con Gemini y Vertex AI**: un agente con herramientas sobre el stack de Google Cloud, pensado explícitamente como el complem…»

### ¿Tiene experiencia con Docker o Kubernetes?
- HOY (28 frag.): **OFF-TOPIC** — nada
- M2 (162 frag.): **responde** — a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-certificaciones-el-ai-103~1, a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-ceinfes-la-junta-directiva
- Primer fragmento: «**Google Cloud** —Vertex AI, BigQuery, despliegue productivo en ese ecosistema— y **contenedores en producción** con Docker y Kubernetes no están en mi experiencia profesional. Mi mundo es Microsoft y en Microsoft es donde tengo l…»

### ¿Cuántos años lleva en aprendizaje automático o ingeniería de IA?
- HOY (28 frag.): **responde** — perfil, proyecto-vesting, casestudy-vesting, logros
- M2 (162 frag.): **responde** — a-fondo-transmilenio-cm-prediccion-de-demanda, a-fondo-agentes-en-produccion-el-proceso-core, perfil, a-fondo-vesting-monitoreo-de-agentes
- Primer fragmento: «Desarrollé un modelo de predicción de la demanda con scikit-learn para optimizar decisiones estratégicas, con un aumento del veinte por ciento en el rendimiento del sistema. Es mi primer modelo de aprendizaje automático con consec…»

### ¿Ha llevado modelos de machine learning a producción?
- HOY (28 frag.): **responde** — casestudy-banco-pichincha, logros, perfil, casestudy-vesting
- M2 (162 frag.): **responde** — a-fondo-analitica-predictiva-dos-modelos, a-fondo-analitica-predictiva-en-produccion, a-fondo-banco-pichincha-modelos-en-produccion, a-fondo-analitica-predictiva-las-herramientas
- Primer fragmento: «**Predicción de demanda en transporte masivo (C&M Consultores, 2021–2022).** Desarrollé un modelo de predicción de la demanda con scikit-learn para optimizar decisiones estratégicas, con un aumento del veinte por ciento en el rend…»

### ¿Está dispuesto a reubicarse a otro país?
- HOY (28 frag.): **responde** — app-chat-hoja-de-vida, app-hoja-de-vida
- M2 (162 frag.): **responde** — a-fondo-lo-que-busco-condiciones, a-fondo-apps-pipeline-en-exploracion, a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba, a-fondo-como-trabajo-que-valoro
- Primer fragmento: «Estoy en Bogotá, Colombia, y **abierto a reubicarme a otro país y a trabajar en remoto**. La reubicación internacional no es una concesión que hago por una vacante: está declarada en la cabecera de este sitio desde antes de que ex…»

### ¿Qué frameworks de agentes ha usado?
- HOY (28 frag.): **responde** — trayectoria-1, casestudy-vesting, proyecto-vesting, app-agente-gemini-vertex
- M2 (162 frag.): **responde** — a-fondo-agentes-en-produccion-que-me-llevo, a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-como-aprendo-evidencia-construido, a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba
- Primer fragmento: «Que la parte difícil de un agente en producción no es el modelo. Es el contexto que se le da, la evidencia con la que responde, la forma de comprobar que no se salió del carril y el proceso que permite construir el siguiente igual…»

### ¿Tiene experiencia en MLOps?
- HOY (28 frag.): **OFF-TOPIC** — nada
- M2 (162 frag.): **responde** — a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-ceinfes-la-junta-directiva, a-fondo-transmilenio-cm-las-mesas-del-sitp
- Primer fragmento: «Mi experiencia profunda de plataforma es Microsoft, y es profunda de verdad: Microsoft Fabric, Azure Synapse, Data Factory, Lakehouse, Power BI y el modelado semántico, certificados por el DP-600 y aplicados durante año y medio co…»


## Posición B — estrategia y gobierno de IA

### ¿Cuántos años de experiencia profesional tiene?
- HOY (28 frag.): **responde** — trayectoria-0, logros, certificaciones, perfil
- M2 (162 frag.): **responde** — trayectoria-0, a-fondo-como-aprendo-evidencia-certificaciones, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-agentes-en-produccion-dos-experiencias
- Primer fragmento: «2025 — hoy: Profesional de Analítica, Fundación CTIC. Analítica y gobierno de datos para decisiones administrativas y asistenciales en salud. Modelos de análisis y visualización para líderes administrativos y asistenciales. Gobier…»

### ¿Ha implementado gobierno de datos?
- HOY (28 frag.): **responde** — casestudy-vesting, trayectoria-1, proyecto-vesting, proyecto-fundacion-ctic
- M2 (162 frag.): **responde** — a-fondo-gobierno-de-datos-y-de-ia-tres-veces, a-fondo-gobierno-de-datos-y-de-ia-que-es-gobernar, a-fondo-gobierno-de-datos-y-de-ia-la-continuacion, a-fondo-gobierno-de-datos-y-de-ia-gobierno-de-mi-proceso
- Primer fragmento: «He montado gobierno de datos tres veces, en tres contextos que no se parecen: **Banco Pichincha (2023).** Co-lideré el desarrollo de un sistema de gobernanza que mejoró la seguridad, la calidad y la confiabilidad en la gestión de …»

### ¿Sabe de gobierno de IA y de la norma ISO 42001?
- HOY (28 frag.): **responde** — casestudy-vesting, proyecto-vesting, perfil, trayectoria-7
- M2 (162 frag.): **responde** — a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-agentes-en-produccion-fuentes-o-vacio, a-fondo-lo-que-busco-los-dos-tipos-de-rol, a-fondo-gobierno-de-datos-y-de-ia-lo-transversal
- Primer fragmento: «La norma ISO 42001 es el estándar de sistemas de gestión de inteligencia artificial: el marco con el que una organización demuestra que gobierna su IA. Construí un agente experto en esa norma y está publicado en mi vitrina, con su…»

### ¿Qué experiencia tiene con inteligencia artificial generativa?
- HOY (28 frag.): **responde** — estudios
- M2 (162 frag.): **responde** — a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-las-investigaciones-las-siete, a-fondo-como-aprendo-por-que-existe, a-fondo-las-investigaciones-que-tiene-que-ver
- Primer fragmento: «La norma ISO 42001 es el estándar de sistemas de gestión de inteligencia artificial: el marco con el que una organización demuestra que gobierna su IA. Construí un agente experto en esa norma y está publicado en mi vitrina, con su…»

### ¿Ha presentado ante junta directiva o comités de dirección?
- HOY (28 frag.): **responde** — trayectoria-6, proyecto-transmilenio-cm, trayectoria-3, casestudy-transmilenio-cm
- M2 (162 frag.): **responde** — a-fondo-ceinfes-la-junta-directiva, a-fondo-como-trabajo-como-hablo-con-el-negocio, a-fondo-origenes-del-proceso-al-indicador, a-fondo-lo-que-busco-los-dos-tipos-de-rol
- Primer fragmento: «Presenté informes estratégicos a la junta directiva. Es la primera vez que me toca esa sala y lo que aprendí ahí lo sigo usando: una junta no quiere el detalle, quiere la consecuencia. El detalle tiene que existir y tienes que pod…»

### ¿Ha liderado iniciativas transversales en organizaciones grandes?
- HOY (28 frag.): **responde** — casestudy-cafam, logros, proyecto-cafam, proyecto-banco-pichincha
- M2 (162 frag.): **responde** — a-fondo-gobierno-de-datos-y-de-ia-lo-transversal, casestudy-cafam, a-fondo-como-trabajo-como-lidero, logros
- Primer fragmento: «Gobernar sirve de poco si no se puede atravesar la organización, y eso lo he hecho tres veces en sitios donde nadie me reportaba: las mesas con la dirección de concesionarios del sistema de transporte de Bogotá, la implementación …»

### ¿Tiene especialización o estudios de posgrado?
- HOY (28 frag.): **responde** — estudios, trayectoria-2, casestudy-banco-pichincha
- M2 (162 frag.): **responde** — estudios, a-fondo-gobierno-de-datos-y-de-ia-lo-transversal, a-fondo-origenes-por-que-industrial, a-fondo-agentes-en-produccion-fuentes-o-vacio
- Primer fragmento: «Ingeniería Industrial, énfasis en Inteligencia Analítica de Datos, Pontificia Universidad Javeriana · Bogotá (2009 — 2016). Optimización de procesos, análisis de datos y soporte a la toma de decisiones, integrando principios de in…»

### ¿Qué experiencia tiene en transformación digital?
- HOY (28 frag.): **OFF-TOPIC** — trayectoria-6
- M2 (162 frag.): **responde** — a-fondo-gobierno-de-datos-y-de-ia-lo-transversal, a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-fabric-en-la-practica-que-significa-el-dp-600, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho
- Primer fragmento: «Gobernar sirve de poco si no se puede atravesar la organización, y eso lo he hecho tres veces en sitios donde nadie me reportaba: las mesas con la dirección de concesionarios del sistema de transporte de Bogotá, la implementación …»

### ¿Ha definido estándares o lineamientos de uso responsable de IA?
- HOY (28 frag.): **responde** — casestudy-vesting, proyecto-vesting, casestudy-banco-pichincha, trayectoria-1
- M2 (162 frag.): **responde** — a-fondo-lo-que-busco-los-dos-tipos-de-rol, a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-vesting-el-proceso-core, a-fondo-gobierno-de-datos-y-de-ia-la-continuacion
- Primer fragmento: «**Ingeniería de IA.** Construir: arquitecturas de recuperación aumentada, agentes con herramientas, modelos en producción, la plataforma que los sostiene y la observabilidad que permite confiar en ellos. Aquí traigo diez años de i…»

### ¿Qué experiencia tiene en arquitectura tecnológica de datos?
- HOY (28 frag.): **responde** — trayectoria-1, casestudy-vesting, proyecto-vesting, casestudy-transmilenio-cm
- M2 (162 frag.): **responde** — a-fondo-vesting-la-arquitectura, trayectoria-1, casestudy-vesting, a-fondo-plataforma-y-despliegue-el-mundo-microsoft
- Primer fragmento: «Diseñé e implementé desde cero el ecosistema de datos en Microsoft Fabric, integrando Big Data, Data Warehouse y procesamiento distribuido. Elegir Fabric fue una decisión de plataforma, no de moda: reúne el lago, el almacén, el mo…»


## Off-topic con el corpus completo

- «cuéntame un chiste sobre gatos» → **OFF-TOPIC** (cero tokens)
- «¿va a llover mañana en Madrid?» → **OFF-TOPIC** (cero tokens)
- «¿cuál es la receta del ajiaco?» → **OFF-TOPIC** (cero tokens)
- «hazme la tarea de cálculo integral» → pasa al modelo (score 6.60)
- «escribe una función en rust que ordene una lista» → pasa al modelo (score 16.64)

## Fallback local: qué vería el visitante

### ¿Ha construido arquitecturas RAG?
[1] Si esta respuesta te llegó por el chat de esta página, estás usando lo que este documento describe. Es una arquitectura de generación aumentada por recuperación, construida por mí, corriendo en producción sobre mi propia…

[2] Que puedo diseñar un sistema de IA en producción con criterio de ingeniero y no de entusiasta: decidiendo qué **no** usar, poniendo el determinismo donde se puede, dejando la degradación prevista y pagando el costo de qu…

[3] **Ingeniería de IA.** Construir: arquitecturas de recuperación aumentada, agentes con herramientas, modelos en producción, la plataforma que los sostiene y la observabilidad que permite confiar en ellos. Aquí traigo diez…

[4] El chat solo responde sobre mi trayectoria, y eso se sostiene con tres capas. La primera es la de **fuera de alcance**: la pregunta se busca en el índice y, si nada supera el umbral de relevancia, se contesta con un text…

### ¿Sabe de gobierno de IA?
[1] Gobernar un modelo o un agente plantea las mismas cuatro preguntas con un sujeto distinto: con qué datos se entrenó o se alimenta, qué puede y qué no puede hacer, quién responde por lo que produce, y cómo se sabe cuando …

[2] La norma ISO 42001 es el estándar de sistemas de gestión de inteligencia artificial: el marco con el que una organización demuestra que gobierna su IA. Construí un agente experto en esa norma y está publicado en mi vitri…

[3] He montado gobierno de datos tres veces, en tres contextos que no se parecen: **Banco Pichincha (2023).** Co-lideré el desarrollo de un sistema de gobernanza que mejoró la seguridad, la calidad y la confiabilidad en la g…

[4] Lo que predico lo tengo montado sobre mi propio pipeline, y se puede ir a mirar. Ninguna aplicación avanza sin dos aprobaciones escritas: la prioridad vigente y la visión con todas sus funcionalidades inventariadas. Ning…


---

## Veredicto pregunta por pregunta

Mi lectura de los 20 resultados de arriba. **«Bien»** significa que el primer fragmento responde de
verdad; **«flojo»**, que el chat contestaría algo cierto pero sin la concreción que la pregunta pide.

### Posición de ingeniería de IA

| Pregunta | HOY | M2 | Veredicto |
| -------- | --- | -- | --------- |
| Python avanzado | responde con `estudios` y `skills` | trae estudios y las de IBM | **Flojo.** Ningún fragmento dice «Python es mi herramienta principal» con fuerza. Está escrito en `analitica-predictiva`, pero no gana |
| Arquitecturas RAG | genérico (case study de Vesting) | **`rag-y-el-chat` entero** | **Bien.** La mejora más grande de toda la tabla |
| Agentes autónomos | case study de Vesting | monitoreo de agentes + las dos experiencias | **Bien** |
| Google Cloud, Vertex, BigQuery | la app en exploración | **«lo que no he hecho»** | **Bien, y honesto.** Responde con la brecha declarada, no con humo |
| Docker / Kubernetes | **OFF-TOPIC** (no sabe qué decir) | «lo que no he hecho» | **Bien.** Pasa de callar a responder con franqueza |
| Años en ML / ingeniería de IA | perfil y logros | predicción de demanda + proceso core | **Flojo.** Ningún fragmento da el número. Ver la discrepancia 11 del informe |
| Modelos en producción | case study de Pichincha | **`analitica-predictiva` completo** | **Bien** |
| Reubicación | fragmentos de las apps (ruido) | **`lo-que-busco` · condiciones** | **Bien**, tras la corrección de arriba |
| Frameworks de agentes | Vesting genérico | «qué me llevo» | **Flojo — y es un `[CONFIRMAR]` tuyo.** El corpus no nombra un solo framework porque tú no me lo has dicho |
| MLOps | **OFF-TOPIC** | Microsoft + «lo que no he hecho» | **Aceptable.** Responde con lo que domina y lo que no |

### Posición de estrategia y gobierno de IA

| Pregunta | HOY | M2 | Veredicto |
| -------- | --- | -- | --------- |
| Años de experiencia | logros y perfil | rol actual + certificaciones | **Flojo.** Mismo problema del «8+ años» sin recalcular |
| Gobierno de datos | case study de Vesting | **las cuatro subsecciones del documento** | **Bien.** De lejos |
| Gobierno de IA e ISO 42001 | Vesting (no lo menciona) | **la subsección de ISO 42001** | **Bien.** Es tu mejor carta y hoy es invisible |
| IA generativa | trae `estudios` (ruido puro) | ISO 42001 e investigaciones | **Flojo.** No hay una subsección que diga «esta es mi experiencia con IA generativa». Hueco de contenido real |
| Junta directiva y comités | trayectoria de Ceinfes | **Ceinfes · la junta directiva** | **Bien** |
| Iniciativas transversales | Cafam y logros | **«lo transversal»** | **Bien**, tras la corrección |
| Especialización o posgrado | `estudios` | `estudios` primero | **Bien** en la forma. El contenido depende de tu respuesta |
| Transformación digital | **OFF-TOPIC** | lo transversal + Fabric | **Flojo.** Ninguna subsección usa esa expresión para lo de Ceinfes e Inglopres |
| Estándares y uso responsable | case studies | los dos tipos de rol + ISO 42001 | **Bien** |
| Arquitectura tecnológica de datos | Vesting | **`vesting` · la arquitectura** | **Bien** |

**Resumen: 13 de 20 bien, 7 flojas.** Y las siete flojas no son del buscador: **son huecos de
contenido**, y seis de las siete ya tienen su `[CONFIRMAR]` esperándote.

---

## Los cinco huecos que más rinde cerrar

Si quieres priorizar la corrección por impacto, este es el orden:

1. **Los años.** Dos preguntas de las veinte fallan por lo mismo: el número «8+» está escrito a mano
   y ninguna subsección lo explica. Es la discrepancia 11 del informe.
2. **IA generativa como experiencia propia.** Hay documentos sobre agentes, sobre RAG y sobre
   gobierno, pero ninguno que responda de frente «qué he hecho yo con IA generativa». Puede ser una
   subsección nueva en `agentes-en-produccion` o en `apps-pipeline`.
3. **Los frameworks de agentes de Vesting.** Es el `[CONFIRMAR]` de `agentes-en-produccion` y es de
   las primeras preguntas de cualquier entrevista técnica de IA.
4. **Python como herramienta principal.** Está dicho en `analitica-predictiva`, pero enterrado. Con
   nombrarlo en el primer párrafo de esa subsección se arregla.
5. **«Transformación digital».** Ceinfes e Inglopres son exactamente eso y ningún documento usa la
   expresión. Una frase en cada uno basta.

---

## El «no sé de eso», con la base cargada

| Pregunta ajena | Con 162 fragmentos |
| -------------- | ------------------ |
| «cuéntame un chiste sobre gatos» | **OFF-TOPIC** — cero tokens |
| «¿va a llover mañana en Madrid?» | **OFF-TOPIC** — cero tokens |
| «¿cuál es la receta del ajiaco?» | **OFF-TOPIC** — cero tokens |
| «hazme la tarea de cálculo integral» | pasa al modelo (2 de 5) |
| «escribe una función en rust que ordene una lista» | pasa al modelo (2 de 5) |

Tres de cinco se paran sin gastar un token. Las otras dos comparten vocabulario con el contenido y
pasan al modelo, que las declina por el prompt. **Está decidido así y está explicado en la bitácora
del sprint:** el peor fallo posible de este chat no es gastar tokens en un chiste, es contestar «eso
se me escapa» a una pregunta legítima sobre tu trayectoria.

---

## El fallback local sigue legible

Con el proveedor caído, el visitante ve los cuatro fragmentos recortados a 220 caracteres. Con la
base cargada esos recortes son prosa tuya en primera persona y **se leen como respuesta**, no como
un volcado de campos de un YAML. Es una mejora que no estaba buscando: el modo degradado mejora
solo por tener mejor corpus.
