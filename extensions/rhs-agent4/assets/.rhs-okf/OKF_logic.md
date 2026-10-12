---
type: DocumentacionTecnica
title: Lógica de Construcción de un OKF Bundle desde un Corpus de Documentos
description: Instrucciones genéricas y accionables para que un agente de IA tome cualquier corpus de PDFs y genere un Knowledge Bundle conforme a la especificación Open Knowledge Format (OKF) v0.1.
tags: [okf, pipeline, metodologia, agent-instructions, knowledge-bundle]
timestamp: 2026-06-30T02:30:00-05:00
---

# Lógica de Construcción de un OKF Bundle desde un Corpus de Documentos

> **Propósito de este documento**: Servir como instrucciones precisas para que un agente de IA (humano o automático) tome un corpus arbitrario de documentos (PDFs u otros) y construya un **Knowledge Bundle** conforme a la especificación [OKF v0.1](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md).
>
> Este documento es **genérico y reutilizable**. No asume ningún dominio específico. Funciona para legal, médico, financiero, técnico, regulatorio o cualquier otro corpus documental.

---

## Prerrequisitos

1. **Corpus de documentos**: Una carpeta con N documentos (PDFs, DOCX, HTML, etc.)
2. **Capacidad de extracción**: Un pipeline que convierta cada documento en texto/estructura legible (ej: `pdfstruct-rust`, `pymupdf`, `apache-tika`, o lectura directa si ya es texto).
3. **Especificación OKF v0.1** (referencia): El agente debe conocer las reglas de conformidad de OKF (se resumen más abajo, pero el source of truth es el SPEC).

### Reglas de conformidad OKF v0.1 (resumen)

Un bundle es conforme si:

- Todo archivo `.md` no reservado tiene un frontmatter YAML válido con al menos `type` (no vacío).
- `index.md` y `log.md` (si existen) siguen la estructura definida por la especificación.
- Los consumidores NO deben rechazar el bundle por: campos opcionales ausentes, tipos desconocidos, claves adicionales en frontmatter, links rotos, o `index.md` faltantes.

**Filenames reservados** (no usar como conceptos):

- `index.md` → listado de directorio (progressive disclosure)
- `log.md` → historial cronológico de cambios

---

## Fase 0: Análisis del Corpus y Modelado del Dominio

### 0.1 Inventario de documentos

El agente debe comenzar por **listar y clasificar** todos los documentos del corpus.

**Acción**: Para cada documento, extraer:

- Nombre del archivo
- Título (si detectable en el documento)
- Organización / autor (si detectable)
- Año / fecha (si detectable)
- Tipo de documento (política, manual, reporte, paper, contrato, regulación, etc.)
- Idioma
- Número de páginas / extensión
- Prioridad o relevancia (Alta / Media / Baja — estimada por el agente)

**Output**: Tabla de inventario en memoria.

### 0.2 Identificación del dominio y tipos de concepto

El agente debe **deducir el dominio** del corpus y definir una **taxonomía de tipos de concepto** apropiada.

**Acción**:

1. Leer los títulos, resúmenes y tabla de contenidos de los documentos.
2. Identificar el dominio principal (ej: salud, legal, financiero, ingeniería, educativo).
3. Definir una lista de **tipos de concepto** que el bundle usará como valores de `type` en frontmatter.

**Criterios para definir tipos**:

- Deben ser **descriptivos y autoexplicativos** (OKF no registra tipos centralmente).
- Deben cubrir las **distintas naturalezas de conocimiento** presentes en el corpus.
- Deben ser **estables** (no cambiar entre documentos del mismo corpus).

**Ejemplo de deducción de tipos** (ilustrativo, no prescriptivo):

| Si el corpus contiene...        | Tipos de concepto sugeridos                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Políticas, planes estratégicos  | `DocumentoFuente`, `Politica`, `ObjetivoEstrategico`, `Hallazgo`, `Recomendacion`    |
| Manuales técnicos, metodologías | `DocumentoFuente`, `Metodologia`, `Definicion`, `Procedimiento`                      |
| Contratos, regulaciones, leyes  | `DocumentoFuente`, `Norma`, `Clausula`, `Obligacion`, `Definicion`                   |
| Papers científicos              | `DocumentoFuente`, `Hallazgo`, `Hipotesis`, `Metodologia`, `ReferenciaBibliografica` |
| Reportes financieros            | `DocumentoFuente`, `Metrica`, `Hallazgo`, `Proyeccion`                               |

