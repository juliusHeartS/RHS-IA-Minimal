# Plan de trabajo — RHS-IA Minimal

**Estado:** implementación inicial activa en el destino; los repositorios fuente permanecen en solo lectura
**Fecha:** 2026-10-12  
**Destino de cambios:** `/Users/julius3005/Documents/Github/RHS-IA-Minimal`

## Nombre clave del producto

El nombre clave oficial de RHS-IA Minimal será **Napo**.

La nomenclatura de trabajo queda definida así:

- **Napo:** distribución y plataforma de escritorio de análisis de datos.
- **Capibara:** extensión-agente principal integrada en Napo.
- **RHS-IA:** fuente de la distribución y del trabajo de empaquetado.
- **Positron:** fuente de capacidades de análisis de datos y componentes reutilizables.

“Napo” se usará como nombre corto en conversaciones, bitácoras, builds, pruebas y decisiones internas. El nombre formal del repositorio y del producto seguirá siendo `RHS-IA Minimal` hasta que se decida un cambio de identidad pública.

### Decisión consolidada de superficie

Capibara va completa y sus proveedores visibles no son una decisión abierta: se conserva toda esa superficie y sus contratos de configuración segura. Quedan aplazadas del paquete inicial las integraciones ajenas al núcleo de Capibara y del análisis local: `microsoft-authentication`, `positron.next-edit-suggestions`, `positron-dev-containers` y `positron-skills`. `positron-run-app` permanece porque ejecuta aplicaciones analíticas locales. La prueba reversible está en `reports/napo-reduction-auth-ai-remote-skills.json`; las fuentes permanecen intactas.

## Definición estratégica de Napo

**Napo es una plataforma de análisis de datos, modelación y planificación asistida por inteligencia artificial.** Usa R y Python, al estilo de Positron y RHS-IA, para construir y ejecutar modelos matemáticos, estadísticos y de inteligencia artificial, además de simulaciones dinámicas y análisis de escenarios.

Napo integra esas capacidades con Capibara, su agente de inteligencia artificial, que utiliza LLMs y conocimiento contextual de entornos legales para ayudar a formular problemas, construir modelos, ejecutar análisis, comparar escenarios y convertir resultados en soluciones de planificación para países, regiones, instituciones y otros sistemas complejos.

### Capas de la plataforma

1. **Host Napo:** el receptor que instala, activa y gobierna las extensiones, proyectos, procesos y permisos.
2. **Motores analíticos:** R y Python para ejecutar código, transformar datos, ajustar modelos y reproducir resultados.
3. **Modelación y simulación:** modelos matemáticos, estadísticos y de IA; flujos dinámicos, escenarios, sensibilidad y comparación de alternativas.
4. **Agente Capibara:** interfaz inteligente que interpreta objetivos, coordina herramientas, propone código y modelos, y explica resultados mediante LLMs.
5. **Conocimiento legal y contextual:** fuentes versionadas por jurisdicción, fecha y autoridad, con referencias y revisión humana.
6. **Gobernanza y trazabilidad:** aprobaciones, bitácora de acciones, procedencia de datos y código, supuestos explícitos, incertidumbre y revisión de resultados.

### Relación entre IA generativa e IA analítica

La IA generativa ayuda a entender objetivos, formular hipótesis, diseñar planes de análisis, escribir o transformar código, coordinar herramientas y explicar resultados. R y Python realizan la ejecución analítica verificable. La plataforma debe conservar los datos, el código, los parámetros, los supuestos, las versiones y las fuentes que permitan reproducir cada resultado.

Capibara no debe presentar una propuesta de un LLM como hecho analítico ni como criterio legal definitivo. En decisiones de alto impacto, Napo debe mostrar incertidumbre, alternativas, consecuencias, fuentes y los puntos que requieren decisión de personas responsables.

### Alcance por etapas

- **Primera etapa:** host Napo, integración de Capibara, proyectos reproducibles, datos, R, Python, notebooks, Quarto, modelos y aprobaciones.
- **Segunda etapa:** simulaciones, escenarios, sensibilidad, comparación de alternativas y generación de informes trazables.
- **Tercera etapa:** conocimiento legal y contextual con fuentes versionadas, jurisdicción, fecha, citas y revisión experta.
- **Etapa posterior:** planificación nacional, regional e institucional con marcos de gobernanza, validación y responsabilidad claramente definidos.

