---
slug: analitica-predictiva
codigo: AF-21
titulo: "Predictive analytics"
resumen: "Two families of models in production with scikit-learn —SITP demand by route and time band, and churn, delinquency and risk in banking with over 90% accuracy—, the machine learning tools I use and at what level, the statistics and feature engineering that hold the model up, and Probeta DS."
cuando_usar: "Use this when they ask about predictive models and machine learning: demand forecasting, churn, delinquency and risk models, the accuracy reached, tools (Python, scikit-learn, pandas, numpy, R, SQL), his statistics background, programming languages, natural language processing and Probeta DS."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What predictive models has Henry built?"
  - "What machine learning tools does he use?"
  - "Has he taken a machine learning model to production?"
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

## Two families of models in two different sectors

<!-- seccion: dos-modelos -->

I have developed and taken to production machine learning solutions in two especially different
contexts: demand planning in mass transit, with C&M Consultores for TransMilenio, and
anticipating customer behavior in the financial sector, at Banco Pichincha. In both cases I used
machine learning with scikit-learn to expand the organization's decision-making capacity, but the
phenomenon, the horizon, the consequences of error and the way of incorporating the result were
completely different.

In transport, the phenomenon was how many people were going to board each route in each time band
of the following month; the error cost extra buses on one route and users without room on
another; and the result went into a monthly demand report. In banking, the phenomenon was which
customer might leave, which obligation might stop being paid and which operation concentrated
risk; the error cost an unnecessary intervention or a lost retention opportunity; and the result
went into the prioritization of retention and collection actions.

These two sectors demonstrated that the predictive method can be carried over, but the meaning of
the problem cannot. The pipeline of preparation, training, validation and evaluation preserves
common principles. However, the variables, the errors, the thresholds, the horizon and the
consequences must be designed anew for each domain.

The method travels; the phenomenon, its constraints and the decision remain deeply tied to the
context. The two experiences, told within their jobs, are in the TransMilenio and Banco Pichincha
documents; here I look at them from the craft of modeling.

## TransMilenio demand by route and time band: horizon, granularity and use

<!-- seccion: demanda-transmilenio -->

At C&M Consultores, between July 2021 and May 2022, I developed with scikit-learn a model to
predict the demand of the transport system within a monthly planning horizon, with monthly
updates. The variables captured three dimensions of the system: the temporal one, with the type
of day of the week and the hour of the day, which represent the recurring patterns; the
structural one, with the route, which captures the differences between services and zones; and
the external one, with civil works, events and traffic conditions, capable of modifying the usual
behavior.

The monthly horizon did not mean reducing demand to a single aggregate figure. The prediction had
to preserve enough detail by route, type of day and time band to represent how demand could be
distributed within the period. This combination of planning horizon and operational granularity
made it possible to turn a monthly expectation into information useful for preparing the
schedule and guiding the allocation of capacity.

Validation was done with RMSE and respecting the temporal order: the model was evaluated on
periods later than the ones it had seen, never with future data explaining the past, because that
is how the operation was going to face it. The model ran for ten months. It was used by the
professionals who presented the reference demand report the units scheduled with, and it
contributed to a reported 20% improvement in the system's performance.

The most important lesson, however, was understanding that a prediction only produces value when
it coincides with the moment at which the organization can still change a decision. An exact
estimate that arrives after the schedule has closed may be of analytical interest, but it loses
an important part of its operational usefulness.

## Churn, delinquency and risk at Banco Pichincha

<!-- seccion: fuga-mora-y-riesgo -->

At Banco Pichincha, in 2023, I trained and took to production predictive models aimed at three
families of behavior: customer churn, delinquency and risk. The models sought to anticipate events
that might require a differentiated intervention, allowing the organization to prioritize
analysis and actions on groups with relevant signals.

The reported results exceeded 90% accuracy and improved the existing predictions by up to 35%.
These figures must be interpreted within the datasets, populations, horizons and metrics used in
each case. I do not present a general measure as if it described by itself the entire behavior of
the models, and a high accuracy on an imbalanced class says less than it seems: that is why the
analysis looked at where the errors concentrated and not only how many there were.

