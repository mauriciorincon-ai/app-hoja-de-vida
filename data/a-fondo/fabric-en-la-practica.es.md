---
slug: fabric-en-la-practica
titulo: "Microsoft Fabric en la práctica"
resumen: "Cómo trabajo Fabric por dentro: lakehouse y warehouse sobre OneLake en Vesting (120 tablas, 20 GB), Power Query y pipelines con validaciones, el modelo semántico optimizado con DAX Studio y Tabular Editor, Direct Lake, RLS, y Power BI como experiencia de decisión."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry con Microsoft Fabric?"
  - "¿Qué sabe hacer con modelado semántico y DAX?"
  - "¿Qué es un lakehouse y lo ha usado?"
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

## Qué significa el DP-600 en trabajo concreto

<!-- seccion: que-significa-el-dp-600 -->

El **DP-600** —Fabric Analytics Engineer Associate, obtenido en diciembre de 2024— valida el
recorrido completo de una solución analítica sobre **Microsoft Fabric**: seleccionar el almacén,
preparar y transformar, diseñar el modelo dimensional, construir y optimizar el **modelo
semántico**, administrar su ciclo de vida y aplicar seguridad y gobierno, con SQL, KQL y **DAX**.

Lo preparé mientras construía en Vesting el ecosistema de datos de una startup de agentes de IA
sobre Fabric, con la plataforma a menos de un año de su disponibilidad general. Cada concepto se
contrastaba con una decisión real de arquitectura, rendimiento, modelado o consumo. No estudié
Fabric como una lista de servicios: lo entendí como un sistema por el que los datos recorren un
proceso —ingresan, se almacenan, se transforman, adquieren significado, se convierten en modelo
semántico y llegan a personas, aplicaciones o agentes—, que es exactamente cómo un ingeniero
industrial mira una planta. El detalle de la certificación está en su documento.

## El lakehouse y el warehouse: dos formas de servir los datos

<!-- seccion: lago-y-almacen -->

En Vesting diseñé sobre Fabric un ecosistema de **120 tablas y 20 GB** que combinaba
almacenamiento analítico, procesamiento distribuido y estructuras de consumo. La regla era
asignar cada carga al mecanismo adecuado según la naturaleza del dato y la consulta, no usar
componentes por sofisticación.

El **lakehouse** recibía y conservaba la información estructurada y semiestructurada de las
integraciones de los agentes: grandes volúmenes, procesamiento distribuido con **Spark**, y el
detalle suficiente para reconstruir sesiones y desarrollar transformaciones nuevas sin un esquema
relacional fijado desde el principio. Flexible no significa sin estructura: los datos avanzaban
por capas progresivamente más confiables, con reglas de calidad y significado reutilizable.

El **warehouse** cumplía la función complementaria: información estructurada, transformaciones y
vistas en **T-SQL**, y respuestas consistentes a cargas empresariales. No son «crudo» y
«terminado»: son estilos de desarrollo distintos —ingeniería y ciencia de datos con Spark, frente
a lo relacional con T-SQL—, y una arquitectura usa los dos cuando hay una razón funcional: el
lakehouse conserva y transforma eventos de alta granularidad; el warehouse organiza estructuras
para consumidores que necesitan relaciones y consultas predecibles.

**OneLake** integra ambos bajo formatos abiertos —Delta Parquet— y elimina copias, pero no
elimina el diseño: sigue habiendo que definir capas, convenciones, controles de calidad y qué
activo es la referencia para cada uso. La arquitectura correcta no es la de más componentes sino
la que organiza el recorrido del dato con la menor complejidad necesaria.

## Los pipelines: preparar, validar, no repetir

<!-- seccion: pipelines -->

La preparación empieza con **Power Query** y los pipelines de Fabric: conexión con las fuentes,
preparación, construcción de las tablas del modelo, como pasos separados y con nombres que se
entienden. En Banco Pichincha esa reorganización bajó un 35 % los tiempos de análisis; en Vesting,
cada flujo validaba la estructura de los eventos, conservaba los identificadores de contexto y
los normalizaba en el ingreso.

Tres decisiones se repiten en todos mis pipelines: seleccionar filas y columnas lo más temprano
posible y preservar el **plegado de consultas** hacia el origen cuando la fuente lo permite; tipos
de datos consistentes y lógica reutilizable en vez de repetida por consulta; y **validaciones
dentro del pipeline** —valores faltantes, tipos inesperados, duplicados— para que las excepciones
sean visibles antes de llegar al modelo, no en una revisión manual al final.

Un pipeline contiene decisiones de negocio —calidad, correspondencia, temporalidad,
granularidad— y se documenta como tal. Una consulta rápida pero ilegible es deuda técnica.

