# Auditoría de cierre técnico de Napo

**Nombre clave:** Napo  
**Destino:** `RHS-IA-Minimal`  
**Corte:** 2026-10-13
**Tipo:** estado canónico de implementación; no sustituye revisión legal

Este documento fija el estado que debe usar el equipo para continuar el trabajo. Las entradas anteriores de `BITACORA.md`, `MATRIZ_HOST_CAPIBARA.md`, `PERFIL_NAPO_MINIMAL.md` y `.memoria/CONTEXTO.md` que describen pruebas ya superadas se conservan como historia, pero quedan supersedidas por este corte.

La auditoría ejecutable requisito por requisito se genera con `npm run audit-napo-completion` y queda en `reports/napo-completion-audit.json`. Para la distribución manual libre, su resultado actual es `technical-accepted-with-external-gates`: 17 requisitos pasan, no hay fallos técnicos y permanecen dos puertas externas —revisión legal humana y fuente institucional real—. La firma Apple no es un requisito de Napo. La consistencia del expediente y las pruebas completas del destino se verifican dentro de la misma auditoría y la compuerta.

La política de actualizaciones ahora incluye un verificador offline de candidatos (`scripts/verify-napo-update-candidate.mjs`) y su prueba (`scripts/test-napo-update-candidate.mjs`); comprueba identidad, privacidad, versión, digest, Capibara 4.0.0 y Quarto. Ambos quedaron dentro de la compuerta técnica y no habilitan descargas ni instalaciones automáticas.

La matriz requisito-por-requisito está en `MATRIZ_CUMPLIMIENTO_NAPO.md`; este documento conserva el detalle técnico, los límites y las puertas de distribución.

Las entradas externas necesarias para cerrar esas puertas están descritas en `ENTRADAS_PENDIENTES_NAPO.md`; el documento no contiene credenciales ni decisiones inventadas.

## Resultado ejecutivo

Napo ya es una base técnica funcional de escritorio para análisis de datos. El receptor está construido sobre RHS-IA/Positron; Capibara (`rhs-agent4` 4.0.0) está integrada completa; las extensiones de análisis de datos se conservan sin alterar su código funcional; Quarto es permanente; y el paquete macOS arm64 pasa la puerta técnica consolidada.

La construcción actual no inventa un motor separado de modelación o simulación. Esas capacidades se ejecutan sobre R, Python, notebooks y Quarto, y Capibara las coordina. La coordinación local de planificación con fuente versionada ya está comprobada; ampliar conocimiento legal versionado y planificación institucional con revisión humana y gobernanza sigue siendo trabajo de producto posterior, tal como establece `PLAN_TRABAJO_RHS_IA_MINIMAL.md`.

## Estado verificable del artefacto

Artefacto auditado: `dist/Napo.app`

