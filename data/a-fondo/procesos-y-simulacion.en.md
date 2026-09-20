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
  a CONFIRMAR marker in square brackets, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

## The process root that does not show in a technology list

<!-- seccion: la-raiz -->

I am an Industrial Engineer from the Pontificia Universidad Javeriana, with an emphasis in Data
Analytics Intelligence, and I also pursued Industrial Design studies at the same university,
between 2009 and 2016. Before specializing in data platforms, Power BI, intelligent applications
and AI agents, I learned to understand processes, model systems, analyze constraints, distribute
resources and design solutions around the people who have to use them.

This root explains an important part of my professional differential. When I face a data
problem, I do not start with the table, the visualization or the model. I start by understanding
the system that produces the information: who takes part, what activity they perform, what inputs
they need, what result they generate, what dependencies exist and where waits, errors, handoffs
or losses of information appear.

Industrial Engineering taught me that an organization's result does not depend solely on the
performance of its components, but on the quality of the relationships that exist between them.
An area can reach its objectives and, at the same time, damage the complete flow. An activity can
look efficient in isolation and become the system's constraint when its interaction with the
others is observed.

Industrial Design complemented that view by placing people inside the system. A solution can
technically optimize a process and fail because it increases cognitive load, interrupts the work,
uses a language nobody recognizes or demands a behavior incompatible with the real context. That
is why I do not consider a solution finished merely because it works. It must also be possible to
understand it, incorporate it and use it with confidence.

My first job, at Inglopres from August 2016, was as a process engineer in a machinery rental
operation with a fleet of some 120 machines and vehicles combined, and there that root became a
trade: modeling the operation, implementing an ERP, designing the databases that did not exist
and ensuring quality under ISO 9001:2015. Everything that came afterwards —data, Power BI,
agents— was built on that way of looking.

## From the process to analytics and to agents: the same way of thinking

<!-- seccion: de-los-procesos-a-la-ia -->

Analytics expanded these capabilities. It allowed me to turn processes into events, relationships
and indicators; to represent their behavior through models; to anticipate certain results; and to
build experiences in Power BI capable of bringing that understanding closer to those who have to
decide. The step was gradual and has dates: at Ceinfes, from November 2017, the KPIs for
logistics, digitization and human-resource scheduling; at C&M Consorcio 2018, the supervision
dashboards for some 150 routes from 10 TransMilenio concessionaire companies; at Cafam, the BI
that controlled the implementation of a WMS; at Banco Pichincha, dashboards adopted by more than
50 users; at Vesting, an entire data platform on Microsoft Fabric.

Artificial intelligence represents an additional expansion. An agent can join as a new
participant inside the process, consult knowledge, use tools and execute certain activities.
However, its value still depends on questions that belong to engineering: what function it
fulfills, what information it needs, what constraints it must respect, how it will be evaluated
and what responsibility must remain with a person. At Vesting, those questions were the core
process with which 27 agents were designed and implemented; in my showcase, they are the technical
sheet of each of my 13 agents, with its process drawn in BPMN.

The tools have evolved, but the way of thinking remains. I understand the system, identify the
decision, build the representation, select the appropriate intervention and design the controls
needed to sustain the result.

## Modeling the process before touching the data

<!-- seccion: modelar-antes -->

Before building an analytical or intelligent solution, I try to represent the process that gives
rise to it. I need to understand who performs each activity, what information they receive, what
they transform, what result they produce, how long they wait, what exceptions they face and who
depends on their work afterwards.

This representation makes it possible to distinguish between the formal process and the process
actually executed. Procedures usually describe an orderly sequence, but the operation incorporates
informal decisions, manual corrections, handoffs, auxiliary files and exceptions that do not
always appear in the official documentation. At Cafam, in 2020, that difference was the entire
job: the warehouse process the WMS expected and the one the warehouse executed were not the same,
and the tests existed to find every point where they diverged.

Making those differences visible avoids automating an incomplete version of reality. A technology
can execute poorly defined logic at great speed and turn a local ambiguity into a systematic
problem. Before digitizing or automating, I need to identify which part of the process must be
preserved, which must be transformed and which decisions still need to be agreed.

Modeling also determines what data should exist. Each activity generates or consumes information,
changes the state of an entity and produces events that can be used to understand how the system
works. If those events are not captured, later analysis will depend on approximations, manual
reconstructions or perceptions that are hard to verify. At Inglopres I discovered that I could not
improve certain processes because the operation did not generate the information needed to
evaluate them, and the solution began by designing the way to capture it: database structures in
SQLite for the analyses, while Odoo used its own.

## The process and the data model are designed together