In customer churn, the prediction had to help identify signals associated with a possible
departure and facilitate the prioritization of retention actions. In delinquency, the purpose was
to recognize in advance obligations that might stop being paid, so that collections acted before
and not after. In risk, the signal helped recognize which operations deserved more attention and
provided an additional input within the corresponding analysis. In all three cases, the model
generated evidence to support a decision, not an automatic decision that replaced the judgment of
those responsible.

The predictions reached the people who used them through Power BI, together with the customer's
historical and contextual information, in the same dashboards that more than 50 business users
had adopted. A churn model whose result nobody opens retains nobody; the delivery channel was
part of the model's design.

## The predictive problem begins before the algorithm

<!-- seccion: antes-del-algoritmo -->

Before selecting an algorithm I need to define precisely which phenomenon is to be anticipated,
which unit will be observed, how far in advance the answer must be produced and which decision
can be changed on the basis of the result. At TransMilenio the unit was the route in a time band
of a type of day; at Banco Pichincha, the customer or the obligation within a decision horizon
defined by the business.

This definition establishes the relationship between the prediction horizon and the decision
horizon. It is not always useful to predict as far ahead as possible. A projection that is too
distant can accumulate uncertainty, while a prediction that is too close can arrive when the
organization no longer has the capacity to act.

I also need to determine what information will really be available at the moment of producing
the prediction. A variable can explain the historical result very well and be completely useless
if it only appears after the event one is trying to anticipate has occurred. Incorporating it
would produce an apparently outstanding model, but one impossible to use correctly under real
conditions. In Probeta DS I turned that rule into an automatic warning: the app names the column
that looks like a proxy of the target before allowing training.

The unit of analysis must also remain stable. A record can represent a person, a route, a time
band, a transaction, an interaction or a period. Mixing units inconsistently can generate
artificial relationships and misleading evaluations.

The target variable needs an equally rigorous definition. A model can reach a high metric and
still be predicting an ambiguous label, built with rules that do not adequately represent the
phenomenon. The quality of the algorithm never compensates for an incorrect definition of the
problem.

This discipline comes directly from my training in Industrial Engineering. Before optimizing or
predicting a system I need to understand its entities, relationships, constraints, cycles and
mechanisms of variation. Prediction begins with knowledge of the process, not with running a
library. The selection of the algorithm comes afterwards: first a defensible representation of
the problem is built, and only then does it make sense to compare models and evaluate which one
offers the right balance between performance, interpretability, cost and possibility of
integration.

## What taking a model to production means

<!-- seccion: en-produccion -->

I use the expression model in production carefully. I do not consider that a model reaches that
state because it obtained a high metric in a notebook, because it can run inferences or because
its results appear inside a presentation.

A model starts working as an operational capability when its predictions are integrated into a
real process, arrive within the decision cycle, use available information and have responsible
people capable of interpreting their results and acting on them. At TransMilenio the prediction
went into the monthly demand report for ten months; at Banco Pichincha, into the prioritization
of retention and collection actions.

This requires a reproducible pipeline. The data must be located, validated and transformed by
consistent rules. The variables used during inference must correspond to those employed during
development. The predictions need to preserve the date, the version, the context and the
population for which they were produced.

It also requires defining what happens when the data does not meet the expected conditions. A
source can arrive incomplete, change its structure, lose timeliness or alter the distribution of
a variable. The solution needs controls that make those conditions visible before the model
produces apparently valid results on defective inputs. In transport, a weekly database that
arrived with a renamed route was exactly that case, and the control was a prior validation and
not the good memory of whoever loaded it.

The prediction must reach an identifiable consumer and decision. Without that connection, the
output remains a technical result. There must also be a way to reconstruct what happened: if a
prediction was used weeks ago, I need to be able to identify which version of the model
intervened, what data it received and under what rules the result was generated. This
traceability is indispensable for investigating errors, comparing behaviors and sustaining trust.

Finally, production implies responsibility over time. Data changes, segments evolve, variables can
lose explanatory power and the relationship between the prediction and the decision can change.
The model needs follow-up, review and criteria for being updated, restricted or retired. A model
in production is not a deployed file. It is a system of data, decisions, controls, users and
responsibilities that must keep working after the first prediction.

