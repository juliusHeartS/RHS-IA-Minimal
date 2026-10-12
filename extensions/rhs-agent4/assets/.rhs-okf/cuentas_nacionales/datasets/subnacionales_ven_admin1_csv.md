---
type: Dataset
title: VEN_admin1
description: "Dataset csv: VEN_admin1 — 253 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_ven_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.843Z
file_format: csv
size_bytes: 27627
file_sha256: 423b1ea73e13229fca0ab1ccd2f60da719e9f85f939252cf4f3b4f84bad37356
encoding: auto
sheet_count: 1
row_count: 253
column_count: 6
resource: data/subnacionales/VEN_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.843Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: VEN_admin1.csv
      n_rows: 253
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: VEN
          max: VEN
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 23
          min: Amazonas
          max: Zulia
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 11
          min: 2000
          max: 2050
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 253
          min: 116253
          max: 5577968
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
          min: INE Venezuela, proyecciones por estado base censo 2001 (quinquenal)
          max: INE Venezuela, proyecciones por estado base censo 2001 (quinquenal)
sources:
  - id: original
    resource: data/subnacionales/VEN_admin1.csv
    title: VEN_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/VEN_admin1.csv
    algorithm: sha256
    value: 423b1ea73e13229fca0ab1ccd2f60da719e9f85f939252cf4f3b4f84bad37356
    size: 27627
    modified_at: 2026-09-13T20:06:29.555Z
---

# VEN_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/VEN_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.03 MB
- **Hojas**: 1
### Hoja: VEN_admin1.csv — 253 filas × 6 columnas
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
