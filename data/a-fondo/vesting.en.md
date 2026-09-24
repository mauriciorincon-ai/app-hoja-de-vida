---
slug: vesting
codigo: AF-09
titulo: "Vesting — the data platform for AI agents (2023–2025)"
resumen: "Microsoft Fabric from scratch for an agent startup: 12 clients, 27 agents in inventory and 23 monitored at once in real time, 1,000 events per day, 20 GB and 120 tables, per-client governance and an 11-stage core process to design and implement agents."
cuando_usar: "Use this when they ask about Vesting (2023–2025): an AI agents startup, the data architecture designed from scratch on Microsoft Fabric (lakehouse, OneLake, Direct Lake), monitoring agents in production, the replicable core process for agents, per-client governance and why he left."
estado: aprobado
ancla: "/proyectos/vesting"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "How did Henry design Vesting's data ecosystem?"
  - "What is the replicable core process for agents?"
  - "How does he monitor an AI agent in production?"
---

<!--
⚠ PRIVACY — READ THIS BEFORE WRITING ⚠
This repository is public and the chat quotes this content to any visitor.
DO NOT write: confidential data of employers or clients, salaries, names of
third parties who have not agreed to appear, addresses, phone numbers, emails
or sensitive personal information. The build's customs check catches the
mechanical part (emails, phone numbers, ID documents, web addresses); PROPER
NAMES are not caught by a regex — those are up to you.

HOW THIS FILE IS WRITTEN
- Normal prose, in the first person, in paragraphs.
- Every subsection starts with a `##` title followed by a
  `<!-- seccion: id -->` comment. Those are the ONLY 2 marks.
- `estado: borrador` → the chat does NOT index it and no English twin is required.
  `estado: aprobado` → the chat indexes it and requires the complete `.en.md` twin,
  subsection by subsection.
- No figure, date or achievement without a source. Whatever is missing goes as
  a CONFIRMAR marker in square brackets stating what is missing, never as plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

<!-- guide (comes from the story skeleton, S3 — written by the owner):
Your star story: how a data ecosystem is designed from scratch on
Microsoft Fabric, architecture decisions and why, how an AI agent is
monitored in production, what the replicable core process is. -->

## An agent startup without a common platform for its data

<!-- seccion: el-contexto -->

I joined Vesting in August 2023 as Data Strategy Lead and stayed in the organization until January 2025: eighteen months. Vesting is a startup that develops automation agents for its clients, and it needed to strengthen the infrastructure required to understand their behavior, integrate the information produced by its solutions and turn that information into a useful capability for product, operations and decision-making. I worked in a direct line with the founders: in a startup of that size the data strategy is decided with whoever decides the company.

The challenge was of a different nature from those I had faced before. It was no longer only about analyzing a process executed by people or recorded by an enterprise application. The agents generated events while interacting with users, querying information, using services and producing results. To understand how they worked it was necessary to capture that activity, structure it and keep enough context to reconstruct what happened.

The information was distributed among different integrations and there was no common platform that allowed analyzing it consistently. Each new solution could introduce its own structures, events and needs, and each data integration of a client was handcrafted. Without a shared base, growth increased the dependence on individual developments, made comparison between agents difficult and reduced the ability to observe their behavior in production.

My responsibility consisted of designing Vesting's data ecosystem from scratch —the strategy and the platform— to integrate that information, establish common structures and build the analytical foundations needed to monitor the agents, with governance from day one and without slowing the startup down. The goal was not only to store events, but to turn them into evidence about availability, usage, response times, exceptions, costs and operational behavior.

## Speed versus sustainability: what had to be common and what configurable

<!-- seccion: velocidad-y-sostenibilidad -->

The main tension at Vesting was between speed and sustainability. A startup needs to experiment, onboard clients and adjust its solutions quickly, but each isolated integration increases technical debt and makes it harder to keep a common view. My approach was to build the minimum level of standardization needed to preserve agility without giving up traceability, quality and the possibility of reusing what had already been learned.

This required distinguishing between what had to be common and what had to remain configurable. The fundamental events, the identifiers, the states and the metrics needed shared definitions. The particularities of each client or agent had to be incorporated without forcing a redesign of the whole platform. That separation was essential to move from a collection of integrations to a data capability that could evolve with the 12 clients that ended up being integrated.

In practice the rule was simple to state and demanding to sustain: a new agent or a new client could not require a new table for what already had a name on the platform —a session, a request, a response, a state— and could bring its own attributes, always within a structure that already knew how to receive them. What was common was the condition for comparing; what was configurable, the condition for not slowing down.

