# Revisión 2026-09-26 — Las herramientas de hoy

> Rama `mejora/herramientas-de-ia`, un PR. El dueño pidió _«un nuevo barrido de herramientas,
> siento que no hemos puesto las importantes de hoy»_ para mostrar su perfil de AI Engineer y
> sus posiciones objetivo, y avisó que prepara un planeador de Fabric, Databricks y Snowflake y
> una app del ecosistema de LangChain, las dos para la vitrina.

## 1. El barrido y lo que decidió el dueño

Antes de proponer se leyeron los cuatro roles de `lo-que-busco`, la sección de Skills, el
corpus del chat y las 32 piezas de la vitrina. Se le entregó una lista en cuatro grupos:

| Grupo                            | Qué era                                                                                 | Decisión del dueño                                                                                                                                                              |
| -------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Ya demostradas y ausentes     | Claude Code, MCP, Codex, Antigravity, el stack de este sitio, Fabric por dentro, Pyomo… | **todas** (con evidencia en la vitrina o en el corpus)                                                                                                                          |
| B. Las que dijo conocer          | LangChain, «GraphChain», LangSmith, Langflow                                            | **usadas en la Fundación CTIC**; «GraphChain» es **LangGraph**                                                                                                                  |
| C. Candidatas para AI Engineer   | frameworks, recuperación, plataformas, low-code, asistentes de código, gobierno         | Agent Framework, Claude Agent SDK, Azure AI Search, Azure OpenAI, Hugging Face, Ollama, Copilot Studio, Power Automate, Power Apps, Cursor, GitHub Copilot, Gemini CLI, Purview |
| D. Para el planeador de big data | Databricks, Snowflake, dbt, Iceberg, Airflow, PySpark y lo de Fabric que no aparecía    | **«asegúrate que estas entren»**                                                                                                                                                |

«GraphChain» no existe con ese nombre: se le preguntó y eligió LangGraph. El grupo A no lo
mencionó en su respuesta: se le preguntó y dijo que entran todas.

## 2. Lo que se construyó

- **Skills en nueve grupos** (`data/cv.{es,en}.yaml`). Nuevos: «Agentes e IA generativa»,
  «Desarrollo asistido por IA», «Big data multiplataforma». «IA & ML» pasa a «Machine learning y
  ciencia de datos», «Ingeniería» a «Ingeniería de software» y «Procesos y simulación» suma la
  optimización. **Los `id` viejos no cambian**: son el destino de las citas del chat.
- **Big data multiplataforma abre con un chip honesto**: «Planeador de Fabric, Databricks y
  Snowflake — en preparación». Es la regla de «Google Cloud — en exploración». El primer corte
  lo escribía con puntos medios, y en el PDF, donde los ítems se separan con el mismo punto, se
  leía como tres herramientas sueltas: se cambió a comas.
- **El ecosistema de LangChain en el corpus**, en dos documentos y en los dos idiomas: una frase
  en `fundacion-ctic` y otra en la subsección de frameworks de `agentes-en-produccion`. Esta
  segunda salió del banco de preguntas (rojo Q): esa subsección, titulada «los frameworks de agentes
  que he usado», es la que el chat trae primero, y solo hablaba de n8n. Sin la frase, el chat
  habría seguido contestando «n8n». Se agregó texto; no se tocó nada de lo que ya estaba.
- **Los iconos van por `id`, no por posición** (`skills-iconos.tsx`). Tres dibujos nuevos y
  uno para «Procesos». **Esto arregló un error que estaba en producción desde el 2026-09-20**:
  ese día «Procesos y simulación» entró en quinto lugar, se quedó con el dibujo de «Cómo
  trabajo», y «Cómo trabajo» recibió el rombo de reserva. El comentario del código decía
  justamente que un sexto grupo recibiría el rombo; nadie lo miró al agregar el grupo.
- **La rejilla**: con grupos impares, el último ocupa las dos columnas. El orden empareja
  tarjetas de tamaño parecido; el primer corte ponía «Agentes» (15 chips) al lado de
  «Desarrollo asistido» (6), que quedaba casi vacía, y se reordenó al verlo en la captura.
