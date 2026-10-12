---
type: Dataset
title: URY_admin1
description: "Dataset csv: URY_admin1 — 418 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_ury_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.713Z
file_format: csv
size_bytes: 46731
file_sha256: 356672bd9c11856149a98f5daa55218681b1eb0f13f4231f92349cb32e6f684c
encoding: auto
sheet_count: 1
row_count: 418
column_count: 6
resource: data/subnacionales/URY_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.713Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: URY_admin1.csv
      n_rows: 418
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: URY
          max: URY
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 19
          min: Artigas
          max: Treinta y Tres
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 22
          min: 2024
          max: 2045
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 418
          min: 24815.67
          max: 1288787.87
        - name: tipo
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: proyeccion
          max: proyeccion
        - name: fuente
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: INE Uruguay, proyecciones departamentales Revisión 2025 (censo 2023)
          max: INE Uruguay, proyecciones departamentales Revisión 2025 (censo 2023)
sources:
  - id: original
    resource: data/subnacionales/URY_admin1.csv
    title: URY_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/URY_admin1.csv
    algorithm: sha256
    value: 356672bd9c11856149a98f5daa55218681b1eb0f13f4231f92349cb32e6f684c
    size: 46731
    modified_at: 2026-09-13T20:06:29.555Z
---

# URY_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/URY_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.04 MB
- **Hojas**: 1
### Hoja: URY_admin1.csv — 418 filas × 6 columnas
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
