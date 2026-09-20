---
slug: certificaciones
titulo: "Certificaciones — el camino desde el DP-600"
resumen: "Cinco credenciales obtenidas —DP-600 de Microsoft Fabric en diciembre de 2024 y cuatro de IBM en ciencia de datos— y dos rutas en curso desde julio de 2026: AI-103 (aplicaciones y agentes) y AI-300 (MLOps), que reemplaza al DP-100 retirado."
estado: aprobado
ancla: "#certificaciones"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué certificaciones tiene Henry?"
  - "¿Qué es el DP-600 y qué demuestra?"
  - "¿Qué rutas de certificación tiene en curso Henry?"
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

<!-- guía (viene del esqueleto de la historia, S3 — la escribió el dueño):
Por qué elegiste estas certificaciones, cómo las preparaste, qué
sabes hacer gracias a cada una, cómo se conectan entre sí y con tu trabajo. -->

## Las credenciales, en una tabla

<!-- seccion: la-tabla -->

| Código     | Nombre oficial                                                        | Estado                      | Fecha                    |
| ---------- | --------------------------------------------------------------------- | --------------------------- | ------------------------ |
| **DP-600** | Microsoft Certified: Fabric Analytics Engineer Associate              | **obtenida, vigente**       | diciembre de 2024        |
| **AI-103** | Microsoft Certified: Azure AI Apps and Agents Developer Associate     | en curso, 21 módulos        | desde julio de 2026      |
| **AI-300** | Microsoft Certified: Machine Learning Operations Engineer Associate   | en curso, 10 módulos        | desde julio de 2026      |
| IBM        | Ciencia de Datos Aplicada con R                                       | obtenida                    | enero – noviembre de 2024 |
| IBM        | Certificado Profesional en Ciencia de Datos                           | obtenida                    | mayo – noviembre de 2022 |
| IBM        | Python para Ciencia de Datos                                          | obtenida                    | junio – septiembre de 2022 |
| IBM        | SQL para Ciencia de Datos                                             | obtenida                    | septiembre – noviembre de 2022 |

**Cinco credenciales obtenidas** —el DP-600 y cuatro de IBM— y **dos rutas en curso**: en este momento me estoy certificando en el AI-103 y en el AI-300. Dos códigos
que aparecen en mi historia y no en la tabla: el **AI-102**, que Microsoft descontinuó y cuya ruta
es hoy el AI-103, y el **DP-100**, que Microsoft retiró el 1 de junio de 2026 y cuyo reemplazo
declarado es el AI-300. Ninguno de los dos se presenta como obtenido.

## El DP-600: la plataforma analítica que sostiene mi perfil

<!-- seccion: el-dp-600 -->

Preparé el **DP-600** entre julio y noviembre de 2024 y obtuve la credencial en **diciembre de
2024**, mientras trabajaba a tiempo completo y construía en Vesting un ecosistema de datos sobre
**Microsoft Fabric**. Fabric llevaba menos de un año en disponibilidad general: no estudiaba una
plataforma en abstracto, formalizaba lo que aplicaba cada día.

La certificación valida diseñar, construir y administrar soluciones analíticas **end-to-end**
sobre Fabric: preparar y transformar datos, administrar **lakehouses** y **warehouses**,
implementar y optimizar **modelos semánticos**, proteger y gobernar la información, y consultar
con **SQL**, KQL y **DAX**.

Su mayor valor, para mí, está en la profundidad que da al modelo semántico: la capa que organiza
las entidades del negocio, preserva sus relaciones, centraliza las métricas y hace que distintos
productos usen las mismas definiciones. Ahí convergen la ingeniería industrial —entender qué
procesos, recursos y decisiones hay que representar— y la especialidad en **Power BI**.

Hoy respalda mi trabajo en la Fundación CTIC: 42 productos analíticos para líderes
administrativos y asistenciales, sobre una arquitectura que integra datos, analítica e IA con
los mismos principios de trazabilidad y gobierno. Cómo se usa Fabric por dentro está en su
documento.

## El AI-103: desarrollar aplicaciones y agentes de inteligencia artificial

<!-- seccion: el-ai-103 -->

Desde **julio de 2026** curso la ruta del examen **AI-103**, que conduce a **Microsoft Certified:
Azure AI Apps and Agents Developer Associate**: llevo 21 módulos. No la presento como obtenida:
mientras no apruebe el examen es una certificación **en curso**.

