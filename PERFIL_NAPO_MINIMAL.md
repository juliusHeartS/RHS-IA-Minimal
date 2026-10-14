# Perfil de superficie — Napo

**Estado:** perfil técnico vigente contra el paquete macOS arm64 generado el 2026-10-13  
**Regla:** este documento clasifica la superficie; no autoriza borrar extensiones ni modificar los repositorios fuente.

## Decisión de reducción

Napo debe conservar el host necesario para análisis, modelación, simulación y planificación asistida por Capibara. La reducción se hará en dos pasos:

1. ocultar o desactivar de forma reversible lo ajeno al flujo de datos;
2. retirar físicamente solo después de demostrar que no es dependencia de una extensión conservada, de Quarto, de Capibara o del empaquetado.

Capibara (`rhs-agent4`) y las extensiones de análisis de datos de RHS-IA/Positron no entran en la reducción: permanecen completas y sin alteración.

## Conservar como núcleo

### Host y trabajo local

- Electron, workbench, editor, documentos, explorador, búsqueda, diff, configuración, comandos y sistema de extensiones.
- Terminal integrado, Git y los bindings nativos que el host necesita.
- Markdown, JSON/YAML, shell, SQL y los formatos de configuración necesarios para proyectos, proveedores y reproducibilidad.
- Autenticación y gestión de credenciales únicamente para proveedores que Capibara puede utilizar y para operaciones explícitamente solicitadas.
- Language pack español incluido en el paquete.

### Análisis de datos y documentos

- `positron-r`, `positron-python`, `positron-reticulate`, `positron-environment`, `positron-environment-modules`, `positron-supervisor`, `positron-proxy` y `positron-file-transfer`.
- `positron-notebooks`, `positron-code-cells`, `positron-notebook-export`, `positron-ipywidgets`, `notebook-renderers` e `ipynb`.
- `positron-viewer`, `positron-pdf-server`, `positron-connections`, `positron-catalog-explorer`, `positron-duckdb` y los drivers de datos que Capibara pueda ver y utilizar.
- `rhs-ia-documentation` para documentación local y reproducible.
- Quarto como extensión de arranque (`quarto.quarto`) y CLI 1.10.18 incluido en el paquete.

### Agente

- `rhs-agent4`/Capibara completa, con vistas, comandos, proveedores, skills, runtimes, permisos, aprobaciones, cancelación, historial y procedencia.
- `authentication`/`positron.authentication` y los contratos del host que Capibara necesita para sus proveedores visibles.

## Conservar con condición verificable

Estos componentes no se eliminan mientras no termine su prueba de dependencia y utilidad:

- `positron-run-app` y `positron-runtime-debugger`: conservar porque sostienen la ejecución y depuración de aplicaciones analíticas locales.
- `microsoft-authentication`, `positron.next-edit-suggestions`, `positron-dev-containers` y `positron-skills`: aplazar; no forman parte del núcleo local de Capibara ni de las funciones R/Python/Quarto, y su reducción reversible ya pasó el validador y el smoke.
- `positron-data-driver-*`: conservar cada driver cuando exista un caso de uso, licencia, runtime nativo y prueba de conexión documentados.
- `open-remote-ssh`, `tunnel-forwarding` y `positron-file-transfer`: aplazar para el alcance local inicial, pero no retirarlos hasta demostrar que Capibara y los proyectos no dependen de ellos.
- `git-base`, `references-view`, `search-result`, `terminal-suggest`, `html`, `css`, `javascript`, `typescript-basics` y sus servicios: mantener mientras sean dependencias del workbench, webviews, documentación, notebooks o extensiones integradas.

## Aplazar o ocultar inicialmente

Son candidatos claros a una superficie mínima, sujetos a la prueba de dependencias:

- Lenguajes no relacionados con R, Python, Markdown, Quarto, SQL o configuración: C/C++, C#, Java, Go, Julia, Rust, Ruby, PHP, Perl, Dart, Swift, Visual Basic, F#, Groovy, Lua, Objective-C, HLSL, Razor, Pug, SCSS, Less y similares.
- Herramientas de desarrollo general que Napo no necesita para ejecutar análisis: `extension-editing`, `ms-vscode.js-debug`, `ms-vscode.js-debug-companion`, `ms-vscode.vscode-js-profile-table`, `debug-auto-launch`, `debug-server-ready`, `docker`, `npm`, `gulp`, `grunt`, `jake`, `open-remote-ssh` y túneles.
- Temas alternativos; conservar solo el tema base y la capacidad de cambiarlo si la interfaz o una extensión lo exige.
- Integraciones de publicación, sincronización o cuentas no necesarias para el análisis local.

Estos candidatos no se han eliminado del paquete actual. La decisión es deliberada porque el plan exige probar primero el receptor completo y mantener una ruta reversible.

## Lo que no debe formar parte del perfil

- Telemetría.
- Actualizaciones o comprobaciones automáticas de extensiones.
- Descarga automática de documentación LLM, RAG, modelos, runtimes o paquetes.
- Servicios externos obligatorios o tráfico oculto.
- Credenciales, cachés, `node_modules` de desarrollo o artefactos temporales.
- Alteraciones internas de Capibara o de las extensiones de datos conservadas.

## Puertas antes de retirar físicamente

No se retira una extensión hasta demostrar, con un perfil limpio y un paquete reconstruido, que:

1. no aparece en `extensionDependencies` ni en contratos de activación del núcleo conservado;
2. no es necesaria para R, Python, notebooks, Quarto, viewers, datos o Capibara;
3. no aporta un recurso nativo usado por el host o una extensión conservada;
4. no cambia permisos, autenticación, procedencia, cancelación o recuperación;
5. el paquete reducido pasa typecheck, pruebas, smoke test, validación de extensiones y pruebas funcionales de Napo;
6. la licencia, los avisos y la procedencia siguen siendo auditables.

## Evidencia actual

- El inventario actual del destino contiene 134 manifiestos de extensiones; los conteos anteriores de 127 pertenecen a un corte de empaquetado previo.
- Capibara está integrada completa y pasa las comprobaciones de integridad.
- R, Python, Quarto por CLI y los runtimes PET/Ark pasan las validaciones actuales.
- La dependencia `positron._vendor` necesaria para iniciar el kernel Python está transferida al destino y validada desde la interfaz: ejecución de archivo Python y celda Python de Quarto pasan en una instancia limpia.
- La reducción física queda aplazada hasta cerrar la sesión de terminal, las pruebas E2E de Capibara y la auditoría legal.
- El manifiesto vigente del paquete registra 32.904 archivos con digest `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`.

## Auditoría reproducible de superficie — 2026-10-13

`npm run audit-napo-extension-surface` genera `reports/napo-extension-surface.json` a partir de los manifiestos del destino. El corte actual registra 134 extensiones: 50 clasificadas como conservación, 38 como candidatas a aplazar y 46 que requieren prueba específica. No hay dependencias declaradas sin resolver en los manifiestos inspeccionados.

La clasificación es orientativa y reversible. Las extensiones Positron relacionadas con datos, runtimes, notebooks, conexiones, exploración, drivers y viewers quedan en conservación; las extensiones ajenas al flujo R/Python/Quarto aparecen como candidatas solo cuando la carpeta permite una primera señal. Las 38 candidatas no tienen dependientes declarados en este inventario, pero eso no descarta contratos implícitos del host. Ninguna extensión se elimina por este reporte.

El inventario histórico del artefacto `Napo.app` registró 126 manifiestos antes de la reducción aplicada. El paquete vigente registra 59 extensiones: 46 para conservar y 13 que requieren prueba específica. La reducción reversible de 23 candidatas y la reducción adicional de cuatro integraciones pasó el validador, el smoke de R/Python/Quarto y el arranque del host; el clon ejecutó R/Quarto desde la interfaz y Python 3.13.3 ejecutó `NAPO_PYTHON_UI_OK` en un perfil limpio. La evidencia adicional está en `reports/napo-reduction-auth-ai-remote-skills.json`. Las carpetas fuente permanecen para conservar reversibilidad.

