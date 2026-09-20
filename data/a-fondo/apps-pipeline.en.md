---
slug: apps-pipeline
titulo: "The apps I am building in public"
resumen: "The AI-APPs pipeline: six sister applications plus CV Viva, 13 agents, 7 research lines and 6 dashboards —32 pieces— built with two houses, a factory agent, four CI jobs, a sheet contract generated from Zod, a real cost of US$0 a month and two rules: code first, and every control is demonstrated by failing."
cuando_usar: "Use this when they ask what he has built on his own outside of work, how many applications he has published, whether he has public code, how his build pipeline works with Next.js, automated tests and CI, and what each of the six showcase apps demonstrates."
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
mechanical part (emails, phone numbers, ID documents, web addresses); PROPER
NAMES are not caught by a regex — those are up to you.

HOW THIS FILE IS WRITTEN
- Normal prose, in the first person, in paragraphs.
- Every subsection starts with a `##` title followed by a
  `<!-- seccion: id -->` comment. Those are the ONLY 2 marks.
- `estado: borrador` → the chat does NOT index it and no English twin is required.
  `estado: aprobado` → the chat indexes it and requires the complete `.en.md` twin,
  subsection by subsection.
- No figure, date or achievement without a source. Whatever is missing goes as
  a CONFIRMAR marker in square brackets stating what is missing, never as plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

<!-- The S3 skeleton pointed at "#apps"; that HOME section was removed in the
     post-S7 review and the roadmap moved to /vitrina/apps. Today what the HOME
     shows of what has been built is the showcase. Corrected in the S8 migration. -->

<!-- guide (comes from the story skeleton, S3 — written by the owner):
The vision of the AI-APPs pipeline: why you build in public, what each app
demonstrates, how you work with AI agents to build them (this CV Viva
included). -->

## What I build on my own, outside work, and why in public

<!-- seccion: por-que-en-publico -->

A résumé asserts; a published piece demonstrates. That is the main reason I build in public: six sister applications, plus this site, and 32 pieces in total, all outside my job and all with their repository.

Throughout my career —ten years since August 2016— I have demanded that every indicator keep its provenance, that every transformation can be explained and that every conclusion is backed by evidence. It seemed incoherent to me to apply that level of rigor to the work of organizations and then present my own profile through claims that nobody could verify. So I decided to treat my professional experience the way I treat any information system: with traceability, evidence, version control and observable results.

My portfolio is not a gallery of demos nor a collection of exercises. It is an architecture of professional evidence. Each piece seeks to demonstrate a concrete capability through a product that can be walked through, tested and analyzed. The applications demonstrate the construction of solutions. The agents show how I structure work with artificial intelligence. The research lines make my methodological discipline visible. The dashboards allow evaluating how I turn data into models, indicators and decision experiences.

Building in public is, ultimately, a form of professional responsibility. I do not expect a person to trust the description of my capabilities alone. I give them pieces that allow those capabilities to be examined, and since July 2026 each one arrives at the showcase with its sheet, its figures, its limits and its "nevers".

## What is not finished is not presented as finished

<!-- seccion: estados-honestos -->

Building in public introduces a deliberately uncomfortable consequence: what is not finished cannot be presented as if it were. An idea can be declared in exploration, a prototype can show a hypothesis and a finished solution can demonstrate a capability, but these states must not be confused. Making that difference visible protects the credibility of the portfolio and forces me to describe every result with precision.

The states are written in the data, not in the prose. The app catalog admits three: in production —live URL, repository and CI in green—, under construction —repository with real commits— and in exploration —declared objective, no promised dates—. The sheets of the pieces admit two: initial, when construction is closed, and sealed, when the user's testing gate is finished and the piece carries its sealing date. Of the 13 published agents, five are sealed and eight are in the initial state; the six dashboards are sealed, and the seven research lines are initial, with their manuscripts ready to submit and none submitted.

It also forces me to keep a correspondence between what I claim and what I deliver. If I say a solution is reproducible, there must be a way to understand how it was built. If I claim a figure was calculated, I must be able to explain the method. If an application uses artificial intelligence, it must be clear what function it serves, what information it uses and why that capability could not be adequately solved through conventional programming.

Publishing does not remove the possibility of being wrong. It makes it observable and correctable. A versioned artifact makes it possible to know what changed, why it changed and what learning the change produced. That traceability turns the portfolio into something more valuable than a snapshot of finished results: it turns it into evidence of how I reason, design, validate and evolve solutions. Dash Agent AI is the most honest example: it built a suggestions feature, measured it on the real corpus, obtained 83 decontextualized suggestions and withdrew it, and the sheet says so with a date instead of reporting it as pending.

## What publishing responsibly means

<!-- seccion: publicar-con-responsabilidad -->

Building in public does not mean disclosing without limits. Professional transparency must coexist with privacy, security, confidentiality and respect for third-party information. That is why each piece is designed by clearly distinguishing what can be published, what must be anonymized, what needs synthetic or open data and what must stay out of the repository.

