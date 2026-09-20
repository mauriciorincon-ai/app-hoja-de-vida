---
slug: como-aprendo
titulo: "Cómo aprendo"
resumen: "El argumento con medida: el DP-600 en cinco meses sobre un Fabric con menos de un año en el mercado, Codex, Antigravity y Claude Code en un mes desde su salida, este sitio en ocho sprints desde julio de 2026, y 32 piezas públicas con sus pruebas y coberturas."
estado: aprobado
ancla: "#certificaciones"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué tan rápido aprende Henry una tecnología nueva?"
  - "¿Qué evidencia tiene Henry de que aprende rápido?"
  - "¿Cuánto tardó en obtener la certificación de Fabric?"
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

## Por qué existe este documento y cómo decido qué aprender

<!-- seccion: por-que-existe-y-como-decido -->

Un currículum es una fotografía, y en datos e IA la fotografía envejece en meses. Mi valor no
puede depender solo de la lista de herramientas que ya usé: tiene que demostrar que incorporo
lo que todavía no sé, con profundidad y en plazos medibles. Este documento no afirma que aprendo
rápido; muestra las fechas.

Decido qué aprender con cuatro criterios de ingeniería industrial —los recursos son limitados y
se asignan por valor, restricción y resultado—:

- **Necesidad concreta.** El DP-600 acompañó la construcción de la plataforma de Vesting; el
  AI-103 acompaña a los agentes; el AI-300, a su operación.
- **Permanencia.** Los principios de arquitectura, modelado, evaluación y seguridad duran más
  que la herramienta que los implementa.
- **Evidencia.** Una ruta merece prioridad si termina en una certificación, una aplicación, una
  arquitectura, una investigación o un componente que alguien pueda examinar.
- **Costo de oportunidad.** Cada capacidad nueva compite con productos y responsabilidades en curso.

## La evidencia de las certificaciones

<!-- seccion: evidencia-certificaciones -->

Tengo **cinco credenciales obtenidas** —el **DP-600** de Microsoft Fabric y cuatro de IBM— y dos
rutas en curso, AI-103 y AI-300, desde julio de 2026. La tabla completa está en el documento de
certificaciones; aquí importa el ritmo.

El caso que mejor lo mide es el DP-600. Lo preparé entre **julio y noviembre de 2024**, cinco
meses, mientras trabajaba a tiempo completo en Vesting, y lo obtuve en diciembre. Microsoft
Fabric llevaba entonces **menos de un año en disponibilidad general**: no había cursos maduros ni
comunidad consolidada, y la documentación cambiaba cada semana. Me certifiqué sobre la misma
plataforma en la que estaba construyendo el ecosistema de datos de la startup, y esa es la
diferencia entre estudiar y formalizar lo que ya se aplica.

Las cuatro de IBM siguen el mismo patrón: tres en 2022 —el Certificado Profesional en Ciencia de
Datos, Python y SQL, entre mayo y noviembre— en los meses que dediqué a estudiar entre dos
empleos, y R en 2024, en paralelo al DP-600. Las certificaciones prueban disciplina y dominio de
un marco; no las uso como sustituto de la experiencia, sino como su formalización.

## Los plazos, con fechas

<!-- seccion: los-plazos -->

Las últimas veces que aprendí algo desde cero, y cuánto tardé:

| Qué                                   | Desde                  | Plazo                                | Resultado                                              |
| ------------------------------------- | ---------------------- | ------------------------------------ | ------------------------------------------------------ |
| Microsoft Fabric                      | agosto de 2023         | 5 meses de estudio (jul–nov 2024)    | DP-600 en diciembre de 2024, plataforma de Vesting operando |
| Next.js y el pipeline de aplicaciones | julio de 2026          | 8 sprints                            | este sitio, CV Viva, con su CI, sus pruebas y sus ADR   |
| AI-103 y AI-300                       | julio de 2026          | 21 y 10 módulos a la fecha           | dos rutas en curso, con la Super guía AI-103 publicada |
| Codex, Antigravity y Claude Code      | desde su salida        | cerca de un mes cada uno             | el pipeline con el que se construyen las 32 piezas     |

No son cursos terminados: son capacidades en uso, cada una con un artefacto que alguien puede
abrir.

## La evidencia de lo construido

<!-- seccion: evidencia-construido -->

