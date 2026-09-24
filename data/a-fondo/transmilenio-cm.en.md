---
slug: transmilenio-cm
codigo: AF-07
titulo: "C&M Consultores / TransMilenio — post-operational analysis (2021–2022)"
resumen: "The post-operational analysis of the SITP: the ETL that unified fare collection, fleet, scheduling, incidents and PQR (+70%), BI adopted by 25+ key users (+35%), the working sessions with SITP management (+25%) and a demand model in scikit-learn that ran for ten months."
cuando_usar: "Use this when they ask about TransMilenio and C&M Consultores (2021–2022): post-operational analysis, heterogeneous data sources (fare collection, fleet, scheduling, incidents, PQR), ETL pipelines, demand forecasting by route and time band, working sessions with SITP management and dashboard adoption."
estado: aprobado
ancla: "/proyectos/transmilenio-cm"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "How did Henry unify the SITP's heterogeneous data sources?"
  - "What was the SITP demand prediction model like?"
  - "What is the post-operational analysis he mentions?"
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
  a CONFIRMAR marker in square brackets, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

<!-- guide (comes from the skeleton of the story, S3 — written by the owner):
The millimetric detail: how you unified the heterogeneous sources,
what the working sessions with SITP management were like, how you trained the demand
prediction with scikit-learn. -->

## The problem: a city that generates data faster than it can be analyzed

<!-- seccion: el-problema -->

I returned to the TransMilenio environment in July 2021, this time as Post-Operational Analysis
Professional at C&M Consultores, within the Operational Task Force of TransMilenio S.A., and I
held the position until May 2022. I came back to the same domain I had worked in as an
operations analyst in the system's supervision, but with a different responsibility and a more
mature understanding of the relationship between operation, data and decisions: it was no longer
about supervising compliance, but about explaining the operation of the Integrated Public
Transport System (SITP) and helping decide how to adjust it.

The main obstacle was that the operation generated information faster than it could be prepared
and analyzed manually. The data was spread across heterogeneous sources, with different
structures, levels of detail and rules. A considerable part of the effort was consumed gathering
files, validating correspondences and reconciling results before the truly valuable analysis
could begin.

This experience allowed me to recognize a fundamental difference between having data and having
an analytical capability. The data could exist and still not be prepared to answer the
operation's questions. The real challenge was to build a reliable path from the operational
event —a bus that leaves late, a card validation, a complaint— to the indicator, the analysis
and the decision.

## What post-operational analysis is

<!-- seccion: que-es-el-analisis-post-operacional -->

Post-operational analysis consists of reconstructing what happened in the transport system in
order to understand its causes and decide how the future operation should be adjusted. It is not
limited to describing the previous day. It must explain the differences between what was
scheduled and what was executed, identify patterns, make constraints visible and transform the
observed results into decisions about scheduling, capacity and service.

In TransMilenio that difference between the scheduled and the executed takes many forms: a
service that went out with fewer buses than planned, a time band in which demand exceeded the
scheduled supply, a route whose cycle time grew because of roadworks, a concessionaire whose
incidents were concentrated in one type of vehicle. Post-operational analysis takes the evidence
of the closed operation and answers three questions in order: what happened, why it happened
and what is adjusted for the next schedule.

What distinguishes it from supervision analysis —my previous stage in the same system, between
2018 and 2020— is the horizon and the recipient. Supervision looks at the compliance of each
service and supports consequences; post-operational analysis looks at the complete system and
supports scheduling and service decisions. The two stages share the sources and differ in the
question.

## The five sources of the SITP: fare collection, fleet and GPS, scheduling, incidents and PQR

<!-- seccion: las-cinco-fuentes -->

The SITP's data lived in five heterogeneous sources, each with its structure, its level of
detail and its rules:

| Source                    | What it records                                                  | Its natural grain                        |
| ------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| Fare collection           | the card validations when boarding: the real demand              | one transaction                          |
| Fleet and GPS             | the position and the path of each bus                            | one position point every few seconds     |
| Scheduling                | the services, routes and dispatches planned for the day          | one scheduled service                    |
| Operational incidents     | what departed from the plan: failures, detours, delays, events   | one incident                             |
| Users' PQR                | requests, complaints and claims from those who use the system    | one request                              |

