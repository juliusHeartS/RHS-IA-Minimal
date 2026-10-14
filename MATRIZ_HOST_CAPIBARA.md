# Matriz inicial del host Napo para Capibara y datos

**Estado:** primera matriz técnica, basada en lectura de manifiestos  
**Fecha:** 2026-10-12  
**Regla:** las fuentes observadas son solo lectura; esta matriz no autoriza modificarlas.

## 1. Hechos observados

### Capibara (`rhs-agent4`)

- Paquete: `rhs-agent4`, versión `4.0.0`.
- Entrada de extensión: `src/dist/extension.js`.
- Requiere Node `20.20.2` y una API de VS Code `^1.95.0`.
- Tiene configuración propia para permisos, aprobaciones, proveedores LLM, tiempos de espera, RAG, PDFSTRUCT, OKF, skills, compresión de contexto y autoaprobaciones.
- Sus dependencias de runtime incluyen SDKs de proveedores, Ollama, OpenAI, Anthropic, Google, Qdrant, ejecución de procesos, Git, análisis de árboles, `zod`, `undici` y utilidades de sesiones.
- Declara una vista lateral, comandos, menús, configuración y acciones de terminal/código.
- La integración prevista es completa; no se seleccionarán partes aisladas para sustituir la extensión.

### RHS-IA y Positron

Los manifiestos de extensiones muestran, entre otras, estas piezas directamente relacionadas con el flujo de datos:

| Extensión o grupo | Función que el host debe soportar | Decisión |
|---|---|---|
| `positron-python` | Runtime, entornos, ejecución y herramientas de Python | Integrar completa y sin alteración |
| `positron-r` | Runtime, ejecución, notebooks, datos R y depuración asociada | Integrar completa y sin alteración |
| `positron-connections` | Vista y gestión de conexiones de datos | Integrar completa y sin alteración |
| `positron-data-driver-*` | Drivers de DuckDB, SQLite, PostgreSQL, Redshift, Snowflake, ODBC y otros disponibles | Integrar las que provea RHS-IA/Positron, sin alterar sus contratos |
| `positron-data-explorer-*` | Protocolo, backend y formato del explorador de datos | Integrar completa y sin alteración |
| `positron-duckdb` | Backend de exploración y ejecución DuckDB | Integrar completa y sin alteración |
| `positron-environment*` | Entornos, módulos y configuración de runtimes | Integrar completa y sin alteración |
| `positron-notebooks*` | Apoyo a notebooks, celdas y exportación | Integrar completa y sin alteración |
| `positron-code-cells` | Comandos, menús y acciones de celdas | Integrar completa y sin alteración |
| `positron-viewer` | Visualización y apertura controlada de resultados | Integrar completa y sin alteración |
| `positron-supervisor` | Supervisión de procesos y runtimes | Integrar completa y sin alteración |
| `positron-reticulate`, `positron-run-app`, `positron-zed` | Integraciones de datos y ejecución relacionadas | Integrar completa y sin alteración si forman parte del paquete RHS-IA seleccionado |

Esta lista es el punto de partida del inventario; no sustituye la revisión de dependencias y del manifiesto final de RHS-IA.

## 2. Contratos que Napo debe exponer

| Contrato | Evidencia a localizar | Prueba mínima |
|---|---|---|
| Activación | `activationEvents`, `main`, API de extensión | Capibara activa al abrir Napo y registra sus vistas |
| Contribuciones | `commands`, `views`, `menus`, `configuration` | Todos los comandos y vistas aparecen sin errores |
| Runtime | procesos, Node, rutas de binarios y variables | Capibara inicia y recupera su runtime |
| Workspace | `workspace.fs`, raíz, documentos y configuración | Capibara trabaja aislada por proyecto |
| R/Python | APIs y extensiones de Positron | Una tarea ejecuta R y Python y devuelve resultados |
| Quarto | comandos, renderizador y preview | Se renderiza un documento con bloques R/Python |
| Proveedores | configuración propia de Capibara, almacenamiento seguro y runtime de proveedores | Los proveedores visibles aparecen completos; solo se conectan tras configuración y acción explícita |
| Permisos | configuración de perfiles y aprobaciones | Escritura, ejecución e instalación solicitan aprobación |
| Persistencia | `globalState`, `workspaceState`, secretos e historial | Sesión e historial sobreviven al reinicio |
| Red | clientes y endpoints configurados por el usuario | No hay tráfico oculto ni telemetría |
| Empaquetado | VSIX, binarios, recursos y dependencias | La extensión completa funciona desde el artefacto final |

