---
slug: analitica-predictiva
titulo: "Predictive analytics"
resumen: "Two families of models in production with scikit-learn —SITP demand by route and time band, and churn, delinquency and risk in banking with over 90% accuracy—, the machine learning tools I use and at what level, the statistics and feature engineering that hold the model up, and Probeta DS."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What predictive models has Henry built?"
  - "What machine learning tools does he use?"
  - "Has he taken a machine learning model to production?"
---

<!--
⚠ PRIVACY — READ THIS BEFORE WRITING ⚠
This repository is public and the chat quotes this content to any visitor.
DO NOT write: confidential data of employers or clients, salaries, names of
third parties who have not agreed to appear, addresses, phone numbers, emails
or sensitive personal information. The build's customs check catches the
mechanical part (emails, phone numbers, ID documents, web addresses); PROPER
NAMES are not caught by a regex — those are your call.

HOW THIS FILE IS WRITTEN
- Normal prose, in the first person, in paragraphs.
- Every subsection starts with a `##` title followed by a comment
  `<!-- seccion: id -->`. Those are the ONLY 2 marks.

- `estado: borrador` → the chat does NOT index it and no English twin is required.
  `estado: aprobado` → the chat indexes it and requires the complete `.en.md`
  twin, subsection by subsection.
- No figure, date or achievement without a source. Whatever is missing goes as
  the CONFIRMAR marker described in the manual, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
  -->

## Two families of models in two different sectors

<!-- seccion: dos-modelos -->

I have taken **machine learning** models to production in two contexts that do not resemble each
other: demand planning in mass transit and anticipating customer behavior in banking. The method
travels; the phenomenon, the horizon, the cost of error and the way the result is used are
designed anew in each one.

At **TransMilenio**, with C&M Consultores, I developed with **scikit-learn** a model of **demand by
route and time band** with monthly updates: day type and hour for the recurring patterns, route
for the differences between services and zones, civil works, events and traffic for the
exceptions. It was validated with RMSE respecting the temporal order, ran for ten months and fed
the demand report the units scheduled with; it contributed to a reported 20% improvement in the
system's performance.

At **Banco Pichincha** I trained and took to production models of **customer churn, delinquency
and risk**: which customer may leave, which obligation may stop being paid, which operation
concentrates risk. The reported results exceeded **90% accuracy** and improved the existing
predictions by up to 35%, figures that are interpreted within their populations, horizons and
metrics. In both cases the model generated evidence for a decision; never the decision.

## What it means to take a model to production

<!-- seccion: en-produccion -->

I use the expression "model in production" with care. A model is not in production because it has
a high metric in a notebook: it is in production when its predictions enter a real process,
arrive within the decision cycle, use only information available at that moment and have someone
responsible who interprets them and acts.

At TransMilenio the prediction entered the monthly demand report; at Banco Pichincha, the
prioritization of retention and collection actions. That demands a reproducible pipeline —data
located, validated and transformed with the same rules—, the same variables in training and in
inference, and every prediction with its date, its version and its population, so that weeks
later one can reconstruct which model intervened and with what data. It demands controls for when
a source arrives incomplete or changes distribution, before the model produces valid results over
defective inputs. And it demands responsibility over time: data change, variables lose their
explanatory power and the model needs follow-up, review and criteria to be updated or retired.

## The programming languages and the tools: Python, R, SQL, and at what level

<!-- seccion: las-herramientas -->

The programming languages I work with are Python, R, SQL and DAX; my deepest experience and most advanced level is in Python. I do not present the tools as equivalent. This is the honest list:

| Tool                                                              | Level                                    | Where                                      |
| ----------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------ |
| **Python** with **scikit-learn**, Pandas, NumPy                   | real work in production                  | Banco Pichincha, TransMilenio, Vesting     |
| Matplotlib, Seaborn, Jupyter                                      | real work, exploration and documentation | every modeling project                     |
| **R**, RStudio, ggplot2, Shiny                                    | real work, statistical analysis          | 2024 IBM certification and my own analyses |
| SQL                                                               | real work                                | from Inglopres to today                    |
| **PyTorch**, **TensorFlow**                                       | exploration                              | neural networks, no production case        |
| Watson Studio                                                     | exploration                              | analytical flows                           |
| Orange, SPSS                                                      | training                                 | university                                 |
| SAS                                                               | complementary work and training          | Cafam, as an analysis tool                 |
| Natural language processing (NLP), on large language models (LLM) | real work                                | several of my agents use it permanently    |

The algorithm matters less than the quality with which the problem is formulated, the variables
are built, the errors are evaluated and the output is connected to a decision. I choose by the
phenomenon, the volume, the need for interpretation and the environment where the result is
integrated.

## The statistics that hold the model up

<!-- seccion: la-estadistica -->

My relationship with prediction began in the Data Analytics Intelligence emphasis of Industrial
Engineering, between 2009 and 2016, as a way of understanding systems and not as a programming
course. From there, a discipline: before training, knowing whether the phenomenon has enough
history, whether the variables measure what they claim to measure, whether the population is
comparable and whether something changed the relationship.

Statistics distinguishes an observed association from a sustainable conclusion: variability,
uncertainty, sample size, biases, outliers. I distinguish prediction from causality —that a
variable anticipates a result does not prove that intervening on it changes it— and I watch
temporal stability: the model learns from the past and the organization decides whether that past
is still a reference. A model with a high metric on a badly defined variable is a weak solution.
**Accuracy** does not correct a wrong concept.

## Feature engineering connects the process with the model

<!-- seccion: ingenieria-de-variables -->

Variables do not come finished in the sources: they are built from events, states, relationships
and time windows. Understanding the process —the industrial engineering part— tells which events
anticipate a result, which accumulation reflects a constraint and which external condition
changes the behavior.

In transit, day type, route, hour, civil works, events and traffic were mechanisms that move
demand, not available fields. In banking, every behavioral variable had to be computed only with
information prior to the target event: nothing from the future leaked into training. And the
transformation that builds a variable in training has to be the same in inference: a small
difference changes the input distribution and degrades the result. That is why variables carry
rules, version and tests, and a governed base —like the one DP-600 describes— avoids building
them differently in every product.

## Watching the model after deploying it

<!-- seccion: monitoreo-del-modelo -->

A model degrades without warning. **Drift** —of the input data, of the relationship the model
learned, of the population— is the risk that the initial **validation** does not cover, and it is
watched in production: distribution of the inputs against that of training, quality of the
sources, performance by segment against the real outcome when it arrives, and the use the people
responsible make of the prediction.

I do not have a case of observed drift of my own to tell; what I did build is the infrastructure
to see it: at Vesting, the real-time monitoring of 23 agents collected per session what a model
needs in order to be watched —inputs, outputs, times, states, cost—. The AI-300 path formalizes
this half of MLOps.

## Probeta DS: building a model that can be defended

<!-- seccion: donde-lo-aplico-hoy -->

In my own pipeline I built **Probeta DS**, a published application whose promise is to build a
model that can be defended. It runs **Python**, Pandas and scikit-learn inside the browser through
WebAssembly: the user's file does not travel to a server and the processing stays close to the
person.

It does not train and show a metric: it organizes the journey —examine the data, understand the
variables, prepare, train alternatives, evaluate— and keeps evidence to explain the selection.
Defending a model is answering which phenomenon it anticipates, with what data, how the variables
were built, which baseline it beat, which errors it produces and in which segments it works
worse. The piece has **33 features, 267 unit tests and 90.69% coverage**, according to its sheet;
those figures describe the piece, not the methodological quality of the models someone builds
with it.
