# Bitácora — RHS-IA Minimal

Esta bitácora conserva hechos, decisiones y límites importantes. No sustituye al código fuente ni autoriza cambios por sí sola.

## 2026-10-12 — Decisión cerrada: proveedores completos y reducción de cuatro integraciones

- Capibara conserva completa la superficie de proveedores que ya expone; Napo no la vuelve a clasificar ni la recorta por razones de minimalismo.
- “Servicio externo” significa un destino opcional de una conexión elegida por la persona usuaria, no telemetría ni una dependencia obligatoria de Napo.
- Se aplazan del paquete inicial `microsoft-authentication`, `positron.next-edit-suggestions`, `positron-dev-containers` y `positron-skills`. No son necesarias para el núcleo local de Capibara, R, Python, datos o Quarto.
- `positron-run-app` permanece porque sostiene la ejecución local de aplicaciones analíticas.
- La prueba reversible `reports/napo-reduction-auth-ai-remote-skills.json` retiró las cuatro carpetas de un clon con enlaces duros y pasó el validador estructural y el smoke de R/Python/Quarto. El paquete original no fue modificado por la prueba.
- Se actualizó únicamente la lógica de empaquetado de Napo en `build/lib/extensions.ts`; las fuentes de RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode siguen siendo solo lectura.

## 2026-10-12 — Decisión: Capibara se integra completa

Capibara (`rhs-agent4`) se integrará completa en Napo como extensión existente. No se recortará, fragmentará, sustituirá ni reconstruirá internamente. La tarea es preparar el host receptor para soportar todos sus contratos, capacidades, dependencias, runtime, vistas, comandos, configuración, sesiones, permisos, auditoría y ciclo de vida.

Las otras versiones del agente se consultarán únicamente para resolver incompatibilidades o entender contratos del host. Los repositorios fuente permanecen intactos.

## 2026-10-12 — Decisión: extensiones de datos sin alteración

Las extensiones de análisis de datos que RHS-IA provee desde Positron se integrarán sin alteración. Esto incluye las extensiones y contratos necesarios para R, Python, notebooks, Quarto, exploración de datos y viewers. Napo debe adaptar el host, el runtime, la configuración y las dependencias a esas extensiones, no modificar las extensiones para ajustarlas al host.

## 2026-10-12 — Decisión: proveedores visibles para Capibara

Los proveedores de modelos no constituyen una decisión abierta independiente de Napo. Son los proveedores que Capibara puede ver y utilizar como parte de su propia integración. Napo debe conservar el acceso, la configuración y la seguridad necesarias, sin redefinir ni limitar arbitrariamente esa capacidad.

## 2026-10-12 — Decisiones de producto consolidadas

- Quarto siempre estará incluido.
- Todas las extensiones y funciones de análisis de datos provistas por RHS-IA/Positron se integrarán completas y sin alteración.
- Capibara se distribuirá como función integrada de Napo.
- La telemetría queda prohibida de forma absoluta.
- Napo no tendrá servicios externos obligatorios ni tráfico oculto.
- Las actualizaciones seguirán una política manual, explícita, verificable y reversible.
- El software libre se podrá redistribuir conforme a sus licencias, conservando avisos, atribuciones y obligaciones aplicables.

## 2026-10-12 — Auditoría inicial del destino y las fuentes

### Destino

`RHS-IA-Minimal` todavía no contiene implementación; solo contiene los documentos de definición, plan, reglas, bitácora y memoria.

### Fuentes observadas

- `RHS-IA`: commit `453239ef`, sin cambios locales observados.
- `Positron`: commit `6a251c21f`, con archivos no rastreados preexistentes (`.rhs-core-manifest.json` e `Instrucciones/`).
- `rhs-agent3`: commit `1905844`, con modificaciones y un archivo nuevo preexistentes.
- `rhs-agent4`: con numerosos archivos no rastreados preexistentes, incluidos documentos de arquitectura, licencias y planes.
- `vscode`: commit `41c470f705e`, clon completo, sin cambios locales observados.

Estos estados son una fotografía de lectura. No fueron creados ni modificados por este trabajo. Las fuentes continuarán tratándose como solo lectura y no se usará una copia con cambios locales como base sin identificar primero su procedencia.

## 2026-10-12 — Arquitectura base de Napo

Se creó `ARQUITECTURA_NAPO.md` como documento técnico base. La decisión central es derivar Napo del host RHS-IA/Positron, integrar completas Capibara y las extensiones de análisis de datos, y aplicar la reducción únicamente a capacidades ajenas al análisis de datos. La implementación se dividirá en incrementos con puertas de calidad, sin telemetría y con actualizaciones manuales, verificables y reversibles.

Se creó `MATRIZ_HOST_CAPIBARA.md` con requisitos observados en los manifiestos de Capibara y Positron, contratos que el host debe exponer, riesgos de compatibilidad y pruebas del primer incremento.

## 2026-10-12 — Primer baseline de implementación

Se transfirió al destino la revisión limpia `453239ef` de RHS-IA mediante un archivo de Git, sin copiar la carpeta `.git` de la fuente. El destino ahora contiene la base de compilación del host y conserva los documentos de Napo.

Se aplicó únicamente la primera adaptación de identidad y privacidad en el destino:

- nombre corto y largo: `Napo`;
- aplicación: `napo`;
- carpeta de datos: `.napo`;
- protocolo: `napo`;
- etiqueta de producto: `napo`;
- `enableTelemetry: false`;
- URLs de descarga y notas de versión vacías para no declarar un servicio externo de actualización.

Los cambios de extensiones, la integración de Capibara y la curación de capacidades quedan pendientes de inventario y pruebas. La metadata heredada de licencia (`Elastic License 2.0` en `product.json`, además de código y avisos con otras licencias) debe revisarse antes de hacer afirmaciones legales definitivas sobre la distribución.

## 2026-10-12 — Incorporación de VS Code como fuente de referencia

Se clonó el repositorio oficial de Visual Studio Code en:

`/Users/julius3005/Documents/Github/vscode`

El clon conserva el historial completo: `git rev-parse --is-shallow-repository` devuelve `false` y contiene aproximadamente 167.535 commits alcanzables. Se tratará como repositorio fuente de solo lectura, igual que RHS-IA, Positron, rhs-agent3 y rhs-agent4. Su función será estudiar el host, el workbench, el sistema de extensiones, el host de extensiones, los comandos, las vistas, la configuración y el empaquetado para decidir qué necesita Napo. No se copiará ni modificará nada por defecto.

## 2026-10-12 — Definición estratégica de Napo

### Visión formal

Napo es la plataforma de análisis de datos, modelación y planificación asistida por inteligencia artificial. Combina R y Python para ejecutar modelos matemáticos, estadísticos y de inteligencia artificial, simulaciones dinámicas y análisis de escenarios, con Capibara como agente basado en LLMs.

El agente debe poder interpretar objetivos, proponer modelos y código, coordinar ejecuciones, comparar escenarios y explicar resultados. El conocimiento legal y contextual se tratará como información versionada por jurisdicción, fecha y autoridad, con fuentes y revisión humana.

### Principio de integración

La IA generativa coordina y explica; R y Python ejecutan y verifican. Los resultados deben conservar datos, código, parámetros, supuestos, versiones, fuentes, incertidumbre y aprobaciones. Una propuesta generada por un LLM no equivale por sí sola a evidencia analítica ni a una decisión legal.

### Alcance gradual

La primera meta es integrar Capibara en el host Napo y asegurar una base reproducible de análisis. Las capacidades avanzadas de simulación, conocimiento legal y planificación nacional o regional se incorporarán por etapas, con gobernanza y responsabilidad explícitas. Esta visión no autoriza a presentar Napo como sustituto de especialistas.

## 2026-10-12 — Nombre clave formalizado

### Decisión

El nombre clave oficial de RHS-IA Minimal es **Napo**.

- Napo: distribución y plataforma de escritorio.
- Capibara: extensión-agente principal integrada en Napo.
- RHS-IA y Positron: fuentes de código, componentes y comportamiento de referencia.

El nombre `RHS-IA Minimal` se conserva como nombre formal del repositorio y del producto mientras no se decida una identidad pública diferente. `Napo` se utilizará como nombre corto para builds, pruebas, conversaciones y decisiones internas.

## 2026-10-12 — Inicio del trabajo con REA

### Hechos

- REA 6.4.0 está disponible como servidor MCP en la sesión actual.
- Ghidra no está configurado; no se instalaron proveedores externos como IDA, Hopper o Ghidra.
- El repositorio `RHS-IA-Minimal` contenía inicialmente `QUE_CONSERVAR.md`.
- `RHS-IA-Minimal` no es actualmente un repositorio Git.
- Los repositorios fuente deben tratarse como solo lectura.

### Análisis de RHS-IA empaquetado

- Artefacto observado: `/Applications/RHS-IA.app`.
- Identidad observada: RHS-IA 1.118.0, ARM64, identificador de bundle `co.posit.positron`.
- REA inventarió el paquete como directorio con aproximadamente 31.437 nodos y 38.974 relaciones.
- El paquete contiene el núcleo Electron/Positron y aproximadamente 120 raíces de extensiones.
- No se encontró RHS-Agent dentro del directorio base empaquetado de la aplicación.
- El análisis de `Info.plist` confirmó la identidad del bundle y su ejecutable RHS-IA.

### Análisis JavaScript enfocado

- Se analizó con REA el directorio `Contents/Resources/app/out`.
- Resultado resumido: 57 archivos relevantes, 46 archivos JavaScript analizados, 3 ventanas Electron, 13 operaciones IPC, 3 APIs de `contextBridge` y 1 proceso auxiliar.
- Se observaron módulos del workbench, extension host, shared process, agent host, terminal, búsqueda, notebooks, sesiones y webviews.
- La cobertura semántica es parcial por el tamaño del núcleo; los resultados no prueban por sí solos el comportamiento de ejecución.

### Observación complementaria del entorno en ejecución

- RHS-IA tiene instalado y activo un runtime de `rhs-agent3` basado en `scuy_cli`.
- También se observaron Quarto, R, DuckDB, supervisor de Positron y herramientas de entornos Python.
- `rhs-agent4`/Capibara aparece activo en la instalación de Positron, no como el runtime principal observado de RHS-IA.

### Decisiones

- No se modificaron RHS-IA, Positron, rhs-agent3 ni rhs-agent4.
- No se modificó todavía la implementación de RHS-IA-Minimal.
- La estrategia será reutilizar y transferir selectivamente componentes probados, no reconstruir el núcleo desde cero.
- Capibara (`rhs-agent4`) se tratará como una extensión ya hecha que debe integrarse en Napo (RHS-IA Minimal).
- El problema prioritario es el receptor: instalación, activación, ciclo de vida, runtime, vistas, comandos, configuración, aprobaciones y empaquetado del host.
- Cuy, Sacha Cuy y versiones anteriores serán referencias de contratos y pruebas de integración; no serán una razón para crear un agente paralelo desde cero.
- Primero se hará un mapa de transferencia y una selección de extensiones; después se decidirá la implementación.

### Evidencia REA relevante

- Inventario del paquete RHS-IA: `ev_d903abd8eea66790308ca2f9e57f9026ef518627b381b063af581985dde27dfa`.
- Registro de inventario detallado: `ev_ee5f9d7af03ad1241b25eeb9054d638b01f58d628b5594b4e725cdcbdf3da694`.
- Identidad `Info.plist`: `ev_5f67d70596a5319f42a7272f4521aeee93e6a67373f8fc145d663355ee11a214`.
- Resumen del análisis JavaScript: `ev_122e5ed3fb89c30cb27e58a610c15201fe41f31548b60d06ab090e4eaa5b4b49`.

## Próxima entrada pendiente

Construir la matriz de requisitos del host para instalar y activar Capibara en Napo.

## 2026-10-12 — Baseline ejecutable de Napo y primera validación

### Transferencia realizada

- Se transfirió al destino una instantánea limpia de RHS-IA en el commit `453239ef`; los repositorios RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode permanecen sin escritura del trabajo de Napo.
- El destino ahora tiene un repositorio Git independiente para que los scripts de Code-OSS puedan resolver su commit y producir builds reproducibles.
- Capibara se integró completa desde `rhs-agent4-4.0.0.vsix` en `extensions/rhs-agent4`, incluyendo su `dist`, recursos, comandos, vistas, configuración y contratos; no se reescribió su código.
- `ai-lib` y `extensions/positron-r/ark` se restauraron en los commits de submódulo requeridos por la base transferida.

### Identidad y privacidad

- `product.json` identifica la distribución como Napo (`applicationName: napo`, `.napo`, protocolo `napo`, servidor `napo-server`).
- `enableTelemetry` está en `false` y `supportsTelemetry` ahora corta también el modo de logging de desarrollo cuando el producto no habilita telemetría.
- La URL de voz remota quedó vacía; no se configura un servicio de voz externo por defecto.
- La política de actualizaciones sigue siendo manual, explícita, verificable y reversible. Marketplace, documentación y proveedores configurados por el usuario se consideran servicios opcionales y visibles, no requisitos silenciosos de arranque.

### Validación

- `npm run typecheck-client`: pasa.
- `npm run build-fast`: pasa; se transpilan 9.079 archivos del cliente y las extensiones del host, R/Python, notebooks, Quarto, datos, drivers y Capibara queda disponible para empaquetado local.
- `NODE_OPTIONS=--max-old-space-size=8192 node build/checker/layersChecker.ts`: pasa. El límite predeterminado agotaba el heap.
- `npm run validate-bundled-extensions`: pasa para macOS.
- `npm run test:positron`: 415 archivos pasan, 4.945 tests pasan, 2 suites omitidas y 3 expected-fail declarados; las expectativas de identidad/rutas se actualizaron a Napo.
- `npm run test-node` con Node 24 requiere bindings nativos. `@vscode/fs-copyfile` se reconstruyó; `@vscode/sqlite3` no pudo compilar porque el host no tiene Command Line Tools de Xcode y no existe un binario precompilado compatible. Queda como bloqueo ambiental de esa suite, no como fallo funcional diagnosticado.
- `check-cyclic-dependencies` reporta ciclos existentes entre `positronVariables` y `positronDataExplorerEditor`; quedan registrados para análisis separado y no se ocultaron.

### Pendientes inmediatos

- Ejecutar `prelaunch`/Electron para validar arranque, descubrimiento de extensiones y presencia efectiva de Capibara en el host.
- Auditar el inventario de extensiones que se distribuirán en el perfil minimal sin eliminar Capibara, Quarto ni las extensiones de datos.
- Auditar licencias, avisos de terceros y URLs heredadas antes de afirmar una política legal o de redistribución definitiva.

## 2026-10-12 — Empaquetado integrado de Capibara y Quarto

### Resultado

- `npm run compile-extensions-build` pasa en el destino.
- Capibara se empaqueta en `.build/extensions/rhs-agent4` con 988 MB, manifiesto `rhs-agent4@4.0.0`, vista `capibara.SidebarProvider`, comandos y recursos completos.
- El `dist/extension.js` de Capibara conserva el mismo SHA-256 antes y después del empaquetado: `84ec6ba7fc5718e81fbed4674d151d8ea506163cdfb52f7824bf2fae76b12869`.
- Quarto queda incluido como VSIX de arranque en `.build/bootstrapExtensions/quarto.quarto-1.136.0.vsix` y también en el conjunto de extensiones de compilación.
- La cantidad de extensiones locales compiladas es 130; las extensiones de datos de Positron no fueron alteradas.

### Decisión del receptor

- Capibara se trata como extensión integrada/preempaquetada: su runtime ya está embebido en `dist/extension.js`, igual que en el VSIX de origen.
- El host de Napo usa `PackageManager.None` al listar esa extensión, evitando resolver el manifiesto `workspace:^` de su repositorio fuente durante el empaquetado.
- No se modificó el código ni el manifiesto fuente de `rhs-agent4`; el cambio está exclusivamente en la lógica de empaquetado de Napo.
- Se apartó una copia recuperable de dependencias de desarrollo que se habían probado temporalmente; no forman parte del artefacto final de Capibara.

### Pendiente

- Abrir la aplicación Electron empaquetada con un perfil limpio y comprobar activación, vista, comandos, configuración y recursos binarios de Capibara.
- Completar la auditoría de licencias, avisos de terceros, URLs heredadas y proveedores visibles antes de una distribución pública.

## 2026-10-12 — Corrección de enfoque: receptor de Capibara

### Decisión de trabajo

Capibara (`rhs-agent4`) queda establecido como la extensión primaria prevista para Napo. La meta es integrarla dentro de Napo, no reconstruir el agente.

### Alcance de la decisión

- `rhs-agent4` continúa siendo una fuente de solo lectura y la extensión se considera un componente existente.
- La integración futura ocurrirá únicamente en RHS-IA Minimal.
- El análisis se enfocará primero en los requisitos del host y no en reimplementar Capibara.
- Las capacidades de rhs-agent2/Cuy y rhs-agent3/Sacha Cuy se consultarán solo cuando resuelvan una brecha concreta de integración.
- Las pruebas prioritarias son instalación, activación, runtime, vistas, comandos, configuración, aprobaciones, procedencia, cancelación y empaquetado.
- Todavía no se copiaron archivos ni se modificó código.

## 2026-10-12 — Arranque dinámico de Napo y política de distribución

### Resultado comprobado

- `npm run typecheck-client`: pasa después de los cambios del host.
- `npm run build-fast`: pasa y genera también los 15 recursos ESM necesarios para arrancar el workbench desde el checkout.
- `npm run compile-extensions-build`: pasa; Capibara sigue presente completa en `.build/extensions/rhs-agent4` y Quarto en `.build/bootstrapExtensions/quarto.quarto-1.136.0.vsix`.
- `npm run test:positron`: 415 archivos pasan, 4.945 pruebas pasan, 3 expected-fail declarados y 21 pruebas omitidas.
- `npm run validate-bundled-extensions`: pasa para macOS.
- La ejecución Electron de Napo carga la interfaz, inicializa el host de extensiones y no produce errores de compatibilidad de Quarto ni de Capibara.
- El escaneo de desarrollo omite los tres paquetes de Data Explorer que son insumos de compilación (`positron-data-explorer-formatting`, `positron-data-explorer-duckdb` y `positron-data-explorer-protocol`); sus fuentes y contratos no se alteraron.

### Política fijada en el receptor

- Las actualizaciones del producto y de extensiones quedan manuales, explícitas, verificables y reversibles.
- Napo no realiza comprobaciones automáticas de galería, no actualiza extensiones en segundo plano y no adjunta datos de uso a solicitudes de galería.
- La compatibilidad de extensiones conserva la versión Positron del host (`2026.09.1`) aunque Napo sea la distribución; por eso Quarto se acepta sin tocar su manifiesto.
- `enableTelemetry: false` continúa siendo una protección permanente, incluida la ruta de desarrollo.

### Riesgos aún abiertos

- El watcher nativo de políticas no está disponible en este macOS por la instalación de herramientas; Napo continúa sin políticas administrativas del sistema y deja constancia del aviso.
- La suite Node completa depende de bindings nativos que requieren un entorno de compilación específico; SQLite, spdlog y native-keymap sí fueron reconstruidos para la validación Electron local.
- Falta la auditoría legal/licencias/avisos/URLs heredadas antes de una distribución pública.

## 2026-10-12 — Identidad macOS efectiva de Napo

- `product.json` ahora declara `darwinBundleIdentifier: org.rhsia.napo`; el valor heredado `co.posit.positron` ya no se usa para la distribución Napo.
- El bundle regenerado `.build/electron/Napo.app` confirma en `Info.plist` `CFBundleIdentifier=org.rhsia.napo`, `CFBundleName=Napo` y `CFBundleDisplayName=Napo`.
- Esta corrección evita que Napo comparta identidad de instancia con Positron o RHS-IA cuando esas aplicaciones están abiertas en macOS.
- `npm run build-fast` pasa después del cambio y la prueba de identidad de arranque fue alineada con el nuevo contrato.
- La prueba funcional aislada confirma procesos GPU, red, renderer y host de extensiones usando el perfil temporal de Napo; el lanzador CDP continúa limitado por un cierre de Chromium del entorno cuando se habilita depuración remota.

## 2026-10-12 — Capibara visible y activable en Napo

