# Informe de discrepancias — lo publicado contra tu hoja de vida

> **Sprint 008 · fase 1 · 2026-09-12.** Contraste campo por campo entre lo que publica CV Viva
> (`data/cv.es.yaml`, `data/cv.en.yaml`, los cinco case studies) y tu hoja de vida fusionada, que
> **vive fuera del repositorio y no entra en él**. Ningún dato de contacto tuyo aparece aquí.
>
> **Nada de esto está corregido.** La orden lo dice y yo lo cumplo: entrego el informe, tú decides
> qué entra. Cada punto termina con la pregunta que tienes que responder.

---

## Lo primero: la base está sana

Contrasté los ocho roles, las tres formaciones, las cinco certificaciones, los seis logros, los
cuatro grupos de skills y los cinco case studies, en **los dos idiomas**. Las cifras coinciden
**palabra por palabra** en la inmensa mayoría: 50+ usuarios, +25% en decisiones, −35% en ETL, >90%
de precisión, +35% en predicciones, +20% de productividad, +70% en precisión y velocidad, −40% en
tareas repetitivas, +25% en indicadores del SITP, +20% de rendimiento del sistema, equipo de 20,
−25% de errores, +50% de precisión en el control, 15+ usuarios, +15% de automatización, −50% de
errores de datos, +20% en calidad por SQL, equipo de 12, 95% de satisfacción, ISO 9001:2015.

**Ninguna cifra del sitio está inventada, y ninguna contradice tu hoja de vida.** Lo que sigue son
doce diferencias, ordenadas por lo que pesa.

---

## 1. El AI-103 no existe en el sitio. En ningún lado

Tu hoja de vida fusionada declara **«Azure AI Engineer Associate — AI-103 · EN DESARROLLO»**. El
sitio publica **cinco certificaciones y ninguna en curso**: DP-600 y las cuatro de IBM. No hay una
sola mención del AI-103 — ni en `certificaciones`, ni en el perfil, ni en skills, ni en un case
study.

Esto es consecuencia directa de la revisión del 10 de septiembre: el AI-102 se retiró de todo el
contenido porque Microsoft lo descontinuó, y **nada ocupó su lugar**. La orden de este sprint pide
explícitamente orientar el contenido a «DP-600 oficial y vigente; AI-103 EN DESARROLLO», así que
hoy el sitio y la orden no dicen lo mismo.

Y hay un efecto lateral: el logro **«5 certificaciones»** se volvería «5 + 1 en curso» si el AI-103
entra, y ese número está en la HOME, en el PDF y en el chat.

> **¿Entra el AI-103 al sitio como certificación en curso? Y si entra, ¿el logro pasa a «5
> certificaciones + 1 en curso», o se queda en 5 y el AI-103 vive solo en el texto?**

## 2. Los meses desaparecieron, y con ellos el hueco de diez meses

Tu hoja de vida fecha con mes: «Julio 2021 – Mayo 2022», «Marzo 2023 – Julio 2023». El sitio fecha
**solo con año**: «2021 — 2022», «2023».

No es una mentira: los años son correctos. Pero conviene que sepas el efecto exacto. En tu hoja de
vida se ve que entre **mayo de 2022 y marzo de 2023 hay diez meses sin nada**. En el sitio, «2021 —
2022» seguido de «2023» se lee como continuo y el hueco **no se ve**.

Tú ya decidiste callar las brechas, y esto es coherente con esa decisión. Lo dejo dicho por una
sola razón: **un reclutador que tenga los dos documentos delante va a ver la diferencia**, y es
mejor que la conozcas tú primero.

> **¿Se quedan los años solos, o el sitio pasa a meses como tu hoja de vida?**

## 3. «Junior» salió del título en C&M Consorcio

| Fuente         | Título                                                         |
| -------------- | -------------------------------------------------------------- |
| Hoja de vida   | Analista de Operaciones **Junior** — C&M Consorcio 2018        |
| Sitio (ES/EN)  | Analista de Operaciones · *Operations Analyst*                 |

