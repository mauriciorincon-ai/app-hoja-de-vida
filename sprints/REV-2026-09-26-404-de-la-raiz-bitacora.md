# Revisión 2026-09-26 — El 404 de la raíz y el ícono en Safari

> Rama `fix/archivo-inexistente-da-404`, un PR. El dueño seguía viendo el triángulo de Vercel en la
> pestaña después del merge del PR #46. El servidor ya entregaba las iniciales: era la caché de
> Safari. Pero al revisarlo apareció un error real, justo en la ruta del ícono que Safari pide por
> su cuenta: respondía 500.

## 1. El ícono: el servidor entregaba HR

Lo que sirve el dominio, comparado byte a byte (sha-256) con el repo, tras el merge del #47:

| Ruta                                   | Estado  | Igual al repo |
| -------------------------------------- | ------- | ------------- |
| `/favicon.ico` (y con su `?favicon.…`) | 200     | sí            |
| `/icon.svg?icon.…`                     | 200     | sí            |
| `/apple-icon.png?apple-icon.…`         | 200     | sí            |
| `/apple-touch-icon.png`                | **500** | —             |
| `/apple-touch-icon-precomposed.png`    | **500** | —             |

Las cuatro páginas revisadas (`/es`, `/en`, `/es/cv`, `/es/vitrina`) enlazan los tres íconos, y
todos salen con `cache-control: public, max-age=0, must-revalidate`: el servidor no pide que se
guarden. El navegador predeterminado del dueño es **Safari** (LaunchServices no declara otro), y
Safari guarda los íconos en `~/Library/Safari/Favicon Cache`, una caché propia que casi nunca
renueva y que la ventana privada no siempre salta. El manual decía «abre una ventana privada»;
ahora el manual y la guía (a7) explican cómo vaciar esa caché, y en Chrome o Brave basta con
Cmd+Shift+R.

## 2. El 500: un archivo que no existe en la raíz

**El síntoma**, en producción: `/apple-touch-icon.png`, `/favicon.png`, `/manifest.webmanifest`,
`/cualquier-cosa.png`, cualquier ruta de un solo segmento con punto que no fuera un archivo,
respondía **500** con la página de error de Next. `/algo`, sin punto, redirigía bien a
`/es/algo` y daba el 404 localizado.

**La causa**, leída en el log del servidor:

```
Error: ENOENT: no such file or directory, open '…/data/cv.manifest.webmanifest.yaml'
```

1. El `matcher` del proxy excluye toda ruta con punto (`.*\\..*`), a propósito: así llegan
   derecho los PDF del CV, las fuentes y `robots.txt`. Nadie le antepone `/es`.
2. La ruta cae en `[locale]` con `locale = "manifest.webmanifest"`.
3. El layout de `[locale]` llama `notFound()`, pero **no hay ninguna frontera por encima de él**:
   era el layout raíz.
4. La página corre en paralelo con el layout, llama `getCv(locale)`, y `getCv` intenta leer
   `data/cv.manifest.webmanifest.yaml`. El ENOENT gana y la respuesta es un 500.

**El arreglo**, en tres piezas:

- `src/app/layout.tsx`: una raíz que solo deja pasar a sus hijos. El `<html>` lo sigue poniendo
  `[locale]/layout.tsx`. Existe para que haya dónde colgar el 404 de la raíz.
- `src/app/not-found.tsx`: el 404 de lo que no tiene idioma. Habla los dos, con los textos del
  404 localizado (`messages/*.json`, clave `notFound`), y un botón a cada HOME. Las fuentes vienen
  de `src/app/fuentes.ts`, módulo nuevo que comparten este 404 y el layout de cada idioma
  (definirlas dos veces duplicaría las `@font-face`). Los comentarios de ADR-006 se mudaron con
  ellas, sin cambios.
- `getCv` (`src/lib/content.ts`): **un idioma que no existe es una página que no existe.** Si el
  idioma no es `es` ni `en`, `notFound()` antes de tocar el disco. Sin esto, la raíz nueva no
  basta: la página sigue leyendo el archivo inexistente y el 500 se queda (medido: con las dos
  primeras piezas y sin esta, `/favicon.png` seguía en 500). `getCv` es el único cargador de
  páginas que lee archivos por idioma (`git grep` de `${locale}` en `src/`).

