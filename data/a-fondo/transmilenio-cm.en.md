---
slug: transmilenio-cm
titulo: "C&M Consultores / TransMilenio — post-operational analysis (2021–2022)"
resumen: "The post-operational analysis of the SITP: the ETL that unified fare collection, fleet, scheduling, incidents and PQR (+70%), BI adopted by 25+ key users (+35%), the working sessions with SITP management (+25%) and a scikit-learn demand model that ran for ten months."
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
NAMES are not caught by a regex — those are on you.

HOW THIS FILE IS WRITTEN
- Normal prose, in the first person, in paragraphs.
- Every subsection starts with a `##` title followed by a comment
  `<!-- seccion: id -->`. Those are the ONLY 2 marks.

- `estado: borrador` → the chat does NOT index it and no English twin is required.
  `estado: aprobado` → the chat indexes it and requires the complete `.en.md`
  twin, subsection by subsection.
- No figure, date or achievement without a source. Whatever is missing goes as a
  `CONFIRMAR` placeholder (see the manual), never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
  -->

<!-- guide (comes from the story skeleton, S3 — written by the owner):
The millimetric detail: how you unified the heterogeneous sources,
what the working sessions with SITP management were like, how you trained
the demand prediction with scikit-learn. -->

## The problem: a city that generates data faster than it can be analyzed

<!-- seccion: el-problema -->

I returned to the **TransMilenio** environment in **July 2021**, this time as a Post-Operational
Analysis Professional at **C&M Consultores**, in the Operational Task Force of TransMilenio S.A.,
and stayed until May 2022. I came back to the same domain with a different responsibility: no
longer supervising compliance, but explaining the operation and helping decide how to adjust it.

**Post-operational analysis** reconstructs what happened in order to understand its causes and
decide the future operation. It does not describe the previous day: it explains the differences
between what was scheduled and what was executed, finds patterns, makes constraints visible and
turns that into a recommendation with consequences.

The obstacle was that the **SITP** operation generated information faster than it could be
prepared and analyzed by hand. The data lived in five heterogeneous sources, each with its own
structure, its own level of detail and its own rules:

- **fare collection**;
- the buses' **fleet and GPS**;
- service **scheduling**;
- operational **incidents**;
- user **PQR** (complaints and claims).

Much of the effort went into locating files, reconciling formats and fixing structures before
analyzing anything. That is where the difference between having data and having analytical
capacity shows.

## Unifying the sources

<!-- seccion: unificar-las-fuentes -->

I designed and implemented the **ETL** processes —extraction, transformation and loading— that
integrated the five sources into a common analytical base. The intervention improved **the
precision and speed of analysis by 70%**, because it replaced manual reconciliation with
consistent rules applied the same way in every cycle.

Integrating was not moving data into a repository. It meant understanding what each record
represented, harmonizing structures, resolving differences between identifiers, aligning the
time dimensions —fare collection per transaction, GPS per second, scheduling per service— and
setting the rules to relate them. The concessionaires' weekly databases were organized in SQLite
for the historical accumulation.

I built in validations to detect incomplete data, duplicates and relationships that did not meet
the expected rules: not to fix them silently at the end of the journey, but to make them
visible, trace their origin and keep them from advancing into an indicator.

A pipeline is not an invisible pipe. It contains decisions about quality, correspondence,
temporality and granularity that are part of the business logic, and that is why they are
documented as such.

## BI adoption in the operation

<!-- seccion: la-adopcion -->

I led the implementation of **Power BI** in the operation, with a **35% increase in the
efficiency of analytical processes** and the adoption of the dashboards by **more than 25 key
users**: those responsible for scheduling, monitoring and service decisions.

"Key users" is the important phrase. The value was not in how many people opened a dashboard but
in its being used by those who held responsibility over the operation. That is why each
dashboard was designed around a concrete operational question: recognize a condition, understand
its causes and guide an action, without forcing the user to interpret a pile of charts.

The most important result was not the number of dashboards but a shared view of the operation:
when those responsible use the same definitions and can trace a result back to its evidence, the
conversation stops being about which figure is correct and becomes about what to do.

## The working sessions with SITP management

<!-- seccion: las-mesas-del-sitp -->

I coordinated working sessions with the concessionaire management of the **Integrated Public
Transport System (SITP)** to analyze results, define improvement strategies and align decisions
about the processes. That work contributed to a **25% improvement in the operation's
indicators**.

It is evidence-based negotiation between the authority, the concessionaires and the technical
teams, each with different responsibilities, constraints and interpretations. Credibility is not
built inside the meeting: the data arrives with a clear definition, an identifiable provenance
and a verifiable relationship with the events of the operation, or it is no use for deciding.

An executive recommendation connects evidence, mechanism and consequence. It is not enough to
point out that an indicator got worse: you have to explain which conditions produce it, which
actor can intervene, what alternatives exist and how it will be known whether it worked. And a
decision does not generate value by sitting in the minutes: it needs an owner, an action, a
deadline and an indicator to close the loop.

## Demand prediction

<!-- seccion: prediccion-de-demanda -->

With **scikit-learn** I developed a machine learning model to predict **system demand by route
and time band**, updated monthly, to strengthen fleet planning and scheduling. The problem, in
industrial engineering language, is demand forecasting for capacity planning.

The variables represented the dimensions of demand behavior:

- day type and time of day, for the recurring patterns;
- the route, for the structural differences between services and zones;
- civil works, events and traffic conditions, for the exceptions.

It is a time-series problem, and validation had to respect that: it was evaluated with **RMSE**
while respecting the temporal order, never with a random split that let the future leak through.
And a global measure was not enough: the model's behavior had to be examined by route, by time
band and by day type, because a good average hides errors in the critical segments.

The model ran for **ten months**. It was used by the professionals who presented the monthly
demand report that the units took as their reference for scheduling, and it contributed to a
**20% improvement in the system's reported performance**.

From there came a discipline I keep for every intelligent solution: first, which decision is to
be improved, how far in advance the answer is needed and who will use it; then the algorithm.

## Automation

<!-- seccion: la-automatizacion -->

I implemented scripts that cut **the time of repetitive information preparation and processing
tasks by 40%**. It was the condition for freeing analytical capacity: if the time goes into
locating files, consolidating structures and fixing formats, the organization has analysts but
not analytical capacity.

The automation applied the same rules every time, reduced manual intervention and made the
analysis cycles reproducible: known inputs, defined transformations, verifiable outputs. And with
controls: a script that only works under ideal conditions shifts the manual effort to resolving
failures. Validating inputs, logging deviations and making exceptions visible was part of the
design.

## What C&M Consultores consolidated

<!-- seccion: lo-que-cm-consultores-consolido -->

At C&M Consultores I turned my knowledge of transport operations into an integrated analytical
capacity: the previous stage had taught me to reconstruct and supervise the system with data; in
this one I unified it, automated it, took it to Power BI, put it on the table with SITP
management and used it to predict.

ETL, modeling, visualization, prediction and executive communication are not independent
products. They are one and the same decision architecture: data is integrated under consistent
rules, the model keeps its meaning, the product answers a question, the prediction arrives on
time and the conversation ends in a decision with an owner.
