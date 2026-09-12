---
slug: los-tableros
titulo: "Los tableros: datos públicos, verificados"
resumen: "Los seis tableros que publiqué sobre datos abiertos, y el rigor con que se construyen."
estado: borrador
ancla: "/vitrina/tableros"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué tableros ha publicado Henry?"
  - "¿Cómo verifica Henry que los datos de un tablero son correctos?"
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

Son seis tableros construidos desde cero sobre fuentes de datos públicas, publicados en la vitrina de
este sitio con su ficha técnica. No son ejercicios: cada uno toma un universo de datos completo, lo
modela y lo verifica contra las identidades del propio origen.

Existen por la misma razón que todo lo demás que publico: un currículum que dice «ingeniería de
datos» afirma; un tablero cuyas identidades contables cierran en cero demuestra.

## Los seis

<!-- seccion: los-seis -->

**Banca colombiana bajo la lupa.** Once años de estados financieros de las ochenta y una entidades de
crédito del país, con las identidades contables del origen corridas enteras.

**Las empresas de Colombia en cifras.** Ocho años de estados financieros de casi cuarenta mil
sociedades, con las identidades verificadas en cero y la cobertura del propio universo medida en una
página.

**Tasas, inflación y deuda: el ciclo monetario.** Veintisiete años de política monetaria de cuarenta y
una áreas, tomados de siete organismos, con las dos fuentes oficiales de la curva estadounidense
contrastadas par a par.

**¿En qué gasta el Estado colombiano y con quién?** Cuatro millones de contratos públicos y ocho años
de presupuesto nacional en un solo modelo, con la cifra de control validada contra la que aprobó el
Congreso.

**Energía y clima.** Cómo el mundo genera su electricidad y cuánto calienta el planeta, sobre siete
fuentes abiertas y con sus propios límites puestos a la vista.

**Fórmula 1: setenta y siete temporadas contadas bien.** Medidas contra los veinte totales que
publica el propio origen; las veinte identidades cierran.

## La regla que comparten: las identidades tienen que cerrar

<!-- seccion: las-identidades -->

Es lo que hace que estos tableros signifiquen algo.

Una identidad contable es una igualdad que el propio origen garantiza: activo igual a pasivo más
patrimonio, la suma de las partidas igual al total publicado, los puntos de cada temporada iguales al
campeonato. Verificarlas no es una buena práctica opcional: es la única forma de saber que el modelo
no perdió, duplicó ni desalineó nada por el camino.

En el tablero de banca, el balance cierra en las más de siete mil setecientas combinaciones. En el
del Estado, los veintiún contrastes. En el de Fórmula 1, las veinte identidades — y **tres de ellas
no cerraban al principio**, lo cual es la parte interesante: destaparon problemas reales del origen,
y eso se cuenta en la ficha en vez de esconderse.

## Publicar los límites

<!-- seccion: publicar-los-limites -->

Cada tablero publica lo que **no** puede decir. El de energía y clima pone sus propios límites a la
vista; el de empresas mide en una página cuánta parte del universo cubre de verdad.

Un tablero que solo muestra lo que sabe invita a conclusiones que no soporta. Declarar la cobertura y
los vacíos es lo que permite que alguien use el resultado sin equivocarse, y es exactamente lo que
haría falta en la mayoría de los informes corporativos que he visto.

## Qué demuestran de mi trabajo

<!-- seccion: que-demuestran -->

Ingeniería de datos de extremo a extremo sobre datos que cualquiera puede descargar y contrastar:
ingesta de fuentes heterogéneas, modelado dimensional, verificación contra el origen, medición de
cobertura y visualización que no miente.

Es lo mismo que hice en TransMilenio unificando fuentes y en Vesting diseñando el ecosistema, con dos
diferencias: aquí los datos son públicos, así que el resultado es auditable por quien quiera; y las
decisiones de modelado están escritas.

[CONFIRMAR: ¿con qué stack están construidos los tableros — Power BI, Fabric, algo más? Las fichas lo
dicen por pieza, pero este documento gana bastante si puede decirlo en una frase.]
