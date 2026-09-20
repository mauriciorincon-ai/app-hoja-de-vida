---
slug: como-trabajo
titulo: "How I work"
resumen: "How I work, with the evidence behind each trait: process first (BPMN), adoption as the indicator (50+ users), leading teams of up to 20 people, the board of directors and the SITP working tables, and which instrument goes with each decision."
cuando_usar: "Use this when they ask how he works, how he leads a team, how he communicates with business areas and senior management, what he values in a project, how he handles people who do not report to him, or whether he is a process or a technology profile."
estado: aprobado
ancla: "#perfil"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "How does Henry work?"
  - "How does Henry lead a team and how does he communicate with business areas?"
  - "What is the largest team he has led?"
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

<!-- guide (comes from the story skeleton, S3 — written by the owner):
How you think and work: your approach to solving problems, how you lead
teams, what you value in a project, how you communicate with stakeholders.
What a hiring manager would ask in the first interview. -->

## Facing a new problem: first the process, then the tool

<!-- seccion: primero-el-proceso -->

I am an industrial engineer from the Javeriana before I am a data engineer, and that way of understanding the world is still one of my greatest competitive advantages. Over ten years of career —since August 2016, at Inglopres— I have confirmed that the most complex problems in an organization are rarely technological problems; they are problems of understanding. That is why, when I face a new challenge, I do not start by asking myself which tool to use or which model to build. I start by understanding how the system that produces the result works: who its actors are, which decisions are made, what information circulates, what constraints exist and where the inefficiencies that end up hitting the business originate.

My way of working starts from a simple conviction: technology amplifies what already exists, but it does not fix deficient processes. A dashboard does not solve a lack of operational clarity. A predictive model does not correct an inconsistent definition. A modern platform does not transform an organization on its own. Before designing solutions, I need to understand the logic of the process that will make them sustainable. Understanding who does what, with what information, under which rules and with what impact is far more valuable than quickly implementing a tool whose usefulness fades within a few weeks.

I have seen organizations invest significant amounts of time and resources in analytics initiatives that end up underused because nobody paid enough attention to understanding the process that fed the data. When that happens, the result is usually the same: indicators that generate debate instead of trust, reports that answer irrelevant questions and technically sophisticated solutions that never manage to integrate into the operation. My priority has always been to avoid that scenario by connecting operational understanding with the analytical architecture from the very start. The first time I lived it was at Inglopres, in 2016: I could not improve processes because nobody generated the data, and the solution began by designing how to capture it, not by choosing the tool.

## Modeling the process in BPMN before deciding what to measure

<!-- seccion: modelar-el-proceso-en-bpmn -->

For that reason I consider process modeling a fundamental discipline within any serious data strategy. A correctly represented process makes it possible to understand dependencies, identify bottlenecks, discover information waste, expose hidden rework and find automation opportunities that normally go unnoticed when only the technological layer is observed. The quality of an analytical solution depends directly on the quality of the understanding one has of the system that originates it.

That philosophy explains a practice I apply consistently: when a process deserves to be documented, I represent it with formal standards —my preferred standard is **BPMN**— and the tool I have done it with is **Bizagi**. I did it four times in different jobs, always before touching the technology:

| Where               | When                            | What was modeled                                                                                                   |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Inglopres**       | August 2016 – June 2017         | the machinery rental operation before implementing the ERP; there I also used FlexSim                             |
| **Ceinfes**         | November 2017 – November 2018   | the chain scheduling → material → application → digitization, each front with its own window                      |
| **Cafam**           | October 2020 – June 2021        | receiving, storage, picking and dispatch, contrasted with the WMS before testing it; FlexSim as well               |
| **Banco Pichincha** | March – July 2023               | the analytical products placed within the activities and decisions they had to support                            |

Modeling first also decides **what to measure**: every activity generates or consumes information and produces events, and if those events are not captured, the later analysis will depend on manual reconstructions. That is why the process and the data model are not designed separately. The complete method —Bizagi, FlexSim, discrete-event simulation and work study— is in the processes and simulation document; what matters here is the principle: the diagram comes before the data, and the data before the tool.

## Process mining and living diagrams: a BPMN that does not age

<!-- seccion: process-mining-y-diagramas-vivos -->

Whenever possible, I prefer the diagram to be generated automatically from the data that describes the real execution of the process: this is what is known as _process mining_. I am not interested in building static diagrams that become obsolete photographs of a reality that changes constantly. I am interested in building living representations of the business, capable of evolving alongside the operation and reflecting its transformations objectively.

A manually drawn diagram starts losing validity from the moment the process changes. In contrast, a model generated from the events, rules and records the operation itself produces becomes a permanent source of knowledge. The difference seems subtle, but it is enormous: one no longer depends on isolated perceptions or interpretations; one works on observable and verifiable evidence. This approach allows organizational knowledge to evolve at the same pace as the business.

I am precise about what this is in my career: process mining over a real event log is the **method I would apply**, not a case I have run in a company. What is built and in operation is the version of that principle in my own showcase: the BPMN diagram of each of the 32 pieces —6 applications, 13 agents, 7 research pieces and 6 dashboards— is generated from the piece's process definition, with an engine of my own, and is validated in the build. Nobody draws those diagrams by hand: if the definition changes, the diagram changes with it, and if the definition is malformed, publication fails before going out.

## Understanding the system, not producing more reports

<!-- seccion: entender-el-sistema -->

