---
slug: ceinfes
titulo: "Ceinfes — Operations Coordinator (2017–2018)"
resumen: "Coordinating three fronts for more than 100 schools: KPIs per area, the balancing of digitization, reports to the board of directors and the transition to process management with Kanban."
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
  a CONFIRMAR marker in square brackets stating what is missing, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

<!-- guide (comes from the skeleton of the story, S3 — written by the owner):
The transition to process management, how you set up the KPIs, what
reporting to the board of directors was like, what coordinating
multidisciplinary teams left you. -->

## The assignment: Operations Coordinator at Ceinfes (2017–2018)

<!-- seccion: el-encargo -->

I joined Ceinfes in November 2017 as Operations Coordinator and stayed in the organization until November 2018. This experience marked my transition from the direct improvement of processes to the coordination of an operation made up of multiple teams, resources, dependencies and control points that did not depend on me one by one. It was also the first stage of my career in which the results of my work began to reach the board of directors regularly.

Ceinfes developed educational assessment services for institutions —mock tests—, and the operation I led had to coordinate the resources needed to serve more than 100 schools a year. The challenge was to ensure that teachers, consultants, materials, assessment instruments, transport and information were available at each institution at the exact moment. An early delivery could create custody and coordination difficulties; a late delivery could compromise the test administration. Operational precision did not consist in arriving earlier, but in getting each element to be where it had to be when it was actually needed.

This experience broadened my understanding of operations. It was no longer enough to optimize a particular activity, as I had done at Inglopres the year before. I had to observe how a decision made at one point changed the loads, times and risks of the others. There I deepened a way of thinking that still guides my work: the performance of a system is not explained by the isolated efficiency of its components, but by the quality of the relationships that exist between them.

## The three fronts: scheduling, digitization and logistics

<!-- seccion: los-tres-frentes -->

Three closely related fronts converged under my coordination. The scheduling team organized the logistical assignment of teachers and consultants. The digitization team converted the answers recorded on physical sheets into usable data, through specialized scanners and, when the condition of the material required it, through manual capture. The logistics team managed the transport and delivery of booklets, exams, books and other materials required by the institutions.

In people, there were about 40 direct reports —some 7 in scheduling, some 12 in digitization and some 20 in logistics— and, through scheduling, about 50 test administrators who did not report to me but did depend on my calendar.

| Front | What it did | What happened if it failed |
| --- | --- | --- |
| Scheduling | assigned teachers and consultants to schools and dates | a test without an administrator, or an administrator in two places |
| Digitization | converted the physical answer sheets into data, with scanners | a student without a result, or with someone else's |
| Logistics | prepared and moved the material to each institution | a schedule pushed back for the whole cycle |

Although each team fulfilled a different function, the result depended on the complete flow. An incorrect schedule could affect the test administration. A delay in materials could alter the timeline. An error in identification or digitization could compromise the correspondence between the test, the student and the result. My responsibility was to get those areas to stop operating as independent units and to work as coordinated components of the same system: to stop being three areas and start being a single flow.

## The KPIs per area: how I set up the indicators

<!-- seccion: los-indicadores -->

To coordinate an operation of this nature I needed to turn its execution into observable information, to see the state of the operation without asking. I analyzed and managed strategic data and developed indicators —KPIs— for the scheduling, logistics and digitization processes. The purpose was not to measure for the sake of measuring, but to have signals that made it possible to know the state of the operation, anticipate deviations and decide where to intervene.

I began to conceive of the indicators as gauges installed along an operational pipeline. Each one had to observe a specific stage and contribute, at the same time, to explaining the behavior of the complete system. It was necessary to know the demand to be served, the resources scheduled, the materials prepared, the deliveries made, the assessments received, the volume pending digitization, the available capacity, the errors detected and the results finally processed. Each KPI had its number of the day:

- demand to be served: schools and students scheduled by date;
- confirmed resources: administrators assigned versus required;
- material prepared and delivered, per institution;
- tests received back;
- pending digitization and validated records.