## 3. Decisión cerrada de superficie

Los proveedores que Capibara expone forman parte de la integración completa y no se vuelven a clasificar como “opcionales” por razones de minimalismo. Napo conserva el receptor necesario para mostrarlos, configurarlos de forma segura y registrar su uso, pero no inicia conexiones por cuenta propia.

Quedan fuera del próximo paquete de la superficie inicial las extensiones `microsoft-authentication`, `positron.next-edit-suggestions`, `positron-dev-containers` y `positron-skills`. La prueba reversible `reports/napo-reduction-auth-ai-remote-skills.json` retiró esas cuatro carpetas de un clon del paquete y pasó el validador estructural y el smoke de R/Python/Quarto. `positron-run-app` permanece porque forma parte de la ejecución local de aplicaciones analíticas.

## 4. Riesgos de compatibilidad

1. La API declarada por Capibara es `^1.95.0`, pero el host base RHS-IA/Positron tiene versiones propias y cambios locales.
2. Capibara puede requerir recursos binarios (`rhs-rag`, `pdfstruct`, `obscura`, `rhs-okf`) y rutas que deben resolverse en el paquete de Napo.
3. Las extensiones de datos dependen de servicios internos de Positron, no solo de la API pública de extensiones.
4. Las configuraciones de proveedores contienen credenciales y no deben copiarse desde ninguna fuente.
5. Los repositorios `positron`, `rhs-agent3` y `rhs-agent4` tienen cambios locales preexistentes; no se puede tomar su estado de trabajo como baseline sin separar esos cambios.
6. La ausencia de telemetría debe comprobarse en el host, extensiones, scripts de build y artefacto empaquetado.

## 5. Pruebas del primer incremento

### Arranque y host

- Napo abre una ventana y crea un workspace.
- Las extensiones de datos se descubren y activan sin errores.
- Capibara aparece como función integrada, con su vista y comandos.
- No se habilitan marketplace, sincronización ni telemetría.

### Datos

- Se detecta un intérprete de R.
- Se detecta un intérprete de Python.
- Se ejecuta una celda o bloque de cada lenguaje.
- Se muestra una tabla o resultado en el viewer correspondiente.
- Se renderiza un documento Quarto.

### Capibara

- Se inicia una sesión.
- Se selecciona un proveedor visible y configurado por el usuario.
- Se consulta el contexto del proyecto.
- Se solicita aprobación antes de escribir o ejecutar una acción sensible.
- Se cancela una tarea en curso.
- Se conserva historial y procedencia.

### Distribución

- El artefacto contiene Capibara completa.
- Las extensiones de datos coinciden con sus manifiestos y hashes de referencia.
- No contiene credenciales.
- No realiza telemetría.
- Puede verificarse y recuperar una versión anterior.

## 6. Próximo paso técnico

Completar las pruebas funcionales de extremo a extremo con un perfil limpio: R, Python, Quarto, proveedores visibles, permisos, cancelación, historial y procedencia. La validación dinámica inicial del host ya fue realizada; lo pendiente es demostrar el flujo de trabajo completo y cerrar la auditoría legal y de distribución.

## 6. Estado de implementación 2026-10-12

- La transferencia de Capibara ya está realizada en `extensions/rhs-agent4`.
- `npm run compile-extensions-build` ya pasa en Napo.
- El artefacto local contiene Capibara completa en `.build/extensions/rhs-agent4`; el hash de `dist/extension.js` coincide con la extensión transferida.
- Quarto está incluido como VSIX de arranque en `.build/bootstrapExtensions/quarto.quarto-1.136.0.vsix`.
- El host usa una ruta de empaquetado integrada para Capibara porque el runtime viene preempaquetado; no se alteró el código de la extensión.

## 7. Estado dinámico validado 2026-10-12

- La ventana Electron de Napo carga y el host de extensiones inicia desde el checkout de destino.
- El bundle macOS regenerado identifica la distribución como `org.rhsia.napo` y muestra `Napo`; no comparte la identidad de instancia de Positron o RHS-IA.
- Capibara es aceptada desde la ruta integrada de desarrollo y conserva su código, manifiesto y runtime preempaquetado sin alteraciones.
- Quarto es compatible con el host porque Napo conserva la versión de compatibilidad Positron `2026.09.1`; no se modificó su manifiesto.
- El escaneo de desarrollo excluye únicamente tres paquetes internos de Data Explorer que son insumos de compilación, sin alterar sus fuentes ni contratos.
- No aparecen errores de `fontFamily`, terminal, restauración de partes, compatibilidad de Quarto, compatibilidad de Capibara, comprobación de galería ni actualización automática en el arranque validado.
- `npm run test:positron`, `npm run typecheck-client`, `npm run build-fast`, `npm run compile-extensions-build` y `npm run validate-bundled-extensions` pasan según la bitácora.
- Siguen pendientes las pruebas funcionales explícitas de R/Python/Quarto y Capibara, además de la auditoría de licencias, avisos, URLs heredadas y proveedores.

