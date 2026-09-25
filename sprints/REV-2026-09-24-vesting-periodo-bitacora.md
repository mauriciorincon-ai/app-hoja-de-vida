# Revisión 2026-09-24 — El periodo real de Vesting y el año de la HOME

> Rama `fix/vesting-periodo-real`, un PR.

## Lo que pasó

La línea de tiempo de la HOME dice «2024» para Vesting por decisión del dueño (revisión post-S8):
así su año de transición no repite el 2023 de Pichincha. El periodo real es 2023–2025, y eso dicen
el caso de estudio y el corpus. La decisión estaba escrita en un comentario del YAML, y aun así la
revisión de los casos (PR #41) la señaló como discrepancia y se la volvió a preguntar al dueño. No
era la primera vez. Su respuesta: _«vamos a tener este problema en cada revisión»_.

**Por qué seguía volviendo:** el «2024» vivía en `periodo`, y `periodo` no solo alimenta la línea
de la HOME: también el PDF (que así decía «2024» a los reclutadores), `/cv`, el chat y la
navegación entre casos. Un dato que es verdad en un sitio y falso en cuatro va a parecer un error
cada vez que alguien lo mire.

## La corrección, en la raíz

Dos datos en vez de uno:

- `periodo: "2023 — 2025"`, **el real**, para todo.
- `periodoEnLaHome: "2024"`, **solo** para la línea de la HOME (`periodoEnLaHome()` en
  `src/lib/casos.ts`, que la trayectoria de la HOME usa).

`anioDe` pasó de `timeline-track.tsx` a `src/lib/casos.ts`: es lógica pura, y la prueba no puede
importar un componente cliente que arrastra la navegación de next-intl.

## Regla 14 — dos gates, en rojo en este commit

**1. El periodo real dice los mismos años que el nombre de su caso** (con los datos de `main`):

```
× el periodo real dice los mismos años que el nombre de su caso (ES y EN)
+ vesting: la trayectoria dice «2024» y el caso «2023–2025»
```

**2. La línea de la HOME no repite año** (sin `periodoEnLaHome` en el YAML; y también con la HOME
ignorándolo):

```
× la línea de tiempo de la HOME no repite año de transición
AssertionError: años de la línea: 2025 · 2023 · 2023 · 2021 · 2020 · 2018 · 2017 · 2016
```

Las dos juntas dicen por qué existe el campo: sin él, o el periodo real miente o la línea repite.

## Qué cambia para quien visita

- **HOME:** nada. La línea sigue diciendo 2024.
- **PDF, `/cv`, chat y la navegación entre casos:** Vesting dice «2023 — 2025».
