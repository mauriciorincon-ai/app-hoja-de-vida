---
slug: las-investigaciones
titulo: "The research: method before result"
resumen: "Seven research lines published with their measured gap —1,414, 900, 780, 279, 1,405, 119 and 900 works reviewed— and their findings, produced with two harnesses: Design Science (52 criteria, thresholds frozen before measuring) and Computational Paper (44 criteria, ledger: if it is not in the ledger it is not in the paper)."
cuando_usar: "Use this when they ask what research he has done, whether he has written articles or papers, the two research harnesses (Design Science and Computational Paper), the method of measuring the gap in the literature, synthetic data and simulation, and what research has to do with an AI role."
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
  a CONFIRMAR marker in square brackets, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

## What they are: applied research, not journal articles

<!-- seccion: que-son -->

My portfolio gathers seven research lines published in the showcase of this site, each with a
technical sheet that presents its origin, question, measured gap, method, status, limits and
expected contribution. Publishing them in the showcase means making their development visible
and submitting their structure to review; it does not mean claiming that all of them have already
completed a process of scientific publication or peer review. No piece is sealed: all seven are
in an initial state, five of them already have a paper with closed production and ready to
submit, and none has been submitted yet, by a scheduling decision that is on record.

They are not essays built around an opinion. Each line begins with a delimited question, a
structured review of the literature and an explicit measurement of the gap it intends to
address. My purpose is not to declare that a topic has been little studied, but to establish what
has been researched, under what conditions, what results exist and what specific combination of
elements still lacks a sufficient answer.

All seven have a turn in a production queue, from the first to the seventh, and all seven passed
the same filter before entering: each was validated against the literature between September 2
and September 5, 2026, with seven criteria met out of seven. What changes between them is the
topic; what does not change is the method with which they are produced.

## Why I do research

<!-- seccion: por-que-investigo -->

I do research for two reasons. The first is that several of these questions arose during my
professional experience, when I was able to observe the problem, measure some of its consequences
or recognize its limitations, but did not yet have the time, the data or the tools needed to
build a rigorous answer. Two lines were born in public transport supervision, one in a book
printing plant where the allowance table gave 12% and the packing operators were exhausted by
three in the afternoon, another in the digitalization of processes, and another in my first ERP
implementation, at Inglopres, in 2016.

The second is that the research method directly strengthens my work with data and artificial
intelligence. Defining a question, establishing criteria before observing the result, building a
baseline, controlling the metrics and declaring the limits are the same disciplines needed to
evaluate a model, an agent, an operational policy or an enterprise architecture.

Industrial Engineering provides the root of several questions: assignment, balancing, capacity,
variability, reliability and control. Data science contributes the methods to analyze the
evidence. Software engineering makes it possible to build reproducible artifacts. Artificial
intelligence expands the capacity to review literature, organize knowledge and run experiments,
always under controls that prevent the model's fluency from being turned into scientific
authority.

## A hypothesis is not a finding

<!-- seccion: hipotesis-no-es-hallazgo -->

Research forces me to separate different classes of claims with precision. A hypothesis is not a
finding. A synthetic result does not constitute operational validation. A literature review does
not by itself demonstrate the effectiveness of an intervention. A technically functional artifact
does not acquire value only because it can be executed.

This distinction protects both academic rigor and professional credibility. Each piece must
declare what evidence it holds, what conclusion it can sustain and what work remains pending.
Research is not used to make a proposal look more solid than it really is, but to submit it to
conditions under which it may also be refuted. That is why the sheets separate, in 5 blocks,
what is sealed from what is selected, what is deferred and what is a declared extension: in the
assignment line, the consequences of assigning badly are sealed; the pair with fixed routes and
the driver, bus and route triplet are selected; and the contractual cost of assigning badly is
deferred, because it is a piece of consulting and not of research.

These seven lines therefore represent a single way of working applied to different problems:
understanding the phenomenon, measuring the gap, formulating a verifiable contribution and
building the evidence needed to accept, modify or reject the proposal.

## The method: the gap is measured first

<!-- seccion: se-mide-el-vacio -->

All the research begins with a common rule: the gap must be measured before the contribution is
proposed.

I do not consider it enough to state that a problem has received little attention, that the
literature is scarce or that no work addresses exactly the combination that interests me. These
formulations may be intuitively correct and still be hard to defend. To sustain them it is
necessary to define a corpus, establish criteria and systematically examine which conditions
each work meets: a systematic review with a protocol, with the inclusion and exclusion criteria
and the questions fixed before reading.

The review does not seek only to gather references related to the topic. It must turn the
literature into an analyzable set. Each document is classified using previously defined
criteria, such as the phenomenon studied, the type of intervention, the unit of analysis, the
variables considered, the evaluation method and the evidence reported. And every cited work is
checked one by one against its official record: in the assignment line, 241 works verified this
way; in ARKHÉ, 1,405.

From that structure, the gap stops being an impression. It can be expressed through counts,
intersections and absences observed within the reviewed corpus: 28 queries in six families and
three languages, 5,674 records screened and 120 preprints under label, in the case of ARKHÉ; 25
queries in six families plus 401 records by snowballing in the assignment case; 27 queries in
three languages and 3,057 records screened in the fatigue case. It can also be recognized that
close contributions exist, but that they still do not resolve the question under the combination
of conditions the research needs to study.

The limits of the search are declared with the same precision as its results: the search in
English is declared as a limit where it was done only in English; in fatigue, 1,296 records were
screened by title only, and so it is recorded.

## The measured gaps, line by line

<!-- seccion: la-tabla-de-vacios -->

