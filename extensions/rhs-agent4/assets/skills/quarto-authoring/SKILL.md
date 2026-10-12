---
name: quarto-authoring
modeSlugs: [code]
policy: implicit
description: Create and edit Quarto documents (.qmd), reports, presentations, websites and books; configure code cells, figures, tables, citations, cross-references, layouts and extensions; or migrate R Markdown-family projects to Quarto. Do not use for editing an R Markdown file unless the user requests conversion to Quarto.
metadata:
    author: Mickaël Canouil (@mcanouil)
    version: "1.2"
    short-description: Crea y edita documentos, informes y presentaciones Quarto.
    triggers: [quarto, editar qmd, formato quarto, presentación quarto, referencias cruzadas, renderizar quarto]
license: MIT
---

# Quarto Authoring

Crear o editar `.qmd` con estructura válida y salida reproducible. Respetar el
formato pedido por el usuario; no convertir a otro formato por iniciativa
propia.

## Flujo

1. Confirmar tipo de producto: documento, informe, presentación, sitio o libro.
2. Revisar archivos Quarto existentes y su `_quarto.yml` antes de crear otra
   configuración.
3. Cargar únicamente la referencia que corresponda a la tarea.
4. Escribir YAML, contenido y celdas con etiquetas estables.
5. Renderizar con Quarto cuando el usuario pida un entregable renderizado y
   corregir errores reales de render.

## Enrutamiento de referencias

- `yaml-front-matter`: metadatos y opciones de formato.
- `code-cells`: ejecución, visibilidad y opciones de celdas.
- `figures`, `tables`, `cross-references`: salidas numeradas y referencias.
- `citations`: bibliografía y citas.
- `layout`, `divs-and-spans`, `callouts`, `conditional-content`: composición.
- `diagrams`, `shortcodes`, `extensions`: capacidades específicas.
- `conversion-rmarkdown`, `conversion-bookdown`, `conversion-blogdown`,
  `conversion-xaringan`, `conversion-distill`: migraciones.
- `markdown-linting`: revisión de Markdown.

No cargar todas las referencias. Para una solicitud que combine, por ejemplo,
una tabla y referencias cruzadas, cargar sólo `tables` y `cross-references`.

## Invariantes

- Usar sintaxis Quarto, no opciones heredadas incompatibles de R Markdown.
- Mantener identificadores únicos y descriptivos para figuras, tablas y celdas.
- No inventar citas ni entradas bibliográficas.
- No sustituir datos, resultados o cálculos por ejemplos de relleno.
- Conservar rutas relativas y estructura del proyecto existente.
