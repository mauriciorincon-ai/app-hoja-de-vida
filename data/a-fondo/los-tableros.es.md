---
slug: los-tableros
codigo: AF-23
titulo: "Los tableros: datos públicos, verificados"
resumen: "Seis tableros sellados sobre datos abiertos —banca, empresas, ciclo monetario, gasto del Estado, energía y clima, Fórmula 1— construidos con Power BI Desktop, Power Query, DAX, PBIR escrito por script y Python, con las identidades del origen corridas enteras y los límites a la vista."
cuando_usar: "Úsalo cuando pregunten por los seis tableros publicados con datos abiertos (energía y clima, ciclo monetario, banca colombiana, empresas de Colombia, gasto del Estado, Fórmula 1), cómo verifica las cifras que publica, estados financieros y datos contables, Power Query, DAX y el rigor de cada tablero."
estado: aprobado
ancla: "/vitrina/tableros"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué tableros ha publicado Henry?"
  - "¿Cómo verifica Henry que los datos de un tablero son correctos?"
  - "¿Ha trabajado con datos abiertos o fuentes públicas?"
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

## Qué son y por qué existen

<!-- seccion: que-son -->

He construido desde cero seis tableros analíticos sobre fuentes de datos públicas y los he publicado en la vitrina de este sitio con sus respectivas fichas técnicas. Los seis están sellados —se sellaron entre el 6 y el 8 de septiembre de 2026, tras siete fases de construcción cada uno— y cada uno aborda un universo diferente, pero todos siguen el mismo principio: los datos deben poder rastrearse hasta su origen, el modelo debe superar controles verificables y la visualización debe comunicar con claridad tanto sus resultados como sus límites.

No los concibo como ejercicios de diseño ni como demostraciones aisladas de Power BI. Cada tablero representa un producto analítico completo que comienza con la identificación y evaluación de las fuentes, continúa con la limpieza, integración y transformación de los datos, y termina en un modelo semántico capaz de sostener indicadores, comparaciones y recorridos de análisis: doce páginas por tablero, seis en español y seis en inglés, generadas desde el mismo modelo y el mismo juego de medidas.

La diferencia entre una visualización y un producto analítico se encuentra en todo aquello que ocurre antes de la primera pantalla. Una gráfica puede construirse sobre una tabla preparada manualmente y producir una impresión convincente. Un producto analítico necesita conservar la procedencia, documentar sus transformaciones, comprobar sus relaciones y demostrar que los resultados presentados continúan siendo consistentes con el universo de origen.

Estos tableros existen por la misma razón que mis aplicaciones, agentes e investigaciones: un currículum afirma; una pieza publicada permite verificar. Decir que tengo experiencia en ingeniería de datos, modelos semánticos y Power BI comunica una capacidad. Publicar un tablero cuyas cifras pueden contrastarse con las fuentes demuestra cómo aplico esa capacidad.

## Datos abiertos: cualquiera puede reproducir los cálculos

<!-- seccion: datos-abiertos-reproducibles -->

El carácter público de los datos introduce una exigencia adicional. Cualquier persona puede descargar las fuentes, reproducir los cálculos y cuestionar las decisiones de modelado. Esa posibilidad no debilita las piezas. Es precisamente lo que les concede valor como evidencia profesional.

Las fuentes tienen nombre y dueño en cada ficha. El plan de cuentas completo de cada entidad vigilada que publica la Superintendencia Financiera, mes a mes. Los estados financieros que las sociedades reportan a la Superintendencia de Sociedades, de 2018 a 2025, descargados del portal de datos abiertos del Estado colombiano. La tasa de política de cuarenta bancos centrales, la curva de rendimientos de Estados Unidos publicada por separado por la Reserva Federal y el Tesoro, los precios de la OCDE y las proyecciones del FMI: siete organismos que producen cada dato, sin pasar por ningún agregador. El presupuesto de la Nación y la contratación pública. Siete fuentes abiertas de energía y clima —entre ellas las series de temperatura de la NASA y la NOAA, la agencia internacional de la energía y el Banco Mundial— con la licencia de cada una declarada. Y los 47 archivos de la historia de la Fórmula 1 de F1DB, versión 2026.13.0, bajo licencia CC BY 4.0.

Ninguna de esas fuentes está pensada para análisis integrado, y esa es la parte del trabajo que un tablero bonito esconde: el origen de banca trae dieciséis trampas medidas antes del modelo; el de empresas, nueve; el del gasto público, nueve; el de la Fórmula 1, veintiuna. Todas están contadas en su ficha, y las que cambian una cifra publicada se explican en el propio tablero.

También me obliga a diferenciar con claridad entre aquello que los datos muestran y aquello que no permiten concluir. Una fuente pública puede tener una gran cobertura y conservar limitaciones metodológicas, temporales o conceptuales. El tablero no debe eliminar esas limitaciones para producir una narrativa más atractiva. Debe hacerlas visibles para que el usuario comprenda el alcance real de sus conclusiones.

Los seis tableros constituyen, por tanto, una demostración pública de un método: obtener datos, comprender su estructura, reconstruir sus relaciones, verificar sus identidades, modelar su significado y convertirlos en una experiencia de análisis que pueda ser examinada por otras personas.

## Los seis universos

<!-- seccion: los-seis -->

| Tablero                                             | Universo                                                                                    | La identidad que cierra                                                                                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Banca colombiana bajo la lupa**                   | 11 años de estados financieros de las 81 entidades de crédito; 1.094 municipios con oficina | el balance cierra en **7.779 de 7.779** combinaciones; la solvencia se reproduce en 3.809 de 3.811                                                     |
| **Las empresas de Colombia en cifras**              | 8 años, 39.276 sociedades, 224.190 declaraciones, 6.443.634 filas de hechos                 | descuadre en las cuatro identidades contables: **0 pesos**; cobertura del ranking de las 10.000 mayores: 84,9 %                                        |
| **Tasas, inflación y deuda: el ciclo monetario**    | 27 años, 41 áreas, 7 organismos                                                             | las dos fuentes oficiales de la curva de EE. UU. coinciden en **71.999 de 71.999** pares                                                               |
| **¿En qué gasta el Estado colombiano y con quién?** | 4.373.766 contratos y 8 años de presupuesto nacional                                        | la cifra de control validada contra la apropiación que aprobó el Congreso; **21 contratos** con valores imposibles, excluidos y publicados uno por uno |
| **Energía y clima**                                 | 7 fuentes abiertas, 1.925.420 filas de hechos, 12 páginas en dos idiomas                    | **43 medidas DAX** validadas una por una; 0 de 354 referencias rotas entre reporte y modelo                                                            |
| **Fórmula 1: 77 temporadas contadas bien**          | 917 pilotos, 186.216 filas en 25 tablas                                                     | **20 de 20** identidades del origen reproducidas; 0 errores en cinco capas de validación                                                               |

Cada uno tiene además una cifra que solo se ve corriendo el universo entero: la cuenta de «ingresos» de la banca contiene 506,5 billones de los que el 56 % es valoración bruta de derivados, y sumar lo acumulado infla un resultado anual 6,39 veces; el 77 % de los contratos públicos se adjudica sin competencia, aunque en dinero sea el 52 %; solo 3 de 11 bancos centrales tienen la tasa por debajo de su inflación; la caída de la economía real en 2020 fue del 7,4 % y no del 2,2 % que dice el agregado.

