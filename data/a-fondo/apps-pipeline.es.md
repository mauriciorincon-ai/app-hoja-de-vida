---
slug: apps-pipeline
titulo: "Las apps que estoy construyendo en público"
resumen: "El pipeline AI-APPs: seis aplicaciones hermanas más CV Viva, 13 agentes, 7 investigaciones y 6 tableros —32 piezas— construidos con dos casas, un agente de fábrica, cuatro jobs de CI, un contrato de ficha desde Zod, costo real de US$0 al mes y dos reglas: código primero y todo control se demuestra fallando."
estado: aprobado
ancla: "#vitrina"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué aplicaciones está construyendo Henry?"
  - "¿Por qué construye en público?"
  - "¿Cuántas aplicaciones ha publicado?"
---

<!--
⚠ PRIVACIDAD — LEE ESTO ANTES DE ESCRIBIR ⚠
Este repositorio es público y el chat cita este contenido a cualquier visitante.
NO escribas: datos confidenciales de empleadores o clientes, salarios, nombres
de terceros que no hayan aceptado aparecer, direcciones, teléfonos, correos ni
información personal sensible. La aduana del build caza lo mecánico (correos,
teléfonos, documentos, direcciones web); los NOMBRES PROPIOS no los caza un
regex — esos los decides tú.

CÓMO SE ESCRIBE ESTE ARCHIVO
- Prosa normal, en primera persona, en párrafos.
- Cada subsección empieza con un título `##` seguido de un comentario
  `<!-- seccion: id -->`. Esas son las ÚNICAS 2 marcas.
- `estado: borrador` → el chat NO lo indexa y no se le exige gemelo en inglés.
  `estado: aprobado` → el chat lo indexa y exige el gemelo `.en.md` completo,
  subsección por subsección.
- Ninguna cifra, fecha ni logro sin fuente. Lo que falte va como
  `[CONFIRMAR: qué falta]`, jamás relleno plausible.
- Guía completa: docs/MANUAL-DE-USO.md → «Cómo alimentar el a fondo».
-->

<!-- El esqueleto del S3 apuntaba a «#apps»; esa sección de la HOME se retiró en
     la revisión post-S7 y el roadmap se fue a /vitrina/apps. Hoy lo que la HOME
     enseña de lo construido es la vitrina. Corregido en la migración del S8. -->

<!-- guía (viene del esqueleto de la historia, S3 — la escribió el dueño):
La visión del pipeline AI-APPs: por qué construyes en público, qué
demuestra cada app, cómo trabajas con agentes de IA para construirlas (esta
CV Viva incluida). -->

## Lo que construyo por mi cuenta, fuera del trabajo, y por qué en público

<!-- seccion: por-que-en-publico -->

Un currículum afirma; una pieza publicada demuestra: por eso he publicado seis aplicaciones y 32
piezas en total. Durante diez años exigí que cada indicador
conservara su procedencia y que cada conclusión tuviera evidencia; era incoherente aplicar ese
rigor al trabajo de las organizaciones y presentar el mío como una lista de herramientas.

Mi portafolio no es una galería de demostraciones: es una arquitectura de evidencia. Cada pieza
demuestra una capacidad concreta con un producto que se puede recorrer, probar y examinar, en un
**repositorio** público. Y construir en público tiene una consecuencia incómoda a propósito: lo
que no está terminado no puede presentarse como si lo estuviera. Una idea se declara en
exploración; una pieza terminada lleva sus cifras, sus límites y sus «nunca» en la ficha.

Publicar no es divulgar sin límites: no publico credenciales, datos internos de organizaciones ni
información de terceros; lo aprendido en un empleo se reformula como principio, nunca como dato
del cliente. Un barrido de secretos bloquea cada publicación, y el sitio no entrega ninguna URL
de producción por regla.

## Qué hay construido

<!-- seccion: que-hay-construido -->

La **vitrina** reúne **32 piezas** en cuatro familias: **seis aplicaciones hermanas** —más CV Viva,
que es este mismo sitio y no una pieza del escaparate—, **13 agentes**, **7 investigaciones** y
**6 tableros**. Todas las aplicaciones alcanzaron su MVP y están en operación sostenida, y
siguen evolucionando; **Hablemos San** es la más avanzada y la única sellada, desde agosto de 2026.

| Aplicación        | Qué demuestra                                                                 |
| ----------------- | ----------------------------------------------------------------------------- |
| **Velo**          | procesamiento de 500.000 filas sin que el archivo salga del navegador          |
| **Dash Agent AI** | qué contexto conserva un agente sobre la persona, sin una llamada de red; retiró una función de 83 sugerencias que no ayudaban |
| **Probeta DS**    | Python, Pandas y scikit-learn en el navegador con **Pyodide** (WebAssembly)    |
| **Hablemos San**  | 50 cápsulas y 16 hitos de contenido con 169 pruebas de extremo a extremo       |
| **Innmobiliaria** | flujos de negocio con validación y 98 % de cobertura                           |
| **Nutri-Kids**    | un motor de cálculo con 99,5 % de cobertura                                    |

Las pruebas, coberturas y ADR de cada una están en el documento sobre cómo aprendo; los agentes,
los tableros y las investigaciones tienen cada uno su documento. Cada cifra publicada en una
ficha declara su naturaleza: **medida**, **calculada**, **declarada** o **estimada**, y una cifra
sin fuente no entra.