Deep down, my interest has never been to produce more reports or implement more tools. My goal is to understand how organizations really work in order to help them make better decisions, design more efficient operations and build analytical capabilities that generate value in a sustained way. Tools change constantly. Processes evolve. But the ability to understand a system in depth, model it correctly and transform it based on evidence remains a differentiating advantage that transcends any technology.

I have applied it in four sectors with different logics: machinery rental logistics at Inglopres, with a fleet of some 120 machines and vehicles; educational assessment at Ceinfes, with more than 100 schools served per year; Bogotá's mass transit in two stages with C&M, first the supervision of some 150 routes from 10 concessionaire companies and later TransMilenio's post-operational analysis; the logistics of a medicines distribution center at Cafam; banking at Banco Pichincha; an AI agents startup at Vesting; and today healthcare at Fundación CTIC. In all of them, the opening question was the same: how does this system work and which decision needs to change? The tool came afterwards, and it was different every time —Odoo, VBA, SQLite, Power BI, Microsoft Fabric, agents—, because the tool is chosen for the system and not the other way around.

## Adoption is the indicator, not the deliverable

<!-- seccion: la-adopcion-es-el-indicador -->

One of the most important lessons I have learned in the world of business intelligence and artificial intelligence is that building a solution is rarely the hardest part. What is truly complex is getting people to incorporate it into their way of working, make it part of their decision routines and trust it when they face questions that are critical for the business. The distance between a technically correct solution and a truly valuable solution is usually determined by adoption.

Organizations frequently concentrate their efforts on building reports, dashboards, applications, models, platforms or solutions, assuming that the simple fact of making the information available to users will automatically generate value. My experience has shown me the opposite. Value appears when a solution manages to change behaviors, speed up decisions, reduce uncertainty and become an everyday element within work processes. If that does not happen, even the most sophisticated implementation ends up being little more than a technical exercise.

For that reason I always design solutions starting from the decision they will have to enable. Before thinking about visualizations, indicators or features, I try to understand who will use the information, which questions they need answered, which actions they will have to take based on it and what consequences a better decision will have on business results. When a solution is born from the context of use and not only from the availability of data, the odds of adoption rise significantly. At Banco Pichincha, in 2023, that was the entire problem of the role: the area produced technically correct dashboards that the business never quite adopted, and the answer was not a new visualization but starting from the questions of the person who decided.

## Adoption measured: 50+ users in banking, 25+ in transit, 15+ in logistics

<!-- seccion: la-adopcion-medida-en-cifras -->

I do not state it as doctrine: I have measured it four times, with different users and decisions in each context.

| Where                                         | Product                                                                | Adoption                                            | Effect                                          |
| --------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------- |
| **Banco Pichincha**, 2023 | dashboards for deciding, built by the team of 5 I led | **more than 50 business users** | +25% in decision-making |
| **TransMilenio / C&M Consultores**, 2021–2022 | Power BI in post-operational analysis                                  | **more than 25 key users** of the operation         | +35% efficiency of the analytical processes     |
| **Cafam**, 2020–2021                          | the BI for controlling the WMS implementation                          | **more than 15** directors, coordinators and heads  | +50% accuracy in test tracking                  |
| **Fundación CTIC**, since 2025                | 42 analytical products by process, 23 of them dashboards               | **20 leaders** of 15 processes and some 75 users    | close to 60% less preparation effort            |

"Key users" matters: in transit they were not people with access but the people responsible for scheduling, tracking and service decisions. At Cafam, the fifteen were the roles that answered for the project —the medicines directorate, the IT one, the project one, the distribution center one and its coordinators and heads—, and fifteen people with direct responsibility over a critical process are worth more than hundreds who consult it every now and then. How I distinguish access, use, adoption and impact, and how I measure adoption without confusing it with visits, is in the BI document.

## Adoption is a human challenge and an organizational capability

<!-- seccion: adopcion-desafio-humano -->

I also consider adoption a challenge that is as much human as technological. Organizations do not change merely because a new tool exists; they change when people understand its usefulness, develop trust in the information and clearly perceive how the solution makes their work easier. That is why change management, communication, training and accompanying users are components as important as the data architecture or the visual design of a dashboard. At Banco Pichincha, the training program for 12 professionals —Power Query, semantic modeling, DAX and executive communication about their own products— was part of the product and not an appendix, and it contributed to a 20% increase in the productivity of preparing and using information.

The most successful analytics and artificial intelligence initiatives I have led share a common pattern: they were not conceived solely as technology projects or as isolated deliveries of reports, applications, automations, solutions or AI agents. They were designed as organizational capabilities meant to integrate into processes, expand people's capabilities and sustainably transform the way information is analyzed, work is executed and decisions are made.

My goal has never been to deliver information without a clear purpose, automate activities without understanding their impact or incorporate artificial intelligence simply because the technology allows it. I seek to design reliable, governed solutions aligned with the real needs of the business, capable of turning data into knowledge, knowledge into decisions and decisions into verifiable actions. This may materialize as an analytics platform, an intelligent application, an automation solution or an AI agent, but the success criterion is the same: that the capability created is adopted, generates trust and produces a tangible impact.

In that sense, I understand each solution as part of a broader system of organizational enablement. True transformation happens when people can operate with greater clarity, access the knowledge they need in a timely manner, reduce the burden of repetitive tasks, make decisions faster and act with confidence on a consistent view of reality. Technology is the enabler, but the expected result is an organization that is smarter, more autonomous, more efficient and better prepared to evolve.

## How I lead a team

