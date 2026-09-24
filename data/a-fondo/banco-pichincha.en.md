---
slug: banco-pichincha
codigo: AF-08
titulo: "Banco Pichincha — BI the business actually uses (2023)"
resumen: "Five months in banking: dashboards adopted by 50+ users (+25% in decisions), ETL −35%, churn, delinquency and risk models in production with scikit-learn (>90%), a team of 5, 12 professionals trained and data governance co-led."
cuando_usar: "Use this when they ask about Banco Pichincha (2023): the financial sector, churn, delinquency and risk models in production, semantic models and DAX, BI adoption by more than 50 users, co-led data governance and the analyst training program."
estado: aprobado
ancla: "/proyectos/banco-pichincha"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What did Henry do at Banco Pichincha?"
  - "How does he get the business to use the dashboards?"
  - "Has he taken a machine learning model to production?"
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

<!-- guide (comes from the story skeleton, S3 — the owner wrote it):
How you achieved adoption (the hard problem of BI), what you did
differently with the dashboards, the training program, the predictive
models in production. -->

## The real problem was not only technical

<!-- seccion: el-problema-real -->

I joined Banco Pichincha in March 2023 as Senior Analytics and Reporting Analyst and stayed in the
organization until July of the same year. It was five months, and it was my time in the financial
sector: in banking, data has an owner, regulation and consequences, and that changes how everything
is built. I had devoted the previous months to studying and getting certified, so I arrived with the
IBM data science certifications freshly earned and eager to apply them in a demanding environment.

Although it was an experience concentrated in time, it represented a decisive point in my career
because it allowed me to integrate learning accumulated in processes, data, automation, business
intelligence and executive communication within a financial environment in which the quality and
reliability of information carried especially high importance.

The analytics and reporting area produced dashboards that the business never quite adopted, with
slow ETL processes and predictive models that did not reach production. There I confirmed that the
main challenge of analytics is not always technological. An organization can have advanced tools,
competent professionals and large volumes of information and still struggle to turn them into
consistent decisions. The problem appears when the data, the metrics, the analytics products and the
business responsibilities evolve separately.

I worked with a team of five people in my charge, within the bank's analytics and reporting area.
With that team, in five months, came out the dashboards, the ETL optimization, the predictive models
and the training program I describe in this document.

## The distance between the data and the decision

<!-- seccion: la-distancia-entre-dato-y-decision -->

A technically correct dashboard loses value when it does not answer a concrete decision. A metric
generates distrust when different areas interpret it differently. A predictive model remains a
technical exercise when there is no process prepared to use its results. The solution at Banco
Pichincha therefore did not consist of producing more reports or adding more technology, but of
strengthening the architecture that connects information with the decisions and actions of the
business.

My work was aimed at reducing that distance. This meant understanding which decisions needed to be
supported, what information they required, who had to answer for their definitions and how the
analytics products had to be structured to integrate into the organization's real routines.
Analytics had to stop working as an isolated delivery and become a business capability.

In banking that distance has a visible cost. A portfolio tracked with two different definitions of
delinquency produces two different figures in two committees; a churn model that does not reach the
sales team is a probability nobody turns into a call. Reducing the distance meant, in practice, that
every analytics product had an identifiable decision on the other side.

## Every solution as a complete chain

<!-- seccion: la-cadena-completa -->

In that context, I began to look at every solution as a complete chain. The data had to be prepared
through reliable transformations in Power Query; the metrics needed consistent definitions; the
semantic models had to organize the meaning of the information; the DAX measures had to be
verifiable; the dashboards had to answer relevant questions; and the users had to have the knowledge
needed to interpret the results and act on them.

The business processes those products were going to serve I modeled in BPMN with Bizagi before
touching the data, because a dashboard about a process nobody has drawn answers questions nobody
asked. The modeling allowed me to place each analytics product within the real activities: at which
point of the process the decision is made, who makes it and how far in advance they need the
information.

