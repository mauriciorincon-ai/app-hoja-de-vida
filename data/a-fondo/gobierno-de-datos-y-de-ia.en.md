---
slug: gobierno-de-datos-y-de-ia
titulo: "Data governance and AI governance"
resumen: "Governance set up three times —co-led in banking, designed from scratch for 12 clients at an AI-agent startup, and today in healthcare under UNE-ISO/IEC 42001:2025 with 23 instruments— plus the ISO 42001 expert agent and the rules with which I govern my own pipeline."
cuando_usar: "Use this when they ask about data or artificial intelligence governance, the ISO 42001 standard, data policies and guidelines, personal and sensitive data, traceability of information, who decides who sees which data, responsible use of AI, or how he documents what he does."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-21
preguntas_de_prueba:
  - "What experience does Henry have in data governance?"
  - "Does Henry know about AI governance and the ISO 42001 standard?"
  - "How does he handle personal or sensitive data?"
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
a CONFIRMAR marker in square brackets (what is missing), never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

## Three governance experiences, three different problems

<!-- seccion: tres-veces -->

I have taken on data governance and artificial intelligence governance responsibilities in three
profoundly different contexts: banking, an AI-agent startup and a healthcare institution. In each
one I took part from a different scope: co-leading a governance initiative, designing principles and
mechanisms from scratch for an agent platform, and currently managing data quality while I lead the
structuring of an institutional artificial intelligence strategy.

| Where                             | When                        | Scope                                                     | The problem that had to be governed                                                                             |
| --------------------------------- | --------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Banco Pichincha**               | March – July 2023           | I co-led the area's data governance initiative            | trust: consistent definitions, an owner per metric, access by purpose                                           |
| **Vesting**, an agent startup     | August 2023 – January 2025  | I designed the governance from scratch                    | 12 clients on one platform: identity, ownership, isolation and traceability from the first event                |
| **Fundación CTIC**, healthcare    | since March 2025            | I manage data quality and lead the AI strategy            | data that describe people, authorized purpose and an AI management system under UNE-ISO/IEC 42001:2025          |

This diversity has allowed me to understand that governance cannot be carried from one organization
to another as an unchanging template. Its principles may remain, but its priorities, controls,
owners and adoption mechanisms must respond to the purpose, the risks and the maturity of each
environment. The three experiences represent different problems: in banking I went deep into trust,
semantics and the controlled use of critical information; at Vesting I brought in isolation,
observability and traceability over intelligent systems; in healthcare I connect quality,
confidentiality, authorized purpose and institutional management of artificial intelligence.

Having worked in these three contexts allows me to recognize that effective governance does not
begin by selecting a catalog or drafting a policy. It begins by understanding what the organization
needs to protect, which decisions depend on the information, which risks its use introduces and what
evidence will make it possible to demonstrate that the controls really work.

## Banco Pichincha: co-led governance in banking, where semantics protect interpretation

<!-- seccion: gobierno-en-banca -->

At Banco Pichincha, between March and July 2023, I co-led a governance initiative aimed at
strengthening the security, quality and reliability of information. In a financial environment, data
must keep consistent definitions, identifiable owners and clear conditions of access and use.
Governance must also make it possible to demonstrate that the controls exist and that they can
sustain important decisions with verifiable evidence.

This experience taught me that an analytics platform is not governed by permissions alone. It also
needs shared metrics, consistent semantic models, responsibilities over the definitions and
mechanisms that allow every result to be traced back to the sources and rules that produce it.
Security protects access; semantics and lineage protect interpretation.

Governance and the product were the same thing. With a team of 5 people in my charge, the dashboards
that more than 50 business users adopted —with +25% in decision-making— were only adoptable because
every indicator had a definition, an owner and a single calculation rule, centralized in the
semantic model and expressed as a DAX measure that every product reused. I optimized those semantic
models with DAX Studio and Tabular Editor, reduced analysis times in the ETL processes by 35%, and
the predictive models of churn, delinquency and risk that reached production with more than 90%
accuracy had the same lineage requirement as any figure on a dashboard: which data they came from,
under which rules and since when.

The training program for 12 professionals was also a governance instrument, even if it was not
called that: a user who understands where a figure comes from does not redefine it on their own in a
separate file, and that is the origin of most of the parallel versions of the truth that a data
governance program has to chase down later. What Banco Pichincha left me is the conviction that data
governance in banking is, above all, governance of meaning.

## Vesting: governance by design for an agent platform with 12 clients

<!-- seccion: gobierno-en-vesting -->

At Vesting, between August 2023 and January 2025, I designed from scratch a data strategy for a
platform that integrated information produced by AI agents associated with different clients. There
the main challenge was to preserve identity, ownership, isolation and traceability from the moment
each event came in. These attributes could not be added after the analytics products were built,
because they were part of the platform's fundamental architecture.

The governance decision that ordered everything was isolation per client in **separate workspaces**
of Microsoft Fabric: each of the 12 integrated clients had its own space, its own identity and its
own ownership over the data, and no query crossed that boundary by accident. On that base the
ecosystem grew —120 tables, 20 GB and 1,000 events per day in the lakehouse and the warehouse—, with
semantic models in a combination of Direct Lake, import and DirectQuery depending on what each
product needed.

