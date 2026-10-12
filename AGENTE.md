# AGENTE.md — Reglas de trabajo para RHS-IA Minimal

## Regla no negociable: fuentes de solo lectura

Estos repositorios son fuentes y nunca deben modificarse:

- `/Users/julius3005/Documents/Github/RHS-IA`
- `/Users/julius3005/Documents/Github/positron`
- `/Users/julius3005/Documents/Github/rhs-agent3`
- `/Users/julius3005/Documents/Github/rhs-agent4`
- `/Users/julius3005/Documents/Github/vscode`

Se permite leer, buscar, comparar, analizar con REA y copiar selectivamente hacia el destino autorizado. No se permite escribir, borrar, mover, renombrar, cambiar ramas, actualizar dependencias ni alterar configuraciones en ellos.

## Destino autorizado

El destino del proyecto es:

`/Users/julius3005/Documents/Github/RHS-IA-Minimal`

El nombre clave de este producto es **Napo**. Napo es la plataforma; Capibara es la extensión-agente integrada. No deben confundirse ambos nombres.

La visión de Napo es convertirse en una plataforma de análisis de datos, modelación y planificación asistida por inteligencia artificial: R y Python ejecutan los análisis; Capibara coordina la interacción mediante LLMs; y el conocimiento legal y contextual debe conservar jurisdicción, fecha, fuente, versión y revisión humana. La IA generativa puede proponer, transformar, explicar y coordinar, pero no sustituye la ejecución analítica ni la responsabilidad científica, legal o de política pública.

Durante una fase de análisis no se deben crear cambios de implementación allí. Las escrituras de implementación requieren autorización explícita del usuario.

## Forma de trabajar

1. Leer primero `QUE_CONSERVAR.md` y este archivo.
2. Consultar `BITACORA.md` y `.memoria/CONTEXTO.md` antes de continuar una investigación.
3. Distinguir siempre hechos observados, inferencias y decisiones propuestas.
4. Usar REA para artefactos empaquetados y comportamiento de ejecución.
5. Usar herramientas normales para leer y comparar código fuente.
6. No tratar un resultado estático como si fuera una observación de ejecución.
7. Registrar evidencia, límites, desconocidos y decisiones importantes.
8. Preferir cambios reversibles y perfiles de configuración antes de eliminar físicamente componentes.
9. No copiar repositorios completos, credenciales, `node_modules`, binarios locales ni artefactos temporales.
10. Mantener licencias, avisos y procedencia de todo componente reutilizado.

## Objetivo de producto

RHS-IA Minimal debe ser un escritorio de análisis de datos basado en el trabajo existente de RHS-IA y Positron, con R, Python, notebooks, Markdown, Quarto y RHS-Agent como capacidades centrales, manteniendo aprobaciones, trazabilidad, aislamiento y reproducibilidad.

La base prevista de RHS-Agent es la **extensión Capibara (`rhs-agent4`) ya existente y se integrará completa**. No se debe recortar, fragmentar, sustituir ni reescribir el agente. El trabajo principal es preparar el host RHS-IA Minimal para instalarla, activarla, conectar su runtime y exponer correctamente todos sus contratos y capacidades. Cuy, Sacha Cuy y otras versiones se consultarán solo para resolver brechas concretas de integración.

Las extensiones de análisis de datos provistas por RHS-IA y Positron también se integrarán sin alteración. No se deben recortar, reescribir ni modificar sus contratos o comportamiento; el trabajo de Napo será proporcionarles el host, runtime, configuración y dependencias que necesiten.

Napo no tendrá telemetría: no recopilará, enviará ni activará analítica de uso, diagnósticos o eventos de manera oculta. Tampoco dependerá de servicios externos obligatorios. Las conexiones a proveedores que Capibara pueda ver serán visibles, configuradas por la persona usuaria y controladas por ella.

## Regla de seguridad del agente

RHS-Agent no debe escribir, ejecutar, publicar, instalar o eliminar de forma invisible. Las acciones sensibles deben mostrar intención, pedir aprobación cuando corresponda y dejar registro de la fuente, acción, resultado y cambios.

