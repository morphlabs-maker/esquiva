# Kaioken Clash · Edición Unity

Versión de Kaioken Clash para Unity, con estilo realista de figura (cuerpos musculosos, gi holgado, pelo de puntas afiladas) y mundos con colores planos y contorno, como el manga. Todo se crea por código al arrancar: no hay escenas, prefabs ni modelos que importar.

## Descargarlo en tu computador

El juego no está en Unity hasta que bajas esta carpeta a tu computador y la abres con Unity:

1. Descarga el repositorio en ZIP: https://github.com/morphlabs-maker/esquiva/archive/refs/heads/claude/dragon-ball-offline-ios-rmhovv.zip
2. Descomprímelo. El proyecto Unity es la carpeta `unity/KaiokenClash`.

## Instalar Unity (Windows)

1. Instala **Unity Hub**: https://unity.com/download
2. En Unity Hub → **Installs → Install Editor → 2022.3 LTS**, con los módulos **Windows Build Support (IL2CPP)**, **Android Build Support** (con *OpenJDK* y *Android SDK & NDK*) y, si tienes Mac, **iOS Build Support**.
3. En Unity Hub → **Projects → Add → Add project from disk** → elige `unity/KaiokenClash`. Ábrelo y pulsa **Play**. La primera vez se configura solo.

## Crear las apps

- **Windows**: doble clic en `construir-windows.bat` (o en Unity: menú **Kaioken Clash → Compilar para Windows**). Sale `Builds/Windows/KaiokenClash.exe`.
- **Android**: doble clic en `construir-android.bat` (o menú **Kaioken Clash → Compilar para Android**). Sale `Builds/Android/KaiokenClash.apk`: cópialo al celular y ábrelo para instalarlo (activa «instalar apps de origen desconocido»).
- **iPhone**: Apple solo deja compilar en un **Mac con Xcode**. En el Mac: menú **Kaioken Clash → Compilar para iPhone**, abre `Builds/iOS/Unity-iPhone.xcodeproj` en Xcode, elige tu cuenta en *Signing & Capabilities* y pulsa **Run** con el iPhone conectado.

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
