---
type: ConceptoClave
title: Cuentas Nacionales del Personal de Salud (CNPS)
description: Marco metodológico estandarizado de la OMS para medir, analizar y proyectar la fuerza laboral en salud de forma sistemática y comparable.
tags: [cuentas-nacionales, metodologia, rrhh, datos, proyecciones]
source_documents:
    - fuentes/cuentas_nacionales_personal_salud.md
timestamp: 2026-06-30T00:55:00-05:00
---

# Cuentas Nacionales del Personal de Salud (CNPS)

## ¿Qué son las Cuentas Nacionales del Personal de Salud?

Es un marco conceptual y metodológico desarrollado por la OMS para que los países puedan **medir, clasificar, analizar y proyectar** su fuerza laboral en salud de manera sistemática, estandarizada y comparable internacionalmente.

## Propósito principal

Permitir a los países generar información más precisa, consistente y útil para la planificación estratégica del personal de salud, superando las limitaciones de los enfoques tradicionales de conteo de personal.

## Elementos clave que incluye

- Clasificación estandarizada de las ocupaciones de salud
- Medición del **stock** (cantidad actual de personal)
- Análisis del **flujo** (ingresos, egresos, migración, retiros)
- Características del personal (edad, sexo, especialidad, nivel de formación, ubicación)
- Capacidad de realizar **proyecciones** a futuro bajo diferentes escenarios

## Ventajas frente a otros enfoques

- Mayor rigor metodológico
- Mejor comparabilidad entre países y a lo largo del tiempo
- Posibilidad de hacer análisis más sofisticados (brechas, proyecciones, impacto de políticas)
- Alineación con estándares internacionales

## Relevancia para RHS-AI

Este marco es muy valioso porque:

- Proporciona una base metodológica sólida para los análisis y simulaciones que realiza RHS-AI.
- Permite generar indicadores más confiables y comparables.
- Facilita la creación de escenarios de proyección (por ejemplo: impacto del envejecimiento del personal, migración, o incremento de la formación).

RHS-AI puede utilizar los principios de las CNPS para mejorar la calidad de los análisis de brechas y las proyecciones de personal que ofrece a los países.

---

_Concepto curado para RHS-AI._

## Datasets disponibles

El bundle OKF incluye datasets estructurados de las Cuentas Nacionales (NHWA) empaquetados en `data/`. Para consultar la estructura y cobertura de cada archivo, ver:

- [Ecosistema de datos NHWA](/cuentas_nacionales/ecosistema_datos_nhwa.md) — panorama general
- [Dataset Module 1 (stock nacional)](/cuentas_nacionales/dataset_module1.md) — 40 países, 2017-2024
- [Dataset Subnacional](/cuentas_nacionales/dataset_subnacional.md) — 14 países, nivel provincial
- [Catálogo de bases de datos HSS](/cuentas_nacionales/catalogo_hss.md) — inventario institucional

Estos archivos **no se vectorizan**; el agente los lee con herramientas de código (R/Python) para análisis cuantitativos.
