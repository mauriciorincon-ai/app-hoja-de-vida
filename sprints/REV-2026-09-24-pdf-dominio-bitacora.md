# Revisión 2026-09-24 — El dominio, muy resaltado en el PDF

> Bitácora de un pedido del dueño, sin orden de la planeadora. Rama `feat/pdf-dominio-destacado`,
> un PR. Sigue a la revisión de los casos de estudio (PR #41), ya en `main`.

## Lo que pidió el dueño, textual

_«Necesito que pongas mi dominio de encabezado grande y resaltado, y si lo puedes poner en otros
espacios para reforzar, sin ser invasivo en otros textos o pie de página revisa; lo que sí debe ir
es el encabezado muy resaltado.»_

## Qué se construyó

| Dónde       | Qué                                                                                                                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cabecera    | Un **bloque navy** con el dominio en blanco (14 pt, negrilla), a la derecha y a la altura del nombre, con «CV interactivo · casos · chat» en gris debajo. El nombre y el eyebrow se estrechan para no tocarlo. Sale de la línea de contacto |
| Perfil      | «Más en mi sitio: _dominio_.» ya existía; el dominio pasa a navy y negrilla                                                                                                                                                                 |
| Pie         | En **cada** página, centrado y en 7,5 pt: el dominio en navy y «· 1 / 2» en gris                                                                                                                                                            |
| Enlaces     | Los tres se pueden pulsar y abren el sitio **en el idioma del PDF** (`/es` o `/en`)                                                                                                                                                         |
| Sin dominio | Nada cambia: ni bloque, ni pie, ni enlaces. El dominio llega solo por `NEXT_PUBLIC_SITE_URL` (regla 16)                                                                                                                                     |

**Revisado y descartado:** enlazar cada experiencia a su caso de estudio con un «ver caso» junto al
periodo. Son ocho refuerzos más, pero el texto cae en la línea de la fecha, que es la que un ATS
interpreta; una fecha «2024 · Ver caso de estudio» se lee mal. Tres lugares bastan.

## Dos defectos del PDF, encontrados al mirar la cabecera nueva

**Un título de sección podía quedarse solo al pie de la página.** Con la cabecera más alta,
«SKILLS» quedó solo al final de la página 1 y sus grupos en la 2. **No es nuevo:** en `main`, sin
dominio, ya se quedaba solo el primer grupo («IA & ML»), con sus ítems en la página 2 (captura de
`main` revisada). La reserva del título era un número fijo (40 pt) y la del grupo 14 pt. Ahora
el título de sección reserva lo que ocupa de verdad (10 de aire, 2 hasta la regla, 7 debajo) más
lo primero que encabeza, y cada grupo de skills viaja con sus ítems.

**«EXPERIENCIA» salía en navy.** pdfkit escribe el color en el flujo de la página actual: una
columna que fija el color y luego salta de página escribe con el último color que quedó en la
otra. El bloque navy de la cabecera dejó el navy en la página 1. Se arregló en la raíz: el estilo
vigente se recuerda y `Columna.asegurar` lo re-aplica tras cada cambio de página. Sin gate
automático: el color vive en flujos comprimidos. Lo cuida la d1 de la guía («títulos de sección
en negro»).

## Regla 14 — los gates, en rojo en este mismo commit

¿Lo vi fallar? Abajo. ¿Lo vi correr? En `pnpm test`. ¿Puede fallar? Cada uno tiene un estado que
ninguna otra prueba atrapa: las de antes solo miraban el PDF **sin** dominio, y el de producción
lo tiene.

**A. El pie en cada página** (se quita la llamada a `pie`):

```
× el dominio encabeza, cierra el perfil, firma cada página y lleva al sitio en su idioma
AssertionError: el pie de la página 1 (es): expected false to be true
```

**B. Los enlaces** (el bloque de la cabecera sin `doc.link`):

```
AssertionError: enlaces al sitio (es): expected 3 to be 4
```

**C. Ningún título huérfano** (la reserva de antes: 14 pt, como en `main`):

```
× ningún título se queda solo al pie de una página
AssertionError: títulos separados de lo que encabezan (es, sin dominio): expected [ 'IA & ML Azure AI' ] to deeply equal []
```

Es exactamente el defecto que `main` tiene hoy.

**D. Dos páginas también con dominio** (la prueba de páginas ahora mide las dos variantes). Una
cabecera 104 pt más alta **no** la puso roja: la página 2 tiene holgura y cupo. Con 304 pt:

```
× cabe en dos páginas, en los dos idiomas, con dominio y sin él
AssertionError: el PDF es con dominio tiene 3 páginas: expected 3 to be less than or equal to 2
```

La holgura medida es de unos 250 pt en la página 2: el bloque del dominio está muy lejos del
techo.

Las pruebas con dominio usan uno inventado y más largo que el real (`nombreyapellidolargo.test`):
si cabe ese, cabe el verdadero, que jamás se escribe en el repo.

## Lo que falta para que el dueño lo vea

El PDF solo muestra el dominio si Vercel tiene `NEXT_PUBLIC_SITE_URL`, y **hoy no la tiene**. Esa
variable se pone **después** de que el dominio abra el sitio: antes, el PDF, el sitemap y las
URL canónicas mandarían a una dirección que no carga. Orden: dominio en Vercel → DNS en
Cloudflare → verificar que abre → variable → redeploy. Entonces se corre la d3 ⭐.

## Verificación

| Qué                            | Resultado                                                            |
| ------------------------------ | -------------------------------------------------------------------- |
| PDF con y sin dominio, ES y EN | 2 páginas las cuatro; «SKILLS» junto a su primer grupo en las cuatro |
| Capturas revisadas             | ES páginas 1 y 2 con dominio; EN página 2 con dominio; `main` sin él |
| Guía                           | v9.6: d1 mejorada, d3 ⭐ nueva; 37 ⭐ en texto, casillas y filtro    |
