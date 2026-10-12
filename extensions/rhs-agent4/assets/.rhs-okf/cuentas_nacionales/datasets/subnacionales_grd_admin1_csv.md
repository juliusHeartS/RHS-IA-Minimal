---
type: Dataset
title: GRD_admin1
description: "Dataset csv: GRD_admin1 — 1 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_grd_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.789Z
file_format: csv
size_bytes: 227
file_sha256: 641af3ea9a03cabd490cf0b76e0a23dc1e05384f20edad93a40f5117c4ea76fe
encoding: auto
sheet_count: 1
row_count: 1
column_count: 6
resource: data/subnacionales/GRD_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.789Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: GRD_admin1.csv
      n_rows: 1
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: GRD
          max: GRD
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: Grenada (total censo 2021; desglose por parroquia pendiente)
          max: Grenada (total censo 2021; desglose por parroquia pendiente)
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 1
          min: 2021
          max: 2021
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 1
          min: 124062
          max: 124062
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
          min: Grenada CSO, Census 2021 preliminary (total nacional; sin desglose parroquial publicado aún)
          max: Grenada CSO, Census 2021 preliminary (total nacional; sin desglose parroquial publicado aún)
sources:
  - id: original
    resource: data/subnacionales/GRD_admin1.csv
    title: GRD_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/GRD_admin1.csv
    algorithm: sha256
    value: 641af3ea9a03cabd490cf0b76e0a23dc1e05384f20edad93a40f5117c4ea76fe
    size: 227
    modified_at: 2026-09-13T20:06:29.551Z
---

# GRD_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/GRD_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: GRD_admin1.csv — 1 filas × 6 columnas
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