## 8. Vista integrada validada 2026-10-12

- En un perfil limpio, Napo expone la Activity Bar para que Capibara tenga una superficie accesible desde el primer arranque.
- La contribución de Capibara aparece como `RHS-Agent`; su vista web se abre y sus acciones visibles incluyen `New task` y `Settings`.
- La activación sigue siendo diferida por `onView:capibara.SidebarProvider`, pero el receptor ya deja disponible el contenedor y la vista para que esa activación ocurra mediante interacción real.
- Una preferencia explícita `workbench.activityBar.location: hidden` sigue ocultando la barra; la integración no impone la interfaz contra la decisión del usuario.

## 9. Runtime y Quarto: evidencia inicial — antecedente histórico 2026-10-12

| Área | Evidencia | Estado |
|---|---|---|
| R del sistema | `R --version` devuelve 4.5.3 | Disponible en el host |
| Python del sistema | `python3 --version` devuelve 3.13.3 | Disponible en el host |
| Quarto CLI | `.build/quarto/bin/quarto --version` devuelve 1.10.18; archivo descargado y validado por SHA-256 | Preparado localmente |
| Selector de sesiones | Workspace temporal con `.R`, `.py` y `.qmd`; el selector devuelve cero resultados | No validado |
| Host de extensiones | El escáner encuentra R/Python, pero el registro operativo no termina de abrirse en el lanzador directo; las activaciones quedan pendientes | Brecha obligatoria |
| Preflight | `npm run validate-napo-runtime` comprueba estructura, privacidad, integridad, Quarto, R y Python | Pasa |

La ausencia de runtimes en el selector no se atribuye a Capibara ni a la eliminación de extensiones: el log muestra las extensiones registradas por el servicio de runtimes y después el cierre cancela la activación. Esta brecha quedó resuelta en las corridas posteriores del paquete final y se conserva aquí como antecedente histórico.

## 10. Corte histórico del receptor — 2026-10-13 (superado por la aceptación posterior)

La matriz inicial quedó validada contra el artefacto actual `/Users/julius3005/Documents/Github/VSCode-darwin-arm64/Napo.app`:

- Capibara `rhs-agent4@4.0.0` está integrada completa, con runtime, vista, comandos, configuración, proveedores, perfiles, aprobaciones, runners, cancelación, historial y procedencia comprobados en la evidencia UI de Napo.
- Las extensiones de análisis de datos de RHS-IA/Positron se conservan sin cambios funcionales en sus fuentes; la compatibilidad de coexistencia se resolvió en el host mediante `src/vs/workbench/api/node/extensionHostProcess.ts`.
- R `4.5.3`, Python `3.13.3`, Quarto `1.10.18`, notebooks y funciones de datos pasan las comprobaciones de paquete, runtime y smoke. La interfaz produjo `NAPO_PYTHON_UI_OK`, `NAPO_QUARTO_UI_OK` y `NAPO_REDUCED_R_QUARTO_OK`.
- Los límites de privacidad y gobernanza pasan: telemetría desactivada, Marketplace y actualización automática sin endpoints, credenciales fuera del paquete, aprobación sensible y búsqueda web desactivada por defecto.
- Capibara, Quarto, runtimes y los componentes nativos PET, Ark, Kallichore, node-pty y policy-watcher están presentes, tienen integridad comprobada y cuentan con permisos ejecutables cuando corresponde.
- El paquete reducido contiene 90 extensiones: 46 conservadas y 44 sujetas a prueba específica; las 36 carpetas excluidas del artefacto permanecen en el destino para reversión.

Las puertas que permanecen abiertas son externas o de distribución: revisión legal humana de 30 entradas del inventario del paquete, firma/notarización y canal público de publicación/actualización. No queda una decisión abierta sobre Capibara, Quarto, funciones de datos, proveedores visibles o telemetría.

## 10a. Corte histórico del paquete macOS (superado por la aceptación posterior)