<!-- seccion: como-lidero -->

I understand leadership as the ability to create the conditions for a team to produce extraordinary results without depending on permanent supervision. My responsibility as a leader is not to concentrate every decision or review every move, but to set a clear direction, translate strategic objectives into understandable priorities and give people the context, resources and autonomy they need to execute with judgment.

I have learned that high-performing teams are not built by increasing control, but by eliminating ambiguity. When each person understands which problem we are solving, why it matters, what their contribution is, which dependencies they must manage and how we will recognize a successful result, tracking stops being a surveillance mechanism and becomes a tool for coordination, learning and continuous improvement.

That is why, before starting an initiative, I make sure there is a shared understanding of what it means to make progress and, especially, of what it means to be finished. Defining clear acceptance criteria, quality standards, responsibilities, risks, constraints and expected results avoids contradictory interpretations and removes a significant part of the rework. For me, a rigorous definition of done is not a methodological formality; it is a trust agreement that protects quality, aligns expectations and lets the team act with greater autonomy. At Cafam, with 20 people testing a WMS, we did not cut errors by 25% with more supervision, but by writing down, before starting, what counted as a tested case and who signed it off.

My leadership style combines clarity of purpose with flexibility in execution. I set the result we need to reach and the principles that should guide the work, but I do not try to impose a single way of getting there. I trust people's specialized knowledge, encourage well-founded discussion and make sure the best decisions emerge from evidence, collective analysis and the team's experience, not from the hierarchy of whoever voices an opinion.

## The teams I have led: 20 people at Cafam, 12 at Inglopres, 5 at Banco Pichincha

<!-- seccion: equipos-que-he-liderado -->

The largest team I have led was the one at **Cafam**: 20 people, 14 from Cafam and 6 from the WMS vendor, in the implementation testing of Oracle WMS Cloud for a medicines distribution center, between October 2020 and June 2021. Before and after there were teams of other sizes and other natures:

| Where               | When                            | Team                                                                                                                                       | Result                                                              |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **Inglopres**       | August 2016 – June 2017         | 12 people, operators and technicians                                                                                                       | 95% customer satisfaction, measured by survey                       |
| **Ceinfes**         | November 2017 – November 2018   | three fronts: some 7 people in scheduling (plus some 50 teachers indirectly), some 12 in digitization and some 20 in logistics             | more than 100 schools per year served on time                       |
| **Cafam**           | October 2020 – June 2021        | 20 people, 14 in-house and 6 from the vendor                                                                                               | −25% errors and +15% operational efficiency                         |
| **Banco Pichincha** | March – July 2023               | 5 people reporting to me in the BI team                                                                                                    | 50+ users adopted the dashboards; −35% in analysis times            |

After Cafam my leadership changed shape: I moved on to leading **complete processes that bring together a large number of people who do not report to me**. At Vesting, between August 2023 and January 2025, I led the startup's data strategy: the platform on Microsoft Fabric and the eleven-stage core process with which 27 agents were designed and implemented, working directly with the founders. At Fundación CTIC, since March 2025, I lead the institutional artificial intelligence strategy and the analytics used by 20 leaders of 15 processes. Neither of those two assignments has an org chart beneath me; both demand more leadership than any of the previous ones, because the result depends on people over whom I have no hierarchical authority.

## How I work with people who do not report to me

<!-- seccion: personas-que-no-me-reportan -->

This way of leading is especially important in data and artificial intelligence initiatives, where the quality of a solution depends on collaboration between very different perspectives. Specialists in data, analytics, development, architecture, user experience, processes, security, governance and business knowledge must work around a common vision. My job is to connect those capabilities, facilitate a shared language and make sure technical sophistication stays subordinate to the purpose, reliability, adoption and value of the solution.

I also distinguish between delegating tasks and truly distributing the capacity to decide. Autonomy does not consist of leaving people alone in front of a goal; it consists of giving them enough context, explicit limits, timely access to information and safe spaces to raise risks, question assumptions and propose alternatives. When these elements exist, people not only execute better, but develop judgment, take responsibility for the result and progressively strengthen their ability to solve problems of greater complexity.

Three times I have worked on initiatives where collaboration could not be ordered. At Cafam, the team was mixed: 14 people from the caja and 6 from the WMS vendor, with different contractual interests, and the only way for a test case to be closed was for both sides to have agreed beforehand on what "tested" meant. At C&M Consultores, between July 2021 and May 2022, I coordinated working tables with the management of the SITP concessionaires —companies that did not depend on us or on each other— to define improvement strategies, and the system's indicators rose by 25%. At Fundación CTIC the AI strategy only moves forward if the process leaders adopt it: my direct line is with the Planning Directorate and with the sub-directorates of technology, information management and quality, and from there it goes down to each process with its owner. In all three cases the tool was the same: each actor's problem clearly understood, a definition of done agreed before starting and evidence visible to everyone.

## Visible tracking, not surveillance: Kanban, Scrum and a board meeting every Friday

<!-- seccion: seguimiento-visible -->

I do not believe in a tracking culture based on constant meetings, excessive reports or supervision of individual activity. I prefer to build working mechanisms in which progress, blockers, decisions and dependencies are visible to everyone. This transparency makes it possible to intervene where it is really needed, anticipate difficulties, coordinate efforts and hold conversations based on facts. Tracking then stops answering the question of who is working and concentrates on understanding whether we are producing the right result, with the expected quality and at the pace the organization requires.

