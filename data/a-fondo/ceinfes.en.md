---
slug: ceinfes
titulo: "Ceinfes — Operations Coordinator (2017–2018)"
resumen: "Coordinating three fronts for more than 100 schools: KPIs by area, the balancing of digitization, reports to the board of directors and the transition to process management with Kanban."
estado: aprobado
ancla: "#trayectoria"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What did Henry do at Ceinfes?"
  - "Has he presented reports to a board of directors?"
  - "Has he worked with Kanban and agile methodologies?"
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
The transition to process management, how you set up the KPIs, what
reporting to the board of directors was like, what coordinating
multidisciplinary teams left you. -->

## The assignment

<!-- seccion: el-encargo -->

I joined **Ceinfes in November 2017** as Operations Coordinator and stayed until November 2018.
It was the step from improving one process to directing an entire operation, with teams,
resources, dependencies and control points that did not depend on me one by one.

Ceinfes provided educational assessment services: mock tests for **more than 100 schools a
year**. The operation had to put teachers, consultants, materials, assessment instruments and
transport at each institution on the exact date. Arriving early got in the way; arriving late
left the test unadministered.

Under my coordination converged three fronts that only worked together, about 40 direct people
—7 in scheduling, 12 in digitization and 20 in logistics— and, through scheduling, about 50
teachers acting as test administrators:

| Front        | What it did                                                | What happened if it failed                                         |
| ------------ | ---------------------------------------------------------- | ------------------------------------------------------------------ |
| Scheduling   | assigned teachers and consultants to schools and dates     | a test without an administrator, or an administrator in two places |
| Digitization | turned the physical answer sheets into data, with scanners | a student without a result, or with someone else's                 |
| Logistics    | prepared and moved the material to each institution        | a schedule pushed back for the whole cycle                         |

My responsibility was for them to stop operating as three areas and start operating as a single
flow. Out of that came the way of thinking that still guides my work: the performance of a system
is not explained by the isolated efficiency of its parts, but by the quality of the relationships
between them.

## The indicators, by area

<!-- seccion: los-indicadores -->

Coordinating three fronts with more than 100 schools in between required seeing the state of the
operation without asking. I defined and managed **KPIs** for the three processes —scheduling,
logistics and digitization— as gauges installed along the operational flow, each with its number
of the day:

- demand to be served: schools and students scheduled by date;
- confirmed resources: assigned administrators against those required;
- material prepared and delivered, by institution;
- tests received back;
- pending digitization and validated records.

The two that weighed most were **schedule compliance** —how many administrations happened where
and when they were planned— and **digitization progress**, because the date of delivery of
results to the school depended on it. Behind them went on-time deliveries by institution, the
percentage of manual capture and the rework per batch.

I learned that measuring only the final result arrives late: when an indicator says a delivery
failed, much of the value of knowing it has already been lost. That is why the intermediate
indicators —accumulations, delays, capacity differences— were the ones that served to intervene.

And I learned to build shared definitions. "Material prepared", "complete delivery", "confirmed
resource" and "processed record" had to mean the same thing for the three areas; if not, the
meeting was spent arguing about the figure and not the problem. Each KPI also kept traceability
down to the event: the institution, the batch, the assignment that explained the number.

## The balancing of the digitization process

<!-- seccion: balanceo-de-digitalizacion -->

The **digitization of the answer sheets** deserved separate attention, because it behaved like a
production line: receive, organize, identify, scan with specialized equipment, review, correct the
doubtful readings and complete by hand what automatic capture did not resolve.

I treated it as what it was, a **line balancing** problem: some **250 answer sheets per
session**, two scanning stations and, around them, those for preparation, organization, validation
and reordering; close to 10% of the sheets needed manual capture. Each station had a capacity, a
cycle time and an impact on final quality. If one advanced faster than the next one absorbed,
work in process piled up; if capture sped up at the expense of review, the errors reappeared later,
more expensive. The station that restricted the flow —the **bottleneck**, in the vocabulary of the
theory of constraints— was the one that set the real pace of the process, and it was the one that
had to be protected and fed.

Out of that came a distinction I still use: **theoretical capacity versus effective capacity**.
The first is what a station processes under ideal conditions. The second incorporates exceptions,
reading errors, validations, manual capture, pauses and rework. Balancing with averages produced a
false picture and shifted the constraint from one place to another.

