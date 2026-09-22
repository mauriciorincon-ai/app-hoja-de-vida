# Bitácora — El corpus vuelve a estar alineado con el sitio, y un gate para que no se desalinee solo

> Fuera de sprint. El dueño preguntó el 2026-09-21, después de mergear los PR #34 y #36:
> «¿ya hiciste una revisión detallada para que el corpus esté perfectamente alineado con los
> contenidos que tenemos en la aplicación?». La respuesta honesta era «parcialmente», y esta
> bitácora es lo que salió de mirarlo en serio. Rama `contenido/a-fondo-alineacion`.

## Por qué la respuesta era «parcialmente»

Los seis gates de coherencia derivan su verdad de los archivos con los que se pintan las páginas
y corrieron verdes, también después de fusionar `main`. Lo que ninguno cubría es **lo que el
corpus afirma sobre el sitio mismo y sobre el repositorio**: qué puede hacer el visitante, y
cuántas decisiones, sprints, jobs o fragmentos lleva esta obra. Nada deriva esas cifras, así que
nada las comparaba, y el sitio se había movido dos veces desde que el corpus se congeló: el
PR #32 (revisión post-S8 del dueño) y el PR #36 (la puerta del chat, ADR-024).

## El desfase encontrado, por si vuelve a pasar

| # | Qué decía el corpus | Qué es verdad hoy | Quién lo movió |
| - | --- | --- | --- |
| 1 | «retrieval con embeddings» es una funcionalidad votable del roadmap de CV Viva y quien visita puede votarla | CV Viva **no tiene roadmap propio**: el PR #32 retiró sus siete funcionalidades, y el roadmap votable es por app hermana | PR #32 |
| 2 | El documento del chat explica 23 aspectos de su arquitectura y **ninguno** es la puerta | Desde el PR #36 hay que dejar nombre y correo, verificar con un código y cada conversación queda registrada | PR #36 |
| 3 | «21 decisiones de arquitectura» | 24 | PR #32, #34, #36 |
| 4 | «el índice de 494 fragmentos» como estado actual | del orden de 1.400 | PR #34 |

El primero es el más caro de los cuatro: no es un dato inexacto, es una **invitación a hacer algo
que ya no se puede hacer**. El segundo es el más delicado: el sitio empezó a recoger datos
personales y el documento que explica el chat no lo contaba, así que a «¿qué hacen con mis datos?»
el chat respondía con un texto escrito cuando no había datos.

## El séptimo gate no se escribió: creció el primero

La tentación era un gate nuevo. La tercera pregunta de la regla 14 —¿puede fallar?— llevó a otro
sitio: lo que faltaba no era un gate, era **sujeto** en el que ya existe. El gate de cifras ya
sabe comparar «número + sustantivo» contra una verdad derivada, con contextos y salvedades. Solo
le faltaban las verdades del repositorio. Así que se le añadieron cuatro conceptos —decisiones de
arquitectura, sprints cerrados, jobs de integración continua y fragmentos del índice— y la verdad
se deriva de `decisions/`, de los resúmenes, de `ci.yml` y del propio builder del índice.

Dos mecanismos nuevos en el motor, cada uno porque un caso real lo exigió:

- **`contexto_previo`.** El motor solo sabía exigir contexto POR DETRÁS del número. El tamaño del
  índice se nombra por delante («el índice de 1.437 fragmentos»), y mirar solo hacia atrás
  confundía esa frase con «la recuperación de los cuatro fragmentos», que es el top-k: el mismo
  sustantivo con tres órdenes de magnitud de diferencia.
- **`hitos` y `tolerancia`.** La serie histórica del índice (28 → 226 → 494 → hoy) es parte del
  argumento del dueño y es verdad; se declara como hito con su razón en vez de borrarse. Y el
  número de hoy admite una banda del 5 %, porque se mueve con cada párrafo: exigirlo exacto haría
  el gate **circular** —corriges la cifra y corregirla la mueve—.

### El rojo (regla 14), en el mismo commit

