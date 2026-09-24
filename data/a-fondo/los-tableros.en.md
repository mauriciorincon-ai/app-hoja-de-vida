---
slug: los-tableros
codigo: AF-23
titulo: "The dashboards: public data, verified"
resumen: "Six sealed dashboards on open data —banking, companies, the monetary cycle, State spending, energy and climate, Formula 1— built with Power BI Desktop, Power Query, DAX, script-written PBIR and Python, with the source's identities run in full and the limits in plain view."
cuando_usar: "Use this when they ask about the six dashboards published with open data (energy and climate, monetary cycle, Colombian banking, Colombia's companies, state spending, Formula 1), how he verifies the figures he publishes, financial statements and accounting data, Power Query, DAX and the rigor of each dashboard."
estado: aprobado
ancla: "/vitrina/tableros"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "What dashboards has Henry published?"
  - "How does Henry verify that the data in a dashboard is correct?"
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
  a CONFIRMAR marker in square brackets stating what is missing, never plausible filler.
- Full guide: docs/MANUAL-DE-USO.md → "How to feed the in-depth documents".
-->

## What they are and why they exist

<!-- seccion: que-son -->

I have built six analytical dashboards from scratch on public data sources and published them in the showcase of this site with their respective technical sheets. All six are sealed —they were sealed between September 6 and 8, 2026, after seven construction phases each— and each one addresses a different universe, but they all follow the same principle: the data must be traceable back to its origin, the model must pass verifiable controls, and the visualization must communicate clearly both its results and its limits.

I do not conceive of them as design exercises or as isolated demonstrations of Power BI. Each dashboard represents a complete analytical product that begins with identifying and evaluating the sources, continues with cleaning, integrating and transforming the data, and ends in a semantic model capable of sustaining indicators, comparisons and analytical journeys: twelve pages per dashboard, six in Spanish and six in English, generated from the same model and the same set of measures.

The difference between a visualization and an analytical product lies in everything that happens before the first screen. A chart can be built on a manually prepared table and produce a convincing impression. An analytical product needs to preserve provenance, document its transformations, check its relationships and demonstrate that the results presented remain consistent with the source universe.

These dashboards exist for the same reason as my applications, agents and research: a résumé asserts; a published piece allows verification. Saying that I have experience in data engineering, semantic models and Power BI communicates a capability. Publishing a dashboard whose figures can be checked against the sources demonstrates how I apply that capability.

## Open data: anyone can reproduce the calculations

<!-- seccion: datos-abiertos-reproducibles -->

The public nature of the data introduces an additional demand. Anyone can download the sources, reproduce the calculations and question the modeling decisions. That possibility does not weaken the pieces. It is precisely what gives them value as professional evidence.

The sources have a name and an owner in every sheet. The complete chart of accounts of every supervised entity published by the Superintendencia Financiera, month by month. The financial statements that companies report to the Superintendencia de Sociedades, from 2018 to 2025, downloaded from the Colombian State's open data portal. The policy rate of forty central banks, the United States yield curve published separately by the Federal Reserve and the Treasury, OECD prices and IMF projections: seven organizations that produce each data point, without going through any aggregator. The national budget and public procurement. Seven open energy and climate sources —among them the temperature series from NASA and NOAA, the international energy agency and the World Bank— with each one's license declared. And the 47 files of Formula 1 history from F1DB, version 2026.13.0, under the CC BY 4.0 license.

None of those sources is designed for integrated analysis, and that is the part of the work that a pretty dashboard hides: the banking source brings sixteen traps measured before the model; the companies source, nine; the public spending source, nine; the Formula 1 source, twenty-one. All of them are counted in their sheet, and the ones that change a published figure are explained in the dashboard itself.

It also forces me to differentiate clearly between what the data shows and what it does not allow one to conclude. A public source can have great coverage and still retain methodological, temporal or conceptual limitations. The dashboard must not remove those limitations to produce a more attractive narrative. It must make them visible so that the user understands the real scope of its conclusions.

The six dashboards therefore constitute a public demonstration of a method: obtain data, understand its structure, rebuild its relationships, verify its identities, model its meaning and turn it into an analytical experience that can be examined by other people.

## The six universes

<!-- seccion: los-seis -->

| Dashboard                                             | Universe                                                                                          | The identity that closes                                                                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Colombian banking under the magnifying glass**      | 11 years of financial statements of the 81 credit institutions; 1,094 municipalities with a branch | the balance sheet closes in **7,779 of 7,779** combinations; solvency is reproduced in 3,809 of 3,811                                                        |
| **Colombia's companies in figures**                   | 8 years, 39,276 companies, 224,190 filings, 6,443,634 fact rows                                   | mismatch in the four accounting identities: **0 pesos**; coverage of the ranking of the 10,000 largest: 84.9%                                                 |
| **Rates, inflation and debt: the monetary cycle**     | 27 years, 41 areas, 7 organizations                                                               | the two official sources of the US curve agree in **71,999 of 71,999** pairs                                                                                  |
| **What does the Colombian State spend on, and with whom?** | 4,373,766 contracts and 8 years of national budget                                           | the control figure validated against the appropriation approved by Congress; **21 contracts** with impossible values, excluded and published one by one      |
| **Energy and climate**                                | 7 open sources, 1,925,420 fact rows, 12 pages in two languages                                    | **43 DAX measures** validated one by one; 0 of 354 broken references between report and model                                                                |
| **Formula 1: 77 seasons counted right**               | 917 drivers, 186,216 rows in 25 tables                                                            | **20 of 20** source identities reproduced; 0 errors across five validation layers                                                                             |

