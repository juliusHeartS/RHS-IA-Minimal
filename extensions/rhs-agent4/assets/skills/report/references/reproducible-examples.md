---
title: Patrones reproducibles de R y Python
description: Ejemplos mínimos de celdas ordenadas y expresiones inline para informes analíticos.
---

# Patrones reproducibles

## R en Quarto

````markdown
```{r}
#| label: load-packages
library(readr)
```

```{r}
#| label: load-data
datos <- read_csv("Data/datos.csv")
```

El conjunto contiene `{r} nrow(datos)` observaciones.

```{r}
#| label: summarize-data
summary(datos)
```
````

## Python en Quarto

````markdown
```{python}
#| label: load-packages
import polars as pl
```

```{python}
#| label: load-data
datos = pl.read_csv("Data/datos.csv")
```
````

Separar carga, transformación, análisis y visualización cuando sean tareas
distintas. No incrustar resultados inventados ni salidas que no provengan de la
ejecución observada.