El gate nació rojo contra el corpus tal y como estaba, sin tener que romper nada a propósito:

```
data/a-fondo/apps-pipeline.es.md · «la-fabrica-en-numeros»: dice «21 decisiones» y las
decisiones de arquitectura registradas en este repositorio son 24 (decisions/NNN-*.md).
```

Es el mejor rojo posible: cazó el defecto real que se había encontrado leyendo, no uno inventado
para la demostración. Los falsos positivos que también nombró al nacer —«24 sprints» del pipeline
entero y «cuatro fragmentos» del top-k— son los que motivaron `contexto_previo` y las salvedades,
y quedaron declarados con su razón en el fixture en vez de silenciados.

## Qué se corrigió en el corpus

Cinco auditores leyeron los 25 documentos en español enteros contra el estado real de `main`.
**Nada se recortó: los ocho documentos tocados CRECIERON**, +4.502 palabras en total, que es la
regla del dueño aplicada —se corrige la frase y se amplía con la fuente, nunca se borra—.

| Documento | Qué cambió |
| --- | --- |
| `rag-y-el-chat` | 24 cambios, el más tocado. La invitación a votar los embeddings; las cifras del índice con su serie histórica; 600 → 700 tokens; la puerta entra como cuarta defensa de la lista; y la frase que afirmaba que el chat nunca guarda la pregunta ni la respuesta. **Cinco subsecciones nuevas**: por qué pide nombre y correo, el código de seis dígitos, qué datos guarda y quién los lee, por qué responde en dos o tres párrafos, y el banco como auditoría de vocabulario |
| `plataforma-y-despliegue` | **Tres subsecciones nuevas** de infraestructura: la base de datos del sitio con seguridad a nivel de fila, las dos tablas de la puerta, y el código por Resend con la cookie firmada. Además, gitleaks estaba descrito como job de integración continua y en este repositorio es enganche de pre-commit |
| `gobierno-de-datos-y-de-ia` | **Tres subsecciones nuevas** sobre los primeros datos personales que recoge el sitio. Y una corrección de fondo: afirmaba que el chat no persiste texto libre de un modelo, y desde ayer sí lo archiva; se conserva el principio y se precisa la regla que sigue vigente |
| `apps-pipeline` | El roadmap propio retirado; 21 → 25 decisiones de arquitectura; los dos formularios y a qué frentes llega la lista de espera; el chat con puerta. **Una subsección nueva** de cero enlaces y formularios |
| `lo-que-busco` | Cerraba invitando a «el formulario de contacto» y hoy hay dos con propósitos distintos |
| `como-aprendo` | El AI-103 y el AI-300 ganan «en curso» donde se nombraban sueltos: citados por el chat podían leerse como obtenidos |
| `agentes-en-produccion` | La telemetría del chat, que ahora guarda una fila entera por respuesta |
| `procesos-y-simulacion` | Los estudios de Diseño Industrial son de 2011 a 2016, no de 2009 a 2016 |
| `cafam` y `cm-operaciones` | El `cuando_usar` del frontmatter contradecía las fechas del propio título, en los dos idiomas |

Sin cambios, verificados uno a uno contra la verdad del sitio: los otros dieciséis.

**Un error de un auditor, cazado al revisar.** Uno cambió «136 preguntas de afuera» por 154,
sumando al banco las 15 ajenas —que el chat debe RECHAZAR— y los 3 huecos declarados. Revertido:
son 136.

**Dos cosas que se arreglaron en el frontmatter**, que no es decoración: `resumen` y
`cuando_usar` son el primer fragmento que el chat cita. El del documento del chat anunciaba «48
preguntas propias y 131 de afuera» cuando son 75 y 136, y no mencionaba la puerta ni la
privacidad, así que una pregunta sobre datos personales no tenía por dónde llegar. Ahora sí, y
el documento lleva dos preguntas de prueba nuevas que el golden ejercita.

## Los gemelos en inglés

