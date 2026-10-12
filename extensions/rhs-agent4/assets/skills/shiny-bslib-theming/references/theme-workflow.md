---
title: Flujo completo de tematización bslib
description: Presets, colores, tipografías, Sass, gráficos, inspección, accesibilidad y validación visual.
---

# Flujo completo de tematización bslib

1. Empezar con `bs_theme(version = 5)` o un preset cercano al propósito.
2. Definir primero `bg`, `fg` y `primary`.
3. Ajustar `base_font`, `heading_font` y `code_font`, con fallbacks locales.
4. Usar variables Bootstrap antes que CSS específico.
5. Agregar reglas con `bs_add_rules()` sólo cuando las variables no alcancen.
6. Activar `thematic::thematic_shiny(font = "auto")` para que los gráficos
   hereden colores y fuentes.
7. Inspeccionar variables con `bs_get_variables()` y contraste con
   `bs_get_contrast()`.
8. Probar componentes, tablas, gráficos, modales, inputs y navegación en
   escritorio y tamaño estrecho.

Usar `font_collection()` con fuentes alternativas para evitar que una fuente
remota bloquee texto. Para desarrollo pueden usarse `bs_theme_preview()`,
`run_with_themer()` o `bs_themer()`; retirar el editor del servidor antes de
entregar producción.

Preferir una función `app_theme()` en `theme.R` para temas complejos. Verificar
WCAG AA como mínimo: 4.5:1 para texto normal y 3:1 para texto grande.

Para variables Sass/CSS y utilidades cargar `sass-and-css-variables`. Para
modo oscuro y cambio dinámico cargar `dark-mode`.