I do not publish credentials, secrets, personal information, internal data of organizations or components whose exposure could unnecessarily increase the risk of a solution. When a piece starts from a lesson learned in a professional environment, I reproduce the principle, the pattern or the problem using authorized, open or synthetic information, without carrying the sensitive data of the original context into the portfolio. The seven research lines carry it written as a "never": they never use data from my previous jobs, only public sources and declared synthetic data.

I also make sure that public repositories do not turn transparency into a vulnerability. Sensitive configurations are separated from the code —secrets live only in the local environment file, ignored by git, and in the deployment variables—, dependencies are reviewed with an audit on every integration, and features that use external services operate under explicit permissions and limits. A secrets sweep with gitleaks blocks every commit, in 2 layers: the git hook for manual commits and a hook of the coding agent for the writes it makes. A verifiable architecture does not need to reveal what it must protect.

And one hard rule of the pipeline that governs this site: zero links. No file of the repository nor field of the project contains the production URL or the preview URLs; production is shown, never handed over. The public call to action of each app is a waiting list, with no promise of being granted, and the sweep that watches over it runs on all versioned files after the last change, not before.

## Provenance of knowledge and responsibility for AI-assisted work

<!-- seccion: procedencia-y-responsabilidad -->

Responsible publishing also demands respecting the provenance of knowledge. External sources must be acknowledged, licenses must be preserved and third-party assets must not be presented as one's own. The six dashboards practice it by name: the Formula 1 one declares its origin and its license —F1DB, version 2026.13.0, CC BY 4.0—, and the energy and climate one publishes its seven open sources with the license of each on its notes page.

Likewise, a piece assisted by artificial intelligence remains under my responsibility: using a model does not transfer the obligation to review, validate and answer for the published result. I build with coding agents, and that is why every application is born with automated tests, with coverage thresholds in continuous integration and with recorded architecture decisions: the agent accelerates; the responsibility does not move.

This distinction is especially important in research and agents. Openness allows examining the method, the sources and the evaluation criteria, but does not oblige exposing information that compromises people or organizations. The two research harnesses carry a "never" that a lint verifies twice: they do not mention my ecosystem or my machinery in a manuscript. My goal is to make professional capability verifiable, not to turn publishing into an exercise of indiscriminate disclosure.

## What has been built

<!-- seccion: que-hay-construido -->

The pipeline produces four main families of assets: applications, agents, research lines and analytical dashboards. All finished pieces are published in the site's showcase and have a sheet that explains their purpose, scope, state and main design decisions. Today the showcase gathers 32 pieces: six sister applications, 13 agents, 7 research lines and 6 dashboards.

The six applications are Velo, Dash Agent AI, Probeta DS, Hablemos San, Innmobiliaria and Nutri-Kids, plus CV Viva, which is this very site and not a piece of the storefront. Each answers a different promise, but all must pass the same criterion: turning a need into a functional, documented and verifiable experience, not only into a convincing interface or a technical demo.

| Application       | What it demonstrates                                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Velo**          | anonymizing and recovering 500,000 rows without the file leaving the browser, with zero network calls carrying data                                                   |
| **Dash Agent AI** | what context your agents keep about you and what they cost you, on your machine and without a single network call; it withdrew a feature of 83 suggestions that did not help |
| **Probeta DS**    | Python, Pandas and scikit-learn in the browser with Pyodide (WebAssembly), with a verdict that says "does not beat" when it does not beat                              |
| **Hablemos San**  | 50 capsules and 16 milestones to practice speech as a family, with 169 end-to-end tests and the child's voice never recorded                                          |
| **Innmobiliaria** | business flows with real validation —the certificate is seen and never stored— and 98% coverage in its engine                                                         |
| **Nutri-Kids**    | a calculation engine with 99.5% coverage and a daily log that never leaves the phone                                                                                  |

All of them reached their MVP and are in sustained operation —if they are on the site it is because they reached that condition—, and all keep evolving permanently. Hablemos San is the most advanced: the only one sealed, since August 2026, and in use by the family it was built for.

## The six applications, in figures

<!-- seccion: las-seis-apps-en-cifras -->

Each application publishes its brochure with figures that declare their source, and this table gathers them as they stood in their August 2026 exports:

| Application       | Features | Screens | Unit and integration tests | End-to-end tests | Line coverage | ADRs |
| ----------------- | -------: | ------: | -------------------------: | ---------------: | ------------: | ---: |
| **Velo**          |       14 |       5 |                        740 |              153 |        96.17% |    8 |
| **Dash Agent AI** |       12 |       8 |                        693 |                — |         97.5% |   13 |
| **Probeta DS**    |       33 |       5 |                        267 |               24 |        90.69% |    8 |
| **Hablemos San**  |       24 |      10 |                        261 |              169 |        94.02% |   14 |
| **Innmobiliaria** |       13 |      11 |                        172 |               76 |        98.31% |    6 |
| **Nutri-Kids**    |       19 |       8 |                        214 |               94 |        99.52% |    7 |

The monthly operating cost of the six is US$0, calculated as the sum of the contracted services: hosting on a free plan, no servers of our own and, when there is an AI provider, within its free quota. Four of the six do not use artificial intelligence at all —Velo, Dash Agent AI, Hablemos San and Innmobiliaria, which has it at zero models by product rule—, and their sheets declare it as a rule, not as an absence; Probeta DS and Nutri-Kids use it in a single feature, with a deterministic fallback and switchable by environment variable.