- **El chat: un fragmento por grupo de Skills**, cada uno con el ancla de su tarjeta y el
  nombre del grupo en el chip. Antes era uno solo; con nueve grupos pasaba de 250 palabras.
- **El PDF sigue en dos páginas** en los dos idiomas, con dominio y sin él (el test de siempre).
  La columna derecha de la página 2 queda casi llena: lo dice el manual.

**Una corrección mía, registrada.** El primer comentario del troceo por grupo decía que con un
solo fragmento «¿sabe Databricks?» perdía la recuperación. No lo había comprobado, y la demo R
mostró que el banco pasa también con un solo fragmento. El comentario se reescribió: el troceo
es por la cita (aterriza en la tarjeta), no por la recuperación.

## Regla 14 — rojos en este commit

**P. Un grupo sin su dibujo** (se borró el de `big-data-multiplataforma`):

```
× cada grupo de cv.es.yaml tiene su propio dibujo
× cada grupo de cv.en.yaml tiene su propio dibujo
AssertionError: grupos que caerían en el rombo de reserva: dibuja su icono en
src/components/home/skills-iconos.tsx: expected [ 'big-data-multiplataforma' ] to deeply equal []
```

Restaurado el archivo desde su respaldo, 3 de 3 en verde. **¿Puede fallar?** Sí, y además el
mismo test prueba que `tieneDibujo("constructor")` es falso: con `in` en vez de
`Object.hasOwn`, cualquier propiedad heredada del objeto habría pasado por dibujo.

**Q. Las 18 preguntas nuevas del banco, contra el contenido de antes** (se agregaron al banco
ES/EN antes de tocar Skills):

```
× ¿Sabe Databricks o Snowflake?          × Does he know Databricks or Snowflake?
× ¿Ha usado LangChain o LangGraph?       × Has he used LangChain or LangGraph?
… 18 de 18 en rojo
AssertionError: «¿Sabe Databricks o Snowflake?» no trajo ninguna de sus fuentes esperadas.
  esperaba: skills
  trajo:    a-fondo-lo-que-busco-contexto-controles-y-abstencion~2, a-fondo-cafam-soluciones-perifericas~2, …
```

Con el contenido nuevo, las 18 en verde. El banco también corrigió una nota vieja: la pregunta
«¿Qué frameworks de agentes ha usado?» decía que el corpus no nombraba ninguno, y desde la v3
`agentes-en-produccion` tiene esa subsección. `espera` vuelve a incluirla.

**R. El índice con un solo fragmento de Skills** (se restauró el `push` único):

```
× genera índices ES y EN válidos con el contenido vigente
AssertionError: expected 0 to be greater than 1
```

Restaurado, 166 de 166 en verde.

## Gate ⭐ del dueño

**f10 (el cupo del chat en producción) aprobada por el dueño el 2026-09-26.** Con su correo en
`chat_bloqueados`, el chat mostró solo «Este correo no tiene acceso al chat. Si crees que es un
error, escríbeme desde Contacto.», sin respuesta ni búsqueda local; borrada la fila, respondió.
La verificación previa `chat_cupo(...)` dio `ok`. Las casillas de la guía viven en su navegador,
así que la aprobación queda registrada aquí (compromiso del PR #49).

## Compromisos que quedan

- **Cuando el planeador de Fabric, Databricks y Snowflake llegue a la vitrina**, el chip «en
  preparación» se cambia por uno que remita a él. Lo mismo con la app del ecosistema de
  LangChain.
- Microsoft Agent Framework y Claude Agent SDK viven solo en la tarjeta: el dueño no dijo dónde
  los usó, y no se escribió un «dónde» que el dueño no dio. Si lo dice, entran al corpus.

## Verificación

`pnpm test` **49 archivos, 1335 tests** (18 preguntas nuevas del banco, 3 del icono) ·
`typecheck` y `lint` limpios · build de producción · los dos PDF en 2 páginas · e2e de la HOME y
de reduced motion en verde en los dos perfiles · capturas en `muestras/2026-09-26-herramientas/`.