This experience consolidated an idea that would later become central in my work with artificial
intelligence applications and agents: the sophistication of a solution does not by itself determine
its value. What matters is the function it fulfills within a decision, the degree of trust it can
sustain and the clarity with which it distributes responsibilities between people and technology.

## Adoption, measured

<!-- seccion: la-adopcion-medida -->

I led the business intelligence team —five people in my charge— in developing and strengthening
Power BI dashboards that came to be used by more than 50 business users. The goal was not to
increase the number of available reports, but to get the analytics products effectively incorporated
into the follow-up and decision-making processes.

This experience confirmed that publishing a dashboard is not the end of an analytics project. A
solution starts producing value when people understand which question it answers, trust its metrics
and use it recurrently to guide an action. Adoption could not be measured only by access to the
tool, but by the way it changed the preparation, discussion and follow-up of decisions.

The reported results showed a 25% improvement in decision-making associated with the analytics
products. Beyond the figure, the main learning was that this improvement did not depend only on a
clearer visualization. It arose from the combination of reliable data, understandable metrics,
consistent models, support for the users and an explicit relationship between the indicator and the
decision.

The analytics product thus stopped being understood as a repository of information and began to work
as a service for the organization. Its value was not in the number of elements it showed, but in its
capacity to reduce uncertainty, organize a conversation and enable timely action. How that adoption
is measured, and why it is not visits, is in the document on BI that gets adopted.

## Designing from the decision: executive synthesis and traceability

<!-- seccion: diseno-desde-la-decision -->

At Banco Pichincha the design of every dashboard started from the users' needs and not exclusively
from the available data. Before developing a visualization, it was necessary to understand which
situation needed to be observed, which decision could be made, what level of detail each owner
required, how often, and what information had to remain available to explain a deviation.

Every solution had to offer an understandable path from the overview to the evidence that supported
the result. The owners needed to quickly recognize the relevant conditions, but they also had to be
able to drill down when a figure required explanation. This combination of executive synthesis and
analytical traceability strengthened trust and reduced permanent dependence on the technical team: a
manager who can get on their own from the portfolio indicator to the operations that make it up does
not need to ask the BI team to explain it.

That path, from the aggregate to the detail, was built in the semantic model, not on the dashboard
page: shared dimensions, understandable hierarchies and DAX measures that behaved the same at any
level of the hierarchy. The page only made visible a structure that already existed underneath.

## Consistency: a single definition per concept

<!-- seccion: consistencia-de-definiciones -->

Adoption also required consistency. When different dashboards use different calculations or
definitions to represent the same concept, the user ends up comparing tools instead of analyzing
reality. For this reason, an important part of the work consisted of strengthening reusable models
and measures that made it possible to keep a common interpretation of the information among the more
than 50 users who consumed it.

A measure defined once in the semantic model and used by every dashboard is the technical form of a
business decision: that delinquency or churn is calculated in a single way. When that definition
changes, it changes in one place and all the products inherit it; when every report rebuilds it,
every report is an opportunity for discrepancy.

That consistency was, moreover, the point where the BI work met data governance: a shared definition
needs an owner who approves it and a place where it is documented, and that is no longer a Power BI
problem but an organizational one.

## Choosing the right instrument for each decision

<!-- seccion: elegir-el-instrumento -->

This experience also led me to question the tendency to solve every information need with
dashboards. Power BI was a central capability within the bank's analytics ecosystem, but not every
decision required visual exploration, nor could every one wait for a person to log in and consult a
report. The instrument had to be selected according to the nature of the decision, its frequency,
the time available to act, the level of uncertainty and the consequences of a wrong answer.

Some needs were adequately solved with periodic indicators or exploratory dashboards. Others
required alerts that directed attention to a specific condition, predictions that made it possible
to anticipate a behavior —a customer's churn, the delinquency of an obligation— or applications that
structured the subsequent intervention. The question stopped being which dashboard we should build
and became which capability the person really needed to make or execute a better decision.

