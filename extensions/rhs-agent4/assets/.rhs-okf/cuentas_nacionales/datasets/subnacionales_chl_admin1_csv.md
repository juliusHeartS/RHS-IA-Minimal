---
type: Dataset
title: CHL_admin1
description: "Dataset csv: CHL_admin1 — 544 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_chl_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.195Z
file_format: csv
size_bytes: 59728
file_sha256: cd2e85571a7dbb3e4430b43afd57ba0f693de37bf1030ef530cab12bb682bdc9
encoding: auto
sheet_count: 1
row_count: 544
column_count: 6
resource: data/subnacionales/CHL_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.195Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: CHL_admin1.csv
      n_rows: 544
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: CHL
          max: CHL
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 16
          min: Antofagasta
          max: Ñuble
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 34
          min: 2002
          max: 2035
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 544
          min: 93039
          max: 8844243
        - name: tipo
          type: VARCHAR
          null_count: 0
          distinct_count: 2
          min: estimacion
          max: proyeccion
        - name: fuente
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: INE Chile, estimaciones y proyecciones 2002-2035 región base 2017
          max: INE Chile, estimaciones y proyecciones 2002-2035 región base 2017
sources:
  - id: original
    resource: data/subnacionales/CHL_admin1.csv
    title: CHL_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/CHL_admin1.csv
    algorithm: sha256
    value: cd2e85571a7dbb3e4430b43afd57ba0f693de37bf1030ef530cab12bb682bdc9
    size: 59728
    modified_at: 2026-09-13T20:06:29.549Z
---

# CHL_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/CHL_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.06 MB
- **Hojas**: 1
### Hoja: CHL_admin1.csv — 544 filas × 6 columnas
- `iso3` (VARCHAR), nulls: 0
- `admin1` (VARCHAR), nulls: 0
- `anio` (BIGINT), nulls: 0
- `poblacion` (DOUBLE), nulls: 0
- `tipo` (VARCHAR), nulls: 0
- `fuente` (VARCHAR), nulls: 0
## Trazabilidad
Perfil generado por rhs-okf/profiler-duckdb.[^original]
## Evidence
- Archivo de datos original preservado y perfilado sin sustituir el dato.[^original]
[^original]: Archivo original preservado en sources/data/
_Perfil de dataset integrado en CoreOKF._
