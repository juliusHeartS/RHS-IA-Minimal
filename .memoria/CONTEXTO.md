# Contexto persistente — RHS-IA Minimal

## Resumen corto

RHS-IA Minimal será una distribución de escritorio de análisis de datos basada en el trabajo existente de RHS-IA y Positron. Debe ser más sencilla que Positron y tener RHS-Agent como agente principal.

El nombre clave oficial de RHS-IA Minimal es **Napo**. Napo es la plataforma; Capibara es la extensión-agente integrada.

Napo se define como una plataforma de análisis de datos, modelación y planificación asistida por IA. Usa R y Python para ejecutar modelos matemáticos, estadísticos y de IA, simulaciones dinámicas y análisis de escenarios. Capibara usa LLMs para interpretar objetivos, proponer modelos y código, coordinar herramientas y explicar resultados. El conocimiento legal y contextual debe estar versionado por jurisdicción, fecha y fuente, con revisión humana.

## Regla absoluta

`RHS-IA`, `positron`, `rhs-agent3`, `rhs-agent4` y `vscode` son repositorios fuente de solo lectura. Se pueden estudiar y copiar selectivamente, pero nunca alterar. El destino de futuras implementaciones es únicamente `RHS-IA-Minimal`, con autorización explícita.

También se incorporó `/Users/julius3005/Documents/Github/vscode` como fuente de referencia de VS Code/Code-OSS. Es igualmente de solo lectura y servirá para estudiar el host y el sistema de extensiones de Napo.

## Archivos de referencia

- `QUE_CONSERVAR.md`: definición de producto y criterios de conservación.
- `PLAN_TRABAJO_RHS_IA_MINIMAL.md`: fases, entregables y criterios de finalización.
- `AGENTE.md`: reglas operativas permanentes.
- `BITACORA.md`: hechos, decisiones y evidencia acumulada.
- `ARQUITECTURA_NAPO.md`: arquitectura base, contratos del host, incrementos y puertas de calidad.
- `MATRIZ_HOST_CAPIBARA.md`: primera matriz técnica del receptor para Capibara y las extensiones de datos.

## Estado actual

- REA 6.4.0 está disponible.
- RHS-IA empaquetado fue inventariado y analizado parcialmente.
- El núcleo Electron/Positron/VS Code debe conservarse inicialmente.
- La reducción debe comenzar por extensiones, vistas y servicios no relacionados con R, Python, notebooks, Quarto, datos o RHS-Agent.
- RHS-Agent3 está activo en RHS-IA; Capibara/RHS-Agent4 está asociado a Positron.
- La implementación inicial ya está autorizada y vive únicamente en RHS-IA-Minimal; los repositorios fuente continúan en solo lectura.
- Capibara (`rhs-agent4`) se considera una extensión ya hecha que debe integrarse en Napo.
- Capibara va completa: no se recorta, fragmenta ni reescribe; se prepara el host para soportar todos sus contratos y capacidades.
- Las extensiones de análisis de datos provistas por RHS-IA/Positron también van completas y sin alteración; Napo se adapta a ellas.
- Los proveedores son los que Capibara puede ver; no constituyen una decisión abierta separada. Napo conserva su acceso y configuración segura.
- Quarto siempre incluido; todas las funciones de datos sin alteración; Capibara como función integrada; telemetría prohibida; actualizaciones manuales, verificables y reversibles; sin servicios externos obligatorios.
- El foco sigue siendo el receptor: instalación, activación, ciclo de vida, runtime, vistas, comandos, configuración y empaquetado del host. Capibara ya está transferida completa al destino desde su VSIX 4.0.0.
- La auditoría inicial precedió a la implementación. Napo ya tiene una base transferida y compilable en el destino; los cambios locales preexistentes en Positron, rhs-agent3 y rhs-agent4 no deben tocarse ni confundirse con cambios de Napo.
- Cuy/Sacha Cuy se usarán solo como referencias de contratos y pruebas de integración, no para inventar un agente paralelo.
- La IA generativa coordina y explica; R y Python ejecutan y verifican. Una propuesta del LLM no debe confundirse con evidencia ni con una decisión legal.

## Decisión vigente de superficie — 2026-10-12

- Capibara va completa y los proveedores que Capibara puede ver también; no son una decisión abierta de Napo.
- La autenticación que Capibara necesita para sus proveedores se conserva. Esto es distinto de la extensión upstream `microsoft-authentication`, que queda aplazada.
- También quedan aplazadas `positron.next-edit-suggestions`, `positron-dev-containers` y `positron-skills`; ninguna forma parte del núcleo local de Capibara, R, Python, datos o Quarto.
- `positron-run-app` se conserva porque pertenece a la ejecución de aplicaciones analíticas locales.
- La prueba reversible en `reports/napo-reduction-auth-ai-remote-skills.json` pasó validador y smoke sin tocar el paquete original. La reconstrucción siguiente debe regenerar los reportes de superficie, contratos, arranque, licencias y release.

## Próximo paso

Mantener una iteración de endurecimiento sobre las puertas que siguen abiertas: revisión legal humana, firma/sellado/notarización de macOS y una fuente institucional real de conocimiento con revisión humana. El canal de actualización ya está decidido como manual, explícito, verificable y reversible. La coordinación local de planificación con fuente versionada ya está comprobada; el siguiente incremento funcional es conocimiento legal versionado e institucional con revisión humana, no una reingeniería de Capibara.

## Actualización 2026-10-12

El empaquetado local de extensiones ya pasa. Capibara está presente completa en `.build/extensions/rhs-agent4` y conserva su runtime preempaquetado; Quarto está presente como VSIX de arranque. Napo arranca Electron, inicia el host de extensiones y su bundle macOS ya usa `org.rhsia.napo`, sin compartir la identidad de Positron o RHS-IA. No rechaza Quarto por versión y no ejecuta actualizaciones ni comprobaciones automáticas de galería. El escaneo de desarrollo excluye únicamente los tres paquetes de Data Explorer que son insumos de compilación. El siguiente paso son las pruebas funcionales del receptor y la auditoría legal.

La primera prueba de interfaz mostró que Capibara sí se registraba, pero la Activity Bar heredada arrancaba oculta en perfiles limpios. El host Napo fue ajustado para mostrarla por defecto cuando el usuario no ha elegido otra cosa. Con el bundle recompilado, `RHS-Agent` aparece, su vista se abre y muestra `New task` y `Settings`; una preferencia explícita `workbench.activityBar.location: hidden` continúa respetándose. La suite `test:positron` sigue pasando con 415 archivos y 4.945 pruebas.

La validación de runtimes confirmó R 4.5.3, Python 3.13.3 y Quarto CLI 1.10.18 preparado con checksum. Se añadió `scripts/validate-napo.mjs` con los comandos `validate-napo` y `validate-napo-runtime`. La ejecución dinámica aún no está aprobada: el escáner registra R/Python, pero el host de extensiones no completa el registro operativo y el selector de sesiones queda vacío. Investigar el arranque del host y repetir la prueba antes de cerrar la puerta funcional.

El flujo oficial de empaquetado macOS arm64 generó `../VSCode-darwin-arm64/Napo.app`. El artefacto contiene Quarto 1.10.18 dentro de `Contents/Resources/app/quarto` y Capibara completa dentro de `Contents/Resources/app/extensions/rhs-agent4`; la validación de paquete pasa y conserva el SHA-256 de Capibara. La interfaz confirma Napo y RHS-Agent, pero el selector de R/Python sigue vacío por una inicialización incompleta del host de extensiones. No afirmar ejecución analítica completa hasta corregir esa frontera y repetir la prueba E2E.

## Estado vigente 2026-10-12

- La frontera del host para el diagnóstico de R fue corregida sin tocar `extensions/positron-r`: el servicio de salud activa primero la extensión por ID y después ejecuta `r.getEnvironmentHealth`.
- El paquete macOS final contiene Capibara completa, PET, Ark, Quarto 1.10.18 y el binding nativo de Git. Las integridades y permisos están comprobados por `scripts/validate-napo.mjs`.
- El paquete muestra R configurado correctamente; los logs confirman R 4.5.3, `usable: true` y `supported: true`.
- Python ya descubre intérpretes. La comprobación visual queda en 2/4 porque `/opt/homebrew/bin/python3` no tiene `ipykernel`; esto es una acción explícita del usuario, no un fallo de transferencia de PET.
- Napo no descarga automáticamente documentación LLM: `product.json` tiene `positronLlmsDocsUrl` vacío y la prueba limpia no registra `llm-docs` ni `cdn.posit.co/positron/releases/docs`. Solo un `POSITRON_LLMS_DOCS_URL` explícito habilita el mecanismo.
- La suite vigente es: 415 archivos de prueba pasan, 4.946 pruebas pasan, 3 expected-fail y 21 omitidas; también pasan typecheck, build-fast, empaquetado macOS, validación estructural y validación de extensiones.
- No se debe declarar todavía la aceptación E2E completa: faltan sesión R, sesión Python con kernel, render Quarto R/Python y pruebas completas de Capibara con proveedor, permisos, cancelación, historial y procedencia.
- Pendientes de calidad de distribución: avisos `No bundle location found` en extensiones Positron, notificación `posix_spawn failed` del terminal, timeout de autenticación GitHub y auditoría legal/licencias/URLs.

## Actualización posterior 2026-10-12

- Se añadió `scripts/smoke-napo-runtime.mjs` y `npm run smoke-napo-runtime` para repetir la validación de CLI sin servicios externos.
- La ejecución contra `Napo.app` pasó Quarto 1.10.18, R, Python con `ipykernel`, render Quarto/R y render Quarto/Python-Jupyter.
- Esto demuestra el runtime analítico por CLI y reduce la brecha de evidencia; todavía falta probar esos flujos desde la interfaz de Napo y completar Capibara, proveedores, permisos, cancelación, historial y procedencia.
- El perfil limpio sigue mostrando `posix_spawn failed` al crear una terminal aunque el paquete contiene `node-pty` macOS arm64 y ofrece `bash`, `zsh` y `tmux`; la causa exacta sigue abierta.
- Los avisos `No bundle location found` se explican porque varias extensiones Positron tienen bundles locales sin declarar `l10n` en el manifiesto. No se alteran esas extensiones; la limpieza queda para el host/empaquetado.
- La reducción de superficie quedó formalizada en `PERFIL_NAPO_MINIMAL.md`: un corte previo tenía 127 directorios de extensiones más Quarto; el inventario vigente del destino registra 134 manifiestos. Primero se ocultará o desactivará de forma reversible lo ajeno al análisis; la eliminación física espera pruebas de dependencias, E2E y auditoría legal.

## Estado vigente posterior — runtimes nativos y E2E del receptor

- Se corrigió el empaquetado del receptor para incluir Kallichore arm64 en `extensions/positron-supervisor/resources/kallichore/kcserver` y para desempaquetar `node-pty/prebuilds/**/spawn-helper` junto con los módulos nativos. La causa de `posix_spawn ENOENT` quedó localizada en ese auxiliar fuera del ASAR.
- El destino declara Kallichore `0.1.67`, igual que el runtime transferido desde Positron y el manifiesto fuente leído. No se modificó ningún repositorio fuente externo.
- La validación final del paquete y el smoke reproducible pasan: Capibara completa, PET, Ark, Kallichore, Quarto `1.10.18`, R, Python con `ipykernel`, render Quarto/R y render Quarto/Python-Jupyter.
- La prueba UI final con perfil limpio confirma `Kallichore 0.1.67 server online`, sesión R `4.5.3` iniciada y terminal integrado `zsh` disponible. Los logs finales no contienen `posix_spawn` ni `ENOENT` del auxiliar.
- La brecha de runtime R/Python/Quarto desde la interfaz queda cerrada para R y terminal; Python continúa requiriendo una instalación explícita de `ipykernel` en el intérprete elegido.
- Antes de declarar distribución pública todavía faltan Capibara E2E completa, proveedores/permisos/cancelación/historial/procedencia y la auditoría legal de licencias, avisos y URLs. Los avisos de localización `No bundle location found` y la notificación de extensiones modificadas quedan como limpieza de empaquetado.