I thus began to organize the instruments according to the level of agency the organization assigned
to them. A report documents. A dashboard allows exploration. An alert prioritizes attention. A
predictive model anticipates a condition. A recommendation proposes an alternative. An application
guides execution. An artificial intelligence agent can consult information, use tools and perform
certain actions within defined limits.

This progression does not imply that the instrument with the most autonomy is necessarily the most
valuable. The closer a solution gets to intervening in the operation, the higher the quality of its
data, the clarity of its rules, the traceability of its results and the oversight of its actions
must be. The right design consists of consciously distributing responsibility between people and
technology, not of maximizing automation.

This understanding was one of the main bridges between my experience in business intelligence and my
later evolution toward AI applications and agents. Power BI allowed me to build a reliable layer of
interpretation and decision; artificial intelligence would later extend that capability toward
generating recommendations, coordinating tools and the controlled execution of certain tasks.

## The training program

<!-- seccion: programa-de-formacion -->

To strengthen adoption I designed and delivered a training program aimed at 12 professionals of the
bank. The purpose was not to teach isolated functions of a tool, but to expand the internal capacity
to prepare information, build reliable analyses, interpret metrics and communicate results with
greater autonomy.

The training was organized around situations close to the participants' work. Instead of presenting
Power BI as a set of features, I addressed the complete journey of an analytics solution: data
preparation, modeling, definition of measures, construction of visualizations and interpretation of
results. This made it possible to relate every technical piece of knowledge to a concrete business
need: whoever tracked a portfolio learned about the data of that portfolio, not about a sample data
set.

The program was designed together with the dashboards and not after them. Training the people who
were going to use and maintain the products was part of the deliverable: a dashboard adopted by more
than 50 users needs, inside the business, people capable of understanding its model, questioning a
measure and proposing the next question without depending on the BI team again.

## The contents: Power Query, semantic modeling, DAX and communication

<!-- seccion: contenidos-de-la-formacion -->

One of the main components was Power Query, used to structure clearer transformations, reduce manual
activities and establish a reproducible preparation of the information. The purpose was not only to
learn to clean data, but to understand that every transformation modifies the meaning and
reliability of what will later be analyzed.

Another component was semantic modeling. The participants had to recognize the business entities,
organize their relationships properly and avoid every report reproducing the same logic separately.
This perspective made it possible to understand that the model was not a technical structure hidden
behind the dashboard, but the place where the organization defined how to interpret its information.

The work with DAX was aimed at building understandable, reusable measures suited to the analysis
context. Rather than accumulating complex formulas, I sought to strengthen the capacity to reason
about filters, relationships, time and the behavior of the metrics. A measure had to be technically
correct, but also clear enough to be validated and maintained.

The training also included criteria for visualization and executive communication. The 12
participants learned to organize information around a question, distinguish between context and main
evidence, and turn a finding into a conclusion understandable to people with different levels of
technical knowledge.

## Support and installed capacity: +20% productivity

<!-- seccion: capacidad-instalada -->

Support was as important as content. The concepts were applied to real situations and the
participants were able to review products tied to their responsibilities. This helped carry the
learning from the training exercise into daily practice: the session ended with a change in a model
or a measure that the person was going to use the next day.

The program contributed to a 20% improvement in the participants' productivity in preparing and
using information. The most important result, however, was the installed capacity. The organization
did not only receive new analytics products; it strengthened people capable of understanding them,
questioning them, maintaining them and continuing to develop them after my departure in July 2023.

This experience reinforced my conviction that data democratization does not consist simply of
widening access to a tool. It requires raising the judgment with which people prepare, interpret and
communicate information. Autonomy without standards can multiply inconsistencies; autonomy
accompanied by shared models, practices and definitions can multiply value.

## Analytics self-service needs limits and responsibilities

