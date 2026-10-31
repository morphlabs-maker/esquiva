# Kaioken Clash

Juego de peleas 3D de Dragon Ball (proyecto de fans, sin fines comerciales), con estilo retro pixelado. Funciona **sin internet** y se instala en el iPhone como una app.

## Instalar en el iPhone (los dos juegos)

1. GitHub Pages debe publicar esta rama: **Settings → Pages → Branch** = `claude/dragon-ball-offline-ios-rmhovv`, carpeta `/ (root)`.
2. En el iPhone, abre en **Safari**:
   - Kaioken Clash: `https://morphlabs-maker.github.io/esquiva/`
   - Kaioken Clash Ultra: `https://morphlabs-maker.github.io/esquiva/ultra.html`
3. En cada uno toca **Compartir → Añadir a pantalla de inicio**. Quedan dos iconos, uno por juego.
4. Se juega en horizontal y funciona sin internet.

**Se actualizan solos:** con internet, cada vez que abres el juego (o vuelves a él) carga la última versión publicada en GitHub. Si hay una nueva y estás en plena pelea, espera a que vuelvas al menú para recargarse. Sin internet se usa la última copia guardada.

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

## Kaioken Clash Ultra (`ultra.html`)

Versión aparte, sin estilo retro, sobre la 1.8: modelos con proporciones de figura de anime, golpes fluidos, gritos y sonidos de batalla, esquivas reales y cansancio (los androides no se cansan).
Se abre en `https://morphlabs-maker.github.io/esquiva/ultra.html`, se instala como app propia y funciona sin internet igual que el juego principal.

- 25 luchadores: los 21 de la 1.8 más Moro (6 fases del manga), Gamma 1, Gamma 2 y Kefla.
- Goku: Ultra Instinto dominado permanente y forma final **Gigante de Luz** (1,15 B, tamaño de Cell Max).
- Tienda de técnicas de Dragon Ball Super que sustituyen al especial o al definitivo.
- Entrenamiento en el planeta de Bills con Whis (también en el celular).
- Mundos nuevos: Planeta de Kaiosama y Dimensión rota.
- Retratos anime por personaje, auras proporcionales al tamaño del luchador, rayos de energía sin resplandor y cámara más cercana (más aún en el celular).
- Voces solo en el grito de transformación.

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | El juego (HTML, CSS y JavaScript) |
| `vendor/three.min.js` | Three.js r128, licencia MIT |
| `vendor/peerjs.min.js` | PeerJS 1.5.4 (online), licencia MIT |
| `fonts/` | Fuente Press Start 2P, licencia OFL |
| `sw.js`, `manifest.json`, `icon-*.png` | App instalable, modo sin internet y actualización automática |
| `manifest-ultra.json`, `icon-ultra-*.png`, `portraits/` | App de Ultra y retratos |
| `version.json` | Versión publicada (la usan los juegos para saber si hay actualización) |
| `ultra.html` | Kaioken Clash Ultra, la versión realista |
| `esquiva.html` | El minijuego anterior, Esquiva |

Dragon Ball © Bird Studio / Shueisha / Toei Animation.
