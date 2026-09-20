---
slug: los-agentes-de-la-vitrina
titulo: "Los trece agentes de la vitrina"
resumen: "Los 13 agentes publicados, uno a uno, en cuatro familias: qué promete cada uno, su cifra medida, su límite y su «nunca». Cinco sellados. Todos con gates humanos, carnadas que demuestran que los controles disparan, cero costo en herramientas y la misma regla: ninguna afirmación sale de la memoria del modelo."
estado: borrador
ancla: "/vitrina/agentes"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué agentes tiene publicados en su portafolio?"
  - "¿Qué hace el Experto Fiscal?"
  - "¿Qué es un harness?"
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