| Line                                          | Corpus reviewed | Measured gap                                                                                                                                                       |
| --------------------------------------------- | --------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Driver–bus assignment with failures           |     1,414 works | none models failure as a property of the driver–vehicle pair; of 600, none optimizes kilometers with the breakdown as a consequence of the assignment              |
| Bus convoys (_bunching_)                      |       900 works | none reports sustained adoption of a control in operation; of 873, none translates the control into instructions by position in the convoy                         |
| Fatigue allowances and balancing              |       780 works | none synthesizes the allowance methods; of 378, none measures how fatigue changes the optimal balancing                                                            |
| FORJA: from the drawn process to the system   |       279 works | 53 target non-programmers and 40 produce an executable, but none requires declaring inputs, function and outputs per activity                                      |
| ARKHÉ: declarative knowledge ecosystem        |     1,405 works | no ecosystem meets the three conditions under a strict reading; individuals building complete systems with AI: 8 out of 400                                       |
| The agency spectrum of instruments            |      119 frameworks | none orders decision instruments by agency with evaluation and cost against an optimum; of 800 works, none prescribes the choice between classes               |
| Replacing an ERP with AI                      |       900 works | a single one with an assisted replacement strategy; 15 out of 500 study AI productivity in integrated systems, versus 138 in small tasks                            |

In each case, the figure makes sense only when accompanied by search, inclusion, exclusion,
classification and review criteria, and that is why no sheet claims a gap without the number of
works reviewed: it is one of their "nevers".

## Assignment in transport: 1,414 works and none models the failure of the pair

<!-- seccion: vacio-asignacion -->

In the line on assignment in transport, 1,414 works were reviewed without finding one that
modeled service failure as a property of the driver-and-vehicle pair under the specific
configuration evaluated, and of 600 in the neighboring cell, none optimizes kilometer compliance
with the breakdown as a consequence of the assignment itself. The gap is not that nobody has
studied assignment, reliability or transport. It lies in the concrete combination of those
elements and in the way they affect operational compliance.

The topic's validation corpus had 2,350 records: 25 queries in six families, in English —a
declared limit—, plus 401 records by snowballing; 241 works were verified one by one against
their official record. The closest neighbor is from 2025 and confirms that the conversation is
heading there: it is not an abandoned topic, it is a topic the literature is arriving at.

That gap has an operational root. Whoever dispatches buses assigns driver and bus with separate
lists —by seniority, by availability, by how long a bus has gone without leaving— and the
unfulfilled kilometers are deducted from payment without anyone knowing which pair failed or
why. The interaction between a driver and a specific bus is on no list, and that is why it was
not in the literature.

## Convoys, fatigue, FORJA and agency: the other gaps

<!-- seccion: otros-vacios -->

In convoy control, 900 works were reviewed without finding published evidence of sustained
adoption, under the defined conditions, of an operational policy equivalent to the one proposed,
and of 873, none translates the control into instructions by position in the convoy. And in the
cell of relaxing the no-overtaking prohibition there is a single work among 296 records, from
2017, which anchors the line and confirms that the cell is scarce in itself, not for lack of
searching. The pending question lies in the distance between recognizing the convoy and having
an applicable, evaluable and operable policy: the gap is in the action, not in the technique.

In the line on work fatigue and balancing, 780 works were reviewed without identifying a
synthesis that gathered, under the established criteria, the methods used to determine fatigue
allowances —the table that governs practice has no citable review—, and of 378 in the cell of
the balancing model, none measures how the fatigue curve changes the optimal balancing of a
line.

In FORJA, 279 works were examined without identifying a method that required, for each activity
of the process, an explicit specification of inputs, function and outputs as a traceability
mechanism between the business model and the implemented system: 53 direct their method at
non-programmers, 40 produce an executable, 20 meet two of the three conditions and none meets
all three. A second cell, re-audited with preprints admitted and in Spanish over 359 records,
found no work that compiles the model into agents verified with real users. And of 571 records
on trust, only 10 deal with trust through visible verified conformity: the literature is
dominated by the explainability of the result, not by conformity with what was specified.

In the study of the agency spectrum, 119 frameworks on levels of automation and distribution of
responsibilities were examined one by one. The gap identified is not the absence of
classifications, but the lack of a framework that orders decision instruments according to the
agency ceded and allows them to be evaluated against a known optimum, also incorporating their
cost: the literature occupies the scale in physical domains, and its translation into analytical
instruments with method and metric is free. Of 800 works, none prescribes the choice between
classes of instrument; the 8 found prescribe within a single class.

## ARKHÉ and the ERP replacement: the gaps of the systems lines

<!-- seccion: vacios-arkhe-y-erp -->

The other two corpora address knowledge architecture for artificial intelligence and the
progressive transformation of enterprise systems, and their gaps are counted with the same rule.

In ARKHÉ, 1,405 works were verified one by one to validate the topic. No published ecosystem
meets the three conditions —reusable declarative contracts, learning that returns to the core and
production in more than one domain— under a strict reading; under a generous reading 36 works
out of 500 reviewed meet them, a single one declares process knowledge of what it produces and
none produces systems in more than one domain. And the evidence of an individual building a
complete system with artificial intelligence is 8 works out of 400 records: the strong evidence
is in small tasks, with 440 works. That is why the program's own records weigh as evidence, and
that is why they are declared as self-hosted.

In the replacement of an ERP with artificial intelligence, 900 works were reviewed and a single
one presents an AI-assisted replacement strategy —a multi-agent framework without empirical
validation, not replicable—. Only 15 out of 500 study AI productivity in integrated systems,
versus 138 in small tasks over the same 500 records: that asymmetry defines the risk of the line
and is the reason to measure on a real system. And of 400 records, only 3 formalize the
replacement order by coupling, none on an ERP, which makes that order the first publishable
artifact of the line.

