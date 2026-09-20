---
slug: apps-pipeline
titulo: "The apps I am building in public"
resumen: "The AI-APPs pipeline: six sister applications plus CV Viva, 13 agents, 7 research pieces and 6 dashboards —32 pieces— built with two houses, a factory agent, four CI jobs, a sheet contract published from Zod, a real cost of US$0 a month and two rules: code first, and every control is proven by failing."
estado: aprobado
ancla: "#vitrina"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What applications is Henry building?"
  - "Why does he build in public?"
  - "How many applications has he published?"
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

<!-- The S3 skeleton pointed to "#apps"; that HOME section was removed in the
     post-S7 review and the roadmap moved to /vitrina/apps. Today what the HOME
     shows of what has been built is the showcase. Corrected in the S8 migration. -->

<!-- guide (comes from the story skeleton, S3 — written by the owner):
The vision of the AI-APPs pipeline: why you build in public, what each app
demonstrates, how you work with AI agents to build them (this CV Viva
included). -->

## What I build on my own, outside of work, and why in public

<!-- seccion: por-que-en-publico -->

A résumé claims; a published piece demonstrates: that is why I have published six applications
and 32 pieces in total. For ten years I demanded that every indicator keep its provenance and
that every conclusion have evidence; it was incoherent to apply that rigor to the work of
organizations and present my own as a list of tools.

My portfolio is not a gallery of demos: it is an architecture of evidence. Each piece
demonstrates a concrete capability with a product that can be walked through, tested and
examined, in a public **repository**. And building in public has a deliberately uncomfortable
consequence: what is not finished cannot be presented as if it were. An idea is declared in
exploration; a finished piece carries its figures, its limits and its "nevers" in the sheet.

Publishing is not disclosing without limits: I do not publish credentials, internal data of
organizations or third-party information; what I learned in a job is reformulated as a
principle, never as client data. A secrets sweep blocks every publication, and by rule the site
hands out no production URL.

## What has been built

<!-- seccion: que-hay-construido -->

The **showcase** brings together **32 pieces** in four families: **six sister applications** —plus
CV Viva, which is this very site and not a piece of the display—, **13 agents**, **7 research
pieces** and **6 dashboards**. All the applications reached their MVP and are in sustained
operation, and they keep evolving; **Hablemos San** is the most advanced and the only sealed
one, since August 2026.

| Application       | What it demonstrates                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Velo**          | processing 500,000 rows without the file ever leaving the browser                                                              |
| **Dash Agent AI** | what context an agent keeps about the person, without a network call; it retired a feature of 83 suggestions that did not help |
| **Probeta DS**    | Python, Pandas and scikit-learn in the browser with **Pyodide** (WebAssembly)                                                  |
| **Hablemos San**  | 50 capsules and 16 content milestones with 169 end-to-end tests                                                                |
| **Innmobiliaria** | business flows with validation and 98% coverage                                                                                |
| **Nutri-Kids**    | a calculation engine with 99.5% coverage                                                                                       |

The tests, coverage and ADRs of each one are in the document on how I learn; the agents, the
dashboards and the research pieces each have their own document. Every figure published in a
sheet declares its nature: **measured**, **calculated**, **declared** or **estimated**, and a
figure without a source does not get in.

## The factory, in numbers

<!-- seccion: la-fabrica-en-numeros -->

The pipeline works with **two houses**: a private **planning house**, where the plan, the vision
and the build orders of each app live; and the repository of each app, where the code lives and
from which progress is read. No app moves forward without two written approvals —the current
priority and the vision with its features inventoried— and no sprint closes without a summary.
This site has **eight sprints closed** that way.

It is coordinated by the **AI-APPs Factory**, a sealed agent that is also a piece of the
showcase, with three declared limits: it does not write production code, it has not run a real
launch or a real operation, and it has no libraries shared between apps. The starter kits of
each app come from a single versioned **kit**, whose lessons accumulate.

Every change goes through **four continuous-integration jobs** —quality, integration, end-to-end
and Lighthouse with a performance budget— and through a secrets sweep. Two precedents hardened
it: on July 15, 2026, a weak gitleaks bait gave two false "all good" in a row, and since then the
canonical bait is verified; and in sprint 3 a provider credential returned 401 in the
integration, which is why today every credential passes a smoke test before anything is built
against it.

The infrastructure is drawn in a blueprint with its **real cost: US$0 a month**, and with its
**single point of failure** declared. There are **20 architecture decisions (ADRs)** recorded in
this site's repository. **Zero links**: production is shown, not handed over; the public CTA is a
waiting list.

## The sheet contract

<!-- seccion: el-contrato-de-las-fichas -->

This site is the destination, not the author, of what it shows. The sheets of the apps are
administered by the planning house; those of agents, research pieces and dashboards are produced
by whoever builds each piece, against a **technical sheet contract** published from the Zod
schema —current version **v1.3.1**— and they arrive by copy in a content PR without a sprint,
which the CI validates: schema, zero links, accessibility and tests.

A sheet that does not validate is not corrected here, not even to make it fit: file, field and
rule are reported, and it is corrected at the source. If several do not fit for a legitimate
reason, the contract grows additively; that is how its latest versions were born. One contract
and one renderer: nothing specific to one front lives in the component.

## Code first, artificial intelligence when it is justified

<!-- seccion: codigo-primero -->

Rule 13 of the pipeline: do not bring in generative AI by default. Before using a model you have
to demonstrate what characteristic of the problem requires interpretation, generation,
contextual retrieval or flexible coordination, and why code is not enough; turning on a
generative feature requires a written architecture decision.

The consequence is hybrid solutions: code manages validations, contracts and transformations;
the model steps in where interpreting or generating is needed, with a deterministic fallback. It
is the rule this site applies to its own chat, and it keeps debt in check: a generative feature
introduces dependencies, cost, variability and a need for evaluation that are not taken on
without a purpose.

## A control is proven by failing

<!-- seccion: control-en-rojo -->

Rule 14, the second one: every new control —a CI job, an assertion, a threshold, a content
gate— is born with its demonstration in red, in the same commit and recorded in the log: what
was broken on purpose, what went red and whom it named. A control that was never seen failing is
decoration, and decoration that gives false reassurance.

Three questions are asked of every gate: did you see it fail?, did you see it run? —a skipped
job is not green— and can it fail at all?, because a gate that another rule makes unreachable is
retired. The same logic applies to agents: it is not enough for them to answer; you have to see
the test recognize the wrong source, the broken format or the claim without evidence.

## This very page is also an application

<!-- seccion: esta-misma-pagina -->

**CV Viva** is part of the portfolio: an application in **Next.js** with static generation,
bilingual, built in 8 sprints, with **automated tests** at three levels, verified accessibility,
a performance budget and continuous **deployment**. The content lives in versioned files
validated with a schema at build time: if it is malformed, the build fails, not the page.

It includes a retrieval-augmented (**RAG**) chat that answers only with the published evidence
and cites toward what is visible; how it works inside, with its numbers, is in its own document.

## What remains in exploration

<!-- seccion: en-exploracion -->

Two explorations are declared with that word on purpose, and they do not count among the 32
pieces: an end-to-end analytics solution on Microsoft Fabric with open data from Colombia, and an
autonomous agent on Gemini and Vertex AI, the multi-cloud complement to my certification path in
Azure. Neither changes status for having an interface that works: the exit condition —verifiable
purpose, documented architecture, controls, evidence— is defined before starting.