## What I did at Vesting: the size of what was built

<!-- seccion: el-tamano-de-lo-construido -->

The figures of the data ecosystem at the close of the period, in January 2025:

| What                                   | How much                                            |
| -------------------------------------- | --------------------------------------------------- |
| Clients integrated into the platform   | 12                                                  |
| Agents in the inventory                | 27, designed and implemented with the core process  |
| Agents under monitoring at once        | 23, at the highest point                            |
| Events                                 | 1,000 per day                                       |
| Volume                                 | 20 GB                                               |
| Tables in the model                    | 120                                                 |
| Monitoring                             | in real time                                        |
| Stages of the core process             | 11                                                  |

The same things were captured from every agent, with the same structure: sessions, requests, responses, times, states and cost in tokens. The session was the unit of analysis: an isolated event signals a failure; the complete sequence explains how an interaction evolved, where it deviated and what it cost.

The 27 agents in Vesting's inventory are a different set from the agents of my own that I publish today in my portfolio: those were built for the startup's clients with its core process; these, later, with my own ecosystem. The two experiences, compared, are in the document on agents in production.

## How I designed the data architecture from scratch on Microsoft Fabric: Vesting's data ecosystem

<!-- seccion: la-arquitectura -->

I designed and implemented on Microsoft Fabric a data ecosystem aimed at integrating, transforming and analyzing the information generated by the agents: Big Data, Data Warehouse and distributed processing on a lakehouse. The platform had to connect storage, processing, modeling and analytical consumption capabilities, reducing fragmentation between components and making it easier to build a complete view of the operation.

The architecture had to answer two simultaneous needs. The first was historical: keeping the events needed to analyze trends, reconstruct sessions and compare the behavior of the agents over time. The second was operational: offering information timely enough to identify failures, variations or conditions that required attention while there was still the possibility of intervening.

I designed pipelines to receive and prepare information from different integrations, among them the n8n flows with which the agents were orchestrated. Each flow had to validate its structure, organize the events, keep the identifiers needed to maintain context and transform the data into entities that could be understood by the business and product teams. The purpose was to prevent the logic of each integration from being isolated or depending exclusively on whoever had built it.

This experience broadened my understanding of Microsoft Fabric as an enterprise platform. Its value was not only in gathering technologies, but in allowing ingestion, transformation, storage, modeling and analysis to be designed as parts of a single journey on OneLake. My job consisted of giving coherence to that journey and ensuring the data kept its meaning from the event generated by the agent to the indicator used to evaluate it. It was Fabric end to end, and it remains the most complete experience I have with the platform; the detail of how I work it from the inside is in the document on Fabric in practice.

## The early normalization of events

<!-- seccion: normalizacion-temprana -->

Early normalization was the key decision of the architecture. Although the agents could have different purposes and behaviors, they shared observable elements such as interactions, sessions, times, states, responses, errors and resource usage. Building a common representation of those events from ingestion made it possible to develop metrics comparable across the 27 agents and reduce the need to rebuild the analytical logic for each solution.

It was also necessary to keep the detail without degrading the query experience. Events offered the greatest explanatory power, but the teams needed aggregated metrics to observe trends and general conditions. The architecture had to allow moving from an executive view down to the event that supported the result, keeping a balance between performance, granularity and traceability: events to explain, aggregates to observe.

With 1,000 events per day and 120 tables, that decision was the difference between a platform that grows in an orderly way and a collection of integrations that has to be rewritten with every new client. The lakehouse kept the raw event; the following layers turned it into the entities —session, request, response, agent, client— on which everything else was calculated.

## Power BI as the consumption layer: combined storage modes

<!-- seccion: power-bi-capa-de-consumo -->

Power BI became the layer through which product and operations could use that information. The semantic models organized the technical events into understandable concepts and made it possible to analyze agents, clients, sessions, periods and results from a common base. Visualization was not the end of the architecture, but the point where technical complexity became a capability for observation and decision.

The models used a combination of storage modes —Direct Lake on the lakehouse, import and DirectQuery— chosen according to the use of each model: the freshness that operational monitoring needed, the historical volume that trend analysis demanded and the cost of maintaining each one. There was no single mode because there was no single type of question. How to decide among the three, with judgment, is in the document on Fabric in practice.

A semantic model on agent events has a particularity compared with one on sales or loan portfolio: the central entity is not a closed transaction but a session that evolves, and the measures —response time, cost in tokens, intervention rate— are calculated over sequences. That was the part of modeling I learned most at Vesting and that I had not needed at Banco Pichincha or TransMilenio.