> **Importante**: El agente **define** la taxonomía; OKF no la impone. Lo único obligatorio es que `type` sea un string no vacío.

### 0.3 Diseño de la estructura de carpetas

El agente debe diseñar una **jerarquía de carpetas** que organice los conceptos de forma lógica para el dominio.

**Acción**:

1. Identificar **agrupaciones naturales** en el corpus (por tema, por tipo de documento, por entidad emisora, por cronología, etc.).
2. Definir carpetas y subcarpetas.
3. Reservar siempre una carpeta `fuentes/` para los `DocumentoFuente` (1 archivo por documento original).

**Principios de diseño**:

- Una carpeta agrupa conceptos del **mismo tipo o sub-tema**.
- La estructura debe ser **navegable**: un humano debería poder encontrar un concepto sabiendo su tema.
- No anidar más de 3 niveles (OKF lo permite, pero la navegación se degrada).

**Estructura base obligatoria**:

```
bundle_root/
├── index.md              # Frontmatter con okf_version + listado raíz
├── log.md                # Bitácora cronológica
├── fuentes/              # SIEMPRE: 1 DocumentoFuente por documento original
│   └── index.md
├── <tema_1>/             # Carpetas temáticas (agente las define)
│   └── index.md
├── <tema_2>/
│   └── index.md
└── <tema_n>/
    └── index.md
```

---

## Fase 1: Extracción Estructurada por Documento

### 1.1 Por cada documento del corpus

**Acción**: Ejecutar el pipeline de extracción para obtener una representación estructurada.

**Input**: Un documento (PDF, DOCX, HTML, etc.)

**Output esperado por documento** (estructura interna del agente):

```
DocumentoExtraido {
    meta: {
        titulo: String,
        organizacion: String,
        año: int,
        idioma: String,
        tipo_documento: String,    // política, manual, paper, etc.
        num_paginas: int,
    },
    paginas: [
        {
            num: int,
            texto: String,          // contenido legible
            secciones: [             // si detectables
                { titulo: String, nivel: int, texto: String }
            ],
            tablas: [                // si detectables
                { caption: String, filas: int, columnas: int, contenido: String }
            ],
            figuras: [               // si detectables
                { caption: String, tipo: String, descripcion: String }
            ],
        }
    ],
    referencias_internas: [          // "ver Figura 3", "según Tabla 2", "en Sección 4.1"
        { texto_origen: String, pagina_origen: int, objetivo: String }
    ],
    entidades_mencionadas: [        // personas, organizaciones, métricas, leyes, etc.
        { nombre: String, tipo: String, paginas: [int] }
    ],
    bibliografia: [                  // si el documento cita otros trabajos
        { texto_crudo: String, titulo_parseado: String?, año: int?, org: String? }
    ],
}
```

### 1.2 Qué hacer si la extracción es imperfecta

La extracción **nunca será perfecta**. El agente debe:

- Tolerar documentos parcialmente extraídos.
- Marcar incertidumbre (ej: `confidence: low` en metadata interna).
- Priorizar la **calidad de los conceptos curados** sobre la completitud de la extracción cruda.

---

## Fase 2: Destilación de Conceptos (Documento → Conceptos OKF)

### 2.1 Principio fundamental

**Un documento fuente NO se copia tal cual al bundle.** Se **destila** en conceptos atómicos, tipados y enlazados.

- 1 documento → 1 `DocumentoFuente` (siempre, obligatorio)
- 1 documento → N conceptos derivados (0 a muchos, según riqueza del documento)

### 2.2 Paso a paso por documento

**Para cada `DocumentoExtraido`**:

#### Paso 2.2a: Crear el `DocumentoFuente`

Siempre se crea un archivo en `fuentes/` por cada documento original.

