---
slug: inglopres
titulo: "Inglopres — Process Engineer (2016–2017)"
resumen: "My first job: an ERP (Odoo), the databases that did not exist, the work study and a team of twelve people with 95% satisfaction."
estado: aprobado
ancla: "#trayectoria"
actualizado: 2026-09-19
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
  a `CONFIRMAR: what is missing` marker in square brackets, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
  -->

<!-- guide (comes from the skeleton of the story, S3 — written by the owner):
The detail that does not fit in the timeline: what the operation was like, what
you did day to day with the ERP and the supply chain, anecdotes from the team
of 12 people, what you learned. -->

## The operation and the assignment

<!-- seccion: la-operacion -->

I joined **Inglopres in August 2016**, freshly graduated in Industrial Engineering from the
Pontificia Universidad Javeriana. It was my first job, as a Process Engineer, and I stayed until
June 2017.

Inglopres rented, bought and sold heavy machinery for companies and individual clients, with a
fleet of about **120 units between machines and vehicles**. It was an asset-intensive operation:
every sale or rental depended on which machine was available, in what condition, at which site
and with what maintenance pending. The business question was not commercial before it was
operational. It was the same question.

My assignment was to understand that operation end to end and integrate it. In practice that
meant four things: mapping how the areas connected, following where the information circulated,
locating where waits and rework appeared, and proposing the controls that were missing.

## The ERP: integrating what was scattered

<!-- seccion: el-erp -->

I led the implementation of an **ERP —Odoo—**, the enterprise resource planning system with which
Inglopres went from scattered records to a single place. The declared objective was to increase
operational efficiency and consistency of service; the real, harder objective was for the areas
to share one same version of the operation. With the ERP running, the operation improved by
around 20% in efficiency: less rework between areas and less time between the client's order and
the machine on site.

Before configuring a single module, two things the organization took as identical had to be
separated: **the defined process and the executed process**. I surveyed the second by asking and
observing, not by reading manuals, and modeled it in **BPMN with Bizagi**, with its activities,
its decisions and its exceptions; with **FlexSim** I simulated the operation to compare
alternatives before changing it. That drawing was what the ERP was able to represent; without it,
the tool would have copied the disorder with another interface.

The work that weighed most happened before the first screen: agreeing what each piece of data
meant, who was responsible for producing it, which rules transformed it and at what point in the
process it could be used. I learned there that an ERP does not integrate an organization. It
integrates what the organization has already agreed on, and exposes what it has not.

## The databases that did not exist

<!-- seccion: las-bases-de-datos -->

To evaluate the processes I needed indicators, and I discovered that half of the information did
not exist: it was not captured, or it lived spread across records that nobody cross-referenced. I
had been asked to improve the operation and I could not measure it.

The ERP had its own database; what was missing was the one for analysis. I designed and
implemented in **SQLite** the structures to organize the operational events, cross-reference them
and track the business metrics. I defined the entities, their relationships and the rules that
preserved the meaning of each field, and queried them in **SQL** to produce the analyses. That was
the point where my career turned toward data, and it was not a career decision: it was what the
problem demanded.

The case that explains it best is the **availability of a machine**. It is not enough for it to
be in the inventory. Its operational status, its location, its schedule, its utilization and its
maintenance condition have to be represented; if one of the five is missing, the indicator lies
exactly when the salesperson needs it. The quality of the analysis depended on how faithfully the
data described the operation, not on the tool that displayed it.

I learned that a reliable indicator does not begin in the report. It begins in the definition of
the process and in the capture of its events.

## The work study: times and fatigue allowances

<!-- seccion: el-estudio-del-trabajo -->

Measuring the operation forced me to also measure the human work that executed it. I did a
**time study** on Inglopres's repetitive activities: stopwatch timing, pace rating and
calculation of the standard time.

The part a stopwatch does not solve is the **fatigue allowances** —the _allowances_ of work
study—. An observed time is not a standard: you have to add the allowance —taken from the **ILO**
table— that acknowledges the effort, the repetitiveness, the execution conditions and the
variability inherent to a person. Without that allowance, the standard is met one week and missed
the rest of the year, and the blame falls on whoever executes instead of on whoever measured.

Out of that came a criterion I still use: **an improvement in speed is not an improvement**. It
can produce more errors, increase rework or shift the load to another part of the system.
Optimizing is finding the sustainable balance between capacity, quality, cost, service and
working conditions, and that requires looking at all five at once.

It is the same problem that years later I turned into a research line of my own on fatigue
allowances and line balancing.

## Supply chain and ISO 9001

<!-- seccion: cadena-e-iso -->

I led **supply chain** optimization initiatives to reduce operating costs and coordinate
resources better. In a heavy machinery operation that plays out in three variables: the
**response time** from when a client orders until the equipment is on site, the **service level**
the company manages to sustain, and the **availability** of the fleet, which depends on
maintenance as much as on scheduling.

That work also had to meet the requirements of **ISO 9001:2015**, and it was my first formal
school of documentary rigor. It was not enough for a process to work: it had to be defined how it
should work, who was responsible for each activity, which controls were applied and what evidence
demonstrated compliance.

Out of that came the habit I have not let go of: **what is done leaves a written trail**. Quality
cannot depend on someone remembering how it was done. It has to be possible to understand it,
verify it and repeat it without that person present.

## The team of twelve and the 95%

<!-- seccion: el-equipo-de-doce -->

I led a team of **twelve people**, operators and technicians. With explicit assignment of
responsibilities and follow-up of commitments, the operation reached a **customer satisfaction
rate of 95%**, measured in a survey of the clients.

The result did not come from more control. It came from defining the work better: what result is
expected, who is responsible, what information is available and what it means for something to be
finished. When those four are clear, supervision stops being the mechanism and coordination
becomes it.

It was my first lesson that leading is **reducing ambiguity**, not watching activity. And the
second, that an operation does not improve sustainably if the knowledge lives in a single head:
the processes, the criteria and the controls have to be clear enough for the team to execute
them, discuss them and improve them.

## What this first job left

<!-- seccion: lo-que-dejo -->

Inglopres brought together, in eleven months, the foundations of everything I built afterwards:
understanding an operation as a system, translating processes into information structures,
integrating areas with technology, measuring without decontextualizing and leading from clarity.

I was not yet talking about semantic models or analytical platforms. But the problem I was
solving in 2016 —that the decision needed a piece of data nobody had built— is exactly the same
one I solve today, with other tools and at another scale.