These figures are a dated snapshot, they are refreshed from each app's repository, and a large suite does not protect by itself: what protects is that each test is tied to a concrete condition that knows how to turn red. Three examples: Velo has a permanent test that intercepts every browser request and fails if a single one carries data; Hablemos San has tests in continuous integration that break the code if someone tries to save or send the child's audio; Probeta DS has tests that fail if someone adjusts preprocessing outside the training half.

## Thirteen agents, seven research lines and six dashboards

<!-- seccion: agentes-investigaciones-tableros -->

The portfolio also includes thirteen published agents, conceived as specialized work systems. I do not present them as generic conversations or as text-generation demos. Each agent must have a delimited purpose, identifiable sources or knowledge, rules of action, expected results and conditions under which it must recognize its limits. Five are sealed —the Power BI Dashboard Builder in June 2026, the AI-APPs Factory in July, CINE Presentations and the Animation Workshop between July and August, and the Computational Paper Harness in August—; their own document walks through them one by one.

The seven research lines represent another dimension of the pipeline. Their purpose is not to retrospectively back an idea with selected references, but to formulate a question, characterize the gap that makes it relevant and build a methodological route capable of producing evidence. Each work must clearly distinguish between what is supported, what is still a hypothesis and what cannot be claimed with the available results. Each one publishes its gap with the number of works reviewed —from 119 frameworks to 1,414 works— and its document explains the method.

The six dashboards built on public data allow demonstrating the analytical layer of the profile. In them I verify the identity of the sources, keep the definitions used, structure information models and build measures that can be traced down to the data that originates them. All six were sealed between September 6 and 8, 2026 and run their identities over the complete universe, not over a sample. The goal is not to produce attractive visualizations, but to demonstrate that the decision experience rests on a reliable architecture.

## Four families, one progressive system of capabilities

<!-- seccion: sistema-progresivo -->

These four families do not compete with each other. They form a progressive system of capabilities. Data allows observing. Dashboards turn that observation into understanding. Research lines allow formulating and contrasting explanations. Applications integrate capabilities within a usable experience. Agents extend that experience through knowledge, reasoning and tools within defined limits.

The families also feed each other in the real pipeline. The two research harnesses are agents of the showcase and produce the seven research lines. The AI-APPs Factory is an agent and coordinates the six applications. The Power BI Dashboard Builder —built and tested: it creates the complete project with its semantic model, the preparation in Power Query M, the DAX measures and the visuals, and it can extract data— is an agent that produces the class of artifact that the six dashboards demonstrate by hand. And the research on the spectrum of agency studies precisely when a decision deserves a dashboard, an alert, a recommendation or an agent.

Each sheet must also declare which professional capability it intends to demonstrate. An application can evidence architecture, development or user experience. An agent can demonstrate knowledge retrieval, tool use or evaluation. A research line can demonstrate method. A dashboard can demonstrate data engineering, semantic modeling or analytical communication. This relationship prevents the pieces from becoming interesting projects that are disconnected from the profile they must support.

## Every figure declares its nature: measured, calculated, declared or estimated

<!-- seccion: cifras-con-procedencia -->

Every figure published in the technical sheets must declare its nature. A figure may have been measured directly, calculated from data, declared by a source or estimated under certain assumptions. This classification avoids presenting results that have different foundations with the same level of certainty, and in the sheets it is a mandatory field, not a footnote: a figure without a source does not get in.

The rule was born in Dash Agent AI, the first app to publish its brochure in August 2026, and it was recommended to the rest of the portfolio with a simple argument: an app that demands provenance for every number on its screen cannot publish loose figures about itself. Thus, "740 tests" is measured —the output of a command on a date—; "US$0 a month" is calculated —the sum of contracted services, with the rule written down—; "0 GPU" in Probeta DS is declared —a hard product rule—; and the Factory's "108 hours of coordination eliminated per year" is an estimate, with its scenario and its assumptions next to it.

The rule is not decorative. A portfolio that demands provenance from the data of its applications and dashboards must apply the same standard to the claims it makes about itself. The showcase does not only show what was built; it shows what evidence allows sustaining each claim.

## Demonstrated capability is not technology used

<!-- seccion: capacidad-vs-tecnologia -->

The sheet must likewise differentiate between demonstrated capability and technology used. A tool does not by itself constitute a competence. Using Microsoft Fabric, Power BI, Python, a generative model or a given framework only acquires meaning when it is clear what problem it allowed solving, what architectural decision it represented and what evidence demonstrates that the solution fulfilled its purpose.

That is why the stack of each sheet is not a list of logos: each technology comes with its role. In Velo, Web Workers are the boundary where the raw data lives and only counts and masked samples cross toward the interface; Web Crypto is the encrypted vault. In Probeta DS, Pyodide is the reason pandas and scikit-learn run on a separate browser thread and the dataset is never uploaded. In Innmobiliaria, Supabase is a database with row-level permissions from the first table and every write through a transactional function. The same word —Next.js— appears in all six, and in each one it means a different decision: an installable, local PWA in Hablemos San, a server that listens only on the local machine in Dash Agent AI, an app served from the edge in Innmobiliaria.