The first time I set up that mechanism was at Ceinfes, in 2018: with the technology area I took the operation to **Kanban** —a pull board with a limit on work in progress for the flow of requests— and to **Scrum with sprints** for projects, and I presented a report to the board of directors **every Friday** for a year. The board did not receive a list of activities: it received indicators on logistics, digitization and human resources scheduling, and out of those Fridays came concrete decisions —incentive programs, improvements in working conditions, workstation redesign, process redesign and software redesign—. That is the tracking I care about: the kind that produces a decision, not the kind that produces a report.

Nor do I conceive of error as an automatic reason to intensify control. In innovation, analytics and artificial intelligence environments, a certain amount of experimentation is indispensable to discover better solutions. My approach consists of distinguishing the errors that produce learning from those that come from ignored risks, insufficient controls or lack of discipline. I promote a culture in which it is possible to experiment responsibly, validate hypotheses early, document learnings and correct course before an uncertainty becomes a large-scale problem. At Cafam, for example, the inventory validation between the WMS and the source system was done on the 80-20 medicines: at the start none of them matched, and instead of looking for culprits it became a permanent review that closed the differences medicine by medicine.

## Raising the team: feedback, autonomy and maturity

<!-- seccion: elevar-al-equipo -->

For me, leading also means raising the team's capabilities. I try to identify each person's strengths, create opportunities for them to take on progressively more complex challenges and encourage knowledge transfer as a regular practice. A team should not become more dependent on its leader over time; it should develop greater autonomy, better decision criteria and a growing ability to sustain and expand the results achieved. At Banco Pichincha that took the form of a training program for 12 professionals; at Inglopres, that of a team of 12 operators and technicians that reached 95% customer satisfaction by assigning and monitoring tasks, not by supervising people.

Feedback holds a central place in this process. I want it to be timely, specific and growth-oriented, not a late evaluation limited to pointing out deviations. Likewise, I expect the team to be able to question my decisions and offer me feedback with the same openness. I believe authority does not reduce the need to listen; it increases it. The greater a person's responsibility, the more important it becomes to protect the diversity of perspectives and prevent hierarchy from silencing relevant information.

My leadership adapts to the nature of the challenge and the degree of maturity of the team. There are moments that require more direction, especially when there is uncertainty, critical pressure or a capability still in formation. In other contexts, my main contribution consists of removing obstacles, facilitating decisions and letting people move forward. I do not apply autonomy as a uniform formula; I develop it consciously, accompanying each person until they can exercise it with responsibility and confidence.

Ultimately, I do not evaluate my leadership by the number of decisions that pass through me, but by the clarity with which the team can move forward when I am not present. Effective leadership shows in people who understand the purpose, collaborate transparently, solve problems with judgment, maintain high standards and take responsibility for the impact of their work. My goal is not to be the center of the operation, but to help build teams capable of learning, adapting and generating sustainable results in complex scenarios.

## How I communicate with business areas and senior management

<!-- seccion: como-hablo-con-el-negocio -->

Throughout my career I have worked closely with senior management, business leaders and heads of strategic areas: the board of directors of Ceinfes, the management of the SITP concessionaires, the directors of Cafam, the founders of Vesting and today the Planning Directorate and the sub-directorates of Fundación CTIC. This experience has taught me that communicating analytics and artificial intelligence in executive settings does not consist of oversimplifying complexity or showing off technical depth. It consists of turning that complexity into a clear understanding of reality, of its implications and of the decisions that must be made.

When I talk with senior management, I do not start with the tool, the model or the architecture. I start with the business purpose, the decision that needs to be made and the impact it can generate. My responsibility is to connect the data with the organization's questions, present the findings in understandable language and make explicit the consequences of acting, waiting or staying the current course. Technology belongs to the design of the solution; the executive conversation must concentrate on value, risk, opportunity and the capacity to execute.

I have learned that a person does not decide on a table, a dashboard or a collection of indicators. They decide when they can understand a situation, recognize its causes, compare alternatives and explain with confidence why an action is advisable. That is why, behind every analysis, I try to build an executive narrative that clearly answers what is happening, why it matters, what evidence proves it, what may happen and which decision is worth considering. I arrive with two levels: one slide with the consequence and a number, and behind it the traceable base in case they ask for it. I work in professional English (B2) when the team or management requires it.

## The Ceinfes board of directors and the SITP working tables: two schools of executive communication

<!-- seccion: junta-directiva-y-mesas-sitp -->

I learned to talk with the business in two very different settings, and in both the conversation moved for the same reason: a defensible sentence with its provenance behind it.

The first school was the **board of directors of Ceinfes**, to which I presented reports **every Friday** between November 2017 and November 2018. I arrived with the KPIs of three areas —logistics, data digitization and human resources scheduling— on an operation that served more than 100 schools per year, with some 250 answer sheets digitized per session and 10% manual capture. The board did not discuss the arithmetic: it discussed what to do. Out of those Fridays came incentive programs, improvements in working conditions, the redesign of workstations and processes and the redesign of the operation's software; even the human resources scheduling, which at first was done by hand with Google Calendar, ended up in a VBA macro that I designed to optimize it, because the Friday data showed where time was being lost.

The second school was the **working tables with the management of the SITP concessionaires**, at C&M Consultores, for TransMilenio's Operating Task Force. There the audience did not report to me and had no reason to believe me: they were companies with contracts and interests of their own, and my reports supported contractual and economic consequences. What made it possible to agree on improvement strategies was that every figure arrived with its source —fare collection, fleet and GPS, scheduling, incidents and PQR (complaints and claims), unified in an ETL that raised the accuracy and speed of the analysis by 70%— and with its explicit definition. The system's indicators improved by 25% after those tables.

