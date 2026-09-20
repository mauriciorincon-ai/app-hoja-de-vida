---
slug: cafam
titulo: "Cafam — el WMS y el equipo de 20 (2020–2021)"
resumen: "La implementación de Oracle WMS Cloud en un centro de distribución de medicamentos: 20 personas en pruebas durante seis meses, el BI de control, las integraciones en VBA y la calidad del dato en SQL."
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

Entré a **Cafam en octubre de 2020** como Analista de Sistemas de Información y de Proyectos y
estuve hasta junio de 2021. Mi responsabilidad fue la implementación de un **WMS** —un sistema de
gestión de almacenes, en este caso **Oracle WMS Cloud**— en el centro de distribución de
**medicamentos**: una operación donde cada error de inventario tiene un costo y, a veces, un
paciente detrás.

Cambiar el sistema que gobierna una bodega es de las intervenciones más delicadas de una
operación logística. El WMS tiene que representar con precisión qué productos hay, dónde están,
en qué cantidad, qué movimientos han hecho y en qué estado se encuentran, y hacerlo mientras la
operación sigue despachando.

El reto no era instalar una aplicación. Era demostrar que el sistema interpretaba bien la
operación, ejecutaba sus reglas, se integraba con los demás componentes y conservaba la
consistencia de la información en cada movimiento. Y hacerlo sin frenar el despacho.

Antes de probar nada, modelé el proceso del centro de distribución en **BPMN con Bizagi**
—recepción, almacenamiento, alistamiento, despacho— y simulé en **FlexSim** el despacho de
medicamentos para entender dónde una regla del nuevo sistema podía crear una cola que hoy no
existía. Implementar una plataforma empresarial exige intervenir a la vez procesos, datos,
tecnología y formas de trabajo; si uno cambia y los otros no, la solución no llega a su propósito.

## El equipo de veinte: el más grande que he liderado

<!-- seccion: el-equipo-de-veinte -->

Lideré un equipo mixto de **20 personas** durante la fase de pruebas: **14 de Cafam y 6 de
Oracle**, que acababa de adquirir el producto y lo estaba implantando con sus propios
especialistas. La combinación reunía los dos conocimientos indispensables: el equipo interno
sabía cómo funcionaba de verdad el centro de distribución; el del proveedor sabía cómo se
comportaba el sistema.

La fase de pruebas duró **unos seis meses**. No fue una validación puntual antes de salir a
producción sino un proceso sostenido para verificar funcionalidades, reglas, datos, recorridos
operativos, integraciones y excepciones, ciclo tras ciclo.

Coordinar un equipo mixto exigía un lenguaje común entre operación y tecnología. Una situación
que el usuario describía como «un problema de inventario» había que convertirla en un escenario
reproducible: entradas conocidas, pasos definidos, resultado esperado y evidencia suficiente para
decidir si era una falla del sistema, un dato mal cargado o una regla del proceso que nadie había
escrito.

El reto de coordinación no era repartir casos de prueba. Era asegurar **cobertura**, evitar
duplicidades, mantener consistencia en la ejecución y hacer visible qué partes del sistema
estaban validadas, cuáles pendientes y dónde había bloqueos; y que el proveedor no resolviera
cada hallazgo solo, sino que el equipo interno entendiera la lógica, los parámetros y los límites
del sistema que iba a operar después.

La coordinación del equipo contribuyó a **reducir los errores un 25 %** y a **mejorar la
eficiencia operativa un 15 %**: la exactitud de registro de inventario (**ERI**) es lo que esos
dos números miden. No vinieron de más supervisión sino de trabajo mejor definido, criterios
claros y avance visible.

## De las pruebas al ajuste del proceso y la parametrización

<!-- seccion: pruebas-y-parametrizacion -->

Terminada la fase principal de pruebas, el trabajo pasó al ajuste de los procesos y a la
**parametrización** de Oracle WMS Cloud: configurarlo sin modificar su código, que es distinto de
personalizarlo. Los hallazgos de seis meses de pruebas con el equipo de Cafam y Oracle decían qué diferencias se resolvían con
configuración, cuáles exigían cambiar el procedimiento y cuáles eran, de verdad, un defecto.

El criterio no era solo que la plataforma funcionara: era proteger la continuidad de una
operación crítica. Cada ajuste se evaluaba por su efecto sobre el inventario, el flujo de
materiales, la trazabilidad y la capacidad de despacho.

No toda diferencia entre el sistema y la operación era una falla del software. A veces la
plataforma hacía visible una regla ambigua o un procedimiento que dependía de decisiones
informales; otras, el proceso tenía una necesidad legítima que el sistema no cubría tal cual. La
parametrización fue el punto de encuentro: cada ajuste definía cómo se comportaría la solución
frente a determinadas entidades, estados, reglas y excepciones.