<!-- seccion: proceso-y-modelo-de-datos -->

That is why the process and the data model are not designed independently. Entities represent
relevant components of the system. Events record what happened. Relationships make it possible to
reconstruct the flow. Indicators summarize behaviors that need to be observed. The quality of the
analytics depends on how faithfully this structure represents the operation. At Cafam, the BI that
controlled the WMS implementation was built exactly this way: first the events each test had to
leave recorded, then the tables, and at the end the 15 people who read it.

This discipline extends to applications and artificial intelligence agents. A general diagram can
show the sequence of activities, but it does not necessarily contain enough precision to build a
solution. Each activity needs to specify inputs, rules, sources, tools, outputs, exceptions and
conditions for human intervention. Modeling before building reduces the distance between what the
business expects and what the technology finally implements, and makes it possible to define more
rigorous criteria for done, because the solution can be evaluated against a previously understood
function and not only against a convincing demonstration.

## Bizagi in practice: modeling the process in BPMN

<!-- seccion: bizagi-en-la-practica -->

I have used Bizagi and FlexSim at different moments of my career, and not always together:
**Bizagi** at Inglopres, Ceinfes, Cafam and Banco Pichincha; **FlexSim** at Inglopres and Cafam.
The two tools answer different but complementary needs. Bizagi lets me represent the structure,
responsibilities and rules of a process. FlexSim lets me study how that process may behave when it
incorporates time, capacity, resources, variability, accumulations and constraints.

With Bizagi I model processes in **BPMN**, the standard notation: I make explicit the activities,
decisions, responsible parties, events, inputs, results and handoffs that connect different areas,
with their lanes per actor and their decision gateways. Its value is not limited to producing
diagrams. It gives me a common language to contrast how an operation should work with the way it
is actually executed, and to turn knowledge distributed among people, systems and procedures into
a representation that can be discussed and improved.

A well-made BPMN model answers four questions that a list of steps does not: who is responsible
for each activity (the lane), which decision forks the flow and under what rule (the gateway),
which external event triggers or interrupts it (the event), and what information travels from one
activity to the next (the data object). When those four questions are answered, the diagram serves
three purposes at once: agreeing with the business, specifying for technology and deciding which
events must be captured in order to measure. That is the reason BPMN comes before the data model,
and the data model before any dashboard: at Cafam, every dispatch activity had to leave a record
in the WMS, and if it did not, the control BI could not see it.

Today the same notation continues in my work with one difference: in my showcase I no longer draw
the BPMN by hand. Each of the 32 pieces declares its process as data and an engine of my own
generates the diagram; I tell that story in the subsection on the process as a living definition.

## Bizagi at Inglopres, Ceinfes, Cafam and Banco Pichincha: four modeled processes

<!-- seccion: bizagi-en-cuatro-empresas -->

At **Inglopres**, between August 2016 and June 2017, this perspective proved relevant to
understanding an operation that connected commercial management, machinery availability,
maintenance, logistics and administrative information, over a fleet of some 120 machines and
vehicles combined. The ERP implementation —a fresh implementation of Odoo— required translating
those relationships into activities, states, rules and responsibilities that the system could
represent consistently. The process model worked as a bridge between the operational reality and
its technological implementation.

At **Ceinfes**, between November 2017 and November 2018, modeling made it possible to represent
the dependencies between the scheduling of teachers and consultants, the preparation and
distribution of materials, the administration of assessments in more than 100 schools per year,
the reception of the answers and their subsequent digitization, at a rate of some 250 answer
sheets per session. Each front had different responsibilities —some 7 people in scheduling, some
12 in digitization and some 20 in logistics—, but the result depended on all of them advancing in
a coordinated way and within precise time windows.

At **Cafam**, between October 2020 and June 2021, Bizagi made it possible to understand and
contrast the logistics operation of the medicines distribution center with the expected behavior
of Oracle WMS Cloud, the warehouse management system being implemented. The tests, the
parameterization and the adjustments required recognizing how each transaction had to advance
—receiving, storage, picking, dispatch—, what information had to be preserved, which areas took
part and which exceptions could alter the flow. With 20 people testing, the diagram was the
agreement on what was being tested.

At **Banco Pichincha**, between March and July 2023, process modeling helped me place the
analytical products within the activities and decisions they had to support. A dashboard gains
more value when it can be related to a responsibility, a frequency of use, a moment of decision
and a possible action, instead of remaining as a layer separate from the operation; it was part of
how the dashboards reached more than 50 business users.

## FlexSim in practice: simulating before intervening

<!-- seccion: flexsim-en-la-practica -->

