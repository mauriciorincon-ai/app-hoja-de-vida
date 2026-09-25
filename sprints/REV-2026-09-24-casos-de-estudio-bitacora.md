# Revisión 2026-09-24 — Los ocho casos de estudio y el aviso de la puerta

> Bitácora de una revisión pedida por el dueño, sin orden de la planeadora. Rama
> `revision/casos-de-estudio-y-logros`, un PR.

## Lo que pidió el dueño, textual

Con el chip de la cita ya en producción, dos cosas:

1. _«Cuando vaya a pedir el código, donde dice pedir otro código, también debería haber una
   opción para decir o reportar que hay un problema.»_
2. _«Esto sí me parece gravísimo, porque te dije que cuando termináramos a fondo deberías crear
   el caso de estudio para Analista de Operaciones, Coordinador de Operaciones e Ingeniero de
   Procesos, y además los logros deberían complementarse. Y adicional, por ejemplo, el caso de
   estudio de Vesting súper simple tal cual como lo teníamos después de hacer semejante esfuerzo
   con los documentos de a fondo […] complementa adecuadamente los contenidos siempre
   manteniendo minimalismo y elegancia […] mantén un estilo muy profesional pero impactante a la
   vista.»_

## Lo que se verificó antes de construir

**El pedido existía y quedó sin cumplir.** El 2026-09-13, en el bloque C del gate ⭐, el dueño
preguntó si se podían construir los casos de C&M Consorcio, Ceinfes e Inglopres y qué hacía
falta. La respuesta de entonces los ató a terminar el corpus a fondo. El corpus se terminó y
aprobó el 2026-09-20/21 y los casos no se retomaron. **El error es mío, no del método:** nada
en el repo recordaba el compromiso, y ahora lo recuerda un test (abajo, gate 1).

**Los cinco casos existentes eran cuatro listas** —contexto, reto, `acciones[]`, `impacto[]`—,
escritas en el S2, antes de que existiera un corpus de ~148 mil palabras por idioma sobre esas
mismas experiencias.

## Qué se construyó

| Pieza                                   | Qué hace                                                                                                                                                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Esquema `casestudy` (ADR-009 enmendado) | Exige `titular`, 3–4 `cifras`, 3–6 `capitulos`, `impacto` y `leccion`; `acciones` desaparece. La forma delgada ya no compila                                                                                             |
| Tres casos nuevos                       | C&M Consorcio (`cm-operaciones`), Ceinfes, Inglopres, en ES y EN, desde sus documentos a fondo aprobados                                                                                                                 |
| Cinco casos enriquecidos                | Vesting, Banco Pichincha, C&M Consultores, Cafam y Fundación CTIC ganan tesis, cifras, capítulos y lección; su contexto, reto e impacto, que el dueño ya había aprobado, **no se tocaron**                               |
| Página del caso                         | Siete tiempos: rol + tesis, banda de cifras (`Counter`), contexto y reto lado a lado, «Cómo lo hice» numerado, impacto, «Lo que me llevo», casos vecinos                                                                 |
| `src/lib/casos.ts`                      | Motor puro: hito del caso, vecinos en orden de trayectoria, nombre corto (gemelo del de `scripts/destinos.mjs`, con test de igualdad)                                                                                    |
| Trayectoria                             | Los tres hitos ganan `proyecto:`; los ocho llevan 4–6 logros con las cifras del corpus                                                                                                                                   |
| Logros de la HOME                       | +2: 27 agentes (Vesting) y 42 productos analíticos (CTIC). Ocho, en cuatro columnas                                                                                                                                      |
| Índice del chat                         | Un fragmento por caso (tesis, contexto, reto, cifras, impacto, lección) y uno por capítulo; los tres documentos a fondo citan ahora su caso                                                                              |
| «¿Algo no funciona? Avísame»            | En la puerta del chat, bajo «Pedir otro código» (y en el primer paso si algo falló). `POST /api/chat/problema` → correo al dueño con respuesta al visitante y el **diagnóstico de la puerta** (secreto, almacén, correo) |
| PDF                                     | Vuelve a dos páginas y cuenta cada experiencia una vez: ningún caso se repite como «Proyecto», y cada cifra de un caso está en los logros de su experiencia                                                              |

## Regla 14 — cada gate nuevo, en rojo en este mismo PR

¿Lo vi fallar? Abajo. ¿Lo vi correr? En `pnpm test` y en el e2e completo. ¿Puede fallar? Cada
uno tiene un estado del repo que ninguna regla anterior atrapa: el esquema no sabe qué dice el
corpus, ni cuántos hitos hay, ni cuántas páginas mide el PDF.

**0. El esquema endurecido**, contra el contenido de `main` (los cinco casos delgados):

```
Error: Contenido inválido en data/cv.es.yaml:
  - proyectos.0.casestudy.titular: Invalid input: expected string, received undefined
  - proyectos.0.casestudy.cifras: Invalid input: expected array, received undefined
  - proyectos.0.casestudy.capitulos: Invalid input: expected array, received undefined
  - proyectos.0.casestudy.leccion: Invalid input: expected string, received undefined
  … (los cinco proyectos, los cuatro campos cada uno)
```