| Área | Estado actual | Evidencia |
|---|---|---|
| Identidad | `applicationName=napo`, `nameShort=Napo`, bundle `org.rhsia.napo` | `product.json`, validador de Napo |
| Arquitectura y contratos del host | Cuatro capas, contratos mínimos, matrices de transferencia y baseline de fuentes reconciliados | `reports/napo-architecture-audit.json`, `ARQUITECTURA_NAPO.md` |
| Capibara | Completa, versión 4.0.0, `main=./dist/extension.js` | `extensions/rhs-agent4`, `reports/napo-final-package-ui-evidence.json` |
| Extensiones de datos | 17 extensiones; 0 diferencias funcionales contra la transferencia efectiva de RHS-IA | `reports/napo-data-extension-integrity.json` |
| Capacidades analíticas y de planificación | 8 skills estratégicas presentes y con hash idéntico entre integración y paquete | `reports/napo-capability-surface.json` |
| Ejecución de modelación | R y Python ajustan modelos, simulan trayectorias, comparan escenarios y Quarto genera un informe reproducible | `reports/napo-modeling-smoke.json` |
| Coordinación Capibara–Positron | `positron_execute_code` ejecuta en una sesión R viva de Napo con aprobación visible, modelo, simulación y escenarios | `reports/napo-capibara-positron-e2e.json` |
| Sensibilidad desde Capibara | `positron_execute_code` evalúa tres shocks en la sesión R viva, conserva aprobación visible y muestra la tabla resultante | `reports/napo-capibara-sensitivity-e2e.json` |
| Planificación con fuente versionada | Capibara usa `positron_execute_code` con aprobación visible; la sesión R viva lee `Docs/planning-policy.md`, calcula la brecha y asigna recursos | `reports/napo-capibara-planning-e2e.json` |
| R | 4.5.3, sesión y render Quarto/R validados | `scripts/smoke-napo-runtime.mjs`, evidencia UI |
| Python | 3.13.3, `ipykernel`, archivo Python y celda Quarto/Python validados | evidencia `NAPO_PYTHON_UI_OK` |
| Quarto | 1.10.18, incluido, ejecutable y con previsualización | evidencia `NAPO_QUARTO_UI_OK` |
| Privacidad | 0 conexiones no locales durante arranque limpio | `reports/napo-privacy-smoke.json` |
| Telemetría | Prohibida y desactivada | `enableTelemetry=false`, validador |
| Marketplace y actualizaciones automáticas | Sin endpoints de galería, descarga o actualización | `product.json`, validador |
| Proveedores de Capibara | Conservados completos; uso solo por configuración y acción del usuario | manifiesto y E2E de Capibara |
| Superficie empaquetada | 59 extensiones: 46 conservar, 13 requieren prueba específica, 0 dependencias declaradas sin resolver; `debug-server-ready`, `make`, `javascript` y `html` fueron aplazadas tras pruebas reversibles | `reports/napo-extension-surface-package.json`, `reports/napo-reduction-debug-server-ready.json`, `reports/napo-reduction-make.json`, `reports/napo-reduction-javascript.json`, `reports/napo-reduction-html.json` |
| Licencias | 64 manifiestos, 40 archivos legales con hash, 30 entradas para revisión humana; expediente ligado al digest y con checklist por caso | `reports/napo-license-inventory-package.json`, `reports/napo-license-review-packet.json` |
| Release técnico | 32.904 archivos; digest de árbol `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e` | `reports/napo-release-manifest.json` |
| Consistencia documental | 8 documentos canónicos reconciliados con el digest, el conteo del manifiesto y el inventario legal; referencias antiguas solo dentro de secciones históricas | `reports/napo-document-consistency.json`, `scripts/audit-napo-document-consistency.mjs` |
| Compilación y pruebas del destino | `build-fast`, `compile-extensions-build`, `typecheck-client` y `test:positron` pasan; la suite ejecutable registra 415 archivos, 4.949 pruebas aprobadas, 3 expected-fail y 21 omitidas. El chequeo de tests se clasifica como `upstream-debt` con 182 diagnósticos en 40 archivos heredados y 0 en archivos modificados por Napo | `reports/napo-positron-typecheck.json`, `scripts/audit-napo-positron-typecheck.mjs` |
| Actualización y recuperación | Candidato válido aceptado, candidato con telemetría rechazado y rollback simulado restaurado | `reports/napo-update-recovery.json` |
| Gobernanza de conocimiento | Fuente pendiente trazable, hash cambiado detectado, fuente aprobada de prueba aceptada y auditoría de raíz normal/estricta | `reports/napo-knowledge-governance.json`, `scripts/audit-napo-knowledge-bundle.mjs` |
| Materialización y planificación versionada | Bundle aprobado transferido a `Docs/`, recibo conservado y lectura real desde `Rscript` con marcador reproducible | `reports/napo-materialized-planning.json`, `scripts/prepare-napo-knowledge-bundle.mjs` |
| Arranque de extensiones | 13 extensiones bajo revisión presentes en perfil limpio; 0 errores reales de activación; `debug-server-ready`, `make`, `javascript` y `html` no están en el artefacto | `reports/napo-extension-startup.json`, `reports/napo-reduction-debug-server-ready.json`, `reports/napo-reduction-make.json`, `reports/napo-reduction-javascript.json`, `reports/napo-reduction-html.json` |
| Contratos declarados de extensiones | 13 extensiones bajo revisión observadas; 0 errores y 4 advertencias explicadas por referencias opcionales del host/web | `reports/napo-extension-contracts-package.json` |
| Cobertura funcional de extensiones | 13/13 extensiones clasificadas como `requiere-prueba` tienen presencia física, UI `pass`, contrato sin errores y arranque sin errores | `reports/napo-extension-functional-coverage.json` |
| Evidencia UI funcional | 16 flujos manuales pass: documentación, navegador, visor, ocho lenguajes, preview Markdown, paquete de idioma español, render Mermaid, Auto Attach, resolución de conflictos y ejecución/preview local de aplicaciones; 1 observación partial de entorno Python por `ipykernel` ausente; evidencia ligada al digest vigente | `reports/napo-extension-ui-evidence.json` |
| Localización de extensiones integradas | El host busca y verifica el bundle local convencional antes de entregarlo al extension host; no se alteran manifiestos de extensiones Positron ni extensiones de datos | `src/vs/workbench/api/browser/mainThreadLocalization.ts`, `src/vs/workbench/api/common/extHostLocalizationService.ts` |
| Firma | La firma Apple no es requisito de la distribución manual libre; el estado `development-only` queda documentado como evidencia del artefacto | `reports/napo-macos-signature.json`, `POLITICA_NAPO.md` |