None of the five described the operation on its own. Fare collection said how many people
boarded, but not whether the bus left on time; GPS said where the bus was, but not how many
people it carried; scheduling said what was supposed to happen; incidents said what broke; and
the PQR said how the user experienced it. Explaining the difference between the scheduled and
the executed required crossing all of them over the same keys: the route, the service, the
vehicle, the time band and the day.

The weekly databases that arrived from the concessionaires were organized in SQLite to build
the historical accumulation on which the analyses ran, a habit I brought from the supervision
stage and which allowed each new week to be added to the previous one instead of being analyzed
in isolation.

## Unifying the sources: the ETL

<!-- seccion: unificar-las-fuentes -->

I designed and implemented ETL processes —extraction, transformation and loading of data— to
integrate the five heterogeneous sources and turn them into a common analytical base. This
intervention improved the precision and speed of analysis by 70%, by reducing manual
reconciliation and applying consistent rules during the preparation of the information.

The integration did not consist only of moving data from different origins into a common
repository. It was necessary to understand what each record represented, harmonize structures,
resolve differences between identifiers —the same route could be named differently in
scheduling and in fare collection—, align temporal dimensions —fare collection by transaction,
GPS by second, scheduling by service— and establish rules to relate scheduling, execution and
results. Unifying the sources meant reconstructing a coherent version of the operation.

The simultaneous improvement in speed and precision was not accidental. Both depended on solving
the same problem: replacing manual and variable procedures with a reproducible pipeline. When the
transformations become a defined process, the same rules can be applied in every cycle, errors
can be detected more easily and the team stops investing time in repeatedly reconstructing the
information.

This experience prepared my later evolution toward more advanced analytical architectures. What
I then solved through ETL processes would later become governed pipelines, reusable semantic
models and enterprise solutions in Power BI, and later a lakehouse in Microsoft Fabric. The
technology evolved, but the principle remained intact: a reliable decision requires an equally
reliable data path.

## Data pipelines that run on their own: the validations inside the pipeline

<!-- seccion: validaciones-en-el-pipeline -->

I built validations into the ETL to identify incomplete data, duplicates, inconsistencies and
relationships that did not meet the expected rules: an executed service without a schedule to
back it, a fare-collection transaction on a route that did not operate that day, a vehicle with
GPS and no dispatch. The goal was not to silently correct the differences at the end of the
path, but to make them visible, trace their origin and prevent them from advancing to indicators
or decisions without an adequate explanation.

Here I went deeper into one of the foundations of my current work with data platforms: a
pipeline is not an invisible pipe that merely transports information. It is a part of the
business logic. It contains decisions about quality, correspondence, temporality, granularity
and meaning that must be documentable, evaluable and reproducible. The rule that decides how a
fare-collection transaction is assigned to a service is as much part of the business as the
indicator that is later presented to SITP management.

That is why the ETL rules were written as rules and not as steps of a routine: each with the
source it touched, the condition it evaluated and what it did with the record that did not meet
it. That way, when an indicator changed, it was possible to know whether the operation had
changed or the way of calculating it had changed.

## BI adoption in the operation

<!-- seccion: la-adopcion -->

I led the implementation of Power BI as the specialized business intelligence tool in the
operation, achieving a 35% increase in the efficiency of analytical processes and the adoption
of the dashboards by more than 25 key users.

The term key users matters. In an operation of this nature, the value did not depend on
maximizing the number of people who opened a dashboard, but on getting it used by those who had
responsibility over scheduling, monitoring and service decisions. Adoption had to be observed in
the incorporation of the analytical product into work routines, not only in its access
statistics.

This stage consolidated my understanding that Power BI must be designed as a decision experience
and not as a decorative layer over the data. Behind every visualization there must be a coherent
model, shared dimensions —the route, the service, the time band, the concessionaire, the day—,
verifiable measures and analysis paths that allow drilling down without losing consistency. The
simplicity the user perceives depends on the rigor of the architecture that sustains it.

The most important result was not the number of dashboards developed, but the creation of a
shared view of the operation. When those responsible use the same definitions and can follow
the results back to their evidence, the conversation stops focusing on which figure is correct
and can turn to which decision should be taken.

## Designing each dashboard around an operational question

<!-- seccion: tableros-por-pregunta -->