Aunque los seis tableros pertenecen a dominios muy distintos, todos exigen las mismas capacidades fundamentales: comprender las fuentes, establecer una unidad de análisis, conservar granularidad, crear relaciones, definir medidas, verificar resultados y diseñar una experiencia que no exceda la evidencia disponible.

## Banca colombiana bajo la lupa: once años y 81 entidades

<!-- seccion: banca-colombiana -->

El primer tablero, Banca colombiana bajo la lupa, integra once años de estados financieros correspondientes a las 81 entidades de crédito vigiladas. La pieza permite analizar la evolución del sector, comparar instituciones y recorrer las relaciones entre las principales estructuras contables: cuánto pesa la banca y quién la domina, de dónde sale la plata, la calidad de la cartera, el colchón de capital y el mapa del crédito, municipio por municipio.

El reto no consistía únicamente en acumular periodos y entidades. Era necesario conservar la correspondencia entre cuentas, instituciones y cortes, y verificar que la integración no hubiera duplicado, omitido o desalineado registros. Las identidades contables proporcionaron el mecanismo para comprobar que el modelo seguía representando correctamente la información publicada por el origen: activo igual a pasivo más patrimonio, corrido entero y no sobre una muestra, cierra en las 7.779 combinaciones de entidad y corte con un desvío máximo de 1,7·10⁻¹¹; y la relación de solvencia, recalculada desde sus componentes, se reproduce en 3.809 de 3.811 casos dentro de 0,01 puntos.

El origen trae dieciséis trampas, y las tres que más pesan cambian cifras que cualquiera daría por buenas. Las cuentas de resultado llegan acumuladas dentro del año y reinician cada enero: sumar los doce meses infla un resultado anual 6,39 veces, así que se desacumulan en Power Query conservando los flujos negativos, que son reversiones contables legítimas. La cuenta de «ingresos» contiene 506,5 billones en doce meses, de los que 283,1 son valoración bruta de derivados que del lado del gasto vale 283,9: el tablero no publica ninguna medida llamada ingresos, publica margen de intereses, comisiones netas y utilidad. Y los cuatro hechos tienen perímetros distintos —81, 63, 66 y 70 entidades— y dos periodicidades, así que nunca se mezclan en una sola cifra.

El modelo semántico tiene 16 tablas, 20 relaciones y 62 medidas DAX, cada una nombrando sus códigos de cuenta, sin columnas calculadas. Antes de tocar Power BI, un preflight independiente escrito en Python predijo nueve conteos desde los CSV crudos y acertó los nueve. Y el tablero nunca cruza entidades por nombre, solo por el par tipo y código, porque los nombres no coinciden entre datasets, ni descarga el dataset que publica los datos personales del representante legal de cada entidad.

## Las empresas de Colombia en cifras: 39.276 sociedades

<!-- seccion: empresas-de-colombia -->

El segundo tablero, Las empresas de Colombia en cifras, estudia ocho años de estados financieros de cerca de cuarenta mil sociedades: 39.276, con 224.190 declaraciones anuales, en un modelo en estrella de 6.443.634 filas de hechos. La escala introduce desafíos de estandarización, comparabilidad, cobertura y calidad que no aparecen en una muestra pequeña.

El origen trae nueve trampas —declaraciones repetidas, reenvíos, consolidados que duplican al grupo, razones sociales corruptas— y cada una está medida y resuelta antes de modelar, en catorce consultas de Power Query, no parcheada después. Una sola declaración por empresa y año, tras resolver los casos que reportaron bajo dos figuras el mismo ejercicio. Las cuatro identidades contables —ingresos menos costo igual a ganancia bruta, pasivos más patrimonio igual a activos, efectivo del balance igual a caja de cierre del flujo, y el árbol DuPont, que cierra a siete decimales— descuadran en cero pesos. Y el conteo de la tabla de hechos es idéntico al que predijo una validación independiente escrita en Python antes del refresco: dos caminos distintos al mismo número.

Además de presentar indicadores financieros, esta pieza mide cuánto del universo disponible se encuentra realmente cubierto. La cobertura forma parte del resultado porque una conclusión sobre las empresas colombianas necesita reconocer qué organizaciones, periodos y condiciones están representados y cuáles quedan por fuera: el tablero cubre el 84,9 % del ranking de las diez mil empresas más grandes, y las 1.507 que faltan valen 509 billones de pesos en ingresos y están vigiladas por otra superintendencia. Lo publica como cifra en una página propia, no como nota al pie.

El hallazgo que justifica el método está en el crecimiento. El agregado dice que 2020 cayó 2,2 %, porque ese año reportaron 3.414 sociedades nuevas; sobre las mismas 23.321 empresas presentes en los dos años, la contracción fue del 7,4 %, más del triple. Y el salto de 2019 —24,5 % agregado— era en su mayor parte muestra, no economía: las mismas empresas crecieron 14,6 %. Por eso el tablero nunca presenta el crecimiento agregado solo: al lado va siempre el de las mismas empresas, en el mismo eje. El modelo: diez tablas, seis relaciones, 64 medidas DAX.

## Tasas, inflación y deuda: el ciclo monetario en 41 áreas

<!-- seccion: ciclo-monetario -->

El tercer tablero, Tasas, inflación y deuda: el ciclo monetario, integra veintisiete años de información para cuarenta y una áreas económicas a partir de siete organismos. Su propósito es permitir el análisis conjunto de variables monetarias y macroeconómicas que normalmente se publican con estructuras, frecuencias y convenciones diferentes: ninguno de los siete publica lo mismo con el mismo calendario, y el tablero enseña, en su propia página, dónde no coinciden.

La integración exigía armonizar fechas, unidades, periodicidades e identificadores, sobre un modelo en estrella con calendario diario de 1999 a 2031 y 24 consultas de Power Query. También incluía contrastar par a par las dos fuentes oficiales de la curva estadounidense —el Tesoro contra la publicación semanal de la Reserva Federal, mismo día y mismo tenor— para comprobar que la representación utilizada fuera consistente: coinciden en 71.999 de 71.999 pares, con desvío máximo de cero. Toda la discrepancia entre los dos organismos está en qué días existe el valor, no en cuánto vale: 997 pares solo los publica uno de ellos, y 994 de esos son el bono a 30 años entre 2002 y 2006, los cuatro años en que no se emitía.

Dos decisiones de este tablero son las que más se parecen a mi trabajo en una organización. La primera: el último mes publicado traía 22 áreas de 38, y una tarjeta anclada ahí habría descrito «el ciclo monetario mundial» sobre poco más de media muestra, sin avisar. Todas las medidas de ciclo se anclan al último cierre completo, y la página de notas enseña las dos cifras juntas. La segunda: el panel de precios se encoge y cada país termina en un mes distinto, así que la inflación mediana se calcula sobre un panel fijo de nueve áreas declarado en la propia tarjeta, no sobre quien haya publicado ese mes.

De sus 62 medidas DAX, once devuelven vacío fuera del contexto de un país, a propósito: no existe «la tasa de política» de cuarenta bancos centrales. Los hallazgos: la curva de Estados Unidos estuvo invertida 1.009 días; en mayo de 2026, 31 de 38 bancos centrales sostienen su tasa y solo 3 de 11 la tienen por debajo de su inflación; Colombia subió 11,5 puntos en dos años, de 1,75 % a 13,25 %, y ha bajado dos.