Each one also has a figure that can only be seen by running the entire universe: the banking "income" account contains 506.5 trillion, of which 56% is gross valuation of derivatives, and adding up the cumulative figures inflates an annual result 6.39 times; 77% of public contracts are awarded without competition, although in money terms it is 52%; only 3 of 11 central banks have their rate below their inflation; the drop of the real economy in 2020 was 7.4% and not the 2.2% the aggregate says.

Although the six dashboards belong to very different domains, they all demand the same fundamental capabilities: understanding the sources, establishing a unit of analysis, preserving granularity, creating relationships, defining measures, verifying results and designing an experience that does not exceed the available evidence.

## Colombian banking under the magnifying glass: eleven years and 81 institutions

<!-- seccion: banca-colombiana -->

The first dashboard, Colombian banking under the magnifying glass, integrates eleven years of financial statements for the 81 supervised credit institutions. The piece allows analyzing the evolution of the sector, comparing institutions and traversing the relationships between the main accounting structures: how much banking weighs and who dominates it, where the money comes from, the quality of the loan portfolio, the capital cushion and the map of credit, municipality by municipality.

The challenge was not only about accumulating periods and institutions. It was necessary to preserve the correspondence between accounts, institutions and cut-off dates, and to verify that the integration had not duplicated, omitted or misaligned records. The accounting identities provided the mechanism to check that the model still correctly represented the information published by the source: assets equal liabilities plus equity, run in full and not on a sample, closes in all 7,779 entity–cut-off combinations with a maximum deviation of 1.7·10⁻¹¹; and the solvency ratio, recalculated from its components, is reproduced in 3,809 of 3,811 cases within 0.01 points.

The source brings sixteen traps, and the three that weigh most change figures that anyone would take for granted. The income statement accounts arrive cumulative within the year and reset every January: adding up the twelve months inflates an annual result 6.39 times, so they are de-accumulated in Power Query while preserving negative flows, which are legitimate accounting reversals. The "income" account contains 506.5 trillion in twelve months, of which 283.1 is gross valuation of derivatives that on the expense side is worth 283.9: the dashboard does not publish any measure called income; it publishes interest margin, net fees and profit. And the four fact tables have different perimeters —81, 63, 66 and 70 institutions— and two periodicities, so they are never mixed into a single figure.

The semantic model has 16 tables, 20 relationships and 62 DAX measures, each one naming its account codes, with no calculated columns. Before touching Power BI, an independent preflight written in Python predicted nine counts from the raw CSVs and got all nine right. And the dashboard never joins institutions by name, only by the type-and-code pair, because the names do not match across datasets, nor does it download the dataset that publishes the personal data of each institution's legal representative.

## Colombia's companies in figures: 39,276 companies

<!-- seccion: empresas-de-colombia -->

The second dashboard, Colombia's companies in figures, studies eight years of financial statements of close to forty thousand companies: 39,276, with 224,190 annual filings, in a star schema of 6,443,634 fact rows. The scale introduces challenges of standardization, comparability, coverage and quality that do not appear in a small sample.

The source brings nine traps —repeated filings, resubmissions, consolidated statements that duplicate the group, corrupted corporate names— and each one is measured and resolved before modeling, in fourteen Power Query queries, not patched afterwards. A single filing per company and year, after resolving the cases that reported the same fiscal year under two reporting forms. The four accounting identities —revenue minus cost equals gross profit, liabilities plus equity equals assets, balance-sheet cash equals closing cash in the cash-flow statement, and the DuPont tree, which closes to seven decimals— mismatch by zero pesos. And the fact table count is identical to the one predicted by an independent validation written in Python before the refresh: two different paths to the same number.

Beyond presenting financial indicators, this piece measures how much of the available universe is actually covered. Coverage is part of the result because a conclusion about Colombian companies needs to acknowledge which organizations, periods and conditions are represented and which are left out: the dashboard covers 84.9% of the ranking of the ten thousand largest companies, and the 1,507 that are missing are worth 509 trillion pesos in revenue and are supervised by another superintendence. It publishes this as a figure on its own page, not as a footnote.

The finding that justifies the method is in growth. The aggregate says 2020 fell 2.2%, because 3,414 new companies reported that year; over the same 23,321 companies present in both years, the contraction was 7.4%, more than triple. And the 2019 jump —24.5% aggregate— was mostly sample, not economy: the same companies grew 14.6%. That is why the dashboard never presents aggregate growth alone: next to it always goes the same-company growth, on the same axis. The model: ten tables, six relationships, 64 DAX measures.

## Rates, inflation and debt: the monetary cycle in 41 areas

<!-- seccion: ciclo-monetario -->

The third dashboard, Rates, inflation and debt: the monetary cycle, integrates twenty-seven years of information for forty-one economic areas from seven organizations. Its purpose is to allow the joint analysis of monetary and macroeconomic variables that are normally published with different structures, frequencies and conventions: none of the seven publishes the same thing on the same calendar, and the dashboard shows, on its own page, where they do not coincide.

The integration required harmonizing dates, units, periodicities and identifiers, on a star schema with a daily calendar from 1999 to 2031 and 24 Power Query queries. It also included contrasting pair by pair the two official sources of the US curve —the Treasury against the Federal Reserve's weekly publication, same day and same tenor— to check that the representation used was consistent: they agree in 71,999 of 71,999 pairs, with a maximum deviation of zero. The entire discrepancy between the two organizations lies in which days the value exists, not in how much it is worth: 997 pairs are published by only one of them, and 994 of those are the 30-year bond between 2002 and 2006, the four years in which it was not issued.

Two decisions in this dashboard are the ones that most resemble my work inside an organization. The first: the last published month brought 22 areas out of 38, and a card anchored there would have described "the world monetary cycle" on little more than half a sample, without warning. All cycle measures are anchored to the last complete close, and the notes page shows the two figures together. The second: the price panel shrinks and each country ends in a different month, so median inflation is calculated on a fixed panel of nine areas declared on the card itself, not on whoever happened to publish that month.