## Governance from the design

<!-- seccion: la-gobernanza -->

Governance had to be incorporated from the beginning because Vesting's platform integrated information produced by solutions associated with 12 clients and different contexts. Waiting until the end to resolve ownership, permissions or traceability would have turned each integration into an exception that was hard to maintain and the whole platform into a risk.

My approach was pragmatic. Governance should not become a bureaucratic layer that prevented experimenting, but neither could it be left for a future stage. It was necessary to establish a minimum set of rules that made it possible to recognize what information came in, who it belonged to, what it meant, how it was transformed and who was authorized to use it.

The standardization of events served a governance function in addition to a technical one. Defining common structures made it possible to validate the information from ingestion, identify mandatory fields and make exceptions visible. When an integration did not meet the expected conditions —the event contract—, the deviation could be identified and handled instead of silently advancing into the analytical products.

Governance thus became a property of the architecture and not a later review. Each integration had to keep identity, provenance, context and responsibility from the moment the information came in. This principle would later make it possible to extend the scope of governance from the data used by the agents to the decisions, recommendations and actions produced by them.

## Isolation per client: separate workspaces

<!-- seccion: workspaces-separados -->

The separation of information by client and context had to be part of the design of the flows and models. It was not enough to store everything in the same ecosystem and resolve later who could query it. The architecture needed to preserve the identifiers and relationships required to control consumption, avoid mistaken interpretations and maintain responsibility over each set of information.

Isolation among the 12 clients was resolved with separate workspaces in Microsoft Fabric: each client with its own space, its permissions and its models, on top of the common event structures. The choice had a governance reason and an operational one. Governance, because the access boundary coincided with the client boundary and did not depend on a well-written filter; operational, because a change in one client's model could not affect another.

On that base, the common structures still allowed the comparison the startup needed for its own product: the same events and the same metrics in every workspace, so that Vesting could observe its complete portfolio of agents without any client seeing anything of another.

## Traceability and the nature of the information

<!-- seccion: trazabilidad-y-naturaleza-de-la-informacion -->

I also made sure the transformations were understandable and reproducible. A metric on an agent's performance had to keep a clear relationship with the events used to calculate it. This traceability was indispensable to investigate behaviors, explain results to a client and distinguish whether a deviation originated in the agent, in the integration, in the data or in the analytical logic.

I also understood that governing an agent platform requires recognizing that not all information has the same nature. A technical event, a datum supplied by a user, a generated response and an executed action require different treatments. Keeping that distinction allows a better interpretation of what happened and avoids presenting as verifiable fact what was produced through generation or inference.

That distinction, which at Vesting was born as a modeling rule, is today one of the foundations of how I understand AI governance: a model's answer is recorded, evaluated and cited as what it is, a generated output, never as a datum of the operation. The three governance experiences of my career —banking, this startup and the health sector— are compared in the document on data and AI governance.

## Monitoring artificial intelligence agents in production

<!-- seccion: monitoreo-de-agentes -->

One of the main goals of the data ecosystem was to establish the ability to monitor agents in production, and it came to watch 23 agents at once, in real time. Observability had to answer a deeper question than checking whether an application was available. We needed to understand what was happening during the interactions, how the agents behaved and under what conditions errors, delays or unexpected results appeared.

To do so, I structured the capture of events associated with sessions, requests, responses, processing times, states and exceptions. When the context allowed it, this information could be complemented with the version of the solution, the integration used and other elements needed to analyze differences in behavior: the same question answered differently by two versions of the same agent is a finding, not noise.

The session became an especially important unit of analysis. Observing isolated events made it possible to identify specific failures, but reconstructing a complete sequence made it easier to understand how an interaction had evolved, at what moment it had deviated and which components had taken part. This capability was essential to debug problems and explain behaviors that could not be interpreted from a single record.

## The four dimensions of monitoring

<!-- seccion: dimensiones-del-monitoreo -->

Vesting's monitoring had to integrate several dimensions, each serving a different decision:

| Dimension   | What was measured                                          | For which decision                                  |
| ----------- | ---------------------------------------------------------- | --------------------------------------------------- |
| Operational | availability, volume, errors, response times               | intervening before the client notices               |
| Usage       | distribution by agent, client, period and type of task     | where demand grows and where it does not            |
| Economic    | cost in tokens per session and per agent                   | which agent costs more than it solves               |
| Functional  | final states and sessions that needed intervention         | where the agent answers but does not solve          |