## Decisiones vigentes — servicios, proveedores y actualizaciones (2026-10-12)

- Napo conserva Capibara completa y los proveedores que Capibara puede ver.
- “Servicio externo” no significa telemetría: incluye Ollama/LM Studio local, proveedores LLM remotos, búsqueda web/Obscura, Qdrant y endpoints configurables. Son opcionales y requieren configuración/acción del usuario.
- Telemetría, sincronización, marketplace, diagnóstico remoto y actualización automática están prohibidos.
- La búsqueda web inicia desactivada; las credenciales nunca se empaquetan.
- Actualizaciones: manuales, explícitas, verificables por hash/firma y reversibles.
- La explicación normativa está en `POLITICA_NAPO.md`.
- La auditoría legal preliminar está en `AUDITORIA_LEGAL_NAPO.md`: el núcleo declara Elastic License 2.0, Capibara Apache-2.0 y VS Code MIT. No llamar a todo Napo “software libre” bajo una sola licencia sin revisión.

## Evidencia Capibara E2E (2026-10-12)

- Capibara funciona dentro de un workspace temporal y conserva historial.
- Ollama local aparece como proveedor y un modelo local pudo seleccionarse.
- Una tarea pasó a `Pensando…`, mostró `Cancelar` y quedó registrada en historial después de cancelar.
- La vista web necesitó recargar la ventana para reaparecer después de la cancelación; queda como brecha de recuperación suave para la siguiente iteración.
- No contar una prueba sin workspace como E2E válida.

## Estado consolidado posterior — validación de distribución 2026-10-12

- `npm run validate-napo-package` pasa después de comprobar identidad, telemetría, actualizaciones, Capibara completa, PET, Ark, Kallichore, Quarto, `node-pty` y los artefactos legales integrados y empaquetados.
- `npm run smoke-napo-runtime -- --package ../VSCode-darwin-arm64/Napo.app` pasa Quarto `1.10.18`, R, Python con `ipykernel`, render Quarto/R y render Quarto/Python-Jupyter sin servicios externos.
- Capibara E2E ya validó en workspace temporal proveedores visibles, Ollama local, perfiles, aprobación, runners, cancelación e historial. Queda abierta la recuperación de la vista sin recargar la ventana y una prueba separada de aprobaciones con herramientas reales.
- Se confirmó que los repositorios fuente conservan exactamente sus estados previos observados; toda modificación pertenece al destino Napo.
- `scripts/validate-napo.mjs` ahora impide empaquetar Napo si faltan `LICENSE.txt`, `NOTICE`, la licencia de Capibara, `THIRD_PARTY_NOTICES.md` o el inventario de licencias auxiliares.
- Se eliminó la galería OpenVSX heredada del `product.json` de Napo; el paquete recompilado declara sus endpoints de galería vacíos y el validador lo comprueba. Las extensiones integradas no dependen de Marketplace en ejecución.

## Revalidación Capibara posterior al rollback — 2026-10-12

- La última reconstrucción de Napo abre RHS-Agent correctamente y presenta Capibara 4.0.0, historial, configuración, nueva tarea y `Workspace · Sensibles`.
- La cancelación observada es limpia en el runtime de Ollama local, pero la webview puede quedar en blanco hasta reabrirla o recargar la ventana. Es una brecha del receptor, no una razón para alterar Capibara.
- La prueba de aprobación no llegó a mostrar una herramienta pendiente: el modelo local no alcanzó esa fase antes de la cancelación. No registrar ese E2E como validado.
- Se ensayó una recuperación automática en el bundle integrado y se revirtió totalmente; no quedó cambio experimental en Capibara ni en los repositorios fuente.

## Endurecimiento del host posterior — 2026-10-12

- Se añadió al receptor Napo una recuperación acotada de `capibara.SidebarProvider`: ante `onFatalError`, el host puede recargar una sola vez la webview mediante la API oficial `IOverlayWebview.reload()`.
- La lógica vive en `src/vs/workbench/contrib/webviewView/browser/webviewViewPane.ts`; Capibara permanece completa y sin alteración.
- Typecheck, build, empaquetado, validación estructural y smoke reproducible pasan después del cambio.
- La cancelación ya tiene recuperación específica en el host: después de `cancelTask`, una recarga diferida de la webview restaura Capibara y su estado visible. La prueba con workspace vivo confirmó runtime interrumpido, historial y formulario disponibles sin intervención manual.
- La extensión `rhs-agent4` sigue intacta; la recuperación vive exclusivamente en `WebviewViewPane` y el paquete se reconstruyó después del cambio.
- La aprobación de una herramienta real todavía no está demostrada porque el modelo local no llegó a planificarla en la prueba disponible.
- Un `FileNotFoundError` de `os.getcwd()` pertenece a una corrida anterior cuyo workspace temporal fue borrado por el arnés antes de que terminara la tarea; las corridas vigentes mantienen vivo el workspace y no deben reutilizar ese resultado como fallo de la integración.

## Regresión y frontera de aprobación — 2026-10-12

- La suite `test:positron` volvió a pasar después de la recuperación de cancelación: 415 archivos y 4.946 pruebas aprobadas, con los fallos esperados y omitidos ya conocidos.
- El validador del paquete y el smoke de runtime volvieron a pasar Capibara, privacidad, legales, runtimes nativos, Quarto, R, Python/Jupyter y ambos renders.
- La prueba UI de escritura en workspace temporal terminó sin crear archivo y con `tool_turns=0`: el modelo local respondió texto en vez de solicitar herramienta. La aprobación sigue siendo una frontera funcional por validar con un modelo que genere tool call; no se debe relajar `Workspace · Sensibles` para forzarla.

## Estado posterior — host Napo y Capibara 2026-10-12

- Capibara ya no queda en blanco al abrir RHS-Agent en el paquete macOS: el host libera las barreras del proceso local bajo demanda y activa `juliushearts.rhs-agent4` por ID para la vista integrada.
- La solución se limita al host Napo y conserva intacta la extensión completa `rhs-agent4`. No trasladar estos cambios a Positron, RHS-IA, rhs-agent3, rhs-agent4 ni vscode.
- La prueba de rechazo usó únicamente el mock local `127.0.0.1:18123`; la UI mostró la operación de escritura y el archivo no apareció en el workspace.
- No afirmar todavía una aprobación aceptada ni una tarjeta pendiente visible: el mock concluye de inmediato. La puerta E2E de aprobación queda abierta.
- Validación vigente: typecheck, build, paquete, validador estructural, smoke runtime, suite Positron y diff-check pasan. El smoke valida Quarto/R/Python/Jupyter por CLI; la sesión R visual mostró un error separado de `positron-supervisor` que debe investigarse.

## Corrección posterior — sesión R 2026-10-12

- Se reprodujo y corrigió en Napo el acceso inseguro `workspaceFolders?.[0].uri` de `KallichoreSession`; ahora el elemento `[0]` también está protegido y el fallback es `os.homedir()`.
- `positron-r/src/contexts.ts` y `positron-r/src/testing/testing.ts` toleran ausencia de carpetas. Son cambios únicamente en el destino Napo.
- Perfil limpio posterior: R 4.5.3 inicia, muestra prompt y usa `~/` cuando no hay una primera carpeta válida. El error `reading 'uri'` ya no aparece.
- El paquete reconstruido pasa validador estructural con runtime y smoke completo: Quarto, R, Python/ipykernel y ambos renders.

## Frontera de aprobación posterior — 2026-10-13

- El mock retardado confirmó que la llamada controlada a `write_to_file` no produce escritura cuando el workspace enviado por el runtime no coincide con el workspace vinculado; el receptor rechaza de forma segura.
- No modificar Capibara ni relajar la comparación de rutas. La corrida tuvo instancias de Napo coexistentes, así que debe repetirse con una sola instancia limpia para separar un problema de arnés/perfil de un problema del contrato runtime-host.
- `scripts/mock-openai-approval-server.mjs` admite `NAPO_APPROVAL_DELAY_MS` para retener la respuesta y observar una tarjeta de aprobación, sin tocar el bundle de Capibara.

## Aprobación y persistencia validadas en Napo — 2026-10-12

- En una instancia aislada de Napo.app con `/tmp/napo-rea-workspace`, el proveedor local retardado produjo una tarjeta visible de aprobación para `write_to_file`.
- La UI mostró `Aprobar` y `Rechazar`; al aprobar, Capibara creó `napo-approval-test.txt` dentro del workspace y no fuera de él.
- La persistencia efectiva está en `/tmp/napo-rea-workspace/.capibara/state.db`: una sesión `capibara-extension` registra el `cwd` correcto, el modelo de prueba, cuatro mensajes y una llamada de herramienta.
- La evidencia de la herramienta incluye la verificación de contenido y SHA-256. La protección de procedencia y la puerta de aprobación no se relajaron.
- El validador del paquete y el smoke de runtime posteriores pasan. Ya no queda abierta la prueba básica de aprobación; siguen abiertas únicamente las decisiones de publicación, revisión legal humana y limpieza cosmética de empaquetado.

## Inventario legal reproducible — 2026-10-12

- `scripts/audit-napo-license-inventory.mjs` genera reportes deterministas para el árbol integrado y para `Napo.app`, con manifiestos, licencias, avisos, tamaños y SHA-256.
- El paquete actual contiene 131 manifiestos de extensiones; 27 archivos legales tienen hash registrado.
- 32 manifiestos requieren confirmación humana por no declarar una licencia directamente o remitir a un archivo. El reporte deja esa incertidumbre explícita.
- La herramienta mejora la trazabilidad, pero no sustituye la revisión legal de dependencias transitivas, binarios, modelos, marcas y condiciones de redistribución.

## Corrección de Python y comprobación visual — 2026-10-13

- El arranque de Python fallaba porque faltaba `positron._vendor` en el destino Napo; el origen estaba en una exclusión del `.gitignore` del receptor, no en Capibara ni en Positron.
- Se transfirió el directorio vendorizado desde Positron al destino sin modificar el repositorio fuente y se reconstruyó `Napo.app`.
- La interfaz de Napo ahora inicia Python 3.13.3 y ejecuta archivos Python; evidencia: `NAPO_PYTHON_UI_OK`.
- Quarto 1.10.18 ejecuta celdas Python y abre su previsualización embebida; evidencia: `NAPO_QUARTO_UI_OK`.
- Después de la reconstrucción, `validate-napo-package -- --require-runtime`, `smoke-napo-runtime` y `git diff --check` pasan; los repositorios fuente conservan los estados previamente observados.

## Estado consolidado actual — 2026-10-12

- La ruta analítica de producto quedó comprobada desde la interfaz: Capibara solicita `positron_execute_code`, Napo muestra aprobación visible y la sesión R viva ejecuta modelo, simulación y escenarios.
- La evidencia está en `reports/napo-capibara-positron-e2e.json`; el marcador observable es `NAPO_AGENT_MODELING_OK` y la sesión expone `fit`, `trajectory`, `scenarios`, `x` e `y`.
- El manifiesto de release fue regenerado después de detectar un conteo obsoleto: el paquete vigente registra 34.191 archivos y digest `0fa64c7c515095744061cb388444588551a45fdf0c6b85baf1ef95e061c32230`.
- `npm run validate-napo-gate -- --package ../VSCode-darwin-arm64/Napo.app` termina `ACEPTADA (desarrollo técnico)`. La firma sigue siendo `development-only`; revisión legal humana, firma/notarización y canal de actualización permanecen abiertas.
- `execute_code` sin prefijo no debe confundirse con la ruta analítica viva: es el kernel autónomo del runtime; para R/Python del usuario se conserva `positron_execute_code`.
- La sensibilidad también quedó comprobada desde la UI con tres shocks, tabla visible y marcador `NAPO_SENSITIVITY_OK`; evidencia: `reports/napo-capibara-sensitivity-e2e.json`.