<!-- seccion: autoservicio-con-limites -->

This experience at Banco Pichincha also taught me that analytics self-service needs limits and
responsibilities. Expanding users' capacity does not mean that each person should individually
redefine the metrics or rebuild the business logic in every report. Autonomy generates more value
when it operates on reliable sources, shared semantic models and governed definitions. The purpose
was to decentralize exploration and the creation of knowledge without fragmenting the meaning of the
information.

In practice, that set a clear boundary: the semantic model and the central DAX measures were the
responsibility of the BI team and of data governance; on top of them, the 12 trained professionals
could build their own analyses, pages and questions. Exploring was free; redefining what delinquency
is was not.

That boundary is the same one I apply today to artificial intelligence agents: the capability
expands, the definitions and the authorized sources are governed.

## The ETL and data preparation with Power Query

<!-- seccion: el-etl-y-la-preparacion -->

I worked on optimizing the ETL processes for information preparation used by the Power BI solutions,
built with Power Query. The improvements applied contributed to reducing analysis times by
approximately 35%, while strengthening the stability and maintainability of the transformations.

The goal was not to make the processes more complex, but to organize them better. I structured the
queries so that it was possible to differentiate the connection to the sources, the preparation of
the information and the construction of the tables intended for the model. This separation made the
flow easier to understand and avoided repeating transformations in different components.

This experience deepened my understanding of Power Query as an integral part of the analytics
pipeline. The quality of a report depends on the decisions made during data preparation, and every
step must keep a clear relationship with the process and the business rule it represents. What at
TransMilenio I had solved with a custom ETL over five sources was solved here inside the tool, with
the same logic: explicit, reproducible rules with an owner.

## How the queries were structured

<!-- seccion: como-se-estructuraron-las-consultas -->

In the ETL optimization at Banco Pichincha I prioritized the early selection of the necessary rows
and columns, the consistent definition of data types and the reuse of logic when several queries
required similar operations. When the sources allowed it, I tried to have the transformations
executed as close as possible to their origin —folded down to the database— to avoid moving
unnecessary volumes into Power BI.

The optimization was not limited to performance. A faster query that is hard to interpret could
later become technical debt. That is why I sought to have the steps keep a logical sequence,
understandable names and a structure that made it possible to identify where each transformation
took place.

I also incorporated validations to detect missing values, unexpected types, duplicates and other
conditions that could affect the result. These checks made exceptions visible before they reached
the semantic model and ended up represented as apparently correct indicators. The 35% reduction in
analysis times came out of these structural decisions, not out of a performance trick.

## The semantic model as a business asset

<!-- seccion: modelos-semanticos -->

A central part of my work focused on strengthening and optimizing the semantic models that sustained
the Power BI solutions. I understood that the real potential of the platform was not in producing
numerous independent files, but in building a reusable layer of meaning that made it possible to
develop different analytics experiences on common definitions.

I organized relationships, dimensions, fact tables and measures to make the information easier to
interpret and to reduce the duplication of logic. I also promoted consistent conventions for naming
objects and grouping measures, so that the model could be understood and maintained by people other
than whoever had originally built it.

Centralizing the DAX measures allowed the same definition to be used in different analyses without
needing to rebuild it. This reduced discrepancies between reports and made the solutions easier to
evolve, because a controlled change in the logic could be reflected consistently in the products
that depended on it.

This vision made maintenance part of the design. A business solution must not be evaluated
exclusively by its current functioning, but also by the ease with which another person can
understand it, validate it and modify it. The sustainability of the model depended as much on its
performance as on the clarity of its architecture. How it is modeled and optimized, with the
technical detail, is in the document on Fabric in practice.

## The technical debt of a model that grows without principles

<!-- seccion: deuda-tecnica-del-modelo -->

I also understood at Banco Pichincha that a semantic model accumulates technical debt when it grows
without common principles. Duplicated measures, ambiguous relationships, unnecessarily complex
calculations and undescriptive names do not always produce an immediate failure, but they make every
subsequent change riskier and more costly.