| Elemento | Evidencia | Estado |
|---|---|---|
| Identidad del paquete | `Napo.app`, `org.rhsia.napo` | Validado |
| Capibara integrada | `Contents/Resources/app/extensions/rhs-agent4`, completa y con SHA-256 conservado | Validado |
| Quarto incluido | `Contents/Resources/app/quarto/bin/quarto`, versión 1.10.18 | Validado |
| Privacidad y actualizaciones | Telemetría desactivada; URLs de actualización y descarga vacías | Validado |
| Interfaz de RHS-Agent | Activity Bar y vista `RHS-Agent` visibles en perfil limpio | Validado |
| Ejecución analítica | El selector R/Python devuelve cero resultados por inicialización incompleta del host | Pendiente |

El artefacto final demuestra que la integración y el empaquetado están encaminados. La aceptación de Napo como plataforma funcional requiere resolver el ciclo de vida del host, ejecutar una sesión R y una sesión Python, renderizar un documento Quarto y repetir las pruebas con perfil limpio y preferencia explícita del usuario.

## 11. Evidencia inicial del receptor (histórica)

| Área | Evidencia | Estado |
|---|---|---|
| Activación de salud | El host activa la extensión por ID antes de ejecutar el comando registrado programáticamente | Validado por suite y paquete |
| R | R 4.5.3 encontrado, `usable: true`, `supported: true`; Ark presente y ejecutable | Diagnóstico validado |
| Python | PET presente, descubrimiento funcional; `/opt/homebrew/bin/python3` sin `ipykernel` | Requiere acción explícita del usuario |
| Capibara | Extensión `rhs-agent4@4.0.0` completa, visible como RHS-Agent | Validado |
| Git nativo | `vscode_fs.node` arm64 presente dentro del paquete | Error de módulo corregido |
| Quarto | CLI 1.10.18 incluido y operativo | Validado estructuralmente |
| Telemetría | `enableTelemetry=false` y rutas de telemetría desactivadas | Validado |
| Documentación LLM | `positronLlmsDocsUrl` vacío; sin fetch automático en arranque; endpoint solo por configuración explícita | Validado en logs |
| E2E analítico | Sesión R, sesión Python con kernel y render Quarto pendientes | Abierto |

La presencia de `No bundle location found` en logs de varias extensiones Positron se mantiene como deuda de empaquetado, no como justificación para modificar las extensiones fuente. La siguiente corrección debe hacerse en el receptor o en el proceso de empaquetado y volver a validarse con perfil limpio.

## 12. Decisiones consolidadas sobre servicios y actualización

- Capibara conserva completos los proveedores que ya expone; no se reduce el selector para hacer “minimalista” a Napo.
- Un proveedor remoto, Ollama, LM Studio, Qdrant, un endpoint compatible o la búsqueda web son capacidades opcionales de Capibara, no servicios propios de Napo.
- La búsqueda web inicia apagada. Ollama y LM Studio pueden consultarse cuando la configuración de Capibara los usa; esas consultas locales no son telemetría.
- Napo no debe ejecutar conexiones remotas, sincronización, marketplace, actualización o diagnóstico fuera de una acción explícita de la persona usuaria.
- La actualización de Napo será manual, hash-verificable y reversible; la distribución conserva la versión anterior hasta validar el arranque y los runtimes.
- La definición normativa se encuentra en `POLITICA_NAPO.md`.

## 13. E2E de Capibara con workspace 2026-10-12

- Se abrió Napo con un workspace temporal aislado y se verificó que Capibara necesita una carpeta de proyecto para crear una sesión real. La prueba sin workspace no debe contarse como fallo de Capibara.
- Con Ollama local configurado y el modelo `gemma4:31b-mlx`, la tarea apareció en la interfaz como `Pensando…` y el host expuso `Cancelar`.
- La cancelación terminó la tarea sin dejar el proceso analítico ejecutándose; tras recargar la ventana, el historial mostró la tarea cancelada y Capibara volvió a presentar el chat normal.
- La vista de historial, los proveedores, el estado `Workspace · Sensibles`, las aprobaciones y los runners fueron observados en la interfaz real.
- No se ejecutó una herramienta de escritura, ejecución o búsqueda web en esta prueba; esas puertas requieren un E2E separado con aprobación visible.

## 14. Estado consolidado de aceptación 2026-10-12