Of its 62 DAX measures, eleven return blank outside the context of a country, on purpose: there is no such thing as "the policy rate" of forty central banks. The findings: the United States curve was inverted for 1,009 days; in May 2026, 31 of 38 central banks are holding their rate and only 3 of 11 have it below their inflation; Colombia raised 11.5 points in two years, from 1.75% to 13.25%, and has lowered two.

## What does the Colombian State spend on, and with whom?

<!-- seccion: gasto-del-estado -->

The fourth dashboard, What does the Colombian State spend on, and with whom?, relates 4,373,766 public contracts to eight years of budget information, 337,034 rows downloaded with the SHA-256 of each file. Its purpose is to connect two perspectives that are usually analyzed separately: the approved resources and their materialization through procurement processes.

The control figure was checked against the budget approved by Congress: the model exactly reproduces the initial appropriation for 2024, 502.597 trillion pesos. This comparison does not by itself prove that every relationship between budget and procurement can be established directly, but it does provide an external reference point to evaluate the consistency of the incorporated universe: it is the only validation layer that does not come from the data itself; it checks that the file tells the truth and not just that the model loaded it well.

The two fact tables are deliberately not related to each other, because the entity keys do not match and do not even cover the same universe: the budget belongs to the central government and two out of every three contracts belong to territorial entities. They are conformed by sector and calendar, and by nothing else. They are never added together.

The source brings nine traps. The one that taught me the most: the budget metrics arrive cumulative within the year, and the first version of my de-accumulation lost two out of every three pesos without any query failing. A baseline written in Python on the raw files caught it by arithmetic —19 rows per series where there can only be 12 months— before it reached Power BI, and recovered 65% of the value. And the 21 contracts with impossible values —they add up to 8,909 trillion declared; the largest claims to be worth thirteen times the entire national budget under a contracting method reserved for the smallest purchases— are not deleted silently: they are excluded from the fact table and published one by one, with their entity, their contracting method and the value they declared.

The model: 18 tables, 16 relationships and 44 DAX measures, with a four-step funnel that can only go down. The findings: in 2025, 77.3% of contracts were direct contracting, but only 51.8% in money —direct contracting dominates in number; the large contracts do go to tender—; 1.08 million suppliers for 4.37 million contracts, and 10% of them concentrate 88.3% of the money.

## Energy and climate: seven open sources, one model

<!-- seccion: energia-y-clima -->

The fifth dashboard, Energy and climate, integrates seven open sources to analyze how electricity is generated in different regions and how the planet's temperature evolves. The piece connects related phenomena, but avoids presenting their coexistence as automatic evidence of causality.

None of the seven sources fully agrees with the others: they publish different aggregates, measure temperature against different base periods and cover different countries. The dashboard does not disguise those seams: it measures them and shows them. The gap between adding up countries and the 2024 world total is −0.38%, measured on the raw files and reproduced afterwards by a DAX measure on the finished model: two independent paths to the same number. That is why it never uses the sum of countries as the world total —it publishes the official aggregate and shows the difference— and never subtracts the two temperature series, because they use different base periods and the subtraction would measure the base.

In this dashboard, publishing the limits is as important as presenting the results. The sources may use different methodologies, coverages and frequencies. The visualization must ease comparison without hiding the differences that condition interpretation: the most recent year is incomplete and the rankings use the last year with complete coverage; the inventory of 34,934 power plants has uneven coverage by country and half of them do not carry a commissioning year; two per-capita indicators are only valid with one country selected, and that is declared in the model.

The model: a star schema of 15 tables and 22 relationships with 43 DAX measures validated one by one against published values, not just against themselves; 1,925,420 fact rows, the ones predicted by the Python baseline before the refresh; twelve pages and 112 visuals, with 0 of 354 broken references between report and model. The findings: solar went from 1 TWh in 2000 to 2,143 in 2024; each kilowatt-hour emits 11% less than in 2000, but coal nearly doubled in absolute terms; 2024 was the warmest year on record, at +1.28 °C above the 1951-1980 base; Colombia generates two thirds of its electricity clean.

## Formula 1: 77 seasons counted right

<!-- seccion: formula-1 -->

The sixth dashboard, Formula 1: 77 seasons counted right, rebuilds the historical behavior of the championship and verifies its results through twenty identities published by the source itself. F1DB publishes 47 files with the entire history and also 54 totals already calculated per driver and per team. Those totals are not loaded: they would be a second source of truth inside the model. They are used as a test: the model calculates its own figures and they are compared one by one, in Python, outside the model and against the raw CSVs. The twenty it can reproduce close without a single deviation.

The piece demonstrates that rigor does not depend on the formality of the sector. Sports data also contains historical changes, rules, exceptions, relationships and totals that must be preserved correctly. Three of the identities did not close during the first validations, and they uncovered rules of the sport, not code errors: until 1990 only the best results of the season counted, so championship points are not calculated by adding up races; and there are 13 races, in nine seasons between 1959 and 2024, where the pole is not the best qualifying time. Counting position 1, the poles identity failed for 13 drivers; reading the flag that the source itself publishes, it closes for all 917.

## The Formula 1 census and the five validation layers

<!-- seccion: formula-1-censo-y-validacion -->

The census is the best lesson of this dashboard: 917 drivers are in the catalog, 860 have at least one race result and 757 have one outside the Indianapolis 500, which scored for the championship between 1950 and 1960 without being Formula 1 races. The three figures answer different questions, and the dashboard never says "the drivers" without qualification. Nor does it add points across eras except on the page that declares it —a win was worth 8 points in 1955 and has been worth 25 since 2010— nor group teams by the source's parent field, which tells the story of one and the same team five times.

