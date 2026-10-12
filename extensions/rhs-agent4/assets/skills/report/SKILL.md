---
name: report
modeSlugs: [code]
policy: implicit
description: Create or extend reproducible Quarto reports and Jupyter notebooks from the current analysis. Use when the user asks for an informe, reporte, QMD, notebook, or wants a response added to an existing analytical document.
license: MIT
metadata:
  author: RHS-Agent (adaptado de Posit vía Capibara)
  version: "1.1"
  short-description: Convierte análisis y respuestas en informes reproducibles.
  triggers: [crear informe, generar informe, generar informe qmd, generar reporte, añadir a qmd, exportar conversación, crear notebook]
---

# Informes reproducibles

Crear un archivo real en el workspace, no pegar un documento largo en el chat.
Usar `.qmd` para Quarto y `.ipynb` para Jupyter. El destino predeterminado es
`Informes/`, pero el usuario puede elegir otra carpeta dentro del proyecto.

## Contrato

1. Confirmar si se crea un archivo nuevo o se añade a uno existente.
2. Verificar cómo el documento cargará todos los datos. Si dependen únicamente
   de objetos vivos de una sesión R/Python, preguntar cómo deben reconstruirse.
3. Proponer un esquema breve y obtener conformidad antes de escribir un informe
   completo, salvo que el usuario haya definido ya la estructura.
4. Usar `write_to_file` para crear o actualizar el artefacto.
5. Informar el nombre y la ruta humana del entregable.
6. Citar fuentes con nombres exactos de documentos y datasets, sin rutas
   absolutas ni nombres de infraestructura interna (`.okf-local`, `.rhs-rag`,
   `lancedb`, conceptos o chunks). Si hace falta describirla, escribir "base
   documental del proyecto" o "indice de busqueda local".

Nunca interpretar resultados de código que no se hayan ejecutado. Los informes
deben poder correr en una sesión limpia: cargan paquetes y datos antes de
usarlos, mantienen etiquetas únicas y preservan el lenguaje solicitado por el
usuario.

## Referencias

- Cargar `document-contract` antes de escribir la estructura, narrativa, celdas
  o descargo de responsabilidad.
- Cargar `reproducible-examples` solo cuando se necesite una plantilla concreta
  de R, Python, Quarto o Jupyter.
- Para características avanzadas de Quarto, invocar `quarto-authoring` y cargar
  únicamente su referencia pertinente.
