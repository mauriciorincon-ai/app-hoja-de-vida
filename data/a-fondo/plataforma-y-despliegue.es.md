---
slug: plataforma-y-despliegue
titulo: "Plataforma y despliegue"
resumen: "Dónde tengo profundidad de plataforma —Microsoft: Fabric, Power BI, Microsoft Foundry—, qué despliego y opero yo mismo con Git, GitHub Actions, CI/CD, Vercel y Sentry, lo que no he hecho dicho sin rodeos —Docker, Kubernetes, Vertex AI, BigQuery— y cómo cubro esa brecha."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry con la nube?"
  - "¿Sabe Henry de contenedores, Kubernetes o Google Cloud?"
  - "¿Sabe de integración continua y despliegue automático?"
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

## Mi profundidad de plataforma está en Microsoft

<!-- seccion: el-mundo-microsoft -->

Mi experiencia en la **nube** está en el ecosistema **Microsoft** y en **Azure**, y ahí está la
profundidad:
**Microsoft Fabric**, **Power BI**, modelos semánticos, lakehouses, warehouses y pipelines, y hoy
**Microsoft Foundry** (antes Azure AI Foundry) para aplicaciones generativas y agentes, que es el
terreno de la ruta AI-103.

No es una lista de servicios. En Vesting diseñé desde cero sobre Fabric el ecosistema de datos que
integraba los eventos de 27 agentes de IA para 12 clientes —120 tablas, 20 GB, 1.000 eventos por
día— y lo convertía en capacidad analítica para producto y operaciones. El recorrido completo:
cómo ingresaban los eventos, qué se conservaba, qué transformaciones se compartían, cómo se
representaban las entidades y cómo llegaban los resultados a los modelos semánticos y a Power BI,
con una base común capaz de aceptar cada integración nueva sin perder trazabilidad.

El DP-600 valida ese núcleo. Y la mirada es de ingeniero industrial: la plataforma como un sistema
de producción de información, con entradas, transformaciones, restricciones, controles y
consumidores, optimizado como recorrido y no por componente. El detalle está en el documento de
Fabric.

## Lo que despliego y mantengo directamente

<!-- seccion: lo-que-despliego -->

Mantengo un portafolio de aplicaciones públicas construidas y desplegadas por mí: **seis
aplicaciones hermanas** —Velo, Dash Agent AI, Probeta DS, Hablemos San, Innmobiliaria y
Nutri-Kids— más CV Viva, este sitio. Todas están en operación sostenida y comparten la misma
cadena:

- **Git** y GitHub como fuente de verdad, con commits convencionales y decisiones en ADR;
- **integración y despliegue continuos (CI/CD)** con **GitHub Actions**: pruebas unitarias, de
  integración y de extremo a extremo, accesibilidad, presupuesto de rendimiento y un barrido de
  secretos que bloquea la publicación si algo falla;
- despliegue en **Vercel**, con vista previa por cada cambio y producción desde la rama principal;
- observabilidad con **Sentry** y registro estructurado, para saber qué falló y dónde.

La integración continua es un mecanismo de calidad, no una automatización de despliegue: si un
control cae, la publicación se detiene. Las pruebas son reales —Velo tiene 740 unitarias y 96 %
de cobertura; Dash Agent AI, 693; Hablemos San, 169 de extremo a extremo— y las cifras se
sincronizan con los repositorios porque su valor depende de que sean verificables. No uso el
número de pruebas como sustituto de la calidad: cada control se relaciona con una condición
concreta y se observa fallando antes de confiar en él.

Estos despliegues tienen consecuencias: un cambio malo rompe una experiencia pública. Esa
responsabilidad me obliga a diseñar prevención, detección, reversión y aprendizaje sin un equipo
de infraestructura detrás.

## Operar inteligencia artificial exige una disciplina adicional

<!-- seccion: desplegar-y-operar-ia -->

Desplegar aplicaciones y operar IA comparten fundamentos —versiones, automatización, pruebas,
observabilidad—, pero una solución inteligente añade componentes probabilísticos que evolucionan
solos: datos, modelos, contexto, herramientas. Su evaluación considera variabilidad,
fundamentación, uso de herramientas, consumo, latencia y comportamiento ante información
incompleta.