| Área | Evidencia vigente | Estado |
|---|---|---|
| Runtime analítico reproducible | Smoke contra `Napo.app`: Quarto 1.10.18, R, Python con `ipykernel`, render Quarto/R y render Quarto/Python-Jupyter | Validado por CLI |
| Runtime analítico en UI | R 4.5.3 iniciado; terminal `zsh` operativo; Python depende de `ipykernel` en el intérprete elegido | R/terminal validados; Python requiere acción explícita |
| Capibara integrada | Proveedores completos, Ollama local, perfiles, aprobación, runners, cancelación e historial observados en workspace | Validado con brecha de recuperación suave |
| Privacidad | Telemetría desactivada, documentación LLM sin descarga automática, sin actualización silenciosa | Validado |
| Galería de extensiones | `extensionsGallery.serviceUrl`, `resourceUrlTemplate` y `extensionUrlTemplate` vacíos en producto y paquete | Validado |
| Avisos y licencias | Licencias y notices presentes en integración y `.app`; validador bloquea ausencias | Validado estructuralmente; revisión legal pública pendiente |
| Repositorios fuente | RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode no reciben escrituras del trabajo | Validado por auditoría de estado |

La puerta funcional principal ya no es el arranque del receptor: es endurecer la recuperación de Capibara después de cancelar, probar aprobaciones con una herramienta controlada y completar el inventario legal/URLs antes de publicar.

## 15. Revalidación posterior al rollback — 2026-10-12

| Área | Evidencia vigente | Estado |
|---|---|---|
| Carga inicial de Capibara | La vista `RHS-Agent` vuelve a abrirse y muestra Capibara 4.0.0, historial, configuración y nueva tarea | Validado |
| Cancelación del runtime | Ollama local acepta la interrupción y el runtime registra la tarea como interrumpida | Validado |
| Recuperación de la webview | Después de cancelar, la vista puede quedar en blanco hasta reabrirla o recargar la ventana | Brecha de robustez |
| Aprobación de herramienta | La inferencia local no alcanzó la planificación de una herramienta antes de cancelar | No validado; no declarar aprobado |
| Integridad de la extensión | El intento de recuperación automática fue revertido; el bundle conserva Capibara original | Validado |

La recuperación automática queda como trabajo pendiente del receptor. No se modifica la extensión fuente para resolverla.

## 16. Endurecimiento del host — 2026-10-12

| Área | Evidencia vigente | Estado |
|---|---|---|
| Recuperación ante error fatal de webview | `WebviewViewPane` escucha `onFatalError` únicamente para `capibara.SidebarProvider` y permite un solo `reload()` diferido | Implementado en el host |
| Preservación de Capibara | No se modificó `rhs-agent4`; la extensión integrada conserva su bundle y hash | Validado |
| Regresión de arranque | La vista empaquetada vuelve a mostrar Capibara 4.0.0, historial, configuración y nueva tarea | Validado |
| Cancelación y recuperación sin modificar Capibara | Con workspace vivo, `cancelTask` interrumpe el runtime y el host recarga la webview; en aproximadamente dos segundos reaparecen chat, historial y estado final | Validado en E2E |
| Workspace temporal desaparecido | Un registro histórico mostró `FileNotFoundError` en `os.getcwd()` después de borrar el workspace durante la tarea | El arnés E2E debe mantener vivo el workspace; robustez ante desaparición queda separada |
| Integridad del paquete | Validador y smoke de Napo pasan después de la reconstrucción | Validado |

La intervención se mantiene deliberadamente en el receptor: resuelve la recuperación observable de la webview sin incorporar lógica paralela al agente ni modificar su bundle.

## 17. Arranque bajo demanda y rechazo controlado — 2026-10-12

| Área | Evidencia vigente | Estado |
|---|---|---|
| Barreras del extension host | Napo deja continuar configuración/proxy y workspace con límites controlados para el host local bajo demanda | Implementado en el host |
| Activación integrada | `capibara.SidebarProvider` activa `juliushearts.rhs-agent4` por ID únicamente en Napo | Validado en paquete |
| Vista Capibara | Chat, Historial, Configuración, proveedores, perfil Workspace y formulario visibles | Validado E2E |
| Rechazo de escritura | Mock local produjo `Escribiendo archivo`; la UI indicó rechazo y el archivo no fue creado | Validado |
| Aprobación pendiente visible | La UI mostró `Aprobar` y `Rechazar` con el mock retardado; la operación fue aprobada y verificada | Validado |
| Fuentes protegidas | No se escribieron RHS-IA, Positron, rhs-agent3, rhs-agent4 ni vscode | Validado por auditoría |