## Evaluating a model is evaluating its errors

<!-- seccion: evaluar-los-errores -->

I do not evaluate a model only by its overall accuracy. An aggregate metric can hide deficient
behavior in important segments, specific periods or classes that appear less frequently but have
greater consequences for the business.

An accuracy above 90% can be uninformative when the distribution of the phenomenon is strongly
imbalanced. A model could be right often because it correctly predicts the majority condition
and still fail precisely in the cases that justified building it. In customer churn, the class
that matters is the minority one: those who leave.

That is why the evaluation needs to consider the type of problem and the relative cost of the
errors. A false positive and a false negative do not always have the same consequence.
Identifying as risky a case that finally was not can produce an unnecessary intervention. Not
detecting a really relevant case can prevent a timely action. The selection of the threshold must
reflect that difference, and that is why I look at the confusion matrix before the accuracy: what
the model gets wrong, not just how much.

I also observe behavior across segments. A favorable overall result can coexist with unstable
performance on certain routes, time bands, groups or external conditions. At TransMilenio, an
acceptable RMSE in the aggregate could hide specific routes where the error was systematic, and
those were precisely the ones the scheduling needed to get right. Quality must be evaluated where
the organization will actually use the prediction.

## Temporal order, calibration and baseline

<!-- seccion: orden-temporal-calibracion-linea-base -->

In problems with a temporal dimension, the evaluation must respect the order of the data. Using
future information to explain the past can produce artificially high results. That is why
validation must approximate the way the model will face later periods within the operation: that
is how I validated TransMilenio's demand, with RMSE on periods the model had not seen.

Calibration is also relevant when the output is interpreted as a probability. It is not enough to
rank the cases correctly. The magnitude of the estimate must correspond reasonably to the
observed frequency if it will be used to define thresholds, intervention capacity or priority
levels. A churn model that says "80%" to a group of which 30% leaves ranks well and calibrates
badly, and whoever distributes retention capacity with that figure distributes it badly.

The model must also be compared against a defensible baseline. Algorithmic sophistication has no
value by itself. I need to know whether the solution really improves on a simple rule, a
historical mean, an existing approach or the current way of deciding. At Banco Pichincha the
baseline was the prediction that already existed, and the model improved it by up to 35%; in
Probeta DS the baseline is in plain sight by design —majority class and logistic regression— and
the verdict says "does not beat" when it does not beat.

The right question is not only how many predictions were correct. It is where the model goes
wrong, what consequences those errors have, whether the organization can manage them and whether
the benefit exceeds the complexity the solution introduces.

## From prediction to decision

<!-- seccion: de-la-prediccion-a-la-decision -->

A prediction is not a decision. It is a signal built from historical evidence and assumptions
that must be interpreted within a given process.

The model can estimate demand, probability of churn or risk of delinquency, but it does not know
by itself all the constraints the organization faces. It does not necessarily understand the
capacity available to intervene, the priorities of the moment, the institutional rules or the
qualitative information that is not yet represented in the data.

That is why the result needs a decision layer. This may consist of rules, thresholds,
prioritization, service capacity, human review or a combination of these elements. The
analytical output gains value when it is related to a possible action and to a responsible
person capable of evaluating it.

In transport, the prediction had to be translated into a perspective useful for planning and
scheduling: the reference demand report the units took in order to decide. In banking, the
probabilities could help prioritize cases, but the intervention depended on additional criteria
and on the corresponding responsibilities.

Power BI plays an important role in this integration. The prediction can be presented together
with historical information, contextual variables, segments and trends that help the user
understand why the case deserves attention. The model provides a signal; the analytical product
provides the context to interpret it. That is how the results were delivered at Banco Pichincha
in 2023.

However, not every prediction needs to end up in a dashboard either. Some can feed an alert, an
application or a workflow. Others can be used by an agent that retrieves information and prepares
a recommendation. The right instrument depends on the frequency, the risk, the time and the level
of interpretation required.

