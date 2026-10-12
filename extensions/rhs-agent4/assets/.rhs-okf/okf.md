---
type: DocumentacionTecnica
title: Playbook OKF - Cómo construir un project-okf desde un corpus de documentos
description: Pasos genéricos y replicables para que una IA tome un corpus de documentos y genere un Knowledge Bundle conforme a OKF v0.1, con un ejemplo real tomado del bundle RHS-OKF.
okf_version: "0.1"
tags: [okf, playbook, agent-instructions, knowledge-bundle, metodologia]
timestamp: 2026-07-12T00:00:00-05:00
---

# Playbook OKF: de un corpus de documentos a un `project-okf`

Este documento es un **playbook híbrido**: pasos genéricos reutilizables para cualquier corpus, seguidos del **ejemplo real** del bundle [RHS-OKF](/index.md) sobre recursos humanos para la salud en las Américas.

Es ejecutable por cualquier agente con capacidad de lectura, síntesis y escritura. La especificación fuente es [OKF v0.1](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md).

---

## 0. Lo que es OKF (en una frase)

Un _Knowledge Bundle_ OKF es un árbol de archivos markdown con frontmatter YAML. El único campo obligatorio es `type`. No hay registro de esquemas, ni SDK, ni tipos centrales. El valor está en la **curación** (sintetizar, no copiar), no en el formato.

**Conformidad mínima (SPEC §9):**

1. Todo `.md` no reservado tiene frontmatter YAML parseable.
2. Todo frontmatter tiene un `type` no vacío.
3. `index.md` y `log.md` (si existen) siguen su estructura.

Los consumidores **no** deben rechazar el bundle por: campos opcionales ausentes, tipos desconocidos, claves extra, links rotos o `index.md` faltantes. Esto permite generación incremental e imperfecta.

---

## 1. Pasos genéricos

### Paso 1 — Inventario del corpus

- Listar todos los documentos de entrada (PDF/DOCX/MD/HTML).
- Para cada uno, extraer: nombre de archivo original, título, organización, año, tipo, idioma, páginas y prioridad estimada.
- **Mantener el nombre original como clave de trazabilidad**; el nombre descriptivo se usa solo como `title` y nombre del concepto.
- Output: tabla de inventario en memoria (o un `log.md` inicial).

### Paso 2 — Modelado del dominio y diseño de carpetas

- Leer títulos, resúmenes y tablas de contenido para deducir el dominio.
- Definir una **taxonomía de `type`** estable, descriptiva y que cubra las naturalezas de conocimiento presentes (ej: `DocumentoFuente`, `Hallazgo`, `Indicador`, `Recomendacion`, `ConceptoClave`, `PerfilPais`).
- Diseñar una jerarquía de carpetas navegable (≤3 niveles). Reservar siempre `fuentes/` para los `DocumentoFuente`.
- Definir un **vocabulario controlado de `tags`** y usarlo de forma consistente.

### Paso 3 — Extracción

- Convertir cada documento a texto/estructura legible.
- Identificar secciones, tablas, figuras, entidades, cifras clave y bibliografía.
- Si el documento está corrupto por OCR, **reconstruir el texto de forma coherente** usando el contenido legible + conocimiento del dominio, marcándolo como reconstrucción.

### Paso 4 — Destilación (el paso que crea valor)

- Por cada documento: **1 `DocumentoFuente`** (no copiar el texto; sintetizar propósito, puntos clave, relaciones y trazabilidad).
- Derivar **N conceptos atómicos** (≤500 palabras cada uno) con frontmatter tipado, `tags`, y `source_documents`/páginas.
- Todo concepto debe poder responder: _¿de dónde sale esto?_

### Paso 5 — Scaffolding

- Crear las carpetas.
- `index.md` raíz con frontmatter (`okf_version`) y `index.md` por carpeta (sin frontmatter) para _progressive disclosure_.
- `log.md` cronológico con encabezados de fecha ISO `YYYY-MM-DD`, entradas más recientes primero.

### Paso 6 — Cross-linking

- Segundo pase: enlazar conceptos con **rutas absolutas** `/carpeta/archivo.md` (más estables que las relativas).
- Expresar las relaciones en la prosa que rodea al enlace (OKF no tipa los enlaces).
- Tolerar links rotos: representan conocimiento aún no escrito.

### Paso 7 — Validación y mantenimiento

- Checklist de conformidad: frontmatter parseable + `type` no vacío + `index.md`/`log.md` correctos.
- Verificar links internos y vocabulario de tags.
- Mantenimiento **incremental**: documento nuevo → pasos 1-4 + entrada en `log.md`; documento actualizado → diff; documento eliminado → deprecation.

### Paso 8 — Entrega para consumo (RHS-AI)