- Se aisló la causa de la ausencia visual inicial de Capibara: el layout limpio heredado de Positron ocultaba la Activity Bar aunque el host ya hubiera registrado `workbench.view.extension.capibara`.
- El host de Napo ahora muestra la Activity Bar por defecto cuando no existe una preferencia explícita del usuario. El ajuste está condicionado a `applicationName: napo`; no modifica Capibara ni cambia las preferencias existentes.
- Con un perfil limpio y el bundle recompilado, la Activity Bar obtiene una superficie visible de 48 px, aparece `RHS-Agent`, se abre su vista y se registran las acciones `New task` y `Settings`.
- La misma prueba con `workbench.activityBar.location: hidden` mantiene la barra oculta y no muestra RHS-Agent; por tanto, la preferencia explícita del usuario prevalece.
- `npm run typecheck-client`, `npm run build-fast` y `npm run test:positron` pasan después del ajuste; la suite registra 415 archivos, 4.945 pruebas, 3 expected-fail y 21 omitidas.

## 2026-10-12 — Preflight de runtimes y diagnóstico de ejecución

- El entorno del host tiene R `4.5.3` y Python `3.13.3` disponibles.
- El CLI de Quarto no estaba instalado en el sistema; se preparó mediante la tarea oficial del repositorio, con archivo `quarto-1.10.18-macos.tar.gz`, verificación SHA-256 y ejecución confirmada de `.build/quarto/bin/quarto --version` (`1.10.18`).
- Se agregó `npm run validate-napo` y `npm run validate-napo-runtime` para comprobar identidad Napo, telemetría prohibida, actualizaciones silenciosas desactivadas, Capibara completa, integridad de la copia preempaquetada, Quarto y disponibilidad de R/Python.
- La prueba dinámica con workspace temporal detectó una brecha del receptor: el escáner registra las extensiones de R/Python, pero el host de extensiones no termina de abrir su registro operativo; el servicio de runtimes queda esperando y el selector muestra cero resultados. Los logs terminan en `Extension host startup failed Canceled` al cerrar la aplicación y reportan `Unknown extension` como consecuencia del cierre, no como evidencia de que el paquete falte.
- No se modificaron fuentes externas ni se declaró validado el flujo R/Python/Quarto dentro de la interfaz. Esta brecha queda como puerta obligatoria antes de afirmar que Napo ejecuta análisis de extremo a extremo.

## 2026-10-12 — Empaquetado macOS y frontera del host

- Se ejecutó el flujo oficial `vscode-darwin-arm64` y se generó el artefacto `../VSCode-darwin-arm64/Napo.app`.
- El paquete final contiene Quarto en `Contents/Resources/app/quarto/bin/quarto`, versión `1.10.18`, y Capibara completa en `Contents/Resources/app/extensions/rhs-agent4`.
- La extensión Capibara conserva el SHA-256 `84ec6ba7fc5718e81fbed4674d151d8ea506163cdfb52f7824bf2fae76b12869` en la fuente preparada y en el paquete.
- `npm run validate-napo-package` pasa y comprueba identidad Napo, telemetría desactivada, actualizaciones silenciosas desactivadas, Capibara y Quarto empaquetados, y versiones ejecutables.
- La prueba visual del paquete confirma Napo, la Activity Bar y la vista RHS-Agent; una preferencia explícita para ocultar la Activity Bar continúa siendo respetada.
- La prueba de sesiones aún muestra cero intérpretes porque el host de extensiones no completa su protocolo de inicialización. Esta es una brecha del receptor que debe resolverse antes de declarar funcional el análisis R/Python/Quarto de extremo a extremo.

## 2026-10-12 — Runtimes integrados y política de servicios externos

### Correcciones del receptor

- El servicio de salud del welcome page ahora activa por ID la extensión de lenguaje antes de invocar su comando de diagnóstico. Esto corrige el caso de R: `positron.positron-r` encontraba R, pero su comando `r.getEnvironmentHealth` se registraba programáticamente y aún no existía cuando el host lo llamaba.
- La corrección está únicamente en `src/vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/environmentHealthService.ts`; `extensions/positron-r` y las demás extensiones de análisis permanecen sin alteración.
- PET fue transferido completo desde Positron a `extensions/positron-python/python-env-tools/pet`. SHA-256: `f8053699f17744d9be80bae500b658ece7467d17fcaf792fe70c2529fc20e6e5`.
- Ark fue transferido completo desde Positron a `extensions/positron-r/resources/ark/ark`. SHA-256: `1ac0430114fca214d010176800fd83ae4f41d38e9aac255b43b848f4bb2d14be`.
- El binding nativo de Git se transfirió desde Positron a `extensions/git/node_modules/@vscode/fs-copyfile/build/Release/vscode_fs.node`. SHA-256: `7211e86f9736d7962f0c449cd27fa6ee53258b02df8b751019d7d9abf946e999`. El paquete ya no registra el error de módulo nativo ausente.

### Política de servicios externos

- Se identificó una descarga automática de documentación LLM a `cdn.posit.co` durante el arranque. En Napo, `product.json` deja `positronLlmsDocsUrl` vacío y el host no arma el scheduler ni solicita ese recurso.
- Un despliegue controlado puede habilitarlo explícitamente mediante `POSITRON_LLMS_DOCS_URL`; no es una dependencia oculta ni una llamada obligatoria de Napo.
- La prueba del paquete final no registra `llm-docs`, `positron-llms` ni solicitudes a la URL CDN de documentación.
- Esta regla es independiente de Capibara y de sus proveedores LLM: un proveedor solo se usa cuando el usuario lo configura y autoriza.

### Evidencia del paquete final

- `npm run typecheck-client`: pasa.
- `npm run test:positron`: 415 archivos pasan, 4.946 pruebas pasan, 3 expected-fail y 21 pruebas omitidas.
- `npm run build-fast` y `npm run gulp vscode-darwin-arm64`: pasan y generan `../VSCode-darwin-arm64/Napo.app`.
- `npm run validate-napo-package`: pasa identidad, telemetría, actualizaciones silenciosas, política de documentación LLM, Capibara, PET, Ark, Quarto, R y Python.
- `npm run validate-bundled-extensions`: pasa para macOS.
- La prueba de interfaz muestra `Napo`, `RHS-Agent`, R configurado correctamente y R 4.5.3 usable/compatible.
- Python descubre intérpretes y encuentra `/opt/homebrew/bin/python3`; su comprobación queda en 2/4 porque ese entorno no tiene `ipykernel`. Napo deja la acción explícita `Instalar ipykernel` y no instala paquetes por su cuenta.

### Pendientes que siguen abiertos

- Completar una sesión R real, una sesión Python con `ipykernel` disponible y un render Quarto R/Python de extremo a extremo.
- Separar y resolver los avisos de empaquetado `No bundle location found` de varias extensiones Positron; no impiden el diagnóstico R/Python, pero deben limpiarse antes de distribución final.
- Investigar la notificación de terminal `posix_spawn failed` del perfil de prueba y el timeout del proveedor de autenticación GitHub.
- Completar auditoría de licencias, avisos de terceros, URLs heredadas, procedencia y redistribución.
- Verificar nuevamente que los repositorios fuente externos siguen sin modificaciones.

## 2026-10-12 — Smoke test reproducible de runtimes

- Se añadió `scripts/smoke-napo-runtime.mjs` y el comando `npm run smoke-napo-runtime`.
- La prueba puede recibir `--package ../VSCode-darwin-arm64/Napo.app` y usa el Quarto que vive dentro del paquete, sin descargar componentes ni depender de servicios externos.
- En la ejecución vigente pasaron el CLI Quarto 1.10.18, R, Python con `ipykernel`, un render Quarto/R y un render Quarto/Python-Jupyter.
- Los documentos de prueba se generan en un directorio temporal y dejan la ruta de evidencia en la salida; no modifican los repositorios fuente ni los artefactos integrados.
- Esta prueba cierra la comprobación de runtime por CLI. No sustituye todavía la prueba de los mismos flujos desde la interfaz de Napo ni las pruebas completas de Capibara.

### Diagnóstico complementario del perfil limpio

- El paquete contiene el binding `node-pty` macOS arm64 y los perfiles `bash`, `zsh` y `tmux` aparecen en la interfaz.
- En el perfil limpio actual, la creación de una terminal todavía muestra `posix_spawn failed: No such file or directory`; el error no aparece persistido en `terminal.log` ni `ptyhost.log`, por lo que no se atribuye aún a un ejecutable concreto.
- Los avisos `No bundle location found` tienen una causa localizada: varias extensiones Positron incluyen `l10n/bundle.l10n.es.json` pero no declaran el campo `l10n` en su manifiesto. Se mantiene como limpieza de empaquetado/localización y no se modifica ninguna extensión conservada.

## 2026-10-12 — Perfil concreto de superficie Minimal

- Se creó `PERFIL_NAPO_MINIMAL.md` contra el paquete macOS vigente: 127 directorios de extensiones más la extensión de arranque de Quarto.
- La clasificación separa núcleo conservado, componentes condicionados y candidatos a aplazar, con puertas explícitas antes de retirar físicamente algo.
- La decisión actual es reversible: no se borran todavía extensiones ajenas al análisis porque aún deben probarse dependencias con Capibara, Quarto, viewers, runtimes y el workbench.

## 2026-10-12 — Corrección final de runtimes nativos y prueba E2E del receptor

### Bloqueo encontrado y corrección

- La primera prueba UI de R reveló el bloqueo real: el paquete tenía Kallichore ausente; se transfirió el ejecutable macOS arm64 desde el repositorio Positron de solo lectura a `extensions/positron-supervisor/resources/kallichore/kcserver`, sin alterar el origen.
- La siguiente prueba aisló un segundo problema del empaquetado: `node-pty` necesita `prebuilds/darwin-arm64/spawn-helper` fuera de `node_modules.asar`, porque su implementación Unix lo invoca por ruta física. Al dejarlo dentro del ASAR, macOS devolvía `posix_spawn ENOENT` para el terminal y para el terminal usado por Kallichore.
- La regla de empaquetado en `build/gulpfile.vscode.ts` ahora desempaqueta `node-pty/prebuilds/**/spawn-helper`. `scripts/validate-napo.mjs` comprueba además su presencia y permiso de ejecución dentro del `.app`.
- El manifiesto del supervisor del destino se alineó a Kallichore `0.1.67`, que coincide con el binario transferido y con `../positron`; no se introdujo un runtime inventado ni se modificó el repositorio fuente.

### Evidencia final

- `npm run gulp vscode-darwin-arm64`: pasa y genera `../VSCode-darwin-arm64/Napo.app`.
- `npm run validate-napo-package`: pasa identidad Napo, telemetría prohibida, actualizaciones silenciosas desactivadas, Capibara completa, PET, Ark, Kallichore, Quarto y `node-pty spawn-helper`.
- `npm run smoke-napo-runtime -- --package ../VSCode-darwin-arm64/Napo.app`: pasa Quarto `1.10.18`, R, Python con `ipykernel`, render Quarto/R y render Quarto/Python-Jupyter.
- En un perfil macOS completamente nuevo, la UI muestra Kallichore `0.1.67 server online`, inicia R `4.5.3` y abre el terminal integrado `zsh`. Los logs finales no contienen `posix_spawn`, `ENOENT` del helper ni la advertencia de versión incompatible del supervisor.
- Python sigue en 2/4 comprobaciones porque `/opt/homebrew/bin/python3` no tiene `ipykernel`; Napo conserva la acción explícita para instalarlo y no instala paquetes silenciosamente.
- La auditoría de estado de `RHS-IA`, `positron`, `rhs-agent3`, `rhs-agent4` y `vscode` no muestra cambios nuevos causados por esta integración. Los estados previos visibles en `positron`, `rhs-agent3` y `rhs-agent4` se preservan como externos al trabajo.

### Pendientes que siguen abiertos

- Pruebas funcionales completas de Capibara desde la UI: proveedores, permisos, cancelación, historial, procedencia y tareas reales.
- Auditoría legal de licencias, avisos, URLs heredadas y redistribución pública.
- Limpieza posterior de avisos `No bundle location found` y de la notificación de extensiones modificadas en perfiles limpios; no bloquean el arranque R/terminal demostrado, pero deben revisarse antes de una distribución final.

## 2026-10-12 — Política consolidada de servicios externos y actualización

- Se confirmó en el receptor que Capibara muestra sus proveedores, historial, perfiles `Restringido`, `Workspace` y `Full Access`, políticas de aprobación y runners empaquetados.
- Se definió “servicio externo” como proveedor LLM remoto, servidor local opcional (Ollama/LM Studio), búsqueda web/Obscura, Qdrant o endpoint configurable. Ninguno equivale a telemetría.
- La visibilidad de proveedores se conserva completa porque forma parte de Capibara; no se altera ni se recorta el selector por el objetivo de Napo minimal.
- La búsqueda web arranca desactivada. Las conexiones a proveedores solo ocurren cuando la configuración y la acción de la persona usuaria las requieren.
- Se formalizó la política de actualización manual, explícita, verificable por hash y reversible en `POLITICA_NAPO.md`.
- Los repositorios fuente permanecen de solo lectura; estas decisiones y cambios viven únicamente en Napo.

## 2026-10-12 — E2E de Capibara con workspace y cancelación

- Se inició una instancia aislada de Napo con `/tmp/napo-capibara-e2e` como workspace; no se usó ningún repositorio fuente.
- Capibara mostró `Workspace · Sensibles`, cargó sus runners empaquetados y permitió seleccionar un modelo de Ollama local (`gemma4:31b-mlx`).
- Una tarea mínima llegó a estado `Pensando…` y mostró el botón `Cancelar`, confirmando el ciclo de envío y la cancelación desde la interfaz real.
- Después de cancelar, la vista web necesitó una recarga de ventana para volver a materializarse; la recarga fue exitosa y el historial mostró la tarea cancelada. Se conserva como comportamiento a vigilar en la prueba de recuperación, no como aceptación definitiva de una cancelación sin recarga.
- La sesión no escribió archivos, no ejecutó herramientas, no usó búsqueda web ni contactó proveedores remotos. La respuesta del modelo no se esperó porque el objetivo de esta prueba era validar cancelación y persistencia.
- La primera prueba sin workspace no creó una tarea utilizable; esto confirma que el arnés E2E debe abrir siempre un proyecto.

## 2026-10-12 — Hallazgo legal preliminar

- `LICENSE.txt` de Napo, RHS-IA y Positron declara Elastic License 2.0 para el núcleo heredado.
- Capibara declara Apache-2.0; Code-OSS/VS Code declara MIT; el paquete de Capibara incluye avisos de terceros y licencias auxiliares.
- La conclusión factual es que Napo puede redistribuirse conforme a sus licencias y condiciones, pero no debe describirse como un paquete monolicenciado de software libre sin revisión legal.
- Se creó `AUDITORIA_LEGAL_NAPO.md` como puerta obligatoria antes de una publicación pública.

## 2026-10-12 — Cierre de la iteración de validación estructural

- `npm run validate-napo-package` y `npm run smoke-napo-runtime -- --package ../VSCode-darwin-arm64/Napo.app` pasan.
- El smoke test demuestra Quarto `1.10.18`, R, Python con `ipykernel`, render Quarto/R y render Quarto/Python-Jupyter sin depender de servicios externos.
- El validador comprueba ahora la presencia de `LICENSE.txt`, `NOTICE`, licencia de Capibara, `THIRD_PARTY_NOTICES.md` e inventario `dist/LICENSES` tanto en el destino como dentro de `Napo.app`.
- La E2E de Capibara con workspace temporal validó proveedor Ollama local, selector de proveedores, perfiles, aprobación, runners, cancelación e historial. La recuperación automática de la vista después de cancelar requiere una iteración específica; por eso no se marca como cerrada.
- Los repositorios fuente siguen siendo solo lectura. Los estados locales preexistentes observados en Positron, rhs-agent3 y rhs-agent4 se mantienen sin atribuirlos a Napo.

## 2026-10-12 — Desactivación de Marketplace en Napo

- Se detectó que `product.json` todavía declaraba la galería OpenVSX heredada aunque las comprobaciones automáticas ya estaban desactivadas.
- Se vaciaron los endpoints de `extensionsGallery` en Napo para que el producto no declare ni consulte una galería por defecto; las extensiones integradas se distribuyen dentro del paquete.
- `npm run gulp vscode-darwin-arm64` terminó correctamente después del cambio.
- `npm run validate-napo-package` confirma Marketplace desactivado en el árbol integrado y en `Napo.app`, además de Capibara, Quarto, runtimes y avisos legales.
- `npm run smoke-napo-runtime -- --package ../VSCode-darwin-arm64/Napo.app` volvió a ejecutarse contra el paquete regenerado.

## 2026-10-12 — Revalidación de Capibara tras rollback

- La reconstrucción posterior al rollback volvió a abrir la vista `RHS-Agent` sin error; la webview muestra Capibara `4.0.0`, historial, configuración, perfil `Workspace · Sensibles` y el área de nueva tarea.
- La prueba controlada con Ollama local confirmó que el runtime acepta la cancelación y termina la tarea como interrumpida, pero la webview puede quedar en blanco después de cancelar hasta reabrir la vista o recargar la ventana.
- No se alcanzó una decisión de herramienta ni una pantalla de aprobación en esa prueba porque `gemma4:31b-mlx` no llegó a la fase de planificación antes de la cancelación. Por tanto, no se declara aprobado el E2E de permisos.
- Se probó una recuperación automática experimental en el bundle integrado y se revirtió por completo; el destino conserva el comportamiento original de Capibara. No se modificó `rhs-agent4` ni ningún otro repositorio fuente.

## 2026-10-12 — Recuperación acotada del host para la webview de Capibara

- El análisis del receptor confirmó que `IOverlayWebview` expone `onFatalError`, `onDidLoad` y `reload()`; se implementó una recuperación acotada en `WebviewViewPane`, únicamente para `capibara.SidebarProvider`.
- La recuperación se mantiene fuera de Capibara: ante un error fatal de carga, el host realiza como máximo un intento diferido de recarga y evita recargar por cada cancelación de tarea.
- El cambio compiló con `npm run typecheck-client`, `npm run build-fast` y `npm run gulp vscode-darwin-arm64`. La vista empaquetada vuelve a cargar y muestra Capibara 4.0.0, historial, configuración y `Workspace · Sensibles`.
- La corrección no demuestra todavía que el síntoma específico posterior a una cancelación —webview en blanco sin error fatal— emita `onFatalError`; por eso la recuperación tras cancelar sigue siendo una prueba abierta y no se declara cerrada.
- El paquete regenerado vuelve a pasar el validador estructural y el smoke reproducible de Quarto, R, Python/Jupyter y renderizado Quarto.

## 2026-10-12 — Recuperación de cancelación validada en el host

- Se añadió en el receptor, únicamente para `capibara.SidebarProvider`, una recarga diferida de la webview después de recibir `cancelTask`. La extensión Capibara y su bundle integrado permanecen sin alteración.
- En una instancia nueva de Napo con el workspace vivo `/tmp/napo-capibara-live`, una tarea real pasó a `Pensando…`, mostró `Cancelar` y terminó en el runtime como interrumpida.
- La vista quedó momentáneamente vacía al cancelar, pero se restauró automáticamente en aproximadamente dos segundos: reaparecieron Capibara 4.0.0, el historial, el mensaje de la persona usuaria, el perfil `Workspace · Sensibles` y el formulario de nueva tarea; no quedaron spinner ni botón `Cancelar` activos.
- La recuperación quedó comprobada contra el paquete macOS recién reconstruido. `typecheck-client`, `build-fast`, empaquetado, validador estructural y smoke reproducible continúan pasando.
- La prueba de aprobación de una herramienta real sigue separada y no se marca como validada: el modelo local usado no alcanzó la fase de planificación antes de ser cancelado.
- Un error anterior de `os.getcwd()` provenía de un arnés que reutilizó un workspace temporal ya eliminado. El arnés debe conservar vivo el workspace durante toda la tarea; no se atribuye ese registro a la ejecución actual con workspace vivo.

## 2026-10-12 — Regresión y frontera de aprobación

