---
slug: los-tableros
titulo: "Los tableros: datos públicos, verificados"
resumen: "Seis tableros sellados sobre datos abiertos —banca, empresas, ciclo monetario, gasto del Estado, energía y clima, Fórmula 1— construidos con Power BI Desktop, Power Query, DAX, PBIR escrito por script y Python, con las identidades del origen corridas enteras y los límites a la vista."
estado: aprobado
ancla: "/vitrina/tableros"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué tableros ha publicado Henry?"
  - "¿Cómo verifica Henry que los datos de un tablero son correctos?"
  - "¿Ha trabajado con datos abiertos o fuentes públicas?"
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

Construí desde cero **seis tableros** sobre **datos abiertos** y los publiqué sellados en la vitrina,
cada uno con su ficha técnica. No son ejercicios de diseño: son productos analíticos completos,
de la evaluación de las fuentes al modelo semántico y la experiencia en **Power BI**, y existen
por la misma razón que el resto del portafolio: un currículum afirma y una pieza publicada
permite verificar. Cualquiera puede descargar las mismas fuentes, reproducir los cálculos y
cuestionar el modelado; esa posibilidad es lo que les da valor.

Todos siguen un mismo método frente a seis universos: comprender la fuente, modelar el dominio,
correr las identidades del origen, declarar la cobertura y los límites, y diseñar una experiencia
que respete la evidencia.

## Los seis universos

<!-- seccion: los-seis -->

| Tablero                                        | Universo                                                                 | La identidad que cierra                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| **Banca colombiana bajo la lupa**              | 11 años de estados financieros de las 81 entidades de crédito; 1.094 municipios con oficina | el balance cierra en **7.779 de 7.779** combinaciones; la solvencia se reproduce en 3.809 de 3.811 |
| **Las empresas de Colombia en cifras**         | 8 años, 39.276 sociedades, 224.190 declaraciones, 6.443.634 filas de hechos | descuadre en las cuatro identidades contables: **0 pesos**; cobertura del ranking de las 10.000 mayores: 84,9 % |
| **Tasas, inflación y deuda: el ciclo monetario** | 27 años, 41 áreas, 7 organismos                                        | las dos fuentes oficiales de la curva de EE. UU. coinciden en **71.999 de 71.999** pares |
| **¿En qué gasta el Estado colombiano y con quién?** | 4.373.766 contratos y 8 años de presupuesto nacional                | la cifra de control validada contra la apropiación que aprobó el Congreso; **21 contratos** con valores imposibles, excluidos y publicados uno por uno |
| **Energía y clima**                            | 7 fuentes abiertas, 1.925.420 filas de hechos, 12 páginas en dos idiomas | **43 medidas DAX** validadas una por una; 0 de 354 referencias rotas entre reporte y modelo |
| **Fórmula 1: 77 temporadas contadas bien**     | 917 pilotos, 186.216 filas en 25 tablas                                  | **20 de 20** identidades del origen reproducidas; 0 errores en cinco capas de validación |

Cada uno tiene además una cifra que solo se ve corriendo el universo entero: la cuenta de
«ingresos» de la banca contiene 506,5 billones de los que el 56 % es valoración bruta, y sumar
lo acumulado infla un resultado anual 6,39 veces; el 77 % de los contratos públicos se adjudica
sin competencia; solo 3 de 11 bancos centrales tienen la tasa por debajo de su inflación.

## El stack real

<!-- seccion: el-stack -->

Los seis se construyen con el mismo stack, declarado en cada ficha: **Power BI Desktop**, **Power
Query** en lenguaje M para la preparación, **DAX** para las medidas, el reporte en **PBIR escrito
por script** —doce páginas, seis en español y seis en inglés, generadas con **Python** desde un
solo juego de medidas, que falla ante un color huérfano o un enlace roto— y las APIs de los
organismos: SODA de Socrata para los datos abiertos colombianos, SDMX y REST para los
internacionales.

Ninguno usa Microsoft Fabric: son piezas de escritorio publicadas como proyecto versionado. Donde
sí monté Fabric de extremo a extremo fue en Vesting, y eso está en su documento. También he
trabajado con Shiny en R, Tableau y Looker Studio, con menos profundidad; Power BI es donde está
la especialidad, desde la preparación hasta la experiencia.

Herramientas como DAX Studio y Tabular Editor entran cuando el modelo lo pide; el modelo
semántico y el reporte se tratan como componentes distintos, para que una misma base de
significado sostenga varias experiencias sin duplicar la lógica.

## Las identidades tienen que cerrar

<!-- seccion: las-identidades -->

La regla que comparten los seis: las identidades que el origen define o garantiza tienen que
cerrar, y se corren **sobre el universo completo, no sobre una muestra**. Una identidad es un
invariante —activo igual a pasivo más patrimonio; los veinte totales que publica el propio origen
de la F1— y si deja de cumplirse tras integrar y transformar, algo pasó en el pipeline, en el
modelo o en la fuente, y hay que explicarlo.

Hay dos controles distintos y conviene nombrarlos distinto: la **identidad**, invariante interno,
y la **conciliación con una fuente externa**, como la cifra de control del gasto público contra el
presupuesto aprobado por el Congreso. Y hay un tercero, previo: en banca, un **preflight**
independiente predijo nueve conteos desde los CSV crudos antes de tocar Power BI, y acertó los nueve.

La validación no asume que la publicación es infalible, pero tampoco la modifica en silencio para
obligarla a cerrar. En Fórmula 1, tres de las veinte identidades no cerraban al principio y
destaparon **reglas del deporte, no errores de código**: hasta 1990 solo contaban los mejores
resultados, y hay 13 carreras donde la pole no es el mejor tiempo. En el gasto público, los 21
contratos con valores imposibles no se borran: se excluyen del hecho y se publican. Un control
que no se ha visto en rojo no ha demostrado nada.

## Publicar la cobertura y los límites

<!-- seccion: cobertura-y-limites -->

Cada tablero dice qué no puede sostener, cerca de donde puede afectar la interpretación. Todos
comparten el primer límite: **los datos son una foto fechada, no una conexión viva**, y se
actualizan cuando se corre la descarga. Después, cada universo tiene los suyos: en empresas, el
universo son las sociedades que reportan a la Superintendencia y la cobertura se mide en una
página propia; en el ciclo monetario, la tasa real solo existe para 30 de las 41 áreas; en Fórmula
1, las paradas en boxes existen desde 1994 y los puntos de sprint desde 2021; en energía, la
mitad del inventario de centrales no trae año de puesta en marcha.

Y cada ficha publica sus **«nunca»**: nunca sumar consolidados con individuales, porque serían la
misma matriz contada dos veces; nunca usar la suma de países como total global; nunca restar dos
series de temperatura con periodos base distintos; nunca sumar presupuesto nacional con
contratación, porque son dos universos; nunca decir «los pilotos» a secas cuando el censo da tres
cifras. Distinguir ausencia de cero, conservar los cambios metodológicos visibles y no
reemplazar faltantes por ceros son parte del mismo hábito.

## Qué demuestran los seis tableros

<!-- seccion: que-demuestran -->

Ingeniería de datos y analítica de extremo a extremo, 6 veces, sobre fuentes que cualquiera puede
contrastar: integrar estructuras heterogéneas, conservar granularidad, construir modelos
dimensionales y **medidas** que representan conceptos reales, probar la calidad con controles que
saben ponerse en rojo, y publicar la cobertura como parte del resultado. Es la misma forma de
trabajo que apliqué en transporte, logística, banca y agentes de IA, con una diferencia: aquí las
fuentes, las decisiones y los resultados se pueden examinar sin pedir permiso.
