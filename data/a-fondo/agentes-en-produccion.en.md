---
slug: agentes-en-produccion
titulo: "AI agents: the Vesting platform and ARKHÉ, my own ecosystem"
resumen: "Two experiences with agents: 27 built with Vesting's core process on n8n and monitored in real time, and ARKHÉ, my agentic ecosystem of specialized harnesses, measured on 120 scenarios: −52% tokens and instruction compliance from 71% to 93%."
cuando_usar: "Use this when they ask whether he has built artificial intelligence agents, which agent frameworks he has used (n8n, Claude Code), how he monitors an agent in production, what ARKHÉ is, how he keeps the model from making things up, and his experience with generative AI and large language models."
estado: aprobado
ancla: "/vitrina/agentes"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "Has Henry built artificial intelligence agents in production?"
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

## Artificial intelligence agents in production: two distinct experiences, not one

<!-- seccion: dos-experiencias -->

When I talk about my experience with generative artificial intelligence and AI agents, I mean
two trajectories that complement each other but must be distinguished precisely.

The first corresponds to my professional experience at Vesting, a startup specialized in
automation agents, where I worked as Data Strategy Lead between August 2023 and January 2025.
There I designed from scratch the data platform that made it possible to integrate the
information produced by the agents, analyze their behavior and monitor their operation: 120
tables, 20 GB and 1,000 events per day on Microsoft Fabric, with the information of 12
integrated clients. I also defined, documented and validated the core process used to design and
implement new solutions.

That process made it possible to build 27 agents for different needs and contexts, and real-time
monitoring came to watch up to 23 at once. That is production in the strict sense: agents with
third-party users, with contracts and with cost. My responsibility was not only to observe the
final results, but to develop the data structure, the tracking mechanisms and the way of working
needed so that implementations could be repeated with greater consistency.

The automation base used n8n as one of its fundamental components. On that base were integrated
the flows, sources, rules and services needed for the agents to take part in real processes. The
internal details of the architecture, the proprietary components and the exact implementation
sequence are part of the organization's confidential knowledge and I do not expose them in this
document. I closed that stage by leaving the ecosystem and the process documented.

## I have built artificial intelligence agents twice: ARKHÉ and the thirteen published agents

<!-- seccion: la-segunda-trayectoria -->

The second trajectory corresponds to ARKHÉ, my own agentic ecosystem, and to the agents
published on CV Viva. This work is not an extension of Vesting's architecture nor a reproduction
of its components. It is a system of my own, built later with another vision, other controls and
a level of specialization aimed at producing verifiable assets within my pipeline of
applications, research, dashboards and professional knowledge.

Currently, the showcase gathers 13 published agents, each with a specific function and technical
sheet. However, those thirteen agents do not by themselves constitute the complete ecosystem.
They are visible capabilities built on a common architecture of harnesses, sources, tools,
memory, controls and coordination rules. The thirteen, one by one, are in their own document;
here I talk about the architecture that sustains them.

In this ecosystem, agents are neither independent automations nor specialized conversations.
They operate through harnesses that delimit their function, manage the context, select sources
and tools, control the transitions and verify the results before letting the work move forward.
The purpose is not to multiply agents, but to build an architecture capable of correctly
distributing responsibility among code, models, knowledge, controls and people.

A point of vocabulary: I reserve the word "production" for Vesting. The ARKHÉ agents are
published work systems, with deliverables and evidence, for personal use; they have had no users
other than me and I do not call them production.

Separating both experiences matters. Vesting demonstrates my ability to build an enterprise data
platform and a replicable process around agents used in a professional environment. ARKHÉ
demonstrates my ability to design advanced agentic architectures, govern the context, specialize
harnesses and turn generative intelligence into a verifiable capacity for intellectual
production.

## Vesting's core process: the central replicable process

<!-- seccion: el-proceso-core -->

At Vesting I defined, documented and validated the core process for designing and implementing
artificial intelligence agents: eleven stages, from the use case to observable operation, which
are numbered in the Vesting document. The purpose was to keep each solution from starting at
zero, depending on the informal knowledge of those who had participated before, or repeating
mistakes that had already been solved in previous implementations.

The process was organized in stages that made it possible to understand the need, specify the
expected behavior, build the solution, validate it, bring it into operation and learn from how
it worked. I do not publish the specific deliverables or the proprietary mechanisms used at each
stage because they are part of the company's confidential knowledge.

