---
slug: inglopres
codigo: AF-03
titulo: "Inglopres — Process Engineer (2016–2017)"
resumen: "My first job: an ERP (Odoo), the databases that did not exist, the work study and a team of twelve people with 95% customer satisfaction."
cuando_usar: "Use this when they ask about his first job out of university, an ERP implementation (Odoo), supply chain and logistics for heavy machinery, the time study and the twelve-person team at Inglopres (2016–2017)."
estado: aprobado
ancla: "#trayectoria"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What did Henry do at Inglopres?"
  - "Has he led the implementation of an ERP?"
  - "What was his first job out of university?"
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

<!-- guide (comes from the skeleton of the story, S3 — written by the owner):
The detail that does not fit in the timeline: what the operation was like, what
you did day to day with the ERP and the supply chain, anecdotes of the team
of 12 people, what you learned. -->

## My first job out of university: the operation and the assignment

<!-- seccion: la-operacion -->

I joined Inglopres in August 2016, freshly graduated in Industrial Engineering from the Pontificia
Universidad Javeriana, to take on my first job as a Process Engineer. I stayed in the organization
until June 2017: eleven months that, seen from today, contain the statement of almost everything I
have done since.

Inglopres was dedicated to renting, buying and selling heavy machinery for companies and
individual customers, with a fleet of about 120 units between machines and vehicles. It was an
asset-intensive operation, in which commercial decisions depended on the availability of the
equipment, its condition, maintenance, location, scheduling and capacity to respond in a timely
way to each customer's needs. Every sale or rental depended on which machine was available, in
what condition, at which site and with what maintenance pending. The business question was not
commercial before it was operational: it was the same question.

My assignment consisted of understanding that operation end to end and contributing to
integrating it. I had to identify how the areas connected, how information circulated, where
waits or rework appeared and what controls the organization needed to operate more efficiently
and offer a more consistent service. In practice that meant four things: mapping how the areas
connected, following where information circulated, locating where waits and rework appeared, and
proposing the controls that were missing.

## The ERP: integrating what was loose

<!-- seccion: el-erp -->

I led the implementation of an enterprise resource planning system, an ERP —Odoo, in a new
implementation—, to integrate the organization's processes and strengthen coordination between
its areas. With it, Inglopres went from scattered records to a single place. The purpose was not
only to replace scattered records with a platform, but to build a shared view of the operation
and improve the quality of the information used to manage it. The declared objective was to
increase operational efficiency and consistency of service; the real objective, harder, was for
the areas to share the same version of the operation. With the ERP running, the operation
improved on the order of 20% in efficiency —an estimate made today, because I do not keep the
measurement from back then—: less rework between areas and less time between the customer's
order and the machine on site.

This experience taught me early on that software does not integrate an organization by itself.
True integration happens when the areas agree on what each piece of data means, who is
responsible for producing it, what rules determine its transformation and how it should be used
along the process. A large part of the most important work took place before the first screen,
when turning activities, decisions and exceptions into definitions the system could represent. An
ERP does not integrate an organization: it integrates what the organization has already agreed
on, and exposes what it has not.

Implementing the ERP also allowed me to understand that digitizing a process without reviewing it
can carry its inconsistencies over to the technology. That is why, before configuring the
solution, it was necessary to make visible how the organization really worked, differentiate the
defined process from the executed process and establish a common base for integrating people,
assets, information and responsibilities. I captured the executed process by asking and
observing, not by reading manuals, and I modeled it in BPMN with Bizagi, with its activities, its
decisions and its exceptions; with FlexSim I simulated the operation to compare alternatives
before changing it. That drawing was what the ERP was able to represent; without it, the tool
would have copied the disorder with a different interface.

## The databases that did not exist: SQLite and SQL

<!-- seccion: las-bases-de-datos -->

To evaluate the processes I needed reliable indicators, but an important part of the required
information did not exist, was not captured consistently or remained scattered across different
records that nobody cross-referenced. I had been asked to improve the operation and I discovered
that I could not do it rigorously without first building the information needed to measure it.

