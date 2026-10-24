# Kaioken Clash — notas del proyecto

Dos juegos de peleas 3D de Dragon Ball (proyecto de fans) en un solo repo, sin servidor ni paso de build en el repo. Responder siempre en español, con frases cortas y rutas claras.

## Estado (rama `claude/dragon-ball-offline-ios-rmhovv`, último commit `88120c5`)

| Juego | Archivo | Descripción |
| --- | --- | --- |
| Kaioken Clash | `index.html` | Versión 1.8, estilo retro pixelado |
| Kaioken Clash Ultra | `ultra.html` | Versión realista/anime sobre la 1.8, 25 luchadores |

- Ultra también se publica como Artifact (https://claude.ai/artifact/6wVtcHbPRnkgo13nTjW5kJ, versión 5). Esa copia usa `window.KC_PORTRAITS` con imágenes en data URI y three.js desde cdnjs; la de `ultra.html` usa `portraits/<id>.webp` y `vendor/three.min.js`.
- `main` sigue con el minijuego Esquiva original. No se ha tocado ni se ha abierto PR.
- GitHub Pages debe apuntar a la rama del juego (Settings → Pages). No se pudo verificar desde la sesión: el proxy bloquea la API de Pages.

## Archivos clave

- `sw.js`: service worker de red primero (siempre la última versión con internet; copia en caché sin internet). La versión de la caché se regenera en cada publicación.
- `version.json`: `{"v": "<timestamp>"}`. Los dos juegos lo consultan al abrir, al volver a la pestaña y cada 60 s. Si cambió y no hay pelea en curso (`game.phase` activa y `menuState` vacío), recargan solos.
- `manifest.json` + `icon-*.png`: app de Kaioken Clash. `manifest-ultra.json` + `icon-ultra-*.png`: app de Ultra (cada una con su icono en el iPhone).
- `portraits/*.webp`: 25 retratos anime (Higgsfield), uno por personaje.
- `vendor/`, `fonts/`: three.js r128, PeerJS, fuente Press Start 2P.

## Decisiones tomadas

- **Ultra parte de la 1.8**, no de la versión con Kairon. Se mantuvieron fusiones, Cell Max y Gohan Bestia.
- **Alturas canónicas** por personaje (`ch.h`) y una build corporal por forma (SSJ4 con manos y melena grandes, SSG delgado). Las colas (SSJ4, Bills, Freezer) van detrás del personaje.
- **Androides no se cansan.** Sin frases robóticas en los ataques.
- **Voces:** solo el grito de transformación (`vox` ignora todo menos `'tscream'`).
- **Moro:** absorción regulada (drena vida/ki y ralentiza al rival, con límites) y fases del manga.
- **Gigante de Luz** (Goku, 1,15 B): avatar cian translúcido del tamaño de Cell Max; UI dominado permanente.
- **Brillo:** bloom selectivo hecho a mano. Solo las auras (marcadas con `userData.glow`) alimentan el resplandor; cuerpos, mundo y rayos se pintan en negro o se ocultan en esa pasada. `KeyB` activa o desactiva el bloom. Rayos y explosiones usan mezcla normal, sin resplandor.
- **Aura** escala con el cuerpo del luchador (`aura.body`), para personajes grandes.
- **Cámara** más cercana que antes, y aún más en pantallas táctiles (`coarse`): factor 0,7 en Ultra y 0,72 en el clásico.
- **Actualización automática** en vez de un botón de actualizar. Nunca recarga en plena pelea; un `sessionStorage` evita bucles de recarga.

## Cómo se construye Ultra (fuera del repo)

El código fuente de Ultra no está en el repo: se genera con scripts Python de reemplazo de texto sobre `index.html` (v1.8) en el directorio de scratchpad de la sesión (`.../scratchpad/kc/`): `build18.py`, `build18b.py`, `build18c.py`, `build18d.py`, `build18e.py`, `assemble.py`, `make.sh`, `publish.py`. Cada reemplazo (`rep()`) falla si no encuentra el texto exacto el número esperado de veces. `publish.py` copia Ultra al repo, aplica el parche de cámara al clásico, regenera `sw.js`, manifiestos, iconos y `version.json`.
**Riesgo:** esos scripts viven en un directorio temporal y se pierden con el contenedor.

## Pruebas

Playwright con Chromium y swiftshader (`/opt/node-tools/node_modules/playwright`). cdnjs está bloqueado, por lo que three.js se sirve localmente desde un paquete npm. Comprobado: alineación de personajes (frente, lado, espalda), selección, combate, Gigante de Luz, Dimensión rota, rayos, viewport de celular, service worker, modo sin internet y recarga por versión nueva (solo en menú, sin bucle). Conocido: el script `test.js` falla al final (`squadHTML`) por estado de royale en la prueba, no por el juego.

## Próximos pasos

1. Comprobar que GitHub Pages sirve la rama y probar la instalación en un iPhone real (los dos iconos, modo avión, actualización).
2. Guardar los scripts de build en el repo (por ejemplo `tools/ultra-build/`) con rutas relativas.
3. Calidad visual: los cuerpos siguen hechos de piezas simples; las capas de los Gamma se ven planas. Para un salto real harían falta modelos 3D detallados.
4. Revisar la dificultad y el equilibrio de Moro, Kefla y los Gamma con partidas reales.
5. Decidir si `main` se actualiza con los juegos (hoy solo tiene Esquiva) y si se abre un PR.
6. Mantener `version.json` y `sw.js` al día en cada publicación (`publish.py`); si no, los celulares no se enteran del cambio.