```yaml
---
type: DocumentoFuente
title: <Título conciso del documento>
description: <Una línea describiendo qué es y para qué sirve>
year: <YYYY o null si desconocido>
organization: <Entidad emisora>
document_type: <Política | Manual | Reporte | Paper | Contrato | Norma | ...>
tags: [<tag1>, <tag2>, ...]
source_file: <nombre_archivo_original.pdf>
priority: <Alta | Media | Baja>
timestamp: <ISO 8601 datetime>
---

# <Título del documento>

## Información general
- **Título completo**: ...
- **Organización**: ...
- **Año**: ...

## Propósito del documento
<2-3 párrafos describiendo qué hace/establece/analiza el documento>

## Relevancia para el dominio
<Por qué este documento es importante para el conocimiento que se está construyendo>

## Contenido principal
<Lista de los temas principales que aborda el documento>

## Relación con otros documentos del bundle
<Lista de otros DocumentoFuente que se relacionan, si se detectan>
```

#### Paso 2.2b: Identificar conceptos derivados

El agente debe analizar el `DocumentoExtraido` y **decidir qué conceptos atómicos** extraer.

**Preguntas que el agente debe hacerse**:

1. ¿Hay **definiciones o marcos conceptuales** que merezcan su propio concepto? → `ConceptoClave` / `Definicion` / `Metodologia`
2. ¿Hay **políticas o principios rectores**? → `Politica` / `Norma` / `Principio`
3. ¿Hay **objetivos o metas estratégicas**? → `ObjetivoEstrategico` / `Meta`
4. ¿Hay **indicadores o métricas** definidas? → `Indicador` / `Metrica`
5. ¿Hay **recomendaciones accionables**? → `Recomendacion` / `RecomendacionPolitica`
6. ¿Hay **hallazgos o evidencias importantes**? → `Hallazgo`
7. ¿Hay **procedimientos o procesos**? → `Procedimiento` / `Workflow`
8. ¿Hay **referencias a otros documentos** que puedan cruzarse? → `ReferenciaBibliografica`

**Criterio de atomicidad**: Un concepto debe ser **consultable y útil por sí solo**. Si necesita otro concepto para tener sentido, probablemente debe fusionarse o enlazarse explícitamente.

#### Paso 2.2c: Para cada concepto identificado, determinar

| Atributo                    | Decisión                                                                         |
| --------------------------- | -------------------------------------------------------------------------------- |
| **`type`**                  | ¿Qué tipo de concepto es? (de la taxonomía definida en Fase 0.2)                 |
| **`title`**                 | ¿Nombre descriptivo y conciso?                                                   |
| **`description`**           | ¿Resumen de una línea?                                                           |
| **`tags`**                  | ¿Qué etiquetas transversales aplican?                                            |
| **`source_documents`**      | ¿Qué `DocumentoFuente` respalda este concepto? (lista de rutas relativas)        |
| **Carpeta destino**         | ¿En qué carpeta temática debe vivir?                                             |
| **Links a otros conceptos** | ¿Qué otros conceptos del bundle se relacionan?                                   |
| **Páginas fuente**          | ¿En qué páginas del documento original está la evidencia? (incluir en el cuerpo) |

#### Paso 2.2d: Escribir el archivo `.md`

**Plantilla genérica de concepto**:

```yaml
---
type: <TipoDeConcepto>
title: <Título descriptivo>
description: <Resumen de una línea>
tags: [<tag1>, <tag2>, ...]
source_documents:
  - fuentes/<documento_fuente>.md
timestamp: <ISO 8601 datetime>
---

# <Título del concepto>

## <Sección 1: contexto o definición>
<Cuerpo markdown. Usar headings, listas, tablas. Favorer estructura sobre prosa libre.>

## <Sección 2: detalles>
<Incluir detalles específicos del concepto.>

## Trazabilidad
- Documento fuente: [fuentes/<doc>.md](/fuentes/<doc>.md)
- Páginas relevantes: <X-Y>
- Sección origen: "<título de sección del documento original>"
```

**Reglas de escritura del cuerpo**:

- Usar **headings** (`#`, `##`, `###`) para estructura.
- Usar **listas** y **tablas** cuando aplique (más fácil de parsear para agentes).
- Incluir **links markdown** a otros conceptos usando **rutas absolutas bundle-relativas**: `/carpeta/concepto.md`.
- Mantener **trazabilidad** al documento fuente (siempre referenciar `fuentes/*.md` y páginas).
- Evitar copiar texto literal del PDF; **sintetizar y reescribir**.

