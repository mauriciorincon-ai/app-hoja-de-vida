# ADR-021 — El PDF pasa a dos columnas con acento navy; el dominio, por variable de entorno

- **Estado:** aceptada · 2026-09-13 · revisión post-S8 de la HOME, bloque D
- **Reemplaza en parte a:** ADR-008 (PDF ATS de una columna, Helvetica, secuencial)

## Contexto

El dueño pasó el PDF por un comprobador ATS: parseó sin problemas (criterio de ADR-008 cumplido),
pero pidió la ESTRUCTURA de dos columnas que ese comprobador propone —«simple y minimalista pero
un poco más atractiva»— con un azul navy, y que el dominio del sitio, cuando exista, encabece la
hoja «muy, muy explícito».

## Decisión

1. **Dos columnas dibujadas en orden ATS.** Izquierda (62 %): experiencia y proyectos. Derecha
   (38 %): perfil, formación, certificaciones y skills. Por página se dibuja cabecera → derecha →
   izquierda, así el flujo de texto que un parser extrae es cabecera, perfil, experiencia. La
   izquierda fluye a más páginas. Verificado con `pdftotext` en modo crudo.
2. **Acento navy `#2B4C7E`** (el primer corte, `#1F3A5F`, el dueño lo pidió «aclarado un poco»), tinta `#111111`, gris `#555555`; Helvetica sin embedding, todo
   texto. Sin iconos ni imágenes: el ATS los pierde y no aportan.
3. **El dominio va primero y en negrilla en la línea de contacto, pero solo si el build lo conoce
   por `NEXT_PUBLIC_SITE_URL`.** Regla 16 intacta: el dominio no se escribe en ningún archivo del
   repo. En local o sin variable la cabecera sale sin él. Gates: unit sobre `lineaDeContacto` e
   integración generando el PDF con la variable puesta.
4. El cierre del perfil anuncia el sitio SIEMPRE: «Más en mi sitio: dominio» con dominio, «Más en mi
   sitio web.» sin él (la frase del chat de la web no viaja al papel).
5. Una certificación `en curso` imprime «(en curso)» / «(in progress)» en vez de fecha (el corte
   anterior dejaba un paréntesis vacío).

## Consecuencias

- Lo que el comprobador señaló como CONTENIDO (bullets sin cifra, palabras repetidas) no se
  arregla en el generador: sale del corpus a fondo cuando el dueño lo corrija.
- Los tokens del PDF viven en el script y quedan documentados en `design-system.md` § «El PDF».
- Cuando el dominio se compre, basta poner la variable en Vercel y redesplegar: el PDF lo muestra
  sin cambio de código.
