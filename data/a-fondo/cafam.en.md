---
slug: cafam
titulo: "Cafam — the WMS and the team of 20 (2020–2021)"
resumen: "The implementation of Oracle WMS Cloud in a medicines distribution center: 20 people in testing for six months, the control BI, the integrations in VBA and data quality in SQL."
estado: aprobado
ancla: "/proyectos/cafam"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What did Henry do at Cafam?"
  - "What is the largest team he has led?"
  - "Has he participated in the implementation of a WMS?"
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
The story behind the case study: what it was like to lead the largest
team of your career, what went wrong and how you solved it, details of the
VBA integrations and the control BI that do not fit on the page. -->

## The context: changing the system that runs the warehouse

<!-- seccion: el-contexto -->

I joined **Cafam in October 2020** as an Information Systems and Projects Analyst and stayed
until June 2021. My responsibility was the implementation of a **WMS** —a warehouse management
system, in this case **Oracle WMS Cloud**— in the **medicines** distribution center: an operation
where every inventory error has a cost and, sometimes, a patient behind it.

Changing the system that governs a warehouse is among the most delicate interventions in a
logistics operation. The WMS has to represent precisely which products there are, where they
are, in what quantity, which movements they have made and in what condition they are, and do it
while the operation keeps dispatching.

The challenge was not installing an application. It was demonstrating that the system
interpreted the operation correctly, executed its rules, integrated with the other components and
preserved the consistency of the information in every movement. And doing it without slowing down
dispatch.

Before testing anything, I modeled the distribution center's process in **BPMN with Bizagi**
—receiving, storage, picking, dispatch— and simulated in **FlexSim** the dispatch of medicines to
understand where a rule of the new system could create a queue that did not exist today.
Implementing an enterprise platform requires intervening at once in processes, data, technology
and ways of working; if one changes and the others do not, the solution does not reach its
purpose.

## The team of twenty: the largest I have led

<!-- seccion: el-equipo-de-veinte -->

I led a mixed team of **20 people** during the testing phase: **14 from Cafam and 6 from
Oracle**, which had just acquired the product and was deploying it with its own specialists. The
combination brought together the two indispensable kinds of knowledge: the internal team knew how
the distribution center really worked; the vendor's knew how the system behaved.

The testing phase lasted **about six months**. It was not a one-off validation before going to
production but a sustained process to verify functionalities, rules, data, operational paths,
integrations and exceptions, cycle after cycle.

Coordinating a mixed team required a common language between operations and technology. A
situation the user described as "an inventory problem" had to be turned into a reproducible
scenario: known inputs, defined steps, expected result and enough evidence to decide whether it
was a system failure, a badly loaded piece of data or a process rule nobody had written down.

The coordination challenge was not handing out test cases. It was ensuring **coverage**, avoiding
duplication, keeping consistency in execution and making visible which parts of the system were
validated, which were pending and where there were blockers; and making sure the vendor did not
resolve each finding alone, but that the internal team understood the logic, the parameters and
the limits of the system it was going to operate afterwards.

The team's coordination contributed to **reducing errors by 25%** and to **improving operational
efficiency by 15%**: inventory record accuracy (**ERI**) is what those two numbers measure. They
did not come from more supervision but from better-defined work, clear criteria and visible
progress.

## From testing to process adjustment and parameterization

<!-- seccion: pruebas-y-parametrizacion -->

Once the main testing phase was over, the work moved on to adjusting the processes and to the
**parameterization** of Oracle WMS Cloud: configuring it without modifying its code, which is
different from customizing it. The findings of six months of testing with the Cafam and Oracle
team said which differences were resolved with configuration, which required changing the
procedure and which were, truly, a defect.

The criterion was not only that the platform worked: it was protecting the continuity of a
critical operation. Each adjustment was evaluated by its effect on inventory, the flow of
materials, traceability and dispatch capacity.

