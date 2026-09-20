---
slug: como-trabajo
titulo: "How I work"
resumen: "How I work, with the evidence behind each trait: process first (BPMN), adoption as the indicator (50+ users), leading teams of up to 20 people, the board of directors and the SITP working tables, and which instrument goes with each decision."
estado: aprobado
ancla: "#perfil"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "How does Henry work?"
  - "How does Henry lead a team and how does he communicate with business areas?"
  - "How does Henry lead a team without adding control?"
---

<!--
⚠ PRIVACY — READ THIS BEFORE WRITING ⚠
This repository is public and the chat quotes this content to any visitor.
DO NOT write: confidential data of employers or clients, salaries, names of
third parties who have not agreed to appear, addresses, phone numbers, emails
or sensitive personal information. The build's customs check catches the
mechanical stuff (emails, phone numbers, ID documents, web addresses); PROPER
NAMES are not caught by a regex — those you decide yourself.

HOW THIS FILE IS WRITTEN
- Normal prose, in the first person, in paragraphs.
- Every subsection starts with a `##` title followed by a
  `<!-- seccion: id -->` comment. Those are the ONLY 2 marks.

- `estado: borrador` → the chat does NOT index it and no English twin is required.
  `estado: aprobado` → the chat indexes it and requires the complete `.en.md`
  twin, subsection by subsection.
- No figure, date or achievement without a source. Whatever is missing goes as
  a CONFIRMAR marker in square brackets (what is missing), never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
  -->

<!-- guide (comes from the story skeleton, S3 — written by the owner):
How you think and work: your approach to solving problems, how you lead
teams, what you value in a project, how you communicate with stakeholders.
What a hiring manager would ask in the first interview. -->

## Facing a new problem: first the process, then the tool

<!-- seccion: primero-el-proceso -->

I am an industrial engineer before I am a data engineer, and that way of looking at things is
still my greatest advantage: problems that look like technology problems are almost always
process problems. A dashboard does not fix a lack of operational clarity; a model does not make up
for a poorly defined flow; an agent does not turn an ambiguous activity into a capability.

That is why, before building, I draw. I model the process in **BPMN**, with Bizagi, with its
activities, decisions, exceptions and owners, and I separate the process as defined from the
process as executed. I did it at Inglopres before implementing the ERP, at Cafam before testing
the WMS and at Pichincha before touching the bank's data. When the organization produces event
logs, the formal model is contrasted with the real flow: that is process mining, and it is the
method I would apply, not a case I have run.

On this site the principle is automated: the BPMN diagram of each piece is generated from its
definition, so that it does not age when the process changes. The full method, with FlexSim and
simulation, is in the processes document.

## Adoption is the indicator, not the deliverable

<!-- seccion: la-adopcion-es-el-indicador -->

Building is rarely the hard part. The hard part is getting the solution used to decide. That is
why I design from the decision outward: who will use the information, what question it answers,
at what level of detail and how often; and I measure adoption, not delivery.

I measured it three times:

- **Banco Pichincha:** dashboards adopted by **more than 50 business users**, with +25% in the
  associated decision-making.
- **TransMilenio:** Power BI adopted by **more than 25 key users** of the operation.
- **Cafam:** the project-control BI, used by **more than 15 directors and managers**.

Adoption is a human problem as much as a technical one: at Pichincha the training program for 12
professionals was part of the product, not an appendix. How adoption is measured without
confusing it with visits is in the BI document.

## How I lead a team, and how I work with people who do not report to me

<!-- seccion: como-lidero -->

I lead by removing ambiguity, not by adding control. When every person knows what problem we are
solving, what result is expected, what "done" means and what information they have available,
the team moves forward without me in front. I have the figures that say so:

| Where     | Team                                                                          | Result                                      |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------- |
| Cafam     | **20 people**, 14 of our own and 6 from the vendor, six months of WMS testing | −25% errors, +15% operational efficiency    |
| Inglopres | **12 people**, operators and technicians                                      | 95% customer satisfaction                   |
| Ceinfes   | three fronts, some 40 direct staff and 50 teachers                            | more than 100 schools a year served on time |
| Pichincha | **5 people** in my charge                                                     | 50+ users, −35% in analysis times           |

At Cafam we did not lower the errors with more supervision but by writing down, before starting,
what counted as a tested case and who signed it off. After Cafam I moved on to leading complete
processes that bring together many people who do not report to me: at Vesting, the platform and
the process with which 27 agents were built; at CTIC, the institution's AI strategy.

I distinguish delegating tasks from distributing the capacity to decide. I do not believe in
follow-up by constant meetings: I prefer mechanisms where progress, blockers and priorities are
visible to everyone, like the Kanban and Scrum I brought to Ceinfes. And I do not judge my
leadership by the decisions that pass through me, but by the clarity with which the team moves
forward when I am not there.

## How I communicate with business areas

<!-- seccion: como-hablo-con-el-negocio -->

Nobody decides on a table. I learned it two ways: in the **board of directors of Ceinfes**, to
which I presented reports **every Friday** for a year and from which came incentive programs and
redesigns of processes, positions and software; and in the **working tables with the SITP
management**, where the conversation moved when I brought a defensible sentence with its
provenance behind it, and the system's indicators rose 25%.

With senior management I do not start with the tool or with the model: I start with the decision
that has to be made and the impact it has. I arrive with two levels: one slide with the
consequence and a number, and behind it the traceable base in case they ask for it. I separate
facts, interpretations, hypotheses and recommendations, because each one calls for a different
degree of confidence.

Every figure has an identity and a provenance. If I cannot explain where it comes from, how it
was transformed and when it was updated, I do not present it. At Vesting I worked directly with
the founders; at CTIC I have a direct line to the Planning Directorate and to the sub-directorates
of technology, information management and quality; at Cafam, with the directors of medicines, IT,
the project and the distribution center. I work in professional English (B2) when the team
requires it.

After an executive conversation what should remain is not a convincing presentation. What should
remain is an explicit decision, an owner, a deadline and an indicator to know whether it worked.

## What I value in a project

<!-- seccion: que-valoro -->

Three conditions, and I have a case for each one:

| Criterion                                       | What I require                                                            | Where I saw it                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **A real problem with measurable impact**       | knowing what must change, who suffers it and how much solving it is worth | TransMilenio: the operation generated data faster than it was analyzed; the ETL raised speed 70% |
| **A business owner willing to adopt it**        | sponsorship is not enough; someone who makes it part of the operation     | Pichincha: the 50+ users existed because the business defined the questions                      |
| **A capability that outlives whoever built it** | processes, criteria and components that others can operate and improve    | Vesting: the documented core process with which the startup kept building agents without me      |

I also value a project leaving reusable assets —patterns, components, tests, documentation— and
learning after it is implemented: needs change, models degrade, users discover new uses.
Reproducible documentation and handover are part of the result, not of the closing. The 32 pieces
of the showcase follow that rule.

## One instrument for each decision

<!-- seccion: el-instrumento-para-cada-decision -->

Not every problem needs a dashboard, or a model, or an agent. I order the instruments by the
level of agency the organization cedes to them: **a report documents; a dashboard lets you
explore; an alert directs attention; a predictive model anticipates; a recommendation proposes;
an application organizes execution; an agent acts within limits.**

The closer the instrument is to intervening in the operation, the more it demands: data quality,
clarity of rules, traceability, controls and supervision. I choose the step by the value and the
risk of being wrong, not by novelty. At Pichincha the right step was the model with the person
deciding; at Vesting, agents that acted within explicit limits; at CTIC, first the analytics and
only afterwards the AI that the evidence justifies.