- `npm run test:positron` volvió a pasar después del cambio del host: 415 archivos aprobados, 2 omitidos; 4.946 pruebas aprobadas, 3 fallos esperados y 21 omitidas.
- `npm run validate-napo-package -- --require-runtime` volvió a pasar identidad, privacidad, Marketplace desactivado, licencias, Capibara completa, PET, Ark, Kallichore, Quarto, `node-pty` y runtimes.
- `npm run smoke-napo-runtime -- --package ../VSCode-darwin-arm64/Napo.app` volvió a pasar Quarto, R, Python con `ipykernel`, render Quarto/R y render Quarto/Python-Jupyter.
- La prueba UI de escritura en workspace temporal terminó con respuesta textual `OK`, `tool_turns=0` y archivo `napo-approval-test.txt` no creado. El modelo local no solicitó una herramienta; la frontera de aprobación queda pendiente de una prueba con un modelo que sí genere una llamada, sin relajar la política.

## 2026-10-12 — Arranque determinista de Capibara y rechazo controlado

- Se corrigió en el receptor Napo el bloqueo del host local bajo demanda: configuración/proxy no bloqueante, espera acotada del workspace y activación directa de `juliushearts.rhs-agent4` para `capibara.SidebarProvider`.
- Capibara no fue modificada. El paquete abre RHS-Agent 4.0.0 con Chat, Historial, Configuración, proveedores completos, perfil Workspace y formulario de tarea.
- Con el mock local `http://127.0.0.1:18123/v1` y política `Preguntar siempre`, la interfaz mostró `Escribiendo archivo`, terminó con la leyenda de rechazo y el archivo `/tmp/napo-rea-workspace/napo-approval-test.txt` no fue creado.
- Esto valida el límite de escritura y el rechazo efectivo. No afirmar aún que se validó una tarjeta pendiente con botones `Aprobar`/`Rechazar`: el mock resolvió demasiado rápido.
- El paquete final fue reconstruido sin trazas temporales. Pasan typecheck, build, empaquetado, suite Positron (415 archivos; 4.946 pruebas; 3 expected-fail; 21 omitidas), validador, smoke y `git diff --check`.
- El smoke confirma Quarto 1.10.18, R, Python con `ipykernel`, render Quarto/R y render Quarto/Python-Jupyter. La interfaz mostró además un error separado de sesión R (`Cannot read properties of undefined (reading 'uri')`) pendiente de investigación propia.

## 2026-10-12 — Corrección de arranque de sesión R en Napo

- La prueba visual con perfil limpio reprodujo el acceso inseguro del supervisor cuando no había una primera carpeta de workspace válida.
- La causa estaba en `KallichoreSession`: `workspaceFolders?.[0].uri` protegía el arreglo, pero no el elemento `[0]`. Napo ahora usa `workspaceFolders?.[0]?.uri` y cae en `os.homedir()`.
- Se endurecieron también dos lecturas auxiliares de `positron-r` para tolerar `workspaceFolders` vacío. No se modificó ningún repositorio fuente externo.
- El perfil limpio posterior inició R 4.5.3, mostró el prompt y dejó el directorio de trabajo `~/`; el error `reading 'uri'` ya no aparece.
- Tras reconstruir el paquete pasan el validador con runtime y el smoke completo de Quarto/R y Quarto/Python-Jupyter.

## 2026-10-13 — Frontera de aprobación: protección de workspace conservada

- El mock local retardado volvió a producir una llamada controlada a `write_to_file`; Capibara no creó el archivo.
- El receptor rechazó la solicitud antes de ejecutar porque el runtime entregó una ruta de workspace que no coincidía con la carpeta vinculada. La protección de procedencia funcionó y no se relajará para hacer pasar la prueba.
- La prueba se ejecutó mientras coexistían perfiles/instancias de Napo, por lo que la propagación de workspace debe repetirse con una única instancia limpia antes de decidir si existe un defecto real de integración.
- El helper de prueba conserva ahora un retardo configurable (`NAPO_APPROVAL_DELAY_MS`) para poder capturar una tarjeta pendiente en una corrida aislada; no altera Capibara ni el paquete distribuido.

## 2026-10-12 — E2E de aprobación y escritura autorizada

- Se ejecutó Napo.app en una sola instancia de prueba con el workspace vivo `/tmp/napo-rea-workspace` y el mock OpenAI-compatible local `http://127.0.0.1:18123/v1`.
- La interfaz mostró `RHS-Agent v4.0.0`, el estado `Workspace · Sensibles`, el modelo `napo-approval-fixture` y la operación `write_to_file` con los botones visibles `Aprobar` y `Rechazar`.
- Se aprobó explícitamente la operación desde la interfaz. El archivo `/tmp/napo-rea-workspace/napo-approval-test.txt` fue creado con 18 bytes; no se escribió fuera del workspace.
- La base de estado del proyecto `/tmp/napo-rea-workspace/.capibara/state.db` registra `source=capibara-extension`, `cwd=/tmp/napo-rea-workspace`, `model=napo-approval-fixture`, `message_count=4` y `tool_call_count=1`.
- El registro de herramienta conserva `write_to_file` y la verificación del archivo con SHA-256. La base global del runtime no contiene la sesión porque esta ejecución persiste por proyecto, dentro de `.capibara`.
- La protección de procedencia, la aprobación humana y la escritura autorizada quedan validadas en el receptor. Capibara y los repositorios fuente permanecen sin alteración.

## 2026-10-12 — Validación de distribución posterior

- `npm run validate-napo-package -- --require-runtime` pasa identidad Napo, telemetría desactivada, actualizaciones silenciosas desactivadas, Marketplace sin endpoints, avisos legales, Capibara completa e íntegra, PET, Ark, Kallichore, Quarto, `node-pty`, R y Python.
- `npm run smoke-napo-runtime -- --package ../VSCode-darwin-arm64/Napo.app` pasa Quarto `1.10.18`, R, Python con `ipykernel`, render Quarto/R y render Quarto/Python-Jupyter.
- La aceptación funcional de Capibara ya cubre activación en workspace, configuración de proveedor, aprobación visible, escritura autorizada, persistencia de sesión y procedencia del workspace.
- Continúan fuera de esta aceptación: publicar una distribución pública sin completar la revisión legal humana, decidir la política de entrega de actualizaciones para cada canal y resolver avisos cosméticos de perfiles limpios.

## 2026-10-12 — Inventario reproducible de licencias

- Se añadió `scripts/audit-napo-license-inventory.mjs` y el comando `npm run audit-napo-license-inventory`.
- El inventario del árbol integrado registra 142 manifiestos de extensiones y 28 archivos legales con SHA-256.
- El inventario de `Napo.app` registra 131 manifiestos y 27 archivos legales con SHA-256.
- El reporte marca 32 manifiestos del paquete para revisión humana cuando no declaran licencia directamente o remiten a un archivo. Esto no se oculta ni se interpreta como aprobación legal automática.
- El inventario es un entregable de reproducibilidad; la auditoría legal pública sigue abierta para términos de binarios, modelos, dependencias transitivas, marcas y redistribución.
- La regeneración del reporte de `Napo.app` produjo el mismo SHA-256 (`a232d4d66638bfb355b2243d109e09abf2d4fe865cf7e0c5d2c3a1b43bcb6b56`), confirmando que el inventario es determinista para el mismo artefacto.
- Después de incorporar la herramienta pasan `typecheck-client`, `test:positron` (415 archivos; 4.946 pruebas; 3 expected-fail; 21 omitidas), `validate-rhs-ia-extension-inventory`, `validate-napo-package` y `git diff --check`.

## 2026-10-13 — Dependencia Python transferida y validación UI de Napo

- Una instancia limpia de Napo reprodujo el fallo de arranque de Python con `ModuleNotFoundError: No module named 'positron._vendor'`.
- La causa fue una exclusión accidental en el destino: el paquete receptor no contenía `extensions/positron-python/python_files/posit/positron/_vendor`, aunque esa dependencia forma parte del código de Positron que Napo conserva.
- Se transfirió `_vendor` desde el repositorio fuente de Positron al destino Napo, excluyendo únicamente `__pycache__` y archivos `.pyc`; se retiró la exclusión equivalente del `.gitignore` del destino. No se escribió en Positron ni en ningún otro repositorio fuente.
- Las importaciones directas desde el árbol fuente y desde `.build` pasan; `compile-extensions-build` y el empaquetado macOS vuelven a pasar.
- La validación visual con perfil limpio confirma que Python 3.13.3 inicia dentro de Napo, ejecuta un archivo y devuelve `NAPO_PYTHON_UI_OK`.
- La validación visual de Quarto confirma reconocimiento de Quarto 1.10.18, ejecución de una celda Python con `NAPO_QUARTO_UI_OK` y previsualización HTML dentro de Napo.
- El aviso de recarga de extensiones observado en esa corrida pertenece al mecanismo de desarrollo que detecta cambios del paquete en disco durante la prueba; no impidió la ejecución y debe desaparecer en una instalación final inmutable.

## 2026-10-13 — Ledger REA del host empaquetado

- La pasada REA sobre todo `Contents/Resources/app` agotó cinco minutos sin producir evidencia utilizable; se descartó ese intento y no se interpretó como fallo de Napo.
- La pasada válida se acotó a `out/main.js` y `out/vs/code/electron-browser/workbench/workbench.js` del artefacto empaquetado. REA registró evidencia retenida `ev_0917f0a08fc47cb2364e77adb9fa177bbc2609ea8df75c9e5cc9ddb7e38a3989` y resumen `ev_1115de9c155ec0606b0d053d9d2939a77eca8c2f9aab2f1bede76e94b3310356`.
- El análisis estático acotado procesó dos archivos, 2,880,475 bytes, 340,206 nodos AST, 598 hallazgos y 375 módulos; observó tres ventanas Electron y tres handlers principales. La cobertura semántica quedó parcial por límites de recursos y se registraron las limitaciones en `REA_EVIDENCIA_NAPO.md`.
- Se exportó el bundle canónico a `reports/rea-napo-host-evidence.json` (96,805,406 bytes; 7 registros). El ledger distingue observaciones, inferencias, unknowns y corroboración de runtime; no afirma equivalencia completa con VS Code/Positron ni ausencia de tráfico o componentes.
- La investigación confirma que la reducción física de extensiones requiere una matriz de dependencias y pruebas propias; no justifica retirar componentes por ausencia de hallazgos estáticos.

## 2026-10-13 — Auditoría reproducible de superficie de extensiones

- Se añadió `scripts/audit-napo-extension-surface.mjs` y `npm run audit-napo-extension-surface`.
- El reporte `reports/napo-extension-surface.json` inspecciona los manifiestos del destino y registra 134 extensiones: 50 para conservar, 38 candidatas a aplazar y 46 que requieren prueba específica.
- La clasificación reconoce explícitamente las extensiones Positron de datos, runtimes, notebooks, conexiones, exploración, drivers y viewers; no las marca como descartables por ser extensiones heredadas de VS Code.
- El reporte encontró cero dependencias declaradas sin resolver dentro del inventario. Esto no demuestra independencia runtime: las dependencias implícitas y contratos del host siguen requiriendo pruebas.
- Las 38 candidatas a aplazar no tienen dependientes declarados en los manifiestos analizados; el dato solo habilita una prueba de reducción aislada y no autoriza retirarlas del paquete.
- El inventario es reversible y no elimina ni desactiva físicamente nada. La decisión de reducir la superficie queda condicionada a pruebas, licencias, reconstrucción y recuperación.
- Después de añadir la auditoría, `validate-napo-package -- --require-runtime`, `smoke-napo-runtime`, `node --check` del script y `git diff --check` pasan; el hash del reporte de superficie es estable entre dos ejecuciones (`dbcde3c51b9e21c305fa95ed09da393300b0fd4d79a1132cd081e5ac391912cf`).

## 2026-10-13 — Primera reducción temporal de superficie

- `scripts/audit-napo-extension-surface.mjs --package ../VSCode-darwin-arm64/Napo.app` separó el paquete real del árbol integrado: `Napo.app` contiene 126 manifiestos, 46 para conservar, 36 candidatas aisladas y 44 que requieren prueba.
- Se añadió `scripts/test-napo-surface-reduction.mjs`, que clona el `.app` por enlaces duros, mueve las extensiones seleccionadas a un archivo reversible y ejecuta validador y smoke sin tocar el paquete original.
- La prueba de una extensión (`vscode.bat`) y la prueba conjunta de las 36 candidatas aisladas pasan validador y smoke: R, Python con `ipykernel`, Quarto/R y Quarto/Python-Jupyter siguen operativos por CLI.
- En la interfaz del clon conjunto, R y Quarto ejecutaron `NAPO_REDUCED_R_QUARTO_OK`. Python seleccionó un intérprete 3.14.6 sin `ipykernel`; la prueba ofreció instalarlo y se rechazó la instalación, por lo que esta corrida no se usa como fallo de reducción Python.
- No se aplicó todavía la eliminación al destino. Antes de hacerlo se requiere repetir la UI Python con un intérprete ya preparado, revisar licencias del subconjunto y reconstruir Napo desde la matriz aprobada.

## 2026-10-13 — REA ampliado a Capibara completa

- Se ejecutó una pasada REA sobre `extensions/rhs-agent4` como artefacto de lectura, sin escribir en `rhs-agent4` ni en ningún repositorio fuente.
- REA procesó 2.052 archivos relevantes, 83.193.101 bytes, 1.548 archivos JavaScript y 6.437.702 nodos AST; no registró fallos de parseo. La evidencia corresponde al hash `2e50ba25dd95390abc9f182960561d348a22e5017bdd9cfe794f599f076b519b` y al registro `ev_ec0c5d7debdd58ae63e83340735dce5093d705e3b8a4745ceeb51aba8cbbb950`.
- La lectura estática observó la extensión como extensión del receptor: no encontró ventanas Electron, `contextBridge`, IPC renderer/main ni bindings nativos resueltos dentro del artefacto Capibara. Esto refuerza la decisión de transferirla completa y resolver la integración en Napo.
- La cobertura semántica de Capibara es parcial por presupuesto de resultados y deja explícitos los unknowns; no se presenta como prueba de ausencia de relaciones dinámicas.
- El bundle REA actualizado queda en `reports/rea-napo-host-evidence.json` con 172.344.306 bytes y 9 registros. El ledger consolidado está en `REA_EVIDENCIA_NAPO.md`.

## 2026-10-13 — UI Python validada en la reducción reversible

- Se repitió la prueba del clon con un perfil limpio y con `python.interpreters.override` apuntando a `/usr/local/bin/python3`; Napo seleccionó Python 3.13.3 con IPython/ipykernel disponible.
- La interfaz abrió `python-ui-check.py`, inició la consola Python y ejecutó `% run -- "python-ui-check.py"`; la salida visible fue `NAPO_PYTHON_UI_OK`.
- La misma campaña ya había validado R/Quarto con `NAPO_REDUCED_R_QUARTO_OK`; junto con el validador y smoke CLI, la reducción temporal de las 36 candidatas tiene evidencia estructural, de runtime y de UI para el flujo analítico.
- La corrida anterior que seleccionó Python 3.14.6 sin `ipykernel` queda como antecedente de configuración de perfil y no como fallo de la reducción. El detalle queda en `reports/napo-reduction-ui-evidence.json`.
- El paquete original, el árbol integrado y los repositorios fuente no fueron modificados por la prueba. Todavía no se autoriza la eliminación permanente: faltan revisión legal, dependencias implícitas y reconstrucción aprobada.

## 2026-10-13 — Reducción aplicada al empaquetado de Napo

- Se aplicó en `build/lib/extensions.ts` una lista explícita de 36 extensiones de lenguajes y tooling ajenos al perfil analítico inicial. La operación solo excluye esas extensiones del paquete Napo; no elimina ni modifica las carpetas fuente del destino y no escribe en RHS-IA, Positron, rhs-agent3, rhs-agent4 ni vscode.
- El paquete real pasó de 126 a 90 manifiestos: 46 clasificados para conservar y 44 que requieren prueba específica. Capibara 4.0.0, Quarto 1.10.18, runtimes PET/Ark/Kallichore, R, Python, notebooks y extensiones de datos permanecen incluidos.
- `build-fast-extensions`, `gulp vscode-darwin-arm64`, `validate-napo-package -- --require-runtime` y `smoke-napo-runtime` pasan después de la reconstrucción.
- La auditoría de superficie del paquete quedó regenerada en `reports/napo-extension-surface-package.json`; sus conteos actuales son deterministas y reflejan el artefacto distribuible, no el árbol fuente completo.

## 2026-10-13 — Coexistencia de kernels y validación UI del paquete final

- La primera prueba UI del paquete recién reducido falló porque un RHS-IA ya abierto ocupaba un puerto IPv4 que el buscador de Positron había considerado libre al probar `localhost`. El kernel informó `ZMQError: Address already in use`; no era una dependencia ausente ni una regresión de la reducción.
- En el receptor Napo se corrigió `src/vs/workbench/api/node/extensionHostProcess.ts` para que el host de extensiones use resolución IPv4-first. Así `PortFinder` conserva su código Positron original y el proceso no confunde un puerto IPv4 ocupado con uno libre en IPv6.
- Con RHS-IA todavía abierto, el paquete final seleccionó puertos IPv4 libres, inició Python 3.13.3/IPython 9.10.0 y ejecutó un archivo desde la UI con `NAPO_PYTHON_UI_OK`.
- Quarto 1.10.18 fue reconocido por la UI, generó `python-ui-check.html` y la previsualización contiene `NAPO_QUARTO_UI_OK`. R, Quarto/R y ambos renders también pasan el smoke de CLI.
- La evidencia final se registra en `reports/napo-final-package-ui-evidence.json`. En la corrida final separada, la UI de R produjo `NAPO_REDUCED_R_QUARTO_OK` con R 4.5.3; R y Quarto/R quedan validados por UI y CLI.

## 2026-10-13 — Auditorías finales del paquete reducido

- El inventario legal reproducible del paquete actual registra 95 manifiestos, 38 archivos legales con hash y 31 entradas de revisión humana. La revisión humana sigue abierta y el inventario no se interpreta como aprobación legal automática.
- La auditoría de superficie del mismo artefacto confirma 90 extensiones, 46 conservadas, 0 candidatas pendientes y 44 que requieren prueba específica; no hay dependencias declaradas sin resolver.

## 2026-10-13 — UI R validada en el paquete final

- Se inició el paquete real `/Users/julius3005/Documents/Github/VSCode-darwin-arm64/Napo.app` con perfil limpio y el workspace temporal de la validación final.
- R 4.5.3 fue descubierto e iniciado por la interfaz de Napo.
- Una celda Quarto/R ejecutó correctamente y devolvió `NAPO_REDUCED_R_QUARTO_OK`.
- La evidencia se consolidó en `reports/napo-final-package-ui-evidence.json`; el proceso de prueba se detuvo al terminar.

## 2026-10-13 — Decisión inicial sobre policy-watcher y servicios externos

- `@vscode/policy-watcher` se clasifica como soporte opcional para políticas administrativas nativas de macOS; no es telemetría, no es un proveedor LLM y no es un servicio externo de Napo.
- En la primera inspección el paquete arrancaba y ejecutaba los flujos analíticos sin el binding nativo; ese estado quedó supersedido por la compilación y empaquetado del binding registrado más abajo.
- Las políticas de producto de Napo —telemetría desactivada, endpoints de actualización vacíos y ausencia de Marketplace por defecto— siguen verificándose con el validador del paquete.
- `git diff --check` pasa.
- La comprobación de estados de las fuentes mostró RHS-IA y vscode limpios; Positron, rhs-agent3 y rhs-agent4 conservan únicamente los cambios locales preexistentes registrados al inicio. No se escribieron repositorios fuente.

## 2026-10-13 — Host IPv4 y conservación de extensiones Positron

- Para respetar la integración sin alteración de las extensiones de datos, se restauró `extensions/positron-supervisor/src/PortFinder.ts` a su código original y se trasladó la compatibilidad de coexistencia al host Napo: `src/vs/workbench/api/node/extensionHostProcess.ts` establece `ipv4first` únicamente cuando `applicationName` es `napo`.
- Las modificaciones incrementales de esta corrección ya no tocan el código de `positron-r` ni de `positron-supervisor`; el cambio queda en el receptor.
- Tras reconstruir el paquete, el typecheck, el empaquetado macOS, el validador estructural y el smoke de R/Python/Quarto pasaron.
- Con RHS-IA abierto, la UI del paquete reconstruido inició Python 3.13.3 sin `ZMQError: Address already in use`; la instancia de prueba se detuvo al terminar.

## 2026-10-13 — Manifiesto verificable de actualización manual