The experience also broadened my understanding of the governed asset. It was no longer only about
tables, metrics or reports. It was necessary to observe events produced by intelligent systems, to
distinguish requests, responses, states and exceptions, and to keep enough context to reconstruct
what happened during an execution. Real-time monitoring of up to 23 agents at once, over an
inventory of 27, was governance in its most concrete form: knowing what each agent did, for which
client, at what cost and with what result, without depending on someone remembering it.

The data standardization I defined —what each agent had to record, with which identity and in which
format— was what made possible the eleven-stage core process with which the agents were designed and
implemented: an agent that left no trace according to the standard could not be monitored, and one
that could not be monitored did not go to production. I closed that stage by leaving the ecosystem
and the process documented.

## Fundación CTIC: data quality in healthcare and the institutional AI strategy

<!-- seccion: gobierno-en-salud -->

At Fundación CTIC, since March 2025, I manage cleaning, integration and standardization processes
aimed at strengthening the quality, consistency and reliability of institutional information. This
work takes place in an environment where the data can represent people, care processes and sensitive
decisions, so their use demands an especially high level of responsibility, confidentiality and
traceability. In healthcare —the sector of the IPS (healthcare providers), with their licensing and
their quality indicators— the framework is not only internal: habeas data and Law 1581 on personal
data set what may be processed, for what purpose and with what authorization.

The quality rules I have set up were designed by understanding the process that produces each piece
of data and the consequence of a wrong interpretation: completeness of the fields a decision needs,
duplicate detection, reconciliation between sources that describe the same fact, and thresholds
that, when exceeded, trigger a review before the figure reaches a dashboard. I do not publish the
figures of those rules; I do publish the principle: data quality as a permanent practice, not as a
cleaning event before a report. On that base run 42 analytics products in Power BI for 20 leaders of
15 processes and about 75 users, with close to 60% less effort in preparing the information
—estimated— and 10 analysis plans under follow-up.

I currently also lead the institutional artificial intelligence strategy, structured from the
principles and requirements of ISO/IEC 42001 in its Spanish edition, UNE-ISO/IEC 42001:2025. This
responsibility extends governance from the data to the systems that use them to produce analyses,
recommendations, content or actions. My line of work is direct with the Planning Directorate and
with the sub-directorates of technology, information management and quality; everything I
communicate about this experience is aggregated and without naming processes, indicators or people.
The detail of the role —the two audiences, the dashboards by process, the institutional AI
architecture— is in the Fundación CTIC document.

## What it means to govern a piece of data: meaning, lineage, roles and traceability of information

<!-- seccion: que-es-gobernar -->

Governing a piece of data means being able to answer and demonstrate at least five questions: what
it represents, where it comes from, who answers for it, who may use it and what happens when it
changes.

The first question concerns meaning. A column can have a technically valid name and still be
interpreted differently by several areas. That is why definitions must be established with the
business owners and expressed in a way that can be understood, implemented and verified. At Banco
Pichincha that definition lived in the semantic model as a DAX measure with an owner; at Fundación
CTIC, in the definition agreed with the process leader before the indicator enters one of the 42
analytics products.

The second question concerns provenance: **lineage**. An indicator must keep a traceable
relationship with the sources, the events and the transformations that produce it. Lineage is not
only about drawing connections between systems. It must make it possible to understand which rules
modified the information and how those rules influenced the result. At Vesting, the lineage of a
figure could be traced back to the agent event that had originated it —request, response, state,
cost— and to the client it belonged to.

The third question concerns responsibility: **roles**. Every relevant asset needs a person or
function with the authority to validate its meaning, resolve discrepancies and determine when a
modification should be accepted. Without identifiable responsibility, governance becomes
documentation with no real decision-making capacity. The classic roles —the data owner in the
business, the technical custodian, the definition steward— are worth what their capacity to decide
is worth: at Cafam, in 2021, every finding of the control BI had an owner with a job title, and that
is why it got closed.

## Who decides who can see which data: access-by-purpose policies and change management

<!-- seccion: acceso-y-cambio -->

The fourth question concerns access and purpose: **policies**. It is not enough to establish who may
query a piece of data. It is also necessary to understand what they may use it for, what level of
detail they need and which restrictions must be kept when the information is integrated with another
source or made available to an application. An access-by-purpose policy says more than a list of
permissions: it says that the same piece of data may be queried in aggregate for a management
decision and may not be queried in identified form for something else. In healthcare that difference
is the law; at Vesting it was the mechanism —separate workspaces per client— that made it possible
to integrate 12 clients on a single platform.

The fifth question concerns change. It is one of the most important and one of the most frequently
underestimated. When a definition, a source or a rule is modified, the products, processes and
decisions that depend on it must be identified. An indicator that changes silently can destroy more
trust than a missing piece of data, because it keeps the same name while representing a different
reality. It is the reason why at Banco Pichincha the definitions lived in a single semantic model
and not in each report: a change in the measure changed the 50+ users at once, and it was known.

Governance must accompany the entire life cycle. Data are born in processes, get integrated,
transformed, used and eventually lose currency. Each stage needs controls proportional to its
purpose and to the consequences of an incorrect use.

My specialty in Power BI and semantic models is especially relevant at this point. Governance does
not end when the data reach a platform. The measures, relationships and rules that organize their
meaning are governed assets too. A semantic model makes it possible to implement and reuse
institutional definitions, but it does not replace the business agreement that gives them
legitimacy. Governing is not documenting definitions that nobody consults: it is making the right
information reach the right people under clear conditions, and being able to demonstrate it.

## Personal and sensitive data: habeas data, Law 1581 and anonymization in healthcare