Traducidos del español ya cerrado, sin nada nuevo nacido en inglés: doce subsecciones completas
y diecinueve correcciones en su sitio. Los identificadores de subsección van en español en los
dos idiomas, porque la paridad se mide por ellos; los títulos sí se traducen y cargan las
palabras con las que alguien preguntaría en inglés, que es un índice léxico independiente.

Dos cosas que salieron de traducir:

- **El estilo de fecha se había bifurcado.** Las traducciones nuevas escribían «21 September
  2026» y el corpus inglés venía usando «July 2, 2026» en seis sitios. Unificado al estilo del
  corpus.
- **El gate de densidad solo miraba el español.** Contar palabras y exigir un dato concreto no
  depende del idioma, y el troceo en ventanas de 180 palabras es el mismo para los dos índices,
  así que dejarlo fuera era vigilar medio corpus. Al extenderlo aparecieron cuatro subsecciones
  inglesas que llevaban meses entre 401 y 403 palabras. Ajustadas, y el gate se queda.

## Una pregunta del banco que se cayó, y por qué no se arregló aflojando

Al crecer el índice inglés de 1.426 a 1.457 fragmentos, «How does he control the quality of what
his agents produce with Claude Code?» dejó de traer su fuente en el top-4: las subsecciones
nuevas sobre la puerta competían con ella. La regla del dueño es que el banco se arregla en el
CONTENIDO, nunca bajando el listón, y que la palabra de afuera va en el TÍTULO de la subsección,
que pesa doble. El título pasó a nombrar a Claude Code y la calidad —en los dos idiomas, para que
los gemelos no se separen— y la pregunta volvió.

## Verificación

| Verificación | Resultado |
| --- | --- |
| `pnpm test` | **1.233 verdes** en 42 archivos |
| `pnpm typecheck` · `pnpm lint` | limpios |
| `pnpm build` | **1.467 fragmentos en español · 1.457 en inglés**, 25 de 25 aprobados |
| Banco de preguntas de afuera | 136/136 en los dos idiomas |
| Golden (preguntas propias) | 77 por idioma, todas con su fuente en el top-4 |
| Gates de coherencia | 28 pruebas verdes, incluidos los cuatro conceptos nuevos y la densidad del inglés |
| e2e `chat.spec.ts` + `axe.spec.ts` | **208 verdes** (escritorio y móvil), axe AA con el panel abierto |
| Paridad ES/EN | sana en los 25 documentos, subsección a subsección |
| Barrido cero enlaces tras el último `git add` | limpio |
| Prosa del dueño | **+4.502 palabras**; ningún documento perdió ni una |

## La CI se colgó dos veces, y el arreglo no estaba en el contenido

El primer empujón de esta rama dejó `e2e` e `integration` mudos **59 y 24 minutos**, sin una línea
de salida, hasta que hubo que cancelarlos a mano. Lo normal en estos dos trabajos son 2 a 5
minutos. Las dos veces la corrida se detuvo en el mismo punto: 314 de 360 puntos impresos.

Sospechar del corpus era lo natural —es lo único que cambió— y era falso. Lo que hizo falta
primero fue **que la cuelga hablara**, porque ningún trabajo tenía tope: GitHub los habría dejado
correr hasta su límite de seis horas sin decir jamás qué se quedó a medias.

**Primer commit, que son gates nuevos:** `timeout-minutes` en los cuatro trabajos (quality 20,
e2e 25, integration 25, lighthouse 30 — ninguno tenía uno), y en Playwright un `globalTimeout` de
15 minutos más el reportero `line`, que imprime el resumen y **nombra** lo que no terminó.

**El rojo, observado en la CI y no simulado** (regla 14, primera pregunta). En la corrida de
`8b6a399` los dos trabajos **fallaron en 15 minutos en vez de colgarse**, y al fallar dijeron
exactamente lo que faltaba saber:

```
349 passed (15.0m)
Timed out waiting 900s for the teardown for plugin setup to run
```

Las 349 pruebas **pasaron**, en 3 min 41 s. Lo colgado era el **apagado**, después de la última
prueba. Y la prueba decisiva de que el contenido no tenía nada que ver la dio el trabajo vecino:
`integration` corre solo las **diez pruebas de votación**, que esta rama no toca, las pasó en
cinco segundos y se colgó idéntico.