## A counted gap still has limits

<!-- seccion: limites-del-vacio -->

A counted gap still has limits. It demonstrates that a condition was not found within the corpus
and under the method applied. It does not demonstrate that it is impossible for a work to exist
outside the search, nor does it automatically turn the proposal into a valid contribution.

That is why every claim about the gap must keep its scope. The correct formulation is not
"nobody has done it", but "it was not identified within the reviewed corpus under these
criteria". This precision makes the conclusion less spectacular and far more defensible. The
1,414 records of the assignment line are 1,414 records in English, and that limit travels with
the figure; the 780 of fatigue were searched in three languages and exclude the German
tradition, and so it is recorded in the sheet.

A claimed gap can be an opinion. A gap measured against a documented corpus becomes evidence
about the state of knowledge, always within the explicit boundaries of the review. And the gap
is not the contribution: it is the permission to attempt it. What each line contributes
afterwards —a model, a policy, a protocol, a compiler, an architecture, a framework, a
replacement order— is evaluated with its own yardsticks, fixed before the first data point.

## Seven lines, one trajectory: three on operations and four lines on processes, systems and decision

<!-- seccion: las-siete -->

The seven research lines can be organized around three big questions: how to optimize
operational systems under variability, how to turn processes into implementable systems, and how
to responsibly distribute decision-making capacity among people, data and artificial
intelligence.

Three lines that come from transport and from the production line answer the first question: the
joint assignment of driver, vehicle and route with failures; bus convoys; and fatigue allowances
in line balancing. Two answer the second: FORJA, from the drawn process to the system that
executes it, and the progressive replacement of an ERP with artificial intelligence. And two
answer the third: ARKHÉ, the declarative knowledge ecosystem that is also my own agentic
ecosystem, and the agency spectrum of decision instruments.

The seven come from different moments of my trajectory —from an ERP in 2016 to the agents of
2024—, but they share the same root. Each begins with a real system whose representation was
insufficient, a decision that could be improved or an organizational capability that did not yet
have a sufficiently clear method to evolve. And all seven are produced with the same two
harnesses, published among the 13 agents of the showcase.

## Three lines on operations under variability

<!-- seccion: operaciones-bajo-variabilidad -->

The first line studies the joint assignment of driver, vehicle and route under conditions of
demand, typology and possibility of failure. It arose from my experience in transport
supervision, where the lists of drivers, vehicles and services could be managed separately even
though the result depended on their interaction. The research seeks to build a prescriptive
model that allows configurations to be compared and pairs or triplets to be selected that can
improve operational compliance and mobilized capacity. The development advances progressively:
first it studies the pair with fixed routes, which validates the model and the synthetic
generator, and then it frees the route and measures the complete triplet. The sealed paper
already measured how much it costs to ignore the interaction: with two independent formulations
—integer programming and constraint programming— over the real topology of routes and stops from
the transport system's open data, anchored by cryptographic fingerprint, and a declared
synthetic generator, the two formulations give 14,251 identical optima in 14,251 comparisons over
18,500 recorded runs, and 90% of the pairs change when the pair is modeled. The magnitudes are
from synthetic instances: the mechanism is demonstrated; the real figures require data from an
operator.

The second line studies bus convoys. The problem does not end upon detecting that several
vehicles are running with headways that are too short. The central question is to determine
which policy can dissolve the bunching through applicable instructions, differentiated according
to the vehicle's position and evaluated against control alternatives: relaxing the no-overtaking
prohibition under declared conditions, plus instructions to the operator by position, tested in
a discrete-event simulation with ground truth known by construction and compared against the
best classical control, never against doing nothing, with factorial pre-registration. The sealed
paper measured the damage over 197,046 simulated individual experiences: the convoy does not
steal capacity, it steals time and expels users; the mean wait rises from 2.33 to 4.43 minutes
under full convoy and 1,200 boarding denials per replication appear. It proposes the policy and
measures its effect; changing the rule is an institutional decision, not a technical one.

## Fatigue allowances: the table does not know your workstation or your altitude

<!-- seccion: fatiga-y-balanceo -->

The third line analyzes fatigue allowances and their effect on balancing. It arose in production
contexts, where applying a general percentage could ignore relevant differences between tasks,
environments, efforts and human conditions: the tables do not know your workstation or your
altitude, and Bogotá is at 2,600 meters. The work seeks to build a calibration protocol grounded
in the literature and to evaluate whether modifying the allowances transforms the optimal
configuration of a line. The balancing model with endogenous fatigue is already built and
sealed, validated against the published optima of the standard problem; the synthetic curves
drawn from the literature sweep the plausible range to measure sensitivity, and are never used
to claim that a protocol calibrates well.

## FORJA: from the drawn process to the system that executes it

<!-- seccion: forja -->

The fourth line, FORJA, addresses the distance between the approved process and the system that
is finally implemented. A diagram can represent activities and sequences without sufficiently
specifying what each activity receives, what transformation it performs and what output it must
produce. The professional draws their process in BPMN, the graphical standard for processes, and
then waits weeks for someone to translate it into a system, only to discover that what runs is
not what they approved.

FORJA proposes treating each activity as a black box opened through a specification of inputs,
function and outputs, and a compiler that converts the diagram into an orchestration of agents
where each element traces to its realization and verifiers of different families monitor
conformity. This structure seeks to strengthen the traceability between the process, the
requirements, the data, the business logic and the implemented behavior. In the sealed paper,
the compiler preserved 99.5% of the structure: one element out of 204 was left untraced, and it
was outside the specified subset, so the data and the hypothesis point to the same place. The
demonstrator exists —compiler, five processes, baseline and approval gates—, and what is missing
is demonstrated with volunteer professionals, not with the prototype: that professionals use it
is demonstrated with professionals.