That is why optimization had to be accompanied by design discipline: simplifying where possible,
reusing logic, documenting relevant decisions and keeping a structure that could evolve without
permanently depending on its author. A model that only its maker understands is an operational risk
for the bank, not a matter of style.

That discipline was sustained with two tools —DAX Studio and Tabular Editor— and with a question
before every new measure: whether one already existed that did the same thing under another name.

## Optimization with DAX Studio and Tabular Editor

<!-- seccion: dax-studio-y-tabular-editor -->

I used DAX Studio to analyze the behavior of queries and measures, identify costly calculations and
establish before-and-after comparisons for certain adjustments. The purpose was not to optimize for
its own sake, but to ensure that the functional growth of the dashboards did not progressively
degrade the users' experience: a measure that takes seconds to respond in a dashboard with more than
50 users becomes a reason to stop opening it.

I also used Tabular Editor to strengthen the organization and maintainability of the models, review
properties, manage measures and apply consistent practices to their objects. These tools allowed me
to work on Power BI with a perspective closer to model engineering than to the isolated creation of
reports.

Technical optimization had a direct consequence on adoption. A slow, ambiguous or hard-to-maintain
model weakens trust and increases dependence on the team that created it. In contrast, a fast,
consistent and understandable solution eases exploration and lets the user focus their attention on
the decision.

This stage deepened one of the capabilities that distinguishes my profile today: the Power BI
specialty understood end to end. This comprises data preparation in Power Query, semantic model
design, measure engineering in DAX, optimization, the user experience and the relationship between
the analytics product and the business decision.

## The predictive models: churn, delinquency and risk in production

<!-- seccion: modelos-predictivos -->

I trained and took to production, with scikit-learn, machine learning models aimed at anticipating
behaviors relevant to the bank: customer churn —which customer may leave—, delinquency —which
obligation may stop being paid— and risk —which operation concentrates it—. They are the three
questions any bank asks itself; what changes is the quality of the data and of the process with
which they are answered. This experience extended the scope of analytics from describing historical
results to estimating possible future scenarios.

The work with these models reinforced a learning that had begun in the transport sector with demand
forecasting: the technical quality of a prediction does not by itself guarantee its business value.
The result must correspond to a concrete decision, arrive within the time available to act and be
understandable enough for the owners to know how to use it.

Development required preparing consistent variables, selecting historically available information
and preventing the model from incorporating data that would not exist at the moment of producing a
real prediction: a delinquency model that uses information from after the default is perfect in the
lab and useless in operation. It was also necessary to evaluate its performance beyond a single
overall figure, observing whether the behavior remained stable across different segments and
conditions.

The reported results exceeded 90% accuracy and improved predictions by up to 35% compared to what
existed before. These figures must be interpreted within the metrics, populations and horizons of
each case, without presenting a single measure as sufficient evidence of the value of all the
models.

## Evaluating a model by its errors and by what each error costs

<!-- seccion: evaluar-por-errores -->

The evaluation of the Banco Pichincha models had to distinguish between statistical performance and
operational usefulness. A high overall metric could hide weak results in relevant segments, minority
classes or situations especially costly for the business. That is why the analysis could not be
limited to asking how many predictions were correct, but also where the errors concentrated, what
consequences they had and whether the model brought a real improvement over the existing way of
deciding.

It was also necessary to analyze the relative cost of the different errors. Intervening on a case
that ultimately did not require it does not always have the same consequence as failing to identify
one that really mattered: calling a customer who was not going to leave costs a call; not calling
the one who does leave costs the customer. The selection of thresholds and usage criteria had to
respond to the business purpose, the capacity available to act and the level of risk the
organization was prepared to take on.

In banking an overall metric hides the error where it costs the most, and that is why evaluation by
segment was not a refinement but a condition for taking the model to production. How errors are
evaluated and how a model is sustained in production, with this case and the SITP one compared, is
in the predictive analytics document.