Por eso distingo desplegar una aplicación de operar una capacidad de IA: la segunda exige saber
no solo si el servicio está disponible sino si sigue cumpliendo su propósito, si usa las fuentes
autorizadas, si conserva sus límites y si el costo sigue siendo proporcional al valor. En Vesting
construí la plataforma que observaba 23 agentes a la vez en producción; en mi ecosistema propio,
ARKHÉ, cada agente corre con harnesses, validadores y mecanismos de recuperación. La ruta
**AI-300** —MLOps y GenAIOps— formaliza esa disciplina.

## Lo que no he hecho, dicho sin rodeos

<!-- seccion: lo-que-no-he-hecho -->

**Google Cloud** —**Vertex AI**, **BigQuery**, despliegue productivo en ese ecosistema— y
**contenedores en producción** con **Docker** y **Kubernetes** no están en mi experiencia
profesional. Mi mundo es Microsoft y en Microsoft es donde tengo la profundidad. Kubernetes lo
conozco como estudio, no como operación.

De **MLOps** tengo una mitad y no la otra, y conviene decir cuál. La mitad de llevar modelos a
producción y sostenerlos la he hecho: modelos predictivos en producción en banca y en
transporte, el monitoreo en tiempo real de agentes de IA en Vesting, y seis aplicaciones hermanas y este sitio con integración continua, controles que bloquean la
publicación y despliegue automático, operadas por mí. La mitad de empaquetar y orquestar con contenedores, no.

Prefiero decirlo así, de frente, que esconderlo en una lista de herramientas. Un currículum que
nombra treinta tecnologías no distingue las cinco que domina de las veinticinco que ha visto, y
quien entrevista lo descubre en diez minutos.

## Por qué esa brecha es más chica de lo que parece, y cómo la cubro

<!-- seccion: como-la-cubro -->

Dos razones. La primera es de equivalencia: un lago sobre almacenamiento distribuido, un almacén
analítico columnar, un orquestador de pipelines y una capa semántica existen en las tres nubes
con nombres distintos. Lo que hice con lakehouse y warehouse sobre OneLake se llama BigQuery y
Vertex AI del otro lado; lo que no se traduce solo son identidad, costos y operación, y eso se
aprende operando.

La segunda es de método, y tiene fechas: el DP-600 en cinco meses sobre un Fabric con menos de un
año en el mercado; Codex, Antigravity y Claude Code en un mes desde su salida; seis aplicaciones hermanas y este sitio, con tecnologías que no había usado —WebAssembly,
procesamiento local, despliegue en el borde—, construidas y publicadas. El documento «Cómo aprendo» lo detalla.

**Google Cloud es hoy una exploración declarada**, no una capacidad: en mi pipeline hay una pieza
llamada «Agente autónomo con Gemini y Vertex AI», pensada como el complemento multi-nube de mi
ruta de certificación en Azure. Está en exploración con esa palabra a propósito y sin horizonte
comprometido; cuando esté construida, será evidencia.

## Lo que aporto a un equipo de plataforma

<!-- seccion: lo-que-traigo -->

Arquitectura de datos de extremo a extremo diseñada desde cero, en Vesting. Gobierno montado
tres veces: banca, plataforma de agentes y salud. Monitoreo de agentes en producción. Modelado
semántico y optimización de consultas con DAX Studio y Tabular Editor. Agentes desde dos lados:
el proceso con el que se construyeron 27 en un entorno profesional, y ARKHÉ, mi ecosistema propio
de harnesses, recuperación selectiva, herramientas, contratos y evaluación. Seis aplicaciones hermanas y este sitio, públicas y operadas con CI/CD, pruebas, accesibilidad y
presupuestos de rendimiento.

Y la costumbre, que viene de ISO 9001 y se quedó, de que lo hecho tenga su rastro escrito:
decisiones de arquitectura registradas, controles que se demuestran fallando, y cada cifra con
su procedencia.
