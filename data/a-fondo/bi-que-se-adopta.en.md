---
slug: bi-que-se-adopta
titulo: "BI that gets adopted"
resumen: "Adoption as the indicator and not the dashboard: 50+ users in banking, 25+ key users in transport, 15+ in logistics and 42 products for 20 leaders in healthcare; training as part of the product, the provenance of every figure and the agent that builds complete Power BI reports."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "How does Henry get the business to adopt the dashboards?"
  - "Why does Henry say adoption is the indicator and not the dashboard?"
  - "How many users have adopted the dashboards he has built?"
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
  a CONFIRMAR marker in square brackets, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

## Adoption is the indicator, not the dashboard: the hard problem in BI is not technical

<!-- seccion: el-problema-dificil -->

Building a dashboard in Power BI is usually not the hardest part of a business intelligence
initiative. The real challenge is getting people to incorporate it into the way they work, to
come back to it when they need to make a decision and to trust its results when the information
contradicts a prior perception.

I have observed a recurring pattern in different organizations: technically correct reports are
produced which, after publication, lose relevance or end up being used only by those who built
them. Faced with that result, the first conclusion is usually that a more advanced tool, a
different visualization or a new set of indicators is needed. Frequently, the problem lies
elsewhere: the analytical product was not designed around a real decision. At Banco Pichincha, in
2023, that was the entire problem of the role on arrival: an analytics and reporting area that
produced technically correct dashboards the business never quite adopted, with slow ETL processes
and models out of production.

A dashboard can present valuable information and still not answer any question a person needs to
resolve within their work. It can also answer correctly, but do so too late, demand an
excessively complex interpretation or show a level of detail incompatible with the user's
responsibility.

That is why, before building, I need to understand who will use the solution, what decision they
must make, how often it occurs, what information they currently use, how long that information
keeps its value and what action they could take after observing the result. I treat **adoption**
as the product's indicator and not as a metric reviewed at the end: it is a design hypothesis
formulated from the start and validated in operation.

## From the screen to decision-making capability

<!-- seccion: capacidad-de-decision -->

This perspective changes the nature of the project. The goal stops being to produce a screen and
becomes designing a decision-making capability. The dashboard remains important, but it becomes
one of the components needed for data to be integrated into an organizational routine.

It also distinguishes between needs that at first sight may look the same. Some decisions require
exploration and comparison, so a dashboard is appropriate. Others need an alert, a notification,
a recommendation or an application that structures the action. When the person needs to know
about an exception at a given hour, forcing them to periodically review a report can be a poor
design decision.

Adoption therefore begins long before publishing. It begins when the problem is selected
correctly, the context of use is understood, the definitions are agreed and a product is designed
that reduces the effort needed to go from information to action. At Fundación CTIC, since March
2025, the rule is applied product by product: each of the 42 analytical products is born from a
process leader's question and not from an available table, and that is why it can be stated that
20 leaders of 15 processes use them and not merely that they are published.

Power BI provides very broad capabilities for modeling, analyzing and communicating information.
However, no functionality replaces the need to understand the process, the audience and the
decision. The tool can facilitate the experience; the purpose must come from the business.

## Adoption demonstrated in different contexts

<!-- seccion: adopcion-medida -->

I have measured the adoption and the effect of business intelligence solutions in financial,
urban, logistics, operational supervision and healthcare contexts. The organizations, the users
and the decisions were different, but the principle remained: an analytical solution only begins
to generate value when it is incorporated into the work of the people who can act on its results.

| Where                              | When                       | Product                                                                 | Adoption                                         | Effect                                                  |
| ---------------------------------- | -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| **Banco Pichincha**                | March – July 2023          | decision-oriented dashboards, with a team of 5 people                   | **more than 50** business **users**              | +25% in decision-making                                 |
| **TransMilenio / C&M Consultores** | July 2021 – May 2022       | Power BI in the post-operational analysis                               | **more than 25 key users** of the operation      | +35% in efficiency of the analytical processes          |
| **Cafam**                          | October 2020 – June 2021   | the BI that controlled the WMS implementation                           | **more than 15** directors, coordinators and heads | +50% in accuracy of test tracking                       |
| **Fundación CTIC**                 | since March 2025           | 42 analytical products by process, 23 of them control dashboards        | **20 leaders** of 15 processes, some 75 users    | close to 60% less preparation effort, estimated         |