## El modelado semántico y DAX: donde se gana o se pierde la confianza

<!-- seccion: modelado-semantico -->

El **modelo semántico** es la capa menos visible y la que más determina el valor: donde las
tablas se vuelven entidades del negocio, las relaciones adquieren significado y las reglas de
cálculo se vuelven **medidas** que todos usan igual. Cuando dos personas llegan a una reunión con
cifras distintas para el mismo indicador, el problema casi nunca está en la gráfica: está en la
semántica, las relaciones o las transformaciones.

En Banco Pichincha **optimicé los modelos semánticos** que sostenían las soluciones de Power BI:
estructuras, relaciones, medidas, contextos de cálculo, organización de objetos y patrones que
generaban trabajo innecesario. Con **DAX Studio** observé el comportamiento interno de las
consultas, fijé líneas base de rendimiento e identifiqué las medidas costosas; con **Tabular
Editor** administré medidas, propiedades y metadatos para tratar el modelo como un activo de
ingeniería y no como una configuración interna del archivo.

En Vesting los modelos combinaban modos de almacenamiento según el uso: **Direct Lake** para lo
que debía verse al momento, importación para el histórico agregado, DirectQuery donde el detalle
no cabía en memoria. Y la seguridad forma parte del modelo: **seguridad a nivel de fila (RLS)**
para que cada usuario vea solo lo suyo sobre un mismo modelo, en vez de un modelo por audiencia.

El modelo semántico no crea el consenso: preserva la definición que los responsables del negocio
acordaron. Y es la representación estable que un agente de IA puede usar en vez de inferir
significados de estructuras técnicas aisladas.

## Power BI: la experiencia de decisión, no el objetivo

<!-- seccion: power-bi -->

**Power BI** atraviesa toda mi trayectoria: el análisis de la operación de TransMilenio, el BI de
control del WMS en Cafam, la adopción por más de 50 usuarios en Banco Pichincha y hoy los 42
productos analíticos de la Fundación CTIC. Con los años dejó de ser el entregable: el producto
visible es un tablero, pero el resultado esperado es una decisión mejor sustentada.

Por eso el desarrollo empieza antes de abrir la interfaz —proceso, audiencia, pregunta,
decisión— y separa el modelo semántico de la experiencia de consumo: el modelo concentra las
definiciones que necesitan gobierno; el reporte, la navegación y las preguntas de una audiencia.
Sobre una misma base de significado caben varias experiencias sin duplicar la lógica, y el
autoservicio queda gobernado: los usuarios exploran sin redefinir las métricas críticas.

La ingeniería industrial aporta el proceso —tableros por proceso, no por área, con indicadores de
resultado conectados a las condiciones que los producen— y el diseño industrial la interacción:
jerarquía, navegación comprensible y cada elemento justificando su espacio. Cómo se mide la
adopción, y el agente que construye reportes de Power BI completos, están en el documento de BI.

## El gobierno técnico de la plataforma

<!-- seccion: gobierno-tecnico -->

Gobernar la plataforma es controlar identidad, procedencia, significado, calidad y condiciones
de uso, no solo conceder permisos. En Vesting se resolvió desde el diseño: **workspaces
separados por cliente** —12 clientes— sobre estructuras de eventos comunes, identificadores y
contexto preservados desde el primer evento.

Fabric integra almacenamiento, procesamiento, modelado y consumo, y reduce las fronteras donde
suelen fragmentarse identidades, permisos y **linaje**; pero la plataforma no produce gobierno
sola. Sigue habiendo que organizar los espacios de trabajo, diferenciar ambientes, documentar
transformaciones y controlar cómo evolucionan los activos: el linaje debe permitir recorrer un
resultado desde Power BI hasta las transformaciones que lo sustentan, y un cambio de modelo o de
pipeline debe llegar a quien lo usa sin sorpresas. Cuando el consumidor es un agente, además:
qué aplicación puede usar qué dato, para qué y con qué supervisión. El marco completo está en el
documento de gobierno.

## Lo que estoy construyendo para demostrarlo en público

<!-- seccion: lo-publico -->

Mantengo en exploración una pieza de analítica de extremo a extremo sobre Fabric con datos
abiertos de Colombia: ingestión, lakehouse o warehouse justificado, modelo dimensional, modelo
semántico documentado y experiencia en Power BI, con la arquitectura y las reglas visibles y no
solo el tablero final. Sigue en exploración porque no cumple todavía los criterios para entrar
al inventario de piezas: cuando esté, será evidencia pública de lo que el DP-600 valida.
