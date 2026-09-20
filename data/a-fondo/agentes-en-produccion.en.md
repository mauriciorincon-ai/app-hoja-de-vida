---
slug: agentes-en-produccion
titulo: "AI agents: Vesting's platform and ARKHÉ, my own ecosystem"
resumen: "Two experiences with agents: 27 built with Vesting's core process on n8n and monitored in real time, and ARKHÉ, my agentic ecosystem of specialized harnesses, measured over 120 scenarios: −52% tokens and instruction compliance from 71% to 93%."
estado: aprobado
ancla: "/vitrina/agentes"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What experience does Henry have with artificial intelligence agents in production?"
  - "How is an AI agent monitored in production?"
  - "What is ARKHÉ?"
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
- Normal prose, in the first person, in paragraphs.
- Every subsection starts with a `##` title followed by a comment
  `<!-- seccion: id -->`. Those are the ONLY 2 marks.
- `estado: borrador` → the chat does NOT index it and no English twin is required.
  `estado: aprobado` → the chat indexes it and requires the complete `.en.md`
  twin, subsection by subsection.
- No figure, date or achievement without a source. Whatever is missing goes as
  a `CONFIRMAR: what is missing` marker in square brackets, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

## Artificial intelligence agents in production: two different experiences, not one

<!-- seccion: dos-experiencias -->

When I talk about AI **agents** I mean two trajectories that complement each other and that I keep
precisely apart. The first is professional: at **Vesting**, between August 2023 and January 2025, I
designed the data platform and the **core process** with which **27 agents** were built for
**12 clients**, and the real-time **monitoring** of up to 23 at once. That is production: agents
with users, contracts and cost.

The second is my own: **ARKHÉ**, the agentic ecosystem I built afterwards, with a different
architecture and without reproducing Vesting's, of which the **13 published agents** in the
showcase are the visible part. They are working systems for personal use, with deliverables and
evidence, and I do not call them "production": I reserve that word for Vesting. The thirteen, one
by one, are in their own document.

## Vesting's core process

<!-- seccion: el-proceso-core -->

At Vesting I defined, documented and validated the central process for designing and implementing
agents: eleven stages, from the use case to observable operation, which are numbered in the
Vesting document. It served as the framework for 27 agents, and that is what it demonstrates: not a
conceptual proposal but a capability used repeatedly.

Standardizing did not mean they were all the same. The process fixed a common way of working
—identifiable problem and purpose, behavior translated into verifiable criteria, bounded autonomy,
a definition of done agreed beforehand— and left sources, tools and rules free. The asset was not
any one agent: it was building the next one on accumulated knowledge. It is the industrial
engineering logic of a central process: if every unit is made differently, the organization does
not learn and the next one costs the same as the first.

## n8n as the automation base, not as the complete architecture

<!-- seccion: n8n -->

The flows of Vesting's agents ran on **n8n**: connecting services, organizing sequences, executing
rules and integrating components. But the architecture was not a collection of visual flows: the
value lay in defining what information came in, what transformation took place, what evidence was
kept and what happened on an exception.

My job was to connect that execution layer with the data platform on Microsoft Fabric that kept
the events —sessions, requests, responses, timings, states, cost in tokens— and made them
analyzable. The separation matters: the component that does the work should not be the only one
that claims it did it well. n8n coordinated part of the execution; Fabric and Power BI gave the
independent view. The internal details belong to Vesting and remain protected.

## Monitoring an agent is not checking that it is available

<!-- seccion: monitorear-un-agente -->

An agent can be available and respond fluently while the quality of its results deteriorates; or
respond well with a latency, a cost or a number of retries that make it unviable. That is why
Vesting's monitoring reconstructed the complete **session** —what request each agent received, with
what context, what it answered, how long it took, what it cost, in what state it ended— and not
only the final result; the table of dimensions and decisions is in the Vesting document.

I distinguish two things that are often confused: **telemetry**, which serves the team to
understand technical behavior, and **transparency**, which serves the affected person to know what
information is kept and used about them. From the second came, already at CTIC, **Dash Agent AI**:
an application that shows what context an agent keeps about the person, which runs locally without
a single network call, with 693 tests and 97.5% coverage. The lesson from Vesting is that you do
not govern an intelligent solution whose operation is invisible.

## ARKHÉ: my agentic ecosystem

<!-- seccion: arkhe -->

**ARKHÉ** is a higher-level architecture that coordinates agents, knowledge, tools, controls and
memory to turn large language models (**LLM**, generative artificial intelligence) into working
capacity. A **harness** is the execution wrapper that fixes for an agent its function, its
instructions, its authorized sources, its tools, its input and output contract, its validations
and its exception conditions. I separate the agent —the capacity to interpret, reason or generate—
from the harness that controls under what conditions it operates: that way the model improves
without rebuilding the control, and the rules improve without being confused with the model.

Four design decisions: **specialization** instead of a generalist agent that receives all the
knowledge and all the tools on every call; **selective retrieval** so that each component receives
only the context it needs; **contracts** at every transition, with structured result, state and
evidence; and **code first**: whatever demands exactness is solved by a validator, not by a
**prompt**. Memory is designed by function and autonomy by risk.

I measured it. Over **120 representative scenarios**, compared with a generalist agent that
received on every run the totality of instructions, context and tools, ARKHÉ reduced token
consumption by **52%** and raised instruction compliance from **71% to 93%**. They are my own
calculations, with baseline, sample and metric declared. As a research piece, ARKHÉ is in the
showcase: 1,405 works verified one by one without finding an equivalent ecosystem, and 6 of its 9
concepts already citable with peer-reviewed literature.

## Sources or a declared gap: how I keep the model from making things up

<!-- seccion: fuentes-o-vacio -->

ARKHÉ's agents share a rule that sums up my stance on generative AI: **no verifiable claim depends
solely on the model's memory**. When the answer demands evidence, the agent uses an authorized
source, identifies the chunk that supports it and keeps what is needed for someone else to verify
it; if the evidence is not enough, it **declares the gap**.

Three published examples: the **ISO 42001 Expert** cites clause and page or declares the gap; the
**Tax Expert** works on 150 rules with article, source, validity and confidence, and a suggestion
without its cited rule is not issued; the **Postgraduate Assistant** generates every citation from
CSL-JSON with a style processor, never writes it by hand. Retrieval is no automatic guarantee: the
system verifies that the chunk is pertinent and supports the claim; a decorative citation does not
make an answer verifiable. It is the same rule as in data governance: an indicator without
provenance does not back a decision.

## What I take from the two experiences

<!-- seccion: que-me-llevo -->

Vesting demonstrated professional scale and repeatability: a platform and a process with which a
startup built 27 agents. ARKHÉ demonstrated architecture and measurement: how context, evidence,
consumption and responsibility are managed, with numbers. Both confirmed the same thing: the hard
part of an agent is not connecting it to a model; it is specifying its function, giving it just
the right knowledge, limiting its space of action, evaluating it and observing it. An agent is not
judged by how well it converses but by the verifiable work it completes.