Esta definición expresa la visión de Napo; no afirma que todas estas capacidades estén implementadas hoy ni pretende sustituir a especialistas legales, científicos o responsables de política pública.

## 1. Regla principal de colaboración

Los repositorios fuente son estrictamente de solo lectura:

- `/Users/julius3005/Documents/Github/RHS-IA`
- `/Users/julius3005/Documents/Github/positron`
- `/Users/julius3005/Documents/Github/rhs-agent3`
- `/Users/julius3005/Documents/Github/rhs-agent4`
- `/Users/julius3005/Documents/Github/vscode`
- cualquier otro repositorio identificado como fuente por el usuario

En ellos se puede leer, comparar, estudiar y copiar selectivamente, pero no se puede:

- editar archivos;
- cambiar ramas o commits;
- actualizar dependencias;
- ejecutar herramientas que escriban dentro del repositorio;
- borrar, mover o renombrar contenido;
- modificar configuraciones locales del repositorio.

`RHS-IA-Minimal` será el destino de cualquier implementación futura. Este documento tampoco autoriza por sí solo la implementación; primero se necesita la aprobación explícita del usuario.

## 2. Objetivo

Construir una distribución de escritorio de análisis de datos, más sencilla que Positron, basada en el trabajo existente de RHS-IA y Positron, con Capibara como función integrada y con las extensiones de análisis de datos, R, Python, notebooks, Quarto y exploración de datos completas y sin alteración.

El producto debe conservar control del usuario, aprobaciones explícitas, trazabilidad, procedencia y reproducibilidad.

## 3. Fases

### Fase 0 — Estado y límites

- Leer y respetar `QUE_CONSERVAR.md`.
- Mantener los repositorios fuente sin escrituras.
- Confirmar qué aplicaciones y artefactos empaquetados existen.
- Registrar versiones, commits, licencias y procedencia sin modificar fuentes.
- Separar observaciones, inferencias y decisiones de diseño.

**Salida:** inventario inicial y registro de restricciones.

### Fase 1 — Investigación de artefactos con REA

Usar REA sobre aplicaciones empaquetadas o en ejecución, no como sustituto del análisis normal de código fuente.

Preguntas iniciales:

1. ¿Qué partes del host Electron/Code-OSS/Positron son indispensables?
2. ¿Cómo arranca y se integra RHS-Agent?
3. ¿Qué extensiones y procesos participan realmente en R, Python, notebooks, Quarto y datos?
4. ¿Qué funciones de VS Code son ajenas al producto Minimal?
5. ¿Qué diferencias observables existen entre RHS-IA y Positron?

Método:

- abrir el artefacto real y verificar su identidad;
- empezar con inventario y resumen;
- seguir módulos o funciones concretas;
- observar ejecución solo cuando la evidencia estática no sea suficiente;
- guardar Evidence, cobertura, limitaciones y desconocidos;
- cerrar las sesiones de análisis al terminar.

**Salida:** ledger de evidencia REA y mapa de comportamiento observado.

### Fase 2 — Lectura y comparación de fuentes

Comparar, siempre en modo de solo lectura:

- RHS-IA frente a Positron;
- rhs-agent3 frente a rhs-agent4 y, si está disponible, rhs-agent2;
- extensiones integradas frente a extensiones instaladas por el usuario;
- componentes duplicados o equivalentes.

Para cada pieza se registrará:

| Campo | Descripción |
|---|---|
| Fuente | Repositorio y ruta original |
| Función | Qué problema resuelve |
| Dependencias | Qué necesita para funcionar |
| Estado | Obligatoria, opcional, aplazada o excluida |
| Licencia | Licencia, avisos y restricciones |
| Destino | Qué se transferiría a Minimal |
| Evidencia | Prueba estática, empaquetada o de ejecución |

**Salida:** matriz de transferencia y matriz de dependencias.

### Fase 3 — Definición del perfil Minimal

Definir tres capas:

1. **Núcleo:** Electron, workbench, documentos, proyectos, extensiones, configuración, Git y terminal.
2. **Datos:** extensiones de análisis de datos de RHS-IA/Positron sin alteración, R, Python, notebooks, Markdown, Quarto, viewers, entornos, conexiones y drivers que esas extensiones necesiten.
3. **Agente:** RHS-Agent, sesiones, herramientas, aprobaciones, historial, procedencia y auditoría.

Clasificar como candidatos a excluir o aplazar:

- lenguajes no relacionados con R, Python, Markdown o Quarto;
- depuración y profiling de JavaScript si no son necesarios para el producto;
- Docker, contenedores, SSH remoto y túneles si no forman parte del alcance;
- herramientas de desarrollo de extensiones;
- temas duplicados, vistas accesorias y servicios en línea no elegidos.

La exclusión física solo se evaluará después de comprobar dependencias y pruebas. Primero se preferirán perfiles, catálogo, configuración y desactivación reversible.

**Salida:** especificación del perfil Minimal y lista justificada de exclusiones.

### Fase 4 — Integración de la extensión Capibara

La dirección de trabajo queda establecida así: **Capibara (`rhs-agent4`) se integrará completa como extensión existente en Napo (RHS-IA Minimal)**.

No se construirá otro agente desde cero, no se recortará Capibara ni se hará una reingeniería interna para sustituirla. El problema principal es el receptor: la plataforma Napo donde la extensión completa debe instalarse, activarse y comunicarse con su runtime.

La validación se concentrará en el contrato entre la extensión y el host:

- instalación y descubrimiento de la extensión;
- activación y ciclo de vida dentro del host;
- comandos, vistas, paneles y menús que espera la extensión;
- comunicación con el runtime de Capibara;
- almacenamiento de estado, sesiones y configuración;
- integración con workspace, archivos, terminal, R y Python;
- aprobaciones, cancelación, auditoría y procedencia;
- empaquetado de la extensión y sus dependencias;
- compatibilidad de versiones entre el host y la extensión;
- recuperación ante runtime ausente, error o actualización.

rhs-agent3, rhs-agent2 y las implementaciones anteriores se consultarán solo si ayudan a entender un contrato del host, una dependencia o una prueba de integración.

La prioridad es integrar la extensión completa existente. No se transferirá internamente su código ni se adaptará su lógica por defecto; solo se copiarán o adaptarían elementos del host o del empaquetado si son imprescindibles para que Capibara funcione completa.

Las extensiones de análisis de datos que RHS-IA provee desde Positron seguirán la misma regla de conservación: se integrarán sin alteración. No se modificará su código, contratos ni comportamiento. Napo deberá resolver su instalación, activación, runtime, configuración y dependencias, y solo se evaluará excluir extensiones que no pertenezcan al núcleo de análisis de datos.

**Salida:** matriz de requisitos del host y primer procedimiento reproducible para instalar y activar Capibara en Napo.

### Fase 5 — Transferencia al destino

Solo después de autorización explícita:

- copiar selectivamente archivos o módulos desde las fuentes;
- crear configuración, manifiestos y build dentro de `RHS-IA-Minimal`;
- conservar avisos y licencias;
- registrar cada transferencia en la bitácora;
- evitar copiar repositorios completos o dependencias locales accidentales;
- no modificar ninguna fuente.

**Salida:** primera implementación reproducible de RHS-IA Minimal.

### Fase 6 — Validación

Validar en el destino:

- arranque y cierre;
- apertura de proyecto;
- edición, búsqueda, Git y terminal;
- ejecución de R y Python;
- notebooks y celdas;
- Quarto y Markdown;
- exploración de datos y viewers;
- RHS-Agent, aprobaciones, cancelación y auditoría;
- DuckDB, SQLite y PostgreSQL si se incluyen;
- ausencia de dependencias sobre componentes excluidos.

Después, usar REA sobre el artefacto generado para verificar que el paquete coincide con el perfil definido.

**Salida:** informe de validación y lista de riesgos pendientes.

## 4. Entregables