## Planificación versionada comprobada — 2026-10-12

- La interfaz de Napo comprobó `Capibara → positron_execute_code → sesión R viva` para planificación basada en una fuente local versionada.
- `Docs/planning-policy.md` de la prueba declara `EC-HWF`, versión `2026.01`, Ecuador, fecha efectiva `2026-01-15`, capacidad base 100 y objetivo 120.
- R 4.5.3 calculó brecha 20 y asignó 15 a staffing y 5 a training; el marcador verificable es `NAPO_PLANNING_OK`.
- La evidencia está en `reports/napo-capibara-planning-e2e.json`. Es evidencia de coordinación local y cálculo reproducible; no declara validez legal ni reemplaza revisión institucional.
- La primera lectura del marcador fue prematura; la segunda corrida confirmó el marcador y se conservó como evidencia válida. El arnés loopback no se distribuye.

## Auditoría legal clasificable — 2026-10-12

- `scripts/audit-napo-license-inventory.mjs` ahora separa evidencia de licencia declarada, archivo local sin declaración, referencia a archivo ausente y ausencia de ambos.
- El paquete mantiene 95 manifiestos, 38 archivos legales con hash y 31 casos en revisión humana: 64 declarados, 29 sin declaración/archivo local detectable, 1 referencia sin archivo localizado y 1 archivo local sin declaración.
- `reports/napo-license-inventory-package.json` conserva `licenseEvidenceSummary` y `decision=human-review-required`. Esto mejora el inventario; no constituye aprobación legal ni permite inferir licencias.

## Estado documental vigente — 2026-10-13

- Las secciones anteriores que describen el selector Python vacío, la sesión Quarto pendiente o la aprobación no observada son antecedentes históricos y quedan supersedidas por las entradas posteriores de validación UI y E2E.
- El flujo básico de Python, Quarto y Capibara está validado en el paquete actual; no se debe volver a reportar como pendiente salvo que una reconstrucción nueva lo regrese.
- Sigue abierta la revisión legal humana, la decisión operativa de actualización por canal, la revisión de avisos no bloqueantes del empaquetado y la eliminación física de extensiones.
- El ledger REA vive en `REA_EVIDENCIA_NAPO.md` y el bundle exportado en `reports/rea-napo-host-evidence.json`. Su cobertura es parcial y no demuestra equivalencia completa ni ausencia de dependencias.
- La matriz de procedencia y transferencia vive en `MATRIZ_TRANSFERENCIA_NAPO.md`.
- La auditoría reversible de superficie vive en `scripts/audit-napo-extension-surface.mjs` y `reports/napo-extension-surface.json`: 134 manifiestos, 50 para conservar, 38 candidatas a aplazar y 46 por probar. No se ha eliminado ninguna extensión.
- El inventario del paquete real vive en `reports/napo-extension-surface-package.json`: 126 manifiestos, 46 para conservar, 36 candidatas aisladas y 44 por probar. `scripts/test-napo-surface-reduction.mjs` demostró validador y smoke en un clon con las 36 retiradas temporalmente; aún no se modifica el destino.
- La pasada REA ampliada de Capibara completa registró `ev_ec0c5d7debdd58ae63e83340735dce5093d705e3b8a4745ceeb51aba8cbbb950`, hash `2e50ba25dd95390abc9f182960561d348a22e5017bdd9cfe794f599f076b519b`, 2.052 archivos relevantes, 1.548 JavaScript parseados, 6.437.702 nodos AST y 0 fallos de parseo. La evidencia sigue siendo estática y semánticamente parcial; respalda transferir Capibara completa y resolver el contrato en el receptor.
- El bundle REA actualizado está en `reports/rea-napo-host-evidence.json` con 172.344.306 bytes y 9 registros. `REA_EVIDENCIA_NAPO.md` contiene el ledger consolidado del host y Capibara.
- La validación final posterior a la reducción reversible pasa `validate-napo-package -- --require-runtime`, `smoke-napo-runtime`, auditoría de superficie y `git diff --check`. En un perfil limpio, la UI R/Quarto y la UI Python del clon reducido pasaron; Python 3.13.3 ejecutó `NAPO_PYTHON_UI_OK`. La corrida anterior con Python 3.14.6 sin `ipykernel` queda supersedida como limitación de configuración de perfil.
- La evidencia de interfaz de la reducción está en `reports/napo-reduction-ui-evidence.json`; las 36 candidatas siguen fuera de una decisión permanente hasta cerrar licencias, dependencias implícitas y reconstrucción.

## Comprobación de confianza y entorno — 2026-10-12

- La instancia interactiva de Napo empezó el workspace temporal en modo restringido; al confiar `/tmp/napo-rea-workspace`, las funciones de R, Python, tareas y RHS-Agent quedaron habilitadas.
- La bienvenida confirmó R configurado correctamente y Python detectado en `/opt/homebrew/bin/python3`.
- Ese perfil concreto mostró 2 de 4 comprobaciones Python porque no tenía `ipykernel` utilizable. No se instaló ni modificó el entorno del usuario.
- No interpretar esta observación como una falla del paquete: `smoke-napo-runtime` con un entorno preparado valida Python/Jupyter y Quarto. La evidencia UI usa estado `partial` y declara la limitación.

## Estado vigente posterior a la reducción aplicada — 2026-10-13

- El empaquetado actual de Napo contiene 90 extensiones: 46 conservadas y 44 sujetas a prueba específica. Las 36 candidatas se excluyen solo del artefacto distribuido; sus carpetas permanecen en el destino para permitir reversión.
- Capibara 4.0.0 va completa y sin alteración; Quarto 1.10.18, R, Python, notebooks, runtimes y extensiones de datos continúan incluidos.
- La prueba UI del paquete final, con RHS-IA abierto, inició Python 3.13.3/IPython 9.10.0 y ejecutó `NAPO_PYTHON_UI_OK`. Quarto generó una previsualización HTML con `NAPO_QUARTO_UI_OK`. R y Quarto/R pasan el smoke CLI.
- Se corrigió en el receptor Napo `src/vs/workbench/api/node/extensionHostProcess.ts` para que el host de extensiones use resolución IPv4-first y evite falsos puertos libres cuando otra aplicación usa IPv4 y `localhost` resuelve a IPv6. `PortFinder` y las extensiones Positron conservan su código original.
- Las comprobaciones posteriores pasan: compilación rápida de extensiones, empaquetado macOS, validador con runtime, smoke de Quarto/R/Python-Jupyter y auditoría de superficie. Evidencia: `reports/napo-final-package-ui-evidence.json`.
- La compatibilidad IPv4 quedó en el host Napo (`src/vs/workbench/api/node/extensionHostProcess.ts`); `PortFinder` y el código incremental de las extensiones Positron no se modifican para esta corrección.
- Pendientes reales: revisión legal humana y política de actualización por canal. El binding nativo de `policy-watcher` ya está compilado, empaquetado y validado en macOS arm64; no es un servicio externo ni telemetría. La UI final de R ya produjo `NAPO_REDUCED_R_QUARTO_OK` con R 4.5.3.
- La actualización manual ya tiene verificación técnica local: `npm run record-napo-release` genera `reports/napo-release-manifest.json` y `npm run verify-napo-release` valida identidad, commit, permisos, tamaños y digest SHA-256 del árbol. Falta definir canal público y firma de publicación.
- La regresión posterior al cambio de host pasó 415 archivos y 4.946 pruebas, con 3 expected-fail y 21 omitidas; no se reintrodujeron cambios en el código de las extensiones Positron por la solución IPv4.
- El inventario legal posterior a la reducción registra 95 manifiestos, 38 archivos legales con hash y 31 revisiones humanas pendientes. La auditoría de superficie confirma 90 extensiones, 46 conservadas, 0 candidatas pendientes y 44 por probar.

## Estado vigente posterior a la automatización nativa — 2026-10-13

- `node-gyp@13.1.0` está fijado como dependencia de desarrollo del destino y `scripts/build-napo-policy-watcher.mjs` compila `@vscode/policy-watcher` automáticamente dentro de `gulp vscode-darwin-arm64` cuando falta el binding macOS arm64.
- La reconstrucción forzada y el empaquetado completo pasaron. El paquete actual conserva el binding nativo en `node_modules.asar.unpacked`, y el validador compara su SHA-256 con la copia integrada y verifica el permiso de ejecución.
- Validaciones posteriores: `typecheck-client`, `validate-napo-package -- --require-runtime`, `smoke-napo-runtime`, auditoría de superficie, inventario legal, `record-napo-release`, `verify-napo-release` y `test:positron` pasan.
- El manifiesto de ese corte histórico registraba 33.822 archivos; el manifiesto vigente registra 33.538 archivos y conserva el digest `24ce4c9c4cd19df4513c82bbfa68d6bfa72f85abdc922661f7973b13f2f168f2`.
- No se modificó ningún repositorio fuente. Pendientes de distribución: revisión legal humana, firma/notarización y canal público; la automatización de construcción nativa ya no es un pendiente.

## Estado de firma del artefacto — 2026-10-13

- `Napo.app` está firmado ad hoc para desarrollo (`Identifier=Electron`, sin `TeamIdentifier`).
- La verificación estricta de `codesign` y la evaluación `spctl` fallan por ausencia de una firma de recursos de distribución. Esto no invalida las pruebas funcionales locales, pero impide declarar el artefacto como release macOS publicable.
- La firma/notarización queda como puerta externa que requiere identidad, credenciales y decisión de publicación; el digest SHA-256 solo verifica integridad del artefacto.

## Evidencia dinámica de privacidad — 2026-10-13

- `scripts/smoke-napo-privacy.mjs` inicia el paquete real con un perfil limpio y observa el árbol de procesos y sus conexiones TCP/UDP.
- La corrida actual de 12 segundos registró 7 procesos, 0 conexiones y 0 conexiones no locales. El reporte es `reports/napo-privacy-smoke.json` y quedó en estado `pass`.
- Esta prueba complementa la validación estática de `enableTelemetry=false`, endpoints vacíos y Marketplace desactivado; no sustituye la auditoría de una conexión a proveedor que el usuario configure explícitamente.

## Puerta automatizada de firma — 2026-10-13

- `scripts/audit-napo-macos-signature.mjs` registra la identidad, el equipo, `codesign --verify --deep --strict` y `spctl --assess`.
- El artefacto actual es `development-only`; `--require-distribution` termina con fallo porque la firma ad hoc no es una firma publicable.
- La puerta está lista para CI o publicación cuando exista una identidad válida; mientras tanto evita declarar accidentalmente un release firmado.

## Puerta consolidada — 2026-10-13

- `scripts/validate-napo-gate.mjs` concentra la aceptación técnica del paquete: estructura, runtimes, Quarto, privacidad dinámica, superficie, licencias, manifiesto y firma.
- La corrida actual terminó `ACEPTADA (desarrollo técnico)`. La variante `--require-distribution` permanece correctamente condicionada a firma/notarización reales.
- El smoke de privacidad ahora aísla y cierra su grupo de procesos; la comprobación posterior no encontró procesos temporales residuales.

## Integridad de extensiones de datos — 2026-10-13

- `scripts/audit-napo-data-extension-integrity.mjs` compara la transferencia contra `../RHS-IA`, no contra una revisión distinta de Positron.
- La auditoría vigente cubre 17 extensiones: 0 diferencias funcionales; las diferencias restantes están clasificadas como empaquetado, localización, artefactos generados o runtimes copiados.
- Esta comprobación forma parte de `validate-napo-gate` y protege la regla de no alterar el código funcional de las extensiones de análisis de datos.

