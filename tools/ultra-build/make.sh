#!/bin/bash
# Genera Ultra en tools/ultra-build/out/ (kaioken-clash-ultra.html = Artifact, ultra.html = Pages) y el clásico (index.html = v1.8 + contenido de Ultra, estilo chibi)
D="$(cd "$(dirname "$0")" && pwd)"; mkdir -p "$D/out"
node "$D/gen-versions.js" >/dev/null && python3 "$D/build18.py" && python3 "$D/build18b.py" && python3 "$D/build18c.py" && python3 "$D/build18d.py" && python3 "$D/build18e.py" && python3 "$D/assemble.py" && node --check "$D/g18.js" && python3 "$D/classic.py" && node --check "$D/gc.js" && echo BUILD_OK
# Para publicar en el repo (ultra.html, sw.js, manifiestos, version.json): python3 "$D/publish.py"
