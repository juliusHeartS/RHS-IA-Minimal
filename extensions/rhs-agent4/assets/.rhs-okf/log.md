---
type: Log
title: Historial de actualizaciones del bundle RHS-OKF
description: Registro cronológico de la creación y curación del conocimiento en formato OKF.
---

# Log de Actualizaciones - RHS-OKF

## 2026-07-15

- **Nueva carpeta temática `cuentas_nacionales/`**: añadida para describir los datasets de Cuentas Nacionales del Personal de Salud (NHWA) de la OPS.
- **4 conceptos nuevos**:
    - `ecosistema_datos_nhwa.md` (`ConceptoClave`) — panorama general del marco NHWA y sus datasets disponibles.
    - `catalogo_hss.md` (`BaseDatos`) — catálogo de 20 sistemas de información del HSS/OPS, con metadatos de gobernanza, hosting y variables. Apunta a `data/catalogo_hss.xlsx`.
    - `dataset_module1.md` (`BaseDatos`) — estructura del CSV de stock nacional (40 países, 2017-2024, 12 indicadores, 253 dataelements). Apunta a `data/nhwa_module1.csv`.
    - `dataset_subnacional.md` (`BaseDatos`) — estructura del CSV de stock subnacional (14 países, 266 unidades territoriales, 17 dataelements). Apunta a `data/nhwa_subnational.csv`.
- **Nuevo tipo de concepto `BaseDatos`**: describe datasets estructurados (columnas, cobertura, indicadores) sin vectorizar los datos crudos. El agente usa sus herramientas de código (R/Python) para análisis.
- **Carpeta `data/` creada**: 3 archivos de datos empaquetados como assets ocultos dentro del bundle OKF. Se provisionan al workspace automáticamente con `.rhs-okf/`.
- **Cross-links**: los conceptos nuevos enlazan con conceptos existentes (manual NHWA, indicadores clave, SIRHS, retención rural). El `index.md` raíz actualizado con la nueva carpeta y tipo.
- **Total conceptos**: 97 → 101 (4 nuevos).

## 2026-07-12

- **Documento doc_10 completado**: se extrajo el PDF `doc_10_link_01_9789275324721_spa.pdf` con `pdfstruct-rust` (pipelines meta-doc e hybrid-ocr) y se completó el `DocumentoFuente` _Cómo atraer, captar y retener al personal de salud en zonas rurales, remotas y desatendidas_ (OPS/OMS, 2022). Se incorporó al corpus y a `PAHO_POLICY/Atraer-captar-retener-personal-salud-zonas-rurales.md` con nombre descriptivo, y se actualizó la recomendación de retención rural.

- **Actualización completa del bundle**: cobertura de los 32 documentos del corpus de política/informes como `DocumentoFuente`, con trazabilidad a los nombres descriptivos en `BaseGlobal/PAHO_POLICY`.
- **Perfiles de país**: creados 39 conceptos `PerfilPais` en `perfiles_pais/` a partir de `ProfilesCountries`, más una síntesis comparativa regional (densidad, CUS y gasto de bolsillo).
- **Conceptos derivados**: agregados hallazgos, indicadores, recomendaciones y conceptos clave por tema.
- **Nuevas carpetas temáticas**: `fuerza_trabajo/`, `equipos_interprofesionales/`, `gobernanza_organizacion/`, `cuidado_infancia/`, `vigilancia_salud/`, `cobertura_universal/`, `seguridad_sangre/`, `ent_comercio/`.
- **Trazabilidad corregida**: `source_file` de los `DocumentoFuente` ahora apunta a los nombres originales del corpus.
- **Playbook**: creado `okf.md` con los pasos genéricos + ejemplo real de este bundle.
- **Índices**: regenerados `index.md` por carpeta para progressive disclosure.

## 2026-06-29

- **Creación del bundle**: se inicializó la estructura de directorios según el árbol definido.
- **Archivo creado**: `index.md` (descripción general del bundle).
- **Estado**: estructura base lista; comenzó la curación de documentos fuente.

---

_Actualización del conocimiento curado para RHS-AI._