La prueba permanente `scripts/test-napo-release-manifest.mjs` verifica que cachés Python volátiles creados después del empaquetado no alteren el manifiesto ni oculten entradas estables; está integrada en `validate-napo-gate`.

## Puertas cerradas

- Integración completa de Capibara en el receptor Napo sin modificar el bundle de `rhs-agent4`.
- Conservación de las extensiones de análisis de datos sin alterar su código funcional.
- Inclusión permanente de Quarto, R, Python, notebooks, viewers y runtimes requeridos.
- Aprobaciones visibles, rechazo de escritura, procedencia de workspace, cancelación, historial y recuperación de la vista de Capibara.
- Construcción reproducible del binding nativo de `@vscode/policy-watcher` para macOS arm64.
- Smoke de runtime, privacidad, inventario de extensiones, integridad de datos, inventario legal y manifiesto verificable.
- Límite de conocimiento local endurecido: fechas calendario reales, manifiesto y contenido dentro de la raíz, rutas relativas, rechazo de traversal/symlink externo, archivo regular, hash exacto y aprobación humana separada.
- Repositorios fuente mantenidos en solo lectura; los cambios pertenecen únicamente a `RHS-IA-Minimal`.
- Transferencia comprobada de programación analítica, simulación, modelado predictivo, Quarto, informes, citas sustentadas, RAG/OKF y planificación institucional.
- Ejecución determinista comprobada para un modelo lineal, una simulación, una comparación de escenarios y un informe Quarto.
- Coordinación funcional comprobada desde la interfaz: Capibara solicitó `positron_execute_code`, Napo mostró la aprobación, y la sesión R viva produjo modelo, simulación, escenarios y evidencia observable.
- Análisis de sensibilidad comprobado desde la interfaz: tres shocks, tabla monotónica y pendiente aproximada de 100 en la sesión R viva, con aprobación y marcador verificable.
- Coordinación de planificación comprobada desde la interfaz: la sesión R 4.5.3 leyó una fuente local versionada (`EC-HWF`, `2026.01`, Ecuador), calculó una brecha de 20 y distribuyó 15 unidades a staffing y 5 a training, con aprobación y marcador verificable.

## Puertas todavía abiertas

