# Ledger de evidencia REA — Napo

**Estado:** evidencia estática acotada del artefacto empaquetado y de Capibara; no sustituye las pruebas de ejecución.
**Fecha de la captura:** 2026-10-13
**Artefacto observado:** `/Users/julius3005/Documents/Github/VSCode-darwin-arm64/Napo.app/Contents/Resources/app`
**Regla:** la evidencia describe el artefacto distribuido y no autoriza modificar ningún repositorio fuente.

## Alcance y procedimiento

La primera pasada sobre todo el árbol `app` agotó el límite de cinco minutos y no produjo evidencia utilizable. No se interpreta como fallo del producto ni como hallazgo REA.

La pasada válida se acotó a una copia temporal de los dos artefactos JavaScript ejecutables del host:

- `out/main.js`;
- `out/vs/code/electron-browser/workbench/workbench.js`.

La copia temporal fue únicamente un insumo de análisis. El artefacto original y los repositorios fuente no se modificaron.

Como segunda línea de análisis se procesó la extensión integrada completa de Capibara en
`extensions/rhs-agent4`. Esta pasada no altera la extensión: la lee como artefacto y conserva su hash para
compararlo con el runtime empaquetado.

Comando lógico utilizado: `analyze_javascript_application`, formato `directory`, detalle `summary`, límite de análisis de 120 segundos por fuente y 2048 MiB para el trabajador aislado. El bundle canónico se exportó a:

`reports/rea-napo-host-evidence.json`

## Identidad de la evidencia

| Registro | Identificador |
|---|---|
| Evidencia de análisis completa retenida | `ev_0917f0a08fc47cb2364e77adb9fa177bbc2609ea8df75c9e5cc9ddb7e38a3989` |
| Vista resumen citada | `ev_1115de9c155ec0606b0d053d9d2939a77eca8c2f9aab2f1bede76e94b3310356` |
| Vista de módulos | `ev_f6d1dc704273e0f8ed7c29b4c732294c83eef9f593c90405c63856888f7675e1` |
| SHA-256 de la copia analizada | `5bfa0324e316a1fa646be09e1451d8e0780d31513c7c72af1b251d092b200c0b` |
| Análisis de Capibara | `ev_ec0c5d7debdd58ae63e83340735dce5093d705e3b8a4745ceeb51aba8cbbb950` |
| SHA-256 de Capibara analizada | `2e50ba25dd95390abc9f182960561d348a22e5017bdd9cfe794f599f076b519b` |
| Bundle exportado | 172,344,306 bytes; 9 registros; 0 desconocidos registrados por el exportador |

## Observaciones directamente respaldadas

- REA procesó 2 archivos, leyó 2,880,475 bytes de texto, parseó 2 archivos JavaScript, visitó 340,206 nodos AST y no registró fallos de parseo.
- El análisis produjo 598 hallazgos y 375 módulos estáticos dentro de esa copia.
- El inventario estático observó 3 ventanas Electron, 3 operaciones IPC dinámicas y 3 handlers principales; también observó 10 comprobaciones relacionadas con el emisor.
- El análisis no observó APIs `contextBridge` expuestas, bindings nativos resueltos ni entrypoints de procesos utilitarios resueltos en el subconjunto examinado.
- Los módulos se identificaron mediante contenido y la página de módulos devolvió 425 entradas; la primera página contiene 32 entradas, principalmente roles de módulo dentro de `main.js`.
- La pasada de Capibara procesó 2,052 archivos relevantes, leyó 83,193,101 bytes, parseó 1,548 archivos JavaScript, visitó 6,437,702 nodos AST y no registró fallos de parseo.
- En Capibara se observaron 877 módulos y 7,325 hallazgos estáticos. La extracción registró 36 relaciones de frontera, 108 de flujo de llamadas, 3,555 de flujo de datos y 625 de flujo de objetos, con relaciones desconocidas explícitas donde la semántica era dinámica o excedía el presupuesto de resultados.
- La extensión Capibara no expuso ventanas Electron, `contextBridge`, IPC renderer/main ni bindings nativos en el artefacto analizado; esto respalda tratarla como extensión del receptor, no como segundo host de escritorio.

Estas observaciones son propiedades del análisis estático de la copia seleccionada. No prueban por sí solas que una ventana, canal IPC, handler o proceso se ejecute en cada arranque.

## Inferencias acotadas para Napo