Then came different audiences with the same rule: at Cafam, the directors of medicines, IT, project and distribution center read the control BI; at Vesting I worked directly with the startup's founders; at Fundación CTIC I have permanent communication with the Planning Director and the sub-directors of technology, information management and quality. The sector and the hierarchy change; what does not change is that a decision needs a clear sentence and a figure that can be defended.

## Facts, hypotheses and recommendations: organizing complexity, not hiding it

<!-- seccion: organizar-la-complejidad -->

For me, effective executive communication does not hide complexity; it organizes it. I distinguish carefully between facts, interpretations, hypotheses and recommendations, because each requires a different level of confidence. I also make assumptions, constraints and margins of uncertainty visible. I do not present an estimate as if it were a measurement or a correlation as if it proved causality. Explaining the limits of an analysis does not weaken a recommendation; it strengthens the quality of the decision and the confidence of those who must back it.

I keep one fundamental rule: every figure must have identity and provenance. If I cannot explain where a piece of data comes from, how it was transformed, which definition it represents, when it was updated and under which conditions it can be used, I consider it not yet ready to support an important decision. Traceability is not, for me, a technical or documentary detail. It is an essential condition for building trust, facilitating validation and protecting the organization from mistaken interpretations. I apply the rule to myself as well: the figures in this CV distinguish whether they were measured, calculated, declared or estimated —the "close to 60%" less effort at Fundación CTIC goes with "close to" because it is an estimate, and that is how it is said—.

This principle extends to the analytics platforms, intelligent applications and artificial intelligence agents I design. Every relevant result must preserve the context needed to understand whether it comes from a direct observation, a calculation, a declaration, a business rule, an estimate or an inference generated by artificial intelligence. When a solution can show not only an answer but also its origin, confidence level and conditions of use, it stops working as a black box and starts becoming a reliable business capability. The technical sheets of the 32 pieces in my showcase label every figure with its provenance for that reason.

## Communicating what artificial intelligence can and cannot do

<!-- seccion: comunicar-los-limites-de-la-ia -->

In the case of artificial intelligence, I consider it especially important to communicate precisely what a solution can do, what it cannot guarantee and in which decisions human intervention must be kept. An AI agent can consult information, synthesize knowledge, recommend actions or execute certain tasks, but its business usefulness depends on it operating within clear limits, using authorized sources and allowing the elements that underpin its results to be verified. Trust must not be based on how confident an answer looks, but on the soundness of the architecture, the quality of the data and the possibility of supervising its behavior.

I practice it in every agent I build, and with senior management I say it before they ask. The ISO 42001 Expert in my showcase does not rule on conformity or replace an audit: it locates requirements and cites the clause and the page of the corpus, or declares the gap. The chat of this very CV answers only with what this corpus says and shows the sources it used; when it finds no support, it says so instead of inventing. At Vesting, between August 2023 and January 2025, the real-time monitoring of up to 23 agents at a time existed precisely so that the founders and the clients would know what each agent had done, at what cost and in what state, and would not have to trust the appearance of an answer. And at Fundación CTIC, the AI strategy sets which use cases move forward and with which controls: of 12 opportunities identified, 7 cases evaluated, 3 prioritized and 2 documented, and none is presented to management as if it were already solved.

## Involving management from the definition of the problem

<!-- seccion: direccion-desde-la-definicion -->

My relationship with senior management is not limited to presenting results when an initiative is over. I try to involve them from the definition of the problem, because that is where the right questions, the expected results, the acceptable risks and the criteria by which success will be judged are determined. This joint work lets solutions be born aligned with the strategy, avoids investments disconnected from real priorities and makes it easier for architecture, governance and adoption decisions to answer to a shared business vision. At Fundación CTIC, the 12 AI opportunities identified were evaluated with the process leaders and the sub-directorates before any of them had an architecture: 7 cases evaluated, 3 prioritized and 2 documented, each with its owner in the business.

I also understand that working with management requires adapting the conversation without losing rigor. A board of directors, an executive committee, a functional management and an operational team need different levels of detail, but all must receive a coherent version of reality. My job is to preserve the same analytical truth while adjusting the depth, the language and the focus to each audience's responsibility. I do not communicate less information; I communicate the information needed for each person to act within their sphere of decision. It is what a shared semantic model allows, like the one I left at Banco Pichincha in 2023: the depth of each view changes, not the figure.

I do not conceive of an executive presentation as a one-way transmission of conclusions. I use it as a space to contrast perspectives, discover information not yet represented in the data, question assumptions and build agreements on the way forward. Management brings strategic context, institutional knowledge and an understanding of the environment. My contribution consists of structuring that knowledge, connecting it with verifiable evidence and turning it into decisions that can be translated into actions, owners and tracking mechanisms.

## Explicit alternatives and a decision with an owner, a deadline and an indicator

<!-- seccion: decision-con-responsable -->

When I present several alternatives, I make their benefits, costs, dependencies, risks and effects on the organization explicit. My goal is not to bring an apparently finished solution to get approval, but to provide the elements management needs to exercise its judgment. A sound recommendation must be clear in its direction, transparent in its assumptions and traceable enough to be defended before other governance bodies. At Cafam, for example, the VBA integrations that kept running after go-live were defended with their figures —+15% automation and −50% data errors— and not with the novelty of the tool.