## Banco Pichincha and C&M Consultores: more than 50 users and more than 25 key users

<!-- seccion: pichincha-y-cm-consultores -->

At Banco Pichincha I led a business intelligence team of 5 people in the development and
strengthening of dashboards used by more than fifty users. The experience reported a twenty-five
percent improvement in the analysis and decision-making processes supported by these products.
Adoption did not depend solely on building new visualizations, but on combining consistent
models, technical optimization —the semantic models with DAX Studio and Tabular Editor, the ETL
with 35% less analysis time—, training and a clearer relationship between the metrics and the
users' needs.

At C&M Consultores, in the post-operational analysis of TransMilenio, I led the implementation of
specialized business intelligence tools —Power BI— adopted by more than twenty-five key users.
The intervention contributed to a thirty-five percent improvement in the efficiency of the
analytical processes. In this context, key users did not simply mean people with access to the
tool, but responsible people who used the information within scheduling, follow-up and
operational decision activities.

## Cafam, C&M Consorcio and Fundación CTIC: adoption with a job title attached

<!-- seccion: adopcion-con-nombre-de-cargo -->

At Cafam I designed reports and dashboards to control the implementation of Oracle WMS Cloud in a
medicines distribution center. The solution was adopted by more than fifteen users and improved
the accuracy of test tracking by fifty percent. The fifteen had job titles: the management of
medicines, of IT, of the project, of the distribution center and the center's coordinators and
heads. The analytical product made it possible to observe coverage, results, findings,
responsible people and validation states while the project was under way, with 20 people testing.

At C&M Consorcio 2018, between November 2018 and May 2020, I developed performance dashboards and
reports aimed at control and transparency in the supervision of TransMilenio: 2 weekly reports, 1
monthly consolidated report and others on demand, over some 150 routes from 10 concessionaire
companies, with Excel, VBA and SQL. In this experience I do not have a confirmed user figure, so I
do not present it as a case of quantified adoption. Its value lies in having turned heterogeneous
operational records into traceable evidence for supervision and the evaluation of commitments,
and in processing times dropping by at least 40%.

At Fundación CTIC, since March 2025, the 42 analytical products in Power BI —23 of them control
dashboards by process— are used by 20 leaders of 15 processes and some 75 users, administrative
and clinical leaders with very different needs. The effect figure I declare as what it is: close
to 60% less effort in preparing the information, estimated, and 10 analysis plans under
follow-up.

These experiences should not be compared only by the number of users. A solution used by fifteen
people with direct responsibility over a critical process can produce more value than a report
consulted occasionally by hundreds. Adoption must be interpreted according to the user's
function, the frequency of the decision and the scope of the actions the information can guide.

## Access, use, adoption and impact: four things that get confused

<!-- seccion: acceso-uso-adopcion-impacto -->

I distinguish between access, use, adoption and impact. Granting access demonstrates
availability. Opening a dashboard demonstrates use. Incorporating it systematically into a
routine demonstrates adoption. Changing a decision or improving a result demonstrates impact.
Confusing these categories can produce striking figures without proving that the solution really
changed the way of working.

Each of my figures sits on a different step of that ladder, and I say so. "More than 50 users" at
Banco Pichincha is adoption; the "+25% in decision-making" is impact, measured on the decisions
those dashboards supported. "More than 25 key users" at C&M Consultores is adoption by role; the
"+35% in efficiency" is impact on the analytical processes. "More than 15 users" at Cafam is
adoption with a job title; the "+50% in accuracy" is impact on test tracking. And at Fundación
CTIC, "20 leaders of 15 processes" is counted adoption, while the "close to 60%" is an estimate
of impact, and that is why it carries the "close to".

That is why, when I evaluate an analytical solution, I do not only ask how many people can
consult it. I need to know who uses it, for which decisions, how often, which activities it
replaces, which conversations it facilitates and what result can be observed after its
incorporation.

Adoption is not a secondary metric reviewed at the end of the project. It is a central design
hypothesis that must be formulated from the start and validated during operation.

## Design around a decision

<!-- seccion: diseno-para-la-decision -->

Before building a screen, I identify the decision the solution must support. I need to understand
who makes it, what responsibility they have, how much time they have, which alternatives they
can consider and what consequences a late or wrong action produces.