FlexSim allowed me to move from representing the process to analyzing its dynamic behavior. A
diagram can show the sequence of an operation, but it does not demonstrate what will happen when
demand varies, times have dispersion, resources compete with each other or an activity produces
work at a speed higher than the capacity of the next one. **Discrete-event simulation** makes
those interactions visible before carrying a modification into reality.

Through FlexSim I could represent entities that travel through a process, resources with limited
capacities, variable operation times, queues, movements, priorities and assignment rules. This
made it possible to observe how apparently reasonable decisions in one activity could produce
waits, accumulations, underutilization or overload in another part of the system.

I used it in two jobs. At **Inglopres**, in 2016, to compare alternatives for the machinery
rental operation before changing it: how the machines moved between availability, maintenance
and dispatch, and where an assignment rule produced idle equipment. At **Cafam**, in 2021, I
built the largest model I have ever made: the **dispatch of medicines** at the distribution
center, with the logic of the new WMS —how receiving, put-away, picking and dispatch interacted,
with which resources, with which times and with which queues—. The model showed where a
reasonable rule in one activity produced waits or congestion in another, and the queue was not
where the average said it was going to be.

In logistics and warehouse management, simulation made it possible to reason about movements,
resource availability, sequences, service times and capacity constraints. A modification could
reduce the time of one activity and, at the same time, increase congestion in another part of the
process. FlexSim provided a way to observe these consequences before turning an improvement
hypothesis into an operational intervention. In service operations and analytics, the tool
equally strengthened my capacity to think in scenarios: even if the system was not represented as
a physical line, there were still requests, resources, processing times, handoffs, priorities and
accumulations. That understanding allowed me to carry the principles of simulation from material
operations to flows of information and decisions.

## Verification, validation and scenarios: what simulation does not do on its own

<!-- seccion: verificacion-y-validacion -->

FlexSim also taught me that simulation does not automatically predict what will happen. Its
results depend on the quality of the data, the validity of the selected distributions, the rules
incorporated and how faithfully the model represents the process. A visually sophisticated model
can produce weak conclusions if its assumptions have not been documented or contrasted with
reality.

That is why, before interpreting the results, I need to verify that the model reasonably
reproduces the reference behavior and to differentiate between verification and validation.
**Verification** checks that the model executes the logic it was built with. **Validation**
examines whether that logic represents the real system sufficiently for the purpose of the
analysis. In the Cafam dispatch model, validation was against the operation that the 20 people on
the testing team knew first-hand: if the model queued where the warehouse did not queue, the
error was in the model.

I also use simulation to compare scenarios, not to produce a single answer presented as
certainty. I can modify demand, capacity, assignment, times, priorities or certain rules and
observe how indicators such as utilization, cycle time, work in process, queue length,
_throughput_ and service level change. The value lies in understanding which decisions are
sensitive and under what conditions they stop producing the expected result.

Bizagi and FlexSim therefore represent two levels of the same discipline. Bizagi answers how the
process is structured, who takes part, what decisions it contains and what information it
exchanges. FlexSim answers how that process might behave when its times, resources and
constraints interact under variable conditions. This difference remains central in my current
work. In a data architecture, I first need to understand the flow and then observe volumes,
latencies, errors and constraints. In Power BI, I need to represent both the result and the
mechanisms that produce it. In an application or an agentic ecosystem, I need to specify the
responsibilities of its components and later evaluate how they respond when the context, the
load or the execution conditions change.

## Nominal capacity, effective capacity and variability

<!-- seccion: capacidad-y-variabilidad -->

FlexSim's contribution was especially important for understanding the difference between
**nominal capacity** and **effective capacity**. Nominal capacity describes how much could be
processed under ideal conditions. Effective capacity incorporates variability, pauses,
availability, errors, rework, movements and real constraints. Designing an operation with
averages alone can produce a capacity that looks sufficient on paper but fails when it faces the
real distribution of demand. In Cafam's dispatch of medicines I saw it in the model before seeing
it in the warehouse: with average times the system added up, and with the real distributions the
queue appeared in an activity nobody considered critical.

In digitization processes, this logic made it possible to understand how reception, preparation,
reading through scanners, validation, correction and manual capture interacted. At Ceinfes I did
not open FlexSim, but I reasoned about the digitization with the same logic: some 250 answer
sheets per session passing through 2 scanning stations, plus the preparation, sorting, validation
and reordering stations, and close to 10% of sheets that required manual capture. The goal was
not to get each station working at its maximum independently, but to balance the complete flow
so that the speed of one stage did not push accumulations and rework onto the next; the 10% of
manual capture was, in practice, the bottleneck that set the pace for everything else.

