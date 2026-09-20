---
slug: vesting
titulo: "Vesting — the data platform for AI agents (2023–2025)"
resumen: "Microsoft Fabric from scratch for an agent startup: 12 clients, 27 agents in inventory and 23 monitored at once in real time, 1,000 events per day, 20 GB and 120 tables, per-client governance and an 11-stage core process for designing and implementing agents."
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
NAMES are not caught by a regex — those are on you.

HOW THIS FILE IS WRITTEN
- Normal prose, in the first person, in paragraphs.
- Every subsection starts with a `##` title followed by a comment
  `<!-- seccion: id -->`. Those are the ONLY 2 marks.

- `estado: borrador` → the chat does NOT index it and no English twin is required.
  `estado: aprobado` → the chat indexes it and requires the complete `.en.md`
  twin, subsection by subsection.
- No figure, date or achievement without a source. Whatever is missing goes as a
  `CONFIRMAR` placeholder (see the manual), never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
  -->

<!-- guide (comes from the story skeleton, S3 — written by the owner):
Your star story: how a data ecosystem is designed from scratch in
Microsoft Fabric, architecture decisions and why, how an AI agent is
monitored in production, what the replicable core process is. -->

## An agent startup without a common platform for its data

<!-- seccion: una-startup-sin-plataforma -->

I joined **Vesting in August 2023** as Data Strategy Lead and stayed until January 2025:
**eighteen months**. Vesting is a **startup** that develops automation agents for its clients,
and it was growing without data infrastructure: its agents' analytics had nowhere to live and
every client data integration was handcrafted.

The challenge was different in nature from everything before. It was no longer a matter of
analyzing a process executed by people or recorded by an enterprise application: the agents
generated events while interacting with people, systems and tools, and each one brought its own
structures. Without a shared base, every new solution was an exception.

My responsibility was the design, **from scratch**, of Vesting's **data ecosystem**, the
strategy and the platform: integrate that information, set common structures and build the
analytical base for monitoring the agents, with governance from day one and without slowing the
startup down. The underlying tension was speed versus sustainability: distinguishing what had to
be common —fundamental events, identifiers, states, metrics— from what could remain configurable
per client or per agent.

## What I did at Vesting: the size of what was built

<!-- seccion: el-tamano-de-lo-construido -->

The ecosystem's figures at the close of the stage:

| What                                 | How much                            |
| ------------------------------------ | ----------------------------------- |
| Clients integrated into the platform | **12**                              |
| Agents in the inventory              | **27**, built with the core process |
| Agents monitored at once             | **23**                              |
| Events                               | **1,000 per day**                   |
| Volume                               | **20 GB**                           |
| Model tables                         | **120**                             |
| Monitoring                           | **in real time**                    |

The same things were captured from every agent, with the same structure: **sessions, requests,
responses, times, states and cost in tokens**. The session was the unit of analysis: an isolated
event signals a failure; the complete sequence explains how an interaction evolved, where it
went off course and what it cost.

## The data architecture in Microsoft Fabric

<!-- seccion: la-arquitectura -->

I designed and implemented the complete data ecosystem in **Microsoft Fabric**: **Big Data**,
**Data Warehouse** and **distributed processing** on a **lakehouse**, with pipelines that
received the information from the agents' integrations —n8n among them—, validated its
structure, preserved the context identifiers and transformed it into analytical entities.

The architecture answered two needs at once. The historical one: keep the events to analyze
trends, reconstruct sessions and compare agents over time. The operational one: information
timely enough to intervene while it was still possible.

**Early normalization** was the key decision. Although the agents had different purposes, they
shared what was observable —interactions, sessions, times, states, responses, errors,
resources—, and a common structure from ingestion made it possible to compare, validate and
aggregate without rewriting every analysis. Detail was preserved without degrading queries:
events to explain, aggregates to observe.

**Power BI** was the consumption layer: semantic models that turned technical events into
concepts —agents, clients, sessions, periods, results— with a **combination of storage modes**
—Direct Lake, import and DirectQuery— chosen by the use of each model. How that is decided is in
the Fabric document.