This way of working avoids starting from the available data. An organization can have hundreds of
fields and dozens of indicators without all of them being relevant to a concrete decision.
Designing from the dataset usually produces sprawling dashboards. Designing from the decision
forces prioritization.

It also makes it possible to establish what level of detail each audience needs. Senior
management requires trends, risks, comparisons and responsiveness. Process owners need to
understand constraints, causes and opportunities for intervention. Operational teams need to
identify concrete situations and act on them. At Fundación CTIC the two audiences
—administrative and clinical leaders— receive the same figure at different depths, and at Cafam
the management of the distribution center and a head of the center read the same control BI with
two different questions.

The solution can use a single semantic model for these audiences, but it must not present them
the same experience indiscriminately. The definition of the metrics remains stable; the
navigation, the context and the level of depth adapt to each user's responsibility. Each
dashboard offers a path from the overview to the evidence, so that the person responsible
recognizes the condition and can go deeper when a figure demands it.

## The moment of the decision: when a dashboard is not the answer

<!-- seccion: el-momento-de-la-decision -->

Design must also consider the moment. An indicator can be correct and arrive too late. A
prediction can be accurate and not coincide with the planning cycle. A dashboard can contain the
answer and require an exploration incompatible with the urgency of the decision. That is why, in
some cases, the best solution is not a new dashboard. It may be an alert tied to a specific
condition, a simplified view for a meeting, an application that allows the action to be recorded
or an intelligent capability that prepares a recommendation under defined criteria.

Industrial Engineering brings the understanding of the process and of the decision within the
complete flow. Industrial Design brings the observation of the experience: what the person needs
to understand, what information must appear first and what friction can prevent the solution
from being used. Power BI materializes that experience when the need calls for analysis,
comparison and drill-down. Its value appears when the technology responds to the user's decision
journey and not when the person must adapt their work to the structure of the report.

## One shared definition per indicator: the semantic model and DAX

<!-- seccion: definiciones-compartidas -->

Adoption depends on trust, and trust weakens when different products present different values
for an apparently identical concept. An organization cannot make decisions with agility if every
meeting begins by arguing which figure is correct. If one dashboard and another calculate the
same concept differently, the user compares tools instead of analyzing reality.

That is why an essential part of the work happens in the **semantic model**. That is where the
entities, relationships, hierarchies, dimensions and measures through which data acquires
meaning for the business are structured. Each indicator has **one definition**, one owner and one
calculation rule, centralized in the model and expressed as **DAX** measures that every product
reuses.

The semantic model does not create consensus on its own. The definition must be agreed by those
who have knowledge of and responsibility for the process. The technology turns that agreement
into a reusable rule, but it does not replace the conversation needed to establish what the
indicator represents, what it includes, what it excludes and under what conditions it can be
compared.

Once agreed, the definition must be implemented consistently and kept separate from the
particular visualizations. This allows different reports, pages or audiences to use the same
measure without rebuilding its logic independently. The separation between model and experience
also allows more governed self-service: users can explore the information, combine perspectives
and build new experiences without redefining the critical metrics every time. Autonomy remains
in the analysis; consistency is protected in the semantic layer.

## DAX Studio, Tabular Editor and the semantic model as an enterprise asset

<!-- seccion: dax-studio-y-tabular-editor -->

My specialty in Power BI concentrates precisely on this relationship between architecture and
use. I do not consider a model finished merely because it produces the expected figures. It must
also be understandable, efficient, maintainable and clear enough for another person to validate
it and make it evolve. Tools such as **DAX Studio** and **Tabular Editor** have allowed me to go
deeper into this discipline —at Banco Pichincha, in 2023, with them I optimized the area's
semantic models—, analyze the behavior of measures, improve performance and organize models as
reusable enterprise assets. At Vesting, on Microsoft Fabric, the models combined Direct Lake,
import and DirectQuery according to what each product needed; how that model is optimized is in
the Fabric document.

A shared definition does not eliminate the discussion. It moves it to the right place. The
organization stops arguing about how the number was calculated and can concentrate on what it
means, why it changed and what decision it needs to make.

## Training is part of the product

<!-- seccion: formacion-y-adopcion -->

An analytical solution is not adopted merely because it is intuitive. People need to understand
what the information represents, how they should interpret it, what limits it has and how they
can use it within their responsibilities.

