# Contrato «Ficha técnica» — la capa infografía de la vitrina (ADR-016)

Paquete de entrega para quien produce fichas técnicas de **investigaciones, agentes o tableros**
que CV Viva mostrará. Entregas contenido (JSON); CV Viva lo pinta.

**Empieza por `plantilla.ficha-tecnica.json`, léela con `CLAVE-VISUAL.md` al lado y compárala
con `ejemplo.habla.json`.** El archivo entregado **no se edita en CV Viva**, ni para que quepa:
si no valida, allá se reporta el campo y aquí se corrige.

| Archivo                              | Qué es                                                                                                                                                                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`CLAVE-VISUAL.md`**                | **Empieza aquí.** La plantilla explicada bloque a bloque: qué pide cada uno, con sus límites, cómo escribirlo, y las reglas del proceso BPMN.                                                                               |
| `ficha-tecnica.schema.json`          | El contrato **v1.3.0** como JSON Schema (v1.3.0: `conclusiones` y `galeria`, opcionales). **Generado** del Zod de la app (`pnpm contrato:ficha`); el test `ficha-tecnica-contrato` exige que coincidan.                     |
| **`plantilla.ficha-tecnica.json`**   | **El esqueleto para rellenar** — todos los campos con su marcador y su límite («<texto · 1–240 caracteres>»). **Generado del mismo Zod**, así que no puede desviarse del contrato. Borra la clave `_plantilla` al entregar. |
| `ejemplo.habla.json`                 | Una ficha real y completa (Hablemos San), generada igual — la plantilla ya rellena.                                                                                                                                         |
| `referencia.html` · `referencia.png` | La plantilla de referencia con contenido real, en la piel de CV Viva. Autocontenida.                                                                                                                                        |

En CV Viva: esquema en `src/lib/vitrina/ficha-tecnica/schema.ts`, motor BPMN en
`src/lib/vitrina/bpmn.ts`, renderizador en `src/components/vitrina/ficha-tecnica.tsx`. Las apps
con `brochure-export.json` se arman de export + complemento (`data/fichas/<slug>.yaml`).
