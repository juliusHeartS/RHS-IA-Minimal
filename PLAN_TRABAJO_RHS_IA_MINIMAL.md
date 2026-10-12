# Plan de trabajo — RHS-IA Minimal

**Estado:** plan inicial, sin implementación autorizada todavía  
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
- `AGENTE.md` con reglas permanentes para futuras sesiones.
- `BITACORA.md` con hechos y decisiones importantes.
- `.memoria/CONTEXTO.md` con el contexto resumido y enlaces internos.
- Inventario de fuentes y artefactos.
- Ledger de evidencia REA.
- Matriz de transferencia.
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