That is why I consider **training** part of the deliverable and not an optional activity after
publication. At Banco Pichincha, between March and July 2023, I designed and delivered a program
aimed at twelve professionals that contributed to a twenty percent improvement in the
productivity associated with preparing and using information. The goal was not to teach isolated
Power BI functions. It was to strengthen the capacity to go through the complete cycle: preparing
data with Power Query, recognizing entities and relationships in the semantic model, building
DAX measures, interpreting visualizations and turning a finding into a conclusion defensible
before management. And it was done on their own products, not on textbook exercises.

Training also reduced dependence on the business intelligence team. A user with better
analytical judgment can formulate better questions, identify inconsistencies and use the product
with greater autonomy. This allows the technical team —at Pichincha, 5 people— to concentrate its
effort on more complex capabilities instead of repeatedly answering the same operational
questions.

However, autonomy does not mean absence of governance. Users can expand their capacity for
exploration and analysis without individually redefining the critical metrics or rebuilding the
institutional logic in each report.

I also adapt training to the user's needs. A person responsible for an executive decision does
not need the same level of technical depth as someone who develops a semantic model. Both need to
understand the information, but from different responsibilities. Industrial Design especially
influences this dimension: teaching a tool does not consist in transferring all its complexity,
but in organizing the learning around the tasks and decisions the person needs to perform.

Training completes the product because it transforms access into capability. Without it, a
dashboard can remain available. With it, it can become a practice embedded within the
organization.

## The provenance of every figure

<!-- seccion: procedencia -->

I apply a rule that comes from data governance: every relevant figure must preserve its
provenance. If I cannot explain where it comes from, how it was transformed and what definition
it represents, it is not yet ready to support an important decision.

This rule does not mean saturating every screen with technical information. The experience must
present the figure clearly, but preserve mechanisms to trace it back to its sources, its rules
and its context when necessary. In the post-operational analysis of TransMilenio, at C&M
Consultores, every Power BI figure could be traced back to the source that had produced it —fare
collection, fleet and GPS, scheduling, incidents or PQR (complaints and claims)—, and that was the
condition for my reports to be able to support contractual and economic consequences before the
concessionaires.

I also distinguish the nature of the published values. A figure may have been **measured**
directly by a counter or an execution. It may have been **calculated** by an expressed rule. It
may have been **declared** by a responsible person or source. It may also be an **estimate**
built under explicit assumptions. These categories do not have the same level of certainty and
must not be presented as if they were equivalent. The label makes it possible to understand what
kind of evidence supports each value and which questions are reasonable before using it.

## Provenance in my showcase and in the executive conversation

<!-- seccion: procedencia-en-la-vitrina -->

I carried this rule into my own portfolio. The technical sheets of the 32 pieces of the showcase
—6 applications, 13 agents, 7 research lines and 6 dashboards— declare the provenance of each of
their figures with those four labels, so that claims about tests, coverage, users, performance
or results can be related to the corresponding evidence. And I apply it to this very CV: the
"close to 60%" of Fundación CTIC carries "close to" because it is estimated; the 42 products and
the 20 leaders do not carry it because they are counted.

Traceability acquires special importance in executive conversations. When a person questions a
number, the answer must not depend on who has more authority or on who built the report. There
must be a verifiable path from the figure to the data and the rule that produced it. This does
not eliminate every discussion. Some discrepancies come from legitimately different definitions.
In those cases, making the provenance visible helps recognize that the disagreement is not in
the arithmetic, but in the concept each person is trying to measure. When the figure can be
verified, the conversation moves forward: it stops concentrating on whether the indicator exists
and can turn toward what it reveals, the conditions that explain it and the decision that must be
made.

## The visual experience also determines adoption

<!-- seccion: experiencia-visual -->

Adoption does not depend solely on the accuracy of the data and the quality of the model. It also
depends on how easily a person can find, interpret and use the information.

My training in Industrial Design brings an especially valuable perspective at this point. An
interface must not be evaluated solely by its appearance, but by the relationship between its
structure, the task it must facilitate and the context in which it will be used.

In Power BI, the visual hierarchy must respond to the hierarchy of the decision. The main
information needs to be visible without forcing the user to go through every detail. Exceptions
must be distinguished from normal behavior. Navigation must allow going deeper without losing
context.

