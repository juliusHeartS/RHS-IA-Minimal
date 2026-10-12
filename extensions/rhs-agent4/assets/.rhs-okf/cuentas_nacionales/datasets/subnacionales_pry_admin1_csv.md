---
type: Dataset
title: PRY_admin1
description: "Dataset csv: PRY_admin1 — 648 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_pry_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.558Z
file_format: csv
size_bytes: 81318
file_sha256: 5939526074d7b8cb3efd5c3579ecb15b51b6e77a62f436e11019eb0a7511ec6b
encoding: auto
sheet_count: 1
row_count: 648
column_count: 6
resource: data/subnacionales/PRY_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.558Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: PRY_admin1.csv
      n_rows: 648
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: PRY
          max: PRY
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 18
          min: Alto Paraguay
          max: Ñeembucú
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 36
          min: 2000
          max: 2035
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 646
          min: 12351
          max: 2198188
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
          min: INE Paraguay, Estimaciones y Proyecciones Departamentales 2000-2035 Revisión 2025
          max: INE Paraguay, Estimaciones y Proyecciones Departamentales 2000-2035 Revisión 2025
sources:
  - id: original
    resource: data/subnacionales/PRY_admin1.csv
    title: PRY_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/PRY_admin1.csv
    algorithm: sha256
    value: 5939526074d7b8cb3efd5c3579ecb15b51b6e77a62f436e11019eb0a7511ec6b
    size: 81318
    modified_at: 2026-09-13T20:06:29.554Z
---

# PRY_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/PRY_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.08 MB
- **Hojas**: 1
### Hoja: PRY_admin1.csv — 648 filas × 6 columnas
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
