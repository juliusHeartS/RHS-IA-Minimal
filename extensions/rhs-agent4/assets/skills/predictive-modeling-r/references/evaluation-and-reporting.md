---
title: Evaluación, comunicación y persistencia
description: Tablas comparables, evaluación final, visualizaciones, serialización y comunicación con el planificador.
---

# Evaluación, comunicación y persistencia

Después de cada modelo mostrar métricas con error estándar, interpretación y
comparación con el baseline o modelo anterior. Al existir dos o más modelos,
mantener una tabla estable y marcar el mejor sin cambiar métricas entre filas.

Tras la evaluación final, comparar validación cruzada y test para el modelo
elegido. Explicar posibles diferencias, incertidumbre, limitaciones y uso
operativo. Preferir gráficos que permitan interpretar ajuste, errores,
residuos, calibración o discriminación.

Ejecutar un modelo por turno. Presentar el resultado, explicar qué cambió y
dejar que el usuario decida el siguiente paso. No imprimir narración con
`cat()` o `print()` dentro del código; describirla fuera. No mostrar objetos
intermedios salvo necesidad diagnóstica.

Si se guarda el modelo, serializar el workflow completo. Usar `bundle` para
modelos con componentes que no sobreviven de forma fiable un ciclo simple de
`saveRDS()` y `readRDS()`.

```r
library(bundle)
final_wf <- extract_workflow(final_fit) |> bundle()
saveRDS(final_wf, "model.rds")
final_wf <- readRDS("model.rds") |> unbundle()
```