Every visualization must justify its presence. Adding charts because there is space available
increases cognitive load and can hide the main finding. A mature solution selects the most
appropriate representation for the comparison, trend, composition or distribution it needs to
communicate. In the 6 open-data dashboards of my showcase that selection is documented piece by
piece, with their DAX measures counted —62, 44 and 43 in three of them— and with what each
dashboard "never" claims.

Language also matters. Titles, labels and descriptions must use concepts recognizable to the
audience and not necessarily reproduce the technical names of the sources. The model can be
complex; the experience must not require the user to understand that complexity in order to get
value.

Accessibility is part of this responsibility. The use of color, contrast, navigation and
structure must allow the information to be interpreted under different conditions. A solution
that unnecessarily excludes part of its users cannot be considered fully adoptable; in this CV
accessibility is tested automatically on every change, and the criterion is the same for a
dashboard.

Nor does simplicity mean removing rigor. A clear interface must allow reaching the evidence when
necessary. Industrial Design helps organize the interaction; the data architecture and the
semantic model guarantee that the simplification does not alter the meaning. The best analytical
experience is not the one that shows everything the model can calculate. It is the one that lets
the person understand what needs attention and find enough detail to decide.

## Measuring adoption without confusing it with visits: six signals

<!-- seccion: medir-adopcion -->

Adoption cannot be reduced to the number of people who opened a dashboard. A visit can respond to
curiosity, a one-off validation or an instruction received. To understand whether the solution
was incorporated into the work, additional signals need to be observed.

The first signal is **recurrence**. An adopted product appears consistently within follow-up
cycles, meetings or decisions. It is not consulted once; it becomes a habitual reference. At
Cafam, the control BI was read in every WMS test cycle, not in a demonstration.

The second signal is **depth of use**. Users do not limit themselves to looking at the first
page, but use filters, comparisons and drill-down paths to answer questions related to their
responsibility.

The third signal is **substitution**. The solution begins to replace files, reconciliations,
manual queries or preparation activities that previously consumed time and produced inconsistent
results. At Fundación CTIC that signal is the one estimated as close to 60% less preparation
effort; at Banco Pichincha, the 35% less analysis time in the ETL.

## Conversation, action and result: the signals that count

<!-- seccion: senales-conversacion-accion-resultado -->

The fourth signal is **conversation**. Meetings stop concentrating on locating information and
can move on to interpretation, causes and actions. The dashboard becomes part of the team's
operational language. The working sessions with the management of the SITP concessionaires, at
C&M Consultores, changed when the conversation stopped being about where each figure came from.

The fifth signal is **action**. An indicator leads to a review, a decision, an assignment or an
intervention. This is the point where use begins to turn into value. The sixth signal is the
**result**. After acting, the organization can observe whether the indicator evolved, whether
time was reduced, whether rework decreased or whether the capacity to respond improved: the +25%
in indicators after the SITP working sessions is a signal of this kind.

Not every project allows these signals to be measured with the same level of precision. That is
why I establish from the start what evidence will be available and which claims can be
sustained. It is better to declare a partial adoption correctly measured than to present a broad
impact without a verifiable relationship to the solution; it is the reason C&M Consorcio 2018
does not appear in my adoption table. This discipline also applies to applications and
artificial intelligence agents: a solution does not generate value by the number of
conversations or executions, but by the capability it installs, the work it improves and the
results it makes it possible to reach.

## When Power BI is not the right instrument

<!-- seccion: cuando-power-bi-no-es-el-instrumento -->

My specialty in Power BI does not imply that I consider a dashboard the right answer for every
information need.

Power BI is especially valuable when the person needs to explore, compare, identify trends, go
deeper at different levels and understand relationships between indicators. However, some
decisions have a frequency, urgency or structure that requires another kind of instrument.

An exceptional condition that needs immediate attention may be better resolved through an alert.
A repetitive decision may require an application that guides the action. A need for anticipation
may need a predictive model: at Banco Pichincha, churn, delinquency and risk were not handled
with one more dashboard but with scikit-learn models that reached production with more than 90%
accuracy; at TransMilenio, demand by time band with a model that ran for 10 months. A contextual
query task can benefit from an agent with access to authorized sources, like the 13 agents in my
showcase.