Estas puertas no deben confundirse con fallos funcionales ya resueltos:

1. **Revisión legal humana:** confirmar los 30 manifiestos pendientes y las condiciones de binarios, dependencias transitivas, modelos, marcas y redistribución. La puerta `--require-distribution` ya bloquea automáticamente la publicación mientras esta cola no llegue a cero.
2. **Fuente institucional de conocimiento:** conectar fuentes reales al contrato de manifiesto, materializarlas mediante `prepare-napo-knowledge-bundle.mjs` y probar la planificación desde el workspace con revisión humana y gobernanza explícita. El receptor ya valida metadatos, hash, estado, duplicados, colisiones y transferencia local; la coordinación basada en una fuente versionada de prueba ya está comprobada, pero ninguna prueba declara validez legal ni reemplaza la revisión institucional.

La firma y notarización Apple quedan fuera del alcance de Napo. `--require-distribution` puede usarse como diagnóstico de una ruta opcional, pero no es una puerta pendiente ni una condición para la distribución manual libre.

La cobertura funcional de las 13 extensiones clasificadas como `requiere-prueba` ya está reconciliada y no es una puerta pendiente: `reports/napo-extension-functional-coverage.json` registra para cada una presencia física, un flujo UI `pass`, contrato sin errores y arranque sin errores. La clasificación conservadora de superficie se mantiene como control de reducción; no autoriza retirar componentes y la evidencia manual no pretende cubrir automáticamente todos sus comandos y vistas.

## Regla para la siguiente iteración

La siguiente implementación debe elegir una sola puerta abierta y producir evidencia nueva. No se debe modificar Capibara ni las extensiones de datos para resolver problemas del receptor. Cualquier cambio debe pasar por:

```sh
npm run validate-napo-gate -- --package dist/Napo.app
```

Para diagnosticar opcionalmente una ruta identificada por Apple:

```sh
npm run validate-napo-gate -- --package dist/Napo.app --require-distribution
```

El segundo comando puede fallar mientras el artefacto conserve firma ad hoc; esa falla solo describe la ruta opcional de Apple y no bloquea Napo.

## Addendum canónico — fallback de localización en el host — 2026-10-13

El receptor de localización se ajustó exclusivamente en `RHS-IA-Minimal`: cuando un bundle integrado no aparece en el paquete de idioma, el host consulta la extensión incorporada, verifica físicamente `l10n/bundle.l10n.<idioma>.json` y lo entrega como bundle local. Si el archivo no existe, no inventa una ruta utilizable. Esto elimina el falso `No bundle location found` de extensiones Positron que ya traen traducciones locales sin declarar `l10n`, sin modificar sus manifiestos ni su código funcional.

La prueba focalizada de `ExtHostLocalizationService` pasa 5/5 casos, incluido el fallback silencioso de built-ins sin traducción. Un arranque real de `Napo.app` con `--locale=es` y perfil limpio observó 0 errores `No bundle location found` o `Failed to load translations`. El artefacto macOS arm64 fue reconstruido con `npm run compile` y `npx gulp vscode-darwin-arm64`; `typecheck-client`, la auditoría de fuentes en solo lectura, el manifiesto y la compuerta completa pasan. El manifiesto vigente registra 32.904 archivos y digest `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`.

El resultado de la distribución manual libre es `technical-accepted-with-external-gates`: 17 pases, 0 fallos y dos puertas externas: revisión legal humana y fuente institucional real de conocimiento. La evidencia UI manual fue revalidada y ligada al nuevo digest; sus limitaciones permanecen declaradas. La firma y notarización Apple no son requisito de Napo.

## Addendum histórico de artefacto — 2026-10-13 (superado por el addendum canónico posterior)