## ¿En qué gasta el Estado colombiano y con quién?

<!-- seccion: gasto-del-estado -->

El cuarto tablero, ¿En qué gasta el Estado colombiano y con quién?, relaciona 4.373.766 contratos públicos con ocho años de información presupuestal, 337.034 filas descargadas con el SHA-256 de cada archivo. Su propósito es conectar dos perspectivas que suelen analizarse por separado: los recursos aprobados y su materialización mediante procesos de contratación.

La cifra de control fue contrastada con el presupuesto aprobado por el Congreso: el modelo reproduce exactamente la apropiación inicial de 2024, 502,597 billones de pesos. Esta comparación no demuestra por sí sola que cada relación entre presupuesto y contratación pueda establecerse de forma directa, pero sí proporciona un punto de referencia externo para evaluar la consistencia del universo incorporado: es la única capa de validación que no sale del dato, comprueba que el archivo dice la verdad y no solo que el modelo lo cargó bien.

Las dos tablas de hechos no se relacionan entre sí a propósito, porque las claves de entidad no cruzan y ni siquiera cubren el mismo universo: el presupuesto es del Gobierno central y dos de cada tres contratos son de entidades territoriales. Se conforman por sector y calendario, y por nada más. Nunca se suman.

El origen trae nueve trampas. La que más me enseñó: las métricas presupuestales llegan acumuladas dentro del año, y la primera versión de mi desacumulado perdía dos de cada tres pesos sin que ninguna consulta fallara. Una línea base escrita en Python sobre los archivos crudos lo detectó por aritmética —19 filas por serie donde solo puede haber 12 meses— antes de que llegara a Power BI, y recuperó el 65 % del valor. Y los 21 contratos con valores imposibles —suman 8.909 billones declarados; el mayor dice valer trece veces el presupuesto nacional entero bajo una modalidad reservada a las compras más pequeñas— no se borran en silencio: se excluyen del hecho y se publican uno por uno, con su entidad, su modalidad y el valor que declararon.

El modelo: 18 tablas, 16 relaciones y 44 medidas DAX, con los cuatro escalones del embudo que solo pueden ir a menos. Los hallazgos: en 2025, el 77,3 % de los contratos fue contratación directa, pero en dinero el 51,8 % —la directa domina en número; los contratos grandes sí se licitan—; 1,08 millones de proveedores para 4,37 millones de contratos, y el 10 % de ellos concentra el 88,3 % del dinero.

## Energía y clima: siete fuentes abiertas, un modelo

<!-- seccion: energia-y-clima -->

El quinto tablero, Energía y clima, integra siete fuentes abiertas para analizar cómo se genera la electricidad en diferentes regiones y cómo evoluciona la temperatura del planeta. La pieza conecta fenómenos relacionados, pero evita presentar su coexistencia como evidencia automática de causalidad.

Ninguna de las siete fuentes coincide del todo con las otras: publican agregados distintos, miden la temperatura contra periodos base distintos y cubren países distintos. El tablero no disimula esas costuras: las mide y las muestra. La brecha entre sumar países y el total mundial de 2024 es de −0,38 %, medida sobre los archivos crudos y reproducida después por una medida DAX sobre el modelo terminado: dos caminos independientes al mismo número. Por eso nunca usa la suma de países como total mundial —publica el agregado oficial y muestra la diferencia— y nunca resta las dos series de temperatura, porque usan periodos base distintos y la resta mediría la base.

En este tablero, publicar los límites resulta tan importante como presentar los resultados. Las fuentes pueden utilizar metodologías, coberturas y frecuencias distintas. La visualización debe facilitar la comparación sin ocultar las diferencias que condicionan la interpretación: el año más reciente está incompleto y los rankings usan el último año con cobertura completa; el inventario de 34.934 centrales tiene cobertura desigual por país y la mitad no trae año de puesta en marcha; dos indicadores per cápita solo son válidos con un país seleccionado, y así está declarado en el modelo.

El modelo: estrella de 15 tablas y 22 relaciones con 43 medidas DAX validadas una por una contra valores publicados, no solo consigo mismas; 1.925.420 filas de hechos, las que predijo la línea base en Python antes del refresco; doce páginas y 112 visuales, con 0 de 354 referencias rotas entre reporte y modelo. Los hallazgos: la solar pasó de 1 TWh en 2000 a 2.143 en 2024; cada kilovatio hora emite un 11 % menos que en 2000, pero el carbón casi se duplicó en absoluto; 2024 fue el año más cálido desde que hay registro, con +1,28 °C sobre la base 1951-1980; Colombia genera dos tercios de su electricidad limpia.

## Fórmula 1: 77 temporadas contadas bien

<!-- seccion: formula-1 -->

El sexto tablero, Fórmula 1: 77 temporadas contadas bien, reconstruye el comportamiento histórico del campeonato y verifica sus resultados mediante veinte identidades publicadas por el propio origen. F1DB publica 47 archivos con toda la historia y también 54 totales ya calculados por piloto y por escudería. Esos totales no se cargan: serían un segundo origen de verdad dentro del modelo. Se usan como prueba: el modelo calcula sus propias cifras y se comparan una a una, en Python, fuera del modelo y contra los CSV crudos. Las veinte que puede reproducir cierran sin una sola desviación.

La pieza demuestra que el rigor no depende de la formalidad del sector. Los datos deportivos también contienen cambios históricos, reglas, excepciones, relaciones y totales que deben conservarse correctamente. Tres de las identidades no cerraron durante las primeras validaciones, y destaparon reglas del deporte, no errores de código: hasta 1990 solo contaban los mejores resultados de la temporada, así que los puntos del campeonato no se calculan sumando carreras; y hay 13 carreras, en nueve temporadas entre 1959 y 2024, donde la pole no es el mejor tiempo de la clasificación. Contando la posición 1, la identidad de poles fallaba en 13 pilotos; leyendo la bandera que el propio origen publica, cierra en los 917.

## El censo de la Fórmula 1 y las cinco capas de validación

<!-- seccion: formula-1-censo-y-validacion -->

El censo es la mejor lección de este tablero: 917 pilotos están en el catálogo, 860 tienen al menos un resultado de carrera y 757 lo tienen fuera de las 500 Millas de Indianápolis, que puntuaron para el campeonato entre 1950 y 1960 sin ser carreras de Fórmula 1. Las tres cifras responden preguntas distintas, y el tablero nunca dice «los pilotos» a secas. Tampoco suma puntos entre eras salvo en la página que lo declara —una victoria valía 8 puntos en 1955 y vale 25 desde 2010— ni agrupa escuderías por el campo padre del origen, que cuenta la historia de una misma escudería cinco veces.

El modelo: 25 tablas, 39 relaciones —todas activas, ninguna bidireccional— y 54 medidas DAX; 33 consultas de Power Query van de los CSV crudos a las 25 tablas sin una sola columna calculada; 186.216 filas cargadas. La validación corre en cinco capas antes de abrir Power BI, sobre los 171 archivos del reporte: esquema, 322 referencias de campo sin ninguna rota, 36 cuadros de texto que caben en su caja, 54 rótulos y 54 cifras de tarjeta medidas contra el ancho real; 0 errores. La revisión de render humana es la sexta capa. Y el hallazgo favorito: en 1988 el subcampeón marcó 105 puntos contra 94 del campeón y perdió el título por el descarte de resultados; ninguna de las dos columnas está mal, son dos preguntas distintas.

