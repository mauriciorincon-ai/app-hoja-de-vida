---
slug: fabric-en-la-practica
codigo: AF-14
titulo: "Microsoft Fabric in practice"
resumen: "How I work Fabric on the inside: lakehouse and warehouse on OneLake at Vesting (120 tables, 20 GB), Power Query and pipelines with validations, the semantic model optimized with DAX Studio and Tabular Editor, Direct Lake, RLS, and Power BI as a decision experience."
cuando_usar: "Use this when they ask about his hands-on experience with Microsoft Fabric: lakehouse and warehouse, OneLake, pipelines, semantic modeling and DAX, Direct Lake, RLS, Power BI, DAX Studio and Tabular Editor, or whether he has designed a data architecture from scratch."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What experience does Henry have with Microsoft Fabric?"
  - "What can he do with semantic modeling and DAX?"
  - "What is a lakehouse and has he used one?"
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
- Normal prose, in first person, in paragraphs.
- Each subsection starts with a `##` title followed by a comment
  `<!-- seccion: id -->`. Those are the ONLY 2 marks.
- `estado: borrador` → the chat does NOT index it and no English twin is required.
  `estado: aprobado` → the chat indexes it and requires the complete `.en.md`
  twin, subsection by subsection.
- No figure, date or achievement without a source. Whatever is missing goes as
  a CONFIRMAR marker in square brackets (what is missing), never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

## What DP-600 means in concrete work

<!-- seccion: que-significa-el-dp-600 -->

DP-600 —Microsoft's Fabric Analytics Engineer Associate credential— I earned in December 2024,
after five months of preparation, from July to November of that year. It is the most important
formal validation of my ability to design, build, manage and optimize enterprise analytical
solutions on Microsoft Fabric.

DP-600 covers the complete journey of an analytical solution: exploring and selecting data
stores, preparing and transforming information, designing dimensional models, building and
optimizing semantic models, managing their life cycle and applying security and governance
mechanisms. Its scope also requires working with SQL, KQL and DAX, and understanding how
lakehouses, warehouses, eventhouses, Power BI and the other Fabric components connect.

For me, this certification does not represent knowledge separate from experience. I prepared it
and earned it within my role at Vesting, while building from scratch a data ecosystem on
Microsoft Fabric to integrate, analyze and monitor the information produced by artificial
intelligence agents: 120 tables, 20 GB and 1,000 events per day at the end of the period. The
platform had been in general availability for less than a year when I adopted it, so a good part
of the learning happened with the documentation and the new features coming out month by month.
The coincidence was especially valuable because every concept studied could be checked against
real decisions of architecture, performance, modeling, traceability and consumption, and every
decision made on the platform could be reviewed against what the syllabus proposed as
recommended practice.

DP-600 underpins the analytical core of my profile because it formalizes the ability to turn
scattered data into reliable, reusable assets. Power BI represents the decision experience, but
its quality depends on everything that happens before: architecture, storage, transformation,
modeling, semantics, security and governance. The detail of how I prepared it, at what pace and
alongside which other credentials, is in the certifications document.

## Fabric as an information production system, not as a list of services

<!-- seccion: fabric-como-sistema -->

I did not study Fabric as a collection of independent services. I understood it as a platform on
which data travels through a complete system: it enters from different sources, is stored and
transformed, acquires structure and meaning, becomes semantic models and finally reaches the
people, applications or agents that need to use it.

This view connects directly with my training in Industrial Engineering. Just as an operational
process must be analyzed end to end, an analytical solution cannot be optimized by looking only
at the dashboard or the final query. It is necessary to understand the inputs, transformations,
constraints, handoffs, controls and consumers that determine the performance of the complete
system. A pipeline is a process line; a semantic model is a contract between stages; a Power BI
dashboard is the point of use, not the entire process.

At Vesting that system had a concrete outline: information arrived from the integrations of the
27 agents in the inventory, went through pipelines that validated and normalized it, was kept
in the lakehouse with the detail of every session, was organized in the warehouse for relational
consumption, became semantic models and ended in dashboards for product and operations, with up
to 23 agents watched at once. Each link had a responsibility and a rule about what it handed to
the next. When something failed in an indicator, the journey made it possible to locate in which
link the problem had originated instead of looking for it in the visualization.

