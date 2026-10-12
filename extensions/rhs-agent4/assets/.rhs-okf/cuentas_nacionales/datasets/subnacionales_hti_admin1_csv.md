---
type: Dataset
title: HTI_admin1
description: "Dataset csv: HTI_admin1 — 10 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_hti_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.951Z
file_format: csv
size_bytes: 1183
file_sha256: da124269df641a4812c22119ff623b66022b59b927c25f25023054c41b799401
encoding: auto
sheet_count: 1
row_count: 10
column_count: 6
resource: data/subnacionales/HTI_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.951Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: HTI_admin1.csv
      n_rows: 10
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: HTI
          max: HTI
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 10
          min: Artibonite
          max: Sud-Est
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 1
          min: 2024
          max: 2024
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 10
          min: 403045
          max: 4038816
        - name: tipo
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: estimacion
          max: estimacion
        - name: fuente
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: IHSI Haïti, Estimations désagrégées de la population 2024 (Tableau 3)
          max: IHSI Haïti, Estimations désagrégées de la population 2024 (Tableau 3)
sources:
  - id: original
    resource: data/subnacionales/HTI_admin1.csv
    title: HTI_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/HTI_admin1.csv
    algorithm: sha256
    value: da124269df641a4812c22119ff623b66022b59b927c25f25023054c41b799401
    size: 1183
    modified_at: 2026-09-13T20:06:29.551Z
---

# HTI_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/HTI_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: HTI_admin1.csv — 10 filas × 6 columnas
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