## Corte canónico de continuidad — 2026-10-12

- La referencia vigente del estado de Napo es `AUDITORIA_CIERRE_NAPO.md`; las cifras anteriores de superficie y release que aparecen en esta memoria son históricas.
- El paquete actual contiene 90 extensiones: 46 conservadas y 44 que requieren prueba específica. No hay dependencias declaradas sin resolver en el inventario de superficie.
- El manifiesto vigente registra 34.191 archivos y el digest `0fa64c7c515095744061cb388444588551a45fdf0c6b85baf1ef95e061c32230`.
- El inventario legal vigente registra 95 manifiestos, 38 archivos legales con hash y 31 entradas para revisión humana.
- R, Python, Quarto y Capibara ya están validados por las pruebas funcionales actuales. No deben volver a reportarse como pendientes salvo que una nueva reconstrucción los haga fallar.
- Las fuentes continúan sin escrituras de Napo. Las puertas abiertas son legales, firma/notarización, canal de distribución y pruebas específicas de extensiones; las capas de simulación, escenarios, conocimiento legal versionado y planificación son incrementos de producto posteriores.

## Corrección vigente de la puerta de distribución — 2026-10-12

- El inventario legal soporta `--require-human-review` y reporta 31 casos pendientes en el paquete actual: 64 declaraciones directas, 29 sin declaración ni archivo local detectable, 1 referencia a archivo ausente y 1 archivo local sin declaración.
- `validate-napo-gate --require-distribution` activa esa exigencia y termina con código 1 antes de la firma mientras exista cualquier caso pendiente. La falla es intencional y protege contra una publicación prematura.
- La variante sin `--require-distribution` sigue terminando `ACEPTADA (desarrollo técnico)`; la firma ad hoc y la revisión legal humana continúan siendo puertas de distribución separadas.
- La política de actualización permanece manual, explícita, verificable y reversible; no hay consultas automáticas, telemetría ni Marketplace.

## Guardia de fuentes — 2026-10-12

- `scripts/audit-napo-source-readonly.mjs` compara el estado observado de las cinco fuentes contra `reports/napo-source-readonly-baseline.json`.
- La verificación pasó: RHS-IA y vscode están limpios; Positron, rhs-agent3 y rhs-agent4 conservan exactamente los cambios preexistentes documentados.
- La puerta consolidada ejecuta esta guardia antes de validar el paquete y no reconstruye ni actualiza el baseline automáticamente.

## Superficie VS Code clasificada — 2026-10-12

- El reporte `reports/napo-extension-surface-package.json` conserva 90 extensiones: 46 conservar, 23 con recomendación estática de aplazar y 21 bajo revisión de contrato.
- Las 23 candidatas son 9 recursos de lenguaje sin activación, 3 herramientas de depuración/profiling JavaScript y 11 temas alternativos. La recomendación no autoriza eliminación física; antes se requiere clon reversible, pruebas del host y pruebas funcionales del paquete.
- Las 21 restantes permanecen conservadas provisionalmente por posibles contratos de documentación, preview, autenticación, Capibara, proyectos, depuración o recuperación.

## Actualización y recuperación — 2026-10-12

- `scripts/test-napo-update-recovery.mjs` valida en clones temporales enlazados una actualización `1.130.1`, rechaza un candidato con `enableTelemetry=true` y restaura exactamente la versión anterior tras un fallo de activación simulado.
- La evidencia está en `reports/napo-update-recovery.json`; el paquete original no se modifica y no se realizan descargas, instalaciones ni conexiones de red.
- La prueba quedó en `validate-napo-gate`. Sigue pendiente decidir el canal público, la firma/notarización y la operación manual de publicación.

## Gobernanza de conocimiento — 2026-10-12

- `NAPO_CONOCIMIENTO.md` y `scripts/validate-napo-knowledge-source.mjs` definen el contrato de manifiesto lateral para fuentes institucionales o legales.
- La prueba actual confirma que una fuente pendiente se puede rastrear pero no usar como conocimiento aprobado, que un cambio de contenido rompe el hash y que una fuente con revisión declarada puede pasar `--require-approved`.
- Esto fortalece el receptor sin afirmar validez legal. Falta conectar fuentes institucionales reales y obtener la revisión humana correspondiente.

## Smoke de activación de extensiones — 2026-10-12

- `scripts/smoke-napo-extension-startup.mjs` observó las 21 extensiones bajo revisión por contrato en un perfil limpio de `Napo.app`.
- Resultado: 0 errores reales de activación; el reporte distingue extensiones observadas durante el arranque de recursos que no se disparan sin una acción específica.
- La evidencia reduce el riesgo de arranque, pero no cierra pruebas de comandos, vistas, preview, autenticación o flujos específicos; no autoriza eliminación física.

## Compuerta técnica consolidada posterior al smoke — 2026-10-12

- La corrida completa de `validate-napo-gate` terminó `ACEPTADA (desarrollo técnico)` con el smoke de arranque integrado.
- La verificación final de solo lectura confirmó que las cinco fuentes conservan exactamente su baseline. No se debe regenerar ese baseline automáticamente.
- El siguiente trabajo debe escoger una puerta abierta: revisión legal humana, firma/notarización, canal manual de distribución o pruebas funcionales específicas de las 44 extensiones que requieren prueba.

## Reducción reversible aplicada — 2026-10-12

- Se validó un clon temporal retirando las 23 extensiones inicialmente clasificadas como aplazables. Pasaron el validador con runtimes, el smoke de R/Python/Quarto y el arranque real del host.
- La lista se aplicó solo al empaquetado de Napo en `build/lib/extensions.ts`; las fuentes permanecen intactas. El paquete actual contiene 67 extensiones: 46 conservadas y 21 bajo prueba específica.
- Las tres extensiones de depuración JavaScript requerían excluirse también del bloque de Marketplace; el filtro común de extensiones integradas quedó corregido y el paquete se reconstruyó con 67 extensiones.
- Evidencia vigente: `reports/napo-deferred-23-reduction.json`, `reports/napo-deferred-23-startup.json` y `reports/napo-extension-surface-package.json`.
- La siguiente puerta no es retirar más componentes por intuición: son las pruebas funcionales de las 21 extensiones restantes, la revisión legal humana, firma/notarización y canal de distribución.

## Estado canónico posterior a la reducción — 2026-10-12

- El paquete vigente contiene 67 extensiones: 46 conservadas y 21 bajo prueba específica; no hay dependencias declaradas sin resolver.
- El manifiesto de release vigente registra 33.621 archivos y el digest `d742bd216862ec5732d5c12922f184d06ea6fbbf7a6824c78dcdfe123da45e77`.
- El inventario legal vigente registra 72 manifiestos, 36 archivos legales con hash y 31 entradas para revisión humana.
- `validate-napo-gate --package ../VSCode-darwin-arm64/Napo.app` terminó `ACEPTADA (desarrollo técnico)` después de reconstruir el paquete reducido. No se debe llamar a esto release distribuible: firma, revisión legal y canal siguen pendientes.

## Contratos estáticos de extensiones — 2026-10-12

- `scripts/audit-napo-extension-contracts.mjs` revisa las 21 extensiones que permanecen bajo prueba específica y forma parte de la compuerta consolidada.
- Resultado vigente: 0 errores en manifiestos, entradas principales de escritorio, comandos, vistas, menús y recursos declarados; 5 advertencias explicadas por entradas web opcionales o comandos provistos por el host.
- Esto no cierra la prueba funcional de comandos y vistas. La siguiente evidencia debe ser UI específica, sin retirar las 21 extensiones por clasificación estática.

## Primera tanda de UI funcional — 2026-10-12

- La UI real de Napo abrió la documentación local (`paho.rhs-ia-documentation`), renderizó `NAPO_BROWSER_OK` con `vscode.simple-browser` usando un `data:` local y mostró `Image Preview` para `screenshots/napo-playwright-electron.png`.
- `reports/napo-extension-ui-evidence.json` conserva 15 observaciones `pass` y 1 `partial`, el digest del paquete y 4 limitaciones. `validate-napo-extension-ui-evidence.mjs` exige los 15 flujos pass.
- Estas pruebas no son cobertura automática completa: 6 extensiones/contratos aún requieren UI específica.

## Estado canónico posterior a la reducción de cuatro integraciones — 2026-10-12

- Se aplicó en el empaquetado de Napo la exclusión reversible de `microsoft-authentication`, `positron.next-edit-suggestions`, `positron-dev-containers` y `positron-skills`.
- El paquete reconstruido registra 63 extensiones: 46 conservadas y 17 bajo prueba específica; `rhs-agent4`/Capibara y `positron-run-app` están presentes.
- `validate-napo-package --require-runtime`, auditoría de superficie, contratos y licencias pasan. No hay dependencias declaradas sin resolver; los contratos quedan con 0 errores y 4 advertencias explicadas.
- El inventario legal del paquete registra 68 manifiestos, 35 archivos legales con hash y 30 entradas de revisión humana.
- El release manifest vigente registra 33.206 archivos y el digest `aa6bc7966d580acec705a333dae7a6dbc6983af03a09b8c2b618b66d64a43e60`.
- La evidencia UI se volvió a ligar a ese digest: 15 flujos `pass`, 1 observación `partial` del entorno Python y 2 extensiones restantes para UI específica (`debug-server-ready`, `positron-run-app`).
- La prueba de reducción está en `reports/napo-reduction-auth-ai-remote-skills.json`; no se modificaron los repositorios fuente.

## Evidencia UI posterior — `positron-run-app` — 2026-10-12

- Napo mostró `Run Flask App in Terminal`, creó la terminal y armó el comando esperado desde un editor Python.
- El intérprete seleccionado no tenía Flask; el error quedó visible y no se instalaron paquetes.
- Un servidor HTTP estándar en loopback produjo `http://127.0.0.1:8765/`; el receptor detectó el enlace, ofreció `Open in Viewer pane` y el Viewer mostró la lista del workspace.
- El proceso se detuvo limpiamente. La evidencia UI vigente conserva 16 flujos `pass`, 1 `partial` de entorno Python y deja solo `debug-server-ready` para prueba UI específica.

## Límite restante — `debug-server-ready` — 2026-10-12

- La extensión no aporta comando ni vista propia: se activa al resolver una configuración de depuración con `serverReadyAction` y observa la salida de la sesión.
- El contrato estático pasa; la prueba UI real requiere iniciar una sesión de depuración con un servidor que emita `listening on port ...`. No se considera pass hasta observar esa transición.

### Fixture de prueba preparada

- Napo contiene `test/napo-fixtures/server_ready.py`, una fixture autocontenida basada en `http.server` que responde `NAPO_DEBUG_SERVER_READY_OK` en loopback.
- `.vscode/launch.json` contiene `Napo fixture: debug server ready` con `serverReadyAction: openInViewer` y el patrón `listening on port ([0-9]+)`.
- En la corrida UI actual el depurador Python se detectó, pero el selector mostró la plantilla del depurador y no la configuración nueva; queda como limitación reproducible, no como éxito inferido.

### Revisión legal trazable — 2026-10-12

- La compuerta consolidada actual pasa como `ACEPTADA (desarrollo técnico)`: 63 extensiones, 46 conservadas, 17 bajo prueba, 0 dependencias manifiestas sin resolver, 16 flujos UI pass y firma `development-only`.
- El inventario legal actual del paquete registra 68 manifiestos, 35 archivos legales con hash y 30 casos pendientes de revisión humana. El release manifest vigente tiene 33.206 archivos y digest `aa6bc7966d580acec705a333dae7a6dbc6983af03a09b8c2b618b66d64a43e60`.
- `npm run audit-napo-license-review-packet` genera un expediente con los 30 casos, hashes, procedencia posible y avisos observables; los 30 casos tienen candidatos. El expediente no infiere licencias ni modifica manifiestos, y mantiene abierta la decisión humana.

