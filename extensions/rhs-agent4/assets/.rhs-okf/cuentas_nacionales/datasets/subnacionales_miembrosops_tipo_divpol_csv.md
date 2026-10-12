---
type: Dataset
title: MiembrosOPS_tipo_DivPol
description: "Dataset csv: MiembrosOPS_tipo_DivPol — 39 filas, 3 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_miembrosops_tipo_divpol_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.290Z
file_format: csv
size_bytes: 1147
file_sha256: 9bd7339c16f5cddc60250b5276db2d80d8c4241d5da18d9555fe023e2e69b6e5
encoding: auto
sheet_count: 1
row_count: 39
column_count: 3
resource: data/miembros_ops/MiembrosOPS_tipo_DivPol.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.290Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: MiembrosOPS_tipo_DivPol.csv
      n_rows: 39
      n_columns: 3
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 39
          min: AIA
          max: VGB
        - name: pais
          type: VARCHAR
          null_count: 0
          distinct_count: 39
          min: Anguila
          max: Venezuela
        - name: tipo_division
          type: VARCHAR
          null_count: 0
          distinct_count: 10
          min: Departamentos
          max: Regiones/municipios
sources:
  - id: original
    resource: data/miembros_ops/MiembrosOPS_tipo_DivPol.csv
    title: MiembrosOPS_tipo_DivPol.csv
source_fingerprints:
  - resource: data/miembros_ops/MiembrosOPS_tipo_DivPol.csv
    algorithm: sha256
    value: 9bd7339c16f5cddc60250b5276db2d80d8c4241d5da18d9555fe023e2e69b6e5
    size: 1147
    modified_at: 2026-09-13T20:10:02.643Z
---

# MiembrosOPS_tipo_DivPol
## Descripción
Ficha de metadatos del archivo de datos `data/miembros_ops/MiembrosOPS_tipo_DivPol.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: MiembrosOPS_tipo_DivPol.csv — 39 filas × 3 columnas
- `iso3` (VARCHAR), nulls: 0
- `pais` (VARCHAR), nulls: 0
- `tipo_division` (VARCHAR), nulls: 0
## Trazabilidad
Perfil generado por rhs-okf/profiler-duckdb.[^original]
## Evidence
- Archivo de datos original preservado y perfilado sin sustituir el dato.[^original]
[^original]: Archivo original preservado en sources/data/
_Perfil de dataset integrado en CoreOKF._
