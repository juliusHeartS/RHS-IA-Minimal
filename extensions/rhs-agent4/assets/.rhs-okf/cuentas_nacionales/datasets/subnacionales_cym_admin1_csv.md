---
type: Dataset
title: CYM_admin1
description: "Dataset csv: CYM_admin1 — 12 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_cym_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.435Z
file_format: csv
size_bytes: 1598
file_sha256: fc42c5ebf8e6f0e2373f9ca015f119f4a073c2c3a6794c6f0c5fee426c1bcf9e
encoding: auto
sheet_count: 1
row_count: 12
column_count: 6
resource: data/subnacionales/CYM_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.435Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: CYM_admin1.csv
      n_rows: 12
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: CYM
          max: CYM
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 6
          min: Bodden Town
          max: West Bay
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 2
          min: 2010
          max: 2021
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 12
          min: 1407
          max: 34921
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
          min: Cayman Islands ESO, Census 2021 Report Fig. 1.1D (población por distrito, 2010 y 2021)
          max: Cayman Islands ESO, Census 2021 Report Fig. 1.1D (población por distrito, 2010 y 2021)
sources:
  - id: original
    resource: data/subnacionales/CYM_admin1.csv
    title: CYM_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/CYM_admin1.csv
    algorithm: sha256
    value: fc42c5ebf8e6f0e2373f9ca015f119f4a073c2c3a6794c6f0c5fee426c1bcf9e
    size: 1598
    modified_at: 2026-09-13T20:06:29.550Z
---

# CYM_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/CYM_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: CYM_admin1.csv — 12 filas × 6 columnas
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