That way of looking at the platform is the one I apply today to any solution on Fabric: first
the journey of the data and its consumers, then the components that materialize it.

## The lakehouse and the warehouse: two complementary ways of serving data

<!-- seccion: lago-y-almacen -->

At Vesting I designed on Fabric an ecosystem that integrated analytical storage, distributed
processing and consumption-oriented structures: 120 tables and 20 GB at the close of my stage,
with 1,000 new events per day. The purpose was not to use different components for
technological sophistication, but to assign each workload to the most suitable mechanism
according to the nature of the data, the form of transformation and the query needs.

The lakehouse provided a flexible base to receive, keep and process structured and
semi-structured information coming from the agents' integrations. It made it possible to work
with large volumes, use distributed processing with Spark and preserve enough detail to
reconstruct sessions, analyze behaviors and develop new transformations without depending
exclusively on a relational schema defined from the start.

However, a lakehouse should not be understood as a place where data is kept indefinitely without
structure. Flexibility needs organization. Data must move from its reception toward
progressively more reliable layers, with quality rules, consistent structures and enough meaning
to be reusable. Preserving detail does not mean giving up modeling.

The warehouse fulfilled a complementary function. It made it possible to organize structured
information through a relational approach, develop analysis-oriented transformations and views
in T-SQL and respond clearly to workloads that required SQL, consistency and a structure ready
for enterprise consumption.

I do not consider the lakehouse to be simply the place for raw data and the warehouse the place
for finished data. The difference is deeper. Each answers to different development styles, data
types and workloads. The lakehouse favors engineering, data science and Spark processing
scenarios. The warehouse strengthens relational scenarios, T-SQL transformations and structured
enterprise queries.

## OneLake and the decision to use both

<!-- seccion: onelake-y-la-decision -->

The decision between lakehouse and warehouse does not have to be exclusive either. An
architecture can use both when there is a clear functional reason. At Vesting there was one: the
lakehouse kept and transformed the agents' events at high granularity —session, request,
response, time, status, cost—, while the warehouse organized the consumer-oriented structures
that required relationships, metrics and predictable queries, such as the product and operations
dashboards. What matters is avoiding unnecessary duplication and keeping clear rules about where
each transformation happens and which asset is the reference for each use.

Integration under OneLake lets these components take part in a common architecture and use open
formats: tables are stored in Delta Parquet and the same data can be read by Spark, by the SQL
engine and by the semantic model without being copied. That is the platform's concrete promise:
a single copy of the data and several engines on top. However, sharing a platform does not
automatically remove the need to design. It is still necessary to define responsibilities,
layers, conventions, quality controls, relationships and criteria to decide what information is
ready for each consumer.

That is why, before creating an artifact in Fabric, I ask myself three questions: who is going
to consume this data and with which engine, what transformation does it still need to be
reliable, and which of the possible copies will be the reference. When the answer to the third
is "several", the architecture is not finished yet.

The right architecture is not the one that incorporates the most components, but the one that
organizes the data's journey with the least complexity necessary. My role is to define that
journey, assign responsibilities and make sure each layer adds value without losing
traceability.

## The pipelines: prepare, validate, do not repeat

<!-- seccion: pipelines -->

Preparation begins with Power Query and with Fabric pipelines: connection to the sources,
preparation and construction of the model's tables, as separate steps with names that can be
understood. That way of organizing preparation was not born at Vesting. At Banco Pichincha, in
2023, reorganizing the ETL processes with that logic reduced analysis times by 35%; at Vesting,
every flow validated the structure of the events arriving from the integrations, kept the
context identifiers —agent, client, session— and normalized them on entry, so that the rest of
the journey worked on a common representation.

Three decisions repeat across all my pipelines. The first is to select rows and columns as early
as possible and preserve query folding toward the source when the source allows it: what the
source can filter should not travel just to be discarded later. The second is to keep data types
consistent and logic reusable instead of repeated per query: a transformation needed in three
tables is written once and referenced. The third is validations inside the pipeline —missing
values, unexpected types, duplicates, relationships that do not close— so that exceptions are
visible before reaching the model and not in a manual review at the end.