- Este plan.
- `ARQUITECTURA_NAPO.md` con las capas, contratos, incrementos y puertas de calidad.
- `MATRIZ_HOST_CAPIBARA.md` con requisitos iniciales del receptor, extensiones de datos y pruebas.
- `PERFIL_NAPO_MINIMAL.md` con la clasificación concreta de la superficie empaquetada y las puertas para reducirla.
- `AGENTE.md` con reglas permanentes para futuras sesiones.
- `BITACORA.md` con hechos y decisiones importantes.
- `.memoria/CONTEXTO.md` con el contexto resumido y enlaces internos.
- Inventario de fuentes y artefactos.
- Ledger de evidencia REA.
- `REA_EVIDENCIA_NAPO.md` y `reports/rea-napo-host-evidence.json` con el alcance, IDs, hashes, cobertura y límites de la investigación del artefacto.
- Matriz de transferencia.
- `MATRIZ_TRANSFERENCIA_NAPO.md` con referencias de fuente, destino, decisión, hash/evidencia y puertas de transferencia.
- Perfil de extensiones y capacidades.
- Decisión sobre RHS-Agent.
- Registro de licencias y procedencia.
- Build y pruebas de RHS-IA Minimal, cuando sean autorizados.

## 5. Criterios de finalización

El trabajo se considerará listo cuando:

- el producto arranque con el perfil definido;
- las funciones de análisis de datos funcionen de extremo a extremo;
- RHS-Agent respete aprobaciones, trazabilidad y cancelación;
- las extensiones excluidas no sean dependencias ocultas;
- cada componente transferido tenga fuente, licencia y motivo documentados;
- los repositorios fuente permanezcan sin modificaciones;
- el artefacto final pueda reconstruirse y verificarse.

## 6. Estado histórico de implementación 2026-10-12

Este apartado conserva el diagnóstico de ese corte y queda supersedido por `## 7. Estado vigente 2026-10-13`, `## 10 — Corte de continuidad` y `AUDITORIA_CIERRE_NAPO.md`. No debe usarse para reabrir decisiones ya cerradas.

La primera implementación del receptor ya está activa únicamente en Napo: Capibara completa está integrada desde su artefacto existente, Quarto está incluido, las extensiones de análisis de datos se conservan sin alteración y la política de telemetría y actualizaciones automáticas está cerrada. El host Electron carga y el host de extensiones inicia; las pruebas de cliente, empaquetado, extensiones y Positron pasan según `BITACORA.md`.

La siguiente puerta no es recortar componentes: es demostrar los flujos funcionales de R, Python, Quarto y Capibara con un perfil limpio, y cerrar licencias, avisos de terceros, URLs heredadas, proveedores visibles, credenciales y reproducibilidad de la distribución. Los repositorios fuente continúan siendo solo lectura.

La protección de solo lectura quedó automatizada en `scripts/audit-napo-source-readonly.mjs`. El baseline registra el estado preexistente de las cinco fuentes y `validate-napo-gate` lo verifica antes de aceptar el paquete; una diferencia obliga a detener la implementación y revisar qué ocurrió.

El contrato inicial de conocimiento versionado está en `NAPO_CONOCIMIENTO.md`; `scripts/validate-napo-knowledge-source.mjs` comprueba procedencia, jurisdicción, fecha efectiva, hash, licencia y revisión humana sin inventar contenido normativo.

El smoke `scripts/smoke-napo-extension-startup.mjs` observa el arranque del paquete real y separa activación, recursos no disparados y errores de activación. Sirve como evidencia inicial para las extensiones aún abiertas, pero no autoriza retirar una extensión sin pruebas funcionales del flujo que pudiera depender de ella.

La auditoría `scripts/audit-napo-extension-contracts.mjs` comprueba para las 13 extensiones restantes los puntos de entrada de escritorio, comandos, vistas, menús y recursos declarados. El corte vigente registra 0 errores y 4 advertencias explicadas: tres entradas `browser` opcionales no materializadas en el paquete macOS y una referencia a `workbench.action.closeFolder`, que pertenece al host. Esta evidencia reduce el riesgo estático, pero no sustituye las pruebas UI de cada comando o vista.