<!-- seccion: datos-personales -->

With personal data, the five questions have the law behind them. In Colombia, the right of **habeas
data** and **Law 1581** on personal data protection set what may be processed, for what purpose,
with what authorization from the data subject and with what duties for whoever processes it. In
healthcare, moreover, the data can be sensitive by nature —it describes a person's condition—, and
that raises the standard: the authorized purpose is not a formality but the limit of what can be
done with the information.

My working rule with people's data, the one I apply at Fundación CTIC since 2025, has three parts.
First, **anonymization** when the analysis does not need to identify anyone: most management
decisions are made on aggregates, and a dashboard that shows trends by process has no reason to
contain a person. Second, access by purpose and not by job title: that someone may see a piece of
data for one function does not mean they may see it for another, and the policies are written on the
purpose. Third, traceability of who consulted what and for what, because in healthcare the evidence
that the controls work is not optional.

I apply the same rule to what I say in public. Everything I communicate about that experience is
aggregated —42 products, 20 leaders, 15 processes— and I do not expose patient data, clinical
information, sensitive details of the processes or internal knowledge whose disclosure could affect
the people or the institution. I can explain capabilities, architecture principles and governance
practices; I do not reveal the information they operate on.

And I brought it to my showcase: one of the 6 published applications is an anonymizer, because the
first need of anyone who wants to analyze people's data with artificial intelligence is to stop
having the people in the data. The rule does not belong to one job: it is mine. And since September
2026 it stopped applying only to what I do for others: this very CV started collecting personal
data, and what follows tells which data and how it is governed.

## What personal data this site collects: name and email to use the chat

<!-- seccion: datos-personales-de-este-sitio -->

This CV stopped being a site that asks for nothing, and it is worth saying so before someone finds
it out on their own. Throughout its development, the only thing that reached a database was a
roadmap vote —today, the one of each sibling application—, with no name, no email and no trace that
would allow anyone to know who had voted: the written rule was zero personal information. Since 21
September 2026 there is one exception, and it is deliberate: to talk with the chat you have to leave
**a name and an email**.

The purpose is concrete and travels written into the notice the visitor ticks before sending
anything: that I know who is writing to me and what they were answered, and that the conversation
—and the token budget that pays for it— is not spent on traffic with no real interest in my career.
None of that is left implicit. The consent checkbox names **Law 1581 of 2012**, lists the three
pieces of data that are stored —name, email and questions—, explains what they are for and says how
to ask for deletion: by writing to me from the contact section. Without that box ticked, the server
rejects the request; it is not decoration on the form, it is a validation that returns an error.

It is exactly what I demand of an institution when it processes people's data: **authorization from
the data subject, a declared purpose and a channel to revoke it**. The difference is that here the
data controller is me, and the evidence that the control exists is not a filed policy but the code
and the database migration that anyone can read in the public repository of this CV.

## The email verification code: six digits the database never stores

<!-- seccion: codigo-de-verificacion -->

The email is not taken on trust: it is checked. The server generates a **six-digit** code, sends it
to that address and keeps only its **hash** —SHA-256 computed with a secret that lives only on the
server and with the email itself—, never the code in the clear. That means not even I can read
anyone's code: what the table holds is a sixty-four-character fingerprint that serves to compare and
for nothing else. The code is valid for **ten minutes** and allows **five attempts**; the sixth uses
it up even if it is the right one, and the row disappears on verification, on expiry or on
exhaustion.

Once the email is verified, the server issues a **signed cookie** with HMAC-SHA256, unreachable from
the page's JavaScript, that lasts **thirty days**. There is no password, there is no users table and
there is no identity provider in between: the email is the identity and the code is the proof that
it belongs to whoever typed it. Without that cookie, the chat route answers with an authorization
error and the panel returns the visitor to the gate without losing the question they had already
written.

All of that is **minimization** applied with engineering judgement: keeping the minimum that makes
the control work and nothing that would only serve to know more. For the same reason neither the IP
address nor the browser of whoever asks is recorded, although both would have been free to capture.
A piece of data that is not collected is the only one that afterwards does not have to be protected,
nor audited, nor deleted.

## What the chat conversation log stores, who can read it, and the visitor's privacy

<!-- seccion: registro-y-privacidad-del-visitante -->

Every answered question leaves a row: name, email, language, the question exactly as it was typed,
the full answer, the sources that were cited, the mode in which it was resolved —with the model,
with the local search, or refused for falling outside the topic—, the provider, the model, the
tokens consumed and the milliseconds it took. It is the telemetry I built at Vesting brought home to
my own house, with one difference that changes everything: here the event has a name, and that is
why it needs a notice.

What I use it for, with no detours: to know what I am really asked, which is almost never what one
assumes; to find the question the corpus did not know how to answer and then write the document that
was missing; to watch the cost of each answer against the declared budget; and to know who took an
interest in my work so that I can reply to them. There is no profiling, there is no advertising and
there are no analytics third parties: the log does not leave that database.

The technical control is the same pattern with which I already protected the voting, hardened
because now there really is people's data. Both tables have **row-level security (RLS) turned on and
not a single policy**, which in practice means that the anonymous role the browser talks with cannot
read a single row. All that role can do is three write functions declared **SECURITY DEFINER**, with
permissions granted one by one: store a code, verify and consume it, and log a conversation.
**Reading is exclusively mine**, with the service key, from the database administration panel.
Retention is decided by me, it is declared as a decision and not as an automatism, and the notice
says how to ask for deletion: I do not promise a scheduled purge that does not exist.

