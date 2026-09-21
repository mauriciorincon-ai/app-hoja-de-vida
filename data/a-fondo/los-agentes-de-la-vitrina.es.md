---
slug: los-agentes-de-la-vitrina
titulo: "Los trece agentes de la vitrina"
resumen: "Los 13 agentes publicados, uno a uno, en cuatro familias: qué promete cada uno, su cifra medida, su límite y su «nunca». Cinco sellados. Todos con gates humanos, carnadas que demuestran que los controles disparan, cero costo en herramientas y la misma regla: ninguna afirmación sale de la memoria del modelo."
cuando_usar: "Úsalo cuando pregunten qué agentes tiene publicados en su portafolio, para qué sirve cada uno de los trece agentes de la vitrina, qué es un harness, cómo controla la calidad con gates humanos y carnadas, y qué comparten los trece."
estado: aprobado
ancla: "/vitrina/agentes"
actualizado: 2026-09-21
preguntas_de_prueba:
  - "¿Qué son los trece agentes de la vitrina y qué no son?"
  - "¿Qué comparten los trece agentes de la vitrina?"
  - "¿Cómo producen piezas los agentes con gates humanos?"
---

<!--
⚠ PRIVACIDAD — LEE ESTO ANTES DE ESCRIBIR ⚠
Este repositorio es público y el chat cita este contenido a cualquier visitante.
NO escribas: datos confidenciales de empleadores o clientes, salarios, nombres
de terceros que no hayan aceptado aparecer, direcciones, teléfonos, correos ni
información personal sensible. La aduana del build caza lo mecánico (correos,
teléfonos, documentos, direcciones web); los NOMBRES PROPIOS no los caza un
regex — esos los decides tú.

CÓMO SE ESCRIBE ESTE ARCHIVO
- Prosa normal, en primera persona, en párrafos.
- Cada subsección empieza con un título `##` seguido de un comentario
  `<!-- seccion: id -->`. Esas son las ÚNICAS 2 marcas.
- `estado: borrador` → el chat NO lo indexa y no se le exige gemelo en inglés.
  `estado: aprobado` → el chat lo indexa y exige el gemelo `.en.md` completo,
  subsección por subsección.
- Ninguna cifra, fecha ni logro sin fuente. Lo que falte va como
  `[CONFIRMAR: qué falta]`, jamás relleno plausible.
- Guía completa: docs/MANUAL-DE-USO.md → «Cómo alimentar el a fondo».
-->

## Qué son y qué no son

<!-- seccion: que-son -->

La vitrina publica **13 agentes**, cada uno con su ficha técnica: promesa, cifras con procedencia,
límites, «nunca» y el proceso dibujado. Son sistemas de trabajo que corren sobre **Claude Code**
dentro de un **harness** —el envoltorio que le fija al agente su función, sus fuentes, sus
herramientas y su contrato de entrada y salida—, y todos pertenecen a **ARKHÉ**, mi ecosistema
agéntico, que está explicado en el documento de agentes.

**Cinco están sellados** —Constructor de Tableros Power BI, Presentaciones CINE, Fábrica de
AI-APPs, Taller de Animación y Harness Paper Computacional— y ocho siguen en estado inicial. Lo
que no son: servicios con usuarios. Son herramientas de uso personal con entregables y evidencia;
la palabra «producción» la reservo para los 27 agentes de Vesting.

## Aprender y buscar trabajo con fuente

<!-- seccion: aprendizaje -->

| Agente                   | Estado  | Qué promete                                                                                           | Cifra medida                       |
| ------------------------ | ------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Super guía AI-103**    | inicial | ninguna guía existe hasta que un mapa demuestre que la ruta cubre el temario oficial en proporción a sus pesos | 29 criterios binarios; 0 recursos Azure creados |
| **Asistente de posgrado**| inicial | cada ficha cita curso, sesión y marca de tiempo, o declara el vacío; toda cita se genera desde CSL-JSON, jamás se redacta | 50 criterios; 9 de 9 carnadas disparan; transcribe a 19 veces el tiempo real |
| **Hiring Copilot**       | inicial | cada afirmación enviable enlaza un logro con su fuente y un programa lo comprueba: el bullet huérfano hace fallar el control | 99 criterios; 8 de 9 controles con carnada |

