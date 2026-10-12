---
type: ConceptoClave
title: Ecosistema de datos NHWA — Cuentas Nacionales del Personal de Salud
description: Panorama general del marco de Cuentas Nacionales del Personal de Salud (NHWA) y los datasets disponibles para análisis de la fuerza laboral en salud en las Américas.
tags: [cuentas-nacionales, nhwa, datos, ops, stock, fuerza-trabajo]
source_documents:
    - fuentes/cuentas_nacionales_personal_salud.md
    - fuentes/politica_personal_salud_2030.md
timestamp: 2026-07-15T00:00:00-05:00
---

# Ecosistema de datos NHWA

## Qué es NHWA

Las **Cuentas Nacionales del Personal de Salud** (en inglés, _National Health Workforce Accounts_, NHWA) son el marco estándar de la OMS/OPS para medir, monitorear y planificar la fuerza laboral en salud. El manual de referencia es la 2.ª edición de _Cuentas Nacionales del Personal de Salud: un manual_ (ver [DocumentoFuente](/fuentes/cuentas_nacionales_personal_salud.md)).

El marco NHWA organiza la información en **módulos** temáticos. Cada módulo agrupa indicadores que se reportan por país, año y desagregaciones (sexo, edad, nivel de actividad, lugar de formación, etc.).

## Datasets disponibles en RHS-Agent

Todos los archivos de datos están empaquetados como assets ocultos en `data/` dentro del bundle OKF y se provisionan al workspace al arrancar. El Core integra **43 datasets**: los tres datasets NHWA/HSS consolidados y 40 archivos complementarios de población y desagregación territorial.

| Grupo             | Ruta virtual                                  | Contenido                                              |
| ----------------- | --------------------------------------------- | ------------------------------------------------------ |
| Catálogo HSS      | `data/catalogo_hss.xlsx`                      | Metadatos de sistemas de información del HSS/OPS       |
| NHWA Module 1     | `data/nhwa_module1.csv`                       | Stock de personal de salud por país                    |
| NHWA Subnacional  | `data/nhwa_subnational.csv`                   | Stock desagregado a nivel provincial                   |
| Población         | `data/miembros_ops/miembrosOPS_population.csv` | Población anual de 40 países y territorios             |
| División política | `data/miembros_ops/MiembrosOPS_tipo_DivPol.csv` | Tipo de división administrativa por país              |
| Admin1            | `data/subnacionales/*_admin1.csv`             | Población subnacional por país y unidad administrativa |

El catálogo detallado de los 40 datasets complementarios está en [`datasets/index.md`](datasets/index.md), con un perfil por archivo y su trazabilidad al archivo físico en `sources/data/`.

**Estos archivos NO se vectorizan en RHS-RAG.** Son datos estructurados (CSV/XLSX) que el agente analiza con sus herramientas de código (R, Python) cuando necesita calcular, filtrar o extraer valores concretos.

## Cómo usa el agente estos datos

1. El agente comienza por el [mapa semántico del ecosistema NHWA](mapa_semantico_nhwa.md) y este índice para delimitar el dominio.
2. Sigue el enlace al concepto del dataset específico ([Module 1](/cuentas_nacionales/dataset_module1.md), [Subnacional](/cuentas_nacionales/dataset_subnacional.md) o el perfil correspondiente en [`datasets/`](datasets/index.md)) para entender columnas, indicadores, códigos y nivel territorial.
3. Cuando necesita un valor concreto o un análisis, escribe y ejecuta código (R o Python) que lee el CSV desde `data/`, comprueba las claves indicadas en el mapa semántico, filtra por país/indicador/año y calcula.

## Indicadores del Module 1

Los indicadores del Module 1 siguen la nomenclatura NHWA (1.01 a 1.12):

| Código | Indicador                                              |
| ------ | ------------------------------------------------------ |
| 1.01   | Stock por nivel de actividad                           |
| 1.03   | Stock por grupo de edad                                |
| 1.04   | Stock por sexo                                         |
| 1.05   | Stock por lugar de nacimiento                          |
| 1.06   | Stock por lugar de formación                           |
| 1.07   | Stock por formación en el extranjero (foreign-trained) |
| 1.08   | Stock por tipo de establecimiento                      |
| 1.09   | Stock por titularidad del establecimiento              |
| 1.10   | Entradas al mercado laboral (inflow)                   |
| 1.11   | Salidas del mercado laboral (outflow)                  |
| 1.12   | Composición y distribución (source type)               |

## Profesiones cubiertas

- Community Health Workers (agentes comunitarios)
- Medical Doctors (médicos: total, generalistas, especialistas, no definidos)
- Nursing Personnel (enfermería: total, profesionales, asociados, no definidos)
- Midwifery Personnel (obstetricia: profesionales, asociados, no definidos)
- Dentists (odontólogos)
- Pharmacists (farmacéuticos)
- Physiotherapists (fisioterapeutas)
- Psychologists (psicólogos)
- Epidemiologists / Field Epidemiologists

## Relación con otros conceptos del OKF

- [Manual de Cuentas Nacionales (DocumentoFuente)](/fuentes/cuentas_nacionales_personal_salud.md) — el marco metodológico
- [Concepto clave de Cuentas Nacionales](/conceptos_clave/cuentas_nacionales_personal_salud.md) — definición conceptual
- [Indicadores clave de RHS](/indicadores/indicadores_clave.md) — indicadores recomendados para diagnóstico
- [Sistemas de información de RRHH (SIRHS)](/sistemas_informacion_rrhh/index.md) — contexto de los sistemas de información
- [Catálogo de bases de datos HSS](/cuentas_nacionales/catalogo_hss.md) — inventario institucional de sistemas de datos

## Trazabilidad

- Archivos de datos: 43 assets bajo `data/` (físicamente preservados bajo `sources/data/`); ver el catálogo de [`datasets/`](datasets/index.md).
- Marco metodológico: [Manual NHWA 2.ª edición](/fuentes/cuentas_nacionales_personal_salud.md) → `PAHO_POLICY/Cuentas-nacionales-personal-salud-manual-segunda-edicion.md`
- El NHWA está catalogado como sistema **PAHO-HSS-009** en el catálogo HSS (ver [catálogo](/cuentas_nacionales/catalogo_hss.md)).