A data pipeline is not merely a pipe that transports information. It is the process through which
an organization's events become an analytical representation of its reality. Each transformation
embeds decisions about quality, timing, granularity, relationships and business rules, and that
is why it is documented as what it is: a business decision expressed in code.

I design pipelines from their consumers and the expected decisions, but without coupling them
exclusively to a specific report. I need to understand which questions must be answered, what
level of detail must be kept, how often the information is needed and which rules determine
when a data point can be considered reliable enough to move forward.

## The pipeline as an analytical production system

<!-- seccion: pipeline-analitico -->

Ingestion must preserve the provenance and the identifiers needed to reconstruct the
information's journey. Transformation must make explicit the rules that turn operational records
into analytical entities. Quality controls must detect missing values, duplicates, inconsistent
relationships and conditions that could materially alter the results.

I also try to separate the stages of reception, preparation and consumption. This separation
makes it possible to investigate errors without rebuilding the whole process, reuse
transformations, bring in new sources and modify one layer without unnecessarily altering the
others. At Vesting that separation was what allowed a new integration to come in without
touching the previous ones: the reception layer absorbed the variation of each agent and, from
preparation onward, everything spoke the same language. The goal is not to create architectural
complexity, but to contain it and make it understandable.

Industrial Engineering directly influences this way of designing. I analyze the pipeline as a
process line: I observe inputs, capacities, constraints, accumulations, times, waste, exceptions
and results. An unnecessarily repeated transformation is equivalent to rework. A hidden
dependency represents an operational risk. A bottleneck in preparation can render a solution
useless even if the final dashboard is correctly built.

Nor does optimization consist only of reducing execution time. A faster pipeline that is
impossible to understand or maintain can shift the cost toward the future. A fast but unreadable
query is technical debt. I seek to balance performance, traceability, modularity and ease of
evolution.

This perspective extends naturally toward artificial intelligence. Models, applications and
agents need data prepared for their purpose, with enough context and clear conditions of use. A
modern analytical architecture should not serve only Power BI dashboards. It must also prepare
assets that can be used safely and consistently by intelligent solutions.

## I know DAX: semantic modeling and DAX, where trust is won or lost

<!-- seccion: modelado-semantico -->

The semantic model is one of the least visible layers of an analytical solution and, at the same
time, one of those that most determine its value. It is the place where tables become business
entities, relationships acquire meaning and calculation rules become DAX measures that different
people can use consistently.

A good model lets a concept keep the same definition across different reports and analytical
experiences. A fragmented model forces the logic to be rebuilt in every product and produces
multiple versions of the same metric. When two people arrive at a meeting with different results
for the same indicator, the problem is rarely solved by changing the color of a visualization.
It is necessary to review the semantics, the relationships, the transformations and the rules
that produce the figure.

However, the semantic model does not create consensus on its own. The definition must be agreed
by those responsible for the business, documented and associated with an institutional
responsibility. The model turns that agreement into a reusable, controlled rule, but it does not
replace the conversation needed to determine what each concept really means. Technology
preserves the definition; the organization must establish it. At Banco Pichincha, in 2023, that
conversation was part of the work of co-leading the area's data governance: an indicator with two
definitions was a governance problem before it was a DAX problem.

I also understand the semantic model as a contract between the data architecture and the people
who make decisions. The warehouse or the lakehouse can hold large volumes and technically correct
structures, but the semantic model organizes the way the organization understands that data. It
defines which entities are relevant, how they relate and which measures allow evaluating their
behavior.

## Optimizing semantic models with DAX Studio and Tabular Editor at Banco Pichincha

<!-- seccion: dax-studio-y-tabular-editor -->

At Banco Pichincha my work was not limited to optimizing data analysis in general terms. I
optimized both the semantic models that supported the Power BI solutions and the way those
models supported the analysis. This included reviewing structures, relationships, measures,
calculation contexts, object organization, query times and patterns that could generate
unnecessary processing, in an environment where the dashboards had been adopted by more than 50
users and every second of waiting was multiplied by that audience.

