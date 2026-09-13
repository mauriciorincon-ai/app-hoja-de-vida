# Prompt a la planeadora — el roadmap votable, por app hermana

> Redactado el 2026-09-13 desde el repo de la app (`app-hoja-de-vida`), a pedido del dueño
> durante el gate ⭐ post-S8 (bloque G). Para pegar en la sesión de la planeadora
> (`hr01-develop-ai-apps`). La app no escribe allá: este archivo es la copia versionada de lo que
> se le pidió. Lo que entregue se copia a `data/fichas/<slug>.yaml` sin editarlo aquí.

---

Hola. Necesito de ti el **roadmap votable de cada app hermana** de la vitrina de CV Viva. Te
cuento el contexto, lo que pido y el formato exacto.

## Contexto

CV Viva tiene desde el Sprint 004 una votación anónima de features futuras (Supabase, cero PII,
un voto por navegador). Hasta hoy las features que se votaban eran **de CV Viva y de su chat**,
escritas por la app en el S4. El dueño decidió el 2026-09-13:

1. **Ninguna feature de CV Viva se muestra en ningún lado.** Ya se retiraron.
2. **Cada grupo de features vive en la página inicial de cada app hermana** (`/vitrina/apps/<slug>`),
   no en una sección común.
3. Las features las controlas tú, que llevas el plan de cada app. Por eso te las pido a ti.

Las apps hermanas publicadas en la vitrina hoy son seis, por su `slug` de export:
`anonimizador` · `dash-agent-ai` · `ds` · `habla` · `inmobiliaria` · `nutri-kids`.

## Lo que pido

Para **cada una de las seis apps**, entre **3 y 5 features** que cumplan las tres condiciones:

- **Las más disruptivas e innovadoras** de su plan: lo que haría que alguien quiera votar por
  ellas, no mejoras incrementales.
- **Las que vienen al final del plan**, no las que se están construyendo ahora ni las del próximo
  sprint: esas van a implementarse de todos modos y votarlas no decide nada.
- **Que puedas sostener con el plan de la app** (visión, brief, backlog): nada inventado para
  llenar la lista. Si una app no tiene 3 features de cierre que cumplan esto, entrega las que
  tenga, aunque sea una, y dilo.

## Formato exacto (lo copio tal cual)

Un bloque YAML por app, para `data/fichas/<slug>.yaml` de CV Viva (el complemento curado que ya
administras, `procedencia: cv-viva`). Los `id` en minúsculas-con-guiones y **estables**: el par
(app, feature) es la clave del voto en la base de datos y cambiar un `id` reinicia su conteo.
Título de una línea; descripción de una o dos frases, en segunda persona hacia quien vota, sin
fechas ni promesas de entrega. Español e inglés, los dos.

```yaml
roadmap:
  - id: id-estable-en-kebab-case
    titulo:
      es: "Título corto en español"
      en: "Short title in English"
    descripcion:
      es: "Qué cambia para quien la use, en una o dos frases."
      en: "What changes for whoever uses it, in one or two sentences."
```

## Reglas que ya conoces y aquí también aplican

- **Cero enlaces**: ni URLs ni nombres de dominio en títulos o descripciones.
- **Cero terceros identificables**: ninguna persona, empresa cliente ni dato de nadie.
- **Sin fechas prometidas** («pronto», «en Q1», «la próxima versión» tampoco).
- Nada que ya esté construido o en construcción: si dudas de una feature, déjala fuera y anótala.

## Qué haré con lo que entregues

Copio cada bloque a su `data/fichas/<slug>.yaml`, amplío el esquema para que lo valide el build,
y monto el roadmap con su votación **en la página de cada app**, con el mismo motor de votos que
ya existe. Eso lleva un ADR y sus tests; lo haré cuando tenga los datos, no antes. Si una app se
queda sin roadmap, su página simplemente no lo muestra.

Gracias.