The model: 25 tables, 39 relationships —all active, none bidirectional— and 54 DAX measures; 33 Power Query queries go from the raw CSVs to the 25 tables without a single calculated column; 186,216 rows loaded. Validation runs in five layers before opening Power BI, over the 171 files of the report: schema, 322 field references with none broken, 36 text boxes that fit in their box, 54 labels and 54 card figures measured against the real width; 0 errors. The human render review is the sixth layer. And my favorite finding: in 1988 the runner-up scored 105 points against the champion's 94 and lost the title through dropped results; neither column is wrong, they are two different questions.

## The real stack: Power BI Desktop, Power Query, DAX, scripted PBIR and Python

<!-- seccion: el-stack -->

All six are built with the same stack, declared in each sheet with the role of each piece. Power BI Desktop, where the model lives in import mode along with the twelve pages in a single file, with no cloud service. Power Query, in the M language, for all the preparation: de-accumulating results while preserving negative flows, resolving resubmissions and duplicates, filtering the chart of accounts by code, anchoring the cycle measures to the last complete close. DAX for the measures, which is the only thing that cannot live in Power Query: none of the six models has a calculated column. The report in PBIR written by script: the twelve pages and their visuals —142 in companies, 112 in energy, 78 in Formula 1— generated with Python from a single set of measures, with a script that fails on an orphan color, a broken link or an untranslated text. Python also for the independent baseline that predicts counts and control figures from the raw files before touching Power BI. And the organizations' APIs: Socrata's SODA for Colombian open data, SDMX and REST for the international ones, with the snapshot date sealed in every file.

Power BI is the main layer of experience and decision. It is the place where the semantic model turns into indicators, comparisons, hierarchies and journeys the user can understand. However, I do not consider it an isolated tool or the starting point of the solution: in these six, the solution starts in a script that downloads and in another that predicts what the model has to load.

Tools such as DAX Studio and Tabular Editor strengthen this work when the model calls for it. They allow observing the behavior of queries and measures, organizing metadata, applying conventions and treating the model as an asset that needs performance, maintainability and governance. The semantic model and the report are treated as distinct components, so that one and the same base of meaning can sustain several experiences without duplicating the logic: the six English pages of each dashboard come out of the same model as the six Spanish ones.

## Why these six do not use Microsoft Fabric, and where I did set it up

<!-- seccion: fabric-y-los-tableros -->

None of the six published dashboards uses Microsoft Fabric: they are desktop pieces, published as a versioned project. It is a deliberate decision, not a shortcoming. A public dashboard on open data has to be openable and reproducible by anyone with Power BI Desktop and the scripts, without a cloud capacity in between, and its operating cost has to be zero. With 6.4 million fact rows in the largest of them, import mode sustains it without difficulty.

Microsoft Fabric adds what these six do not need and an organization does: ingestion through pipelines, organization in lakehouses or warehouses on OneLake, transformations under reproducible rules outside the file, and semantic models that serve different consumption experiences without rebuilding their meaning. That integration reduces the dependence on files and transformations locked inside a single report, and allows the prepared information to be reused by other dashboards, applications, analytical processes or artificial intelligence agents.

Where I did set up Fabric end to end was at Vesting, from scratch, on a platform of 120 tables and 20 GB to observe artificial intelligence agents in real time; that is in its own document, and it cannot be shown in public because it belongs to an employer. That is why the pipeline has declared, in exploration and with no promised date, a piece that covers exactly that gap: an end-to-end analytical solution on Fabric with Colombian open data, from ingestion to the lakehouse, to the semantic model and to embedded Power BI.

DP-600, earned in December 2024, formalizes precisely that depth: preparing and enriching data, managing analytical assets, implementing semantic models and securing the solutions built on Fabric. In these six dashboards the certification becomes visible in what Fabric and Power BI share —the semantic model, the measures, the decisions on granularity and performance—, and in the exploration the rest will become visible.

## Shiny, Tableau and Looker Studio: other tools, another level

<!-- seccion: otras-herramientas -->

Power BI and Fabric constitute my preferred stack because they allow connecting data engineering, semantic modeling and analytical consumption within the same ecosystem. This preference does not mean that my experience is limited exclusively to Microsoft technologies.

I have also worked with Shiny within the R and Posit ecosystem to build analytical experiences linked to statistical analysis, the same line as my training in data science with R. I have worked hand in hand with Tableau in visualization and exploration contexts, and with Google Looker Studio for publication and analysis scenarios connected to other sources and services.

These tools do not occupy the same level within my profile, and the site's skills publish them with that honesty. Power BI and Microsoft Fabric represent my greatest depth and my main architecture: six public dashboards, a company platform and a certification back it. Shiny, Tableau and Looker Studio broaden my capacity to understand other approaches to building, interacting with and distributing analytical products, and allow me to read and work with what an organization already has.

My criterion for selecting the tool does not start from a brand preference. I consider the problem, the sources, the scale, the governance needs, the audience, the available infrastructure, the licensing model and the organization's capacity to sustain the solution. The right platform is the one that allows turning data into a reliable capability without introducing complexity disproportionate to the context in which it will have to operate. For six public dashboards, that was Power BI Desktop and a script; for a startup with 23 agents monitored at once, it was Fabric.

## The pipeline begins at the source

<!-- seccion: pipeline-de-datos -->

Every dashboard begins with an evaluation of the sources. Before designing indicators I need to understand who publishes the information, what each dataset represents, how often it is updated, what coverage it has and what methodological changes may affect its interpretation. In the monetary cycle, for example, the rate panel is not fixed: 31 areas in 1999, 40 between 2007 and 2022, 38 at the last complete close, and the panel measures state how many they are calculated on.