The functional dimension was the hardest. Technical metrics could demonstrate that the agent had answered, but not necessarily that the answer had been useful or that the action matched the expected purpose. This challenge allowed me to understand that evaluating an agent needs to connect telemetry, context, results and human feedback.

An available agent can answer incorrectly. A precise agent can be too slow for the process. A useful answer can have a disproportionate cost in tokens. An efficient automation can produce risks if it acts outside its limits. Observability had to allow analyzing these four dimensions jointly and prevent a single metric from becoming an incomplete representation of the solution.

## The operational dashboards and what changed in my idea of BI

<!-- seccion: tableros-operativos -->

The operational dashboards in Power BI made this information visible to those responsible for product and operations at Vesting. Their purpose was to make it easier to identify relevant conditions and allow an anomaly to be traced down to the associated events of the session. The platform did not remove the need for investigation, but it reduced the distance between detecting a problem and having evidence to understand it.

Monitoring also fed adoption: knowing whether people used an agent, trusted it and knew when to turn to it was part of the validation of each solution, and that is why adoption is a stage of the core process I describe further on and not a loose indicator.

This experience transformed my concept of business intelligence. The dashboard no longer described only business processes executed by people. It also made it possible to observe intelligent systems that actively took part in those processes. Power BI and Microsoft Fabric became components of a trust architecture for artificial intelligence, by providing traceability, monitoring and evidence about its behavior. How an agent is monitored, generalized beyond this platform, is in the document on agents in production.

## From processes to the agent's specification

<!-- seccion: especificacion-del-agente -->

Developing agents at Vesting made visible a difficulty that does not always appear in the first conversations with the business: understanding a process is not yet the same as having a sufficient specification to implement it. A diagram can show the general sequence of activities, but it usually does not contain everything a solution needs to behave consistently in the face of different inputs, conditions and exceptions.

To reduce that distance, I began analyzing each activity as a functional unit. It was necessary to establish what information it received, what purpose it served, what rules it had to apply, what sources it could consult, what tools it could use, what result it had to produce and under what conditions it had to stop or request human intervention. This decomposition made it possible to turn a general expectation into implementable and later evaluable behavior.

The specification also had to differentiate between knowledge, decision and action. Some activities required retrieving or synthesizing information. Others involved interpreting a situation and formulating a recommendation. Certain tasks could be executed through a tool, while others had to remain under human responsibility. This distinction made it possible to assign the level of autonomy according to purpose, risk and the possibility of verifying the result.

## Exceptions are specified too

<!-- seccion: las-excepciones-se-especifican -->

It was also necessary to describe the exceptions. A solution is not completely specified if only its behavior under ideal conditions is defined. The agent had to recognize when information was missing, when there were contradictory results, when a tool was not available and when the consequence of an action demanded additional validation. Knowing how to abstain or hand over control was as important as correctly completing a task.

This approach strengthened the traceability between the process, the data and the technological solution. Each expected behavior could be related to a business need, an information source, a rule, a tool and an acceptance criterion. Thus, evaluation stopped depending only on whether the answer seemed adequate and began to be contrasted with a previously agreed specification.

This discipline became the antechamber of Vesting's replicable core process. Before standardizing how to build agents, it was necessary to establish a consistent way of expressing what each one had to do, what limits it had to respect and what evidence would make it possible to determine whether it was fulfilling its purpose. It is the same logic with which, years earlier, I turned an inventory complaint into a reproducible test scenario: inputs, rules, expected output, exceptions.

## The replicable core process for agents: eleven stages to design and implement

<!-- seccion: el-proceso-core -->

In addition to building the data ecosystem, I structured, documented and validated the central process —the core process— used to design and implement artificial intelligence agents at Vesting, with which the 27 agents in the inventory were built. The goal was to prevent each initiative from starting from scratch and depending exclusively on the informal knowledge of the people who had taken part in previous implementations.

I understood that the real asset was not a particular agent, but the ability to build the next one with greater clarity, consistency and control. To achieve it, it was necessary to define a common journey from understanding the problem to operating the solution, including acceptance criteria and responsibilities at each stage. There are eleven:

1. Use case: what problem is solved and what action it enables.
2. Users and decision: who uses it and what they decide with it.
3. Functional specification: each activity with inputs, rules, outputs and verifiable criteria.
4. Authorized sources and tools: what it can consult and what it can use.
5. Level of autonomy: consult, recommend or execute, and under what conditions.
6. Exceptions: what it does when information is missing, there is a contradiction or the case is ambiguous.
7. Technical validation: integrations, sources, structure of the outputs.
8. Business validation: the result corresponds to what the operation needs.
9. Definition of done: agreed before, not demonstrated after.
10. Adoption and interaction: what it can do, what information it uses, when it asks for human validation.
11. Observable operation: the agent stays measured and usage feeds the next version.

Here the industrial engineer shows: defining, documenting and validating a central process is exactly what I did on a plant floor, only now the process produces agents. The stages that follow develop what each one demanded.

## From the use case to the level of autonomy

<!-- seccion: del-caso-de-uso-a-la-autonomia -->

Vesting's core process began with the definition of the use case. Before selecting models or designing interactions, it was necessary to understand what problem had to be solved, who would use the solution, what information it required, what action it was expected to enable and how it would be determined whether the result was useful. This stage avoided starting development from the technology and forced establishing the business purpose first.

The next responsibility consisted of specifying how the solution had to work. A general process diagram did not always contain enough information to build an agent. Each activity had to be analyzed in terms of its inputs, purpose, rules, sources, tools, outputs and exceptions. This decomposition reduced the distance between the business expectation and the behavior finally implemented.

It was also necessary to delimit autonomy. Not all activities had to be executed directly by the agent. Some could be limited to retrieving and synthesizing information. Others could generate recommendations for human validation. Only certain tasks should allow more autonomous execution, always within known limits and with sufficient evidence about the actions performed. The three levels —consult, recommend, execute— were decided case by case and were written down before building.

## Technical validation, business validation and definition of done

<!-- seccion: validacion-y-definicion-de-terminado -->

Validation at Vesting had to cover both technical functioning and the business result. It was necessary to check that the integrations —the n8n flows, the sources, the tools— responded correctly, that the sources were accessible, that the outputs kept the expected structure and that exceptions could be identified. It also had to be evaluated whether the solution fulfilled the purpose for which it had been designed.

For each initiative it was necessary to agree from the beginning what it meant for the agent to be done. It was not enough to demonstrate a correct conversation or a working integration. The solution had to meet its behavior criteria, use the authorized sources and tools, handle exceptions adequately, keep enough evidence for its monitoring and have owners for its operation.

The definition of done turned general expectations into verifiable conditions and avoided confusing a convincing demo with a capability ready to be used. It is the stage that saved the most arguments: when the criterion is agreed beforehand, the question at the end is not whether the agent "looks good", but whether it meets what was written.

## Adoption and interaction with people

<!-- seccion: adopcion-e-interaccion -->

Adoption had to be part of the validation of each agent at Vesting. An agent could answer correctly in a test environment and still not integrate into the operation if people did not understand its purpose, distrusted its results or did not know when to use it. That is why implementation also required defining how the solution would be introduced into daily work, what responsibilities the users would keep and how the feedback needed to improve it would be collected.

The interaction between people and the agent had to be designed with the same attention as the technical architecture. It was necessary to avoid both automatic trust and preventive rejection. The solution had to communicate clearly what it could do, what information it used, what its limits were and in which situations it needed human support or validation. Responsible adoption does not consist of getting people to accept every answer, but of them learning to use the capability with the appropriate level of judgment and supervision.

It is the same adoption lesson from Banco Pichincha and TransMilenio, carried over to a product that also answers: there the dashboard needed a decision on the other side; here the agent needs, in addition, a person who knows when to trust and when to review.

## Observable operation and a replicable process

<!-- seccion: operacion-observable-y-replicable -->

Going into production did not represent the end of the process. An agent had to remain observable and have mechanisms to incorporate lessons derived from its use. The data captured during operation —the same 1,000 daily events of the platform— made it possible to recognize recurring errors, differences between contexts and opportunities to improve instructions, integrations or rules. Stage eleven closed the cycle with the data platform: monitoring was not a separate project, it was the last stage of the process.

To make this process replicable, I worked on its documentation and on creating a structure that could be used in future implementations. The purpose was not to establish a rigid formula, but to preserve the common lessons and reduce dependence on improvised decisions. The 27 agents in the inventory came out of that journey, and the process was documented so that the startup could build the next one without me.

This experience taught me an essential difference between developing a solution and building a capability. A solution solves one case. A capability makes it possible to solve new cases using processes, criteria and components that the organization already understands and can improve. The method, generalized beyond Vesting, is in the document on agents in production.

## From the individual agent to enterprise AI architecture