**1. Un hito sin caso** (Inglopres pierde su `proyecto:`):

```
× cada hito de la trayectoria tiene su caso de estudio
AssertionError: Hitos sin caso de estudio (el dueño los pidió el 2026-09-13):
+ [ "2016 — 2017 · Ingeniero de Procesos · Inglopres" ]
```

**2. Una cifra que el corpus no dice** (95 % → 97 % en Inglopres):

```
× cada cifra de un caso sale de su documento a fondo
+ inglopres: la cifra 97% «de satisfacción del cliente» no aparece en data/a-fondo/inglopres.es.md
  — una cifra que el corpus aprobado no dice es una cifra inventada.
```

(La misma mutación dispara también la paridad, porque el inglés seguía diciendo 95.)

**3. Minimalismo.** No hizo falta mutar nada: en la primera corrida el gate cazó **dos títulos
míos** de nueve palabras («De la memoria de una persona a una regla», «Medir el trabajo sin
castigar a quien lo hace»). Se acortaron a siete y seis.

**4. Paridad ES/EN** (el inglés cuenta 26 agentes en vez de 27):

```
× ES y EN cuentan el mismo caso: mismos valores y mismo número de capítulos
```

**5. La ruta del aviso**, antes de existir:

```
FAIL tests/integration/chat-problema-route.test.ts
Error: Cannot find package '@/app/api/chat/problema/route'
```

Con la ruta: 6/6 (flujo feliz con diagnóstico, puerta rota sin secreto, honeypot, correo
inválido y detalle largo, cuarto aviso de la misma IP, proveedor caído).

**6. El PDF en dos páginas** (sin el filtro de destacados, con los ocho proyectos):

```
× cabe en dos páginas, en los dos idiomas
AssertionError: el PDF es tiene 3 páginas: expected 3 to be less than or equal to 2
```

## Hallazgos durante la construcción

**El PDF había pasado a tres páginas, y ninguna prueba lo sabía.** Medido con `pdftotext`: la
tercera página era entera la sección «Proyectos», que repetía palabra por palabra las cifras de
los logros de cada experiencia. Primera decisión: listar solo los `destacado: true` (Vesting), y
una prueba nueva cuenta las páginas.

**El dueño fijó el criterio, y la primera decisión no lo cumplía.** Sus palabras: _«lo
importante es que no repita claramente, pero también que no vaya a dejar por fuera ninguna de
mis experiencias y logros más importantes»_. Releído el PDF con eso delante:

- **Repetía:** Vesting salía dos veces, en su experiencia y otra vez como único «Proyecto», con
  las mismas frases (Fabric desde cero, la gobernanza, el monitoreo, el proceso core).
- **Dejaba por fuera** cifras que el sitio destaca en la banda de un caso y que los logros de su
  experiencia no decían: las **unas 120 unidades** del parque de Inglopres (y qué hacía la
  empresa: alquiler y venta de maquinaria pesada) y las **cinco fuentes** que cruzaba C&M
  Consorcio, en los dos idiomas. El resumen de Ceinfes decía también para qué eran los colegios
  (simulacros de pruebas), y el logro no.

Se corrigió en su raíz: **«Proyectos» lista solo lo que no es ya una experiencia** (un proyecto
cuyo `slug` no es el `proyecto:` de ningún hito). Hoy no hay ninguno, así que la sección no se
pinta. Lo que solo decía un resumen de proyecto pasó a los logros de su hito (Inglopres,
C&M Consorcio y Ceinfes, ES y EN). Lo único que no pasó es la frase de posicionamiento del
resumen de Vesting («el puente exacto entre la ingeniería de analítica y la de IA»), que no es
un logro y que el perfil ya cuenta. `destacado` vuelve a no leerlo nadie en el PDF.

**Una falsa alarma mía, para que conste:** el primer sondeo marcó también los «diez meses» de
TransMilenio en inglés; estaban (_ten months_), y el sondeo no sabía leer números en letras en
inglés. La prueba sí sabe.

Tres rojos, en este mismo commit:

**7. Una cifra de caso que su experiencia calla** (los logros de antes de este ajuste, `HEAD`):

```
× cada cifra de un caso está también en los logros de su experiencia (ES y EN)
+ cm-operaciones (es): la cifra 5 «fuentes cruzadas para reconstruir la operación» no está en los
  logros de su experiencia (data/cv.es.yaml, trayectoria), así que el PDF la deja por fuera.
+ inglopres (es): la cifra ~120 «unidades de maquinaria en el parque» no está en los logros […]
+ cm-operaciones (en) … + inglopres (en) …
```

**8. Un PDF que recorta logros para caber** (`rol.bullets.slice(0, 3)` en el generador):

```
× no deja nada por fuera: cada experiencia y cada uno de sus logros está en el PDF
+ es · Fundación CTIC: «Tableros de control por procesos y planes de mejora: […]»
+ es · Vesting — startup de agentes de automatización: «Documenté el proceso core replicable […]»
```

