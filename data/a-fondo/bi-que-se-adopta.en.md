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

## The hard problem in BI is not technical

<!-- seccion: el-problema-dificil -->

Building a dashboard in **Power BI** is rarely the hard part. The hard part is getting it used to
decide. An organization can have tools, professionals and volumes of information and still fail to
turn them into decisions, because the dashboard does not answer a concrete question, or because two
departments interpret the same metric differently.

That is why I treat **adoption** as the product's indicator and not as a metric reviewed at the
end: it is a design hypothesis formulated from the start and validated in operation. I design from
the decision —who uses the information, what question it answers, at what detail and frequency—
and not from the data available. At Banco Pichincha, in 2023, it was the entire problem of the
role: technically correct dashboards that the business never quite adopted.

## Adoption demonstrated in different contexts

<!-- seccion: adopcion-medida -->

I have measured adoption in four contexts, with different users and decisions:

| Where                    | Product                                    | Adoption                                    | Effect                                   |
| ------------------------ | ------------------------------------------ | ------------------------------------------- | ---------------------------------------- |
| **Banco Pichincha**      | decision-oriented dashboards, with a team of 5 | **more than 50 business users**         | +25% in decision-making                  |
| **TransMilenio / C&M**   | Power BI in the operation                  | **more than 25 key users**                  | +35% in efficiency of analytical processes |
| **Cafam**                | the control BI for the WMS implementation  | **more than 15** directors and managers     | +50% in follow-up accuracy               |
| **Fundación CTIC**       | 42 analytical products by process          | **20 leaders** of 15 processes, about 75 users | about 60% less preparation effort     |

At C&M Consorcio 2018 I developed performance dashboards and reports for the supervision of
TransMilenio and I do not have a confirmed user figure, so I do not present it as a case of
quantified adoption.

"Key users" matters: in transport they were not people with access but the people responsible for
scheduling, follow-up and service decisions. And I distinguish four things that are often
confused: granting **access** demonstrates availability; opening a dashboard demonstrates **use**;
incorporating it into a routine demonstrates **adoption**; changing a decision demonstrates
**impact**. Fifteen people with direct responsibility for a critical process are worth more than
hundreds who check in now and then.

## Design around a decision, with one definition per indicator

<!-- seccion: diseno-para-la-decision -->

Before a visualization there is a decision: what situation to observe, what can be done, what
detail is needed and how often. Each dashboard offers a path from the overview to the evidence, so
that the person responsible recognizes the condition and can drill down when a figure demands it.

Consistency is part of adoption: if one dashboard and another calculate the same concept
differently, the user compares tools instead of analyzing reality. That is why every indicator has
**one definition**, one owner and one calculation rule, centralized in the **semantic model** and
expressed as **DAX** measures that all products reuse. How that model is optimized is in the
Fabric document.

## Training is part of the product

<!-- seccion: formacion-y-adopcion -->

A solution is not adopted just for being intuitive: people need to understand what the information
represents, how to interpret it and what its limits are. At Banco Pichincha I designed and
delivered a **training program for 12 professionals** —Power Query, semantic modeling, DAX,
visualization and executive communication, on their own products— which contributed to a 20%
increase in productivity in the preparation and use of information.

Training reduces dependence on the BI team: a user with more judgment asks better questions,
detects inconsistencies and uses the product autonomously, and the technical team concentrates on
the complex work. Autonomy is not absence of governance: **users** explore without redefining the
critical metrics. And it adapts to responsibility: whoever decides does not need the depth of
whoever builds the model.

## The provenance of every figure

<!-- seccion: procedencia -->

A rule that comes from data governance: every relevant figure keeps its provenance. If I cannot
explain where it comes from, how it was transformed and what definition it represents, it is not
ready for an important decision. The screen presents it clearly; the mechanism to walk it back to
the source exists when it is needed.

And I distinguish the nature of the value: **measured** by a counter or a run, **calculated** by
an explicit rule, **declared** by a responsible source or **estimated** under assumptions. They do
not have the same certainty and are not presented as equivalent. I took the rule to my showcase:
the technical sheets of the 32 pieces label every figure with its provenance.

In an executive conversation, when someone questions a number, the answer does not depend on who
has more authority: there is a verifiable path from the figure to the data. When the disagreement
persists, provenance shows that it is not in the arithmetic but in the concept each one wants to
measure.

## When building the dashboard is the bottleneck

<!-- seccion: cuando-la-herramienta-estorba -->

When building by hand limits speed and consistency, the production of the artifacts becomes the
object of automation. I built the **Power BI Dashboard Builder**, one of the 13 agents in my
showcase: from a specification it produces the complete project in .pbip format —the semantic
model, the transformations in Power Query M, the DAX measures and the visuals—, it can extract the
data, and it is tested end to end.

The agent does not decide the analytical strategy: the selection of indicators, the definitions
and the decision experience remain under explicit judgment, and no run is considered finished
until it passes structural and functional validations. It is my general rule for AI: it does not
replace judgment nor simulate deterministic tasks; it steps in where it interprets a specification
and speeds up a bounded activity, with maintainable outputs.

The judgment comes from Cafam: there I used VBA because it was what was available, useful and
maintainable in that organization. The tool changes; the principle remains. And when Power BI is
not the instrument —an alert, an application, a model or an agent is—, the ladder that orders
those options is in the document on how I work.
