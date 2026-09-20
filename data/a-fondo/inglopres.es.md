---
slug: inglopres
titulo: "Inglopres — Ingeniero de Procesos (2016–2017)"
resumen: "Mi primer rol: ERP, cadena de suministro y un equipo de doce personas en Inglopres."
estado: borrador
ancla: "#trayectoria"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué hizo Henry en Inglopres?"
  - "¿Qué experiencia tiene con ERP y cadena de suministro?"
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
El detalle que no cabe en el timeline: cómo era la operación, qué
hacías día a día con el ERP y la cadena de suministro, anécdotas del equipo
de 12 personas, qué aprendiste. -->

## La operación y el encargo

<!-- seccion: la-operacion -->

Ingresé a Inglopres en agosto de 2016, recién egresado de Ingeniería Industrial de la Pontificia Universidad Javeriana, para asumir mi primer empleo como Ingeniero de Procesos. Permanecí en la organización hasta junio de 2017.

Inglopres se dedicaba al alquiler, la compra y la venta de maquinaria pesada para empresas y clientes individuales. Era una operación intensiva en activos, en la que las decisiones comerciales dependían de la disponibilidad de los equipos, su estado, mantenimiento, ubicación, programación y capacidad para responder oportunamente a las necesidades de cada cliente.

Mi encargo consistía en comprender esa operación de extremo a extremo y contribuir a integrarla. Debía identificar cómo se conectaban las áreas, cómo circulaba la información, dónde aparecían esperas o reprocesos y qué controles necesitaba la organización para operar con mayor eficiencia y ofrecer un servicio más consistente.

## El ERP: integrar lo que estaba suelto

<!-- seccion: el-erp -->

Lideré la implementación de un sistema de planificación de recursos empresariales ERP (Odoo) para integrar los procesos de la organización y fortalecer la coordinación entre sus áreas. El propósito no era únicamente reemplazar registros dispersos por una plataforma, sino construir una visión compartida de la operación y mejorar la calidad de la información utilizada para gestionarla.

Esta experiencia me enseñó tempranamente que el software no integra una organización por sí solo. La verdadera integración ocurre cuando las áreas acuerdan qué significa cada dato, quién es responsable de producirlo, qué reglas determinan su transformación y cómo debe utilizarse a lo largo del proceso. Gran parte del trabajo más importante tuvo lugar antes de la primera pantalla, al convertir actividades, decisiones y excepciones en definiciones que el sistema pudiera representar.

Implementar el ERP también me permitió comprender que digitalizar un proceso sin revisarlo puede trasladar sus inconsistencias a la tecnología. Por eso, antes de configurar la solución, fue necesario hacer visible cómo funcionaba realmente la organización, diferenciar el proceso definido del proceso ejecutado y establecer una base común para integrar personas, activos, información y responsabilidades.

## Las bases de datos que no existían

<!-- seccion: las-bases-de-datos -->

Para evaluar los procesos necesitaba indicadores confiables, pero una parte importante de la información requerida no existía, no se capturaba de forma consistente o permanecía distribuida entre diferentes registros. Me habían encargado mejorar la operación y descubrí que no podía hacerlo rigurosamente sin construir primero la información necesaria para medirla.

Diseñé e implementé estructuras de bases de datos para organizar los eventos operativos, mejorar la precisión de los análisis y hacer posible el seguimiento de métricas relevantes. Este fue el punto en el que mi trayectoria comenzó a orientarse hacia los datos, no como un cambio deliberado de profesión, sino como una consecuencia natural del problema que necesitaba resolver.

Allí comprendí que un indicador confiable no comienza en un reporte. Comienza en la definición del proceso, en la captura correcta de sus eventos, en las relaciones entre sus entidades y en las reglas que preservan el significado de la información. Este aprendizaje se convirtió posteriormente en la base de mi trabajo con pipelines de datos, modelos semánticos, Power BI y plataformas analíticas empresariales.

También aprendí que la arquitectura de datos debe comenzar en la decisión que se quiere habilitar. Para conocer la disponibilidad real de una máquina, por ejemplo, no bastaba con incluirla en un inventario. Era necesario representar su estado operativo, ubicación, programación, utilización y condición de mantenimiento. La calidad del análisis dependía directamente de la fidelidad con la que los datos describieran la operación.

## Cadena de suministro e ISO 9001

<!-- seccion: cadena-e-iso -->

También lideré iniciativas de optimización de la cadena de suministro orientadas a reducir costos operativos, fortalecer la coordinación de recursos y asegurar el cumplimiento de los requisitos asociados con la norma ISO 9001:2015. Esta responsabilidad amplió mi visión desde el desempeño de actividades individuales hacia la forma en que proveedores, recursos, información y controles determinaban conjuntamente la calidad del servicio.