I used DAX Studio to observe the internal behavior of queries, establish performance baselines,
identify expensive measures and analyze how the engine resolved different filter contexts.
Optimization did not consist of replacing a complex formula with another equally hard to
understand. The goal was to reduce unnecessary work, reuse logic and keep measures clear enough
to be validated and maintained. A measure that went from scanning an entire fact table to
relying on a well-defined relationship was measured before and after, and the improvement was
recorded with its figure.

I used Tabular Editor to strengthen the structure, organization and maintainability of the
models. This made it possible to manage measures, properties, metadata, display folders and
reusable elements more consistently. The tool made it easier to treat the model as an
engineering asset and not merely as an internal configuration of the Power BI file.

Optimizing the semantic model and optimizing data analysis are not separate achievements. A
clearer, more efficient and more consistent model lets analyses respond faster, reduces
discrepancies, eases the incorporation of new products and lowers dependence on the original
developer. At the bank, that lower dependence mattered because the BI team I led had five people
and the models had to survive turnover.

My specialty in Power BI concentrates on this convergence: preparing the data, modeling the
domain, building verifiable measures, optimizing their functioning and turning that system into
an analysis experience people can use with confidence.

## Direct Lake, Import, DirectQuery and RLS: the model's modes and security at Vesting

<!-- seccion: direct-lake-y-rls -->

At Vesting the semantic models combined storage modes according to use. Direct Lake for what had
to be seen in the moment: the model reads the lakehouse's Delta tables directly from OneLake,
without an imported copy and without the cost of a relational query for each visual, which made
it suitable for the operational agent-monitoring dashboards. Import for the aggregated history,
where response speed and the stability of the figures weighed more than freshness. DirectQuery
where the detail did not fit in memory and was only queried sporadically, for example when
drilling down to the events of one specific session.

Choosing the mode is an architecture decision and not a configuration checkbox. It depends on
the refresh frequency the consumer needs, on the volume that fits in memory, on the capacity cost
each query generates and on how predictable the questions are. A single model can combine all
three, and at Vesting it did.

Security is part of the model. With row-level security (RLS), each user sees only their own data
on the same semantic model, instead of maintaining one model per audience with the logic
duplicated in each. RLS rules are defined as DAX filters on the dimension tables and are tested
by impersonating roles before publishing. On a platform that integrated information from 12
clients, that layer was complemented by architectural isolation: separate workspaces per client,
so that the separation did not depend solely on a filter inside the model.

This capability is especially important for artificial intelligence. An agent can query tables
or documents directly, but a governed semantic layer reduces ambiguity and provides consistent
definitions. When critical concepts already have controlled relationships, measures and rules,
intelligent solutions can use a more stable enterprise representation instead of inferring
meanings from isolated technical structures.

## Power BI: the decision experience, not the end goal

<!-- seccion: power-bi -->

Power BI appears throughout my whole career. It began as part of my analytical training, was
consolidated in the analysis of TransMilenio's operation with C&M Consultores, made it possible
to instrument the implementation of a warehouse management system at Cafam with a control BI
adopted by more than 15 users, reached an adoption above fifty users at Banco Pichincha and
currently sustains, at Fundación CTIC, 42 analytical products in use for 20 leaders of 15
processes and about 75 users, aimed at administrative and clinical leaders in the health sector.

Over the years I stopped understanding it as the deliverable. The visible product may be a
dashboard, but the expected result is a better-supported decision, a clearer conversation or an
institutional capacity to understand the behavior of its processes.

That is why development begins before opening the interface. First I identify the process, the
audience, the question and the decision. Then I define the entities, relationships, events and
measures needed to represent the situation. Only then do I design the visual experience through
which a person will be able to navigate the information.

I also conceptually separate the semantic model from the consumption experience. The model must
concentrate the relationships, definitions and measures that need reuse and governance. The
report must concentrate on the navigation, the context and the questions of a specific audience.
This separation makes it possible to develop different analytical experiences on the same base
of meaning without duplicating the logic in each product.

This architecture also strengthens governed self-service. Users can explore, combine
perspectives and build new experiences without individually redefining the critical metrics.
Autonomy shifts toward analysis, while the shared semantics protect the consistency of the
information.

## Process, interaction and adoption: what engineering and industrial design bring to a dashboard

<!-- seccion: proceso-y-diseno-en-power-bi -->

