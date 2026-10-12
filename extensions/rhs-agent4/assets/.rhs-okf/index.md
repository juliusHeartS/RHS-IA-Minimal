---
type: KnowledgeBundle
title: RHS-OKF - Base de Conocimiento Estructurado sobre Recursos Humanos para la Salud en las Américas
description: Bundle de conocimiento curado en formato OKF extraído de documentos estratégicos de OPS, OMS y CIE sobre enfermería, sistemas de información de RRHH, migración del personal de salud, Plan Estratégico 2026-2031, fuerza de trabajo, perfiles de país y cobertura universal. Diseñado para ser utilizado por RHS-AI.
okf_version: "0.1"
tags:
    [
        rhs,
        rrhh,
        enfermeria,
        ops,
        paho,
        salud-americas,
        plan-estrategico-2026-2031,
        sistemas-informacion,
        perfiles-pais,
        cus,
    ]
timestamp: 2026-07-15T00:00:00-05:00
---

# RHS-OKF: Base de Conocimiento para Recursos Humanos para la Salud en las Américas

Este es un **Knowledge Bundle** en formato **Open Knowledge Format (OKF)** con conocimiento curado, estructurado y enlazado sobre la fuerza laboral en salud en la Región de las Américas.

## Propósito

- Crear una capa de **conocimiento de alta calidad** (no solo texto extraído) para potenciar a RHS-AI.
- Facilitar el razonamiento del agente sobre políticas, indicadores, recomendaciones y relaciones entre documentos.
- Mantener trazabilidad clara hacia los documentos fuente de OPS/OMS/CIE.
- Ser fácil de mantener, versionar y extender de forma incremental.

## Estado actual

- 32 entradas `DocumentoFuente` (una por documento del corpus de política/informes).
- 39 perfiles de país (`PerfilPais`) + 1 síntesis comparativa regional.
- 4 conceptos `BaseDatos` describiendo los datasets de Cuentas Nacionales (NHWA) con sus archivos CSV/XLSX empaquetados.
- Conceptos derivados (`Hallazgo`, `IndicadorRRHH`, `RecomendacionPolitica`, `ObjetivoEstrategico`, `ConceptoClave`, `BaseDatos`) organizados por tema.
- Archivos de datos estructurados (CSV/XLSX) en `data/` — **no vectorizados**; el agente los lee con herramientas de código (R/Python) cuando necesita análisis cuantitativos.

## Estructura del bundle

| Carpeta                                                             | Contenido                                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| [fuentes/](/fuentes/index.md)                                       | Una entrada `DocumentoFuente` por cada documento original      |
| [perfiles_pais/](/perfiles_pais/index.md)                           | 39 perfiles de país de RHS + síntesis comparativa regional     |
| [plan_estrategico/](/plan_estrategico/index.md)                     | Visión, pilares y prioridades del PE 2026-2031                 |
| [enfermeria/](/enfermeria/index.md)                                 | Situación, inversión y recomendaciones sobre enfermería        |
| [sistemas_informacion_rrhh/](/sistemas_informacion_rrhh/index.md)   | SIRHS: conceptos, mapeo de ocupaciones, madurez y gobernanza   |
| [migracion_rrhh/](/migracion_rrhh/index.md)                         | Migración, acuerdos bilaterales y refugiados/migrantes         |
| [indicadores/](/indicadores/index.md)                               | Indicadores clave de densidad, distribución y brechas          |
| [politicas/](/politicas/index.md)                                   | Políticas marco (Política 2030)                                |
| [conceptos_clave/](/conceptos_clave/index.md)                       | Definiciones y marcos conceptuales                             |
| [recomendaciones/](/recomendaciones/index.md)                       | Recomendaciones de política accionables                        |
| [fuerza_trabajo/](/fuerza_trabajo/index.md)                         | Fuerza de trabajo y enfoque de mercado laboral                 |
| [equipos_interprofesionales/](/equipos_interprofesionales/index.md) | Equipos interprofesionales y atención integrada                |
| [gobernanza_organizacion/](/gobernanza_organizacion/index.md)       | Gobernanza y estructura organizacional de la OPS               |
| [cuidado_infancia/](/cuidado_infancia/index.md)                     | Cuidado cariñoso y sensible en la primera infancia             |
| [vigilancia_salud/](/vigilancia_salud/index.md)                     | Vigilancia en salud y laboratorio                              |
| [cobertura_universal/](/cobertura_universal/index.md)               | Cobertura universal de salud y protección financiera           |
| [seguridad_sangre/](/seguridad_sangre/index.md)                     | Seguridad de la sangre y bancos de sangre                      |
| [ent_comercio/](/ent_comercio/index.md)                             | Determinantes comerciales de las ENT                           |
| [cuentas_nacionales/](/cuentas_nacionales/index.md)                 | Datasets NHWA: ecosistema, catálogo HSS, Module 1, subnacional |

## Tipos de concepto

- `DocumentoFuente` — Metadatos y resumen de un documento original
- `PerfilPais` — Perfil de RHS de un país
- `ObjetivoEstrategico` — Metas u objetivos del Plan Estratégico
- `IndicadorRRHH` — Métricas e indicadores de recursos humanos
- `RecomendacionPolitica` — Recomendaciones accionables
- `Hallazgo` — Evidencias o hallazgos importantes de los reportes
- `ConceptoClave` — Definiciones o marcos teóricos relevantes
- `BaseDatos` — Descripción de datasets estructurados (columnas, cobertura, ubicación del archivo)

## Cómo se usa este bundle en RHS-AI

- Los `.md` pueden indexarse con embeddings locales para mejorar el RAG.
- El agente puede razonar explícitamente usando los enlaces entre conceptos.
- Cada concepto mantiene referencia clara al documento y páginas de origen.
- Ideal para análisis de brechas, simulaciones de políticas y generación de recomendaciones fundamentadas.

## Documentación del bundle

- [OKF_logic.md](/OKF_logic.md) - metodología genérica de construcción (6 fases)
- [indicaciones.md](/indicaciones.md) - guía técnica de integración en RHS-AI (RAG híbrido + grafo)
- [okf.md](/okf.md) - playbook replicable para construir un `project-okf` desde un corpus de documentos

---

_Bundle actualizado para el proyecto RHS-AI_