After an executive conversation, I want more than a convincing presentation to remain. What must remain is a shared understanding of the problem, an explicit decision, an owner, an execution horizon and a concrete way to measure the result. For me, communicating well does not mean getting nods during a meeting. It means getting the evidence to become a decision and the decision to move toward a verifiable action. The Ceinfes Fridays ended that way: not with "thanks for the report", but with an approved incentive program, a redesigned workstation or a software change with a date.

Ultimately, my purpose when talking with the business is to build a reliable bridge between technological complexity and executive responsibility. I translate data, analytical models, applications and artificial intelligence architectures into conversations about growth, efficiency, risk, sustainability and transformation. The quality of my communication is not measured by the amount of information I present, but by the clarity I generate, the trust I build and the decision-making capacity I leave installed in the organization.

## What I value in a project: a real problem with measurable impact

<!-- seccion: que-valoro -->

I value projects that turn relevant problems into lasting business capabilities. For me, a high-value initiative does not start with a tool, a technology or a previously defined solution. It starts with a real problem, important enough to justify the investment and clear enough to establish a baseline, formulate expected results and measure objectively whether the intervention produced an improvement.

The first criterion I evaluate is the relevance of the problem. I need to understand which situation must change, who experiences its consequences, which processes or decisions it affects, how much value is being lost and what would happen if the organization decided not to intervene. This understanding prevents innovation from becoming a search for use cases for a technology and lets the effort concentrate on challenges that really matter. I do not consider a project valuable for the novelty of its components, but for the magnitude and sustainability of the result it can generate. At TransMilenio the problem was sharp: the operation generated data faster than it could be analyzed, with five sources that did not talk to each other; the ETL that unified them raised the accuracy and speed of the analysis by 70%, and that figure exists because the problem had a baseline.

I also make sure every project has an explicit relationship between investment, adoption and impact. Technical indicators can prove that a solution works, but not necessarily that it is generating value. That is why, in addition to evaluating quality, accuracy, availability or performance, I consider it necessary to measure its incorporation into processes, the frequency and depth of use, the decisions it enables, the time it frees up, the risks it reduces and the results it helps improve. Value must be observable beyond the implementation: at Banco Pichincha the predictive models for churn, delinquency and risk had more than 90% accuracy, but what counted was that they reached production and improved by 35% the predictions the business was already using.

## A business owner willing to adopt the solution

<!-- seccion: responsable-del-negocio -->

The second criterion is the existence of a business owner willing to make the solution part of the operation. Executive sponsorship or budget approval is not enough. A project needs people who know the context, take part in defining the problem, validate the results, lead adoption and take responsibility for the expected value. When technology lacks an owner in the business, it can reach great technical quality and still remain disconnected from the decisions and processes it was meant to transform.

I have a case for each side of that statement. At Banco Pichincha, the more than 50 users who adopted the dashboards existed because the business defined the questions before the team of 5 built a single visualization, and the 25% increase in decision-making was theirs, not the dashboard's. At Cafam, the BI for controlling the WMS implementation had fifteen users with job titles —the directorates of medicines, IT, the project and the distribution center, and the center's coordinators and heads— and that is why it improved the accuracy of test tracking by 50%: every finding had someone who answered for closing it. At Fundación CTIC, the 42 analytical products are assigned to 20 leaders of 15 processes, and there are 10 analysis plans under follow-up with those same leaders.

And I have seen the opposite case too, without naming it: a correct product, published, with nobody in the business who needed it to decide, which lost relevance in a short time. It is the reason why the first question of any project is not "what data is there" but "who is going to decide with this".

## A capability that outlives whoever built it

<!-- seccion: capacidad-que-sobrevive -->

The third criterion is that the capability created can operate, be maintained and evolve without permanently depending on those who built it. For me, a solution is not really finished when it passes a demo or goes into production. It is finished when it has an understandable architecture, traceable sources and transformations, reusable components, defined controls, useful documentation, observability mechanisms and an operating model that lets other people administer, reproduce and improve it safely.

This condition is especially important in data and artificial intelligence initiatives. An analytics platform, an intelligent application or an AI agent should not be conceived as an isolated piece. It must integrate into a broader architecture, operate on reliable information, respect explicit limits, manage identities and permissions properly, keep evidence of its results and allow human intervention when the level of risk requires it. The real value lies not only in the solution working today, but in the organization being able to trust it, govern it and adapt it as its needs change.

Vesting is my proof of this criterion. Between August 2023 and January 2025 I designed the startup's data ecosystem from scratch on Microsoft Fabric —120 tables, 20 GB, 1,000 events per day, 12 clients integrated in separate workspaces— and the real-time monitoring of its agents; but what I left behind was not a platform only I understood: it was the eleven-stage core process, documented and validated, with which the 27 agents in the inventory were designed and implemented, so that every new agent built on what was learned from the previous ones. I closed that stage by leaving the ecosystem and the process documented; the startup kept building on them without me. That is the result I pursue: not that they need me, but that they do not.

## Reusable assets and knowledge transfer

<!-- seccion: activos-reutilizables -->

I also value each project producing reusable assets. If an initiative solves a single case, it generates a one-off benefit. If it also leaves architecture patterns, components, connectors, evaluations, security criteria, governance practices and reproducible learnings, it creates a base that reduces the cost and risk of the following initiatives. At that point, the project stops being an isolated implementation and becomes a platform for accelerating new capabilities.