To achieve adoption at TransMilenio, the dashboards were designed around concrete operational
questions: on which routes and time bands demand exceeds the scheduled supply, which
concessionaires concentrate the incidents, where compliance is being lost and why. Each
indicator had to make it possible to recognize a relevant condition, understand its possible
causes and guide an action. The solution should not force users to interpret an accumulation of
visualizations, but offer them a clear structure to go from the overall result to the detail
that required intervention.

I also learned that an adopted analytical solution needs to balance stability and evolution. Its
definitions must remain consistent enough to generate trust, but the product must also
incorporate new questions and learnings as the operation changes. Adoption does not end with
publication. It is sustained through accompaniment, feedback and continuous improvement: every
working session with management returned new questions, and those questions went back into the
dashboard.

It was the adoption of Power BI that set the criterion I later applied at Banco Pichincha with
more than 50 users: the dashboard is designed from the decision, not from the available data.
How that adoption is measured, and why it is not visits, is in the document on BI that gets
adopted.

## The working sessions with SITP management

<!-- seccion: las-mesas-del-sitp -->

I coordinated working sessions with the concessionaire management of the Integrated Public
Transport System to analyze results, define improvement strategies and articulate decisions
about the processes. This work contributed to reaching a 25% improvement in the indicators
associated with the interventions carried out. They were the same concessionaires —on the order
of ten companies for some 150 routes— whose operation I had supervised in my previous stage in
the system; now the conversation was not about the compliance of each service, but about how to
improve the operation.

These working sessions taught me that analytics reaches its greatest value when it manages to
align actors who observe the operation from different perspectives. The authority, the
concessionaires and the technical teams could have different responsibilities, constraints and
interpretations. My role was to provide a common evidence base that made it possible to
understand the problem before discussing the solution.

To reach that conversation, the data had to be prepared to be examined. Each result required a
clear definition, an identifiable provenance and a verifiable relationship with the events of
the operation. Credibility could not be built inside the meeting. It had to be incorporated
beforehand into the sources, the pipelines, the models and the rules used to produce the
analysis: the ETL and the Power BI model were what made it possible for a figure discussed at
the table to be traced back to the service and the day that produced it.

## Evidence, mechanism and consequence: how to make a recommendation to management

<!-- seccion: recomendacion-ejecutiva -->

In the SITP working sessions I learned that an executive recommendation must connect evidence,
mechanism and consequence. It was not enough to point out that an indicator had worsened. It was
necessary to explain which conditions produced the result, which actors could intervene, which
alternatives were available and how their effect would later be evaluated.

This experience strengthened my ability to communicate across operational, analytical and
management levels. I could walk the problem from the records and the transformation rules to
the executive synthesis, and return to the detail when a conclusion needed to be explained or
defended. That ability continues to be essential in my work with analytics platforms,
intelligent applications and enterprise artificial intelligence strategies.

The working sessions also made visible that a decision does not generate value by being recorded
in minutes. It needs owners, actions, deadlines and indicators that make it possible to close
the loop and determine whether the intervention produced the expected result. Analytics with
consequence does not end at the recommendation. It includes the capacity to observe what
happened after acting; the 25% improvement in the intervened indicators could be claimed
precisely because the same pipeline that supported the recommendation kept measuring after it.

## Demand prediction with scikit-learn

<!-- seccion: prediccion-de-demanda -->

I developed in Python with scikit-learn a machine learning model to predict the system's demand
by route and time band, with monthly updates, and thus strengthen planning and fleet scheduling
decisions. In industrial engineering language, the problem is a demand forecast for capacity
planning.

The model incorporated variables that represented different dimensions of demand behavior: the
type of day of the week and the hour of the day, the route, the presence of civil works, the
occurrence of events and traffic conditions. Each group fulfilled a function. The type of day
and the hour made it possible to model recurring temporal patterns; the route incorporated the
structural differences between services and zones; civil works, events and traffic introduced
external conditions capable of modifying the usual patterns. The system's behavior could not be
explained exclusively by its history; it also had to be interpreted within the urban context in
which it operated.

The monthly horizon responded to a concrete planning need. The purpose was not to anticipate
only the operation's next move, but to provide a perspective broad enough to adjust the schedule
and prepare resources in advance. The model's usefulness depended on its results arriving within
the real cycle in which decisions could be modified: the next month's schedule is decided before
that month begins, and a prediction that arrived afterwards was of no use.

