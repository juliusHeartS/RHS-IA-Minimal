# Contexto persistente — RHS-IA Minimal

## Resumen corto

RHS-IA Minimal será una distribución de escritorio de análisis de datos basada en el trabajo existente de RHS-IA y Positron. Debe ser más sencilla que Positron y tener RHS-Agent como agente principal.

El nombre clave oficial de RHS-IA Minimal es **Napo**. Napo es la plataforma; Capibara es la extensión-agente integrada.

Napo se define como una plataforma de análisis de datos, modelación y planificación asistida por IA. Usa R y Python para ejecutar modelos matemáticos, estadísticos y de IA, simulaciones dinámicas y análisis de escenarios. Capibara usa LLMs para interpretar objetivos, proponer modelos y código, coordinar herramientas y explicar resultados. El conocimiento legal y contextual debe estar versionado por jurisdicción, fecha y fuente, con revisión humana.

## Regla absoluta

`RHS-IA`, `positron`, `rhs-agent3`, `rhs-agent4` y `vscode` son repositorios fuente de solo lectura. Se pueden estudiar y copiar selectivamente, pero nunca alterar. El destino de futuras implementaciones es únicamente `RHS-IA-Minimal`, con autorización explícita.

También se incorporó `/Users/julius3005/Documents/Github/vscode` como fuente de referencia de VS Code/Code-OSS. Es igualmente de solo lectura y servirá para estudiar el host y el sistema de extensiones de Napo.

## Archivos de referencia

- `QUE_CONSERVAR.md`: definición de producto y criterios de conservación.
- `PLAN_TRABAJO_RHS_IA_MINIMAL.md`: fases, entregables y criterios de finalización.
- `AGENTE.md`: reglas operativas permanentes.
- `BITACORA.md`: hechos, decisiones y evidencia acumulada.
- `ARQUITECTURA_NAPO.md`: arquitectura base, contratos del host, incrementos y puertas de calidad.
- `MATRIZ_HOST_CAPIBARA.md`: primera matriz técnica del receptor para Capibara y las extensiones de datos.

## Estado actual

- REA 6.4.0 está disponible.
- RHS-IA empaquetado fue inventariado y analizado parcialmente.
- El núcleo Electron/Positron/VS Code debe conservarse inicialmente.
- La reducción debe comenzar por extensiones, vistas y servicios no relacionados con R, Python, notebooks, Quarto, datos o RHS-Agent.
- RHS-Agent3 está activo en RHS-IA; Capibara/RHS-Agent4 está asociado a Positron.
- Aún no se ha autorizado la implementación ni se han modificado archivos del producto.
- Capibara (`rhs-agent4`) se considera una extensión ya hecha que debe integrarse en Napo.
- Capibara va completa: no se recorta, fragmenta ni reescribe; se prepara el host para soportar todos sus contratos y capacidades.
- Las extensiones de análisis de datos provistas por RHS-IA/Positron también van completas y sin alteración; Napo se adapta a ellas.
- Los proveedores son los que Capibara puede ver; no constituyen una decisión abierta separada. Napo conserva su acceso y configuración segura.
- Quarto siempre incluido; todas las funciones de datos sin alteración; Capibara como función integrada; telemetría prohibida; actualizaciones manuales, verificables y reversibles; sin servicios externos obligatorios.
- El foco es el receptor: instalación, activación, ciclo de vida, runtime, vistas, comandos, configuración y empaquetado del host.
- La auditoría inicial encontró que Napo aún no tiene implementación. Hay cambios locales preexistentes en Positron, rhs-agent3 y rhs-agent4; no deben tocarse ni confundirse con cambios de Napo.
- Cuy/Sacha Cuy se usarán solo como referencias de contratos y pruebas de integración, no para inventar un agente paralelo.
- La IA generativa coordina y explica; R y Python ejecutan y verifican. Una propuesta del LLM no debe confundirse con evidencia ni con una decisión legal.

## Próximo paso

Crear la matriz de requisitos del host para instalar y activar Capibara en Napo.