## 19. Procedencia de workspace en aprobación — 2026-10-13

| Área | Evidencia vigente | Estado |
|---|---|---|
| Tool call controlado | Mock local retardado emitió `write_to_file` | Reproducido |
| Escritura | No se creó el archivo de prueba | Rechazo seguro validado |
| Protección de procedencia | El host rechazó una ruta de workspace no coincidente antes de ejecutar | Validado |
| Tarjeta pendiente | Una instancia limpia mostró la tarjeta y permitió aprobar `write_to_file` dentro del workspace | Validado |
| Integridad de Capibara | No se modificó el bundle ni se relajó la guarda de workspace | Validado |

## Evidencia nueva del host — aprobación y procedencia

| Área | Evidencia | Estado |
|---|---|---|
| Tarjeta de aprobación | La UI de Napo muestra `write_to_file` con `Aprobar` y `Rechazar` bajo `Workspace · Sensibles` | Validado |
| Escritura autorizada | `napo-approval-test.txt` aparece únicamente en `/tmp/napo-rea-workspace` después de aprobar | Validado |
| Persistencia | `.capibara/state.db` registra `cwd` del workspace, modelo de prueba y `tool_call_count=1` | Validado |
| Integridad del agente | `rhs-agent4` conserva bundle y recursos completos; el cambio vive en el receptor | Validado |

## 18. Sesión R sin workspace válido — 2026-10-12

| Área | Evidencia vigente | Estado |
|---|---|---|
| Causa | `KallichoreSession` accedía a `workspaceFolders?.[0].uri` sin proteger el elemento cero | Identificada |
| Corrección | El host usa `workspaceFolders?.[0]?.uri` y `os.homedir()` como fallback | Implementada en Napo |
| Robustez auxiliar | Contextos y pruebas R toleran `workspaceFolders` vacío | Implementada en Napo |
| Sesión R visual | Perfil limpio inicia R 4.5.3, muestra prompt y directorio `~/` | Validado |
| Regresión de paquete | Validador con runtime y smoke Quarto/R/Python-Jupyter pasan | Validado |

## 20. Estado vigente de aceptación — 2026-10-13

| Área | Evidencia vigente | Estado |
|---|---|---|
| Python desde la interfaz | Perfil limpio: Python 3.13.3 inicia y `Run Python File in Console` devuelve `NAPO_PYTHON_UI_OK` | Validado |
| Quarto desde la interfaz | Quarto 1.10.18 ejecuta la celda, devuelve `NAPO_QUARTO_UI_OK` y abre la previsualización HTML embebida | Validado |
| Runtime por CLI | Validador y smoke contra `Napo.app` pasan R, Python con `ipykernel`, Quarto/R y Quarto/Python-Jupyter | Validado |
| Capibara y aprobación | Tarjeta `Aprobar`/`Rechazar`, escritura autorizada dentro del workspace, persistencia y procedencia | Validado |
| Recuperación de cancelación | El host restaura la vista de Capibara después de `cancelTask` en el E2E con workspace vivo | Validado en el receptor |
| Evidencia REA | `REA_EVIDENCIA_NAPO.md` y `reports/rea-napo-host-evidence.json`; análisis estático acotado y con límites explícitos | Validado documentalmente |
| Auditoría legal | Inventario reproducible disponible; 30 manifiestos del paquete requieren confirmación humana | Abierto |

La UI puede mostrar durante pruebas de desarrollo una notificación de extensiones modificadas en disco; no impidió las pruebas y debe separarse de una instalación final inmutable. El warning opcional del observador nativo de políticas de macOS también queda como limpieza de empaquetado, no como evidencia de fallo funcional.

## 21. Corte canónico posterior a la aceptación técnica

El estado vigente consolidado se mantiene en `AUDITORIA_CIERRE_NAPO.md`. En el artefacto actual, R, Python, Quarto y Capibara ya tienen evidencia funcional de CLI y de interfaz; las tablas históricas de esta matriz que los marcan como pendientes no representan el estado actual. El paquete contiene 59 extensiones y el manifiesto de release vigente registra 32.904 archivos con digest de árbol `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`.

## 22. Revalidación del receptor de proyectos — 2026-10-13

El manifiesto de release vigente registra 32.904 archivos con digest de árbol `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`. La desaparición de Capibara al crear o abrir una carpeta se corrigió en la política del host: Napo permite explícitamente a `juliushearts.rhs-agent4` permanecer habilitada en un workspace no confiable. La extensión completa no fue alterada.