That discipline is the one I use to read someone else's résumé, and the one I ask people to use with mine.

## What each family demonstrates: the applications

<!-- seccion: que-demuestra-cada-familia -->

The applications demonstrate my ability to take an idea from the definition of the problem to a functional, deployed, documented solution available to be examined by other people. This covers architecture, user experience, development, testing, accessibility, performance, publishing and maintenance. All six are in sustained operation because they reached their MVP, and they keep evolving; what I do not do is use the word production as a synonym for a demo being able to open in a browser: each sheet says what state it is in and since when.

Velo demonstrates that certain capabilities can be executed entirely within the browser, avoiding the user's file having to be sent to a server. This decision is not only technical. It also responds to a reflection on privacy, architecture and trust: when an operation can be performed locally without sacrificing the purpose of the solution, reducing the exposure of the information can be a central feature of the product. Velo takes it to the extreme: 500,000 rows by 24 columns without blocking the tab, zero artificial intelligence on purpose, and the same file always produces the same result, byte for byte.

Probeta DS explores the execution of analysis capabilities with Python, pandas and scikit-learn within the browser experience using WebAssembly. The piece connects data science, application development and interaction design. Its value lies not only in running analytical code, but in turning a capability normally reserved for specialized environments into an accessible and controlled experience, and in showing the screen where its own product fails: the verdict against the baseline says "does not beat" when it does not beat, and data leakage is impossible by construction.

Dash Agent AI makes visible a dimension that often remains hidden: the information an agent keeps, uses or infers about the person it interacts with. This application connects observability, transparency and user experience, and transforms an abstract trust problem into an interface that can be examined: the inventory of what your agents know about you, the deterministic detection of what stopped being true and a four-layer read-only guarantee, verifiable on screen.

## What the agents, the research lines and the dashboards demonstrate

<!-- seccion: que-demuestran-las-otras-familias -->

The agents demonstrate my way of working with generative artificial intelligence. I do not trust the model's memory as a sufficient source to produce verifiable claims. When a task demands evidence, the agent must use identifiable sources, cite what supports its answer and declare the gaps it cannot resolve. The fluency of an answer must never be confused with the solidity of its foundation. The AI-APPs Factory has it written as a "never": it does not invent figures, quotes, papers or competitors; without a source, the datum goes to the gaps section.

They also demonstrate that an agent is not merely a conversational model. It is a composition of instructions, context, sources, tools, memory, limits, evaluations and intervention mechanisms. Its quality depends on the complete architecture, not on the model's ability to produce a convincing answer: the Design Science Harness has 52 binary acceptance criteria across its ten phases and five gates that it only crosses with an exact phrase from me.

The research lines demonstrate methodological rigor. Each line must start with a relevant question and a review capable of establishing what is known, what remains open and what contribution can be formulated without exceeding the evidence. Researching does not consist of dressing an intuition in academic language. It consists of exposing it to a method that can confirm, modify or reject it, and in its pilot paper two of the three principles evaluated were refuted by their own metrics, and that is how they were written.

The dashboards demonstrate verifiable analytical engineering. Each one requires understanding the sources, evaluating their quality, structuring a semantic model, defining measures and building an analysis experience. Power BI appears here not as an isolated visualization tool, but as the layer through which data, relationships and metrics become a decision experience: in the banking dashboard, the balance closes across the 7,779 combinations of entity and cutoff date, run in full and not over a sample.

Taken together, the families show an end-to-end capability. I can research a problem, structure its data, build the model that allows understanding it, design the application through which a person interacts with the solution and incorporate artificial intelligence when that capability adds a value that deterministic programming cannot offer by itself.

## How the construction pipeline works: two houses

<!-- seccion: como-se-construyen -->

The portfolio is not built as a succession of independent projects. I use a pipeline governed by common rules to prioritize, define, build, validate, document and publish each piece. The goal is for the value not to remain only in the finished product, but also in the ability to build the next one with greater clarity, consistency and speed.

The pipeline works with two houses and one writer per house. A planning house, private, where the brief, the product vision, the sprints with their plan and their retrospective, the construction orders of each app, the method and the standards live. And the repository of each app, where the code, the tests, the implementation decisions, the log and the summary of each sprint live. The planning house reads the app repositories read-only and never writes in them; each app never writes in the plan. Synchronization is a cold read of git —the sprint summary and its commit history—, not copy and paste. Nobody is the bridge anymore: the previous flow cost me between 4 and 8 hours of coordination per sprint, and when that time ran out the pipeline froze.

The pipeline is assisted by a factory agent that is also part of the showcase. Its function is not to design products autonomously nor to replace decisions of architecture, priority or acceptance. It acts as a coordination component: it keeps the state of the initiatives, verifies the existence of the required inputs, applies advancement rules, identifies documentation gaps and helps keep the correspondence between what was approved, what was built and what was published.

Each app is born stamped from the same kit: the template that brings continuous integration, the hooks for secrets and for not pushing directly to the main branch, the performance budget and the embedded artificial intelligence pattern already baked in. The kit has a version and its lessons accumulate: what one sprint learns in one app travels stamped to the next, as deltas in the construction order that follows.