La Super guía no ejecuta nada en Azure: propone los comandos y los corres tú, porque ejecutar es
el aprendizaje. El Asistente prepara y no suplanta: no escribe los entregables evaluables del
estudiante. Hiring Copilot entrena antes de la entrevista y nunca asiste durante una real, no
inserta texto oculto en un documento y nunca revela el ingreso actual en una pieza de negociación.

## Conocimiento con fuente, vigencia y vacío declarado

<!-- seccion: conocimiento -->

| Agente                           | Estado  | Qué promete                                                                                  | Cifra medida                           |
| -------------------------------- | ------- | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Experto ISO 42001**            | inicial | cada afirmación normativa cita apartado y página o declara el vacío, y estampa la fecha en que se verificó vigente | 38 controles del Anexo A en el corpus; 24 documentos que pide un auditor |
| **Experto Fiscal**               | inicial | ninguna cifra fiscal sale de la memoria del modelo: sale de un corpus de reglas con artículo, fuente, vigencia y confianza | **150 reglas** citables; 17 ADR |
| **Biblioteca de Tendencias GenAI** | inicial | nada entra sin la palabra del curador; nada envejece en silencio: fichas con aristas tipadas y sello de frescura | 59 fichas bilingües; 265 relaciones tipadas |

El Experto ISO 42001 dictamina gestión, no certifica: eso es de un organismo acreditado; y nunca
reproduce el texto de la norma, parafrasea y remite. El Experto Fiscal cubre Colombia y la DIAN, y
una sugerencia sin su regla citada no se emite, ni con advertencia; presentar ante la DIAN es un
acto personal del usuario. La Biblioteca solo cita fuentes primarias, nunca prensa ni
agregadores, y no rodea un bloqueo ni un muro de pago: lo reporta y sigue.

## Producir piezas con gates humanos

<!-- seccion: produccion-de-piezas -->

| Agente                              | Estado  | Qué promete                                                                                       | Cifra medida                              |
| ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Constructor de Tableros Power BI**| sellado | de un texto de requerimientos a un tablero que ya pasó su prueba: escribe el reporte en el JSON nativo de Power BI y nunca toca el modelo a mano | 20 criterios; 5 gates humanos; 33 dashboards de referencia |
| **Presentaciones CINE**             | sellado | cada animación apunta a un mensaje del guion o se corta; quien firma que se siente cinematográfica es una persona en aparatos reales | 24 escenas; 206 comprobaciones de regresión; 15 ADR |
| **Taller de Animación**             | sellado | que la técnica número 15 cueste lo mismo que la número 4: tras cada alta, el diff sobre el núcleo tiene que quedar vacío | 33 criterios; 11 ADR; 6 componentes por técnica |
| **Atracción en Frío**               | inicial | «en frío» es la audiencia, nunca el contacto: no tiene modo de contacto en frío porque la ley colombiana lo volvió capacidad inexistente | 8 comandos; 6 gates; 19 ítems de checklist |

El Constructor no cierra una corrida sin DAX en verde, validador limpio y render aprobado por una
persona, y no publica al servicio en la nube: entrega un proyecto local versionado. CINE y el
Taller no pueden ver una animación corriendo: el juicio estético es siempre de una persona, y el
Taller nunca enciende la GPU sin guion aprobado ni termina una sesión con el pod encendido.
Atracción en Frío nunca contacta a nadie sin autorización previa, expresa e informada, y no
produce actividad nueva mientras la anterior siga sin resultados registrados.

## Investigar y fabricar

<!-- seccion: investigacion-y-fabrica -->

| Agente                           | Estado  | Qué promete                                                                                          | Cifra medida                                  |
| -------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Harness Design Science**       | inicial | congela los umbrales antes de medir y publica lo que salga: en su paper piloto, dos de tres principios quedaron refutados por sus propias métricas | **52 criterios**; 10 fases D0–D9; 7 controles endurecidos |
| **Harness Paper Computacional**  | sellado | si no está en el ledger, no está en el paper; tras tres papers de clases distintas el diff de las fases sigue vacío | **44 criterios**; 3 papers listos; 0 campos nuevos del contrato |
| **Fábrica de AI-APPs**           | sellado | dos casas, un escritor por casa; ninguna app avanza sin dos aprobaciones escritas y ningún sprint cierra sin el resumen del repo de la app | 7 repositorios de app estampados; 24 sprints cerrados; 6 gates |

Los dos harnesses de investigación no publican: la producción termina en «listo para enviar», y
el envío a revista lo ejecuta el autor con su token; y ninguno menciona el ecosistema del autor
en un manuscrito, cosa que un lint verifica dos veces. La Fábrica no escribe código de
producción, no ha validado sus fases de lanzamiento y operación en una corrida real, y no tiene
librerías compartidas: son sus tres límites declarados.

