---
slug: los-tableros
titulo: "The dashboards: public data, verified"
resumen: "Six sealed dashboards on open data —banking, companies, the monetary cycle, State spending, energy and climate, Formula 1— built with Power BI Desktop, Power Query, DAX, script-written PBIR and Python, with the source's identities run in full and the limits in plain view."
estado: aprobado
ancla: "/vitrina/tableros"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What dashboards has Henry published?"
  - "How does Henry check that the identities of a dashboard close?"
  - "Has he worked with open data or public sources?"
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
  the CONFIRMAR marker described in the manual, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
  -->

## What they are and why they exist

<!-- seccion: que-son -->

I built **six dashboards** from scratch on **open data** and published them sealed in the
showcase, each with its technical sheet. They are not design exercises: they are complete
analytical products, from the evaluation of the sources to the semantic model and the experience
in **Power BI**, and they exist for the same reason as the rest of the portfolio: a résumé claims
and a published piece allows verification. Anyone can download the same sources, reproduce the
calculations and question the modeling; that possibility is what gives them value.

All follow the same method against six universes: understand the source, model the domain, run
the source's identities, declare the coverage and the limits, and design an experience that
respects the evidence.

## The six universes

<!-- seccion: los-seis -->

| Dashboard                                                  | Universe                                                                                           | The identity that closes                                                                                                                                |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Colombian banking under the magnifying glass**           | 11 years of financial statements of the 81 credit institutions; 1,094 municipalities with a branch | the balance sheet closes in **7,779 of 7,779** combinations; solvency is reproduced in 3,809 of 3,811                                                   |
| **Colombia's companies in figures**                        | 8 years, 39,276 companies, 224,190 filings, 6,443,634 fact rows                                    | mismatch in the four accounting identities: **0 pesos**; coverage of the ranking of the 10,000 largest: 84.9%                                           |
| **Rates, inflation and debt: the monetary cycle**          | 27 years, 41 areas, 7 organizations                                                                | the two official sources of the U.S. curve agree on **71,999 of 71,999** pairs                                                                          |
| **What does the Colombian State spend on, and with whom?** | 4,373,766 contracts and 8 years of national budget                                                 | the control figure validated against the appropriation approved by Congress; **21 contracts** with impossible values, excluded and published one by one |
| **Energy and climate**                                     | 7 open sources, 1,925,420 fact rows, 12 pages in two languages                                     | **43 DAX measures** validated one by one; 0 of 354 broken references between report and model                                                           |
| **Formula 1: 77 seasons counted right**                    | 917 drivers, 186,216 rows in 25 tables                                                             | **20 of 20** identities of the source reproduced; 0 errors across five validation layers                                                                |

Each one also has a figure that only shows when the whole universe is run: banking's "income"
account contains 506.5 trillion of which 56% is gross valuation, and adding up the cumulative
inflates an annual result 6.39 times; 77% of public contracts are awarded without competition;
only 3 of 11 central banks have their rate below their inflation.

## The real stack

<!-- seccion: el-stack -->

The six are built with the same stack, declared in each sheet: **Power BI Desktop**, **Power
Query** in the M language for preparation, **DAX** for the measures, the report in **script-written
PBIR** —twelve pages, six in Spanish and six in English, generated with **Python** from a single
set of measures, which fails on an orphan color or a broken link— and the organizations' APIs:
Socrata's SODA for Colombian open data, SDMX and REST for the international ones.

None of them uses Microsoft Fabric: they are desktop pieces published as a versioned project.
Where I did set up Fabric end to end was at Vesting, and that is in its document. I have also
worked with Shiny in R, Tableau and Looker Studio, with less depth; Power BI is where the
specialty is, from preparation to experience.

Tools like DAX Studio and Tabular Editor come in when the model calls for them; the semantic
model and the report are treated as distinct components, so that one base of meaning sustains
several experiences without duplicating the logic.

## The identities have to close

<!-- seccion: las-identidades -->

The rule the six share: the identities the source defines or guarantees have to close, and they
are run **over the complete universe, not over a sample**. An identity is an invariant —assets
equal to liabilities plus equity; the twenty totals the F1 source itself publishes— and if it
stops holding after integrating and transforming, something happened in the pipeline, in the
model or in the source, and it has to be explained.

There are two distinct controls and it is worth naming them differently: the **identity**, an
internal invariant, and the **reconciliation with an external source**, like the control figure of
public spending against the budget approved by Congress. And there is a third, prior one: in
banking, an independent **preflight** predicted nine counts from the raw CSVs before touching
Power BI, and got all nine right.

Validation does not assume the publication is infallible, but neither does it modify it silently
to force it to close. In Formula 1, three of the twenty identities did not close at first and
uncovered **rules of the sport, not code errors**: until 1990 only the best results counted, and
there are 13 races where the pole is not the best time. In public spending, the 21 contracts with
impossible values are not deleted: they are excluded from the fact and published. A control that
has not been seen in red has proven nothing.

## Publishing the coverage and the limits

<!-- seccion: cobertura-y-limites -->

Each dashboard says what it cannot sustain, close to where it can affect the interpretation. All
share the first limit: **the data are a dated snapshot, not a live connection**, and they are
updated when the download is run. Then, each universe has its own: in companies, the universe is
the companies that report to the Superintendency and the coverage is measured on its own page;
in the monetary cycle, the real rate only exists for 30 of the 41 areas; in Formula 1, pit stops
exist since 1994 and sprint points since 2021; in energy, half of the inventory of power plants
carries no commissioning year.

And each sheet publishes its **"nevers"**: never add consolidated with individual figures, because
they would be the same parent counted twice; never use the sum of countries as the global total;
never subtract two temperature series with different base periods; never add national budget to
contracting, because they are two universes; never say "the drivers" without qualification when
the census gives three figures. Distinguishing absence from zero, keeping methodological changes
visible and not replacing missing values with zeros are part of the same habit.

## What the six dashboards demonstrate

<!-- seccion: que-demuestran -->

End-to-end data engineering and analytics, 6 times, on sources anyone can check: integrating
heterogeneous structures, preserving granularity, building dimensional models and **measures**
that represent real concepts, testing quality with controls that know how to turn red, and
publishing the coverage as part of the result. It is the same way of working I applied in
transit, logistics, banking and AI agents, with one difference: here the sources, the decisions
and the results can be examined without asking permission.