Ahí aprendí que las pruebas no son una actividad posterior al desarrollo. Son la forma de
descubrir conocimiento sobre el sistema y sobre el proceso que lo usa.

## El BI de control de la implementación

<!-- seccion: el-bi-de-control -->

Diseñé los informes de inteligencia de negocios y los tableros con los que se controló la propia
implementación. Mejoraron un **50 % la precisión del seguimiento** de las pruebas y los adoptaron
**más de 15 usuarios** del proyecto: el director de medicamentos, el director de TI, el director
del proyecto, el director del centro de distribución y sus coordinadores y jefes.

El tablero más valioso no describía la operación habitual sino el avance de la transformación
mientras ocurría: escenarios ejecutados, cobertura alcanzada, resultados, defectos encontrados,
responsables y bloqueos. Los indicadores iban a lo largo del ciclo de pruebas: no bastaba contar
casos ejecutados; había que ver su cobertura, estado, criticidad, tasa de aprobación, reincidencia
y tiempo de resolución, y la relación de cada hallazgo con los ajustes de parametrización.

Un proyecto tecnológico también se instrumenta. Cuando el avance, los bloqueos, la calidad y los
riesgos son visibles cada día, el proyecto se gobierna con evidencia y no con la sensación de
avance. Y la adopción se diseñó: los directores usaron los tableros porque respondían a sus
preguntas de coordinación y les ahorraban esfuerzo para saber en qué iba el proyecto.

## Las integraciones en VBA

<!-- seccion: integraciones-vba -->

Desarrollé aplicaciones en **VBA** para integrar actividades del centro de distribución con el
WMS: cargas de datos que antes dependían de manipulación manual pasaron a aplicar reglas de
forma repetible. Aumentaron la **automatización un 15 %** y **redujeron los errores de datos un
50 %**.

VBA fue la elección correcta para ese contexto: una herramienta accesible para la organización,
compatible con lo que usaban los equipos y lo bastante flexible para cerrar brechas que
amenazaban la continuidad del proceso. Su propósito no era mantener una arquitectura paralela al
WMS sino resolver lo que el sistema central todavía no cubría; y siguieron corriendo después de
la salida a producción, como piezas periféricas conocidas, con dueño y con límite.

Ahí aprendí a reconocer el valor y también el riesgo de las soluciones periféricas: resuelven
una necesidad urgente y pueden volverse un componente crítico que nadie gobierna. Se diseñan
sabiendo cómo se relacionan con el sistema central, qué dependencias tienen y cuándo se retiran.

## La calidad del dato, en SQL

<!-- seccion: calidad-en-sql -->

Establecí en **SQL** las mejoras de **calidad de datos** de la información que circulaba entre sistemas y contribuí a mejorar
un **20 % la precisión y confiabilidad** de la información que usaba el WMS.

La parte compleja no estaba dentro de una aplicación sino en las fronteras entre ellas. Dos
sistemas correctos por separado producían inconsistencias al intercambiar identificadores,
estados, cantidades, fechas o reglas. Con SQL recorría la información, contrastaba fuentes,
encontraba registros faltantes, duplicados y relaciones rotas, y localizaba dónde se originaba
la diferencia entre el estado esperado y el observado.

El método fue de ingeniería industrial: **validación por medicamentos con criterio 80-20**. Se
tomaron los medicamentos principales —los que concentraban el volumen— y al principio ninguno
coincidía entre el WMS y el sistema de origen. Se fue ajustando de a poco, priorizando esos
medicamentos, hasta que la conciliación se volvió una revisión permanente y no un cierre de
proyecto. Como herramienta complementaria de análisis usé también SAS.

Aprendí que la calidad no es una propiedad abstracta: un dato puede ser válido en su formato y
no ser lo bastante oportuno, completo o consistente para una decisión concreta. Y que los
controles van dentro del pipeline, cerca del origen, no en una revisión manual al final. Un
modelo procesa rápido, pero no arregla un dato contradictorio: lo propaga más rápido.

## Lo que Cafam consolidó

<!-- seccion: lo-que-cafam-consolido -->

Cafam fue la experiencia en la que integré de forma más directa procesos, aplicaciones
empresariales, datos, pruebas, automatización y liderazgo multidisciplinario: seis meses con 20
personas, un BI para gobernar el proyecto, integraciones que cerraban brechas y la calidad del
dato vigilada en SQL.

Me enseñó a traducir en las dos direcciones. Del negocio al sistema: una queja de inventario se
convierte en un escenario reproducible con entradas, pasos y resultado esperado. Del sistema al
negocio: un parámetro se explica por su efecto sobre el inventario, la trazabilidad y la
continuidad del despacho.

Y dejó una pregunta que sigue vigente en mi trabajo: cómo transformar una plataforma empresarial
sin intentar reemplazar a la vez todas sus capacidades. El orden importa, y las piezas
periféricas —conocidas, con dueño y con fecha de retiro— son parte del diseño.