La reconstrucción posterior a la auditoría de conocimiento detectó residuos de ejecución Python que entraban en el manifiesto: cachés del runtime de Capibara y de Jupyter/Quarto. Se corrigió el empaquetado del destino con exclusiones explícitas y el smoke ahora elimina únicamente `__pycache__` bajo el árbol de Napo después de detener la prueba. No se modificó ningún repositorio fuente ni el código funcional de Capibara o de las extensiones de análisis de datos.

El manifiesto vigente de `Napo.app` registra 32.927 archivos y digest `48d4f535ea42dd173a2fe753b6b28ada3c197a689444de18af677b7426c132c5`. `verify-napo-release` pasa, la evidencia UI está ligada a ese digest y el paquete queda sin `__pycache__` ni `.pyc`. La compuerta consolidada pasa como `ACEPTADA (desarrollo técnico)`; la condición sigue sin ser un release público mientras permanezcan pendientes la revisión legal humana, la firma/notarización, el canal y `debug-server-ready`.

La verificación adicional del destino pasa `typecheck-client` y `test:positron` (415 archivos, 4.946 pruebas aprobadas, 3 expected fail y 21 omitidas). El chequeo `test:positron:check-ts` conserva 182 diagnósticos heredados en 40 archivos no modificados por Napo; el clasificador `scripts/audit-napo-positron-typecheck.mjs` lo registra como `upstream-debt` y falla si algún diagnóstico invade archivos modificados por Napo. No se presenta como una comprobación TypeScript verde ni como una regresión de esta implementación.

La variante estricta `validate-napo-gate --require-distribution` fue ejecutada y rechazó el artefacto de forma preventiva en inventario legal por los 30 manifiestos pendientes. Esto confirma que Napo no puede presentarse como release distribuible antes de completar revisión humana, firma y notarización.

La causa técnica de la limitación `debug-server-ready` también quedó confirmada: el paquete incluye el receptor y `positron-python`, pero no incluye `ms-python.debugpy` ni un proveedor Node/js-debug. `positron-python` busca el API de `ms-python.debugpy` para iniciar el adaptador DAP. La decisión actual es conservar el receptor bajo revisión y no añadir proveedores externos sin una transferencia completa, inventario legal y aprobación explícita.

## Addendum histórico de privacidad empaquetada — 2026-10-13 (superado por el addendum canónico posterior)

La privacidad quedó reforzada en el límite del artefacto. El host mantiene `enableTelemetry=false` y el empaquetador elimina `aiKey` y cualquier `enableTelemetry=true` de las copias de manifiestos que entran en Napo. Esto no modifica RHS-IA, Positron, Capibara, rhs-agent3, rhs-agent4 ni vscode; tampoco altera el código funcional de las extensiones de datos.

`scripts/audit-napo-privacy-contract.mjs` inspecciona los 59 manifiestos del `.app`, junto con el producto, y pasa sin claves de instrumentación, galería, actualizaciones, descargas LLM ni telemetría declarativa activa. El smoke dinámico volvió a observar cero conexiones no locales durante el arranque. Las URLs de licencia, reporte, webview y servidor remoto se documentan como compatibilidad o acciones explícitas, no como servicios automáticos.

El manifiesto vigente registra 32.903 archivos y digest `341d14e7363abd702ec1d6a93fc2357f56eb863e99a6e82a7d7f8d65697eecfb`; `verify-napo-release`, la compuerta técnica y la evidencia UI ligada al digest pasan. La compuerta de distribución continúa bloqueada correctamente por 30 revisiones legales humanas pendientes y por la firma `development-only`.

## Addendum histórico — reproducibilidad y validación final — 2026-10-13 (superado por el corte vigente)

La reconstrucción final corrigió la última fuente de no determinismo: la concurrencia de streams en `build/lib/asar.ts` podía cambiar el orden de entradas de `node_modules.asar`. El empaquetador del destino ahora ordena las rutas antes de insertarlas. Dos reconstrucciones consecutivas generaron el mismo archivo ASAR, con SHA-256 `e62a956abb8f0a7ca863024d2ae3bfbb64ef22f7cdfccf26ece809b51ad5115a`.

