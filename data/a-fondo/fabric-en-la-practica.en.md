---
slug: fabric-en-la-practica
titulo: "Microsoft Fabric in practice"
resumen: "How I work Fabric from the inside: lakehouse and warehouse on OneLake at Vesting (120 tables, 20 GB), Power Query and pipelines with validations, the semantic model optimized with DAX Studio and Tabular Editor, Direct Lake, RLS, and Power BI as a decision experience."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What experience does Henry have with Microsoft Fabric?"
  - "What can he do with semantic modeling and DAX?"
  - "What is a lakehouse, and has he used one?"
---

<!--
⚠ PRIVACY — READ THIS BEFORE WRITING ⚠
This repository is public and the chat quotes this content to any visitor.
DO NOT write: confidential data of employers or clients, salaries, names of
third parties who have not agreed to appear, addresses, phone numbers, emails
or sensitive personal information. The build's customs check catches the
mechanical stuff (emails, phone numbers, ID documents, web addresses); PROPER
NAMES are not caught by a regex — those are on you.

HOW THIS FILE IS WRITTEN
- Normal prose, in the first person, in paragraphs.
- Every subsection starts with a `##` title followed by a comment
  `<!-- seccion: id -->`. Those are the ONLY 2 marks.
- `estado: borrador` → the chat does NOT index it and no English twin is required.
  `estado: aprobado` → the chat indexes it and requires the complete `.en.md`
  twin, subsection by subsection.
- No figure, date or achievement without a source. Whatever is missing goes as
  a `CONFIRMAR: what is missing` marker in square brackets, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

## What the DP-600 means in concrete work

<!-- seccion: que-significa-el-dp-600 -->

The **DP-600** —Fabric Analytics Engineer Associate, earned in December 2024— validates the full
journey of an analytical solution on **Microsoft Fabric**: selecting the store, preparing and
transforming, designing the dimensional model, building and optimizing the **semantic model**,
managing its lifecycle and applying security and governance, with SQL, KQL and **DAX**.

I prepared for it while building at Vesting the data ecosystem of an AI-agent startup on Fabric,
with the platform less than a year past its general availability. Every concept was checked
against a real decision on architecture, performance, modeling or consumption. I did not study
Fabric as a list of services: I understood it as a system through which data travels a process
—it enters, is stored, is transformed, acquires meaning, becomes a semantic model and reaches
people, applications or agents—, which is exactly how an industrial engineer looks at a plant. The
detail of the certification is in its own document.

## The lakehouse and the warehouse: two ways of serving data

<!-- seccion: lago-y-almacen -->

At Vesting I designed on Fabric an ecosystem of **120 tables and 20 GB** that combined analytical
storage, distributed processing and consumption structures. The rule was to assign each workload
to the right mechanism according to the nature of the data and the query, not to use components
for their sophistication.

The **lakehouse** received and kept the structured and semi-structured information from the
agents' integrations: large volumes, distributed processing with **Spark**, and enough detail to
reconstruct sessions and develop new transformations without a relational schema fixed from the
start. Flexible does not mean unstructured: data moved through progressively more reliable layers,
with quality rules and reusable meaning.

The **warehouse** played the complementary role: structured information, transformations and
views in **T-SQL**, and consistent answers to enterprise workloads. They are not "raw" and
"finished": they are different development styles —data engineering and data science with Spark,
versus the relational world with T-SQL—, and an architecture uses both when there is a functional
reason: the lakehouse keeps and transforms high-granularity events; the warehouse organizes
structures for consumers who need relationships and predictable queries.

**OneLake** integrates both under open formats —Delta Parquet— and eliminates copies, but it does
not eliminate design: you still have to define layers, conventions, quality controls and which
asset is the reference for each use. The right architecture is not the one with the most
components but the one that organizes the data's journey with the least complexity necessary.

## The pipelines: prepare, validate, don't repeat

<!-- seccion: pipelines -->

Preparation starts with **Power Query** and Fabric's pipelines: connection to the sources,
preparation, construction of the model's tables, as separate steps with names that make sense. At
Banco Pichincha that reorganization cut analysis times by 35%; at Vesting, every flow validated
the structure of the events, preserved the context identifiers and normalized them on ingestion.

