# Revisión 2026-09-26 (noche) — El margen de la home, segunda vuelta

> Rama `perf/margen-de-la-home-2`. El PR #52 debía darle margen a `/es` en Lighthouse, y su
> bitácora lo dio por pagado. No lo está.

## Lo que pasó en la CI

| Corrida                                            | Código de `/es`             | Rendimiento de `/es` |
| -------------------------------------------------- | --------------------------- | -------------------- |
| PR #52, 078be0d                                    | con el fallback calibrado   | ≥ 0,90 (pasó)        |
| `main` tras el merge del #52, 1414006              | el mismo árbol que 078be0d  | **0,89**             |
| PR #53, 0d80972 (corpus y documentos, no toca `/es`) | el mismo                  | **0,89**             |

Una de tres. En local, con la CPU ×12 que antes reproducía la CI, el #52 daba 0,91 en las tres
corridas: **ese método ya no predice la CI**, y la primera medición que dio verde se tomó por
margen. La aserción no se afloja y no se relanza a ciegas.

El PR #53 no puede moverlo. Sus archivos son:

- documentos del chat, que no se publican;
- un comentario de YAML;
- documentos del repo y el banco de preguntas.

El índice del chat solo se descarga cuando el chat cae al respaldo local (`cargarRetriever` en
`chat-panel.tsx`), nunca al abrir la página.

## Primer paso: que la CI hable

`lhci assert` solo imprime lo que falla, y la cifra que falla sin más (0,89) no dice por qué.
El job de Lighthouse sube ahora sus `lhr-*.json` como artefacto, siempre, siete días. Con ellos se
ve, por URL y por corrida, el LCP, el TBT y las peticiones que el simulador cobró **en el runner**.

**Sin regla 14:** subir reportes no es un gate, no puede ponerse rojo ni verde.

## Lo que dicen los reportes de la CI

_(pendiente: se llena con la primera corrida de este PR)_