Responsibility must remain explicit. A system can prioritize, rank or recommend. The authorized
person or process determines the action when the consequence demands additional knowledge,
judgment or accountability. The value of predictive analytics does not lie in anticipating the
future as a certainty. It lies in reducing uncertainty enough for a decision to be made earlier,
with more context and with a better understanding of its risks.

## Machine learning tools and programming languages: Python, R, SQL, and at what level

<!-- seccion: las-herramientas -->

The programming languages I work with are Python, R, SQL and DAX; the most advanced level is
Python. Python with scikit-learn constitutes one of my main bases for developing predictive
models. It is the environment I used in transport, in banking and at Vesting to structure
variables, train models, compare results and produce predictions applicable to the corresponding
problem.

Pandas and NumPy are a regular part of my preparation and exploration work. I use them to
organize data, transform variables, build analysis sets, evaluate distributions and prepare the
information the models need.

Matplotlib and Seaborn let me examine patterns, relationships, differences between segments and
behaviors that must be understood before training. Exploratory visualization does not replace
statistical tests, but it helps formulate questions and detect conditions that might remain
hidden inside a table.

Jupyter facilitates experimentation and the documentation of the analytical journey. However, I
do not consider the notebook the final destination of a solution. It is a space for exploring,
comparing and learning. When the work needs to become an operational capability, the logic must
be structured reproducibly and separated from manual decisions that are hard to trace.

R, RStudio, ggplot2 and Shiny complement my experience in statistical analysis, predictive
modeling and communication of results. I deliberately incorporated R after Python to go deeper
into hypothesis testing, statistical reasoning and evaluation of evidence; the IBM certification
in applied data science with R, earned in 2024, closed with a project on real data with
hypothesis tests and a Shiny dashboard.

SQL has been there from Inglopres to today: it is the language with which I locate and prepare
the data before it reaches Python, and the one I used in SQLite to organize TransMilenio's weekly
databases into cumulative analyses.

## Each tool, at what level: the honest table

<!-- seccion: nivel-por-herramienta -->

I do not present the tools as equivalent or as a competence defined solely by their name. This is
the honest list, tool by tool:

| Tool | Level | Where |
| --- | --- | --- |
| Python with scikit-learn, Pandas, NumPy | real work in production | Banco Pichincha, TransMilenio and Vesting |
| Matplotlib, Seaborn, Jupyter | real work, exploration and documentation | all modeling projects |
| R, RStudio, ggplot2, Shiny | real work, statistical analysis | IBM certification of 2024 and my own analyses |
| SQL | real work | from Inglopres to today |
| PyTorch, TensorFlow | exploration | neural networks and deep learning, with no case in production |
| Watson Studio | exploration | analytical flows |
| Orange Data Mining, SPSS | training | university |
| SAS | complementary work and training | Cafam, as a complementary analysis tool |
| Natural language processing (NLP) on large language models (LLM) | real work | some of my agents use it permanently |

These tools do not represent the same level of specialization nor do they fulfill the same
function. Python, scikit-learn, Pandas, NumPy and SQL occupy a central place in my modeling and
preparation practice. R strengthens statistical analysis. PyTorch and TensorFlow extend the reach
toward neural networks, and I have used them to explore, not to deliver. SPSS, SAS, Watson Studio
and Orange gave me other ways to explore, validate and operationalize analyses depending on the
context, and I declare them at the level they had. NLP is different: it does not come from a
course but from something built, because several of my agents use it permanently on language
models.

My judgment concentrates on selecting the tool according to the phenomenon, the volume, the need
for interpretation, the available environment and the way the result will have to be integrated.
The algorithm and the platform matter, but predictive value arises from the quality with which
the problem is formulated, the variables are built, the errors are evaluated and the output is
connected to a decision.

## The statistics that hold the model up

<!-- seccion: la-estadistica -->

My relationship with predictive analytics began in the Data Analytics Intelligence emphasis of
Industrial Engineering, between 2009 and 2016 at the Universidad Javeriana, where modeling and
predicting phenomena were part of the way of understanding systems, not of an isolated
programming course. That is where SPSS and Orange appeared, as training tools, before Python.

