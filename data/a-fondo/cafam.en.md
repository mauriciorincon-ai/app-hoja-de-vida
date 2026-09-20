---
slug: cafam
titulo: "Cafam — the WMS and the team of 20 (2020–2021)"
resumen: "The implementation of Oracle WMS Cloud in a medicines distribution center: 20 people in testing for six months, the control BI, the VBA integrations and data quality in SQL."
estado: aprobado
ancla: "/proyectos/cafam"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What did Henry do at Cafam?"
  - "What is the largest team he has led?"
  - "Has he taken part in a WMS implementation?"
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
The story behind the case study: what it was like to lead the largest
team of your career, what went wrong and how you solved it, details of the
VBA integrations and the control BI that do not fit on the page. -->

## The context: changing the system that moves the warehouse

<!-- seccion: el-contexto -->

I joined Cafam in October 2020 as an Information Systems and Projects Analyst and stayed with the organization until June 2021. My responsibility concentrated on the implementation of a WMS —a warehouse management system, in this case Oracle WMS Cloud— for the medicines distribution operation of the caja de compensación: an environment in which the continuity, accuracy and traceability of information had direct consequences on the running of the distribution center and, behind every order, on a person waiting for their medicine.

Changing the system that governs a warehouse is one of the most delicate interventions that can be made in a logistics operation. The WMS must represent precisely which products exist, where they are located, in what quantities, which movements they have made and in what state they are within the flow, and it must do so while the operation keeps dispatching. A data error does not stay on a screen: it materializes immediately as inventory that does not show up, wrong locations, inconsistent movements, delays, rework or difficulties in serving a request on time.

The challenge was not only to install a new application. It was necessary to prove that the system could correctly interpret the operation, execute its rules, integrate with other components and preserve the consistency of information across every movement. It was also necessary to identify where the process had to be adjusted to take advantage of the platform's capabilities and where the software needed to be parameterized to adequately reflect the operational reality.

This experience let me understand that implementing an enterprise platform requires intervening simultaneously in processes, data, technology and ways of working. If one of these elements changes while the others remain intact, the solution hardly achieves its purpose. The implementation had to achieve coherence between what the operation needed, what the system could represent and what people had to do to sustain it.

## Before testing: the process in BPMN with Bizagi and the simulation in FlexSim

<!-- seccion: proceso-bpmn-y-simulacion -->

Before running a single test I needed a shared map of the operation. I modeled the distribution center's process in BPMN with Bizagi —receiving, storage, picking and dispatch—, because an implementation is tested against a written process, not against the memory of whoever has spent the most years in the warehouse. The diagram made it possible to contrast the real logistics operation with the behavior the WMS was going to impose, and it made visible the informal decisions that no manual recorded.

On top of that process I also built a discrete-event simulation model in FlexSim of the medicines dispatch. Its purpose was to understand where a rule of the new system could create a queue that until then did not exist: an additional control in picking, a validation at the exit or a location that forced a longer route. The simulation did not replace the tests with the real system; it served to arrive at them knowing which scenarios deserved priority and which parts of the flow were most sensitive to a change of rule.

Here you can see the industrial engineer who arrived at Cafam in October 2020: first the process, then the system. This same combination —BPMN with Bizagi for the process and simulation when the flow warrants it— I had used at Inglopres and would use again afterwards, and its full story is in the processes and simulation document.

## The team of twenty: the largest I have led

<!-- seccion: el-equipo-de-veinte -->

I led a mixed team of twenty people during the testing phase: fourteen members from Cafam and six professionals from Oracle, the organization that had just bought the product and was implementing it with its own specialists. It is still the largest team I have led. This combination brought together two indispensable kinds of knowledge. The internal team understood the operation, its constraints and exceptions, while the vendor's team contributed the technical and functional knowledge needed to analyze the platform's behavior.

The testing phase lasted approximately six months, within the nine that my time at Cafam lasted. It was not a one-off validation before go-live, but a sustained process to verify functionalities, rules, data, operational routes, integrations and exception conditions. Each cycle made it possible to discover differences between expected and observed behavior, document them and turn them into adjustment decisions.

The length of this phase made it possible to go beyond validating ideal scenarios and also observe exceptions, recurrences and behaviors that only become visible when the system is subjected in a sustained way to the diversity of the real operation. A WMS that responds well to a typical order can fail against a medicine with a batch and an expiry date, a partial return or a location that changed use mid-week; those situations only appear when the tests last long enough to find them.

With a team of that size, the main challenge was not just distributing test cases. It was ensuring coverage, avoiding duplication, keeping execution consistent and making visible which parts of the system had been validated, which remained pending and where there were blockers. The result had to offer a reliable view of the state of the implementation, not an accumulation of individual tests that were hard to interpret.

## Coordinating a mixed team: translating between the operation and the vendor