Although my work currently concentrates on analytical platforms and artificial intelligence,
FlexSim is neither a superseded tool nor a body of knowledge disconnected from my profile. It
represents the origin of a way of analyzing systems that I still apply: formulating scenarios,
modeling variability, identifying constraints, avoiding local optimizations and examining
behavior before intervening. Bizagi taught me to make the logic of the process visible. FlexSim
taught me to question whether that logic would keep working against the variability of reality.
Together, both tools consolidated a capability that continues to differentiate my work: I do not
only represent how a system should work; I build mechanisms to understand how it may behave
before turning a decision into an intervention. That is why, since 2026, both appear in the
skills of this CV under a group of their own, "Processes and simulation".

## The process as a living definition: the BPMN of my showcase generates itself

<!-- seccion: proceso-como-definicion -->

I do not believe a process should remain only as a static image drawn at a given moment. When
possible, I try to represent it through a structured definition from which its diagrams, controls
and related artifacts can be generated.

A manually drawn diagram can lose currency from the moment an activity, a rule or a dependency
changes. When the representation is generated from a controlled definition, modifications can
preserve traceability and propagate more consistently.

In the sheets of my showcase, the diagrams are generated by an engine that interprets the process
definition and produces the corresponding representation in standard BPMN notation. Each of the
32 pieces —6 applications, 13 agents, 7 research lines and 6 dashboards— declares its process as
data: lanes per actor, steps of type start, task, decision or end, and the transitions between
them. The engine is pure code, with no side effects, with more than 80% test coverage, and the
same technical-sheet contract used by the other houses that produce pieces. This decision avoids
manually maintaining figures disconnected from the logic they describe.

The structured definition also makes it possible to apply validations. It can be checked that the
necessary elements exist, that references are valid and that certain rules are met before
publishing: in my case, a Zod schema validates every sheet at build time, and a malformed sheet
makes the publication fail before it goes out. The diagram stops being merely an illustration and
becomes the visible manifestation of an asset that can be inspected and controlled.

## Formal definition and process mining: two levels that get compared

<!-- seccion: definicion-y-mineria-de-procesos -->

This does not mean that every process can be reconstructed automatically from data. In some
cases, the organization has event logs complete enough to observe the executed flow. In others,
the process must be documented through interviews, workshops, observation and systems analysis.
The method depends on the available evidence. When event data exists, it is possible to complement
the formal definition with observation of real behavior —process mining—: the records can reveal
variants, rework, returns, omitted activities and paths that do not appear in the official
documentation. It is a method I would apply with a real event log, not a case I have run in a
company; the closest I have had was at Vesting, where each of the 27 agents left its trail of
events and the core process defined what had to happen.

The ideal architecture connects both levels. The definition establishes the expected behavior,
its responsibilities and its rules. The data shows the observed execution. The comparison between
them makes it possible to identify deviations, understand exceptions and decide whether the
operation must be corrected or the formal model updated. Intelligent solutions also need a
definition of expected behavior and evidence about what they actually do; governing them requires
preserving both perspectives and making the difference visible.

## Simulation as a way of understanding variability

<!-- seccion: la-simulacion -->

FlexSim gave me the practical experience; simulation left a way of thinking that remains present
even when I work with other technologies.

Simulating means recognizing that a system cannot be fully understood through a single average
value. The real operation contains variability, dependencies, accumulations, infrequent events
and extreme conditions that can determine performance more strongly than the usual behavior.

That is why, when I analyze a process, I do not only ask how long it takes on average. I also
need to know how its times are distributed, what happens during peaks, which resources limit
capacity, how a delay propagates and how sensitive the result is to changes in its assumptions.
In the post-operational analysis of TransMilenio, at C&M Consultores, demand was not modeled as a
monthly total but per time band, with monthly updates, precisely because the daily average hid
the peaks that decided the operation.

Simulation also taught me to separate a local improvement from a systemic one. Speeding up an
activity can increase the pending inventory in the next one. Raising a resource's utilization can
reduce its capacity to respond to variations. Removing a wait can move the congestion without
improving the total process time.

## Variability in an indicator, in a predictive model and in an agent

<!-- seccion: variabilidad-en-datos-y-agentes -->

This way of thinking remains present in my current work. When I analyze an indicator, I do not
limit myself to its average value. I also seek to understand its distribution, variability,
segments and extreme situations. When I evaluate a predictive model, I do not only look at the
global metric. I analyze where the error concentrates and what consequences the cases outside the
usual behavior produce: the TransMilenio demand model was validated with RMSE respecting the
temporal order, and it ran for 10 months because it kept being compared against what was really
happening.