## Artificial intelligence governance is a continuation and an extension

<!-- seccion: la-continuacion -->

Artificial intelligence governance does not replace data governance, nor is it a completely separate
subject. It extends it. An AI solution depends on information, knowledge, models, tools, providers,
infrastructure and people. Governing it requires understanding the relationships between all these
components and the consequences of the behavior they produce together.

The initial questions remain: what information the solution uses, where it comes from, who answers
for it, who may access it and what happens when it changes. However, new questions appear: what
function it is authorized to fulfill, what results it may produce, what actions it may execute,
under what conditions it must stop and how a significant change in its behavior will be recognized.

The governed asset stops being only a table or an indicator. It can be a model, a generative
application, an agent, a knowledge source, a tool used by that agent, a set of instructions or an
evaluation. Each component needs identity, purpose, an owner and conditions of use. At Vesting I
learned it with 27 agents in the inventory: the asset to govern was the event of each execution
—request, response, state, cost—, and without identity per agent and per client there was nothing to
govern.

The nature of the result changes too. A piece of data can be incorrect or out of date. An AI system
can, in addition, interpret, infer, recommend or act. That is why its governance must consider not
only the quality of the inputs but also the behavior, the uncertainty, the limits and the possible
effects of the outputs. A predictive delinquency model at Banco Pichincha was governed by its
accuracy and its lineage; an agent that acts is governed, in addition, by what it is allowed to do.

## Autonomy proportional to risk: working at both levels

<!-- seccion: autonomia-y-dos-niveles -->

Autonomy must be designed in proportion to risk. A solution can limit itself to retrieving
information, generating a draft or recommending an action. Only certain tasks should allow direct
execution, especially when the result can be verified, reverted and kept within clearly defined
limits. In the 13 agents of my showcase that decision is written on each sheet: what it does, what
limits it has and what it "never" does; the Power BI Dashboard Builder, for example, has 5
human-approval gates and does not close a run without a person approving the result.

Whoever has worked in data governance has an important base, but not the complete path. The
inventory, the responsibility over the assets, the lineage, the controls and the reviews remain
necessary. AI governance adds impact assessment, system behavior, human oversight, dependence on
providers, observability and life-cycle management.

My experience allows me to work at both levels. I can analyze the data architecture and the semantic
models that sustain the solution —that is what DP-600, earned in December 2024, validates—, but also
understand how the agent interprets the context, uses tools, produces results and distributes
responsibility between the technology and the people, which is what I built at Vesting and what I
keep building in my showcase. The two levels need each other: AI governance without data governance
watches the behavior of a system fed with information that nobody answers for; data governance
without AI governance protects the input and leaves the output free.

## Responsible use of artificial intelligence: leading a strategy under UNE-ISO/IEC 42001:2025

<!-- seccion: estrategia-iso-42001 -->

I currently lead the institutional artificial intelligence strategy of Fundación CTIC following the
principles and requirements of **UNE-ISO/IEC 42001:2025**, the Spanish adoption of the international
standard ISO/IEC 42001 and the edition we base ourselves on. My responsibility consists of helping
the organization not to approach AI as a collection of disconnected initiatives, but as a capability
that needs direction, policies, responsibilities, risk management, evaluation and continuous
improvement.

ISO/IEC 42001 does not indicate which model should be used, nor does it prescribe a single
technological architecture. It provides a management structure so that the organization understands
its context, sets objectives, identifies risks and opportunities, assigns responsibilities and
evaluates the performance of its artificial intelligence management system. It is the same
high-level structure of management systems that I came to know in 2016 with ISO 9001:2015 at
Inglopres: context, leadership, planning, support, operation, evaluation and improvement. The object
changes —quality there, AI systems here—, not the logic.

This perspective matches my training in Industrial Engineering. An organizational capability is not
sustained by technology alone. It needs processes, owners, resources, criteria, controls, evaluation
mechanisms and cumulative learning. The value of the standard lies precisely in turning the
intention to use AI responsibly into a system that can operate and demonstrate its functioning.

I also clearly distinguish the standard from the applicable legal obligations. The standard is
adopted as an international reference to structure the management system, organize responsibilities
and strengthen the management of risks, opportunities and impacts. It does not replace Colombian
legislation —habeas data, Law 1581, the licensing framework in healthcare— nor does it automatically
make any solution developed inside the organization compliant. And I do not claim that the
institution is certified: I claim that the system is built with rigor and that every advance can be
demonstrated.

## Inventory, impact assessment and 23 instruments: the strategy under way

<!-- seccion: inventario-y-los-23-instrumentos -->

The strategy is in a progressive process of structuring and consolidation. This involves defining
institutional instruments, establishing responsibilities, identifying the existing AI capabilities,
evaluating use cases and developing mechanisms to accompany the initiatives throughout their life
cycle.

An initial condition consists of knowing which systems exist. That is why governance requires an
**inventory of AI systems** that makes it possible to identify the purpose of each solution, its
owner, its provider when applicable, information sources, users, level of autonomy, state of
maturity and main risks. It is not possible to govern consistently what the organization cannot
locate or characterize. Then comes the impact assessment of each system —the AIIA, in the terms of
the standard— and the criteria for a use case to move forward, with controls proportional to its
risk.