### Límite confirmado de `debug-server-ready` — 2026-10-12

- La configuración de fixture Node se puede seleccionar en Napo, pero el paquete no contiene un proveedor de depuración `node`; la UI ofrece instalar una extensión externa. No se instaló y no se debe introducir como dependencia obligatoria.
- La fixture Node sí funciona directamente en loopback y responde `NAPO_DEBUG_SERVER_READY_NODE_OK`. La fixture Python también funciona directamente, pero el adaptador de depuración integrado falla con `Timed out waiting for launcher to connect` antes de ejecutar.
- Resultado: no hay evidencia suficiente para marcar `debug-server-ready` como `pass`. Se conserva como receptor genérico bajo revisión, pendiente de probarse con un proveedor de depuración que ya forme parte del perfil soportado. La limitación no justifica alterar la extensión ni los repositorios fuente.

### Revalidación vigente — 2026-10-13

- La evidencia UI valida 16 flujos `pass`, una observación `partial` y cuatro limitaciones, ligada al digest `aa6bc7966d580acec705a333dae7a6dbc6983af03a09b8c2b618b66d64a43e60`.
- El manifest de release, la compuerta de solo lectura de fuentes, la recuperación reversible, la privacidad y el arranque de las 17 extensiones permanecen en estado `pass`.
- Estado operativo: `ACEPTADA (desarrollo técnico)`. No es todavía un release público ni debe presentarse como tal hasta cerrar legalidad, firma/notarización, canal y la limitación de depuración.

### Límite de conocimiento endurecido — 2026-10-13

- `validate-napo-knowledge-source.mjs` ahora protege el receptor contra fechas calendario imposibles, rutas absolutas, traversal, symlinks que salen de la raíz y contenidos no regulares, además de mantener hash y aprobación humana.
- El test de gobernanza pasa siete comprobaciones. La validación es local y no sigue `sourceUri` ni descarga servicios; no sustituye revisión legal o institucional.

### Artefacto limpio y manifiesto vigente — 2026-10-13

- La reconstrucción macOS arm64 de Napo terminó con 63 extensiones: 46 conservadas y 17 bajo prueba específica; Capibara completa, extensiones de análisis de datos y Quarto permanecen integrados.
- La compuerta detectó residuos Python generados durante la ejecución: primero cachés del runtime de Capibara y luego el caché Jupyter de Quarto. El destino los excluye mediante `.vscodeignore`/`.gitignore` y el smoke limpia únicamente `__pycache__` bajo el árbol de la aplicación.
- Manifiesto vigente: 32.927 archivos; digest `48d4f535ea42dd173a2fe753b6b28ada3c197a689444de18af677b7426c132c5`; verificación confirmada y cero `__pycache__`/`.pyc` en el paquete.
- La compuerta consolidada volvió a pasar como `ACEPTADA (desarrollo técnico)`. Esto no cierra revisión legal, firma/notarización, canal de distribución ni la limitación de `debug-server-ready`.
- Los cinco repositorios fuente siguen exactamente en su baseline de solo lectura.

### Verificación del código del destino — 2026-10-13

- `typecheck-client` pasa.
- `test:positron` pasa: 415 archivos, 4.946 pruebas aprobadas, 3 expected fail y 21 omitidas.
- `test:positron:check-ts` falla con 378 diagnósticos distribuidos en archivos heredados de Vitest/Positron; ninguno coincide con los archivos que `git diff` reporta como modificados en Napo. Se conserva como deuda técnica separada y no se corrige mediante cambios indiscriminados en las fuentes transferidas.

### Puerta estricta de distribución — 2026-10-13

- `validate-napo-gate --require-distribution` se detiene correctamente en inventario legal: quedan 30 manifiestos sin revisión humana.
- No es una regresión del paquete; es el bloqueo preventivo esperado antes de firma/notarización y publicación. La aceptación técnica de desarrollo sigue pasando.

### Diagnóstico de `debug-server-ready` — 2026-10-13

- El receptor `vscode.debug-server-ready` está integrado y su contrato estático pasa.
- El paquete contiene `positron-python`, pero no `ms-python.debugpy` ni un proveedor Node/js-debug. `positron-python` depende del API del depurador `ms-python.debugpy` para resolver el adaptador DAP.
- La limitación observada es, por tanto, una ausencia declarada de proveedor, no una razón para alterar las extensiones de datos. No se instalará nada desde Marketplace ni se descargará nada automáticamente.

### Privacidad por contrato en el artefacto — 2026-10-13

- La regla de privacidad de Napo se aplica también a la copia empaquetada: `build/lib/extensions.ts` elimina `aiKey` y desactiva cualquier `enableTelemetry=true` en los manifiestos que entran al `.app`. Los repositorios fuente y las extensiones de análisis permanecen sin alteración.
- `scripts/audit-napo-privacy-contract.mjs` inspecciona `product.json` y todos los manifiestos del paquete. La prueba vigente cubre 63 extensiones y pasa sin claves de instrumentación ni declaraciones activas de telemetría.
- Una URL declarada no equivale por sí sola a un servicio oculto. Se separan los servicios automáticos prohibidos —telemetría, Marketplace, actualización y descarga LLM— de las URLs de compatibilidad o acciones explícitas —licencia, reporte, webview, servidor remoto o proveedor elegido—. El arranque debe seguir sin conexiones externas y el smoke dinámico lo comprueba.
- Manifiesto actual de Napo: 33.214 archivos, digest `3185803cd38cf6679148137d4d875f443c746da8738b701655e51311ad217102`.

### Estado canónico posterior — 2026-10-13

- La reproducibilidad del ASAR quedó cerrada: `build/lib/asar.ts` ordena las entradas antes de insertarlas, evitando diferencias por concurrencia de streams. Dos reconstrucciones consecutivas produjeron el mismo `node_modules.asar` (`e62a956abb8f0a7ca863024d2ae3bfbb64ef22f7cdfccf26ece809b51ad5115a`).
- El manifiesto canónico vigente es `reports/napo-release-manifest.json`: 32.903 archivos y digest `341d14e7363abd702ec1d6a93fc2357f56eb863e99a6e82a7d7f8d65697eecfb`. La evidencia UI y el expediente legal ya están ligados a ese digest.
- La compuerta técnica integral pasa con R, Python, Quarto, privacidad dinámica, recuperación, conocimiento, arranque y contratos. Los repositorios RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode continúan intactos.
- Distribución pública sigue cerrada: 30 revisiones legales humanas pendientes, firma `development-only`, notarización y canal aún no resueltos. `debug-server-ready` y `make` no forman parte del artefacto vigente.

### Reducción final validada — 2026-10-13

- `vscode.debug-server-ready` no forma parte del artefacto actual. Su retiro se probó primero en un clon reversible: `validate-napo.mjs --require-runtime` y `smoke-napo-runtime.mjs` pasaron.
- El paquete vigente contiene 59 extensiones: 46 conservadas y 13 bajo revisión; no se retiró Capibara, Quarto ni ninguna extensión de análisis de datos.
- El smoke de arranque ahora filtra por la presencia física del manifiesto en el paquete para no reutilizar inventarios obsoletos; la corrida final observa 13 extensiones y 0 errores.
- `vscode.make`, `vscode.javascript` y `vscode.html` también fueron retiradas mediante reducciones reversibles que pasaron validación y smoke; sus fuentes permanecen intactas.
- El manifiesto vigente queda en 32.903 archivos con digest `341d14e7363abd702ec1d6a93fc2357f56eb863e99a6e82a7d7f8d65697eecfb`. La revisión legal continúa con 30 casos pendientes.

### Cobertura funcional reconciliada — 2026-10-13

- Se incorporó `scripts/audit-napo-extension-functional-coverage.mjs` a la compuerta integral.
- Las 13 extensiones clasificadas como `requiere-prueba` tienen presencia física en el artefacto, evidencia UI `pass` ligada al digest vigente, contrato sin errores y arranque sin errores.
- El informe es `reports/napo-extension-functional-coverage.json`. Conserva la limitación de que la UI es evidencia manual y no equivale a automatizar todos los comandos y vistas.
- No se reclasifica ni se retira ninguna extensión por esta evidencia; Capibara, Quarto y las extensiones de datos permanecen intactas.

### Gobernanza de raíces de conocimiento — 2026-10-13

- `scripts/audit-napo-knowledge-bundle.mjs` audita todos los manifiestos laterales `*.source.json` de una raíz local, valida hashes y rutas, detecta identidades duplicadas y ofrece `--require-approved`.
- La prueba `test-napo-knowledge-governance` confirma que una fuente pendiente puede rastrearse, pero no puede usarse como base aprobada de planificación.
- El auditor es local y determinista: no sigue `sourceUri`, no descarga fuentes, no infiere autoridad o licencia y no sustituye la revisión institucional.

### Expediente legal ligado a la compuerta — 2026-10-13

- `validate-napo-gate` regenera el paquete de revisión legal después del inventario y lo liga al manifiesto de release vigente.
- El expediente actual conserva 30 casos: 28 sin declaración ni archivo local, 1 referencia a archivo ausente y 1 archivo local sin declaración. Cada caso incluye candidatos de procedencia y checklist; las decisiones permanecen vacías hasta revisión humana.
- La compuerta técnica pasa, pero la distribución sigue bloqueada por la cola legal y la firma `development-only`.

### Matriz de cumplimiento — 2026-10-13

- `MATRIZ_CUMPLIMIENTO_NAPO.md` es el resumen requisito→evidencia del corte actual. No sustituye los reportes ni las pruebas, pero evita confundir históricos con el estado vigente.
- El cumplimiento técnico está separado de cobertura manual, revisión institucional de conocimiento, revisión legal, firma, notarización y canal de distribución.

### Revisión del receptor y rebuild vigente — 2026-10-13

- La revisión propia del host quedó concentrada en `src/vs/workbench/contrib/webviewView/browser/webviewViewPane.ts`; Capibara y las extensiones de datos no fueron modificadas.
- La recuperación de `capibara.SidebarProvider` ante errores fatales permite un intento acotado. La recarga posterior a `cancelTask` es idempotente y cancela su temporizador al disponer la vista.
- La activación espera el workspace completo si el host tiene estado de trabajo sin carpetas visibles, evitando la carrera de inicialización contra la raíz incorrecta.
- El artefacto macOS arm64 fue reconstruido con `core-ci` y `vscode-darwin-arm64-min-ci`. El manifiesto vigente registra 32.898 archivos y digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.
- `validate-napo-gate` pasa `ACEPTADA (desarrollo técnico)`; los repositorios fuente siguen intactos, la evidencia UI quedó ligada al nuevo digest, y la distribución continúa bloqueada por 30 revisiones legales humanas y firma `development-only`.

### Ciclo de vida de recuperación del receptor — 2026-10-13