## From prediction to decision: the integration with Power BI

<!-- seccion: prediccion-en-power-bi -->

Integrating the models' output with Power BI brought the predictions closer to the users responsible
for interpreting them. However, a probability or a classification was not to be presented as an
automatic decision. It had to be accompanied by context —the customer's history, the evolution of
the obligation, the segment— interpretation criteria and a clear understanding of its limitations.

This experience created a bridge between business intelligence and artificial intelligence. The
predictive model generated a signal; the analytics product integrated it with historical and
contextual information; and the responsible person evaluated how it should be incorporated into the
decision. Reliability arose from the relationship between these capabilities, not from the algorithm
considered in isolation.

It also strengthened a conviction I currently apply in designing AI applications and agents: an
intelligent solution needs to be evaluable. It must be possible to understand what information it
uses, what result it produces, under which conditions it can fail and when human intervention should
be kept.

This learning broadened the way I evaluate artificial intelligence solutions. The question is not
only whether a model works, but for whom it works, under which conditions, with what kind of error
and within which process it will be used. Technical evaluation provides evidence about behavior; the
business context determines whether that behavior is reliable enough to support a decision. The 2023
churn, delinquency and risk models were my first complete application of that question in banking.

## Data governance

<!-- seccion: gobierno-de-datos -->

At Banco Pichincha I co-led a data governance initiative aimed at strengthening the security,
quality and reliability of information. I deliberately keep the expression "co-led" because
governance cannot be built as an individual initiative, nor be the exclusive responsibility of the
analytics team. It requires the participation of the areas that produce, manage, protect and use the
data.

My contribution focused on connecting the analytics needs with practices that made it possible to
use the information more consistently. This meant promoting shared definitions, identifying
responsibilities over the data, strengthening quality criteria and helping the analytics products
keep greater traceability over their sources and transformations.

In banking governance is not optional: the information is critical, regulated and has direct
consequences for customers. That made the shared definitions of the dashboards, the ETL validations
and the traceability of the predictive models both good BI practices and governance controls at the
same time. The three governance experiences of my career —banking, an agent startup and the
healthcare sector— are compared in the data governance and AI governance document.

## Governance in practice: definitions, owners and access

<!-- seccion: gobierno-en-la-practica -->

Data governance took on a practical meaning at Banco Pichincha. A metric needed an understandable
definition and an identifiable responsibility. A data set had to have minimum criteria to evaluate
whether it was ready for a given use. Access had to match each user's need and responsibility,
defined by purpose and not by convenience. Changes in the business rules had to be reflected in a
controlled way in the models that depended on them.

Nor could quality be reduced to verifying that a column had the right format. It had to be evaluated
in relation to the purpose. A piece of data could be valid from a technical point of view and, at
the same time, be incomplete, out of date or insufficient for a given decision. Governing required
understanding how the information was produced and what consequences its use could generate.

This stage taught me that security and usability must not be posed as incompatible goals. The
purpose of governance is not to block access indiscriminately, but to let the right information
reach the right people, under understandable, controlled and traceable conditions.

I also understood that documentation only adds value when it is integrated into operations. A
definition nobody consults or a responsibility nobody acknowledges does not constitute effective
governance. The practices had to be rigorous enough to protect the information and applicable enough
to become part of the daily work of the more than 50 users of the dashboards.

## Governing the complete life cycle of analytics products

<!-- seccion: gobernar-el-ciclo-de-vida -->

I also understood at Banco Pichincha that governance must accompany the complete life cycle of
analytics products. A metric can change when the business evolves, a source can lose quality and a
churn or delinquency model can stop adequately representing the reality it was designed for. That is
why publishing was not to mean abandoning: the solutions needed owners, reviews and criteria to be
updated, corrected or withdrawn when they stopped fulfilling their purpose.

