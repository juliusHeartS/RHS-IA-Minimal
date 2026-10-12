# RHS-IA Minimal — Qué conservar

**Estado:** borrador de definición de producto  
**Propósito:** definir el primer perfil de Napo, una plataforma de análisis de datos, modelación, simulación y planificación asistida por IA, basada en RHS-IA/Positron y orientada a R, Python y Capibara.

## 1. Criterio general

RHS-IA Minimal debe conservar únicamente lo que ayude a este flujo:

1. abrir o crear un proyecto de análisis;
2. trabajar con datos, documentos y código R o Python;
3. producir resultados reproducibles con Markdown y Quarto;
4. pedir ayuda a Capibara para explorar, transformar, ejecutar y explicar;
5. revisar y aprobar las acciones del agente;
6. conservar la trazabilidad de los datos, decisiones, herramientas y resultados.

La interfaz debe ser pequeña y coherente. El agente puede coordinar el trabajo, pero no debe convertirse en una vía invisible para modificar archivos, ejecutar operaciones o eliminar datos sin control del usuario.

## 1.1. Primer intento de clasificación

Esta es una clasificación inicial, deliberadamente conservadora. No autoriza todavía eliminar componentes ni copiar código; sirve para orientar el inventario y las pruebas.

### Conservar como núcleo

- host Electron/Positron y workbench de escritorio;
- sistema de extensiones, activación, comandos, vistas, configuración y almacenamiento;
- editor, explorador de proyectos, búsqueda, terminal, Git y gestión básica de ventanas;
- R, Python, notebooks, Markdown, Quarto, viewers y selección de entornos;
- las extensiones de análisis de datos de RHS-IA/Positron, integradas completas y sin alteración;
- capacidades de datos que sostengan exploración, transformación, ejecución y reproducción;
- Capibara como extensión-agente integrada, junto con el contrato que necesita del host;
- aprobaciones, cancelación, sesiones, historial, auditoría, procedencia y recuperación de errores.

### Conservar solo si demuestra utilidad

- conexiones y drivers de bases de datos;
- DuckDB, SQLite, PostgreSQL y otros conectores;
- índice de código, búsqueda semántica, RAG, PDFSTRUCT y fuentes documentales;
- vistas accesorias de Positron y herramientas externas;
- servicios de sincronización, cuentas o publicación.

Cada elemento de este grupo debe justificar su presencia con un caso de uso de Napo, dependencias conocidas, licencia compatible y una prueba reproducible.

### Ocultar o aplazar inicialmente

- lenguajes y depuradores ajenos a R, Python, Markdown y Quarto;
- herramientas de desarrollo web, móvil o de extensiones que no sean necesarias para construir Napo;
- Docker, contenedores, SSH remoto y túneles si no son parte del alcance inicial;
- vistas, temas, servicios y extensiones duplicadas o no relacionadas con datos;
- marketplace y autenticación no necesarios para el análisis local; la telemetría queda prohibida;
- componentes de colaboración o publicación que no tengan una política de seguridad y procedencia.

### No transferir por defecto

- repositorios completos de origen;
- `node_modules`, binarios locales, credenciales, cachés o artefactos temporales;
- recursos de terceros sin licencia, avisos y procedencia verificables;
- componentes que permitan a Capibara eludir aprobaciones o alterar fuentes de referencia.

La eliminación física queda para una etapa posterior. Primero se probarán perfiles, catálogo, configuración y desactivación reversible.

## 2. Qué conservar de cada repositorio

| Fuente | Conservar | Papel en RHS-IA Minimal |
|---|---|---|
| **RHS-IA** | La distribución basada en Positron y Code-OSS, su identidad de producto, el trabajo de empaquetado, la documentación, la configuración de extensiones y los puntos de integración del agente | Base del escritorio y del producto final |
| **vscode** | Código fuente de VS Code/Code-OSS, workbench, sistema de extensiones, host de extensiones, comandos, vistas, configuración y empaquetado | Referencia del host; se estudiará para distinguir lo esencial de lo que Napo puede aplazar |
| **rhs-agent3 / Sacha Cuy** | Implementación existente, contratos, herramientas, prompts y flujo de análisis de datos | Referencia de comparación y compatibilidad del host |
| **rhs-agent4 / Capibara** | Extensión-agente completa existente, con sus comandos, vistas, runtime, configuración, sesiones, auditoría, procedencia, cancelación y permisos | Integración completa y prioritaria en Napo; no se debe recortar ni reescribir el agente |
| **Positron** | Extensiones de análisis de datos provistas por RHS-IA/Positron: R, Python, notebooks, Quarto, exploración de datos y viewers | Integración sin alteración; Napo debe proporcionar el host, runtime, configuración y dependencias |
| **REA** | La investigación de comportamientos de aplicaciones compiladas o ejecutadas cuando el código fuente no sea suficiente | Herramienta complementaria de investigación, no sustituto de la lectura de código fuente |

