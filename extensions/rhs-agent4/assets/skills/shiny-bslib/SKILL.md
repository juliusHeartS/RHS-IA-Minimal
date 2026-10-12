---
name: shiny-bslib
modeSlugs: [code]
policy: implicit
description: Build modern Shiny dashboards and applications with bslib and Bootstrap 5, or modernize legacy Shiny layouts. Use only when the user requests a Shiny app, dashboard or interactive analytical product.
metadata:
    author: Garrick Aden-Buie (@gadenbuie)
    version: "1.1"
    short-description: Construye aplicaciones y tableros Shiny modernos con bslib.
    triggers: [aplicación shiny, dashboard shiny, tablero interactivo, bslib]
license: MIT
---

# Modern Shiny Apps with bslib

Construir aplicaciones Shiny profesionales mediante la sesión R y las
herramientas de Positron. No crear un dashboard sólo porque una tabla o gráfico
podría mostrarse en uno: hacerlo cuando el usuario lo solicite.

## Flujo

1. Confirmar audiencia, decisiones que apoyará, datos, filtros y entregable.
2. Elegir una sola función de página: `page_sidebar()`, `page_navbar()`,
   `page_fillable()` o `page_fluid()`.
3. Cargar las referencias estrictamente necesarias para layout y componentes.
4. Mantener UI, lógica reactiva y acceso a datos con responsabilidades claras.
5. Ejecutar las pruebas separadas (por ejemplo, `test_app.R`) sin intentar
   previsualizarlas como una app.
6. Después de validar, invocar la herramienta `run_shiny_app` con la carpeta de
   la app o `app.R`. Esta herramienta usa la sesión R viva de Positron, espera
   `Listening on http://...` y entrega la URL al Viewer. Nunca pasar
   `test_*.R` a `shiny::runApp()` ni redirigir la salida de la consola.
7. Revisar errores y comprobar comportamiento en ancho normal y estrecho antes
   de entregar.

## Enrutamiento de referencias

- `page-layouts`, `grid-layouts`, `filling`: estructura y dimensiones.
- `cards`, `value-boxes`, `navigation`, `sidebars`: composición del tablero.
- `inputs`, `accordions`, `tooltips-popovers`, `toasts`: interacción.
- `theming`: tema básico; usar `shiny-bslib-theming` para trabajo visual
  avanzado.
- `migration`: modernización de Shiny heredado.
- `best-practices`: revisión integral y errores frecuentes.

## Invariantes

- Preferir layouts bslib sobre `fluidRow()` y `column()` heredados.
- No anidar funciones `page_*()` ni tarjetas dentro de tarjetas.
- Usar `full_screen = TRUE` cuando una visualización se beneficie de expansión.
- Evitar controles o decoraciones sin función analítica.
- Dar nombre accesible a iconos que actúan como controles.
- Mantener gráficos coherentes con el tema mediante `thematic` cuando proceda.
- No publicar ni desplegar la aplicación sin solicitud explícita.