This training established a discipline I maintain: before training a model, I need to understand
whether the phenomenon has enough history, whether the variables adequately represent what they
claim to measure, whether the observed population is comparable and whether there are changes
that could alter the learned relationship.

Statistics makes it possible to distinguish between an observed association and a conclusion
that can be sustained. It also forces the examination of variability, uncertainty, sample size,
biases, outliers and the conditions under which a result can be generalized.

A technically available variable is not necessarily a valid variable. It can represent a later
effect, contain information from the future, indirectly duplicate the target, concentrate biases
of the process or work only in part of the population.

Temporal stability is another fundamental principle. A relationship identified in one period can
weaken when the conditions of the environment, the business rules or people's behavior change.
The model learns from the past; the organization needs to determine whether that past is still
an adequate reference.

I also distinguish between prediction and causality. That a variable helps anticipate a result
does not necessarily demonstrate that intervening on it will produce the expected change. This
difference protects the organization from turning a predictive association into a causal
recommendation without sufficient evidence. That civil works anticipate a drop in demand on a
route does not mean that suspending them recovers it: the works also signal other things that
changed in the area.

A model with a high metric on a poorly defined variable is still a weak solution. Accuracy does
not correct an incorrect conceptual construction. That is why an important part of my work
happens before selecting the algorithm: understanding the process, establishing the unit of
analysis and building a defensible representation of the phenomenon. Industrial Engineering
provides the understanding of the system. Data science provides the methods to learn from its
evidence. Statistics establishes how much can be claimed and under what conditions.

## Feature engineering connects the process with the model

<!-- seccion: ingenieria-de-variables -->

Variables do not appear finished inside the sources. They must be built from events, states,
relationships and time windows that adequately represent the behavior of the system.

Industrial Engineering plays a central role at this stage. Understanding the process lets me
identify which events can anticipate a result, which accumulations reflect a constraint, which
sequences reveal a change and which external conditions modify the expected behavior.

In transport, the type of day, the route, the hour, the works, the events and the traffic turned
temporal, territorial and urban conditions into signals the model could use. They were not
fields selected merely because they were available. They represented mechanisms capable of
modifying demand, and they came from different sources —fare collection, fleet and GPS,
scheduling, incidents— that the C&M Consultores ETL unified before the model existed.

In banking, the behavior-related variables had to be organized respecting the moment at which
the prediction would be produced. A feature was only valid if it could be calculated with the
information available before the target event: nothing from the future leaked into training.

Fragmentation between development and operation must also be avoided. The transformation that
builds a variable during training must correspond to the one later used to produce predictions.
An apparently small difference can change the input distribution and degrade the result. That is
why feature engineering needs rules, versioning and tests. Each feature must have a meaning, a
source, a time window and a clear relationship with the unit of analysis. In Probeta DS that rule
is structural: preprocessing is fitted only on the training half and the interface offers no
other path.

DP-600 brings a relevant perspective to this integration. Microsoft Fabric's pipelines,
warehouses and analytical models can organize reusable data for people, Power BI products and
predictive solutions. The variable does not need to be built differently in each product if
there is a governed base capable of sustaining it.

Feature engineering is the point where domain knowledge becomes mathematical representation. Its
quality largely determines what the model can learn and how defensible the result will be.

## Observing the model after deploying it: the five levels

<!-- seccion: monitoreo-del-modelo -->

A model's behavior is not guaranteed by having obtained good results during development. After
being deployed, it needs to be observed against new data, changing conditions and real
decisions. I distinguish five levels.

The first level corresponds to the quality of the inputs. I must know whether the sources
arrived, whether the variables keep the expected types and ranges, whether missing values
increased and whether the population is still comparable to the one used during development.

The second level corresponds to the distribution. A variable can continue to exist and
significantly change its behavior. That modification does not automatically demonstrate that the
model has stopped working, but it constitutes a signal that needs analysis.

The third level corresponds to observed performance. When the real result is available, the
predictions must be compared with what happened. This makes it possible to know whether the
metrics remain within acceptable ranges and whether certain segments show greater degradation.
At TransMilenio the real result arrived with the month's fare collection: the prediction by
route and time band was contrasted with what really happened.