I also apply it to artificial intelligence agents. Correct behavior in most executions is not
enough if certain ambiguous inputs, incomplete contexts or unavailable tools produce results that
are hard to detect. Exception conditions need to be designed, tested and observed; at Vesting,
the real-time monitoring of up to 23 agents at once existed to see exactly those queues of
exceptions. Simulation taught me that an architecture must be evaluated against variability and
not only against the ideal path. This principle connects processes, data, software and artificial
intelligence: systems must be designed for the reality that changes, not for an average that
rarely occurs exactly.

## From the process model to the analytical twin

<!-- seccion: gemelo-analitico -->

Process modeling can advance from static representation toward a richer analytical capability.
When the process definition is connected to events, times, volumes, resources and results, it
begins to work as a dynamic representation of the system.

I do not use the concept of a twin lightly. A representation does not become a twin merely
because it visually reproduces a flow. It needs to preserve a sufficiently consistent relationship
with the observed system and allow its state, behavior or response to be analyzed against certain
scenarios.

In a first layer, the data makes it possible to observe what happened: which activities were
executed, how long they took, what volume they processed and where exceptions appeared. In a
second layer, the model makes it possible to explain relationships, constraints and mechanisms.
In a third, simulation makes it possible to explore what might happen if demand, capacity, rules
or the distribution of resources change. This progression connects descriptive, predictive and
prescriptive analytics. Description allows the system to be observed. Prediction anticipates
future conditions. Prescription compares alternatives and helps decide which intervention could
produce a better result under certain constraints.

The closest I have been to that complete progression was at Vesting, between August 2023 and
January 2025: the platform on Microsoft Fabric recorded every agent event —1,000 events per day
in 120 tables—, the semantic model explained state, cost and result per client, and the
real-time monitoring made it possible to see up to 23 agents at once. The third layer was
missing, the simulation of scenarios on that base, and it is the direction I keep working in.

Power BI can work as the experience through which people access that representation, explore its
behavior and understand its main constraints. The semantic model organizes the entities, events,
times and measures. Simulation and prediction expand the capacity to analyze future scenarios.
Applications and agents can add an additional layer of interaction: an agent can consult the
state, retrieve rules, explain a deviation or prepare a recommendation. However, the intelligent
capability is only reliable when it rests on a verifiable representation of the process and not
on a free interpretation by the model. This convergence represents one of the most important
directions of my profile: turning processes into observable systems, used by both people and
intelligent capabilities to understand, decide and act with greater precision.

## Time study with ILO allowances and line balancing

<!-- seccion: estudio-de-tiempos-y-balanceo -->

Two classic methods of the discipline that I have applied by name, not as theory.

The **time study** I did at Inglopres, in 2016, as a formal work study: timing the operations,
rating the pace of the person executing them, calculating the standard time and applying
**fatigue allowances** taken from the table of the ILO, the International Labour Organization.
The lesson that remained is simple and still holds: an observed time is not a standard until it
recognizes the effort of the person who executes it; a stopwatch measures what happened, not what
is sustainable eight hours a day. And a question also remained that I did not close then: which
allowance corresponds to each combination of effort, repetitiveness, environment and altitude,
instead of a general percentage from a table.

**Line balancing** I applied at Ceinfes, in 2018, on the digitization of the assessments: some
250 answer sheets per session treated as a line with stations —2 for scanning, plus preparation,
sorting, validation and reordering—, a bottleneck and an effective capacity, in the vocabulary of
the theory of constraints. Close to 10% of the sheets required manual capture, and that station
set the real pace of the entire line: there was no point speeding up the scanning if manual
capture could not keep up. Balancing was not buying more scanners; it was moving people toward
the constraint and measuring, every session, the progress and the backlog of digitization.

The two methods solve the same thing at different scales: that the pace is set by the real
capacity of the system and not by the aspiration of the schedule. It is the same idea I apply
today to a data pipeline —the real time of a load, not the nominal one— and to an agent run —how
long it really takes, with its retries and its exceptions—.

## Lean, Kanban and Scrum: agile seen from processes

<!-- seccion: lean-kanban-y-scrum -->

**Lean** and agile methods I put into practice at Ceinfes, between November 2017 and November
2018, with the technology area, when I led the transition of the operation to a process-based
management model supported by information systems. I did not adopt them as a software fad: I read
them as what they are, industrial engineering tools for controlling the flow of work.