The two that weighed most were schedule compliance —how many test administrations happened where and when they were planned— and digitization progress, because the date of delivery of results to the school depended on it. Behind them came on-time deliveries per institution, the percentage of manual capture and rework per batch.

This vision taught me that measuring the final result is not enough. When an indicator shows that a delivery was missed or that a processing job finished late, an important part of the value of the information has already been lost. To run the operation, intermediate indicators are also needed that make it possible to recognize accumulations, delays, capacity differences and risks before they affect the institutions. With more than 100 schools a year, those intermediate indicators were the ones that served to intervene.

## Shared definitions and traceability of every KPI

<!-- seccion: definiciones-compartidas -->

Coordinating different areas also required building shared definitions. Concepts such as material prepared, complete delivery, confirmed resource, processed record or validated result had to mean the same thing for everyone. When each team interprets a metric differently, the conversation concentrates on arguing about the figure and not on solving the problem; the meeting is spent on the number. This need to organize the meaning of information was an early foundation of my later work with semantic models, data governance and Power BI.

I also understood that each indicator had to preserve traceability back to the event that originated it. An aggregate figure could show the general state, but it had to be possible to trace it down to the institution, the material, the assignment, the batch or the stage responsible for the result. The usefulness of a metric did not depend only on its calculation, but on the ability to explain what it meant, where it came from and what action it could trigger. A schedule-compliance KPI that did not allow reaching the school and the date that were missed was no use for correcting anything.

This experience established a discipline that I keep in the analytical platforms I design today. An indicator is the visible layer of a broader system that comprises capture, validation, transformation, modeling, business rules and control mechanisms. Visualization eases access to the information, but trust is built along the entire pipeline. At Ceinfes, in 2018, that pipeline was made of spreadsheets and operational records; today it is a semantic model, and the rule is the same.

## Balancing the digitization process

<!-- seccion: balanceo-de-digitalizacion -->

The digitization process deserved particular attention because it transformed the physical answers of the mock tests into usable data. The sheets had to be received, organized, identified, processed through specialized scanners, reviewed, corrected when they presented reading difficulties and complemented manually when automatic capture was not enough.

Although the result was digital information, the operation behaved like a process line, and I treated it as what it was: a line balancing problem. The figures: about 250 sheets per session, two scanning stations and, around them, the preparation, organization, validation and reordering stations; close to 10% of the sheets needed manual capture. Each stage had a given capacity, a processing time, a workload and an impact on final quality. If one station moved faster than the next could absorb, work began to pile up. If capture was sped up by sacrificing quality, the errors appeared later as additional validations and rework, more expensive the later they appeared.

That is why the challenge did not consist in maximizing in isolation the productivity of each person or station, but in balancing the capacity of the complete process. It was necessary to observe how the load was distributed, where constraints formed, which activities remained underused and which ones concentrated the pending work. The station that constrained the flow —the bottleneck, in the vocabulary of the theory of constraints— was the one that set the real pace of the process, and it was the one that had to be protected and fed. It was also indispensable to consider the variability of the documents, because not all sheets required the same level of intervention nor could they be processed at identical speed.

## Theoretical versus effective capacity, and the human dimension

<!-- seccion: capacidad-teorica-y-efectiva -->

The balancing analysis at Ceinfes allowed me to differentiate between theoretical capacity and effective capacity. The first indicates how much a station could process under ideal conditions. The second incorporates exceptions, reading errors, validations, manual capture, pauses and rework. Making decisions based only on averages could produce an incomplete view of the system —a false picture— and shift constraints from one stage to another without improving the overall result. With 10% manual capture, the effective capacity of the line was not that of the two scanners: it was that of the validation station that received those sheets.

Balancing also had to consider the human dimension of the work. The repetitive review and capture activities could not be managed by assuming a constant and indefinite pace. The distribution of loads, fatigue and execution conditions influenced productivity and quality. Sustainable efficiency required designing realistic standards and preventing an apparent improvement in speed from ending up generating errors, exhaustion or more corrective work. Realistic standards —the same fatigue allowances I had applied at Inglopres— were part of the balancing, not a later adjustment.