## ARKHÉ: the declarative ecosystem that builds the other six

<!-- seccion: arkhe -->

The fifth line, ARKHÉ, studies how to preserve and articulate the knowledge needed to develop
artificial intelligence solutions without starting from scratch on every project. Its origin
lies in experiences where initiatives repeated problems of context, integration, evaluation and
observability because previous learnings remained scattered. ARKHÉ is my own agentic ecosystem:
work systems are not built from scratch, they are instantiated from indexed declarative
contracts —roles, rules, evidence— that are reused as molds, evolve and return what was learned
to the core. It has been operating for months in unrelated domains, and it is the architecture
that produces the other six lines.

ARKHÉ does not seek to present a single formula for building artificial intelligence. It proposes
a conceptual architecture in which each component is understood by the function it fulfills
within the whole: knowledge, memory, tools, evaluation, observability, governance and action
mechanisms. Six of its nine concepts are already citable with literature reviewed by their term;
what travels between systems is the role and the structure, not the text, measured in 980 role
matches with different bodies. It publishes the components and the impacts, not the formula:
ingredients, not the formula, because the frontier is also commercial.

## The agency spectrum: dashboard, alert, assistant, recommender or agent

<!-- seccion: espectro-de-agencia -->

The sixth line studies the agency spectrum of decision instruments. It arose from observing that
different needs were being solved with dashboards, even when some required an alert at 6 in the
morning, a recommendation, an application or a system with controlled capacity to act; and from
the distrust toward the automatic recommendation even though the data was the same.

The research seeks to order these instruments according to the level of agency the organization
transfers to them: how many stages of the decision —observe, filter, interpret, evaluate,
execute— they cede to the system. There are 5 instruments: a report documents, a dashboard
allows exploring, an alert directs attention, a prediction anticipates, a recommendation proposes
and an agent can act within limits. It is an ordinal spectrum by construction: the order is a
property of the definition, not of the data, and if the measured one contradicts it, that is a
finding and not a reason to redefine it. It is evaluated with synthetic decision-makers —bias
profiles taken from the literature, executed by language models and measured before being used—
facing a credit-decision scenario with a known optimum, measuring the regret of each instrument
against that optimum. The deliverable is a choice rule: which instrument for which decision, with
its cost. And its sheet carries the strictest "never" of the seven: it never claims that
synthetic decision-makers predict human behavior, not even as motivation.

## Replacing an ERP with artificial intelligence, module by module

<!-- seccion: reemplazo-del-erp -->

The seventh line analyzes the progressive replacement of enterprise systems through artificial
intelligence capabilities. Its origin goes back to my first ERP implementation, at Inglopres, in
2016, and it was later strengthened by observing central platforms surrounded by spreadsheets,
automations and peripheral solutions: million-dollar licenses, changes to a single field that
take weeks of consulting and areas that operate alongside the system because the system does not
adapt to them.

The question is not about indiscriminately replacing an ERP with agents. It seeks to determine
which module or capability should be intervened first according to its value, risk, dependency
and level of coupling: the dependency graph between modules decides the order, with the strangler
pattern —module by module, with the old system running alongside and data reconciliation— and
measured on a real open-source ERP, in production in thousands of companies and with no data
from any organization, not on a mock-up. The transformation must preserve continuity while
progressively reducing complexity, and the productivity of artificial intelligence is always
cited with its source and its scope: what has been proven in small tasks is not extrapolated to
integrated systems.

## From professional experience to a researchable question

<!-- seccion: de-experiencia-a-pregunta -->

A problem observed at work does not automatically become research. Experience allows a
difficulty to be recognized, but it is still necessary to abstract it, delimit it and formulate
it in a way that can be studied without depending exclusively on an organizational anecdote.
There are 5 steps, and I apply them to each line.

The first step is to separate the symptom from the mechanism. An operational non-compliance can
be related to assignment, capacity, variability, rules, data or multiple simultaneous causes.
Formulating the research requires identifying which specific relationship is to be analyzed and
what evidence would make it possible to distinguish it: in transport, the symptom was the
unfulfilled kilometers deducted from payment; the mechanism, the driver-and-bus pair that no
list saw.

The second step is to separate the context of origin from the generalizable contribution. A
question can arise in a particular company or sector and have broader relevance. The research
must preserve enough context to be valid without depending on confidential information or
claiming that an individual experience represents all organizations. That is why the agency
line never names the organization where I lived the problem —the problem has no sector— and the
ERP line describes the class of system, without naming companies or vendors in an accusatory
tone.

The third is to define the unit of analysis. In assignment it is the pair or triplet of
resources. In convoys it is the vehicle within a sequence. In FORJA it is the activity. In agency
it is the decision instrument. Without a clear unit, the variables and the criteria end up mixing
different phenomena.

The fourth step is to define what result would constitute a contribution. It is not enough to
build an application, model or framework. The artifact must make it possible to answer the
question, be evaluated against a baseline and produce evidence that can confirm or refute the
central proposition: the classical control without overtaking in convoys, the published optima
of the standard problem in balancing, the optimum known by construction in agency.

The fifth is to establish the limits from the beginning. Some lines can initially be evaluated
using synthetic data, simulation or documentary review. These methods make it possible to study
mechanisms and compare alternatives, but they must not be presented as operational validation if
they have not yet been tested under real conditions.

## Experience gives relevance; method, credibility

<!-- seccion: experiencia-y-metodo -->

