# Contrato «Ficha técnica» — la capa infografía de la vitrina (ADR-016)

Paquete de entrega para quien produce fichas técnicas de **investigaciones, agentes o tableros**
que CV Viva mostrará. Entregas contenido (JSON); CV Viva lo pinta.

| Archivo                              | Qué es                                                                                                                                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`CLAVE-VISUAL.md`**                | **Empieza aquí.** La plantilla explicada bloque a bloque: qué pide cada uno, con sus límites, cómo escribirlo, y las reglas del proceso BPMN.                                                           |
| `ficha-tecnica.schema.json`          | El contrato **v1.1.0** como JSON Schema (el proceso BPMN es opcional desde esta versión). **Generado** del Zod de la app (`pnpm contrato:ficha`); el test `ficha-tecnica-contrato` exige que coincidan. |
| `ejemplo.habla.json`                 | Una ficha real y completa (Hablemos San), generada igual.                                                                                                                                               |
| `referencia.html` · `referencia.png` | La plantilla de referencia con contenido real, en la piel de CV Viva. Autocontenida.                                                                                                                    |

En CV Viva: esquema en `src/lib/vitrina/ficha-tecnica/schema.ts`, motor BPMN en
`src/lib/vitrina/bpmn.ts`, renderizador en `src/components/vitrina/ficha-tecnica.tsx`. Las apps
con `brochure-export.json` se arman de export + complemento (`data/fichas/<slug>.yaml`).