## El stack real: Power BI Desktop, Power Query, DAX, PBIR por script y Python

<!-- seccion: el-stack -->

Los seis se construyen con el mismo stack, declarado en cada ficha con el papel de cada pieza. Power BI Desktop, donde vive el modelo en modo import y las doce páginas en un solo archivo, sin servicio en la nube. Power Query, en lenguaje M, para toda la preparación: desacumular resultados conservando flujos negativos, resolver reenvíos y duplicados, filtrar el plan de cuentas por código, anclar las medidas de ciclo al último cierre completo. DAX para las medidas, que es lo único que no puede vivir en Power Query: ninguno de los seis modelos tiene una columna calculada. El reporte en PBIR escrito por script: las doce páginas y sus visuales —142 en empresas, 112 en energía, 78 en Fórmula 1— generados con Python desde un solo juego de medidas, con un script que falla ante un color huérfano, un enlace roto o un texto sin traducir. Python también para la línea base independiente que predice conteos y cifras de control desde los archivos crudos antes de tocar Power BI. Y las APIs de los organismos: SODA de Socrata para los datos abiertos colombianos, SDMX y REST para los internacionales, con la fecha de la foto sellada en cada archivo.

Power BI es la capa principal de experiencia y decisión. Es el lugar donde el modelo semántico se convierte en indicadores, comparaciones, jerarquías y recorridos comprensibles para el usuario. Sin embargo, no lo considero una herramienta aislada ni el punto de inicio de la solución: en estos seis, la solución empieza en un script que descarga y en otro que predice lo que el modelo tiene que cargar.

Herramientas como DAX Studio y Tabular Editor fortalecen este trabajo cuando el modelo lo pide. Permiten observar el comportamiento de consultas y medidas, organizar metadatos, aplicar convenciones y tratar el modelo como un activo que necesita rendimiento, mantenibilidad y gobierno. El modelo semántico y el reporte se tratan como componentes distintos, para que una misma base de significado sostenga varias experiencias sin duplicar la lógica: las seis páginas en inglés de cada tablero salen del mismo modelo que las seis en español.

## Por qué estos seis no usan Microsoft Fabric, y dónde sí lo monté

<!-- seccion: fabric-y-los-tableros -->

Ninguno de los seis tableros publicados usa Microsoft Fabric: son piezas de escritorio, publicadas como proyecto versionado. Es una decisión deliberada, no una carencia. Un tablero público sobre datos abiertos tiene que poder abrirse y reproducirse por cualquiera con Power BI Desktop y los scripts, sin una capacidad en la nube de por medio, y su costo de operación tiene que ser cero. Con 6,4 millones de filas de hechos en el mayor de ellos, el modo import lo sostiene sin dificultad.

Microsoft Fabric añade lo que estos seis no necesitan y una organización sí: la ingestión mediante pipelines, la organización en lakehouses o warehouses sobre OneLake, las transformaciones bajo reglas reproducibles fuera del archivo, y modelos semánticos que sirven a diferentes experiencias de consumo sin reconstruir su significado. Esa integración reduce la dependencia de archivos y transformaciones encerradas dentro de un único reporte, y permite que la información preparada se reutilice por otros tableros, aplicaciones, procesos analíticos o agentes de inteligencia artificial.

Donde sí monté Fabric de extremo a extremo fue en Vesting, desde cero, sobre una plataforma de 120 tablas y 20 GB para observar agentes de inteligencia artificial en tiempo real; eso está en su propio documento, y no se puede enseñar en público porque es de un empleador. Por eso el pipeline tiene declarada, en exploración y sin fecha prometida, una pieza que cubre exactamente esa brecha: una solución analítica de extremo a extremo sobre Fabric con datos abiertos de Colombia, de la ingestión al lakehouse, al modelo semántico y a Power BI embebido.

DP-600, obtenida en diciembre de 2024, formaliza precisamente esa profundidad: preparar y enriquecer datos, administrar activos analíticos, implementar modelos semánticos y proteger las soluciones construidas sobre Fabric. En estos seis tableros la certificación se hace visible en lo que Fabric y Power BI comparten —el modelo semántico, las medidas, las decisiones de granularidad y rendimiento—, y en la exploración se hará visible el resto.

## Shiny, Tableau y Looker Studio: otras herramientas, otro nivel

<!-- seccion: otras-herramientas -->

Power BI y Fabric constituyen mi stack predilecto porque permiten conectar ingeniería de datos, modelado semántico y consumo analítico dentro de un mismo ecosistema. Esta preferencia no significa que mi experiencia se limite exclusivamente a tecnologías Microsoft.

También he trabajado con Shiny dentro del ecosistema de R y Posit para construir experiencias analíticas vinculadas con el análisis estadístico, la misma línea de mi formación en ciencia de datos con R. He trabajado de la mano con Tableau en contextos de visualización y exploración, y con Google Looker Studio para escenarios de publicación y análisis conectados con otras fuentes y servicios.

Estas herramientas no ocupan el mismo nivel dentro de mi perfil, y las skills del sitio las publican con esa honestidad. Power BI y Microsoft Fabric representan mi mayor profundidad y mi arquitectura principal: seis tableros públicos, una plataforma de empresa y una certificación lo respaldan. Shiny, Tableau y Looker Studio amplían mi capacidad para comprender otros enfoques de construcción, interacción y distribución de productos analíticos, y me permiten leer y trabajar con lo que una organización ya tiene.

Mi criterio para seleccionar la herramienta no parte de una preferencia de marca. Considero el problema, las fuentes, la escala, las necesidades de gobierno, la audiencia, la infraestructura disponible, el modelo de licenciamiento y la capacidad de la organización para sostener la solución. La plataforma adecuada es aquella que permite transformar los datos en una capacidad confiable sin introducir una complejidad desproporcionada para el contexto en el que deberá operar. Para seis tableros públicos, eso fue Power BI Desktop y un script; para una startup con 23 agentes vigilados a la vez, fue Fabric.

## El pipeline comienza en la fuente

<!-- seccion: pipeline-de-datos -->

Cada tablero comienza con una evaluación de las fuentes. Antes de diseñar indicadores necesito comprender quién publica la información, qué representa cada conjunto, con qué frecuencia se actualiza, qué cobertura tiene y qué cambios metodológicos pueden afectar su interpretación. En el ciclo monetario, por ejemplo, el panel de tasas no es fijo: 31 áreas en 1999, 40 entre 2007 y 2022, 38 al último cierre completo, y las medidas de panel dicen sobre cuántas calculan.

Las fuentes públicas suelen utilizar estructuras diseñadas para publicación o intercambio, no necesariamente para análisis integrado. Pueden distribuirse en múltiples archivos, contener encabezados variables, modificar nombres entre años, utilizar identificadores incompletos o publicar totales con un nivel de agregación diferente al requerido por el modelo. El origen de las empresas publica la descripción del código industrial con las tildes rotas en 480 variantes; el de la banca escribe mal el nombre de un tipo de entidad en uno de sus datasets. Ninguno de los dos se «arregla» a mano: el análisis va por sección, y el cruce va por código.

La ingestión debe conservar suficiente evidencia para reconstruir el recorrido. El archivo, el periodo, el organismo, la fecha de descarga y demás metadatos relevantes forman parte de la trazabilidad, y en el gasto público cada archivo viaja con su SHA-256. No considero suficiente almacenar únicamente la tabla resultante si después no puede relacionarse con la publicación que la originó.