This transformation between experience and researchable question is one of the competencies I
value most. It prevents research from becoming a retrospective narration about my trajectory and
allows the problem to be analyzed, questioned and reproduced independently of whoever observed
it initially.

The original operation always stays on the side of motivation. In FORJA, the production
operation of the original process is motivation, never evidence. In fatigue, the 12% of the
table in the case I lived in a printing plant is declared in the sheet as a "declared" figure,
with its label: motivation, not evidence. The evidence is built afterwards, with public sources,
declared synthetic data and yardsticks fixed before the data.

Experience provides relevance. Method provides credibility. Research appears when both can be
connected without one substituting for the other. And the connection is also what makes these
seven lines mine and not those of a desk review: each was born from a system I worked in —a
transport operation of 150 routes, a production line, a new ERP, an agent platform— and each had
to learn to speak without naming it.

## Two harnesses: frozen criterion and ledger

<!-- seccion: los-harnesses -->

The research is produced with two harnesses, published among the 13 agents of the showcase. Both
declare the paper in a single configuration file —questions, falsifiable principles, metrics,
corpus, disclosure boundary— and drive ten phases up to a manuscript ready to submit, stopping at
gates where only an exact phrase of mine lets it through: "framing approved", "artifact
approved", "manuscript approved", "no critics, submit". An incomplete configuration fails on
load instead of filling itself in: the harness never invents domain content that I did not
declare.

The Design Science Harness —ten phases D0 to D9, 52 binary acceptance criteria counted in its
phase files, 7 hardened controls with their published fingerprint, five gates with a verbal
token— is for the researcher-practitioner who has already built artifacts that work and knows
there is a Design Science Research paper in there. It freezes the thresholds before measuring and
publishes whatever comes out: in its pilot paper, two of the artifact's three principles were
refuted by their own metrics, and that is how they were written. A null result is never fixed by
redefining; and a null is not a refutation: both are reported as informative. Each criterion is
printed with verdict, denominator and universe when its phase closes, and an empty batch counted
as green is a control failure, not a success.

## The Computational Paper Harness, and what the two harnesses do not do

<!-- seccion: harness-paper-computacional -->

The Computational Paper Harness —44 binary verification criteria, version 1.21, sealed on August
22, 2026— produces computational Operations Research papers, and three have already come out,
ready to publish: the one on balancing with endogenous fatigue, the one on driver-and-bus
assignment and the one on convoys. It applies the second rule: if it is not in the ledger, it is
not in the paper. Each problem is formulated twice —mixed-integer programming with Pyomo and
HiGHS, and constraint programming with OR-Tools— and their optima must match or the model is
mistranslated; giving up a formulation requires written justification.

Both run in a science runtime with a persistent kernel and per-artifact provenance, on a
read-only package; the factory that builds and maintains them never executes a phase, and that
separation is one of permissions, not of intention. Both share a limit and a "never": they do
not publish —production ends at "ready to submit" and the submission to a journal is executed by
me, with my own token, months later if need be— and they never mention my ecosystem or my
machinery in a manuscript or in its metadata, something a binary lint verifies twice, in the
first phase and in the last.

## Freezing the criterion before measuring

<!-- seccion: congelar-el-criterio -->

One of the central rules of my research process is to establish the criteria, thresholds and
metrics before observing the final results.

The purpose is to reduce the possibility of retrospectively adjusting the evaluation to favor the
hypothesis or the artifact. If a criterion changes after the result is known, the modification
must be recorded, justified and clearly distinguished from the originally planned analysis. All
seven sheets carry it as a "never": never move a yardstick after seeing the result.

The harness keeps these criteria as part of the flow. The evaluation does not depend only on
remembering what had been planned or on freely interpreting the result after each execution: the
thresholds that decide whether the thesis stands or falls are frozen before a single result
exists, in the paper's configuration file and under the harness's 52 criteria, and in the agency
spectrum even the production effort ceiling was frozen before starting, in the program's book,
to be reported if it breaks and never adjusted.

In the pilot article, two of the three principles evaluated did not reach the thresholds set by
their own metrics. The result was not hidden or reinterpreted as partial compliance to protect
the proposal. The refutation was recorded because its function was to evaluate the artifact,
not to justify it. And FORJA did the same with its three initial claims —preservation,
differential detection and comparison with natural language—, evaluated without mercy against
yardsticks fixed beforehand and refuted; today they are design knowledge, and the sheet forbids
reformulating them as if they were still in force.

This result is especially valuable. It demonstrates that the evaluation system has enough
independence to produce an unfavorable conclusion. A method that only confirms what its author
expected may be measuring conviction and not performance.

## When a criterion may change

<!-- seccion: cambiar-el-criterio -->

Freezing the criterion does not mean that methods can never evolve. A test can reveal that a
metric was insufficient or that a condition had not been considered. The research can be
modified, but it must preserve the difference between the original protocol, the finding that
motivated the change and the new version. In ARKHÉ, the two mechanisms refuted in the sealed
paper —reusing pieces and contracts without editing— are not re-evaluated: they are design
knowledge, and the architecture that came out of there reuses molds whose contracts evolve.

This discipline is also essential in corporate analytics and artificial intelligence. Success
thresholds, adoption criteria and acceptance conditions should be defined before observing
whether the project reaches them. Changing them afterwards can turn an evaluation into a
justification. It is what I demand when evaluating an agent or a model in an organization: first
the yardstick, then the run.

AI-300 deepens this perspective through evaluation and observability of artificial intelligence
solutions. However, the basic principle remains: first it is established what working will mean;
then it is measured; finally what the evidence can sustain is published.

## Traceability: no number without its record

<!-- seccion: trazabilidad -->