Not every difference between the system and the operation was a software failure. Sometimes the
platform made visible an ambiguous rule or a procedure that depended on informal decisions; other
times, the process had a legitimate need that the system did not cover as is. Parameterization was
the meeting point: each adjustment defined how the solution would behave toward certain entities,
states, rules and exceptions.

There I learned that testing is not an activity that comes after development. It is the way to
discover knowledge about the system and about the process that uses it.

## The control BI of the implementation

<!-- seccion: el-bi-de-control -->

I designed the business intelligence reports and the dashboards with which the implementation
itself was controlled. They improved the **precision of test tracking by 50%** and were adopted by
**more than 15 users** of the project: the medicines director, the IT director, the project
director, the distribution center director and his coordinators and supervisors.

The most valuable dashboard did not describe the usual operation but the progress of the
transformation while it was happening: scenarios executed, coverage reached, results, defects
found, owners and blockers. The indicators ran along the testing cycle: it was not enough to count
executed cases; you had to see their coverage, status, criticality, pass rate, recurrence and
resolution time, and the relationship of each finding with the parameterization adjustments.

A technology project is also instrumented. When progress, blockers, quality and risks are visible
every day, the project is governed with evidence and not with the feeling of progress. And
adoption was designed: the directors used the dashboards because they answered their
coordination questions and saved them effort in knowing where the project stood.

## The integrations in VBA

<!-- seccion: integraciones-vba -->

I developed applications in **VBA** to integrate activities of the distribution center with the
WMS: data loads that previously depended on manual handling came to apply rules in a repeatable
way. They increased **automation by 15%** and **reduced data errors by 50%**.

VBA was the right choice for that context: a tool accessible to the organization, compatible with
what the teams used and flexible enough to close gaps that threatened the continuity of the
process. Its purpose was not to maintain an architecture parallel to the WMS but to solve what the
central system did not yet cover; and they kept running after go-live, as known peripheral
pieces, with an owner and with a limit.

There I learned to recognize the value and also the risk of peripheral solutions: they solve an
urgent need and can become a critical component that nobody governs. They are designed knowing
how they relate to the central system, what dependencies they have and when they are retired.

## Data quality, in SQL

<!-- seccion: calidad-en-sql -->

I established in **SQL** the **data quality** improvements for the information that circulated
between systems and contributed to improving the **precision and reliability** of the information
the WMS used by **20%**.

The complex part was not inside one application but at the boundaries between them. Two systems
that were correct on their own produced inconsistencies when exchanging identifiers, states,
quantities, dates or rules. With SQL I traversed the information, contrasted sources, found
missing records, duplicates and broken relationships, and located where the difference between
the expected state and the observed one originated.

The method was one of industrial engineering: **validation by medicines with an 80-20
criterion**. The main medicines were taken —those that concentrated the volume— and at first none
of them matched between the WMS and the source system. It was adjusted little by little,
prioritizing those medicines, until reconciliation became a permanent review and not a project
closure. As a complementary analysis tool I also used SAS.

I learned that quality is not an abstract property: a piece of data can be valid in its format and
not be timely, complete or consistent enough for a concrete decision. And that the controls go
inside the pipeline, close to the source, not in a manual review at the end. A model processes
fast, but it does not fix a contradictory piece of data: it propagates it faster.

## What Cafam consolidated

<!-- seccion: lo-que-cafam-consolido -->

Cafam was the experience in which I most directly integrated processes, enterprise applications,
data, testing, automation and multidisciplinary leadership: six months with 20 people, a BI to
govern the project, integrations that closed gaps and data quality watched over in SQL.

It taught me to translate in both directions. From the business to the system: an inventory
complaint becomes a reproducible scenario with inputs, steps and expected result. From the system
to the business: a parameter is explained by its effect on inventory, traceability and the
continuity of dispatch.

And it left a question that is still current in my work: how to transform an enterprise platform
without trying to replace all of its capabilities at once. The order matters, and the peripheral
pieces —known, with an owner and with a retirement date— are part of the design.