---

## Fase 3: Scaffolding del Bundle (Estructura + Index Files)

### 3.1 Crear la estructura de carpetas

```
mkdir fuentes/ <tema_1>/ <tema_2>/ ... <tema_n>/
```

### 3.2 Crear `index.md` raíz (con frontmatter)

El `index.md` de la raíz del bundle es el **único** `index.md` que puede tener frontmatter (para declarar `okf_version`).

```yaml
---
type: KnowledgeBundle
title: <Nombre del Bundle - Dominio>
description: <Descripción del bundle: qué contiene, qué propósito tiene>
okf_version: "0.1"
tags: [<tags generales del bundle>]
timestamp: <ISO 8601 datetime>
---

# <Nombre del Bundle>

<Descripción general del bundle: 1-2 párrafos.>

## Propósito
<Para qué sirve este conocimiento.>

## Estructura del bundle

| Carpeta | Contenido |
|---------|-----------|
| `fuentes/` | Entradas DocumentoFuente (un archivo por documento original) |
| `<tema_1>/` | <descripción> |
| `<tema_2>/` | <descripción> |
| ... | ... |

## Tipos de concepto utilizados

- `<Tipo1>` — <cuándo se usa>
- `<Tipo2>` — <cuándo se usa>
- ...

## Cómo usar este bundle

<Instrucciones de consumo para agentes o humanos.>
```

### 3.3 Crear `index.md` por cada carpeta (sin frontmatter)

Cada `index.md` de subcarpeta **no tiene frontmatter** (regla OKF). Solo lista los conceptos de esa carpeta.

```markdown
# <Nombre de la carpeta>

<1 párrafo describiendo qué agrupa esta carpeta.>

## Conceptos en esta carpeta

- [<Título del concepto 1>](<archivo1>.md) - <description del frontmatter>
- [<Título del concepto 2>](<archivo2>.md) - <description del frontmatter>
- [<Título del concepto 3>](<archivo3>.md) - <description del frontmatter>

## Documentos fuente relacionados

- [Documento A](../fuentes/<doc_a>.md) - <descripción>
- [Documento B](../fuentes/<doc_b>.md) - <descripción>
```

**Reglas del `index.md`**:

- Agrupar conceptos bajo headings si hay muchos (>10).
- Incluir la `description` del frontmatter de cada concepto como texto del enlace.
- Si una subcarpeta tiene sub-subcarpetas, enlazarlas como entradas de directorio.
- Los `index.md` pueden ser **generados automáticamente** escaneando el frontmatter de los archivos de la carpeta.

### 3.4 Crear `log.md` (raíz)

```markdown
# Directory Update Log

## <YYYY-MM-DD>

- **Initialization**: Created foundational directory structure.
- **Creation**: Added <N> DocumentoFuente entries from <corpus description>.
- **Creation**: Added <M> derived concepts across <K> thematic folders.

## <YYYY-MM-DD> (entradas futuras)

- **Update**: ...
```

**Reglas del `log.md`**:

- Fechas en formato ISO 8601 (`YYYY-MM-DD`).
- Entradas más recientes **arriba**.
- Palabra inicial en negrita: `**Creation**`, `**Update**`, `**Deprecation**`, `**Initialization**`.
- Es prosa, no frontmatter.

---

## Fase 4: Cross-linking (Tejido de Relaciones)

### 4.1 Identificar enlaces entre conceptos

**Acción**: Después de crear todos los conceptos, el agente debe hacer un **segundo pase** para identificar y crear enlaces cruzados.

**Tipos de relaciones a detectar**:

| Relación                                 | Cómo detectarla                                | Cómo expresarla                                                    |
| ---------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| **Concepto derivado de documento**       | Todo concepto tiene `source_documents`         | Arista implícita en frontmatter                                    |
| **Concepto referencia a otro concepto**  | Mismo tema, se mencionan mutuamente            | Link markdown en el cuerpo: `Ver [concepto](/carpeta/concepto.md)` |
| **Concepto sintetiza varios documentos** | Un concepto tiene múltiples `source_documents` | Lista en frontmatter                                               |
| **Documento cita a otro documento**      | Bibliografía / referencias cruzadas            | Link en el cuerpo del `DocumentoFuente`                            |
| **Entidad compartida entre documentos**  | Misma entidad mencionada en 2+ documentos      | Concepto de entidad + links desde cada documento                   |

