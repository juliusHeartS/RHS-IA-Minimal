# Matriz de transferencia y procedencia — Napo

**Fecha de corte:** 2026-10-13  
**Destino único de implementación:** `/Users/julius3005/Documents/Github/RHS-IA-Minimal`  
**Regla:** las fuentes se leen y se copian selectivamente; no se escriben, cambian de rama ni se usan como destino de build.

## Fuentes y baseline observado

| Fuente | Referencia leída | Estado del repositorio observado | Uso en Napo |
|---|---|---|---|
| RHS-IA | `453239ef149e66bb4a1a849b2e7c3c31bc28b30b` | limpio en la auditoría de estado | Base de distribución y personalizaciones del host |
| Positron | `6a251c21f470eac78164e2793ca0c636ebbf5193` | cambios/untracked preexistentes: `.rhs-core-manifest.json`, `Instrucciones/` | Fuente de extensiones y runtimes de datos |
| rhs-agent3 | `1905844edd6ef2648fe9dd1ff9f7679276123188` | modificaciones y `RenderQuartoTool.ts` preexistentes | Referencia de contratos y pruebas; no integrado como agente principal |
| rhs-agent4 / Capibara | sin `HEAD` Git resoluble en el árbol observado | árbol fuente preexistente con archivos no versionados | Fuente del artefacto completo `rhs-agent4` v4.0.0 |
| vscode | `41c470f705e3a73501ef443daa0ac0060baff356` | limpio en la auditoría de estado | Referencia del host Code-OSS; no se modifica |

Los estados anteriores son una fotografía de procedencia, no una autorización para normalizar, limpiar o corregir las fuentes.

## Componentes transferidos o conservados

| Componente | Fuente y ruta | Destino Napo | Decisión | Evidencia actual |
|---|---|---|---|---|
| Host Electron/Code-OSS/Positron | RHS-IA, Positron y VS Code | `src/`, `build/`, `product.json`, `extensions/` | Conservar y adaptar solo el receptor | Napo empaquetado y validado |
| Identidad Napo | diseño del destino | `product.json`, `src/vs/base/common/product.ts` | Aplicar en destino | `applicationName=napo`, `nameShort=Napo`, bundle `org.rhsia.napo` |
| Capibara completa | rhs-agent4, artefacto `dist` y recursos | `extensions/rhs-agent4/` | Transferir completa, sin recortar ni reescribir | v4.0.0; `main=./dist/extension.js`; hash del runtime integrado `84ec6ba7fc5718e81fbed4674d151d8ea506163cdfb52f7824bf2fae76b12869` |
| R | Positron/RHS-IA | `extensions/positron-r/` y Ark | Conservar sin alterar la extensión; corregir solo contratos del receptor Napo | R 4.5.3 inicia; Ark y smoke pasan |
| Python | Positron/RHS-IA | `extensions/positron-python/` y PET | Conservar sin alterar la extensión; transferir recursos requeridos al destino | Python 3.13.3 inicia; `positron._vendor` transferido; UI devuelve `NAPO_PYTHON_UI_OK` |
| Notebooks y celdas | Positron/RHS-IA | extensiones `positron-notebooks*`, `positron-code-cells`, `ipynb` | Conservar completas | Inventario y empaquetado del destino |
| Datos y conexiones | Positron/RHS-IA | conexiones, DuckDB, exploradores y drivers seleccionados | Conservar sin alterar; validar cada runtime y licencia | Validador de extensiones y paquete |
| Quarto | Positron/RHS-IA y runtime empaquetado | `quarto/` y extensión de arranque | Siempre incluido | Quarto 1.10.18; ejecución y preview UI pasan |
| PET, Ark, Kallichore | Positron/RHS-IA | recursos de `positron-python`, `positron-r`, `positron-supervisor` | Transferir runtimes necesarios al receptor | Integridad, permisos y ejecución validados |
| Telemetría y galería | configuración heredada | `product.json` y servicios del host | Prohibir/desactivar | Validador confirma telemetría y Marketplace sin endpoints |
| Actualizaciones | política Napo | `POLITICA_NAPO.md` y configuración del producto | Manuales, explícitas, verificables y reversibles | Política documentada; implementación operativa por canal aún requiere cierre |

## Reglas de adaptación

- Las modificaciones locales de host, empaquetado, rutas, `.gitignore` y tolerancia a workspace vacío pertenecen únicamente al destino Napo.
- La transferencia de `positron._vendor` fue necesaria para que la extensión Python iniciara; no cambia la lógica de la extensión ni modifica Positron.
- Capibara y las extensiones de datos no se reducen para resolver problemas del receptor.
- No se copian credenciales, cachés, `node_modules` de desarrollo ni artefactos temporales como parte del producto.
- Todo binario o aviso debe aparecer en el inventario de licencias y en la comprobación del paquete.

## Puertas antes de una nueva transferencia o eliminación

1. Identificar el archivo o runtime exacto en la fuente y conservar su referencia.
2. Confirmar que el destino es `RHS-IA-Minimal` y que la fuente permanece sin escrituras.
3. Comparar manifiesto, licencia, aviso, hash y dependencias.
4. Ejecutar pruebas del componente y del receptor desde perfil limpio.
5. Regenerar paquete, validador, smoke, inventario legal y auditoría de estados de fuentes.
6. Registrar en `BITACORA.md` el motivo, el resultado y cualquier desconocido.

Esta matriz no autoriza todavía la eliminación física de extensiones. Solo documenta transferencias realizadas y decisiones de conservación verificables.
