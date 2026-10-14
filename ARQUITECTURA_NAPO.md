# Arquitectura de Napo

**Nombre clave:** Napo  
**Nombre formal del destino:** RHS-IA Minimal  
**Estado:** arquitectura base para implementación  
**Fecha:** 2026-10-12

## 1. Decisión arquitectónica principal

Napo será una distribución de escritorio derivada del host RHS-IA/Positron y sustentada en el núcleo Electron/Code-OSS. No se construirá un editor desde cero ni se reescribirán las extensiones que ya resuelven el análisis de datos o el agente.

La integración se hará en el receptor:

- Napo proporciona el host, el ciclo de vida, el almacenamiento, la configuración, el empaquetado y la seguridad.
- Capibara se distribuye completa como función integrada.
- Las extensiones de análisis de datos que RHS-IA provee desde Positron se integran completas y sin alteración.
- R, Python y Quarto son capacidades permanentes de la distribución.
- La reducción se aplica a capacidades ajenas al análisis de datos, no a Capibara ni a las extensiones de datos.

## 2. Capas

### Capa A — Host de escritorio

Basada en RHS-IA/Positron y en el núcleo de VS Code/Code-OSS:

- Electron y proceso principal;
- workbench, ventanas, paneles y layouts;
- documentos, proyectos, configuración y almacenamiento;
- sistema de extensiones y host de extensiones;
- comandos, vistas, menús y contribuciones;
- explorador, búsqueda, Git y terminal;
- empaquetado por plataforma.

Esta capa es el receptor de todas las demás. Sus contratos se estudiarán en los repositorios fuente de solo lectura y se implementarán únicamente dentro de Napo.

### Capa B — Análisis de datos

Se incorporan sin modificar las extensiones y capacidades de RHS-IA/Positron para:

- sesiones y ejecución de R;
- sesiones y ejecución de Python;
- notebooks y celdas;
- Markdown y Quarto;
- exploración, tablas, gráficos y viewers;
- selección de entornos e intérpretes;
- conexiones, drivers y herramientas de datos que esas extensiones requieran.

El host debe adaptarse a estas extensiones. No se resolverán incompatibilidades alterando su código sin una decisión explícita y evidencia de que el problema no pertenece al host.

### Capa C — Agente integrado

Capibara (`rhs-agent4`) se incorpora completa como función integrada de Napo:

- conversación, tareas y sesiones;
- herramientas y proveedores visibles para Capibara;
- acceso a archivos, terminal, R y Python;
- contexto de proyecto y código;
- Docs/Data, OKF, RAG, PDFSTRUCT y skills cuando formen parte de la extensión;
- aprobaciones, permisos, cancelación y recuperación;
- historial, auditoría y procedencia;
- vistas, comandos, configuración y almacenamiento propios.

No se creará un agente paralelo ni se transferirá solo una parte de Capibara. El trabajo de integración consiste en hacer funcionar todos sus contratos dentro del host Napo.

### Capa D — Modelación y planificación

Sobre R, Python, notebooks, Quarto y Capibara se habilitarán progresivamente:

- modelos matemáticos y estadísticos;
- modelos de inteligencia artificial;
- simulaciones de flujos dinámicos;
- escenarios, sensibilidad y comparación de alternativas;
- informes reproducibles;
- conocimiento legal y contextual versionado por jurisdicción, fecha, autoridad y fuente.

La ejecución verificable pertenece a R/Python y a las herramientas correspondientes. El LLM ayuda a formular, coordinar y explicar; no convierte una propuesta generada en evidencia ni en una decisión legal.

## 3. Contrato mínimo del host con Capibara

Antes de modificar el host se debe comprobar, documentar y probar:

1. descubrimiento, instalación y activación de la extensión;
2. compatibilidad de la API de extensión y de la versión de Electron/VS Code;
3. registro de comandos, vistas, menús y configuraciones;
4. disponibilidad de workspace, archivos, terminal, R, Python y Quarto;
5. arranque, comunicación y cierre del runtime de Capibara;
6. persistencia de sesiones, historial, configuración y estado;
7. proveedores visibles y configuración segura de credenciales;
8. aprobaciones, cancelación, permisos y aislamiento;
9. auditoría, procedencia y recuperación ante errores;
10. empaquetado completo de Capibara y sus recursos.