- La revisión detectó que una instancia de webview que fallaba podía dejar las banderas de recuperación activas al disponer la vista.
- El host ahora limpia esas banderas al disponer `capibara.SidebarProvider`, de modo que una activación posterior recibe un intento de recuperación nuevo y no hereda el estado de la instancia anterior.
- `typecheck-client`, `core-ci`, el empaquetado macOS arm64 y la compuerta técnica pasan después del cambio. El digest actual es `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.
- `npm run test:positron` pasa: 415 archivos, 4.946 pruebas aprobadas, 3 expected-fail y 21 omitidas; el source map ausente de DOMPurify solo produce un aviso de Vite.

### Diagnóstico de sesión R en ventana persistente — 2026-10-13

- La ventana gráfica encontrada llevaba un proceso Napo iniciado antes del rebuild vigente y usaba un perfil persistente; mostró timeout al crear la sesión R.
- El paquete limpio sigue validado por el smoke de R/Python/Quarto, el arranque de extensiones sin errores y la compuerta completa. El timeout observado no se considera regresión del artefacto.
- Las próximas pruebas manuales de UI deben usar un perfil y workspace temporales y una instancia iniciada después del rebuild.

### Cobertura legal mecánica ampliada — 2026-10-13

- La auditoría del paquete encontró avisos `ThirdPartyNotices*` que no entraban en el inventario por el patrón de nombres anterior.
- Se amplió el reconocimiento en los dos auditores legales de Napo; no se alteraron manifiestos, Capibara, extensiones de datos ni repositorios fuente.
- El inventario actual registra 64 manifiestos y 38 archivos legales con hash. Los 30 casos de revisión humana permanecen intactos: 28 sin declaración/archivo local detectable, 1 referencia a archivo ausente y 1 archivo local sin declaración.
- Esta mejora es de trazabilidad, no una decisión jurídica: no infiere licencias ni permite distribución pública sin revisión humana.

### Contrato de conocimiento endurecido — 2026-10-13

- `validate-napo-knowledge-source.mjs` exige ahora `schemaVersion: 1` y rechaza versiones ausentes o desconocidas.
- `test-napo-knowledge-governance.mjs` prueba también que una raíz con dos manifiestos de la misma identidad `id/version/jurisdiction` falla, incluso antes de usar `--require-approved`.
- La compuerta posterior conserva el digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`, Capibara completa, 59 extensiones, Quarto y fuentes en solo lectura.
- Esto cierra una ambigüedad del receptor, no una revisión institucional: todavía hacen falta fuentes reales entregadas por una institución y su aprobación humana.

### Transferencia segura al workspace — 2026-10-13

- `scripts/prepare-napo-knowledge-bundle.mjs` materializa únicamente fuentes aprobadas y verificadas hacia `Docs/`, que es la raíz local que Capibara usa para conocimiento de proyecto.
- Exige `--require-approved`, separa dry-run de `--apply`, conserva los manifiestos laterales, escribe un recibo `.napo/knowledge/materialization.json`, es idempotente y rechaza colisiones o destinos que escapen mediante symlink sin sobrescribir.
- La prueba `test-napo-knowledge-materialization` cubre dry-run, aplicación, idempotencia, fuente pendiente, colisión y symlink; la compuerta completa pasa. No se sigue `sourceUri`, no se descarga contenido, no se modifica Capibara y no se escriben repositorios fuente.
- La siguiente evidencia fuerte requiere una raíz institucional real, con revisión humana documentada; el fixture de pruebas no es una fuente legal.

### Planificación desde bundle materializado — 2026-10-13

- `test-napo-materialized-planning.mjs` integra la transferencia aprobada hacia `Docs/` con una lectura real de `Rscript` y conserva `reports/napo-materialized-planning.json`.
- El marcador `NAPO_MATERIALIZED_PLANNING_OK` confirma la lectura de `TEST-MATERIALIZED-PLANNING@2026.01` y el cálculo reproducible de la brecha 20.
- La compuerta completa pasa después de incluir este smoke. Sigue siendo un fixture no legal: no prueba autoridad institucional ni sustituye la ruta UI Capibara.

### Estado transaccional del materializador — 2026-10-13

- El materializador produce `ready` en dry-run y solo escribe `applied` después de terminar copias, recibo y reporte final; ante error deja `fail` con el detalle.
- El recibo y el reporte ahora conservan metadatos de procedencia de la fuente aprobada: autoridad, fecha efectiva, revisión humana, responsable y referencia de licencia.
- `test-napo-knowledge-materialization` y la compuerta integral pasan; el digest vigente permanece `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.
- Los reportes y el recibo se escriben con reemplazo atómico; la prueba verifica que el resultado y el recibo confirmen el mismo estado `applied` y preserven la autoridad y revisión de la fuente.
- El gate integral posterior conserva la aceptación técnica y la verificación de solo-lectura de las cinco fuentes.

### Dependencias runtime declaradas — 2026-10-13

- Napo.app contiene árboles `node_modules` necesarios para Git, drivers/servidores Positron y `rhs-okf` de Capibara; no deben eliminarse como si fueran residuos porque sostienen funciones integradas.
- `validate-napo.mjs` ahora enumera explícitamente esas raíces permitidas y rechaza cualquier raíz nueva no declarada dentro de `extensions/`. La política controla procedencia y superficie sin romper Capibara completa ni las extensiones de datos.
- La compuerta posterior pasa y conserva el digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.

### Salud del código del destino — 2026-10-13

- `typecheck-client` pasa.
- `test:positron` pasa con 415 archivos, 4.946 pruebas aprobadas, 3 expected-fail y 21 omitidas.
- Queda registrado solo el aviso conocido de source map ausente de DOMPurify y una advertencia deprecada de Node; no son fallos de Napo.

### Informe de dependencias runtime — 2026-10-13

- La política compartida está en `scripts/napo-extension-dependency-policy.mjs` y el informe en `reports/napo-extension-dependency-roots.json`.
- El artefacto actual tiene 15 raíces runtime de extensiones permitidas y ninguna raíz no declarada; la auditoría se ejecuta dentro del gate.
- El digest vigente permanece `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.

### Revalidación gráfica limpia — 2026-10-13

- Una instancia directa de `Napo.app` arm64, con perfil y workspace temporales, abrió correctamente después de recargar una vez por un aviso inicial de sincronización de extensiones.
- La UI observada mostró `RHS-Agent v4.0.0`, `Workspace · Sensibles`, R 4.5.3 disponible y Quarto 1.10.18 empaquetado.
- Python fue parcial en la UI porque el descubrimiento eligió `/opt/homebrew/bin/python3` sin `ipykernel`; la interfaz ofreció instalarlo y la prueba no hizo cambios. El gate CLI sigue validando Python/Jupyter con `/usr/local/bin/python3` 3.13.3 preparado.
- Evidencia: `reports/napo-clean-ui-revalidation.json` y `screenshots/2026-10-13-clean-ui/napo-rhs-agent.png`; digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.

### Cachés Python generados por la UI — 2026-10-13

- Al abrir Capibara en la aplicación empaquetada aparecieron 297 archivos `.pyc` bajo sus 48 directorios `__pycache__`; son artefactos volátiles del intérprete y no una modificación de los repositorios fuente.
- `scripts/napo-release-manifest.mjs` ahora excluye esos cachés del conteo y del digest para que una ejecución normal no invalide la identidad del release. Se limpiaron solo los cachés generados del paquete.
- El gate completo, la verificación del manifiesto y la auditoría de solo-lectura pasan con el digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.

### Prueba del manifiesto frente a cachés volátiles — 2026-10-13

- `scripts/test-napo-release-manifest.mjs` demuestra con un paquete temporal que `.pyc` y `__pycache__` creados después del empaquetado no invalidan el manifiesto ni ocultan entradas estables.
- La prueba forma parte de `validate-napo-gate`; el gate completo, `typecheck-client`, `verify-napo-release` y la auditoría de fuentes permanecen verdes.

### Auditoría ejecutable de cierre — 2026-10-13

- `scripts/audit-napo-completion.mjs` genera `reports/napo-completion-audit.json` y comprueba identidad, privacidad, Capibara, extensiones de datos, Quarto, runtimes, coordinación analítica, dependencias, higiene, manifiesto y solo-lectura.
- Estado actual: `technical-accepted-with-external-gates`, con 14 pases técnicos, 0 fallos y 3 puertas externas pendientes. La auditoría forma parte de `validate-napo-gate`.
- Las entradas concretas para esas tres puertas están en `ENTRADAS_PENDIENTES_NAPO.md`; no se deben inventar decisiones legales, certificados, credenciales ni fuentes institucionales.

### Actualizaciones manuales verificables — 2026-10-13

- `scripts/verify-napo-update-candidate.mjs` valida candidatos locales sin red ni instalación: identidad, versión posterior, telemetría, endpoints y digest; con `--require-distribution` exige firma macOS.
- `scripts/test-napo-update-candidate.mjs` cubre aceptación de candidato válido y rechazo de candidato con telemetría; está integrado en el gate.

### Salud posterior al endurecimiento — 2026-10-13

- `npm run test:positron` vuelve a pasar con 415 archivos, 4.946 pruebas aprobadas, 3 expected-fail y 21 omitidas.
- Las pruebas del manifiesto, candidato de actualización, solo-lectura y `git diff --check` también pasan; solo permanecen los avisos conocidos de DOMPurify/Node.

### Estructura mínima de candidatos — 2026-10-13

- `verify-napo-update-candidate.mjs` exige ahora Capibara `rhs-agent4@4.0.0` con runtime y Quarto dentro del candidato, además de identidad, privacidad, versión y digest.
- La prueba correspondiente rechaza tanto telemetría activa como estructura incompleta.

### Reconciliación del estado de cierre — 2026-10-13

- `AUDITORIA_CIERRE_NAPO.md` ahora coincide con `reports/napo-completion-audit.json`: la cobertura funcional 13/13 está cerrada técnicamente y no se presenta como una puerta pendiente.
- Las tres puertas restantes son revisión legal humana; firma/sellado/notarización de distribución macOS; y una fuente institucional real de conocimiento con revisión humana. El canal manual ya está decidido y protegido por la auditoría de cierre.
- El cambio solo corrige el registro de estado; no modifica el paquete ni los repositorios fuente.

### Canal manual de actualización — 2026-10-13

- El canal de Napo está decidido: transferencia manual y explícita del artefacto completo, manifiesto, hash y firma, seguida de verificación local y rollback conservador.
- No hay descubrimiento, consulta, descarga ni instalación automática. La build `development-only` solo es válida para desarrollo, pruebas o distribución interna.
- La firma, el sellado y la notarización macOS siguen siendo la puerta externa de distribución; el canal ya no es una decisión pendiente.

### Evidencia precisa de firma macOS — 2026-10-13

- `audit-napo-macos-signature.mjs` ahora recoge ambos canales de salida de `codesign` y `spctl`; el reporte identifica la firma real como `adhoc` y el equipo como `not set`.
- El estado sigue siendo `development-only` y la puerta de distribución continúa bloqueada correctamente. Solo se corrigió la precisión del reporte.
- `test-napo-macos-signature.mjs` quedó integrado en la compuerta para evitar regresiones del reporte y acepta tanto builds de desarrollo como futuras builds distribuidas.

### Registro durable de revisión legal — 2026-10-13

- Las decisiones humanas ya no se pierden cuando se regenera el expediente: viven en `reports/napo-license-decisions.json`, con `caseId`, digest, decisión, revisor, fecha y fundamento.
- El inventario y el expediente rechazan registros de otro digest; `--require-distribution` solo acepta todos los casos `approved`.
- La prueba `test-napo-license-review-decisions.mjs` cubre registro vacío, parcial, completo, incompleto y obsoleto; no modifica manifiestos ni repositorios fuente.

### Revalidación técnica completa — 2026-10-13