What is relevant is not the name or the exact number of stages, but the discipline the process
introduced. Every initiative had to begin with an identifiable problem and purpose. The expected
behavior had to be translated into verifiable criteria. The agent's autonomy was delimited before
building it: what it could execute alone, what it should recommend and what required a person.
The solution had to be tested before being considered ready to operate, and its functioning had
to remain observable after implementation, with the definition of done agreed at the start and
not at the end.

The process I designed and structured served as the framework for building 27 agents. That
figure shows that it was not a conceptual proposal applied to a single case, but a capability
used repeatedly to develop solutions with different purposes, integrations and contexts. My
contribution consisted of establishing the common structure that made it possible to organize
those implementations, preserve lessons learned and distinguish which elements should be
standardized and which needed to adapt to each need.

## Replicating is not copying: standardize without making uniform

<!-- seccion: replicar-no-es-copiar -->

The logic of the core process comes directly from my training in Industrial Engineering. When
every unit is built in a completely different way, the organization accumulates no learning and
the cost of the next delivery stays equivalent to that of the first. A central process makes it
possible to keep memory, reuse decisions, set quality criteria and reduce the need to improvise
in the face of problems already known. It is the same reason why at Inglopres, under ISO 9001, a
documented procedure was worth more than the skill of one specific operator.

Standardization, however, was not supposed to turn every agent into the same solution. The
process established a common way of working, not a single behavior. Each agent could respond to
a different problem, use different sources and take part in specific processes, but it had to go
through comparable conditions of definition, construction, validation and follow-up. The process
fixed what was common —problem and purpose, verifiable criteria, delimited autonomy, definition
of done— and left free the sources, the tools and the rules of each case.

That distinction was one of the main lessons of the experience. Replicating does not mean copying
a solution. It means having a working architecture stable enough to build different solutions
without giving up the principles that protect their quality, traceability and capacity to
evolve.

The real asset was therefore none of the 27 agents in isolation. It was the ability to build the
next one on accumulated knowledge, with a process that reduced uncertainty and turned each
implementation into a source of learning for the later ones. Years later, that same idea —reuse
the mold and not the piece— became one of the central concepts of ARKHÉ.

## From a demo to an agent ready to operate

<!-- seccion: de-demostracion-a-operacion -->

A convincing demo was not enough to consider an agent ready to operate. Before implementation it
was necessary to check that the solution responded adequately to the expected scenarios,
handled the main exceptions and kept consistent behavior in the face of different inputs.

Evaluation had to start from the agent's purpose. Not all systems needed the same tests or could
be judged by a single metric. An agent aimed at retrieving information had to be evaluated by
the pertinence and traceability of its sources. One that coordinated tools had to show that it
selected and used each capability correctly. One that produced structured results had to meet
the expected contract without introducing unsupported information.

It was also necessary to evaluate the conditions under which the solution should not continue.
An agent ready to operate needed to recognize insufficient information, errors in an
integration, contradictory results and situations that demanded human intervention. The ability
to abstain or to hand over responsibility was part of correct behavior.

The tests had to include usual scenarios, known exceptions and boundary conditions. The goal was
not to show that the agent could complete an ideal conversation, but to observe how it responded
when reality departed from the planned path. That was where the difference between a demo and
an operational capability lay. With 27 agents built on the same process, that battery of
scenarios stopped being a per-agent effort and became a template that each initiative adapted.

This discipline remains central in my current work. The AI-300 path, which I have been taking
since July 2026, goes deeper precisely into the evaluation, observability and operation of
generative solutions and agents. My practical experience let me understand, before taking on
that formal path, that deployment is not the end of development but the beginning of a
continuous evaluation against real behavior.

## The agent frameworks I have used: n8n as an automation base, not as the complete architecture

<!-- seccion: n8n-como-base -->

n8n was a fundamental base for automating and coordinating the agents' flows at Vesting. It made
it possible to connect services, organize work sequences, execute rules and integrate different
components within processes that needed to operate consistently. That is why it appears among my
skills today: not as a tool I once saw, but as the base on which 27 agents ran.

However, using n8n did not mean the architecture was reduced to a collection of visual flows.
The business value was not in connecting nodes, but in correctly defining what information came
in, what transformation had to happen, which service or component intervened, what result was
expected and how an exception should be handled.