The Computational Paper Harness applies a second rule: no number can reach the manuscript unless
it first exists as a record within the system that produced or validated it. The ledger is a
record in Parquet format that is only appended to, never edited; the run identifier is the
currency of provenance, and a manifest maps each figure to its runs and to the research question
it answers.

This eliminates figures typed manually into the text without a verifiable relationship to the
data, the queries, the metrics or the corresponding experiment. The document consumes persisted
results and does not become an autonomous source of numbers: zero hand-edited numbers in figures,
tables or manuscript, and every figure in prose is read from the artifact when it is written,
with a cross-check that runs at every phase close.

Each record needs to preserve enough context to interpret its value. A figure without
population, version, unit, scenario or method can be technically authentic and still be
analytically ambiguous.

Traceability also makes updating possible. If a review incorporates new works, changes a
classification or corrects a record, the dependent figures can be recalculated from the
corresponding source. The manuscript does not need to be combed through looking for numbers
introduced manually in different paragraphs.

This architecture reduces errors, but it also strengthens review. A person can follow a
quantitative claim back to the record, the query or the artifact that originated it and evaluate
whether the transformation was adequate. Charts, tables and metrics follow the same principle:
each figure is a function of the ledger, and in the review phase the reproduction runs in a
fresh kernel; if the figures are not regenerated identically, there is hidden state and the
paper does not close.

The rule also protects comparisons. When two executions produce different results, I need to
know whether the corpus, the code, the criterion, the configuration or the source changed.
Without versioning and traceability, the difference can be reduced to a later interpretation
that is hard to demonstrate. This mechanism is equivalent to lineage in an analytics platform.
In Power BI, a figure must be traceable back to its sources and rules. In research, a claim must
be traceable back to the evidence and the calculation that sustain it. The final artifact
changes; the responsibility remains.

## A declarative pipeline for different research

<!-- seccion: tuberia-declarativa -->

The research pipeline is not designed as a sequence exclusive to a single article. Its purpose
is to allow research of different classes to use a common scaffolding without forcing the
central pipeline to be modified for each new case.

The variable elements must be expressed through configuration, data, criteria and specialized
components: the paper's contract declares questions, parameters and seeds, and if it is missing
a required field it fails on load instead of filling itself in. The central pipeline keeps the
common responsibilities: ingestion, validation, execution, recording, artifact generation and
manuscript construction, specified by inputs, outputs and acceptance criteria, never by
procedure.

The proof of this architecture consists of using the pipeline with different research and
checking that incorporating a new work does not force particular conditions to be introduced
into the common mechanism. And the proof is a command: after running three articles of
different classes, the diff of the phase folders and of the contract still comes out empty, with
zero new fields in the contract, including the third paper, which gave up both optimization
formulations and still fit without a new field. If it had been necessary to modify the pipeline
to recognize the name, the structure or the exception of each article, the design would not yet
have separated the variation from the general process.

This condition is not meant to prevent the system from being extended. A new type of research
may need a genuinely new capability. In that case, the modification must be incorporated as a
reusable abstraction and not as a special case that only works for one piece. The declarative
architecture also facilitates auditing: the parameters, criteria and sources of each research
line can be examined without walking through extensive logic full of exceptions.

This approach connects directly with my experience in processes and agents. At Vesting, the
value of the eleven-stage central process lay in allowing different agents to be developed under
a common framework. In my application pipeline, each product advances through shared rules. In
research, each article uses a common factory without losing its question or its particular
method. The important capability is not producing an article through automation. It is building
a system in which new research can begin with more rigor, less repetition and better
traceability than the previous one.

## Synthetic data, simulation and validation limits

<!-- seccion: datos-sinteticos-y-validacion -->

Some research needs to study configurations or mechanisms for which there is not enough public
data, operational information cannot be used or there is not yet access to a real environment.
In those cases, synthetic data and simulation can offer a controlled basis for developing and
testing the model: the failures, demands and times that are not public in transport are
simulated with published assumptions and calibration, and the generator is part of the work, not
an appendix.

Synthetic data makes it possible to build scenarios with known properties, introduce failures,
control distributions and evaluate whether the method correctly recognizes the conditions it
was designed for. It also makes it possible to publish reproducible experiments without
compromising confidential information: the real transport topology comes from open data
anchored by cryptographic fingerprint, so that anyone can reproduce with the same file.

However, a successful test with synthetic data does not constitute validation of the behavior in
a real organization. It demonstrates that the artifact responds under the generated conditions
and that the mechanism can be studied in a controlled way. The 14,251 identical optima of the
assignment line are a result on synthetic instances, and its sheet says so: the mechanism is
demonstrated; the real figures require data from an operator.

The usefulness depends on the quality of the generator and on the relationship between its
assumptions and the phenomenon. A synthetic set can produce impeccable results because it was
built in a way compatible with the model itself. That is why the distributions, constraints and
dependencies used must be documented and submitted to sensitivity analysis, and that is why in
fatigue the synthetic curves sweep a range and are never used to claim that a protocol
calibrates well.

## Simulation and operational validation: two levels that are not confused

<!-- seccion: simulacion-y-validacion-operacional -->

Simulation fulfills a similar function. It makes it possible to compare policies, assignments or
scenarios without directly intervening in the operation. Its value lies in exploring mechanisms
and consequences under explicit assumptions, not in predicting with certainty what will happen:
the 197,046 experiences of the convoys are from a simulated corridor, and the sheet declares
that it does not observe the real operation nor claim figures of the system. Even the convoy
detector is reported as a sensor: its precision and its recall are the instrument's uncertainty,
not a contribution.