<!-- seccion: coordinar-equipo-mixto -->

Coordinating a team of fourteen people from Cafam and six from Oracle required building a common language between the operation and the technology. A situation described by the user as an inventory problem had to be translated into a reproducible scenario, with known inputs, defined steps, expected results and enough evidence for the technical team to analyze it and decide whether it was a system failure, a badly loaded piece of data or a process rule nobody had written down. Conversely, an explanation about system parameters or restrictions had to be turned into understandable implications for those who executed the process.

The collaboration also had to produce knowledge transfer. The goal was not for the vendor to resolve every finding in isolation, but for the internal team to progressively understand the logic of the system, its parameters, its limits and the consequences of each configuration. A sustainable implementation requires the organization to develop the ability to operate, diagnose and evolve the solution without permanently depending on those who took part in its installation; the vendor would finish its implementation and the fourteen people from Cafam would stay on operating the WMS.

The coordination of the team contributed to reducing errors by twenty-five percent and improving operational efficiency by fifteen percent. Both figures were measured on inventory record accuracy (IRA): the proportion of positions whose balance in the system matches what is physically in the location. These results did not come from increasing supervision, but from structuring the work better, setting clear criteria, making progress visible and connecting each finding with a verifiable action.

This experience strengthened my way of leading multidisciplinary teams. I learned that collaboration between business and technology is not achieved merely by bringing different profiles together. It requires establishing shared definitions, translation mechanisms, explicit responsibilities and a common way of recognizing when a result is truly finished.

## From testing to process adjustment and parameterization

<!-- seccion: pruebas-y-parametrizacion -->

Once the main testing phase at Cafam was concluded, the work moved on to adjusting the processes and parameterizing Oracle WMS Cloud: configuring the system without modifying its code, which is different from customizing it. The findings obtained during the six months of validation made it possible to identify which differences could be resolved through configuration, which required modifying the process and which required additional technical intervention from the vendor.

During this transition, the main criterion was not only to check that the new platform worked, but to protect the continuity of a critical operation. Each adjustment had to be evaluated by its effect on inventory, material flow, traceability and the distribution center's ability to keep up the service. This experience taught me that a well-executed technological transformation is not measured only by going into production, but by the ability to change without losing control of what the organization cannot afford to interrupt.

This distinction was fundamental. Not every difference between the system and the operation represented a software failure. In some cases, the platform made visible an ambiguous rule or a procedure that depended on informal decisions. In others, the institutional process contained a legitimate need that the system did not represent adequately. The implementation required analyzing each case and avoiding two equally problematic extremes: forcing the whole operation to adapt to the software or modifying the platform to reproduce practices that also needed to evolve.

Parameterization became the meeting point between the system's design and the reality of the business. Each adjustment defined how the solution had to behave in the face of certain entities, states, rules and exceptions. A seemingly small configuration could change the way a movement was recorded, a piece of data was validated or a responsibility was distributed within the operation. The BPMN model from the previous stage served here as a reference: each parameter was read against the process activity it affected.

## What testing teaches: discovering the system and the process at the same time

<!-- seccion: lo-que-ensenan-las-pruebas -->

This stage at Cafam reinforced my understanding that testing is not an activity that comes after development. It is a mechanism for discovering knowledge about the system and about the process that uses it. Testing makes it possible to verify a functionality, but also to question assumptions, reveal dependencies and determine whether the solution responds correctly to the variability of the real operation. Six months of testing with twenty people produce something more valuable than a list of defects: they produce a description of how the warehouse really works, which previously did not exist in writing anywhere.

I currently apply this same principle to analytical solutions, applications and artificial intelligence agents. A successful demo is not equivalent to a capability ready for production. It is necessary to evaluate representative cases, exceptions, edge conditions, quality of results, behavior of integrations and situations that require human intervention. The technology changes, but the discipline of turning expectations into verifiable criteria and reproducible evidence remains.

There is a direct continuity between the test scenario of a WMS —known inputs, defined steps, expected result— and the definition of done that years later I would demand for every agent at Vesting, or the automated tests with which my applications are built today. The object changes; the habit of not considering finished what has not been seen to fail and be corrected is the same.

## The BI for controlling the implementation

<!-- seccion: el-bi-de-control -->

I designed business intelligence reports and interactive dashboards to control the implementation itself. These solutions improved the accuracy of test tracking by 50% and were adopted by more than 15 users involved in the project: the director of medicines, the IT director, the project director, the director of the distribution center and the coordinators and heads of the distribution center. They were the people who had to decide on progress, not a general audience.

The most valuable dashboard was not devoted to describing the usual operation of the distribution center, but to observing the progress of the transformation while it was happening. It made it possible to know the scenarios executed, the coverage reached, the results obtained, the defects found, the people responsible for handling them and the cases that had to be tested again after an adjustment.