## Governance by design

<!-- seccion: la-gobernanza -->

The platform integrated information from **12 different clients**. Waiting until the end to
resolve ownership, permissions and traceability would have turned the platform into a risk.
Governance was a property of the architecture, not a later review.

Isolation between clients was solved with **separate workspaces**: each client with its own
space, its own permissions and its own models, on common event structures. The standardization
of events also served a governance function: validating information from ingestion, identifying
mandatory fields and making exceptions visible when an integration did not meet the contract.

The transformations were understandable and reproducible: a metric on an agent's performance
kept a clear relationship with the events that computed it, indispensable for investigating a
behavior or explaining a result to a client. And not all information had the same nature: a
technical event, a user's data, a generated response and an executed action required different
treatments. The three governance experiences, compared, are in the data and AI governance
document.

## Monitoring artificial intelligence agents in production

<!-- seccion: monitoreo-de-agentes -->

I built the **real-time monitoring** of the agents in production: **23 at once** at the peak.
Observability had to answer something deeper than "is it available?": which request each agent
received, with what context, what it answered, how long it took, what it cost and in what state
it ended.

| Dimension   | What was measured                                   | For which decision                         |
| ----------- | --------------------------------------------------- | ------------------------------------------ |
| Operational | availability, volume, errors, response times        | intervene before the client notices        |
| Usage       | distribution by agent, client, period and task type | where demand grows and where it does not   |
| Economic    | cost in tokens per session and per agent            | which agent costs more than it solves      |
| Functional  | final states and sessions that needed intervention  | where the agent answers but does not solve |

Technical metrics prove that the agent answered; not that the answer was useful. That is why the
operational dashboards, for product and operations, allowed tracing an anomaly down to the
session's events. An available agent can answer badly; an accurate one can be too slow; a useful
answer can cost too much. Monitoring had to see all four things.

This experience changed my idea of business intelligence: the dashboard no longer described only
processes executed by people; it observed intelligent systems that took part in them.

## The core process for designing and implementing agents

<!-- seccion: el-proceso-core -->

Beyond the ecosystem, I structured, documented and validated the **core process** with which the
**27 agents** in the inventory were designed and implemented. The asset was not an agent: it was
the capacity to build the next one with more clarity, consistency and control. Eleven stages:

1. **Use case**: what problem is solved and what action it enables.
2. **Users and decision**: who uses it and what they decide with it.
3. **Functional specification**: each activity with inputs, rules, outputs and verifiable criteria.
4. **Authorized sources and tools**: what it may consult and what it may use.
5. **Level of autonomy**: consult, recommend or execute, and under what conditions.
6. **Exceptions**: what it does when information is missing, there is a contradiction or the case is ambiguous.
7. **Technical validation**: integrations, sources, structure of the outputs.
8. **Business validation**: the result matches what the operation needs.
9. **Definition of done**: agreed beforehand, not demonstrated afterwards.
10. **Adoption and interaction**: what it can do, what information it uses, when it asks for human validation; neither automatic trust nor preemptive rejection.
11. **Observable operation**: the agent stays measured and usage feeds the next version.

Here the industrial engineer shows: defining, documenting and validating a central process is
exactly what I did in a plant, except that the process now produces agents. A solution solves
one case; a capability makes it possible to solve the next ones with processes, criteria and
components the organization already understands. The method, generalized, is in the agents in
production document.

## Why I left Vesting, and the bridge this experience built

<!-- seccion: el-puente -->

Vesting is the point where my two halves meet: analytics engineering —what the **DP-600**
certifies, which I earned in December 2024, while I was in this role and building on Fabric what
the certification describes— and AI engineering. For the first time, the object of observation
of a data platform was neither people nor processes but systems that also recommend and execute.

I left Vesting in January 2025 and closed the stage by leaving the ecosystem and the process
documented: an operating data platform, the analytical base for monitoring and a process with
which the startup could build the next agent without me. The closer a solution is to acting, the
more traceability its data, its behavior and its limits demand.
