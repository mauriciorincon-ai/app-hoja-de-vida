---
slug: cm-operaciones
titulo: "C&M Consorcio / TransMilenio — Operations Analyst (2018–2020)"
resumen: "My entry into mass transit: 18 months supervising Bogotá's operation with data, performance dashboards and reports, automation of processing and the two questions that are research today."
estado: aprobado
ancla: "#trayectoria"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What did Henry do at C&M Consorcio?"
  - "What experience does he have with mass transit data?"
  - "Has he supervised the compliance of an operation with data?"
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
  a `CONFIRMAR: what is missing` marker in square brackets, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
  -->

<!-- guide (comes from the skeleton of the story, S3 — written by the owner):
Your entry into the world of mass transit: which dashboards you
built, what it was like to work with the data of Bogotá's operation, what
you automated. -->

## The operation of a city

<!-- seccion: la-operacion-de-una-ciudad -->

I joined **C&M Consorcio 2018 in November 2018** as a Junior Operations Analyst, within the
supervision of **TransMilenio**, and stayed until May 2020: **18 months**. It was my entry into
mass transit and the first time I analyzed an operation of urban scale, with many actors,
services, vehicles, routes and contractual obligations at the same time.

My role was one of supervision: we did not operate the system, we verified with data that it was
operated as agreed. That changes the nature of the data. It stops serving to improve your own
process and comes to sustain a conversation between the authority and the concessionaire, where
neither of the two parties can dispute where the number came from.

No single source described the entire operation: some **150 routes from 10 concessionaire
companies**. It had to be reconstructed by cross-referencing records with different detail,
timeliness and quality:

- fare collection;
- the fleet and the buses' GPS;
- the scheduling of services;
- the operational incidents;
- the users' PQR (complaints and claims).

There I understood that traceability is not a technical feature but a condition of legitimacy:
when an indicator can have contractual or economic effects, it has to be possible to explain what
it represents, which sources it comes from, which rules were applied to it and which concrete
events support it.

## The performance dashboards and reports

<!-- seccion: tableros-e-informes -->

I developed the **performance dashboards and reports** with which TransMilenio's supervision
followed the operation: two weekly reports, one monthly consolidated report and those requested
on demand. They transformed large volumes of records into indicators, flagged the relevant
deviations and made it possible to go from the individual record to the behavior of the system.
What was verified in them:

- scheduled versus completed services;
- routes and coverage;
- frequencies and intervals between buses;
- execution times and compliance of the operation.

A supervision dashboard cannot stay at the aggregate. It has to let each indicator be traversed
from the executive view down to the event that supports it, because the synthesis facilitates the
decision but the detail is what allows validating, explaining and contesting a conclusion.

In supervision, the indicator is not management: it is evidence. When a discount or a penalty can
hang from a figure, it has to be possible to reconstruct it from the schedule, the execution and
the rule applied. Its **traceability** —the _data lineage_— weighs as much as its calculation.

There I also learned to separate **lagging indicators**, which evaluate what happened in a
period, from **leading indicators**, which show how that result is taking shape and where the
irregularities appear before they weigh. I later carried that way of working over to semantic
models and to Power BI: a metric with stable meaning, traceable, that answers a relevant
question.

## The automation of reports and repetitive tasks, and the operational history

<!-- seccion: la-automatizacion -->

I automated the recurring activities of preparation, validation and consolidation of the
information of TransMilenio's operation, with scripts in **Excel and VBA** and databases in
**SQLite** queried in SQL: every week the concessionaires' databases arrived, and the records had
to be extracted, validated, transformed with the same rules and consolidated into the cumulative
total. That reduced processing time by **at least 40%**, made the work repeatable and stopped it
from depending on individual procedures that were hard to audit.

Automating was not executing the same thing faster. First it was necessary to define which inputs
each process received, which validations it applied, which rules transformed the data and which
exceptions could arise; an automation over ambiguous definitions only processes the
inconsistencies with more speed.

With that I built and maintained the **statistical databases** of the operation: a history that
made it possible to compare periods, recognize recurrences and distinguish an isolated event from
a persistent behavior, so that each analysis would not start from zero. It was my first complete
data pipeline —extract, validate, transform, relate, store, publish—, years before doing it on a
platform.

## Auditing compliance

<!-- seccion: auditoria-de-cumplimiento -->

Part of my responsibility was verifying **adherence to the protocols** and operating conditions
of TransMilenio: contrasting execution against what was scheduled or agreed, with data, on the
services completed, the routes, the times and the compliance of the operation. It is a
**contractual compliance audit**, and the indicators had economic consequences.

That function taught me to distinguish **formal compliance from systemic performance**. An
operation can satisfy several criteria one by one and still produce a bad result because of how
its parts interact. That is why, besides verifying whether a condition was met, I needed to
understand how the decisions about vehicles, drivers, routes and demand combined into a result.

And I learned to distrust local optimizations: an efficient decision for one vehicle, one route or
one time band could deteriorate the regularity, the coverage or the compliance of the complete
system. Analyzing an urban operation requires looking at interactions and cumulative effects, not
pieces.

## The two questions I could not answer back then

<!-- seccion: las-dos-preguntas -->

From the data of those 18 months came two questions that I detected in the operation and had no
way to resolve from supervision.

**The driver–vehicle–route assignment.** An available driver, an operational bus and a scheduled
route are not three independent decisions: they form a unit whose performance depends on the
compatibility between their characteristics, on the route, on the demand and on the failures that
appear during service. The history said which combination had been used and what it had
produced; deciding which one to use was another question, a prescriptive one, that the indicators
did not answer.

**Bus bunching.** Looking at the temporal proximity between passes, you could see when several
buses of the same route began to circulate with intervals that were too short. Each bus kept
providing service, but the system lost **headway regularity**: some users found several buses
together and others waited twice as long. Detecting it was the first level; the hard one was
turning the detection into a headway control policy —holding, advancing or skipping stops
depending on the position within the group—, because a uniform instruction is useless when the
buses are already running together.

Those two questions are today **two of the research pieces I publish in the showcase**: the
driver and bus assignment with failures, and the control of bus bunching. What in 2019 was an
anomaly on a dashboard is now a model with its method and its result.

## What C&M Consorcio left

<!-- seccion: lo-que-dejo -->

C&M Consorcio was my first operation of urban scale. I learned to reconstruct a system that no
single source describes entirely, to sustain with evidence a conversation between an authority and
a concessionaire, and to keep the history so that each analysis would not start from zero.

The integration of sources later became data pipelines and platforms; the consistent definitions,
semantic modeling and governance; the automation, applications; and the two unanswered questions,
published research.