This experience taught me that a technology project must also be instrumented. It is not enough to set a schedule and wait until the end to learn the result. The implementation needs its own indicators, events and observation mechanisms. When progress, blockers, quality and dependencies become visible, the team can act before a deviation compromises the date or the expected result. A project governed with daily evidence is governed differently from one governed by a feeling of progress.

I also confirmed that adoption must be designed. The directors and coordinators incorporated the dashboards because they answered concrete coordination needs and because they reduced the effort needed to understand the state of the project. The value did not come from publishing more reports, but from offering a common view that made it possible to prioritize, assign responsibilities and decide in a more timely manner.

## The indicators of the testing pipeline

<!-- seccion: indicadores-del-pipeline-de-pruebas -->

The indicators worked as gauges distributed along the testing pipeline. It was not enough to count how many cases had been executed. It was also necessary to observe their coverage, status, criticality, pass rate, recurrence, resolution time and relationship with the system adjustments. An overall figure could suggest progress while scenarios essential to the continuity of the operation remained unvalidated: one could have most of the cases passed and, at the same time, none of those touching the dispatch of medicines with batch control.

That is why each finding was related to the part of the process it affected and to the parameterization decision that resolved it. A recurring defect in the same activity said more about the real state of the WMS than twenty new cases passed in activities that were already stable, and the dashboard had to let that difference show without forcing anyone to read a list of tests.

This was an important stage in my evolution toward designing semantic models and advanced solutions in Power BI. I understood that a reliable analytical experience needs shared definitions, consistent relationships, verifiable measures and the possibility of traveling from an aggregated result down to the records that support it. The visualization made the project visible, but the real value was in the information structure that made it possible to interpret it correctly. How a dashboard is designed so that decision-makers use it, with the three adoption experiences compared, is in the document on BI that gets adopted.

## The VBA integrations

<!-- seccion: integraciones-vba -->

I developed applications in Visual Basic for Applications (VBA) intended to integrate distribution center activities with the warehouse management system: data loads that previously depended on manual handling went on to apply rules in a repeatable way. These solutions increased automation by fifteen percent and contributed to reducing data errors by fifty percent.

The choice of VBA answered to the technological and operational context available at Cafam. It was a tool accessible to the organization, compatible with the resources the teams used and flexible enough to resolve gaps that could affect the continuity of the process. The quality of a solution does not depend on the novelty of the technology, but on its fit for the problem, the possibility of maintaining it and the result it produces.

These applications made it possible to structure activities that previously depended on manual handling, apply rules in a repeatable way and reduce errors in the exchange of information. However, their purpose was not to maintain indefinitely an architecture parallel to the WMS. They worked as integration and continuity mechanisms while the process and the platform reached a higher level of adjustment. They kept running after go-live, as known peripheral pieces, with an owner and with a limit: each one knew which activity it covered, which data it depended on and what would happen the day the WMS took over that function.

## The value and the limits of peripheral solutions

<!-- seccion: soluciones-perifericas -->

The experience with the Cafam VBA applications taught me to recognize the value and also the limits of peripheral solutions. A local automation can solve an urgent need, but it must be designed with an understanding of its relationship with the central system, its dependencies and the risk of becoming a critical component without enough governance. Solving the immediate problem must not prevent the later evolution of the architecture.

That criterion remains valid in my current work. An application or an artificial intelligence agent can be integrated quickly to solve a concrete need, but it must operate within an understandable architecture, with authorized sources, defined responsibilities, monitoring and a strategy for its evolution. Speed of implementation cannot be achieved at the cost of creating new invisible dependencies.

The rule I kept from 2021 fits in three conditions: a peripheral piece is acceptable if it is known who maintains it, if what it depends on is documented and if it has a retirement date or condition. When any of the three is missing, the piece stops being a bridge and becomes a parallel system that nobody governs.

## Data quality, in SQL

<!-- seccion: calidad-en-sql -->

Using SQL I supervised the data quality of the information circulating between different systems, contributing to a twenty percent improvement in the accuracy and reliability of the information used by the warehouse management system, also measured as inventory record accuracy. As a complementary analysis tool I used SAS.

The most complex part was not necessarily inside an application, but at the boundaries between them. Two systems could work correctly on their own and still produce inconsistencies when they exchanged identifiers, states, quantities, dates or rules interpreted differently. Integration made those differences visible and turned data quality into a cross-cutting responsibility.

SQL let me travel through the information, contrast sources, identify missing records, detect duplicates, verify relationships and locate differences between the expected and the observed state. The goal was not to correct figures at the end of the pipeline, but to understand where the inconsistency originated and which control could prevent its repetition. A query that crossed the WMS balance with the source system's balance by medicine and location said, in minutes, at which boundary between systems the difference lay.

## The 80-20 validation by medicines