También procuro conservar los datos con el nivel de detalle necesario antes de agregarlos. Una agregación temprana puede simplificar el modelo, pero eliminar la posibilidad de investigar inconsistencias, reconstruir identidades o desarrollar preguntas que todavía no habían sido formuladas. Por eso el modelo de la Fórmula 1 carga 155.101 filas de hecho en diez tablas, y no los 54 totales que el origen ya trae calculados.

## Transformar sin interpretar: Power Query antes de la primera medida

<!-- seccion: transformacion-y-controles -->

La transformación debe separar la corrección técnica de la interpretación analítica. Convertir un campo a una fecha o eliminar caracteres de un valor corresponde a una operación técnica. Decidir que dos categorías representan el mismo concepto exige una regla de negocio o una justificación metodológica diferente, y por eso en el gasto público los sectores, las modalidades y los estados no se traducen con una regla automática: van en seis catálogos curados a mano, porque ninguna heurística acierta.

Toda la preparación vive en Power Query, antes de que exista una sola medida: catorce consultas en empresas, 24 en el ciclo monetario, 33 en la Fórmula 1. Es una regla de arquitectura, no de comodidad. Lo que se transforma en la preparación se ve, se versiona y se prueba; lo que se transforma en una columna calculada de DAX queda escondido dentro del modelo. Ninguno de los seis tiene una.

Los controles se aplican durante el recorrido y no solamente al final. Verifico estructuras, tipos, duplicidades, valores faltantes, relaciones, conteos y totales relevantes antes de permitir que los datos avancen hacia el modelo semántico. Y hay un control previo a todos: la línea base independiente en Python, que predice desde los archivos crudos lo que el modelo tiene que cargar. En banca predijo nueve conteos y acertó los nueve; en empresas y en energía predijo el conteo exacto de la tabla de hechos; en el gasto público comprobó diez cifras de control y tumbó un desacumulado propio por aritmética antes de que llegara a Power BI.

Esta disciplina proviene tanto de la ingeniería de datos como de la Ingeniería Industrial. Trato el pipeline como un proceso: cada etapa recibe una entrada, aplica una transformación, produce una salida y debe conservar evidencia sobre aquello que modificó. En una plataforma como Fabric esas responsabilidades se organizan con mayor claridad y reutilización, porque la ingestión, la preparación, el almacenamiento y el consumo dejan de depender del archivo de Power BI; en estos seis, la misma separación vive en scripts, consultas y un modelo, y se puede leer entera en el repositorio de cada tablero.

## El modelo semántico convierte datos en conceptos

<!-- seccion: modelo-semantico -->

El modelo semántico constituye el núcleo de cada tablero. Es el lugar donde las fuentes dejan de aparecer como archivos y columnas aisladas y comienzan a representar entidades, hechos, periodos, organizaciones, territorios, categorías y relaciones comprensibles.

Un modelo bien diseñado permite responder nuevas preguntas sin reconstruir la lógica para cada página. También permite que diferentes medidas utilicen dimensiones comunes, trabajen con una granularidad consistente y conserven una interpretación estable a través del producto. Los seis son modelos en estrella: 16 tablas en banca, 10 en empresas, 13 en el ciclo monetario, 18 en el gasto público, 15 en energía y 25 en la Fórmula 1, con sus calendarios —diario de 1999 a 2031 en el ciclo monetario, diario de 1950 a 2026 en la Fórmula 1— como dimensiones de primera clase.

La construcción comienza identificando la unidad de análisis. En el tablero financiero es una entidad, una cuenta y un corte. En contratación pública es un contrato, una entidad contratante, un proveedor y una fecha. En la Fórmula 1 es una carrera, una temporada, un piloto o un equipo, y ahí la unidad decide una regla: entradas y podios van por carrera distinta, no por fila, para no contar dos veces a un piloto que compartió coche.

Las relaciones deben respetar esa granularidad. Una unión aparentemente válida puede duplicar registros y producir totales incorrectos si conecta tablas con niveles de detalle diferentes. Este tipo de error resulta especialmente peligroso porque el tablero puede seguir funcionando y presentar cifras plausibles. Por eso en banca los cuatro hechos no se relacionan entre sí, y en el gasto público las dos tablas de hechos tampoco: cuando los perímetros o las claves no cruzan, la relación honesta es ninguna, conformada solo por las dimensiones que sí comparten.

## Medidas DAX: 62, 64, 62, 44, 43 y 54

<!-- seccion: medidas-dax -->

Las medidas se construyen después de establecer la estructura. DAX permite expresar cálculos, acumulados, variaciones, participaciones y comparaciones temporales, pero una medida técnicamente correcta puede producir un resultado equivocado si el modelo no representa adecuadamente el dominio. Los seis tableros suman, por pieza, 62 medidas en banca, 64 en empresas, 62 en el ciclo monetario, 44 en el gasto público, 43 en energía y 54 en la Fórmula 1.

Por eso, no separo la ingeniería de medidas del conocimiento del proceso y de la fuente. El modelo semántico es una implementación de cómo comprendo el universo analizado, no únicamente una optimización para que Power BI responda más rápido. Tres medidas lo ilustran. La solvencia bancaria se recalcula desde sus componentes —patrimonio técnico sobre activos ponderados por riesgo más riesgo de mercado más riesgo operativo— porque es lo único que permite agregar: la solvencia del sistema es el cociente de las sumas, no el promedio de los ratios, y el atajo de dividir solo por los activos ponderados se desvía 4,71 puntos en la mediana. Las once medidas de ciclo monetario que devuelven vacío fuera del contexto de un país existen para que nadie pueda pedir una tasa de política «mundial». Y las dos medidas de concentración de proveedores del gasto público dicen cosas distintas a propósito: el 10 % de los proveedores concentra el 88,3 % del dinero y, aun así, el índice de concentración de 2025 es 72, lejos de un mercado concentrado.

Las 43 medidas de energía se validaron una por una contra el modelo y se contrastaron con valores publicados, no solo consigo mismas. Y cada campo que un visual cita se contrasta contra el modelo real, porque el validador de esquema no sabe qué medidas existen: 0 referencias rotas de 354 en energía, 0 de 322 en la Fórmula 1.

La verdadera especialidad en Power BI no consiste en conocer una gran cantidad de visualizaciones. Consiste en construir una capa semántica capaz de preservar el significado de los datos y sostener experiencias que puedan utilizarse con confianza. En una plataforma como Fabric ese modelo puede vivir fuera del reporte y compartir definiciones con distintos consumidores; en estos seis vive en el archivo, y la disciplina es la misma.

## Las identidades tienen que cerrar

<!-- seccion: las-identidades -->

La regla que comparten los seis tableros es que las identidades definidas o garantizadas por las fuentes deben cerrar. Esta condición convierte la validación en una parte estructural del producto y no en una revisión opcional antes de publicar.

Una identidad es una relación que debe mantenerse dentro del universo analizado. En estados financieros, el activo debe corresponder con la suma del pasivo y el patrimonio bajo la estructura aplicable. En un presupuesto, las partidas deben reconciliarse con los totales publicados. En un campeonato, los puntos y resultados deben coincidir con los valores oficiales: los veinte totales que publica el propio origen de la Fórmula 1.