The management system today comprises **23 instruments** —policies, procedures, matrices, evaluation
criteria and follow-up mechanisms—, of which **8 are finished and 15 under construction**. On it
runs the portfolio: **12 opportunities** for artificial intelligence identified, **7 use cases
formally evaluated**, **3 prioritized** and **2 documented**. The proportion is not a lack of ideas:
it is the filter working, because every opportunity first had to declare what problem it solved, for
whom and with what risk before receiving an architecture.

The strategy must also turn governance into applicable decisions. A use case needs criteria to move
forward, controls proportional to its risk, expected results and a way of evaluating its behavior.
The standard provides the structure; my responsibility consists of helping to turn it into a
practice that can be incorporated into institutional operations. Two clarifications about my scope
at Fundación CTIC: the institutional improvement plans I **design** from the analysis of results
—implementing them belongs to each process—, and where I have indeed implemented a great many
improvements is in my own analytics process, which is the one I govern from beginning to end.

## The ISO 42001 expert agent: what it does and where it gets every statement from

<!-- seccion: iso-42001 -->

I built an agent specialized in ISO/IEC 42001, the **ISO 42001 Expert**, and published it in my
showcase as one of the 13 agents, as evidence of my way of working with generative artificial
intelligence and normative knowledge.

The agent does not use the model's general memory as the authority on the standard. Its answers must
be supported by an authorized corpus, and every normative statement must be related to the
corresponding location within the source: **it cites the clause and the page**. When the available
content does not allow a conclusion to be sustained, the system must **declare the gap**. This rule
protects a fundamental distinction: the model can interpret and explain, but it cannot invent the
normative basis. The fluency of an answer does not grant it authority. Reliability depends on the
retrieved evidence and on the verifiable relationship between that evidence and the generated
explanation.

What it has inside is measurable. The corpus synthesizes the **38 controls of Annex A** of the
standard, each with its guidance and the artifact that implements it, and the statement of
applicability is always delivered with the 38 rows populated, never partial without saying so. It
knows the **24 carrier documents** that an auditor asks for in the documentary phase of a
certification. It works with **9 conversational commands** —instantiate, intake, gap, plan,
management, drill, surveillance, models and opinion— and with a checklist of **14 gates**, ten
foundational and four born from real defects found while verifying it. And a fact that explains why
it exists: the leading commercial AI-governance platform declares that it covers close to 45% of the
path to certification; the rest is human judgment, and that is the hole the agent helps to fill
without replacing the person.

The agent also keeps the verification date of the sources. A citation can correctly correspond to a
document and still lose validity if the content was replaced, modified or withdrawn. Currency must
be treated as a property of knowledge and not as a permanent assumption; that is why every opinion
stamps the date on which it was verified that the source was still in force, and a regulatory watch
tracks changes in the standard, the law and the models.

## The ISO 42001 expert agent: what it does not do, and how I use it with the 23 instruments

<!-- seccion: iso-42001-limites -->

Its function is not to declare by itself that an organization complies with the standard, to
substitute for an audit or to issue certifications. It can help locate requirements, organize
questions, identify missing information and support the preparation of analyses, but institutional
conclusions need professional evaluation, evidence and explicit human responsibilities. On its
technical sheet those limits are written as what the agent "never" does, and the BPMN diagram of its
process shows where the consultant decides and where the client organization decides: the agent
stamps, diagnoses and writes drafts; the people approve.

This design demonstrates why an expert agent cannot be reduced to putting a document into a RAG. It
also needs to delimit its function, preserve metadata, control the citations, recognize gaps and
communicate clearly what kind of conclusion it is authorized to produce. And it needs discipline at
the source: the corpus contains paraphrases with clause and page, never the literal wording of the
standard, and the PDFs of the standard are kept out of version control by design, with a check that
verifies it.

Industrial Design brings an important dimension to this solution. Normative knowledge tends to be
dense and hard to navigate. The agent must reduce the friction of access without hiding the
complexity or replacing the source. Its interface must make it possible to understand the answer and
return to the basis that supports it.

It is also the tool with which I review, one by one, the 23 instruments of the Fundación CTIC
management system against the requirements of the standard: which requirement each instrument
covers, what it lacks and what evidence it would have to produce. The agent does not decide whether
an instrument is finished; it tells me which clause of the standard demands what from it, with the
page, and the decision remains mine and the sub-directorates'. The central rule is simple: no
opinion should come solely from the model's memory. If the system cannot demonstrate the origin of a
statement, it must not present it with normative authority.

## Documentation: how I document what I do, with governance applied to my own process

<!-- seccion: gobierno-de-mi-proceso -->

I apply these principles to my own pipeline of applications, agents, research pieces and dashboards:
the 32 pieces of the showcase. The purpose is to demonstrate that governance is not a set of
recommendations aimed at others, but a discipline I use to control my own work.

No application moves forward without two documented decisions. The first confirms its priority
against other initiatives. The second establishes the product vision, its purpose, the expected
capabilities and the limits within which it must be built. The 6 published applications have both,
written before the first sprint.

No cycle is considered closed without a summary that preserves the decisions made, the tests
executed, the changes against the initial vision, the problems found and the pending work. This
memory reduces dependence on informal knowledge and allows each iteration to start from the previous
learning. Architecture decisions that were not anticipated are kept in numbered decision records,
with their context and the alternative discarded, so that a year from now it is known why what was
chosen was chosen.