**Kanban** is, in its origin, a pull system: work enters when there is capacity to attend to it,
and the limit on work in progress is the way to prevent the queue from growing without control.
We used it for the flow of requests to the technology area, where each card was a request visible
to everyone, with its status and its owner. **Scrum**, with sprints, we used for the technology
projects: one goal per sprint, a review at the close and the next priority agreed on the evidence
of the previous sprint, not on the accumulated wish list. The two coexisted without conflict
because they served different things: the continuous flow of small requests and the projects with
a scope.

What Kanban and Scrum have of industrial is what serves me most: they make work in progress
visible, limit multitasking, set the pace by real capacity and force a definition of done before
starting. It is the same principle of line balancing carried over to knowledge work, and it is the
same discipline with which I build my applications today in sprints: each cycle has a build
order, a summary at the close and a retrospective, and no application in my showcase moves
forward without its priority and its vision written down.

## ISO 9001 and documentation: the discipline of the written trail

<!-- seccion: iso-9001 -->

At Inglopres, between August 2016 and June 2017, I worked on quality assurance and compliance
with the requirements associated with **ISO 9001:2015** within the supply chain. That experience
was my first formal school of traceability, responsibilities, controls and evidence.

Under a quality management system it is not enough to state that the process works. It is
necessary to establish what result is expected, how it is controlled, who is accountable, what
evidence is kept and what happens when a deviation appears. At Inglopres that translated into
supply-chain procedures with their records, indicators with their definitions and a team of 12
operators and technicians whose work left a trail; the 95% customer satisfaction, measured by
survey, came out of that system and not out of goodwill.

This discipline transformed the way I document. The written trail is not a later requirement
intended only for an audit. It is a way of preserving knowledge, demonstrating how the process
works and allowing another person to understand it, reproduce it and improve it.

Today I apply that same logic to data architecture. A transformation must preserve its purpose. A
measure needs a definition. A semantic model must be reviewable. A change needs a reason and a
way to evaluate its effect. I also apply it to my applications and agents: architecture decisions
are documented in decision records, controls must demonstrate that they can recognize a failure
before they are trusted, and a model's persistent outputs need to pass schema validations before
joining the flow. In artificial intelligence, the written trail extends to the sources, the
instructions, the tools, the executions and the results: a statement must be relatable to the
evidence that supports it, and when the evidence does not exist, the system must declare the gap
instead of hiding it behind a plausible answer.

## From ISO 9001 to ISO/IEC 42001: the same management-system structure

<!-- seccion: de-iso-9001-a-iso-42001 -->

ISO 9001 and ISO/IEC 42001 are not the same standard, nor do they represent a simple evolution of
numbering. They address different objects of management: quality in one, artificial intelligence
systems in the other. The connection lies in the discipline of management systems: understanding
the context, establishing responsibilities, managing risks, keeping documented information,
evaluating performance and improving continuously. My experience with quality allowed me to
recognize that structure when, in 2025, I took on artificial intelligence governance
responsibilities at Fundación CTIC. The domain changed, but a fundamental conviction remained: a
critical capability must not depend solely on good intentions. It needs processes, accountable
people, controls and evidence.

## Why this root makes me better with data

<!-- seccion: por-que-me-hace-mejor -->

My training in processes strengthens my work with data because it lets me decide what must be
measured before examining the catalog of available fields.

An indicator does not arise merely because a column can be aggregated or because a visualization
can represent it. It must correspond to a question, a stage of the process, a decision or a
condition that can be changed. Measuring what exists is easy. Identifying what really explains
the behavior requires understanding the system. At Ceinfes, the KPIs did not come out of the
information system: they came out of the process —schedule compliance, digitization progress and
backlog, on-time deliveries, percentage of manual capture, rework— and only then was the way to
capture each one sought.

It also lets me recognize data that should exist and is not yet produced. At Inglopres I
discovered that I could not improve certain processes because the operation did not generate the
information needed to evaluate them. The solution began by designing the way to capture it.

Understanding the process equally strengthens semantic modeling. Tables and relationships should
not merely reproduce the structure of the sources. They must represent entities, events and
business rules in such a way that indicators keep their meaning and can be reused across
different products. In the TransMilenio ETL, the five sources —fare collection, fleet and GPS,
scheduling, incidents and PQR (complaints and claims)— were not unified by the shape of their
files but by the process entities they described: the service, the vehicle, the route, the time
band.

## Adoption, local optimizations, prediction and agents: what the process decides

<!-- seccion: lo-que-el-proceso-decide -->

This root also explains why I pay so much attention to adoption. A dashboard fails when it does
not fit the decision, the moment or the way of working of the person who should use it.
Understanding the process makes it possible to design the analytical experience around the real
routine and not only around the available information; it is the reason the Banco Pichincha
dashboards reached more than 50 users in 2023 and those of C&M Consultores more than 25 key users
of the TransMilenio operation.