Medido con un build local después del arreglo: `/favicon.png`, `/manifest.webmanifest`,
`/wp-login.php`, `/.env`, `/x.png/cv`, `/x.png/vitrina`, `/x.png/vitrina/apps`,
`/x.png/proyectos/vesting`, `/x.png/apps/cv-viva` y `/x.png/mantenimiento` responden 404, y el
servidor no registra ni un error. `/es/no-existe` y `/es/x.png` siguen dando el 404 localizado,
idéntico al de producción (renderizado con Chromium: `lang="es"`, solo el español, un botón, el
chat). Capturas en `muestras/2026-09-26-404-raiz/` (ignorada).

**Lo que se descartó:**

- **`global-not-found.js`**: es experimental en Next 16.3 y solo actúa cuando la URL no coincide
  con ninguna ruta. `/favicon.png` sí coincide con `[locale]`.
- **`dynamicParams = false` en `[locale]/layout.tsx`**: haría 404 cualquier idioma no generado,
  pero la opción se hereda a los hijos. `[...rest]` no tiene `generateStaticParams`, así que
  `/es/no-existe` dejaría de pasar por el 404 localizado y caería en el de la raíz, sin chat y en
  dos idiomas. La e2e del 404 localizado **no lo habría visto**, porque solo pedía el título en
  español y el bilingüe también lo tiene. Por eso esa e2e gana una aserción (rojo C).

## 3. Las rutas clásicas del ícono de iOS

Safari y otros clientes piden `/apple-touch-icon.png` y `/apple-touch-icon-precomposed.png` sin
leer el `<link>` de la página. Con el arreglo de arriba responderían 404; ahora `next.config.ts`
las reescribe al `apple-icon.png` de la convención de Next. Es el mismo archivo, sin copia: una
segunda copia se desfasaría de los tokens el día que se corra `pnpm iconos`.

## Regla 14 — rojos en este commit

**A. El 404 de la raíz, sin la regla en `getCv`.** Build con la raíz, el 404 bilingüe y las
reescrituras, pero sin el `notFound()` en `getCv` (el estado intermedio del arreglo). Las cinco
pruebas nuevas del 404 fallan por su aserción de estado:

```
Error: expect(received).toBe(expected) // Object.is equality
Expected: 404
Received: 500
```

(× `/favicon.png`, `/manifest.webmanifest`, `/cualquier-cosa.txt`, el 404 bilingüe y su scan de
axe). La de las rutas clásicas del ícono pasó en ese build, porque la reescritura ya estaba: su
rojo es el B.

**B. Sin la reescritura** (se quita `rewrites()` de `next.config.ts`):

```
Error: /apple-touch-icon.png
Expected: 200
Received: 404
```

**C. Sin el 404 localizado** (se borra `src/app/[locale]/not-found.tsx`, en el mismo build que
B). `/es/no-existe` cae en el 404 de la raíz, y la aserción nueva lo nombra:

```
Error: expect(locator).not.toContainText(expected) failed
Expected substring: not "This page doesn't exist"
Received string: "Esta página no existeThis page doesn't exist"
```

**D. El scan de axe del 404 de la raíz** (se quita `lang="es"` del `<html>`, con `next dev`). En
el rojo A esta prueba falló antes, en el estado, así que su aserción de axe aún no se había visto
fallar:

```
Error: expect(received).toEqual(expected) // deep equality
+     "id": "html-has-lang",
```

Cada uno se revirtió desde su respaldo (`cp`), y la misma prueba pasó en verde sobre el mismo
servidor: D con `next dev` tras restaurar, y A, B y C sobre el build del arreglo. **¿Puede
fallar?** Sí, las cuatro: ninguna regla anterior cubría estas rutas (el único 404 probado era
`/es/no-existe`, que pasa por el proxy).

## Verificación

`pnpm test` **48 archivos, 1306 tests** · `typecheck` y `lint` limpios · e2e completo sobre el
build del arreglo: **410 pasan**, 14 saltadas (las de siempre). Un detalle de la corrida: la
primera vez arranqué `next start` a mano, sin las variables que el config de Playwright le pasa a
su servidor (la puerta del chat en memoria, el código fijo, el secreto de prueba), y fallaron las
22 del chat. Con esas mismas variables, el spec del chat pasó 22 de 22. Las 410 son 398 de antes
más las 12 nuevas (5 en la HOME y 1 de axe, por dos perfiles).