## Cómo nace un agente en Claude Code: la constitución, los comandos y los gates de calidad

<!-- seccion: como-nace-un-agente -->

Los trece comparten una anatomía, y conviene describirla una sola vez. Cada agente es un
repositorio con una **constitución**: un archivo `CLAUDE.md` que Claude Code carga solo al abrir
la carpeta y que fija las leyes del agente, sus comandos y sus fuentes. El Experto ISO 42001, por
ejemplo, tiene **8 leyes y 9 comandos**; Atracción en Frío, **8 comandos** en su ciclo (marca,
manual de marca, campaña, actividad, feedback, pipeline, informe y cierre); el Experto Fiscal,
**12 comandos**; Hiring Copilot, **12 comandos sobre 8 módulos**. No hay prompt de arranque que
pegar: la constitución es el arranque.

Sobre esa constitución va el **harness**: el contrato de entrada y salida, las herramientas
permitidas, el formato de cada entregable y los **criterios binarios de aceptación** —pasa o no
pasa, sin juicio intermedio— que se cuentan uno a uno en los work-items del paquete: 29 en la
Super guía AI-103, 50 en el Asistente de posgrado, 99 en Hiring Copilot, 20 en el Constructor de
Tableros, 33 en el Taller de Animación, 52 en el Harness Design Science y 44 en el Harness Paper
Computacional. Un criterio que no puede fallar no es un criterio, y por eso cada control lleva su
**carnada**: el caso destruido a propósito que demuestra que el control dispara.

Y sobre el harness, los **gates humanos**: puntos donde el agente se detiene y no sigue hasta que
la persona escribe un token literal. Presentaciones CINE tiene **8 gates** con token verbal, uno
por corte; el Taller de Animación, **6**; Atracción en Frío, **6**; el Constructor de Tableros,
**5** gates de aprobación humana. El gate no es un recordatorio: es mecánica. La Super guía no
genera una guía antes de que el mapa de cobertura esté aprobado; la Biblioteca no integra una
ficha sin el token del curador registrado con fecha; el Taller no enciende la GPU sin guion y
storyboard aprobados.

## Los agentes de aprendizaje, uno por uno

<!-- seccion: aprendizaje-uno-por-uno -->

**Super guía AI-103** (inicial, v2.1.0). Invierte el estudio: primero se define un proyecto real
en Azure AI Foundry y el harness demuestra, con un mapa de cobertura contra los pesos oficiales
del examen, que construirlo cubre el temario. Solo entonces genera las guías paso a paso, con los
callouts oficiales inyectados donde hacen falta; cada afirmación pedagógica cita su fuente oficial
con URL y fecha o se marca «a confirmar». Tiene **29 criterios** binarios repartidos en 9
work-items y **6 notas inteligentes** sembradas. No ejecuta nada en Azure, no es un simulador de
examen (cinco a diez preguntas por guía) y entrega archivos HTML que se abren en el navegador. Es
el agente con el que estudio mi propia certificación en curso, y por eso está en la vitrina: es
evidencia de cómo aprendo.

**Asistente de posgrado** (inicial, v1.0.1). Cada sesión de clase entra a una biblioteca en
Markdown con procedencia exacta hasta la marca de tiempo de la grabación o el número de
diapositiva; esa biblioteca alimenta el repaso espaciado y la matriz de opciones de proyecto de
grado. Toda cita se genera desde CSL-JSON con un procesador de estilos, jamás se redacta: la cita
inventada deja de ser posible. **50 criterios** binarios en 7 work-items, **9 de 9 carnadas**
disparan, y transcribe a unas 19 veces el tiempo real con Whisper en local. Prepara, no suplanta:
no escribe los entregables evaluables del estudiante; no oye ni ve —opera sobre lo que la cadena
transcribe—, y no entra a las plataformas del programa: el estudiante trae los archivos.

**Hiring Copilot** (inicial, v1.1.1). Para un profesional de IA que busca un rol de nivel
medio-alto en Colombia o en Europa: cada afirmación enviable enlaza un logro con su fuente y un
programa lo comprueba, y el bullet huérfano hace fallar el control. **99 criterios** en doce
work-items, de los que 16 están cumplidos hoy, con **8 de 9 controles** con carnada; un script de
coherencia compara el recuento contra el disco en cada corrida. Prepara candidaturas y no las
envía; entrena antes de la entrevista y jamás asiste durante una real; no emite puntaje de ATS
porque no existe uno común publicado, y nunca inserta texto oculto en un documento.