La evidencia UI está comprobada y ligada al digest de aquel corte mediante `scripts/validate-napo-extension-ui-evidence.mjs`: documentación local de RHS-IA, navegador integrado, visor multimedia, ocho lenguajes de trabajo, preview local de Markdown, selector de idioma español, render local de Mermaid, Auto Attach controlado, resolución de conflictos y ejecución/preview local de aplicaciones. El reporte declaraba 16 flujos `pass` y una observación `partial` del entorno Python cuando faltaba `ipykernel`; la referencia a `debug-server-ready` queda histórica y no representa la superficie actual.

## 7. Estado vigente 2026-10-13

La puerta funcional de R, Python y Quarto ya tiene evidencia de interfaz y de CLI en el paquete macOS: Python inicia y ejecuta un archivo, Quarto ejecuta una celda Python y abre su previsualización, y el smoke vuelve a pasar R, Python/Jupyter y ambos renders. Capibara tiene evidencia E2E de proveedores, aprobación, rechazo, procedencia, persistencia, cancelación y recuperación del host.

La investigación REA del host empaquetado está documentada en `REA_EVIDENCIA_NAPO.md` y su bundle exportado. Es una investigación acotada a `main.js` y `workbench.js`; su cobertura semántica es parcial y no autoriza afirmar equivalencia completa ni ausencia de componentes.

Para la distribución manual libre quedan abiertas: revisión legal humana y de dependencias transitivas, y una fuente institucional real para conocimiento versionado y planificación. La firma Apple, el sellado y la notarización no son requisitos de Napo. El canal operativo de actualizaciones ya está decidido como manual, explícito, verificable y reversible. `@vscode/policy-watcher` queda empaquetado y validado como soporte administrativo local del host, no como servicio externo ni dependencia de un proveedor.

La primera reducción temporal ya está instrumentada con `scripts/test-napo-surface-reduction.mjs`. Las 36 candidatas aisladas del paquete pasan validador y smoke en un clon; este resultado es una puerta de prueba, no una autorización automática para retirar componentes del destino.

La evidencia se amplió con una corrida de interfaz en perfil limpio: el clon reducido ejecutó R/Quarto y Python 3.13.3 con `NAPO_REDUCED_R_QUARTO_OK` y `NAPO_PYTHON_UI_OK`. El resultado se registra en `reports/napo-reduction-ui-evidence.json`; la eliminación permanente sigue condicionada a licencias, dependencias implícitas y reconstrucción reproducible.

## 9. Automatización nativa y criterio de reproducibilidad — 2026-10-13

El binding nativo de `@vscode/policy-watcher` ya no se considera un artefacto manual. El destino fija `node-gyp@13.1.0`, mantiene `scripts/build-napo-policy-watcher.mjs` y ejecuta esa tarea dentro del flujo `gulp vscode-darwin-arm64`. La tarea solo actúa sobre el objetivo macOS arm64 de Napo, conserva un binding ya validado y admite recompilación explícita mediante `NAPO_FORCE_POLICY_WATCHER_BUILD=1`.

La reconstrucción completa posterior pasó typecheck, validación estructural, smoke de R/Python/Quarto, auditorías de extensiones y licencias, manifiesto verificable de release y la suite Positron. La reproducibilidad del componente nativo queda cerrada para este destino; para la distribución manual libre siguen abiertas las puertas de revisión legal humana y conocimiento institucional real. Firma, sellado y notarización Apple no son requisitos de Napo. El canal manual de actualización ya está decidido.

El estado de firma se documenta mediante `npm run audit-napo-macos-signature -- --package dist/Napo.app`. En el entorno actual clasifica el artefacto como `development-only`; es información del paquete y no un requisito de Napo. `--require-distribution` queda disponible únicamente para diagnosticar una ruta opcional identificada por Apple. La distribución manual libre está formalizada en `POLITICA_NAPO.md` y protegida por la compuerta consolidada.

La aceptación técnica consolidada se ejecuta con `npm run validate-napo-gate -- --package dist/Napo.app`. La corrida vigente pasa estructura, runtimes, Quarto, privacidad, superficie, licencias y manifiesto; `--require-distribution` conserva el diagnóstico opcional de la ruta Apple.