Developing the model required transforming operational and contextual variables into consistent
features, organizing historical data —the fare-collection data, which is the real demand,
crossed with scheduling and incidents—, controlling its quality and evaluating whether the
prediction was useful enough to support decisions. The ETL of the five sources was the
precondition: without a unified base there was nothing to train with.

## How the model was validated: RMSE and temporal order

<!-- seccion: validacion-del-modelo -->

The demand of a transport system is a time-series problem, and the validation had to respect
that. The model was evaluated with RMSE —the root mean squared error— respecting temporal
order: it was trained on the previous months and measured on the following ones, never with a
random split that would let the future be seen inside the training and produce an accuracy that
was not going to repeat in operation.

The evaluation could not be limited to a single global performance measure. It was also
necessary to observe how the model behaved across routes, time bands, types of day and
exceptional conditions, because a good average result could hide important errors in critical
segments of the operation: getting it right on most low-demand routes and failing on the trunk
routes at peak hour is a good average and a bad prediction.

This experience strengthened my judgment for evaluating models not only by their statistical
accuracy, but by the stability, usefulness and reliability of their results within the context
in which they would be used. How a model's errors are evaluated and what it means to sustain it
in production, with this case and the Banco Pichincha case compared, is in the predictive
analytics document.

## Ten months in use: who used the model and for what

<!-- seccion: el-modelo-en-uso -->

The model ran for ten months. It was used by the professionals who presented the demand report
that TransMilenio's units took as the reference for scheduling: the prediction by route and time
band went into that monthly report and from there reached the decision of how many buses to
assign and at what times.

The model contributed to a 20% improvement in the system's reported performance. Beyond the
figure, the fundamental learning was that a prediction only generates value when it can be
incorporated into a decision process. A model can achieve good technical performance and still
be irrelevant if it delivers the answer too late, uses variables that will not be available at
inference time or produces an output that the organization cannot turn into an action. Here the
three conditions were met: it arrived before scheduling, it used variables available at
scheduling time and it came out in the unit in which scheduling is done, the route and the time
band.

This was one of my first experiences connecting machine learning with a real operational
consequence, and a model that remained in use for ten months.

## What the demand model taught me about machine learning

<!-- seccion: lo-que-enseno-el-modelo -->

The SITP demand model taught me that machine learning does not begin with the selection of an
algorithm. It begins with the correct representation of the problem, the definition of the
horizon and the correspondence between the model's output and the decision it must enable. From
scikit-learn I used what the problem asked for; the work was before, in the variables and in the
ETL, and after, in the report that carried it to scheduling.

It also established a discipline I maintain in the design of intelligent solutions: first define
which decision is to be improved, determine how far in advance the answer must be produced, know
who is going to use it and evaluate the model both by its technical performance and by its
impact within the process. Then, the algorithm.

Over time, this understanding would expand toward artificial intelligence applications and
agents. A model generates a prediction; an application can integrate it with rules and
workflows; an agent can query data, interpret context, propose actions and use tools within
defined limits. However, all that capacity depends on the same foundation I learned in 2021 with
TransMilenio's demand: reliable data, explicit purpose, rigorous evaluation and a clear
relationship between the result and the decision.

## The automation

<!-- seccion: la-automatizacion -->

I implemented scripts that reduced by 40% the time spent on repetitive information preparation
and processing tasks at C&M Consultores. Although this achievement may seem less sophisticated
than a predictive model, it was a necessary condition for freeing analytical capacity and
concentrating the team's effort on higher-value problems.

Automation made it possible to apply rules consistently, reduce manual intervention and make the
analysis cycles faster and more reproducible. Activities that previously had to be executed step
by step —receiving the weekly databases, validating their structure, loading them into the
SQLite accumulation, recalculating the indicators— could be incorporated into a structured flow,
with known inputs, defined transformations and verifiable results.

This experience taught me to look at analytical work as a complete pipeline. If most of the time
is consumed locating files, consolidating structures and correcting formats, the organization
has analysts, but not necessarily a scalable analytical capability. Automating those activities
does not eliminate professional judgment. It shifts it toward tasks where it can produce more
value: the 40% of time recovered was the time devoted to the demand model and to the working
sessions.

## Automating with controls and exception handling

<!-- seccion: automatizacion-con-controles -->