The platform had to give those flows a database and observability. Without it, each automation
could complete tasks, but the organization would struggle to compare behaviors, reconstruct
executions, analyze trends and understand what was happening in production.

My work consisted of connecting that execution layer with a data architecture capable of
preserving the events —sessions, requests, responses, times, statuses, cost in tokens—,
organizing the telemetry and turning the agents' functioning into analyzable information. n8n
coordinated part of the execution; Microsoft Fabric provided the base for integrating,
transforming and analyzing the evidence produced by that operation, and Power BI put it in front
of product and operations.

This separation between execution and observation was essential. The component that does the
work should not be the only one claiming that the work was done correctly. The analytical
platform had to provide an independent view of volumes, statuses, times, exceptions and results.

I also learned that an automation tool can considerably speed up construction, but it does not
remove the need for architecture. As agents, integrations and exceptions grow, it becomes
indispensable to establish conventions, responsibilities, reusable patterns and control
mechanisms that keep each flow from becoming a piece impossible to understand outside of its
creator. For that reason, I describe n8n as a fundamental and publicly mentionable base, but not
as the complete explanation of the solution. The additional details belong to Vesting's internal
architecture and must remain protected.

## Monitoring an agent is not checking that it is available

<!-- seccion: monitorear-no-es-mirar-si-esta-arriba -->

At Vesting I implemented capture, storage and analysis capabilities to monitor agents in
production: up to 23 at once, in real time. The goal was not only to check that a service was
available, but to build evidence about the way each solution behaved during its operation.

An agent can remain technically available and respond fluently while the quality of its results
deteriorates. It can also produce an adequate answer with a latency, a cost or a number of
retries that make its sustained use unviable. That is why availability is barely one dimension
of observability.

It was necessary to keep enough information to reconstruct executions and analyze what had
happened. This meant relating requests, sessions, statuses, times, responses, exceptions and
other relevant events, keeping the context needed to identify differences between agents,
integrations and periods.

Reconstructing a session was especially valuable. A final result could show that the execution
had failed, but it did not necessarily explain where the problem had originated. Observing the
sequence made it possible to identify whether the difficulty appeared in the input information,
in an integration, in an intermediate response, in a rule or in the result produced. The
monitoring reconstructed the complete session —what request each agent received, with what
context, what it answered, how long it took, what it cost, in what state it ended— and not only
the final result; the table of monitoring dimensions and decisions is in the Vesting document.

Microsoft Fabric made it possible to structure the journey of those events from capture to
analysis. Power BI turned the telemetry into an experience usable by product and operations,
organizing indicators that helped identify relevant conditions and dig into the associated
executions.

## Telemetry, functional quality and the cost of operating agents

<!-- seccion: telemetria-calidad-y-costo -->

Observability had to integrate technical and functional dimensions. Metrics of volume, times and
errors helped understand operational health. However, the quality of the result required
additional criteria and, in certain cases, human review. A serious monitoring system must
recognize that answering is not necessarily the same as answering well.

The cost of the operation also had to be observed. In generative solutions, the architecture, the
size of the context, retries and tool use can considerably change consumption. The token cost of
each session was one of the events the platform preserved, and seeing it per agent, per client
and per period was what made it possible to tell a functional demo from a sustainable
capability.

I distinguish two things that are often confused. Telemetry serves the responsible team to
understand the technical behavior of a solution. Transparency serves the affected person to know
what information is kept and used about them. Both are necessary, but they answer to different
audiences and responsibilities: at Vesting I built the first; Dash Agent AI, years later, was
born from the second.

The main lesson was that it is not possible to govern an intelligent solution whose operation
remains invisible. The greater the agent's ability to recommend, coordinate tools or execute
actions, the more important it becomes to keep evidence about what it received, the components
it used and the result it produced. That lesson is what today leads the chat on this site to
record each answer with its cost and its citations, and my 13 published agents to leave evidence
of every run.

## Dash Agent AI and transparency about the context

<!-- seccion: dash-agent-ai -->

Dash Agent AI is an application of my own published in my showcase, which I conceived and
designed entirely at Fundación CTIC, in 2026, well after Vesting. It is not a bridge from the
company's platform: it is not part of it and does not use its confidential architecture. It is
an independent application that answers a more current and different question: what information
an agent knows, keeps or uses about the person it interacts with, and how much it costs that
person to work with it.

