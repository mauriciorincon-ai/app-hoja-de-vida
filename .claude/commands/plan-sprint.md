---
description: Planea el trabajo del sprint activo leyendo la orden de construcción emitida por la casa planeadora.
---

# /plan-sprint

Prepara el plan de ejecución del sprint a partir de la **orden de construcción** que el usuario
indique (o la más reciente en `portafolio/<slug>/ordenes/` de la planeadora,
`C:\Code\hr01-develop-ai-apps\`, agregada como directorio adicional de solo lectura).

## Pasos

1. Lee la orden de construcción completa.
2. Lee sus referencias: `portafolio/<slug>/sprints/SPRINT_NNN.md` (con `status: open`), el brief,
   y el prototipo READ-ONLY si la orden lo referencia.
3. Lee los estándares del pipeline (`estandares/estandares.md` de la planeadora) — los 6+1 gates.
4. Analiza el estado actual del código de **este** repo. **El plan incluye SIEMPRE la sección
   «Riesgos de integración con lo existente»** (kit v1.7.3): lee EL CÓDIGO de las features que la
   nueva toca — specs data-driven que puedan romperse, componentes que ganan destinos, budgets y
   URLs de Lighthouse, builders que leen los mismos datos. Enumera lo que encuentres con archivo
   y línea; el riesgo nº 1 casi nunca viene escrito en la orden.
5. Propón un plan de ejecución por fases:
   - **Fase 0 — Setup:** deps, config, scaffolding si falta. **Humo de credenciales
     OBLIGATORIO antes de la fase 1** (kit v1.7.4): toda credencial que el sprint use —nueva o
     heredada— se valida con su comando de humo (≤1 min, la orden lo trae en § Aprovisionamiento)
     ANTES de construir contra ella. Una key inválida se descubre el día 0, no en la integración
     (hoja-de-vida S3: la GROQ_API_KEY devolvió 401 recién en la integración). Si la credencial
     depende del usuario, se declara como bloque **[TÚ]** del runbook de aprovisionamiento.
   - **Fase 1 — Motor/núcleo:** lógica pura con tests (y `lib/ia/` si el sprint toca LLM — skill `ia-embebida`).
   - **Fase 2 — UI:** integración visual (paleta/microcopy del prototipo, construido desde cero).
   - **Fase 3 — Integración + e2e:** tests end-to-end + axe.
   - **Fase 4 — Calidad:** gates de los 6+1 estándares (`/deploy-check`).
6. Para cada fase: archivos a crear/modificar, tests a escribir, criterio observable de "fase completa".
7. **Detente y espera aprobación del usuario** antes de escribir código. La aprobación significa
   SOLO «el plan es correcto» — **no arranca la construcción**.
8. **Gate de arranque** (kit v1.6.2): aprobado el plan, emite un bloque con tu **recomendación de
   modelo y esfuerzo** para el sprint (por fase si difiere) + recordatorio de que el usuario los
   fija con `/model` + espacio para sus ajustes finales. **Espera su «construye» explícito**;
   prohibido crear o editar archivos antes de esa palabra.

## Output esperado

Un plan en markdown con la estructura de arriba. Recuerda: **nunca escribes en la planeadora**; si
detectas que el plan del sprint necesita cambio, anótalo como `## Desviación del plan` en tu
bitácora y decláralo en el plan propuesto.