### 4.2 Reglas de cross-linking

1. **Rutas absolutas preferidas**: Usar `/carpeta/concepto.md` (bundle-relative), no rutas relativas `../carpeta/concepto.md`. OKF recomienda esta forma por estabilidad.
2. **Links rotos tolerados**: OKF permite links a conceptos que aún no existen (conocimiento pendiente). No es un error.
3. **El contexto del enlace importa**: El texto alrededor del link describe la relación. No hay atributo `rel` en el link; la semántica está en la prosa.
4. **No sobreligar**: Un concepto no necesita enlazar a todos los relacionados. Enlazar solo cuando la relación es **relevante para el razonamiento**.

### 4.3 Ejemplo de cross-link en cuerpo

```markdown
## Relación con otros conceptos

Este indicador forma parte del marco definido en la
[Política X](/politicas/politica_x.md) y se alinea con los
[objetivos estratégicos](/plan_estrategico/objetivos.md) del período.
Su metodología de cálculo sigue las
[Cuentas Nacionales](/conceptos_clave/cuentas_nacionales.md).
```

---

## Fase 5: Validación de Conformidad OKF

Antes de declarar el bundle como **listo**, el agente debe validar:

### 5.1 Checklist de conformidad

- [ ] **Todo `.md` no reservado** tiene frontmatter YAML válido con `type` no vacío.
- [ ] **`index.md`** (raíz) tiene frontmatter con `okf_version: "0.1"` y cuerpo con listado.
- [ ] **`index.md`** (subcarpetas) NO tienen frontmatter; solo listado de conceptos.
- [ ] **`log.md`** tiene formato cronológico con fechas ISO 8601, entradas recientes arriba.
- [ ] **`fuentes/`** contiene 1 `DocumentoFuente` por cada documento original del corpus.
- [ ] **Todo concepto derivado** tiene `source_documents` que apunta a archivos existentes en `fuentes/`.
- [ ] **Links internos** usan rutas absolutas `/carpeta/archivo.md` (preferido) o relativas.
- [ ] **Frontmatter de conceptos** incluye los campos recomendados: `title`, `description`, `tags`, `timestamp`.
- [ ] **No hay archivos reservados** (`index.md`, `log.md`) usados como conceptos.

### 5.2 Validación de calidad (no obligatoria para OKF, sí recomendada)

- [ ] Cada concepto es **consultable por sí solo** (atomicidad).
- [ ] Cada `DocumentoFuente` tiene `description` de una línea útil.
- [ ] Los `index.md` incluyen las `description` de cada concepto como texto del enlace.
- [ ] El `log.md` refleja los cambios realizados en esta sesión.
- [ ] No hay texto literal copiado del PDF sin sintetizar.
- [ ] Los `tags` usan un **vocabulario controlado** (sin sinónimos sueltos).

---

## Fase 6: Mantenimiento y Actualización Incremental

### 6.1 Cuando llega un documento nuevo al corpus

1. **Extraer** el documento nuevo (Fase 1).
2. **Crear `DocumentoFuente`** en `fuentes/` (Fase 2.2a).
3. **Identificar conceptos nuevos** (Fase 2.2b-d).
4. **Revisar conceptos existentes**: ¿el documento nuevo aporta información que **enriquece** un concepto ya existente? Si sí, **editar** ese concepto (añadir `source_documents`, añadir contenido, añadir links).
5. **Cross-linking**: Enlazar el documento nuevo con conceptos existentes (Fase 4).
6. **Actualizar `index.md`** de las carpetas afectadas (añadir entradas nuevas).
7. **Actualizar `log.md`**: Añadir entrada con fecha actual.

### 6.2 Cuando se actualiza un documento existente