Three decisions repeat across all my pipelines: select rows and columns as early as possible and
preserve **query folding** toward the source when the source allows it; consistent data types and
reusable logic instead of logic repeated per query; and **validations inside the pipeline**
—missing values, unexpected types, duplicates— so that exceptions are visible before reaching the
model, not in a manual review at the end.

A pipeline contains business decisions —quality, matching, timing, granularity— and is documented
as such. A query that is fast but unreadable is technical debt.

## Semantic modeling and DAX: where trust is won or lost

<!-- seccion: modelado-semantico -->

The **semantic model** is the least visible layer and the one that most determines value: where
tables become business entities, relationships acquire meaning and calculation rules become
**measures** that everyone uses the same way. When two people arrive at a meeting with different
figures for the same indicator, the problem is almost never in the chart: it is in the semantics,
the relationships or the transformations.

At Banco Pichincha I **optimized the semantic models** that supported the Power BI solutions:
structures, relationships, measures, calculation contexts, object organization and patterns that
generated unnecessary work. With **DAX Studio** I observed the internal behavior of queries, set
performance baselines and identified the expensive measures; with **Tabular Editor** I managed
measures, properties and metadata to treat the model as an engineering asset and not as an
internal configuration of the file.

At Vesting the models combined storage modes according to use: **Direct Lake** for what had to be
seen at the moment, import for the aggregated history, DirectQuery where the detail did not fit in
memory. And security is part of the model: **row-level security (RLS)** so that each user sees
only what is theirs on a single model, instead of one model per audience.

The semantic model does not create consensus: it preserves the definition that the business
owners agreed on. And it is the stable representation an AI agent can use instead of inferring
meanings from isolated technical structures.

## Power BI: the decision experience, not the goal

<!-- seccion: power-bi -->

**Power BI** runs through my whole career: the analysis of TransMilenio's operation, the control
BI for the WMS at Cafam, adoption by more than 50 users at Banco Pichincha and today the 42
analytical products at Fundación CTIC. Over the years it stopped being the deliverable: the
visible product is a dashboard, but the expected result is a better-supported decision.

That is why development starts before opening the interface —process, audience, question,
decision— and separates the semantic model from the consumption experience: the model concentrates
the definitions that need governance; the report, the navigation and the questions of an audience.
On the same base of meaning several experiences fit without duplicating the logic, and self-service
stays governed: users explore without redefining the critical metrics.

Industrial engineering brings the process —dashboards per process, not per department, with
outcome indicators connected to the conditions that produce them— and industrial design brings the
interaction: hierarchy, understandable navigation and every element justifying its space. How
adoption is measured, and the agent that builds complete Power BI reports, are in the BI document.

## The technical governance of the platform

<!-- seccion: gobierno-tecnico -->

Governing the platform means controlling identity, provenance, meaning, quality and conditions of
use, not just granting permissions. At Vesting it was solved from the design: **separate
workspaces per client** —12 clients— on common event structures, with identifiers and context
preserved from the very first event.

Fabric integrates storage, processing, modeling and consumption, and reduces the boundaries where
identities, permissions and **lineage** usually fragment; but the platform does not produce
governance on its own. You still have to organize the workspaces, differentiate environments,
document transformations and control how assets evolve: lineage must allow walking a result from
Power BI back to the transformations that support it, and a change to a model or a pipeline must
reach whoever uses it without surprises. When the consumer is an agent, additionally: which
application may use which data, for what purpose and under what supervision. The full framework is
in the governance document.

## What I am building to demonstrate it in public

<!-- seccion: lo-publico -->

I keep in exploration an end-to-end analytics piece on Fabric with open data from Colombia:
ingestion, a justified lakehouse or warehouse, dimensional model, documented semantic model and a
Power BI experience, with the architecture and the rules visible and not only the final dashboard.
It remains in exploration because it does not yet meet the criteria to enter the inventory of
pieces: when it does, it will be public evidence of what the DP-600 validates.