## The factory, in numbers

<!-- seccion: la-fabrica-en-numeros -->

It is coordinated by the AI-APPs Factory, an agent sealed on July 2, 2026 that is also a piece of the showcase, with its figures with provenance: seven repositories stamped from the kit —the six sisters and this site—, with the first commit of each between July 4 and August 15, 2026; 24 sprints closed with a retrospective; nine portfolio re-prioritization sessions, because priority expires every four sprints and its gate blocks all work until it is run again; and six human gates: portfolio, vision, sprint plan, release, editing the method and creating repositories or services.

The Factory declares three limits, and I prefer writing them down to hiding them: it does not write production code —that happens in each app's repository, never in the planning house—; the launch and operation phases remain unvalidated in a real run, they are written method and not experience; and there are no live shared libraries between apps, reuse travels stamped in the kit. Its return only counts the coordination eliminated —an estimate of 108 hours a year, with its assumptions declared—; the commercial value of the portfolio remains an unquantified option.

This site carries eight sprints closed this way and 21 architecture decisions recorded in its repository. Every change goes through four continuous integration jobs —quality, integration against a real database, end-to-end tests with accessibility, and Lighthouse with a performance budget— and through the secrets sweep. The infrastructure that supports it is drawn in a blueprint with its real cost, US$0 a month, and with its single point of failure declared: the GitHub account, which is the login for the hosting and the database, mitigated with two-factor authentication. And if the database goes down, voting is declared unavailable; if the AI provider goes down, the chat switches to local search: neither of the two brings down the site.

## Two written approvals and explicit human owners

<!-- seccion: dos-aprobaciones -->

The main rule is explicit: no application advances without two written approvals. The first corresponds to the current priority and demonstrates why that piece deserves to occupy capacity over other alternatives. The second corresponds to the product vision and establishes its purpose, its users, its features —all those of the brief inventoried, not a sample—, its limits and the results it will be evaluated against. Without a current prioritization the harness refuses to plan; without an approved vision, it refuses to open a sprint.

Critical decisions keep explicit human owners. The agent can detect that a definition is missing, organize evidence or propose the next step, but it cannot approve the priority of an initiative by itself, modify its purpose, accept a risk or declare a piece finished. Nor can it edit the method, the standards or the kit without my explicit approval. This separation makes it possible to take advantage of artificial intelligence without diluting responsibility for the result.

This discipline avoids starting with the code when there is still no clarity about the value. A technically interesting idea does not automatically become a priority. Before building, I need to understand what problem it solves, why it deserves investment, what capability it demonstrates and how it will integrate into the portfolio. That is why the planning house inventories 12 conceived initiatives and only 7 have a repository: conceiving is cheap; building is earned.

And approving a sprint plan does not start construction. Once the plan is approved, the agent issues its recommendation of model and effort and waits for my explicit "build" before touching a file. It is a small gate that was born from a repeat offense and stayed.

## Every cycle closes with a summary: the pipeline's memory

<!-- seccion: cierre-con-resumen -->

Every development cycle must close with a summary that documents what was done, the decisions adopted, the changes against the initial vision, the tests executed, the difficulties encountered and the pending work. The summary is not a retrospective formality. It is the memory that allows the next iteration not to depend exclusively on remembering what happened. Without that file, written by the app's repository, the harness refuses to close the sprint, and no run closes without its entry in the list of lessons learned.

This approach comes directly from Industrial Engineering. A process can only be improved cumulatively when its inputs, decisions, results and exceptions are observable. Quality must not depend on the same person remembering how they built the previous piece. It must be incorporated into rules, templates, tests and criteria that can be repeated. The 24 closed sprints of the pipeline are 24 summaries and 24 retrospectives read by the planning house.

Industrial Design complements that structure by keeping the promise of the solution and the experience of whoever uses it visible. The pipeline cannot declare an application finished only because its technical components work. The piece must communicate its purpose, reduce unnecessary complexity and allow another person to understand what they can do, how to do it and what limits they must recognize. Every sprint with an interface closes with a design review against the app's design system and with my visual approval on the preview.

The factory agent turns these rules into an operational capability. It does not replace the process nor make strategic decisions by itself. It helps preserve its discipline, detect gaps and keep the correspondence between the approved vision, the executed work and the piece finally published. The intended result is not to automate software construction indiscriminately. It is to develop a governed factory in which artificial intelligence expands the capacity to analyze, document and execute, while decisions of purpose, priority, risk and acceptance remain explicitly controlled.

## The two precedents that hardened the pipeline

<!-- seccion: los-precedentes -->

The pipeline's rules did not come out of a manual: almost all of them were born from a red. Two precedents explain why there is so much insistence today on seeing the controls fail.

The first is from July 15, 2026. The secrets sweep with gitleaks was installed and reported "all good". When tested with a weak test secret, it passed silently, and it did so twice in a row: modern gitleaks rules demand a real alphabet and entropy, and an improvised bait triggers nothing. Two consecutive false "all good" are worse than no control at all, because they give reassurance. Since then the canonical bait is verified, travels split in the documentation so as not to trigger the hook when committing it, and is verified again in an isolated environment every time gitleaks moves up a major version.