La prueba de dos páginas no lo habría visto: recortar es justo la forma fácil de caber.

**9. Un caso contado dos veces** (vuelve el filtro de `destacado`):

```
× no repite: ningún caso de estudio vuelve a contarse como proyecto
AssertionError: el PDF es cuenta dos veces estas experiencias
+   "Plataforma de datos para agentes de IA",
```

Tampoco lo ve la de dos páginas: con Vesting repetido, el PDF cabe. Hallazgo de la prueba
misma: pdfkit parte «cross-referencing» en el guion al final del renglón y el extractor lo
devuelve como «crossreferencing»; la comparación ignora guiones y saltos, que son maquetación.

**El filtro de temas del chat se aflojó con el contenido nuevo, y está previsto que así sea.**
Dos preguntas ajenas que la prueba exigía bloquear con el índice de solo-YAML ahora pasan,
medido:

| Pregunta ajena                                     | Puntaje | Qué casa                                                        |
| -------------------------------------------------- | ------: | --------------------------------------------------------------- |
| «hazme la tarea de cálculo integral»               |    6,43 | «tarea» (Inglopres, cap. 5) · «cálculo» (C&M Consorcio, cap. 1) |
| «escribe una función en rust que ordene una lista» |    4,92 | «función» (lección de Banco Pichincha)                          |

`guardrails.ts` documenta desde el S8 que el filtro solo garantiza bloquear preguntas sin **un
solo** término del corpus y que se debilita a medida que el corpus crece; con el corpus
completo, la segunda ya pasaba y hay un test que lo declara. No se tocó el umbral ni se
reescribió el contenido para esquivar palabras: las dos pasaron al test de «lo que este
guardrail NO garantiza» y entraron dos ajenas sin vocabulario común (un pastel de chocolate,
una traducción al francés) para que la lista no se encogiera. Lo que detiene a esas preguntas es
el prompt grounding-only.

**La prueba de conservación de la historia retirada** exigía que las 12 secciones del esqueleto
del S3 conservaran su destino. Tres lo cambian con razón: de `#trayectoria` a su propio caso. La
prueba admite ahora ese salto y ningún otro.

**El banco de preguntas mejoró solo:** respuestas acertadas de primera, de 106 a 107 (79 %).
El índice creció de 1.467 a 1.513 fragmentos en español, dentro de la tolerancia del 5 % de la
cifra que el corpus declara.

**La guía tenía un defecto propio:** la f8 mostraba «⭐ mínimo» pero su casilla no llevaba el
atributo, así que el filtro del gate mínimo no la enseñaba, y el encabezado decía 31 pruebas
cuando ya eran 34. Ahora son 36 y coinciden texto, estrellas y filtro.

## Decisiones de contenido que el dueño debe juzgar (gate ⭐ c3)

- **Qué cifras van al frente de cada caso.** Todas están en su documento a fondo (lo exige un
  test); cuáles son las más elocuentes es juicio suyo.
- **La lección de cada caso es una frase suya**, tomada del cierre de su documento a fondo; en
  C&M Consorcio es una condensación de dos frases del mismo párrafo.
- **Inglopres muestra el «del orden de un 20 %» de eficiencia con su salvedad** («estimación
  hecha hoy»), tal como la escribió en el corpus; no va a la banda de cifras.
- **Ceinfes:** el logro de la trayectoria decía «KPIs de logística, **RRHH** y digitalización»;
  el corpus aprobado dice programación, logística y digitalización. Se alineó al corpus.
- **Los títulos de los tres casos nuevos** siguen la forma de los existentes («Qué se hizo —
  Dónde (cuándo)»): «Supervisar una ciudad con datos», «Dirigir una operación con
  indicadores», «Construir el dato que nadie tenía».

## Verificación

| Qué                              | Resultado                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `pnpm test` (unit + integración) | 44 archivos, 1.270 pruebas verdes |
| e2e completo (chromium + móvil)  | 383 pasan, 11 saltos condicionales ya existentes, 0 fallas                        |
| axe                              | los 16 casos (8 × 2 idiomas) sin violaciones                                      |
| typecheck · lint                 | limpios                                                                           |
| PDF                              | 2 páginas ES · 2 EN; cada experiencia una vez, con todos sus logros               |
| Capturas revisadas               | Vesting escritorio y móvil, Inglopres, C&M Consorcio en inglés, logros de la HOME |

## Lo que queda para el dueño

- Gate ⭐ de la guía v9.5: **c3** (juicio de los ocho casos), **c4** (juicio visual), **f9**
  (el aviso de problema en producción, con el correo real) y **d1** (el PDF en dos páginas).
- El periodo de Vesting: el sitio y el PDF dicen «2024»; los meses que el dueño confirmó el
  2026-09-19 (`tests/fixtures/cargos-a-fondo.yaml`) son agosto de 2023 a enero de 2025, y el
  título del caso ya dice «2023–2025». No se tocó: es su decisión cómo publicar sus fechas.