Estas identidades funcionan como invariantes del sistema. Si dejan de cumplirse después de integrar y transformar los datos, algo ocurrió dentro del pipeline, el modelo o la fuente que necesita explicación.

La primera posibilidad es una pérdida. Algún registro no ingresó, fue filtrado incorrectamente o dejó de relacionarse con el resto de la información: el desacumulado que perdía dos de cada tres pesos en el gasto público era exactamente eso. La segunda es una duplicación producida por una unión o una granularidad incompatible: los consolidados que duplican al grupo empresarial, los coches compartidos de los años cincuenta. La tercera es una desalineación conceptual, en la que dos campos aparentemente equivalentes representan elementos diferentes: la cuenta de «ingresos» que en realidad es ingresos más valoración bruta de derivados.

También puede existir un problema en el origen. Una fuente pública puede contener errores, correcciones posteriores, cambios metodológicos o excepciones que no se explican de forma evidente. La validación no debe asumir que la publicación es infalible, pero tampoco debe modificarla silenciosamente para obligarla a cerrar. Cuando la razón social llega corrupta, no se inventa: se toma del ranking oficial que republica el mismo campo bien codificado. Y cuando dos instituciones publican la inflación del mismo país y del mismo año y no coinciden —el desvío mediano entre el FMI y la OCDE es de 0,05 puntos, pero un año de Argentina sale a −16,9—, el tablero enseña las dos.

## Identidad, conciliación externa y preflight: tres controles distintos

<!-- seccion: tres-controles -->

Hay tres controles distintos y conviene nombrarlos distinto, porque no prueban lo mismo. La identidad es un invariante interno: activo igual a pasivo más patrimonio, corrida sobre las 7.779 combinaciones de entidad y corte de la banca. La conciliación con una fuente externa es otra cosa: la cifra de control del gasto público contra los 502,597 billones que aprobó el Congreso comprueba que el archivo dice la verdad, no solo que el modelo lo cargó bien. Y el tercero es previo a los dos: el preflight, la línea base independiente en Python que predice conteos y cifras de control desde los CSV crudos antes de tocar Power BI, y que en banca predijo nueve y acertó nueve.

En el tablero sobre el gasto estatal, además, los 21 contratos con valores imposibles se excluyen del hecho y se publican uno por uno. En la Fórmula 1 se verificaron veinte identidades y tres de ellas no cerraron durante las primeras ejecuciones.

Esos tres casos resultaron especialmente valiosos. Una prueba adquiere sentido cuando puede ponerse en rojo y hacer visible una desviación. Si las identidades hubieran sido tratadas únicamente como una formalidad para confirmar resultados esperados, los problemas habrían permanecido ocultos; y en este caso los tres rojos eran reglas del deporte, no errores de código: el descarte de resultados vigente hasta 1990 y las 13 poles que no son el mejor tiempo.

Las diferencias se documentan en la ficha técnica en lugar de corregirse silenciosamente o eliminarse para producir un tablero más limpio. El propósito de la validación no es conseguir que todos los números coincidan a cualquier precio. Es comprender por qué coinciden o por qué dejan de hacerlo.

Esta disciplina conecta directamente con mis sistemas de gestión y con mi forma de trabajar en inteligencia artificial. Un control no está demostrado porque exista. Debe mostrar que puede detectar la condición para la que fue diseñado y conservar evidencia sobre la respuesta aplicada. Un control que no se ha visto en rojo no ha demostrado nada.

## Cómo verifico las cifras que publico: el universo, no solamente una muestra

<!-- seccion: verificar-el-universo -->

Cuando la escala lo permite, ejecuto las validaciones sobre el universo completo incorporado al modelo y no únicamente sobre una muestra seleccionada. En los seis tableros lo permitió: las 7.779 combinaciones de la banca, los 71.999 pares de la curva, los 6,4 millones de filas de las empresas.

Las muestras son útiles para comprender estructuras, desarrollar transformaciones y revisar casos con mayor detalle. Sin embargo, una regla que funciona sobre algunos registros puede fallar en periodos, entidades o categorías que no fueron incluidos durante el desarrollo. La solvencia, por ejemplo, solo existe desde 2021, cuando el origen empieza a publicarla, y los cuatro hechos de la banca arrancan en enero de 2016 porque antes el desglose de cartera no cierra contra su propio total: dos condiciones que una muestra reciente jamás habría mostrado.

La validación completa permite reconocer excepciones, cambios de formato y condiciones históricas que podrían permanecer ocultas en una selección pequeña. También ayuda a diferenciar un problema sistemático de una diferencia localizada: que el 99,99 % de las series de resultado cierre contra su propio acumulado de diciembre solo se sabe corriéndolas todas.

Esta decisión exige equilibrio. Validar todo el universo puede aumentar el tiempo de procesamiento y el uso de recursos. Por eso, distingo entre controles rápidos que pueden ejecutarse frecuentemente y pruebas exhaustivas que corresponden a momentos específicos del ciclo de publicación: las cinco capas de la Fórmula 1 corren antes de cada apertura de Power BI; la comparación contra los 54 totales del origen, al cerrar.

Los resultados deben conservar suficiente detalle para identificar dónde ocurrió la diferencia. Un control que únicamente informa que la suma no coincide obliga a repetir el análisis. Una validación útil debe permitir localizar la entidad, el periodo, la cuenta o la combinación que produjo el incumplimiento: en la banca, la solvencia se reproduce en 3.809 de 3.811 casos, y los dos que no se conocen por nombre y corte.

La escala también influye en la arquitectura. Un tablero con millones de registros necesita estrategias de almacenamiento, transformación, agregación y modelado diferentes a las de una pieza pequeña; a partir de cierto volumen, una plataforma como Fabric traslada esas responsabilidades a un lakehouse preparado para volúmenes mayores. El objetivo no es demostrar que puedo cargar muchos datos. Es asegurar que la cantidad de información no reduzca la capacidad para explicar, validar y gobernar los resultados.

## Publicar la cobertura y los límites

<!-- seccion: publicar-los-limites -->

Cada tablero debe comunicar no solo lo que permite observar, sino también aquello que sus datos no pueden sostener. Publicar límites es una condición de uso responsable y no una nota secundaria ubicada fuera de la experiencia principal: en los seis, la sexta página se llama «Notas, límites y calidad», y la ficha de cada uno publica sus límites como una lista, con cifras y no con párrafos.

Todos comparten el primer límite: los datos son una foto fechada, no una conexión viva, y se actualizan cuando se corre la descarga. Después, cada universo tiene los suyos. En el ciclo monetario, la tasa real solo existe para 30 de las 41 áreas, las que publican el índice de precios mensual, y los años 2026 a 2031 del FMI son proyección, no dato, con la frontera medida y no supuesta. En la Fórmula 1, las paradas en boxes existen desde 1994 y los puntos de sprint desde 2021: ninguna de esas series cubre los 77 años, y la temporada 2026 está en curso, con 13 rondas de 23. En el gasto público, la contratación empieza en 2022 —antes, la plataforma estaba en adopción y una serie más larga mostraría adopción, no gasto— y todas las cifras están en pesos corrientes, sin deflactar.