El manifiesto vigente registra 32.903 archivos y digest `341d14e7363abd702ec1d6a93fc2357f56eb863e99a6e82a7d7f8d65697eecfb`; `verify-napo-release` pasa y la evidencia UI, el paquete de revisión legal y la compuerta apuntan al mismo digest. El artefacto no contiene `__pycache__`, `.pyc`, `.pyo` ni `*.stats.json` temporales.

La compuerta consolidada termina `ACEPTADA (desarrollo técnico)`. Pasan los ensayos de R, Python, Quarto, modelación, simulación, escenarios, privacidad sin conexiones no locales, actualización/rollback, gobernanza de conocimiento, arranque de 13 extensiones bajo revisión, contratos y evidencia UI. La revisión legal mantiene 30 casos pendientes; firma/notarización y canal de distribución siguen abiertos. No es un release público.

## Addendum canónico de cobertura funcional — 2026-10-13

Se incorporó `scripts/audit-napo-extension-functional-coverage.mjs` a `validate-napo-gate`. El informe `reports/napo-extension-functional-coverage.json` reconcilia las 13 extensiones clasificadas como `requiere-prueba`: todas están presentes en el artefacto, tienen una observación UI `pass` ligada al digest vigente, contrato sin errores y arranque sin errores. La evidencia UI permanece declarada como manual y no autoriza retirar extensiones.

La variante estricta `validate-napo-gate --require-distribution` también pasa esta cobertura y se bloquea después, en el inventario legal, por los 30 casos que requieren revisión humana. La firma continúa `development-only`; Napo no es todavía un release público.

## Addendum histórico de revisión del receptor — 2026-10-13 (superado por el corte vigente)

La revisión focalizada del host confirmó que la integración propia de Napo está aislada en el destino: `WebviewViewPane` limita la recuperación de errores fatales y la recuperación posterior a `cancelTask` a `capibara.SidebarProvider`, sin modificar Capibara. La recarga por cancelación quedó idempotente para no programar varias recargas ante mensajes repetidos. La activación espera la resolución del workspace cuando existe estado de trabajo pero aún no hay carpetas, evitando que el proveedor se inicialice contra una raíz incorrecta.

El paquete fue reconstruido mediante `core-ci` y `vscode-darwin-arm64-min-ci`; `typecheck-client` y el empaquetado pasan. El manifiesto vigente registra 32.898 archivos y digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`. La compuerta completa vuelve a `ACEPTADA (desarrollo técnico)`: 13/13 extensiones bajo revisión con cobertura funcional, cero errores de arranque, cero conexiones no locales observadas y cinco repositorios fuente sin cambios.

La evidencia UI existente fue ligada al nuevo digest con una nota explícita de revalidación por rebuild exclusivo del host y 0 diferencias funcionales en las extensiones. La distribución pública sigue bloqueada correctamente por 30 revisiones legales humanas y firma `development-only`.

## Addendum canónico — canal manual de actualización — 2026-10-13

La decisión de canal queda cerrada: Napo acepta únicamente candidatos entregados manualmente por una persona responsable, con artefacto completo, manifiesto y hash, antes de la verificación local y el rollback conservador. Napo no descubre, consulta ni descarga ese canal y no instala actualizaciones silenciosamente. Para la distribución manual libre permanecen la revisión legal humana y la fuente institucional real de conocimiento; la firma Apple no es un requisito de Napo.

## Addendum canónico — Capibara al abrir proyectos — 2026-10-13

El paquete vigente contiene 32.903 archivos y tiene el digest de árbol `cadf971739658f24f262437be9622c4b2290df835b925875717d1affe59e8d62`. Se corrigió en el host de Napo la transición a carpetas no confiables mediante `extensionUntrustedWorkspaceSupport` para `juliushearts.rhs-agent4`; Capibara conserva su manifest, runtime y comportamiento integrado sin alteraciones.

