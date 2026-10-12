# Bitácora — RHS-IA Minimal

Esta bitácora conserva hechos, decisiones y límites importantes. No sustituye al código fuente ni autoriza cambios por sí sola.

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