La cobertura necesita expresarse de forma comprensible. Puede depender de periodos, entidades, regiones, variables o metodologías disponibles. Un tablero que analiza miles de empresas todavía debe explicar qué proporción del universo representa y qué organizaciones no se encuentran incluidas. En Las empresas de Colombia en cifras, la cobertura se presenta como una dimensión analítica propia, medida contra dos rankings publicados. Esta decisión evita que el tamaño del conjunto se interprete automáticamente como representación completa del tejido empresarial.

En Energía y clima, las limitaciones de las fuentes se hacen visibles porque las comparaciones atraviesan metodologías, territorios y periodos diferentes. Integrar variables dentro de una misma experiencia no convierte automáticamente sus definiciones en equivalentes ni demuestra relaciones causales.

## Ausencia no es cero, y los cambios metodológicos se ven

<!-- seccion: ausencia-y-metodologia -->

También debe distinguirse entre ausencia y cero. Que una fuente no contenga un valor no significa que el fenómeno no exista. Reemplazar indiscriminadamente faltantes por cero puede producir una narrativa incorrecta y alterar agregaciones, tendencias y comparaciones. Por eso 11 medidas del ciclo monetario devuelven vacío en lugar de un número cuando el contexto no es un país, y por eso los flujos negativos de la banca se conservan en lugar de recortarse en cero.

Los cambios metodológicos también deben permanecer visibles. Cuando un organismo modifica una clasificación, una serie puede aparentar una ruptura que proviene de la definición y no del fenómeno. La transformación no debe borrar esa condición sin documentarla: cada empresa aparece con la clasificación de su declaración más reciente, y una sociedad que cambió de sector se muestra con el actual en todos los años, cosa que la ficha declara como límite; la armonización de los tramos de mora bancaria es una aproximación declarada, porque cada modalidad de crédito usa su propio esquema de días.

El límite debe comunicarse cerca del lugar donde puede afectar la interpretación. Una advertencia general al final del tablero puede resultar insuficiente si la persona toma una decisión en una página específica sin reconocer que el universo está incompleto. Por eso la tarjeta de la inflación mediana dice sobre cuántas áreas calcula —9, el panel fijo—, y la página de la tasa real muestra la cobertura del índice de precios al lado de cada área.

El Diseño Industrial aporta una responsabilidad importante en este punto. Los límites deben ser comprensibles, visibles y proporcionales al riesgo de una interpretación equivocada. No basta con incluirlos en una nota técnica que pocas personas leerán.

Un producto analítico confiable no es aquel que parece tener respuesta para todo. Es aquel que permite distinguir con claridad qué puede afirmar, qué necesita contexto adicional y qué permanece fuera de sus datos.

## Los «nunca» de cada tablero

<!-- seccion: los-nunca -->

Cada ficha publica sus «nunca»: las operaciones que el tablero se prohíbe, escritas como reglas y no como advertencias, porque son la forma más corta de decir qué error evita. Son cinco por tablero, y estos son los que más explican el método.

Nunca sumar consolidados con individuales, porque serían la misma matriz contada dos veces y cada grupo empresarial quedaría inflado. Nunca publicar la cuenta 4 como ingresos: el 56 % de lo que contiene es valoración bruta de derivados que se cancela contra el gasto. Nunca sumar niveles del plan de cuentas entre sí: cada medida nombra sus códigos, porque sumar la columna sin filtrar infla el activo 2,7 veces. Nunca usar la suma de países como total global, ni restar dos series de temperatura con periodos base distintos. Nunca sumar presupuesto nacional con contratación, porque son dos universos, ni sumar las métricas acumuladas del origen, que devolverían cifras siete veces infladas. Nunca dar «la tasa de política» de más de un área, ni tomar una cifra de un agregador: cada dato viene del organismo que lo produce, y por eso el atajo obvio queda fuera. Nunca decir «los pilotos» a secas cuando el censo da tres cifras, ni calcular los puntos del campeonato sumando carreras. Y en los seis: nunca inventar un dato para reparar el origen, y nunca cargar datos de personas —el dataset de entidades vigiladas publica nombre, documento y correo del representante legal; el de contratación, la cédula y el domicilio de tres cargos por contrato; ninguno se descarga—.

Distinguir ausencia de cero, conservar los cambios metodológicos visibles y no reemplazar faltantes por ceros son parte del mismo hábito. Un «nunca» escrito en la ficha es también una prueba: si un tablero rompe uno, se ve, porque la ficha está publicada al lado.

## La visualización debe respetar la evidencia

<!-- seccion: visualizacion-y-evidencia -->

La visualización no debe exagerar aquello que los datos pueden demostrar. Una escala, un color, una agregación o una comparación pueden modificar profundamente la forma en que una persona interpreta el resultado.

Por eso, cada representación debe responder al tipo de pregunta. Una tendencia necesita preservar el comportamiento temporal. Una comparación necesita una escala coherente: los dos crecimientos de las empresas, agregado y comparable, van en el mismo eje. Una composición debe permitir comprender tanto las partes como el total. Una distribución no puede reducirse siempre a un promedio: las tasas de los tipos de título se publican como las da el origen, porque sin saldos con qué ponderar el promedio simple daría 3,411 % contra 3,490 %.

También debe existir una jerarquía clara. La pantalla inicial debe responder la pregunta principal y permitir profundizar hacia las causas, los segmentos o la evidencia. Cada uno de los seis tableros abre con esa página —el sistema en cifras, la economía real en cifras, el ciclo de un vistazo, el embudo del presupuesto, el pulso del sistema, la Fórmula 1 en 77 temporadas— y cierra sus seis páginas en español con las notas, los límites y la calidad. Mostrar toda la información simultáneamente aumenta la carga cognitiva y puede ocultar precisamente aquello que necesita atención.

Los títulos cumplen una función analítica. No deben limitarse a nombrar la métrica. Deben ayudar a comprender qué se está observando, bajo qué periodo y con qué unidad: «cinco bancos tienen el 70,9 % del activo bancario», «uno de cada 23 pesos prestados está en mora», «ocho de cada diez contratos se adjudican sin competencia». Las etiquetas, filtros y descripciones deben utilizar conceptos reconocibles para la audiencia y no reproducir automáticamente los nombres técnicos de las fuentes; en las páginas en inglés, las etiquetas regulatorias se traducen por su código, no por su texto.

## Color, accesibilidad y Diseño Industrial en un tablero

<!-- seccion: color-y-accesibilidad -->

El uso del color necesita significado. Una misma paleta no debería utilizarse simultáneamente para categorías, estados y niveles de riesgo. Tampoco debería depender exclusivamente del color para comunicar una diferencia que necesita ser comprendida por usuarios bajo diferentes condiciones visuales. Como el reporte se escribe por script, esto es una regla ejecutable: el generador falla ante un color huérfano —uno que no pertenece a la paleta declarada— antes de que exista la página.

La accesibilidad forma parte del diseño. Contraste, navegación, jerarquía, texto alternativo y comportamiento de la interfaz influyen sobre quién puede utilizar la solución y con qué nivel de esfuerzo. En la Fórmula 1, dos de las cinco capas de validación son de legibilidad: 36 cuadros de texto que caben en su caja, y 54 rótulos y 54 cifras de tarjeta medidas contra el ancho real de su tarjeta, porque una cifra truncada es una cifra equivocada. Dos de las cuatro capas del ciclo monetario nacieron de revisiones de render anteriores: un defecto que se vio una vez se convierte en una validación, no en una nota.

