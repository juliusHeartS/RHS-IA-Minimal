---
name: predictive-modeling-r
modeSlugs: [ask]
policy: implicit
description: Modeling and machine learning with tidymodels in R. Use when the user requests to model data, fit a predictive model, predict outcomes, compare models or tune a model. Preserve train/test discipline and work interactively with the planner.
license: MIT
compatibility: Requires R with tidymodels installed.
metadata:
  author: Cuy (adaptado de Posit vía Capibara)
  version: "1.1"
  short-description: Construye y evalúa modelos predictivos reproducibles con R.
  triggers: [modelo predictivo, predicción, tidymodels, entrenar modelo, evaluar modelo]
---

# Modelado predictivo con R

Trabajar con `tidymodels` mediante `execute_code` y `language: r` en la sesión
activa de Positron. Si el usuario pide Python, obedecerle y no activar esta
skill. No elegir lenguaje por comodidad interna.

## Reglas obligatorias

- Dividir entrenamiento y test antes de una exploración sustantiva.
- Explorar, crear variables, entrenar y seleccionar sólo con entrenamiento.
- Crear una sola vez folds y métricas, y reutilizarlos en todos los modelos.
- Empezar con un baseline nulo.
- Establecer explícitamente regresión o clasificación.
- Cambiar una decisión por iteración y ejecutar un modelo por turno.
- Pedir aprobación antes de usar el test; usarlo una sola vez al final.
- Mantener código, semillas, preprocesamiento, métricas y resultados
  reproducibles.

Si ya se exploró intensamente el dataset completo, advertir el riesgo de sesgo
y ofrecer comenzar una sesión nueva. Si el usuario continúa, registrar el
supuesto y volver a examinar únicamente entrenamiento.

## Ruta de trabajo

1. Cargar `modeling-workflow` antes de crear split, receta o workflow.
2. Acordar outcome, predictores, modo y métricas con el usuario.
3. Ejecutar baseline y mostrar el resultado.
4. Para cada turno posterior, proponer y probar una sola mejora motivada.
5. Cargar `iteration-strategies` cuando el desempeño se estanque o haya que
   decidir el siguiente experimento.
6. Cargar `evaluation-and-reporting` para comparar modelos, evaluar el test,
   comunicar resultados o guardar el workflow.

No encadenar automáticamente múltiples modelos. El objetivo es que el
planificador comprenda los resultados y pueda corregir supuestos, no maximizar
la cantidad de ejecuciones.