The fourth level corresponds to use. A model can maintain good technical performance and lose
value because the organization changed the process, stopped using the result or no longer has
the capacity to act on the predictions.

The fifth level corresponds to impact. It must be evaluated whether the decisions supported by
the model contributed to the expected result and whether its benefits continue to justify the
cost, the complexity and the risks introduced.

Monitoring must lead to decisions. A deviation may require investigating the source, adjusting a
transformation, recalibrating a threshold, retraining the model, limiting its use or temporarily
returning to a previous version.

## Drift: the risk that initial validation does not cover

<!-- seccion: la-deriva -->

A model degrades without warning. Drift —of the input data, of the relationship the model
learned, of the population it predicts on— is the risk that initial validation does not cover,
and that is why the five levels above are watched in production and not only before publishing:
distribution of the inputs against that of training, quality of the sources, performance by
segment against the real result when it arrives, and the use those responsible make of the
prediction.

I do not have a case of observed drift of my own that I can tell with its figures; what I did
build is the infrastructure to see it. At Vesting, between August 2023 and January 2025, the
real-time monitoring of up to 23 agents collected per session what a model needs in order to be
watched —inputs, outputs, times, states, cost— and carried it to Microsoft Fabric and Power BI,
where a degradation showed up as a trend and not as a complaint.

The AI-300 path formally goes deeper into these MLOps and GenAIOps practices. Its value in my
career is to extend, through a recognized structure, principles I already consider
indispensable: versioning, evaluation, observability, response to degradations and life-cycle
management. An operational model needs to know not only how to produce a prediction, but also
how to demonstrate that it still deserves to be used.

## Probeta DS: building a model that can be defended

<!-- seccion: donde-lo-aplico-hoy -->

Within my own pipeline I developed Probeta DS, a published application whose promise is to build
a model that can be defended. It runs Python, Pandas and scikit-learn inside the browser through
WebAssembly, with Pyodide in a Web Worker, separating processing from the interface to preserve
a usable experience.

Local execution makes it possible to work without sending the user's file to an external server.
This decision combines architecture, privacy and experience: the application takes advantage of
advanced analytical capabilities while keeping processing close to the person using the
solution. Four end-to-end tests inspect every network request during the complete journey and
fail if any contains values from the dataset: zero user rows leave the browser.

Probeta DS does not concentrate only on training an algorithm and showing a metric. Its purpose
is to structure a journey in which the data can be examined, the variables understood, the
information prepared, alternatives trained, results evaluated and enough evidence preserved to
explain the selection made.

The word defend is deliberate. A defensible model needs to answer which phenomenon it tries to
anticipate, what data it used, how the variables were built, which baseline it had to beat, what
errors it produces, in which segments it works better or worse and under what conditions its
result can be used. It is designed for the professional who is not a data scientist and has to
defend a model before their boss or their committee, not win a leaderboard.

The application has 33 features, 267 unit and integration tests, 24 end-to-end tests and 90.69%
line coverage, according to the measurements published in its technical sheet of August 2026.
These figures describe the state of the piece, but they do not replace the evaluation of the
methodological quality of the models built with it.

## What Probeta DS does inside: baselines, leakage made impossible and test figures

<!-- seccion: probeta-por-dentro -->

What Probeta DS does inside is the same discipline of this document turned into a product. Two
models compete with the same preprocessing —Random Forest and HistGradientBoosting from
scikit-learn— and the result says which one won; the user does not choose. Both are judged
against two baselines in plain sight, the majority class and a logistic regression, and the
verdict marks "beats", "ties" or "does not beat" with the exact number of the difference.

The five metrics —accuracy, precision, recall, F1 and AUC— are always calculated on the test set,
with the confusion matrix beside them to see what it gets wrong and not just how much. Data
leakage is impossible by construction: preprocessing is fitted only on the training half. And a
near-perfect metric is not celebrated: it is flagged as suspicious, because a round result almost
always hides a leak.

Feature importance is calculated by permutation on the test set, with direction; if the model
does not rely on a variable, it says so. Everything ends up in a downloadable model card with
data, split, method, metrics, verdict and limits. The limits are stated up front: 5 MB or 50,000
rows, everything on CPU and without GPU, and an AI narration only on request, verified against
the numbers before being shown and discarded if it cites a figure that does not exist.