- La compuerta completa volvió a terminar `ACEPTADA (desarrollo técnico)`: 14 requisitos técnicos, 0 fallos y 3 puertas externas pendientes.
- La auditoría fresca conserva el digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`; el manifiesto canónico verifica 32.898 archivos y la auditoría de solo lectura confirma sin cambios RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode.
- La variante `--require-distribution` sigue bloqueando de forma intencional por 30 decisiones legales humanas pendientes. Las otras puertas externas siguen siendo firma/sellado/notarización macOS y una fuente institucional real aprobada.
- La verificación adicional del destino también pasó: `npm run typecheck-client` código 0 y `npm run test:positron` con 415 archivos, 4.946 pruebas aprobadas, 3 expected-fail y 21 omitidas. Solo se observaron los avisos conocidos de mapa de fuentes DOMPurify y deprecación de Node.
- La auditoría `audit-napo-completion.mjs --require-complete` fue probada en modo estricto y rechazó correctamente el estado actual con código 1: 14 pases técnicos, 0 fallos y 3 puertas externas pendientes.

### Tipado de pruebas Positron — 2026-10-13

- `vitest.tsconfig.json` ahora incluye `src/vs/**/*.d.ts`, lo que corrige la omisión de declaraciones globales del host y elimina los falsos errores ambientales de `monaco` y `DebugProtocol`.
- `npm run test:positron:check-ts` todavía reporta 182 errores en 40 archivos de tests heredados; ninguno se encuentra en archivos modificados por Napo. No se ocultaron mediante exclusiones o relajación del compilador.
- La ejecución de Vitest sigue pasando con 4.946 pruebas aprobadas, 3 expected-fail y 21 omitidas; el problema queda separado como deuda de tipado upstream y no como fallo funcional del paquete.

### Compuerta posterior a la configuración de tests — 2026-10-13

- La compuerta técnica volvió a pasar después del cambio de `vitest.tsconfig.json`: 14 requisitos técnicos, 0 fallos y 3 puertas externas.
- El artefacto mantiene el digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`, Capibara completa, Quarto, 0 diferencias funcionales en extensiones de datos y fuentes de solo lectura.

### Clasificador de tipado de tests — 2026-10-13

- `scripts/audit-napo-positron-typecheck.mjs` genera `reports/napo-positron-typecheck.json` y quedó integrado en `validate-napo-gate`.
- Ejecuta el compilador real y falla si algún diagnóstico invade archivos modificados por Napo. El estado actual es `upstream-debt`: 182 diagnósticos en 40 archivos heredados, intersección Napo 0.
- La deuda permanece visible y separada del runtime; no se oculta mediante exclusiones ni relajación de TypeScript.
- El clasificador considera ahora cambios unstaged, staged y `untracked`, cubriendo también archivos nuevos del destino antes de versionarlos; la intersección actual continúa en 0.

### Compuerta final del clasificador — 2026-10-13

- La compuerta técnica completa pasó después del endurecimiento: 14 requisitos técnicos, 0 fallos y 3 puertas externas.
- El reporte TypeScript conserva `upstream-debt` en archivos heredados, pero 0 diagnósticos intersectan cualquier cambio modified/staged/untracked de Napo.

### README canónico — 2026-10-13

- `README.md` fue reconciliado con la política vigente: el canal manual está decidido, la distribución pública sigue bloqueada por las puertas externas y el tipado heredado se reporta explícitamente como deuda, no como verde.

### Compilación reproducible posterior — 2026-10-13

- `npm run build-fast` y `npm run compile-extensions-build` pasaron. El flujo compiló el cliente, las extensiones de datos, Positron Python/R, Capibara y los binarios runtime necesarios.
- La verificación posterior confirmó fuentes sin cambios, `git diff --check` limpio y manifiesto canónico válido con digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.

## Actualización vigente — 2026-10-13

- Se corrigió en el host la resolución de bundles locales de localización para extensiones built-in. El host verifica `l10n/bundle.l10n.<idioma>.json` antes de entregarlo al extension host; no se modificaron manifiestos ni código de las extensiones Positron/datos. La prueba focal pasa 4/4.
- El artefacto canónico macOS arm64 fue reconstruido con el cambio del receptor. Digest vigente: `db0ee2a197e7ffd91c4a2a332a2d7dce0320e39b4d3089cc360510ace7f9ec9e`; `typecheck-client`, solo-lectura de las cinco fuentes, manifiesto y gate completo pasan. Estado: `technical-accepted-with-external-gates`, 14/14 pases técnicos, 0 fallos, 3 puertas externas.
- La evidencia UI manual quedó revalidada contra el digest `db0ee2a197e7ffd91c4a2a332a2d7dce0320e39b4d3089cc360510ace7f9ec9e`; no reutilizar evidencia para otro artefacto sin volver a ligar el digest.
- Después se clasificó como ausencia normal el caso de built-ins sin `l10n` ni bundle disponible; los bundles declarados que fallan siguen siendo errores. La prueba focalizada quedó en 5/5 y el digest actual es `cf7fde539d2c23bf85bb8b92bfff00e9c1673ef664fd52345e2859792aadd572`.
- Smoke adicional del paquete real en español: `Napo.app --locale=es` con perfil limpio produjo 0 errores `No bundle location found` y 0 `Failed to load translations`.

### Reconciliación del conteo del manifiesto — 2026-10-13

- La lectura directa del manifiesto vigente confirmó 32.903 archivos para el digest `cf7fde539d2c23bf85bb8b92bfff00e9c1673ef664fd52345e2859792aadd572`.
- Las referencias vigentes a 32.898 eran restos documentales de una reconstrucción anterior; se corrigieron en README, la auditoría de cierre, la matriz del host y el plan. Los registros históricos permanecen identificados como históricos.
- No cambió el artefacto. La evidencia autoritativa sigue siendo el manifiesto verificado, el gate, la auditoría de fuentes y la UI ligada al mismo digest.

### Auditoría permanente de consistencia documental — 2026-10-13

- `scripts/audit-napo-document-consistency.mjs` deriva el conteo y digest desde el manifiesto, comprueba README, auditoría, matrices y plan, y no confunde addenda históricos con el estado vigente.
- El auditor está integrado en `validate-napo-gate`; su reporte actual es `reports/napo-document-consistency.json` y pasa contra el digest `cf7fde539d2c23bf85bb8b92bfff00e9c1673ef664fd52345e2859792aadd572`.

### Reconciliación del inventario legal vigente — 2026-10-13

- La corrida fresca del gate registra 64 manifiestos de extensiones, 40 archivos legales con hash y 30 casos pendientes de revisión humana.
- Las referencias vigentes que indicaban 38 fueron corregidas en la auditoría de cierre y la matriz de cumplimiento; los valores de cortes anteriores no se usan como estado actual.

### Perfil de superficie reconciliado — 2026-10-13

- `PERFIL_NAPO_MINIMAL.md` ya describe el paquete vigente: 59 extensiones, 46 conservadas y 13 bajo prueba específica, con el digest actual.
- El auditor documental vigila también ese perfil para evitar que una clasificación histórica de superficie se presente como la decisión vigente.

### Búsqueda de fuente institucional real — 2026-10-13

- La búsqueda controlada del destino no encontró manifiestos laterales `*.source.json` ni una raíz institucional o normativa real fuera de reportes, fixtures y código interno.
- La puerta de conocimiento institucional sigue pendiente de un insumo externo revisado; no se infirió autoridad ni se promovió ningún fixture a fuente legal.

### Suite ejecutable y typecheck del destino — 2026-10-13

- `typecheck-client` pasó con código 0.
- `test:positron` pasó con 415 archivos, 4.949 pruebas aprobadas, 3 expected-fail y 21 omitidas.
- Los avisos de DOMPurify/Node siguen siendo no bloqueantes; la deuda de tipado de tests permanece clasificada por separado como `upstream-debt`.

### Auditoría de cierre ampliada — 2026-10-13

- `audit-napo-completion.mjs` incluye ahora consistencia documental y evidencia fresca de `typecheck-client`/`test:positron` mediante `reports/napo-destination-tests.json`.
- El corte vigente registra 16 requisitos técnicos aprobados, 0 fallos y 3 puertas externas pendientes.

### Corrección documental posterior al cierre — 2026-10-13

- `ENTRADAS_PENDIENTES_NAPO.md` fue corregido: su referencia vigente pasa de 14 a 16 requisitos técnicos.
- La revalidación posterior conserva 7 documentos canónicos consistentes, 16 requisitos técnicos aprobados, 0 fallos y 3 puertas externas pendientes.
- No se modificó el artefacto Napo ni ninguno de los cinco repositorios fuente.

### Recompilación rápida del destino — 2026-10-13

- `npm run build-fast` pasó al recompilar el cliente y las extensiones del destino, incluyendo Positron Python/R y Capibara.
- El manifiesto canónico mantuvo 32.903 archivos y el digest `cf7fde539d2c23bf85bb8b92bfff00e9c1673ef664fd52345e2859792aadd572`.
- La auditoría de fuentes en solo lectura y `git diff --check` pasaron después de la compilación.

### Auditoría legal incluida en la consistencia documental — 2026-10-13

- `AUDITORIA_LEGAL_NAPO.md` fue reconciliada con el corte vigente: 64 manifiestos, 40 archivos legales con hash, 30 casos pendientes y 32.903 archivos en el manifiesto de release.
- La auditoría documental ahora vigila 8 documentos canónicos y comprueba el conteo legal contra `reports/napo-license-inventory-package.json`.
- El cierre regenerado sigue en `technical-accepted-with-external-gates`: 16 pases técnicos, 0 fallos y 3 puertas externas pendientes.

### Compuerta integral posterior a la vigilancia legal — 2026-10-13

- La compuerta completa volvió a terminar `ACEPTADA (desarrollo técnico)` después de incorporar la auditoría legal como documento vigilado.
- Arquitectura, runtime, privacidad, Capibara, extensiones de datos, cobertura funcional, manifiesto y consistencia documental pasaron; esta última quedó en 8/8.
- No se modificaron los cinco repositorios fuente. Las únicas puertas externas siguen siendo revisión legal humana, firma/notarización macOS y fuente institucional real.

### Prueba negativa de cierre estricto — 2026-10-13

- `audit-napo-completion --require-complete` terminó con código 1, como exige la política mientras existan puertas externas pendientes.
- El reporte conservó 16 pases técnicos, 0 fallos y 3 pendientes; la aceptación técnica no se presenta como release público.

### Precisión de la política de redistribución — 2026-10-13

- `QUE_CONSERVAR.md` fue ajustado para exigir cumplimiento de la licencia aplicable a cada componente, sin afirmar que todo Napo está bajo una única licencia de software libre.
- La redacción refleja la auditoría legal: núcleo Elastic License 2.0, Capibara Apache-2.0 y otros componentes MIT/Apache-2.0; la revisión humana sigue pendiente.

### Canal manual de macOS bajo riesgo — 2026-10-13

- El canal elegido para las primeras entregas es manual y explícito: artefacto completo, manifiesto, hash y autorización consciente del usuario si macOS advierte que la aplicación no está identificada por Apple.
- `adhoc/development-only` no se presenta como firma Apple; `--manual-risk` lo acepta solo para este canal. `--require-distribution` conserva la exigencia de firma, notarización y `spctl` para un release público futuro.
- La compuerta manual completa pasó con 17 requisitos, 0 fallos y 2 puertas externas: revisión legal humana y fuente institucional real de conocimiento.

### Decisión definitiva sobre la firma Apple — 2026-10-13

- Napo no requiere firma ni notarización de Apple. El canal operativo es distribución libre y manual: artefacto completo, manifiesto, hash y decisión consciente del usuario ante la advertencia de macOS.
- La firma Apple queda fuera de las puertas de cierre y no debe tratarse como bloqueo pendiente. `--require-distribution` solo diagnostica una ruta opcional identificada por Apple; `--manual-risk` se conserva como alias de compatibilidad.
- El estado canónico esperado para la compuerta predeterminada es `technical-accepted-with-external-gates`, con 17 pases, 0 fallos y 2 puertas externas: revisión legal humana y fuente institucional real de conocimiento.

## Compuerta posterior a contratos estáticos — 2026-10-12

- La compuerta consolidada pasó después de incorporar `audit-napo-extension-contracts.mjs`.
- El estado vigente sigue siendo `ACEPTADA (desarrollo técnico)`, no release distribuible: las pruebas UI específicas de las 21 extensiones, revisión legal, firma/notarización y canal siguen abiertas.