El análisis de la operación me llevó además a considerar las condiciones humanas bajo las cuales se ejecutaba el trabajo. Al estudiar tiempos, cargas y distribución de actividades, incorporé la consideración de holguras asociadas a la fatiga para evitar que un tiempo observado se convirtiera automáticamente en un estándar difícil de sostener. Comprendí que medir productividad exige considerar el esfuerzo, la repetitividad, las condiciones de ejecución y la variabilidad propia del trabajo humano.

Este aprendizaje fue importante porque me enseñó a no interpretar los indicadores fuera de su contexto. Una mejora aparente en velocidad puede producir más errores, aumentar el reproceso o trasladar una carga excesiva hacia otra parte del sistema. Optimizar no consiste en maximizar aisladamente una métrica, sino en encontrar un equilibrio sostenible entre capacidad, calidad, costo, servicio y condiciones de trabajo.

La norma ISO 9001:2015 fue, a su vez, mi primera escuela formal de trazabilidad y rigor documental. No bastaba con que un proceso funcionara. Era necesario definir cómo debía funcionar, quién respondía por cada actividad, qué controles se aplicaban y qué evidencia permitía demostrar el cumplimiento. Aprendí que la calidad no debe depender de la memoria de las personas, sino de una forma de trabajo que pueda ser comprendida, verificada y repetida.

Esta experiencia también consolidó mi afinidad por los estándares como instrumentos para convertir principios en sistemas de gestión verificables y sostenibles. Haber desarrollado desde temprano una forma de trabajo basada en procesos, responsabilidades, controles, evidencia y mejora continua me ha facilitado incorporar actualmente los principios y requisitos de ISO/IEC 42001:2025 en el liderazgo de la estrategia de inteligencia artificial, trasladando ese mismo rigor al gobierno, la evaluación de riesgos y la gestión responsable de las soluciones de IA.

Esa disciplina continúa presente en todo lo que construyo. Hoy la aplico en la trazabilidad de pipelines y modelos semánticos, en la documentación de aplicaciones y en la evaluación de soluciones y agentes de inteligencia artificial. Un dato debe conservar su procedencia, una transformación debe poder reproducirse y una respuesta generada mediante IA debe distinguir claramente entre aquello que proviene de una fuente, lo que fue calculado, lo que fue inferido y aquello que no se puede sostener con evidencia.

## El equipo de doce

<!-- seccion: el-equipo-de-doce -->

En esta primera experiencia también lideré un equipo de doce personas. La gestión del trabajo, la asignación clara de responsabilidades y el seguimiento de los compromisos contribuyeron a alcanzar una tasa de satisfacción del cliente del noventa y cinco por ciento.

Fue mi primera oportunidad para comprender que liderar no consiste en supervisar constantemente la actividad, sino en reducir la ambigüedad que impide ejecutar bien. Cuando las personas entienden qué resultado se espera, cuál es su responsabilidad, de qué información disponen y qué significa que una tarea esté realmente terminada, pueden trabajar con mayor autonomía y responder con más consistencia.

El resultado no provino de incrementar el control, sino de definir mejor el trabajo, hacer visibles las prioridades y convertir el seguimiento en un mecanismo de coordinación. Esta experiencia estableció la base de mi estilo de liderazgo actual: claridad en el propósito, responsabilidades explícitas, avance observable, autonomía proporcional a la capacidad y responsabilidad compartida sobre el resultado.

También comprendí que una operación no mejora de manera sostenible cuando el conocimiento permanece concentrado en una sola persona. Los procesos, criterios y controles deben quedar suficientemente claros para que el equipo pueda ejecutarlos, cuestionarlos y mejorarlos. Este principio continúa guiando la forma en que hoy lidero iniciativas de datos e inteligencia artificial: mi objetivo no es convertirme en el punto obligatorio de todas las decisiones, sino construir equipos y capacidades que puedan avanzar con criterio incluso cuando no estoy presente.

Vista en retrospectiva, Inglopres reunió los fundamentos de todo lo que construiría después. Allí aprendí a comprender una operación como sistema, traducir procesos en estructuras de información, integrar áreas mediante tecnología, medir con atención al contexto, gestionar con evidencia y liderar desde la claridad. Todavía no hablaba de modelos semánticos, plataformas analíticas o arquitecturas de inteligencia artificial, pero ya trabajaba sobre los problemas que esas capacidades me permitirían abordar posteriormente con mayor profundidad y escala.