Every persistent output produced by a model must comply with a verifiable structure: a schema that
is validated before saving. The system cannot treat as a valid asset any generated content merely
because it has a convincing form. Schemas, validators and deterministic controls protect what can be
checked through explicit rules. The chat of this CV forces the rule to be stated precisely: since
September 2026 it does archive the model's answer as it stands, as text, in the conversation log,
because the purpose of that log is to know what was answered. What remains forbidden is what really
mattered: no output of the model is interpreted, executed, or turned into an asset that another
decision of the system depends on. A text that is stored in order to be read is not the same as a
text that is obeyed.

Incorporating generative artificial intelligence also demands a justified decision: **code first**.
Before using a model, I must establish which characteristic of the problem requires interpretation,
generation, contextual retrieval or flexible coordination, and why a deterministic solution is not
sufficient. AI is an accent with deterministic backup, never the backbone.

## States, provenance and the rule that was written before the failure

<!-- seccion: estados-y-procedencia -->

Controls must demonstrate their capacity to fail. A test that always shows green but has never been
observed detecting the deviation it was designed for does not yet demonstrate that it protects the
system. That is why every control needs a verifiable relationship with a concrete risk or condition,
and in my pipeline the rule is literal: a new control is born with its demonstration in red,
recorded in the sprint log, in the same change that introduces it. The origin of that rule and its
precedent live in the pipeline document.

I also keep differentiated states for the pieces. An exploration, a prototype, a published solution
and a capability operated in a sustained manner do not represent the same level of maturity. This
distinction avoids presenting intentions as results and protects the credibility of the portfolio:
the Google Cloud exploration appears as an exploration, with no horizon and no real use declared,
and the 6 applications appear as operated because they reached their minimum product and keep
evolving.

And every figure declares its provenance. The technical sheets of the 32 pieces label every number
as **measured**, **calculated**, **declared** or **estimated**, and the same criterion rules this
corpus: the "close to 60%" less effort at Fundación CTIC carries its "close to" because it is an
estimate, and the 42 products or the 23 instruments do not carry it because they are counted.

These rules were written before the failures made them necessary. That is one of the principles I
value most in governance: anticipating the conditions under which decisions will be made, instead of
improvising them when there is already pressure to justify a result.

## Governance is demonstrated through the effectiveness of its controls

<!-- seccion: efectividad-de-controles -->

I do not consider a control implemented merely because a policy, a procedure or a technical
configuration exists. The control must demonstrate that it can prevent, detect, contain or make
visible the condition it was designed for.

This distinction matters because an organization can accumulate documents, matrices and approvals
without developing a real capacity to intervene when a deviation appears. Governance is not measured
by the number of controls declared, but by the verifiable relationship between each risk, the
mechanism used to manage it and the evidence that allows its effectiveness to be evaluated. With 23
instruments in the Fundación CTIC management system, the question I ask of each one is not whether
it exists, but which deviation it would detect and what evidence it would leave when detecting it.

Every control must answer concrete questions: what condition it seeks to manage, which component or
person executes it, what evidence it produces, how often it is reviewed and what happens when it
fails. Without these answers, the control can become a general expectation that is hard to apply and
even harder to audit.

In data, a quality control must make an inconsistency visible before it reaches a decision: the
thresholds of the quality rules in healthcare trigger a review, not a report. An access control must
prevent or record an unauthorized use. A change rule must make it possible to identify which
products depend on a modified definition. In every case, the evidence must correspond to the purpose
of the control. At Cafam, in 2021, the control was a permanent inventory validation of the 80-20
medicines between the WMS and the source system: at the start none of them matched, and the evidence
that the control worked was the list of differences that kept getting closed, not a minute saying
that it had been validated.

## Controls in artificial intelligence and throughout the life cycle

<!-- seccion: controles-en-ia -->

In artificial intelligence, effectiveness also requires observing the behavior of the solution. A
control can verify whether the system used an authorized source, respected a limit of action,
requested human approval or declared insufficient information. There must also be a defined response
when the behavior does not correspond to what is expected. At Vesting, that control was real-time
monitoring: up to 23 agents watched at once, with the event of each execution, and an exception that
did not show up in the monitoring was, by definition, a control that was not working.

Controls need to be evaluated throughout the life cycle because their effectiveness can change. A
new source, a provider update, a modification of the model or an unforeseen use can make a measure
that was previously adequate insufficient. Governing requires keeping the capacity to review and
strengthen the controls as the system evolves. It is the reason why the ISO 42001 Expert stamps the
verification date of each source and why its regulatory watch tracks changes in the standard, the
law and the models: a control that was sufficient can stop being so without anyone changing a line.

This way of thinking connects my experience in management systems, data quality and agentic
architecture. A control that has never demonstrated that it can recognize a deviation does not yet
offer sufficient evidence of protection. That is why, in my own process, I apply an explicit rule:
if a control has never been seen in red against the condition it must detect, it is not yet fully
demonstrated. And its sister rule: a control that never executed is not a control either; a check
that was skipped because another one failed before is not green, even if the report shows it without
an alarm.

## Technical governance and institutional governance must meet

<!-- seccion: gobierno-tecnico-e-institucional -->

Artificial intelligence governance fails when policies and architecture are developed separately. A
policy can establish transparency, oversight or traceability, but those principles need technical
mechanisms capable of producing the corresponding evidence.

In the same way, an architecture can incorporate logs, permissions and evaluations without
responding to a clearly defined institutional purpose. Technical controls do not by themselves
determine which risk should be accepted, which use is legitimate or who has the authority to approve
an initiative.