Selecting the right instrument requires understanding how long the information keeps its value,
what level of interpretation it requires, what consequences the decision has and what
responsibility must remain with the person. This view avoids forcing analytics into products
that users will not incorporate. It also protects Power BI from becoming an indiscriminate
repository of pages and metrics that try to answer incompatible needs at the same time.

The right product is not the one that uses the technology in which I have the greatest depth. It
is the one that solves the problem with the appropriate level of complexity, control and
capacity for action. The complete ladder —report, dashboard, alert, model, recommendation,
application, agent— is laid out in the document on how I work.

## When building the dashboard is the bottleneck: the Power BI Dashboard Builder

<!-- seccion: cuando-la-herramienta-estorba -->

When manual and repetitive construction activities begin to limit speed, consistency or the
capacity to scale, the very production of analytical artifacts can become an object of
automation.

I built the **Power BI Dashboard Builder**, one of the 13 agents in my showcase, and it is fully
tested: from a requirements text and a project with the tables, it produces the complete project
in .pbip format —the semantic model with its relationships and columns, the transformations in
Power Query M, the DAX measures and the visuals written in the report's native JSON—, and it can
even extract the data. It is not a demonstration of pages: it is absolutely all of the Power BI.

Its pipeline has six phases —intake, diagnosis, design, backend, frontend and closing— and a
strict division of responsibilities: the semantic model is touched only by a modeling server,
which creates and tests each DAX measure before moving on; the report is written by a dedicated
authoring skill, with eleven references by visual type and a two-layer local validator. A run is
accepted against 20 binary criteria spread over eight deliverables, and passes through 5 human
approval gates —model design, visual adjustments, refresh against real data, scope override and
publication—, three of which are crossed on every run. None closes without DAX in green, a clean
validator and a render approved by a person in Power BI Desktop. It has been sealed since June
2026, with one dashboard built end to end and 33 reference dashboards indexed by archetype and
audience.

The agent does not autonomously define the analytical strategy or indiscriminately modify the
semantic model. The selection of indicators, the relationships, the measures, the information
architecture and the decision experience remain under explicit criteria. Automation intervenes
in delimited activities and does not replace the responsibilities that demand business knowledge
and professional judgment. No execution is considered finished for having generated an artifact:
the result must pass structural and functional validations before joining the product. This
condition separates a technically possible generation from a contribution ready to be part of an
analytical solution.

## The rule for using artificial intelligence, and the Cafam precedent

<!-- seccion: la-regla-para-la-ia -->

That distinction reflects my general rule for using artificial intelligence. The model does not
replace professional judgment and is not used to simulate tasks that can be solved
deterministically. It takes part where it can interpret specifications, organize work or
accelerate an activity within controlled limits. In the Power BI Dashboard Builder, the figure
that justifies its existence is an estimate declared as such: a hand-made dashboard costs on the
order of thirty-two hours, and the base scenario calculates close to 691 hours freed per year if
36 dashboards are built with 60% less effort; no run has yet been timed against that baseline,
and the sheet says so.

Automation must also be designed to be maintainable. A system that quickly produces artifacts
that are hard to understand can increase the product's technical debt. The goal is not only to
speed up construction, but to preserve consistency, traceability and the capacity for review:
that is why the agent delivers a project in a folder, versionable in git, and not an opaque
binary.

The Cafam experience reinforced this criterion early on. There, between October 2020 and June
2021, I used Visual Basic for Applications because it was an available, useful and maintainable
technology within the organization's context: the VBA applications that integrated the
distribution center's processes with the WMS raised automation by 15%, reduced data errors by 50%
and kept running after go-live. Today I use agents and automated structures when the nature of
the problem justifies it. The tool changes; the principle remains.

The right technology is not necessarily the newest or the most sophisticated. It is the one that
solves the problem, can be governed and leaves the organization in a better position to sustain
and evolve the solution.

## The complete cycle of an adopted solution

<!-- seccion: ciclo-de-adopcion -->

An adopted business intelligence solution goes through a complete cycle. It begins with a
decision and an audience. It continues with reliable data, shared definitions and a semantic
model capable of preserving meaning. It materializes in a clear experience and is accompanied by
training, documentation and support mechanisms.

After publication, it needs observation. I must understand who uses it, which questions appear,
which parts generate friction and which new needs arise from its real use. At Fundación CTIC that
observation has a shape: 10 analysis plans under follow-up on the 42 products, which are the way
to know whether a dashboard changed a decision or was merely published.

