---
slug: como-aprendo
titulo: "How I learn"
resumen: "The argument, with measurements: the DP-600 in five months on a Fabric with less than a year on the market, Codex, Antigravity and Claude Code within a month of their release, this site in eight sprints since July 2026, and 32 public pieces with their tests and coverage."
estado: aprobado
ancla: "#certificaciones"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "How fast does Henry learn a new technology?"
  - "What evidence does Henry have that he learns fast?"
  - "How long did it take him to earn the Fabric certification?"
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

## Why this document exists and how I decide what to learn

<!-- seccion: por-que-existe-y-como-decido -->

A résumé is a snapshot, and in data and AI the snapshot ages in months. My value cannot depend
only on the list of tools I have already used: it has to show that I take on what I do not yet
know, in depth and within measurable timeframes. This document does not claim that I learn fast;
it shows the dates.

I decide what to learn with four industrial-engineering criteria —resources are limited and are
allocated by value, constraint and result—:

- **Concrete need.** The DP-600 went along with building the Vesting platform; the AI-103 goes
  along with the agents; the AI-300, with their operation.
- **Permanence.** The principles of architecture, modeling, evaluation and security last longer
  than the tool that implements them.
- **Evidence.** A path deserves priority if it ends in a certification, an application, an
  architecture, a research piece or a component that someone can examine.
- **Opportunity cost.** Every new capability competes with products and responsibilities in progress.

## The evidence from the certifications

<!-- seccion: evidencia-certificaciones -->

I hold **five earned credentials** —the **DP-600** for Microsoft Fabric and four from IBM— and
two paths in progress, AI-103 and AI-300, since July 2026. The full table is in the
certifications document; what matters here is the pace.

The case that measures it best is the DP-600. I prepared it between **July and November 2024**,
five months, while working full time at Vesting, and I earned it in December. Microsoft Fabric
had at that point been in general availability for **less than a year**: there were no mature
courses or consolidated community, and the documentation changed every week. I certified on the
same platform on which I was building the startup's data ecosystem, and that is the difference
between studying and formalizing what is already being applied.

The four from IBM follow the same pattern: three in 2022 —the Professional Certificate in Data
Science, Python and SQL, between May and November— in the months I devoted to studying between
two jobs, and R in 2024, in parallel with the DP-600. Certifications prove discipline and command
of a framework; I do not use them as a substitute for experience, but as its formalization.

## The timeframes, with dates

<!-- seccion: los-plazos -->

The last times I learned something from scratch, and how long it took me:

| What                                 | Since               | Timeframe                        | Result                                                       |
| ------------------------------------ | ------------------- | -------------------------------- | ------------------------------------------------------------ |
| Microsoft Fabric                     | August 2023         | 5 months of study (Jul–Nov 2024) | DP-600 in December 2024, Vesting platform operating          |
| Next.js and the application pipeline | July 2026           | 8 sprints                        | this site, CV Viva, with its CI, its tests and its ADRs      |
| AI-103 and AI-300                    | July 2026           | 21 and 10 modules to date        | two paths in progress, with the AI-103 Super Guide published |
| Codex, Antigravity and Claude Code   | since their release | about a month each               | the pipeline with which the 32 pieces are built              |

These are not finished courses: they are capabilities in use, each with an artifact that someone
can open.

## The evidence from what I have built

<!-- seccion: evidencia-construido -->

The most compelling proof is what I have built, because every piece has tests, coverage and
recorded decisions. My portfolio brings together **six sister applications** —plus CV Viva, this
site— and all of them reached their MVP and keep evolving; Hablemos San is the most advanced:

| Application   |   Automated tests | Coverage | Decisions (ADR) | What it required learning                                       |
| ------------- | ----------------: | -------: | --------------: | --------------------------------------------------------------- |
| Velo          | 740 unit, 153 e2e |   96.17% |               8 | local processing without a server, 500,000 rows                 |
| Dash Agent AI |               693 |    97.5% |              13 | agents on top of Power BI                                       |
| Probeta DS    |  267 unit, 24 e2e |   90.69% |               8 | Python, Pandas and scikit-learn in the browser with WebAssembly |
| Hablemos San  | 261 unit, 169 e2e |   94.02% |              14 | 50 capsules and 16 content milestones                           |
| Innmobiliaria |  172 unit, 76 e2e |   98.31% |               6 | business flows with validation                                  |
| Nutri-Kids    |  214 unit, 94 e2e |   99.52% |               7 | a calculation engine with near-total coverage                   |

To the six applications add **13 published agents**, **7 research pieces** and **6 dashboards**
on public data: **32 pieces** in four families, each with a different way of learning.
Applications require turning new technology into a usable experience; agents, understanding
models, sources, tools and evaluation; research pieces, method and reproducibility; dashboards,
rigor with data that anyone can verify.

The figures come from the repositories and are synchronized with them; they are in the showcase,
with their provenance. And the portfolio accumulates: each piece reuses decisions, components and
tests from the previous one.

## How I learn, concretely

<!-- seccion: como-aprendo-en-concreto -->

I start with a small, real problem that is demanding enough to force me to use the new
capability in depth —with Fabric, in 2024, it was monitoring a single agent—, with a result that
can be judged: what it must do, under what conditions and how you know it worked. I do not
reproduce every possibility of a platform; I build one piece that uses it well.

I go to the official sources first: primary documentation is slower at the start and avoids
depending on outdated explanations. Tutorials and communities are support, not authority; when
two explanations differ, I reproduce the behavior and decide with evidence.

I move in short cycles —build, observe, find the gap, expand— and **I document from day one**:
decisions, assumptions, tests and problems. What is not written down has to be rediscovered;
what is written down becomes a guide, a component or a template. And I distinguish familiarity
from command: I only declare a capability when I have used it to produce something that can be
examined.

Two rules of the pipeline govern what I build, and they live in its document: code first,
generative AI only when it is justified; and every control is proven by failing before it is
trusted.

## How I know I learned

<!-- seccion: criterios-de-aprendizaje -->

Six criteria, and a capability is not learned until it meets all six:

1. **Functional:** the piece solves the problem and passes representative scenarios, not just the happy path.
2. **Architectural:** I can justify each component, its dependencies and why it was chosen.
3. **Operational:** I can deploy it, observe it and maintain it, and I know what happens when a dependency fails.
4. **Documentary:** decisions, configurations and tests are written down; the learning does not depend on my memory.
5. **Transferable:** I can turn it into a guide, a component or an explanation that someone else can use.
6. **Bounded:** I can declare what I know how to do, what was tested and what is still in exploration.

For an organization this means that my capability is not limited to the inventory of
technologies I have already used. When a role demands something new, I do not ask for the
difference to be ignored: I show a proven method, with dates, for turning it into an applicable,
documented capability.