Industrial Engineering brings the process perspective. I do not organize dashboards solely by
the structure of the areas, because a process can cut across several units and accumulate
constraints that none of them observes in full. Power BI makes it possible to represent that
journey, make its relationships visible and connect outcome indicators with the conditions that
produce them. At Fundación CTIC the dashboards are organized by processes, not by departments,
and at Cafam the WMS control BI followed the flow of the medicine through the distribution
center instead of the structure of the org chart.

Industrial Design brings the interaction experience. Information must have hierarchy, navigation
must follow an understandable logic and every visual element must justify the space it occupies.
The interface should not exhibit the complexity of the model, but let the person move through it
without losing meaning.

Adoption is therefore one of my main indicators of success. A dashboard can meet every technical
and visual best practice and still generate no value if it is not part of the decision routine.
Publishing is barely the beginning. The solution needs accompaniment, understanding of the
metrics, feedback and evolution. At Banco Pichincha, the analytics training program I designed
was part of the product and not an appendix: it raised productivity in the preparation and use
of information by 20%, and it was what turned the more than 50 users into real users and not
recipients of a link.

How I measure adoption, what holds it back and how I work it in each context is developed in the
document on BI that gets adopted.

## Automating the construction of Power BI artifacts

<!-- seccion: automatizar-power-bi -->

I have also worked on automating the construction and modification of Power BI artifacts
directly on their native structures: the PBIP project format, with the semantic model and the
report separated into versionable folders instead of an opaque binary. This work seeks to reduce
repetitive manual activities, apply rules consistently and let specialized components assist
part of the development cycle.

The most concrete result is a built and tested agent that creates the complete project: the
semantic model with its relationships and columns, the ETL in Power Query M, the DAX measures
and the visuals, and that can also extract data from the sources. It is not a demo: every measure
is tested with a query before moving to the next phase, the report goes through a validator and
a person approves the render before the run closes. It is described, with its figures, in the
document on agents.

However, automating the tool does not mean indiscriminately delegating the design. The selection
of metrics, the semantics, the architecture and the decision experience need explicit criteria.
Artificial intelligence can assist the generation of artifacts, but the purpose, the validation
and the acceptance must remain under professional responsibility. The agent proposes the list of
measures; the dashboard's author approves it.

Power BI represents, in short, the point where the data architecture meets people. Its value
lies not only in making information visible, but in preserving the meaning built along the
whole pipeline and turning it into an experience that makes it easier to understand, decide and
act.

## Preparing data for people, applications and agents

<!-- seccion: datos-listos-para-ia -->

A contemporary analytical platform should not be designed only to produce reports. Its data and
models can also be used by applications, automated processes and artificial intelligence agents.
This introduces new consumers, context needs and governance responsibilities. At Vesting the
consumers were, besides the people in product and operations, the agents themselves and the
integrations that fed them.

Preparing data for artificial intelligence does not consist of granting indiscriminate access to
the lakehouse or the warehouse. It is necessary to identify what information is authorized for
each purpose, what level of detail is needed, how provenance will be preserved and which
definitions must accompany the data to avoid incorrect interpretations.

Semantic models can provide a particularly valuable base. Governed measures, relationships and
business terminology let an application or an agent query concepts that have already been
defined institutionally. This reduces the need to duplicate logic and lowers the risk of each
solution rebuilding the meaning of the information differently.

It is also necessary to decide when the agent should query structured data, when it needs to
retrieve documentary knowledge and when it should combine both sources. An official metric should
not be freely recalculated by a generative model when a governed measure already exists. In the
same way, an explanation should not be limited to a figure if the decision requires policies,
definitions or unstructured context.

DP-600 provides the base for preparing, serving and governing these assets. The AI-103 path, in
progress, extends that base toward applications and agents capable of using knowledge and tools.
The AI-300 path, also in progress, brings in the practices needed to evaluate, observe and
maintain those capabilities once they begin to operate on a sustained basis.

This convergence defines an essential part of my profile. I do not build the analytical platform
first and then add artificial intelligence as an independent layer. I design the complete journey
so that the data can sustain human analysis, Power BI experiences and intelligent solutions
under shared definitions, controls and responsibilities.