The second is from sprint 3 of this site. A credential of the artificial intelligence provider returned a 401 in the integration: the key was wrong and nothing had warned about it until the piece tried to use it. The chat degraded to local search, as designed, and that was the first real test of the fallback. But the pipeline learned something more useful: today every credential passes a smoke test in phase zero of every sprint, before building against it, and continuous integration repeats that smoke test on every run —an invalid URL or key is discovered now, not at the end—.

Neither of the two precedents was reported as an incident. They were reported as method: the rule that a gate is demonstrated by failing exists because the gate that was never seen failing gave false reassurance twice in the same week.

## The sheet contract

<!-- seccion: el-contrato-de-las-fichas -->

This site is the destination, not the author, of what it shows. The sheets of the applications are administered by the planning house: each app's brochure export plus a curated complement —headline, highlighted figures, limits, "nevers" and process— form the complete sheet. Those of agents, research lines and dashboards are produced by whoever builds each piece, against a technical sheet contract published from the Zod schema —current version 1.3.1—, and they arrive by copy in a content pull request without a sprint, which continuous integration validates: schema, zero links, accessibility and end-to-end tests.

A sheet that does not validate is not corrected here, not even to make it fit: the file, field and rule are reported, and it is corrected at the source. If several do not fit for a legitimate reason of their front, the contract grows additively, in plan mode and with a recorded decision; that is how versions 1.2.0 and 1.3.0 were born. The contract is generated by the tests from the schema —the schema, an example, the visual key and the reference—, not by hand, so that the document and the validator cannot diverge.

One contract and one renderer: the component that paints a sheet renders the schema, not a type of piece, and nothing specific to a front lives in it. What is specific to each front lives in data —the catalog of the four fronts with their state, name and introduction— or in the front's storefront. Thus, adding a piece to the showcase is copying a file and opening a pull request; and since September 2026, that same sheet enters the chat's index on the next build, without writing new prose.

## Code first, artificial intelligence when it is justified

<!-- seccion: codigo-primero -->

One of the most important rules of the pipeline —rule 13— is not to incorporate generative artificial intelligence by default. Before using it, I must demonstrate which characteristic of the problem demands interpretation, generation, contextual retrieval or flexible coordination of tools, and why a deterministic solution is not sufficient or adequate. Activating a generative feature requires a written architecture decision that justifies it.

This rule does not imply first building a conventional solution that I know will be discarded. It means consciously evaluating whether the need can be solved through rules, transformations, structured searches, algorithms or conventional workflows. When these alternatives fulfill the purpose, they usually offer greater predictability, lower cost, better testability and a more direct explanation of their behavior.

The rule can be seen in the six applications. Velo anonymizes with cryptography and validators that cite their official source, and that is why the same file always produces the same result. Dash Agent AI detects what stopped being true deterministically, without a model giving an opinion. Hablemos San measures the energy and tone of the voice with the browser's audio API and does not pretend to recognize the word, because no technology does that reliably today in Spanish for children aged 4 to 6. Innmobiliaria has zero models by product rule. And where there is a model —the narration of the why in Probeta DS, the open questions in Nutri-Kids—, it is an optional feature, with a deterministic fallback and verification that it does not cite a figure that does not exist.

Artificial intelligence is incorporated when it adds a necessary and demonstrable capability, not when it simply makes the solution look more advanced. Its inclusion must be accompanied by evaluation criteria, operational limits, observation mechanisms and a clear definition of the responsibilities that remain in the code and in people.

## Hybrid solutions and control of technological debt

<!-- seccion: hibridas-y-deuda -->

This separation makes it possible to design hybrid solutions. The code manages what needs exactness, validation and reproducible behavior: the contracts, the schemas, the transformations. Artificial intelligence intervenes where interpretation, flexibility or generation is required. The quality of the solution depends on assigning each responsibility to the most appropriate mechanism and not on maximizing the presence of a model. It is the rule this site applies to its own chat: deterministic lexical retrieval first, and the model only as a synthesis layer, interchangeable.

Industrial Engineering again provides the systemic criterion. Before automating an activity, I need to understand what function it serves, what inputs it uses, what variability it faces and what consequences it produces. AI-103 strengthens the dimension of building applications and agents, while AI-300 provides the discipline needed to evaluate, observe and operate those capabilities when they stop being a demo and start being used in a sustained way.

This rule also controls technological debt. A generative feature introduces dependencies, costs, variability and evaluation needs that must not be assumed without purpose. Velo watches over it even at the package level: a continuous integration job audits the dependencies against three vetoed families of artificial intelligence SDKs, and a transitive dependency counts the same as a direct one. The question is not whether I can incorporate artificial intelligence, but whether doing so improves the solution enough to justify the new responsibilities it creates.

## A control is demonstrated by failing

<!-- seccion: controles-que-fallan -->

The second fundamental rule of the pipeline —rule 14— is that a control must demonstrate that it can detect what it was designed for. A test that always shows green, but has never been observed identifying a real or induced failure, offers a sense of security that has not yet been validated.

