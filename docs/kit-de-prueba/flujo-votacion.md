# Kit de prueba — flujo de votación del roadmap

> Úsalo con el bloque **G (Roadmap con votación)** de la guía de prueba. Requiere que la votación
> esté configurada (Supabase) en la preview que estás probando.

## Flujo feliz (votar sube el contador REAL)

1. Abre la preview en `/es` y baja hasta la sección **Roadmap** (o usa el enlace del menú).
2. Fíjate en el número junto a una feature (p. ej. "sin votos aún" o "3 votos").
3. Haz clic en **Votar**. Debe:
   - subir el número **en 1** (el valor real de la base de datos, no un salto raro),
   - cambiar el botón a **"Ya votaste"** y deshabilitarlo.
4. **Recarga la página.** La feature que votaste debe seguir en "Ya votaste" (dedup por
   navegador) y su número debe reflejar tu voto.

## Segundo voto (dedup)

5. Intenta votar de nuevo la MISMA feature: el botón está deshabilitado, no cuenta dos veces.
6. (Límite honesto declarado) Si borras los datos del navegador o abres en incógnito, podrás
   votar otra vez — es dedup de mejor esfuerzo, sin registro ni datos personales.

## Contador honesto (el gate de producto)

7. **BD caída / votación apagada:** en la preview pon `VOTACION_ENABLED=false` (o quita
   `SUPABASE_URL`) y recarga. La sección debe decir **"La votación no está disponible…"** y los
   botones deben quedar **deshabilitados**. Confirma que **NO aparece ningún número inventado**
   (solo un guion "—"). Restaura la variable para volver al modo normal.

## Idioma

8. Cambia a `/en` y confirma que las features del roadmap y los textos de la votación están en
   inglés, y que el conteo es el mismo (es la misma base de datos).