## The technical governance of the platform

<!-- seccion: gobierno-tecnico -->

Governing an analytical platform means keeping control over the identity, provenance, meaning,
quality and conditions of use of the information. It does not consist only of granting
permissions or of maintaining documentation separate from the operation.

At Vesting, governance had to be built in from the design because the platform received
information associated with 12 different clients, their integrations and their agents. The
identifiers, ownership, context and access conditions could not be added after building the
analytical products. They had to be preserved from the entry of the first event. The isolation
mechanism was architectural: separate workspaces per client on common event structures, so that
the separation did not depend on the discipline of whoever queried, but on the place where each
data point lived.

Microsoft Fabric offers an important advantage by integrating storage, processing, modeling and
consumption within a common ecosystem. This closeness reduces some of the technical boundaries at
which identities, permissions and lineage normally fragment.

However, an integrated platform does not produce governance automatically. It is still necessary
to define responsibilities, organize the workspaces, establish access criteria, document
transformations, differentiate development and production environments and control how the
analytical assets evolve.

Fabric's technical integration creates a favorable base, but governance remains a discipline of
architecture and responsibility. The tool provides capabilities; the organization must turn them
into applicable rules, practices and decisions. The complete framework with which I work data
governance and AI governance —in banking, on the agents platform and today in health under
ISO/IEC 42001— is in its own document.

## Lineage, life cycle and agents as new consumers

<!-- seccion: linaje-y-nuevos-consumidores -->

Lineage must make it possible to trace a result from Power BI back to the structures and
transformations that support it. Fabric exposes it natively among its artifacts —from the
dashboard to the model, from the model to the lakehouse table, from the table to the pipeline
that loaded it—, but the documentation must explain not only where a data point comes from, but
also which rules modified its meaning. Those responsible need to understand what consequences a
change can have before applying it.

Governance also covers the life cycle. Models, pipelines and reports must be able to evolve
without introducing unexpected changes for those who use them. This requires processes of
development, validation, publication and follow-up proportional to the importance of each asset.
At Vesting, a change in the event structure of an integration was treated as a contract change:
it was validated in the reception layer before it could touch a semantic model.

On platforms also intended for artificial intelligence solutions, governance must extend toward
the new consumers. Defining who can query a data point is not enough. It is necessary to
establish which application or agent can use it, for what purpose, with what level of detail and
under what supervision mechanisms. An agent that reads a governed measure inherits its
definition; an agent that reads a raw table inherits the obligation to interpret it, and that
obligation must be written down somewhere.

## The life cycle of analytical assets

<!-- seccion: ciclo-de-vida-analitico -->

An enterprise analytical platform is not finished when the pipeline runs correctly or when the
report has been published. Data, definitions, rules and user needs change. That is why the assets
need a life cycle that allows developing, validating, publishing, observing and modifying them
without losing control over their effects.

I try to clearly differentiate the states of a solution. A transformation under development
should not be treated as a reliable source for decisions. A model that is still being validated
should not silently replace the one the operation uses. A published report should not be
modified without understanding which people, processes or products depend on its metrics. In
Fabric that differentiation relies on separate workspaces per environment and on deployment
pipelines between them; at Fundación CTIC, with 42 analytical products in use, the separation is
what makes it possible to correct a model without 75 users seeing a half-baked figure.

This discipline requires controlling changes to pipelines, semantic models, measures and reports.
Every relevant modification must keep a reason, a person responsible and a way to verify that the
result remains correct. The depth of the control must be proportional to the impact of the
asset: not every change needs the same process, but none should be introduced without knowing
its possible consequences.

This way of working connects directly with my experience in processes and quality, which began
under ISO 9001:2015 at Inglopres. An analytical asset needs owners, acceptance criteria,
controls, evidence and continuous improvement. DP-600 formalizes this discipline within the
Microsoft Fabric life cycle, while the AI-300 path extends it toward the operation of models,
generative applications and artificial intelligence agents.

## Testing, reversibility and retirement of an analytical asset

<!-- seccion: pruebas-reversibilidad-y-retiro -->