My profile allows me to work at that intersection. I understand how data, semantic models,
applications and agents are structured, and also how they must connect with objectives,
responsibilities, risks, policies and decision criteria. At Fundación CTIC the intersection has a
concrete shape: the line with the Planning Directorate and the sub-directorates of technology,
information management and quality is where a policy becomes an instrument, and an instrument
becomes something a dashboard or an agent can demonstrate.

DP-600, earned in December 2024, provides the depth needed to govern the analytics assets that
sustain the solution: sources, transformations, warehouses, semantic models, measures and
experiences in Power BI. AI-103 strengthens the understanding of the applications and agents that
use those assets. AI-300 broadens the discipline needed to deploy, evaluate, observe and maintain
the solutions throughout their operational life; both tracks have been in progress since July 2026.

This combination allows me to formulate an institutional question and follow it through to its
technical implications. If a policy requires that a recommendation be traceable, I can analyze which
events must be preserved, which source must be identified and which component needs to record the
decision. If the architecture reveals a limitation, I can translate it into risk, responsibility and
condition of use. Effective governance appears when the organization can relate every principle to a
control, every control to evidence and every piece of evidence to a responsibility. My goal is to
build precisely that continuity.

## Governing third-party solutions

<!-- seccion: gobierno-de-terceros -->

An artificial intelligence strategy cannot be limited to the solutions developed internally. The
platforms, applications, models and agents provided by third parties are also part of the
institutional capability and need evaluation, responsibilities and follow-up.

Evaluating a provider is not only about comparing functionalities, costs or implementation times. It
is also necessary to understand what information the solution will use, where it will be processed,
which dependencies it introduces, how it manages changes and what evidence it provides about its
behavior. I learned it before AI, with a third-party system of another kind: at Cafam, in 2020, the
implementation of Oracle WMS Cloud —a product Oracle had just bought— was tested for months with 6
people from the provider inside the team of 20, and the differences between what the system did and
what the warehouse needed were resolved by configuration, by process change or by technical
intervention from the provider, each with its owner.

The organization must know which responsibilities the provider keeps and which remain internal.
Acquiring a technology does not automatically transfer responsibility for its use, its effects or
the decisions made with its results. Conditions must also be established to supervise, restrict,
replace or withdraw the solution. A dependency becomes especially risky when the organization cannot
recover its information, understand relevant changes or continue a critical process without the
provider.

Updates need particular attention. An external service can modify its model, its policies, its
limits or its behavior without the organization having directly changed its own architecture.
Governance must determine how those changes will be known and when they will require a new
evaluation. In my own pieces the answer is architectural: the chat of this CV runs on a model
provider that can be switched by configuration, with an explicit monthly budget and a fallback to
local search if the provider fails, so that no third party is a single point of failure for the
visitor. This perspective connects with my work in enterprise AI architecture. The goal is not to
eliminate external dependencies, but to know them, manage them and prevent an institutional
capability from resting on assumptions that nobody has documented or can control.

## Governance needs to cut across the organization

<!-- seccion: lo-transversal -->

Governance generates little value if it stays within a single team. Data, models and intelligent
solutions cut across processes, areas and responsibilities, so their management requires
coordination among people who do not necessarily report to the same authority.

I have worked on cross-cutting initiatives where collaboration could not be obtained through a
hierarchical instruction. In the transport system, at C&M Consultores, I coordinated working
sessions with the management of the SITP concessionaires —companies with their own contracts and
interests— to define improvement strategies, and the indicators rose by 25%. At Cafam I articulated
a mixed team of 20 people between the organization and the WMS provider, 14 and 6. At Banco
Pichincha I co-led a governance initiative that required integrating technical and operational
perspectives. And at Fundación CTIC the AI strategy cuts across 15 processes with 20 leaders who do
not report to me.

These experiences taught me that a cross-cutting initiative does not move forward merely because a
standard, a correct architecture or a sponsor exists. Each area needs to understand which decision
will improve, which risk will be reduced, which responsibility it will keep and which effort it will
have to take on.

That is why I do not start the conversation by laying out all the controls that must be met. I start
by understanding each actor's problem, the decisions they need to make and the evidence they
currently cannot obtain. Governance gains legitimacy when it helps solve a real need and not when it
is presented exclusively as an external obligation. This does not mean negotiating essential
principles or weakening controls to ease adoption. It means designing the implementation so that
people understand the purpose, can question the mechanisms and recognize the relationship between
the control and the risk it seeks to manage.

Top management fulfills an indispensable function because some conflicts cannot be resolved through
technical agreements alone. Priorities, resources, risk levels and responsibilities need
institutional direction. My function consists of providing the evidence and the alternatives needed
so that those decisions can be made with clarity. Governance becomes sustainable when it stops
depending on an individual's capacity to persuade and becomes embedded in roles, processes,
criteria, systems and review mechanisms. Cross-cutting influence starts the change; the management
system makes it possible to keep it.

## Competence demonstrated through training and experience

<!-- seccion: experiencia-y-formacion -->

Some strategy, architecture and artificial intelligence governance positions set a specialization or
a master's degree as a preferred requirement. My academic training consists of Industrial
Engineering with an emphasis in Analytical Data Intelligence and studies in Industrial Design, both
at the Pontificia Universidad Javeriana between 2009 and 2016, complemented by five earned
credentials —Microsoft's DP-600 and four from IBM in data science, Python, SQL and R— and two tracks
in progress since July 2026, AI-103 and AI-300.

