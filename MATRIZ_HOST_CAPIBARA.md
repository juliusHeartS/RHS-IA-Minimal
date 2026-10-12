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
| Proveedores | configuración de Capibara y almacenamiento de credenciales | Los proveedores visibles aparecen y fallan de forma clara |
| Permisos | configuración de perfiles y aprobaciones | Escritura, ejecución e instalación solicitan aprobación |
| Persistencia | `globalState`, `workspaceState`, secretos e historial | Sesión e historial sobreviven al reinicio |
| Red | clientes y endpoints configurados por el usuario | No hay tráfico oculto ni telemetría |
| Empaquetado | VSIX, binarios, recursos y dependencias | La extensión completa funciona desde el artefacto final |

## 3. Riesgos de compatibilidad

1. La API declarada por Capibara es `^1.95.0`, pero el host base RHS-IA/Positron tiene versiones propias y cambios locales.
2. Capibara puede requerir recursos binarios (`rhs-rag`, `pdfstruct`, `obscura`, `rhs-okf`) y rutas que deben resolverse en el paquete de Napo.
3. Las extensiones de datos dependen de servicios internos de Positron, no solo de la API pública de extensiones.
4. Las configuraciones de proveedores contienen credenciales y no deben copiarse desde ninguna fuente.
5. Los repositorios `positron`, `rhs-agent3` y `rhs-agent4` tienen cambios locales preexistentes; no se puede tomar su estado de trabajo como baseline sin separar esos cambios.
6. La ausencia de telemetría debe comprobarse en el host, extensiones, scripts de build y artefacto empaquetado.

## 4. Pruebas del primer incremento

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

## 5. Próximo paso técnico

Construir un inventario exhaustivo de extensiones y dependencias desde el `product.json`, `extensions/package.json` y manifiestos de cada extensión de la revisión base elegida. Después se definirá el primer manifiesto de producto de Napo dentro de `RHS-IA-Minimal`, sin modificar ninguna fuente.
