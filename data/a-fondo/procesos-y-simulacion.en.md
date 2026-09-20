---
slug: procesos-y-simulacion
titulo: "Processes and simulation"
resumen: "The industrial root with its methods: BPMN with Bizagi in four companies, discrete-event simulation with FlexSim at Inglopres and in Cafam's dispatch of medicines, nominal versus effective capacity, time study with ILO allowances, Kanban and Scrum, ISO 9001, and Vesting's replicable process."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What does Henry know about process modeling and simulation?"
  - "Has he used Bizagi or FlexSim?"
  - "Can he model processes in BPMN?"
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

## The process root that does not show in a technology list

<!-- seccion: la-raiz -->

I am an Industrial Engineer from the Pontificia Universidad Javeriana, with an emphasis in Data
Analytics Intelligence, and I also studied Industrial Design. Before data platforms, Power BI and
agents, I learned to understand processes, model systems, analyze constraints and distribute
resources around the people who execute the work.

That root explains how I start any data problem: not with the table or the model, but with the
system that produces the information —who intervenes, what inputs it needs, what it generates,
where waits, errors or losses appear—. An organization's result depends less on the performance
of each part than on the relationships between them: an area can meet its target and hurt the
flow; an activity that is efficient in isolation can be the system's constraint. And I decide
**what to measure before looking at the field catalog**: at Inglopres I discovered that I could
not improve the processes because nobody generated the data, and the solution began by designing
how to capture it.

## Bizagi in practice: modeling the process in BPMN

<!-- seccion: bizagi-en-la-practica -->

With **Bizagi** I model processes in **BPMN**: activities, decisions, owners, events, inputs,
results and handoffs between areas. Its value is not the diagram: it is a common language to
contrast how an operation should work with how it is executed, and to turn knowledge spread
across people, systems and procedures into something that can be discussed and improved. I have
used it in four companies:

- **Inglopres** (2016): the machinery rental operation —sales, availability, maintenance,
  logistics— translated into activities, states and rules the ERP could represent.
- **Ceinfes** (2017): the dependencies between scheduling of test administrators, preparation and
  distribution of material, administration, reception and digitization, each front with its time
  window.
- **Cafam** (2020): receiving, storage, picking and dispatch, contrasted with the expected
  behavior of the WMS before testing and parameterization.
- **Banco Pichincha** (2023): the analytical products placed in the activities and decisions they
  had to support.

On this site the principle is automated: the BPMN of every piece in the showcase is generated
from its definition, so that the diagram does not age when the process changes.

## FlexSim in practice: simulating before intervening

<!-- seccion: flexsim-en-la-practica -->

A diagram shows the sequence; it does not say what happens when demand varies, times have
dispersion, resources compete or one stage produces faster than the next one absorbs. For that I
use **discrete-event simulation** with **FlexSim**: entities that travel through the process,
resources with limited capacity, variable times, queues, priorities and assignment rules.

I used it at **Inglopres**, to compare alternatives of the rental operation before changing it,
and at **Cafam**, where the largest model I have built represented the **dispatch of medicines**
of the distribution center: how receiving, put-away, picking and dispatch interacted under the
logic of the new WMS, and where a reasonable rule in one activity produced waits or congestion in
another.

Simulation does not predict on its own: its results are worth what the data, the distributions
and the fidelity of the model are worth. That is why I separate **verification** —the model
executes the logic it was built with— from **validation** —that logic represents the real system
for the purpose of the analysis—, and I compare scenarios instead of producing a single answer:
I change demand, capacity, assignment or priorities and observe utilization, cycle time,
work-in-process inventory, queue length, _throughput_ and service level.

## Nominal capacity, effective capacity and variability

<!-- seccion: capacidad-y-variabilidad -->

What simulation taught me most is the difference between **nominal capacity** —what is processed
under ideal conditions— and **effective capacity**, which incorporates variability, pauses,
availability, errors, rework and travel. Designing with averages produces a capacity that adds up
in the calculation and fails against the real distribution of demand: in Cafam's dispatch, the
queue was not where the average said.