Industrial training also lets me identify local optimizations. An area can improve its indicator
by shifting work, risk or waiting to another part of the system. Analyzing the complete process
avoids rewarding behaviors that deteriorate the global result. In predictive analytics, knowledge
of the process makes it possible to build meaningful variables, define useful horizons and avoid
using information that will not be available when the prediction has to be produced. In
artificial intelligence, it makes it possible to delimit the agent's function: before selecting a
model or designing a prompt, I need to understand which activity it will assist, what information
it will use, which exceptions it will face and what consequences it will produce if it gets it
wrong. Data lets me observe the operation. Industrial Engineering lets me understand what I am
observing and why it matters.

## Why this root makes me better at designing solutions

<!-- seccion: por-que-me-hace-mejor-disenando -->

Industrial Design adds a capability that turns out to be essential in data and artificial
intelligence: understanding that a solution exists within an experience and not only within a
technical architecture.

An indicator can be correctly calculated and hard to interpret. An application can meet its
requirements and generate an unnecessarily complex interaction. An agent can offer a correct
answer and communicate its sources, limits or need for intervention poorly.

Designing means connecting the function with the way a person can understand and use it. This
involves observing tasks, context, expectations, language and human constraints, not just
defining components and functionalities.

In Power BI, this perspective translates into visual hierarchy, navigation, reduced cognitive load
and correspondence between the screen and the decision. The model may contain a great deal of
information, but the experience must present only what the person needs in order to move
forward. At Fundación CTIC, the 42 analytical products serve two very different audiences
—administrative and clinical leaders— and the same figure is presented with the depth each one
needs.

In applications, it translates into understandable journeys, visible states and mechanisms that
help the user recognize what happened and what they can do next. An interface must not hide
critical information or require the person to understand the entire architecture to complete a
task. The 6 applications in my showcase pass automated accessibility tests on every change, and
this very CV respects the visitor's reduced-motion preference: it is not courtesy, it is design.

In agents, it translates into calibrated trust. The solution must communicate what it can do,
which sources it uses, what limits it has, when it needs additional information and when it hands
over responsibility. The experience must not present a probabilistic capability as if it were an
absolute authority.

Industrial Design also strengthens the way I experiment. A prototype makes a hypothesis visible,
puts it in front of other people and allows learning before investing in a complete solution.
This discipline avoids confusing an internally coherent idea with an experience that really works
for the user. Industrial Engineering helps me build the right system. Industrial Design forces me
to build it in a way that can be understood and used. Data and artificial intelligence expand
what that system can observe and do.

## Building processes, not just deliverables

<!-- seccion: construir-procesos -->

One of the most important lessons of my career is that an individual solution can generate value,
but a replicable process builds organizational capability.

At Vesting, between August 2023 and January 2025, I did not limit myself to taking part in the
creation of agents. I defined, documented and validated the central process —the core process,
with eleven stages— that served as the framework for building the 27 agents in the startup's
inventory. The goal was for each implementation to take advantage of the knowledge produced by
the previous ones: how to understand the problem, specify the behavior, build, validate, deploy
and observe.

Standardization did not mean that all the agents were the same. It meant that they shared a
common way of understanding the problem, specifying the behavior, building, validating, deploying
and observing the solution. This structure made it possible to separate what had to be kept from
what needed to be adapted. The principles, controls and acceptance criteria could remain. The
sources, tools, rules and behaviors could change case by case. I closed that stage by leaving the
ecosystem and the process documented, and the process kept serving without me: that is the proof
that it was a process and not a person.

The same approach is present in my own pipeline. Applications need a priority and a vision before
moving forward. Each cycle leaves a summary. Persistent outputs must pass validations. Controls
need to demonstrate that they can fail. Artificial intelligence is incorporated only when there is
a functional justification. The 32 pieces of the showcase were built with those rules, and the
detail of each rule lives in the pipeline document.

This capability connects directly with Industrial Engineering. The value lies not only in
producing the next unit, but in improving the system that will allow all the following ones to be
produced with higher quality, less uncertainty and better use of resources. It also connects with
AI-300, the certification path in operating models and agents that I have been pursuing since
July 2026: operating artificial intelligence sustainably requires processes to version, evaluate,
deploy, observe and improve models, applications and agents. The technical architecture needs to
be accompanied by an operational architecture.

I do not seek to have an organization depend indefinitely on my direct intervention. I seek to
leave standards, memory, components, criteria and mechanisms that allow other people to keep
building on a reliable base.

## The questions that remained open: assigning, balancing, controlling

<!-- seccion: preguntas-pendientes -->

