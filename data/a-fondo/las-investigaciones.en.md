---
slug: las-investigaciones
titulo: "The research: method before result"
resumen: "Seven research lines published with their measured gap —1,414, 900, 780, 279, 1,405, 119 and 900 works reviewed— and their findings, produced with two harnesses: Design Science (52 criteria, thresholds frozen before measuring) and Computational Paper (44 criteria, ledger: if it is not in the ledger it is not in the paper)."
estado: aprobado
ancla: "/vitrina/investigaciones"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What research has Henry done?"
  - "How does Henry measure the gap in the literature before researching?"
  - "Has he written articles or papers?"
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
  the CONFIRMAR marker described in the manual, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
  -->

## What they are: applied research, not journal articles

<!-- seccion: que-son -->

My portfolio gathers **seven research lines** published in the showcase, each with a sheet that
presents its origin, its question, the measured gap, the **method**, the status and its limits.
None is sealed or presented as peer-reviewed: they are pieces with manuscripts ready to submit,
and they are declared as such.

I do research for two reasons. Several questions were born in my jobs —transit, digitization, an
ERP in 2016— when I could see the problem but did not have the data or the tools to solve it. And
because the research method strengthens work with data and AI: defining the question, freezing
criteria before looking at the result, building a baseline and declaring the limits is the same
as evaluating a model or an agent. A hypothesis is not a **finding**; a synthetic result is not
operational validation.

## The method: first the gap is measured

<!-- seccion: se-mide-el-vacio -->

All of them start with the same rule: the gap is measured before proposing the contribution. It
is not enough to say that a topic has received little attention: a **protocol-driven systematic
review** is done, with inclusion and exclusion criteria fixed beforehand, and every work is
classified by phenomenon, intervention, unit of analysis and evidence. The gap stops being an
impression and is expressed in counts:

| Line                                        | Corpus reviewed | Measured gap                                                                                                                                              |
| ------------------------------------------- | --------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Driver–bus assignment with failures         |     1,414 works | none models the failure as a property of the driver–vehicle pair; of 600, none optimizes kilometers with the breakdown as a consequence of the assignment |
| Bus convoys (_bunching_)                    |       900 works | none reports sustained adoption of a control in operation; of 873, none translates the control into instructions by position in the convoy                |
| Fatigue allowances and line balancing       |       780 works | none synthesizes the allowance methods; of 378, none measures how fatigue changes the optimal balance; 3,057 records screened                             |
| FORJA: from the drawn process to the system |       279 works | 53 target non-programmers and 40 produce an executable, but none requires declaring inputs, function and outputs per activity                             |
| ARKHÉ: declarative knowledge ecosystem      |     1,405 works | no ecosystem meets the three conditions under a strict reading; individuals building complete systems with AI: 8 of 400                                   |
| The agency spectrum of instruments          |  119 frameworks | none orders decision instruments by agency with evaluation and cost against the optimum; of 800 works, none prescribes the choice between classes         |
| Replacing an ERP with AI                    |       900 works | a single one with an assisted-replacement strategy; 15 of 500 study AI productivity in integrated systems, against 138 in small tasks                     |

A counted gap still has limits: it proves that the condition was not found in the corpus reviewed
under that method, not that it is impossible for it to exist outside the search. The correct
formulation is not "nobody has done it" but "it was not identified within the corpus reviewed
under these criteria". It is less spectacular and much more defensible.

## Three lines on operations under variability

<!-- seccion: operaciones-bajo-variabilidad -->

The seven group into three questions: how to optimize operations under variability, how to turn
processes into systems, and how to distribute the capacity to decide. The first three come from
transit and from the production line.

**Driver–bus assignment with failures.** The failure belongs to the pair: assigning as a pair
completes more kilometers. With integer and constraint programming over open transit data and a
declared synthetic generator, the two formulations give **14,251 identical optima**, and **90% of
the pairs change** when the pair is modeled. The magnitudes are from synthetic instances: the
mechanism is demonstrated; the real figures are not claimed.

**Bus convoys.** _Bunching_ does not steal capacity: it steals time and drives users away. A
**discrete-event simulation** with **factorial pre-registration** and classical control as the
baseline, over **197,046** simulated individual experiences: the mean wait rises from **2.33 to
4.43 minutes** under full convoy. It proposes the policy and measures its effect; changing the
rule is an institutional decision.

