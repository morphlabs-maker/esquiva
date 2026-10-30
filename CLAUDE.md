# Kaioken Clash — notas del proyecto

Dos juegos de peleas 3D de Dragon Ball (proyecto de fans) en un solo repo, sin servidor ni paso de build en el repo. Responder siempre en español, con frases cortas y rutas claras.

## Estado (rama `claude/dragon-ball-offline-ios-rmhovv`)

| Juego | Archivo | Descripción |
| --- | --- | --- |
| Kaioken Clash | `index.html` | Versión 3.2 (arco Daima con los 3 guardianes, Gas rehecho, versiones con tope de poder, maestría que sube el poder, arreglos de disparos y cinemáticas) sobre la 3.1 (versiones por arco reales, SSJ4 de Daima, Vegeta SSJ3, cinemáticas de película) sobre la 3.0 (3D libre con cámara detrás del luchador, Kaioken combinable, técnicas con forma propia, versiones por arco y maestría, paseo por el planeta de Bills, Toppo, mundo en órbita) sobre la 2.2: retro/chibi. Contenido de Ultra + modo historia «Junto a Goku», 34 luchadores, tienda nueva, outfits, Supervivencia, 2P en un celular, repetición y foto |
| Kaioken Clash Ultra | `ultra.html` | Versión realista/anime sobre la 1.8, 25 luchadores |
| Kaioken Clash 3.0 (copia) | `v3.0/index.html` | Copia guardada de la 3.0 con sus propios `story/`, `vendor/` y `fonts/`; no se actualiza sola. Etiqueta git `v3.0`. |
| Edición Unity | `unity/KaiokenClash/` | Proyecto Unity 2022.3 en C# (ver su README). Personajes de proporciones de figura y mundos estilo manga, creados por código. Datos exportados de la web. |

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
- **3.0 · 3D de verdad** (`plus-3d.js`): cámara en tercera persona detrás del luchador (`cam3D`) y movimiento relativo a la cámara (`input3D` → `inp.v3`). Objetivo fijado por defecto (A/D rodean al rival); `L`/🔓 lo libera y la cámara se gira con ratón, ← → o arrastrando el dedo (`#camZone`). Space/C (⤒ ⤓) suben y bajan. La cámara clásica sigue en la pausa (`kc_cam3d`). Online, versus local y 2P en un celular usan la clásica. La CPU rodea (`inp.sx`) y no dispara sin línea de visión (`losBlocked`); los troncos son coberturas (`COVER` en `plus-worlds.js`).
- **3.0 · Kaioken combinable**: `K`/KK sube x3 → x10 → x20 → apagado sobre cualquier forma (Goku y Vegito), también en la historia (`kkTick`, `f.kkL` multiplica `realPower`). Drena vida y se apaga solo antes de dejarte K.O.
- **3.0 · Técnicas con forma propia** (`plus-moves.js`, `MOVE3`): hakai, disc (Kienzan), spiral (Makankosappo), sword (Espada Espiritual, guadaña), rain (lluvia de ki multidireccional), hellzone, genki, glare (Jiren), barrier (17), meteors (Moro). Se asignan por nombre (`TECH_TYPES`). Segundo especial `s2` con `X`/🌟 (o especial + guardia).
- **3.0 · Datos nuevos** (`plus-data3.js`): Black Rosé fase 3 (410 MM) y fase 4 (600 MM), Ultra Ego de Vegeta a 770 MM, Toppo (base → Dios de la Destrucción = Blue Evolucionado; U11 del Torneo). En `story/bro.js`, Gogeta Blue es ×5 Broly Legendario.
- **3.0 · Cinemáticas**: acciones nuevas en las tomas (`rise`, `lift`, `explode`, `dance`, `merge`, `uiwake`, `hide`/`show`, `balls`/`ballsOff`, cámara `sky`). Reescritas: muerte de Krilin, Makankosappo, sacrificio de Vegeta y de Goku contra Cell, ritual del Dios, danzas de Gotenks y Gogeta, Potara de Vegito, guerreros que salen del suelo en el Torneo, despertar del Ultra Instinto. Shenlong y Súper Shenlong rehechos (`buildShenlong`) con las 7 esferas o las Súper Esferas.
- **3.0 · Música** (`plus-music.js`): una canción original por arco (`arc_<id>`), no las del anime.
- **3.0 · Versiones y maestría** (`plus-mastery.js`): versión por arco (`VER_ARCS`, ×poder `VER_K`, maestría inicial `VER_M`), se eligen en la selección y se abren con los arcos. Maestría por forma en `prog.mast` (décimas): menos ki (×1-0,6k) y más daño (×1+0,35k). Entrenamiento: con Whis, sparring con Vegeta, tú y Vegeta contra Whis o Bills (solo esquivan y empujan, nadie cae) y paseo libre.
- **3.0 · Paseo por el planeta de Bills** (`plus-free.js`): sin objetivo, NPC Vegeta, Broly, Cheelai, Whis, Goku (Gohan si juegas con Goku) y Bills; saludar, comer en la mesa o pedir combate (con Cheelai no).
- **3.0 · Selección y articulación**: cuadrícula a la derecha y vista previa grande con guardia y gestos (`plus-select.js`); articulaciones nuevas cadera, muñecas y tobillos y poses nuevas (`plus-anim.js`).
- **3.0 · Outfits** con piezas propias (`add`/`rm` en `OUTFITS`): Vegeta gi azul sin armadura, Yardrat, Capsule Corp; Goku fin de Z, GT, gi negro, Yardrat, granjero, Patrulla…
- **3.0 · Mundo 12**: Órbita de la Tierra (`plus-world3.js`), sin suelo.
- **3.0 · Historia libre**: al terminar la historia, en peleas ya superadas «Modo libre» deja jugar con cualquier luchador y todas tus formas (`freeSpec`).
- **3.1 · Versiones por arco desde la historia** (`gen-versions.js` → `plus-verdata.js`, se regenera en `make.sh`): cada versión fija poder base y formas de ese arco en todos los modos (Goku Saga Saiyajin: 8000 y solo Kaioken). Fuera de la historia el poder base sigue creciendo con `VER_K`. Formas extra fuera de la historia en `EXTRA` (Vegeta SSJ3 en Buu). En «Modo libre» de la historia se usa la versión del arco de esa pelea.
- **3.1 · SSJ4 de Daima** (pelaje rosado, pecho al aire, melena magenta, ojos con borde rojo) para Goku, Vegeta, Gogeta y Vegito; **Vegeta SSJ3** añadido al final de su lista de formas (no mueve compras guardadas) con orden de transformación en `ch.order`.
- **3.1 · Arreglos**: los proyectiles teledirigidos no pierden velocidad (`p.spd`, `p.hd` retraso antes de perseguir); la lluvia de ki de Gogeta ya golpea. En las cinemáticas el suelo cuenta las rocas (`cineGround`): nadie sale hundido en los escalones del Torneo.
- **3.1 · Cinemáticas de película**: cortes con fundido (`#cinefade`), plano por encima del hombro (`over`), acercamiento lento en primeros planos, travelling y grúa, viñeta y grano (`cinePickCam`, `cineMove`).
- **3.2 · Arco Daima** (`story/dai.js`, `side:1` en `ARCS`): va entre Buu y Dioses pero no bloquea los arcos siguientes ni cuenta para `storyAllDone` (no se pierde lo ya abierto). Vegeta SSJ3 contra los guardianes `tama1` (espada), `tama2` (tridente) y `tama3` (martillo), desbloqueables; piezas `tama*` en `classic-model.js`. Al final Goku SSJ4 (versión `dai` de Goku).
- **3.2 · Versiones**: `gen-versions.js` crea versión en cada arco donde sale el luchador (también solo en escenas). `verInfo` da poder base, formas (las que no salen en ninguna versión van a la última) y tope (`verCap`). Kaioken limitado por arco (`kkLevels`): antes del Universo 6 solo sobre el estado base y hasta el nivel del arco. La forma elegida en la selección manda (si la versión no la tiene, se usa la más cercana que sí).
- **3.2 · Maestría**: sube el poder de la forma hasta +35 % (en `realPower`, ya no en el daño) y abarata transformarse hasta -60 % (`stepCost(f,w)`, `mastFormK`).
- **3.2 · Arreglos**: los teledirigidos van directos al rival cuando están cerca (Hellzone, lluvia de ki); los especiales cortados borran sus esferas (`spWatch`, `cleanSp`); Quebrantador de Espíritu de Gogeta (`soul`) pequeño y multicolor; filtro de cine `position:fixed`; las escenas de la historia se repiten siempre; Namek: la marea sube poco y no en la historia; Gas rehecho (melena larga, armadura Heeter, forma del deseo envejecida, ojos en blanco más allá del límite).
- **3.2b · Gas** (5 formas del manga, imágenes del usuario): base 120 MM (rastas moradas, diadema con colmillos, tabardo rojo, botas azules) → `wish` 500 MM (musculoso, ojos en blanco, ropa rota) → `coat` 650 MM (rastas negras, tabardo largo) → `awaken` 800 MM → `limit` 900 MM (consumido, ojos negros, harapos). `coat` y `awaken` van al final de `forms` con `order`. **Granolah** 100 MM → deseo 850 MM (ropa negra con tirantes, pelo blanco, visor). Goku UI dominado = 900 MM. **Cell Max** con placas rojas, alas negras, boca abierta y cola con maza. **Zamasu fusionado** con abrigo de Kaioshin y forma nueva `corrupt` (brazo morado). Piezas en `classic-model.js` (`dreads*`, `gasCrown`, `tabard*`, `rags`, `scope`, `suspenders`, `max*`, `kaioCoat`, `purpleArm`).
- **3.2b · Versiones**: el crecimiento por arco (`VER_K`) se mide desde Namek para todos (`anc` en `verInfo`), así se conservan las proporciones de la historia. Kaioken (botón KK) siempre disponible para Goku, Vegito y Gogeta (`KK_FREE`); el tope de versión se multiplica por el nivel de Kaioken. Retratos encuadrados por el tamaño real de la cabeza (`ch.porK` para alejar).
- **3.2b · Historia**: Vegito empieza en SVG con el doble de poder que Buu (4 MM contra 2 MM).
- **3.2c · La versión se nota en batalla**: el rival (CPU o 2P) tiene su propia versión (`prog.ver2`, fila de versión también en su lado; por defecto la más cercana a la tuya). La dificultad ya no recorta la diferencia de versión (`verGap` en `power()`). Por arco (`vtk`, de la Saga Saiyajin a Granolah): velocidad ×0,8→1,2, carga de ki ×0,75→1,3, tamaño de rayos y esferas ×0,75→1,35, empuje ×0,85→1,35; en la Saga Saiyajin no hay teletransporte. En la historia usa el arco de la pelea; online y sin versión, ×1.
- **Edición Unity** (`unity/KaiokenClash`): `tools/unity-export/export.js` vuelca los datos de la web a `Assets/Resources/Data/kaioken.json`. Sin escenas ni prefabs: `Bootstrap` crea el juego al arrancar y `Editor/KaiokenSetup.cs` crea la escena y la configuración de iPhone. Comprobación sin Unity: `mcs` contra `tools/unity-export/stubs/UnityStubs.cs` (firmas) y `mono` con `UnityRuntime.cs` + `sim/Sim.cs` (simulación de peleas y cinemáticas). Falta por portar: online, tienda, outfits, Torneo por horas, NPC y 2 jugadores.
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