Probeta DS also demonstrates my capacity to carry data science libraries into an accessible
experience. The user does not need to start by configuring a complete local environment to go
through the analytical process, but the simplification of the experience must not hide the
decisions or present training as an automatic procedure free of assumptions.

Industrial Design especially influences this piece. The challenge was not only running
scikit-learn inside the browser, but organizing the process into five screens so that a person
could understand which stage they were performing, which decisions they had to make and what
evidence they needed to preserve. The application represents the convergence of data science,
software engineering and design. It does not only demonstrate that I can train models. It
demonstrates that I can turn predictive modeling into a usable, verifiable, criteria-driven
product.

## From predictive models to intelligent systems

<!-- seccion: de-modelos-a-sistemas -->

Predictive analytics constitutes one of the foundations of enterprise artificial intelligence,
but it does not exhaust its scope. A model produces an estimate, a classification or a priority.
An application can integrate that output with rules, context and a user experience. An agent can
additionally retrieve knowledge, use tools and coordinate actions within defined limits.

This progression does not automatically make the agent a superior solution. Each level introduces
additional capabilities and responsibilities. When a prediction is enough, adding a generative
architecture can increase cost, variability and difficulty of evaluation without producing
proportional value. It is the code-first rule with which I build my applications: Velo and
Innmobiliaria do not have a single AI model because they do not need one.

My predictive experience brings an important discipline to agent development: define the
objective, build a baseline, separate training and evaluation, analyze errors, observe segments
and compare the result with an explicit criterion.

Generative agents need that same evaluation culture, even though their results cannot always be
measured with the traditional metrics of classification or regression. They must be evaluated
for compliance, grounding, tool selection, quality of the outputs, cost, latency and behavior in
the face of exceptions. When I measured my agentic ecosystem I did it with that logic: 120
scenarios, a baseline, a compliance metric and a consumption metric.

DP-600 provides the base of data and semantic models that can feed both human analysis and
intelligent solutions. The AI-103 path extends that base toward applications and agents. The
AI-300 path strengthens the capacity to operate, evaluate and observe traditional models and
generative systems throughout their life cycle.

The evolution of my profile has not consisted in abandoning predictive analytics to devote
myself to agents. It consists in incorporating prediction within broader architectures, where
models, data, rules, interfaces and people participate in a coordinated way. Prediction provides
a signal. The architecture determines how it is interpreted, who can use it, what action it can
produce and what evidence must be preserved.

## What my predictive approach demonstrates

<!-- seccion: lo-que-demuestra -->

My work in predictive analytics demonstrates that I do not separate the model from the process
that gives it purpose or from the architecture that makes it usable.

I begin by defining the phenomenon, the unit of analysis, the horizon and the decision. Then I
build variables that represent conditions available at the right moment, establish a baseline
and select the metrics according to the cost of the errors.

The evaluation does not end in an average. I examine segments, stability, temporality,
calibration and the conditions under which the result may stop being reliable. I also
distinguish prediction from causality and avoid turning an association into a recommendation
without sufficient evidence.

Deployment does not end in an available inference either. The model needs reproducible
pipelines, controlled inputs, responsible people, context for interpretation and mechanisms to
observe whether it continues to fulfill its purpose.

My technical depth spans Python, scikit-learn, Pandas, NumPy, R and different analysis and
machine learning environments. However, my main differential does not lie in the number of
libraries used. It lies in the capacity to connect process knowledge, statistics, modeling, data
engineering, analytical product and decision.

Probeta DS turns this stance into a public application. The models developed in transport with
C&M Consultores and in banking with Banco Pichincha demonstrate its professional use: one ran for
ten months inside a monthly report; the others reached production with more than 90% accuracy.
My work with Fabric, Power BI and agents extends that experience toward architectures in which
predictions can be integrated with new forms of interaction and action.

I do not seek to build the model with the most striking metric. I seek to build a predictive
capability that can be explained, used, observed and defended when a person asks what the result
means and why it deserves to influence a decision.
