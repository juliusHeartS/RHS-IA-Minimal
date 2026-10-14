# DB Canónica RHS-RAG (opsglobal)

Este directorio contiene la base de datos vectorial LanceDB canónica
(documentos institucionales OPS/PAHO pre-indexados).

## Estado: VACÍA

Por ahora este directorio está vacío. Cuando la DB canónica esté lista:
1. Copiar la LanceDB poblada a `lancedb/`
2. Reconstruir el vsix (`pnpm vsix`)

## Ubicación

El directorio es oculto (con punto) para que no aparezca en el explorador
de archivos del usuario final.

La DB es **read-only** en runtime: el usuario no puede modificarla.
Solo se actualiza con nuevas versiones de la extensión.
