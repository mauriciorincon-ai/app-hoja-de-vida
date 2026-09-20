---
slug: fundacion-ctic
titulo: "Fundación CTIC — analytics in healthcare (2025–today)"
resumen: "My current role: 42 analytical products in Power BI for 20 leaders of 15 processes, data governance and quality in healthcare, and the institutional AI strategy under UNE-ISO/IEC 42001:2025 with 23 instruments, 12 opportunities and 7 cases evaluated."
estado: aprobado
ancla: "/proyectos/fundacion-ctic"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What does Henry do at Fundación CTIC?"
  - "What experience does he have with healthcare data?"
  - "How does Henry lead the artificial intelligence strategy at Fundación CTIC?"
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
What is different about data in healthcare, how you are setting up
institutional data governance, which dashboards the clinical leaders use.
Remember: NO patient data or sensitive internal information. -->

## The current role: where I work today

<!-- seccion: el-rol-actual -->

Since **March 2025** I have worked as an Analytics Professional at **Fundación CTIC**, an
institution in the **healthcare** sector. It is the most demanding context I have worked in for
information quality, security, privacy, traceability and governance: behind every data point
there is a person and a care process.

I have two complementary responsibilities. The first: building the analytical capacity in
**Power BI** that integrates information, models administrative and clinical processes and puts
reliable indicators in the hands of those who decide. The second: **leading the institutional
artificial intelligence strategy**, with the implementation of the AI management system. I work
in direct line with the Planning Directorate and with the sub-directorates of technology,
information management and quality.

Everything I tell about this experience keeps one non-negotiable limit: I do not expose patient
data, clinical information or internal knowledge whose disclosure would affect people or the
institution. The figures are aggregated. That does not weaken the narrative: it explains the
method and respects what it protects.

## Analytics by process, for two audiences

<!-- seccion: analitica-por-procesos -->

I have built **42 analytical products** in Power BI —among them **23 dashboards**— used today by
**20 leaders** of **15** administrative and clinical **processes** and around **75 users**. The
two audiences work on the same organization but do not ask the same questions: administrative
management looks at resources, capacity and timeliness; clinical management looks at the care
process and its **quality indicators**, the ones an **IPS** reports and the ones **licensing**
requires.

The design decision comes from industrial engineering: organizing the dashboards **by process,
not by area**. An area can show favorable indicators while the process that runs through it
accumulates waits. That is why the semantic models represent the process's entities,
relationships and events, and the indicators run along the flow: outcome indicators say what
happened; intermediate ones explain how and where to intervene.

An indicator keeps **a single institutional definition**, even if it is presented with different
levels of detail according to the responsibility of whoever looks at it. The semantic model
separates the definition of the metric from its presentation, and each product distinguishes
fact, estimate and recommendation.

I have **designed improvement plans** from those analyses for the process owners, who are the
ones who execute them: analytics does not replace responsibility for the process. What I did
implement, and a lot, were improvements in my own process: the information preparation that used
to be done by hand was reduced by **close to 60%** in effort, and the **10 analysis plans** the
processes follow today come from a single governed base.

## Data governance and quality in healthcare

<!-- seccion: gobierno-y-calidad -->

I manage institutional **data governance** —cleansing, integration and standardization—, aligned
with the Foundation's policies and with personal data protection: **habeas data**, **Law 1581**
and **anonymization** whenever an analysis does not need to identify anyone.

The quality rules were designed by understanding the process that produces each data point and
the consequence of a wrong interpretation:

- **completeness** of the fields a decision needs;
- **duplicates** between records that represent the same person or the same event;
- **reconciliation** between sources that should say the same thing;
- **thresholds** that trigger review before a value reaches an indicator.

Quality is evaluated in relation to use: a value can comply with its format and still not be
complete, timely or consistent enough for a decision. And each product keeps traceability from
the indicator to the sources and rules, so that trust does not depend on whoever built the
dashboard.

