# Bitácora — reescritura del corpus «a fondo» (v2)

> PR de contenido sin sprint (canal de contenido, CLAUDE.md). Rama `contenido/a-fondo-v2`
> desde `main`. El plan, las preguntas, las respuestas del dueño y los cuatro informes de
> auditoría viven FUERA del repo (`~/Documents/hoja-de-vida-henry/a-fondo-auditoria/`): citan
> datos que todavía no se decidió publicar. Aquí queda lo que el repo puede contar: qué se
> cambió, qué gate nació, en qué paso salió rojo y a quién nombró.

---

## F0 — Preparación

**Qué se hizo.** Se copiaron a `data/a-fondo/` los 24 documentos que el dueño reescribió entre
el 2026-09-12 y el 2026-09-19 (de 14.268 a ~100.000 palabras). Siguen todos en
`estado: borrador`: el índice del chat no los ve y no se les exige gemelo en inglés.

**Arreglo mecánico, y solo mecánico.** Un barrido sobre los 24 —frontmatter, ids de subsección,
títulos, llaves y backticks sueltos, encabezados de tercer nivel, bloques de código sin cerrar y
párrafos repetidos dentro del mismo documento— encontró seis defectos en cinco archivos:

| Archivo                     | Defecto                                                                     | Arreglo                                                                    |
| --------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `certificaciones.es.md`     | el id `el-dp-600` y su título, tres veces: dos encabezados sin cuerpo        | se borran los dos vacíos; queda el que tiene la prosa                      |
| `cm-operaciones.es.md`      | una llave `}` suelta en su propia línea, dentro de `tableros-e-informes`     | se borra la línea                                                          |
| `fundacion-ctic.es.md`      | un backtick suelto en su propia línea, al cierre de `gobierno-institucional` | se borra la línea                                                          |
| `como-trabajo.es.md`        | el párrafo «El segundo criterio…» pegado dos veces seguidas                  | se borra la segunda copia                                                  |
| `vesting.es.md`             | el párrafo «La interacción entre las personas y el agente…» en dos secciones | se borra la copia de `monitoreo-de-agentes`; queda la de `el-proceso-core` |

Ningún cambio de contenido: ni una cifra, ni una fecha, ni una frase reescrita. Eso es F2.

**Aduana, después del arreglo:** `tests/unit/a-fondo.test.ts` y `a-fondo-contenido.test.ts`,
**174 pasando**. Antes del arreglo, las dos suites caían en el mismo sitio —el id duplicado
`el-dp-600`— porque el parser lanza en el primer defecto y no llega a ver el resto: por eso el
barrido corrió como script aparte, fuera del test, antes de tocar nada.

### Medición base: el corpus revisado contra el buscador de hoy

Sin recalibrar nada, con los 24 simulados como aprobados (`simularAprobacion`):

| Medida                                    | `main` (originales) | Revisados (F0) | Umbral del gate |
| ----------------------------------------- | ------------------: | -------------: | --------------- |
| Palabras                                  |              14.268 |        100.399 | —               |
| Documentos                                |                  24 |             24 | —               |
| Golden set (cada doc contesta lo suyo)    |                 4/4 |     **5 rojos** | 100 %           |
| Banco de preguntas, fuente en el top-4    |             131/131 |    **27 rojos** | 131/131         |
| Banco, primera fuente acertada            |            ≥ 60 %   | **58 % (76/131)** | ≥ 60 %        |
| Ajenas bloqueadas por el guardrail        |                 9/9 |      **7 de 9** | 9/9             |

Las dos ajenas que el corpus grande deja pasar son «¿va a llover mañana en Madrid?» y «¿cuál es
la receta del ajiaco?». No es que el guardrail se haya aflojado: el umbral `UMBRAL_ON_TOPIC = 1`
está calibrado contra 28 fragmentos, y con ~620 la puntuación léxica de cualquier pregunta sube.
Es el riesgo nº 2 del plan del S8, cobrado. Se recalibra **midiendo**, en F4, no antes.

Los cinco documentos que ya no contestan su propia pregunta de prueba: `analitica-predictiva`
(«¿Qué herramientas de machine learning usa?»), `bi-que-se-adopta`, `como-trabajo`,
`lo-que-busco` («¿Está abierto a reubicarse o a trabajo remoto?») y `vesting` («¿Qué es el
proceso core replicable de agentes?»). Es la misma causa que los 27 del banco: la prosa creció y
las palabras concretas con las que alguien pregunta —herramienta, ciudad, cifra— se diluyeron.

**El índice publicado no se movió:** 28 fragmentos, «0 de 24 documentos aprobados e indexados».
Todo el corpus sigue en borrador y el sitio en `main` responde exactamente igual que antes.