Feedback makes it possible to improve the experience, but it must not become an indiscriminate
accumulation of requests. Each change must be evaluated according to the product's purpose, the
expected value and the effect on the consistency of the model.

There must also be a way to retire what no longer adds value. Dashboards, pages and indicators
that have lost their purpose should not remain indefinitely as apparently current options. An
excess of products weakens adoption because it fragments attention and multiplies the sources the
user must interpret.

## Managing the dashboard portfolio, not just each dashboard

<!-- seccion: portafolio-de-tableros -->

Managing adoption also requires observing the complete portfolio. An organization can have
individually correct products and, at the same time, offer a fragmented experience because
different dashboards compete for attention, repeat indicators or partially answer the same need.
In that scenario, building an additional solution can increase confusion instead of expanding
analytical capability.

That is why, before developing a new product, I evaluate whether the need can be met by extending
an existing semantic model, adding a new experience on a shared base, simplifying a previous
report or retiring products that have already lost their purpose. Analytical maturity is not
measured by the number of dashboards available, but by the clarity with which each one occupies a
function within the decision system. With 42 products for 15 processes at Fundación CTIC —23 of
them control dashboards—, that question is asked before every new product: if it fits on a model
that already exists, one more dashboard is not born.

Sustainable adoption requires responsible people. The analytics team answers for the
architecture, the quality and the technical evolution. Business owners validate the definitions,
use the information and determine the actions. Users provide evidence about the real experience.
It is the division that existed at Cafam between the team of 20, the fifteen users with job
titles and the warehouse.

This cycle turns a report into an analytical product. The difference lies not only in the
technology, but in the continuity of responsibilities that exists from the definition of the
problem to the follow-up of its use. My work seeks to build that continuity. I do not hand over
screens for the organization to discover later how to use them. I design capabilities so that
data can be reliably incorporated into decisions, routines and processes.

## What my business intelligence approach demonstrates

<!-- seccion: lo-que-demuestra -->

My experience demonstrates that adoption is not an accidental consequence of building a good
dashboard. It is a condition that must be designed from the identification of the problem,
sustained through reliable data and definitions, facilitated through an understandable
experience and verified after publication.

An adopted analytical solution begins with a real decision. It needs an architecture capable of
preserving meaning, a semantic model that implements shared definitions and an experience that
lets each audience find the level of information matching its responsibility. It also needs
people prepared to use it. Training, accompaniment and documentation turn access into
capability. Provenance and governance turn figures into evidence. Observing use makes it
possible to distinguish between availability, occasional consultation, recurring adoption and
impact.

My depth in Power BI lets me work across that entire journey. I do not start at the visualization
or end at publication. I can intervene in data preparation with Power Query, modeling, DAX
measures, performance, experience, training, automation and the product's later evolution.
DP-600, earned in December 2024, certifies that end-to-end depth in Microsoft Fabric, which at
Vesting was the complete platform; the 6 open-data dashboards of my showcase, on the other hand,
are built with Power BI Desktop, Power Query, DAX and Python, without Fabric, because for public
data nothing more was needed. And Power BI is not the only tool I handle: Shiny with R, Tableau
and Looker Studio appear among my skills, although the specialty is one.

## The right instrument and the role I seek in BI and analytics

<!-- seccion: el-rol-en-bi-y-analitica -->

I also know how to recognize when Power BI is not the right answer. Some needs require an alert,
an application, a prediction or an agent. The specialty does not consist in always using the
same tool, but in selecting the right instrument without losing the coherence of the data, the
definitions and the governance.

When manual construction becomes a constraint, I can automate part of the process. When lack of
knowledge limits adoption, I incorporate training. When there are discrepancies, I go back to the
definitions and the provenance. When a product stops adding value, it must be simplified,
integrated or retired. That is the central idea of my business intelligence practice, and one of
the four types of role I seek —leadership in BI and analytics, the DP-600 one— is exactly this: I
do not build dashboards to demonstrate how much information can be presented. I build analytical
capabilities so that people can understand a situation, hold a conversation about evidence and
make decisions with greater clarity. The dashboard is the visible part. The real product is the
organizational capability that remains when the screen stops being the center of the
conversation.