Dash Agent AI turns an abstract dimension of trust into an examinable experience. Instead of
asking the user to accept in general terms that an agent uses context or memory, the application
shows which elements are available and how they can influence the interaction. Its star feature
is the memory auditor: the inventory of everything the agents have written about the person
—instruction files, memories, configuration— and the deterministic detection of what has stopped
being true, with file, line and exact text. The cleanup plan is a list the person executes; the
app deletes and edits nothing.

It also measures what the agents cost: tokens per session, model and day, with the four counters
kept separate; rates with source and date from a local copy; the ROI of the subscription against
the API; and spending anchored to the repository where it happened, task by task. And it keeps
what would otherwise be lost: it indexes the transcripts before the tool deletes them at 30
days.

This piece connects my training in Industrial Design with my work in artificial intelligence. It
is not enough for an architecture to be technically observable for its developers. It is also
necessary to design understandable ways of communicating to the user what is happening, what
they can control and what limits they must recognize.

## Dash Agent AI on the inside: demonstrable read-only and a withdrawn feature

<!-- seccion: dash-por-dentro -->

The application runs locally and avoids outbound network calls during its execution: a
permanent CI test fails if the runtime opens an outbound socket, and none of its five
dependencies is an AI SDK. It uses its own index in SQLite, always outside the sources, and has
693 unit and integration tests with 97.5% line coverage protecting its behavior. These decisions
answer to a single orientation: to show that transparency, privacy and verifiability can be built
into the architecture and not merely added as statements about the product.

The read-only guarantee has four layers —Node's permission model at startup, a single module
boundary, the index outside the sources and three permanent CI tests— and a screen dedicated to
checking them, where the permissions layer is measured on the spot by asking the process itself
and the others say "verified in CI" instead of making up a time.

Local execution reduces unnecessary exposure of the information and lets the user examine the
capability without sending their data to an external service. The index organizes the available
knowledge and the tests make it possible to validate that the essential functions hold as the
application evolves. The cost of operation is zero: there is no server, database, telemetry or
AI provider to bill.

I also tell what was withdrawn. One feature —the skills and optimization suggester— was built,
measured on the user's real corpus and withdrawn in August 2026: it produced 83 out-of-context
suggestions, because its premise (repetition of text) did not fit the real way of working
(repetition of structure). It is not a pending feature; it is a recorded decision with its reason
and its date, and the 12 features the app declares do not count it.

## ARKHÉ: my own agentic ecosystem

<!-- seccion: ecosistema-agentico-propio -->

My own work evolved toward ARKHÉ, an advanced agentic ecosystem that neither reproduces the
architecture used at Vesting nor is limited to the agents published individually in the
showcase. It is a higher-level structure designed to coordinate agents, harnesses, knowledge,
tools, controls and memory within a single production system, and to turn large language models
(LLMs), generative artificial intelligence, into verifiable work capacity.

The published agents are the visible capabilities. The ecosystem is the logical infrastructure
that establishes how they are selected, how they receive context, what tools they can use, what
deliverables they produce and what controls they must pass. This distinction is essential because
the sophistication does not reside in the number of agents, but in the architecture that lets
them work in a coordinated way.

Each harness works as a specialized execution environment. It defines the agent's function, the
applicable instructions, the authorized sources, the available tools, the input and output
contract, the validations and the exception conditions. The model contributes generative
capacity, but the harness turns that capacity into a delimited and evaluable behavior.

I clearly distinguish between the agent and the harness that controls its execution. The agent
represents the specialized ability to interpret, reason, generate or coordinate a task. The
harness establishes the conditions under which that ability can operate: it prepares the
context, enables the tools, validates the inputs, controls the outputs, keeps the state and
decides what to do when an exception appears.

This separation lets the model's intelligence evolve without forcing a rebuild of the whole
control architecture. It also makes it possible to improve the rules, the sources, the validators
or the context management without confusing those changes with the agent's own capabilities. The
model can change; the system's responsibility must remain explicit.

