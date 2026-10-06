# Esquiva

Minijuego arcade para el navegador: mueve el orbe, esquiva los bloques rojos y atrapa las estrellas doradas. Cada segundo que aguantas, el juego va más rápido.

## Cómo jugar

Abre `index.html` en cualquier navegador moderno. No hace falta instalar nada ni usar un servidor.

| Acción | Controles |
| --- | --- |
| Mover el orbe | Ratón, dedo (pantallas táctiles), flechas o `W` `A` `S` `D` |
| Empezar / reintentar | Botón **Jugar**, `Enter` o `Espacio` |

## Puntuación

- Ganas 1 punto por cada segundo que sobrevives.
- Cada estrella dorada suma **+5**.
- Tu récord se guarda en el navegador (`localStorage`), así que sigue ahí aunque cierres la pestaña.

## Estructura

Todo el juego está en un único archivo, [`index.html`](index.html): HTML, CSS y JavaScript con `<canvas>`, sin dependencias externas.