## La fábrica, en números

<!-- seccion: la-fabrica-en-numeros -->

El pipeline funciona con **dos casas**: una **planeadora**, privada, donde viven el plan, la
visión y las órdenes de construcción de cada app; y el repositorio de cada app, donde vive el
código y desde donde se lee el avance. Ninguna app avanza sin dos aprobaciones escritas —la
prioridad vigente y la visión con sus funcionalidades inventariadas— y ningún sprint cierra sin
un resumen. Este sitio lleva **ocho sprints cerrados** así.

Lo coordina la **Fábrica de AI-APPs**, un agente sellado que es también una pieza de la vitrina,
con tres límites declarados: no escribe código de producción, no ha corrido un lanzamiento ni una
operación reales, y no tiene librerías compartidas entre apps. Los kits de arranque de cada app
salen de un mismo **kit** versionado, cuyas lecciones se acumulan.

Cada cambio pasa por **cuatro jobs de integración continua** —calidad, integración, extremo a
extremo y Lighthouse con presupuesto de rendimiento— y por un barrido de secretos. Dos precedentes
lo endurecieron: el 15 de julio de 2026, una carnada floja de gitleaks dio dos «todo bien» falsos
seguidos, y desde entonces la carnada canónica se verifica; y en el sprint 3 una credencial del
proveedor devolvió 401 en la integración, que es por lo que hoy toda credencial pasa un humo antes
de construir contra ella.

La infraestructura está dibujada en un blueprint con su **costo real: US$0 al mes**, y con su
**punto único de falla** declarado. Hay **20 decisiones de arquitectura (ADR)** registradas en el
repositorio de este sitio. **Cero enlaces**: la producción se muestra, no se entrega; el CTA
público es una lista de espera.

## El contrato de las fichas

<!-- seccion: el-contrato-de-las-fichas -->

Este sitio es el destino, no el autor, de lo que muestra. Las fichas de las apps las administra
la planeadora; las de agentes, investigaciones y tableros las produce quien construye cada pieza,
contra un **contrato de ficha técnica** publicado desde el esquema Zod —versión vigente **v1.3.1**—
y llegan por copia en un PR de contenido sin sprint, que la CI valida: esquema, cero enlaces,
accesibilidad y pruebas.

Una ficha que no valida no se corrige aquí ni para que quepa: se reporta archivo, campo y regla,
y se corrige en origen. Si varias no caben por una razón legítima, el contrato crece de forma
aditiva; así nacieron sus últimas versiones. Un solo contrato y un solo renderizador: nada
específico de un frente vive en el componente.

## Código primero, inteligencia artificial cuando está justificada

<!-- seccion: codigo-primero -->

Regla 13 del pipeline: no incorporar IA generativa por defecto. Antes de usar un modelo hay que
demostrar qué característica del problema exige interpretación, generación, recuperación
contextual o coordinación flexible, y por qué el código no alcanza; activar una funcionalidad
generativa exige una decisión de arquitectura escrita.

La consecuencia son soluciones híbridas: el código administra validaciones, contratos y
transformaciones; el modelo interviene donde hace falta interpretar o generar, con fallback
determinista. Es la regla que este sitio aplica a su propio chat, y controla la deuda: una
función generativa introduce dependencias, costo, variabilidad y necesidad de evaluación que no
se asumen sin propósito.

## Un control se demuestra fallando

<!-- seccion: control-en-rojo -->

Regla 14, la segunda: todo control nuevo —un job de CI, una aserción, un umbral, un gate de contenido—
nace con su demostración en rojo, en el mismo commit y registrada en la bitácora: qué se rompió
a propósito, qué salió rojo y a quién nombró. Un control que nunca se vio fallar es decorado, y
decorado que da falsa tranquilidad.

Tres preguntas se le hacen a cada gate: ¿lo viste fallar?, ¿lo viste correr? —un job saltado no
es verde— y ¿puede fallar siquiera?, porque un gate que otra regla vuelve inalcanzable se retira.
La misma lógica vale para agentes: no basta que respondan; hay que ver la prueba reconocer la
fuente equivocada, el formato roto o la afirmación sin evidencia.

## Esta misma página también es una aplicación

<!-- seccion: esta-misma-pagina -->

**CV Viva** forma parte del portafolio: una aplicación en **Next.js** con generación estática,
bilingüe, construida en 8 sprints, con **pruebas automatizadas** en tres niveles, accesibilidad verificada, presupuesto
de rendimiento y **despliegue** continuo. El contenido vive en archivos versionados validados con
un esquema en el build: si está malformado, el build falla, no la página.

Incluye un chat con recuperación aumentada (**RAG**) que responde solo con la evidencia publicada
y cita hacia lo visible; cómo funciona por dentro, con sus números, está en su documento.

## Lo que permanece en exploración

<!-- seccion: en-exploracion -->

Dos exploraciones están declaradas con esa palabra a propósito, y no cuentan entre las 32 piezas: una solución analítica
de extremo a extremo sobre Microsoft Fabric con datos abiertos de Colombia, y un agente autónomo
sobre Gemini y Vertex AI, el complemento multi-nube de mi ruta de certificación en Azure. Ninguna
cambia de estado por tener una interfaz que funciona: la condición de salida —propósito
verificable, arquitectura documentada, controles, evidencia— se define antes de empezar.
