---
slug: analitica-predictiva
titulo: "Analítica predictiva y modelos en producción"
resumen: "Los modelos que he llevado a producción, con qué herramientas y qué los sostiene."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué modelos predictivos ha construido Henry?"
  - "¿Qué herramientas de machine learning usa?"
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

## Dos modelos en producción, en dos sectores

<!-- seccion: dos-modelos -->

**Predicción de demanda en transporte masivo (C&M Consultores, 2021–2022).** Desarrollé un modelo de
predicción de la demanda con scikit-learn para optimizar decisiones estratégicas, con un aumento del
veinte por ciento en el rendimiento del sistema. Predecir cuánta gente se va a mover permite
programar mejor la flota.

**Modelos predictivos en banca (Banco Pichincha, 2023).** Desarrollé modelos de aprendizaje
automático con una precisión superior al noventa por ciento y una mejora del treinta y cinco por
ciento en las predicciones.

Los dos con la misma herramienta y en contextos completamente distintos, que es la parte que a mí
me parece relevante: el método viaja, el dominio no.

[CONFIRMAR — dos vacíos, y son los que un entrevistador técnico abre primero:
1. En TransMilenio: ¿qué variables usaba el modelo, a qué horizonte predecía y cuánto tiempo estuvo
   corriendo?
2. En Pichincha: ¿qué predecían los modelos? En banca puede ser riesgo, fuga, propensión o mora. Si
   hay límite de confidencialidad, se puede nombrar la familia sin el detalle.]

## Qué significa «en producción»

<!-- seccion: en-produccion -->

Lo digo con cuidado porque es la palabra que más se usa a la ligera. Un modelo en producción no es un
modelo que alcanzó buena precisión en un cuaderno: es uno del que alguien depende.

Eso implica cosas que no son de modelado: de dónde salen los datos cada día y qué pasa cuando faltan;
qué ocurre si el modelo se degrada y quién se entera; quién mira el resultado y qué decide con él; y
si se puede reconstruir por qué predijo lo que predijo hace tres semanas.

En Pichincha el contexto era justamente ese —el área tenía modelos que no llegaban a producción— y el
trabajo fue tanto de llevarlos como de construirlos.

## Las herramientas

<!-- seccion: las-herramientas -->

**Python con scikit-learn** es mi herramienta principal para modelado, y es la que usé en los dos
casos de producción. **Pandas y NumPy** para la manipulación, **Matplotlib y Seaborn** para la
exploración, **Jupyter** para el trabajo iterativo. Toda esa base está certificada por el Certificado
Profesional en Ciencia de Datos de IBM.

**R con RStudio, ggplot2 y Shiny**, por la certificación de Ciencia de Datos Aplicada con R de 2024,
con análisis estadístico, modelado predictivo, SQL integrado y un proyecto final con pruebas de
hipótesis. R lo estudié después de Python a propósito: el rigor estadístico se aprende mejor donde
la estadística es ciudadana de primera clase.

Mi hoja de vida también declara **PyTorch, TensorFlow, Watson Studio, Orange Data Mining, SPSS y
SAS**, y redes neuronales.

[CONFIRMAR: de esa segunda lista, ¿cuáles has usado en un trabajo real y cuáles vienen de formación
o de exploración? Lo pregunto porque prefiero que este documento distinga las dos cosas: una lista
que no separa lo dominado de lo visto se cae en la primera entrevista técnica.]

## La estadística que hay debajo

<!-- seccion: la-estadistica -->

Vengo del énfasis en Inteligencia Analítica de Datos de Ingeniería Industrial, donde el modelado y la
predicción de fenómenos industriales eran el contenido, no un electivo. Esa base explica una
costumbre: antes de un modelo, la pregunta de si el fenómeno es estable, si la variable mide lo que
dice medir y si hay suficiente historia.

Un modelo con noventa por ciento de precisión sobre una variable mal definida es un noventa por
ciento de nada. La mayoría de los fracasos que he visto no fueron de algoritmo.

## Donde lo aplico hoy

<!-- seccion: donde-lo-aplico-hoy -->

En mi propio pipeline construí **Probeta DS**, una aplicación publicada cuya promesa es «construye un
modelo que puedas defender»: corre pandas y scikit-learn dentro del navegador sobre WebAssembly, en
un hilo aparte, con treinta y tres funcionalidades y un noventa por ciento de cobertura de líneas.

El verbo «defender» es deliberado y resume mi postura sobre analítica predictiva: el objetivo no es
la métrica más alta, es poder explicar y sostener lo que el modelo dice cuando alguien pregunte.
