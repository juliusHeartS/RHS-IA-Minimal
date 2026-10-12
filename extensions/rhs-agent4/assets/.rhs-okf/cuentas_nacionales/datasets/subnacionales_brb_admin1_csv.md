---
type: Dataset
title: BRB_admin1
description: "Dataset csv: BRB_admin1 — 11 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_brb_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:24.970Z
file_format: csv
size_bytes: 1275
file_sha256: c9fe2f5af141de27f3005511ee541b7d7b311fe22b84937ceb75b5446ea93716
encoding: auto
sheet_count: 1
row_count: 11
column_count: 6
resource: data/subnacionales/BRB_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:24.970Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: BRB_admin1.csv
      n_rows: 11
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: BRB
          max: BRB
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 11
          min: Christ Church
          max: Saint Thomas
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 1
          min: 2010
          max: 2010
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 11
          min: 5139
          max: 88529
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
          min: Barbados Statistical Service, Census 2010 (población por parroquia)
          max: Barbados Statistical Service, Census 2010 (población por parroquia)
sources:
  - id: original
    resource: data/subnacionales/BRB_admin1.csv
    title: BRB_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/BRB_admin1.csv
    algorithm: sha256
    value: c9fe2f5af141de27f3005511ee541b7d7b311fe22b84937ceb75b5446ea93716
    size: 1275
    modified_at: 2026-09-13T20:06:29.548Z
---

# BRB_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/BRB_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: BRB_admin1.csv — 11 filas × 6 columnas
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
