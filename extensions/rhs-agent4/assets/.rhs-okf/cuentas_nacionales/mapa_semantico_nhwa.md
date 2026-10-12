---
type: ConceptoClave
title: Mapa semántico del ecosistema NHWA
description: Navegación enlazada entre el marco NHWA, sus datasets nacionales y subnacionales, y los datos auxiliares de población y división territorial.
tags:
  - cuentas-nacionales
  - nhwa
  - datasets
  - relaciones
  - navegación
status: draft
generated:
  by: rhs-agent/core-curation
  at: 2026-09-14T00:00:00Z
sources:
  - id: nhwa_module1
    resource: /data/nhwa_module1.csv
    title: NHWA Module 1
  - id: nhwa_subnational
    resource: /data/nhwa_subnational.csv
    title: NHWA subnacional
  - id: population
    resource: /data/miembros_ops/miembrosOPS_population.csv
    title: Población de miembros OPS
  - id: admin1
    resource: /data/subnacionales/ARG_admin1.csv
    title: Ejemplo de población admin1
---

# Mapa semántico del ecosistema NHWA

Este concepto es un punto de entrada de navegación para el conocimiento de
Cuentas Nacionales del Personal de Salud. Los enlaces expresan las relaciones
entre conceptos; los archivos de datos siguen siendo las fuentes para los
cálculos y no se sustituyen por este mapa.

## Jerarquía de conocimiento

1. El [ecosistema de datos NHWA](ecosistema_datos_nhwa.md) describe el marco,
   sus módulos y el uso analítico de los datos.
2. El [Dataset NHWA Module 1](dataset_module1.md) contiene el stock nacional
   por país, periodo, profesión e indicador.
3. El [Dataset NHWA Subnacional](dataset_subnacional.md) contiene el stock por
   unidad territorial y conserva el código del país padre.
4. El [catálogo de datasets complementarios](datasets/index.md) enlaza los
   perfiles de población nacional, división política y población `admin1`.

## Relaciones entre datasets

### Nivel nacional y subnacional

El Module 1 identifica el país con `orgunit` y el año con `period`. El dataset
subnacional identifica la unidad con `orgunit`, conserva el país padre en
`Country` y usa el mismo campo `period`. Para una comparación territorial, el
agente debe normalizar primero esos códigos y comprobar que el país y el año
sean compatibles; no debe asumir que una fila nacional es la suma de todas las
filas subnacionales.

- [Module 1 nacional](dataset_module1.md) → [stock subnacional](dataset_subnacional.md)
  mediante país, periodo e indicador.
- [Stock subnacional](dataset_subnacional.md) → [perfiles `admin1`](datasets/index.md)
  para complementar la lectura territorial con población y tipo de división.

### Población y división territorial

El perfil [miembrosOPS_population](datasets/miembrosops_population_csv.md)
identifica país y año mediante `iso3` y `anio`. Los perfiles `*_admin1` usan
`iso3`, `anio`, `admin1`, `tipo` y `fuente`. El perfil
[MiembrosOPS_tipo_DivPol](datasets/subnacionales_miembrosops_tipo_divpol_csv.md)
aporta la clasificación de la división política por `iso3`.

- Población nacional ↔ población `admin1`: `iso3` + `anio`.
- Población `admin1` ↔ tipo de división política: `iso3`.
- Datos NHWA nacionales ↔ población nacional: normalizar `orgunit` → `iso3` y
  `period` → `anio`, verificando cobertura y unidades antes de calcular tasas.

Estas relaciones son rutas de consulta documentadas, no claves foráneas
inventadas: la existencia de una combinación debe comprobarse en los archivos
de datos con R o Python.

## Ruta de recuperación para RAG

Para una pregunta sobre NHWA, el agente debe comenzar por este mapa y el
[índice de Cuentas Nacionales](index.md), seguir el enlace al concepto de
marco o dataset más específico y sólo entonces recuperar evidencia del
documento enlazado o ejecutar código sobre el archivo de datos. Esta ruta
reduce búsquedas indiscriminadas y mantiene el contexto de país, periodo,
profesión y nivel territorial.

## Trazabilidad

La descripción del marco y los perfiles enlazados conservan sus propias
fuentes, huellas y evidencia. Este mapa sólo organiza esa navegación y no
declara verificación humana ni reemplaza los conceptos fuente.