This logic is particularly relevant in the design of artificial intelligence solutions and agents. The goal should not be to build an agent as a standalone demo, but to establish a reliable framework for identifying use cases, selecting solution patterns, connecting authorized sources, evaluating the quality of answers, managing risks, supervising behaviors and taking new capabilities to production consistently. The first agent can prove feasibility, but the strategic asset is the system that makes it possible to build, govern and scale the next ones. That is how the core process was born at Vesting, and that is how my own pipeline works: the 6 applications in my showcase are born from the same method —the same way of planning by sprints, the same automated tests and the same controls—, so that each one builds on what was learned from the previous one.

Knowledge transfer is part of the expected result. I do not consider it enough to deliver extensive documentation if nobody can use it. I make sure the knowledge is embedded in standards, repositories, architecture decisions, operating procedures, automated mechanisms and practices that other teams can apply. Documenting does not consist of recording retrospectively what was done. It consists of designing, from the beginning, a solution that is understandable, observable and transferable. Each of the 32 pieces in the showcase carries its technical sheet with the same contract —promise, figures with provenance, limits, what it never does, process in BPMN—, and that contract is the same one the other houses use to deliver theirs.

## A project that learns after being implemented

<!-- seccion: proyecto-que-aprende -->

A high-value project must also learn after its implementation. Needs change, data evolves, models can degrade, users discover new ways of using the solutions and risks appear that were not always visible in the initial design. That is why I value initiatives that include mechanisms to observe their behavior, receive feedback, measure results, detect deviations and evolve in a controlled way. Going into production does not represent the end of the project, but the beginning of its validation in reality.

Three examples with dates. The demand model by time band that I built for TransMilenio at C&M Consultores ran for 10 months with monthly updates, validated with RMSE respecting the temporal order, and it was used by the professionals who presented the reference demand report to the units: a model that is not retrained and not observed stops being worth anything without warning. At Vesting, the real-time monitoring of up to 23 agents at a time was the way for an agent in production to keep learning from real use and not only from design. And at Fundación CTIC, the 42 analytical products were not delivered and that was it: there are 10 analysis plans under follow-up, which are the way to know whether the dashboard changed a decision or was merely published.

In short, I value three fundamental conditions: that the problem is real and its impact can be measured, that there is a business owner committed to turning the solution into an adopted capability, and that the result can operate and evolve without creating dependence on its creators. When the project also leaves an architecture, some components and a way of working that can be reused, its value transcends the initial case. I do not seek to build solutions that only demonstrate what technology can do. I seek to build capabilities the organization can adopt, govern, scale and improve. The deliverable solves a need; the capability transforms the way the following ones are answered.

## How I decide what to build: the simplest intervention that produces the result

<!-- seccion: como-decido-que-construir -->

I do not start from the premise that every problem needs a technological solution, or that the most advanced alternative is necessarily the most appropriate. Before building, I try to determine which is the simplest, safest and most sustainable intervention capable of producing the expected result. In some cases it will be enough to improve a process, clarify a definition or strengthen data quality. In others, it will make sense to develop an analytical solution, an intelligent application, an automation or an artificial intelligence agent.

My criterion starts from value and not from novelty. I evaluate the importance of the problem, how often it occurs, the potential impact of solving it, the availability and reliability of the information, the level of uncertainty, the risks involved and the organization's capacity to adopt and operate the solution. This evaluation makes it possible to distinguish between a technically interesting idea and a business opportunity that truly deserves investment. At Cafam, in 2020, the right intervention for integrating the distribution center with the WMS was VBA applications —available, useful and maintainable in that organization— and not a new platform; they raised automation by 15%, cut data errors by 50% and kept running after go-live. At Ceinfes, the human resources scheduling that was done by hand with Google Calendar did not need a system: it needed a VBA macro to optimize it.

When there is significant uncertainty, I prefer to learn before scaling. I design progressive validations that make it possible to test the most important hypotheses at the lowest reasonable cost and risk. A data exploration, a working prototype, a controlled test or a limited implementation can generate the evidence needed to decide whether to move forward, change the approach or stop the initiative. I do not consider stopping a project after correctly invalidating a hypothesis a failure. Avoiding an unfounded investment is also a way of generating value. In my pipeline the rule is written down: no application moves forward without its priority and its vision documented, and the Google Cloud exploration remains an exploration —with no horizon and no declared real use— because the evidence does not yet justify more.

## An instrument for each decision: from the report to the agent

<!-- seccion: el-instrumento-para-cada-decision -->

Not every problem needs a dashboard, or a model, or an agent. I order the instruments by the level of agency the organization cedes to them: **a report documents; a dashboard lets you explore; an alert directs attention; a predictive model anticipates; a recommendation proposes; an application organizes execution; an agent acts within limits.** The closer the instrument is to intervening in the operation, the more it demands: data quality, clarity of rules, traceability, controls and supervision.

In artificial intelligence solutions, this discipline is especially important. Not every problem requires a generative model, and not every interaction needs to become an agent. Before choosing a solution pattern, I analyze whether the need calls for interpreting language, retrieving knowledge, generating content, recommending actions, coordinating tools or executing tasks with a certain level of autonomy. The architecture must respond to the nature of the problem, not to the technological trend of the moment. In my pipeline the rule is called "code first": enabling a function with generative AI requires a written decision that justifies why deterministic code is not enough.

