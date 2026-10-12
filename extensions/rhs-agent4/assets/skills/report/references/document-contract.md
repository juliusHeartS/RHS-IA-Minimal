---
title: Contrato de documentos reproducibles
description: Reglas de formato, narrativa, celdas, datos y descargo de responsabilidad para QMD y notebooks.
---

# Contrato de documentos reproducibles

## Selección de formato

- Una solicitud Quarto produce `.qmd`.
- Una solicitud Jupyter produce `.ipynb` sin salidas precalculadas; el usuario
  ejecutará el notebook.
- Mantener encabezados jerárquicos y en estilo oración.
- Dejar líneas vacías alrededor de encabezados, celdas y bloques cercados.

## Descargo de responsabilidad

Todo informe debe incluir al inicio una nota que indique que fue generado con IA
bajo dirección humana y que aún no ha recibido revisión humana integral. Debe
incluir una instrucción editorial para sustituir esa frase por el nombre, rol y
fecha de la persona que lo revise y valide.

En Quarto usar un bloque `callout-note`. En Jupyter usar Markdown visible.

## Narrativa y resultados

- No interpretar código cuyo resultado no se haya observado.
- Preferir expresiones inline reproducibles para cifras derivadas, después de
  que el objeto correspondiente haya sido definido.
- No referenciar objetos antes de la celda que los carga o calcula.
- Escribir para planificadores: método suficiente, hallazgos, limitaciones y
  fuentes humanas, sin volcar infraestructura interna.

## Celdas de código

- Llamarlas “celdas de código”.
- Etiquetar cada celda con un nombre breve, descriptivo, único y sin espacios.
- Incluir `load-packages` y `load-data` cerca del inicio.
- Cargar cualquier paquete antes de usar sus funciones.
- Mostrar código por defecto; no ocultar mensajes o advertencias salvo pedido.
- El documento debe ejecutarse en una sesión limpia de R o Python.