This learning strengthened my capacity to model information processes as production systems. Years later, that same logic would be applicable to data pipelines, applications and artificial intelligence agents: each component has a function, a capacity, inputs, outputs and possible exceptions. Improving the system requires observing the complete flow, identifying constraints and preventing local optimization from harming the final result.

## Resource scheduling: from Google Calendar to a VBA macro

<!-- seccion: la-programacion-de-recursos -->

Assigning teachers and consultants to more than 100 schools a year, each with its date and its time band, is an assignment problem with time windows: each administrator has availability, competencies and a starting location, and each school has an exact window in which the test must take place. At first the scheduling was done by hand, on Google Calendar. I designed a VBA macro that optimized the assignment with those explicit constraints, instead of with a list of names.

Before the macro, scheduling depended on the memory and skill of whoever put the calendar together: they knew which administrator lived near which school and who had already administered a test at an institution, and that information was not written down anywhere. Writing it down as constraints —availability, competency, location, the school's window— was the part of the work that left the most value, because the knowledge went from one person to a rule that anyone on the front of 7 could execute and discuss.

With the macro, the schedule-compliance KPI —how many test administrations happened where and when they were planned— went on to measure a process with explicit rules instead of an individual skill. It was the first automation with which I saw an indicator change its nature, and a lesson I applied again at TransMilenio, in 2018, with Excel and VBA on the concessionaires' databases.

## The conversation with the board of directors

<!-- seccion: la-junta-directiva -->

At Ceinfes I presented strategic reports to the board of directors for the first time in my career. The reports were weekly, every Friday, and came out of the same KPIs of the operation. Concrete decisions came out of them: incentive programs, improvements in working conditions, redesign of workstations, redesign of processes and redesign of the software.

This experience taught me that communicating with senior management does not consist in transferring operational detail into a presentation, but in turning it into a clear understanding of the situation, its causes, its implications and the decisions that must be made. A board of directors does not need to go through every record to recognize a problem, but it does need to trust that the detail exists and can be consulted. That is why I learned to communicate on two levels: an executive synthesis that made the consequence visible and a traceable analytical base that allowed going deeper when necessary. The conversation could start with a sentence and an indicator, but it had to be backed by definitions, data and verifiable evidence.

I also understood that presenting results is not enough. The information must be organized around the decision it seeks to enable. Each report answered five things: what was happening, why it was relevant, which factors explained the result, what risk maintaining the situation implied and which alternatives could be considered. The goal was not to demonstrate how much analysis had been done, but to make an informed and defensible decision easier.

This experience laid the foundations of my later relationship with senior management. I learned to preserve technical rigor without unnecessarily passing on its complexity, to differentiate facts from interpretations and to present recommendations together with their assumptions and consequences. The capacity to hold an executive conversation about data does not come from building a good visualization, but from understanding the business, mastering the evidence and connecting each finding with a real possibility of action. A report from a Friday in 2018 that ended up in an incentive program is worth more, as a lesson, than any dashboard I have built since.

## The transition to process management with Kanban and Scrum

<!-- seccion: gestion-por-procesos -->

I led Ceinfes's transition toward a process-management model supported by information systems and directed strategic technology projects through agile ways of working. With the technology area we worked with Scrum, in sprints, for the projects, and with Kanban for the flow of requests: a board that gave visibility to requests, priorities, owners, dependencies and progress statuses, with a limit on work in progress so that what was started got finished before opening the next thing. I modeled the processes in BPMN with Bizagi, the same tool with which I had drawn the Inglopres operation.

The most important change was not technical, but organizational. The operation had to go from depending on the distributed knowledge of each area to having explicit processes, shared information and systems capable of sustaining its execution. This required documenting decisions that had previously remained implicit, agreeing on responsibilities and turning habitual exceptions into rules that could be understood, controlled and improved.

