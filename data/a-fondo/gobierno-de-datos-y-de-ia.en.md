---
slug: gobierno-de-datos-y-de-ia
titulo: "Data governance and AI governance"
resumen: "Governance set up three times —co-led in banking, designed from scratch for 12 clients at an agent startup, and today in healthcare under UNE-ISO/IEC 42001:2025 with 23 instruments— plus the ISO 42001 expert agent and the rules with which I govern my own pipeline."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
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
  a `CONFIRMAR: what is missing` marker in square brackets, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

## Three governance experiences, three different problems

<!-- seccion: tres-veces -->

I have taken on **data governance** and artificial intelligence governance responsibilities in
three different contexts, and in each one the problem was a different one:

| Where                          | Scope                                        | The problem that had to be governed                                    |
| ------------------------------ | -------------------------------------------- | ---------------------------------------------------------------------- |
| **Banco Pichincha**, 2023      | I co-led the governance initiative           | trust: consistent definitions, an owner per metric, access by purpose |
| **Vesting**, 2023–2025         | I designed the governance from scratch       | 12 clients on one platform: identity, ownership, isolation and traceability from the first event |
| **Fundación CTIC**, since 2025 | I manage quality and lead the AI strategy    | healthcare: data that describes people, authorized purpose and an AI management system |

In banking I learned that a platform is not governed with permissions: it needs shared metrics,
consistent semantic models and **lineage** back to the sources; security protects access and
semantics protects interpretation. At Vesting the governed asset stopped being a table and became
the event of an intelligent system —request, response, state, cost—, isolated per client in
**separate workspaces**. At CTIC governance connects quality, confidentiality and purpose with the
institutional management of AI.

Governance does not travel as a template. The principles remain; the controls, the **roles** and
the adoption mechanisms respond to the purpose, the risks and the maturity of each organization.

## What governing a piece of data means: traceability of information

<!-- seccion: que-es-gobernar -->

Governing a piece of data means being able to answer five questions about it: where it comes from
and what rules transformed it (**lineage**), what it means and who answers for that definition
(**roles**), who may use it and for what (access **policies** by purpose), whether it is complete,
timely and consistent enough for the decision that needs it (quality in relation to use), and what
evidence demonstrates that the controls work.

With personal data, the questions have law behind them. In Colombia, **habeas data** and **Law
1581** set what may be processed, for what purpose and with what authorization; in healthcare,
additionally, **anonymization** when the analysis does not need to identify anyone. At CTIC the
quality rules —completeness, duplicates, reconciliation between sources, thresholds that trigger
review— were designed by understanding the process that produces each piece of data and the
consequence of a mistaken interpretation.

Governing is not documenting definitions nobody consults. It is having the right information reach
the right people under clear conditions, and being able to demonstrate it.

## Responsible use of artificial intelligence: leading a strategy under UNE-ISO/IEC 42001:2025

<!-- seccion: estrategia-iso-42001 -->

I lead the institutional AI strategy of Fundación CTIC on **UNE-ISO/IEC 42001:2025**, the Spanish
adoption of **ISO/IEC 42001**: AI not as a collection of initiatives but as a capability that needs
direction, policies, responsibilities, risk management, evaluation and continuous improvement. The
standard prescribes neither a model nor an architecture; it gives the same high-level structure as
**ISO 9001** —which I applied in 2016 at Inglopres— so that the organization understands its
context, sets objectives, identifies risks and opportunities, assigns responsibilities and
evaluates its management system.

The first thing is to know what systems exist: an **inventory of AI systems** with purpose, owner,
provider, sources, users, level of autonomy, maturity and risks. You do not govern what you cannot
locate. Then, the impact assessment of each system —the **AIIA**— and the criteria for a use case
to move forward, with controls proportional to its risk.

The management system today comprises **23 instruments** —policies, procedures, matrices,
evaluation criteria and follow-up mechanisms—, **8 finished and 15 under construction**. The
standard is adopted as an international reference; the legal obligations come from the Colombian
legal order, and no solution is compliant merely because it exists within the system. I do not
claim that the institution is certified: I claim that the system is being built with rigor and
that every advance can be demonstrated. The state of the strategy, with its 12 opportunities and
7 evaluated cases, is in the CTIC document.

## The ISO 42001 expert agent

<!-- seccion: iso-42001 -->

I built the **ISO 42001 Expert**, one of the 13 agents in my showcase, as evidence of how I work
with generative AI and normative knowledge. It does not use the model's memory as the authority on
the standard: every normative claim is supported by an authorized corpus and **cites the clause
and the page**; when the corpus does not allow a conclusion to be sustained, it **declares the
gap**.

It keeps the verification date of its sources, because a citation can be correct and have lost its
validity. And it bounds its function: it locates requirements, organizes questions, identifies
missing information and supports the preparation of analyses; it does not rule on compliance, does
not replace an audit, does not certify. Institutional conclusions need professional evaluation,
evidence and human responsibility.

It is also the tool with which I review each of the 23 instruments against the requirements of
the standard. The central rule is simple: no ruling comes solely from the model's memory.

## Documentation: how I document what I do, with governance applied to my own process

<!-- seccion: gobierno-de-mi-proceso -->

I apply the same principles to my pipeline —the 32 pieces in the showcase: applications, agents,
research and dashboards—, so that governance is not advice for others:

- no application moves forward without two documented decisions: its priority and its vision;
- no cycle closes without a summary with decisions, tests, deviations and pending items;
- every persistent output of a model passes through a verifiable schema before being saved;
- incorporating generative AI requires a justified decision: code first;
- every control is demonstrated failing before it is trusted;
- every piece declares its state —exploration, prototype, published, operated— and every figure its
  provenance: measured, calculated, declared or estimated.

These rules were written before failures made them necessary. Anticipating the conditions of a
decision, instead of improvising them under pressure, is the principle I value most in governance.
The rules live in the pipeline document.

## Governance needs to cut across the organization

<!-- seccion: lo-transversal -->

Governance generates little value inside a single team. I have worked three times on cross-cutting
initiatives where collaboration could not be ordered: the working tables with the management of
the SITP concessionaires, the mixed team of 20 people between Cafam and the WMS vendor, and the
co-led initiative at Banco Pichincha between technical and operational perspectives.

I do not start by laying out the controls. I start with each actor's problem, the decision they
need and the evidence they cannot obtain today: governance gains legitimacy when it solves a real
need. That does not weaken the principles; it designs the implementation so they are understood.
And senior management resolves what a technical agreement cannot —priorities, resources, risk
levels—; my role is to bring it the evidence and the alternatives.

Governance becomes sustainable when it stops depending on persuasion and settles into roles,
processes, criteria and reviews. Influence starts the change; the management system keeps it.

## Competence demonstrated through education and experience

<!-- seccion: experiencia-y-formacion -->

Some AI strategy and governance positions ask for a graduate degree. My education is Industrial
Engineering and Industrial Design at Javeriana, five earned credentials —the DP-600 and four from
IBM— and two tracks in progress, AI-103 and AI-300. I do not present experience as a universal
substitute for advanced education: when an organization admits equivalence, my track record allows
a direct evaluation of what that requirement seeks to represent.

Ten years of experience; governance co-led in banking; the data and observability architecture of
an agent platform with 12 clients; the process with which 27 agents were built; and today the AI
strategy of a healthcare institution under UNE-ISO/IEC 42001:2025. I built pipelines and semantic
models before setting criteria on analytical assets, designed observability before demanding
follow-up, and developed agents before governing them. If the graduate degree is a formal and
irreplaceable requirement, I acknowledge it; if it is an indicator of structured thinking and
technical depth, there are results to examine.