- Se añadió `scripts/napo-release-manifest.mjs` con los comandos `npm run record-napo-release` y `npm run verify-napo-release`.
- El manifiesto de esa reconstrucción registró identidad Napo, versión `1.130.0`, commit `6f848f0ab25df6cc49f939972de8fc8e074f2d2b`, 33.822 archivos y el digest de árbol `7b48177fcd69820ba489cf9b8a26b58b29669a157639b3b9da30a0ab5e1`.
- La verificación posterior pasó. El procedimiento es local y no descarga, instala ni actualiza automáticamente; todavía faltan firma de publicación y definición del canal público.
- La auditoría del artefacto reconstruido volvió a confirmar 90 extensiones, 46 conservadas, 0 candidatas aisladas, 44 por probar y 0 dependencias declaradas sin resolver. El inventario legal confirma 95 manifiestos, 38 archivos legales con hash y 31 revisiones humanas.
- La regresión Positron posterior al traslado de la corrección IPv4 pasó: 415 archivos, 4.946 pruebas aprobadas, 3 fallos esperados y 21 omitidas. El aviso de mapa fuente de DOMPurify es diagnóstico del entorno de pruebas y no produjo fallos.

## 2026-10-13 — Binding nativo de policy-watcher empaquetado

- `@vscode/policy-watcher` se compiló localmente para macOS arm64 con N-API usando el toolchain disponible; no se modificaron repositorios fuente.
- El binding quedó dentro de `Napo.app/Contents/Resources/app/node_modules.asar.unpacked/@vscode/policy-watcher/build/Release/vscode-policy-watcher.node`.
- El arranque con perfil limpio ya no registra el aviso de binding ausente. `scripts/validate-napo.mjs` comprueba presencia, integridad SHA-256 y permiso de ejecución del binding integrado y empaquetado.

## 2026-10-13 — Compilación reproducible de policy-watcher y regresión final

- Se añadió `node-gyp@13.1.0` como dependencia de desarrollo fijada y `scripts/build-napo-policy-watcher.mjs` como tarea reproducible del destino. El flujo `gulp vscode-darwin-arm64` ejecuta automáticamente la construcción para macOS arm64; no depende de una compilación manual previa.
- La tarea fue probada con una recompilación forzada del binding N-API y luego con el empaquetado completo. Si el binario ya existe, se valida y se conserva; `NAPO_FORCE_POLICY_WATCHER_BUILD=1` permite reconstruirlo explícitamente.
- El paquete reconstruido pasó typecheck, validador estructural con runtime, smoke de Quarto/R/Python-Jupyter, auditoría de superficie, inventario legal, manifiesto de release y verificación de digest.
- El manifiesto vigente registra 33.822 archivos y el digest de árbol `24ce4c9c4cd19df4513c82bbfa68d6bfa72f85abdc922661f7973b13f2f168f2`.
- `test:positron` pasó: 415 archivos, 4.946 pruebas aprobadas, 3 fallos esperados y 21 omitidas. El aviso de mapa fuente de DOMPurify y la advertencia deprecada de Node no produjeron fallos.
- No se escribieron repositorios fuente. Siguen abiertas únicamente la revisión legal humana, la firma/notarización y la definición del canal público de publicación/actualización.

## 2026-10-13 — Auditoría de firma del artefacto

- La aplicación local `Napo.app` tiene actualmente una firma ad hoc de desarrollo (`Identifier=Electron`, `TeamIdentifier` ausente); esto permite la prueba local, pero no constituye una firma de distribución.
- `codesign --verify --deep --strict` y `spctl --assess --type execute` no pasan porque el artefacto no tiene una firma de recursos publicable. La conclusión es explícita: el paquete está validado técnicamente para desarrollo y pruebas, pero todavía no es un release macOS publicable.
- No se intentó firmar ni notarizar porque eso requiere una identidad de distribución, credenciales y una decisión del canal de publicación. El hash del manifiesto no se presenta como sustituto de esa firma.

## 2026-10-13 — Smoke dinámico de privacidad durante el arranque

- Se añadió `scripts/smoke-napo-privacy.mjs` y el comando `npm run smoke-napo-privacy`.
- La prueba inicia el `Napo.app` real con perfil y workspace temporales, conserva activas las extensiones del paquete, observa el árbol de procesos durante el arranque y registra sus conexiones TCP/UDP.
- La corrida vigente de 12 segundos observó 7 procesos del árbol de Napo, 0 conexiones de red y 0 conexiones no locales. Evidencia: `reports/napo-privacy-smoke.json`, estado `pass`.
- El smoke no pretende probar proveedores configurados explícitamente por la persona usuaria; verifica la invariante de que el arranque limpio no inicia telemetría ni conexiones remotas silenciosas.

## 2026-10-13 — Puerta automatizada de firma macOS

- Se añadió `scripts/audit-napo-macos-signature.mjs` y el comando `npm run audit-napo-macos-signature`.
- La auditoría registra identidad, equipo, autoridades, verificación estricta de `codesign` y evaluación `spctl` en `reports/napo-macos-signature.json`.
- El paquete vigente queda clasificado como `development-only`; la variante `--require-distribution` falla con código 1, como debe hacerlo mientras la aplicación tenga firma ad hoc y no exista una identidad de distribución.
- La puerta de firma queda automatizada y explícita; no se intentó fabricar una firma ni una notarización sin credenciales válidas.

## 2026-10-13 — Puerta consolidada de aceptación técnica

- Se añadió `scripts/validate-napo-gate.mjs` y el comando `npm run validate-napo-gate`.
- La corrida completa del paquete actual pasó estructura, privacidad, Capibara completa, PET, Ark, Kallichore, Quarto, R, Python/Jupyter, renderizados Quarto, smoke de privacidad, superficie de extensiones, inventario legal y manifiesto de release.
- Resultado: `ACEPTADA (desarrollo técnico)`. La misma puerta con `--require-distribution` conserva la exigencia de firma macOS real y no debe pasar con la firma ad hoc actual.
- El smoke de privacidad fue endurecido para aislar el grupo de procesos, esperar su terminación y forzar solo ese grupo si fuera necesario. La corrida final dejó cero procesos temporales residuales.
- No se modificaron repositorios fuente.

## 2026-10-13 — Integridad de extensiones de datos contra RHS-IA

- Se añadió `scripts/audit-napo-data-extension-integrity.mjs` para comparar la transferencia efectiva del destino contra `../RHS-IA`, que es la línea base de la que nació Napo.
- La corrida vigente comparó 17 extensiones de análisis de datos: 0 diferencias funcionales de código y 683 diferencias clasificadas como empaquetado, localización, archivos generados o runtimes transferidos (`positron-python` vendor, PET/Ark/recursos, metadatos del receptor y `tsconfig.tsbuildinfo`).
- La comparación inicial contra el Positron actual no se usa como criterio de integridad porque corresponde a otra revisión y muestra evolución legítima de upstream; quedó separada de la auditoría de transferencia.
- La comprobación de integridad funcional se incorporó a `validate-napo-gate` y falla si aparece una diferencia no autorizada en el código de las extensiones.

## 2026-10-12 — Auditoría de cierre y corte canónico

- Se creó `AUDITORIA_CIERRE_NAPO.md` para separar el estado actual de los diagnósticos históricos y evitar que el equipo trate como pendientes R, Python, Quarto o Capibara ya validados.
- La verificación `npm run verify-napo-release` pasó con el digest `24ce4c9c4cd19df4513c82bbfa68d6bfa72f85abdc922661f7973b13f2f168f2`.
- La puerta completa `npm run validate-napo-gate -- --package ../VSCode-darwin-arm64/Napo.app` pasó y terminó `ACEPTADA (desarrollo técnico)`.
- El corte vigente confirma 90 extensiones en el paquete: 46 conservadas, 44 que requieren prueba específica y 0 dependencias declaradas sin resolver.
- El inventario legal vigente registra 95 manifiestos, 38 archivos legales con hash y 31 entradas para revisión humana.
- El manifiesto vigente registra 33.538 archivos. La firma sigue clasificada como `development-only`; la variante `--require-distribution` debe permanecer fallando hasta contar con firma y notarización reales.
- La auditoría de estados volvió a mostrar que solo RHS-IA y vscode están limpios; Positron, rhs-agent3 y rhs-agent4 conservan cambios preexistentes. Napo no escribió ninguno de esos repositorios.

## 2026-10-12 — Superficie de capacidades de Napo

- La lectura de Capibara confirmó que la extensión completa ya incluye skills para programación analítica R/Python y simulaciones, modelado predictivo reproducible, Quarto, informes, citas sustentadas, RAG, OKF y planificación institucional CNPS/NHWA.
- Se añadió `scripts/audit-napo-capability-surface.mjs` y el comando `npm run audit-napo-capabilities`. Compara archivo por archivo y por SHA-256 las ocho capacidades requeridas entre `extensions/rhs-agent4` y `Napo.app`.
- La auditoría pasó: 8 capacidades comprobadas, 8 aprobadas, sin diferencias de transferencia. El reporte es `reports/napo-capability-surface.json`.
- `validate-napo-gate` ahora incluye esta comprobación y volvió a terminar `ACEPTADA (desarrollo técnico)`.
- La evidencia demuestra transferencia completa de capacidades, no todavía la ejecución de cada flujo de escenarios o planificación; esas pruebas funcionales quedan como el siguiente incremento.

## 2026-10-12 — Smoke de modelación, simulación y escenarios

- Se añadió `scripts/smoke-napo-modeling.mjs` y el comando `npm run smoke-napo-modeling`.
- La prueba ejecuta en R un modelo lineal, una simulación reproducible y una comparación de escenarios; en Python repite el mismo contrato; después genera un informe Quarto HTML.
- El smoke pasó en el paquete Napo: `NAPO_R_MODEL_SIMULATION_SCENARIO_OK`, `NAPO_PYTHON_MODEL_SIMULATION_SCENARIO_OK` y `NAPO_QUARTO_MODELING_OK`.
- La prueba se incorporó a `validate-napo-gate`, que volvió a terminar `ACEPTADA (desarrollo técnico)`.
- Esta evidencia valida los motores y la reproducibilidad del flujo analítico. Queda pendiente la prueba desde la interfaz de Capibara para demostrar que el agente coordina escenarios, sensibilidad, conocimiento legal y planificación con las mismas salvaguardas.

## 2026-10-12 — Coordinación Capibara–Positron en Napo

- Se validó en un perfil limpio del paquete Napo la ruta funcional canónica `Capibara → positron_execute_code → sesión R viva`.
- La interfaz mostró el código y exigió aprobación visible; después la sesión R 4.5.3 ejecutó un modelo lineal, una simulación reproducible y una comparación de dos escenarios.
- La evidencia observable incluyó el marcador `NAPO_AGENT_MODELING_OK`, las variables `fit`, `trajectory`, `scenarios`, `x` e `y`, 100 observaciones simuladas y pendiente 3.0000000000000004.
- El proveedor usado fue un mock local loopback, solo para hacer determinista la selección de herramienta; no forma parte de Napo ni abre conexiones externas.
- Se dejó el registro en `reports/napo-capibara-positron-e2e.json`. Quedan como siguiente incremento sensibilidad, conocimiento legal versionado y planificación coordinada desde la interfaz.

## 2026-10-12 — Sensibilidad coordinada por Capibara

- Se validó desde la interfaz la ruta `Capibara → positron_execute_code → sesión R viva` para sensibilidad de escenarios.
- La UI mostró la herramienta y exigió aprobación; R 4.5.3 evaluó shocks de -10%, 0% y +10%, mostró una tabla de tres filas y calculó una pendiente aproximada de 100.
- La sesión produjo el marcador `NAPO_SENSITIVITY_OK`; la evidencia queda en `reports/napo-capibara-sensitivity-e2e.json`.
- El primer intento del arnés tenía saltos de línea mal escapados y fue descartado; se corrigió el mock y la segunda corrida pasó con resultado observable. No se modificó Napo para acomodar la prueba.
- Quedan como siguiente incremento conocimiento legal versionado y planificación coordinada desde la interfaz.

## 2026-10-12 — Manifiesto de release actualizado

- La puerta consolidada detectó que el manifiesto de release conservaba un conteo anterior de archivos del paquete.
- Se regeneró `reports/napo-release-manifest.json` desde el `Napo.app` vigente y `npm run verify-napo-release` pasó.
- El estado actual del paquete es 34.191 archivos con digest de árbol `0fa64c7c515095744061cb388444588551a45fdf0c6b85baf1ef95e061c32230`.
- La puerta completa volvió a pasar como `ACEPTADA (desarrollo técnico)`; las advertencias de licencias y la firma `development-only` siguen correctamente abiertas.

## 2026-10-12 — Planificación basada en fuente versionada desde Capibara

- Se validó desde la interfaz de Napo la ruta `Capibara → positron_execute_code → sesión R viva` para planificación basada en una fuente local versionada.
- La fuente de prueba `Docs/planning-policy.md` declara `EC-HWF`, versión `2026.01`, jurisdicción Ecuador y fecha efectiva `2026-01-15`. El cálculo produjo capacidad base 100, objetivo 120, brecha 20 y una asignación 15/5 entre staffing y training.
- La UI mostró el comando `positron_execute_code`, exigió aprobación visible y marcó la ejecución como completada en R 4.5.3. El marcador material `NAPO_PLANNING_OK` quedó en el workspace de prueba.
- La primera comprobación del marcador se hizo demasiado pronto y se descartó como evidencia; una segunda corrida con el mismo paquete confirmó el marcador y el resultado. El mock es loopback-only y no forma parte de Napo.
- Evidencia: `reports/napo-capibara-planning-e2e.json`. Esto prueba coordinación local de fuente versionada y cálculo, no validez legal ni sustitución de revisión institucional.
- No se modificó ningún repositorio fuente.

## 2026-10-12 — Evidencia legal clasificable del paquete

- Se fortaleció `scripts/audit-napo-license-inventory.mjs` para clasificar la evidencia por manifiesto: licencia declarada, archivo local sin declaración, referencia a archivo ausente y ausencia de declaración/archivo.
- La corrida sobre `Napo.app` conserva 95 manifiestos, 38 archivos legales con hash y 31 casos para revisión humana, ahora desglosados como 64 declarados, 29 sin declaración ni archivo local detectable, 1 referencia sin archivo localizado y 1 archivo local sin declaración.
- El reporte `reports/napo-license-inventory-package.json` conserva `licenseEvidenceSummary` y `decision=human-review-required`. La clasificación mejora la trazabilidad, pero no infiere licencias ni sustituye revisión jurídica.

## 2026-10-12 — Puerta estricta de legalidad para distribución

- El inventario legal ahora acepta `--require-human-review`; falla con código 1 cuando existe cualquier manifiesto pendiente de confirmación humana.
- `validate-napo-gate --require-distribution` activa esa revisión estricta antes de evaluar la firma. La corrida actual falla deliberadamente por los 31 casos pendientes, no por un defecto del runtime.
- La aceptación técnica ordinaria sigue pasando. Napo queda correctamente clasificado como artefacto de desarrollo validado, no como release distribuible.
- La regla evita que la afirmación de “software libre/redistribuible” se convierta en una autorización automática: primero deben confirmarse licencias, avisos, binarios, dependencias transitivas, modelos, marcas y condiciones aplicables.
- No se modificó ningún repositorio fuente.

## 2026-10-12 — Guardia automatizada de fuentes de solo lectura

- Se añadió `scripts/audit-napo-source-readonly.mjs` y el comando `npm run audit-napo-source-readonly`.
- El baseline `reports/napo-source-readonly-baseline.json` conserva HEAD, estado Git y digests de RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode tal como fueron observados; los cambios preexistentes no se reinterpretan como cambios de Napo.
- `validate-napo-gate` ejecuta esta comprobación antes del resto de puertas. Si cambia una fuente, la validación falla y no actualiza el baseline automáticamente.
- La prueba de verificación pasó para las cinco fuentes. No se modificó ningún repositorio fuente.

## 2026-10-12 — Roles de superficie VS Code para Napo

- `audit-napo-extension-surface.mjs` ahora registra `surfaceRole`, `recommendation` y `reviewRationale` para no confundir una clasificación conservadora con una decisión de eliminación.
- En el paquete actual, 46 extensiones se conservan, 23 tienen recomendación inicial de aplazamiento y 21 requieren revisión por posibles contratos del receptor o del producto.
- Las 23 primeras se concentran en 9 recursos de lenguaje sin activación, 3 herramientas de depuración/profiling JavaScript y 11 temas visuales alternativos. Esto responde con evidencia inicial qué partes de VS Code no son necesarias para el núcleo analítico, pero todavía no autoriza retirarlas.
- La auditoría consolidada sigue pasando y no hay dependencias declaradas sin resolver. No se modificó Capibara, ninguna extensión de datos ni ningún repositorio fuente.

## 2026-10-12 — Actualización y recuperación reversibles

- Se añadió `scripts/test-napo-update-recovery.mjs` y el comando `npm run test-napo-update-recovery`.
- La prueba usa clones temporales enlazados del paquete, sin tocar `Napo.app`: valida la versión `1.130.1`, su identidad y digest; activa el candidato en un puntero de estado temporal; rechaza un candidato que intenta activar telemetría; y restaura exactamente el estado anterior tras un fallo simulado.
- Evidencia: `reports/napo-update-recovery.json`. Esto prueba el protocolo local de verificación y rollback, no firma, notarización, publicación ni descarga automática.
- La nueva prueba quedó incorporada a `validate-napo-gate`. No se modificó ningún repositorio fuente.

## 2026-10-12 — Gobernanza de conocimiento versionado

- Se añadió `NAPO_CONOCIMIENTO.md` como contrato del receptor para fuentes institucionales y legales.
- `scripts/validate-napo-knowledge-source.mjs` exige identificador, versión, jurisdicción, autoridad, fecha efectiva, procedencia, hash, licencia y estado de revisión; `--require-approved` bloquea fuentes pendientes.
- `npm run test-napo-knowledge-governance` pasó cuatro comprobaciones: fuente pendiente trazable pero no utilizable, bloqueo por falta de aprobación humana, detección de hash cambiado y aceptación de una fuente aprobada de prueba.
- Evidencia: `reports/napo-knowledge-governance.json`. El fixture no es una fuente legal y no se modificó Capibara ni ningún repositorio fuente.

## 2026-10-12 — Smoke de activación de extensiones

- Se añadió `scripts/smoke-napo-extension-startup.mjs` para observar el paquete macOS real con perfil limpio, logs de traza y workspace temporal.
- Las 21 extensiones que permanecían bajo revisión por contrato fueron observadas sin errores reales de activación. El reporte separa `startup-observed` de `not-triggered-resource` y registra sus límites.
- El primer detector produjo un falso positivo por advertencias normales del File Watcher sobre archivos opcionales inexistentes; se corrigió para exigir errores de activación reales y la segunda corrida pasó con 0 errores.
- Evidencia: `reports/napo-extension-startup.json`. No se modificó el paquete, Capibara, las extensiones de datos ni los repositorios fuente.
- Se actualizó `AUDITORIA_LEGAL_NAPO.md`. No se modificó ningún repositorio fuente.

## 2026-10-12 — Compuerta técnica consolidada posterior al smoke

- `npm run validate-napo-gate -- --package ../VSCode-darwin-arm64/Napo.app` terminó `ACEPTADA (desarrollo técnico)` después de incorporar el smoke de arranque de extensiones.
- Pasaron la guardia de solo lectura de las cinco fuentes, privacidad, integridad de extensiones de datos, capacidades analíticas, runtime R/Python/Quarto, modelación, simulación, escenarios, recuperación, gobernanza de conocimiento, arranque de extensiones, superficie y manifiesto de release.
- Permanecen abiertas únicamente las puertas ya declaradas: revisión legal humana de 31 entradas, firma/notarización, canal de distribución y pruebas funcionales específicas de extensiones. La variante `--require-distribution` debe seguir bloqueando la publicación.
- La auditoría final confirmó que los repositorios fuente no cambiaron respecto al baseline: RHS-IA y vscode siguen limpios; Positron, rhs-agent3 y rhs-agent4 conservan solo sus cambios preexistentes.

## 2026-10-12 — Reducción reversible de 23 extensiones aplazables

