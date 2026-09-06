# CV Viva

Una hoja de vida que se construye a sí misma, en público.

No es un PDF ni una plantilla: es una aplicación web bilingüe (ES/EN) donde **el contenido es
dato versionado**. Una sola fuente —los YAML de `data/`— alimenta la web, el chat, el PDF en
formato ATS y la **vitrina**, el espacio donde se muestran las piezas construidas por el
pipeline: apps, agentes especializados, investigaciones y tableros de datos.

Principio rector: **la producción se MUESTRA, no se entrega.** Este repositorio no publica URLs
de despliegue en ninguna parte; el único llamado a la acción público es la lista de espera, y no
promete fecha.

## Cómo está hecha

| Pieza      | Qué se usó                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router), **SSG-first**: toda ruta entrega su contenido íntegro en el HTML, sin JS        |
| Lenguaje   | TypeScript en modo estricto                                                                              |
| Estilos    | Tailwind v4 + shadcn/ui, sobre el `design-system.md` de la casa                                          |
| Idiomas    | next-intl, rutas `/es` y `/en` con hreflang                                                              |
| Contenido  | YAML validado con Zod **en build**: si un dato está malformado, el build falla nombrando archivo y campo |
| Datos      | Supabase para la votación anónima del roadmap (sin usuarios, sin datos personales)                       |
| IA         | Chat sobre la hoja de vida, multi-proveedor y con respaldo determinista                                  |
| Pruebas    | Vitest · Playwright · Testing Library · axe-core                                                         |
| Despliegue | Vercel, con CI que corre calidad, integración, e2e y Lighthouse contra un presupuesto                    |

## Correrla en local

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Otros comandos útiles:

```bash
pnpm test         # unitarias e integración (Vitest) con cobertura
pnpm test:e2e     # end-to-end y accesibilidad (Playwright + axe)
pnpm typecheck    # TypeScript sin emitir
pnpm lint         # ESLint
pnpm build        # build de producción (valida TODO el contenido)
```

Las claves viven solo en `.env.local` (ignorado por git) y en las variables de entorno del
despliegue. `docs/APROVISIONAMIENTO.md` dice cuáles hacen falta y para qué.

## Dónde está cada cosa

| Ruta                       | Qué hay                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `data/`                    | El contenido: hoja de vida (ES/EN), apps del pipeline, frentes de la vitrina, historia del chat |
| `content/`                 | Lo que llega de otras casas del pipeline — **no se edita aquí**: se corrige en origen           |
| `src/`                     | `app/[locale]/` rutas · `components/` UI · `lib/` motores y carga de contenido                  |
| `docs/MANUAL-DE-USO.md`    | Cómo se usa y **cómo alimentarla**, en español llano                                            |
| `docs/GUIA-DE-PRUEBA.html` | Guía de prueba acumulativa, autocontenida: se abre sin internet                                 |
| `design-system.md`         | La fuente de verdad visual                                                                      |
| `decisions/`               | Los ADR: cada decisión de arquitectura, con su porqué                                           |
| `sprints/`                 | Bitácora y cierre de cada sprint                                                                |

## Alimentarla

Editar el YAML correspondiente en `data/` y hacer push. No hay panel de administración ni base
de datos de contenido a propósito: el historial de git **es** el historial editorial, y el build
es el que se niega a publicar algo malformado. El paso a paso, con ejemplos, está en
`docs/MANUAL-DE-USO.md`.