Capibara se considera la extensión completa de trabajo para Napo. Las extensiones de análisis de datos de RHS-IA/Positron también se conservan completas y sin alteración. Sacha Cuy y otras versiones se consultarán solo para resolver brechas concretas de compatibilidad, contratos o pruebas del host. La integración no implica seleccionar únicamente una parte de Capibara ni modificar las extensiones de datos.

## 3. Núcleo de escritorio que sí necesitamos

### Code-OSS

- editor y modelo de documentos;
- workbench y sistema de vistas;
- explorador de archivos y proyectos;
- terminal integrado;
- configuración, comandos y paleta de comandos;
- sistema de extensiones y activación de extensiones;
- gestión básica de ventanas, paneles y layouts;
- empaquetado de escritorio basado en Electron.

### Capacidades de Positron para análisis de datos

- ejecución y sesiones de R y Python;
- notebooks y celdas de código;
- documentos Markdown y Quarto;
- vista previa y renderizado reproducible;
- exploración y visualización de tablas y resultados;
- selección de entornos o intérpretes;
- conexiones, herramientas y extensiones de datos provistas por RHS-IA/Positron;
- APIs de Positron que el agente necesite para operar de manera controlada.

Todas las extensiones y funciones de análisis de datos provistas por RHS-IA/Positron se integran sin alteración. La reducción de Napo se aplica a capacidades ajenas al análisis de datos, no al conjunto de datos que esas extensiones proporcionan.

## 4. Capibara como parte de la interfaz

Capibara se distribuirá como función integrada de primera clase de Napo, no como una extensión opcional que el usuario tenga que descubrir e instalar por separado.

Hay que conservar o consolidar:

- panel de conversación y estado de la tarea;
- sesiones aisladas por proyecto o contexto de trabajo;
- bucle de tareas y herramientas con cancelación;
- adaptadores de proveedores de modelos;
- selector de proveedor y configuración local;
- proveedores que Capibara puede ver y utilizar, sin crear una decisión independiente de Napo;
- aprobación explícita para escribir, ejecutar, publicar o realizar acciones sensibles;
- herramientas nativas de R y Python;
- lectura y escritura controlada de archivos;
- terminal con límites y trazabilidad;
- contexto del proyecto y del código;
- índice de código cuando aporte valor real;
- Docs/Data como fuentes locales de conocimiento;
- OKF/RAG y PDFSTRUCT cuando estén validados para el flujo de análisis;
- skills y herramientas externas con catálogo revisado;
- historial, auditoría y procedencia de evidencias;
- manejo de errores, reintentos, cancelación y recuperación de sesiones;
- pruebas de integración que demuestren el flujo completo.

El agente debe informar qué va a hacer, qué fuente utilizó y qué cambió. La interfaz debe permitir detenerlo y revisar sus resultados.

## 5. Quarto y documentos Markdown

Quarto estará siempre incluido en Napo porque permite combinar texto, código, resultados y formatos reproducibles en un mismo documento.

El mínimo deseado es:

- edición cómoda de Markdown;
- formateo y validación;
- ejecución de bloques R y Python;
- vista previa o renderizado;
- exportación a los formatos necesarios;
- integración con el agente para explicar, completar o corregir documentos;
- conservación de metadatos, fuentes y resultados reproducibles.

La extensión concreta y sus dependencias deben registrarse con su licencia, versión y procedencia antes de incluirse en la distribución.

## 6. Qué ocultar, aplazar o eliminar

La reducción debe hacerse por etapas. Primero conviene ocultar o desactivar funcionalidades mediante el producto, el catálogo de extensiones, el layout y la configuración; después se puede evaluar una eliminación física cuando estén claros los efectos sobre las dependencias.

### Ocultar o aplazar inicialmente