Public sources usually use structures designed for publication or exchange, not necessarily for integrated analysis. They may be distributed across multiple files, contain variable headers, change names between years, use incomplete identifiers or publish totals at a level of aggregation different from the one the model requires. The companies source publishes the description of the industry code with broken accents in 480 variants; the banking source misspells the name of one type of institution in one of its datasets. Neither of the two is "fixed" by hand: the analysis goes by section, and the join goes by code.

Ingestion must preserve enough evidence to rebuild the journey. The file, the period, the organization, the download date and other relevant metadata are part of traceability, and in public spending every file travels with its SHA-256. I do not consider it sufficient to store only the resulting table if it cannot later be related to the publication that originated it.

I also try to preserve the data at the necessary level of detail before aggregating it. Early aggregation may simplify the model, but it eliminates the possibility of investigating inconsistencies, rebuilding identities or developing questions that had not yet been formulated. That is why the Formula 1 model loads 155,101 fact rows in ten tables, and not the 54 totals the source already brings calculated.

## Transforming without interpreting: Power Query before the first measure

<!-- seccion: transformacion-y-controles -->

Transformation must separate technical correction from analytical interpretation. Converting a field to a date or removing characters from a value is a technical operation. Deciding that two categories represent the same concept requires a business rule or a different methodological justification, and that is why in public spending the sectors, contracting methods and statuses are not translated with an automatic rule: they go in six hand-curated catalogs, because no heuristic gets them right.

All the preparation lives in Power Query, before a single measure exists: fourteen queries in companies, 24 in the monetary cycle, 33 in Formula 1. It is an architecture rule, not a convenience. What is transformed in the preparation is seen, versioned and tested; what is transformed in a DAX calculated column stays hidden inside the model. None of the six has one.

Controls are applied along the journey and not only at the end. I verify structures, types, duplicates, missing values, relationships, counts and relevant totals before allowing the data to move on to the semantic model. And there is a control prior to all of them: the independent baseline in Python, which predicts from the raw files what the model has to load. In banking it predicted nine counts and got all nine right; in companies and in energy it predicted the exact count of the fact table; in public spending it checked ten control figures and knocked down one of my own de-accumulations by arithmetic before it reached Power BI.

This discipline comes from data engineering as much as from Industrial Engineering. I treat the pipeline as a process: each stage receives an input, applies a transformation, produces an output and must preserve evidence about what it modified. On a platform like Fabric those responsibilities are organized with greater clarity and reuse, because ingestion, preparation, storage and consumption stop depending on the Power BI file; in these six, the same separation lives in scripts, queries and a model, and can be read in full in the repository of each dashboard.

## The semantic model turns data into concepts

<!-- seccion: modelo-semantico -->

The semantic model is the core of each dashboard. It is the place where the sources stop appearing as isolated files and columns and begin to represent understandable entities, facts, periods, organizations, territories, categories and relationships.

A well-designed model allows answering new questions without rebuilding the logic for each page. It also allows different measures to use common dimensions, work with consistent granularity and preserve a stable interpretation across the product. All six are star schemas: 16 tables in banking, 10 in companies, 13 in the monetary cycle, 18 in public spending, 15 in energy and 25 in Formula 1, with their calendars —daily from 1999 to 2031 in the monetary cycle, daily from 1950 to 2026 in Formula 1— as first-class dimensions.

Construction begins by identifying the unit of analysis. In the financial dashboard it is an institution, an account and a cut-off date. In public procurement it is a contract, a contracting entity, a supplier and a date. In Formula 1 it is a race, a season, a driver or a team, and there the unit decides a rule: entries and podiums go by distinct race, not by row, so as not to count twice a driver who shared a car.

Relationships must respect that granularity. An apparently valid join can duplicate records and produce incorrect totals if it connects tables with different levels of detail. This type of error is especially dangerous because the dashboard can keep working and present plausible figures. That is why in banking the four fact tables are not related to each other, and in public spending the two fact tables are not either: when the perimeters or the keys do not match, the honest relationship is none, conformed only through the dimensions they do share.

## DAX measures: 62, 64, 62, 44, 43 and 54

<!-- seccion: medidas-dax -->

Measures are built after the structure is established. DAX allows expressing calculations, cumulative totals, variations, shares and time comparisons, but a technically correct measure can produce a wrong result if the model does not adequately represent the domain. The six dashboards add up, per piece, to 62 measures in banking, 64 in companies, 62 in the monetary cycle, 44 in public spending, 43 in energy and 54 in Formula 1.

That is why I do not separate measure engineering from knowledge of the process and the source. The semantic model is an implementation of how I understand the universe analyzed, not only an optimization so that Power BI answers faster. Three measures illustrate it. Banking solvency is recalculated from its components —technical capital over risk-weighted assets plus market risk plus operational risk— because that is the only thing that allows aggregation: the system's solvency is the quotient of the sums, not the average of the ratios, and the shortcut of dividing only by risk-weighted assets deviates 4.71 points at the median. The eleven monetary-cycle measures that return blank outside the context of a country exist so that nobody can ask for a "world" policy rate. And the two supplier-concentration measures of public spending say different things on purpose: 10% of suppliers concentrate 88.3% of the money and, even so, the 2025 concentration index is 72, far from a concentrated market.

The 43 energy measures were validated one by one against the model and contrasted with published values, not just against themselves. And every field a visual cites is checked against the real model, because the schema validator does not know which measures exist: 0 broken references out of 354 in energy, 0 out of 322 in Formula 1.

True expertise in Power BI does not consist in knowing a large number of visualizations. It consists in building a semantic layer capable of preserving the meaning of the data and sustaining experiences that can be used with confidence. On a platform like Fabric that model can live outside the report and share definitions with different consumers; in these six it lives in the file, and the discipline is the same.

## The identities have to close

<!-- seccion: las-identidades -->