That is why a new test must be seen failing under the condition it intends to control and then pass that same condition once the problem has been corrected. Only then is there evidence that the control responds to the expected risk and not simply that the code can run without visible errors. And the red travels in the same commit that introduces the gate: the commit that brings the assertion also brings its demonstration recorded in the sprint log —what was broken on purpose, at which step it went red and whom it named—. A gate that is added today and demonstrated tomorrow goes through an entire review without anyone having seen that it knows how to fail, and if the demonstration is postponed, it is forgotten.

This discipline applies to data validations, functional tests, accessibility, performance, security and the behavior of intelligent components. The mechanism changes, but the principle remains: a control needs a demonstrable relationship with the failure it must identify. On this site, the six content coherence gates were born red, with their list of offenders counted in the log, and the number of offenders was the measure of progress until it reached zero.

The practice connects directly with my experience in quality and management systems. A control does not exist because it has been documented. It exists when it can demonstrate that it detects, contains or makes a deviation visible. This same logic underpins my current work with data governance and artificial intelligence: every control must have a purpose, evidence and a way to evaluate its effectiveness.

## The three questions for every gate

<!-- seccion: las-tres-preguntas -->

Three questions are asked of every gate before accepting it. The first: did you see it fail? The second: did you see it run? A skipped job is not green. A job that depends on another that failed is left skipped, and the platform lists it among the required ones without alarm; before closing, every required check must have its own conclusion in success, and if one ran for the first time in that pull request it is said in the summary, because without history neither regression nor non-regression can be claimed. The third: can it even fail? Before writing it, I check that there is a state of the repository that would turn it red and that no earlier rule makes it unreachable —a schema that already rejects the case, a test that already covers it, a build that breaks earlier—. If it cannot fail, it is not a gate: it is removed and a note is made of which rule covered it. In sprint 7 a new gate turned out to be unreachable because of an earlier rule, and it was only discovered when demanding the red from it.

In artificial intelligence components, the rule takes on greater importance because an output can have a convincing form and be incorrect from a functional point of view. It is not enough to check that the agent answers. It is necessary to design scenarios in which it must recognize insufficient information, refrain from claiming something without evidence, handle an unavailable tool or hand over the decision when the level of uncertainty exceeds its limits.

I also apply this logic to information retrieval mechanisms. I do not consider it sufficient to show that an answer includes citations. I must verify that the retrieval answers the question —with 75 questions of my own and 136 from outside running on every change of this site—, that each citation leads to a destination that exists and that the system can declare when the available evidence is not sufficient.

## This very page is also an application

<!-- seccion: esta-misma-pagina -->

CV Viva, the platform from which this content is presented, is part of the portfolio itself. It is not merely a page that describes external projects. It is a versioned, publicly examinable application that turns my career, my assets and their evidence into a navigable experience: an app in Next.js with strict TypeScript and Tailwind, bilingual in Spanish and English, built in 8 sprints, with automated tests at 3 levels —unit, integration and end-to-end—, accessibility verified with axe on every run, a performance budget watched by Lighthouse and continuous deployment with a preview per pull request.

The content is kept separate from the presentation and is managed through structured files and version control: the career, the studies, the achievements, the projects, the certifications and the skills live in one YAML file per language, validated with a Zod schema at build time. If the content is malformed, the build fails, not the page. This decision makes it possible to update the information without manually rebuilding each page, keep the history of changes and apply common rules on dates, sections, projects and claims. Editing the file and pushing updates the web, the PDF for applicant tracking systems and the chat all at once.

Static generation reduces operational complexity and allows a significant part of the site to be consulted without depending on permanent processes on a server. All the content is in the static HTML: a recruiter, a screening bot or a download without JavaScript sees the entire CV, with structured data for search engines and the alternate language tags. The architecture seeks an experience that is fast, accessible and resilient to failures, and technical decisions that respond to the real purpose of the product. Future features are voted with one click and without registration, and the counter is real, on a database with an atomic function: if the database goes down, it says so; it never invents a number.

## The chat, seen from the pipeline

<!-- seccion: el-chat-desde-el-pipeline -->

The platform also incorporates a chat with retrieval augmentation —RAG— that answers over the evidence published on the site itself. Its function is not to improvise a persuasive version of my profile, but to help navigate the information, locate relevant content and answer through references that can be verified. How it works inside, with all its numbers, is in its own document; here is what the pipeline demands of it.

The chat separates the model from the knowledge. The generative provider can change —five are adapted, and it is chosen by environment variable—, but the authorized sources remain in the site's versioned content. This separation prevents the professional identity from depending on the memory or the preferences of a specific model.

When the generative provider is not available, the experience falls back to a local search in the browser. The degradation of the capability is deliberate: the user may lose the generative synthesis, but must not lose access to the information. This decision reflects an architecture principle I use in other contexts: a partial failure should not destroy the entire function if there is a simpler alternative capable of preserving the essential purpose. And the pipeline puts a number on it: a ceiling of US$20 a month and a real cost of US$0.

CV Viva therefore demonstrates several capabilities at the same time: content architecture, experience design, static generation, information retrieval, model integration, source traceability and design for controlled degradation. The application does not claim that I know how to build these capabilities. It allows observing them in operation.

