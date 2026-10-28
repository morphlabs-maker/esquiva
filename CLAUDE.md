# Kaioken Clash — notas del proyecto

Dos juegos de peleas 3D de Dragon Ball (proyecto de fans) en un solo repo, sin servidor ni paso de build en el repo. Responder siempre en español, con frases cortas y rutas claras.

## Estado (rama `claude/dragon-ball-offline-ios-rmhovv`)

| Juego | Archivo | Descripción |
| --- | --- | --- |
| Kaioken Clash | `index.html` | Versión 2.2 (Torneo del Poder cada hora, sangre y ropa rasgada, grietas, pelo Saiyajin nuevo) sobre la 2.1: retro/chibi. Contenido de Ultra + modo historia «Junto a Goku», 33 luchadores, tienda nueva, outfits, Supervivencia, 2P en un celular, repetición y foto |
| Kaioken Clash Ultra | `ultra.html` | Versión realista/anime sobre la 1.8, 25 luchadores |

- Ultra también se publica como Artifact (https://claude.ai/artifact/6wVtcHbPRnkgo13nTjW5kJ, versión 5). Esa copia usa `window.KC_PORTRAITS` con imágenes en data URI y three.js desde cdnjs; la de `ultra.html` usa `portraits/<id>.webp` y `vendor/three.min.js`.
- `main` sigue con el minijuego Esquiva original. No se ha tocado ni se ha abierto PR.
- GitHub Pages debe apuntar a la rama del juego (Settings → Pages). No se pudo verificar desde la sesión: el proxy bloquea la API de Pages.

## Archivos clave

- `story/*.js`: arcos del modo historia (10) y `whatif.js`, como datos (`KC_STORY({...})`). Se descargan al abrir cada arco; el service worker los guarda para jugar sin internet. No van en la lista de precarga del SW (se cachean al pedirlos).

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
- **Clásico = 1.8 + contenido de Ultra.** `classic.py` aplica a la v1.8 solo personajes, formas, técnicas y tienda, mundos (Kaiosama, Dimensión rota, Bills/Whis) y mecánicas (cansancio, esquivas, Moro, Gigante de Luz). No toca interfaz, pixelado, CRT, modelos chibi ni música chiptune. Sin voces. Retratos 3D chibi (no usa `portraits/`). Piezas chibi de los nuevos en `classic-model.js`.
- **Kaioken Clash 2.0** (solo el clásico): todo el contenido nuevo es datos en `tools/ultra-build/plus-data.js` (luchadores, técnicas icónicas 4×14, outfits, fusiones válidas, jefes Oozaru/Hildegarn, diálogos, desafíos, logros, deseos, índice de arcos) y `story/*.js`. Sistemas en `plus-save.js`, `plus.js`, `plus-story.js`, `plus-actions.js`, `plus.css`; `classic.py` los inyecta.
- **Guardado compartido**: los dos juegos usan `localStorage.kc_prog` (mismo dominio). Versión 4 (`sv`), copia previa en `kc_prog_bak3`. Ultra guarda fusionando con lo que hay (no borra campos del 2.0). Las técnicas viejas se reembolsan una vez (`refunded`) pero `tech` se conserva para Ultra.
- **Sincronizar** = código de transferencia (Perfil → Pasar partida), sin servidor; al importar se fusiona (nunca se pierde nada).
- **Cosméticos de pago**: PayPal desde el navegador, desactivado hasta poner `PAYPAL.clientId` en `plus-data.js`. Sin servidor no hay verificación del pago (se puede falsear); para cobrar de verdad haría falta un backend.
- **Entornos 2.1** (`plus-worlds.js`): los índices 0-4 de `WORLDS` no cambian (online y partidas). Namek, Torneo del Poder, Dimensión rota y Planeta de Bills rehechos; nuevos 5 Antártida, 6 Kame House, 7 Capital del Oeste (variante: futuro en ruinas), 8 Montaña Paoz, 9 Torneo de Artes Marciales, 10 Planeta de Bills, 11 Habitación del Tiempo. El entrenamiento usa el Planeta de Bills. Namek tiene isla central y el suelo fuera de las islas está sobre el agua o la lava (antes se hundían).
- **Modo historia 2.1**: los lugares del mapa se colocan solos (el orden de `nodes` manda; `x`/`y` se ignoran). Cada arco tiene arte y colores propios (`MAP_ART` en `plus-story.js`). Los nodos de pelea muestran el retrato del rival. Los nodos pueden tener `intro` (escena antes de la pelea) y los rivales `outfit`. Las tomas pueden llevar `card` (título grande) y `fw` (quién se transforma si habla el narrador). No cambiar los `id` de nodos: el progreso se guarda por id.
- **Forma nueva**: al comprar una forma (o con el deseo de formas) se reproduce `formCine`.
- **Luchadores del modo historia** (Raditz, Nappa, Ginyu, Goten, Zamasu, Gohanks, Granolah, Gas) bloqueados hasta ganarlos; los ya existentes nunca se bloquean.
- **2.2 · Pelo Saiyajin**: peinados nuevos en `classic-model.js` (goku, ssj, ssj2, ssj3, ssj4, gohan, vegeta, broly, brolyL, beast y fusiones). `HAIR[x].tip` afila las puntas (`hairLock` acepta el radio de la punta). Broly SSJ/Legendario usan `brolyL`.
- **2.2 · Daño visible** (`plus-damage.js`): `dmgLook` al final de `applyFormModel` pone jirones con borde, moratón y sangre (morada en namekianos, Freezer y Cell; nada en Gamma ni Buu) con `torn>=2`; más con `torn` 3. `bleedHit` lanza gotas y manchas en el suelo. `crater()` llama a `crater2`: hueco, grietas radiales (textura canvas) y escombros, máximo 36.
- **2.2 · Torneo del Poder** (`plus-tdp.js`, modo `tdp`): abierto los minutos 0-19 de cada hora (hora del celular), opcional. Universos U7, U6, U11, U10 (equipos del anime) o «Tu universo» (hasta 4 luchadores desbloqueados). Battle royale multi-equipo (`team` = universo, el tuyo es 0). K.O. o caer fuera de la plataforma = eliminado y pasa a la grada de su universo (`world.seat`). 5 min; al acabar gana quien tenga más en pie. Poder comprimido y relativo al pico de cada luchador (`tdpPow`) para que sea parejo. La CPU también se fusiona. Victoria = Súper Esferas (una vez por hora, `prog.tdp.last`; deseo pendiente en `prog.tdp.wish`) y deseo a Súper Shenlong. `WORLDS[2]` usa la misma arena del anime (`buildTdP`) con barrera; el evento usa `TDP_WORLD` sin barrera.
- **Actualización automática** en vez de un botón de actualizar. Nunca recarga en plena pelea; un `sessionStorage` evita bucles de recarga.

## Cómo se construye Ultra (`tools/ultra-build/`)

Ultra no se edita a mano: se genera desde la v1.8 con scripts Python de reemplazo de texto. Todo está en el repo y es reproducible (verificado: la salida es idéntica a la publicada).

- `base-1.8.html`: el `index.html` v1.8 original (commit `5628e4a`), la base de todo.
- Fuentes: `chars18.js` (personajes, formas, alturas, técnicas, Gamma, Whis), `model18.js` (modelo 3D, builds por forma, pelo, capa, colas), `audio18.js` (voz, sfx, música), `worlds.js` (Kaiosama, Dimensión rota, planeta de Bills), `head18.html` (CSS).
- Clásico: `classic.py` (+ `classic-model.js` y los `plus*`) genera `out/index.html` desde `base-1.8.html`; `make.sh` lo ejecuta y `publish.py` lo copia a `index.html`. Para cambiar el clásico, edita `classic.py`, nunca `index.html`.
- Parches de Ultra, en este orden: `build18.py` → `build18b.py` (juego, Moro, bosses) → `build18c.py` → `build18d.py` (sombreado, bloom, efectos) → `build18e.py` (voces, brillo, aura, cámara, rayos) → `assemble.py`. Cada `rep()` aborta si el texto no aparece el número esperado de veces.
- `./make.sh` genera `out/ultra.html` (Pages) y `out/kaioken-clash-ultra.html` (Artifact). `assemble.py` toma los retratos de `portraits/*.webp`.
- `python3 publish.py` copia Ultra a `ultra.html` del repo, aplica el parche de cámara y de actualización al clásico, y regenera `sw.js`, manifiestos, iconos y `version.json`.
- Para cambiar Ultra: edita el `.js`/`.py` correspondiente, ejecuta `make.sh`, prueba (`tests/`), ejecuta `publish.py`, republica el Artifact con `out/kaioken-clash-ultra.html` y haz commit/push. Si no ejecutas `publish.py`, los celulares no detectan la versión nueva.
- `stage*.js`, `g18.js`, `gc.js` y `out/` son intermedios y están en `.gitignore`.

## Pruebas

Playwright con Chromium y swiftshader (`/opt/node-tools/node_modules/playwright`). Los scripts están en `tools/ultra-build/tests/` y tienen rutas de la sesión original (three.js local, `file:///home/user/kc/...`): ajústalas a `out/`. cdnjs está bloqueado, por lo que three.js se sirve localmente desde un paquete npm. Comprobado: alineación de personajes (frente, lado, espalda), selección, combate, Gigante de Luz, Dimensión rota, rayos, viewport de celular, service worker, modo sin internet y recarga por versión nueva (solo en menú, sin bucle). Conocido: el script `test.js` falla al final (`squadHTML`) por estado de royale en la prueba, no por el juego.

## Próximos pasos

0. (2.0) Probar en iPhone real: modo historia sin internet tras «Descargar todo», 2 jugadores en el mismo celular, foto (hoja de compartir), código de transferencia. Activar PayPal si se quiere (Client ID) y valorar un backend de verificación.

1. Comprobar que GitHub Pages sirve la rama y probar la instalación en un iPhone real (los dos iconos, modo avión, actualización).
2. (Hecho) Scripts de build guardados en `tools/ultra-build/`. Pendiente: dejar los tests con rutas relativas.
3. Calidad visual: los cuerpos siguen hechos de piezas simples; las capas de los Gamma se ven planas. Para un salto real harían falta modelos 3D detallados.
4. Revisar la dificultad y el equilibrio de Moro, Kefla y los Gamma con partidas reales.
5. Decidir si `main` se actualiza con los juegos (hoy solo tiene Esquiva) y si se abre un PR.
6. Mantener `version.json` y `sw.js` al día en cada publicación (`publish.py`); si no, los celulares no se enteran del cambio.