ARKHÉ is also a research piece published in the showcase. Its central idea is that work systems
are not built from scratch: they are instantiated from declarative contracts —roles, rules,
evidence— that are reused as molds, evolve and return what was learned to the core. It has been
operating for months in unrelated domains, and to validate that the topic was new I reviewed
1,405 works one by one without finding an equivalent ecosystem; 6 of its 9 concepts are already
citable with reviewed literature.

## Specialization, context as a limited resource and token economy

<!-- seccion: contexto-y-especializacion -->

The architecture avoids depending on a generalist agent that receives all the knowledge, all the
tools and all the responsibilities on every execution. That approach increases the context,
widens the error space and makes it harder to determine which component produced a result.
Instead, I distribute the work among specialized capabilities with explicit coordination
criteria.

The ecosystem manages context as a limited resource. No component should receive information
simply because it is available. It must use only the context required to fulfill its function,
together with the evidence needed to support the result. This selection reduces noise, improves
focus on the task and avoids spending tokens on irrelevant information. Selective retrieval is
the mechanism: each component receives only the chunk of knowledge its task needs, retrieved
from authorized sources, in the same retrieval-augmented generation (RAG) logic on which this
site's chat works.

Token economy is not pursued by simply reducing the context. An insufficient context can lower
the cost and destroy the quality. The goal is to maximize the usefulness of every piece of
information supplied to the model through selective retrieval, specialized instructions,
structured summaries, reuse of results and separation of deterministic tasks.

Code resolves whatever requires exactness, repeatability or unequivocal validation. Models step
in when the task needs interpretation, synthesis, generation or flexible coordination. Agents do
not indiscriminately replace conventional mechanisms; they take part only where their capability
produces necessary value. It is code first: whatever demands exactness is resolved by a
validator, not by a prompt. In the Tax Expert, for example, the arithmetic runs in Python with
Decimal and the model does not touch a single figure; in the Power BI Dashboard Builder, every
DAX measure is tested with a query before moving to the next phase.

## Memory, contracts, permissions and autonomy proportional to risk

<!-- seccion: memoria-contratos-y-autonomia -->

Memory is also designed by function. Not everything that happened should accompany every future
execution. The ecosystem distinguishes between persistent decisions, reusable results, temporary
context and detail that can be discarded once it has served its purpose. This discipline reduces
accumulation, avoids contradictions and keeps the relevant information close to the component
that actually needs it. In the published agents, that memory takes the form of a log, lessons
from each run and recorded architecture decisions: the Tax Expert carries 17, the Animation
Workshop 11.

Coordination is not limited to passing text between agents. Each transition must communicate a
structured result, the state of the task, the available evidence and the pending conditions.
This lets the next harness receive a verifiable input and not have to freely interpret the
intention of the previous component.

Identity and permissions are part of the architecture. An agent should not have access to every
source or tool just because it technically could use them. Each harness must enable only the
capabilities needed for its function and prevent an unexpected instruction from implicitly
widening its space of action.

Autonomy must also be proportional to risk. Some tasks can be executed directly because they are
reversible, verifiable and low-impact. Others must produce a recommendation or prepare an action
for approval. When the consequence is significant, hard to reverse or insufficiently observable,
responsibility must remain with a person. That is why the published agents carry gates with a
verbal token: the Tax Expert has 5, three of them human, which do not protect the system from a
technical error but protect the person from delegating a decision that is theirs; the Animation
Workshop has 6; the Power BI Dashboard Builder, 5 of human approval.

This approach avoids confusing sophistication with independence. An advanced ecosystem is not one
that removes all human intervention, but one that correctly distributes responsibility and can
explain why an action was executed, stopped or handed over.

## The measurement: 120 scenarios, −52% tokens and compliance from 71% to 93%

<!-- seccion: la-medicion -->

The result is an ecosystem in which precision emerges from the complete architecture.
Specialization reduces ambiguity. Selective retrieval improves the pertinence of the context.
Contracts structure the transitions. Controls make deviations visible. Observability makes it
possible to identify where a problem occurred. Human intervention remains available when the
solution meets a condition that exceeds its limits.

I measured it. On 120 representative scenarios, I compared ARKHÉ with a generalist agent that
received on every execution the entirety of the instructions, the context and the tools. ARKHÉ
reduced token consumption by 52% and raised instruction compliance from 71% to 93%. They are my
own calculations, with a declared baseline, sample and metric: the baseline is the generalist,
the sample is the 120 scenarios and the two metrics are tokens consumed per completed task and
proportion of instructions complied with.