- Se probó un clon temporal de `Napo.app` retirando las 23 extensiones clasificadas inicialmente como aplazables: recursos de lenguaje ajenos, temas alternativos y depuración/profiling de JavaScript.
- El clon pasó `validate-napo` con runtimes, `smoke-napo-runtime` y el smoke de arranque del host; no se observaron errores de activación en las 21 extensiones que permanecían bajo revisión.
- La decisión se aplicó únicamente en `build/lib/extensions.ts`: el paquete real queda con 67 extensiones, 46 conservadas y 21 bajo prueba específica. Las carpetas fuente permanecen intactas y la reversión es posible desde la lista del empaquetador.
- La primera reconstrucción reveló que las tres extensiones de depuración JavaScript entraban por el bloque de Marketplace; se corrigió el filtro común de extensiones integradas y se reconstruyó el paquete hasta obtener 67 extensiones.
- Evidencia: `reports/napo-deferred-23-reduction.json`, `reports/napo-deferred-23-startup.json` y `reports/napo-extension-surface-package.json`. No se modificó ningún repositorio fuente.

## 2026-10-12 — Aceptación técnica del paquete reducido

- La primera corrida de la compuerta detectó únicamente un manifiesto de release obsoleto; se regeneró con el paquete reducido y `verify-napo-release` confirmó el digest `d742bd216862ec5732d5c12922f184d06ea6fbbf7a6824c78dcdfe123da45e77` para 33.621 archivos.
- La segunda corrida de `validate-napo-gate --package ../VSCode-darwin-arm64/Napo.app` terminó `ACEPTADA (desarrollo técnico)` con 67 extensiones, 46 conservadas, 21 bajo prueba, 0 dependencias declaradas sin resolver, 31 revisiones legales pendientes y firma `development-only`.
- La variante `--require-distribution` continúa correctamente cerrada hasta resolver revisión legal, firma/notarización y canal de entrega.

## 2026-10-12 — Auditoría de contratos de extensiones bajo revisión

- Se añadió `scripts/audit-napo-extension-contracts.mjs` y se incorporó a `validate-napo-gate` después de la auditoría de superficie.
- Las 21 extensiones restantes pasan la comprobación de manifiestos, entradas principales de escritorio, comandos, vistas, menús y recursos declarados: 0 errores.
- Se registran 5 advertencias explicadas: cuatro entradas `browser` opcionales no materializadas en el paquete macOS y una referencia a `workbench.action.closeFolder`, provista por el host.
- Evidencia: `reports/napo-extension-contracts-package.json`. La comprobación es estática y no sustituye las pruebas UI de cada flujo; no se modificó ningún repositorio fuente.

## 2026-10-12 — Primera tanda de evidencia UI de extensiones

- Se validó dentro de `Napo.app`, con perfil temporal, la apertura de `RHS-IA: Abrir documentación`; el webview mostró la documentación local y su contenido inicial.
- Se validó `Explorador: Abrir explorador integrado` con `data:text/html,<h1>NAPO_BROWSER_OK</h1>`; el navegador mostró el marcador sin tráfico externo.
- Se abrió `screenshots/napo-playwright-electron.png`; `Image Preview` mostró el archivo, tamaño 78.99 KB y dimensiones 2374x1676.
- `scripts/validate-napo-extension-ui-evidence.mjs` liga estas 3 observaciones al digest vigente y exige limitaciones explícitas. Evidencia: `reports/napo-extension-ui-evidence.json`.
- Esto cubre 3 flujos concretos; quedan 18 extensiones/contratos para UI específica. No se modificó ningún repositorio fuente.

## 2026-10-12 — Compuerta consolidada con contratos estáticos

- La corrida completa posterior a la nueva auditoría terminó `ACEPTADA (desarrollo técnico)`.
- El paquete vigente conserva 67 extensiones, el manifiesto `d742bd216862ec5732d5c12922f184d06ea6fbbf7a6824c78dcdfe123da45e77`, telemetría desactivada, Quarto/R/Python operativos y Capibara completa.
- La aceptación no cierra la UI funcional de las 21 extensiones ni la distribución pública; permanecen revisión legal, firma/notarización, canal de entrega y pruebas específicas de comandos/vistas.

## 2026-10-12 — Diferencia entre confianza del workspace y entorno Python

- En la instancia interactiva de Napo, el workspace temporal inició en modo restringido; al confiar explícitamente `/tmp/napo-rea-workspace`, se habilitaron las funciones de trabajo y RHS-Agent quedó operativo.
- La bienvenida mostró R como `configurado correctamente` y detectó `/opt/homebrew/bin/python3`.
- El perfil local usado para esta comprobación solo pasó 2 de 4 verificaciones de Python porque no tiene un `ipykernel` utilizable. No se instaló nada ni se alteró el entorno del usuario.
- Esta observación es una condición del perfil, no una ausencia demostrada del paquete. El smoke reproducible con entorno preparado sigue validando Python/Jupyter y los renders de Quarto; la evidencia UI queda en `reports/napo-extension-ui-evidence.json` con estado `partial` para este punto.
- No se modificó ningún repositorio fuente.

## 2026-10-12 — Evidencia UI de lenguajes y Markdown

- En un editor sin título del paquete Napo se comprobaron los contratos de `vscode.json`, `vscode.make`, `vscode.markdown`, `vscode.yaml`, `vscode.html`, `vscode.javascript`, `vscode.diff` y `vscode.prompt` mediante `Change Language Mode`.
- Markdown abrió además `Markdown: Open Preview to the Side` y creó la pestaña `[Vista previa] Untitled-1` usando contenido local.
- Estas ocho comprobaciones se ligaron al digest vigente en `reports/napo-extension-ui-evidence.json` y quedaron incorporadas como requisitos del validador UI.
- La cola específica de UI baja de 18 a 10 extensiones: depuración, conflictos, Mermaid, autenticación, paquete de idioma, sugerencias, Dev Containers, ejecución de aplicaciones y skills.
- No se modificó Capibara, ninguna extensión de datos ni ningún repositorio fuente.

## 2026-10-12 — Paquete de idioma español

- La instancia de Napo ejecutó `Configure Display Language` y mostró `español (es) (Actual)` en el selector.
- La interfaz observable permaneció localizada en español; la observación quedó ligada al digest del paquete y exigida por el validador UI.
- La cola de UI específica baja de 10 a 9 extensiones. No se modificó ningún repositorio fuente.

## 2026-10-12 — Preview Mermaid en Markdown

- La preview Markdown de Napo procesó un bloque Mermaid local y mostró el diagrama visible `NAPO` → `OK`, con controles de zoom, paneo y reinicio.
- La primera corrida había mostrado un error porque `typeText` alteró la entrada; se repitió usando pegado exacto y se observó el resultado correcto.
- El archivo de referencia de Capibara quedó sin guardar y el repositorio fuente permaneció intacto. La cola de UI específica baja de 9 a 8 extensiones.

## 2026-10-12 — Auto Attach controlado

- La paleta de comandos de Napo mostró `Debug: Toggle Auto Attach`; al ejecutarlo abrió el selector local con el estado vigente `Deshabilitado` y las alternativas `Siempre`, `Inteligente` y `Solo con marca`.
- No se lanzó ningún proceso ni se modificó la configuración. La evidencia UI queda ligada al paquete y la cola específica baja de 8 a 7 extensiones.

## 2026-10-12 — Conflicto local detectado y accionable

- Un editor sin título con marcadores `<<<<<<<`, `=======` y `>>>>>>>` activó el contrato de `vscode.merge-conflict`.
- La UI mostró navegación entre conflictos y las cuatro acciones de resolución; el contenido permaneció sin guardar.
- La evidencia quedó ligada al digest del paquete y la cola específica baja de 7 a 6 extensiones. No se modificó ningún repositorio fuente.

## 2026-10-12 — Reconstrucción posterior a la decisión de superficie

- `npm run gulp vscode-darwin-arm64` reconstruyó Napo con la nueva lista de exclusión, sin modificar las fuentes.
- El paquete contiene 63 extensiones: 46 conservadas y 17 bajo prueba específica. Capibara y `positron-run-app` permanecen; las cuatro integraciones aplazadas no están dentro del `.app`.
- Pasan `validate-napo-package -- --require-runtime`, `audit-napo-extension-surface`, `audit-napo-extension-contracts` y `audit-napo-license-inventory`.
- El inventario legal queda en 68 manifiestos, 35 archivos legales con hash y 30 revisiones humanas pendientes.
- El release manifest se regeneró y verificó con 33.206 archivos y digest `aa6bc7966d580acec705a333dae7a6dbc6983af03a09b8c2b618b66d64a43e60`.
- La evidencia UI se ligó al nuevo digest y conserva 15 flujos `pass`; quedan `debug-server-ready` y `positron-run-app` para pruebas específicas.
- `audit-napo-source-readonly -- --verify` confirmó que RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode conservan exactamente su baseline.

## 2026-10-12 — `positron-run-app` probado en el receptor Napo

- Desde un editor Python, Napo mostró `Run Flask App in Terminal`, creó la terminal y armó el comando esperado mediante la integración de `positron-run-app`.
- El intérprete del perfil no tenía Flask; el error fue visible y recuperable, sin instalación silenciosa.
- Como prueba local sin dependencias, `python3 -m http.server` produjo `http://127.0.0.1:8765/`. Napo detectó el enlace, ofreció `Open in Viewer pane` y mostró la lista del workspace en el Viewer.
- El proceso HTTP se detuvo limpiamente. La evidencia se añadió a `reports/napo-extension-ui-evidence.json` y queda ligada al digest del paquete.

## 2026-10-12 — Límite de UI de `debug-server-ready`

- La extensión declara un contrato de depuración (`serverReadyAction`) y se activa en `onDebugResolve`; no declara comandos, vistas ni un panel independiente.
- Su comportamiento depende de que otra sesión de depuración emita una línea compatible con `listening on port ...` o una URI y de que la configuración seleccione una acción (`openInViewer`, navegador, depuración o nueva sesión).
- La auditoría estática confirma el manifiesto, la entrada principal y el recurso empaquetado sin errores. La evidencia UI específica queda pendiente porque requiere una sesión de depuración real con esa configuración; no se marcará como pass por mera presencia del contrato.

## 2026-10-12 — Fixture reproducible para `debug-server-ready`

- Se añadió únicamente en Napo `test/napo-fixtures/server_ready.py`, un servidor HTTP de la biblioteca estándar que imprime `listening on port 8767` y responde `NAPO_DEBUG_SERVER_READY_OK`.
- Se añadió en `.vscode/launch.json` la configuración `Napo fixture: debug server ready`, usando el intérprete Python activo y `serverReadyAction.openInViewer`; no instala paquetes ni contacta servicios externos.
- La fixture compila y `git diff --check` pasa. La sesión UI de esta corrida cargó el depurador Python, pero abrió la plantilla del depurador en lugar de ofrecer la configuración agregada; por ello la evidencia sigue en estado pendiente y no se marca `pass`.
- `audit-napo-source-readonly -- --verify` volvió a confirmar que RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode no fueron modificados.

## 2026-10-12 — Paquete de revisión legal trazable

- La compuerta consolidada volvió a pasar como `ACEPTADA (desarrollo técnico)` con el paquete vigente: 63 extensiones, 46 conservadas, 17 bajo prueba, 0 dependencias manifiestas sin resolver, 16 flujos UI pass, 30 revisiones legales humanas y firma `development-only`.
- Se creó `scripts/audit-napo-license-review-packet.mjs` y `npm run audit-napo-license-review-packet`; genera `reports/napo-license-review-packet.json` ligado al digest `aa6bc7966d580acec705a333dae7a6dbc6983af03a09b8c2b618b66d64a43e60`.
- El paquete reúne los 30 manifiestos pendientes, hashes de sus manifiestos, candidatos de procedencia y archivos legales observables. Hay candidatos para los 30 casos; no se infiere ninguna licencia y las decisiones permanecen vacías para revisión humana.
- La verificación de solo lectura volvió a pasar para RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode. No se modificó código funcional de Capibara ni de las extensiones de datos.

## 2026-10-12 — Receptor `debug-server-ready`: límite confirmado en Napo

- La configuración `Napo fixture: debug server ready (node)` apareció en el selector de depuración y pudo seleccionarse; esto confirma que el receptor lee la configuración del workspace.
- Al iniciar la configuración, Napo informó que el tipo de depuración `node` no es compatible con el paquete minimalista y ofreció instalar una extensión externa. No se instaló nada: Napo debe permanecer sin dependencias externas obligatorias.
- La fixture Node local funciona fuera de Napo en `127.0.0.1:8768` y devuelve `NAPO_DEBUG_SERVER_READY_NODE_OK`; esta prueba valida la fixture, no el receptor dentro del workbench.
- La fixture Python también funciona fuera de Napo, pero el depurador integrado termina con `Timed out waiting for launcher to connect` antes de ejecutar el proceso. No se convirtió en un `pass` por inferencia.
- Decisión vigente: `vscode.debug-server-ready` se conserva bajo revisión porque es un receptor genérico y no añade un proveedor por sí mismo. No se agregará un depurador Node ni se instalarán extensiones externas solo para cerrar esta prueba. La compuerta técnica sigue siendo `ACEPTADA (desarrollo técnico)`, con esta limitación abierta.
- No se modificaron RHS-IA, Positron, rhs-agent3, rhs-agent4 ni vscode.

## 2026-10-13 — Revalidación de compuerta después de la prueba del receptor

- `validate-napo-extension-ui-evidence` pasa con 16 flujos `pass`, una observación `partial`, cuatro limitaciones declaradas y el digest vigente `aa6bc7966d580acec705a333dae7a6dbc6983af03a09b8c2b618b66d64a43e60`.
- `verify-napo-release`, `git diff --check` y `audit-napo-source-readonly -- --verify` pasan. Los cinco repositorios fuente continúan intactos.
- La compuerta consolidada conserva el estado `ACEPTADA (desarrollo técnico)`: actualización/rollback `pass`, privacidad `pass`, arranque de 17 extensiones sin errores y runtime analítico comprobado.
- Esto no autoriza todavía una distribución pública: siguen abiertas la revisión legal humana, firma/notarización, selección de canal y la limitación específica del adaptador de depuración.

## 2026-10-13 — Endurecimiento del límite de conocimiento

- Se reforzó `scripts/validate-napo-knowledge-source.mjs` sin tocar Capibara ni los repositorios fuente.
- El límite ahora valida fechas calendario reales, manifiestos dentro de la raíz autorizada, `contentPath` relativo, ausencia de traversal, ausencia de symlink hacia fuera de la raíz, archivo regular y hash exacto. `sourceUri` permanece como procedencia declarativa: el validador no hace red ni descarga.
- `npm run test-napo-knowledge-governance` pasó siete comprobaciones: fuente pendiente trazable, bloqueo por falta de aprobación, hash alterado, fuente aprobada, fecha imposible, traversal y symlink externo.
- Esto cierra una brecha de seguridad del contrato de conocimiento, pero no convierte una fuente en jurídicamente válida: la revisión humana e institucional continúa siendo obligatoria.

## 2026-10-13 — Manifiesto reproducible y limpieza del artefacto Napo

- La compuerta completa encontró primero 16 archivos `__pycache__/*.pyc` generados por el runtime de Capibara y después tres archivos equivalentes generados por Jupyter dentro de Quarto. Eran residuos de ejecución, no componentes funcionales que debieran distribuirse.
- Se añadió `extensions/rhs-agent4/.vscodeignore` y reglas específicas al `.gitignore` del destino para impedir que esos residuos entren en el artefacto; no se modificó el repositorio fuente `rhs-agent4` ni ningún otro repositorio fuente.
- `scripts/smoke-napo-extension-startup.mjs` ahora limpia únicamente directorios `__pycache__` generados bajo el árbol explícito de la aplicación después de detener la prueba. No toca código funcional, fuentes ni el perfil del usuario.
- Se reconstruyó el paquete macOS arm64 y se verificó el manifiesto final: 32.927 archivos, digest `48d4f535ea42dd173a2fe753b6b28ada3c197a689444de18af677b7426c132c5`, sin `__pycache__` ni `.pyc` en el artefacto.
- La compuerta completa pasó estructura, runtimes R/Python/Quarto, privacidad, recuperación, gobernanza de conocimiento, arranque de 17 extensiones sin errores, contratos, evidencia UI, inventario legal, manifiesto y firma clasificada como `development-only`.
- La aceptación continúa siendo `ACEPTADA (desarrollo técnico)`. Revisión legal humana, firma/notarización y canal de distribución siguen abiertas; no es una autorización de release público.

## 2026-10-13 — Verificación del código del destino

- `npm run typecheck-client` pasa sin diagnósticos.
- `npm run test:positron` pasa con 415 archivos de prueba: 4.946 pruebas aprobadas, 3 fallos esperados y 21 omitidas. Se observó únicamente el aviso de mapa de fuente faltante de DOMPurify y una advertencia deprecada de Node durante la ejecución.
- `npm run test:positron:check-ts` todavía falla con 378 diagnósticos del árbol heredado de Vitest/Positron, principalmente tipos globales de `DebugProtocol`, contratos de notebooks y mocks. La comparación contra `git diff` no encontró ninguno de esos archivos entre los cambios de Napo; no se alterará código transferido para silenciar la deuda.
- Esta deuda queda separada de la aceptación del paquete: la compilación del cliente, las pruebas ejecutables y la compuerta consolidada pasan. Debe resolverse en una iteración propia de sincronización del toolchain, con baseline antes de tocar archivos.

## 2026-10-13 — Bloqueo preventivo de distribución

- `validate-napo-gate --require-distribution` rechazó el artefacto en la etapa de inventario legal porque permanecen 30 manifiestos sin revisión humana.
- La falla es intencional y ocurre antes de presentar Napo como distribuible; la firma ad hoc y la notarización siguen siendo puertas separadas.
- La aceptación técnica sin `--require-distribution` permanece en `ACEPTADA (desarrollo técnico)`. No se habilita ningún canal automático ni se modifica el paquete para esquivar la puerta.

## 2026-10-13 — Causa del límite `debug-server-ready`

- La lectura del paquete confirma que `vscode.debug-server-ready` está presente, declara su contrato y arranca sin errores.
- El paquete sí contiene `positron-python`, pero no contiene `ms-python.debugpy`; tampoco contiene un proveedor Node/js-debug. `positron-python` busca el API del depurador `ms-python.debugpy` para construir el adaptador DAP.
- Por eso la fixture Python llega al timeout del launcher y la fixture Node ofrece instalar una extensión externa. El receptor no debe marcar este flujo como `pass` solo porque su configuración y detector estén presentes.
- Decisión vigente: conservar `debug-server-ready` como receptor genérico bajo revisión y no instalar ni descargar proveedores externos automáticamente. Si se decide empaquetar `debugpy` en el futuro, deberá ser una transferencia completa, con licencia, avisos, procedencia, prueba de privacidad y nueva compuerta; no se modifica `positron-python` ni Capibara para ocultar la ausencia.

## 2026-10-13 — Contrato estático de privacidad del paquete Napo

- La telemetría del host queda desactivada por dos capas: `product.json` fija `enableTelemetry=false` y `src/vs/platform/telemetry/common/telemetryUtils.ts` devuelve `false` antes de cualquier excepción de modo desarrollo.
- Varias extensiones heredadas llevaban `aiKey` en sus manifiestos aunque el host no permite telemetría. La sanitización exclusiva del empaquetado en `build/lib/extensions.ts` elimina `aiKey` de la copia distribuida y transforma cualquier `enableTelemetry=true` declarativo en `false`; no altera las fuentes ni la funcionalidad de las extensiones.
- `scripts/audit-napo-privacy-contract.mjs` se incorporó a `validate-napo-gate` y revisa el producto y los 63 manifiestos empaquetados. No admite claves de instrumentación, telemetría declarativa activa, galería, actualizaciones o documentación LLM automáticas.
- Las URLs de licencia, reporte de problemas, repositorio Node, webview o servidor remoto se clasifican como compatibilidad o acción explícita de la persona usuaria; no son servicios de arranque. El smoke dinámico sigue comprobando que el arranque real no abre conexiones no locales.
- Se reconstruyó `Napo.app`; la auditoría estática pasó, los cinco repositorios fuente siguen intactos y el manifiesto vigente quedó con 33.214 archivos y digest `3185803cd38cf6679148137d4d875f443c746da8738b701655e51311ad217102`.

## 2026-10-13 — Reproducibilidad ASAR y compuerta técnica final