From there, a way of thinking I apply outside the plants: I do not ask how long a process takes
on average but how its times are distributed, what happens at the peaks, which resource limits,
how a delay propagates and how sensitive the result is to its assumptions. And I distinguish a
local improvement from a systemic one: speeding up one activity can accumulate inventory in the
next; raising a resource's utilization can take away responsiveness; removing a wait can move the
congestion without lowering the total time.

Today I apply it to an indicator —its distribution, not its average—, to a predictive model
—where the error concentrates— and to an AI agent —which ambiguous inputs produce results that
are hard to detect—. Systems are designed for the reality that varies, not for an average that
rarely occurs.

## Work study, line balancing and agile

<!-- seccion: estudio-del-trabajo -->

Three more methods of the discipline that I have applied by name. The **time study** at
Inglopres: timing, performance rating, standard time and **fatigue allowances** taken from the ILO
table, because an observed time is not a standard until it recognizes the effort of the person
who performs it. **Line balancing** at Ceinfes: the digitization of 250 answer sheets per session
treated as a line with stations, a bottleneck and effective capacity, in the vocabulary of the
theory of constraints. And **lean** and agile methods with Ceinfes's technology area: **Kanban**
—a pull system with a limit on work in progress— for the flow of requests and **Scrum** in sprints
for the projects.

The three solve the same thing at different scales: that the pace is set by the real capacity of
the system and not by the aspiration of the schedule.

## ISO 9001 and documentation: the discipline of the written trail

<!-- seccion: iso-9001 -->

At Inglopres I worked on quality assurance under **ISO 9001:2015** in the supply chain, my first
formal school of traceability: it is not enough to claim that the process works; one has to
establish what result is expected, how it is controlled, who is responsible, what evidence is
kept and what happens in the face of a deviation.

That discipline changed how I document, and today I apply it to data architecture —a
transformation keeps its purpose, a measure has a definition, a change has a reason—, to my
applications and agents —decisions in ADRs, controls that are proven by failing, validated
outputs—, and to AI: a claim is tied to its evidence or the system declares the gap.

ISO 9001 and ISO/IEC 42001 are not the same standard nor an evolution in numbering: they govern
different objects. They share the structure of management systems —context, responsibilities,
risks, documented information, evaluation, improvement—, and that structure, learned in 2016, is
the one I recognized when I took on AI governance in 2025.

## Building processes, not only deliverables

<!-- seccion: construir-procesos -->

An individual solution generates value; a replicable process builds capability. At Vesting I did
not limit myself to taking part in the creation of agents: I defined, documented and validated
the eleven-stage core process with which 27 were built, so that each implementation drew on what
was learned in the previous ones. Standardizing was not making identical agents: it was sharing
how to understand the problem, specify, build, validate, deploy and observe, leaving sources,
tools and rules free.

The same approach governs my pipeline: priority and vision before moving forward, a summary per
cycle, validated outputs, controls that fail before being trusted, AI only with justification. It
is industrial engineering: the value is not in producing the next unit but in improving the
system that will produce all the following ones. I do not seek to have an organization depend on
me: I seek to leave standards, memory, components and criteria on which others keep building.

## The questions that remained open

<!-- seccion: preguntas-pendientes -->

Some of the questions I work on with the most rigor today were born in my first jobs, when I
could recognize the problem but did not have the data, the time or the tools to solve it. At
TransMilenio: how to assign drivers, vehicles and routes under availability, demand, typology and
failures, when treating them as separate lists produces combinations that are valid one by one
and deficient as a whole; and which headway control policy corrects bus bunching without moving
the problem elsewhere. In digitization and production processes: which fatigue allowance
corresponds to each effort, repetitiveness, environment and altitude, instead of a general
percentage.

Today I address them with systematic review, modeling, optimization, simulation and synthetic
scenarios in the research of my showcase, and when communicating them I distinguish between a
research line, a model validated with synthetic data, a conclusion supported by the literature
and an intervention demonstrated in operation. They are the industrial problems of always
—assign, balance, control— with tools that the trajectory allowed me to build later.