The balancing also had a human dimension. Reviewing and capturing are repetitive tasks, and a
standard that assumes a constant and indefinite pace is missed from the second week. Realistic
standards —the same fatigue allowances I had applied at Inglopres— were part of the balancing, not
a later adjustment.

Years later I applied the same logic to data pipelines and to AI agents: each component has a
function, a capacity, inputs, outputs and exceptions, and improving the system requires looking at
the complete flow and not the slowest piece.

## Resource scheduling

<!-- seccion: la-programacion-de-recursos -->

Assigning teachers and consultants to more than 100 schools, each with its date and its time
band, is an **assignment problem with time windows**: each administrator has availability, skills
and a starting location, and each school an exact window in which the test must take place. At
first it was done by hand, on Google Calendar. I designed a **VBA macro** that optimized the
assignment with those constraints made explicit, instead of with a list of names.

The assignment could not be limited to saying who went where. It had to consider the day's
demand, the available capacity, the priority of each institution, the required skills, the
dependencies with the material and the exact moment when the result was needed. Coordinating
meant protecting the complete flow, not keeping everyone busy.

## The conversation with the board of directors

<!-- seccion: la-junta-directiva -->

At Ceinfes I presented **strategic reports to the board of directors** for the first time in my
career. The reports were **weekly, every Friday**, and came out of the same KPIs of the operation.
Concrete decisions came out of them: incentive programs, improvements in working conditions,
redesign of workstations, redesign of processes and redesign of the software.

I learned to arrive with two levels: one slide with the consequence and a number, and behind it
the traceable basis in case they asked for it. The board does not want the detail; it wants to
know that the detail exists and can be consulted. Each report answered five things: what is
happening, why it matters, what explains it, what risk there is in leaving it as is, and what
alternatives there are.

That was the basis of my later relationship with senior management: technical rigor without
passing on its complexity, facts separated from interpretations, and recommendations with their
assumptions and consequences in plain view.

## The transition to process management

<!-- seccion: gestion-por-procesos -->

I led Ceinfes's transition toward a **process management** model supported by information
systems, and directed the technology projects that supported it with **agile methodologies**.
With the technology area we worked with **Scrum**, in sprints, for the projects, and with
**Kanban** for the flow of requests: a board with priorities, owners, dependencies and progress
status, and a limit on work in progress so that what was started got finished before opening the
next thing. I modeled the processes in BPMN with Bizagi.

The hardest change was not technical. The operation depended on knowledge spread across each
area; it had to be turned into explicit processes, shared information and systems capable of
sustaining them. That required documenting decisions that had been implicit for years, agreeing
on responsibilities and turning habitual exceptions into rules.

There I learned where resistance comes from: not from the technology, but from the fact that
making the process visible forces resolving ambiguities that for years were compensated for with
experience, informal communication and individual decisions. The transformation has to acknowledge
that knowledge and structure it, without eliminating the professional judgment of whoever had it.

I also learned to specify with more precision than a general diagram: what each activity
receives, which rule applies, what it produces and how it handles its exceptions. That
specification was the basis of **continuous improvement**: without an explicit process there is
nothing to measure the improvement against. It is the same demand I make today of an application
or an AI agent before building it.

## The multidisciplinary teams

<!-- seccion: equipos-multidisciplinarios -->

I coordinated teams with different and closely dependent functions: scheduling of test
administrators, digitization of answers and logistics of materials for more than 100
institutions. My function was to connect their capabilities, distribute the work, anticipate
constraints and get each team to understand how its result affected the others.

I led with clarity and visibility. Follow-up worked better when it made the system visible and
not when it served to watch people: by sharing priorities, loads, progress and blockers, the teams
coordinated themselves and recognized how a local difficulty affected the global result. My job
was to give context, eliminate ambiguities and intervene in time.

Working with assessment results also forced me to define who consulted what and for what purpose
before building the report. Permission was not an afterthought; it was part of the design of the
process. It was my first contact with what I would later call data governance.

## What Ceinfes left

<!-- seccion: lo-que-dejo -->

At Ceinfes I learned to direct an operation as a system of interdependent flows: I coordinated
people, resources, materials and information; I built KPIs to observe the flow; I balanced the
digitization line; I turned operational results into conversations with the board of directors;
and I brought management to explicit processes with Scrum and Kanban.

Inglopres taught me to structure an operation. Ceinfes taught me to direct it with information.