The ERP had its own database; the one that was missing was the one for analysis. I designed and
implemented in SQLite the database structures to organize the operational events, cross-reference
them, improve the precision of the analyses and make it possible to track the relevant metrics: I
defined the entities, their relationships and the rules that preserved the meaning of each field,
and I queried them in SQL to produce the analyses. This was the point at which my career began to
turn toward data, not as a deliberate change of profession, but as a natural consequence of the
problem I needed to solve.

That is where I understood that a reliable indicator does not begin in a report. It begins in the
definition of the process, in the correct capture of its events, in the relationships between its
entities and in the rules that preserve the meaning of the information. This lesson later became
the foundation of my work with data pipelines, semantic models, Power BI and enterprise analytical
platforms.

I also learned that data architecture must begin with the decision one wants to enable. The case
that explains it best is the availability of a machine. To really know it, it was not enough to
include it in an inventory: it was necessary to represent its operational status, its location,
its scheduling, its utilization and its maintenance condition, and if one of the five is missing,
the indicator lies exactly when the salesperson needs it. The quality of the analysis depended
directly on how faithfully the data described the operation, not on the tool that displayed it.

## The work study: times and fatigue allowances

<!-- seccion: el-estudio-del-trabajo -->

The analysis of the operation led me to consider the human conditions under which the work was
executed. Measuring the operation forced me to also measure the human work that executed it: I
did a formal time study of Inglopres's repetitive activities —timing, rating of the pace and
calculation of the standard time—. When studying times, loads and the distribution of
activities, I incorporated the consideration of allowances associated with fatigue to prevent an
observed time from automatically becoming a standard that was hard to sustain.

The part a stopwatch does not solve is precisely those fatigue allowances, the allowances of work
study. An observed time is not a standard: one has to add the allowance —taken from the ILO
table— that recognizes the effort, the repetitiveness, the conditions of execution and the
variability inherent in a person. Without that allowance, the standard is met one week and missed
the rest of the year, and the blame falls on whoever executes instead of on whoever measured. I
understood that measuring productivity requires considering the effort, the repetitiveness, the
conditions of execution and the variability inherent in human work.

This lesson was important because it taught me not to interpret indicators outside their context.
An apparent improvement in speed can produce more errors, increase rework or shift an excessive
load onto another part of the system. From there came a criterion I still use: an improvement in
speed is not, by itself, an improvement. Optimizing does not consist of maximizing a metric in
isolation, but of finding a sustainable balance between capacity, quality, cost, service and
working conditions, and that requires looking at all five at once.

It is the same problem that years later I turned into one of the seven investigations I publish:
the one on fatigue allowances and line balancing, which reviews the methods by which those
allowances are derived and proves, on a balancing model, that calibrating them changes the result.

## Supply chain: costs, response time and availability

<!-- seccion: cadena-de-suministro -->

I also led supply chain optimization initiatives aimed at reducing operating costs, strengthening
the coordination of resources and ensuring compliance with the requirements associated with the
ISO 9001:2015 standard. This responsibility broadened my view from the performance of individual
activities toward the way suppliers, resources, information and controls jointly determined the
quality of the service.

In a heavy-machinery operation like Inglopres's, the supply chain comes down to three variables.
The response time, from when a customer orders until the equipment is on site. The service level
the company manages to sustain against its commitments. And the availability of the fleet, which
depends on maintenance as much as on scheduling: a machine in the workshop and a badly scheduled
machine produce the same non-compliance, even though they have different causes and different
people responsible.

Improving any of the three required the same information I had had to build for the indicators:
the real status of each unit, its location and its scheduling. It was the first time I saw the
complete chain —suppliers, maintenance, scheduling, delivery— as a single system measured with
the same data, and that view is the one I applied years later to a medicines distribution center
at Cafam.

## ISO 9001:2015, the first school of traceability and documentary rigor

<!-- seccion: cadena-e-iso -->

