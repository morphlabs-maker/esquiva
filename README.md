# Kaioken Clash

Juego de peleas 3D de Dragon Ball (proyecto de fans, sin fines comerciales), con estilo retro pixelado. Funciona **sin internet** y se instala en el iPhone como una app.

## Instalar en el iPhone (sin internet)

1. Publica el repo con GitHub Pages: **Settings → Pages → Branch** = la rama del juego, carpeta `/ (root)`.
2. En el iPhone, abre `https://morphlabs-maker.github.io/esquiva/` en **Safari** (con internet, solo esta vez).
3. Toca **Compartir → Añadir a pantalla de inicio**.
4. Ábrelo desde el icono. A partir de aquí funciona en modo avión: el juego, el motor 3D y la fuente quedan guardados en el teléfono.

Se juega en horizontal. Para actualizarlo, ábrelo una vez con internet.

## Modos

| Modo | Descripción |
| --- | --- |
| Contra la CPU | 1 contra 1, tres dificultades |
| Contra el jefe / Equipo con la CPU / Cooperativo | Contra Broly (Goku en su forma máxima lo supera ×1,4), el **Dragón Alienígena de tres cabezas** (se le gana en Blue + Kaio-ken, es el que más vida tiene) o Bills |
| 2 vs 1 · Tú + CPU | Tú y una CPU aliada contra una CPU |
| 2 vs 1 · Con un amigo | Dos jugadores en el mismo celular (pantalla dividida) o con 2 mandos |
| 1 vs 2 · Tú solo | Tú contra un equipo de 2 CPU |
| Battle Royale | Equipos de 1 a 5 por lado (1 vs 5, 5 vs 1, 5 vs 5…). 🎯 (`V`) cambia de objetivo |
| 🌐 Online | 1 contra 1 o cooperativo contra un jefe, cada uno en su celular. Uno crea la sala y el otro entra con el código (necesita internet) |
| Versus / Entrenamiento | En PC con teclado |

El bando con menos luchadores recibe más vida (×1,6 en un 2 contra 1).

## Personajes (21)

Goku, Vegeta, Gohan, Trunks, Piccolo, Krilin, Gotenks, **Gogeta**, **Vegito**, Androide 17, Androide 18, Freezer, Cooler, Cell, Majin Buu, Broly, Jiren, Hit, Goku Black, Zamasu fusionado, Bills.

- **Gogeta**: Base → SSJ → SSJ2 → SSJ3 → SSJ4 → SSJ Dios → Blue → Ultra Instinto (presagio) → Ultra Instinto dominado → Ultra Ego. Esquiva sola el 12 % de los golpes.
- **Vegito**: las mismas fases, más un **Blue + Kaio-ken** exclusivo. Lleva pendientes Potara y tiene ataques propios. Pega un 8 % más fuerte.

## Cambios de la versión 1.8

- **Broly** (el de Dragon Ball Super): en base tiene el poder del SSJ Dios, en Ira 330 MM, en SSJ el del Ultra Instinto presagio y en Legendario 820 MM. Al pasar a Legendario hay una cinemática: pierde el control, sus ojos se vuelven verdes y caen rayos de fondo. Pasiva: cuanto más dura la pelea, más fuerte se hace (hasta +40 %) y menos daño recibe (hasta -30 %).
- **Vegeta**: Blue Evolucionado 300 MM. En Ultra Ego, cuanto más daño recibe, más fuerte se hace.
- **Piccolo**: Piccolo Naranja 36 MM y nueva forma **Piccolo Naranja Gigante** (250 MM), que crece al transformarse.
- **Cell**: rediseñado (caparazón con manchas, cresta, alas y aguijón) y nueva forma **Cell Max** (300 MM, gigante).
- Androide 17 Guardabosques 34 MM · Buu absorbe a Gohan 2,0 MM · Gohan Bestia 310 MM.
- El aura del **Ultra Ego** es densa y morada, y se mueve de forma irregular.

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | El juego (HTML, CSS y JavaScript) |
| `vendor/three.min.js` | Three.js r128, licencia MIT |
| `vendor/peerjs.min.js` | PeerJS 1.5.4 (online), licencia MIT |
| `fonts/` | Fuente Press Start 2P, licencia OFL |
| `sw.js`, `manifest.json`, `icon-*.png` | App instalable y modo sin internet |
| `esquiva.html` | El minijuego anterior, Esquiva |

Dragon Ball © Bird Studio / Shueisha / Toei Animation.