## Los agentes de conocimiento, uno por uno

<!-- seccion: conocimiento-uno-por-uno -->

**Experto ISO 42001** (inicial, v1.0.0). Cada cliente recibe un repositorio estampado del mismo
molde: intake, gap analysis con la declaración de aplicabilidad de los **38 controles** del Anexo
A, plan, políticas y el ciclo mensual que el mercado casi no vende. Toda afirmación normativa cita
el corpus con apartado y página o declara el vacío, y cada dictamen estampa la fecha en que se
verificó su vigencia: es «el experto que sabe cuándo dejó de estar actualizado». Prepara los **24
documentos** que un auditor pide. Un solo núcleo, la 42001: el AI Act, NIST o las leyes locales
entran como satélites mapeados hacia ella. No certifica ni da fe pública, no ejecuta código ni lee
telemetría, y nunca reproduce el texto de la norma: parafrasea y remite a la copia licenciada del
lector. Es el mismo agente que uso en la estrategia institucional de la Fundación CTIC.

**Experto Fiscal** (inicial, v1.0.0). Mantiene un gemelo de las finanzas del usuario en archivos
suyos, calcula el impuesto estimado a la fecha, recorre las palancas legales que aplican a su caso
y prepara lo que el contador necesita, citando en cada afirmación el artículo, la fuente y la
vigencia. El corpus tiene **150 reglas** citables: 39 de renta de persona natural, 39 de
estructura societaria, 30 del Régimen Simple, 20 de calendario y sanciones, 12 de IVA e ICA y 9
de retenciones. Cubre Colombia y la DIAN; sirve a un solo usuario, sin servidor ni nube; no
diligencia formularios ni presenta ante la DIAN, que es un acto personal del contribuyente; y una
sugerencia sin su regla citada, sus supuestos y su sensibilidad no se emite.

**Biblioteca de Tendencias GenAI** (inicial, v1.2.0). Un bibliotecario agente barre las fuentes
primarias del censo —cero prensa— y presenta hasta siete candidatas por corrida; el curador decide
una por una con su frase exacta, y lo aprobado se integra como ficha bilingüe conectada al grafo.
**59 fichas** canónicas en español e inglés, cotejadas contra los 59 nodos del grafo, y **61
entradas** del censo con veredicto. Solo tendencias de infraestructura GenAI —patrones, protocolos
y capas reutilizables—; de doce comandos, dos están ejercitados y los otros diez se declaran «sin
estrenar»; nunca rodea un bloqueo, un muro de pago ni un login: lo reporta y sigue.

## Los agentes de producción e investigación, uno por uno

<!-- seccion: produccion-uno-por-uno -->

**Constructor de Tableros Power BI** (sellado, v1.1.0). Recibe los requerimientos en texto y un
proyecto con las tablas; diagnostica el modelo, propone la lista de medidas, columnas y relaciones
para que la persona la apruebe, las crea por el servidor MCP de modelado probando cada medida en
DAX, y después escribe el reporte entero en el JSON nativo de Power BI con una skill propia, sin
CLI ni ecosistema Fabric. **20 criterios**, **5 gates** humanos y 33 tableros de referencia
estudiados. Construye desde cero (migrar entre fuentes queda fuera), entrega un proyecto local
versionado y no publica al servicio en la nube; no ve la pantalla, así que el render lo confirma
una persona en Power BI Desktop.

**Presentaciones CINE** (sellado, v1.5.0). Brief, storyboard con cobertura completa de los
mensajes, motion system propio de la pieza, rodaje escena por escena y un gate humano en cada
corte; lo que sale es un deck web determinista —animación de código, no video— con su corte
editorial para quien pidió menos movimiento. La primera pieza tiene **24 escenas** coreografiadas
en las dos ramas, **206 comprobaciones** de regresión y 15 ADR. El método es hipótesis hasta cerrar
la primera producción completa, y el ahorro estimado del 50 % es supuesto propio, a corregir con
las horas reales.

## Los agentes de producción, segunda parte, y los de investigación

<!-- seccion: produccion-uno-por-uno-2 -->