### Reorganización de artefactos y rutas de Napo — 2026-10-13

- El paquete ejecutable vigente está en `dist/Napo.app` dentro de `RHS-IA-Minimal`; la ruta externa `../VSCode-darwin-arm64/Napo.app` dejó de existir.
- Los defaults de scripts y documentos usan la ruta relativa `dist/Napo.app`. Los reportes regenerables deben tratarse como evidencia local, no como dependencias de ejecución del paquete.

## Corrección del arranque sin migración VS Code — 2026-10-13

- El aviso de importar configuraciones de VS Code provenía de la contribución `positronWelcome`: buscaba el `settings.json` de VS Code y llamaba a `promptImport()`.
- Napo lo desactiva declarativamente mediante `product.json` (`enableSettingsImport: false`) y el host respeta esa bandera antes de registrar acciones o consultar la configuración de VS Code.
- El artefacto reconstruido en `dist/Napo.app` arrancó con un perfil limpio sin el aviso; la compuerta completa pasó y los repositorios fuente de estudio permanecieron intactos.
- `extensions/rhs-agent4` es la copia integrada canónica de Capibara; `.build/extensions/rhs-agent4` es staging de construcción y se conserva para reconstruir/verificar.
- La compuerta posterior al traslado pasó con 17 pases, 0 fallos y 2 puertas externas; los repositorios fuente de estudio no fueron modificados.

## Arranque distribuido en Bienvenida — 2026-10-13

- El comportamiento anterior restauraba la última carpeta cuando Napo se abría sin argumentos.
- La solución está integrada en el host: `product.json` declara `openEmptyWindowOnStartup: true` y `app.ts` fuerza una ventana vacía solo en el arranque sin archivo/carpeta explícitos.
- La Bienvenida se muestra por la configuración predeterminada `workbench.startupEditor: welcomePage`.
- La prueba real con el paquete distribuido abrió antes una carpeta temporal y luego reinició Napo sin argumentos; el log confirmó `pathsToOpen [{}]` y apertura de Bienvenida, sin reabrir la carpeta.
- El paquete vigente está en `dist/Napo.app`; digest `854d501405b732561d935add79c2b529ba0efecec2bc925985a37eba5d888a01`.

## Corrección de paquete macOS y Open Folder — 2026-10-13

- La advertencia de aplicación dañada tenía una causa verificable en el artefacto: firma ad hoc incompleta, no un problema de la acción estándar de abrir carpetas.
- El build de Napo elimina ahora la firma exterior incompleta; la distribución manual queda marcada como `unsigned / not set`, coherente con la decisión de no usar firma Apple.
- La acción de Bienvenida se conserva como en Positron/VS Code: `workbench.action.files.openFolder` llama a `IFileDialogService.pickFolderAndOpen()` y al selector nativo.
- La compuerta posterior al rebuild pasó con 17 pases, 0 fallos y 2 pendientes externos. El paquete sigue en `dist/Napo.app` y los repositorios de estudio no fueron modificados.

## Firma ad hoc completa y lanzamiento — 2026-10-13

- El artefacto sin firma/firmado parcial no podía ser lanzado de forma fiable por `open`; la prueba aislada mostró que el binario arm64 sí funciona y que el bundle ad hoc completo permanece vivo.
- `build/gulpfile.vscode.ts` usa ahora `codesign --deep --force --sign -` para Napo en macOS. La firma es ad hoc, sin identidad Apple ni notarización, y solo hace coherente el sellado interno del paquete.
- `codesign --verify --deep --strict dist/Napo.app` pasa. `spctl` rechaza la aplicación por ausencia de firma Apple, como se espera bajo la política de distribución manual. La evidencia es `adhoc / not set`, estado `development-only`.
- `open -n ./dist/Napo.app` abrió una instancia nueva con código 0. La compuerta consolidada pasó con 17 pases, 0 fallos y 2 puertas externas; los repositorios fuente de estudio siguen sin cambios.

## Capibara no debe desaparecer al abrir un proyecto — 2026-10-13

- Causa confirmada: una carpeta recién creada se considera workspace no confiable. Capibara (`juliushearts.rhs-agent4`) no declara `capabilities.untrustedWorkspaces`, por lo que el host la deshabilitaba por requisito de confianza y ocultaba su vista.
- Corrección en Napo, no en Capibara: `product.json` incluye `extensionUntrustedWorkspaceSupport` con `override: true` para ese identificador. No desactiva la seguridad global del workspace y no modifica `extensions/rhs-agent4`.
- Paquete reconstruido y validado en `dist/Napo.app`; digest `cadf971739658f24f262437be9622c4b2290df835b925875717d1affe59e8d62`.
- Compuerta final: 17 pases, 0 fallos, 2 puertas externas (revisión legal humana y fuente institucional real de conocimiento). Capibara, su runtime y sus artefactos permanecen íntegros.

## Interfaz y proveedores de Capibara en Napo — 2026-10-13

- Si la vista de Capibara aparece vacía después de abrir una carpeta, revisar primero la invalidación del caché del sistema: Napo debe omitir solo la validación dinámica de sus extensiones incluidas para no confundir metadatos localizados con cambios en disco. No deshabilitar la validación de extensiones del usuario.
- La interfaz validada muestra `RHS-Agent v4.0.0` y los flujos `/build-okf` y `/pdfstruct`; el webview permanece después de la ventana de estabilidad del caché.
- Los proveedores empaquetados son relativos a `extensions/rhs-agent4/resources`: `pdfstruct`, `rhs-rag` y `rhs-okf/dist/cli.js`. OKF se invoca con el puente `app/bin/node`; el puente debe normalizar `process.argv` porque Electron run-as-node conserva la ruta de script de manera distinta a Node convencional.
- El host Napo fija `PYTHONDONTWRITEBYTECODE=1` para impedir que el runtime Python escriba `__pycache__` dentro del `.app`. Un paquete distribuido no debe mutarse tras arrancar ni perder la verificación ad hoc.
- Capibara sigue completa y sin alteración; el hash de `extension.js` integrado y empaquetado es `84ec6ba7fc5718e81fbed4674d151d8ea506163cdfb52f7824bf2fae76b12869`.
- Corte anterior de Capibara: `dist/Napo.app`, 32.904 archivos, digest `8b78f14926dbee74a3537345d9b165b55034f869ffe4ef732cfd085aefb2ca8a`; compuerta 17/17, 0 fallos, dos puertas externas.

## Capibara visible al arrancar con `open -n` — 2026-10-13

- `open -n ./dist/Napo.app` sí iniciaba Napo, pero una ventana vacía mostraba solo la Bienvenida y dejaba la vista de Capibara sin abrir.
- Se añadió una contribución exclusiva del host Napo en `src/vs/workbench/contrib/napo/browser/napoCapibara.contribution.ts`. Cuando el producto es Napo y el estado es `WorkbenchState.EMPTY`, espera el registro de `capibara.SidebarProvider` y abre esa vista; no modifica la extensión `rhs-agent4`.
- La Bienvenida se conserva en el editor central y no se abre ningún directorio. Si el usuario abre luego una carpeta o workspace, no se fuerza una nueva vista.
- Typecheck, reconstrucción macOS arm64, firma ad hoc coherente y prueba visual en perfil limpio pasaron. El manifiesto vigente es 32.904 archivos, digest `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`.

## Reinstalación de Capibara corregida — 2026-10-14

- La corrección relevante está en `rhs-agent4` commit `bf646a2`: refresca la configuración efectiva de autoaprobaciones en runtime sin reiniciar límites ni protecciones.
- Napo contiene ahora el artefacto construido corregido de Capibara (`extension.js` SHA-256 `b5840a1eeb6ef9c0b7f09a150e96c200b52c10707f4a9422795e9aacde3ed4dc`) y la capa RAG canónica completa: 914 archivos, 51 MB.
- La prueba aislada sobre `dist/Napo.app` pasó: 6 ejecuciones, 0 aprobaciones bloqueantes, 0 eventos de aprobación y 0 pendientes de runtime; se conservaron límites, protecciones, rechazo de acciones sensibles y cancelación.
- La firma ad hoc de `dist/Napo.app` pasó antes y después de la prueba. Manifiesto actual: `reports/napo-release-manifest.json`, árbol SHA-256 `3afac66832b8623d2ddde44a2c096d971eec40ea6e0e06c61a0213b84f140769`.
- Evidencia REA del artefacto empaquetado: `ev_2133907db96c076a2413a306ee0a5e3976ce6b42d525a971dcd2aa220b30bd08`. La pasada del paquete Electron completo excedió el límite de 300 s; la extensión específica sí fue analizada.

## Dogfood de Napo: país sintético y chats reales — 2026-10-13

- Fixture temporal: `/var/folders/wf/kdl2fxs175v75dr1pcpwv4jc0000gn/T/napo-country-planning-wgLhoi`; no pertenece a repositorios fuente.
- Tres chats reales pasaron sobre el mismo proyecto: R base, Python con gráfico y R con escenarios/Quarto.
- Resultado: base `0.615653`, inversión acelerada `0.751522`, delta `0.135869`, inversión `132 MUSD`, 6/6 regiones mejoradas.
- El cambio que eliminó las preguntas repetitivas fue de configuración del perfil: `capibara.permissions.approval=sensitive`, `capibara.autoApprove.write=true`, `capibara.autoApprove.execute=true`; lectura ya estaba activa. No es una modificación de repositorios ni de Capibara.
- En las tres tareas nuevas no hubo `approval_required`. Los eventos históricos siguen en `capibara-task-mv72j721-75tcmp`.
- Incidencias abiertas: falla inicial de `positron_execute_code` para Python con fallback exitoso a `python3` del sistema; Bienvenida muestra “R/Python no disponible” aunque el paquete contiene las extensiones y R inicia.
- Reporte completo: `reports/napo-dogfood-country-evaluation.json`.

## Instalador paralelo de Napo para macOS — 2026-10-14

- Napo se distribuye localmente como `dist/Napo-macOS-arm64.dmg`, generado por `scripts/package-napo-macos-installer.mjs` mediante `npm run package-napo-macos-installer`.
- El DMG es de arrastre a `Applications` y contiene `Napo.app` más el acceso directo a `/Applications`; no reemplaza ni renombra `/Applications/RHS-IA.app`.
- Identidad verificada: RHS-IA instalada `co.posit.positron`; Napo `org.rhsia.napo`, `napo`, `.napo` y `.napo-shared`. El DMG se montó en solo lectura, se inspeccionó y se desmontó correctamente.
- Artefacto probado: ARM64, firma ad hoc coherente (`codesign --verify --deep --strict`), arranque directo exitoso con `open -n`. No hay firma Apple ni notarización, de acuerdo con la política de distribución libre y aprobación manual del usuario.
- SHA-256 del instalador: `ab0dc917f5976fde9debfe585b1ed80b4147827d73290eaf481ca082fc180f97`; informe: `reports/napo-macos-installer.json`.

## 2026-10-15 - Regla vigente de identidad

- Nombre publico de la aplicacion: RHS-IA.
- Nombre publico del agente integrado: RHS-Agent.
- Napo y Capibara son nombres clave internos, no nombres para la interfaz, el instalador ni las respuestas del agente.
- El namespace tecnico `napo` se conserva deliberadamente para no romper gates del host, perfiles, contratos de extensiones y coexistencia de instalaciones.
- La correccion vive solamente en RHS-IA-Minimal. No editar los repositorios fuente de estudio.
- Verificado: `dist/RHS-IA.app`, `dist/RHS-IA-Preview-macOS-arm64.dmg`, producto visible RHS-IA, `defaultLocale=es`, telemetria desactivada, RHS-Agent completo y 11 pruebas de arranque/localizacion pasadas.