## 8. Estado histórico de aplicación controlada de la reducción — 2026-10-13

Este apartado registra una etapa intermedia de reducción. Sus cifras de 63 extensiones y 17 bajo prueba quedan supersedidas por el corte canónico posterior de 59 extensiones, 46 conservadas y 13 bajo revisión funcional.

La reducción dejó de ser solamente experimental y se aplicó al empaquetado de Napo. `build/lib/extensions.ts` mantiene una lista explícita de 63 extensiones de lenguajes, temas, tooling e integraciones externas no necesarias para el perfil analítico; la exclusión afecta al artefacto distribuido, no borra ni altera sus carpetas fuente.

El paquete reconstruido contiene 63 extensiones: 46 conservadas y 17 con prueba específica pendiente. Capibara completa, las extensiones de análisis de datos y Quarto siguen presentes. La reducción reversible de las 23 candidatas y la reducción adicional de cuatro integraciones ajenas pasó el validador, el smoke de R/Python/Quarto y el arranque del host. Pasan `build-fast-extensions`, `gulp vscode-darwin-arm64`, `validate-napo-package -- --require-runtime` y `smoke-napo-runtime`.

Durante la aceptación UI del paquete final se encontró y corrigió una condición de coexistencia: `PortFinder` comprobaba `localhost`, que en macOS puede resolver a IPv6, mientras los kernels enlazan IPv4. Napo ahora configura su host de extensiones con resolución IPv4-first, sin modificar `PortFinder` ni las extensiones Positron. Con RHS-IA abierto, Python 3.13.3 inició; Quarto generó y previsualizó HTML con `NAPO_QUARTO_UI_OK`.

La evidencia está en `reports/napo-final-package-ui-evidence.json`. En ese corte histórico, la política operativa de actualización todavía tenía pendiente definir el canal público y la firma de publicación; el estado vigente está formalizado en `POLITICA_NAPO.md` y en `AUDITORIA_CIERRE_NAPO.md`. El binding nativo de `@vscode/policy-watcher` se compiló, se empaquetó y el validador comprueba su integridad. La prueba UI final de una celda Quarto/R produjo `NAPO_REDUCED_R_QUARTO_OK` con R 4.5.3; R y Quarto/R quedan validados por UI y CLI.

## 10 — Corte de continuidad para la siguiente implementación

El estado canónico se encuentra en `AUDITORIA_CIERRE_NAPO.md`. La base técnica de Napo ya está construida y pasa la puerta de desarrollo; la siguiente implementación debe elegir una puerta abierta concreta, generar evidencia y volver a ejecutar la puerta consolidada. No se debe empezar todavía una reingeniería de Capibara ni una modificación de las extensiones de análisis de datos.

La superficie de capacidades de Capibara ya fue comprobada con `npm run audit-napo-capabilities`, y los motores ya pasan `npm run smoke-napo-modeling`: están presentes programación analítica R/Python, simulaciones, modelado predictivo, Quarto, informes, citas sustentadas, RAG/OKF y planificación institucional. Además, la interfaz ya demostró la ruta canónica `Capibara → positron_execute_code → sesión R viva` para modelo, simulación, escenarios, sensibilidad y planificación basada en una fuente local versionada, con aprobación visible. Las evidencias están en `reports/napo-capibara-positron-e2e.json`, `reports/napo-capibara-sensitivity-e2e.json` y `reports/napo-capibara-planning-e2e.json`. El siguiente paso funcional es ampliar esa coordinación a conocimiento legal versionado e institucional, con revisión humana y gobernanza explícita; no crear un segundo agente ni un segundo motor analítico dentro del host.

La frontera de conocimiento se endureció en el receptor: el manifiesto y el contenido deben permanecer dentro de la raíz autorizada sin traversal ni symlink externo, la fecha efectiva debe existir en el calendario y el archivo debe conservar su hash exacto. `npm run test-napo-knowledge-governance` cubre estos casos junto con la separación entre fuente pendiente y fuente aprobada; también ejercita `audit-napo-knowledge-bundle.mjs` sobre una raíz completa y en modo estricto. La prueba de planificación continúa siendo local y determinista; no declara validez jurídica de ninguna fuente.