- La diferencia residual entre dos reconstrucciones completas estaba en `node_modules.asar`: los streams de dependencias se fusionaban concurrentemente y alteraban el orden de entradas del ASAR.
- `build/lib/asar.ts` ahora acumula y ordena las entradas por ruta antes de construir el archivo; el cambio es exclusivo de Napo y no toca ningún repositorio fuente.
- Dos reconstrucciones consecutivas produjeron `node_modules.asar` byte a byte idéntico: 486.159 bytes, SHA-256 `e62a956abb8f0a7ca863024d2ae3bfbb64ef22f7cdfccf26ece809b51ad5115a`.
- La reconstrucción final de macOS arm64 quedó verificada en `reports/napo-release-manifest.json`: 32.926 archivos, digest de árbol `7cb39e49fe937a19e82158349c929644978f99648bd5fecb0a23301cdf3d7f29`, sin cachés Python ni reportes `*.stats.json` temporales.
- La compuerta integral terminó como `ACEPTADA (desarrollo técnico)`: R, Python, Quarto, privacidad dinámica, actualización/rollback, gobernanza de conocimiento, arranque de 17 extensiones bajo revisión, contratos y evidencia UI pasan.
- `audit-napo-source-readonly -- --verify`, `verify-napo-release`, `audit-napo-privacy-contract` y `git diff --check` pasan. La revisión legal conserva 30 casos pendientes; `--require-distribution` sigue bloqueando correctamente y la firma continúa `development-only`.

## 2026-10-13 — Reducción validada de `debug-server-ready`

- La reducción temporal de `debug-server-ready` pasó `validate-napo.mjs --require-runtime` y `smoke-napo-runtime.mjs` sobre un clon reversible. El paquete original no se tocó durante esa prueba.
- Se aplicó la exclusión únicamente al empaquetado de Napo en `build/lib/extensions.ts`; no se modificó el repositorio fuente de VS Code ni se añadió un proveedor externo de depuración.
- La reconstrucción final conserva Capibara completa, Quarto y las 17 extensiones de análisis de datos sin diferencias funcionales. El paquete contiene 62 extensiones: 46 conservadas y 16 bajo revisión.
- Se corrigió el smoke de extensiones para auditar solo manifiestos físicamente presentes en el paquete, evitando que un inventario de una corrida anterior declare activada una extensión excluida.
- Nuevo manifiesto verificado: 32.921 archivos, digest `713247efbd45fc96c0f025bd9553d40005434564af7f918d1dc77a804cb11907`; cero cachés Python o reportes `*.stats.json`.
- Una segunda reconstrucción completa de esta misma superficie produjo exactamente los mismos 32.921 archivos, bytes totales y digest `713247efbd45fc96c0f025bd9553d40005434564af7f918d1dc77a804cb11907`; la reproducibilidad queda comprobada para el artefacto vigente.
- La compuerta integral vuelve a `ACEPTADA (desarrollo técnico)`: 0 errores de arranque/contratos, 8 capacidades aprobadas, privacidad y fuente de solo lectura pasan. La revisión legal conserva 30 casos, y firma/notarización/canal siguen abiertos.

## 2026-10-13 — Limpieza de cortes históricos del plan

- La auditoría contra los criterios de finalización confirmó que la implementación técnica vigente cumple la compuerta de desarrollo; las puertas restantes son legales, firma/notarización y canal de distribución.
- Se rotularon como históricos los apartados del plan que describían la etapa intermedia de 63 extensiones y la prueba pendiente de `debug-server-ready`; la referencia actual es el corte de 59 extensiones, 13 bajo revisión funcional y 13/13 cubiertas.
- No se modificó código ni ningún repositorio fuente; el cambio solo evita que una cifra histórica reabra una decisión ya cerrada.

## 2026-10-13 — Reducción validada de `make`

- La reducción temporal de `vscode.make` pasó `validate-napo.mjs --require-runtime` y `smoke-napo-runtime.mjs` sobre un clon reversible.
- Se aplicó la exclusión únicamente al empaquetado de Napo; el repositorio fuente de VS Code permanece sin cambios y no se modificó ninguna extensión de análisis de datos ni Capibara.
- La compuerta integral pasó con 61 extensiones: 46 conservadas y 15 bajo revisión; los 17 componentes de datos comparados mantienen 0 diferencias funcionales y las 8 capacidades analíticas pasan.
- El manifiesto vigente registra 32.917 archivos y digest `64c4ee44989a1a32ab0672d02cd4ada9139c88a0f46a8e00f01b74b08de29cc1`; el paquete no contiene cachés Python ni reportes `*.stats.json`.
- La evidencia UI, privacidad, recuperación, contratos y expediente legal se regeneraron o verificaron contra el nuevo digest. Permanecen 30 revisiones legales humanas, firma/notarización y canal de distribución.

## 2026-10-13 — Reducción validada de `javascript`

- La reducción temporal de `vscode.javascript` pasó `validate-napo.mjs --require-runtime` y `smoke-napo-runtime.mjs` sobre un clon reversible.
- Se aplicó la exclusión exclusivamente al empaquetado de Napo; el repositorio fuente de VS Code y las extensiones de datos permanecen intactos.
- La compuerta integral pasó con 60 extensiones: 46 conservadas y 14 bajo revisión; los 17 componentes de datos comparados mantienen 0 diferencias funcionales y las 8 capacidades analíticas pasan.
- El manifiesto vigente registra 32.909 archivos y digest `45235e9c2494b5a2066a944b18a99352d8a8b191ebbe9c9f3788ef598a4d0e00`; no hay cachés Python ni reportes `*.stats.json`.
- La evidencia UI, privacidad, recuperación, contratos y expediente legal se verificaron contra el nuevo digest. Permanecen 30 revisiones legales humanas, firma/notarización y canal de distribución.

## 2026-10-13 — Reducción validada de `html`

- La reducción temporal de `vscode.html` pasó `validate-napo.mjs --require-runtime` y `smoke-napo-runtime.mjs` sobre un clon reversible.
- Se aplicó la exclusión exclusivamente al empaquetado de Napo; el repositorio fuente de VS Code y las extensiones de datos permanecen intactos.
- La compuerta integral pasó con 59 extensiones: 46 conservadas y 13 bajo revisión; los 17 componentes de datos comparados mantienen 0 diferencias funcionales y las 8 capacidades analíticas pasan.
- El manifiesto vigente registra 32.903 archivos y digest `341d14e7363abd702ec1d6a93fc2357f56eb863e99a6e82a7d7f8d65697eecfb`; no hay cachés Python ni reportes `*.stats.json`.
- Una segunda reconstrucción completa de esta misma superficie produjo exactamente los mismos 32.903 archivos, bytes totales y digest; la reproducibilidad queda comprobada para el artefacto vigente.
- La evidencia UI, privacidad, recuperación, contratos y expediente legal se verificaron contra el nuevo digest. Permanecen 30 revisiones legales humanas, firma/notarización y canal de distribución.

## 2026-10-13 — Cobertura funcional reconciliada de extensiones bajo revisión

- Se incorporó `scripts/audit-napo-extension-functional-coverage.mjs` a `validate-napo-gate`; la primera ejecución detectó y corrigió un acceso incorrecto a la clave JSON `requiere-prueba`.
- Las 13 extensiones clasificadas como `requiere-prueba` tienen manifiesto físico, evidencia UI `pass` ligada al digest `341d14e7363abd702ec1d6a93fc2357f56eb863e99a6e82a7d7f8d65697eecfb`, contrato sin errores y arranque sin errores.
- El informe `reports/napo-extension-functional-coverage.json` pasa con 13/13. La evidencia sigue declarada como manual y no autoriza retirar componentes ni sustituye la revisión legal.
- La compuerta integral volvió a `ACEPTADA (desarrollo técnico)`. Se mantienen 30 revisiones legales humanas, firma/notarización y canal de distribución como puertas externas.
- La variante `validate-napo-gate --require-distribution` recorrió también la cobertura 13/13 y se detuvo correctamente en inventario legal por los 30 casos humanos pendientes; no llegó a declarar distribución ni a saltarse la firma.

## 2026-10-13 — Auditoría de raíces de conocimiento

- Se incorporó `scripts/audit-napo-knowledge-bundle.mjs` para recorrer raíces locales de manifiestos `*.source.json`, validar cada fuente, detectar identidades duplicadas y contar fuentes utilizables para planificación.
- `npm run test-napo-knowledge-governance` pasa en modo normal y estricto: una fuente pendiente sigue siendo trazable, pero el modo `requireApproved` la bloquea.
- La interfaz CLI también fue ejercitada sobre el fixture temporal: genera un reporte `napo-knowledge-bundle-audit/v1` y devuelve rechazo en `--require-approved`.
- La auditoría no sigue `sourceUri`, no descarga contenido, no infiere licencias ni autoridad y no convierte una fuente en jurídicamente válida. Capibara, las extensiones de datos y los repositorios fuente no fueron modificados.
- La compuerta integral posterior pasa `ACEPTADA (desarrollo técnico)`; la gobernanza de conocimiento sigue incluida y la distribución pública conserva sus bloqueos legales y de firma.
- La compuerta se repitió después de probar la interfaz CLI y terminó nuevamente `ACEPTADA (desarrollo técnico)`; `verify-napo-release`, solo-lectura de fuentes, `git diff --check` y la ausencia de cachés también pasan.

## 2026-10-13 — Expediente legal ligado a la compuerta

- `validate-napo-gate` ahora regenera `reports/napo-license-review-packet.json` después del inventario y antes del manifiesto de release.
- El expediente vigente está ligado al digest `341d14e7363abd702ec1d6a93fc2357f56eb863e99a6e82a7d7f8d65697eecfb`, conserva 30 casos, clasifica la evidencia objetiva y agrega una checklist de revisión sin inferir licencias.
- La corrida integral pasa `ACEPTADA (desarrollo técnico)`. `--require-distribution` continúa bloqueando por revisión humana pendiente y firma `development-only`.
- Se ordenó la compuerta para verificar primero `napo-release-manifest.json` y generar después el expediente legal; la corrida posterior confirmó digest coincidente y aceptación técnica.

## 2026-10-13 — Matriz de cumplimiento integral

- Se creó `MATRIZ_CUMPLIMIENTO_NAPO.md` para mapear cada requisito de producto a su evidencia autoritativa y distinguir cumplimiento técnico, cobertura manual y puertas externas.
- La matriz confirma el corte vigente: Capibara completa, 17 extensiones de datos con 0 diferencias funcionales, Quarto/R/Python/modelación/simulación, telemetría prohibida, fuente en solo lectura y release reproducible.
- Mantiene explícitamente como pendientes la revisión humana de 30 casos legales, firma/notarización y canal de distribución; no presenta Napo como release público.
- `MATRIZ_HOST_CAPIBARA.md` fue aclarada: sus secciones con cifras 90/63 y selector pendiente quedan rotuladas como cortes históricos; la sección 21 y la auditoría de cierre son la referencia vigente.

## 2026-10-13 — Revisión focalizada del receptor y rebuild de Napo

- Se revisó el receptor propio de Napo en `src/vs/workbench/contrib/webviewView/browser/webviewViewPane.ts`; Capibara sigue completa y sin cambios en su repositorio ni en su bundle integrado.
- La recuperación de `capibara.SidebarProvider` ante `onFatalError` permanece acotada a un intento. La recarga diferida posterior a `cancelTask` ahora es idempotente: mensajes repetidos no programan múltiples `reload()` y el temporizador se cancela al disponer la vista.
- La activación del proveedor espera `getCompleteWorkspace()` cuando el host ya tiene estado de trabajo pero aún no expone carpetas, evitando una inicialización prematura contra la raíz equivocada.
- `npm run typecheck-client`, `npm run gulp core-ci` y `npm run gulp vscode-darwin-arm64-min-ci` pasan; el artefacto real `../VSCode-darwin-arm64/Napo.app` fue reconstruido.
- Manifiesto vigente: 32.898 archivos; digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`. La compuerta integral pasa `ACEPTADA (desarrollo técnico)` con Capibara 4.0.0, Quarto 1.10.18, 8 capacidades aprobadas, 13/13 extensiones bajo revisión cubiertas y 0 conexiones no locales observadas.
- La evidencia UI se volvió a ligar al digest nuevo con una nota de revalidación basada en rebuild exclusivo del host y 0 diferencias funcionales en las extensiones; no se alteraron los repositorios fuente de RHS-IA, Positron, rhs-agent3, rhs-agent4 ni vscode.
- Permanecen fuera de esta aceptación técnica las 30 revisiones legales humanas, firma/notarización y canal de distribución.

## 2026-10-13 — Reinicio de estado en reactivación de Capibara

- La revisión del ciclo de vida detectó que las banderas `_webviewRecoveryAttempted` y `_webviewRecoveryInProgress` podían sobrevivir a la disposición de una vista fallida.
- El receptor ahora las limpia al disponer `capibara.SidebarProvider`; una activación posterior dispone de un intento de recuperación nuevo, sin modificar Capibara.
- `typecheck-client`, `core-ci`, `vscode-darwin-arm64-min-ci` y `validate-napo-gate` pasan después del cambio. El manifiesto vigente conserva 32.898 archivos y ahora registra digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.
- `npm run test:positron` también pasa después del cambio: 415 archivos, 4.946 pruebas aprobadas, 3 expected-fail y 21 omitidas. Vite reportó únicamente un source map ausente de DOMPurify, sin fallo de prueba.

## 2026-10-13 — Separación de perfil persistente frente a paquete limpio

- La ventana gráfica de Napo observada durante la revisión había sido iniciada antes del rebuild vigente y conservaba un perfil persistente; mostró un timeout de 15 segundos al arrancar la sesión R.
- Esa observación no se reproduce en la validación limpia: `validate-napo-gate` ejecuta el smoke de R/Python/Quarto y pasa, y el arranque de extensiones del paquete termina con 0 errores.
- No se modificó código por ese síntoma ni se trató la ventana vieja como evidencia del artefacto actual. Para una prueba manual de interfaz debe reiniciarse Napo con perfil y workspace temporales.

## 2026-10-13 — Cobertura de avisos `ThirdPartyNotices` en la auditoría legal

- La revisión del expediente detectó una limitación mecánica del inventario: algunos avisos redistribuidos usan nombres `ThirdPartyNotices*` y no coincidían con el patrón anterior de archivos legales.
- Se amplió únicamente el reconocimiento de nombres en `scripts/audit-napo-license-inventory.mjs` y `scripts/audit-napo-license-review-packet.mjs`; no se modificaron manifiestos, artefactos ni repositorios fuente.
- El inventario vigente de `Napo.app` pasó a registrar 64 manifiestos y 38 archivos legales con SHA-256. La cola permanece en 30 casos: 28 sin declaración/archivo local detectable, 1 referencia a archivo ausente y 1 archivo local sin declaración.
- La mejora añade evidencia de avisos, pero no infiere licencias ni transforma candidatos de procedencia en aprobación. La compuerta de distribución debe continuar exigiendo revisión humana.

## 2026-10-13 — Endurecimiento del contrato de conocimiento institucional

- El validador de fuentes ahora exige `schemaVersion: 1`; manifiestos ausentes o de versión desconocida se rechazan para no interpretar contratos futuros con reglas antiguas.
- La prueba de gobernanza incorpora una fuente duplicada con la misma identidad `id/version/jurisdiction` y confirma que el auditor bloquea la raíz completa.
- `NAPO_CONOCIMIENTO.md` documenta ambas garantías. No se agregaron fuentes ficticias al producto, no se aprobó ninguna autoridad y no se modificó Capibara ni ningún repositorio fuente.
- `test-napo-knowledge-governance` y la compuerta completa pasan; la aceptación sigue siendo técnica y las 30 revisiones legales humanas permanecen abiertas.

## 2026-10-13 — Transferencia segura de conocimiento aprobado al workspace

- Se incorporó `scripts/prepare-napo-knowledge-bundle.mjs` como frontera de Napo entre una raíz institucional revisada y el `Docs/` que Capibara consume localmente.
- La operación exige `--require-approved`, primero produce un dry-run y solo copia con `--apply`; conserva manifiestos laterales, no sigue `sourceUri`, no descarga contenido y no sobrescribe colisiones.
- El recibo `.napo/knowledge/materialization.json` registra fuentes, hashes, rutas y acciones. La aplicación repetida es idempotente; una colisión de contenido o un destino que escape mediante symlink detiene la operación sin alterar el archivo existente.
- `test-napo-knowledge-materialization` prueba dry-run, aplicación, idempotencia, fuente pendiente, colisión y symlink de destino. La compuerta completa pasa con este control integrado.
- Esta capacidad prepara la integración operativa, pero no inventa fuentes ni convierte una fuente en jurídicamente válida: falta que una institución entregue contenido real y complete la revisión humana.

## 2026-10-13 — Planificación sobre bundle materializado

- Se añadió `scripts/test-napo-materialized-planning.mjs` a la compuerta para encadenar materialización aprobada, recibo de procedencia y lectura desde `Rscript` en el `Docs/` del workspace.
- El fixture local produjo `NAPO_MATERIALIZED_PLANNING_OK` al calcular una brecha de 20 unidades con la fuente `TEST-MATERIALIZED-PLANNING@2026.01`; la evidencia está en `reports/napo-materialized-planning.json`.
- La prueba fortalece el receptor y la reproducibilidad de transferencia→análisis, pero no usa una fuente legal real, no prueba autoridad institucional y no reemplaza el E2E UI de Capibara.
- La compuerta integral volvió a `ACEPTADA (desarrollo técnico)`; el artefacto, el digest y los cinco repositorios fuente permanecen sin cambios.

## 2026-10-13 — Estado transaccional del materializador

- `prepare-napo-knowledge-bundle.mjs` ahora conserva el estado `ready` durante la previsualización y solo lo cambia a `applied` después de completar copias, recibo y reporte final.
- Si una escritura falla, el reporte queda en `fail` y conserva el error; ya no existe una ventana en la que un recibo pueda afirmar éxito antes de terminar la operación.
- El reporte incluye además autoridad, fecha efectiva, estado de revisión, responsable, fecha de revisión y referencia de licencia de cada fuente aprobada, sin inferir ninguna decisión institucional.
- `test-napo-knowledge-materialization`, `validate-napo-gate`, `verify-napo-release`, la auditoría de solo-lectura y `git diff --check` pasan. Digest vigente: `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.
- Los JSON de reporte y recibo se escriben ahora mediante reemplazo atómico en el mismo directorio; la prueba confirma que ambos conservan `applied` y los metadatos de autoridad y revisión.
- La compuerta completa se repitió después del cambio y volvió a `ACEPTADA (desarrollo técnico)` sin modificar el paquete ni ningún repositorio fuente.

## 2026-10-13 — Auditoría de dependencias runtime de extensiones

- Una inspección de Napo.app confirmó que existen árboles `node_modules` anidados en Git, drivers de datos, servidores Positron y `rhs-okf` de Capibara; son dependencias runtime declaradas y necesarias, no una razón para recortar Capibara o las extensiones de datos.
- Se incorporó a `scripts/validate-napo.mjs` una lista explícita de raíces runtime permitidas. La validación rechaza cualquier nueva raíz de dependencias dentro de `extensions/` que no esté declarada en esa política.
- La primera versión demasiado estricta falló correctamente y fue corregida para distinguir “cero node_modules” de “cero árboles no declarados”. La compuerta posterior pasa, mantiene digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321` y conserva los cinco repositorios fuente intactos.

## 2026-10-13 — Salud del código del destino

- `npm run typecheck-client` pasa sin diagnósticos.
- `npm run test:positron` pasa: 415 archivos, 4.946 pruebas aprobadas, 3 expected-fail y 21 omitidas.
- Vitest emitió únicamente el aviso conocido de un source map ausente de DOMPurify y una advertencia deprecada de Node; ninguno altera el resultado de la suite ni corresponde a una modificación de los repositorios fuente.

## 2026-10-13 — Informe persistente de dependencias runtime

- Se creó `scripts/napo-extension-dependency-policy.mjs` como política única para raíces `node_modules` runtime de extensiones.
- `scripts/audit-napo-extension-dependency-roots.mjs` genera `reports/napo-extension-dependency-roots.json`; el paquete actual observa 15 raíces permitidas y 0 no declaradas.
- La auditoría quedó integrada en `validate-napo-gate`; el gate completo pasa `ACEPTADA (desarrollo técnico)` y el digest permanece `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.

## 2026-10-13 — Revalidación gráfica limpia de Napo