**Segundo commit, las dos causas reales**, ambas en `playwright.config.ts`:

1. **La espera del apagado no tenía fin.** Playwright pedía el cierre del servidor y esperaba para
   siempre. Ahora se pide con `SIGTERM` y, si en diez segundos no se fue, se mata:
   `gracefulShutdown: { signal: "SIGTERM", timeout: 10_000 }`.
2. **Había un proceso de más en medio.** El servidor se arrancaba con `pnpm start`, que mete a pnpm
   entre Playwright y `next`: al matar al hijo quedaba vivo el nieto. GitHub lo venía delatando al
   final de **cada** trabajo, y nadie lo leía: «Terminate orphan process: next-server». Ahora se
   arranca el binario directo, `./node_modules/.bin/next start`, y lo que Playwright mata **es** el
   servidor.

Verificado en local antes de empujar: tras una corrida en modo CI no sobrevive ni un `next-server`.
Y verificado en la CI después: `e2e` e `integration` en verde, con conclusión propia.

**Honestidad sobre los topes nuevos:** el que disparó fue el de Playwright. Los `timeout-minutes`
de los cuatro trabajos **no llegaron a usarse** —los trabajos fallaron antes— y siguen sin haberse
visto fallar. Quedan como red de seguridad del piso de arriba, declarada aquí sin histórico.

### Lighthouse: un rojo de 2,8 milisegundos que no era de esta rama

En la misma corrida cayó `lighthouse`: el *Time to Interactive* de `/es/vitrina/tableros` dio
**4.002,79 ms contra un tope de 4.000** — 0,07 % por encima, con las tres corridas rozando la
línea (4.047 / 4.031 / 4.003).

No lo causó este trabajo, y se puede demostrar sin re-correr nada:
`git diff --name-only origin/main...HEAD` no toca **ni un archivo** de `src/`, de `public/` ni de
los datos que se publican; esa página se sirve igual que en `main`. Y el corpus no puede llegar
hasta ahí: el panel del chat se monta con `dynamic` **solo al hacer clic** y el índice se descarga
dentro del panel, así que Lighthouse —que nunca lo abre— jamás lo pide.

Relanzado el **mismo commit**, pasó. Era lentitud del runner sobre una página que ya vivía en el
filo. **No se tocó el presupuesto:** aflojar el número por detrás para que un rojo se calle es
justo lo que la regla 14 persigue. Queda anotado abajo como decisión del dueño.

## Lo que queda para el dueño

- La **f8** nueva de la guía: preguntarle al chat, con el proveedor real, por qué pide el correo,
  qué datos guarda y cómo pedir que los borren. Es juicio humano sobre si la respuesta dice la
  verdad de lo que hoy hace el sitio o suena a política de privacidad genérica.
- Una **observación, no un defecto**: el corpus usa los títulos completos de la hoja de vida
  («Analista de Sistemas de Información y de Proyectos», «Analista de Operaciones Junior»,
  «Profesional de Análisis Post-Operacional») y el sitio los abrevia en los tres casos. Los dos
  son ciertos y el patrón es consistente, así que no se tocó nada: igualarlos es decisión suya, y
  en cualquiera de las dos direcciones.
- **El presupuesto de rendimiento vive en el filo, y es decisión suya.** `/es/vitrina/tableros`
  marcó 4.047 / 4.031 / 4.003 ms de *Time to Interactive* contra un tope de 4.000. Relanzado el
  mismo commit pasó, así que hoy es una moneda al aire: **cualquier PR futuro puede caer por esto
  sin que nadie haya roto nada**, y un gate que falla al azar enseña a ignorar los rojos. Las
  salidas son dos y ninguna es tocar el número a escondidas: hacer más liviana esa página —es la
  más pesada de las quince— o subir el tope con una razón escrita y su fecha. No se hizo aquí
  porque esta rama no toca esa página y el arreglo merece su propio trabajo.
