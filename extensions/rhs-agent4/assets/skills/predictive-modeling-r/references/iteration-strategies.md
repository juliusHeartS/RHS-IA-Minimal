---
title: Estrategias de iteración y estancamiento
description: Cómo elegir el siguiente experimento, comparar modelos y decidir cuándo detener el desarrollo.
---

# Estrategias de iteración y estancamiento

Después del baseline, proponer una modificación concreta basada en datos:
representación de predictores, interacción, transformación, familia de modelo o
hiperparámetro. Cambiar una cosa por vez para atribuir el efecto.

Cuando el rendimiento se estanque:

- revisar correlaciones y predictores redundantes;
- buscar interacciones justificadas;
- evaluar no linealidad y distribuciones sesgadas;
- inspeccionar errores y outliers con datos de entrenamiento;
- considerar reducción dimensional si existe multicolinealidad;
- probar una familia fundamentalmente distinta;
- detenerse si dos o tres iteraciones no mejoran de manera material.

Sugerir la evaluación final cuando se probaron alternativas razonables o el
usuario considera suficiente el desempeño. Nunca abrir el test por decisión
unilateral.