Those two figures measure what the architecture promises: less irrelevant context and more
obedience to the specification. They do not measure the quality of the outputs in the abstract,
nor do they serve to compare with another ecosystem; for that, the comparison would have to be
repeated with the same scenarios. Nor is there a measurement of ARKHÉ hours comparable to the
agent hours the papers harness records, and I do not compare them.

I do not describe this ecosystem as powerful because of the number of models or agents it
contains. Its level is shown in the way it manages complexity, context, evidence, consumption,
responsibility and cumulative learning. It is an architecture designed to turn generative
intelligence into a directed, efficient and governable capability, and the figures are there so
that someone can question them with data and not with adjectives.

## Sources or a declared gap: how I keep the model from making things up

<!-- seccion: fuentes-o-vacio -->

The ARKHÉ agents share a rule that sums up my stance on generative artificial intelligence: no
verifiable claim should depend solely on the model's memory.

When an answer requires evidence, the agent must use an authorized source, identify the chunk
that supports it and keep the information needed for another person to verify it. If the
available evidence does not allow answering, the system must declare the gap instead of filling
it with a plausible formulation. It is the same rule on which this site's chat works: it
retrieves from the corpus, cites what it retrieved and, if it finds nothing, says so.

This discipline does not aim to remove all uncertainty. It aims to make it visible. A system can
have partial evidence, contradictory sources or insufficient information. The correct answer in
those cases is not to hide the limitation, but to communicate it precisely and keep the
possibility of review open.

The principle comes from my experience in data governance, from Banco Pichincha to Fundación
CTIC. An indicator without provenance loses value when it must back a decision. In the same way,
a generative answer without identifiable evidence should not acquire authority merely by being
well written.

## Three published agents that cite or stay silent: ISO 42001, Tax and graduate studies

<!-- seccion: tres-agentes-que-citan -->

The ISO 42001 Expert answers through its authorized corpus and relates each normative claim to
the corresponding clause and page, or declares the gap. It also stamps on each opinion the date
on which the currency of its sources was verified, to avoid presenting as current a reference
whose status has not been checked recently: it is the expert that knows when it stopped being up
to date. Its corpus synthesizes the 38 controls of the standard's Annex A and nothing with
consequences moves forward without a person's token.

The Tax Expert applies the same principle to another domain. It works on a corpus of 150 rules,
each with article, source, capture date, validity and declared confidence, and a suggestion
without its cited rule is not issued with a warning: it is not issued. A rule must keep its
source, validity and confidence level, and when the record is not firm the agent declares the
gap and does not calculate that branch.

The Graduate Assistant takes the principle to the academic reference: every citation is generated
from the CSL-JSON exported from the reference manager with a style processor, and is never
written by hand. The invented citation stops being possible by construction, not by instruction.
Every record in its library cites course, session and timestamp of the recording or slide number,
or declares the gap.

The three share one more rule: a derived claim must be distinguished from content retrieved
literally from the source. A paraphrase with clause and page is not the same as the literal
wording, and the system says so.

## Retrieval, interpretation and generation kept separate

<!-- seccion: recuperacion-interpretacion-generacion -->

Retrieving sources is not an automatic guarantee either. The system must verify that the
retrieved chunk is pertinent, that it truly supports the claim and that it corresponds to the
applicable version. Including a decorative citation does not turn an answer into evidence.

That is why the architecture separates retrieval, interpretation and generation. The source
provides the foundation. The agent organizes and explains. The controls verify that the
relationship between the two is defensible. When that relationship cannot be established, the
gap must remain explicit.

That separation has concrete design consequences. Retrieval is resolved with deterministic code
whenever possible —an index, a corpus with identifiers, a query in SQL or in Python— and not
with the model's memory. Interpretation is the generative part, and that is why it is the one
bounded with specialized instructions and selected context. Generating the output goes through a
validator before delivery: a schema, a mechanical check, a style processor. In Probeta DS the
AI narration is discarded if it cites a figure that does not exist; in this site's chat, the
answer that does not reach the evidence threshold falls back to a local search instead of
improvising.

It is the same data governance rule applied to a language model: an indicator without provenance
does not back a decision, and an answer without a source does not back it either.

## Agents that are work systems, not conversations

<!-- seccion: sistemas-de-trabajo -->