**Fatigue allowances and line balancing.** Fatigue tables do not know your workstation or your
altitude. A balancing model with endogenous fatigue and synthetic curves from the literature shows
that calibrating the allowance changes the optimal configuration of the line; it does not measure
fatigue in real people and is of no use for pressuring anyone to perform more: the allowance
protects, it does not squeeze.

## Four lines on processes, systems and decision

<!-- seccion: procesos-y-decision -->

**FORJA.** The professional draws their process —in BPMN— and FORJA compiles it, without
intermediaries: every activity as an open black box with inputs, function and outputs, and a
compiler that preserved **99.5% of the structure** in the demonstrator. That professionals will
use it is proven with professionals, not with the prototype.

**ARKHÉ.** A person with judgment builds systems that used to require a team. It is the
architecture that produces the other six: indexed declarative contracts, reusable molds,
inspectable records, verifiable governance; **6 of its 9 concepts** are already citable with
reviewed literature. It publishes the components, not the complete formula: the boundary is also
commercial.

**The agency spectrum.** Dashboard, alert, assistant, recommender or agent: which one for each
decision. An ordinal spectrum by construction, synthetic decision-makers and a scenario with a
known optimum to measure _regret_; the ceiling of hours was frozen before starting. It never
claims that synthetic decision-makers predict human behavior.

**Replacing an ERP with AI.** Its origin is my first ERP implementation, at Inglopres in 2016. An
open-source ERP as the demonstrator, the **strangler pattern** and the analysis of coupling
between modules to decide what to replace first; AI productivity is cited with its scope: what
was proven in small tasks is not extrapolated to integrated systems.

## Two harnesses: frozen criteria and ledger

<!-- seccion: los-harnesses -->

The research is produced with two harnesses, published among the 13 agents of the showcase. The
**Design Science Harness** —10 phases D0 to D9, **52 binary criteria**, 7 hardened controls—
freezes the thresholds before measuring and publishes whatever comes out: in its pilot paper,
**two of the three principles** of the artifact were refuted by their own metrics, and that is how
they were written. A null result is never fixed by redefining; and a null is not a refutation:
both are reported as informative.

The **Computational Paper Harness** —**44 criteria**, three operations research papers ready to
publish— applies the second rule: **if it is not in the ledger, it is not in the paper**. No number
reaches the manuscript without first existing as a row of an _append-only_ record; tables and
figures are generated from the data and never edited by hand. And the proof that the pipeline is
declarative is a command: after three papers of different classes, the `git diff` of the phases
and of the contract is still empty, with **0 new fields** in the contract.

The two share a limit and a "never": they do not publish —submission to a journal is executed by
the author with their token— and they never mention the author's ecosystem or its machinery in a
manuscript, something a lint verifies twice. It is the lineage of an analytical platform applied
to a paper.

## Synthetic data, simulation and limits

<!-- seccion: datos-sinteticos-y-limites -->

Several of the 7 lines —the 197,046 experiences of the convoys, the fatigue curves— are evaluated
with synthetic data or simulation because there are not enough public data or operational
information cannot be used. Synthetic data allow scenarios with known properties and
**reproducible** experiments; simulation allows comparing policies without intervening in the
operation. Neither is operational validation, and every sheet says so.

And there is an ethical "never" common to all of them: **they never use data from the author's
previous jobs** —only public sources and declared synthetic data—, they never name drivers or
companies the data may come from, they never classify or blame a person: the model pairs, it does
not rank. A negative result is not hidden: it delimits which mechanism does not work and under
what conditions, and keeps others from repeating the same route. Rigor does not consist in being
right from the first formulation; it consists in designing a process capable of showing when I
am not.

## What this has to do with an artificial intelligence role

<!-- seccion: que-tiene-que-ver -->

Part of the work in AI is evaluating claims: whether a solution works, whether a metric measures
what it says, whether a result generalizes. Reviewing the literature avoids presenting as
innovation what is already solved; freezing criteria protects the evaluation from retrospective
adjustments; the traceability of the numbers allows reconstruction; synthetic data and simulation
study mechanisms under control. These 7 research lines —5,400 works reviewed among them all, and
119 frameworks— demonstrate that I do not use AI only to build faster: I use it inside a system
designed to produce traceable, refutable and reproducible knowledge.