1. El host empaquetado contiene una superficie Electron/JavaScript suficiente para explicar la inicialización principal y el workbench, por lo que la integración de Capibara debe resolverse en el receptor y no mediante una reimplementación del agente.
2. Las relaciones estáticas de procesos, configuración, red, eventos y recursos pueden guiar una revisión del host, pero no autorizan afirmar que exista tráfico oculto, telemetría o enforcement completo sin corroboración dinámica.
3. La evidencia es compatible con conservar el host base y reducir la superficie mediante inventario, perfiles y pruebas; no demuestra que una extensión concreta pueda eliminarse sin consultar sus dependencias y pruebas de Napo.
4. El análisis de Capibara respalda la decisión de transferirla completa: su superficie es grande y contiene recursos, runtime, webview y contratos propios; recortarla por tamaño destruiría precisamente la funcionalidad que Napo debe recibir. La frontera correcta de trabajo está en el host, el empaquetado y la política de ejecución.

## Cobertura, límites y desconocidos

- La cobertura de aplicación es parcial y la cobertura semántica está truncada por el límite de recursos del analizador; `main.js` y `workbench.js` agotaron el heap de su fase semántica.
- La extracción de IPC no emparejó transmisiones renderer/main cuando los canales eran dinámicos; por tanto, no se debe presentar el inventario como mapa completo de comunicación.
- REA analizó texto JavaScript de forma inerte; no ejecutó el bootstrap ni verificó reachability, valores dinámicos, defaults efectivos o enforcement de políticas.
- Las relaciones estáticas de red, filesystem, procesos, timers, configuración y eventos son candidatas conservadoras. Las expresiones dinámicas y las rutas no resueltas permanecen desconocidas.
- La ausencia de un hallazgo no demuestra ausencia en el artefacto completo, porque el análisis se limitó a dos archivos ejecutables y no a las extensiones, `node_modules.asar` ni recursos completos.
- La pasada de Capibara también quedó semánticamente parcial por presupuesto de resultado: conserva estadísticas e inventario completos dentro de la vista disponible, pero no debe leerse como prueba de ausencia de relaciones dinámicas o comportamiento no resuelto en sus dependencias empaquetadas.

## Corroboración con runtime

La evidencia REA se contrastó con pruebas separadas del paquete macOS:

- Napo inició Python 3.13.3 desde la interfaz y ejecutó `NAPO_PYTHON_UI_OK`.
- Quarto 1.10.18 ejecutó una celda Python y abrió la previsualización con `NAPO_QUARTO_UI_OK`.
- El validador del paquete y el smoke de R, Python/Jupyter y Quarto pasaron.
- Capibara mostró aprobación, rechazo, procedencia y persistencia en workspace temporal.

Estas son observaciones de runtime independientes; no se atribuyen a la extracción estática de REA.

## Decisión de uso

Este ledger satisface la salida documental de la investigación REA para el host y Capibara seleccionados, con cobertura explícita y límites. No cierra la auditoría legal, no demuestra equivalencia completa con VS Code/Positron y no justifica todavía retirar físicamente extensiones. La reducción solo podrá avanzar después de probar dependencias, reconstrucción, runtime, licencias y reversibilidad.

## Reinstalación de Capibara y evidencia de aprobaciones — 2026-10-14

Se contrastó el paquete final de Napo con la corrección disponible en el repositorio fuente de `rhs-agent4`, commit `bf646a2`. La corrección observada en la salida construida actualiza la política de aprobaciones en runtime mediante `updateSettings`, mantiene los límites y expone `approvalStatus`.

| Observación | Resultado |
|---|---|
| Artefacto | `dist/Napo.app/Contents/Resources/app/extensions/rhs-agent4` |
| Evidencia REA | `ev_2133907db96c076a2413a306ee0a5e3976ce6b42d525a971dcd2aa220b30bd08` |
| Autoridad | `shipped-artifact` |
| Archivos relevantes / JavaScript parseado | 2.054 / 1.548 |
| Fallos de parseo | 0 |
| SHA-256 de `dist/extension.js` | `b5840a1eeb6ef9c0b7f09a150e96c200b52c10707f4a9422795e9aacde3ed4dc` |
| RAG canónico integrado | 914 archivos, 51 MB |

La prueba funcional sobre el `Napo.app` empaquetado se ejecutó en un perfil y workspace temporales con la política `workspace · sensitive`, autoaprobación de lectura, escritura y ejecución, y límite de 500 solicitudes. Resultado: 6 ejecuciones, 0 aprobaciones bloqueantes, 0 eventos de aprobación, 0 pendientes de runtime, respuesta recibida y límites conservados. También pasaron las comprobaciones negativas de ejecución deshabilitada, política always, límite no reiniciado, ruta protegida, cancelación e integridad de las fuentes.

`codesign --verify --deep --strict dist/Napo.app` pasó antes y después de la prueba. La consulta REA del paquete Electron completo excedió 300 segundos por volumen; no se presenta como análisis completo. La evidencia REA específica de Capibara sí quedó retenida y su semántica se reporta como parcial por presupuesto, complementada por la prueba controlada de runtime.