Tests must include both behavior and data. A deployment can complete technically and still
produce incorrect figures because a relationship, a rule or the interpretation of a source
changed. That is why, besides verifying that the components work, it is necessary to check
critical measures, counts, relationships and expected results before considering a new version
stable. A typical test in my Power BI models is reconciliation: the total of a key measure in the
new model must match the one in the current model and the source —three figures, one single
truth—, and a difference that cannot be explained stops the publication.

I also consider it necessary to design reversibility. When a change produces an unexpected
result, the organization must be able to identify which version introduced it, understand which
assets were affected and restore a reliable condition while the cause is investigated.
Versioning the semantic model as a project —with Tabular Editor or in PBIP format, in a Git
repository— is what makes that rollback possible: the change is compared, the measure or
relationship that introduced it is identified and the previous version is restored without
rebuilding anything by hand. The ability to evolve safely depends as much on moving forward as on
being able to move back in a controlled way.

The life cycle also covers retirement. Models, reports and pipelines that have stopped answering
a need should not remain indefinitely as apparently current assets. Retiring a solution requires
identifying its consumers, preserving the necessary information, communicating the change and
preventing a definition that no longer represents reality from continuing to be used.

The difference between building a dashboard and developing an enterprise capability appears
clearly at this point. The dashboard can be published once. The capability needs to evolve
without losing definition, reliability or memory of the decisions that built it.

## Optimization as an end-to-end discipline

<!-- seccion: optimizacion-extremo-a-extremo -->

I do not understand optimization as an activity exclusive to DAX, Power Query, SQL or Spark. The
performance of an analytical solution is the accumulated result of decisions made throughout the
whole architecture.

A slow query can originate in reading an unnecessary volume, a misplaced transformation, a model
with ambiguous relationships, an expensive measure or a visualization that requests more
information than needed. Optimizing only the last layer can temporarily hide the symptom without
correcting the mechanism that produces it.

My criterion is to intervene first in the layer where the waste originates. If the pipeline
carries unnecessary information, the solution should not begin by rewriting a measure. If the
granularity exceeds the need of the analysis, a simpler visualization will not correct the
structural cost. If the model contains ambiguous relationships, adding capacity will only hide
the problem temporarily. Optimizing requires identifying the mechanism and not just relieving the
symptom.

It is the same logic I applied on the shop floor when doing time study at Inglopres: the
bottleneck is looked for at the station where work piles up, not at the last machine on the
line. In a Vesting model with 120 tables, the first question in the face of a slow visual was not
which measure to optimize, but whether that events table should be in the model at that level of
detail.

That is why I begin by identifying where the time, capacity or complexity is consumed. I evaluate
which data must travel, which transformations can run close to the source, which aggregations
are worth materializing, which granularity needs to be kept and which calculations must be
resolved in the semantic model.

## Where to intervene first: Power Query, the model, DAX Studio and capacity

<!-- seccion: donde-intervenir-primero -->

In Power Query, intervening first means reducing unnecessary columns and rows early, preserving
query folding when possible, avoiding repeated transformations and structuring the steps
understandably. A query that folds to the source delegates the filter and the aggregation to the
database; one that does not fold downloads everything and filters in memory, and the difference
shows in the refresh time before it shows in any visual.

In the semantic model, it means reviewing relationships, cardinalities, measures, contexts and
structures that affect both performance and maintainability. A star schema with clean dimensions
and a thin fact table performs better and is understood better than a model with many-to-many
relationships improvised to get by.

In DAX Studio I can compare the behavior of queries and establish whether a modification produces
a real improvement: formula engine time versus storage engine time, number of internal queries,
size of the intermediate results. Tabular Editor makes it possible to strengthen the structure
and apply consistent practices to the model's objects. No tool replaces judgment, but both provide
evidence to decide where to intervene. That is how I worked at Banco Pichincha in 2023, and that
is how I still work.

Optimization must also consider capacity utilization and cost. In Fabric, capacity is a shared
resource consumed in units and shared among pipelines, queries and models; a solution that
responds quickly through disproportionate consumption may not be sustainable when users, models
or workloads grow. The architecture needs to respond correctly today and keep a reasonable path
to grow.

The result I seek is not an isolated performance figure. It is a balanced solution: fast enough
to be adopted, clear enough to be maintained, governable enough to be trusted and efficient
enough to scale.