- lenguajes, depuradores y herramientas que no sean necesarios para R, Python, Markdown o Quarto;
- funciones empresariales o de desarrollo general que no formen parte del análisis de datos;
- remoting, contenedores, desarrollo web y administración de servidores;
- paneles y vistas de Positron que no aporten al flujo mínimo;
- cuentas, sincronización y servicios en línea no necesarios para el análisis local;
- marketplace y servicios remotos obligatorios o invisibles;
- integraciones duplicadas entre el host y el agente.

### No incluir por accidente

- componentes de la distribución propietaria de Microsoft;
- marcas, iconos, recursos o extensiones de terceros sin autorización compatible;
- código o recursos de Positron sin registrar su licencia y sus obligaciones;
- credenciales, documentos de proveedores, binarios, `node_modules` o artefactos locales;
- funcionalidades que permitan al agente eludir aprobaciones o modificar datos de referencia sin trazabilidad.

## 7. Invariantes del producto

1. **Un dueño por estado:** una sola capa debe ser responsable de cada sesión, tarea, aprobación y resultado.
2. **Procedencia preservada:** cada evidencia mantiene su origen, transformación y nivel de certeza.
3. **CORE protegido:** el conocimiento o conjunto de referencia de solo lectura no se modifica desde una tarea ordinaria.
4. **Aprobación explícita:** escribir, ejecutar, publicar, instalar o eliminar requiere una decisión clara cuando corresponda.
5. **Aislamiento:** una sesión del agente no debe contaminar el contexto de otro proyecto.
6. **Degradación clara:** si R, Python, Quarto, un proveedor o una extensión no están disponibles, la interfaz debe explicar la limitación.
7. **Software libre redistribuible:** los componentes se pueden redistribuir conforme a sus licencias libres; se conservan avisos, atribuciones, textos de licencia y cualquier obligación de distribución de fuentes o cambios.
8. **Reproducibilidad:** una persona debe poder entender y repetir cómo se obtuvo un resultado.
9. **Configuración reversible:** los cambios de configuración son aditivos, idempotentes y recuperables.
10. **Distribución enfocada:** se reducen las capacidades ajenas al análisis de datos, pero no se alteran las extensiones de datos ni Capibara.

## 7.1. Política propuesta de actualizaciones y servicios externos

### Actualizaciones

La política recomendada para Napo es **manual, explícita, verificable y reversible**:

- Napo no busca ni descarga actualizaciones automáticamente.
- La persona usuaria decide cuándo descargar y aplicar una actualización.
- Cada versión se distribuye con versión, fecha, notas de cambios, hash y firma o mecanismo equivalente de verificación.
- La actualización conserva proyectos, datos, configuración y extensiones integradas.
- Debe existir una ruta clara de recuperación a la versión anterior si una actualización falla.
- Las actualizaciones de Capibara y de las extensiones de análisis de datos se validan junto con el host antes de publicar una versión de Napo.
- Las alertas de seguridad pueden documentarse en las notas de versión o canales elegidos por la persona usuaria, pero no habilitan instalación automática ni comunicación oculta.

### Qué significa “servicios externos”

Son servicios que viven fuera de la computadora de la persona usuaria: marketplace, sincronización en la nube, publicación remota, autenticación externa, servidores de actualización, telemetría, almacenamiento remoto, bases de datos remotas o endpoints de proveedores de modelos.

Napo no tendrá servicios externos obligatorios ni tráfico oculto. Los proveedores de modelos que Capibara puede ver siguen siendo parte de Capibara: si la persona usuaria configura uno, la conexión será visible, voluntaria y controlada por ella. El núcleo local de Napo no dependerá de una cuenta, marketplace, nube ni servidor propio para funcionar.

## 8. Primera matriz de decisión

| Área | Decisión inicial | Motivo |
|---|---|---|
| Editor y workbench | **Conservar** | Son la base de la experiencia de escritorio |
| Extensiones de análisis de datos RHS-IA/Positron | **Conservar completas y sin alteración** | Son parte del núcleo funcional de Napo |
| R, Python y notebooks | **Conservar** | Son el núcleo del análisis de datos |
| Markdown y Quarto | **Conservar siempre** | Sostienen documentación y resultados reproducibles |
| Explorador de datos | **Conservar** | Hace visible el resultado del análisis |
| Capibara | **Distribuir como función integrada** | Es el centro de la experiencia propuesta |
| Proveedores de modelos visibles para Capibara | **Conservar con Capibara** | Forman parte de lo que la extensión puede ver y utilizar; Napo debe exponer su configuración y acceso seguro |
| OKF, RAG y PDFSTRUCT | **Evaluar con pruebas** | Son valiosos, pero deben demostrar utilidad y trazabilidad |
| Funciones generales de Positron | **Ocultar inicialmente** | El objetivo es una superficie más pequeña |
| Funciones no relacionadas con datos | **Aplazar o eliminar después** | Aumentan mantenimiento y complejidad |
| REA | **Usar cuando corresponda** | Complementa la investigación de comportamiento |