## Estado aplicado del paquete — 2026-10-13

La reducción ya se aplicó únicamente a la lógica de empaquetado de Napo (`build/lib/extensions.ts`): las candidatas se excluyen del paquete distribuido, pero sus carpetas y fuentes permanecen en el destino para conservar reversibilidad. La nueva reducción de cuatro extensiones fue probada primero en un clon con enlaces duros y luego aplicada al paquete real. El paquete reconstruido vigente registra 59 extensiones: 46 conservadas y 13 que requieren prueba específica.

La reconstrucción, el validador con runtimes y el smoke pasan. La interfaz del paquete final inicia Python 3.13.3 aun con RHS-IA abierto, ejecuta `NAPO_PYTHON_UI_OK` y previsualiza un documento Quarto/Python con `NAPO_QUARTO_UI_OK`. La comprobación de coexistencia motivó una corrección del receptor en `src/vs/workbench/api/node/extensionHostProcess.ts`: solo el host de extensiones de Napo usa resolución IPv4-first, por lo que `PortFinder` y las extensiones Positron conservan su código original.

La evidencia concreta está en `reports/napo-final-package-ui-evidence.json`. El paquete final ejecutó desde la interfaz una celda Quarto/R con R 4.5.3 y produjo `NAPO_REDUCED_R_QUARTO_OK`; R y Quarto/R quedan validados tanto por UI como por CLI.

## Roles de superficie del paquete — 2026-10-12

El inventario del paquete anterior conservaba 67 extensiones: 46 conservar y 21 revisar por posible contrato del host o del producto. Las 23 que tenían recomendación estática de aplazamiento y las cuatro decisiones nuevas de autenticación/IA remota/contenedores/skills ya se retiraron del artefacto reconstruido después de pruebas reversibles; sus carpetas fuente permanecen intactas.

Las 23 candidatas que se retiraron del artefacto fueron:

- 9 recursos de lenguaje sin activación relacionados con CSS, dotenv, INI, LaTeX, logs, Make, reStructuredText, ShaderLab, Visual Basic y XML;
- 3 herramientas de depuración/profiling de JavaScript (`ms-vscode.js-debug`, `ms-vscode.js-debug-companion` y `ms-vscode.vscode-js-profile-table`);
- 11 temas visuales alternativos.

Las 17 restantes requerirán prueba específica porque pueden intervenir en el host: depuración automática, resolución de servidores, preview multimedia, conflictos de Git, Mermaid, ejecución de aplicaciones, documentación y navegador integrado, además de otros contratos aún no cerrados. La evidencia vigente se regenerará al reconstruir el paquete y quedará en `reports/napo-extension-surface-package.json`.

El smoke de arranque del paquete observó las 17 extensiones restantes sin errores reales de activación. Algunas se activaron durante el arranque y otras quedaron `not-triggered-resource`; esto demuestra que no rompen el arranque limpio, no que todas sus funciones estén probadas. La evidencia está en `reports/napo-extension-startup.json`. La reducción reversible está documentada en `reports/napo-deferred-23-reduction.json`, `reports/napo-deferred-23-startup.json` y `reports/napo-reduction-auth-ai-remote-skills.json`.

## Revalidación del flujo de workspace — 2026-10-13

El paquete vigente contiene 32.903 archivos y tiene el digest `cadf971739658f24f262437be9622c4b2290df835b925875717d1affe59e8d62`. Capibara permanece disponible al crear o abrir una carpeta de proyecto no confiable porque Napo declara el override de confianza para `juliushearts.rhs-agent4`; la extensión completa y las extensiones de análisis de datos permanecen sin alteración.