It also materializes the convergence between Industrial Engineering and Industrial Design. The former provides the pipeline, the rules and the structure that make it possible to maintain the system. The latter provides the experience through which a long career can be navigated without becoming an accumulation of information that is hard to understand.

## What remains in exploration: end-to-end analytics on Fabric

<!-- seccion: en-exploracion -->

The pipeline clearly distinguishes between finished pieces and capabilities in exploration. I use this word deliberately because an intention, a proposed architecture or an initial development must not be presented with the same level of certainty as a published and verifiable solution. The two explorations are declared with that word in the app catalog, without promised dates, and they do not count among the 32 pieces.

One of the explorations corresponds to an end-to-end analytical solution on Microsoft Fabric using open data from Colombia. Its purpose is to publicly demonstrate the complete journey from ingestion and storage in a lakehouse to the semantic model and the experience in embedded Power BI.

The piece seeks to make the specialty formalized through DP-600 verifiable. It will not be limited to presenting a final dashboard. It will have to demonstrate how the data was obtained, how it was organized, what transformations were applied, how the semantic model was structured and what security, governance and performance decisions support the solution. The six dashboards already published do not use Fabric —they are desktop pieces published as a versioned project—, and that is exactly the gap this exploration covers in public: what I did assemble end to end on Fabric was at a job, and that cannot be shown.

This exploration will also make it possible to demonstrate the difference between building a report and developing an enterprise analytical product. The value will lie not only in the visualization, but in the reproducibility of the pipeline, the clarity of the model, the traceability of the measures and the possibility of extending the solution without rebuilding it from scratch.

## What remains in exploration: an agent on Gemini and Vertex AI

<!-- seccion: exploracion-gemini-vertex -->

The second exploration corresponds to an autonomous agent with tools, built on Gemini and Vertex AI with LangChain. Its purpose is to extend my experience toward an architecture different from the Microsoft ecosystem and to understand in a practical way its models, tools, deployment patterns and operating mechanisms. It is the multi-cloud complement of my certification path in Azure, where AI-103 and AI-300 are in progress.

I do not present this exploration as evidence of deep experience in Google Cloud. My main experience is in Microsoft technologies, and Google Cloud appears in my skills as "in exploration", with no committed horizon and no real use yet of its data services or of Vertex AI. Precisely for that reason I chose to build a verifiable piece instead of adding tool names to a list. The goal is to turn a recognized gap into a demonstrable capability.

The multi-cloud exploration does not seek to exactly duplicate an existing solution. It seeks to identify which principles remain and which decisions change when the same class of problem is approached through another ecosystem. Agent architecture keeps needs such as context, tools, evaluation, observability, security and governance, even though the concrete services and patterns are different.

In both cases, the exit condition of the exploration must be defined before starting. A piece does not leave this state by having a functional interface or a convincing demo. It must have a verifiable purpose, a documented architecture, identified sources and dependencies, executed tests, satisfied quality criteria, a reproducible deployment and a sheet that clearly differentiates measured results from expectations not yet verified. Only then can it join the inventory of built pieces, and the showcase counter moves only when its sheet enters, not when I announce it.

## What the pipeline demonstrates about how I work

<!-- seccion: lo-que-demuestra-el-pipeline -->

The value of the pipeline is not found only in the number of pieces it has produced. It is found in the way of working that makes it possible to build them and subject them to a common standard: the six standards plus one —testing, continuous integration and deployment, observability, security, performance, experience and accessibility, and responsible embedded artificial intelligence— which are tested in the continuous integration of each app, not suggested.

Every initiative starts with a priority and a vision. Every feature needs a reason. Every figure must declare its provenance. Every control must demonstrate that it detects a failure. Every cycle must leave memory. Every generative capability must justify why conventional code is not enough. Every piece must clearly distinguish between what was built, what was measured, what was inferred and what still remains in exploration.

This discipline connects directly with my professional career. Industrial Engineering provides the structure of the process, measurement, constraint management and continuous improvement. Industrial Design keeps the promise to the user visible and forces turning complexity into an understandable experience. Data science provides the methods to learn from information. DP-600 provides the analytical platform and the semantic models. AI-103 strengthens the construction of applications and agents. AI-300 extends the capacity to evaluate and operate them reliably.

The pipeline also demonstrates that I do not understand artificial intelligence as an indiscriminate substitute for professional work. I use it as part of a governed system, where decisions of purpose, priority, acceptance and risk remain explicit. The agent accelerates and organizes, but does not remove responsibility for the result.

Building through this system allows me to turn every project into something more than a deliverable. Each piece leaves decisions, components, tests, patterns and lessons that reduce the uncertainty of the next one. The portfolio grows not only in quantity, but also in memory, consistency and accumulated capability: 24 sprints closed in the pipeline, 21 decisions recorded on this site alone.

That is the main claim the pipeline makes it possible to demonstrate: I do not build applications, agents, research lines and dashboards as isolated exercises. I build a work architecture capable of turning problems into verifiable products, rigorously distinguishing between intention and result, learning from every cycle and progressively raising the standard with which I approach the next one.