## What I am building to demonstrate it in public

<!-- seccion: lo-publico -->

I keep in exploration, within my applications pipeline, an end-to-end analytics piece on
Microsoft Fabric using open data from Colombia. Its purpose is to turn into public, reproducible
evidence the capabilities that DP-600 validates and that I have applied in professional
environments. It is an exploration declared with that word and with no committed date.

The piece must cover the complete journey: identification of the source, ingestion, preservation
of the information, transformation, quality validation, organization in lakehouse or warehouse,
construction of the dimensional model, development of the semantic model and creation of an
analytical experience in Power BI.

I do not want to publish only the final dashboard. The demonstrative value lies precisely in
making visible what normally stays behind: why each component was selected, which rules
transformed the information, how quality was verified, which decisions structured the model and
how traceability to the sources is preserved.

The architecture will have to justify when it uses lakehouse, warehouse or both. It will also
have to show how the layers are separated, how changes are managed and how unnecessary
duplication of data or logic is avoided.

The semantic model will have a central role. It will have to contain understandable dimensions
and facts, documented measures, verifiable relationships and a structure capable of sustaining
different analytical experiences without rebuilding the meaning in each report. Power BI will
have to demonstrate potential adoption, not only visual design. The experience will be organized
around questions and decisions, with a navigation that allows moving from the overview to the
evidence that explains each result.

## What that piece will have to meet to stop being an exploration

<!-- seccion: criterios-de-la-pieza -->

The piece must also prepare assets reusable by different consumers. Beyond human analysis, I will
explore how certain definitions, measures or structures can be made available to applications
or agents without letting them freely rebuild the institutional logic.

It remains declared as an exploration because it does not yet meet all the criteria needed to
join the inventory of the 32 built pieces of the showcase. It will not change status for having
a working connection or a convincing dashboard. It will have to have documented architecture,
reproducible deployment, quality controls, a verifiable semantic model, performance criteria and
enough evidence about its results, which is the same bar the 6 sibling applications already
published meet.

When it is finished, it will not replace the evidence of my professional experience or of the
certification. It will fulfill another function: it will let anyone publicly examine how I turn
the principles of Fabric, Power BI, governance and data preparation for AI into a complete
solution.

The form of Power BI publication will be defined according to the technical, licensing, security
and access conditions available for the piece. The demonstrative goal does not depend on imposing
a specific embedding modality, but on making the model, the measures, the architecture and the
analytical experience verifiable through a mechanism compatible with those conditions.

## What Fabric represents within my profile

<!-- seccion: fabric-en-mi-perfil -->

Microsoft Fabric represents the convergence of several capabilities I initially developed
separately. It integrates the engineering needed to receive and transform data, the architecture
required to store it, the modeling that organizes its meaning and Power BI as the analysis and
decision experience. Before Fabric, those capabilities lived in different tools: SQL and ETL
since Inglopres and TransMilenio, Power Query and DAX at Cafam and Banco Pichincha, governance
at the bank. Fabric was the place where they came together on a single platform.

Its importance in my profile does not come only from having earned DP-600 or from knowing its
components. It comes from having used that platform to solve an especially demanding problem:
building from scratch, between August 2023 and January 2025, a data ecosystem to observe
artificial intelligence agents and turn their events into useful information for product and
operations. I closed that stage by leaving the ecosystem and the process documented.

Fabric also represents a bridge toward my current responsibility. Organizations need platforms
capable of serving analysts, processes, applications and intelligent solutions simultaneously.
This requires reliable data, reusable models, security, governance and an architecture that
allows incorporating new uses without rebuilding the whole base every time.

Industrial Engineering brings the view of the system and the flow the platform must represent.
Industrial Design brings the experience through which that complexity becomes usable. DP-600
brings the analytical architecture. The AI-103 path extends the use of those assets toward
applications and agents. The AI-300 path brings in the discipline needed to operate and observe
the intelligent solutions that consume that information.

My specialty does not consist of using each Fabric component in isolation. It consists of
deciding what architecture the problem needs, how the information must travel through it, what
meaning it will preserve and in what form it will become an analysis or artificial intelligence
capability the organization can use with confidence.