Es el único cambio de título que altera la **seniority declarada**. Los otros tres solo acortan
(ver el punto 4).

> **¿Vuelve el «Junior», o el título corto se queda?**

## 4. Otros tres títulos acortados (sin cambiar seniority)

| Hoja de vida                                                  | Sitio                              | Qué se fue          |
| ------------------------------------------------------------- | ---------------------------------- | ------------------- |
| Analista Senior, **Analítica y Reportes** — Banco Pichincha   | Analista Senior de Analítica       | «y Reportes»        |
| **Profesional de** Análisis Post-Operacional — C&M Consultores | Análisis Post-Operacional          | «Profesional de»    |
| Analista de Sistemas de Información **y de Proyectos** — Cafam | Analista de Sistemas de Información | «y de Proyectos»    |

> **¿Los dejamos cortos, o los devolvemos completos?**

## 5. Un número cambió de sujeto: el −35% de Banco Pichincha

| Fuente       | Qué dice                                                                    |
| ------------ | --------------------------------------------------------------------------- |
| Hoja de vida | «redujeron los tiempos de **procesamiento** en un 35%»                      |
| Sitio        | «−35% en tiempos de **análisis**» — en la trayectoria, el case study y el resumen |

La cifra es la misma; **lo que mide no**. Procesar y analizar no son lo mismo, y esta diferencia
viaja en tres sitios a la vez.

> **¿Cuál de las dos es la verdadera: procesamiento o análisis?**

## 6. Una interpretación que tu hoja de vida no hace: «modelos semánticos»

| Fuente       | Qué dice                                                                    |
| ------------ | --------------------------------------------------------------------------- |
| Hoja de vida | «centralicé y optimicé **el análisis de datos** con DAX Studio y Tabular Editor» |
| Sitio        | «Optimización de **modelos semánticos** con DAX Studio y Tabular Editor»    |

Es exactamente para lo que sirven esas dos herramientas, así que es muy probablemente cierto —
pero **lo dice el sitio, no tú**. Si alguien pregunta en la entrevista, la fuente es tu memoria, no
tu hoja de vida.

> **¿Confirmas que optimizabas modelos semánticos, o volvemos a la frase de tu hoja de vida?**

## 7. Diez herramientas de tu hoja de vida que el sitio no menciona

Tus «competencias técnicas clave» listan cosas que **no aparecen en ningún grupo de skills del
sitio**:

**SPSS · SAS · Bizagi · FlexSim · Watson Studio · RStudio · Orange Data Mining · Adobe Illustrator
· Adobe XD · redes neuronales**

Dos de ellas pesan más de lo que parece: **Bizagi y FlexSim** son la raíz industrial —modelado de
procesos y simulación—, y son justo lo que sostiene el documento «procesos y simulación» del mapa
de los 24. Hoy un visitante del sitio no tiene forma de saber que las conoces.

> **¿Cuáles de estas diez entran a skills? Mi recomendación: Bizagi, FlexSim y SPSS sí; Adobe
> Illustrator y XD probablemente no, porque tiran del perfil hacia diseño.**

## 8. Ocho cosas que el sitio dice y tu hoja de vida no

No son errores: son la ventaja del sitio. Las listo porque **tu hoja de vida se quedó atrás** y
conviene que lo veas junto.

| En el sitio                                             | En tu hoja de vida |
| -------------------------------------------------------- | ------------------ |
| «Abierto a reubicación internacional y trabajo remoto»  | no está           |
| RAG y agentes — en construcción pública                 | no está           |
| Git/GitHub · CI/CD                                      | no está           |
| NLP                                                     | no está           |
| Data storytelling · KPIs                                | no está           |
| Gobernanza y calidad de datos como skill nombrada       | está en los roles, no como competencia |
| Stakeholders C-level                                    | no está           |
| Toda la vitrina: 6 apps · 13 agentes · 7 investigaciones · 6 tableros | no está |

La primera fila importa más de lo que parece: **una de tus dos posiciones objetivo exige traslado**,
y esa frase la contesta antes de que te la pregunten. Está en el sitio y no en el documento que
mandas por correo.

