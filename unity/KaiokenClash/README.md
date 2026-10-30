# Kaioken Clash · Edición Unity

Versión de Kaioken Clash para Unity, con estilo realista de figura (cuerpos musculosos, gi holgado, pelo de puntas afiladas) y mundos con colores planos y contorno, como el manga. Todo se crea por código al arrancar: no hay escenas, prefabs ni modelos que importar.

## Abrirlo

1. Instala **Unity 2022.3 LTS** desde Unity Hub (con el módulo **iOS Build Support** si quieres compilar para iPhone).
2. En Unity Hub: **Add → Add project from disk** y elige esta carpeta (`unity/KaiokenClash`).
3. La primera vez que se abre, el proyecto se configura solo: crea `Assets/Scenes/Main.unity`, la añade a la compilación y deja el iPhone en horizontal. También está en el menú **Kaioken Clash → Configurar proyecto**.
4. Pulsa **Play**.

## Pasarlo al iPhone

1. **File → Build Settings → iOS → Switch Platform**.
2. **Build**: Unity genera un proyecto de Xcode.
3. Ábrelo en **Xcode** (en un Mac), elige tu equipo de firma (Signing & Capabilities) y pulsa **Run** con el iPhone conectado.

## Qué incluye

- **34 luchadores** con todas sus formas, colores, peinados y técnicas, exportados del juego web (`Assets/Resources/Data/kaioken.json`).
- **Combate 3D libre**: vuelo, combos de 5 golpes, golpe fuerte, ki, guardia, carga, teletransporte, transformaciones, Kaioken combinable (K), especiales (E, X) y definitivo (H+E). El daño usa la misma fórmula de poder que la web.
- **Técnicas con forma propia**: rayos (Kamehameha), esferas, ráfagas, lluvia de ki que converge, Hakai, Kienzan, Makankosappo con aros, espada de ki, Genkidama, Hellzone, mirada de Jiren, barrera y meteoros.
- **Versiones por arco**: el Goku de la Saga Saiyajin tiene 8000 de poder y solo el Kaioken; las versiones siguientes son más fuertes y tienen más formas. Se abren al completar los arcos.
- **Mundos estilo manga**: Yermo, Namek (suelo turquesa, árboles de copa azul y rocas de capas), Torneo del Poder, Kaiosama, Dimensión rota, Antártida, Kame House, Capital del Oeste, Montaña Paoz, Budokai, Planeta de Bills, Habitación del Tiempo y Órbita de la Tierra.
- **Modo historia** completo (10 arcos y los «¿Qué pasaría si…?») con cinemáticas de película: bandas negras, cortes con fundido, planos por encima del hombro, acercamientos, títulos grandes, telequinesis, explosiones, danza de la fusión y fusiones, despertar del Ultra Instinto y guerreros que salen del suelo.
- **Cámara en tercera persona** detrás del luchador, con objetivo fijo (L para soltarlo y girar la cámara).
- **Controles táctiles** para iPhone (joystick y botones) y teclado.
- **Música sintetizada** con la canción de cada arco y efectos de sonido, sin archivos de audio.

Todavía no se han pasado a Unity: online, tienda, outfits, Torneo del Poder por horas, entrenamiento con NPC y 2 jugadores.

## Controles de teclado

WASD moverse · Espacio/C subir y bajar · F golpe · G fuerte · H ki · E especial · X especial 2 · H+E definitivo · R guardia · T cargar · Q+W / Q+S transformarse · K Kaioken · Y teletransporte · L fijar o soltar objetivo · clic derecho o flechas para girar la cámara · Esc pausa.

## Actualizar los datos desde la web

Si cambias personajes, formas o el modo historia en la versión web, vuelve a exportar:

```
node tools/unity-export/export.js
```

## Estado

Los scripts se han compilado (`mcs`) contra una copia de las firmas de la API de Unity y se han ejecutado sin pantalla sobre una API simulada, sin errores: todas las peleas del modo historia, peleas en los 13 mundos y las 66 cinemáticas (`tools/unity-export/`). **No se ha abierto en Unity real**, así que pueden aparecer pequeños ajustes la primera vez, sobre todo en los shaders (`Assets/Resources/Shaders`) y la interfaz.