Mi formación en Diseño Industrial fortalece esta dimensión porque me obliga a tratar el tablero como una experiencia y no únicamente como una superficie donde ubicar gráficos. La forma debe ayudar a comprender la función, no competir con ella. Que las doce páginas de cada tablero salgan de un script no le quita diseño: se lo da dos veces, porque el diseño es reproducible y porque la revisión de render humana es la última capa, no la única.

La mejor visualización no es la más llamativa ni la que presenta más elementos. Es la que permite reconocer el resultado, comprender su contexto, identificar sus límites y recorrer la evidencia sin perder significado.

## Tableros como productos analíticos, no como archivos

<!-- seccion: productos-analiticos -->

No considero que un tablero esté terminado porque el archivo de Power BI funciona o porque la publicación se completó correctamente. Una pieza sostenible necesita fuentes identificadas, transformaciones reproducibles, un modelo mantenible, medidas documentadas, controles de calidad y una experiencia coherente. Por eso los seis se publican como proyecto versionado, con el reporte en PBIR escrito por Python: el diseño está en código, se puede leer, comparar entre versiones y regenerar, y la revisión de una página es la revisión de un cambio.

También necesita una relación clara con su propósito. En el portafolio público, cada tablero demuestra una capacidad específica, y su ficha lo dice: para quién es y qué criterio enseña. En una organización, debe responder a decisiones, responsabilidades y ciclos de uso igualmente concretos.

El modelo semántico y el reporte deben tratarse como componentes diferentes. El modelo concentra las entidades, relaciones y medidas que requieren reutilización y gobierno. El reporte organiza la interacción, el contexto y las preguntas de una audiencia determinada. Esta separación permite que una misma base de significado sostenga experiencias diferentes sin duplicar la lógica en cada producto —las seis páginas en inglés de cada tablero son la prueba— y facilita la evolución: una nueva vista puede incorporarse sin reconstruir las definiciones fundamentales. En una plataforma como Fabric, esa separación se lleva más lejos: ingestión, almacenamiento, transformación, semántica y consumo se administran como componentes con ciclo de vida propio.

Un producto analítico también necesita criterios para actualizarse y retirarse. Una fuente puede modificar su estructura, una definición puede perder vigencia y un tablero puede dejar de responder a una necesidad. Mantenerlo publicado indefinidamente puede generar tanta confusión como un error visible. Los seis declaran su fecha de foto y su versión, 1.0.0, y su primer límite es justamente que no se actualizan solos.

La calidad se conserva mediante responsabilidades. La fuente necesita seguimiento. El pipeline requiere controles. El modelo necesita un responsable de su semántica. La visualización necesita revisión. Las cifras y los límites deben mantenerse sincronizados con el estado real de la pieza. Esta perspectiva transforma el portafolio. No contiene seis archivos independientes. Contiene seis productos analíticos que demuestran cómo organizo el recorrido completo desde la fuente hasta la interpretación.

## Datos preparados también para aplicaciones y agentes

<!-- seccion: datos-para-agentes -->

La información preparada y gobernada no necesita utilizarse únicamente en Power BI. También puede servir a aplicaciones, procesos automatizados y agentes de inteligencia artificial, y en una plataforma como Fabric esa ampliación de consumidores es la razón de ser del lakehouse: un mismo activo semántico sirviendo a personas, aplicaciones y agentes.

Esto exige conservar una separación clara entre los datos, su significado y la forma de consumo. Un agente no debería reconstruir libremente una métrica cuya definición ya existe dentro del modelo semántico. Cuando una medida ha sido validada y gobernada, la solución inteligente debería utilizar ese activo en lugar de generar una interpretación alternativa. Es lo que hice en Vesting, donde la plataforma existía para observar agentes, y es lo que hace en la vitrina el Constructor de Tableros Power BI, un agente construido y probado que crea el proyecto completo —modelo semántico, preparación en Power Query M, medidas DAX y visuales— y puede extraer datos, con el mismo principio: la definición vive en el modelo, no en el prompt.

Los tableros públicos ofrecen un entorno especialmente útil para explorar esta integración porque las fuentes pueden auditarse y las definiciones pueden hacerse visibles. Una aplicación o un agente podría consultar datos estructurados, recuperar documentación metodológica y producir explicaciones sustentadas en los mismos activos utilizados por Power BI. Y de hecho ya ocurre en pequeño: las fichas de los seis tableros entran al índice del chat de este sitio, con sus cifras y sus «nunca», y el chat las cita hacia la ficha.

Sin embargo, ampliar los consumidores también aumenta las responsabilidades. Debe establecerse qué información puede consultar cada componente, qué nivel de detalle necesita, qué resultado está autorizado a producir y cómo se conservará la trazabilidad. AI-103 fortalece la construcción de aplicaciones y agentes capaces de utilizar estos activos. AI-300 amplía la evaluación, observabilidad y operación de esas soluciones cuando comienzan a utilizar datos y herramientas de forma sostenida.

El valor no se encuentra en conectar un modelo generativo a todos los datos. Se encuentra en construir una arquitectura donde personas y soluciones inteligentes utilicen información consistente, autorizada y verificable.

## Qué demuestran los seis tableros

<!-- seccion: que-demuestran -->

Los seis tableros demuestran ingeniería de datos y analítica de extremo a extremo, seis veces, sobre fuentes que cualquier persona puede descargar y contrastar.

Demuestran capacidad para integrar estructuras heterogéneas, conservar metadatos, controlar granularidad, construir modelos dimensionales y desarrollar medidas que representan conceptos reales dentro de cada dominio: 329 medidas DAX entre los seis, ninguna columna calculada.

Demuestran que la calidad debe poder probarse. Las identidades contables, financieras, presupuestales y deportivas convierten las reglas del origen en controles ejecutables capaces de detectar pérdidas, duplicidades y desalineaciones, y los controles que se vieron en rojo —tres identidades de la Fórmula 1, un desacumulado en el gasto público— son los que más enseñan.

Demuestran que la cobertura forma parte del resultado. Una cifra no adquiere autoridad únicamente por haber sido calculada sobre millones de registros. Necesita explicar qué universo representa, bajo qué periodos y con qué limitaciones.

Demuestran que la visualización debe respetar la evidencia. La experiencia necesita facilitar comprensión, jerarquía y exploración sin ocultar incertidumbres ni presentar comparaciones que las fuentes no permiten sostener.

Demuestran mi profundidad en Power BI, desde la preparación y el modelo semántico hasta las medidas, el rendimiento y la experiencia de consumo. Lo que no demuestran es Fabric: eso lo hice en una empresa y lo cubrirá, en público, la exploración declarada de analítica de extremo a extremo sobre datos abiertos de Colombia.

También demuestran la convergencia entre Ingeniería Industrial y Diseño Industrial. La primera me permite comprender el sistema, las relaciones y los controles. La segunda me obliga a convertir esa complejidad en una experiencia comprensible, responsable y utilizable.

Las piezas públicas hacen verificable una forma de trabajo que apliqué anteriormente en operaciones de transporte, logística, banca y agentes de inteligencia artificial. La diferencia es que aquí las fuentes, las decisiones y los resultados pueden ser examinados de manera independiente, sin pedir permiso.

No construí estos tableros para mostrar seis temas diferentes. Los construí para demostrar un mismo método frente a seis universos: comprender la fuente, modelar el dominio, verificar la integridad, declarar los límites y diseñar una experiencia que permita utilizar los resultados sin exceder la evidencia.
