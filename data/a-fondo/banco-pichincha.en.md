---
slug: banco-pichincha
titulo: "Banco Pichincha — BI the business actually uses (2023)"
resumen: "Five months in banking: dashboards adopted by 50+ users (+25% in decision-making), ETL −35%, churn, delinquency and risk models in production with scikit-learn (>90%), a team of 5, 12 professionals trained and data governance co-led."
estado: aprobado
ancla: "/proyectos/banco-pichincha"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What did Henry do at Banco Pichincha?"
  - "How does he get the business to use the dashboards?"
  - "Has he taken a machine learning model to production?"
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
How you achieved adoption (the hard problem in BI), what you did
differently with the dashboards, the training program, the predictive
models in production. -->

## The real problem was not only technical

<!-- seccion: el-problema-real -->

I joined **Banco Pichincha in March 2023** as a Senior Analytics and Reporting Analyst and stayed
until July of the same year. It was five months, and it was my time in the **financial sector**:
in **banking** data has an owner, regulation and consequences, and that changes how everything is
built.

The area produced dashboards the business never quite adopted, with slow **ETL** processes and
predictive models that did not reach production. The problem was not the tool: it was the
distance between what was being built and the decisions someone had to make.

My job was to shorten that distance with a **team of 5 people reporting to me**: understand which
decisions needed support, what information they required, who answered for each definition and
how analytical products had to be structured to enter daily work. Each solution was treated as
a complete chain: reliable preparation, consistent definitions, semantic model, verifiable
measures, decision experience.

I modeled the processes in BPMN with Bizagi before touching the data, because a dashboard about
a process nobody has drawn answers questions nobody asked.

## Adoption, measured

<!-- seccion: la-adopcion-medida -->

With the team, I designed the decision-oriented dashboards that were adopted by **more than 50
users** from the business, with a **25% improvement in decision-making** associated with those
products. The goal was never to have more reports: it was for them to be used by those who
decided.

The design started from the decision and not from the available data: which situation has to be
observed, what can be decided, what level of detail is needed and how often. Each dashboard
offered a path from the overview down to the evidence, and consistency was part of adoption: if
one dashboard and another compute the same concept differently, the user ends up comparing tools
instead of analyzing reality.

Publishing is not the end of the project. The analytical product stopped being a repository and
became a service: reduce uncertainty, organize the conversation and sustain recurring decisions.
How that adoption is measured, and why it is not page views, is in the BI document.

## The training program

<!-- seccion: programa-de-formacion -->

To sustain adoption I designed and delivered a **training program for 12 professionals** at the
bank. It did not teach the functions of a tool: it walked through the complete analytical
solution, on the participants' real situations.

- **Power Query**: clear transformations, reproducible preparation, less manual work.
- **Semantic modeling**: business entities, relationships, without repeating the same logic in every report.
- **DAX**: understandable, reusable measures; reasoning about filters, relationships and time.
- **Visualization and executive communication**: organizing around a question, separating context from evidence.
- **Coaching** on each participant's own products, so the learning reached their work.

The program contributed to a **20% increase in productivity in the preparation and use of
information** among participants. The most important result was installed capacity: the bank did
not just receive products, it strengthened people. And self-service needs limits: expanding
users' capacity does not mean each one redefines the metrics.

## ETL and data preparation

<!-- seccion: el-etl-y-la-preparacion -->

I optimized the **ETL** processes that prepared information for the Power BI solutions, with
**Power Query**, and analysis times **dropped by 35%**, with more consistent results.

I structured the queries to separate the connection to the sources, the preparation and the
construction of the model's tables; I prioritized early selection of rows and columns,
consistent data types and reusable logic; and, where the source allowed it, I pushed the
transformations down to the origin. I built in validations for missing values, unexpected types
and duplicates, so that exceptions were visible before reaching the model.

A faster but unreadable query is technical debt. The steps keep a logical sequence and
understandable names, because the quality of a report is decided in the preparation.

## The semantic model and its optimization

<!-- seccion: modelos-semanticos-y-optimizacion -->

I optimized the **semantic models** that supported the Power BI solutions. The platform's
potential is not in producing independent files but in a shared layer of meaning: relationships,
dimensions, fact tables and centralized measures, with conventions for naming objects and
grouping measures, so that a single definition serves every analysis.

I used **DAX Studio** to analyze the behavior of queries and measures, find expensive
calculations and compare before and after each adjustment, and **Tabular Editor** to review
properties, manage measures and keep the model tidy. The technical optimization had a direct
consequence on adoption: a slow or ambiguous model weakens trust and increases dependence on the
team that created it.

It is the capability that distinguishes my profile today: **end-to-end Power BI**, from
preparation to the model, from the measures to the decision experience. How modeling and
optimization are done, in detail, is in the Fabric document.

## The predictive models

<!-- seccion: modelos-predictivos -->

I trained and took to production **machine learning** models —with **scikit-learn**— to predict
**customer churn, delinquency and risk**: anticipating which customer may leave, which obligation
may stop being paid and which operation concentrates risk, so that the business acts before
rather than after.

The reported results exceeded **90% accuracy** and improved **predictions by up to 35%** over
what existed before. The preparatory work weighed as much as the algorithm: preparing consistent
variables, using only information available at the moment of prediction —without leaking the
future into training— and evaluating by segment, because in banking a global metric hides the
error where it costs the most.

The prediction was integrated with Power BI so that it reached the person who interpreted it,
accompanied by context and never presented as an automatic decision. That was the bridge between
business intelligence and artificial intelligence: the model generates the signal, the product
gives it context, the person decides. How errors are evaluated and how a model is sustained in
production is in the predictive analytics document.

## Data governance

<!-- seccion: gobierno-de-datos -->

I **co-led** Banco Pichincha's data governance initiative to strengthen the security, quality
and reliability of information. I keep the "co-": governance is not built as an individual
initiative or from a single area.

My contribution was connecting analytical needs with concrete practices: shared definitions per
metric, owners per dataset, minimum quality criteria according to use and access defined by
purpose, not by convenience. Security and usability were not incompatible goals: governance
exists so that the right information reaches the right people under clear conditions.

## What Banco Pichincha consolidated

<!-- seccion: lo-que-pichincha-consolido -->

Banco Pichincha was where I consolidated my depth in business intelligence and broadened it into
a platform view: Power Query prepared, the semantic model organized meaning, DAX turned
definitions into measures, the models anticipated and governance sustained trust. Five months,
nine figures and a team of five.

It was the bridge to what came next: I arrived building analytical products and left
understanding the conditions for those products to become capabilities of the organization.