Operational validation requires additional evidence. It may require real data, retrospective
comparison, evaluation by professionals, controlled experiments or progressive implementation
depending on the nature of the solution. Distinguishing these levels avoids presenting a
methodological contribution as if it had already demonstrated business impact. This discipline
comes from Industrial Engineering and from systems simulation: a model is a deliberately
incomplete representation of reality, and its value depends on whether it preserves the
mechanisms needed to answer the question, not on how much it visually resembles the original
system.

## The ethical "nevers" of the seven lines

<!-- seccion: los-nunca-eticos -->

Each sheet publishes its "nevers", and several are common to the 7 lines. They never use data
from my previous jobs: only public sources and declared synthetic data. They never claim a figure
without a source or a gap without the number of works reviewed. They never move a yardstick
after seeing the result.

The transport lines add their own: they never name drivers or use personal data; they never
blame or classify a driver —the model pairs, it does not rank, and it is a matching model, not a
model for classifying people—; they never direct alerts, sanctions or exposure at the person
driving, because the analysis is of the operator and of the system. The fatigue line adds the
most important one: it never serves to pressure workers into performing more, because the
allowance protects, it does not squeeze; and it never presents synthetic data as if it validated
the calibration of a protocol. FORJA never presents itself as a replacement for the programmer:
it is the professional automating their own work. The ERP line never names companies where I
lived the problem or vendors in an accusatory tone. ARKHÉ never describes its internal
mechanics, and the agency spectrum never uses a bias profile that has not demonstrated that it
expresses its bias measurably: a profile that does not express it does not enter the data, and
that is an admissibility gate, not an appended report.

And FORJA's study with professionals will be the first time the program recruits people: without
names, with informed consent and an anonymized report. The "nevers" are not an ethical footnote;
they are design constraints that the sheets publish next to the figures, and breaking one would
show.

## Artificial intelligence inside the research process

<!-- seccion: ia-en-la-investigacion -->

Artificial intelligence considerably expands the capacity to explore literature, organize
documents, classify content and build research artifacts. It also introduces particular risks
of omission, invention, misclassification and false confidence.

That is why the agents do not operate as autonomous authors or as sources. They can assist
retrieval, extraction, normalization, classification and writing, but each operation must
remain delimited and produce evidence that can be reviewed. The harnesses' literature facade
gives access to metadata —five functions with a frozen signature, a cache without expiration and
a log—; it does not read the PDFs, does not screen intellectually and does not write: that
judgment belongs to the harness and to me, and every citation in the paper passes through there,
with the work's identifier verified.

An agent can propose that a work meets a given criterion. The system still needs to keep the
document, the excerpt or the information that made the classification possible. A conclusion
without reviewable evidence does not become valid for having been produced consistently.

Nor does the model's general memory substitute for the search. When a research line requires
knowing the state of the literature, the claims must come from the defined corpus and not from
the statistical knowledge acquired during the provider's training. And the agents must declare
the gaps: if the document does not contain the information needed to classify a condition, the
system must acknowledge the absence instead of inferring an answer to complete the matrix.

Specialization through harnesses makes it possible to distribute responsibilities. One
component can retrieve literature, another extract information, another verify criteria and
another prepare artifacts. Each operates with sources, formats and validations matching its
function, and none crosses a gate without my exact phrase, however urgent the instruction may
come. Artificial intelligence reduces certain burdens and expands the possible scale of review
—5,674 records screened in ARKHÉ are not read by hand—, but it does not eliminate
methodological responsibility. The researcher continues to define the question, the corpus, the
criteria, the metrics and the permitted conclusions.

AI-103 strengthens the construction of these agents and their retrieval mechanisms and tools.
AI-300 expands their evaluation, observability and operation. DP-600 contributes the analytical
architecture needed to organize corpora, records, metrics and results. The purpose is not to
produce more academic text with less effort. It is to increase the capacity to review, measure
and reproduce the process without allowing automation to displace scientific judgment.

## Publishing negative results and limits

<!-- seccion: resultados-negativos -->

A research line does not lose value because a hypothesis turns out to be refuted, an artifact
does not pass its criteria or an intervention produces a smaller effect than expected. 2 of the
3 principles of the pilot paper and the 3 initial claims of FORJA are published as refuted, and
the 2 mechanisms of ARKHÉ, too.

Negative results help delimit which mechanism does not work, under which conditions it stops
working and which assumptions need to be revised. They also prevent others from repeating
exactly the same route without knowing its limitations.

Publishing them requires carefully separating absence of evidence from evidence of absence. That
an experiment does not detect an improvement may be because the effect does not exist, because
the sample is insufficient, because the metric is not sensitive or because the design does not
adequately represent the phenomenon. That is why a null is not a refutation, and the harnesses
report both as informative.

Methodological limits must be published together with the results. This includes corpus
coverage, quality of sources, dependence on synthetic data, scope of the simulation, assumptions
and conditions under which the conclusion could change: the assignment line claims means and not
percentiles, treats reliability as an expected value and studies only the zonal component of the
system, because the open feed does not carry trunk routes and they are not fabricated.

This practice also strengthens my professional work. A project that correctly invalidates a
hypothesis can avoid an unnecessary investment. Stopping an initiative on evidence is not a
failure; it is an informed decision that protects resources and makes it possible to formulate a
better alternative.

Publishing limits generates trust because it demonstrates that the goal is not to defend a
solution at any cost. It is to build knowledge that can survive even when the conclusion does
not match the initial expectation. Rigor does not consist of being right from the first
formulation. It consists of designing a process capable of showing when I am not.

## From research to product and to architecture

<!-- seccion: de-investigacion-a-producto -->

