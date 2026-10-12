---
title: Flujo tidymodels reproducible
description: División train/test, resamples, métricas, baseline, workflows, tuning y evaluación final.
---

# Flujo tidymodels reproducible

1. Localizar los datos y revisar sólo lo necesario para confirmar limpieza.
2. Dividir inmediatamente en entrenamiento y prueba, con estratificación cuando
   corresponda. Desde entonces explorar y decidir sólo con entrenamiento.
3. Confirmar outcome y predictores. Convertir outcome de clasificación a factor
   y establecer explícitamente modo `regression` o `classification`.
4. Crear una vez los resamples y un `metric_set()` acordado con el usuario.
5. Establecer baseline con `null_model()`.
6. Construir receta, especificación y workflow. Aplicar únicamente
   preprocesamiento motivado por datos o por el modelo.
7. Cambiar una sola decisión por iteración y reutilizar folds y métricas.
8. Introducir tuning únicamente después de encontrar una familia prometedora.
9. Evaluar el test una sola vez, con aprobación explícita, cuando termine el
   desarrollo del modelo.

```r
library(tidymodels)

set.seed(149)
split <- initial_split(df, strata = outcome)
train <- training(split)
test <- testing(split)
folds <- vfold_cv(train, v = 10)
metrics <- metric_set(rmse, rsq)

rec <- recipe(outcome ~ ., data = train)
spec <- linear_reg() |> set_mode("regression")
wf <- workflow() |> add_recipe(rec) |> add_model(spec)
results <- fit_resamples(wf, resamples = folds, metrics = metrics)
collect_metrics(results)
```

No mirar, resumir ni usar `test` durante la iteración. La imputación debe vivir
en la receta. No normalizar modelos de árboles por rutina ni agregar splines,
interacciones o transformaciones sin evidencia. Aplicar transformaciones del
outcome fuera de la receta y recordar que cambian la escala de las métricas.

Para cómputos largos, detectar cores y preguntar al usuario antes de activar
`future::plan(multisession, workers = n)`.
