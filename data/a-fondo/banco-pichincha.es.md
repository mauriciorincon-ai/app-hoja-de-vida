---
slug: banco-pichincha
titulo: "Banco Pichincha — BI que el negocio sí usa (2023)"
resumen: "Cinco meses en banca: dashboards adoptados por 50+ usuarios (+25 % en decisiones), ETL −35 %, modelos de fuga, mora y riesgo en producción con scikit-learn (>90 %), un equipo de 5, 12 profesionales formados y el gobierno de datos co-liderado."
estado: borrador
ancla: "/proyectos/banco-pichincha"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué hizo Henry en Banco Pichincha?"
  - "¿Cómo logra que el negocio use los tableros?"
  - "¿Ha llevado un modelo de machine learning a producción?"
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
Cómo lograste la adopción (el problema difícil de BI), qué hiciste
distinto con los dashboards, el programa de formación, los modelos
predictivos en producción. -->

## El problema real no era solo técnico

<!-- seccion: el-problema-real -->

Entré a **Banco Pichincha en marzo de 2023** como Analista Senior de Analítica y Reportes y estuve
hasta julio del mismo año. Fueron cinco meses, y fue mi paso por el **sector financiero**: en
**banca** el dato tiene dueño, regulación y consecuencia, y eso cambia cómo se construye todo.

El área producía tableros que el negocio no terminaba de adoptar, con procesos **ETL** lentos y
modelos predictivos que no llegaban a producción. El problema no era la herramienta: era la
distancia entre lo que se construía y las decisiones que alguien tenía que tomar.

Mi trabajo fue reducir esa distancia con un **equipo de 5 personas a cargo**: entender qué
decisiones necesitaban respaldo, qué información requerían, quién respondía por cada definición
y cómo debían estructurarse los productos analíticos para entrar en el trabajo diario. Cada
solución se trató como una cadena completa: preparación confiable, definiciones consistentes,
modelo semántico, medidas verificables, experiencia de decisión.

Los procesos los modelé en BPMN con Bizagi antes de tocar los datos, porque un tablero sobre un
proceso que nadie ha dibujado responde preguntas que nadie hizo.

## La adopción, medida

<!-- seccion: la-adopcion-medida -->

Diseñé, con el equipo, los dashboards orientados a decisión que adoptaron **más de 50 usuarios**
del negocio, con una **mejora del 25 % en la toma de decisiones** asociada a esos productos. El
objetivo nunca fue tener más reportes: fue que los usaran quienes decidían.

El diseño partía de la decisión y no del dato disponible: qué situación hay que observar, qué se
puede decidir, qué nivel de detalle se necesita y con qué frecuencia. Cada tablero ofrecía una
ruta desde la visión general hasta la evidencia, y la consistencia era parte de la adopción: si un tablero y otro calculan distinto el mismo concepto, el usuario compara herramientas en vez de
analizar la realidad.

La publicación no es el final del proyecto. El producto analítico dejó de ser un repositorio y
pasó a ser un servicio: reducir incertidumbre, organizar la conversación y sostener decisiones
recurrentes. Cómo se mide esa adopción, y por qué no son visitas, está en el documento de BI.

## El programa de formación

<!-- seccion: programa-de-formacion -->

Para sostener la adopción diseñé y dicté un **programa de formación a 12 profesionales** del
banco. No enseñaba funciones de una herramienta: recorría la solución analítica completa, sobre
situaciones reales de los participantes.

- **Power Query**: transformaciones claras, preparación reproducible, menos trabajo manual.
- **Modelado semántico**: entidades del negocio, relaciones, sin repetir la misma lógica en cada reporte.
- **DAX**: medidas comprensibles y reutilizables; razonar sobre filtros, relaciones y tiempo.
- **Visualización y comunicación ejecutiva**: organizar alrededor de una pregunta, separar contexto de evidencia.
- **Acompañamiento** sobre los productos de cada participante, para que el aprendizaje llegara al trabajo.

El programa contribuyó a un **aumento del 20 % en la productividad en la preparación y uso de la
información** de los participantes. El resultado más importante fue la capacidad instalada: el
banco no solo recibió productos, fortaleció personas. Y el autoservicio necesita límites: ampliar
la capacidad de los usuarios no significa que cada uno redefina las métricas.

## El ETL y la preparación de los datos

<!-- seccion: el-etl-y-la-preparacion -->

