---
type: Dataset
title: ATG_admin1
description: "Dataset csv: ATG_admin1 — 7 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_atg_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:24.614Z
file_format: csv
size_bytes: 1037
file_sha256: 63331130afb619812c225eca31c2f34c3f785a0821435c1abddda4e406b80cdd
encoding: auto
sheet_count: 1
row_count: 7
column_count: 6
resource: data/subnacionales/ATG_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:24.614Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: ATG_admin1.csv
      n_rows: 7
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: ATG
          max: ATG
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 7
          min: Barbuda
          max: Saint Philip
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 1
          min: 2011
          max: 2011
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 7
          min: 1634
          max: 51737
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
          min: Statistics Division Antigua y Barbuda, Census 2011 (población por parroquia; censo 2025 en proceso)
          max: Statistics Division Antigua y Barbuda, Census 2011 (población por parroquia; censo 2025 en proceso)
sources:
  - id: original
    resource: data/subnacionales/ATG_admin1.csv
    title: ATG_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/ATG_admin1.csv
    algorithm: sha256
    value: 63331130afb619812c225eca31c2f34c3f785a0821435c1abddda4e406b80cdd
    size: 1037
    modified_at: 2026-09-13T20:06:29.547Z
---

# ATG_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/ATG_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: ATG_admin1.csv — 7 filas × 6 columnas
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