1. **Re-extraer** el documento modificado.
2. **Comparar** con la versión anterior (diff a nivel de contenido).
3. **Actualizar** el `DocumentoFuente` correspondiente.
4. **Revisar conceptos derivados**: ¿cambió algo que afecta a un concepto? Si sí, actualizarlo.
5. **Actualizar `log.md`**.

### 6.3 Cuando se elimina un documento

1. **Eliminar** el `DocumentoFuente` de `fuentes/`.
2. **Revisar conceptos derivados**: los que tenían este documento como única fuente deben eliminarse o reasignarse. Los que tenían múltiples fuentes deben actualizarse (quitar la referencia).
3. **Actualizar `index.md`** de carpetas afectadas.
4. **Actualizar `log.md`** con `**Deprecation**`.

---

## Resumen del Flujo Completo

```
Corpus de documentos (PDFs / DOCX / HTML)
        │
        ▼
┌────────────────────────────────┐
│  FASE 0: Análisis y modelado   │
│  - Inventario de documentos    │
│  - Definir tipos de concepto   │
│  - Diseñar estructura carpetas │
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│  FASE 1: Extracción            │
│  - Por cada documento:         │
│    texto, secciones, tablas,   │
│    figuras, refs, entidades,   │
│    bibliografía                │
│  - Output: DocumentoExtraido   │
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│  FASE 2: Destilación           │
│  - 1 DocumentoFuente por doc   │
│  - N conceptos derivados       │
│  - Frontmatter tipado          │
│  - Trazabilidad a fuente       │
│  - Sintetizar (no copiar)      │
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│  FASE 3: Scaffolding           │
│  - Crear carpetas              │
│  - index.md raíz (con FM)      │
│  - index.md por carpeta (s/FM) │
│  - log.md cronológico          │
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│  FASE 4: Cross-linking         │
│  - Segundo pase: enlaces       │
│  - Rutas absolutas /carpeta/   │
│  - Relaciones en la prosa      │
│  - Entidades compartidas       │
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│  FASE 5: Validación            │
│  - Checklist conformidad OKF   │
│  - Checklist calidad           │
│  - Links rotos tolerados       │
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│  FASE 6: Mantenimiento         │
│  - Doc nuevo → Fases 1-4 + log │
│  - Doc actualizado → diff      │
│  - Doc eliminado → deprecation  │
│  - Incremental, no rebuild     │
└────────────────────────────────┘
```

---

## Consideraciones para el Agente de IA

1. **Sintetizar, no copiar**: El valor del OKF bundle está en la **curación**, no en la replicación. Un agente que copia texto literal del PDF no está creando conocimiento; está duplicando datos.

2. **Atomicidad sobre completitud**: Es mejor tener 20 conceptos atómicos y consultables que 3 archivos gigantes con todo. Si un concepto tiene más de 500 palabras, considerar dividirlo.

3. **Trazabilidad siempre**: Todo concepto debe poder responder "¿de dónde sale esto?". `source_documents` + páginas en el cuerpo son obligatorios para que el conocimiento sea auditable.

4. **Links absolutos**: Preferir `/carpeta/archivo.md` sobre `../carpeta/archivo.md`. Es más estable cuando los archivos se mueven dentro de su subdirectorio.

5. **Progressive disclosure**: Los `index.md` existen para que un consumidor (humano o agente) pueda ver qué hay en una carpeta **sin abrir cada archivo**. Mantenerlos actualizados.

6. **Tolerancia a imperfección**: OKF es permisivo por diseño. Links rotos, tipos desconocidos y campos opcionales ausentes NO invalidan el bundle. El agente no debe paralizarse por perfeccionismo.

7. **Vocabulario controlado de tags**: Definir un conjunto de tags al inicio y usarlos consistentemente. Evitar sinónimos sueltos (ej: usar siempre `rrhh` y no mezclar con `recursos-humanos`).

8. **El `type` es libre pero descriptivo**: OKF no registra tipos. El agente los define y debe mantenerlos **estables** dentro del bundle. No inventar nuevos tipos para cada archivo.

---

_Este documento es una metodología genérica para construir Knowledge Bundles OKF desde corpus documentales. No asume dominio, tecnología de extracción, ni infraestructura de consumo. Es ejecutable por cualquier agente de IA con capacidad de lectura, síntesis y escritura._