The ISO 9001:2015 standard was my first formal school of traceability and documentary rigor. It
was not enough for a process to work. It was necessary to define how it should work, who answered
for each activity, what controls were applied and what evidence made it possible to demonstrate
compliance. I learned that quality should not depend on people's memory, but on a way of working
that can be understood, verified and repeated. From there came the habit I have not let go of:
what is done leaves a written trace.

This experience also consolidated my affinity for standards as instruments for turning principles
into verifiable and sustainable management systems. Having developed early on a way of working
based on processes, responsibilities, controls, evidence and continuous improvement has made it
easier for me today to incorporate the principles and requirements of ISO/IEC 42001 into the
leadership of the artificial intelligence strategy, carrying that same rigor over to the
governance, risk assessment and responsible management of AI solutions. The two standards share
the high-level structure of ISO management systems, so what I learned in 2016 with one served in
2025 for the other.

That discipline remains present in everything I build. Today I apply it in the traceability of
pipelines and semantic models, in the documentation of applications and in the evaluation of
artificial intelligence solutions and agents. A piece of data must preserve its provenance, a
transformation must be reproducible and an answer generated through AI must clearly distinguish
between what comes from a source, what was calculated, what was inferred and what cannot be
supported with evidence.

## The team of twelve and the 95% customer satisfaction

<!-- seccion: el-equipo-de-doce -->

In this first experience I also led a team of twelve people, operators and technicians. Work
management, clear assignment of responsibilities and follow-up of commitments contributed to
reaching a customer satisfaction rate of 95%, measured in a survey of Inglopres's customers.

The result did not come from increasing control, but from defining the work better, making
priorities visible and turning follow-up into a coordination mechanism. Four things had to be
clear for each person: what result was expected, who answered for it, what information they had
and what it meant for something to be finished. When those four are clear, supervision stops
being the mechanism and coordination becomes it.

With operators and technicians, moreover, clarity had a concrete form: the time standard we had
built with the work study was the same one with which the task was assigned and followed up. A
standard that recognized fatigue was a standard the team could meet and defend, and that did
more for coordination than any follow-up meeting.

## How I learned to lead: reduce ambiguity, do not police activity

<!-- seccion: como-aprendi-a-liderar -->

It was my first opportunity to understand that leading does not consist of constantly supervising
activity, but of reducing the ambiguity that prevents good execution. When people understand what
result is expected, what their responsibility is, what information they have available and what
it means for a task to be truly finished, they can work with greater autonomy and respond more
consistently.

This experience laid the foundation of my current leadership style: clarity of purpose, explicit
responsibilities, observable progress, autonomy proportional to capability and shared
responsibility for the result. It is the same style with which I later directed the testing team
of 20 people at Cafam and the team of five at Banco Pichincha; the size and the trade changed, not
the principle.

I also understood that an operation does not improve sustainably when knowledge remains
concentrated in a single person. Processes, criteria and controls must be clear enough for the
team to execute them, question them and improve them. This principle continues to guide the way I
lead data and artificial intelligence initiatives today: my goal is not to become the mandatory
point of every decision, but to build teams and capabilities that can move forward with judgment
even when I am not present. At Inglopres that was tested with twelve people; today it is tested
with a documented process that someone else can execute without me.

## What this first job left behind

<!-- seccion: lo-que-dejo -->

Seen in retrospect, Inglopres brought together, in eleven months, the foundations of everything I
would build later. There I learned to understand an operation as a system, translate processes
into information structures, integrate areas through technology, measure with attention to
context, manage with evidence and lead from clarity. I was not yet talking about semantic models,
analytical platforms or artificial intelligence architectures, but I was already working on the
problems those capabilities would later let me tackle with greater depth and scale.

The inventory of that year is concrete: an ERP implemented from scratch, an analysis database in
SQLite that did not exist, the process modeled in BPMN and simulated before changing it, a time
study with fatigue allowances, a supply chain measured with its three variables, quality under ISO
9001:2015 and a team of twelve with 95% customer satisfaction.

The problem I was solving in 2016 —that the decision needed a piece of data nobody had built— is
exactly the same one I solve today, with other tools and another scale.