I have gone up and down that ladder depending on the case. At C&M Consorcio 2018 the right instrument was reports —2 weekly, 1 consolidated monthly and whatever was requested on demand— because supervising some 150 routes needed documented evidence, not exploration. At Banco Pichincha, the right rung for churn and delinquency was the predictive model with the person deciding, not an agent. At Vesting, agents that acted with explicit limits and real-time monitoring. At Fundación CTIC, analytics first —42 products by process— and only afterwards the AI the evidence justifies: 12 opportunities, 7 evaluated, 3 prioritized. I choose the rung by value and by the risk of being wrong, not by novelty.

## Autonomy proportional to risk

<!-- seccion: autonomia-proporcional-al-riesgo -->

I also evaluate the risk of being wrong. The greater the potential impact of an incorrect answer or an unwanted action, the greater the traceability, controls, human supervision and operational restrictions must be. A solution's autonomy is not a characteristic to be maximized indiscriminately; it must be designed in proportion to the level of trust, verifiability and risk the organization is prepared to manage.

I design autonomy gradually. A solution can start by providing information, move on to recommending actions and, when there is enough evidence and control, execute certain tasks within explicit limits. This approach lets technological capability evolve at the same pace as organizational trust and avoids delegating decisions before their risks are properly understood. It is the ladder I apply at Fundación CTIC: the impact assessment of each AI system decides how much it can do on its own, and a use case moves forward with controls proportional to its risk, not with the ones the tool brings by default.

My goal is to find the right balance between ambition and feasibility. I look for solutions innovative enough to transform the way of working, but also understandable, governable and sustainable enough to work in reality. Building well is important. Choosing correctly what to build, why to do it and how far to let it act is an even greater responsibility. In the 13 agents of my showcase that decision is written in every technical sheet as limits and as what the agent "never" does; the Power BI Dashboard Builder, for example, has 5 human approval gates and no run closes without a person approving the result.

## Trust is designed from the start

<!-- seccion: la-confianza-se-disena -->

I do not consider trust a reaction that appears after implementing a solution. I understand it as a property that must be designed from the start. People trust an analytics or artificial intelligence capability when they can understand what it does, recognize where the information comes from, verify the elements that support its results and know what will happen when the solution encounters a situation it was not prepared for.

That is why I incorporate quality, security, privacy, traceability and governance as design conditions, not as later reviews. A solution can be functional and still not be ready to operate within an organization. To reach that level it needs to use authorized sources, apply access controls, protect sensitive information, keep evidence of its transformations and offer mechanisms to detect errors, unexpected behaviors or performance degradation. At Vesting that was the starting architecture decision: identity, ownership and isolation of each client in separate workspaces from the first event, because they could not be added afterwards.

In analytical solutions, trust requires metrics to have consistent definitions, identified owners and verifiable calculation rules. It is not enough to present a figure; it is necessary to ensure that different areas understand the same thing when they use it. An analytics platform acquires business value when it reduces the argument about which piece of data is correct and lets the conversation concentrate on the decisions that must be made. At Banco Pichincha, every indicator ended up with a definition and a DAX measure in the semantic model that all products reused; the discussion went from "which number is the right one" to "what do we do with this one".

## Trust in AI agents: controls, evaluation and designing for the exception

<!-- seccion: confianza-en-agentes-de-ia -->

In artificial intelligence applications and agents, trust requires additional controls. It is necessary to establish which information they can consult, which tools they are allowed to use, which actions they can execute, which ones require human approval and how their behavior will be recorded. It is also necessary to evaluate the quality of their results systematically, because a convincing demo does not guarantee reliable performance against the diversity of situations they will encounter in production. At Vesting, each of the 27 agents in the inventory left its trail —request, response, state, cost— on the platform, and up to 23 were watched at a time in real time; without that record there was no way of knowing whether an agent had made a mistake.

I also consider it indispensable to design for the exception. A mature solution is not the one that appears to have an answer for everything, but the one that recognizes its limits, communicates uncertainty and knows when it must stop, request additional information or hand the decision over to a person. In intelligent systems, refraining from acting can be a capability as valuable as acting correctly. The chat of this CV is built that way: if the model provider fails, it falls back to a local search over the same corpus instead of going silent; and if the corpus does not support the question, it declares it.

My goal is not to build solutions that look infallible. I seek to develop capabilities that are transparent, evaluable and governable, which the organization can trust precisely because it knows their strengths, their limits and the mechanisms available to supervise them. Sustainable innovation does not come from reducing controls, but from designing them so that they make it possible to move forward safely. How that is governed at institutional scale —inventory, impact assessment, 23 instruments under UNE-ISO/IEC 42001:2025— is in the data and AI governance document.

## How I learn and evolve

<!-- seccion: como-aprendo-y-evoluciono -->

I work in fields that evolve at extraordinary speed, but I do not confuse staying current with accumulating tools. My way of learning consists of understanding the principles that remain, experimenting with the capabilities that emerge and evaluating with judgment which ones can become reliable solutions for real problems. I do not adopt a technology only because it is new: I study it, test it, identify its limits and try to understand how it changes the design possibilities, the risks and the responsibilities of an organization. Learning acquires value when it can be translated into better architecture decisions, sounder practices and capabilities other people can also use.

The measure of that way of learning is in another document, with dates: Microsoft Fabric since August 2023, with less than a year on the market, up to the DP-600 in December 2024; Codex, Antigravity and Claude Code within about a month of their release; the AI-103 and AI-300 paths in progress since July 2026. How I learn, with every deadline and every test, is in the "how I learn" document.
