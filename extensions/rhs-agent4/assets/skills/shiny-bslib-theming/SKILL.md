---
name: shiny-bslib-theming
modeSlugs: [code]
policy: implicit
description: Customize Shiny applications with bslib and Bootstrap 5 themes, colors, typography, brand.yml, Sass/CSS variables, dark mode, dynamic theme switching and plot theming. Use when the user explicitly requests visual theming or refinement of a Shiny product.
metadata:
    author: Garrick Aden-Buie (@gadenbuie)
    version: "1.1"
    short-description: Diseña temas profesionales para Shiny y bslib.
    triggers: [tema shiny, colores bslib, tipografía shiny, modo oscuro]
license: MIT
---

# Theming Shiny Apps with bslib

Mejorar la apariencia de una aplicación Shiny existente o en construcción sin
cambiar su lógica analítica.

## Decisión

- Para tema completo, tipografía, gráficos y accesibilidad, cargar
  `theme-workflow`.
- Para variables Bootstrap, Sass, propiedades CSS y utilidades, cargar
  `sass-and-css-variables`.
- Para modo oscuro, `data-bs-theme` o cambio dinámico, cargar `dark-mode`.

No cargar las tres referencias salvo que la tarea realmente abarque los tres
temas.

## Reglas

1. Empezar con `bs_theme(version = 5)` o un preset cercano al propósito.
2. Preferir variables de tema a CSS específico para conservar consistencia.
3. Usar `_brand.yml` existente cuando represente la identidad solicitada; no
   inventar una marca institucional.
4. Mantener contraste, legibilidad, foco, estados de error y adaptación móvil.
5. Sincronizar gráficos R con `thematic` cuando ayude.
6. Validar la aplicación completa, no sólo una captura del tema.

No descargar fuentes, cambiar dependencias ni introducir servicios externos
sin necesidad y autorización. No convertir el tema en una paleta de un solo
color ni sacrificar lectura por decoración.