- Se inició directamente `Napo.app` arm64 con perfil y workspace temporales; la aplicación abrió y, tras resolver un aviso inicial de sincronización de extensiones mediante una recarga de la ventana, quedó operativa.
- La interfaz mostró `RHS-Agent v4.0.0`, el espacio `Workspace · Sensibles`, las acciones `Nueva tarea` y `Configuración`, R 4.5.3 iniciado y Quarto 1.10.18 desde el paquete.
- La comprobación gráfica de Python quedó parcial: el descubrimiento eligió `/opt/homebrew/bin/python3`, que no tenía un `ipykernel` utilizable y ofreció instalarlo. No se instaló nada ni se modificó el entorno de la persona usuaria.
- La limitación pertenece al intérprete seleccionado por ese perfil, no invalida el paquete: el gate reproducible sigue pasando Python/Jupyter con `/usr/local/bin/python3` 3.13.3 e `ipykernel` preparado.
- La captura y el detalle verificable quedaron en `screenshots/2026-10-13-clean-ui/napo-rhs-agent.png` y `reports/napo-clean-ui-revalidation.json`, ligados al digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.

## 2026-10-13 — Manifiesto resistente a cachés Python de ejecución

- La apertura gráfica de Capibara generó 297 `.pyc` bajo `Napo.app/extensions/rhs-agent4`; eran cachés volátiles de Python y no cambios de Capibara ni de sus fuentes.
- Se ajustó `scripts/napo-release-manifest.mjs` para excluir explícitamente `__pycache__` y `.pyc` del inventario y del digest; el contenido funcional del release permanece verificable aunque el runtime cree caché.
- Se eliminaron únicamente esos cachés generados dentro del artefacto empaquetado. `validate-napo-gate`, `verify-napo-release`, la auditoría de repositorios fuente y `git diff --check` pasan; el digest canónico sigue siendo `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.

## 2026-10-13 — Prueba permanente del manifiesto volátil

- Se añadió `scripts/test-napo-release-manifest.mjs`, que crea un paquete de prueba con entradas estables y cachés `.pyc`, comprueba que solo se incluyan las entradas estables y verifica el mismo manifiesto mientras los cachés siguen presentes.
- La prueba quedó integrada en `validate-napo-gate` y en `package.json` como `test-napo-release-manifest`.
- Pasan la prueba aislada, `typecheck-client`, la compuerta completa, `verify-napo-release`, la auditoría de solo-lectura y `git diff --check`; la aceptación continúa siendo `ACEPTADA (desarrollo técnico)`.

## 2026-10-13 — Auditoría ejecutable de cierre

- Se añadió `scripts/audit-napo-completion.mjs` y el reporte `reports/napo-completion-audit.json` para comprobar requisito por requisito el estado del artefacto y separar evidencia técnica de puertas externas.
- La corrida actual registra 12 requisitos técnicos cumplidos, 0 fallos y 3 pendientes externos: revisión legal humana, firma/notarización/canal de distribución y una fuente institucional real para conocimiento legal.
- La auditoría quedó integrada al gate. No declara finalización ni release público mientras esas puertas permanezcan abiertas; no modifica Capibara, extensiones de datos ni repositorios fuente.

## 2026-10-13 — Verificador offline de candidatos de actualización

- Se añadió `scripts/verify-napo-update-candidate.mjs` para validar un candidato local antes de activarlo: identidad Napo, versión posterior, telemetría, endpoints, manifiesto y digest; `--require-distribution` incorpora la firma macOS.
- `scripts/test-napo-update-candidate.mjs` prueba un candidato válido y rechaza uno que activa telemetría. La prueba no descarga, instala ni reemplaza el paquete activo.
- La prueba quedó integrada en `validate-napo-gate`; los repositorios fuente, Capibara y las extensiones de datos permanecen sin cambios.

## 2026-10-13 — Suite posterior al endurecimiento de actualizaciones

- `npm run test:positron` pasa: 415 archivos, 4.946 pruebas aprobadas, 3 expected-fail y 21 omitidas.
- También pasan las pruebas de manifiesto y candidato de actualización, la auditoría de solo-lectura y `git diff --check`. El aviso de source map de DOMPurify y la advertencia deprecada de Node permanecen como avisos conocidos, sin fallos de prueba.

## 2026-10-13 — Estructura mínima exigida a candidatos de actualización

- El verificador offline ahora exige que el candidato contenga Capibara `rhs-agent4@4.0.0` con su entrypoint y runtime, además de `quarto/bin/quarto`.
- La prueba ampliada acepta un candidato válido y rechaza candidatos con telemetría o sin Capibara/Quarto. Esto evita que un manifiesto propio de un paquete incompleto sea considerado suficiente.

- La compuerta completa posterior pasa `ACEPTADA (desarrollo técnico)`, mantiene el digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321` y confirma nuevamente los cinco repositorios fuente en solo lectura.

## 2026-10-13 — Reconciliación del estado de cierre

- La auditoría ejecutable mantiene 13 pases, 0 fallos y 3 pendientes: revisión legal humana; firma/sellado/notarización de distribución macOS; y una fuente institucional real de conocimiento.

## 2026-10-13 — Auditoría arquitectónica integrada

- `scripts/audit-napo-architecture.mjs` comprueba 25 condiciones: las capas Host, Datos, Agente y Modelación/Planificación; contratos mínimos del host; matrices de transferencia; evidencia de datos/capacidades; y baseline de las cinco fuentes.
- La auditoría pasa y quedó integrada en `validate-napo-gate` y `audit-napo-completion`. El cierre técnico ahora registra 14 pases, 0 fallos y las mismas 3 puertas externas.

## 2026-10-13 — Entradas externas de cierre documentadas

- Se creó `ENTRADAS_PENDIENTES_NAPO.md` con el procedimiento exacto para aportar revisión legal, firma/notarización macOS y una fuente institucional real.
- El documento distingue artefactos regenerables de registros durables, prohíbe credenciales o decisiones inventadas y conserva el digest técnico vigente.
- Se corrigió `AUDITORIA_CIERRE_NAPO.md`: la cobertura funcional de las 13 extensiones bajo revisión ya no aparece como puerta abierta, porque `reports/napo-extension-functional-coverage.json` la reconcilia con 13/13, UI `pass`, contratos sin errores y arranque sin errores.
- La corrección es documental y no cambia el artefacto, Capibara, las extensiones de datos ni ningún repositorio fuente.

## 2026-10-13 — Canal manual de actualización formalizado

- Se cerró la decisión de canal: Napo solo acepta candidatos entregados manualmente por una persona responsable, con artefacto completo, manifiesto, hash y firma; el procedimiento local verifica antes de activar y conserva la versión anterior para rollback.
- Napo no descubre, consulta ni descarga el canal, y no instala actualizaciones silenciosamente. Una build `development-only` queda limitada a desarrollo, pruebas o distribución interna.
- La puerta de distribución que permanece abierta es la firma/sellado/notarización de macOS; ya no existe una ambigüedad de producto sobre el canal.

## 2026-10-13 — Evidencia precisa de firma macOS

- La auditoría de firma ahora captura `stdout` y `stderr` de `codesign`/`spctl`; el artefacto reporta correctamente `Signature=adhoc` y `TeamIdentifier=not set`, en lugar de `unknown`.
- El estado continúa siendo `development-only`: `codesign --verify` y `spctl --assess` fallan correctamente para una build sin recursos sellados y sin identidad de distribución. La corrección mejora la evidencia y no intenta convertir la firma de desarrollo en una firma pública.
- Se añadió `scripts/test-napo-macos-signature.mjs` a `validate-napo-gate`; la prueba rechaza futuros reportes que vuelvan a ocultar la firma o el `TeamIdentifier` como `unknown`.

## 2026-10-13 — Registro durable de revisión legal

- Se separaron las decisiones humanas del expediente regenerable: `reports/napo-license-decisions.json` conserva decisiones por `caseId`, revisor, fecha, fundamento y digest del release.
- `audit-napo-license-inventory.mjs` y `audit-napo-license-review-packet.mjs` leen ese registro sin modificar manifiestos ni inferir licencias; `--require-distribution` exige todos los casos `approved`.
- `test-napo-license-review-decisions.mjs` verifica registro vacío, revisión parcial, rechazo de distribución incompleta, aceptación de revisión completa explícita y rechazo de digest obsoleto.

## 2026-10-13 — Revalidación técnica completa posterior al registro legal

- `npm run validate-napo-gate -- --package ../VSCode-darwin-arm64/Napo.app` terminó `ACEPTADA (desarrollo técnico)` con 14 requisitos técnicos aprobados, 0 fallos y 3 puertas externas pendientes.
- La corrida volvió a comprobar arquitectura, privacidad, Capibara completa, las 17 extensiones de datos sin diferencias funcionales, R, Python/Jupyter, Quarto, modelación, simulación, escenarios, actualizaciones manuales, gobernanza de conocimiento, arranque de las 13 extensiones bajo revisión y cobertura funcional 13/13.
- `audit-napo-source-readonly --verify`, `napo-release-manifest --verify` y `git diff --check` pasan. Las cinco fuentes conservan exactamente el baseline y el digest del paquete sigue siendo `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.
- La revisión estricta de distribución continúa detenida correctamente por 30 decisiones legales humanas pendientes; no se inventaron licencias, certificados, credenciales ni fuentes institucionales.
- Como verificación adicional del destino, `npm run typecheck-client` terminó con código 0 y `npm run test:positron` terminó con 415 archivos aprobados, 4.946 pruebas aprobadas, 3 fallos esperados y 21 omitidas. Los avisos de DOMPurify y Node siguen siendo no bloqueantes y no cambiaron el artefacto.
- `audit-napo-completion.mjs --require-complete` fue ejecutado como prueba negativa: terminó con código 1 exactamente porque permanecen 3 puertas externas; reportó 14 pases y 0 fallos técnicos. Esto confirma que el cierre estricto no confunde aceptación técnica con release público.

## 2026-10-13 — Diagnóstico de tipado de pruebas Positron

- `vitest.tsconfig.json` fue corregido en Napo para incluir las declaraciones globales del workbench (`src/vs/**/*.d.ts`); así se eliminó la clase ambiental de errores `monaco`/`DebugProtocol`.
- `npm run test:positron:check-ts` continúa fallando con 182 errores distribuidos en 40 archivos de tests heredados de Positron/Code-OSS: mocks incompatibles, contratos de notebook/LLM desfasados y estrechamiento de tipos. Ningún archivo con error coincide con los archivos modificados por Napo.
- La suite ejecutable sigue pasando: 4.946 pruebas aprobadas, 3 fallos esperados y 21 omitidas. La comprobación TypeScript de tests queda registrada como deuda upstream separada; no se excluyeron archivos ni se relajó el compilador para ocultarla.

## 2026-10-13 — Compuerta posterior a la corrección de configuración de tests

- `npm run validate-napo-gate -- --package ../VSCode-darwin-arm64/Napo.app` volvió a terminar `ACEPTADA (desarrollo técnico)`: 14 pases, 0 fallos y 3 puertas externas pendientes.
- La corrida posterior mantuvo 17 extensiones de datos con 0 diferencias funcionales, 8 capacidades aprobadas, 13 extensiones bajo revisión sin errores de arranque ni cobertura funcional fallida, y el digest `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.
- La configuración de pruebas no cambió el paquete: Capibara, Quarto, telemetría, manifiesto y fuentes permanecen verificados. Las 3 puertas abiertas siguen siendo legales, firma/notarización macOS y fuente institucional real.

## 2026-10-13 — Clasificador durable de tipado de tests

- Se añadió `scripts/audit-napo-positron-typecheck.mjs` y el comando `npm run audit-napo-positron-typecheck`.
- El clasificador ejecuta el chequeo TypeScript real, guarda `reports/napo-positron-typecheck.json` y separa `pass`, `upstream-debt`, `fail` y fallo ambiental. Si un diagnóstico aparece en un archivo modificado por Napo, termina con error; no excluye tests ni relaja el compilador.
- La clasificación actual es `upstream-debt`: 182 diagnósticos en 40 archivos, intersección con cambios de Napo: 0. La comprobación quedó integrada en `validate-napo-gate` y la compuerta completa volvió a pasar con 14 requisitos técnicos, 0 fallos y 3 puertas externas.
- El clasificador fue endurecido para considerar cambios unstaged, staged y archivos `untracked`; así no puede dejar fuera una implementación nueva todavía no versionada. La revalidación conserva `upstream-debt` y la intersección Napo sigue en 0.

## 2026-10-13 — Compuerta final posterior al endurecimiento del clasificador

- `validate-napo-gate --package ../VSCode-darwin-arm64/Napo.app` pasó después de la última modificación del clasificador: 14 requisitos técnicos, 0 fallos y 3 puertas externas.
- La clasificación TypeScript sigue siendo `upstream-debt` con 182 diagnósticos en 40 archivos heredados y 0 diagnósticos en cambios modified/staged/untracked de Napo.
- La corrida volvió a verificar Capibara completa, Quarto, 0 diferencias funcionales de las 17 extensiones de datos, R/Python/Jupyter, modelación, simulación, privacidad, manifiesto, licencias, fuentes de solo lectura y firma `development-only`.

## 2026-10-13 — README reconciliado con el estado canónico

- `README.md` ya describe el canal de actualización como manual, explícito, verificable y reversible; dejó de presentarlo como una decisión pendiente.
- Se añadieron al flujo de mantenimiento `build-fast`, `compile-extensions-build` y `audit-napo-positron-typecheck`, con la aclaración de que la deuda de tipado heredada no equivale a una suite verde.
- La corrección es documental; `git diff --check`, la auditoría de fuentes y el clasificador TypeScript pasan sin cambiar el paquete ni sus fuentes.

## 2026-10-13 — Reproducibilidad de compilación posterior al clasificador

- `npm run build-fast` pasó: transpile del cliente y compilación rápida de extensiones, con typechecks de extensiones sin errores.
- `npm run compile-extensions-build` pasó: bundle de extensiones del flujo de build, incluyendo Positron Python, Positron R, Capibara y los binarios runtime integrados.
- Después de ambas tareas, `git diff --check`, la auditoría de las cinco fuentes y la verificación del manifiesto macOS pasaron; el digest canónico permaneció `c568e2a7a1c9c3d4d9ee9e8254ec1e5d3c2cac2be7f9d8ae924ff1a8ec290321`.

## 2026-10-13 — Fallback de localización exclusivo del receptor y rebuild canónico

- La investigación del contrato de localización confirmó que varias extensiones Positron empaquetan `l10n/bundle.l10n.es.json` sin declarar el campo `l10n`; no se tocaron sus manifiestos ni su código.
- Se añadió al RPC del host `$fetchBuiltInExtensionBundleUri`. `MainThreadLocalization` consulta la extensión integrada, verifica que sea built-in y que el bundle convencional exista; `ExtHostLocalizationService` conserva la prioridad del paquete de idioma y usa el archivo local sólo como fallback verificado.
- La prueba focalizada `src/vs/workbench/api/test/common/extHostLocalizationService.vitest.ts` pasa 4/4 casos, incluido manifiesto sin `l10n` y archivo local ausente.
- `npm run compile` y `npx gulp vscode-darwin-arm64` reconstruyeron el artefacto canónico `/Users/julius3005/Documents/Github/VSCode-darwin-arm64/Napo.app`. El digest vigente es `db0ee2a197e7ffd91c4a2a332a2d7dce0320e39b4d3089cc360510ace7f9ec9e`.
- `typecheck-client`, `audit-napo-source-readonly --verify`, `git diff --check`, el manifiesto y `validate-napo-gate` pasan. Resultado: 14 pases técnicos, 0 fallos y 3 puertas externas. La evidencia UI fue revalidada contra el digest nuevo.
- Capibara 4.0.0 sigue completa, Quarto 1.10.18 sigue incluido y las 17 extensiones de datos conservan 0 diferencias funcionales.

## 2026-10-13 — Clasificación de ausencia normal de traducciones

- Se endureció `ExtHostLocalizationService`: un built-in sin `l10n` y sin bundle disponible cae silenciosamente a sus cadenas por defecto; un bundle declarado que no puede resolverse sigue produciendo error para no ocultar fallas reales.
- La cobertura focalizada queda en 5/5 casos. `typecheck-client` pasa.
- El artefacto fue reconstruido otra vez con `npm run compile` y `npx gulp vscode-darwin-arm64`. Digest vigente: `cf7fde539d2c23bf85bb8b92bfff00e9c1673ef664fd52345e2859792aadd572`.

## 2026-10-13 — Smoke runtime de localización en español

- Se arrancó el `Napo.app` canónico con `--locale=es`, perfil limpio, logs de traza y sin GPU durante 12 segundos.
- El runtime real observó 0 líneas `No bundle location found` y 0 `Failed to load translations`.
- La comprobación es complementaria a los 5/5 tests focalizados y al gate completo; no modifica el paquete ni los repositorios fuente.

## 2026-10-13 — Reconciliación del conteo del manifiesto canónico

- La verificación directa de `reports/napo-release-manifest.json` confirmó que el artefacto ligado al digest `cf7fde539d2c23bf85bb8b92bfff00e9c1673ef664fd52345e2859792aadd572` contiene 32.903 archivos.
- Se corrigieron las referencias vigentes de README, auditoría de cierre, matriz del host y plan de continuidad que todavía mostraban 32.898, cifra de un corte anterior. Las cifras antiguas conservadas en addenda históricos no se reinterpretan como estado actual.
- La corrección fue documental: no cambió el paquete ni las fuentes. `git diff --check`, la auditoría de solo lectura, la verificación del manifiesto y la evidencia UI ligada al digest siguen siendo las pruebas autoritativas.

## 2026-10-13 — Auditoría permanente de consistencia documental

- Se añadió `scripts/audit-napo-document-consistency.mjs`, que toma el conteo y digest directamente de `reports/napo-release-manifest.json`, revisa los documentos canónicos y distingue secciones históricas de referencias vigentes.
- La auditoría quedó integrada en `validate-napo-gate` y registrada como comando `npm run audit-napo-document-consistency`; su reporte es `reports/napo-document-consistency.json`.
- El control evita repetir el desfase de conteo detectado en esta iteración sin alterar Capibara, las extensiones de datos ni ningún repositorio fuente.

## 2026-10-13 — Reconciliación del inventario legal vigente

- La corrida fresca de la compuerta registra 64 manifiestos de extensiones, 40 archivos legales con hash y 30 casos pendientes de revisión humana.
- Se corrigieron las dos tablas canónicas que todavía mostraban 38 archivos legales; los valores anteriores permanecen únicamente en anotaciones históricas de la bitácora y la memoria.
- No se infirió ninguna licencia ni se modificó un manifiesto de extensión; la cola legal sigue requiriendo decisiones humanas explícitas.

## 2026-10-13 — Perfil de superficie ligado al paquete vigente

- `PERFIL_NAPO_MINIMAL.md` fue reconciliado con el artefacto actual: 59 extensiones, 46 conservadas y 13 bajo prueba específica.
- El perfil ahora registra el digest vigente y quedó incluido entre los documentos vigilados por `audit-napo-document-consistency.mjs`.
- La clasificación sigue siendo conservadora: no se retiró Capibara ni ninguna extensión de análisis de datos, y las fuentes continúan en solo lectura.

## 2026-10-13 — Búsqueda de fuente institucional real

- Se inspeccionó el destino con patrones de manifiestos `*.source.json`, `*.legal.json` y referencias de jurisdicción, excluyendo reportes, dependencias y artefactos de build.
- No apareció ninguna raíz institucional o normativa entregada por una autoridad; los resultados encontrados son políticas de código, pruebas o módulos internos de Capibara.
- La puerta `institutional-knowledge-source` permanece correctamente externa. Los fixtures de gobernanza y planificación siguen siendo pruebas técnicas no legales y no se transforman en fuentes aprobadas.

## 2026-10-13 — Suite ejecutable y typecheck del destino

- `npm run typecheck-client` terminó con código 0.
- `npm run test:positron` pasó con 415 archivos: 4.949 pruebas aprobadas, 3 expected-fail y 21 omitidas.
- Se observaron únicamente los avisos ya conocidos de source map ausente de DOMPurify y la deprecación de Node; no produjeron fallos. El chequeo TypeScript de tests continúa separado como deuda upstream de 182 diagnósticos en 40 archivos heredados.

## 2026-10-13 — Cierre requisito por requisito ampliado

