# design-sync — bundle publicable del design system

Espejo **1:1** de lo que se publica en Claude Design, versionado aquí. Kit v1.17.0.

## La jerarquía (no se salta)

1. **`design-system.md`** (raíz del repo) — la **fuente de verdad**. Manda sobre todo.
2. **`design-sync/`** — este bundle. **Deriva** del design-system; jamás lo contradice.
3. **El proyecto en Claude Design** — la vitrina. Se escribe desde aquí y **nunca se edita allá**:
   no hay camino de vuelta al repo.

## Qué hay

```
design-sync/
├─ project.json      destino y registro de la última publicación
├─ styles.css        los tokens en un solo sitio citable
├─ README.md         esto
└─ components/
   ├─ fundamentos/       Paleta · Tipografía · Forma y movimiento
   ├─ componentes/       Botón · Card · Chip de estado
   └─ componentes-s5/    Muestra de app · Tarjeta de grupo ·
                         Chip de procedencia · Captura repintada
```

Cada tarjeta abre con la línea **exacta** `<!-- @dsCard group="…" name="…" -->`: es lo que indexa
Claude Design y **sin ella la tarjeta no aparece**. El `group` del comentario es el que manda; el
nombre de la carpeta solo evita espacios y símbolos en rutas.

Las tarjetas son **HTML autocontenido**: su CSS va inline, cero CDNs, `lang="es"`, y todos los
colores salen de la paleta canónica.

## Cómo se publica

Lo dispara **el usuario** con `/design-sync` (el comando lleva `disable-model-invocation`); el
constructor ejecuta todo el trabajo desde esta sesión. El diff **es** el plan: `git status
design-sync/` dice exactamente qué subir.

- **En todo sprint que toque UI el bundle se actualiza en su MISMO PR.** Cuesta nada y entra a la
  revisión con el resto.
- **Publicar es obligatorio en el cierre de ciclo**, y va después del gate ⭐ del usuario: se
  publica un sistema que ya se juzgó, nunca uno que nadie ha visto.

## Estado

**Sin publicar todavía.** `projectId` está en `null` (ver `project.json`). El bundle nace en el
Sprint 005 —primero del ciclo H2— para que el cierre de ciclo sea un delta pequeño y no una
reconstrucción. Esa es justamente la lección que originó la regla: en el cierre H1 de otra app el
bundle vivió en un scratchpad efímero y al retomarlo quedaban 4 de 13 archivos.

## Cobertura declarada

Este bundle cubre los **fundamentos completos** (paleta, tipografía, forma y movimiento), los
**componentes canon transversales** (botón, card, chip de estado) y **todos los componentes nuevos
del S5** (la vitrina). Quedan fuera, y se declaran como deuda del bundle en el summary del sprint:
los componentes de S1–S4 que `design-system.md` describe en prosa pero aún no tienen tarjeta —
input/textarea, metric tile, glifo ◆, primitivas de motion (`fadeInUp`, `blurIn`, `maskReveal`,
`scaleInBlur`, `Counter`, `TimelineTrack`) y los bloques del chat y de la votación.