The research does not remain isolated from the rest of my portfolio. Its questions, methods and
results feed applications, agents, models, patterns and architecture decisions.

FORJA can become an applicable method for specifying activities before developing applications
or agents, and it enters ARKHÉ as a demonstrative case: the specification method as
architectural core. ARKHÉ organizes concepts and functions that already guide an artificial
intelligence architecture: it is the architecture that produces the other six lines and the 32
pieces of the showcase. The agency spectrum offers a criterion for selecting whether a decision
needs a dashboard, an alert, a recommendation, an application or a system with the capacity to
act.

The transport research makes it possible to develop assignment models and control policies that
can materialize in simulations, decision tools or operational applications: the overtaking
mechanics enters as a new capability of the test bench, and the convoy damage has its
dissemination deliverable coupled to the paper. The fatigue line can influence balancing models
and criteria for designing more sustainable workloads, and its next step is the protocol in the
field: measuring in a real plant, and until then the protocol is method, not result.

The progressive replacement of enterprise systems can become an architecture methodology for
deciding which capabilities to intervene first, how to manage dependencies and how to use
artificial intelligence without compromising the continuity of the system.

This transition needs to preserve the state of the evidence. An idea backed by literature must
not be presented as a validated product. An artifact tested through simulation must not be
presented as a policy demonstrated in operation. Each evolution needs its own acceptance
criteria. Research reduces conceptual uncertainty. The prototype reduces technical uncertainty.
Validation reduces uncertainty about behavior. Adoption reduces uncertainty about the capacity
to integrate into an organization. These stages must not be confused.

Industrial Design adds value in the transition toward the product. The finding needs to be
transformed into an experience capable of being understood, used and evaluated by people.
Industrial Engineering maintains the relationship with the process, the constraints and the
systemic result. Architecture finally connects the pieces: it allows the data, models,
applications, agents and controls derived from the research to coexist, be reused and evolve
instead of remaining as independent demonstrations.

## What this has to do with an artificial intelligence role

<!-- seccion: que-tiene-que-ver -->

An important part of an artificial intelligence role consists of evaluating claims: whether a
solution works, whether a metric represents what it claims to measure, whether a result can be
generalized and whether the available evidence justifies a decision.

These responsibilities belong both to engineering and to the research method. Building a model
or an agent requires formulating a hypothesis about its behavior, defining criteria, designing
tests, observing results and recognizing the limits of the conclusion.

The literature review strengthens the architecture because it avoids presenting as innovation a
capability that is widely solved and helps identify which alternatives, failures and results
have already been documented: 5,678 works reviewed across the six lines with a corpus of works,
plus 119 frameworks. Freezing the criteria before measuring protects the evaluation against
retrospective adjustments. The traceability of numbers makes it possible to reconstruct the
results. Synthetic data and simulation make it possible to study mechanisms under controlled
conditions. Publishing negative results prevents the selection of evidence from distorting
learning.

The computational pipeline also demonstrates engineering capability. Research needs structured
data, validations, automation, versioning, artifact generation and controls capable of
detecting inconsistencies: a ledger that is only appended to, a contract that fails on load, a
diff that has to come out empty.

The agents used in the review demonstrate artificial intelligence architecture. They need
authorized sources, retrieval, tools, formats, abstention and supervision. The solution cannot
depend on a general instruction to do research: they are two harnesses with 52 and 44 binary
criteria, and each criterion is printed with its verdict.

DP-600 contributes the analytics platform with which corpora, records, metrics and results can
be organized. AI-103 strengthens the agents that retrieve, classify and produce artifacts.
AI-300 contributes to evaluating, observing and operating those components in a repeatable way.
Research also strengthens AI governance: an organization needs to distinguish between claims,
evidence, risks, impacts and conditions of use, and the capacity to demand that separation is
developed by practicing it on one's own work.

These seven research lines demonstrate that I do not use artificial intelligence only to build
faster. I use it within a system designed to produce traceable, refutable and reproducible
knowledge.

## What the seven research lines demonstrate

<!-- seccion: lo-que-demuestran -->

The seven research lines demonstrate that I can turn a professional experience into a
generalizable question without revealing confidential information or reducing the problem to an
anecdote.

They demonstrate that I know how to measure a gap before formulating a contribution. The
corpora, criteria and counts —from 119 frameworks to 1,414 works per line— make it possible to
establish what was reviewed, what conditions were found and within what scope the identified
absence can be sustained.

They demonstrate that I can design evaluations capable of producing unfavorable results.
Freezing the criterion and publishing refuted principles protects the independence of the
analysis and prevents the method from becoming a later justification of the artifact.

They demonstrate traceability engineering. Every figure needs a record, every table and chart
must be generated from controlled data and every modification must be relatable to a version of
the corpus, the code or the criterion.

They demonstrate the capacity to build reusable systems. The pipeline does not depend on a
specific article —three papers of different classes and an empty diff prove it— and the agents
do not depend on a single task. The goal is to accumulate research capacity, not to
superficially automate writing.

They also demonstrate responsibility over the limits. Synthetic data is not presented as real
validation, simulation is not presented as operational certainty and a piece published in the
showcase is not automatically presented as a peer-reviewed article: five papers ready, none
submitted, and so it is written.

The research connects my whole trajectory. The problems come from processes, transport,
enterprise systems, data and artificial intelligence. The methods integrate review, modeling,
optimization, simulation, architecture, applications and agents.

My contribution does not consist only of formulating innovative ideas. It consists of building
the conditions for those ideas to be examined, refuted, reproduced and, when there is enough
evidence, turned into products, policies or business capabilities. That is the value research
adds to my profile: it forces me not to confuse a convincing solution with a demonstrated one.
