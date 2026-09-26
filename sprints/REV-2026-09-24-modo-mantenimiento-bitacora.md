# Revisión 2026-09-24 — El modo mantenimiento

> Rama `feat/modo-mantenimiento`, un PR. Pedido del dueño: _«una página de "En mantenimiento" que
> sea fácil de poner y quitar»_.

## La decisión

Dos caminos, y el dueño eligió el primero:

| Camino                                  | Poner / quitar                         | Costo                                                                                                                          |
| --------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Variable `MANTENIMIENTO` + Redeploy** | editar la variable y redeploy, 3–4 min | ninguno: el proxy ya corre en cada página                                                                                      |
| Global Config de Vercel                 | un interruptor, ~10 s, sin redeploy    | una dependencia y una credencial nuevas, un almacén por cuenta en Hobby, una lectura por visita y lecturas incluidas limitadas |

Para un sitio personal que entra en mantenimiento pocas veces, 3 minutos de espera no justifican un
servicio más. El dueño creó la variable en `off` antes del PR.

## Qué se construyó

| Pieza                            | Qué hace                                                                                                                                                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/mantenimiento.ts`       | `enMantenimiento()`: **solo `on`** lo enciende (sin mayúsculas ni espacios); `off`, vacío, ausente o un tipeo dejan el sitio **arriba**. `idiomaDeRuta()`: el de la ruta; la raíz, español (como `localeDetection: false`) |
| `src/proxy.ts`                   | Con `on`, toda página se reescribe a `/{idioma}/mantenimiento` con **503**, `Retry-After: 1800` y `no-store`. Con cualquier otro valor, todo sigue yendo a next-intl                                                       |
| `src/app/[locale]/mantenimiento` | La página: eyebrow, nombre, titular, una frase, **el PDF** y el contacto. `noindex`. **Con el sitio arriba, `notFound()`**                                                                                                 |
| Layout                           | Sin chat en mantenimiento                                                                                                                                                                                                  |
| `CvDownloadButton`               | Recibe `origen`: la analítica distingue la descarga desde `/cv` de la de mantenimiento                                                                                                                                     |
| `playwright.config.ts`           | `MANTENIMIENTO: ""` fijo: los e2e corren con el sitio arriba aunque la terminal tenga la variable exportada                                                                                                                |

Lo que el matcher del proxy deja fuera **sigue sirviéndose en mantenimiento**: los PDF (que la
página ofrece), las fuentes, `/_next`, `robots.txt` y el sitemap. Las rutas `/api` también quedan
fuera: con todas las páginas en mantenimiento, nada en la interfaz las llama.

## Verificado en una build de producción (`MANTENIMIENTO=on pnpm build`, puerto 3100)

```
/                        HTTP/1.1 503 Service Unavailable cache-control: no-store retry-after: 1800
/es                      HTTP/1.1 503 …
/es/proyectos/vesting    HTTP/1.1 503 …
/en/cv                   HTTP/1.1 503 …   (título «Under maintenance · Henry Rincón», noindex)
/cv/Henry-Rincon-CV-ES.pdf   200 application/pdf
/sitemap.xml · /robots.txt   200
```

Es la única prueba de que `NextResponse.rewrite(…, { status: 503 })` llega de verdad al cliente;
el test unitario ve el objeto, no el servidor. axe sin violaciones en ES escritorio, EN escritorio y
ES móvil. El único error de consola es el script de Vercel Analytics, que en local no existe.
Capturas en `muestras/2026-09-24-mantenimiento/` (ignorada).

## Regla 14 — rojos en este commit

**A. Un tipeo no apaga el sitio** (el interruptor acepta también `true`):

```
× cualquier otro valor deja el sitio arriba: el error barato es no apagar
AssertionError: "true": expected true to be false
```

**B. El proxy obedece al interruptor** (se ignora):

```
× con MANTENIMIENTO=on, toda página responde la de su idioma con un 503 temporal
AssertionError: /: expected 200 to be 503
```

**C. El 503, no un 200** (la reescritura sin `status`): el mismo test, el mismo rojo. Un 200 le diría
a Google que la página de mantenimiento **es** el sitio.

**D. Con el sitio arriba, la página no existe** (e2e, sin la guarda `notFound()`):

```
✘ /es/mantenimiento responde 404   Expected: 404
✘ /en/mantenimiento responde 404
```

El proxy se prueba con next-intl simulado: next-intl importa `next/server` sin extensión y el ESM
de Node no lo resuelve en el runner. Lo que se prueba es que le **delega** todo cuando el sitio
está arriba; lo que next-intl hace con la raíz lo cubre `tests/e2e/idioma.spec.ts`.

## Documentación

Manual («Modo mantenimiento»), guía v9.7 (bloque P: p1 ⭐ verlo encendido en una preview, p2 con el
sitio arriba no existe), `design-system.md` + tarjeta `componentes-mantenimiento/`, `.env.example`
y BLUEPRINT (fila de hosting e historial).