I learned that resistance does not usually originate only in technology. It appears when making the process visible forces the resolution of ambiguities that for years had been compensated through experience, informal communication or individual decisions. The transformation requires recognizing that knowledge, structuring it and turning it into an organizational capability without eliminating the professional judgment the operation needs.

Working with technology also taught me that a solution must be specified with greater precision than a general diagram offers. For a process to be sustained through information, it was necessary to define what each activity received, what function it fulfilled, what rules it applied, what result it had to produce and how its exceptions were handled. This discipline reduced the distance between what the business expected and what the system finally implemented, and it was the basis of continuous improvement: without an explicit process there is nothing to measure improvement against.

This experience became a direct precedent of my current work with applications and artificial intelligence agents. An intelligent solution cannot be built from an ambiguous description of the process either. It needs objectives, inputs, authorized sources, rules, outputs, evaluation criteria and clear conditions to determine when it can act and when it must hand the decision over to a person.

## The multidisciplinary teams

<!-- seccion: equipos-multidisciplinarios -->

I coordinated teams with different but closely dependent functions: scheduling of teachers and consultants, digitization of answers and logistics of materials for more than 100 institutions a year. My responsibility was to connect their capabilities, distribute the work, anticipate constraints and make sure each team understood how its result affected the others.

This experience strengthened my way of leading through clarity and visibility. Assignment could not be limited to indicating who had to do a task. It had to consider demand, available capacity, priority, the required competencies, dependencies and the exact moment at which the result would be needed. Coordinating meant protecting the complete flow, not keeping every person busy in isolation.

I also understood that follow-up is more effective when it makes the system visible and not when it is used to watch people. By sharing priorities, loads, progress and blockers —the Kanban board fulfilled precisely that function—, the teams could coordinate better and recognize how a local difficulty affected the overall result. My role consisted in providing context, removing ambiguities and enabling timely interventions.

With close to 40 people in three different trades, clarity could not be a conversation: it had to be an artifact. The board, the KPIs of the day and the Friday report were the three artifacts through which the operation saw itself, and they were the same for the logistics team, for the digitization team and for the board of directors.

## Security and access to information: my first data governance

<!-- seccion: seguridad-y-acceso -->

The collaboration with the technology area also incorporated an essential dimension: security and access to information were part of the design of the solution. Working with educational results required understanding who needed to consult each piece of data, for what purpose and under what conditions. Access should not be added as a later permission, but defined from the architecture of the process and of the information. Working with assessment results forced me to define who consulted what and for what purpose before building the report; the permission was not a later formality, it was part of the process design.

This idea later evolved toward my work in data governance and, further on, toward the design of artificial intelligence architectures. In an analytical platform or in an AI agent, identity, permissions, authorized sources and the traceability of actions are structural components. Trust does not appear at the end of development; it must be built in from the beginning.

It was my first contact with what I would later call data governance: at Ceinfes, in 2018, with the results of students from more than 100 schools; at Banco Pichincha, in 2023, with the bank's critical information; and today, at Fundación CTIC, with health data, where that rule stopped being a good practice and became a legal obligation.

## What Ceinfes left behind

<!-- seccion: lo-que-dejo -->

Seen in retrospect, Ceinfes was the experience in which I learned to run an operation as a system of interdependent flows. There I coordinated people, resources, materials and information; I built indicators —KPIs— to observe the pipeline; I went deeper into the balancing of the digitization process; I turned operational results into executive conversations with the board of directors every Friday; and I strengthened management through explicit processes, information systems, Scrum and Kanban.

I was not yet building enterprise data platforms or artificial intelligence architectures, but I was already developing several of their foundations: observable processes, traceable data, shared definitions, coordinated capabilities, controlled access and evidence-based decisions. And an automation with a name: the VBA macro that replaced scheduling by hand.

Inglopres taught me to structure an operation; Ceinfes taught me to run it through information.