I also understood at C&M Consultores that automation must include controls and exception
handling. A script that only works under ideal conditions shifts the manual effort toward the
constant resolution of failures. A sustainable solution needs to validate its inputs, record
deviations and make visible when a situation requires human review: a weekly database that
arrives with one column fewer must not be loaded silently nor bring down the process; it must be
flagged, with the reason, so that someone can decide.

That principle remains in force in my work with AI agents. Intelligent automation does not
consist of indiscriminately removing people from the process. It consists of assigning to
technology the activities it can execute reliably, preserving traceability over its actions and
transferring to a person those situations that require interpretation, judgment or additional
responsibility.

The difference between a script from 2021 and an agent today lies in the capacity to interpret;
the design rule is the same: validated inputs, recorded deviations and an exception that is
seen, not hidden.

## The C&M Consultores results in figures

<!-- seccion: resultados-en-cifras -->

The five figures of the role, as published by my CV and the case study, and what lies behind
each one:

| Front                                          | Result                                                   | What lies behind                                                          |
| ---------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Power BI adoption in the operation             | +35% efficiency of analytical processes · 25+ key users  | dashboards designed by operational question, with shared definitions      |
| ETL that unified the heterogeneous sources     | +70% in analysis precision and speed                     | five sources —fare collection, fleet/GPS, scheduling, incidents, PQR— over common keys |
| Automation scripts                             | −40% in repetitive tasks                                 | reproducible preparation and processing, with controls and exceptions     |
| Strategy sessions with SITP management         | +25% in the intervened indicators                        | common evidence, recommendations with mechanism and later follow-up       |
| Demand prediction with scikit-learn            | +20% reported system performance                         | demand by route and time band, monthly update, RMSE with temporal order, ten months in use |

All of it happened between July 2021 and May 2022, at C&M Consultores, within the Operational
Task Force of TransMilenio S.A.

## What C&M Consultores consolidated

<!-- seccion: lo-que-cm-consultores-consolido -->

Seen in retrospect, C&M Consultores was the experience in which I turned my knowledge of
transport operations into a more integrated analytical capability. The previous stage had
taught me to reconstruct and supervise the system through data. In this new responsibility I
advanced toward automating its preparation, unifying sources, adopting business intelligence
tools and incorporating models capable of anticipating relevant behaviors.

There I understood that ETL, modeling, visualization, prediction and executive communication are
not independent products. They are part of a single decision architecture. The data must be
integrated under consistent rules, the model must preserve its meaning, the analytical product
must respond to a real need and the organization must have mechanisms to turn the result into
an action.

Unifying sources taught me to build a common representation of the operation. Automation freed
capacity for analysis. The dashboards carried that capacity to more than 25 key users. The
working sessions with management turned evidence into agreements. The demand model widened the
conversation from what had happened toward what could happen and what should be prepared in
advance.

This experience also consolidated my interest in the different levels of capability a solution
can offer. A report documents. A dashboard allows exploring. An alert directs attention. A model
anticipates. A recommendation guides. An application structures execution. An agent can
coordinate knowledge and tools to act within defined limits. The right instrument depends on the
decision, the timing, the risk and the degree of autonomy the organization can manage.

## From analyzing an operation to designing systems to run it

<!-- seccion: de-analizar-a-dirigir -->

C&M Consultores therefore marked my transition from analyzing an operation to designing
analytical systems to run it. Several foundations of my current work with Power BI and data
platforms were strengthened there: reproducible pipelines, consistent models, adopted products,
traceable indicators and analytical experiences connected to real decisions.

An essential part of my vision on artificial intelligence was also formed. I understood that a
model is not valuable for its complexity or its isolated accuracy, but for its capacity to
integrate into a process, arrive at the right moment and improve a decision. That same demand
guides today the way I design intelligent applications, AI agents and enterprise architectures
aimed at producing reliable, observable and sustainable capabilities.

C&M Consultores also consolidated my conviction that an analytical capability must learn from
its own operation. Historical data did not only serve to build indicators and train models; it
also had to make it possible to compare predictions with observed results, review assumptions
and progressively adjust decisions. The ten months of the demand model worked with that logic:
the monthly update made it possible to contrast the previous prediction with the demand observed
in fare collection before producing the next one. This logic of continuous evaluation would
later become a foundation of my work with analytics platforms, intelligent applications and AI
agents: no solution is really finished if the organization cannot observe its behavior, measure
its impact and improve it from new evidence.