The rule the six dashboards share is that the identities defined or guaranteed by the sources must close. This condition turns validation into a structural part of the product and not into an optional review before publishing.

An identity is a relationship that must hold within the universe analyzed. In financial statements, assets must correspond to the sum of liabilities and equity under the applicable structure. In a budget, the line items must reconcile with the published totals. In a championship, points and results must match the official values: the twenty totals that the Formula 1 source itself publishes.

These identities work as invariants of the system. If they stop holding after integrating and transforming the data, something happened inside the pipeline, the model or the source that needs an explanation.

The first possibility is a loss. Some record did not come in, was filtered incorrectly or stopped being related to the rest of the information: the de-accumulation that lost two out of every three pesos in public spending was exactly that. The second is a duplication produced by a join or an incompatible granularity: the consolidated statements that duplicate the business group, the shared cars of the fifties. The third is a conceptual misalignment, in which two apparently equivalent fields represent different things: the "income" account that is actually income plus gross valuation of derivatives.

There may also be a problem at the source. A public source can contain errors, later corrections, methodological changes or exceptions that are not explained in an obvious way. Validation must not assume that the publication is infallible, but neither must it silently modify it to force it to close. When the corporate name arrives corrupted, it is not invented: it is taken from the official ranking that republishes the same field correctly encoded. And when two institutions publish the inflation of the same country and the same year and they do not match —the median deviation between the IMF and the OECD is 0.05 points, but one year of Argentina comes out at −16.9—, the dashboard shows both.

## Identity, external reconciliation and preflight: three different controls

<!-- seccion: tres-controles -->

There are three different controls and it is worth naming them differently, because they do not prove the same thing. The identity is an internal invariant: assets equal liabilities plus equity, run over the 7,779 entity–cut-off combinations of banking. Reconciliation with an external source is something else: the public spending control figure against the 502.597 trillion approved by Congress checks that the file tells the truth, not just that the model loaded it well. And the third comes before the other two: the preflight, the independent baseline in Python that predicts counts and control figures from the raw CSVs before touching Power BI, and which in banking predicted nine and got nine right.

In the dashboard on State spending, moreover, the 21 contracts with impossible values are excluded from the fact table and published one by one. In Formula 1 twenty identities were verified and three of them did not close during the first runs.

Those three cases proved especially valuable. A test acquires meaning when it can turn red and make a deviation visible. If the identities had been treated only as a formality to confirm expected results, the problems would have remained hidden; and in this case the three reds were rules of the sport, not code errors: the dropping of results in force until 1990 and the 13 poles that are not the best time.

Differences are documented in the technical sheet instead of being silently corrected or removed to produce a cleaner dashboard. The purpose of validation is not to get all the numbers to match at any price. It is to understand why they match or why they stop doing so.

This discipline connects directly with my management systems and with my way of working in artificial intelligence. A control is not proven because it exists. It must show that it can detect the condition it was designed for and preserve evidence about the response applied. A control that has not been seen red has proven nothing.

## How I verify the figures I publish: the whole universe, not only a sample

<!-- seccion: verificar-el-universo -->

When the scale allows it, I run the validations over the complete universe incorporated into the model and not only over a selected sample. In the six dashboards it did allow it: the 7,779 banking combinations, the 71,999 curve pairs, the 6.4 million company rows.

Samples are useful for understanding structures, developing transformations and reviewing cases in greater detail. However, a rule that works on some records can fail in periods, entities or categories that were not included during development. Solvency, for example, only exists since 2021, when the source starts publishing it, and the four banking fact tables start in January 2016 because before that the portfolio breakdown does not close against its own total: two conditions that a recent sample would never have shown.

Complete validation allows recognizing exceptions, format changes and historical conditions that could remain hidden in a small selection. It also helps to differentiate a systematic problem from a localized difference: that 99.99% of the income-statement series close against their own December cumulative is only known by running all of them.

This decision demands balance. Validating the whole universe can increase processing time and resource use. That is why I distinguish between quick controls that can be run frequently and exhaustive tests that belong to specific moments of the publication cycle: the five Formula 1 layers run before every opening of Power BI; the comparison against the source's 54 totals, at closing.

Results must preserve enough detail to identify where the difference occurred. A control that only reports that the sum does not match forces the analysis to be repeated. A useful validation must allow locating the institution, the period, the account or the combination that produced the failure: in banking, solvency is reproduced in 3,809 of 3,811 cases, and the two that are not are known by name and cut-off date.

Scale also influences architecture. A dashboard with millions of records needs storage, transformation, aggregation and modeling strategies different from those of a small piece; beyond a certain volume, a platform like Fabric moves those responsibilities to a lakehouse prepared for larger volumes. The goal is not to prove that I can load a lot of data. It is to ensure that the amount of information does not reduce the capacity to explain, validate and govern the results.

## Publishing coverage and limits

<!-- seccion: publicar-los-limites -->

Every dashboard must communicate not only what it allows one to observe, but also what its data cannot sustain. Publishing limits is a condition of responsible use and not a secondary note placed outside the main experience: in all six, the sixth page is called "Notes, limits and quality", and each one's sheet publishes its limits as a list, with figures and not with paragraphs.

They all share the first limit: the data is a dated snapshot, not a live connection, and it is updated when the download is run. After that, each universe has its own. In the monetary cycle, the real rate only exists for 30 of the 41 areas, the ones that publish the monthly price index, and the IMF's years 2026 to 2031 are projection, not data, with the boundary measured and not assumed. In Formula 1, pit stops exist since 1994 and sprint points since 2021: none of those series covers the 77 years, and the 2026 season is in progress, with 13 rounds out of 23. In public spending, procurement starts in 2022 —before that, the platform was being adopted and a longer series would show adoption, not spending— and all figures are in current pesos, not deflated.