I do not present experience as a universal substitute for advanced education, nor do I dismiss the
value of a graduate degree. A specialization or master's degree can provide guided research,
conceptual depth and a formal learning structure. However, when an organization admits equivalence
between education and experience, my track record allows a direct evaluation of the competences that
requirement seeks to represent.

Verifiable evidence adds to the professional experience. DP-600, earned in December 2024, formally
validates my depth in Microsoft Fabric, Power BI and semantic models. The four IBM credentials back
my base in data science, Python, SQL and R. My public portfolio makes it possible to examine 6
applications, 13 agents, 7 research pieces and 6 dashboards —32 pieces— with their tests, their
controls and their technical sheets; and among the agents there is one that deals precisely with the
standard I implement.

If a position sets a graduate degree as a formal and irreplaceable requirement, I acknowledge it
with transparency. When the graduate degree works as an indicator of structured thinking, technical
depth and the capacity to solve complex problems, my track record allows those qualities to be
examined through demonstrable results and responsibilities.

## Ten years in the responsibilities I govern today

<!-- seccion: experiencia-en-lo-que-gobierno -->

For ten years, since August 2016, I have developed capabilities related to processes, data,
analytics platforms, predictive models, applications, agents and governance. I have co-led data
governance in banking, at Banco Pichincha; designed the data and observability architecture for an
agent platform with 12 clients, at Vesting; structured an eleven-stage process used as the framework
to build 27 agents; and I currently lead an institutional artificial intelligence strategy based on
UNE-ISO/IEC 42001:2025, with 23 instruments, at Fundación CTIC.

This experience is not limited to incidental exposure to those domains. I have worked in the
responsibilities I need to govern: I built pipelines and semantic models before establishing
criteria on analytics assets; I designed observability before formulating requirements on
monitoring; and I developed agents and harnesses —the 13 in my showcase, with their gates and their
sheets— before taking on strategic responsibilities over their governance. I know what it costs to
meet a control because I have had to meet it from the other side.

This combination allows me to avoid two extremes: a governance that is conceptually correct but hard
to implement, and an architecture that is technically sophisticated but ignores institutional risks,
impacts and responsibilities.

When a position allows education and experience to be valued together, I present a solid combination
of university training, specialized credentials, directly related professional practice, current
leadership and public evidence. I do not ask the organization to presuppose my competences. I
provide concrete elements to evaluate them.

## What sets my governance approach apart: the data, the solution and the organization

<!-- seccion: enfoque-de-gobierno -->

My governance approach integrates three levels that are frequently addressed separately: the data,
the intelligent solution and the organization that answers for its effects.

At the data level, I work with meaning, provenance, quality, access, transformation and change. At
the solution level, I bring in purpose, behavior, sources, tools, autonomy, evaluation and
observability. At the institutional level, I connect those capabilities with responsibilities,
risks, policies, third parties, decisions and continuous improvement. Each level has its case in my
track record: the data at Banco Pichincha and in the data quality of Fundación CTIC, the solution in
the 27 agents at Vesting and the 13 in my showcase, the organization in the 23 instruments of the
management system.

Industrial Engineering provides the systemic vision needed to understand how these levels influence
each other. A control can be correct in isolation and fail within the complete flow. A policy can be
well written and produce unnecessary friction if it ignores the process. A solution can optimize an
activity and degrade the overall result.

Industrial Design keeps the people affected by the system visible. Governance must not be limited to
protecting the organization. It must also consider whether people understand when they are
interacting with an AI solution, what information it uses, what limits it has and how they can
request review or intervention.

My depth in Power BI and semantic models allows me to turn institutional definitions into reusable
analytics assets. My experience with agents allows me to understand how those definitions are
transformed into context, tools and behavior. My current responsibility allows me to connect both
levels with a management strategy.

## Governing to do more, not to do less

<!-- seccion: gobernar-para-hacer-mas -->

I do not understand governance as an activity meant to stop innovation. I understand it as the
institutional architecture that makes it possible to innovate sustainably. Its function is to make
decisions explicit, preserve evidence, distribute responsibilities and provide mechanisms to
intervene when the data, the technology, the risks or the context change.

Nor do I consider an initiative governed merely because it meets a set of controls. Governance must
protect the purpose for which the solution was authorized and make it possible to evaluate whether
it keeps generating the expected value. A capability that has stopped being useful, that operates
outside its context or that introduces a disproportionate risk needs to be reviewed, restricted or
withdrawn, even if it technically keeps working. In my showcase I have done it: in Dash Agent AI,
one of the 6 applications, a feature was withdrawn when the evidence showed 83 out-of-context
suggestions, and the withdrawal is told on its sheet, not hidden.

The organization does not need to choose between speed and control as if they were incompatible
goals. It needs controls that are proportional, applicable and designed inside the processes.
Innovation without governance accumulates invisible risks. Governance without technical
understanding accumulates documents that nobody can turn into practice. At Fundación CTIC, 12
opportunities and 7 evaluated cases in a little over a year, with 8 instruments finished and 15
under construction, is what a governance that opens the way instead of closing it produces.

My contribution consists of building the bridge between both extremes: understanding the technology
well enough to design applicable controls, and understanding the organization well enough to ensure
that those controls protect relevant decisions, people and results. I do not seek to govern
artificial intelligence to limit what can be done, but so that the organization can do more, with
greater clarity about what it must protect and about the evidence it needs to preserve.