The agents published in my showcase are not designed as generic chats. They are specialized work
systems that produce deliverables, use tools, apply controls and keep evidence about the way they
execute a task.

A work system needs a definition of done. Producing a coherent answer is not enough. The result
must meet a format, use the corresponding sources, pass the validations and leave the evidence
needed so that another person can review it or another component can continue the process.

The Power BI Dashboard Builder is built and tested: it creates the complete project in the native
PBIP format —the semantic model with its relationships and columns, the ETL in Power Query M,
the DAX measures and the visuals— and can also extract data. It works directly on the native
structures needed to produce analytical artifacts without depending on manual operation of the
interface. However, no execution is considered complete by the mere fact of generating a file:
no run closes without DAX in green, a clean validator and a render approved by a person. A
dashboard that used to cost on the order of 32 manual hours comes out of one run with 20 binary
criteria checked.

The Animation Workshop is designed so that adding new techniques does not force modifying the
central execution mechanism. This condition works as an extensibility test, and it is a command:
after each technique is added, the diff of the main pipeline has to come out empty. If it comes
out with changes, the addition does not pass and the technique's contract is corrected, never
the core. If adding a new capability requires rewriting the pipeline, the design does not yet
properly separate variation from the common structure.

## The ledger, the factory and the definition of done

<!-- seccion: ledger-fabrica-y-terminado -->

The Computational Paper Harness protects the link between results and evidence. A figure cannot
reach the final document unless it first exists as a controlled record within the flow: if it is
not in the ledger, it is not in the paper. Every figure is a function of the ledger, so
provenance is not documented: it becomes hard to break. This rule keeps the text from becoming an
autonomous source of numbers that cannot be reconstructed. Three papers came out this way, with
44 binary verification criteria, and after three papers of different classes the diff of the
phases and of the contract is still empty; its sibling, the Design Science Harness, works with 52
criteria.

The AI-APPs Factory, which coordinates the pipeline of my applications, does not let an
application move forward merely because there is enthusiasm to build it either. It needs two
written approvals before starting —the current priority and the vision with all of its features
inventoried— and requires a documented closure to keep memory of each cycle: no sprint closes
without the summary the app's repository wrote, and without that file the harness refuses. That
is how 24 sprints have closed with a retrospective.

These examples share the same principle: the agent does not receive an open request and freely
decide how to resolve it. It operates within an architecture that defines its responsibility,
controls its tools, verifies the result and keeps the state needed so that the work can continue.

The value is not in the system producing more text. It is in being able to complete verifiable
work with less ambiguity, less repetition and greater capacity for review.

## Controls must be able to go red

<!-- seccion: controles-en-rojo -->

A central rule of my ecosystem is that a control must demonstrate that it can detect the
condition it was designed for. A test that always shows green, but has never been observed
recognizing a real or provoked failure, does not yet demonstrate that it protects the system. The
rule as such —a gate is demonstrated by failing— belongs to the applications pipeline and is
formulated in its document; here I tell how the agents apply it.

That is why the controls are designed to fail under known scenarios and pass those same
scenarios after the problem is corrected. This practice makes it possible to relate each test to
a concrete risk and keeps coverage from becoming a figure without interpretation. The Graduate
Assistant does it with a bait mode: it seeds a corpus designed to violate each of its rules and
checks, case by case, that each of its 9 closing checks fires. The literal assertion, and not the
aggregate count, exposed three defects that reading did not see.

In generative agents, checking that the system answers is not enough. The tests must evaluate
whether it used the appropriate source, respected the format, correctly selected a tool,
recognized the lack of information, avoided an unsupported claim and handed over responsibility
when the situation required human intervention.

There must also be tests on the transitions between harnesses. A component can produce a result
that is correct for itself and still hand the next one an incomplete or ambiguous structure. The
input and output contracts make it possible to verify that each handoff preserves the necessary
meaning and evidence.

Controls on consumption also matter. An execution can reach the expected result and do so through
an excessive number of calls, redundant context or avoidable corrections. Efficiency is part of
quality when it affects cost, latency and the ability to scale.

This approach connects with my early experience in quality management systems under ISO 9001. A
control does not exist because it has been documented or because it is present in the
architecture. It exists when it can offer evidence of its effectiveness against the deviation it
must detect or contain.