Optimicé los procesos **ETL** de preparación de información de las soluciones de Power BI, con
**Power Query**, y los tiempos de análisis **bajaron un 35 %**, con más consistencia en los
resultados.

Estructuré las consultas para separar la conexión con las fuentes, la preparación y la
construcción de las tablas del modelo; prioricé la selección temprana de filas y columnas, tipos
de datos consistentes y lógica reutilizable; y, cuando la fuente lo permitía, empujé las
transformaciones hacia el origen. Incorporé validaciones para valores faltantes, tipos
inesperados y duplicados, para que las excepciones fueran visibles antes de llegar al modelo.

Una consulta más rápida pero ilegible es deuda técnica. Los pasos conservan una secuencia lógica
y nombres comprensibles, porque la calidad de un reporte se decide en la preparación.

## El modelo semántico y su optimización

<!-- seccion: modelos-semanticos-y-optimizacion -->

Optimicé los **modelos semánticos** que sostenían las soluciones de Power BI. El potencial de la
plataforma no está en producir archivos independientes sino en una capa compartida de
significado: relaciones, dimensiones, tablas de hechos y medidas centralizadas, con convenciones
para nombrar objetos y agrupar medidas, de modo que una misma definición sirva en todos los
análisis.

Usé **DAX Studio** para analizar el comportamiento de consultas y medidas, encontrar cálculos
costosos y comparar antes y después de cada ajuste, y **Tabular Editor** para revisar propiedades,
administrar medidas y mantener el modelo ordenado. La optimización técnica tenía una consecuencia
directa sobre la adopción: un modelo lento o ambiguo debilita la confianza y aumenta la
dependencia del equipo que lo creó.

Es la capacidad que hoy distingue mi perfil: **Power BI de extremo a extremo**, de la preparación
al modelo, de las medidas a la experiencia de decisión. Cómo se modela y se optimiza, con detalle,
está en el documento de Fabric.

## Los modelos predictivos

<!-- seccion: modelos-predictivos -->

Entrené y llevé a producción modelos de **machine learning** —con **scikit-learn**— para predecir **fuga de
clientes, mora y riesgo**: anticipar qué cliente puede irse, qué obligación puede dejar de pagarse y qué
operación concentra riesgo, para que el negocio actúe antes y no después.

Los resultados reportados superaron el **90 % de precisión** y mejoraron **hasta un 35 % las
predicciones** frente a lo que había. El trabajo previo pesó tanto como el algoritmo: preparar
variables consistentes, usar solo información disponible en el momento de predecir —sin filtrar
el futuro hacia el entrenamiento— y evaluar por segmentos, porque en banca una métrica global
esconde el error donde más cuesta.

La predicción se integró con Power BI para que llegara a quien la interpretaba, acompañada de
contexto y sin presentarse como decisión automática. Ese fue el puente entre la inteligencia de
negocios y la inteligencia artificial: el modelo genera la señal, el producto la contextualiza,
la persona decide. Cómo se evalúan los errores y cómo se sostiene un modelo en producción está en
el documento de analítica predictiva.

## El gobierno de datos

<!-- seccion: gobierno-de-datos -->

**Co-lideré** la iniciativa de gobierno de datos de Banco Pichincha para fortalecer la seguridad, la calidad y la
confiabilidad de la información. Mantengo el «co-»: el gobierno no se construye como iniciativa
individual ni desde una sola área.

Mi contribución fue conectar las necesidades analíticas con prácticas concretas: definiciones
compartidas por métrica, responsables por conjunto de datos, criterios mínimos de calidad según
el uso y accesos definidos por propósito, no por conveniencia. Seguridad y usabilidad no eran
objetivos incompatibles: el gobierno existe para que la información correcta llegue a las
personas adecuadas bajo condiciones claras.

## Lo que Banco Pichincha consolidó

<!-- seccion: lo-que-pichincha-consolido -->

Banco Pichincha fue donde consolidé mi profundidad en inteligencia de negocios y la amplié a una
visión de plataforma: Power Query preparaba, el modelo semántico organizaba el significado, DAX
convertía definiciones en medidas, los modelos anticipaban y el gobierno sostenía la confianza.
Cinco meses, nueve cifras y un equipo de cinco.

Fue el puente hacia lo que vino después: llegué construyendo productos analíticos y salí
entendiendo las condiciones para que esos productos se vuelvan capacidades de la organización.