- `audit-napo-completion.mjs` ahora ejecuta y registra typecheck/suite del destino mediante `reports/napo-destination-tests.json`, y vuelve a generar la consistencia documental antes de evaluar el cierre.
- La auditoría vigente pasa 16 requisitos técnicos, 0 fallos y conserva 3 puertas externas pendientes: legal, firma/notarización macOS y fuente institucional real.
- Los nuevos requisitos no cambian el paquete ni las fuentes; fortalecen la evidencia de cierre y mantienen visibles los 182 diagnósticos de tipado heredado.

## 2026-10-13 — Corrección de conteo en entradas externas de cierre

- `ENTRADAS_PENDIENTES_NAPO.md` todavía describía 14 requisitos; se corrigió a 16 para reflejar el reporte vigente de cierre.
- La auditoría de consistencia documental volvió a pasar con 7 documentos canónicos; `audit-napo-completion` volvió a pasar con 16 requisitos técnicos, 0 fallos y 3 puertas externas.
- La corrección fue únicamente documental: el paquete Napo y los cinco repositorios fuente permanecen sin cambios.

## 2026-10-13 — Recompilación rápida del destino

- `npm run build-fast` pasó con transpilación del cliente y compilación de extensiones, incluyendo Positron Python, Positron R y Capibara.
- Después de la compilación, el manifiesto canónico siguió verificando 32.903 archivos con digest `cf7fde539d2c23bf85bb8b92bfff00e9c1673ef664fd52345e2859792aadd572`.
- `git diff --check` y `audit-napo-source-readonly --verify` pasaron; ninguna fuente externa fue modificada.

## 2026-10-13 — Reconciliación de la auditoría legal documental

- `AUDITORIA_LEGAL_NAPO.md` conservaba cifras de un corte anterior; se corrigió a 64 manifiestos, 40 archivos legales con hash y 32.903 archivos en el release vigente.
- `scripts/audit-napo-document-consistency.mjs` ahora incluye la auditoría legal como octavo documento canónico y comprueba también su conteo legal.
- La auditoría de cierre regenerada conserva 16 requisitos técnicos aprobados, 0 fallos y 3 puertas externas pendientes. No se infirió ninguna licencia ni se modificaron repositorios fuente.

## 2026-10-13 — Compuerta integral posterior a la vigilancia legal

- `npm run validate-napo-gate -- --package ../VSCode-darwin-arm64/Napo.app` terminó `ACEPTADA (desarrollo técnico)`.
- Pasaron arquitectura (25/25), runtime R/Python/Quarto, modelación y simulación, privacidad estática y dinámica, Capibara, extensiones de datos, cobertura funcional, manifiesto y consistencia documental (8/8).
- El cierre final registra 16 requisitos técnicos, 0 fallos y 3 puertas externas: revisión legal humana, firma/notarización macOS y fuente institucional real.

## 2026-10-13 — Prueba negativa de cierre estricto

- `node scripts/audit-napo-completion.mjs --package ../VSCode-darwin-arm64/Napo.app --require-complete` terminó con código 1 de forma intencional.
- El reporte conservó 16 pases técnicos, 0 fallos y 3 pendientes; la prueba confirma que Napo rechaza un cierre público mientras falten insumos externos.

## 2026-10-13 — Canal manual de macOS bajo aceptación explícita de riesgo

- Se formalizó la decisión de producto: las primeras entregas de Napo podrán ser manuales, con hash y manifiesto verificables, aunque la build sea `adhoc/development-only`; el usuario autoriza la apertura en macOS bajo su propio riesgo.
- `scripts/audit-napo-completion.mjs --manual-risk` acepta ese estado únicamente en el modo explícito y conserva la firma Apple como requisito exclusivo del release público futuro.
- `validate-napo-gate --manual-risk` pasó: 17 requisitos aprobados, 0 fallos y 2 puertas externas pendientes (revisión legal humana y fuente institucional real). `--require-distribution` sigue rechazando correctamente una build sin firma/notarización Apple.

## 2026-10-13 — Precisión de la política de redistribución

- `QUE_CONSERVAR.md` ya no presenta a todo Napo como software libre bajo una única licencia; ahora exige redistribución conforme a la licencia aplicable de cada componente.
- La precisión refleja la auditoría legal vigente, que identifica Elastic License 2.0 en el núcleo y Apache-2.0/MIT en otros componentes, sin alterar el paquete ni las fuentes.

## 2026-10-13 — Reorganización de artefactos y rutas de Napo

- El artefacto ejecutable se trasladó de la carpeta externa `../VSCode-darwin-arm64/Napo.app` a `dist/Napo.app` dentro de `RHS-IA-Minimal`; la carpeta externa quedó vacía y fue eliminada.
- Los scripts, documentos y valores predeterminados de la compuerta ahora usan `dist/Napo.app`, sin depender de una ruta absoluta ni del nombre heredado de VS Code.
- La copia canónica integrada de Capibara es `extensions/rhs-agent4`. `.build/extensions/rhs-agent4` se conserva únicamente como staging generado para reconstrucción y verificación; no es una segunda Capibara distribuida.
- La compuerta ejecutada desde la nueva ubicación pasó: 17 requisitos, 0 fallos y 2 puertas externas; las fuentes de estudio permanecieron intactas.

## 2026-10-13 — Decisión definitiva sobre la firma Apple

- Se aclaró la política de producto: Napo no requiere firma ni notarización de Apple. La distribución elegida es libre y manual; cada usuario decide si abre el `.app` después de verificar el manifiesto/hash y leer la advertencia de macOS.
- Los documentos canónicos fueron alineados con esa decisión. Apple queda fuera de las puertas de cierre; `--require-distribution` solo conserva valor diagnóstico para una ruta opcional.
- La compuerta predeterminada debe registrar 17 requisitos técnicos aprobados, 0 fallos y únicamente 2 puertas externas: revisión legal humana y fuente institucional real de conocimiento. `--manual-risk` queda como alias de compatibilidad.

## 2026-10-13 — Napo no importa configuraciones de VS Code al arrancar

- Se localizó el origen del aviso: `src/vs/workbench/contrib/positronWelcome/browser/positronWelcome.contribution.ts` detectaba `~/Library/Application Support/Code/User/settings.json` y mostraba la notificación de importación de configuraciones heredada de Positron.
- Napo declara `enableSettingsImport=false` en `product.json`; la contribución queda desactivada a nivel de producto aunque exista una preferencia antigua del usuario. No se eliminó el código compartido del importador.
- La tarea de empaquetado para macOS arm64 genera Napo directamente en `dist/Napo.app` y no vuelve a crear `VSCode-darwin-arm64`.
- `typecheck-client`, arranque en perfil limpio y `validate-napo-gate` pasan; la compuerta termina `ACEPTADA (distribución manual libre)`, con 17 pases, 0 fallos y 2 puertas externas pendientes.

## 2026-10-13 — Arranque distribuido de Napo en Bienvenida, sin carpeta heredada

- Se identificó la causa del comportamiento indeseado: el arranque sin argumentos caía en la restauración automática de la última sesión y podía reabrir `RHS-IA-Minimal`.
- Napo declara `openEmptyWindowOnStartup=true` en `product.json`. El proceso principal usa esta bandera únicamente cuando no recibe archivos ni carpetas explícitos y fuerza una ventana vacía; las aperturas explícitas conservan su comportamiento normal.
- La configuración existente de `workbench.startupEditor` (`welcomePage`) hace que esa ventana vacía muestre Bienvenida. El terminal no se altera: después de elegir una carpeta, se abre en la carpeta que muestra el explorador.
- La prueba empaquetada en `dist/Napo.app` primero abrió una carpeta temporal, cerró la sesión y volvió a iniciar Napo sin argumentos: el log registró `pathsToOpen [{}]` y una página de bienvenida, sin restaurar la carpeta anterior.
- Se reconstruyó el artefacto y se actualizó el manifiesto vigente: 32.903 archivos, digest `854d501405b732561d935add79c2b529ba0efecec2bc925985a37eba5d888a01`. Los repositorios fuente de estudio permanecen sin escritura.

## 2026-10-13 — Corrección del paquete macOS y verificación del flujo Open Folder

- La revisión del artefacto distribuido encontró la causa del mensaje de macOS: el `.app` conservaba una firma ad hoc incompleta y `codesign --verify --deep --strict` devolvía `code has no resources but signature indicates they must be present`.
- Como Napo se distribuye manualmente sin firma Apple, el empaquetado ahora elimina la firma exterior incompleta con `codesign --remove-signature`. El artefacto queda explícitamente sin firma (`unsigned / not set`), en lugar de aparentar una firma dañada.
- La auditoría `scripts/audit-napo-macos-signature.mjs` y su prueba aceptan este estado manual explícito; una firma Apple verificable continúa siendo una ruta distinta y opcional.
- Se contrastó el botón de Bienvenida con Positron: la ruta correcta ya es la estándar `workbench.action.files.openFolder` → `IFileDialogService.pickFolderAndOpen()` → selector nativo de macOS. No se añadió un selector alternativo ni se modificó ese flujo compartido.
- `validate-napo-gate` volvió a pasar: 17 pases, 0 fallos y 2 puertas externas. Los repositorios fuente permanecen sin escritura.

## 2026-10-13 — Firma ad hoc completa para distribución manual de Napo

- La prueba de lanzamiento aisló que el binario arm64 era válido y que una copia con firma ad hoc completa permanecía ejecutándose; el fallo estaba en el estado sin firma/firmado parcial del `.app`, no en el selector Open Folder.
- El empaquetado de macOS ahora ejecuta `codesign --deep --force --sign -` sobre `dist/Napo.app`. Esto sella de forma coherente el bundle y sus componentes internos, pero no es firma de Apple ni notarización.
- `codesign --verify --deep --strict` pasa; `spctl` continúa rechazando correctamente la aplicación porque no tiene identidad Apple de distribución. La auditoría conserva `adhoc / not set` y clasifica el paquete como `development-only`.
- `open -n ./dist/Napo.app` terminó con código 0 y abrió una nueva instancia. La compuerta completa volvió a pasar: 17 pases, 0 fallos y 2 puertas externas; las fuentes de estudio permanecen intactas.

## 2026-10-13 — Capibara preservada al abrir carpetas no confiables

- Se reprodujo y analizó el flujo: al crear o abrir una carpeta desde la Bienvenida, el host la trataba como workspace no confiable; como `extensions/rhs-agent4/package.json` no declara soporte para workspaces no confiables, el servicio de enablement la marcaba `DisabledByTrustRequirement` y retiraba su vista del activity bar.
- La corrección vive únicamente en el producto Napo: `product.json` declara `extensionUntrustedWorkspaceSupport.juliushearts.rhs-agent4.override=true`. Esto conserva Capibara habilitada sin desactivar globalmente la confianza del workspace y sin modificar el repositorio ni el bundle de Capibara.
- Se reconstruyó `dist/Napo.app`; la validación estructural, la integridad de Capibara, la evidencia UI ligada al digest, la consistencia documental y la compuerta completa pasan.
- El manifiesto vigente registra 32.903 archivos y digest `cadf971739658f24f262437be9622c4b2290df835b925875717d1affe59e8d62`. Resultado final: 17 requisitos aprobados, 0 fallos y 2 puertas externas pendientes.

## 2026-10-13 — Interfaz de Capibara y proveedores operativos en Napo

- El síntoma “Capibara activa pero sin interfaz” tuvo dos causas del host, no una ausencia de archivos en la extensión. El escáner de extensiones del sistema invalidaba el caché tres segundos después del arranque al comparar metadatos localizados en inglés y español; esa falsa invalidación desmontaba el webview. Napo ahora omite únicamente esa validación dinámica para sus extensiones de sistema incluidas en el bundle inmutable; las extensiones de usuario conservan la validación normal.
- La prueba UI en un perfil limpio confirmó que la vista persiste y entrega `RHS-Agent v4.0.0`, `/build-okf` y `/pdfstruct`, sin la notificación “Las extensiones han sido modificadas en disco”.
- `pdfstruct` y `rhs-rag` estaban físicamente presentes y ejecutables. OKF tenía además un problema real de integración: el puente Node basado en Electron dejaba la ruta de `cli.js` en `process.argv` con una convención distinta a Node normal, por lo que los subcomandos Commander fallaban como `unknown command`. El puente relativo de Napo normaliza `argv` sin tocar el CLI ni el código de Capibara.
- El runtime Python podía escribir `__pycache__` dentro de `Napo.app`, mutando la distribución y rompiendo su firma ad hoc después del primer uso. El host Napo establece `PYTHONDONTWRITEBYTECODE=1` para el extension host; después de activar Capibara el paquete conservó cero `__pycache__` y `codesign --verify --deep --strict` siguió pasando.
- Smoke de proveedores con `PATH=/usr/bin:/bin:/usr/sbin:/sbin`: Node embebido `v24.18.0`, `pdfstruct 0.1.0`, `rhs-rag 0.1.0` y `rhs-okf verify --json` ejecutados desde rutas relativas del bundle.
- Integridad de Capibara: `extensions/rhs-agent4/dist/extension.js` y la copia empaquetada conservan SHA-256 `84ec6ba7fc5718e81fbed4674d151d8ea506163cdfb52f7824bf2fae76b12869`.
- Manifiesto vigente: 32.904 archivos, árbol SHA-256 `8b78f14926dbee74a3537345d9b165b55034f869ffe4ef732cfd085aefb2ca8a`. `validate-napo-gate --package dist/Napo.app`: 17 pases, 0 fallos, estado `technical-accepted-with-external-gates`; quedan solo revisión legal humana y fuente institucional real de conocimiento.
- Los cinco repositorios fuente de estudio permanecieron sin cambios; todas las correcciones pertenecen a Napo/host/empaquetado.

## 2026-10-13 — Capibara visible al arrancar Napo con `open -n`

- Se reprodujo el síntoma con el artefacto distribuido: `open -n ./dist/Napo.app` arrancaba la ventana de Bienvenida, pero dejaba Capibara únicamente como icono sin abrir su webview.
- La causa estaba en el host: la vista contribuida por `juliushearts.rhs-agent4` usa activación `onView` y no se abría automáticamente en una ventana vacía. Capibara, sus proveedores y su código permanecen sin modificación.
- Napo ahora abre `capibara.SidebarProvider` al arrancar una ventana vacía, únicamente cuando el producto es Napo y todavía no hay carpeta o workspace. La Bienvenida sigue visible y no se abre ningún directorio por esta acción.
- `typecheck-client` pasó; `npm run gulp vscode-darwin-arm64` reconstruyó `dist/Napo.app`; `codesign --verify --deep --strict` pasó y no se generó `__pycache__` dentro del paquete.
- La prueba visual con `open -n` en perfil limpio mostró `RHS-Agent v4.0.0`, los controles de Capibara y la Bienvenida simultáneamente. Manifiesto vigente: 32.904 archivos, digest `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`.
## 2026-10-13 — Principio rector de reutilización de código abierto

- Para el desarrollo de Napo se adopta como regla explícita estudiar primero las estructuras que ya funcionan en Positron, RHS-IA, RHS-Agent/Capibara y sus pruebas.
- La metodología será observar, comparar, aprender, copiar selectivamente, adaptar únicamente en Minimal y verificar mediante pruebas y comportamiento real.
- No se modificarán los repositorios fuente de estudio ni Capibara. Toda adaptación permanecerá en Napo y conservará licencias, avisos, procedencia y contratos.

## 2026-10-13 — Napo inicia una tarea Capibara limpia en ventana vacía

- Se confirmó en la fuente de Capibara que `capibara.newTask` es su contrato público para cancelar el turno activo, conservar el historial y crear una tarea nueva; no fue necesario modificar Capibara.
- `src/vs/workbench/contrib/napo/browser/napoCapibara.contribution.ts` invoca ese comando una sola vez antes de abrir la vista de Capibara en una ventana Napo sin carpeta. Así se evita que el webview recupere una aprobación o ejecución heredada de otra sesión.
- La prueba con perfil limpio creó un `activeTaskId` nuevo, dejó `sessions` y `messages` del runtime vacíos y no generó auditoría de tareas anteriores. El proceso Python de Capibara inició y quedó listo.
- La tarea vieja que permanece visible en la ventana normal contiene aprobaciones pendientes de `command`; eso explica el estado `Pensando…` y no es una falla del puente R. La política `Workspace · Preguntar` se conserva como protección de Capibara.
- Validaciones: `typecheck-client`, `build-fast`, empaquetado macOS arm64, `validate-napo-package`, smoke de R/Python/Quarto, auditoría de repositorios fuente solo lectura y `codesign --verify --deep --strict` pasaron. Capibara y los repositorios fuente permanecen intactos.

## 2026-10-14 — Reinstalación de Capibara corregida y prueba de aprobaciones

- Se identificó en el repositorio de referencia `rhs-agent4` la corrección `bf646a2`: la política de aprobaciones refresca sus ajustes en runtime sin reiniciar límites ni protecciones y expone el estado efectivo de la política.
- Se reinstaló la salida construida de Capibara en `extensions/rhs-agent4/dist` y `.build/extensions/rhs-agent4/dist`, junto con su `package.json`. El repositorio fuente se mantuvo solo lectura y terminó limpio.
- El `extension.js` integrado y empaquetado conserva SHA-256 `b5840a1eeb6ef9c0b7f09a150e96c200b52c10707f4a9422795e9aacde3ed4dc` y contiene los marcadores de la corrección (`approvalStatus`, `updateSettings`, `Ajustes actualizados`).
- La capa RAG canónica faltante también se transfirió completa desde Capibara: 914 archivos, 51 MB, sin alterar el código fuente. Esto evita que LanceDB cree archivos dentro de `Napo.app` y garantiza que el bundle no se modifique durante una consulta.
- Prueba funcional sobre `dist/Napo.app` en perfil y workspace temporales: 6 ejecuciones, 0 aprobaciones bloqueantes, 0 eventos de aprobación, 0 pendientes de runtime, respuesta recibida, límites de solicitudes conservados y comprobaciones negativas pasadas.
- Después de la prueba, `codesign --verify --deep --strict dist/Napo.app` siguió pasando. El manifiesto de distribución se actualizó en `reports/napo-release-manifest.json`: árbol SHA-256 `3afac66832b8623d2ddde44a2c096d971eec40ea6e0e06c61a0213b84f140769`.
- REA analizó la extensión empaquetada como artefacto servido: evidencia `ev_2133907db96c076a2413a306ee0a5e3976ce6b42d525a971dcd2aa220b30bd08`, 2.054 archivos relevantes, 1.548 JavaScript parseados y 0 fallos de parseo. El análisis estático es parcial por presupuesto de relaciones; la prueba de runtime aporta la confirmación funcional.

## 2026-10-13 — Prueba de aceptación de Napo con país sintético

- Se creó un proyecto temporal reproducible de la República de Andesia con seis regiones, datos sintéticos, política `AND-SALUD-2026-01`, scripts R/Python, gráfico y reporte Quarto. Evidencia: `reports/napo-country-planning.json`.
- Se hicieron tres chats reales en Napo/Capibara: R para cobertura base, Python para réplica y gráfico, y R para escenarios más render Quarto.
- R produjo cobertura base `0.6157`; el escenario acelerado produjo `0.7515`, diferencia `13.59` puntos porcentuales, inversión total `132 MUSD` y `6/6` regiones mejoradas.
- Python generó `outputs/python-coverage.png`, pero `positron_execute_code` falló dos veces; Capibara detectó el fallo y terminó mediante el `python3` del sistema con pandas/matplotlib. Queda como incidencia de integración Python/Positron, no de Capibara ni de permisos.
- Quarto produjo correctamente `report/rendered/andesia-plan.html`; el agente localizó el CLI empaquetado cuando `which quarto` no lo encontró.
- El perfil estaba en `Preguntar siempre`, con escritura y ejecución desactivadas. Se cambió desde Napo a `Solo sensibles`, lectura/escritura/ejecución automáticas en el workspace. Las tres tareas nuevas registraron cero eventos `approval_required`; los eventos históricos pertenecen a `capibara-task-mv72j721-75tcmp`.
- Privacidad y arranque de extensiones pasaron: cero conexiones no locales observadas y cero errores de arranque.
- Se observó un texto obsoleto en Bienvenida que dice que R y Python no están disponibles, pese a que R inició y las extensiones están dentro del paquete. Debe corregirse en la siguiente iteración.