## 4. Política de red, telemetría y actualizaciones

- Napo no tendrá telemetría, analítica de uso ni diagnósticos enviados de forma automática.
- Napo no tendrá servicios externos obligatorios ni tráfico oculto. “Servicio externo” incluye proveedores LLM remotos, servidores locales opcionales como Ollama/LM Studio, búsqueda web, Obscura y endpoints configurables; ninguno es telemetría y ninguno se inicia como requisito oculto.
- Los proveedores que Capibara pueda ver se mantienen completos. La visibilidad no implica uso: una conexión remota requiere configuración, credencial y acción explícita de la persona usuaria; la búsqueda web inicia apagada.
- Las actualizaciones serán manuales, explícitas, verificables y reversibles; no habrá consultas silenciosas de actualización ni instalación desde Marketplace.
- Una actualización deberá indicar versión, cambios, hash y firma o mecanismo equivalente.
- No se instalarán actualizaciones silenciosas.
- La versión anterior debe poder restaurarse si una actualización falla.

La especificación operativa completa queda en [POLITICA_NAPO.md](POLITICA_NAPO.md).

## 5. Reglas de repositorio y procedencia

Las fuentes permanecen intactas:

- `/Users/julius3005/Documents/Github/RHS-IA`
- `/Users/julius3005/Documents/Github/positron`
- `/Users/julius3005/Documents/Github/rhs-agent3`
- `/Users/julius3005/Documents/Github/rhs-agent4`
- `/Users/julius3005/Documents/Github/vscode`

Toda implementación, configuración, adaptación o manifiesto de Napo vive en:

`/Users/julius3005/Documents/Github/RHS-IA-Minimal`

Cada componente reutilizado debe conservar licencia, avisos, atribución, procedencia y obligación de redistribución aplicable.

## 6. Estrategia de implementación

### Incremento 1 — Host mínimo ejecutable

- seleccionar la revisión base de RHS-IA/Positron;
- crear el esqueleto de construcción en Napo sin copiar metadatos de Git de las fuentes;
- definir identidad de aplicación, nombre clave, carpeta de datos y manifiesto de producto;
- arrancar el host con el núcleo mínimo validado.

### Incremento 2 — Paquete de datos sin alteración

- integrar las extensiones de datos de RHS-IA/Positron;
- incluir R, Python, notebooks, Markdown, Quarto y viewers;
- validar sesiones, intérpretes, ejecución y renderizado;
- registrar versiones, hashes, licencias y dependencias.

### Incremento 3 — Capibara completa

- integrar la extensión completa;
- resolver todos los contratos del host;
- validar proveedores, herramientas, sesiones, permisos y aprobaciones;
- probar el flujo de una tarea completa con R/Python.

### Incremento 4 — Superficie Napo

- ocultar o retirar solo lo ajeno al análisis de datos;
- conservar degradación clara y configuración reversible;
- validar ausencia de telemetría y de servicios obligatorios;
- producir un paquete reproducible y verificable.

## 7. Puertas de calidad

No se avanza de un incremento al siguiente sin:

- compilación reproducible;
- pruebas unitarias y de integración relevantes;
- arranque y cierre limpios;
- validación de R, Python y Quarto;
- validación de Capibara completa;
- revisión de permisos, aprobaciones y aislamiento;
- comprobación de telemetría cero;
- inventario de licencias y procedencia;
- prueba de actualización y recuperación;
- verificación automática de que los cinco repositorios fuente conservan el estado de solo lectura documentado;
- evidencia del artefacto final mediante inspección estática y, cuando corresponda, REA.

## 8. Riesgos iniciales

- incompatibilidad entre la versión base del host y los contratos de Capibara;
- dependencia de cambios locales preexistentes en los repositorios fuente;
- tamaño y complejidad del árbol de Positron;
- extensiones o recursos que requieran servicios remotos no documentados;
- licencias y avisos de componentes redistribuidos;
- rutas de runtime de R, Python, Quarto y herramientas auxiliares;
- diferencia entre una extensión integrada y una extensión instalada por el usuario;
- superficies heredadas de VS Code que puedan introducir telemetría o servicios no deseados.

Estos riesgos se resuelven con inventario, contratos, pruebas y evidencia; no con suposiciones.