La transferencia ya tiene una ruta operativa verificable: `prepare-napo-knowledge-bundle.mjs` materializa únicamente fuentes aprobadas en `Docs/`, conserva el manifiesto lateral y el recibo, y `test-napo-materialized-planning.mjs` confirma que `Rscript` lee ese contenido y reproduce el cálculo. La evidencia usa un fixture no legal; el siguiente incremento de producto requiere una raíz institucional real, revisión humana y una nueva prueba desde la interfaz de Capibara.

### Nota de continuidad — reproducibilidad y cierre técnico — 2026-10-13

La construcción de Napo ya tiene una compuerta técnica reproducible. `build/lib/asar.ts` ordena las entradas antes de construir `node_modules.asar`; dos reconstrucciones consecutivas de la superficie actual fueron byte a byte idénticas. El manifiesto canónico registra 32.904 archivos y digest `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`. La cobertura funcional de las 13 extensiones clasificadas como `requiere-prueba` queda reconciliada en `reports/napo-extension-functional-coverage.json`; la siguiente iteración debe concentrarse en revisión legal, firma/canal o conocimiento institucional versionado y no reabrir la integración de Capibara ni alterar las extensiones de datos.

### Nota de continuidad — reducción de `debug-server-ready` — 2026-10-13

Las extensiones `vscode.debug-server-ready`, `vscode.make`, `vscode.javascript` y `vscode.html` fueron retiradas únicamente del empaquetado de Napo después de pasar reducciones reversibles con validación estructural y smoke completo de R/Python/Quarto. La fuente de VS Code no se modificó. El artefacto vigente contiene 59 extensiones, 46 conservadas y 13 bajo revisión; conserva Capibara completa, las extensiones de análisis de datos y Quarto. El manifiesto canónico registra 32.904 archivos y digest `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`.

### Nota histórica — higiene reproducible del artefacto — 2026-10-13 (superada por el corte canónico posterior)

La última compuerta completa detectó y corrigió residuos `__pycache__`/`.pyc` creados durante el arranque: 16 del runtime de Capibara y tres de Jupyter/Quarto. La corrección vive únicamente en Napo: reglas de exclusión para el destino y limpieza acotada del smoke después de cerrar la aplicación. El paquete vigente tiene 32.927 archivos y digest `48d4f535ea42dd173a2fe753b6b28ada3c197a689444de18af677b7426c132c5`; `verify-napo-release` pasa y el árbol queda sin esos residuos. Esta higiene no altera Capibara ni las extensiones de datos y debe conservarse en reconstrucciones futuras.

El cliente compilable también pasa `npm run typecheck-client` y las pruebas ejecutables de Positron. El chequeo global `test:positron:check-ts` queda identificado como deuda heredada de tipado en archivos no modificados por Napo; antes de abordarlo se debe establecer un baseline y una sincronización de dependencias, sin introducir arreglos silenciosos en Capibara ni en las extensiones de análisis de datos.

### Nota de continuidad — contrato de privacidad del paquete — 2026-10-13

La política `telemetría nunca` se aplica ahora en el paquete final, no solo en la configuración del host: `build/lib/extensions.ts` elimina claves `aiKey` y fuerza a falso cualquier bandera declarativa de telemetría de los manifiestos empaquetados. `scripts/audit-napo-privacy-contract.mjs` queda integrado en la compuerta y el smoke de arranque confirma cero conexiones no locales. Las URLs de compatibilidad se mantienen únicamente cuando representan una acción explícita o soporte de web/remote; no se consideran servicios automáticos. La siguiente iteración debe preservar esta separación y no resolverla retirando capacidades analíticas.

### Corrección del flujo de creación de proyectos — 2026-10-13

El paquete vigente contiene 32.903 archivos y tiene el digest `cadf971739658f24f262437be9622c4b2290df835b925875717d1affe59e8d62`. El host de Napo ahora conserva habilitada Capibara cuando el usuario crea o abre una carpeta todavía no confiable, mediante el override específico de `juliushearts.rhs-agent4` en `product.json`. No se tocó ningún repositorio fuente ni la extensión completa de Capibara.