La prueba más contundente es lo construido, porque cada pieza tiene pruebas, cobertura y
decisiones registradas. Mi portafolio reúne **seis aplicaciones hermanas** —más CV Viva, este
sitio— y todas alcanzaron su MVP y siguen evolucionando; Hablemos San es la más avanzada:

| Aplicación     | Pruebas automatizadas | Cobertura   | Decisiones (ADR) | Lo que exigió aprender                          |
| -------------- | --------------------: | ----------: | ---------------: | ----------------------------------------------- |
| Velo           | 740 unitarias, 153 e2e | 96,17 %    | 8                | procesamiento local sin servidor, 500.000 filas |
| Dash Agent AI  | 693                   | 97,5 %      | 13               | agentes sobre Power BI                          |
| Probeta DS     | 267 unitarias, 24 e2e  | 90,69 %    | 8                | Python, Pandas y scikit-learn en el navegador con WebAssembly |
| Hablemos San   | 261 unitarias, 169 e2e | 94,02 %    | 14               | 50 cápsulas y 16 hitos de contenido             |
| Innmobiliaria  | 172 unitarias, 76 e2e  | 98,31 %    | 6                | flujos de negocio con validación                |
| Nutri-Kids     | 214 unitarias, 94 e2e  | 99,52 %    | 7                | un motor de cálculo con cobertura casi total    |

A las seis aplicaciones se suman **13 agentes** publicados, **7 investigaciones** y **6 tableros**
sobre datos públicos: **32 piezas** en cuatro familias, cada una con una forma distinta de
aprender. Las aplicaciones exigen convertir tecnología nueva en experiencia usable; los agentes,
entender modelos, fuentes, herramientas y evaluación; las investigaciones, método y
reproducibilidad; los tableros, rigor con datos que cualquiera puede verificar.

Las cifras salen de los repositorios y se sincronizan con ellos; están en la vitrina, con su
procedencia. Y el portafolio acumula: cada pieza reutiliza decisiones, componentes y pruebas de
la anterior.

## Cómo aprendo en concreto

<!-- seccion: como-aprendo-en-concreto -->

Empiezo por un problema pequeño, real y lo bastante exigente para obligarme a usar la capacidad
nueva con profundidad —con Fabric, en 2024, fue el monitoreo de un solo agente—, con un resultado que pueda juzgarse: qué debe hacer, bajo qué condiciones
y cómo se sabe que funcionó. No reproduzco todas las posibilidades de una plataforma; construyo
una pieza que la use bien.

Voy a las fuentes oficiales primero: la documentación primaria es más lenta al comienzo y evita
depender de explicaciones desactualizadas. Tutoriales y comunidades son apoyo, no autoridad;
cuando dos explicaciones difieren, reproduzco el comportamiento y decido con evidencia.

Avanzo en ciclos cortos —construir, observar, encontrar el vacío, ampliar— y **documento desde
el primer día**: decisiones, supuestos, pruebas y problemas. Lo que no se escribe hay que
redescubrirlo; lo que se escribe se vuelve guía, componente o plantilla. Y distingo familiaridad
de dominio: solo declaro una capacidad cuando la usé para producir algo que se puede examinar.

Dos reglas del pipeline gobiernan lo que construyo, y viven en su documento: código primero, IA
generativa solo cuando está justificada; y todo control se demuestra fallando antes de confiar
en él.

## Cómo sé que aprendí

<!-- seccion: criterios-de-aprendizaje -->

Seis criterios, y una capacidad no está aprendida hasta cumplir los seis:

1. **Funcional:** la pieza resuelve el problema y supera escenarios representativos, no solo el recorrido ideal.
2. **Arquitectónico:** puedo justificar cada componente, sus dependencias y por qué se eligió.
3. **Operacional:** puedo desplegarla, observarla y mantenerla, y sé qué pasa cuando falla una dependencia.
4. **Documental:** decisiones, configuraciones y pruebas quedan escritas; el aprendizaje no depende de mi memoria.
5. **De transferencia:** puedo convertirlo en una guía, un componente o una explicación que otro use.
6. **De límites:** puedo declarar qué sé hacer, qué fue probado y qué sigue en exploración.

Para una organización esto significa que mi capacidad no se limita al inventario de tecnologías
que ya usé. Cuando un rol exige algo nuevo, no pido que se ignore la diferencia: muestro un
método probado, con fechas, para convertirla en capacidad aplicable y documentada.