Su enfoque es el diseño, desarrollo e implementación de aplicaciones generativas y agentes sobre
Azure y **Microsoft Foundry** (antes Azure AI Foundry): modelos, recuperación de conocimiento,
herramientas, evaluación y responsabilidad. Sustituye el espacio del AI-102, pero no es su
equivalente: incorpora de forma explícita lo generativo y lo agéntico.

Se conecta con Vesting —donde aprendí que un agente no es un prompt conectado a un modelo, sino
un propósito, unas fuentes autorizadas, unas herramientas, unos límites y una evidencia— y con
mi responsabilidad en CTIC, donde evaluar una propuesta de IA exige saber cómo se construye.

Para preparar esta ruta construí la **Super guía AI-103**, uno de los 13 agentes de la vitrina:
un mapa de cobertura contra los dominios oficiales, con cada contenido ligado a documentación
vigente y fechada. Es mi método de aprendizaje convertido en herramienta pública.

## El AI-300: llevar la inteligencia artificial a una operación confiable

<!-- seccion: el-ai-300 -->

Desde **julio de 2026** curso también la ruta del examen **AI-300**, que conduce a **Microsoft
Certified: Machine Learning Operations Engineer Associate**: llevo 10 módulos, y es una
certificación **en curso**.

Su enfoque es la operación: **MLOps** y **GenAIOps** en Azure —infraestructura para el ciclo de
vida de los modelos, despliegue, evaluación, observabilidad, automatización y control de costos
de aplicaciones generativas y agentes—. Es el tercer componente de la especialización: el DP-600
organiza los datos, el AI-103 construye la solución, el AI-300 la opera.

Responde a una diferencia que aprendí en la práctica: desarrollar una solución de IA y operarla
de manera confiable son dos capacidades distintas. En Vesting construí la plataforma que
observaba 23 agentes en producción; en CTIC, el ciclo de vida forma parte del sistema de gestión.
Mientras UNE-ISO/IEC 42001 estructura el sistema institucional, el AI-300 aporta los mecanismos
técnicos que lo hacen operable.

Ocupa el lugar del **DP-100**: Microsoft retiró esa certificación el 1 de junio de 2026 y declaró
el AI-300 como su reemplazo.

## Las credenciales de IBM: la base de ciencia de datos

<!-- seccion: las-de-ibm -->

Mi base en ciencia de datos son **cuatro credenciales de IBM**, en dos etapas y alrededor de los
tres lenguajes del análisis: **Python**, **SQL** y **R**.

En **2022** completé el Certificado Profesional en Ciencia de Datos, Python para Ciencia de Datos
y SQL para Ciencia de Datos, entre mayo y noviembre, en los meses en que dediqué el tiempo entre
dos empleos a estudiar. Python me dio el flujo reproducible de un problema analítico, de la
exploración al entrenamiento y la evaluación con Pandas, NumPy, Matplotlib y scikit-learn; SQL, la
capacidad de interrogar la información donde vive.

En **2024** complementé la base con Ciencia de Datos Aplicada con R: análisis estadístico,
modelado predictivo, pruebas de hipótesis y visualización con ggplot2. No fue acumular otro
lenguaje: fue fortalecer el razonamiento estadístico y la disciplina para distinguir un patrón
observado de una relación demostrable.

Sobre esa base construí después los modelos de demanda de TransMilenio y los de fuga, mora y
riesgo de Banco Pichincha.

## Cómo se conectan

<!-- seccion: como-se-conectan -->

Las cinco credenciales obtenidas y las dos rutas en curso son una arquitectura de capacidades,
no una colección de títulos. La ciencia de datos permite aprender de la información; el DP-600
la convierte en una capacidad analítica gobernada; el AI-103 construye soluciones que usan
modelos, lenguaje, conocimiento y herramientas; el AI-300 las opera con evaluación y observabilidad.

Elijo una certificación cuando formaliza una capacidad que ya estoy aplicando o cierra un tramo
que ya recorro: el DP-600 acompañó a Fabric en Vesting; el AI-103, a los agentes; el AI-300, a
su operación. El examen valida una estructura de conocimientos; el trabajo demuestra que sé
usarla. El ritmo con el que las obtuve, con fechas, está en el documento sobre cómo aprendo.
