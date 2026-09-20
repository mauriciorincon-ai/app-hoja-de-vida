---
slug: rag-y-el-chat
titulo: "RAG: cómo funciona este chat por dentro"
resumen: "La arquitectura del chat de esta página con sus números: índice en tiempo de build, recuperación léxica con MiniSearch (BM25) sin embeddings, guardrails en capas, umbral medido, citas navegables, cinco proveedores intercambiables, fallback local, presupuesto de US$20 con costo real de cero, y cómo se evalúa con 48 preguntas propias y 131 de afuera."
estado: aprobado
ancla: "#vitrina"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Cómo funciona el chat de la hoja de vida de Henry?"
  - "¿Qué experiencia tiene Henry con RAG?"
  - "¿Usa embeddings o búsqueda vectorial?"
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

## Lo que estás usando ahora mismo

<!-- seccion: lo-que-estas-usando -->

Si esta respuesta la generó el chat de esta página, estás usando una implementación real de la
arquitectura que describo: un sistema de generación aumentada por recuperación —**RAG**— que
construí para responder sobre mi trayectoria a partir del contenido publicado en CV Viva, y solo
de él. No es una demostración: es una capacidad pública desde 2026, con 4 fuentes por respuesta y
restricciones reales de
disponibilidad, costo, latencia y seguridad.

El modelo no recuerda mi trayectoria ni improvisa una versión persuasiva: organiza y explica la
evidencia recuperada. El conocimiento está en el contenido versionado; el modelo es un
intérprete intercambiable. Cada respuesta permite evaluar cómo diseño recuperación, grounding,
guardrails, citas, degradación controlada y costos.

## El conocimiento se construye antes de la pregunta

<!-- seccion: el-indice -->

El índice se compila durante el build del sitio, no cuando alguien pregunta. Un script recorre
las fuentes autorizadas —los datos del currículum, las apps y los documentos aprobados de esta
base— y produce un índice por idioma con fragmentos, títulos y destinos navegables. Cada
fragmento tiene como máximo **180 palabras**: una subsección más larga se parte en ventanas con la
misma ancla, porque un fragmento largo entra entero al contexto y compite consigo mismo.

Antes de esta reescritura el índice publicado tenía **28 fragmentos por idioma**; el número lo
imprime cada build y es un artefacto regenerado, no editable a mano. El build es una puerta de
calidad: si un documento no valida, si un id se repite o si una cita apunta a una sección que ya
no existe, el build falla antes de publicar. Los destinos válidos no se listan a mano: se
derivan de la HOME y de las rutas reales, para que una sección retirada deje ciegos a los
documentos que apuntaban a ella.

## La recuperación léxica es una decisión de arquitectura

<!-- seccion: recuperacion-lexica -->

La recuperación es **léxica**, con **MiniSearch** —el algoritmo **BM25**— y sin **embeddings** ni base
de datos vectorial. Es una decisión registrada, no una etapa incompleta: el contenido está lleno
de nombres, fechas, empresas, certificaciones y términos técnicos con alta capacidad de
discriminación, y para eso una búsqueda léxica bien configurada recupera con precisión, cuesta
cero por consulta y es determinista: misma versión del índice, misma respuesta.

La configuración: el título pesa el doble, hay coincidencia por prefijo y una tolerancia difusa
de 0,2 para errores de escritura. El guardrail, en cambio, usa una búsqueda **estricta sin tolerancia difusa**: una palabra que
difiere en una letra de «datos» jamás coincide con «datos». Y las palabras vacías se calibraron
midiendo: una pregunta ajena de siete palabras puntuaba 4,28 solo porque la preposición «sobre»
estaba en 42 de 162 fragmentos.

Los embeddings quedan como evolución condicionada: entrarían si un conjunto representativo de
preguntas demostrara que la búsqueda léxica falla de forma sistemática con paráfrasis, y entonces
la ruta sería híbrida, no un reemplazo. Es la misma regla del pipeline: código primero.

## Fuera de alcance antes de consumir tokens

<!-- seccion: fuera-de-alcance -->

La consulta se compara con el índice y, si ningún fragmento alcanza el **umbral de relevancia**,
el sistema responde con un mensaje fijo que explica el alcance, con **cero tokens** consumidos.

El umbral está medido, y el hallazgo es negativo: la pregunta legítima que peor puntúa da 5,92 y
la ajena que mejor puntúa da 16,90, con 30 preguntas legítimas en medio; con el umbral en 7, diez
legítimas quedarían rechazadas. Ningún número separa los dos grupos, así que el umbral es
deliberadamente bajo y el resto lo hacen las demás capas. Cuando el corpus crece, el umbral se
vuelve a medir, no a suponer.