In healthcare, governing data and governing artificial intelligence are the same responsibility:
an application or an agent should not use information just because it can access it. There must
be an authorized purpose, a clear need and an identifiable responsibility. How this governance
compares with banking's and the startup's is in the governance document.

## Leading the institutional artificial intelligence strategy

<!-- seccion: estrategia-institucional-de-ia -->

I lead the institutional AI strategy with one purpose: turning potentially isolated initiatives
into a coherent, governable and sustainable organizational capability. I do not start from the
available technology but from the problems, decisions and capabilities the institution needs to
strengthen.

Not every problem needs AI and not every AI initiative needs an agent. Many needs are better
solved with a process improvement, an analytical product or conventional automation. That is why
the strategy works as a **governed portfolio**: each proposal states the problem, the users, the
information required, the expected benefit and how a satisfactory result will be recognized; and
it is prioritized by value, feasibility, risk and dependence on third parties.

To date, the strategy has made it possible to identify **12 AI opportunities**, formally evaluate
**7 use cases** and prioritize **3 initiatives** for validation or progressive development; **2**
of them already have a documented purpose, owner, expected results and evaluation criteria.
Stopping a case after invalidating its hypothesis is not a failure: avoiding an unfounded
investment is value too.

## The AI management system we are building

<!-- seccion: sistema-de-gestion-de-ia -->

The strategy is structured on **UNE-ISO/IEC 42001:2025**, the Spanish adoption of ISO/IEC
42001: AI not as a set of projects but as a capability that needs policies, roles, risk
assessment, impact assessment of the systems —the **AIIA**—, an **inventory of AI systems** and
lifecycle management. The legal obligations come from the Colombian legal system; the standard
provides the management framework. The two complement each other and are not confused.

My experience with quality management systems was the foundation: ISO 9001, in 2016, taught me
that it is not enough to do an activity well; you have to be able to demonstrate it. ISO/IEC
42001 shares the same high-level structure, and implementation starts the same way: with the
context, the interested parties, the roles and the responsibilities. Not all AI decisions belong
to the technical team: the business answers for the purpose, and risk management enters from the
design.

The management system today comprises **23 institutional instruments** —policies, procedures,
evaluation matrices, criteria for use cases and follow-up mechanisms—: **8 finished and 15 under
construction**. To sustain that work I built the **ISO 42001 expert agent** I publish in the
showcase: it answers with the standard in hand and serves to review each instrument against its
requirements.

I do not claim that the institution is certified or that the system is complete: my
responsibility is to build it with rigor and to be able to demonstrate every step forward.

## Scope and progress of the institutional capability

<!-- seccion: alcance-y-avance -->

| Dimension         | Metric                                     |            Value |
| ----------------- | ------------------------------------------ | ---------------: |
| Analytics         | analytical products in use or follow-up    |           **42** |
| Analytics         | dashboards                                 |           **23** |
| Analytics         | leaders supported · processes              |  **20** · **15** |
| Analytics         | users                                      |          **~75** |
| Analytics         | effort reduction in preparation            | **close to 60%** |
| Analytics         | analysis plans in follow-up                |           **10** |
| AI                | opportunities identified                   |           **12** |
| AI                | use cases formally evaluated               |            **7** |
| AI                | initiatives prioritized · documented       |    **3** · **2** |
| Management system | instruments: finished · under construction |   **8** · **15** |

The figures are aggregated and respect the institution's confidentiality. They are measured to
demonstrate the evolution of the capability, not to disclose sensitive information.

## What this role brings together

<!-- seccion: lo-que-reune -->

At Fundación CTIC the capabilities of the whole trajectory converge in a broader responsibility:
it is no longer building an analytical product or an agent, but leading the way a healthcare
institution incorporates artificial intelligence responsibly. My purpose is not for the
organization to use more AI: it is for it to use the right AI, for relevant problems, on
authorized and reliable information, within explicit limits.