This idea would become even more important in my later work with artificial intelligence.
Applications and agents must not only be approved before going into operation; they must remain
observable, evaluable and subject to improvement throughout their entire life cycle. Governing means
keeping the capacity to intervene when the data, the context, the risks or the organization's needs
change.

This learning later became an essential base for my work with artificial intelligence. Models,
applications and agents need authorized sources, identified owners, access controls, evaluation
criteria and traceability over the results they produce. Artificial intelligence does not replace
data governance; it makes its necessity even more evident.

## The Banco Pichincha results in figures

<!-- seccion: resultados-en-cifras -->

Five months, a team of five people and the figures my CV and the site's case study publish:

| Front                                   | Result                                                                              | What is behind it                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Decision-oriented dashboards            | 50+ users · +25% in decision-making                                                 | design from the decision, one definition per concept, path from aggregate to detail     |
| ETL optimization in Power Query         | −35% in analysis times                                                              | queries separated by function, early selection, validations before the model            |
| Predictive models with scikit-learn     | >90% accuracy · +35% in predictions · in production                                 | churn, delinquency and risk; variables available at prediction time; evaluation by segment |
| Semantic models                         | optimized with DAX Studio and Tabular Editor                                        | centralized measures, conventions, technical debt under control                         |
| Training program                        | 12 professionals · +20% productivity in preparing and using information             | Power Query, modeling, DAX, communication, support on real products                     |
| Data governance                         | co-led                                                                              | shared definitions, owners per data set, access by purpose                              |

All of it between March and July 2023, at Banco Pichincha.

## What Banco Pichincha consolidated

<!-- seccion: lo-que-pichincha-consolido -->

Seen in retrospect, Banco Pichincha was the experience in which I consolidated my depth in business
intelligence and extended it toward a more complete vision of an analytics platform. There converged
data preparation, semantic models, measure engineering, optimization, user training, adoption,
predictive models and information governance.

The main evolution did not consist of learning a new tool, but of understanding how all these
capabilities had to work together. Power Query structured the preparation. The semantic model
organized the meaning. DAX turned the definitions into verifiable metrics. Power BI brought the
information closer to the decision. Training strengthened autonomy. Governance protected trust. The
predictive models extended the conversation from what had happened to what could happen.

Banco Pichincha thus became the bridge between my experience in business analytics and my later
evolution toward artificial intelligence solutions and agents. I arrived with experience integrating
sources, automating processes and developing analytics products. I left with a deeper understanding
of the semantic model, adoption, governance and the relationship between information, prediction,
decision and action.

The experience was brief in duration —five months—, but concentrated in learning and consolidation.
It allowed me to go from building effective analytics solutions to understanding the conditions
needed for those solutions to become reliable, reusable and sustainable business capabilities. A
month after leaving the bank, in August 2023, I was starting at Vesting to build the data platform
of an agent startup.

## The level of agency an organization transfers to its solutions

<!-- seccion: nivel-de-agencia -->

This experience also allowed me to recognize that every decision requires a different instrument.
Some need a table or a periodic report. Others require an exploratory dashboard, an alert, a
prediction or a recommendation. The right alternative is not the one that uses the most advanced
technology, but the one that offers the appropriate degree of information, timeliness and capacity
to act.

There my interest in the level of agency an organization transfers to its solutions began to
consolidate. A dashboard makes a situation visible, but keeps interpretation and action with the
person. An alert directs attention. A prediction anticipates a possibility. A recommendation
proposes a path. An application guides execution. An AI agent can use knowledge and tools to perform
certain actions. Each step forward demands more evaluation, traceability, control and clarity about
responsibility.

At Banco Pichincha the instruments went as far as prediction: the churn, delinquency and risk models
anticipated, and the person decided. The next steps —the recommendation, the application, the agent—
would come later, with Vesting and with my own applications and agents; but the scale by which I
judge them was set at the bank, in 2023.
