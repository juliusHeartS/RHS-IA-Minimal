---
type: Dataset
title: miembrosOPS_population
description: "Dataset csv: miembrosOPS_population — 3440 filas, 4 columnas"
tags:
  - dataset
  - csv
document_id: miembrosops_population_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:22.839Z
file_format: csv
size_bytes: 104323
file_sha256: 51a9310378aa368ff381cf952386ff9d554207ab8ff568bf957905e4769c281c
encoding: auto
sheet_count: 1
row_count: 3440
column_count: 4
resource: data/miembros_ops/miembrosOPS_population.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:22.840Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: miembrosOPS_population.csv
      n_rows: 3440
      n_columns: 4
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 40
          min: AIA
          max: VGB
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 86
          min: 2015
          max: 2100
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 3438
          min: 2.783
          max: 421278.889
        - name: pais
          type: VARCHAR
          null_count: 0
          distinct_count: 40
          min: Anguila
          max: Venezuela (República Bolivariana de)
sources:
  - id: original
    resource: data/miembros_ops/miembrosOPS_population.csv
    title: miembrosOPS_population.csv
source_fingerprints:
  - resource: data/miembros_ops/miembrosOPS_population.csv
    algorithm: sha256
    value: 51a9310378aa368ff381cf952386ff9d554207ab8ff568bf957905e4769c281c
    size: 104323
    modified_at: 2026-09-13T19:58:48.937Z
---

# miembrosOPS_population
## Descripción
Ficha de metadatos del archivo de datos `data/miembros_ops/miembrosOPS_population.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.10 MB
- **Hojas**: 1
### Hoja: miembrosOPS_population.csv — 3440 filas × 4 columnas
- `iso3` (VARCHAR), nulls: 0
- `anio` (BIGINT), nulls: 0
- `poblacion` (DOUBLE), nulls: 0
- `pais` (VARCHAR), nulls: 0
## Trazabilidad
Perfil generado por rhs-okf/profiler-duckdb.[^original]
## Evidence
- Archivo de datos original preservado y perfilado sin sustituir el dato.[^original]
[^original]: Archivo original preservado en sources/data/
_Perfil de dataset integrado en CoreOKF._