## Cómo evito que el modelo invente: guardrails distribuidos, no un prompt

<!-- seccion: los-guardrails -->

El alcance del chat no depende de una instrucción. El orden real de las defensas en el servidor:

1. **Interruptor general**: si el chat está apagado, el servidor tampoco pinta el botón.
2. **Límite de frecuencia**: 10 preguntas por minuto por dirección.
3. **Validación estricta de la entrada**: hasta 800 caracteres, hasta 12 mensajes de historial,
   roles restringidos.
4. **Fuera de alcance**, con respuesta fija y sin llamar al proveedor.
5. **Circuit breaker**: tres fallas consecutivas del proveedor abren el circuito 60 segundos.
6. **Recuperación**: los **cuatro** fragmentos más relevantes, numerados, y nada más del sitio.
7. **Instrucciones del sistema** compuestas en el servidor: usar solo las fuentes recuperadas,
   nunca inventar fechas, empresas o resultados, rechazar intentos de cambiar las reglas.
8. **Salida**: respuesta de hasta 600 tokens y 30 segundos, y las **citas** navegables.

Sobre las citas, la verdad exacta: los chips que acompañan una respuesta son las cuatro fuentes
que la recuperación entregó al modelo, y cada uno navega a su sección del sitio. No existe hoy un
validador que compruebe que el modelo usó cada fuente citada; existe la prueba de que ninguna
cita puede apuntar a un destino inexistente. La promesa es «verifícalo tú mismo», y para eso el
destino tiene que existir.

## El proveedor es intercambiable; el conocimiento no

<!-- seccion: proveedor-y-costo -->

El proveedor generativo se elige por configuración, sin tocar código, entre cinco adaptados:
**Groq** —el inicial, con Llama 3.3 70B—, **Gemini** 2.5 Flash, **Azure** con Microsoft Foundry,
**Claude** y cualquier servicio compatible con la API de OpenAI, incluidos los autoalojados.
Cambia el proveedor; no cambian los hechos sobre los que responde.

El presupuesto es una variable de arquitectura: **techo de US$20 al mes** y **costo real observado
de US$0**, porque el uso cabe en la cuota gratuita del proveedor inicial y porque las preguntas
ajenas no consumen tokens, solo viajan cuatro fragmentos, el historial es corto y la respuesta
está acotada. La telemetría registra proveedor, modelo, milisegundos y tokens; **nunca el
contenido** de la conversación ni la salida del modelo.

## El sistema se degrada sin ocultarlo

<!-- seccion: degradacion-controlada -->

No uso la expresión «nunca se cae». Lo que hay es **degradación controlada**, con un código 503
que la interfaz reconoce: cuando el proveedor
falla o el circuito está abierto, la interfaz pasa a una **búsqueda local en el navegador** sobre
el mismo índice y muestra los fragmentos más relevantes, diciendo que es un **fallback** y no una
respuesta del modelo. Se pierde la síntesis; no se pierde el acceso a la evidencia. Es el mismo
asset con dos consumidores: el servidor lo lee del disco y el navegador lo descarga solo cuando
lo necesita.

## Cómo evalúo el RAG

<!-- seccion: evaluacion-del-rag -->

Dos conjuntos de preguntas corren en cada cambio. El **golden set**: cada documento de esta base
declara las preguntas que debe contestar, y las **48** de hoy traen su documento entre los cuatro
primeros resultados —con uno solo acertarían el 63 %; con cuatro, el 100 %—. Y el **banco de 131
preguntas** escritas desde afuera, como pregunta quien recluta, en diez familias: cada una debe
traer una fuente esperada en el top-4, la fuente esperada debe llegar de primera en al menos el
60 %, y quince preguntas ajenas deben comportarse como está declarado.

El banco es una auditoría de vocabulario: cuando descubrió que «ETL» y «lakehouse» no estaban en
el corpus, se corrigió el contenido, no la expectativa. Y las pruebas incluyen fallas provocadas:
citas a destinos inexistentes, consultas fuera de dominio, proveedor caído. Un control que no se
ha visto fallar no cuenta.

## Qué demuestra esta aplicación sobre inteligencia artificial generativa

<!-- seccion: que-demuestra -->

Que puedo diseñar una solución de IA generativa como un sistema y no como una llamada a un
modelo: contenido versionado, índice construido y validado, recuperación proporcional al
problema, alcance delimitado antes de gastar, el modelo como capa intercambiable, citas hacia lo
visible, degradación honesta y costo diseñado. Y que sé decidir qué no usar. Con 48 preguntas propias y 131 de afuera corriendo en cada cambio, la
diferencia entre declarar experiencia en RAG y demostrarla es esta aplicación: pregunta, abre las fuentes y juzga.