## Precision and token economy as architecture problems

<!-- seccion: precision-y-economia -->

The precision of an agentic ecosystem does not depend solely on the model used. It emerges from
the way the task is defined, the context is selected, tools are assigned, responsibilities are
distributed and the result is verified.

A larger model can temporarily compensate for a deficient specification, but it does not remove
the ambiguity of the process or guarantee the right source. Similarly, increasing the context can
bring in more information and, at the same time, reduce the system's ability to tell what is
relevant.

My architecture seeks to reduce both dependencies. The harnesses specialize the behavior,
retrieval contributes only the pertinent knowledge, the contracts control the transitions and the
validators check what can be verified through deterministic mechanisms.

Token economy is managed throughout the entire flow. The system avoids repeating stable
instructions, reuses previously validated artifacts, summarizes accumulated states and separates
the tasks that do not need a generative model. When a capability can be resolved through code, it
does not spend tokens simulating a deterministic operation. That is the mechanics behind the 52%
fewer tokens on the 120 scenarios: not a cheaper model, but less useless context per call.

I also evaluate the total cost of completing a task and not only the tokens used in one call. A
seemingly cheap answer can turn out expensive if it needs multiple retries, corrections or
manual reviews. The useful measure is the consumption needed to obtain an acceptable result, not
the isolated price of the first answer. Dash Agent AI exists in part to measure that on real
work: where the spending goes without producing anything —retries, abandoned sessions, massive
re-reads—, each pattern with its threshold written down.

Optimization must preserve quality. I do not consider efficient an architecture that reduces the
context and increases omissions, nor one that lowers the calls and shifts the work toward
permanent human review. Economy must be measured together with compliance with criteria, the
need for correction and the total time to complete the task.

When I communicate quantitative improvements, I establish a baseline, a sample, a metric and
evaluation conditions. Without that comparison, I describe the design mechanisms and do not use
superlatives as substitutes for evidence. The goal is to build a system in which every token has
a function, every call has a purpose and every agent receives only the capability needed to
fulfill its responsibility.

## What I take from the two experiences

<!-- seccion: que-me-llevo -->

Vesting and ARKHÉ represent two different stages of the same professional evolution. At Vesting
I built the data platform and structured the process that served as the framework for developing
27 agents in a professional environment. There I learned to turn their operation into observable
events, to keep evidence about their behavior and to turn each implementation into learning for
the next ones.

ARKHÉ took that experience toward a different and more specialized architecture. The focus
stopped being solely on the repeatability of the process and came to include context management,
the specialization of the harnesses, tool coordination, token economy, verification of results
and the explicit distribution of responsibilities between people and systems. And it added
measurement: 120 scenarios, a baseline and two metrics.

Both experiences confirmed that the hardest part of an agent is not connecting it to a model. The
real challenge consists of correctly specifying its function, giving it the necessary knowledge,
limiting its space of action, evaluating its behavior and keeping enough evidence to understand
what it did.

I also learned that repeatability and specialization are not contradictory goals. The common
process protects the principles that must remain. The specialized harnesses allow adapting the
behavior to each task. The mature architecture appears when both levels can coexist without each
new solution having to rebuild the whole system.

## Scale and repeatability versus depth and specialization

<!-- seccion: escala-frente-a-profundidad -->

Industrial Engineering lets me analyze these ecosystems as processes: inputs, activities,
constraints, handoffs, controls, exceptions and results. Industrial Design keeps the interaction
with people visible and demands that the capabilities, limits and requests for intervention be
understandable. DP-600 underpins the analytical platform that observes the agents; the AI-103
path deepens the construction of applications and agents; and the AI-300 path extends the
discipline needed to evaluate and operate them reliably.

The final lesson is clear: an agent should not be evaluated by how fluently it converses or by
the number of tools it can invoke. It should be evaluated by the quality of the work it
completes, the evidence it keeps, the efficiency with which it uses resources and the clarity
with which it recognizes its limits.

At Vesting I learned to build the organizational capability needed to develop and observe
agents: a platform and a process with which a startup built 27 agents for 12 clients and watched
them in real time. In ARKHÉ I turned those lessons into an advanced agentic architecture, with 13
published agents as the visible part and a research piece that supports it. One experience
demonstrates professional scale and repeatability; the other, architectural depth,
specialization, measurement and independent evolution.