Coverage needs to be expressed in an understandable way. It may depend on the periods, entities, regions, variables or methodologies available. A dashboard that analyzes thousands of companies still has to explain what proportion of the universe it represents and which organizations are not included. In Colombia's companies in figures, coverage is presented as an analytical dimension in its own right, measured against two published rankings. This decision prevents the size of the dataset from being automatically interpreted as a complete representation of the business fabric.

In Energy and climate, the limitations of the sources are made visible because the comparisons cross different methodologies, territories and periods. Integrating variables within the same experience does not automatically make their definitions equivalent nor prove causal relationships.

## Absence is not zero, and methodological changes stay visible

<!-- seccion: ausencia-y-metodologia -->

A distinction must also be made between absence and zero. That a source does not contain a value does not mean the phenomenon does not exist. Indiscriminately replacing missing values with zero can produce an incorrect narrative and alter aggregations, trends and comparisons. That is why 11 measures of the monetary cycle return blank instead of a number when the context is not a country, and why the negative flows in banking are preserved instead of being clipped to zero.

Methodological changes must also remain visible. When an organization modifies a classification, a series can appear to break where the break comes from the definition and not from the phenomenon. The transformation must not erase that condition without documenting it: each company appears with the classification of its most recent filing, and a company that changed sector is shown with the current one in every year, which the sheet declares as a limit; the harmonization of banking delinquency buckets is a declared approximation, because each credit modality uses its own scheme of days.

The limit must be communicated close to the place where it can affect interpretation. A general warning at the end of the dashboard may be insufficient if the person makes a decision on a specific page without recognizing that the universe is incomplete. That is why the median inflation card says how many areas it is calculated on —9, the fixed panel—, and the real-rate page shows the coverage of the price index next to each area.

Industrial Design contributes an important responsibility at this point. Limits must be understandable, visible and proportional to the risk of a wrong interpretation. It is not enough to include them in a technical note that few people will read.

A reliable analytical product is not the one that seems to have an answer for everything. It is the one that allows distinguishing clearly what it can assert, what needs additional context and what remains outside its data.

## The "nevers" of each dashboard

<!-- seccion: los-nunca -->

Every sheet publishes its "nevers": the operations the dashboard forbids itself, written as rules and not as warnings, because they are the shortest way to say which error it avoids. There are five per dashboard, and these are the ones that best explain the method.

Never add consolidated statements to individual ones, because they would be the same parent company counted twice and every business group would be inflated. Never publish account 4 as income: 56% of what it contains is gross valuation of derivatives that cancels out against the expense. Never add levels of the chart of accounts to each other: every measure names its codes, because adding up the unfiltered column inflates assets 2.7 times. Never use the sum of countries as the global total, nor subtract two temperature series with different base periods. Never add the national budget to procurement, because they are two universes, nor add up the source's cumulative metrics, which would return figures inflated seven times. Never give "the policy rate" for more than one area, nor take a figure from an aggregator: every data point comes from the organization that produces it, and that is why the obvious shortcut stays out. Never say "the drivers" without qualification when the census gives three figures, nor calculate championship points by adding up races. And in all six: never invent a data point to repair the source, and never load data about people —the supervised-entities dataset publishes the name, ID document and email of the legal representative; the procurement one, the ID number and address of three roles per contract; none of them is downloaded—.

Distinguishing absence from zero, keeping methodological changes visible and not replacing missing values with zeros are part of the same habit. A "never" written in the sheet is also a test: if a dashboard breaks one, it shows, because the sheet is published right next to it.

## Visualization must respect the evidence

<!-- seccion: visualizacion-y-evidencia -->

Visualization must not exaggerate what the data can prove. A scale, a color, an aggregation or a comparison can profoundly modify the way a person interprets the result.

That is why each representation must answer the type of question. A trend needs to preserve the temporal behavior. A comparison needs a coherent scale: the two company growth rates, aggregate and comparable, go on the same axis. A composition must allow understanding both the parts and the total. A distribution cannot always be reduced to an average: the rates of the security types are published as the source gives them, because without balances to weight by, the simple average would give 3.411% against 3.490%.

There must also be a clear hierarchy. The opening screen must answer the main question and allow drilling down to the causes, the segments or the evidence. Each of the six dashboards opens with that page —the system in figures, the real economy in figures, the cycle at a glance, the budget funnel, the pulse of the system, Formula 1 in 77 seasons— and closes its six Spanish pages with the notes, the limits and the quality. Showing all the information simultaneously increases cognitive load and can hide precisely what needs attention.

Titles fulfill an analytical function. They must not be limited to naming the metric. They must help understand what is being observed, over what period and in what unit: "five banks hold 70.9% of banking assets", "one in every 23 pesos lent is delinquent", "eight out of ten contracts are awarded without competition". Labels, filters and descriptions must use concepts recognizable to the audience and not automatically reproduce the technical names of the sources; on the English pages, regulatory labels are translated by their code, not by their text.

## Color, accessibility and Industrial Design in a dashboard

<!-- seccion: color-y-accesibilidad -->

The use of color needs meaning. The same palette should not be used simultaneously for categories, statuses and risk levels. Nor should it depend exclusively on color to communicate a difference that needs to be understood by users under different visual conditions. Since the report is written by script, this is an executable rule: the generator fails on an orphan color —one that does not belong to the declared palette— before the page exists.

Accessibility is part of the design. Contrast, navigation, hierarchy, alternative text and interface behavior influence who can use the solution and with what level of effort. In Formula 1, two of the five validation layers are about legibility: 36 text boxes that fit in their box, and 54 labels and 54 card figures measured against the real width of their card, because a truncated figure is a wrong figure. Two of the four layers of the monetary cycle were born from earlier render reviews: a defect that was seen once becomes a validation, not a note.