Some of the questions I now develop with greater rigor arose during my first professional
experiences. At the time I could recognize the problems and analyze part of their consequences,
but I did not always have the data, the time or the tools needed to formulate a complete answer.

In the transport operation, at C&M Consorcio 2018, between November 2018 and May 2020, the
problem appeared of assigning drivers, vehicles and routes under constraints of availability,
demand, typology and failures, over some 150 routes from 10 concessionaire companies. Practice
showed that considering these elements through separate lists could produce combinations that
were operationally valid but systemically deficient: the failure was neither the driver's nor the
bus's, but the pair's.

The formation of bus convoys, the _bunching_, also appeared. Detecting in the data that several
vehicles were running with intervals that were too short made the phenomenon visible, but it did
not settle the most important question: which operational policy could intervene without moving
the problem to another part of the system.

In production and digitization processes, the question about fatigue allowances remained open,
from the Inglopres time study in 2016. A general percentage from a table can simplify the
definition of the standard and, at the same time, ignore differences between effort,
repetitiveness, environment, altitude, acclimatization and real execution conditions.

These questions share a root. They do not seek only to describe what happened, but to understand
which combination of resources, rules or controls can produce a better result under variability
and constraints. I detected them with data in those jobs and turned them into research questions
afterwards.

## From the open questions to the showcase research

<!-- seccion: de-las-preguntas-a-las-investigaciones -->

Today I address those questions through systematic review, modeling, optimization, simulation and
controlled scenario generation, and three of the 7 research lines published in my showcase are
exactly those: driver–bus assignment with failures, where the breakdown is modeled as a property
of the driver–vehicle pair and not of each one separately; bus convoys, where the object of study
is the control policy and its adoption in operation, not just detection; and fatigue allowances
and line balancing, where the question is how to calibrate the table to each workstation and what
the fatigue curve does to the optimal balance. All three were born from a problem seen with real
data in a job —transport in 2018 and 2019, the plant in 2016— and are worked on today with
synthetic data and literature, with their gaps and their findings declared on each sheet; the
detail is in the research document.

Technology lets me formulate more complete questions, but the problem remains deeply industrial:
assigning, balancing, controlling and improving real systems.

I also apply an important discipline when communicating this work. I distinguish between a
research line, a model validated with synthetic data, a conclusion supported by literature and an
intervention demonstrated in operation. Each level allows different claims and must not be
presented as if it offered the same evidence. That is why the research sheets label every figure
as measured, calculated, declared or estimated, and none of the three is presented as an
intervention already demonstrated in a transport system or in a plant.

These questions are not unfinished business I am trying to hide. They represent problems
important enough to have persisted and complex enough to require tools that my career allowed me
to develop later. The same root remains active after more than a decade: understanding how
systems work, representing their behavior and building evidence to intervene in them with
greater precision.

## What processes and simulation represent in my profile

<!-- seccion: lo-que-representan -->

Processes and simulation are not an old stage of my career nor a category separate from my
current work. They are the intellectual structure on which I build data and artificial
intelligence solutions.

Process modeling lets me understand and specify the structure of the system. Analytics lets me
observe its execution through evidence. Statistics and prediction make it possible to anticipate
relevant behaviors. Simulation, whose discipline I developed through FlexSim, lets me subject
decisions to variable scenarios before intervening in the real operation. Optimization makes it
possible to compare alternatives and select configurations under explicit constraints.

Industrial Engineering keeps these capabilities connected around flow, constraint, variability,
resource use and the global result. Industrial Design keeps visible the person who must use the
solution, interpret the information or intervene when the technology reaches its limits.

DP-600, earned in December 2024, validates the analytical architecture through which data is
prepared, modeled and turned into enterprise assets. AI-103 extends that capability toward
applications and agents. AI-300 strengthens the way those solutions are deployed, evaluated,
observed and improved throughout their life cycle; both paths have been in progress since July
2026. And in the skills of this CV, alongside Fabric, Power BI and the agents, there has been
since 2026 a group called "Processes and simulation": BPMN with Bizagi, discrete-event simulation
with FlexSim, time study and line balancing, Kanban and Scrum. It is not nostalgia: it is the part
of the profile that explains how I use everything else.

My differential does not consist only in knowing process, data or artificial intelligence tools.
It consists in being able to connect them within a single method: understand, represent, measure,
experiment, decide and transform. That is why, when I approach a new problem, I do not first ask
which technology I should use. I ask how the system works, which behavior needs to change and
what evidence would demonstrate that the intervention produced a real improvement. Technology
provides possibilities. Processes and simulation provide the judgment to use them with purpose.
