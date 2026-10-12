---
type: Dataset
title: SLV_admin1
description: "Dataset csv: SLV_admin1 — 434 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_slv_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.624Z
file_format: csv
size_bytes: 42015
file_sha256: d73ab661c6b59bb30cb4d82259090e3ef159ed52704d3fbaf48da1eeab6640b4
encoding: auto
sheet_count: 1
row_count: 434
column_count: 6
resource: data/subnacionales/SLV_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.624Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: SLV_admin1.csv
      n_rows: 434
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: SLV
          max: SLV
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 14
          min: Ahuachapán
          max: Usulután
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 31
          min: 2005
          max: 2035
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 434
          min: 153437
          max: 1734770
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
          min: ONEC El Salvador, estimaciones y proyecciones rev2021
          max: ONEC El Salvador, estimaciones y proyecciones rev2021
sources:
  - id: original
    resource: data/subnacionales/SLV_admin1.csv
    title: SLV_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/SLV_admin1.csv
    algorithm: sha256
    value: d73ab661c6b59bb30cb4d82259090e3ef159ed52704d3fbaf48da1eeab6640b4
    size: 42015
    modified_at: 2026-09-13T20:06:29.554Z
---

# SLV_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/SLV_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.04 MB
- **Hojas**: 1
### Hoja: SLV_admin1.csv — 434 filas × 6 columnas
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