My training in Industrial Design strengthens this dimension because it forces me to treat the dashboard as an experience and not only as a surface on which to place charts. Form must help understand function, not compete with it. That the twelve pages of each dashboard come out of a script does not take design away from it: it gives it design twice, because the design is reproducible and because the human render review is the last layer, not the only one.

The best visualization is not the flashiest or the one that presents the most elements. It is the one that allows recognizing the result, understanding its context, identifying its limits and traversing the evidence without losing meaning.

## Dashboards as analytical products, not as files

<!-- seccion: productos-analiticos -->

I do not consider a dashboard finished because the Power BI file works or because the publication completed correctly. A sustainable piece needs identified sources, reproducible transformations, a maintainable model, documented measures, quality controls and a coherent experience. That is why all six are published as a versioned project, with the report in PBIR written by Python: the design is in code, it can be read, compared between versions and regenerated, and the review of a page is the review of a change.

It also needs a clear relationship with its purpose. In the public portfolio, each dashboard demonstrates a specific capability, and its sheet says so: who it is for and what criterion it teaches. In an organization, it must respond to equally concrete decisions, responsibilities and usage cycles.

The semantic model and the report must be treated as different components. The model concentrates the entities, relationships and measures that require reuse and governance. The report organizes the interaction, the context and the questions of a given audience. This separation allows one and the same base of meaning to sustain different experiences without duplicating the logic in each product —the six English pages of each dashboard are the proof— and eases evolution: a new view can be incorporated without rebuilding the fundamental definitions. On a platform like Fabric, that separation is taken further: ingestion, storage, transformation, semantics and consumption are managed as components with their own life cycle.

An analytical product also needs criteria for being updated and retired. A source may modify its structure, a definition may lose validity and a dashboard may stop answering a need. Keeping it published indefinitely can generate as much confusion as a visible error. All six declare their snapshot date and their version, 1.0.0, and their first limit is precisely that they do not update themselves.

Quality is preserved through responsibilities. The source needs monitoring. The pipeline requires controls. The model needs someone responsible for its semantics. The visualization needs review. The figures and the limits must be kept in sync with the real state of the piece. This perspective transforms the portfolio. It does not contain six independent files. It contains six analytical products that demonstrate how I organize the complete journey from the source to the interpretation.

## Data prepared for applications and agents too

<!-- seccion: datos-para-agentes -->

Prepared and governed information does not need to be used only in Power BI. It can also serve applications, automated processes and artificial intelligence agents, and on a platform like Fabric that broadening of consumers is the reason the lakehouse exists: one and the same semantic asset serving people, applications and agents.

This requires preserving a clear separation between the data, its meaning and the way it is consumed. An agent should not freely rebuild a metric whose definition already exists inside the semantic model. When a measure has been validated and governed, the intelligent solution should use that asset instead of generating an alternative interpretation. It is what I did at Vesting, where the platform existed to observe agents, and it is what the Power BI Dashboard Builder does in the showcase, a built and tested agent that creates the complete project —semantic model, preparation in Power Query M, DAX measures and visuals— and can extract data, with the same principle: the definition lives in the model, not in the prompt.

Public dashboards offer an especially useful environment to explore this integration because the sources can be audited and the definitions can be made visible. An application or an agent could query structured data, retrieve methodological documentation and produce explanations grounded in the same assets used by Power BI. And in fact it already happens on a small scale: the sheets of the six dashboards enter the index of this site's chat, with their figures and their "nevers", and the chat cites them toward the sheet.

However, broadening the consumers also increases the responsibilities. It must be established what information each component may query, what level of detail it needs, what result it is authorized to produce and how traceability will be preserved. AI-103 strengthens the building of applications and agents capable of using these assets. AI-300 extends the evaluation, observability and operation of those solutions when they begin to use data and tools in a sustained way.

The value is not in connecting a generative model to all the data. It is in building an architecture where people and intelligent solutions use consistent, authorized and verifiable information.

## What the six dashboards demonstrate

<!-- seccion: que-demuestran -->

The six dashboards demonstrate end-to-end data engineering and analytics, six times over, on sources that anyone can download and check.

They demonstrate the capacity to integrate heterogeneous structures, preserve metadata, control granularity, build dimensional models and develop measures that represent real concepts within each domain: 329 DAX measures across the six, not a single calculated column.

They demonstrate that quality must be provable. The accounting, financial, budgetary and sporting identities turn the source's rules into executable controls capable of detecting losses, duplicates and misalignments, and the controls that were seen red —three Formula 1 identities, one de-accumulation in public spending— are the ones that teach the most.

They demonstrate that coverage is part of the result. A figure does not acquire authority merely by having been calculated over millions of records. It needs to explain what universe it represents, over what periods and with what limitations.

They demonstrate that visualization must respect the evidence. The experience needs to ease understanding, hierarchy and exploration without hiding uncertainties or presenting comparisons that the sources cannot sustain.

They demonstrate my depth in Power BI, from preparation and the semantic model to measures, performance and the consumption experience. What they do not demonstrate is Fabric: that I did at a company, and it will be covered, in public, by the declared exploration of end-to-end analytics on Colombian open data.

They also demonstrate the convergence between Industrial Engineering and Industrial Design. The first allows me to understand the system, the relationships and the controls. The second forces me to turn that complexity into an understandable, responsible and usable experience.

The public pieces make verifiable a way of working that I previously applied in transport operations, logistics, banking and artificial intelligence agents. The difference is that here the sources, the decisions and the results can be examined independently, without asking permission.

I did not build these dashboards to show six different topics. I built them to demonstrate one and the same method against six universes: understand the source, model the domain, verify integrity, declare the limits and design an experience that allows using the results without exceeding the evidence.