<!-- seccion: del-agente-a-la-arquitectura -->

As the work at Vesting progressed, I understood that agents should not be analyzed as isolated applications. Each one depended on data, knowledge sources, services, tools, identities, rules, evaluation mechanisms and people responsible for supervising certain results. The quality of the agent depended on the complete architecture it was integrated into.

This understanding broadened my work from data strategy toward a vision of enterprise artificial intelligence architecture. The data platform on Microsoft Fabric provided evidence and observability. The models brought interpretation or generation capabilities. The integrations made it possible to interact with other systems. The rules delimited the action. Human intervention protected the decisions that should not be fully delegated.

That is how a vision began to consolidate that I would later deepen: AI architecture is not a selection of technologies nor a collection of agents. It is a system of capabilities that connects purpose, processes, data, knowledge, models, tools, evaluation, observability, governance and human responsibility.

## Reuse beyond code

<!-- seccion: reutilizacion-mas-alla-del-codigo -->

I also identified a recurring problem at Vesting: each new initiative could start without memory of the previous ones. When the lessons about integration, monitoring, evaluation or exception handling remained only in people, the organization repeated mistakes and increased the cost of each implementation. Building architecture meant turning those lessons into reusable elements.

Reuse should not be limited to code. It could also be expressed in event definitions, integration patterns, evaluation criteria, monitoring structures, ways of specifying processes and principles for determining the appropriate level of autonomy. These assets reduced uncertainty and allowed the next solutions to start from a more mature base: the goal was for agent number 27 to cost less improvisation than the first, and not because the team was different, but because the process, the event contract and the criteria already existed.

That is, for me, the proof that a capability exists: that the next case costs less than the previous one without lowering the standard.

## DP-600 within the role

<!-- seccion: dp-600-dentro-del-rol -->

I earned the Microsoft Fabric Analytics Engineer Associate certification (DP-600) in December 2024, while I was at Vesting and building on Fabric exactly what the certification describes: lakehouse, pipelines, semantic models, storage modes, technical governance of the platform. It was not knowledge separate from the experience; I prepared for it while designing and implementing the ecosystem, and the exam topics had real cases on the platform.

That is why DP-600 is, in my profile, the credential of this period: it certifies the analytics engineering with which the data platform of an agent startup was built. What it means in concrete work, topic by topic, is in the document on Fabric in practice; how I prepared for it, in the one on how I learn.

## Why I left Vesting, and the bridge this experience built

<!-- seccion: por-que-sali-y-el-puente -->

My time at Vesting ended in January 2025. I closed the period by leaving the ecosystem and the process documented: by then I had established an operational data platform on Microsoft Fabric, an analytical base for monitoring agents and a structured, eleven-stage process with which the startup could develop new solutions with greater consistency and without depending on me.

Vesting was the experience in which my knowledge of process engineering, data, business intelligence and artificial intelligence converged most clearly. For the first time I was designing a data ecosystem whose object of observation was not only the operation of an organization, but the behavior of agents capable of using information and actively taking part in its processes. It is the point where my two halves come together: analytics engineering —what DP-600 certifies— and AI engineering.

Data engineering provided the pipelines, the structure and the traceability needed to keep the events. Analytical modeling made it possible to turn those events into understandable concepts and metrics. Power BI brought that information closer to product and operations. Observability made it possible to examine the behavior of the solutions in production. The core process turned the lessons of each implementation into a base for developing the next ones.

## What Vesting consolidated: analytics that observes intelligent systems

<!-- seccion: lo-que-vesting-consolido -->

This experience also changed my understanding of quality. In an analytical product, quality related mainly to the reliability of the data, the metrics and the interpretation. In an agent, it also had to include behavior, actions, limits, exceptions and the ability to recognize when human intervention was needed.

The evolution did not consist of abandoning analytics to devote myself to artificial intelligence. It consisted of broadening the scope of analytics until it became a capability to observe, evaluate and govern intelligent systems. The agents needed data to operate, but the organization also needed data about the agents in order to trust them: 1,000 events per day, 23 agents monitored at once and a session that could be reconstructed end to end were that trust in the form of a platform.

Seen in retrospect, the main result was not exclusively the platform nor a particular agent. It was the articulation between data, analytics, observability and the development process. Vesting allowed me to move from building solutions that supported human decisions to designing the platform, the processes and the observation mechanisms needed to operate solutions that could also recommend or execute actions. There I understood that the greater a system's capacity to act, the greater the traceability of its data, its behavior and its limits must be.