- Indexar los `.md` con embeddings locales (RAG).
- RAG **híbrido + grafo de conocimiento**: OKF curado para políticas/relaciones, PDFs originales para datos textuales, ambos para preguntas complejas.
- Los `source_documents` habilitan trazabilidad de cada respuesta.

---

## 2. Ejemplo real: el bundle RHS-OKF

### 2.1 Corpus e insumos

- Documentos de política/informes: carpeta con **32 documentos `.md` con nombre descriptivo** (`BaseGlobal/PAHO_POLICY/<slug>.md`), cada uno con `figures/`. El nombre de archivo es la **clave de trazabilidad**.
- Versión con **nombres descriptivos** (`PAHO_POLICY/*.md`) usada como `title` del concepto y nombre del archivo de concepto.
- Perfiles de país: `ProfilesCountries/` (39 archivos) con tablas HTML de densidad, composición y stock.

Decisión clave: `source_file` apunta al **nombre descriptivo** en `BaseGlobal/PAHO_POLICY/<slug>.md`; el título guía el conocimiento. Así la trazabilidad apunta a archivos que existen.

### 2.2 Taxonomía definida

`DocumentoFuente`, `PerfilPais`, `ObjetivoEstrategico`, `IndicadorRRHH`, `RecomendacionPolitica`, `Hallazgo`, `ConceptoClave`, `DocumentacionTecnica`, `Log`.

### 2.3 Estructura de carpetas

```
rhs-okf/
├── index.md            # raíz (con okf_version)
├── log.md
├── okf.md             # este playbook
├── OKF_logic.md        # metodología genérica (6 fases)
├── indicaciones.md     # guía de integración RAG
├── fuentes/            # 32 DocumentoFuente (uno por documento)
├── perfiles_pais/      # 39 PerfilPais + comparativo_regional
├── plan_estrategico/   enfermeria/   sistemas_informacion_rrhh/
├── migracion_rrhh/     indicadores/  politicas/   conceptos_clave/
├── recomendaciones/   fuerza_trabajo/  equipos_interprofesionales/
├── gobernanza_organizacion/  cuidado_infancia/  vigilancia_salud/
├── cobertura_universal/  seguridad_sangre/  ent_comercio/
```

### 2.4 Cómo se generaron los perfiles de país (destilación programática)

Los 39 perfiles son **similares en estructura** (tabla HTML de indicadores + secciones). En lugar de curarlos a mano, se usó un **parser** que por cada país:

1. Extrae el nombre del país (H1 con `-` o primer H2).
2. Parsea la primera `<table>` (población, gasto de bolsillo, PIB, índice UHC, densidad).
3. Extrae la composición de la fuerza laboral y el stock de profesionales (valor más reciente no `NR`).
4. Escribe un `PerfilPais.md` con frontmatter tipado y un cuerpo de tablas + interpretación.

Luego, con los 39 valores agregados, se generó `comparativo_regional.md` (mín/máx/promedio de densidad, países bajo el umbral ≈44,5/10.000, CUS y gasto de bolsillo).

**Lección:** cuando el corpus tiene muchos documentos con la misma estructura, conviene **destilar programáticamente** y luego curar las excepciones; cuando los documentos son heterogéneos, conviene la curación manual concepto por concepto.

### 2.5 Trazabilidad y enlaces

- Cada `DocumentoFuente` declara `source_file: PAHO_POLICY/<slug-descriptivo>.md`.
- Cada concepto derivado declara `source_documents` apuntando a sus `DocumentoFuente`.
- Los `index.md` por carpeta listan los conceptos con su `title` (progressive disclosure).
- Los enlaces usan rutas absolutas (`/fuentes/...`), y se corrigieron referencias a slugs renombrados.

### 2.6 Cómo se validó

- Conformidad: cada `.md` no reservado tiene frontmatter con `type` no vacío.
- Consistencia: slugs estables, tags de vocabulario controlado, sin duplicados.
- Links: rutas absolutas y revisión de slugs renombrados.

---

## 3. Checklist rápido para el agente

- [ ] Inventario completo con nombre original como clave de trazabilidad.
- [ ] Taxonomía de `type` y vocabulario de `tags` definidos.
- [ ] Estructura de carpetas creada; `fuentes/` reservada.
- [ ] Un `DocumentoFuente` por documento, con `source_file` al nombre original.
- [ ] Conceptos atómicos derivados, con `source_documents` y páginas.
- [ ] `index.md` por carpeta y `log.md` actualizado.
- [ ] Cross-linking con rutas absolutas.
- [ ] Conformidad OKF verificada (frontmatter + `type`).
- [ ] `okf.md` (este playbook) replicado para el nuevo `project-okf`.

---

_Playbook híbrido derivado de la construcción real del bundle RHS-OKF. Genérico y reutilizable para cualquier corpus documental._
