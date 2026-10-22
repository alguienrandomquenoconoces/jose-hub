# Mis juegos

Web que muestra sola todos los juegos de la carpeta `docs/games/`.

## Estructura del repositorio

```
docs/
  index.html
  README.md
  games/
    Jose_Dash.html        ← un juego en un solo archivo
    Jose_Dash.png         ← portada opcional (mismo nombre)
    otro-juego/           ← o un juego con carpeta
      index.html
      cover.png           ← portada opcional
```

## Cómo publicarla en GitHub

1. Crea un repositorio y sube la carpeta `docs/` entera.
2. Ve a **Settings → Pages**, elige la rama `main` y la carpeta `/docs`, y guarda.
3. Tu web estará en `https://TU-USUARIO.github.io/TU-REPO/`.

Para añadir un juego, súbelo a `docs/games/`. No hay que tocar nada más.

## Opciones

- **Título y carpeta:** edita `CONFIG` al principio del script de `index.html`.
- **Nombres y portadas a mano (opcional):** crea `docs/games/games.json`:
  ```json
  [
    "Jose_Dash.html",
    { "name": "Cuida al Tío", "file": "Cuida_al_Tio_v12.html", "cover": "games/tio.png" }
  ]
  ```
- **Probar en tu PC:** abre una terminal dentro de `docs/` y ejecuta `python -m http.server`; luego entra en `http://localhost:8000`.

## Cómo detecta los juegos

1. Lee `docs/games/games.json` si existe.
2. Si no, pregunta a GitHub qué hay en `docs/games/` (la web detecta tu usuario y repo sola).
3. En local, lee el listado de la carpeta.

## Clasificaciones

- `clasificaciones.html` es la página donde se elige qué clasificación ver (una tarjeta por juego; para añadir otra, una línea en el array `LBS` de su script).
- Snake de JOSE usa `lb-snake.js` (mismo Firebase que `lb-shared.js`, ruta `scores_snake`) y `clasificacion_snake.html`.