<!-- seccion: validacion-80-20 -->

The reconciliation method was one of industrial engineering: validation by medicines with an 80-20 criterion. The main medicines were taken —those that concentrated most of the volume— and compared one by one between the WMS and the source system. At the start none of them matched: quantities, locations and states differed between one system and the other.

Instead of trying to square the entire catalog at once, it was adjusted little by little, prioritizing those higher-turnover medicines. Each difference resolved in one of them taught a rule that usually explained differences in many others, and the SQL queries that detected it remained as a permanent control. Thus the reconciliation stopped being a project close-out and became a permanent review: a routine that periodically compared the same medicines again and made any new deviation visible.

That was, in practice, the answer to "what went wrong and how it was solved" at Cafam: not a single incident, but an inventory that at the start did not square on any of its main products and that was brought to match by priority of volume, with evidence in SQL at every step.

## What the quality of a piece of data is: what Cafam taught me

<!-- seccion: que-es-la-calidad-del-dato -->

At Cafam I went deeper into an idea that is today central to my work with data platforms and semantic models: quality is not an abstract or uniform property. A piece of data can be valid in its format and, at the same time, not be timely, complete or consistent enough for a specific decision. Evaluating quality requires understanding the purpose of the information and the process that depends on it. An inventory balance that is correct at the start of the shift and out of date a few hours later is still a valid piece of data and, for that day's dispatch, it is a useless one.

I also understood that quality controls must be part of the pipeline and not be limited to later manual reviews. The most valuable validations are those that make it possible to detect the problem close to its origin, keep evidence of the deviation and prevent the error from continuing on to reports, decisions or operational movements. The SQL queries of the 80-20 reconciliation were exactly that: controls that ran before the data reached a decision.

This principle acquires even more importance in artificial intelligence solutions. A model or an agent can process information at great speed, but it cannot reliably compensate for decontextualized, contradictory or incomplete data. Artificial intelligence amplifies the usefulness of a well-governed architecture, but it can also amplify its deficiencies. That is why quality, provenance and access controls must be designed before granting a solution the ability to recommend or act.

## The Cafam results in figures

<!-- seccion: resultados-en-cifras -->

The project's figures, as my CV and the site's case study publish them, with what each one measured:

| Front                                    | Result                                             | What it measured                                                        |
| ---------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| WMS implementation testing               | −25% errors · +15% operational efficiency          | inventory record accuracy (IRA) before and after                        |
| BI for controlling the implementation    | +50% tracking accuracy · 15+ users                 | scenarios, coverage, defects and recurrences visible daily              |
| VBA integrations with the WMS            | +15% automation · −50% data errors                 | manual loads replaced and errors in the exchange of information         |
| Data quality in SQL                      | +20% accuracy and reliability                      | 80-20 reconciliation by medicines between the WMS and the source system |

The team was twenty people —fourteen from Cafam and six from the vendor— during some six months of testing, between October 2020 and June 2021. None of these figures came from increasing supervision: they came from a written process, reproducible scenarios, visible progress and quality controls that ran inside the pipeline and not at the end.

## What Cafam consolidated

<!-- seccion: lo-que-cafam-consolido -->

Seen in retrospect, Cafam was the experience in which I most directly integrated processes, enterprise applications, data, testing, automation and multidisciplinary leadership. For approximately six months I coordinated a mixed team of twenty people, instrumented progress through business intelligence, developed integration solutions and used SQL to protect the quality of information between systems.

I also learned that an enterprise implementation is not a one-off delivery. It is a learning process in which the organization simultaneously discovers the capabilities of the software and the ambiguities of its own operation. Testing, parameterizing and adjusting are not isolated stages, but cycles through which technology and process draw closer until they build a viable way of working.

This experience strengthened my ability to translate between business and technology. I learned to turn operational needs into verifiable scenarios, process rules into expected system behaviors, findings into parameterization decisions and technical results into understandable information for those responsible for the operation. I also learned to travel the reverse path: explaining the platform's capabilities, restrictions and dependencies in terms of their effects on inventory, traceability, continuity and quality of service.

That translation ability later became an essential element of my work with analytics platforms, semantic models, intelligent applications and AI agents. An enterprise solution can only respond correctly to a need when business knowledge manages to be transformed into data, rules, controls and verifiable criteria that the technology can represent, execute and evaluate.

The coexistence of the WMS, other systems, automations and auxiliary procedures also awakened my interest in a question that remains valid in my work: how to transform an enterprise platform without trying to replace all its capabilities simultaneously. I understood that the order of intervention must respond to the value, the risk, the dependencies and the level of coupling of each component. Modernizing does not consist of replacing everything at once, but of designing a transition that preserves continuity while progressively reducing complexity; and the peripheral pieces —known, with an owner and with a retirement condition— are part of the design, not an accident.