## 9. Próximos entregables

1. Inventario de extensiones, servicios y vistas heredados de RHS-IA y Positron.
2. Comparación funcional entre Cuy, Sacha Cuy y Capibara, con pruebas y evidencia.
3. Validación de Capibara como extensión primaria y resolución de sus requisitos del host.
4. Perfil mínimo de producto: extensiones, comandos, vistas, servicios y configuración.
5. Integración del agente como componente de primera clase del escritorio.
6. Flujo de validación de extremo a extremo: proyecto, datos, R/Python, Quarto, agente, aprobación y resultado reproducible.
7. Registro de licencias, avisos, cambios y procedencia de todos los componentes reutilizados.

## 9.1. Cómo usaremos REA

REA se utilizará para responder preguntas sobre el comportamiento de las aplicaciones empaquetadas o ejecutándose. No reemplaza la lectura de los repositorios fuente ni se debe ejecutar sobre un objetivo ambiguo.

El flujo será:

1. **Definir la pregunta:** por ejemplo, cómo se abre una sesión de datos, cómo el agente solicita una aprobación, cómo se renderiza un documento Quarto o cómo se conectan una vista y una herramienta.
2. **Elegir el objetivo real:** una aplicación RHS-IA empaquetada, un artefacto de Positron, una extensión VSIX, un ASAR o una aplicación Electron abierta por el usuario.
3. **Seleccionar la ruta de REA:** análisis de JavaScript/Electron para ASAR o árboles extraídos; inventario de paquetes para archivos comprimidos; observación de un objetivo Electron o navegador cuando la pregunta dependa de ejecución.
4. **Empezar por un resumen:** obtener inventario, módulos, identidad del artefacto, digest y cobertura antes de pedir una inspección detallada.
5. **Seguir una característica concreta:** comenzar en un módulo o entrada conocida y rastrear su flujo hacia estado, herramientas, vistas y resultado.
6. **Corroborar:** usar observación de ejecución solo cuando el código o el paquete no establezcan el comportamiento. La evidencia estática no se describirá como si fuera observación de ejecución.
7. **Registrar el resultado:** guardar Evidence, identificadores, límites de cobertura, observaciones, inferencias y desconocidos en un registro de investigación.
8. **Traducir a diseño propio:** usar las conclusiones para definir contratos y pruebas de RHS-IA Minimal, sin confundir el comportamiento observado con código reutilizable ni con una autorización de copiar recursos.

### Preguntas REA iniciales

- ¿Cuál es la frontera entre el host Positron y Capibara?
- ¿Cómo se crea, identifica, cancela y recupera una sesión del agente?
- ¿Cómo llegan las aprobaciones a la interfaz y qué acciones bloquean?
- ¿Cómo se ejecutan y muestran resultados de R, Python y Quarto?
- ¿Qué módulos y extensiones son realmente necesarios para el flujo mínimo?
- ¿Qué diferencias observables existen entre Cuy, Sacha Cuy y Capibara cuando se empaquetan o ejecutan?

### Estado de disponibilidad

REA está disponible en la sesión actual y ya se utilizó para inventariar el artefacto empaquetado de RHS-IA. Los resultados iniciales están registrados en `BITACORA.md`; las afirmaciones sobre comportamiento deben seguir separando evidencia estática, observación de ejecución, inferencia y desconocido.

## 10. Decisiones aún abiertas

- ¿Qué contratos de `rhs-agent4`/Capibara debe implementar o exponer el host Napo?

Quedan fuera de decisiones abiertas: Quarto, que siempre estará incluido; las funciones de análisis de datos, que se integran completas y sin alteración; Capibara, que se distribuye como función integrada; la telemetría, que queda prohibida; y la redistribución de software libre, que se realizará conservando sus obligaciones de licencia.

Este archivo define la dirección inicial. No autoriza todavía copiar repositorios completos ni eliminar componentes del host: esas decisiones deben apoyarse en un inventario de dependencias, pruebas y revisión de licencias.
