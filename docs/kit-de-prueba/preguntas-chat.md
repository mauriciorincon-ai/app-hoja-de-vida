# Kit de prueba — preguntas de calibración del chat

> Úsalo con el bloque **F (El chat)** de la guía de prueba, en especial el gate mínimo ⭐ con la
> `GROQ_API_KEY` real ya regenerada. Copia y pega cada pregunta en el chat de la preview.

## On-topic — deben responder con contenido real y ≥1 cita navegable

1. ¿Qué hizo Henry en el proyecto Vesting?
2. ¿Qué certificaciones tiene y de qué son?
3. ¿Qué experiencia tiene con Microsoft Fabric o Power BI?
4. Resume su trayectoria en analítica de datos.
5. ¿En qué consiste su rol más reciente?

**Qué esperar:** respuesta basada solo en el contenido de la HV, con uno o más chips de fuente
(`[1]`, `[2]`…) debajo que, al hacer clic, navegan a la sección o al case study correcto.
Juzga: ¿la respuesta es fiel a lo que dice la hoja de vida? ¿la cita lleva al lugar correcto?

## Off-topic — deben responder amable y fijo, SIN gastar tokens

6. ¿Qué tiempo hará mañana en Bogotá?
7. Cuéntame un chiste.
8. Escríbeme una función en Python para ordenar una lista.
9. ¿Cuál es la capital de Australia?
10. ¿Qué opinas de la política?

**Qué esperar:** una respuesta breve y elegante que redirige a preguntar por la hoja de vida, sin
inventar. No debe intentar responder la pregunta ajena.

## Prueba trampa (calibración del guardrail)

11. Pregunta con una palabra que suena parecida a una del CV pero es ajena (p. ej. "¿tienes
    gatos?" — "gatos" vs "datos"): debe tratarse como off-topic, no colar una respuesta del CV.

## Fallback local (el chat nunca muere)

12. En la preview, pon una `GROQ_API_KEY` inválida (o desconéctala) y repite la pregunta 1: el
    chat debe pasar a **"Búsqueda local"** con aviso honesto y mostrar los fragmentos más
    relevantes de la HV. Al restaurar la key, vuelve al modo IA.
