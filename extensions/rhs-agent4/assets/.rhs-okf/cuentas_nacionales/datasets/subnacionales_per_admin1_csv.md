---
type: Dataset
title: PER_admin1
description: "Dataset csv: PER_admin1 — 450 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_per_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.458Z
file_format: csv
size_bytes: 50334
file_sha256: b5856cbdbdb5a86f6f6f929d053a046d6c878369ba78143aee885fdf1dc6ed67
encoding: auto
sheet_count: 1
row_count: 450
column_count: 6
resource: data/subnacionales/PER_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.458Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: PER_admin1.csv
      n_rows: 450
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: PER
          max: PER
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 25
          min: Amazonas
          max: Áncash
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 18
          min: 1995
          max: 2029
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 449
          min: 77878
          max: 12069205
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
          min: "INEI Perú, Boletín Especial 25: población por departamento 1995-2030"
          max: "INEI Perú, Boletín Especial 25: población por departamento 1995-2030"
sources:
  - id: original
    resource: data/subnacionales/PER_admin1.csv
    title: PER_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/PER_admin1.csv
    algorithm: sha256
    value: b5856cbdbdb5a86f6f6f929d053a046d6c878369ba78143aee885fdf1dc6ed67
    size: 50334
    modified_at: 2026-09-13T20:06:29.553Z
---

# PER_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/PER_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.05 MB
- **Hojas**: 1
### Hoja: PER_admin1.csv — 450 filas × 6 columnas
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