**Taller de Animación** (sellado, v1.3.0). Carboncillo, tinta y plastilina con la GPU encendida lo
menos posible: guion, voz, medición y montaje corren en el Mac y cuestan cero; la GPU alquilada se
enciende tarde, solo para generar los clips por API sobre workflows parcheados, y se apaga antes de
ensamblar. **33 criterios**, **6 gates**, 6 componentes por técnica y 11 ADR. Produce videos, no
aplicaciones; no juzga la estética; nunca termina una sesión con el pod encendido ni inventa
costos o tiempos de render que no midió.

**Atracción en Frío** (inicial, v1.4.2). Una sola máquina para todas las marcas de un operador:
investiga el mercado antes de opinar, entrega la estrategia como índice y desarrolla cada actividad
solo cuando se pide. Cada marca conserva su voz y su línea base; el pipeline conserva la base
legal de cada contacto. **8 comandos**, **6 gates** y 19 ítems de checklist, todos sin estrenar
porque la primera corrida real es su primer work-item. No publica ni envía, monta video pero no lo
anima, y el ROI modela horas liberadas (su reducción del 63,2 % sigue siendo supuesto).

**Harness Design Science** (inicial, v1.0.0), **Harness Paper Computacional** (sellado, v1.21) y
**Fábrica de AI-APPs** (sellado, v1.1.0) tienen su relato en el documento de las investigaciones y
en el del pipeline: el primero conduce diez fases D0–D9 con **52 criterios** y publica lo que
salga, refutaciones incluidas; el segundo produjo **3 papers** listos para publicar con sus **44
criterios** y su ledger; la tercera estampó siete repositorios y cerró **24 sprints** con
retrospectiva, y es la que construyó esta misma página.

## Qué significa «sellado» y qué significa «inicial»

<!-- seccion: sellado-e-inicial -->

Las fichas declaran un estado y una versión, y las dos palabras tienen definición. **Sellado**
quiere decir que el agente cerró al menos una corrida completa con su entregable real, que sus
gates se ejercitaron con tokens de verdad y que su versión quedó estampada con fecha: el
Constructor de Tableros (v1.1.0), Presentaciones CINE (v1.5.0), la Fábrica de AI-APPs (v1.1.0),
el Taller de Animación (v1.3.0) y el Harness Paper Computacional (v1.21). **Inicial** quiere decir
que el harness está construido y verificado, pero que su primera corrida real todavía no ocurrió o
no cerró: Atracción en Frío lo dice de sus ocho comandos; la Biblioteca, de diez de sus doce; el
Asistente de posgrado, de sus 13 comandos con 0 ejercitados. Publicar ese dato es parte del
método: una ficha que dijera «probado» sin corrida sería la misma cifra sin procedencia que los
agentes se prohíben a sí mismos.

El retorno sigue la misma regla en las trece fichas: **se declara como estimación con supuestos**,
nunca como promesa. La Super guía monetiza la certificación en horas facturables a la tarifa del
usuario y no afirma salto salarial; Atracción en Frío modela horas liberadas; CINE y el Taller
declaran su ahorro como hipótesis a calibrar; el Experto Fiscal no estima el ahorro fiscal directo
porque depende de cifras que aún no están en el gemelo, «y ponerle número hoy sería inventarlo».

## Lo que los trece comparten

<!-- seccion: lo-que-comparten -->

- **Gates humanos con token exacto.** Ningún agente cruza una puerta —encender una GPU, cerrar un
  sprint, integrar una ficha— sin la palabra literal de la persona. Entre 5 y 8 gates por agente.
- **Carnadas.** Un control vale su verde solo si tiene el caso destruido que demuestra que
  dispara: Hiring Copilot tiene 8 de 9 controles con carnada; el Asistente de posgrado, 9 de 9.
- **Ninguna afirmación sale de la memoria del modelo.** Cita la fuente con su ubicación o declara
  el vacío; ninguna cifra se inventa: es medida, calculada, declarada o estimada, y así lo dice.
- **Límites y «nunca» publicados.** Cada ficha declara 3 o 4 límites y hasta 5 cosas que el
  agente nunca hace, porque un agente que parece hacer de todo es un agente sin gobierno.
- **Costo en herramientas: 0 pesos.** Corren sobre Claude Code y herramientas abiertas; el
  retorno se declara como estimación, no como promesa.
- **Decisiones registradas.** Entre 8 y 17 ADR por agente.

Es la misma regla con la que gobierno mis datos y mi pipeline: un control que no se ha visto
fallar, una cifra sin procedencia o una promesa sin límite no entran.
