---
slug: plataforma-y-despliegue
titulo: "Platform and deployment"
resumen: "Where my platform depth is —Microsoft: Fabric, Power BI, Microsoft Foundry—, what I deploy and operate myself with Git, GitHub Actions, CI/CD, Vercel and Sentry, what I have not done said plainly —Docker, Kubernetes, Vertex AI, BigQuery— and how I cover that gap."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What experience does Henry have with the cloud?"
  - "Does Henry know about containers, Kubernetes or Google Cloud?"
  - "Does he know about continuous integration and automated deployment?"
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

## My platform depth is in Microsoft

<!-- seccion: el-mundo-microsoft -->

My **cloud** experience is in the **Microsoft** ecosystem and in **Azure**, and that is where the
depth is:
**Microsoft Fabric**, **Power BI**, semantic models, lakehouses, warehouses and pipelines, and
today **Microsoft Foundry** (formerly Azure AI Foundry) for generative applications and agents,
which is the ground of the AI-103 track.

It is not a list of services. At Vesting I designed from scratch on Fabric the data ecosystem that
integrated the events of 27 AI agents for 12 clients —120 tables, 20 GB, 1,000 events per day—
and turned it into analytical capacity for product and operations. The full journey: how events
came in, what was kept, what transformations were shared, how entities were represented and how
results reached the semantic models and Power BI, with a common base able to accept every new
integration without losing traceability.

The DP-600 validates that core. And the view is an industrial engineer's: the platform as a system
that produces information, with inputs, transformations, constraints, controls and consumers,
optimized as a journey and not by component. The detail is in the Fabric document.

## What I deploy and maintain directly

<!-- seccion: lo-que-despliego -->

I maintain a portfolio of public applications built and deployed by me: **six sister
applications** —Velo, Dash Agent AI, Probeta DS, Hablemos San, Innmobiliaria and Nutri-Kids— plus
CV Viva, this site. All are in sustained operation and share the same chain:

- **Git** and GitHub as the source of truth, with conventional commits and decisions in ADRs;
- **continuous integration and deployment (CI/CD)** with **GitHub Actions**: unit, integration and
  end-to-end tests, accessibility, performance budget and a secrets sweep that blocks publication
  if anything fails;
- deployment on **Vercel**, with a preview for every change and production from the main branch;
- observability with **Sentry** and structured logging, to know what failed and where.

Continuous integration is a quality mechanism, not a deployment automation: if a control fails,
publication stops. The tests are real —Velo has 740 unit tests and 96% coverage; Dash Agent AI,
693; Hablemos San, 169 end-to-end— and the figures are synchronized with the repositories because
their value depends on being verifiable. I do not use the number of tests as a substitute for
quality: every control relates to a concrete condition and is observed failing before it is
trusted.

These deployments have consequences: a bad change breaks a public experience. That responsibility
forces me to design prevention, detection, rollback and learning without an infrastructure team
behind me.

## Operating artificial intelligence demands an additional discipline

<!-- seccion: desplegar-y-operar-ia -->

Deploying applications and operating AI share foundations —versions, automation, tests,
observability—, but an intelligent solution adds probabilistic components that evolve on their
own: data, models, context, tools. Its evaluation considers variability, grounding, tool use,
consumption, latency and behavior in the face of incomplete information.

That is why I distinguish deploying an application from operating an AI capability: the second
requires knowing not only whether the service is available but whether it still fulfills its
purpose, whether it uses the authorized sources, whether it keeps its limits and whether the cost
remains proportional to the value. At Vesting I built the platform that observed 23 agents at
once in production; in my own ecosystem, ARKHÉ, every agent runs with harnesses, validators and
recovery mechanisms. The **AI-300** track —MLOps and GenAIOps— formalizes that discipline.

## What I have not done, said plainly

<!-- seccion: lo-que-no-he-hecho -->

**Google Cloud** —**Vertex AI**, **BigQuery**, production deployment in that ecosystem— and
**containers in production** with **Docker** and **Kubernetes** are not in my professional
experience. My world is Microsoft and Microsoft is where I have the depth. Kubernetes I know as
study, not as operation.

Of **MLOps** I have one half and not the other, and it is worth saying which. The half of taking
models to production and sustaining them I have done: predictive models in production in banking
and in transport, the real-time monitoring of AI agents at Vesting, and six sister applications
and this site with continuous integration, controls that block publication and automated
deployment, operated by me. The half of packaging and orchestrating with containers, no.

I would rather say it like that, up front, than hide it in a list of tools. A résumé that names
thirty technologies does not distinguish the five it masters from the twenty-five it has seen,
and whoever is interviewing finds out in ten minutes.

## Why that gap is smaller than it looks, and how I cover it

<!-- seccion: como-la-cubro -->

Two reasons. The first is equivalence: a lake on distributed storage, a columnar analytical
warehouse, a pipeline orchestrator and a semantic layer exist in all three clouds under different
names. What I did with lakehouse and warehouse on OneLake is called BigQuery and Vertex AI on the
other side; what does not translate on its own is identity, costs and operation, and that is
learned by operating.

The second is method, and it has dates: the DP-600 in five months on a Fabric with less than a
year on the market; Codex, Antigravity and Claude Code within a month of their release; six
sister applications and this site, with technologies I had not used —WebAssembly, local
processing, edge deployment—, built and published. The document "How I learn" details it.

**Google Cloud is today a declared exploration**, not a capability: in my pipeline there is a piece
called "Autonomous agent with Gemini and Vertex AI", conceived as the multi-cloud complement to my
certification track in Azure. It is in exploration with that word on purpose and without a
committed horizon; when it is built, it will be evidence.

## What I bring to a platform team

<!-- seccion: lo-que-traigo -->

End-to-end data architecture designed from scratch, at Vesting. Governance set up three times:
banking, agent platform and healthcare. Monitoring of agents in production. Semantic modeling and
query optimization with DAX Studio and Tabular Editor. Agents from two sides: the process with
which 27 were built in a professional environment, and ARKHÉ, my own ecosystem of harnesses,
selective retrieval, tools, contracts and evaluation. Six sister applications and this site,
public and operated with CI/CD, tests, accessibility and performance budgets.

And the habit, which comes from ISO 9001 and stayed, that what is done leaves a written trail:
architecture decisions recorded, controls that are demonstrated failing, and every figure with
its provenance.
