---
type: Dataset
title: ECU_admin1
description: "Dataset csv: ECU_admin1 — 1104 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_ecu_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.763Z
file_format: csv
size_bytes: 138421
file_sha256: 2f1d4e09e84afef29d86a58655a68f737642b7602d500856a11a6f5a9d9e1510
encoding: auto
sheet_count: 1
row_count: 1104
column_count: 6
resource: data/subnacionales/ECU_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.763Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: ECU_admin1.csv
      n_rows: 1104
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: ECU
          max: ECU
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 24
          min: Azuay
          max: Zamora Chinchipe
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 46
          min: 1990
          max: 2035
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 1103
          min: 10104
          max: 5223660
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
          min: INEC Ecuador, proyecciones provinciales edad simple 1990-2035 rev2024 (censo 2022)
          max: INEC Ecuador, proyecciones provinciales edad simple 1990-2035 rev2024 (censo 2022)
sources:
  - id: original
    resource: data/subnacionales/ECU_admin1.csv
    title: ECU_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/ECU_admin1.csv
    algorithm: sha256
    value: 2f1d4e09e84afef29d86a58655a68f737642b7602d500856a11a6f5a9d9e1510
    size: 138421
    modified_at: 2026-09-13T20:06:29.550Z
---

# ECU_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/ECU_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.13 MB
- **Hojas**: 1
### Hoja: ECU_admin1.csv — 1104 filas × 6 columnas
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
