---
title: Gobernanza y procedencia del OKF local
description: Capas CORE y LOCAL, fuentes admitidas, campos protegidos, semántica y autoridad humana.
---

# Gobernanza y procedencia del OKF local

## Capas

- CORE: `.rhs-okf/`, `.baseglobal/` y RAG canónico incluidos con la extensión.
  Son institucionales y de sólo lectura durante `/build-okf`.
- LOCAL: `.okf-local/`, `.docs_corpus/` y `.rhs-rag/`, derivados de las fuentes
  del proyecto.

Si LOCAL no existe, RHS-Agent responde con CORE y RAG canónico. No tratarlo
como error.

## Fuentes

Sólo archivos situados recursivamente bajo `Docs/` y `Data/` pueden originar
conceptos, corpus, ledger o RAG local. Conservar la ruta relativa como
procedencia. No ingerir `Instrucciones/`, `Scripts/`, `Informes/`, `Questions/`
ni directorios derivados u ocultos.

`Instrucciones/Indicaciones.md` restringe cálculos, territorio, unidades,
supuestos y formato de respuestas. Nunca es fuente, concepto, taxonomía o
relación OKF.

## Campos gobernados

La salida determinista de `rhs-okf ingest` manda sobre `document_id`, `type`,
`status`, `source_file`, `sources`, idioma, fechas, estados de ingesta y
revisión, razones de revisión, hashes, perfil de datos, ciclo de vida y
procedencia. El LLM no puede reemplazarlos ni declarar `verified` o
`verified_by` como humano.

No inventar tipos de pack. No cambiar `source_file` para que apunte al PDF o al
Markdown visible: debe señalar el archivo real del corpus bajo `.docs_corpus/`.

## Semántica

Los borradores deterministas son andamiaje. Al interpretar conceptos:

- fundamentar títulos y descripciones en evidencia;
- usar entre tres y seis etiquetas útiles en minúsculas;
- inferir año, país, jurisdicción, tipo normativo, tema y cobertura sólo cuando
  la fuente lo permita;
- expresar relaciones mediante enlaces Markdown y prosa contextual; no añadir
  campos de relación propios;
- marcar incertidumbre y no fabricar hechos;
- no convertir páginas, figuras, logs, capturas, OCR o artefactos técnicos en
  nodos, salvo solicitud explícita.

`rhs-okf` no hace interpretación semántica profunda. El agente que lo envuelve
puede enriquecer conceptos `draft` generados durante la ejecución y sus
`index.md` con mejores títulos, etiquetas, descripciones, jerarquía y enlaces,
siempre con evidencia y sin tocar los campos gobernados. Después debe ejecutar
`rhs-okf verify`; la salida determinista y la trazabilidad siguen teniendo
precedencia.
