---
name: analytical-programming-r-python
modeSlugs: [ask]
policy: implicit
description: "Professional analytical programming with R or Python. Use when the user asks to write, repair, review, execute, or organize R/Python code, analytical pipelines, simulations, statistical calculations, data transformations, visualizations, packages, or scripts. Honor the requested language and the existing project architecture."
license: MIT
compatibility: Requires an R or Python runtime for execution; code inspection and editing remain available without a live session.
dependencies:
  tools: [read_file, search_files, codebase_search, list_files, edit_file, apply_patch, execute_code, execute_command]
metadata:
  author: RHS-Agent
  version: "1.0"
  short-description: Programa y valida análisis profesionales con R o Python.
  triggers: [programar en R, programar en Python, script R, script Python, depurar código, simulación, análisis de datos, pandas, polars, tidyverse, prueba unitaria]
---

# Programación analítica profesional con R y Python

El destinatario es un planificador, no necesariamente un programador. Resuelve
la complejidad técnica internamente y presenta resultados, supuestos, errores y
decisiones en lenguaje profesional comprensible. No rebajes la calidad del
código porque el usuario no vaya a verlo.

## Antes de programar

1. Inspecciona la estructura, manifiestos, entornos, dependencias, pruebas y
   archivos cercanos al cambio.
2. Busca una implementación equivalente con `codebase_search`; confirma
   símbolos exactos con `search_files` o `rg` y lee completa la ruta relevante
   antes de adaptar el patrón. Cuando debas contrastar varios símbolos ya
   localizados, usa `read_file.files` con rangos acotados en una sola llamada.
3. Identifica entradas, salidas, unidades, valores faltantes, tipos, tamaño de
   datos, restricciones del usuario y criterio de aceptación.
4. Respeta el lenguaje solicitado. Si no se especifica, usa la sesión analítica
   activa; sin sesión activa, usa R por defecto.

## Implementación

- Prefiere APIs y paquetes ya presentes en el proyecto. No dupliques helpers.
- Separa carga, validación, transformación, cálculo y presentación cuando esa
  división haga el código más verificable.
- Conserva nombres informativos, funciones breves, errores accionables y
  semillas cuando exista aleatoriedad.
- Evita estado global oculto, rutas absolutas, credenciales, efectos laterales
  inesperados y conversiones silenciosas de tipos o unidades.
- Para una edición exacta en un archivo usa `edit_file`; para cambios
  coordinados usa `apply_patch`. Lee antes de editar.
- Las herramientas de escritura devuelven problemas nuevos del editor o del
  servidor de lenguaje. Corrige los errores introducidos antes de avanzar y no
  confundas advertencias preexistentes con regresiones propias.
- No dejes código incompleto, comentarios que prometen funcionalidad, datos de
  ejemplo sustituyendo datos reales ni resultados inventados.

## R

- Respeta el entorno del proyecto (`renv`, DESCRIPTION, scripts y convenciones
  existentes) y el estado de la sesión activa de Positron.
- Usa operaciones vectorizadas y paquetes existentes; evita instalar paquetes
  sin necesidad y sin autorización cuando afecte el entorno.
- Comprueba clases, niveles de factores, zonas horarias, `NA`, unidades y claves
  antes de unir o resumir datos.
- En funciones o paquetes, usa pruebas `testthat` y documentación acorde al
  estilo existente cuando el alcance lo requiera.

## Python

- Respeta el entorno del proyecto (`pyproject.toml`, requirements, lockfiles,
  entorno virtual y convenciones existentes) y la sesión activa de Positron.
- Comprueba dtypes, índices, valores nulos, zonas horarias, unidades y claves
  antes de unir o resumir datos.
- Prefiere operaciones vectorizadas y las bibliotecas ya instaladas. Evita
  instalar o cambiar versiones sin necesidad comprobada.
- Usa pruebas existentes (`pytest`, `unittest` u otra convención local), type
  hints y validación estática cuando el proyecto ya los emplee.

## Validación y entrega

1. Ejecuta primero la reproducción o prueba más pequeña que pueda fallar.
2. Verifica resultados con invariantes del dominio: conteos, rangos, totales,
   unidades, duplicados, conservación de filas y casos límite.
3. Amplía a las pruebas, lint, tipos, render o flujo integrado proporcional al
   alcance. No declares ejecutado lo que no ejecutaste.
4. Muestra al usuario tablas, gráficos y conclusiones útiles. Oculta trazas,
   código intermedio y salidas crudas salvo que los solicite.