## 9. El inglés: el sitio no declara nivel

Tu hoja de vida declara **«Inglés B2 – Intermedio superior»**. El sitio **no publica ningún nivel de
idioma**: no existe el campo. Lo que sí hace es estar **entero en inglés**, que es una evidencia más
fuerte que una etiqueta.

> **¿Se queda así, o el sitio declara el nivel? (Si lo declara, recuerda lo que anoté en el informe
> de complementos: el respaldo es un IELTS de 5.5 de hace doce años, por debajo de B2.)**

## 10. El IELTS cambió de estante

Tu hoja de vida lo pone bajo «Idiomas y certificados». El sitio lo pone en **Estudios**, junto a las
dos carreras, como «Curso intensivo de inglés y certificación IELTS (2013 — 2014)» — **sin el
puntaje 5.5**.

Omitir el puntaje me parece correcto y coherente con lo que decidiste. Que viva entre los estudios
universitarios es más discutible: un curso de idiomas al lado de dos pregrados de la Javeriana
cambia cómo se lee la fila.

> **¿Se queda en Estudios, o se mueve a certificaciones?**

## 11. «8+ años» es un número que nadie recalcula

El logro dice **«8+ años en datos y analítica»** y el perfil repite **«8+ años»**. Desde tu primer
empleo (agosto de 2016) han pasado **diez años y un mes**. Si la cuenta arranca cuando el trabajo se
volvió datos —Ceinfes, finales de 2017— son **casi nueve**.

Las dos lecturas son defendibles; el problema es que **el número está escrito a mano y el tiempo
sigue corriendo**. Nada en el repositorio lo recalcula ni avisa cuando caduca.

> **¿Cuál es la cuenta oficial: diez desde el primer empleo, o los años en datos? Con la respuesta
> puedo dejarlo calculado desde una fecha, y deja de envejecer solo.**

## 12. Fundación CTIC sigue sin una sola cifra — en los dos documentos

Tu rol **actual** es el único de los ocho sin un número, y lo es **igual en tu hoja de vida y en el
sitio**. Los otros siete traen porcentajes, usuarios o tamaño de equipo. No es una discrepancia: es
el mismo hueco en los dos sitios a la vez, y el lector compara.

> **¿Cuántos tableros, cuántos líderes usándolos, qué indicador se movió?** Con un solo número, el
> rol actual deja de ser el más flojo de la lista.

---

## Resumen para decidir

| #   | Qué                                    | Peso   | Necesita decisión tuya        |
| --- | -------------------------------------- | ------ | ----------------------------- |
| 1   | AI-103 ausente del sitio               | **Alto** | Sí — y afecta el logro de 5 |
| 2   | Años sin meses (y el hueco invisible)  | Medio  | Sí                            |
| 3   | «Junior» retirado                      | Medio  | Sí                            |
| 4   | Tres títulos acortados                 | Bajo   | Sí                            |
| 5   | −35%: ¿procesamiento o análisis?       | Medio  | **Sí — es una cifra**         |
| 6   | «Modelos semánticos» interpretado      | Medio  | **Sí — es una afirmación**    |
| 7   | Diez herramientas ausentes             | Medio  | Sí                            |
| 8   | Ocho cosas que solo están en el sitio  | —      | No: es a favor                |
| 9   | Nivel de inglés no publicado           | Bajo   | Sí                            |
| 10  | IELTS entre los estudios               | Bajo   | Sí                            |
| 11  | «8+ años» sin recalcular               | Medio  | Sí                            |
| 12  | CTIC sin cifras                        | **Alto** | Sí — dato que solo tienes tú |

**Nada se toca hasta que respondas.** Las respuestas de los puntos 1, 5, 6, 11 y 12 son además
fuente directa de los 24 documentos de la fase 2: mientras no lleguen, esos huecos viajan como
`[CONFIRMAR: …]` dentro de los documentos, que es exactamente lo que manda la orden.
